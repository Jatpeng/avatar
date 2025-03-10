/**
 * 3D虚拟AI形象系统后端入口文件
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');

// 创建Express应用实例
const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由配置（后续实现）
// const userRoutes = require('./routes/user.routes');
// const avatarRoutes = require('./routes/avatar.routes');
// app.use('/api/users', userRoutes);
// app.use('/api/avatars', avatarRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: '欢迎使用3D虚拟AI形象系统API' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

// 连接数据库（后续实现）
// mongoose.connect(config.mongoURI)
//   .then(() => console.log('MongoDB连接成功'))
//   .catch(err => console.error('MongoDB连接失败:', err));

module.exports = app;