# DB Migrate Command

## Workflow de migration Prisma

### 1. Modifier le schéma
Éditer `prisma/schema.prisma`

### 2. Créer la migration
```bash
npx prisma migrate dev --name "descriptif-migration"
```
Exemples de noms :
- `add-invoice-model`
- `add-client-fields`
- `add-fiscal-events`

### 3. Vérifier la migration générée
Inspecter le SQL dans `prisma/migrations/*/migration.sql`

### 4. Regénérer le client Prisma
```bash
npx prisma generate
```

### 5. Mettre à jour les types
Si de nouveaux modèles ont été ajoutés, vérifier que les types dans `types/` sont à jour.

## Règles importantes
- **Ne jamais** éditer les fichiers de migration générés
- **Ne jamais** utiliser `prisma db push` en production (seulement en dev pour tester rapidement)
- **Toujours** tester la migration sur une DB de dev avant de merger
- Les migrations sont commitées dans le repo

## En production (Vercel)
La commande de build inclut automatiquement la migration :
```json
"build": "prisma migrate deploy && next build"
```
