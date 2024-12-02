import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';

export class AuthMiddleware {
	public static async validate(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const token = req.headers.authorization;

		if (!token) {
			res.status(401).json({
				success: false,
				message: 'Token não autenticado !',
			});
			return;
		}

		const service = new AuthService();
		const isValidUsers = await service.validateToken(token);

		if (!isValidUsers) {
			res.status(401).json({
				success: false,
				message: 'Serviço não autenticado !',
			});
			return;
		}

		req.body.tokenUser = {
			id: isValidUsers.id,
			name: isValidUsers.name,
			username: isValidUsers.username,
		};

		next();
	}
}
