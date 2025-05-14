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

