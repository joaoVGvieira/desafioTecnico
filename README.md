<div align="center">
  <img src="./assets/Random.png" alt="Logo" width="150">
</div>

# Desafio n8n: Node Customizado "Random"

Este projeto é uma solução para o desafio tecnico de criar um conector (node) personalizado. O node se chama `Random` e gera um número aleatório "verdadeiro" (True Random) utilizando a API`random.org`.

---

## Índice

- [Funcionalidades](#funcionalidades)
- [Características Técnicas](#características-técnicas)
- [Pré-requisitos](#pré-requisitos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Instalar e Rodar Localmente](#como-instalar-e-rodar-localmente)
- [Testando](#testando)
- [Detalhes da Implementação](#detalhes-da-implementação)
- [Considerações](#considerações)

## Funcionalidades

* **Node:** `Random`
* **Operação:** `True Random Number Generator`
* **Inputs:** `Min` (mínimo, inclusivo) e `Max` (máximo, inclusivo).
* **Output:** Retorna um JSON com o número aleatório gerado, e os valores de `min` e `max` utilizados na requisição.

<div align="center">
 <img src="./assets/demo-random.gif" alt="Demonstração do Node Random em Ação" width="700">
</div>

Exemplo de saída:

```json
{
  "randomNumber": 42,
  "min": 1,
  "max": 100
}
```

---
## Características Técnicas

  * **Node.js:** Versão 20.15+ 
  * **TypeScript:** Sim, com tipagem completa do n8n-workflow.
  * **API n8n:** `n8nNodesApiVersion 1`
  * **Ambiente:** Docker e Docker Compose com `postgres:14` e `n8nio/n8n:latest`.
  * **Ícone:** SVG personalizado (`RandomV2.svg`).
  * **Validação:** O nó valida se os inputs são inteiros e se `Min` não é maior que `Max`.


## Pré-requisitos

Para rodar este projeto localmente, é necessário ter as seguintes ferramentas instaladas:

* [Node.js](https://nodejs.org/) 
* [NPM](https://www.npmjs.com/) 
* [Docker](https://www.docker.com/products/docker-desktop/) e [Docker Compose](https://docs.docker.com/compose/)
---


## Estrutura do Projeto

```text
├── assets/                 # Contém o logo e o GIF para o README
├── dist/                   # Pasta com o código JavaScript compilado (o que o n8n usa)
├── nodes/
│   └── Random/
│       ├── Random.node.ts  # O código-fonte principal do node (TypeScript)
│       └── RandomV2.svg    # O ícone SVG do node
├── .eslintrc.js            # Configuração do Linter (qualidade de código)
├── .gitignore              # Arquivos ignorados pelo Git
├── docker-compose.yml      # Arquivo da infra (n8n + Postgres)
├── gulpfile.js             # Script para automatizar a build dos ícones
├── package.json            # Dependências e scripts (npm install, npm run build)
├── README.md               # O arquivo que você está lendo
└── tsconfig.json           # Configurações do TypeScript
```

## Como Instalar e Rodar Localmente

> **Nota sobre a Configuração:** Para facilitar os testes deste desafio e permitir que o projeto seja executado com um único comando (`docker-compose up`), optei por:
> 1.  Configurar as variáveis (como a senha do banco) diretamente no `docker-compose.yml`.
> 2.  Desativar a tela de login do n8n (via `N8N_BASIC_AUTH_ACTIVE: "false"`).
>
> ⚠️ Em um ambiente de produção real, essas chaves sensíveis estariam protegidas em um arquivo `.env` e a autenticação estaria ativa.

Siga os passos abaixo para testar o node em uma instância local do n8n.

### 1. Clonar o Repositório

```bash
git clone https://github.com/joaoVGvieira/desafioTecnico.git
cd desafioTecnico
```

### 2. Instalar as Dependências

Este comando lê o arquivo `package.json` e instala todas as ferramentas necessárias para o desenvolvimento, como o TypeScript e as bibliotecas base do n8n.  

> **Observação:** 🚨 Caso apareça algum aviso ou erro durante a instalação, **pode ignorar** e seguir para o próximo passo. Isso **não compromete** a execução do desafio.

```bash
npm install
```

### 3. Compilar o Node

O código do node está escrito em TypeScript na pasta `nodes`. Antes do n8n carregar o node, é necessário compilar para JavaScript (pasta `dist`).

```bash
npm run build
```

Esse comando executa o script `build` definido no `package.json` e gera os artefatos na pasta `dist`.

### 4. Rodar o Ambiente Docker (n8n + Postgres)

Este comando utiliza o `docker-compose.yml` para iniciar os containers do n8n e do banco de dados Postgres. 

⚠️ Lembre-se de deixar o Docker Desktop em execução antes de rodar o comando abaixo!!!
```bash
docker-compose up
```
O container do n8n está configurado para carregar automaticamente o node customizado que está na pasta `dist` (através de um volume mapeado). Aguarde até ver a mensagem nos logs indicando que o editor está disponível:

```
Editor is now accessible via: http://localhost:5678
```
## Testando
Após o container do n8n iniciar, abra seu navegador no endereço: `http://localhost:5678`.

Siga os passos abaixo para testar o node.

**a) Teste de Sucesso (Caminho Feliz)**

1.  Crie um novo workflow (`New workflow`).
2.  Clique no `+` para adicionar um node.
3.  Na barra de busca, digite `Random`.
4.  Clique no node para adicioná-lo ao canvas.
5.  Configure os campos `Min` e `Max` (ex: `Min: 1` e `Max: 100`).
6.  Clique em **Execute Step**.
7.  Verifique o resultado na aba **Output** deverá conter o JSON com o número aleatório (ex: `{"randomNumber": 42, "min": 1, "max": 100}`).

**b) Teste de Validações (Tratamento de Erros)**

O node também foi programado para capturar erros de input. Você pode testar:

**Teste 1: Números Decimais**
1.  No campo `Min`, digite um número decimal (ex: `1.5`).
2.  Clique em **Execute Step**.
3.  Verifique se o node falha e exibe a mensagem de erro correta: `Os valores de "Min" e "Max" devem ser números inteiros (sem decimais)`.

**Teste 2: Mínimo Maior que Máximo**
1.  Configure os campos com `Min: 100` e `Max: 1`.
2.  Clique em **Execute Step**.
3.  Verifique se o node falha e exibe a mensagem de erro correta: `O valor de "Min" não pode ser maior que o valor de "Max"`.

---
## Detalhes da Implementação

Para garantir que o n8n reconheça este pacote como um nó customizado, as seguintes configurações foram feitas:

**1. `package.json`:**
A chave `n8n` informa ao n8n onde encontrar os arquivos de nó compilados.

```json
{
  "n8n": {
    "nodes": [
      "dist/nodes/Random/Random.node.js"
    ],
    "n8nNodesApiVersion": 1
  }
}
```

**2. `Random.node.ts`:**
O objeto `description` define todos os parâmetros, nomes e ícone do nó, conforme solicitado no desafio.

```typescript
export class Random implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Random',
    name: 'random',
    icon: 'file:RandomV2.svg',
    group: ['helpers'],
    version: 1,
    subtitle: '=True Random Number Generator',
    description: 'Gera um número aleatório usando a API do Random.org',
    // ...
  };
}
```

-----

## Considerações

  * **Rate Limiting:** A API Random.org é gratuita, mas possui limites de uso. Para aplicações de alto volume, pode ser necessário um tratamento adicional.
  * **Conectividade:** Este nó depende de uma conexão com a internet para funcionar.


## Autor

Feito por **João Vitor Gonçalves Vieira**

* **LinkedIn:** [www.linkedin.com/in/joao-vg-vieira](https://www.linkedin.com/in/joao-vg-vieira)
* **GitHub:** [https://github.com/joaoVGvieira](https://github.com/joaoVGvieira)
