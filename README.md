# AyurAI

AyurAI is an educational full-stack application that estimates acne-like severity from a face photo and presents a separate Ayurvedic Dosha wellness questionnaire. It does not diagnose or treat medical conditions.

## Components

- React and Vite frontend (`/`)
- Spring Boot REST API (`backend/ayurai-backend`)
- FastAPI and TorchScript inference service (`ai-service`)
- MySQL persistence

The AI model supports Mild, Moderate, Severe, and Very Severe acne-like categories. Predictions below the confidence threshold are reported as Uncertain. Dosha results and home-remedy content are separate wellness features and do not affect the model prediction.

## Documentation

- [Architecture](ARCHITECTURE.md)
- [Running locally](RUNNING.md)
- [Testing report](TESTING.md)
- [Project status and limitations](PROJECT_REPORT.md)

## Safety and privacy

Uploaded images are validated, processed in memory, and are not stored by the application. Authentication uses JWTs and BCrypt password hashes. The API enforces ownership checks, upload limits, role checks, and scan rate limiting.
