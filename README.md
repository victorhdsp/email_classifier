# Email Classifier

O objetivo deste projeto é automatizar a leitura e classificação de e-mails, sugerindo classificações e respostas automáticas com base no conteúdo de cada e-mail recebido. Isso visa liberar a equipe da tarefa manual de triagem de e-mails, otimizando o tempo e a eficiência.

## Sumário

- [Introdução](#introdução)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
  - [Visão Geral](#visão-geral)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Fluxo de Dados](#fluxo-de-dados)
- [Rodando Localmente](#rodando-localmente)
  - [Pré-requisitos](#pré-requisitos)
  - [Execução Individual](#execução-individual)
  - [Execução com Docker Compose](#execução-com-docker-compose)
- [Testes](#testes)
  - [Backend](#backend-1)
  - [Frontend](#frontend-1)
- [Deploy](#deploy)
- [Decisões Técnicas Importantes](#decisões-técnicas-importantes)
- [Roadmap](#roadmap)
- [Contato](#contato)

---

## Introdução

Este projeto visa automatizar a classificação de e-mails, utilizando inteligência artificial para analisar o conteúdo e sugerir categorias, resumos e assuntos. A solução é dividida em um backend robusto para processamento e um frontend intuitivo para interação do usuário.

## Tecnologias Utilizadas

### Backend
- **Linguagem:** Python 3.10+
- **Framework Web:** FastAPI
- **Servidor ASGI:** Uvicorn
- **Processamento de Linguagem Natural (NLP):** SpaCy
- **Modelos de Linguagem (LLM):** Google Gemini (principal), Hugging Face (Mistral-7b como fallback)
- **Banco de Dados:** PostgreSQL (para cache semântico)
- **Manipulação de PDF:** PyMuPDF
- **Outros:** `python-dotenv`, `python-multipart`, `starlette`, `python-dateutil`, `sqlalchemy`, `psycopg2-binary`

### Frontend
- **Linguagem:** TypeScript
- **Framework:** React 18+
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS 3.x, Sass
- **Componentes UI:** Radix UI
- **Gerenciamento de Estado:** Zustand
- **Requisições HTTP:** Axios
- **Eventos do Servidor:** `event-source-polyfill` (para SSE)
- **Testes:** Vitest, `@testing-library/react`, `@testing-library/jest-dom`
- **Linting & Formatação:** ESLint, Prettier

### Infraestrutura
- **Containerização:** Docker, Docker Compose

## Arquitetura do Projeto

### Visão Geral
O projeto adota uma arquitetura de microsserviços, separando o frontend e o backend para maior escalabilidade e flexibilidade para futuras expansões ou substituições de tecnologias. O backend é responsável pela lógica de análise de e-mails, enquanto o frontend oferece uma interface amigável para o usuário interagir com o sistema.

### Backend
O backend, construído com FastAPI, é o coração da lógica de análise de e-mails. Ele segue um fluxo de processamento em quatro etapas principais:

1.  **Protect:** Validações iniciais, como tamanho máximo do arquivo e formato aceito (PDF, TXT, string).
2.  **Extract:** Extrai o texto de arquivos PDF ou TXT, ou aceita texto puro diretamente.
3.  **Normalize:** Realiza o pré-processamento do texto, incluindo:
    *   Tratamento de espaços, quebras de linha e conversão para minúsculas.
    *   Remoção de caracteres inválidos, acentos e caracteres especiais.
    *   Remoção de cabeçalhos desnecessários.
    *   Processamento NLP básico (remoção de stop words, lematização) usando SpaCy.
    *   Extração de `timestamp` se presente no texto.
4.  **Analyze:** Integra-se com Modelos de Linguagem (LLMs) para:
    *   Classificar o e-mail (ex: produtivo/improdutivo).
    *   Gerar um resumo do conteúdo.
    *   Criar um `subject` conciso (se não houver).
    *   O `timestamp` é opcional e retornado se encontrado.

Para otimizar o uso dos LLMs e reduzir custos, um **cache semântico** é implementado utilizando PostgreSQL. Ele armazena o `id` (hash do input), o `input` (texto limpo após NLP) e o `output` (resultado da IA), evitando chamadas repetidas para conteúdos já analisados.

A comunicação com o frontend para resultados de análise assíncronos é feita via **Server-Sent Events (SSE)**, permitindo que o servidor envie atualizações em tempo real para o cliente. Um sistema de autenticação anônima simples é utilizado para gerenciar essas conexões.

### Frontend
O frontend é uma aplicação React desenvolvida com Vite, focada na experiência do usuário. Ele oferece:

-   Um formulário intuitivo para upload de arquivos (PDF, TXT) ou entrada de texto manual.
-   Exibição do progresso de upload e status da análise.
-   Uma sidebar scrollável que apresenta os resultados da análise (assunto, tipo, resumo, timestamp) em formato de acordeão.
-   Responsividade para diferentes tamanhos de tela, ajustando a disposição dos elementos.
-   Um sistema de onboarding para guiar novos usuários através das funcionalidades.

### Fluxo de Dados
1.  O usuário interage com o frontend, enviando um arquivo ou texto para análise.
2.  O frontend envia a requisição para a API do backend.
3.  O backend processa o conteúdo através das etapas `protect`, `extract`, `normalize` e `analyze`.
4.  Durante a etapa `analyze`, o backend verifica o cache semântico no PostgreSQL. Se o conteúdo já foi analisado, o resultado é retornado do cache. Caso contrário, a requisição é enviada para o LLM (Gemini ou Hugging Face).
5.  Os resultados da análise são enviados de volta ao frontend, potencialmente via SSE para processos mais longos, permitindo atualizações em tempo real.
6.  O frontend exibe os resultados na sidebar, permitindo ao usuário visualizar as informações classificadas.

## Rodando Localmente

### Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas:
-   Node.js (versão 22 ou superior)
-   Python (versão 3.10 ou superior)
-   Docker e Docker Compose

### Execução Individual

#### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
O backend estará disponível em `http://127.0.0.1:8000`. A documentação da API pode ser acessada em `http://127.0.0.1:8000/docs` (Swagger UI) ou `http://127.0.0.1:8000/redoc` (Redoc).

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
O frontend estará disponível em `http://127.0.0.1:5173`.

### Execução com Docker Compose
Para rodar ambos os serviços (backend, frontend e banco de dados PostgreSQL) simultaneamente usando Docker Compose:

```bash
docker-compose up --build
```
-   O frontend estará acessível em: `http://127.0.0.1:5173`
-   O backend estará acessível em: `http://127.0.0.1:8000`

## Testes

### Backend
Os testes do backend são escritos em Python e utilizam `pytest`.
Para executar os testes:
```bash
cd backend
source .venv/bin/activate # Se estiver usando ambiente virtual
pytest
```

### Frontend
Os testes do frontend são escritos em TypeScript/React e utilizam `vitest`.
Para executar os testes:
```bash
cd frontend
npm test
```

## Deploy

As versões atuais do projeto estão implantadas nos seguintes endereços:

-   **Backend:** `https://email-classifier-6kdu.onrender.com`
    -   Health Check: `https://email-classifier-6kdu.onrender.com/v1/health`
    -   Documentação (Swagger UI): `https://email-classifier-6kdu.onrender.com/docs`
    -   Documentação (Redoc): `https://email-classifier-6kdu.onrender.com/redoc`
-   **Frontend:** `https://email-classifier-gamma-eight.vercel.app`

O deploy do backend é realizado na plataforma Render, e o frontend na Vercel.

## Decisões Técnicas Importantes

As seguintes decisões técnicas foram tomadas para guiar o desenvolvimento do projeto:

-   **Separação de Frontend e Backend:** A arquitetura foi dividida em dois serviços distintos para promover escalabilidade, modularidade e flexibilidade para futuras expansões ou substituições de tecnologias.
-   **Escolha da Stack Frontend (React, Vite, Tailwind CSS):**
    -   **React:** Selecionado por sua vasta comunidade, ecossistema maduro e facilidade de escalabilidade para frameworks como Next.js.
    -   **Vite:** Escolhido como build tool pela sua velocidade e experiência de desenvolvimento aprimorada.
    -   **Tailwind CSS:** Adotado para agilizar o desenvolvimento de UI, mantendo a versão 3 para preservar a funcionalidade `@apply` em arquivos CSS separados, visando organização.
-   **Escolha da Stack Backend (FastAPI, Python):**
    -   **FastAPI:** Selecionado por sua alta performance, facilidade de uso, documentação automática (Swagger/OpenAPI) e flexibilidade arquitetural.
    -   **Ferramentas de Qualidade de Código:** `black` (formatador), `ruff` (linter) e `mypy` (verificador de tipos) foram integrados para garantir a consistência e robustez do código Python.
-   **Modelos de Linguagem (LLM):**
    -   **Google Gemini (gemini-1.5-flash):** Escolhido como LLM principal devido ao seu custo-benefício e disponibilidade de um nível gratuito generoso.
    -   **Hugging Face (Mistral-7b):** Implementado como fallback para garantir a resiliência do sistema em caso de falhas ou limites de uso do Gemini.
-   **Cache Semântico com PostgreSQL:**
    -   **Persistência:** PostgreSQL foi preferido sobre soluções de cache voláteis (como Redis) para armazenar resultados de análises de e-mails. Isso garante que e-mails já processados não precisem ser re-analisados pela IA, mesmo após reinícios do serviço, otimizando custos e tempo de processamento.
-   **Comunicação Assíncrona (SSE):**
    -   **Eficiência:** Server-Sent Events (SSE) foi escolhido para notificar o frontend sobre a conclusão de análises de e-mails, que podem levar tempo. Isso evita o bloqueio da interface do usuário e permite atualizações em tempo real.
    -   **Autenticação Anônima:** Um sistema de autenticação anônima baseado em IP e User-Agent foi implementado para simplificar o gerenciamento de sessões sem a necessidade de um sistema de login completo.
-   **Arquitetura de Análise de E-mails:** O processo de análise foi estruturado em quatro etapas (`protect`, `extract`, `normalize`, `analyze`) para modularidade e clareza.
-   **Estrutura de Pastas do Backend:** Adotou-se uma estrutura de pastas baseada em funcionalidades (feature-based) em vez de responsabilidades globais, visando facilitar a manutenção e o crescimento do projeto.
-   **Logs:** Implementação de um sistema de logs com wrappers, permitindo fácil integração com soluções de monitoramento externas no futuro.
-   **Documentação da API:** Utilização do Swagger UI e OpenAPI, que são nativamente suportados pelo FastAPI, para fornecer uma documentação interativa e visualmente agradável da API.

## Roadmap

O projeto continua em desenvolvimento, com as seguintes funcionalidades e melhorias planejadas:

### Funcionalidades Futuras (Backlog)
-   **Frontend:**
    -   Adicionar transições suaves para as mudanças na interface do usuário.
-   **Backend:**
    -   Implementar envio em lote (upload múltiplo) de e-mails para análise.
-   **Avançado:**
    -   Treinar um modelo discriminativo para classificação de e-mails (requer um grande volume de e-mails pré-classificados).
    -   Explorar integração com serviços de e-mail (Gmail API, IMAP) para leitura e processamento direto de caixas de entrada, incluindo um sistema de autenticação robusto.
