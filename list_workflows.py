import requests
from n8n_bridge import N8NBridge

def list_all_workflows():
    bridge = N8NBridge()
    url = f"{bridge.api_base}/workflows"
    
    response = requests.get(url, headers=bridge.headers)
    if response.status_code == 200:
        data = response.json()
        workflows = data.get('data', [])
        print(f"Found {len(workflows)} workflows:")
        for wf in workflows:
            wf_id = wf.get('id')
            wf_name = wf.get('name')
            active = wf.get('active')
            # Extract webhook path if possible
            nodes = wf.get('nodes', [])
            paths = [n.get('parameters', {}).get('path') for n in nodes if n.get('type') == 'n8n-nodes-base.webhook']
            print(f"- ID: {wf_id} | Name: {wf_name} | Active: {active} | Paths: {paths}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    list_all_workflows()
