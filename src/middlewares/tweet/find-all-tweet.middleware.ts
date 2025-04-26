import { NextFunction, Request, Response } from 'express';
import { TypeTweetEnum } from '../../types';

export class FindAllTweetMiddleware {
	public static validateTypes(req: Request, res: Response, next: NextFunction) {
		const { type } = req.query;

		const isValidType = !type || type === TypeTweetEnum.Tweet;

		if (!isValidType) {
			res.status(400).json({
				success: false,
				message: `Tipo inválido fornecido: ${type}. Apenas o tipo '${TypeTweetEnum.Tweet}' é permitido.`,
			});
			return;
		}
		next();
	}
}
