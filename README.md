# CreditForce Core - Multi-Tenant Credit Management SaaS

Framework SaaS multi-tenant per la gestione crediti basato su Meteor 3.0.

## ⚡ Status Implementazione

✅ **Backend**:
- Collezioni MongoDB con schema validation
- Meteor methods per CRUD operations
- Publications con filtri tenant-aware
- Seed database con dati demo
- Sistema permessi centralizzato
- Audit logging automatico
- Impersonation sicura

✅ **Frontend Demo**:
- UI React completa in `imports/ui/App.jsx`
- Hooks e componenti React riutilizzabili

## Stack Tecnologico

- **Framework**: Meteor 3.0.4 (Async Architecture)
- **Database**: MongoDB 7.0 (Docker)
- **Frontend**: React 18
- **Runtime**: Node.js 20+
- **Authorization**: alanning:roles v4
- **Validation**: simpl-schema

## Quick Start

### 1. Avvia MongoDB Docker

```bash
docker-compose up -d
```

### 2. Inizializza Replica Set (Prima volta)

```bash
docker exec -it estatenexus_mongo mongosh
```

In mongosh:
```javascript
rs.initiate()
exit
```

### 3. Installa Dipendenze

```bash
meteor npm install
```

### 4. Esporta variabili ambiente (per usare MongoDB Docker)

```bash
export MONGO_URL="mongodb://localhost:27018/estatenexus_db?replicaSet=rs0"
```

Per PowerShell:
```powershell
$env:MONGO_URL="mongodb://localhost:27018/estatenexus_db?replicaSet=rs0"
```

### 5. Avvia Applicazione

```bash
meteor run --settings settings.json
```

Applicazione disponibile su: http://localhost:3000

## Credenziali Demo

| Email | Password | Ruolo | Descrizione |
|-------|----------|-------|-------------|
| admin@system.core | password123 | Super Admin | Accesso globale completo |
| manager@banca-centrale.it | password123 | Tenant Admin | Banca Credito Centrale |
| marco.rossi@banca-centrale.it | password123 | Agent | Operatore senior |
| multi.agent@demo.com | password123 | Agent | Multi-tenant demo |

## Funzionalità Principali

- ✅ Multi-tenancy con isolamento logico
- ✅ Sistema permessi granulare (PAGES vs TOOLS)
- ✅ Template permessi riutilizzabili
- ✅ Impersonation sicura con audit
- ✅ Multi-profile login
- ✅ File management con visibilità basata su ruoli
- ✅ Analytics & tracking sessioni
- ✅ Audit logging immutabile
- ✅ Note personali
- ✅ Gestione contatti CRM
- ✅ Gestione pratiche e workflow

## Struttura Progetto

```
/imports
  /api
    /core          # Framework infrastrutturale
    /users         # Gestione utenti & impersonation
    /roles         # Template permessi
    /notes         # Note personali
    /files         # File management
    /contacts      # CRM contatti
    /practices     # Pratiche
    /audit         # Audit logging
  /ui
    /components    # Componenti React riutilizzabili
    /layouts       # Layout principali
    /pages         # Viste applicazione
    /hooks         # Custom hooks
```

## License

Proprietary - CreditForce Core
