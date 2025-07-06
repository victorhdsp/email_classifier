from fastapi import status
from src.shared.models.error_response import ErrorDetail

handle_file_doc = {
    "summary": "Analisar e-mail a partir de um arquivo",
    "description": "Extrai o texto de um arquivo de e-mail (.eml, .txt) e o classifica como produtivo ou improdutivo.",
    "response_description": "O resultado da análise do e-mail.",
    "responses": {
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Usuário não autenticado.",
            "model": ErrorDetail,
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Erro interno no servidor.",
            "model": ErrorDetail,
        },
    },
}

handle_text_doc = {
    "summary": "Analisar e-mail a partir de um texto em JSON",
    "description": "Recebe um objeto JSON com o texto do e-mail e o classifica como produtivo ou improdutivo.",
    "response_description": "O resultado da análise do e-mail.",
    "responses": {
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Usuário não autenticado.",
            "model": ErrorDetail,
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Erro interno no servidor.",
            "model": ErrorDetail,
        },
    },
}
