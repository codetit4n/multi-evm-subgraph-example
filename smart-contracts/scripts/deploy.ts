import { ethers, getDefaultProvider, Wallet, } from 'ethers';
import { abi as ABI, bytecode } from "../build/SubgraphNFT.json"
import dotenv from 'dotenv'
dotenv.config()

/* This script deploys the contracts to the following chains:
    1. Ethereum Goerli testnet.
    2. Mumbai Polygon testnet.
    3. Optimism goerli.
    4. Avalanche FUJI testnet.
    5. Fantom testnet.
    6. Moonbase alpha testnet - Moonbeam's testnet.
*/

//@note Funds needed in all the above mentioned networks before deploying
const pvt_key = process.env.PVT_KEY;

(async () => {
    // const premintOwners = ["0xc9D506209f57948a0C0df6ED45621Fb47572Af99", "0x5F5AC73C6d6192bEe9d38eF6775A3C3EAAADFb39", "0x0cbe4714e34CA34D25B71DF73c682504190449Ff", "0x702750eD7eD3D8999B09a4d7ba3C64A21B43E63f", "0xbB36afDB0D75C84Ad0c92c763a53A3C13221960e", "0x153DC7907BC187C0a47Fb3d38A32c877d35A3502"]
    if (pvt_key) {
        try {
            const wallet = new Wallet(pvt_key);
            // 1. deploy on Ethereum Goerli
            // const providerEthGoerli = getDefaultProvider('https://goerli.blockpi.network/v1/rpc/public'); // https://chainlist.org/chain/5
            // const signerEthGoerli = wallet.connect(providerEthGoerli);
            // const factoryEthGoerli = new ethers.ContractFactory(ABI, bytecode, signerEthGoerli);
            // const contractEthGoerli = await factoryEthGoerli.connect(signerEthGoerli).deploy(premintOwners)
            // await contractEthGoerli.deployed();
            // console.log("Deployed on Ethereum Goerli at ", contractEthGoerli.address);
            // 2. deploy on Polygon mumbai
            const providerMumbai = getDefaultProvider('https://polygon-mumbai.blockpi.network/v1/rpc/public'); // https://chainlist.org/chain/80001
            const signerMumbai = wallet.connect(providerMumbai);
            const factoryMumbai = new ethers.ContractFactory(ABI, bytecode, signerMumbai);
            const contractMumbai = await factoryMumbai.connect(signerMumbai).deploy()
            await contractMumbai.deployed();
            console.log("Deployed on Polygon Mumbai at ", contractMumbai.address);
            // 3. deploy on Optimism goerli
            // const providerOptGoerli = getDefaultProvider('https://goerli.optimism.io'); // https://chainlist.org/chain/420
            // const signerOptGoerli = wallet.connect(providerOptGoerli);
            // const factoryOptGoerli = new ethers.ContractFactory(ABI, bytecode, signerOptGoerli);
            // const contractOptGoerli = await factoryOptGoerli.connect(signerOptGoerli).deploy(premintOwners)
            // await contractOptGoerli.deployed();
            // console.log("Deployed on Optimism Goerli at ", contractOptGoerli.address);
            // // 4. deploy on Avalanche FUJI
            // const providerFuji = getDefaultProvider('https://rpc.ankr.com/avalanche_fuji'); // https://chainlist.org/chain/43113
            // const signerFuji = wallet.connect(providerFuji);
            // const factoryFuji = new ethers.ContractFactory(ABI, bytecode, signerFuji);
            // const contractFuji = await factoryFuji.connect(signerFuji).deploy(premintOwners)
            // await contractFuji.deployed();
            // console.log("Deployed on Avalanche FUJI at ", contractFuji.address);
            // // 5. deploy on Fantom testnet
            // const providerFantom = getDefaultProvider('https://rpc.testnet.fantom.network'); // https://chainlist.org/chain/4002
            // const signerFantom = wallet.connect(providerFantom);
            // const factoryFantom = new ethers.ContractFactory(ABI, bytecode, signerFantom);
            // const contractFantom = await factoryFantom.connect(signerFantom).deploy(premintOwners)
            // await contractFantom.deployed();
            // console.log("Deployed on Fantom testnet at ", contractFantom.address);
            // // 6. deploy on Moonbase Alpha testnet
            // const providerMoonbase = getDefaultProvider('https://rpc.api.moonbase.moonbeam.network'); // https://chainlist.org/chain/1287
            // const signerMoonbase = wallet.connect(providerMoonbase);
            // const factoryMoonbase = new ethers.ContractFactory(ABI, bytecode, signerMoonbase);
            // const contractMoonbase = await factoryMoonbase.connect(signerMoonbase).deploy(premintOwners)
            // await contractMoonbase.deployed();
            // console.log("Deployed on Moonbase Alpha testnet at ", contractMoonbase.address);
        } catch (err) {
            console.log(err);
            console.error("❗️ Make sure you have enough funds in all the above networks!")
        }
    } else {
        console.error("❌ .env file with correct private key not found!")
    }

})();
