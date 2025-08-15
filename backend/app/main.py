from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import user
from app.api.v1.routes import goal
from app.api.v1.routes import task
from app.api.v1.routes import progress_log
from app.api.v1.routes import ai_context
from app.api.v1.routes import job_metrics
from app.api.v1.routes import ai_service
from app.api.v1.routes import day_log
from app.api.v1.routes import log
from app.api.v1.routes import prompt
from app.api.v1.routes import websocket
from app.core.database import create_db_and_tables
from app.services.scheduler_service import SchedulerService
from app.services.reminder_service import task_reminder_job
from fastapi_mcp import FastApiMCP

app = FastAPI(
    title="AI-Powered Productivity System",
    description="A comprehensive productivity system with AI agents for entrepreneurs",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

scheduler_service = SchedulerService()

# Create database tables and start scheduler on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    if os.getenv("ENABLE_SCHEDULER", "false").lower() in {"1", "true", "yes"}:
        scheduler_service.start()
        # Every 10 minutes, check for due reminders in IST
        scheduler_service.add_cron_job(task_reminder_job, id="task_reminders", minute="*/10", second="0")

# Include all API routes
app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(goal.router, prefix="/goals", tags=["goals"])
app.include_router(task.router, prefix="/tasks", tags=["tasks"])
app.include_router(progress_log.router, prefix="/progress-logs", tags=["progress-logs"])
app.include_router(ai_context.router, prefix="/ai-context", tags=["ai-context"])
app.include_router(job_metrics.router, prefix="/job-metrics", tags=["job-metrics"])
app.include_router(ai_service.router, prefix="/ai", tags=["ai-service"])
app.include_router(day_log.router, prefix="/day-logs", tags=["day-logs"])
app.include_router(log.router, prefix="/log", tags=["log"])
app.include_router(prompt.router, prefix="/prompts", tags=["prompts"])
app.include_router(websocket.router, prefix="/api/v1/ws", tags=["websocket"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the AI-Powered Productivity System",
        "version": "1.0.0",
        "docs": "/docs",
        "features": [
            "User management",
            "Goal tracking",
            "Task management",
            "Progress logging",
            "AI context learning",
            "Job metrics tracking",
            "6 AI agents for productivity optimization"
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "AI Productivity System"}


mcp = FastApiMCP(
    app,
    name="AI-Powered Productivity System",
    description="A comprehensive productivity system with AI agents for entrepreneurs",
    describe_all_responses=True,
    describe_full_response_schema=True,
)

mcp.mount()

# Graceful shutdown
@app.on_event("shutdown")
def on_shutdown():
    if scheduler_service.scheduler:
        scheduler_service.shutdown()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)