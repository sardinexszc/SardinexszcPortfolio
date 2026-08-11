---
name: portfolio-content-strategy
description: "Improve the presentation and information architecture of a personal developer portfolio so it clearly communicates technical identity, work, research, experience, and contact information without inventing claims."
argument-hint: "Describe the section to improve, the audience to target, and any facts or links that should be included or verified."
user-invocable: true
---

# Portfolio Content Strategy Skill

## Purpose
Create a concise, evidence-based portfolio narrative that presents the owner primarily as a technology professional and software developer while also communicating experience across web development, software engineering, data science, AI, database development, research and development, IoT and embedded systems, automation, and systems development.

Always prioritize:
1. Accuracy over marketing language
2. Clarity over embellishment
3. Scannability over verbosity
4. Technical specificity over generic claims
5. Audience-fit for recruiters, clients, technical peers, and researchers

## Use When
Use this skill when asked to:
- Improve hero copy and first impression messaging
- Strengthen the about section and professional positioning
- Rework skills presentation for clarity and relevance
- Refine project descriptions and case studies
- Improve experience, research, education, or contact content
- Reorganize content architecture for easier scanning and decision-making
- Update portfolio messaging without inventing credentials or achievements

## Workspace Context Snapshot (Current Project)
Validate assumptions first, then use this baseline unless changed later:
- Monorepo root with `apps/web` as a Next.js 16 + React 19 + TypeScript app
- Portfolio content is likely surfaced through the main page and supporting components
- Resume-style content can be sourced from existing portfolio data and local content files
- The portfolio should remain factual, concise, and technical rather than promotional or generic

## Hard Constraints
- Do not fabricate experience, technologies, achievements, clients, projects, certifications, or job titles.
- Use only verified facts from the existing portfolio data, source materials, or user-provided information.
- When important details are missing, ask for them instead of filling gaps.
- Prefer specific technical evidence over vague adjectives.
- Keep content concise and scannable.
- Avoid generic phrases such as “passionate developer,” “hardworking professional,” or “innovative solutions.”
- Preserve the existing architecture and avoid unnecessary rewrites unless content structure clearly needs improvement.

## Audience and Information Architecture Goals
Organize the portfolio so readers can quickly understand:
1. Who the person is
2. What they build
3. What technologies they use
4. What projects they have completed
5. What problems they solve
6. Their research and technical work
7. Their professional experience
8. How to contact them

## Content Standards
- Lead with the most relevant professional identity first.
- Make the portfolio feel technical and grounded in real work.
- Present capabilities as combinations of domain knowledge, engineering practice, and delivery outcomes.
- Use clear section hierarchy with short summaries and scannable bullets.
- Favor concrete descriptions such as systems built, problems solved, tools used, and outcomes observed.
- Distinguish between research work, engineering work, and professional roles clearly.
- Keep copy concise; use short paragraphs, compact lists, and strong section headers.

## Section-Specific Guidance

### Hero Copy
- State the person’s primary role clearly and immediately.
- Mention the core professional identity and the most relevant domains.
- Keep it short and specific.
- If the role is multidimensional, prioritize the most central identity and support it with a few concrete areas of work.
- Avoid abstract claims; use evidence-based positioning.

### About Section
- Explain who the person is in professional terms.
- Highlight the combination of software engineering, systems thinking, data/AI work, research, and applied development.
- Make the experience profile understandable to multiple audiences at once.
- Keep the section focused on capability and relevance rather than personality clichés.

### Skills Presentation
- Group skills by capability rather than presenting a flat list.
- Show practical clusters such as software development, data and AI, systems and automation, databases, and research-driven engineering.
- Use categories that reflect how a recruiter, client, or peer would interpret the work.
- Keep the wording grounded in actual experience and tools.

### Project Descriptions
Each project description should emphasize:
- Problem
- Solution
- My contribution
- Technologies
- Technical architecture where relevant
- Results or outcomes
- Links, demos, or source code where available

Use a structure like:
- Problem: what needed to be solved
- Approach: how the work was addressed
- Contribution: what was built or delivered
- Technologies: tools and stack used
- Outcome: measurable or observed result where known

### Case Studies
- Prefer a compact narrative with a clear problem-to-solution flow.
- Focus on the technical decision-making and domain context.
- Keep the case study readable in a short format.
- Include enough detail to be credible without becoming overly long.

### Experience
- Present roles and responsibilities clearly.
- Emphasize the scope of the work, the systems involved, and the outcomes.
- Avoid inflated titles or vague descriptions.
- If a role is uncertain, ask for clarification before rewriting.

### Research Section
- Separate research work from professional development work where useful.
- Highlight the research question, methods, tools, or systems involved.
- Keep the tone precise and evidence-based.
- Do not overstate significance or impact without verified context.

### Education
- Present academic background clearly and simply.
- Use degrees, institutions, and relevant focus areas.
- Avoid adding extra interpretation unless the user explicitly wants it.

### Contact Section
- Make contact details easy to find and easy to use.
- Keep the section focused on direct pathways for engagement.
- Include contact options only when they are known and verified.

## Required Workflow
Follow this sequence for every content strategy task.

### Phase 1: Gather
1. Review existing portfolio content and any source material available.
2. Identify the section to improve and the intended audience.
3. Extract only facts that are already known or provided.
4. Note any gaps that require clarification from the user.

### Phase 2: Clarify
1. If the portfolio is missing important context, ask targeted questions.
2. If a claim would require invention, pause and request the missing detail instead.
3. Confirm whether the user wants a concise revision, a more technical tone, or a more recruiter-friendly structure.

### Phase 3: Rewrite
1. Restructure the content for scanning and quick comprehension.
2. Replace generic phrasing with concrete, technical descriptions.
3. Make each section answer the audience’s likely question quickly.
4. Keep the voice professional, direct, and evidence-based.

### Phase 4: Verify
After edits, confirm:
- Claims remain factual and supported by available information
- No invented credentials, achievements, or technologies were introduced
- The content is concise and scannable
- The section hierarchy is clear and useful for the target audience

## Decision Points and Branching
- If the user has strong verified facts, use them as the foundation and keep the writing concise.
- If the user lacks enough detail for a section, ask for the missing information rather than filling the gap.
- If the content is too broad, narrow the scope to the most relevant professional identity and strongest evidence.
- If the content is too generic, replace it with more concrete technical detail.
- If the content is too long, trim it into a short summary plus supporting bullets.

## Completion Criteria
A content strategy task is complete only when:
- The portfolio presents the person clearly and credibly
- The content is organized around the most important questions a reader would ask
- The writing is concise, scannable, and technically specific
- No unsupported claims have been introduced
- The section structure helps recruiters, clients, peers, and researchers quickly find what they need

## Output Format for Each Content Task
Use this response structure when applying the skill:
1. Section or Page to Improve
2. Audience Focus
3. Verified Facts to Keep
4. Missing Information to Request
5. Recommended Content Structure
6. Drafted or Revised Copy
7. Verification Notes

## Example Prompts
- `/portfolio-content-strategy Rewrite the hero and about sections so the portfolio presents me as a technology professional and software developer with clear technical scope.`
- `/portfolio-content-strategy Improve the project section so each item clearly explains the problem, solution, contribution, technologies, and results.`
- `/portfolio-content-strategy Rework the skills section so it is easier for recruiters and technical professionals to understand my capabilities.`
- `/portfolio-content-strategy Improve the research and experience sections so they are concise, scannable, and evidence-based.`
- `/portfolio-content-strategy Help me tighten the contact and education sections without inventing missing information.`
