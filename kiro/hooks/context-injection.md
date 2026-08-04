---
name: context-injection
description: Load relevant steering docs when specific file types are edited.
trigger: fileEdited
fileMatch: "**/*.{ts,tsx,json,yml,yaml,md}"
---

# Context Injection

When a file is edited, load the relevant steering doc(s) to ensure consistency:

| File pattern | Load steering |
|---|---|
| `test/**/*.test.ts`, `*.spec.ts` | `testing.md` |
| `src/**/*.ts` | `code-style.md` + `architecture.md` |
| `lib/**/*.ts`, `bin/**/*.ts` | `architecture.md` + `code-style.md` |
| `biome.json`, `lefthook.yml`, `tsdown.config.ts`, `tsconfig.json`, `cdk.json` | `build-tooling.md` |
| `CHANGELOG.md`, `.github/**` | `commit-conventions.md` |
| `.kiro/specs/**` | `spec-workflow.md` |

Rules:
- Only load steering docs that exist in `.kiro/steering/`. Skip silently if not found.
- Load **all** matching docs (a file can match multiple patterns).
- Prefer specificity: `src/handlers/*.ts` matches both `code-style.md` and `architecture.md`.
