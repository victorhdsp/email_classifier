Contexto:
Estou desenvolvendo uma aplicação backend em Python com FastAPI que utiliza LLMs para classificar emails como "produtivos" ou "improdutivos". Para evitar custos desnecessários com LLMs, quero implementar um sistema de cache semântico, que armazene a resposta de um texto previamente analisado, utilizando um hash como chave. O backend roda em Docker, e o banco de dados que escolhi para isso é o PostgreSQL.

Objetivo:
Quero que você me ajude a gerar o código necessário para implementar esse sistema de cache semântico, de forma modular e bem separada (respeitando boas práticas de organização de camadas — repositório, serviço, usecase).

Regras:
- Use Python 3.10+
- Utilize SQLAlchemy para lidar com o PostgreSQL
- A tabela do cache deve conter os campos: id (hash), input (texto limpo), output (JSON), created_at (timestamp)
- O hash deve ser gerado com SHA-256 sobre o texto limpo
- Se o hash já estiver no banco, deve retornar direto sem chamar o LLM
- Se não estiver, chama o LLM e salva a resposta
- O serviço deve ser reutilizável em outros pontos do sistema
- Assuma que a função `llm_service.generate_text(prompt)` existe e retorna um JSON válido

Tarefas:
1. Criar a model `SemanticCache` no SQLAlchemy com os campos mencionados.
2. Criar o repositório `SemanticCacheRepository` com os métodos:
   - `get_by_id(hash: str) -> Optional[dict]`
   - `insert(hash: str, input: str, output: dict) -> None`
3. Criar o serviço `SemanticCacheService` com o método:
   - `get_or_generate(input_text: str, llm_callable: Callable[[str], dict]) -> dict`
4. Adicionar o hash e normalização do input no serviço
5. Integrar esse serviço ao usecase de análise de email (`AnalyzeRawTextUseCase`), substituindo a chamada direta ao LLM
6. (Opcional) Criar testes básicos para garantir o funcionamento do cache
7. (Opcional) Logar quando uma resposta vier do cache ou do LLM
