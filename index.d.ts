declare namespace Express {
	export interface Request {
		authUser: {
			id: string;
			name: string;
			username: string;
		};
	}
}
