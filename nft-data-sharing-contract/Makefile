# Makefile para NFT Data Sharing Contract

.PHONY: help install build test test-verbose coverage deploy-local deploy-sepolia deploy-mainnet clean size gas-report slither mythril

# Cores para output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Mostra esta mensagem de ajuda
	@echo "$(GREEN)NFT Data Sharing Contract - Comandos Disponíveis:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Instala as dependências do Foundry
	@echo "$(GREEN)Instalando dependências...$(NC)"
	forge install OpenZeppelin/openzeppelin-contracts
	@echo "$(GREEN)Dependências instaladas com sucesso!$(NC)"

build: ## Compila o contrato
	@echo "$(GREEN)Compilando contrato...$(NC)"
	forge build
	@echo "$(GREEN)Compilação concluída!$(NC)"

test: ## Executa todos os testes
	@echo "$(GREEN)Executando testes...$(NC)"
	forge test
	@echo "$(GREEN)Testes concluídos!$(NC)"

test-verbose: ## Executa testes com output detalhado
	@echo "$(GREEN)Executando testes com output detalhado...$(NC)"
	forge test -vvv
	@echo "$(GREEN)Testes concluídos!$(NC)"

coverage: ## Gera relatório de cobertura
	@echo "$(GREEN)Gerando relatório de cobertura...$(NC)"
	forge coverage
	@echo "$(GREEN)Relatório de cobertura gerado!$(NC)"

deploy-local: ## Deploy local (Anvil)
	@echo "$(GREEN)Fazendo deploy local...$(NC)"
	@echo "$(YELLOW)Certifique-se de que o Anvil está rodando em outro terminal$(NC)"
	forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
	@echo "$(GREEN)Deploy local concluído!$(NC)"

deploy-sepolia: ## Deploy na rede Sepolia
	@echo "$(GREEN)Fazendo deploy na Sepolia...$(NC)"
	@echo "$(YELLOW)Certifique-se de ter configurado as variáveis de ambiente$(NC)"
	forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify
	@echo "$(GREEN)Deploy na Sepolia concluído!$(NC)"

deploy-mainnet: ## Deploy na rede principal
	@echo "$(RED)ATENÇÃO: Deploy na rede principal!$(NC)"
	@echo "$(YELLOW)Certifique-se de ter configurado as variáveis de ambiente$(NC)"
	@read -p "Tem certeza que deseja continuar? (y/N): " confirm && [ "$$confirm" = "y" ]
	forge script script/Deploy.s.sol --rpc-url mainnet --broadcast --verify
	@echo "$(GREEN)Deploy na rede principal concluído!$(NC)"

clean: ## Limpa arquivos de build
	@echo "$(GREEN)Limpando arquivos de build...$(NC)"
	forge clean
	@echo "$(GREEN)Limpeza concluída!$(NC)"

size: ## Mostra tamanho dos contratos
	@echo "$(GREEN)Analisando tamanho dos contratos...$(NC)"
	forge build --sizes
	@echo "$(GREEN)Análise de tamanho concluída!$(NC)"

gas-report: ## Gera relatório de gas
	@echo "$(GREEN)Gerando relatório de gas...$(NC)"
	forge test --gas-report
	@echo "$(GREEN)Relatório de gas gerado!$(NC)"

slither: ## Executa análise estática com Slither
	@echo "$(GREEN)Executando análise estática com Slither...$(NC)"
	slither .
	@echo "$(GREEN)Análise com Slither concluída!$(NC)"

mythril: ## Executa análise dinâmica com Mythril
	@echo "$(GREEN)Executando análise dinâmica com Mythril...$(NC)"
	myth analyze src/NFTDataSharing.sol
	@echo "$(GREEN)Análise com Mythril concluída!$(NC)"

# Comandos de desenvolvimento
dev-setup: install build test ## Configuração completa do ambiente de desenvolvimento
	@echo "$(GREEN)Ambiente de desenvolvimento configurado com sucesso!$(NC)"

# Comandos de teste específicos
test-creation: ## Testa apenas criação de NFTs
	forge test --match-test testNFTCreationSuccess

test-access: ## Testa apenas controle de acesso
	forge test --match-test testAccessGrantAndRevoke

test-transfer: ## Testa apenas transferências
	forge test --match-test testNFTTransferSuccess

test-data: ## Testa apenas operações de dados
	forge test --match-test testWriteDataWithPermission

# Comandos de análise
analyze: slither mythril ## Executa todas as análises de segurança
	@echo "$(GREEN)Análises de segurança concluídas!$(NC)"

# Comandos de deploy por ambiente
deploy-testnet: deploy-sepolia ## Alias para deploy em testnet

# Comandos de verificação
verify-contract: ## Verifica contrato no Etherscan
	@echo "$(GREEN)Verificando contrato no Etherscan...$(NC)"
	@echo "$(YELLOW)Configure ETHERSCAN_API_KEY e CONTRACT_ADDRESS$(NC)"
	forge verify-contract $(CONTRACT_ADDRESS) src/NFTDataSharing.sol:NFTDataSharing --etherscan-api-key $(ETHERSCAN_API_KEY)

# Comandos de documentação
docs: ## Gera documentação
	@echo "$(GREEN)Gerando documentação...$(NC)"
	@echo "$(YELLOW)Documentação disponível em README.md e TECHNICAL_DOCS.md$(NC)"

# Comandos de limpeza completa
clean-all: clean ## Limpeza completa (inclui node_modules se existir)
	@echo "$(GREEN)Limpeza completa concluída!$(NC)"

# Comandos de inicialização
init: ## Inicializa projeto do zero
	@echo "$(GREEN)Inicializando projeto...$(NC)"
	make install
	make build
	make test
	@echo "$(GREEN)Projeto inicializado com sucesso!$(NC)"
