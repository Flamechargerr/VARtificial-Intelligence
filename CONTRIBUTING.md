# Contributing to VARtificial Intelligence

Thank you for your interest in contributing to VARtificial Intelligence! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/VARtificial-Intelligence.git
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/Flamechargerr/VARtificial-Intelligence.git
   ```

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or bun package manager
- Git

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (when available)
npm test

# Build for production
npm run build
```

## Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Test your changes locally

4. Commit your changes following our commit guidelines

5. Push to your fork and submit a pull request

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing code style and formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Python (ML Models)

- Follow PEP 8 style guidelines
- Use type hints where applicable
- Document functions with docstrings
- Include references for ML algorithms used

### General Guidelines

- Keep functions small and focused
- Write self-documenting code
- Add comments for complex logic
- Avoid premature optimization

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(models): Add XGBoost classifier to ensemble
fix(prediction): Handle edge case for 0 shots on target
docs(readme): Update installation instructions
refactor(feature-eng): Optimize polynomial feature generation
```

## Pull Request Process

1. Ensure your code follows our coding standards
2. Update documentation if needed
3. Add tests for new functionality
4. Fill out the pull request template
5. Request review from maintainers
6. Address review feedback promptly

### PR Title Format

Use the same format as commit messages:
```
feat(scope): Brief description of changes
```

## Reporting Issues

### Bug Reports

Include the following information:
- Clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Environment details (OS, Node version, browser)
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of the proposed feature
- Use case and motivation
- Possible implementation approach (optional)

## Areas for Contribution

We welcome contributions in the following areas:

### Machine Learning
- New classification algorithms
- Hyperparameter optimization
- Feature engineering improvements
- Model evaluation metrics

### Frontend
- UI/UX improvements
- Accessibility enhancements
- Performance optimization
- New visualizations

### Documentation
- Tutorial content
- API documentation
- Code comments
- Example notebooks

### Testing
- Unit tests
- Integration tests
- End-to-end tests

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

---

Thank you for contributing to VARtificial Intelligence!
