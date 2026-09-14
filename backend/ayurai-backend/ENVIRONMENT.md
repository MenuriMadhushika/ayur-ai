# Local environment

Set these variables before starting the Spring Boot backend:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/ayurai_db"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-local-mysql-password"
$env:JWT_SECRET="use-a-long-random-secret-with-at-least-32-characters"
.\mvnw.cmd spring-boot:run
```

Production must use private deployment secrets and must not commit them to Git.
