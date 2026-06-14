# Universal File Converter

A lightweight, privacy-focused web application for converting files between multiple formats — directly in your browser, with no sign-up, no cloud storage, and no ads.

## Live Demo

Coming soon on Vercel.

## Supported Conversions

| Input  | Output |
|--------|--------|
| DOCX   | Markdown |
| Markdown | PDF |
| Markdown | HTML |
| Markdown | TXT |
| HTML   | Markdown |
| TXT    | Markdown |
| CSV    | JSON |
| JSON   | CSV |

## Features

- Drag & drop file upload
- Instant download of converted file
- Dark mode support
- No user accounts required
- No permanent file storage
- Mobile friendly

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- mammoth — DOCX parsing
- remark / remark-html — Markdown processing
- md-to-pdf — PDF generation
- turndown — HTML to Markdown
- papaparse — CSV / JSON conversion

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

src/

├── app/

│   ├── page.tsx

│   └── api/convert/route.ts

├── components/

│   ├── UploadArea.tsx

│   ├── FormatSelector.tsx

│   ├── ProgressBar.tsx

│   └── DownloadButton.tsx

├── lib/

│   ├── converters/

│   └── validation.ts

├── types/

│   └── conversion.ts

└── utils/

└── fileHelpers.ts

## Deployment

Deploy instantly on [Vercel](https://vercel.com). No environment variables or database setup required.

## License

MIT