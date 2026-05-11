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

```
expense-tracker/
├── frontend/   — React web app
├── mobile/     — React Native iOS + Android
├── backend/    — FastAPI
└── shared/     — Shared types and constants
```

## Branching Strategy

| Branch | Purpose |
|---|---|
| main | Production — protected, no direct pushes |
| staging | Pre-production integration |
| develop | Active development target |
| feature/* | All new work |
| fix/* | Bug fixes |



# Summary of what each Supabase credential is used for

| Credential | Used by | Risk if exposed |
|---|---|---|
| Project URL | Frontend, Mobile, Backend | Low — not a secret |
| Anon key | Frontend, Mobile | Low — RLS policies protect data |
| Service role key | Backend only | Critical — full DB access |
| Database URL | Backend only | Critical — direct DB connection |

## Summary of what Vercel is now providing

| Capability | Status |
|---|---|
| Frontend hosting | Ready — deploys from GitHub automatically |
| Branch preview deployments | Active for all branches |
| Environment variable injection | Configured with Supabase credentials |
| CI/CD token | Collected and ready for GitHub Actions |

## Summary of What Railway Is Now Providing

| Capability | Status |
|---|---|
| Backend hosting | Project created, ready to receive the FastAPI service |
| GitHub integration | Connected, auto-deploy on push configured |
| Environment variables | Supabase credentials injected at runtime |
| CI/CD token | Collected and ready for GitHub Actions |