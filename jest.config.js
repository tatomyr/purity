module.exports = {
  transform: {'^.+\\.ts$': 'ts-jest'},
  verbose: true,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}
