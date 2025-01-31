import { prisma } from '../database/prisma.database';

export class TokenCleanup {
	public static async removeExpiredTokens() {
		await prisma.revokedToken.deleteMany({
			where: {
				expiresAt: { lt: new Date() }, 
			},
		});
	}
}
