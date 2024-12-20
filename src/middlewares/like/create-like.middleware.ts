import { NextFunction, Request, Response } from 'express';
import { regexUuid } from "../../types";

export class CreateLikeMiddleware {
	public static validateRequired(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const userId = req.headers['x-user-id'];
		const tweetId = req.headers['x-tweet-id'];

		if (!userId) {
			res.status(400).json({
				success: false,
				message: 'O atributo userId é obrigatório !',
			});
			return;
		}

		if (!tweetId) {
			res.status(400).json({
				success: false,
				message: 'O atributo tweetId é obrigatório !',
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
		const userId = req.headers['x-user-id'];
		const tweetId = req.headers['x-tweet-id'];

		if (typeof userId !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo userId deve vir em formato de texto !',
			});
			return;
		}

		if (typeof tweetId !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo tweetId deve vir em formato de texto !',
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
		const userId = req.headers['x-user-id'] as string;
		const tweetId = req.headers['x-tweet-id'] as string;

		if (!regexUuid.test(userId)) {
			res.status(400).json({
				success: false,
				message: 'Identificador do userId precisa ser um UUID !',
			});
			return;
		}

		if (!regexUuid.test(tweetId)) {
			res.status(400).json({
				success: false,
				message: 'Identificador do tweetId precisa ser um UUID !',
			});
			return;
		}

		next();
	}
}
