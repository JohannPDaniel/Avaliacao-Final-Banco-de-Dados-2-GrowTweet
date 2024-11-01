import { TypeTweet } from "@prisma/client";
import { NextFunction, Request, Response } from 'express';

export class UpdateTweetMiddleware {
	public static validateTypes(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { content, type } = req.body;

		if (content && typeof content !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo conteúdo deve vir em formato de texto !',
			});
			return;
		}

		if (type && typeof type !== 'string') {
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
		const { content, type } = req.body;

		if (content && content.length < 5) {
			res.status(400).json({
				success: false,
				message: 'O atributo conteúdo deve ter pelo menos 5 caracteres !',
			});
			return;
		}

		if (type && type !== TypeTweet.Tweet) {
			res.status(400).json({
				success: false,
				message: 'O atributo type deve ser do tipo (Tweet) !',
			});
			return;
		}

		next();
	}
}
