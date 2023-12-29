import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "hardhat-gas-reporter"
import "dotenv/config"
import "solidity-coverage"
import "hardhat-deploy"
import { HardhatUserConfig } from "hardhat/config"
const config: HardhatUserConfig = {
  solidity: "0.8.19",
  namedAccounts: {
    deployer: {
      default: 0
    }
  }
};

export default config;
