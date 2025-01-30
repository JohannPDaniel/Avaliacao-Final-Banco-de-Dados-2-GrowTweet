export interface AuthUser {
    id: string;
    name: string;
    username: string;
    password: string
}

export interface DecodedToken extends AuthUser {
	exp: number;
	iat: number;
}