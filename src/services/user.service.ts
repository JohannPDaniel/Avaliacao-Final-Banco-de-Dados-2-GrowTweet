import {
	Follower as FollowerPrisma,
	Like as LikePrisma,
	Reply as ReplyPrisma,
	Tweet as TweetPrisma,
	User as UserPrisma,
} from '@prisma/client';
import { prisma } from '../database/prisma.database';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { ResponseApi } from '../types';
import { Bcrypt } from '../utils/bcrypt';
import { UserDto, Like } from './../dtos/user.dto';

export class UserService {
	public async create(createUserDto: CreateUserDto): Promise<ResponseApi> {
		const { name, email, username, password } = createUserDto;

		const user = await prisma.user.findFirst({
			where: { email },
		});

		if (user && user.email === email) {
			return {
				success: false,
				code: 409,
				message: 'O e-mail já está em uso !',
			};
		}

		const bcrypt = new Bcrypt();
		const passwordHash = await bcrypt.generateHash(password);

		const createUser = await prisma.user.create({
			data: {
				name,
				email,
				username,
				password: passwordHash,
			},
		});

		return {
			success: true,
			code: 201,
			message: 'Usuário criado com sucesso !',
			data: this.mapToDto(createUser),
		};
	}

	public async findAll(email: string): Promise<ResponseApi> {
		const users = await prisma.user.findMany({
			where: {
				...(email && { email: { contains: email } }),
				
			},
		});
		return {
			success: true,
			code: 200,
			message: 'Usuário buscado com sucesso !',
			data: users.map((user) => this.mapToDto(user)),
		};
	}
	public async findOneById(id: string, userId: string): Promise<ResponseApi> {
		if (id !== userId) {
			return {
				success: false,
				code: 403,
				message:
					'Acesso negado: você não tem permissão para acessar este usuario.',
			};
		}

		const userIdUnique = await prisma.user.findUnique({
			where: { id },
			include: {
				Tweet: {
					include: {
						Like: {
							include: {
								user: true,
							},
						},
						Reply: {
							include: {
								user: true,
							},
						},
					},
				},
				Like: {
					include: {
						tweet: {
							include: {
								user: true,
							},
						},
					},
				},
				following: {
					include: {
						follower: true,
					},
				},
				followers: {
					include: {
						user: true,
					},
				},
			},
		});

		if (!userIdUnique) {
			return {
				success: false,
				code: 404,
				message: 'Usuário a ser buscado não encontrado!',
			};
		}

		return {
			success: true,
			code: 200,
			message: 'Usuário buscado pelo id com sucesso!',
			data: this.mapToDto(userIdUnique),
		};
	}
	public async update(
		id: string,
		userId: string,
		updateUserDto: UpdateUserDto
	): Promise<ResponseApi> {
		if (id !== userId) {
			return {
				success: false,
				code: 403,
				message:
					'Acesso negado: você não tem permissão para atualizar este usuario.',
			};
		}

		const userFound = await prisma.user.findUnique({
			where: { id },
		});

		if (!userFound) {
			return {
				success: false,
				code: 404,
				message: 'Usuário a ser atualizado não encontrado !',
			};
		}

		const bcrypt = new Bcrypt();
		let passwordHash: string | undefined = undefined;

		if (updateUserDto.password) {
			passwordHash = await bcrypt.generateHash(updateUserDto.password);
		}

		const updateUser = await prisma.user.update({
			where: { id },
			data: {
				...updateUserDto,
				...(passwordHash && { password: passwordHash }),
			},
		});

		return {
			success: true,
			code: 200,
			message: 'Usuário atualizado com sucesso !',
			data: this.mapToDto(updateUser),
		};
	}
	public async remove(id: string, userId: string): Promise<ResponseApi> {

		if (id !== userId) {
			return {
				success: false,
				code: 403,
				message:
					'Acesso negado: você não tem permissão para deletar este usuario.',
			};
		}

		const userFound = await prisma.user.findUnique({
			where: { id },
		});

		if (!userFound) {
			return {
				success: false,
				code: 404,
				message: 'Usuario a ser deletado não encontrado !',
			};
		}

		const userDeleted = await prisma.user.delete({
			where: { id },
		});

		return {
			success: true,
			code: 200,
			message: 'Usuário deletado com sucesso !',
			data: this.mapToDto(userDeleted),
		};
	}

	private mapToDto(
		users: UserPrisma & {
			Tweet?: (TweetPrisma & {
				Like?: (LikePrisma & { user: UserPrisma })[];
				Reply?: (ReplyPrisma & { user: UserPrisma })[];
			})[];
			Like?: (LikePrisma & { tweet: TweetPrisma & { user: UserPrisma } })[];
			followers?: { user: UserPrisma }[];
			following?: { follower: UserPrisma }[];
		}
	): UserDto {
		return {
			id: users.id,
			name: users.name,
			email: users.email,
			username: users.username,
			tweet: users.Tweet?.map((tweet) => ({
				content: tweet.content,
				type: tweet.type,
				like: tweet.Like?.map((like) => ({
					userId: like.userId,
					tweetId: like.tweetId,
					user: {
						name: like.user.name,
						username: like.user.username,
						email: like.user.email,
					},
				})),
				reply: tweet.Reply?.map((reply) => ({
					content: reply.content,
					type: reply.type,
					userId: reply.userId,
					tweetId: reply.tweetId,
					user: {
						name: reply.user.name,
						username: reply.user.username,
						email: reply.user.email,
					},
				})),
			})),
			like: users.Like?.map((like) => ({
				userId: like.userId,
				tweetId: like.tweetId,
				tweet: {
					content: like.tweet.content,
					type: like.tweet.type,
					user: {
						name: like.tweet.user.name,
						username: like.tweet.user.username,
						email: like.tweet.user.email,
					},
				},
			})),
			following: users.following?.map((followed) => ({
				userId: followed.follower.id,
				name: followed.follower.name,
				username: followed.follower.username,
				email: followed.follower.email,
			})),
			followers: users.followers?.map((follower) => ({
				userId: follower.user.id,
				name: follower.user.name,
				username: follower.user.username,
				email: follower.user.email,
			})),
		};
	}
}
