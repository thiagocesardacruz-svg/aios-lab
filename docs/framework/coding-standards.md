# Coding Standards

## Padrões de Código - AIOS Lab

### Linguagens
- **TypeScript** para todo código novo
- **Strict mode** habilitado
- **ESLint + Prettier** para formatação

### Convenções de Nomenclatura
- **Arquivos**: kebab-case (`user-profile.tsx`)
- **Componentes**: PascalCase (`UserProfile`)
- **Funções**: camelCase (`getUserProfile`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

### Estrutura de Pastas
```
src/
├── app/          # Next.js App Router
├── components/   # Componentes React
├── lib/          # Utilitários e helpers
├── actions/      # Server Actions
└── types/        # TypeScript types
```

### Commits
- Usar Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`
- Referenciar Story ID: `feat: add login page [Story 3.1]`

### Testes
- Jest + React Testing Library
- Cobertura mínima: 80%
- Testar edge cases

---
*Última atualização: 2026-02-04*
