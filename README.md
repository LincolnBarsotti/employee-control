# Employee Control API

Uma API robusta para gestão e controlo de funcionários, desenvolvida com o framework **NestJS**, utilizando **Prisma ORM** e base de dados **MySQL**. A aplicação conta com autenticação JWT, controlo de permissões por funções (RBAC) e tarefas agendadas.

## 🚀 Tecnologias Utilizadas

* **Framework:** [NestJS](https://nestjs.com/)
* **Linguagem:** TypeScript
* **ORM:** [Prisma](https://www.prisma.io/)
* **Base de Dados:** MySQL
* **Autenticação:** Passport JWT & Bcrypt
* **Validação:** Class-validator & Class-transformer

## 📋 Pré-requisitos

Antes de começar, certifique-se de que tem instalado:
* Node.js (versão 18 ou superior)
* MySQL (versão 8 ou superior)
* Gestor de pacotes (npm ou yarn)

## 🔧 Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/LincolnBarsotti/employee-control.git](https://github.com/LincolnBarsotti/employee-control.git)
    cd employee-management-api
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configuração do Ambiente:**
    Copie o ficheiro `.env.example` na raiz do projeto, renomeie para `.env` e configure a URL de conexão com o seu banco de dados MySQL:
    ```env
    DATABASE_URL="mysql://utilizador:senha@localhost:3306/employees"
    JWT_SECRET="sua_chave_secreta_aqui"
    ```

4.  **Base de Dados e Migrações:**
    Sincronize o esquema do Prisma com a sua base de dados:
    ```bash
    npx prisma migrate dev
    ```

## ⚡ Execução

O projeto inclui scripts para diferentes ambientes:

* **Desenvolvimento (com Watch Mode e Seed):**
    ```bash
    npm run start:dev
    ```
  *Este comando executa o seed da base de dados e inicia o servidor com recarregamento automático.*

* **Produção:**
    ```bash
    npm run build
    npm run start:prod
    ```

## 🛠 Estrutura do Sistema

* **Autenticação:** Sistema de login e registo com encriptação de password via Bcrypt.
* **Controlo de Acesso (RBAC):** Diferenciação entre utilizadores `ADMIN` e `VIEWER`.
* **Gestão de Funcionários:** CRUD completo para a entidade `Employee`.
* **Tarefas Agendadas (Cron):** Integração com `@nestjs/schedule` para automações.
* **Filtros de Exceção:** Tratamento global de erros HTTP.

## 🗄 Modelo de Dados (Prisma)

O esquema da base de dados possui as seguintes tabelas principais:

* **User:** Gere os utilizadores do sistema (id, email, password, role, isActive).
* **Employee:** Armazena os dados dos funcionários (nome, email, cargo, departamento, salário, data de contratação).

---
Documentação gerada para o projeto Employee Control.