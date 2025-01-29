import { NextFunction, Request, Response } from 'express';

export class UpdateTweetMiddleware {
	public static validateTypes(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { content } = req.body;

		if (content && typeof content !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo conteúdo deve vir em formato de texto !',
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

		if (content && content.length < 5) {
			res.status(400).json({
				success: false,
				message: 'O atributo conteúdo deve ter pelo menos 5 caracteres !',
			});
			return;
		}

		next();
	}
}
