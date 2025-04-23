export default {
	// Configura o Jest para testes no Node.
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'.+\\.ts$': 'ts-jest',
	},
	// Informa o diretório onde os testes estarão contidos
	roots: ['<rootDir>/tests'],
	// Configurações de cobertura de código
	collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
	coverageDirectory: 'coverage',
	coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],

	// ✅ Carrega o .env ANTES dos testes
	setupFiles: ['dotenv/config'],

	// Configurações após os testes serem carregados
	setupFilesAfterEnv: ['<rootDir>/tests/config/prisma.mock.ts'],
};
