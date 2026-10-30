// GOOGLE ANALYTICS — para activarlo, pega entre las comillas tu ID de medición (empieza con G-). Ejemplo: 'G-ABC1234567'
// Si lo dejas vacío, no se carga nada y no se rastrea a nadie.
var ID_ANALYTICS = '';
(function () {
  if (!ID_ANALYTICS) return;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID_ANALYTICS;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', ID_ANALYTICS);
})();
