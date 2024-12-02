import { TypeTweet } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { regexUuid } from "../../types";

export class UpdateTweetMiddleware {
	public static validateTypes(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { content } = req.body;
		const userId = req.headers['x-user-id'];

		if (content && typeof content !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo conteúdo deve vir em formato de texto !',
			});
			return;
		}

		if (!userId) {
			res.status(400).json({
				success: false,
				message: 'O atributo userId é obrigatório !',
			});
			return;
		}

		next();
	}
	public static validateData(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { content } = req.body;
		const userId = req.headers['x-user-id'] as string;

		if (content && content.length < 5) {
			res.status(400).json({
				success: false,
				message: 'O atributo conteúdo deve ter pelo menos 5 caracteres !',
			});
			return;
		}

		if (!regexUuid.test(userId)) {
			res.status(400).json({
				success: false,
				message: 'Identificador precisa ser um UUID !',
			});
			return;
		}

		next();
	}
}
