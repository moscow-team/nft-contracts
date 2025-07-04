import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`🔧 Deploying contracts with: ${deployer.address}`);
  // 1. DiploToken
  const DiploToken = await ethers.getContractFactory("DiploToken");
  const diplo = await DiploToken.deploy();
  await diplo.waitForDeployment();
  const diploAddress = await diplo.getAddress();
  console.log(`✅ DiploToken deployed at: ${diploAddress}`);

  // 2. NFTCollection
  const NFTCollection = await ethers.getContractFactory("MyNFT");
  const nft = await NFTCollection.deploy();
  await nft.waitForDeployment();
  const diploAddress2 = await nft.getAddress();
  console.log(`✅ NFTCollection deployed at: ${diploAddress2}`);

  // 3. Marketplace
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(diploAddress, diploAddress2);
  await marketplace.waitForDeployment();
  const diploAddress3 = await marketplace.getAddress();
  console.log(`✅ Marketplace deployed at: ${diploAddress3}`);
}

main().catch((error) => {
  console.error("❌ Error in deployment:", error);
  process.exitCode = 1;
});