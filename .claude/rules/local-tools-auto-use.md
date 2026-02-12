# Local Tools Auto-Use Rules

## Overview

Agents SHOULD automatically use local tools for eligible tasks to save costs. These tools run 100% offline and cost €0 per use.

## Auto-Use Matrix

When encountering these tasks, agents MUST use local tools instead of external APIs:

| Task Pattern | Auto-Use Tool | Command |
|--------------|---------------|---------|
| "transcrever", "transcribe", "áudio para texto" | whisper.cpp | `node squads/ops/scripts/transcribe.mjs <file>` |
| "OCR", "extrair texto de imagem", "ler screenshot" | Tesseract | `node squads/ops/scripts/ocr.mjs <file>` |
| "extrair texto de PDF", "ler PDF" | pdftotext | `node squads/ops/scripts/pdf-extract.mjs <file>` |
| "PDF para markdown", "converter PDF para MD" | Pandoc | `node squads/ops/scripts/pdf-to-md.mjs <file>` |
| "ebook", "epub", "mobi", "kindle", "livro digital" | Calibre | `node squads/ops/scripts/ebook-etl.mjs <file> --to md` |
| "resumir texto simples", "traduzir frase" | Ollama | `node squads/ops/scripts/llm-local.mjs "<prompt>"` |
| "converter áudio/vídeo", "extrair áudio" | FFmpeg | `ffmpeg -i <input> <options> <output>` |

## Decision Tree

```
User request involves processing media/documents?
│
├─ Audio/Video transcription?
│   └─ YES → Use transcribe.mjs (whisper.cpp)
│
├─ Image with text (screenshot, scan)?
│   └─ YES → Use ocr.mjs (Tesseract)
│
├─ PDF document?
│   ├─ Extract text only? → Use pdf-extract.mjs (pdftotext)
│   └─ Convert to Markdown? → Use pdf-to-md.mjs (Pandoc)
│
├─ Ebook (EPUB, MOBI, AZW, Kindle)?
│   └─ YES → Use ebook-etl.mjs (Calibre)
│            Supports 15+ formats, extracts metadata
│
├─ Simple text task (summarize, translate, format)?
│   └─ YES → Consider llm-local.mjs (Ollama)
│            Only for simple tasks; complex reasoning stays with Claude
│
└─ Media conversion needed?
    └─ YES → Use FFmpeg directly
```

## When NOT to Use Local Tools

1. **Complex reasoning** - Keep using Claude for multi-step analysis
2. **Code generation** - Claude is better for code tasks
3. **Context-heavy tasks** - When full conversation context is needed
4. **Quality-critical** - When highest accuracy is required (use Whisper API)

## Cost Savings Tracking

When using local tools, agents SHOULD log the savings:

```bash
# In task comments or completion notes
Custo evitado: ~€X.XX (usou whisper.cpp local vs Whisper API)
```

## Tool Locations

| Tool | Binary Path |
|------|-------------|
| whisper-cli | `C:\tools\whisper.cpp\Release\whisper-cli.exe` |
| whisper model | `C:\tools\whisper.cpp\models\ggml-base.bin` |
| tesseract | `C:\Program Files\Tesseract-OCR\tesseract.exe` |
| pdftotext | System PATH (Poppler) |
| ollama | `C:\Users\thiag\AppData\Local\Programs\Ollama\ollama.exe` |
| ffmpeg | WinGet package path |

## Configuration

Full config with all paths: `squads/ops/config/local-tools.json`

## Examples

### Example 1: User uploads audio file

```
User: "Transcreva esse arquivo de áudio da reunião"

Agent action:
1. Detect: audio transcription task
2. Auto-use: transcribe.mjs
3. Execute: node squads/ops/scripts/transcribe.mjs meeting.mp3 --lang pt
4. Return transcription to user
5. Note: "Custo evitado: ~€0.30 (5 min áudio)"
```

### Example 2: User shares screenshot

```
User: "O que diz nessa imagem?"

Agent action:
1. Detect: OCR task
2. Auto-use: ocr.mjs
3. Execute: node squads/ops/scripts/ocr.mjs screenshot.png --json
4. Return extracted text
5. Note: "Custo evitado: ~€0.05"
```

### Example 3: Simple summary request

```
User: "Resuma esse parágrafo em uma frase"

Agent action:
1. Detect: simple text task
2. Consider: Is this complex reasoning? No
3. Auto-use: llm-local.mjs
4. Execute: node squads/ops/scripts/llm-local.mjs "Resuma em 1 frase: ..."
5. Return summary
6. Note: "Custo evitado: ~€0.01 (usou Llama local)"
```

---

*Local Tools Auto-Use Rules v1.0 - AIOS Cost Optimization*
