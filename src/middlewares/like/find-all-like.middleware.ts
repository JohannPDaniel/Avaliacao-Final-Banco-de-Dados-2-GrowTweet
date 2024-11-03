import { NextFunction, Request, Response } from 'express';
import { regexUuid } from '../../types';

export class FindAllLikeMiddleware {
	public static validateTypes(req: Request, res: Response, next: NextFunction) {
		const { userId, tweetId } = req.query;

		if (userId && typeof userId !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo userId deve vir em formato de texto !',
			});
		}

		if (tweetId && typeof tweetId !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo tweetId deve vir em formato de texto !',
			});
		}

		next();
	}
	public static validateData(req: Request, res: Response, next: NextFunction) {
		const { userId, tweetId } = req.query;

		if (userId && !regexUuid.test(userId as string)) {
			res.status(400).json({
				success: false,
				message: 'O atributo userId deve ser um UUID !',
			});
			return;
		}

		if (tweetId && !regexUuid.test(tweetId as string)) {
			res.status(400).json({
				success: false,
				message: 'O atributo tweetId deve ser um UUID !',
			});
			return;
		}

		next();
	}
}
