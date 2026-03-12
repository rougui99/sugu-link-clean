# TROUBLESHOOTING & FAQ

Guide complet de résolution des problèmes pour Sugu-Link-Connect.

---

## 🔴 PROBLÈMES SQL SERVER

### Problème: "Login failed for user 'sa'"

**Symptômes:**
- Impossible de connexion à SQL Server
- Message: `Login failed for user 'sa'`

**Solutions:**

1. **Vérifier que SQL Server est démarré**
   ```powershell
   Get-Service -Name "MSSQL$SQLEXPRESS" | Select Status
   
   # Si arrêté, démarrer
   Start-Service -Name "MSSQL$SQLEXPRESS"
   ```

2. **Vérifier le mode d'authentification**
   ```sql
   -- SSMS > Propriétés du serveur
   -- Sécurité > Mode d'authentification
   -- Doit être: "Mode d'authentification SQL Server et Windows"
   ```

3. **Réinitialiser le mot de passe SA**
   ```powershell
   # Arrêter le service
   Stop-Service -Name "MSSQL$SQLEXPRESS" -Force
   
   # Redémarrer en mode single-user
   $cmd = "C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\Binn\sqlservr.exe"
   & $cmd -m
   
   # Dans une autre terminal, réinitialiser
   sqlcmd -S localhost\SQLEXPRESS -E
   
   # Puis exécuter:
   ALTER LOGIN sa WITH PASSWORD = 'NewPassword123!'
   GO
   ```

4. **Port 1433 déjà utilisé**
   ```powershell
   # Vérifier les connexions
   Get-NetTCPConnection -LocalPort 1433
   
   # Ou accéder par le named pipe (plus lent):
   # "localhost\SQLEXPRESS" // Changé
   # "np:localhost\SQLEXPRESS" // Named pipe
   ```

---

### Problème: "Database 'SuguLinkConnect' cannot be opened"

**Symptômes:**
- La base de données existe mais ne peut pas être accédée
- Message d'erreur lors de l'utilisation

**Solutions:**

```sql
-- 1. Vérifier si la base existe
SELECT name FROM sys.databases WHERE name = 'SuguLinkConnect';

-- 2. Si elle existe, vérifier son statut
SELECT name, state_desc FROM sys.databases WHERE name = 'SuguLinkConnect';
-- state_desc doit être: ONLINE

-- 3. Si statut est SUSPECT ou RECOVERING
ALTER DATABASE [SuguLinkConnect] SET EMERGENCY;
DBCC CHECKDB (SuguLinkConnect, REPAIR_REBUILD);
ALTER DATABASE [SuguLinkConnect] SET MULTI_USER;

-- 4. Vérifier l'espace disque
EXEC sp_spaceused;
```

---

### Problème: "Incorrect syntax near '.'"

**Symptômes:**
- Erreur lors de l'exécution des scripts SQL
- Message: `Incorrect syntax near '.'`

**Solutions:**

1. **Vérifier les versions de SQL Server**
   ```sql
   SELECT @@VERSION;
   -- Doit être: SQL Server 2016 ou + (version 13.0 ou +)
   ```

2. **Vérifier les délimiteurs d'identifiants**
   ```sql
   -- ❌ Mauvais
   SELECT FirstName FROM Users;
   
   -- ✅ Correct
   SELECT [FirstName] FROM [dbo].[Users];
   ```

3. **Vérifier les terminateurs GO**
   ```sql
   -- ❌ Manquant
   CREATE TABLE Test (Id INT);
   CREATE TABLE Test2 (Id INT);
   
   -- ✅ Correct
   CREATE TABLE Test (Id INT);
   GO
   CREATE TABLE Test2 (Id INT);
   GO
   ```

---

### Problème: "Cannot drop database 'SuguLinkConnect' because it is currently in use"

**Solutions:**

```sql
-- 1. Fermer toutes les connexions actives
ALTER DATABASE [SuguLinkConnect] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

-- 2. Vérifier les processus actifs
DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql += 'KILL ' + CAST(session_id AS VARCHAR(10)) + ';'
FROM sys.dm_exec_sessions
WHERE database_id = DB_ID('SuguLinkConnect')
  AND session_id > 50;

EXEC sp_executesql @sql;

-- 3. Maintenant supprimer
DROP DATABASE [SuguLinkConnect];

-- 4. Restaurer à multi-user
ALTER DATABASE [SuguLinkConnect] SET MULTI_USER;
```

---

### Problème: "Timeout expired" lors des requêtes

**Solutions:**

```typescript
// Dans database.ts
const pool = new mssql.ConnectionPool({
  ...config,
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
  },
  requestTimeout: 30000, // 30 secondes
  connectionTimeout: 15000, // 15 secondes
});
```

```sql
-- Vérifier les requêtes longues
SELECT 
    session_id,
    status,
    command,
    cpu_time,
    total_elapsed_time
FROM sys.dm_exec_requests
WHERE session_id > 50
ORDER BY cpu_time DESC;

-- Tuer une requête problématique
KILL session_id;
```

---

## 🟠 PROBLÈMES BACKEND NODE.JS

### Problème: "Cannot find module 'mssql'"

**Solution:**

```bash
npm install mssql
# Ou si vous utilisez Yarn
yarn add mssql
# Ou si vous utilisez pnpm
pnpm add mssql
```

---

### Problème: "ECONNREFUSED 127.0.0.1:1433"

**Symptômes:**
- Node.js ne peut pas se connecter à SQL Server
- Message: `Error: connect ECONNREFUSED`

**Solutions:**

```typescript
// 1. Vérifier que SQL Server écoute sur le port 1433
// Dans SSMS:
// Outils > Options > Réseau SQL Server
// TCP/IP doit être activé avec port 1433

// 2. Utiliser 'localhost\\SQLEXPRESS' au lieu de 'localhost'
const config = {
  server: 'localhost\\SQLEXPRESS', // Correct pour Express
  database: 'SuguLinkConnect',
  user: 'sa',
  password: 'YourPassword',
  options: {
    trustServerCertificate: true,
  },
};

// 3. Vérifier le pare-feu
// Ajouter une règle pour SQL Server (port 1433)
```

---

### Problème: "Login failed. The login is from an untrusted domain"

**Solution:**

```typescript
const config = {
  ...config,
  options: {
    trustServerCertificate: true, // Ajouter cette option
    encrypt: false,
  },
};
```

---

### Problème: "ReferenceError: Cannot access 'getPool' before initialization"

**Symptômes:**
- Erreur au démarrage du serveur
- Import/export mélangé

**Solution:**

```typescript
// ❌ Problématique
export const getPool = ...;
const pool = getPool(); // Erreur - getPool pas encore défini

// ✅ Correct
const initPool = async () => {
  const pool = await getPool();
};

export { initPool, getPool };
```

---

### Problème: Requête SQL prend très longtemps

**Solutions:**

```sql
-- 1. Vérifier les indexes
SELECT 
    OBJECT_NAME(i.object_id) AS TableName,
    i.name AS IndexName,
    i.type_desc AS IndexType
FROM sys.indexes i
WHERE database_id = DB_ID('SuguLinkConnect')
  AND OBJECTPROPERTY(i.object_id,'IsUserTable') = 1;

-- 2. Reconstruire les indexes
ALTER INDEX ALL ON [dbo].[JobListings] REBUILD;
ALTER INDEX ALL ON [dbo].[JobApplications] REBUILD;

-- 3. Utiliser EXECUTION PLAN
-- Ctrl+L dans SSMS pour voir le plan d'exécution

-- 4. Ajouter un index si nécessaire
CREATE INDEX idx_JobApplications_UserId 
ON [dbo].[JobApplications]([UserId]);
```

---

## 🟡 PROBLÈMES FRONTEND REACT

### Problème: "Module not found: Cannot find module '@/components/ui/button'"

**Solution:**

```bash
# Réinstaller les composants shadcn
npx shadcn-ui@latest add button

# Ou importer directement depuis le chemin correct
import { Button } from "../components/ui/button";
```

---

### Problème: Admin pages ne se chargent pas

**Symptômes:**
- Page /admin/users affiche "Accès non autorisé"
- Même avec les bonnes identifiants

**Solutions:**

1. **Vérifier le localStorage**
   ```javascript
   // Dans la console du navigateur
   localStorage.getItem('adminUser'); // Devrait retourner l'objet JSON
   localStorage.getItem('isAdmin'); // Devrait être 'true'
   ```

2. **Vérifier le contexte**
   ```typescript
   // Dans AdminLogin.tsx
   const dispatch = (value: any) => {
     window.dispatchEvent(new CustomEvent('adminLoginChange', { detail: value }));
   };
   ```

3. **Rafraîchir le navigateur après connexion**
   - Le localStorage doit être mis à jour
   - ProtectedAdminRoute vérifie isAdmin

---

### Problème: Erreur CORS lors des appels API

**Solutions:**

```typescript
// Dans le backend (index.ts)
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5173', // Développement
  credentials: true,
}));
```

```typescript
// Dans le frontend (.env.local)
VITE_API_URL=http://localhost:3000/api
```

```typescript
// Lors de l'appel API
fetch(`${import.meta.env.VITE_API_URL}/users`, {
  method: 'GET',
  credentials: 'include', // Inclure les cookies/auth
});
```

---

### Problème: "Cannot read property of undefined" dans Admin

**Solution:**

```typescript
// Préférer optional chaining (?.)
{adminUser?.FirstName || 'Admin'}

// Et nullish coalescing (??)
const name = adminUser?.FirstName ?? 'Unknown';
```

---

## 🟢 PROBLÈMES DEPLOYMENT

### Problème: Build échoue avec "Module not found"

**Solutions:**

```bash
# 1. Nettoyer et réinstaller
rm -r node_modules package-lock.json
npm install

# 2. Reconstruire
npm run build

# 3. Vérifier les dépendances
npm list

# 4. Vérifier les imports relatifs
# ❌ import Button from '/button';
# ✅ import Button from './Button';
```

---

### Problème: Build réussi mais l'app ne se charge pas

**Solutions:**

```bash
# 1. Vérifier les assets
npm run build       # Créer dist/
npm run preview     # Tester localement

# 2. Vérifier les paths
# vite.config.ts doit avoir:
export default {
  base: '/', // Pour la root
};

# 3. Pour un sous-dossier:
// vite.config.ts
export default {
  base: '/sugu-link/', // Si déployé en /sugu-link/
};
```

---

### Problème: Erreur 404 sur rechargement de page

**Symptômes:**
- `/admin/users` fonctionne avec le router
- Rechargement affiche 404

**Solutions:**

Pour **Vercel**:
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Pour **Netlify**:
```toml
# _redirects
/* /index.html 200
```

Pour **local preview**:
```bash
# Utiliser un serveur avec routing SPA
npm install -g serve
serve -s dist -l 3000
```

---

## 🔧 VÉRIFICATION DE SANTÉ (HEALTH CHECK)

### Script de Vérification Complète

```bash
#!/bin/bash

echo "=== VÉRIFICATION SUGU-LINK-CONNECT ==="

# 1. SQL Server
echo "✓ SQL Server..."
sqlcmd -S localhost\SQLEXPRESS -U sa -P $SQL_PASSWORD -Q "SELECT @@VERSION"

# 2. Base de données
echo "✓ Base de données..."
sqlcmd -S localhost\SQLEXPRESS -U sa -P $SQL_PASSWORD -Q "SELECT COUNT(*) FROM SuguLinkConnect.dbo.Users"

# 3. Backend
echo "✓ Backend..."
curl -s http://localhost:3000/health | jq

# 4. Frontend
echo "✓ Frontend..."
curl -s http://localhost:5173 | head -c 100

echo "=== VÉRIFICATION TERMINÉE ==="
```

---

## 📞 CONTACTER LE SUPPORT

Avez-vous une question qui n'est pas listée?

**Informations à fournir:**
1. Système d'exploitation (Windows 10/11, macOS, Linux)
2. Version SQL Server (2016, 2019, 2022, Express?)
3. Version Node.js (npm -v)
4. Message d'erreur complet
5. Contexte (quelle action exacte?)

**Canaux de support:**
- GitHub Issues: https://github.com/sugu-link/issues
- Email: support@sugu-link.com
- Forum: https://community.sugu-link.com

---

## 📚 RESSOURCES UTILES

- [SQL Server Documentation](https://learn.microsoft.com/sql)
- [mssql npm package](https://github.com/tediousjs/node-mssql)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Version**: 1.0  
**Dernière mise à jour**: 2026-02-16
