import { NextFunction, Request, Response } from 'express';
import { regexUuid } from '../../types';

export class FindAllFollowerMiddleware {
	public static validateTypes(req: Request, res: Response, next: NextFunction) {
		const { userId, followerId } = req.query;

		if (userId && typeof userId !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo userId deve vir em formato de texto !',
			});
		}

		if (followerId && typeof followerId !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo followerId deve vir em formato de texto !',
			});
		}

		next();
	}
	public static validateData(req: Request, res: Response, next: NextFunction) {
		const { userId, followerId } = req.query;

		if (userId && !regexUuid.test(userId as string)) {
			res.status(400).json({
				success: false,
				message: 'O atributo userId deve ser um UUID !',
			});
			return;
		}

		if (followerId && !regexUuid.test(followerId as string)) {
			res.status(400).json({
				success: false,
				message: 'O atributo followerId deve ser um UUID !',
			});
			return;
		}

		next();
	}
}
