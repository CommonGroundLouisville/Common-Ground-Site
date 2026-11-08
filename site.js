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

  // "Take a look" badge follows the pointer over each space photo (mouse and trackpad only).
  if (matchMedia('(hover: hover) and (pointer: fine)').matches){
    document.querySelectorAll('.card .ph').forEach(function(ph){
      var peek = ph.querySelector('.peek');
      ph.addEventListener('pointermove', function(e){
        var r = ph.getBoundingClientRect();
        peek.style.transform = 'translate(' + (e.clientX - r.left) + 'px,' + (e.clientY - r.top) + 'px)';
        peek.classList.add('live');
      });
      ph.addEventListener('pointerleave', function(){ peek.classList.remove('live'); });
    });
  }
})();
