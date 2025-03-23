require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

module.exports = {
    solidity: "0.8.28",
    networks: {
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL, // URL de Sepolia (obtenida de Alchemy)
            accounts: [process.env.PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY // API Key Etherscan
    }
};
