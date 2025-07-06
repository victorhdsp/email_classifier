from pydantic import BaseModel, Field


class AnalyzeByTextRequest(BaseModel):
    text: str = Field(..., example="Olá, gostaria de marcar uma reunião para discutir o projeto na próxima semana.")
