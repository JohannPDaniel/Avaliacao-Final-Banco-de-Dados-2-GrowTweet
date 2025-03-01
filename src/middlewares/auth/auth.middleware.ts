import { NextFunction, Request, Response } from 'express';
import { JWT } from "../../utils/jwt";
import { prisma } from "../../database/prisma.database";

export class AuthMiddleware {
	public static async validate(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const authorization = req.headers.authorization;

		if (!authorization) {
			res.status(401).json({
				success: false,
				message: 'Token não fornecido!',
			});
			return;
		}

		const parts = authorization.split(' ');

		if (parts.length !== 2 || parts[0] !== 'Bearer') {
			res.status(401).json({
				success: false,
				message: 'Formato do token inválido! Use (Bearer <token>).',
			});
			return;
		}

		const token = parts[1];

		if (!token) {
			res.status(401).json({
				success: false,
				message: 'Token inválido!',
			});
			return;
		}

		const revokedToken = await prisma.revokedToken.findUnique({
			where: { token },
		});

		if (revokedToken) {
			res.status(401).json({
				success: false,
				message: 'Token inválido! Faça login novamente.',
			});
			return;
		}

		const jwt = new JWT();
		const userDecode = jwt.verifyToken(token);

		if (!userDecode) {
			res.status(401).json({
				success: false,
				message: 'Usuário não autenticado!',
			});
			return;
		}

		req.authUser = {
			id: userDecode.id,
			name: userDecode.name,
			username: userDecode.username,
		};

		next();
	}
}
