// --- COURSE CATALOG (CONFIGURATION) ---
// 1. Fill in your NotebookLM IDs here.
// 2. These IDs are found in the URL of your NotebookLM project.

const COURSE_CATALOG = {
    'intro-ai': { id: 'intro-ai', name: 'Introduktion till AI', notebookId: '487b5803-0d02-4512-9e5f-0a6c7fd663ad' },
    'prompt-eng': { id: 'prompt-eng', name: 'ChatGPT Prompt Engineering', notebookId: '52eebc56-4feb-49e8-ad78-4de44031c1f7' },
    'deep-research': { id: 'deep-research', name: 'ChatGPT Deep Research', notebookId: '7419bfd1-6fbf-4a5b-91fd-c8ea070864ad' },
    'agent-läge': { id: 'agent-läge', name: 'ChatGPT Agentläge', notebookId: '5e0e42c1-bb87-4277-95f4-5e140cb3ba96' },
    'gpt': { id: 'gpt', name: 'Skapa GPTs', notebookId: '7efe17dc-aa27-4772-9981-449693095b02' },
    'agent-builder': { id: 'agent-builder', name: 'ChatGPT Agent Builder', notebookId: 'c9555425-2959-4e04-8c8f-6fa7048ba63f' },
    'appar': { id: 'appar', name: 'ChatGPT Appar', notebookId: '67791935-df8f-4887-b0b3-60854c7ee533' },
    'atlas': { id: 'atlas', name: 'ChatGPT Atlas', notebookId: '011bf9d2-ab59-43d9-a0e8-755d21aa27df' }
};

// --- COURSE CONTENT DATA ---
// This file contains all the text, links, and data for the 8 courses.

const COURSE_CONTENT = {
    'intro-ai': {
        'updates': {
            title: "Kursuppdateringar",
            description: "Se vad som är nytt i denna kurs",
            items: [
                {
                    date: "2024-02-11",
                    title: "🎥 Ny video: GPT-4 Deep Dive",
                    description: "Vi har lagt till en 15-minuters djupdykning i GPT-4 capabilities med praktiska exempel och tips.",
                    content: {
                        type: "video",
                        url: "https://www.youtube.com/watch?v=G2fqAlgmoPo" // Byt till din YouTube URL
                    },
                    externalLink: "https://ghl-academy.com/courses/intro-ai/gpt4-deepdive" // Valfri länk till GHL
                },
                {
                    date: "2024-02-11",
                    title: "📄 Instruktioner: Hitta uppdateringar i GHL",
                    description: "Ny guide som visar exakt var du hittar alla uppdateringar och nya videor i GHL Academy.",
                    content: {
                        type: "pdf",
                        url: "assets/updates/Lektion-1.pdf" // Lägg till din PDF här
                    }
                }
            ]
        },
        'notion': {
            title: "Stödmaterial & Övningar",
            description: "Kompletterande material och praktiska övningar för kursen",
            notionUrl: "https://vanilla-dracorex-0e3.notion.site/Prompt-Engineering-10bc75149b9b802aa596c669bb2399b0",
            pdfUrl: "assets/notion/prompt-engineering.pdf" // Lägg din PDF här, eller ta bort denna rad om du inte har PDF
        },
        'podcast': {
            title: "AI Revolutionen",
            description: "Ett djupt dyk i hur AI förändrar världen, från arbetsmarknad till etik.",
            url: "assets/audio/Intro%20AI.m4a"
        },
        'video': {
            title: "Vad är Generativ AI?",
            videoId: "G2fqAlgmoPo", // YouTube ID
            description: "En visuell genomgång av grunderna i transformer-modeller."
        },
        'mindmap': {
            title: "AI Landskapet 2024",
            content: "Kursens innehåll"
        },
        'report': {
            title: "State of AI 2024",
            content: "# State of AI 2024\n\n## Sammanfattning\nAI-utvecklingen går framåt i en rasande takt. Här är de viktigaste trenderna:\n\n*   **Multimodala modeller** blir standard\n*   **Agenter** börjar lösa komplexa uppgifter\n*   **Reglering** (AI Act) träder i kraft\n\n## Slutsats\nFöretag måste anpassa sig nu."
        },
        'question-card': {
            title: "Reflektionskort",
            cards: [
                { q: "Hur påverkar AI din nuvarande roll?", a: "Tänk på vilka uppgifter som kan automatiseras vs förstärkas." },
                { q: "Vad är skillnaden på AGI och ANI?", a: "ANI är smal intelligens (t.ex. schack), AGI är generell mänsklig nivå." },
                { q: "Nämn en risk med LLMs.", a: "Hallucinationer och bias i träningsdata." }
            ]
        },
        'quiz': {
            title: "Kunskapstest: AI Grunder",
            questions: [
                { question: "Vad står GPT för?", options: ["Generative Pre-trained Transformer", "General Processing Tech", "Global Python Tool"], answer: "Generative Pre-trained Transformer", explanation: "GPT är en typ av LLM tränad på enorma mängder data." },
                { question: "Vilket år släpptes ChatGPT?", options: ["2020", "2022", "2023"], answer: "2022", explanation: "ChatGPT lanserades i november 2022." },
                { question: "Vad är en 'hallucination' i AI?", options: ["När AI drömmer", "När AI hittar på fakta", "När AI blir sjuk"], answer: "När AI hittar på fakta", explanation: "Språkmodeller kan generera övertygande men felaktig information." }
            ]
        },
        'infographics': {
            title: "Tidslinje: AI:s Historia",
            imageUrl: "assets/images/Intro%20AI%20Infographic.png",
            summary: "Från Turing-testet till ChatGPT.",
            details: ["1950: Turing Test", "2012: AlexNet (Deep Learning breakthrough)", "2017: Transformer paper", "2022: ChatGPT"]
        },
        'presentation': {
            title: "Kursöversikt: Introduktion till AI",
            slides: [
                "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000",
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000",
                "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000"
            ]
        }
    },

    // --- TEMPLATE FOR OTHER COURSES ---
    'prompt-eng': {
        // Fill in content here for "ChatGPT Prompt Engineering"
    },
    'deep-research': {},
    'agent-läge': {},
    'gpt': {},
    'agent-builder': {},
    'appar': {},
    'atlas': {}
};
