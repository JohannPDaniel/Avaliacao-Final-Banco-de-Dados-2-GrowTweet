import { AuthUser } from '../../src/types/authUser.types';
import { JWT } from '../../src/utils/jwt';

export function makeToken(payload: AuthUser) {
	const jwt = new JWT();

	const token = jwt.generateToken(payload);

	return token;
}
