# Email Classifier

O objetivo é automatizar a leitura e classificação desses emails e sugerir classificações e respostas automáticas de acordo com o teor de cada email recebido, liberando tempo da equipe para que não seja mais necessário ter uma pessoa fazendo esse trabalho manualmente.

## Versões

* **Node.js:** v20.15.1
* **Python:** 3.9

## Rodando Localmente

### Individualmente

**Backend:**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

### Com Docker Compose

```bash
docker-compose up --build
```

- O frontend estara na url: http://127.0.0.1:5173.

- O backend estara na url: http://127.0.0.1:8000.