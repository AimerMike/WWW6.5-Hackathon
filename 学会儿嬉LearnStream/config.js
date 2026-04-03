require('dotenv').config();
const mongoose = require('mongoose');

// 数据库连接
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB Connected");
    } catch (err) {
        console.error(err);
        process.exit(1); // 终止进程
    }
};

// IPFS 配置（IPFS 客户端）
const { create } = require('ipfs-http-client');
const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

module.exports = { connectDB, ipfs };