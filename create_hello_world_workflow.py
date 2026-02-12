import requests
import json
from n8n_bridge import N8NBridge

def create_hello_world():
    bridge = N8NBridge()
    url = f"{bridge.api_base}/workflows"
    
    # Simple workflow: Webhook -> Respond to Webhook
    workflow_data = {
        "name": "Hello World from Antigravity",
        "nodes": [
            {
                "parameters": {
                    "path": "hello-antigravity",
                    "options": {}
                },
                "id": "webhook-id",
                "name": "Webhook",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 1,
                "position": [250, 300],
                "webhookId": "hello-antigravity"
            },
            {
                "parameters": {
                    "options": {},
                    "responseBody": "Hello! Antigravity has successfully connected to your n8n server. 🚀"
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
        
        # Now Activate the workflow
        print(f"Activating workflow {workflow_id}...")
        put_url = f"{bridge.api_base}/workflows/{workflow_id}"
        # Merge active status into the data
        update_data = workflow_data.copy()
        update_data["active"] = True
        put_response = requests.put(put_url, headers=bridge.headers, json=update_data)
        
        if put_response.status_code == 200:
            print("SUCCESS: Workflow activated!")
            
            # Now trigger it via its webhook
            # The base URL for webhooks in n8n is usually slightly different or uses the base URL
            # For easypanel/hosted n8n it's often the same host
            webhook_url = bridge.base_url.replace("/workflows", "/webhook/hello-antigravity")
            print(f"Triggering webhook: {webhook_url}")
            trigger_response = requests.get(webhook_url)
            print(f"Response from n8n: {trigger_response.text}")
        else:
            print(f"WARNING: Could not activate workflow. Status: {put_response.status_code}")
            print(put_response.text)
        
        return result
    else:
        print(f"ERROR: Failed to create workflow. Status: {response.status_code}")
        print(response.text)
        return None

if __name__ == "__main__":
    create_hello_world()
