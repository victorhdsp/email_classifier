from google import genai

from src.shared.services.llm import LLMAdapter


class GeminiService(LLMAdapter):
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.client = genai.Client()
        self.model_name = model_name

    def generate_text(self, prompt: str) -> str:
        response = self.client.models.generate_content(  # type: ignore
            model=self.model_name, contents=prompt
        )
        if not response or not response.text:
            raise Exception("Failed to generate response from Gemini LLM.")

        return response.text
