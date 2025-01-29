import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';
import { JWT } from "../../utils/jwt";

export class AuthMiddleware {
	public static async validate(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const authorizathion = req.headers.authorization;

		if (!authorizathion) {
			res.status(401).json({
				success: false,
				message: 'Token não autenticado !',
			});
			return;
		}

		const token = authorizathion.split(' ')[1];

		const jwt = new JWT();
		const studentDecode = jwt.verifyToken(token);

		if (!studentDecode) {
			res.status(401).json({
				success: false,
				message: 'Estudante não autenticado !',
			});
			return;
		}

		req.authUser = {
			id: studentDecode.id,
			name: studentDecode.name,
			username: studentDecode.username,
		};

		next();
	}
}
