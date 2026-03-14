# shadcn/ui — FreelanceOS

## Setup initial (à faire manuellement)

```bash
npx shadcn@latest init
# Choisir : New York style, slate color, CSS variables: yes

npx shadcn@latest add button input label textarea select checkbox badge card table dialog dropdown-menu avatar separator toast form sheet tabs calendar progress skeleton
```

## Utilisation

```typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
```

## Composants disponibles dans le projet

- `Button` — variantes: default, destructive, outline, ghost, link
- `Input` — champ texte
- `Label` — label accessible
- `Textarea` — zone de texte
- `Select` — sélecteur
- `Checkbox` — case à cocher
- `Badge` — badge coloré
- `Card` — carte avec CardHeader, CardContent, CardFooter
- `Table` — tableau avec TableHeader, TableBody, TableRow, TableCell
- `Dialog` — modale
- `DropdownMenu` — menu déroulant
- `Avatar` — avatar utilisateur
- `Separator` — séparateur horizontal/vertical
- `Toast` — notifications toast
- `Form` — wrapper pour react-hook-form
- `Sheet` — panel latéral (mobile nav)
- `Tabs` — onglets
- `Calendar` — calendrier (pour fiscal)
- `Progress` — barre de progression
- `Skeleton` — placeholder de chargement

## Personnalisation

Les composants sont copiés dans `components/ui/` et peuvent être modifiés directement.
Ne pas modifier les fichiers originaux de shadcn — les composants sont dans le projet.

## cn() utility

```typescript
import { cn } from "@/lib/utils"

<div className={cn("base-class", condition && "conditional-class", className)} />
```
