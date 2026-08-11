---
name: portfolio-3d-webgl
description: "Add high-quality 3D/WebGL experiences to this personal portfolio using a performance-first, accessibility-first approach. Use when proposing or implementing Three.js/R3F scenes, interactive technical visuals, and graceful fallbacks without harming usability, SEO, or mobile performance."
argument-hint: "Describe the section to enhance, desired 3D concept, interaction style, device constraints, and performance budget."
user-invocable: true
---

# Portfolio 3D/WebGL Integration Skill

## Purpose
Integrate sophisticated but performant 3D visualizations into the personal developer portfolio while preserving usability, accessibility, SEO, loading speed, and mobile performance.

The final experience should feel like a premium software engineer portfolio, not a gaming website.

Always prioritize:
1. Usability
2. Accessibility
3. Performance
4. Maintainability
5. Visual polish

## Use When
Use this skill when asked to:
- Add or improve 3D/WebGL visualizations in portfolio sections
- Build a hero scene, technical environment, data visualization, or subtle depth interactions
- Evaluate whether to use Three.js, React Three Fiber, drei, GSAP, or Framer Motion
- Optimize 3D behavior for low-power devices and mobile

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Frontend is Next.js + React + TypeScript in `apps/web`
- Existing animation dependencies: `framer-motion`, `animejs`
- Not currently installed by default: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`
- Styling/design system is already established; do not replace framework or architecture

## Hard Constraints
- Inspect existing framework and dependencies before implementation.
- Reuse existing dependencies whenever practical.
- Do not add multiple libraries that solve the same problem.
- Do not replace the existing framework.
- Do not make the entire website dependent on WebGL.
- Keep critical content available in semantic HTML even when canvas is disabled.

## Library Selection Policy
Use this decision order:
1. If standard UI animation is enough, use existing `framer-motion`.
2. If timeline choreography is complex and difficult in Framer Motion, consider `gsap`.
3. Only add `three` + `@react-three/fiber` when true 3D/WebGL value exists.
4. Add `@react-three/drei` only for specific utility components actually needed.
5. Never install overlapping animation/3D libraries without a clear gap analysis.

## 3D Design Principles
- 3D must support content and identity, not distract from it.
- Prefer elegant technical visuals over generic decorative 3D.
- Use subtle camera movement, lighting, depth, abstract geometry, particles, grids, floating objects, or data-inspired forms.
- Avoid heavy autoplay experiences and unnecessary high-poly assets.
- Avoid making navigation or core messaging depend on a 3D scene.

## Candidate 3D Concepts
Use one or combine lightly, based on content context:
- Interactive 3D hero scene
- Abstract digital/network environment
- Floating technology nodes
- Interactive data visualization
- 3D software architecture representation
- Interactive project cards with subtle depth
- 3D skill ecosystem
- Research/data visualization scene
- Interactive computer/server/network vignette

## Performance Standards
- Lazy-load 3D scenes where appropriate.
- Use dynamic imports when supported.
- Never block initial page rendering for 3D.
- Keep polygon count modest.
- Minimize texture sizes and count.
- Avoid unnecessary post-processing passes.
- Reuse geometries and materials.
- Dispose of WebGL resources correctly.
- Keep particle counts conservative.
- Monitor GPU-heavy effects.
- Provide static or lightweight fallback for unsupported/low-power devices.
- Respect `prefers-reduced-motion`.

## Responsive Behavior Rules
- Use mobile-first behavior.
- Reduce or disable heavy 3D on small or low-power devices.
- Preserve content hierarchy when 3D is reduced or disabled.
- Ensure no critical information exists only in canvas.
- Prevent overflow and touch interaction conflicts.

## Accessibility Rules
- Canvas visuals must not be the only representation of important information.
- Provide meaningful HTML content near 3D scenes.
- Ensure keyboard navigation for related interactive controls.
- Respect `prefers-reduced-motion` with reduced or paused animation paths.
- Use ARIA only when semantic elements cannot represent intent.

## Implementation Standards
- Encapsulate scenes into reusable components.
- Keep scene configuration separate from page/UI composition.
- Use strict TypeScript types for scene props and configuration.
- Avoid unnecessary re-renders.
- Memoize expensive calculations/resources appropriately.
- Keep animation loops efficient and intentional.
- Preserve existing routes, APIs, and current functionality.

## Required Workflow
Follow this sequence for every 3D/WebGL task.

### Phase 1: Inspect and Scope
1. Inspect project structure, relevant pages/components, and dependency state.
2. Identify section goals and whether 3D is necessary.
3. Confirm which existing libraries can satisfy the requirement.
4. Define performance budget and fallback requirements for target devices.

### Phase 2: Explain Before Implementing
Before implementing any new 3D feature, explicitly provide:
1. Purpose of the 3D element.
2. User interaction model.
3. Performance impact.
4. Mobile fallback strategy.
5. Required dependencies.
6. Files that will be modified.

### Phase 3: Implement
1. Add or reuse dependencies with minimal overlap.
2. Build reusable scene components with clear props/config.
3. Integrate via progressive enhancement (HTML-first, canvas-enhanced).
4. Add reduced-motion and low-power fallback behavior.
5. Keep core content and CTAs independent of WebGL rendering.

### Phase 4: Validate
After changes, verify:
- TypeScript errors
- Lint errors
- Broken imports
- Obvious runtime issues
- Mobile usability and fallback behavior
- Reduced-motion behavior
- No new blocking render issues in initial load path

Suggested commands from repo root:
- `npm run typecheck`
- `npm run lint`
- `npm run build` (for broad/high-risk changes)

## Decision Points and Branching
- If 3D does not improve communication or credibility, use 2D motion/UI instead.
- If performance budget is exceeded, reduce effects before adding complexity.
- If mobile/touch UX degrades, simplify or disable advanced 3D for those breakpoints.
- If accessibility conflicts with visual design, accessibility wins.
- If additional dependency value is marginal, do not add it.

## Completion Criteria
A 3D/WebGL task is complete only when:
- The 3D addition reinforces portfolio identity and understanding.
- Core content remains fully usable without WebGL.
- Performance remains acceptable on desktop and mobile targets.
- Reduced-motion and fallback paths are present and functional.
- Typecheck/lint pass or known issues are explicitly documented.
- Existing routes, APIs, and key user journeys are unaffected.

## Output Format for Each 3D Improvement
Use this structure:
1. Purpose
2. Interaction Model
3. Performance Impact
4. Mobile Fallback
5. Required Dependencies
6. Files to Modify
7. Implementation Summary
8. Validation Results
9. Residual Risks / Next Iteration

## Example Prompts
- `/portfolio-3d-webgl Add a subtle interactive 3D hero background that supports my messaging and keeps text readability high.`
- `/portfolio-3d-webgl Build a lightweight 3D network visualization for the skills section with a static fallback on mobile.`
- `/portfolio-3d-webgl Add depth-enhanced project cards using progressive enhancement without blocking initial render.`
- `/portfolio-3d-webgl Propose and implement a research/data visualization scene with strong accessibility and reduced-motion support.`
