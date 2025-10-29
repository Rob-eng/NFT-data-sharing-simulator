#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec, String, Address, Map, Bytes};

const NFT_DATA_SHARING: Symbol = symbol_short!("NFTDS");
const TOKEN_COUNTER: Symbol = symbol_short!("TOKCNT");
const ENCRYPTED_DATA: Symbol = symbol_short!("ENCDATA");
const PUBLIC_DATA: Symbol = symbol_short!("PUBDATA");
const ACCESS_COUNT: Symbol = symbol_short!("ACCNT");

#[contract]
pub struct NFTDataSharing;

#[contractimpl]
impl NFTDataSharing {
    pub fn initialize(env: &Env, admin: Address) {
        env.storage().instance().set(&NFT_DATA_SHARING, &admin);
    }

    // Função auxiliar para incrementar contador de acessos
    fn increment_access_count(env: &Env, token_id: u32) {
        let count_key = (ACCESS_COUNT, token_id);
        let current_count = env.storage().persistent().get(&count_key).unwrap_or(0);
        env.storage().persistent().set(&count_key, &(current_count + 1));
    }

    pub fn create_nft(env: &Env, name: String, description: String) -> u32 {
        let admin: Address = env.storage().instance().get(&NFT_DATA_SHARING).unwrap();
        admin.require_auth();
        
        let token_id = env.storage().instance().get(&TOKEN_COUNTER).unwrap_or(0);
        env.storage().instance().set(&TOKEN_COUNTER, &(token_id + 1));
        
        let nft_data = vec![env, name, description];
        let key = (TOKEN_COUNTER, token_id);
        env.storage().persistent().set(&key, &nft_data);
        
        token_id
    }

    // Adicionar dados públicos (não criptografados)
    pub fn add_public_data(env: &Env, token_id: u32, key: String, value: String) {
        let admin: Address = env.storage().instance().get(&NFT_DATA_SHARING).unwrap();
        admin.require_auth();
        
        let data_key = (PUBLIC_DATA, token_id);
        let mut data_map: Map<String, String> = env.storage().persistent().get(&data_key).unwrap_or(Map::new(env));
        data_map.set(key, value);
        env.storage().persistent().set(&data_key, &data_map);
    }

    // Adicionar dados criptografados (apenas para sistemas com acesso)
    pub fn add_encrypted_data(env: &Env, token_id: u32, key: String, encrypted_value: Bytes) {
        let admin: Address = env.storage().instance().get(&NFT_DATA_SHARING).unwrap();
        admin.require_auth();
        
        let data_key = (ENCRYPTED_DATA, token_id);
        let mut data_map: Map<String, Bytes> = env.storage().persistent().get(&data_key).unwrap_or(Map::new(env));
        data_map.set(key, encrypted_value);
        env.storage().persistent().set(&data_key, &data_map);
    }

    // Ler dados públicos (qualquer um pode ler)
    pub fn read_public_data(env: &Env, token_id: u32, key: String) -> String {
        let data_key = (PUBLIC_DATA, token_id);
        let data_map: Map<String, String> = env.storage().persistent().get(&data_key).unwrap_or(Map::new(env));
        let result = data_map.get(key).unwrap_or(String::from_str(env, "No data found"));
        
        // Incrementar contador de acessos
        Self::increment_access_count(env, token_id);
        
        result
    }

    // Ler dados criptografados (apenas sistemas com acesso)
    pub fn read_encrypted_data(env: &Env, token_id: u32, key: String, requester: Address) -> Bytes {
        // Verificar se o solicitante tem acesso
        let read_access_key = (symbol_short!("READ"), (requester, token_id));
        let has_access = env.storage().persistent().get(&read_access_key).unwrap_or(false);
        
        if !has_access {
            return Bytes::new(env);
        }
        
        let data_key = (ENCRYPTED_DATA, token_id);
        let data_map: Map<String, Bytes> = env.storage().persistent().get(&data_key).unwrap_or(Map::new(env));
        let result = data_map.get(key).unwrap_or(Bytes::new(env));
        
        // Incrementar contador de acessos
        Self::increment_access_count(env, token_id);
        
        result
    }

    // Função para sistemas sem acesso (retorna dados criptografados)
    pub fn get_encrypted_data(env: &Env, token_id: u32, key: String) -> Bytes {
        let data_key = (ENCRYPTED_DATA, token_id);
        let data_map: Map<String, Bytes> = env.storage().persistent().get(&data_key).unwrap_or(Map::new(env));
        let result = data_map.get(key).unwrap_or(Bytes::new(env));
        
        // Incrementar contador de acessos
        Self::increment_access_count(env, token_id);
        
        result
    }

    // Conceder acesso de leitura
    pub fn grant_read_access(env: &Env, system: Address, token_id: u32) {
        let admin: Address = env.storage().instance().get(&NFT_DATA_SHARING).unwrap();
        admin.require_auth();
        
        let access_key = (symbol_short!("READ"), (system, token_id));
        env.storage().persistent().set(&access_key, &true);
    }

    // Conceder acesso de escrita
    pub fn grant_write_access(env: &Env, system: Address, token_id: u32) {
        let admin: Address = env.storage().instance().get(&NFT_DATA_SHARING).unwrap();
        admin.require_auth();
        
        let access_key = (symbol_short!("WRITE"), (system, token_id));
        env.storage().persistent().set(&access_key, &true);
    }

    // Verificar acesso de leitura
    pub fn has_read_access(env: &Env, system: Address, token_id: u32) -> bool {
        let access_key = (symbol_short!("READ"), (system, token_id));
        env.storage().persistent().get(&access_key).unwrap_or(false)
    }

    // Verificar acesso de escrita
    pub fn has_write_access(env: &Env, system: Address, token_id: u32) -> bool {
        let access_key = (symbol_short!("WRITE"), (system, token_id));
        env.storage().persistent().get(&access_key).unwrap_or(false)
    }

    // Revogar acesso de leitura
    pub fn revoke_read_access(env: &Env, system: Address, token_id: u32) {
        let admin: Address = env.storage().instance().get(&NFT_DATA_SHARING).unwrap();
        admin.require_auth();
        
        let access_key = (symbol_short!("READ"), (system, token_id));
        env.storage().persistent().set(&access_key, &false);
    }

    // Revogar acesso de escrita
    pub fn revoke_write_access(env: &Env, system: Address, token_id: u32) {
        let admin: Address = env.storage().instance().get(&NFT_DATA_SHARING).unwrap();
        admin.require_auth();
        
        let access_key = (symbol_short!("WRITE"), (system, token_id));
        env.storage().persistent().set(&access_key, &false);
    }

    // Obter total de NFTs
    pub fn get_total_nfts(env: &Env) -> u32 {
        env.storage().instance().get(&TOKEN_COUNTER).unwrap_or(0)
    }

    // Obter informações da NFT
    pub fn get_nft_info(env: &Env, token_id: u32) -> Vec<String> {
        let key = (TOKEN_COUNTER, token_id);
        env.storage().persistent().get(&key).unwrap_or(vec![env])
    }

    // Obter contagem de compartilhamento de dados
    pub fn get_data_sharing_count(env: &Env, token_id: u32) -> u32 {
        let count_key = (ACCESS_COUNT, token_id);
        env.storage().persistent().get(&count_key).unwrap_or(0)
    }

    // Listar todos os dados públicos de uma NFT
    pub fn get_all_public_data(env: &Env, token_id: u32) -> Map<String, String> {
        let data_key = (PUBLIC_DATA, token_id);
        env.storage().persistent().get(&data_key).unwrap_or(Map::new(env))
    }

    // NOVAS FUNÇÕES DE AUDITORIA E ANALYTICS

    // Obter estatísticas de acesso para uma NFT específica
    pub fn get_access_stats(env: &Env, token_id: u32) -> Map<String, u32> {
        let mut stats = Map::new(env);
        let count_key = (ACCESS_COUNT, token_id);
        let access_count = env.storage().persistent().get(&count_key).unwrap_or(0);
        
        stats.set(String::from_str(env, "total_accesses"), access_count);
        stats.set(String::from_str(env, "nft_id"), token_id);
        
        stats
    }

    // Verificar integridade dos dados
    pub fn verify_data_integrity(env: &Env, token_id: u32) -> Map<String, bool> {
        let mut integrity = Map::new(env);
        
        // Verificar se NFT existe
        let nft_key = (TOKEN_COUNTER, token_id);
        let nft_exists = env.storage().persistent().has(&nft_key);
        integrity.set(String::from_str(env, "nft_exists"), nft_exists);
        
        // Verificar dados públicos
        let public_key = (PUBLIC_DATA, token_id);
        let public_data_exists = env.storage().persistent().has(&public_key);
        integrity.set(String::from_str(env, "public_data_exists"), public_data_exists);
        
        // Verificar dados criptografados
        let encrypted_key = (ENCRYPTED_DATA, token_id);
        let encrypted_data_exists = env.storage().persistent().has(&encrypted_key);
        integrity.set(String::from_str(env, "encrypted_data_exists"), encrypted_data_exists);
        
        integrity
    }

    // Obter contagem total de acessos em todo o sistema
    pub fn get_total_accesses(env: &Env) -> u32 {
        let mut total = 0;
        let nft_count = env.storage().instance().get(&TOKEN_COUNTER).unwrap_or(0);
        
        for i in 0..nft_count {
            let count_key = (ACCESS_COUNT, i);
            let count = env.storage().persistent().get(&count_key).unwrap_or(0);
            total += count;
        }
        
        total
    }

    // Obter estatísticas gerais do sistema
    pub fn get_system_stats(env: &Env) -> Map<String, u32> {
        let mut stats = Map::new(env);
        let total_nfts = env.storage().instance().get(&TOKEN_COUNTER).unwrap_or(0);
        let total_accesses = Self::get_total_accesses(env);
        
        stats.set(String::from_str(env, "total_nfts"), total_nfts);
        stats.set(String::from_str(env, "total_accesses"), total_accesses);
        
        stats
    }

    // Verificar se uma NFT tem dados criptografados
    pub fn has_encrypted_data(env: &Env, token_id: u32) -> bool {
        let encrypted_key = (ENCRYPTED_DATA, token_id);
        env.storage().persistent().has(&encrypted_key)
    }

    // Verificar se uma NFT tem dados públicos
    pub fn has_public_data(env: &Env, token_id: u32) -> bool {
        let public_key = (PUBLIC_DATA, token_id);
        env.storage().persistent().has(&public_key)
    }
}