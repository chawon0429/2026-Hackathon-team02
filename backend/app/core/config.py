import os
from pathlib import Path
from dotenv import load_dotenv

# 프로젝트 루트 inclusive-place-merge/.env
PROJECT_ROOT = Path(__file__).resolve().parents[3]
ENV_FILE = PROJECT_ROOT / ".env"

load_dotenv(ENV_FILE)

DATABASE_URL = os.getenv("DATABASE_URL", "")
