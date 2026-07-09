---
name: spec-templates
description: "Create a new feature or bugfix spec from template. Produces requirements.md, design.md, tasks.md, and testlist.md."
---

# Spec Templates

Create structured specs for features or bugfixes.

## Trigger

Invoke with: `new spec`, `new feature spec`, or `new bugfix spec`

## Workflow

1. Ask: feature or bugfix?
2. Ask: short name (kebab-case, e.g. `user-notifications`)
3. Create `.kiro/specs/📋_{name}/` with the appropriate template files
4. Fill in what you know, mark unknowns with `<!-- TODO: -->`

## Feature Spec

Create these files in `.kiro/specs/📋_{name}/`:

### requirements.md
Use the reference: `references/feature-requirements.md`

### design.md
Use the reference: `references/feature-design.md`

### tasks.md
Use the reference: `references/feature-tasks.md`

### testlist.md
Use the reference: `references/feature-testlist.md`

## Bugfix Spec

Create `.kiro/specs/📋_{name}/bugfix.md` using: `references/bugfix.md`

## Lifecycle

Rename the folder prefix as the spec progresses:
- `📋_` → Planned (spec complete, not started)
- `🚧_` → In Progress (active development)
- `⏸️_` → On Hold (blocked)
- `✅_` → Complete (implemented and tested)

## After Each Step

When a task is completed:

1. **tasks.md**: check off the task (`- [x]`), update progress table
2. **testlist.md**: check off tests that are now covered (`⬜` → `✅`)
3. **design.md**: update if the implementation diverged from the design

Include these doc updates in the same commit as the implementation.
