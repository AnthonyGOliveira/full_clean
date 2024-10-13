// mongodb-mocking.ts
import { randomUUID } from "crypto";

export const MongoMock = () => {
  const db = {
    collections: {
      accounts: [],
    },
  };

  return {
    connect: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    db: jest.fn().mockReturnValue({
      collection: (name: string) => ({
        insertOne: jest.fn().mockImplementation((data) => {
          const id = randomUUID(); // Gerando uma ID aleatória
          db.collections[name].push({ ...data, _id: id });
          return { insertedId: id };
        }),
        findOne: jest.fn().mockImplementation((query) => {
          return db.collections[name].find((item) => item._id === query._id);
        }),
        deleteMany: jest.fn().mockImplementation(() => {
          db.collections[name] = [];
        }),
      }),
    }),
  };
};
