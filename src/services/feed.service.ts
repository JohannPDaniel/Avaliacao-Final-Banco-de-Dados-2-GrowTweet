import { TypeTweet } from '@prisma/client';
import { ResponseApi } from '../types';
import { prisma } from '../database/prisma.database';

export class FeedService {
	public async findAll(
		tokenUser: string,
		type: TypeTweet
	): Promise<ResponseApi> {
		// Busca o usuário com nome e username
		const user = await prisma.user.findUnique({
			where: { id: tokenUser },
			select: { name: true, username: true },
		});

		if (!user) {
			return {
				success: false,
				code: 404,
				message: 'Usuário não encontrado',
				data: [],
			};
		}

		// Busca as pessoas que ele segue
		const following = await prisma.follower.findMany({
			where: { userId: tokenUser },
			select: { followerId: true },
		});

		const followedIds = following.map((f) => f.followerId);

		const tweets = await prisma.tweet.findMany({
			where: {
				AND: [
					{ type },
					{
						OR: [
							// 1. Tweets do próprio usuário
							{ userId: tokenUser },

							// 2. Tweets que mencionam o usuário (nome ou username)
							{
								OR: [
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
								],
							},

							// 3. Tweets de pessoas que ele segue, mas que NÃO mencionam ninguém
							{
								AND: [
									{ userId: { in: followedIds } },
									{
										NOT: {
											OR: [
												{
													content: {
														contains: '@',
														mode: 'insensitive',
													},
												},
												{
													content: {
														contains: 'Olá',
														mode: 'insensitive',
													},
												},
											],
										},
									},
								],
							},
						],
					},
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

		return {
			success: true,
			code: 200,
			message: `Tweets de ${
				user.name.split(' ')[0]
			} relacionados ao usuário buscados com sucesso!`,
			data: tweets,
		};
	}
}
