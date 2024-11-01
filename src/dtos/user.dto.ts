export interface CreateUserDto {
    name: string;
    email: string;
    username: string;
    password: string
}

export interface UserDto {
    id: string;
	name: string;
	email: string;
	username: string;
}

export interface UpdateUserDto {
	name?: string;
	email?: string;
	username?: string;
	password?: string
}