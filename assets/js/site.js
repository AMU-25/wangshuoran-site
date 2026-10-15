/* 站点公共逻辑：导航、主题、占位图、弹窗、入场动画 */
(function (global) {
  "use strict";

  var NAV = [
    { href: "index.html", label: "首页", key: "index" },
    { href: "star.html", label: "明星介绍", key: "star" },
    { href: "works.html", label: "原创音乐", key: "works" },
    { href: "materials.html", label: "物料汇总", key: "materials" },
    { href: "merch.html", label: "官方周边图鉴", key: "merch" },
    { href: "about.html", label: "关于", key: "about" }
  ];

  /* data.js 用 const 声明，不会挂到 window 上，因此不能写 global.STAR */
  function starName() {
    return (typeof STAR !== "undefined" && STAR && STAR.name) ? STAR.name : "明星";
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* 复古拼贴占位图（SVG，无 emoji）
     音乐母题：vinyl 黑胶 / tape 卡带 / photo 拍立得 / ticket 票根 / wave 波形 */
  var MOTIFS = ["vinyl", "tape", "photo", "ticket", "wave"];

  function pickMotif(seed) {
    var s = 0;
    for (var i = 0; i < seed.length; i++) s += seed.charCodeAt(i);
    return MOTIFS[s % MOTIFS.length];
  }

  function n(v) { return Math.round(v * 100) / 100; }

  function motifBody(m, w, h, from, gid) {
    var cx = w / 2, cy = h * 0.43, R = Math.min(w * 0.32, h * 0.29);
    var b = "";

    if (m === "vinyl") {
      b =
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + n(R) + '" fill="#020100" stroke="rgba(255,255,255,.22)" stroke-width="3"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + n(R * 0.74) + '" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="2"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + n(R * 0.5) + '" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="2"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + n(R * 0.3) + '" fill="' + from + '"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + n(R * 0.06) + '" fill="#fff2df"/>' +
        '<path d="M' + n(cx - R * 0.93) + " " + n(cy - R * 0.36) + "A" + n(R) + " " + n(R) +
          " 0 0 1 " + n(cx - R * 0.3) + " " + n(cy - R * 0.95) +
          '" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="4" stroke-linecap="round"/>';

    } else if (m === "tape") {
      var tw = Math.min(w * 0.66, h * 0.92), th = tw * 0.62;
      var x0 = cx - tw / 2, y0 = cy - th / 2, rr = th * 0.13;
      b =
        '<rect x="' + n(x0) + '" y="' + n(y0) + '" width="' + n(tw) + '" height="' + n(th) +
          '" rx="12" fill="rgba(255,255,255,.08)" stroke="#fff2df" stroke-width="4"/>' +
        '<rect x="' + n(x0 + tw * 0.1) + '" y="' + n(y0 + th * 0.08) + '" width="' + n(tw * 0.8) +
          '" height="' + n(th * 0.26) + '" rx="4" fill="#fff2df"/>' +
        '<rect x="' + n(x0 + tw * 0.14) + '" y="' + n(y0 + th * 0.15) + '" width="' + n(tw * 0.5) +
          '" height="' + n(th * 0.09) + '" fill="' + from + '"/>' +
        '<circle cx="' + n(cx - tw * 0.2) + '" cy="' + n(y0 + th * 0.62) + '" r="' + n(rr) +
          '" fill="none" stroke="#fff2df" stroke-width="5"/>' +
        '<circle cx="' + n(cx + tw * 0.2) + '" cy="' + n(y0 + th * 0.62) + '" r="' + n(rr) +
          '" fill="none" stroke="#fff2df" stroke-width="5"/>' +
        '<circle cx="' + n(cx - tw * 0.2) + '" cy="' + n(y0 + th * 0.62) + '" r="' + n(rr * 0.45) +
          '" fill="' + from + '"/>' +
        '<circle cx="' + n(cx + tw * 0.2) + '" cy="' + n(y0 + th * 0.62) + '" r="' + n(rr * 0.45) +
          '" fill="' + from + '"/>' +
        '<rect x="' + n(cx - tw * 0.24) + '" y="' + n(y0 + th * 0.86) + '" width="' + n(tw * 0.48) +
          '" height="' + n(th * 0.06) + '" rx="3" fill="rgba(255,242,223,.7)"/>';

    } else if (m === "photo") {
      var pw = Math.min(w * 0.62, h * 0.74), ph = pw * 1.14;
      b = '<g transform="rotate(-2 ' + n(cx) + " " + n(cy) + ')">' +
        '<rect x="' + n(cx - pw / 2) + '" y="' + n(cy - ph / 2) + '" width="' + n(pw) + '" height="' + n(ph) +
          '" rx="4" fill="#fff2df"/>' +
        '<rect x="' + n(cx - pw * 0.43) + '" y="' + n(cy - ph * 0.44) + '" width="' + n(pw * 0.86) +
          '" height="' + n(ph * 0.72) + '" fill="url(#' + gid + ')"/>' +
        '<rect x="' + n(cx - pw * 0.43) + '" y="' + n(cy - ph * 0.44) + '" width="' + n(pw * 0.86) +
          '" height="' + n(ph * 0.72) + '" fill="url(#d' + gid + ')" opacity=".35"/>' +
        '<path d="M' + n(cx - pw * 0.43) + " " + n(cy + ph * 0.18) + "l" + n(pw * 0.26) + " " + n(-ph * 0.2) +
          " " + n(pw * 0.2) + " " + n(ph * 0.14) + " " + n(pw * 0.18) + " " + n(-ph * 0.12) +
          " " + n(pw * 0.22) + " " + n(ph * 0.28) + '" fill="rgba(2,1,0,.35)"/>' +
        "</g>";

    } else if (m === "ticket") {
      var kw = Math.min(w * 0.76, h * 1.05), kh = kw * 0.4;
      var kx = cx - kw / 2, ky = cy - kh / 2, holes = "";
      for (var i = 0; i < 5; i++) {
        var hy = ky + kh * (0.12 + i * 0.19);
        holes += '<circle cx="' + n(kx) + '" cy="' + n(hy) + '" r="' + n(kh * 0.06) + '" fill="#020100"/>' +
          '<circle cx="' + n(kx + kw) + '" cy="' + n(hy) + '" r="' + n(kh * 0.06) + '" fill="#020100"/>';
      }
      b = '<g transform="rotate(-3 ' + n(cx) + " " + n(cy) + ')">' +
        '<rect x="' + n(kx) + '" y="' + n(ky) + '" width="' + n(kw) + '" height="' + n(kh) +
          '" rx="6" fill="#fff2df"/>' +
        '<rect x="' + n(kx) + '" y="' + n(ky) + '" width="' + n(kw * 0.26) + '" height="' + n(kh) +
          '" rx="6" fill="' + from + '"/>' +
        '<path d="M' + n(kx + kw * 0.34) + " " + n(ky + kh * 0.12) + "V" + n(ky + kh * 0.88) +
          '" stroke="#020100" stroke-width="3" stroke-dasharray="8 8"/>' + holes +
        '<rect x="' + n(kx + kw * 0.42) + '" y="' + n(ky + kh * 0.24) + '" width="' + n(kw * 0.48) +
          '" height="' + n(kh * 0.14) + '" fill="#020100" opacity=".82"/>' +
        '<rect x="' + n(kx + kw * 0.42) + '" y="' + n(ky + kh * 0.5) + '" width="' + n(kw * 0.34) +
          '" height="' + n(kh * 0.1) + '" fill="#020100" opacity=".45"/>' +
        "</g>";

    } else {
      var bars = 15, bw = (w * 0.52) / bars;
      b = "<g>";
      for (var j = 0; j < bars; j++) {
        var bh = h * 0.28 * Math.abs(Math.sin(j * 0.68 + 0.6)) + h * 0.05;
        b += '<rect x="' + n(cx - w * 0.26 + j * bw) + '" y="' + n(cy - bh / 2) + '" width="' + n(bw * 0.55) +
          '" height="' + n(bh) + '" rx="2" fill="' + (j % 3 === 0 ? from : "#fff2df") +
          '" opacity="' + (j % 3 === 0 ? 1 : 0.85) + '"/>';
      }
      b += "</g>";
    }
    return b;
  }

  function art(a, ratio, motif) {
    a = a || {};
    var r = ratio || 0.75;
    var w = 800;
    var h = Math.max(320, Math.round(w / r));
    var gid = "g" + Math.random().toString(36).slice(2, 8);
    var from = a.from || "#a42423";
    var to = a.to || "#020100";
    var title = esc(a.title || "");
    var sub = esc(a.sub || "");
    var m = motif || pickMotif(title + sub);
    var barH = Math.max(92, Math.round(h * 0.17));
    var barY = h - barH;
    var font = 'font-family="PingFang SC,Microsoft YaHei,sans-serif"';

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h + '">' +
      "<defs>" +
        '<linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + from + '"/><stop offset="1" stop-color="' + to + '"/>' +
        "</linearGradient>" +
      "</defs>" +
      // 扁平底色（旧版图纸栅格已移除，与全站像素底纹统一）
      '<rect width="100%" height="100%" fill="#14120f"/>' +
      motifBody(m, w, h, from, gid) +
      // 内框（粗野主义硬边）
      '<rect x="10" y="10" width="' + (w - 20) + '" height="' + (h - 20) +
        '" fill="none" stroke="#fff2df" stroke-width="4"/>' +
      // 左上角红色角标
      '<rect width="40" height="40" fill="#a42423"/>' +
      '<rect x="0" y="40" width="40" height="4" fill="#fff2df"/>' +
      '<rect x="40" y="0" width="4" height="40" fill="#fff2df"/>' +
      // 底部标签条（实色红 + 黑描边）
      '<rect x="10" y="' + (barY - 4) + '" width="' + (w - 20) + '" height="' + (barH + 4) +
        '" fill="#050403" stroke="#fff2df" stroke-width="3"/>' +
      '<rect x="14" y="' + (barY - 8) + '" width="26" height="26" fill="#a42423"/>' +
      '<text x="' + (w / 2 + 8) + '" y="' + (barY + barH * 0.42) + '" text-anchor="middle" fill="#fff2df" ' + font +
        ' font-size="' + n(Math.min(w * 0.072, barH * 0.34)) + '" font-weight="700">' + title + "</text>" +
      '<text x="' + (w / 2 + 8) + '" y="' + (barY + barH * 0.78) + '" text-anchor="middle" fill="rgba(255,242,223,.75)" ' + font +
        ' font-size="' + n(Math.min(w * 0.038, barH * 0.2)) + '" letter-spacing="4">' + sub + "</text>" +
      "</svg>";

    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* ---------- 导航 / 页脚 ---------- */
  function applyPageTitles(active) {
    var cfg = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG && SITE_CONFIG.pages) ? SITE_CONFIG.pages : null;
    if (!cfg || !cfg[active]) return;
    var p = cfg[active];
    var t = document.getElementById('page-title');
    if (t && p.title) t.textContent = p.title;
    var e = document.getElementById('page-eyebrow');
    if (e && p.eyebrow) e.textContent = p.eyebrow;
    if (p.title) {
      var siteName = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.siteName) ? SITE_CONFIG.siteName : '';
      document.title = (siteName ? siteName + ' · ' : '') + p.title;
    }
  }

  /* ---------- 大标题下方副标题：跟随「板块跳转栏」的说明 ---------- */
  function applyPageSub(active) {
    var el = document.getElementById('page-sub');
    if (!el || typeof SECTORS === 'undefined') return;
    for (var i = 0; i < SECTORS.length; i++) {
      if (SECTORS[i].key === active && SECTORS[i].desc) {
        el.textContent = SECTORS[i].desc;
        break;
      }
    }
  }

  function renderChrome(active) {
    var cfg = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG) ? SITE_CONFIG : null;
    var brandName = (cfg && cfg.siteName) ? cfg.siteName : (starName() + '安利站');
    var navItems = (cfg && cfg.nav && cfg.nav.length) ? cfg.nav : NAV;

    var head = document.getElementById('app-header');
    if (head) {
      var DEFAULT_TICKER = [
        'SYS:// ' + starName() + ' 安利站 ONLINE',
        'NEW DROP // 最新物料已更新',
        'DAILY CHECK-IN ● 今日打卡进行中',
        'SIGNAL: STRONG // 感谢每一次点亮',
        'REC ● 记录每一个心动瞬间',
        '>> ' + starName().toUpperCase() + ' · 王烁然 <<'
      ];
      var tickerItems = (cfg && cfg.ticker && cfg.ticker.length) ? cfg.ticker : DEFAULT_TICKER;
      var tickerOne = tickerItems.map(function (t) {
        return '<span class="ticker-item"><i class="tk-bar">▍</i>' + esc(t) + '</span>';
      }).join('');
      var tickerHtml =
        '<div class="ticker" aria-hidden="true"><div class="ticker-track">' +
        tickerOne + tickerOne + '</div></div>';

      // 滚动字幕：JS 像素回卷 + 视口动态补份，避免宽屏断档
      function startTicker(){
        var track = head.querySelector('.ticker-track');
        if(!track) return;
        var pos = 0, raf = null, last = 0, oneW = 0, reps = 2, started = false;
        var SPEED = 0.06; // px/ms
        function renderCopies(n){ var h=''; for(var i=0;i<n;i++) h += tickerOne; track.innerHTML = h; }
        function measure(){ oneW = track.scrollWidth / reps; }
        function ensure(){
          var vw = track.parentElement.clientWidth || window.innerWidth;
          var need = (oneW > 0) ? Math.max(2, Math.ceil(vw / oneW) + 1) : 2;
          if(need > reps){ reps = need; renderCopies(reps); measure(); }
        }
        function step(now){
          var dt = now - last; last = now;
          if(oneW > 0){
            pos -= SPEED * dt;
            while(pos <= -oneW) pos += oneW;
            track.style.transform = 'translate3d(' + pos + 'px,0,0)';
          }
          raf = requestAnimationFrame(step);
        }
        function begin(){ if(raf) return; last = performance.now(); raf = requestAnimationFrame(step); }
        function ready(){ measure(); ensure(); if(!started){ started = true; begin(); } }
        reps = 2; renderCopies(reps);
        ready();
        if(document.fonts && document.fonts.ready) document.fonts.ready.then(ready);
        window.addEventListener('load', ready);
        var rt; window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(function(){ reps = 2; renderCopies(reps); ready(); }, 200); });
      }

      head.innerHTML =
        '<div class="nav"><div class="nav-inner">' +
        '<a class="brand" href="index.html"><span class="dot">' +
        (global.Icon ? Icon.star5 : '') +   /* 品牌图标：圆形黑胶 → 五角星 */
        '</span><span>' + esc(brandName) + '</span></a>' +
        '<button class="icon-btn nav-toggle" id="nav-toggle" aria-label="菜单">' +
        (global.Icon ? Icon.menu : '') + '</button>' +
        '<nav class="nav-links" id="nav-links">' +
        navItems.map(function (n) {
          return '<a href="' + esc(n.href) + '"' +
            (n.key === active ? ' aria-current="page"' : '') + '>' + esc(n.label) + '</a>';
        }).join('') +
        '</nav>' +
        '</div></div>' + tickerHtml;

      var tg = document.getElementById('nav-toggle');
      var links = document.getElementById('nav-links');
      if (tg && links) {
        tg.addEventListener('click', function () { links.classList.toggle('show'); });
      }

      startTicker();
    }

    var foot = document.getElementById('app-footer');
    if (foot) {
      var footLines = (cfg && cfg.footer && cfg.footer.length)
        ? cfg.footer
        : ['© ' + new Date().getFullYear() + ' ' + esc(starName()) + '安利站 · 粉丝非商业自发建站',
           '图文版权归原作者及官方所有 · 内容仅作分享收藏'];
      foot.innerHTML =
        '<div class="wrap footer-inner">' +
        footLines.map(function (l) { return '<div>' + esc(l) + '</div>'; }).join('') +
        '</div>' +
        '<div class="wrap track-tag">Cactus Kat on the track<span class="track-cursor">_</span></div>';
    }
  }

  /* ---------- 弹窗 ---------- */
  function ensureModal() {
    var el = document.getElementById("site-modal");
    if (!el) {
      el = document.createElement("div");
      el.className = "modal";
      el.id = "site-modal";
      el.innerHTML =
        '<button class="icon-btn modal-close" data-close aria-label="关闭">' +
        (global.Icon ? Icon.close : "") + "</button>" +
        '<div class="modal-box" id="site-modal-box"></div>';
      document.body.appendChild(el);
      el.addEventListener("click", function (e) {
        if (e.target === el || e.target.closest("[data-close]")) closeModal();
      });
    }
    return el;
  }
  function openModal(html, cls) {
    var el = ensureModal();
    el.className = "modal open" + (cls ? " " + cls : "");
    document.getElementById("site-modal-box").innerHTML = html;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    var el = document.getElementById("site-modal");
    if (el) {
      el.className = "modal";
      document.body.style.overflow = "";
    }
  }

  // 多图画廊弹窗：主图 + 缩略图切换 + 自定义信息区，供物料/周边详情等复用
  function galleryModal(opts) {
    var imgs = opts.imgs || [];
    var cur = 0;
    function render() {
      var main = imgs.length
        ? '<img src="' + esc(imgs[cur]) + '" alt="' + esc(opts.alt || '') + '" style="width:100%;max-height:62vh;object-fit:contain;border-radius:10px;background:#000;display:block">'
        : '<div style="width:100%;height:240px;display:flex;align-items:center;justify-content:center;color:#888;background:#15120f;border-radius:10px">暂无图片</div>';
      var thumbs = imgs.length > 1 ? '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center">' + imgs.map(function (s, i) {
        return '<button type="button" data-i="' + i + '" style="width:64px;height:64px;padding:0;border:' + (i === cur ? '3px solid #a42423' : '1px solid #555') + ';border-radius:8px;overflow:hidden;cursor:pointer;background:#000"><img src="' + esc(s) + '" style="width:100%;height:100%;object-fit:cover" loading="lazy"></button>';
      }).join('') + '</div>' : '';
      openModal('<div style="display:flex;flex-direction:column;align-items:center;gap:6px">' + main + thumbs + (opts.info || '') + '</div>', opts.modalClass || '');
      var box = document.getElementById('site-modal-box');
      box.querySelectorAll('button[data-i]').forEach(function (b) {
        b.onclick = function () { cur = +b.getAttribute('data-i'); render(); };
      });
    }
    render();
  }

  function linkify(text) {
    var s = esc(text || "");
    // 转义后再把 http(s) 链接包成可点击锚点（新标签页打开，防 XSS）
    return s.replace(/(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  function lightbox(src, cap, source, guide, showSource) {
    var g = (guide || "").trim();
    var guideHtml = "";
    if (g) {
      guideHtml = '<div class="lb-guide">指路：' + linkify(g) + "</div>";
    }
    openModal(
      "<img src='" + src + "' alt='" + esc(cap || "") + "'>" +
      (cap ? '<div class="cap">' + esc(cap) + "</div>" : "") +
      (showSource !== false ? '<div class="lb-source">图片来源：' + (source ? esc(source) : '<span class="lb-source-empty">未标注</span>') + "</div>" : "") +
      guideHtml,
      "lightbox"
    );
  }

  /* ---------- 入场动画（支持 JS 动态注入的内容） ---------- */
  var revealIO = null;

  function observeReveal() {
    var items = document.querySelectorAll(".reveal:not(.in):not([data-reveal-bound])");

    if (!("IntersectionObserver" in global)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add("in"); });
      return;
    }

    if (!revealIO) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            revealIO.unobserve(en.target);
          }
        });
      }, { threshold: 0.08 });
    }

    var vh = global.innerHeight || document.documentElement.clientHeight || 800;

    Array.prototype.forEach.call(items, function (el, i) {
      el.setAttribute("data-reveal-bound", "1");
      el.style.transitionDelay = Math.min(i % 8, 7) * 45 + "ms";

      // 已在视口内的元素直接触发（不依赖 IntersectionObserver 回调时机）
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        global.requestAnimationFrame(function () { el.classList.add("in"); });
      } else {
        revealIO.observe(el);
      }
    });
  }

  /* 底图装饰（旧版漂浮星星/音符）已移除：全站底纹统一为 assets/img/pixel-bg.svg 的像素星星+音符 */

  function init(active) {
    renderChrome(active);
    applyPageTitles(active);
    applyPageSub(active);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
    observeReveal();

    // 页面后续动态渲染的 .reveal 元素也自动纳入观察
    if ("MutationObserver" in global) {
      var pending = false;
      new MutationObserver(function () {
        if (pending) return;
        pending = true;
        setTimeout(function () { pending = false; observeReveal(); }, 0);
      }).observe(document.body, { childList: true, subtree: true });

      // 仅首页套卡纸框（其他板块保持原效果）：等本页脚本同步渲染完再执行
      if (location.pathname === '/' || /\/index\.html$/i.test(location.pathname)) setTimeout(matifyAll, 0);
      }
  }

  /* ---------- 板块目录（首页与各页底部共用） ---------- */
  function renderSectors(target, active) {
    var el = typeof target === "string" ? document.getElementById(target) : target;
    if (!el || typeof SECTORS === "undefined") return;

    var bars = "";
    bars += '<b style="--h:0.08"></b>';               // 最左侧额外一条更低的
    var N_EQ = 36;                                    // 音频条数量（加密，不加宽）
    for (var bi = 0; bi < N_EQ; bi++) {
      var h = (0.22 + (bi / (N_EQ - 1)) * 0.78).toFixed(2); // 左弱(0.22) → 右强(1.00)，供 JS 读取
      bars += '<b style="--h:' + h + '"></b>';
    }

    el.className = "grid grid-4";
    el.innerHTML = SECTORS.map(function (s) {
      return '<a class="card sector-card reveal' +
        (s.key === active ? " is-current" : "") + '" href="' + s.href + '">' +
        '<i class="tape tape-tr"></i>' +
        '<span class="stamp" style="position:absolute;right:16px;top:16px"><span>NO.<br>' +
        s.n + "</span></span>" +
        '<i class="wm-box eq-line">' + bars + '</i>' +
        '<p class="kicker">' + s.count + "</p>" +
        "<h3>" + s.title + "</h3>" +
        '<p class="desc">' + s.desc + "</p>" +
        '<span class="go">进入板块<i class="go-arrow">' + Icon.arrow + "</i></span></a>";
    }).join("");

    observeReveal();
  }

  /* ---------- 列表分页：取消瀑布流 / 收起展开 / 轮播 ---------- */
  function carousel(containerId, btnId, opts) {
    opts = opts || {};
    var el = document.getElementById(containerId);
    if (!el) return null;

    var rows = opts.rows || 2;
    var page = 0;
    var hidden = false;

    function items() { return Array.prototype.slice.call(el.children); }
    function cols() {
      var cs = global.getComputedStyle(el);
      if (cs.display && cs.display.indexOf("grid") === 0) {
        return Math.max(1, cs.gridTemplateColumns.split(" ").filter(Boolean).length);
      }
      return 1;
    }
    function perPage() { return Math.max(1, cols() * rows); }
    function totalPages() { return Math.max(1, Math.ceil(items().length / perPage())); }

    var pager = document.createElement("div");
    pager.className = "pager";
    el.insertAdjacentElement("afterend", pager);

    function render(animate) {
      if (animate === undefined) animate = true;
      var total = totalPages();
      if (page >= total) page = total - 1;
      if (page < 0) page = 0;
      var start = page * perPage();
      var end = start + perPage();
      items().forEach(function (c, i) {
        var on = i >= start && i < end;
        c.style.display = on ? "" : "none";
        if (on) {
          c.classList.add("in");
          // 仅在首次加载 / 筛选 / 搜索 / 排序时播放上滑入场动画；
          // 翻页、缩放、视图切换时禁用 reveal 过渡，避免视图小幅跳动
          if (animate) {
            c.classList.remove("cp-in");
            void c.offsetWidth;
            c.classList.add("cp-in");
          } else {
            c.style.transition = "none";
            c.style.transitionDelay = "0ms";
            void c.offsetWidth;
            c.style.transition = "";
            c.style.transitionDelay = "";
          }
        }
      });
      renderPager(total);
    }

    function renderPager(total) {
      if (hidden || total <= 1) { pager.style.display = "none"; pager.innerHTML = ""; return; }
      pager.style.display = "";
      var html = '<button class="pager-prev" type="button" aria-label="上一页"' + (page === 0 ? " disabled" : "") + ">‹ 上一页</button>";
      var WINDOW = 5;
      function numBtn(p) {
        return '<button class="pager-num' + (p === page ? " on" : "") + '" type="button" data-p="' + p + '">' + (p + 1) + "</button>";
      }
      function ellipsis(p) {
        return '<button class="pager-ellipsis" type="button" data-p="' + p + '" aria-label="跳转分页">…</button>';
      }
      if (total <= WINDOW) {
        // 不超过 5 页：全部显示
        for (var p = 0; p < total; p++) html += numBtn(p);
      } else {
        // 折叠：首按钮固定第 1 页，尾按钮固定末页，中间 3 页以当前页为中心窗口
        var win;
        if (page <= 2) win = [1, 2, 3];
        else if (page >= total - 3) win = [total - 4, total - 3, total - 2];
        else win = [page - 1, page, page + 1];
        html += numBtn(0);
        if (win[0] > 1) html += ellipsis(Math.max(1, win[0] - 3));
        win.forEach(function (p) { html += numBtn(p); });
        if (win[win.length - 1] < total - 2) html += ellipsis(Math.min(total - 2, win[win.length - 1] + 3));
        html += numBtn(total - 1);
      }
      html += '<button class="pager-next" type="button" aria-label="下一页"' + (page === total - 1 ? " disabled" : "") + ">下一页 ›</button>";
      html += '<span class="pager-jump">跳至 <input class="pager-input" type="number" min="1" max="' + total + '" value="' + (page + 1) + '" aria-label="输入页码跳转"> / ' + total + ' 页<button class="pager-go" type="button">跳转</button></span>';
      pager.innerHTML = html;
    }

    // 阻止 mousedown 让分页按钮获焦，避免平滑滚动下的轻微跳动（键盘 Tab/Enter 不受影响）
    pager.addEventListener("mousedown", function (e) {
      if (e.target.closest("button")) e.preventDefault();
    });

    pager.addEventListener("click", function (e) {
      var t = e.target.closest("button");
      if (!t) return;
      // 固定视图：记录点击前的滚动位置，重渲染后瞬时还原，避免切页跳动
      var prevY = window.scrollY || window.pageYOffset || 0;
      var prevX = window.scrollX || window.pageXOffset || 0;
      if (t.classList.contains("pager-prev")) page = Math.max(0, page - 1);
      else if (t.classList.contains("pager-next")) page = Math.min(totalPages() - 1, page + 1);
      else if (t.classList.contains("pager-num")) page = parseInt(t.getAttribute("data-p"), 10);
      else if (t.classList.contains("pager-ellipsis")) page = parseInt(t.getAttribute("data-p"), 10);
      else if (t.classList.contains("pager-go")) {
        var inp = pager.querySelector(".pager-input");
        var v = parseInt(inp && inp.value, 10);
        if (isNaN(v)) return;
        page = Math.min(totalPages() - 1, Math.max(0, v - 1));
      }
      else return;
      render(false);
      var root = document.documentElement;
      var sb = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto"; // 还原时禁用平滑滚动，避免二次滑动
      window.scrollTo(prevX, prevY);
      root.style.scrollBehavior = sb;
    });

    pager.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.classList && e.target.classList.contains("pager-input")) {
        e.preventDefault();
        var go = pager.querySelector(".pager-go");
        if (go) go.click();
      }
    });

    var lastPerPage = perPage();
    global.addEventListener("resize", function () {
      // 仅当每页数量（列数）真正变化时才重排；
      // 移动端弹出/收起软键盘会触发 resize，若直接重渲染会销毁正在输入的页码框、导致键盘闪退
      var pp = perPage();
      if (pp === lastPerPage) return;
      lastPerPage = pp;
      render(false);
    });

    return {
      refresh: function () { page = 0; render(); },
      pause: function () {},
      resume: function () {},
      hideBtn: function () { hidden = true; pager.style.display = "none"; },
      showBtn: function () { hidden = false; render(false); }
    };
  }

  function pic(artObj, ratio) {
    if (artObj) {
      // 多图：优先用第一张作为主图（art.imgs 数组）
      if (Array.isArray(artObj.imgs) && artObj.imgs.length && artObj.imgs[0]) return artObj.imgs[0];
      if (typeof artObj.img === 'string' && artObj.img) return artObj.img;
    }
    // 支持显式指定母题（artObj.motif），避免不同图片撞到同一个自动母题
    return art(artObj, ratio, artObj && artObj.motif);
  }

  // 取某条目全部图片（多图 imgs 优先，单图 img 兜底），用于详情画廊
  function pics(artObj) {
    if (artObj && Array.isArray(artObj.imgs) && artObj.imgs.length) return artObj.imgs.slice();
    if (artObj && typeof artObj.img === 'string' && artObj.img) return [artObj.img];
    return [];
  }

  /* ---------- 卡纸图片框：把图片容器包裹为 .mat-frame ---------- */
  function matify(elt, tape, clip) {
    if (!elt || !elt.parentNode) return;
    if (elt.dataset && elt.dataset.mat) return;
    var wrap = document.createElement('div');
    wrap.className = 'mat-frame';
    elt.parentNode.insertBefore(wrap, elt);
    wrap.appendChild(elt);
    var tear = document.createElement('span'); tear.className = 'mat-tear'; wrap.appendChild(tear);
    if (clip) {
      var clipEl = document.createElement('span'); clipEl.className = 'mat-clip';
      clipEl.innerHTML =
        '<svg viewBox="0 0 30 74" aria-hidden="true" focusable="false">' +
        '<path d="M9 24 L9 44 A7 7 0 0 0 23 44 L23 16 A10 10 0 0 0 3 16 L3 52 A12 12 0 0 0 27 52 L27 18" ' +
        'fill="none" stroke="#050403" stroke-width="3" stroke-linecap="round"/></svg>';
      wrap.appendChild(clipEl);
    }
    if (tape && !wrap.querySelector('.tape')) {
      var t = document.createElement('i'); t.className = 'tape tape-tl'; wrap.appendChild(t);
    }
    if (elt.dataset) elt.dataset.mat = '1';
  }

  function ensureMatFilter() {
    if (document.getElementById('mat-tear')) return;
    document.body.insertAdjacentHTML('beforeend',
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><filter id="mat-tear" x="-10%" y="-40%" width="120%" height="180%"><feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves="3" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G"/></filter></svg>');
  }

  function matifyAll() {
    ensureMatFilter();
    var groups = [
      { sel: '.mat-main', tape: true, clip: true },
      { sel: '.hero-portrait', tape: true, clip: false },
      { sel: '.polaroid', tape: true, clip: true },
      { sel: '.markdown img', tape: false, clip: true },
      { sel: '.thumb', tape: false, clip: false },
      { sel: '.preview-img', tape: false, clip: true }
    ];
    groups.forEach(function (g) {
      var els = document.querySelectorAll(g.sel);
      for (var i = 0; i < els.length; i++) matify(els[i], g.tape, g.clip);
    });
  }

  /* ---------- 按时间排序（正序 / 倒序） ----------
     时间字段可能是：纯年份 "2025"、点分日期 "2025.3.25"、带范围的 "2026.8.13-17"、
     或含「月」的中文日期；解析为可比较的数值 y*10000 + mo*100 + da。
     空值 / 无数字 → null，始终排在末尾（正序倒序皆然）。 */
  function timeVal(s) {
    s = (s == null ? "" : String(s)).trim();
    if (!s) return null;
    var p = s.split(/[^\d]+/).filter(function (x) { return x; });
    var y = p.length ? parseInt(p[0], 10) : 0;
    var mo = p.length > 1 ? parseInt(p[1], 10) : 0;
    var da = p.length > 2 ? parseInt(p[2], 10) : 0;
    if (isNaN(y)) y = 0;
    if (isNaN(mo)) mo = 0;
    if (isNaN(da)) da = 0;
    return y * 10000 + mo * 100 + da;
  }

  function sortByTime(arr, key, asc) {
    var a = (arr || []).slice();
    a.sort(function (x, y) {
      var vx = timeVal(x[key]), vy = timeVal(y[key]);
      var nx = vx === null, ny = vy === null;
      if (nx && ny) return 0;
      if (nx) return 1;
      if (ny) return -1;
      return asc ? vx - vy : vy - vx;
    });
    return a;
  }

  /* ---------- 通用列表页：分类 / 搜索 / 排序 / 分页渲染 ----------
     物料 / 作品 / 周边三个板块页共用同一套交互骨架，仅下列项有差异：
       rootId   网格容器 id（默认 'list'，周边用 'grid'）
       data     数据数组（MATERIALS / WORKS / MERCH）
       sortKey  排序时间字段（'date' / 'year'）
       noun     计数单位（'份' / '项' / '件'）
       catKey   分类字段名（'cat' / 'series'）
       catAttr  分类按钮上的 data 属性（'data-cat' / 'data-series'）
       cats     分类选项数组
       search   返回可搜索文本的函数(item) -> string
       card     返回单张卡片 HTML 的函数(item) -> string
       onRows   可选：渲染后回调(rows)，周边用其同步清单视图
     返回 { cp, state, refresh }，供页面专属交互（灯箱/详情/视图切换）使用。 */
  function list(cfg) {
    var listId = cfg.rootId || 'list';
    var catKey = cfg.catKey || 'cat';
    var catAttr = cfg.catAttr || 'data-cat';
    var ALL = ['全部'].concat(cfg.cats || []);
    var state = { q: '', order: 'desc' }; // 默认按时间从最新到最早
    state[catKey] = '全部';

    function match(it) {
      if (state[catKey] !== '全部' && it[catKey] !== state[catKey]) return false;
      if (!state.q) return true;
      return cfg.search(it).toLowerCase().indexOf(state.q.toLowerCase()) > -1;
    }

    function renderChips() {
      var box = document.getElementById('catChips');
      if (!box) return;
      box.innerHTML = ALL.map(function (c) {
        return '<button type="button" class="chip' + (c === state[catKey] ? ' on' : '') +
          '" ' + catAttr + '="' + c + '">' + c + '</button>';
      }).join('');
    }

    function render() {
      var rows = Site.sortByTime(cfg.data.filter(match), cfg.sortKey, state.order === 'asc');
      document.getElementById('count').textContent = '共 ' + rows.length + ' ' + (cfg.noun || '');
      document.getElementById('empty').style.display = rows.length ? 'none' : 'block';
      document.getElementById(listId).innerHTML = rows.map(cfg.card).join('');
      renderChips();
      if (cp) cp.refresh();
      if (cfg.onRows) cfg.onRows(rows);
    }

    document.getElementById('catChips').addEventListener('click', function (e) {
      var btn = e.target.closest('.chip[' + catAttr + ']');
      if (!btn) return;
      state[catKey] = btn.getAttribute(catAttr);
      render();
    });

    document.getElementById('q').addEventListener('input', function (e) {
      state.q = e.target.value.trim();
      render();
    });

    var sortBtnEl = document.getElementById('sortBtn');
    // 按钮文案与默认顺序保持同步（默认倒序：最新 → 最早）
    if (sortBtnEl) sortBtnEl.textContent = '时间 · ' + (state.order === 'asc' ? '正序 ▲' : '倒序 ▼');
    sortBtnEl.addEventListener('click', function () {
      state.order = state.order === 'asc' ? 'desc' : 'asc';
      this.textContent = '时间 · ' + (state.order === 'asc' ? '正序 ▲' : '倒序 ▼');
      render();
    });

    var cp = Site.carousel(listId);
    Site.renderSectors('sectors', cfg.page);
    render();

    return { cp: cp, state: state, refresh: render };
  }

  global.Site = {
    init: init,
    art: art,
    pic: pic,
    pics: pics,
    esc: esc,
    linkify: linkify,
    galleryModal: galleryModal,
    openModal: openModal,
    closeModal: closeModal,
    lightbox: lightbox,
    renderSectors: renderSectors,
    list: list,
    carousel: carousel,
    matify: matify,
    matifyAll: matifyAll,
    sortByTime: sortByTime,
    timeVal: timeVal
  };
})(window);

/* ---------- 板块卡暗纹：808 鼓点驱动的音频条跳动（每次跳跃波形略不同） ---------- */
(function () {
  var BPM = 112;
  var STEP = 60 / BPM / 4;                       // 16 分音符时长(s)
  // 808 风格步进强度（0..1），16 步：底鼓重拍 + 反拍军鼓
  var PAT = [1, .18, .1, .6, .92, .12, .5, .1, 1, .18, .1, .6, .92, .12, .5, .14];
  var BASE = 0.12;                               // 静止基线
  var t0 = null;

  function frame(now) {
    if (t0 === null) t0 = now;
    var t = (now - t0) / 1000;
    var cur = Math.floor(t / STEP) % PAT.length;  // 当前 808 步
    var hit = PAT[cur];

    document.querySelectorAll('.sector-card .eq-line').forEach(function (line) {
      var amp = parseFloat(getComputedStyle(line).getPropertyValue('--amp')) || 1;
      var changed = (line._eqStep !== cur);       // 跨入新一步才重新击打
      line._eqStep = cur;
      line.querySelectorAll('b').forEach(function (b) {
        if (!b._eq) b._eq = { env: 0, dec: 0.92 };
        if (changed) {
          // 每次跳跃波形略有不同：幅度与余震衰减都做随机微调
          var h = parseFloat(b.style.getPropertyValue('--h')) || 1;
          var varA = 0.7 + Math.random() * 0.5;
          var target = Math.pow(hit, 1.4) * varA * h * amp;  // 弱拍更低、强拍满高，加大高度差
          if (target > b._eq.env) b._eq.env = target;   // 快起（808 击打）
          b._eq.dec = 0.90 + Math.random() * 0.06;      // 余震衰减每次略不同
        }
        b._eq.env *= b._eq.dec;                        // 指数余震，模拟 808 下落
        if (b._eq.env < 0.001) b._eq.env = 0;
        var s = BASE + (1 - BASE) * Math.min(1, b._eq.env);
        b.style.transform = 'scaleY(' + s.toFixed(3) + ')';
      });
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);   // 持续轮询，无论板块卡何时渲染都能接管
})();
