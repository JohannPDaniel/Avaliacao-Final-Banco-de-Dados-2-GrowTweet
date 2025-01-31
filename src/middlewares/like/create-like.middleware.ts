import { NextFunction, Request, Response } from 'express';
import { regexUuid } from '../../types/uuid.types';

export class CreateLikeMiddleware {
	public static validateRequired(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const tweetId = req.headers['x-tweet-id'];

		if (!tweetId) {
			res.status(400).json({
				success: false,
				message: 'TweetId é obrigatório',
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
		const { userId } = req.body;
		const tweetId = req.headers['x-tweet-id'];

		if (userId && (typeof userId !== 'string' || !regexUuid.test(userId))) {
			res.status(400).json({
				success: false,
				message: 'Identificador precisa ser um UUID !',
			});
			return;
		}

		if (typeof tweetId !== 'string' || !regexUuid.test(tweetId)) {
			res.status(400).json({
				success: false,
				message: 'Identificador tweetId precisa ser um UUID !',
			});
			return;
		}

		next();
	}
}
