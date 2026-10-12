/* top.js — minimal behaviour for the upper sections (hero, how it works, start your way).
   Vanilla, no dependencies, no network calls except the user-initiated YouTube iframe. */
(() => {
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  };

  /* Hero "Add Netlify to your coding agent" copy button */
  document.querySelectorAll('.homepage-hero-agent-cta').forEach((btn) => {
    let timer;
    btn.addEventListener('click', async () => {
      if (!(await copyText(btn.dataset.command || ''))) return;
      btn.classList.add('is-copied');
      clearTimeout(timer);
      timer = setTimeout(() => btn.classList.remove('is-copied'), 2000);
    });

    /* dot grid swept by the CSS mask animation */
    const canvas = btn.querySelector('.homepage-hero-agent-cta-dots');
    if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.fillStyle = getComputedStyle(canvas).color;
      const step = 6;
      for (let y = step / 2; y < height; y += step) {
        for (let x = step / 2; x < width; x += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    /* paint only once the sweep actually runs, so a paused/frozen first frame stays clean */
    canvas.addEventListener('animationstart', draw, { once: true });
  });

  /* CLI snippet copy button */
  document.querySelectorAll('.n-cli-copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const code = btn.closest('.n-cli-copy')?.querySelector('code');
      if (code && (await copyText(code.textContent.trim()))) {
        btn.setAttribute('aria-label', 'Copied');
        setTimeout(() => btn.setAttribute('aria-label', 'Copy to clipboard'), 2000);
      }
    });
  });

  /* lite-youtube: poster until clicked, then load the embed */
  document.querySelectorAll('lite-youtube').forEach((el) => {
    const activate = (e) => {
      if (e) e.preventDefault();
      if (el.classList.contains('lyt-activated')) return;
      const id = el.getAttribute('videoid');
      const params = new URLSearchParams(el.getAttribute('params') || '');
      params.set('autoplay', '1');
      params.set('playsinline', '1');
      const iframe = document.createElement('iframe');
      iframe.title = el.dataset.title || 'Play';
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}`;
      el.classList.add('lyt-activated');
      el.append(iframe);
      iframe.focus();
    };
    el.addEventListener('click', activate);
    const play = el.querySelector('.lyt-playbtn');
    if (play) play.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') activate(e); });
  });

  /* Hero dropzone: browse on click/Enter, highlight while dragging. No upload. */
  document.querySelectorAll('.dz-hero').forEach((dz) => {
    const input = dz.querySelector('input[type=file]');
    const browse = () => input && input.click();
    dz.addEventListener('click', browse);
    dz.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); browse(); }
    });
    let depth = 0;
    dz.addEventListener('dragenter', (e) => { e.preventDefault(); depth += 1; dz.classList.add('is-active'); });
    dz.addEventListener('dragover', (e) => e.preventDefault());
    dz.addEventListener('dragleave', () => { depth = Math.max(0, depth - 1); if (!depth) dz.classList.remove('is-active'); });
    dz.addEventListener('drop', (e) => { e.preventDefault(); depth = 0; dz.classList.remove('is-active'); });
  });
})();
