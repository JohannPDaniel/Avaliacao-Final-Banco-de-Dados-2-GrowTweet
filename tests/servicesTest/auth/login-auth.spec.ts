import { prismaMock } from '../../config/prisma.mock';
import { UserMock } from '../../mock/user.mock';
import { AuthService } from '../../services/auth.service';
import { Bcrypt } from '../../utils/bcrypt';
import { JWT } from '../../utils/jwt';

describe('UserService - login', () => {
	const createSut = () => new AuthService();
	const loginDto = { email: 'user@email.com', password: 'password123' };

	it('Deve retornar erro 404 se o e-mail não existir', async () => {
		const sut = createSut();

		prismaMock.user.findUnique.mockResolvedValue(null);

		const result = await sut.login(loginDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('E-mail ou senha incorretos!');
		expect(result.data).toBeUndefined();
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
			where: { email: loginDto.email },
			include: { Tweet: true, followers: true },
		});
	});

	it('Deve retornar erro 404 se a senha estiver incorreta', async () => {
		const sut = createSut();
		const userMock = UserMock.build({ email: loginDto.email });

		prismaMock.user.findUnique.mockResolvedValue(userMock);

		jest.spyOn(Bcrypt.prototype, 'verify').mockResolvedValue(false);

		const result = await sut.login(loginDto);

		expect(result.success).toBeFalsy();
		expect(result.code).toBe(404);
		expect(result.message).toBe('E-mail ou senha inválidos!');
		expect(result.data).toBeUndefined();
		expect(Bcrypt.prototype.verify).toHaveBeenCalledWith(
			loginDto.password,
			userMock.password
		);
	});

	it('Deve retornar um token válido se o login for bem-sucedido', async () => {
		const sut = createSut();
		const userMock = UserMock.build({ email: loginDto.email });

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		jest.spyOn(Bcrypt.prototype, 'verify').mockResolvedValue(true);
		jest.spyOn(JWT.prototype, 'generateToken').mockReturnValue('valid_token');

		const result = await sut.login(loginDto);

		expect(result.success).toBeTruthy();
		expect(result.code).toBe(200);
		expect(result.message).toBe('Login efetuado com sucesso');
		expect(result.data).toHaveProperty('token', 'valid_token');
		expect(result.data).toHaveProperty('userId', userMock.id);
		expect(JWT.prototype.generateToken).toHaveBeenCalledWith({
			id: userMock.id,
			name: userMock.name,
			username: userMock.username,
		});
	});

	it('Deve retornar o primeiro tweetId do usuário se likedTweetId não for passado', async () => {
		const sut = createSut();
		const userMock = {
			...UserMock.build({ email: loginDto.email }),
			Tweet: [{ id: 'tweet-123' }, { id: 'tweet-456' }],
		};

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		jest.spyOn(Bcrypt.prototype, 'verify').mockResolvedValue(true);
		jest.spyOn(JWT.prototype, 'generateToken').mockReturnValue('valid_token');

		const result = await sut.login(loginDto);

		expect(result.data?.tweetId).toBe('tweet-123');
		expect(Array.isArray(result.data?.followerId)).toBeTruthy();
	});

	it('Deve retornar o likedTweetId específico se fornecido e existir', async () => {
		const sut = createSut();
		const userMock = {
			...UserMock.build({ email: loginDto.email }),
			Tweet: [{ id: 'tweet-123' }, { id: 'tweet-456' }],
		};

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		jest.spyOn(Bcrypt.prototype, 'verify').mockResolvedValue(true);
		jest.spyOn(JWT.prototype, 'generateToken').mockReturnValue('valid_token');

		const result = await sut.login(loginDto, 'tweet-456');

		expect(result.data?.tweetId).toBe('tweet-456');
	});

	it('Deve retornar followerId corretamente ao logar', async () => {
		const sut = createSut();
		const userMock = {
			...UserMock.build({ email: loginDto.email }),
			Tweet: [{ id: 'tweet-123' }],
			followers: [{ id: 'follower-1' }, { id: 'follower-2' }],
		};

		prismaMock.user.findUnique.mockResolvedValue(userMock);
		jest.spyOn(Bcrypt.prototype, 'verify').mockResolvedValue(true);
		jest.spyOn(JWT.prototype, 'generateToken').mockReturnValue('valid_token');

		const result = await sut.login(loginDto);

		expect(result.data?.followerId).toEqual(['follower-1', 'follower-2']);
	});

	it('Deve lançar um erro se o Prisma falhar ao buscar o usuário', async () => {
		const sut = createSut();

		prismaMock.user.findUnique.mockRejectedValue(new Error('Erro no banco'));

		await expect(sut.login(loginDto)).rejects.toThrow('Erro no banco');
		expect(prismaMock.user.findUnique).toHaveBeenCalled();
	});
});
