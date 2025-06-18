import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

async function main(): Promise<void> {
  const [deployer]: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deploying NFT with:", deployer.address);

  const NFT = await ethers.getContractFactory("MyNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();

  console.log("MyNFT deployed to:", await nft.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
