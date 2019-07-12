const chai = require('chai');
const {createMockProvider, deployContract, getWallets, solidity} = require('ethereum-waffle');
const BasicTokenMock = require('../build/BasicTokenMock');
const Splitter = require('../build/Splitter');


chai.use(solidity);
const {expect} = chai;

describe('Spliiter tests', () => {
  let provider = createMockProvider();
  let [contractOwner, sender, feeCollector, ...beneficiaries] = getWallets(provider);
  let token;

  beforeEach(async () => {
    token = await deployContract(contractOwner, BasicTokenMock, [sender.address, 1000]);
    const beneficiariesAddrs = beneficiaries.map(b => b.address);
    splitter = await deployContract(contractOwner, Splitter, [token.address, beneficiariesAddrs, feeCollector.address]);
  });


  it('Assigns initial balance', async () => {
    expect(await token.balanceOf(sender.address)).to.eq(1000);
  });

  it('Reverts when no funds to cover fee', async() => {
    const splitterFromSender = splitter.connect(sender);
    await expect(splitter.split(3)).to.be.reverted;
  });

  it('Reverts when no enough funds after covering fee', async() => {
    await expect(splitter.split(6)).to.be.reverted;
  });

  it('Splits tokens properly between beneficiaries and fee collector', async() => {
    const splitterFromSender = splitter.connect(sender);
    const tokenFromSender = token.connect(sender);

    await tokenFromSender.approve(splitter.address, 20);
    await splitterFromSender.split(20);

    expect(await token.balanceOf(feeCollector.address)).to.eq(5);
    for(let i=0; i < beneficiaries.length; i++){
      expect(await token.balanceOf(beneficiaries[i].address)).to.eq(2);
    }
    expect(await token.balanceOf(feeCollector.address)).to.eq(5);
  });

});
