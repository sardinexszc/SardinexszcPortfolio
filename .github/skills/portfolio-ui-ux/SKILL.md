---
name: portfolio-ui-ux
description: "Continuously improve this personal developer portfolio UI/UX. Use when redesigning sections, refining visual hierarchy, improving responsiveness, accessibility, interaction states, and professional polish in Next.js/Tailwind without breaking routes or APIs."
argument-hint: "Describe which page/section to improve, UX pain points, target device(s), and success criteria."
user-invocable: true
---

# Portfolio UI/UX Improvement Skill

## Purpose
Create a premium, modern, technically impressive developer portfolio that presents the owner as a software developer, IT specialist, researcher, and data/AI-oriented builder.

Always prioritize:
1. Usability
2. Accessibility
3. Performance
4. Maintainability
5. Visual polish

## Use When
Use this skill when asked to:
- Improve the portfolio layout, UI, UX, readability, or professional look
- Refine hero, navigation, projects, skills, experience, research, or contact sections
- Improve responsive behavior across mobile, tablet, laptop, desktop, ultrawide
- Improve accessibility and interaction states
- Make design-system-level improvements using existing architecture

## Workspace Context Snapshot (Current Project)
Validate assumptions first, then use this baseline unless changed later:
- Monorepo root with `apps/web` (Next.js 16 + React 19 + TypeScript) and `apps/api` (Laravel)
- Frontend styling uses Tailwind CSS v4 plus extensive custom CSS in `apps/web/src/app/globals.css`
- Main page route is `apps/web/src/app/page.tsx` with UI composition in `apps/web/src/components/portfolio-page.tsx`
- Existing component modules include header, chatbot, hero effects, capabilities section, theme provider/toggle, and shared utilities in `apps/web/src/lib`

## Hard Constraints
- Inspect existing project structure, package files, routes/pages, components, assets, and design patterns before changing code.
- Keep the existing framework and architecture unless there is a strong technical reason to change.
- Reuse existing components, utilities, design tokens, and dependencies whenever practical.
- Do not introduce unnecessary libraries.
- Preserve existing functionality and do not break routes, APIs, or imports.

## Design and UX Standards
- Use strong visual hierarchy through typography, spacing, contrast, and composition.
- Keep interfaces custom and intentional, not template-generic.
- Apply progressive disclosure so content stays digestible.
- Make high-value information discoverable quickly.
- Keep navigation clear, hero strong, and CTA hierarchy obvious (primary vs secondary actions).
- Present projects as outcomes and value, not just screenshots.
- Group skills meaningfully (capability clusters, depth, and relevance), not an oversized flat list.
- Ensure experience and research entries are easy to scan.
- Keep contact access obvious and frictionless.

## Visual System Rules
- Use a consistent spacing system.
- Favor reusable design tokens (color, spacing, type, radius, shadow, timing).
- Keep border radius, shadows, typography rhythm, icon sizing, and component behavior consistent.
- Prefer subtle depth and sophisticated restraint.
- Avoid visual noise and gratuitous effects (excessive gradients, glow, heavy glassmorphism) unless they clearly support meaning.
- Protect text readability first.

## Responsive and Interaction Rules
- Use mobile-first implementation.
- Validate at representative sizes: mobile, tablet, laptop, desktop, ultrawide.
- Prevent horizontal overflow.
- Keep touch targets and navigation usable on touch devices.
- Scale typography/spacing fluidly and intentionally.
- Include polished states: hover, focus, active, loading, success, and error.
- Avoid unnecessary animation; respect `prefers-reduced-motion`.

## Accessibility Rules
- Use semantic HTML elements first.
- Use accessible labels for controls.
- Ensure keyboard navigation works across all interactive flows.
- Maintain sufficient color contrast.
- Provide visible focus states.
- Use ARIA only when semantic HTML is insufficient.
- Ensure images have meaningful alt text.
- Use proper interactive elements (`button`, `a`, form controls) instead of clickable non-semantic containers.

## Required Workflow
Follow this sequence for every UI/UX task.

### Phase 1: Discover
1. Inspect relevant structure and code before proposing edits.
2. Identify user-impacting UX/UI issues (information hierarchy, scanability, nav clarity, CTA clarity, visual consistency, accessibility, responsiveness).
3. Determine if issue is local (single section/component) or systemic (design token/component pattern).

### Phase 2: Explain Before Editing
Before any code change for a section, explicitly provide:
1. What UX problem exists.
2. What design improvement is recommended.
3. What files need to change.
4. Why the change improves the portfolio.

### Phase 3: Implement
1. Build reusable components rather than duplicating markup.
2. Separate presentation, data, and business logic when practical.
3. Keep code maintainable and aligned with existing conventions.
4. Apply the smallest safe change set that accomplishes the improvement.

### Phase 4: Verify
After edits, check for:
- TypeScript errors
- Lint errors
- Broken imports
- Obvious runtime issues

Suggested validation commands from repo root:
- `npm run typecheck`
- `npm run lint`
- `npm run build` (when changes are broad or high risk)

## Decision Points and Branching
- If a requested visual effect harms usability/readability/performance, choose a restrained alternative and explain tradeoffs.
- If a redesign conflicts with accessibility, accessibility wins.
- If a new dependency provides marginal value, avoid it and use existing stack capabilities.
- If requirements are unclear, ask focused questions before implementation.
- If a change is likely to break behavior, split into incremental, verifiable steps.

## Completion Criteria
A task is complete only when:
- Information hierarchy is clearer and scanability is improved.
- UI behavior is consistent across interaction states.
- Responsive behavior is verified with no obvious overflow/usability regressions.
- Accessibility checks pass at a practical manual level (semantic structure, keyboard path, focus visibility, contrast sanity).
- Typecheck/lint pass or known issues are explicitly documented.
- Existing functionality remains intact.

## Output Format for Each Improvement
Use this response structure when applying the skill:
1. Problem
2. Recommendation
3. Files to Update
4. Why It Helps
5. Implementation Summary
6. Validation Results
7. Residual Risks / Next Iteration

## Example Prompts
- `/portfolio-ui-ux Improve the hero and top navigation for stronger first impression and clearer CTAs on mobile.`
- `/portfolio-ui-ux Redesign project cards to emphasize outcomes, tech choices, and credibility signals while keeping performance high.`
- `/portfolio-ui-ux Improve skills and experience sections so recruiters can scan capabilities and impact in under 30 seconds.`
- `/portfolio-ui-ux Perform an accessibility-focused UI pass and fix keyboard/focus/contrast issues in the main page.`
