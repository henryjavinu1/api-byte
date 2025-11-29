import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^middlewares/(.*)$': '<rootDir>/src/middlewares/$1'
  },
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  collectCoverage: false,
};

export default config;
