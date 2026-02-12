import sys
import json
from pathlib import Path

sys.path.append(r'C:\Users\alvar\AppData\Local\Programs\Python\Python312\Lib\site-packages')

from notebooklm_mcp.api_client import NotebookLMClient
from notebooklm_mcp.auth import load_cached_tokens

def main():
    cached = load_cached_tokens()
    client = NotebookLMClient(cookies=cached.cookies, csrf_token=cached.csrf_token, session_id=cached.session_id)
    notebook_id = '487b5803-0d02-4512-9e5f-0a6c7fd663ad'
    
    params = [[2], notebook_id, 'NOT artifact.status = "ARTIFACT_STATUS_SUGGESTED"']
    rpc_url = client._build_url(client.RPC_POLL_STUDIO, f"/notebook/{notebook_id}")
    rpc_body = client._build_request_body(client.RPC_POLL_STUDIO, params)
    
    response = client._get_client().post(rpc_url, content=rpc_body)
    parsed = client._parse_response(response.text)
    raw_artifacts = client._extract_rpc_result(parsed, client.RPC_POLL_STUDIO)
    
    with open('artifacts_raw.json', 'w', encoding='utf-8') as f:
        json.dump(raw_artifacts, f, indent=2, ensure_ascii=False)
    
    print("Success: raw_artifacts.json created.")

if __name__ == "__main__":
    main()
