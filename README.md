# UNIPOD Platform

Application web UNIPOD basee sur Node.js et Express avec:
- site public
- espace admin
- bibliotheque
- gestion des menus
- gestion des KPI

## Lancer en local

Prerequis:
- Node.js 18+

Installation:

```bash
npm install
npm start
```

Application:

```text
http://127.0.0.1:3000
```

## Variables d'environnement

Copiez le modele:

```bash
cp .env.example .env
```

Variables principales:
- `NODE_ENV`
- `HOST`
- `PORT`
- `DATA_DIR`
- `ALLOWED_ORIGINS`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## Deploiement Railway

Le projet est prepare pour Railway avec:
- `railway.json` pour la config-as-code
- route de sante `GET /health`
- stockage persistant configurable via `DATA_DIR`

Etapes:

1. Pousser le projet sur GitHub.
2. Creer un projet Railway.
3. Choisir `Deploy from GitHub repo`.
4. Ajouter un Volume monte sur `/app/data`.
5. Renseigner les variables d'environnement de `.env.example`.
6. Definir `ALLOWED_ORIGINS` avec le domaine Railway public.
7. Deployer.

Valeurs recommandees sur Railway:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
DATA_DIR=/app/data
FORCE_SECURE_COOKIE=true
ALLOWED_ORIGINS=https://votre-service.up.railway.app
ADMIN_NAME=Administrateur Principal
ADMIN_EMAIL=admin@votre-domaine.com
ADMIN_PASSWORD=changez-ce-mot-de-passe
```

## Verification apres mise en ligne

Verifier:
- `/health`
- `/`
- `/admin-login`
- `/bibliotheque`
- envoi d'une inscription
- connexion admin
- modification des KPI
- gestion des menus

## Notes importantes

- Le premier administrateur doit etre fourni via `ADMIN_EMAIL` et `ADMIN_PASSWORD`.
- Les donnees metier sont stockees dans `DATA_DIR`.
- Si un ancien volume contient deja `admins.json`, il sera reutilise.
