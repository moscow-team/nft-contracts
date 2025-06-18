import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    // configuración para nodo local de prueba
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // configuración para Mumbai (testnet)
    mumbai: {
      url: process.env.POLYGON_RPC!,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
