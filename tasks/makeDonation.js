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
        const balanceBeforDonation = await ethers.utils.formatEther(balanceBefor);  
        console.log("Balance before donation: " + balanceBeforDonation);
        await myContract.connect(signer).donate({ value });
        const balanceAfter = await myContract.totalDonations();
        const balanceAfterDonation = await ethers.utils.formatEther(balanceAfter);  
        console.log("Balance after donation: " + balanceAfterDonation);
        
}
    
main()
.then(() => process.exit(0))    
.catch((error) => {
  console.error(error);
  process.exit(1);
});