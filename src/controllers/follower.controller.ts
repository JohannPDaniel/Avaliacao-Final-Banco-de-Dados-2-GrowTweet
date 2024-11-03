import { Request, Response } from 'express';
import { CreateFollowerDto } from "../dtos";
import { FollowerService } from "../services/follower.service";

export class FollowerController {
	public static async create(req: Request, res: Response): Promise<void> {
		try {
			const { userId, followerId } = req.body;

			const data: CreateFollowerDto = {
				userId,
				followerId,
			};

			const service = new FollowerService();
			const result = await service.create(data);

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
			const { userId, followerId } = req.query;

			const service = new FollowerService();
			const result = await service.findAll({
				userId: userId as string,
				followerId: followerId as string,
			});

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

			const service = new FollowerService();
			const result = await service.findOneById(id);

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

			const service = new FollowerService();
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
