from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    detail: str = Field(..., example="Mensagem de erro detalhada.")
