require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require('dotenv').config();
const { ALCHEMY_API_KEY, PRIVATE_KEY, INFURA_API_KEY, ETHERSCAN_API_KEY, URL_ALCHEMY } = process.env;
require("@nomiclabs/hardhat-etherscan");
require('solidity-coverage');

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


    task("contractInfo", "interact-with-a-deployed-contract")
    .setAction(async () => {
        const contractAddress = "0xe444bB4fB78476143dAf5910bD468a670EbF4F05";
        const provider = new ethers.providers.JsonRpcProvider(URL_ALCHEMY); // using default http://localhost:8545
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);
        const myContract = await ethers.getContractAt('Donation', contractAddress, signer);
        const owner = await myContract.owner();
        const balance = await myContract.totalDonations();
        const count = await myContract.donationsCount();
        const addr = await myContract.withdrewAddr();
        console.log("ContractInfo:\n" + 
        "Owner: " + owner + "\n" + 
        "total donations: " + balance + "\n" +
        "Donations count: " + count + "\n" +
        "Withdrew address: " + addr + "\n"
        );
    })

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkiby: {
      url: URL_ALCHEMY, // `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
      network_id: 4
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
      network_id: 3
    },
    // hardhat: {
    //   forking: {
    //     url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
    //   }
    // },
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
