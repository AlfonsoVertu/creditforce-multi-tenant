# 📋 Installazione Meteor e Avvio Progetto

## ⚠️ Prerequisito: Installare Meteor

Installa Meteor globalmente prima di avviare il progetto.

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

## 🚀 Dopo Installazione Meteor

### 1. Installa Dipendenze

```bash
meteor npm install
```

### 2. Avvia MongoDB Docker

```bash
docker-compose up -d
```

Se è la prima volta, inizializza il replica set:
```bash
docker exec -it estatenexus_mongo mongosh
rs.initiate()
exit
```

### 3. Esporta variabile MONGO_URL

macOS/Linux:
```bash
export MONGO_URL="mongodb://localhost:27018/estatenexus_db?replicaSet=rs0"
```

PowerShell:
```powershell
$env:MONGO_URL="mongodb://localhost:27018/estatenexus_db?replicaSet=rs0"
```

### 4. Avvia Applicazione

```bash
meteor run --settings settings.json
```

Attendere il messaggio:
```
✅ Database seeding completed successfully!
=> App running at: http://localhost:3000/
```

### 5. Apri Browser

Vai su: **http://localhost:3000**

---

## 🔑 Credentials Demo

| Email | Password |
|-------|----------|
| `admin@system.core` | `password123` |
| `manager@banca-centrale.it` | `password123` |
| `marco.rossi@banca-centrale.it` | `password123` |
| `multi.agent@demo.com` | `password123` |

---

## 🎨 UI Corrente

L'applicazione include una **UI demo completa** in `imports/ui/App.jsx` con:
- Login, dashboard e moduli principali
- Context switcher multi-tenant
- Gestione permessi basata sui ruoli

---

## 🛠️ Alternative (Senza Meteor)

Se preferisci non installare Meteor globalmente, puoi usare **npx**:

```bash
npx meteor npm install
npx meteor run --settings settings.json
```

---

## 🔍 Troubleshooting

### Se MongoDB non risponde
```bash
docker restart estatenexus_mongo
```

### Se la porta 27018 è già in uso
Aggiorna la porta in `docker-compose.yml` e la variabile `MONGO_URL`.

### Script Policy Error (PowerShell)
Esegui come Amministratore:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

**Una volta installato Meteor, l'applicazione sarà pronta in 2 minuti! 🚀**
