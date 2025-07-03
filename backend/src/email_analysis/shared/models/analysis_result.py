from dataclasses import dataclass
from typing import Literal, Optional


@dataclass
class AnalysisResult:
    subject: str
    type: Literal["Produtivo", "Improdutivo"]
    text: str
    timestamp: Optional[str] = None
