import { Router } from "express";
import { CreateTweetMiddleware } from "../middlewares/tweet/create-tweet.middleware";
import { TweetController } from "../controllers/tweet.controller";
import { FindAllTweetMiddleware } from "../middlewares/tweet/find-all-tweet.middleware";
import { ValidateUuidMiddleware } from "../middlewares/validate-uuid.middleware";
import { UpdateTweetMiddleware } from "../middlewares/tweet/update-tweet.middleware";

export class TweetRoutes {
	public static execute(): Router {
		const router = Router();

		router.post(
			'/tweets',
			[
				CreateTweetMiddleware.validateRequired,
				CreateTweetMiddleware.validateTypes,
				CreateTweetMiddleware.validateData,
			],
			TweetController.create
		);

		router.get(
			'/tweets',
			FindAllTweetMiddleware.validateTypes,
			TweetController.findAll
		);

		router.get(
			'/tweets/:id',
			ValidateUuidMiddleware.validate,
			TweetController.findOneById
		);

		router.put(
			'/tweets/:id',
			[
				ValidateUuidMiddleware.validate,
				UpdateTweetMiddleware.validateTypes,
				UpdateTweetMiddleware.validateData,
			],
			TweetController.update
		);

		router.delete(
			'/tweets/:id',
			ValidateUuidMiddleware.validate,
			TweetController.remove
		);

		return router;
	}
}
