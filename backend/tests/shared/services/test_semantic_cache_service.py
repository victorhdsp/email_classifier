import hashlib
import json
from unittest.mock import MagicMock

import pytest
from sqlalchemy.orm import Session

from src.shared.infra.database.semantic_cache_model import SemanticCache
from src.shared.infra.database.semantic_cache_repository import SemanticCacheRepository
from src.shared.services.semantic_cache_service import SemanticCacheService


@pytest.fixture
def mock_db_session():
    return MagicMock(spec=Session)


@pytest.fixture
def mock_semantic_cache_repository():
    return MagicMock(spec=SemanticCacheRepository)


@pytest.fixture
def semantic_cache_service(mock_semantic_cache_repository):
    service = SemanticCacheService(MagicMock(spec=Session)) # Pass a dummy session, as the mock repository will be used
    service.repository = mock_semantic_cache_repository # Replace the real repository with the mock
    return service


def test_generate_hash():
    service = SemanticCacheService(MagicMock(spec=Session))
    text = "test input"
    expected_hash = hashlib.sha256(text.encode('utf-8')).hexdigest()
    assert service._generate_hash(text) == expected_hash

def test_cache_miss_and_store(semantic_cache_service, mock_semantic_cache_repository):
    # Mock repository to return None for get_by_id (cache miss)
    mock_semantic_cache_repository.get_by_id.return_value = None

    mock_llm_callable = MagicMock(return_value={"type": "Produtivo"})
    input_text = "new email content"

    result = semantic_cache_service.get_or_generate(input_text, mock_llm_callable)

    # Assert LLM callable was called
    mock_llm_callable.assert_called_once_with(input_text)

    # Assert result is from LLM
    assert result == {"type": "Produtivo"}

    # Assert repository insert was called
    expected_hash = hashlib.sha256(input_text.encode('utf-8')).hexdigest()
    mock_semantic_cache_repository.insert.assert_called_once_with(
        expected_hash, input_text, {"type": "Produtivo"}
    )


def test_cache_hit(semantic_cache_service, mock_semantic_cache_repository):
    cached_data = {
        "id": "some_hash",
        "input_text": "cached email content",
        "llm_result_json": {"type": "Improdutivo"},
        "created_at": "2023-01-01T12:00:00Z",
    }
    # Mock repository to return cached data for get_by_id (cache hit)
    mock_semantic_cache_repository.get_by_id.return_value = cached_data
 
    mock_llm_callable = MagicMock()
    input_text = "cached email content"

    result = semantic_cache_service.get_or_generate(input_text, mock_llm_callable)

    # Assert LLM callable was NOT called
    mock_llm_callable.assert_not_called()

    # Assert result is from cache
    assert result == cached_data["llm_result_json"]

    # Assert repository insert was NOT called
    mock_semantic_cache_repository.insert.assert_not_called()