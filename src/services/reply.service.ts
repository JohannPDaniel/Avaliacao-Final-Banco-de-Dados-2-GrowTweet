import { Reply as ReplyPrisma, TypeTweet } from '@prisma/client';
import { prisma } from '../database/prisma.database';
import { CreateReplyDto, ReplyDto } from '../dtos/reply.dto';
import { ResponseApi } from '../types';

export class ReplyService {
	public async create(createReplyDto: CreateReplyDto): Promise<ResponseApi> {
		const { content, type, userId, tweetId } = createReplyDto;

		const userExist = await prisma.user.findUnique({
			where: { id: userId },
		});

		const tweetExist = await prisma.tweet.findUnique({
			where: { id: tweetId },
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
			message: 'Reply criado com sucesso !',
			data: this.mapToDto(createReply),
		};
	}

	public async findAll(type: TypeTweet): Promise<ResponseApi> {
		const replies = await prisma.reply.findMany({
			where: {
				...(type ? { type: { equals: type } } : {}),
			},
		});

		return {
			success: true,
			code: 200,
			message: 'Replies buscados com sucesso !',
			data: replies.map((reply) => this.mapToDto(reply)),
		};
	}

	public async findOneById(id: string): Promise<ResponseApi> {
		const replyId = await prisma.reply.findUnique({
			where: { id },
		});

		if (!replyId) {
			return {
				success: false,
				code: 404,
				message: 'Reply a ser buscado não encontrado !',
			};
		}

		return {
			success: true,
			code: 200,
			message: 'Reply buscado pelo id com sucesso !',
			data: this.mapToDto(replyId),
		};
	}

	public async update(id: string, content?: string): Promise<ResponseApi> {
		const replyFound = await prisma.reply.findUnique({
			where: { id },
		});

		if (!replyFound) {
			return {
				success: false,
				code: 404,
				message: 'Reply a ser atualizado não encontrado !',
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

	public async remove(id: string): Promise<ResponseApi> {

		const replyFound = await prisma.reply.findUnique({
			where: { id },
		});

		if (!replyFound) {
			return {
				success: false,
				code: 404,
				message: 'Reply a ser deletado não encontrado !',
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
		};
	}
}
