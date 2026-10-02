from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.logs import router as logs_router
from backend.api.analysis import router as analysis_router
from backend.api.admin import router as admin_router
from backend.database.database import Base, engine
from backend.database import models  # noqa: F401


app = FastAPI(
    title="AI Log Analyzer",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(logs_router)
app.include_router(analysis_router)
app.include_router(admin_router)


@app.on_event("startup")
def create_new_tables():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "AI Log Analyzer API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
