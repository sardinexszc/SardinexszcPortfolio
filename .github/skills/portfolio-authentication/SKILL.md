---
name: portfolio-authentication
description: "Implement secure authentication and authorization for private portfolio administration while keeping the public portfolio open. Use when adding or hardening Laravel auth flows, admin route protection, session handling, and access control."
argument-hint: "Describe the admin feature, access level needed, session/auth concerns, and expected unauthorized behavior."
user-invocable: true
---

# Portfolio Authentication Skill

## Purpose
Implement and maintain secure authentication and authorization for private administrative features, while keeping the public portfolio accessible without login.

Potential authenticated capabilities include:
- Managing projects
- Managing experience
- Managing research projects
- Managing skills
- Managing blog posts
- Viewing contact submissions
- Managing portfolio content

Always prioritize:
1. Security
2. Correct access control behavior
3. Session integrity and reliability
4. Maintainability
5. Clear developer workflows

## Use When
Use this skill when asked to:
- Add or improve admin authentication and session behavior
- Add authorization checks for sensitive actions
- Protect private routes or API endpoints
- Handle expired sessions and unauthorized access robustly
- Integrate or evaluate provider-based auth without replacing existing architecture unnecessarily

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Backend uses Laravel session authentication (web guard) for admin features
- Auth default guard is `web` (session driver) with Eloquent `users` provider
- Admin routes are currently protected by auth middleware in web routes
- User passwords are hashed via model casting (not plaintext)
- Public portfolio API endpoints remain public and should stay accessible
- Sanctum is present but primary current admin flow is session-based auth

## Pre-Implementation Inspection Checklist
Before implementing anything, inspect:
1. Existing authentication architecture
2. Auth guards/providers and middleware wiring
3. Session configuration and expiry behavior
4. Private route coverage (web + API)
5. Current authorization boundaries (who can do what)
6. Existing data exposure risks

## Hard Constraints
- Keep public portfolio pages and public read endpoints accessible without authentication.
- Prefer the authentication system already supported by the project.
- Do not implement custom password authentication when a mature supported option already exists.
- Never store plaintext passwords.
- Never expose authentication secrets to clients.
- Validate sessions server-side.
- Implement authorization separately from authentication.
- Do not rely only on hidden UI to protect private actions.

## Authentication and Authorization Principles
- Authentication answers who the user is.
- Authorization answers what the authenticated user may do.
- Use least privilege by default.
- Protect server-side administrative routes and sensitive endpoints.
- Handle expired/invalid sessions explicitly with safe redirects or 401/403 responses as appropriate.
- Keep secret handling fully server-side.

## Supabase-Specific Rules (When Used)
If Supabase is introduced or integrated:
- Configure authentication and Row Level Security policies intentionally.
- Never expose service-role credentials to browser code.
- Use anon/public access only for truly public data paths.
- Keep privileged operations server-side.
- Design policies from actual access requirements, not broad allow rules.

## Security Rules
- Validate request methods and content types where relevant.
- Prevent unauthorized access to admin pages and write endpoints.
- Protect sensitive API endpoints with middleware and policy checks.
- Rotate/expire sessions safely and handle stale sessions.
- Avoid leaking internal auth details in error responses.
- Log relevant security events without exposing secrets.

## Laravel-Oriented Implementation Guidance
In this repository, prefer:
- Auth middleware on all private web/admin routes
- Gate/policy checks for resource-level authorization when roles/capabilities differ
- Server-side session regeneration on login and invalidation on logout
- Form Request validation for auth-adjacent inputs when complexity grows
- Consistent unauthorized handling:
  - Browser flows: redirect to login
  - API flows: 401 for unauthenticated, 403 for unauthorized

## Required Feature Workflow
For every authentication feature, follow this exact sequence:
1. Explain the authentication flow.
2. Explain authorization.
3. Explain session management.
4. Explain security risks.
5. Implement the feature.
6. Test unauthorized and authorized access.

## Required Workflow Phases

### Phase 1: Diagnose
1. Inspect current auth/session/route setup.
2. Identify risk points: unprotected endpoints, missing authorization, stale session behavior, secret exposure.
3. Confirm whether change should be session auth, token auth, or policy-level hardening.

### Phase 2: Propose Before Editing
Before editing, explicitly provide:
1. Authentication flow design
2. Authorization model
3. Session lifecycle behavior
4. Security risk analysis
5. Files to modify
6. Test plan for unauthorized vs authorized scenarios

### Phase 3: Implement Incrementally
1. Apply minimal secure changes first.
2. Add/adjust middleware and route protections.
3. Add/adjust authorization checks (policies/gates/role checks) where required.
4. Preserve public route access for non-admin content.

### Phase 4: Verify
After changes, verify:
- Public pages/routes still work without auth
- Private routes reject unauthenticated users
- Authorized users can access intended features
- Unauthorized users receive correct 401/403/redirect behavior
- Session expiry and logout behavior are correct
- No secret leakage in client payloads/logs
- Existing functionality remains intact

Minimum auth test matrix:
- Unauthenticated user requests admin page -> redirected to login
- Unauthenticated user requests protected API endpoint (if added) -> 401
- Authenticated non-privileged user requests restricted action -> 403
- Authenticated privileged user requests allowed action -> success
- Expired/invalid session on protected action -> safe denial and re-auth flow

Suggested checks:
- php artisan test
- Manual login/logout/session-expiry checks
- Manual unauthorized/authorized route checks

## Decision Points and Branching
- If existing session auth satisfies requirements, keep it rather than adding another provider.
- If feature requires finer permissions, add authorization policies instead of broad auth checks.
- If endpoint is sensitive and currently public, lock it down before adding new functionality.
- If introducing Supabase auth, design RLS and server-only privileged paths first.
- If auth change risks public portfolio availability, separate public/private route groups before rollout.

## Completion Criteria
An authentication task is complete only when:
- Public portfolio remains accessible without login.
- Private admin features require valid authentication.
- Authorization boundaries are explicit and enforced server-side.
- Session lifecycle is secure (regenerate, expire, invalidate properly).
- Unauthorized and authorized behavior is tested and correct.
- Secrets remain server-side and protected.
- Existing functionality is preserved.

## Output Format for Authentication Work
Use this structure:
1. Authentication Flow
2. Authorization Model
3. Session Management
4. Security Risks and Mitigations
5. Implementation Plan and Files
6. Unauthorized vs Authorized Test Results
7. Residual Risks / Next Iteration

## Example Prompts
- /portfolio-authentication Harden admin route protection and add explicit authorization checks for content management actions.
- /portfolio-authentication Add secure authentication for viewing contact submissions while preserving public portfolio access.
- /portfolio-authentication Audit expired-session handling and unauthorized behavior across admin pages and write endpoints.
- /portfolio-authentication Propose a Supabase-compatible auth and RLS model for future private content workflows without exposing service-role keys.
