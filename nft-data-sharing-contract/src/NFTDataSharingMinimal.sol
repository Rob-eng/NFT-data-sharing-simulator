// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NFTDataSharingMinimal
 * @dev Versão mínima sem dependências externas
 */
contract NFTDataSharingMinimal {
    uint256 private _tokenIdCounter;
    address public owner;
    
    struct CandidateData {
        uint256 id;
        string name;
        string description;
        string data;
        uint256 createdAt;
        address tokenOwner;
    }
    
    mapping(uint256 => CandidateData) private _candidateData;
    mapping(address => bool) private _hasReadAccess;
    mapping(address => bool) private _hasWriteAccess;
    mapping(uint256 => bool) private _tokenExists;
    mapping(uint256 => address) private _tokenOwners;
    
    event NFTCreated(uint256 indexed tokenId, address indexed owner, string name);
    event DataAdded(uint256 indexed tokenId, string data);
    event ReadAccessGranted(address indexed system, uint256 indexed tokenId);
    event WriteAccessGranted(address indexed system, uint256 indexed tokenId);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    function createNFT(string memory name, string memory description) external returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _candidateData[tokenId] = CandidateData({
            id: tokenId,
            name: name,
            description: description,
            data: "",
            createdAt: block.timestamp,
            tokenOwner: msg.sender
        });
        
        _tokenOwners[tokenId] = msg.sender;
        _tokenExists[tokenId] = true;
        
        emit NFTCreated(tokenId, msg.sender, name);
        return tokenId;
    }
    
    function addData(uint256 tokenId, string memory data) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(_tokenOwners[tokenId] == msg.sender || _hasWriteAccess[msg.sender], "No write access");
        
        _candidateData[tokenId].data = data;
        
        emit DataAdded(tokenId, data);
    }
    
    function grantReadAccess(address system, uint256 tokenId) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(_tokenOwners[tokenId] == msg.sender, "Only owner can grant access");
        
        _hasReadAccess[system] = true;
        emit ReadAccessGranted(system, tokenId);
    }
    
    function grantWriteAccess(address system, uint256 tokenId) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(_tokenOwners[tokenId] == msg.sender, "Only owner can grant access");
        
        _hasWriteAccess[system] = true;
        emit WriteAccessGranted(system, tokenId);
    }
    
    function readData(uint256 tokenId) external view returns (string memory) {
        require(_tokenExists[tokenId], "NFT does not exist");
        
        if (_tokenOwners[tokenId] == msg.sender || _hasReadAccess[msg.sender]) {
            return _candidateData[tokenId].data;
        } else {
            return "No access";
        }
    }
    
    function getNFTInfo(uint256 tokenId) external view returns (
        string memory name,
        string memory description,
        uint256 createdAt,
        address tokenOwner
    ) {
        require(_tokenExists[tokenId], "NFT does not exist");
        
        CandidateData memory candidate = _candidateData[tokenId];
        return (candidate.name, candidate.description, candidate.createdAt, candidate.tokenOwner);
    }
    
    function getTotalNFTs() external view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function hasReadAccess(address system) external view returns (bool) {
        return _hasReadAccess[system];
    }
    
    function hasWriteAccess(address system) external view returns (bool) {
        return _hasWriteAccess[system];
    }
    
    function tokenExists(uint256 tokenId) external view returns (bool) {
        return _tokenExists[tokenId];
    }
    
    function getTokenOwner(uint256 tokenId) external view returns (address) {
        require(_tokenExists[tokenId], "NFT does not exist");
        return _tokenOwners[tokenId];
    }
}
