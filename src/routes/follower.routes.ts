import { Router } from 'express';
import { FollowerController } from '../controllers/follower.controller';
import { ValidateUuidMiddleware } from '../middlewares/validate-uuid.middleware';
import { CreateFollowerMiddleware } from "../middlewares/follower/create-follower.middleware";

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

		router.delete(
			'/followers/:id',
			ValidateUuidMiddleware.validate,
			FollowerController.remove
		);

		return router;
	}
}
