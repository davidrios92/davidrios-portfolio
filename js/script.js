/* David E. Rios — portfolio
   Vanilla replacement for the Design-canvas DCLogic component:
   rotating case tabs + a São Paulo clock. */

(function () {
  'use strict';

  var ROTATE_MS = 8000;
  var CLOCK_MS  = 15000;

  /* ---------- case tabs ---------- */

  var tabs   = Array.prototype.slice.call(document.querySelectorAll('.case-tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.case-panel'));
  var timer  = null;
  var active = 0;

  function show(i) {
    active = (i + tabs.length) % tabs.length;
    tabs.forEach(function (tab, n) {
      var on = n === active;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      if (on) {
        // restart the 8s fill animation even if the same tab is re-picked
        var fill = tab.querySelector('.case-tab__fill');
        if (fill) {
          fill.style.animation = 'none';
          void fill.offsetWidth;
          fill.style.animation = '';
        }
      }
    });
    panels.forEach(function (panel, n) {
      panel.hidden = n !== active;
    });
  }

  function start() {
    stop();
    timer = setInterval(function () { show(active + 1); }, ROTATE_MS);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      show(i);
      start();
    });
    tab.addEventListener('keydown', function (e) {
      var delta = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1
                : e.key === 'ArrowUp'   || e.key === 'ArrowLeft'  ? -1 : 0;
      if (!delta) return;
      e.preventDefault();
      show(active + delta);
      tabs[active].focus();
      start();
    });
  });

  if (tabs.length) {
    show(0);
    start();
    // don't rotate under the reader's feet while they're reading a panel
    var cases = document.querySelector('.cases');
    if (cases) {
      cases.addEventListener('mouseenter', stop);
      cases.addEventListener('mouseleave', start);
      cases.addEventListener('focusin', stop);
      cases.addEventListener('focusout', start);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });
  }

  /* ---------- clock ---------- */

  var clockEl = document.querySelector('[data-clock]');

  function tickClock() {
    if (!clockEl) return;
    var t;
    try {
      t = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit'
      });
    } catch (err) {
      t = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    clockEl.textContent = t + ' BRT';
  }

  if (clockEl) {
    tickClock();
    setInterval(tickClock, CLOCK_MS);
  }
})();
