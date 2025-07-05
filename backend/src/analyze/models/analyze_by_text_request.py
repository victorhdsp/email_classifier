from pydantic import BaseModel


class AnalyzeByTextRequest(BaseModel):
    text: str
