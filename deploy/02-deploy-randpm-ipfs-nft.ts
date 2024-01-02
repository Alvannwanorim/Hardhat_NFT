import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";
import { handleTokenUris, storeImages } from "../utils/upload-to-pinata";

const imagesPaths = "./images/randomNft";

let tokenUris = [
  "ipfs://QmQs4yASJakykKzcUYiJoQEFptCuufghNA3S5J2CkD47tp",
  "ipfs://QmXry9jwWVKfbt6V87Gzd97WJ5LGAmtyWY7znSQXCRysv9",
  "ipfs://QmX5V7Xc31vMfM8tYgrNefix1WCFmiMqpLzjDtk6PgTQd2",
];
const FUND_AMOUNT = "1000000000000000000000";
async function handleTokenUri() {
  const uploadedItems = await storeImages(imagesPaths);
  return await handleTokenUris(uploadedItems);
}
const deploy: DeployFunction = async function () {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId!;

  if (process.env.UPLOAD_TO_PINATA === "true") {
    log("uploading images to pinata...");
    tokenUris = await handleTokenUri();
    log(tokenUris);
  }

  let vrfCoordinatorV2Address, subscriptionId;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await tx.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubScription(subscriptionId, FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }
  log("-------------------------------");
  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].callbackGasLimit,
    tokenUris,
    networkConfig[chainId].mintFee,
  ];

  const randomIpfsNft = await deploy("RandomIpfsNFT", {
    from: deployer,
    args: args,
    log: true,
  });
  log("-------------------------------");
  if (
    developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(randomIpfsNft.address, args);
  }
};

export default deploy;
deploy.tags = ["all", "randomipfs", "main"];
