import requests
import json
from n8n_bridge import N8NBridge

def create_notes_workflow():
    bridge = N8NBridge()
    url = f"{bridge.api_base}/workflows"
    
    # Workflow: Webhook -> Respond to Webhook (could be extended to Google Sheets/Email)
    workflow_data = {
        "name": "Save Note from AI Tutor",
        "nodes": [
            {
                "parameters": {
                    "path": "save-note",
                    "options": {}
                },
                "id": "webhook-id",
                "name": "Webhook",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 1,
                "position": [250, 300],
                "webhookId": "save-note"
            },
            {
                "parameters": {
                    "options": {},
                    "responseBody": "Note saved successfully!"
                },
                "id": "respond-id",
                "name": "Respond to Webhook",
                "type": "n8n-nodes-base.respondToWebhook",
                "typeVersion": 1,
                "position": [450, 300]
            }
        ],
        "connections": {
            "Webhook": {
                "main": [
                    [
                        {
                            "node": "Respond to Webhook",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            }
        },
        "settings": {}
    }

    print(f"Creating workflow: {workflow_data['name']}")
    response = requests.post(url, headers=bridge.headers, json=workflow_data)
    
    if response.status_code == 200:
        result = response.json()
        workflow_id = result.get('id')
        print(f"SUCCESS: Workflow created with ID: {workflow_id}")
        print(f"IMPORTANT: Please activate this workflow in n8n UI (ID: {workflow_id})")
        return result
    else:
        print(f"ERROR: Failed to create workflow. Status: {response.status_code}")
        print(response.text)
        return None

if __name__ == "__main__":
    create_notes_workflow()
