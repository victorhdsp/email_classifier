from dataclasses import dataclass
from typing import Literal, Optional


@dataclass
class AnalyzeFullResult:
    subject: str
    type: Literal["Produtivo", "Improdutivo"]
    text: str
    id: str
    timestamp: Optional[str] = None

@dataclass
class AnalyzeLoadingResult:
    text: str
    id: str
    timestamp: Optional[str] = None
