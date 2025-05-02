import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock/user.mock';
import { makeToken } from '../make-token';
import { TweetMock } from '../../mock/tweet.mock';
import { LikeService } from '../../../src/services/like.service';

describe('POST /likes', () => {
	const server = createExpressServer();
	const endpoint = '/likes';
	const userMock = UserMock.build();
	const tweetMock = TweetMock.build();
	const token = makeToken(userMock);

	it('Deve retornar 400 quando o ID do Tweet não estiver sido informado', async () => {
		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(400);
	});

	it('Deve retornar 400 quando o ID do Usuário, se vier, não ser uma string e também não ser um UUID', async () => {
		const body = { userId: 123 };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.send(body);

		expect(response.status).toBe(400);
	});

	it('Deve retornar 400 quando o ID do Tweet, não for uma string e também não ser um UUID', async () => {
		const body = { userId: userMock.id };

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-tweet-id', 'not-a-valid-uuid')
			.send(body);

		expect(response.status).toBe(400);
	});

	it('Deve permitir criar um Like quando se informado um ID de Usuário e informado um ID do Tweet válido', async () => {
		const body = { userId: '' };

		jest.spyOn(LikeService.prototype, 'create').mockResolvedValue({
			success: true,
			code: 201,
			message: 'Like criado com sucesso!',
			data: {},
		});

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-tweet-id', `${tweetMock.id}`)
			.send(body);

		expect(response.status).toBe(201);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const body = {
			userId: ""
		};

		jest
			.spyOn(LikeService.prototype, 'create')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${token}`)
			.set('x-tweet-id', `${tweetMock.id}`)
			.send(body);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro no servidor: Exceção !!!',
		});
	});
});
