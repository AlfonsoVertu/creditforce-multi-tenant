# 📋 Installazione Meteor e Avvio Progetto

## ⚠️ Prerequisito: Installare Meteor

Meteor non è attualmente installato sul sistema. 

### Windows - Installazione Meteor

Apri PowerShell come Amministratore ed esegui:

```powershell
# Opzione 1: Chocolatey (se installato)
choco install meteor

# Opzione 2: Installer ufficiale
# Scarica da: https://www.meteor.com/install
```

**Oppure scarica l'installer da:** https://install.meteor.com/windows

---

## ✅ Status Corrente

- ✅ **MongoDB Docker** - Avviato su porta 27018
- ✅ **Replica Set** - Inizializzato
- ✅ **Componente React** - Creato (`imports/ui/App.jsx`)
- ⏳ **Dipendenze** - Da installare (richiede Meteor)

---

## 🚀 Dopo Installazione Meteor

### 1. Installa Dipendenze

```bash
cd c:\Users\Raven\react\andrea\multi-tenant-login
meteor npm install
```

### 2. Avvia Applicazione

```bash
meteor run --settings settings.json
```

Attendere il messaggio:
```
✅ Database seeding completed successfully!
=> App running at: http://localhost:3000/
```

### 3. Apri Browser

Vai su: **http://localhost:3000**

---

## 🔑 Credentials Demo

| Email | Password |
|-------|----------|
| `admin@system.core` | `password123` |
| `manager@tenant-alpha.com` | `password123` |
| `marco.rossi@provider.xyz` | `password123` |

---

## 🎨 UI Corrente

L'applicazione mostra una **landing page minimal** con:
- 🎨 Login elegante con gradient
- ✅ Autenticazione funzionante
- 📊 Dashboard base che mostra info utente
- 🔐 Logout

Per avere l'**UI completa** del demo:
1. Sostituire `imports/ui/App.jsx` con il codice fornito
2. Integrare hooks Meteor (`useTracker`, `Meteor.call`)

---

## 🛠️ Alternative (Senza Meteor)

Se preferisci non installare Meteor globalmente, puoi usare **npx**:

```bash
npx meteor npm install
npx meteor run --settings settings.json
```

---

## 📊 MongoDB già configurato

MongoDB è operativo:
- **Porta**: 27018 (per evitare conflitti)
- **Database**: estatenexus_db
- **Replica Set**: rs0 (inizializzato)
- **Container**: `estatenexus_mongo`

Verifica:
```bash
docker ps
# Dovresti vedere: estatenexus_mongo running
```

---

## 🔍 Troubleshooting

### Se MongoDB non risponde
```bash
docker restart estatenexus_mongo
```

### Se la porta è già in uso
Il progetto usa già la porta 27018 invece di 27017.

### Script Policy Error (PowerShell)
Esegui come Amministratore:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

**Una volta installato Meteor, l'applicazione sarà pronta in 2 minuti! 🚀**
