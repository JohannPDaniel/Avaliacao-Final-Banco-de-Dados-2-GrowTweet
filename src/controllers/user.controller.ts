import { Request, response, Response } from 'express';
import { CreateUserDto } from '../dtos/user.dto';
import { prisma } from '../database/prisma.database';
import { UserService } from '../services/user.service';

export class UserController {
	public static async create(req: Request, res: Response): Promise<void> {
		try {
			const { name, email, username, password } = req.body;

			const data: CreateUserDto = {
				name,
				email,
				username,
				password,
			};

			const service = new UserService();
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
			const { email } = req.query;

			const service = new UserService();
			const result = await service.findAll(email as string);

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

			const service = new UserService();
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
	public static async update(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const { name, username, password } = req.body;

			const service = new UserService();
			const result = await service.update(id, { name, username, password });

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

			const service = new UserService();
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