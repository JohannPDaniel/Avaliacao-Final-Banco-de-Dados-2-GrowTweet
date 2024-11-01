import { NextFunction, Request, Response } from 'express';

export class FindAllUserMiddleware {
	public static validateTypes(req: Request, res: Response, next: NextFunction) {
		const { email } = req.query;

		if (email && typeof email !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo nome deve vir em formato de texto !',
			});
		}
		next();
	}
}
