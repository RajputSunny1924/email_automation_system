from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from database import Base


class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(Text, nullable=False)
    category = Column(String(50), nullable=True)
    summary = Column(Text, nullable=True)
    action = Column(String(100), nullable=True)
    status = Column(String(20), default="pending")
    retry_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())