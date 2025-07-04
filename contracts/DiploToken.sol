// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DiploToken is ERC20, Ownable {
    constructor() ERC20("Diplo", "DIP") {
        // Mint 1,000,000 DIP con 18 decimales
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    // Función para testing (acceso restringido)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

