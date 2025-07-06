import os

from dotenv import load_dotenv

from src.analyze.usecases.collect_data import CollectDataUseCase
from src.analyze.usecases.create_data import CreateDataUseCase
from src.analyze.usecases.extract_file import ExtractFileUseCase
from src.analyze.usecases.pre_proccess import PreProccessUseCase
from src.shared.infra.database import Database
from src.shared.infra.gemini_llm import GeminiService
from src.shared.infra.hugging_llm import HuggingFaceService
from src.shared.infra.py_mu_pdf import PyMuPDFService
from src.shared.infra.spacy_npl import SpacyNLPAdapter
from src.shared.services.autentication import AutenticationService
from src.shared.services.llm import LLMService
from src.shared.services.nlp import NLPService
from src.shared.services.pdf import PDFService
from src.shared.services.semantic_cache import SemanticCacheService

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
HUGGING_API_KEY = os.getenv("HUGGING_API_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in the environment variables")
if not HUGGING_API_KEY:
    raise ValueError("HUGGING_API_KEY is not set in the environment variables") 
if not FRONTEND_URL:
    raise ValueError("FRONTEND_URL is not set in the environment variables")
    
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
autentication_service = AutenticationService(db_session)

## Email Analyze
pre_proccess_use_case = PreProccessUseCase(nlp_service)
extract_file_use_case = ExtractFileUseCase(pdf_service)
create_data_use_case = CreateDataUseCase(llm_service, semantic_cache_service)
collect_data_use_case = CollectDataUseCase(semantic_cache_service)
