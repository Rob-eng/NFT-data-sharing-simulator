// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/NFTDataSharing.sol";

/**
 * @title NFTDataSharingTest
 * @dev Testes completos para o contrato NFTDataSharing
 */
contract NFTDataSharingTest is Test {
    NFTDataSharing public nftContract;
    
    address public owner;
    address public user1;
    address public user2;
    address public system1;
    address public system2;
    address public system3;
    
    uint256 public tokenId1;
    uint256 public tokenId2;

    event NFTCreated(uint256 indexed tokenId, address indexed owner, string name);
    event DataAdded(uint256 indexed tokenId, string key, string value);
    event ReadAccessGranted(address indexed system, uint256 indexed tokenId);
    event WriteAccessGranted(address indexed system, uint256 indexed tokenId);
    event ReadAccessRevoked(address indexed system, uint256 indexed tokenId);
    event WriteAccessRevoked(address indexed system, uint256 indexed tokenId);
    event AccessRequested(address indexed requester, uint256 indexed tokenId, bool isWriteAccess);
    event NFTTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event DataShared(uint256 indexed tokenId, address indexed recipient, bool encrypted);

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        system1 = makeAddr("system1");
        system2 = makeAddr("system2");
        system3 = makeAddr("system3");
        
        nftContract = new NFTDataSharing();
        
        // Criar NFTs para testes
        vm.prank(user1);
        tokenId1 = nftContract.createNFT("João Silva", "Candidato para desenvolvedor");
        
        vm.prank(user2);
        tokenId2 = nftContract.createNFT("Maria Santos", "Candidata para designer");
    }

    // Teste 1: Inicialização das variáveis de Estado
    function testInitialization() public {
        assertEq(nftContract.owner(), owner);
        assertEq(nftContract.getTotalNFTs(), 2);
        assertEq(nftContract.getCurrentOwner(tokenId1), user1);
        assertEq(nftContract.getCurrentOwner(tokenId2), user2);
    }

    // Teste 2: Retorno de todos os dados
    function testGetAllData() public {
        // Adicionar dados à NFT
        vm.prank(user1);
        nftContract.addData(tokenId1, "idade", "30");
        vm.prank(user1);
        nftContract.addData(tokenId1, "experiencia", "5 anos");
        
        // Testar retorno de todos os dados pelo proprietário
        (
            string memory name,
            string memory description,
            string[] memory dataKeys,
            string memory encryptedData
        ) = nftContract.getAllData(tokenId1);
        
        assertEq(name, "João Silva");
        assertEq(description, "Candidato para desenvolvedor");
        assertEq(dataKeys.length, 2);
        assertEq(dataKeys[0], "idade");
        assertEq(dataKeys[1], "experiencia");
        assertEq(encryptedData, "");
    }

    // Teste 3: Retorno de dados de uma carteira com permissão de leitura
    function testReadDataWithPermission() public {
        // Adicionar dados
        vm.prank(user1);
        nftContract.addData(tokenId1, "idade", "30");
        
        // Conceder acesso de leitura
        vm.prank(user1);
        nftContract.grantReadAccess(system1, tokenId1);
        
        // Testar leitura com permissão
        vm.prank(system1);
        string memory data = nftContract.readData(tokenId1, "idade");
        assertEq(data, "30");
        
        // Verificar se tem acesso
        assertTrue(nftContract.hasReadAccess(system1));
    }

    // Teste 4: Retorno de dados de uma carteira com permissão de escrita
    function testReadDataWithWritePermission() public {
        // Adicionar dados iniciais
        vm.prank(user1);
        nftContract.addData(tokenId1, "idade", "30");
        
        // Conceder acesso de escrita
        vm.prank(user1);
        nftContract.grantWriteAccess(system1, tokenId1);
        
        // Testar leitura com permissão de escrita
        vm.prank(system1);
        string memory data = nftContract.readData(tokenId1, "idade");
        assertEq(data, "30");
        
        // Verificar se tem acesso de escrita
        assertTrue(nftContract.hasWriteAccess(system1));
    }

    // Teste 5: Escrita de dados por uma carteira com permissão
    function testWriteDataWithPermission() public {
        // Conceder acesso de escrita
        vm.prank(user1);
        nftContract.grantWriteAccess(system1, tokenId1);
        
        // Testar escrita com permissão
        vm.prank(system1);
        nftContract.addData(tokenId1, "salario", "5000");
        
        // Verificar se o dado foi adicionado
        vm.prank(system1);
        string memory data = nftContract.readData(tokenId1, "salario");
        assertEq(data, "5000");
    }

    // Teste 6: Escrita de dados por uma carteira sem permissão
    function testWriteDataWithoutPermission() public {
        // Tentar escrever sem permissão
        vm.prank(system1);
        vm.expectRevert("No write access");
        nftContract.addData(tokenId1, "salario", "5000");
    }

    // Teste 7: Leitura de dados por uma carteira com permissão
    function testReadDataWithPermission() public {
        // Adicionar dados
        vm.prank(user1);
        nftContract.addData(tokenId1, "idade", "30");
        
        // Conceder acesso de leitura
        vm.prank(user1);
        nftContract.grantReadAccess(system1, tokenId1);
        
        // Testar leitura com permissão
        vm.prank(system1);
        string memory data = nftContract.readData(tokenId1, "idade");
        assertEq(data, "30");
    }

    // Teste 8: Leitura de dados por uma carteira sem permissão
    function testReadDataWithoutPermission() public {
        // Adicionar dados
        vm.prank(user1);
        nftContract.addData(tokenId1, "idade", "30");
        
        // Adicionar dados criptografados
        vm.prank(user1);
        nftContract.addDataFromJSON(tokenId1, "encrypted_data_here");
        
        // Testar leitura sem permissão (deve retornar dados criptografados)
        vm.prank(system1);
        string memory data = nftContract.readData(tokenId1, "idade");
        assertEq(data, "encrypted_data_here");
    }

    // Teste 9: Sucesso de uma criação de NFT
    function testNFTCreationSuccess() public {
        uint256 initialCount = nftContract.getTotalNFTs();
        
        vm.prank(user1);
        uint256 newTokenId = nftContract.createNFT("Pedro Costa", "Candidato para analista");
        
        assertEq(nftContract.getTotalNFTs(), initialCount + 1);
        assertEq(nftContract.getCurrentOwner(newTokenId), user1);
        
        (string memory name, string memory description,,) = nftContract.getNFTInfo(newTokenId);
        assertEq(name, "Pedro Costa");
        assertEq(description, "Candidato para analista");
    }

    // Teste 10: Sucesso de uma transferência de NFT
    function testNFTTransferSuccess() public {
        // Transferir NFT
        vm.prank(user1);
        nftContract.transferNFT(user2, tokenId1);
        
        // Verificar nova propriedade
        assertEq(nftContract.getCurrentOwner(tokenId1), user2);
        
        // Verificar histórico de propriedade
        assertTrue(nftContract.hadOwnership(user1, tokenId1));
        
        // Verificar se o proprietário anterior ainda tem acesso de leitura
        vm.prank(user1);
        string memory data = nftContract.readData(tokenId1, "idade");
        // Deve conseguir ler mesmo após transferência
    }

    // Teste 11: Concessão e revogação de acesso
    function testAccessGrantAndRevoke() public {
        // Conceder acesso de leitura
        vm.prank(user1);
        nftContract.grantReadAccess(system1, tokenId1);
        assertTrue(nftContract.hasReadAccess(system1));
        
        // Conceder acesso de escrita
        vm.prank(user1);
        nftContract.grantWriteAccess(system1, tokenId1);
        assertTrue(nftContract.hasWriteAccess(system1));
        
        // Revogar acesso de leitura
        vm.prank(user1);
        nftContract.revokeReadAccess(system1, tokenId1);
        assertFalse(nftContract.hasReadAccess(system1));
        
        // Revogar acesso de escrita
        vm.prank(user1);
        nftContract.revokeWriteAccess(system1, tokenId1);
        assertFalse(nftContract.hasWriteAccess(system1));
    }

    // Teste 12: Solicitação de acesso
    function testAccessRequest() public {
        // Solicitar acesso de leitura
        vm.prank(system1);
        vm.expectEmit(true, true, false, true);
        emit AccessRequested(system1, tokenId1, false);
        nftContract.requestReadAccess(tokenId1);
        
        // Solicitar acesso de escrita
        vm.prank(system2);
        vm.expectEmit(true, true, false, true);
        emit AccessRequested(system2, tokenId1, true);
        nftContract.requestWriteAccess(tokenId1);
    }

    // Teste 13: Contagem de sistemas que receberam dados
    function testDataSharingCount() public {
        uint256 initialCount = nftContract.getDataSharingCount(tokenId1);
        
        // Transferir NFT (isso deve incrementar o contador)
        vm.prank(user1);
        nftContract.transferNFT(user2, tokenId1);
        
        uint256 newCount = nftContract.getDataSharingCount(tokenId1);
        assertEq(newCount, initialCount + 1);
    }

    // Teste 14: Validação de acesso para proprietário anterior
    function testPreviousOwnerAccess() public {
        // Adicionar dados
        vm.prank(user1);
        nftContract.addData(tokenId1, "idade", "30");
        
        // Transferir NFT
        vm.prank(user1);
        nftContract.transferNFT(user2, tokenId1);
        
        // Verificar se o proprietário anterior ainda pode ler os dados
        vm.prank(user1);
        string memory data = nftContract.readData(tokenId1, "idade");
        assertEq(data, "30");
        
        // Verificar se está registrado como proprietário anterior
        assertTrue(nftContract.hadOwnership(user1, tokenId1));
    }

    // Teste 15: Histórico de propriedade
    function testOwnershipHistory() public {
        // Transferir NFT múltiplas vezes
        vm.prank(user1);
        nftContract.transferNFT(user2, tokenId1);
        
        vm.prank(user2);
        nftContract.transferNFT(system1, tokenId1);
        
        // Verificar histórico
        NFTDataSharing.OwnershipHistory[] memory history = nftContract.getOwnershipHistory(tokenId1);
        assertEq(history.length, 2);
        assertEq(history[0].previousOwner, user1);
        assertEq(history[1].previousOwner, user2);
    }

    // Teste 16: Dados JSON
    function testJSONData() public {
        string memory jsonData = '{"nome": "João", "idade": 30, "skills": ["Solidity", "React"]}';
        
        vm.prank(user1);
        nftContract.addDataFromJSON(tokenId1, jsonData);
        
        vm.prank(user1);
        string memory retrievedData = nftContract.readData(tokenId1, "json");
        assertEq(retrievedData, jsonData);
    }

    // Teste 17: Múltiplas chaves de dados
    function testMultipleDataKeys() public {
        vm.prank(user1);
        nftContract.addData(tokenId1, "nome", "João Silva");
        
        vm.prank(user1);
        nftContract.addData(tokenId1, "idade", "30");
        
        vm.prank(user1);
        nftContract.addData(tokenId1, "cargo", "Desenvolvedor");
        
        (, , string[] memory keys,) = nftContract.getAllData(tokenId1);
        assertEq(keys.length, 3);
    }

    // Teste 18: Eventos
    function testEvents() public {
        // Testar evento de criação de NFT
        vm.expectEmit(true, true, false, true);
        emit NFTCreated(tokenId1, user1, "João Silva");
        vm.prank(user1);
        nftContract.createNFT("João Silva", "Candidato");
        
        // Testar evento de adição de dados
        vm.expectEmit(true, false, false, true);
        emit DataAdded(tokenId1, "idade", "30");
        vm.prank(user1);
        nftContract.addData(tokenId1, "idade", "30");
        
        // Testar evento de concessão de acesso
        vm.expectEmit(true, true, false, true);
        emit ReadAccessGranted(system1, tokenId1);
        vm.prank(user1);
        nftContract.grantReadAccess(system1, tokenId1);
    }

    // Teste 19: Validação de propriedade
    function testOwnershipValidation() public {
        // Apenas o proprietário pode conceder acesso
        vm.prank(system1);
        vm.expectRevert("Only owner can grant access");
        nftContract.grantReadAccess(system2, tokenId1);
        
        // Apenas o proprietário pode revogar acesso
        vm.prank(system1);
        vm.expectRevert("Only owner can revoke access");
        nftContract.revokeReadAccess(system2, tokenId1);
        
        // Apenas o proprietário pode transferir
        vm.prank(system1);
        vm.expectRevert("Only owner can transfer");
        nftContract.transferNFT(system2, tokenId1);
    }

    // Teste 20: Validação de existência de NFT
    function testNFTExistenceValidation() public {
        uint256 nonExistentTokenId = 999;
        
        vm.prank(user1);
        vm.expectRevert("NFT does not exist");
        nftContract.grantReadAccess(system1, nonExistentTokenId);
        
        vm.prank(user1);
        vm.expectRevert("NFT does not exist");
        nftContract.addData(nonExistentTokenId, "test", "value");
        
        vm.prank(user1);
        vm.expectRevert("NFT does not exist");
        nftContract.readData(nonExistentTokenId, "test");
    }
}
