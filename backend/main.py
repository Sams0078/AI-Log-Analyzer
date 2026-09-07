from fastapi import FastAPI

from backend.api.logs import router as logs_router
from backend.api.analysis import router as analysis_router

app = FastAPI(title="AI Log Analyzer")


app.include_router(logs_router)
app.include_router(analysis_router)


@app.get("/")
def root():
    return {"message": "AI Log Analyzer API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}