const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Desplegando contratos con la cuenta:", deployer.address);

    const PublicBudget = await hre.ethers.getContractFactory("PublicBudget");
    const publicBudget = await PublicBudget.deploy();

    // Esperar a que el contrato se encuentre completamente desplegado
    await publicBudget.waitForDeployment();

    console.log("PublicBudget desplegado en:", await publicBudget.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });