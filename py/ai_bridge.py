import sys
import json
import os
import requests
import re
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
import traceback

# notebooklm_mcp must be installed via pip (pip install notebooklm-mcp-server)

# --- Load cookies from environment variable if present ---
_auth_env = os.environ.get("NOTEBOOKLM_AUTH_JSON")
if _auth_env:
    try:
        _cache_dir = Path.home() / ".notebooklm-mcp"
        _cache_dir.mkdir(exist_ok=True)
        _auth_path = _cache_dir / "auth.json"
        with open(_auth_path, "w") as f:
            f.write(_auth_env)
        print("Auth tokens loaded from NOTEBOOKLM_AUTH_JSON environment variable.")
    except Exception as e:
        print(f"Warning: Could not write auth tokens from env: {e}")

try:
    from notebooklm_mcp.api_client import NotebookLMClient
    from notebooklm_mcp.auth import load_cached_tokens
except ImportError:
    print("Error: notebooklm_mcp not found. Please ensure it is installed.")
    sys.exit(1)

NOTEBOOK_ID = "487b5803-0d02-4512-9e5f-0a6c7fd663ad"


class AIBridgeHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/health':
            self._send_response({"status": "ok", "service": "AI Bridge"})
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/query':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                # Extract notebookId if provided, otherwise use default
                target_notebook_id = data.get('notebookId', NOTEBOOK_ID)
                user_query = data.get('query', '')
                
                print(f"Querying: {user_query} (Notebook ID: {target_notebook_id})")
                
                # Intent detection
                keywords = ["spara", "anteckning", "note", "save"]
                is_save_intent = any(keyword in user_query.lower() for keyword in keywords)
                
                # Clean query for NotebookLM (remove save-related keywords)
                cleaned_query = user_query
                if is_save_intent:
                    for kw in keywords:
                        # Simple removal of the keyword and surrounding context if it looks like a command
                        cleaned_query = re.sub(rf'\b{kw}\b.*', '', cleaned_query, flags=re.IGNORECASE).strip()
                        # If query becomes empty, fallback to original or a placeholder
                        if not cleaned_query: cleaned_query = user_query

                # 1. Always check NotebookLM for an answer first
                answer = "Jag kunde tyvärr inte hitta ett svar."
                try:
                    cached = load_cached_tokens()
                    client = NotebookLMClient(
                        cookies=cached.cookies, 
                        csrf_token=cached.csrf_token, 
                        session_id=cached.session_id
                    )
                    # Query with cleaned text so NotebookLM doesn't try to "save" things itself
                    print(f"Sending to NotebookLM: {cleaned_query}")
                    result = client.query(target_notebook_id, cleaned_query)
                    answer = result.get('answer', answer)
                except Exception as e:
                    print(f"NotebookLM error: {e}")
                
                # 2. If save intent is detected, send to n8n
                if is_save_intent:
                    try:
                        from n8n_bridge import N8NBridge
                        n8n = N8NBridge()
                        print("n8n Intent detected: Saving to Airtable...")
                        
                        webhook_url = n8n.base_url.replace("/workflows", "/webhook/save-note-airtable")
                        n8n_payload = {
                            "Question": user_query,
                            "Answer": answer,
                            "Source": "AI Tutor Hub"
                        }
                        n8n_response = requests.post(webhook_url, json=n8n_payload, timeout=10)
                        
                        if n8n_response.status_code == 200:
                            final_response = f"{answer}\n\n✨ **Sparat i Airtable!**"
                            self._send_response({"answer": final_response})
                            return
                        else:
                            error_msg = f"{answer}\n\n⚠️ **Kunde inte spara till Airtable** (n8n svarade med status {n8n_response.status_code}). Kontrollera att flödet är aktiverat!"
                            self._send_response({"answer": error_msg})
                            return
                    except Exception as e:
                        print(f"n8n bridge execution error: {e}")
                        error_msg = f"{answer}\n\n⚠️ **Kunde inte nå n8n.** Kontrollera att bryggan har internetåtkomst."
                        self._send_response({"answer": error_msg})
                        return
                
                # 3. Final response (either just NotebookLM or with n8n failure/bypass)
                self._send_response({"answer": answer})
                
            except Exception as e:
                print(f"Error processing query: {e}")
                traceback.print_exc()
                self._send_response({"error": str(e)}, 500)
        else:
            self.send_response(404)
            self.end_headers()

    def _send_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*') # CORS
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

def run_bridge(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, AIBridgeHandler)
    print(f"AI Bridge startad på port {port}...")
    print(f"Användning: Skicka POST till http://localhost:{port}/query")
    print("Tryck Ctrl+C för att avsluta.")
    httpd.serve_forever()

if __name__ == "__main__":
    run_bridge()
