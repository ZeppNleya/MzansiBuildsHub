# MzansiBuilds

> A platform for developers to build in public, share progress, and collaborate – built for the Derivco Code Skills Challenge.

![GitHub repo size](https://img.shields.io/github/repo-size/your-username/mzansi-developer-hub)
![GitHub language count](https://img.shields.io/github/languages/count/your-username/mzansi-developer-hub)
![License](https://img.shields.io/badge/license-MIT-green)

## Table of Contents
- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Assessment Criteria](#assessment-criteria)
- [Author](#author)

## Overview

**MzansiBuilds** is a full‑stack web application that allows developers to:

- Create an account and manage their profile
- Share projects they are working on, including current stage and required support
- See a live feed of what other developers are building
- Comment on projects to request collaboration
- Add milestone updates to their own projects
- Celebrate completed projects on a dedicated **Celebration Wall**

The design follows a green (#2E7D32), white (#FFFFFF), and black (#1A1A1A) theme.

## Live Demo

[Deployed frontend URL – add if deployed]  
[API endpoint – add if deployed]

## Features

- 🔐 **User authentication** – Sign up, log in, profile management (powered by Clerk)
- 📝 **Project management** – Create, read, update, and delete projects with stage (Planning / Building / Review / Completed) and support needed
- 📡 **Live feed** – Real‑time view of all projects from all developers
- 💬 **Collaboration requests** – Logged‑in users can comment on any project
- 🎯 **Progress milestones** – Project owners can add milestone achievements
- 🎉 **Celebration Wall** – Automatically lists projects marked as "Completed"

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, TypeScript, Vite, TailwindCSS, shadcn/ui |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL with Drizzle ORM |
| **Authentication** | Clerk (JWT) |
| **Validation** | Zod |
| **API Client** | Generated OpenAPI client (`lib/api-client-react`) |
| **Package Manager** | pnpm (monorepo) |
| **Version Control** | Git + GitHub |

## Project Structure
Mzansi-Developer-Hub/
├── artifacts/
│ ├── api-server/ # Backend Express server
│ │ ├── src/
│ │ │ ├── routes/ # API endpoints (projects, stats, health)
│ │ │ ├── middlewares/ # Clerk auth middleware
│ │ │ └── lib/ # Logger etc.
│ │ └── package.json
│ └── mzansi-builds/ # Frontend React app
│ ├── src/
│ │ ├── pages/ # Feed, Celebration, NewProject, Profile
│ │ ├── components/ # UI components (shadcn)
│ │ └── hooks/
│ └── package.json
├── lib/
│ ├── db/ # Drizzle schema & database client
│ ├── api-zod/ # Zod validation schemas
│ ├── api-spec/ # OpenAPI specification
│ └── api-client-react/ # Generated React hooks for API
├── scripts/ # Utility scripts
├── pnpm-workspace.yaml # Monorepo configuration
└── package.json # Root package.json

text

## Setup Instructions

### Prerequisites

- Node.js 18+
- pnpm (install globally: `npm install -g pnpm`)
- PostgreSQL (or use a cloud instance like Render or Supabase)
- Clerk account (for authentication keys)

### Clone the repository

```bash
git clone https://github.com/your-username/mzansi-developer-hub.git
cd mzansi-developer-hub
Install dependencies
bash
pnpm install
Environment Variables
Create a .env file in the root of each package that needs secrets. At minimum:

Backend (artifacts/api-server/.env):

env
DATABASE_URL=postgresql://user:password@localhost:5432/mzansi_builds
CLERK_SECRET_KEY=your_clerk_secret_key
PORT=3001
Frontend (artifacts/mzansi-builds/.env):

env
VITE_API_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
Set up the database
Run migrations (Drizzle):

bash
cd lib/db
pnpm run migrate
Run the application
In separate terminals:

Backend (from project root):

bash
cd artifacts/api-server
pnpm run dev
Runs on http://localhost:3001

Frontend:

bash
cd artifacts/mzansi-builds
pnpm run dev
Runs on http://localhost:5173

Testing
Unit & integration tests (Vitest):

bash
pnpm test
End‑to‑end tests (Playwright – if configured):

bash
pnpm run test:e2e
Tests run automatically on every commit via a pre‑commit hook.

Deployment
Backend (Render)
Push the repository to GitHub.

Create a new Web Service on Render, connect your repo.

Set the root directory to artifacts/api-server.

Add environment variables (DATABASE_URL, CLERK_SECRET_KEY, etc.).

Deploy.

Frontend (Netlify / Vercel)
Connect your GitHub repository.

Set the base directory to artifacts/mzansi-builds.

Build command: pnpm run build

Publish directory: dist

Add environment variables (VITE_API_URL, VITE_CLERK_PUBLISHABLE_KEY).

Assessment Criteria
Criterion	How this project addresses it
Project Profiling	Clear entity models, user stories, and architecture defined before coding.
Code Version Control	Full Git history with descriptive commits, hosted on GitHub.
Test-Driven Development	Unit, integration, and E2E tests written before or alongside features.
Secure By Design	Environment variables, Clerk auth, Zod validation, parameterised queries.
Documentation	This README, plus OpenAPI spec and inline code comments.
User Centricity	Green/white/black theme, intuitive navigation, celebration wall.
Efficiency	Monorepo with shared libraries, code generation from OpenAPI.
Resourcefulness	Free tiers of Render, Netlify, Clerk, and PostgreSQL.
Author: ZeppNleya

Built for the Derivco Code Skills Challenge – 2026



---
