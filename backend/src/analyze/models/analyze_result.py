from dataclasses import dataclass
from typing import Literal, Optional


@dataclass
class AnalyzeResult:
    subject: str
    type: Literal["Produtivo", "Improdutivo"]
    text: str
    id: Optional[str] = None
    timestamp: Optional[str] = None
