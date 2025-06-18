import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

async function main(): Promise<void> {
  const [deployer]: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Despliegue
  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy(1_000_000n * 10n ** 18n);

  // Espera a que termine el deploy
  await token.waitForDeployment();

  // Resuelve la dirección antes de imprimirla
  const deployedAddress = await token.getAddress();
  console.log("MyToken deployed to:", deployedAddress);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
