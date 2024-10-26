// jest.setup.js
jest.mock("winston", () => ({
    createLogger: jest.fn().mockImplementation(() => {
      return {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
      };
    }),
    format: {
      combine: jest.fn(),
      timestamp: jest.fn(),
      printf: jest.fn(),
      errors: jest.fn(),
    },
    transports: {
      Console: jest.fn(),
      File: jest.fn(),
    },
  }));
  