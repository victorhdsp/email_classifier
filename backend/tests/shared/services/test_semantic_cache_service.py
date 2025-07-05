import hashlib
from unittest.mock import MagicMock

import pytest
from sqlalchemy.orm import Session

from src.semantic_cache.repository import SemanticCacheRepository
from src.semantic_cache.service import SemanticCacheService


@pytest.fixture
def mock_semantic_cache_repository():
    return MagicMock(spec=SemanticCacheRepository)


@pytest.fixture
def semantic_cache_service(mock_semantic_cache_repository):
    service = SemanticCacheService(MagicMock(spec=Session)) 
    service.repository = mock_semantic_cache_repository 
    return service


def test_generate_hash():
    service = SemanticCacheService(MagicMock(spec=Session))
    text = "test input"
    expected_hash = hashlib.sha256(text.encode('utf-8')).hexdigest()
    assert service._generate_hash(text) == expected_hash

def test_cache_miss_and_store(semantic_cache_service, mock_semantic_cache_repository):
    mock_semantic_cache_repository.get_by_id.return_value = None

    mock_llm_callable = MagicMock(return_value={"type": "Produtivo", "id": "some_id"})
    prompt = "Analyze this email content"
    input_text = "new email content"

    result = semantic_cache_service.get_or_generate(input_text, prompt, mock_llm_callable)

    mock_llm_callable.assert_called_once_with(prompt)

    expected_hash = hashlib.sha256(input_text.encode('utf-8')).hexdigest()
    mock_semantic_cache_repository.insert.assert_called_once_with(
        expected_hash, input_text, {"type": "Produtivo", "id": expected_hash }
    )
    assert result == {"type": "Produtivo", "id": expected_hash }



def test_cache_hit(semantic_cache_service, mock_semantic_cache_repository):
    cached_data = {
        "id": "some_hash",
        "input_text": "cached email content",
        "llm_result_json": {"type": "Improdutivo"},
        "created_at": "2023-01-01T12:00:00Z",
    }
    
    mock_semantic_cache_repository.get_by_id.return_value = cached_data
 
    mock_llm_callable = MagicMock()
    prompt = "Analyze this email content"
    input_text = "cached email content"

    result = semantic_cache_service.get_or_generate(input_text, prompt, mock_llm_callable)

    mock_llm_callable.assert_not_called()

    assert result == cached_data["llm_result_json"]

    mock_semantic_cache_repository.insert.assert_not_called()