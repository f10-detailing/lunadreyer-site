// Remembers where a visitor came from for this browser session only (sessionStorage, no cookies),
// so the enquiry form can include it in the email. First touch wins until the tab is closed.
(function () {
  try {
    var KEY = "ld_attr";
    var store = window.sessionStorage;
    var params = new URLSearchParams(window.location.search);
    var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    var found = {};
    keys.forEach(function (k) {
      var v = params.get(k);
      if (v) found[k] = v.slice(0, 100);
    });

    if (Object.keys(found).length) {
      found.landing = window.location.pathname;
      store.setItem(KEY, JSON.stringify(found));
      return;
    }

    if (!store.getItem(KEY) && document.referrer) {
      var ref = new URL(document.referrer);
      if (ref.hostname && ref.hostname !== window.location.hostname) {
        store.setItem(KEY, JSON.stringify({ referrer: ref.hostname, landing: window.location.pathname }));
      }
    }
  } catch (e) {
    // Attribution is optional; never let it affect the page.
  }
})();
