---
name: portfolio-frontend-architecture
description: "Maintain and improve this portfolio frontend architecture with simple, reusable, strongly typed patterns. Use when refactoring components, organizing code boundaries, reducing duplication, and improving maintainability without unnecessary rewrites."
argument-hint: "Describe the architectural concern, affected section(s), desired boundary improvements, and constraints."
user-invocable: true
---

# Portfolio Frontend Architecture Skill

## Purpose
Maintain and improve the frontend architecture of the portfolio for long-term maintainability, readability, performance, and developer experience.

Always prioritize:
1. Maintainability
2. Readability
3. Performance
4. Developer experience
5. Architectural consistency

## Use When
Use this skill when asked to:
- Refactor frontend structure or component boundaries
- Reduce duplication and improve reusable patterns
- Separate UI, data fetching, business logic, and utilities
- Strengthen TypeScript typing and API contracts
- Incrementally improve architecture without large stylistic rewrites

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Frontend framework: Next.js App Router + React + TypeScript in apps/web
- Routing shape: app-level route entry in app/page.tsx with layout shell in app/layout.tsx
- Data access pattern: lib/api.ts with typed fetch helpers and fallback portfolio data
- State management: mostly local component state plus a lightweight ThemeContext provider
- Styling model: Tailwind available plus centralized custom CSS in app/globals.css and app/chatbot.css
- Component organization: section-driven components under src/components

## Pre-Change Inspection Checklist
Before changing architecture, inspect:
- Existing framework and runtime constraints
- package.json dependency graph
- Routing and layout boundaries
- Components and composition depth
- State management scope and ownership
- API usage and data flow boundaries
- Styling architecture and token usage
- Existing patterns worth reusing

## Core Principles
- Prefer simple architecture.
- Avoid unnecessary abstraction.
- Avoid duplicated code.
- Create reusable components only when reuse value is clear.
- Keep components focused and cohesive.
- Separate UI, data fetching, business logic, and utilities where appropriate.
- Use TypeScript and maintain strong typing.
- Avoid any unless absolutely necessary.
- Avoid large monolithic components.
- Avoid unnecessary global state.

## Organization and Naming Standards
- Organize components by feature/section and responsibility.
- Keep presentational, orchestration, and utility logic clearly separated.
- Use descriptive, stable naming conventions for files, components, hooks, and utility functions.
- Prefer predictable import paths and avoid circular coupling.

## Refactoring Protocol
When refactoring, always do the following:
1. Explain the current problem.
2. Explain the proposed architecture.
3. Identify affected files.
4. Refactor incrementally.
5. Verify existing functionality.

## Boundary Guidance
Use these boundaries as defaults:
- UI components: rendering and interaction only
- Data layer: API calls, fetch wrappers, transforms close to source
- Business rules: pure functions/utilities that can be tested independently
- App shell concerns: layout/theme/metadata/global wrappers

Do not force strict layering when complexity does not justify it.

## Reuse vs Abstraction Decision Rules
- If logic appears once and is small, keep it local.
- If logic appears 2+ times with stable semantics, extract shared utility/component.
- If extraction makes usage harder to read, do not abstract yet.
- If abstraction hides domain intent, prefer explicit local code.

## State Management Decision Rules
- Keep state local by default.
- Lift state only when multiple siblings truly require shared ownership.
- Introduce context only for stable cross-cutting concerns.
- Avoid global state libraries unless clear complexity demands it.

## Type Safety Rules
- Prefer explicit domain types in lib/types.ts (or feature-local typed modules).
- Keep API response parsing typed and narrow unknown data carefully.
- Avoid any; use unknown + type guards when needed.
- Ensure component props are explicit and minimal.

## Required Workflow
Follow this sequence for each architecture task.

### Phase 1: Diagnose
1. Inspect current implementation and identify architectural pain points.
2. Classify issue type: duplication, coupling, monolith, weak typing, mixed concerns, naming drift.
3. Confirm whether change is necessary for measurable maintainability/readability gains.

### Phase 2: Propose Before Editing
Before editing, explicitly provide:
1. Current problem
2. Proposed architecture
3. Affected files
4. Incremental refactor plan
5. Functional risks and mitigation

### Phase 3: Refactor Incrementally
1. Apply smallest structural change first.
2. Preserve public behavior and existing route/API contracts.
3. Keep changes easy to review and reversible.
4. Avoid broad rewrites for stylistic consistency alone.

### Phase 4: Verify
After edits, verify:
- Existing functionality remains intact
- TypeScript errors
- Lint errors
- Broken imports
- Obvious runtime regressions
- No accidental architecture drift in unrelated files

Suggested commands from repo root:
- npm run typecheck
- npm run lint
- npm run build (for broad/high-risk refactors)

## Decision Points and Branching
- If a refactor adds more abstraction than clarity, simplify.
- If a component is large but cohesive, split only when responsibilities are clearly separable.
- If extraction increases prop drilling significantly, reassess boundary design.
- If adding shared state increases coupling, prefer local state + explicit props.
- If strong typing conflicts with delivery speed, choose minimal safe typing improvements first, then iterate.

## Completion Criteria
An architecture task is complete only when:
- Problematic coupling/duplication is reduced.
- Responsibilities are clearer across UI/data/logic/utilities.
- Naming and file organization improve discoverability.
- Type safety is preserved or improved.
- Existing functionality is verified and unchanged in behavior.
- Typecheck/lint pass or known issues are explicitly documented.

## Output Format for Architecture Refactors
Use this structure:
1. Current Problem
2. Proposed Architecture
3. Affected Files
4. Incremental Refactor Steps
5. Verification Results
6. Residual Risks / Next Iteration

## Example Prompts
- /portfolio-frontend-architecture Refactor the homepage composition into clearer section modules without changing behavior or visual output.
- /portfolio-frontend-architecture Audit and reduce duplication between UI components and utility logic while keeping type safety strict.
- /portfolio-frontend-architecture Improve API-to-UI boundaries so fetched portfolio data stays typed and easier to extend.
- /portfolio-frontend-architecture Split monolithic component responsibilities into maintainable units with minimal architectural churn.
