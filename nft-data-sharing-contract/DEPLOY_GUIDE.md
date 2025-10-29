# Guia de Deploy Local - NFT Data Sharing Contract

## Método 1: Usando Remix IDE (Recomendado para Iniciantes)

### Passo 1: Acesse o Remix IDE
1. Abra seu navegador e vá para: https://remix.ethereum.org/
2. Crie uma nova conta ou faça login

### Passo 2: Configure o Ambiente
1. No Remix, vá para a aba "File Explorer"
2. Crie um novo arquivo chamado `NFTDataSharingSimple.sol`
3. Copie o conteúdo do arquivo `src/NFTDataSharingSimple.sol` para o Remix

### Passo 3: Instale as Dependências
1. Vá para a aba "Solidity Compiler"
2. Configure a versão do compilador para `0.8.20`
3. Clique em "Compile NFTDataSharingSimple.sol"

### Passo 4: Configure o Deploy
1. Vá para a aba "Deploy & Run Transactions"
2. Selecione "Injected Provider - MetaMask" como ambiente
3. Certifique-se de que sua carteira está conectada

### Passo 5: Faça o Deploy
1. Clique em "Deploy" ao lado do contrato NFTDataSharingSimple
2. Confirme a transação na MetaMask
3. Aguarde a confirmação

## Método 2: Usando Hardhat (Alternativa)

### Passo 1: Instale o Hardhat
```bash
npm install --save-dev hardhat
npx hardhat init
```

### Passo 2: Configure o hardhat.config.js
```javascript
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
```

### Passo 3: Instale as Dependências
```bash
npm install @openzeppelin/contracts
npm install @nomiclabs/hardhat-ethers ethers
```

### Passo 4: Crie o Script de Deploy
```javascript
// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const NFTDataSharingSimple = await ethers.getContractFactory("NFTDataSharingSimple");
  const nftContract = await NFTDataSharingSimple.deploy();
  
  await nftContract.deployed();
  
  console.log("NFTDataSharingSimple deployed to:", nftContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Passo 5: Execute o Deploy
```bash
npx hardhat run scripts/deploy.js --network localhost
```

## Método 3: Usando Foundry (Quando Funcionar)

### Passo 1: Inicie o Anvil
```bash
anvil
```

### Passo 2: Em outro terminal, faça o deploy
```bash
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

## Método 4: Usando MetaMask + Remix (Mais Simples)

### Passo 1: Configure uma Rede Local
1. Abra o MetaMask
2. Vá para "Settings" > "Networks" > "Add Network"
3. Adicione uma nova rede:
   - Network Name: Localhost
   - RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

### Passo 2: Use o Remix IDE
1. Acesse https://remix.ethereum.org/
2. Cole o código do contrato
3. Compile o contrato
4. Conecte sua carteira
5. Faça o deploy

## Testando o Contrato Deployado

### Funções Básicas para Testar:

1. **Criar uma NFT:**
```javascript
// No Remix, chame a função:
createNFT("João Silva", "Candidato para desenvolvedor")
```

2. **Adicionar Dados:**
```javascript
addData(0, "idade", "30")
addData(0, "experiencia", "5 anos")
```

3. **Conceder Acesso:**
```javascript
grantReadAccess("0xEnderecoDoSistema", 0)
grantWriteAccess("0xEnderecoDoSistema", 0)
```

4. **Ler Dados:**
```javascript
readData(0, "idade")
```

## Troubleshooting

### Problema: "Contract not found"
- Verifique se o contrato foi compilado corretamente
- Certifique-se de que a versão do Solidity está correta

### Problema: "Insufficient funds"
- Certifique-se de que sua carteira tem ETH suficiente
- Para redes locais, você pode usar contas pré-fundadas

### Problema: "Transaction failed"
- Verifique se a rede está funcionando
- Confirme se o contrato foi deployado corretamente

## Próximos Passos

Após o deploy bem-sucedido:

1. **Teste todas as funções** do contrato
2. **Documente o endereço** do contrato deployado
3. **Crie uma interface** para interagir com o contrato
4. **Implemente testes** automatizados
5. **Considere fazer deploy** em uma testnet (Sepolia, Mumbai)

## Recursos Adicionais

- [Documentação do Remix](https://remix-ide.readthedocs.io/)
- [Documentação do Hardhat](https://hardhat.org/docs)
- [Documentação do Foundry](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
