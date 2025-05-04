import { TypeTweet } from '@prisma/client';
import { ResponseApi } from '../types';
import { prisma } from '../database/prisma.database';

export class FeedService {
	public async findAll(
		tokenUser: string,
		type: TypeTweet
	): Promise<ResponseApi> {
		// 1. Buscar o usuário logado
		const user = await prisma.user.findUnique({
			where: { id: tokenUser },
			select: { name: true, username: true },
		});

		if (!user) {
			return {
				success: false,
				code: 404,
				message: 'Usuário não encontrado.',
				data: [],
			};
		}

		// 2. Buscar quem ele segue
		const following = await prisma.follower.findMany({
			where: { userId: tokenUser },
			select: { followerId: true },
		});

		const followedIds = following.map((f) => f.followerId);

		// 3. Buscar todos os tweets que podem ser relevantes
		const allTweets = await prisma.tweet.findMany({
			where: {
				type,
				OR: [
					{ userId: tokenUser }, // próprios tweets
					{
						content: {
							contains: user.name.split(' ')[0],
							mode: 'insensitive',
						},
					},
					{
						content: {
							contains: `@${user.username}`,
							mode: 'insensitive',
						},
					},
					{ userId: { in: followedIds } }, // tweets de pessoas seguidas
				],
			},
			orderBy: { createdAt: 'desc' },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						username: true,
					},
				},
				Like: true,
				Reply: true,
			},
		});

		// 4. Buscar todos os usuários do sistema
		const allUsers = await prisma.user.findMany({
			select: { id: true, name: true, username: true },
		});

		// 5. Filtrar os tweets de seguidos que mencionam outra pessoa
		const filteredTweets = allTweets.filter((tweet) => {
			const isFromFollowed = followedIds.includes(tweet.userId);
			const isOwnTweet = tweet.userId === tokenUser;

			// Se for próprio tweet ou tweet que menciona o usuário → mantém
			if (
				isOwnTweet ||
				tweet.content
					.toLowerCase()
					.includes(user.name.split(' ')[0].toLowerCase()) ||
				tweet.content.toLowerCase().includes(`@${user.username.toLowerCase()}`)
			) {
				return true;
			}

			// Se for de pessoa seguida e mencionar outra pessoa → remover
			if (isFromFollowed) {
				return !allUsers.some((otherUser) => {
					if (otherUser.id === tokenUser) return false; // ignora menções ao próprio usuário
					const firstName = otherUser.name.split(' ')[0].toLowerCase();
					return (
						tweet.content
							.toLowerCase()
							.includes(`@${otherUser.username.toLowerCase()}`) ||
						tweet.content.toLowerCase().includes(firstName)
					);
				});
			}

			return false;
		});

		return {
			success: true,
			code: 200,
			message: `Feed de ${user.name.split(" ")[0]} buscado com sucesso!`,
			data: filteredTweets,
		};
	}
}
