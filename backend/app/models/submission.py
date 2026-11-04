
from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.db.base import Base


class Submission(Base):
    # 사용자 리뷰 및 정보 제보를 저장하는 테이블
    __tablename__ = "submissions"

    # 제보 고유 ID
    id = Column(Integer, primary_key=True, index=True)

    # 제보를 작성한 사용자 ID
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # 제보 대상 장소 ID
    place_id = Column(Integer, nullable=True)

    # 접근성 선택 항목 (예: ["경사로", "휠체어 가능"])
    accessibility = Column(JSON, nullable=True)

    # 시설 선택 항목 (예: ["유아의자", "콘센트"])
    facilities = Column(JSON, nullable=True)

    # 이용 방법 (예: 예약없이 이용)
    usage_method = Column(String(50), nullable=True)

    # 대기 시간 (예: 바로 입장)
    waiting_time = Column(String(50), nullable=True)

    # 최소 주문 조건 (예: 1인 1메뉴)
    min_order = Column(String(50), nullable=True)

    # 사용자가 작성한 리뷰 내용
    content = Column(Text, nullable=True)

    # 제보 출처 (user / admin 등)
    source_type = Column(String(20), default="user", nullable=False)

    # 원본 데이터 ID (필요한 경우 사용)
    source_id = Column(Integer, nullable=True)

    # 검수 상태 (pending / approved / rejected)
    status = Column(String(20), default="pending", nullable=False)

    # 관리자 반려 사유
    reject_reason = Column(Text, nullable=True)

    # 제보 작성자와의 관계
    user = relationship("User")
