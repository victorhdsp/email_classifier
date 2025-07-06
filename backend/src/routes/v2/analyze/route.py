
from fastapi import (
    APIRouter,
    BackgroundTasks,
    File,
    HTTPException,
    Request,
    UploadFile,
    status,
)

from src.analyze.models.analyze_by_text_request import AnalyzeByTextRequest
from src.analyze.models.analyze_result import AnalyzeFullResult, AnalyzeLoadingResult
from src.dependences import (
    collect_data_use_case,
    extract_file_use_case,
    pre_proccess_use_case,
)
from src.shared.services.processing_queue import processing_queue_service

analyze_router = APIRouter(prefix="/email")

@analyze_router.post(
    "/analyze/file",
    summary="Analisar e-mail a partir de um arquivo",
    description="Extrai o texto de um arquivo de e-mail (.eml, .txt) e o classifica como produtivo ou improdutivo.",
    response_description="O resultado da análise do e-mail.",
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Usuário não autenticado.",
            "content": {
                "application/json": {
                    "example": {"detail": "Usuário não autenticado."}
                }
            },
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Erro de validação dos dados de entrada.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": [
                            {
                                "loc": ["body", "file"],
                                "msg": "O arquivo deve ser um arquivo de e-mail válido.",
                                "type": "value_error",
                            }
                        ]
                    }
                }
            },
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Erro interno no servidor.",
            "content": {
                "application/json": {
                    "example": {"detail": "Falha ao criar ou coletar os dados."}
                }
            },
        },
    },
)
async def handle_file(request: Request, background_tasks: BackgroundTasks, file: UploadFile = File(...)) -> AnalyzeLoadingResult:
    user_token = getattr(request.state, "user_token", "")
    if not user_token or user_token.strip() == "":
            raise HTTPException(status_code=401, detail="Usuário não autenticado.")
            
    raw_text = await extract_file_use_case.execute(file)
    loading_data = pre_proccess_use_case.execute(raw_text)

    await processing_queue_service.enqueue(user_token, loading_data)

    return loading_data


@analyze_router.post(
    "/analyze/json",
    summary="Analisar e-mail a partir de um texto em JSON",
    description="Recebe um objeto JSON com o texto do e-mail e o classifica como produtivo ou improdutivo.",
    response_description="O resultado da análise do e-mail.",
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Usuário não autenticado.",
            "content": {
                "application/json": {
                    "example": {"detail": "Usuário não autenticado."}
                }
            },
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Erro de validação dos dados de entrada.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": [
                            {
                                "loc": ["body", "text"],
                                "msg": "O texto do e-mail deve ser fornecido.",
                                "type": "value_error",
                            }
                        ]
                    }
                }
            },
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Erro interno no servidor.",
            "content": {
                "application/json": {
                    "example": {"detail": "Falha ao criar ou coletar os dados."}
                }
            },
        },
    },
)
async def handle_text(request: Request, background_tasks: BackgroundTasks, data: AnalyzeByTextRequest) -> AnalyzeLoadingResult:
    user_token = getattr(request.state, "user_token", "")
    print(f"[Analyze] User ID: {user_token} - Request State: {request.state}") 
    if not user_token or user_token.strip() == "":
            raise HTTPException(status_code=401, detail="Usuário não autenticado.")

    loading_data = pre_proccess_use_case.execute(data.text)
    
    await processing_queue_service.enqueue(user_token, loading_data)

    return loading_data


@analyze_router.get(
    "/{email_id}",
    summary="Obter resultado da análise de e-mail",
    description="Recupera o resultado da análise de um e-mail já processado.",
    response_description="O resultado da análise do e-mail.",
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Usuário não autenticado.",
            "content": {
                "application/json": {
                    "example": {"detail": "Usuário não autenticado."}
                }
            },
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Erro de validação dos dados de entrada.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": [
                            {
                                "loc": ["body", "text"],
                                "msg": "O texto do e-mail deve ser fornecido.",
                                "type": "value_error",
                            }
                        ]
                    }
                }
            },
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Análise não encontrada ou usuário não autorizado.",
            "content": {
                "application/json": {
                    "example": {"detail": "Analyze is not already or you not authorized to access this result."}
                }
            },
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Erro interno no servidor.",
            "content": {
                "application/json": {
                    "example": {"detail": "Falha ao coletar os dados."}
                }
            },
        },
    },
)
async def get_email_analysis(request: Request, email_id: str) -> AnalyzeFullResult:
    user_token = getattr(request.state, "user_token", "")
    if not user_token or user_token.strip() == "":
            raise HTTPException(status_code=401, detail="Usuário não autenticado.")

    print(f"[Analyze] Result for email ID {user_token}: {request.state}")
    result = await collect_data_use_case.execute(user_token, email_id)
    if not result:
        raise HTTPException(
            detail="Analyze is not already or you not authorized to access this result.",
            status_code=400,
        )
    return result