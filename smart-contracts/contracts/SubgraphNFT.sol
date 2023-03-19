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

    constructor() ERC721("SubgraphNFT", "sNFT") {
        address[6] memory premintOwners = [
            0xc9D506209f57948a0C0df6ED45621Fb47572Af99,
            0x5F5AC73C6d6192bEe9d38eF6775A3C3EAAADFb39,
            0x0cbe4714e34CA34D25B71DF73c682504190449Ff,
            0x702750eD7eD3D8999B09a4d7ba3C64A21B43E63f,
            0xbB36afDB0D75C84Ad0c92c763a53A3C13221960e,
            0x153DC7907BC187C0a47Fb3d38A32c877d35A3502
        ];
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
