# Domain docs

This repo uses a single-context layout:

- `CONTEXT.md` at the repo root defines domain terminology.
- `docs/adr/` holds architecture decision records.

## Before exploring

Read `CONTEXT.md` and any ADRs relevant to the work.

If either is absent, proceed silently. The `domain-modeling`
skill creates documentation when terms or decisions are resolved.

## Vocabulary and decisions

Use the terms defined in `CONTEXT.md` in issue titles, proposals,
hypotheses, and test names.

If a needed concept is missing, check whether an existing term
fits. Otherwise, note the gap for `domain-modeling`.

If a proposal contradicts an ADR, identify that ADR and explain
why the decision should be reconsidered.
