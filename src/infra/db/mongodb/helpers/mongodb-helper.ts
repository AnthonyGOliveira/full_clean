import { Collection, MongoClient } from "mongodb";

export const MongoDatabaseHelper = {
  client: null as MongoClient,

  async connect(url: string): Promise<void> {
    if (!this.client) {
      this.client = new MongoClient(url);
      await this.client.connect();
    }
  },
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  },
  getCollection(collection: string): Collection {
    return this.client.db().collection(collection);
  },
};
