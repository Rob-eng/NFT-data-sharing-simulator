# 🔧 Troubleshooting - Deploy do Contrato NFT Data Sharing

## 🚨 Erros Comuns e Soluções

### 1. **Erro de Compilação: "Contract not found"**

**Causa:** Problema com imports do OpenZeppelin

**Solução:**
```solidity
// Use esta versão simplificada sem imports externos:
pragma solidity ^0.8.20;

contract NFTDataSharingBasic {
    // Código do contrato básico
}
```

### 2. **Erro: "Insufficient funds"**

**Causa:** Carteira sem ETH suficiente

**Solução:**
- Adicione ETH à sua carteira MetaMask
- Para redes locais, use contas pré-fundadas do Anvil
- Verifique se está na rede correta

### 3. **Erro: "Transaction failed"**

**Causa:** Problema na rede ou contrato

**Solução:**
- Verifique se a rede está funcionando
- Confirme se o contrato foi compilado corretamente
- Verifique se há erros de sintaxe

### 4. **Erro: "Gas estimation failed"**

**Causa:** Contrato muito complexo ou erro interno

**Solução:**
- Use a versão básica do contrato
- Reduza a complexidade das funções
- Verifique se há loops infinitos

## 📋 Versões do Contrato (Por Complexidade)

### 🟢 Versão Básica (RECOMENDADA para primeiro deploy)

**Arquivo:** `NFTDataSharingBasic.sol`

**Características:**
- ✅ Sem imports externos
- ✅ Estrutura simples
- ✅ Fácil de compilar
- ✅ Funciona em qualquer IDE

**Funcionalidades:**
- Criar NFT
- Adicionar dados simples
- Controle de acesso básico
- Leitura de dados

### 🟡 Versão Simples

**Arquivo:** `NFTDataSharingSimple.sol`

**Características:**
- ⚠️ Usa OpenZeppelin
- ⚠️ Mais complexa
- ⚠️ Pode ter problemas de import

**Funcionalidades:**
- Todas as funcionalidades básicas
- Dados chave-valor
- Controle de acesso granular

### 🔴 Versão Completa

**Arquivo:** `NFTDataSharing.sol`

**Características:**
- ❌ Muito complexa
- ❌ Muitas dependências
- ❌ Pode falhar no deploy

**Funcionalidades:**
- Todas as funcionalidades
- Histórico completo
- Validações avançadas

## 🚀 Guia de Deploy Passo a Passo

### Passo 1: Escolha a Versão Básica

1. Abra o Remix IDE: https://remix.ethereum.org/
2. Crie um novo arquivo: `NFTDataSharingBasic.sol`
3. Cole o código da versão básica

### Passo 2: Configure o Compilador

1. Vá para "Solidity Compiler"
2. Selecione versão: `0.8.20`
3. Clique em "Compile NFTDataSharingBasic.sol"
4. Verifique se aparece ✅ verde

### Passo 3: Configure o Deploy

1. Vá para "Deploy & Run Transactions"
2. Selecione "Injected Provider - MetaMask"
3. Conecte sua carteira
4. Certifique-se de ter ETH suficiente

### Passo 4: Faça o Deploy

1. Clique em "Deploy" ao lado do contrato
2. Confirme na MetaMask
3. Aguarde a confirmação
4. Anote o endereço do contrato

## 🧪 Teste Básico do Contrato

Após o deploy bem-sucedido, teste estas funções:

### 1. Criar uma NFT
```solidity
createNFT("João Silva", "Candidato para desenvolvedor")
```

### 2. Adicionar Dados
```solidity
addData(0, "João tem 30 anos e 5 anos de experiência")
```

### 3. Ler Dados
```solidity
readData(0)
```

### 4. Conceder Acesso
```solidity
grantReadAccess("0xEnderecoDoSistema", 0)
```

## 🔍 Verificação de Funcionamento

### ✅ Checklist de Sucesso

- [ ] Contrato compilou sem erros
- [ ] Deploy foi bem-sucedido
- [ ] Endereço do contrato foi gerado
- [ ] Funções aparecem na interface
- [ ] Testes básicos funcionam
- [ ] Eventos são emitidos

### ❌ Sinais de Problema

- [ ] Erros de compilação
- [ ] Deploy falha
- [ ] Transação não confirma
- [ ] Funções não aparecem
- [ ] Erros ao executar funções

## 🆘 Soluções Rápidas

### Se o Deploy Falhar:

1. **Use a versão básica** (`NFTDataSharingBasic.sol`)
2. **Verifique a versão do Solidity** (0.8.20)
3. **Confirme que tem ETH** na carteira
4. **Reinicie o Remix** e tente novamente

### Se a Compilação Falhar:

1. **Remova imports externos**
2. **Use versão mais simples**
3. **Verifique sintaxe**
4. **Use versão básica do contrato**

### Se as Funções Não Funcionarem:

1. **Verifique se o contrato foi deployado**
2. **Confirme o endereço do contrato**
3. **Teste funções básicas primeiro**
4. **Verifique se tem permissões**

## 📞 Suporte Adicional

### Recursos Úteis:

- 📖 [Documentação do Remix](https://remix-ide.readthedocs.io/)
- 🔧 [Troubleshooting do Remix](https://remix-ide.readthedocs.io/en/latest/troubleshooting.html)
- 💬 [Comunidade Ethereum](https://ethereum.org/community/)

### Contato:

Se ainda tiver problemas, descreva:
1. **Qual erro específico** você está vendo
2. **Qual versão do contrato** está usando
3. **Em qual etapa** o erro ocorre
4. **Screenshot** do erro (se possível)

---

**💡 Dica:** Comece sempre com a versão básica e vá evoluindo conforme necessário!
