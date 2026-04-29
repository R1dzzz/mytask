/**
 * theme.js — Dark / Light Mode System
 * - Default: dark mode
 * - Toggle via .light-theme pada <body>
 * - Swap logo sumber: lobehub dark↔light, simpleicons warna putih→gelap
 * - Preferensi disimpan di localStorage
 */
(function () {
  const STORAGE_KEY = 'mytask-theme';
  const LIGHT_CLASS = 'light-theme';

  /* ── Logo swap map ──────────────────────────────────────────
     Key   = substring yang dicari di src
     value = { dark: url_gelap, light: url_terang }
     Untuk logo lobehub: /dark/ ↔ /light/
     Untuk simpleicons putih (ffffff): ganti warna ke gelap
  ──────────────────────────────────────────────────────────── */
  const LOGO_SWAP = [
    // Lobehub — ada varian /dark/ dan /light/
    { match: /lobehub.*\/dark\/([\w-]+\.png)/,  type: 'lobehub' },

    // Simpleicons yang pakai warna putih — ganti ke warna gelap
    { match: /simpleicons\.org\/midjourney\/ffffff/, light: 'https://cdn.simpleicons.org/midjourney/111111' },
    { match: /simpleicons\.org\/notion\/ffffff/,    light: 'https://cdn.simpleicons.org/notion/111111' },
    { match: /simpleicons\.org\/runway\/ffffff/,    light: 'https://cdn.simpleicons.org/runway/111111' },
    { match: /simpleicons\.org\/capcut\/ffffff/,    light: 'https://cdn.simpleicons.org/capcut/111111' },
    { match: /simpleicons\.org\/descript\/A020F0/,  light: 'https://cdn.simpleicons.org/descript/7c3aed' },
  ];

  /** Kembalikan src asli (dark) dari data attribute */
  function getOriginalSrc(img) {
    return img.dataset.srcDark || img.src;
  }

  /** Terapkan src yang benar sesuai mode ke semua logo */
  function applyLogos(isLight) {
    document.querySelectorAll('.app-logo img, .pres-tool-icon img').forEach(function (img) {
      // Simpan src dark original pertama kali
      if (!img.dataset.srcDark) {
        img.dataset.srcDark = img.src;
      }

      var originalSrc = img.dataset.srcDark;

      if (!isLight) {
        // Kembali ke dark
        img.src = originalSrc;
        return;
      }

      // === Light mode: coba setiap rule ===

      // 1. Lobehub: swap /dark/ → /light/
      var lobehubMatch = originalSrc.match(/lobehub[^"']*(\/dark\/)([\w.-]+)/);
      if (lobehubMatch) {
        img.src = originalSrc.replace('/dark/', '/light/');
        return;
      }

      // 2. Simpleicons putih → versi gelap
      for (var i = 0; i < LOGO_SWAP.length; i++) {
        var rule = LOGO_SWAP[i];
        if (rule.light && rule.match.test(originalSrc)) {
          img.src = rule.light;
          return;
        }
      }

      // Tidak ada rule → biarkan (logo berwarna seperti Canva, Gemini, dsb sudah oke)
    });
  }

  /** Terapkan tema ke <body> */
  function applyTheme(isLight) {
    if (isLight) {
      document.body.classList.add(LIGHT_CLASS);
    } else {
      document.body.classList.remove(LIGHT_CLASS);
    }
    // Swap logo setelah class diterapkan
    applyLogos(isLight);
  }

  /** Simpan preferensi */
  function saveTheme(isLight) {
    try { localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark'); } catch (_) {}
  }

  /** Baca preferensi */
  function loadTheme() {
    try { return localStorage.getItem(STORAGE_KEY) === 'light'; } catch (_) { return false; }
  }

  /** Toggle */
  function toggleTheme() {
    var isLight = !document.body.classList.contains(LIGHT_CLASS);
    applyTheme(isLight);
    saveTheme(isLight);
  }

  /* ── Init ── */
  var savedIsLight = loadTheme();
  // Terapkan class SEBELUM DOMContentLoaded untuk anti-flash
  if (savedIsLight) document.body.classList.add(LIGHT_CLASS);

  document.addEventListener('DOMContentLoaded', function () {
    // Pasang toggle button
    var btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggleTheme);

    // Terapkan logo swap setelah DOM siap
    applyLogos(savedIsLight);
  });
})();
