# Multilisting Hub

Build a Turborepo-based monorepo for a property marketplace named Multilisting.
Include:

Apps

web → Next.js (App Router), TypeScript, Tailwind, shadcn/ui

api → NestJS, TypeScript, modular structure

admin (placeholder) → Next.js dashboard reserved for internal tools

Packages

ui → shared components using Tailwind + shadcn

db → Prisma or TypeORM schemas, migrations, DB client

types → shared TypeScript interfaces

config → centralized environment loader, with typed env validation

Database

PostgreSQL with PostGIS enabled

Migrations

Seed script with basic users and geo sample points

Bilingual Architecture

Folder structure for en and fr content

i18n init in the web app

DevOps Setup

Dockerfiles for all apps

Docker Compose for local dev

Basic GitHub Actions pipeline: lint, test, build

Acceptance Criteria

All apps run via Turborepo (dev, build)

PostGIS enabled and migrations run cleanly

Web app loads bilingual landing page

API responds on /health

Return: file structure, generated code, config files, and instructions.

Modern and Classy Design unique

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e852245d-0fd1-404c-a958-c8886faa90ed).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
