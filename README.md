# Future Mood Inference Engine

Gemini-powered triage tool that turns quick emotional check-ins into tailored multimedia support—breathing practices, curated visuals, links, and crisis resources mapped to the ten inference rules you provided.

## Features
- **Gemini classification**: the server sends each submission to Gemini (free tier friendly) to pick the best-fit rule and severity level; a rule-based safety net handles outages.
- **Multimedia library**: curated Unsplash images, videos, playlists, and hotline links aligned with the ten response rules.
- **Breathing + micro-steps**: reusable guides (box breathing, 4-7-8, progressive relaxation) plus AI-generated micro steps for extra grounding.
- **Crisis-first logic**: instant routing to emergency info whenever users mention HELP or self-harm.
- **Responsive UI**: single-page experience with live intensity slider feedback and scroll-to-response behavior.

## Getting started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment**
   - Copy `.env.example` → `.env`.
   - Paste your Gemini API key into `GEMINI_API_KEY`.
   - Optional: tweak `GEMINI_MODEL` or `PORT`.
3. **Run the server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

## Usage
1. Select the closest feeling, set intensity (0–10), add days + optional context.
2. Submit to let Gemini assign the severity level.
3. Review the tailored headline, suggested steps, breathing exercise, image, and resource links. Emergency scenarios display hotline info immediately.

## Tech stack
- Node.js + Express API
- `@google/generative-ai` SDK
- Vanilla HTML/CSS/JS single-page UI

Let me know when you’ve tested it and I’ll help tighten any flows.