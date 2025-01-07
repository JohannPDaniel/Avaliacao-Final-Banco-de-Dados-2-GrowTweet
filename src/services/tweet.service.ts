import { prisma } from '../database/prisma.database';
import { CreateTweetDto, TweetDto } from '../dtos/tweet.dto';
import {
	TypeTweet,
	Tweet as TweetPrisma,
	Like as LikePrisma,
	Reply as ReplyPrisma,
	User as UserPrisma,
} from '@prisma/client';
import { ResponseApi } from '../types';

export class TweetService {
	public async create(createTweetDto: CreateTweetDto): Promise<ResponseApi> {
		const { content, type, userId, tokenUser } = createTweetDto;

		if (userId !== tokenUser.id) {
			return {
				success: false,
				code: 403,
				message: 'Acesso negado: você não tem permissão para criar um tweet.',
			};
		}

		const userExist = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!userExist) {
			return {
				success: false,
				code: 404,
				message: 'Usuário não encontrado!',
			};
		}

		const createTweet = await prisma.tweet.create({
			data: {
				content,
				type,
				userId,
			},
		});

		return {
			success: true,
			code: 201,
			message: 'Tweet criado com sucesso !',
			data: this.mapToDto(createTweet),
		};
	}

	public async findAll(
		tokenUser: string,
		type?: TypeTweet
	): Promise<ResponseApi> {
		const tweets = await prisma.tweet.findMany({
			where: {
				...(type ? { type } : {}),
			},
			include: {
				Like: {
					include: {
						user: true, // Inclui os dados do usuário associado a cada like
					},
				},
			},
		});

		const tweetsWithLikes = tweets.map((tweet) => ({
			...tweet,
			likedByCurrentUser: tweet.Like.some((like) => like.userId === tokenUser),
			likeCount: tweet.Like.length,
		}));

		return {
			success: true,
			code: 200,
			message: 'Tweets buscados com sucesso!',
			data: tweetsWithLikes.map((tweet) => this.mapToDto(tweet)),
		};
	}

	public async findOneById(
		id: string,
		tokenUser: { id: string; name: string; username: string }
	): Promise<ResponseApi> {
		const tweet = await prisma.tweet.findUnique({
			where: { id, userId: tokenUser.id },
			include: {
				Like: { include: { user: true } },
				Reply: { include: { user: true } },
			},
		});

		if (!tweet) {
			return {
				success: false,
				code: 404,
				message:
					'Acesso negado: você não tem permissão para acessar este tweet !',
			};
		}

		return {
			success: true,
			code: 200,
			message: 'Tweets buscados pelo ID com sucesso!',
			data: this.mapToDto(tweet),
		};
	}

	public async update(
		id: string,
		tokenUserId: string,
		content?: string
	): Promise<ResponseApi> {
		const tweetFound = await prisma.tweet.findFirst({
			where: { id, userId: tokenUserId },
		});

		if (!tweetFound) {
			return {
				success: false,
				code: 403,
				message:
					'Acesso negado: você não tem permissão para atualizar este tweet.',
			};
		}

		const updateTweet = await prisma.tweet.update({
			where: { id },
			data: { content },
		});

		return {
			success: true,
			code: 200,
			message: 'Tweet atualizado com sucesso!',
			data: this.mapToDto(updateTweet),
		};
	}

	public async remove(
		tweetId: string,
		tokenUser: string
	): Promise<ResponseApi> {
		const tweetFound = await prisma.tweet.findFirst({
			where: {
				id: tweetId,
				userId: tokenUser,
			},
		});

		if (!tweetFound) {
			return {
				success: false,
				code: 403,
				message:
					'Acesso negado: você não tem permissão para deletar este tweet.',
			};
		}

		const tweetDeleted = await prisma.tweet.delete({
			where: {
				id: tweetId,
			},
		});

		return {
			success: true,
			code: 200,
			message: 'Tweet deletado com sucesso!',
			data: this.mapToDto(tweetDeleted),
		};
	}

	private mapToDto(
		tweet: TweetPrisma & {
			Like?: (LikePrisma & { user: UserPrisma })[];
			Reply?: (ReplyPrisma & { user: UserPrisma })[];
			likedByCurrentUser?: boolean; // Adicionado
			likeCount?: number; // Adicionado
		}
	): TweetDto {
		return {
			id: tweet.id,
			content: tweet.content,
			type: tweet.type,
			userId: tweet.userId,
			createdAt: tweet.createdAt,
			likeCount: tweet.likeCount ?? 0, // Usa o campo adicional ou um valor padrão
			likedByCurrentUser: tweet.likedByCurrentUser ?? false, // Usa o campo adicional ou um valor padrão
			like: tweet.Like?.map((like) => ({
				id: like.id,
				userId: like.userId,
				tweetId: like.tweetId,
				createdAt: like.createdAt,
			})),
			reply: tweet.Reply?.map((reply) => ({
				id: reply.id,
				content: reply.content,
				type: reply.type,
				userId: reply.userId,
				tweetId: reply.tweetId,
				createdAt: reply.createdAt,
			})),
		};
	}
}
