import { Router } from 'express';
import { ReplyController } from '../controllers/reply.controller';
import {
	CreateReplyMiddleware,
	FindAllReplyMiddleware,
	UpdateReplyMiddleware,
} from '../middlewares/reply';
import { ValidateUuidMiddleware } from '../middlewares/validate-uuid.middleware';
export class ReplyRoutes {
	public static execute(): Router {
		const router = Router();

		router.post(
			'/replies',
			[
				CreateReplyMiddleware.validateRequired,
				CreateReplyMiddleware.validateTypes,
				CreateReplyMiddleware.validateData,
			],
			ReplyController.create
		);

		router.get(
			'/replies',
			FindAllReplyMiddleware.validateTypes,
			ReplyController.findAll
		);

		router.get(
			'/replies/:id',
			ValidateUuidMiddleware.validate,
			ReplyController.findOneById
		);

		router.put(
			'/replies/:id',
			[
				ValidateUuidMiddleware.validate,
				UpdateReplyMiddleware.validateTypes,
				UpdateReplyMiddleware.validateData,
			],
			ReplyController.update
		);

		router.delete(
			'/replies/:id',
			ValidateUuidMiddleware.validate,
			ReplyController.remove
		);

		return router;
	}
}
