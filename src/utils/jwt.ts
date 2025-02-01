import { AuthUser, DecodedToken } from '../types/authUser.types';
import jwt, { SignOptions } from 'jsonwebtoken';
import { StringValue } from "ms";

export class JWT {
	public generateToken(user: AuthUser): string {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error('JWT_SECRET não definido.');
		}

		const expiresIn = (process.env.EXPIRES_IN || '1h') as StringValue; 

		const options: SignOptions = {
			algorithm: 'HS256',
			expiresIn,
		};

		const token = jwt.sign(user, secret, options);
		return token;
	}
	public verifyToken(token: string): DecodedToken | null {
		try {
			if (!process.env.JWT_SECRET) {
				throw new Error('JWT_SECRET não definido');
			}

			console.log('Verificando token:', token); // Log do token recebido
			console.log('Usando segredo:', process.env.JWT_SECRET); // Log do segredo

			const data = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

			console.log('Token decodificado:', data); // Log do token decodificado
			return data;
		} catch (error) {
			console.error('Erro ao verificar token:', error); // Log de erro
			return null;
		}
	}
}
