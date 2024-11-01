import { Router } from 'express';
import {
	CreateUserMiddleware,
	FindAllUserMiddleware,
	UpdateUserMiddleware,
} from '../middlewares/user';
import { UserController } from '../controllers/user.controller';
import { ValidateUuidMiddleware } from '../middlewares/validate-uuid.middleware';

export class UserRoutes {
	public static execute(): Router {
		const router = Router();

		router.post(
			'/users',
			[
				CreateUserMiddleware.validateRequired,
				CreateUserMiddleware.validateTypes,
				CreateUserMiddleware.validateData,
			],
			UserController.create
		);

		router.get(
			'/users',
			FindAllUserMiddleware.validateTypes,
			UserController.findAll
		);

		router.get(
			'/users/:id',
			ValidateUuidMiddleware.validate,
			UserController.findOneById
		);

		router.put(
			'/users/:id',
			[
				ValidateUuidMiddleware.validate,
				UpdateUserMiddleware.validateTypes,
				UpdateUserMiddleware.validateData,
			],
			UserController.update
		);

		router.delete(
			'/users/:id',
			ValidateUuidMiddleware.validate,
			UserController.remove
		);

		return router;
	}
}
