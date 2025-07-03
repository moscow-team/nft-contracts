// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string uri);

    // Solo llamamos al constructor de ERC721
    constructor() ERC721("MiNFT", "MNFT") {}

    function mint(address to, string calldata uri) external onlyOwner {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit NFTMinted(to, tokenId, uri); // <--- 🔥 este evento te da el tokenId
    }

}
