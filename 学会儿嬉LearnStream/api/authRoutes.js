const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../services/authService');

// 注册
router.post('/register', async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 登录
router.post('/login', async (req, res) => {
    try {
        const user = await loginUser(req.body);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;