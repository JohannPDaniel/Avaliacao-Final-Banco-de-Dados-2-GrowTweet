import { AuthUser, DecodedToken } from '../types/authUser.types';
import jwt from 'jsonwebtoken';

export class JWT {
	public generateToken(data: AuthUser) {
		if (!process.env.JWT_SECRET) {
			throw new Error('JWT_SECRET não definido');
		}

		return jwt.sign(data, process.env.JWT_SECRET, {
			algorithm: 'HS256',
			expiresIn: "1h",
		});
	}

	public verifyToken(token: string): DecodedToken | null {
		try {
			if (!process.env.JWT_SECRET) {
				throw new Error('JWT_SECRET não definido');
			}

			const data = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

			return data;
		} catch {
			return null;
		}
	}
}
