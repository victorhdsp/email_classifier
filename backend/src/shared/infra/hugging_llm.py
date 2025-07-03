import requests

from src.shared.services.llm import LLMAdapter


class HuggingFaceService(LLMAdapter):
    def __init__(self, model_name: str = "mistral-7b", token: str = None):
        self.api_url = f"https://api-inference.huggingface.co/models/{model_name}"
        self.headers = {"Authorization": f"Bearer {token}"} if token else {}

    def generate_text(self, prompt: str) -> str:
        payload = {
            "inputs": prompt,
            "parameters": {"max_new_tokens": 100, "temperature": 0.2},
            "options": {"wait_for_model": True},
        }
        response = requests.post(self.api_url, headers=self.headers, json=payload)
        response.raise_for_status()
        output = response.json()

        if isinstance(output, list) and "generated_text" in output[0]:
            return output[0]["generated_text"]
        else:
            return str(output)
