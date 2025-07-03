# ✅ **Decisões**

## **1. Planejamento Inicial**

### Arquitetura geral do projeto

Decidi fazer uma separação entre o frontend e o backend, mesmo sendo um projeto muito simples, por isso abre mais abertura para que no futuro o projeto possa crescer sem afetar o conjunto.

Por mais que inicialmente não tenha muitas dependência, se no futuro quisermos adicionar um NextJS fica fácil porque está separado ou mudar o framework, se quiser trocar de CSS para SCSS fica fácil, adicionar bibliotecas de componentes e afins.

### Escolher stack para frontend.

Decidi usar React para o frontend, por 2 motívos, inicialmente minha ideia era usar `preact` para criar o frontend por ter a maior parte da API e ser infinitamente mais leve, porém ele não tem suporte a muitas bibliotecas "react-friedly" e isso limita o que da para construir no frontend considerando o tempo que eu tenho, esse foi o primeiro motivo mas existem outros frameworks que tem o suporte a bibliotecas de UI por exemplo como o `svelte` e o `solid`, minha ideia inicial de usar `preact` era por ser fácil de escalar para o `react` comum e por consequência fácil de escalar para um `next.js`, a escolha do caminho `react` me parece certa porque é uma tecnologia que vocês já trabalham e eu nem cogitei utilizar HTML vanilla porque a falta do `jsx` tornaria trabalhoso fazer algo elaborado.


### Escolher stack para o backend.

Confesso que python não é meu core, eu tenho experiência em Node, C, Golang e mais recentemente kotlin mas bem no começo, porém vou tentar trazer meus conhecimentos para o python.

Decidi usar o `FastAPI` porque ele tem uma curva de aprendizado baixa e é bastante livre então posso usar uma arquitetura mas conveniênte, pelo que pesquisei ele funciona parecido com o express, ele é bastante popular então acredito que não vou ter problemas de compatibilidade com qualquer biblioteca que venha a precisar e caso tenha problema vai ser mais tranquilo encontrar soluções.

Tomei a decisão de colocar `black` e o `ruff` para formatar os códigos e `mypy` como dependência de desenvolvimento, para ter tipagem e evitar erros, porque estava me sentindo codando as cegas.

Para o llm decidi utilizar o `google gemini`, mais específicamente o "gemini-1.5-flash", ele tem o custo de 0.075$ para cada 1M de tokens, considerando que cada e-mail tenha 1000 tokens (o que vocês me enviaram em 334), o custo seria 0.075$ para cada 1000 e-mails. Outro motivo para a escolha foi o fato dele ter um nível gratuito de 1M de tokens sendo 50 requisições/dia.

Coloquei como um fallback para o caso do Gemini falhar, seja pelo excesso do limite gratuito, por estar fora do ar ou por algum erro, nesse caso estou usando o `hugging faces`, com o modelo `mistral-7b`, a versão gratuita do hugging faces tem o problema de ser meio lenta, por isso estou usando como fallback e não como principal, relação a custos o hugging faces cobra por hardware e não por token.

---

## **2. Frontend**

### Estrutura de design

Vai ser somente uma página, vou ter um `formulário` que tem um `input de upload`, um `botão` para fazer submit do formulário.

- Ao fazer upload de um arquivo abaixo do input deve aparecer uma caixa, mostrando o um `icone` representando o formato do arquivo, o `texto` do nome do arquivo com o formato, o `texto` do peso do arquivo, uma `barra de progresso` e um `botão` para fechar.

- Ao ser criado e ao fechar essa caixa de aviso o tamanho do formulário não deve mudar, o tamanho do input deve diminuir para encaixar junto com a caixa.

- Ao carregar um arquivo para fazer upload o conteúdo de dentro do `input de upload` deve alterar para um componente de `loading` até que termine e o `botão` de submit deve ficar desabilidato.

Nela tem um `botão`, `switch` ou `tab` por onde você pode alternar o formato de envio de upload para um `textarea`.

Além disso tem uma `sidebar` scrollavel que mostra o resultado retornado da API no formato de `accordion`, que vai mostrar as informações retornadas do backend.

- Inicialmente as informações são: `subject`, `type`, `text` e `timestamp`.

- Ao ela deve permanecer fechada até que tenha conteúdo, mas deve ser possível abrir.

- Ao ser aberta a `sidebar` deve empurar o formulário para o lado, caso não tenha espaço então deve sobrescrever o formulário até no maxímo a metade.

### Responsividade

O `formulário` deve ter um tamanho médio para que ele possa se mover em relação aos outros elementos que aparecem na tela, tenho no máximo `'x width` mas caso a tela seja menor então deve ser no maximo tamanho da tela.

A `sidebar` em telas maiores deve cobrir a lateral direita da tela quando estiver aberta tomando no minimo `'y width`, no caso do espaço disponível ser insuficiente ou seja `'y + ('x / 2)`, então o conteúdo deve ser apresentado abaixo e não na lateral no tamanho de `'x width` para manter a consistência visual.

### Feedback

Para o `formulário` vou utilizar uma barra de progresso que determina o quanto do arquivo já foi enviado para o servidor e após isso, vai se iniciar um segundo loading avisando que está analisando para que o usuário tenha alguma atualização sobre o que esta acontecendo.

---

## **3. Backend Python**

### Email analysis

Para o funcionamento dessa feature pensei inicialmente em um fluxo de 4 etapas: `protect`, `extract`, `normalize`, `analyze`, dentro de um controller.

#### `protect`: ficaria responsável por validar se o processo pode ser feito, verificar se tem conteúdo e se ele é um arquivo para que o `controller` decida quem precisa receber ele.

- Validar o tamanho máximo.

#### `extract`: ficaria responsável por receber e extrair os arquivos (pdf | txt) em um formato de string.

- Caso o conteúdo já venha em string, então essa etapa é pulada.

#### `normalize`: ficaria responsável por lidar com situações estranhas no texto.

- Caso tenha a data do e-mail no texto, então ele guarda essa informação para o analyze.

- Passar por NLP: Remoção de "stop words" e "lematização".

- Tratar espaços e quebras de linhas duplicadas, remover cabeçalhos desnecessários, remover caracteres fora do UTF-8 válido, transformar tudo em letras minúsculas, remover acéntos e caracteres especiais.

#### `analyze`: ficaria responsável por ler essa string e identificar os principais pontos esperados pelo front-end sendo eles: `subject`, `type`, `text` e `timestamp`.

- Jogar para uma I.A. com um prompt pedindo para que ela leia o e-mail, classifique se ele é produtivo ou não, faça um resumo do que foi conversado no email e crie (se não tiver) um texto que descreva em 3-4 palavras sobre o que o assunto fala.

- O `timestamp` é opcional, nem sempre o conteúdo do e-mail vai conter a data e envio, nesses casos o conteúdo volta sem data.

### Arquitetura

Não sou muito fã de criar a estrutura de pastas baseada em responsábilidades na raiz do projeto, porque conforme o projeto vai crescendo com mais features, você vai fazer edições e precisa ficar catando arquivo um em cada lugar, tem suas vantagens tipo listar rapidamente todas as responsábilidades e é mais fácil de reutilizar código, um exemplo abaixo:
```
/backend
|-- /routes
|---- rota_1.py
|-- /controllers
|---- controller_1.py
|-- /services
|---- service_1.py
...
```

Pessoalmente eu prefiro criar a estrutura de pastas baseadas em funcionalidades e fazer a separação de responsabilidades dentro de cada funcionalidade (se necessário), mas com algumas excessões por comodidade.

- Se eu tenho 1 serviço, não faz sentido criar uma pasta, então eu coloco no arquivo service, com classe nomeada normalmente tipo: `BlablablaService`.

Para lidar com a reutilização de código criar uma shared a nivel de funcionalidade e colocar o código compartilhado lá de forma genérica, extendendo na funcionalidade de fato e para criar algo exclusivo.
```
/backend
|-- /src
|---- /api # esse é um exemplo de excessão
|------ /v1 # a versão da api influencia o endpoint.
|-------- rota_1.py
|---- /<feature>
|------ /controllers ou controller.py
|------ /services ou service.py
|------ ...
|---- /shared
|------ /dto
|-------- error.py
```

---

## **4. Integração Frontend + Backend**

A integração vai ser feito por HTTP em uma API Rest padrão, principalmente considerando que só tenho uma rota.

---

## **5. Deploy**

---

## **6. Documentação**

---

## Features extras

- Onboarding do usuário no funcionamento do sistema.

- Envio para análise de e-mails em lote.

- Leitura de e-mails por I.A. em lote.

- Integração com serviços de e-mail.

- Fazer analise de `txt` pequeno no frontend <1MB

- Fazer a analise em fila.

- 
