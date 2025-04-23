import supertest from 'supertest';
import { UserMock } from '../../mock/user.mock';
import { prismaMock } from '../../config/prisma.mock';
import { makeToken } from '../make-token';
import { Application } from 'express';

interface AuthTestConfig {
	server: Application;
	method: 'get' | 'post' | 'put' | 'delete' | 'patch';
	endpoint: string;
}

export function runAuthTests({ server, method, endpoint }: AuthTestConfig) {
	const userMock = UserMock.build();

	describe(`AuthMiddleware para ${method.toUpperCase()} - ${endpoint}`, () => {
		it('Deve retornar 401 quando não for informado um token', async () => {
			const response = await supertest(server)[method](endpoint);

			expect(response.statusCode).toBe(401);
			expect(response.body).toEqual({
				success: false,
				message: 'Token não fornecido!',
			});
			expect(response.headers['content-type']).toContain('application/json');
			expect(response.body.success).toBe(false);
			expect(typeof response.body.message).toBe('string');
		});

		it('Deve retornar 401 quando o formato do token for inválido', async () => {
			const response = await supertest(server)
				[method](endpoint)
				.set('Authorization', 'InvalidTokenFormat');

			expect(response.statusCode).toBe(401);
			expect(response.body.message).toMatch(/Formato do token inválido/);
			expect(response.headers['content-type']).toContain('application/json');
			expect(response.body.success).toBe(false);
			expect(response.body).toHaveProperty('message');
		});

		it('Deve retornar 401 quando o token estiver revogado', async () => {
			prismaMock.revokedToken.findUnique.mockResolvedValue({
				id: 'revoked-token-id',
				token: 'revokedToken',
				expiresAt: new Date(),
			});

			const revokedToken = makeToken({
				id: userMock.id,
				name: userMock.name,
				username: userMock.username,
			});

			const response = await supertest(server)
				[method](endpoint)
				.set('Authorization', `Bearer ${revokedToken}`);

			expect(response.statusCode).toBe(401);
			expect(response.body.message).toContain('Faça login novamente');
			expect(response.headers['content-type']).toContain('application/json');
			expect(response.body.success).toBeFalsy();
			expect(response.body).toHaveProperty('message');
		});

		it('Deve retornar 401 quando o token for inválido (JWT inválido)', async () => {
			const response = await supertest(server)
				[method](endpoint)
				.set('Authorization', `Bearer invalid.jwt.token`);

			expect(response.statusCode).toBe(401);
			expect(response.body.message).toContain('Usuário não autenticado');
			expect(response.headers['content-type']).toContain('application/json');
			expect(response.body.success).not.toBeTruthy();
			expect(response.body).toHaveProperty('message');
		});

		it('Deve passar pelo AuthMiddleware com sucesso quando o token for válido', async () => {
			prismaMock.revokedToken.findUnique.mockResolvedValue(null);
			prismaMock.user.findUnique.mockResolvedValue(userMock);

			const validToken = makeToken({
				id: userMock.id,
				name: userMock.name,
				username: userMock.username,
			});

			const response = await supertest(server)
				[method](endpoint)
				.set('Authorization', `Bearer ${validToken}`);

			expect(response.statusCode).not.toBe(401);
			expect(response.headers['content-type']).toContain('application/json');
			expect(response.body).not.toHaveProperty(
				'message',
				'Token inválido! Faça login novamente.'
			);
			expect(response.body).not.toHaveProperty(
				'message',
				'Token não fornecido!'
			);
			expect(response.body).not.toHaveProperty(
				'message',
				'Usuário não autenticado!'
			);
		});
	});
}
