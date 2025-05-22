import { Db, MongoClient } from 'mongodb';

declare global {
  let _mongoClientPromise: Promise<MongoClient> | undefined;
  
  interface MongoDB {
    client: MongoClient;
    db: Db;
  }
}