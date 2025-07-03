import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`🔧 Deploying contracts with: ${deployer.address}`);

  const initialSupply = ethers.parseUnits("1000000", 18); // 1M DIP

  // 1. DiploToken
  const DiploToken = await ethers.getContractFactory("MyToken");
  const diplo = await DiploToken.deploy(initialSupply);
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

  // Si usás `onlyOwner` en el mint del NFT, podés transferir ownership al deployer/marketplace:
  // await nft.transferOwnership(deployer.address); // o marketplace.address si lo necesita

  // Opcional: guardar direcciones en un archivo JSON
  /*
  const fs = require("fs");
  fs.writeFileSync("deployments.json", JSON.stringify({
    token: diplo.address,
    nft: nft.address,
    marketplace: marketplace.address
  }, null, 2));
  */
}

main().catch((error) => {
  console.error("❌ Error in deployment:", error);
  process.exitCode = 1;
});