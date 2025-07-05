from unittest.mock import MagicMock

import pytest

from src.analyze.models.analyze_result import AnalyzeResult
from src.analyze.usecases.analize_raw_text import AnalyzeRawTextUseCase
from src.semantic_cache.service import SemanticCacheService
from src.shared.services.llm import LLMService
from src.shared.services.nlp import NLPService


@pytest.fixture
def mock_nlp_service():
    return MagicMock(spec=NLPService)


@pytest.fixture
def mock_llm_service():
    return MagicMock(spec=LLMService)


@pytest.fixture
def mock_semantic_cache_service():
    return MagicMock(spec=SemanticCacheService)


@pytest.fixture
def analyze_raw_text_use_case(
    mock_nlp_service, mock_llm_service, mock_semantic_cache_service
):
    return AnalyzeRawTextUseCase(
        mock_nlp_service, mock_llm_service, mock_semantic_cache_service
    )


@pytest.mark.asyncio
async def test_analyze_raw_text_use_case_with_cache_hit(
    analyze_raw_text_use_case, mock_nlp_service, mock_semantic_cache_service
):
    raw_text = "This is a test email."
    cleaned_text = "this is a test email"
    cached_llm_response = {
        "type": "Produtivo",
        "timestamp": "2023-01-01T12:00:00Z",
        "text": "This email is productive.",
        "subject": "Test Email"
    }

    mock_nlp_service.pipeline.return_value = cleaned_text
    mock_semantic_cache_service.get_or_generate.return_value = cached_llm_response

    result = await analyze_raw_text_use_case.execute(raw_text)

    mock_nlp_service.pipeline.assert_called_once_with(raw_text)
    mock_semantic_cache_service.get_or_generate.assert_called_once()
    assert isinstance(result, AnalyzeResult)
    assert result.type == "Produtivo"
    assert result.timestamp == "2023-01-01T12:00:00Z"


@pytest.mark.asyncio
async def test_analyze_raw_text_use_case_with_cache_miss(
    analyze_raw_text_use_case, mock_nlp_service, mock_semantic_cache_service, mock_llm_service
):
    raw_text = "Another test email."
    cleaned_text = "another test email"
    llm_generated_response = {
        "type": "Improdutivo",
        "timestamp": "2023-01-02T10:00:00Z",
        "text": "This email is not productive.",
        "subject": "Test Email"
    }

    mock_nlp_service.pipeline.return_value = cleaned_text
    mock_semantic_cache_service.get_or_generate.return_value = llm_generated_response

    result = await analyze_raw_text_use_case.execute(raw_text)

    mock_nlp_service.pipeline.assert_called_once_with(raw_text)
    mock_semantic_cache_service.get_or_generate.assert_called_once()
    assert isinstance(result, AnalyzeResult)
    assert result.type == "Improdutivo"
    assert result.timestamp == "2023-01-02T10:00:00Z"