// This script will verify smart contracts on all the chains.
// @note - Using JS instead of TS because solc-js don't have .d.ts files
import fs from 'fs'
// import { Wallet, getDefaultProvider, ethers } from 'ethers'
import path from 'path'
import dotenv from 'dotenv'
import axios from 'axios';
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
(async () => {

    if (etherscanKey && polygonscanKey && optimismEtherscanKey && snowtraceKey && ftmscanKey && moonscanKey) {
        // get flattened contract
        const flattenedContract = fs.readFileSync(path.join(__dirname, '../flattened/SubgraphNFT_flat.sol'))
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        };
        let dataToEtherscan = {
            apikey: polygonscanKey,
            contractname: "SubgraphNFT",
            module: "contract",
            action: "verifysourcecode",
            contractaddress: "0xea743875a3a7fB61A4F0D55e4317a8AcD017bd40",
            sourceCode: flattenedContract.toString(),
            codeformat: "solidity-single-file",
            compilerversion: "v0.8.17+commit.8df45f5f",
            licenseType: 3, //https://etherscan.io/contract-license-types
            optimizationUsed: 0
        };
        const response = await axios.post("https://api-testnet.polygonscan.com/api", dataToEtherscan, {
            headers: headers,
        });
        console.log(response);

    } else {
        console.error("❌ .env file do not have all the explorer keys!")
    }

})()