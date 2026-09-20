# AyurAI

AyurAI is a full-stack educational skincare and wellness application created as an internship major project. It combines an AI-assisted acne-severity scan with a separate Ayurvedic Dosha questionnaire and a library of optional wellness ideas.

> **Medical notice:** AyurAI does not diagnose, treat, or prevent medical conditions. Users should consult a qualified healthcare professional about painful, persistent, changing, or worrying symptoms.

## Project overview

AyurAI provides two independent assessments:

1. **AI Skin Scan** — accepts a clear facial photograph and estimates an acne-like severity category.
2. **Dosha Test** — uses questionnaire answers to calculate an educational Vata, Pitta, or Kapha wellness pattern.

Both results appear in one profile for convenience, but the application does not claim that they are medically correlated. Wellness ideas are associated with the Dosha questionnaire, not with the acne model.

## Main features

- User registration, login, profile editing, and logout
- Password hashing and protected backend routes
- Account-specific assessment results and history
- Image selection, preview, replacement, validation, and consent flow
- AI prediction with confidence-threshold and uncertain-result handling
- Four acne-like severity outputs: Mild, Moderate, Severe, and Very Severe
- Dosha questionnaire with Vata, Pitta, and Kapha percentages
- Clearly separated Skin Scan and Dosha results
- Searchable optional wellness-remedy library
- Administrator dashboard for users, statistics, and remedies
- Responsive desktop and mobile interface
- Docker deployment configuration

## System architecture

```text
React + Vite frontend        http://localhost:5173
          |
          | REST API
          v
Spring Boot backend          http://localhost:8081/api
       |             |
       | JPA         | multipart image request
       v             v
MySQL database       FastAPI model service
ayurai_db             http://127.0.0.1:8000
                            |
                            v
                     best_model.pt
```

The browser sends the photograph to Spring Boot. Spring Boot forwards it to FastAPI and returns the prediction response. Photographs are processed for inference and are not intended to be permanently stored.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, CSS |
| Backend | Java 17, Spring Boot, Spring MVC, Spring Data JPA, Spring Security |
| Database | MySQL 8 |
| AI service | Python, FastAPI, PyTorch, Torchvision, Pillow |
| Model | MobileNetV3-based four-class classifier exported as TorchScript |
| Quality | Oxlint, Vite production build, Maven tests |
| Deployment | Docker, Nginx, Docker Compose |

## Repository structure

```text
ayurai-frontend/
├── public/                         Static assets
├── src/
│   ├── assets/                     Images
│   ├── components/                 Reusable UI components
│   ├── pages/                      Application pages
│   ├── service/                    Authentication and user services
│   ├── utils/                      API, session, and assessment helpers
│   ├── App.jsx                     Routes and route protection
│   └── main.jsx                    React entry point
├── backend/ayurai-backend/         Spring Boot service
├── .env.example                    Frontend environment example
├── Dockerfile                      Frontend container
├── nginx.conf                      Production server configuration
└── package.json                    Frontend scripts and dependencies

../ai-service/
├── app.py                          FastAPI inference service
├── requirements.txt                Python dependencies
├── models/best_model.pt            Exported TorchScript model
└── evidence/                       Training notebook and evidence
```

## Prerequisites

- Node.js 20 or newer
- Java Development Kit 17
- Python 3.10 or newer
- MySQL 8
- Git

## Running locally

The system requires MySQL and three application services. Run each service in a separate PowerShell window.

### 1. Prepare MySQL

```sql
CREATE DATABASE ayurai_db;
```

Configure the local datasource in:

```text
backend/ayurai-backend/src/main/resources/application.properties
```

Do not commit production passwords. Use environment variables or a local configuration file excluded by Git.

### 2. Start FastAPI

```powershell
cd C:\Users\User\OneDrive\Desktop\Ayur_AI\ai-service

py -m venv .venv-codex
.venv-codex\Scripts\Activate.ps1
pip install -r requirements.txt

uvicorn app:app --host 127.0.0.1 --port 8000
```

Verify the model service at [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health). The response should report `"status": "ready"`.

### 3. Start Spring Boot

```powershell
cd C:\Users\User\OneDrive\Desktop\Ayur_AI\ayurai-frontend\backend\ayurai-backend
.\mvnw.cmd spring-boot:run
```

The backend runs at `http://localhost:8081`.

### 4. Start React

```powershell
cd C:\Users\User\OneDrive\Desktop\Ayur_AI\ayurai-frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment configuration

Create `.env` from `.env.example` when a different backend address is required:

```env
VITE_API_BASE_URL=http://localhost:8081/api
```

Never commit production database passwords, JWT secrets, API keys, or private credentials.

## Running with Docker Compose

The parent `Ayur_AI` directory contains `docker-compose.yml` for MySQL, FastAPI, Spring Boot, and React.

Create a local `.env` beside the Compose file:

```env
DB_PASSWORD=replace_with_a_strong_password
JWT_SECRET=replace_with_a_long_random_secret
```

Start the complete stack:

```powershell
cd C:\Users\User\OneDrive\Desktop\Ayur_AI
docker compose up --build
```

Do not commit the `.env` file.

## Quality checks

Frontend:

```powershell
npm run lint
npm run build
```

Spring Boot:

```powershell
cd backend\ayurai-backend
.\mvnw.cmd test
```

FastAPI health:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

## Interview demonstration flow

1. Register a new user.
2. Log in and open the Skin Scan.
3. Select a valid image and demonstrate the **Change** button.
4. Confirm educational-use consent and analyze the image.
5. Explain the estimated class, model score, and uncertainty threshold.
6. Complete the separate Dosha Test.
7. Review both independent results.
8. Explore optional wellness ideas.
9. Open the profile and show account-specific history.
10. Demonstrate the administrator dashboard with an administrator account.

## Model information

FastAPI loads `models/best_model.pt` as a TorchScript model. Inference preprocessing includes:

- Resize to 256 pixels
- Center crop to 224 × 224 pixels
- Convert to a tensor
- Normalize using the ImageNet mean and standard deviation

The service accepts JPG, PNG, and WebP files up to 5 MB. It returns a severity estimate when the highest class probability reaches the configured threshold of 0.60. Lower-confidence predictions return an uncertain result.

## Privacy and security decisions

- Passwords are hashed with BCrypt.
- Protected requests include the saved authentication token.
- Assessment status is scoped to the current user account.
- The frontend validates image type and size before submission.
- FastAPI verifies the content type and actual image format.
- Images are used for inference and are not intended to be stored permanently.
- Administrator pages are separated from ordinary user routes.
- Medical and educational-use disclaimers are visible in the interface.

## Current limitations

- The model estimates acne-like severity only; it does not diagnose acne or other conditions.
- The four outputs do not include a clear-skin or no-acne class.
- A confidence score represents model certainty, not medical certainty.
- More evaluation is needed across skin tones, cameras, lighting, and age groups before real-world use.
- File validation exists, but there is no fully trained face-quality or non-face rejection model.
- Dosha results are questionnaire-based educational content independent from the AI prediction.
- Home remedies are optional wellness information, not treatments.

## Future improvements

- Add face detection and image-quality validation
- Add a clear-skin/no-acne class using a suitable licensed dataset
- Expand fairness and subgroup evaluation
- Add automated frontend and API integration tests
- Add password reset and email verification
- Adopt standards-based token authentication
- Deploy with managed secrets, HTTPS, monitoring, and backups

## Project status

The core user journey, model integration, account-specific results, administrator interface, responsive UI, and deployment configuration are implemented. Remaining work is final end-to-end testing, deployment hardening, and interview preparation.

## Author

**Menuri Madhushika**

Internship major project — AyurAI
