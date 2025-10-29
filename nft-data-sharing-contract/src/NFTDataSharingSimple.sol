// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTDataSharingSimple
 * @dev Versão simplificada do contrato NFTDataSharing para deploy local
 */
contract NFTDataSharingSimple is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    struct CandidateData {
        uint256 id;
        string name;
        string description;
        mapping(string => string) userData;
        string[] dataKeys;
        uint256 createdAt;
    }
    
    mapping(uint256 => CandidateData) private _candidateData;
    mapping(address => bool) private _hasReadAccess;
    mapping(address => bool) private _hasWriteAccess;
    mapping(uint256 => bool) private _tokenExists;
    
    event NFTCreated(uint256 indexed tokenId, address indexed owner, string name);
    event DataAdded(uint256 indexed tokenId, string key, string value);
    event ReadAccessGranted(address indexed system, uint256 indexed tokenId);
    event WriteAccessGranted(address indexed system, uint256 indexed tokenId);
    
    constructor() ERC721("NFTDataSharing", "NDS") Ownable(msg.sender) {}
    
    function createNFT(string memory name, string memory description) external returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _mint(msg.sender, tokenId);
        
        CandidateData storage candidate = _candidateData[tokenId];
        candidate.id = tokenId;
        candidate.name = name;
        candidate.description = description;
        candidate.createdAt = block.timestamp;
        
        _tokenExists[tokenId] = true;
        
        emit NFTCreated(tokenId, msg.sender, name);
        return tokenId;
    }
    
    function addData(uint256 tokenId, string memory key, string memory value) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender || _hasWriteAccess[msg.sender], "No write access");
        
        CandidateData storage candidate = _candidateData[tokenId];
        
        if (bytes(candidate.userData[key]).length == 0) {
            candidate.dataKeys.push(key);
        }
        
        candidate.userData[key] = value;
        
        emit DataAdded(tokenId, key, value);
    }
    
    function grantReadAccess(address system, uint256 tokenId) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can grant access");
        
        _hasReadAccess[system] = true;
        emit ReadAccessGranted(system, tokenId);
    }
    
    function grantWriteAccess(address system, uint256 tokenId) external {
        require(_tokenExists[tokenId], "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can grant access");
        
        _hasWriteAccess[system] = true;
        emit WriteAccessGranted(system, tokenId);
    }
    
    function readData(uint256 tokenId, string memory key) external view returns (string memory) {
        require(_tokenExists[tokenId], "NFT does not exist");
        
        CandidateData storage candidate = _candidateData[tokenId];
        
        if (ownerOf(tokenId) == msg.sender || _hasReadAccess[msg.sender]) {
            return candidate.userData[key];
        } else {
            return "No access";
        }
    }
    
    function getNFTInfo(uint256 tokenId) external view returns (
        string memory name,
        string memory description,
        uint256 createdAt
    ) {
        require(_tokenExists[tokenId], "NFT does not exist");
        
        CandidateData storage candidate = _candidateData[tokenId];
        return (candidate.name, candidate.description, candidate.createdAt);
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
}