import { Request, Response } from 'express';
import { CreateFollowerDto } from '../dtos';
import { FollowerService } from '../services/follower.service';

export class FollowerController {
	public static async create(req: Request, res: Response): Promise<void> {
		try {
			const { userId, followerId } = req.body;
			const { authUserId } = req.body as {
				authUserId: { id: string; name: string };
			};

			const data: CreateFollowerDto = {
				userId,
				followerId,
			};

			const service = new FollowerService();
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

			const service = new FollowerService();
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
