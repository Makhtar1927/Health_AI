# 🏥 Health AI Sénégal — Comptes de Test & Guide des Espaces

Ce document regroupe l'ensemble des accès, URLs de production et comptes de test configurés pour chacun des 4 espaces de la plateforme **Health AI Sénégal**.

Tous ces comptes sont initialisés à l'état vierge (aucun historique médical, aucun faux rendez-vous pré-rempli) afin de permettre des tests réels de bout en bout.

---

## 📋 Tableau Récapitulatif des Accès

| Espace | URL Live (Production) | Identifiant (Email) | Mot de Passe | Rôle & Périmètre |
| :--- | :--- | :--- | :--- | :--- |
| **Patient** | [healthai-sn.vercel.app](https://healthai-sn.vercel.app/) | `test.patient@sunusante.sn` | `Patient2026!` | **Patient** *(Profil vierge sans consultation ni ordonnance)* |
| **Personnel** | [healthaipro-sn.vercel.app](https://healthaipro-sn.vercel.app/) | `medecin@sunusante.sn` | `Medecin2026!` | **Médecin Généraliste** *(Consultations, télémédecine, ordonnances)* |
| **Personnel** | [healthaipro-sn.vercel.app](https://healthaipro-sn.vercel.app/) | `infirmier@sunusante.sn` | `Infirmier2026!` | **Infirmier(ère)** *(Constantes vitales, soins, triage)* |
| **Personnel** | [healthaipro-sn.vercel.app](https://healthaipro-sn.vercel.app/) | `radiologue@sunusante.sn` | `Radio2026!` | **Radiologue** *(Imagerie médicale, analyses IA, comptes-rendus)* |
| **Personnel** | [healthaipro-sn.vercel.app](https://healthaipro-sn.vercel.app/) | `accueil@sunusante.sn` | `Accueil2026!` | **Accueil / Guichet** *(Enregistrement, orientation, file d'attente)* |
| **Personnel** | [healthaipro-sn.vercel.app](https://healthaipro-sn.vercel.app/) | `caisse@sunusante.sn` | `Caisse2026!` | **Agent de Caisse** *(Facturation, encaissement, tickets de consultation)* |
| **Personnel** | [healthaipro-sn.vercel.app](https://healthaipro-sn.vercel.app/) | `pharmacien@sunusante.sn` | `Pharmacien2026!` | **Pharmacien Officinal** *(Dispensation, scan QR ordonnances, stock)* |
| **Admin** | [healthaiadmin-sn.vercel.app](https://healthaiadmin-sn.vercel.app/) | `admin.hopital@sunusante.sn` | `Hopital2026!` | **Administrateur Hôpital** *(Gestion RH médicale, services et tarifs)* |
| **Admin** | [healthaiadmin-sn.vercel.app](https://healthaiadmin-sn.vercel.app/) | `admin.pharmacie@sunusante.sn` | `Pharmacie2026!` | **Administrateur Pharmacie** *(Gestion de l'officine et des préparateurs)* |
| **Superadmin** | [healthaisuperadmin-sn.vercel.app](https://healthaisuperadmin-sn.vercel.app/) | `superadmin@sunusante.sn` | `SuperAdmin2026!` | **Super Administrateur** *(Supervision globale, activation et audit plateforme)* |

---

## 🔍 Détails par Espace

### 1. 🧑‍⚕️ Espace Patient
- **URL** : [https://healthai-sn.vercel.app](https://healthai-sn.vercel.app/)
- **Fonctionnalités disponibles** :
  - Inscription autonome avec confirmation par email obligatoire.
  - Prise de rendez-vous en ligne dans les structures de santé partenaires.
  - Dossier médical personnel, carnet de santé numérique et ordonnances cryptées.
- **Compte de test pré-activé** :
  - Email : `test.patient@sunusante.sn`
  - Mot de passe : `Patient2026!`
  - *Note : Ce compte est déjà confirmé pour tester immédiatement la connexion.*

---

### 2. 🩺 Espace Personnel Médical & Soignant (Pro)
- **URL** : [https://healthaipro-sn.vercel.app](https://healthaipro-sn.vercel.app/)
- **Rôles disponibles** :
  - **Médecin** : `medecin@sunusante.sn` / `Medecin2026!`
  - **Infirmier** : `infirmier@sunusante.sn` / `Infirmier2026!`
  - **Radiologue** : `radiologue@sunusante.sn` / `Radio2026!`
  - **Accueil / Réception** : `accueil@sunusante.sn` / `Accueil2026!`
  - **Caisse / Facturation** : `caisse@sunusante.sn` / `Caisse2026!`
  - **Pharmacien Hospitalier / Dépôt** : `pharmacien@sunusante.sn` / `Pharmacien2026!`

---

### 3. 🏢 Espace Administrateur d'Établissement
- **URL** : [https://healthaiadmin-sn.vercel.app](https://healthaiadmin-sn.vercel.app/)
- **Profils d'accès** :
  - **Directeur / Admin Hôpital** : `admin.hopital@sunusante.sn` / `Hopital2026!`
  - **Pharmacien Titulaire / Admin Officine** : `admin.pharmacie@sunusante.sn` / `Pharmacie2026!`
- **Fonctionnalités** :
  - Création et affectation des comptes agents et soignants.
  - Configuration des spécialités, des créneaux et des tarifs de consultation.

---

### 4. 🛡️ Espace Superadministrateur
- **URL** : [https://healthaisuperadmin-sn.vercel.app](https://healthaisuperadmin-sn.vercel.app/)
- **Accès Principal** :
  - Email : `superadmin@sunusante.sn`
  - Mot de passe : `SuperAdmin2026!`
- **Fonctionnalités** :
  - Supervision globale de toutes les structures connectées au Sénégal.
  - Audit de sécurité, suspension de comptes et gestion des affiliations.

---

## ⚙️ Infrastructure & Services Connectés

- **API Backend Node.js / Express** : [https://health-ai-backend-jhie.onrender.com](https://health-ai-backend-jhie.onrender.com)
  - Endpoint de santé : `/health`
  - Authentification centralisée : `/api/auth/login`, `/api/auth/register`, `/api/auth/confirm-email`
- **Base de données & Auth Cloud** : Supabase (`snysddnktlgavloosmvi.supabase.co`)
- **Service SMTP Transactionnel** : Resend (`smtp.resend.com:465`) avec expéditeur `onboarding@resend.dev`
