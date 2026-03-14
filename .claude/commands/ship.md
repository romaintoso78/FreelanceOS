# Ship Command

## Checklist avant de déployer

### Tests
```bash
npm run lint        # Zéro erreur ESLint
npm run typecheck   # Zéro erreur TypeScript
npm run test        # Tous les tests passent
npm run build       # Build réussit
```

### Vérifications manuelles
- [ ] Signup/login fonctionne (Clerk)
- [ ] Dashboard charge sans erreur
- [ ] Création facture → PDF généré → Email envoyé
- [ ] Sentry actif et sans erreurs

### Variables d'env Vercel
Vérifier que toutes les variables sont configurées :
- [ ] Clerk keys
- [ ] DATABASE_URL + DIRECT_URL
- [ ] Supabase keys
- [ ] Stripe keys
- [ ] RESEND_API_KEY
- [ ] NEXT_PUBLIC_SENTRY_DSN

### Deploy
```bash
git add -A && git commit -m "feat: description"
git push origin main
```
Vercel déploie automatiquement depuis main.

### Post-deploy
- [ ] Vérifier le build Vercel (pas d'erreur)
- [ ] Tester en prod : signup → onboarding → dashboard
- [ ] Vérifier Sentry : aucune nouvelle erreur
- [ ] Vérifier PostHog : events trackés
