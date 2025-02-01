import { prisma } from '../database/prisma.database';
import { LoginDto } from '../dtos';
import { ResponseApi } from '../types';
import { Bcrypt } from '../utils/bcrypt';
import { JWT } from "../utils/jwt";
import { AuthUser, DecodedToken } from "../types/authUser.types";

export class AuthService {
	public async login(
		data: LoginDto,
		likedTweetId?: string
	): Promise<ResponseApi> {
		const { email, password } = data;

		const user = await prisma.user.findUnique({
			where: { email },
			include: {
				Tweet: true,
				followers: true,
			},
		});

		if (!user) {
			return {
				success: false,
				code: 404,
				message: 'E-mail ou senha incorretos!',
			};
		}

		const hash = user.password;
		const bcrypt = new Bcrypt();
		const isValidPassword = await bcrypt.verify(password, hash);

		if (!isValidPassword) {
			return {
				success: false,
				code: 404,
				message: 'E-mail ou senha inválidos!',
			};
		}

		const jwt = new JWT();
		const payload: AuthUser = {
			id: user.id,
			name: user.name,
			username: user.username,
		};

		const token = jwt.generateToken(payload);

		const selectedTweetId = likedTweetId
			? user.Tweet.find((tweet) => tweet.id === likedTweetId)?.id
			: user.Tweet[0]?.id;

		return {
			success: true,
			code: 200,
			message: 'Login efetuado com sucesso',
			data: {
				token,
				userId: user.id,
				tweetId: selectedTweetId,
				followerId: Array.isArray(user.followers)
					? user.followers.map((follower) => follower.id)
					: [],
			},
		};
	}

	public async logout(token: string): Promise<ResponseApi> {
		const jwt = new JWT();
		const decoded = jwt.verifyToken(token) as DecodedToken;

		await prisma.revokedToken.create({
			data: {
				token,
				expiresAt: new Date(decoded.exp * 1000), 
			},
		});

		return {
			success: true,
			code: 200,
			message: 'Logout efetuado com sucesso!',
		};
	}
}
