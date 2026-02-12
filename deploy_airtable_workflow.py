import requests
import json
from n8n_bridge import N8NBridge

def deploy_airtable_workflow():
    bridge = N8NBridge()
    url = f"{bridge.api_base}/workflows"
    
    # Workflow: Webhook -> Airtable -> Respond to Webhook
    workflow_data = {
        "name": "Save Note to Airtable",
        "nodes": [
            {
                "parameters": {
                    "httpMethod": "POST",
                    "path": "save-note-airtable",
                    "options": {}
                },
                "id": "webhook-id",
                "name": "Webhook",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 1,
                "position": [100, 300],
                "webhookId": "save-note-airtable"
            },
            {
                "parameters": {
                    "operation": "append",
                    "base": "={{ $json[\"airtable_base\"] }}",
                    "table": "Notes",
                    "columns": {
                        "mappingMode": "defineFullMapping",
                        "value": {
                            "Question": "={{ $json.body.Question }}",
                            "Answer": "={{ $json.body.Answer }}",
                            "Source": "AI Tutor"
                        }
                    }
                },
                "id": "airtable-id",
                "name": "Airtable",
                "type": "n8n-nodes-base.airtable",
                "typeVersion": 1,
                "position": [300, 300]
            },
            {
                "parameters": {
                    "options": {},
                    "responseBody": "Note saved to Airtable successfully!"
                },
                "id": "respond-id",
                "name": "Respond to Webhook",
                "type": "n8n-nodes-base.respondToWebhook",
                "typeVersion": 1,
                "position": [500, 300]
            }
        ],
        "connections": {
            "Webhook": {
                "main": [
                    [
                        {
                            "node": "Airtable",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "Airtable": {
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

    print(f"Creating/Updating workflow: {workflow_data['name']}")
    response = requests.post(url, headers=bridge.headers, json=workflow_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"SUCCESS: Airtable workflow created with ID: {result.get('id')}")
        print("NEXT STEPS:")
        print("1. Open workflow in n8n UI.")
        print("2. Select your Airtable Credentials.")
        print("3. Ensure you have an Airtable table named 'Notes' with 'Question' and 'Answer' columns.")
        print("4. Activate the workflow.")
        return result
    else:
        print(f"ERROR: Failed to create workflow. Status: {response.status_code}")
        print(response.text)
        return None

if __name__ == "__main__":
    deploy_airtable_workflow()
