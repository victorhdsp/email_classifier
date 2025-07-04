import re
import unicodedata
from os import path

import spacy

from src.shared.services.nlp import NLPInterfaceAdapter, Token
from src.shared.utils.path import get_project_root


class SpacyNLPAdapter(NLPInterfaceAdapter):
    def __init__(self, nlp_model: str = "pt_core_news_sm"):
        self.nlp = spacy.load(
            path.join(f"{get_project_root()}/spacy_models/{nlp_model}")
        )

    def extract_token(self, text: str) -> list[Token]:
        doc = self.nlp(text)
        return [
            Token(token.text, token.lemma_, token.is_alpha, token.is_stop)
            for token in doc
        ]

    def to_lowercase(self, text: str) -> str:
        return text.lower()

    def remove_invalid_chars(self, text: str) -> str:
        return re.sub(r"[\x00-\x1F\x7F]", "", text)

    def remove_accents_and_special_chars(self, text: str) -> str:
        def strip_accents(char):
            if char in ["ç", "Ç", "ñ", "Ñ"]:
                return char
            decomposed = unicodedata.normalize("NFD", char)
            return "".join(c for c in decomposed if unicodedata.category(c) != "Mn")

        text = "".join(strip_accents(c) for c in text)
        return re.sub(r"[^a-zA-Z0-9çÇñÑ\s]", "", text)

    def extract_and_strip_headers(self, text: str) -> tuple[str, str]:
        header_regex = re.compile(
            r"^(From|To|Subject|Date|MIME-Version|Content-Type):.*$", re.MULTILINE
        )
        headers = header_regex.findall(text)
        cleaned_text = header_regex.sub("", text)
        return "\n".join(headers), cleaned_text.strip()
