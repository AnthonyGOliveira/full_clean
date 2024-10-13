module.exports = {
  roots: ["<rootDir>/src"], // Múltiplas pastas de testes
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"], // Ignorar pastas __tests__
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/infra/db/mongodb/helpers/mongodb-mocking.ts", // Ignora o arquivo específico
  ],
};
