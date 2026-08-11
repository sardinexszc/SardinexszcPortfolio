---
name: portfolio-ai-chatbot
description: "Implement and maintain a secure portfolio AI chatbot that uses structured portfolio data as source of truth, routes provider calls server-side, and prevents fabricated claims while keeping UX lightweight and accessible."
argument-hint: "Describe chatbot objective, answer scope, provider constraints, and required UX/security level."
user-invocable: true
---

# Portfolio AI Chatbot Skill

## Purpose
Implement and maintain an intelligent portfolio assistant that can answer professional questions accurately, safely, and concisely.

The chatbot should support questions about:
- Professional background
- Programming skills
- Technologies
- Projects
- Research work
- Education
- Experience
- Services
- Portfolio content
- Contact information
- Career interests

Always prioritize:
1. Factual accuracy and non-fabrication
2. Security and privacy
3. UX clarity and accessibility
4. Performance and cost control
5. Maintainability

## Use When
Use this skill when asked to:
- Implement or upgrade chatbot architecture
- Add secure server-side AI provider integration
- Improve grounding quality using portfolio data sources
- Harden prompt-injection and abuse defenses
- Improve chatbot UX (loading, reset, mobile, accessibility, streaming)

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Current chatbot UI exists as a floating client component
- Current answer engine is local rule-based logic in frontend code
- No server-side AI provider integration endpoint exists yet
- Structured portfolio data is available from API and local typed sources
- Resume/CV text data is available and used for grounded responses

## Pre-Implementation Inspection Checklist
Before implementation, inspect:
1. Existing application architecture
2. Existing AI/chatbot code
3. Existing API integrations and data contracts
4. Existing frontend UX and accessibility patterns
5. Existing backend capabilities and route/controller patterns
6. Existing environment variable and secret-handling patterns

## Hard Constraints
- Never expose AI provider API keys in frontend code.
- Route AI requests through secure server-side endpoints.
- Keep system prompts and instruction policies server-side.
- Use structured portfolio data as source of truth.
- Prevent chatbot from inventing qualifications, experience, projects, or technologies.
- If information is unavailable, return a clear unknown response.
- Keep responses concise and professional.

## Knowledge Source Policy
Preferred grounding sources (in order):
1. Structured portfolio JSON/data
2. Database records
3. Resume/CV data
4. Project metadata
5. Research metadata
6. Skills/technology records

Rules:
- Do not answer from model priors when source data is missing.
- Prefer deterministic retrieval from trusted data before generation.
- Include explicit fallback behavior for unknown questions.

## Required Pre-Implementation Brief
Before implementing chatbot features, always explain:
1. AI architecture
2. Data source
3. API flow
4. Security
5. Cost considerations
6. UX
7. Failure handling

Then implement incrementally.

## Recommended AI Architecture
Default production pattern:
1. Frontend chat UI sends user message to backend chatbot endpoint
2. Backend validates and rate-limits request
3. Backend retrieves relevant portfolio/resume context
4. Backend applies server-side system prompt and response policy
5. Backend calls AI provider server-side only
6. Backend applies output checks and safe response shaping
7. Backend returns concise response (streaming or non-streaming)
8. Frontend renders response with accessible states and reset controls

## Anti-Fabrication and Grounding Rules
- Define explicit policy: only answer from approved sources.
- If no supporting data is found, respond with a clear uncertainty statement.
- Do not infer unverifiable achievements.
- Prefer short factual summaries over speculative elaboration.
- Add guardrails to reject user attempts to override system instructions.

## Security Rules
- Validate and normalize user input.
- Enforce message length limits.
- Apply request rate limiting for public chatbot endpoints.
- Defend against prompt injection attempts that seek secrets or internal instructions.
- Never expose environment variables.
- Never expose private database information.
- Avoid logging sensitive conversation payloads unnecessarily.
- Return safe error messages without provider internals.

## Cost and Reliability Rules
- Keep prompts concise and retrieval-focused.
- Limit max tokens/output length for portfolio assistant use cases.
- Cache or reuse stable context where possible.
- Provide graceful degradation when provider is unavailable.
- Track usage and failures with minimal sensitive logging.

## UX Requirements
- Floating chatbot interface
- Mobile-friendly layout
- Keyboard accessibility
- Loading state
- Streaming response when supported
- Clear error handling
- Clear conversation reset
- Suggested questions
- Accessible close/minimize controls

The chatbot should enhance the portfolio and not dominate the page.

## Implementation Guidelines
- Reuse existing chatbot UI infrastructure where practical.
- Separate concerns cleanly:
  - UI component
  - Client request hook/service
  - Server endpoint
  - Retrieval/grounding module
  - Provider adapter
  - Safety policy and output shaping
- Keep provider-specific logic isolated behind an interface.
- Keep system prompts and policy rules server-side only.

## Required Workflow
Follow this sequence for each chatbot task.

### Phase 1: Diagnose
1. Inspect existing chatbot behavior and data sources.
2. Identify gaps in architecture, grounding, security, and UX.
3. Confirm if deterministic local answers already solve parts of scope.

### Phase 2: Propose Before Editing
Before editing, explicitly provide:
1. AI architecture
2. Grounding data source strategy
3. Endpoint/API flow
4. Security and anti-abuse controls
5. Cost and token controls
6. UX behavior and states
7. Failure handling plan
8. Files to modify

### Phase 3: Implement Incrementally
1. Build/adjust secure server endpoint first.
2. Add validation, length limits, and rate limiting.
3. Add retrieval/grounding with strict source constraints.
4. Add provider integration server-side only (if used).
5. Add output guardrails and unknown-answer fallback.
6. Connect frontend UX states, reset, and accessibility behavior.

### Phase 4: Verify
After changes, verify:
- Factual answers match approved source data
- Unknown questions return clear unknown response
- No secrets are exposed in client code or responses
- Prompt injection attempts fail safely
- Rate limits and input limits are enforced
- UX states (loading/error/reset) function correctly
- Mobile and keyboard accessibility remain solid
- Existing portfolio functionality remains intact

Suggested checks:
- Typecheck/lint for frontend and backend touched files
- Manual tests for authorized/unauthorized input patterns
- Manual tests for valid, unknown, and adversarial prompts
- Manual tests for provider failure and timeout paths

## Decision Points and Branching
- If local deterministic logic is sufficient, keep hybrid mode and avoid immediate full LLM dependence.
- If provider costs are high, prioritize retrieval-first concise responses.
- If grounding confidence is low, return unknown rather than speculate.
- If API or provider fails, degrade gracefully and keep chat UX stable.
- If private data could be exposed, block response and return safe fallback.

## Completion Criteria
A chatbot task is complete only when:
- Architecture keeps secrets and system prompts server-side.
- Responses are grounded in approved portfolio data.
- Fabrication is reduced through explicit fallback behavior.
- Input validation, length limits, and rate limits are enforced.
- UX is accessible, responsive, and clear in all states.
- Errors are safe and do not expose internals.
- Existing portfolio behavior remains intact.

## Output Format for Chatbot Work
Use this structure:
1. AI Architecture
2. Data Source Strategy
3. API Flow
4. Security Controls
5. Cost Considerations
6. UX Design
7. Failure Handling
8. Implementation Plan and Files
9. Verification Results
10. Residual Risks / Next Iteration

## Example Prompts
- /portfolio-ai-chatbot Design and implement a secure server-side chatbot endpoint grounded in portfolio and resume data.
- /portfolio-ai-chatbot Upgrade the current chatbot to prevent fabricated claims and add explicit unknown-answer behavior.
- /portfolio-ai-chatbot Add rate limiting, prompt-injection hardening, and safe error handling to the chatbot flow.
- /portfolio-ai-chatbot Improve chatbot UX with loading, reset, accessibility controls, and mobile-friendly interaction patterns.
