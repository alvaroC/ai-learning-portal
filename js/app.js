import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- BLOCK 1: STATE (The Memory) ---
    const appContent = document.getElementById('main-content'); // Fixed: was 'app-content'
    const navButtons = document.querySelectorAll('.nav-btn');
    const data = window.notebookData;

    // Safety check to ensure data.js is loaded
    if (!data || Object.keys(data).length === 0) {
        if (appContent) appContent.innerHTML = '<div class="error">Kunde inte hitta data i data.js.</div>';
        return;
    }

    // Current App State
    let currentCourseId = 'intro-ai';
    let userScore = 0;

    // --- BLOCK 2: HTML PAGE LAYOUTS (The Stages) ---
    const PageManager = {

        //Dashboard Layout
        renderDashboard: () => `
           <div class="swedai-grid">
           
            <div class="admin-column" id="admin-col">
                ${renderers.adminPanel()}
            </div>

            <div class="classroom-column" id="classroom-col">
                ${renderers.classroomPanel(currentCourseId)}
            </div>

            <div class="mentor-column" id="mentor-col">
               ${renderers.mentorPanel(COURSE_CATALOG[currentCourseId].name)}
            </div>

        </div>`,

        //AI-Konsult Layout
        renderAIKonsult: () => `
            <div class="ai-konsult-page">
                <div class="konsult-header-gradient">
                    <h1>Välkommen till AI-Konsult</h1>
                </div>
                <div class="konsult-two-columns">
                    <div class="konsult-left-column">
                        <div class="konsult-info-card">
                            <h2>🎓 Vad är AI-Konsult?</h2>
                            <p>Koppla samman koncept från alla våra kurser.</p>
                        </div>
                    </div>
                    <div class="konsult-right-column" id="konsult-chat-col">
                        </div>
                </div>
            </div>`
    };

    // --- BLOCK 3: LAMBDA RENDERERS (The Factory) ---
    const renderers = {

        // --- Inside BLOCK 3: LAMBDA RENDERERS ---
        adminPanel: () => {
            // We define the Agent ID here so it's easy to change
            const agentId = "agent_2701k1617cvzeybvwt785svpfwby";

            return `
            <div class="column-header">
                <h2 class="column-title">🎓 Admin</h2>
                <p class="column-description">School Administrator & Program Guide</p>
            </div>

            <div class="dashboard-section voice-agent-zone">
                <div class="admin-profile">
                    <img src="assets/ui/admin-avatar.png" class="admin-avatar-img">
                    <h3 class="admin-name">Malin</h3>
                </div>
                <elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>
            </div>

            <div class="content-section">
                <div class="section-header">
                    <span class="section-icon">📚</span>
                    <h3 class="section-title">Our Programs</h3>
                </div>
                <select id="productSelector" class="category-selector" onchange="window.emma.handleCategoryChange(this.value)">
                    <option value="" selected disabled>Select Program</option>
                    <option value="ChatGPT Mastery">🎓 ChatGPT Mastery</option>
                    <option value="AI Business Strategy">🚀 AI Business Strategy</option>
                </select>
                <div id="carouselWrapper"></div> </div>

            <div class="chat-section">
                <div class="chat-header">
                    <span class="chat-icon">💬</span>
                    <h3>Chat with Malin</h3>
                </div>
                <div class="chat-content">
                    <div id="agentResponse" class="agent-response">Malin is online...</div>
                    <div id="chatHistory" class="chat-history"></div>
                    <div class="input-group">
                        <textarea id="chatInput" class="chat-input" placeholder="Ask a question..."></textarea>
                        <button onclick="window.emma.sendMessage()" class="send-button">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>`;
        },

        classroomPanel: (currentCourseId) => {
            return `
            <div class="column-header">
                <h2 class="column-title">📚 Classroom</h2>
                <p class="column-description">Explore courses and learning materials</p>
            </div>

            <div class="content-section" style="margin-bottom: 20px;">
                <div class="section-header">
                    <span class="section-icon">🎓</span>
                    <h3 class="section-title">Select Course</h3>
                </div>
                <select class="category-selector" id="course-selector" onchange="window.selectCourse(this.value)">
                    ${Object.values(COURSE_CATALOG).map(c =>
                `<option value="${c.id}" ${c.id === currentCourseId ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
            </div>

            <div class="content-section">
                <div class="section-header">
                    <span class="section-icon">📂</span>
                    <h3 class="section-title">Course Material: <span id="active-course-name">${COURSE_CATALOG[currentCourseId].name}</span></h3>
                </div>
                
                <select class="category-selector" id="content-filter-dropdown" onchange="window.filterGallery(this.value)">
                    <option value="all">Show All Material</option>
                     <option value="mindmap">🧠 Mind Map</option>    
                    <option value="podcast">🎙️ Podcast</option>                                
                    <option value="video">🎥 Video</option>                                         
                    <option value="infographic">📊 Infographics</option> 
                    <option value="presentation">📽️ Presentation</option>                                                                 
                    <option value="table">📊 Jämförelsetabell</option>
                    <option value="report">📝 Reports</option>
                    <option value="flashcards">🃏 Flashcards</option>
                    <option value="quiz">📝 Quiz</option>
                    <option value="exercises">🛠️ Övningar</option>   
                    <option value="updates">🔔 Uppdateringar</option>
                  
                </select>   

                <div class="gallery-grid" id="gallery-grid">
                    <div class="welcome-msg">Välj material för att börja lära dig!</div>
                </div>
            </div>`;
        },

        // --- Inside BLOCK 3: LAMBDA RENDERERS ---
        mentorPanel: (courseName) => {
            return `
            <div class="column-header">
                <h2 class="column-title">🤖 AI-Mentor</h2>
                <p class="column-description">Course-specific learning assistant</p>
            </div>

            <div class="chat-section">
                <div class="chat-header">
                    <span class="chat-icon">🧠</span>
                    <h3>AI-Mentor: <span style="font-size: 0.9em; font-weight:normal;">${courseName}</span></h3>
                </div>
                
                <div class="chat-content">
                    <div id="mentor-chat-messages" class="agent-response">
                        <i class="fas fa-robot" style="color: var(--primary);"></i>
                        Hi! I'm your expert on <strong>${courseName}</strong>. Ask me anything about the course material!
                    </div>

                    <div class="input-group">
                        <textarea id="mentor-chat-input" class="chat-input" placeholder="Ask your question..." rows="1"></textarea>
                        <button id="mentorSendBtn" class="send-button" onclick="window.sendMessage('mentor')">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>`;
        },

        // 1. Podcast: Circular icon + Audio player
        podcast: (data) => `
            <div class="card podcast-container">
                <div class="artifact-visual podcast-visual">🎙️</div>
                <h2>${data.title}</h2>
                <p class="subtitle">${data.description}</p>
                <audio controls src="${data.url}" preload="auto"></audio>
            </div>`,

        // 2. Infographic: Image + List details                        
        infographic: (data) => `
            <div class="infographic-header" style="text-align: center; margin-bottom: 2rem;">
                <h2 style="font-size: 2.2rem;">${data.title}</h2>
                <p class="infographic-summary" style="font-style: italic; color: #666;">${data.summary}</p>
            </div>
    
            <div class="infographic-hero-layout" style="width: 100%; cursor: zoom-in;">
                <img src="${data.imageUrl}" 
                     alt="${data.title}" 
                     onclick="window.openLightbox('${data.imageUrl}')" 
                     style="width: 100%; height: auto; border-radius: 15px; transition: transform 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <p style="text-align: center; font-size: 0.8rem; color: #888; margin-top: 10px;">🔍 Klicka på bilden för att zooma</p>
            </div>`,

        // 3. Video: Circular icon + Video player
        video: (data) => `
            <div class="card video-container">
                <div class="artifact-visual video-visual">🎬</div>
                <h2>${data.title}</h2>
                <video controls width="100%" src="${data.url}"></video>
            </div>`,

        // 4. Mindmap: Visual Diagram Renderer
        mindmap: (data) => {
            return `
        <div class="card mindmap-container">
            <div class="artifact-visual mindmap-visual">🧠</div>
            <h2>${data.title}</h2>
            <div class="markmap">
                <script type="text/template">
                    ${data.content}
                </script>
            </div>
        </div>`;
        },
        // 5. Quiz: The interactive test
        quiz: (data) => `
            <div class="card quiz-container">
                <div class="artifact-visual quiz-visual">📝</div>
                <h2>${data.title}</h2>
                <button class="nav-btn active" onclick="window.loadActiveQuiz()">Starta Quiz</button>
            </div>`,

        // 6. Flashcards: Interactive flip-card (defined below at item 9)
        // 7. Report: PDF with avsnitt        
        report: (data) => `
            <div class="report-card">
                <div class="report-header">
                    <span class="artifact-visual">📄</span>
                    <h2>${data.title}</h2>
                    <p>${data.summary}</p>
                </div>
        
                <div class="report-preview-box">
                    <h3>Innehåll i rapporten:</h3>
                    <ul class="report-chapter-list">
                        ${data.chapters.map(chapter => `<li>${chapter}</li>`).join('')}
                    </ul>
                </div>
        
                <div class="report-actions">
                    <a href="${data.fileUrl}" download class="download-btn">
                        <span>📥</span> Ladda ned rapport (PDF)
                    </a>
                </div>
             </div>`,

        // 8. Table                
        table: async (tableConfig) => {
            const response = await fetch(tableConfig.sourceFile);
            const fullData = await response.json();

            const tableHTML = `
        <div class="table-card">
            <div class="table-header-main">
                <div class="accent-bar"></div>
                <h3>${fullData.titel}</h3>
            </div>
            
            <table class="comparison-grid">
                <thead>
                    <tr>
                        <th style="width: 40%">BESKRIVNING</th>
                        <th style="width: 30%">ANALOGI</th>
                        <th style="width: 30%">EXEMPEL</th>
                    </tr>
                </thead>
                <tbody>
                    ${fullData.grenar.map(gren => `
                        <tr class="branch-header-row">
                            <td colspan="3">
                                <h4>${gren.typ}</h4>
                            </td>
                        </tr>
                        <tr class="branch-content-row">
                            <td><p>${gren.beskrivning}</p></td>
                            <td><span class="analogi-text">"${gren.analogi}"</span></td>
                            <td>
                                <ul class="example-list">
                                    ${gren.exempel.map(ex => `<li>${ex}</li>`).join('')}
                                </ul>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
            return tableHTML;
        },
        // 9. Flashcards 
        flashcards: (data) => {
            let currentIndex = 0;
            let isShowingAnswer = false;

            // Local function to update the view
            window.refreshFlashcard = () => {
                const cardText = document.getElementById('fc-display-text');
                const actionBtn = document.getElementById('fc-action-btn');
                const counter = document.getElementById('fc-counter-text');

                if (isShowingAnswer) {
                    cardText.innerHTML = `<div class="answer-reveal"><strong>SVAR:</strong><br>${data.cards[currentIndex].a}</div>`;
                    actionBtn.innerText = "Nästa kort →";
                    actionBtn.onclick = () => {
                        currentIndex = (currentIndex + 1) % data.cards.length;
                        isShowingAnswer = false;
                        refreshFlashcard();
                    };
                } else {
                    cardText.innerHTML = `<div class="question-view">${data.cards[currentIndex].q}</div>`;
                    actionBtn.innerText = "Visa Svar";
                    actionBtn.onclick = () => {
                        isShowingAnswer = true;
                        refreshFlashcard();
                    };
                }
                counter.innerText = `Kort ${currentIndex + 1} av ${data.cards.length}`;
            };

            return `
            
            <div class="artifact-card flashcard-simple">
            <div class="fc-header">
                <h3>${data.title}</h3>
                <span id="fc-counter-text" class="badge">Laddar...</span>
            </div>
            
            <div class="fc-body">
                <div id="fc-display-text" class="fc-content-area">
                    ${data.cards[currentIndex].q}
                </div>
            </div>

            <div class="fc-footer">
                <button id="fc-action-btn" class="btn-primary" onclick="refreshFlashcard()">Visa Svar</button>
            </div>
            </div>
        <script>setTimeout(refreshFlashcard, 50);</script>`;
        },
        /* Presentation */
        presentation: (data) => {
            let currentSlide = 0;

            window.refreshPresentation = () => {
                const img = document.getElementById('pres-img');
                const counter = document.getElementById('pres-counter');
                const nextBtn = document.getElementById('pres-next-btn');

                img.src = data.slides[currentSlide];
                counter.innerText = `Slide ${currentSlide + 1} av ${data.slides.length}`;

                // Byt text på röda knappen vid sista sliden
                nextBtn.innerText = (currentSlide === data.slides.length - 1) ? "Börja om" : "Nästa Slide →";
            };

            window.changeSlide = (step) => {
                currentSlide = (currentSlide + step + data.slides.length) % data.slides.length;
                refreshPresentation();
            };

            return `
            <div class="artifact-card pres-container">
            <div class="fc-header">
                <h3>${data.title}</h3>
                <span id="pres-counter" class="badge">Laddar...</span>
            </div>
            
            <div class="pres-viewer">
                <img id="pres-img" src="${data.slides[0]}" alt="Slide">
            </div>

            <div class="fc-footer">
                <button class="nav-btn" onclick="changeSlide(-1)">←</button>
                <button id="pres-next-btn" class="fc-red-btn" onclick="changeSlide(1)">Nästa Slide →</button>
            </div>
            </div>
            <script>setTimeout(refreshPresentation, 50);</script>`;
        },
        /* Övningar */
        exercises: (data) => {
            return `
            <div class="artifact-card" style="text-align: center; padding: 50px;">
                <div class="icon" style="font-size: 50px; margin-bottom: 20px;">🛠️</div>
                  <h3>Dina Övningar väntar i Notion</h3>
                <p>Klicka på knappen nedan för att öppna uppgifterna i en ny flik.</p>
                <a href="${data.url}" target="_blank" class="nav-button" style="display: inline-block; background: #eb5757; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">
                    Öppna Notion ↗
                </a>
            </div>`;
        },
        updates: (data) => {
            return `
                <div class="artifact-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; min-height: 400px; background: white; border-radius: 15px;">
                    <div style="background: #fdf2f2; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 24px;">
                        🔔
                    </div>
                    <h2 style="color: #333; margin-bottom: 15px; font-size: 1.8rem;">${data.title}</h2>
                    <p style="color: #666; max-width: 450px; line-height: 1.6; margin-bottom: 35px; font-size: 1.1rem;">
                        ${data.description}
                    </p>
                    <a href="${data.url}" target="_blank" class="notion-portal-button">
                        Öppna nyhetsflödet ↗
                    </a>
                    <p style="margin-top: 25px; font-size: 0.85rem; color: #999;">
                        Klicka på knappen för att se senaste nytt i en ny flik.
                    </p>
                </div>`;
        },

        //Tutor: The universal AI interface (for Mentor & Konsult)
        tutor: (config) => `
            <div class="chat-section">
                <div class="chat-header">
                    <span class="chat-icon">${config.icon || '🤖'}</span>
                    <h3>${config.title}</h3>
                </div>
                <div class="chat-content">
                    <div id="${config.target}-chat-messages" class="agent-response">
                        <i class="fas fa-robot"></i> ${config.greeting}
                    </div>
                    <div class="input-group">
                        <textarea id="${config.target}-chat-input" class="chat-input" placeholder="Fråga AI..." rows="1"></textarea>
                        <button class="send-button" onclick="window.sendMessage('${config.target}')">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>`
    };

    // --- BLOCK 4: CONTROLLER LOGIC (The Director) ---    

    // Manage relationship between both Dropdown menus
    window.selectCourse = (courseId) => {
        console.log("🎬 selectCourse triggered for:", courseId);

        currentCourseId = courseId;

        if (!window.notebookData || !window.notebookData[courseId]) {
            console.error("❌ Warehouse Error: No data found for", courseId);
            return;
        }

        // UPDATED: Use 'main-content' to match your HTML
        const mainContainer = document.getElementById('main-content');
        if (mainContainer) {
            // Pass the course name to fix the "undefined" AI-Mentor label
            mainContainer.innerHTML = PageManager.renderDashboard();
        }

        const grid = document.getElementById('gallery-grid');
        if (grid) {
            grid.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666; grid-column: 1 / -1;">
                <h3>👋 Välkommen till ${COURSE_CATALOG[courseId].name}</h3>
                <p>Välj ett material i menyn ovan för att börja.</p>
            </div>`;
        }
    };

    window.filterGallery = async (contentType) => {
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;

        // Clear the grid before rendering new content
        grid.innerHTML = "";
        const courseData = window.notebookData[currentCourseId];

        // --- "Kommer snart" fallback for empty courses ---
        if (!courseData || Object.keys(courseData).length === 0) {
            grid.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
                <div style="font-size: 60px; margin-bottom: 20px;">🚧</div>
                <h3 style="font-size: 1.6rem; margin-bottom: 10px;">Kommer snart!</h3>
                <p style="color: #888; max-width: 400px; margin: 0 auto;">
                    Den här kursen är under uppbyggnad. Håll utkik – nytt innehåll är på väg!
                </p>
            </div>`;
            return;
        }

        // Connection between the dropdown menu and the AI Mentor
        // 1. Update the Mentor's Header Text
        const mentorTitle = document.querySelector('.ai-mentor-card h2');
        if (mentorTitle && courseData) {
            mentorTitle.innerHTML = `AI-Mentor: ${courseData.title}`;
        }

        // Update the internal state for the chat bridge
        window.currentActiveNotebookId = courseData.notebookId;

        // --- THE CRITICAL FIX: for...of loop allows 'await' to work ---
        // We loop through the keys and check if they match the selected content type
        const keys = Object.keys(courseData);

        for (const key of keys) {
            if (contentType === 'all' || contentType === key) {
                // Check if we have a renderer for this type (e.g., 'table' or 'quiz')
                if (renderers[key]) {
                    try {
                        // We 'await' the renderer here so it finishes the 'fetch'
                        const artifactHtml = await renderers[key](courseData[key]);

                        // Now that we have real HTML (not a Promise), we add it to the grid
                        grid.insertAdjacentHTML('beforeend', artifactHtml);
                    } catch (error) {
                        console.error(`Error rendering artifact "${key}":`, error);
                    }
                }
            }
        }

        // --- EXTERNAL LIBRARIES TRIGGER ---
        // Handle Mermaid diagrams if present
        if (window.mermaid) {
            await mermaid.run();
        }

        // Handle Markmap auto-loading
        if (window.markmap && window.markmap.autoLoader) {
            window.markmap.autoLoader.renderAll();
        }

        // --- PROGRESS TRACKING: Log to Supabase ---
        // Only track specific content types (not 'all')
        if (contentType !== 'all' && window.currentUser) {
            const { error } = await supabase.from('progress').insert({
                user_id: window.currentUser.id,
                course_id: currentCourseId,
                content_type: contentType
            });
            if (error) console.error('Progress tracking error:', error.message);
            else console.log(`📊 Progress tracked: ${currentCourseId} → ${contentType}`);
        }
    };

    // Mentor panel chat
    // --- Updated Mentor Chat Logic with Markdown Support ---
    window.sendMessage = async (source = 'default') => {
        // 1. Determine input and output based on source
        let inputId = 'user-input';
        let outputId = 'chat-window';

        if (source === 'consultant') {
            inputId = 'consultant-chat-input';
            outputId = 'consultant-chat-messages';
        } else if (source === 'mentor') {
            // Correctly set the IDs to match your Lambda Renderer
            inputId = 'mentor-chat-input';
            outputId = 'mentor-chat-messages';
        }

        const input = document.getElementById(inputId);
        const chatWindow = document.getElementById(outputId);

        // 2. Validation
        if (!input || !chatWindow) {
            console.error("❌ Chat elements not found for source:", source);
            return;
        }

        const message = input.value.trim();
        if (!message) return;

        // 3. Display User Message
        const userDiv = document.createElement('div');
        userDiv.className = 'message user';
        userDiv.innerText = message;
        chatWindow.appendChild(userDiv);

        input.value = '';
        chatWindow.scrollTop = chatWindow.scrollHeight;

        // 4. Create Typing Indicator
        let indicator = document.createElement('div');
        indicator.className = 'message ai typing';
        indicator.innerText = source === 'consultant' ? 'Consultant tänker...' : 'Mentorn läser materialet...';
        chatWindow.appendChild(indicator);

        // 5. Fetch from Python Bridge
        try {
            const response = await fetch('http://127.0.0.1:8000/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: message,
                    notebookId: window.currentActiveNotebookId
                })
            });

            const data = await response.json();

            // Remove Indicator
            if (indicator) indicator.remove();

            // 6. Display AI Response with Markdown Rendering
            const aiDiv = document.createElement('div');
            aiDiv.className = 'message ai';
            const formattedAnswer = marked.parse(data.answer || "Jag kunde tyvärr inte svara på det just nu.");
            aiDiv.innerHTML = `
            <span class="message-icon">🤖</span> 
            <div class="markdown-body">${formattedAnswer}</div>
        `;
            chatWindow.appendChild(aiDiv);

            // 7. Save conversation to Supabase chat_history
            if (window.currentUser) {
                const chatRows = [
                    { user_id: window.currentUser.id, course_id: currentCourseId, role: 'user', message: message },
                    { user_id: window.currentUser.id, course_id: currentCourseId, role: 'assistant', message: data.answer || '' }
                ];
                const { error } = await supabase.from('chat_history').insert(chatRows);
                if (error) console.error('Chat save error:', error.message);
                else console.log('💬 Chat saved to Supabase');
            }

        } catch (error) {
            console.error("Fetch Error:", error);
            if (indicator) indicator.remove();

            const errDiv = document.createElement('div');
            errDiv.className = 'message ai error';
            errDiv.innerHTML = `<span class="message-icon">⚠️</span> <em>(Kunde inte nå AI-bryggan)</em>`;
            chatWindow.appendChild(errDiv);
        } finally {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    };

    //Artefact: Start Quiz    
    window.loadActiveQuiz = async () => {
        const courseData = window.notebookData[currentCourseId];

        // FIX 1: Look inside the .quiz object as defined in your data.js
        const quizInfo = courseData ? courseData.quiz : null;

        if (!quizInfo || !quizInfo.quizUrl) {
            console.error("❌ No quiz URL found for course:", currentCourseId);
            return;
        } // FIX 2: Correctly close the IF block here so the try/catch can run

        try {
            console.log("📥 Loading quiz from:", quizInfo.quizUrl);
            const response = await fetch(quizInfo.quizUrl);
            const quizData = await response.json();

            window.activeQuizModules = quizData.modules;
            window.renderQuizQuestion(0, 0);

        } catch (error) {
            console.error("❌ Failed to load quiz JSON:", error);
        }
    };

    window.renderQuizQuestion = (mIdx, qIdx) => {
        const module = window.activeQuizModules[mIdx];
        const question = module.questions[qIdx];

        // FIX: Target the container that actually exists on your screen
        let displayArea = document.querySelector('.quiz-container');

        // Fallback: If quiz-container isn't found, try a generic classroom container
        if (!displayArea) {
            displayArea = document.querySelector('.artifact-display') || document.getElementById('quiz-area');
        }

        if (!displayArea) {
            console.error("❌ Still no container! Ensure your HTML has a <div class='quiz-container'>.");
            return;
        }

        // Now proceed to draw the question
        displayArea.innerHTML = `
        <div class="quiz-active-card">
            <div class="quiz-header">
                <span class="module-name">${module.module_name}</span>
                <span class="progress">Fråga ${qIdx + 1} av ${module.questions.length}</span>
            </div>
            <h2 class="quiz-question-text">${question.question}</h2>
            <div class="quiz-options-grid">
                ${question.options.map((opt, i) => `
                    <button class="quiz-option-btn" onclick="window.submitQuizAnswer(${mIdx}, ${qIdx}, ${i})">
                        ${opt}
                    </button>
                `).join('')}
            </div>
            <div id="quiz-feedback"></div>
        </div>`;
    };

    // Quiz score tracker – reset when a new quiz starts
    window.quizScore = 0;
    window.quizTotal = 0;

    window.submitQuizAnswer = async (mIdx, qIdx, selectedIdx) => {
        const module = window.activeQuizModules[mIdx];
        const question = module.questions[qIdx];
        const feedbackDiv = document.getElementById('quiz-feedback');

        // Count total questions answered
        window.quizTotal++;

        // Check if the answer is correct
        const isCorrect = selectedIdx === question.correct_answer_index;

        if (isCorrect) {
            window.quizScore++;  // Increment score
            feedbackDiv.innerHTML = `<p style="color: green; margin-top: 10px;">✅ Rätt svar!</p>`;

            // Determine the next step: same module or next module
            setTimeout(async () => {
                if (qIdx + 1 < module.questions.length) {
                    // Next question in same module
                    window.renderQuizQuestion(mIdx, qIdx + 1);
                } else if (mIdx + 1 < window.activeQuizModules.length) {
                    // First question of next module
                    window.renderQuizQuestion(mIdx + 1, 0);
                } else {
                    // --- QUIZ COMPLETE: Save result to Supabase ---
                    const finalScore = window.quizScore;
                    const finalTotal = window.quizTotal;

                    if (window.currentUser) {
                        const { error } = await supabase.from('quiz_results').insert({
                            user_id: window.currentUser.id,
                            course_id: currentCourseId,
                            score: finalScore,
                            total: finalTotal
                        });
                        if (error) console.error('Quiz save error:', error.message);
                        else console.log(`🏆 Quiz saved: ${finalScore}/${finalTotal}`);
                    }

                    // Show completion screen with score
                    document.querySelector('.quiz-active-card').innerHTML = `
                        <div style="text-align:center; padding: 40px;">
                            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                            <h2>Quiz slutfört!</h2>
                            <p style="font-size: 1.3rem; margin: 1rem 0;">
                                Du fick <strong>${finalScore} av ${finalTotal}</strong> rätt
                            </p>
                            <p style="color: #888;">Resultatet är sparat i din profil.</p>
                        </div>
                    `;

                    // Reset counters for next quiz attempt
                    window.quizScore = 0;
                    window.quizTotal = 0;
                }
            }, 1500);
        } else {
            feedbackDiv.innerHTML = `<p style="color: red; margin-top: 10px;">❌ Fel svar, försök igen!</p>`;
        }
    };

    //Zoom Infographic
    window.openLightbox = (src) => {
        // Create the overlay container
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox-overlay';

        // Set the internal HTML
        lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${src}" class="lightbox-image">
        </div>`;

        // Append to body
        document.body.appendChild(lightbox);

        // Close logic
        lightbox.onclick = () => {
            document.body.removeChild(lightbox);
        };
    };

    // INITIALIZATION (Call this directly!)
    console.log("🚀 DOM is ready. Initializing Hub...");
    window.selectCourse(currentCourseId); // This removes the "Laddar" screen

}); // <--- FINAL CLOSING of DOMContentLoaded