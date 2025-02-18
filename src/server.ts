import 'dotenv/config';
import { TokenCleanup } from "./utils/TokenCleanup";
import { createExpressServer } from './express.server';

const port = process.env.PORT || 3000;
const app = createExpressServer();

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