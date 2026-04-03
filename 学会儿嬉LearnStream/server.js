const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./api/userRoutes');
const learningRoutes = require('./api/learningRoutes');
const authRoutes = require('./api/authRoutes');
const { connectDB } = require('./config');
const cronJobs = require('./cronJobs');

// 初始化 Express 应用
const app = express();
const port = process.env.PORT || 5000;

// 使用 CORS 和 Body-Parser 中间件
app.use(cors());
app.use(bodyParser.json());

// 路由
app.use('/api/users', userRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/auth', authRoutes);

// 数据库连接
connectDB();

// 启动定时任务
cronJobs();

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});