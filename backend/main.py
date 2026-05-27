import uuid
import random
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.database import engine, SessionLocal
from backend.models import Log, Base
from backend.schemas import LogInput, LogResponse

Base.metadata.create_all(bind=engine)

logs_storage = []

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_random_log():
    levels = ["INFO", "WARNING", "ERROR", "CRITICAL"]
    messages = [
        "User login successful",
        "Database connection established",
        "High memory usage detected",
        "Database timeout occurred",
        "Payment service failed",
        "Unauthorized access attempt",
        "API response delayed",
        "Service restarted successfully",
        "Cache miss detected",
        "File upload completed"
    ]

    return {
        "message": random.choice(messages),
        "level": random.choice(levels)
    }

def compute_priority(message: str, level: str) -> int:
    level_weights = {
        "INFO": 1,
        "WARNING": 3,
        "ERROR": 5,
        "CRITICAL": 7
    }

    score = level_weights.get(level.upper(), 1)
    msg = message.lower()

    critical_keywords = ["crash", "fatal", "panic"]
    security_keywords = ["unauthorized", "forbidden", "attack"]
    performance_keywords = ["timeout", "slow", "latency"]

    for word in critical_keywords:
        if word in msg:
            score += 5

    for word in security_keywords:
        if word in msg:
            score += 3

    for word in performance_keywords:
        if word in msg:
            score += 1

    return score

def detect_spike() -> bool:
    current_time = datetime.utcnow()

    recent_logs = [
        log for log in logs_storage
        if (current_time - datetime.fromisoformat(log["timestamp"])).total_seconds() <= 10
    ]

    return len(recent_logs) > 20

def frequency_based_anomaly(new_priority: int) -> bool:
    current_time = datetime.utcnow()
    high_priority_count = 0

    for log in logs_storage:
        log_time = datetime.fromisoformat(log["timestamp"])
        if (current_time - log_time).total_seconds() <= 60 and log["priority"] >= 5:
            high_priority_count += 1

    return high_priority_count >= 5 and new_priority >= 5

def compute_anomaly_score(priority: int) -> float:
    score = float(priority)

    if frequency_based_anomaly(priority):
        score += 2.5

    if detect_spike():
        score += 2.0

    return min(score, 10.0)

async def auto_log_generator():
    while True:
        log_data = generate_random_log()

        priority = compute_priority(log_data["message"], log_data["level"])
        anomaly_score = compute_anomaly_score(priority)
        anomaly = anomaly_score >= 7

        db = SessionLocal()
        try:
            log_entry = Log(
                id=str(uuid.uuid4()),
                timestamp=datetime.utcnow().isoformat(),
                status="generated",
                message=log_data["message"],
                level=log_data["level"],
                anomaly=anomaly,
                anomaly_score=anomaly_score,
                priority=priority
            )

            db.add(log_entry)
            db.commit()
            db.refresh(log_entry)

            logs_storage.append({
                "id": log_entry.id,
                "timestamp": log_entry.timestamp,
                "status": log_entry.status,
                "message": log_entry.message,
                "level": log_entry.level,
                "anomaly": log_entry.anomaly,
                "anomaly_score": log_entry.anomaly_score,
                "priority": log_entry.priority
            })
        finally:
            db.close()

        await asyncio.sleep(3)

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(auto_log_generator())
    yield
    task.cancel()

app = FastAPI(title="AI Log Intelligence API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Server is running"}

@app.post("/analyze-logs", response_model=LogResponse)
async def analyze_log(log: LogInput, db: Session = Depends(get_db)):
    priority = compute_priority(log.message, log.level)
    anomaly_score = compute_anomaly_score(priority)
    anomaly = anomaly_score >= 7

    log_entry = Log(
        id=str(uuid.uuid4()),
        timestamp=datetime.utcnow().isoformat(),
        status="received",
        message=log.message,
        level=log.level,
        anomaly=anomaly,
        anomaly_score=anomaly_score,
        priority=priority
    )

    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)

    logs_storage.append({
        "id": log_entry.id,
        "timestamp": log_entry.timestamp,
        "status": log_entry.status,
        "message": log_entry.message,
        "level": log_entry.level,
        "anomaly": log_entry.anomaly,
        "anomaly_score": log_entry.anomaly_score,
        "priority": log_entry.priority
    })

    return log_entry

@app.get("/logs")
def get_logs(
    level: str | None = Query(default=None),
    anomaly: bool | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Log)

    if level:
        query = query.filter(Log.level == level)

    if anomaly is not None:
        query = query.filter(Log.anomaly == anomaly)

    total_logs = query.count()
    skip = (page - 1) * limit
    logs = query.offset(skip).limit(limit).all()
    total_pages = (total_logs + limit - 1) // limit

    return {
        "total_logs": total_logs,
        "total_pages": total_pages,
        "current_page": page,
        "logs": logs
    }

@app.get("/logs/{log_id}", response_model=LogResponse)
def get_log_by_id(log_id: str, db: Session = Depends(get_db)):
    log = db.query(Log).filter(Log.id == log_id).first()

    if not log:
        raise HTTPException(status_code=404, detail="Log not found")

    return log

@app.delete("/logs/{log_id}")
def delete_log(log_id: str, db: Session = Depends(get_db)):
    log = db.query(Log).filter(Log.id == log_id).first()

    if not log:
        raise HTTPException(status_code=404, detail="Log not found")

    db.delete(log)
    db.commit()

    return {"message": "Log deleted successfully"}

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    logs = db.query(Log).all()

    total = len(logs)
    info_logs = sum(1 for log in logs if log.level == "INFO")
    warning_logs = sum(1 for log in logs if log.level == "WARNING")
    error_logs = sum(1 for log in logs if log.level == "ERROR")
    critical_logs = sum(1 for log in logs if log.level == "CRITICAL")
    anomalies = sum(1 for log in logs if log.anomaly)

    error_rate = ((error_logs + critical_logs) / total * 100) if total > 0 else 0
    anomaly_rate = (anomalies / total * 100) if total > 0 else 0

    return {
        "total_logs": total,
        "info_logs": info_logs,
        "warning_logs": warning_logs,
        "error_logs": error_logs,
        "critical_logs": critical_logs,
        "total_anomalies": anomalies,
        "error_rate_percent": round(error_rate, 2),
        "anomaly_rate_percent": round(anomaly_rate, 2)
    }

@app.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Log).filter(Log.anomaly == True).all()

    if not alerts:
        return {"message": "No alerts detected"}

    return alerts

@app.get("/wait")
async def wait():
    await asyncio.sleep(3)
    return {"message": "Server waited 3 seconds"}