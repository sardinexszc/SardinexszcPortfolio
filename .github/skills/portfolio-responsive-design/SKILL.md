---
name: portfolio-responsive-design
description: "Make this personal portfolio fully responsive across mobile, tablet, laptop, desktop, and ultrawide displays using mobile-first, fluid layouts with no overflow regressions. Use when improving breakpoints, touch usability, typography scale, grids, and section-level adaptability while preserving existing functionality."
argument-hint: "Describe the section(s), current responsive issue, target devices, and success criteria."
user-invocable: true
---

# Portfolio Responsive Design Skill

## Purpose
Design and implement responsive behavior that keeps the portfolio readable, usable, and visually balanced from small phones to ultrawide monitors.

Always prioritize:
1. Usability
2. Accessibility
3. Performance
4. Maintainability
5. Visual polish

## Use When
Use this skill when asked to:
- Fix layout breakage across viewport sizes
- Improve mobile-first behavior and touch usability
- Prevent horizontal scrolling and overflow bugs
- Refine responsive typography, spacing, cards, and grids
- Improve section-level responsiveness for navigation, hero, projects, skills, timeline, statistics, contact, and footer

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Frontend is Next.js + React + TypeScript in apps/web
- Styling is primarily custom CSS in apps/web/src/app/globals.css with Tailwind available
- Current responsive breakpoints already exist (for example around 900px and 700px)
- No current Three.js or canvas-based 3D scene is present; responsive guidance for 3D is conditional for future additions

## Hard Constraints
- Inspect the existing application before making responsive changes.
- Preserve existing functionality and routes.
- Use mobile-first responsive design where appropriate.
- Do not create separate duplicated mobile and desktop implementations unless absolutely necessary.
- Prefer fluid, adaptive layouts over hard-coded dimensions.
- Avoid introducing unnecessary dependencies.

## Responsive Design Standards
- Prevent horizontal scrolling at all common and intermediate widths.
- Keep all text readable at small widths.
- Ensure navigation works on touch devices.
- Keep interactive controls at comfortable touch target sizes.
- Make typography, spacing, grids, cards, and images adapt smoothly.
- Use responsive containers, max-width constraints, and fluid spacing.
- Handle ultrawide screens with composition controls (content width, rhythm, and whitespace balance).

## Priority Sections for Review
Always inspect these first in each responsive pass:
- Navigation
- Hero section
- 3D canvas area (if present)
- Project cards
- Skills section
- Experience timeline
- Research/project statistics
- Contact section
- Footer

## 3D and Motion Responsive Rules
If a 3D scene or canvas exists now or is added later:
- Never place critical information only inside canvas.
- Reduce or disable heavy 3D effects on constrained devices.
- Keep the same content hierarchy when 3D is minimized/disabled.
- Ensure animation and 3D effects stay performant on mobile.
- Respect prefers-reduced-motion where relevant.

## Layout and CSS Guardrails
- Avoid fixed widths/heights that cause clipping or overflow.
- Prefer clamp(), minmax(), and intrinsic sizing for fluid behavior.
- Use grid/flex patterns that collapse cleanly without duplicated markup.
- Validate long text, chips/tags, and link rows for wrapping behavior.
- Keep media and cards within container bounds.

## Required Workflow
Follow this sequence for every responsive task.

### Phase 1: Inspect
1. Inspect affected components, layout containers, and existing breakpoint rules.
2. Identify where overflow, overlap, unreadable text, broken grids, or touch issues occur.
3. Determine whether issue is local component behavior or systemic layout/token issue.

### Phase 2: Plan Before Edits
Before major responsive edits, explicitly provide:
1. The responsive issue and affected viewport ranges.
2. The adaptation strategy (mobile-first and fluid rules).
3. The files that must change.
4. Why this approach preserves functionality and avoids duplicated implementations.

### Phase 3: Implement
1. Apply smallest safe responsive changes first.
2. Reuse existing component structure and tokens.
3. Prefer scalable CSS patterns over one-off overrides.
4. Keep behavior consistent across intermediate widths, not just named device breakpoints.

### Phase 4: Validate
After edits, verify:
- Overflow and horizontal scrolling
- Overlapping elements
- Unreadable text
- Broken grids
- Inaccessible controls
- Animation and 3D performance behavior (if present)
- TypeScript/lint/import/runtime sanity

Suggested commands from repo root:
- npm run typecheck
- npm run lint
- npm run build (for broad/high-risk changes)

## Breakpoint and Width Testing Guidance
Test a spread of widths, not only standard device presets.
Recommended minimum viewport checks:
- 320, 360, 390, 430
- 768, 820
- 1024, 1280, 1440
- 1728, 1920, 2560
Also inspect intermediate widths between these points to catch edge wrapping behavior.

## Decision Points and Branching
- If a section cannot remain usable with one shared layout, introduce minimal progressive changes before considering separate implementations.
- If fixing one breakpoint causes regressions elsewhere, prefer token/container adjustments over ad hoc overrides.
- If touch usability and dense desktop layout conflict, prioritize touch clarity on smaller widths and scale up progressively.
- If an effect harms readability/performance on small devices, simplify or disable it there.

## Completion Criteria
A responsive task is complete only when:
- No obvious horizontal scrolling remains.
- Primary content is readable across small to ultrawide widths.
- Navigation and interactive controls are usable on touch devices.
- Grids/cards/timelines/stat sections remain structurally sound.
- Motion/3D behavior is still performant where present.
- Existing functionality is preserved.
- Typecheck/lint pass or known issues are explicitly documented.

## Output Format for Responsive Improvements
Use this structure:
1. Responsive Problem
2. Affected Widths
3. Adaptation Strategy
4. Files to Modify
5. Why It Preserves Functionality
6. Implementation Summary
7. Validation Results
8. Residual Risks / Next Iteration

## Example Prompts
- /portfolio-responsive-design Audit and fix overflow and readability issues across the hero, projects, and contact sections from 320px to 1920px.
- /portfolio-responsive-design Refactor navigation and CTA interactions for stronger mobile touch usability without creating duplicate layouts.
- /portfolio-responsive-design Improve project cards and timeline responsiveness at intermediate widths where wrapping currently feels unstable.
- /portfolio-responsive-design Optimize ultrawide composition so the portfolio feels intentional at 1728px and above.
