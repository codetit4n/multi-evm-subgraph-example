import { getDefaultProvider, Wallet } from 'ethers';
import dotenv from 'dotenv'
dotenv.config()

/* This script deploys the contracts to the following chains:
    1. Goerli Ethereum testnet.
    2. Sepolia Ethereum testnet.
    3. Mumbai Polygon testnet.
    4. Avalanche FUJI testnet.
    5. Fantom testnet.
    6. zkSync2-testnet.
    7. Moonbase alpha testnet - Moonbeam's testnet
*/

//@note Funds needed in all the above mentioned networks before deploying
const pvt_key = process.env.PVT_KEY;

(() => {
    if (pvt_key) {
        const wallet = new Wallet(pvt_key);
        const providerGoerli = getDefaultProvider('https://goerli.blockpi.network/v1/rpc/public	');
        const signerGoerli = wallet.connect(providerGoerli);
        console.log(signerGoerli);
    } else {
        console.error("❌ .env file with private key not found!")
    }

})();
