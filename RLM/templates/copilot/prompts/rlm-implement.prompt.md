# Implement Single Task

Implement the specified task following RLM/TDD methodology.

## Instructions

1. Read the task file at `RLM/tasks/active/{{TASK_ID}}.md`
2. Read the related feature spec
3. Follow TDD: write tests first, then implementation
4. Ensure all acceptance criteria are met
5. Run tests and verify they pass
6. Move task to `RLM/tasks/completed/` when done

## Context Files to Read
- `RLM/tasks/active/{{TASK_ID}}.md`
- `RLM/specs/constitution.md`
- Related feature spec from task file

## TDD Workflow

### 1. RED: Write Failing Test
```typescript
describe('[Component]', () => {
  it('should [expected behavior]', () => {
    // Arrange
    const input = ...;

    // Act
    const result = component.method(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

### 2. GREEN: Write Minimal Code
- Only enough code to make the test pass
- Don't optimize yet
- Don't add extra features

### 3. REFACTOR: Clean Up
- Remove duplication
- Improve naming
- Extract helpers if needed
- Keep tests green throughout

### 4. VERIFY: Run All Tests
```bash
npm test
```

## Code Quality Standards

- Functions < 50 lines
- Single Responsibility Principle
- Descriptive naming (no abbreviations)
- Type safety (strict TypeScript)
- Error handling at boundaries
- No commented-out code

## Completion Checklist

- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] No linter errors
- [ ] Code follows constitution standards
- [ ] Task file moved to `RLM/tasks/completed/`
