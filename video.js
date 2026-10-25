/* Starts muted background videos only when motion is welcome, and reveals each one once it plays. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('video[data-bg]').forEach(function (v) {
    if (reduce) { v.remove(); return; }
    v.addEventListener('playing', function () { v.classList.add('is-playing'); });
    v.addEventListener('error', function () { v.remove(); }, true);
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  });
})();
