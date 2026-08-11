---
name: portfolio-motion-design
description: "Design and implement professional animation and micro-interactions for this portfolio using subtle, performant, accessibility-aware motion. Use when improving entrances, transitions, interaction feedback, and storytelling without distracting users or slowing the site."
argument-hint: "Describe the section, intended interaction, trigger, motion intensity, target devices, and any performance constraints."
user-invocable: true
---

# Portfolio Motion Design Skill

## Purpose
Design and implement polished, responsive, modern motion throughout the portfolio without becoming distracting, heavy, or slow.

Target feel: premium, technical, and understated rather than flashy.

Always prioritize:
1. Usability
2. Accessibility
3. Performance
4. Maintainability
5. Visual polish

## Use When
Use this skill when asked to:
- Improve page transitions, hero entry, and section reveal behavior
- Add navigation, button, card, image, modal/dialog, and loading micro-interactions
- Build scroll-based storytelling with restraint
- Coordinate motion patterns with existing 3D/WebGL elements
- Standardize timing/easing and reduce inconsistent motion across the portfolio

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Frontend: Next.js + React + TypeScript in `apps/web`
- Installed animation libraries: `framer-motion` and `animejs`
- Current usage includes Framer Motion variants/hover/reveal patterns and anime.js text scramble
- Reduced-motion handling exists in global styles and must be preserved/expanded

## Hard Constraints
- Inspect existing framework and dependencies before adding motion.
- Reuse existing dependencies whenever practical.
- Do not add overlapping animation libraries without clear need.
- Do not replace the existing framework or architecture.
- Avoid animation that delays access to key content.
- Avoid animating every element.
- Keep motion language consistent across the site.

## Animation Principles
- Use motion to communicate hierarchy, interaction, state, and spatial relationships.
- Prefer subtle, intentional animation over dramatic effects.
- Motion should clarify, not decorate by default.
- Maintain consistent timing, easing, and motion scale.
- Keep information discoverable immediately.

## Recommended Motion Targets
Use motion where it improves comprehension and feedback:
- Page transitions
- Hero entrance
- Section reveal
- Navigation interactions
- Button hover/focus states
- Project card interactions
- Image transitions
- Modal/dialog transitions
- Loading and async states
- Scroll storytelling (only when useful)
- Interactive 3D element integration (when present)

## Performance Rules
- Respect `prefers-reduced-motion` for all non-essential animation.
- Avoid layout shifts during animation.
- Prefer `transform` and `opacity`.
- Avoid animating costly properties (for example: width, height, top/left, heavy filters) at scale.
- Avoid expensive effects on large numbers of DOM elements.
- Avoid continuous/infinite animations unless they provide real value.
- Keep stagger counts and durations conservative.
- Profile heavy sequences on mobile and low-power devices.

## Accessibility Rules
- Reduced-motion users must receive equivalent content and controls.
- Focus states must remain visible and not be obscured by animated overlays.
- Motion must not hide or replace essential semantic content.
- Keyboard users must be able to navigate interactive states without timing traps.

## Reusability and Architecture
- Create reusable animation utilities/components instead of per-element ad hoc motion.
- Keep animation configs separate from business/data logic where practical.
- Use TypeScript types for reusable motion APIs and variant maps.
- Standardize timing/easing tokens and reuse them.
- Minimize rerenders by memoizing derived animation config when needed.

## Motion Token Guidance
Establish and reuse a small set of shared motion tokens:
- Duration tiers: fast, normal, slow
- Easing curves: standard, emphasize-in, emphasize-out
- Distance tiers: subtle, medium
- Delay tiers: immediate, short, stagger-step

If project tokens already exist, align with them before creating new ones.

## Library Decision Policy
1. Use `framer-motion` for most UI animation and interaction states.
2. Use `animejs` for targeted effects where it already provides value (for example text effects).
3. Introduce `gsap` only if a complex timeline cannot be implemented cleanly with existing stack.
4. For 3D-specific animation concerns, coordinate with the portfolio 3D/WebGL workflow and avoid duplicate animation responsibility.

## Required Workflow
Follow this sequence for each animation task.

### Phase 1: Inspect
1. Inspect relevant components/routes/styles and existing motion behavior.
2. Identify UX objective for the motion change.
3. Determine whether animation is necessary or if static clarity is better.
4. Confirm dependency reuse strategy.

### Phase 2: Motion Brief (Before Major Implementation)
Before implementing major animation, explicitly provide:
1. Intended interaction
2. Animation trigger
3. Duration and easing
4. Performance considerations
5. Reduced-motion behavior

### Phase 3: Implement
1. Implement smallest effective motion change first.
2. Prefer reusable variants/utilities/components.
3. Keep motion consistent with existing visual language.
4. Ensure no blocking of primary content or actions.

### Phase 4: Validate
After edits, verify:
- TypeScript errors
- Lint errors
- Broken imports
- Obvious runtime issues
- Reduced-motion path behavior
- No major layout shifts introduced by animation
- Mobile/touch usability remains strong

Suggested commands from repo root:
- `npm run typecheck`
- `npm run lint`
- `npm run build` (for broad/high-risk changes)

## Decision Points and Branching
- If motion does not improve comprehension or feedback, remove it.
- If animation risks performance on mobile, simplify or disable at that breakpoint.
- If timing conflicts between components feel inconsistent, normalize using shared tokens.
- If reduced-motion parity is unclear, stop and implement fallback path first.
- If multiple libraries could solve the same need, prefer the already-installed one.

## Completion Criteria
A motion task is complete only when:
- Motion improves hierarchy/interaction clarity.
- Animations feel coherent and understated across sections.
- Core content remains immediately accessible.
- Reduced-motion behavior is implemented and acceptable.
- Performance remains smooth on representative devices.
- Typecheck/lint pass or known issues are explicitly documented.

## Output Format for Motion Improvements
Use this response structure:
1. Intended Interaction
2. Trigger
3. Duration and Easing
4. Performance Considerations
5. Reduced-Motion Behavior
6. Files to Modify
7. Implementation Summary
8. Validation Results
9. Residual Risks / Next Iteration

## Example Prompts
- `/portfolio-motion-design Refine hero entrance and navigation interactions to feel premium while keeping first content immediately readable.`
- `/portfolio-motion-design Standardize hover/focus/card reveal motion across project and capability sections with shared timing/easing tokens.`
- `/portfolio-motion-design Add polished modal and loading transitions with strict reduced-motion behavior and no layout shifts.`
- `/portfolio-motion-design Audit all major animations and simplify anything that hurts performance or usability on mobile.`
