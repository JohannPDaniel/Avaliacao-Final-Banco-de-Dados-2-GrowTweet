import { User as UserPrisma } from '@prisma/client';
import { prisma } from '../database/prisma.database';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dtos';
import { ResponseApi } from '../types';
import { Bcrypt } from '../utils/bcrypt';

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
	public async findOneById(id: string): Promise<ResponseApi> {
		const userId = await prisma.user.findUnique({
			where: { id },
		});

		if (!userId) {
			return {
				success: false,
				code: 404,
				message: 'Usuário a ser buscado não encontrado !',
			};
		}

		return {
			success: true,
			code: 200,
			message: 'Usuário buscado pelo id com sucesso !',
			data: this.mapToDto(userId),
		};
	}
	public async update(
		id: string,
		updateUserDto: UpdateUserDto
	): Promise<ResponseApi> {
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
	public async remove(id: string): Promise<ResponseApi> {
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

	private mapToDto(user: UserPrisma): UserDto {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			username: user.username,
		};
	}
}
