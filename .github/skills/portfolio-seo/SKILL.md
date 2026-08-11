---
name: portfolio-seo
description: "Optimize portfolio SEO, social sharing metadata, and discoverability with accurate content signals, structured data, and crawlable HTML using Next.js metadata patterns without keyword stuffing or misleading claims."
argument-hint: "Describe the page(s), SEO issue, metadata goals, and discoverability priorities."
user-invocable: true
---

# Portfolio SEO Skill

## Purpose
Optimize the portfolio for search engines, social sharing, and discoverability while keeping metadata truthful, consistent, and aligned with actual professional information.

Always prioritize:
1. Accuracy and trustworthiness
2. Crawlability and technical SEO health
3. Semantic clarity and content structure
4. Social sharing quality
5. Maintainability

## Use When
Use this skill when asked to:
- Improve titles, descriptions, canonical URLs, and social metadata
- Add or refine structured data for portfolio content
- Improve sitemap/robots behavior
- Improve semantic HTML and heading hierarchy for discoverability
- Improve internal linking and URL structure for better indexability

## Workspace Baseline (Verify Before Each Task)
Validate assumptions first, then use this baseline unless changed:
- Framework is Next.js App Router with metadata support
- Global metadata exists but is currently minimal
- Basic sitemap and robots files exist
- Homepage is the primary portfolio route and currently component-driven
- No extensive per-page metadata generation is currently implemented

## Pre-Implementation Inspection Checklist
Before implementation, inspect:
1. Existing framework metadata capabilities
2. Current page titles and meta descriptions
3. Canonical URL strategy
4. Open Graph and Twitter/X metadata coverage
5. Existing sitemap and robots configuration
6. Existing semantic HTML and heading hierarchy
7. Existing image metadata and alt patterns
8. Internal links and URL structure
9. Available structured data sources (portfolio API, resume/project metadata)

## Optimization Scope
Optimize where relevant:
- Page titles
- Meta descriptions
- Canonical URLs
- Open Graph metadata
- Twitter/X metadata
- Structured data
- Sitemap
- Robots.txt
- Semantic HTML
- Heading hierarchy
- Image metadata
- Internal linking
- URL structure

## Structured Data Guidance
Use structured data when appropriate for:
- Person
- WebSite
- WebPage
- CreativeWork
- SoftwareSourceCode
- Article
- Project-related content

Rules:
- Ensure structured data matches visible page content.
- Do not include unverifiable or inflated claims.
- Keep schema types aligned to actual content intent.

## Truthfulness and Content Integrity Rules
- Do not use misleading SEO information.
- Ensure metadata reflects actual skills, experience, projects, research, and professional identity.
- Do not keyword-stuff titles, descriptions, headings, or structured data.
- Prefer clear, human-readable wording over search-engine manipulation.

## Crawlability and Rendering Rules
- Ensure important portfolio content is available in crawlable HTML.
- Do not rely entirely on client-side visual effects/canvas for critical information.
- Keep core semantic content server-rendered or otherwise indexable.
- Preserve progressive enhancement for motion/visual layers.

## Project-Level SEO Rules
- Optimize project pages individually when appropriate.
- Use specific metadata per project (title, summary, canonical, OG image where available).
- Keep project metadata consistent with real project data sources.
- Avoid templated duplication across project entries.

## Required Change Protocol
For every SEO change, always do the following:
1. Explain the SEO purpose.
2. Identify affected files.
3. Implement the change.
4. Verify metadata is valid and consistent.

## Required Workflow
Follow this sequence for each SEO task.

### Phase 1: Audit
1. Inspect existing metadata and crawlability setup.
2. Identify high-impact gaps by priority (critical, important, nice-to-have).
3. Confirm source-of-truth content for claims and profile details.

### Phase 2: Propose Before Editing
Before editing, explicitly provide:
1. SEO purpose and expected impact
2. Affected files and route scope
3. Metadata/schema strategy
4. Consistency and accuracy checks
5. Risk of duplication or misleading signals

### Phase 3: Implement
1. Apply smallest high-impact metadata improvements first.
2. Add/adjust schema with truthful mappings to page content.
3. Improve semantic structure and internal linking where needed.
4. Update sitemap/robots behavior when route coverage changes.

### Phase 4: Verify
After edits, verify:
- Titles/descriptions/canonicals are consistent and route-correct
- OG/Twitter cards are complete and accurate
- Structured data is syntactically valid and content-aligned
- Important content is crawlable in HTML
- Heading hierarchy and semantic structure remain sensible
- No keyword stuffing or misleading claims introduced

Suggested checks:
- Build and route-level metadata inspection
- Structured data validator checks
- Social card preview validation
- Manual crawlability sanity check of rendered HTML

## Decision Points and Branching
- If content truth is uncertain, omit claim until verified.
- If page-level metadata duplicates global metadata excessively, introduce route-specific metadata.
- If dynamic project pages are added, generate metadata from typed project source data.
- If visual effects hide key content from crawlers, add explicit semantic HTML equivalents.
- If robots/sitemap changes could hide valuable pages, stage and verify before rollout.

## Completion Criteria
An SEO task is complete only when:
- Metadata is accurate, route-aware, and consistent.
- Social sharing previews are meaningful and professional.
- Structured data is valid and truthful.
- Core portfolio information remains crawlable HTML.
- Sitemap/robots reflect intended indexing strategy.
- No keyword stuffing or deceptive optimization is present.

## Output Format for SEO Work
Use this structure:
1. SEO Purpose
2. Affected Files
3. Changes Implemented
4. Validation and Consistency Checks
5. Residual Risks / Next Iteration

## Example Prompts
- /portfolio-seo Audit and upgrade homepage metadata, social tags, and structured data for accurate professional discoverability.
- /portfolio-seo Add route-specific SEO metadata strategy for project pages with truthful canonical and OG coverage.
- /portfolio-seo Improve semantic heading structure and crawlability of key portfolio content currently hidden behind visual layers.
- /portfolio-seo Refine sitemap and robots behavior for better indexing without exposing non-public routes.
