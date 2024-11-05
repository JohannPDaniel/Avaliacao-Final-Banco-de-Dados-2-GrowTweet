import { randomUUID } from 'crypto';
import { prisma } from '../database/prisma.database';
import { LoginDto } from '../dtos';
import { ResponseApi } from '../types';
import { Bcrypt } from '../utils/bcrypt';
import { User } from "@prisma/client";

export class AuthService {
	public async login(data: LoginDto): Promise<ResponseApi> {
		const { email, password } = data;

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return {
				success: false,
				code: 404,
				message: 'E-mail ou senha incorretos !',
			};
		}

		const hash = user.password;
		const bcrypt = new Bcrypt();
		const isValidPassword = await bcrypt.verify(password, hash);

		if (!isValidPassword) {
			return {
				success: false,
				code: 404,
				message: 'E-mail ou senha inválidos !',
			};
		}

		const token = randomUUID();

		await prisma.user.update({
			where: { id: user.id },
			data: {
				authToken: token,
			},
		});

		return {
			success: true,
			code: 200,
			message: 'Login efetuado com sucesso',
			data: { token },
		};
	}

	public async validateToken(token: string): Promise<User | null> {
		const users = await prisma.user.findFirst({
			where: {
				authToken: token,
			},
		});

		return users;
	}
}
