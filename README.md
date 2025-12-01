# 秦强的博客 - Nebula Blog

基于 Next.js + MongoDB + TypeScript 的全栈博客系统

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **UI库**: React 19
- **样式**: Tailwind CSS v4
- **数据库**: MongoDB
- **ODM**: Mongoose
- **动画**: Framer Motion
- **图标**: Lucide React
- **Markdown渲染**: React Markdown

## 功能特性

✅ 文章 CRUD（创建、读取、更新、删除）
✅ 分类和标签系统
✅ 评论功能
✅ 点赞功能
✅ 文章搜索
✅ AI 辅助（标题生成、摘要生成）
✅ 管理员权限控制
✅ Markdown 编辑器
✅ 响应式设计

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动 MongoDB

确保 MongoDB 在本地运行：

```bash
# 默认连接地址
mongodb://localhost:27017/my-blog
```

### 3. 配置环境变量

在 `.env.local` 文件中配置：

```env
MONGODB_URI=mongodb://localhost:27017/my-blog
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3001](http://localhost:3001)

## API 端点

### 文章相关

- `GET /api/posts` - 获取所有文章
  - Query参数: `category`, `search`
- `POST /api/posts` - 创建文章
- `GET /api/posts/[id]` - 获取单篇文章
- `PUT /api/posts/[id]` - 更新文章
- `DELETE /api/posts/[id]` - 删除文章
- `POST /api/posts/[id]/like` - 点赞文章
- `POST /api/posts/[id]/comments` - 添加评论

## 项目结构

```
my-blog/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   └── posts/        # 文章相关 API
│   ├── post/[id]/        # 文章详情页
│   ├── write/            # 写作页
│   ├── edit/[id]/        # 编辑页
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 首页
│   └── globals.css       # 全局样式
├── lib/                   # 工具库
│   └── mongodb.ts        # MongoDB 连接
├── models/                # Mongoose 模型
│   └── Post.ts           # 文章模型
├── src/
│   ├── components/       # React 组件
│   ├── context/          # React Context
│   ├── pages/            # 页面组件
│   ├── services/         # 业务逻辑
│   └── types/            # TypeScript 类型
├── .env.local            # 环境变量
├── next.config.mjs       # Next.js 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 依赖配置
```

## 管理员登录


可以在 `src/context/AuthContext.tsx` 中修改密码。

## 构建生产版本

```bash
pnpm build
pnpm start
```

## License

MIT
