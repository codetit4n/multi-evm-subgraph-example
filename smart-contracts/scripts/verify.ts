// This script will verify smart contracts on all the chains.
import dotenv from 'dotenv'
dotenv.config()

// @note - you need to put api keys from the following explorers in the .env
/*
    1. Etherscan explorer - https://etherscan.io/
    2. Polygonscan explorer - https://polygonscan.com/
    3. Optimism Etherscan explorer - https://optimistic.etherscan.io/
    4. Snowtrace explorer (Avalanche) - https://snowtrace.io/
    5. FtmScan explorer (Fantom) - https://ftmscan.com/
    6. Moonscan explorer (Moonbeam) - https://moonscan.io/
*/

const etherscanKey = process.env.ETHERSCAN_API_KEY;
const polygonscanKey = process.env.POLYGONSCAN_API_KEY;
const optimismEtherscanKey = process.env.OPTIMISM_ETHERSCAN_API_KEY;
const snowtraceKey = process.env.SNOWTRACE_API_KEY;
const ftmscanKey = process.env.FTMSCAN_API_KEY;
const moonscanKey = process.env.MOONSCAN_API_KEY;
(() => {

    if (etherscanKey && polygonscanKey && optimismEtherscanKey && snowtraceKey && ftmscanKey && moonscanKey) {


    } else {
        console.error("❌ .env file do not have all the explorer keys!")
    }

})()