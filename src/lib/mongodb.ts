import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "printngift";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

export function hasDatabase() {
  return Boolean(uri);
}

export async function getDb(): Promise<Db> {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!global.mongoClientPromise) {
    global.mongoClientPromise = new MongoClient(uri).connect();
  }

  const client = await global.mongoClientPromise;
  return client.db(dbName);
}
