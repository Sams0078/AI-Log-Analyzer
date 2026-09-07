from fastapi import FastAPI

app = FastAPI(title="AI Log Analyzer")


@app.get("/")
def root():
    return {"message": "AI Log Analyzer API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}