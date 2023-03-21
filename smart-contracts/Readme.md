# smart-contracts

This is a simple ethereum-waffle project. It contains smart contracts, unit tests and scripts to deploy and verify the smart contracts on the following testnet chains:
1. Ethereum Goerli testnet
2. Polygon Mumbai testnet
3. Optimism Goerli testnet
4. Avalanche FUJI testnet
5. Fantom testnet
6. Moonbase Alpha - Moonbeam's testnet

## Commands
- Compile contracts:
```bash
npm run clean
npm run build
```
- Run tests:
```bash
npm run test
```
- Deploy and verify contract on all the chains:
```bash
npm run deploy_verify
```
> Make sure you have enough funds on all the chains before running this script.

> This script will deploy and verify the smart contract on all the above mentioned chains and create a json file with all the deployed addresses which can be then found in the parent directory.