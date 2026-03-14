# Facturation Légale Française — FreelanceOS

## Base légale : Article L441-9 du Code de commerce

## Mentions obligatoires sur chaque facture

| Mention | Exemple | Notes |
|---------|---------|-------|
| Date d'émission | 14/03/2024 | Obligatoire |
| Numéro de facture | 2024-001 | Séquentiel, sans trou, unique |
| Nom + adresse prestataire | Jean Dupont, 12 rue... | |
| SIRET prestataire | 12345678901234 | |
| Numéro TVA intracommunautaire | FR12123456789 | Si assujetti TVA |
| Nom + adresse client | ACME SAS, ... | |
| SIRET client | ... | Recommandé |
| Description des prestations | Développement web... | Précise |
| Quantité | 10 jours | |
| Prix unitaire HT | 800,00 € | |
| Taux de TVA | 20% | |
| Total HT | 8 000,00 € | |
| Montant TVA | 1 600,00 € | |
| Total TTC | 9 600,00 € | |
| Date d'échéance | 13/04/2024 | 30 jours standard |
| Conditions de paiement | Virement bancaire | |
| Pénalités de retard | 3× taux légal | Obligatoire |
| Indemnité forfaitaire | 40 € | Obligatoire depuis 2013 |

## Mention TVA auto-entrepreneur

Si CA < seuil franchise TVA (37 500€ pour services) :
```
TVA non applicable, art. 293B du CGI
```

## Numérotation

- Format recommandé : `YYYY-NNN` (ex: 2024-001)
- **Sans trou** : une facture annulée ne libère pas son numéro
- Jamais supprimée : annulée par un avoir
- Unique par workspace/entreprise

## Pénalités de retard (obligatoires sur la facture)

```
En cas de retard de paiement, des pénalités de retard au taux de 3 fois
le taux d'intérêt légal (actuellement X%) seront appliquées dès le
lendemain de la date d'échéance, ainsi qu'une indemnité forfaitaire pour
frais de recouvrement de 40 €.
```

## Délai de conservation

Les factures doivent être conservées **10 ans**. Ne jamais supprimer une facture,
seulement l'annuler par un avoir.

## Template PDF — checklist avant envoi

- [ ] Numéro séquentiel correct
- [ ] SIRET du prestataire présent
- [ ] Adresse complète du prestataire
- [ ] Adresse complète du client
- [ ] Date d'émission
- [ ] Date d'échéance
- [ ] Description précise des prestations
- [ ] Prix HT par ligne
- [ ] Taux TVA (ou mention art. 293B)
- [ ] Total HT, TVA, TTC
- [ ] Mention pénalités de retard
- [ ] Mention indemnité forfaitaire 40€
