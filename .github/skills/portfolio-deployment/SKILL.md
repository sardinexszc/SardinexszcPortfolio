---
name: portfolio-deployment
description: "Prepare, deploy, and maintain a personal portfolio in production across Vercel, GitHub, Cloudflare, or other hosting setups while keeping secrets safe, builds reliable, and production behavior verified."
argument-hint: "Describe the deployment target, the change being made, and any environment variables or hosting constraints involved."
user-invocable: true
---

# Portfolio Deployment Skill

## Purpose
Help prepare and maintain the portfolio for production deployment with a focus on build reliability, safe environment handling, API correctness, metadata integrity, and deployment hygiene.

Always prioritize:
1. Safe handling of secrets and environment variables
2. Production build stability
3. Correct public-server separation for configuration
4. Verified runtime behavior in production-like environments
5. Minimal deployment risk and clear rollback paths

## Use When
Use this skill when asked to:
- Prepare the portfolio for deployment to Vercel, GitHub Pages, Cloudflare, or another host
- Review or update deployment configuration
- Check build scripts, environment variables, domain setup, or redirects
- Validate production API behavior and database connectivity
- Improve caching, metadata, sitemap, or HTTPS-related configuration
- Audit production readiness before publishing changes

## Workspace Context Snapshot (Current Project)
Validate assumptions first, then use this baseline unless changed later:
- Monorepo root with `apps/web` as the primary Next.js app
- Production build is driven through the web app package scripts
- The app already uses Next.js configuration for headers and a sitemap helper
- The frontend reads a public site URL and public API URL from environment variables
- The portfolio includes route-based features and metadata that should behave correctly in production

## Hard Constraints
- Never commit secrets.
- Never expose private environment variables to the browser.
- Clearly distinguish public and server-only environment variables.
- Ensure production builds succeed before deployment.
- Ensure development-only dependencies are not unnecessarily included in production.
- Verify API routes work in production environments.
- Verify database connections where relevant.
- Verify redirects and rewrites.
- Verify metadata and sitemap behavior.
- Preserve existing functionality while hardening deployment behavior.

## Deployment Checklist

### Build Configuration
- Confirm the correct build command and output directory.
- Ensure build scripts are appropriate for the target hosting environment.
- Check whether any production-only env values are required during build.
- Confirm that only necessary dependencies are included in the production dependency set.

### Environment Variables
- Separate public variables from server-only variables.
- Use `NEXT_PUBLIC_*` only for values that are safe to expose to the browser.
- Keep private values such as secrets, tokens, or internal service credentials on the server side only.
- Document any required variables before deployment.

### Production Secrets
- Do not place secrets in source control, build logs, or public config files.
- Use host-provided secret management or environment settings.
- Validate that production secrets are configured correctly before release.

### API Routes and Backend Connectivity
- Confirm API routes resolve correctly in the deployment target.
- Verify that client-side code points to the correct public API origin.
- Ensure server-side code does not leak sensitive configuration to the client.
- Check any backend or database configuration used by the deployed app.

### Domain, HTTPS, and Redirects
- Verify the deployment domain is configured correctly.
- Ensure HTTPS is enabled and redirect behavior is correct.
- Review rewrites and redirects for correctness and unintended loops.
- Confirm metadata and canonical URLs align with the production domain.

### Caching and Metadata
- Review caching headers and static asset behavior where relevant.
- Confirm sitemap generation and metadata route output reflect the production origin.
- Verify robots metadata and canonical metadata do not point to invalid or non-production hosts.

## Required Workflow
Follow this sequence for every deployment task.

### Phase 1: Explain Before Changing
Before making deployment changes, clearly explain:
1. What will change.
2. Which environment variables are required.
3. What deployment risks exist.

### Phase 2: Inspect Existing Configuration
1. Review the relevant build, hosting, and runtime configuration files.
2. Check current environment variable usage and identify public vs server-only values.
3. Review existing API route handling and any database or external service integration points.
4. Check metadata, sitemap, redirects, and domain-related configuration.

### Phase 3: Implement Safely
1. Make the smallest change that addresses the deployment issue.
2. Preserve secure handling of secrets and avoid client-side exposure.
3. Keep the solution compatible with the current stack and hosting target.
4. Avoid unnecessary dependency or configuration churn.

### Phase 4: Verify Production Readiness
If possible, run the production build and validate:
- The build completes successfully.
- The app starts without obvious runtime errors.
- Environment-dependent behavior is correct.
- Metadata, sitemap, API routes, and redirects behave as expected.

### Phase 5: Report Remaining Issues
After implementation, report:
- What changed
- Which environment variables are needed
- Whether the production build succeeded
- Any unresolved deployment risks or follow-up actions

## Decision Points and Branching
- If a value is required by the browser, use a public environment variable and keep it limited to safe, non-sensitive data.
- If a value is sensitive or server-only, keep it out of the client bundle and configure it in the hosting environment.
- If a host requires a specific build output or framework setting, adapt the config to that target without overcomplicating the project.
- If a deployment issue is caused by environment mismatch, document the required variable values rather than hard-coding them.
- If production validation is not possible locally, clearly report the limitation and the remaining steps.

## Completion Criteria
A deployment task is complete only when:
- The intended deployment change is explained clearly before implementation.
- Required environment variables are identified and categorized correctly.
- The production build succeeds or the failure is explicitly documented.
- Secrets remain protected and are not exposed to the browser.
- API routes, metadata, redirects, and relevant production behavior are reviewed.
- Remaining issues are reported transparently.

## Output Format for Each Deployment Task
Use this response structure when applying the skill:
1. Planned Change
2. Required Environment Variables
3. Deployment Risks
4. Implementation Summary
5. Build Verification Results
6. Remaining Issues or Follow-Up

## Example Prompts
- `/portfolio-deployment Review the portfolio for Vercel deployment readiness and identify any missing production environment variables.`
- `/portfolio-deployment Harden the app so API routes and metadata work correctly in production.`
- `/portfolio-deployment Prepare the portfolio for deployment and verify the production build succeeds.`
- `/portfolio-deployment Check the portfolio’s domain, HTTPS, redirects, and sitemap configuration before release.`
