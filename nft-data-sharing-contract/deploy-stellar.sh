#!/bin/bash

# 🌟 Script de Deploy para Stellar Testnet - NFT Data Sharing Contract
# Este script automatiza o processo de deploy na rede testnet da Stellar

set -e

echo "🌟 Iniciando deploy na Stellar Testnet..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Stellar CLI está instalado
check_stellar_cli() {
    print_status "Verificando Stellar CLI..."
    if ! command -v stellar &> /dev/null; then
        print_error "Stellar CLI não encontrado!"
        print_status "Instalando Stellar CLI..."
        
        # Detectar sistema operacional
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew &> /dev/null; then
                brew install stellar/stellar-cli/stellar-cli
            else
                print_error "Homebrew não encontrado. Instale manualmente: https://github.com/stellar/stellar-cli"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl -sSL https://github.com/stellar/stellar-cli/releases/latest/download/stellar-cli-linux-amd64.tar.gz | tar -xz
            sudo mv stellar-cli /usr/local/bin/stellar
        else
            print_error "Sistema operacional não suportado. Instale manualmente: https://github.com/stellar/stellar-cli"
            exit 1
        fi
    fi
    print_success "Stellar CLI encontrado!"
}

# Configurar rede testnet
setup_testnet() {
    print_status "Configurando rede testnet..."
    stellar config set --global network testnet
    stellar config set --global horizon-url https://horizon-testnet.stellar.org
    print_success "Rede testnet configurada!"
}

# Criar e fundar conta
setup_account() {
    print_status "Configurando conta..."
    
    # Verificar se já existe uma conta
    if stellar keys show --global-keypair &> /dev/null; then
        print_warning "Conta já existe. Usando conta existente."
    else
        print_status "Criando nova conta..."
        stellar keys generate --global-keypair
        stellar account create --global-keypair
    fi
    
    # Fundar conta com Friendbot
    print_status "Fundando conta com Friendbot..."
    ACCOUNT_ADDRESS=$(stellar keys show --global-keypair)
    curl "https://friendbot.stellar.org/?addr=$ACCOUNT_ADDRESS"
    
    print_success "Conta configurada e fundada!"
}

# Compilar contrato Soroban
compile_contract() {
    print_status "Compilando contrato Soroban..."
    
    # Verificar se Rust está instalado
    if ! command -v cargo &> /dev/null; then
        print_error "Rust não encontrado!"
        print_status "Instalando Rust..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source ~/.cargo/env
    fi
    
    # Compilar contrato
    cargo build --target wasm32-unknown-unknown --release
    
    print_success "Contrato compilado!"
}

# Deploy do contrato
deploy_contract() {
    print_status "Fazendo deploy do contrato..."
    
    # Deploy
    CONTRACT_ID=$(stellar contract deploy --wasm target/wasm32-unknown-unknown/release/nft_data_sharing.wasm)
    
    print_success "Contrato deployado com ID: $CONTRACT_ID"
    
    # Inicializar contrato
    ADMIN_ADDRESS=$(stellar keys show --global-keypair)
    print_status "Inicializando contrato com admin: $ADMIN_ADDRESS"
    
    stellar contract invoke --id "$CONTRACT_ID" -- initialize "$ADMIN_ADDRESS"
    
    print_success "Contrato inicializado!"
    
    # Salvar informações do deploy
    echo "CONTRACT_ID=$CONTRACT_ID" > .stellar-deploy
    echo "ADMIN_ADDRESS=$ADMIN_ADDRESS" >> .stellar-deploy
    echo "NETWORK=testnet" >> .stellar-deploy
    echo "HORIZON_URL=https://horizon-testnet.stellar.org" >> .stellar-deploy
    
    print_success "Informações do deploy salvas em .stellar-deploy"
}

# Testar contrato
test_contract() {
    print_status "Testando contrato..."
    
    if [ ! -f ".stellar-deploy" ]; then
        print_error "Arquivo .stellar-deploy não encontrado!"
        return 1
    fi
    
    source .stellar-deploy
    
    # Teste 1: Criar NFT
    print_status "Teste 1: Criando NFT..."
    stellar contract invoke --id "$CONTRACT_ID" -- create_nft "João Silva" "Candidato para desenvolvedor"
    
    # Teste 2: Adicionar dados
    print_status "Teste 2: Adicionando dados..."
    stellar contract invoke --id "$CONTRACT_ID" -- add_data 0 "idade" "30"
    stellar contract invoke --id "$CONTRACT_ID" -- add_data 0 "experiencia" "5 anos"
    
    # Teste 3: Ler dados
    print_status "Teste 3: Lendo dados..."
    stellar contract invoke --id "$CONTRACT_ID" -- read_data 0 "idade"
    
    # Teste 4: Obter total de NFTs
    print_status "Teste 4: Obtendo total de NFTs..."
    stellar contract invoke --id "$CONTRACT_ID" -- get_total_nfts
    
    print_success "Todos os testes passaram!"
}

# Mostrar informações do deploy
show_deploy_info() {
    print_status "Informações do Deploy:"
    echo "=================================="
    
    if [ -f ".stellar-deploy" ]; then
        source .stellar-deploy
        echo "Contract ID: $CONTRACT_ID"
        echo "Admin Address: $ADMIN_ADDRESS"
        echo "Network: $NETWORK"
        echo "Horizon URL: $HORIZON_URL"
        echo ""
        echo "🔗 Links Úteis:"
        echo "Stellar Testnet: https://testnet.stellar.org/"
        echo "Horizon API: $HORIZON_URL"
        echo "Stellar Laboratory: https://laboratory.stellar.org/"
        echo ""
        echo "🧪 Comandos de Teste:"
        echo "stellar contract invoke --id $CONTRACT_ID -- create_nft \"Nome\" \"Descrição\""
        echo "stellar contract invoke --id $CONTRACT_ID -- add_data 0 \"chave\" \"valor\""
        echo "stellar contract invoke --id $CONTRACT_ID -- read_data 0 \"chave\""
    else
        print_error "Arquivo .stellar-deploy não encontrado!"
    fi
}

# Menu principal
main() {
    echo "🌟 Deploy na Stellar Testnet - NFT Data Sharing Contract"
    echo "========================================================"
    echo ""
    echo "Escolha uma opção:"
    echo "1) Deploy completo (recomendado)"
    echo "2) Apenas verificar dependências"
    echo "3) Apenas compilar contrato"
    echo "4) Apenas fazer deploy"
    echo "5) Apenas testar contrato"
    echo "6) Mostrar informações do deploy"
    echo "7) Sair"
    echo ""
    
    read -p "Digite sua escolha (1-7): " choice
    
    case $choice in
        1)
            check_stellar_cli
            setup_testnet
            setup_account
            compile_contract
            deploy_contract
            test_contract
            show_deploy_info
            ;;
        2)
            check_stellar_cli
            print_success "Todas as dependências estão OK!"
            ;;
        3)
            compile_contract
            ;;
        4)
            deploy_contract
            ;;
        5)
            test_contract
            ;;
        6)
            show_deploy_info
            ;;
        7)
            print_status "Saindo..."
            exit 0
            ;;
        *)
            print_error "Opção inválida!"
            main
            ;;
    esac
}

# Executar menu principal
main

