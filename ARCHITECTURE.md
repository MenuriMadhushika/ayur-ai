# AyurAI architecture

```text
React/Vite :5173
    |
    | JSON and multipart/form-data, JWT authentication
    v
Spring Boot :8081 ----------------> MySQL :3306
    |
    | POST /predict, multipart field "image"
    v
FastAPI :8000 --------------------> models/best_model.pt
```

## Responsibilities

The React frontend provides registration, login, Skin Scan, scan history, Dosha Test, Overall Result, Profile, Home Remedies, and Admin screens. Its API URL defaults to `http://localhost:8081/api`.

Spring Boot owns authentication, authorization, validation, persistence, scan rate limiting, model-service communication, and safe error responses. It stores prediction metadata but not uploaded image bytes.

FastAPI loads the TorchScript model once, validates and preprocesses images, and returns class probabilities. A maximum probability below 0.60 produces an Uncertain result.

MySQL stores users, skin scans, Dosha assessments, overall results, and general home-remedy records.

## Scan sequence

1. React sends the authenticated image to Spring Boot.
2. Spring verifies ownership and rate limits.
3. Spring forwards the image to FastAPI.
4. FastAPI runs `best_model.pt`.
5. Spring stores the educational estimate.
6. React displays the result, disclaimer, and history.
