# 🚀 Deploy na Stellar Testnet - NFT Data Sharing Contract

## 📋 Opções para Deploy na Stellar

### 1. 🌟 Soroban (Recomendado - Nativo Stellar)

**Soroban** é a plataforma de smart contracts nativa da Stellar, desenvolvida especificamente para a rede.

#### Pré-requisitos:
- Stellar CLI (`stellar-cli`)
- Rust (para contratos Soroban)
- Conta Stellar com XLM

#### Passo a Passo:

1. **Instalar Stellar CLI:**
```bash
# macOS
brew install stellar/stellar-cli/stellar-cli

# Linux/Windows
curl -sSL https://github.com/stellar/stellar-cli/releases/latest/download/stellar-cli-linux-amd64.tar.gz | tar -xz
```

2. **Configurar Rede Testnet:**
```bash
stellar config set --global network testnet
stellar config set --global horizon-url https://horizon-testnet.stellar.org
```

3. **Criar Conta:**
```bash
stellar keys generate --global-keypair
stellar account create --global-keypair
```

4. **Fundar Conta:**
```bash
# Usar o Friendbot para fundar na testnet
curl "https://friendbot.stellar.org/?addr=$(stellar keys show --global-keypair)"
```

5. **Deploy do Contrato:**
```bash
# Compilar contrato Soroban
cargo build --target wasm32-unknown-unknown --release

# Deploy
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/nft_data_sharing.wasm
```

### 2. 🌉 Bridge Ethereum-Stellar

Usar bridges para conectar contratos Ethereum com Stellar.

#### Opções de Bridge:
- **Stellar Bridge** (oficial)
- **Wormhole**
- **LayerZero**

#### Passo a Passo:

1. **Deploy na Ethereum Testnet:**
```bash
# Usar o contrato Solidity que já temos
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify
```

2. **Configurar Bridge:**
```bash
# Instalar bridge CLI
npm install -g @stellar/bridge-cli

# Configurar bridge
bridge config set --network stellar-testnet
bridge config set --ethereum-network sepolia
```

3. **Fazer Bridge:**
```bash
# Bridge do contrato para Stellar
bridge deploy --contract-address 0x... --stellar-network testnet
```

### 3. 🔗 Sidechain EVM

Usar sidechains EVM-compatíveis conectadas ao Stellar.

#### Opções:
- **Soroban EVM** (quando disponível)
- **Stellar EVM Sidechain**

#### Passo a Passo:

1. **Configurar Sidechain:**
```bash
# Configurar RPC da sidechain
export STELLAR_EVM_RPC="https://stellar-evm-testnet.example.com"
```

2. **Deploy na Sidechain:**
```bash
# Usar o contrato Solidity
forge script script/Deploy.s.sol --rpc-url $STELLAR_EVM_RPC --broadcast
```

## 🛠️ Implementação Soroban (Nativa)

### Estrutura do Projeto:

```
nft-data-sharing-stellar/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   └── nft_data_sharing.rs
├── tests/
│   └── integration.rs
└── .soroban/
    └── config.toml
```

### Cargo.toml:
```toml
[package]
name = "nft-data-sharing"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
soroban-sdk = "0.9.0"

[profile.release]
opt-level = "z"
overflow-checks = true
debug = 0
strip = "symbols"
```

### Contrato Soroban (nft_data_sharing.rs):
```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec, String, Address, Map};

const NFT_DATA_SHARING: Symbol = symbol_short!("NFTDS");

#[contract]
pub struct NFTDataSharing;

#[contractimpl]
impl NFTDataSharing {
    pub fn initialize(env: &Env, admin: Address) {
        env.storage().instance().set(&NFT_DATA_SHARING, &admin);
    }

    pub fn create_nft(env: &Env, name: String, description: String) -> u32 {
        let admin: Address = env.storage().instance().get(&NFT_DATA_SHARING).unwrap();
        admin.require_auth();
        
        let token_id = env.storage().instance().get(&symbol_short!("token_counter")).unwrap_or(0);
        env.storage().instance().set(&symbol_short!("token_counter"), &(token_id + 1));
        
        let nft_data = vec![env, name, description];
        env.storage().persistent().set(&symbol_short!("nft_data"), &token_id, &nft_data);
        
        token_id
    }

    pub fn add_data(env: &Env, token_id: u32, key: String, value: String) {
        let admin: Address = env.storage().instance().get(&NFT_DATA_SHARING).unwrap();
        admin.require_auth();
        
        let mut data_map: Map<String, String> = env.storage().persistent().get(&symbol_short!("data_map"), &token_id).unwrap_or(Map::new(env));
        data_map.set(key, value);
        env.storage().persistent().set(&symbol_short!("data_map"), &token_id, &data_map);
    }

    pub fn read_data(env: &Env, token_id: u32, key: String) -> String {
        let data_map: Map<String, String> = env.storage().persistent().get(&symbol_short!("data_map"), &token_id).unwrap_or(Map::new(env));
        data_map.get(key).unwrap_or(String::from_str(env, "No access"))
    }

    pub fn grant_read_access(env: &Env, system: Address, token_id: u32) {
        let admin: Address = env.storage().instance().get(&NFT_DATA_SHARING).unwrap();
        admin.require_auth();
        
        env.storage().persistent().set(&symbol_short!("read_access"), &(system, token_id), &true);
    }

    pub fn grant_write_access(env: &Env, system: Address, token_id: u32) {
        let admin: Address = env.storage().instance().get(&NFT_DATA_SHARING).unwrap();
        admin.require_auth();
        
        env.storage().persistent().set(&symbol_short!("write_access"), &(system, token_id), &true);
    }

    pub fn has_read_access(env: &Env, system: Address, token_id: u32) -> bool {
        env.storage().persistent().get(&symbol_short!("read_access"), &(system, token_id)).unwrap_or(false)
    }

    pub fn has_write_access(env: &Env, system: Address, token_id: u32) -> bool {
        env.storage().persistent().get(&symbol_short!("write_access"), &(system, token_id)).unwrap_or(false)
    }

    pub fn get_total_nfts(env: &Env) -> u32 {
        env.storage().instance().get(&symbol_short!("token_counter")).unwrap_or(0)
    }
}
```

## 🧪 Testes na Stellar Testnet

### 1. Testar Contrato:
```bash
# Executar testes
cargo test

# Testar na testnet
stellar contract invoke --id CONTRACT_ID -- create_nft "João Silva" "Candidato"
```

### 2. Interagir com Contrato:
```bash
# Adicionar dados
stellar contract invoke --id CONTRACT_ID -- add_data 0 "idade" "30"

# Ler dados
stellar contract invoke --id CONTRACT_ID -- read_data 0 "idade"

# Conceder acesso
stellar contract invoke --id CONTRACT_ID -- grant_read_access SYSTEM_ADDRESS 0
```

## 📊 Comparação das Opções

| Opção | Prós | Contras | Complexidade |
|-------|------|---------|--------------|
| **Soroban** | Nativo, rápido, barato | Nova tecnologia | Média |
| **Bridge** | Usa contrato existente | Dependência externa | Alta |
| **Sidechain** | Compatibilidade EVM | Ainda em desenvolvimento | Baixa |

## 🎯 Recomendação

**Para seu projeto, recomendo:**

1. **Começar com Soroban** (nativo Stellar)
2. **Usar o contrato Rust** que criei
3. **Deploy na testnet** para testes
4. **Evoluir para mainnet** quando pronto

## 🚀 Próximos Passos

1. **Instalar Stellar CLI**
2. **Configurar ambiente testnet**
3. **Compilar contrato Soroban**
4. **Fazer deploy na testnet**
5. **Testar funcionalidades**
6. **Preparar para mainnet**

## 📚 Recursos Úteis

- [Documentação Soroban](https://soroban.stellar.org/docs)
- [Stellar CLI](https://github.com/stellar/stellar-cli)
- [Stellar Testnet](https://testnet.stellar.org/)
- [Horizon API](https://developers.stellar.org/api)
- [Stellar Laboratory](https://laboratory.stellar.org/)

---

**💡 Dica:** Comece com Soroban para ter a melhor experiência nativa na Stellar!
