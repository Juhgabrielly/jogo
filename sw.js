// Guarda os arquivos para o jogo abrir sem internet
const NOME = 'neon-dash-v3';
const ARQUIVOS = ['./', 'index.html', 'style.css', 'script.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png',
  'bg/cidade-neon.jpg', 'bg/candy.jpg', 'bg/floresta.jpg', 'bg/mar.jpg', 'bg/por-do-sol.jpg', 'bg/gelo.jpg', 'bg/noite-escura.jpg', 'bg/galaxia.jpg', 'bg/vulcao.jpg',
  'img/cidade-neon.jpg', 'img/candy.jpg', 'img/floresta.jpg', 'img/mar.jpg', 'img/por-do-sol.jpg',
  'img/gelo.jpg', 'img/noite-escura.jpg', 'img/galaxia.jpg', 'img/vulcao.jpg'];
self.addEventListener('install', e => e.waitUntil(caches.open(NOME).then(c => c.addAll(ARQUIVOS))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
