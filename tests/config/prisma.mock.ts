import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { prisma } from "../../src/database/prisma.database";

jest.mock('../../src/database/prisma.database', () => ({
	__esModule: true,
	prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
	mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;