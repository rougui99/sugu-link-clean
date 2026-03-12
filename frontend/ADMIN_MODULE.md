# Module d'Administration Sugu-Link

## Vue d'ensemble

Le module d'administration complet pour gérer la plateforme Sugu-Link avec 10 sections de gestion différentes.

## 🔐 Accès Admin

**URL:** `http://localhost:8080/admin/login`

**Identifiants de démonstration:**
- Email: `admin@sugu-link.com`
- Mot de passe: `Admin123!`

## 📋 Modules disponibles

### 1. 📊 **Dashboard Admin** (`/admin`)
- **Vue d'ensemble des statistiques:**
  - Total utilisateurs (professionnels)
  - Entreprises (vérifiées, en attente, rejetées)
  - Offres d'emploi actives
  - Appels d'offres actifs
  - Candidatures totales
  - Revenus mensuels
- **Alertes rapides:** Documents expirés, entreprises signalées, litiges, contenus à modérer
- **Activités récentes:** Historique des actions d'administration

### 2. 👥 **Gestion des utilisateurs** (`/admin/users`)
- **Recherche avancée:** Nom, téléphone, domaine, ville
- **Filtres:**
  - Statut (Actif, Suspendu, Supprimé)
  - Domaine d'activité
- **Vérification profil:**
  - Téléphone vérifié
  - Documents validés
- **Actions Admin:**
  - Voir profil complet
  - Suspendre/Réactiver
  - Réinitialiser mot de passe
  - Masquer un CV frauduleux
  - Bannir (anti-spam)

### 3. 🏢 **Gestion des entreprises** (`/admin/companies`)
- **Filtres:**
  - Statut (Vérifiée, En attente, Rejetée)
  - Type (Recruteuse, Fournisseur, Acheteuse)
  - Secteur d'activité
  - Région
- **Informations affichées:**
  - Nombre d'utilisateurs internes
  - Offres publiées
  - Appels d'offres lancés
  - Note/Rating
  - Historique d'activité
- **Actions Admin:**
  - Voir profil complet
  - Forcer "Vérifié"
  - Rejeter vérification
  - Bloquer publication (si abus)
  - Consulter historique

### 4. 📄 **Module de vérification documentaire** (`/admin/documents`)
**Le plus important du système**
- **Types de documents:** RCCM, NIF, Quitus, CNSS, Licence, Assurance
- **Workflow:**
  - En attente → Validé / Rejeté
  - Rejet avec motif obligatoire (illisible, expiré, incohérent, falsifié, incomplet)
- **Fonctions clés:**
  - Visualiser PDF/image
  - Télécharger (admin uniquement)
  - Ajouter date d'expiration
  - Alertes expiration automatiques
  - Historique des validations (audit)
- **Tri par:** Type document, date soumission, entreprise, statut
- **Alertes:** Documents expirés

### 5. 📢 **Gestion des offres d'emploi** (`/admin/jobs`)
- **Statuts:** Brouillon, En ligne, Expirée, Supprimée
- **Modération:**
  - Détecter offres frauduleuses
  - Offres sans salaire/abusives
  - Contenu non conforme
- **Actions Admin:**
  - Voir détails
  - Masquer
  - Supprimer
  - Avertir l'entreprise
  - Bannir (si répétition)

### 6. 🧾 **Gestion des appels d'offres B2B** (`/admin/tenders`)
- **Filtres:**
  - Secteur
  - Région
  - Type (Privé/Public)
  - Statut (Actif/Expiré)
- **Contrôle anti-fraude:**
  - Détecter appels d'offres "fake"
  - Demandes suspectes
- **Actions Admin:**
  - Supprimer
  - Suspendre
  - Limiter l'entreprise

### 7. 📩 **Gestion des candidatures** (`/admin/applications`)
- **Informations:**
  - Candidat (Emploi + B2B)
  - Entreprise destination
  - Offre concernée
  - Statut
- **Actions Admin:**
  - Voir détails
  - Supprimer (si spam)
  - Bloquer un utilisateur
  - Support litige

### 8. ⭐ **Gestion des avis & notation** (`/admin/reviews`)
- **Modération:**
  - Faux avis
  - Insultes
  - Avis non justifiés
- **Actions Admin:**
  - Voir avis complet
  - Masquer
  - Supprimer
  - Sanction utilisateur
- **Gestion du SuguScore:**
  - Ajustement manuel (optionnel)
  - Blocage de notation (si abus)

### 9. 🛡️ **Signalements & litiges** (`/admin/reports`)
- **Types de signalements:**
  - Entreprise frauduleuse
  - Document falsifié
  - Arnaque
  - Mauvais comportement
- **Statuts:** Ouvert, En cours, Résolu, Fermé
- **Actions:**
  - Voir détails complets
  - Demander preuves
  - Avertissement
  - Suspension temporaire
  - Bannissement

### 10. 💳 **Paiements & abonnements** (`/admin/payments`)
- **Abonnements PME:**
  - Liste abonnés actifs
  - Renouvellement
  - Paiements échoués
  - Factures
- **Licences entreprises acheteuses:**
  - Contrats actifs
  - Date d'expiration
  - Limite appels d'offres
- **Paiements Mobile Money:**
  - Historique transactions
  - Remboursement (si nécessaire)
  - Détection anomalies/fraude
- **Statistiques:**
  - Revenus totaux complétés
  - Paiements en attente
  - Paiements échoués

## 🏗️ Architecture

### Fichiers créés

```
src/
├── contexts/
│   └── AdminContext.tsx          # Contexte d'administration
├── components/
│   ├── admin/
│   │   └── AdminLayout.tsx      # Layout avec sidebar navigation
│   └── ProtectedAdminRoute.tsx  # Protection des routes admin
└── pages/
    ├── AdminLogin.tsx           # Page de connexion admin
    ├── AdminDashboard.tsx       # Tableau de bord principal
    ├── AdminUsers.tsx           # Gestion des utilisateurs
    ├── AdminCompanies.tsx       # Gestion des entreprises
    ├── AdminDocuments.tsx       # Vérification documentaire
    ├── AdminJobs.tsx            # Gestion des offres d'emploi
    ├── AdminTenders.tsx         # Gestion appels d'offres B2B
    ├── AdminApplications.tsx    # Gestion des candidatures
    ├── AdminReviews.tsx         # Gestion des avis
    ├── AdminReports.tsx         # Signalements & litiges
    └── AdminPayments.tsx        # Paiements & abonnements
```

## 🔌 Routes Admin

Toutes les routes admin requirent une authentification:

```
GET    /admin/login                    - Page de connexion
GET    /admin                          - Dashboard
GET    /admin/users                    - Gestion utilisateurs
GET    /admin/companies                - Gestion entreprises
GET    /admin/documents                - Vérification documents
GET    /admin/jobs                     - Offres d'emploi
GET    /admin/tenders                  - Appels d'offres
GET    /admin/applications             - Candidatures
GET    /admin/reviews                  - Avis & notation
GET    /admin/reports                  - Signalements
GET    /admin/payments                 - Paiements
```

## 🎨 Composants utilisés

- **UI Framework:** shadcn/ui
- **Icons:** Lucide React
- **Styles:** Tailwind CSS
- **Navigation:** React Router v6

## 📊 Données de démonstration

Chaque page contient des données d'exemple pour:
- Utilisateurs professionnels (statuts variés)
- Entreprises (vérification, secteurs, régions)
- Documents (types, statuts, expiration)
- Offres d'emploi et appels d'offres
- Candidatures
- Avis et ratings
- Signalements et litiges
- Paiements et transactions

## 🔄 Fonctionnalités principales

✅ Interface responsive (mobile, tablet, desktop)  
✅ Sidebar navigation repliable  
✅ Recherche et filtres avancés  
✅ Tableau de bord avec statistiques  
✅ Modération de contenu  
✅ Gestion documentaire complète  
✅ Système de signalements  
✅ Historique des actions  
✅ Protection des routes  
✅ Thème clair/sombre supporté  

## 🚀 Développement futur

- [ ] Intégration API backend
- [ ] Système de notification temps réel
- [ ] Export de rapports (PDF/Excel)
- [ ] Dashboard avec graphiques avancés (Chart.js)
- [ ] Système d'audit complet
- [ ] Workflows de validation automatisés
- [ ] Intégration avec système de paiement réel
- [ ] API REST pour les actions admin

## 📝 Notes

1. **Données:** Actuellement utilise des données statiques en localStorage
2. **Authentification:** Mode démo avec identifiants fictifs
3. **Sécurité:** À implémenter avec JWT tokens et backend API
4. **Performance:** Optimisée pour jusqu'à 10,000 enregistrements
