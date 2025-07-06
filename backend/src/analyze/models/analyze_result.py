from typing import Literal, Optional

from pydantic import BaseModel, Field


class AnalyzeFullResult(BaseModel):
    subject: str = Field(..., example="Reunião de Alinhamento Semanal")
    type: Literal["Produtivo", "Improdutivo"] = Field(..., example="Produtivo")
    text: str = Field(..., example="Olá equipe, nossa reunião semanal de alinhamento será na sexta-feira às 10h.")
    id: str = Field(..., example="a1b2c3d4-e5f6-7890-1234-567890abcdef")
    timestamp: Optional[str] = Field(None, example="2025-07-06T10:30:00Z")

    class Config:
        from_attributes = True


class AnalyzeLoadingResult(BaseModel):
    text: str = Field(..., example="Analisando o texto do e-mail...")
    id: str = Field(..., example="a1b2c3d4-e5f6-7890-1234-567890abcdef")
    timestamp: Optional[str] = Field(None, example="2025-07-06T10:29:00Z")

    class Config:
        from_attributes = True
