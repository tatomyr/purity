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
      statements: 74,
      branches: 61,
      functions: 68,
      lines: 75,
    },
  },
}
