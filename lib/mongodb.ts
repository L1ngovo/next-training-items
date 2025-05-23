// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from 'mongodb';

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }
}

// 硬编码数据库名称或从环境变量读取
const DB_NAME = process.env.MONGODB_DBNAME || 'BlogData';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI 未配置');

const options: MongoClientOptions = {
  maxPoolSize: 10,
  socketTimeoutMS: 30000,
  appName: 'NextJS_Blog', // 便于在 MongoDB 日志中识别
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (typeof window !== 'undefined') {
  throw new Error('MongoDB 客户端不能在浏览器端使用');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect()
      .then(connectedClient => {
        console.log(`📡 开发环境连接到数据库: ${DB_NAME}`);
        return connectedClient;
      })
      .catch(err => {
        console.error('连接失败:', err);
        process.exit(1);
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const connectToDatabase = async () => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // 心跳检测验证连接
  try {
    await db.command({ ping: 1 });
  } catch (err) {
    console.error('数据库心跳检测失败:', err);
    throw new Error('数据库连接异常');
  }

  return { client, db };
};