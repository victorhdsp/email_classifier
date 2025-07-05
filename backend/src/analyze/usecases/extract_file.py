import os

from fastapi import HTTPException, UploadFile

from src.shared.services.pdf import PDFService


class ExtractFileUseCase:
    def __init__(self, pdf_service: PDFService):
        self.pdf = pdf_service
        pass

    def parse_text(self, file: bytes) -> str:
        return file.decode("utf-8", errors="ignore")

    def parse_pdf(self, file: bytes) -> str:
        return self.pdf.extract_text(file)  # type: ignore

    def protect(self, file: UploadFile) -> None:
        if not file.filename:
            raise HTTPException(status_code=400, detail="File name is required")

        if not file.size:
            raise HTTPException(status_code=400, detail="File size is not available")

        if file.size > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400, detail="File size exceeds the 10 MB limit"
            )

        if file.size < 1:
            raise HTTPException(
                status_code=400, detail="File size must be greater than 0 bytes"
            )

        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in {".txt", ".pdf"}:
            raise HTTPException(
                status_code=400, detail=f"File extension {ext} not allowed"
            )

        if file.content_type not in ("text/plain", "application/pdf"):
            raise HTTPException(
                status_code=400, detail=f"Unsupported content type: {file.content_type}"
            )

    async def execute(self, file: UploadFile) -> str:
        self.protect(file)
        binary_content = await file.read()

        if file.content_type == "application/pdf":
            return self.parse_pdf(binary_content)
        else:
            return self.parse_text(binary_content)
