// eslint-disable-next-line no-undef
module.exports = {
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
      statements: 62,
      branches: 47,
      functions: 56,
      lines: 67,
    },
  },
}
