from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.database import engine, Base, SessionLocal
from app.models import models
from app.core.seed import seed_initial_data
from app.api.shipments import router as shipments_router

# Create tables
Base.metadata.create_all(bind=engine)

# Seed data
db = SessionLocal()
try:
    seed_initial_data(db)
finally:
    db.close()

app = FastAPI(
    title="Logistics Tracking API",
    description="Full Stack Developer Logistics System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(shipments_router)

@app.get("/")
def root():
    return {"message": "Logistics Tracking API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}