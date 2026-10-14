/* 鼠标拖尾：像素风音符（方块 SVG · crispEdges · 与底图 pixel-bg.svg 同一套造型） */
(function (global) {
  "use strict";

  var doc = global.document;

  // 触屏设备与"减少动效"偏好下不启用
  var canHover = !(global.matchMedia && global.matchMedia("(hover: none)").matches);
  var reduce = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canHover || reduce) return;

  function boot() {
    var layer = doc.createElement("div");
    layer.className = "cursor-trail";
    layer.setAttribute("aria-hidden", "true");
    doc.body.appendChild(layer);

    var MAX = 72;

    /* 像素风音符：与全站底纹 pixel-bg.svg 同一套方块造型（1 格 = 1 viewBox 单位，crispEdges 硬边） */
    var C_EIGHTH = [[5,0],[6,0],[5,1],[6,1],[7,1],[5,2],[6,2],[5,3],[5,4],[5,5],
                    [5,6],[1,6],[2,6],[3,6],[4,6],[1,7],[2,7],[3,7],[4,7],[2,8],[3,8]];
    var C_QUARTER = [[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],
                     [5,6],[1,6],[2,6],[3,6],[4,6],[1,7],[2,7],[3,7],[4,7],[2,8],[3,8]];
    var C_BEAM = [];
    (function () {
      var c, r;
      for (c = 3; c <= 9; c++) { C_BEAM.push([c, 0]); C_BEAM.push([c, 1]); }
      for (r = 2; r <= 6; r++) { C_BEAM.push([3, r]); C_BEAM.push([9, r]); }
      for (r = 6; r <= 7; r++) {
        for (c = 0; c <= 3; c++) C_BEAM.push([c, r]);
        for (c = 6; c <= 9; c++) C_BEAM.push([c, r]);
      }
      C_BEAM.push([1, 8]); C_BEAM.push([2, 8]); C_BEAM.push([7, 8]); C_BEAM.push([8, 8]);
    })();

    function pixelSvg(vw, vh, cells) {
      var out = "", i;
      for (i = 0; i < cells.length; i++) {
        out += '<rect x="' + cells[i][0] + '" y="' + cells[i][1] + '" width="1" height="1"/>';
      }
      return '<svg viewBox="0 0 ' + vw + ' ' + vh + '" preserveAspectRatio="xMidYMid meet" ' +
        'shape-rendering="crispEdges" fill="currentColor">' + out + '</svg>';
    }

    // 三种造型循环：八分音符 / 四分音符 / 连音符
    var NOTES = [
      pixelSvg(8, 9, C_EIGHTH),
      pixelSvg(6, 9, C_QUARTER),
      pixelSvg(10, 9, C_BEAM),
      pixelSvg(8, 9, C_EIGHTH),
      pixelSvg(6, 9, C_QUARTER)
    ];
    var noteIdx = 0;
    var lastX = -999;
    var lastY = -999;
    var lastT = 0;
    var pressing = false;

    function palette() {
      // 暗色唯一主题：红 + 月白
      return ["#A42423", "#FFF2DF", "#A42423", "#FFF2DF", "#A42423", "#FFF2DF"];
    }

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function cleanup(el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    /* 跟随鼠标的音符拖尾 */
    function note(x, y, color) {
      var el = doc.createElement("i");
      el.className = "trail-item trail-note ico-svg";
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.color = color;
      // 像素风保持方正：不做任意角度旋转，否则方块边缘会被抗锯齿模糊
      el.style.setProperty("--rot", "0deg");
      el.style.setProperty("--rot2", "0deg");
      el.innerHTML = NOTES[noteIdx++ % NOTES.length];
      layer.appendChild(el);
      el.addEventListener("animationend", function () { cleanup(el); });
    }

    function spawn(x, y) {
      var c = palette();

      // 每次 1~2 个音符
      var n = 1 + (Math.random() < 0.6 ? 1 : 0);
      for (var i = 0; i < n; i++) {
        note(x + (Math.random() * 40 - 20), y + (Math.random() * 26 - 13), pick(c));
      }
      // 按住拖动时更密
      if (pressing && Math.random() < 0.8) {
        note(x + (Math.random() * 52 - 26), y + (Math.random() * 34 - 17), pick(c));
      }
      // 数量上限保护
      while (layer.children.length > MAX) {
        cleanup(layer.firstChild);
      }
    }

    doc.addEventListener("mousemove", function (e) {
      var now = Date.now();
      var dx = e.clientX - lastX;
      var dy = e.clientY - lastY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var minGap = pressing ? 26 : 46;   // 按住拖动时更密集
      if (now - lastT < 55 || dist < minGap) return;
      lastT = now;
      lastX = e.clientX;
      lastY = e.clientY;
      spawn(e.clientX, e.clientY);
    }, { passive: true });

    doc.addEventListener("mousedown", function () { pressing = true; });
    doc.addEventListener("mouseup", function () { pressing = false; });
    doc.addEventListener("mouseleave", function () { pressing = false; });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
