import { Router } from 'express';
import { FollowerController } from '../controllers/follower.controller';
import { ValidateUuidMiddleware } from '../middlewares/validate-uuid.middleware';
import { CreateFollowerMiddleware } from '../middlewares/follower/create-follower.middleware';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';

export class FollowerRoutes {
	public static execute(): Router {
		const router = Router();

		router.post(
			'/followers',
			[AuthMiddleware.validate, CreateFollowerMiddleware.validateData],
			FollowerController.create
		);

		router.delete(
			'/followers/:id',
			[AuthMiddleware.validate, ValidateUuidMiddleware.validate],
			FollowerController.remove
		);

		return router;
	}
}
