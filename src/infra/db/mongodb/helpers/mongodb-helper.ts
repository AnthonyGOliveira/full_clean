import { Collection, MongoClient } from "mongodb";

export const MongoDatabaseHelper = {
  client: null as MongoClient,
  url: "" as string,

  async connect(url: string): Promise<void> {
    if (!this.client) {
      this.client = new MongoClient(url);
      this.url = url;
      await this.client.connect();
    }
  },
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  },
  async getCollection(collection: string): Promise<Collection> {
    await this.connect(this.url);
    return this.client.db().collection(collection);
  },
};
