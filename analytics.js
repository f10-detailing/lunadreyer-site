// Google Analytics 4 for lunadreyer.com.au.
// Paste the Measurement ID from Google Analytics (Admin > Data streams) below, e.g. "G-ABC123XYZ".
// While it is empty, nothing is loaded and no data is sent.
(function () {
  "use strict";

  var GA_ID = "";

  // Pages call window.ldtTrack(...) on key actions; it is a no-op until GA_ID is set.
  window.ldtTrack = function () {};
  if (!GA_ID) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);

  window.ldtTrack = function (name, params) { gtag("event", name, params || {}); };

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
  document.head.appendChild(s);
})();
