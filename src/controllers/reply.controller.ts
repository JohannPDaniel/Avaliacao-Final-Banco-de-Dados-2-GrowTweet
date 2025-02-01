import { TypeTweet } from '@prisma/client';
import { Request, Response } from 'express';
import { CreateReplyDto } from '../dtos';
import { ReplyService } from '../services/reply.service';

export class ReplyController {
	public static async create(req: Request, res: Response): Promise<void> {
		try {
			const { content, type, userId } = req.body;
			const tweetId = req.headers["x-tweet-id"] as string
			const tokenUser = req.authUser;

			const data: CreateReplyDto = {
				content,
				type,
				userId: userId ? userId : tokenUser.id,
				tweetId,
			};

			const service = new ReplyService();
			const result = await service.create(tokenUser.id, data);

			const { code, ...response } = result;

			res.status(code).json(response);
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: `Erro no servidor: ${error.message}`,
			});
		}
	}

	public static async findAll(req: Request, res: Response): Promise<void> {
		try {
			const type = req.query.type as string;
			const tokenUser = req.authUser;

			const service = new ReplyService();
			const result = await service.findAll(tokenUser.id, type as TypeTweet);

			const { code, ...response } = result;
			res.status(code).json(response);
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: `Erro no servidor: ${error.message}`,
			});
		}
	}

	public static async findOneById(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const tokenUser = req.authUser;

			const service = new ReplyService();
			const result = await service.findOneById(tokenUser.id, id);

			const { code, ...response } = result;

			res.status(code).json(response);
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: `Erro no servidor: ${error.message}`,
			});
		}
	}
	public static async update(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const { content } = req.body;
			const tokenUser = req.authUser;

			const service = new ReplyService();
			const result = await service.update(id, tokenUser.id, content);

			const { code, ...response } = result;
			res.status(code).json(response);
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: `Erro no servidor: ${error.message}`,
			});
		}
	}
	public static async remove(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const tokenUser = req.authUser;

			const service = new ReplyService();
			const result = await service.remove(tokenUser.id, id);

			const { code, ...response } = result;

			res.status(code).json(response);
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: `Erro no servidor: ${error.message}`,
			});
		}
	}
}
