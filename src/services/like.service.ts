import { prisma } from '../database/prisma.database';
import { ResponseApi } from '../types';
import { CreateLikeDto, LikeDto } from '../dtos';
import { Like as LikePrisma, User as UserPrisma } from "@prisma/client";

export class LikeService {
	public async create(
		authUserId: string,
		createLikeDto: CreateLikeDto
	): Promise<ResponseApi> {
		const { userId, tweetId } = createLikeDto;

		if (authUserId !== userId) {
			return {
				success: false,
				code: 403,
				message:
					'Acesso negado: você não tem permissão para curtir este tweet em nome de outro usuário.',
			};
		}

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

		const existingLike = await prisma.like.findFirst({
			where: {
				userId,
				tweetId,
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
			include: {
				user: true,
			},
		});

		return {
			success: true,
			code: 201,
			message: 'Like criado com sucesso!',
			data: this.mapToDto(createLike),
		};
	}

	public async remove(authUserId: string, id: string): Promise<ResponseApi> {
		const likeFound = await prisma.like.findFirst({
			where: { id, userId: authUserId }, 
		});

		if (!likeFound) {
			return {
				success: false,
				code: 404,
				message:
					'Like a ser deletado não encontrado ou não pertence ao usuário autenticado!',
			};
		}

		const likeDeleted = await prisma.like.delete({
			where: { id },
		});

		return {
			success: true,
			code: 200,
			message: 'Like deletado com sucesso!',
			data: this.mapToDto(likeDeleted),
		};
	}

	private mapToDto(like: LikePrisma): LikeDto {
		return {
			id: like.id,
			userId: like.userId,
			tweetId: like.tweetId,
			createdAt: like.createdAt
		};
	}
}
