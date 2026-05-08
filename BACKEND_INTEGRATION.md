# Mizaniyati — Guide ultra‑détaillé (débutant) pour connecter React ↔ Spring Boot

> Objectif : expliquer **pas à pas** comment brancher ton frontend React (Vite) à ton backend Spring Boot, **même si c’est ta première fois**. Tu vas apprendre où configurer l’URL du backend, comment fonctionne l’auth JWT, comment les données circulent, et comment corriger les erreurs fréquentes.

---

## 1) Comprendre le flux global (en mots simples)

Quand tu cliques sur un bouton dans le frontend :

1. React envoie une requête via **Axios**.
2. Axios appelle ton backend Spring Boot.
3. Spring Boot parle à la base de données.
4. Spring Boot renvoie une réponse JSON.
5. React affiche les données.

Schéma simplifié :

**React** → **Axios** → **API Spring Boot** → **Base de données** → **API** → **React**

Dans ce projet :
- Tous les appels sont dans `src/api/`.
- L’auth est en JWT (token dans le header `Authorization`).
- Si le backend renvoie `401`, on supprime le token et on revient au login.

---

## 2) Étape 0 — Vérifie que le backend tourne

Avant de connecter le frontend, assure‑toi que ton backend Spring Boot est **lancé**.

Tu dois pouvoir ouvrir dans ton navigateur :

```
http://localhost:8080/api
```

Si tu vois une erreur, lance ton backend d’abord.

---

## 3) Étape 1 — Configurer l’URL du backend côté frontend

Le frontend utilise une variable d’environnement pour savoir où est l’API.

### ✅ Crée un fichier `.env.local`

À la racine du projet frontend (même niveau que `package.json`) :

```
VITE_API_URL=http://localhost:8080/api
```

### ✅ Pourquoi `VITE_API_URL` ?

Vite expose les variables qui commencent par `VITE_`. Le fichier Axios lit cette valeur.

Fichier concerné : `src/api/axios.js`

---

## 4) Étape 2 — Comprendre Axios (déjà configuré)

Fichier : `src/api/axios.js`

Il fait 3 choses importantes :

1. **Définit l’URL de base** (`VITE_API_URL`).
2. **Ajoute automatiquement le token JWT** à chaque requête.
3. **Si erreur 401 → retour au login**.

Tu n’as rien à modifier ici si ton backend respecte l’auth JWT.

---

## 5) Étape 3 — Authentification (login)

### ✅ Endpoint attendu

```
POST /api/auth/login
```

### ✅ Exemple de requête (JSON)

```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

### ✅ Exemple de réponse attendue

```json
{
  "token": "<jwt>",
  "user": {
    "id": "1",
    "username": "Yassine",
    "email": "user@example.com",
    "currency": "MAD"
  }
}
```

> Le frontend accepte **token** ou **accessToken** ou **jwt** (il détecte automatiquement). Donc tu peux renvoyer n’importe lequel.

---

## 6) Étape 4 — Récupérer le profil utilisateur

Après connexion, le frontend appelle :

```
GET /api/auth/me
```

Pourquoi ?
- Quand on recharge la page, il faut recharger l’utilisateur depuis le token.

Le backend doit renvoyer l’utilisateur connecté.

---

## 7) Étape 5 — Endpoints métier attendus

Voici **tous les endpoints que le frontend appelle** :

| Domaine | Méthode | Endpoint | Fichier frontend |
|---|---|---|---|
| Dépenses | GET | `/api/expenses` | `src/api/expenseApi.js` |
| Dépenses | POST | `/api/expenses` | `src/api/expenseApi.js` |
| Dépenses | PUT | `/api/expenses/{id}` | `src/api/expenseApi.js` |
| Dépenses | DELETE | `/api/expenses/{id}` | `src/api/expenseApi.js` |
| Revenus | GET | `/api/income` | `src/api/incomeApi.js` |
| Revenus | POST | `/api/income` | `src/api/incomeApi.js` |
| Revenus | PUT | `/api/income/{id}` | `src/api/incomeApi.js` |
| Revenus | DELETE | `/api/income/{id}` | `src/api/incomeApi.js` |
| Budgets | GET | `/api/budgets` | `src/api/budgetApi.js` |
| Budgets | POST | `/api/budgets` | `src/api/budgetApi.js` |
| Budgets | PUT | `/api/budgets/{id}` | `src/api/budgetApi.js` |
| Budgets | DELETE | `/api/budgets/{id}` | `src/api/budgetApi.js` |
| Catégories | GET | `/api/categories` | `src/api/categoryApi.js` |
| Catégories | POST | `/api/categories` | `src/api/categoryApi.js` |
| Catégories | PUT | `/api/categories/{id}` | `src/api/categoryApi.js` |
| Catégories | DELETE | `/api/categories/{id}` | `src/api/categoryApi.js` |
| Stratégies | GET | `/api/budget-strategies` | `src/api/strategyApi.js` |
| Stratégies | POST | `/api/budget-strategies` | `src/api/strategyApi.js` |
| Stratégies | PUT | `/api/budget-strategies/{id}` | `src/api/strategyApi.js` |
| Stratégies | POST | `/api/budget-strategies/{id}/activate` | `src/api/strategyApi.js` |

---

## 8) Étape 6 — Formats de données attendus (contrat JSON)

Le frontend affiche les données **exactement** avec ces clés.

### Category
```json
{
  "id": "cat-1",
  "name": "Maison",
  "colorCode": "#5b4bff",
  "icon": "Home"
}
```

### Expense
```json
{
  "id": "exp-1",
  "amount": 120,
  "date": "2026-05-04",
  "description": "Courses",
  "type": "FIXED",
  "frequency": "MONTHLY",
  "category": { "id": "cat-1", "name": "Maison" }
}
```

### Income
```json
{
  "id": "inc-1",
  "source": "Salaire",
  "amount": 12000,
  "date": "2026-05-01",
  "type": "FIXED",
  "frequency": "MONTHLY",
  "isRecurring": true
}
```

### Budget
```json
{
  "id": "bud-1",
  "limitAmount": 2500,
  "startDate": "2026-05-01",
  "endDate": "2026-05-31",
  "spentAmount": 1200,
  "category": { "id": "cat-1", "name": "Maison" }
}
```

### BudgetStrategy
```json
{
  "id": "str-1",
  "name": "50 / 30 / 20",
  "savingPercentage": 20,
  "needsPercentage": 50,
  "wantsPercentage": 30,
  "isActive": true
}
```

---

## 9) Étape 7 — Activer CORS dans Spring Boot

Si tu vois une erreur du type :
`Access to fetch at ... has been blocked by CORS policy`,
alors ton backend bloque le frontend.

Ajoute ce fichier dans Spring Boot :

```java
@Configuration
public class CorsConfig {
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
          .allowedOrigins("http://localhost:5173")
          .allowedMethods("*")
          .allowedHeaders("*")
          .allowCredentials(true);
      }
    };
  }
}
```

---

## 10) Étape 8 — Sécurité JWT (Spring Security)

Vérifie ces points :

- `/api/auth/login` doit être **public**
- Toutes les autres routes doivent être **protégées**
- Le backend doit lire le token dans `Authorization: Bearer <token>`

---

## 11) Mode démo (quand le backend n’est pas encore branché)

Le frontend a un **mode démo** pour tester l’UI sans backend.

- Token : `demo-token`
- User : `demo@mizaniyati.app`
- Data mock : `src/utils/demoData.js`

Ce mode n’appelle **pas** le backend.

---

## 12) Dépannage (cas les plus fréquents)

| Symptôme | Cause probable | Solution |
|---|---|---|
| Retour immédiat vers `/login` | Token invalide | Vérifier JWT + `/auth/me` |
| Erreur 401 partout | Token absent | Vérifier `Authorization` |
| CORS error | Backend bloque le frontend | Ajouter config CORS |
| Données vides | Backend renvoie `[]` | Vérifier DB / endpoints |

---

## 13) Checklist finale (à cocher)

- [ ] Backend lancé (`http://localhost:8080`)
- [ ] `VITE_API_URL` défini dans `.env.local`
- [ ] CORS activé pour `http://localhost:5173`
- [ ] `/api/auth/login` fonctionne
- [ ] `/api/auth/me` fonctionne
- [ ] JWT accepté par Spring Security
- [ ] Endpoints métier testés (expenses, income, budgets...)

---

## 14) Besoin d’aide supplémentaire ?

Je peux te générer :
- un exemple de **controllers Spring Boot**
- une **collection Postman**
- des **scripts de seed** pour remplir la DB
