import { NextFunction, Request, Response } from 'express';
import { regexUuid } from "../types";

export class ValidateUuidMiddleware {
	public static validate(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { id } = req.params;
		
		if (!regexUuid.test(id)) {
			res.status(400).json({
				success: false,
				message: 'Identificador precisa ser um UUID !',
			});
			return;
		}

		next();
	}
}
