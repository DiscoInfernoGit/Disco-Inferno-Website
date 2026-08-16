/* ==========================================================================
   DISCO INFERNO — admin customisations for Decap CMS
   1. Live previews that are an exact replica of the real site (same markup as
      js/main.js, same stylesheet as the site).
   2. Loads the site's fonts/CSS into the preview frame.
   Loaded by admin/index.html AFTER decap-cms.js.  Uses `h` (React.createElement)
   and `createClass`, both exposed on window by Decap.
   ========================================================================== */
(function () {
  'use strict';
  if (!window.CMS) return;

  // Style the preview pane like the site itself.
  CMS.registerPreviewStyle('/css/styles.css');
  CMS.registerPreviewStyle('/admin/preview.css');

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function parseDate(str) { // same rule as js/main.js: "YYYY-MM-DD", local time
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(str || ''));
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function get(map, key, fallback) { var v = map && map.get ? map.get(key) : undefined; return (v === undefined || v === null) ? fallback : v; }
  function safeUrl(u) { u = String(u || '').trim(); return /^(https?:\/\/|\/|mailto:|tel:)/i.test(u) ? u : '#'; }

  /* Draft uploads: Decap sometimes asks for a freshly-uploaded image a beat before it registers the
     draft, caches the miss, and keeps showing the final (not-yet-published) URL — which 404s until
     Publish. The entry's own mediaFiles list has the temporary blob URL though, so use that first. */
  var draftUrls = {};   // basename -> blob url (shared with the thumbnail fixer below)
  function basename(p) { return String(p || '').split('?')[0].split('#')[0].split('/').pop(); }
  function resolveImage(entry, getAsset, value) {
    if (!value) return '';
    var name = basename(value);
    try {
      var mf = entry && entry.get && entry.get('mediaFiles');
      if (mf && mf.forEach) {
        mf.forEach(function (f) {
          if (!f || !f.get) return;
          var url = f.get('url') || f.get('displayURL');
          if (!url && f.get('file')) { try { url = URL.createObjectURL(f.get('file')); } catch (e) {} }
          if (url && typeof url === 'string') draftUrls[basename(f.get('path') || f.get('name'))] = url;
        });
      }
    } catch (e) {}
    if (draftUrls[name] && String(draftUrls[name]).indexOf('blob:') === 0) return draftUrls[name];
    try { var a = getAsset(value); return a ? String(a) : String(value); } catch (e) { return String(value); }
  }

  /* ---------- Event card: identical structure to the live Events page ---------- */
  function EventCard(props) {
    var ev = props.ev, getAsset = props.getAsset;
    var title = get(ev, 'title', '');
    var d = parseDate(get(ev, 'date', ''));
    var time = get(ev, 'time', '');
    var desc = get(ev, 'description', '');
    var image = get(ev, 'image', '');
    var link = get(ev, 'ticket_link', '');
    var linkText = get(ev, 'ticket_text', '') || 'Buy Tickets';
    var isPast = d && d < today();

    var imgSrc = image ? resolveImage(props.entry, getAsset, image) : '';

    var when = d ? (DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + (time ? ' · ' + time : '')) : (time || 'Pick a date');

    var descLines = String(desc).split('\n');
    var descNodes = [];
    descLines.forEach(function (line, i) { if (i) descNodes.push(h('br', { key: 'br' + i })); descNodes.push(line); });

    return h('div', { className: 'pv-event-wrap' + (isPast ? ' pv-is-past' : '') },
      h('article', { className: 'event reveal is-in' },
        h('div', { className: 'event__img' + (imgSrc ? '' : ' event__img--empty') },
          imgSrc ? h('img', { src: imgSrc, alt: title + ' flyer' }) : h('div', { className: 'event__img--empty', 'aria-hidden': 'true' }, '🪩'),
          d ? h('div', { className: 'event__date' }, h('small', {}, MONTHS[d.getMonth()]), h('b', {}, d.getDate())) : null
        ),
        h('div', { className: 'event__body' },
          h('h3', {}, title || h('span', { className: 'pv-placeholder' }, 'Event name')),
          h('div', { className: 'event__meta' }, when),
          desc ? h('p', {}, descNodes) : null,
          link ? h('a', { className: 'btn btn--sm btn--gold', href: safeUrl(link), target: '_blank', rel: 'noopener', onClick: function (e) { e.preventDefault(); } }, linkText) : null
        )
      ),
      isPast ? h('div', { className: 'pv-note pv-note--warn' }, '⚠ This date has passed — the site hides this event automatically. It stays in the list here so you can re-use or delete it.') : null,
      (!link) ? h('div', { className: 'pv-note' }, 'Tip: add a ticket link and the gold “' + linkText + '” button appears.') : null
    );
  }

  var EventsPreview = createClass({
    render: function () {
      var entry = this.props.entry, getAsset = this.props.getAsset;
      var list = entry.getIn(['data', 'events']);
      var items = list && list.toArray ? list.toArray() : [];
      var upcoming = items.filter(function (ev) { var d = parseDate(get(ev, 'date', '')); return d && d >= today(); });

      return h('div', { className: 'pv' },
        h('div', { className: 'pv-head' },
          h('span', { className: 'eyebrow' }, 'Live preview'),
          h('h2', {}, 'How this looks on the ', h('span', { className: 'accent grad-text' }, 'Events'), ' page'),
          h('p', { className: 'lede' }, upcoming.length + ' upcoming event' + (upcoming.length === 1 ? '' : 's') + ' will show on the site' + (items.length > upcoming.length ? ' · ' + (items.length - upcoming.length) + ' past (hidden)' : '') + '.')
        ),
        items.length
          ? h('div', { className: 'events pv-events' }, items.map(function (ev, i) { return h(EventCard, { key: i, ev: ev, getAsset: getAsset, entry: entry }); }))
          : h('div', { className: 'events-empty is-on' }, 'No special events posted right now — check back soon, or follow @discoinfernowindsor for announcements.')
      );
    }
  });

  /* ---------- Announcement banner: identical to the bar on the live site ---------- */
  var BannerPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var a = entry.getIn(['data', 'announcement']);
      var enabled = !!get(a, 'enabled', false);
      var text = get(a, 'text', '');
      var link = get(a, 'link', '');
      var linkText = get(a, 'link_text', '') || 'Learn more';

      var bar = h('div', { className: 'announce is-on pv-announce' },
        h('div', { className: 'announce__inner' },
          h('span', {}, text || h('span', { className: 'pv-placeholder' }, 'Your announcement text…')),
          link ? h('a', { href: safeUrl(link), onClick: function (e) { e.preventDefault(); } }, linkText + ' →') : null,
          h('button', { className: 'announce__close', type: 'button', 'aria-label': 'Dismiss announcement' }, '×')
        )
      );

      return h('div', { className: 'pv' },
        h('div', { className: 'pv-head' },
          h('span', { className: 'eyebrow' }, 'Live preview'),
          h('h2', {}, 'The ', h('span', { className: 'accent grad-text' }, 'announcement'), ' bar'),
          h('p', { className: 'lede' }, enabled ? 'Shown at the very top of every page, above the menu.' : 'Currently OFF — nothing shows on the site. Flip “Show the banner?” to turn it on.')
        ),
        h('div', { className: 'pv-site-frame' + (enabled ? '' : ' pv-dim') },
          bar,
          h('div', { className: 'pv-fake-nav' },
            h('img', { src: '/assets/img/logo-disco-inferno-ball.png', alt: '', height: 44 }),
            h('span', { className: 'pv-fake-links' }, 'Home · Events · Bottle Service · Reservations · Birthdays · Venue'),
            h('span', { className: 'btn btn--sm' }, 'Tickets')
          ),
          h('div', { className: 'pv-fake-hero' }, h('span', {}, 'Windsor’s ', h('span', { className: 'accent grad-text' }, 'Retro'), ' Dance Bar'))
        ),
        !enabled && text ? h('div', { className: 'pv-note' }, 'The text is saved but hidden while the banner is off.') : null
      );
    }
  });

  /* Fix the form's own thumbnail when it hits the same Decap miss: swap in the draft blob, else a friendly placeholder. */
  var PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="100%" height="100%" rx="14" fill="#261440"/><text x="50%" y="44%" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="15" font-weight="700" fill="#ffc53d">Flyer uploaded ✓</text><text x="50%" y="64%" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="12" fill="#d9c8e6">Shows here and on the site once you Publish</text></svg>');
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG' || img.dataset.diFixed) return;
    if (!img.closest('[class*="ImageWrapper"], [class*="FileWidget"], [class*="ImageControl"]')) return;
    img.dataset.diFixed = '1';
    var alt = draftUrls[basename(img.src)];
    img.src = (alt && alt.indexOf('blob:') === 0) ? alt : PLACEHOLDER;
    if (!alt) img.title = 'Uploaded — will appear after you Publish';
  }, true);

  CMS.registerPreviewTemplate('events', EventsPreview);
  CMS.registerPreviewTemplate('site', BannerPreview);
})();
