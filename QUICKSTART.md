# 🚀 QuickStart - CreditForce Core

## Prerequisiti

- ✅ Node.js 20+ installato
- ✅ Docker Desktop in esecuzione
- ✅ Meteor installato globalmente

## ⚡ Avvio Rapido (5 minuti)

### 1. Avvia MongoDB Docker

```bash
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

### 4. Esporta variabili ambiente (per usare MongoDB Docker)

macOS/Linux:
```bash
export MONGO_URL="mongodb://localhost:27018/estatenexus_db?replicaSet=rs0"
```

PowerShell:
```powershell
$env:MONGO_URL="mongodb://localhost:27018/estatenexus_db?replicaSet=rs0"
```

### 5. Avvia Applicazione

```bash
meteor run --settings settings.json
```

Attendere che vedi:
```
🚀 CreditForce Server Started
🌱 Starting database seeding...
✅ Database seeding completed successfully!
✅ Server startup complete
=> App running at: http://localhost:3000/
```

### 6. Apri Browser

Vai su: **http://localhost:3000**

---

## 🔑 Credenziali Login

| Email | Password | Ruolo | Descrizione |
|-------|----------|-------|-------------|
| `admin@system.core` | `password123` | Super Admin | Accesso globale completo |
| `manager@banca-centrale.it` | `password123` | Tenant Manager | Banca Credito Centrale |
| `marco.rossi@banca-centrale.it` | `password123` | Senior Agent | Banca Credito Centrale |
| `giulia.verdi@banca-centrale.it` | `password123` | Junior Agent | Banca Credito Centrale |
| `manager@finanza-recuperi.it` | `password123` | Tenant Manager | Finanza Recuperi SpA |
| `multi.agent@demo.com` | `password123` | Agent | Multi-tenant demo |

---

## 🧪 Test Rapido Funzionalità

### Test 1: Login & Multi-Profile ✅
1. Login con `multi.agent@demo.com`
2. Verifica che compaia il Context Switcher con più tenant

### Test 2: Permessi Granulari ✅
1. Login come Super Admin
2. Vai su "Utenti"
3. Apri "Gestisci Permessi" per un Agent
4. Verifica che le voci menu cambino al logout/login

### Test 3: File Visibility (Ruoli) ✅
1. Login come `marco.rossi@banca-centrale.it` (Senior Agent)
2. Vai su "Files"
3. Login come `giulia.verdi@banca-centrale.it` (Junior Agent)
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

### Port 27018 già in uso
Modifica `docker-compose.yml` con una porta libera:
```yaml
ports:
  - "27019:27017"
```

Poi aggiorna la variabile ambiente:
```
MONGO_URL=mongodb://localhost:27019/estatenexus_db?replicaSet=rs0
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
    /practices           # Pratiche
    /audit               # Audit logging
  /ui                    # Frontend React
  /startup
    /server              # Seed data
```

---

## 🔥 Prossimi Passi

1. **Personalizzare UI e branding** (nome progetto e colori)
2. **Eseguire test end-to-end** su utenti e permessi
3. **Preparare il deployment** (opzionale)

---

## 📚 Documentazione

- [README.md](README.md) - Panoramica progetto e funzionalità
- [imports/startup/server/constants.js](imports/startup/server/constants.js) - Seed data (tenant, utenti, permessi)

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
