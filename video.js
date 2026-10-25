/* Starts muted background videos only when motion is welcome and the connection can take it,
   and reveals each one once it plays. On phones and data saver the photo shows instead. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
  var save = navigator.connection && navigator.connection.saveData;
  document.querySelectorAll('video[data-bg]').forEach(function (v) {
    if (reduce || small || save) { v.remove(); return; }
    v.addEventListener('playing', function () { v.classList.add('is-playing'); });
    v.addEventListener('error', function () { v.remove(); }, true);
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  });
})();
