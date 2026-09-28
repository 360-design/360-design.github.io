# Issue tracker: GitHub

Issues and specs live in GitHub Issues for
`360-design/360-design.github.io`. Use the `gh` CLI from this repo.

## Operations

- Create: `gh issue create --title "..." --body-file <file>`
- Read: `gh issue view <number> --comments`
- Read structured details: `gh issue view <number> --json number,title,body,labels,comments`
- List: `gh issue list --state open --json number,title,body,labels,comments`
- Comment: `gh issue comment <number> --body-file <file>`
- Add a label: `gh issue edit <number> --add-label "<label>"`
- Remove a label: `gh issue edit <number> --remove-label "<label>"`
- Close: `gh issue close <number>`

Write multiline bodies to a temporary file and pass it with
`--body-file`. Use the labels in `docs/agents/triage-labels.md`.

When a skill says "publish to the issue tracker", create a GitHub
issue. When it says "fetch the relevant ticket", read the issue
and its comments.

## Pull requests as a triage surface

**PRs as a request surface: no.**
