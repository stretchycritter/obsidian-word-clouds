module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/__tests__/**',
    '!src/**/__benchmarks__/**',
    '!src/**/*.test.ts',
  ],
  coverageThreshold: {
    './src/core/**/*.ts': {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    './src/settings/**/*.ts': {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
