(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function findCenter() {
    return (
      document.getElementById("bm-center") ||
      document.getElementById("app") ||
      document.querySelector("[data-studio-root]") ||
      document.querySelector("body > div")
    );
  }

  function getBoxes() {
    var pattern = /^box-(\d+)$/;
    return qsa("[id]")
      .filter(function (el) {
        return pattern.test(el.id);
      })
      .sort(function (a, b) {
        return parseInt(a.id.replace("box-", ""), 10) - parseInt(b.id.replace("box-", ""), 10);
      });
  }

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function scrollToBox(center, box) {
    if (!center || !box) return;
    // center がスクロールコンテナなので scrollIntoView だと外側が動く環境があるため、offset を使う
    center.scrollTo({ top: box.offsetTop, behavior: "smooth" });
  }

  function init() {
    var center = findCenter();
    var boxes = getBoxes();
    var total = boxes.length;

    if (!center || total === 0) {
      setTimeout(init, 200);
      return;
    }

    // ドット生成
    var dotsWrap = qs("#bm-dots");
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      boxes.forEach(function (_, i) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "bm-dot" + (i === 0 ? " bm-active" : "");
        d.setAttribute("aria-label", pad(i + 1) + "ページ目へ");
        d.addEventListener("click", function () {
          scrollToBox(center, boxes[i]);
        });
        dotsWrap.appendChild(d);
      });
    }

    // ナビ（左右）からの移動
    qsa("[data-scroll-to]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-scroll-to");
        var box = id ? document.getElementById(id) : null;
        scrollToBox(center, box);
      });
    });

    var counter = qs("#bm-counter");
    var hint = qs("#bm-hint");
    var navBtns = qsa(".nav__btn");
    var targetAgeValue = qs("#target-age-value");

    function activeIndex() {
      // scroll-snap の停止位置を前提に丸める
      var h = center.clientHeight || 1;
      var idx = Math.round(center.scrollTop / h);
      if (idx < 0) idx = 0;
      if (idx > total - 1) idx = total - 1;
      return idx;
    }

    function updateUI() {
      var idx = activeIndex();
      var activeBox = boxes[idx];

      qsa(".bm-dot").forEach(function (d, i) {
        d.className = "bm-dot" + (i === idx ? " bm-active" : "");
      });

      if (counter) counter.textContent = pad(idx + 1) + " / " + pad(total);
      if (hint) hint.style.opacity = idx === total - 1 ? "0" : "1";

      if (navBtns.length) {
        navBtns.forEach(function (b) {
          b.classList.remove("is-active");
        });
        if (activeBox) {
          var activeBtn = qs('.nav__btn[data-scroll-to="' + activeBox.id + '"]');
          if (activeBtn) activeBtn.classList.add("is-active");
        }
      }

      // 右サイドバー callout「詳細を見る」→ お問い合わせスライドへ
    var calloutBtn = document.querySelector(".callout .cta--small");
    if (calloutBtn) calloutBtn.addEventListener("click", function () {
      scrollToBox(center, document.getElementById("box-3"));
    });

    // 右側の対象年齢を、閲覧中のページに合わせて切り替える
      var addressValue = qs("#address-value");
      var accessValue  = qs("#access-value");
      var mapLink      = qs("#map-link");

      if (activeBox && activeBox.id === "box-2") {
        if (targetAgeValue) targetAgeValue.textContent = "3〜5歳";
        if (addressValue)   addressValue.textContent   = "岡山県岡山市北区辰巳26-102";
        if (accessValue)    accessValue.textContent    = "🚃 北長瀬駅から徒歩圏内";
        if (mapLink)        mapLink.href               = "https://maps.google.com/?q=岡山県岡山市北区辰巳26-102";
      } else {
        if (targetAgeValue) targetAgeValue.textContent = "小学生〜高校生";
        if (addressValue)   addressValue.textContent   = "岡山県岡山市中区徳吉町二丁目11番地25";
        if (accessValue)    accessValue.textContent    = "🚃 東山電停から徒歩1分";
        if (mapLink)        mapLink.href               = "https://maps.google.com/?q=岡山県岡山市中区徳吉町二丁目11番地25";
      }
    }

    center.addEventListener("scroll", updateUI, { passive: true });
    updateUI();

    // 詳細を見るボタン → 別ページへ遷移
    var btn1 = document.getElementById("btn-detail-1");
    var btn2 = document.getElementById("btn-detail-2");
    if (btn1) btn1.addEventListener("click", function () {
      window.location.href = "./afterschool.html";
    });
    if (btn2) btn2.addEventListener("click", function () {
      window.location.href = "./childcare.html";
    });

    // キーボード操作（中央にフォーカスされていなくても動く）
    window.addEventListener("keydown", function (e) {
      // フォーム入力中は邪魔しない
      var t = e.target;
      var tag = t && t.tagName ? t.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      var idx = activeIndex();
      if ((e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") && idx < total - 1) {
        e.preventDefault();
        scrollToBox(center, boxes[idx + 1]);
      }
      if ((e.key === "ArrowUp" || e.key === "PageUp") && idx > 0) {
        e.preventDefault();
        scrollToBox(center, boxes[idx - 1]);
      }
      if (e.key === "Home") {
        e.preventDefault();
        scrollToBox(center, boxes[0]);
      }
      if (e.key === "End") {
        e.preventDefault();
        scrollToBox(center, boxes[total - 1]);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ===== お問い合わせフォーム ===== */
function handleContact(e) {
  e.preventDefault();
  alert("お問い合わせを受け付けました。\n2営業日以内にご連絡いたします。");
  e.target.reset();
}

/* ===== カスタムカーソル ===== */
(function () {
  var cursor = document.createElement("div");
  cursor.id = "bm-cursor";
  var ring = document.createElement("div");
  ring.id = "bm-cursor-ring";
  document.body.appendChild(cursor);
  document.body.appendChild(ring);

  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var rx = mx, ry = my;

  document.addEventListener("mousemove", function (e) {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top  = my + "px";
  });

  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    requestAnimationFrame(animRing);
  }
  animRing();

  document.addEventListener("mousedown", function () {
    cursor.style.transform = "translate(-50%,-50%) scale(0.7)";
    ring.style.transform   = "translate(-50%,-50%) scale(0.85)";
  });
  document.addEventListener("mouseup", function () {
    cursor.style.transform = "translate(-50%,-50%) scale(1)";
    ring.style.transform   = "translate(-50%,-50%) scale(1)";
  });
})();

/* ===== パーティクル ===== */
(function () {
  function spawnParticle(container) {
    var p = document.createElement("div");
    p.className = "bm-particle";
    var size = 3 + Math.random() * 5;
    var x = 5 + Math.random() * 90;
    var dur = 3 + Math.random() * 4;
    var delay = Math.random() * 3;
    var colors = ["rgba(248,161,26,0.5)", "rgba(255,204,101,0.45)", "rgba(255,255,255,0.5)"];
    var color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = [
      "width:" + size + "px",
      "height:" + size + "px",
      "left:" + x + "%",
      "bottom:" + (Math.random() * 30) + "%",
      "background:" + color,
      "animation-duration:" + dur + "s",
      "animation-delay:" + delay + "s",
    ].join(";");
    container.appendChild(p);
    setTimeout(function () { p.remove(); }, (dur + delay) * 1000 + 200);
  }

  function startParticles() {
    var center = document.getElementById("bm-center");
    if (!center) { setTimeout(startParticles, 300); return; }
    setInterval(function () { spawnParticle(center); }, 600);
  }
  startParticles();
})();

/* ===== パネル切り替えアニメーション ===== */
(function () {
  var prevIdx = -1;

  function watchPanels() {
    var center = document.getElementById("bm-center");
    if (!center) { setTimeout(watchPanels, 300); return; }

    var panels = Array.from(document.querySelectorAll(".panel--industry"));
    if (panels.length === 0) { setTimeout(watchPanels, 300); return; }

    function getIdx() {
      var h = center.clientHeight || 1;
      var idx = Math.round(center.scrollTop / h);
      return Math.max(0, Math.min(idx, panels.length - 1));
    }

    function activate(idx) {
      if (idx === prevIdx) return;
      panels.forEach(function (p, i) {
        p.classList.remove("panel--enter", "panel--exit");
        if (i === idx) {
          void p.offsetWidth; // reflow
          p.classList.add("panel--enter");
        }
      });
      prevIdx = idx;
    }

    activate(getIdx());
    center.addEventListener("scroll", function () { activate(getIdx()); }, { passive: true });
  }
  watchPanels();
})();

/* ===== マウス パララックス（ムーン＋サイドバー） ===== */
(function () {
  var moon = null;
  var sideRight = null;

  function setup() {
    moon = document.querySelector(".moon");
    sideRight = document.querySelector(".side--right");
    if (!moon) { setTimeout(setup, 300); return; }

    document.addEventListener("mousemove", function (e) {
      var cx = window.innerWidth  / 2;
      var cy = window.innerHeight / 2;
      var dx = (e.clientX - cx) / cx;
      var dy = (e.clientY - cy) / cy;

      if (moon) {
        moon.style.transform = "translate(" + (dx * 10) + "px, " + (dy * 8 - 0) + "px)";
      }
      if (sideRight) {
        sideRight.style.transform = "translate(" + (dx * -3) + "px, " + (dy * -2) + "px)";
      }
    });
  }
  setup();
})();

