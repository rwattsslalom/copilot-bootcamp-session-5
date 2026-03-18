---
description: "Analyze changes, generate conventional commit message, and push to feature branch. Works with any active agent."
tools: [read, execute, todo]
---

You are creating a commit with analyzed changes and pushing to a feature branch.

## Input Parameters

Branch Name: ${input:branch-name:Feature branch name (e.g., feature/add-todo-endpoint)}

## Instructions

### Step 1: Validate Branch Name

If branch name was NOT provided:
- **STOP** and ask the user to provide a branch name
- Explain: "Please provide a feature branch name (e.g., feature/add-validation)"

If branch name WAS provided, proceed.

### Step 2: Analyze Changes

1. Run `git status` to see what files changed
2. Run `git diff` to see specific changes
3. Categorize changes:
   - New features (feat)
   - Bug fixes (fix)
   - Tests (test)
   - Documentation (docs)
   - Refactoring (refactor)
   - Chores (chore)

### Step 3: Generate Conventional Commit Message

Following the Git Workflow from [.github/copilot-instructions.md](../.github/copilot-instructions.md):

Format: `<type>: <description>`

**Types:**
- `feat:` - New features
- `fix:` - Bug fixes
- `test:` - Test updates
- `docs:` - Documentation updates
- `refactor:` - Code restructuring
- `chore:` - Maintenance tasks

**Guidelines:**
- Keep description concise and clear
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Be specific about what changed

**Examples:**
```
feat: add DELETE endpoint for todos
fix: correct todo validation logic
test: add integration tests for todo endpoints
docs: update API documentation
refactor: extract todo service logic
chore: update dependencies
```

### Step 4: Manage Branch

1. Check if branch exists: `git branch --list ${branch-name}`

If branch does NOT exist:
```bash
git checkout -b ${branch-name}
```

If branch DOES exist:
```bash
git checkout ${branch-name}
```

**CRITICAL**: NEVER commit to `main` or any branch other than the user-specified branch name.

### Step 5: Stage, Commit, and Push

Following Git Workflow from [.github/copilot-instructions.md](../.github/copilot-instructions.md):

```bash
# Stage all changes
git add .

# Commit with generated message
git commit -m "<generated-message>"

# Push to the feature branch
git push origin ${branch-name}
```

### Step 6: Verify and Report

1. Confirm the commit was successful
2. Confirm the push completed
3. Show the commit message used
4. Show the branch name pushed to

## Output Format

```
📝 Commit Analysis:
- Changed files: [list of files]
- Change type: [feat/fix/test/docs/refactor/chore]

💬 Generated Commit Message:
<type>: <description>

🌿 Branch Operations:
- Branch: ${branch-name}
- Status: [created new / switched to existing]

✅ Git Operations:
- Staged: [X files]
- Committed: ✓
- Pushed to origin/${branch-name}: ✓

🔗 Next Steps:
- Create a pull request if ready for review
- Continue working on the branch for more changes
- Run tests to verify everything still works
```

## Reference Documents

Git Workflow guidance from [.github/copilot-instructions.md](../.github/copilot-instructions.md):

**Branch strategy:**
- Feature branches: `feature/<descriptive-name>`
- Always stage all changes: `git add .`
- Push to the correct branch: `git push origin <branch-name>`

**Commit format:**
- Use conventional commits with prefixes
- Be descriptive but concise
- Follow imperative mood

## Error Handling

If git operations fail:
1. Show the error message
2. Explain what likely went wrong
3. Suggest corrective action
4. DO NOT proceed with subsequent steps if earlier steps fail

Common issues:
- Conflicts on branch switch → resolve conflicts first
- Nothing to commit → verify changes were made
- Push rejected → may need to pull first

Remember: This prompt works with ANY active agent context - it focuses purely on git operations!
