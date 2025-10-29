// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title NFTDataSharing
 * @dev Smart contract para compartilhamento de dados via NFT com controle de acesso granular
 * Compatível com redes Stellar através de bridges ou sidechains
 */
contract NFTDataSharing is ERC721, Ownable {
    using Strings for uint256;

    // Estrutura para armazenar os dados dos candidatos
    struct CandidateData {
        uint256 id;
        string name;
        string description;
        mapping(string => string) userData; // Chave : Valor
        string[] dataKeys; // Para iterar sobre as chaves
        string encryptedData; // Dados criptografados para sistemas sem acesso
        uint256 createdAt;
        uint256 lastUpdated;
    }

    // Estrutura para controle de acesso
    struct AccessControl {
        bool hasReadAccess;
        bool hasWriteAccess;
        uint256 grantedAt;
    }

    // Estrutura para histórico de proprietários
    struct OwnershipHistory {
        address previousOwner;
        uint256 transferTime;
    }

    // Variáveis de estado
    uint256 private _tokenIdCounter;
    mapping(uint256 => CandidateData) private _candidateData;
    mapping(address => AccessControl) private _systemAccess;
    mapping(address => bool) private _hasReadAccess;
    mapping(address => bool) private _hasWriteAccess;
    mapping(address => bool) private _hasNoAccess;
    mapping(uint256 => address) private _tokenOwners;
    mapping(address => mapping(uint256 => bool)) private _previousOwnership; // endereço => tokenId => teve posse
    mapping(uint256 => OwnershipHistory[]) private _ownershipHistory;
    mapping(uint256 => uint256) private _dataSharingCount; // tokenId => quantidade de sistemas que receberam dados
    mapping(uint256 => bool) private _tokenExists; // tokenId => existe

    // Eventos
    event NFTCreated(uint256 indexed tokenId, address indexed owner, string name);
    event DataAdded(uint256 indexed tokenId, string key, string value);
    event DataUpdated(uint256 indexed tokenId, string key, string value);
    event ReadAccessGranted(address indexed system, uint256 indexed tokenId);
    event WriteAccessGranted(address indexed system, uint256 indexed tokenId);
    event ReadAccessRevoked(address indexed system, uint256 indexed tokenId);
    event WriteAccessRevoked(address indexed system, uint256 indexed tokenId);
    event AccessRequested(address indexed requester, uint256 indexed tokenId, bool isWriteAccess);
    event NFTTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event DataShared(uint256 indexed tokenId, address indexed recipient, bool encrypted);

    constructor() ERC721("NFTDataSharing", "NDS") Ownable(msg.sender) {}

    /**
     * @dev Função para criar e registrar uma NFT
     * @param name Nome do candidato
     * @param description Descrição do candidato
     */
    function createNFT(string memory name, string memory description) external returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _mint(msg.sender, tokenId);
        _tokenOwners[tokenId] = msg.sender;

        CandidateData storage candidate = _candidateData[tokenId];
        candidate.id = tokenId;
        candidate.name = name;
        candidate.description = description;
        candidate.createdAt = block.timestamp;
        candidate.lastUpdated = block.timestamp;

        _tokenExists[tokenId] = true;

        emit NFTCreated(tokenId, msg.sender, name);
        return tokenId;
    }

    /**
     * @dev Função para incluir dados na NFT no formato Chave : Valor
     * @param tokenId ID da NFT
     * @param key Chave do dado
     * @param value Valor do dado
     */
    function addData(uint256 tokenId, string memory key, string memory value) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender || _systemAccess[msg.sender].hasWriteAccess, "No write access");
        
        CandidateData storage candidate = _candidateData[tokenId];
        
        // Se a chave não existe, adiciona à lista de chaves
        if (bytes(candidate.userData[key]).length == 0) {
            candidate.dataKeys.push(key);
        }
        
        candidate.userData[key] = value;
        candidate.lastUpdated = block.timestamp;

        emit DataAdded(tokenId, key, value);
    }

    /**
     * @dev Função para incluir dados via arquivo JSON
     * @param tokenId ID da NFT
     * @param jsonData Dados em formato JSON
     */
    function addDataFromJSON(uint256 tokenId, string memory jsonData) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender || _systemAccess[msg.sender].hasWriteAccess, "No write access");
        
        CandidateData storage candidate = _candidateData[tokenId];
        candidate.encryptedData = jsonData;
        candidate.lastUpdated = block.timestamp;

        emit DataAdded(tokenId, "json", jsonData);
    }

    /**
     * @dev Função para conceder acesso para leitura
     * @param system Endereço do sistema
     * @param tokenId ID da NFT
     */
    function grantReadAccess(address system, uint256 tokenId) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can grant access");
        
        _systemAccess[system].hasReadAccess = true;
        _hasReadAccess[system] = true;
        _systemAccess[system].grantedAt = block.timestamp;

        emit ReadAccessGranted(system, tokenId);
    }

    /**
     * @dev Função para conceder acesso para escrita
     * @param system Endereço do sistema
     * @param tokenId ID da NFT
     */
    function grantWriteAccess(address system, uint256 tokenId) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can grant access");
        
        _systemAccess[system].hasWriteAccess = true;
        _hasWriteAccess[system] = true;
        _systemAccess[system].grantedAt = block.timestamp;

        emit WriteAccessGranted(system, tokenId);
    }

    /**
     * @dev Função para revogar acesso para leitura
     * @param system Endereço do sistema
     * @param tokenId ID da NFT
     */
    function revokeReadAccess(address system, uint256 tokenId) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can revoke access");
        
        _systemAccess[system].hasReadAccess = false;
        _hasReadAccess[system] = false;

        emit ReadAccessRevoked(system, tokenId);
    }

    /**
     * @dev Função para revogar acesso para escrita
     * @param system Endereço do sistema
     * @param tokenId ID da NFT
     */
    function revokeWriteAccess(address system, uint256 tokenId) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can revoke access");
        
        _systemAccess[system].hasWriteAccess = false;
        _hasWriteAccess[system] = false;

        emit WriteAccessRevoked(system, tokenId);
    }

    /**
     * @dev Função para solicitar acesso para leitura
     * @param tokenId ID da NFT
     */
    function requestReadAccess(uint256 tokenId) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        
        emit AccessRequested(msg.sender, tokenId, false);
    }

    /**
     * @dev Função para solicitar acesso para escrita
     * @param tokenId ID da NFT
     */
    function requestWriteAccess(uint256 tokenId) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        
        emit AccessRequested(msg.sender, tokenId, true);
    }

    /**
     * @dev Função para transferir NFT para novo dono
     * @param to Novo proprietário
     * @param tokenId ID da NFT
     */
    function transferNFT(address to, uint256 tokenId) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can transfer");
        
        address previousOwner = ownerOf(tokenId);
        
        // Registrar histórico de propriedade
        _ownershipHistory[tokenId].push(OwnershipHistory({
            previousOwner: previousOwner,
            transferTime: block.timestamp
        }));
        
        _previousOwnership[previousOwner][tokenId] = true;
        
        // Transferir NFT
        _transfer(previousOwner, to, tokenId);
        _tokenOwners[tokenId] = to;

        emit NFTTransferred(tokenId, previousOwner, to);
    }

    /**
     * @dev Função para retornar a quantidade de sistemas que receberam dados
     * @param tokenId ID da NFT
     * @return Quantidade de sistemas
     */
    function getDataSharingCount(uint256 tokenId) external view returns (uint256) {
        require(_tokenExists[tokenId], "NFT does not exist");
        return _dataSharingCount[tokenId];
    }

    /**
     * @dev Função para ler dados (com validação de acesso)
     * @param tokenId ID da NFT
     * @param key Chave do dado
     * @return Valor do dado ou dados criptografados
     */
    function readData(uint256 tokenId, string memory key) external view returns (string memory) {
        require(_tokenExists[tokenId], "NFT does not exist");
        
        CandidateData storage candidate = _candidateData[tokenId];
        
        // Verificar se tem acesso de leitura
        if (ownerOf(tokenId) == msg.sender || 
            _systemAccess[msg.sender].hasReadAccess || 
            _previousOwnership[msg.sender][tokenId]) {
            
            return candidate.userData[key];
        } else {
            // Retornar dados criptografados para sistemas sem acesso
            return candidate.encryptedData;
        }
    }

    /**
     * @dev Função para obter todos os dados de uma NFT
     * @param tokenId ID da NFT
     * @return name Nome do candidato
     * @return description Descrição do candidato
     * @return dataKeys Array de chaves dos dados
     * @return encryptedData Dados criptografados
     */
    function getAllData(uint256 tokenId) external view returns (
        string memory name,
        string memory description,
        string[] memory dataKeys,
        string memory encryptedData
    ) {
        require(_tokenExists[tokenId], "NFT does not exist");
        
        CandidateData storage candidate = _candidateData[tokenId];
        
        // Verificar se tem acesso de leitura
        if (ownerOf(tokenId) == msg.sender || 
            _systemAccess[msg.sender].hasReadAccess || 
            _previousOwnership[msg.sender][tokenId]) {
            
            return (candidate.name, candidate.description, candidate.dataKeys, "");
        } else {
            return ("", "", new string[](0), candidate.encryptedData);
        }
    }

    /**
     * @dev Função para verificar se um endereço tem acesso de leitura
     * @param system Endereço do sistema
     * @return Tem acesso de leitura
     */
    function hasReadAccess(address system) external view returns (bool) {
        return _hasReadAccess[system];
    }

    /**
     * @dev Função para verificar se um endereço tem acesso de escrita
     * @param system Endereço do sistema
     * @return Tem acesso de escrita
     */
    function hasWriteAccess(address system) external view returns (bool) {
        return _hasWriteAccess[system];
    }

    /**
     * @dev Função para verificar se um endereço teve posse de uma NFT
     * @param system Endereço do sistema
     * @param tokenId ID da NFT
     * @return Teve posse da NFT
     */
    function hadOwnership(address system, uint256 tokenId) external view returns (bool) {
        return _previousOwnership[system][tokenId];
    }

    /**
     * @dev Função para obter o histórico de propriedade de uma NFT
     * @param tokenId ID da NFT
     * @return Array com histórico de propriedade
     */
    function getOwnershipHistory(uint256 tokenId) external view returns (OwnershipHistory[] memory) {
        require(_tokenExists[tokenId], "NFT does not exist");
        return _ownershipHistory[tokenId];
    }

    /**
     * @dev Função para obter informações básicas de uma NFT
     * @param tokenId ID da NFT
     * @return name Nome do candidato
     * @return description Descrição do candidato
     * @return createdAt Timestamp de criação
     * @return lastUpdated Timestamp da última atualização
     */
    function getNFTInfo(uint256 tokenId) external view returns (
        string memory name,
        string memory description,
        uint256 createdAt,
        uint256 lastUpdated
    ) {
        require(_tokenExists[tokenId], "NFT does not exist");
        
        CandidateData storage candidate = _candidateData[tokenId];
        return (candidate.name, candidate.description, candidate.createdAt, candidate.lastUpdated);
    }

    /**
     * @dev Função para obter o proprietário atual de uma NFT
     * @param tokenId ID da NFT
     * @return Endereço do proprietário atual
     */
    function getCurrentOwner(uint256 tokenId) external view returns (address) {
        require(_tokenExists[tokenId], "NFT does not exist");
        return ownerOf(tokenId);
    }

    /**
     * @dev Função para obter o total de NFTs criadas
     * @return Total de NFTs
     */
    function getTotalNFTs() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Função para verificar se um token existe
     * @param tokenId ID da NFT
     * @return Existe o token
     */
    function tokenExists(uint256 tokenId) external view returns (bool) {
        return _tokenExists[tokenId];
    }

    /**
     * @dev Override da função _update para adicionar lógica personalizada
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        address previousOwner = super._update(to, tokenId, auth);
        
        // Incrementar contador de compartilhamento de dados
        if (to != address(0)) {
            _dataSharingCount[tokenId]++;
            emit DataShared(tokenId, to, !_systemAccess[to].hasReadAccess);
        }
        
        return previousOwner;
    }
}
