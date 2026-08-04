---
name: qa
description: "Diff-aware QA — analyze changes, verify coverage, produce health score. Use after implementation, before shipping."
---

# QA

**Cognitive mode: QA Lead**

Read the diff. Know what changed. Verify it works. Score it.

## Trigger

Invoke with: `qa`, `qa check`, or `test this`

## Pre-flight

Detect context:
- On feature branch → diff-aware mode (diff against default branch)
- No changes → report "nothing to test"
- User provided a path → focused mode on that path

## Workflow

### 1. Identify What Changed

```bash
DEFAULT=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo main)
git diff $DEFAULT...HEAD --stat
git diff $DEFAULT...HEAD --name-only
```

Classify changed files by category. Adapt to the project type:

**General:**
- **Source**: `src/**/*.ts`, `cli/**/*.ts`, `packages/*/src/**`
- **Config**: `biome.json`, `tsconfig.json`, `lefthook.yml`, `vitest.config.ts`
- **Tests**: `test/**/*.test.ts`, `**/*.spec.ts`

**CDK projects:**
- **CDK stacks**: `*Stack.ts`, `*Stage.ts` → check cross-stack dependencies!
- **Lambda handlers**: `src/handlers/**` → check bundling, env vars, permissions

**NestJS projects:**
- **Modules**: `*.module.ts` → check imports, providers, exports
- **Controllers**: `*.controller.ts`, `*-event-controller.ts`, `*-task-controller.ts`
- **Entities**: `*.entity.ts` → check migrations needed

**Monorepo frontend:**
- **Schema**: `schema.graphql` → check codegen re-run
- **Generated**: `**/generated/**` → NEVER edited manually
- **Resolvers**: `resolvers/**` → check schema match

### 2. Verify Test Coverage

For each changed source file:
- Does a corresponding test file exist?
- Do existing tests cover the changed code paths?
- Are edge cases tested (empty input, invalid args, missing files)?

Extra checks per project type:
- **CDK**: cross-stack references valid? `addDependency()` chains correct? ABAC tags?
- **GraphQL**: types regenerated? resolvers match schema? frontends handle changes?
- **NestJS**: module imports correct? dependency injection wired?

### 3. Run Checks

```bash
npm test
npm run lint
```

### 4. Check for Regressions

- Files that import from changed modules
- Shared utilities used across packages
- Cross-package dependencies in monorepos

## Output Format

```markdown
# QA Report: {branch}

## Health Score: {0-100}/100

## Summary
- Changed: {N} files (+{N} -{N} lines)
- Source files: {N} | Tests: {N} | Configs: {N}
- Test coverage: {N}/{N} changed source files have tests
- Status: ✅ Ship-ready / ⚠️ Fix before shipping / ❌ Blocked

## Issues

### [CRITICAL] {title}
- File: `{path}`
- Problem: {description}
- Impact: {what breaks}
- Fix: {suggestion}

### [HIGH] {title}
...

## Verified OK
- ✅ {area}: {what was checked}

## Next Step
- Fix issues → `code review` → ship
```

## Health Score

- Start at 100
- Critical: -25 | High: -15 | Medium: -5 | Low: -2
- Minimum: 0
- Ship-ready: >= 80

## Principles
- Don't fix bugs — report them
- Every finding needs evidence (file, line, error output)
- Changed CDK stacks need extra scrutiny (cross-account, cross-stack refs)
- Schema changes need codegen verification
- After finishing, suggest `code review` if not done yet, or shipping if score >= 80
