import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export interface networkConfigItem {
  name?: string;
  subscriptionId?: string;
  gasLane?: string;
  keepersUpdateInterval?: string;
  raffleEntranceFee?: BigNumber;
  callbackGasLimit?: string;
  vrfCoordinatorV2?: string;
  mintFee?: string;
  ethUsdPriceFeed?: string;
}

export interface networkConfigInfo {
  [key: number]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  31337: {
    name: "localhost",
    subscriptionId: "588",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
    keepersUpdateInterval: "30",
    raffleEntranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
    callbackGasLimit: "500000", // 500,000 gas
    mintFee: "10000000000000000", // 0.01 ETH
  },
  11155111: {
    name: "sepolia",
    subscriptionId: "588",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
    keepersUpdateInterval: "30",
    raffleEntranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
    callbackGasLimit: "500000", // 500,000 gas
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    mintFee: "10000000000000000", // 0.01 ETH
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  1: {
    name: "mainnet",
    keepersUpdateInterval: "30",
    mintFee: "10000000000000000", // 0.01 ETH
  },
};

export const developmentChains = ["hardhat", "localhost"];
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
