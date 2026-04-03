const express = require('express');
const router = express.Router();
const { getUserData, updateUserData } = require('../services/learningService');

// 获取用户数据
router.get('/:userId', async (req, res) => {
    try {
        const userData = await getUserData(req.params.userId);
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 更新用户数据
router.put('/:userId', async (req, res) => {
    try {
        const updatedData = await updateUserData(req.params.userId, req.body);
        res.status(200).json(updatedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;