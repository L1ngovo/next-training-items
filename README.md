#### 1 项目创建

- ```
  npx create-next-app@latest --typescript
  ```

#### 2 格式化工具配置

- Eslint

  > 查找、修复代码问题

  1） 下载VSCode插件

  2） 安装依赖

  3） 配置文件 .eslintrc.json

  ```
  {
      "extends": [ "next/core-web-vitals", 		"eslint:recommended" ]
  }
  ```

- Stylelint

  > 检查、修复CSS代码问题

  1） 下载VSCode插件

  2） 安装依赖

  3） 配置文件 .stylelintrc.json

  ```
  {
      "extends": "stylelint-config-standard-scss"
  }
  ```

- prettier

  > 统一代码风格

  1） 下载vscode插件

  2） 配置文件 .prettierrc

  ```json
  {
      "arrowParens": "always",
       // 箭头函数的参数始终带括号
      "bracketSpacing": true ,
      // 在对象的花括号和内容之间添加空格
      "endOfLine": "lf",
      // 换行符使用 LF（\n）
      "htmlWhitespaceSensitivity": "css",
      // HTML 中的空白敏感度遵循 CSS 的规则
      "insertPragma": false,
      // 不自动插入格式化指令
      "jsxBracketSameLine": false,
      // 多行 JSX 元素的 > 放在最后一行的末尾
      "jsxSingleQuote": false,
      // JSX 属性使用双引号
      "printWidth": 80,
      // 每行代码的最大长度为 80 个字符
      "proseWrap": "preserve",
      // 文本换行遵循原始文本的换行方式。
      "quoteProps": "as-needed",
      // 对象属性只在必要时使用引号。
      "requirePragma": false,
      // 不要求文件顶部有格式化指令。
      "semi": true,
      // 语句末尾加分号
      "singleQuote": true,
      // 使用单引号
      "tabWidth": 4,
      // 一个 Tab 键等于 4 个空格
      "trailingComma": "es5",
      // 在 ES5 中有效的尾随逗号（如对象和数组）
      "useTabs": false,
      // 使用空格而不是 Tab 键进行缩进
      "vueIndentScriptAndStyle": false,
      // Vue 文件中的 <script> 和 <style> 标签不缩进
      "parser": "babel"
      // 使用 Babel 解析器
  ```



#### 3 路由配置

- 在next中，路由路径由pages文件目录下的文件包名决定
  - 即 pages/index.tsx  决定了路径为 / 的展示内容
  - pages/tag/index.tsx 决定了路径 /tag 的展示内容
  - pages/blog/first-post.tsx 路径为 /blog/first-post







---

#### 相关问题解决

​	**1. Cannot find module ‘xxx’ from 'node_modules/rc-util/lib/hooks'**

- 搜索查询给出的解决方案如下

  - 删除node_modules，package.json后重装

  - 修改hooks文件名为Hooks再改为hooks

  - 确保提到的文件是存在的

  - > 以上方式尝试多次后并未解决

- 最终的解决方案为

  - 查看文件夹中的文件，可看到同名的文件存在 .ts 和 .js 类型

  - 在出错的地方把引入路径后添加文件类型后缀.js

  - > 或许是因为存在同名文件导致引入路径无法找到对应的js文件



​	**2. 在尝试连接mongodb的时候出现错误，Can't resolve 'net'**

> 错误产生的原因是因为 MongoDB 驱动依赖 Node.js 的核心模块 `net`，而 Next.js 在客户端构建时会尝试打包这些代码。解决方案需要 **明确分离服务端/客户端代码**，并调整 Webpack 配置

```typescript
// 连接工具文件相关代码
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
```



```typescript
// _app.tsx 启动项配置

import { connectToDatabase } from '../lib/mongodb';

if (
	typeof window === 'undefined' && // 服务端环境
	process.env.NODE_ENV === 'development'
) {
	import('../lib/mongodb')
		.then(({ connectToDatabase }) => connectToDatabase())
		.then(({ client }) => {
			console.log('🚀 服务端已连接 MongoDB');
		})
		.catch(console.error);
}
```



