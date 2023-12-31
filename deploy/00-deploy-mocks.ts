import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { developmentChains } from "../helper-hardhat-config";

const deploy: DeployFunction = async function (){
    const BASE_FEE = ethers.utils.parseEther("0.25");
    const GAS_PRICE_LINK = 1e9;

    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if(developmentChains.includes(network.name)){
        log(" Local network detected, Deploying mocks.")

        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args
        })
        log(" Mocks Deployed")
        log("----------------------------------------")
    }
}

export default deploy
deploy.tags =["all","mocks"]