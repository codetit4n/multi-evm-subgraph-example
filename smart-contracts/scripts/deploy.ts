import { ethers, getDefaultProvider, Wallet, } from 'ethers';
import dotenv from 'dotenv'
dotenv.config()
import { abi as ABI, bytecode } from "../build/SubgraphNFT.json"

/* This script deploys the contracts to the following chains:
    1. Ethereum Goerli testnet.
    2. Mumbai Polygon testnet.
    3. Avalanche FUJI testnet.
    4. Fantom testnet.
    5. zkSync2-testnet.
    6. Moonbase alpha testnet - Moonbeam's testnet
*/

//@note Funds needed in all the above mentioned networks before deploying
const pvt_key = process.env.PVT_KEY;

(async () => {
    const premintOwners = ["0xc9D506209f57948a0C0df6ED45621Fb47572Af99", "0x5F5AC73C6d6192bEe9d38eF6775A3C3EAAADFb39", "0x0cbe4714e34CA34D25B71DF73c682504190449Ff", "0x702750eD7eD3D8999B09a4d7ba3C64A21B43E63f", "0xbB36afDB0D75C84Ad0c92c763a53A3C13221960e", "0x153DC7907BC187C0a47Fb3d38A32c877d35A3502"]
    if (pvt_key) {
        const wallet = new Wallet(pvt_key);
        // deploy on Ethereum Goerli
        const providerEthGoerli = getDefaultProvider('https://goerli.blockpi.network/v1/rpc/public'); // https://chainlist.org/chain/5
        const signerEthGoerli = wallet.connect(providerEthGoerli);
        const factoryEthGoerli = new ethers.ContractFactory(ABI, bytecode, signerEthGoerli);
        const contractEthGoerli = await factoryEthGoerli.connect(signerEthGoerli).deploy(premintOwners)
        console.log("Deployed on Ethereum Goerli at ", contractEthGoerli.address);
        // deploy on Polygon mumbai
        const providerMumbai = getDefaultProvider('https://polygon-mumbai.blockpi.network/v1/rpc/public'); // https://chainlist.org/chain/80001
        const signerMumbai = wallet.connect(providerMumbai);
        const factoryMumbai = new ethers.ContractFactory(ABI, bytecode, signerMumbai);
        const contractMumbai = await factoryMumbai.connect(signerMumbai).deploy(premintOwners)
        console.log("Deployed on Polygon mumbai at ", contractMumbai.address);
        // deploy on Avalanche FUJI
        const providerFuji = getDefaultProvider('https://rpc.ankr.com/avalanche_fuji'); // https://chainlist.org/chain/43113
        const signerFuji = wallet.connect(providerFuji);
        const factoryFuji = new ethers.ContractFactory(ABI, bytecode, signerFuji);
        const contractFuji = await factoryFuji.connect(signerFuji).deploy(premintOwners)
        console.log("Deployed on Avalanche FUJI at ", contractFuji.address);


    } else {
        console.error("❌ .env file with correct private key not found!")
    }

})();
