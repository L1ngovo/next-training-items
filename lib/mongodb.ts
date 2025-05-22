import { MongoClient, MongoClientOptions } from 'mongodb';

// 扩展全局类型声明
declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  // 注意：新版本驱动已自动处理下列选项，可以省略
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  maxPoolSize: 10,  // 连接池大小
  socketTimeoutMS: 45000, // 套接字超时
};

if (!uri) {
  throw new Error('请添加 MONGODB_URI 到环境变量');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
if (typeof window !== 'undefined') {
  throw new Error('❌ MongoDB 连接工具只能在服务端使用');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
    
    // 添加连接成功提示
    global._mongoClientPromise
      .then(() => console.log('✅ MongoDB 连接成功'))
      .catch(err => console.error('❌ MongoDB 连接失败:', err));
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// 导出类型安全的连接
export const connectToDatabase = async () => {
  const client = await clientPromise;
  return { client, db: client.db() };
};

// 初始化检查（仅开发环境）
if (process.env.NODE_ENV === 'development') {
  clientPromise
    .then(() => console.log('📦 MongoDB 连接已就绪'))
    .catch(err => console.error('⚠️ MongoDB 初始化错误:', err));
}