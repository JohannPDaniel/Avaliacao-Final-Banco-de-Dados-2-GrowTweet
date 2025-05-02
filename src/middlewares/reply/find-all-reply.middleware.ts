import { NextFunction, Request, Response } from 'express';
import { TypeTweetEnum } from '../../types';

export class FindAllReplyMiddleware {
	public static validateTypes(req: Request, res: Response, next: NextFunction) {
		const { type } = req.query;

		const isValidType = !type || type === TypeTweetEnum.Reply;

		if (!isValidType) {
			res.status(400).json({
				success: false,
				message: `Tipo inválido fornecido: ${type}. Apenas o tipo '${TypeTweetEnum.Reply}' é permitido.`,
			});
			return;
		}
		next();
	}
}
