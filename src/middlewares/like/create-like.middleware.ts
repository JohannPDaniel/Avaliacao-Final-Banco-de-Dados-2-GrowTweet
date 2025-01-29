import { NextFunction, Request, Response } from 'express';
import { regexUuid } from "../../types/uuid.types";

export class CreateLikeMiddleware {
	public static validateData(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { userId, tweetId } = req.body;

		if (userId && typeof userId !== 'string' && !regexUuid.test(userId)) {
			res.status(400).json({
				success: false,
				message: 'Identificador precisa ser um UUID !',
			});
			return;
		}

		if (tweetId && typeof tweetId !== 'string' && !regexUuid.test(tweetId)) {
			res.status(400).json({
				success: false,
				message: 'Identificador tweetId precisa ser um UUID !',
			});
			return;
		}

		next();
	}
}
