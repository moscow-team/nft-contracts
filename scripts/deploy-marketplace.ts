import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

async function main(): Promise<void> {
  const [deployer]: SignerWithAddress[] = await ethers.getSigners();

  // Reemplaza aquí con las direcciones reales
  const paymentTokenAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const nftContractAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  console.log("Deploying Marketplace with:", deployer.address);
  console.log("Payment token:", paymentTokenAddr);
  console.log("NFT contract:", nftContractAddr);

  const Market = await ethers.getContractFactory("Marketplace");
  const market = await Market.deploy(paymentTokenAddr, nftContractAddr);
  await market.waitForDeployment();

  console.log("Marketplace deployed to:", await market.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
