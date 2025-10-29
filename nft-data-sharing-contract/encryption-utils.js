/**
 * 🔐 Utilitário de Criptografia para NFT Data Sharing
 * 
 * Este arquivo demonstra como criptografar/descriptografar dados
 * antes de enviar para o contrato Soroban na Stellar
 */

// Simulação de criptografia AES (em produção, use uma biblioteca real como crypto-js)
class EncryptionUtils {
    constructor() {
        this.algorithm = 'AES-256-CBC';
    }

    /**
     * Criptografa dados usando uma chave
     * @param {string} data - Dados para criptografar
     * @param {string} key - Chave de criptografia
     * @returns {string} Dados criptografados em base64
     */
    encrypt(data, key) {
        // Em produção, use uma biblioteca real como crypto-js
        // Aqui é apenas uma simulação
        const encrypted = btoa(data + '|' + key); // Simulação simples
        return encrypted;
    }

    /**
     * Descriptografa dados usando uma chave
     * @param {string} encryptedData - Dados criptografados
     * @param {string} key - Chave de descriptografia
     * @returns {string} Dados descriptografados
     */
    decrypt(encryptedData, key) {
        try {
            // Em produção, use uma biblioteca real como crypto-js
            const decrypted = atob(encryptedData);
            const [data, originalKey] = decrypted.split('|');
            if (originalKey === key) {
                return data;
            }
            throw new Error('Chave incorreta');
        } catch (error) {
            throw new Error('Falha na descriptografia: ' + error.message);
        }
    }

    /**
     * Gera uma chave de criptografia aleatória
     * @returns {string} Chave aleatória
     */
    generateKey() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    /**
     * Converte string para bytes (formato Soroban)
     * @param {string} str - String para converter
     * @returns {Array} Array de bytes
     */
    stringToBytes(str) {
        return Array.from(str).map(char => char.charCodeAt(0));
    }

    /**
     * Converte bytes para string
     * @param {Array} bytes - Array de bytes
     * @returns {string} String resultante
     */
    bytesToString(bytes) {
        return String.fromCharCode(...bytes);
    }
}

// Exemplo de uso
const crypto = new EncryptionUtils();

// Dados sensíveis do candidato
const candidateData = {
    name: "João Silva",
    cpf: "123.456.789-00",
    salary: "R$ 8.000,00",
    phone: "(11) 99999-9999",
    address: "Rua das Flores, 123"
};

// Chave de criptografia (em produção, gere uma chave segura)
const encryptionKey = crypto.generateKey();
console.log("🔑 Chave de criptografia:", encryptionKey);

// Criptografar dados sensíveis
const encryptedData = {};
Object.keys(candidateData).forEach(key => {
    encryptedData[key] = crypto.encrypt(candidateData[key], encryptionKey);
});

console.log("🔐 Dados criptografados:", encryptedData);

// Simular envio para o contrato Soroban
console.log("\n📤 Comandos para enviar ao contrato:");
console.log("1. Dados públicos (não criptografados):");
console.log(`soroban contract invoke --id CONTRACT_ID --source-account admin -- add_public_data --token_id 0 --key "nome" --value "João Silva"`);

console.log("\n2. Dados criptografados:");
Object.keys(encryptedData).forEach(key => {
    const bytes = crypto.stringToBytes(encryptedData[key]);
    console.log(`soroban contract invoke --id CONTRACT_ID --source-account admin -- add_encrypted_data --token_id 0 --key "${key}" --encrypted_value "[${bytes.join(',')}]"`);
});

console.log("\n3. Conceder acesso de leitura:");
console.log(`soroban contract invoke --id CONTRACT_ID --source-account admin -- grant_read_access --system SYSTEM_ADDRESS --token_id 0`);

console.log("\n4. Ler dados criptografados (com acesso):");
console.log(`soroban contract invoke --id CONTRACT_ID --source-account system -- read_encrypted_data --token_id 0 --key "cpf" --requester SYSTEM_ADDRESS`);

console.log("\n5. Ler dados criptografados (sem acesso):");
console.log(`soroban contract invoke --id CONTRACT_ID --source-account unauthorized -- request_encrypted_data --token_id 0 --key "cpf"`);

// Demonstração de descriptografia
console.log("\n🔓 Descriptografia dos dados:");
Object.keys(encryptedData).forEach(key => {
    try {
        const decrypted = crypto.decrypt(encryptedData[key], encryptionKey);
        console.log(`${key}: ${decrypted}`);
    } catch (error) {
        console.log(`${key}: Erro na descriptografia`);
    }
});

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EncryptionUtils;
}
