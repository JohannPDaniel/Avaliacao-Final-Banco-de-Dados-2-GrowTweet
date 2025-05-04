import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';
import { FindAllTweetMiddleware } from '../middlewares/tweet';
import { FeedController } from '../controllers/feed.controller';

export class FeedRoutes {
	public static execute(): Router {
		const router = Router();

		router.get(
			'/feeds',
			[AuthMiddleware.validate, FindAllTweetMiddleware.validateTypes],
			FeedController.findAll
		);

		return router;
	}
}
