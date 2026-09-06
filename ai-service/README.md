# AyurAI AI service

FastAPI service for the exported TorchScript `best_model.pt` model.

## Run locally

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:8000/health` to confirm the model is ready.

The service accepts a multipart field named `image` at `POST /predict`.
Supported formats are JPG, PNG, and WebP, with a maximum size of 5 MB.

