import { Router } from 'express';
import {
	CreateUserMiddleware,
	FindAllUserMiddleware,
	UpdateUserMiddleware,
} from '../middlewares/user';
import { UserController } from '../controllers/user.controller';
import { ValidateUuidMiddleware } from '../middlewares/validate-uuid.middleware';
import { AuthMiddleware } from './../middlewares/auth/auth.middleware';

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
			[
				AuthMiddleware.validate,
				FindAllUserMiddleware.validateTypes,
				FindAllUserMiddleware.ValidateData,
			],
			UserController.findAll
		);

		router.get(
			'/users/:id',
			[AuthMiddleware.validate, ValidateUuidMiddleware.validate],
			UserController.findOneById
		);

		router.put(
			'/users/:id',
			[
				AuthMiddleware.validate,
				ValidateUuidMiddleware.validate,
				UpdateUserMiddleware.validateTypes,
				UpdateUserMiddleware.validateData,
			],
			UserController.update
		);

		router.delete(
			'/users/:id',
			[AuthMiddleware.validate, ValidateUuidMiddleware.validate],
			UserController.remove
		);

		return router;
	}
}
