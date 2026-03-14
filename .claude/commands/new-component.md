# New Component Command

## Convention de nommage
- PascalCase pour les fichiers composants
- `index.ts` pour exporter depuis un dossier

## Template Client Component
```typescript
"use client"

import { type FC } from "react"
import { cn } from "@/lib/utils"

interface ComponentNameProps {
  className?: string
  // props...
}

export const ComponentName: FC<ComponentNameProps> = ({ className, ...props }) => {
  return (
    <div className={cn("", className)}>
      {/* content */}
    </div>
  )
}
```

## Template Server Component
```typescript
import { type FC } from "react"

interface ComponentNameProps {
  // props...
}

export const ComponentName: FC<ComponentNameProps> = async ({ ...props }) => {
  // Fetch data ici si besoin
  return (
    <div>
      {/* content */}
    </div>
  )
}
```

## Checklist
- [ ] Props typées avec interface
- [ ] `cn()` pour les classes conditionnelles
- [ ] Exporté depuis `index.ts` du dossier
- [ ] `"use client"` uniquement si nécessaire
- [ ] Variantes avec `class-variance-authority` si le composant a plusieurs états visuels
