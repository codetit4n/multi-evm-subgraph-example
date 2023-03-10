import { expect, use } from 'chai';
import { BigNumber, Contract, ethers } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import SubgraphNFTArtifacts from '../build/SubgraphNFT.json';

use(solidity);

function toBn(num: any): BigNumber {
    return BigNumber.from(num);
}

describe('SubgraphNFT tests', () => {
    const [owner, ankit, bhuvan, chitra, divya, ekta, fateh, gagan] = new MockProvider().getWallets();
    let token: Contract;

    const baseURI = "https://ipfs.io/ipfs/QmZ5cimfzWZ754CYBaWd7UgRcfS9vGKztgpm96W26Qem6L/testNFTs/";

    beforeEach(async () => {
        token = await deployContract(owner, SubgraphNFTArtifacts,
            [[
                ankit.address,
                bhuvan.address,
                chitra.address,
                divya.address,
                ekta.address,
                fateh.address
            ]]);
    });

    it('Contract deployed successfully with right state variables', async () => {
        expect(token.address).to.not.equal(ethers.constants.AddressZero);
    });

    it('Name, Symbol, baseURI and Owner should be set correctly in the deployed contract', async () => {
        expect(await token.name()).to.equal("SubgraphNFT");
        expect(await token.symbol()).to.equal("sNFT");
        expect(await token.baseURI()).to.equal(baseURI);
        expect(await token.owner()).to.equal(owner.address);
    })

    it('6 tokens should be pre-minted correctly to the correct addresses', async () => {
        await expect(token.ownerOf(toBn(0))).to.revertedWith('ERC721: invalid token ID');
        expect(await token.ownerOf(toBn(1))).to.equal(ankit.address);
        expect(await token.balanceOf(ankit.address)).to.equal(toBn(1));
        expect(await token.ownerOf(toBn(2))).to.equal(bhuvan.address);
        expect(await token.balanceOf(bhuvan.address)).to.equal(toBn(1));
        expect(await token.ownerOf(toBn(3))).to.equal(chitra.address);
        expect(await token.balanceOf(chitra.address)).to.equal(toBn(1));
        expect(await token.ownerOf(toBn(4))).to.equal(divya.address);
        expect(await token.balanceOf(divya.address)).to.equal(toBn(1));
        expect(await token.ownerOf(toBn(5))).to.equal(ekta.address);
        expect(await token.balanceOf(ekta.address)).to.equal(toBn(1));
        expect(await token.ownerOf(toBn(6))).to.equal(fateh.address);
        expect(await token.balanceOf(fateh.address)).to.equal(toBn(1));
        await expect(token.ownerOf(toBn(7))).to.revertedWith('ERC721: invalid token ID');
    })

    it('URIs of the pre-minted tokens should be set correctly', async () => {
        await expect(token.tokenURI(toBn(0))).to.revertedWith('SubgraphNFT: Non Existent Token');
        expect(await token.tokenURI(toBn(1))).to.equal(baseURI + "1.json");
        expect(await token.tokenURI(toBn(2))).to.equal(baseURI + "2.json");
        expect(await token.tokenURI(toBn(3))).to.equal(baseURI + "3.json");
        expect(await token.tokenURI(toBn(4))).to.equal(baseURI + "4.json");
        expect(await token.tokenURI(toBn(5))).to.equal(baseURI + "5.json");
        expect(await token.tokenURI(toBn(6))).to.equal(baseURI + "6.json");
        await expect(token.tokenURI(toBn(7))).to.revertedWith('SubgraphNFT: Non Existent Token');
    })

    it('Should revert if someone other then the contract owner tries to mint an NFT', async () => {
        await expect(token.connect(gagan).safeMint(ankit.address)).to.revertedWith('Ownable: caller is not the owner');
    })

    it('Owner should be able to mint new NFTs', async () => {
        try {
            await token.safeMint(gagan.address);
        } catch (err) {
            console.log(err);
        }
        expect(await token.ownerOf(toBn(7))).to.equal(gagan.address);
        expect(await token.balanceOf(gagan.address)).to.equal(toBn(1));
        expect(await token.tokenURI(toBn(7))).to.equal(baseURI + "7.json");
    })

    const newBaseURI = "https://new-uri.com/";

    it('Should revert if someone other than the owner tries to change the base URI', async () => {
        await expect(token.connect(bhuvan).setBaseURI(newBaseURI)).to.revertedWith('Ownable: caller is not the owner');
    })

    it('Owner should be able to change the base URI', async () => {
        try {
            await token.setBaseURI(newBaseURI);
        } catch (err) {
            console.log(err);
        }
        expect(await token.baseURI()).to.equal(newBaseURI);
    })
});