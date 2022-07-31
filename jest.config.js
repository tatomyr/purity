// eslint-disable-next-line no-undef
export default {
  transform: {'^.+\\.ts$': 'ts-jest'},
  verbose: true,
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/examples/**/*',
    '!src/playground/**/*',
    '!src/index.ts',
    '!src/lz-string.ts',
    '!src/md5.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 64,
      branches: 54,
      functions: 62,
      lines: 67,
    },
  },
}
