from unittest.mock import Mock

import pytest
from fastapi import HTTPException

from src.email_analysis.shared.usecases.analize_raw_text import AnalyzeRawTextUseCase
from src.shared.services.llm import LLMService
from src.shared.services.nlp import NLPService


class TestAnalyzeRawTextUseCase:
    @pytest.fixture
    def nlp_service_mock(self):
        return Mock(spec=NLPService)

    @pytest.fixture
    def llm_service_mock(self):
        return Mock(spec=LLMService)

    @pytest.fixture
    def use_case(self, nlp_service_mock, llm_service_mock):
        return AnalyzeRawTextUseCase(nlp_service_mock, llm_service_mock)

    def test_protect_valid_text(self, use_case):
        try:
            use_case.protect("This is a valid text.")
        except HTTPException:
            pytest.fail("protect method raised HTTPException unexpectedly!")

    def test_protect_empty_text(self, use_case):
        with pytest.raises(HTTPException) as exc_info:
            use_case.protect("")
        assert exc_info.value.status_code == 400
        assert "não pode ser vazio" in exc_info.value.detail

    def test_protect_whitespace_only_text(self, use_case):
        with pytest.raises(HTTPException) as exc_info:
            use_case.protect("   \n\t ")
        assert exc_info.value.status_code == 400
        assert "não pode ser vazio" in exc_info.value.detail

    def test_protect_non_string_input(self, use_case):
        with pytest.raises(HTTPException) as exc_info:
            use_case.protect(123)
        assert exc_info.value.status_code == 400
        assert "O texto deve ser uma string." in exc_info.value.detail
