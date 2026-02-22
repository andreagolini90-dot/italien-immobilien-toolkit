# Italien-Immobilien Lead Toolkit

## Progetto
Toolkit lead generation per Studio Legale Golini. 4 tool HTML/JS/CSS standalone embedabili via iframe in onepage.io. Lingua: solo tedesco. Target: clienti DACH che investono in immobili in Italia.

## File Structure
```
/
├── styles/shared.css      # Shared styles (navy #1B3A5C, gold #C9A84C)
├── js/shared.js           # Lead capture, modal, validation helpers
├── kostenrechner.html     # Purchase cost calculator
├── steuerrechner.html     # Tax calculator (IMU/TARI)
├── checkliste.html        # 8-step buying checklist
├── problemloeser.html     # Diagnostic quiz
├── index.html             # Directory page (dev only)
├── .nojekyll              # GitHub Pages config
└── README.md              # Setup & embed instructions
```

## Regole
1. **Zero build tools** — solo HTML, CSS, JS vanilla. Niente npm, niente framework.
2. **Iframe-friendly** — body margin 0, no frame-busting, responsive 100% width
3. **Tutto in tedesco** — ogni stringa visibile all'utente
4. **WEBHOOK_URL** — configurabile come const in cima a shared.js
5. **Lead capture** — ogni tool ha un modal che raccoglie email + GDPR consent
6. **Payload webhook**: `{email, source, data, timestamp, gdpr_consent}`
7. **Colori**: primario navy #1B3A5C, accento gold #C9A84C, sfondo bianco
8. **Font**: system-ui, sans-serif

## n8n Webhook
POST a: https://n8n-production-87eb.up.railway.app/webhook/lead-capture
(da configurare in shared.js)

## Hosting
GitHub Pages (gratuito). Embed via iframe in onepage.io.
