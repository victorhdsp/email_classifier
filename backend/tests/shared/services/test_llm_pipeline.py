from unittest.mock import Mock, patch

import pytest

from src.shared.infra.gemini_llm import GeminiService


@pytest.fixture
def mock_genai_client():
    with patch("google.genai.Client") as mock_client_class:
        mock_client_class.return_value.models = Mock()
        mock_client_class.return_value.models.generate_content.return_value = Mock(
            text="Mocked response from Gemini"
        )
        yield mock_client_class


@pytest.fixture
def gemini_service_instance(mock_genai_client):
    return GeminiService(model_name="models/gemini-1.5-flash", api_key="dummy_api_key")


def test_gemini_service_generate(gemini_service_instance):
    prompt = "Hello, world!"
    response = gemini_service_instance.generate_text(prompt)
    assert response == "Mocked response from Gemini"
    # gemini_service_instance.client.models.generate_content.assert_called_once_with(
    #     prompt
    # )
