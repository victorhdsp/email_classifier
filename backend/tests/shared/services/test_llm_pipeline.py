from dotenv import load_dotenv

from src.shared.infra.gemini_llm import GeminiService

load_dotenv()

gemini_service = GeminiService(model_name="models/gemini-1.5-flash")


# def test_generate_text():
#     prompt = "What is the capital of France?"

#     response = gemini_service.generate_text(prompt)

#     assert response is not "", (
#         f"Expected: {response} to be non-empty, but it was empty."
#     )
