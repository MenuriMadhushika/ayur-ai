from __future__ import annotations

import io
from contextlib import asynccontextmanager
from pathlib import Path

import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from torchvision import transforms

MODEL_PATH = Path(__file__).parent / "models" / "best_model.pt"
CLASS_NAMES = ["Mild", "Moderate", "Severe", "Very Severe"]
CONFIDENCE_THRESHOLD = 0.60
MAX_UPLOAD_BYTES = 5 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}

preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])

model: torch.jit.ScriptModule | None = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    global model
    if not MODEL_PATH.is_file():
        raise RuntimeError(f"Model not found: {MODEL_PATH}")
    model = torch.jit.load(str(MODEL_PATH), map_location="cpu")
    model.eval()
    yield
    model = None


app = FastAPI(
    title="AyurAI Acne Severity Service",
    version="1.0.0",
    description="Educational, non-diagnostic acne-like severity estimation.",
    lifespan=lifespan,
)


@app.get("/health")
def health():
    return {
        "status": "ready" if model is not None else "starting",
        "model": "best_model.pt",
        "classes": CLASS_NAMES,
        "confidenceThreshold": CONFIDENCE_THRESHOLD,
    }


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not ready")
    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=415, detail="Upload a JPG, PNG, or WebP image")

    payload = await image.read(MAX_UPLOAD_BYTES + 1)
    if not payload:
        raise HTTPException(status_code=400, detail="The uploaded image is empty")
    if len(payload) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image must be 5 MB or smaller")

    try:
        with Image.open(io.BytesIO(payload)) as checked:
            if checked.format not in ALLOWED_FORMATS:
                raise HTTPException(status_code=415, detail="Unsupported image format")
            checked.verify()
        photo = Image.open(io.BytesIO(payload)).convert("RGB")
    except UnidentifiedImageError as error:
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image") from error

    with torch.inference_mode():
        logits = model(preprocess(photo).unsqueeze(0))
        probabilities = torch.softmax(logits, dim=1)[0]

    score, index = probabilities.max(dim=0)
    score_value = float(score.item())
    scores = {
        name: round(float(value.item()), 4)
        for name, value in zip(CLASS_NAMES, probabilities)
    }

    if score_value < CONFIDENCE_THRESHOLD:
        return {
            "status": "uncertain",
            "estimatedCategory": None,
            "modelScore": round(score_value, 4),
            "probabilities": scores,
            "message": "The model could not produce a reliable result. Try another clear photo.",
            "disclaimer": "This educational result is not a medical diagnosis.",
            "modelVersion": "acne-mobilenetv3-baseline-v1",
        }

    category = CLASS_NAMES[int(index.item())]
    return {
        "status": "estimated",
        "estimatedCategory": category,
        "modelScore": round(score_value, 4),
        "probabilities": scores,
        "message": f"The model detected an acne-like appearance with an estimated {category.lower()} severity.",
        "disclaimer": "This educational result is not a medical diagnosis.",
        "modelVersion": "acne-mobilenetv3-baseline-v1",
    }

