import { Router } from 'express';
import { LikeController } from '../controllers/like.controller';
import { ValidateUuidMiddleware } from '../middlewares/validate-uuid.middleware';
import { CreateLikeMiddleware } from '../middlewares/like/create-like.middleware';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';

export class LikeRoutes {
	public static execute(): Router {
		const router = Router();

		router.post(
			'/likes',
			[
				AuthMiddleware.validate,
				CreateLikeMiddleware.validateRequired,
				CreateLikeMiddleware.validateData,
			],
			LikeController.create
		);

		router.delete(
			'/likes/:id',
			[AuthMiddleware.validate, ValidateUuidMiddleware.validate],
			LikeController.remove
		);

		return router;
	}
}
