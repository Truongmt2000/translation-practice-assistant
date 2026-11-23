# Translation Practice Assistant (RAG Capstone)

A Streamlit chatbot that answers questions about a small translation practice using only five handbook documents. It retrieves handbook chunks from ChromaDB, filters weak matches, generates an answer with citations, and refuses questions the documents do not support.

## Application identity

- **Name:** Translation Practice Assistant
- **Purpose:** Help the owner follow in-house rules for quoting, files, quality, billing, and client communication
- **Documents:** five `.txt` handbook sections in `docs/` (also copied to `capstone_docs/` next to the running app)

## Pipeline

**Document → Load → Clean → Chunk → Embed → Store → Query → Retrieve → Filter → Generate → Cite**

| Stage | What happens |
|-------|----------------|
| Load | Read each `.txt`. Missing or empty files are reported; the app does not crash. |
| Clean | Remove the handbook title, page-number-only lines, `Source:` header lines, extra spaces, and broken line breaks. |
| Chunk | Split on paragraphs. Long paragraphs are cut at about **450** characters with **80** characters of overlap so a rule is not split without context. Each chunk keeps `source`, `section`, `page`, and `chunk_id`. |
| Embed | `text-embedding-3-small` for chunks **and** for user questions. |
| Store | Persistent ChromaDB (`capstone_chroma_db`). Documents are embedded when you click **Build / refresh knowledge base**, not on every question. |
| Query | Only the new question is embedded. |
| Retrieve | Semantic search, Top-K = **3**. |
| Filter | Distance threshold **1.00** (tuned: handbook rush-job question passes; pancake recipe fails). |
| Generate | OpenAI model receives the question **plus** accepted chunks and a grounding system prompt. |
| Cite | Answer cites filename and section. **View Sources** shows chunk text, page, id, and distance. |

## Secure API key

The key is **not** in Python. Locally it lives in `.streamlit/secrets.toml`:

```toml
OPENAI_API_KEY = "your-key-here"
```

Never commit that file. `.gitignore` excludes it.

## How to run locally

```powershell
cd "C:\Users\tmt00\iCloudDrive\AI Python"
.\.venv\Scripts\python.exe -m streamlit run app.py
```

1. Sidebar should say the API key loaded.
2. Click **Build / refresh knowledge base** once.
3. Ask questions in the chat box.

## Chunking choice (for the oral / README question)

Paragraph chunks keep each policy together. Overlap of 80 characters covers a sentence that starts at the end of one paragraph and finishes in the next. 450 characters is small enough for retrieval but large enough for a full rule (for example the 24-hour rush rule).

## Test plan (10 questions)

Fill the Result column after you run `app.py` (not the old Lesson 18 lab).

| # | Type | Question | Result |
|---|------|----------|--------|
| 1 | Direct | When must a client approve a quote, and what counts as a rush job? | Pass — bullets with sources (rush under 24 hours, written confirmation, quote before work) |
| 2 | Direct | How long are working copies kept after a job is complete? | Pass — 90 days, with source |
| 3 | Direct | What are the office hours for client messages? | Pass — Mon–Fri 9 AM–5 PM PT, with source |
| 4 | Paraphrase | Do I have to get a yes from the customer before I start translating? | Pass at threshold 1.20 — client must approve the quote first, with source |
| 5 | Paraphrase | Where am I allowed to save the client’s files? | Pass — approved project folder only; not USB; do not share customer info; with sources |
| 6 | Misspelled | how long are wrking copys kept after a job is comlete? | Pass — still 90 days with sources despite typos |
| 7 | Two sections | When must late delivery be flagged, and what items are listed on the invoice? | Pass — delay flagged as soon as known; invoice contents; sources from more than one section |
| 8 | Two sections | Can a client get a second revision round after 10 days, and what do I say if they ask for video subtitles? | Pass — new quote after 10 days / extra text; subtitles not offered; both with sources |
| 9 | Irrelevant | Give me a pancake recipe. | Pass — refused; no recipe |
| 10 | Irrelevant | Who won the latest championship? | Pass — refused; no sports answer |

Expected: 1–8 grounded in the handbook with sources. 9–10 refuse with the fallback sentence.

**Settings used:** embedding `text-embedding-3-small`, Top-K = **5**, distance threshold = **1.20**. Threshold 1.00 refused a paraphrase; 1.20 still refused pancake and championship questions.

## Submission notes

- Run file for Canvas: `app.py`
- Documents: `docs/` or `capstone_docs/`
- Do not upload `.streamlit/secrets.toml`
- Streamlit Community Cloud URL: add here after deploy
