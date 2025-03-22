import { Express, Request, Response } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerDOC from '../docs/swagger.json';
import { AuthRoutes } from './auth.routes';
import { FollowerRoutes } from './follower.routes';
import { LikeRoutes } from './like.routes';
import { ReplyRoutes } from './reply.routes';
import { TweetRoutes } from './tweet.routes';
import { UserRoutes } from './user.routes';

export const makeRoutes = (app: Express) => {
	app.get('/', (_req: Request, res: Response) => {
		res.status(200).json({
			success: true,
			message: 'Bem-vindo a API GrowTweet 🚀',
		});
	});

	app.use('/docs', swaggerUI.serve);
	app.get('/docs', swaggerUI.setup(swaggerDOC));

	app.use(AuthRoutes.execute());
	app.use(UserRoutes.execute());
	app.use(TweetRoutes.execute());
	app.use(LikeRoutes.execute());
	app.use(ReplyRoutes.execute());
	app.use(FollowerRoutes.execute());
};
