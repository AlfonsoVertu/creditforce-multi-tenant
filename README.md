# EstateNexus Core - Multi-Tenant Real Estate SaaS

Framework SaaS multi-tenant enterprise per il settore immobiliare basato su Meteor 3.0.

## ⚡ Status Implementazione

✅ **Backend COMPLETO** (100%):
- Tutte le collezioni MongoDB con schema validation
- Tutti i Meteor methods per CRUD operations
- Tutte le publications con filtri tenant-aware
- Seed database con dati demo
- Sistema permessi centralizzato
- Audit logging automatico
- Impersonation sicura

🚧 **Frontend** (Da completare):
- `imports/ui/App.jsx` - Adattare codice demo con Meteor integration
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

### 4. Avvia Applicazione

```bash
meteor run --settings settings.json
```

Applicazione disponibile su: http://localhost:3000

## Credenziali Demo

| Email | Password | Ruolo | Descrizione |
|-------|----------|-------|-------------|
| admin@system.core | password123 | Super Admin | Accesso globale completo |
| manager@tenant-alpha.com | password123 | Tenant Admin | Manager Alpha Immobiliare |
| marco.rossi@provider.xyz | password123 | Agent | Agente Alpha Immobiliare |

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
    /audit         # Audit logging
  /ui
    /components    # Componenti React riutilizzabili
    /layouts       # Layout principali
    /pages         # Viste applicazione
    /hooks         # Custom hooks
```

## License

Proprietary - EstateNexus Core
