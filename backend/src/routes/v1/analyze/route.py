from fastapi import APIRouter, File, HTTPException, Request, UploadFile, status

from src.analyze.models.analyze_by_text_request import AnalyzeByTextRequest
from src.analyze.models.analyze_result import AnalyzeFullResult
from src.dependences import (
    collect_data_use_case,
    create_data_use_case,
    extract_file_use_case,
    pre_proccess_use_case,
)
from src.routes.v1.analyze.analyze_doc import handle_file_doc, handle_text_doc
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)

analyze_router = APIRouter(prefix="/email")


@analyze_router.post("/analyze/file", **handle_file_doc)
async def handle_file(request: Request, file: UploadFile = File(...)) -> AnalyzeFullResult:
    logger.info(f"[V1] Request received to analyze file: {file.filename}")
    user_token = getattr(request.state, "user_token", "")
    if not user_token or user_token.strip() == "":
        logger.error("[V1] Unauthorized access attempt to /analyze/file: Missing user token.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não autenticado.")
    try:
        raw_text = await extract_file_use_case.execute(file)
        logger.info("[V1] File extracted successfully.")
    except Exception as e:
        logger.error(f"[V1] Error extracting file: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Falha ao extrair o arquivo.")

    loading_data = pre_proccess_use_case.execute(raw_text)
    logger.info(f"[V1] Pre-processing completed for data ID: {loading_data.id}")

    result_data = await collect_data_use_case.execute(user_token, loading_data.id)
    if not result_data:
        logger.info(f"[V1] No existing data found for ID {loading_data.id}. Creating new data.")
        result_data = await create_data_use_case.execute(user_token, loading_data)
    if not result_data:
        logger.error(f"[V1] Failed to create or collect data for ID: {loading_data.id}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Falha ao criar ou coletar os dados.")
    logger.info(f"[V1] Analysis completed for file {file.filename}. Data ID: {result_data.id}")
    return result_data


@analyze_router.post("/analyze/json", **handle_text_doc)
async def handle_text(request: Request, data: AnalyzeByTextRequest) -> AnalyzeFullResult:
    logger.info("[V1] Request received to analyze text.")
    user_token = getattr(request.state, "user_token", "")
    if not user_token or user_token.strip() == "":
        logger.error("[V1] Unauthorized access attempt to /analyze/json: Missing user token.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não autenticado.")
    loading_data = pre_proccess_use_case.execute(data.text)
    logger.info(f"[V1] Pre-processing completed for data ID: {loading_data.id}")

    result_data = await collect_data_use_case.execute(user_token, loading_data.id)
    if not result_data:
        logger.info(f"[V1] No existing data found for ID {loading_data.id}. Creating new data.")
        result_data = await create_data_use_case.execute(user_token, loading_data)
    if not result_data:
        logger.error(f"[V1] Failed to create or collect data for ID: {loading_data.id}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Falha ao criar ou coletar os dados.")
    logger.info(f"[V1] Analysis completed for text. Data ID: {result_data.id}")
    return result_data

