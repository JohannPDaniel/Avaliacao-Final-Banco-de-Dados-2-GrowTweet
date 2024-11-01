import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Bem-vindo a API GrowTweet 🚀"
    })
})

app.listen(port, () => {
	console.log(`Server running on port http://localhost:${port}`);
});
