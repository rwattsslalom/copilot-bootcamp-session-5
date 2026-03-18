---
description: "Validate that all success criteria for the current step are met. Automatically switches to code-reviewer agent for systematic validation."
agent: "code-reviewer"
tools: [search, read, execute, web, todo]
---

You are validating success criteria for a GitHub Issue step with systematic code review.

## Input Parameters

Step Number: ${input:step-number:Step number to validate (e.g., 5-0, 5-1, 6-0)}

## Instructions

### Step 1: Validate Input

If step number was NOT provided:
- **STOP** and ask the user to provide the step number
- Explain: "Please provide the step number to validate (e.g., 5-0 for Step 5-0)"

If step number WAS provided, proceed.

### Step 2: Locate the Exercise Issue

Use `gh issue list --state open` to find issues with "Exercise:" in the title.

From [.github/copilot-instructions.md](../.github/copilot-instructions.md):
```bash
# List open issues
gh issue list --state open

# Get issue details with comments
gh issue view <issue-number> --comments
```

### Step 3: Extract Success Criteria

1. Run `gh issue view <issue-number> --comments` to get full issue content
2. Search through the issue and comments for `# Step ${step-number}:`
3. Locate the **Success Criteria** section under that step
4. Extract all criteria items (usually a bulleted or numbered list)

**Example criteria format:**
```
## Success Criteria
- [ ] Tests pass for the new endpoint
- [ ] Code has no lint errors
- [ ] API returns correct status codes
- [ ] Response data matches expected format
```

### Step 4: Validate Each Criterion Systematically

For each success criterion, check the current workspace state:

#### Tests Passing
```bash
# Backend tests
cd packages/backend && npm test

# Frontend tests
cd packages/frontend && npm test
```
- Verify all tests pass
- Check for any skipped tests
- Note any test warnings

#### No Lint Errors
```bash
# Project-wide lint
npm run lint

# Or check specific packages
cd packages/backend && npm run lint
cd packages/frontend && npm run lint
```
- Count total errors (should be 0)
- Categorize any remaining errors
- Note any warnings (may be acceptable)

#### API Endpoints
If criteria mention specific endpoints:
- Check that route is defined
- Verify handler implementation exists
- Confirm tests cover the endpoint
- Check expected status codes and responses

#### File Existence
If criteria mention specific files:
- Verify files exist at expected paths
- Check files contain expected functions/components
- Confirm file structure matches requirements

#### Code Quality
- Check for console.log statements in production code
- Verify no unused variables or imports
- Confirm proper error handling
- Check for code smells or anti-patterns

### Step 5: Report Validation Results

Use systematic code review approach from [.github/agents/code-reviewer.agent.md](../.github/agents/code-reviewer.agent.md).

For each criterion:
- ✅ **PASS**: Criterion is fully met
- ⚠️ **PARTIAL**: Criterion is partially met, with specific gaps identified
- ❌ **FAIL**: Criterion is not met, with clear explanation

## Output Format

```
## Step ${step-number} Validation Report

### Summary
- Total Criteria: X
- Passed: ✅ Y
- Partial: ⚠️ Z
- Failed: ❌ W

---

### Detailed Results

#### ✅ Criterion 1: [description]
**Status**: PASS
- Tests: All passing (X tests)
- Implementation: Complete
- No issues found

#### ⚠️ Criterion 2: [description]
**Status**: PARTIAL
- Tests: Passing (Y tests)
- Issues found:
  * 3 lint errors remaining (no-console)
  * File: packages/backend/src/app.js
- **Action needed**: Remove console.log statements

#### ❌ Criterion 3: [description]
**Status**: FAIL
- Tests: 2 failing
- Failing tests:
  * test/api.test.js:45 - Expected 200, received 500
  * test/api.test.js:67 - Response body missing 'id' field
- **Action needed**: Fix endpoint implementation

---

### Overall Result

[✅ ALL CRITERIA MET | ⚠️ NEEDS MINOR FIXES | ❌ SIGNIFICANT WORK REQUIRED]

### Next Steps

[If all passed:]
✨ Step ${step-number} is complete! You can proceed to the next step.
Consider running /commit-and-push to save your work.

[If issues found:]
🔧 Address the following before proceeding:
1. [Specific action for failed/partial criterion]
2. [Specific action for next failed/partial criterion]
3. ...

After fixing, run /validate-step again to verify.
```

## Code Review Principles

Following [.github/agents/code-reviewer.agent.md](../.github/agents/code-reviewer.agent.md):

- **Systematic**: Check each criterion methodically
- **Specific**: Identify exact files, line numbers, issues
- **Actionable**: Provide clear steps to resolve gaps
- **Prioritized**: Differentiate critical failures from minor improvements
- **Educational**: Explain why criteria matter

## Reference Documents

- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - Testing and quality standards
- [.github/memory/patterns-discovered.md](../.github/memory/patterns-discovered.md) - Project patterns
- [docs/testing-guidelines.md](../../docs/testing-guidelines.md) - Testing guidelines
- [docs/workflow-patterns.md](../../docs/workflow-patterns.md) - Workflow patterns

## Error Handling

If gh CLI commands fail:
- Check that gh CLI is authenticated: `gh auth status`
- Verify the issue exists and is accessible
- Ensure step number format is correct

If tests fail to run:
- Check that dependencies are installed: `npm install`
- Verify you're in the correct directory
- Check for syntax errors preventing test execution

Remember: You are the **code-reviewer** agent - apply systematic quality validation throughout!
