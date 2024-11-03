import { prisma } from '../database/prisma.database';
import { CreateTweetDto, TweetDto, UpdateTweetDto } from '../dtos/tweet.dto';
import { TypeTweet, Tweet as TweetPrisma } from '@prisma/client';
import { ResponseApi } from '../types';

export class TweetService {
	public async create(createTweetDto: CreateTweetDto): Promise<ResponseApi> {
		const { content, type, userId } = createTweetDto;

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
			message: 'Usuário criado com sucesso !',
			data: this.mapToDto(createTweet),
		};
	}

	public async findAll(type: TypeTweet): Promise<ResponseApi> {
		const tweets = await prisma.tweet.findMany({
			where: {
				...(type ? { type: { equals: type } } : {}),
			},
		});

		return {
			success: true,
			code: 200,
			message: 'Tweets buscados com sucesso !',
			data: tweets.map((tweet) => this.mapToDto(tweet)),
		};
	}

	public async findOneById(id: string): Promise<ResponseApi> {
		const tweetId = await prisma.tweet.findUnique({
			where: { id },
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
	
	public async update(
		id: string,
		updateTweetDto: UpdateTweetDto
	): Promise<ResponseApi> {
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
			data: { ...updateTweetDto },
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

	private mapToDto(tweet: TweetPrisma): TweetDto {
		return {
			id: tweet.id,
			content: tweet.content,
			type: tweet.type,
			userId: tweet.userId,
		};
	}
}
