const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deployment", () => {

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    owner = accounts[0]; withdrewAddr = accounts[1]; donator = accounts[2];
    description = 'Donation contract';
    Donation = await ethers.getContractFactory("Donation");
    donation = await Donation.deploy(description, withdrewAddr.address);
    await donation.deployed();
  });

  it('set the right owner', async () => {
    const actual = await donation.owner();
    assert.equal(actual, owner.address, " owner address should match");
  });

  it('set the right description', async () => {
    const actual = await donation.description();
    assert.equal(actual, description, "description should match");
  });

  it('set the right withdrew address', async () => {
    const actual = await donation.withdrewAddr();
    assert.equal(actual, withdrewAddr.address, "withdrew address should match");
  });
});

describe('make Donations', () => {

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    owner = accounts[0]; withdrewAddr = accounts[1]; donator = accounts[2];
    value = ethers.utils.parseEther('0.1');
    lowValue = ethers.utils.parseEther('0.0001');
    description = 'Donation contract';
    Donation = await ethers.getContractFactory("Donation");
    donation = await Donation.deploy(description, withdrewAddr.address);
    await donation.deployed();
  });

  it("increase donationsCount", async () => {
    const currentDonationsCount = await donation.connect(donator).totalDonationsCount();
    await donation.connect(donator).donate({ value });
    const newDonationsCount = await donation.connect(donator).totalDonationsCount();

    assert.equal(1, newDonationsCount - currentDonationsCount, "donationsCount should increment by 1");
  });

  it("increase totalDonations balance", async () => {
    const currentTotalDonations = await donation.totalDonationBalance();
    await donation.connect(donator).donate({ value });
    const newTotalDonations = await donation.totalDonationBalance();

    const diff = newTotalDonations - currentTotalDonations;

    assert.equal(diff, value, "difference should match the donation value");
  });

  it('payment should be more then 0.001ETH', async () => {
    let ERROR_MSG = 'donation amount less than required';
    try {
      await donation.connect(donator).donate({ lowValue });
    } catch (error) {
      ERROR_MSG = error;
    }
    assert.isOk(ERROR_MSG instanceof Error);
  });
});

describe('chek donator by address, id', () => {

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    owner = accounts[0]; withdrewAddr = accounts[1]; donator = accounts[2];
    value = ethers.utils.parseEther('0.1');
    description = 'Donation contract';
    Donation = await ethers.getContractFactory("Donation");
    donation = await Donation.deploy(description, withdrewAddr.address);
    await donation.deployed();
  });

  it("donator data by address", async () => {
    await donation.connect(donator).donate({ value });
    const resp = await donation.connect(donator).chekDonatorByAddress(donator.address);
    const id = resp[0][0];
    const actual = resp[1][0];
    const date = resp[2][0];

    assert(id, "id should be present");
    expect(value).to.equal(actual);
    assert(date, "date should be present");
  });

  it("donator address by id", async () => {
    await donation.connect(donator).donate({ value });
    const resp = await donation.connect(donator).chekDonatorById(1);

    expect(donator.address).to.equal(resp);
  });
});

describe('set address for withdrew function', () => {

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    owner = accounts[0]; withdrewAddr = accounts[1]; newAddrForWithdrew = accounts[2];
    description = 'Donation contract';
    Donation = await ethers.getContractFactory("Donation");
    donation = await Donation.deploy(description, withdrewAddr.address);
    await donation.deployed();
  });

  it("updated withdrewAddr when called by owner account", async () => {
    await donation.setAddrForWithdrew(newAddrForWithdrew.address, { from: owner.address });
    const actual = await donation.withdrewAddr();
    assert.equal(actual, newAddrForWithdrew.address, "withdrewAddr should match");
  });

  it("throws and error when called from a non-owner account", async () => {
    try {
      await donation.setAddrForWithdrew(newAddrForWithdrew.address, { from: accounts[2].address });
      assert.fail("withdraw was not restricted to owners")
    } catch (err) {
      const expectedError = "Contract with a Signer cannot override from"
      const actualError = err.reason;
      assert.equal(actualError, expectedError, "should not be permitted")
    }
  });
});

describe('withdraw funds and access control for withdrew function', () => {

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    owner = accounts[0]; withdrewAddr = accounts[1]; donator = accounts[2]; notOwner = accounts[3];
    description = 'Donation contract';
    value = ethers.utils.parseEther('0.2');
    withdrewValue = ethers.utils.parseEther('0.1');
    Donation = await ethers.getContractFactory("Donation");
    donation = await Donation.deploy(description, withdrewAddr.address);
    await donation.deployed();
    await donation.connect(donator).donate(
      { value: ethers.utils.parseEther('0.2') } );
  });

  it("transfers balance to withdrew address", async () => {
    const currentContractBalance = await ethers.provider.getBalance(donation.address);
    const currentwithdrewAddrBalance = await ethers.provider.getBalance(withdrewAddr.address);
    await donation.withdraw(withdrewValue);
    const newContractBalance = await ethers.provider.getBalance(donation.address);
    const newWithdrewAddrBalance = await ethers.provider.getBalance(withdrewAddr.address);
    const withdrewAddrDifference = newWithdrewAddrBalance.sub(currentwithdrewAddrBalance);
    expect(newContractBalance).to.equal(withdrewValue);
    expect(withdrewAddrDifference).to.equal(withdrewValue);
  });

  it("throws and error when called from a non-owner account", async () => {
    await expect(
      donation.connect(notOwner).withdraw(withdrewValue)).to.be.revertedWith("reverted with reason string 'Ownable: caller is not the owner'");
  });

  it("permits the owner to call the function", async () => {
    try {
      await donation.withdraw(withdrewValue);
      assert(true, "no errors were thrown");
    } catch (err) {
      assert.fail("should not have thrown an error");
    }
  });
});



