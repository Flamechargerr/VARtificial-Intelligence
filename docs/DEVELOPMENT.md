# Development Guide

## Prerequisites

- Node.js 18+
- npm 9+
- Python 3.11+

## Local Setup

1. Install frontend dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

3. Configure environment variables:

```bash
cp .env.example .env.local
```

## Running the Project

### Backend

```bash
cd backend
python app.py
```

### Frontend

```bash
npm run dev
```

## Build and Lint

```bash
npm run build
npm run lint
```

> Note: lint currently depends on ESLint flat config compatibility in `package.json` script flags.

## Troubleshooting

- If frontend cannot reach backend, confirm `VITE_API_URL` in `.env.local`.
- If Python dependencies fail to install, confirm your environment uses Python 3.11+.
- If lint command fails with CLI option errors, use an ESLint version/script combination that supports flat config options.
