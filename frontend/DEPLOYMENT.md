# SETUP & DÉPLOIEMENT - Sugu-Link-Connect

## 📋 Vue d'Ensemble du Déploiement

Ce guide couvre le déploiement complet du système Sugu-Link-Connect avec:
- Installation SQL Server et base de données
- Création du schéma et données
- Configuration du backend Node.js
- Déploiement de l'application frontend

---

## 1️⃣ PRÉREQUIS SYSTÈME

### Windows Server / Local Development
- **SQL Server**: 2016+ (Express, Standard ou Enterprise)
- **Node.js**: 18+ LTS
- **npm** ou **bun**: gestionnaire de paquets
- **Visual Studio Code** (optionnel)
- **.NET Framework**: 4.8+ (pour SQL Server Management Studio)

### Permissions Requises
```powershell
# Exécuter PowerShell en tant qu'administrateur
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 2️⃣ INSTALLATION SQL SERVER

### Option A: SQL Server Management Studio (Recommandé)

#### Étape 1: Télécharger et Installer SSMS
```
https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
```

#### Étape 2: Créer la Base de Données
```sql
-- Ouvrir SSMS > New Query > Exécuter:

CREATE DATABASE SuguLinkConnect
    ON PRIMARY (
        NAME = SuguLinkConnect_data,
        FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\SuguLinkConnect.mdf',
        SIZE = 100MB,
        FILEGROWTH = 10%
    )
    LOG ON (
        NAME = SuguLinkConnect_log,
        FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\LOG\SuguLinkConnect.ldf',
        SIZE = 50MB,
        FILEGROWTH = 10%
    );

GO
```

#### Étape 3: Charger le Schéma
```sql
-- Ouvrir database/schema.sql dans SSMS
-- Sélectionner la base SuguLinkConnect
-- Exécuter (F5)
```

#### Étape 4: Charger les Procédures Stockées
```sql
-- Ouvrir database/procedures.sql dans SSMS
-- Exécuter (F5)
```

### Option B: Ligne de Commande (sqlcmd)

```powershell
# Vérifier SQL Server is running
Get-Service -Name "MSSQL$SQLEXPRESS" | Start-Service

# Créer la base de données
sqlcmd -S localhost\SQLEXPRESS -U sa -P "YourPassword" -i database\schema.sql

# Charger les procédures
sqlcmd -S localhost\SQLEXPRESS -U sa -P "YourPassword" -i database\procedures.sql

# Charger la maintenance (optionnel)
sqlcmd -S localhost\SQLEXPRESS -U sa -P "YourPassword" -i database\maintenance.sql
```

---

## 3️⃣ VÉRIFIER L'INSTALLATION SQL SERVER

```sql
-- Connexion à la base SuguLinkConnect dans SSMS

-- Vérifier la création des tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'dbo'
ORDER BY TABLE_NAME;

-- Devrait afficher 14 tables:
-- AdminUsers, AuditLog, Companies, CompanyUsers, Documents,
-- JobApplications, JobListings, Payments, Reviews, Reports,
-- Subscriptions, TenderBids, Tenders, Users
```

---

## 4️⃣ CONFIGURATION NODE.JS/EXPRESS

### Étape 1: Crée un Dossier Backend

```bash
cd c:\Users\hp\Desktop
mkdir sugu-link-backend
cd sugu-link-backend
npm init -y
```

### Étape 2: Installer les Dépendances

```bash
npm install express dotenv mssql cors helmet uuid
npm install --save-dev nodemon typescript ts-node @types/node @types/express
```

### Étape 3: Créer les Fichiers de Configuration

#### `.env`
```
SQL_SERVER=localhost\SQLEXPRESS
SQL_DATABASE=SuguLinkConnect
SQL_USER=sa
SQL_PASSWORD=YourPassword
SQL_ENCRYPT=false
PORT=3000
NODE_ENV=development
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### `src/config/database.ts`
```typescript
import mssql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.SQL_SERVER || 'localhost\\SQLEXPRESS',
  database: process.env.SQL_DATABASE || 'SuguLinkConnect',
  user: process.env.SQL_USER || 'sa',
  password: process.env.SQL_PASSWORD || '',
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: process.env.SQL_ENCRYPT === 'true',
    trustServerCertificate: true,
  },
};

let pool: mssql.ConnectionPool | null = null;

export const getPool = async (): Promise<mssql.ConnectionPool> => {
  if (pool && pool.connected) {
    return pool;
  }

  try {
    pool = new mssql.ConnectionPool(config);
    await pool.connect();
    console.log('✅ Connected to SQL Server');
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export default config;
```

#### `src/index.ts`
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getPool } from './config/database';
import usersRouter from './routes/users';
import companiesRouter from './routes/companies';
import jobsRouter from './routes/jobs';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/jobs', jobsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start server
const startServer = async () => {
  try {
    await getPool();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
```

### Étape 4: Créer les Routes

#### `src/routes/users.ts`
```typescript
import express, { Request, Response } from 'express';
import { getPool } from '../config/database';
import mssql from 'mssql';

const router = express.Router();

// GET /api/users
router.get('/', async (req: Request, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Users');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/users/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('UserId', mssql.Int, req.params.id)
      .execute('sp_GetUserProfile');
    
    res.json(result.recordset?.[0] || null);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/users
router.post('/', async (req: Request, res: Response) => {
  try {
    const { FirstName, LastName, Email, PhoneNumber, Domain } = req.body;
    const pool = await getPool();
    
    const result = await pool
      .request()
      .input('FirstName', mssql.NVarChar, FirstName)
      .input('LastName', mssql.NVarChar, LastName)
      .input('Email', mssql.NVarChar, Email)
      .input('PhoneNumber', mssql.NVarChar, PhoneNumber)
      .input('Domain', mssql.NVarChar, Domain)
      .execute('sp_InsertUser');
    
    res.status(201).json({ UserId: result.recordset?.[0]?.UserId });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
```

#### `src/routes/companies.ts`
```typescript
import express, { Request, Response } from 'express';
import { getPool } from '../config/database';
import mssql from 'mssql';

const router = express.Router();

// GET /api/companies
router.get('/', async (req: Request, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Companies');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/companies/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('CompanyId', mssql.Int, req.params.id)
      .execute('sp_GetCompanyDetails');
    
    res.json(result.recordset?.[0] || null);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/companies
router.post('/', async (req: Request, res: Response) => {
  try {
    const { Name, Email, PhoneNumber, Website, Industry } = req.body;
    const pool = await getPool();
    
    const result = await pool
      .request()
      .input('Name', mssql.NVarChar, Name)
      .input('Email', mssql.NVarChar, Email)
      .input('PhoneNumber', mssql.NVarChar, PhoneNumber)
      .input('Website', mssql.NVarChar, Website)
      .input('Industry', mssql.NVarChar, Industry)
      .execute('sp_InsertCompany');
    
    res.status(201).json({ CompanyId: result.recordset?.[0]?.CompanyId });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
```

#### `src/routes/jobs.ts`
```typescript
import express, { Request, Response } from 'express';
import { getPool } from '../config/database';
import mssql from 'mssql';

const router = express.Router();

// GET /api/jobs (avec recherche)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { keyword, page = 1, pageSize = 10 } = req.query;
    const pool = await getPool();
    
    const result = await pool
      .request()
      .input('SearchKeyword', mssql.NVarChar, (keyword as string) || '')
      .input('PageNumber', mssql.Int, parseInt(page as string) || 1)
      .input('PageSize', mssql.Int, parseInt(pageSize as string) || 10)
      .execute('sp_SearchJobs');
    
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('JobId', mssql.Int, req.params.id)
      .query('SELECT * FROM JobListings WHERE JobId = @JobId');
    
    res.json(result.recordset?.[0] || null);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/jobs
router.post('/', async (req: Request, res: Response) => {
  try {
    const { CompanyId, Title, Description, Location, Salary } = req.body;
    const pool = await getPool();
    
    const result = await pool
      .request()
      .input('CompanyId', mssql.Int, CompanyId)
      .input('Title', mssql.NVarChar, Title)
      .input('Description', mssql.NVarChar, Description)
      .input('Location', mssql.NVarChar, Location)
      .input('Salary', mssql.Decimal, Salary)
      .execute('sp_InsertJobListing');
    
    res.status(201).json({ JobId: result.recordset?.[0]?.JobId });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
```

### Étape 5: Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  }
}
```

### Étape 6: Démarrer le Serveur

```bash
npm run dev
```

Sortie attendue:
```
✅ Connected to SQL Server
🚀 Server running on port 3000
```

---

## 5️⃣ VÉRIFIER LES ENDPOINTS

```bash
# Health check
curl http://localhost:3000/health

# Lister les utilisateurs
curl http://localhost:3000/api/users

# Lister les entreprises
curl http://localhost:3000/api/companies

# Rechercher des emplois
curl http://localhost:3000/api/jobs?keyword=developer&page=1
```

---

## 6️⃣ BUILD & DÉPLOIEMENT FRONTEND

### Développement Local

```bash
cd sugu-link-connect-main
npm run dev
```

### Build Production

```bash
npm run build
npm run preview
```

### Déploiement sur Vercel/Netlify

```bash
vercel deploy
# ou
netlify deploy --prod --dir=dist
```

---

## 7️⃣ STRUCTURE FINALE DU PROJET

```
sugu-link-connect-ecosystem/
├── sugu-link-connect-main/          (Frontend React)
│   ├── src/
│   ├── public/
│   ├── dist/                         (Build output)
│   └── package.json
│
└── sugu-link-backend/               (Backend Node.js)
    ├── src/
    │   ├── config/
    │   │   └── database.ts
    │   ├── routes/
    │   │   ├── users.ts
    │   │   ├── companies.ts
    │   │   └── jobs.ts
    │   └── index.ts
    ├── dist/                        (Compiled JS)
    ├── .env
    ├── tsconfig.json
    ├── package.json
    └── package-lock.json

SQL Server Database: SuguLinkConnect
├── 14 Tablesles
├── 10+ Stored Procedures
├── 2 Functions
└── Audit Logging & Full History
```

---

## 8️⃣ VARIABLES D'ENVIRONNEMENT

### Frontend (.env.local)

```
VITE_API_URL=http://localhost:3000/api
VITE_UPLOAD_LIMIT=10485760
```

### Backend (.env)

```
SQL_SERVER=localhost\SQLEXPRESS
SQL_DATABASE=SuguLinkConnect
SQL_USER=sa
SQL_PASSWORD=YourStrongPassword
SQL_ENCRYPT=false
PORT=3000
NODE_ENV=development
JWT_SECRET=YourSecretKey123
LOG_LEVEL=info
```

---

## 9️⃣ MONITORING & MAINTENANCE

### Vérifier la Santé de la Base de Données

```sql
-- Taille de la base
EXEC sp_datafiles;

-- Espace disque utilisé
EXEC sp_spaceused;

-- Activité récente
SELECT TOP 10 * FROM AuditLog ORDER BY CreatedAt DESC;

-- Signalements en attente
SELECT * FROM Reports WHERE Status = 'en attente';
```

### Sauvegardes Automatiques

```powershell
# Créer une tâche planifiée Windows
$trigger = New-ScheduledTaskTrigger -Daily -At 2:00AM
$action = New-ScheduledTaskAction -Execute "sqlcmd" -Argument "-S localhost\SQLEXPRESS -U sa -P YourPassword -i database\maintenance.sql"
Register-ScheduledTask -TaskName "SuguDatabaseBackup" -Trigger $trigger -Action $action
```

---

## 🔟 DÉPANNAGE

### Erreur: "Login failed for user 'sa'"
```sql
-- Vérifier le mode d'authentification
SELECT @@VERSION;

-- SSMS > Connect > Options > Connection Properties
-- Ajouter: TrustServerCertificate=Yes
```

### Erreur: "Cannot drop database 'SuguLinkConnect'"
```sql
-- Fermer les connexions
ALTER DATABASE SuguLinkConnect SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
DROP DATABASE SuguLinkConnect;
```

### Backend ne se connecte pas à SQL Server
```bash
# Vérifier SQL Server
Get-Service -Name "MSSQL$SQLEXPRESS" | Select Status

# Redémarrer si arrêté
Start-Service -Name "MSSQL$SQLEXPRESS"

# Tester la connexion
npm run dev
```

---

## 📝 CHECKLIST DÉPLOIEMENT

- [ ] SQL Server installé et en cours d'exécution
- [ ] Base de données SuguLinkConnect créée
- [ ] Schéma et tables importés (database/schema.sql)
- [ ] Procédures stockées importées (database/procedures.sql)
- [ ] Données de démo insertées
- [ ] Backend Node.js configuré
- [ ] Routes API testées
- [ ] Frontend build généré
- [ ] Variables d'environnement configurées
- [ ] Tests de connectivité passés
- [ ] Sauvegardes planifiées configurées

---

## 🎯 PROCHAINES ÉTAPES

1. **Authentification Frontend**
   - Implémenter JWT depuis le backend
   - Intégrer async/await pour les appels API

2. **Webhooks & Notifications**
   - Email notifications via SendGrid
   - SMS via Twilio

3. **Monitoring & Analytics**
   - Implement logging avec Winston
   - Setup Datadog ou New Relic

4. **CI/CD Pipeline**
   - GitHub Actions pour tests automatiques
   - Déploiement auto vers Azure/AWS

---

**Version**: 1.0  
**Dernière mise à jour**: 2026-02-16  
**Mainteneur**: Équipe Sugu-Link-Connect
