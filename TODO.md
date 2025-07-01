## 1. Setup Inicial e Infraestrutura

* [ ] Criar repositórios separados para frontend e backend.
* [ ] Configurar ambiente de desenvolvimento para backend (FastAPI + ambiente virtual Python + dependências básicas).
* [ ] Configurar ambiente de desenvolvimento para frontend (React + Vite/CRA + ESLint + Prettier).
* [ ] Criar README inicial com instruções de setup e rodar localmente.

---

## 2. Backend - Email Analysis

### Protect

* [ ] Implementar validação do tamanho máximo do arquivo.
* [ ] Validar se o conteúdo existe e se o formato é aceito (pdf, txt, string).

### Extract

* [ ] Implementar extração do texto de arquivos PDF (usar PyPDF2 ou similar).
* [ ] Implementar leitura direta de arquivo TXT.
* [ ] Permitir receber texto puro sem arquivo.

### Normalize

* [ ] Implementar tratamento básico de texto (espaços, quebras de linha, minúsculas).
* [ ] Remover caracteres inválidos (UTF-8).
* [ ] Remover acentos e caracteres especiais.
* [ ] Remover cabeçalhos desnecessários (definir o que será removido).
* [ ] Implementar pré-processamento NLP básico (stop words, lematização) — usar SpaCy ou NLTK.
* [ ] Extrair timestamp se presente no texto.

### Analyze

* [ ] Criar integração com API de IA (OpenAI GPT ou Hugging Face).
* [ ] Definir e montar prompt para classificação, resumo e criação do subject.
* [ ] Implementar lógica para envio do texto pré-processado e recebimento dos dados da IA.
* [ ] Validar formato de resposta para `subject`, `type`, `text` e `timestamp`.

### Backend Geral

* [ ] Criar endpoint API REST para receber dados do frontend (arquivo/texto).
* [ ] Implementar tratamento de erros e respostas padronizadas.
* [ ] Criar testes unitários básicos para cada etapa (protect, extract, normalize, analyze).

---

## 3. Frontend - Interface

* [ ] Criar formulário com input de upload (aceitando pdf, txt).
* [ ] Implementar componente para mostrar arquivo carregado com ícone, nome, peso, progresso e botão de fechar.
* [ ] Implementar loading no input e desabilitar submit enquanto processa.
* [ ] Criar toggle (botão, switch ou tab) para alternar entre upload e textarea.
* [ ] Criar textarea para entrada manual de texto.
* [ ] Criar sidebar scrollável com accordion para mostrar `subject`, `type`, `text` e `timestamp`.
* [ ] Implementar abertura/fechamento da sidebar e comportamento responsivo (sidebar lateral ou embaixo conforme largura).
* [ ] Tratar responsividade geral da página.

---

## 4. Integração

* [ ] Implementar chamada HTTP do frontend para backend (upload e texto).
* [ ] Consumir resposta e popular sidebar com dados da análise.
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

## 6. Extras (Após MVP)

* [ ] Implementar envio em lote (upload múltiplo).
* [ ] Criar onboarding simples no frontend explicando a funcionalidade.
* [ ] Leitura e análise de TXT pequenos no frontend (<1MB).
* [ ] Explorar integração com serviços de email (Gmail API, IMAP).
* [ ] Cache simples para evitar chamadas repetidas à IA.
