from google import genai
from google.genai import types

from src.shared.services.llm import LLMAdapter
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)


class GeminiService(LLMAdapter):
    def __init__(self, token: str, model_name: str = "gemini-1.5-flash"):
        self.client = genai.Client(api_key=token)
        self.model_name = model_name
        logger.info(f"GeminiService initialized with model: {model_name}")

    def generate_text(self, prompt: str) -> str:
        logger.info("Generating text using Gemini LLM.")
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.2, top_k=1, top_p=0.1),
            )
            if not response or not response.text:
                logger.error("Gemini LLM returned no response or empty text.")
                raise Exception("Failed to generate response from Gemini LLM.")
            logger.info("Text generated successfully from Gemini LLM.")
            return response.text
        except Exception as e:
            logger.error(f"Error during Gemini LLM request: {e}")
            raise
