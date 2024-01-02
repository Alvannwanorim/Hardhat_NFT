import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import fs from "fs";
import verify from "../utils/verify";
const deploy: DeployFunction = async function () {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId!;

  let ethUsedPriceAddress;
  if (developmentChains.includes(network.name)) {
    const EthUsdAggregator = await ethers.getContract("MockV3Aggregator");
    ethUsedPriceAddress = EthUsdAggregator.address;
  } else {
    ethUsedPriceAddress = networkConfig[chainId].ethUsdPriceFeed;
  }

  const lowSVG = fs.readFileSync("./images/dynamicNft/frown.svg", {
    encoding: "utf8",
  });
  const highSVG = fs.readFileSync("./images/dynamicNft/happy.svg", {
    encoding: "utf8",
  });

  log("---------------------------------------");

  const args = [ethUsedPriceAddress, lowSVG, highSVG];
  const dynamicSvgNft = await deploy("DyanamicSvgNft", {
    from: deployer,
    args: args,
    log: true,
  });

  if (
    developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(dynamicSvgNft.address, args);
  }
};

export default deploy;

deploy.tags = ["all", "dyanmicsvg", "main"];
