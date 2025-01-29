import { NextFunction, Request, Response } from 'express';

export class LoginMiddleware {
	public static validateRequired(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { email, password } = req.body;

		if (!email) {
			res.status(400).json({
				success: false,
				message: 'O atributo e-mail é obrigatório !',
			});
			return;
		}

		if (!password) {
			res.status(400).json({
				success: false,
				message: 'O atributo senha é obrigatório !',
			});
			return;
		}
		next();
	}

	public static validateTypes(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { email, password } = req.body;

		if (typeof email !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo email deve vir em formato de texto !',
			});
			return;
		}
		if (typeof password !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo senha deve vir em formato de texto !',
			});
			return;
		}
		next();
	}
}
