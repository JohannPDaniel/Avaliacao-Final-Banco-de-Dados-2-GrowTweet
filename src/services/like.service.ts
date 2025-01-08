import { prisma } from '../database/prisma.database';
import { ResponseApi } from '../types';
import { CreateLikeDto, LikeDto } from '../dtos';
import { Like as LikePrisma, User as UserPrisma } from '@prisma/client';

export class LikeService {
	public async create(
		tokenUser: string,
		createLikeDto: CreateLikeDto
	): Promise<ResponseApi> {
		const { userId, tweetId } = createLikeDto;

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

		const tweetExist = await prisma.tweet.findUnique({
			where: { id: tweetId },
		});

		if (!tweetExist) {
			return {
				success: false,
				code: 404,
				message: 'Tweet não encontrado!',
			};
		}

		const createLike = await prisma.like.create({
			data: {
				userId,
				tweetId,
			},
		});

		const likeCount = await prisma.like.count({
			where: { tweetId },
		});

		return {
			success: true,
			code: 201,
			message: 'Like criado com sucesso!',
			data: this.mapToDto(createLike, true, likeCount),
		};
	}

	public async remove(tokenUser: string, id: string): Promise<ResponseApi> {
		const likeFound = await prisma.like.findFirst({
			where: { id, userId: tokenUser },
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

		const likeCount = await prisma.like.count({
			where: { tweetId: likeDeleted.tweetId },
		});

		return {
			success: true,
			code: 200,
			message: 'Like deletado com sucesso!',
			data: this.mapToDto(likeDeleted, false, likeCount),
		};
	}

	private mapToDto(
		like: LikePrisma,
		liked?: boolean,
		likeCount?: number
	): LikeDto {
		return {
			id: like.id,
			userId: like.userId,
			tweetId: like.tweetId,
			createdAt: like.createdAt,
			liked: liked ?? false,
			likeCount: likeCount ?? 0,
		};
	}
}
