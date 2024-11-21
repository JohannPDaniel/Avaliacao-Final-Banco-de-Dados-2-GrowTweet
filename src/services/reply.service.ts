import { Reply as ReplyPrisma, TypeTweet } from '@prisma/client';
import { prisma } from '../database/prisma.database';
import { CreateReplyDto, ReplyDto } from '../dtos/reply.dto';
import { ResponseApi } from '../types';

export class ReplyService {
	public async create(
		tokenUser: string,
		createReplyDto: CreateReplyDto
	): Promise<ResponseApi> {
		const { content, type, userId, tweetId } = createReplyDto;

		if (tokenUser !== userId) {
			return {
				success: false,
				code: 403,
				message:
					'Acesso negado: você não tem permissão para responder em nome de outro usuário.',
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

		const createReply = await prisma.reply.create({
			data: {
				content,
				type,
				userId,
				tweetId,
			},
		});

		return {
			success: true,
			code: 201,
			message: 'Reply criado com sucesso!',
			data: this.mapToDto(createReply),
		};
	}

	public async findAll(
		tokenUser: string,
		type: TypeTweet
	): Promise<ResponseApi> {
		const replies = await prisma.reply.findMany({
			where: {
				...(type ? { type: { equals: type } } : {}),
				userId: tokenUser,
			},
		});

		return {
			success: true,
			code: 200,
			message: 'Replies buscados com sucesso !',
			data: replies.map((reply) => this.mapToDto(reply)),
		};
	}

	public async findOneById(
		tokenUser: string,
		id: string
	): Promise<ResponseApi> {

		const reply = await prisma.reply.findFirst({
			where: { id, userId: tokenUser },
		});

		if (!reply) {
			return {
				success: false,
				code: 404,
				message:
					'Reply a ser buscado não encontrado ou não pertence ao usuário autenticado!',
			};
		}

		return {
			success: true,
			code: 200,
			message: 'Reply buscada pelo id com sucesso!',
			data: this.mapToDto(reply),
		};
	}

	public async update(id: string, tokenUser: string, content?: string): Promise<ResponseApi> {
		const replyFound = await prisma.reply.findUnique({
			where: { id, userId: tokenUser },
		});

		if (!replyFound) {
			return {
				success: false,
				code: 404,
				message:
					'Reply a ser atualizado não encontrado ou não pertence ao usuário autenticado!',
			};
		}

		const updateReply = await prisma.reply.update({
			where: { id },
			data: { content },
		});

		return {
			success: true,
			code: 200,
			message: 'Reply atualizado com sucesso !',
			data: this.mapToDto(updateReply),
		};
	}

	public async remove(tokenUser: string, id: string): Promise<ResponseApi> {
		const replyFound = await prisma.reply.findFirst({
			where: { id, userId: tokenUser },
		});

		if (!replyFound) {
			return {
				success: false,
				code: 404,
				message:
					'Reply a ser deletada não encontrada ou não pertence ao usuário autenticado!',
			};
		}

		const replyDeleted = await prisma.reply.delete({
			where: { id },
		});

		return {
			success: true,
			code: 200,
			message: 'Reply deletado com sucesso !',
			data: this.mapToDto(replyDeleted),
		};
	}

	private mapToDto(reply: ReplyPrisma): ReplyDto {
		return {
			id: reply.id,
			content: reply.content,
			type: reply.type,
			userId: reply.userId,
			tweetId: reply.tweetId,
			createdAt: reply.createdAt
		};
	}
}
