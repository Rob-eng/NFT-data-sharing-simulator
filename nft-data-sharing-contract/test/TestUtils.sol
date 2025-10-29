// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

/**
 * @title TestUtils
 * @dev Utilitários para testes do contrato NFTDataSharing
 */
library TestUtils {
    // Função para criar endereços de teste
    function createTestAddresses(uint256 count) internal pure returns (address[] memory) {
        address[] memory addresses = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            addresses[i] = address(uint160(0x1000 + i));
        }
        return addresses;
    }

    // Função para gerar dados de teste
    function generateTestData(uint256 count) internal pure returns (string[] memory keys, string[] memory values) {
        keys = new string[](count);
        values = new string[](count);
        
        for (uint256 i = 0; i < count; i++) {
            keys[i] = string(abi.encodePacked("key", i.toString()));
            values[i] = string(abi.encodePacked("value", i.toString()));
        }
    }

    // Função para gerar JSON de teste
    function generateTestJSON() internal pure returns (string memory) {
        return '{"nome": "João Silva", "idade": 30, "cargo": "Desenvolvedor", "skills": ["Solidity", "React", "Node.js"]}';
    }

    // Função para verificar se dois arrays de strings são iguais
    function stringArraysEqual(string[] memory a, string[] memory b) internal pure returns (bool) {
        if (a.length != b.length) return false;
        
        for (uint256 i = 0; i < a.length; i++) {
            if (keccak256(abi.encodePacked(a[i])) != keccak256(abi.encodePacked(b[i]))) {
                return false;
            }
        }
        return true;
    }

    // Função para calcular hash de dados
    function calculateDataHash(string memory data) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(data));
    }

    // Função para simular dados criptografados
    function encryptData(string memory data) internal pure returns (string memory) {
        // Simulação simples de criptografia (apenas para testes)
        return string(abi.encodePacked("encrypted_", data));
    }

    // Função para verificar se um endereço está em uma lista
    function addressInList(address target, address[] memory list) internal pure returns (bool) {
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == target) return true;
        }
        return false;
    }
}
