import sys
import json
import os
import requests
from pathlib import Path

# Add site-packages to path
sys.path.append(r'C:\Users\alvar\AppData\Local\Programs\Python\Python312\Lib\site-packages')

from notebooklm_mcp.api_client import NotebookLMClient
from notebooklm_mcp.auth import load_cached_tokens

# Course configuration
COURSES = {
    'intro-ai': '487b5803-0d02-4512-9e5f-0a6c7fd663ad',
    'prompt-eng': 'PASTE_YOUR_ID_HERE',
    'deep-research': 'PASTE_YOUR_ID_HERE',
    'agent-läge': 'PASTE_YOUR_ID_HERE',
    'gpt': 'PASTE_YOUR_ID_HERE',
    'agent-builder': 'PASTE_YOUR_ID_HERE',
    'appar': 'PASTE_YOUR_ID_HERE',
    'atlas': 'PASTE_YOUR_ID_HERE'
}

def create_asset_folders():
    """Create folder structure for assets"""
    base = Path('assets')
    folders = ['audio', 'video', 'images', 'presentations']
    
    for folder in folders:
        (base / folder).mkdir(parents=True, exist_ok=True)
    
    print("[OK] Created asset folders")

def download_file(url, filepath):
    """Download a file from URL to filepath"""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"  [OK] Downloaded: {filepath.name}")
        return True
    except Exception as e:
        print(f"  [FAIL] Failed to download {filepath.name}: {e}")
        return False

def get_artifact_download_url(client, notebook_id, artifact_id, artifact_type):
    """
    Extract download URL for an artifact from NotebookLM
    This uses internal RPC calls to get the download link
    """
    try:
        # Poll studio status to get artifacts
        params = [[2], notebook_id, 'NOT artifact.status = "ARTIFACT_STATUS_SUGGESTED"']
        rpc_url = client._build_url(client.RPC_POLL_STUDIO, f"/notebook/{notebook_id}")
        rpc_body = client._build_request_body(client.RPC_POLL_STUDIO, params)
        
        response = client._get_client().post(rpc_url, content=rpc_body)
        parsed = client._parse_response(response.text)
        raw_artifacts = client._extract_rpc_result(parsed, client.RPC_POLL_STUDIO)
        
        # Search for the artifact and extract download URL
        for ra in (raw_artifacts[0] if isinstance(raw_artifacts[0], list) else raw_artifacts):
            # Artifact structure: [id, name, type, status, ...]
            if ra[0] == artifact_id:
                # Download URL is typically in position 10 or 11 depending on type
                if artifact_type == 'audio' and len(ra) > 10:
                    return ra[10]  # Audio download URL
                elif artifact_type == 'video' and len(ra) > 10:
                    return ra[10]  # Video download URL
                elif artifact_type == 'infographic' and len(ra) > 8:
                    return ra[8]   # Image URL
        
        return None
    except Exception as e:
        print(f"  [WARN] Error extracting download URL: {e}")
        return None

def download_course_artifacts(client, course_id, notebook_id):
    """Download all media artifacts for a single course"""
    print(f"\n[COURSE] Processing: {course_id}")
    
    if notebook_id == 'PASTE_YOUR_ID_HERE':
        print(f"  [SKIP] No Notebook ID configured")
        return {}
    
    try:
        # Get all artifacts for this notebook
        artifacts = client.poll_studio_status(notebook_id)
        
        downloaded = {
            'audio': None,
            'video': None,
            'infographic': None,
            'presentation': None
        }
        
        for artifact in artifacts:
            artifact_type = artifact.get('type')
            artifact_id = artifact.get('id')
            
            if artifact_type == 'audio':
                print(f"  [AUDIO] Found Audio Overview")
                url = get_artifact_download_url(client, notebook_id, artifact_id, 'audio')
                if url:
                    filepath = Path(f'assets/audio/{course_id}.mp3')
                    if download_file(url, filepath):
                        downloaded['audio'] = f'assets/audio/{course_id}.mp3'
            
            elif artifact_type == 'video':
                print(f"  [VIDEO] Found Video Overview")
                url = get_artifact_download_url(client, notebook_id, artifact_id, 'video')
                if url:
                    filepath = Path(f'assets/video/{course_id}.mp4')
                    if download_file(url, filepath):
                        downloaded['video'] = f'assets/video/{course_id}.mp4'
            
            elif artifact_type == 'infographic':
                print(f"  [IMAGE] Found Infographic")
                url = get_artifact_download_url(client, notebook_id, artifact_id, 'infographic')
                if url:
                    filepath = Path(f'assets/images/{course_id}_infographic.png')
                    if download_file(url, filepath):
                        downloaded['infographic'] = f'assets/images/{course_id}_infographic.png'
            
            elif artifact_type == 'presentation':
                print(f"  [SLIDES] Found Presentation")
                # Presentations might be multiple slides, handle accordingly
                url = get_artifact_download_url(client, notebook_id, artifact_id, 'presentation')
                if url:
                    filepath = Path(f'assets/presentations/{course_id}.pdf')
                    if download_file(url, filepath):
                        downloaded['presentation'] = f'assets/presentations/{course_id}.pdf'
        
        return downloaded
    
    except Exception as e:
        print(f"  [ERROR] Error processing course: {e}")
        return {}

def update_course_data(all_downloads):
    """Update course_data.js with the downloaded file paths"""
    print("\n[UPDATE] Updating course_data.js...")
    
    # Read current course_data.js
    try:
        with open('course_data.js', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # For each course, update the paths
        for course_id, downloads in all_downloads.items():
            if downloads.get('audio'):
                print(f"  [OK] Updated audio path for {course_id}")
            if downloads.get('video'):
                print(f"  [OK] Updated video path for {course_id}")
            if downloads.get('infographic'):
                print(f"  [OK] Updated infographic path for {course_id}")
        
        print("\n[NOTE] You'll need to manually update course_data.js with these paths:")
        print(json.dumps(all_downloads, indent=2))
        
    except Exception as e:
        print(f"  [ERROR] Error updating course_data.js: {e}")

def main():
    print("==> NotebookLM Artifact Downloader")
    print("=" * 50)
    
    # Load authentication
    cached = load_cached_tokens()
    if not cached:
        print("[ERROR] No cached tokens found. Please run authentication first.")
        return
    
    client = NotebookLMClient(
        cookies=cached.cookies,
        csrf_token=cached.csrf_token,
        session_id=cached.session_id
    )
    
    # Create folder structure
    create_asset_folders()
    
    # Download artifacts for all courses
    all_downloads = {}
    
    for course_id, notebook_id in COURSES.items():
        downloads = download_course_artifacts(client, course_id, notebook_id)
        all_downloads[course_id] = downloads
    
    # Update course_data.js
    update_course_data(all_downloads)
    
    print("\n[SUCCESS] Download complete!")
    print("[INFO] Check the 'assets/' folder for your downloaded files.")

if __name__ == "__main__":
    main()
