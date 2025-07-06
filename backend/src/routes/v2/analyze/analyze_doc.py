from fastapi import status
from src.shared.models.error_response import ErrorDetail

handle_file_doc = {
    "summary": "Analisar e-mail a partir de um arquivo (V2)",
    "description": "Envia um arquivo de e-mail para uma fila de processamento assíncrono.",
    "response_description": "Confirmação de que o e-mail foi recebido e está na fila para análise.",
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
    "summary": "Analisar e-mail a partir de um texto em JSON (V2)",
    "description": "Envia um texto de e-mail para uma fila de processamento assíncrono.",
    "response_description": "Confirmação de que o e-mail foi recebido e está na fila para análise.",
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

get_email_analysis_doc = {
    "summary": "Obter resultado da análise de e-mail (V2)",
    "description": "Recupera o resultado da análise de um e-mail já processado.",
    "response_description": "O resultado completo da análise do e-mail.",
    "responses": {
        status.HTTP_400_BAD_REQUEST: {
            "description": "Análise não encontrada ou usuário não autorizado.",
            "model": ErrorDetail,
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Usuário não autenticado.",
            "model": ErrorDetail,
        },
    },
}
