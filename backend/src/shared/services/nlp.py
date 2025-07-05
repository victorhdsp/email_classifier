from dataclasses import dataclass
from typing import Protocol


@dataclass
class Token:
    text: str
    lemma: str
    is_alpha: bool
    is_stop: bool


class NLPInterfaceAdapter(Protocol):
    def extract_token(self, text: str) -> list[Token]: ...
    def to_lowercase(self, text: str) -> str: ...
    def remove_invalid_chars(self, text: str) -> str: ...
    def remove_accents_and_special_chars(self, text: str) -> str: ...
    def extract_and_strip_headers(self, text: str) -> tuple[str, str]: ...


class NLPService:
    def __init__(self, nlp_adapter: NLPInterfaceAdapter):
        self.nlp_adapter = nlp_adapter

    def pipeline(self, text: str) -> str:
        headers, text = self.nlp_adapter.extract_and_strip_headers(text)
        text = self.nlp_adapter.to_lowercase(text)
        text = self.nlp_adapter.remove_invalid_chars(text)
        text = self.nlp_adapter.remove_accents_and_special_chars(text)
        tokens = self.nlp_adapter.extract_token(text)

        filtered_tokens = [
            token.lemma for token in tokens if token.is_alpha and not token.is_stop
        ]

        return " ".join(filtered_tokens)
