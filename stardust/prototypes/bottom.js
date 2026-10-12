/* Lower sections: accessible tabs (#section-primitives) and code copy buttons. */
(() => {
  document.querySelectorAll('#section-primitives [data-tabs]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[role=tab]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const select = (tab, focus) => {
      tabs.forEach((t, i) => {
        const on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, true));
      tab.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
  });

  document.querySelectorAll('#section-primitives .code-block .copy-button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const pre = btn.closest('.code-block')?.querySelector('pre');
      if (!pre) return;
      const text = (pre.textContent || '').trim();
      const reset = (cls) => setTimeout(() => {
        btn.classList.remove(cls);
        btn.setAttribute('data-tooltip', 'Copy');
        btn.blur();
      }, 2000);
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('copied');
        btn.setAttribute('data-tooltip', 'Copied!');
        reset('copied');
      } catch {
        btn.classList.add('error');
        btn.setAttribute('data-tooltip', 'Failed to copy!');
        reset('error');
      }
    });
  });
})();
