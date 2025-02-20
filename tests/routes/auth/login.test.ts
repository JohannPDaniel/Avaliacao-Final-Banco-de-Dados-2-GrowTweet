import supertest from 'supertest';
import { createExpressServer } from './../../../src/express.server';


describe('POST /login', () => {
	const server = createExpressServer();

	it('Deve retornar 400 quando não informado um e-mail no body', async () => {
		const body = {};
		const response = await supertest(server).post('/login').send(body);
	});
});
