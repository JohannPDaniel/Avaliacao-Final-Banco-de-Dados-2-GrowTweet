import { UserService } from '../../../src/services/user.service';
import { prismaMock } from '../../config/prisma.mock';
import { JWT } from '../../../src/utils/jwt';
import { AuthService } from "../../../src/services/auth.service";
import { DecodedToken } from "../../../src/types/authUser.types";

describe('UserService - logout', () => {
	const createSut = () => new AuthService();
	const token = 'valid_jwt_token';

	it('Deve revogar o token com sucesso e retornar mensagem de logout', async () => {
		const sut = createSut();
		const decodedToken: DecodedToken = {
			id: 'user-123',
			name: 'any_name',
			username: 'any_username',
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 3600, // Expira em 1 hora
		};

		jest.spyOn(JWT.prototype, 'verifyToken').mockReturnValue(decodedToken);

		prismaMock.revokedToken.create.mockResolvedValue({
			id: 'revoked-123',
			token,
			expiresAt: new Date(decodedToken.exp * 1000),
		});

		const result = await sut.logout(token);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Logout efetuado com sucesso!');
		expect(prismaMock.revokedToken.create).toHaveBeenCalledWith({
			data: {
				token,
				expiresAt: new Date(decodedToken.exp * 1000),
			},
		});
	});

	it('Deve lançar um erro se o token for inválido', async () => {
		const sut = createSut();

		jest.spyOn(JWT.prototype, 'verifyToken').mockImplementation(() => {
			throw new Error('Token inválido');
		});

		await expect(sut.logout(token)).rejects.toThrow('Token inválido');
		expect(JWT.prototype.verifyToken).toHaveBeenCalledWith(token);
		expect(prismaMock.revokedToken.create).not.toHaveBeenCalled();
	});

	it('Deve lançar um erro se o Prisma falhar ao armazenar o token revogado', async () => {
		const sut = createSut();
		const decodedToken: DecodedToken = {
			id: 'user-123',
			name: 'any_name',
			username: 'any_username',
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 3600, // Expira em 1 hora
		};

		jest.spyOn(JWT.prototype, 'verifyToken').mockReturnValue(decodedToken);
		prismaMock.revokedToken.create.mockRejectedValue(
			new Error('Erro ao revogar token')
		);

		await expect(sut.logout(token)).rejects.toThrow('Erro ao revogar token');

		expect(prismaMock.revokedToken.create).toHaveBeenCalledWith({
			data: {
				token,
				expiresAt: new Date(decodedToken.exp * 1000),
			},
		});
	});
});
