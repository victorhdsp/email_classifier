import requests

from src.shared.services.llm import LLMAdapter
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)


class HuggingFaceService(LLMAdapter):
    def __init__(self, token: str, model_name: str = "mistral-7b"):
        self.api_url = f"https://api-inference.huggingface.co/models/{model_name}"
        self.headers = {"Authorization": f"Bearer {token}"} if token else {}
        logger.info(f"HuggingFaceService initialized with model: {model_name}")

    def generate_text(self, prompt: str) -> str:
        logger.info("Generating text using HuggingFace LLM.")
        payload = {
            "inputs": prompt,
            "parameters": {"max_new_tokens": 100, "temperature": 0.2},
            "options": {"wait_for_model": True},
        }
        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload)
            response.raise_for_status()
            output = response.json()

            if isinstance(output, list) and "generated_text" in output[0]:
                generated_text = output[0]["generated_text"]
                logger.info("Text generated successfully from HuggingFace LLM.")
                return generated_text
            else:
                logger.warning(f"Unexpected response format from HuggingFace LLM: {output}")
                return str(output)
        except requests.exceptions.RequestException as e:
            logger.error(f"Error during HuggingFace LLM request: {e}")
            raise
        except Exception as e:
            logger.error(f"An unexpected error occurred in HuggingFaceService: {e}")
            raise
