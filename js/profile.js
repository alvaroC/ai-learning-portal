// =============================================================
// profile.js – Personal Student Dashboard
// =============================================================
// Fetches data from Supabase for the logged-in user and renders
// it into profile.html. Runs after auth.js has set currentUser.
// =============================================================

import { supabase } from './supabase.js';

// Known content types per course (for progress checklist)
const COURSE_CONTENT_TYPES = ['podcast', 'quiz', 'mindmap', 'report', 'flashcards'];

// Course display names (matches course_id keys in data.js)
const COURSE_NAMES = {
    'intro-ai': 'Introduktion till AI',
    'prompt-eng': 'Prompt Engineering',
    'ai-tools': 'AI-verktyg i praktiken'
};

// Format a Supabase timestamp to Swedish locale
function formatDate(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleString('sv-SE', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// Wait for auth.js to set window.currentUser (it runs async)
async function waitForUser(maxWaitMs = 5000) {
    const start = Date.now();
    while (!window.currentUser) {
        if (Date.now() - start > maxWaitMs) return null;
        await new Promise(r => setTimeout(r, 100));
    }
    return window.currentUser;
}

// ── RENDER: Profile hero ──────────────────────────────────────
function renderProfile(profile, user) {
    const name = profile?.full_name || user.email.split('@')[0];
    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-plan').textContent =
        (profile?.plan || 'full_access').replace('_', ' ');
}

// Human-readable labels per content type
const CONTENT_LABELS = {
    podcast: { done: '🎧 Lyssnad', todo: '🎧 Ej lyssnad' },
    quiz: { done: '✅ Genomförd', todo: '📝 Ej gjord' },
    mindmap: { done: '🗺️ Utforskad', todo: '🗺️ Ej öppnad' },
    report: { done: '📄 Läst', todo: '📄 Ej läst' },
    flashcards: { done: '🃏 Tränad', todo: '🃏 Ej tränad' },
};

// ── RENDER: Progress grid ─────────────────────────────────────
function renderProgress(progressRows, quizResults) {
    const grid = document.getElementById('progress-grid');

    // Group opened content_types by course_id
    const byCourse = {};
    for (const row of progressRows) {
        if (!byCourse[row.course_id]) byCourse[row.course_id] = new Set();
        byCourse[row.course_id].add(row.content_type);
    }

    // Build quiz score lookup: { 'intro-ai': '18/18' }
    const quizScores = {};
    for (const r of quizResults) {
        if (!quizScores[r.course_id]) {
            quizScores[r.course_id] = `${r.score}/${r.total}`;
        }
    }

    if (Object.keys(byCourse).length === 0) {
        grid.innerHTML = `<div class="empty-state">Du har inte öppnat något material än.</div>`;
        return;
    }

    grid.innerHTML = Object.entries(byCourse).map(([courseId, opened]) => {
        const courseName = COURSE_NAMES[courseId] || courseId;
        const items = COURSE_CONTENT_TYPES.map(type => {
            const done = opened.has(type);
            const labels = CONTENT_LABELS[type] || { done: type, todo: type };
            // For quiz: append score if available
            let label = done ? labels.done : labels.todo;
            if (type === 'quiz' && done && quizScores[courseId]) {
                label += ` – ${quizScores[courseId]}`;
            }
            return `<div class="progress-item">
                <span style="${done ? 'color:#f1f5f9' : 'color:rgba(255,255,255,0.3)'}">${label}</span>
            </div>`;
        }).join('');

        return `<div class="progress-card">
            <h4>${courseName}</h4>
            ${items}
        </div>`;
    }).join('');
}

// ── RENDER: Quiz results ──────────────────────────────────────
function renderQuizResults(results) {
    const container = document.getElementById('quiz-results-list');

    if (results.length === 0) {
        container.innerHTML = `<div class="empty-state">Inga quiz-resultat än. Gör ett quiz!</div>`;
        return;
    }

    container.innerHTML = results.map(r => {
        const pct = Math.round((r.score / r.total) * 100);
        const stars = pct >= 90 ? '⭐⭐⭐' : pct >= 60 ? '⭐⭐' : '⭐';
        const courseName = COURSE_NAMES[r.course_id] || r.course_id;
        return `<div class="quiz-result-row">
            <div>
                <div class="quiz-course-name">${courseName}</div>
                <div class="quiz-date">${formatDate(r.completed_at)}</div>
            </div>
            <div style="text-align:right;">
                <div class="quiz-score">${r.score}/${r.total} ${stars}</div>
                <div style="font-size:0.8rem; color:rgba(255,255,255,0.4)">${pct}%</div>
            </div>
        </div>`;
    }).join('');
}

// ── RENDER: Chat history ──────────────────────────────────────
function renderChatHistory(rows) {
    const container = document.getElementById('chat-history-list');

    if (rows.length === 0) {
        container.innerHTML = `<div class="empty-state">Inga AI-Mentor konversationer än.</div>`;
        return;
    }

    container.innerHTML = rows.map(r => `
        <div class="chat-row">
            <span class="chat-role ${r.role}">${r.role === 'user' ? 'Du' : 'AI'}</span>
            <span class="chat-message">${r.message.slice(0, 120)}${r.message.length > 120 ? '…' : ''}</span>
            <span class="chat-time">${formatDate(r.created_at)}</span>
        </div>
    `).join('');
}

// ── MAIN: Load all data ───────────────────────────────────────
async function loadProfileData() {
    const user = await waitForUser();
    if (!user) {
        // auth.js will redirect to login if not authenticated
        return;
    }

    // Fetch all data in parallel for speed
    const [profileRes, progressRes, quizRes, chatRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('progress').select('*').eq('user_id', user.id).order('opened_at', { ascending: false }),
        supabase.from('quiz_results').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }),
        supabase.from('chat_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)
    ]);

    // Render each section
    renderProfile(profileRes.data, user);
    renderProgress(progressRes.data || [], quizRes.data || []);
    renderQuizResults(quizRes.data || []);
    renderChatHistory(chatRes.data || []);
}

// Start loading when the page is ready
loadProfileData();
