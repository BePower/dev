---
name: spec-templates
description: "Create a new feature or bugfix spec from template. Produces requirements.md, design.md, tasks.md, roadmap.md, and testlist.md."
---

# Spec Templates

Create structured specs for features or bugfixes.

## Trigger

Invoke with: `new spec`, `new feature spec`, or `new bugfix spec`

## Workflow

1. Ask: feature or bugfix?
2. Ask: short name (kebab-case, e.g. `user-notifications`)
3. Ask: sequence number (next available, e.g. `08`)
4. Create `.kiro/specs/📋_{number}-{name}/` with the appropriate template files
5. Fill in what you know, mark unknowns with `<!-- TODO: -->`

## Feature Spec

Create these files in `.kiro/specs/📋_{number}-{name}/`:

### requirements.md
**What** we're building and **why**. User stories, acceptance criteria, risks.
Use the reference: `references/feature-requirements.md`

### design.md
**How** it works technically. Architecture, interfaces, data flow, failure modes.
Use the reference: `references/feature-design.md`

### tasks.md
**Phases** of work with effort estimates and progress tracking.
Use the reference: `references/feature-tasks.md`

### roadmap.md
**Step-by-step navigation** for implementation. Each step is self-contained: what to do, which files to touch, what to test, done criteria. This is what the agent follows during coding.
Use the reference: `references/feature-roadmap.md`

### testlist.md
**Every test** mapped to user stories, with level and status tracking.
Use the reference: `references/feature-testlist.md`

## Bugfix Spec

Create `.kiro/specs/📋_{name}/bugfix.md` using: `references/bugfix.md`

## Lifecycle

Rename the folder prefix as the spec progresses:
- `📋_` → Planned (spec complete, not started)
- `🚧_` → In Progress (active development)
- `⏸️_` → On Hold (blocked)
- `✅_` → Complete (implemented and tested)

## Naming Convention

Folder format: `{emoji}_{number}-{name}`

Examples:
- `📋_08-scan-metadata`
- `🚧_09-scan-aws`
- `✅_01-project-setup`

The number establishes implementation order. The emoji changes as the spec progresses.

## After Each Step

When a roadmap step or task is completed:

1. **roadmap.md**: mark the step `✅`
2. **tasks.md**: check off the task (`- [x]`), update progress table
3. **testlist.md**: check off tests that are now covered (`⬜` → `✅`)
4. **design.md**: update if the implementation diverged from the design

Include these doc updates in the same commit as the implementation.
