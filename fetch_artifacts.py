import sys
import json
import os
from pathlib import Path

# Add site-packages to path
sys.path.append(r'C:\Users\alvar\AppData\Local\Programs\Python\Python312\Lib\site-packages')

from notebooklm_mcp.api_client import NotebookLMClient
from notebooklm_mcp.auth import load_cached_tokens

def main():
    cached = load_cached_tokens()
    if not cached:
        print("Error: No cached tokens found.")
        return

    client = NotebookLMClient(
        cookies=cached.cookies,
        csrf_token=cached.csrf_token,
        session_id=cached.session_id
    )

    notebook_id = '487b5803-0d02-4512-9e5f-0a6c7fd663ad'
    
    # Get artifacts
    artifacts = client.poll_studio_status(notebook_id)
    
    # Filter for the four types requested
    # Podcast (audio), Infographic, Quiz (flashcards), Report
    
    results = {
        "audio": [],
        "infographic": [],
        "quiz": [],
        "report": []
    }
    
    for a in artifacts:
        if a['type'] == 'audio':
            results['audio'].append(a)
        elif a['type'] == 'infographic':
            results['infographic'].append(a)
        elif a['type'] == 'flashcards':
            # Extract raw cards if possible
            # We'll need to do it via another call or by accessing the client's internal rpc results
            results['quiz'].append(a)
        elif a['type'] == 'report':
            # Fetch full report content (markdown)
            results['report'].append(a)

    # Let's also try to get the raw RPC result to extract the flashcard content
    # because poll_studio_status in current client only returns the count.
    
    params = [[2], notebook_id, 'NOT artifact.status = "ARTIFACT_STATUS_SUGGESTED"']
    rpc_url = client._build_url(client.RPC_POLL_STUDIO, f"/notebook/{notebook_id}")
    rpc_body = client._build_request_body(client.RPC_POLL_STUDIO, params)
    
    response = client._get_client().post(rpc_url, content=rpc_body)
    parsed = client._parse_response(response.text)
    raw_artifacts = client._extract_rpc_result(parsed, client.RPC_POLL_STUDIO)
    
    # Extract Quiz content from raw_artifacts
    # Flashcards/Quiz data is at position 9
    for ra in (raw_artifacts[0] if isinstance(raw_artifacts[0], list) else raw_artifacts):
        if ra[2] == client.STUDIO_TYPE_FLASHCARDS:
            # Quiz data is in ra[9][1]
            if len(ra) > 9 and isinstance(ra[9], list) and len(ra[9]) > 1:
                cards = ra[9][1]
                # Each card: [id, question, answer, [unknown], type]
                # For Quiz, it's usually multiple choice or Q&A
                results['quiz_data'] = cards
        
        if ra[2] == client.STUDIO_TYPE_REPORT:
            # Report content is in ra[7][1][0]
            if len(ra) > 7 and isinstance(ra[7], list) and len(ra[7]) > 1:
                report_content = ra[7][1][0]
                results['report_full'] = report_content

    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
