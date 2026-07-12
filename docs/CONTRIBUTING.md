# Contributing to TransitOps360

## Team Structure

- **Developer A (Frontend Lead)**: Owns `/frontend` directory
- **Developer B (Backend Lead)**: Owns `/backend` directory

## Branch Strategy

```
main (protected)
├── frontend-dev (Developer A working branch)
└── backend-dev (Developer B working branch)
```

## Hourly Workflow

### Developer A (Frontend Lead)

```bash
# Hour 1: Start work
git checkout -b feat/frontend-foundation
# ... implement features
git add .
git commit -m "feat: initial frontend setup with auth UI"
git push origin feat/frontend-foundation

# At hour boundary (1:00)
git checkout main
git pull origin main
git merge feat/frontend-foundation
git push origin main

# Hour 2: New feature branch
git checkout -b feat/crud-ui
# ... continue development
```

### Developer B (Backend Lead)

```bash
# Hour 1: Start work
git checkout -b feat/backend-foundation
# ... implement features
git add .
git commit -m "feat: database schema and auth API"
git push origin feat/backend-foundation

# At hour boundary (1:00)
git checkout main
git pull origin main
git merge feat/backend-foundation
git push origin main

# Hour 2: New feature branch
git checkout -b feat/crud-api
# ... continue development
```

## Commit Convention

Use conventional commits:

```
feat(scope): description
fix(scope): description
docs(scope): description
```

Examples:
```
feat(auth): implement JWT authentication
feat(vehicles): add vehicle CRUD endpoints
fix(dispatch): resolve validation bug
docs(readme): update setup instructions
```

## Integration Points

| Time  | Developer A | Developer B | Integration Test |
|-------|-------------|-------------|------------------|
| 1:00  | Login UI    | Auth API    | Login works      |
| 2:00  | Vehicle UI  | Vehicle API | CRUD works       |
| 3:00  | Trip UI     | Trip API    | Dispatch works   |
| 4:00  | Dashboard   | Analytics   | Metrics display  |
| 5:00  | Polish      | Testing     | Full smoke test  |

## Merge Conflict Resolution

- **Frontend owns**: `/frontend/**`, `package.json`, `vite.config.ts`
- **Backend owns**: `/backend/**`, `requirements.txt`, `alembic/**`
- **Shared**: `README.md` (resolve by combining), `.env.example` (review together)

## Pull Before Merge

Always pull latest main before merging:

```bash
git checkout main
git pull origin main
git merge your-feature-branch
```

## Testing Before Merge

- Backend: `pytest` must pass
- Frontend: `npm run build` must succeed
- Integration: Test the merged feature end-to-end
