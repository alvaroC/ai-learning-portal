// --- COURSE CATALOG (CONFIGURATION) ---

const COURSE_CATALOG = {
    'intro-ai': { id: 'intro-ai', name: 'Introduktion till AI', notebookId: '36c94dfd-016c-45be-a27a-4eada7ead593' },
    'prompt-eng': { id: 'prompt-eng', name: 'ChatGPT Prompt Engineering', notebookId: '52eebc56-4feb-49e8-ad78-4de44031c1f7' },
    'deep-research': { id: 'deep-research', name: 'ChatGPT Deep Research', notebookId: '7419bfd1-6fbf-4a5b-91fd-c8ea070864ad' },
    'agent-läge': { id: 'agent-läge', name: 'ChatGPT Agentläge', notebookId: '5e0e42c1-bb87-4277-95f4-5e140cb3ba96' },
    'gpt': { id: 'gpt', name: 'Skapa GPTs', notebookId: '7efe17dc-aa27-4772-9981-449693095b02' },
    'agent-builder': { id: 'agent-builder', name: 'ChatGPT Agent Builder', notebookId: 'c9555425-2959-4e04-8c8f-6fa7048ba63f' },
    'appar': { id: 'appar', name: 'ChatGPT Appar', notebookId: '67791935-df8f-4887-b0b3-60854c7ee533' },
    'atlas': { id: 'atlas', name: 'ChatGPT Atlas', notebookId: '011bf9d2-ab59-43d9-a0e8-755d21aa27df' },
};

// --- COURSE CONTENT DATA ---
// This file contains all the text, links, and data for the 8 courses.

const COURSE_CONTENT = {

    "intro-ai": {
        "title": "Introduktion till AI",
        "artifacts": [
            { "id": "podcast", "label": "Podcast", "type": "audio" },
            { "id": "infographic", "label": "Infografik", "type": "image" },
            { "id": "report", "label": "Rapport", "type": "pdf" },
            { "id": "mindmap", "label": "Mind Map", "type": "mindmap" },
            { "id": "quiz", "label": "Quiz", "type": "quiz" },
            { "id": "table", "label": "Jämförelsetabell", "type": "table" },
            { "id": "flashcards", "label": "Flashcards", "type": "flashcards" },
            { "id": "presentation", "label": "Presentation", "type": "presentation" },
            { "id": "video", "label": "Video", "type": "video" },
            { "id": "updates", "label": "Uppdateringar", "type": "notion", "url": "DIN_NOTION_LÄNK_FÖR_NYHETER" },
            { "id": "exercises", "label": "Övningar", "type": "notion", "url": "https://vanilla-dracorex-0e3.notion.site/Prompt-Engineering-10bc75149b9b802aa596c669bb2399b0" }
        ]
    },
    'prompt-eng': {},
    'deep-research': {},
    'agent-läge': {},
    'gpt': {},
    'agent-builder': {},
    'appar': {},
    'atlas': {}
};
