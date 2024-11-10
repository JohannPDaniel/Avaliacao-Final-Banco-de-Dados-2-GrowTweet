import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { LoginMiddleware } from "../middlewares/auth/login.middleware";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";

export class AuthRoutes {
	public static execute(): Router {
		const router = Router();

		router.post(
			'/login',
			[LoginMiddleware.validateRequired, LoginMiddleware.validateTypes],
			AuthController.login
		);

		router.post(
			'/logout',
			AuthMiddleware.validate, // Middleware de autenticação para verificar se o usuário está logado
			AuthController.logout
		);

		return router;
	}
}
