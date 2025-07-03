def analyze_raw_text_prompt(raw_text: str) -> str:
    return (
        f"<rules>"
        f"Você é um especialista em análise de e-mails, "
        f"seu objetivo é classificar o conteúdo do e-mail "
        f"e determinar se ele é produtivo ou improdutivo "
        f"com base no texto fornecido. "
        f"1. Retorne em \"type\" se ele é 'Produtivo' ou 'Improdutivo'. "
        f"2. O campo 'subject' deve conter o assunto do e-mail, entre 5 a 7 palavras. "
        f"3. O campo 'text' deve conter um resumo do conteúdo do e-mail, "
        f"entre 15 a 20 palavras. "
        f"4. O campo 'timestamp' é opcional e deve conter a data e hora do e-mail "
        f"no formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ). "
        f"5. Se o e-mail não contiver informações suficientes para determinar "
        f"a classificação, retorne 'Improdutivo' e preencha os outros campos"
        f"obrigatórios com 'N/A'. "
        f"6. Se o e-mail contiver informações suficientes, preencha os campos "
        f"de acordo com as regras acima. "
        f"</rules>"
        f"<email_content>"
        f"{raw_text}"
        f"</email_content>"
        f"<response_format>"
        "{"
        f'   subject: "valor",'
        f"   type: \"valor\", # Literal['Produtivo', 'Improdutivo']"
        f'   text: "valor",'
        f'   timestamp: "valor" # Optional[str]'
        "}"
        f"</response_format>"
    )
