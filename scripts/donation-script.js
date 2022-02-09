const hre = require("hardhat");
async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Donation = await ethers.getContractFactory("Donation");
  const donation = await Donation.deploy("Donation contract", "0xD8b46be309a729f6BAcb48D32DeA5D4aAF3a8CDE");

  console.log("Donation contract address:", donation.address);

  const data = {
    address: donation.address,
    abi: JSON.parse(donation.interface.format("json"))
  };
  fs.writeFileSync('frontend/packages/contracts/src/abis/Donation.json', JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
