import { TypeTweet } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { regexUuid } from '../../types/uuid.types';

export class CreateReplyMiddleware {
	public static validateRequired(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { content, type } = req.body;

		if (!content) {
			res.status(400).json({
				success: false,
				message: 'O atributo conteúdo é obrigatório !',
			});
			return;
		}

		if (!type) {
			res.status(400).json({
				success: false,
				message: 'O atributo type é obrigatório !',
			});
			return;
		}

		next();
	}

	public static validateTypes(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { content, type } = req.body;

		if (typeof content !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo conteúdo deve vir em formato de texto !',
			});
			return;
		}

		if (typeof type !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo type deve vir em formato de texto !',
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
		const { content, type, userId, tweetId } = req.body;

		if (content.length < 5) {
			res.status(400).json({
				success: false,
				message: 'O atributo conteúdo deve ter pelo menos 5 caracteres !',
			});
			return;
		}

		if (type !== TypeTweet.Reply) {
			res.status(400).json({
				success: false,
				message: 'O atributo type deve ser do tipo (Reply) !',
			});
			return;
		}

		if (userId && (typeof userId !== 'string' || !regexUuid.test(userId))) {
			res.status(400).json({
				success: false,
				message: 'Identificador precisa ser um UUID válido!',
			});
			return;
		}

		if (tweetId && (typeof tweetId !== 'string' || !regexUuid.test(tweetId))) {
			res.status(400).json({
				success: false,
				message: 'Identificador tweetId precisa ser um UUID válido!',
			});
			return;
		}

		next();
	}
}
