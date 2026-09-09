---
name: portfolio-ai-slop-cleanup
description: "Audit and improve this developer portfolio when it feels AI-generated, generic, over-designed, repetitive, bloated, or template-like. Use for critical UI/UX, frontend architecture, animation, 3D, chatbot, and content reviews that preserve strong ideas while making the result deliberate, specific, credible, and human-designed."
argument-hint: "Describe the page or portfolio area to audit, the audience, and whether you want audit-only or approved cleanup."
user-invocable: true
---

# Portfolio AI Slop Cleanup

## Purpose

Act as a critical editor, UI/UX reviewer, frontend reviewer, and content cleanup specialist for this developer portfolio. Find patterns that make the work feel obviously AI-generated, generic, inflated, repetitive, over-designed, or template-like, then recommend or implement the smallest evidence-based improvements.

The target is a deliberately designed professional software engineering portfolio. Preserve personality, useful features, working architecture, and distinctive ideas that genuinely communicate the developer's work.

## Non-Negotiable Guardrails

- Inspect the relevant codebase before making judgments or edits. For a portfolio-wide request, inspect the full frontend, content sources, assets, routes, dependencies, and available backend/API surfaces.
- Inspect the rendered visual structure when possible using the local development server and browser or screenshot tooling.
- Do not redesign the whole portfolio by default.
- Do not replace working architecture without a strong technical reason.
- Do not remove useful features merely because they were AI-generated.
- Do not invent projects, metrics, clients, outcomes, credentials, technologies, or impact.
- Treat unsupported claims as neutral or request clarification; never strengthen them speculatively.
- Confirm that components, assets, packages, and experiments are unused before recommending removal.
- Do not make broad removals or redesigns without user approval.
- Small, low-risk factual or clarity fixes may proceed after the cleanup plan is presented; ask before large removals, structural redesigns, or feature changes.
- Keep the portfolio distinctive. Remove generic novelty, not meaningful identity.

## Required Workflow

### Phase 1: Scope and Evidence

1. Determine whether the request is audit-only, audit plus small fixes, or an approved implementation.
2. Inspect the relevant route and its composing components first. For a portfolio-wide request, inspect:
   - hero and navigation
   - project cards and case studies
   - skills, experience, research, and architecture visualization
   - 3D elements and animation code
   - chatbot, CTAs, contact, and footer
   - typography, colors, spacing, borders, shadows, and motion tokens
   - content/data sources, assets, links, routes, and dependencies
3. Check whether a live visual review is available. Capture representative desktop and mobile views when practical.
4. Build conclusions from concrete evidence: file paths, rendered behavior, repeated copy, measurable layout patterns, or confirmed dead references.
5. Before editing, state one local hypothesis about the main credibility or usability problem and one cheap check that could disconfirm it.

### Phase 2: Audit Before Editing

Classify every major section with one primary decision:

- **KEEP**: Strong and intentional; preserve it.
- **REFINE**: The concept is useful but the execution is excessive, generic, or inconsistent.
- **REMOVE**: Noise, novelty, or unusable functionality with no meaningful contribution.
- **MERGE**: Duplicates information that belongs in another section.
- **SIMPLIFY**: Too many elements, effects, tags, controls, or words.
- **REWRITE**: Copy is generic, inflated, repetitive, or unsupported.

For every finding, record:

- Location
- Problem
- Evidence
- Why it feels AI-generated or harms usability/credibility
- Recommended action: KEEP, REFINE, REMOVE, MERGE, SIMPLIFY, or REWRITE
- Expected improvement
- Confidence and any missing information

Use this report structure before modifications:

```markdown
# AI SLOP AUDIT

## Critical

## High Priority

## Medium Priority

## Low Priority

## Keep
```

Prioritize findings by their effect on credibility, comprehension, accessibility, performance, and maintainability, not by how easy they are to change.

## Audit Heuristics

### Visual and Layout Slop

Flag, with evidence, excessive gradients, glow, neon outlines, glassmorphism, nested cards, rounded containers, shadows, floating blobs, particle backgrounds, decorative grids/noise, purposeless code snippets, animated backgrounds, cursor effects, parallax, marquee text, section-number labels, oversized type, repeated pills, excessive icons, or animation on every section.

Check whether every section repeats the same centered card or two-column composition, whether whitespace hides a lack of information, and whether visual effects compete with readable project evidence.

Prefer strong typography, clear hierarchy, restrained borders, subtle depth, useful whitespace, clean backgrounds, and one or two intentional treatments per component. Do not stack gradient + glow + glass + blur + border + lift + animated background without a clear purpose.

### Content and Credibility Slop

Flag generic headlines, developer slogans, buzzwords, corporate polish, repeated claims, unnecessary adjectives, fake metrics, inflated accomplishments, and claims without evidence. Watch especially for phrases such as:

- building innovative solutions
- creating impactful digital experiences
- passionate about technology
- transforming ideas into reality
- leveraging cutting-edge technologies
- seamless user experiences
- future-ready solutions

Treat words such as innovative, scalable, robust, seamless, cutting-edge, dynamic, powerful, modern, intelligent, and next-generation as claims requiring evidence, not automatic praise.

Rewrite toward concise, specific, natural language. Prefer descriptions of systems built, problems addressed, technical contributions, tools used, and observed outcomes. Preserve neutral wording when evidence is unavailable.

### Project Evidence

Projects are the strongest credibility signal. Prioritize, in this order:

1. Project screenshot or other truthful visual evidence
2. Project name
3. Problem
4. Solution or approach
5. Role and contribution
6. Technology used
7. Outcome, only when verified
8. Case study or source/demo link

Reduce decorative badges, excessive tags, oversized icons, generic mockup frames, repeated descriptions, and animations that distract from the project itself.

### Hero and Navigation

The hero should answer quickly: who the developer is, what they build, what type of work they have done, and where visitors can see it. Flag generic identity language, competing CTAs, overlarge headings, excessive animation, and decorative effects that delay comprehension.

Navigation should be clear, stable, keyboard-usable, and proportionate to the site. Remove labels or controls that do not help visitors decide where to go.

### Skills, Experience, and Research

Do not present every technology as an equal skill. Prefer capability groups grounded in evidence, such as Frontend, Backend, Data, AI and Automation, IoT, and DevOps, with links to projects where possible. Remove arbitrary proficiency percentages and technology-logo walls.

Keep experience and research distinct when that improves comprehension. Use responsibilities, systems, methods, and verified outcomes rather than inflated role language.

### 3D and Architecture

Evaluate each 3D element with: "Does this help explain how I build systems?"

- If yes, keep it secondary to project evidence and simplify the scene.
- If no, recommend removal or a static, accessible alternative.

Do not remove an Engineering Ecosystem visualization when it genuinely communicates architecture. Flag generic globes, random objects, floating logos, excessive particles, cyberpunk styling, bloom, unrelated models, and GPU-heavy motion that communicates nothing.

Check loading, mobile behavior, keyboard/accessibility fallback, reduced motion, and whether a non-3D explanation remains available.

### Animation

Classify each animation as **Useful**, **Decorative but acceptable**, **Unnecessary**, **Distracting**, or **Performance-heavy**. Keep subtle hover transitions, section reveals, navigation feedback, and meaningful architecture motion. Remove continuous motion without purpose. Verify `prefers-reduced-motion`, stable dimensions, no layout shift, and usable touch behavior.

### Chatbot

The chatbot must remain secondary to the portfolio. Flag prominent generic "Ask AI" branding, automatic opening, fabricated answers, repeated portfolio text, fake typing delays, excessive prompts, navigation interference, and unnecessary visual weight. Verify that its answers use trusted portfolio data, disclose uncertainty, preserve keyboard/mobile usability, and do not invent claims.

### Code and Dependency Cleanup

Inspect for giant components, repeated markup, unnecessary abstractions, duplicate utilities/components, excessive comments, unnecessary state/effects/memoization, hard-coded repeated values, dead components, abandoned layouts, unused animation or 3D code, unused assets, and dependency duplication.

Only refactor when it improves maintainability, removes confirmed dead code, or fixes a concrete problem. Prefer small, reversible changes that preserve route, API, and public component behavior.

## Content Rules

- Use verified existing portfolio data, source documents, or user-provided facts.
- Prefer evidence over adjectives.
- Do not convert an absence of data into a claim.
- Remove repetition across hero, about, skills, projects, experience, and contact.
- Keep copy concise, technical where appropriate, and easy to scan.
- Preserve the developer's actual voice and distinctive work.

Example direction:

- Prefer: "Developed a centralized research management platform using Next.js and Supabase."
- Avoid: "Leveraged modern technologies to create an innovative, scalable, cutting-edge digital solution."

## Implementation Plan and Approval Gates

After the audit, group recommendations into phases rather than applying everything automatically:

### Phase 1: Content and Credibility

Remove unsupported or repetitive claims, tighten copy, clarify labels, and improve project evidence without changing the information architecture.

### Phase 2: Visual Simplification

Reduce redundant effects, decorative containers, excessive tags, and inconsistent tokens while preserving the established visual identity.

### Phase 3: Layout and Component Cleanup

Improve hierarchy, density, responsive behavior, semantic structure, and confirmed duplication. Preserve routes and useful interactions.

### Phase 4: Animation and 3D Cleanup

Remove distracting or performance-heavy motion, simplify 3D, and verify reduced-motion and fallback behavior.

### Phase 5: Code and Dependency Cleanup

Remove only confirmed dead experiments or dependencies and refactor only where maintainability materially improves.

Present the phases and identify which items are safe small fixes versus approval-required removals or redesigns. Wait for approval before large changes. After approval, implement one phase or narrow slice at a time and validate it before proceeding.

## Verification Checklist

After implementation, verify as applicable:

- application builds successfully
- TypeScript and lint checks pass
- imports, routes, project links, and API contracts remain valid
- all referenced assets load
- desktop and mobile layouts remain usable without horizontal overflow
- typography, contrast, focus states, semantics, and keyboard paths remain accessible
- animations still work and respect reduced motion
- 3D fallback, loading, and mobile behavior remain usable
- chatbot functionality, data grounding, and error states remain intact
- no important factual content was removed
- confirmed dead code/dependencies are actually unused

Use the narrowest useful executable check first, then broaden to build or visual verification for wider changes. Report known environmental failures separately from regressions caused by the change.

## Completion Report

Conclude with:

1. What was removed
2. What was simplified
3. What was rewritten
4. What was retained and why
5. Why each major decision was made
6. Validation results
7. Remaining AI-slop risks
8. Recommended future improvements

The finished portfolio should feel intentional, specific, technically credible, visually restrained, professional, and clearly designed around real engineering work rather than a single AI website-design prompt.

## Example Prompts

- `/portfolio-ai-slop-cleanup Audit the entire portfolio and produce the AI SLOP AUDIT only. Do not edit files.`
- `/portfolio-ai-slop-cleanup Audit the hero, navigation, and selected work sections, then propose Phase 1 content fixes.`
- `/portfolio-ai-slop-cleanup Review the 3D architecture visualization and chatbot for novelty, accessibility, performance, and credibility risks.`
- `/portfolio-ai-slop-cleanup Apply the approved Phase 1 cleanup to project descriptions without inventing outcomes.`
- `/portfolio-ai-slop-cleanup Find confirmed dead frontend experiments and dependencies, report evidence, and wait before removing them.`
