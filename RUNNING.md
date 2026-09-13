# Running AyurAI

For Docker, copy `.env.example` to `.env`, replace both secrets, and run `docker compose up --build`. Open `http://localhost:5173`.

For development, start FastAPI on port 8000, Spring Boot on 8081, and Vite on 5173. The scan image is processed in memory and is not stored. The acne-severity estimate is educational and is not a medical diagnosis or treatment plan.
