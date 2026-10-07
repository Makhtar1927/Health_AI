# 🏥 Sunu Santé — Plateforme Médicale Intelligente

**Sunu Santé** est un écosystème de santé numérique moderne, sécurisé et adapté au contexte ouest-africain (Sénégal). La plateforme interconnecte les patients, les professionnels de santé, les centres hospitaliers, les pharmacies et les régulateurs au sein d'une architecture multi-applications unifiée.

---

## 🏛️ Architecture du Projet

Le projet est structuré sous forme de Monorepo d'applications autonomes :

| Application | Port par défaut | Description & Rôle |
|---|---|---|
| **`patient`** | `http://localhost:3000` | Portail grand public & Espace Patient (Dossier médical, RDV, SOS Urgences, Ordonnances QR). |
| **`admin`** | `http://localhost:3001` | Administration des établissements de santé (Hôpitaux, Cliniques, Pharmacies). |
| **`superadmin`** | `http://localhost:3002` | Gouvernance globale, monitoring de la plateforme, gestion des affiliations. |
| **`personnel`** | `http://localhost:3003` | Portail des praticiens (Médecin, Infirmier, Radiologue, Pharmacien, Accueil, Caisse). |
| **`backend`** | `http://localhost:5000` | API REST principale (Express, TypeScript, IA Gemini 1.5, Cloudinary, Auth RBAC). |

---

## 🚀 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- `npm` ou `pnpm`

### 1. Variables d'environnement
Chaque application dispose d'un modèle `.env.example`. Copiez-le vers `.env` (pour le backend) ou `.env.local` (pour les frontends) :

```bash
# Backend
cd backend && cp .env.example .env

# Frontends (patient, admin, superadmin, personnel)
cd ../patient && cp .env.example .env.local
cd ../admin && cp .env.example .env.local
cd ../superadmin && cp .env.example .env.local
cd ../personnel && cp .env.example .env.local
```

### 2. Installation des dépendances
Dans chaque dossier d'application :
```bash
npm install
```

### 3. Lancement en mode développement
Dans des terminaux séparés :
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Patient (Port 3000)
cd patient && npm run dev

# Terminal 3 - Admin Hôpital / Pharmacie (Port 3001)
cd admin && npm run dev

# Terminal 4 - Superadmin (Port 3002)
cd superadmin && npm run dev

# Terminal 5 - Personnel Soignant (Port 3003)
cd personnel && npm run dev
```

---

## 🛡️ Sécurité & Confidentialité
- **Chiffrement & Anonymisation** des données sensibles de santé.
- **Support des protocoles locaux** : Prise en charge des mutuelles et assurances (IPM, CMU) et paiement mobile (Wave, Orange Money).
- **Protection des clés** : Aucun secret (`.env`) ni mot de passe en dur n'est versionné sur Git.

---

## 📄 Licence
Propriété exclusive de **Sunu Santé** - Tous droits réservés.
