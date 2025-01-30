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
				message: 'Token não autenticado!',
			});
			return;
		}

		const token = authorization.split(' ')[1];

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

		// Decodifica o token
		const jwt = new JWT();
		const studentDecode = jwt.verifyToken(token);

		if (!studentDecode) {
			res.status(401).json({
				success: false,
				message: 'Estudante não autenticado!',
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
