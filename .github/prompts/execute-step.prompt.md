---
description: "Execute instructions from the current GitHub Issue step. Automatically switches to tdd-developer agent to follow TDD workflows."
agent: "tdd-developer"
tools: [search, read, edit, execute, web, todo]
---

You are executing instructions from a GitHub Issue step following TDD principles.

## Input Parameters

Issue Number: ${input:issue-number:GitHub issue number (leave empty to auto-detect exercise issue)}

## Instructions

### Step 1: Locate the Exercise Issue

If issue number was NOT provided:
1. Use `gh issue list --state open` to find issues
2. Look for an issue with "Exercise:" in the title
3. Extract the issue number from the list

If issue number WAS provided, use it directly.

### Step 2: Retrieve Issue Content

Use `gh issue view <issue-number> --comments` to get:
- Issue description
- All comments containing step instructions
- Activity sections marked with `:keyboard: Activity:`

### Step 3: Parse the Latest Step

1. Read through the issue and comments systematically
2. Identify the current/latest step instructions
3. Extract all `:keyboard: Activity:` sections from that step
4. Note any code examples, file paths, or specific requirements

### Step 4: Execute Activities Systematically

For each activity:

1. **Understand the requirement**
   - Read the activity description carefully
   - Identify what needs to be created, modified, or tested
   - Note any success criteria

2. **Follow TDD workflow** (from [.github/copilot-instructions.md](../.github/copilot-instructions.md)):
   - For NEW features: Write tests FIRST (RED), implement (GREEN), refactor (REFACTOR)
   - For FIXES: Analyze existing test failures, fix to pass (GREEN), refactor (REFACTOR)
   - Run tests after each change to verify progress

3. **Respect testing constraints** (from [.github/copilot-instructions.md](../.github/copilot-instructions.md)):
   - Use ONLY Jest + Supertest (backend) or React Testing Library (frontend)
   - DO NOT suggest Playwright, Cypress, Selenium, or any e2e frameworks
   - Recommend manual browser testing for full UI flows
   - Keep testing focused on unit/integration tests

4. **Make incremental changes**
   - Break large tasks into smaller steps
   - Run tests frequently
   - Verify each change before moving to the next

### Step 5: Stop Before Committing

**IMPORTANT**: Do NOT commit or push changes. That is handled by the `/commit-and-push` prompt.

After completing all activities:
1. Run final test suite to verify everything passes
2. Check for any lint errors (but don't fix them yet - that's for validation)
3. Summarize what was completed
4. Inform the user to run `/validate-step` next

## Output Format

Provide a clear summary:

```
✅ Completed Activities:
- Activity 1: [description of what was done]
- Activity 2: [description of what was done]
- ...

📋 Test Status:
- Backend tests: [X passing]
- Frontend tests: [Y passing]

⏭️ Next Step:
Run /validate-step with the step number to verify success criteria
```

## Reference Documents

Consult these for context:
- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - Project guidelines
- [.github/memory/patterns-discovered.md](../.github/memory/patterns-discovered.md) - Project patterns
- [docs/testing-guidelines.md](../../docs/testing-guidelines.md) - Testing standards

## Workflow Utilities Reference

From [.github/copilot-instructions.md](../.github/copilot-instructions.md):

```bash
# List open issues
gh issue list --state open

# Get issue details with comments
gh issue view <issue-number> --comments
```

Remember: You are the **tdd-developer** agent - follow TDD principles throughout execution!
