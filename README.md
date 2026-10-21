# UAtlas — Your codebase, answered
Agentic RAG developer copilot that understands code, commits, PRs, issues and docs, not just files.
Built by Nikhil Chary Sriramoju.

**Pipeline:** GitHub API ingest → smart chunking (function/class/heading) + metadata (author, PR, date) → Gemini embeddings → hybrid search (BM25 + vectors, reciprocal rank fusion) → agent loop (plan → retrieve → LLM rerank → reflect/re-search → cited answer) via free Groq (Llama 3.3 70B), with Gemini as fallback.

**Extras:** assistant chat mode, voice input, chat export, visible agent trace, source citations linking to GitHub, terminal CLI (`cli/ask-repo.mjs`), GitHub Actions deploy.

## Run
Open `index.html` (or serve with `python -m http.server`). Press Settings and paste free keys:
Groq https://console.groq.com/keys, Gemini https://aistudio.google.com/apikey. Keys stay in your browser.

## Deploy on GitHub Pages
1. Create a public repo, e.g. `uatlas`. 2. Upload all files from this zip (including `.github` and `.nojekyll`) to `main`.
3. Settings → Pages → Source: **GitHub Actions** (or "Deploy from a branch" → main / root). 4. Open `https://<user>.github.io/uatlas/`.

Limits: public repos only; 60 unauthenticated GitHub requests/hour (add a token in Settings); top 40 files and the 250 most relevant chunks are embedded to stay within free quotas.

## v2 additions
Verifier agent (grounding score), slash commands (`/summary /onboard /changelog /risks /insights /reindex /clear`), insights dashboard, IndexedDB cache (6 h), installable offline PWA, text-to-speech, Ctrl+K focus, strict CSP, Slack bot (`integrations/slack-bot.mjs`, Dockerfile) and CLI.

## v3
NEURAL-style looping video hero (remote CloudFront assets, Sora variable font via Google Fonts, glass CTA, entrance sequence), credentials panel, Open Graph tags, 404 redirect. To self-host the font, place `sora-variable.ttf` in `assets/fonts/` and add an @font-face.

## v4
Full scrolling site, working click targets, first-run key prompt, image analysis, `docker compose up` (web + PyTorch CNN vision service on :8001 + Slack bot). The CNN is a pretrained ImageNet ResNet18 demo endpoint; swap in your own fine-tuned weights.

## v5
Model auto-discovery (Google retired gemini-2.5-flash on 16 Oct 2026, causing 404s), chat works before indexing, mobile layout fixed, key test on Save, builder credentials, `.env.example`, CI workflow, SECURITY.md, robots/sitemap, compose healthchecks.
