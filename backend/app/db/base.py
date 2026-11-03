from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass

# 이 파일은 앞으로 데이터베이스 모델들이 공통으로 상속받을 기반.