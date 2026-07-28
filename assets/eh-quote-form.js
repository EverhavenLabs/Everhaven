/**
 * EverHaven quote form — progressive-enhancement validation, dropzone
 * states, and a calm confirmation swap. No network request is made yet;
 * see submitQuoteForm() below for the exact integration boundary.
 */

/* ============================================================
 * LAUNCH BLOCKER: This stub does not send submissions. Replace with
 * the approved form app or backend endpoint before production launch.
 * ============================================================
 * INTEGRATION BOUNDARY — READ BEFORE WIRING A REAL BACKEND
 * ============================================================
 * No form app or endpoint has been chosen yet (deliberately deferred —
 * Shopify's native contact form can't accept file attachments, so this
 * needs either a form app or a custom endpoint; see Handoff section H).
 *
 * Replace the body of submitQuoteForm() with a real request once a
 * backend is selected. It must:
 *   - POST as multipart/form-data (the form includes a <input type="file"
 *     multiple> field named "files")
 *   - Send the fields as named in sections/eh-quote-form.liquid:
 *     name, email, project_type, description, quantity, deadline, files
 *   - Resolve on success, reject (with a message) on failure — this
 *     function's caller already handles both cases: success shows the
 *     confirmation state, rejection re-shows the form with an error.
 * Nothing else in this file needs to change to wire a real backend.
 * ============================================================ */
function submitQuoteForm(formData) {
  // STUB — simulates network latency, always "succeeds". Replace with a
  // real fetch()/XHR to the chosen form backend.
  return new Promise((resolve) => {
    setTimeout(resolve, 400);
  });
}

/**
 * Guarded the same way as assets/eh-faq-accordion.js: if this section
 * were ever added twice to one page, a second <script src> tag for this
 * same file would execute this code again. A bare top-level `class`
 * would throw "Identifier has already been declared" the second time
 * (classic scripts share one global lexical scope) even with only the
 * customElements.define() call guarded — so the class declaration itself
 * is inside this guard too, not just the define() call.
 */
if (!customElements.get('eh-quote-form')) {
class EhQuoteForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('[data-eh-quote-form]');
    this.confirmation = this.querySelector('#EhQuoteConfirmation');
    this.errorSummary = this.querySelector('#EhQuoteErrorSummary');
    this.errorList = this.querySelector('#EhQuoteErrorList');
    this.resetButton = this.querySelector('[data-eh-quote-reset]');
    this.dropzone = this.querySelector('[data-eh-dropzone]');
    this.fileInput = this.querySelector('.eh-quote__file-input');
    this.fileListEl = this.querySelector('[data-eh-file-list]');

    if (!this.form) return;

    // Enable custom validation UI only once JS is confirmed running —
    // native HTML5 validation (required, type="email") remains the
    // fallback if this script fails to load.
    this.form.noValidate = true;

    this.requiredFields = [
      { id: 'EhQuoteName', label: 'Please add your name' },
      { id: 'EhQuoteEmail', label: 'Please add a valid email' },
      { id: 'EhQuoteDescription', label: "Please describe what you're making" }
    ];

    this.form.addEventListener('submit', this.onSubmit.bind(this));

    if (this.resetButton) {
      this.resetButton.addEventListener('click', this.onReset.bind(this));
    }

    if (this.dropzone && this.fileInput) {
      this.dropzone.addEventListener('dragover', this.onDragOver.bind(this));
      this.dropzone.addEventListener('dragleave', this.onDragLeave.bind(this));
      this.dropzone.addEventListener('drop', this.onDrop.bind(this));
      this.fileInput.addEventListener('change', this.updateFileList.bind(this));
    }
  }

  validate() {
    const errors = [];

    this.requiredFields.forEach(({ id, label }) => {
      const field = this.form.querySelector('#' + id);
      if (!field) return;
      const errorEl = this.form.querySelector('#' + id + '-error');
      const isValid = field.checkValidity() && field.value.trim() !== '';

      field.setAttribute('aria-invalid', isValid ? 'false' : 'true');
      if (errorEl) errorEl.textContent = isValid ? '' : label;

      if (!isValid) errors.push({ id, label });
    });

    return errors;
  }

  showErrorSummary(errors) {
    if (!this.errorSummary || !this.errorList) return;

    this.errorList.innerHTML = '';
    errors.forEach(({ id, label }) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#' + id;
      link.textContent = label;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const field = this.form.querySelector('#' + id);
        if (field) field.focus();
      });
      li.appendChild(link);
      this.errorList.appendChild(li);
    });

    this.errorSummary.hidden = false;
    this.errorSummary.focus();
  }

  hideErrorSummary() {
    if (this.errorSummary) this.errorSummary.hidden = true;
  }

  onSubmit(event) {
    event.preventDefault();

    const errors = this.validate();

    if (errors.length > 0) {
      this.showErrorSummary(errors);
      return;
    }

    this.hideErrorSummary();

    const submitButton = this.form.querySelector('.eh-quote__submit');
    if (submitButton) submitButton.disabled = true;

    const formData = new FormData(this.form);

    submitQuoteForm(formData)
      .then(() => {
        this.form.hidden = true;
        if (this.confirmation) {
          this.confirmation.hidden = false;
          this.confirmation.focus();
        }
      })
      .catch(() => {
        if (submitButton) submitButton.disabled = false;
      });
  }

  onReset() {
    this.form.reset();
    this.form.hidden = false;
    if (this.confirmation) this.confirmation.hidden = true;
    if (this.fileListEl) this.fileListEl.textContent = '';

    this.requiredFields.forEach(({ id }) => {
      const field = this.form.querySelector('#' + id);
      const errorEl = this.form.querySelector('#' + id + '-error');
      if (field) field.removeAttribute('aria-invalid');
      if (errorEl) errorEl.textContent = '';
    });

    const nameField = this.form.querySelector('#EhQuoteName');
    if (nameField) nameField.focus();
  }

  onDragOver(event) {
    event.preventDefault();
    this.dropzone.classList.add('eh-quote__dropzone--over');
  }

  onDragLeave() {
    this.dropzone.classList.remove('eh-quote__dropzone--over');
  }

  onDrop(event) {
    event.preventDefault();
    this.dropzone.classList.remove('eh-quote__dropzone--over');

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
      this.fileInput.files = event.dataTransfer.files;
      this.updateFileList();
    }
  }

  updateFileList() {
    if (!this.fileListEl) return;
    const files = Array.from(this.fileInput.files || []);
    this.fileListEl.textContent = files.map((file) => file.name).join(', ');
  }
}

customElements.define('eh-quote-form', EhQuoteForm);
}
