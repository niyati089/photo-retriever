# AI Web Application - Production Grade Monorepo

## Project Overview

This repository hosts the codebase for a production-grade AI web application. The project is designed to be scalable, maintainable, and deployable in a modern cloud environment.

### High-Level Architecture

The system follows a modern microservices-ready architecture:

-   **Frontend**: A Next.js (React) application serving as the user interface, handling user interactions, and communicating with the backend API.
-   **Backend**: A FastAPI (Python) service providing RESTful APIs, handling business logic, and orchestrating AI operations.
-   **Data Services**:
    -   **MongoDB**: Primary database for application data (users, metadata, etc.).
    -   **Pinecone**: Vector database for AI embeddings and similarity search.

All components are containerized and orchestrated for development and production environments.

## Repository Structure: Monorepo

We have chosen a **Monorepo** structure for this project.

### Why Monorepo?

1.  **Shared Types & Contracts**: Allows sharing of data models (e.g., TypeScript interfaces generated from Python Pydantic models) to ensure type safety across the full stack.
2.  **Atomic Changes**: Features usually span frontend and backend. A monorepo allows atomic commits and PRs that cover the entire feature slice, preventing version mismatch issues.
3.  **Unified CI/CD**: Simplifies the build and deployment pipeline. A single pipeline can test and deploy both services, ensuring they are always in sync.
4.  **Easier Dependency Coordination**: dependency management and tooling are centralized, reducing configuration drift between projects.

## Directory Layout

-   `/backend`: FastAPI backend service code.
-   `/frontend`: Next.js frontend application code.
-   `/docs`: Architecture, design, and API documentation.
-   `/scripts`: DevOps, utility, and maintenance scripts.

## Setup Instructions

### Prerequisites

-   Python 3.11+
-   Node.js 18+
-   uv (Python package manager)
-   pnpm or npm

### Getting Started

*Detailed setup instructions for Backend and Frontend will be added in Day 2 and Day 4 respectively.*

See [backend/README.md](./backend/README.md) and [frontend/README.md](./frontend/README.md) for service-specific details.
