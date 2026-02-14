"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/d3-cloud/node_modules/d3-dispatch/dist/d3-dispatch.js
var require_d3_dispatch = __commonJS({
  "node_modules/d3-cloud/node_modules/d3-dispatch/dist/d3-dispatch.js"(exports, module2) {
    (function(global, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = global || self, factory(global.d3 = global.d3 || {}));
    })(exports, function(exports2) {
      "use strict";
      var noop = { value: function() {
      } };
      function dispatch() {
        for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
          if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t))
            throw new Error("illegal type: " + t);
          _[t] = [];
        }
        return new Dispatch(_);
      }
      function Dispatch(_) {
        this._ = _;
      }
      function parseTypenames2(typenames, types) {
        return typenames.trim().split(/^|\s+/).map(function(t) {
          var name = "", i = t.indexOf(".");
          if (i >= 0)
            name = t.slice(i + 1), t = t.slice(0, i);
          if (t && !types.hasOwnProperty(t))
            throw new Error("unknown type: " + t);
          return { type: t, name };
        });
      }
      Dispatch.prototype = dispatch.prototype = {
        constructor: Dispatch,
        on: function(typename, callback) {
          var _ = this._, T = parseTypenames2(typename + "", _), t, i = -1, n = T.length;
          if (arguments.length < 2) {
            while (++i < n)
              if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name)))
                return t;
            return;
          }
          if (callback != null && typeof callback !== "function")
            throw new Error("invalid callback: " + callback);
          while (++i < n) {
            if (t = (typename = T[i]).type)
              _[t] = set(_[t], typename.name, callback);
            else if (callback == null)
              for (t in _)
                _[t] = set(_[t], typename.name, null);
          }
          return this;
        },
        copy: function() {
          var copy = {}, _ = this._;
          for (var t in _)
            copy[t] = _[t].slice();
          return new Dispatch(copy);
        },
        call: function(type, that) {
          if ((n = arguments.length - 2) > 0)
            for (var args = new Array(n), i = 0, n, t; i < n; ++i)
              args[i] = arguments[i + 2];
          if (!this._.hasOwnProperty(type))
            throw new Error("unknown type: " + type);
          for (t = this._[type], i = 0, n = t.length; i < n; ++i)
            t[i].value.apply(that, args);
        },
        apply: function(type, that, args) {
          if (!this._.hasOwnProperty(type))
            throw new Error("unknown type: " + type);
          for (var t = this._[type], i = 0, n = t.length; i < n; ++i)
            t[i].value.apply(that, args);
        }
      };
      function get(type, name) {
        for (var i = 0, n = type.length, c; i < n; ++i) {
          if ((c = type[i]).name === name) {
            return c.value;
          }
        }
      }
      function set(type, name, callback) {
        for (var i = 0, n = type.length; i < n; ++i) {
          if (type[i].name === name) {
            type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
            break;
          }
        }
        if (callback != null)
          type.push({ name, value: callback });
        return type;
      }
      exports2.dispatch = dispatch;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/d3-cloud/index.js
var require_d3_cloud = __commonJS({
  "node_modules/d3-cloud/index.js"(exports, module2) {
    var dispatch = require_d3_dispatch().dispatch;
    var RADIANS = Math.PI / 180;
    var SPIRALS = {
      archimedean: archimedeanSpiral,
      rectangular: rectangularSpiral
    };
    var cw = 1 << 11 >> 5;
    var ch = 1 << 11;
    module2.exports = function() {
      var size = [256, 256], text = cloudText, font = cloudFont, fontSize = cloudFontSize, fontStyle = cloudFontNormal, fontWeight = cloudFontNormal, padding = cloudPadding, spiral = archimedeanSpiral, words = [], timeInterval = Infinity, event = dispatch("word", "end"), timer = null, random = Math.random, rotate = () => (~~(random() * 6) - 3) * 30, cloud = {}, canvas = cloudCanvas;
      cloud.canvas = function(_) {
        return arguments.length ? (canvas = functor(_), cloud) : canvas;
      };
      cloud.start = function() {
        var contextAndRatio = getContext(canvas()), board = zeroArray((size[0] >> 5) * size[1]), bounds = null, n = words.length, i = -1, tags = [], data = words.map(function(d, i2) {
          d.text = text.call(this, d, i2);
          d.font = font.call(this, d, i2);
          d.style = fontStyle.call(this, d, i2);
          d.weight = fontWeight.call(this, d, i2);
          d.rotate = rotate.call(this, d, i2);
          d.size = ~~fontSize.call(this, d, i2);
          d.padding = padding.call(this, d, i2);
          return d;
        }).sort(function(a, b) {
          return b.size - a.size;
        });
        if (timer)
          clearInterval(timer);
        timer = setInterval(step, 0);
        step();
        return cloud;
        function step() {
          var start = Date.now();
          while (Date.now() - start < timeInterval && ++i < n && timer) {
            var d = data[i];
            d.x = size[0] * (random() + 0.5) >> 1;
            d.y = size[1] * (random() + 0.5) >> 1;
            cloudSprite(contextAndRatio, d, data, i);
            if (d.hasText && place(board, d, bounds)) {
              tags.push(d);
              event.call("word", cloud, d);
              if (bounds)
                cloudBounds(bounds, d);
              else
                bounds = [{ x: d.x + d.x0, y: d.y + d.y0 }, { x: d.x + d.x1, y: d.y + d.y1 }];
              d.x -= size[0] >> 1;
              d.y -= size[1] >> 1;
            }
          }
          if (i >= n) {
            cloud.stop();
            event.call("end", cloud, tags, bounds);
          }
        }
      };
      cloud.stop = function() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        for (const d of words) {
          delete d.sprite;
        }
        return cloud;
      };
      function getContext(canvas2) {
        const context = canvas2.getContext("2d", { willReadFrequently: true });
        canvas2.width = canvas2.height = 1;
        const ratio = Math.sqrt(context.getImageData(0, 0, 1, 1).data.length >> 2);
        canvas2.width = (cw << 5) / ratio;
        canvas2.height = ch / ratio;
        context.fillStyle = context.strokeStyle = "red";
        return { context, ratio };
      }
      function place(board, tag, bounds) {
        var perimeter = [{ x: 0, y: 0 }, { x: size[0], y: size[1] }], startX = tag.x, startY = tag.y, maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]), s = spiral(size), dt = random() < 0.5 ? 1 : -1, t = -dt, dxdy, dx, dy;
        while (dxdy = s(t += dt)) {
          dx = ~~dxdy[0];
          dy = ~~dxdy[1];
          if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxDelta)
            break;
          tag.x = startX + dx;
          tag.y = startY + dy;
          if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 || tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1])
            continue;
          if (!bounds || collideRects(tag, bounds)) {
            if (!cloudCollide(tag, board, size[0])) {
              var sprite = tag.sprite, w = tag.width >> 5, sw = size[0] >> 5, lx = tag.x - (w << 4), sx = lx & 127, msx = 32 - sx, h = tag.y1 - tag.y0, x = (tag.y + tag.y0) * sw + (lx >> 5), last;
              for (var j = 0; j < h; j++) {
                last = 0;
                for (var i = 0; i <= w; i++) {
                  board[x + i] |= last << msx | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
                }
                x += sw;
              }
              return true;
            }
          }
        }
        return false;
      }
      cloud.timeInterval = function(_) {
        return arguments.length ? (timeInterval = _ == null ? Infinity : _, cloud) : timeInterval;
      };
      cloud.words = function(_) {
        return arguments.length ? (words = _, cloud) : words;
      };
      cloud.size = function(_) {
        return arguments.length ? (size = [+_[0], +_[1]], cloud) : size;
      };
      cloud.font = function(_) {
        return arguments.length ? (font = functor(_), cloud) : font;
      };
      cloud.fontStyle = function(_) {
        return arguments.length ? (fontStyle = functor(_), cloud) : fontStyle;
      };
      cloud.fontWeight = function(_) {
        return arguments.length ? (fontWeight = functor(_), cloud) : fontWeight;
      };
      cloud.rotate = function(_) {
        return arguments.length ? (rotate = functor(_), cloud) : rotate;
      };
      cloud.text = function(_) {
        return arguments.length ? (text = functor(_), cloud) : text;
      };
      cloud.spiral = function(_) {
        return arguments.length ? (spiral = SPIRALS[_] || _, cloud) : spiral;
      };
      cloud.fontSize = function(_) {
        return arguments.length ? (fontSize = functor(_), cloud) : fontSize;
      };
      cloud.padding = function(_) {
        return arguments.length ? (padding = functor(_), cloud) : padding;
      };
      cloud.random = function(_) {
        return arguments.length ? (random = _, cloud) : random;
      };
      cloud.on = function() {
        var value = event.on.apply(event, arguments);
        return value === event ? cloud : value;
      };
      return cloud;
    };
    function cloudText(d) {
      return d.text;
    }
    function cloudFont() {
      return "serif";
    }
    function cloudFontNormal() {
      return "normal";
    }
    function cloudFontSize(d) {
      return Math.sqrt(d.value);
    }
    function cloudPadding() {
      return 1;
    }
    function cloudSprite(contextAndRatio, d, data, di) {
      if (d.sprite)
        return;
      var c = contextAndRatio.context, ratio = contextAndRatio.ratio;
      c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
      var x = 0, y = 0, maxh = 0, n = data.length;
      --di;
      while (++di < n) {
        d = data[di];
        c.save();
        c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;
        const metrics = c.measureText(d.text);
        const anchor = -Math.floor(metrics.width / 2);
        let w2 = (metrics.width + 1) * ratio;
        let h2 = d.size << 1;
        if (d.rotate) {
          var sr = Math.sin(d.rotate * RADIANS), cr = Math.cos(d.rotate * RADIANS), wcr = w2 * cr, wsr = w2 * sr, hcr = h2 * cr, hsr = h2 * sr;
          w2 = Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 31 >> 5 << 5;
          h2 = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
        } else {
          w2 = w2 + 31 >> 5 << 5;
        }
        if (h2 > maxh)
          maxh = h2;
        if (x + w2 >= cw << 5) {
          x = 0;
          y += maxh;
          maxh = 0;
        }
        if (y + h2 >= ch)
          break;
        c.translate((x + (w2 >> 1)) / ratio, (y + (h2 >> 1)) / ratio);
        if (d.rotate)
          c.rotate(d.rotate * RADIANS);
        c.fillText(d.text, anchor, 0);
        if (d.padding)
          c.lineWidth = 2 * d.padding, c.strokeText(d.text, anchor, 0);
        c.restore();
        d.width = w2;
        d.height = h2;
        d.xoff = x;
        d.yoff = y;
        d.x1 = w2 >> 1;
        d.y1 = h2 >> 1;
        d.x0 = -d.x1;
        d.y0 = -d.y1;
        d.hasText = true;
        x += w2;
      }
      var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data, sprite = [];
      while (--di >= 0) {
        d = data[di];
        if (!d.hasText)
          continue;
        var w = d.width, w32 = w >> 5, h = d.y1 - d.y0;
        for (var i = 0; i < h * w32; i++)
          sprite[i] = 0;
        x = d.xoff;
        if (x == null)
          return;
        y = d.yoff;
        var seen = 0, seenRow = -1;
        for (var j = 0; j < h; j++) {
          for (var i = 0; i < w; i++) {
            var k = w32 * j + (i >> 5), m = pixels[(y + j) * (cw << 5) + (x + i) << 2] ? 1 << 31 - i % 32 : 0;
            sprite[k] |= m;
            seen |= m;
          }
          if (seen)
            seenRow = j;
          else {
            d.y0++;
            h--;
            j--;
            y++;
          }
        }
        d.y1 = d.y0 + seenRow;
        d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
      }
    }
    function cloudCollide(tag, board, sw) {
      sw >>= 5;
      var sprite = tag.sprite, w = tag.width >> 5, lx = tag.x - (w << 4), sx = lx & 127, msx = 32 - sx, h = tag.y1 - tag.y0, x = (tag.y + tag.y0) * sw + (lx >> 5), last;
      for (var j = 0; j < h; j++) {
        last = 0;
        for (var i = 0; i <= w; i++) {
          if ((last << msx | (i < w ? (last = sprite[j * w + i]) >>> sx : 0)) & board[x + i])
            return true;
        }
        x += sw;
      }
      return false;
    }
    function cloudBounds(bounds, d) {
      var b0 = bounds[0], b1 = bounds[1];
      if (d.x + d.x0 < b0.x)
        b0.x = d.x + d.x0;
      if (d.y + d.y0 < b0.y)
        b0.y = d.y + d.y0;
      if (d.x + d.x1 > b1.x)
        b1.x = d.x + d.x1;
      if (d.y + d.y1 > b1.y)
        b1.y = d.y + d.y1;
    }
    function collideRects(a, b) {
      return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
    }
    function archimedeanSpiral(size) {
      var e = size[0] / size[1];
      return function(t) {
        return [e * (t *= 0.1) * Math.cos(t), t * Math.sin(t)];
      };
    }
    function rectangularSpiral(size) {
      var dy = 4, dx = dy * size[0] / size[1], x = 0, y = 0;
      return function(t) {
        var sign = t < 0 ? -1 : 1;
        switch (Math.sqrt(1 + 4 * sign * t) - sign & 3) {
          case 0:
            x += dx;
            break;
          case 1:
            y += dy;
            break;
          case 2:
            x -= dx;
            break;
          default:
            y -= dy;
            break;
        }
        return [x, y];
      };
    }
    function zeroArray(n) {
      var a = [], i = -1;
      while (++i < n)
        a[i] = 0;
      return a;
    }
    function cloudCanvas() {
      return document.createElement("canvas");
    }
    function functor(d) {
      return typeof d === "function" ? d : function() {
        return d;
      };
    }
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => VaultWordCloudPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian5 = require("obsidian");

// src/constants.ts
var VIEW_TYPE_VAULT_WORD_CLOUD = "vault-word-cloud-view";
var VIEW_TYPE_NOTE_WORD_CLOUD = "note-word-cloud-view";
var MAX_WORDS = 140;
var MIN_WORD_LENGTH = 3;
var FRONTMATTER_PATTERN = /^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/;
var DEFAULT_STOP_WORDS = [
  "the",
  "and",
  "for",
  "that",
  "this",
  "with",
  "from",
  "are",
  "was",
  "were",
  "have",
  "has",
  "had",
  "you",
  "your",
  "they",
  "them",
  "their",
  "its",
  "our",
  "ours",
  "his",
  "her",
  "she",
  "him",
  "not",
  "but",
  "can",
  "will",
  "all",
  "any",
  "one",
  "two",
  "too",
  "use",
  "using",
  "into",
  "out",
  "about",
  "there",
  "then",
  "than",
  "when",
  "what",
  "where",
  "which",
  "who",
  "whom",
  "how",
  "why",
  "also",
  "just",
  "like",
  "some",
  "more",
  "most",
  "much",
  "many",
  "very",
  "each",
  "other",
  "such",
  "only",
  "note",
  "notes",
  "todo",
  "done",
  "null",
  "true",
  "false",
  "http",
  "https",
  "www",
  "com"
];

// src/block-renderers/wordcloud-block-renderer.ts
var import_obsidian = require("obsidian");
var DEFAULT_OPTIONS = {
  scope: "note",
  tags: [],
  match: "any",
  height: 320
};
function registerEmbeddedWordCloudProcessor(plugin, services) {
  const render = async (source, el, ctx) => {
    const options = parseOptions(source);
    el.empty();
    const wrapperEl = el.createDiv({ cls: "word-cloud-embed" });
    const stateEl = wrapperEl.createDiv({ cls: "word-cloud-embed-state", text: "Building cloud..." });
    const canvasEl = wrapperEl.createDiv({ cls: "word-cloud-embed-canvas" });
    canvasEl.style.height = `${options.height}px`;
    const updateProgress = (message, percent) => {
      stateEl.setText(`${message} (${percent}%)`);
    };
    try {
      let words;
      let searchScope = {};
      if (options.scope === "note") {
        const file = resolveTargetFile(plugin, ctx, options.notePath);
        if (!file) {
          stateEl.setText("Could not find note for embedded word cloud.");
          return;
        }
        words = await services.collectFileWords(file, updateProgress);
        searchScope = { filePath: file.path };
      } else {
        words = await services.collectVaultWords(options.tags, options.match, updateProgress);
        searchScope = { tags: options.tags, tagMatchMode: options.match };
      }
      if (words.length === 0) {
        stateEl.setText("No words found for this embedded cloud.");
        return;
      }
      await services.drawWordCloud({
        containerEl: canvasEl,
        words,
        ariaLabel: "Embedded word cloud",
        onProgress: updateProgress,
        onWordClick: (word) => {
          void services.openSearchForWord(word, searchScope);
        }
      });
      stateEl.remove();
    } catch (error) {
      console.error("Word clouds: failed to render embedded cloud", error);
      stateEl.setText("Could not render embedded word cloud.");
    }
  };
  plugin.registerMarkdownCodeBlockProcessor("wordcloud", render);
  plugin.registerMarkdownCodeBlockProcessor("word-cloud", render);
}
function resolveTargetFile(plugin, ctx, notePath) {
  if (notePath) {
    const normalizedPath = notePath.trim();
    const resolved = plugin.app.vault.getAbstractFileByPath(normalizedPath);
    return resolved instanceof import_obsidian.TFile ? resolved : null;
  }
  const fromContext = plugin.app.vault.getAbstractFileByPath(ctx.sourcePath);
  return fromContext instanceof import_obsidian.TFile ? fromContext : null;
}
function parseOptions(source) {
  const options = { ...DEFAULT_OPTIONS };
  const lines = source.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }
    const rawKey = trimmed.slice(0, separatorIndex).trim().toLowerCase();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    if (rawKey === "scope") {
      options.scope = rawValue.toLowerCase() === "vault" ? "vault" : "note";
      continue;
    }
    if (rawKey === "match") {
      options.match = rawValue.toLowerCase() === "all" ? "all" : "any";
      continue;
    }
    if (rawKey === "tags") {
      options.tags = rawValue.split(",").map((value) => value.trim()).filter((value) => value.length > 0);
      continue;
    }
    if (rawKey === "height") {
      const parsed = Number.parseInt(rawValue, 10);
      if (!Number.isNaN(parsed)) {
        options.height = Math.min(900, Math.max(180, parsed));
      }
      continue;
    }
    if (rawKey === "note") {
      options.notePath = rawValue;
    }
  }
  return options;
}

// src/utils.ts
function normalizeTag(tag) {
  const trimmed = tag.trim().toLowerCase();
  if (!trimmed) {
    return "";
  }
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}
function escapeForSearch(value) {
  return value.replace(/"/g, '\\"');
}

// src/actions/apply-search.ts
async function openSearchForWord(app, word, options = {}) {
  const parts = [`"${escapeForSearch(word)}"`];
  if (options.filePath) {
    parts.push(`path:"${escapeForSearch(options.filePath)}"`);
  }
  const tags = (options.tags ?? []).map((tag) => normalizeTag(tag)).filter((tag) => tag.length > 0);
  if (tags.length > 0) {
    if (options.tagMatchMode === "all") {
      for (const tag of tags) {
        parts.push(tag);
      }
    } else {
      parts.push(`(${tags.join(" OR ")})`);
    }
  }
  const query = parts.join(" ");
  const existingSearchLeaf = app.workspace.getLeavesOfType("search")[0];
  const searchLeaf = existingSearchLeaf ?? app.workspace.getRightLeaf(false) ?? app.workspace.getLeaf(true);
  if (!searchLeaf) {
    return;
  }
  await searchLeaf.setViewState({
    type: "search",
    active: true,
    state: {
      query
    }
  });
  app.workspace.revealLeaf(searchLeaf);
}

// src/pipeline/adapters/obsidian-source.ts
async function readPipelineDocuments(app, files, readBatchSize, onProgress) {
  const documents = [];
  const totalFiles = Math.max(1, files.length);
  for (let batchStart = 0; batchStart < files.length; batchStart += readBatchSize) {
    const batch = files.slice(batchStart, batchStart + readBatchSize);
    const contents = await Promise.all(batch.map((file) => app.vault.cachedRead(file)));
    for (let index = 0; index < batch.length; index += 1) {
      const file = batch[index];
      const rawText = contents[index];
      const tags = getFileTags(app, file);
      const fileIndex = batchStart + index;
      onProgress?.(`Scanning ${fileIndex + 1}/${files.length} files...`, Math.round(fileIndex / totalFiles * 75));
      documents.push({
        id: file.path,
        path: file.path,
        basename: file.basename,
        rawText,
        tags
      });
    }
  }
  return documents;
}
function getFileTags(app, file) {
  const cache = app.metadataCache.getFileCache(file);
  if (!cache) {
    return [];
  }
  const tagSet = /* @__PURE__ */ new Set();
  if (cache.tags) {
    for (const tagEntry of cache.tags) {
      const normalized = normalizeTag(tagEntry.tag);
      if (normalized) {
        tagSet.add(normalized);
      }
    }
  }
  for (const tag of extractFrontmatterTags(cache.frontmatter)) {
    const normalized = normalizeTag(tag);
    if (normalized) {
      tagSet.add(normalized);
    }
  }
  return [...tagSet];
}
function extractFrontmatterTags(frontmatter) {
  if (!frontmatter || typeof frontmatter !== "object") {
    return [];
  }
  const rawTags = frontmatter.tags ?? frontmatter.tag;
  if (typeof rawTags === "string") {
    return rawTags.split(/[\s,]+/).filter((entry) => entry.length > 0);
  }
  if (Array.isArray(rawTags)) {
    return rawTags.filter((entry) => typeof entry === "string").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
  }
  return [];
}

// src/pipeline/strategies/defaults.ts
var defaultTokenizer = {
  tokenize(text) {
    return text.match(/[a-z0-9][a-z0-9'-]*/g) ?? [];
  }
};
var defaultFilter = {
  includeToken(token, stopWords) {
    const normalized = token.trim();
    return normalized.length >= MIN_WORD_LENGTH && !stopWords.has(normalized);
  }
};
var defaultAggregator = {
  aggregate(tokens) {
    const counts = /* @__PURE__ */ new Map();
    for (const token of tokens) {
      counts.set(token.value, (counts.get(token.value) ?? 0) + 1);
    }
    const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, MAX_WORDS);
    return {
      entries,
      totalTokens: tokens.length,
      distinctTokens: counts.size
    };
  }
};
var defaultScaling = {
  scale(entries, renderSettings) {
    if (entries.length === 0) {
      return [];
    }
    const minFontSize = Math.max(8, Math.round(renderSettings.minFontSize));
    const maxFontSize = Math.max(minFontSize + 1, Math.round(renderSettings.maxFontSize));
    const emphasis = Math.max(0.5, Math.min(3, renderSettings.emphasis));
    const normalizedEntries = entries.map(([text, count], index) => ({
      text,
      count,
      index,
      score: computeScaleScore(count, index, entries, renderSettings, emphasis)
    })).sort((a, b) => b.count - a.count || a.index - b.index);
    return normalizedEntries.map((entry) => ({
      text: entry.text,
      count: entry.count,
      size: Math.round(minFontSize + entry.score * (maxFontSize - minFontSize))
    }));
  }
};
var defaultRenderModel = {
  buildModel(words, aggregate) {
    return {
      wordCloudWords: words,
      distributionSeries: buildDistributionSeries(words),
      totalTokens: aggregate.totalTokens,
      distinctTokens: aggregate.distinctTokens
    };
  }
};
var DEFAULT_PIPELINE_STRATEGIES = {
  tokenizer: defaultTokenizer,
  filter: defaultFilter,
  aggregator: defaultAggregator,
  scaling: defaultScaling,
  renderModel: defaultRenderModel
};
function computeScaleScore(count, index, entries, renderSettings, emphasis) {
  const counts = entries.map(([, entryCount]) => entryCount);
  const minCount = counts[counts.length - 1];
  const maxCount = counts[0];
  if (maxCount <= minCount) {
    return 0.5;
  }
  if (renderSettings.scalingMode === "rank") {
    if (entries.length === 1) {
      return 0.5;
    }
    return 1 - index / (entries.length - 1);
  }
  if (renderSettings.scalingMode === "log") {
    const safeMin = Math.max(1, minCount);
    const safeMax = Math.max(safeMin + 1, maxCount);
    const numerator = Math.log(Math.max(1, count)) - Math.log(safeMin);
    const denominator = Math.log(safeMax) - Math.log(safeMin);
    return clamp01(denominator === 0 ? 0.5 : numerator / denominator);
  }
  const linear = (count - minCount) / (maxCount - minCount);
  if (renderSettings.scalingMode === "power") {
    return clamp01(Math.pow(linear, emphasis));
  }
  return clamp01(linear);
}
function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}
function buildDistributionSeries(words) {
  if (words.length === 0) {
    return [];
  }
  const maxCount = words[0]?.count ?? 0;
  if (maxCount <= 0) {
    return [];
  }
  const bucketCount = Math.min(8, Math.max(4, Math.round(Math.sqrt(words.length))));
  const width = Math.max(1, Math.ceil(maxCount / bucketCount));
  const buckets = /* @__PURE__ */ new Map();
  for (const word of words) {
    const index = Math.min(bucketCount - 1, Math.floor((word.count - 1) / width));
    buckets.set(index, (buckets.get(index) ?? 0) + 1);
  }
  const distribution = [];
  for (let index = 0; index < bucketCount; index += 1) {
    const min = index * width + 1;
    const max = index === bucketCount - 1 ? maxCount : (index + 1) * width;
    distribution.push({
      label: `${min}-${max}`,
      min,
      max,
      value: buckets.get(index) ?? 0
    });
  }
  return distribution;
}

// src/pipeline/stages/aggregate.ts
function aggregateTokens(tokens, strategy) {
  return strategy.aggregate(tokens);
}

// src/pipeline/stages/filter.ts
function filterTokens(tokens, stopWords, strategy) {
  return tokens.filter((token) => strategy.includeToken(token.value, stopWords));
}

// src/pipeline/stages/normalize.ts
function normalizeDocuments(documents) {
  return documents.map((document2) => ({
    id: document2.id,
    path: document2.path,
    basename: document2.basename,
    tags: [...document2.tags],
    text: document2.rawText.replace(FRONTMATTER_PATTERN, "").toLowerCase().normalize("NFKC")
  }));
}

// src/pipeline/stages/render-model.ts
function createRenderModel(words, aggregateResult, strategy) {
  return strategy.buildModel(words, aggregateResult);
}

// src/pipeline/stages/scale.ts
function scaleEntries(entries, renderSettings, strategy) {
  return strategy.scale(entries, renderSettings);
}

// src/pipeline/stages/source-selection.ts
function selectDocuments(documents, rules) {
  if (!rules) {
    return documents;
  }
  const normalizedTagFilters = (rules.tagFilters ?? []).map((tag) => normalizeTag(tag)).filter((tag) => tag.length > 0);
  const includePrefixes = (rules.includePathPrefixes ?? []).map((prefix) => prefix.trim()).filter(Boolean);
  const excludePrefixes = (rules.excludePathPrefixes ?? []).map((prefix) => prefix.trim()).filter(Boolean);
  const queryText = rules.queryText?.trim().toLowerCase() ?? "";
  const tagMatchMode = rules.tagMatchMode ?? "any";
  return documents.filter((document2) => {
    if (!matchesPathRules(document2.path, includePrefixes, excludePrefixes)) {
      return false;
    }
    if (normalizedTagFilters.length > 0 && !matchesTagRules(document2.tags, normalizedTagFilters, tagMatchMode)) {
      return false;
    }
    if (queryText.length > 0 && !matchesQueryText(document2, queryText)) {
      return false;
    }
    return true;
  });
}
function matchesPathRules(path, includePrefixes, excludePrefixes) {
  if (includePrefixes.length > 0 && !includePrefixes.some((prefix) => path.startsWith(prefix))) {
    return false;
  }
  if (excludePrefixes.some((prefix) => path.startsWith(prefix))) {
    return false;
  }
  return true;
}
function matchesTagRules(documentTags, filters, mode) {
  const normalizedTags = new Set(documentTags.map((tag) => normalizeTag(tag)).filter(Boolean));
  if (mode === "all") {
    return filters.every((filterTag) => normalizedTags.has(filterTag));
  }
  return filters.some((filterTag) => normalizedTags.has(filterTag));
}
function matchesQueryText(document2, queryText) {
  return document2.path.toLowerCase().includes(queryText) || document2.basename.toLowerCase().includes(queryText) || document2.rawText.toLowerCase().includes(queryText);
}

// src/pipeline/stages/tokenize.ts
function tokenizeDocuments(documents, strategy) {
  const tokens = [];
  for (const document2 of documents) {
    const values = strategy.tokenize(document2.text);
    for (const value of values) {
      tokens.push({
        value,
        documentId: document2.id
      });
    }
  }
  return tokens;
}

// src/pipeline/run-pipeline.ts
function runPipeline(input, overrides = {}) {
  const strategies = {
    ...DEFAULT_PIPELINE_STRATEGIES,
    ...overrides
  };
  const selectedDocuments = selectDocuments(input.documents, input.sourceRules);
  const normalizedDocuments = normalizeDocuments(selectedDocuments);
  const tokens = tokenizeDocuments(normalizedDocuments, strategies.tokenizer);
  const filteredTokens = filterTokens(tokens, input.stopWords, strategies.filter);
  const aggregateResult = aggregateTokens(filteredTokens, strategies.aggregator);
  const words = scaleEntries(aggregateResult.entries, input.renderSettings, strategies.scaling);
  return createRenderModel(words, aggregateResult, strategies.renderModel);
}

// src/processing/tag-filter.ts
function getAvailableTags(app) {
  const tags = app.metadataCache.getTags();
  return Object.keys(tags).sort((a, b) => a.localeCompare(b));
}

// src/processing/processor.ts
var WordCloudProcessor = class {
  constructor(app) {
    this.app = app;
  }
  getAvailableTags() {
    return getAvailableTags(this.app);
  }
  async collectFromFiles(files, stopWords, renderSettings, onProgress, sourceRules) {
    const performance = getPerformanceProfile(renderSettings.progressDetail);
    const reportProgress = createThrottledProgress(onProgress, performance.progressThrottleMs);
    const readBatchSize = performance.fullParallelRead ? Math.max(1, files.length) : Math.max(8, Math.round(renderSettings.scanBatchSize));
    const documents = await readPipelineDocuments(
      this.app,
      files,
      readBatchSize,
      (message, percent) => {
        reportProgress(message, percent);
      }
    );
    reportProgress("Tokenizing and aggregating...", 85);
    const model = runPipeline({
      documents,
      stopWords,
      renderSettings,
      sourceRules
    });
    reportProgress("Preparing layout...", 95);
    return model.wordCloudWords;
  }
};
function createThrottledProgress(onProgress, minIntervalMs) {
  if (!onProgress) {
    return () => void 0;
  }
  let lastReportedAt = 0;
  let lastPercent = -1;
  return (message, percent) => {
    const now = Date.now();
    if (percent !== 100 && percent === lastPercent && now - lastReportedAt < minIntervalMs) {
      return;
    }
    if (percent !== 100 && now - lastReportedAt < minIntervalMs) {
      return;
    }
    lastReportedAt = now;
    lastPercent = percent;
    onProgress(message, percent);
  };
}
function getPerformanceProfile(detail) {
  if (detail === "unhinged") {
    return {
      progressThrottleMs: 1e6,
      fullParallelRead: true
    };
  }
  if (detail === "detailed") {
    return {
      progressThrottleMs: 25,
      fullParallelRead: false
    };
  }
  if (detail === "minimal") {
    return {
      progressThrottleMs: 220,
      fullParallelRead: false
    };
  }
  return {
    progressThrottleMs: 80,
    fullParallelRead: false
  };
}

// src/settings/index.ts
var import_obsidian2 = require("obsidian");

// src/processing/scaling.ts
function mapCountsToWeightedWords(entries, renderSettings) {
  if (entries.length === 0) {
    return [];
  }
  const minFontSize = Math.max(8, Math.round(renderSettings.minFontSize));
  const maxFontSize = Math.max(minFontSize + 1, Math.round(renderSettings.maxFontSize));
  const emphasis = Math.max(0.5, Math.min(3, renderSettings.emphasis));
  const normalizedEntries = entries.map(([text, count], index) => ({
    text,
    count,
    index,
    score: computeScaleScore2(count, index, entries, renderSettings, emphasis)
  })).sort((a, b) => b.count - a.count || a.index - b.index);
  return normalizedEntries.map((entry) => {
    const size = Math.round(minFontSize + entry.score * (maxFontSize - minFontSize));
    return {
      text: entry.text,
      count: entry.count,
      size
    };
  });
}
function computeScaleScore2(count, index, entries, renderSettings, emphasis) {
  const counts = entries.map(([, entryCount]) => entryCount);
  const minCount = counts[counts.length - 1];
  const maxCount = counts[0];
  if (maxCount <= minCount) {
    return 0.5;
  }
  if (renderSettings.scalingMode === "rank") {
    if (entries.length === 1) {
      return 0.5;
    }
    return 1 - index / (entries.length - 1);
  }
  if (renderSettings.scalingMode === "log") {
    const safeMin = Math.max(1, minCount);
    const safeMax = Math.max(safeMin + 1, maxCount);
    const numerator = Math.log(Math.max(1, count)) - Math.log(safeMin);
    const denominator = Math.log(safeMax) - Math.log(safeMin);
    return clamp012(denominator === 0 ? 0.5 : numerator / denominator);
  }
  const linear = (count - minCount) / (maxCount - minCount);
  if (renderSettings.scalingMode === "power") {
    return clamp012(Math.pow(linear, emphasis));
  }
  return clamp012(linear);
}
function clamp012(value) {
  return Math.min(1, Math.max(0, value));
}

// src/settings/index.ts
var DEFAULT_SETTINGS = {
  blacklistWords: [...DEFAULT_STOP_WORDS],
  render: {
    rotationPreset: "mostly-horizontal",
    spiral: "archimedean",
    wordPadding: 2,
    minFontSize: 14,
    maxFontSize: 72,
    fontFamily: "sans-serif",
    scalingMode: "power",
    emphasis: 1,
    showCountInWordText: false,
    countLabelFormat: "paren",
    countLabelMinCount: 1,
    progressDetail: "balanced",
    scanBatchSize: 24,
    layoutTimeIntervalMs: 16,
    deterministicLayout: false,
    randomSeed: 42
  }
};
var VaultWordCloudSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Word clouds settings" });
    let draftWord = "";
    const addExcludedWord = new import_obsidian2.Setting(containerEl).setName("Add excluded word").setDesc("Add one word at a time to the blacklist.").addText((text) => {
      text.setPlaceholder("Word to exclude");
      text.onChange((value) => {
        draftWord = value;
      });
    }).addButton((button) => {
      button.setButtonText("Add").setCta().onClick(async () => {
        const added = await this.plugin.addBlacklistWord(draftWord);
        if (added) {
          this.display();
        }
      });
    });
    this.attachInfoIcon(addExcludedWord, "Excluded words are always ignored from counting and sizing in all cloud types.");
    const listWrapperEl = containerEl.createDiv({ cls: "vault-word-cloud-settings-list" });
    listWrapperEl.createEl("h3", { text: "Excluded words" });
    const listEl = listWrapperEl.createDiv({ cls: "vault-word-cloud-settings-badges" });
    const sortedWords = [...this.plugin.settings.blacklistWords].sort((a, b) => a.localeCompare(b));
    if (sortedWords.length === 0) {
      listEl.createSpan({ cls: "vault-word-cloud-settings-badges-empty", text: "No excluded words configured." });
    } else {
      for (const word of sortedWords) {
        const badgeEl = listEl.createDiv({ cls: "vault-word-cloud-settings-badge" });
        badgeEl.createSpan({ cls: "vault-word-cloud-settings-badge-text", text: word });
        const removeButton = badgeEl.createEl("button", {
          cls: "vault-word-cloud-settings-badge-remove",
          text: "x"
        });
        removeButton.setAttr("aria-label", `Remove ${word}`);
        removeButton.addEventListener("click", async () => {
          await this.plugin.removeBlacklistWord(word);
          this.display();
        });
      }
    }
    const resetExcludedWords = new import_obsidian2.Setting(containerEl).setName("Reset excluded words").setDesc("Restore the original default blacklist.").addButton((button) => {
      button.setButtonText("Reset to defaults").onClick(async () => {
        await this.plugin.resetBlacklistWords();
        this.display();
      });
    });
    this.attachInfoIcon(resetExcludedWords, "Resets only excluded words. Rendering and performance settings are unchanged.");
    containerEl.createEl("h3", { text: "Rendering" });
    const previewWrapperEl = containerEl.createDiv({ cls: "vault-word-cloud-settings-preview" });
    previewWrapperEl.createEl("h4", { text: "Preview" });
    previewWrapperEl.createEl("p", {
      text: "Example cloud for render settings (does not use your vault data)."
    });
    const previewCanvasEl = previewWrapperEl.createDiv({ cls: "vault-word-cloud-settings-preview-canvas" });
    let previewNonce = 0;
    const rerenderPreview = async () => {
      const nonce = ++previewNonce;
      previewCanvasEl.empty();
      const loadingEl = previewCanvasEl.createDiv({ cls: "vault-word-cloud-state", text: "Rendering preview..." });
      try {
        const sampleWords = this.buildPreviewWords(this.plugin.settings.render);
        loadingEl.remove();
        await this.plugin.drawWordCloud({
          containerEl: previewCanvasEl,
          words: sampleWords,
          ariaLabel: "Word cloud render preview",
          onWordClick: () => {
          },
          enableExport: false
        });
      } catch {
        if (nonce !== previewNonce) {
          return;
        }
        loadingEl.remove();
        previewCanvasEl.createDiv({
          cls: "vault-word-cloud-state",
          text: "Could not render preview."
        });
      }
    };
    const updateRenderAndPreview = async (patch) => {
      await this.plugin.updateRenderSettings(patch);
      await rerenderPreview();
    };
    const rotationStyle = new import_obsidian2.Setting(containerEl).setName("Rotation style").setDesc("How words are angled in the cloud.").addDropdown((dropdown) => {
      dropdown.addOption("horizontal", "Horizontal only").addOption("mostly-horizontal", "Mostly horizontal").addOption("mixed", "Mixed angles").addOption("vertical", "Vertical heavy").setValue(this.plugin.settings.render.rotationPreset).onChange(async (value) => {
        await updateRenderAndPreview({
          rotationPreset: value
        });
      });
    });
    this.attachInfoIcon(rotationStyle, "Horizontal is easiest to read. Mixed/vertical can pack more words but may reduce readability.");
    const spiralLayout = new import_obsidian2.Setting(containerEl).setName("Spiral layout").setDesc("Placement strategy for positioning words.").addDropdown((dropdown) => {
      dropdown.addOption("archimedean", "Archimedean").addOption("rectangular", "Rectangular").setValue(this.plugin.settings.render.spiral).onChange(async (value) => {
        await updateRenderAndPreview({
          spiral: value
        });
      });
    });
    this.attachInfoIcon(spiralLayout, "Archimedean is more organic. Rectangular can appear tighter in some datasets.");
    const wordPadding = new import_obsidian2.Setting(containerEl).setName("Word padding").setDesc("Space between words in pixels.").addSlider((slider) => {
      slider.setLimits(0, 12, 1).setValue(this.plugin.settings.render.wordPadding).setDynamicTooltip().onChange(async (value) => {
        await updateRenderAndPreview({ wordPadding: value });
      });
    });
    this.attachInfoIcon(wordPadding, "Increase to reduce collisions and improve readability. Lower values pack more words.");
    const minFontSize = new import_obsidian2.Setting(containerEl).setName("Minimum font size").setDesc("Smallest rendered word size.").addSlider((slider) => {
      slider.setLimits(8, 64, 1).setValue(this.plugin.settings.render.minFontSize).setDynamicTooltip().onChange(async (value) => {
        await updateRenderAndPreview({ minFontSize: value });
      });
    });
    this.attachInfoIcon(minFontSize, "Sets the floor of visual size mapping. Higher minimum makes low-frequency words more legible.");
    const maxFontSize = new import_obsidian2.Setting(containerEl).setName("Maximum font size").setDesc("Largest rendered word size.").addSlider((slider) => {
      slider.setLimits(16, 140, 1).setValue(this.plugin.settings.render.maxFontSize).setDynamicTooltip().onChange(async (value) => {
        await updateRenderAndPreview({ maxFontSize: value });
      });
    });
    this.attachInfoIcon(maxFontSize, "Sets the ceiling of visual size mapping. Higher values emphasize top words more strongly.");
    const fontFamily = new import_obsidian2.Setting(containerEl).setName("Font family").setDesc("CSS font family used for words.").addText((text) => {
      text.setPlaceholder("sans-serif").setValue(this.plugin.settings.render.fontFamily).onChange(async (value) => {
        await updateRenderAndPreview({ fontFamily: value.trim() || "sans-serif" });
      });
    });
    this.attachInfoIcon(fontFamily, "Wider fonts take more space and can increase overlap pressure.");
    const showCountInWordText = new import_obsidian2.Setting(containerEl).setName("Show count in word text").setDesc("Append the occurrence count directly to rendered words.").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ showCountInWordText: value });
        this.display();
      });
    });
    this.attachInfoIcon(showCountInWordText, "Shows exact counts inline (e.g., word (12)). Improves precision, increases text length.");
    const countLabelFormat = new import_obsidian2.Setting(containerEl).setName("Count label format").setDesc("How counts are shown when count labels are enabled.").addDropdown((dropdown) => {
      dropdown.addOption("paren", "word (12)").addOption("dot", "word \xB7 12").addOption("colon", "word: 12").setValue(this.plugin.settings.render.countLabelFormat).setDisabled(!this.plugin.settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ countLabelFormat: value });
      });
    });
    this.attachInfoIcon(countLabelFormat, "Formatting style for inline counts.");
    const countLabelMinimum = new import_obsidian2.Setting(containerEl).setName("Count label minimum").setDesc("Show inline count only for words at or above this count.").addSlider((slider) => {
      slider.setLimits(1, 100, 1).setValue(this.plugin.settings.render.countLabelMinCount).setDynamicTooltip().setDisabled(!this.plugin.settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ countLabelMinCount: value });
      });
    });
    this.attachInfoIcon(countLabelMinimum, "Avoids visual noise by hiding counts for very small values.");
    const sizeScalingMode = new import_obsidian2.Setting(containerEl).setName("Size scaling mode").setDesc("How numeric count differences map to font-size differences.").addDropdown((dropdown) => {
      dropdown.addOption("linear", "Linear").addOption("power", "Power").addOption("log", "Log").addOption("rank", "Rank").setValue(this.plugin.settings.render.scalingMode).onChange(async (value) => {
        await updateRenderAndPreview({ scalingMode: value });
        this.display();
      });
    });
    this.attachInfoIcon(sizeScalingMode, "Linear is proportional. Power exaggerates gaps. Log compresses extremes. Rank ignores absolute gaps.");
    const emphasis = new import_obsidian2.Setting(containerEl).setName("Emphasis").setDesc("Higher values exaggerate size differences (power scaling mode).").addSlider((slider) => {
      slider.setLimits(0.5, 3, 0.1).setValue(this.plugin.settings.render.emphasis).setDynamicTooltip().setDisabled(this.plugin.settings.render.scalingMode !== "power").onChange(async (value) => {
        await updateRenderAndPreview({ emphasis: value });
      });
    });
    this.attachInfoIcon(emphasis, "Only used in Power scaling mode. 1.0 is baseline; higher exaggerates differences more.");
    const deterministicLayout = new import_obsidian2.Setting(containerEl).setName("Deterministic layout").setDesc("Keep cloud layout stable across refreshes using a seed.").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.render.deterministicLayout).onChange(async (value) => {
        await updateRenderAndPreview({ deterministicLayout: value });
        this.display();
      });
    });
    this.attachInfoIcon(deterministicLayout, "Useful for comparing before/after changes with stable positions.");
    const randomSeed = new import_obsidian2.Setting(containerEl).setName("Random seed").setDesc("Seed used when deterministic layout is enabled.").addText((text) => {
      text.setValue(String(this.plugin.settings.render.randomSeed)).setDisabled(!this.plugin.settings.render.deterministicLayout).onChange(async (value) => {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isNaN(parsed)) {
          await updateRenderAndPreview({ randomSeed: parsed });
        }
      });
    });
    this.attachInfoIcon(randomSeed, "Changing seed gives a different stable arrangement.");
    const resetRendering = new import_obsidian2.Setting(containerEl).setName("Reset rendering settings").setDesc("Restore default renderer controls.").addButton((button) => {
      button.setButtonText("Reset rendering").onClick(async () => {
        await this.plugin.resetRenderSettings();
        this.display();
      });
    });
    this.attachInfoIcon(resetRendering, "Resets rendering options only.");
    containerEl.createEl("h3", { text: "Performance" });
    containerEl.createEl("p", {
      text: "Tune speed vs UI smoothness and progress update detail for large clouds."
    });
    const progressDetail = new import_obsidian2.Setting(containerEl).setName("Progress detail").setDesc("How frequently progress is updated while scanning and layout.").addDropdown((dropdown) => {
      dropdown.addOption("unhinged", "Unhinged (max speed)").addOption("minimal", "Minimal (fastest)").addOption("balanced", "Balanced").addOption("detailed", "Detailed").setValue(this.plugin.settings.render.progressDetail).onChange(async (value) => {
        await this.plugin.updateRenderSettings({ progressDetail: value });
      });
    });
    this.attachInfoIcon(progressDetail, "Unhinged maximizes speed and may lock UI temporarily. Detailed is most informative but slower.");
    const scanBatchSize = new import_obsidian2.Setting(containerEl).setName("Scan batch size").setDesc("How many files are read in parallel during vault scanning.").addSlider((slider) => {
      slider.setLimits(8, 64, 1).setValue(this.plugin.settings.render.scanBatchSize).setDynamicTooltip().onChange(async (value) => {
        await this.plugin.updateRenderSettings({ scanBatchSize: value });
      });
    });
    this.attachInfoIcon(scanBatchSize, "Higher can be faster on strong devices but uses more memory/IO.");
    const layoutTimeSlice = new import_obsidian2.Setting(containerEl).setName("Layout time slice (ms)").setDesc("Time per layout chunk. Lower is smoother; higher is faster.").addSlider((slider) => {
      slider.setLimits(8, 40, 1).setValue(this.plugin.settings.render.layoutTimeIntervalMs).setDynamicTooltip().onChange(async (value) => {
        await this.plugin.updateRenderSettings({ layoutTimeIntervalMs: value });
      });
    });
    this.attachInfoIcon(layoutTimeSlice, "Controls responsiveness while laying out words.");
    const resetPerformance = new import_obsidian2.Setting(containerEl).setName("Reset performance settings").setDesc("Restore default performance tuning values.").addButton((button) => {
      button.setButtonText("Reset performance").onClick(async () => {
        await this.plugin.updateRenderSettings({
          progressDetail: DEFAULT_SETTINGS.render.progressDetail,
          scanBatchSize: DEFAULT_SETTINGS.render.scanBatchSize,
          layoutTimeIntervalMs: DEFAULT_SETTINGS.render.layoutTimeIntervalMs
        });
        this.display();
      });
    });
    this.attachInfoIcon(resetPerformance, "Resets performance tuning only.");
    void rerenderPreview();
  }
  attachInfoIcon(setting, infoText) {
    const icon = setting.nameEl.createEl("button", {
      cls: "word-cloud-setting-info",
      text: "i"
    });
    icon.type = "button";
    icon.setAttr("aria-label", "Show setting details");
    icon.setAttr("data-tooltip-position", "top");
    icon.setAttr("data-tooltip", infoText);
    const popover = setting.settingEl.createDiv({ cls: "word-cloud-setting-info-popover" });
    popover.setText(infoText);
    popover.setAttr("hidden", "true");
    icon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (popover.hasAttribute("hidden")) {
        popover.removeAttribute("hidden");
      } else {
        popover.setAttr("hidden", "true");
      }
    });
    icon.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        popover.setAttr("hidden", "true");
      }
    });
  }
  buildPreviewWords(renderSettings) {
    const template = [
      { text: "obsidian", count: 48 },
      { text: "notes", count: 43 },
      { text: "plugins", count: 36 },
      { text: "vault", count: 33 },
      { text: "research", count: 28 },
      { text: "ideas", count: 25 },
      { text: "writing", count: 22 },
      { text: "daily", count: 20 },
      { text: "project", count: 18 },
      { text: "review", count: 16 },
      { text: "design", count: 14 },
      { text: "meeting", count: 12 },
      { text: "tasks", count: 11 },
      { text: "journal", count: 10 },
      { text: "draft", count: 9 },
      { text: "reading", count: 8 },
      { text: "plan", count: 7 },
      { text: "focus", count: 6 },
      { text: "habit", count: 5 },
      { text: "goals", count: 4 }
    ];
    return mapCountsToWeightedWords(template.map((entry) => [entry.text, entry.count]), renderSettings);
  }
};

// node_modules/internmap/src/index.js
var InternMap = class extends Map {
  constructor(entries, key = keyof) {
    super();
    Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: key } });
    if (entries != null)
      for (const [key2, value] of entries)
        this.set(key2, value);
  }
  get(key) {
    return super.get(intern_get(this, key));
  }
  has(key) {
    return super.has(intern_get(this, key));
  }
  set(key, value) {
    return super.set(intern_set(this, key), value);
  }
  delete(key) {
    return super.delete(intern_delete(this, key));
  }
};
function intern_get({ _intern, _key }, value) {
  const key = _key(value);
  return _intern.has(key) ? _intern.get(key) : value;
}
function intern_set({ _intern, _key }, value) {
  const key = _key(value);
  if (_intern.has(key))
    return _intern.get(key);
  _intern.set(key, value);
  return value;
}
function intern_delete({ _intern, _key }, value) {
  const key = _key(value);
  if (_intern.has(key)) {
    value = _intern.get(key);
    _intern.delete(key);
  }
  return value;
}
function keyof(value) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}

// node_modules/d3-scale/src/init.js
function initRange(domain, range) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(domain);
      break;
    default:
      this.range(range).domain(domain);
      break;
  }
  return this;
}

// node_modules/d3-scale/src/ordinal.js
var implicit = Symbol("implicit");
function ordinal() {
  var index = new InternMap(), domain = [], range = [], unknown = implicit;
  function scale(d) {
    let i = index.get(d);
    if (i === void 0) {
      if (unknown !== implicit)
        return unknown;
      index.set(d, i = domain.push(d) - 1);
    }
    return range[i % range.length];
  }
  scale.domain = function(_) {
    if (!arguments.length)
      return domain.slice();
    domain = [], index = new InternMap();
    for (const value of _) {
      if (index.has(value))
        continue;
      index.set(value, domain.push(value) - 1);
    }
    return scale;
  };
  scale.range = function(_) {
    return arguments.length ? (range = Array.from(_), scale) : range.slice();
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  scale.copy = function() {
    return ordinal(domain, range).unknown(unknown);
  };
  initRange.apply(scale, arguments);
  return scale;
}

// node_modules/d3-scale-chromatic/src/colors.js
function colors_default(specifier) {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n)
    colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;
}

// node_modules/d3-scale-chromatic/src/categorical/Tableau10.js
var Tableau10_default = colors_default("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab");

// node_modules/d3-selection/src/namespaces.js
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces_default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

// node_modules/d3-selection/src/namespace.js
function namespace_default(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns")
    name = name.slice(i + 1);
  return namespaces_default.hasOwnProperty(prefix) ? { space: namespaces_default[prefix], local: name } : name;
}

// node_modules/d3-selection/src/creator.js
function creatorInherit(name) {
  return function() {
    var document2 = this.ownerDocument, uri = this.namespaceURI;
    return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
  };
}
function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}
function creator_default(name) {
  var fullname = namespace_default(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}

// node_modules/d3-selection/src/selector.js
function none() {
}
function selector_default(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

// node_modules/d3-selection/src/selection/select.js
function select_default(select) {
  if (typeof select !== "function")
    select = selector_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node)
          subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/array.js
function array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}

// node_modules/d3-selection/src/selectorAll.js
function empty() {
  return [];
}
function selectorAll_default(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

// node_modules/d3-selection/src/selection/selectAll.js
function arrayAll(select) {
  return function() {
    return array(select.apply(this, arguments));
  };
}
function selectAll_default(select) {
  if (typeof select === "function")
    select = arrayAll(select);
  else
    select = selectorAll_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }
  return new Selection(subgroups, parents);
}

// node_modules/d3-selection/src/matcher.js
function matcher_default(selector) {
  return function() {
    return this.matches(selector);
  };
}
function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}

// node_modules/d3-selection/src/selection/selectChild.js
var find = Array.prototype.find;
function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}
function childFirst() {
  return this.firstElementChild;
}
function selectChild_default(match) {
  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/selectChildren.js
var filter = Array.prototype.filter;
function children() {
  return Array.from(this.children);
}
function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}
function selectChildren_default(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/filter.js
function filter_default(match) {
  if (typeof match !== "function")
    match = matcher_default(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/selection/sparse.js
function sparse_default(update) {
  return new Array(update.length);
}

// node_modules/d3-selection/src/selection/enter.js
function enter_default() {
  return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
}
function EnterNode(parent, datum2) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum2;
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function(selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function(selector) {
    return this._parent.querySelectorAll(selector);
  }
};

// node_modules/d3-selection/src/constant.js
function constant_default(x) {
  return function() {
    return x;
  };
}

// node_modules/d3-selection/src/selection/data.js
function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0, node, groupLength = group.length, dataLength = data.length;
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}
function bindKey(parent, group, enter, update, exit, data, key) {
  var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
      exit[i] = node;
    }
  }
}
function datum(node) {
  return node.__data__;
}
function data_default(value, key) {
  if (!arguments.length)
    return Array.from(this, datum);
  var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
  if (typeof value !== "function")
    value = constant_default(value);
  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1)
          i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength)
          ;
        previous._next = next || null;
      }
    }
  }
  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}
function arraylike(data) {
  return typeof data === "object" && "length" in data ? data : Array.from(data);
}

// node_modules/d3-selection/src/selection/exit.js
function exit_default() {
  return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
}

// node_modules/d3-selection/src/selection/join.js
function join_default(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter)
      enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update)
      update = update.selection();
  }
  if (onexit == null)
    exit.remove();
  else
    onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

// node_modules/d3-selection/src/selection/merge.js
function merge_default(context) {
  var selection2 = context.selection ? context.selection() : context;
  for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Selection(merges, this._parents);
}

// node_modules/d3-selection/src/selection/order.js
function order_default() {
  for (var groups = this._groups, j = -1, m = groups.length; ++j < m; ) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4)
          next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
}

// node_modules/d3-selection/src/selection/sort.js
function sort_default(compare) {
  if (!compare)
    compare = ascending;
  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }
  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }
  return new Selection(sortgroups, this._parents).order();
}
function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// node_modules/d3-selection/src/selection/call.js
function call_default() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

// node_modules/d3-selection/src/selection/nodes.js
function nodes_default() {
  return Array.from(this);
}

// node_modules/d3-selection/src/selection/node.js
function node_default() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node)
        return node;
    }
  }
  return null;
}

// node_modules/d3-selection/src/selection/size.js
function size_default() {
  let size = 0;
  for (const node of this)
    ++size;
  return size;
}

// node_modules/d3-selection/src/selection/empty.js
function empty_default() {
  return !this.node();
}

// node_modules/d3-selection/src/selection/each.js
function each_default(callback) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i])
        callback.call(node, node.__data__, i, group);
    }
  }
  return this;
}

// node_modules/d3-selection/src/selection/attr.js
function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}
function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}
function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.removeAttribute(name);
    else
      this.setAttribute(name, v);
  };
}
function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.removeAttributeNS(fullname.space, fullname.local);
    else
      this.setAttributeNS(fullname.space, fullname.local, v);
  };
}
function attr_default(name, value) {
  var fullname = namespace_default(name);
  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }
  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}

// node_modules/d3-selection/src/window.js
function window_default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}

// node_modules/d3-selection/src/selection/style.js
function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}
function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.style.removeProperty(name);
    else
      this.style.setProperty(name, v, priority);
  };
}
function style_default(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
  return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
}

// node_modules/d3-selection/src/selection/property.js
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}
function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}
function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      delete this[name];
    else
      this[name] = v;
  };
}
function property_default(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}

// node_modules/d3-selection/src/selection/classed.js
function classArray(string) {
  return string.trim().split(/^|\s+/);
}
function classList(node) {
  return node.classList || new ClassList(node);
}
function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};
function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n)
    list.add(names[i]);
}
function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n)
    list.remove(names[i]);
}
function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}
function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}
function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}
function classed_default(name, value) {
  var names = classArray(name + "");
  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n)
      if (!list.contains(names[i]))
        return false;
    return true;
  }
  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}

// node_modules/d3-selection/src/selection/text.js
function textRemove() {
  this.textContent = "";
}
function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}
function text_default(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}

// node_modules/d3-selection/src/selection/html.js
function htmlRemove() {
  this.innerHTML = "";
}
function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}
function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}
function html_default(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}

// node_modules/d3-selection/src/selection/raise.js
function raise() {
  if (this.nextSibling)
    this.parentNode.appendChild(this);
}
function raise_default() {
  return this.each(raise);
}

// node_modules/d3-selection/src/selection/lower.js
function lower() {
  if (this.previousSibling)
    this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function lower_default() {
  return this.each(lower);
}

// node_modules/d3-selection/src/selection/append.js
function append_default(name) {
  var create = typeof name === "function" ? name : creator_default(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

// node_modules/d3-selection/src/selection/insert.js
function constantNull() {
  return null;
}
function insert_default(name, before) {
  var create = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

// node_modules/d3-selection/src/selection/remove.js
function remove() {
  var parent = this.parentNode;
  if (parent)
    parent.removeChild(this);
}
function remove_default() {
  return this.each(remove);
}

// node_modules/d3-selection/src/selection/clone.js
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function clone_default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

// node_modules/d3-selection/src/selection/datum.js
function datum_default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}

// node_modules/d3-selection/src/selection/on.js
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}
function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0)
      name = t.slice(i + 1), t = t.slice(0, i);
    return { type: t, name };
  });
}
function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on)
      return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i)
      on.length = i;
    else
      delete this.__on;
  };
}
function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on)
      for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
    this.addEventListener(typename.type, listener, options);
    o = { type: typename.type, name: typename.name, value, listener, options };
    if (!on)
      this.__on = [o];
    else
      on.push(o);
  };
}
function on_default(typename, value, options) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;
  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on)
      for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
    return;
  }
  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i)
    this.each(on(typenames[i], value, options));
  return this;
}

// node_modules/d3-selection/src/selection/dispatch.js
function dispatchEvent(node, type, params) {
  var window = window_default(node), event = window.CustomEvent;
  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params)
      event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else
      event.initEvent(type, false, false);
  }
  node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}
function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}
function dispatch_default(type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}

// node_modules/d3-selection/src/selection/iterator.js
function* iterator_default() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i])
        yield node;
    }
  }
}

// node_modules/d3-selection/src/selection/index.js
var root = [null];
function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}
function selection() {
  return new Selection([[document.documentElement]], root);
}
function selection_selection() {
  return this;
}
Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: select_default,
  selectAll: selectAll_default,
  selectChild: selectChild_default,
  selectChildren: selectChildren_default,
  filter: filter_default,
  data: data_default,
  enter: enter_default,
  exit: exit_default,
  join: join_default,
  merge: merge_default,
  selection: selection_selection,
  order: order_default,
  sort: sort_default,
  call: call_default,
  nodes: nodes_default,
  node: node_default,
  size: size_default,
  empty: empty_default,
  each: each_default,
  attr: attr_default,
  style: style_default,
  property: property_default,
  classed: classed_default,
  text: text_default,
  html: html_default,
  raise: raise_default,
  lower: lower_default,
  append: append_default,
  insert: insert_default,
  remove: remove_default,
  clone: clone_default,
  datum: datum_default,
  on: on_default,
  dispatch: dispatch_default,
  [Symbol.iterator]: iterator_default
};

// node_modules/d3-selection/src/select.js
function select_default2(selector) {
  return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
}

// src/rendering/word-cloud-renderer.ts
function buildDeterministicRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = state + 1831565813 | 0;
    let t = Math.imul(state ^ state >>> 15, 1 | state);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function pickRotation(random, preset) {
  if (preset === "horizontal") {
    return 0;
  }
  if (preset === "mostly-horizontal") {
    return random() > 0.85 ? 90 : 0;
  }
  if (preset === "vertical") {
    return random() > 0.2 ? 90 : 0;
  }
  const angles = [-90, -45, 0, 45, 90];
  return angles[Math.floor(random() * angles.length)];
}
function getWordLabel(word, renderSettings) {
  if (!renderSettings.showCountInWordText || word.count < renderSettings.countLabelMinCount) {
    return word.text;
  }
  if (renderSettings.countLabelFormat === "dot") {
    return `${word.text} \xB7 ${word.count}`;
  }
  if (renderSettings.countLabelFormat === "colon") {
    return `${word.text}: ${word.count}`;
  }
  return `${word.text} (${word.count})`;
}
async function drawWordCloud(options, renderSettings) {
  const { containerEl, words, ariaLabel, onWordClick, onProgress } = options;
  const exportBaseName = sanitizeFileName(options.exportBaseName ?? "word-cloud");
  const enableExport = options.enableExport ?? true;
  const width = Math.max(320, containerEl.clientWidth || 700);
  const height = Math.max(320, containerEl.clientHeight || 500);
  const random = renderSettings.deterministicLayout ? buildDeterministicRandom(renderSettings.randomSeed) : Math.random;
  const layoutWords = words.map((word) => ({
    ...word,
    baseText: word.text,
    layoutText: getWordLabel(word, renderSettings)
  }));
  containerEl.classList.add("word-cloud-render-container");
  const svg = select_default2(containerEl).append("svg").attr("width", width).attr("height", height).attr("role", "img").attr("aria-label", ariaLabel);
  const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
  const color = ordinal(Tableau10_default);
  const { default: cloud } = await Promise.resolve().then(() => __toESM(require_d3_cloud()));
  const performance = getLayoutPerformanceProfile(renderSettings.progressDetail);
  const reportProgress = createThrottledProgress2(onProgress, performance.progressThrottleMs);
  const layoutTimeInterval = renderSettings.progressDetail === "unhinged" ? Infinity : Math.max(8, Math.round(renderSettings.layoutTimeIntervalMs));
  await new Promise((resolve) => {
    let laidOutWords = 0;
    const totalWords = Math.max(1, layoutWords.length);
    cloud().size([width, height]).words(layoutWords).text((d) => d.layoutText).timeInterval(layoutTimeInterval).padding(Math.max(0, Math.round(renderSettings.wordPadding))).spiral(renderSettings.spiral).rotate(() => pickRotation(random, renderSettings.rotationPreset)).font(renderSettings.fontFamily || "sans-serif").fontSize((d) => d.size).random(random).on("word", () => {
      laidOutWords += 1;
      if (laidOutWords % performance.wordProgressStride === 0) {
        const layoutPercent = Math.min(99, Math.round(laidOutWords / totalWords * 100));
        reportProgress(`Laying out words... ${laidOutWords}/${layoutWords.length}`, layoutPercent);
      }
    }).on("end", (layoutWords2) => {
      g.selectAll("text").data(layoutWords2).enter().append("text").style("font-size", (d) => `${d.size}px`).style("font-family", renderSettings.fontFamily || "sans-serif").style("fill", (_, i) => color(String(i))).style("cursor", "pointer").attr("tabindex", 0).attr("text-anchor", "middle").attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`).text((d) => d.layoutText).on("click", (_, d) => {
        onWordClick(d.baseText);
      }).on("keydown", (event, d) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onWordClick(d.baseText);
        }
      }).append("title").text((d) => `${d.baseText}: ${d.count} ${d.count === 1 ? "occurrence" : "occurrences"}`);
      reportProgress("Rendering complete.", 100);
      if (enableExport) {
        renderExportControls(containerEl, svg.node(), exportBaseName);
      }
      resolve();
    }).start();
  });
}
function renderExportControls(containerEl, svgEl, exportBaseName) {
  if (!svgEl) {
    return;
  }
  const controlsEl = containerEl.createDiv({ cls: "word-cloud-export-controls" });
  const menuButton = controlsEl.createEl("button", {
    cls: "word-cloud-menu-button",
    text: "\u22EF"
  });
  menuButton.setAttr("aria-label", "Word cloud options");
  const menuEl = controlsEl.createDiv({ cls: "word-cloud-menu" });
  menuEl.setAttr("hidden", "true");
  let removeOutsideListener = null;
  const toggleMenu = (open) => {
    if (open) {
      menuEl.removeAttribute("hidden");
      const onOutsideClick = (event) => {
        const target = event.target;
        if (!(target instanceof Node)) {
          toggleMenu(false);
          return;
        }
        if (!controlsEl.contains(target)) {
          toggleMenu(false);
        }
      };
      document.addEventListener("mousedown", onOutsideClick, true);
      removeOutsideListener = () => {
        document.removeEventListener("mousedown", onOutsideClick, true);
        removeOutsideListener = null;
      };
    } else {
      menuEl.setAttr("hidden", "true");
      if (removeOutsideListener) {
        removeOutsideListener();
      }
    }
  };
  const makeMenuItem = (label, format) => {
    const button = menuEl.createEl("button", { cls: "word-cloud-menu-item", text: `Export ${label}` });
    button.setAttr("aria-label", `Export as ${label}`);
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        await exportSvg(svgEl, format, exportBaseName);
      } catch (error) {
        console.error("Word clouds: export failed", error);
      } finally {
        toggleMenu(false);
      }
    });
  };
  makeMenuItem("SVG", "svg");
  makeMenuItem("PNG", "png");
  makeMenuItem("JPEG", "jpeg");
  menuButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMenu(menuEl.hasAttribute("hidden"));
  });
  menuButton.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleMenu(false);
    }
  });
  menuEl.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      toggleMenu(false);
      menuButton.focus();
    }
  });
}
async function exportSvg(svgEl, format, baseName) {
  const svgText = new XMLSerializer().serializeToString(svgEl);
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  if (format === "svg") {
    triggerBlobDownload(svgBlob, `${baseName}.svg`);
    return;
  }
  const width = Number(svgEl.getAttribute("width") ?? svgEl.viewBox.baseVal.width ?? 800);
  const height = Number(svgEl.getAttribute("height") ?? svgEl.viewBox.baseVal.height ?? 600);
  const bitmapBlob = await rasterizeSvg(svgBlob, width, height, format);
  triggerBlobDownload(bitmapBlob, `${baseName}.${format === "png" ? "png" : "jpg"}`);
}
async function rasterizeSvg(svgBlob, width, height, format) {
  const svgUrl = URL.createObjectURL(svgBlob);
  const image = await loadImage(svgUrl);
  URL.revokeObjectURL(svgUrl);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context unavailable");
  }
  if (format === "jpeg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create bitmap blob"));
        return;
      }
      resolve(blob);
    }, format === "png" ? "image/png" : "image/jpeg", 0.92);
  });
}
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load SVG image"));
    image.src = url;
  });
}
function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function sanitizeFileName(value) {
  return value.trim().replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "word-cloud";
}
function getLayoutPerformanceProfile(detail) {
  if (detail === "unhinged") {
    return {
      progressThrottleMs: 1e6,
      wordProgressStride: Number.MAX_SAFE_INTEGER
    };
  }
  if (detail === "detailed") {
    return {
      progressThrottleMs: 30,
      wordProgressStride: 1
    };
  }
  if (detail === "minimal") {
    return {
      progressThrottleMs: 220,
      wordProgressStride: 12
    };
  }
  return {
    progressThrottleMs: 80,
    wordProgressStride: 4
  };
}
function createThrottledProgress2(onProgress, minIntervalMs) {
  if (!onProgress) {
    return () => void 0;
  }
  let lastReportedAt = 0;
  let lastPercent = -1;
  return (message, percent) => {
    const now = Date.now();
    if (percent !== 100 && percent === lastPercent && now - lastReportedAt < minIntervalMs) {
      return;
    }
    if (percent !== 100 && now - lastReportedAt < minIntervalMs) {
      return;
    }
    lastReportedAt = now;
    lastPercent = percent;
    onProgress(message, percent);
  };
}

// src/views/note-word-cloud-view.ts
var import_obsidian3 = require("obsidian");
var NoteWordCloudView = class extends import_obsidian3.ItemView {
  constructor(leaf, services) {
    super(leaf);
    this.renderNonce = 0;
    this.selectedFilePath = "";
    this.services = services;
  }
  getViewType() {
    return VIEW_TYPE_NOTE_WORD_CLOUD;
  }
  getDisplayText() {
    return "Note word clouds";
  }
  getIcon() {
    return "file-text";
  }
  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("vault-word-cloud-view");
    const topEl = contentEl.createDiv({ cls: "vault-word-cloud-top" });
    const headerEl = topEl.createDiv({ cls: "vault-word-cloud-header" });
    headerEl.createEl("h2", { text: "Note word clouds", cls: "vault-word-cloud-title" });
    const controlsEl = topEl.createDiv({ cls: "vault-word-cloud-controls" });
    const fileFilterEl = controlsEl.createDiv({ cls: "vault-word-cloud-tag-filter" });
    const fileLabelEl = fileFilterEl.createEl("label", { text: "Open note", cls: "vault-word-cloud-tag-label" });
    const fileSelectEl = fileFilterEl.createEl("select", { cls: "vault-word-cloud-mode-select" });
    fileSelectEl.id = "vault-word-cloud-note-select";
    fileLabelEl.setAttr("for", fileSelectEl.id);
    fileSelectEl.setAttr("aria-label", "Choose an open note");
    const activeButton = controlsEl.createEl("button", {
      text: "Use active note",
      cls: "vault-word-cloud-refresh"
    });
    activeButton.setAttr("aria-label", "Use active note");
    const refreshButton = controlsEl.createEl("button", {
      text: "Refresh",
      cls: "vault-word-cloud-refresh"
    });
    refreshButton.setAttr("aria-label", "Refresh word cloud");
    const canvasEl = contentEl.createDiv({ cls: "vault-word-cloud-canvas" });
    this.updateOpenFileOptions(fileSelectEl);
    this.registerDomEvent(fileSelectEl, "change", () => {
      this.selectedFilePath = fileSelectEl.value;
      void this.renderCloud(canvasEl);
    });
    this.registerDomEvent(activeButton, "click", () => {
      const activeFile = this.services.getActiveFile();
      if (activeFile) {
        this.selectedFilePath = activeFile.path;
        this.updateOpenFileOptions(fileSelectEl);
        fileSelectEl.value = this.selectedFilePath;
      }
      void this.renderCloud(canvasEl);
    });
    this.registerDomEvent(refreshButton, "click", () => {
      this.updateOpenFileOptions(fileSelectEl);
      if (!fileSelectEl.value && this.selectedFilePath) {
        this.selectedFilePath = "";
      }
      void this.renderCloud(canvasEl);
    });
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => {
      const activeFile = this.services.getActiveFile();
      if (!activeFile) {
        return;
      }
      if (this.selectedFilePath !== activeFile.path) {
        this.selectedFilePath = activeFile.path;
        this.updateOpenFileOptions(fileSelectEl);
        fileSelectEl.value = this.selectedFilePath;
        void this.renderCloud(canvasEl);
      }
    }));
    await this.renderCloud(canvasEl);
  }
  async onResize() {
    const canvasEl = this.contentEl.querySelector(".vault-word-cloud-canvas");
    if (canvasEl instanceof HTMLDivElement) {
      await this.renderCloud(canvasEl);
    }
  }
  updateOpenFileOptions(selectEl) {
    const openFiles = this.services.getOpenMarkdownFiles();
    const activeFile = this.services.getActiveFile();
    if (!this.selectedFilePath && activeFile) {
      this.selectedFilePath = activeFile.path;
    }
    const selected = this.selectedFilePath;
    selectEl.empty();
    if (openFiles.length === 0) {
      selectEl.createEl("option", { text: "No open markdown notes", value: "" });
      this.selectedFilePath = "";
      return;
    }
    for (const file of openFiles) {
      const option = selectEl.createEl("option", { text: file.path, value: file.path });
      option.selected = file.path === selected;
    }
    this.selectedFilePath = selectEl.value;
  }
  async renderCloud(containerEl) {
    const activeNonce = ++this.renderNonce;
    containerEl.empty();
    const loadingEl = containerEl.createDiv({ cls: "vault-word-cloud-state", text: "Building cloud..." });
    const updateProgress = (message, percent) => {
      if (activeNonce !== this.renderNonce) {
        return;
      }
      loadingEl.setText(`${message} (${percent}%)`);
    };
    try {
      const targetFile = this.services.getOpenMarkdownFiles().find((file) => file.path === this.selectedFilePath);
      if (!targetFile) {
        loadingEl.remove();
        containerEl.createDiv({
          cls: "vault-word-cloud-state",
          text: "Open a markdown note and select it to view a note-specific word cloud."
        });
        return;
      }
      const words = await this.services.collectFileWords(targetFile, updateProgress);
      if (words.length === 0) {
        loadingEl.remove();
        containerEl.createDiv({
          cls: "vault-word-cloud-state",
          text: `No words found in ${targetFile.basename}.`
        });
        return;
      }
      await this.services.drawWordCloud({
        containerEl,
        words,
        ariaLabel: `Word cloud for ${targetFile.basename}`,
        onProgress: updateProgress,
        onWordClick: (word) => {
          void this.services.openSearchForWord(word, { filePath: targetFile.path });
        }
      });
      if (activeNonce !== this.renderNonce) {
        return;
      }
      loadingEl.remove();
    } catch (error) {
      loadingEl.remove();
      console.error("Note word cloud: failed to render cloud", error);
      containerEl.createDiv({
        cls: "vault-word-cloud-state",
        text: "Could not render the word cloud. Open developer console for details."
      });
    }
  }
};

// src/views/vault-word-cloud-view.ts
var import_obsidian4 = require("obsidian");
var VaultWordCloudView = class extends import_obsidian4.ItemView {
  constructor(leaf, services) {
    super(leaf);
    this.renderNonce = 0;
    this.selectedTags = [];
    this.tagMatchMode = "any";
    this.services = services;
  }
  getViewType() {
    return VIEW_TYPE_VAULT_WORD_CLOUD;
  }
  getDisplayText() {
    return "Word clouds";
  }
  getIcon() {
    return "cloud";
  }
  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("vault-word-cloud-view");
    const topEl = contentEl.createDiv({ cls: "vault-word-cloud-top" });
    const headerEl = topEl.createDiv({ cls: "vault-word-cloud-header" });
    headerEl.createEl("h2", { text: "Word clouds", cls: "vault-word-cloud-title" });
    const controlsEl = topEl.createDiv({ cls: "vault-word-cloud-controls" });
    const tagPickerEl = controlsEl.createDiv({ cls: "vault-word-cloud-tag-filter" });
    const tagSelectEl = tagPickerEl.createEl("select", { cls: "vault-word-cloud-mode-select" });
    tagSelectEl.id = "vault-word-cloud-tag-select";
    tagSelectEl.setAttr("aria-label", "Add tag filter");
    const modeEl = controlsEl.createDiv({ cls: "vault-word-cloud-match-mode" });
    modeEl.createEl("span", { text: "Match", cls: "vault-word-cloud-tag-label" });
    const modeSelectEl = modeEl.createEl("select", { cls: "vault-word-cloud-mode-select" });
    modeSelectEl.createEl("option", { text: "Any", value: "any" });
    modeSelectEl.createEl("option", { text: "All", value: "all" });
    modeSelectEl.value = this.tagMatchMode;
    modeSelectEl.setAttr("aria-label", "Tag match mode");
    const refreshButton = controlsEl.createEl("button", {
      text: "Refresh",
      cls: "vault-word-cloud-refresh"
    });
    refreshButton.setAttr("aria-label", "Refresh word cloud");
    const appliedTagsEl = topEl.createDiv({ cls: "vault-word-cloud-applied-tags" });
    const canvasEl = contentEl.createDiv({ cls: "vault-word-cloud-canvas" });
    this.updateTagPickerOptions(tagSelectEl);
    this.renderAppliedTagChips(appliedTagsEl, tagSelectEl, canvasEl);
    this.registerDomEvent(tagSelectEl, "change", () => {
      const selectedTag = tagSelectEl.value;
      if (selectedTag && !this.selectedTags.includes(selectedTag)) {
        this.selectedTags.push(selectedTag);
      }
      tagSelectEl.value = "";
      this.updateTagPickerOptions(tagSelectEl);
      this.renderAppliedTagChips(appliedTagsEl, tagSelectEl, canvasEl);
      void this.renderCloud(canvasEl);
    });
    this.registerDomEvent(modeSelectEl, "change", () => {
      this.tagMatchMode = modeSelectEl.value === "all" ? "all" : "any";
      void this.renderCloud(canvasEl);
    });
    this.registerDomEvent(refreshButton, "click", () => {
      this.updateTagPickerOptions(tagSelectEl);
      void this.renderCloud(canvasEl);
    });
    await this.renderCloud(canvasEl);
  }
  async onResize() {
    const canvasEl = this.contentEl.querySelector(".vault-word-cloud-canvas");
    if (canvasEl instanceof HTMLDivElement) {
      await this.renderCloud(canvasEl);
    }
  }
  updateTagPickerOptions(selectEl) {
    const tags = this.services.getAvailableTags();
    const selectedSet = new Set(this.selectedTags);
    selectEl.empty();
    selectEl.createEl("option", { text: "Add tag filter...", value: "" });
    for (const tag of tags) {
      const option = selectEl.createEl("option", { text: tag, value: tag });
      option.disabled = selectedSet.has(tag);
    }
    selectEl.value = "";
  }
  renderAppliedTagChips(chipsEl, tagSelectEl, canvasEl) {
    chipsEl.empty();
    if (this.selectedTags.length === 0) {
      chipsEl.createSpan({ cls: "vault-word-cloud-chip-empty", text: "No tag filters applied." });
      return;
    }
    for (const tag of this.selectedTags) {
      const chipEl = chipsEl.createDiv({ cls: "vault-word-cloud-chip" });
      chipEl.createSpan({ cls: "vault-word-cloud-chip-text", text: tag });
      const removeButton = chipEl.createEl("button", {
        cls: "vault-word-cloud-chip-remove",
        text: "x"
      });
      removeButton.setAttr("aria-label", `Remove ${tag} filter`);
      this.registerDomEvent(removeButton, "click", () => {
        this.selectedTags = this.selectedTags.filter((value) => value !== tag);
        this.updateTagPickerOptions(tagSelectEl);
        this.renderAppliedTagChips(chipsEl, tagSelectEl, canvasEl);
        void this.renderCloud(canvasEl);
      });
    }
  }
  async renderCloud(containerEl) {
    const activeNonce = ++this.renderNonce;
    containerEl.empty();
    const loadingEl = containerEl.createDiv({ cls: "vault-word-cloud-state", text: "Building cloud..." });
    const updateProgress = (message, percent) => {
      if (activeNonce !== this.renderNonce) {
        return;
      }
      loadingEl.setText(`${message} (${percent}%)`);
    };
    try {
      const words = await this.services.collectVaultWords(this.selectedTags, this.tagMatchMode, updateProgress);
      if (words.length === 0) {
        loadingEl.remove();
        containerEl.createDiv({
          cls: "vault-word-cloud-state",
          text: this.selectedTags.length > 0 ? "No words found for the selected tag filters." : "No words found. Add more note content and refresh."
        });
        return;
      }
      await this.services.drawWordCloud({
        containerEl,
        words,
        ariaLabel: "Word cloud based on markdown files in the vault",
        onProgress: updateProgress,
        onWordClick: (word) => {
          void this.services.openSearchForWord(word, {
            tags: this.selectedTags,
            tagMatchMode: this.tagMatchMode
          });
        }
      });
      if (activeNonce !== this.renderNonce) {
        return;
      }
      loadingEl.remove();
    } catch (error) {
      loadingEl.remove();
      console.error("Vault word cloud: failed to render cloud", error);
      containerEl.createDiv({
        cls: "vault-word-cloud-state",
        text: "Could not render the word cloud. Open developer console for details."
      });
    }
  }
};

// src/main.ts
var VaultWordCloudPlugin = class extends import_obsidian5.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
  }
  async onload() {
    await this.loadSettings();
    this.processor = new WordCloudProcessor(this.app);
    this.registerView(VIEW_TYPE_VAULT_WORD_CLOUD, (leaf) => new VaultWordCloudView(leaf, this));
    this.registerView(VIEW_TYPE_NOTE_WORD_CLOUD, (leaf) => new NoteWordCloudView(leaf, this));
    registerEmbeddedWordCloudProcessor(this, this);
    this.addSettingTab(new VaultWordCloudSettingTab(this));
    this.addRibbonIcon("cloud", "Open word clouds", () => {
      void this.activateVaultWordCloudView();
    });
    this.addCommand({
      id: "open-vault-word-cloud-view",
      name: "Open word clouds",
      callback: () => {
        void this.activateVaultWordCloudView();
      }
    });
    this.addCommand({
      id: "open-note-word-cloud-sidebar",
      name: "Open note word clouds in sidebar",
      callback: () => {
        void this.activateNoteWordCloudView();
      }
    });
  }
  onunload() {
  }
  async activateVaultWordCloudView() {
    const { workspace } = this.app;
    const existingLeaf = workspace.getLeavesOfType(VIEW_TYPE_VAULT_WORD_CLOUD)[0];
    const leaf = existingLeaf ?? workspace.getLeaf(true);
    await leaf.setViewState({
      type: VIEW_TYPE_VAULT_WORD_CLOUD,
      active: true
    });
    workspace.revealLeaf(leaf);
  }
  async activateNoteWordCloudView() {
    const { workspace } = this.app;
    const existingLeaf = workspace.getLeavesOfType(VIEW_TYPE_NOTE_WORD_CLOUD)[0];
    const leaf = existingLeaf ?? workspace.getRightLeaf(false);
    if (!leaf) {
      return;
    }
    await leaf.setViewState({
      type: VIEW_TYPE_NOTE_WORD_CLOUD,
      active: true
    });
    workspace.revealLeaf(leaf);
  }
  getAvailableTags() {
    return this.processor.getAvailableTags();
  }
  getOpenMarkdownFiles() {
    const files = /* @__PURE__ */ new Map();
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (view instanceof import_obsidian5.MarkdownView && view.file) {
        files.set(view.file.path, view.file);
      }
    }
    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile) {
      files.set(activeFile.path, activeFile);
    }
    return [...files.values()].sort((a, b) => a.path.localeCompare(b.path));
  }
  getActiveFile() {
    return this.app.workspace.getActiveFile();
  }
  async collectVaultWords(tagFilters, tagMatchMode, onProgress) {
    const allMarkdownFiles = this.app.vault.getMarkdownFiles();
    return this.processor.collectFromFiles(
      allMarkdownFiles,
      this.getBlacklistSet(),
      this.settings.render,
      onProgress,
      {
        tagFilters,
        tagMatchMode
      }
    );
  }
  async collectFileWords(file, onProgress) {
    return this.processor.collectFromFiles([file], this.getBlacklistSet(), this.settings.render, onProgress);
  }
  async drawWordCloud(options) {
    return drawWordCloud(options, this.settings.render);
  }
  async openSearchForWord(word, options = {}) {
    return openSearchForWord(this.app, word, options);
  }
  async loadSettings() {
    const loaded = await this.loadData();
    const loadedBlacklist = loaded?.blacklistWords;
    const loadedRender = loaded?.render;
    this.settings = {
      blacklistWords: this.normalizeBlacklistWords(loadedBlacklist),
      render: this.normalizeRenderSettings(loadedRender)
    };
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  async addBlacklistWord(rawWord) {
    const normalizedWord = this.normalizeBlacklistWord(rawWord);
    if (!normalizedWord || this.settings.blacklistWords.includes(normalizedWord)) {
      return false;
    }
    this.settings.blacklistWords = [...this.settings.blacklistWords, normalizedWord];
    await this.saveSettings();
    return true;
  }
  async removeBlacklistWord(rawWord) {
    const normalizedWord = this.normalizeBlacklistWord(rawWord);
    this.settings.blacklistWords = this.settings.blacklistWords.filter((word) => word !== normalizedWord);
    await this.saveSettings();
  }
  async resetBlacklistWords() {
    this.settings.blacklistWords = [...DEFAULT_SETTINGS.blacklistWords];
    await this.saveSettings();
  }
  async updateRenderSettings(patch) {
    const merged = {
      ...this.settings.render,
      ...patch
    };
    this.settings.render = this.normalizeRenderSettings(merged);
    await this.saveSettings();
  }
  async resetRenderSettings() {
    this.settings.render = { ...DEFAULT_SETTINGS.render };
    await this.saveSettings();
  }
  getBlacklistSet() {
    return new Set(this.settings.blacklistWords.map((word) => this.normalizeBlacklistWord(word)).filter(Boolean));
  }
  normalizeBlacklistWords(rawValue) {
    if (!Array.isArray(rawValue)) {
      return [...DEFAULT_SETTINGS.blacklistWords];
    }
    const seen = /* @__PURE__ */ new Set();
    for (const entry of rawValue) {
      if (typeof entry !== "string") {
        continue;
      }
      const normalized = this.normalizeBlacklistWord(entry);
      if (normalized) {
        seen.add(normalized);
      }
    }
    return seen.size > 0 ? [...seen] : [...DEFAULT_SETTINGS.blacklistWords];
  }
  normalizeBlacklistWord(word) {
    return word.trim().toLowerCase();
  }
  normalizeRenderSettings(rawValue) {
    const raw = rawValue && typeof rawValue === "object" ? rawValue : {};
    const rotationPreset = raw.rotationPreset === "horizontal" || raw.rotationPreset === "mostly-horizontal" || raw.rotationPreset === "mixed" || raw.rotationPreset === "vertical" ? raw.rotationPreset : DEFAULT_SETTINGS.render.rotationPreset;
    const spiral = raw.spiral === "archimedean" || raw.spiral === "rectangular" ? raw.spiral : DEFAULT_SETTINGS.render.spiral;
    const wordPadding = this.clampNumber(raw.wordPadding, 0, 12, DEFAULT_SETTINGS.render.wordPadding);
    const minFontSize = this.clampNumber(raw.minFontSize, 8, 64, DEFAULT_SETTINGS.render.minFontSize);
    const maxFontSize = this.clampNumber(raw.maxFontSize, 16, 140, DEFAULT_SETTINGS.render.maxFontSize);
    const safeMinFontSize = Math.min(minFontSize, maxFontSize - 1);
    const safeMaxFontSize = Math.max(maxFontSize, safeMinFontSize + 1);
    const fontFamily = typeof raw.fontFamily === "string" && raw.fontFamily.trim().length > 0 ? raw.fontFamily.trim() : DEFAULT_SETTINGS.render.fontFamily;
    const scalingMode = raw.scalingMode === "linear" || raw.scalingMode === "power" || raw.scalingMode === "log" || raw.scalingMode === "rank" ? raw.scalingMode : DEFAULT_SETTINGS.render.scalingMode;
    const emphasis = this.clampFloat(raw.emphasis, 0.5, 3, DEFAULT_SETTINGS.render.emphasis);
    const showCountInWordText = typeof raw.showCountInWordText === "boolean" ? raw.showCountInWordText : DEFAULT_SETTINGS.render.showCountInWordText;
    const countLabelFormat = raw.countLabelFormat === "paren" || raw.countLabelFormat === "dot" || raw.countLabelFormat === "colon" ? raw.countLabelFormat : DEFAULT_SETTINGS.render.countLabelFormat;
    const countLabelMinCount = this.clampNumber(raw.countLabelMinCount, 1, 100, DEFAULT_SETTINGS.render.countLabelMinCount);
    const progressDetail = raw.progressDetail === "minimal" || raw.progressDetail === "balanced" || raw.progressDetail === "detailed" || raw.progressDetail === "unhinged" ? raw.progressDetail : DEFAULT_SETTINGS.render.progressDetail;
    const scanBatchSize = this.clampNumber(raw.scanBatchSize, 8, 64, DEFAULT_SETTINGS.render.scanBatchSize);
    const layoutTimeIntervalMs = this.clampNumber(
      raw.layoutTimeIntervalMs,
      8,
      40,
      DEFAULT_SETTINGS.render.layoutTimeIntervalMs
    );
    const deterministicLayout = typeof raw.deterministicLayout === "boolean" ? raw.deterministicLayout : DEFAULT_SETTINGS.render.deterministicLayout;
    const randomSeed = this.clampNumber(raw.randomSeed, 1, 2147483647, DEFAULT_SETTINGS.render.randomSeed);
    return {
      rotationPreset,
      spiral,
      wordPadding,
      minFontSize: safeMinFontSize,
      maxFontSize: safeMaxFontSize,
      fontFamily,
      scalingMode,
      emphasis,
      showCountInWordText,
      countLabelFormat,
      countLabelMinCount,
      progressDetail,
      scanBatchSize,
      layoutTimeIntervalMs,
      deterministicLayout,
      randomSeed
    };
  }
  clampNumber(value, min, max, fallback) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, Math.round(value)));
  }
  clampFloat(value, min, max, fallback) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, value));
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL2QzLWNsb3VkL25vZGVfbW9kdWxlcy9kMy1kaXNwYXRjaC9kaXN0L2QzLWRpc3BhdGNoLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1jbG91ZC9pbmRleC5qcyIsICIuLi9zcmMvbWFpbi50cyIsICIuLi9zcmMvY29uc3RhbnRzLnRzIiwgIi4uL3NyYy9ibG9jay1yZW5kZXJlcnMvd29yZGNsb3VkLWJsb2NrLXJlbmRlcmVyLnRzIiwgIi4uL3NyYy91dGlscy50cyIsICIuLi9zcmMvYWN0aW9ucy9hcHBseS1zZWFyY2gudHMiLCAiLi4vc3JjL3BpcGVsaW5lL2FkYXB0ZXJzL29ic2lkaWFuLXNvdXJjZS50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RyYXRlZ2llcy9kZWZhdWx0cy50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL2FnZ3JlZ2F0ZS50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL2ZpbHRlci50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL25vcm1hbGl6ZS50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL3JlbmRlci1tb2RlbC50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL3NjYWxlLnRzIiwgIi4uL3NyYy9waXBlbGluZS9zdGFnZXMvc291cmNlLXNlbGVjdGlvbi50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL3Rva2VuaXplLnRzIiwgIi4uL3NyYy9waXBlbGluZS9ydW4tcGlwZWxpbmUudHMiLCAiLi4vc3JjL3Byb2Nlc3NpbmcvdGFnLWZpbHRlci50cyIsICIuLi9zcmMvcHJvY2Vzc2luZy9wcm9jZXNzb3IudHMiLCAiLi4vc3JjL3NldHRpbmdzL2luZGV4LnRzIiwgIi4uL3NyYy9wcm9jZXNzaW5nL3NjYWxpbmcudHMiLCAiLi4vbm9kZV9tb2R1bGVzL2ludGVybm1hcC9zcmMvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9pbml0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvb3JkaW5hbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9jb2xvcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvY2F0ZWdvcmljYWwvVGFibGVhdTEwLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL25hbWVzcGFjZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvbmFtZXNwYWNlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL2NyZWF0b3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0b3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9hcnJheS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3RvckFsbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0QWxsLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL21hdGNoZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdENoaWxkLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3RDaGlsZHJlbi5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZmlsdGVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zcGFyc2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2VudGVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL2NvbnN0YW50LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9kYXRhLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9leGl0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9qb2luLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9tZXJnZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vb3JkZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NvcnQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2NhbGwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL25vZGVzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9ub2RlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zaXplLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lbXB0eS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZWFjaC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vYXR0ci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy93aW5kb3cuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3N0eWxlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9wcm9wZXJ0eS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2xhc3NlZC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vdGV4dC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaHRtbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcmFpc2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2xvd2VyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9hcHBlbmQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2luc2VydC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcmVtb3ZlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9jbG9uZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGF0dW0uanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL29uLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9kaXNwYXRjaC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaXRlcmF0b3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdC5qcyIsICIuLi9zcmMvcmVuZGVyaW5nL3dvcmQtY2xvdWQtcmVuZGVyZXIudHMiLCAiLi4vc3JjL3ZpZXdzL25vdGUtd29yZC1jbG91ZC12aWV3LnRzIiwgIi4uL3NyYy92aWV3cy92YXVsdC13b3JkLWNsb3VkLXZpZXcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIGh0dHBzOi8vZDNqcy5vcmcvZDMtZGlzcGF0Y2gvIHYxLjAuNiBDb3B5cmlnaHQgMjAxOSBNaWtlIEJvc3RvY2tcbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG50eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbnR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuKGdsb2JhbCA9IGdsb2JhbCB8fCBzZWxmLCBmYWN0b3J5KGdsb2JhbC5kMyA9IGdsb2JhbC5kMyB8fCB7fSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbnZhciBub29wID0ge3ZhbHVlOiBmdW5jdGlvbigpIHt9fTtcblxuZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gYXJndW1lbnRzLmxlbmd0aCwgXyA9IHt9LCB0OyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKCEodCA9IGFyZ3VtZW50c1tpXSArIFwiXCIpIHx8ICh0IGluIF8pIHx8IC9bXFxzLl0vLnRlc3QodCkpIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgdHlwZTogXCIgKyB0KTtcbiAgICBfW3RdID0gW107XG4gIH1cbiAgcmV0dXJuIG5ldyBEaXNwYXRjaChfKTtcbn1cblxuZnVuY3Rpb24gRGlzcGF0Y2goXykge1xuICB0aGlzLl8gPSBfO1xufVxuXG5mdW5jdGlvbiBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZXMsIHR5cGVzKSB7XG4gIHJldHVybiB0eXBlbmFtZXMudHJpbSgpLnNwbGl0KC9efFxccysvKS5tYXAoZnVuY3Rpb24odCkge1xuICAgIHZhciBuYW1lID0gXCJcIiwgaSA9IHQuaW5kZXhPZihcIi5cIik7XG4gICAgaWYgKGkgPj0gMCkgbmFtZSA9IHQuc2xpY2UoaSArIDEpLCB0ID0gdC5zbGljZSgwLCBpKTtcbiAgICBpZiAodCAmJiAhdHlwZXMuaGFzT3duUHJvcGVydHkodCkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0KTtcbiAgICByZXR1cm4ge3R5cGU6IHQsIG5hbWU6IG5hbWV9O1xuICB9KTtcbn1cblxuRGlzcGF0Y2gucHJvdG90eXBlID0gZGlzcGF0Y2gucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogRGlzcGF0Y2gsXG4gIG9uOiBmdW5jdGlvbih0eXBlbmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgXyA9IHRoaXMuXyxcbiAgICAgICAgVCA9IHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lICsgXCJcIiwgXyksXG4gICAgICAgIHQsXG4gICAgICAgIGkgPSAtMSxcbiAgICAgICAgbiA9IFQubGVuZ3RoO1xuXG4gICAgLy8gSWYgbm8gY2FsbGJhY2sgd2FzIHNwZWNpZmllZCwgcmV0dXJuIHRoZSBjYWxsYmFjayBvZiB0aGUgZ2l2ZW4gdHlwZSBhbmQgbmFtZS5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKHQgPSAodHlwZW5hbWUgPSBUW2ldKS50eXBlKSAmJiAodCA9IGdldChfW3RdLCB0eXBlbmFtZS5uYW1lKSkpIHJldHVybiB0O1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIGEgdHlwZSB3YXMgc3BlY2lmaWVkLCBzZXQgdGhlIGNhbGxiYWNrIGZvciB0aGUgZ2l2ZW4gdHlwZSBhbmQgbmFtZS5cbiAgICAvLyBPdGhlcndpc2UsIGlmIGEgbnVsbCBjYWxsYmFjayB3YXMgc3BlY2lmaWVkLCByZW1vdmUgY2FsbGJhY2tzIG9mIHRoZSBnaXZlbiBuYW1lLlxuICAgIGlmIChjYWxsYmFjayAhPSBudWxsICYmIHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIGNhbGxiYWNrOiBcIiArIGNhbGxiYWNrKTtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgaWYgKHQgPSAodHlwZW5hbWUgPSBUW2ldKS50eXBlKSBfW3RdID0gc2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUsIGNhbGxiYWNrKTtcbiAgICAgIGVsc2UgaWYgKGNhbGxiYWNrID09IG51bGwpIGZvciAodCBpbiBfKSBfW3RdID0gc2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUsIG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBjb3B5OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29weSA9IHt9LCBfID0gdGhpcy5fO1xuICAgIGZvciAodmFyIHQgaW4gXykgY29weVt0XSA9IF9bdF0uc2xpY2UoKTtcbiAgICByZXR1cm4gbmV3IERpc3BhdGNoKGNvcHkpO1xuICB9LFxuICBjYWxsOiBmdW5jdGlvbih0eXBlLCB0aGF0KSB7XG4gICAgaWYgKChuID0gYXJndW1lbnRzLmxlbmd0aCAtIDIpID4gMCkgZm9yICh2YXIgYXJncyA9IG5ldyBBcnJheShuKSwgaSA9IDAsIG4sIHQ7IGkgPCBuOyArK2kpIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIGlmICghdGhpcy5fLmhhc093blByb3BlcnR5KHR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdHlwZSk7XG4gICAgZm9yICh0ID0gdGhpcy5fW3R5cGVdLCBpID0gMCwgbiA9IHQubGVuZ3RoOyBpIDwgbjsgKytpKSB0W2ldLnZhbHVlLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICB9LFxuICBhcHBseTogZnVuY3Rpb24odHlwZSwgdGhhdCwgYXJncykge1xuICAgIGlmICghdGhpcy5fLmhhc093blByb3BlcnR5KHR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdHlwZSk7XG4gICAgZm9yICh2YXIgdCA9IHRoaXMuX1t0eXBlXSwgaSA9IDAsIG4gPSB0Lmxlbmd0aDsgaSA8IG47ICsraSkgdFtpXS52YWx1ZS5hcHBseSh0aGF0LCBhcmdzKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0KHR5cGUsIG5hbWUpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0eXBlLmxlbmd0aCwgYzsgaSA8IG47ICsraSkge1xuICAgIGlmICgoYyA9IHR5cGVbaV0pLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIHJldHVybiBjLnZhbHVlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXQodHlwZSwgbmFtZSwgY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0eXBlLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIGlmICh0eXBlW2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIHR5cGVbaV0gPSBub29wLCB0eXBlID0gdHlwZS5zbGljZSgwLCBpKS5jb25jYXQodHlwZS5zbGljZShpICsgMSkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmIChjYWxsYmFjayAhPSBudWxsKSB0eXBlLnB1c2goe25hbWU6IG5hbWUsIHZhbHVlOiBjYWxsYmFja30pO1xuICByZXR1cm4gdHlwZTtcbn1cblxuZXhwb3J0cy5kaXNwYXRjaCA9IGRpc3BhdGNoO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSk7XG4iLCAiLy8gV29yZCBjbG91ZCBsYXlvdXQgYnkgSmFzb24gRGF2aWVzLCBodHRwczovL3d3dy5qYXNvbmRhdmllcy5jb20vd29yZGNsb3VkL1xuLy8gQWxnb3JpdGhtIGR1ZSB0byBKb25hdGhhbiBGZWluYmVyZywgaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL3N0YXRpYy5tcmZlaW5iZXJnLmNvbS9idl9jaDAzLnBkZlxuXG5jb25zdCBkaXNwYXRjaCA9IHJlcXVpcmUoXCJkMy1kaXNwYXRjaFwiKS5kaXNwYXRjaDtcblxuY29uc3QgUkFESUFOUyA9IE1hdGguUEkgLyAxODA7XG5cbmNvbnN0IFNQSVJBTFMgPSB7XG4gIGFyY2hpbWVkZWFuOiBhcmNoaW1lZGVhblNwaXJhbCxcbiAgcmVjdGFuZ3VsYXI6IHJlY3Rhbmd1bGFyU3BpcmFsXG59O1xuXG5jb25zdCBjdyA9IDEgPDwgMTEgPj4gNTtcbmNvbnN0IGNoID0gMSA8PCAxMTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNpemUgPSBbMjU2LCAyNTZdLFxuICAgICAgdGV4dCA9IGNsb3VkVGV4dCxcbiAgICAgIGZvbnQgPSBjbG91ZEZvbnQsXG4gICAgICBmb250U2l6ZSA9IGNsb3VkRm9udFNpemUsXG4gICAgICBmb250U3R5bGUgPSBjbG91ZEZvbnROb3JtYWwsXG4gICAgICBmb250V2VpZ2h0ID0gY2xvdWRGb250Tm9ybWFsLFxuICAgICAgcGFkZGluZyA9IGNsb3VkUGFkZGluZyxcbiAgICAgIHNwaXJhbCA9IGFyY2hpbWVkZWFuU3BpcmFsLFxuICAgICAgd29yZHMgPSBbXSxcbiAgICAgIHRpbWVJbnRlcnZhbCA9IEluZmluaXR5LFxuICAgICAgZXZlbnQgPSBkaXNwYXRjaChcIndvcmRcIiwgXCJlbmRcIiksXG4gICAgICB0aW1lciA9IG51bGwsXG4gICAgICByYW5kb20gPSBNYXRoLnJhbmRvbSxcbiAgICAgIHJvdGF0ZSA9ICgpID0+ICh+fihyYW5kb20oKSAqIDYpIC0gMykgKiAzMCxcbiAgICAgIGNsb3VkID0ge30sXG4gICAgICBjYW52YXMgPSBjbG91ZENhbnZhcztcblxuICBjbG91ZC5jYW52YXMgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2FudmFzID0gZnVuY3RvcihfKSwgY2xvdWQpIDogY2FudmFzO1xuICB9O1xuXG4gIGNsb3VkLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRleHRBbmRSYXRpbyA9IGdldENvbnRleHQoY2FudmFzKCkpLFxuICAgICAgICBib2FyZCA9IHplcm9BcnJheSgoc2l6ZVswXSA+PiA1KSAqIHNpemVbMV0pLFxuICAgICAgICBib3VuZHMgPSBudWxsLFxuICAgICAgICBuID0gd29yZHMubGVuZ3RoLFxuICAgICAgICBpID0gLTEsXG4gICAgICAgIHRhZ3MgPSBbXSxcbiAgICAgICAgZGF0YSA9IHdvcmRzLm1hcChmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgZC50ZXh0ID0gdGV4dC5jYWxsKHRoaXMsIGQsIGkpO1xuICAgICAgICAgIGQuZm9udCA9IGZvbnQuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgICBkLnN0eWxlID0gZm9udFN0eWxlLmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgZC53ZWlnaHQgPSBmb250V2VpZ2h0LmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgZC5yb3RhdGUgPSByb3RhdGUuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgICBkLnNpemUgPSB+fmZvbnRTaXplLmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgZC5wYWRkaW5nID0gcGFkZGluZy5jYWxsKHRoaXMsIGQsIGkpO1xuICAgICAgICAgIHJldHVybiBkO1xuICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGIuc2l6ZSAtIGEuc2l6ZTsgfSk7XG5cbiAgICBpZiAodGltZXIpIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwoc3RlcCwgMCk7XG4gICAgc3RlcCgpO1xuXG4gICAgcmV0dXJuIGNsb3VkO1xuXG4gICAgZnVuY3Rpb24gc3RlcCgpIHtcbiAgICAgIHZhciBzdGFydCA9IERhdGUubm93KCk7XG4gICAgICB3aGlsZSAoRGF0ZS5ub3coKSAtIHN0YXJ0IDwgdGltZUludGVydmFsICYmICsraSA8IG4gJiYgdGltZXIpIHtcbiAgICAgICAgdmFyIGQgPSBkYXRhW2ldO1xuICAgICAgICBkLnggPSAoc2l6ZVswXSAqIChyYW5kb20oKSArIC41KSkgPj4gMTtcbiAgICAgICAgZC55ID0gKHNpemVbMV0gKiAocmFuZG9tKCkgKyAuNSkpID4+IDE7XG4gICAgICAgIGNsb3VkU3ByaXRlKGNvbnRleHRBbmRSYXRpbywgZCwgZGF0YSwgaSk7XG4gICAgICAgIGlmIChkLmhhc1RleHQgJiYgcGxhY2UoYm9hcmQsIGQsIGJvdW5kcykpIHtcbiAgICAgICAgICB0YWdzLnB1c2goZCk7XG4gICAgICAgICAgZXZlbnQuY2FsbChcIndvcmRcIiwgY2xvdWQsIGQpO1xuICAgICAgICAgIGlmIChib3VuZHMpIGNsb3VkQm91bmRzKGJvdW5kcywgZCk7XG4gICAgICAgICAgZWxzZSBib3VuZHMgPSBbe3g6IGQueCArIGQueDAsIHk6IGQueSArIGQueTB9LCB7eDogZC54ICsgZC54MSwgeTogZC55ICsgZC55MX1dO1xuICAgICAgICAgIC8vIFRlbXBvcmFyeSBoYWNrXG4gICAgICAgICAgZC54IC09IHNpemVbMF0gPj4gMTtcbiAgICAgICAgICBkLnkgLT0gc2l6ZVsxXSA+PiAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaSA+PSBuKSB7XG4gICAgICAgIGNsb3VkLnN0b3AoKTtcbiAgICAgICAgZXZlbnQuY2FsbChcImVuZFwiLCBjbG91ZCwgdGFncywgYm91bmRzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG91ZC5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgIHRpbWVyID0gbnVsbDtcbiAgICB9XG4gICAgZm9yIChjb25zdCBkIG9mIHdvcmRzKSB7XG4gICAgICBkZWxldGUgZC5zcHJpdGU7XG4gICAgfVxuICAgIHJldHVybiBjbG91ZDtcbiAgfTtcblxuICBmdW5jdGlvbiBnZXRDb250ZXh0KGNhbnZhcykge1xuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIsIHt3aWxsUmVhZEZyZXF1ZW50bHk6IHRydWV9KTtcblxuICAgIGNhbnZhcy53aWR0aCA9IGNhbnZhcy5oZWlnaHQgPSAxO1xuICAgIGNvbnN0IHJhdGlvID0gTWF0aC5zcXJ0KGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIDEsIDEpLmRhdGEubGVuZ3RoID4+IDIpO1xuICAgIGNhbnZhcy53aWR0aCA9IChjdyA8PCA1KSAvIHJhdGlvO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBjaCAvIHJhdGlvO1xuXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBjb250ZXh0LnN0cm9rZVN0eWxlID0gXCJyZWRcIjtcblxuICAgIHJldHVybiB7Y29udGV4dCwgcmF0aW99O1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2UoYm9hcmQsIHRhZywgYm91bmRzKSB7XG4gICAgdmFyIHBlcmltZXRlciA9IFt7eDogMCwgeTogMH0sIHt4OiBzaXplWzBdLCB5OiBzaXplWzFdfV0sXG4gICAgICAgIHN0YXJ0WCA9IHRhZy54LFxuICAgICAgICBzdGFydFkgPSB0YWcueSxcbiAgICAgICAgbWF4RGVsdGEgPSBNYXRoLnNxcnQoc2l6ZVswXSAqIHNpemVbMF0gKyBzaXplWzFdICogc2l6ZVsxXSksXG4gICAgICAgIHMgPSBzcGlyYWwoc2l6ZSksXG4gICAgICAgIGR0ID0gcmFuZG9tKCkgPCAuNSA/IDEgOiAtMSxcbiAgICAgICAgdCA9IC1kdCxcbiAgICAgICAgZHhkeSxcbiAgICAgICAgZHgsXG4gICAgICAgIGR5O1xuXG4gICAgd2hpbGUgKGR4ZHkgPSBzKHQgKz0gZHQpKSB7XG4gICAgICBkeCA9IH5+ZHhkeVswXTtcbiAgICAgIGR5ID0gfn5keGR5WzFdO1xuXG4gICAgICBpZiAoTWF0aC5taW4oTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpID49IG1heERlbHRhKSBicmVhaztcblxuICAgICAgdGFnLnggPSBzdGFydFggKyBkeDtcbiAgICAgIHRhZy55ID0gc3RhcnRZICsgZHk7XG5cbiAgICAgIGlmICh0YWcueCArIHRhZy54MCA8IDAgfHwgdGFnLnkgKyB0YWcueTAgPCAwIHx8XG4gICAgICAgICAgdGFnLnggKyB0YWcueDEgPiBzaXplWzBdIHx8IHRhZy55ICsgdGFnLnkxID4gc2l6ZVsxXSkgY29udGludWU7XG4gICAgICAvLyBUT0RPIG9ubHkgY2hlY2sgZm9yIGNvbGxpc2lvbnMgd2l0aGluIGN1cnJlbnQgYm91bmRzLlxuICAgICAgaWYgKCFib3VuZHMgfHwgY29sbGlkZVJlY3RzKHRhZywgYm91bmRzKSkge1xuICAgICAgICBpZiAoIWNsb3VkQ29sbGlkZSh0YWcsIGJvYXJkLCBzaXplWzBdKSkge1xuICAgICAgICAgIHZhciBzcHJpdGUgPSB0YWcuc3ByaXRlLFxuICAgICAgICAgICAgICB3ID0gdGFnLndpZHRoID4+IDUsXG4gICAgICAgICAgICAgIHN3ID0gc2l6ZVswXSA+PiA1LFxuICAgICAgICAgICAgICBseCA9IHRhZy54IC0gKHcgPDwgNCksXG4gICAgICAgICAgICAgIHN4ID0gbHggJiAweDdmLFxuICAgICAgICAgICAgICBtc3ggPSAzMiAtIHN4LFxuICAgICAgICAgICAgICBoID0gdGFnLnkxIC0gdGFnLnkwLFxuICAgICAgICAgICAgICB4ID0gKHRhZy55ICsgdGFnLnkwKSAqIHN3ICsgKGx4ID4+IDUpLFxuICAgICAgICAgICAgICBsYXN0O1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaDsgaisrKSB7XG4gICAgICAgICAgICBsYXN0ID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHc7IGkrKykge1xuICAgICAgICAgICAgICBib2FyZFt4ICsgaV0gfD0gKGxhc3QgPDwgbXN4KSB8IChpIDwgdyA/IChsYXN0ID0gc3ByaXRlW2ogKiB3ICsgaV0pID4+PiBzeCA6IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeCArPSBzdztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY2xvdWQudGltZUludGVydmFsID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRpbWVJbnRlcnZhbCA9IF8gPT0gbnVsbCA/IEluZmluaXR5IDogXywgY2xvdWQpIDogdGltZUludGVydmFsO1xuICB9O1xuXG4gIGNsb3VkLndvcmRzID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHdvcmRzID0gXywgY2xvdWQpIDogd29yZHM7XG4gIH07XG5cbiAgY2xvdWQuc2l6ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzaXplID0gWytfWzBdLCArX1sxXV0sIGNsb3VkKSA6IHNpemU7XG4gIH07XG5cbiAgY2xvdWQuZm9udCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmb250ID0gZnVuY3RvcihfKSwgY2xvdWQpIDogZm9udDtcbiAgfTtcblxuICBjbG91ZC5mb250U3R5bGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZm9udFN0eWxlID0gZnVuY3RvcihfKSwgY2xvdWQpIDogZm9udFN0eWxlO1xuICB9O1xuXG4gIGNsb3VkLmZvbnRXZWlnaHQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZm9udFdlaWdodCA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IGZvbnRXZWlnaHQ7XG4gIH07XG5cbiAgY2xvdWQucm90YXRlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJvdGF0ZSA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IHJvdGF0ZTtcbiAgfTtcblxuICBjbG91ZC50ZXh0ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRleHQgPSBmdW5jdG9yKF8pLCBjbG91ZCkgOiB0ZXh0O1xuICB9O1xuXG4gIGNsb3VkLnNwaXJhbCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzcGlyYWwgPSBTUElSQUxTW19dIHx8IF8sIGNsb3VkKSA6IHNwaXJhbDtcbiAgfTtcblxuICBjbG91ZC5mb250U2l6ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmb250U2l6ZSA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IGZvbnRTaXplO1xuICB9O1xuXG4gIGNsb3VkLnBhZGRpbmcgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocGFkZGluZyA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IHBhZGRpbmc7XG4gIH07XG5cbiAgY2xvdWQucmFuZG9tID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJhbmRvbSA9IF8sIGNsb3VkKSA6IHJhbmRvbTtcbiAgfTtcblxuICBjbG91ZC5vbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZSA9IGV2ZW50Lm9uLmFwcGx5KGV2ZW50LCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gZXZlbnQgPyBjbG91ZCA6IHZhbHVlO1xuICB9O1xuXG4gIHJldHVybiBjbG91ZDtcbn07XG5cbmZ1bmN0aW9uIGNsb3VkVGV4dChkKSB7XG4gIHJldHVybiBkLnRleHQ7XG59XG5cbmZ1bmN0aW9uIGNsb3VkRm9udCgpIHtcbiAgcmV0dXJuIFwic2VyaWZcIjtcbn1cblxuZnVuY3Rpb24gY2xvdWRGb250Tm9ybWFsKCkge1xuICByZXR1cm4gXCJub3JtYWxcIjtcbn1cblxuZnVuY3Rpb24gY2xvdWRGb250U2l6ZShkKSB7XG4gIHJldHVybiBNYXRoLnNxcnQoZC52YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGNsb3VkUGFkZGluZygpIHtcbiAgcmV0dXJuIDE7XG59XG5cbi8vIEZldGNoZXMgYSBtb25vY2hyb21lIHNwcml0ZSBiaXRtYXAgZm9yIHRoZSBzcGVjaWZpZWQgdGV4dC5cbi8vIExvYWQgaW4gYmF0Y2hlcyBmb3Igc3BlZWQuXG5mdW5jdGlvbiBjbG91ZFNwcml0ZShjb250ZXh0QW5kUmF0aW8sIGQsIGRhdGEsIGRpKSB7XG4gIGlmIChkLnNwcml0ZSkgcmV0dXJuO1xuICB2YXIgYyA9IGNvbnRleHRBbmRSYXRpby5jb250ZXh0LFxuICAgICAgcmF0aW8gPSBjb250ZXh0QW5kUmF0aW8ucmF0aW87XG5cbiAgYy5jbGVhclJlY3QoMCwgMCwgKGN3IDw8IDUpIC8gcmF0aW8sIGNoIC8gcmF0aW8pO1xuICB2YXIgeCA9IDAsXG4gICAgICB5ID0gMCxcbiAgICAgIG1heGggPSAwLFxuICAgICAgbiA9IGRhdGEubGVuZ3RoO1xuICAtLWRpO1xuICB3aGlsZSAoKytkaSA8IG4pIHtcbiAgICBkID0gZGF0YVtkaV07XG4gICAgYy5zYXZlKCk7XG4gICAgYy5mb250ID0gZC5zdHlsZSArIFwiIFwiICsgZC53ZWlnaHQgKyBcIiBcIiArIH5+KChkLnNpemUgKyAxKSAvIHJhdGlvKSArIFwicHggXCIgKyBkLmZvbnQ7XG4gICAgY29uc3QgbWV0cmljcyA9IGMubWVhc3VyZVRleHQoZC50ZXh0KTtcbiAgICBjb25zdCBhbmNob3IgPSAtTWF0aC5mbG9vcihtZXRyaWNzLndpZHRoIC8gMik7XG4gICAgbGV0IHcgPSAobWV0cmljcy53aWR0aCArIDEpICogcmF0aW87XG4gICAgbGV0IGggPSBkLnNpemUgPDwgMTtcbiAgICBpZiAoZC5yb3RhdGUpIHtcbiAgICAgIHZhciBzciA9IE1hdGguc2luKGQucm90YXRlICogUkFESUFOUyksXG4gICAgICAgICAgY3IgPSBNYXRoLmNvcyhkLnJvdGF0ZSAqIFJBRElBTlMpLFxuICAgICAgICAgIHdjciA9IHcgKiBjcixcbiAgICAgICAgICB3c3IgPSB3ICogc3IsXG4gICAgICAgICAgaGNyID0gaCAqIGNyLFxuICAgICAgICAgIGhzciA9IGggKiBzcjtcbiAgICAgIHcgPSAoTWF0aC5tYXgoTWF0aC5hYnMod2NyICsgaHNyKSwgTWF0aC5hYnMod2NyIC0gaHNyKSkgKyAweDFmKSA+PiA1IDw8IDU7XG4gICAgICBoID0gfn5NYXRoLm1heChNYXRoLmFicyh3c3IgKyBoY3IpLCBNYXRoLmFicyh3c3IgLSBoY3IpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdyA9ICh3ICsgMHgxZikgPj4gNSA8PCA1O1xuICAgIH1cbiAgICBpZiAoaCA+IG1heGgpIG1heGggPSBoO1xuICAgIGlmICh4ICsgdyA+PSAoY3cgPDwgNSkpIHtcbiAgICAgIHggPSAwO1xuICAgICAgeSArPSBtYXhoO1xuICAgICAgbWF4aCA9IDA7XG4gICAgfVxuICAgIGlmICh5ICsgaCA+PSBjaCkgYnJlYWs7XG4gICAgYy50cmFuc2xhdGUoKHggKyAodyA+PiAxKSkgLyByYXRpbywgKHkgKyAoaCA+PiAxKSkgLyByYXRpbyk7XG4gICAgaWYgKGQucm90YXRlKSBjLnJvdGF0ZShkLnJvdGF0ZSAqIFJBRElBTlMpO1xuICAgIGMuZmlsbFRleHQoZC50ZXh0LCBhbmNob3IsIDApO1xuICAgIGlmIChkLnBhZGRpbmcpIGMubGluZVdpZHRoID0gMiAqIGQucGFkZGluZywgYy5zdHJva2VUZXh0KGQudGV4dCwgYW5jaG9yLCAwKTtcbiAgICBjLnJlc3RvcmUoKTtcbiAgICBkLndpZHRoID0gdztcbiAgICBkLmhlaWdodCA9IGg7XG4gICAgZC54b2ZmID0geDtcbiAgICBkLnlvZmYgPSB5O1xuICAgIGQueDEgPSB3ID4+IDE7XG4gICAgZC55MSA9IGggPj4gMTtcbiAgICBkLngwID0gLWQueDE7XG4gICAgZC55MCA9IC1kLnkxO1xuICAgIGQuaGFzVGV4dCA9IHRydWU7XG4gICAgeCArPSB3O1xuICB9XG4gIHZhciBwaXhlbHMgPSBjLmdldEltYWdlRGF0YSgwLCAwLCAoY3cgPDwgNSkgLyByYXRpbywgY2ggLyByYXRpbykuZGF0YSxcbiAgICAgIHNwcml0ZSA9IFtdO1xuICB3aGlsZSAoLS1kaSA+PSAwKSB7XG4gICAgZCA9IGRhdGFbZGldO1xuICAgIGlmICghZC5oYXNUZXh0KSBjb250aW51ZTtcbiAgICB2YXIgdyA9IGQud2lkdGgsXG4gICAgICAgIHczMiA9IHcgPj4gNSxcbiAgICAgICAgaCA9IGQueTEgLSBkLnkwO1xuICAgIC8vIFplcm8gdGhlIGJ1ZmZlclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaCAqIHczMjsgaSsrKSBzcHJpdGVbaV0gPSAwO1xuICAgIHggPSBkLnhvZmY7XG4gICAgaWYgKHggPT0gbnVsbCkgcmV0dXJuO1xuICAgIHkgPSBkLnlvZmY7XG4gICAgdmFyIHNlZW4gPSAwLFxuICAgICAgICBzZWVuUm93ID0gLTE7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBoOyBqKyspIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdzsgaSsrKSB7XG4gICAgICAgIHZhciBrID0gdzMyICogaiArIChpID4+IDUpLFxuICAgICAgICAgICAgbSA9IHBpeGVsc1soKHkgKyBqKSAqIChjdyA8PCA1KSArICh4ICsgaSkpIDw8IDJdID8gMSA8PCAoMzEgLSAoaSAlIDMyKSkgOiAwO1xuICAgICAgICBzcHJpdGVba10gfD0gbTtcbiAgICAgICAgc2VlbiB8PSBtO1xuICAgICAgfVxuICAgICAgaWYgKHNlZW4pIHNlZW5Sb3cgPSBqO1xuICAgICAgZWxzZSB7XG4gICAgICAgIGQueTArKztcbiAgICAgICAgaC0tO1xuICAgICAgICBqLS07XG4gICAgICAgIHkrKztcbiAgICAgIH1cbiAgICB9XG4gICAgZC55MSA9IGQueTAgKyBzZWVuUm93O1xuICAgIGQuc3ByaXRlID0gc3ByaXRlLnNsaWNlKDAsIChkLnkxIC0gZC55MCkgKiB3MzIpO1xuICB9XG59XG5cbi8vIFVzZSBtYXNrLWJhc2VkIGNvbGxpc2lvbiBkZXRlY3Rpb24uXG5mdW5jdGlvbiBjbG91ZENvbGxpZGUodGFnLCBib2FyZCwgc3cpIHtcbiAgc3cgPj49IDU7XG4gIHZhciBzcHJpdGUgPSB0YWcuc3ByaXRlLFxuICAgICAgdyA9IHRhZy53aWR0aCA+PiA1LFxuICAgICAgbHggPSB0YWcueCAtICh3IDw8IDQpLFxuICAgICAgc3ggPSBseCAmIDB4N2YsXG4gICAgICBtc3ggPSAzMiAtIHN4LFxuICAgICAgaCA9IHRhZy55MSAtIHRhZy55MCxcbiAgICAgIHggPSAodGFnLnkgKyB0YWcueTApICogc3cgKyAobHggPj4gNSksXG4gICAgICBsYXN0O1xuICBmb3IgKHZhciBqID0gMDsgaiA8IGg7IGorKykge1xuICAgIGxhc3QgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHc7IGkrKykge1xuICAgICAgaWYgKCgobGFzdCA8PCBtc3gpIHwgKGkgPCB3ID8gKGxhc3QgPSBzcHJpdGVbaiAqIHcgKyBpXSkgPj4+IHN4IDogMCkpXG4gICAgICAgICAgJiBib2FyZFt4ICsgaV0pIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB4ICs9IHN3O1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY2xvdWRCb3VuZHMoYm91bmRzLCBkKSB7XG4gIHZhciBiMCA9IGJvdW5kc1swXSxcbiAgICAgIGIxID0gYm91bmRzWzFdO1xuICBpZiAoZC54ICsgZC54MCA8IGIwLngpIGIwLnggPSBkLnggKyBkLngwO1xuICBpZiAoZC55ICsgZC55MCA8IGIwLnkpIGIwLnkgPSBkLnkgKyBkLnkwO1xuICBpZiAoZC54ICsgZC54MSA+IGIxLngpIGIxLnggPSBkLnggKyBkLngxO1xuICBpZiAoZC55ICsgZC55MSA+IGIxLnkpIGIxLnkgPSBkLnkgKyBkLnkxO1xufVxuXG5mdW5jdGlvbiBjb2xsaWRlUmVjdHMoYSwgYikge1xuICByZXR1cm4gYS54ICsgYS54MSA+IGJbMF0ueCAmJiBhLnggKyBhLngwIDwgYlsxXS54ICYmIGEueSArIGEueTEgPiBiWzBdLnkgJiYgYS55ICsgYS55MCA8IGJbMV0ueTtcbn1cblxuZnVuY3Rpb24gYXJjaGltZWRlYW5TcGlyYWwoc2l6ZSkge1xuICB2YXIgZSA9IHNpemVbMF0gLyBzaXplWzFdO1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBbZSAqICh0ICo9IC4xKSAqIE1hdGguY29zKHQpLCB0ICogTWF0aC5zaW4odCldO1xuICB9O1xufVxuXG5mdW5jdGlvbiByZWN0YW5ndWxhclNwaXJhbChzaXplKSB7XG4gIHZhciBkeSA9IDQsXG4gICAgICBkeCA9IGR5ICogc2l6ZVswXSAvIHNpemVbMV0sXG4gICAgICB4ID0gMCxcbiAgICAgIHkgPSAwO1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHZhciBzaWduID0gdCA8IDAgPyAtMSA6IDE7XG4gICAgLy8gU2VlIHRyaWFuZ3VsYXIgbnVtYmVyczogVF9uID0gbiAqIChuICsgMSkgLyAyLlxuICAgIHN3aXRjaCAoKE1hdGguc3FydCgxICsgNCAqIHNpZ24gKiB0KSAtIHNpZ24pICYgMykge1xuICAgICAgY2FzZSAwOiAgeCArPSBkeDsgYnJlYWs7XG4gICAgICBjYXNlIDE6ICB5ICs9IGR5OyBicmVhaztcbiAgICAgIGNhc2UgMjogIHggLT0gZHg7IGJyZWFrO1xuICAgICAgZGVmYXVsdDogeSAtPSBkeTsgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBbeCwgeV07XG4gIH07XG59XG5cbi8vIFRPRE8gcmV1c2UgYXJyYXlzP1xuZnVuY3Rpb24gemVyb0FycmF5KG4pIHtcbiAgdmFyIGEgPSBbXSxcbiAgICAgIGkgPSAtMTtcbiAgd2hpbGUgKCsraSA8IG4pIGFbaV0gPSAwO1xuICByZXR1cm4gYTtcbn1cblxuZnVuY3Rpb24gY2xvdWRDYW52YXMoKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xufVxuXG5mdW5jdGlvbiBmdW5jdG9yKGQpIHtcbiAgcmV0dXJuIHR5cGVvZiBkID09PSBcImZ1bmN0aW9uXCIgPyBkIDogZnVuY3Rpb24oKSB7IHJldHVybiBkOyB9O1xufVxuIiwgImltcG9ydCB7IE1hcmtkb3duVmlldywgUGx1Z2luLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQsIFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VEIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgcmVnaXN0ZXJFbWJlZGRlZFdvcmRDbG91ZFByb2Nlc3NvciB9IGZyb20gJy4vYmxvY2stcmVuZGVyZXJzL3dvcmRjbG91ZC1ibG9jay1yZW5kZXJlcic7XG5pbXBvcnQgeyBvcGVuU2VhcmNoRm9yV29yZCB9IGZyb20gJy4vYWN0aW9ucy9hcHBseS1zZWFyY2gnO1xuaW1wb3J0IHsgV29yZENsb3VkUHJvY2Vzc29yIH0gZnJvbSAnLi9wcm9jZXNzaW5nL3Byb2Nlc3Nvcic7XG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTLCBWYXVsdFdvcmRDbG91ZFNldHRpbmdUYWIsIHR5cGUgV29yZENsb3VkU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJztcbmltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFNlYXJjaE9wdGlvbnMsIFRhZ01hdGNoTW9kZSwgV29yZENsb3VkUmVuZGVyT3B0aW9ucywgV29yZENsb3VkU2VydmljZXMsIFdlaWdodGVkV29yZCB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgZHJhd1dvcmRDbG91ZCB9IGZyb20gJy4vcmVuZGVyaW5nL3dvcmQtY2xvdWQtcmVuZGVyZXInO1xuaW1wb3J0IHsgTm90ZVdvcmRDbG91ZFZpZXcgfSBmcm9tICcuL3ZpZXdzL25vdGUtd29yZC1jbG91ZC12aWV3JztcbmltcG9ydCB7IFZhdWx0V29yZENsb3VkVmlldyB9IGZyb20gJy4vdmlld3MvdmF1bHQtd29yZC1jbG91ZC12aWV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmF1bHRXb3JkQ2xvdWRQbHVnaW4gZXh0ZW5kcyBQbHVnaW4gaW1wbGVtZW50cyBXb3JkQ2xvdWRTZXJ2aWNlcyB7XG4gIHNldHRpbmdzOiBXb3JkQ2xvdWRTZXR0aW5ncyA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUyB9O1xuICBwcml2YXRlIHByb2Nlc3NvciE6IFdvcmRDbG91ZFByb2Nlc3NvcjtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLnByb2Nlc3NvciA9IG5ldyBXb3JkQ2xvdWRQcm9jZXNzb3IodGhpcy5hcHApO1xuXG4gICAgdGhpcy5yZWdpc3RlclZpZXcoVklFV19UWVBFX1ZBVUxUX1dPUkRfQ0xPVUQsIChsZWFmKSA9PiBuZXcgVmF1bHRXb3JkQ2xvdWRWaWV3KGxlYWYsIHRoaXMpKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhWSUVXX1RZUEVfTk9URV9XT1JEX0NMT1VELCAobGVhZikgPT4gbmV3IE5vdGVXb3JkQ2xvdWRWaWV3KGxlYWYsIHRoaXMpKTtcbiAgICByZWdpc3RlckVtYmVkZGVkV29yZENsb3VkUHJvY2Vzc29yKHRoaXMsIHRoaXMpO1xuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgVmF1bHRXb3JkQ2xvdWRTZXR0aW5nVGFiKHRoaXMpKTtcblxuICAgIHRoaXMuYWRkUmliYm9uSWNvbignY2xvdWQnLCAnT3BlbiB3b3JkIGNsb3VkcycsICgpID0+IHtcbiAgICAgIHZvaWQgdGhpcy5hY3RpdmF0ZVZhdWx0V29yZENsb3VkVmlldygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiAnb3Blbi12YXVsdC13b3JkLWNsb3VkLXZpZXcnLFxuICAgICAgbmFtZTogJ09wZW4gd29yZCBjbG91ZHMnLFxuICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgdm9pZCB0aGlzLmFjdGl2YXRlVmF1bHRXb3JkQ2xvdWRWaWV3KCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiAnb3Blbi1ub3RlLXdvcmQtY2xvdWQtc2lkZWJhcicsXG4gICAgICBuYW1lOiAnT3BlbiBub3RlIHdvcmQgY2xvdWRzIGluIHNpZGViYXInLFxuICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgdm9pZCB0aGlzLmFjdGl2YXRlTm90ZVdvcmRDbG91ZFZpZXcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBvbnVubG9hZCgpOiB2b2lkIHtcbiAgICAvLyBPYnNpZGlhbiBhdXRvbWF0aWNhbGx5IGRldGFjaGVzIHZpZXdzIHJlZ2lzdGVyZWQgYnkgdGhpcyBwbHVnaW4uXG4gIH1cblxuICBhc3luYyBhY3RpdmF0ZVZhdWx0V29yZENsb3VkVmlldygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XG4gICAgY29uc3QgZXhpc3RpbmdMZWFmID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEVfVkFVTFRfV09SRF9DTE9VRClbMF07XG5cbiAgICBjb25zdCBsZWFmID0gZXhpc3RpbmdMZWFmID8/IHdvcmtzcGFjZS5nZXRMZWFmKHRydWUpO1xuICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHtcbiAgICAgIHR5cGU6IFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VELFxuICAgICAgYWN0aXZlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgd29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gIH1cblxuICBhc3luYyBhY3RpdmF0ZU5vdGVXb3JkQ2xvdWRWaWV3KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBjb25zdCBleGlzdGluZ0xlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQpWzBdO1xuXG4gICAgY29uc3QgbGVhZiA9IGV4aXN0aW5nTGVhZiA/PyB3b3Jrc3BhY2UuZ2V0UmlnaHRMZWFmKGZhbHNlKTtcbiAgICBpZiAoIWxlYWYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCBsZWFmLnNldFZpZXdTdGF0ZSh7XG4gICAgICB0eXBlOiBWSUVXX1RZUEVfTk9URV9XT1JEX0NMT1VELFxuICAgICAgYWN0aXZlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgd29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gIH1cblxuICBnZXRBdmFpbGFibGVUYWdzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzb3IuZ2V0QXZhaWxhYmxlVGFncygpO1xuICB9XG5cbiAgZ2V0T3Blbk1hcmtkb3duRmlsZXMoKTogVEZpbGVbXSB7XG4gICAgY29uc3QgZmlsZXMgPSBuZXcgTWFwPHN0cmluZywgVEZpbGU+KCk7XG5cbiAgICBmb3IgKGNvbnN0IGxlYWYgb2YgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZSgnbWFya2Rvd24nKSkge1xuICAgICAgY29uc3QgdmlldyA9IGxlYWYudmlldztcbiAgICAgIGlmICh2aWV3IGluc3RhbmNlb2YgTWFya2Rvd25WaWV3ICYmIHZpZXcuZmlsZSkge1xuICAgICAgICBmaWxlcy5zZXQodmlldy5maWxlLnBhdGgsIHZpZXcuZmlsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlRmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKGFjdGl2ZUZpbGUpIHtcbiAgICAgIGZpbGVzLnNldChhY3RpdmVGaWxlLnBhdGgsIGFjdGl2ZUZpbGUpO1xuICAgIH1cblxuICAgIHJldHVybiBbLi4uZmlsZXMudmFsdWVzKCldLnNvcnQoKGEsIGIpID0+IGEucGF0aC5sb2NhbGVDb21wYXJlKGIucGF0aCkpO1xuICB9XG5cbiAgZ2V0QWN0aXZlRmlsZSgpOiBURmlsZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICB9XG5cbiAgYXN5bmMgY29sbGVjdFZhdWx0V29yZHMoXG4gICAgdGFnRmlsdGVyczogc3RyaW5nW10sXG4gICAgdGFnTWF0Y2hNb2RlOiBUYWdNYXRjaE1vZGUsXG4gICAgb25Qcm9ncmVzcz86IChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4gdm9pZCxcbiAgKTogUHJvbWlzZTxXZWlnaHRlZFdvcmRbXT4ge1xuICAgIGNvbnN0IGFsbE1hcmtkb3duRmlsZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XG4gICAgcmV0dXJuIHRoaXMucHJvY2Vzc29yLmNvbGxlY3RGcm9tRmlsZXMoXG4gICAgICBhbGxNYXJrZG93bkZpbGVzLFxuICAgICAgdGhpcy5nZXRCbGFja2xpc3RTZXQoKSxcbiAgICAgIHRoaXMuc2V0dGluZ3MucmVuZGVyLFxuICAgICAgb25Qcm9ncmVzcyxcbiAgICAgIHtcbiAgICAgICAgdGFnRmlsdGVycyxcbiAgICAgICAgdGFnTWF0Y2hNb2RlLFxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgY29sbGVjdEZpbGVXb3JkcyhmaWxlOiBURmlsZSwgb25Qcm9ncmVzcz86IChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4gdm9pZCk6IFByb21pc2U8V2VpZ2h0ZWRXb3JkW10+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzb3IuY29sbGVjdEZyb21GaWxlcyhbZmlsZV0sIHRoaXMuZ2V0QmxhY2tsaXN0U2V0KCksIHRoaXMuc2V0dGluZ3MucmVuZGVyLCBvblByb2dyZXNzKTtcbiAgfVxuXG4gIGFzeW5jIGRyYXdXb3JkQ2xvdWQob3B0aW9uczogV29yZENsb3VkUmVuZGVyT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBkcmF3V29yZENsb3VkKG9wdGlvbnMsIHRoaXMuc2V0dGluZ3MucmVuZGVyKTtcbiAgfVxuXG4gIGFzeW5jIG9wZW5TZWFyY2hGb3JXb3JkKHdvcmQ6IHN0cmluZywgb3B0aW9uczogU2VhcmNoT3B0aW9ucyA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIG9wZW5TZWFyY2hGb3JXb3JkKHRoaXMuYXBwLCB3b3JkLCBvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBsb2FkZWQgPSBhd2FpdCB0aGlzLmxvYWREYXRhKCk7XG4gICAgY29uc3QgbG9hZGVkQmxhY2tsaXN0ID0gbG9hZGVkPy5ibGFja2xpc3RXb3JkcztcbiAgICBjb25zdCBsb2FkZWRSZW5kZXIgPSBsb2FkZWQ/LnJlbmRlcjtcbiAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgYmxhY2tsaXN0V29yZHM6IHRoaXMubm9ybWFsaXplQmxhY2tsaXN0V29yZHMobG9hZGVkQmxhY2tsaXN0KSxcbiAgICAgIHJlbmRlcjogdGhpcy5ub3JtYWxpemVSZW5kZXJTZXR0aW5ncyhsb2FkZWRSZW5kZXIpLFxuICAgIH07XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIGFzeW5jIGFkZEJsYWNrbGlzdFdvcmQocmF3V29yZDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3Qgbm9ybWFsaXplZFdvcmQgPSB0aGlzLm5vcm1hbGl6ZUJsYWNrbGlzdFdvcmQocmF3V29yZCk7XG4gICAgaWYgKCFub3JtYWxpemVkV29yZCB8fCB0aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzLmluY2x1ZGVzKG5vcm1hbGl6ZWRXb3JkKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuc2V0dGluZ3MuYmxhY2tsaXN0V29yZHMgPSBbLi4udGhpcy5zZXR0aW5ncy5ibGFja2xpc3RXb3Jkcywgbm9ybWFsaXplZFdvcmRdO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhc3luYyByZW1vdmVCbGFja2xpc3RXb3JkKHJhd1dvcmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRXb3JkID0gdGhpcy5ub3JtYWxpemVCbGFja2xpc3RXb3JkKHJhd1dvcmQpO1xuICAgIHRoaXMuc2V0dGluZ3MuYmxhY2tsaXN0V29yZHMgPSB0aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzLmZpbHRlcigod29yZCkgPT4gd29yZCAhPT0gbm9ybWFsaXplZFdvcmQpO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICBhc3luYyByZXNldEJsYWNrbGlzdFdvcmRzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuc2V0dGluZ3MuYmxhY2tsaXN0V29yZHMgPSBbLi4uREVGQVVMVF9TRVRUSU5HUy5ibGFja2xpc3RXb3Jkc107XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZVJlbmRlclNldHRpbmdzKHBhdGNoOiBQYXJ0aWFsPFJlbmRlclNldHRpbmdzPik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG1lcmdlZCA9IHtcbiAgICAgIC4uLnRoaXMuc2V0dGluZ3MucmVuZGVyLFxuICAgICAgLi4ucGF0Y2gsXG4gICAgfTtcbiAgICB0aGlzLnNldHRpbmdzLnJlbmRlciA9IHRoaXMubm9ybWFsaXplUmVuZGVyU2V0dGluZ3MobWVyZ2VkKTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgYXN5bmMgcmVzZXRSZW5kZXJTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzLnJlbmRlciA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIgfTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRCbGFja2xpc3RTZXQoKTogU2V0PHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgU2V0KHRoaXMuc2V0dGluZ3MuYmxhY2tsaXN0V29yZHMubWFwKCh3b3JkKSA9PiB0aGlzLm5vcm1hbGl6ZUJsYWNrbGlzdFdvcmQod29yZCkpLmZpbHRlcihCb29sZWFuKSk7XG4gIH1cblxuICBwcml2YXRlIG5vcm1hbGl6ZUJsYWNrbGlzdFdvcmRzKHJhd1ZhbHVlOiB1bmtub3duKTogc3RyaW5nW10ge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShyYXdWYWx1ZSkpIHtcbiAgICAgIHJldHVybiBbLi4uREVGQVVMVF9TRVRUSU5HUy5ibGFja2xpc3RXb3Jkc107XG4gICAgfVxuXG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgcmF3VmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgZW50cnkgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IHRoaXMubm9ybWFsaXplQmxhY2tsaXN0V29yZChlbnRyeSk7XG4gICAgICBpZiAobm9ybWFsaXplZCkge1xuICAgICAgICBzZWVuLmFkZChub3JtYWxpemVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2Vlbi5zaXplID4gMCA/IFsuLi5zZWVuXSA6IFsuLi5ERUZBVUxUX1NFVFRJTkdTLmJsYWNrbGlzdFdvcmRzXTtcbiAgfVxuXG4gIHByaXZhdGUgbm9ybWFsaXplQmxhY2tsaXN0V29yZCh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB3b3JkLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBub3JtYWxpemVSZW5kZXJTZXR0aW5ncyhyYXdWYWx1ZTogdW5rbm93bik6IFJlbmRlclNldHRpbmdzIHtcbiAgICBjb25zdCByYXcgPSAocmF3VmFsdWUgJiYgdHlwZW9mIHJhd1ZhbHVlID09PSAnb2JqZWN0JykgPyByYXdWYWx1ZSBhcyBQYXJ0aWFsPFJlbmRlclNldHRpbmdzPiA6IHt9O1xuXG4gICAgY29uc3Qgcm90YXRpb25QcmVzZXQgPSByYXcucm90YXRpb25QcmVzZXQgPT09ICdob3Jpem9udGFsJ1xuICAgICAgfHwgcmF3LnJvdGF0aW9uUHJlc2V0ID09PSAnbW9zdGx5LWhvcml6b250YWwnXG4gICAgICB8fCByYXcucm90YXRpb25QcmVzZXQgPT09ICdtaXhlZCdcbiAgICAgIHx8IHJhdy5yb3RhdGlvblByZXNldCA9PT0gJ3ZlcnRpY2FsJ1xuICAgICAgPyByYXcucm90YXRpb25QcmVzZXRcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIucm90YXRpb25QcmVzZXQ7XG5cbiAgICBjb25zdCBzcGlyYWwgPSByYXcuc3BpcmFsID09PSAnYXJjaGltZWRlYW4nIHx8IHJhdy5zcGlyYWwgPT09ICdyZWN0YW5ndWxhcidcbiAgICAgID8gcmF3LnNwaXJhbFxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5zcGlyYWw7XG5cbiAgICBjb25zdCB3b3JkUGFkZGluZyA9IHRoaXMuY2xhbXBOdW1iZXIocmF3LndvcmRQYWRkaW5nLCAwLCAxMiwgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIud29yZFBhZGRpbmcpO1xuICAgIGNvbnN0IG1pbkZvbnRTaXplID0gdGhpcy5jbGFtcE51bWJlcihyYXcubWluRm9udFNpemUsIDgsIDY0LCBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5taW5Gb250U2l6ZSk7XG4gICAgY29uc3QgbWF4Rm9udFNpemUgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy5tYXhGb250U2l6ZSwgMTYsIDE0MCwgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIubWF4Rm9udFNpemUpO1xuICAgIGNvbnN0IHNhZmVNaW5Gb250U2l6ZSA9IE1hdGgubWluKG1pbkZvbnRTaXplLCBtYXhGb250U2l6ZSAtIDEpO1xuICAgIGNvbnN0IHNhZmVNYXhGb250U2l6ZSA9IE1hdGgubWF4KG1heEZvbnRTaXplLCBzYWZlTWluRm9udFNpemUgKyAxKTtcblxuICAgIGNvbnN0IGZvbnRGYW1pbHkgPSB0eXBlb2YgcmF3LmZvbnRGYW1pbHkgPT09ICdzdHJpbmcnICYmIHJhdy5mb250RmFtaWx5LnRyaW0oKS5sZW5ndGggPiAwXG4gICAgICA/IHJhdy5mb250RmFtaWx5LnRyaW0oKVxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5mb250RmFtaWx5O1xuXG4gICAgY29uc3Qgc2NhbGluZ01vZGUgPSByYXcuc2NhbGluZ01vZGUgPT09ICdsaW5lYXInXG4gICAgICB8fCByYXcuc2NhbGluZ01vZGUgPT09ICdwb3dlcidcbiAgICAgIHx8IHJhdy5zY2FsaW5nTW9kZSA9PT0gJ2xvZydcbiAgICAgIHx8IHJhdy5zY2FsaW5nTW9kZSA9PT0gJ3JhbmsnXG4gICAgICA/IHJhdy5zY2FsaW5nTW9kZVxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5zY2FsaW5nTW9kZTtcblxuICAgIGNvbnN0IGVtcGhhc2lzID0gdGhpcy5jbGFtcEZsb2F0KHJhdy5lbXBoYXNpcywgMC41LCAzLCBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5lbXBoYXNpcyk7XG5cbiAgICBjb25zdCBzaG93Q291bnRJbldvcmRUZXh0ID0gdHlwZW9mIHJhdy5zaG93Q291bnRJbldvcmRUZXh0ID09PSAnYm9vbGVhbidcbiAgICAgID8gcmF3LnNob3dDb3VudEluV29yZFRleHRcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuc2hvd0NvdW50SW5Xb3JkVGV4dDtcblxuICAgIGNvbnN0IGNvdW50TGFiZWxGb3JtYXQgPSByYXcuY291bnRMYWJlbEZvcm1hdCA9PT0gJ3BhcmVuJ1xuICAgICAgfHwgcmF3LmNvdW50TGFiZWxGb3JtYXQgPT09ICdkb3QnXG4gICAgICB8fCByYXcuY291bnRMYWJlbEZvcm1hdCA9PT0gJ2NvbG9uJ1xuICAgICAgPyByYXcuY291bnRMYWJlbEZvcm1hdFxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5jb3VudExhYmVsRm9ybWF0O1xuXG4gICAgY29uc3QgY291bnRMYWJlbE1pbkNvdW50ID0gdGhpcy5jbGFtcE51bWJlcihyYXcuY291bnRMYWJlbE1pbkNvdW50LCAxLCAxMDAsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLmNvdW50TGFiZWxNaW5Db3VudCk7XG5cbiAgICBjb25zdCBwcm9ncmVzc0RldGFpbCA9IHJhdy5wcm9ncmVzc0RldGFpbCA9PT0gJ21pbmltYWwnXG4gICAgICB8fCByYXcucHJvZ3Jlc3NEZXRhaWwgPT09ICdiYWxhbmNlZCdcbiAgICAgIHx8IHJhdy5wcm9ncmVzc0RldGFpbCA9PT0gJ2RldGFpbGVkJ1xuICAgICAgfHwgcmF3LnByb2dyZXNzRGV0YWlsID09PSAndW5oaW5nZWQnXG4gICAgICA/IHJhdy5wcm9ncmVzc0RldGFpbFxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5wcm9ncmVzc0RldGFpbDtcblxuICAgIGNvbnN0IHNjYW5CYXRjaFNpemUgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy5zY2FuQmF0Y2hTaXplLCA4LCA2NCwgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuc2NhbkJhdGNoU2l6ZSk7XG4gICAgY29uc3QgbGF5b3V0VGltZUludGVydmFsTXMgPSB0aGlzLmNsYW1wTnVtYmVyKFxuICAgICAgcmF3LmxheW91dFRpbWVJbnRlcnZhbE1zLFxuICAgICAgOCxcbiAgICAgIDQwLFxuICAgICAgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIubGF5b3V0VGltZUludGVydmFsTXMsXG4gICAgKTtcblxuICAgIGNvbnN0IGRldGVybWluaXN0aWNMYXlvdXQgPSB0eXBlb2YgcmF3LmRldGVybWluaXN0aWNMYXlvdXQgPT09ICdib29sZWFuJ1xuICAgICAgPyByYXcuZGV0ZXJtaW5pc3RpY0xheW91dFxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5kZXRlcm1pbmlzdGljTGF5b3V0O1xuXG4gICAgY29uc3QgcmFuZG9tU2VlZCA9IHRoaXMuY2xhbXBOdW1iZXIocmF3LnJhbmRvbVNlZWQsIDEsIDIxNDc0ODM2NDcsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnJhbmRvbVNlZWQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJvdGF0aW9uUHJlc2V0LFxuICAgICAgc3BpcmFsLFxuICAgICAgd29yZFBhZGRpbmcsXG4gICAgICBtaW5Gb250U2l6ZTogc2FmZU1pbkZvbnRTaXplLFxuICAgICAgbWF4Rm9udFNpemU6IHNhZmVNYXhGb250U2l6ZSxcbiAgICAgIGZvbnRGYW1pbHksXG4gICAgICBzY2FsaW5nTW9kZSxcbiAgICAgIGVtcGhhc2lzLFxuICAgICAgc2hvd0NvdW50SW5Xb3JkVGV4dCxcbiAgICAgIGNvdW50TGFiZWxGb3JtYXQsXG4gICAgICBjb3VudExhYmVsTWluQ291bnQsXG4gICAgICBwcm9ncmVzc0RldGFpbCxcbiAgICAgIHNjYW5CYXRjaFNpemUsXG4gICAgICBsYXlvdXRUaW1lSW50ZXJ2YWxNcyxcbiAgICAgIGRldGVybWluaXN0aWNMYXlvdXQsXG4gICAgICByYW5kb21TZWVkLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGNsYW1wTnVtYmVyKHZhbHVlOiB1bmtub3duLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIsIGZhbGxiYWNrOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInIHx8IE51bWJlci5pc05hTih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxsYmFjaztcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCBNYXRoLnJvdW5kKHZhbHVlKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGFtcEZsb2F0KHZhbHVlOiB1bmtub3duLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIsIGZhbGxiYWNrOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInIHx8IE51bWJlci5pc05hTih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxsYmFjaztcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCB2YWx1ZSkpO1xuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VEID0gJ3ZhdWx0LXdvcmQtY2xvdWQtdmlldyc7XG5leHBvcnQgY29uc3QgVklFV19UWVBFX05PVEVfV09SRF9DTE9VRCA9ICdub3RlLXdvcmQtY2xvdWQtdmlldyc7XG5leHBvcnQgY29uc3QgTUFYX1dPUkRTID0gMTQwO1xuZXhwb3J0IGNvbnN0IE1JTl9XT1JEX0xFTkdUSCA9IDM7XG5leHBvcnQgY29uc3QgRlJPTlRNQVRURVJfUEFUVEVSTiA9IC9eLS0tXFxzKlxcbltcXHNcXFNdKj9cXG4tLS1cXHMqKD86XFxufCQpLztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU1RPUF9XT1JEUzogc3RyaW5nW10gPSBbXG4gICd0aGUnLCAnYW5kJywgJ2ZvcicsICd0aGF0JywgJ3RoaXMnLCAnd2l0aCcsICdmcm9tJywgJ2FyZScsICd3YXMnLCAnd2VyZScsICdoYXZlJywgJ2hhcycsICdoYWQnLFxuICAneW91JywgJ3lvdXInLCAndGhleScsICd0aGVtJywgJ3RoZWlyJywgJ2l0cycsICdvdXInLCAnb3VycycsICdoaXMnLCAnaGVyJywgJ3NoZScsICdoaW0nLCAnbm90JyxcbiAgJ2J1dCcsICdjYW4nLCAnd2lsbCcsICdhbGwnLCAnYW55JywgJ29uZScsICd0d28nLCAndG9vJywgJ3VzZScsICd1c2luZycsICdpbnRvJywgJ291dCcsICdhYm91dCcsXG4gICd0aGVyZScsICd0aGVuJywgJ3RoYW4nLCAnd2hlbicsICd3aGF0JywgJ3doZXJlJywgJ3doaWNoJywgJ3dobycsICd3aG9tJywgJ2hvdycsICd3aHknLCAnYWxzbycsXG4gICdqdXN0JywgJ2xpa2UnLCAnc29tZScsICdtb3JlJywgJ21vc3QnLCAnbXVjaCcsICdtYW55JywgJ3ZlcnknLCAnZWFjaCcsICdvdGhlcicsICdzdWNoJywgJ29ubHknLFxuICAnbm90ZScsICdub3RlcycsICd0b2RvJywgJ2RvbmUnLCAnbnVsbCcsICd0cnVlJywgJ2ZhbHNlJywgJ2h0dHAnLCAnaHR0cHMnLCAnd3d3JywgJ2NvbSdcbl07XG4iLCAiaW1wb3J0IHsgTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCwgUGx1Z2luLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgVGFnTWF0Y2hNb2RlLCBXb3JkQ2xvdWRTZXJ2aWNlcyB9IGZyb20gJy4uL3R5cGVzJztcblxudHlwZSBFbWJlZGRlZFdvcmRDbG91ZE9wdGlvbnMgPSB7XG4gIHNjb3BlOiAnbm90ZScgfCAndmF1bHQnO1xuICB0YWdzOiBzdHJpbmdbXTtcbiAgbWF0Y2g6IFRhZ01hdGNoTW9kZTtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIG5vdGVQYXRoPzogc3RyaW5nO1xufTtcblxuY29uc3QgREVGQVVMVF9PUFRJT05TOiBFbWJlZGRlZFdvcmRDbG91ZE9wdGlvbnMgPSB7XG4gIHNjb3BlOiAnbm90ZScsXG4gIHRhZ3M6IFtdLFxuICBtYXRjaDogJ2FueScsXG4gIGhlaWdodDogMzIwLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRW1iZWRkZWRXb3JkQ2xvdWRQcm9jZXNzb3IoXG4gIHBsdWdpbjogUGx1Z2luLFxuICBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXMsXG4pOiB2b2lkIHtcbiAgY29uc3QgcmVuZGVyID0gYXN5bmMgKHNvdXJjZTogc3RyaW5nLCBlbDogSFRNTEVsZW1lbnQsIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBwYXJzZU9wdGlvbnMoc291cmNlKTtcblxuICAgIGVsLmVtcHR5KCk7XG4gICAgY29uc3Qgd3JhcHBlckVsID0gZWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1lbWJlZCcgfSk7XG4gICAgY29uc3Qgc3RhdGVFbCA9IHdyYXBwZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLXN0YXRlJywgdGV4dDogJ0J1aWxkaW5nIGNsb3VkLi4uJyB9KTtcbiAgICBjb25zdCBjYW52YXNFbCA9IHdyYXBwZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLWNhbnZhcycgfSk7XG4gICAgY2FudmFzRWwuc3R5bGUuaGVpZ2h0ID0gYCR7b3B0aW9ucy5oZWlnaHR9cHhgO1xuXG4gICAgY29uc3QgdXBkYXRlUHJvZ3Jlc3MgPSAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIHN0YXRlRWwuc2V0VGV4dChgJHttZXNzYWdlfSAoJHtwZXJjZW50fSUpYCk7XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgd29yZHM7XG4gICAgICBsZXQgc2VhcmNoU2NvcGU6IHsgZmlsZVBhdGg/OiBzdHJpbmc7IHRhZ3M/OiBzdHJpbmdbXTsgdGFnTWF0Y2hNb2RlPzogVGFnTWF0Y2hNb2RlIH0gPSB7fTtcblxuICAgICAgaWYgKG9wdGlvbnMuc2NvcGUgPT09ICdub3RlJykge1xuICAgICAgICBjb25zdCBmaWxlID0gcmVzb2x2ZVRhcmdldEZpbGUocGx1Z2luLCBjdHgsIG9wdGlvbnMubm90ZVBhdGgpO1xuICAgICAgICBpZiAoIWZpbGUpIHtcbiAgICAgICAgICBzdGF0ZUVsLnNldFRleHQoJ0NvdWxkIG5vdCBmaW5kIG5vdGUgZm9yIGVtYmVkZGVkIHdvcmQgY2xvdWQuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgd29yZHMgPSBhd2FpdCBzZXJ2aWNlcy5jb2xsZWN0RmlsZVdvcmRzKGZpbGUsIHVwZGF0ZVByb2dyZXNzKTtcbiAgICAgICAgc2VhcmNoU2NvcGUgPSB7IGZpbGVQYXRoOiBmaWxlLnBhdGggfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdvcmRzID0gYXdhaXQgc2VydmljZXMuY29sbGVjdFZhdWx0V29yZHMob3B0aW9ucy50YWdzLCBvcHRpb25zLm1hdGNoLCB1cGRhdGVQcm9ncmVzcyk7XG4gICAgICAgIHNlYXJjaFNjb3BlID0geyB0YWdzOiBvcHRpb25zLnRhZ3MsIHRhZ01hdGNoTW9kZTogb3B0aW9ucy5tYXRjaCB9O1xuICAgICAgfVxuXG4gICAgICBpZiAod29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHN0YXRlRWwuc2V0VGV4dCgnTm8gd29yZHMgZm91bmQgZm9yIHRoaXMgZW1iZWRkZWQgY2xvdWQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgc2VydmljZXMuZHJhd1dvcmRDbG91ZCh7XG4gICAgICAgIGNvbnRhaW5lckVsOiBjYW52YXNFbCxcbiAgICAgICAgd29yZHMsXG4gICAgICAgIGFyaWFMYWJlbDogJ0VtYmVkZGVkIHdvcmQgY2xvdWQnLFxuICAgICAgICBvblByb2dyZXNzOiB1cGRhdGVQcm9ncmVzcyxcbiAgICAgICAgb25Xb3JkQ2xpY2s6ICh3b3JkKSA9PiB7XG4gICAgICAgICAgdm9pZCBzZXJ2aWNlcy5vcGVuU2VhcmNoRm9yV29yZCh3b3JkLCBzZWFyY2hTY29wZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgc3RhdGVFbC5yZW1vdmUoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignV29yZCBjbG91ZHM6IGZhaWxlZCB0byByZW5kZXIgZW1iZWRkZWQgY2xvdWQnLCBlcnJvcik7XG4gICAgICBzdGF0ZUVsLnNldFRleHQoJ0NvdWxkIG5vdCByZW5kZXIgZW1iZWRkZWQgd29yZCBjbG91ZC4nKTtcbiAgICB9XG4gIH07XG5cbiAgcGx1Z2luLnJlZ2lzdGVyTWFya2Rvd25Db2RlQmxvY2tQcm9jZXNzb3IoJ3dvcmRjbG91ZCcsIHJlbmRlcik7XG4gIHBsdWdpbi5yZWdpc3Rlck1hcmtkb3duQ29kZUJsb2NrUHJvY2Vzc29yKCd3b3JkLWNsb3VkJywgcmVuZGVyKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVRhcmdldEZpbGUocGx1Z2luOiBQbHVnaW4sIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCwgbm90ZVBhdGg/OiBzdHJpbmcpOiBURmlsZSB8IG51bGwge1xuICBpZiAobm90ZVBhdGgpIHtcbiAgICBjb25zdCBub3JtYWxpemVkUGF0aCA9IG5vdGVQYXRoLnRyaW0oKTtcbiAgICBjb25zdCByZXNvbHZlZCA9IHBsdWdpbi5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKG5vcm1hbGl6ZWRQYXRoKTtcbiAgICByZXR1cm4gcmVzb2x2ZWQgaW5zdGFuY2VvZiBURmlsZSA/IHJlc29sdmVkIDogbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGZyb21Db250ZXh0ID0gcGx1Z2luLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoY3R4LnNvdXJjZVBhdGgpO1xuICByZXR1cm4gZnJvbUNvbnRleHQgaW5zdGFuY2VvZiBURmlsZSA/IGZyb21Db250ZXh0IDogbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VPcHRpb25zKHNvdXJjZTogc3RyaW5nKTogRW1iZWRkZWRXb3JkQ2xvdWRPcHRpb25zIHtcbiAgY29uc3Qgb3B0aW9uczogRW1iZWRkZWRXb3JkQ2xvdWRPcHRpb25zID0geyAuLi5ERUZBVUxUX09QVElPTlMgfTtcbiAgY29uc3QgbGluZXMgPSBzb3VyY2Uuc3BsaXQoJ1xcbicpO1xuXG4gIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xuICAgIGNvbnN0IHRyaW1tZWQgPSBsaW5lLnRyaW0oKTtcbiAgICBpZiAoIXRyaW1tZWQgfHwgdHJpbW1lZC5zdGFydHNXaXRoKCcjJykpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHNlcGFyYXRvckluZGV4ID0gdHJpbW1lZC5pbmRleE9mKCc6Jyk7XG4gICAgaWYgKHNlcGFyYXRvckluZGV4ID09PSAtMSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgcmF3S2V5ID0gdHJpbW1lZC5zbGljZSgwLCBzZXBhcmF0b3JJbmRleCkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgcmF3VmFsdWUgPSB0cmltbWVkLnNsaWNlKHNlcGFyYXRvckluZGV4ICsgMSkudHJpbSgpO1xuXG4gICAgaWYgKHJhd0tleSA9PT0gJ3Njb3BlJykge1xuICAgICAgb3B0aW9ucy5zY29wZSA9IHJhd1ZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICd2YXVsdCcgPyAndmF1bHQnIDogJ25vdGUnO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ21hdGNoJykge1xuICAgICAgb3B0aW9ucy5tYXRjaCA9IHJhd1ZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICdhbGwnID8gJ2FsbCcgOiAnYW55JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICd0YWdzJykge1xuICAgICAgb3B0aW9ucy50YWdzID0gcmF3VmFsdWVcbiAgICAgICAgLnNwbGl0KCcsJylcbiAgICAgICAgLm1hcCgodmFsdWUpID0+IHZhbHVlLnRyaW0oKSlcbiAgICAgICAgLmZpbHRlcigodmFsdWUpID0+IHZhbHVlLmxlbmd0aCA+IDApO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ2hlaWdodCcpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IE51bWJlci5wYXJzZUludChyYXdWYWx1ZSwgMTApO1xuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xuICAgICAgICBvcHRpb25zLmhlaWdodCA9IE1hdGgubWluKDkwMCwgTWF0aC5tYXgoMTgwLCBwYXJzZWQpKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdub3RlJykge1xuICAgICAgb3B0aW9ucy5ub3RlUGF0aCA9IHJhd1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvcHRpb25zO1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVUYWcodGFnOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB0cmltbWVkID0gdGFnLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIXRyaW1tZWQpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXR1cm4gdHJpbW1lZC5zdGFydHNXaXRoKCcjJykgPyB0cmltbWVkIDogYCMke3RyaW1tZWR9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUZvclNlYXJjaCh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdGVkTXVsdGlWYWx1ZXMoc2VsZWN0RWw6IEhUTUxTZWxlY3RFbGVtZW50KTogc3RyaW5nW10ge1xuICByZXR1cm4gQXJyYXkuZnJvbShzZWxlY3RFbC5zZWxlY3RlZE9wdGlvbnMpLm1hcCgob3B0aW9uKSA9PiBvcHRpb24udmFsdWUpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHR5cGUgeyBTZWFyY2hPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZXNjYXBlRm9yU2VhcmNoLCBub3JtYWxpemVUYWcgfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvcGVuU2VhcmNoRm9yV29yZChhcHA6IEFwcCwgd29yZDogc3RyaW5nLCBvcHRpb25zOiBTZWFyY2hPcHRpb25zID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW2BcIiR7ZXNjYXBlRm9yU2VhcmNoKHdvcmQpfVwiYF07XG5cbiAgaWYgKG9wdGlvbnMuZmlsZVBhdGgpIHtcbiAgICBwYXJ0cy5wdXNoKGBwYXRoOlwiJHtlc2NhcGVGb3JTZWFyY2gob3B0aW9ucy5maWxlUGF0aCl9XCJgKTtcbiAgfVxuXG4gIGNvbnN0IHRhZ3MgPSAob3B0aW9ucy50YWdzID8/IFtdKVxuICAgIC5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpXG4gICAgLmZpbHRlcigodGFnKSA9PiB0YWcubGVuZ3RoID4gMCk7XG5cbiAgaWYgKHRhZ3MubGVuZ3RoID4gMCkge1xuICAgIGlmIChvcHRpb25zLnRhZ01hdGNoTW9kZSA9PT0gJ2FsbCcpIHtcbiAgICAgIGZvciAoY29uc3QgdGFnIG9mIHRhZ3MpIHtcbiAgICAgICAgcGFydHMucHVzaCh0YWcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0cy5wdXNoKGAoJHt0YWdzLmpvaW4oJyBPUiAnKX0pYCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcXVlcnkgPSBwYXJ0cy5qb2luKCcgJyk7XG4gIGNvbnN0IGV4aXN0aW5nU2VhcmNoTGVhZiA9IGFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKCdzZWFyY2gnKVswXTtcbiAgY29uc3Qgc2VhcmNoTGVhZiA9IGV4aXN0aW5nU2VhcmNoTGVhZiA/PyBhcHAud29ya3NwYWNlLmdldFJpZ2h0TGVhZihmYWxzZSkgPz8gYXBwLndvcmtzcGFjZS5nZXRMZWFmKHRydWUpO1xuXG4gIGlmICghc2VhcmNoTGVhZikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGF3YWl0IHNlYXJjaExlYWYuc2V0Vmlld1N0YXRlKHtcbiAgICB0eXBlOiAnc2VhcmNoJyxcbiAgICBhY3RpdmU6IHRydWUsXG4gICAgc3RhdGU6IHtcbiAgICAgIHF1ZXJ5LFxuICAgIH0sXG4gIH0pO1xuXG4gIGFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihzZWFyY2hMZWFmKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFwcCwgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBub3JtYWxpemVUYWcgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgdHlwZSB7IFBpcGVsaW5lRG9jdW1lbnQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWFkUGlwZWxpbmVEb2N1bWVudHMoXG4gIGFwcDogQXBwLFxuICBmaWxlczogVEZpbGVbXSxcbiAgcmVhZEJhdGNoU2l6ZTogbnVtYmVyLFxuICBvblByb2dyZXNzPzogKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB2b2lkLFxuKTogUHJvbWlzZTxQaXBlbGluZURvY3VtZW50W10+IHtcbiAgY29uc3QgZG9jdW1lbnRzOiBQaXBlbGluZURvY3VtZW50W10gPSBbXTtcbiAgY29uc3QgdG90YWxGaWxlcyA9IE1hdGgubWF4KDEsIGZpbGVzLmxlbmd0aCk7XG5cbiAgZm9yIChsZXQgYmF0Y2hTdGFydCA9IDA7IGJhdGNoU3RhcnQgPCBmaWxlcy5sZW5ndGg7IGJhdGNoU3RhcnQgKz0gcmVhZEJhdGNoU2l6ZSkge1xuICAgIGNvbnN0IGJhdGNoID0gZmlsZXMuc2xpY2UoYmF0Y2hTdGFydCwgYmF0Y2hTdGFydCArIHJlYWRCYXRjaFNpemUpO1xuICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgUHJvbWlzZS5hbGwoYmF0Y2gubWFwKChmaWxlKSA9PiBhcHAudmF1bHQuY2FjaGVkUmVhZChmaWxlKSkpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGJhdGNoLmxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgICAgY29uc3QgZmlsZSA9IGJhdGNoW2luZGV4XTtcbiAgICAgIGNvbnN0IHJhd1RleHQgPSBjb250ZW50c1tpbmRleF07XG4gICAgICBjb25zdCB0YWdzID0gZ2V0RmlsZVRhZ3MoYXBwLCBmaWxlKTtcbiAgICAgIGNvbnN0IGZpbGVJbmRleCA9IGJhdGNoU3RhcnQgKyBpbmRleDtcblxuICAgICAgb25Qcm9ncmVzcz8uKGBTY2FubmluZyAke2ZpbGVJbmRleCArIDF9LyR7ZmlsZXMubGVuZ3RofSBmaWxlcy4uLmAsIE1hdGgucm91bmQoKGZpbGVJbmRleCAvIHRvdGFsRmlsZXMpICogNzUpKTtcblxuICAgICAgZG9jdW1lbnRzLnB1c2goe1xuICAgICAgICBpZDogZmlsZS5wYXRoLFxuICAgICAgICBwYXRoOiBmaWxlLnBhdGgsXG4gICAgICAgIGJhc2VuYW1lOiBmaWxlLmJhc2VuYW1lLFxuICAgICAgICByYXdUZXh0LFxuICAgICAgICB0YWdzLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRvY3VtZW50cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbGVUYWdzKGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IHN0cmluZ1tdIHtcbiAgY29uc3QgY2FjaGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gIGlmICghY2FjaGUpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCB0YWdTZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICBpZiAoY2FjaGUudGFncykge1xuICAgIGZvciAoY29uc3QgdGFnRW50cnkgb2YgY2FjaGUudGFncykge1xuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVRhZyh0YWdFbnRyeS50YWcpO1xuICAgICAgaWYgKG5vcm1hbGl6ZWQpIHtcbiAgICAgICAgdGFnU2V0LmFkZChub3JtYWxpemVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHRhZyBvZiBleHRyYWN0RnJvbnRtYXR0ZXJUYWdzKGNhY2hlLmZyb250bWF0dGVyKSkge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVUYWcodGFnKTtcbiAgICBpZiAobm9ybWFsaXplZCkge1xuICAgICAgdGFnU2V0LmFkZChub3JtYWxpemVkKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gWy4uLnRhZ1NldF07XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RGcm9udG1hdHRlclRhZ3MoZnJvbnRtYXR0ZXI6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZ1tdIHtcbiAgaWYgKCFmcm9udG1hdHRlciB8fCB0eXBlb2YgZnJvbnRtYXR0ZXIgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgcmF3VGFncyA9IGZyb250bWF0dGVyLnRhZ3MgPz8gZnJvbnRtYXR0ZXIudGFnO1xuICBpZiAodHlwZW9mIHJhd1RhZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHJhd1RhZ3Muc3BsaXQoL1tcXHMsXSsvKS5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS5sZW5ndGggPiAwKTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHJhd1RhZ3MpKSB7XG4gICAgcmV0dXJuIHJhd1RhZ3NcbiAgICAgIC5maWx0ZXIoKGVudHJ5KTogZW50cnkgaXMgc3RyaW5nID0+IHR5cGVvZiBlbnRyeSA9PT0gJ3N0cmluZycpXG4gICAgICAubWFwKChlbnRyeSkgPT4gZW50cnkudHJpbSgpKVxuICAgICAgLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApO1xuICB9XG5cbiAgcmV0dXJuIFtdO1xufVxuIiwgImltcG9ydCB7IE1BWF9XT1JEUywgTUlOX1dPUkRfTEVOR1RIIH0gZnJvbSAnLi4vLi4vY29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFdlaWdodGVkV29yZCB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHtcbiAgQWdncmVnYXRlUmVzdWx0LFxuICBBZ2dyZWdhdG9yU3RyYXRlZ3ksXG4gIERpc3RyaWJ1dGlvbkJ1Y2tldCxcbiAgRmlsdGVyU3RyYXRlZ3ksXG4gIFBpcGVsaW5lU3RyYXRlZ2llcyxcbiAgUmVuZGVyTW9kZWwsXG4gIFJlbmRlck1vZGVsU3RyYXRlZ3ksXG4gIFNjYWxpbmdTdHJhdGVneSxcbiAgVG9rZW4sXG4gIFRva2VuaXplclN0cmF0ZWd5LFxufSBmcm9tICcuLi90eXBlcyc7XG5cbmNvbnN0IGRlZmF1bHRUb2tlbml6ZXI6IFRva2VuaXplclN0cmF0ZWd5ID0ge1xuICB0b2tlbml6ZSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRleHQubWF0Y2goL1thLXowLTldW2EtejAtOSctXSovZykgPz8gW107XG4gIH0sXG59O1xuXG5jb25zdCBkZWZhdWx0RmlsdGVyOiBGaWx0ZXJTdHJhdGVneSA9IHtcbiAgaW5jbHVkZVRva2VuKHRva2VuOiBzdHJpbmcsIHN0b3BXb3JkczogU2V0PHN0cmluZz4pOiBib29sZWFuIHtcbiAgICBjb25zdCBub3JtYWxpemVkID0gdG9rZW4udHJpbSgpO1xuICAgIHJldHVybiBub3JtYWxpemVkLmxlbmd0aCA+PSBNSU5fV09SRF9MRU5HVEggJiYgIXN0b3BXb3Jkcy5oYXMobm9ybWFsaXplZCk7XG4gIH0sXG59O1xuXG5jb25zdCBkZWZhdWx0QWdncmVnYXRvcjogQWdncmVnYXRvclN0cmF0ZWd5ID0ge1xuICBhZ2dyZWdhdGUodG9rZW5zOiBUb2tlbltdKTogQWdncmVnYXRlUmVzdWx0IHtcbiAgICBjb25zdCBjb3VudHMgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuXG4gICAgZm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbnMpIHtcbiAgICAgIGNvdW50cy5zZXQodG9rZW4udmFsdWUsIChjb3VudHMuZ2V0KHRva2VuLnZhbHVlKSA/PyAwKSArIDEpO1xuICAgIH1cblxuICAgIGNvbnN0IGVudHJpZXMgPSBbLi4uY291bnRzLmVudHJpZXMoKV1cbiAgICAgIC5zb3J0KChhLCBiKSA9PiBiWzFdIC0gYVsxXSlcbiAgICAgIC5zbGljZSgwLCBNQVhfV09SRFMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGVudHJpZXMsXG4gICAgICB0b3RhbFRva2VuczogdG9rZW5zLmxlbmd0aCxcbiAgICAgIGRpc3RpbmN0VG9rZW5zOiBjb3VudHMuc2l6ZSxcbiAgICB9O1xuICB9LFxufTtcblxuY29uc3QgZGVmYXVsdFNjYWxpbmc6IFNjYWxpbmdTdHJhdGVneSA9IHtcbiAgc2NhbGUoZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyk6IFdlaWdodGVkV29yZFtdIHtcbiAgICBpZiAoZW50cmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBtaW5Gb250U2l6ZSA9IE1hdGgubWF4KDgsIE1hdGgucm91bmQocmVuZGVyU2V0dGluZ3MubWluRm9udFNpemUpKTtcbiAgICBjb25zdCBtYXhGb250U2l6ZSA9IE1hdGgubWF4KG1pbkZvbnRTaXplICsgMSwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy5tYXhGb250U2l6ZSkpO1xuICAgIGNvbnN0IGVtcGhhc2lzID0gTWF0aC5tYXgoMC41LCBNYXRoLm1pbigzLCByZW5kZXJTZXR0aW5ncy5lbXBoYXNpcykpO1xuXG4gICAgY29uc3Qgbm9ybWFsaXplZEVudHJpZXMgPSBlbnRyaWVzXG4gICAgICAubWFwKChbdGV4dCwgY291bnRdLCBpbmRleCkgPT4gKHtcbiAgICAgICAgdGV4dCxcbiAgICAgICAgY291bnQsXG4gICAgICAgIGluZGV4LFxuICAgICAgICBzY29yZTogY29tcHV0ZVNjYWxlU2NvcmUoY291bnQsIGluZGV4LCBlbnRyaWVzLCByZW5kZXJTZXR0aW5ncywgZW1waGFzaXMpLFxuICAgICAgfSkpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYi5jb3VudCAtIGEuY291bnQgfHwgYS5pbmRleCAtIGIuaW5kZXgpO1xuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRFbnRyaWVzLm1hcCgoZW50cnkpID0+ICh7XG4gICAgICB0ZXh0OiBlbnRyeS50ZXh0LFxuICAgICAgY291bnQ6IGVudHJ5LmNvdW50LFxuICAgICAgc2l6ZTogTWF0aC5yb3VuZChtaW5Gb250U2l6ZSArIGVudHJ5LnNjb3JlICogKG1heEZvbnRTaXplIC0gbWluRm9udFNpemUpKSxcbiAgICB9KSk7XG4gIH0sXG59O1xuXG5jb25zdCBkZWZhdWx0UmVuZGVyTW9kZWw6IFJlbmRlck1vZGVsU3RyYXRlZ3kgPSB7XG4gIGJ1aWxkTW9kZWwod29yZHM6IFdlaWdodGVkV29yZFtdLCBhZ2dyZWdhdGU6IEFnZ3JlZ2F0ZVJlc3VsdCk6IFJlbmRlck1vZGVsIHtcbiAgICByZXR1cm4ge1xuICAgICAgd29yZENsb3VkV29yZHM6IHdvcmRzLFxuICAgICAgZGlzdHJpYnV0aW9uU2VyaWVzOiBidWlsZERpc3RyaWJ1dGlvblNlcmllcyh3b3JkcyksXG4gICAgICB0b3RhbFRva2VuczogYWdncmVnYXRlLnRvdGFsVG9rZW5zLFxuICAgICAgZGlzdGluY3RUb2tlbnM6IGFnZ3JlZ2F0ZS5kaXN0aW5jdFRva2VucyxcbiAgICB9O1xuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfUElQRUxJTkVfU1RSQVRFR0lFUzogUGlwZWxpbmVTdHJhdGVnaWVzID0ge1xuICB0b2tlbml6ZXI6IGRlZmF1bHRUb2tlbml6ZXIsXG4gIGZpbHRlcjogZGVmYXVsdEZpbHRlcixcbiAgYWdncmVnYXRvcjogZGVmYXVsdEFnZ3JlZ2F0b3IsXG4gIHNjYWxpbmc6IGRlZmF1bHRTY2FsaW5nLFxuICByZW5kZXJNb2RlbDogZGVmYXVsdFJlbmRlck1vZGVsLFxufTtcblxuZnVuY3Rpb24gY29tcHV0ZVNjYWxlU2NvcmUoXG4gIGNvdW50OiBudW1iZXIsXG4gIGluZGV4OiBudW1iZXIsXG4gIGVudHJpZXM6IEFycmF5PFtzdHJpbmcsIG51bWJlcl0+LFxuICByZW5kZXJTZXR0aW5nczogUmVuZGVyU2V0dGluZ3MsXG4gIGVtcGhhc2lzOiBudW1iZXIsXG4pOiBudW1iZXIge1xuICBjb25zdCBjb3VudHMgPSBlbnRyaWVzLm1hcCgoWywgZW50cnlDb3VudF0pID0+IGVudHJ5Q291bnQpO1xuICBjb25zdCBtaW5Db3VudCA9IGNvdW50c1tjb3VudHMubGVuZ3RoIC0gMV07XG4gIGNvbnN0IG1heENvdW50ID0gY291bnRzWzBdO1xuXG4gIGlmIChtYXhDb3VudCA8PSBtaW5Db3VudCkge1xuICAgIHJldHVybiAwLjU7XG4gIH1cblxuICBpZiAocmVuZGVyU2V0dGluZ3Muc2NhbGluZ01vZGUgPT09ICdyYW5rJykge1xuICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIDAuNTtcbiAgICB9XG4gICAgcmV0dXJuIDEgLSBpbmRleCAvIChlbnRyaWVzLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgaWYgKHJlbmRlclNldHRpbmdzLnNjYWxpbmdNb2RlID09PSAnbG9nJykge1xuICAgIGNvbnN0IHNhZmVNaW4gPSBNYXRoLm1heCgxLCBtaW5Db3VudCk7XG4gICAgY29uc3Qgc2FmZU1heCA9IE1hdGgubWF4KHNhZmVNaW4gKyAxLCBtYXhDb3VudCk7XG4gICAgY29uc3QgbnVtZXJhdG9yID0gTWF0aC5sb2coTWF0aC5tYXgoMSwgY291bnQpKSAtIE1hdGgubG9nKHNhZmVNaW4pO1xuICAgIGNvbnN0IGRlbm9taW5hdG9yID0gTWF0aC5sb2coc2FmZU1heCkgLSBNYXRoLmxvZyhzYWZlTWluKTtcbiAgICByZXR1cm4gY2xhbXAwMShkZW5vbWluYXRvciA9PT0gMCA/IDAuNSA6IG51bWVyYXRvciAvIGRlbm9taW5hdG9yKTtcbiAgfVxuXG4gIGNvbnN0IGxpbmVhciA9IChjb3VudCAtIG1pbkNvdW50KSAvIChtYXhDb3VudCAtIG1pbkNvdW50KTtcbiAgaWYgKHJlbmRlclNldHRpbmdzLnNjYWxpbmdNb2RlID09PSAncG93ZXInKSB7XG4gICAgcmV0dXJuIGNsYW1wMDEoTWF0aC5wb3cobGluZWFyLCBlbXBoYXNpcykpO1xuICB9XG5cbiAgcmV0dXJuIGNsYW1wMDEobGluZWFyKTtcbn1cblxuZnVuY3Rpb24gY2xhbXAwMSh2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGgubWluKDEsIE1hdGgubWF4KDAsIHZhbHVlKSk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRGlzdHJpYnV0aW9uU2VyaWVzKHdvcmRzOiBXZWlnaHRlZFdvcmRbXSk6IERpc3RyaWJ1dGlvbkJ1Y2tldFtdIHtcbiAgaWYgKHdvcmRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IG1heENvdW50ID0gd29yZHNbMF0/LmNvdW50ID8/IDA7XG4gIGlmIChtYXhDb3VudCA8PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgYnVja2V0Q291bnQgPSBNYXRoLm1pbig4LCBNYXRoLm1heCg0LCBNYXRoLnJvdW5kKE1hdGguc3FydCh3b3Jkcy5sZW5ndGgpKSkpO1xuICBjb25zdCB3aWR0aCA9IE1hdGgubWF4KDEsIE1hdGguY2VpbChtYXhDb3VudCAvIGJ1Y2tldENvdW50KSk7XG4gIGNvbnN0IGJ1Y2tldHMgPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpO1xuXG4gIGZvciAoY29uc3Qgd29yZCBvZiB3b3Jkcykge1xuICAgIGNvbnN0IGluZGV4ID0gTWF0aC5taW4oYnVja2V0Q291bnQgLSAxLCBNYXRoLmZsb29yKCh3b3JkLmNvdW50IC0gMSkgLyB3aWR0aCkpO1xuICAgIGJ1Y2tldHMuc2V0KGluZGV4LCAoYnVja2V0cy5nZXQoaW5kZXgpID8/IDApICsgMSk7XG4gIH1cblxuICBjb25zdCBkaXN0cmlidXRpb246IERpc3RyaWJ1dGlvbkJ1Y2tldFtdID0gW107XG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBidWNrZXRDb3VudDsgaW5kZXggKz0gMSkge1xuICAgIGNvbnN0IG1pbiA9IGluZGV4ICogd2lkdGggKyAxO1xuICAgIGNvbnN0IG1heCA9IGluZGV4ID09PSBidWNrZXRDb3VudCAtIDEgPyBtYXhDb3VudCA6IChpbmRleCArIDEpICogd2lkdGg7XG4gICAgZGlzdHJpYnV0aW9uLnB1c2goe1xuICAgICAgbGFiZWw6IGAke21pbn0tJHttYXh9YCxcbiAgICAgIG1pbixcbiAgICAgIG1heCxcbiAgICAgIHZhbHVlOiBidWNrZXRzLmdldChpbmRleCkgPz8gMCxcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBkaXN0cmlidXRpb247XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBZ2dyZWdhdGVSZXN1bHQsIEFnZ3JlZ2F0b3JTdHJhdGVneSwgVG9rZW4gfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZ2dyZWdhdGVUb2tlbnModG9rZW5zOiBUb2tlbltdLCBzdHJhdGVneTogQWdncmVnYXRvclN0cmF0ZWd5KTogQWdncmVnYXRlUmVzdWx0IHtcbiAgcmV0dXJuIHN0cmF0ZWd5LmFnZ3JlZ2F0ZSh0b2tlbnMpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgRmlsdGVyU3RyYXRlZ3ksIFRva2VuIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyVG9rZW5zKHRva2VuczogVG9rZW5bXSwgc3RvcFdvcmRzOiBTZXQ8c3RyaW5nPiwgc3RyYXRlZ3k6IEZpbHRlclN0cmF0ZWd5KTogVG9rZW5bXSB7XG4gIHJldHVybiB0b2tlbnMuZmlsdGVyKCh0b2tlbikgPT4gc3RyYXRlZ3kuaW5jbHVkZVRva2VuKHRva2VuLnZhbHVlLCBzdG9wV29yZHMpKTtcbn1cbiIsICJpbXBvcnQgeyBGUk9OVE1BVFRFUl9QQVRURVJOIH0gZnJvbSAnLi4vLi4vY29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHsgTm9ybWFsaXplZERvY3VtZW50LCBQaXBlbGluZURvY3VtZW50IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRG9jdW1lbnRzKGRvY3VtZW50czogUGlwZWxpbmVEb2N1bWVudFtdKTogTm9ybWFsaXplZERvY3VtZW50W10ge1xuICByZXR1cm4gZG9jdW1lbnRzLm1hcCgoZG9jdW1lbnQpID0+ICh7XG4gICAgaWQ6IGRvY3VtZW50LmlkLFxuICAgIHBhdGg6IGRvY3VtZW50LnBhdGgsXG4gICAgYmFzZW5hbWU6IGRvY3VtZW50LmJhc2VuYW1lLFxuICAgIHRhZ3M6IFsuLi5kb2N1bWVudC50YWdzXSxcbiAgICB0ZXh0OiBkb2N1bWVudC5yYXdUZXh0XG4gICAgICAucmVwbGFjZShGUk9OVE1BVFRFUl9QQVRURVJOLCAnJylcbiAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAubm9ybWFsaXplKCdORktDJyksXG4gIH0pKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFnZ3JlZ2F0ZVJlc3VsdCwgUmVuZGVyTW9kZWwsIFJlbmRlck1vZGVsU3RyYXRlZ3kgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFdlaWdodGVkV29yZCB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlbmRlck1vZGVsKFxuICB3b3JkczogV2VpZ2h0ZWRXb3JkW10sXG4gIGFnZ3JlZ2F0ZVJlc3VsdDogQWdncmVnYXRlUmVzdWx0LFxuICBzdHJhdGVneTogUmVuZGVyTW9kZWxTdHJhdGVneSxcbik6IFJlbmRlck1vZGVsIHtcbiAgcmV0dXJuIHN0cmF0ZWd5LmJ1aWxkTW9kZWwod29yZHMsIGFnZ3JlZ2F0ZVJlc3VsdCk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBSZW5kZXJTZXR0aW5ncywgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHR5cGUgeyBTY2FsaW5nU3RyYXRlZ3kgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZUVudHJpZXMoXG4gIGVudHJpZXM6IEFycmF5PFtzdHJpbmcsIG51bWJlcl0+LFxuICByZW5kZXJTZXR0aW5nczogUmVuZGVyU2V0dGluZ3MsXG4gIHN0cmF0ZWd5OiBTY2FsaW5nU3RyYXRlZ3ksXG4pOiBXZWlnaHRlZFdvcmRbXSB7XG4gIHJldHVybiBzdHJhdGVneS5zY2FsZShlbnRyaWVzLCByZW5kZXJTZXR0aW5ncyk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBQaXBlbGluZURvY3VtZW50LCBTb3VyY2VTZWxlY3Rpb25SdWxlcyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IG5vcm1hbGl6ZVRhZyB9IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdERvY3VtZW50cyhkb2N1bWVudHM6IFBpcGVsaW5lRG9jdW1lbnRbXSwgcnVsZXM/OiBTb3VyY2VTZWxlY3Rpb25SdWxlcyk6IFBpcGVsaW5lRG9jdW1lbnRbXSB7XG4gIGlmICghcnVsZXMpIHtcbiAgICByZXR1cm4gZG9jdW1lbnRzO1xuICB9XG5cbiAgY29uc3Qgbm9ybWFsaXplZFRhZ0ZpbHRlcnMgPSAocnVsZXMudGFnRmlsdGVycyA/PyBbXSlcbiAgICAubWFwKCh0YWcpID0+IG5vcm1hbGl6ZVRhZyh0YWcpKVxuICAgIC5maWx0ZXIoKHRhZykgPT4gdGFnLmxlbmd0aCA+IDApO1xuXG4gIGNvbnN0IGluY2x1ZGVQcmVmaXhlcyA9IChydWxlcy5pbmNsdWRlUGF0aFByZWZpeGVzID8/IFtdKS5tYXAoKHByZWZpeCkgPT4gcHJlZml4LnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBleGNsdWRlUHJlZml4ZXMgPSAocnVsZXMuZXhjbHVkZVBhdGhQcmVmaXhlcyA/PyBbXSkubWFwKChwcmVmaXgpID0+IHByZWZpeC50cmltKCkpLmZpbHRlcihCb29sZWFuKTtcbiAgY29uc3QgcXVlcnlUZXh0ID0gcnVsZXMucXVlcnlUZXh0Py50cmltKCkudG9Mb3dlckNhc2UoKSA/PyAnJztcbiAgY29uc3QgdGFnTWF0Y2hNb2RlID0gcnVsZXMudGFnTWF0Y2hNb2RlID8/ICdhbnknO1xuXG4gIHJldHVybiBkb2N1bWVudHMuZmlsdGVyKChkb2N1bWVudCkgPT4ge1xuICAgIGlmICghbWF0Y2hlc1BhdGhSdWxlcyhkb2N1bWVudC5wYXRoLCBpbmNsdWRlUHJlZml4ZXMsIGV4Y2x1ZGVQcmVmaXhlcykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAobm9ybWFsaXplZFRhZ0ZpbHRlcnMubGVuZ3RoID4gMCAmJiAhbWF0Y2hlc1RhZ1J1bGVzKGRvY3VtZW50LnRhZ3MsIG5vcm1hbGl6ZWRUYWdGaWx0ZXJzLCB0YWdNYXRjaE1vZGUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHF1ZXJ5VGV4dC5sZW5ndGggPiAwICYmICFtYXRjaGVzUXVlcnlUZXh0KGRvY3VtZW50LCBxdWVyeVRleHQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzUGF0aFJ1bGVzKHBhdGg6IHN0cmluZywgaW5jbHVkZVByZWZpeGVzOiBzdHJpbmdbXSwgZXhjbHVkZVByZWZpeGVzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICBpZiAoaW5jbHVkZVByZWZpeGVzLmxlbmd0aCA+IDAgJiYgIWluY2x1ZGVQcmVmaXhlcy5zb21lKChwcmVmaXgpID0+IHBhdGguc3RhcnRzV2l0aChwcmVmaXgpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChleGNsdWRlUHJlZml4ZXMuc29tZSgocHJlZml4KSA9PiBwYXRoLnN0YXJ0c1dpdGgocHJlZml4KSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1RhZ1J1bGVzKGRvY3VtZW50VGFnczogc3RyaW5nW10sIGZpbHRlcnM6IHN0cmluZ1tdLCBtb2RlOiAnYW55JyB8ICdhbGwnKTogYm9vbGVhbiB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRUYWdzID0gbmV3IFNldChkb2N1bWVudFRhZ3MubWFwKCh0YWcpID0+IG5vcm1hbGl6ZVRhZyh0YWcpKS5maWx0ZXIoQm9vbGVhbikpO1xuICBpZiAobW9kZSA9PT0gJ2FsbCcpIHtcbiAgICByZXR1cm4gZmlsdGVycy5ldmVyeSgoZmlsdGVyVGFnKSA9PiBub3JtYWxpemVkVGFncy5oYXMoZmlsdGVyVGFnKSk7XG4gIH1cblxuICByZXR1cm4gZmlsdGVycy5zb21lKChmaWx0ZXJUYWcpID0+IG5vcm1hbGl6ZWRUYWdzLmhhcyhmaWx0ZXJUYWcpKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1F1ZXJ5VGV4dChkb2N1bWVudDogUGlwZWxpbmVEb2N1bWVudCwgcXVlcnlUZXh0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGRvY3VtZW50LnBhdGgudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeVRleHQpXG4gICAgfHwgZG9jdW1lbnQuYmFzZW5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeVRleHQpXG4gICAgfHwgZG9jdW1lbnQucmF3VGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5VGV4dCk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBOb3JtYWxpemVkRG9jdW1lbnQsIFRva2VuLCBUb2tlbml6ZXJTdHJhdGVneSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHRva2VuaXplRG9jdW1lbnRzKGRvY3VtZW50czogTm9ybWFsaXplZERvY3VtZW50W10sIHN0cmF0ZWd5OiBUb2tlbml6ZXJTdHJhdGVneSk6IFRva2VuW10ge1xuICBjb25zdCB0b2tlbnM6IFRva2VuW10gPSBbXTtcblxuICBmb3IgKGNvbnN0IGRvY3VtZW50IG9mIGRvY3VtZW50cykge1xuICAgIGNvbnN0IHZhbHVlcyA9IHN0cmF0ZWd5LnRva2VuaXplKGRvY3VtZW50LnRleHQpO1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgIHZhbHVlLFxuICAgICAgICBkb2N1bWVudElkOiBkb2N1bWVudC5pZCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0b2tlbnM7XG59XG4iLCAiaW1wb3J0IHsgREVGQVVMVF9QSVBFTElORV9TVFJBVEVHSUVTIH0gZnJvbSAnLi9zdHJhdGVnaWVzJztcbmltcG9ydCB7IGFnZ3JlZ2F0ZVRva2VucyB9IGZyb20gJy4vc3RhZ2VzL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQgeyBmaWx0ZXJUb2tlbnMgfSBmcm9tICcuL3N0YWdlcy9maWx0ZXInO1xuaW1wb3J0IHsgbm9ybWFsaXplRG9jdW1lbnRzIH0gZnJvbSAnLi9zdGFnZXMvbm9ybWFsaXplJztcbmltcG9ydCB7IGNyZWF0ZVJlbmRlck1vZGVsIH0gZnJvbSAnLi9zdGFnZXMvcmVuZGVyLW1vZGVsJztcbmltcG9ydCB7IHNjYWxlRW50cmllcyB9IGZyb20gJy4vc3RhZ2VzL3NjYWxlJztcbmltcG9ydCB7IHNlbGVjdERvY3VtZW50cyB9IGZyb20gJy4vc3RhZ2VzL3NvdXJjZS1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgdG9rZW5pemVEb2N1bWVudHMgfSBmcm9tICcuL3N0YWdlcy90b2tlbml6ZSc7XG5pbXBvcnQgdHlwZSB7IFBpcGVsaW5lSW5wdXQsIFBpcGVsaW5lU3RyYXRlZ2llcywgUmVuZGVyTW9kZWwgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJ1blBpcGVsaW5lKFxuICBpbnB1dDogUGlwZWxpbmVJbnB1dCxcbiAgb3ZlcnJpZGVzOiBQYXJ0aWFsPFBpcGVsaW5lU3RyYXRlZ2llcz4gPSB7fSxcbik6IFJlbmRlck1vZGVsIHtcbiAgY29uc3Qgc3RyYXRlZ2llczogUGlwZWxpbmVTdHJhdGVnaWVzID0ge1xuICAgIC4uLkRFRkFVTFRfUElQRUxJTkVfU1RSQVRFR0lFUyxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH07XG5cbiAgY29uc3Qgc2VsZWN0ZWREb2N1bWVudHMgPSBzZWxlY3REb2N1bWVudHMoaW5wdXQuZG9jdW1lbnRzLCBpbnB1dC5zb3VyY2VSdWxlcyk7XG4gIGNvbnN0IG5vcm1hbGl6ZWREb2N1bWVudHMgPSBub3JtYWxpemVEb2N1bWVudHMoc2VsZWN0ZWREb2N1bWVudHMpO1xuICBjb25zdCB0b2tlbnMgPSB0b2tlbml6ZURvY3VtZW50cyhub3JtYWxpemVkRG9jdW1lbnRzLCBzdHJhdGVnaWVzLnRva2VuaXplcik7XG4gIGNvbnN0IGZpbHRlcmVkVG9rZW5zID0gZmlsdGVyVG9rZW5zKHRva2VucywgaW5wdXQuc3RvcFdvcmRzLCBzdHJhdGVnaWVzLmZpbHRlcik7XG4gIGNvbnN0IGFnZ3JlZ2F0ZVJlc3VsdCA9IGFnZ3JlZ2F0ZVRva2VucyhmaWx0ZXJlZFRva2Vucywgc3RyYXRlZ2llcy5hZ2dyZWdhdG9yKTtcbiAgY29uc3Qgd29yZHMgPSBzY2FsZUVudHJpZXMoYWdncmVnYXRlUmVzdWx0LmVudHJpZXMsIGlucHV0LnJlbmRlclNldHRpbmdzLCBzdHJhdGVnaWVzLnNjYWxpbmcpO1xuXG4gIHJldHVybiBjcmVhdGVSZW5kZXJNb2RlbCh3b3JkcywgYWdncmVnYXRlUmVzdWx0LCBzdHJhdGVnaWVzLnJlbmRlck1vZGVsKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFwcCwgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IFRhZ01hdGNoTW9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IG5vcm1hbGl6ZVRhZyB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEF2YWlsYWJsZVRhZ3MoYXBwOiBBcHApOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHRhZ3MgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRUYWdzKCk7XG4gIHJldHVybiBPYmplY3Qua2V5cyh0YWdzKS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyRmlsZXNCeVRhZ3MoXG4gIGFwcDogQXBwLFxuICBmaWxlczogVEZpbGVbXSxcbiAgdGFnRmlsdGVyczogc3RyaW5nW10sXG4gIHRhZ01hdGNoTW9kZTogVGFnTWF0Y2hNb2RlLFxuKTogVEZpbGVbXSB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRGaWx0ZXJzID0gdGFnRmlsdGVyc1xuICAgIC5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpXG4gICAgLmZpbHRlcigodGFnKSA9PiB0YWcubGVuZ3RoID4gMCk7XG5cbiAgaWYgKG5vcm1hbGl6ZWRGaWx0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmaWxlcztcbiAgfVxuXG4gIHJldHVybiBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IGZpbGVNYXRjaGVzVGFncyhhcHAsIGZpbGUsIG5vcm1hbGl6ZWRGaWx0ZXJzLCB0YWdNYXRjaE1vZGUpKTtcbn1cblxuZnVuY3Rpb24gZmlsZU1hdGNoZXNUYWdzKGFwcDogQXBwLCBmaWxlOiBURmlsZSwgbm9ybWFsaXplZEZpbHRlcnM6IHN0cmluZ1tdLCB0YWdNYXRjaE1vZGU6IFRhZ01hdGNoTW9kZSk6IGJvb2xlYW4ge1xuICBjb25zdCBjYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcbiAgaWYgKCFjYWNoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHRhZ1NldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIGlmIChjYWNoZS50YWdzKSB7XG4gICAgZm9yIChjb25zdCB0YWdFbnRyeSBvZiBjYWNoZS50YWdzKSB7XG4gICAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplVGFnKHRhZ0VudHJ5LnRhZyk7XG4gICAgICBpZiAobm9ybWFsaXplZCkge1xuICAgICAgICB0YWdTZXQuYWRkKG5vcm1hbGl6ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgdGFnIG9mIGV4dHJhY3RGcm9udG1hdHRlclRhZ3MoY2FjaGUuZnJvbnRtYXR0ZXIpKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVRhZyh0YWcpO1xuICAgIGlmIChub3JtYWxpemVkKSB7XG4gICAgICB0YWdTZXQuYWRkKG5vcm1hbGl6ZWQpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0YWdNYXRjaE1vZGUgPT09ICdhbGwnKSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRGaWx0ZXJzLmV2ZXJ5KCh0YWcpID0+IHRhZ1NldC5oYXModGFnKSk7XG4gIH1cblxuICByZXR1cm4gbm9ybWFsaXplZEZpbHRlcnMuc29tZSgodGFnKSA9PiB0YWdTZXQuaGFzKHRhZykpO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0RnJvbnRtYXR0ZXJUYWdzKGZyb250bWF0dGVyOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmdbXSB7XG4gIGlmICghZnJvbnRtYXR0ZXIgfHwgdHlwZW9mIGZyb250bWF0dGVyICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHJhd1RhZ3MgPSBmcm9udG1hdHRlci50YWdzID8/IGZyb250bWF0dGVyLnRhZztcbiAgaWYgKHR5cGVvZiByYXdUYWdzID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiByYXdUYWdzLnNwbGl0KC9bXFxzLF0rLykuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkubGVuZ3RoID4gMCk7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShyYXdUYWdzKSkge1xuICAgIHJldHVybiByYXdUYWdzXG4gICAgICAuZmlsdGVyKChlbnRyeSk6IGVudHJ5IGlzIHN0cmluZyA9PiB0eXBlb2YgZW50cnkgPT09ICdzdHJpbmcnKVxuICAgICAgLm1hcCgoZW50cnkpID0+IGVudHJ5LnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS5sZW5ndGggPiAwKTtcbiAgfVxuXG4gIHJldHVybiBbXTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFwcCwgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IFJlbmRlclNldHRpbmdzLCBXZWlnaHRlZFdvcmQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyByZWFkUGlwZWxpbmVEb2N1bWVudHMgfSBmcm9tICcuLi9waXBlbGluZS9hZGFwdGVycy9vYnNpZGlhbi1zb3VyY2UnO1xuaW1wb3J0IHsgcnVuUGlwZWxpbmUgfSBmcm9tICcuLi9waXBlbGluZS9ydW4tcGlwZWxpbmUnO1xuaW1wb3J0IHR5cGUgeyBTb3VyY2VTZWxlY3Rpb25SdWxlcyB9IGZyb20gJy4uL3BpcGVsaW5lL3R5cGVzJztcbmltcG9ydCB7IGdldEF2YWlsYWJsZVRhZ3MgfSBmcm9tICcuL3RhZy1maWx0ZXInO1xuXG5leHBvcnQgY2xhc3MgV29yZENsb3VkUHJvY2Vzc29yIHtcbiAgcHJpdmF0ZSByZWFkb25seSBhcHA6IEFwcDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCkge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICB9XG5cbiAgZ2V0QXZhaWxhYmxlVGFncygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIGdldEF2YWlsYWJsZVRhZ3ModGhpcy5hcHApO1xuICB9XG5cbiAgYXN5bmMgY29sbGVjdEZyb21GaWxlcyhcbiAgICBmaWxlczogVEZpbGVbXSxcbiAgICBzdG9wV29yZHM6IFNldDxzdHJpbmc+LFxuICAgIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyxcbiAgICBvblByb2dyZXNzPzogKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB2b2lkLFxuICAgIHNvdXJjZVJ1bGVzPzogU291cmNlU2VsZWN0aW9uUnVsZXMsXG4gICk6IFByb21pc2U8V2VpZ2h0ZWRXb3JkW10+IHtcbiAgICBjb25zdCBwZXJmb3JtYW5jZSA9IGdldFBlcmZvcm1hbmNlUHJvZmlsZShyZW5kZXJTZXR0aW5ncy5wcm9ncmVzc0RldGFpbCk7XG4gICAgY29uc3QgcmVwb3J0UHJvZ3Jlc3MgPSBjcmVhdGVUaHJvdHRsZWRQcm9ncmVzcyhvblByb2dyZXNzLCBwZXJmb3JtYW5jZS5wcm9ncmVzc1Rocm90dGxlTXMpO1xuICAgIGNvbnN0IHJlYWRCYXRjaFNpemUgPSBwZXJmb3JtYW5jZS5mdWxsUGFyYWxsZWxSZWFkXG4gICAgICA/IE1hdGgubWF4KDEsIGZpbGVzLmxlbmd0aClcbiAgICAgIDogTWF0aC5tYXgoOCwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy5zY2FuQmF0Y2hTaXplKSk7XG5cbiAgICBjb25zdCBkb2N1bWVudHMgPSBhd2FpdCByZWFkUGlwZWxpbmVEb2N1bWVudHMoXG4gICAgICB0aGlzLmFwcCxcbiAgICAgIGZpbGVzLFxuICAgICAgcmVhZEJhdGNoU2l6ZSxcbiAgICAgIChtZXNzYWdlLCBwZXJjZW50KSA9PiB7XG4gICAgICAgIHJlcG9ydFByb2dyZXNzKG1lc3NhZ2UsIHBlcmNlbnQpO1xuICAgICAgfSxcbiAgICApO1xuXG4gICAgcmVwb3J0UHJvZ3Jlc3MoJ1Rva2VuaXppbmcgYW5kIGFnZ3JlZ2F0aW5nLi4uJywgODUpO1xuXG4gICAgY29uc3QgbW9kZWwgPSBydW5QaXBlbGluZSh7XG4gICAgICBkb2N1bWVudHMsXG4gICAgICBzdG9wV29yZHMsXG4gICAgICByZW5kZXJTZXR0aW5ncyxcbiAgICAgIHNvdXJjZVJ1bGVzLFxuICAgIH0pO1xuXG4gICAgcmVwb3J0UHJvZ3Jlc3MoJ1ByZXBhcmluZyBsYXlvdXQuLi4nLCA5NSk7XG5cbiAgICByZXR1cm4gbW9kZWwud29yZENsb3VkV29yZHM7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlVGhyb3R0bGVkUHJvZ3Jlc3MoXG4gIG9uUHJvZ3Jlc3M6ICgobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQpIHwgdW5kZWZpbmVkLFxuICBtaW5JbnRlcnZhbE1zOiBudW1iZXIsXG4pOiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQge1xuICBpZiAoIW9uUHJvZ3Jlc3MpIHtcbiAgICByZXR1cm4gKCkgPT4gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGV0IGxhc3RSZXBvcnRlZEF0ID0gMDtcbiAgbGV0IGxhc3RQZXJjZW50ID0gLTE7XG5cbiAgcmV0dXJuIChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgaWYgKHBlcmNlbnQgIT09IDEwMCAmJiBwZXJjZW50ID09PSBsYXN0UGVyY2VudCAmJiBub3cgLSBsYXN0UmVwb3J0ZWRBdCA8IG1pbkludGVydmFsTXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHBlcmNlbnQgIT09IDEwMCAmJiBub3cgLSBsYXN0UmVwb3J0ZWRBdCA8IG1pbkludGVydmFsTXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsYXN0UmVwb3J0ZWRBdCA9IG5vdztcbiAgICBsYXN0UGVyY2VudCA9IHBlcmNlbnQ7XG4gICAgb25Qcm9ncmVzcyhtZXNzYWdlLCBwZXJjZW50KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0UGVyZm9ybWFuY2VQcm9maWxlKGRldGFpbDogUmVuZGVyU2V0dGluZ3NbJ3Byb2dyZXNzRGV0YWlsJ10pOiB7XG4gIHByb2dyZXNzVGhyb3R0bGVNczogbnVtYmVyO1xuICBmdWxsUGFyYWxsZWxSZWFkOiBib29sZWFuO1xufSB7XG4gIGlmIChkZXRhaWwgPT09ICd1bmhpbmdlZCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAxXzAwMF8wMDAsXG4gICAgICBmdWxsUGFyYWxsZWxSZWFkOiB0cnVlLFxuICAgIH07XG4gIH1cblxuICBpZiAoZGV0YWlsID09PSAnZGV0YWlsZWQnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2dyZXNzVGhyb3R0bGVNczogMjUsXG4gICAgICBmdWxsUGFyYWxsZWxSZWFkOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGRldGFpbCA9PT0gJ21pbmltYWwnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2dyZXNzVGhyb3R0bGVNczogMjIwLFxuICAgICAgZnVsbFBhcmFsbGVsUmVhZDogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiA4MCxcbiAgICBmdWxsUGFyYWxsZWxSZWFkOiBmYWxzZSxcbiAgfTtcbn1cbiIsICJpbXBvcnQgeyBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgREVGQVVMVF9TVE9QX1dPUkRTIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHtcbiAgQ291bnRMYWJlbEZvcm1hdCxcbiAgUHJvZ3Jlc3NEZXRhaWwsXG4gIFJlbmRlclNldHRpbmdzLFxuICBSb3RhdGlvblByZXNldCxcbiAgU2NhbGluZ01vZGUsXG4gIFNwaXJhbFR5cGUsXG4gIFdlaWdodGVkV29yZCxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHR5cGUgVmF1bHRXb3JkQ2xvdWRQbHVnaW4gZnJvbSAnLi4vbWFpbic7XG5pbXBvcnQgeyBtYXBDb3VudHNUb1dlaWdodGVkV29yZHMgfSBmcm9tICcuLi9wcm9jZXNzaW5nL3NjYWxpbmcnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmRDbG91ZFNldHRpbmdzIHtcbiAgYmxhY2tsaXN0V29yZHM6IHN0cmluZ1tdO1xuICByZW5kZXI6IFJlbmRlclNldHRpbmdzO1xufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogV29yZENsb3VkU2V0dGluZ3MgPSB7XG4gIGJsYWNrbGlzdFdvcmRzOiBbLi4uREVGQVVMVF9TVE9QX1dPUkRTXSxcbiAgcmVuZGVyOiB7XG4gICAgcm90YXRpb25QcmVzZXQ6ICdtb3N0bHktaG9yaXpvbnRhbCcsXG4gICAgc3BpcmFsOiAnYXJjaGltZWRlYW4nLFxuICAgIHdvcmRQYWRkaW5nOiAyLFxuICAgIG1pbkZvbnRTaXplOiAxNCxcbiAgICBtYXhGb250U2l6ZTogNzIsXG4gICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgIHNjYWxpbmdNb2RlOiAncG93ZXInLFxuICAgIGVtcGhhc2lzOiAxLFxuICAgIHNob3dDb3VudEluV29yZFRleHQ6IGZhbHNlLFxuICAgIGNvdW50TGFiZWxGb3JtYXQ6ICdwYXJlbicsXG4gICAgY291bnRMYWJlbE1pbkNvdW50OiAxLFxuICAgIHByb2dyZXNzRGV0YWlsOiAnYmFsYW5jZWQnLFxuICAgIHNjYW5CYXRjaFNpemU6IDI0LFxuICAgIGxheW91dFRpbWVJbnRlcnZhbE1zOiAxNixcbiAgICBkZXRlcm1pbmlzdGljTGF5b3V0OiBmYWxzZSxcbiAgICByYW5kb21TZWVkOiA0MixcbiAgfSxcbn07XG5cbmV4cG9ydCBjbGFzcyBWYXVsdFdvcmRDbG91ZFNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgcHJpdmF0ZSByZWFkb25seSBwbHVnaW46IFZhdWx0V29yZENsb3VkUGx1Z2luO1xuXG4gIGNvbnN0cnVjdG9yKHBsdWdpbjogVmF1bHRXb3JkQ2xvdWRQbHVnaW4pIHtcbiAgICBzdXBlcihwbHVnaW4uYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdXb3JkIGNsb3VkcyBzZXR0aW5ncycgfSk7XG5cbiAgICBsZXQgZHJhZnRXb3JkID0gJyc7XG5cbiAgICBjb25zdCBhZGRFeGNsdWRlZFdvcmQgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdBZGQgZXhjbHVkZWQgd29yZCcpXG4gICAgICAuc2V0RGVzYygnQWRkIG9uZSB3b3JkIGF0IGEgdGltZSB0byB0aGUgYmxhY2tsaXN0LicpXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICB0ZXh0LnNldFBsYWNlaG9sZGVyKCdXb3JkIHRvIGV4Y2x1ZGUnKTtcbiAgICAgICAgdGV4dC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICBkcmFmdFdvcmQgPSB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgIGJ1dHRvblxuICAgICAgICAgIC5zZXRCdXR0b25UZXh0KCdBZGQnKVxuICAgICAgICAgIC5zZXRDdGEoKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFkZGVkID0gYXdhaXQgdGhpcy5wbHVnaW4uYWRkQmxhY2tsaXN0V29yZChkcmFmdFdvcmQpO1xuICAgICAgICAgICAgaWYgKGFkZGVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihhZGRFeGNsdWRlZFdvcmQsICdFeGNsdWRlZCB3b3JkcyBhcmUgYWx3YXlzIGlnbm9yZWQgZnJvbSBjb3VudGluZyBhbmQgc2l6aW5nIGluIGFsbCBjbG91ZCB0eXBlcy4nKTtcblxuICAgIGNvbnN0IGxpc3RXcmFwcGVyRWwgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXNldHRpbmdzLWxpc3QnIH0pO1xuICAgIGxpc3RXcmFwcGVyRWwuY3JlYXRlRWwoJ2gzJywgeyB0ZXh0OiAnRXhjbHVkZWQgd29yZHMnIH0pO1xuICAgIGNvbnN0IGxpc3RFbCA9IGxpc3RXcmFwcGVyRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zZXR0aW5ncy1iYWRnZXMnIH0pO1xuICAgIGNvbnN0IHNvcnRlZFdvcmRzID0gWy4uLnRoaXMucGx1Z2luLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzXS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuXG4gICAgaWYgKHNvcnRlZFdvcmRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgbGlzdEVsLmNyZWF0ZVNwYW4oeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXNldHRpbmdzLWJhZGdlcy1lbXB0eScsIHRleHQ6ICdObyBleGNsdWRlZCB3b3JkcyBjb25maWd1cmVkLicgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBzb3J0ZWRXb3Jkcykge1xuICAgICAgICBjb25zdCBiYWRnZUVsID0gbGlzdEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtYmFkZ2UnIH0pO1xuICAgICAgICBiYWRnZUVsLmNyZWF0ZVNwYW4oeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXNldHRpbmdzLWJhZGdlLXRleHQnLCB0ZXh0OiB3b3JkIH0pO1xuXG4gICAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IGJhZGdlRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXNldHRpbmdzLWJhZGdlLXJlbW92ZScsXG4gICAgICAgICAgdGV4dDogJ3gnLFxuICAgICAgICB9KTtcbiAgICAgICAgcmVtb3ZlQnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCBgUmVtb3ZlICR7d29yZH1gKTtcbiAgICAgICAgcmVtb3ZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnJlbW92ZUJsYWNrbGlzdFdvcmQod29yZCk7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlc2V0RXhjbHVkZWRXb3JkcyA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1Jlc2V0IGV4Y2x1ZGVkIHdvcmRzJylcbiAgICAgIC5zZXREZXNjKCdSZXN0b3JlIHRoZSBvcmlnaW5hbCBkZWZhdWx0IGJsYWNrbGlzdC4nKVxuICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgIGJ1dHRvblxuICAgICAgICAgIC5zZXRCdXR0b25UZXh0KCdSZXNldCB0byBkZWZhdWx0cycpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4ucmVzZXRCbGFja2xpc3RXb3JkcygpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHJlc2V0RXhjbHVkZWRXb3JkcywgJ1Jlc2V0cyBvbmx5IGV4Y2x1ZGVkIHdvcmRzLiBSZW5kZXJpbmcgYW5kIHBlcmZvcm1hbmNlIHNldHRpbmdzIGFyZSB1bmNoYW5nZWQuJyk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6ICdSZW5kZXJpbmcnIH0pO1xuXG4gICAgY29uc3QgcHJldmlld1dyYXBwZXJFbCA9IGNvbnRhaW5lckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtcHJldmlldycgfSk7XG4gICAgcHJldmlld1dyYXBwZXJFbC5jcmVhdGVFbCgnaDQnLCB7IHRleHQ6ICdQcmV2aWV3JyB9KTtcbiAgICBwcmV2aWV3V3JhcHBlckVsLmNyZWF0ZUVsKCdwJywge1xuICAgICAgdGV4dDogJ0V4YW1wbGUgY2xvdWQgZm9yIHJlbmRlciBzZXR0aW5ncyAoZG9lcyBub3QgdXNlIHlvdXIgdmF1bHQgZGF0YSkuJyxcbiAgICB9KTtcbiAgICBjb25zdCBwcmV2aWV3Q2FudmFzRWwgPSBwcmV2aWV3V3JhcHBlckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtcHJldmlldy1jYW52YXMnIH0pO1xuXG4gICAgbGV0IHByZXZpZXdOb25jZSA9IDA7XG4gICAgY29uc3QgcmVyZW5kZXJQcmV2aWV3ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgY29uc3Qgbm9uY2UgPSArK3ByZXZpZXdOb25jZTtcbiAgICAgIHByZXZpZXdDYW52YXNFbC5lbXB0eSgpO1xuICAgICAgY29uc3QgbG9hZGluZ0VsID0gcHJldmlld0NhbnZhc0VsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLCB0ZXh0OiAnUmVuZGVyaW5nIHByZXZpZXcuLi4nIH0pO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBzYW1wbGVXb3JkcyA9IHRoaXMuYnVpbGRQcmV2aWV3V29yZHModGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyKTtcbiAgICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5kcmF3V29yZENsb3VkKHtcbiAgICAgICAgICBjb250YWluZXJFbDogcHJldmlld0NhbnZhc0VsLFxuICAgICAgICAgIHdvcmRzOiBzYW1wbGVXb3JkcyxcbiAgICAgICAgICBhcmlhTGFiZWw6ICdXb3JkIGNsb3VkIHJlbmRlciBwcmV2aWV3JyxcbiAgICAgICAgICBvbldvcmRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgLy8gbm8tb3AgaW4gc2V0dGluZ3MgcHJldmlld1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZW5hYmxlRXhwb3J0OiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgaWYgKG5vbmNlICE9PSBwcmV2aWV3Tm9uY2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgICAgIHByZXZpZXdDYW52YXNFbC5jcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLFxuICAgICAgICAgIHRleHQ6ICdDb3VsZCBub3QgcmVuZGVyIHByZXZpZXcuJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcgPSBhc3luYyAocGF0Y2g6IFBhcnRpYWw8UmVuZGVyU2V0dGluZ3M+KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbi51cGRhdGVSZW5kZXJTZXR0aW5ncyhwYXRjaCk7XG4gICAgICBhd2FpdCByZXJlbmRlclByZXZpZXcoKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgcm90YXRpb25TdHlsZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1JvdGF0aW9uIHN0eWxlJylcbiAgICAgIC5zZXREZXNjKCdIb3cgd29yZHMgYXJlIGFuZ2xlZCBpbiB0aGUgY2xvdWQuJylcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9uKCdob3Jpem9udGFsJywgJ0hvcml6b250YWwgb25seScpXG4gICAgICAgICAgLmFkZE9wdGlvbignbW9zdGx5LWhvcml6b250YWwnLCAnTW9zdGx5IGhvcml6b250YWwnKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ21peGVkJywgJ01peGVkIGFuZ2xlcycpXG4gICAgICAgICAgLmFkZE9wdGlvbigndmVydGljYWwnLCAnVmVydGljYWwgaGVhdnknKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIucm90YXRpb25QcmVzZXQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7XG4gICAgICAgICAgICAgIHJvdGF0aW9uUHJlc2V0OiB2YWx1ZSBhcyBSb3RhdGlvblByZXNldCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihyb3RhdGlvblN0eWxlLCAnSG9yaXpvbnRhbCBpcyBlYXNpZXN0IHRvIHJlYWQuIE1peGVkL3ZlcnRpY2FsIGNhbiBwYWNrIG1vcmUgd29yZHMgYnV0IG1heSByZWR1Y2UgcmVhZGFiaWxpdHkuJyk7XG5cbiAgICBjb25zdCBzcGlyYWxMYXlvdXQgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdTcGlyYWwgbGF5b3V0JylcbiAgICAgIC5zZXREZXNjKCdQbGFjZW1lbnQgc3RyYXRlZ3kgZm9yIHBvc2l0aW9uaW5nIHdvcmRzLicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbignYXJjaGltZWRlYW4nLCAnQXJjaGltZWRlYW4nKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ3JlY3Rhbmd1bGFyJywgJ1JlY3Rhbmd1bGFyJylcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnNwaXJhbClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHtcbiAgICAgICAgICAgICAgc3BpcmFsOiB2YWx1ZSBhcyBTcGlyYWxUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHNwaXJhbExheW91dCwgJ0FyY2hpbWVkZWFuIGlzIG1vcmUgb3JnYW5pYy4gUmVjdGFuZ3VsYXIgY2FuIGFwcGVhciB0aWdodGVyIGluIHNvbWUgZGF0YXNldHMuJyk7XG5cbiAgICBjb25zdCB3b3JkUGFkZGluZyA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1dvcmQgcGFkZGluZycpXG4gICAgICAuc2V0RGVzYygnU3BhY2UgYmV0d2VlbiB3b3JkcyBpbiBwaXhlbHMuJylcbiAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT4ge1xuICAgICAgICBzbGlkZXJcbiAgICAgICAgICAuc2V0TGltaXRzKDAsIDEyLCAxKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIud29yZFBhZGRpbmcpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgd29yZFBhZGRpbmc6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbih3b3JkUGFkZGluZywgJ0luY3JlYXNlIHRvIHJlZHVjZSBjb2xsaXNpb25zIGFuZCBpbXByb3ZlIHJlYWRhYmlsaXR5LiBMb3dlciB2YWx1ZXMgcGFjayBtb3JlIHdvcmRzLicpO1xuXG4gICAgY29uc3QgbWluRm9udFNpemUgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdNaW5pbXVtIGZvbnQgc2l6ZScpXG4gICAgICAuc2V0RGVzYygnU21hbGxlc3QgcmVuZGVyZWQgd29yZCBzaXplLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cyg4LCA2NCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLm1pbkZvbnRTaXplKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IG1pbkZvbnRTaXplOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24obWluRm9udFNpemUsICdTZXRzIHRoZSBmbG9vciBvZiB2aXN1YWwgc2l6ZSBtYXBwaW5nLiBIaWdoZXIgbWluaW11bSBtYWtlcyBsb3ctZnJlcXVlbmN5IHdvcmRzIG1vcmUgbGVnaWJsZS4nKTtcblxuICAgIGNvbnN0IG1heEZvbnRTaXplID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnTWF4aW11bSBmb250IHNpemUnKVxuICAgICAgLnNldERlc2MoJ0xhcmdlc3QgcmVuZGVyZWQgd29yZCBzaXplLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cygxNiwgMTQwLCAxKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIubWF4Rm9udFNpemUpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgbWF4Rm9udFNpemU6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihtYXhGb250U2l6ZSwgJ1NldHMgdGhlIGNlaWxpbmcgb2YgdmlzdWFsIHNpemUgbWFwcGluZy4gSGlnaGVyIHZhbHVlcyBlbXBoYXNpemUgdG9wIHdvcmRzIG1vcmUgc3Ryb25nbHkuJyk7XG5cbiAgICBjb25zdCBmb250RmFtaWx5ID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnRm9udCBmYW1pbHknKVxuICAgICAgLnNldERlc2MoJ0NTUyBmb250IGZhbWlseSB1c2VkIGZvciB3b3Jkcy4nKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignc2Fucy1zZXJpZicpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5mb250RmFtaWx5KVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyBmb250RmFtaWx5OiB2YWx1ZS50cmltKCkgfHwgJ3NhbnMtc2VyaWYnIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihmb250RmFtaWx5LCAnV2lkZXIgZm9udHMgdGFrZSBtb3JlIHNwYWNlIGFuZCBjYW4gaW5jcmVhc2Ugb3ZlcmxhcCBwcmVzc3VyZS4nKTtcblxuICAgIGNvbnN0IHNob3dDb3VudEluV29yZFRleHQgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdTaG93IGNvdW50IGluIHdvcmQgdGV4dCcpXG4gICAgICAuc2V0RGVzYygnQXBwZW5kIHRoZSBvY2N1cnJlbmNlIGNvdW50IGRpcmVjdGx5IHRvIHJlbmRlcmVkIHdvcmRzLicpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5zaG93Q291bnRJbldvcmRUZXh0KVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyBzaG93Q291bnRJbldvcmRUZXh0OiB2YWx1ZSB9KTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihzaG93Q291bnRJbldvcmRUZXh0LCAnU2hvd3MgZXhhY3QgY291bnRzIGlubGluZSAoZS5nLiwgd29yZCAoMTIpKS4gSW1wcm92ZXMgcHJlY2lzaW9uLCBpbmNyZWFzZXMgdGV4dCBsZW5ndGguJyk7XG5cbiAgICBjb25zdCBjb3VudExhYmVsRm9ybWF0ID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnQ291bnQgbGFiZWwgZm9ybWF0JylcbiAgICAgIC5zZXREZXNjKCdIb3cgY291bnRzIGFyZSBzaG93biB3aGVuIGNvdW50IGxhYmVscyBhcmUgZW5hYmxlZC4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ3BhcmVuJywgJ3dvcmQgKDEyKScpXG4gICAgICAgICAgLmFkZE9wdGlvbignZG90JywgJ3dvcmQgXHUwMEI3IDEyJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdjb2xvbicsICd3b3JkOiAxMicpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5jb3VudExhYmVsRm9ybWF0KVxuICAgICAgICAgIC5zZXREaXNhYmxlZCghdGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnNob3dDb3VudEluV29yZFRleHQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IGNvdW50TGFiZWxGb3JtYXQ6IHZhbHVlIGFzIENvdW50TGFiZWxGb3JtYXQgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGNvdW50TGFiZWxGb3JtYXQsICdGb3JtYXR0aW5nIHN0eWxlIGZvciBpbmxpbmUgY291bnRzLicpO1xuXG4gICAgY29uc3QgY291bnRMYWJlbE1pbmltdW0gPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdDb3VudCBsYWJlbCBtaW5pbXVtJylcbiAgICAgIC5zZXREZXNjKCdTaG93IGlubGluZSBjb3VudCBvbmx5IGZvciB3b3JkcyBhdCBvciBhYm92ZSB0aGlzIGNvdW50LicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cygxLCAxMDAsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5jb3VudExhYmVsTWluQ291bnQpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAuc2V0RGlzYWJsZWQoIXRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5zaG93Q291bnRJbldvcmRUZXh0KVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyBjb3VudExhYmVsTWluQ291bnQ6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihjb3VudExhYmVsTWluaW11bSwgJ0F2b2lkcyB2aXN1YWwgbm9pc2UgYnkgaGlkaW5nIGNvdW50cyBmb3IgdmVyeSBzbWFsbCB2YWx1ZXMuJyk7XG5cbiAgICBjb25zdCBzaXplU2NhbGluZ01vZGUgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdTaXplIHNjYWxpbmcgbW9kZScpXG4gICAgICAuc2V0RGVzYygnSG93IG51bWVyaWMgY291bnQgZGlmZmVyZW5jZXMgbWFwIHRvIGZvbnQtc2l6ZSBkaWZmZXJlbmNlcy4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ2xpbmVhcicsICdMaW5lYXInKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ3Bvd2VyJywgJ1Bvd2VyJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdsb2cnLCAnTG9nJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdyYW5rJywgJ1JhbmsnKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuc2NhbGluZ01vZGUpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IHNjYWxpbmdNb2RlOiB2YWx1ZSBhcyBTY2FsaW5nTW9kZSB9KTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihzaXplU2NhbGluZ01vZGUsICdMaW5lYXIgaXMgcHJvcG9ydGlvbmFsLiBQb3dlciBleGFnZ2VyYXRlcyBnYXBzLiBMb2cgY29tcHJlc3NlcyBleHRyZW1lcy4gUmFuayBpZ25vcmVzIGFic29sdXRlIGdhcHMuJyk7XG5cbiAgICBjb25zdCBlbXBoYXNpcyA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0VtcGhhc2lzJylcbiAgICAgIC5zZXREZXNjKCdIaWdoZXIgdmFsdWVzIGV4YWdnZXJhdGUgc2l6ZSBkaWZmZXJlbmNlcyAocG93ZXIgc2NhbGluZyBtb2RlKS4nKVxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG4gICAgICAgIHNsaWRlclxuICAgICAgICAgIC5zZXRMaW1pdHMoMC41LCAzLCAwLjEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5lbXBoYXNpcylcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5zZXREaXNhYmxlZCh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuc2NhbGluZ01vZGUgIT09ICdwb3dlcicpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IGVtcGhhc2lzOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oZW1waGFzaXMsICdPbmx5IHVzZWQgaW4gUG93ZXIgc2NhbGluZyBtb2RlLiAxLjAgaXMgYmFzZWxpbmU7IGhpZ2hlciBleGFnZ2VyYXRlcyBkaWZmZXJlbmNlcyBtb3JlLicpO1xuXG4gICAgY29uc3QgZGV0ZXJtaW5pc3RpY0xheW91dCA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0RldGVybWluaXN0aWMgbGF5b3V0JylcbiAgICAgIC5zZXREZXNjKCdLZWVwIGNsb3VkIGxheW91dCBzdGFibGUgYWNyb3NzIHJlZnJlc2hlcyB1c2luZyBhIHNlZWQuJylcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGVcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmRldGVybWluaXN0aWNMYXlvdXQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IGRldGVybWluaXN0aWNMYXlvdXQ6IHZhbHVlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGRldGVybWluaXN0aWNMYXlvdXQsICdVc2VmdWwgZm9yIGNvbXBhcmluZyBiZWZvcmUvYWZ0ZXIgY2hhbmdlcyB3aXRoIHN0YWJsZSBwb3NpdGlvbnMuJyk7XG5cbiAgICBjb25zdCByYW5kb21TZWVkID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUmFuZG9tIHNlZWQnKVxuICAgICAgLnNldERlc2MoJ1NlZWQgdXNlZCB3aGVuIGRldGVybWluaXN0aWMgbGF5b3V0IGlzIGVuYWJsZWQuJylcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB7XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0VmFsdWUoU3RyaW5nKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5yYW5kb21TZWVkKSlcbiAgICAgICAgICAuc2V0RGlzYWJsZWQoIXRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5kZXRlcm1pbmlzdGljTGF5b3V0KVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IE51bWJlci5wYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xuICAgICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgcmFuZG9tU2VlZDogcGFyc2VkIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihyYW5kb21TZWVkLCAnQ2hhbmdpbmcgc2VlZCBnaXZlcyBhIGRpZmZlcmVudCBzdGFibGUgYXJyYW5nZW1lbnQuJyk7XG5cbiAgICBjb25zdCByZXNldFJlbmRlcmluZyA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1Jlc2V0IHJlbmRlcmluZyBzZXR0aW5ncycpXG4gICAgICAuc2V0RGVzYygnUmVzdG9yZSBkZWZhdWx0IHJlbmRlcmVyIGNvbnRyb2xzLicpXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uXG4gICAgICAgICAgLnNldEJ1dHRvblRleHQoJ1Jlc2V0IHJlbmRlcmluZycpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4ucmVzZXRSZW5kZXJTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHJlc2V0UmVuZGVyaW5nLCAnUmVzZXRzIHJlbmRlcmluZyBvcHRpb25zIG9ubHkuJyk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6ICdQZXJmb3JtYW5jZScgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ3AnLCB7XG4gICAgICB0ZXh0OiAnVHVuZSBzcGVlZCB2cyBVSSBzbW9vdGhuZXNzIGFuZCBwcm9ncmVzcyB1cGRhdGUgZGV0YWlsIGZvciBsYXJnZSBjbG91ZHMuJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByb2dyZXNzRGV0YWlsID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUHJvZ3Jlc3MgZGV0YWlsJylcbiAgICAgIC5zZXREZXNjKCdIb3cgZnJlcXVlbnRseSBwcm9ncmVzcyBpcyB1cGRhdGVkIHdoaWxlIHNjYW5uaW5nIGFuZCBsYXlvdXQuJylcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9uKCd1bmhpbmdlZCcsICdVbmhpbmdlZCAobWF4IHNwZWVkKScpXG4gICAgICAgICAgLmFkZE9wdGlvbignbWluaW1hbCcsICdNaW5pbWFsIChmYXN0ZXN0KScpXG4gICAgICAgICAgLmFkZE9wdGlvbignYmFsYW5jZWQnLCAnQmFsYW5jZWQnKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ2RldGFpbGVkJywgJ0RldGFpbGVkJylcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnByb2dyZXNzRGV0YWlsKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnVwZGF0ZVJlbmRlclNldHRpbmdzKHsgcHJvZ3Jlc3NEZXRhaWw6IHZhbHVlIGFzIFByb2dyZXNzRGV0YWlsIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihwcm9ncmVzc0RldGFpbCwgJ1VuaGluZ2VkIG1heGltaXplcyBzcGVlZCBhbmQgbWF5IGxvY2sgVUkgdGVtcG9yYXJpbHkuIERldGFpbGVkIGlzIG1vc3QgaW5mb3JtYXRpdmUgYnV0IHNsb3dlci4nKTtcblxuICAgIGNvbnN0IHNjYW5CYXRjaFNpemUgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdTY2FuIGJhdGNoIHNpemUnKVxuICAgICAgLnNldERlc2MoJ0hvdyBtYW55IGZpbGVzIGFyZSByZWFkIGluIHBhcmFsbGVsIGR1cmluZyB2YXVsdCBzY2FubmluZy4nKVxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG4gICAgICAgIHNsaWRlclxuICAgICAgICAgIC5zZXRMaW1pdHMoOCwgNjQsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5zY2FuQmF0Y2hTaXplKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udXBkYXRlUmVuZGVyU2V0dGluZ3MoeyBzY2FuQmF0Y2hTaXplOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oc2NhbkJhdGNoU2l6ZSwgJ0hpZ2hlciBjYW4gYmUgZmFzdGVyIG9uIHN0cm9uZyBkZXZpY2VzIGJ1dCB1c2VzIG1vcmUgbWVtb3J5L0lPLicpO1xuXG4gICAgY29uc3QgbGF5b3V0VGltZVNsaWNlID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnTGF5b3V0IHRpbWUgc2xpY2UgKG1zKScpXG4gICAgICAuc2V0RGVzYygnVGltZSBwZXIgbGF5b3V0IGNodW5rLiBMb3dlciBpcyBzbW9vdGhlcjsgaGlnaGVyIGlzIGZhc3Rlci4nKVxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG4gICAgICAgIHNsaWRlclxuICAgICAgICAgIC5zZXRMaW1pdHMoOCwgNDAsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5sYXlvdXRUaW1lSW50ZXJ2YWxNcylcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnVwZGF0ZVJlbmRlclNldHRpbmdzKHsgbGF5b3V0VGltZUludGVydmFsTXM6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihsYXlvdXRUaW1lU2xpY2UsICdDb250cm9scyByZXNwb25zaXZlbmVzcyB3aGlsZSBsYXlpbmcgb3V0IHdvcmRzLicpO1xuXG4gICAgY29uc3QgcmVzZXRQZXJmb3JtYW5jZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1Jlc2V0IHBlcmZvcm1hbmNlIHNldHRpbmdzJylcbiAgICAgIC5zZXREZXNjKCdSZXN0b3JlIGRlZmF1bHQgcGVyZm9ybWFuY2UgdHVuaW5nIHZhbHVlcy4nKVxuICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgIGJ1dHRvblxuICAgICAgICAgIC5zZXRCdXR0b25UZXh0KCdSZXNldCBwZXJmb3JtYW5jZScpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udXBkYXRlUmVuZGVyU2V0dGluZ3Moe1xuICAgICAgICAgICAgICBwcm9ncmVzc0RldGFpbDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIucHJvZ3Jlc3NEZXRhaWwsXG4gICAgICAgICAgICAgIHNjYW5CYXRjaFNpemU6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnNjYW5CYXRjaFNpemUsXG4gICAgICAgICAgICAgIGxheW91dFRpbWVJbnRlcnZhbE1zOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5sYXlvdXRUaW1lSW50ZXJ2YWxNcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHJlc2V0UGVyZm9ybWFuY2UsICdSZXNldHMgcGVyZm9ybWFuY2UgdHVuaW5nIG9ubHkuJyk7XG5cbiAgICB2b2lkIHJlcmVuZGVyUHJldmlldygpO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hJbmZvSWNvbihzZXR0aW5nOiBTZXR0aW5nLCBpbmZvVGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgaWNvbiA9IHNldHRpbmcubmFtZUVsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICBjbHM6ICd3b3JkLWNsb3VkLXNldHRpbmctaW5mbycsXG4gICAgICB0ZXh0OiAnaScsXG4gICAgfSk7XG4gICAgaWNvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgaWNvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1Nob3cgc2V0dGluZyBkZXRhaWxzJyk7XG4gICAgaWNvbi5zZXRBdHRyKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nLCAndG9wJyk7XG4gICAgaWNvbi5zZXRBdHRyKCdkYXRhLXRvb2x0aXAnLCBpbmZvVGV4dCk7XG5cbiAgICBjb25zdCBwb3BvdmVyID0gc2V0dGluZy5zZXR0aW5nRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1zZXR0aW5nLWluZm8tcG9wb3ZlcicgfSk7XG4gICAgcG9wb3Zlci5zZXRUZXh0KGluZm9UZXh0KTtcbiAgICBwb3BvdmVyLnNldEF0dHIoJ2hpZGRlbicsICd0cnVlJyk7XG5cbiAgICBpY29uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGlmIChwb3BvdmVyLmhhc0F0dHJpYnV0ZSgnaGlkZGVuJykpIHtcbiAgICAgICAgcG9wb3Zlci5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9wb3Zlci5zZXRBdHRyKCdoaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWNvbi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICBwb3BvdmVyLnNldEF0dHIoJ2hpZGRlbicsICd0cnVlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkUHJldmlld1dvcmRzKHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyk6IFdlaWdodGVkV29yZFtdIHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFtcbiAgICAgIHsgdGV4dDogJ29ic2lkaWFuJywgY291bnQ6IDQ4IH0sXG4gICAgICB7IHRleHQ6ICdub3RlcycsIGNvdW50OiA0MyB9LFxuICAgICAgeyB0ZXh0OiAncGx1Z2lucycsIGNvdW50OiAzNiB9LFxuICAgICAgeyB0ZXh0OiAndmF1bHQnLCBjb3VudDogMzMgfSxcbiAgICAgIHsgdGV4dDogJ3Jlc2VhcmNoJywgY291bnQ6IDI4IH0sXG4gICAgICB7IHRleHQ6ICdpZGVhcycsIGNvdW50OiAyNSB9LFxuICAgICAgeyB0ZXh0OiAnd3JpdGluZycsIGNvdW50OiAyMiB9LFxuICAgICAgeyB0ZXh0OiAnZGFpbHknLCBjb3VudDogMjAgfSxcbiAgICAgIHsgdGV4dDogJ3Byb2plY3QnLCBjb3VudDogMTggfSxcbiAgICAgIHsgdGV4dDogJ3JldmlldycsIGNvdW50OiAxNiB9LFxuICAgICAgeyB0ZXh0OiAnZGVzaWduJywgY291bnQ6IDE0IH0sXG4gICAgICB7IHRleHQ6ICdtZWV0aW5nJywgY291bnQ6IDEyIH0sXG4gICAgICB7IHRleHQ6ICd0YXNrcycsIGNvdW50OiAxMSB9LFxuICAgICAgeyB0ZXh0OiAnam91cm5hbCcsIGNvdW50OiAxMCB9LFxuICAgICAgeyB0ZXh0OiAnZHJhZnQnLCBjb3VudDogOSB9LFxuICAgICAgeyB0ZXh0OiAncmVhZGluZycsIGNvdW50OiA4IH0sXG4gICAgICB7IHRleHQ6ICdwbGFuJywgY291bnQ6IDcgfSxcbiAgICAgIHsgdGV4dDogJ2ZvY3VzJywgY291bnQ6IDYgfSxcbiAgICAgIHsgdGV4dDogJ2hhYml0JywgY291bnQ6IDUgfSxcbiAgICAgIHsgdGV4dDogJ2dvYWxzJywgY291bnQ6IDQgfSxcbiAgICBdO1xuXG4gICAgcmV0dXJuIG1hcENvdW50c1RvV2VpZ2h0ZWRXb3Jkcyh0ZW1wbGF0ZS5tYXAoKGVudHJ5KSA9PiBbZW50cnkudGV4dCwgZW50cnkuY291bnRdIGFzIFtzdHJpbmcsIG51bWJlcl0pLCByZW5kZXJTZXR0aW5ncyk7XG4gIH1cbn1cbiIsICJpbXBvcnQgdHlwZSB7IFJlbmRlclNldHRpbmdzLCBXZWlnaHRlZFdvcmQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBDb3VudHNUb1dlaWdodGVkV29yZHMoXG4gIGVudHJpZXM6IEFycmF5PFtzdHJpbmcsIG51bWJlcl0+LFxuICByZW5kZXJTZXR0aW5nczogUmVuZGVyU2V0dGluZ3MsXG4pOiBXZWlnaHRlZFdvcmRbXSB7XG4gIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IG1pbkZvbnRTaXplID0gTWF0aC5tYXgoOCwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy5taW5Gb250U2l6ZSkpO1xuICBjb25zdCBtYXhGb250U2l6ZSA9IE1hdGgubWF4KG1pbkZvbnRTaXplICsgMSwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy5tYXhGb250U2l6ZSkpO1xuICBjb25zdCBlbXBoYXNpcyA9IE1hdGgubWF4KDAuNSwgTWF0aC5taW4oMywgcmVuZGVyU2V0dGluZ3MuZW1waGFzaXMpKTtcblxuICBjb25zdCBub3JtYWxpemVkRW50cmllcyA9IGVudHJpZXNcbiAgICAubWFwKChbdGV4dCwgY291bnRdLCBpbmRleCkgPT4gKHtcbiAgICAgIHRleHQsXG4gICAgICBjb3VudCxcbiAgICAgIGluZGV4LFxuICAgICAgc2NvcmU6IGNvbXB1dGVTY2FsZVNjb3JlKGNvdW50LCBpbmRleCwgZW50cmllcywgcmVuZGVyU2V0dGluZ3MsIGVtcGhhc2lzKSxcbiAgICB9KSlcbiAgICAuc29ydCgoYSwgYikgPT4gYi5jb3VudCAtIGEuY291bnQgfHwgYS5pbmRleCAtIGIuaW5kZXgpO1xuXG4gIHJldHVybiBub3JtYWxpemVkRW50cmllcy5tYXAoKGVudHJ5KSA9PiB7XG4gICAgY29uc3Qgc2l6ZSA9IE1hdGgucm91bmQobWluRm9udFNpemUgKyBlbnRyeS5zY29yZSAqIChtYXhGb250U2l6ZSAtIG1pbkZvbnRTaXplKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRleHQ6IGVudHJ5LnRleHQsXG4gICAgICBjb3VudDogZW50cnkuY291bnQsXG4gICAgICBzaXplLFxuICAgIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlU2NhbGVTY29yZShcbiAgY291bnQ6IG51bWJlcixcbiAgaW5kZXg6IG51bWJlcixcbiAgZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sXG4gIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyxcbiAgZW1waGFzaXM6IG51bWJlcixcbik6IG51bWJlciB7XG4gIGNvbnN0IGNvdW50cyA9IGVudHJpZXMubWFwKChbLCBlbnRyeUNvdW50XSkgPT4gZW50cnlDb3VudCk7XG4gIGNvbnN0IG1pbkNvdW50ID0gY291bnRzW2NvdW50cy5sZW5ndGggLSAxXTtcbiAgY29uc3QgbWF4Q291bnQgPSBjb3VudHNbMF07XG5cbiAgaWYgKG1heENvdW50IDw9IG1pbkNvdW50KSB7XG4gICAgcmV0dXJuIDAuNTtcbiAgfVxuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5zY2FsaW5nTW9kZSA9PT0gJ3JhbmsnKSB7XG4gICAgaWYgKGVudHJpZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gMC41O1xuICAgIH1cbiAgICByZXR1cm4gMSAtIGluZGV4IC8gKGVudHJpZXMubGVuZ3RoIC0gMSk7XG4gIH1cblxuICBpZiAocmVuZGVyU2V0dGluZ3Muc2NhbGluZ01vZGUgPT09ICdsb2cnKSB7XG4gICAgY29uc3Qgc2FmZU1pbiA9IE1hdGgubWF4KDEsIG1pbkNvdW50KTtcbiAgICBjb25zdCBzYWZlTWF4ID0gTWF0aC5tYXgoc2FmZU1pbiArIDEsIG1heENvdW50KTtcbiAgICBjb25zdCBudW1lcmF0b3IgPSBNYXRoLmxvZyhNYXRoLm1heCgxLCBjb3VudCkpIC0gTWF0aC5sb2coc2FmZU1pbik7XG4gICAgY29uc3QgZGVub21pbmF0b3IgPSBNYXRoLmxvZyhzYWZlTWF4KSAtIE1hdGgubG9nKHNhZmVNaW4pO1xuICAgIHJldHVybiBjbGFtcDAxKGRlbm9taW5hdG9yID09PSAwID8gMC41IDogbnVtZXJhdG9yIC8gZGVub21pbmF0b3IpO1xuICB9XG5cbiAgY29uc3QgbGluZWFyID0gKGNvdW50IC0gbWluQ291bnQpIC8gKG1heENvdW50IC0gbWluQ291bnQpO1xuICBpZiAocmVuZGVyU2V0dGluZ3Muc2NhbGluZ01vZGUgPT09ICdwb3dlcicpIHtcbiAgICByZXR1cm4gY2xhbXAwMShNYXRoLnBvdyhsaW5lYXIsIGVtcGhhc2lzKSk7XG4gIH1cblxuICByZXR1cm4gY2xhbXAwMShsaW5lYXIpO1xufVxuXG5mdW5jdGlvbiBjbGFtcDAxKHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgdmFsdWUpKTtcbn1cbiIsICJleHBvcnQgY2xhc3MgSW50ZXJuTWFwIGV4dGVuZHMgTWFwIHtcbiAgY29uc3RydWN0b3IoZW50cmllcywga2V5ID0ga2V5b2YpIHtcbiAgICBzdXBlcigpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtfaW50ZXJuOiB7dmFsdWU6IG5ldyBNYXAoKX0sIF9rZXk6IHt2YWx1ZToga2V5fX0pO1xuICAgIGlmIChlbnRyaWVzICE9IG51bGwpIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGVudHJpZXMpIHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuICB9XG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gc3VwZXIuZ2V0KGludGVybl9nZXQodGhpcywga2V5KSk7XG4gIH1cbiAgaGFzKGtleSkge1xuICAgIHJldHVybiBzdXBlci5oYXMoaW50ZXJuX2dldCh0aGlzLCBrZXkpKTtcbiAgfVxuICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5zZXQoaW50ZXJuX3NldCh0aGlzLCBrZXkpLCB2YWx1ZSk7XG4gIH1cbiAgZGVsZXRlKGtleSkge1xuICAgIHJldHVybiBzdXBlci5kZWxldGUoaW50ZXJuX2RlbGV0ZSh0aGlzLCBrZXkpKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW50ZXJuU2V0IGV4dGVuZHMgU2V0IHtcbiAgY29uc3RydWN0b3IodmFsdWVzLCBrZXkgPSBrZXlvZikge1xuICAgIHN1cGVyKCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge19pbnRlcm46IHt2YWx1ZTogbmV3IE1hcCgpfSwgX2tleToge3ZhbHVlOiBrZXl9fSk7XG4gICAgaWYgKHZhbHVlcyAhPSBudWxsKSBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykgdGhpcy5hZGQodmFsdWUpO1xuICB9XG4gIGhhcyh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5oYXMoaW50ZXJuX2dldCh0aGlzLCB2YWx1ZSkpO1xuICB9XG4gIGFkZCh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5hZGQoaW50ZXJuX3NldCh0aGlzLCB2YWx1ZSkpO1xuICB9XG4gIGRlbGV0ZSh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5kZWxldGUoaW50ZXJuX2RlbGV0ZSh0aGlzLCB2YWx1ZSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludGVybl9nZXQoe19pbnRlcm4sIF9rZXl9LCB2YWx1ZSkge1xuICBjb25zdCBrZXkgPSBfa2V5KHZhbHVlKTtcbiAgcmV0dXJuIF9pbnRlcm4uaGFzKGtleSkgPyBfaW50ZXJuLmdldChrZXkpIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGludGVybl9zZXQoe19pbnRlcm4sIF9rZXl9LCB2YWx1ZSkge1xuICBjb25zdCBrZXkgPSBfa2V5KHZhbHVlKTtcbiAgaWYgKF9pbnRlcm4uaGFzKGtleSkpIHJldHVybiBfaW50ZXJuLmdldChrZXkpO1xuICBfaW50ZXJuLnNldChrZXksIHZhbHVlKTtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBpbnRlcm5fZGVsZXRlKHtfaW50ZXJuLCBfa2V5fSwgdmFsdWUpIHtcbiAgY29uc3Qga2V5ID0gX2tleSh2YWx1ZSk7XG4gIGlmIChfaW50ZXJuLmhhcyhrZXkpKSB7XG4gICAgdmFsdWUgPSBfaW50ZXJuLmdldChrZXkpO1xuICAgIF9pbnRlcm4uZGVsZXRlKGtleSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBrZXlvZih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGluaXRSYW5nZShkb21haW4sIHJhbmdlKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogYnJlYWs7XG4gICAgY2FzZSAxOiB0aGlzLnJhbmdlKGRvbWFpbik7IGJyZWFrO1xuICAgIGRlZmF1bHQ6IHRoaXMucmFuZ2UocmFuZ2UpLmRvbWFpbihkb21haW4pOyBicmVhaztcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRJbnRlcnBvbGF0b3IoZG9tYWluLCBpbnRlcnBvbGF0b3IpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiBicmVhaztcbiAgICBjYXNlIDE6IHtcbiAgICAgIGlmICh0eXBlb2YgZG9tYWluID09PSBcImZ1bmN0aW9uXCIpIHRoaXMuaW50ZXJwb2xhdG9yKGRvbWFpbik7XG4gICAgICBlbHNlIHRoaXMucmFuZ2UoZG9tYWluKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICB0aGlzLmRvbWFpbihkb21haW4pO1xuICAgICAgaWYgKHR5cGVvZiBpbnRlcnBvbGF0b3IgPT09IFwiZnVuY3Rpb25cIikgdGhpcy5pbnRlcnBvbGF0b3IoaW50ZXJwb2xhdG9yKTtcbiAgICAgIGVsc2UgdGhpcy5yYW5nZShpbnRlcnBvbGF0b3IpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCB7SW50ZXJuTWFwfSBmcm9tIFwiZDMtYXJyYXlcIjtcbmltcG9ydCB7aW5pdFJhbmdlfSBmcm9tIFwiLi9pbml0LmpzXCI7XG5cbmV4cG9ydCBjb25zdCBpbXBsaWNpdCA9IFN5bWJvbChcImltcGxpY2l0XCIpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcmRpbmFsKCkge1xuICB2YXIgaW5kZXggPSBuZXcgSW50ZXJuTWFwKCksXG4gICAgICBkb21haW4gPSBbXSxcbiAgICAgIHJhbmdlID0gW10sXG4gICAgICB1bmtub3duID0gaW1wbGljaXQ7XG5cbiAgZnVuY3Rpb24gc2NhbGUoZCkge1xuICAgIGxldCBpID0gaW5kZXguZ2V0KGQpO1xuICAgIGlmIChpID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh1bmtub3duICE9PSBpbXBsaWNpdCkgcmV0dXJuIHVua25vd247XG4gICAgICBpbmRleC5zZXQoZCwgaSA9IGRvbWFpbi5wdXNoKGQpIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiByYW5nZVtpICUgcmFuZ2UubGVuZ3RoXTtcbiAgfVxuXG4gIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkb21haW4uc2xpY2UoKTtcbiAgICBkb21haW4gPSBbXSwgaW5kZXggPSBuZXcgSW50ZXJuTWFwKCk7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiBfKSB7XG4gICAgICBpZiAoaW5kZXguaGFzKHZhbHVlKSkgY29udGludWU7XG4gICAgICBpbmRleC5zZXQodmFsdWUsIGRvbWFpbi5wdXNoKHZhbHVlKSAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gc2NhbGU7XG4gIH07XG5cbiAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocmFuZ2UgPSBBcnJheS5mcm9tKF8pLCBzY2FsZSkgOiByYW5nZS5zbGljZSgpO1xuICB9O1xuXG4gIHNjYWxlLnVua25vd24gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodW5rbm93biA9IF8sIHNjYWxlKSA6IHVua25vd247XG4gIH07XG5cbiAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBvcmRpbmFsKGRvbWFpbiwgcmFuZ2UpLnVua25vd24odW5rbm93bik7XG4gIH07XG5cbiAgaW5pdFJhbmdlLmFwcGx5KHNjYWxlLCBhcmd1bWVudHMpO1xuXG4gIHJldHVybiBzY2FsZTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgdmFyIG4gPSBzcGVjaWZpZXIubGVuZ3RoIC8gNiB8IDAsIGNvbG9ycyA9IG5ldyBBcnJheShuKSwgaSA9IDA7XG4gIHdoaWxlIChpIDwgbikgY29sb3JzW2ldID0gXCIjXCIgKyBzcGVjaWZpZXIuc2xpY2UoaSAqIDYsICsraSAqIDYpO1xuICByZXR1cm4gY29sb3JzO1xufVxuIiwgImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9ycy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnMoXCI0ZTc5YTdmMjhlMmNlMTU3NTk3NmI3YjI1OWExNGZlZGM5NDlhZjdhYTFmZjlkYTc5Yzc1NWZiYWIwYWJcIik7XG4iLCAiZXhwb3J0IHZhciB4aHRtbCA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHN2ZzogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICB4aHRtbDogeGh0bWwsXG4gIHhsaW5rOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixcbiAgeG1sOiBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiLFxuICB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiXG59O1xuIiwgImltcG9ydCBuYW1lc3BhY2VzIGZyb20gXCIuL25hbWVzcGFjZXMuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICB2YXIgcHJlZml4ID0gbmFtZSArPSBcIlwiLCBpID0gcHJlZml4LmluZGV4T2YoXCI6XCIpO1xuICBpZiAoaSA+PSAwICYmIChwcmVmaXggPSBuYW1lLnNsaWNlKDAsIGkpKSAhPT0gXCJ4bWxuc1wiKSBuYW1lID0gbmFtZS5zbGljZShpICsgMSk7XG4gIHJldHVybiBuYW1lc3BhY2VzLmhhc093blByb3BlcnR5KHByZWZpeCkgPyB7c3BhY2U6IG5hbWVzcGFjZXNbcHJlZml4XSwgbG9jYWw6IG5hbWV9IDogbmFtZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbn1cbiIsICJpbXBvcnQgbmFtZXNwYWNlIGZyb20gXCIuL25hbWVzcGFjZS5qc1wiO1xuaW1wb3J0IHt4aHRtbH0gZnJvbSBcIi4vbmFtZXNwYWNlcy5qc1wiO1xuXG5mdW5jdGlvbiBjcmVhdG9ySW5oZXJpdChuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQsXG4gICAgICAgIHVyaSA9IHRoaXMubmFtZXNwYWNlVVJJO1xuICAgIHJldHVybiB1cmkgPT09IHhodG1sICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5uYW1lc3BhY2VVUkkgPT09IHhodG1sXG4gICAgICAgID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKVxuICAgICAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh1cmksIG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdG9yRml4ZWQoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGZ1bGxuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuICByZXR1cm4gKGZ1bGxuYW1lLmxvY2FsXG4gICAgICA/IGNyZWF0b3JGaXhlZFxuICAgICAgOiBjcmVhdG9ySW5oZXJpdCkoZnVsbG5hbWUpO1xufVxuIiwgImZ1bmN0aW9uIG5vbmUoKSB7fVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gc2VsZWN0b3IgPT0gbnVsbCA/IG5vbmUgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBzZWxlY3RvciBmcm9tIFwiLi4vc2VsZWN0b3IuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0KSB7XG4gIGlmICh0eXBlb2Ygc2VsZWN0ICE9PSBcImZ1bmN0aW9uXCIpIHNlbGVjdCA9IHNlbGVjdG9yKHNlbGVjdCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzdWJncm91cCA9IHN1Ymdyb3Vwc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgc3Vibm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiAoc3Vibm9kZSA9IHNlbGVjdC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkpIHtcbiAgICAgICAgaWYgKFwiX19kYXRhX19cIiBpbiBub2RlKSBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgICAgc3ViZ3JvdXBbaV0gPSBzdWJub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCAiLy8gR2l2ZW4gc29tZXRoaW5nIGFycmF5IGxpa2UgKG9yIG51bGwpLCByZXR1cm5zIHNvbWV0aGluZyB0aGF0IGlzIHN0cmljdGx5IGFuXG4vLyBhcnJheS4gVGhpcyBpcyB1c2VkIHRvIGVuc3VyZSB0aGF0IGFycmF5LWxpa2Ugb2JqZWN0cyBwYXNzZWQgdG8gZDMuc2VsZWN0QWxsXG4vLyBvciBzZWxlY3Rpb24uc2VsZWN0QWxsIGFyZSBjb252ZXJ0ZWQgaW50byBwcm9wZXIgYXJyYXlzIHdoZW4gY3JlYXRpbmcgYVxuLy8gc2VsZWN0aW9uOyB3ZSBkb25cdTIwMTl0IGV2ZXIgd2FudCB0byBjcmVhdGUgYSBzZWxlY3Rpb24gYmFja2VkIGJ5IGEgbGl2ZVxuLy8gSFRNTENvbGxlY3Rpb24gb3IgTm9kZUxpc3QuIEhvd2V2ZXIsIG5vdGUgdGhhdCBzZWxlY3Rpb24uc2VsZWN0QWxsIHdpbGwgdXNlIGFcbi8vIHN0YXRpYyBOb2RlTGlzdCBhcyBhIGdyb3VwLCBzaW5jZSBpdCBzYWZlbHkgZGVyaXZlZCBmcm9tIHF1ZXJ5U2VsZWN0b3JBbGwuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhcnJheSh4KSB7XG4gIHJldHVybiB4ID09IG51bGwgPyBbXSA6IEFycmF5LmlzQXJyYXkoeCkgPyB4IDogQXJyYXkuZnJvbSh4KTtcbn1cbiIsICJmdW5jdGlvbiBlbXB0eSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gc2VsZWN0b3IgPT0gbnVsbCA/IGVtcHR5IDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQgYXJyYXkgZnJvbSBcIi4uL2FycmF5LmpzXCI7XG5pbXBvcnQgc2VsZWN0b3JBbGwgZnJvbSBcIi4uL3NlbGVjdG9yQWxsLmpzXCI7XG5cbmZ1bmN0aW9uIGFycmF5QWxsKHNlbGVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGFycmF5KHNlbGVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0KSB7XG4gIGlmICh0eXBlb2Ygc2VsZWN0ID09PSBcImZ1bmN0aW9uXCIpIHNlbGVjdCA9IGFycmF5QWxsKHNlbGVjdCk7XG4gIGVsc2Ugc2VsZWN0ID0gc2VsZWN0b3JBbGwoc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBbXSwgcGFyZW50cyA9IFtdLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cHMucHVzaChzZWxlY3QuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpO1xuICAgICAgICBwYXJlbnRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCBwYXJlbnRzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcyhzZWxlY3Rvcik7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGlsZE1hdGNoZXIoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5tYXRjaGVzKHNlbGVjdG9yKTtcbiAgfTtcbn1cblxuIiwgImltcG9ydCB7Y2hpbGRNYXRjaGVyfSBmcm9tIFwiLi4vbWF0Y2hlci5qc1wiO1xuXG52YXIgZmluZCA9IEFycmF5LnByb3RvdHlwZS5maW5kO1xuXG5mdW5jdGlvbiBjaGlsZEZpbmQobWF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmaW5kLmNhbGwodGhpcy5jaGlsZHJlbiwgbWF0Y2gpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjaGlsZEZpcnN0KCkge1xuICByZXR1cm4gdGhpcy5maXJzdEVsZW1lbnRDaGlsZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KG1hdGNoID09IG51bGwgPyBjaGlsZEZpcnN0XG4gICAgICA6IGNoaWxkRmluZCh0eXBlb2YgbWF0Y2ggPT09IFwiZnVuY3Rpb25cIiA/IG1hdGNoIDogY2hpbGRNYXRjaGVyKG1hdGNoKSkpO1xufVxuIiwgImltcG9ydCB7Y2hpbGRNYXRjaGVyfSBmcm9tIFwiLi4vbWF0Y2hlci5qc1wiO1xuXG52YXIgZmlsdGVyID0gQXJyYXkucHJvdG90eXBlLmZpbHRlcjtcblxuZnVuY3Rpb24gY2hpbGRyZW4oKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKHRoaXMuY2hpbGRyZW4pO1xufVxuXG5mdW5jdGlvbiBjaGlsZHJlbkZpbHRlcihtYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZpbHRlci5jYWxsKHRoaXMuY2hpbGRyZW4sIG1hdGNoKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0QWxsKG1hdGNoID09IG51bGwgPyBjaGlsZHJlblxuICAgICAgOiBjaGlsZHJlbkZpbHRlcih0eXBlb2YgbWF0Y2ggPT09IFwiZnVuY3Rpb25cIiA/IG1hdGNoIDogY2hpbGRNYXRjaGVyKG1hdGNoKSkpO1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IG1hdGNoZXIgZnJvbSBcIi4uL21hdGNoZXIuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgaWYgKHR5cGVvZiBtYXRjaCAhPT0gXCJmdW5jdGlvblwiKSBtYXRjaCA9IG1hdGNoZXIobWF0Y2gpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc3ViZ3JvdXAgPSBzdWJncm91cHNbal0gPSBbXSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiBtYXRjaC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odXBkYXRlKSB7XG4gIHJldHVybiBuZXcgQXJyYXkodXBkYXRlLmxlbmd0aCk7XG59XG4iLCAiaW1wb3J0IHNwYXJzZSBmcm9tIFwiLi9zcGFyc2UuanNcIjtcbmltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odGhpcy5fZW50ZXIgfHwgdGhpcy5fZ3JvdXBzLm1hcChzcGFyc2UpLCB0aGlzLl9wYXJlbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVudGVyTm9kZShwYXJlbnQsIGRhdHVtKSB7XG4gIHRoaXMub3duZXJEb2N1bWVudCA9IHBhcmVudC5vd25lckRvY3VtZW50O1xuICB0aGlzLm5hbWVzcGFjZVVSSSA9IHBhcmVudC5uYW1lc3BhY2VVUkk7XG4gIHRoaXMuX25leHQgPSBudWxsO1xuICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMuX19kYXRhX18gPSBkYXR1bTtcbn1cblxuRW50ZXJOb2RlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEVudGVyTm9kZSxcbiAgYXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uKGNoaWxkKSB7IHJldHVybiB0aGlzLl9wYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCB0aGlzLl9uZXh0KTsgfSxcbiAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihjaGlsZCwgbmV4dCkgeyByZXR1cm4gdGhpcy5fcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgbmV4dCk7IH0sXG4gIHF1ZXJ5U2VsZWN0b3I6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7IHJldHVybiB0aGlzLl9wYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7IH0sXG4gIHF1ZXJ5U2VsZWN0b3JBbGw6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7IHJldHVybiB0aGlzLl9wYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7IH1cbn07XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHg7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQge0VudGVyTm9kZX0gZnJvbSBcIi4vZW50ZXIuanNcIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi4vY29uc3RhbnQuanNcIjtcblxuZnVuY3Rpb24gYmluZEluZGV4KHBhcmVudCwgZ3JvdXAsIGVudGVyLCB1cGRhdGUsIGV4aXQsIGRhdGEpIHtcbiAgdmFyIGkgPSAwLFxuICAgICAgbm9kZSxcbiAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuXG4gIC8vIFB1dCBhbnkgbm9uLW51bGwgbm9kZXMgdGhhdCBmaXQgaW50byB1cGRhdGUuXG4gIC8vIFB1dCBhbnkgbnVsbCBub2RlcyBpbnRvIGVudGVyLlxuICAvLyBQdXQgYW55IHJlbWFpbmluZyBkYXRhIGludG8gZW50ZXIuXG4gIGZvciAoOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBQdXQgYW55IG5vbi1udWxsIG5vZGVzIHRoYXQgZG9uXHUyMDE5dCBmaXQgaW50byBleGl0LlxuICBmb3IgKDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBleGl0W2ldID0gbm9kZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYmluZEtleShwYXJlbnQsIGdyb3VwLCBlbnRlciwgdXBkYXRlLCBleGl0LCBkYXRhLCBrZXkpIHtcbiAgdmFyIGksXG4gICAgICBub2RlLFxuICAgICAgbm9kZUJ5S2V5VmFsdWUgPSBuZXcgTWFwLFxuICAgICAgZ3JvdXBMZW5ndGggPSBncm91cC5sZW5ndGgsXG4gICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICBrZXlWYWx1ZXMgPSBuZXcgQXJyYXkoZ3JvdXBMZW5ndGgpLFxuICAgICAga2V5VmFsdWU7XG5cbiAgLy8gQ29tcHV0ZSB0aGUga2V5IGZvciBlYWNoIG5vZGUuXG4gIC8vIElmIG11bHRpcGxlIG5vZGVzIGhhdmUgdGhlIHNhbWUga2V5LCB0aGUgZHVwbGljYXRlcyBhcmUgYWRkZWQgdG8gZXhpdC5cbiAgZm9yIChpID0gMDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBrZXlWYWx1ZXNbaV0gPSBrZXlWYWx1ZSA9IGtleS5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSArIFwiXCI7XG4gICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlKSkge1xuICAgICAgICBleGl0W2ldID0gbm9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGVCeUtleVZhbHVlLnNldChrZXlWYWx1ZSwgbm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29tcHV0ZSB0aGUga2V5IGZvciBlYWNoIGRhdHVtLlxuICAvLyBJZiB0aGVyZSBhIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMga2V5LCBqb2luIGFuZCBhZGQgaXQgdG8gdXBkYXRlLlxuICAvLyBJZiB0aGVyZSBpcyBub3QgKG9yIHRoZSBrZXkgaXMgYSBkdXBsaWNhdGUpLCBhZGQgaXQgdG8gZW50ZXIuXG4gIGZvciAoaSA9IDA7IGkgPCBkYXRhTGVuZ3RoOyArK2kpIHtcbiAgICBrZXlWYWx1ZSA9IGtleS5jYWxsKHBhcmVudCwgZGF0YVtpXSwgaSwgZGF0YSkgKyBcIlwiO1xuICAgIGlmIChub2RlID0gbm9kZUJ5S2V5VmFsdWUuZ2V0KGtleVZhbHVlKSkge1xuICAgICAgdXBkYXRlW2ldID0gbm9kZTtcbiAgICAgIG5vZGUuX19kYXRhX18gPSBkYXRhW2ldO1xuICAgICAgbm9kZUJ5S2V5VmFsdWUuZGVsZXRlKGtleVZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50ZXJbaV0gPSBuZXcgRW50ZXJOb2RlKHBhcmVudCwgZGF0YVtpXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWRkIGFueSByZW1haW5pbmcgbm9kZXMgdGhhdCB3ZXJlIG5vdCBib3VuZCB0byBkYXRhIHRvIGV4aXQuXG4gIGZvciAoaSA9IDA7IGkgPCBncm91cExlbmd0aDsgKytpKSB7XG4gICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIChub2RlQnlLZXlWYWx1ZS5nZXQoa2V5VmFsdWVzW2ldKSA9PT0gbm9kZSkpIHtcbiAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkYXR1bShub2RlKSB7XG4gIHJldHVybiBub2RlLl9fZGF0YV9fO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIEFycmF5LmZyb20odGhpcywgZGF0dW0pO1xuXG4gIHZhciBiaW5kID0ga2V5ID8gYmluZEtleSA6IGJpbmRJbmRleCxcbiAgICAgIHBhcmVudHMgPSB0aGlzLl9wYXJlbnRzLFxuICAgICAgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdmFsdWUgPSBjb25zdGFudCh2YWx1ZSk7XG5cbiAgZm9yICh2YXIgbSA9IGdyb3Vwcy5sZW5ndGgsIHVwZGF0ZSA9IG5ldyBBcnJheShtKSwgZW50ZXIgPSBuZXcgQXJyYXkobSksIGV4aXQgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgdmFyIHBhcmVudCA9IHBhcmVudHNbal0sXG4gICAgICAgIGdyb3VwID0gZ3JvdXBzW2pdLFxuICAgICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgZGF0YSA9IGFycmF5bGlrZSh2YWx1ZS5jYWxsKHBhcmVudCwgcGFyZW50ICYmIHBhcmVudC5fX2RhdGFfXywgaiwgcGFyZW50cykpLFxuICAgICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICAgIGVudGVyR3JvdXAgPSBlbnRlcltqXSA9IG5ldyBBcnJheShkYXRhTGVuZ3RoKSxcbiAgICAgICAgdXBkYXRlR3JvdXAgPSB1cGRhdGVbal0gPSBuZXcgQXJyYXkoZGF0YUxlbmd0aCksXG4gICAgICAgIGV4aXRHcm91cCA9IGV4aXRbal0gPSBuZXcgQXJyYXkoZ3JvdXBMZW5ndGgpO1xuXG4gICAgYmluZChwYXJlbnQsIGdyb3VwLCBlbnRlckdyb3VwLCB1cGRhdGVHcm91cCwgZXhpdEdyb3VwLCBkYXRhLCBrZXkpO1xuXG4gICAgLy8gTm93IGNvbm5lY3QgdGhlIGVudGVyIG5vZGVzIHRvIHRoZWlyIGZvbGxvd2luZyB1cGRhdGUgbm9kZSwgc3VjaCB0aGF0XG4gICAgLy8gYXBwZW5kQ2hpbGQgY2FuIGluc2VydCB0aGUgbWF0ZXJpYWxpemVkIGVudGVyIG5vZGUgYmVmb3JlIHRoaXMgbm9kZSxcbiAgICAvLyByYXRoZXIgdGhhbiBhdCB0aGUgZW5kIG9mIHRoZSBwYXJlbnQgbm9kZS5cbiAgICBmb3IgKHZhciBpMCA9IDAsIGkxID0gMCwgcHJldmlvdXMsIG5leHQ7IGkwIDwgZGF0YUxlbmd0aDsgKytpMCkge1xuICAgICAgaWYgKHByZXZpb3VzID0gZW50ZXJHcm91cFtpMF0pIHtcbiAgICAgICAgaWYgKGkwID49IGkxKSBpMSA9IGkwICsgMTtcbiAgICAgICAgd2hpbGUgKCEobmV4dCA9IHVwZGF0ZUdyb3VwW2kxXSkgJiYgKytpMSA8IGRhdGFMZW5ndGgpO1xuICAgICAgICBwcmV2aW91cy5fbmV4dCA9IG5leHQgfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGUgPSBuZXcgU2VsZWN0aW9uKHVwZGF0ZSwgcGFyZW50cyk7XG4gIHVwZGF0ZS5fZW50ZXIgPSBlbnRlcjtcbiAgdXBkYXRlLl9leGl0ID0gZXhpdDtcbiAgcmV0dXJuIHVwZGF0ZTtcbn1cblxuLy8gR2l2ZW4gc29tZSBkYXRhLCB0aGlzIHJldHVybnMgYW4gYXJyYXktbGlrZSB2aWV3IG9mIGl0OiBhbiBvYmplY3QgdGhhdFxuLy8gZXhwb3NlcyBhIGxlbmd0aCBwcm9wZXJ0eSBhbmQgYWxsb3dzIG51bWVyaWMgaW5kZXhpbmcuIE5vdGUgdGhhdCB1bmxpa2Vcbi8vIHNlbGVjdEFsbCwgdGhpcyBpc25cdTIwMTl0IHdvcnJpZWQgYWJvdXQgXHUyMDFDbGl2ZVx1MjAxRCBjb2xsZWN0aW9ucyBiZWNhdXNlIHRoZSByZXN1bHRpbmdcbi8vIGFycmF5IHdpbGwgb25seSBiZSB1c2VkIGJyaWVmbHkgd2hpbGUgZGF0YSBpcyBiZWluZyBib3VuZC4gKEl0IGlzIHBvc3NpYmxlIHRvXG4vLyBjYXVzZSB0aGUgZGF0YSB0byBjaGFuZ2Ugd2hpbGUgaXRlcmF0aW5nIGJ5IHVzaW5nIGEga2V5IGZ1bmN0aW9uLCBidXQgcGxlYXNlXG4vLyBkb25cdTIwMTl0OyB3ZVx1MjAxOWQgcmF0aGVyIGF2b2lkIGEgZ3JhdHVpdG91cyBjb3B5LilcbmZ1bmN0aW9uIGFycmF5bGlrZShkYXRhKSB7XG4gIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiAmJiBcImxlbmd0aFwiIGluIGRhdGFcbiAgICA/IGRhdGEgLy8gQXJyYXksIFR5cGVkQXJyYXksIE5vZGVMaXN0LCBhcnJheS1saWtlXG4gICAgOiBBcnJheS5mcm9tKGRhdGEpOyAvLyBNYXAsIFNldCwgaXRlcmFibGUsIHN0cmluZywgb3IgYW55dGhpbmcgZWxzZVxufVxuIiwgImltcG9ydCBzcGFyc2UgZnJvbSBcIi4vc3BhcnNlLmpzXCI7XG5pbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHRoaXMuX2V4aXQgfHwgdGhpcy5fZ3JvdXBzLm1hcChzcGFyc2UpLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvbmVudGVyLCBvbnVwZGF0ZSwgb25leGl0KSB7XG4gIHZhciBlbnRlciA9IHRoaXMuZW50ZXIoKSwgdXBkYXRlID0gdGhpcywgZXhpdCA9IHRoaXMuZXhpdCgpO1xuICBpZiAodHlwZW9mIG9uZW50ZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGVudGVyID0gb25lbnRlcihlbnRlcik7XG4gICAgaWYgKGVudGVyKSBlbnRlciA9IGVudGVyLnNlbGVjdGlvbigpO1xuICB9IGVsc2Uge1xuICAgIGVudGVyID0gZW50ZXIuYXBwZW5kKG9uZW50ZXIgKyBcIlwiKTtcbiAgfVxuICBpZiAob251cGRhdGUgIT0gbnVsbCkge1xuICAgIHVwZGF0ZSA9IG9udXBkYXRlKHVwZGF0ZSk7XG4gICAgaWYgKHVwZGF0ZSkgdXBkYXRlID0gdXBkYXRlLnNlbGVjdGlvbigpO1xuICB9XG4gIGlmIChvbmV4aXQgPT0gbnVsbCkgZXhpdC5yZW1vdmUoKTsgZWxzZSBvbmV4aXQoZXhpdCk7XG4gIHJldHVybiBlbnRlciAmJiB1cGRhdGUgPyBlbnRlci5tZXJnZSh1cGRhdGUpLm9yZGVyKCkgOiB1cGRhdGU7XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgdmFyIHNlbGVjdGlvbiA9IGNvbnRleHQuc2VsZWN0aW9uID8gY29udGV4dC5zZWxlY3Rpb24oKSA6IGNvbnRleHQ7XG5cbiAgZm9yICh2YXIgZ3JvdXBzMCA9IHRoaXMuX2dyb3VwcywgZ3JvdXBzMSA9IHNlbGVjdGlvbi5fZ3JvdXBzLCBtMCA9IGdyb3VwczAubGVuZ3RoLCBtMSA9IGdyb3VwczEubGVuZ3RoLCBtID0gTWF0aC5taW4obTAsIG0xKSwgbWVyZ2VzID0gbmV3IEFycmF5KG0wKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cDAgPSBncm91cHMwW2pdLCBncm91cDEgPSBncm91cHMxW2pdLCBuID0gZ3JvdXAwLmxlbmd0aCwgbWVyZ2UgPSBtZXJnZXNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwMFtpXSB8fCBncm91cDFbaV0pIHtcbiAgICAgICAgbWVyZ2VbaV0gPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBqIDwgbTA7ICsraikge1xuICAgIG1lcmdlc1tqXSA9IGdyb3VwczBbal07XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihtZXJnZXMsIHRoaXMuX3BhcmVudHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IC0xLCBtID0gZ3JvdXBzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IGdyb3VwLmxlbmd0aCAtIDEsIG5leHQgPSBncm91cFtpXSwgbm9kZTsgLS1pID49IDA7KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIGlmIChuZXh0ICYmIG5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24obmV4dCkgXiA0KSBuZXh0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG5leHQpO1xuICAgICAgICBuZXh0ID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29tcGFyZSkge1xuICBpZiAoIWNvbXBhcmUpIGNvbXBhcmUgPSBhc2NlbmRpbmc7XG5cbiAgZnVuY3Rpb24gY29tcGFyZU5vZGUoYSwgYikge1xuICAgIHJldHVybiBhICYmIGIgPyBjb21wYXJlKGEuX19kYXRhX18sIGIuX19kYXRhX18pIDogIWEgLSAhYjtcbiAgfVxuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHNvcnRncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHNvcnRncm91cCA9IHNvcnRncm91cHNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHNvcnRncm91cFtpXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICAgIHNvcnRncm91cC5zb3J0KGNvbXBhcmVOb2RlKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHNvcnRncm91cHMsIHRoaXMuX3BhcmVudHMpLm9yZGVyKCk7XG59XG5cbmZ1bmN0aW9uIGFzY2VuZGluZyhhLCBiKSB7XG4gIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzWzBdO1xuICBhcmd1bWVudHNbMF0gPSB0aGlzO1xuICBjYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICByZXR1cm4gdGhpcztcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20odGhpcyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgIHZhciBub2RlID0gZ3JvdXBbaV07XG4gICAgICBpZiAobm9kZSkgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGxldCBzaXplID0gMDtcbiAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMpICsrc2l6ZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICByZXR1cm4gc2l6ZTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLm5vZGUoKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjYWxsYmFjaykge1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBjYWxsYmFjay5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbiIsICJpbXBvcnQgbmFtZXNwYWNlIGZyb20gXCIuLi9uYW1lc3BhY2UuanNcIjtcblxuZnVuY3Rpb24gYXR0clJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0clJlbW92ZU5TKGZ1bGxuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJDb25zdGFudChuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyQ29uc3RhbnROUyhmdWxsbmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsLCB2YWx1ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJGdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJGdW5jdGlvbk5TKGZ1bGxuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsLCB2KTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIGZ1bGxuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgcmV0dXJuIGZ1bGxuYW1lLmxvY2FsXG4gICAgICAgID8gbm9kZS5nZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpXG4gICAgICAgIDogbm9kZS5nZXRBdHRyaWJ1dGUoZnVsbG5hbWUpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbFxuICAgICAgPyAoZnVsbG5hbWUubG9jYWwgPyBhdHRyUmVtb3ZlTlMgOiBhdHRyUmVtb3ZlKSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyAoZnVsbG5hbWUubG9jYWwgPyBhdHRyRnVuY3Rpb25OUyA6IGF0dHJGdW5jdGlvbilcbiAgICAgIDogKGZ1bGxuYW1lLmxvY2FsID8gYXR0ckNvbnN0YW50TlMgOiBhdHRyQ29uc3RhbnQpKSkoZnVsbG5hbWUsIHZhbHVlKSk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obm9kZSkge1xuICByZXR1cm4gKG5vZGUub3duZXJEb2N1bWVudCAmJiBub2RlLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcpIC8vIG5vZGUgaXMgYSBOb2RlXG4gICAgICB8fCAobm9kZS5kb2N1bWVudCAmJiBub2RlKSAvLyBub2RlIGlzIGEgV2luZG93XG4gICAgICB8fCBub2RlLmRlZmF1bHRWaWV3OyAvLyBub2RlIGlzIGEgRG9jdW1lbnRcbn1cbiIsICJpbXBvcnQgZGVmYXVsdFZpZXcgZnJvbSBcIi4uL3dpbmRvdy5qc1wiO1xuXG5mdW5jdGlvbiBzdHlsZVJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUNvbnN0YW50KG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gICAgZWxzZSB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHYsIHByaW9yaXR5KTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMVxuICAgICAgPyB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgICAgICAgID8gc3R5bGVSZW1vdmUgOiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgPyBzdHlsZUZ1bmN0aW9uXG4gICAgICAgICAgICA6IHN0eWxlQ29uc3RhbnQpKG5hbWUsIHZhbHVlLCBwcmlvcml0eSA9PSBudWxsID8gXCJcIiA6IHByaW9yaXR5KSlcbiAgICAgIDogc3R5bGVWYWx1ZSh0aGlzLm5vZGUoKSwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHlsZVZhbHVlKG5vZGUsIG5hbWUpIHtcbiAgcmV0dXJuIG5vZGUuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKVxuICAgICAgfHwgZGVmYXVsdFZpZXcobm9kZSkuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xufVxuIiwgImZ1bmN0aW9uIHByb3BlcnR5UmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUNvbnN0YW50KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5RnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSBkZWxldGUgdGhpc1tuYW1lXTtcbiAgICBlbHNlIHRoaXNbbmFtZV0gPSB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDFcbiAgICAgID8gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyBwcm9wZXJ0eVJlbW92ZSA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyBwcm9wZXJ0eUZ1bmN0aW9uXG4gICAgICAgICAgOiBwcm9wZXJ0eUNvbnN0YW50KShuYW1lLCB2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpW25hbWVdO1xufVxuIiwgImZ1bmN0aW9uIGNsYXNzQXJyYXkoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcudHJpbSgpLnNwbGl0KC9efFxccysvKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NMaXN0KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuY2xhc3NMaXN0IHx8IG5ldyBDbGFzc0xpc3Qobm9kZSk7XG59XG5cbmZ1bmN0aW9uIENsYXNzTGlzdChub2RlKSB7XG4gIHRoaXMuX25vZGUgPSBub2RlO1xuICB0aGlzLl9uYW1lcyA9IGNsYXNzQXJyYXkobm9kZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKTtcbn1cblxuQ2xhc3NMaXN0LnByb3RvdHlwZSA9IHtcbiAgYWRkOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuICAgIGlmIChpIDwgMCkge1xuICAgICAgdGhpcy5fbmFtZXMucHVzaChuYW1lKTtcbiAgICAgIHRoaXMuX25vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy5fbmFtZXMuam9pbihcIiBcIikpO1xuICAgIH1cbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuICAgIGlmIChpID49IDApIHtcbiAgICAgIHRoaXMuX25hbWVzLnNwbGljZShpLCAxKTtcbiAgICAgIHRoaXMuX25vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy5fbmFtZXMuam9pbihcIiBcIikpO1xuICAgIH1cbiAgfSxcbiAgY29udGFpbnM6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKSA+PSAwO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjbGFzc2VkQWRkKG5vZGUsIG5hbWVzKSB7XG4gIHZhciBsaXN0ID0gY2xhc3NMaXN0KG5vZGUpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gIHdoaWxlICgrK2kgPCBuKSBsaXN0LmFkZChuYW1lc1tpXSk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRSZW1vdmUobm9kZSwgbmFtZXMpIHtcbiAgdmFyIGxpc3QgPSBjbGFzc0xpc3Qobm9kZSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIGxpc3QucmVtb3ZlKG5hbWVzW2ldKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZFRydWUobmFtZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNsYXNzZWRBZGQodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkRmFsc2UobmFtZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNsYXNzZWRSZW1vdmUodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkRnVuY3Rpb24obmFtZXMsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAodmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKSA/IGNsYXNzZWRBZGQgOiBjbGFzc2VkUmVtb3ZlKSh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBuYW1lcyA9IGNsYXNzQXJyYXkobmFtZSArIFwiXCIpO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBsaXN0ID0gY2xhc3NMaXN0KHRoaXMubm9kZSgpKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWxpc3QuY29udGFpbnMobmFtZXNbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBjbGFzc2VkRnVuY3Rpb24gOiB2YWx1ZVxuICAgICAgPyBjbGFzc2VkVHJ1ZVxuICAgICAgOiBjbGFzc2VkRmFsc2UpKG5hbWVzLCB2YWx1ZSkpO1xufVxuIiwgImZ1bmN0aW9uIHRleHRSZW1vdmUoKSB7XG4gIHRoaXMudGV4dENvbnRlbnQgPSBcIlwiO1xufVxuXG5mdW5jdGlvbiB0ZXh0Q29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdGV4dEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy50ZXh0Q29udGVudCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godmFsdWUgPT0gbnVsbFxuICAgICAgICAgID8gdGV4dFJlbW92ZSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gdGV4dEZ1bmN0aW9uXG4gICAgICAgICAgOiB0ZXh0Q29uc3RhbnQpKHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKCkudGV4dENvbnRlbnQ7XG59XG4iLCAiZnVuY3Rpb24gaHRtbFJlbW92ZSgpIHtcbiAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xufVxuXG5mdW5jdGlvbiBodG1sQ29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWxGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdiA9PSBudWxsID8gXCJcIiA6IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyBodG1sUmVtb3ZlIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyBodG1sRnVuY3Rpb25cbiAgICAgICAgICA6IGh0bWxDb25zdGFudCkodmFsdWUpKVxuICAgICAgOiB0aGlzLm5vZGUoKS5pbm5lckhUTUw7XG59XG4iLCAiZnVuY3Rpb24gcmFpc2UoKSB7XG4gIGlmICh0aGlzLm5leHRTaWJsaW5nKSB0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGhpcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKHJhaXNlKTtcbn1cbiIsICJmdW5jdGlvbiBsb3dlcigpIHtcbiAgaWYgKHRoaXMucHJldmlvdXNTaWJsaW5nKSB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMsIHRoaXMucGFyZW50Tm9kZS5maXJzdENoaWxkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gobG93ZXIpO1xufVxuIiwgImltcG9ydCBjcmVhdG9yIGZyb20gXCIuLi9jcmVhdG9yLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGNyZWF0ZSA9IHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lIDogY3JlYXRvcihuYW1lKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmFwcGVuZENoaWxkKGNyZWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfSk7XG59XG4iLCAiaW1wb3J0IGNyZWF0b3IgZnJvbSBcIi4uL2NyZWF0b3IuanNcIjtcbmltcG9ydCBzZWxlY3RvciBmcm9tIFwiLi4vc2VsZWN0b3IuanNcIjtcblxuZnVuY3Rpb24gY29uc3RhbnROdWxsKCkge1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgYmVmb3JlKSB7XG4gIHZhciBjcmVhdGUgPSB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZSA6IGNyZWF0b3IobmFtZSksXG4gICAgICBzZWxlY3QgPSBiZWZvcmUgPT0gbnVsbCA/IGNvbnN0YW50TnVsbCA6IHR5cGVvZiBiZWZvcmUgPT09IFwiZnVuY3Rpb25cIiA/IGJlZm9yZSA6IHNlbGVjdG9yKGJlZm9yZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUoY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHNlbGVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IG51bGwpO1xuICB9KTtcbn1cbiIsICJmdW5jdGlvbiByZW1vdmUoKSB7XG4gIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gIGlmIChwYXJlbnQpIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gocmVtb3ZlKTtcbn1cbiIsICJmdW5jdGlvbiBzZWxlY3Rpb25fY2xvbmVTaGFsbG93KCkge1xuICB2YXIgY2xvbmUgPSB0aGlzLmNsb25lTm9kZShmYWxzZSksIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5pbnNlcnRCZWZvcmUoY2xvbmUsIHRoaXMubmV4dFNpYmxpbmcpIDogY2xvbmU7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9jbG9uZURlZXAoKSB7XG4gIHZhciBjbG9uZSA9IHRoaXMuY2xvbmVOb2RlKHRydWUpLCBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNsb25lLCB0aGlzLm5leHRTaWJsaW5nKSA6IGNsb25lO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihkZWVwKSB7XG4gIHJldHVybiB0aGlzLnNlbGVjdChkZWVwID8gc2VsZWN0aW9uX2Nsb25lRGVlcCA6IHNlbGVjdGlvbl9jbG9uZVNoYWxsb3cpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiLCB2YWx1ZSlcbiAgICAgIDogdGhpcy5ub2RlKCkuX19kYXRhX187XG59XG4iLCAiZnVuY3Rpb24gY29udGV4dExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZXZlbnQsIHRoaXMuX19kYXRhX18pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZXMpIHtcbiAgcmV0dXJuIHR5cGVuYW1lcy50cmltKCkuc3BsaXQoL158XFxzKy8pLm1hcChmdW5jdGlvbih0KSB7XG4gICAgdmFyIG5hbWUgPSBcIlwiLCBpID0gdC5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAoaSA+PSAwKSBuYW1lID0gdC5zbGljZShpICsgMSksIHQgPSB0LnNsaWNlKDAsIGkpO1xuICAgIHJldHVybiB7dHlwZTogdCwgbmFtZTogbmFtZX07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBvblJlbW92ZSh0eXBlbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9uID0gdGhpcy5fX29uO1xuICAgIGlmICghb24pIHJldHVybjtcbiAgICBmb3IgKHZhciBqID0gMCwgaSA9IC0xLCBtID0gb24ubGVuZ3RoLCBvOyBqIDwgbTsgKytqKSB7XG4gICAgICBpZiAobyA9IG9uW2pdLCAoIXR5cGVuYW1lLnR5cGUgfHwgby50eXBlID09PSB0eXBlbmFtZS50eXBlKSAmJiBvLm5hbWUgPT09IHR5cGVuYW1lLm5hbWUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciwgby5vcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uWysraV0gPSBvO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKytpKSBvbi5sZW5ndGggPSBpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX19vbjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25BZGQodHlwZW5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb24gPSB0aGlzLl9fb24sIG8sIGxpc3RlbmVyID0gY29udGV4dExpc3RlbmVyKHZhbHVlKTtcbiAgICBpZiAob24pIGZvciAodmFyIGogPSAwLCBtID0gb24ubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgICBpZiAoKG8gPSBvbltqXSkudHlwZSA9PT0gdHlwZW5hbWUudHlwZSAmJiBvLm5hbWUgPT09IHR5cGVuYW1lLm5hbWUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciwgby5vcHRpb25zKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciA9IGxpc3RlbmVyLCBvLm9wdGlvbnMgPSBvcHRpb25zKTtcbiAgICAgICAgby52YWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0eXBlbmFtZS50eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG4gICAgbyA9IHt0eXBlOiB0eXBlbmFtZS50eXBlLCBuYW1lOiB0eXBlbmFtZS5uYW1lLCB2YWx1ZTogdmFsdWUsIGxpc3RlbmVyOiBsaXN0ZW5lciwgb3B0aW9uczogb3B0aW9uc307XG4gICAgaWYgKCFvbikgdGhpcy5fX29uID0gW29dO1xuICAgIGVsc2Ugb24ucHVzaChvKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odHlwZW5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHZhciB0eXBlbmFtZXMgPSBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZSArIFwiXCIpLCBpLCBuID0gdHlwZW5hbWVzLmxlbmd0aCwgdDtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgb24gPSB0aGlzLm5vZGUoKS5fX29uO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGgsIG87IGogPCBtOyArK2opIHtcbiAgICAgIGZvciAoaSA9IDAsIG8gPSBvbltqXTsgaSA8IG47ICsraSkge1xuICAgICAgICBpZiAoKHQgPSB0eXBlbmFtZXNbaV0pLnR5cGUgPT09IG8udHlwZSAmJiB0Lm5hbWUgPT09IG8ubmFtZSkge1xuICAgICAgICAgIHJldHVybiBvLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIG9uID0gdmFsdWUgPyBvbkFkZCA6IG9uUmVtb3ZlO1xuICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB0aGlzLmVhY2gob24odHlwZW5hbWVzW2ldLCB2YWx1ZSwgb3B0aW9ucykpO1xuICByZXR1cm4gdGhpcztcbn1cbiIsICJpbXBvcnQgZGVmYXVsdFZpZXcgZnJvbSBcIi4uL3dpbmRvdy5qc1wiO1xuXG5mdW5jdGlvbiBkaXNwYXRjaEV2ZW50KG5vZGUsIHR5cGUsIHBhcmFtcykge1xuICB2YXIgd2luZG93ID0gZGVmYXVsdFZpZXcobm9kZSksXG4gICAgICBldmVudCA9IHdpbmRvdy5DdXN0b21FdmVudDtcblxuICBpZiAodHlwZW9mIGV2ZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBldmVudCA9IG5ldyBldmVudCh0eXBlLCBwYXJhbXMpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50ID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiRXZlbnRcIik7XG4gICAgaWYgKHBhcmFtcykgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSksIGV2ZW50LmRldGFpbCA9IHBhcmFtcy5kZXRhaWw7XG4gICAgZWxzZSBldmVudC5pbml0RXZlbnQodHlwZSwgZmFsc2UsIGZhbHNlKTtcbiAgfVxuXG4gIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoQ29uc3RhbnQodHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2hFdmVudCh0aGlzLCB0eXBlLCBwYXJhbXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaEZ1bmN0aW9uKHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoRXZlbnQodGhpcywgdHlwZSwgcGFyYW1zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaCgodHlwZW9mIHBhcmFtcyA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGRpc3BhdGNoRnVuY3Rpb25cbiAgICAgIDogZGlzcGF0Y2hDb25zdGFudCkodHlwZSwgcGFyYW1zKSk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24qKCkge1xuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZTsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgeWllbGQgbm9kZTtcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgc2VsZWN0aW9uX3NlbGVjdCBmcm9tIFwiLi9zZWxlY3QuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2VsZWN0QWxsIGZyb20gXCIuL3NlbGVjdEFsbC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3RDaGlsZCBmcm9tIFwiLi9zZWxlY3RDaGlsZC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3RDaGlsZHJlbiBmcm9tIFwiLi9zZWxlY3RDaGlsZHJlbi5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9maWx0ZXIgZnJvbSBcIi4vZmlsdGVyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2RhdGEgZnJvbSBcIi4vZGF0YS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9lbnRlciBmcm9tIFwiLi9lbnRlci5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9leGl0IGZyb20gXCIuL2V4aXQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fam9pbiBmcm9tIFwiLi9qb2luLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX21lcmdlIGZyb20gXCIuL21lcmdlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX29yZGVyIGZyb20gXCIuL29yZGVyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NvcnQgZnJvbSBcIi4vc29ydC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9jYWxsIGZyb20gXCIuL2NhbGwuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbm9kZXMgZnJvbSBcIi4vbm9kZXMuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbm9kZSBmcm9tIFwiLi9ub2RlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NpemUgZnJvbSBcIi4vc2l6ZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9lbXB0eSBmcm9tIFwiLi9lbXB0eS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9lYWNoIGZyb20gXCIuL2VhY2guanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fYXR0ciBmcm9tIFwiLi9hdHRyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3N0eWxlIGZyb20gXCIuL3N0eWxlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3Byb3BlcnR5IGZyb20gXCIuL3Byb3BlcnR5LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2NsYXNzZWQgZnJvbSBcIi4vY2xhc3NlZC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl90ZXh0IGZyb20gXCIuL3RleHQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25faHRtbCBmcm9tIFwiLi9odG1sLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3JhaXNlIGZyb20gXCIuL3JhaXNlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2xvd2VyIGZyb20gXCIuL2xvd2VyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2FwcGVuZCBmcm9tIFwiLi9hcHBlbmQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25faW5zZXJ0IGZyb20gXCIuL2luc2VydC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9yZW1vdmUgZnJvbSBcIi4vcmVtb3ZlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2Nsb25lIGZyb20gXCIuL2Nsb25lLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2RhdHVtIGZyb20gXCIuL2RhdHVtLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX29uIGZyb20gXCIuL29uLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2Rpc3BhdGNoIGZyb20gXCIuL2Rpc3BhdGNoLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2l0ZXJhdG9yIGZyb20gXCIuL2l0ZXJhdG9yLmpzXCI7XG5cbmV4cG9ydCB2YXIgcm9vdCA9IFtudWxsXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFNlbGVjdGlvbihncm91cHMsIHBhcmVudHMpIHtcbiAgdGhpcy5fZ3JvdXBzID0gZ3JvdXBzO1xuICB0aGlzLl9wYXJlbnRzID0gcGFyZW50cztcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbihbW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudF1dLCByb290KTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX3NlbGVjdGlvbigpIHtcbiAgcmV0dXJuIHRoaXM7XG59XG5cblNlbGVjdGlvbi5wcm90b3R5cGUgPSBzZWxlY3Rpb24ucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogU2VsZWN0aW9uLFxuICBzZWxlY3Q6IHNlbGVjdGlvbl9zZWxlY3QsXG4gIHNlbGVjdEFsbDogc2VsZWN0aW9uX3NlbGVjdEFsbCxcbiAgc2VsZWN0Q2hpbGQ6IHNlbGVjdGlvbl9zZWxlY3RDaGlsZCxcbiAgc2VsZWN0Q2hpbGRyZW46IHNlbGVjdGlvbl9zZWxlY3RDaGlsZHJlbixcbiAgZmlsdGVyOiBzZWxlY3Rpb25fZmlsdGVyLFxuICBkYXRhOiBzZWxlY3Rpb25fZGF0YSxcbiAgZW50ZXI6IHNlbGVjdGlvbl9lbnRlcixcbiAgZXhpdDogc2VsZWN0aW9uX2V4aXQsXG4gIGpvaW46IHNlbGVjdGlvbl9qb2luLFxuICBtZXJnZTogc2VsZWN0aW9uX21lcmdlLFxuICBzZWxlY3Rpb246IHNlbGVjdGlvbl9zZWxlY3Rpb24sXG4gIG9yZGVyOiBzZWxlY3Rpb25fb3JkZXIsXG4gIHNvcnQ6IHNlbGVjdGlvbl9zb3J0LFxuICBjYWxsOiBzZWxlY3Rpb25fY2FsbCxcbiAgbm9kZXM6IHNlbGVjdGlvbl9ub2RlcyxcbiAgbm9kZTogc2VsZWN0aW9uX25vZGUsXG4gIHNpemU6IHNlbGVjdGlvbl9zaXplLFxuICBlbXB0eTogc2VsZWN0aW9uX2VtcHR5LFxuICBlYWNoOiBzZWxlY3Rpb25fZWFjaCxcbiAgYXR0cjogc2VsZWN0aW9uX2F0dHIsXG4gIHN0eWxlOiBzZWxlY3Rpb25fc3R5bGUsXG4gIHByb3BlcnR5OiBzZWxlY3Rpb25fcHJvcGVydHksXG4gIGNsYXNzZWQ6IHNlbGVjdGlvbl9jbGFzc2VkLFxuICB0ZXh0OiBzZWxlY3Rpb25fdGV4dCxcbiAgaHRtbDogc2VsZWN0aW9uX2h0bWwsXG4gIHJhaXNlOiBzZWxlY3Rpb25fcmFpc2UsXG4gIGxvd2VyOiBzZWxlY3Rpb25fbG93ZXIsXG4gIGFwcGVuZDogc2VsZWN0aW9uX2FwcGVuZCxcbiAgaW5zZXJ0OiBzZWxlY3Rpb25faW5zZXJ0LFxuICByZW1vdmU6IHNlbGVjdGlvbl9yZW1vdmUsXG4gIGNsb25lOiBzZWxlY3Rpb25fY2xvbmUsXG4gIGRhdHVtOiBzZWxlY3Rpb25fZGF0dW0sXG4gIG9uOiBzZWxlY3Rpb25fb24sXG4gIGRpc3BhdGNoOiBzZWxlY3Rpb25fZGlzcGF0Y2gsXG4gIFtTeW1ib2wuaXRlcmF0b3JdOiBzZWxlY3Rpb25faXRlcmF0b3Jcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlbGVjdGlvbjtcbiIsICJpbXBvcnQge1NlbGVjdGlvbiwgcm9vdH0gZnJvbSBcIi4vc2VsZWN0aW9uL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCJcbiAgICAgID8gbmV3IFNlbGVjdGlvbihbW2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXV0sIFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRdKVxuICAgICAgOiBuZXcgU2VsZWN0aW9uKFtbc2VsZWN0b3JdXSwgcm9vdCk7XG59XG4iLCAiaW1wb3J0IHsgc2NhbGVPcmRpbmFsIH0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgc2NoZW1lVGFibGVhdTEwIH0gZnJvbSAnZDMtc2NhbGUtY2hyb21hdGljJztcbmltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgdHlwZSB7IFJlbmRlclNldHRpbmdzLCBSb3RhdGlvblByZXNldCwgV29yZENsb3VkUmVuZGVyT3B0aW9ucywgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5mdW5jdGlvbiBidWlsZERldGVybWluaXN0aWNSYW5kb20oc2VlZDogbnVtYmVyKTogKCkgPT4gbnVtYmVyIHtcbiAgbGV0IHN0YXRlID0gc2VlZCA+Pj4gMDtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBzdGF0ZSA9IChzdGF0ZSArIDB4NkQyQjc5RjUpIHwgMDtcbiAgICBsZXQgdCA9IE1hdGguaW11bChzdGF0ZSBeIChzdGF0ZSA+Pj4gMTUpLCAxIHwgc3RhdGUpO1xuICAgIHQgPSAodCArIE1hdGguaW11bCh0IF4gKHQgPj4+IDcpLCA2MSB8IHQpKSBeIHQ7XG4gICAgcmV0dXJuICgodCBeICh0ID4+PiAxNCkpID4+PiAwKSAvIDQyOTQ5NjcyOTY7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHBpY2tSb3RhdGlvbihyYW5kb206ICgpID0+IG51bWJlciwgcHJlc2V0OiBSb3RhdGlvblByZXNldCk6IG51bWJlciB7XG4gIGlmIChwcmVzZXQgPT09ICdob3Jpem9udGFsJykge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKHByZXNldCA9PT0gJ21vc3RseS1ob3Jpem9udGFsJykge1xuICAgIHJldHVybiByYW5kb20oKSA+IDAuODUgPyA5MCA6IDA7XG4gIH1cblxuICBpZiAocHJlc2V0ID09PSAndmVydGljYWwnKSB7XG4gICAgcmV0dXJuIHJhbmRvbSgpID4gMC4yID8gOTAgOiAwO1xuICB9XG5cbiAgY29uc3QgYW5nbGVzID0gWy05MCwgLTQ1LCAwLCA0NSwgOTBdO1xuICByZXR1cm4gYW5nbGVzW01hdGguZmxvb3IocmFuZG9tKCkgKiBhbmdsZXMubGVuZ3RoKV07XG59XG5cbmZ1bmN0aW9uIGdldFdvcmRMYWJlbCh3b3JkOiBXZWlnaHRlZFdvcmQsIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyk6IHN0cmluZyB7XG4gIGlmICghcmVuZGVyU2V0dGluZ3Muc2hvd0NvdW50SW5Xb3JkVGV4dCB8fCB3b3JkLmNvdW50IDwgcmVuZGVyU2V0dGluZ3MuY291bnRMYWJlbE1pbkNvdW50KSB7XG4gICAgcmV0dXJuIHdvcmQudGV4dDtcbiAgfVxuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5jb3VudExhYmVsRm9ybWF0ID09PSAnZG90Jykge1xuICAgIHJldHVybiBgJHt3b3JkLnRleHR9IFx1MDBCNyAke3dvcmQuY291bnR9YDtcbiAgfVxuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5jb3VudExhYmVsRm9ybWF0ID09PSAnY29sb24nKSB7XG4gICAgcmV0dXJuIGAke3dvcmQudGV4dH06ICR7d29yZC5jb3VudH1gO1xuICB9XG5cbiAgcmV0dXJuIGAke3dvcmQudGV4dH0gKCR7d29yZC5jb3VudH0pYDtcbn1cblxudHlwZSBMYXlvdXRXb3JkID0gV2VpZ2h0ZWRXb3JkICYge1xuICBiYXNlVGV4dDogc3RyaW5nO1xuICBsYXlvdXRUZXh0OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZHJhd1dvcmRDbG91ZChvcHRpb25zOiBXb3JkQ2xvdWRSZW5kZXJPcHRpb25zLCByZW5kZXJTZXR0aW5nczogUmVuZGVyU2V0dGluZ3MpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgeyBjb250YWluZXJFbCwgd29yZHMsIGFyaWFMYWJlbCwgb25Xb3JkQ2xpY2ssIG9uUHJvZ3Jlc3MgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGV4cG9ydEJhc2VOYW1lID0gc2FuaXRpemVGaWxlTmFtZShvcHRpb25zLmV4cG9ydEJhc2VOYW1lID8/ICd3b3JkLWNsb3VkJyk7XG4gIGNvbnN0IGVuYWJsZUV4cG9ydCA9IG9wdGlvbnMuZW5hYmxlRXhwb3J0ID8/IHRydWU7XG4gIGNvbnN0IHdpZHRoID0gTWF0aC5tYXgoMzIwLCBjb250YWluZXJFbC5jbGllbnRXaWR0aCB8fCA3MDApO1xuICBjb25zdCBoZWlnaHQgPSBNYXRoLm1heCgzMjAsIGNvbnRhaW5lckVsLmNsaWVudEhlaWdodCB8fCA1MDApO1xuICBjb25zdCByYW5kb20gPSByZW5kZXJTZXR0aW5ncy5kZXRlcm1pbmlzdGljTGF5b3V0ID8gYnVpbGREZXRlcm1pbmlzdGljUmFuZG9tKHJlbmRlclNldHRpbmdzLnJhbmRvbVNlZWQpIDogTWF0aC5yYW5kb207XG4gIGNvbnN0IGxheW91dFdvcmRzOiBMYXlvdXRXb3JkW10gPSB3b3Jkcy5tYXAoKHdvcmQpID0+ICh7XG4gICAgLi4ud29yZCxcbiAgICBiYXNlVGV4dDogd29yZC50ZXh0LFxuICAgIGxheW91dFRleHQ6IGdldFdvcmRMYWJlbCh3b3JkLCByZW5kZXJTZXR0aW5ncyksXG4gIH0pKTtcblxuICBjb250YWluZXJFbC5jbGFzc0xpc3QuYWRkKCd3b3JkLWNsb3VkLXJlbmRlci1jb250YWluZXInKTtcblxuICBjb25zdCBzdmcgPSBzZWxlY3QoY29udGFpbmVyRWwpXG4gICAgLmFwcGVuZCgnc3ZnJylcbiAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgIC5hdHRyKCdyb2xlJywgJ2ltZycpXG4gICAgLmF0dHIoJ2FyaWEtbGFiZWwnLCBhcmlhTGFiZWwpO1xuXG4gIGNvbnN0IGcgPSBzdmcuYXBwZW5kKCdnJykuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3dpZHRoIC8gMn0sJHtoZWlnaHQgLyAyfSlgKTtcblxuICBjb25zdCBjb2xvciA9IHNjYWxlT3JkaW5hbDxzdHJpbmcsIHN0cmluZz4oc2NoZW1lVGFibGVhdTEwKTtcbiAgY29uc3QgeyBkZWZhdWx0OiBjbG91ZCB9ID0gYXdhaXQgaW1wb3J0KCdkMy1jbG91ZCcpO1xuICBjb25zdCBwZXJmb3JtYW5jZSA9IGdldExheW91dFBlcmZvcm1hbmNlUHJvZmlsZShyZW5kZXJTZXR0aW5ncy5wcm9ncmVzc0RldGFpbCk7XG4gIGNvbnN0IHJlcG9ydFByb2dyZXNzID0gY3JlYXRlVGhyb3R0bGVkUHJvZ3Jlc3Mob25Qcm9ncmVzcywgcGVyZm9ybWFuY2UucHJvZ3Jlc3NUaHJvdHRsZU1zKTtcbiAgY29uc3QgbGF5b3V0VGltZUludGVydmFsID0gcmVuZGVyU2V0dGluZ3MucHJvZ3Jlc3NEZXRhaWwgPT09ICd1bmhpbmdlZCdcbiAgICA/IEluZmluaXR5XG4gICAgOiBNYXRoLm1heCg4LCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLmxheW91dFRpbWVJbnRlcnZhbE1zKSk7XG5cbiAgYXdhaXQgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICBsZXQgbGFpZE91dFdvcmRzID0gMDtcbiAgICBjb25zdCB0b3RhbFdvcmRzID0gTWF0aC5tYXgoMSwgbGF5b3V0V29yZHMubGVuZ3RoKTtcblxuICAgIGNsb3VkPExheW91dFdvcmQ+KClcbiAgICAgIC5zaXplKFt3aWR0aCwgaGVpZ2h0XSlcbiAgICAgIC53b3JkcyhsYXlvdXRXb3JkcylcbiAgICAgIC50ZXh0KChkKSA9PiBkLmxheW91dFRleHQpXG4gICAgICAudGltZUludGVydmFsKGxheW91dFRpbWVJbnRlcnZhbClcbiAgICAgIC5wYWRkaW5nKE1hdGgubWF4KDAsIE1hdGgucm91bmQocmVuZGVyU2V0dGluZ3Mud29yZFBhZGRpbmcpKSlcbiAgICAgIC5zcGlyYWwocmVuZGVyU2V0dGluZ3Muc3BpcmFsKVxuICAgICAgLnJvdGF0ZSgoKSA9PiBwaWNrUm90YXRpb24ocmFuZG9tLCByZW5kZXJTZXR0aW5ncy5yb3RhdGlvblByZXNldCkpXG4gICAgICAuZm9udChyZW5kZXJTZXR0aW5ncy5mb250RmFtaWx5IHx8ICdzYW5zLXNlcmlmJylcbiAgICAgIC5mb250U2l6ZSgoZCkgPT4gZC5zaXplKVxuICAgICAgLnJhbmRvbShyYW5kb20pXG4gICAgICAub24oJ3dvcmQnLCAoKSA9PiB7XG4gICAgICAgIGxhaWRPdXRXb3JkcyArPSAxO1xuICAgICAgICBpZiAobGFpZE91dFdvcmRzICUgcGVyZm9ybWFuY2Uud29yZFByb2dyZXNzU3RyaWRlID09PSAwKSB7XG4gICAgICAgICAgY29uc3QgbGF5b3V0UGVyY2VudCA9IE1hdGgubWluKDk5LCBNYXRoLnJvdW5kKChsYWlkT3V0V29yZHMgLyB0b3RhbFdvcmRzKSAqIDEwMCkpO1xuICAgICAgICAgIHJlcG9ydFByb2dyZXNzKGBMYXlpbmcgb3V0IHdvcmRzLi4uICR7bGFpZE91dFdvcmRzfS8ke2xheW91dFdvcmRzLmxlbmd0aH1gLCBsYXlvdXRQZXJjZW50KTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5vbignZW5kJywgKGxheW91dFdvcmRzKSA9PiB7XG4gICAgICAgIGcuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgICAuZGF0YShsYXlvdXRXb3JkcylcbiAgICAgICAgICAuZW50ZXIoKVxuICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgKGQpID0+IGAke2Quc2l6ZX1weGApXG4gICAgICAgICAgLnN0eWxlKCdmb250LWZhbWlseScsIHJlbmRlclNldHRpbmdzLmZvbnRGYW1pbHkgfHwgJ3NhbnMtc2VyaWYnKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChfLCBpKSA9PiBjb2xvcihTdHJpbmcoaSkpKVxuICAgICAgICAgIC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuICAgICAgICAgIC5hdHRyKCd0YWJpbmRleCcsIDApXG4gICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSA9PiBgdHJhbnNsYXRlKCR7ZC54fSwke2QueX0pIHJvdGF0ZSgke2Qucm90YXRlfSlgKVxuICAgICAgICAgIC50ZXh0KChkKSA9PiBkLmxheW91dFRleHQpXG4gICAgICAgICAgLm9uKCdjbGljaycsIChfLCBkKSA9PiB7XG4gICAgICAgICAgICBvbldvcmRDbGljayhkLmJhc2VUZXh0KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vbigna2V5ZG93bicsIChldmVudDogS2V5Ym9hcmRFdmVudCwgZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJyB8fCBldmVudC5rZXkgPT09ICcgJykge1xuICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICBvbldvcmRDbGljayhkLmJhc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5hcHBlbmQoJ3RpdGxlJylcbiAgICAgICAgICAudGV4dCgoZCkgPT4gYCR7ZC5iYXNlVGV4dH06ICR7ZC5jb3VudH0gJHtkLmNvdW50ID09PSAxID8gJ29jY3VycmVuY2UnIDogJ29jY3VycmVuY2VzJ31gKTtcblxuICAgICAgICByZXBvcnRQcm9ncmVzcygnUmVuZGVyaW5nIGNvbXBsZXRlLicsIDEwMCk7XG4gICAgICAgIGlmIChlbmFibGVFeHBvcnQpIHtcbiAgICAgICAgICByZW5kZXJFeHBvcnRDb250cm9scyhjb250YWluZXJFbCwgc3ZnLm5vZGUoKSwgZXhwb3J0QmFzZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSlcbiAgICAgIC5zdGFydCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyRXhwb3J0Q29udHJvbHMoY29udGFpbmVyRWw6IEhUTUxEaXZFbGVtZW50LCBzdmdFbDogU1ZHU1ZHRWxlbWVudCB8IG51bGwsIGV4cG9ydEJhc2VOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgaWYgKCFzdmdFbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNvbnRyb2xzRWwgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWV4cG9ydC1jb250cm9scycgfSk7XG4gIGNvbnN0IG1lbnVCdXR0b24gPSBjb250cm9sc0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgY2xzOiAnd29yZC1jbG91ZC1tZW51LWJ1dHRvbicsXG4gICAgdGV4dDogJ1x1MjJFRicsXG4gIH0pO1xuICBtZW51QnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnV29yZCBjbG91ZCBvcHRpb25zJyk7XG5cbiAgY29uc3QgbWVudUVsID0gY29udHJvbHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLW1lbnUnIH0pO1xuICBtZW51RWwuc2V0QXR0cignaGlkZGVuJywgJ3RydWUnKTtcbiAgbGV0IHJlbW92ZU91dHNpZGVMaXN0ZW5lcjogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3QgdG9nZ2xlTWVudSA9IChvcGVuOiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgaWYgKG9wZW4pIHtcbiAgICAgIG1lbnVFbC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgY29uc3Qgb25PdXRzaWRlQ2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSkge1xuICAgICAgICAgIHRvZ2dsZU1lbnUoZmFsc2UpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNvbnRyb2xzRWwuY29udGFpbnModGFyZ2V0KSkge1xuICAgICAgICAgIHRvZ2dsZU1lbnUoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25PdXRzaWRlQ2xpY2ssIHRydWUpO1xuICAgICAgcmVtb3ZlT3V0c2lkZUxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk91dHNpZGVDbGljaywgdHJ1ZSk7XG4gICAgICAgIHJlbW92ZU91dHNpZGVMaXN0ZW5lciA9IG51bGw7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBtZW51RWwuc2V0QXR0cignaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIGlmIChyZW1vdmVPdXRzaWRlTGlzdGVuZXIpIHtcbiAgICAgICAgcmVtb3ZlT3V0c2lkZUxpc3RlbmVyKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG1ha2VNZW51SXRlbSA9IChsYWJlbDogc3RyaW5nLCBmb3JtYXQ6ICdzdmcnIHwgJ3BuZycgfCAnanBlZycpID0+IHtcbiAgICBjb25zdCBidXR0b24gPSBtZW51RWwuY3JlYXRlRWwoJ2J1dHRvbicsIHsgY2xzOiAnd29yZC1jbG91ZC1tZW51LWl0ZW0nLCB0ZXh0OiBgRXhwb3J0ICR7bGFiZWx9YCB9KTtcbiAgICBidXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsIGBFeHBvcnQgYXMgJHtsYWJlbH1gKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGV4cG9ydFN2ZyhzdmdFbCwgZm9ybWF0LCBleHBvcnRCYXNlTmFtZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdXb3JkIGNsb3VkczogZXhwb3J0IGZhaWxlZCcsIGVycm9yKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRvZ2dsZU1lbnUoZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIG1ha2VNZW51SXRlbSgnU1ZHJywgJ3N2ZycpO1xuICBtYWtlTWVudUl0ZW0oJ1BORycsICdwbmcnKTtcbiAgbWFrZU1lbnVJdGVtKCdKUEVHJywgJ2pwZWcnKTtcblxuICBtZW51QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0b2dnbGVNZW51KG1lbnVFbC5oYXNBdHRyaWJ1dGUoJ2hpZGRlbicpKTtcbiAgfSk7XG5cbiAgbWVudUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIHRvZ2dsZU1lbnUoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgbWVudUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRvZ2dsZU1lbnUoZmFsc2UpO1xuICAgICAgbWVudUJ1dHRvbi5mb2N1cygpO1xuICAgIH1cbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGV4cG9ydFN2ZyhzdmdFbDogU1ZHU1ZHRWxlbWVudCwgZm9ybWF0OiAnc3ZnJyB8ICdwbmcnIHwgJ2pwZWcnLCBiYXNlTmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHN2Z1RleHQgPSBuZXcgWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHN2Z0VsKTtcbiAgY29uc3Qgc3ZnQmxvYiA9IG5ldyBCbG9iKFtzdmdUZXh0XSwgeyB0eXBlOiAnaW1hZ2Uvc3ZnK3htbDtjaGFyc2V0PXV0Zi04JyB9KTtcblxuICBpZiAoZm9ybWF0ID09PSAnc3ZnJykge1xuICAgIHRyaWdnZXJCbG9iRG93bmxvYWQoc3ZnQmxvYiwgYCR7YmFzZU5hbWV9LnN2Z2ApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHdpZHRoID0gTnVtYmVyKHN2Z0VsLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSA/PyBzdmdFbC52aWV3Qm94LmJhc2VWYWwud2lkdGggPz8gODAwKTtcbiAgY29uc3QgaGVpZ2h0ID0gTnVtYmVyKHN2Z0VsLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JykgPz8gc3ZnRWwudmlld0JveC5iYXNlVmFsLmhlaWdodCA/PyA2MDApO1xuICBjb25zdCBiaXRtYXBCbG9iID0gYXdhaXQgcmFzdGVyaXplU3ZnKHN2Z0Jsb2IsIHdpZHRoLCBoZWlnaHQsIGZvcm1hdCk7XG4gIHRyaWdnZXJCbG9iRG93bmxvYWQoYml0bWFwQmxvYiwgYCR7YmFzZU5hbWV9LiR7Zm9ybWF0ID09PSAncG5nJyA/ICdwbmcnIDogJ2pwZyd9YCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJhc3Rlcml6ZVN2ZyhcbiAgc3ZnQmxvYjogQmxvYixcbiAgd2lkdGg6IG51bWJlcixcbiAgaGVpZ2h0OiBudW1iZXIsXG4gIGZvcm1hdDogJ3BuZycgfCAnanBlZycsXG4pOiBQcm9taXNlPEJsb2I+IHtcbiAgY29uc3Qgc3ZnVXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChzdmdCbG9iKTtcbiAgY29uc3QgaW1hZ2UgPSBhd2FpdCBsb2FkSW1hZ2Uoc3ZnVXJsKTtcbiAgVVJMLnJldm9rZU9iamVjdFVSTChzdmdVcmwpO1xuXG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBjYW52YXMud2lkdGggPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHdpZHRoKSk7XG4gIGNhbnZhcy5oZWlnaHQgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGhlaWdodCkpO1xuICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2FudmFzIDJEIGNvbnRleHQgdW5hdmFpbGFibGUnKTtcbiAgfVxuXG4gIGlmIChmb3JtYXQgPT09ICdqcGVnJykge1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyNmZmZmZmYnO1xuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgfVxuXG4gIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG4gIHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZTxCbG9iPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY2FudmFzLnRvQmxvYigoYmxvYikgPT4ge1xuICAgICAgaWYgKCFibG9iKSB7XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgYml0bWFwIGJsb2InKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoYmxvYik7XG4gICAgfSwgZm9ybWF0ID09PSAncG5nJyA/ICdpbWFnZS9wbmcnIDogJ2ltYWdlL2pwZWcnLCAwLjkyKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGxvYWRJbWFnZSh1cmw6IHN0cmluZyk6IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgaW1hZ2Uub25sb2FkID0gKCkgPT4gcmVzb2x2ZShpbWFnZSk7XG4gICAgaW1hZ2Uub25lcnJvciA9ICgpID0+IHJlamVjdChuZXcgRXJyb3IoJ0ZhaWxlZCB0byBsb2FkIFNWRyBpbWFnZScpKTtcbiAgICBpbWFnZS5zcmMgPSB1cmw7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyQmxvYkRvd25sb2FkKGJsb2I6IEJsb2IsIGZpbGVuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgY29uc3QgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICBhbmNob3IuaHJlZiA9IHVybDtcbiAgYW5jaG9yLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gIGFuY2hvci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGFuY2hvcik7XG4gIGFuY2hvci5jbGljaygpO1xuICBhbmNob3IucmVtb3ZlKCk7XG4gIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbn1cblxuZnVuY3Rpb24gc2FuaXRpemVGaWxlTmFtZSh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLnRyaW0oKS5yZXBsYWNlKC9bXmEtejAtOS1fXSsvZ2ksICctJykucmVwbGFjZSgvLSsvZywgJy0nKS5yZXBsYWNlKC9eLXwtJC9nLCAnJykgfHwgJ3dvcmQtY2xvdWQnO1xufVxuXG5mdW5jdGlvbiBnZXRMYXlvdXRQZXJmb3JtYW5jZVByb2ZpbGUoZGV0YWlsOiBSZW5kZXJTZXR0aW5nc1sncHJvZ3Jlc3NEZXRhaWwnXSk6IHtcbiAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiBudW1iZXI7XG4gIHdvcmRQcm9ncmVzc1N0cmlkZTogbnVtYmVyO1xufSB7XG4gIGlmIChkZXRhaWwgPT09ICd1bmhpbmdlZCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAxXzAwMF8wMDAsXG4gICAgICB3b3JkUHJvZ3Jlc3NTdHJpZGU6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIH07XG4gIH1cblxuICBpZiAoZGV0YWlsID09PSAnZGV0YWlsZWQnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2dyZXNzVGhyb3R0bGVNczogMzAsXG4gICAgICB3b3JkUHJvZ3Jlc3NTdHJpZGU6IDEsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChkZXRhaWwgPT09ICdtaW5pbWFsJykge1xuICAgIHJldHVybiB7XG4gICAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDIyMCxcbiAgICAgIHdvcmRQcm9ncmVzc1N0cmlkZTogMTIsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiA4MCxcbiAgICB3b3JkUHJvZ3Jlc3NTdHJpZGU6IDQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRocm90dGxlZFByb2dyZXNzKFxuICBvblByb2dyZXNzOiAoKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB2b2lkKSB8IHVuZGVmaW5lZCxcbiAgbWluSW50ZXJ2YWxNczogbnVtYmVyLFxuKTogKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB2b2lkIHtcbiAgaWYgKCFvblByb2dyZXNzKSB7XG4gICAgcmV0dXJuICgpID0+IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxldCBsYXN0UmVwb3J0ZWRBdCA9IDA7XG4gIGxldCBsYXN0UGVyY2VudCA9IC0xO1xuXG4gIHJldHVybiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGlmIChwZXJjZW50ICE9PSAxMDAgJiYgcGVyY2VudCA9PT0gbGFzdFBlcmNlbnQgJiYgbm93IC0gbGFzdFJlcG9ydGVkQXQgPCBtaW5JbnRlcnZhbE1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwZXJjZW50ICE9PSAxMDAgJiYgbm93IC0gbGFzdFJlcG9ydGVkQXQgPCBtaW5JbnRlcnZhbE1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGFzdFJlcG9ydGVkQXQgPSBub3c7XG4gICAgbGFzdFBlcmNlbnQgPSBwZXJjZW50O1xuICAgIG9uUHJvZ3Jlc3MobWVzc2FnZSwgcGVyY2VudCk7XG4gIH07XG59XG4iLCAiaW1wb3J0IHsgSXRlbVZpZXcsIFdvcmtzcGFjZUxlYWYgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBWSUVXX1RZUEVfTk9URV9XT1JEX0NMT1VEIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHsgV29yZENsb3VkU2VydmljZXMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBOb3RlV29yZENsb3VkVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgcHJpdmF0ZSByZWFkb25seSBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXM7XG4gIHByaXZhdGUgcmVuZGVyTm9uY2UgPSAwO1xuICBwcml2YXRlIHNlbGVjdGVkRmlsZVBhdGggPSAnJztcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXMpIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgICB0aGlzLnNlcnZpY2VzID0gc2VydmljZXM7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBWSUVXX1RZUEVfTk9URV9XT1JEX0NMT1VEO1xuICB9XG5cbiAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ05vdGUgd29yZCBjbG91ZHMnO1xuICB9XG5cbiAgZ2V0SWNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiAnZmlsZS10ZXh0JztcbiAgfVxuXG4gIGFzeW5jIG9uT3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICBjb250ZW50RWwuZW1wdHkoKTtcbiAgICBjb250ZW50RWwuYWRkQ2xhc3MoJ3ZhdWx0LXdvcmQtY2xvdWQtdmlldycpO1xuXG4gICAgY29uc3QgdG9wRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10b3AnIH0pO1xuICAgIGNvbnN0IGhlYWRlckVsID0gdG9wRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1oZWFkZXInIH0pO1xuICAgIGhlYWRlckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ05vdGUgd29yZCBjbG91ZHMnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRpdGxlJyB9KTtcblxuICAgIGNvbnN0IGNvbnRyb2xzRWwgPSB0b3BFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNvbnRyb2xzJyB9KTtcblxuICAgIGNvbnN0IGZpbGVGaWx0ZXJFbCA9IGNvbnRyb2xzRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10YWctZmlsdGVyJyB9KTtcbiAgICBjb25zdCBmaWxlTGFiZWxFbCA9IGZpbGVGaWx0ZXJFbC5jcmVhdGVFbCgnbGFiZWwnLCB7IHRleHQ6ICdPcGVuIG5vdGUnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRhZy1sYWJlbCcgfSk7XG4gICAgY29uc3QgZmlsZVNlbGVjdEVsID0gZmlsZUZpbHRlckVsLmNyZWF0ZUVsKCdzZWxlY3QnLCB7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtbW9kZS1zZWxlY3QnIH0pO1xuICAgIGZpbGVTZWxlY3RFbC5pZCA9ICd2YXVsdC13b3JkLWNsb3VkLW5vdGUtc2VsZWN0JztcbiAgICBmaWxlTGFiZWxFbC5zZXRBdHRyKCdmb3InLCBmaWxlU2VsZWN0RWwuaWQpO1xuICAgIGZpbGVTZWxlY3RFbC5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ0Nob29zZSBhbiBvcGVuIG5vdGUnKTtcblxuICAgIGNvbnN0IGFjdGl2ZUJ1dHRvbiA9IGNvbnRyb2xzRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIHRleHQ6ICdVc2UgYWN0aXZlIG5vdGUnLFxuICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1yZWZyZXNoJyxcbiAgICB9KTtcbiAgICBhY3RpdmVCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsICdVc2UgYWN0aXZlIG5vdGUnKTtcblxuICAgIGNvbnN0IHJlZnJlc2hCdXR0b24gPSBjb250cm9sc0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICB0ZXh0OiAnUmVmcmVzaCcsXG4gICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXJlZnJlc2gnLFxuICAgIH0pO1xuICAgIHJlZnJlc2hCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsICdSZWZyZXNoIHdvcmQgY2xvdWQnKTtcblxuICAgIGNvbnN0IGNhbnZhc0VsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY2FudmFzJyB9KTtcblxuICAgIHRoaXMudXBkYXRlT3BlbkZpbGVPcHRpb25zKGZpbGVTZWxlY3RFbCk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoZmlsZVNlbGVjdEVsLCAnY2hhbmdlJywgKCkgPT4ge1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gZmlsZVNlbGVjdEVsLnZhbHVlO1xuICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChhY3RpdmVCdXR0b24sICdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLnNlcnZpY2VzLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmIChhY3RpdmVGaWxlKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCA9IGFjdGl2ZUZpbGUucGF0aDtcbiAgICAgICAgdGhpcy51cGRhdGVPcGVuRmlsZU9wdGlvbnMoZmlsZVNlbGVjdEVsKTtcbiAgICAgICAgZmlsZVNlbGVjdEVsLnZhbHVlID0gdGhpcy5zZWxlY3RlZEZpbGVQYXRoO1xuICAgICAgfVxuICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChyZWZyZXNoQnV0dG9uLCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZU9wZW5GaWxlT3B0aW9ucyhmaWxlU2VsZWN0RWwpO1xuICAgICAgaWYgKCFmaWxlU2VsZWN0RWwudmFsdWUgJiYgdGhpcy5zZWxlY3RlZEZpbGVQYXRoKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCA9ICcnO1xuICAgICAgfVxuICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ2FjdGl2ZS1sZWFmLWNoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLnNlcnZpY2VzLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghYWN0aXZlRmlsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkRmlsZVBhdGggIT09IGFjdGl2ZUZpbGUucGF0aCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZVBhdGggPSBhY3RpdmVGaWxlLnBhdGg7XG4gICAgICAgIHRoaXMudXBkYXRlT3BlbkZpbGVPcHRpb25zKGZpbGVTZWxlY3RFbCk7XG4gICAgICAgIGZpbGVTZWxlY3RFbC52YWx1ZSA9IHRoaXMuc2VsZWN0ZWRGaWxlUGF0aDtcbiAgICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICBhd2FpdCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgfVxuXG4gIGFzeW5jIG9uUmVzaXplKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGNhbnZhc0VsID0gdGhpcy5jb250ZW50RWwucXVlcnlTZWxlY3RvcignLnZhdWx0LXdvcmQtY2xvdWQtY2FudmFzJyk7XG4gICAgaWYgKGNhbnZhc0VsIGluc3RhbmNlb2YgSFRNTERpdkVsZW1lbnQpIHtcbiAgICAgIGF3YWl0IHRoaXMucmVuZGVyQ2xvdWQoY2FudmFzRWwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlT3BlbkZpbGVPcHRpb25zKHNlbGVjdEVsOiBIVE1MU2VsZWN0RWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IG9wZW5GaWxlcyA9IHRoaXMuc2VydmljZXMuZ2V0T3Blbk1hcmtkb3duRmlsZXMoKTtcbiAgICBjb25zdCBhY3RpdmVGaWxlID0gdGhpcy5zZXJ2aWNlcy5nZXRBY3RpdmVGaWxlKCk7XG5cbiAgICBpZiAoIXRoaXMuc2VsZWN0ZWRGaWxlUGF0aCAmJiBhY3RpdmVGaWxlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZVBhdGggPSBhY3RpdmVGaWxlLnBhdGg7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkRmlsZVBhdGg7XG4gICAgc2VsZWN0RWwuZW1wdHkoKTtcblxuICAgIGlmIChvcGVuRmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBzZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiAnTm8gb3BlbiBtYXJrZG93biBub3RlcycsIHZhbHVlOiAnJyB9KTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCA9ICcnO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZmlsZSBvZiBvcGVuRmlsZXMpIHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IHNlbGVjdEVsLmNyZWF0ZUVsKCdvcHRpb24nLCB7IHRleHQ6IGZpbGUucGF0aCwgdmFsdWU6IGZpbGUucGF0aCB9KTtcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGZpbGUucGF0aCA9PT0gc2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gc2VsZWN0RWwudmFsdWU7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJlbmRlckNsb3VkKGNvbnRhaW5lckVsOiBIVE1MRGl2RWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGFjdGl2ZU5vbmNlID0gKyt0aGlzLnJlbmRlck5vbmNlO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgY29uc3QgbG9hZGluZ0VsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsIHRleHQ6ICdCdWlsZGluZyBjbG91ZC4uLicgfSk7XG4gICAgY29uc3QgdXBkYXRlUHJvZ3Jlc3MgPSAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGlmIChhY3RpdmVOb25jZSAhPT0gdGhpcy5yZW5kZXJOb25jZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsb2FkaW5nRWwuc2V0VGV4dChgJHttZXNzYWdlfSAoJHtwZXJjZW50fSUpYCk7XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB0YXJnZXRGaWxlID0gdGhpcy5zZXJ2aWNlcy5nZXRPcGVuTWFya2Rvd25GaWxlcygpLmZpbmQoKGZpbGUpID0+IGZpbGUucGF0aCA9PT0gdGhpcy5zZWxlY3RlZEZpbGVQYXRoKTtcbiAgICAgIGlmICghdGFyZ2V0RmlsZSkge1xuICAgICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsXG4gICAgICAgICAgdGV4dDogJ09wZW4gYSBtYXJrZG93biBub3RlIGFuZCBzZWxlY3QgaXQgdG8gdmlldyBhIG5vdGUtc3BlY2lmaWMgd29yZCBjbG91ZC4nLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB3b3JkcyA9IGF3YWl0IHRoaXMuc2VydmljZXMuY29sbGVjdEZpbGVXb3Jkcyh0YXJnZXRGaWxlLCB1cGRhdGVQcm9ncmVzcyk7XG5cbiAgICAgIGlmICh3b3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLFxuICAgICAgICAgIHRleHQ6IGBObyB3b3JkcyBmb3VuZCBpbiAke3RhcmdldEZpbGUuYmFzZW5hbWV9LmAsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMuc2VydmljZXMuZHJhd1dvcmRDbG91ZCh7XG4gICAgICAgIGNvbnRhaW5lckVsLFxuICAgICAgICB3b3JkcyxcbiAgICAgICAgYXJpYUxhYmVsOiBgV29yZCBjbG91ZCBmb3IgJHt0YXJnZXRGaWxlLmJhc2VuYW1lfWAsXG4gICAgICAgIG9uUHJvZ3Jlc3M6IHVwZGF0ZVByb2dyZXNzLFxuICAgICAgICBvbldvcmRDbGljazogKHdvcmQpID0+IHtcbiAgICAgICAgICB2b2lkIHRoaXMuc2VydmljZXMub3BlblNlYXJjaEZvcldvcmQod29yZCwgeyBmaWxlUGF0aDogdGFyZ2V0RmlsZS5wYXRoIH0pO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChhY3RpdmVOb25jZSAhPT0gdGhpcy5yZW5kZXJOb25jZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuICAgICAgY29uc29sZS5lcnJvcignTm90ZSB3b3JkIGNsb3VkOiBmYWlsZWQgdG8gcmVuZGVyIGNsb3VkJywgZXJyb3IpO1xuICAgICAgY29udGFpbmVyRWwuY3JlYXRlRGl2KHtcbiAgICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsXG4gICAgICAgIHRleHQ6ICdDb3VsZCBub3QgcmVuZGVyIHRoZSB3b3JkIGNsb3VkLiBPcGVuIGRldmVsb3BlciBjb25zb2xlIGZvciBkZXRhaWxzLicsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBJdGVtVmlldywgV29ya3NwYWNlTGVhZiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VEIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHsgVGFnTWF0Y2hNb2RlLCBXb3JkQ2xvdWRTZXJ2aWNlcyB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFZhdWx0V29yZENsb3VkVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgcHJpdmF0ZSByZWFkb25seSBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXM7XG4gIHByaXZhdGUgcmVuZGVyTm9uY2UgPSAwO1xuICBwcml2YXRlIHNlbGVjdGVkVGFnczogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSB0YWdNYXRjaE1vZGU6IFRhZ01hdGNoTW9kZSA9ICdhbnknO1xuXG4gIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHNlcnZpY2VzOiBXb3JkQ2xvdWRTZXJ2aWNlcykge1xuICAgIHN1cGVyKGxlYWYpO1xuICAgIHRoaXMuc2VydmljZXMgPSBzZXJ2aWNlcztcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VEO1xuICB9XG5cbiAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ1dvcmQgY2xvdWRzJztcbiAgfVxuXG4gIGdldEljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2Nsb3VkJztcbiAgfVxuXG4gIGFzeW5jIG9uT3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICBjb250ZW50RWwuZW1wdHkoKTtcbiAgICBjb250ZW50RWwuYWRkQ2xhc3MoJ3ZhdWx0LXdvcmQtY2xvdWQtdmlldycpO1xuXG4gICAgY29uc3QgdG9wRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10b3AnIH0pO1xuXG4gICAgY29uc3QgaGVhZGVyRWwgPSB0b3BFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWhlYWRlcicgfSk7XG4gICAgaGVhZGVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnV29yZCBjbG91ZHMnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRpdGxlJyB9KTtcblxuICAgIGNvbnN0IGNvbnRyb2xzRWwgPSB0b3BFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNvbnRyb2xzJyB9KTtcblxuICAgIGNvbnN0IHRhZ1BpY2tlckVsID0gY29udHJvbHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRhZy1maWx0ZXInIH0pO1xuICAgIGNvbnN0IHRhZ1NlbGVjdEVsID0gdGFnUGlja2VyRWwuY3JlYXRlRWwoJ3NlbGVjdCcsIHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1tb2RlLXNlbGVjdCcgfSk7XG4gICAgdGFnU2VsZWN0RWwuaWQgPSAndmF1bHQtd29yZC1jbG91ZC10YWctc2VsZWN0JztcbiAgICB0YWdTZWxlY3RFbC5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ0FkZCB0YWcgZmlsdGVyJyk7XG5cbiAgICBjb25zdCBtb2RlRWwgPSBjb250cm9sc0VsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtbWF0Y2gtbW9kZScgfSk7XG4gICAgbW9kZUVsLmNyZWF0ZUVsKCdzcGFuJywgeyB0ZXh0OiAnTWF0Y2gnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRhZy1sYWJlbCcgfSk7XG4gICAgY29uc3QgbW9kZVNlbGVjdEVsID0gbW9kZUVsLmNyZWF0ZUVsKCdzZWxlY3QnLCB7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtbW9kZS1zZWxlY3QnIH0pO1xuICAgIG1vZGVTZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiAnQW55JywgdmFsdWU6ICdhbnknIH0pO1xuICAgIG1vZGVTZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiAnQWxsJywgdmFsdWU6ICdhbGwnIH0pO1xuICAgIG1vZGVTZWxlY3RFbC52YWx1ZSA9IHRoaXMudGFnTWF0Y2hNb2RlO1xuICAgIG1vZGVTZWxlY3RFbC5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1RhZyBtYXRjaCBtb2RlJyk7XG5cbiAgICBjb25zdCByZWZyZXNoQnV0dG9uID0gY29udHJvbHNFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgdGV4dDogJ1JlZnJlc2gnLFxuICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1yZWZyZXNoJyxcbiAgICB9KTtcbiAgICByZWZyZXNoQnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnUmVmcmVzaCB3b3JkIGNsb3VkJyk7XG5cbiAgICBjb25zdCBhcHBsaWVkVGFnc0VsID0gdG9wRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1hcHBsaWVkLXRhZ3MnIH0pO1xuICAgIGNvbnN0IGNhbnZhc0VsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY2FudmFzJyB9KTtcblxuICAgIHRoaXMudXBkYXRlVGFnUGlja2VyT3B0aW9ucyh0YWdTZWxlY3RFbCk7XG4gICAgdGhpcy5yZW5kZXJBcHBsaWVkVGFnQ2hpcHMoYXBwbGllZFRhZ3NFbCwgdGFnU2VsZWN0RWwsIGNhbnZhc0VsKTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudCh0YWdTZWxlY3RFbCwgJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkVGFnID0gdGFnU2VsZWN0RWwudmFsdWU7XG4gICAgICBpZiAoc2VsZWN0ZWRUYWcgJiYgIXRoaXMuc2VsZWN0ZWRUYWdzLmluY2x1ZGVzKHNlbGVjdGVkVGFnKSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkVGFncy5wdXNoKHNlbGVjdGVkVGFnKTtcbiAgICAgIH1cblxuICAgICAgdGFnU2VsZWN0RWwudmFsdWUgPSAnJztcbiAgICAgIHRoaXMudXBkYXRlVGFnUGlja2VyT3B0aW9ucyh0YWdTZWxlY3RFbCk7XG4gICAgICB0aGlzLnJlbmRlckFwcGxpZWRUYWdDaGlwcyhhcHBsaWVkVGFnc0VsLCB0YWdTZWxlY3RFbCwgY2FudmFzRWwpO1xuICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChtb2RlU2VsZWN0RWwsICdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICB0aGlzLnRhZ01hdGNoTW9kZSA9IG1vZGVTZWxlY3RFbC52YWx1ZSA9PT0gJ2FsbCcgPyAnYWxsJyA6ICdhbnknO1xuICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChyZWZyZXNoQnV0dG9uLCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVRhZ1BpY2tlck9wdGlvbnModGFnU2VsZWN0RWwpO1xuICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICB9KTtcblxuICAgIGF3YWl0IHRoaXMucmVuZGVyQ2xvdWQoY2FudmFzRWwpO1xuICB9XG5cbiAgYXN5bmMgb25SZXNpemUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY2FudmFzRWwgPSB0aGlzLmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKCcudmF1bHQtd29yZC1jbG91ZC1jYW52YXMnKTtcbiAgICBpZiAoY2FudmFzRWwgaW5zdGFuY2VvZiBIVE1MRGl2RWxlbWVudCkge1xuICAgICAgYXdhaXQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVUYWdQaWNrZXJPcHRpb25zKHNlbGVjdEVsOiBIVE1MU2VsZWN0RWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IHRhZ3MgPSB0aGlzLnNlcnZpY2VzLmdldEF2YWlsYWJsZVRhZ3MoKTtcbiAgICBjb25zdCBzZWxlY3RlZFNldCA9IG5ldyBTZXQodGhpcy5zZWxlY3RlZFRhZ3MpO1xuXG4gICAgc2VsZWN0RWwuZW1wdHkoKTtcbiAgICBzZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiAnQWRkIHRhZyBmaWx0ZXIuLi4nLCB2YWx1ZTogJycgfSk7XG5cbiAgICBmb3IgKGNvbnN0IHRhZyBvZiB0YWdzKSB7XG4gICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiB0YWcsIHZhbHVlOiB0YWcgfSk7XG4gICAgICBvcHRpb24uZGlzYWJsZWQgPSBzZWxlY3RlZFNldC5oYXModGFnKTtcbiAgICB9XG5cbiAgICBzZWxlY3RFbC52YWx1ZSA9ICcnO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJBcHBsaWVkVGFnQ2hpcHMoXG4gICAgY2hpcHNFbDogSFRNTERpdkVsZW1lbnQsXG4gICAgdGFnU2VsZWN0RWw6IEhUTUxTZWxlY3RFbGVtZW50LFxuICAgIGNhbnZhc0VsOiBIVE1MRGl2RWxlbWVudCxcbiAgKTogdm9pZCB7XG4gICAgY2hpcHNFbC5lbXB0eSgpO1xuXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRUYWdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY2hpcHNFbC5jcmVhdGVTcGFuKHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1jaGlwLWVtcHR5JywgdGV4dDogJ05vIHRhZyBmaWx0ZXJzIGFwcGxpZWQuJyB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHRhZyBvZiB0aGlzLnNlbGVjdGVkVGFncykge1xuICAgICAgY29uc3QgY2hpcEVsID0gY2hpcHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNoaXAnIH0pO1xuICAgICAgY2hpcEVsLmNyZWF0ZVNwYW4oeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNoaXAtdGV4dCcsIHRleHQ6IHRhZyB9KTtcblxuICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gY2hpcEVsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY2hpcC1yZW1vdmUnLFxuICAgICAgICB0ZXh0OiAneCcsXG4gICAgICB9KTtcbiAgICAgIHJlbW92ZUJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgYFJlbW92ZSAke3RhZ30gZmlsdGVyYCk7XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChyZW1vdmVCdXR0b24sICdjbGljaycsICgpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhZ3MgPSB0aGlzLnNlbGVjdGVkVGFncy5maWx0ZXIoKHZhbHVlKSA9PiB2YWx1ZSAhPT0gdGFnKTtcbiAgICAgICAgdGhpcy51cGRhdGVUYWdQaWNrZXJPcHRpb25zKHRhZ1NlbGVjdEVsKTtcbiAgICAgICAgdGhpcy5yZW5kZXJBcHBsaWVkVGFnQ2hpcHMoY2hpcHNFbCwgdGFnU2VsZWN0RWwsIGNhbnZhc0VsKTtcbiAgICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcmVuZGVyQ2xvdWQoY29udGFpbmVyRWw6IEhUTUxEaXZFbGVtZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgYWN0aXZlTm9uY2UgPSArK3RoaXMucmVuZGVyTm9uY2U7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICBjb25zdCBsb2FkaW5nRWwgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJywgdGV4dDogJ0J1aWxkaW5nIGNsb3VkLi4uJyB9KTtcbiAgICBjb25zdCB1cGRhdGVQcm9ncmVzcyA9IChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgICAgaWYgKGFjdGl2ZU5vbmNlICE9PSB0aGlzLnJlbmRlck5vbmNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxvYWRpbmdFbC5zZXRUZXh0KGAke21lc3NhZ2V9ICgke3BlcmNlbnR9JSlgKTtcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHdvcmRzID0gYXdhaXQgdGhpcy5zZXJ2aWNlcy5jb2xsZWN0VmF1bHRXb3Jkcyh0aGlzLnNlbGVjdGVkVGFncywgdGhpcy50YWdNYXRjaE1vZGUsIHVwZGF0ZVByb2dyZXNzKTtcblxuICAgICAgaWYgKHdvcmRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsXG4gICAgICAgICAgdGV4dDogdGhpcy5zZWxlY3RlZFRhZ3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgPyAnTm8gd29yZHMgZm91bmQgZm9yIHRoZSBzZWxlY3RlZCB0YWcgZmlsdGVycy4nXG4gICAgICAgICAgICA6ICdObyB3b3JkcyBmb3VuZC4gQWRkIG1vcmUgbm90ZSBjb250ZW50IGFuZCByZWZyZXNoLicsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMuc2VydmljZXMuZHJhd1dvcmRDbG91ZCh7XG4gICAgICAgIGNvbnRhaW5lckVsLFxuICAgICAgICB3b3JkcyxcbiAgICAgICAgYXJpYUxhYmVsOiAnV29yZCBjbG91ZCBiYXNlZCBvbiBtYXJrZG93biBmaWxlcyBpbiB0aGUgdmF1bHQnLFxuICAgICAgICBvblByb2dyZXNzOiB1cGRhdGVQcm9ncmVzcyxcbiAgICAgICAgb25Xb3JkQ2xpY2s6ICh3b3JkKSA9PiB7XG4gICAgICAgICAgdm9pZCB0aGlzLnNlcnZpY2VzLm9wZW5TZWFyY2hGb3JXb3JkKHdvcmQsIHtcbiAgICAgICAgICAgIHRhZ3M6IHRoaXMuc2VsZWN0ZWRUYWdzLFxuICAgICAgICAgICAgdGFnTWF0Y2hNb2RlOiB0aGlzLnRhZ01hdGNoTW9kZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoYWN0aXZlTm9uY2UgIT09IHRoaXMucmVuZGVyTm9uY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1ZhdWx0IHdvcmQgY2xvdWQ6IGZhaWxlZCB0byByZW5kZXIgY2xvdWQnLCBlcnJvcik7XG4gICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJyxcbiAgICAgICAgdGV4dDogJ0NvdWxkIG5vdCByZW5kZXIgdGhlIHdvcmQgY2xvdWQuIE9wZW4gZGV2ZWxvcGVyIGNvbnNvbGUgZm9yIGRldGFpbHMuJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQSxnRkFBQUEsU0FBQTtBQUNBLEtBQUMsU0FBVSxRQUFRLFNBQVM7QUFDNUIsYUFBTyxZQUFZLFlBQVksT0FBT0EsWUFBVyxjQUFjLFFBQVEsT0FBTyxJQUM5RSxPQUFPLFdBQVcsY0FBYyxPQUFPLE1BQU0sT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLEtBQ3ZFLFNBQVMsVUFBVSxNQUFNLFFBQVEsT0FBTyxLQUFLLE9BQU8sTUFBTSxDQUFDLENBQUM7QUFBQSxJQUM3RCxHQUFFLFNBQU0sU0FBVUMsVUFB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QkFBa0I7QUFFdEgsVUFBTSxpQkFBaUIsSUFBSSxtQkFBbUIsYUFDekMsSUFBSSxtQkFBbUIsY0FDdkIsSUFBSSxtQkFBbUIsY0FDdkIsSUFBSSxtQkFBbUIsYUFDeEIsSUFBSSxpQkFDSixpQkFBaUIsT0FBTztBQUU1QixVQUFNLGdCQUFnQixLQUFLLFlBQVksSUFBSSxlQUFlLEdBQUcsSUFBSSxpQkFBaUIsT0FBTyxhQUFhO0FBQ3RHLFVBQU0sdUJBQXVCLEtBQUs7QUFBQSxNQUNoQyxJQUFJO0FBQUEsTUFDSjtBQUFBLE1BQ0E7QUFBQSxNQUNBLGlCQUFpQixPQUFPO0FBQUEsSUFDMUI7QUFFQSxVQUFNLHNCQUFzQixPQUFPLElBQUksd0JBQXdCLFlBQzNELElBQUksc0JBQ0osaUJBQWlCLE9BQU87QUFFNUIsVUFBTSxhQUFhLEtBQUssWUFBWSxJQUFJLFlBQVksR0FBRyxZQUFZLGlCQUFpQixPQUFPLFVBQVU7QUFFckcsV0FBTztBQUFBLE1BQ0w7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0EsYUFBYTtBQUFBLE1BQ2IsYUFBYTtBQUFBLE1BQ2I7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVRLFlBQVksT0FBZ0IsS0FBYSxLQUFhLFVBQTBCO0FBQ3RGLFFBQUksT0FBTyxVQUFVLFlBQVksT0FBTyxNQUFNLEtBQUssR0FBRztBQUNwRCxhQUFPO0FBQUEsSUFDVDtBQUNBLFdBQU8sS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxNQUFNLEtBQUssQ0FBQyxDQUFDO0FBQUEsRUFDdkQ7QUFBQSxFQUVRLFdBQVcsT0FBZ0IsS0FBYSxLQUFhLFVBQTBCO0FBQ3JGLFFBQUksT0FBTyxVQUFVLFlBQVksT0FBTyxNQUFNLEtBQUssR0FBRztBQUNwRCxhQUFPO0FBQUEsSUFDVDtBQUNBLFdBQU8sS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxDQUFDO0FBQUEsRUFDM0M7QUFDRjsiLAogICJuYW1lcyI6IFsibW9kdWxlIiwgImV4cG9ydHMiLCAicGFyc2VUeXBlbmFtZXMiLCAibW9kdWxlIiwgImkiLCAiY2FudmFzIiwgInciLCAiaCIsICJpbXBvcnRfb2JzaWRpYW4iLCAiZG9jdW1lbnQiLCAiZG9jdW1lbnQiLCAiZG9jdW1lbnQiLCAiaW1wb3J0X29ic2lkaWFuIiwgImNvbXB1dGVTY2FsZVNjb3JlIiwgImNsYW1wMDEiLCAia2V5IiwgImRvY3VtZW50IiwgImRhdHVtIiwgInNlbGVjdGlvbiIsICJzZWxlY3RfZGVmYXVsdCIsICJzZWxlY3RfZGVmYXVsdCIsICJjcmVhdGVUaHJvdHRsZWRQcm9ncmVzcyIsICJsYXlvdXRXb3JkcyIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIl0KfQo=
