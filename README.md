# Expense Tracker

A full-stack expense tracking application built as an end-to-end framework for production-grade vibe coding.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript (Vite) |
| Mobile | React Native (Expo) |
| Backend | Python + FastAPI |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| CI/CD | GitHub Actions |

## Structure
expense-tracker/
├── frontend/   — React web app
├── mobile/     — React Native iOS + Android
├── backend/    — FastAPI
└── shared/     — Shared types and constants

## Branching Strategy

| Branch | Purpose |
|---|---|
| main | Production — protected, no direct pushes |
| staging | Pre-production integration |
| develop | Active development target |
| feature/* | All new work |
| fix/* | Bug fixes |
