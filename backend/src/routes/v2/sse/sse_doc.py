from fastapi import status
from src.shared.models.error_response import ErrorDetail

sse_endpoint_doc = {
    "summary": "Conectar ao stream de eventos (SSE)",
    "description": "Estabelece uma conexão Server-Sent Events para receber atualizações em tempo real.",
    "response_description": "Um stream de eventos contínuo.",
    "responses": {
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Usuário não autenticado.",
            "model": ErrorDetail,
        },
    },
}
