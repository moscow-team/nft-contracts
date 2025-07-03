// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Marketplace is ReentrancyGuard {
    IERC20  public immutable paymentToken;
    IERC721 public immutable nftContract;

    struct Listing {
        address seller;
        uint256 price;
    }

    // tokenId → Listing
    mapping(uint256 => Listing) public listings;
    // seller → saldo acumulado
    mapping(address => uint256) public proceeds;

    // ─────────────────────────────────────────────────────────────────────
    // Para devolver todos los listings:
    uint256[] private listedTokenIds;
    mapping(uint256 => uint256) private listedTokenIndex;
    // ─────────────────────────────────────────────────────────────────────

    // Eventos
    event NFTListed(uint256 indexed tokenId, address seller, uint256 price);
    event NFTPurchased(uint256 indexed tokenId, address buyer, uint256 price);
    event ProceedsWithdrawn(address indexed seller, uint256 amount);

    constructor(address _paymentToken, address _nftContract) {
        paymentToken = IERC20(_paymentToken);
        nftContract  = IERC721(_nftContract);
    }

    /// @notice Lista un NFT que ya tienes aprobado al contrato
    function listItem(uint256 tokenId, uint256 price) external {
        require(price > 0, "Precio debe ser > 0");
        require(nftContract.ownerOf(tokenId) == msg.sender, "No eres propietario");

        listings[tokenId] = Listing(msg.sender, price);

        // Añadir tokenId al array global
        listedTokenIndex[tokenId] = listedTokenIds.length;
        listedTokenIds.push(tokenId);

        emit NFTListed(tokenId, msg.sender, price);
    }

    /// @notice Compra un NFT listado
    function buyItem(uint256 tokenId) external nonReentrant {
        Listing memory item = listings[tokenId];
        require(item.price > 0, "NFT no listado");

        // Transferir el ERC20 del comprador al contrato
        require(
            paymentToken.transferFrom(msg.sender, address(this), item.price),
            "Pago fallido"
        );

        // Registrar el pago al vendedor
        proceeds[item.seller] += item.price;

        // Transferir el NFT al comprador
        nftContract.safeTransferFrom(item.seller, msg.sender, tokenId);

        // Eliminar tokenId del array global
        _removeGlobalListing(tokenId);

        // Borrar el listing
        delete listings[tokenId];

        emit NFTPurchased(tokenId, msg.sender, item.price);
    }

    /// @notice Retira los fondos acumulados
    function withdrawProceeds() external nonReentrant {
        uint256 amount = proceeds[msg.sender];
        require(amount > 0, "Sin fondos para retirar");

        // Reiniciar antes de la transferencia
        proceeds[msg.sender] = 0;
        require(paymentToken.transfer(msg.sender, amount), "Retiro fallido");

        emit ProceedsWithdrawn(msg.sender, amount);
    }

    // ─────────────────────────────────────────────────────────────────────
    // Helper para eliminar de listedTokenIds
    function _removeGlobalListing(uint256 tokenId) internal {
        uint256 index       = listedTokenIndex[tokenId];
        uint256 lastTokenId = listedTokenIds[listedTokenIds.length - 1];

        // Swap & pop
        listedTokenIds[index] = lastTokenId;
        listedTokenIndex[lastTokenId] = index;

        listedTokenIds.pop();
        delete listedTokenIndex[tokenId];
    }
    // ─────────────────────────────────────────────────────────────────────

    /// @notice Devuelve todos los tokenIds actualmente listados y sus precios
    function getAllListings()
        external
        view
        returns (uint256[] memory tokenIds, uint256[] memory prices)
    {
        uint256 len = listedTokenIds.length;
        tokenIds = new uint256[](len);
        prices   = new uint256[](len);

        for (uint i = 0; i < len; i++) {
            uint256 id = listedTokenIds[i];
            tokenIds[i] = id;
            prices[i]   = listings[id].price;
        }
    }
}
