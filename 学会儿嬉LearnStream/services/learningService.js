const { uploadToIPFS } = require('./ipfsService');
const { mintTokens } = require('./web3Service');
const LearningDataModel = require('../models/LearningDataModel');

// 记录学习数据
const recordLearningData = async (userId, data) => {
    try {
        // 上传到 IPFS
        const ipfsHash = await uploadToIPFS(data);
        
        // 保存到数据库
        const learningData = new LearningDataModel({
            userId,
            ipfsHash,
            createdAt: new Date(),
        });
        await learningData.save();

        // 铸造代币
        await mintTokens(userId, data.rewardAmount);

        return { ipfsHash, message: 'Data recorded and tokens minted.' };
    } catch (err) {
        console.error('Learning Data Error:', err);
        throw new Error('Failed to record learning data');
    }
};

// 获取学习数据
const getLearningData = async (userId) => {
    try {
        const data = await LearningDataModel.find({ userId });
        return data;
    } catch (err) {
        console.error('Get Learning Data Error:', err);
        throw new Error('Failed to get learning data');
    }
};

module.exports = { recordLearningData, getLearningData };