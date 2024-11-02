import { Router } from 'express';
import { LikeController } from '../controllers/like.controller';
import { CreateLikeMiddleware } from '../middlewares/like/create-like.middleware';
import { FindAllLikeMiddleware } from '../middlewares/like/find-all-like.middleware';
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
			[ValidateUuidMiddleware.validate, FindAllLikeMiddleware.validateTypes],
			LikeController.findAll
		);

		router.get(
			'/likes/:id',
			ValidateUuidMiddleware.validate,
			LikeController.findOneById
		);

		// router.put(
		// 	'/likes/:id',
		// 	[
		// 		ValidateUuidMiddleware.validate,
		// 		UpdateLikeMiddleware.validateTypes,
		// 		UpdateLikeMiddleware.validateData,
		// 	],
		// 	LikeController.update
		// );

		router.delete(
			'/likes/:id',
			ValidateUuidMiddleware.validate,
			LikeController.remove
		);

		return router;
	}
}
