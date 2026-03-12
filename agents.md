 # AI Agent Rules for ERP SaaS Repository

This file defines the rules for AI coding agents (Codex CLI or other assistants) working in this repository.

Agents MUST follow these rules whenever modifying or generating code.

The goal is to maintain consistent architecture, UI, and technology across the entire ERP SaaS system.

---------------------------------------------------------------------

PROJECT TYPE

This project is a multi-tenant ERP SaaS platform.

Key characteristics:

- Multiple organizations
- A user can belong to multiple organizations
- Each organization has isolated data
- Role-based permissions

Agents must NEVER break tenant isolation.

---------------------------------------------------------------------

TECH STACK (STRICT)

Frontend
- React
- Vite
- TypeScript
- TanStack Query
- TanStack Table
- shadcn/ui
- TailwindCSS

Backend
- Laravel API (PHP)
- PostgreSQL database
- Redis for queues and caching

Infrastructure
- Backend hosted on Render
- Frontend hosted on Vercel
- DNS and CDN via Cloudflare

Agents must NOT introduce other frameworks unless explicitly requested.

Examples of frameworks that must NOT be introduced:

- Next.js
- Redux
- Angular
- Vue
- Express
- Firebase

---------------------------------------------------------------------

IMPORTANT RULE

The codebase already exists.

Agents must MODIFY existing code patterns instead of introducing new architectural patterns.

Always follow the structure already present in the repository.

---------------------------------------------------------------------

MULTI-TENANT DATA MODEL

The system supports multiple organizations.

Core tables:

organizations
users
organization_users

organization_users contains:

- user_id
- organization_id
- role

Every business table MUST include:

organization_id

Examples:

clients
projects
quotations
invoices
tasks
attendance
files

Backend queries must always enforce organization scope:

WHERE organization_id = current_user.organization_id

Never allow cross-organization access.

---------------------------------------------------------------------

FRONTEND ARCHITECTURE

The frontend is built with React + Vite.

Folder structure must follow:

src/

  app/
  modules/
  components/
  hooks/
  services/
  utils/

ERP modules live inside:

src/modules/

Examples:

modules/clients
modules/crm
modules/projects
modules/quotations
modules/invoices
modules/tasks
modules/attendance
modules/files

Each module should contain:

components/
pages/
hooks/
api/

Agents must extend modules rather than placing code randomly.

---------------------------------------------------------------------

DATA FETCHING RULES

All server communication must use TanStack Query.

Rules:

- Do NOT fetch data directly inside components
- Create API functions inside module/api
- Use hooks that wrap TanStack Query

Example structure:

modules/projects/api/getProjects.ts
modules/projects/hooks/useProjects.ts

Components should only consume hooks.

---------------------------------------------------------------------

TABLES

All data tables must use TanStack Table.

Tables must support:

- sorting
- filtering
- pagination
- column visibility
- row selection

Do not introduce other table libraries.

---------------------------------------------------------------------

UI RULES

All UI must use shadcn/ui components.

Preferred components:

Button
Input
Textarea
Dialog
DropdownMenu
Popover
Sheet
Tabs
Card
Badge
Table

Use TailwindCSS utility classes.

Avoid custom CSS unless necessary.

Maintain consistent UI styling across the application.

---------------------------------------------------------------------

BACKEND ARCHITECTURE

Laravel backend must follow modular design.

Structure:

app/

  Modules/
    Clients/
    Projects/
    Quotations/
    Invoices/
    Tasks/
    Attendance/

Each module contains:

Controllers
Models
Requests
Services

Controllers must remain thin.

Business logic belongs inside Services.

---------------------------------------------------------------------

API RULES

Frontend communicates only through Laravel API.

Example endpoints:

GET /api/clients
POST /api/clients
GET /api/projects
POST /api/projects
PUT /api/projects/{id}
DELETE /api/projects/{id}

All API requests must require authentication.

Authorization header format:

Authorization: Bearer TOKEN

---------------------------------------------------------------------

DATABASE RULES

Database is PostgreSQL.

Use Laravel migrations.

Standard columns:

id
organization_id
created_at
updated_at

Always index:

organization_id

Avoid raw SQL unless necessary.

Prefer Eloquent ORM.

---------------------------------------------------------------------

QUEUE AND CACHE

Redis is used for:

- queues
- caching
- notifications
- background processing

Queue jobs should handle:

emails
PDF generation
report exports
image processing

---------------------------------------------------------------------

FILES AND STORAGE

File uploads include:

- site photos
- documents
- invoice PDFs

Files must be stored in object storage (Cloudflare R2).

Database should only store file metadata.

Example table:

files

id
organization_id
path
mime_type
uploaded_by
created_at

---------------------------------------------------------------------

SECURITY RULES

Agents must enforce:

- input validation
- tenant isolation
- proper authorization
- prevention of mass assignment

All validation must use Laravel Request classes.

Never trust frontend input.

---------------------------------------------------------------------

WHEN GENERATING CODE

Agents must:

1. Generate complete files
2. Include imports
3. Follow existing architecture
4. Use TypeScript types
5. Prefer reusable components
6. Respect module boundaries
7. Follow the defined stack strictly

Do not introduce new architecture unless explicitly requested.

---------------------------------------------------------------------

GOAL

Maintain a consistent, scalable ERP SaaS codebase while allowing AI agents to safely assist development.