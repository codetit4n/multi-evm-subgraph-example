// This script will verify smart contracts on all the chains.
// @note - Using JS instead of TS because solc-js don't have .d.ts files
const fs = require('fs')
const dotenv = require('dotenv')
const { Wallet, getDefaultProvider, ethers } = require('ethers')
dotenv.config()
const path = require('path')
const solc = require('solc')
const axios = require('axios')

// @note - you need to put api keys from the following explorers in the .env
/*
    1. Etherscan explorer - https://etherscan.io/
    2. Polygonscan explorer - https://polygonscan.com/
    3. Optimism Etherscan explorer - https://optimistic.etherscan.io/
    4. Snowtrace explorer (Avalanche) - https://snowtrace.io/
    5. FtmScan explorer (Fantom) - https://ftmscan.com/
    6. Moonscan explorer (Moonbeam) - https://moonscan.io/
*/
const pvt_key = process.env.PVT_KEY;
const etherscanKey = process.env.ETHERSCAN_API_KEY;
const polygonscanKey = process.env.POLYGONSCAN_API_KEY;
const optimismEtherscanKey = process.env.OPTIMISM_ETHERSCAN_API_KEY;
const snowtraceKey = process.env.SNOWTRACE_API_KEY;
const ftmscanKey = process.env.FTMSCAN_API_KEY;
const moonscanKey = process.env.MOONSCAN_API_KEY;
(() => {

    if (etherscanKey && polygonscanKey && optimismEtherscanKey && snowtraceKey && ftmscanKey && moonscanKey) {
        // get flattened contract
        // const flattened = fs.readFileSync(path.join(__dirname, '../flattened/SubgraphNFT_flat.sol'), 'utf-8')
        // console.log(flattened);
        compilerConfigContract();

    } else {
        console.error("❌ .env file do not have all the explorer keys!")
    }

})()

async function compilerConfigContract() {
    const tokenPath = path.resolve(__dirname, '..', 'contracts', 'SubgraphNFT.sol')
    const source = fs.readFileSync(tokenPath, 'utf-8')
    const standard_json_input = {
        language: 'Solidity',
        sources: {
            'SubgraphNFT.sol': {
                content: source,
            },
            '@openzeppelin/contracts/token/ERC721/ERC721.sol': findImport('ERC721.sol'),
            '@openzeppelin/contracts/token/ERC721/IERC721.sol': findImport('IERC721.sol'),
            '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol': findImport('IERC721Receiver.sol'),
            '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol': findImport('IERC721Metadata.sol'),
            '@openzeppelin/contracts/utils/introspection/ERC165.sol': findImport('ERC165.sol'),
            '@openzeppelin/contracts/utils/introspection/IERC165.sol': findImport('IERC165.sol'),
            '@openzeppelin/contracts/access/Ownable.sol': findImport('Ownable.sol'),
            '@openzeppelin/contracts/utils/Counters.sol': findImport('Counters.sol'),
            '@openzeppelin/contracts/utils/Context.sol': findImport('Context.sol'),
            '@openzeppelin/contracts/utils/Address.sol': findImport('Address.sol'),
            '@openzeppelin/contracts/utils/Strings.sol': findImport('Strings.sol'),
            '@openzeppelin/contracts/utils/math/Math.sol': findImport('Math.sol')
        },
        settings: {
            "optimizer": {
                "enabled": true,
                "runs": 200
            },
            "outputSelection": {
                "*": {
                    "": [
                        "ast"
                    ],
                    "*": [
                        "abi",
                        "metadata",
                        "devdoc",
                        "userdoc",
                        "storageLayout",
                        "evm.legacyAssembly",
                        "evm.bytecode",
                        "evm.deployedBytecode",
                        "evm.methodIdentifiers",
                        "evm.gasEstimates",
                        "evm.assembly"
                    ]
                }
            }
        }
    };
    // Compile file
    let compiledContract = JSON.parse(solc.compile(JSON.stringify(standard_json_input)))
    const premintOwners = ["0xc9D506209f57948a0C0df6ED45621Fb47572Af99", "0x5F5AC73C6d6192bEe9d38eF6775A3C3EAAADFb39", "0x0cbe4714e34CA34D25B71DF73c682504190449Ff", "0x702750eD7eD3D8999B09a4d7ba3C64A21B43E63f", "0xbB36afDB0D75C84Ad0c92c763a53A3C13221960e", "0x153DC7907BC187C0a47Fb3d38A32c877d35A3502"];
    const wallet = new Wallet(pvt_key);
    const bytecode = "0x" + compiledContract.contracts['SubgraphNFT.sol']['SubgraphNFT'].evm.bytecode.object;
    const abi = compiledContract.contracts[`SubgraphNFT.sol`]['SubgraphNFT'].abi;
    // deploy on Polygon mumbai
    const providerMumbai = getDefaultProvider('https://polygon-mumbai.blockpi.network/v1/rpc/public'); // https://chainlist.org/chain/80001
    const signerMumbai = wallet.connect(providerMumbai);
    const factoryMumbai = new ethers.ContractFactory(abi, bytecode, signerMumbai);
    const contractMumbai = await factoryMumbai.connect(signerMumbai).deploy(premintOwners)
    await contractMumbai.deployTransaction.wait(6);
    console.log("Deployed on Polygon Mumbai at ", contractMumbai.address);
    // verify on Polygon Mumbai
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    };
    const encoder = new ethers.utils.AbiCoder;
    const constructorArgsAbiEncoded = encoder.encode(["address[]"], [premintOwners]);
    // console.log(constructorArgsAbiEncoded.split("0x")[1]);
    try {
        let dataToEtherscan = {
            apikey: polygonscanKey,
            module: "contract",
            action: "verifysourcecode",
            contractname: "SubgraphNFT.sol:SubgraphNFT",
            contractaddress: contractMumbai.address,
            sourceCode: JSON.stringify(standard_json_input),
            codeformat: "solidity-standard-json-input",
            compilerversion: "v0.8.17+commit.8df45f5f",
            licenseType: 3, //https://etherscan.io/contract-license-types
            constructorArguements: constructorArgsAbiEncoded.split("0x")[1]
        };
        const response = await axios.post('https://api-testnet.polygonscan.com/api', dataToEtherscan, {
            headers: headers,
        });
        console.log(response);
    } catch (err) {
        console.log(err);
    }
}

function findImport(pathArg) {

    if (pathArg === 'Ownable.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'access', 'Ownable.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    if (pathArg === 'ERC721.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'token', 'ERC721', 'ERC721.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    if (pathArg === 'IERC721.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'token', 'ERC721', 'IERC721.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    if (pathArg === 'IERC721Receiver.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'token', 'ERC721', 'IERC721Receiver.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    if (pathArg === 'IERC721Metadata.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'token', 'ERC721', 'extensions', 'IERC721Metadata.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    if (pathArg === 'ERC165.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'utils', 'introspection', 'ERC165.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    if (pathArg === 'IERC165.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'utils', 'introspection', 'IERC165.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    if (pathArg === 'Ownable.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'access', 'Ownable.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    if (pathArg === 'Counters.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'utils', 'Counters.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    if (pathArg === 'Context.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'utils', 'Context.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    if (pathArg === 'Address.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'utils', 'Address.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    if (pathArg === 'Strings.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'utils', 'Strings.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    if (pathArg === 'Math.sol') {
        const absolutePath = path.resolve(__dirname, '..', 'node_modules', '@openzeppelin', 'contracts', 'utils', 'math', 'Math.sol');
        const source = fs.readFileSync(absolutePath, 'utf-8')
        return {
            content:
                source
        };
    }
    return { error: 'File not found' };
}