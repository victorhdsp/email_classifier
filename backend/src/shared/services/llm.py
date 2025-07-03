from abc import ABC, abstractmethod


class LLMAdapter(ABC):
    @abstractmethod
    def generate_text(self, prompt: str) -> str:
        pass


class LLMService:
    def __init__(self, llm_adapter: LLMAdapter):
        self.llm_adapter = llm_adapter

    def generate(self, prompt: str) -> str:
        return self.llm_adapter.generate_text(prompt)
