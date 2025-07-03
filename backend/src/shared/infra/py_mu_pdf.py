import fitz  # type: ignore

from src.shared.services.pdf import PDFInterfaceAdapter


class PyMuPDFService(PDFInterfaceAdapter):
    def __init__(self):
        pass

    def extract_text_from_pdf(self, binary_content: bytes) -> str:
        text = ""
        with fitz.open(stream=binary_content, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text() + "\n"  # type: ignore
        return text.strip()  # type: ignore
