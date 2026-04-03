const { ipfs } = require('../config');

// 上传数据到 IPFS
const uploadToIPFS = async (data) => {
    try {
        const buffer = Buffer.from(JSON.stringify(data));
        const result = await ipfs.add(buffer);
        return result.path; // 返回 IPFS 哈希
    } catch (err) {
        console.error('IPFS Upload Error:', err);
        throw new Error('Failed to upload to IPFS');
    }
};

module.exports = { uploadToIPFS };