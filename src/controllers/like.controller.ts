import { Request, Response } from 'express';
import { CreateLikeDto } from '../dtos';
import { LikeService } from '../services/like.service';

export class LikeController {
	public static async create(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.body;
			const tweetId = req.headers['x-tweet-id'] as string;

			const tokenUser = req.authUser;

			const data: CreateLikeDto = {
				userId: userId ? userId : tokenUser.id,
				tweetId,
			};

			const service = new LikeService();
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

	public static async remove(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const tokenUser = req.authUser;

			const service = new LikeService();
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
