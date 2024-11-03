import { NextFunction, Request, Response } from 'express';
import { TypeTweetEnum } from '../../types';

export class FindAllReplyMiddleware {
	public static validateTypes(req: Request, res: Response, next: NextFunction) {
		const { type } = req.query;

		const isValidType =
			type && Object.values(TypeTweetEnum).includes(type as TypeTweetEnum);

		if (!isValidType && type) {
			res.status(400).json({
				success: false,
				message: `Tipo inválido fornecido: ${type}. Os tipos válidos são ${Object.values(
					TypeTweetEnum
				).join(', ')}.`,
			});
			return;
		}
		next();
	}
}
