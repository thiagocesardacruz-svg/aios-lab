# Local Tools Auto-Use (Summary)

## TL;DR
Agents MUST automatically use local tools (€0 cost) for media/document processing instead of external APIs. Available: whisper.cpp (audio), Tesseract (OCR), pdftotext, Pandoc, Calibre (ebooks), Ollama (simple LLM), FFmpeg.

## Critical Rules
- MUST: Use local tools for audio transcription, OCR, PDF extraction, ebook conversion
- MUST: Use `transcribe.mjs`, `ocr.mjs`, `pdf-extract.mjs`, `ebook-etl.mjs` scripts
- SHOULD: Track cost savings when using local tools
- NEVER: Use external paid APIs when equivalent local tool exists

## Auto-Use Matrix

| Task Pattern | Tool | Command |
|--------------|------|---------|
| Audio transcription | whisper.cpp | `node squads/ops/scripts/transcribe.mjs <file>` |
| OCR / screenshot text | Tesseract | `node squads/ops/scripts/ocr.mjs <file>` |
| Extract PDF text | pdftotext | `node squads/ops/scripts/pdf-extract.mjs <file>` |
| PDF to Markdown | Pandoc | `node squads/ops/scripts/pdf-to-md.mjs <file>` |
| Ebook (EPUB/MOBI) | Calibre | `node squads/ops/scripts/ebook-etl.mjs <file> --to md` |
| Simple summarization | Ollama | `node squads/ops/scripts/llm-local.mjs "<prompt>"` |

**When NOT to use:** Complex reasoning, code generation, quality-critical tasks (stay with Claude).

## Full Documentation
See: `docs/rules/local-tools-auto-use-full.md` for decision tree, tool locations, examples, and deterministic scripts that replace AI agents.

Config: `squads/ops/config/local-tools.json`
