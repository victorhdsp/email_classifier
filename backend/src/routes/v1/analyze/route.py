from fastapi import APIRouter, File, HTTPException, Request, UploadFile, status

from src.analyze.models.analyze_by_text_request import AnalyzeByTextRequest
from src.analyze.models.analyze_result import AnalyzeFullResult
from src.dependences import (
    collect_data_use_case,
    create_data_use_case,
    extract_file_use_case,
    pre_proccess_use_case,
)
from src.shared.models.error_response import ErrorDetail

analyze_router = APIRouter(prefix="/email", tags=["Análise"])


@analyze_router.post(
    "/analyze/file",
    summary="Analisar e-mail a partir de um arquivo",
    description="Extrai o texto de um arquivo de e-mail (.eml, .txt) e o classifica como produtivo ou improdutivo.",
    response_description="O resultado da análise do e-mail.",
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Usuário não autenticado.",
            "model": ErrorDetail,
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Erro interno no servidor.",
            "model": ErrorDetail,
        },
    },
)
async def handle_file(request: Request, file: UploadFile = File(...)) -> AnalyzeFullResult:
    user_token = getattr(request.state, "user_token", "")
    if not user_token or user_token.strip() == "":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não autenticado.")
    raw_text = await extract_file_use_case.execute(file)
    loading_data = pre_proccess_use_case.execute(raw_text)

    result_data = await collect_data_use_case.execute(user_token, loading_data.id)
    if not result_data:
        result_data = await create_data_use_case.execute(user_token, loading_data)
    if not result_data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Falha ao criar ou coletar os dados.")
    return result_data


@analyze_router.post(
    "/analyze/json",
    summary="Analisar e-mail a partir de um texto em JSON",
    description="Recebe um objeto JSON com o texto do e-mail e o classifica como produtivo ou improdutivo.",
    response_description="O resultado da análise do e-mail.",
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Usuário não autenticado.",
            "model": ErrorDetail,
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Erro interno no servidor.",
            "model": ErrorDetail,
        },
    },
)
async def handle_text(request: Request, data: AnalyzeByTextRequest) -> AnalyzeFullResult:
    user_token = getattr(request.state, "user_token", "")
    if not user_token or user_token.strip() == "":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não autenticado.")
    loading_data = pre_proccess_use_case.execute(data.text)

    result_data = await collect_data_use_case.execute(user_token, loading_data.id)
    if not result_data:
        result_data = await create_data_use_case.execute(user_token, loading_data)
    if not result_data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Falha ao criar ou coletar os dados.")
    return result_data

