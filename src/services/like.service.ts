import { prisma } from '../database/prisma.database';
import { ResponseApi } from '../types';
import { CreateLikeDto, LikeDto } from '../dtos';
import { Like as LikePrisma, User as UserPrisma } from "@prisma/client";

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

		// Verifica se o tweet existe no banco de dados
		const tweetExist = await prisma.tweet.findUnique({
			where: { id: tweetId },
			select: { userId: true }, // Busca apenas o userId relacionado ao tweet
		});

		if (!tweetExist) {
			return {
				success: false,
				code: 404,
				message: 'Tweet não encontrado!',
			};
		}

		// Verifica se o Like já existe
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

		// Cria o Like no banco de dados
		const createLike = await prisma.like.create({
			data: {
				userId,
				tweetId,
			},
			include: {
				user: true, // Inclui os dados do usuário no retorno
			},
		});

		return {
			success: true,
			code: 201,
			message: 'Like criado com sucesso!',
			data: this.mapToDto(createLike), // Mapeia os dados para o DTO
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
			createdAt: like.createdAt,
		};
	}
}
