import { Router } from 'express';
import { FollowerController } from '../controllers/follower.controller';
import {
	CreateFollowerMiddleware,
	FindAllFollowerMiddleware,
} from '../middlewares/follower';
import { ValidateUuidMiddleware } from '../middlewares/validate-uuid.middleware';

export class FollowerRoutes {
	public static execute(): Router {
		const router = Router();

		router.post(
			'/followers',
			[
				CreateFollowerMiddleware.validateRequired,
				CreateFollowerMiddleware.validateTypes,
				CreateFollowerMiddleware.validateData,
			],
			FollowerController.create
		);

		router.get(
			'/followers',
			[
				FindAllFollowerMiddleware.validateTypes,
				FindAllFollowerMiddleware.validateData,
			],
			FollowerController.findAll
		);

		router.get(
			'/followers/:id',
			ValidateUuidMiddleware.validate,
			FollowerController.findOneById
		);

		router.delete(
			'/followers/:id',
			ValidateUuidMiddleware.validate,
			FollowerController.remove
		);

		return router;
	}
}
