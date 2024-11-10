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
		const tweet = await prisma.tweet.findFirst({
			where: { id, userId }, // Verifica se o tweet pertence ao usuário
			include: {
				Like: { include: { user: true } },
				Reply: { include: { user: true } },
			},
		});

		if (!tweet) {
			return {
				success: false,
				code: 403,
				message:
					'Acesso negado: você não tem permissão para acessar este tweet.',
			};
		}

		return {
			success: true,
			code: 200,
			message: 'Tweet buscado pelo id com sucesso!',
			data: this.mapToDto(tweet),
		};
	}

	public async update(
		id: string,
		userId: string,
		content?: string
	): Promise<ResponseApi> {
		// Busca o tweet, garantindo que ele pertença ao userId autenticado
		const tweetFound = await prisma.tweet.findFirst({
			where: { id, userId }, // Verificação de propriedade embutida
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
	public async remove(id: string, userId: string): Promise<ResponseApi> {
		// Busca o tweet, garantindo que ele pertence ao userId autenticado
		const tweetFound = await prisma.tweet.findFirst({
			where: { id, userId },
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
			where: { id },
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
		}
	): TweetDto {
		return {
			id: tweet.id,
			content: tweet.content,
			type: tweet.type,
			userId: tweet.userId,
			createdAt: tweet.createdAt,
			like: tweet.Like?.map((like) => ({
				userId: like.userId,
				tweetId: like.tweetId,
				createdAt: like.createdAt,
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
				createdAt: reply.createdAt,
				user: {
					name: reply.user.name,
					username: reply.user.username,
					email: reply.user.email,
				},
			})),
		};
	}
}
