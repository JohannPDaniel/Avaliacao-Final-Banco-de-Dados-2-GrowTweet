import { prisma } from '../database/prisma.database';
import { ResponseApi } from '../types';
import { CreateLikeDto, LikeDto, QueryLikeDto } from '../dtos';
import { Like as LikePrisma } from "@prisma/client";

export class LikeService {
	public async create(createLikeDto: CreateLikeDto): Promise<ResponseApi> {
		const { userId, tweetId } = createLikeDto;

		const userExist = await prisma.user.findUnique({
			where: { id: userId },
		});

		const tweetExist = await prisma.tweet.findUnique({
			where: { id: tweetId },
			select: { userId: true }, 
		});

		if (!userExist) {
			return {
				success: false,
				code: 404,
				message: 'Usuário não encontrado!',
			};
		}

		if (!tweetExist) {
			return {
				success: false,
				code: 404,
				message: 'Tweet não encontrado!',
			};
		}

		if (tweetExist.userId === userId) {
			return {
				success: false,
				code: 400,
				message: 'Você não pode curtir o próprio tweet!',
			};
		}

		const existingLike = await prisma.like.findFirst({
			where: {
				userId: userId,
				tweetId: tweetId,
			},
		});

		if (existingLike) {
			return {
				success: false,
				code: 409,
				message: 'Usuário já curtiu este tweet!',
			};
		}

		const createLike = await prisma.like.create({
			data: {
				userId,
				tweetId,
			},
		});

		return {
			success: true,
			code: 201,
			message: 'Like criado com sucesso!',
			data: this.mapToDto(createLike),
		};
	}

	public async findAll(query: QueryLikeDto): Promise<ResponseApi> {
		const { userId, tweetId } = query;

		const likes = await prisma.like.findMany({
			where: {
				...(userId ? { userId: { equals: userId } } : {}),
				...(tweetId ? { tweetId: { equals: tweetId } } : {}),
			},
		});

		return {
			success: true,
			code: 200,
			message: 'Likes buscados com sucesso !',
			data: likes.map((like) => this.mapToDto(like)),
		};
	}

	public async findOneById(id: string): Promise<ResponseApi> {
		const likeId = await prisma.like.findUnique({
			where: { id },
		});

		if (!likeId) {
			return {
				success: false,
				code: 404,
				message: 'Likes a serem buscados não encontrados !',
			};
		}

		return {
			success: true,
			code: 200,
			message: 'Likes buscados pelo id com sucesso !',
			data: this.mapToDto(likeId),
		};
	}
	public async remove(id: string): Promise<ResponseApi> {
		const likeFound = await prisma.like.findUnique({
			where: { id },
		});

		if (!likeFound) {
			return {
				success: false,
				code: 404,
				message: 'Like a ser deletado não encontrado !',
			};
		}

		const likeDeleted = await prisma.like.delete({
			where: { id },
		});

		return {
			success: true,
			code: 200,
			message: 'Like deletado com sucesso !',
			data: this.mapToDto(likeDeleted),
		};
	}

	private mapToDto(like: LikePrisma): LikeDto {
		return {
			id: like.id,
			userId: like.userId,
			tweetId: like.tweetId,
		};
	}
}
