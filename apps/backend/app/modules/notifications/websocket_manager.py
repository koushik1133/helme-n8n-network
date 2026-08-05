import json
import logging
from typing import Dict, List, Set
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger("websocket_manager")

class ConnectionManager:
    """
    In-memory WebSocket manager with event/organization room isolation.
    Handles high-throughput real-time updates to Manager Dashboards.
    """
    def __init__(self):
        # Map event_id -> Set of WebSockets
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, event_id: str):
        await websocket.accept()
        if event_id not in self.active_connections:
            self.active_connections[event_id] = set()
        self.active_connections[event_id].add(websocket)
        logger.info(f"WebSocket client connected to event room {event_id}. Total: {len(self.active_connections[event_id])}")

    def disconnect(self, websocket: WebSocket, event_id: str):
        if event_id in self.active_connections:
            self.active_connections[event_id].discard(websocket)
            if not self.active_connections[event_id]:
                del self.active_connections[event_id]
        logger.info(f"WebSocket client disconnected from event room {event_id}")

    async def broadcast_to_event(self, event_id: str, message: dict):
        """Broadcast JSON payload to all connected dashboard subscribers for an event."""
        if event_id not in self.active_connections:
            return
            
        payload = json.dumps(message)
        dead_sockets = set()
        
        for websocket in self.active_connections[event_id]:
            try:
                await websocket.send_text(payload)
            except Exception as e:
                logger.warning(f"Error broadcasting WebSocket message: {e}")
                dead_sockets.add(websocket)
                
        # Clean up dead sockets
        for dead in dead_sockets:
            self.active_connections[event_id].discard(dead)

ws_manager = ConnectionManager()
