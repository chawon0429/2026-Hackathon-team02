from fastapi import FastAPI
from app.api.router import api_router

app = FastAPI(
    title="Inclusive Place API",
    description="장소 접근성 및 이용 정보 제공 서비스",
    version="1.0.0",
)

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "message": "Inclusive Place API",
        "status": "running",
    }