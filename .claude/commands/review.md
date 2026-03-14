# Review Command

## Checklist de review pour FreelanceOS

### Sécurité multi-tenant (CRITIQUE)
- [ ] Chaque Server Action appelle `getWorkspaceFromAuth()` en premier
- [ ] Chaque query Prisma inclut `workspaceId: workspace.id`
- [ ] Aucun `workspaceId` ne vient du client (params, body)
- [ ] Les tokens (signature contrat) sont des CUID, pas des IDs prévisibles

### TypeScript
- [ ] Aucun `any`
- [ ] Aucun `as unknown as X`
- [ ] Types stricts sur tous les props de composants
- [ ] Pas de non-null assertion (`!`) sans raison valide

### Validation
- [ ] Tous les inputs de Server Actions validés avec Zod
- [ ] Tous les formulaires utilisent react-hook-form + zodResolver
- [ ] Les données venant d'URL params sont validées

### Mentions légales (Factures)
- [ ] Numéro séquentiel (YYYY-NNN)
- [ ] SIRET du prestataire présent
- [ ] Date d'émission + date d'échéance
- [ ] Pénalités de retard mentionnées
- [ ] Indemnité forfaitaire 40€ mentionnée
- [ ] TVA : taux ou mention art. 293B CGI

### Performance
- [ ] Les listes sont paginées (cursor-based)
- [ ] Pas de N+1 queries (utiliser `include` Prisma ou requêtes séparées avec Promise.all)
- [ ] Server Components pour les pages sans interactivité

### UX
- [ ] Empty state sur les pages de liste
- [ ] Loading skeleton pendant le chargement
- [ ] Messages d'erreur clairs (pas "An error occurred")
- [ ] Confirmation avant actions destructives (ConfirmDialog)
