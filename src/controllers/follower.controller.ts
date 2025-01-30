import { Request, Response } from 'express';
import { CreateFollowerDto } from '../dtos';
import { FollowerService } from '../services/follower.service';

export class FollowerController {
	public static async create(req: Request, res: Response): Promise<void> {
		try {
			const { userId, followerId } = req.body;
			const tokenUser = req.authUser;

			const data: CreateFollowerDto = {
				userId: userId ? userId : tokenUser.id,
				followerId: followerId ?? undefined,
			};

			const service = new FollowerService();
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
			const { tokenUser } = req.body as {
				tokenUser: { id: string; name: string };
			};

			const service = new FollowerService();
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
