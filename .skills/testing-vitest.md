# Testing with Vitest — FreelanceOS

## Setup

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./tests/setup.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
})
```

## Structure tests

```
tests/
  unit/          ← tests de logique pure (calculs, formatage)
  integration/   ← tests avec DB (mock ou réelle)
```

## Quoi tester en priorité

1. Calculs fiscaux (URSSAF, seuils TVA)
2. Génération numéros factures (format, séquentialité)
3. Calculs totaux (HT → TVA → TTC)
4. Logique calendrier fiscal

## Template test unitaire

```typescript
import { describe, it, expect } from "vitest"
import { calculateUrssafAE } from "@/lib/fiscal/urssaf"

describe("calculateUrssafAE", () => {
  it("calculates 22% of CA", () => {
    const result = calculateUrssafAE(10_000)
    expect(result.cotisations).toBe(2_200)
  })
})
```

## Commandes

```bash
npm run test         # run once
npm run test:watch   # watch mode
npx vitest --reporter=verbose  # verbose output
```
