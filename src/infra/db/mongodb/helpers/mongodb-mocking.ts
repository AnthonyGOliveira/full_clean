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
            if (query._id) {
              return db.collections[name].find(
                (item) => item._id === query._id
              );
            } else if (query.email) {
              return db.collections[name].find(
                (item) => item.email === query.email
              );
            }
            return null;
          }),

          updateOne: jest.fn().mockImplementation((filter, update) => {
            const index = db.collections[name].findIndex(
              (item) => item._id === filter._id.toString() // Comparação considerando string para ObjectId
            );

            if (index === -1) {
              return { matchedCount: 0, modifiedCount: 0 };
            }

            const updatedDocument = {
              ...db.collections[name][index],
              ...update.$set, // Atualiza os campos do documento
            };

            db.collections[name][index] = updatedDocument;

            return { matchedCount: 1, modifiedCount: 1 };
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
