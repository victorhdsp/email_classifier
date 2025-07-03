from google import genai
from google.genai import types

from src.shared.services.llm import LLMAdapter


class GeminiService(LLMAdapter):
    def __init__(self, model_name: str = "gemini-1.5-flash", api_key: str = None):
        self.client = genai.Client(api_key=api_key)
        self.model_name = model_name

    def generate_text(self, prompt: str) -> str:
        response = self.client.models.generate_content(  # type: ignore
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0.2, top_k=1, top_p=0.1),
        )
        if not response or not response.text:
            raise Exception("Failed to generate response from Gemini LLM.")

        return response.text
