# Development Memory System

## Purpose

This memory system tracks patterns, decisions, and lessons learned during development. It helps AI assistants provide context-aware suggestions based on your project's actual experiences, and helps developers maintain continuity across sessions.

## Memory Architecture

### Persistent Memory vs Working Memory

- **Persistent Memory** (`.github/copilot-instructions.md`): Foundational principles, workflows, and standards that rarely change. Always active for all AI interactions.
- **Working Memory** (`.github/memory/`): Accumulated discoveries, patterns, and session notes from actual development work. Referenced as needed.

### Directory Structure

```
.github/memory/
├── README.md                    # This file - explains the system
├── session-notes.md             # Historical session summaries (committed)
├── patterns-discovered.md       # Accumulated code patterns (committed)
└── scratch/
    ├── .gitignore              # Ignores all scratch files
    └── working-notes.md        # Active session notes (NOT committed)
```

## File Purposes

### session-notes.md (Committed)

**What it is**: Historical record of completed development sessions

**When to update**: At the end of each development session, after completing a feature, fixing bugs, or resolving issues

**Content**: Summarized findings, decisions made, outcomes achieved

**Why it's committed**: Creates a project timeline that new team members (or AI assistants) can review to understand project evolution

### patterns-discovered.md (Committed)

**What it is**: Catalog of recurring code patterns, conventions, and design decisions specific to this project

**When to update**: When you discover a pattern that should be consistently applied across the codebase

**Content**: Reusable solutions to common problems in your specific codebase

**Why it's committed**: Ensures consistency and helps onboard new developers or AI assistants to project-specific conventions

### scratch/working-notes.md (NOT Committed)

**What it is**: Live scratchpad for your current active work

**When to update**: Throughout your development session - as you make discoveries, try approaches, hit blockers

**Content**: Raw notes, experiments, thoughts, temporary decisions

**Why it's NOT committed**: Keeps your git history clean. At session end, distill the important findings into session-notes.md

## Workflow Integration

### TDD Workflow

1. **Start**: Update `scratch/working-notes.md` with current task and test approach
2. **Red Phase**: Note test failures and what they reveal
3. **Green Phase**: Document the implementation approach that passes tests
4. **Refactor Phase**: Record any patterns discovered during cleanup
5. **End Session**: Move key patterns to `patterns-discovered.md`, summarize session in `session-notes.md`

### Code Quality Workflow

1. **Lint Issues**: Document error categories and systematic fixes in `scratch/working-notes.md`
2. **Patterns Found**: Add consistent fix patterns to `patterns-discovered.md`
3. **Lessons Learned**: Summarize what types of errors were most common in `session-notes.md`

### Debugging Workflow

1. **Issue Identified**: Document symptoms in `scratch/working-notes.md`
2. **Investigation**: Track hypotheses and findings
3. **Root Cause**: Once found, document in session notes
4. **Prevention Pattern**: Add to `patterns-discovered.md` if it represents a recurring issue

## How AI Uses This System

When you ask AI for help:

1. **AI automatically reads**: `.github/copilot-instructions.md` (persistent memory)
2. **AI can reference**: Memory files when making suggestions
3. **AI learns from patterns**: Uses `patterns-discovered.md` to suggest consistent solutions
4. **AI understands context**: Reviews `session-notes.md` to understand project history

### Example Interactions

**Without memory system**:
- User: "The todo service is returning null"
- AI: Generic suggestion about checking API responses

**With memory system**:
- User: "The todo service is returning null"
- AI: *Reviews patterns-discovered.md, sees "Service Initialization" pattern*
- AI: "Based on the project pattern, services should initialize with empty arrays instead of null. Check if the TodoService constructor follows this pattern."

## Maintenance Guidelines

### Daily Practice

- Keep `scratch/working-notes.md` updated during active work
- It's okay to be messy - this is your scratchpad

### End of Session

1. Review `scratch/working-notes.md`
2. Extract important findings → add to `session-notes.md`
3. Extract reusable patterns → add to `patterns-discovered.md`
4. Clear or archive `scratch/working-notes.md` for next session

### Weekly/Monthly Review

- Review `patterns-discovered.md` - are patterns still relevant?
- Consider promoting frequently-referenced patterns to `.github/copilot-instructions.md`
- Archive old session notes if the file gets too large

## Benefits

1. **Continuity**: Pick up where you left off, even after breaks
2. **Consistency**: Apply the same solutions to the same problems
3. **Knowledge Transfer**: New team members learn from actual project experience
4. **AI Context**: Give AI assistants project-specific knowledge
5. **Documentation**: Maintain living documentation without effort

## Getting Started

1. Start a new development session
2. Open `scratch/working-notes.md` and note your current task
3. As you work, jot down findings and decisions
4. When you discover a pattern, add it to `patterns-discovered.md`
5. At session end, summarize key points in `session-notes.md`
6. Reference these notes when asking AI for help: "Check the memory system for context"
