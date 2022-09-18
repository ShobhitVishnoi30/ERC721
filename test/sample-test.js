const { expect } = require("chai");
const { ethers } = require("hardhat");

let user1, user2, user3;

async function getSigners() {
  const accounts = await hre.ethers.getSigners();
  user1 = accounts[0];
  user2 = accounts[1];
  user3 = accounts[2];
}
async function Testing() {
  const TestERC721 = await hre.ethers.getContractFactory("TestERC721");
  const testERC721 = await TestERC721.deploy("testERC721", "TERC");
  await testERC721.deployed();
  describe("testERC721", async function () {
    it("Should return the correct name and symbol", async function () {
      expect(await testERC721.name()).to.equal("testERC721");

      expect(await testERC721.symbol()).to.equal("TERC");
    });

    it("only owner can mint NFT", async function () {
      await expect(await testERC721.owner()).to.equal(user1.address);

      await expect(
        testERC721.connect(user2).safeMint(user2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("owner can mint NFT", async function () {
      await expect(await testERC721.owner()).to.equal(user1.address);

      expect(await testERC721.totalSupply()).to.equal("0");

      await testERC721.connect(user1).safeMint(user1.address);

      expect(await testERC721.totalSupply()).to.equal("1");
    });

    it("user can transfer NFT", async function () {
      expect((await testERC721.balanceOf(user1.address)).toString()).to.equal(
        "1"
      );
      expect(await testERC721.balanceOf(user2.address)).to.equal("0");

      expect(await testERC721.ownerOf("0")).to.equal(user1.address);

      await testERC721
        .connect(user1)
        .transferFrom(user1.address, user2.address, 0);

      expect(await testERC721.ownerOf("0")).to.equal(user2.address);

      expect((await testERC721.balanceOf(user1.address)).toString()).to.equal(
        "0"
      );
      expect(await testERC721.balanceOf(user2.address)).to.equal("1");
    });
  });
}

describe("Setup & Test Contracts", async function () {
  it("Setting up the contracts & Testing", async function () {
    await getSigners();
    await Testing();
  }).timedOut("200000s");
});
