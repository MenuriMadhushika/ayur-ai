# AyurAI project report

## Status

The implementation is feature-complete for an academic demonstration. Frontend commit `fa17f13` and backend commit `a90f895` were merged into `main` at `c13f22e` and pushed to GitHub.

## Delivered scope

- Account registration, login, JWT authentication, and profile
- Educational AI acne-like severity scan and saved history
- Four trained classes plus an Uncertain confidence outcome
- Separate eight-question Dosha wellness assessment
- Overall display that keeps AI and Dosha semantics separate
- Optional general wellness remedy library
- Admin metrics, user activity, and remedy management
- Privacy consent, upload limits, content validation, ownership checks, rate limiting, and safe errors
- Dockerfiles, Compose configuration, Nginx routing, and environment templates
- Complete removal of Care Plan and obsolete manual SkinAnalysis code

## Model boundaries

The model estimates acne-like severity only. It does not infer general skin type, hydration, sensitivity, acne causes, diseases, medication, treatments, or Dosha. Predictions may be affected by lighting, camera quality, pose, makeup, filters, dataset representation, and conditions that resemble acne.

The interface should continue advising professional care for severe, painful, persistent, changing, or worrying symptoms.

## Deployment readiness

Configuration is ready for Docker-based local deployment, but Docker is not installed on the verification computer. Production additionally requires a managed database, HTTPS, private secrets, backups, monitoring, and a selected hosting provider.

## Presentation checklist

- Use Java 17 to capture a passing Maven result.
- Manually inspect 375 px, 768 px, and 1440 px layouts.
- Capture the principal application screens.
- Include the architecture, model metrics, confusion matrix, dataset split, ethical limitations, and live demonstration.
