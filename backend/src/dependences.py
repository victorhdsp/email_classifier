from dotenv import load_dotenv

from src.email_analysis.by_file.controller import AnalyzeByFileController
from src.email_analysis.by_text.controller import AnalyzeByTextController
from src.email_analysis.shared.usecases.analize_raw_text import AnalyzeRawTextUseCase
from src.email_analysis.shared.usecases.extract_file import ExtractFileUseCase
from src.shared.infra.database.database import get_db
from src.shared.infra.gemini_llm import GeminiService
from src.shared.infra.hugging_llm import HuggingFaceService
from src.shared.infra.py_mu_pdf import PyMuPDFService
from src.shared.infra.spacy_npl import SpacyNLPAdapter
from src.shared.services.llm import LLMService
from src.shared.services.nlp import NLPService
from src.shared.services.pdf import PDFService
from src.shared.services.semantic_cache_service import SemanticCacheService

load_dotenv()

# General
hugging_llm = HuggingFaceService()
gemini_llm = GeminiService()
spacy_nlp_adapter = SpacyNLPAdapter()
py_mupdf_service = PyMuPDFService()

llm_service = LLMService(gemini_llm, hugging_llm)
nlp_service = NLPService(spacy_nlp_adapter)
pdf_service = PDFService(py_mupdf_service)

# Database
db_session = next(get_db())
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
