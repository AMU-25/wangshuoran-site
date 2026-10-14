/* 复古拼贴 · 音乐主题图标库（纯 SVG 线条，替代 emoji） */
(function (global) {
  "use strict";

  function s(body, opt) {
    opt = opt || {};
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' +
      (opt.w || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' + body + "</svg>";
  }

  var I = {
    /* 黑胶唱片 */
    vinyl: s(
      '<circle cx="12" cy="12" r="9.2"/><circle cx="12" cy="12" r="3.6"/>' +
      '<circle cx="12" cy="12" r="1"/><path d="M12 3.6a8.4 8.4 0 0 1 8 5.9"/>' +
      '<path d="M12 20.4a8.4 8.4 0 0 1-8-5.9"/>'
    ),
    /* 卡带 */
    tape: s(
      '<rect x="2.2" y="5" width="19.6" height="14" rx="2"/>' +
      '<circle cx="8" cy="11.4" r="2"/><circle cx="16" cy="11.4" r="2"/>' +
      '<rect x="6.4" y="14.6" width="11.2" height="2.4" rx=".8"/>' +
      '<path d="M9.4 11.4h5.2"/>'
    ),
    /* 胶片 / 场记板 */
    film: s(
      '<rect x="2.5" y="4.5" width="19" height="15" rx="2"/>' +
      '<path d="M7 4.5v15M17 4.5v15"/>' +
      '<path d="M2.5 8.2h19M2.5 15.8h19"/>' +
      '<path d="M9.6 8.2l2.4 3.2-2.4 3.2"/>'
    ),
    /* 拍立得 / 拼贴照片 */
    photo: s(
      '<rect x="3" y="3.2" width="18" height="15.4" rx="1.6"/>' +
      '<rect x="5.4" y="5.6" width="13.2" height="9" rx=".8"/>' +
      '<path d="M5.4 13.2l3.4-3.2 2.6 2.4 2-1.8 4.8 4.4"/>' +
      '<circle cx="9.2" cy="8.4" r="1"/><path d="M3 18.6h18"/>'
    ),
    /* 票根 */
    ticket: s(
      '<path d="M2.6 8.4V6.6a1.6 1.6 0 0 1 1.6-1.6h15.6a1.6 1.6 0 0 1 1.6 1.6v1.8a1.8 1.8 0 0 0 0 3.6v5.2a1.6 1.6 0 0 1-1.6 1.6H4.2a1.6 1.6 0 0 1-1.6-1.6v-5.2a1.8 1.8 0 0 0 0-3.6Z"/>' +
      '<path d="M12 6.4v11.2" stroke-dasharray="2 2.6"/>'
    ),
    /* 波形 */
    wave: s(
      '<path d="M3 12h1.6M7.4 8.6v6.8M11 5.4v13.2M14.6 9.8v4.4M18.2 7.4v9.2M21.4 11v2"/>'
    ),
    /* 音符 */
    note: s(
      '<path d="M9.4 17.6V6.4l8.4-2.2v3.2"/>' +
      '<circle cx="7" cy="17.6" r="2.4"/><circle cx="15.4" cy="15.4" r="2.4"/>' +
      '<path d="M9.4 6.4l8.4-2.2"/>'
    ),
    /* 话筒 */
    mic: s(
      '<rect x="9" y="2.8" width="6" height="10.4" rx="3"/>' +
      '<path d="M5.8 11.4a6.2 6.2 0 0 0 12.4 0"/>' +
      '<path d="M12 17.6v3.2M8.6 20.8h6.8"/>' +
      '<path d="M9.4 6.4h5.2M9.4 9.4h5.2"/>'
    ),
    /* 乐器键盘 */
    keyboard: s(
      '<rect x="2.2" y="6.4" width="19.6" height="11.6" rx="2"/>' +
      '<path d="M6.6 6.4v11.6M11 6.4v11.6M15.4 6.4v11.6"/>' +
      '<path d="M4.4 6.4v5M8.8 6.4v5M13.2 6.4v5M17.6 6.4v5"/>' +
      '<path d="M2.2 18.4h19.6"/>'
    ),
    /* 电吉他 */
    guitar: s(
      '<path d="M16.8 3.4h3.6v3.6"/>' +
      '<path d="M17.4 5.6 8.8 14.2M19.8 8 11.2 16.6"/>' +
      '<ellipse cx="9.4" cy="15.8" rx="4.3" ry="3.3" transform="rotate(-45 9.4 15.8)"/>' +
      '<circle cx="9.4" cy="15.8" r="1"/>' +
      '<path d="M5.6 19.2 7.4 21"/>'
    ),
    /* 唱针 */
    tonearm: s(
      '<circle cx="7.4" cy="16.6" r="4.6"/><circle cx="7.4" cy="16.6" r="1"/>' +
      '<path d="M10.6 13.4 20 4.6"/><circle cx="19.4" cy="4.2" r="1.6"/>'
    ),
    /* 邮戳 */
    stamp: s(
      '<circle cx="12" cy="12" r="8.6" stroke-dasharray="3 2.4"/>' +
      '<circle cx="12" cy="12" r="5.6"/><path d="M8.4 11h7.2M8.4 14h4.4"/>'
    ),
    /* 状态图标 */
    sun: s('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>'),
    moon: s('<path d="M20 14.4A8.6 8.6 0 0 1 9.6 4 8.6 8.6 0 1 0 20 14.4Z"/>'),
    menu: s('<path d="M3.6 7h16.8M3.6 12h16.8M3.6 17h16.8"/>'),
    close: s('<path d="M6 6l12 12M18 6L6 18"/>'),
    arrow: s('<path d="M4.4 12h14.4M13.6 7.2 19 12l-5.4 4.8"/>'),
    star4: s('<path d="M12 3.4 13.9 10 20.6 12 13.9 14 12 20.6 10.1 14 3.4 12 10.1 10Z"/>'),
    /* 五角星 */
    star5: s('<path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.2 6.1L12 17.1l-5.5 2.8 1.2-6.1-4.5-4.2 6.1-.8Z"/>'),
    /* 单八分音符 */
    note8: s('<path d="M10.4 17.4V5.2"/><ellipse cx="7.6" cy="17.4" rx="2.7" ry="2.1"/><path d="M10.4 5.2c5.2 1.5 7.8 4.2 7 8.6"/>'),
    /* 双八分音符（连符） */
    note2: s('<path d="M8 17.6V7.2M16.4 15.8V5.4M8 7.2h8.4"/><ellipse cx="5.8" cy="17.6" rx="2.6" ry="2"/><ellipse cx="14.2" cy="15.8" rx="2.6" ry="2"/>'),
    /* 几何符号：十字 */
    cross: s('<path d="M12 4v16M4 12h16"/>', { w: 2.4 }),
    /* 几何符号：空心方块 */
    square: s('<rect x="5" y="5" width="14" height="14"/>', { w: 2.4 }),
    /* 几何符号：米字 */
    asterisk: s('<path d="M12 4v16M5.1 8l13.8 8M18.9 8 5.1 16"/>', { w: 2.4 }),
    disc: s('<circle cx="12" cy="12" r="9.2"/><circle cx="12" cy="12" r="2.2"/><path d="M4.4 7.6a9.2 9.2 0 0 1 15.2 0"/>')
  };

  I.get = function (name) {
    return I[name] || I.note;
  };

  global.Icon = I;
})(window);
