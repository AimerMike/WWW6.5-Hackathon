const express = require('express');
const router = express.Router();
const { recordLearningData, getLearningData } = require('../services/learningService');

// 记录学习数据
router.post('/:userId/record', async (req, res) => {
    try {
        const result = await recordLearningData(req.params.userId, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 获取用户学习数据
router.get('/:userId/data', async (req, res) => {
    try {
        const learningData = await getLearningData(req.params.userId);
        res.status(200).json(learningData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;