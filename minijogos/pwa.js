/* MiniJogos - instalação como app (PWA) */
(function () {
  // 1) Registra o service worker (funciona em https ou localhost)
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }

  // 2) Já está instalado como app? Então não mostra o botão
  var jaInstalado = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (jaInstalado) return;

  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var evento = null;

  // 3) Estilos do botão flutuante e do aviso de instalação
  var css = document.createElement('style');
  css.textContent =
    '.mj-install{position:fixed;right:14px;bottom:14px;z-index:9998;display:none;align-items:center;gap:8px;' +
    'padding:12px 18px;border:3px solid #1e1b4b;border-radius:18px;background:#34d399;color:#1e1b4b;' +
    'font:900 16px Nunito,Segoe UI,Arial,sans-serif;box-shadow:0 6px 0 #1e1b4b;cursor:pointer;' +
    'animation:mjPulsa 1.6s ease-in-out infinite}' +
    '.mj-install.on{display:inline-flex}' +
    '.mj-install:active{transform:translateY(4px);box-shadow:0 2px 0 #1e1b4b}' +
    '@keyframes mjPulsa{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}' +
    '.mj-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;' +
    'padding:20px;background:rgba(30,27,75,.6)}' +
    '.mj-box{max-width:380px;padding:24px;border:4px solid #1e1b4b;border-radius:24px;background:#fef08a;' +
    'color:#1e1b4b;font:700 17px/1.5 Nunito,Segoe UI,Arial,sans-serif;text-align:center;box-shadow:0 10px 0 #1e1b4b}' +
    '.mj-box h3{margin:0 0 10px;font:400 30px Bangers,cursive;letter-spacing:1px}' +
    '.mj-box button{margin-top:16px;padding:12px 22px;border:3px solid #1e1b4b;border-radius:14px;' +
    'background:#fff;color:#1e1b4b;font:900 16px Nunito,Segoe UI,Arial,sans-serif;cursor:pointer}';
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mj-install';
  btn.textContent = '📲 Baixar app';
  btn.setAttribute('aria-label', 'Baixar o MiniJogos como app');
  document.body.appendChild(btn);

  // 4) Android / Chrome / Edge: o navegador avisa que pode instalar
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    evento = e;
    btn.classList.add('on');
  });

  window.addEventListener('appinstalled', function () {
    evento = null;
    btn.classList.remove('on');
  });

  // 5) iPhone / iPad: não existe instalação automática, então mostramos o passo a passo
  if (isIOS) btn.classList.add('on');

  function fechar(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }

  function mostrarAjuda(titulo, texto) {
    var overlay = document.createElement('div');
    overlay.className = 'mj-overlay';
    overlay.innerHTML =
      '<div class="mj-box" role="dialog" aria-modal="true">' +
      '<h3></h3><div class="mj-texto"></div><button type="button">Entendi!</button></div>';
    overlay.querySelector('h3').textContent = titulo;
    overlay.querySelector('.mj-texto').textContent = texto;
    overlay.querySelector('button').onclick = function () { fechar(overlay); };
    overlay.addEventListener('click', function (e) { if (e.target === overlay) fechar(overlay); });
    document.body.appendChild(overlay);
  }

  window.mjInstalar = function () {
    if (evento) {
      evento.prompt();
      evento.userChoice.finally(function () {
        evento = null;
        btn.classList.remove('on');
      });
      return;
    }
    if (isIOS) {
      mostrarAjuda(
        'Quase lá!',
        'Toque no botão Compartilhar (o quadradinho com a seta para cima) e depois em "Adicionar à Tela de Início".'
      );
      return;
    }
    mostrarAjuda(
      'Quase lá!',
      'No menu do navegador (os três pontinhos), escolha "Instalar app" ou "Adicionar à tela inicial".'
    );
  };

  btn.addEventListener('click', function () { window.mjInstalar(); });
})();
