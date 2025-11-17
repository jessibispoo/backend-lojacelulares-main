# Relatório de Consultas - Loja de Celulares

## 📋 Resumo Executivo
Este relatório documenta todas as consultas (requisições HTTP) feitas pelo frontend para a API backend. O projeto utiliza **Axios** como cliente HTTP com **Bearer Token** para autenticação.

---

## 🔐 Configuração Base da API

### Arquivo: `src/Api/api.ts`

**Características principais:**
- **Base URL**: Definida em variáveis de ambiente (`VITE_API_URL`)
- **Autenticação**: Token JWT armazenado em `localStorage` com chave `"token"`
- **Interceptadores de Requisição**: Adiciona automaticamente o header `Authorization: Bearer {token}`
- **Interceptadores de Resposta**: 
  - Detecta erros de rede e redireciona para `/error`
  - Detecta erros 401 (não autenticado) e redireciona para `/login`
  - Remove token do localStorage em caso de erro 401

---

## 📡 Consultas por Página

### 1️⃣ **Página: Login** (`src/Paginas/login.tsx`)

#### 🔗 Consulta 1: Autenticação do Usuário
- **Método**: `POST`
- **Endpoint**: `/login`
- **Descrição**: Autentica o usuário com email e senha
- **Parâmetros de Entrada**:
  ```json
  {
    "email": "string",
    "senha": "string"
  }
  ```
- **Resposta Esperada** (200):
  ```json
  {
    "token": "string (JWT)",
    "tipo": "string (ADMIN ou USER)",
    "nome": "string"
  }
  ```
- **Armazenamento Local**:
  - `token`: Token JWT para requisições autenticadas
  - `tipo`: Tipo de usuário (ADMIN ou USER)
  - `nome`: Nome completo do usuário
- **Tratamento de Erros**: Exibe mensagem de erro na URL (`?mensagem=...`)

---

### 2️⃣ **Página: Produtos** (`src/Paginas/produtos.tsx`)

#### 🔗 Consulta 1: Listar Todos os Produtos
- **Método**: `GET`
- **Endpoint**: `/produtos`
- **Descrição**: Recupera lista de todos os produtos disponíveis
- **Parâmetros**: Nenhum
- **Resposta Esperada** (200):
  ```json
  [
    {
      "id": "number",
      "nome": "string",
      "categoria": "string",
      "preco": "number"
    }
  ]
  ```
- **Normalização de Dados**: O código trata múltiplos formatos de resposta:
  - Array direto: `[...]`
  - Objeto com propriedade `produtos`: `{ produtos: [...] }`
  - Objeto com propriedade `items`: `{ items: [...] }`
- **Tratamento de Erros**: Log no console, exibe lista vazia

#### 🔗 Consulta 2: Adicionar Produto ao Carrinho
- **Método**: `POST`
- **Endpoint**: `/carrinho`
- **Descrição**: Adiciona um produto ao carrinho do usuário
- **Parâmetros de Entrada**:
  ```json
  {
    "produtoId": "number"
  }
  ```
- **Resposta Esperada**: 200 OK
- **Tratamento de Erros**: Alerta ao usuário

#### 🔗 Consulta 3: Excluir Produto (Admin Only)
- **Método**: `DELETE`
- **Endpoint**: `/produtos/{id}`
- **Descrição**: Remove um produto do sistema (apenas para admins)
- **Parâmetros de URL**: `id` (number) - ID do produto
- **Resposta Esperada**: 200 OK
- **Verificação de Permissão**: Botão visível apenas se `tipo === "admin"`
- **Tratamento de Erros**: Confirmação antes de excluir, alerta de erro

---

### 3️⃣ **Página: Carrinho** (`src/Paginas/carrinho.tsx`)

#### 🔗 Consulta 1: Carregar Itens do Carrinho
- **Método**: `GET`
- **Endpoint**: `/api/carrinho/{idUsuario}`
- **Descrição**: Recupera todos os itens no carrinho do usuário
- **Parâmetros de URL**: 
  - `idUsuario`: String (padrão: `"demo"` se não encontrado em localStorage)
- **Resposta Esperada** (200):
  ```json
  {
    "itens": [
      {
        "idProduto": "string",
        "nome": "string",
        "preco": "number",
        "quantidade": "number",
        "_id": "string (opcional)"
      }
    ]
  }
  ```
- **Armazenamento Local Usado**: 
  - `userId`: ID do usuário para identificar o carrinho
- **Execução**: Ao montar o componente (useEffect)

#### 🔗 Consulta 2: Remover Item do Carrinho
- **Método**: `DELETE`
- **Endpoint**: `/api/carrinho/{idUsuario}/{idProduto}`
- **Descrição**: Remove um item específico do carrinho
- **Parâmetros de URL**:
  - `idUsuario`: String (mesmo do localStorage)
  - `idProduto`: String - ID do produto a remover
- **Resposta Esperada**: 200 OK
- **Atualização Local**: Remove item da lista sem recarregar

---

### 4️⃣ **Página: Admin - Usuários** (`src/Paginas/admin-usuarios.tsx`)

#### 🔗 Consulta 1: Listar Todos os Usuários
- **Método**: `GET`
- **Endpoint**: `/api/usuarios`
- **Descrição**: Recupera lista de todos os usuários do sistema
- **Parâmetros**: Nenhum
- **Resposta Esperada** (200):
  ```json
  [
    {
      "_id": "string (MongoDB ID)",
      "nome": "string",
      "email": "string",
      "tipo": "string (ADMIN ou USER)"
    }
  ]
  ```
- **Verificação de Permissão**: 
  - Apenas usuários com `tipo === "ADMIN"` podem acessar
  - Redireciona para `/` se não for admin
- **Tratamento de Erros**: Exibe mensagem de erro na página

---

## 📊 Resumo de Endpoints

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/login` | Autenticar usuário | ❌ Não |
| GET | `/produtos` | Listar produtos | ✅ Sim |
| POST | `/carrinho` | Adicionar ao carrinho | ✅ Sim |
| DELETE | `/produtos/{id}` | Excluir produto (Admin) | ✅ Sim |
| GET | `/api/carrinho/{idUsuario}` | Carregar carrinho | ✅ Sim |
| DELETE | `/api/carrinho/{idUsuario}/{idProduto}` | Remover do carrinho | ✅ Sim |
| GET | `/api/usuarios` | Listar usuários (Admin) | ✅ Sim |

---

## 🔒 Segurança

### Autenticação
- ✅ Utiliza **JWT Bearer Token**
- ✅ Token armazenado em `localStorage`
- ✅ Automaticamente incluído em todas as requisições autenticadas
- ✅ Remove token automaticamente em erro 401

### Autorização
- ✅ Página de Admin verifica `tipo === "ADMIN"`
- ✅ Botão de excluir produto visível apenas para admins
- ✅ Redireciona usuários não autorizados

---

## 💾 Dados Armazenados Localmente

| Chave | Tipo | Uso |
|-------|------|-----|
| `token` | String (JWT) | Autenticação em requisições |
| `tipo` | String | Verificar permissões (ADMIN/USER) |
| `nome` | String | Exibir nome do usuário |
| `userId` | String | Identificar carrinho do usuário |

---

## ⚠️ Observações e Pontos de Atenção

1. **Inconsistência em Endpoints**:
   - `/carrinho` (POST - sem prefixo `/api`)
   - `/api/carrinho` (GET/DELETE - com prefixo `/api`)
   - Recomenda-se padronizar para `/api/carrinho`

2. **Normalização de Resposta em Produtos**:
   - O backend pode retornar dados em diferentes formatos
   - O frontend trata múltiplos cenários (bom para robustez)

3. **ID de Usuário no Carrinho**:
   - Usa `localStorage.getItem("userId")` com fallback `"demo"`
   - `userId` **não é armazenado após login** (risco em produção)
   - Recomenda-se armazenar `userId` como `localStorage.setItem("userId", response.data.userId)` após login

4. **Tratamento de Erros**:
   - Algumas operações apenas logam erros no console
   - Recomenda-se adicionar tratamento visual consistente

5. **Permissões**:
   - Verificação de admin acontece no **frontend** (não seguro)
   - Deve haver validação também no **backend**

---

## 📝 Fluxo de Autenticação

```
1. Usuário insere email e senha → POST /login
   ↓
2. Backend retorna token, tipo e nome
   ↓
3. Frontend armazena em localStorage
   ↓
4. Todas as requisições futuras incluem: Authorization: Bearer {token}
   ↓
5. Se token expirar (401) → Redireciona para /login
```

---

## 🎯 Conclusão

O aplicativo segue um padrão RESTful bem estruturado com:
- ✅ Autenticação via JWT
- ✅ Operações CRUD básicas
- ✅ Controle de acesso por tipo de usuário
- ⚠️ Alguns pontos que podem ser melhorados para maior robustez

**Data do Relatório**: 16 de Novembro de 2025
