require("@nomiclabs/hardhat-web3");
require('dotenv').config();
const { PRIVATE_KEY, URL_ALCHEMY } = process.env;

async function main() {

        const contractAddress = "0xe444bB4fB78476143dAf5910bD468a670EbF4F05";
        const provider = new ethers.providers.JsonRpcProvider(URL_ALCHEMY); // using default http://localhost:8545
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);
        const myContract = await ethers.getContractAt('Donation', contractAddress, signer);
        const description = await myContract.description();
        const owner = await myContract.owner();
        const balance = await myContract.totalDonations();
        const count = await myContract.donationsCount();
        const addr = await myContract.withdrewAddr();
        console.log("ContractInfo:\n" + 
        "Description: " + description + "\n" +
        "Rinkiby testNet contract address: 0xe444bB4fB78476143dAf5910bD468a670EbF4F05" + "\n" + 
        "Owner: " + owner + "\n" + 
        "total donations: " + balance + "\n" +
        "Donations count: " + count + "\n" +
        "Withdrew address: " + addr + "\n" 
        );
}

main()
.then(() => process.exit(0))    
.catch((error) => {
  console.error(error);
  process.exit(1);
});