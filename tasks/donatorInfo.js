// получить список пожертвователей, и информацию по каждому пожертвователю 

// require("@nomiclabs/hardhat-web3");
const { ethers } = require("hardhat");
require('dotenv').config();
const { PRIVATE_KEY, URL_ALCHEMY } = process.env;

async function main() {

    const contractAddress = "0xe444bB4fB78476143dAf5910bD468a670EbF4F05";
    const provider = new ethers.providers.JsonRpcProvider(URL_ALCHEMY); // using default http://localhost:8545
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const myContract = await ethers.getContractAt('Donation', contractAddress, signer);
    const chekByAddress = await myContract.chekDonatorByAddress("0xaF3f0ba2848093D6eEaF4109bfD9A9FbbBA1f470");
    const chekById = await myContract.chekDonatorById(1);

    console.log(chekByAddress);
    console.log("Donator address by id: " + chekById);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });