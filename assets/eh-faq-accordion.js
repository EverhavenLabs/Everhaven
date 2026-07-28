/**
 * Single-open FAQ accordion. Wraps native <details>/<summary> elements
 * (full keyboard/screen-reader support for free) and closes any other
 * open item, scoped to this element only, when one is opened. Shared
 * across every FAQ instance — sections/eh-faq.liquid and
 * sections/eh-service-detail.liquid both load this file and both use
 * <eh-faq-accordion> markup.
 *
 * A page can render this section many times (e.g. the general FAQ page's
 * per-category layout), and each instance emits its own <script src>
 * tag for this file — so this file's top-level code can execute more
 * than once in the same document. The whole class declaration is
 * guarded, not just the customElements.define() call: classic scripts
 * share one global lexical scope, so a bare top-level `class` would
 * throw "Identifier has already been declared" on the 2nd+ occurrence
 * even with the define() call itself guarded. Keeping the class inside
 * this block scopes it to the block, so re-execution is a no-op.
 */
if (!customElements.get('eh-faq-accordion')) {
  class EhFaqAccordion extends HTMLElement {
    connectedCallback() {
      this.addEventListener('toggle', this.onToggle.bind(this), true);
    }

    onToggle(event) {
      const target = event.target;
      if (!target.matches('details') || !target.open) return;

      this.querySelectorAll('details[open]').forEach((details) => {
        if (details !== target) details.removeAttribute('open');
      });
    }
  }

  customElements.define('eh-faq-accordion', EhFaqAccordion);
}
