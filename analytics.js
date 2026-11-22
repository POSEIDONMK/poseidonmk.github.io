// MEDICIÓN DE POSEIDÓN: Google Analytics 4 + origen de cada visita + referencia en WhatsApp + cookies (Consent Mode v2)
var ID_ANALYTICS = 'G-CY0SKY5ZDH';
var NUMERO_AFRODITA = '593968520688'; // a este número se le agrega la línea de referencia "Ref. XX-YYY"
(function () {
  var W = window, D = document;
  function lee(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guarda(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // ---- Google Analytics con Consent Mode v2 (todo negado hasta que la persona acepte) ----
  W.dataLayer = W.dataLayer || [];
  W.gtag = function () { W.dataLayer.push(arguments); };
  var previo = lee('poseidon-cookies'); // 'si' | 'no' | null
  var estado = function (ok) { return ok ? 'granted' : 'denied'; };
  W.gtag('consent', 'default', { analytics_storage: estado(previo === 'si'), ad_storage: estado(previo === 'si'), ad_user_data: estado(previo === 'si'), ad_personalization: estado(previo === 'si'), wait_for_update: 500 });
  W.gtag('js', new Date());
  W.gtag('config', ID_ANALYTICS, { send_page_view: true });
  var s = D.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID_ANALYTICS; D.head.appendChild(s);

  // ---- Origen de la visita (UTM o referido), se guarda 30 días ----
  var FUENTES = { facebook: 'FB', fb: 'FB', meta: 'FB', instagram: 'IG', ig: 'IG', google: 'GO', bing: 'BI', tiktok: 'TT', youtube: 'YT', linkedin: 'LI', email: 'EM', correo: 'EM', whatsapp: 'WA', twitter: 'TW', x: 'TW' };
  function limpia(t, n) { return String(t || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, n); }
  function codigoFuente(f) { var k = String(f || '').toLowerCase(); return FUENTES[k] || limpia(k, 3); }
  function origenDeReferido() {
    try {
      if (!D.referrer) return null;
      var h = new URL(D.referrer).hostname.replace(/^(www|m|l|lm)\./, '');
      if (h === location.hostname.replace(/^www\./, '')) return null;
      if (/google\./.test(h)) return { f: 'GO', c: 'ORG' };
      if (/facebook\.com|fb\.com/.test(h)) return { f: 'FB', c: 'ORG' };
      if (/instagram\.com/.test(h)) return { f: 'IG', c: 'ORG' };
      if (/bing\.com/.test(h)) return { f: 'BI', c: 'ORG' };
      if (/youtube\.com/.test(h)) return { f: 'YT', c: 'ORG' };
      if (/tiktok\.com/.test(h)) return { f: 'TT', c: 'ORG' };
      if (/^t\.co$|twitter\.com|x\.com/.test(h)) return { f: 'TW', c: 'ORG' };
      return { f: limpia(h.split('.')[0], 3) || 'REF', c: 'REF' };
    } catch (e) { return null; }
  }
  var attr = null;
  try {
    var q = new URLSearchParams(location.search), us = q.get('utm_source');
    if (us) {
      attr = { f: codigoFuente(us), c: limpia(q.get('utm_campaign'), 12) || limpia(q.get('utm_medium'), 6), m: q.get('utm_medium') || '', t: Date.now() };
      guarda('poseidon-origen', JSON.stringify(attr));
    } else {
      var g = JSON.parse(lee('poseidon-origen') || 'null');
      if (g && Date.now() - g.t < 30 * 864e5) attr = g;
      else { var r = origenDeReferido(); if (r) { attr = { f: r.f, c: r.c, m: 'referral', t: Date.now() }; guarda('poseidon-origen', JSON.stringify(attr)); } }
    }
  } catch (e) {}
  function refTexto() { return 'Ref. ' + (attr && attr.f ? attr.f + (attr.c ? '-' + attr.c : '') : 'WEB'); }
  W.refPoseidon = refTexto;

  // ---- Eventos ----
  function evento(n, p) { try { W.gtag('event', n, p || {}); } catch (e) {} }
  var ruta = location.pathname.replace(/^\/|\/$/g, '') || 'inicio';
  if (ruta !== 'inicio' && !/^(terms|privacy|404)/.test(ruta)) evento('ver_linea', { linea: ruta });

  function alClic(e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (x) { return; }
    var boton = (a.getAttribute('data-boton') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40) || 'enlace';
    if (u.hostname === 'wa.me') {
      var numero = u.pathname.replace(/\D/g, '');
      var esAfrodita = numero === NUMERO_AFRODITA;
      if (esAfrodita && !a.dataset.refPuesto) {
        var texto = u.searchParams.get('text') || '';
        if (!/Ref\.\s/.test(texto)) {
          u.searchParams.set('text', (texto ? texto + ' ' : '') + '(' + refTexto() + ')');
          a.href = u.toString();
        }
      }
      evento('contacto_whatsapp', { boton: boton, tema: ruta, linea: ruta, destino: esAfrodita ? 'afrodita' : numero === '593990603757' ? 'argos' : 'otro', fuente: attr ? attr.f : 'WEB', campana: attr ? attr.c : '' });
    } else if (u.hostname === 'link.poseidonmk.com' && /\/plan-|diagnostico|club/i.test(u.pathname)) {
      evento('ir_a_pago', { plan: decodeURIComponent(u.pathname.slice(1)).slice(0, 60), linea: ruta });
    } else if (u.hostname === 'insecret.poseidonmk.com') {
      evento('ir_a_insecret', { destino: u.pathname.replace(/\/$/, '') || '/', boton: boton });
    }
  }
  D.addEventListener('click', alClic, true);
  D.addEventListener('auxclick', alClic, true);

  // ---- Aviso de cookies ----
  function aplica(ok) {
    guarda('poseidon-cookies', ok ? 'si' : 'no');
    W.gtag('consent', 'update', { analytics_storage: estado(ok), ad_storage: estado(ok), ad_user_data: estado(ok), ad_personalization: estado(ok) });
    evento('consent_update', { analitica: ok ? 'granted' : 'denied' });
    var b = D.getElementById('cookie-aviso'); if (b) b.hidden = true;
  }
  function listo() {
    var b = D.getElementById('cookie-aviso'); if (!b) return;
    if (!previo) b.hidden = false;
    var si = D.getElementById('cookie-si'), no = D.getElementById('cookie-no');
    if (si) si.addEventListener('click', function () { aplica(true); });
    if (no) no.addEventListener('click', function () { aplica(false); });
    D.querySelectorAll('[data-abrir-cookies]').forEach(function (el) { el.addEventListener('click', function (ev) { ev.preventDefault(); b.hidden = false; }); });
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', listo); else listo();
})();
