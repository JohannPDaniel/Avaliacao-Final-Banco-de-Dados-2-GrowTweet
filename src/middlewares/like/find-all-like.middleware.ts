import { NextFunction, Request, Response } from 'express';
import { TypeTweetEnum } from '../../types';

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
}
