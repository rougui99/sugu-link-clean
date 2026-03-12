# 🚀 Guide de démarrage - Module Admin Sugu-Link

## ⚡ Démarrage rapide

### 1. Lancer l'application
```bash
npm run dev
```

L'application démarre sur `http://localhost:8080`

### 2. Accéder au module admin
Cliquez sur l'URL ou allez directement à:
```
http://localhost:8080/admin/login
```

### 3. Se connecter
**Email:** `admin@sugu-link.com`  
**Mot de passe:** `Admin123!`

### 4. Explorez les 10 sections!

---

## 📍 Navigation dans le module admin

### Sidebar menu
Le menu latéral vous permet d'accéder à:

```
📊 Dashboard      → Statistiques et alertes rapides
👥 Utilisateurs    → Gestion des professionnels
🏢 Entreprises     → Gestion des entreprises
📄 Documents       → Vérification documentaire
📢 Offres d'emploi → Modération offres
🧾 Appels d'offres → Gestion B2B
📩 Candidatures    → Suivi des candidatures
⭐ Avis & Notation  → Modération des avis
🛡️ Signalements   → Litiges et signalements
💳 Paiements       → Gestion revenus
```

### Repli/Expansion du menu
Cliquez sur l'icône ☰ (hamburger) en haut du menu pour le replier/déplier

---

## 🎯 Cas d'usage principaux

### Vérifier une entreprise
1. Allez dans **🏢 Entreprises**
2. Cherchez l'entreprise à vérifier (statut: "En attente")
3. Cliquez sur ✓ (CheckCircle icon)
4. La statut devient "Vérifiée"

### Modérer une offre d'emploi frauduleuse
1. Allez dans **📢 Offres d'emploi**
2. Trouvez l'offre suspecte
3. Cliquez sur 🛑 (Ban icon) pour avertir
4. Ou 🗑️ (Trash) pour supprimer

### Valider un document
1. Allez dans **📄 Documents**
2. Cliquez sur un document "En attente"
3. Visualisez avec 👁️ (Eye icon)
4. Cliquez sur ✓ (CheckCircle) pour valider
5. Ou ✗ (XCircle) pour rejeter

### Gérer un signalement
1. Allez dans **🛡️ Signalements**
2. Ouvrez un signalement "Ouvert"
3. Examinez les détails
4. Cliquez sur "Résoudre" quand termité

### Suivre les revenus
1. Allez dans **💳 Paiements**
2. Consultez les statistiques:
   - Revenus complétés
   - Paiements en attente
   - Paiements échoués
3. Téléchargez les factures avec 📥

---

## 🔍 Utiliser les filtres

Chaque page dispose de filtres puissants:

### Exemple: Filtrer par utilisateurs actifs
```
1. Allez dans 👥 Utilisateurs
2. Sélectionnez "Actif" dans le dropdown Statut
3. Entrez un domaine (ex: "IT")
4. Les résultats se mettent à jour en temps réel
```

### Exemple: Trouver une entreprise
```
1. Allez dans 🏢 Entreprises
2. Tapez le nom dans "Rechercher"
3. Sélectionnez le statut (Vérifiée, En attente, etc.)
4. Filtrez par type (Recruteuse, Fournisseur, etc.)
```

### Exemple: Vérifier les documents à expiration
```
1. Allez dans 📄 Documents
2. Le système montre automatiquement:
   - Documents expirés (badge rouge)
   - Documents expirés bientôt (countdown: "12j")
3. Cliquez sur le document pour voir les détails
```

---

## 📊 Comprendre le Dashboard

### KPIs (Key Performance Indicators)

**Première ligne:**
- 👥 Utilisateurs (Professionnels) - Total avec variation mensuelle
- 🏢 Entreprises vérifiées - Sur le total
- 📢 Offres d'emploi actives - Avec variation
- 💰 Revenus mensuels - Avec % de variation

**Deuxième ligne:**
- 🧾 Appels d'offres actifs
- 📈 Candidatures totales
- ⏰ Entreprises en attente de vérification

### Alertes rapides
Sections urgentes à gérer:
- 🔴 Documents expirés (12 actions)
- 🔴 Entreprises signalées (5 actions)
- 🟡 Litiges ouverts (8 actions)
- 🟡 Contenus à modérer (23 actions)

Cliquez sur une alerte pour aller directement à la gestion correspondante.

### Activités récentes
Historique des 5 dernières actions d'administration:
- Qui a agit (email admin)
- Quoi (action effectuée)
- Quand (heure relative: "Il y a 2h")

---

## 🛠️ Actions courantes

### Sur chaque ligne/item:
- 👁️ **Eye icon** - Voir les détails complets
- ✓ **CheckCircle** - Valider/Approuver
- ✗ **XCircle** - Rejeter/Refuser
- 🗑️ **Trash** - Supprimer
- 🚫 **Ban** - Interdire/Suspendre
- 🔄 **Rotate** - Réactiver
- 📥 **Download** - Télécharger

---

## 📱 Responsive Design

Le module admin est entièrement responsive:

### Desktop (1200px+)
- Sidebar toujours visible
- Tableaux complets avec toutes colonnes
- Grid layouts optimisés

### Tablet (768px - 1200px)
- Sidebar peut être repliée
- Tableaux en grille
- Filtres en colonne

### Mobile (< 768px)
- Sidebar masquée par défaut
- Tableaux horizontaux
- Filtres empilés verticalement

---

## 🔐 Sécurité

### Points de protection
- ✅ Routes admin protégées (`/admin/*`)
- ✅ Redirection automatique vers `/admin/login`
- ✅ Vérification d'authentification sur chaque page
- ✅ Contexte admin pour gestion d'état

### Déconnexion
Cliquez sur **"Déconnexion"** en bas du sidebar pour vous déconnecter.

---

## 💡 Tips & Tricks

1. **Recherche rapide**: Commencez à taper immédiatement, les résultats se mettent à jour en temps réel

2. **Tableaux**: 
   - Survolez une ligne pour voir le surlignage
   - Les boutons d'action apparaissent à droite
   - Cliquez sur Eye pour détails complets

3. **Statuts**: 
   - 🟢 Vert = Actif/Validé
   - 🟡 Orange = En attente/Avertissement
   - 🔴 Rouge = Rejeté/Erreur

4. **Dates**:
   - Format français: JJ/MM/AAAA
   - Les alertes d'expiration sont automatiques
   - Hover pour voir la valeur complète

5. **Pagination**: 
   - Les données affichées sont paginées
   - Plus de données = tables scrollables horizontalement

---

## ❓ Questions fréquentes

### Q: Comment réinitialiser le mot de passe d'un utilisateur?
**R:** Allez dans 👥 Utilisateurs, trouvez l'utilisateur, cliquez sur Eye, trouvez l'action "Réinitialiser mot de passe"

### Q: Où voir l'historique des actions?
**R:** Sur le Dashboard, section "Activités récentes" montre les 5 dernières actions. Pour un audit complet, utilisez 📄 Documents.

### Q: Comment vérifier rapidement une entreprise?
**R:** Allez dans 🏢 Entreprises, filtrez par "En attente", consultez le document (📄 Documents), validez, puis retournez à Entreprises et cliquez ✓

### Q: Peut-on exporter les données?
**R:** Actuellement, les boutons 📥 permettent de télécharger les documents. L'export de rapports complets sera ajouté prochainement.

### Q: Comment signaler un bug?
**R:** Contactez l'équipe de développement avec:
- Page concernée
- Actions effectuées
- Navigateur/version
- Screenshot si possible

---

## 🆘 Troubleshooting

### Je ne peux pas accéder à `/admin/login`
- Vérifiez que l'application tourne sur `localhost:8080`
- Actualisez la page (Ctrl+R ou Cmd+R)
- Videz le cache: Ctrl+Shift+Delete

### Les données n'apparaissent pas
- Attendez le chargement (le premier chargement peut être lent)
- Vérifiez la console (F12) pour les erreurs
- Réactualisez la page

### Le sidebar ne fonctionne pas
- Cliquez sur l'icône ☰ en haut à gauche
- Vérifiez que JavaScript est activé
- Essayez un autre navigateur

---

## 🔄 Mise à jour des données

Actuellement, les données affichées sont:
- **Statiques** (fictives pour démonstration)
- **Stockées en localStorage** pour persistance

Pour une vraie application:
- Connectez l'API backend (`localhost:3000` suggéré)
- Implémentez les actions réelles
- Ajoutez la persistance en base de données

---

## 📞 Support

Pour toute question:
1. Consultez la documentation: `ADMIN_MODULE.md`
2. Vérifiez les cases d'usage dans ce guide
3. Consultez le code source (bien commenté)
4. Contactez l'équipe technique

---

**Bon courage et amusez-vous avec le module admin! 🚀**

Créé le: 16 février 2026
