/* Italien-Immobilien Lead Toolkit - Shared JS */

// ============================================================
// CONFIGURAZIONE - Modifica questo URL con il tuo webhook n8n
// ============================================================
const WEBHOOK_URL = 'https://n8n-production-87eb.up.railway.app/webhook/lead-capture';
// Contact page URL
const CONTACT_URL = 'https://italien-immobilien.italienischeranwalt.com/';

// ============================================================
// EMAIL VALIDATION
// ============================================================
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================================
// LEAD CAPTURE - POST to n8n webhook
// ============================================================
async function leadCapture(source, data) {
  const payload = {
    email: data.email,
    source: source,
    data: data,
    timestamp: new Date().toISOString(),
    gdpr_consent: true
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Webhook error');
    return { success: true };
  } catch (err) {
    console.error('Lead capture error:', err);
    // Fallback: still show success to user (don't block UX)
    // The webhook might be not configured yet
    return { success: true, offline: true };
  }
}

// ============================================================
// MODAL HELPERS
// ============================================================
function showModal() {
  const overlay = document.getElementById('leadModal');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function hideModal() {
  const overlay = document.getElementById('leadModal');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function showSuccess() {
  const form = document.getElementById('modalForm');
  const success = document.getElementById('modalSuccess');
  if (form) form.style.display = 'none';
  if (success) success.style.display = 'block';
}

function resetModal() {
  const form = document.getElementById('modalForm');
  const success = document.getElementById('modalSuccess');
  const emailInput = document.getElementById('modalEmail');
  const gdprCheck = document.getElementById('modalGdpr');
  const errorEl = document.getElementById('modalError');

  if (form) form.style.display = 'block';
  if (success) success.style.display = 'none';
  if (emailInput) emailInput.value = '';
  if (gdprCheck) gdprCheck.checked = false;
  if (errorEl) errorEl.textContent = '';
}

// ============================================================
// MODAL INITIALIZATION
// ============================================================
// Call this in each tool's HTML after DOM is ready
// modalSource: string identifier, getModalData: function returning extra data
function initModal(modalSource, getModalData) {
  // Close modal on overlay click
  const overlay = document.getElementById('leadModal');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        hideModal();
        setTimeout(resetModal, 300);
      }
    });
  }

  // Close button
  const closeBtn = document.getElementById('modalCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      hideModal();
      setTimeout(resetModal, 300);
    });
  }

  // Submit handler
  const submitBtn = document.getElementById('modalSubmitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async function() {
      const email = document.getElementById('modalEmail').value.trim();
      const gdpr = document.getElementById('modalGdpr').checked;
      const errorEl = document.getElementById('modalError');

      // Validate
      if (!email) {
        errorEl.textContent = 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
        return;
      }
      if (!validateEmail(email)) {
        errorEl.textContent = 'Bitte geben Sie eine gueltige E-Mail-Adresse ein.';
        return;
      }
      if (!gdpr) {
        errorEl.textContent = 'Bitte stimmen Sie der Datenschutzerklaerung zu.';
        return;
      }

      errorEl.textContent = '';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet...';

      const extraData = typeof getModalData === 'function' ? getModalData() : {};
      const result = await leadCapture(modalSource, { email, ...extraData });

      if (result.success) {
        showSuccess();
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Absenden';
    });
  }
}

// ============================================================
// FORMAT CURRENCY
// ============================================================
function formatEUR(amount) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatPercent(value) {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value);
}

// ============================================================
// MODAL HTML TEMPLATE
// ============================================================
// Insert this into each tool page. Call getModalHTML() and append to body.
function getModalHTML() {
  return `
    <div id="leadModal" class="modal-overlay">
      <div class="modal">
        <button id="modalCloseBtn" class="modal-close">&times;</button>
        <div id="modalForm">
          <h3>Ergebnisse per E-Mail erhalten</h3>
          <p>Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen eine detaillierte Aufstellung zu.</p>
          <div class="form-group">
            <input type="email" id="modalEmail" placeholder="ihre@email.de">
          </div>
          <div class="gdpr-check">
            <input type="checkbox" id="modalGdpr">
            <label for="modalGdpr">Ich stimme der Verarbeitung meiner Daten gemaess der Datenschutzerklaerung zu.</label>
          </div>
          <div id="modalError" class="error-msg"></div>
          <button id="modalSubmitBtn" class="btn btn-primary btn-block">Absenden</button>
        </div>
        <div id="modalSuccess" class="success-msg">
          <div class="checkmark">&#10003;</div>
          <h3>Vielen Dank!</h3>
          <p>Sie erhalten die detaillierten Ergebnisse in Kuerze per E-Mail.</p>
        </div>
      </div>
    </div>
  `;
}
