---
name: portfolio-database
description: "Design and maintain the portfolio database with safe, non-destructive schema evolution, strong integrity constraints, and secure data-access patterns. Use for Laravel/PostgreSQL/Supabase-compatible schema work, migrations, relationships, and query reliability."
argument-hint: "Describe the data problem, affected entities, expected relationships, access patterns, and migration constraints."
user-invocable: true
---

# Portfolio Database Skill

## Purpose
Design, evolve, and maintain the portfolio database safely while preserving data integrity, security, and application compatibility.

This skill supports PostgreSQL and Supabase when compatible with the existing project architecture.

Always prioritize:
1. Data integrity and safety
2. Security and privacy
3. Backward compatibility
4. Maintainability and clarity
5. Performance

## Use When
Use this skill when asked to:
- Design or modify schema for portfolio features
- Add new entities and relationships
- Create or refactor migrations
- Improve indexes and query reliability
- Add database support for contact, blog/research, analytics, chatbot, or admin features
- Prepare PostgreSQL/Supabase-compatible schema and access policies

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Backend is Laravel in apps/api
- Existing schema is migration-driven under apps/api/database/migrations
- Existing entities include users, projects, skills, timeline_entries
- Current frontend fetches portfolio data via API endpoints (projects, skills, timeline)
- Current DB config supports sqlite and mysql; PostgreSQL can be added if needed in framework-compatible way

## Potential Entities to Support
Consider these entities where needed:
- Projects
- Technologies
- Skills
- Experience
- Education
- Research projects
- Certifications
- Contact messages
- Blog posts
- Testimonials
- Site configuration
- Analytics data

Use only entities that solve real product needs; avoid schema bloat.

## Hard Safety Rules
- Before changing the database, inspect schema, migrations, database-access code, and dependencies.
- Never destroy existing data without explicit confirmation.
- Do not make destructive schema changes without explicit approval.
- Avoid irreversible migrations unless explicitly approved and documented.
- Prefer additive, backward-compatible migrations first.

## Database Design Principles
- Use normalized relational design where appropriate.
- Use appropriate primary keys.
- Use foreign keys to enforce relationships.
- Add indexes based on query patterns.
- Avoid unnecessary indexes.
- Use constraints to preserve data integrity.
- Use timestamps where appropriate.
- Avoid storing duplicated derived data unnecessarily.

## Security Principles
- Validate data before insertion.
- Use parameterized queries or framework-safe database APIs.
- Never construct SQL using unsanitized user input.
- Protect private/sensitive data.
- Keep sensitive operations server-side.

## Supabase and PostgreSQL Rules
When using Supabase/PostgreSQL in this project:
- Use Row Level Security (RLS) where applicable.
- Never expose service-role credentials to the browser.
- Use public/anon access only where appropriate.
- Design RLS policies based on real access requirements.
- Keep privileged database operations on trusted server-side paths.
- Ensure Laravel and Supabase responsibilities are clearly separated to avoid conflicting data paths.

## Pre-Change Inspection Checklist
Before any schema change, inspect:
1. Existing schema and tables
2. Existing migrations and migration ordering
3. Existing database access code (controllers/services/models)
4. Current relationships and dependencies
5. Existing query patterns and API response contracts
6. Backfill and rollback implications

## Required Schema-Change Workflow
When modifying schema, always follow this order:
1. Explain the proposed schema.
2. Explain relationships.
3. Explain security implications.
4. Generate a safe migration.
5. Update application code.
6. Verify queries and types.

## Laravel-Oriented Implementation Guidance
For this repository, prefer:
- Migration-first schema changes in apps/api/database/migrations
- Eloquent models for typed fillable/casts and relationship methods
- Form Request or validation rules before persistence
- Resource-layer stability for API response compatibility
- Controller/service separation when write logic grows

## Relationship and Constraint Guidance
- Prefer explicit foreign keys with intended on-update/on-delete behavior.
- Document cascade behavior choices and avoid accidental deletes.
- Use unique constraints where business uniqueness is required.
- Use check-like validation semantics through DB constraints and app-level validation together.

## Indexing Guidance
- Create indexes for columns used in common filtering/sorting/join patterns.
- Re-check read and write tradeoffs before adding indexes.
- Avoid indexing low-selectivity columns unless query evidence justifies it.
- Revisit index strategy when introducing analytics-heavy tables.

## Non-Destructive Migration Strategy
Default strategy:
1. Add new tables/columns as nullable or with safe defaults
2. Backfill data safely
3. Update code paths to use new fields
4. Validate behavior in read/write flows
5. Only then consider tightening constraints (with approval)

For destructive operations (drop/rename/type narrowing), require explicit user approval first.

## Required Workflow
Follow this sequence for each database task.

### Phase 1: Diagnose
1. Inspect current schema, migrations, and access code.
2. Identify entity boundaries and relationship needs.
3. Confirm compatibility requirements (Laravel-only or Laravel + Supabase/Postgres).

### Phase 2: Propose Before Editing
Before editing, explicitly provide:
1. Proposed schema
2. Relationships and constraints
3. Security implications
4. Migration plan (including rollback)
5. Affected code files
6. Data-safety risk assessment

### Phase 3: Implement Safely
1. Create additive safe migration.
2. Update models/relationships/casts.
3. Update validation and persistence paths.
4. Update API/resource contracts if required.
5. Add policy/RLS notes when Supabase is involved.

### Phase 4: Verify
After changes, verify:
- Migration runs successfully
- Existing data remains intact
- Queries and sort/filter behavior remain correct
- API responses still match expected types/contracts
- No secrets or privileged credentials are exposed
- Rollback path is clear for non-destructive recovery

Suggested checks:
- php artisan migrate
- php artisan test
- targeted endpoint checks for read/write paths

## Decision Points and Branching
- If data loss risk exists, pause and request explicit approval.
- If normalization harms practical query performance, use minimal denormalization with clear rationale.
- If Supabase is introduced, keep service-role operations server-side only.
- If a migration affects existing API contracts, stage the change and preserve compatibility.
- If relationship cardinality is uncertain, model conservatively and iterate with data evidence.

## Completion Criteria
A database task is complete only when:
- Schema changes are safe and justified.
- Relationships and constraints preserve integrity.
- Query paths remain correct and performant for known usage.
- Security rules are applied, including secret handling and safe query construction.
- Existing functionality is preserved.
- Non-destructive migration and rollback expectations are documented.

## Output Format for Database Work
Use this structure:
1. Proposed Schema
2. Relationships
3. Security Implications
4. Safe Migration Plan
5. Application Code Updates
6. Verification Results
7. Residual Risks / Next Iteration

## Example Prompts
- /portfolio-database Design and implement a contact_messages table with anti-spam fields and safe migration strategy.
- /portfolio-database Normalize project technologies into a many-to-many relationship and update API reads without data loss.
- /portfolio-database Add research_projects and certifications entities with clear foreign keys and index strategy.
- /portfolio-database Plan PostgreSQL/Supabase-compatible schema updates with RLS policy design for public vs admin access.
