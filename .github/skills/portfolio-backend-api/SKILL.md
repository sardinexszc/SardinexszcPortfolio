---
name: portfolio-backend-api
description: "Design, implement, and maintain the portfolio backend using secure, predictable API patterns. Use when adding or refactoring Laravel backend endpoints, admin flows, integrations, validation, and abuse protections while reusing existing architecture."
argument-hint: "Describe the backend feature, data domain, endpoint needs, auth level, and non-functional constraints."
user-invocable: true
---

# Portfolio Backend API Skill

## Purpose
Design, implement, and maintain the backend powering portfolio features with consistent API quality, security, and maintainability.

Supported domains include:
- Contact forms
- Project data
- Experience data
- Skills data
- Blog/research content
- Analytics where appropriate
- Chatbot/AI integrations
- Administrative functionality
- External API integrations

Always prioritize:
1. Security
2. Correctness and predictable behavior
3. Maintainability and readability
4. Performance and resilience
5. Developer experience

## Use When
Use this skill when asked to:
- Add or modify backend endpoints and admin operations
- Improve validation, error handling, or API response consistency
- Integrate external services or AI/chat features
- Add anti-abuse protections for public endpoints
- Refactor backend structure incrementally without unnecessary rewrites

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Existing backend is Laravel (apps/api) with PHP 8.2+, Laravel 12, Sanctum installed
- Public API routes are defined in routes/api.php under v1 prefix
- Admin and auth-protected web routes are defined in routes/web.php
- API output currently uses JsonResource classes
- Data models include projects, skills, timeline entries, and users
- Frontend consumes backend via NEXT_PUBLIC_API_URL (apps/web/lib/api.ts)

## Pre-Implementation Inspection Checklist
Before implementation, inspect:
1. Existing project architecture
2. package/composer dependencies
3. Backend technology in use (Laravel is primary in current repo)
4. Existing routing, controllers, resources, models, migrations
5. Current validation and authentication approach
6. Existing patterns and reusable utilities

## Hard Constraints
- Reuse existing backend architecture rather than introducing a second backend unnecessarily.
- Do not add parallel API stacks (for example Next.js API routes or Express) unless there is a strong technical need and explicit approval.
- Keep business logic out of presentation layers.
- Preserve existing API contracts unless change is intentional and documented.
- Never expose secrets or credentials.

## API Design Principles
- Use clear RESTful or framework-appropriate patterns.
- Validate all external input.
- Sanitize user-controlled content.
- Return appropriate HTTP status codes.
- Return predictable JSON response structures.
- Handle errors consistently.
- Add useful logging without leaking sensitive data.
- Use environment variables for all secrets.
- Apply rate limiting for public endpoints when appropriate.
- Prevent spam and abuse on public forms.

## Security Rules
- Validate request methods and content types.
- Prevent injection attacks through strict validation and query safety.
- Prevent XSS via proper output encoding/sanitization strategy.
- Prevent CSRF where applicable (especially cookie/session flows).
- Prevent unauthorized access to admin/private endpoints.
- Avoid exposing stack traces in production responses.
- Never trust client-side validation alone.

## Code Quality and Architecture Rules
- Use strong typing and explicit contracts where supported by the stack.
- In Laravel, prefer Form Request classes for validation over inline controller validation when endpoint complexity grows.
- Separate concerns where appropriate:
  - Routes/controllers
  - Services/domain logic
  - Validation
  - Data access/query logic
  - Response transformation/resources
- Keep controllers thin and focused on orchestration.
- Create reusable validation/error-handling utilities when patterns repeat.
- Avoid unnecessary abstraction and large rewrites for style alone.

## Required Pre-API Proposal (Before Implementation)
For every new API, provide:
1. Endpoint design
2. Request format
3. Response format
4. Validation rules
5. Authentication requirements
6. Rate-limiting considerations
7. Error handling
8. Database requirements

Then implement the API incrementally.

## Laravel-Oriented Implementation Guidance
Prefer these patterns in this repository:
- Route groups by version/domain in routes/api.php
- Controller methods delegating complex logic to service classes when needed
- Form Request validation classes for complex inputs
- Eloquent models/scopes for query organization
- Resource classes for stable API payloads
- Middleware for auth, throttling, and policy enforcement
- Environment-based config for external integrations

## Public Endpoint Abuse Protection
For contact forms and other public endpoints, consider:
- Throttle middleware
- Basic bot/spam controls (for example honeypot/challenge strategies as appropriate)
- Request payload size limits
- Duplicate submission controls when necessary
- Logging and alerting on anomalous traffic patterns

## Required Workflow
Follow this sequence for backend tasks.

### Phase 1: Diagnose and Scope
1. Inspect existing architecture and identify reusable patterns.
2. Confirm whether feature belongs in current Laravel backend.
3. Define data boundaries and security exposure.

### Phase 2: Propose Before Editing
Before editing, explicitly provide:
1. Problem statement and scope
2. Endpoint/request/response design
3. Validation and auth strategy
4. Abuse/rate-limit strategy
5. Files to modify and migration impact
6. Compatibility and rollback considerations

### Phase 3: Implement Incrementally
1. Add/modify routes with minimal contract risk.
2. Implement validation and authorization early.
3. Add controller/service/data logic in clear boundaries.
4. Return consistent JSON and status codes.
5. Add logging/error handling and sensitive-data guards.

### Phase 4: Verify
After edits, verify:
- Functional behavior of endpoints
- Validation failures and status codes
- Auth/authorization behavior
- Error response consistency
- No secret leakage in logs/responses
- Schema/data integrity (if migrations changed)
- No regressions in existing routes

Suggested checks/commands:
- composer test
- composer lint
- targeted manual API checks (success + failure paths)

## Decision Points and Branching
- If existing controller logic is becoming monolithic, extract service/validation layers incrementally.
- If endpoint is public and user-generated, prioritize abuse controls before launch.
- If an integration needs secrets, block implementation until env/config strategy is clear.
- If a change breaks existing client contracts, version or stage rollout rather than silent replacement.
- If two backend approaches are possible, prefer the existing Laravel path unless justified.

## Completion Criteria
A backend API task is complete only when:
- Endpoint behavior is correct and predictable.
- Validation and security controls are in place.
- Response schema and status codes are consistent.
- Secrets/credentials are protected and not exposed.
- Anti-abuse controls are considered for public routes.
- Existing functionality remains intact.
- Tests/checks pass or known issues are documented.

## Output Format for Backend Work
Use this structure:
1. Problem and Scope
2. Endpoint Design
3. Request/Response Contract
4. Validation and Authentication
5. Rate Limiting and Abuse Controls
6. Implementation Plan / Files
7. Verification Results
8. Residual Risks / Next Iteration

## Example Prompts
- /portfolio-backend-api Add a contact form API with validation, spam protection, rate limiting, and consistent error responses.
- /portfolio-backend-api Refactor portfolio resource endpoints for cleaner controller/service boundaries without changing response contracts.
- /portfolio-backend-api Add authenticated admin endpoints for blog/research entries with proper authorization and audit-safe logging.
- /portfolio-backend-api Integrate an external AI/chat service through Laravel with secret-safe config and resilient error handling.
