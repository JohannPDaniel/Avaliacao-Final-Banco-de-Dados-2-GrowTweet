import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
	public static async login(req: Request, res: Response): Promise<void> {
		try {
			const { email, password } = req.body;
			const service = new AuthService();
			const result = await service.login({ email, password });

			const { code, ...response } = result;
			res.status(code).json(response);
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: `Erro no servidor: ${error.message}`,
			});
		}
	}

	public static async logout(req: Request, res: Response): Promise<void> {
		try {
			const token = req.headers.authorization?.split(' ')[1] as string;

			const service = new AuthService();
			const result = await service.logout(token);

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
