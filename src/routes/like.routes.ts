import { Router } from 'express';
import { LikeController } from '../controllers/like.controller';
import { ValidateUuidMiddleware } from '../middlewares/validate-uuid.middleware';
import { CreateLikeMiddleware } from "../middlewares/like/create-like.middleware";

export class LikeRoutes {
	public static execute(): Router {
		const router = Router();

		router.post(
			'/likes',
			[
				CreateLikeMiddleware.validateRequired,
				CreateLikeMiddleware.validateTypes,
				CreateLikeMiddleware.validateData,
			],
			LikeController.create
		);

		router.delete(
			'/likes/:id',
			ValidateUuidMiddleware.validate,
			LikeController.remove
		);

		return router;
	}
}
