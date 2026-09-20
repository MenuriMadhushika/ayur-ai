# Running AyurAI

## Prerequisites

- Node.js 22+
- Python 3.12+
- Java 17
- MySQL 8 with an `ayurai_db` database

## 1. AI service — port 8000

```powershell
cd ai-service
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000
```

Verify `http://127.0.0.1:8000/health` reports `ready`.

## 2. Spring Boot — port 8081

```powershell
cd backend\ayurai-backend
$env:DB_URL="jdbc:mysql://localhost:3306/ayurai_db"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-local-mysql-password"
$env:JWT_SECRET="use-at-least-32-random-characters"
$env:SKIN_MODEL_URL="http://127.0.0.1:8000"
.\mvnw.cmd spring-boot:run
```

## 3. React — port 5173

From the repository root:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`.

## Docker

Copy `.env.example` to `.env`, replace the database and JWT placeholders, then run `docker compose up --build`. Compose starts MySQL, FastAPI, Spring Boot, and the Nginx frontend.

Images are processed in memory and are not stored. The acne-severity estimate is educational and is not a diagnosis or treatment plan.
