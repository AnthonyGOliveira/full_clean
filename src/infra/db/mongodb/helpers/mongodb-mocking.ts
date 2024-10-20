import { randomUUID } from "crypto";

export const MongoMock = () => {
  const db = {
    collections: {},
  };
  let isConnected: boolean = false;

  return {
    connect: jest.fn().mockImplementation(() => {
      isConnected = true;
      return true;
    }),
    close: jest.fn().mockImplementation(() => {
      isConnected = false;
      return true;
    }),
    db: jest.fn().mockReturnValue({
      collection: (name: string) => {
        if (!db.collections[name]) {
          db.collections[name] = []; // Cria a coleção se não existir
        }
        return {
          collectionName: name,
          insertOne: jest.fn().mockImplementation((data) => {
            const id = randomUUID(); // Gera uma ID aleatória
            db.collections[name].push({ ...data, _id: id });
            return { insertedId: id };
          }),
          findOne: jest.fn().mockImplementation((query) => {
            return db.collections[name].find((item) => item._id === query._id);
          }),
          deleteMany: jest.fn().mockImplementation(() => {
            db.collections[name] = [];
          }),
        };
      },
    }),
    isConnected: jest.fn().mockReturnValue(isConnected),
  };
};
