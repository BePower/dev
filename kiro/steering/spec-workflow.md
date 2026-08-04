# Spec Workflow

## The Rule

> Every feature goes through: **spec → implement → update docs → done.**
> Every implementation step updates the spec docs in the same commit.

## Spec Structure

```
.kiro/specs/📋_{number}-{name}/
├── requirements.md   ← WHAT and WHY (user stories, acceptance criteria)
├── design.md         ← HOW (architecture, interfaces, failure modes)
├── tasks.md          ← PHASES (grouped tasks, effort, progress table)
├── roadmap.md        ← NAVIGATION (step-by-step, files, tests, done criteria)
├── testlist.md       ← COVERAGE (every test, mapped to stories, with status)
└── open-points.md    ← UNKNOWNS (pending decisions, assumptions, questions)
```

## When You Complete a Step

**EVERY TIME** you finish a roadmap step, update ALL of these in the same commit:

| File | What to update |
|------|----------------|
| `roadmap.md` | Mark the step `✅` |
| `tasks.md` | Check off tasks (`- [x]`), update progress table |
| `testlist.md` | Mark covered tests (`⬜` → `✅`), update summary counts |
| `design.md` | Update ONLY if implementation diverged from the plan |
| `open-points.md` | Move resolved questions to the Decisions Log |

## Lifecycle Prefixes

| Prefix | Meaning | When to rename |
|--------|---------|---------------|
| `📋_` | Planned | Spec is complete, implementation not started |
| `🚧_` | In Progress | First commit of implementation |
| `⏸️_` | On Hold | Blocked by external dependency or decision |
| `✅_` | Complete | All tasks done, all tests passing |

## Navigating During Implementation

1. Open `roadmap.md` — find the next `⬜` step
2. Read its **What**, **Files**, **Tests**, **Done when**
3. Implement it
4. Run tests
5. Update the docs (see table above)
6. Move to next step

## When Design Changes Mid-Implementation

It happens. When the plan doesn't survive contact with reality:

1. Update `design.md` with what actually changed and why
2. Update `roadmap.md` — add/remove/reorder steps as needed
3. Update `tasks.md` if effort or phases changed
4. Continue from the new plan
