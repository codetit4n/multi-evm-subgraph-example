// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SubgraphNFT is ERC721, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    string public baseURI;

    Counters.Counter private _tokenIdCounter;

    constructor(address[] memory premintOwners) ERC721("SubgraphNFT", "sNFT") {
        require(premintOwners.length == 6, "Only 6 preminters allowed!");
        for (uint256 i = 0; i < 6; i++) {
            _tokenIdCounter.increment();
            uint256 tokenId = _tokenIdCounter.current();
            _safeMint(premintOwners[i], tokenId);
            baseURI = "https://ipfs.io/ipfs/QmZ5cimfzWZ754CYBaWd7UgRcfS9vGKztgpm96W26Qem6L/testNFTs/";
        }
    }

    function safeMint(address to) public onlyOwner {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(_exists(tokenId), "SubgraphNFT: Non Existent Token");
        string memory currentBaseURI = baseURI;
        return (
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        ".json"
                    )
                )
                : ""
        );
    }

    function setBaseURI(string memory _uri) external onlyOwner {
        baseURI = _uri;
    }
}
