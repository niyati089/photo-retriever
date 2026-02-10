# Photo Retriever Backend

Production-grade FastAPI backend for the intelligent photo retrieval system.

## Overview

This backend provides a clean, async-first API with:
- **FastAPI** for high-performance async endpoints
- **uv** for fast, reproducible dependency management
- **Pydantic Settings** for environment-based configuration
- **Structlog** for structured JSON logging
- **CORS** support for frontend integration

## Prerequisites

- Python 3.11+
- [uv](https://github.com/astral-sh/uv) package manager

## Installation

1. Install dependencies:
```bash
uv sync
```

2. Create environment file:
```bash
cp .env.example .env
```

3. (Optional) Adjust settings in `.env` as needed

## Running the Server

### Development Mode
```bash
uv run uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`

### Production Mode
```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Environment-based configuration
│   ├── core/
│   │   ├── __init__.py
│   │   └── logging.py       # Structured logging setup
│   └── routes/
│       ├── __init__.py
│       └── health.py        # Health check endpoint
├── .env.example             # Environment variable template
├── pyproject.toml           # Project dependencies
└── README.md
```

## Available Endpoints

- `GET /` - API information
- `GET /health` - Health check (returns `{"status": "healthy"}`)

## What's Next

This is Phase 1 (Day 2-3) - Backend Framework Setup. Future additions will include:
- Authentication & authorization
- MongoDB integration
- Pinecone vector database
- Face detection & matching logic
- Photo upload & retrieval endpoints

## Development Notes

- All environment variables are loaded via `pydantic-settings`
- Logging is configured on application startup using structlog
- CORS is enabled for frontend integration (configure via `CORS_ORIGINS`)
- No database or authentication logic is included yet (added in later phases)

