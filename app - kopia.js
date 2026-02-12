document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const navButtons = document.querySelectorAll('.nav-btn');
    const data = window.notebookData;

    if (!data) {
        appContent.innerHTML = '<div class="error">Kunde inte ladda data. Vänligen kontrollera data.js.</div>';
        return;
    }

    // --- MULTI-NOTEBOOK CONFIGURATION ---
    // Loaded from course_data.js

    let currentCourseId = 'intro-ai'; // Default
    let currentNotebookId = COURSE_CATALOG['intro-ai'].notebookId;

    // --- RENDERERS ---
    const renderers = {
        dashboard: () => {
            const agentId = (window.emma && window.emma.CONFIG && window.emma.CONFIG.ELEVENLABS_ID) || 'agent_2701k1617cvzeybvwt785svpfwby';
            return `
                <div class="swedai-grid">
                    <!-- 1. ADMIN COLUMN (Left) -->
                    <div class="dashboard-left admin-column">
                        <!-- Admin Header -->
                        <div class="column-header">
                            <h2 class="column-title">🎓 Admin</h2>
                            <p class="column-description">School Administrator & Program Guide</p>
                        </div>

                        <!-- Admin Profile -->
                        <div class="admin-profile">
                            <div class="admin-avatar-container">
                                <img src="assets/ui/admin-avatar.png" alt="Malin - Admin" class="admin-avatar-img" onerror="this.style.display='none'">
                            </div>
                            <h3 class="admin-name">Malin</h3>
                            <p class="admin-role">School Administrator</p>
                        </div>

                        <!-- Voice Agent -->
                        <div class="dashboard-section voice-agent-zone">
                            <div class="voice-agent floating">
                                <div class="agent-avatar">
                                    <elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>
                                </div>
                                <p class="agent-greeting">Talk to me about our programs!</p>
                            </div>
                        </div>

                        <!-- Program Selector -->
                        <div class="content-section">
                            <div class="section-header">
                                <span class="section-icon">📚</span>
                                <h3 class="section-title">Our Programs</h3>
                            </div>
                            
                            <select id="productSelector" class="category-selector" onchange="window.emma.handleCategoryChange(this.value)">
                                <option value="" selected disabled>Select Program</option>
                                <option value="ChatGPT Mastery">🎓 ChatGPT Mastery</option>
                                <option value="Other Courses">📚 Other Courses</option>
                            </select>
                            
                             <div id="carouselWrapper"></div>
                        </div>

                        <!-- Admin Chat -->
                        <div class="chat-section">
                            <div class="chat-header">
                                <span class="chat-icon">💬</span>
                                <h3>Chat with Malin</h3>
                            </div>
                            <div class="chat-content">
                                <div id="agentResponse" class="agent-response">
                                    <i class="fas fa-sun" style="color: var(--solar-orange);"></i>
                                    Malin is responding...
                                </div>

                                <div class="input-group">
                                    <textarea id="chatInput" class="chat-input" placeholder="Send message..." rows="1"></textarea>
                                    <button id="sendBtn" class="send-button" onclick="window.emma.sendMessage()">
                                        <i class="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. CLASSROOM COLUMN (Middle) -->
                    <div class="dashboard-middle classroom-column">
                        <!-- Classroom Header -->
                        <div class="column-header">
                            <h2 class="column-title">📚 Classroom</h2>
                            <p class="column-description">Explore courses and learning materials</p>
                        </div>

                        <!-- COURSE SELECTOR -->
                        <div class="content-section" style="margin-bottom: 20px;">
                            <div class="section-header">
                                <span class="section-icon">🎓</span>
                                <h3 class="section-title">Select Course</h3>
                            </div>
                            <select class="category-selector" id="course-selector" onchange="window.selectCourse(this.value)">
                                ${Object.values(COURSE_CATALOG).map(c =>
                `<option value="${c.id}" ${c.id === currentCourseId ? 'selected' : ''}>${c.name}</option>`
            ).join('')}
                            </select>
                        </div>

                        <!-- CONTENT DISPLAY -->
                        <div class="content-section">
                            <div class="section-header">
                                <span class="section-icon">📂</span>
                                <h3 class="section-title">Course Material: <span id="active-course-name">${COURSE_CATALOG[currentCourseId].name}</span></h3>
                            </div>
                            
                            <select class="category-selector" id="content-filter-dropdown" onchange="filterGallery(this.value)">
                                <option value="all">Show All Material</option>
                                <option value="updates">🆕 Updates</option>                               
                                <option value="podcast">🎙️ Podcast</option>                                
                                <option value="infographics">📊 Infographics</option>
                                <option value="report">📝 Reports</option>
                                <option value="notion">📝 Stödmaterial & Övningar</option>
                            </select>

                            <div class="gallery-grid" id="gallery-grid">
                                <!-- Gallery items will be injected here -->
                            </div>
                        </div>
                    </div>

                    <!-- 3. AI-MENTOR COLUMN (Right) -->
                    <div class="dashboard-right ai-mentor-column">
                        <!-- AI-Mentor Header -->
                        <div class="column-header">
                            <h2 class="column-title">🤖 AI-Mentor</h2>
                            <p class="column-description">Course-specific learning assistant</p>
                        </div>

                        <div class="chat-section">
                            <div class="chat-header">
                                <span class="chat-icon">🧠</span>
                                <h3>AI-Mentor: <span id="consultant-course-name" style="font-size: 0.9em; font-weight:normal;">${COURSE_CATALOG[currentCourseId].name}</span></h3>
                            </div>
                            <div class="chat-content">
                                <div id="consultant-chat-messages" class="agent-response">
                                    <i class="fas fa-robot" style="color: var(--primary);"></i>
                                    Hi! I'm your expert on <strong>${COURSE_CATALOG[currentCourseId].name}</strong>. Ask me anything!
                                </div>

                                <div class="input-group">
                                    <textarea id="consultant-chat-input" class="chat-input" placeholder="Ask your question..." rows="1"></textarea>
                                    <button id="consultantSendBtn" class="send-button" onclick="sendMessage('consultant')">
                                        <i class="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        'ai-konsult': () => {
            return `
                <div class="ai-konsult-page">
                    <!-- Gradient Header with Avatar (Original Design) -->
                    <div class="konsult-header-gradient">
                        <div class="konsult-avatar-large">
                            <img src="assets/ui/ai-konsult-avatar.png" alt="AI-Konsult" onerror="this.style.display='none'">
                        </div>
                        <h1 class="konsult-title">Välkommen till AI-Konsult</h1>
                        <p class="konsult-subtitle">Din holistiska AI-guide för alla kurser</p>
                    </div>

                    <!-- Two Column Layout -->
                    <div class="konsult-two-columns">
                        <!-- Left Column (30%) - Description Only -->
                        <div class="konsult-left-column">
                            <div class="konsult-info-card">
                                <h2>🎓 Vad är AI-Konsult?</h2>
                                <p>AI-Konsult är din expertassistent som har djup kunskap om <strong>alla våra kurser</strong>.</p>
                                <p>Till skillnad från AI-Mentor som fokuserar på en specifik kurs, kan AI-Konsult hjälpa dig att:</p>
                                <ul>
                                    <li>🔗 Koppla samman koncept från olika kurser</li>
                                    <li>🎯 Tillämpa kunskaper holistiskt</li>
                                    <li>💡 Få strategisk vägledning</li>
                                    <li>🚀 Planera din utveckling</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Right Column (70%) - Chat -->
                        <div class="konsult-right-column">
                            <div class="chat-section">
                                <div class="chat-header">
                                    <span class="chat-icon">🧠</span>
                                    <h3>Chatta med AI-Konsult</h3>
                                </div>
                                <div class="chat-content">
                                    <div id="konsult-chat-messages" class="agent-response">
                                        <i class="fas fa-graduation-cap" style="color: var(--primary);"></i>
                                        Hej! Jag är AI-Konsult och har kunskap om alla våra kurser. Ställ mig frågor som kräver helhetsperspektiv!
                                    </div>

                                    <div class="input-group">
                                        <textarea id="konsult-chat-input" class="chat-input" placeholder="Ställ din fråga..." rows="1"></textarea>
                                        <button id="konsultSendBtn" class="send-button" onclick="sendMessage('konsult')">
                                            <i class="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        podcast: (podcastData) => {
            const { title, url, description } = podcastData;
            return `
                <section class="module-section">
                    <div class="card podcast-container">
                        <div class="podcast-visual">🎙️</div>
                        <div class="podcast-info">
                            <h2>${title}</h2>
                            <p class="subtitle">${description}</p>
                        </div>
                        <audio controls src="${url}" preload="auto">
                            Din webbläsare stöder inte ljudspelaren.
                        </audio>
                    </div>
                </section>
            `;
        },
        notion: (notionData) => {
            const { title, description, notionUrl, pdfUrl } = notionData;
            return `
                <section class="module-section">
                    <div class="card notion-container">
                        <div class="notion-header">
                            <div class="notion-icon">📝</div>
                            <div>
                                <h2>${title || 'Stödmaterial & Övningar'}</h2>
                                <p class="subtitle">${description || 'Kompletterande material och praktiska övningar'}</p>
                            </div>
                        </div>
                        
                        ${pdfUrl ? `
                        <div class="notion-pdf-viewer">
                            <iframe 
                                src="${pdfUrl}" 
                                width="100%" 
                                height="800px" 
                                frameborder="0"
                                style="border-radius: 12px; background: white; border: 1px solid var(--border-gray);">
                                <p>Din webbläsare stöder inte PDF-visning. <a href="${pdfUrl}" target="_blank">Ladda ner PDF</a></p>
                            </iframe>
                        </div>
                        ` : ''}
                        
                        <div class="notion-actions">
                            ${pdfUrl ? `<a href="${pdfUrl}" target="_blank" class="notion-link pdf-link">📄 Öppna PDF →</a>` : ''}
                            <a href="${notionUrl}" target="_blank" class="notion-link primary-link">📝 Öppna i Notion →</a>
                        </div>
                    </div>
                </section>
            `;
        },
        updates: (updatesData) => {
            const { title, description, items } = updatesData;

            // Helper function to render update content based on type
            const renderUpdateContent = (item) => {
                if (!item.content) return '';

                const { type, url } = item.content;

                switch (type) {
                    case 'video':
                        // Embedded video player (YouTube or local)
                        if (url.includes('youtube.com') || url.includes('youtu.be')) {
                            const videoId = url.includes('youtu.be')
                                ? url.split('/').pop()
                                : new URLSearchParams(new URL(url).search).get('v');
                            return `
                                <div class="update-media">
                                    <iframe width="100%" height="315" 
                                        src="https://www.youtube.com/embed/${videoId}" 
                                        frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowfullscreen>
                                    </iframe>
                                </div>
                            `;
                        } else {
                            return `
                                <div class="update-media">
                                    <video controls width="100%" preload="metadata">
                                        <source src="${url}" type="video/mp4">
                                        Din webbläsare stöder inte video.
                                    </video>
                                </div>
                            `;
                        }

                    case 'pdf':
                        return `
                            <div class="update-media">
                                <iframe src="${url}" width="100%" height="500px" frameborder="0">
                                    <p>Din webbläsare stöder inte PDF-visning. <a href="${url}" target="_blank">Ladda ner PDF</a></p>
                                </iframe>
                            </div>
                        `;

                    case 'image':
                        return `
                            <div class="update-media">
                                <img src="${url}" alt="${item.title}" style="max-width: 100%; height: auto; border-radius: 8px;">
                            </div>
                        `;

                    case 'audio':
                        return `
                            <div class="update-media">
                                <audio controls src="${url}" style="width: 100%;" preload="auto">
                                    Din webbläsare stöder inte ljudspelaren.
                                </audio>
                            </div>
                        `;

                    default:
                        return '';
                }
            };

            return `
                <section class="module-section">
                    <div class="card updates-container">
                        <div class="updates-header">
                            <div class="updates-icon">🆕</div>
                            <div>
                                <h2>${title || 'Kursuppdateringar'}</h2>
                                <p class="subtitle">${description || 'Se vad som är nytt i denna kurs'}</p>
                            </div>
                        </div>
                        <div class="updates-list">
                            ${items && items.length > 0 ? items.map(item => `
                                <div class="update-item">
                                    <div class="update-date">${item.date || 'Nyligen'}</div>
                                    <h3>${item.title}</h3>
                                    <p>${item.description}</p>
                                    ${renderUpdateContent(item)}
                                    ${item.externalLink ? `<a href="${item.externalLink}" target="_blank" class="update-link">Öppna i GHL Academy →</a>` : ''}
                                </div>
                            `).join('') : '<p style="text-align: center; padding: 2rem; color: var(--text-muted);">Inga uppdateringar tillgängliga än.</p>'}
                        </div>
                    </div>
                </section>
            `;
        },
        infographics: (infographicData) => {
            const { title, imageUrl, summary, details } = infographicData;
            return `
                <section class="module-section">
                    <div class="card">
                        <h2 style="margin-bottom: 2rem; text-align: center;">${title}</h2>
                        <img src="${imageUrl}" alt="${title}" class="infographic-img" style="max-width: 100%; height: auto;">
                        <div class="info-summary">
                            <p style="font-size: 1.2rem; font-weight: 500; color: var(--primary); margin-bottom: 1.5rem;">${summary}</p>
                            <div class="info-grid">
                                ${details.map(detail => `
                                    <div class="info-item">
                                        <p>${detail}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </section>
            `;
        },
        report: () => {
            const { title, content } = data.report;
            // Simple markdown converter (headings, bullet points, separators)
            const htmlContent = content
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^\* (.*$)/gim, '<li>$1</li>')
                .replace(/^- (.*$)/gim, '<li>$1</li>')
                .replace(/li>\n<li/gim, 'li><li')
                .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
                .replace(/---/g, '<hr style="border: none; border-top: 1px solid var(--border); margin: 2rem 0;">')
                .replace(/\n\n/g, '</p><p>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>');

            return `
                <section class="module-section">
                    <div class="card">
                        <div class="report-content">
                            ${htmlContent}
                        </div>
                    </div>
                </section>
            `;
        },
        quiz: () => {
            const { title, questions } = data.quiz;
            return `
                <section class="module-section">
                    <div class="card">
                        <div class="quiz-header">
                            <h2>${title}</h2>
                            <span class="score-badge" id="score-display">Poäng: 0 / ${questions.length}</span>
                        </div>
                        <div id="quiz-container">
                            ${questions.map((q, index) => `
                                <div class="question-card" id="q-card-${index}">
                                    <p style="font-size: 1.2rem; font-weight: 600;">${index + 1}. ${q.question}</p>
                                    <div class="options-list">
                                        ${q.options.map(option => `
                                            <button class="option-btn" onclick="checkAnswer(${index}, '${option.replace(/'/g, "\\'")}')">${option}</button>
                                        `).join('')}
                                    </div>
                                    <div class="explanation" id="explanation-${index}">
                                        <strong>Rätt svar: ${q.answer}</strong>
                                        <p>${q.explanation}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </section>
            `;
        },
        tutor: () => {
            return `
                <section class="module-section">
                    <div class="card tutor-container">
                        <div class="quiz-header">
                            <h2>🤖 Din Personliga AI-Tutor</h2>
                            <p style="color: var(--text-muted); font-size: 0.9rem;">Fråga vad du vill om kursmaterialet</p>
                        </div>
                        <div class="chat-window" id="chat-window">
                            <div class="message ai">
                                
                            </div>
                        </div>
                        <div class="typing-indicator" id="typing-indicator">AI-Tutor tänker...</div>
                        <div class="chat-input-area">
                            <input type="text" id="user-input" class="chat-input" placeholder="Skriv din fråga här..." onkeypress="if(event.key === 'Enter') sendMessage()">
                            <button class="send-btn" onclick="sendMessage()">Skicka</button>
                        </div>
                    </div>
                </section>
            `;
        },
        'voice-agent': () => {
            return renderers.dashboard();
        }
    };

    // Navigation logic
    window.switchModule = function (moduleName) {
        // Update button active state
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.module === moduleName);
        });

        // Update content with fade animation
        appContent.style.opacity = 0;
        setTimeout(() => {
            if (moduleName === 'ai-konsult') {
                appContent.innerHTML = renderers['ai-konsult']();
            } else {
                appContent.innerHTML = renderers[moduleName]();
            }
            appContent.style.opacity = 1;

            // If we are loading the dashboard, initialize the default knowledge view
            if (moduleName === 'dashboard') {
                setTimeout(() => window.switchKnowledgeView('query'), 50);
            }
        }, 300);
    }

    window.switchKnowledgeView = function (viewType) {
        const display = document.getElementById('knowledgeDisplay');
        const hooks = document.querySelectorAll('.nav-hook');
        if (!display) return;

        // Update active hook
        hooks.forEach(hook => {
            const isActive = (viewType === 'query' && hook.textContent.includes('Master Query')) ||
                (viewType !== 'query' && hook.textContent.toLowerCase().includes(viewType));
            hook.classList.toggle('active', isActive);
        });

        // Render appropriate content in the display area
        if (viewType === 'query') {
            display.innerHTML = renderers.tutor();
        } else if (renderers[viewType]) {
            display.innerHTML = renderers[viewType]();
        }
    };

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => window.switchModule(btn.dataset.module));
    });

    // Global quiz interaction (attached to window for onclick handlers)
    let userScore = 0;
    const answeredQuestions = new Set();

    window.checkAnswer = (qIndex, selectedOption) => {
        if (answeredQuestions.has(qIndex)) return;

        const qData = data.quiz.questions[qIndex];
        const buttons = document.querySelectorAll(`#q-card-${qIndex} .option-btn`);
        const explanationEl = document.getElementById(`explanation-${qIndex}`);

        answeredQuestions.add(qIndex);

        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.innerText === qData.answer) {
                btn.classList.add('correct');
            } else if (btn.innerText === selectedOption) {
                btn.classList.add('wrong');
            }
        });

        if (selectedOption === qData.answer) {
            userScore++;
            document.getElementById('score-display').innerText = `Poäng: ${userScore} / ${data.quiz.questions.length}`;
        }

        explanationEl.style.display = 'block';
    };

    // --- SELECT COURSE FUNCTION ---
    window.selectCourse = (courseId) => {
        // Update current course
        currentCourseId = courseId;

        // Update course name display
        const activeCourseName = document.getElementById('active-course-name');
        if (activeCourseName) {
            activeCourseName.textContent = COURSE_CATALOG[courseId].name;
        }

        // Update consultant chat header
        const consultantCourseName = document.getElementById('consultant-course-name');
        if (consultantCourseName) {
            consultantCourseName.textContent = COURSE_CATALOG[courseId].name;
        }

        // Reset content filter to "all"
        const contentFilter = document.getElementById('content-filter-dropdown');
        if (contentFilter) {
            contentFilter.value = 'all';
        }

        // Clear gallery and show welcome message
        const galleryGrid = document.getElementById('gallery-grid');
        if (galleryGrid) {
            galleryGrid.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h3>Välkommen till ${COURSE_CATALOG[courseId].name}!</h3>
                    <p style="color: #666; margin-top: 10px;">Välj en innehållstyp från menyn ovan för att börja.</p>
                </div>
            `;
        }
    };

    // --- FILTER GALLERY FUNCTION ---
    window.filterGallery = (contentType) => {
        const galleryGrid = document.getElementById('gallery-grid');

        if (!galleryGrid) {
            console.error('Gallery grid not found');
            return;
        }

        // Get content for current course
        const courseContent = COURSE_CONTENT[currentCourseId];

        if (!courseContent) {
            galleryGrid.innerHTML = '<p style="padding: 20px; text-align: center;">Inget innehåll tillgängligt för denna kurs än.</p>';
            return;
        }

        // Clear gallery
        galleryGrid.innerHTML = '';

        // If "all", show all available content types
        if (contentType === 'all') {
            Object.keys(courseContent).forEach(type => {
                const content = courseContent[type];
                if (content) {
                    renderContent(type, content, galleryGrid);
                }
            });
        } else {
            // Show specific content type
            const content = courseContent[contentType];
            if (content) {
                renderContent(contentType, content, galleryGrid);
            } else {
                galleryGrid.innerHTML = `<p style="padding: 20px; text-align: center;">Innehållet "${contentType}" finns inte för denna kurs än.</p>`;
            }
        }
    };

    // Helper function to render content based on type
    function renderContent(type, data, container) {
        let html = '';

        switch (type) {
            case 'updates':
                html = renderers.updates(data);
                break;
            case 'podcast':
                html = renderers.podcast(data);
                break;
            case 'notion':
                html = renderers.notion(data);
                break;
            case 'video':
                html = renderers.video(data);
                break;
            case 'mindmap':
                html = renderers.mindmap(data);
                break;
            case 'report':
                html = renderers.report(data);
                break;
            case 'question-card':
                html = renderers.questionCard(data);
                break;
            case 'quiz':
                html = renderers.quiz(data);
                break;
            case 'infographics':
                html = renderers.infographics(data);
                break;
            case 'presentation':
                html = renderers.presentation(data);
                break;
            default:
                html = `<p>Okänd innehållstyp: ${type}</p>`;
        }

        container.insertAdjacentHTML('beforeend', html);
    }

    window.sendMessage = async (source = 'default') => {
        // Determine input and output based on source
        let inputId = 'user-input';
        let outputId = 'chat-window';

        if (source === 'consultant') {
            inputId = 'consultant-chat-input';
            outputId = 'consultant-chat-messages';
        }

        const input = document.getElementById(inputId);
        const chatWindow = document.getElementById(outputId);

        // Validation
        if (!input || !chatWindow) {
            console.error("Chat elements not found for source:", source);
            return;
        }

        const message = input.value.trim();
        if (!message) return;

        // User message
        const userDiv = document.createElement('div');
        userDiv.className = 'message user';
        userDiv.innerText = message;
        chatWindow.appendChild(userDiv);

        input.value = '';
        chatWindow.scrollTop = chatWindow.scrollHeight;

        // Create typing indicator for this specific chat
        let indicator = null;
        if (source === 'consultant') {
            indicator = document.createElement('div');
            indicator.className = 'message ai typing';
            indicator.innerText = 'Consultant tänker...';
            chatWindow.appendChild(indicator);
        } else {
            indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.style.display = 'block';
        }

        try {
            // Check if our bridge is running
            const response = await fetch('http://127.0.0.1:8000/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: message })
            });

            const data = await response.json();

            // Remove/Hide indicator
            if (source === 'consultant' && indicator) {
                indicator.remove();
            } else if (indicator) {
                indicator.style.display = 'none';
            }

            // AI message
            const aiDiv = document.createElement('div');
            aiDiv.className = 'message ai';
            aiDiv.innerHTML = `<span class="message-icon">🤖</span> ` + (data.answer || "Jag kunde tyvärr inte svara på det just nu.");
            chatWindow.appendChild(aiDiv);

        } catch (error) {
            // Remove/Hide indicator
            if (source === 'consultant' && indicator) {
                indicator.remove();
            } else if (indicator) {
                indicator.style.display = 'none';
            }

            // Error response
            const aiDiv = document.createElement('div');
            aiDiv.className = 'message ai error';
            aiDiv.innerHTML = `<span class="message-icon">⚠️</span> <em>(Kunde inte nå AI-bryggan)</em><br>Kontrollera att <code>normalize_data.py</code> körs.`;
            chatWindow.appendChild(aiDiv);
        } finally {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    };

    // Add event listener for Enter key in consultant chat
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && e.target.id === 'consultant-chat-input') {
            sendMessage('consultant');
        }
    });



    // Initial load - Dashboard as landing page
    window.switchModule('dashboard');

    // Emma Logic
    window.emma = {
        CONFIG: {
            AGENT_URL: "https://ai-business-lab-v2-n8n.u7ysvb.easypanel.host/webhook/chat",
            ELEVENLABS_ID: "agent_2701k1617cvzeybvwt785svpfwby"
        },
        currentSlide: 0,
        carouselItems: [],

        sendMessage: async function () {
            const inputEl = document.getElementById("chatInput");
            const historyEl = document.getElementById("chatHistory");
            const indicatorEl = document.getElementById("agentResponse");
            const text = inputEl.value.trim();

            if (!text) return;

            // Add user message
            this.addMessageToChat('user', text);
            inputEl.value = "";
            inputEl.style.height = 'auto';

            indicatorEl.style.display = 'block';
            historyEl.scrollTop = historyEl.scrollHeight;

            try {
                const response = await fetch(this.CONFIG.AGENT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chatInput: text })
                });

                const result = await response.json();
                const agentText = this.parseN8nResponse(result);
                const processedContent = this.processUrls(agentText);

                this.addMessageToChat('agent', processedContent);
            } catch (error) {
                console.error("Error sending message:", error);
                this.addMessageToChat('agent', "❌ Tyvärr uppstod ett fel vid kontakt med Emma.");
            } finally {
                indicatorEl.style.display = 'none';
                historyEl.scrollTop = historyEl.scrollHeight;
            }
        },

        addMessageToChat: function (sender, content) {
            const historyEl = document.getElementById("chatHistory");
            if (!historyEl) return;

            const div = document.createElement('div');
            div.className = `message ${sender}`;
            div.innerHTML = `<div class="message-content">${content}</div>`;
            historyEl.appendChild(div);
            historyEl.scrollTop = historyEl.scrollHeight;
        },

        parseN8nResponse: function (result) {
            let output;
            if (Array.isArray(result) && result[0]?.output) output = result[0].output;
            else if (result?.output) output = result.output;
            else if (typeof result === "string") output = result;
            else return "Tekniskt fel.";

            if (typeof output === "string") {
                try {
                    let parsed = JSON.parse(output);
                    if (typeof parsed === "string") parsed = JSON.parse(parsed);
                    return parsed;
                } catch (e) { return output; }
            }
            return output;
        },

        processUrls: function (agentText) {
            if (typeof agentText === 'object' && agentText !== null && !Array.isArray(agentText)) {
                if (agentText.title && (agentText.introduction || agentText.points)) {
                    return this.createContentCard(agentText);
                }
            }

            if (typeof agentText !== 'string') return agentText;

            // Simple regex for images and youtube inside text
            const imageRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+\.(?:jpg|jpeg|png|gif|webp|bmp)(?:\?[^\s<>"{}|\\^`[\]]*)?)/gi;
            agentText = agentText.replace(imageRegex, match => `<img src="${match}" style="max-width:100%; border-radius:10px; margin:10px 0;">`);

            const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/gi;
            agentText = agentText.replace(youtubeRegex, (match, id) => `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen style="border-radius:10px; margin:10px 0;"></iframe>`);

            return agentText;
        },

        createContentCard: function (data) {
            let points = Array.isArray(data.points) ? data.points : [];
            return `
                <div class="content-card">
                    <h4>${data.title}</h4>
                    ${data.introduction ? `<p><em>${data.introduction}</em></p>` : ''}
                    <ul>${points.map(p => `<li>${p}</li>`).join('')}</ul>
                </div>
            `;
        },

        handleCategoryChange: async function (category) {
            const wrapper = document.getElementById("carouselWrapper");
            wrapper.innerHTML = '<div class="emma-loading"><i class="fas fa-circle-notch fa-spin"></i> Laddar...</div>';

            try {
                const response = await fetch(this.CONFIG.AGENT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chatInput: `Gallery: ${category}` })
                });
                const data = await response.json();

                // The n8n workflow returns an array of objects directly
                let systems = Array.isArray(data) ? data : [];

                this.renderCarousel(systems, wrapper);
            } catch (error) {
                console.error("Carousel load error:", error);
                wrapper.innerHTML = '<p>Kunde inte ladda galleriet.</p>';
            }
        },

        renderCarousel: function (systems, container) {
            this.carouselItems = systems.filter(s => s.Url || s.image);
            this.currentSlide = 0;

            if (!this.carouselItems.length) {
                container.innerHTML = '<p>Inga kurser hittades.</p>';
                return;
            }

            this.updateCarouselUI();
        },

        updateCarouselUI: function () {
            const container = document.getElementById("carouselWrapper");
            const s = this.carouselItems[this.currentSlide];
            const name = s.Kurs || s.name || "Namnlös kurs";
            const img = s.Url || s.image;

            container.innerHTML = `
                <div class="emma-mockup-carousel">
                    <button class="carousel-arrow left" onclick="window.emma.prevSlide()" aria-label="Föregående">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <div class="carousel-slide">
                        <img src="${img}" alt="${name}">
                        <div class="slide-overlay">
                            <div class="overlay-text">
                                <h2>${name}</h2>
                                <p>Frågor? Prata med Emma</p>
                            </div>
                        </div>
                    </div>

                    <button class="carousel-arrow right" onclick="window.emma.nextSlide()" aria-label="Nästa">
                        <i class="fas fa-chevron-right"></i>
                    </button>

                    <div class="carousel-dots">
                        ${this.carouselItems.map((_, i) => `
                            <span class="dot ${i === this.currentSlide ? 'active' : ''}"></span>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        prevSlide: function () {
            this.currentSlide = (this.currentSlide - 1 + this.carouselItems.length) % this.carouselItems.length;
            this.updateCarouselUI();
        },

        nextSlide: function () {
            this.currentSlide = (this.currentSlide + 1) % this.carouselItems.length;
            this.updateCarouselUI();
        },

        openCamera: function () {
            const modal = document.createElement('div');
            modal.id = 'camera-modal';
            modal.className = 'emma-camera-modal';
            modal.innerHTML = `
                <div class="camera-frame">
                    <button class="close-btn" onclick="document.getElementById('camera-modal').remove()">✕</button>
                    <iframe src="generic-camera.html" allow="camera; microphone"></iframe>
                </div>
            `;
            document.body.appendChild(modal);
        }
    };

    // Listen for camera analysis results
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'emma-message') {
            window.emma.addMessageToChat('agent', window.emma.processUrls(event.data.message));
            const modal = document.getElementById('camera-modal');
            if (modal) modal.remove();
        } else if (event.data && event.data.type === 'close-camera') {
            const modal = document.getElementById('camera-modal');
            if (modal) modal.remove();
        }
    });

    // Auto-resize chat input
    document.addEventListener('input', e => {
        if (e.target.id === 'chatInput') {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
        }
    });

    // Enter to send
    document.addEventListener('keydown', e => {
        if (e.target.id === 'chatInput' && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            window.emma.sendMessage();
        }
    });
});
