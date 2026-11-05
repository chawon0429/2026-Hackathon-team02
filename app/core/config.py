
import os
from pathlib import Path
from dotenv import load_dotenv

# 저장소 루트의 .env 파일을 명시적으로 불러오기
PROJECT_ROOT = Path(__file__).resolve().parents[2]
ENV_FILE = PROJECT_ROOT / ".env"

load_dotenv(ENV_FILE)

DATABASE_URL = os.getenv("DATABASE_URL", "")
