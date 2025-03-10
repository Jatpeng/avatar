# 3D虚拟AI形象系统前端代码

本目录包含3D虚拟AI形象系统的前端实现代码。

## 技术栈

- React.js 18+
- Three.js r150+
- Redux + Redux Toolkit
- Ant Design 5.0+
- Vite

## 目录结构

```
public/
│   ├── assets/
│   │   ├── models/         # 3D模型资源
│   │   ├── textures/       # 纹理资源
│   │   └── animations/     # 动画资源
│   └── index.html
src/
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

## 开发指南

1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`
3. 构建生产版本：`npm run build`

详细的开发规范和指南请参考docs目录下的技术文档。