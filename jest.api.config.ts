import defaultConfig from './jest.config';
export default {
	...defaultConfig,
	testMatch: ['<rootDir>/tests/routes/**/*.test.ts'],
};
