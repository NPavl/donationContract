require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require('dotenv').config();
const { ALCHEMY_API_KEY, PRIVATE_KEY, INFURA_API_KEY, ETHERSCAN_API_KEY } = process.env;
require("@nomiclabs/hardhat-etherscan");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
}),

  task("balance", "Prints an account's balance")
    .addParam("account", "The account's address")
    .setAction(async (taskArgs) => {
      const account = web3.utils.toChecksumAddress(taskArgs.account);
      const balance = await web3.eth.getBalance(account);

      console.log(web3.utils.fromWei(balance, "ether"), "ETH");
    });

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkiby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
      network_id: 4
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
      network_id: 3
    },
    // bcs_test: {
    //   url: `https://mainnet.infura.io/v3/${ALCHEMY_API_KEY}`,
    //   accounts: [`0x${PRIVATE_KEY}`],
    //   network_id: 97
    // }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
