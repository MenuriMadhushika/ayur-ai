# Testing report

## Automated checks

| Check | Result | Evidence |
|---|---|---|
| Frontend production build | Pass | Vite built 56 modules successfully |
| Frontend lint | Pass | Oxlint returned exit code 0 |
| FastAPI syntax compilation | Pass | `python -m py_compile app.py` returned exit code 0 |
| Spring Boot main compilation | Pass | Maven compile returned exit code 0 |
| Complete Maven test phase on this PC | Environment blocked | Oracle JDK 24 raises `AccessDeniedException` while closing dependency ZIP files; the project targets Java 17 |

## End-to-end journey

Executed on 2026-09-14 against MySQL 8.4, Spring Boot on port 8081, and FastAPI on port 8000.

| Step | Result |
|---|---|
| Register test user and log in | Pass |
| Submit authenticated JPEG scan | Pass |
| Run TorchScript prediction | Pass |
| Persist and retrieve scan history | Pass |
| Submit eight Dosha answers | Pass |
| Create Overall Result | Pass |
| Retrieve profile and remedies | Pass |
| Serve `/` and `/skin-scan` through Vite | Pass (HTTP 200) |

The non-face transport fixture produced a Very Severe estimate. This confirms transport and inference, not clinical validity.

## Responsive audit

Every major stylesheet contains responsive media queries. The automated visual browser helper was unavailable during final QA, so manual checks at 375 px, 768 px, and 1440 px remain recommended before presentation.

## Final Java test

Select JDK 17 and run:

```powershell
java -version
cd backend\ayurai-backend
.\mvnw.cmd test
```
