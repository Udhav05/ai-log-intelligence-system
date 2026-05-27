from pydantic import BaseModel, Field, ConfigDict
from typing import Literal

class LogInput(BaseModel):
    message: str = Field(..., min_length=5, max_length=200)
    level: Literal["INFO", "WARNING", "ERROR", "CRITICAL"]

class LogResponse(BaseModel):
    id: str
    timestamp: str
    status: str
    message: str
    anomaly: bool
    anomaly_score: float
    level: str
    priority: int

    model_config = ConfigDict(from_attributes=True)