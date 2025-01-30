import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import {
	UserRoutes,
	TweetRoutes,
	LikeRoutes,
	ReplyRoutes,
	FollowerRoutes,
	AuthRoutes,
} from './routes';
import { TokenCleanup } from "./utils/TokenCleanup";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (_req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: 'Bem-vindo a API GrowTweet 🚀',
	});
});

app.use(AuthRoutes.execute());
app.use(UserRoutes.execute());
app.use(TweetRoutes.execute());
app.use(LikeRoutes.execute());
app.use(ReplyRoutes.execute());
app.use(FollowerRoutes.execute());

(async () => {
	await TokenCleanup.removeExpiredTokens();
	console.log(
		'🔄 Tokens expirados removidos da blacklist ao iniciar o servidor.'
	);
})();

setInterval(async () => {
	await TokenCleanup.removeExpiredTokens();
	console.log('Tokens expirados removidos da blacklist.');
}, 60 * 60 * 1000);

app.listen(port, () => {
	console.log(`🚀 Server running on port http://localhost:${port}`);
});