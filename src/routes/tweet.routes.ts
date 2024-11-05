import { Router } from 'express';
import { TweetController } from '../controllers/tweet.controller';
import {
	CreateTweetMiddleware,
	FindAllTweetMiddleware,
	UpdateTweetMiddleware,
} from '../middlewares/tweet';
import { ValidateUuidMiddleware } from '../middlewares/validate-uuid.middleware';
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";

export class TweetRoutes {
	public static execute(): Router {
		const router = Router();

		router.post(
			'/tweets',
			[
				AuthMiddleware.validate,
				CreateTweetMiddleware.validateRequired,
				CreateTweetMiddleware.validateTypes,
				CreateTweetMiddleware.validateData,
			],
			TweetController.create
		);

		router.get(
			'/tweets',
			[AuthMiddleware.validate, FindAllTweetMiddleware.validateTypes],
			TweetController.findAll
		);

		router.get(
			'/tweets/:id',
			[AuthMiddleware.validate, ValidateUuidMiddleware.validate],
			TweetController.findOneById
		);

		router.put(
			'/tweets/:id',
			[
				AuthMiddleware.validate,
				ValidateUuidMiddleware.validate,
				UpdateTweetMiddleware.validateTypes,
				UpdateTweetMiddleware.validateData,
			],
			TweetController.update
		);

		router.delete(
			'/tweets/:id',
			[AuthMiddleware.validate, ValidateUuidMiddleware.validate],
			TweetController.remove
		);

		return router;
	}
}
