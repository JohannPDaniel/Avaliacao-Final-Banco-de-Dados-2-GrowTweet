import { Router } from 'express';
import { ReplyController } from '../controllers/reply.controller';
import {
	CreateReplyMiddleware,
	FindAllReplyMiddleware,
	UpdateReplyMiddleware,
} from '../middlewares/reply';
import { ValidateUuidMiddleware } from '../middlewares/validate-uuid.middleware';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';
export class ReplyRoutes {
	public static execute(): Router {
		const router = Router();

		router.post(
			'/replies',
			[
				AuthMiddleware.validate,
				CreateReplyMiddleware.validateRequired,
				CreateReplyMiddleware.validateTypes,
				CreateReplyMiddleware.validateData,
			],
			ReplyController.create
		);

		router.get(
			'/replies',
			[AuthMiddleware.validate, FindAllReplyMiddleware.validateTypes],
			ReplyController.findAll
		);

		router.get(
			'/replies/:id',
			[AuthMiddleware.validate, ValidateUuidMiddleware.validate],
			ReplyController.findOneById
		);

		router.put(
			'/replies/:id',
			[
				AuthMiddleware.validate,
				ValidateUuidMiddleware.validate,
				UpdateReplyMiddleware.validateTypes,
				UpdateReplyMiddleware.validateData,
			],
			ReplyController.update
		);

		router.delete(
			'/replies/:id',
			[AuthMiddleware.validate, ValidateUuidMiddleware.validate],
			ReplyController.remove
		);

		return router;
	}
}
