# AUTOSOCIAL Improvements

**Type:** React + Vite - Social Media Content Management
**Production Ready:** No (55%)

## Summary
Well-structured React app with good UI components but duplicate code, missing tests, and incomplete Supabase integration.

## Critical Fixes

| Priority | Issue | File | Fix |
|----------|-------|------|-----|
| HIGH | Zero tests | Entire project | Add Vitest + React Testing Library |
| HIGH | Duplicate component | `ContentCreator.tsx:34-163` vs `PlatformPreviewCard.tsx` | Consolidate into one |
| HIGH | Large component | `ContentCreator.tsx` (618 lines) | Split into smaller components |
| HIGH | `as any` assertion | `ContentCreator.tsx:528` | Use proper type narrowing |
| MEDIUM | Unused props | `PlatformPreviewCard.tsx:10,12` | Remove `estimatedEngagement`, `imageUrl` |
| MEDIUM | Missing error handling | `ContentCreator.tsx:212-233` | Add URL validation, user-friendly errors |
| MEDIUM | No ESLint config | Project root | Create `.eslintrc.json` |
| LOW | Magic numbers | Multiple files | Extract to `constants/platformLimits.ts` |

## Specific Tasks

### 1. Consolidate Duplicate Components (2 hours)
```bash
# Delete inline PlatformPreviewCard from ContentCreator.tsx (lines 34-163)
# Update import to use standalone PlatformPreviewCard.tsx
```

### 2. Split Large Component (4 hours)
- Extract `URLExtractor` component
- Extract `PlatformSelector` component
- Extract `ContentPreview` component
- Reduce ContentCreator to <400 lines

### 3. Add Testing Framework (6 hours)
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
# Create vitest.config.ts
# Add test scripts to package.json
```

## Recommended Tooling

```bash
# Testing
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Type safety
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser

# API validation
npm install zod
```
