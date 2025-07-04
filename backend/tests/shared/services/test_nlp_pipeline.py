import pytest

from src.shared.infra.spacy_npl import SpacyNLPAdapter
from src.shared.services.nlp import NLPService


@pytest.fixture
def spacy_nlp_adapter():
    return SpacyNLPAdapter(nlp_model="pt_core_news_sm")


@pytest.fixture
def nlp_service(spacy_nlp_adapter):
    return NLPService(spacy_nlp_adapter)


def test_lowercase(spacy_nlp_adapter) -> None:
    assert spacy_nlp_adapter.to_lowercase("PENSAR") == "pensar"


def test_remove_stopwords(spacy_nlp_adapter) -> None:
    extracted = spacy_nlp_adapter.extract_token("isso é um teste")
    result = " ".join(token.lemma for token in extracted if not token.is_stop)
    assert result == "teste"


def test_lemmatize(spacy_nlp_adapter) -> None:
    extracted = spacy_nlp_adapter.extract_token("pensando")
    result = " ".join(token.lemma for token in extracted)
    assert result == "pensar"


def test_remove_invalid_chars(spacy_nlp_adapter) -> None:
    input_text = "Texto com \x00 caracteres \x01 inválidos\x02."
    expected_output = "Texto com  caracteres  inválidos."
    assert spacy_nlp_adapter.remove_invalid_chars(input_text) == expected_output


def test_remove_accents_and_special_chars(spacy_nlp_adapter) -> None:
    input_text = "Olá! Teste com acentuação, ç, e caracteres especiais: @#$%^&*()"
    expected_output = "Ola Teste com acentuaçao ç e caracteres especiais "
    assert (
        spacy_nlp_adapter.remove_accents_and_special_chars(input_text)
        == expected_output
    )


def test_remove_unnecessary_headers(spacy_nlp_adapter) -> None:
    input_text = (
        "From: test@example.com\n"
        + "Subject: Test Subject\n"
        + "Date: Mon, 01 Jan 2023 10:00:00 +0000\n"
        + "\n"
        + "Body of the email."
    )
    expected_output = "Body of the email."
    headers, body = spacy_nlp_adapter.extract_and_strip_headers(input_text)
    assert body == expected_output


def test_pipeline_full(nlp_service) -> None:
    input_text = "Olá! Isso é um TESTE, com acentuação e espaços    maiores. \nFrom: test@example.com\nSubject: Test Subject\n\nBody of the email."
    expected_output = "ola teste acentuaçao espaço grande body of the email"
    assert nlp_service.pipeline(input_text) == expected_output
