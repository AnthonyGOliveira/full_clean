module.exports = {
  roots: ["<rootDir>/src"], // Múltiplas pastas de testes
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"], // Ignorar pastas __tests__
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/infra/db/mongodb/helpers/mongodb-mocking.ts", // Ignora o arquivo específico
    "<rootDir>/src/main/server.ts",
    "<rootDir>/src/main/config",
  ],
};
