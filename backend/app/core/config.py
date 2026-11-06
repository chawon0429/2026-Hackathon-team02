
import os
from pathlib import Path
from dotenv import load_dotenv

# 프로젝트 최상위 폴더
PROJECT_ROOT = Path(__file__).resolve().parents[3]

# 프로젝트 루트 .env
ENV_FILE = PROJECT_ROOT / ".env"

# .env 파일 로딩
load_dotenv(dotenv_path=ENV_FILE, override=True)

# DB 연결 문자열
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

# 설정 확인
if not ENV_FILE.exists():
    print(f"[환경설정 오류] .env 파일 없음: {ENV_FILE}")
elif not DATABASE_URL:
    print(f"[환경설정 오류] DATABASE_URL이 비어 있음: {ENV_FILE}")
else:
    print("[환경설정 성공] DATABASE_URL 로딩 완료")
