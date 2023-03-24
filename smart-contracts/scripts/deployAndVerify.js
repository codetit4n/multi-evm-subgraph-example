// This script will deploy and verify smart contracts on all the chains.
// @note - Using JS instead of TS because solc-js don't have typescript declaration files
const fs = require('fs')
const dotenv = require('dotenv')
const { Wallet, getDefaultProvider, ethers } = require('ethers')
dotenv.config()
const path = require('path')
const solc = require('solc')
const axios = require('axios')
const config = require('../blockchains-data/config.json')

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
const premintOwners = [
    "0xc9D506209f57948a0C0df6ED45621Fb47572Af99",
    "0x5F5AC73C6d6192bEe9d38eF6775A3C3EAAADFb39",
    "0x0cbe4714e34CA34D25B71DF73c682504190449Ff",
    "0x702750eD7eD3D8999B09a4d7ba3C64A21B43E63f",
    "0xbB36afDB0D75C84Ad0c92c763a53A3C13221960e",
    "0x153DC7907BC187C0a47Fb3d38A32c877d35A3502"
];

(async () => {


    if (etherscanKey && polygonscanKey && optimismEtherscanKey && snowtraceKey && ftmscanKey && moonscanKey) {
        let dataToExport = {} // for networks.json in subgraph
        const { abi, bytecode, standard_json_input } = getAbiBytecodeStdJsonInput()

        console.log("Ethereum Goerli:-");
        const deploymentGoerli = await deployContract(abi, bytecode, config.eth_goerli.rpc);
        if (deploymentGoerli == null) {
            return;
        }
        const deployedAddressEthGoerli = deploymentGoerli.deployedAddress;
        const startBlockGoerli = deploymentGoerli.startBlock;
        const verifyEthGoerli = await verifyContract(standard_json_input, config.eth_goerli.explorer_api, etherscanKey, deployedAddressEthGoerli);
        if (verifyEthGoerli == null) {
            return;
        }

        dataToExport['goerli'] = {
            "SubgraphNFT": {
                "address": deployedAddressEthGoerli,
                "startBlock": startBlockGoerli
            }
        }


        // dataToExport['goerli']['SubgraphNFT']['address'] = deployedAddressEthGoerli;
        // dataToExport['goerli']['SubgraphNFT']['startBlock'] = startBlockGoerli;
        console.log("---------------------------------------------------------------------------------");

        console.log("Polygon Mumbai:-");
        const deploymentMumbai = await deployContract(abi, bytecode, config.mumbai.rpc);
        if (deploymentMumbai == null) {
            return;
        }
        const deployedAddressMumbai = deploymentMumbai.deployedAddress;
        const startBlockMumbai = deploymentMumbai.startBlock;
        const verifyMumbai = await verifyContract(standard_json_input, config.mumbai.explorer_api, polygonscanKey, deployedAddressMumbai);
        if (verifyMumbai == null) {
            return;
        }
        dataToExport['mumbai'] = {
            "SubgraphNFT": {
                "address": deployedAddressMumbai,
                "startBlock": startBlockMumbai
            }
        }
        // dataToExport['mumbai']['SubgraphNFT']['address'] = deployedAddressMumbai;
        // dataToExport['mumbai']['SubgraphNFT']['startBlock'] = startBlockMumbai;
        console.log("---------------------------------------------------------------------------------");

        console.log("Optimism Goerli:-");
        const deploymentOptGoerli = await deployContract(abi, bytecode, config.optimism_goerli.rpc);
        if (deploymentOptGoerli == null) {
            return;
        }
        const deployedAddressOptGoerli = deploymentOptGoerli.deployedAddress;
        const startBlockOptGoerli = deploymentOptGoerli.startBlock;
        const verifyOptGoerli = await verifyContract(standard_json_input, config.optimism_goerli.explorer_api, optimismEtherscanKey, deployedAddressOptGoerli);
        if (verifyOptGoerli == null) {
            return;
        }

        dataToExport['optimism-goerli'] = {
            "SubgraphNFT": {
                "address": deployedAddressOptGoerli,
                "startBlock": startBlockOptGoerli
            }
        }

        // dataToExport['optimism-goerli']['SubgraphNFT']['address'] = deployedAddressOptGoerli;
        // dataToExport['optimism-goerli']['SubgraphNFT']['startBlock'] = startBlockOptGoerli;
        console.log("---------------------------------------------------------------------------------");

        console.log("Avalanche FUJI:-");
        const deploymentFuji = await deployContract(abi, bytecode, config.avax_fuji.rpc);
        if (deploymentFuji == null) {
            return;
        }
        const deployedAddressFuji = deploymentFuji.deployedAddress;
        const startBlockFuji = deploymentFuji.startBlock;
        const verifyFuji = await verifyContract(standard_json_input, config.avax_fuji.explorer_api, snowtraceKey, deployedAddressFuji);
        if (verifyFuji == null) {
            return;
        }

        dataToExport['fuji'] = {
            "SubgraphNFT": {
                "address": deployedAddressFuji,
                "startBlock": startBlockFuji
            }
        }

        // dataToExport['fuji']['SubgraphNFT']['address'] = deployedAddressFuji;
        // dataToExport['fuji']['SubgraphNFT']['startBlock'] = startBlockFuji;
        console.log("---------------------------------------------------------------------------------");

        console.log("Fantom testnet:-");
        const deploymentFantomTestnet = await deployContract(abi, bytecode, config.fantom_testnet.rpc);
        if (deploymentFantomTestnet == null) {
            return;
        }
        const deployedAddressFantomTestnet = deploymentFantomTestnet.deployedAddress;
        const startBlockFantomTestnet = deploymentFantomTestnet.startBlock;
        const verifyFantomTestnet = await verifyContract(standard_json_input, config.fantom_testnet.explorer_api, ftmscanKey, deployedAddressFantomTestnet);
        if (verifyFantomTestnet == null) {
            return;
        }

        dataToExport['fantom-testnet'] = {
            "SubgraphNFT": {
                "address": deployedAddressFantomTestnet,
                "startBlock": startBlockFantomTestnet
            }
        }

        // dataToExport['fantom-testnet']['SubgraphNFT']['address'] = deployedAddressFantomTestnet;
        // dataToExport['fantom-testnet']['SubgraphNFT']['startBlock'] = startBlockFantomTestnet;
        console.log("---------------------------------------------------------------------------------");

        console.log("Moonbase Alpha:-");
        const deploymentMoonbase = await deployContract(abi, bytecode, config.moonbase_alpha.rpc);
        if (deploymentMoonbase == null) {
            return;
        }
        const deployedAddressMoonbase = deploymentMoonbase.deployedAddress;
        const startBlockMoonbase = deploymentMoonbase.startBlock;
        const verifyMoonbase = await verifyContract(standard_json_input, config.moonbase_alpha.explorer_api, moonscanKey, deployedAddressMoonbase);
        if (verifyMoonbase == null) {
            return;
        }
        dataToExport['mbase'] = {
            "SubgraphNFT": {
                "address": deployedAddressMoonbase,
                "startBlock": startBlockMoonbase
            }
        }
        console.log("---------------------------------------------------------------------------------");
        fs.writeFile("../subgraph/networks.json", JSON.stringify(dataToExport, null, 2), function (err) {
            if (err) {
                console.error("❌ Export to JSON failed!")
                console.log(err);
            }
            console.log('✅ Deployed addresses exported to networks.json for the subgraph');
        });
    } else {
        console.error("❌ .env file do not have all the explorer keys!")
    }
})()

async function verifyContract(standard_json_input, explorer_api, explorer_key, contractAddress) {

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    };
    const encoder = new ethers.utils.AbiCoder;
    const constructorArgsAbiEncoded = encoder.encode(["address[]"], [premintOwners]);
    try {
        let dataToExplorer = {
            apikey: explorer_key,
            module: "contract",
            action: "verifysourcecode",
            contractname: "SubgraphNFT.sol:SubgraphNFT",
            contractaddress: contractAddress,
            sourceCode: JSON.stringify(standard_json_input),
            codeformat: "solidity-standard-json-input",
            compilerversion: "v0.8.17+commit.8df45f5f",
            licenseType: 3, //https://etherscan.io/contract-license-types
            constructorArguements: constructorArgsAbiEncoded.split("0x")[1]
        };
        const response = await axios.post(explorer_api, dataToExplorer, {
            headers: headers,
        });
        if (response.status === 200) {
            console.log('✅ Verify Request sent');
            return true;
        } else {
            console.log('❌ Verify Request failed!');
            return null;
        }
    } catch (err) {
        console.log(err);
        console.log('❌ Verify Request failed!');
        return null;
    }
}

async function deployContract(abi, bytecode, rpc) {
    try {
        const wallet = new Wallet(pvt_key);
        const provider = getDefaultProvider(rpc);
        const signer = wallet.connect(provider);
        const factory = new ethers.ContractFactory(abi, bytecode, signer);
        const contract = await factory.connect(signer).deploy(premintOwners)
        const startBlock = await provider.getBlockNumber(contract.deployTransaction.hash);
        await contract.deployTransaction.wait(4);
        const deployedAddress = contract.address;
        console.log("✅ Deployed at: ", deployedAddress);
        return { deployedAddress, startBlock };
    } catch (err) {
        console.log(err);
        console.log("❌ Deployment failed!");
        return null;
    }
}

function getAbiBytecodeStdJsonInput() {
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
    // get abi and bytecode
    const bytecode = "0x" + compiledContract.contracts['SubgraphNFT.sol']['SubgraphNFT'].evm.bytecode.object;
    const abi = compiledContract.contracts['SubgraphNFT.sol']['SubgraphNFT'].abi;
    return { abi, bytecode, standard_json_input };
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