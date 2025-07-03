from os import path

from src.shared.infra.py_mu_pdf import PyMuPDFService
from src.shared.services.pdf import PDFService

py_mu_pdf = PyMuPDFService()
pdf_service = PDFService(py_mu_pdf)


def test_pdf() -> None:
    file_path = path.join(path.dirname(__file__), "../../data/test_email.pdf")

    with open(file_path, "rb") as file:
        binary_content = file.read()

    content = pdf_service.extract_text(binary_content)
    assert content.__contains__("AutoU")
    assert content.__contains__("Victor Hugo de Souza Pereira")
    assert content.__contains__("Processo Seletivo")
