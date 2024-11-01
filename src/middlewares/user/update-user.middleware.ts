import { NextFunction, Request, Response } from 'express';

export class UpdateUserMiddleware {
	public static validateTypes(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { name, username, password } = req.body;

		if (name && typeof name !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo nome deve vir em formato de texto !',
			});
			return;
		}

		if (username && typeof username !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo username deve vir em formato de texto !',
			});
			return;
		}

		if (password && typeof password !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O atributo senha deve vir em formato de texto !',
			});
			return;
		}

		next();
	}
	public static validateData(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { name, username, password } = req.body;

		if (name && name.length < 3) {
			res.status(400).json({
				success: false,
				message: 'O atributo nome deve ter pelo menos 3 caracteres !',
			});
			return;
		}

		if (username && username.length < 5) {
			res.status(400).json({
				success: false,
				message: 'O atributo username deve ter pelo menos 5 caracteres !',
			});
			return;
		}

		if (password && password.length < 5) {
			res.status(400).json({
				success: false,
				message: 'O atributo senha deve ter pelo menos 5 caracteres !',
			});
			return;
		}

		next();
	}
}
