from pydantic import BaseModel


class EmailAnalysisByTextRequest(BaseModel):
    text: str
