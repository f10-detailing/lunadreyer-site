/* "Call me back" button and form on every page. Sends to the same Web3Forms inbox as the contact form. */
(function () {
  var ACCESS_KEY = "f109b614-c5ff-44ee-867f-0df1f5753f38";
  var css = ".cb-btn{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:60;display:inline-flex;align-items:center;gap:8px;min-height:52px;padding:12px 20px;border:0;border-radius:999px;background:#3d72c4;color:#fff;font:600 1rem Inter,system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.28);cursor:pointer}" +
    ".cb-btn:hover{background:#2f5ea6}.cb-btn svg{flex:0 0 20px}" +
    ".cb-panel{position:fixed;right:16px;bottom:calc(80px + env(safe-area-inset-bottom));z-index:61;width:min(360px,calc(100vw - 32px));background:#fff;color:#111214;border-radius:20px;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,.35);font:400 1rem/1.5 Inter,system-ui,sans-serif}" +
    ".cb-panel[hidden]{display:none}.cb-panel h2{font-size:1.25rem;margin:0 32px 6px 0;font-weight:600;letter-spacing:-.01em}.cb-panel p{margin:0 0 14px;color:#5d6168;font-size:.95rem}" +
    ".cb-panel label{display:block;font-size:.95rem;font-weight:500;margin:10px 0 4px}.cb-panel input,.cb-panel select{width:100%;box-sizing:border-box;min-height:48px;padding:10px 12px;font:inherit;border:1px solid #d8d8d2;border-radius:12px;background:#fff}" +
    ".cb-panel .cb-send{width:100%;min-height:50px;margin-top:16px;border:0;border-radius:999px;background:#3d72c4;color:#fff;font:600 1rem Inter,system-ui,sans-serif;cursor:pointer}.cb-panel .cb-send:disabled{opacity:.6}" +
    ".cb-close{position:absolute;top:12px;right:12px;width:44px;height:44px;border:0;background:transparent;font-size:1.6rem;line-height:1;cursor:pointer;color:#5d6168}" +
    ".cb-hp{position:absolute;left:-9999px;width:1px;height:1px}.cb-status{margin-top:12px;padding:12px 14px;border-radius:12px;background:#e5f1e8;font-size:.95rem}.cb-status.err{background:#f7e4e0}" +
    "@media print{.cb-btn,.cb-panel{display:none}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var phone = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>';
  var btn = document.createElement("button");
  btn.type = "button"; btn.className = "cb-btn"; btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "cb-panel");
  btn.innerHTML = phone + "<span>Call me back</span>";
  var panel = document.createElement("div");
  panel.id = "cb-panel"; panel.className = "cb-panel"; panel.hidden = true; panel.setAttribute("role", "region"); panel.setAttribute("aria-label", "Request a call back");
  panel.innerHTML = '<button type="button" class="cb-close" aria-label="Close">&times;</button>' +
    '<h2>We call you straight away</h2><p>Leave your number and we call you back to talk through your plans.</p>' +
    '<form class="cb-form"><input type="checkbox" name="botcheck" class="cb-hp" tabindex="-1" autocomplete="off">' +
    '<label for="cb-name">Name</label><input id="cb-name" name="name" type="text" required autocomplete="name">' +
    '<label for="cb-phone">Phone</label><input id="cb-phone" name="phone" type="tel" required autocomplete="tel" placeholder="04xx xxx xxx">' +
    '<label for="cb-country">Country <span style="font-weight:400;color:#5d6168">(optional)</span></label><select id="cb-country" name="country"><option value="">Choose</option><option>Italy</option><option>Spain</option><option>Portugal</option><option>Greece</option><option>Cyprus</option><option>Malta</option><option>Germany</option><option>Other</option></select>' +
    '<button type="submit" class="cb-send">Call me back</button></form><p class="cb-status" role="status" aria-live="polite" hidden></p>';
  document.body.appendChild(panel); document.body.appendChild(btn);

  function open(v) { panel.hidden = !v; btn.setAttribute("aria-expanded", v ? "true" : "false"); if (v) { var n = panel.querySelector("#cb-name"); if (n) n.focus(); } }
  btn.addEventListener("click", function () { open(panel.hidden); });
  panel.querySelector(".cb-close").addEventListener("click", function () { open(false); btn.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); } });

  var form = panel.querySelector(".cb-form"), status = panel.querySelector(".cb-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.botcheck.checked) return;
    var data = new FormData(form);
    data.append("access_key", ACCESS_KEY);
    data.append("subject", "CALL BACK NOW: " + form.name.value + " " + form.phone.value + (form.country.value ? " (" + form.country.value + ")" : ""));
    data.append("from_name", "lunadreyer.com.au call back");
    data.append("page", location.href);
    try { var attr = JSON.parse(sessionStorage.getItem("ld_attr") || "null"); if (attr) Object.keys(attr).forEach(function (k) { data.append("attribution_" + k, attr[k]); }); } catch (err) {}
    var send = form.querySelector(".cb-send"); send.disabled = true; send.textContent = "Sending…";
    fetch("https://api.web3forms.com/submit", { method: "POST", headers: { Accept: "application/json" }, body: data })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.success) throw new Error();
        form.hidden = true; status.className = "cb-status"; status.textContent = "Thank you. We call you straight away on " + data.get("phone") + "."; status.hidden = false;
        if (window.gtag) gtag("event", "generate_lead", { form: "callback" });
      })
      .catch(function () { status.className = "cb-status err"; status.textContent = "The request did not go through. Please email mail@lunadreyer.com.au and we reply the same way."; status.hidden = false; send.disabled = false; send.textContent = "Call me back"; });
  });
})();
