import os

from fastapi import HTTPException, UploadFile

from src.shared.services.pdf import PDFService
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)


class ExtractFileUseCase:
    def __init__(self, pdf_service: PDFService):
        self.pdf = pdf_service
        logger.info("ExtractFileUseCase initialized.")

    def parse_text(self, file: bytes) -> str:
        logger.info("Parsing text file.")
        return file.decode("utf-8", errors="ignore")

    def parse_pdf(self, file: bytes) -> str:
        logger.info("Parsing PDF file.")
        return self.pdf.extract_text(file)  # type: ignore

    def protect(self, file: UploadFile) -> None:
        logger.info(f"Protecting file: {file.filename}")
        if not file.filename:
            logger.error("File name is missing.")
            raise HTTPException(status_code=400, detail="File name is required")

        if not file.size:
            logger.error("File size is not available.")
            raise HTTPException(status_code=400, detail="File size is not available")

        if file.size > 10 * 1024 * 1024:
            logger.error(f"File size {file.size} exceeds the 10 MB limit.")
            raise HTTPException(
                status_code=400, detail="File size exceeds the 10 MB limit"
            )

        if file.size < 1:
            logger.error("File size is 0 bytes.")
            raise HTTPException(
                status_code=400, detail="File size must be greater than 0 bytes"
            )

        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in {".txt", ".pdf"}:
            logger.error(f"File extension {ext} not allowed for file {file.filename}.")
            raise HTTPException(
                status_code=400, detail=f"File extension {ext} not allowed"
            )

        if file.content_type not in ("text/plain", "application/pdf"):
            logger.error(f"Unsupported content type: {file.content_type} for file {file.filename}.")
            raise HTTPException(
                status_code=400, detail=f"Unsupported content type: {file.content_type}"
            )
        logger.info(f"File {file.filename} protection checks passed.")

    async def execute(self, file: UploadFile) -> str:
        logger.info(f"Executing ExtractFileUseCase for file: {file.filename}")
        try:
            self.protect(file)
            binary_content = await file.read()

            if file.content_type == "application/pdf":
                extracted_text = self.parse_pdf(binary_content)
            else:
                extracted_text = self.parse_text(binary_content)
            logger.info(f"Successfully extracted text from file: {file.filename}")
            return extracted_text
        except HTTPException as e:
            logger.error(f"HTTPException during file extraction: {e.detail}")
            raise e
        except Exception as e:
            logger.error(f"Unexpected error during file extraction: {e}")
            raise HTTPException(status_code=500, detail="Erro interno ao processar o arquivo.")
