/* eslint-disable prettier/prettier */
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!src/main.(t|j)s',
    '!src/app.module.(t|j)s',
    'src/reservations/interfaces/**/*.(t|j)s',
    'src/reservations/application/**/*.(t|j)s',
    'src/reservations/infrastructure/**/*.(t|j)s',
    '!src/reservations/domain/**/*.(t|j)s',
    '!src/**/**/index.ts',
  ],
  coveragePathIgnorePatterns: [
    '.module.ts',
    '.util.ts',
    '.provider.ts',
    '.dto.ts',
    '.mock.ts',
    '.enum.ts',
    '.entity.ts',
    '.constants.ts',
    'common/*',
    'src/interfaces/*',
    'src/main.ts',
  ],
  coverageDirectory: './coverage',
  roots: ['test', 'src'],
  modulePaths: ['<rootDir>'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
//   "setupFiles": [
//     "./setupEnv.ts"
//   ],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/$1',
  },
  testRegex: '.*\\.spec\\.ts$',
  coverageThreshold: {
    global: {
      branches: 100,
      lines: 100,
    },
  },
};

export default config;