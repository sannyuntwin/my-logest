# my-logest

Logistics tracking project with a FastAPI backend, PostgreSQL database, and a React frontend.

## What’s Included

- Backend API for shipment tracking and shipment listing
- Database schema for providers, shipments, status history, and provider rates
- Seed data for providers, pricing, and a sample shipment
- Frontend dashboard for tracking lookup, route map visualization, and recent shipment viewing
- Frontend language support for English, Thai, and Myanmar
- Docker Compose setup for local development

## Tech Stack

- Backend: FastAPI, SQLAlchemy, Pydantic
- Database: PostgreSQL
- Frontend: React, Vite
- DevOps: Docker, Docker Compose

## Project Structure

- `api/` - FastAPI application
- `web/` - React frontend
- `docker-compose.yml` - Local multi-service setup
- `submission_answers.md` - Written answers for the exam questions

## Run With Docker

1. Start the app:
   ```powershell
   docker compose up --build
   ```
2. Open the frontend:
   - http://localhost:3000
3. Test the backend:
   - http://localhost:8000/health
   - http://localhost:8000/api/shipments
   - http://localhost:8000/api/tracking/ABC123456

## Sample Tracking Number

Use this sample tracking number after startup:

- `ABC123456`

## Local Development

### Backend

1. Go to the backend folder:
   ```powershell
   cd api
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Run the API:
   ```powershell
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend

1. Go to the frontend folder:
   ```powershell
   cd web
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the dev server:
   ```powershell
   npm run dev
   ```

If the frontend cannot reach the backend, set:

```powershell
$env:VITE_API_BASE_URL="http://localhost:8000"
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/shipments` - List shipments with filters and pagination
- `GET /api/tracking/{tracking_number}` - Shipment tracking lookup

## Notes

- The database is seeded automatically when the API starts.
- The sample shipment is created for tracking demo purposes.
- `.env` is intentionally excluded from git.
