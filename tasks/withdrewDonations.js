// вывод средств на withdrewAddr в определенном количестве 

require("@nomiclabs/hardhat-web3");
require('dotenv').config();
const { PRIVATE_KEY, WITHDREW_PRIVATE_KEY, URL_ALCHEMY } = process.env;

async function main() {
        
        const withdrewAddr = "0xD8b46be309a729f6BAcb48D32DeA5D4aAF3a8CDE";
        const contractAddress = "0xe444bB4fB78476143dAf5910bD468a670EbF4F05";
        const value = ethers.utils.parseEther('0.001');
        const value2 = "1000000000000000";
        const value3 = "0.001";
        const provider = new ethers.providers.JsonRpcProvider(URL_ALCHEMY); // using default http://localhost:8545
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);
        const myContract = await ethers.getContractAt('Donation', contractAddress, signer);
        
        const contractBalanceBefor = await myContract.totalDonations(); 
        const contractEthValueBefor = await ethers.utils.formatEther(contractBalanceBefor);  
        console.log("Contract balance before: " + contractEthValueBefor);

        const balancebefor = await provider.getBalance(withdrewAddr);
        const WithdreAddrEthValueBefor = await ethers.utils.formatEther(balancebefor);  
        console.log("Withdrew balance before: " + WithdreAddrEthValueBefor);
        
        await myContract.withdraw(value2);

        const contractBalanceAfter = await myContract.totalDonations(); 
        const contractEthBalanceAfter = await ethers.utils.formatEther(contractBalanceAfter);
        console.log("Contract balance after withdrew: " + contractEthBalanceAfter);
        
        const balanceAfter = await provider.getBalance(withdrewAddr);
        const withdreAddrEthValueBefor = await ethers.utils.formatEther(balanceAfter);  
        console.log("Withdrew balance after: " + withdreAddrEthValueBefor);
}
    
main()
.then(() => process.exit(0))    
.catch((error) => {
  console.error(error);
  process.exit(1);
});