---
name: portfolio-accessibility
description: "Audit and improve portfolio accessibility using modern WCAG principles. Use when reviewing and fixing semantics, keyboard behavior, focus, contrast, form and media accessibility, motion preferences, and screen reader compatibility without unnecessary redesign."
argument-hint: "Describe the page or section, user-reported accessibility issue, target assistive scenarios, and acceptance criteria."
user-invocable: true
---

# Portfolio Accessibility Skill

## Purpose
Audit and improve accessibility across the portfolio while preserving existing functionality and visual intent.

Goal: accessibility improvements that are practical, standards-aligned, and non-disruptive.

Always prioritize:
1. Usability
2. Accessibility compliance and inclusivity
3. Performance
4. Maintainability
5. Visual consistency

## Use When
Use this skill when asked to:
- Run accessibility audits on the portfolio
- Fix keyboard, focus, semantic, contrast, form, or screen-reader issues
- Improve dialog, loading, dynamic content, motion, and mobile accessibility behavior
- Apply WCAG-guided fixes without unnecessary redesign

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Frontend is Next.js + React + TypeScript in apps/web
- Primary UI structure is built from app layout, sectioned homepage components, and custom CSS
- Interactive patterns include fixed chatbot panel/toggle, smooth scroll nav links, theme toggle, section cards, and motion effects
- Reduced-motion handling already exists and must be preserved or improved

## Hard Constraints
- Inspect the entire application before making changes.
- Preserve existing functionality and routes.
- Do not redesign the portfolio unnecessarily while performing accessibility fixes.
- Use semantic HTML first.
- Prefer fixing incorrect HTML rather than compensating with ARIA.
- Keep links for navigation and buttons for actions.

## WCAG-Aligned Audit Scope
Audit and fix as applicable:
- Semantic HTML
- Heading hierarchy
- Navigation
- Keyboard navigation
- Focus management
- Focus indicators
- Color contrast
- Form labels
- Error messages
- Button and link semantics
- Images and alt text
- Icon accessibility
- Screen reader behavior
- Modal/dialog accessibility
- Mobile accessibility
- Reduced motion
- Dynamic content announcements
- Loading states

## Non-Negotiable Rules
- Prefer semantic HTML over unnecessary ARIA.
- Do not use ARIA to compensate for incorrect HTML.
- Every interactive element must be keyboard accessible.
- Links should navigate; buttons should perform actions.
- Do not remove visible focus indicators without equivalent replacement.
- Do not rely on color alone to communicate information.
- Do not make important information available only through animation or 3D.

## Required Improvement Loop
For every accessibility improvement, follow this exact sequence:
1. Identify the issue.
2. Explain why it matters.
3. Implement the fix.
4. Verify that the fix does not break the UI.

## Required Workflow
Follow this sequence for each accessibility task.

### Phase 1: Full Inspection
1. Inspect app shell, routes, components, styles, and interaction flows.
2. Map all interactive controls and content landmarks.
3. Identify issues by severity: blocking, major, minor.

### Phase 2: Plan Before Editing
Before editing, explicitly state:
1. Issue(s) detected
2. WCAG intent/principle addressed
3. Proposed fix approach
4. Files to modify
5. UI regression risks to watch

### Phase 3: Implement Minimal Safe Fixes
1. Apply smallest semantic-first fix that resolves the issue.
2. Reuse existing components/tokens where possible.
3. Avoid introducing accessibility regressions in unrelated sections.

### Phase 4: Verify
After edits, verify:
- Keyboard path and focus order
- Focus visibility
- Semantics and heading order sanity
- Contrast and readability sanity
- Form/input label behavior and error messaging
- Dynamic content announcement behavior where applicable
- Motion/reduced-motion behavior
- Mobile accessibility and touch-target usability
- TypeScript/lint/import/runtime sanity

Suggested commands from repo root:
- npm run typecheck
- npm run lint
- npm run build (for broad/high-risk changes)

## Section Priority Checklist
Always check these portfolio areas first:
- Header/navigation and section links
- Hero content and primary CTA paths
- Project cards and external links
- Capabilities/skills cards and animated counters
- Timeline/experience scan path
- Chatbot toggle, panel, message log, quick-action buttons, and input form
- Contact links and downloadable file actions
- Theme toggle and any floating controls
- Footer semantics and readability

## Typical Fix Strategies
Apply context-appropriate strategies such as:
- Landmark and heading correction
- Correct element semantics (button vs link)
- Keyboard operability and tab stop cleanup
- Focus-visible style reinforcement
- Label and description associations for controls
- Live region tuning for dynamic updates
- Contrast-safe token adjustments
- Reduced-motion fallback behavior

## Decision Points and Branching
- If semantic HTML can solve the issue, do that before adding ARIA.
- If a visual fix conflicts with focus visibility, prioritize focus visibility.
- If an animation impairs comprehension or comfort, reduce or disable it for affected users.
- If a component is inaccessible by keyboard, block further polish until operability is fixed.
- If a fix risks layout regressions, apply incrementally and validate at each step.

## Completion Criteria
An accessibility task is complete only when:
- Reported issues are fixed with semantic-first solutions.
- Interactive elements are keyboard accessible and correctly typed.
- Focus indicators are clearly visible.
- Heading/landmark structure is sane.
- Contrast and text readability are acceptable.
- Dynamic and loading states communicate status accessibly.
- Reduced-motion users are not forced through motion-heavy flows.
- Fixes do not break UI or existing behavior.
- Typecheck/lint pass or known issues are explicitly documented.

## Output Format for Accessibility Improvements
Use this structure:
1. Issue
2. Why It Matters
3. Fix Implemented
4. Verification (No UI Breakage)
5. Files Updated
6. Residual Risks / Next Checks

## Example Prompts
- /portfolio-accessibility Audit the entire homepage for semantic structure, keyboard flow, and focus visibility, then fix high-priority issues first.
- /portfolio-accessibility Improve chatbot accessibility including labels, announcements, and keyboard behavior without changing visual design significantly.
- /portfolio-accessibility Run a contrast and interactive-control audit across hero, projects, capabilities, and contact sections.
- /portfolio-accessibility Review motion and reduced-motion behavior and ensure critical information is never conveyed by animation alone.
