/* Markdown 渲染器：内置解析器（零依赖）+ 可选 CDN 增强（marked/DOMPurify） */
(function (global) {
  "use strict";

  var NUL = String.fromCharCode(0);

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function slug(text) {
    var s = String(text).trim().toLowerCase()
      .replace(/[`*_~\[\]()#!]/g, "").replace(/\s+/g, "-")
      .replace(/[^\w\u4e00-\u9fa5-]/g, "").replace(/-{2,}/g, "-");
    return s || "section";
  }

  /* ---------- 行内 ---------- */
  function inline(text) {
    var codes = [];
    text = text.replace(/`([^`\n]+)`/g, function (m, c) {
      codes.push(c);
      return NUL + (codes.length - 1) + NUL;
    });
    text = escapeHtml(text);

    text = text.replace(/!\[([^\]]*)\]\(\s*([^\s)]+)(?:\s+&quot;([^&]*)&quot;)?\s*\)/g,
      function (m, alt, src, title) {
        return '<img src="' + src + '" alt="' + alt + '"' +
          (title ? ' title="' + title + '"' : "") + ' loading="lazy">';
      });

    text = text.replace(/\[([^\]]*)\]\(\s*([^\s)]+)(?:\s+&quot;([^&]*)&quot;)?\s*\)/g,
      function (m, label, href, title) {
        var safe = /^(https?:\/\/|mailto:|\/|\.\/|#)/i.test(href) ? href : "#";
        var ext = /^https?:\/\//i.test(safe) ? ' target="_blank" rel="noopener noreferrer"' : "";
        return '<a href="' + safe + '"' + ext +
          (title ? ' title="' + title + '"' : "") + ">" + label + "</a>";
      });

    text = text.replace(/(^|[\s(])(https?:\/\/[^\s<)"']+)/g, function (m, pre, url) {
      return pre + '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + "</a>";
    });

    text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
    text = text.replace(/(^|[^\w*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    text = text.replace(/(^|[^\w_])_([^_\n]+)_/g, "$1<em>$2</em>");
    text = text.replace(/~~(.+?)~~/g, "<del>$1</del>");
    text = text.replace(/==(.+?)==/g, "<mark>$1</mark>");

    text = text.replace(new RegExp(NUL + "(\\d+)" + NUL, "g"), function (m, idx) {
      return "<code>" + escapeHtml(codes[Number(idx)]) + "</code>";
    });
    return text;
  }

  /* ---------- 列表 ---------- */
  function renderList(items, start, indent) {
    var ordered = items[start].ordered, html = "", i = start;
    while (i < items.length && items[i].indent >= indent) {
      if (items[i].indent > indent) {
        var sub = renderList(items, i, items[i].indent);
        html = /<\/li>$/.test(html) ? html.replace(/<\/li>$/, sub[0] + "</li>") : html + sub[0];
        i = sub[1];
        continue;
      }
      if (items[i].ordered !== ordered) break;
      var task = items[i].text.match(/^\[([ xX])\]\s+(.*)$/);
      if (task) {
        html += '<li class="task"><input type="checkbox" disabled' +
          (task[1].toLowerCase() === "x" ? " checked" : "") + "> " + inline(task[2]) + "</li>";
      } else {
        html += "<li>" + inline(items[i].text) + "</li>";
      }
      i++;
    }
    return [(ordered ? "<ol>" : "<ul>") + html + (ordered ? "</ol>" : "</ul>"), i];
  }

  function splitRow(line) {
    return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|")
      .map(function (c) { return c.trim(); });
  }

  function isBlockStart(line) {
    return /^```/.test(line) || /^#{1,6}\s/.test(line) || /^>\s?/.test(line) ||
      /^(-{3,}|\*{3,}|_{3,})\s*$/.test(line) || /^\s*([-*+]|\d+\.)\s+/.test(line) ||
      /\|/.test(line);
  }

  /* ---------- 块级 ---------- */
  function render(md) {
    var lines = String(md).replace(/\r\n?/g, "\n").split("\n");
    var out = [], i = 0;
    while (i < lines.length) {
      var line = lines[i];

      if (/^\s*$/.test(line)) { i++; continue; }

      var fence = line.match(/^```\s*([\w+-]*)\s*$/);
      if (fence) {
        i++;
        var buf = [];
        while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        var lang = fence[1] ? ' class="language-' + escapeHtml(fence[1]) + '"' : "";
        out.push("<pre><code" + lang + ">" + escapeHtml(buf.join("\n")) + "</code></pre>");
        continue;
      }

      var h = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
      if (h) {
        var lv = h[1].length, id = slug(h[2]);
        out.push("<h" + lv + ' id="' + id + '">' + inline(h[2]) +
          '<a class="anchor" href="#' + id + '" aria-label="锚点">#</a></h' + lv + ">");
        i++;
        continue;
      }

      if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { out.push("<hr>"); i++; continue; }

      if (/^>\s?/.test(line)) {
        var q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          q.push(lines[i].replace(/^>\s?/, ""));
          i++;
        }
        out.push("<blockquote>" + render(q.join("\n")) + "</blockquote>");
        continue;
      }

      if (/\|/.test(line) && i + 1 < lines.length &&
          /^[\s|:-]+$/.test(lines[i + 1]) && /-/.test(lines[i + 1])) {
        var head = splitRow(line);
        i += 2;
        var rows = [];
        while (i < lines.length && /\|/.test(lines[i]) && !/^\s*$/.test(lines[i])) {
          rows.push(splitRow(lines[i]));
          i++;
        }
        var t = "<table><thead><tr>";
        head.forEach(function (c) { t += "<th>" + inline(c) + "</th>"; });
        t += "</tr></thead><tbody>";
        rows.forEach(function (r) {
          t += "<tr>";
          r.forEach(function (c) { t += "<td>" + inline(c) + "</td>"; });
          t += "</tr>";
        });
        out.push(t + "</tbody></table>");
        continue;
      }

      var li = line.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
      if (li) {
        var items = [];
        while (i < lines.length) {
          var m = lines[i].match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
          if (!m) {
            if (items.length && /^\s+\S/.test(lines[i])) {
              items[items.length - 1].text += " " + lines[i].trim();
              i++;
              continue;
            }
            break;
          }
          items.push({
            indent: m[1].replace(/\t/g, "  ").length,
            ordered: /\d/.test(m[2]),
            text: m[3]
          });
          i++;
        }
        out.push(renderList(items, 0, items[0].indent)[0]);
        continue;
      }

      var p = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !isBlockStart(lines[i])) {
        p.push(lines[i]);
        i++;
      }
      if (p.length) {
        out.push("<p>" + inline(p.join("\n")).replace(/\n/g, "<br>") + "</p>");
      } else {
        i++;
      }
    }
    return out.join("\n");
  }

  /* ---------- 目录 ---------- */
  function toc(md) {
    var res = [], inFence = false;
    String(md).replace(/\r\n?/g, "\n").split("\n").forEach(function (line) {
      if (/^```/.test(line)) { inFence = !inFence; return; }
      if (inFence) return;
      var h = line.match(/^(#{2,3})\s+(.*?)\s*#*\s*$/);
      if (h) res.push({ level: h[1].length, id: slug(h[2]), text: h[2] });
    });
    return res;
  }

  /* ---------- CDN 增强 ---------- */
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("load failed")); };
      document.head.appendChild(s);
    });
  }

  function withTimeout(p, ms) {
    return Promise.race([p, new Promise(function (_, rej) {
      setTimeout(function () { rej(new Error("timeout")); }, ms);
    })]);
  }

  var smartReady = null;

  function prepareSmart() {
    if (smartReady) return smartReady;
    smartReady = (async function () {
      try {
        await withTimeout(loadScript("https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"), 4000);
        if (!global.marked) throw new Error("marked missing");
        global.marked.setOptions({ gfm: true, breaks: false });
        try {
          await withTimeout(loadScript("https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js"), 4000);
        } catch (e) { /* 缺少 purify 时仍可用，仅不做清洗 */ }
        return true;
      } catch (e) {
        return false;
      }
    })();
    return smartReady;
  }

  async function renderSmart(md) {
    var ok = await prepareSmart();
    if (!ok) return { html: render(md), engine: "内置解析器" };
    try {
      var raw = global.marked.parse(String(md));
      var html = global.DOMPurify ? global.DOMPurify.sanitize(raw) : raw;
      return { html: html, engine: "marked + DOMPurify" };
    } catch (e) {
      return { html: render(md), engine: "内置解析器（降级）" };
    }
  }

  global.Markdown = { render: render, renderSmart: renderSmart, toc: toc, slug: slug };
})(window);
