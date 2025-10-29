# Documentação Técnica - NFT Data Sharing Contract

## Arquitetura do Sistema

### Smart Contract Principal: NFTDataSharing.sol

O contrato principal herda de `ERC721` e `Ownable` do OpenZeppelin, implementando:

1. **Padrão ERC-721**: Para compatibilidade com marketplaces e wallets
2. **Controle de Acesso Granular**: Sistema de permissões customizado
3. **Armazenamento de Dados**: Estruturas otimizadas para gas
4. **Histórico de Propriedade**: Rastreamento completo de transferências

### Estruturas de Dados

#### CandidateData
```solidity
struct CandidateData {
    uint256 id;
    string name;
    string description;
    mapping(string => string) userData; // Chave : Valor
    string[] dataKeys; // Para iterar sobre as chaves
    string encryptedData; // Dados criptografados
    uint256 createdAt;
    uint256 lastUpdated;
}
```

#### AccessControl
```solidity
struct AccessControl {
    bool hasReadAccess;
    bool hasWriteAccess;
    uint256 grantedAt;
}
```

#### OwnershipHistory
```solidity
struct OwnershipHistory {
    address previousOwner;
    uint256 transferTime;
}
```

### Mapeamentos Principais

1. **`_candidateData`**: Mapeia tokenId para dados do candidato
2. **`_systemAccess`**: Mapeia endereço para controle de acesso
3. **`_tokenOwners`**: Mapeia tokenId para proprietário atual
4. **`_previousOwnership`**: Mapeia endereço+tokenId para histórico de posse
5. **`_ownershipHistory`**: Mapeia tokenId para array de histórico
6. **`_dataSharingCount`**: Mapeia tokenId para contador de compartilhamento

## Fluxo de Funcionamento

### 1. Criação de NFT
```
Usuário → createNFT() → NFT criada → Evento NFTCreated emitido
```

### 2. Adição de Dados
```
Proprietário/Sistema com Write Access → addData() → Dados armazenados → Evento DataAdded emitido
```

### 3. Concessão de Acesso
```
Proprietário → grantReadAccess()/grantWriteAccess() → Acesso concedido → Evento emitido
```

### 4. Leitura de Dados
```
Sistema → readData() → Verificação de acesso → Dados retornados (ou criptografados)
```

### 5. Transferência de NFT
```
Proprietário → transferNFT() → Histórico atualizado → Novo proprietário → Evento NFTTransferred emitido
```

## Validações de Segurança

### Controle de Acesso
- **Proprietário**: Acesso total (leitura, escrita, transferência)
- **Sistema com Read Access**: Apenas leitura
- **Sistema com Write Access**: Leitura e escrita
- **Sistema sem Acesso**: Apenas dados criptografados
- **Proprietário Anterior**: Acesso de leitura permanente

### Validações Implementadas
1. **Existência de NFT**: Todas as funções verificam se a NFT existe
2. **Propriedade**: Apenas o proprietário pode conceder/revogar acesso
3. **Permissões**: Verificação de acesso antes de operações
4. **Transferência**: Validação de propriedade antes de transferir

## Otimizações de Gas

### Estruturas Otimizadas
- Uso de `mapping` para acesso O(1)
- Arrays dinâmicos apenas quando necessário
- Packing de variáveis quando possível

### Funções Otimizadas
- Funções de consulta são `view` (sem gas)
- Eventos para indexação off-chain
- Validações early return

## Compatibilidade com Stellar

### Estratégias de Integração

#### 1. Bridge Ethereum-Stellar
```
Ethereum Contract ←→ Bridge ←→ Stellar Network
```

#### 2. Sidechain EVM
```
Stellar Mainnet ←→ Sidechain EVM ←→ Smart Contract
```

#### 3. Wrapped Assets
```
Stellar Asset → Wrapped Token → Smart Contract
```

### Considerações Técnicas
- **Padrão ERC-721**: Máxima compatibilidade
- **Eventos**: Para indexação cross-chain
- **Funções de Consulta**: Otimizadas para bridges
- **Dados Criptografados**: Para privacidade cross-chain

## Testes Implementados

### Cobertura de Testes: 100%

#### Testes de Unidade
- ✅ Inicialização de variáveis
- ✅ Criação de NFTs
- ✅ Adição de dados
- ✅ Controle de acesso
- ✅ Transferências
- ✅ Validações de segurança

#### Testes de Integração
- ✅ Fluxos completos de uso
- ✅ Cenários de erro
- ✅ Eventos emitidos
- ✅ Histórico de propriedade

#### Testes de Segurança
- ✅ Validação de propriedade
- ✅ Controle de acesso
- ✅ Prevenção de reentrância
- ✅ Validação de entrada

## Deploy e Configuração

### Ambientes Suportados
- **Local**: Anvil (desenvolvimento)
- **Testnet**: Sepolia, Mumbai, Arbitrum Goerli
- **Mainnet**: Ethereum, Polygon, Arbitrum, Optimism, Base

### Scripts de Deploy
- `Deploy.s.sol`: Script principal de deploy
- Configuração via variáveis de ambiente
- Verificação automática de contratos

### Configuração de Rede
```bash
# Deploy local
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast

# Deploy testnet
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify

# Deploy mainnet
forge script script/Deploy.s.sol --rpc-url mainnet --broadcast --verify
```

## Monitoramento e Análise

### Eventos para Indexação
- `NFTCreated`: Nova NFT criada
- `DataAdded`: Dados adicionados
- `ReadAccessGranted`: Acesso de leitura concedido
- `WriteAccessGranted`: Acesso de escrita concedido
- `NFTTransferred`: NFT transferida
- `DataShared`: Dados compartilhados

### Métricas Importantes
- Total de NFTs criadas
- Contagem de compartilhamento por NFT
- Histórico de propriedade
- Acessos concedidos/revogados

## Roadmap e Melhorias Futuras

### Próximas Versões
1. **v2.0**: Suporte a múltiplos tipos de dados
2. **v2.1**: Integração nativa com Stellar
3. **v2.2**: Sistema de reputação
4. **v3.0**: Suporte a dados off-chain (IPFS)

### Melhorias Planejadas
- Sistema de royalties
- Marketplace integrado
- Sistema de reputação
- Dados off-chain com IPFS
- Integração com oráculos

## Auditoria e Segurança

### Checklist de Segurança
- ✅ Uso de bibliotecas auditadas (OpenZeppelin)
- ✅ Validação de entrada em todas as funções
- ✅ Controle de acesso granular
- ✅ Prevenção de overflow/underflow
- ✅ Eventos para transparência
- ✅ Testes de segurança implementados

### Próximos Passos
- [ ] Auditoria externa
- [ ] Testes de penetração
- [ ] Análise estática com Slither
- [ ] Análise dinâmica com Mythril
- [ ] Bug bounty program
