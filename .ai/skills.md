ERP SAAS DEVELOPMENT SKILL CONTEXT

You are assisting development of a production ERP SaaS application.
The repository already contains a working codebase.

Your task is to modify and extend the system WITHOUT breaking the
existing architecture, stack, or UI consistency.

You must always follow the rules below.

--------------------------------------------------

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
- PostgreSQL
- Redis (queues + caching)

Infrastructure
- Backend deployed on Render
- Frontend deployed on Vercel
- DNS + CDN via Cloudflare

Do NOT introduce other frameworks unless explicitly requested.

Never introduce:
- Next.js
- Redux
- Firebase
- Vue
- Angular
- Express
- Other UI libraries

--------------------------------------------------

PROJECT TYPE

This project is a MULTI-TENANT ERP SaaS.

Requirements:

- Multiple organizations
- Users can belong to multiple organizations
- Each organization has isolated data
- Role-based permissions

Tenant isolation is critical.

--------------------------------------------------

MULTI TENANT DATABASE RULES

Core tables:

organizations
users
organization_users

organization_users fields:

user_id
organization_id
role

Every business table MUST contain:

organization_id

Examples:

clients
projects
quotations
invoices
tasks
attendance
files

All queries MUST enforce tenant filtering:

WHERE organization_id = current_user.organization_id

Never allow cross-organization access.

--------------------------------------------------

FRONTEND ARCHITECTURE

React project structure:

src/
  app/
  modules/
  components/
  hooks/
  services/
  utils/

ERP modules are located in:

src/modules/

Example modules:

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

When modifying the system, extend modules instead of creating random folders.

--------------------------------------------------

DATA FETCHING RULES

Use TanStack Query for ALL server data.

Rules:

- Never fetch data directly inside components
- API functions live inside module/api
- React hooks wrap the API using useQuery or useMutation

Example pattern:

modules/projects/api/getProjects.ts
modules/projects/hooks/useProjects.ts

Components must consume hooks only.

--------------------------------------------------

TABLE RULES

All tables must use TanStack Table.

Tables must support:

- sorting
- filtering
- pagination
- column visibility
- row selection

Do not introduce any other table library.

--------------------------------------------------

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

Avoid writing custom CSS unless necessary.

Maintain UI consistency across modules.

--------------------------------------------------

BACKEND ARCHITECTURE

Laravel must follow modular architecture.

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

Controllers must stay thin.

Business logic must live in Services.

--------------------------------------------------

API RULES

Frontend communicates ONLY with Laravel API.

Example endpoints:

GET /api/clients
POST /api/clients
GET /api/projects
POST /api/projects
PUT /api/projects/{id}
DELETE /api/projects/{id}

All requests require authentication.

Authorization header format:

Authorization: Bearer TOKEN

--------------------------------------------------

DATABASE RULES

Database engine: PostgreSQL.

Use Laravel migrations.

Standard columns:

id
organization_id
created_at
updated_at

Always index:

organization_id

Prefer Eloquent ORM instead of raw SQL.

--------------------------------------------------

QUEUE + CACHE

Redis is used for:

- queues
- caching
- notifications
- background processing

Queue jobs handle:

emails
PDF generation
report exports
image processing

--------------------------------------------------

FILES

Files stored externally (Cloudflare R2).

Database stores only metadata.

Example table:

files

id
organization_id
path
mime_type
uploaded_by
created_at

--------------------------------------------------

SECURITY RULES

Always enforce:

- input validation
- tenant isolation
- proper authorization
- mass assignment protection

Use Laravel Request validation.

Never trust frontend input.

--------------------------------------------------

CODE GENERATION RULES

When generating or modifying code:

1. Follow existing architecture
2. Extend modules instead of creating new patterns
3. Use TypeScript types
4. Generate complete files with imports
5. Prefer reusable components
6. Maintain stack consistency
7. Never break multi-tenant filtering