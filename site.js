// Count the stats up once when they scroll into view. The final numbers are in the HTML, so the page reads correctly without this.
(function(){
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = document.querySelectorAll('[data-count]');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      var el = e.target, to = +el.dataset.count, from = +(el.dataset.from || 0);
      var pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', t0 = performance.now(), dur = 1100;
      (function tick(t){
        var p = Math.min(1, (t - t0) / dur), v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        el.textContent = pre + v + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, {threshold: .6});
  els.forEach(function(el){ io.observe(el); });
})();

// Ahmad-style motion. Everything below only hides content after the script runs, so the page reads fine without it.
(function(){
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Letter-by-letter headings: split text into letters (kept inside word wrappers so lines break normally).
  function splitNode(node, counter){
    Array.from(node.childNodes).forEach(function(n){
      if (n.nodeType === 3){
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(part){
          if (!part) return;
          if (/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(' ')); return; }
          var wd = document.createElement('span'); wd.className = 'wd';
          Array.from(part).forEach(function(c){
            var ch = document.createElement('span'); ch.className = 'ch'; ch.textContent = c;
            ch.style.setProperty('--i', counter.n++); wd.appendChild(ch);
          });
          frag.appendChild(wd);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1){ splitNode(n, counter); }
    });
  }
  var heads = document.querySelectorAll('h2.split');
  var hio = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ hio.unobserve(e.target); e.target.classList.add('on'); } });
  }, {threshold: .4});
  heads.forEach(function(h){
    h.setAttribute('aria-label', h.textContent);
    splitNode(h, {n:0});
    Array.from(h.children).forEach(function(c){ c.setAttribute('aria-hidden','true'); });
    h.classList.add('armed');
    hio.observe(h);
  });

  // Statement words fill in as the card scrolls through the screen.
  var fill = document.querySelector('.fill');
  if (fill){
    var words = [];
    (function wrap(node, amber){
      Array.from(node.childNodes).forEach(function(n){
        if (n.nodeType === 3){
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(part){
            if (!part) return;
            if (/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w' + (amber ? ' am' : ''); w.textContent = part;
            words.push(w); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1){ wrap(n, amber || n.classList.contains('am')); }
      });
    })(fill, false);
    fill.classList.add('armed');
    var ticking = false;
    function paint(){
      ticking = false;
      var r = fill.getBoundingClientRect(), vh = innerHeight;
      var p = Math.max(0, Math.min(1, (vh * .85 - r.top) / (r.height + vh * .45)));
      var n = Math.round(p * words.length);
      words.forEach(function(w, i){ w.classList.toggle('lit', i < n); });
    }
    addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(paint); } }, {passive:true});
    paint();
  }

  // Photo cards open a membership card with "Add to cart" buttons.
  // Checkout links live here so they can be swapped in one place once Nexudus / Zoho Bookings links arrive.
  // url: null shows a "Reach out to us" email button until a checkout link exists.
  var STORE = 'https://commongroundky.nexudus.site/en/store?product_id='; // Nexudus store products
  var TOUR = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3lrOQ2x_zp0duYf03Wbk9lnb35sqgY8bSXdhOOogKYwSFaO0CLp2aWV935guRgVqcSIPBCiN97';
  var BOOK = 'https://louisvillepodcast.studio/book-now'; // old site, swap before launch
  var EMAIL = { cg: 'info@ourcommonground.co', pod: 'team@louisvillepodcast.studio' };
  var TIERS = {
    'side-hustle':  { name: 'Side Hustle', price: '$299', per: '/mo', inc: '8 coworking days a month', url: STORE + '1415528030' },
    'daily-grind':  { name: 'Daily Grind', price: '$499', per: '/mo', inc: 'Unlimited 24/7, offices and meeting rooms included', url: STORE + '1415528029' },
    'teams':        { name: 'Strength in Numbers', price: 'Teams', per: '', inc: 'Shared access for your whole team', url: 'mailto:info@ourcommonground.co?subject=Team%20membership', cta: 'Talk to us' },
    'day-pass':     { name: 'All Day Pass', price: '$49', per: '/day', inc: 'One full day of coworking', url: STORE + '1415231042', cta: 'Buy a pass' },
    'day-pack':     { name: '5 Day Pass Pack', price: '5', per: ' days', inc: 'Five full days, use them when you like', url: STORE + '1415409868', cta: 'Buy a pack' },
    'meeting-room': { name: 'Meeting room', price: '$150', per: '/hour', inc: 'For non-members, by availability', url: null, ask: 'cg' },
    'event':        { name: 'Event inquiry', price: 'Ask', per: '', inc: 'Tell us your date and headcount', url: 'mailto:info@ourcommonground.co?subject=Event%20inquiry', cta: 'Ask us' },
    'pod-standard': { name: 'Standard recording', price: '$249', per: '/hour', inc: 'Raw recording, no editing', url: BOOK },
    'pod-basic':    { name: 'Basic Editing', price: '$299', per: '/hour', inc: 'Recording plus a clean edit', url: BOOK },
    'pod-premium':  { name: 'Premium Editing', price: '$349', per: '/hour', inc: 'Edit plus a custom intro', url: BOOK }
  };
  var OFFERS = {
    'open-coworking':  { lead: 'Grab any open seat. Every membership includes it.', tiers: ['side-hustle', 'daily-grind', 'day-pass', 'day-pack'] },
    'private-offices': { lead: 'Private offices at no extra cost on Daily Grind and up.', tiers: ['daily-grind', 'teams'] },
    'meeting-rooms':   { lead: 'Free for Daily Grind members. Everyone else rents by the hour.', tiers: ['daily-grind', 'meeting-room'] },
    'event-space':     { lead: 'Host a workshop, launch or meetup with us.', tiers: ['event', 'daily-grind'] },
    'kitchen-lounge':  { lead: 'Coffee, kitchen and lounge seats for every member.', tiers: ['side-hustle', 'daily-grind', 'day-pass', 'day-pack'] },
    'podcast-studio':  { lead: 'Record in the building with our crew.', label: 'Studio pricing', tiers: ['pod-standard', 'pod-basic', 'pod-premium'], more: ['podcast.html#pricing', 'See all studio pricing →'] },
    'pod-record':      { label: 'Studio pricing', lead: 'Video and audio in a fully set studio.', tiers: ['pod-standard', 'pod-basic', 'pod-premium'], more: ['#pricing', 'See all studio pricing →'] },
    'pod-film':        { label: 'Studio pricing', lead: 'Multiple camera angles, lit and ready.', tiers: ['pod-standard', 'pod-basic', 'pod-premium'], more: ['#pricing', 'See all studio pricing →'] },
    'pod-edit':        { label: 'Studio pricing', lead: 'Full episodes or social clips, edited for you.', tiers: ['pod-basic', 'pod-premium'], more: ['#pricing', 'See all studio pricing →'] },
    'networking':      { lead: 'Members come free and can bring guests.', tiers: ['side-hustle', 'daily-grind'] },
    'workshops':       { lead: 'Trainings and talks with member pricing.', tiers: ['side-hustle', 'daily-grind'] },
    'lounge-days':     { lead: 'Drop in for the day or make it a habit.', tiers: ['day-pass', 'day-pack', 'side-hustle', 'daily-grind'] }
  };
  var cards = document.querySelectorAll('.card[data-offer]');
  if (cards.length){
    var dlg = document.createElement('dialog');
    dlg.className = 'offer';
    dlg.setAttribute('aria-labelledby', 'offer-title');
    document.body.appendChild(dlg);
    function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
    function open(card){
      var o = OFFERS[card.dataset.offer]; if (!o) return;
      var img = card.querySelector('img'), title = card.querySelector('h3').textContent;
      var rows = o.tiers.map(function(k){
        var t = TIERS[k];
        var btn = t.url ? '<a class="btn primary" href="' + t.url + '">' + (t.cta || 'Add to cart') + ' <span class="ar">→</span></a>'
                        : '<a class="btn ghost" href="mailto:' + EMAIL[t.ask || 'cg'] + '?subject=' + encodeURIComponent(t.name) + '">Reach out to us</a>';
        return '<li><div class="tn"><b>' + esc(t.name) + '</b><span>' + esc(t.inc) + '</span></div><div class="tp">' + esc(t.price) + '<small>' + t.per + '</small></div>' + btn + '</li>';
      }).join('');
      dlg.innerHTML = '<div class="offer-ph"><img src="' + img.getAttribute('src') + '" alt=""></div>' +
        '<div class="offer-body"><button class="offer-x" type="button" aria-label="Close">×</button>' +
        '<span class="label">' + (o.label || 'Memberships') + '</span><h3 id="offer-title">' + esc(title) + '</h3><p>' + esc(o.lead) + '</p>' +
        '<ul class="offer-tiers">' + rows + '</ul>' + (o.more ? '<a class="offer-more" href="' + o.more[0] + '">' + o.more[1] + '</a>' : '') + '</div>';
      dlg.showModal();
    }
    dlg.addEventListener('click', function(e){ if (e.target === dlg || e.target.closest('.offer-x') || e.target.closest('.offer-more')) dlg.close(); });
    cards.forEach(function(card){
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-haspopup', 'dialog');
      card.addEventListener('click', function(e){ if (!e.target.closest('a')) open(card); });
      card.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(card); } });
    });
  }
})();
