# Site Web Boubacar - Grossiste & Détail

Site web moderne pour un grossiste avec gestion de produits et commandes en ligne.

## Fonctionnalités

- 📦 **Catalogue de produits** : Affichage des produits avec prix et descriptions
- 🛒 **Système de commande** : Les clients peuvent passer des commandes directement sur le site
- 👨‍💼 **Page Admin** : Gestion des produits et visualisation des commandes
- 🔐 **Authentification** : Connexion sécurisée pour l'administration
- 📱 **Design responsive** : Interface adaptée à tous les écrans
- 🎨 **Design moderne** : Interface épurée avec couleurs bleu et blanc

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Lancer le serveur de développement :
```bash
npm run dev
```

## Mode Développement (localStorage)

**Par défaut, l'application utilise localStorage** pour stocker les données. Cela permet de tester toutes les fonctionnalités sans configurer Firebase.

### Utilisation avec localStorage :
- ✅ Pas besoin de configurer Firebase
- ✅ Les données sont stockées dans le navigateur (localStorage)
- ✅ Fonctionne immédiatement après `npm install`
- ✅ Parfait pour développer et tester le front-end

### Connexion Admin (mode localStorage) :
- **Email** : N'importe quel email (ex: `admin@test.com`)
- **Mot de passe** : N'importe quel mot de passe
- Les données sont persistées dans le navigateur

### Accès à l'Administration :
- **Raccourci clavier** : `Ctrl + Shift + B` (sur la page d'accueil)
- **URL directe** : `/admin`

## Configuration Firebase (Optionnel - pour la production)

Quand vous êtes prêt à passer en production, vous pouvez configurer Firebase :

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activer Firestore Database
3. Activer Authentication (Email/Password)
4. Copier les clés de configuration dans `src/firebase/config.js`
5. Dans `src/pages/Admin.jsx` et `src/pages/Home.jsx`, changer `USE_LOCAL_STORAGE = false`
6. Décommenter le code Firebase dans ces fichiers

## Configuration Firebase

1. Dans Firebase Console, allez dans **Project Settings** > **General**
2. Copiez les valeurs de configuration et remplacez-les dans `src/firebase/config.js` :
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

3. Créez un utilisateur admin :
   - Allez dans **Authentication** > **Users**
   - Cliquez sur **Add user**
   - Entrez un email et un mot de passe

## Structure des Collections Firestore

### Collection `products`
```javascript
{
  name: string,
  description: string,
  price: number,
  imageUrl: string (optionnel),
  createdAt: timestamp
}
```

### Collection `orders`
```javascript
{
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  quantity: number,
  address: string,
  notes: string,
  productId: string,
  productName: string,
  productPrice: number,
  status: 'pending' | 'processing' | 'completed' | 'cancelled',
  createdAt: timestamp
}
```

## Accès à l'Administration

- **Raccourci clavier** : `Ctrl + Shift + B` (sur la page d'accueil)
- **URL directe** : `/admin`
- **Connexion (mode localStorage)** : N'importe quel email et mot de passe
- **Connexion (mode Firebase)** : Utilisez l'email et le mot de passe créés dans Firebase Authentication

## Utilisation

### Page Publique
- Les visiteurs peuvent voir le catalogue de produits
- Cliquer sur "Commander" pour passer une commande
- Remplir le formulaire avec les informations de contact

### Page Admin
- **Onglet Produits** :
  - Ajouter de nouveaux produits
  - Modifier les produits existants
  - Supprimer des produits
  
- **Onglet Commandes** :
  - Voir toutes les commandes
  - Changer le statut des commandes (En attente, En cours, Terminée, Annulée)

## Personnalisation

### Modifier les informations de contact
Éditez le composant `src/components/Footer.jsx` pour mettre à jour :
- Numéro de téléphone
- Email
- Adresse

### Modifier les couleurs
Les couleurs sont définies dans `src/App.css` via les variables CSS :
- `--primary-blue` : Bleu principal
- `--dark-blue` : Bleu foncé
- `--light-blue` : Bleu clair
- `--white` : Blanc

## Build pour Production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.

## Technologies Utilisées

- React 18
- Vite
- Firebase (Firestore + Authentication)
- React Router
- CSS3
