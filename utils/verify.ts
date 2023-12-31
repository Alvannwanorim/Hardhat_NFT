import { run } from "hardhat";
const verify = async function (constractAddress: string, args: any[]) {
  console.log("verifying contract");
  try {
    await run("verify:verify", {
      address: constractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("already verified");
    } else {
      console.log(e);
    }
  }
};

export default verify;
