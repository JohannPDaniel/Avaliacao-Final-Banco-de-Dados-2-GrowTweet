import { Router } from 'express';
import { LikeController } from '../controllers/like.controller';
import {
	CreateLikeMiddleware,
	FindAllLikeMiddleware,
} from '../middlewares/like';
import { ValidateUuidMiddleware } from '../middlewares/validate-uuid.middleware';

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

		router.get(
			'/likes',
			[FindAllLikeMiddleware.validateTypes, FindAllLikeMiddleware.validateData],
			LikeController.findAll
		);

		router.get(
			'/likes/:id',
			ValidateUuidMiddleware.validate,
			LikeController.findOneById
		);

		router.delete(
			'/likes/:id',
			ValidateUuidMiddleware.validate,
			LikeController.remove
		);

		return router;
	}
}
