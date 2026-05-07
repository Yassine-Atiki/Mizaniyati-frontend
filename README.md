# Mizaniyati — Frontend

Interface premium pour la gestion de budget personnel, construite avec React + Vite.

## Démarrage rapide

1. Installer les dépendances.
2. Lancer le serveur de développement.

Le backend est attendu sur `http://localhost:8080/api` (modifiable via `VITE_API_URL`).

## Structure

```
src/
  api/            # appels API centralisés
  components/     # layout + UI réutilisable
  context/        # AuthContext
  hooks/          # hooks métiers (useExpenses, useBudgets...)
  pages/          # pages par route
  utils/          # helpers et formatters
```

## Notes

- Auth via JWT stocké dans `localStorage` (`mizaniyati_token`).
- Chaque page gère ses états de chargement et d'erreur.
- L'interface est responsive (mobile/tablette/desktop).
