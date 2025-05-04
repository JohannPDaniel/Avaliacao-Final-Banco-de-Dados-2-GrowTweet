import { TypeTweet } from '@prisma/client';
import { Request, Response } from 'express';
import { FeedService } from '../services';

export class FeedController {
	public static async findAll(req: Request, res: Response): Promise<void> {
		try {
			const type = req.query.type as string;

			const tokenUser = req.authUser;

			const service = new FeedService();
			const result = await service.findAll(
				tokenUser.id as string,
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
}
