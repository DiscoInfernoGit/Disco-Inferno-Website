/* ==========================================================================
   DISCO INFERNO — site scripts (no dependencies)
   - sticky nav / mobile drawer
   - scroll reveal
   - lazy background videos (respect prefers-reduced-motion)
   - announcement banner (from /content/site.json — edited in /admin)
   - upcoming events (from /content/events.json — edited in /admin), past events auto-hide
   - visual-only forms (show a friendly notice instead of submitting)
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav / drawer ---------- */
  var burger = document.querySelector('.nav__burger');
  var drawer = document.querySelector('.drawer');
  if (burger && drawer) {
    var setOpen = function (open) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { var nav = document.querySelector('.nav'); drawer.style.paddingTop = (nav ? nav.getBoundingClientRect().bottom + 16 : 96) + 'px'; }
      drawer.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () { setOpen(burger.getAttribute('aria-expanded') !== 'true'); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    window.matchMedia('(min-width: 1000px)').addEventListener('change', function (e) { if (e.matches) setOpen(false); });
  }

  /* Mark current page in nav */
  var path = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav__links a, .drawer a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    var norm = href.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    if (norm === path || (path === '' && norm === '/')) a.setAttribute('aria-current', 'page');
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Lazy background videos ---------- */
  var vids = document.querySelectorAll('video[data-src]');
  if (vids.length) {
    var loadVideo = function (v) {
      if (v.dataset.loaded) return;
      v.dataset.loaded = '1';
      var s = document.createElement('source');
      s.src = v.dataset.src; s.type = 'video/mp4';
      v.appendChild(s);
      v.load();
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    };
    if (reduceMotion) {
      // Leave the poster image only — no motion.
      vids.forEach(function (v) { v.removeAttribute('autoplay'); });
    } else if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) { loadVideo(v); if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
          else if (!v.paused) { v.pause(); }
        });
      }, { rootMargin: '200px 0px' });
      vids.forEach(function (v) { vio.observe(v); });
    } else {
      vids.forEach(loadVideo);
    }
  }

  /* ---------- Helpers ---------- */
  function getJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + url); return r.json(); });
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function safeUrl(u) { u = String(u || '').trim(); return /^(https?:\/\/|\/|mailto:|tel:)/i.test(u) ? u : '#'; }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function parseDate(str) { // "YYYY-MM-DD" (local time, no timezone shift)
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(str || ''));
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3]);
  }

  /* ---------- Announcement banner ---------- */
  var announce = document.querySelector('.announce');
  if (announce) {
    getJSON('/content/site.json').then(function (site) {
      var a = site && site.announcement;
      if (!a || !a.enabled || !a.text) return;
      var key = 'di-announce-' + (a.text + '|' + (a.link || '')).length + '-' + (a.text || '').slice(0, 24);
      try { if (sessionStorage.getItem(key)) return; } catch (e) {}
      var inner = announce.querySelector('.announce__inner');
      var html = '<span>' + esc(a.text) + '</span>';
      if (a.link) html += ' <a href="' + esc(safeUrl(a.link)) + '"' + (/^https?:/i.test(a.link) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(a.link_text || 'Learn more') + ' →</a>';
      html += '<button class="announce__close" type="button" aria-label="Dismiss announcement">×</button>';
      inner.innerHTML = html;
      announce.classList.add('is-on');
      inner.querySelector('.announce__close').addEventListener('click', function () {
        announce.classList.remove('is-on');
        try { sessionStorage.setItem(key, '1'); } catch (e) {}
      });
    }).catch(function () {});
  }

  /* ---------- Upcoming events ---------- */
  var eventLists = document.querySelectorAll('[data-events]');
  if (eventLists.length) {
    getJSON('/content/events.json').then(function (data) {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var events = (data && data.events || []).map(function (ev) { ev._d = parseDate(ev.date); return ev; })
        .filter(function (ev) { return ev._d && ev._d >= today; })   // past events auto-hide
        .sort(function (a, b) { return a._d - b._d; });

      eventLists.forEach(function (list) {
        var limit = parseInt(list.getAttribute('data-events-limit') || '0', 10);
        var shown = limit ? events.slice(0, limit) : events;
        var empty = document.querySelector(list.getAttribute('data-events-empty') || '#events-empty');
        var wrap = list.closest('[data-events-section]');
        if (!shown.length) {
          list.innerHTML = '';
          if (empty) empty.classList.add('is-on');
          if (wrap && wrap.hasAttribute('data-events-hide-if-empty')) wrap.hidden = true;
          return;
        }
        list.innerHTML = shown.map(function (ev, i) {
          var d = ev._d;
          var when = DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + (ev.time ? ' · ' + esc(ev.time) : '');
          var img = ev.image ? '<img src="' + esc(safeUrl(ev.image)) + '" alt="' + esc(ev.title) + ' flyer" loading="lazy">' : '<div class="event__img--empty" aria-hidden="true">🪩</div>';
          var link = ev.ticket_link ? '<a class="btn btn--sm btn--gold" href="' + esc(safeUrl(ev.ticket_link)) + '" target="_blank" rel="noopener">' + esc(ev.ticket_text || 'Buy Tickets') + '</a>' : '';
          return '<article class="event reveal is-in" data-delay="' + (i % 3) + '">' +
            '<div class="event__img' + (ev.image ? '' : ' event__img--empty') + '">' + img +
            '<div class="event__date"><small>' + MONTHS[d.getMonth()] + '</small><b>' + d.getDate() + '</b></div></div>' +
            '<div class="event__body"><h3>' + esc(ev.title) + '</h3><div class="event__meta">' + when + '</div>' +
            (ev.description ? '<p>' + esc(ev.description).replace(/\n/g, '<br>') + '</p>' : '') + link + '</div></article>';
        }).join('');
      });
    }).catch(function () {
      eventLists.forEach(function (list) {
        var empty = document.querySelector(list.getAttribute('data-events-empty') || '#events-empty');
        if (empty) empty.classList.add('is-on');
      });
    });
  }

  /* ---------- Visual-only forms ----------
     TODO for whoever wires these up later: these forms do NOT send anywhere yet.
     Options: Netlify Forms (add `data-netlify="true"` + `name` attrs and remove the JS below for that form),
     Formspree, or a mailto handler. See HANDOVER.md → "Forms". */
  document.querySelectorAll('form[data-visual-only]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var notice = document.querySelector(form.getAttribute('data-notice') || '#form-notice');
      if (notice) { notice.classList.add('is-on'); notice.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }); }
      form.querySelectorAll('input, select, textarea, button').forEach(function (el) { el.disabled = true; });
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
