const Web3 = require('web3');
const { abi, address } = require('../config/contract');  // 合约 ABI 和地址
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

// 获取合约实例
const contract = new web3.eth.Contract(abi, address);

// 查询用户的代币余额
const getTokenBalance = async (address) => {
    try {
        const balance = await contract.methods.balanceOf(address).call();
        return balance;
    } catch (err) {
        console.error('Web3 Error:', err);
        throw new Error('Failed to get token balance');
    }
};

// 铸造代币
const mintTokens = async (recipient, amount) => {
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.mint(recipient, amount).send({ from: accounts[0] });
    } catch (err) {
        console.error('Mint Token Error:', err);
        throw new Error('Failed to mint tokens');
    }
};

module.exports = { getTokenBalance, mintTokens };