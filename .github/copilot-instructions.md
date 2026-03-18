# TODO Application - Development Guidelines

## Project Context

Full-stack TODO application with React frontend and Express backend. Development follows an iterative, feedback-driven approach with emphasis on systematic testing and incremental improvements.

**Current Phase**: Backend stabilization and frontend feature completion

## Documentation References

Consult these files for detailed guidance:

- [docs/project-overview.md](../docs/project-overview.md) - Architecture, tech stack, and structure
- [docs/testing-guidelines.md](../docs/testing-guidelines.md) - Test patterns and standards
- [docs/workflow-patterns.md](../docs/workflow-patterns.md) - Development workflow guidance

## Development Principles

1. **Test-Driven Development**: Follow the Red-Green-Refactor cycle
2. **Incremental Changes**: Make small, testable modifications
3. **Systematic Debugging**: Use test failures as guides for fixes
4. **Validation Before Commit**: Ensure all tests pass and no lint errors exist

## Testing Scope

This project uses **unit tests and integration tests ONLY**:

- **Backend**: Jest + Supertest for API testing
- **Frontend**: React Testing Library for component unit/integration tests
- **Manual browser testing**: For full UI verification

**DO NOT suggest or implement**:
- e2e test frameworks (Playwright, Cypress, Selenium)
- Browser automation tools
- **Reason**: Keep the lab focused on unit/integration tests without e2e complexity

### Testing Approach by Context

- **Backend API changes**: Write Jest tests FIRST, then implement (RED-GREEN-REFACTOR)
- **Frontend component features**: Write React Testing Library tests FIRST for component behavior, then implement (RED-GREEN-REFACTOR). Follow with manual browser testing for full UI flows.

This is true TDD: **Test first, then code to pass the test**

## Workflow Patterns

Follow these development workflows:

1. **TDD Workflow**: Write/fix tests → Run → Fail → Implement → Pass → Refactor
2. **Code Quality Workflow**: Run lint → Categorize issues → Fix systematically → Re-validate
3. **Integration Workflow**: Identify issue → Debug → Test → Fix → Verify end-to-end

## Agent Usage

Use specialized agents for specific tasks:

- **tdd-developer**: For test-related work and Red-Green-Refactor cycles
- **code-reviewer**: For addressing lint errors and code quality improvements

## Memory System

This project uses a two-tier memory architecture to maintain development context:

- **Persistent Memory**: This file (`.github/copilot-instructions.md`) contains foundational principles and workflows that rarely change
- **Working Memory**: `.github/memory/` directory contains accumulated discoveries, patterns, and session notes from actual development work

### Memory Files

- **Active Session Notes**: `.github/memory/scratch/working-notes.md` - Scratchpad for current work (NOT committed to git)
- **Historical Sessions**: `.github/memory/session-notes.md` - Summaries of completed sessions (committed)
- **Code Patterns**: `.github/memory/patterns-discovered.md` - Reusable solutions to project-specific problems (committed)

### Workflow Integration

During active development:
1. Take notes in `.github/memory/scratch/working-notes.md` as you work
2. Document discoveries and decision rationale in real-time
3. At end of session, summarize key findings into `.github/memory/session-notes.md`
4. Extract recurring patterns into `.github/memory/patterns-discovered.md`

When providing context-aware suggestions, reference these memory files to understand project history and established patterns. See `.github/memory/README.md` for complete usage guide.

## Workflow Utilities

GitHub CLI commands are available for workflow automation:

```bash
# List open issues
gh issue list --state open

# Get issue details
gh issue view <issue-number>

# Get issue with comments
gh issue view <issue-number> --comments
```

**Exercise Management**:
- The main exercise issue will have "Exercise:" in the title
- Steps are posted as comments on the main issue
- Use these commands when `/execute-step` or `/validate-step` prompts are invoked

## Git Workflow

Follow conventional commit format and branching strategies:

- **Commit format**: Use conventional commits with prefixes:
  - `feat:` - New features
  - `fix:` - Bug fixes
  - `chore:` - Maintenance tasks
  - `docs:` - Documentation updates
  - `refactor:` - Code restructuring
  - `test:` - Test updates

- **Branch strategy**:
  - Feature branches: `feature/<descriptive-name>`
  - Always stage all changes before committing: `git add .`
  - Push to the correct branch: `git push origin <branch-name>`
