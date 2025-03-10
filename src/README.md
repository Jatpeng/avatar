# 3D虚拟AI形象系统代码目录

本目录包含3D虚拟AI形象系统的所有源代码，按照前端和后端分别组织。

## 目录结构

### 前端代码结构

```
avatar-frontend/
├── public/
│   ├── assets/
│   │   ├── models/         # 3D模型资源
│   │   ├── textures/       # 纹理资源
│   │   └── animations/     # 动画资源
│   └── index.html
├── src/
│   ├── components/         # React组件
│   │   ├── common/         # 通用UI组件
│   │   ├── layout/         # 布局组件
│   │   ├── avatar/         # 形象相关组件
│   │   ├── editor/         # 编辑器组件
│   │   └── data-collection/ # 数据采集组件
│   ├── hooks/              # 自定义React Hooks
│   ├── services/           # API服务
│   ├── store/              # Redux状态管理
│   ├── utils/              # 工具函数
│   ├── three/              # Three.js相关代码
│   │   ├── core/           # 核心渲染逻辑
│   │   ├── loaders/        # 模型加载器
│   │   ├── controls/       # 控制器
│   │   └── effects/        # 特效
│   ├── ai/                 # AI相关代码
│   │   ├── feature-extraction/ # 特征提取
│   │   └── mapping/        # 参数映射
│   ├── App.tsx
│   └── index.tsx
```

### 后端代码结构

```
avatar-backend/
├── src/
│   ├── controllers/        # 控制器
│   ├── models/             # 数据模型
│   ├── routes/             # 路由定义
│   ├── services/           # 业务逻辑
│   │   ├── data-processing/ # 数据处理服务
│   │   ├── avatar-generation/ # 形象生成服务
│   │   └── user-management/ # 用户管理服务
│   ├── middleware/         # 中间件
│   ├── utils/              # 工具函数
│   ├── config/             # 配置文件
│   └── app.js              # 应用入口
```

## 技术栈

### 前端技术栈
- React.js 18+
- Three.js r150+
- Redux + Redux Toolkit
- Ant Design 5.0+
- Vite

### 后端技术栈
- Node.js 18+ LTS + Express
- MongoDB 6.0+
- RESTful API + GraphQL
- Socket.IO

### AI与计算机视觉
- OpenCV.js
- TensorFlow.js

## 开发指南

请参考docs目录下的技术文档进行开发。