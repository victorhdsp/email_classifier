import time
from abc import ABC


class LLMAdapter(ABC):
    def __init__(self, model_name: str, api_key: str):
        pass

    def generate_text(self, prompt: str) -> str:
        pass


class LLMService:
    def __init__(
        self, primary_llm: LLMAdapter, fallback_llm: LLMAdapter, cooldown_seconds=120
    ):
        self.primary = primary_llm
        self.fallback = fallback_llm
        self.cooldown_until = 0
        self.cooldown_seconds = cooldown_seconds

    def generate(self, prompt: str) -> str:
        now = time.time()
        if now < self.cooldown_until:
            print("Cooldown ativo, usando fallback")
            return self.fallback.generate_text(prompt)

        try:
            return self.primary.generate_text(prompt)
        except Exception as e:
            if "quota" in str(e).lower() or "RESOURCE_EXHAUSTED" in str(e):
                print("Primary LLM quota excedida, ativando cooldown e usando fallback")
                self.cooldown_until = now + self.cooldown_seconds
                return self.fallback.generate_text(prompt)
            raise e
