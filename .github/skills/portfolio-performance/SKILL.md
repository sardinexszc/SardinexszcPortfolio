---
name: portfolio-performance
description: "Audit and optimize portfolio performance with measurement-first workflows across frontend, backend, media, animation, and interactive features while preserving accessibility, usability, and visual quality."
argument-hint: "Describe the performance issue, affected page/feature, target devices, and performance goals."
user-invocable: true
---

# Portfolio Performance Skill

## Purpose
Audit and optimize portfolio performance using evidence-driven improvements rather than speculative tuning.

The portfolio may include:
- 3D/WebGL
- Animations
- Large images
- Videos
- Interactive components
- AI chatbot functionality
- API requests

Always prioritize:
1. Measurable impact
2. Usability and accessibility preservation
3. Visual quality where practical
4. Maintainability
5. Cost-effective optimization effort

## Use When
Use this skill when asked to:
- Diagnose slow page load or interaction issues
- Reduce bundle/CSS/media/network overhead
- Improve API latency and caching behavior
- Optimize animation, 3D, and interactive feature performance
- Improve rendering strategy (client/server boundaries) where applicable

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Frontend is Next.js App Router + React + TypeScript
- Styling is Tailwind + large custom CSS files
- Current animations use Framer Motion and animejs
- Chatbot is client-side rule-based (no server LLM endpoint currently)
- API data is fetched from Laravel backend with revalidate settings
- No current three.js/R3F canvas scene is implemented yet

## Performance Audit Scope
Audit at minimum:
- Initial page load
- JavaScript bundle size
- CSS size
- Image size
- Font loading
- 3D rendering cost
- Animation performance
- Network requests
- API latency
- Client-side rendering cost
- Server-side rendering where applicable
- Caching
- Lazy loading

## Core Principles
- Do not optimize blindly.
- Identify actual bottlenecks before changing architecture.
- Prefer measurable improvements.
- Avoid premature optimization.
- Preserve visual quality where practical.
- Do not sacrifice accessibility or usability for performance.

## Preferred Optimization Techniques
Use as appropriate:
- Lazy loading
- Dynamic imports
- Code splitting
- Image optimization
- Responsive images
- Font optimization
- Caching
- Memoization where appropriate
- Efficient database queries
- Server-side processing where appropriate

## 3D-Specific Optimization Rules
If 3D/WebGL is present or added:
- Reduce polygon counts.
- Reduce particle counts.
- Reuse geometries/materials.
- Avoid unnecessary render loops.
- Reduce post-processing passes.
- Disable expensive effects on mobile when appropriate.
- Keep core content usable without heavy 3D.

## Pre-Optimization Inspection Checklist
Before changing code, inspect:
1. Route/component architecture and render boundaries
2. Existing bundle composition and heavy dependencies
3. Media assets and loading behavior
4. API request fan-out and caching settings
5. Animation and interaction hotspots
6. Database query patterns on backend endpoints
7. Existing user-perceived bottlenecks by device class

## Measurement-First Workflow
Always collect baseline metrics before optimizing. Use a consistent set of checks for comparability.

Suggested metric categories:
- Page load and Core Web Vitals proxies
- JS/CSS transferred and executed size
- Request count and critical-path latency
- Render/animation smoothness under representative load
- API response time percentiles for key endpoints

## Required Workflow
Follow this sequence for each performance task.

### Phase 1: Diagnose
1. Identify target pages/features and user-visible symptoms.
2. Capture baseline metrics and bottleneck evidence.
3. Rank bottlenecks by expected impact and implementation cost.

### Phase 2: Propose Before Editing
Before editing, explicitly provide:
1. Bottleneck(s) identified
2. Proposed optimization(s)
3. Expected measurable impact
4. Affected files/components/endpoints
5. Risks to accessibility/usability/visual quality

### Phase 3: Implement Incrementally
1. Apply smallest high-impact changes first.
2. Keep architectural churn minimal unless evidence justifies deeper refactor.
3. Preserve behavior and design intent.
4. Add feature flags or conditional behavior for expensive enhancements when needed.

### Phase 4: Verify
After optimization, always report:
- What changed
- Expected impact
- Trade-offs

Also verify:
- No regression in accessibility/usability
- No functional regressions
- Performance improvement against baseline where measurable

## Frontend Optimization Guidance
- Keep heavy UI blocks split and lazily loaded where possible.
- Reduce re-renders for interactive components using memoization where justified.
- Keep animations transform/opacity-based where possible.
- Prevent long tasks caused by unnecessary client-side work.
- Optimize image delivery and dimensions per breakpoint.
- Keep font loading strategy efficient and non-blocking where practical.

## Backend and API Optimization Guidance
- Minimize endpoint query overhead and avoid redundant queries.
- Add indexes based on proven query patterns.
- Use response caching/revalidation strategies intentionally.
- Keep payloads concise and contract-focused.
- Separate public and admin data paths when latency or cost differs.

## Caching and Delivery Guidance
- Align cache/revalidate settings with content volatility.
- Cache stable portfolio data more aggressively than frequently changing admin data.
- Avoid stale critical contact/career status when freshness matters.
- Validate cache behavior across environments.

## Decision Points and Branching
- If no meaningful bottleneck evidence exists, do not refactor.
- If an optimization harms readability/maintainability disproportionately, prefer a simpler alternative.
- If visual quality drops significantly, rebalance with targeted optimization.
- If mobile performance regresses due to effects, reduce/disable expensive enhancements on constrained devices.
- If backend latency dominates, prioritize API/database tuning before frontend micro-optimizations.

## Completion Criteria
A performance task is complete only when:
- Changes are tied to identified bottlenecks.
- Improvements are measurable or strongly evidenced.
- Accessibility and usability are preserved.
- Visual quality remains acceptable.
- Functional behavior is unchanged unless explicitly intended.
- Post-change impact and trade-offs are documented.

## Output Format for Performance Work
Use this structure:
1. Baseline and Bottlenecks
2. Optimization Plan
3. Changes Implemented
4. Expected/Measured Impact
5. Trade-offs
6. Verification Results
7. Residual Risks / Next Iteration

## Example Prompts
- /portfolio-performance Audit homepage load and interaction performance, identify top 3 bottlenecks, and implement the highest impact fix first.
- /portfolio-performance Reduce JS/CSS overhead and improve media loading without sacrificing the current visual identity.
- /portfolio-performance Optimize API and caching strategy for portfolio data endpoints and document latency improvements.
- /portfolio-performance Prepare a 3D-ready performance strategy that keeps mobile experience fast and accessible.
