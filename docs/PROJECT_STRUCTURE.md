# Project Structure

This repository is organized by responsibility so contributors can quickly find the right area to work in.

## Top Level

```text
VARtificial-Intelligence/
├── backend/                # Flask API and model-serving logic
├── docs/                   # Additional project documentation
├── notebooks/              # Jupyter notebooks for experiments/training
├── public/                 # Static assets served by Vite
├── src/                    # Frontend application source
├── CHANGELOG.md            # Project release history
├── CONTRIBUTING.md         # Contribution guidelines
├── README.md               # Main project overview and quick start
└── package.json            # Frontend scripts and dependencies
```

## Frontend (`src/`)

Current code uses a feature-oriented split:

```text
src/
├── core/                   # Application shell, entrypoint, and global styles
├── features/               # Feature-specific services and Python utilities
│   ├── python/
│   └── services/
├── lib/                    # Shared helper utilities
└── shared/                 # Reusable UI components, pages, and domain utilities
    ├── components/
    ├── pages/
    ├── services/
    └── utils/
```

To make future growth cleaner, placeholder directories are provided for gradual migration:

```text
src/
├── app/                    # Future app setup/config modules
├── assets/                 # Future colocated frontend assets
├── components/             # Future app-level reusable components
├── pages/                  # Future route-level pages
├── services/               # Future shared service layer
├── types/                  # Future shared TS type definitions
└── utils/                  # Future frontend utility modules
```

## Backend (`backend/`)

```text
backend/
├── app.py                  # Flask application and API routes
├── model.py                # ML model training/inference logic
├── requirements.txt        # Python dependencies for backend
├── runtime.txt             # Python runtime target for hosting
└── README.md               # Backend setup/deployment documentation
```

## Notes

- Existing import paths remain unchanged.
- The new `src/*` placeholder folders are non-breaking and support staged refactoring.
