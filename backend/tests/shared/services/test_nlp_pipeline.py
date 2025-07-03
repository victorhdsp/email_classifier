from src.shared.infra.spacy_npl import SpacyNLPAdapter
from src.shared.services.nlp import NLPService

spacy_nlp_adapter = SpacyNLPAdapter(nlp_model="pt_core_news_sm")
nlp_service = NLPService(spacy_nlp_adapter)


def test_lowercase() -> None:
    assert spacy_nlp_adapter.to_lowercase("PENSAR") == "pensar"


def test_remove_stopwords() -> None:
    extracted = spacy_nlp_adapter.extract_token("isso é um teste")
    result = " ".join(token.lemma for token in extracted if not token.is_stop)
    assert result == "teste"


def test_lemmatize() -> None:
    extracted = spacy_nlp_adapter.extract_token("pensando")
    result = " ".join(token.lemma for token in extracted)
    assert result == "pensar"


def test_pipeline_full() -> None:
    input_text = "Olá! Isso é um TESTE, com acentuação e espaços    maiores."
    expected_output = "olá teste acentuação espaço grande"
    assert nlp_service.pipeline(input_text) == expected_output
