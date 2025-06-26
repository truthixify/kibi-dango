import {
  deployContract,
  executeDeployCalls,
  exportDeployments,
  deployer,
} from "./deploy-contract";
import { green } from "./helpers/colorize-log";

/**
 * Deploy a contract using the specified parameters.
 *
 * @example (deploy contract with constructorArgs)
 * const deployScript = async (): Promise<void> => {
 *   await deployContract(
 *     {
 *       contract: "YourContract",
 *       contractName: "YourContractExportName",
 *       constructorArgs: {
 *         owner: deployer.address,
 *       },
 *       options: {
 *         maxFee: BigInt(1000000000000)
 *       }
 *     }
 *   );
 * };
 *
 * @example (deploy contract without constructorArgs)
 * const deployScript = async (): Promise<void> => {
 *   await deployContract(
 *     {
 *       contract: "YourContract",
 *       contractName: "YourContractExportName",
 *       options: {
 *         maxFee: BigInt(1000000000000)
 *       }
 *     }
 *   );
 * };
 *
 *
 * @returns {Promise<void>}
 */
const deployScript = async (): Promise<void> => {
  const { address: kibiAddress } = await deployContract({
    contract: "KibiToken",
    constructorArgs: {
      name: "Kibi",
      symbol: "KIBI",
      decimals: 18,
      owner: deployer.address,
    },
  });

  const { address: nftAddress } = await deployContract({
    contract: "PirateNFT",
    constructorArgs: {
      name: "Dango",
      symbol: "DANGO",
      base_uri: "https://kibi-dango.com/",
      owner: deployer.address,
    },
  });

  const { address: bankAddress } = await deployContract({
    contract: "KibiBank",
    constructorArgs: {
      owner: deployer.address,
      kibi_token: kibiAddress,
    },
  });

  await deployContract({
    contract: "PuzzleGame",
    constructorArgs: {
      owner: deployer.address,
      kibi_bank: bankAddress,
      pirate_nft: nftAddress,
      min_bounty_easy: "3000000000000000000000",
      min_bounty_medium: "5000000000000000000000",
      min_bounty_hard: "7000000000000000000000",
      ai_reward: "1000000000000000000000",
    },
  });
};

const main = async (): Promise<void> => {
  try {
    await deployScript();
    await executeDeployCalls();
    exportDeployments();

    console.log(green("All Setup Done!"));
  } catch (err) {
    console.log(err);
    process.exit(1); //exit with error so that non subsequent scripts are run
  }
};

main();
