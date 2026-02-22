# Italien-Immobilien Lead Toolkit

Kostenlose Tools fuer deutsche Investoren die Immobilien in Italien kaufen moechten. Lead generation per Studio Legale Golini.

## Tools

| Tool | File | Descrizione |
|---|---|---|
| Kostenrechner | `kostenrechner.html` | Calcola tutti i costi di acquisto immobile |
| Steuerrechner | `steuerrechner.html` | Calcola IMU e TARI per non-residenti |
| Checkliste | `checkliste.html` | Checklist 8 step per acquisto immobile |
| Problemloeser | `problemloeser.html` | Quiz diagnostico problemi immobiliari |

## Setup

1. Clona il repository
2. Configura il webhook URL in `js/shared.js`:
   ```js
   const WEBHOOK_URL = 'https://tuo-n8n-url/webhook/lead-capture';
   ```
3. Apri `index.html` nel browser per testare

## Deploy su GitHub Pages

1. Crea un repository su GitHub
2. Pusha tutti i file
3. Settings > Pages > Source: Deploy from branch (main)
4. Il sito sara disponibile su `https://tuousername.github.io/nome-repo/`

## Embed in onepage.io

Per ogni tool, aggiungi un blocco HTML custom in onepage con:

```html
<iframe
  src="https://tuousername.github.io/nome-repo/kostenrechner.html"
  width="100%"
  height="800"
  frameborder="0"
  style="border:none; max-width:100%;">
</iframe>
```

Cambia il nome del file per ogni tool (steuerrechner.html, checkliste.html, problemloeser.html).

## n8n Webhook Payload

Ogni form invia un POST JSON:

```json
{
  "email": "user@example.com",
  "source": "kostenrechner|steuerrechner|checkliste|problemloeser",
  "data": { ... dati specifici del tool ... },
  "timestamp": "2026-02-22T15:30:00.000Z",
  "gdpr_consent": true
}
```

### Workflow n8n consigliato

1. **Webhook node** - riceve il POST
2. **Google Sheets node** - appende il lead
3. **Send Email node** - conferma all'utente (Aruba SMTP)
4. **Telegram/Email node** - notifica all'avvocato

## File Structure

```
/
├── styles/shared.css       # Stili condivisi
├── js/shared.js            # Lead capture, modal, utilities
├── index.html              # Pagina indice (dev/test)
├── kostenrechner.html      # Tool 1
├── steuerrechner.html      # Tool 2
├── checkliste.html         # Tool 3
├── problemloeser.html      # Tool 4
├── .nojekyll               # GitHub Pages config
└── README.md
```
