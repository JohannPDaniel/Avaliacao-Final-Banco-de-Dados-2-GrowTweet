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
	public async create(
		id: string,
		createTweetDto: CreateTweetDto
	): Promise<ResponseApi> {
		const { content, type, userId } = createTweetDto;

		if (id !== userId) {
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

	public async findAll(id: string, type: TypeTweet): Promise<ResponseApi> {
		const tweets = await prisma.tweet.findMany({
			where: {
				...(type ? { type: { equals: type } } : {}),
				userId: id,
			},
		});

		return {
			success: true,
			code: 200,
			message: 'Tweets buscados com sucesso !',
			data: tweets.map((tweet) => this.mapToDto(tweet)),
		};
	}

	public async findOneById(id: string, userId: string): Promise<ResponseApi> {

		if (id !== userId) {
			return {
				success: false,
				code: 403,
				message:
					'Acesso negado: você não tem permissão para acessar os tweets deste usuario.',
			};
		}
		const tweetId = await prisma.tweet.findUnique({
			where: { id },
			include: {
				Like: {
					include: {
						user: true,
					},
				},
				Reply: {
					include: {
						user: true,
					},
				},
			},
		});

		if (!tweetId) {
			return {
				success: false,
				code: 404,
				message: 'Tweet a ser buscado não encontrado !',
			};
		}

		return {
			success: true,
			code: 200,
			message: 'Tweet buscado pelo id com sucesso !',
			data: this.mapToDto(tweetId),
		};
	}

	public async update(id: string, content?: string): Promise<ResponseApi> {
		const tweetFound = await prisma.tweet.findUnique({
			where: { id },
		});

		if (!tweetFound) {
			return {
				success: false,
				code: 404,
				message: 'Tweet a ser atualizado não encontrado !',
			};
		}

		const updateTweet = await prisma.tweet.update({
			where: { id },
			data: { content },
		});

		return {
			success: true,
			code: 200,
			message: 'Tweet atualizado com sucesso !',
			data: this.mapToDto(updateTweet),
		};
	}
	public async remove(id: string): Promise<ResponseApi> {
		const tweetFound = await prisma.tweet.findUnique({
			where: { id },
		});

		if (!tweetFound) {
			return {
				success: false,
				code: 404,
				message: 'Tweet a ser deletado não encontrado !',
			};
		}

		const tweetDeleted = await prisma.tweet.delete({
			where: { id },
		});

		return {
			success: true,
			code: 200,
			message: 'Tweet deletado com sucesso !',
			data: this.mapToDto(tweetDeleted),
		};
	}

	private mapToDto(
		tweet: TweetPrisma & {
			Like?: (LikePrisma & { user: UserPrisma })[];
			Reply?: (ReplyPrisma & { user: UserPrisma })[];
		}
	): TweetDto {
		return {
			id: tweet.id,
			content: tweet.content,
			type: tweet.type,
			userId: tweet.userId,
			like: tweet.Like?.map((like) => ({
				userId: like.userId,
				tweetId: like.tweetId,
				user: {
					name: like.user.name,
					username: like.user.username,
					email: like.user.email,
				},
			})),
			reply: tweet.Reply?.map((reply) => ({
				content: reply.content,
				type: reply.type,
				userId: reply.userId,
				tweetId: reply.tweetId,
				user: {
					name: reply.user.name,
					username: reply.user.username,
					email: reply.user.email,
				},
			})),
		};
	}
}
