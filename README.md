# Universal File Converter

A lightweight, privacy-focused web application for converting files between multiple formats — directly in the browser, with no sign-up, no cloud storage, and no ads.

## Live Demo

[file-converter-self.vercel.app](https://file-converter-self.vercel.app)

## Supported Conversions

| Input    | Output                  |
|----------|-------------------------|
| DOCX     | Markdown, PDF, TXT      |
| Markdown | PDF, HTML, TXT, DOCX    |
| PDF      | Markdown, TXT, DOCX     |
| TXT      | Markdown, DOCX, PDF     |
| CSV      | JSON, PDF               |
| JSON     | CSV, PDF                |

## Features

- Drag & drop file upload
- Instant in-browser download of converted file
- Dark mode support
- No user accounts required
- No permanent file storage — files processed in memory only
- Mobile friendly
- Minimal, clean UI

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- mammoth — DOCX parsing and conversion
- remark / remark-html — Markdown processing
- jsPDF — PDF generation
- unpdf — PDF text extraction
- docx — DOCX generation
- papaparse — CSV parsing
- Custom CSV parser — CSV to JSON / PDF

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

│   │   ├── docxToMd.ts

│   │   ├── docxToPdf.ts

│   │   ├── docxToTxt.ts

│   │   ├── mdToHtml.ts

│   │   ├── mdToPdf.ts

│   │   ├── mdToTxt.ts

│   │   ├── mdToDocx.ts

│   │   ├── pdfToText.ts

│   │   ├── pdfToMd.ts

│   │   ├── pdfToTxt.ts

│   │   ├── pdfToDocx.ts

│   │   ├── txtToMd.ts

│   │   ├── txtToDocx.ts

│   │   ├── txtToPdf.ts

│   │   ├── csvToJson.ts

│   │   ├── csvToPdf.ts

│   │   ├── jsonToCsv.ts

│   │   └── jsonToPdf.ts

│   └── validation.ts

├── types/

│   └── conversion.ts

└── utils/

└── fileHelpers.ts

## Deployment

Deployed on [Vercel](https://vercel.com). No environment variables or database setup required.

## Author

Built by [Jawaid Aziz](https://jawaid-aziz.framer.website/)

## License

MIT