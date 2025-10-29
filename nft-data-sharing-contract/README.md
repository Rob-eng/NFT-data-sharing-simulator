# NFT Data Sharing Contract

Este projeto implementa um smart contract em Solidity para compartilhamento de dados via NFT com controle de acesso granular, compatível com redes Stellar através de bridges ou sidechains.

## Funcionalidades

### Estrutura de Dados
- **ID**: Identificador único da NFT
- **Name**: Nome do candidato
- **Description**: Descrição do candidato
- **User Data**: Dados incluídos pelo usuário no formato chave-valor
- **Encrypted Data**: Dados criptografados para sistemas sem acesso

### Variáveis de Estado
- **Owner**: Proprietário atual da NFT
- **Systems with Read Access**: Sistemas com concessão de acesso para leitura
- **Systems with Write Access**: Sistemas com concessão de acesso para escrita
- **Systems without Access**: Sistemas sem acesso (recebem dados criptografados)
- **Previous Owner**: Proprietário anterior (mantém acesso de leitura)

### Mapeamentos
- **ID to NFT**: Mapeia um ID para cada NFT
- **Address to Access**: Verifica se um endereço tem acesso ou não
- **Address to Ownership**: Registra se um endereço teve posse da NFT

### Funções Principais

#### Criação e Gerenciamento de NFTs
- `createNFT(string name, string description)`: Cria e registra uma nova NFT
- `transferNFT(address to, uint256 tokenId)`: Transfere NFT para novo dono

#### Gerenciamento de Dados
- `addData(uint256 tokenId, string key, string value)`: Adiciona dados no formato chave-valor
- `addDataFromJSON(uint256 tokenId, string jsonData)`: Adiciona dados via arquivo JSON
- `readData(uint256 tokenId, string key)`: Lê dados (com validação de acesso)
- `getAllData(uint256 tokenId)`: Retorna todos os dados da NFT

#### Controle de Acesso
- `grantReadAccess(address system, uint256 tokenId)`: Concede acesso para leitura
- `grantWriteAccess(address system, uint256 tokenId)`: Concede acesso para escrita
- `revokeReadAccess(address system, uint256 tokenId)`: Revoga acesso para leitura
- `revokeWriteAccess(address system, uint256 tokenId)`: Revoga acesso para escrita
- `requestReadAccess(uint256 tokenId)`: Solicita acesso para leitura
- `requestWriteAccess(uint256 tokenId)`: Solicita acesso para escrita

#### Consultas e Informações
- `getDataSharingCount(uint256 tokenId)`: Retorna quantidade de sistemas que receberam dados
- `getOwnershipHistory(uint256 tokenId)`: Retorna histórico de propriedade
- `getNFTInfo(uint256 tokenId)`: Retorna informações básicas da NFT
- `getCurrentOwner(uint256 tokenId)`: Retorna proprietário atual
- `getTotalNFTs()`: Retorna total de NFTs criadas

## Validações Implementadas

1. **Controle de Acesso**: Um sistema só pode ler ou escrever dados se tiver concessão de acesso pelo dono
2. **Dados Criptografados**: Sistemas sem acesso recebem dados criptografados
3. **Criptografia de Dados Públicos**: Dados públicos na blockchain são criptografados
4. **Acesso de Proprietário Anterior**: O proprietário anterior mantém acesso de leitura aos dados novos

## Instalação e Uso

### Pré-requisitos
- Node.js
- Foundry (forge, cast, anvil)
- Git

### Instalação do Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Instalação das Dependências
```bash
forge install OpenZeppelin/openzeppelin-contracts
```

### Compilação
```bash
forge build
```

### Testes
```bash
# Executar todos os testes
forge test

# Executar testes com output detalhado
forge test -vvv

# Executar testes específicos
forge test --match-test testNFTCreationSuccess

# Gerar relatório de cobertura
forge coverage
```

### Deploy

#### Deploy Local (Anvil)
```bash
# Iniciar Anvil em outro terminal
anvil

# Deploy
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

#### Deploy em Testnet (Sepolia)
```bash
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify
```

#### Deploy em Mainnet
```bash
forge script script/Deploy.s.sol --rpc-url mainnet --broadcast --verify
```

## Cenários de Teste Implementados

### ✅ Testes de Inicialização
- Inicialização das variáveis de estado
- Retorno de todos os dados

### ✅ Testes de Acesso e Permissões
- Retorno de dados de carteira com permissão de leitura
- Retorno de dados de carteira com permissão de escrita
- Escrita de dados por carteira com permissão
- Escrita de dados por carteira sem permissão
- Leitura de dados por carteira com permissão
- Leitura de dados por carteira sem permissão

### ✅ Testes de Funcionalidades
- Sucesso de criação de NFT
- Sucesso de transferência de NFT
- Concessão e revogação de acesso
- Solicitação de acesso
- Contagem de sistemas que receberam dados
- Acesso de proprietário anterior
- Histórico de propriedade

### ✅ Testes de Validação
- Validação de propriedade
- Validação de existência de NFT
- Validação de eventos
- Dados JSON
- Múltiplas chaves de dados

## Compatibilidade com Stellar

Este contrato foi desenvolvido para ser compatível com redes Stellar através de:

1. **Bridges**: Pontes entre Ethereum/EVM e Stellar
2. **Sidechains**: Sidechains EVM-compatíveis conectadas ao Stellar
3. **Wrapped Assets**: Tokens wrapped do Stellar na rede EVM

### Considerações para Stellar
- O contrato usa padrões ERC-721 para máxima compatibilidade
- Eventos são emitidos para facilitar indexação
- Funções de consulta são otimizadas para gas
- Suporte a dados criptografados para privacidade

## Segurança

### Auditoria Recomendada
Antes de usar em produção, recomenda-se:
- Auditoria de segurança por empresa especializada
- Testes de penetração
- Análise estática com Slither ou Mythril

### Boas Práticas Implementadas
- Uso de OpenZeppelin para contratos base
- Validação de entrada em todas as funções
- Controle de acesso granular
- Eventos para transparência
- Funções de consulta otimizadas

## Licença

MIT License - veja o arquivo LICENSE para detalhes.

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
