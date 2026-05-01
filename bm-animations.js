/**
 * bm-animations.js
 * BLUE MOUSE サイト用 追加アニメーション
 *
 * 【含まれる機能】
 *   ① スプラッシュ画面         — ページを開いた瞬間にロゴが中央に現れ、上にスライドアウト
 *   ② サイドバーロゴ シマー     — 光が左から右に流れる輝きエフェクト（自動ループ）
 *   ③ モバイルヘッダーロゴ      — ロゴがバウンスしながらポップイン
 *
 * 【組み込み方法（準備ができたら）】
 *   layout.js の読み込みより後ろに一行追加するだけ：
 *   <script src="./bm-animations.js"></script>
 *
 *   layout.js 側の変更は不要。このファイルが単独で動作します。
 */

(function () {
  'use strict';

  /* ============================================================
   * CSS をページに注入（このJSだけで完結）
   * ============================================================ */
  var CSS = [

    /* ① スプラッシュ */
    '#bm-splash {',
    '  position: fixed; inset: 0; z-index: 999999;',
    '  background: #fef9f3;',
    '  display: flex; flex-direction: column;',
    '  align-items: center; justify-content: center; gap: 20px;',
    '  transition: transform .7s cubic-bezier(.76,0,.24,1), opacity .45s ease;',
    '  will-change: transform, opacity;',
    '}',
    '#bm-splash.is-exit {',
    '  transform: translateY(-100%);',
    '  opacity: 0; pointer-events: none;',
    '}',
    '#bm-splash-logo {',
    '  width: clamp(160px, 38vw, 260px);',
    '  height: auto; display: block;',
    '  animation: bm-splash-logo-in .9s cubic-bezier(.22,1,.36,1) both .25s;',
    '}',
    '@keyframes bm-splash-logo-in {',
    '  from { opacity: 0; transform: scale(.82) translateY(22px); }',
    '  to   { opacity: 1; transform: scale(1)   translateY(0); }',
    '}',
    '#bm-splash-bar {',
    '  height: 2px;',
    '  background: linear-gradient(90deg, #5EC1C6, #3a9095);',
    '  border-radius: 2px;',
    '  animation: bm-splash-bar-grow 1.4s cubic-bezier(.4,0,.2,1) both .5s;',
    '}',
    '@keyframes bm-splash-bar-grow {',
    '  from { width: 0; opacity: 0; }',
    '  to   { width: clamp(160px, 38vw, 260px); opacity: 1; }',
    '}',
    '#bm-splash-tag {',
    '  font-family: "Inter", sans-serif;',
    '  font-size: 10px; letter-spacing: .22em;',
    '  text-transform: uppercase;',
    '  color: rgba(58,144,149,.55);',
    '  animation: bm-splash-tag-in .6s ease both 1s;',
    '}',
    '@keyframes bm-splash-tag-in {',
    '  from { opacity: 0; transform: translateY(6px); }',
    '  to   { opacity: 1; transform: translateY(0); }',
    '}',

    /* ② サイドバーロゴ シマー */
    '.bm-logo-shimmer {',
    '  position: relative; overflow: hidden;',
    '  display: inline-block; border-radius: 4px;',
    '}',
    '.bm-logo-shimmer::after {',
    '  content: ""; position: absolute;',
    '  top: 0; left: -80%; width: 55%; height: 100%;',
    '  background: linear-gradient(',
    '    120deg,',
    '    transparent 0%,',
    '    rgba(255,255,255,0) 20%,',
    '    rgba(255,255,255,.68) 50%,',
    '    rgba(255,255,255,0) 80%,',
    '    transparent 100%',
    '  );',
    '  transform: skewX(-12deg);',
    '  animation: bm-shimmer-sweep 4s ease-in-out infinite;',
    '}',
    '@keyframes bm-shimmer-sweep {',
    '  0%   { left: -80%; opacity: 0; }',
    '  8%   { opacity: 1; }',
    '  40%  { left: 160%; opacity: 1; }',
    '  41%  { opacity: 0; }',
    '  100% { left: 160%; opacity: 0; }',
    '}',

    /* ③ モバイルヘッダーロゴ ポップイン */
    '@keyframes bm-logo-pop {',
    '  0%   { opacity: 0; transform: scale(.65) translateX(-14px); }',
    '  65%  { transform: scale(1.08) translateX(2px); }',
    '  100% { opacity: 1; transform: scale(1) translateX(0); }',
    '}',
    '.bm-mobile-header__logo.bm-logo-pop {',
    '  animation: bm-logo-pop .6s cubic-bezier(.34,1.56,.64,1) both .15s;',
    '}',

  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.id  = 'bm-animations-css';
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);


  /* ============================================================
   * ① スプラッシュ画面
   * ============================================================ */
  function setupSplash() {
    if (sessionStorage.getItem('bm-splash-done')) return;
    sessionStorage.setItem('bm-splash-done', '1');

    var logoImg = document.querySelector('.bm-left .bm-logo img');
    var logoSrc = logoImg ? logoImg.src : './logo.webp';

    var splash = document.createElement('div');
    splash.id = 'bm-splash';
    splash.innerHTML =
      '<img src="' + logoSrc + '" alt="BLUE MOUSE" id="bm-splash-logo" />' +
      '<div id="bm-splash-bar"></div>' +
      '<span id="bm-splash-tag">After-School Day Service</span>';
    document.body.appendChild(splash);

    document.body.style.overflow = 'hidden';

    setTimeout(function () {
      splash.classList.add('is-exit');
      setTimeout(function () {
        splash.remove();
        document.body.style.overflow = '';
      }, 750);
    }, 2200);
  }


  /* ============================================================
   * ② サイドバーロゴ シマーエフェクト
   * ============================================================ */
  function setupShimmer() {
    // PC サイドバーと、フッターのロゴにも適用
    var targets = document.querySelectorAll('.bm-left .bm-logo, .bm-footer__logo');
    targets.forEach(function (el) {
      el.classList.add('bm-logo-shimmer');
    });
  }


  /* ============================================================
   * ③ モバイルヘッダーロゴ ポップイン
   * ============================================================ */
  function setupLogoPopIn() {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          var logoLink = node.classList && node.classList.contains('bm-mobile-header__logo')
            ? node
            : node.querySelector && node.querySelector('.bm-mobile-header__logo');
          if (logoLink && !logoLink.classList.contains('bm-logo-pop')) {
            logoLink.classList.add('bm-logo-pop');
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    var existing = document.querySelector('.bm-mobile-header__logo');
    if (existing) existing.classList.add('bm-logo-pop');
  }


  /* ============================================================
   * 初期化
   * ============================================================ */
  function init() {
    setupSplash();
    setupShimmer();
    setupLogoPopIn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
