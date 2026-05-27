from sqlalchemy import Column, String, Boolean, Float, Integer
from backend.database import Base

class Log(Base):
    __tablename__ = "logs"

    id = Column(String(100), primary_key=True, index=True)
    timestamp = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)
    message = Column(String(255), nullable=False)
    anomaly = Column(Boolean, default=False)
    anomaly_score = Column(Float, default=0.0)
    level = Column(String(50), nullable=False)
    priority = Column(Integer, default=1)