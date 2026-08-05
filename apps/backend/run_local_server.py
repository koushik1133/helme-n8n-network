import http.server
import socketserver
import json

PORT = 8080

class OperationsBackendHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        if "/api/v1/tasks" in self.path:
            response = [
                {
                    "id": "task-101",
                    "title": "Main Entrance Gate 4 Medical Assistance Needed",
                    "category": "MEDICAL",
                    "priority": "EMERGENCY",
                    "status": "DISPATCHED",
                    "latitude": 12.9716,
                    "longitude": 77.5946,
                    "assigned_worker_id": "w-501",
                    "required_skills": ["FIRST_AID_CERTIFIED"],
                    "created_at": "2026-07-30T11:45:00Z"
                },
                {
                    "id": "task-102",
                    "title": "VIP Stage B Spotlight Bulb Replacement",
                    "category": "LIGHTING",
                    "priority": "HIGH",
                    "status": "ACCEPTED",
                    "latitude": 12.9725,
                    "longitude": 77.5955,
                    "assigned_worker_id": "w-502",
                    "required_skills": ["ELECTRICIAN"],
                    "created_at": "2026-07-30T11:45:00Z"
                }
            ]
        elif "/api/v1/workers" in self.path:
            response = [
                {
                    "id": "w-501",
                    "status": "IN_TRANSIT",
                    "skills": ["FIRST_AID_CERTIFIED"],
                    "battery_level": 88,
                    "network_quality": "5G",
                    "latitude": 12.9712,
                    "longitude": 77.5941
                },
                {
                    "id": "w-502",
                    "status": "ON_SITE",
                    "skills": ["ELECTRICIAN"],
                    "battery_level": 95,
                    "network_quality": "4G",
                    "latitude": 12.9723,
                    "longitude": 77.5952
                }
            ]
        else:
            response = {
                "status": "healthy",
                "service": "Enterprise Event Operations Platform",
                "version": "1.0.0",
                "api_docs": "http://localhost:8000/docs"
            }
            
        self.wfile.write(json.dumps(response).encode("utf-8"))

    def do_POST(self):
        self.send_response(201)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        response = {"status": "created", "dispatched": True}
        self.wfile.write(json.dumps(response).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), OperationsBackendHandler) as httpd:
        print(f"🚀 Event Operations Platform API Backend live at http://localhost:{PORT}")
        httpd.serve_forever()
