/*!
 * Site-wide password gate.
 *
 * Loaded first in <head> on every page, next to an inline <style id="gate-hide">
 * that hides the page from the very first paint. Until the right password is
 * entered, the page stays hidden and a login box is shown instead. After a
 * correct password the unlock is remembered on this device for a week, and the
 * visitor stays on whatever URL they opened (deep links keep working).
 *
 * Limits: this is a client-side gate. It keeps casual visitors out, but anyone
 * who reads the page source or requests a file URL directly can still get at the
 * content, because GitHub Pages can't enforce a login on the server. It fails
 * closed: if this script can't load, the inline style keeps the page hidden.
 *
 * The salt, hash and unlock token below are written by
 * design-alchemy-68-b1df36e1-main/scripts/set-gate-password.mjs. Don't edit by hand.
 */
(function () {
  "use strict";

  /* GATE-CONFIG:START */
  var CONFIG = { salt: "8653f7a772685d3762ea4dc4c5dfa356", iterations: 600000, verifier: "7bc00587bd584999f34ea050c1966a8389e8831fe39ef6d05caec136b140eff3", token: "ab87cf813f430830601bbd3117a907b7" };
  /* GATE-CONFIG:END */

  var STORAGE_KEY = "sz_gate";
  var REMEMBER_MS = 7 * 24 * 60 * 60 * 1000;

  // Keep in sync with the inline <style id="gate-hide"> on each page.
  var HIDE_CSS =
    "html{overflow:hidden!important}" +
    "body>*:not(#gate-overlay),body>*:not(#gate-overlay) *{visibility:hidden!important}";

  var OVERLAY_CSS =
    "#gate-overlay{position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483647;display:flex;" +
    "align-items:center;justify-content:center;padding:24px;overflow:auto;background:#fff;color:#363636;" +
    "font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;" +
    "visibility:visible!important}" +
    "#gate-form{display:flex;flex-direction:column;align-items:center;width:100%;max-width:320px;text-align:center}" +
    "#gate-logo{width:96px;max-width:40%;height:auto;margin-bottom:28px}" +
    "#gate-label{font-size:1rem;margin-bottom:12px}" +
    "#gate-input{box-sizing:border-box;width:100%;padding:1rem;margin-bottom:16px;font:inherit;" +
    "border:1px solid #dbdbdb;border-radius:4px;background:#fff;color:inherit}" +
    "#gate-input:focus{outline:2px solid #43283A;outline-offset:1px;border-color:#43283A}" +
    "#gate-submit{padding:.75rem 1.5rem;font:inherit;font-weight:600;color:#fff;background:#43283A;" +
    "border:0;border-radius:4px;cursor:pointer}" +
    "#gate-submit:disabled{opacity:.55;cursor:not-allowed}" +
    "#gate-message{min-height:1.5em;margin:16px 0 0;font-size:.9rem;color:#b42318}" +
    "#gate-message.info{color:#666}";

  var callbacks = [];
  var unlocked = false;
  var hideStyle = document.getElementById("gate-hide");
  var overlay = null;
  var failures = 0;

  // ---- helpers ------------------------------------------------------------

  function isRemembered() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
      return !!saved && !!CONFIG.token && saved.t === CONFIG.token && saved.e > Date.now();
    } catch (e) {
      return false;
    }
  }

  function remember() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ t: CONFIG.token, e: Date.now() + REMEMBER_MS })
      );
    } catch (e) {
      /* storage blocked: the visitor will be asked again on the next page */
    }
  }

  function hexToBytes(hex) {
    var out = new Uint8Array(hex.length / 2);
    for (var i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
  }

  function bytesToHex(bytes) {
    var out = "";
    for (var i = 0; i < bytes.length; i++) out += ("0" + bytes[i].toString(16)).slice(-2);
    return out;
  }

  // Compare without bailing out at the first difference.
  function safeEqual(a, b) {
    if (a.length !== b.length) return false;
    var diff = 0;
    for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
  }

  function derive(password) {
    var subtle = window.crypto.subtle;
    var raw = new TextEncoder().encode(password.normalize("NFKC"));
    return subtle
      .importKey("raw", raw, "PBKDF2", false, ["deriveBits"])
      .then(function (key) {
        return subtle.deriveBits(
          { name: "PBKDF2", salt: hexToBytes(CONFIG.salt), iterations: CONFIG.iterations, hash: "SHA-256" },
          key,
          256
        );
      })
      .then(function (bits) {
        return bytesToHex(new Uint8Array(bits));
      });
  }

  // ---- unlock -------------------------------------------------------------

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    [hideStyle, document.getElementById("gate-style"), overlay].forEach(function (el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    callbacks.splice(0).forEach(function (fn) {
      try {
        fn();
      } catch (e) {
        /* one bad callback shouldn't block the others */
      }
    });
  }

  // ---- login box ----------------------------------------------------------

  function buildOverlay() {
    if (unlocked || overlay) return;

    var style = document.createElement("style");
    style.id = "gate-style";
    style.textContent = OVERLAY_CSS;
    document.head.appendChild(style);

    overlay = document.createElement("div");
    overlay.id = "gate-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "gate-label");
    overlay.innerHTML =
      '<form id="gate-form" novalidate>' +
      '<img id="gate-logo" src="/img/favicon.png" alt="Sining Zhou">' +
      '<label id="gate-label" for="gate-input">Enter password</label>' +
      '<input id="gate-input" type="password" autocomplete="current-password" ' +
      'autocapitalize="off" autocorrect="off" spellcheck="false">' +
      '<button id="gate-submit" type="submit">Submit</button>' +
      '<p id="gate-message" role="alert" aria-live="polite"></p>' +
      "</form>";
    document.body.appendChild(overlay);

    var form = document.getElementById("gate-form");
    var input = document.getElementById("gate-input");
    var button = document.getElementById("gate-submit");
    var message = document.getElementById("gate-message");
    var busy = false;
    var timer = null;

    function say(text, kind) {
      message.textContent = text;
      message.className = kind || "";
    }

    if (!CONFIG.verifier || !CONFIG.salt) {
      say("The password gate isn't set up yet.");
      input.disabled = true;
      button.disabled = true;
      return;
    }
    if (!window.crypto || !window.crypto.subtle) {
      say("Please open this page over https:// to unlock it.");
      input.disabled = true;
      button.disabled = true;
      return;
    }

    function cooldown(seconds) {
      var left = seconds;
      button.disabled = true;
      say("Incorrect password. Try again in " + left + "s.");
      timer = setInterval(function () {
        left -= 1;
        if (left <= 0) {
          clearInterval(timer);
          button.disabled = false;
          busy = false;
          say("Incorrect password. Please try again.");
          input.focus();
        } else {
          say("Incorrect password. Try again in " + left + "s.");
        }
      }, 1000);
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (busy) return;
      var password = input.value;
      if (!password) {
        say("Please enter the password.");
        return;
      }
      busy = true;
      button.disabled = true;
      say("Checking…", "info");
      derive(password).then(
        function (hex) {
          if (safeEqual(hex, CONFIG.verifier)) {
            remember();
            unlock();
            return;
          }
          failures += 1;
          input.value = "";
          // First two misses are free; after that wait 2s, 4s, 8s ... up to 30s.
          if (failures >= 3) {
            cooldown(Math.min(30, Math.pow(2, failures - 2)));
          } else {
            busy = false;
            button.disabled = false;
            say("Incorrect password. Please try again.");
            input.focus();
          }
        },
        function () {
          busy = false;
          button.disabled = false;
          say("Something went wrong. Please try again.");
        }
      );
    });

    input.focus();
  }

  // ---- start --------------------------------------------------------------

  window.siteGate = {
    isUnlocked: function () {
      return unlocked;
    },
    // Run fn once the visitor is unlocked (immediately if they already are).
    onUnlock: function (fn) {
      if (unlocked) fn();
      else callbacks.push(fn);
    },
    // Forget this device's unlock and show the gate again.
    lock: function () {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      window.location.reload();
    }
  };

  if (isRemembered()) {
    unlock();
    return;
  }

  // Locked. The pages already carry the hide style inline; add it if one is missing.
  if (!hideStyle) {
    hideStyle = document.createElement("style");
    hideStyle.id = "gate-hide";
    hideStyle.textContent = HIDE_CSS;
    document.head.appendChild(hideStyle);
  }
  if (document.body) buildOverlay();
  else document.addEventListener("DOMContentLoaded", buildOverlay);
})();
