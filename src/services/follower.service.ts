import { Follower } from '@prisma/client';
import { prisma } from '../database/prisma.database';
import { CreateFollowerDto, FollowerDto } from '../dtos';
import { ResponseApi } from '../types';

export class FollowerService {
	public async create(
		createFollowerDto: CreateFollowerDto
	): Promise<ResponseApi> {
		const { userId, followerId } = createFollowerDto;

		if (userId === followerId) {
			return {
				success: false,
				code: 400,
				message: 'Você não pode seguir a si mesmo!',
			};
		}

		const [userExist, followerExist] = await Promise.all([
			prisma.user.findUnique({ where: { id: userId } }),
			prisma.user.findUnique({ where: { id: followerId } }),
		]);

		if (!userExist) {
			return {
				success: false,
				code: 404,
				message: 'Usuário a ser seguido não encontrado!',
			};
		}

		if (!followerExist) {
			return {
				success: false,
				code: 404,
				message: 'Usuário seguidor não encontrado!',
			};
		}

		const existingFollower = await prisma.follower.findFirst({
			where: {
				userId: userId,
				followerId: followerId,
			},
		});

		if (existingFollower) {
			return {
				success: false,
				code: 409,
				message: 'Usuário já está seguindo este usuário!',
			};
		}

		const createFollower = await prisma.follower.create({
			data: {
				userId,
				followerId,
			},
		});

		return {
			success: true,
			code: 201,
			message: 'Seguidor criado com sucesso!',
			data: this.mapToDto(createFollower),
		};
	}

	public async remove(id: string): Promise<ResponseApi> {
		const followerFound = await prisma.follower.findUnique({
			where: { id },
		});

		if (!followerFound) {
			return {
				success: false,
				code: 404,
				message: 'Seguidor a ser deletado não encontrado !',
			};
		}

		const followerDeleted = await prisma.follower.delete({
			where: { id },
		});

		return {
			success: true,
			code: 200,
			message: 'Seguidor deletado com sucesso !',
			data: this.mapToDto(followerDeleted),
		};
	}

	private mapToDto(follower: Follower): FollowerDto {
		return {
			id: follower.id,
			userId: follower.userId,
			followerId: follower.followerId,
		};
	}
}
