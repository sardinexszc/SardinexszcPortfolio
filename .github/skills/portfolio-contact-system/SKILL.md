---
name: portfolio-contact-system
description: "Implement a production-ready portfolio contact form with secure API handling, dual-side validation, spam protection, accessible UX states, optional persistence, and secret-safe email delivery using existing architecture."
argument-hint: "Describe contact form goals, storage preference, provider constraints, and expected failure behavior."
user-invocable: true
---

# Portfolio Contact System Skill

## Purpose
Design and implement a production-ready contact form system that is secure, accessible, responsive, and resilient.

Supported contact fields:
- Name
- Email
- Subject
- Message
- Optional project or service information

System requirements include:
- Validation
- Spam and abuse protection
- Loading, success, and error states
- Email notification
- Optional database storage

Always prioritize:
1. Security and abuse prevention
2. Data correctness and safe handling
3. Accessibility and UX clarity
4. Reliability and observability
5. Maintainability

## Use When
Use this skill when asked to:
- Build or improve contact form submission flow
- Add backend endpoint for contact requests
- Add server-side email notifications
- Add optional contact message storage
- Harden validation, rate limiting, and failure handling

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Frontend currently has a contact section with static links, not a form
- Backend is Laravel API and admin stack under apps/api
- Current API routes expose portfolio read endpoints only
- Session-based admin auth exists for private admin pages
- Existing environment example does not yet define mail provider settings for contact delivery
- Existing DB migrations do not yet include a contact messages table

## Pre-Implementation Inspection Checklist
Before implementation, inspect:
1. Existing frontend contact UX and component structure
2. Existing backend routes, controllers, validation style, and API response patterns
3. Existing environment variables and secret handling patterns
4. Current email/provider architecture and mail transport availability
5. Existing database schema and migration strategy
6. Existing auth and admin access paths for viewing submissions

## Hard Constraints
- Validate input on both client and server.
- Never trust client-side validation alone.
- Never expose email API keys or backend secrets to the client.
- Store secrets only in environment variables.
- Do not expose sensitive server errors to clients.
- Prevent abuse and duplicate submissions.
- Keep the form responsive and accessible.

## Required Pre-Implementation Brief
Before implementing any contact feature, always explain:
1. Data flow
2. API endpoint
3. Validation
4. Email provider
5. Database storage (if applicable)
6. Security measures
7. Failure handling

Then implement incrementally.

## Contact Data Flow Guidance
Default flow:
1. User submits form in frontend
2. Client performs lightweight validation and disables duplicate submit
3. Request is sent to backend contact endpoint
4. Backend performs authoritative validation and sanitization
5. Backend applies rate-limit and abuse controls
6. Backend sends notification email and optionally stores submission
7. Backend returns safe, predictable success or error response
8. Frontend renders accessible success or error feedback

## API Design and Response Rules
- Use framework-appropriate REST patterns.
- Accept only expected methods and content types.
- Return predictable JSON envelopes.
- Use appropriate status codes.
- Avoid leaking stack traces or provider internals.
- Distinguish validation errors from transient server failures.

## Validation and Input Safety Rules
- Validate required fields and email format.
- Limit message length and optional field lengths.
- Trim and normalize user input.
- Sanitize or safely encode user-controlled content before rendering or forwarding.
- Reject malformed or unexpected payload keys where practical.

## Spam and Abuse Protection Rules
Use one or more protections based on risk profile:
- Endpoint rate limiting
- Basic anti-bot controls (for example honeypot/challenge strategies)
- Duplicate submission mitigation
- Optional IP or fingerprint throttling where appropriate
- Logging of abuse patterns without storing unnecessary sensitive data

## Accessibility and UX State Rules
- Provide accessible inline validation messages.
- Provide clear loading state while request is in progress.
- Provide explicit success and error states.
- Use ARIA and live-region behavior only as needed for announcements.
- Keep controls keyboard accessible and labels explicit.
- Preserve responsiveness across mobile and desktop.

## Email Provider and Secret Handling Rules
- Prefer existing framework-supported provider integrations.
- Keep mail sending server-side only.
- Never pass provider credentials to browser code.
- Use env-based configuration for all mail credentials and sender identities.
- Use provider-agnostic abstraction where practical to ease provider change.

## Optional Database Storage Rules
If storing contact submissions:
- Add non-destructive migration first.
- Include necessary fields and timestamps.
- Add indexes only for expected admin query patterns.
- Protect private submission data with admin-only access controls.
- Avoid storing unnecessary sensitive metadata.

## Required Workflow
Follow this sequence for each contact-system task.

### Phase 1: Diagnose
1. Inspect current frontend and backend architecture.
2. Identify missing pieces in endpoint, validation, mail, storage, and UX states.
3. Define abuse risk level and observability needs.

### Phase 2: Propose Before Editing
Before editing, explicitly provide:
1. Data flow
2. Endpoint design
3. Validation and sanitization rules
4. Email provider and secret strategy
5. Storage plan and migration impact
6. Security and abuse controls
7. Failure handling and client-safe response strategy
8. Affected files

### Phase 3: Implement Incrementally
1. Add backend endpoint, validation, and safe responses.
2. Add spam and rate-limit controls.
3. Add mail notification integration server-side.
4. Add optional persistence path if required.
5. Add frontend form with accessible field errors and state handling.
6. Add duplicate-submit protection and responsive UI behavior.

### Phase 4: Verify
After changes, verify:
- Client-side validation catches basic errors
- Server-side validation enforces all rules independently
- Unauthorized or abusive requests are limited safely
- Success and error states are clear and accessible
- Duplicate submissions are blocked or handled safely
- Sensitive server details are not exposed to clients
- Secrets remain server-side
- Email and optional DB storage behavior works as intended

Suggested checks:
- Frontend lint and type checks
- Backend tests for validation and endpoint behavior
- Manual authorized and unauthorized request tests
- Manual success, validation-failure, and provider-failure scenarios

## Decision Points and Branching
- If mail provider is not configured, implement endpoint and persistence safely first, then enable delivery when env is ready.
- If abuse risk is high, prioritize rate limiting and anti-bot controls before launch.
- If storage is optional, ship notification-only flow first and add DB storage as additive migration.
- If backend errors are complex, map to safe generic client messages and detailed server logs.
- If introducing third-party email APIs, keep provider calls inside server-only services.

## Completion Criteria
A contact-system task is complete only when:
- Form is responsive and accessible.
- Client and server validation are both implemented.
- Abuse protection and duplicate-submit handling are in place.
- Server responses are safe and predictable.
- Email notification works or fails safely.
- Optional DB storage (if requested) is implemented non-destructively.
- No secrets are exposed client-side.

## Output Format for Contact-System Work
Use this structure:
1. Data Flow
2. Endpoint Design
3. Validation Rules
4. Email Provider Strategy
5. Storage Strategy
6. Security and Abuse Controls
7. Failure Handling
8. Implementation Plan and Files
9. Verification Results
10. Residual Risks and Next Iteration

## Example Prompts
- /portfolio-contact-system Design and implement a secure contact form endpoint with validation, rate limiting, and server-side email delivery.
- /portfolio-contact-system Add an accessible responsive contact form UI with clear loading, success, and error states plus duplicate-submit prevention.
- /portfolio-contact-system Implement optional contact_messages persistence with admin-only viewing and non-destructive migration.
- /portfolio-contact-system Audit and harden contact-form abuse protections and failure handling for production readiness.
