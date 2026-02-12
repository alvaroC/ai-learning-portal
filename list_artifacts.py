import sys
import json

# Add site-packages to path
sys.path.append(r'C:\Users\alvar\AppData\Local\Programs\Python\Python312\Lib\site-packages')

from notebooklm_mcp.api_client import NotebookLMClient
from notebooklm_mcp.auth import load_cached_tokens

# Course configuration - UPDATED with your IDs
COURSES = {
    'intro-ai': {'name': 'Introduktion till AI', 'id': '487b5803-0d02-4512-9e5f-0a6c7fd663ad'},
    'prompt-eng': {'name': 'ChatGPT Prompt Engineering', 'id': '52eebc56-4feb-49e8-ad78-4de44031c1f7'},
    'deep-research': {'name': 'ChatGPT Deep Research', 'id': '7419bfd1-6fbf-4a5b-91fd-c8ea070864ad'},
    'agent-läge': {'name': 'ChatGPT Agentläge', 'id': '5e0e42c1-bb87-4277-95f4-5e140cb3ba96'},
    'gpt': {'name': 'Skapa GPTs', 'id': '7efe17dc-aa27-4772-9981-449693095b02'},
    'agent-builder': {'name': 'ChatGPT Agent Builder', 'id': 'c9555425-2959-4e04-8c8f-6fa7048ba63f'},
    'appar': {'name': 'ChatGPT Appar', 'id': '67791935-df8f-4887-b0b3-60854c7ee533'},
    'atlas': {'name': 'ChatGPT Atlas', 'id': '011bf9d2-ab59-43d9-a0e8-755d21aa27df'}
}

def main():
    print("=" * 60)
    print("NOTEBOOKLM ARTIFACT FINDER")
    print("=" * 60)
    print("\nThis script will show you which artifacts exist for each course.")
    print("You can then download them manually from NotebookLM.\n")
    
    # Load authentication
    cached = load_cached_tokens()
    if not cached:
        print("[ERROR] No cached tokens found.")
        return
    
    client = NotebookLMClient(
        cookies=cached.cookies,
        csrf_token=cached.csrf_token,
        session_id=cached.session_id
    )
    
    all_artifacts = {}
    
    for course_key, course_info in COURSES.items():
        print(f"\n{'='*60}")
        print(f"COURSE: {course_info['name']}")
        print(f"{'='*60}")
        
        try:
            artifacts = client.poll_studio_status(course_info['id'])
            
            if not artifacts:
                print("  [NONE] No artifacts found for this course yet.")
                all_artifacts[course_key] = []
                continue
            
            all_artifacts[course_key] = artifacts
            
            for artifact in artifacts:
                art_type = artifact.get('type', 'unknown')
                art_name = artifact.get('name', 'Unnamed')
                art_status = artifact.get('status', 'unknown')
                
                icon = {
                    'audio': '[AUDIO]',
                    'video': '[VIDEO]',
                    'infographic': '[IMAGE]',
                    'flashcards': '[CARDS]',
                    'report': '[REPORT]',
                    'presentation': '[SLIDES]'
                }.get(art_type, '[OTHER]')
                
                print(f"  {icon} {art_name} (Status: {art_status})")
            
        except Exception as e:
            print(f"  [ERROR] Could not fetch artifacts: {e}")
            all_artifacts[course_key] = []
    
    # Summary
    print(f"\n\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}\n")
    
    for course_key, artifacts in all_artifacts.items():
        course_name = COURSES[course_key]['name']
        count = len(artifacts) if artifacts else 0
        print(f"{course_name}: {count} artifact(s)")
    
    print("\n" + "="*60)
    print("NEXT STEPS:")
    print("="*60)
    print("""
1. Open NotebookLM in your browser
2. Navigate to each course
3. Click the 3-dot menu next to each artifact
4. Select 'Download'
5. Save files to the 'assets/' folder:
   - Audio -> assets/audio/[course-id].mp3
   - Video -> assets/video/[course-id].mp4
   - Images -> assets/images/[course-id].png
   - Presentations -> assets/presentations/[course-id].pdf

Then update course_data.js with the file paths!
""")

if __name__ == "__main__":
    main()
