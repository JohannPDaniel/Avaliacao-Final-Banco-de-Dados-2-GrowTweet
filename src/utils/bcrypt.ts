import bcrypt from 'bcrypt';
export class Bcrypt {
	public async generateHash(password: string): Promise<string> {
		const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
		return hash;
	}

	public async verify(password: string, hash: string): Promise<boolean> {
		const isValid = await bcrypt.compare(password, hash);
		return isValid;
	}
}
