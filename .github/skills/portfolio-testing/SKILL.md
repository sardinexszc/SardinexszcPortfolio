---
name: portfolio-testing
description: "Create and maintain reliable tests for this personal portfolio. Use when adding unit, component, integration, API, end-to-end, accessibility, or responsive UI tests for the Next.js portfolio without introducing unnecessary overlapping test frameworks."
argument-hint: "Describe the feature, page, or bug to test, the expected behavior, and any existing constraints or dependencies."
user-invocable: true
---

# Portfolio Testing Skill

## Purpose
Create a practical, maintainable test strategy for the portfolio that validates real user behavior and protects the experience across the main web app and its supporting API routes.

Always prioritize:
1. User-visible behavior over implementation details
2. Deterministic tests that are easy to read and debug
3. Minimal tooling that fits the existing stack
4. Regression protection for bugs and regressions
5. Accessibility and responsive quality alongside functional correctness

## Use When
Use this skill when asked to:
- Add or improve unit tests
- Add or improve component tests
- Add or improve integration tests
- Add or improve API route tests
- Add or improve end-to-end tests
- Add or improve accessibility tests
- Add or improve responsive UI tests
- Test portfolio features such as navigation, project pages, contact form, chatbot, admin/auth flows, loading/error states, and interactive UI

## Workspace Context Snapshot (Current Project)
Validate assumptions first, then use this baseline unless changed later:
- Monorepo root with `apps/web` as a Next.js 16 + React 19 + TypeScript app
- No existing test runner is configured in the current workspace package files
- Frontend behavior lives in `apps/web/src/app` and `apps/web/src/components`
- Portfolio data and shared logic live under `apps/web/src/lib`
- API behavior is handled through Next.js route handlers and supporting utilities

## Hard Constraints
- Inspect existing package.json files before adding test tools.
- Reuse existing tools where practical instead of introducing redundant frameworks.
- Prefer the smallest setup that covers the requested coverage well.
- Keep tests deterministic and stable.
- Avoid testing implementation details or private helpers when a user-facing behavior can be tested instead.
- Never use real credentials, secrets, or private production data in tests.
- Mock external services and network dependencies appropriately.
- Do not remove failing tests simply to make the suite pass.

## Recommended Tooling Approach
Use the lightest setup that fits this portfolio:
- Prefer Vitest for unit, component, integration, and API-level testing.
- Use Testing Library for user-focused component and interaction tests.
- Add Playwright only when browser-level end-to-end or accessibility flows are clearly needed.
- Avoid adding Jest, Cypress, and Playwright together unless the scope specifically requires it.
- If the workspace already has a suitable tool in place, reuse it instead of adding a new runner.

## Test Coverage Priorities
Focus first on portfolio functionality that matters most:
- Navigation and route changes
- Project pages and project detail flows
- Contact form submission and validation
- API endpoints and route handlers
- Chatbot behavior and fallback responses
- Authentication and admin-related access flows
- Interactive components such as theme toggle, filters, accordions, tabs, or animated UI
- Responsive behavior across common breakpoints
- Error states and loading states
- Accessibility behaviors such as keyboard navigation, focus order, labels, and semantic structure

## Testing Standards
- Write tests around user-visible outcomes rather than internal implementation details.
- Prefer readable assertions that describe expected behavior in plain language.
- Use realistic interactions such as clicking, typing, submitting, and navigating.
- Keep mocks narrow and explicit; avoid over-mocking the entire app.
- For bugs, add a regression test before implementing the fix.
- Separate pure unit tests from browser-like interaction tests when practical.
- When testing layout or responsiveness, validate key behavior at representative viewport sizes rather than every pixel.

## Required Workflow
Follow this sequence for every testing task.

### Phase 1: Discover
1. Inspect the relevant package.json files and existing test setup.
2. Identify the feature, page, API, or component to cover.
3. Determine the smallest test scope that proves the behavior.
4. Check whether existing utilities, mocks, fixtures, or helpers can be reused.

### Phase 2: Plan
1. Choose the most appropriate test type:
   - Unit: pure business logic or utility behavior
   - Component: UI interaction and rendering
   - Integration: component + hook + data flow behavior
   - API: route handler and response behavior
   - End-to-end: user journey across the app
   - Accessibility: keyboard, labels, focus, semantics, screen-reader considerations
   - Responsive UI: layout/interaction behavior at key viewports
2. Decide whether a new test dependency is truly necessary.
3. Keep the plan aligned with the existing stack and repository conventions.

### Phase 3: Implement
1. Add the test in the relevant location under the web app test structure.
2. Use deterministic fixtures and explicit expectations.
3. Mock external services and network boundaries.
4. Keep test names descriptive and behavior-focused.
5. Add only the minimum supporting setup required for the test.

### Phase 4: Verify
After edits, run the relevant tests and confirm the result.
Suggested validation commands from repo root:
- `npm run typecheck`
- `npm run lint`
- `npm run build` when broader UI or routing changes are involved
- The specific test command for the targeted suite once test scripts are added

## Bug Workflow
For bugs, follow this order:
1. Reproduce the problem.
2. Create a regression test that captures the wrong behavior.
3. Fix the problem.
4. Run the relevant tests.
5. Report the result clearly, including whether the regression test now passes.

## Decision Points and Branching
- If the behavior is purely presentational and user-visible, prefer component tests over deep unit tests.
- If the behavior depends on routing, data fetching, or server logic, use integration or API tests.
- If the issue is cross-browser or a full journey, use Playwright for end-to-end coverage.
- If an accessibility issue is involved, test keyboard navigation, focus visibility, labels, and semantics alongside the rendering.
- If a test would be flaky because of timing, animation, or browser state, refactor the test to use stable selectors and explicit waits rather than brittle implementation assertions.
- If the existing setup already covers the need, do not add another test framework.

## Completion Criteria
A testing task is complete only when:
- The key user-facing behavior is covered by a relevant test.
- The test is deterministic and readable.
- The test focuses on behavior rather than implementation internals.
- External dependencies are safely mocked.
- The relevant test suite passes or any failures are explicitly documented.
- Accessibility and responsive concerns are addressed where relevant.

## Output Format for Each Testing Task
Use this response structure when applying the skill:
1. Feature or Bug Under Test
2. Recommended Test Type
3. Files to Update
4. Why This Test Matters
5. Implementation Summary
6. Validation Results
7. Remaining Risks or Follow-Up

## Example Prompts
- `/portfolio-testing Add a component test for the portfolio navigation and active-route behavior.`
- `/portfolio-testing Add an API test for the chatbot route and ensure it handles invalid input safely.`
- `/portfolio-testing Add a regression test for the contact form validation error state.`
- `/portfolio-testing Add an accessibility-focused test for keyboard navigation and focus handling in the main portfolio UI.`
- `/portfolio-testing Add a responsive UI test for the hero and project sections on mobile and desktop breakpoints.`
