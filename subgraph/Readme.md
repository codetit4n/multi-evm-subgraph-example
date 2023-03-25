# subgraph
This subgraph can be deployed to different blockchain networks that is specified in the networks.json file.

NOTE: `Linux or MacOS Systems recommended to run the scripts`

## Supported blockchain networks
1. Ethereum Goerli testnet
2. Polygon Mumbai testnet
3. Optimism Goerli testnet
4. Avalanche FUJI testnet
5. Fantom testnet
6. Moonbase Alpha - Moonbeam's testnet

## To deploy the subgraphs:
Step 1: Make sure you have configured the networks.json file. It can be done using the smart-contracts folder <a href="/smart-contracts">here</a>. Refer to the Readme <a href='/smart-contracts#readme'>here</a>.

Step 2: Create subgraphs on https://thegraph.com/hosted-service for different networks.

Example subgraphs that I have created for this project:
1. https://thegraph.com/hosted-service/subgraph/codetit4n/subgraphnft-eth-goerli
2. https://thegraph.com/hosted-service/subgraph/codetit4n/subgraphnft-mumbai
3. https://thegraph.com/hosted-service/subgraph/codetit4n/subgraphnft-opt-goerli
4. https://thegraph.com/hosted-service/subgraph/codetit4n/subgraphnft-avax-fuji
5. https://thegraph.com/hosted-service/subgraph/codetit4n/subgraphnft-fantom-testnet
6. https://thegraph.com/hosted-service/subgraph/codetit4n/subgraphnft-moonbase

Step 3: Create the `.env` and put all the environment variables in there. Refer to: `.env.example`
```
THEGRAPH_AUTH_TOKEN=
ETH_GOERLI_SUBGRAPH_SLUG=
MUMBAI_SUBGRAPH_SLUG=
OPT_GOERLI_SUBGRAPH_SLUG=
FUJI_SUBGRAPH_SLUG=
FANTOM_TESTNET_SLUG=
MOONBASE_SLUG=
```
First one is the auth token. All the others are the subgraph slugs.

Subgraph slug example: For subgraph `https://thegraph.com/hosted-service/subgraph/codetit4n/subgraphnft-eth-goerli` the subgraph slug would be: `codetit4n/subgraphnft-eth-goerli`

Step 4: Install node_modules: `yarn`

Step 5: Authenticate the subgraph using: `yarn auth`

Step 6: To deploy same subgraph on various blockchain networks do:
1. Ethereum Goerli: `yarn deploy_eth_goerli`
2. Polygon Mumbai: `yarn deploy_mumbai`
3. Optimism Goerli: `yarn deploy_opt_goerli`
4. Avalanche FUJI testnet: `yarn deploy_avax_fuji`
5. Fantom testnet: `yarn deploy_fantom_testnet`
6. Moonbase Alpha: `yarn deploy_moonbase`
