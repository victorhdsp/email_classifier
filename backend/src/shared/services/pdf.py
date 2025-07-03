from typing import Protocol


class PDFInterfaceAdapter(Protocol):
    def extract_text_from_pdf(self, binary_content: bytes) -> str: ...


class PDFService:
    def __init__(self, pdf_adapter: PDFInterfaceAdapter):
        self.pdf_adapter = pdf_adapter

    def extract_text(self, binary_content: bytes) -> str:
        return self.pdf_adapter.extract_text_from_pdf(binary_content)
