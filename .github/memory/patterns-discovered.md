# Discovered Code Patterns

Catalog of recurring patterns, conventions, and solutions specific to this project. Add new patterns as you discover them.

## Pattern Template

Use this template when documenting a new pattern:

```markdown
## Pattern: [Pattern Name]

**Context**: When does this pattern apply?

**Problem**: What problem does it solve?

**Solution**: How do we solve it in this project?

**Example**:
\`\`\`javascript
// Code example showing the pattern
\`\`\`

**Related Files**: List files where this pattern is used

**Rationale**: Why this approach over alternatives?

---
```

---

## Pattern: Service Initialization

**Context**: When initializing service classes that manage collections of data (todos, users, etc.)

**Problem**: Should collection properties initialize as `null`, `undefined`, or empty arrays? Inconsistent initialization leads to runtime errors when trying to call array methods.

**Solution**: Always initialize collection properties as empty arrays in the constructor, never `null` or `undefined`.

**Example**:
```javascript
// ✅ CORRECT
class TodoService {
  constructor() {
    this.todos = [];  // Empty array, not null
    this.nextId = 1;
  }
}

// ❌ INCORRECT
class TodoService {
  constructor() {
    this.todos = null;  // Will cause errors on .filter(), .map(), etc.
    this.nextId = 1;
  }
}
```

**Related Files**: 
- `packages/backend/src/app.js` - TodoService initialization
- Any future service classes

**Rationale**: 
- Allows immediate use of array methods without null checks
- Follows "fail fast" principle - services should be ready to use immediately after construction
- Consistent with JavaScript best practices for collection management
- Prevents common `Cannot read property 'filter' of null` errors

---

## Future Patterns

Document your discovered patterns above this line, most recent first.

### Tips for Pattern Documentation

- **Be specific**: Include actual code examples from your project
- **Explain the "why"**: Rationale helps future developers understand the decision
- **Keep it actionable**: Patterns should be immediately applicable
- **Update as needed**: If a pattern changes, update or deprecate it
- **Link to tests**: Reference test files that validate the pattern
