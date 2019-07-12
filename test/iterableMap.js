const chai = require('chai');
const {createMockProvider, deployContract, getWallets, solidity} = require('ethereum-waffle');
const IterableMap = require('../build/IterableMap');


chai.use(solidity);
const {expect} = chai;

describe('Itarable map tests', () => {
  let provider = createMockProvider();
  let [wallet, walletTo] = getWallets(provider);
  let map;

  beforeEach(async () => {
    map = await deployContract(wallet, IterableMap, []);
    await map.put(101, 123);
    await map.put(103, 555);
    await map.put(102, 444);
    await map.put(106, 9);

  });

  it('Returns proper key', async () => {
    expect(await map.getKey(0)).to.eq(101);
  });

  it('Returns proper value by key', async () => {
    expect(await map.getValue(101)).to.eq(123);
  });

  it('Returns proper lenght', async () => {
    expect(await map.len()).to.eq(4);
  });

  it('Iterates over map', async () => {
    var i;
    var list = new Array();
    for(i=0; i<await map.len();i++){
      list.push(await map.getValue(map.getKey(i)))
    }
    expect(list[0]).to.eq(123);
    expect(list[1]).to.eq(555);
    expect(list[2]).to.eq(444);
    expect(list[3]).to.eq(9);
  });

  it('Changes value under key', async () => {
    await map.put(101, 111);
    expect(await map.getValue(101)).to.eq(111);
  });

  it('Returns false on no key', async () => {
    expect(await map.hasKey(111)).to.eq(false);
  });

  it('Reverts when no value under key', async () => {
    await expect(map.getValue(111)).to.be.reverted;
  });

});
