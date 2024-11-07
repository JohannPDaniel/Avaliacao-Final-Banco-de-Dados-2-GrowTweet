import { Request, response, Response } from 'express';
import { CreateLikeDto } from '../dtos';
import { LikeService } from '../services/like.service';

export class LikeController {
	public static async create(req: Request, res: Response): Promise<void> {
		try {
			const { userId, tweetId } = req.body;
			const { authUserId } = req.body as {
				authUserId: { id: string; name: string };
			};

			const data: CreateLikeDto = {
				userId,
				tweetId,
			};

			const service = new LikeService();
			const result = await service.create(authUserId.id, data);

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
			const { authUserId } = req.body as {
				authUserId: { id: string; name: string };
			};

			const service = new LikeService();
			const result = await service.remove(authUserId.id, id);

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
