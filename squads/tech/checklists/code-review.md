# Code Review Checklist

> Checklist for reviewing code changes

## Metadata
- **Reviewer:**
- **PR/Branch:**
- **Date:**
- **Author:**

---

## 1. Code Quality

### Readability
- [ ] Code is easy to understand
- [ ] Variable/function names are descriptive
- [ ] Complex logic has comments
- [ ] No magic numbers (use constants)
- [ ] Consistent formatting

### Structure
- [ ] Functions are small and focused (single responsibility)
- [ ] No code duplication (DRY)
- [ ] Proper separation of concerns
- [ ] Follows project structure conventions

### Best Practices
- [ ] No console.log in production code
- [ ] No hardcoded credentials/secrets
- [ ] Error handling is appropriate
- [ ] No unused imports/variables
- [ ] No TODO comments without issue reference

---

## 2. TypeScript

- [ ] Types are properly defined (no `any`)
- [ ] Interfaces/types are in correct location
- [ ] Props are typed correctly
- [ ] Return types are explicit
- [ ] Null/undefined handled properly

---

## 3. React/Next.js

### Components
- [ ] Components are functional (not class-based)
- [ ] Hooks used correctly
- [ ] No prop drilling (use context if needed)
- [ ] Keys provided for lists
- [ ] Memoization used where beneficial

### Performance
- [ ] No unnecessary re-renders
- [ ] Heavy computations are memoized
- [ ] Images optimized (next/image)
- [ ] Lazy loading for large components

### Server/Client
- [ ] Correct use of 'use client' / 'use server'
- [ ] Server components don't use client hooks
- [ ] Data fetching in appropriate locations

---

## 4. Styling (Tailwind/Design System)

- [ ] Uses Design System tokens (no hardcoded colors)
- [ ] Responsive design implemented
- [ ] Dark mode supported (if applicable)
- [ ] No inline styles (use Tailwind classes)
- [ ] Follows component styling patterns

---

## 5. Testing

- [ ] Unit tests for new functions
- [ ] Component tests for new components
- [ ] Edge cases covered
- [ ] Tests pass locally
- [ ] Test names are descriptive

---

## 6. Security

- [ ] No sensitive data exposed
- [ ] Input validation present
- [ ] SQL injection prevention (if applicable)
- [ ] XSS prevention
- [ ] CSRF protection (if applicable)
- [ ] Authentication/authorization checked

---

## 7. Documentation

- [ ] README updated (if needed)
- [ ] JSDoc for public functions
- [ ] API documentation updated
- [ ] CHANGELOG updated (if applicable)

---

## 8. Git/PR

- [ ] Commit messages follow convention
- [ ] Branch name follows convention
- [ ] No unrelated changes
- [ ] PR description is clear
- [ ] Breaking changes documented

---

## Review Decision

- [ ] **Approved** - Ready to merge
- [ ] **Request Changes** - Issues must be fixed
- [ ] **Comment** - Non-blocking feedback

### Comments
[Add review comments here]

---

*Checklist v1.0 - Tech Squad*
