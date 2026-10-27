/* Loads card photos only when they are about to scroll into view. */
(function () {
  var els = document.querySelectorAll('[data-lazy-img]');
  function show(el) { el.style.setProperty('--img', "url('" + el.getAttribute('data-lazy-img') + "')"); el.removeAttribute('data-lazy-img'); }
  if (!('IntersectionObserver' in window)) { for (var i = 0; i < els.length; i++) show(els[i]); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
  }, { rootMargin: '400px 0px' });
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
})();
