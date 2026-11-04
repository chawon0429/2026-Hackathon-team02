from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import DATABASE_URL

engine = None
SessionLocal = None

if DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
    )

    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )


def get_db():
    if SessionLocal is None:
        raise RuntimeError(
            "DATABASE_URL이 설정되지 않았습니다."
        )

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()