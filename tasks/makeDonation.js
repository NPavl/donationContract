// сделать пожертвование 

require("@nomiclabs/hardhat-web3");
require('dotenv').config();
const { ethers } = require("hardhat");
const { PRIVATE_KEY, URL_ALCHEMY } = process.env;

async function main() {

        const contractAddress = "0xe444bB4fB78476143dAf5910bD468a670EbF4F05";
        const provider = new ethers.providers.JsonRpcProvider(URL_ALCHEMY); // using default http://localhost:8545
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);
        const myContract = await ethers.getContractAt('Donation', contractAddress, signer);
        const value = ethers.utils.parseEther('0.001');
        const balanceBefor = await myContract.totalDonations(); 
        console.log("Balance before donation: " + balanceBefor);
        await myContract.connect(signer).donate({ value });
        // await myContract.donate(value, {from: signer });
        await myContract.donate();
        const balanceAfter = await myContract.totalDonations(); 
        console.log("Balance after donation: " + balanceAfter);
        
}
    
main()
.then(() => process.exit(0))    
.catch((error) => {
  console.error(error);
  process.exit(1);
});