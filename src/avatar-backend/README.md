# 3D虚拟AI形象系统后端代码

本目录包含3D虚拟AI形象系统的后端实现代码。

## 技术栈

- Node.js 18+ LTS + Express
- MongoDB 6.0+
- RESTful API + GraphQL
- Socket.IO

## 目录结构

```
src/
├── controllers/        # 控制器
├── models/             # 数据模型
├── routes/             # 路由定义
├── services/           # 业务逻辑
│   ├── data-processing/ # 数据处理服务
│   ├── avatar-generation/ # 形象生成服务
│   └── user-management/ # 用户管理服务
├── middleware/         # 中间件
├── utils/              # 工具函数
├── config/             # 配置文件
└── app.js              # 应用入口
```

## 开发指南

1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`
3. 构建生产版本：`npm run build`

详细的开发规范和指南请参考docs目录下的技术文档。