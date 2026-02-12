// Real data fetched from NotebookLM "Introduktion till AI"
window.notebookData = {
    podcast: {
        title: "Så lär sig maskiner att tänka",
        url: "https://lh3.googleusercontent.com/notebooklm/ANHLwAyPCdCdFhkU_3irE4t0Po-qt5kKvHYQDjFoWgzmEMz2TafSKyqaa-nAOpqno0voq4FhYDXHc6A-ahoXD8Zgtds77Ddf4s3AWdoH9CHlDY1nBBFRVYEByDzLc2P3lMmlcgYzxnTJOHxX_dN7Rnf92rRtwNM0cVM=m140",
        description: "En djupdykning i hur maskininlärning och neurala nätverk efterliknar den mänskliga hjärnan."
    },
    infographic: {
        title: "Introduktion till AI:s grunder",
        imageUrl: "https://lh3.googleusercontent.com/notebooklm/ANHLwAyMt3k84oOa1X3z3Qz4HkIGZVzH7Eico1b8JZnpzNnuZC6hL3dJYtJp8ARIOVdfXkDwcrQRUJOSAV0Js2GFY9KfvfJ2CeVEQqgP7uCbVGtZGzPRrnTCxs9EuP-gu6cr87DH8CwrDSUgxZnQpwjm6Mp04tSbMQ=w2752-d-h1536-mp2",
        summary: "En informativ översikt över AI:s historia, hierarki, funktionssätt, prompt engineering och etiska utmaningar.",
        details: [
            "AI-Hierarki: AI -> Machine Learning -> Deep Learning -> Generativ AI",
            "Milstolpar: 1950 Turingtestet, 1956 AI-termen myntas, 2022 ChatGPT tillgängligt",
            "Kapacitetsnivåer: Narrow AI (specialist), General AI (mänsklig), Super AI (övermänsklig)",
            "Modellparametrar: GPT-3 (175 miljarder) vs GPT-4 (1,7 biljoner)",
            "Lärandemetoder: Övervakad, Oövervakad, Förstärkningsinlärning",
            "Prompt Engineering: ASPEECT-fomeln (Action, Steps, Persona, Examples, Context, Constraints, Template)",
            "Etik: Deepfakes, Upphovsrätt, Datasekretess, Black Box-problemet"
        ]
    },
    report: {
        title: "Briefingrapport: Introduktion till AI och Generativ AI",
        content: `
# Briefingrapport: Introduktion till Artificiell Intelligens och Generativ AI

## Executive Summary
Denna rapport sammanställer kärnkoncepten och de tekniska grunderna för artificiell intelligens (AI), med särskilt fokus på framväxten av Generativ AI. AI har utvecklats från tidiga regelbaserade system till dagens avancerade neurala nätverk som kan skapa nytt, unikt innehåll. En central insikt är att Generativ AI är en delmängd av Deep Learning (djupinlärning), som i sin tur bygger på Machine Learning (maskininlärning). För att effektivt kunna använda och kommunicera med dessa system krävs förståelse för "Prompt Engineering" och de underliggande språkmodellerna (LLM). Dokumentet belyser även de etiska utmaningarna, särskilt problematiken kring "Black Box"-beslut och behovet av transparens.

---

## 1. AI:s historia och tekniska utveckling
AI-fältet har genomgått en transformation från enkel beräkningskraft till system som efterliknar mänskligt tänkande.

*   **Viktiga milstolpar:**
    *   **1950-talet:** Alan Turing introducerar Turingtestet för att mäta en maskins förmåga till intelligent beteende. Termen "Artificiell Intelligens" myntas vid Dartmouth-konferensen 1956.
    *   **IBM:s genombrott:** 1997 besegrar *Deep Blue* världsmästaren i schack genom råstyrka och lagrad data. 2011 vinner *Watson* i frågesporten Jeopardy! genom att bearbeta naturligt språk.
    *   **Googles revolution (2016):** *AlphaGo* besegrar världsmästaren i Go. Till skillnad från IBM:s tidigare system använde AlphaGo **neurala nätverk**, vilket möjliggjorde hantering av extremt komplexa mönster som schackdatorer inte klarade av.
*   **Neurala nätverk:** Detta markerar skiftet till modern AI. Istället för enbart regler lär sig systemen mönster i data, likt den mänskliga hjärnan.

---

## 2. Hierarkin inom Artificiell Intelligens
För att förstå Generativ AI krävs en tydlig bild av hur de olika teknikerna hänger ihop:

1.  **Artificiell Intelligens (AI):** Den övergripande förmågan hos maskiner att imitera intelligent mänskligt beteende.
2.  **Machine Learning (ML):** En delmängd av AI där datorer lär sig fatta beslut från data utan att vara explicit programmerade för varje specifik uppgift.
3.  **Deep Learning (DL):** En teknik inom ML som använder djupa neurala nätverk (många lager) för att simulera hjärnans struktur.
4.  **Generativ AI:** Den senaste utvecklingen inom DL som kan skapa nytt innehåll (text, bild, kod) snarare än att bara klassificera existerande data.

---

## 3. Maskininlärning och Djupinlärning
Kärnan i hur AI lär sig delas upp i tre huvudmetoder inom maskininlärning:

*   **Supervised Learning (Övervakad inlärning):** Modellen tränas med märkta data (en "lärare" berättar att "detta är en hund"). Används för ansiktsigenkänning och taligenkänning.
*   **Unsupervised Learning (Oövervakad inlärning):** Modellen får leta efter mönster själv i omärkt data. Används för kundsegmentering och att upptäcka avvikelser i cybersäkerhet.
*   **Reinforcement Learning (Förstärkningsinlärning):** En "agent" lär sig genom försök och misstag (belöningar och bestraffningar), likt hur man tränar en hund. Används i AlphaGo och för algoritmer i aktiehandel.

---

## 4. Generativ AI och Stora Språkmodeller (LLM)
Generativ AI skiljer sig från traditionell AI genom sin förmåga att skapa unika lösningar och innehåll.

### Large Language Models (LLM)
LLM är en typ av maskininlärningsmodell tränad på enorma mängder text för att förutsäga nästa ord i en sekvens.
*   **Transformers (2017):** Den banbrytande arkitekturen från Google som möjliggjorde för modeller att hantera långa sekvenser av data och bibehålla kontext genom "self-attention". Utan denna teknik skulle dagens ChatGPT inte kunna föra sammanhängande samtal.
*   **Tokenisering:** Processen att dela upp text i mindre enheter (tokens). GPT-4 kan hantera upp till 8 000 tokens, vilket möjliggör analys av mycket långa dokument.

---

## 5. Prompt Engineering: ASPEECT-modellen
Prompt Engineering är konsten att utforma instruktioner för att få bästa möjliga resultat från en AI. En effektiv metod är att använda en **Mega Prompt** baserad på formeln **ASPEECT**:

*   **Action (Åtgärd):** Vad ska utföras? (t.ex. "Skapa en läroplan")
*   **Steps (Steg):** Specifika steg för åtgärden.
*   **Persona (Person):** Vilken roll ska AI:n simulera? (t.ex. "Erfaren lärare")
*   **Examples (Exempel):** In- eller utmatningsexempel för att guida stilen.
*   **Context (Sammanhang):** Situationen kring åtgärden.
*   **Constraints (Begränsningar):** Vad som inte får göras (t.ex. tidsramar eller budget).
*   **Template (Mall):** Det önskade formatet för svaret.

---

## 6. Etik och utmaningar
Användningen av Generativ AI medför betydande etiska överväganden:

*   **Rättvisa och fördomar:** Risken att AI-system diskriminerar baserat på ras eller kön om träningsdatan är partisk.
*   **Transparens och ansvar:** Problemet med AI som en "Black Box" – det kan vara omöjligt att förklara exakt *varför* ett system nekade ett banklån, vilket skapar ansvarskonflikter.
*   **Hallucinationer:** När AI:n hittar på fakta eller ger ett felaktigt svar med stort självförtroende istället för att erkänna att den inte vet.
        `
    },
    quiz: {
        title: "AI-Kunskapstest",
        questions: [
            {
                qCode: "Q1",
                question: "Vilket av följande är Generativ AI en delmängd av?",
                options: ["Narrow AI", "Deep Learning", "Reaktiva maskiner", "Super AI"],
                answer: "Deep Learning",
                explanation: "Generativ AI är den senaste utvecklingen inom Deep Learning som kan skapa nytt innehåll."
            },
            {
                qCode: "Q2",
                question: "Vilket år markerade en revolution för AI när AlphaGo besegrade världsmästaren i Go?",
                options: ["1950", "1997", "2016", "2022"],
                answer: "2016",
                explanation: "2016 besegrade AlphaGo världsmästaren genom att använda avancerade neurala nätverk."
            },
            {
                qCode: "Q3",
                question: "Vad kallas metoden där en AI lär sig genom försök och misstag (belöningar/bestraffningar)?",
                options: ["Övervakad inlärning", "Oövervakad inlärning", "Förstärkningsinlärning", "Prompt Engineering"],
                answer: "Förstärkningsinlärning",
                explanation: "Förstärkningsinlärning (Reinforcement Learning) fungerar likt att träna en hund med belöningar."
            },
            {
                qCode: "Q4",
                question: "Vilken arkitektur från Google (2017) möjliggjorde moderna språkmodeller genom 'self-attention'?",
                options: ["Deep Blue", "Transformers", "Neurala nätverk", "Turing-arkitektur"],
                answer: "Transformers",
                explanation: "Transformers-arkitekturen är grunden för nästan all modern Generativ AI och LLM:er."
            },
            {
                qCode: "Q5",
                question: "I ASPEECT-formeln för Prompt Engineering, vad står 'A' för?",
                options: ["Agent", "Algorithm", "Action", "Artificial"],
                answer: "Action",
                explanation: "Action beskriver vad som ska utföras, t.ex. 'Sammanfatta' eller 'Skapa'."
            },
            {
                qCode: "Q6",
                question: "Vad innebär 'Black Box'-problemet inom AI?",
                options: ["Att AI:n är svart", "Att vi inte kan förklara hur AI:n kom fram till ett beslut", "Att AI:n saknar internminne", "Att AI-modeller kräver för mycket ström"],
                answer: "Att vi inte kan förklara hur AI:n kom fram till ett beslut",
                explanation: "Det är ofta omöjligt att spåra de exakta logiska stegen i ett djupt neuralt nätverk."
            },
            {
                qCode: "Q7",
                question: "Vad kallas det när en AI hittar på fakta med stort självförtroende?",
                options: ["Bias", "Deepfake", "Tokenisering", "Hallucination"],
                answer: "Hallucination",
                explanation: "Hallucinationer uppstår när modellen förutsäger ord som låter rätt men är faktamässigt fel."
            }
        ]
    }
};
