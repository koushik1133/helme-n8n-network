import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app

from app.core.config import settings
from app.db.session import engine, Base
from app.api.v1 import auth, tasks, workers, events, analytics
from app.modules.notifications.websocket_manager import ws_manager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus Metrics Exporter
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(tasks.router, prefix=settings.API_V1_STR)
app.include_router(workers.router, prefix=settings.API_V1_STR)
app.include_router(events.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def on_startup():
    logger.info("Initializing Database Tables and PostGIS extensions...")
    async with engine.begin() as conn:
        # Create PostGIS Extension & Base Schema if not exists
        await conn.execute(Base.metadata.create_all)
    logger.info("Application initialization complete.")

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

# Real-Time WebSocket Operations Hub
@app.websocket("/ws/events/{event_id}")
async def websocket_event_hub(websocket: WebSocket, event_id: str):
    await ws_manager.connect(websocket, event_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo heartbeat or client ping
            await websocket.send_text(f'{{"type": "PONG", "received": {data}}}')
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, event_id)
