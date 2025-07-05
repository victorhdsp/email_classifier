import os

from dotenv import load_dotenv

from src.analyze.controllers.analyze_by_file import AnalyzeByFileController
from src.analyze.controllers.analyze_by_text import AnalyzeByTextController
from src.analyze.usecases.analize_raw_text import AnalyzeRawTextUseCase
from src.analyze.usecases.extract_file import ExtractFileUseCase
from src.semantic_cache.service import SemanticCacheService
from src.shared.infra.database import Database
from src.shared.infra.gemini_llm import GeminiService
from src.shared.infra.hugging_llm import HuggingFaceService
from src.shared.infra.py_mu_pdf import PyMuPDFService
from src.shared.infra.spacy_npl import SpacyNLPAdapter
from src.shared.services.llm import LLMService
from src.shared.services.nlp import NLPService
from src.shared.services.pdf import PDFService

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
HUGGING_API_KEY = os.getenv("HUGGING_API_KEY")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in the environment variables")
if not HUGGING_API_KEY:
    raise ValueError("HUGGING_API_KEY is not set in the environment variables") 
    
# General
hugging_llm = HuggingFaceService(token=HUGGING_API_KEY)
gemini_llm = GeminiService(token=GEMINI_API_KEY)
spacy_nlp_adapter = SpacyNLPAdapter()
py_mupdf_service = PyMuPDFService()

llm_service = LLMService(gemini_llm, hugging_llm)
nlp_service = NLPService(spacy_nlp_adapter)
pdf_service = PDFService(py_mupdf_service)

# Database
db = Database(DATABASE_URL)
db_session = next(db.get_db())
semantic_cache_service = SemanticCacheService(db_session)

## Email Analysis
analyze_raw_text_use_case = AnalyzeRawTextUseCase(
    nlp_service, llm_service, semantic_cache_service
)
extract_file_use_case = ExtractFileUseCase(pdf_service)

### Analysis by Text
analyze_by_text_controller = AnalyzeByTextController(analyze_raw_text_use_case)

### Analysis by File
analyze_by_file_controller = AnalyzeByFileController(
    analyze_raw_text_use_case, extract_file_use_case
)
