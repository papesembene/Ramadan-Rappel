# Ramadan Rappel

Application web progressive (PWA) pour le mois de Ramadan au Sénégal, avec :

- Rappels quotidiens (versets, hadiths, dhikr)
- Horaires de prière (méthode égyptienne)
- Notifications push pour les prières
- Adhan automatique à l'heure de la prière
- Compteur Dhikr

## Installation

```bash
npm install
npm run dev
```

## Build et déploiement

### GitHub Pages

```bash
# Créer un repo GitHub et pousser le code
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git push -u origin main

# Déployer
npm run deploy
```

L'application sera accessible à : `https://VOTRE_USERNAME.github.io/VOTRE_REPO/`

### Vercel

1. Importez le repo sur Vercel
2. Build command: `npm run build`
3. Output directory: `dist`

### Netlify

1. Connectez votre repo
2. Build command: `npm run build`
3. Publish directory: `dist`

## Fonctionnalités

- 📅 30 rappels quotidiens
- 🕐 Horaires de prière (Sénégal)
- 🔔 Notifications push
- 🔊 Adhan automatique
- ✋ Compteur Dhikr
- 📱 PWA (installable sur mobile)
- 📴 Mode hors-ligne
