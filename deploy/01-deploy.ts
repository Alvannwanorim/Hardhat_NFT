import { deployments, getNamedAccounts, network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { developmentChains } from "../helper-hardhat-config"
import verify from "../utils/verify"
const deploy: DeployFunction = async function(){
    const {deployer} = await getNamedAccounts()
    const {deploy, log} = deployments
    log("----------------------------")
    const args = [""]
    const basicNFT = await deploy("BasicNFT", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 1

    })
    if(developmentChains.includes(network.name)&& process.env.ETHERSCAN_API_KEY){
        await verify(basicNFT.address, args)
    }
}

export default deploy
deploy.tags =["all", "basicNFT"]