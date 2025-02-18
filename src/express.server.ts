import express from 'express';
import cors from 'cors';
import { makeRoutes } from './routes';

export const createExpressServer = () => {
	const app = express();

	app.use(express.json());
	app.use(cors({ origin: '*' }));

	makeRoutes(app);

	return app;
};
