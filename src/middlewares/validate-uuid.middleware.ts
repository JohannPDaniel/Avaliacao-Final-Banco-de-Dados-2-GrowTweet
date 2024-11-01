import { NextFunction, Request, Response } from 'express';

export class ValidateUuidMiddleware {
	public static validate(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { id } = req.params;

		const regexUuid =
			/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

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
