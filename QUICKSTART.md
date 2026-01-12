# 🚀 QuickStart - EstateNexus Core

## Prerequisiti

- ✅ Node.js 20+ installato
- ✅ Docker Desktop in esecuzione
- ✅ Meteor installato globalmente

## ⚡ Avvio Rapido (5 minuti)

### 1. Avvia MongoDB Docker

```bash
cd c:\Users\Raven\react\andrea\multi-tenant-login
docker-compose up -d
```

**Verifica container:**
```bash
docker ps
# Dovresti vedere "estatenexus_mongo"
```

### 2. Inizializza Replica Set (SOLO prima volta)

```bash
docker exec -it estatenexus_mongo mongosh
```

Dentro mongosh digita:
```javascript
rs.initiate()
exit
```

### 3. Installa Dipendenze Meteor

```bash
meteor npm install
```

### 4. Avvia Applicazione

```bash
meteor run --settings settings.json
```

Attendere che vedi:
```
🚀 EstateNexus Core Server Started
🌱 Starting database seeding...
✅ Database seeding completed successfully!
=> App running at: http://localhost:3000/
```

### 5. Apri Browser

Vai su: **http://localhost:3000**

---

## 🔑 Credenziali Login

| Email | Password | Ruolo | Descrizione |
|-------|----------|-------|-------------|
| `admin@system.core` | `password123` | Super Admin | Accesso globale completo |
| `manager@tenant-alpha.com` | `password123` | Tenant Manager | Alpha Immobiliare |
| `marco.rossi@provider.xyz` | `password123` | Senior Agent | Alpha Immobiliare |
| `giulia.verdi@provider.xyz` | `password123` | Junior Agent | Alpha Immobiliare |
| `manager@beta-estate.com` | `password123` | Tenant Manager | Beta Real Estate |

---

## 🧪 Test Rapido Funzionalità

### Test 1: Login & Multi-Profile ✅
1. Login con `manager@tenant-alpha.com`
2. Verifica profilo "Laura Alpha"
3. Se utente esiste in più tenant → vedi Context Switcher

### Test 2: Permessi Granulari ✅
1. Login come Super Admin
2. Vai su "Utenti & Permessi"
3. Modifica permessi di un Agent
4. Verifica che voci menu cambino

### Test 3: File Visibility (Ruoli) ✅
1. Login come `marco.rossi@provider.xyz` (Senior Agent)
2. Vai su "Archivio Documentale"
3. Login come `giulia.verdi@provider.xyz` (Junior Agent)
4. Verifica che veda SOLO file degli utenti con stesso template

### Test 4: Impersonation ✅
1. Login come Super Admin
2. Click su icona "User Cog" di un Agent
3. Verifica banner giallo: "MODALITÀ IMPERSONIFICAZIONE ATTIVA"
4. Esegui azioni
5. Torna Admin

### Test 5: Audit Logs ✅
```bash
docker exec -it estatenexus_mongo mongosh
```

In mongosh:
```javascript
use estatenexus_db
db.audit_logs.find().pretty()
```

Ogni azione critica è loggata!

---

## ⚠️ Troubleshooting

### Errore: "MongoError: no primary found"
```bash
docker exec -it estatenexus_mongo mongosh
rs.initiate()
```

### Port 27017 già in uso
Modifica `docker-compose.yml`:
```yaml
ports:
  - "27018:27017"  # Usa porta diversa
```

E `.env`:
```
MONGO_URL=mongodb://localhost:27018/estatenexus_db?replicaSet=rs0
```

### Meteor non trova moduli
```bash
rm -rf node_modules .meteor/local
meteor npm install
meteor run
```

---

## 📂 Struttura Progetto

```
/imports
  /api                    # Backend
    /core                # Infrastruttura
      /tenant            # TenantsCollection
      /permissions       # Registry permessi
      /server            # Context validator
    /users               # Users methods & publications
    /roles               # Template permessi
    /notes               # Note personali
    /files               # File management
    /contacts            # CRM
    /audit               # Audit logging
  /ui                    # Frontend (Da completare)
  /startup
    /server              # Seed data
```

---

## 🔥 Prossimi Passi

1. **Creare `imports/ui/App.jsx`** con il codice demo adattato
2. **Testare tutte le funzionalità** seguendo walkthrough.md
3. **Deployment** (opzionale)

---

## 📚 Documentazione

- [implementation_plan.md](file:///C:/Users/Raven/.gemini/antigravity/brain/69fc9dba-5528-45f2-a486-7e9144107b0f/implementation_plan.md) - Piano architettonico completo
- [walkthrough.md](file:///C:/Users/Raven/.gemini/antigravity/brain/69fc9dba-5528-45f2-a486-7e9144107b0f/walkthrough.md) - Guida completamento & testing
- [task.md](file:///C:/Users/Raven/.gemini/antigravity/brain/69fc9dba-5528-45f2-a486-7e9144107b0f/task.md) - Checklist implementazione

---

## ✨ Features Enterprise

✅ Multi-Tenancy MongoDB
✅ Sistema Permessi Granulare (Pages vs Tools)
✅ Template Permessi con Sync Globale
✅ Impersonation Sicura con Audit
✅ Multi-Profile Login
✅ File Visibility basata su Ruoli
✅ RBAC Gerarchico
✅ Analytics & Tracking
✅ Audit Logging Immutabile
✅ Seed Data Completo

---

**Happy Coding! 🚀**
