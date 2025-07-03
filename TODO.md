## 1. Setup Inicial e Infraestrutura

* [x] Criar repositórios separados para frontend e backend.
* [x] Configurar ambiente de desenvolvimento para backend (FastAPI + dependências básicas).
* [x] Configurar ambiente de desenvolvimento para frontend (React + Vite/CRA + ESLint + Prettier).
* [x] Configurar docker para ambos os projetos.
* [x] Adcionar um docker-compose para rodar ambos os projetos simultaneamente.
* [x] Criar README na raiz do projeto, com instruções de setup e rodar localmente de forma indiviual e pelo docker-compose, comentando versões necessárias.
---

## 2. Backend - Email Analysis

### Protect

* [x] Implementar validação do tamanho máximo do arquivo.
* [x] Validar se o conteúdo existe e se o formato é aceito (pdf, txt, string).

### Extract

* [x] Implementar extração do texto de arquivos PDF (usar PyPDF2 ou similar).
* [x] Implementar leitura direta de arquivo TXT.
* [x] Permitir receber texto puro sem arquivo.

### Normalize

* [x] Implementar tratamento básico de texto (espaços, quebras de linha, minúsculas).
* [ ] Remover caracteres inválidos (UTF-8).
* [ ] Remover acentos e caracteres especiais.
* [ ] Remover cabeçalhos desnecessários (definir o que será removido).
* [x] Implementar pré-processamento NLP básico (stop words, lematização) — usar SpaCy ou NLTK.
* [ ] Extrair timestamp se presente no texto.

### Analyze

* [x] Criar integração com API de IA (OpenAI GPT ou Hugging Face).
* [x] Definir e montar prompt para classificação, resumo e criação do subject.
* [x] Implementar lógica para envio do texto pré-processado e recebimento dos dados da IA.
* [x] Validar formato de resposta para `subject`, `type`, `text` e `timestamp`.

### Backend Geral

* [x] Criar endpoint API REST para receber dados do frontend (arquivo/texto).
* [x] Implementar tratamento de erros e respostas padronizadas.
* [ ] Criar testes unitários básicos para cada etapa (protect, extract, normalize, analyze).

---

## 3. Frontend - Interface

* [x] Criar formulário com input de upload (aceitando pdf, txt).
* [x] Implementar componente para mostrar arquivo carregado com ícone, nome, peso, progresso e botão de fechar.
* [x] Implementar loading no input e desabilitar submit enquanto processa.
* [x] Criar toggle (botão, switch ou tab) para alternar entre upload e textarea.
* [x] Criar textarea para entrada manual de texto.
* [x] Criar sidebar scrollável com accordion para mostrar `subject`, `type`, `text` e `timestamp`.
* [x] Implementar abertura/fechamento da sidebar e comportamento responsivo (sidebar lateral ou embaixo conforme largura).
* [ ] Tratar responsividade geral da página.
* [ ] Tornar formulário com tamanho fixo em ambas as direções.
* [ ] Permitir sobreposição parcial do aside.
* [ ] Em dispositivos pequenos remover o aside e adicionar o conteúdo abaixo do formulário.

---

## 4. Integração

* [x] Implementar chamada HTTP do frontend para backend (upload e texto).
* [x] Consumir resposta e popular sidebar com dados da análise.
* [ ] Tratar erros e mostrar mensagens amigáveis.

---

## 5. Deploy e Documentação

* [ ] Preparar scripts para deploy backend (ex: Dockerfile, requirements.txt).
* [ ] Deploy backend em plataforma gratuita (Heroku, Render, etc.).
* [ ] Preparar deploy frontend (Vercel, Netlify, etc.).
* [ ] Escrever README final com instruções claras para rodar local e deploy.
* [ ] Preparar documentação mínima da API (endpoint, parâmetros, resposta).
* [ ] Criar vídeo demonstrativo (3-5 minutos) explicando a solução.

---

## Backlog

* [ ] Limpar o textarea quando enviar textos.
* [ ] Concatenar e persistir ultimas classificações.
* [ ] No aside, mostrar o primeiro accordion já aberto.
* [ ] Mesmo com arquivo ele não pegou a data.

---

## 6. Extras (Após MVP)

* [ ] Implementar envio em lote (upload múltiplo).
* [ ] Criar onboarding simples no frontend explicando a funcionalidade.
* [ ] Leitura e análise de TXT pequenos no frontend (<1MB).
* [ ] Explorar integração com serviços de email (Gmail API, IMAP).
* [ ] Cache simples para evitar chamadas repetidas à IA.
