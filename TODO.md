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
* [x] Remover caracteres inválidos (UTF-8).
* [x] Remover acentos e caracteres especiais.
* [x] Remover cabeçalhos desnecessários (definir o que será removido).
* [x] Implementar pré-processamento NLP básico (stop words, lematização) — usar SpaCy ou NLTK.
* [x] Extrair timestamp se presente no texto.

### Analyze

* [x] Criar integração com API de IA (OpenAI GPT ou Hugging Face).
* [x] Definir e montar prompt para classificação, resumo e criação do subject.
* [x] Implementar lógica para envio do texto pré-processado e recebimento dos dados da IA.
* [x] Validar formato de resposta para `subject`, `type`, `text` e `timestamp`.

### Backend Geral

* [x] Criar endpoint API REST para receber dados do frontend (arquivo/texto).
* [x] Implementar tratamento de erros e respostas padronizadas.
* [x] Criar testes unitários básicos para cada etapa (protect, extract, normalize, analyze).
* [x] Criar um fallback para a API da LLM.

---

## 3. Frontend - Interface

* [x] Criar formulário com input de upload (aceitando pdf, txt).
* [x] Implementar componente para mostrar arquivo carregado com ícone, nome, peso, progresso e botão de fechar.
* [x] Implementar loading no input e desabilitar submit enquanto processa.
* [x] Criar toggle (botão, switch ou tab) para alternar entre upload e textarea.
* [x] Criar textarea para entrada manual de texto.
* [x] Criar sidebar scrollável com accordion para mostrar `subject`, `type`, `text` e `timestamp`.
* [x] Implementar abertura/fechamento da sidebar e comportamento responsivo (sidebar lateral ou embaixo conforme largura).
* [x] Tratar responsividade geral da página.
* [x] Tornar formulário com tamanho fixo em ambas as direções.
* [x] Permitir sobreposição parcial do aside.
* [x] Em dispositivos pequenos remover o aside e adicionar o conteúdo abaixo do formulário.

---

## 4. Integração

* [x] Implementar chamada HTTP do frontend para backend (upload e texto).
* [x] Consumir resposta e popular sidebar com dados da análise.
* [x] Tratar erros e mostrar mensagens amigáveis.

---

## 5. Deploy e Documentação

* [x] Preparar scripts para deploy backend (ex: Dockerfile, requirements.txt).
* [x] Deploy backend em plataforma gratuita (Heroku, Render, etc.).
* [x] Preparar deploy frontend (Vercel, Netlify, etc.).
* [x] Escrever README final com instruções claras para rodar local e deploy.
* [ ] Preparar documentação mínima da API (endpoint, parâmetros, resposta).
* [ ] Criar vídeo demonstrativo (3-5 minutos) explicando a solução.

---

## Backlog

* [x] fix(frontend): Limpar o textarea quando enviar textos no frontend.
* [x] fix(backend): Adicionar um id para o conteúdo no backend.
* [x] fix(frontend): No aside, mostrar o primeiro accordion já aberto.
* [x] fix(frontend): Accordion não esta fechando.
* [x] fix(backend): Mesmo com arquivo ele não conseguiu pegar a data.
* [x] fix(frontend): Input de upload aceitando mais arquivos que somente "txt" e "pdf".
* [x] fix(backend): Dar exemplos de coisas produtivas e improdutivas para o prompt. 
* [x] fix(backend): Diminuir a criatividade da LLM.
* [x] fix(frontend): Mudar textos relacionados a data e ocultar quando não tiver.
* [x] fix(frontend): Selecionar um arquivo e ir para o campo de texto deve ocultar a caixa de aviso.

---

## 6. Extras (Após MVP)

* [x] featere(frontend): Leitura e análise de TXT pequenos no frontend (<1MB). ***!
* [x] featere(frontend): Criar onboarding simples no frontend explicando a funcionalidade. **!

* [ ] featere(backend): Cache semântico para evitar chamadas repetidas à IA. ***!!
    [ ] adicionar banco de dados
* [ ] featere(frontend): Adicionar persistência para os elementos já classificados. ***!!
    [ ] adicionar remoção dos já adicionados.
    [ ] adicionar busca dos elementos já adicionados.
    [ ] adicionar filtragem dos elementos já adicionados.
* [ ] feature(frontend): Adicionar transições suaves para as mudanças no frontend. **!!
* [ ] featere(backend): Implementar envio em lote (upload múltiplo). *!!

* [ ] treinar um modelo discriminativo para fazer a classificação. ***!!!
    - precisa de muitos e-mails já classificados.
* [ ] featere(frontend): Explorar integração com serviços de email (Gmail API, IMAP). *!!!
    [ ] adicionar sistema de autenticação
