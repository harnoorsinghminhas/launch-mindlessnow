/* Mindless Now: sign-up core. No innerHTML: runs under require-trusted-types-for 'script'. */
(function () {
"use strict";
var API = "https://acp9reat3l.execute-api.us-east-1.amazonaws.com/signal/request-link";
var SITE = "mindlessnow.com";
var LANDING_RE = /^\/[A-Za-z0-9._~!$&'()*+,;=:@%\/-]{0,199}$/;
var EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function validEmail(v) { return v.length <= 254 && EMAIL_RE.test(v); }
function payload(email, hp) {
  // The request-link schema is strict: only email, hp, site, landing_path, tz, query are sent.
  var b = { email: email, hp: hp || "", site: SITE };
  if (LANDING_RE.test(location.pathname)) b.landing_path = location.pathname;
  try { var tz = Intl.DateTimeFormat().resolvedOptions().timeZone; if (tz && tz.length <= 40) b.tz = tz; } catch (e) { /* the API falls back */ }
  var q = location.search;
  if (q && q.length <= 2048 && /[?&](utm_[a-z]+|ref)=/i.test(q)) b.query = q;
  return b;
}
function post(body) {
  var ctl = window.AbortController ? new AbortController() : null, timer = ctl ? window.setTimeout(function () { ctl.abort(); }, 15000) : 0;
  return fetch(API, { method: "POST", mode: "cors", credentials: "omit", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctl ? ctl.signal : undefined })
    .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { window.clearTimeout(timer); return { status: r.status, code: j && j.error }; }); },
          function () { window.clearTimeout(timer); return { status: 0, code: "network" }; });
}
function errText(res) {
  var s = res.status, c = res.code;
  if (s === 400 && c === "invalid_email") return "That email address doesn't look right. Check it for a typo?";
  if (s === 400) return "Something in the form didn't go through. Please try again.";
  if (s === 415) return "Your browser sent the form in a format we can't read. Refresh the page and try again.";
  if (s === 429) return "Lots of sign-ups from your network just now. Wait a minute, then try again.";
  if (s === 403) return "Sign-up only works on our own site. Open mindlessnow.com and try again.";
  if (s >= 500) return "Our sign-up desk hit a snag. Please try again in a moment.";
  return "We couldn't reach the sign-up desk. Check your connection and try again.";
}
function el(tag, attrs, kids) {
  var n = document.createElement(tag);
  Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
  (kids || []).forEach(function (c) { n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
  return n;
}
$$(".js-join").forEach(function (form) {
  var em = $('input[type="email"]', form), hp = $('input[name="website"]', form), err = $(".js-err", form);
  var btn = $('button[type="submit"]', form), flow = $(".js-flow", form.parentNode), busy = false;
  em.addEventListener("blur", function () {   // inline validation on blur, never only on submit
    var v = em.value.trim();
    if (v && !validEmail(v)) { err.textContent = "That email address doesn't look right yet."; em.setAttribute("aria-invalid", "true"); }
    else { err.textContent = ""; em.removeAttribute("aria-invalid"); }
  });
  em.addEventListener("input", function () { if (em.getAttribute("aria-invalid") && validEmail(em.value.trim())) { err.textContent = ""; em.removeAttribute("aria-invalid"); } });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (busy) return;
    var v = em.value.trim();
    if (!validEmail(v)) { err.textContent = "Please enter your email address, like name@example.com."; em.setAttribute("aria-invalid", "true"); em.focus(); return; }
    busy = true; btn.disabled = true; var label = btn.textContent; btn.textContent = "Sending…"; err.textContent = "";
    post(payload(v, hp ? hp.value : "")).then(function (res) {
      busy = false; btn.disabled = false; btn.textContent = label;
      if (res.status === 200) {
        form.hidden = true; flow.hidden = false;
        while (flow.firstChild) flow.removeChild(flow.firstChild);
        var h = el("h3", { tabindex: "-1" }, ["You're in the preview."]);
        flow.appendChild(h);
        flow.appendChild(el("p", { role: "status" }, ["Check your inbox: we sent a link to confirm ", el("b", {}, [v]), ". Tap it and you're on the list for the first pause. We're still building, so you'll hear from us when the first pause is ready."]));
        h.focus();
        return;
      }
      err.textContent = errText(res);
      if (res.code === "invalid_email") { em.setAttribute("aria-invalid", "true"); em.focus(); }
    });
  });
});
var y = $(".js-year"); if (y) y.textContent = String(new Date().getFullYear());
window.MN = { $: $, $$: $$, el: el, reduce: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches };
})();


(function(){
var S=[
"Close the tab you do not need. Put both feet on the floor. One slow breath in, a longer one out. You do not have to be ready. You only have to be here. Now open the meeting.",
"The answer will wait. Look away from the screen for ten slow seconds. Notice the room: a sound, a colour, the chair under you. Your own thinking is still yours. Return when you choose.",
"The day does not need one more reply. Say goodbye to the work, out loud, in one sentence. Shoulders down. Close the lid. The next thing is only the next thing.",
"Put the screen face down. Let the last prompt be the last one. Breathe out slower than you breathed in, three times. Nothing is waiting for you here. Just now."];
var tabs=MN.$$('[role="tab"]'),panel=MN.$("#panel"),sc=MN.$("#script");
function pick(i,focus){
 tabs.forEach(function(t,n){var on=n===i;t.setAttribute("aria-selected",on?"true":"false");t.tabIndex=on?0:-1;});
 panel.setAttribute("aria-labelledby","t"+i);sc.textContent=S[i];if(focus)tabs[i].focus();
}
tabs.forEach(function(t,n){
 t.addEventListener("click",function(){pick(n,false);});
 t.addEventListener("keydown",function(e){
  var k=e.key,m=-1;
  if(k==="ArrowRight")m=(n+1)%tabs.length;else if(k==="ArrowLeft")m=(n+tabs.length-1)%tabs.length;
  else if(k==="Home")m=0;else if(k==="End")m=tabs.length-1;
  if(m>-1){e.preventDefault();pick(m,true);}
 });
});
pick(0,false);
})();
(function(){
var sc=MN.$("#script"),note=MN.$("#copyNote");
MN.$("#copyPause").addEventListener("click",function(){
 var text=sc.textContent+" (Mindless Now, mindlessnow.com)";
 if(navigator.clipboard&&navigator.clipboard.writeText){
  navigator.clipboard.writeText(text).then(function(){note.textContent="Copied. Send it to someone who needs a minute.";},function(){note.textContent="Your browser blocked copying. Select the text and copy it by hand.";});
 }else{note.textContent="Your browser can't copy from here. Select the text and copy it by hand.";}
});
})();
