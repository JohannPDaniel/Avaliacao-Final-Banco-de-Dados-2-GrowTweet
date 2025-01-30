import { NextFunction, Request, Response } from 'express';
import { regexUuid } from '../../types/uuid.types';

export class CreateFollowerMiddleware {
	public static validateData(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { userId, followerId } = req.body;

		if (userId && (typeof userId !== 'string' || !regexUuid.test(userId))) {
			res.status(400).json({
				success: false,
				message: 'Identificador do userId precisa ser um UUID !',
			});
			return;
		}

		if (
			followerId &&
			(typeof followerId !== 'string' ||
			!regexUuid.test(followerId))
		) {
			res.status(400).json({
				success: false,
				message: 'Identificador do followerId precisa ser um UUID !',
			});
			return;
		}

		next();
	}
}
