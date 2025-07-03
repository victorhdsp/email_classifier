import spacy

from src.shared.services.nlp import NLPInterfaceAdapter, Token


class SpacyNLPAdapter(NLPInterfaceAdapter):
    def __init__(self, nlp_model: str = "pt_core_news_sm"):
        self.nlp = spacy.load(nlp_model)

    def extract_token(self, text: str) -> list[Token]:
        doc = self.nlp(text)
        return [
            Token(token.text, token.lemma_, token.is_alpha, token.is_stop)
            for token in doc
        ]

    def to_lowercase(self, text: str) -> str:
        return text.lower()
