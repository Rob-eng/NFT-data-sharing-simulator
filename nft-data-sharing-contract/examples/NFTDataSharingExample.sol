// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../src/NFTDataSharing.sol";

/**
 * @title NFTDataSharingExample
 * @dev Exemplo de uso do contrato NFTDataSharing
 */
contract NFTDataSharingExample {
    NFTDataSharing public nftContract;
    
    constructor(address _nftContract) {
        nftContract = NFTDataSharing(_nftContract);
    }
    
    /**
     * @dev Exemplo de criação de NFT e adição de dados
     */
    function createCandidateNFT(
        string memory name,
        string memory description,
        string memory age,
        string memory experience,
        string memory skills
    ) external returns (uint256) {
        // Criar NFT
        uint256 tokenId = nftContract.createNFT(name, description);
        
        // Adicionar dados
        nftContract.addData(tokenId, "idade", age);
        nftContract.addData(tokenId, "experiencia", experience);
        nftContract.addData(tokenId, "skills", skills);
        
        return tokenId;
    }
    
    /**
     * @dev Exemplo de concessão de acesso para múltiplos sistemas
     */
    function grantAccessToSystems(
        uint256 tokenId,
        address[] memory readSystems,
        address[] memory writeSystems
    ) external {
        // Conceder acesso de leitura
        for (uint256 i = 0; i < readSystems.length; i++) {
            nftContract.grantReadAccess(readSystems[i], tokenId);
        }
        
        // Conceder acesso de escrita
        for (uint256 i = 0; i < writeSystems.length; i++) {
            nftContract.grantWriteAccess(writeSystems[i], tokenId);
        }
    }
    
    /**
     * @dev Exemplo de leitura de dados com verificação de acesso
     */
    function readCandidateData(uint256 tokenId, string memory key) external view returns (string memory) {
        return nftContract.readData(tokenId, key);
    }
    
    /**
     * @dev Exemplo de obtenção de todas as informações de uma NFT
     */
    function getCandidateInfo(uint256 tokenId) external view returns (
        string memory name,
        string memory description,
        string[] memory dataKeys,
        uint256 createdAt,
        uint256 lastUpdated,
        address currentOwner
    ) {
        (name, description, dataKeys,) = nftContract.getAllData(tokenId);
        (,, createdAt, lastUpdated) = nftContract.getNFTInfo(tokenId);
        currentOwner = nftContract.getCurrentOwner(tokenId);
    }
    
    /**
     * @dev Exemplo de transferência de NFT com histórico
     */
    function transferCandidateNFT(uint256 tokenId, address newOwner) external {
        nftContract.transferNFT(newOwner, tokenId);
    }
    
    /**
     * @dev Exemplo de verificação de acesso de um sistema
     */
    function checkSystemAccess(address system) external view returns (
        bool hasRead,
        bool hasWrite
    ) {
        hasRead = nftContract.hasReadAccess(system);
        hasWrite = nftContract.hasWriteAccess(system);
    }
    
    /**
     * @dev Exemplo de obtenção de estatísticas
     */
    function getContractStats() external view returns (
        uint256 totalNFTs,
        uint256 dataSharingCount
    ) {
        totalNFTs = nftContract.getTotalNFTs();
        // Exemplo para tokenId 0 (assumindo que existe)
        if (totalNFTs > 0) {
            dataSharingCount = nftContract.getDataSharingCount(0);
        }
    }
}
