import { prisma } from '../database/prisma.database';
import { ResponseApi } from '../types';
import { CreateLikeDto, LikeDto } from '../dtos';
import { Like as LikePrisma } from '@prisma/client';

export class LikeService {
	public async create(
		tokenUser: string,
		createLikeDto: CreateLikeDto
	): Promise<ResponseApi> {
		const { userId, tweetId } = createLikeDto;

		if (tokenUser !== userId) {
			return {
				success: false,
				code: 403,
				message:
					'Acesso negado: você não tem permissão para curtir este tweet em nome de outro usuário.',
			};
		}

		const userExist = await prisma.user.findUnique({ where: { id: userId } });

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
				message: 'Like já existe. Use a função de descurtir para remover.',
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
			data: this.mapToDto(createLike, { liked: true, likeCount }),
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

		const transactionResult = await prisma.$transaction([
			prisma.like.delete({ where: { id } }),
			prisma.like.count({ where: { tweetId: likeFound.tweetId } }),
		]);

		if (!Array.isArray(transactionResult) || transactionResult.length < 2) {
			return {
				success: false,
				code: 500,
				message: 'Erro ao processar a remoção do like!',
			};
		}

		const [likeDeleted, likeCount] = transactionResult;

		if (typeof likeCount !== 'number' || isNaN(likeCount)) {
			return {
				success: false,
				code: 500,
				message: 'Erro ao contar os likes restantes!',
			};
		}

		return {
			success: true,
			code: 200,
			message: 'Like deletado com sucesso!',
			data: this.mapToDto(likeDeleted, { liked: false, likeCount }),
		};
	}
	private mapToDto(
		like: LikePrisma,
		additionalData: { liked?: boolean; likeCount?: number } = {}
	): LikeDto {
		return {
			id: like.id,
			userId: like.userId,
			tweetId: like.tweetId,
			createdAt: like.createdAt,
			liked: additionalData.liked ?? false,
			likeCount: additionalData.likeCount ?? 0,
		};
	}
}
