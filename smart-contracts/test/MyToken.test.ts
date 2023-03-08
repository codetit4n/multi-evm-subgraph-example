import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import { MyToken as MyTokenType } from '../build/types';
import MyToken from '../build/MyToken.json';

use(solidity);

// @todo
describe('MyToken tests', () => {
    const [wallet, walletTo] = new MockProvider().getWallets();
    let token: Contract;

    beforeEach(async () => {
        // token = await deployContract(wallet, MyToken);
    });

    it('Test', async () => {
        // console.log(token.address);
    });
});