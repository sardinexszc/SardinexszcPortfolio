---
name: portfolio-security-audit
description: "Audit and improve portfolio security across frontend, backend, APIs, database, authentication, chatbot, environment configuration, dependencies, and admin surfaces using a risk-first workflow with safe remediation and verification."
argument-hint: "Describe the feature or route to audit, observed security concern, deployment context, and whether code fixes should be applied."
user-invocable: true
---

# Portfolio Security Audit Skill

## Purpose
Perform practical, risk-prioritized security reviews for this portfolio and implement safe remediations when appropriate.

Always prioritize:
1. Critical exploit paths first
2. Confidentiality, integrity, and availability protection
3. Least-privilege access and strict trust boundaries
4. Safe changes with minimal regression risk
5. Verification after each remediation

## Use When
Use this skill when asked to:
- Audit the portfolio for security weaknesses
- Harden frontend, backend, API, database, authentication, or admin features
- Review contact forms, chatbot paths, environment handling, and dependency risk
- Propose and implement secure-by-default improvements

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Frontend: Next.js App Router + React + TypeScript
- Backend/API/Admin: Laravel 12 + PHP 8.2
- Admin auth: session guard on web routes with auth middleware
- Public API: versioned routes under /api/v1
- CORS is configured in Laravel using FRONTEND_URL
- Chatbot is currently client-side rule-based logic
- Data includes project, skills, timeline resources
- No dedicated file upload endpoints are currently visible in baseline routes/controllers

## Security Review Scope
Audit all applicable surfaces:
- Frontend
- Backend
- APIs
- Database
- Authentication
- Contact forms
- AI chatbot
- Environment variables and secrets handling
- Dependencies
- Admin functionality
- File uploads if present

## Mandatory Checks
Check for at least:
- Hardcoded secrets
- Exposed API keys
- Broken authentication
- Broken authorization
- Injection vulnerabilities
- XSS
- CSRF where applicable
- SSRF where applicable
- Insecure API endpoints
- Excessive data exposure
- Missing input validation
- Weak rate limiting
- Unsafe file uploads
- Insecure database policies
- Misconfigured CORS
- Debug information exposed in production
- Dependency vulnerabilities

## Non-Negotiable Safety Rules
- Never print or expose actual secrets.
- Never commit secrets.
- Use environment variables for sensitive data.
- Use server-side validation for untrusted input.
- Follow least privilege.
- Do not make destructive security changes without explaining impact and alternatives.

## Threat Modeling Baseline
Before edits, identify:
1. Assets to protect (sessions, admin data, user inputs, infrastructure metadata)
2. Entry points (public pages, forms, API endpoints, admin routes, third-party integrations)
3. Trust boundaries (browser to server, public to admin, external services)
4. Likely attacker goals (account takeover, data leakage, tampering, abuse, denial)

## Required Audit Workflow
Follow this order on every security task.

### Phase 1: Discover and Triage
1. Map reachable attack surface from requested scope.
2. Collect evidence of vulnerabilities or risky patterns.
3. Classify findings by severity: Critical, High, Medium, Low.
4. Prioritize exploitable, high-impact issues first.

### Phase 2: Report Findings Clearly
For each finding, always provide:
1. Vulnerability identified
2. Risk explanation
3. Affected files/components/routes
4. Recommended mitigation
5. Safe remediation plan
6. Verification approach

### Phase 3: Remediate Safely
1. Apply smallest effective fix first.
2. Preserve intended behavior and UX where possible.
3. Avoid broad refactors unless required for security correctness.
4. Add defense-in-depth controls when low-risk and justified.

### Phase 4: Verify and Regressions Check
After remediation, verify:
- Vulnerability is mitigated
- Application still works
- Auth and authorization behavior remains correct
- No new data exposure or policy bypass was introduced
- Error handling does not leak internals

## Stack-Specific Security Guidance

### Frontend
- Prevent unsafe HTML rendering and injection sinks.
- Avoid leaking sensitive values to client bundles.
- Keep security-relevant logic enforced server-side, not only in UI.
- Validate external links and user-provided URLs before rendering.

### Backend and APIs
- Enforce allowlist validation on all mutable inputs.
- Return only required fields from API resources.
- Add/verify rate limits on abuse-prone endpoints.
- Standardize secure error responses without stack traces in production.

### Authentication and Authorization
- Validate session lifecycle behavior (login, logout, expiry, rotation).
- Enforce authorization checks per sensitive action, not just route grouping.
- Protect admin-only operations against privilege escalation and IDOR patterns.
- Ensure CSRF protections are active on state-changing web endpoints.

### Contact Forms and Chatbot
- Treat all inbound text as untrusted input.
- Add spam and abuse controls (rate limit, content checks, optional challenge).
- Prevent prompt injection from causing policy bypass or fabricated sensitive claims.
- Keep model/provider secrets server-side if AI backend is introduced.

### Database and Data Policies
- Verify least-privilege DB credentials and environment separation.
- Ensure migrations preserve integrity constraints and safe defaults.
- Avoid destructive schema/data operations without explicit explanation and approval.
- Minimize sensitive data retention and exposure in logs.

### Environment and Secrets
- Keep secrets only in environment configuration and secret stores.
- Redact sensitive values in logs, errors, and diagnostic output.
- Confirm production debug mode is disabled.
- Verify security-relevant env vars are required and documented.

### Dependencies and Supply Chain
- Audit package/composer dependencies for known vulnerabilities.
- Prefer pinned or constrained versions with timely patch updates.
- Remove unused dependencies that increase attack surface.
- Re-run audit checks after upgrades.

### File Uploads (If Present)
- Enforce strict MIME/type and extension allowlists.
- Enforce size limits and scan/validate content where practical.
- Store outside public execution paths.
- Randomize names and prevent path traversal.

## Decision Points and Branching
- If a finding is Critical/High and exploitable, prioritize immediate containment and fix.
- If a fix may break user/admin flows, provide a safer staged mitigation option first.
- If evidence is inconclusive, document assumptions and collect more proof before invasive edits.
- If no file upload exists, document as not applicable and continue other checks.
- If a required hardening change is destructive, pause and explain impact before applying it.

## Completion Criteria
A security task is complete only when:
- Findings are severity-ranked and risk-explained.
- Critical issues were addressed first or explicitly escalated.
- Safe remediations were implemented where appropriate.
- Functionality was verified after fixes.
- Secrets were never exposed or committed.
- Residual risks and follow-up actions are documented.

## Output Format for Security Work
Use this structure:
1. Scope and Threat Model
2. Findings by Severity (Critical to Low)
3. Risk and Affected Areas
4. Mitigation Plan
5. Changes Implemented
6. Verification Results
7. Residual Risks and Next Actions

## Example Prompts
- /portfolio-security-audit Run a full security audit across frontend, backend, APIs, admin, and dependencies, then fix the highest-severity issue first.
- /portfolio-security-audit Audit authentication and authorization paths for admin actions and harden broken access controls.
- /portfolio-security-audit Review API responses, validation, and rate limiting to reduce injection and data exposure risk.
- /portfolio-security-audit Check environment variable handling and production security posture without exposing any secret values.
