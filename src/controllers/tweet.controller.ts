import { TypeTweet } from '@prisma/client';
import { Request, Response } from 'express';
import { CreateTweetDto } from '../dtos';
import { TweetService } from '../services/tweet.service';

export class TweetController {
	public static async create(req: Request, res: Response): Promise<void> {
		try {
			const { content, type, userId } = req.body;
			const { user } = req.body as {
				user: { id: string; name: string };
			};

			const data: CreateTweetDto = {
				content,
				type,
				userId,
			};

			const service = new TweetService();
			const result = await service.create(user.id, data);

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
			const { user } = req.body as {
				user: { id: string; name: string };
			};

			const service = new TweetService();
			const result = await service.findAll(
				user.id as string,
				type as TypeTweet
			);

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
			const { user } = req.body as {
				user: { id: string; name: string };
			};

			const service = new TweetService();
			const result = await service.findOneById(id, user.id);

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

			const service = new TweetService();
			const result = await service.update(id, content);

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

			const service = new TweetService();
			const result = await service.remove(id);

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
