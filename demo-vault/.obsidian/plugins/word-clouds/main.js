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
var import_obsidian6 = require("obsidian");

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
  height: 320,
  interactions: true
};
var EMBED_RESIZE_DEBOUNCE_MS = 140;
var embeddedRenderStates = /* @__PURE__ */ new WeakMap();
function registerEmbeddedWordCloudProcessor(plugin, services) {
  const render = async (source, el, ctx) => {
    cleanupEmbeddedRenderState(el);
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
        onRefresh: () => render(source, el, ctx),
        enableOverlayControls: true,
        enableViewportInteraction: options.interactions,
        showRefreshControl: true,
        showZoomControls: options.interactions,
        onWordClick: (word) => {
          void services.openSearchForWord(word, searchScope);
        }
      });
      stateEl.remove();
      registerEmbeddedResizeObserver(el, canvasEl, () => render(source, el, ctx));
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
    if (rawKey === "interactions" || rawKey === "interactable" || rawKey === "controls") {
      options.interactions = parseBooleanOption(rawValue, true);
      continue;
    }
    if (rawKey === "note") {
      options.notePath = rawValue;
    }
  }
  return options;
}
function parseBooleanOption(value, fallback) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "yes" || normalized === "on" || normalized === "1") {
    return true;
  }
  if (normalized === "false" || normalized === "no" || normalized === "off" || normalized === "0") {
    return false;
  }
  return fallback;
}
function registerEmbeddedResizeObserver(hostEl, canvasEl, rerender) {
  if (typeof ResizeObserver === "undefined") {
    return;
  }
  const state = {
    observer: new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      const nextWidth = Math.round(entry.contentRect.width);
      const nextHeight = Math.round(entry.contentRect.height);
      if (nextWidth <= 0 || nextHeight <= 0) {
        return;
      }
      if (nextWidth === state.lastWidth && nextHeight === state.lastHeight) {
        return;
      }
      state.lastWidth = nextWidth;
      state.lastHeight = nextHeight;
      if (state.rerenderTimer !== null) {
        window.clearTimeout(state.rerenderTimer);
      }
      state.rerenderTimer = window.setTimeout(() => {
        state.rerenderTimer = null;
        rerender();
      }, EMBED_RESIZE_DEBOUNCE_MS);
    }),
    rerenderTimer: null,
    lastWidth: Math.round(canvasEl.clientWidth),
    lastHeight: Math.round(canvasEl.clientHeight)
  };
  state.observer.observe(canvasEl);
  embeddedRenderStates.set(hostEl, state);
}
function cleanupEmbeddedRenderState(hostEl) {
  const state = embeddedRenderStates.get(hostEl);
  if (!state) {
    return;
  }
  state.observer.disconnect();
  if (state.rerenderTimer !== null) {
    window.clearTimeout(state.rerenderTimer);
  }
  embeddedRenderStates.delete(hostEl);
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
          onRefresh: rerenderPreview,
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
  var window2 = window_default(node), event = window2.CustomEvent;
  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window2.document.createEvent("Event");
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
var import_obsidian3 = require("obsidian");
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
  const { containerEl, words, ariaLabel, onWordClick, onProgress, onRefresh } = options;
  const exportBaseName = sanitizeFileName(options.exportBaseName ?? "word-cloud");
  const enableExport = options.enableExport ?? true;
  const enableOverlayControls = options.enableOverlayControls ?? true;
  const enableViewportInteraction = options.enableViewportInteraction ?? true;
  const showRefreshControl = options.showRefreshControl ?? true;
  const showZoomControls = options.showZoomControls ?? true;
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
  const viewportGroup = svg.append("g").attr("class", "word-cloud-viewport");
  const g = viewportGroup.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
  const viewportControls = enableViewportInteraction ? setupViewportControls(svg.node(), viewportGroup.node(), width, height) : createStaticViewportControls();
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
        if (viewportControls.shouldSuppressWordClick()) {
          return;
        }
        onWordClick(d.baseText);
      }).on("keydown", (event, d) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onWordClick(d.baseText);
        }
      }).append("title").text((d) => `${d.baseText} (${d.count})`);
      reportProgress("Rendering complete.", 100);
      if (enableOverlayControls) {
        renderOverlayControls(
          containerEl,
          svg.node(),
          exportBaseName,
          enableExport,
          onRefresh,
          viewportControls,
          showRefreshControl,
          showZoomControls
        );
      }
      resolve();
    }).start();
  });
}
function createStaticViewportControls() {
  return {
    zoomIn: () => void 0,
    zoomOut: () => void 0,
    resetView: () => void 0,
    shouldSuppressWordClick: () => false
  };
}
function setupViewportControls(svgEl, viewportEl, width, height) {
  if (!svgEl || !viewportEl) {
    return {
      zoomIn: () => void 0,
      zoomOut: () => void 0,
      resetView: () => void 0,
      shouldSuppressWordClick: () => false
    };
  }
  let panX = 0;
  let panY = 0;
  let zoom = 1;
  let suppressWordClickUntil = 0;
  let pointerId = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let pointerMoved = false;
  let isDragging = false;
  const minZoom = 0.35;
  const maxZoom = 4.5;
  const dragStartThresholdPx = 7;
  const clampZoom = (value) => {
    if (Number.isNaN(value)) {
      return zoom;
    }
    return Math.min(maxZoom, Math.max(minZoom, value));
  };
  const applyTransform = () => {
    viewportEl.setAttribute("transform", `translate(${panX},${panY}) scale(${zoom})`);
  };
  const zoomAt = (x, y, factor) => {
    if (!Number.isFinite(factor) || factor <= 0) {
      return;
    }
    const nextZoom = clampZoom(zoom * factor);
    if (nextZoom === zoom) {
      return;
    }
    const worldX = (x - panX) / zoom;
    const worldY = (y - panY) / zoom;
    panX = x - worldX * nextZoom;
    panY = y - worldY * nextZoom;
    zoom = nextZoom;
    applyTransform();
  };
  const nudgePan = (deltaX, deltaY) => {
    panX += deltaX;
    panY += deltaY;
    applyTransform();
  };
  const zoomIn = () => zoomAt(width / 2, height / 2, 1.18);
  const zoomOut = () => zoomAt(width / 2, height / 2, 1 / 1.18);
  const resetView = () => {
    panX = 0;
    panY = 0;
    zoom = 1;
    applyTransform();
  };
  applyTransform();
  svgEl.classList.add("word-cloud-panzoom-surface");
  svgEl.setAttribute("tabindex", "0");
  svgEl.setAttribute(
    "aria-keyshortcuts",
    "+, -, 0, ArrowLeft, ArrowRight, ArrowUp, ArrowDown"
  );
  svgEl.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch" && event.button !== 0) {
      return;
    }
    svgEl.focus({ preventScroll: true });
    pointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    pointerMoved = false;
    isDragging = false;
  });
  svgEl.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) {
      return;
    }
    if (!isDragging) {
      const dragDistance = Math.hypot(event.clientX - dragStartX, event.clientY - dragStartY);
      if (dragDistance < dragStartThresholdPx) {
        return;
      }
      isDragging = true;
      pointerMoved = true;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      svgEl.setPointerCapture(event.pointerId);
      svgEl.classList.add("is-panning");
      event.preventDefault();
      return;
    }
    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    nudgePan(deltaX, deltaY);
    event.preventDefault();
  });
  svgEl.addEventListener("pointerup", (event) => {
    if (pointerId !== event.pointerId) {
      return;
    }
    if (pointerMoved) {
      suppressWordClickUntil = Date.now() + 240;
    }
    pointerId = null;
    pointerMoved = false;
    isDragging = false;
    svgEl.classList.remove("is-panning");
    if (svgEl.hasPointerCapture(event.pointerId)) {
      svgEl.releasePointerCapture(event.pointerId);
    }
  });
  svgEl.addEventListener("pointercancel", (event) => {
    if (pointerId !== event.pointerId) {
      return;
    }
    pointerId = null;
    pointerMoved = false;
    isDragging = false;
    svgEl.classList.remove("is-panning");
    if (svgEl.hasPointerCapture(event.pointerId)) {
      svgEl.releasePointerCapture(event.pointerId);
    }
  });
  svgEl.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const speed = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 0.04 : 23e-4;
      const zoomFactor = Math.exp(-event.deltaY * speed);
      zoomAt(event.offsetX, event.offsetY, zoomFactor);
    },
    { passive: false }
  );
  svgEl.addEventListener("keydown", (event) => {
    if (event.key === "+" || event.key === "=" || event.key === "NumpadAdd") {
      event.preventDefault();
      zoomIn();
      return;
    }
    if (event.key === "-" || event.key === "_" || event.key === "NumpadSubtract") {
      event.preventDefault();
      zoomOut();
      return;
    }
    if (event.key === "0") {
      event.preventDefault();
      resetView();
      return;
    }
    const panStep = 36;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      nudgePan(panStep, 0);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nudgePan(-panStep, 0);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      nudgePan(0, panStep);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      nudgePan(0, -panStep);
    }
  });
  return {
    zoomIn,
    zoomOut,
    resetView,
    shouldSuppressWordClick: () => Date.now() < suppressWordClickUntil
  };
}
function renderOverlayControls(containerEl, svgEl, exportBaseName, enableExport, onRefresh, viewportControls, showRefreshControl, showZoomControls) {
  if (!svgEl) {
    return;
  }
  const makeRefreshButton = (parentEl) => {
    if (!showRefreshControl) {
      return;
    }
    const refreshButton = parentEl.createEl("button", {
      cls: "word-cloud-refresh-button"
    });
    refreshButton.type = "button";
    (0, import_obsidian3.setIcon)(refreshButton, "rotate-cw");
    refreshButton.setAttr("aria-label", "Refresh word cloud");
    let isRefreshing = false;
    refreshButton.addEventListener("click", async (event) => {
      event.preventDefault();
      if (isRefreshing) {
        return;
      }
      isRefreshing = true;
      refreshButton.disabled = true;
      try {
        await onRefresh();
      } finally {
        if (refreshButton.isConnected) {
          refreshButton.disabled = false;
        }
        isRefreshing = false;
      }
    });
  };
  if (showZoomControls) {
    const viewControlsEl = containerEl.createDiv({ cls: "word-cloud-view-controls" });
    const zoomOutButton = viewControlsEl.createEl("button", {
      cls: "word-cloud-view-button"
    });
    zoomOutButton.type = "button";
    (0, import_obsidian3.setIcon)(zoomOutButton, "minus");
    zoomOutButton.setAttr("aria-label", "Zoom out");
    zoomOutButton.addEventListener("click", () => viewportControls.zoomOut());
    const resetViewButton = viewControlsEl.createEl("button", {
      cls: "word-cloud-view-button"
    });
    resetViewButton.type = "button";
    (0, import_obsidian3.setIcon)(resetViewButton, "locate-fixed");
    resetViewButton.setAttr("aria-label", "Reset pan and zoom");
    resetViewButton.addEventListener("click", () => viewportControls.resetView());
    const zoomInButton = viewControlsEl.createEl("button", {
      cls: "word-cloud-view-button"
    });
    zoomInButton.type = "button";
    (0, import_obsidian3.setIcon)(zoomInButton, "plus");
    zoomInButton.setAttr("aria-label", "Zoom in");
    zoomInButton.addEventListener("click", () => viewportControls.zoomIn());
  }
  if (!enableExport) {
    if (!showZoomControls) {
      const fallbackControlsEl = containerEl.createDiv({ cls: "word-cloud-export-controls" });
      makeRefreshButton(fallbackControlsEl);
    }
    return;
  }
  const exportControlsEl = containerEl.createDiv({ cls: "word-cloud-export-controls" });
  const menuButton = exportControlsEl.createEl("button", {
    cls: "word-cloud-menu-button",
    text: "\u22EF"
  });
  menuButton.setAttr("aria-label", "Word cloud options");
  makeRefreshButton(exportControlsEl);
  const menuEl = exportControlsEl.createDiv({ cls: "word-cloud-menu" });
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
        if (!exportControlsEl.contains(target)) {
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
var import_obsidian4 = require("obsidian");
var NoteWordCloudView = class extends import_obsidian4.ItemView {
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
        onRefresh: () => this.renderCloud(containerEl),
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
var import_obsidian5 = require("obsidian");
var VaultWordCloudView = class extends import_obsidian5.ItemView {
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
    return "Vault Word Cloud";
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
          text: this.selectedTags.length > 0 ? "No words found for the selected tag filters." : "No words found."
        });
        return;
      }
      await this.services.drawWordCloud({
        containerEl,
        words,
        ariaLabel: "Word cloud based on markdown files in the vault",
        onProgress: updateProgress,
        onRefresh: () => this.renderCloud(containerEl),
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
var VaultWordCloudPlugin = class extends import_obsidian6.Plugin {
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
      name: "Open vault word cloud",
      callback: () => {
        void this.activateVaultWordCloudView();
      }
    });
    this.addCommand({
      id: "open-note-word-cloud-sidebar",
      name: "Open current note word cloud",
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
      if (view instanceof import_obsidian6.MarkdownView && view.file) {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL2QzLWNsb3VkL25vZGVfbW9kdWxlcy9kMy1kaXNwYXRjaC9kaXN0L2QzLWRpc3BhdGNoLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1jbG91ZC9pbmRleC5qcyIsICIuLi9zcmMvbWFpbi50cyIsICIuLi9zcmMvY29uc3RhbnRzLnRzIiwgIi4uL3NyYy9ibG9jay1yZW5kZXJlcnMvd29yZGNsb3VkLWJsb2NrLXJlbmRlcmVyLnRzIiwgIi4uL3NyYy91dGlscy50cyIsICIuLi9zcmMvYWN0aW9ucy9hcHBseS1zZWFyY2gudHMiLCAiLi4vc3JjL3BpcGVsaW5lL2FkYXB0ZXJzL29ic2lkaWFuLXNvdXJjZS50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RyYXRlZ2llcy9kZWZhdWx0cy50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL2FnZ3JlZ2F0ZS50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL2ZpbHRlci50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL25vcm1hbGl6ZS50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL3JlbmRlci1tb2RlbC50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL3NjYWxlLnRzIiwgIi4uL3NyYy9waXBlbGluZS9zdGFnZXMvc291cmNlLXNlbGVjdGlvbi50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL3Rva2VuaXplLnRzIiwgIi4uL3NyYy9waXBlbGluZS9ydW4tcGlwZWxpbmUudHMiLCAiLi4vc3JjL3Byb2Nlc3NpbmcvdGFnLWZpbHRlci50cyIsICIuLi9zcmMvcHJvY2Vzc2luZy9wcm9jZXNzb3IudHMiLCAiLi4vc3JjL3NldHRpbmdzL2luZGV4LnRzIiwgIi4uL3NyYy9wcm9jZXNzaW5nL3NjYWxpbmcudHMiLCAiLi4vbm9kZV9tb2R1bGVzL2ludGVybm1hcC9zcmMvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9pbml0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvb3JkaW5hbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9jb2xvcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvY2F0ZWdvcmljYWwvVGFibGVhdTEwLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL25hbWVzcGFjZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvbmFtZXNwYWNlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL2NyZWF0b3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0b3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9hcnJheS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3RvckFsbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0QWxsLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL21hdGNoZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdENoaWxkLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3RDaGlsZHJlbi5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZmlsdGVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zcGFyc2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2VudGVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL2NvbnN0YW50LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9kYXRhLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9leGl0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9qb2luLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9tZXJnZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vb3JkZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NvcnQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2NhbGwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL25vZGVzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9ub2RlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zaXplLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lbXB0eS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZWFjaC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vYXR0ci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy93aW5kb3cuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3N0eWxlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9wcm9wZXJ0eS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2xhc3NlZC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vdGV4dC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaHRtbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcmFpc2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2xvd2VyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9hcHBlbmQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2luc2VydC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcmVtb3ZlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9jbG9uZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGF0dW0uanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL29uLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9kaXNwYXRjaC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaXRlcmF0b3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdC5qcyIsICIuLi9zcmMvcmVuZGVyaW5nL3dvcmQtY2xvdWQtcmVuZGVyZXIudHMiLCAiLi4vc3JjL3ZpZXdzL25vdGUtd29yZC1jbG91ZC12aWV3LnRzIiwgIi4uL3NyYy92aWV3cy92YXVsdC13b3JkLWNsb3VkLXZpZXcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIGh0dHBzOi8vZDNqcy5vcmcvZDMtZGlzcGF0Y2gvIHYxLjAuNiBDb3B5cmlnaHQgMjAxOSBNaWtlIEJvc3RvY2tcbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG50eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbnR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuKGdsb2JhbCA9IGdsb2JhbCB8fCBzZWxmLCBmYWN0b3J5KGdsb2JhbC5kMyA9IGdsb2JhbC5kMyB8fCB7fSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbnZhciBub29wID0ge3ZhbHVlOiBmdW5jdGlvbigpIHt9fTtcblxuZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gYXJndW1lbnRzLmxlbmd0aCwgXyA9IHt9LCB0OyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKCEodCA9IGFyZ3VtZW50c1tpXSArIFwiXCIpIHx8ICh0IGluIF8pIHx8IC9bXFxzLl0vLnRlc3QodCkpIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgdHlwZTogXCIgKyB0KTtcbiAgICBfW3RdID0gW107XG4gIH1cbiAgcmV0dXJuIG5ldyBEaXNwYXRjaChfKTtcbn1cblxuZnVuY3Rpb24gRGlzcGF0Y2goXykge1xuICB0aGlzLl8gPSBfO1xufVxuXG5mdW5jdGlvbiBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZXMsIHR5cGVzKSB7XG4gIHJldHVybiB0eXBlbmFtZXMudHJpbSgpLnNwbGl0KC9efFxccysvKS5tYXAoZnVuY3Rpb24odCkge1xuICAgIHZhciBuYW1lID0gXCJcIiwgaSA9IHQuaW5kZXhPZihcIi5cIik7XG4gICAgaWYgKGkgPj0gMCkgbmFtZSA9IHQuc2xpY2UoaSArIDEpLCB0ID0gdC5zbGljZSgwLCBpKTtcbiAgICBpZiAodCAmJiAhdHlwZXMuaGFzT3duUHJvcGVydHkodCkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0KTtcbiAgICByZXR1cm4ge3R5cGU6IHQsIG5hbWU6IG5hbWV9O1xuICB9KTtcbn1cblxuRGlzcGF0Y2gucHJvdG90eXBlID0gZGlzcGF0Y2gucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogRGlzcGF0Y2gsXG4gIG9uOiBmdW5jdGlvbih0eXBlbmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgXyA9IHRoaXMuXyxcbiAgICAgICAgVCA9IHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lICsgXCJcIiwgXyksXG4gICAgICAgIHQsXG4gICAgICAgIGkgPSAtMSxcbiAgICAgICAgbiA9IFQubGVuZ3RoO1xuXG4gICAgLy8gSWYgbm8gY2FsbGJhY2sgd2FzIHNwZWNpZmllZCwgcmV0dXJuIHRoZSBjYWxsYmFjayBvZiB0aGUgZ2l2ZW4gdHlwZSBhbmQgbmFtZS5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKHQgPSAodHlwZW5hbWUgPSBUW2ldKS50eXBlKSAmJiAodCA9IGdldChfW3RdLCB0eXBlbmFtZS5uYW1lKSkpIHJldHVybiB0O1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIGEgdHlwZSB3YXMgc3BlY2lmaWVkLCBzZXQgdGhlIGNhbGxiYWNrIGZvciB0aGUgZ2l2ZW4gdHlwZSBhbmQgbmFtZS5cbiAgICAvLyBPdGhlcndpc2UsIGlmIGEgbnVsbCBjYWxsYmFjayB3YXMgc3BlY2lmaWVkLCByZW1vdmUgY2FsbGJhY2tzIG9mIHRoZSBnaXZlbiBuYW1lLlxuICAgIGlmIChjYWxsYmFjayAhPSBudWxsICYmIHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIGNhbGxiYWNrOiBcIiArIGNhbGxiYWNrKTtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgaWYgKHQgPSAodHlwZW5hbWUgPSBUW2ldKS50eXBlKSBfW3RdID0gc2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUsIGNhbGxiYWNrKTtcbiAgICAgIGVsc2UgaWYgKGNhbGxiYWNrID09IG51bGwpIGZvciAodCBpbiBfKSBfW3RdID0gc2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUsIG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBjb3B5OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29weSA9IHt9LCBfID0gdGhpcy5fO1xuICAgIGZvciAodmFyIHQgaW4gXykgY29weVt0XSA9IF9bdF0uc2xpY2UoKTtcbiAgICByZXR1cm4gbmV3IERpc3BhdGNoKGNvcHkpO1xuICB9LFxuICBjYWxsOiBmdW5jdGlvbih0eXBlLCB0aGF0KSB7XG4gICAgaWYgKChuID0gYXJndW1lbnRzLmxlbmd0aCAtIDIpID4gMCkgZm9yICh2YXIgYXJncyA9IG5ldyBBcnJheShuKSwgaSA9IDAsIG4sIHQ7IGkgPCBuOyArK2kpIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIGlmICghdGhpcy5fLmhhc093blByb3BlcnR5KHR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdHlwZSk7XG4gICAgZm9yICh0ID0gdGhpcy5fW3R5cGVdLCBpID0gMCwgbiA9IHQubGVuZ3RoOyBpIDwgbjsgKytpKSB0W2ldLnZhbHVlLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICB9LFxuICBhcHBseTogZnVuY3Rpb24odHlwZSwgdGhhdCwgYXJncykge1xuICAgIGlmICghdGhpcy5fLmhhc093blByb3BlcnR5KHR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdHlwZSk7XG4gICAgZm9yICh2YXIgdCA9IHRoaXMuX1t0eXBlXSwgaSA9IDAsIG4gPSB0Lmxlbmd0aDsgaSA8IG47ICsraSkgdFtpXS52YWx1ZS5hcHBseSh0aGF0LCBhcmdzKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0KHR5cGUsIG5hbWUpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0eXBlLmxlbmd0aCwgYzsgaSA8IG47ICsraSkge1xuICAgIGlmICgoYyA9IHR5cGVbaV0pLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIHJldHVybiBjLnZhbHVlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXQodHlwZSwgbmFtZSwgY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0eXBlLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIGlmICh0eXBlW2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIHR5cGVbaV0gPSBub29wLCB0eXBlID0gdHlwZS5zbGljZSgwLCBpKS5jb25jYXQodHlwZS5zbGljZShpICsgMSkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmIChjYWxsYmFjayAhPSBudWxsKSB0eXBlLnB1c2goe25hbWU6IG5hbWUsIHZhbHVlOiBjYWxsYmFja30pO1xuICByZXR1cm4gdHlwZTtcbn1cblxuZXhwb3J0cy5kaXNwYXRjaCA9IGRpc3BhdGNoO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSk7XG4iLCAiLy8gV29yZCBjbG91ZCBsYXlvdXQgYnkgSmFzb24gRGF2aWVzLCBodHRwczovL3d3dy5qYXNvbmRhdmllcy5jb20vd29yZGNsb3VkL1xuLy8gQWxnb3JpdGhtIGR1ZSB0byBKb25hdGhhbiBGZWluYmVyZywgaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL3N0YXRpYy5tcmZlaW5iZXJnLmNvbS9idl9jaDAzLnBkZlxuXG5jb25zdCBkaXNwYXRjaCA9IHJlcXVpcmUoXCJkMy1kaXNwYXRjaFwiKS5kaXNwYXRjaDtcblxuY29uc3QgUkFESUFOUyA9IE1hdGguUEkgLyAxODA7XG5cbmNvbnN0IFNQSVJBTFMgPSB7XG4gIGFyY2hpbWVkZWFuOiBhcmNoaW1lZGVhblNwaXJhbCxcbiAgcmVjdGFuZ3VsYXI6IHJlY3Rhbmd1bGFyU3BpcmFsXG59O1xuXG5jb25zdCBjdyA9IDEgPDwgMTEgPj4gNTtcbmNvbnN0IGNoID0gMSA8PCAxMTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNpemUgPSBbMjU2LCAyNTZdLFxuICAgICAgdGV4dCA9IGNsb3VkVGV4dCxcbiAgICAgIGZvbnQgPSBjbG91ZEZvbnQsXG4gICAgICBmb250U2l6ZSA9IGNsb3VkRm9udFNpemUsXG4gICAgICBmb250U3R5bGUgPSBjbG91ZEZvbnROb3JtYWwsXG4gICAgICBmb250V2VpZ2h0ID0gY2xvdWRGb250Tm9ybWFsLFxuICAgICAgcGFkZGluZyA9IGNsb3VkUGFkZGluZyxcbiAgICAgIHNwaXJhbCA9IGFyY2hpbWVkZWFuU3BpcmFsLFxuICAgICAgd29yZHMgPSBbXSxcbiAgICAgIHRpbWVJbnRlcnZhbCA9IEluZmluaXR5LFxuICAgICAgZXZlbnQgPSBkaXNwYXRjaChcIndvcmRcIiwgXCJlbmRcIiksXG4gICAgICB0aW1lciA9IG51bGwsXG4gICAgICByYW5kb20gPSBNYXRoLnJhbmRvbSxcbiAgICAgIHJvdGF0ZSA9ICgpID0+ICh+fihyYW5kb20oKSAqIDYpIC0gMykgKiAzMCxcbiAgICAgIGNsb3VkID0ge30sXG4gICAgICBjYW52YXMgPSBjbG91ZENhbnZhcztcblxuICBjbG91ZC5jYW52YXMgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2FudmFzID0gZnVuY3RvcihfKSwgY2xvdWQpIDogY2FudmFzO1xuICB9O1xuXG4gIGNsb3VkLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRleHRBbmRSYXRpbyA9IGdldENvbnRleHQoY2FudmFzKCkpLFxuICAgICAgICBib2FyZCA9IHplcm9BcnJheSgoc2l6ZVswXSA+PiA1KSAqIHNpemVbMV0pLFxuICAgICAgICBib3VuZHMgPSBudWxsLFxuICAgICAgICBuID0gd29yZHMubGVuZ3RoLFxuICAgICAgICBpID0gLTEsXG4gICAgICAgIHRhZ3MgPSBbXSxcbiAgICAgICAgZGF0YSA9IHdvcmRzLm1hcChmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgZC50ZXh0ID0gdGV4dC5jYWxsKHRoaXMsIGQsIGkpO1xuICAgICAgICAgIGQuZm9udCA9IGZvbnQuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgICBkLnN0eWxlID0gZm9udFN0eWxlLmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgZC53ZWlnaHQgPSBmb250V2VpZ2h0LmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgZC5yb3RhdGUgPSByb3RhdGUuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgICBkLnNpemUgPSB+fmZvbnRTaXplLmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgZC5wYWRkaW5nID0gcGFkZGluZy5jYWxsKHRoaXMsIGQsIGkpO1xuICAgICAgICAgIHJldHVybiBkO1xuICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGIuc2l6ZSAtIGEuc2l6ZTsgfSk7XG5cbiAgICBpZiAodGltZXIpIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwoc3RlcCwgMCk7XG4gICAgc3RlcCgpO1xuXG4gICAgcmV0dXJuIGNsb3VkO1xuXG4gICAgZnVuY3Rpb24gc3RlcCgpIHtcbiAgICAgIHZhciBzdGFydCA9IERhdGUubm93KCk7XG4gICAgICB3aGlsZSAoRGF0ZS5ub3coKSAtIHN0YXJ0IDwgdGltZUludGVydmFsICYmICsraSA8IG4gJiYgdGltZXIpIHtcbiAgICAgICAgdmFyIGQgPSBkYXRhW2ldO1xuICAgICAgICBkLnggPSAoc2l6ZVswXSAqIChyYW5kb20oKSArIC41KSkgPj4gMTtcbiAgICAgICAgZC55ID0gKHNpemVbMV0gKiAocmFuZG9tKCkgKyAuNSkpID4+IDE7XG4gICAgICAgIGNsb3VkU3ByaXRlKGNvbnRleHRBbmRSYXRpbywgZCwgZGF0YSwgaSk7XG4gICAgICAgIGlmIChkLmhhc1RleHQgJiYgcGxhY2UoYm9hcmQsIGQsIGJvdW5kcykpIHtcbiAgICAgICAgICB0YWdzLnB1c2goZCk7XG4gICAgICAgICAgZXZlbnQuY2FsbChcIndvcmRcIiwgY2xvdWQsIGQpO1xuICAgICAgICAgIGlmIChib3VuZHMpIGNsb3VkQm91bmRzKGJvdW5kcywgZCk7XG4gICAgICAgICAgZWxzZSBib3VuZHMgPSBbe3g6IGQueCArIGQueDAsIHk6IGQueSArIGQueTB9LCB7eDogZC54ICsgZC54MSwgeTogZC55ICsgZC55MX1dO1xuICAgICAgICAgIC8vIFRlbXBvcmFyeSBoYWNrXG4gICAgICAgICAgZC54IC09IHNpemVbMF0gPj4gMTtcbiAgICAgICAgICBkLnkgLT0gc2l6ZVsxXSA+PiAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaSA+PSBuKSB7XG4gICAgICAgIGNsb3VkLnN0b3AoKTtcbiAgICAgICAgZXZlbnQuY2FsbChcImVuZFwiLCBjbG91ZCwgdGFncywgYm91bmRzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG91ZC5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgIHRpbWVyID0gbnVsbDtcbiAgICB9XG4gICAgZm9yIChjb25zdCBkIG9mIHdvcmRzKSB7XG4gICAgICBkZWxldGUgZC5zcHJpdGU7XG4gICAgfVxuICAgIHJldHVybiBjbG91ZDtcbiAgfTtcblxuICBmdW5jdGlvbiBnZXRDb250ZXh0KGNhbnZhcykge1xuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIsIHt3aWxsUmVhZEZyZXF1ZW50bHk6IHRydWV9KTtcblxuICAgIGNhbnZhcy53aWR0aCA9IGNhbnZhcy5oZWlnaHQgPSAxO1xuICAgIGNvbnN0IHJhdGlvID0gTWF0aC5zcXJ0KGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIDEsIDEpLmRhdGEubGVuZ3RoID4+IDIpO1xuICAgIGNhbnZhcy53aWR0aCA9IChjdyA8PCA1KSAvIHJhdGlvO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBjaCAvIHJhdGlvO1xuXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBjb250ZXh0LnN0cm9rZVN0eWxlID0gXCJyZWRcIjtcblxuICAgIHJldHVybiB7Y29udGV4dCwgcmF0aW99O1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2UoYm9hcmQsIHRhZywgYm91bmRzKSB7XG4gICAgdmFyIHBlcmltZXRlciA9IFt7eDogMCwgeTogMH0sIHt4OiBzaXplWzBdLCB5OiBzaXplWzFdfV0sXG4gICAgICAgIHN0YXJ0WCA9IHRhZy54LFxuICAgICAgICBzdGFydFkgPSB0YWcueSxcbiAgICAgICAgbWF4RGVsdGEgPSBNYXRoLnNxcnQoc2l6ZVswXSAqIHNpemVbMF0gKyBzaXplWzFdICogc2l6ZVsxXSksXG4gICAgICAgIHMgPSBzcGlyYWwoc2l6ZSksXG4gICAgICAgIGR0ID0gcmFuZG9tKCkgPCAuNSA/IDEgOiAtMSxcbiAgICAgICAgdCA9IC1kdCxcbiAgICAgICAgZHhkeSxcbiAgICAgICAgZHgsXG4gICAgICAgIGR5O1xuXG4gICAgd2hpbGUgKGR4ZHkgPSBzKHQgKz0gZHQpKSB7XG4gICAgICBkeCA9IH5+ZHhkeVswXTtcbiAgICAgIGR5ID0gfn5keGR5WzFdO1xuXG4gICAgICBpZiAoTWF0aC5taW4oTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpID49IG1heERlbHRhKSBicmVhaztcblxuICAgICAgdGFnLnggPSBzdGFydFggKyBkeDtcbiAgICAgIHRhZy55ID0gc3RhcnRZICsgZHk7XG5cbiAgICAgIGlmICh0YWcueCArIHRhZy54MCA8IDAgfHwgdGFnLnkgKyB0YWcueTAgPCAwIHx8XG4gICAgICAgICAgdGFnLnggKyB0YWcueDEgPiBzaXplWzBdIHx8IHRhZy55ICsgdGFnLnkxID4gc2l6ZVsxXSkgY29udGludWU7XG4gICAgICAvLyBUT0RPIG9ubHkgY2hlY2sgZm9yIGNvbGxpc2lvbnMgd2l0aGluIGN1cnJlbnQgYm91bmRzLlxuICAgICAgaWYgKCFib3VuZHMgfHwgY29sbGlkZVJlY3RzKHRhZywgYm91bmRzKSkge1xuICAgICAgICBpZiAoIWNsb3VkQ29sbGlkZSh0YWcsIGJvYXJkLCBzaXplWzBdKSkge1xuICAgICAgICAgIHZhciBzcHJpdGUgPSB0YWcuc3ByaXRlLFxuICAgICAgICAgICAgICB3ID0gdGFnLndpZHRoID4+IDUsXG4gICAgICAgICAgICAgIHN3ID0gc2l6ZVswXSA+PiA1LFxuICAgICAgICAgICAgICBseCA9IHRhZy54IC0gKHcgPDwgNCksXG4gICAgICAgICAgICAgIHN4ID0gbHggJiAweDdmLFxuICAgICAgICAgICAgICBtc3ggPSAzMiAtIHN4LFxuICAgICAgICAgICAgICBoID0gdGFnLnkxIC0gdGFnLnkwLFxuICAgICAgICAgICAgICB4ID0gKHRhZy55ICsgdGFnLnkwKSAqIHN3ICsgKGx4ID4+IDUpLFxuICAgICAgICAgICAgICBsYXN0O1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaDsgaisrKSB7XG4gICAgICAgICAgICBsYXN0ID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHc7IGkrKykge1xuICAgICAgICAgICAgICBib2FyZFt4ICsgaV0gfD0gKGxhc3QgPDwgbXN4KSB8IChpIDwgdyA/IChsYXN0ID0gc3ByaXRlW2ogKiB3ICsgaV0pID4+PiBzeCA6IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeCArPSBzdztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY2xvdWQudGltZUludGVydmFsID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRpbWVJbnRlcnZhbCA9IF8gPT0gbnVsbCA/IEluZmluaXR5IDogXywgY2xvdWQpIDogdGltZUludGVydmFsO1xuICB9O1xuXG4gIGNsb3VkLndvcmRzID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHdvcmRzID0gXywgY2xvdWQpIDogd29yZHM7XG4gIH07XG5cbiAgY2xvdWQuc2l6ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzaXplID0gWytfWzBdLCArX1sxXV0sIGNsb3VkKSA6IHNpemU7XG4gIH07XG5cbiAgY2xvdWQuZm9udCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmb250ID0gZnVuY3RvcihfKSwgY2xvdWQpIDogZm9udDtcbiAgfTtcblxuICBjbG91ZC5mb250U3R5bGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZm9udFN0eWxlID0gZnVuY3RvcihfKSwgY2xvdWQpIDogZm9udFN0eWxlO1xuICB9O1xuXG4gIGNsb3VkLmZvbnRXZWlnaHQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZm9udFdlaWdodCA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IGZvbnRXZWlnaHQ7XG4gIH07XG5cbiAgY2xvdWQucm90YXRlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJvdGF0ZSA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IHJvdGF0ZTtcbiAgfTtcblxuICBjbG91ZC50ZXh0ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRleHQgPSBmdW5jdG9yKF8pLCBjbG91ZCkgOiB0ZXh0O1xuICB9O1xuXG4gIGNsb3VkLnNwaXJhbCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzcGlyYWwgPSBTUElSQUxTW19dIHx8IF8sIGNsb3VkKSA6IHNwaXJhbDtcbiAgfTtcblxuICBjbG91ZC5mb250U2l6ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmb250U2l6ZSA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IGZvbnRTaXplO1xuICB9O1xuXG4gIGNsb3VkLnBhZGRpbmcgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocGFkZGluZyA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IHBhZGRpbmc7XG4gIH07XG5cbiAgY2xvdWQucmFuZG9tID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJhbmRvbSA9IF8sIGNsb3VkKSA6IHJhbmRvbTtcbiAgfTtcblxuICBjbG91ZC5vbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZSA9IGV2ZW50Lm9uLmFwcGx5KGV2ZW50LCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gZXZlbnQgPyBjbG91ZCA6IHZhbHVlO1xuICB9O1xuXG4gIHJldHVybiBjbG91ZDtcbn07XG5cbmZ1bmN0aW9uIGNsb3VkVGV4dChkKSB7XG4gIHJldHVybiBkLnRleHQ7XG59XG5cbmZ1bmN0aW9uIGNsb3VkRm9udCgpIHtcbiAgcmV0dXJuIFwic2VyaWZcIjtcbn1cblxuZnVuY3Rpb24gY2xvdWRGb250Tm9ybWFsKCkge1xuICByZXR1cm4gXCJub3JtYWxcIjtcbn1cblxuZnVuY3Rpb24gY2xvdWRGb250U2l6ZShkKSB7XG4gIHJldHVybiBNYXRoLnNxcnQoZC52YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGNsb3VkUGFkZGluZygpIHtcbiAgcmV0dXJuIDE7XG59XG5cbi8vIEZldGNoZXMgYSBtb25vY2hyb21lIHNwcml0ZSBiaXRtYXAgZm9yIHRoZSBzcGVjaWZpZWQgdGV4dC5cbi8vIExvYWQgaW4gYmF0Y2hlcyBmb3Igc3BlZWQuXG5mdW5jdGlvbiBjbG91ZFNwcml0ZShjb250ZXh0QW5kUmF0aW8sIGQsIGRhdGEsIGRpKSB7XG4gIGlmIChkLnNwcml0ZSkgcmV0dXJuO1xuICB2YXIgYyA9IGNvbnRleHRBbmRSYXRpby5jb250ZXh0LFxuICAgICAgcmF0aW8gPSBjb250ZXh0QW5kUmF0aW8ucmF0aW87XG5cbiAgYy5jbGVhclJlY3QoMCwgMCwgKGN3IDw8IDUpIC8gcmF0aW8sIGNoIC8gcmF0aW8pO1xuICB2YXIgeCA9IDAsXG4gICAgICB5ID0gMCxcbiAgICAgIG1heGggPSAwLFxuICAgICAgbiA9IGRhdGEubGVuZ3RoO1xuICAtLWRpO1xuICB3aGlsZSAoKytkaSA8IG4pIHtcbiAgICBkID0gZGF0YVtkaV07XG4gICAgYy5zYXZlKCk7XG4gICAgYy5mb250ID0gZC5zdHlsZSArIFwiIFwiICsgZC53ZWlnaHQgKyBcIiBcIiArIH5+KChkLnNpemUgKyAxKSAvIHJhdGlvKSArIFwicHggXCIgKyBkLmZvbnQ7XG4gICAgY29uc3QgbWV0cmljcyA9IGMubWVhc3VyZVRleHQoZC50ZXh0KTtcbiAgICBjb25zdCBhbmNob3IgPSAtTWF0aC5mbG9vcihtZXRyaWNzLndpZHRoIC8gMik7XG4gICAgbGV0IHcgPSAobWV0cmljcy53aWR0aCArIDEpICogcmF0aW87XG4gICAgbGV0IGggPSBkLnNpemUgPDwgMTtcbiAgICBpZiAoZC5yb3RhdGUpIHtcbiAgICAgIHZhciBzciA9IE1hdGguc2luKGQucm90YXRlICogUkFESUFOUyksXG4gICAgICAgICAgY3IgPSBNYXRoLmNvcyhkLnJvdGF0ZSAqIFJBRElBTlMpLFxuICAgICAgICAgIHdjciA9IHcgKiBjcixcbiAgICAgICAgICB3c3IgPSB3ICogc3IsXG4gICAgICAgICAgaGNyID0gaCAqIGNyLFxuICAgICAgICAgIGhzciA9IGggKiBzcjtcbiAgICAgIHcgPSAoTWF0aC5tYXgoTWF0aC5hYnMod2NyICsgaHNyKSwgTWF0aC5hYnMod2NyIC0gaHNyKSkgKyAweDFmKSA+PiA1IDw8IDU7XG4gICAgICBoID0gfn5NYXRoLm1heChNYXRoLmFicyh3c3IgKyBoY3IpLCBNYXRoLmFicyh3c3IgLSBoY3IpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdyA9ICh3ICsgMHgxZikgPj4gNSA8PCA1O1xuICAgIH1cbiAgICBpZiAoaCA+IG1heGgpIG1heGggPSBoO1xuICAgIGlmICh4ICsgdyA+PSAoY3cgPDwgNSkpIHtcbiAgICAgIHggPSAwO1xuICAgICAgeSArPSBtYXhoO1xuICAgICAgbWF4aCA9IDA7XG4gICAgfVxuICAgIGlmICh5ICsgaCA+PSBjaCkgYnJlYWs7XG4gICAgYy50cmFuc2xhdGUoKHggKyAodyA+PiAxKSkgLyByYXRpbywgKHkgKyAoaCA+PiAxKSkgLyByYXRpbyk7XG4gICAgaWYgKGQucm90YXRlKSBjLnJvdGF0ZShkLnJvdGF0ZSAqIFJBRElBTlMpO1xuICAgIGMuZmlsbFRleHQoZC50ZXh0LCBhbmNob3IsIDApO1xuICAgIGlmIChkLnBhZGRpbmcpIGMubGluZVdpZHRoID0gMiAqIGQucGFkZGluZywgYy5zdHJva2VUZXh0KGQudGV4dCwgYW5jaG9yLCAwKTtcbiAgICBjLnJlc3RvcmUoKTtcbiAgICBkLndpZHRoID0gdztcbiAgICBkLmhlaWdodCA9IGg7XG4gICAgZC54b2ZmID0geDtcbiAgICBkLnlvZmYgPSB5O1xuICAgIGQueDEgPSB3ID4+IDE7XG4gICAgZC55MSA9IGggPj4gMTtcbiAgICBkLngwID0gLWQueDE7XG4gICAgZC55MCA9IC1kLnkxO1xuICAgIGQuaGFzVGV4dCA9IHRydWU7XG4gICAgeCArPSB3O1xuICB9XG4gIHZhciBwaXhlbHMgPSBjLmdldEltYWdlRGF0YSgwLCAwLCAoY3cgPDwgNSkgLyByYXRpbywgY2ggLyByYXRpbykuZGF0YSxcbiAgICAgIHNwcml0ZSA9IFtdO1xuICB3aGlsZSAoLS1kaSA+PSAwKSB7XG4gICAgZCA9IGRhdGFbZGldO1xuICAgIGlmICghZC5oYXNUZXh0KSBjb250aW51ZTtcbiAgICB2YXIgdyA9IGQud2lkdGgsXG4gICAgICAgIHczMiA9IHcgPj4gNSxcbiAgICAgICAgaCA9IGQueTEgLSBkLnkwO1xuICAgIC8vIFplcm8gdGhlIGJ1ZmZlclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaCAqIHczMjsgaSsrKSBzcHJpdGVbaV0gPSAwO1xuICAgIHggPSBkLnhvZmY7XG4gICAgaWYgKHggPT0gbnVsbCkgcmV0dXJuO1xuICAgIHkgPSBkLnlvZmY7XG4gICAgdmFyIHNlZW4gPSAwLFxuICAgICAgICBzZWVuUm93ID0gLTE7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBoOyBqKyspIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdzsgaSsrKSB7XG4gICAgICAgIHZhciBrID0gdzMyICogaiArIChpID4+IDUpLFxuICAgICAgICAgICAgbSA9IHBpeGVsc1soKHkgKyBqKSAqIChjdyA8PCA1KSArICh4ICsgaSkpIDw8IDJdID8gMSA8PCAoMzEgLSAoaSAlIDMyKSkgOiAwO1xuICAgICAgICBzcHJpdGVba10gfD0gbTtcbiAgICAgICAgc2VlbiB8PSBtO1xuICAgICAgfVxuICAgICAgaWYgKHNlZW4pIHNlZW5Sb3cgPSBqO1xuICAgICAgZWxzZSB7XG4gICAgICAgIGQueTArKztcbiAgICAgICAgaC0tO1xuICAgICAgICBqLS07XG4gICAgICAgIHkrKztcbiAgICAgIH1cbiAgICB9XG4gICAgZC55MSA9IGQueTAgKyBzZWVuUm93O1xuICAgIGQuc3ByaXRlID0gc3ByaXRlLnNsaWNlKDAsIChkLnkxIC0gZC55MCkgKiB3MzIpO1xuICB9XG59XG5cbi8vIFVzZSBtYXNrLWJhc2VkIGNvbGxpc2lvbiBkZXRlY3Rpb24uXG5mdW5jdGlvbiBjbG91ZENvbGxpZGUodGFnLCBib2FyZCwgc3cpIHtcbiAgc3cgPj49IDU7XG4gIHZhciBzcHJpdGUgPSB0YWcuc3ByaXRlLFxuICAgICAgdyA9IHRhZy53aWR0aCA+PiA1LFxuICAgICAgbHggPSB0YWcueCAtICh3IDw8IDQpLFxuICAgICAgc3ggPSBseCAmIDB4N2YsXG4gICAgICBtc3ggPSAzMiAtIHN4LFxuICAgICAgaCA9IHRhZy55MSAtIHRhZy55MCxcbiAgICAgIHggPSAodGFnLnkgKyB0YWcueTApICogc3cgKyAobHggPj4gNSksXG4gICAgICBsYXN0O1xuICBmb3IgKHZhciBqID0gMDsgaiA8IGg7IGorKykge1xuICAgIGxhc3QgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHc7IGkrKykge1xuICAgICAgaWYgKCgobGFzdCA8PCBtc3gpIHwgKGkgPCB3ID8gKGxhc3QgPSBzcHJpdGVbaiAqIHcgKyBpXSkgPj4+IHN4IDogMCkpXG4gICAgICAgICAgJiBib2FyZFt4ICsgaV0pIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB4ICs9IHN3O1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY2xvdWRCb3VuZHMoYm91bmRzLCBkKSB7XG4gIHZhciBiMCA9IGJvdW5kc1swXSxcbiAgICAgIGIxID0gYm91bmRzWzFdO1xuICBpZiAoZC54ICsgZC54MCA8IGIwLngpIGIwLnggPSBkLnggKyBkLngwO1xuICBpZiAoZC55ICsgZC55MCA8IGIwLnkpIGIwLnkgPSBkLnkgKyBkLnkwO1xuICBpZiAoZC54ICsgZC54MSA+IGIxLngpIGIxLnggPSBkLnggKyBkLngxO1xuICBpZiAoZC55ICsgZC55MSA+IGIxLnkpIGIxLnkgPSBkLnkgKyBkLnkxO1xufVxuXG5mdW5jdGlvbiBjb2xsaWRlUmVjdHMoYSwgYikge1xuICByZXR1cm4gYS54ICsgYS54MSA+IGJbMF0ueCAmJiBhLnggKyBhLngwIDwgYlsxXS54ICYmIGEueSArIGEueTEgPiBiWzBdLnkgJiYgYS55ICsgYS55MCA8IGJbMV0ueTtcbn1cblxuZnVuY3Rpb24gYXJjaGltZWRlYW5TcGlyYWwoc2l6ZSkge1xuICB2YXIgZSA9IHNpemVbMF0gLyBzaXplWzFdO1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBbZSAqICh0ICo9IC4xKSAqIE1hdGguY29zKHQpLCB0ICogTWF0aC5zaW4odCldO1xuICB9O1xufVxuXG5mdW5jdGlvbiByZWN0YW5ndWxhclNwaXJhbChzaXplKSB7XG4gIHZhciBkeSA9IDQsXG4gICAgICBkeCA9IGR5ICogc2l6ZVswXSAvIHNpemVbMV0sXG4gICAgICB4ID0gMCxcbiAgICAgIHkgPSAwO1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHZhciBzaWduID0gdCA8IDAgPyAtMSA6IDE7XG4gICAgLy8gU2VlIHRyaWFuZ3VsYXIgbnVtYmVyczogVF9uID0gbiAqIChuICsgMSkgLyAyLlxuICAgIHN3aXRjaCAoKE1hdGguc3FydCgxICsgNCAqIHNpZ24gKiB0KSAtIHNpZ24pICYgMykge1xuICAgICAgY2FzZSAwOiAgeCArPSBkeDsgYnJlYWs7XG4gICAgICBjYXNlIDE6ICB5ICs9IGR5OyBicmVhaztcbiAgICAgIGNhc2UgMjogIHggLT0gZHg7IGJyZWFrO1xuICAgICAgZGVmYXVsdDogeSAtPSBkeTsgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBbeCwgeV07XG4gIH07XG59XG5cbi8vIFRPRE8gcmV1c2UgYXJyYXlzP1xuZnVuY3Rpb24gemVyb0FycmF5KG4pIHtcbiAgdmFyIGEgPSBbXSxcbiAgICAgIGkgPSAtMTtcbiAgd2hpbGUgKCsraSA8IG4pIGFbaV0gPSAwO1xuICByZXR1cm4gYTtcbn1cblxuZnVuY3Rpb24gY2xvdWRDYW52YXMoKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xufVxuXG5mdW5jdGlvbiBmdW5jdG9yKGQpIHtcbiAgcmV0dXJuIHR5cGVvZiBkID09PSBcImZ1bmN0aW9uXCIgPyBkIDogZnVuY3Rpb24oKSB7IHJldHVybiBkOyB9O1xufVxuIiwgImltcG9ydCB7IE1hcmtkb3duVmlldywgUGx1Z2luLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQsIFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VEIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgcmVnaXN0ZXJFbWJlZGRlZFdvcmRDbG91ZFByb2Nlc3NvciB9IGZyb20gJy4vYmxvY2stcmVuZGVyZXJzL3dvcmRjbG91ZC1ibG9jay1yZW5kZXJlcic7XG5pbXBvcnQgeyBvcGVuU2VhcmNoRm9yV29yZCB9IGZyb20gJy4vYWN0aW9ucy9hcHBseS1zZWFyY2gnO1xuaW1wb3J0IHsgV29yZENsb3VkUHJvY2Vzc29yIH0gZnJvbSAnLi9wcm9jZXNzaW5nL3Byb2Nlc3Nvcic7XG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTLCBWYXVsdFdvcmRDbG91ZFNldHRpbmdUYWIsIHR5cGUgV29yZENsb3VkU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJztcbmltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFNlYXJjaE9wdGlvbnMsIFRhZ01hdGNoTW9kZSwgV29yZENsb3VkUmVuZGVyT3B0aW9ucywgV29yZENsb3VkU2VydmljZXMsIFdlaWdodGVkV29yZCB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgZHJhd1dvcmRDbG91ZCB9IGZyb20gJy4vcmVuZGVyaW5nL3dvcmQtY2xvdWQtcmVuZGVyZXInO1xuaW1wb3J0IHsgTm90ZVdvcmRDbG91ZFZpZXcgfSBmcm9tICcuL3ZpZXdzL25vdGUtd29yZC1jbG91ZC12aWV3JztcbmltcG9ydCB7IFZhdWx0V29yZENsb3VkVmlldyB9IGZyb20gJy4vdmlld3MvdmF1bHQtd29yZC1jbG91ZC12aWV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmF1bHRXb3JkQ2xvdWRQbHVnaW4gZXh0ZW5kcyBQbHVnaW4gaW1wbGVtZW50cyBXb3JkQ2xvdWRTZXJ2aWNlcyB7XG4gIHNldHRpbmdzOiBXb3JkQ2xvdWRTZXR0aW5ncyA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUyB9O1xuICBwcml2YXRlIHByb2Nlc3NvciE6IFdvcmRDbG91ZFByb2Nlc3NvcjtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLnByb2Nlc3NvciA9IG5ldyBXb3JkQ2xvdWRQcm9jZXNzb3IodGhpcy5hcHApO1xuXG4gICAgdGhpcy5yZWdpc3RlclZpZXcoVklFV19UWVBFX1ZBVUxUX1dPUkRfQ0xPVUQsIChsZWFmKSA9PiBuZXcgVmF1bHRXb3JkQ2xvdWRWaWV3KGxlYWYsIHRoaXMpKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhWSUVXX1RZUEVfTk9URV9XT1JEX0NMT1VELCAobGVhZikgPT4gbmV3IE5vdGVXb3JkQ2xvdWRWaWV3KGxlYWYsIHRoaXMpKTtcbiAgICByZWdpc3RlckVtYmVkZGVkV29yZENsb3VkUHJvY2Vzc29yKHRoaXMsIHRoaXMpO1xuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgVmF1bHRXb3JkQ2xvdWRTZXR0aW5nVGFiKHRoaXMpKTtcblxuICAgIHRoaXMuYWRkUmliYm9uSWNvbignY2xvdWQnLCAnT3BlbiB3b3JkIGNsb3VkcycsICgpID0+IHtcbiAgICAgIHZvaWQgdGhpcy5hY3RpdmF0ZVZhdWx0V29yZENsb3VkVmlldygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiAnb3Blbi12YXVsdC13b3JkLWNsb3VkLXZpZXcnLFxuICAgICAgbmFtZTogJ09wZW4gdmF1bHQgd29yZCBjbG91ZCcsXG4gICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICB2b2lkIHRoaXMuYWN0aXZhdGVWYXVsdFdvcmRDbG91ZFZpZXcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6ICdvcGVuLW5vdGUtd29yZC1jbG91ZC1zaWRlYmFyJyxcbiAgICAgIG5hbWU6ICdPcGVuIGN1cnJlbnQgbm90ZSB3b3JkIGNsb3VkJyxcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgIHZvaWQgdGhpcy5hY3RpdmF0ZU5vdGVXb3JkQ2xvdWRWaWV3KCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgb251bmxvYWQoKTogdm9pZCB7XG4gICAgLy8gT2JzaWRpYW4gYXV0b21hdGljYWxseSBkZXRhY2hlcyB2aWV3cyByZWdpc3RlcmVkIGJ5IHRoaXMgcGx1Z2luLlxuICB9XG5cbiAgYXN5bmMgYWN0aXZhdGVWYXVsdFdvcmRDbG91ZFZpZXcoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xuICAgIGNvbnN0IGV4aXN0aW5nTGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFX1ZBVUxUX1dPUkRfQ0xPVUQpWzBdO1xuXG4gICAgY29uc3QgbGVhZiA9IGV4aXN0aW5nTGVhZiA/PyB3b3Jrc3BhY2UuZ2V0TGVhZih0cnVlKTtcbiAgICBhd2FpdCBsZWFmLnNldFZpZXdTdGF0ZSh7XG4gICAgICB0eXBlOiBWSUVXX1RZUEVfVkFVTFRfV09SRF9DTE9VRCxcbiAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgYXN5bmMgYWN0aXZhdGVOb3RlV29yZENsb3VkVmlldygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XG4gICAgY29uc3QgZXhpc3RpbmdMZWFmID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEVfTk9URV9XT1JEX0NMT1VEKVswXTtcblxuICAgIGNvbnN0IGxlYWYgPSBleGlzdGluZ0xlYWYgPz8gd29ya3NwYWNlLmdldFJpZ2h0TGVhZihmYWxzZSk7XG4gICAgaWYgKCFsZWFmKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoe1xuICAgICAgdHlwZTogVklFV19UWVBFX05PVEVfV09SRF9DTE9VRCxcbiAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHdvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgZ2V0QXZhaWxhYmxlVGFncygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMucHJvY2Vzc29yLmdldEF2YWlsYWJsZVRhZ3MoKTtcbiAgfVxuXG4gIGdldE9wZW5NYXJrZG93bkZpbGVzKCk6IFRGaWxlW10ge1xuICAgIGNvbnN0IGZpbGVzID0gbmV3IE1hcDxzdHJpbmcsIFRGaWxlPigpO1xuXG4gICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ21hcmtkb3duJykpIHtcbiAgICAgIGNvbnN0IHZpZXcgPSBsZWFmLnZpZXc7XG4gICAgICBpZiAodmlldyBpbnN0YW5jZW9mIE1hcmtkb3duVmlldyAmJiB2aWV3LmZpbGUpIHtcbiAgICAgICAgZmlsZXMuc2V0KHZpZXcuZmlsZS5wYXRoLCB2aWV3LmZpbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmIChhY3RpdmVGaWxlKSB7XG4gICAgICBmaWxlcy5zZXQoYWN0aXZlRmlsZS5wYXRoLCBhY3RpdmVGaWxlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gWy4uLmZpbGVzLnZhbHVlcygpXS5zb3J0KChhLCBiKSA9PiBhLnBhdGgubG9jYWxlQ29tcGFyZShiLnBhdGgpKTtcbiAgfVxuXG4gIGdldEFjdGl2ZUZpbGUoKTogVEZpbGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgfVxuXG4gIGFzeW5jIGNvbGxlY3RWYXVsdFdvcmRzKFxuICAgIHRhZ0ZpbHRlcnM6IHN0cmluZ1tdLFxuICAgIHRhZ01hdGNoTW9kZTogVGFnTWF0Y2hNb2RlLFxuICAgIG9uUHJvZ3Jlc3M/OiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQsXG4gICk6IFByb21pc2U8V2VpZ2h0ZWRXb3JkW10+IHtcbiAgICBjb25zdCBhbGxNYXJrZG93bkZpbGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xuICAgIHJldHVybiB0aGlzLnByb2Nlc3Nvci5jb2xsZWN0RnJvbUZpbGVzKFxuICAgICAgYWxsTWFya2Rvd25GaWxlcyxcbiAgICAgIHRoaXMuZ2V0QmxhY2tsaXN0U2V0KCksXG4gICAgICB0aGlzLnNldHRpbmdzLnJlbmRlcixcbiAgICAgIG9uUHJvZ3Jlc3MsXG4gICAgICB7XG4gICAgICAgIHRhZ0ZpbHRlcnMsXG4gICAgICAgIHRhZ01hdGNoTW9kZSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGNvbGxlY3RGaWxlV29yZHMoZmlsZTogVEZpbGUsIG9uUHJvZ3Jlc3M/OiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQpOiBQcm9taXNlPFdlaWdodGVkV29yZFtdPiB7XG4gICAgcmV0dXJuIHRoaXMucHJvY2Vzc29yLmNvbGxlY3RGcm9tRmlsZXMoW2ZpbGVdLCB0aGlzLmdldEJsYWNrbGlzdFNldCgpLCB0aGlzLnNldHRpbmdzLnJlbmRlciwgb25Qcm9ncmVzcyk7XG4gIH1cblxuICBhc3luYyBkcmF3V29yZENsb3VkKG9wdGlvbnM6IFdvcmRDbG91ZFJlbmRlck9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gZHJhd1dvcmRDbG91ZChvcHRpb25zLCB0aGlzLnNldHRpbmdzLnJlbmRlcik7XG4gIH1cblxuICBhc3luYyBvcGVuU2VhcmNoRm9yV29yZCh3b3JkOiBzdHJpbmcsIG9wdGlvbnM6IFNlYXJjaE9wdGlvbnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBvcGVuU2VhcmNoRm9yV29yZCh0aGlzLmFwcCwgd29yZCwgb3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbG9hZGVkID0gYXdhaXQgdGhpcy5sb2FkRGF0YSgpO1xuICAgIGNvbnN0IGxvYWRlZEJsYWNrbGlzdCA9IGxvYWRlZD8uYmxhY2tsaXN0V29yZHM7XG4gICAgY29uc3QgbG9hZGVkUmVuZGVyID0gbG9hZGVkPy5yZW5kZXI7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHtcbiAgICAgIGJsYWNrbGlzdFdvcmRzOiB0aGlzLm5vcm1hbGl6ZUJsYWNrbGlzdFdvcmRzKGxvYWRlZEJsYWNrbGlzdCksXG4gICAgICByZW5kZXI6IHRoaXMubm9ybWFsaXplUmVuZGVyU2V0dGluZ3MobG9hZGVkUmVuZGVyKSxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gIH1cblxuICBhc3luYyBhZGRCbGFja2xpc3RXb3JkKHJhd1dvcmQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRXb3JkID0gdGhpcy5ub3JtYWxpemVCbGFja2xpc3RXb3JkKHJhd1dvcmQpO1xuICAgIGlmICghbm9ybWFsaXplZFdvcmQgfHwgdGhpcy5zZXR0aW5ncy5ibGFja2xpc3RXb3Jkcy5pbmNsdWRlcyhub3JtYWxpemVkV29yZCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzID0gWy4uLnRoaXMuc2V0dGluZ3MuYmxhY2tsaXN0V29yZHMsIG5vcm1hbGl6ZWRXb3JkXTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlQmxhY2tsaXN0V29yZChyYXdXb3JkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBub3JtYWxpemVkV29yZCA9IHRoaXMubm9ybWFsaXplQmxhY2tsaXN0V29yZChyYXdXb3JkKTtcbiAgICB0aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzID0gdGhpcy5zZXR0aW5ncy5ibGFja2xpc3RXb3Jkcy5maWx0ZXIoKHdvcmQpID0+IHdvcmQgIT09IG5vcm1hbGl6ZWRXb3JkKTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgYXN5bmMgcmVzZXRCbGFja2xpc3RXb3JkcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzID0gWy4uLkRFRkFVTFRfU0VUVElOR1MuYmxhY2tsaXN0V29yZHNdO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVSZW5kZXJTZXR0aW5ncyhwYXRjaDogUGFydGlhbDxSZW5kZXJTZXR0aW5ncz4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBtZXJnZWQgPSB7XG4gICAgICAuLi50aGlzLnNldHRpbmdzLnJlbmRlcixcbiAgICAgIC4uLnBhdGNoLFxuICAgIH07XG4gICAgdGhpcy5zZXR0aW5ncy5yZW5kZXIgPSB0aGlzLm5vcm1hbGl6ZVJlbmRlclNldHRpbmdzKG1lcmdlZCk7XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIGFzeW5jIHJlc2V0UmVuZGVyU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5zZXR0aW5ncy5yZW5kZXIgPSB7IC4uLkRFRkFVTFRfU0VUVElOR1MucmVuZGVyIH07XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QmxhY2tsaXN0U2V0KCk6IFNldDxzdHJpbmc+IHtcbiAgICByZXR1cm4gbmV3IFNldCh0aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzLm1hcCgod29yZCkgPT4gdGhpcy5ub3JtYWxpemVCbGFja2xpc3RXb3JkKHdvcmQpKS5maWx0ZXIoQm9vbGVhbikpO1xuICB9XG5cbiAgcHJpdmF0ZSBub3JtYWxpemVCbGFja2xpc3RXb3JkcyhyYXdWYWx1ZTogdW5rbm93bik6IHN0cmluZ1tdIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocmF3VmFsdWUpKSB7XG4gICAgICByZXR1cm4gWy4uLkRFRkFVTFRfU0VUVElOR1MuYmxhY2tsaXN0V29yZHNdO1xuICAgIH1cblxuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJhd1ZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnc3RyaW5nJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB0aGlzLm5vcm1hbGl6ZUJsYWNrbGlzdFdvcmQoZW50cnkpO1xuICAgICAgaWYgKG5vcm1hbGl6ZWQpIHtcbiAgICAgICAgc2Vlbi5hZGQobm9ybWFsaXplZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZW4uc2l6ZSA+IDAgPyBbLi4uc2Vlbl0gOiBbLi4uREVGQVVMVF9TRVRUSU5HUy5ibGFja2xpc3RXb3Jkc107XG4gIH1cblxuICBwcml2YXRlIG5vcm1hbGl6ZUJsYWNrbGlzdFdvcmQod29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gd29yZC50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9ybWFsaXplUmVuZGVyU2V0dGluZ3MocmF3VmFsdWU6IHVua25vd24pOiBSZW5kZXJTZXR0aW5ncyB7XG4gICAgY29uc3QgcmF3ID0gKHJhd1ZhbHVlICYmIHR5cGVvZiByYXdWYWx1ZSA9PT0gJ29iamVjdCcpID8gcmF3VmFsdWUgYXMgUGFydGlhbDxSZW5kZXJTZXR0aW5ncz4gOiB7fTtcblxuICAgIGNvbnN0IHJvdGF0aW9uUHJlc2V0ID0gcmF3LnJvdGF0aW9uUHJlc2V0ID09PSAnaG9yaXpvbnRhbCdcbiAgICAgIHx8IHJhdy5yb3RhdGlvblByZXNldCA9PT0gJ21vc3RseS1ob3Jpem9udGFsJ1xuICAgICAgfHwgcmF3LnJvdGF0aW9uUHJlc2V0ID09PSAnbWl4ZWQnXG4gICAgICB8fCByYXcucm90YXRpb25QcmVzZXQgPT09ICd2ZXJ0aWNhbCdcbiAgICAgID8gcmF3LnJvdGF0aW9uUHJlc2V0XG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnJvdGF0aW9uUHJlc2V0O1xuXG4gICAgY29uc3Qgc3BpcmFsID0gcmF3LnNwaXJhbCA9PT0gJ2FyY2hpbWVkZWFuJyB8fCByYXcuc3BpcmFsID09PSAncmVjdGFuZ3VsYXInXG4gICAgICA/IHJhdy5zcGlyYWxcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuc3BpcmFsO1xuXG4gICAgY29uc3Qgd29yZFBhZGRpbmcgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy53b3JkUGFkZGluZywgMCwgMTIsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLndvcmRQYWRkaW5nKTtcbiAgICBjb25zdCBtaW5Gb250U2l6ZSA9IHRoaXMuY2xhbXBOdW1iZXIocmF3Lm1pbkZvbnRTaXplLCA4LCA2NCwgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIubWluRm9udFNpemUpO1xuICAgIGNvbnN0IG1heEZvbnRTaXplID0gdGhpcy5jbGFtcE51bWJlcihyYXcubWF4Rm9udFNpemUsIDE2LCAxNDAsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLm1heEZvbnRTaXplKTtcbiAgICBjb25zdCBzYWZlTWluRm9udFNpemUgPSBNYXRoLm1pbihtaW5Gb250U2l6ZSwgbWF4Rm9udFNpemUgLSAxKTtcbiAgICBjb25zdCBzYWZlTWF4Rm9udFNpemUgPSBNYXRoLm1heChtYXhGb250U2l6ZSwgc2FmZU1pbkZvbnRTaXplICsgMSk7XG5cbiAgICBjb25zdCBmb250RmFtaWx5ID0gdHlwZW9mIHJhdy5mb250RmFtaWx5ID09PSAnc3RyaW5nJyAmJiByYXcuZm9udEZhbWlseS50cmltKCkubGVuZ3RoID4gMFxuICAgICAgPyByYXcuZm9udEZhbWlseS50cmltKClcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuZm9udEZhbWlseTtcblxuICAgIGNvbnN0IHNjYWxpbmdNb2RlID0gcmF3LnNjYWxpbmdNb2RlID09PSAnbGluZWFyJ1xuICAgICAgfHwgcmF3LnNjYWxpbmdNb2RlID09PSAncG93ZXInXG4gICAgICB8fCByYXcuc2NhbGluZ01vZGUgPT09ICdsb2cnXG4gICAgICB8fCByYXcuc2NhbGluZ01vZGUgPT09ICdyYW5rJ1xuICAgICAgPyByYXcuc2NhbGluZ01vZGVcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuc2NhbGluZ01vZGU7XG5cbiAgICBjb25zdCBlbXBoYXNpcyA9IHRoaXMuY2xhbXBGbG9hdChyYXcuZW1waGFzaXMsIDAuNSwgMywgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuZW1waGFzaXMpO1xuXG4gICAgY29uc3Qgc2hvd0NvdW50SW5Xb3JkVGV4dCA9IHR5cGVvZiByYXcuc2hvd0NvdW50SW5Xb3JkVGV4dCA9PT0gJ2Jvb2xlYW4nXG4gICAgICA/IHJhdy5zaG93Q291bnRJbldvcmRUZXh0XG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnNob3dDb3VudEluV29yZFRleHQ7XG5cbiAgICBjb25zdCBjb3VudExhYmVsRm9ybWF0ID0gcmF3LmNvdW50TGFiZWxGb3JtYXQgPT09ICdwYXJlbidcbiAgICAgIHx8IHJhdy5jb3VudExhYmVsRm9ybWF0ID09PSAnZG90J1xuICAgICAgfHwgcmF3LmNvdW50TGFiZWxGb3JtYXQgPT09ICdjb2xvbidcbiAgICAgID8gcmF3LmNvdW50TGFiZWxGb3JtYXRcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuY291bnRMYWJlbEZvcm1hdDtcblxuICAgIGNvbnN0IGNvdW50TGFiZWxNaW5Db3VudCA9IHRoaXMuY2xhbXBOdW1iZXIocmF3LmNvdW50TGFiZWxNaW5Db3VudCwgMSwgMTAwLCBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5jb3VudExhYmVsTWluQ291bnQpO1xuXG4gICAgY29uc3QgcHJvZ3Jlc3NEZXRhaWwgPSByYXcucHJvZ3Jlc3NEZXRhaWwgPT09ICdtaW5pbWFsJ1xuICAgICAgfHwgcmF3LnByb2dyZXNzRGV0YWlsID09PSAnYmFsYW5jZWQnXG4gICAgICB8fCByYXcucHJvZ3Jlc3NEZXRhaWwgPT09ICdkZXRhaWxlZCdcbiAgICAgIHx8IHJhdy5wcm9ncmVzc0RldGFpbCA9PT0gJ3VuaGluZ2VkJ1xuICAgICAgPyByYXcucHJvZ3Jlc3NEZXRhaWxcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIucHJvZ3Jlc3NEZXRhaWw7XG5cbiAgICBjb25zdCBzY2FuQmF0Y2hTaXplID0gdGhpcy5jbGFtcE51bWJlcihyYXcuc2NhbkJhdGNoU2l6ZSwgOCwgNjQsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnNjYW5CYXRjaFNpemUpO1xuICAgIGNvbnN0IGxheW91dFRpbWVJbnRlcnZhbE1zID0gdGhpcy5jbGFtcE51bWJlcihcbiAgICAgIHJhdy5sYXlvdXRUaW1lSW50ZXJ2YWxNcyxcbiAgICAgIDgsXG4gICAgICA0MCxcbiAgICAgIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLmxheW91dFRpbWVJbnRlcnZhbE1zLFxuICAgICk7XG5cbiAgICBjb25zdCBkZXRlcm1pbmlzdGljTGF5b3V0ID0gdHlwZW9mIHJhdy5kZXRlcm1pbmlzdGljTGF5b3V0ID09PSAnYm9vbGVhbidcbiAgICAgID8gcmF3LmRldGVybWluaXN0aWNMYXlvdXRcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuZGV0ZXJtaW5pc3RpY0xheW91dDtcblxuICAgIGNvbnN0IHJhbmRvbVNlZWQgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy5yYW5kb21TZWVkLCAxLCAyMTQ3NDgzNjQ3LCBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5yYW5kb21TZWVkKTtcblxuICAgIHJldHVybiB7XG4gICAgICByb3RhdGlvblByZXNldCxcbiAgICAgIHNwaXJhbCxcbiAgICAgIHdvcmRQYWRkaW5nLFxuICAgICAgbWluRm9udFNpemU6IHNhZmVNaW5Gb250U2l6ZSxcbiAgICAgIG1heEZvbnRTaXplOiBzYWZlTWF4Rm9udFNpemUsXG4gICAgICBmb250RmFtaWx5LFxuICAgICAgc2NhbGluZ01vZGUsXG4gICAgICBlbXBoYXNpcyxcbiAgICAgIHNob3dDb3VudEluV29yZFRleHQsXG4gICAgICBjb3VudExhYmVsRm9ybWF0LFxuICAgICAgY291bnRMYWJlbE1pbkNvdW50LFxuICAgICAgcHJvZ3Jlc3NEZXRhaWwsXG4gICAgICBzY2FuQmF0Y2hTaXplLFxuICAgICAgbGF5b3V0VGltZUludGVydmFsTXMsXG4gICAgICBkZXRlcm1pbmlzdGljTGF5b3V0LFxuICAgICAgcmFuZG9tU2VlZCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBjbGFtcE51bWJlcih2YWx1ZTogdW5rbm93biwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyLCBmYWxsYmFjazogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fCBOdW1iZXIuaXNOYU4odmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgTWF0aC5yb3VuZCh2YWx1ZSkpKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xhbXBGbG9hdCh2YWx1ZTogdW5rbm93biwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyLCBmYWxsYmFjazogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fCBOdW1iZXIuaXNOYU4odmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgdmFsdWUpKTtcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBWSUVXX1RZUEVfVkFVTFRfV09SRF9DTE9VRCA9ICd2YXVsdC13b3JkLWNsb3VkLXZpZXcnO1xuZXhwb3J0IGNvbnN0IFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQgPSAnbm90ZS13b3JkLWNsb3VkLXZpZXcnO1xuZXhwb3J0IGNvbnN0IE1BWF9XT1JEUyA9IDE0MDtcbmV4cG9ydCBjb25zdCBNSU5fV09SRF9MRU5HVEggPSAzO1xuZXhwb3J0IGNvbnN0IEZST05UTUFUVEVSX1BBVFRFUk4gPSAvXi0tLVxccypcXG5bXFxzXFxTXSo/XFxuLS0tXFxzKig/OlxcbnwkKS87XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NUT1BfV09SRFM6IHN0cmluZ1tdID0gW1xuICAndGhlJywgJ2FuZCcsICdmb3InLCAndGhhdCcsICd0aGlzJywgJ3dpdGgnLCAnZnJvbScsICdhcmUnLCAnd2FzJywgJ3dlcmUnLCAnaGF2ZScsICdoYXMnLCAnaGFkJyxcbiAgJ3lvdScsICd5b3VyJywgJ3RoZXknLCAndGhlbScsICd0aGVpcicsICdpdHMnLCAnb3VyJywgJ291cnMnLCAnaGlzJywgJ2hlcicsICdzaGUnLCAnaGltJywgJ25vdCcsXG4gICdidXQnLCAnY2FuJywgJ3dpbGwnLCAnYWxsJywgJ2FueScsICdvbmUnLCAndHdvJywgJ3RvbycsICd1c2UnLCAndXNpbmcnLCAnaW50bycsICdvdXQnLCAnYWJvdXQnLFxuICAndGhlcmUnLCAndGhlbicsICd0aGFuJywgJ3doZW4nLCAnd2hhdCcsICd3aGVyZScsICd3aGljaCcsICd3aG8nLCAnd2hvbScsICdob3cnLCAnd2h5JywgJ2Fsc28nLFxuICAnanVzdCcsICdsaWtlJywgJ3NvbWUnLCAnbW9yZScsICdtb3N0JywgJ211Y2gnLCAnbWFueScsICd2ZXJ5JywgJ2VhY2gnLCAnb3RoZXInLCAnc3VjaCcsICdvbmx5JyxcbiAgJ25vdGUnLCAnbm90ZXMnLCAndG9kbycsICdkb25lJywgJ251bGwnLCAndHJ1ZScsICdmYWxzZScsICdodHRwJywgJ2h0dHBzJywgJ3d3dycsICdjb20nXG5dO1xuIiwgImltcG9ydCB7IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsIFBsdWdpbiwgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IFRhZ01hdGNoTW9kZSwgV29yZENsb3VkU2VydmljZXMgfSBmcm9tICcuLi90eXBlcyc7XG5cbnR5cGUgRW1iZWRkZWRXb3JkQ2xvdWRPcHRpb25zID0ge1xuICBzY29wZTogJ25vdGUnIHwgJ3ZhdWx0JztcbiAgdGFnczogc3RyaW5nW107XG4gIG1hdGNoOiBUYWdNYXRjaE1vZGU7XG4gIGhlaWdodDogbnVtYmVyO1xuICBpbnRlcmFjdGlvbnM6IGJvb2xlYW47XG4gIG5vdGVQYXRoPzogc3RyaW5nO1xufTtcblxudHlwZSBFbWJlZGRlZFJlbmRlclN0YXRlID0ge1xuICBvYnNlcnZlcjogUmVzaXplT2JzZXJ2ZXI7XG4gIHJlcmVuZGVyVGltZXI6IG51bWJlciB8IG51bGw7XG4gIGxhc3RXaWR0aDogbnVtYmVyO1xuICBsYXN0SGVpZ2h0OiBudW1iZXI7XG59O1xuXG5jb25zdCBERUZBVUxUX09QVElPTlM6IEVtYmVkZGVkV29yZENsb3VkT3B0aW9ucyA9IHtcbiAgc2NvcGU6ICdub3RlJyxcbiAgdGFnczogW10sXG4gIG1hdGNoOiAnYW55JyxcbiAgaGVpZ2h0OiAzMjAsXG4gIGludGVyYWN0aW9uczogdHJ1ZSxcbn07XG5cbmNvbnN0IEVNQkVEX1JFU0laRV9ERUJPVU5DRV9NUyA9IDE0MDtcbmNvbnN0IGVtYmVkZGVkUmVuZGVyU3RhdGVzID0gbmV3IFdlYWtNYXA8SFRNTEVsZW1lbnQsIEVtYmVkZGVkUmVuZGVyU3RhdGU+KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckVtYmVkZGVkV29yZENsb3VkUHJvY2Vzc29yKFxuICBwbHVnaW46IFBsdWdpbixcbiAgc2VydmljZXM6IFdvcmRDbG91ZFNlcnZpY2VzLFxuKTogdm9pZCB7XG4gIGNvbnN0IHJlbmRlciA9IGFzeW5jIChzb3VyY2U6IHN0cmluZywgZWw6IEhUTUxFbGVtZW50LCBjdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjbGVhbnVwRW1iZWRkZWRSZW5kZXJTdGF0ZShlbCk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHBhcnNlT3B0aW9ucyhzb3VyY2UpO1xuXG4gICAgZWwuZW1wdHkoKTtcbiAgICBjb25zdCB3cmFwcGVyRWwgPSBlbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkJyB9KTtcbiAgICBjb25zdCBzdGF0ZUVsID0gd3JhcHBlckVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtc3RhdGUnLCB0ZXh0OiAnQnVpbGRpbmcgY2xvdWQuLi4nIH0pO1xuICAgIGNvbnN0IGNhbnZhc0VsID0gd3JhcHBlckVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtY2FudmFzJyB9KTtcbiAgICBjYW52YXNFbC5zdHlsZS5oZWlnaHQgPSBgJHtvcHRpb25zLmhlaWdodH1weGA7XG5cbiAgICBjb25zdCB1cGRhdGVQcm9ncmVzcyA9IChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgICAgc3RhdGVFbC5zZXRUZXh0KGAke21lc3NhZ2V9ICgke3BlcmNlbnR9JSlgKTtcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCB3b3JkcztcbiAgICAgIGxldCBzZWFyY2hTY29wZTogeyBmaWxlUGF0aD86IHN0cmluZzsgdGFncz86IHN0cmluZ1tdOyB0YWdNYXRjaE1vZGU/OiBUYWdNYXRjaE1vZGUgfSA9IHt9O1xuXG4gICAgICBpZiAob3B0aW9ucy5zY29wZSA9PT0gJ25vdGUnKSB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSByZXNvbHZlVGFyZ2V0RmlsZShwbHVnaW4sIGN0eCwgb3B0aW9ucy5ub3RlUGF0aCk7XG4gICAgICAgIGlmICghZmlsZSkge1xuICAgICAgICAgIHN0YXRlRWwuc2V0VGV4dCgnQ291bGQgbm90IGZpbmQgbm90ZSBmb3IgZW1iZWRkZWQgd29yZCBjbG91ZC4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB3b3JkcyA9IGF3YWl0IHNlcnZpY2VzLmNvbGxlY3RGaWxlV29yZHMoZmlsZSwgdXBkYXRlUHJvZ3Jlc3MpO1xuICAgICAgICBzZWFyY2hTY29wZSA9IHsgZmlsZVBhdGg6IGZpbGUucGF0aCB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd29yZHMgPSBhd2FpdCBzZXJ2aWNlcy5jb2xsZWN0VmF1bHRXb3JkcyhvcHRpb25zLnRhZ3MsIG9wdGlvbnMubWF0Y2gsIHVwZGF0ZVByb2dyZXNzKTtcbiAgICAgICAgc2VhcmNoU2NvcGUgPSB7IHRhZ3M6IG9wdGlvbnMudGFncywgdGFnTWF0Y2hNb2RlOiBvcHRpb25zLm1hdGNoIH07XG4gICAgICB9XG5cbiAgICAgIGlmICh3b3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc3RhdGVFbC5zZXRUZXh0KCdObyB3b3JkcyBmb3VuZCBmb3IgdGhpcyBlbWJlZGRlZCBjbG91ZC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBzZXJ2aWNlcy5kcmF3V29yZENsb3VkKHtcbiAgICAgICAgY29udGFpbmVyRWw6IGNhbnZhc0VsLFxuICAgICAgICB3b3JkcyxcbiAgICAgICAgYXJpYUxhYmVsOiAnRW1iZWRkZWQgd29yZCBjbG91ZCcsXG4gICAgICAgIG9uUHJvZ3Jlc3M6IHVwZGF0ZVByb2dyZXNzLFxuICAgICAgICBvblJlZnJlc2g6ICgpID0+IHJlbmRlcihzb3VyY2UsIGVsLCBjdHgpLFxuICAgICAgICBlbmFibGVPdmVybGF5Q29udHJvbHM6IHRydWUsXG4gICAgICAgIGVuYWJsZVZpZXdwb3J0SW50ZXJhY3Rpb246IG9wdGlvbnMuaW50ZXJhY3Rpb25zLFxuICAgICAgICBzaG93UmVmcmVzaENvbnRyb2w6IHRydWUsXG4gICAgICAgIHNob3dab29tQ29udHJvbHM6IG9wdGlvbnMuaW50ZXJhY3Rpb25zLFxuICAgICAgICBvbldvcmRDbGljazogKHdvcmQpID0+IHtcbiAgICAgICAgICB2b2lkIHNlcnZpY2VzLm9wZW5TZWFyY2hGb3JXb3JkKHdvcmQsIHNlYXJjaFNjb3BlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBzdGF0ZUVsLnJlbW92ZSgpO1xuICAgICAgcmVnaXN0ZXJFbWJlZGRlZFJlc2l6ZU9ic2VydmVyKGVsLCBjYW52YXNFbCwgKCkgPT4gcmVuZGVyKHNvdXJjZSwgZWwsIGN0eCkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdXb3JkIGNsb3VkczogZmFpbGVkIHRvIHJlbmRlciBlbWJlZGRlZCBjbG91ZCcsIGVycm9yKTtcbiAgICAgIHN0YXRlRWwuc2V0VGV4dCgnQ291bGQgbm90IHJlbmRlciBlbWJlZGRlZCB3b3JkIGNsb3VkLicpO1xuICAgIH1cbiAgfTtcblxuICBwbHVnaW4ucmVnaXN0ZXJNYXJrZG93bkNvZGVCbG9ja1Byb2Nlc3Nvcignd29yZGNsb3VkJywgcmVuZGVyKTtcbiAgcGx1Z2luLnJlZ2lzdGVyTWFya2Rvd25Db2RlQmxvY2tQcm9jZXNzb3IoJ3dvcmQtY2xvdWQnLCByZW5kZXIpO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlVGFyZ2V0RmlsZShwbHVnaW46IFBsdWdpbiwgY3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LCBub3RlUGF0aD86IHN0cmluZyk6IFRGaWxlIHwgbnVsbCB7XG4gIGlmIChub3RlUGF0aCkge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRQYXRoID0gbm90ZVBhdGgudHJpbSgpO1xuICAgIGNvbnN0IHJlc29sdmVkID0gcGx1Z2luLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgobm9ybWFsaXplZFBhdGgpO1xuICAgIHJldHVybiByZXNvbHZlZCBpbnN0YW5jZW9mIFRGaWxlID8gcmVzb2x2ZWQgOiBudWxsO1xuICB9XG5cbiAgY29uc3QgZnJvbUNvbnRleHQgPSBwbHVnaW4uYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChjdHguc291cmNlUGF0aCk7XG4gIHJldHVybiBmcm9tQ29udGV4dCBpbnN0YW5jZW9mIFRGaWxlID8gZnJvbUNvbnRleHQgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBwYXJzZU9wdGlvbnMoc291cmNlOiBzdHJpbmcpOiBFbWJlZGRlZFdvcmRDbG91ZE9wdGlvbnMge1xuICBjb25zdCBvcHRpb25zOiBFbWJlZGRlZFdvcmRDbG91ZE9wdGlvbnMgPSB7IC4uLkRFRkFVTFRfT1BUSU9OUyB9O1xuICBjb25zdCBsaW5lcyA9IHNvdXJjZS5zcGxpdCgnXFxuJyk7XG5cbiAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgY29uc3QgdHJpbW1lZCA9IGxpbmUudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCB8fCB0cmltbWVkLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSB0cmltbWVkLmluZGV4T2YoJzonKTtcbiAgICBpZiAoc2VwYXJhdG9ySW5kZXggPT09IC0xKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCByYXdLZXkgPSB0cmltbWVkLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCByYXdWYWx1ZSA9IHRyaW1tZWQuc2xpY2Uoc2VwYXJhdG9ySW5kZXggKyAxKS50cmltKCk7XG5cbiAgICBpZiAocmF3S2V5ID09PSAnc2NvcGUnKSB7XG4gICAgICBvcHRpb25zLnNjb3BlID0gcmF3VmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3ZhdWx0JyA/ICd2YXVsdCcgOiAnbm90ZSc7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAnbWF0Y2gnKSB7XG4gICAgICBvcHRpb25zLm1hdGNoID0gcmF3VmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ2FsbCcgPyAnYWxsJyA6ICdhbnknO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ3RhZ3MnKSB7XG4gICAgICBvcHRpb25zLnRhZ3MgPSByYXdWYWx1ZVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAubWFwKCh2YWx1ZSkgPT4gdmFsdWUudHJpbSgpKVxuICAgICAgICAuZmlsdGVyKCh2YWx1ZSkgPT4gdmFsdWUubGVuZ3RoID4gMCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAnaGVpZ2h0Jykge1xuICAgICAgY29uc3QgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHJhd1ZhbHVlLCAxMCk7XG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XG4gICAgICAgIG9wdGlvbnMuaGVpZ2h0ID0gTWF0aC5taW4oOTAwLCBNYXRoLm1heCgxODAsIHBhcnNlZCkpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ2ludGVyYWN0aW9ucycgfHwgcmF3S2V5ID09PSAnaW50ZXJhY3RhYmxlJyB8fCByYXdLZXkgPT09ICdjb250cm9scycpIHtcbiAgICAgIG9wdGlvbnMuaW50ZXJhY3Rpb25zID0gcGFyc2VCb29sZWFuT3B0aW9uKHJhd1ZhbHVlLCB0cnVlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdub3RlJykge1xuICAgICAgb3B0aW9ucy5ub3RlUGF0aCA9IHJhd1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5mdW5jdGlvbiBwYXJzZUJvb2xlYW5PcHRpb24odmFsdWU6IHN0cmluZywgZmFsbGJhY2s6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgY29uc3Qgbm9ybWFsaXplZCA9IHZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAobm9ybWFsaXplZCA9PT0gJ3RydWUnIHx8IG5vcm1hbGl6ZWQgPT09ICd5ZXMnIHx8IG5vcm1hbGl6ZWQgPT09ICdvbicgfHwgbm9ybWFsaXplZCA9PT0gJzEnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKG5vcm1hbGl6ZWQgPT09ICdmYWxzZScgfHwgbm9ybWFsaXplZCA9PT0gJ25vJyB8fCBub3JtYWxpemVkID09PSAnb2ZmJyB8fCBub3JtYWxpemVkID09PSAnMCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIGZhbGxiYWNrO1xufVxuXG5mdW5jdGlvbiByZWdpc3RlckVtYmVkZGVkUmVzaXplT2JzZXJ2ZXIoXG4gIGhvc3RFbDogSFRNTEVsZW1lbnQsXG4gIGNhbnZhc0VsOiBIVE1MRGl2RWxlbWVudCxcbiAgcmVyZW5kZXI6ICgpID0+IHZvaWQsXG4pOiB2b2lkIHtcbiAgaWYgKHR5cGVvZiBSZXNpemVPYnNlcnZlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdGF0ZTogRW1iZWRkZWRSZW5kZXJTdGF0ZSA9IHtcbiAgICBvYnNlcnZlcjogbmV3IFJlc2l6ZU9ic2VydmVyKChlbnRyaWVzKSA9PiB7XG4gICAgICBjb25zdCBlbnRyeSA9IGVudHJpZXNbMF07XG4gICAgICBpZiAoIWVudHJ5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV4dFdpZHRoID0gTWF0aC5yb3VuZChlbnRyeS5jb250ZW50UmVjdC53aWR0aCk7XG4gICAgICBjb25zdCBuZXh0SGVpZ2h0ID0gTWF0aC5yb3VuZChlbnRyeS5jb250ZW50UmVjdC5oZWlnaHQpO1xuICAgICAgaWYgKG5leHRXaWR0aCA8PSAwIHx8IG5leHRIZWlnaHQgPD0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAobmV4dFdpZHRoID09PSBzdGF0ZS5sYXN0V2lkdGggJiYgbmV4dEhlaWdodCA9PT0gc3RhdGUubGFzdEhlaWdodCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHN0YXRlLmxhc3RXaWR0aCA9IG5leHRXaWR0aDtcbiAgICAgIHN0YXRlLmxhc3RIZWlnaHQgPSBuZXh0SGVpZ2h0O1xuXG4gICAgICBpZiAoc3RhdGUucmVyZW5kZXJUaW1lciAhPT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHN0YXRlLnJlcmVuZGVyVGltZXIpO1xuICAgICAgfVxuICAgICAgc3RhdGUucmVyZW5kZXJUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc3RhdGUucmVyZW5kZXJUaW1lciA9IG51bGw7XG4gICAgICAgIHJlcmVuZGVyKCk7XG4gICAgICB9LCBFTUJFRF9SRVNJWkVfREVCT1VOQ0VfTVMpO1xuICAgIH0pLFxuICAgIHJlcmVuZGVyVGltZXI6IG51bGwsXG4gICAgbGFzdFdpZHRoOiBNYXRoLnJvdW5kKGNhbnZhc0VsLmNsaWVudFdpZHRoKSxcbiAgICBsYXN0SGVpZ2h0OiBNYXRoLnJvdW5kKGNhbnZhc0VsLmNsaWVudEhlaWdodCksXG4gIH07XG5cbiAgc3RhdGUub2JzZXJ2ZXIub2JzZXJ2ZShjYW52YXNFbCk7XG4gIGVtYmVkZGVkUmVuZGVyU3RhdGVzLnNldChob3N0RWwsIHN0YXRlKTtcbn1cblxuZnVuY3Rpb24gY2xlYW51cEVtYmVkZGVkUmVuZGVyU3RhdGUoaG9zdEVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICBjb25zdCBzdGF0ZSA9IGVtYmVkZGVkUmVuZGVyU3RhdGVzLmdldChob3N0RWwpO1xuICBpZiAoIXN0YXRlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGUub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICBpZiAoc3RhdGUucmVyZW5kZXJUaW1lciAhPT0gbnVsbCkge1xuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoc3RhdGUucmVyZW5kZXJUaW1lcik7XG4gIH1cbiAgZW1iZWRkZWRSZW5kZXJTdGF0ZXMuZGVsZXRlKGhvc3RFbCk7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVRhZyh0YWc6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSB0YWcudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmICghdHJpbW1lZCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJldHVybiB0cmltbWVkLnN0YXJ0c1dpdGgoJyMnKSA/IHRyaW1tZWQgOiBgIyR7dHJpbW1lZH1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlRm9yU2VhcmNoKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWUucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRNdWx0aVZhbHVlcyhzZWxlY3RFbDogSFRNTFNlbGVjdEVsZW1lbnQpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBBcnJheS5mcm9tKHNlbGVjdEVsLnNlbGVjdGVkT3B0aW9ucykubWFwKChvcHRpb24pID0+IG9wdGlvbi52YWx1ZSk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IFNlYXJjaE9wdGlvbnMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBlc2NhcGVGb3JTZWFyY2gsIG5vcm1hbGl6ZVRhZyB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5TZWFyY2hGb3JXb3JkKGFwcDogQXBwLCB3b3JkOiBzdHJpbmcsIG9wdGlvbnM6IFNlYXJjaE9wdGlvbnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBbYFwiJHtlc2NhcGVGb3JTZWFyY2god29yZCl9XCJgXTtcblxuICBpZiAob3B0aW9ucy5maWxlUGF0aCkge1xuICAgIHBhcnRzLnB1c2goYHBhdGg6XCIke2VzY2FwZUZvclNlYXJjaChvcHRpb25zLmZpbGVQYXRoKX1cImApO1xuICB9XG5cbiAgY29uc3QgdGFncyA9IChvcHRpb25zLnRhZ3MgPz8gW10pXG4gICAgLm1hcCgodGFnKSA9PiBub3JtYWxpemVUYWcodGFnKSlcbiAgICAuZmlsdGVyKCh0YWcpID0+IHRhZy5sZW5ndGggPiAwKTtcblxuICBpZiAodGFncy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKG9wdGlvbnMudGFnTWF0Y2hNb2RlID09PSAnYWxsJykge1xuICAgICAgZm9yIChjb25zdCB0YWcgb2YgdGFncykge1xuICAgICAgICBwYXJ0cy5wdXNoKHRhZyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnRzLnB1c2goYCgke3RhZ3Muam9pbignIE9SICcpfSlgKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBxdWVyeSA9IHBhcnRzLmpvaW4oJyAnKTtcbiAgY29uc3QgZXhpc3RpbmdTZWFyY2hMZWFmID0gYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ3NlYXJjaCcpWzBdO1xuICBjb25zdCBzZWFyY2hMZWFmID0gZXhpc3RpbmdTZWFyY2hMZWFmID8/IGFwcC53b3Jrc3BhY2UuZ2V0UmlnaHRMZWFmKGZhbHNlKSA/PyBhcHAud29ya3NwYWNlLmdldExlYWYodHJ1ZSk7XG5cbiAgaWYgKCFzZWFyY2hMZWFmKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYXdhaXQgc2VhcmNoTGVhZi5zZXRWaWV3U3RhdGUoe1xuICAgIHR5cGU6ICdzZWFyY2gnLFxuICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICBzdGF0ZToge1xuICAgICAgcXVlcnksXG4gICAgfSxcbiAgfSk7XG5cbiAgYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKHNlYXJjaExlYWYpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IG5vcm1hbGl6ZVRhZyB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgUGlwZWxpbmVEb2N1bWVudCB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRQaXBlbGluZURvY3VtZW50cyhcbiAgYXBwOiBBcHAsXG4gIGZpbGVzOiBURmlsZVtdLFxuICByZWFkQmF0Y2hTaXplOiBudW1iZXIsXG4gIG9uUHJvZ3Jlc3M/OiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQsXG4pOiBQcm9taXNlPFBpcGVsaW5lRG9jdW1lbnRbXT4ge1xuICBjb25zdCBkb2N1bWVudHM6IFBpcGVsaW5lRG9jdW1lbnRbXSA9IFtdO1xuICBjb25zdCB0b3RhbEZpbGVzID0gTWF0aC5tYXgoMSwgZmlsZXMubGVuZ3RoKTtcblxuICBmb3IgKGxldCBiYXRjaFN0YXJ0ID0gMDsgYmF0Y2hTdGFydCA8IGZpbGVzLmxlbmd0aDsgYmF0Y2hTdGFydCArPSByZWFkQmF0Y2hTaXplKSB7XG4gICAgY29uc3QgYmF0Y2ggPSBmaWxlcy5zbGljZShiYXRjaFN0YXJ0LCBiYXRjaFN0YXJ0ICsgcmVhZEJhdGNoU2l6ZSk7XG4gICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBQcm9taXNlLmFsbChiYXRjaC5tYXAoKGZpbGUpID0+IGFwcC52YXVsdC5jYWNoZWRSZWFkKGZpbGUpKSk7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYmF0Y2gubGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgICBjb25zdCBmaWxlID0gYmF0Y2hbaW5kZXhdO1xuICAgICAgY29uc3QgcmF3VGV4dCA9IGNvbnRlbnRzW2luZGV4XTtcbiAgICAgIGNvbnN0IHRhZ3MgPSBnZXRGaWxlVGFncyhhcHAsIGZpbGUpO1xuICAgICAgY29uc3QgZmlsZUluZGV4ID0gYmF0Y2hTdGFydCArIGluZGV4O1xuXG4gICAgICBvblByb2dyZXNzPy4oYFNjYW5uaW5nICR7ZmlsZUluZGV4ICsgMX0vJHtmaWxlcy5sZW5ndGh9IGZpbGVzLi4uYCwgTWF0aC5yb3VuZCgoZmlsZUluZGV4IC8gdG90YWxGaWxlcykgKiA3NSkpO1xuXG4gICAgICBkb2N1bWVudHMucHVzaCh7XG4gICAgICAgIGlkOiBmaWxlLnBhdGgsXG4gICAgICAgIHBhdGg6IGZpbGUucGF0aCxcbiAgICAgICAgYmFzZW5hbWU6IGZpbGUuYmFzZW5hbWUsXG4gICAgICAgIHJhd1RleHQsXG4gICAgICAgIHRhZ3MsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZG9jdW1lbnRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsZVRhZ3MoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogc3RyaW5nW10ge1xuICBjb25zdCBjYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcbiAgaWYgKCFjYWNoZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHRhZ1NldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIGlmIChjYWNoZS50YWdzKSB7XG4gICAgZm9yIChjb25zdCB0YWdFbnRyeSBvZiBjYWNoZS50YWdzKSB7XG4gICAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplVGFnKHRhZ0VudHJ5LnRhZyk7XG4gICAgICBpZiAobm9ybWFsaXplZCkge1xuICAgICAgICB0YWdTZXQuYWRkKG5vcm1hbGl6ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgdGFnIG9mIGV4dHJhY3RGcm9udG1hdHRlclRhZ3MoY2FjaGUuZnJvbnRtYXR0ZXIpKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVRhZyh0YWcpO1xuICAgIGlmIChub3JtYWxpemVkKSB7XG4gICAgICB0YWdTZXQuYWRkKG5vcm1hbGl6ZWQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbLi4udGFnU2V0XTtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdEZyb250bWF0dGVyVGFncyhmcm9udG1hdHRlcjogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nW10ge1xuICBpZiAoIWZyb250bWF0dGVyIHx8IHR5cGVvZiBmcm9udG1hdHRlciAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCByYXdUYWdzID0gZnJvbnRtYXR0ZXIudGFncyA/PyBmcm9udG1hdHRlci50YWc7XG4gIGlmICh0eXBlb2YgcmF3VGFncyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcmF3VGFncy5zcGxpdCgvW1xccyxdKy8pLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkocmF3VGFncykpIHtcbiAgICByZXR1cm4gcmF3VGFnc1xuICAgICAgLmZpbHRlcigoZW50cnkpOiBlbnRyeSBpcyBzdHJpbmcgPT4gdHlwZW9mIGVudHJ5ID09PSAnc3RyaW5nJylcbiAgICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS50cmltKCkpXG4gICAgICAuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkubGVuZ3RoID4gMCk7XG4gIH1cblxuICByZXR1cm4gW107XG59XG4iLCAiaW1wb3J0IHsgTUFYX1dPUkRTLCBNSU5fV09SRF9MRU5HVEggfSBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUgeyBSZW5kZXJTZXR0aW5ncywgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHR5cGUge1xuICBBZ2dyZWdhdGVSZXN1bHQsXG4gIEFnZ3JlZ2F0b3JTdHJhdGVneSxcbiAgRGlzdHJpYnV0aW9uQnVja2V0LFxuICBGaWx0ZXJTdHJhdGVneSxcbiAgUGlwZWxpbmVTdHJhdGVnaWVzLFxuICBSZW5kZXJNb2RlbCxcbiAgUmVuZGVyTW9kZWxTdHJhdGVneSxcbiAgU2NhbGluZ1N0cmF0ZWd5LFxuICBUb2tlbixcbiAgVG9rZW5pemVyU3RyYXRlZ3ksXG59IGZyb20gJy4uL3R5cGVzJztcblxuY29uc3QgZGVmYXVsdFRva2VuaXplcjogVG9rZW5pemVyU3RyYXRlZ3kgPSB7XG4gIHRva2VuaXplKHRleHQ6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGV4dC5tYXRjaCgvW2EtejAtOV1bYS16MC05Jy1dKi9nKSA/PyBbXTtcbiAgfSxcbn07XG5cbmNvbnN0IGRlZmF1bHRGaWx0ZXI6IEZpbHRlclN0cmF0ZWd5ID0ge1xuICBpbmNsdWRlVG9rZW4odG9rZW46IHN0cmluZywgc3RvcFdvcmRzOiBTZXQ8c3RyaW5nPik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB0b2tlbi50cmltKCk7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQubGVuZ3RoID49IE1JTl9XT1JEX0xFTkdUSCAmJiAhc3RvcFdvcmRzLmhhcyhub3JtYWxpemVkKTtcbiAgfSxcbn07XG5cbmNvbnN0IGRlZmF1bHRBZ2dyZWdhdG9yOiBBZ2dyZWdhdG9yU3RyYXRlZ3kgPSB7XG4gIGFnZ3JlZ2F0ZSh0b2tlbnM6IFRva2VuW10pOiBBZ2dyZWdhdGVSZXN1bHQge1xuICAgIGNvbnN0IGNvdW50cyA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG5cbiAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRva2Vucykge1xuICAgICAgY291bnRzLnNldCh0b2tlbi52YWx1ZSwgKGNvdW50cy5nZXQodG9rZW4udmFsdWUpID8/IDApICsgMSk7XG4gICAgfVxuXG4gICAgY29uc3QgZW50cmllcyA9IFsuLi5jb3VudHMuZW50cmllcygpXVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGJbMV0gLSBhWzFdKVxuICAgICAgLnNsaWNlKDAsIE1BWF9XT1JEUyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZW50cmllcyxcbiAgICAgIHRvdGFsVG9rZW5zOiB0b2tlbnMubGVuZ3RoLFxuICAgICAgZGlzdGluY3RUb2tlbnM6IGNvdW50cy5zaXplLFxuICAgIH07XG4gIH0sXG59O1xuXG5jb25zdCBkZWZhdWx0U2NhbGluZzogU2NhbGluZ1N0cmF0ZWd5ID0ge1xuICBzY2FsZShlbnRyaWVzOiBBcnJheTxbc3RyaW5nLCBudW1iZXJdPiwgcmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzKTogV2VpZ2h0ZWRXb3JkW10ge1xuICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IG1pbkZvbnRTaXplID0gTWF0aC5tYXgoOCwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy5taW5Gb250U2l6ZSkpO1xuICAgIGNvbnN0IG1heEZvbnRTaXplID0gTWF0aC5tYXgobWluRm9udFNpemUgKyAxLCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLm1heEZvbnRTaXplKSk7XG4gICAgY29uc3QgZW1waGFzaXMgPSBNYXRoLm1heCgwLjUsIE1hdGgubWluKDMsIHJlbmRlclNldHRpbmdzLmVtcGhhc2lzKSk7XG5cbiAgICBjb25zdCBub3JtYWxpemVkRW50cmllcyA9IGVudHJpZXNcbiAgICAgIC5tYXAoKFt0ZXh0LCBjb3VudF0sIGluZGV4KSA9PiAoe1xuICAgICAgICB0ZXh0LFxuICAgICAgICBjb3VudCxcbiAgICAgICAgaW5kZXgsXG4gICAgICAgIHNjb3JlOiBjb21wdXRlU2NhbGVTY29yZShjb3VudCwgaW5kZXgsIGVudHJpZXMsIHJlbmRlclNldHRpbmdzLCBlbXBoYXNpcyksXG4gICAgICB9KSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBiLmNvdW50IC0gYS5jb3VudCB8fCBhLmluZGV4IC0gYi5pbmRleCk7XG5cbiAgICByZXR1cm4gbm9ybWFsaXplZEVudHJpZXMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgIHRleHQ6IGVudHJ5LnRleHQsXG4gICAgICBjb3VudDogZW50cnkuY291bnQsXG4gICAgICBzaXplOiBNYXRoLnJvdW5kKG1pbkZvbnRTaXplICsgZW50cnkuc2NvcmUgKiAobWF4Rm9udFNpemUgLSBtaW5Gb250U2l6ZSkpLFxuICAgIH0pKTtcbiAgfSxcbn07XG5cbmNvbnN0IGRlZmF1bHRSZW5kZXJNb2RlbDogUmVuZGVyTW9kZWxTdHJhdGVneSA9IHtcbiAgYnVpbGRNb2RlbCh3b3JkczogV2VpZ2h0ZWRXb3JkW10sIGFnZ3JlZ2F0ZTogQWdncmVnYXRlUmVzdWx0KTogUmVuZGVyTW9kZWwge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkQ2xvdWRXb3Jkczogd29yZHMsXG4gICAgICBkaXN0cmlidXRpb25TZXJpZXM6IGJ1aWxkRGlzdHJpYnV0aW9uU2VyaWVzKHdvcmRzKSxcbiAgICAgIHRvdGFsVG9rZW5zOiBhZ2dyZWdhdGUudG90YWxUb2tlbnMsXG4gICAgICBkaXN0aW5jdFRva2VuczogYWdncmVnYXRlLmRpc3RpbmN0VG9rZW5zLFxuICAgIH07XG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9QSVBFTElORV9TVFJBVEVHSUVTOiBQaXBlbGluZVN0cmF0ZWdpZXMgPSB7XG4gIHRva2VuaXplcjogZGVmYXVsdFRva2VuaXplcixcbiAgZmlsdGVyOiBkZWZhdWx0RmlsdGVyLFxuICBhZ2dyZWdhdG9yOiBkZWZhdWx0QWdncmVnYXRvcixcbiAgc2NhbGluZzogZGVmYXVsdFNjYWxpbmcsXG4gIHJlbmRlck1vZGVsOiBkZWZhdWx0UmVuZGVyTW9kZWwsXG59O1xuXG5mdW5jdGlvbiBjb21wdXRlU2NhbGVTY29yZShcbiAgY291bnQ6IG51bWJlcixcbiAgaW5kZXg6IG51bWJlcixcbiAgZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sXG4gIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyxcbiAgZW1waGFzaXM6IG51bWJlcixcbik6IG51bWJlciB7XG4gIGNvbnN0IGNvdW50cyA9IGVudHJpZXMubWFwKChbLCBlbnRyeUNvdW50XSkgPT4gZW50cnlDb3VudCk7XG4gIGNvbnN0IG1pbkNvdW50ID0gY291bnRzW2NvdW50cy5sZW5ndGggLSAxXTtcbiAgY29uc3QgbWF4Q291bnQgPSBjb3VudHNbMF07XG5cbiAgaWYgKG1heENvdW50IDw9IG1pbkNvdW50KSB7XG4gICAgcmV0dXJuIDAuNTtcbiAgfVxuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5zY2FsaW5nTW9kZSA9PT0gJ3JhbmsnKSB7XG4gICAgaWYgKGVudHJpZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gMC41O1xuICAgIH1cbiAgICByZXR1cm4gMSAtIGluZGV4IC8gKGVudHJpZXMubGVuZ3RoIC0gMSk7XG4gIH1cblxuICBpZiAocmVuZGVyU2V0dGluZ3Muc2NhbGluZ01vZGUgPT09ICdsb2cnKSB7XG4gICAgY29uc3Qgc2FmZU1pbiA9IE1hdGgubWF4KDEsIG1pbkNvdW50KTtcbiAgICBjb25zdCBzYWZlTWF4ID0gTWF0aC5tYXgoc2FmZU1pbiArIDEsIG1heENvdW50KTtcbiAgICBjb25zdCBudW1lcmF0b3IgPSBNYXRoLmxvZyhNYXRoLm1heCgxLCBjb3VudCkpIC0gTWF0aC5sb2coc2FmZU1pbik7XG4gICAgY29uc3QgZGVub21pbmF0b3IgPSBNYXRoLmxvZyhzYWZlTWF4KSAtIE1hdGgubG9nKHNhZmVNaW4pO1xuICAgIHJldHVybiBjbGFtcDAxKGRlbm9taW5hdG9yID09PSAwID8gMC41IDogbnVtZXJhdG9yIC8gZGVub21pbmF0b3IpO1xuICB9XG5cbiAgY29uc3QgbGluZWFyID0gKGNvdW50IC0gbWluQ291bnQpIC8gKG1heENvdW50IC0gbWluQ291bnQpO1xuICBpZiAocmVuZGVyU2V0dGluZ3Muc2NhbGluZ01vZGUgPT09ICdwb3dlcicpIHtcbiAgICByZXR1cm4gY2xhbXAwMShNYXRoLnBvdyhsaW5lYXIsIGVtcGhhc2lzKSk7XG4gIH1cblxuICByZXR1cm4gY2xhbXAwMShsaW5lYXIpO1xufVxuXG5mdW5jdGlvbiBjbGFtcDAxKHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgdmFsdWUpKTtcbn1cblxuZnVuY3Rpb24gYnVpbGREaXN0cmlidXRpb25TZXJpZXMod29yZHM6IFdlaWdodGVkV29yZFtdKTogRGlzdHJpYnV0aW9uQnVja2V0W10ge1xuICBpZiAod29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgbWF4Q291bnQgPSB3b3Jkc1swXT8uY291bnQgPz8gMDtcbiAgaWYgKG1heENvdW50IDw9IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBidWNrZXRDb3VudCA9IE1hdGgubWluKDgsIE1hdGgubWF4KDQsIE1hdGgucm91bmQoTWF0aC5zcXJ0KHdvcmRzLmxlbmd0aCkpKSk7XG4gIGNvbnN0IHdpZHRoID0gTWF0aC5tYXgoMSwgTWF0aC5jZWlsKG1heENvdW50IC8gYnVja2V0Q291bnQpKTtcbiAgY29uc3QgYnVja2V0cyA9IG5ldyBNYXA8bnVtYmVyLCBudW1iZXI+KCk7XG5cbiAgZm9yIChjb25zdCB3b3JkIG9mIHdvcmRzKSB7XG4gICAgY29uc3QgaW5kZXggPSBNYXRoLm1pbihidWNrZXRDb3VudCAtIDEsIE1hdGguZmxvb3IoKHdvcmQuY291bnQgLSAxKSAvIHdpZHRoKSk7XG4gICAgYnVja2V0cy5zZXQoaW5kZXgsIChidWNrZXRzLmdldChpbmRleCkgPz8gMCkgKyAxKTtcbiAgfVxuXG4gIGNvbnN0IGRpc3RyaWJ1dGlvbjogRGlzdHJpYnV0aW9uQnVja2V0W10gPSBbXTtcbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGJ1Y2tldENvdW50OyBpbmRleCArPSAxKSB7XG4gICAgY29uc3QgbWluID0gaW5kZXggKiB3aWR0aCArIDE7XG4gICAgY29uc3QgbWF4ID0gaW5kZXggPT09IGJ1Y2tldENvdW50IC0gMSA/IG1heENvdW50IDogKGluZGV4ICsgMSkgKiB3aWR0aDtcbiAgICBkaXN0cmlidXRpb24ucHVzaCh7XG4gICAgICBsYWJlbDogYCR7bWlufS0ke21heH1gLFxuICAgICAgbWluLFxuICAgICAgbWF4LFxuICAgICAgdmFsdWU6IGJ1Y2tldHMuZ2V0KGluZGV4KSA/PyAwLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGRpc3RyaWJ1dGlvbjtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFnZ3JlZ2F0ZVJlc3VsdCwgQWdncmVnYXRvclN0cmF0ZWd5LCBUb2tlbiB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFnZ3JlZ2F0ZVRva2Vucyh0b2tlbnM6IFRva2VuW10sIHN0cmF0ZWd5OiBBZ2dyZWdhdG9yU3RyYXRlZ3kpOiBBZ2dyZWdhdGVSZXN1bHQge1xuICByZXR1cm4gc3RyYXRlZ3kuYWdncmVnYXRlKHRva2Vucyk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBGaWx0ZXJTdHJhdGVneSwgVG9rZW4gfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJUb2tlbnModG9rZW5zOiBUb2tlbltdLCBzdG9wV29yZHM6IFNldDxzdHJpbmc+LCBzdHJhdGVneTogRmlsdGVyU3RyYXRlZ3kpOiBUb2tlbltdIHtcbiAgcmV0dXJuIHRva2Vucy5maWx0ZXIoKHRva2VuKSA9PiBzdHJhdGVneS5pbmNsdWRlVG9rZW4odG9rZW4udmFsdWUsIHN0b3BXb3JkcykpO1xufVxuIiwgImltcG9ydCB7IEZST05UTUFUVEVSX1BBVFRFUk4gfSBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUgeyBOb3JtYWxpemVkRG9jdW1lbnQsIFBpcGVsaW5lRG9jdW1lbnQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVEb2N1bWVudHMoZG9jdW1lbnRzOiBQaXBlbGluZURvY3VtZW50W10pOiBOb3JtYWxpemVkRG9jdW1lbnRbXSB7XG4gIHJldHVybiBkb2N1bWVudHMubWFwKChkb2N1bWVudCkgPT4gKHtcbiAgICBpZDogZG9jdW1lbnQuaWQsXG4gICAgcGF0aDogZG9jdW1lbnQucGF0aCxcbiAgICBiYXNlbmFtZTogZG9jdW1lbnQuYmFzZW5hbWUsXG4gICAgdGFnczogWy4uLmRvY3VtZW50LnRhZ3NdLFxuICAgIHRleHQ6IGRvY3VtZW50LnJhd1RleHRcbiAgICAgIC5yZXBsYWNlKEZST05UTUFUVEVSX1BBVFRFUk4sICcnKVxuICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgIC5ub3JtYWxpemUoJ05GS0MnKSxcbiAgfSkpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQWdncmVnYXRlUmVzdWx0LCBSZW5kZXJNb2RlbCwgUmVuZGVyTW9kZWxTdHJhdGVneSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVuZGVyTW9kZWwoXG4gIHdvcmRzOiBXZWlnaHRlZFdvcmRbXSxcbiAgYWdncmVnYXRlUmVzdWx0OiBBZ2dyZWdhdGVSZXN1bHQsXG4gIHN0cmF0ZWd5OiBSZW5kZXJNb2RlbFN0cmF0ZWd5LFxuKTogUmVuZGVyTW9kZWwge1xuICByZXR1cm4gc3RyYXRlZ3kuYnVpbGRNb2RlbCh3b3JkcywgYWdncmVnYXRlUmVzdWx0KTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFJlbmRlclNldHRpbmdzLCBXZWlnaHRlZFdvcmQgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFNjYWxpbmdTdHJhdGVneSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlRW50cmllcyhcbiAgZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sXG4gIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyxcbiAgc3RyYXRlZ3k6IFNjYWxpbmdTdHJhdGVneSxcbik6IFdlaWdodGVkV29yZFtdIHtcbiAgcmV0dXJuIHN0cmF0ZWd5LnNjYWxlKGVudHJpZXMsIHJlbmRlclNldHRpbmdzKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFBpcGVsaW5lRG9jdW1lbnQsIFNvdXJjZVNlbGVjdGlvblJ1bGVzIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbm9ybWFsaXplVGFnIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0RG9jdW1lbnRzKGRvY3VtZW50czogUGlwZWxpbmVEb2N1bWVudFtdLCBydWxlcz86IFNvdXJjZVNlbGVjdGlvblJ1bGVzKTogUGlwZWxpbmVEb2N1bWVudFtdIHtcbiAgaWYgKCFydWxlcykge1xuICAgIHJldHVybiBkb2N1bWVudHM7XG4gIH1cblxuICBjb25zdCBub3JtYWxpemVkVGFnRmlsdGVycyA9IChydWxlcy50YWdGaWx0ZXJzID8/IFtdKVxuICAgIC5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpXG4gICAgLmZpbHRlcigodGFnKSA9PiB0YWcubGVuZ3RoID4gMCk7XG5cbiAgY29uc3QgaW5jbHVkZVByZWZpeGVzID0gKHJ1bGVzLmluY2x1ZGVQYXRoUHJlZml4ZXMgPz8gW10pLm1hcCgocHJlZml4KSA9PiBwcmVmaXgudHJpbSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gIGNvbnN0IGV4Y2x1ZGVQcmVmaXhlcyA9IChydWxlcy5leGNsdWRlUGF0aFByZWZpeGVzID8/IFtdKS5tYXAoKHByZWZpeCkgPT4gcHJlZml4LnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBxdWVyeVRleHQgPSBydWxlcy5xdWVyeVRleHQ/LnRyaW0oKS50b0xvd2VyQ2FzZSgpID8/ICcnO1xuICBjb25zdCB0YWdNYXRjaE1vZGUgPSBydWxlcy50YWdNYXRjaE1vZGUgPz8gJ2FueSc7XG5cbiAgcmV0dXJuIGRvY3VtZW50cy5maWx0ZXIoKGRvY3VtZW50KSA9PiB7XG4gICAgaWYgKCFtYXRjaGVzUGF0aFJ1bGVzKGRvY3VtZW50LnBhdGgsIGluY2x1ZGVQcmVmaXhlcywgZXhjbHVkZVByZWZpeGVzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChub3JtYWxpemVkVGFnRmlsdGVycy5sZW5ndGggPiAwICYmICFtYXRjaGVzVGFnUnVsZXMoZG9jdW1lbnQudGFncywgbm9ybWFsaXplZFRhZ0ZpbHRlcnMsIHRhZ01hdGNoTW9kZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocXVlcnlUZXh0Lmxlbmd0aCA+IDAgJiYgIW1hdGNoZXNRdWVyeVRleHQoZG9jdW1lbnQsIHF1ZXJ5VGV4dCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNQYXRoUnVsZXMocGF0aDogc3RyaW5nLCBpbmNsdWRlUHJlZml4ZXM6IHN0cmluZ1tdLCBleGNsdWRlUHJlZml4ZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gIGlmIChpbmNsdWRlUHJlZml4ZXMubGVuZ3RoID4gMCAmJiAhaW5jbHVkZVByZWZpeGVzLnNvbWUoKHByZWZpeCkgPT4gcGF0aC5zdGFydHNXaXRoKHByZWZpeCkpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGV4Y2x1ZGVQcmVmaXhlcy5zb21lKChwcmVmaXgpID0+IHBhdGguc3RhcnRzV2l0aChwcmVmaXgpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzVGFnUnVsZXMoZG9jdW1lbnRUYWdzOiBzdHJpbmdbXSwgZmlsdGVyczogc3RyaW5nW10sIG1vZGU6ICdhbnknIHwgJ2FsbCcpOiBib29sZWFuIHtcbiAgY29uc3Qgbm9ybWFsaXplZFRhZ3MgPSBuZXcgU2V0KGRvY3VtZW50VGFncy5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpLmZpbHRlcihCb29sZWFuKSk7XG4gIGlmIChtb2RlID09PSAnYWxsJykge1xuICAgIHJldHVybiBmaWx0ZXJzLmV2ZXJ5KChmaWx0ZXJUYWcpID0+IG5vcm1hbGl6ZWRUYWdzLmhhcyhmaWx0ZXJUYWcpKTtcbiAgfVxuXG4gIHJldHVybiBmaWx0ZXJzLnNvbWUoKGZpbHRlclRhZykgPT4gbm9ybWFsaXplZFRhZ3MuaGFzKGZpbHRlclRhZykpO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzUXVlcnlUZXh0KGRvY3VtZW50OiBQaXBlbGluZURvY3VtZW50LCBxdWVyeVRleHQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gZG9jdW1lbnQucGF0aC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5VGV4dClcbiAgICB8fCBkb2N1bWVudC5iYXNlbmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5VGV4dClcbiAgICB8fCBkb2N1bWVudC5yYXdUZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnlUZXh0KTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IE5vcm1hbGl6ZWREb2N1bWVudCwgVG9rZW4sIFRva2VuaXplclN0cmF0ZWd5IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9rZW5pemVEb2N1bWVudHMoZG9jdW1lbnRzOiBOb3JtYWxpemVkRG9jdW1lbnRbXSwgc3RyYXRlZ3k6IFRva2VuaXplclN0cmF0ZWd5KTogVG9rZW5bXSB7XG4gIGNvbnN0IHRva2VuczogVG9rZW5bXSA9IFtdO1xuXG4gIGZvciAoY29uc3QgZG9jdW1lbnQgb2YgZG9jdW1lbnRzKSB7XG4gICAgY29uc3QgdmFsdWVzID0gc3RyYXRlZ3kudG9rZW5pemUoZG9jdW1lbnQudGV4dCk7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGRvY3VtZW50SWQ6IGRvY3VtZW50LmlkLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRva2Vucztcbn1cbiIsICJpbXBvcnQgeyBERUZBVUxUX1BJUEVMSU5FX1NUUkFURUdJRVMgfSBmcm9tICcuL3N0cmF0ZWdpZXMnO1xuaW1wb3J0IHsgYWdncmVnYXRlVG9rZW5zIH0gZnJvbSAnLi9zdGFnZXMvYWdncmVnYXRlJztcbmltcG9ydCB7IGZpbHRlclRva2VucyB9IGZyb20gJy4vc3RhZ2VzL2ZpbHRlcic7XG5pbXBvcnQgeyBub3JtYWxpemVEb2N1bWVudHMgfSBmcm9tICcuL3N0YWdlcy9ub3JtYWxpemUnO1xuaW1wb3J0IHsgY3JlYXRlUmVuZGVyTW9kZWwgfSBmcm9tICcuL3N0YWdlcy9yZW5kZXItbW9kZWwnO1xuaW1wb3J0IHsgc2NhbGVFbnRyaWVzIH0gZnJvbSAnLi9zdGFnZXMvc2NhbGUnO1xuaW1wb3J0IHsgc2VsZWN0RG9jdW1lbnRzIH0gZnJvbSAnLi9zdGFnZXMvc291cmNlLXNlbGVjdGlvbic7XG5pbXBvcnQgeyB0b2tlbml6ZURvY3VtZW50cyB9IGZyb20gJy4vc3RhZ2VzL3Rva2VuaXplJztcbmltcG9ydCB0eXBlIHsgUGlwZWxpbmVJbnB1dCwgUGlwZWxpbmVTdHJhdGVnaWVzLCBSZW5kZXJNb2RlbCB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcnVuUGlwZWxpbmUoXG4gIGlucHV0OiBQaXBlbGluZUlucHV0LFxuICBvdmVycmlkZXM6IFBhcnRpYWw8UGlwZWxpbmVTdHJhdGVnaWVzPiA9IHt9LFxuKTogUmVuZGVyTW9kZWwge1xuICBjb25zdCBzdHJhdGVnaWVzOiBQaXBlbGluZVN0cmF0ZWdpZXMgPSB7XG4gICAgLi4uREVGQVVMVF9QSVBFTElORV9TVFJBVEVHSUVTLFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfTtcblxuICBjb25zdCBzZWxlY3RlZERvY3VtZW50cyA9IHNlbGVjdERvY3VtZW50cyhpbnB1dC5kb2N1bWVudHMsIGlucHV0LnNvdXJjZVJ1bGVzKTtcbiAgY29uc3Qgbm9ybWFsaXplZERvY3VtZW50cyA9IG5vcm1hbGl6ZURvY3VtZW50cyhzZWxlY3RlZERvY3VtZW50cyk7XG4gIGNvbnN0IHRva2VucyA9IHRva2VuaXplRG9jdW1lbnRzKG5vcm1hbGl6ZWREb2N1bWVudHMsIHN0cmF0ZWdpZXMudG9rZW5pemVyKTtcbiAgY29uc3QgZmlsdGVyZWRUb2tlbnMgPSBmaWx0ZXJUb2tlbnModG9rZW5zLCBpbnB1dC5zdG9wV29yZHMsIHN0cmF0ZWdpZXMuZmlsdGVyKTtcbiAgY29uc3QgYWdncmVnYXRlUmVzdWx0ID0gYWdncmVnYXRlVG9rZW5zKGZpbHRlcmVkVG9rZW5zLCBzdHJhdGVnaWVzLmFnZ3JlZ2F0b3IpO1xuICBjb25zdCB3b3JkcyA9IHNjYWxlRW50cmllcyhhZ2dyZWdhdGVSZXN1bHQuZW50cmllcywgaW5wdXQucmVuZGVyU2V0dGluZ3MsIHN0cmF0ZWdpZXMuc2NhbGluZyk7XG5cbiAgcmV0dXJuIGNyZWF0ZVJlbmRlck1vZGVsKHdvcmRzLCBhZ2dyZWdhdGVSZXN1bHQsIHN0cmF0ZWdpZXMucmVuZGVyTW9kZWwpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgVGFnTWF0Y2hNb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbm9ybWFsaXplVGFnIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXZhaWxhYmxlVGFncyhhcHA6IEFwcCk6IHN0cmluZ1tdIHtcbiAgY29uc3QgdGFncyA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldFRhZ3MoKTtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHRhZ3MpLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJGaWxlc0J5VGFncyhcbiAgYXBwOiBBcHAsXG4gIGZpbGVzOiBURmlsZVtdLFxuICB0YWdGaWx0ZXJzOiBzdHJpbmdbXSxcbiAgdGFnTWF0Y2hNb2RlOiBUYWdNYXRjaE1vZGUsXG4pOiBURmlsZVtdIHtcbiAgY29uc3Qgbm9ybWFsaXplZEZpbHRlcnMgPSB0YWdGaWx0ZXJzXG4gICAgLm1hcCgodGFnKSA9PiBub3JtYWxpemVUYWcodGFnKSlcbiAgICAuZmlsdGVyKCh0YWcpID0+IHRhZy5sZW5ndGggPiAwKTtcblxuICBpZiAobm9ybWFsaXplZEZpbHRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZpbGVzO1xuICB9XG5cbiAgcmV0dXJuIGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsZU1hdGNoZXNUYWdzKGFwcCwgZmlsZSwgbm9ybWFsaXplZEZpbHRlcnMsIHRhZ01hdGNoTW9kZSkpO1xufVxuXG5mdW5jdGlvbiBmaWxlTWF0Y2hlc1RhZ3MoYXBwOiBBcHAsIGZpbGU6IFRGaWxlLCBub3JtYWxpemVkRmlsdGVyczogc3RyaW5nW10sIHRhZ01hdGNoTW9kZTogVGFnTWF0Y2hNb2RlKTogYm9vbGVhbiB7XG4gIGNvbnN0IGNhY2hlID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xuICBpZiAoIWNhY2hlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdGFnU2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgaWYgKGNhY2hlLnRhZ3MpIHtcbiAgICBmb3IgKGNvbnN0IHRhZ0VudHJ5IG9mIGNhY2hlLnRhZ3MpIHtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVUYWcodGFnRW50cnkudGFnKTtcbiAgICAgIGlmIChub3JtYWxpemVkKSB7XG4gICAgICAgIHRhZ1NldC5hZGQobm9ybWFsaXplZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChjb25zdCB0YWcgb2YgZXh0cmFjdEZyb250bWF0dGVyVGFncyhjYWNoZS5mcm9udG1hdHRlcikpIHtcbiAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplVGFnKHRhZyk7XG4gICAgaWYgKG5vcm1hbGl6ZWQpIHtcbiAgICAgIHRhZ1NldC5hZGQobm9ybWFsaXplZCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRhZ01hdGNoTW9kZSA9PT0gJ2FsbCcpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplZEZpbHRlcnMuZXZlcnkoKHRhZykgPT4gdGFnU2V0Lmhhcyh0YWcpKTtcbiAgfVxuXG4gIHJldHVybiBub3JtYWxpemVkRmlsdGVycy5zb21lKCh0YWcpID0+IHRhZ1NldC5oYXModGFnKSk7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RGcm9udG1hdHRlclRhZ3MoZnJvbnRtYXR0ZXI6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZ1tdIHtcbiAgaWYgKCFmcm9udG1hdHRlciB8fCB0eXBlb2YgZnJvbnRtYXR0ZXIgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgcmF3VGFncyA9IGZyb250bWF0dGVyLnRhZ3MgPz8gZnJvbnRtYXR0ZXIudGFnO1xuICBpZiAodHlwZW9mIHJhd1RhZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHJhd1RhZ3Muc3BsaXQoL1tcXHMsXSsvKS5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS5sZW5ndGggPiAwKTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHJhd1RhZ3MpKSB7XG4gICAgcmV0dXJuIHJhd1RhZ3NcbiAgICAgIC5maWx0ZXIoKGVudHJ5KTogZW50cnkgaXMgc3RyaW5nID0+IHR5cGVvZiBlbnRyeSA9PT0gJ3N0cmluZycpXG4gICAgICAubWFwKChlbnRyeSkgPT4gZW50cnkudHJpbSgpKVxuICAgICAgLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApO1xuICB9XG5cbiAgcmV0dXJuIFtdO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFdlaWdodGVkV29yZCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHJlYWRQaXBlbGluZURvY3VtZW50cyB9IGZyb20gJy4uL3BpcGVsaW5lL2FkYXB0ZXJzL29ic2lkaWFuLXNvdXJjZSc7XG5pbXBvcnQgeyBydW5QaXBlbGluZSB9IGZyb20gJy4uL3BpcGVsaW5lL3J1bi1waXBlbGluZSc7XG5pbXBvcnQgdHlwZSB7IFNvdXJjZVNlbGVjdGlvblJ1bGVzIH0gZnJvbSAnLi4vcGlwZWxpbmUvdHlwZXMnO1xuaW1wb3J0IHsgZ2V0QXZhaWxhYmxlVGFncyB9IGZyb20gJy4vdGFnLWZpbHRlcic7XG5cbmV4cG9ydCBjbGFzcyBXb3JkQ2xvdWRQcm9jZXNzb3Ige1xuICBwcml2YXRlIHJlYWRvbmx5IGFwcDogQXBwO1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwKSB7XG4gICAgdGhpcy5hcHAgPSBhcHA7XG4gIH1cblxuICBnZXRBdmFpbGFibGVUYWdzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gZ2V0QXZhaWxhYmxlVGFncyh0aGlzLmFwcCk7XG4gIH1cblxuICBhc3luYyBjb2xsZWN0RnJvbUZpbGVzKFxuICAgIGZpbGVzOiBURmlsZVtdLFxuICAgIHN0b3BXb3JkczogU2V0PHN0cmluZz4sXG4gICAgcmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzLFxuICAgIG9uUHJvZ3Jlc3M/OiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQsXG4gICAgc291cmNlUnVsZXM/OiBTb3VyY2VTZWxlY3Rpb25SdWxlcyxcbiAgKTogUHJvbWlzZTxXZWlnaHRlZFdvcmRbXT4ge1xuICAgIGNvbnN0IHBlcmZvcm1hbmNlID0gZ2V0UGVyZm9ybWFuY2VQcm9maWxlKHJlbmRlclNldHRpbmdzLnByb2dyZXNzRGV0YWlsKTtcbiAgICBjb25zdCByZXBvcnRQcm9ncmVzcyA9IGNyZWF0ZVRocm90dGxlZFByb2dyZXNzKG9uUHJvZ3Jlc3MsIHBlcmZvcm1hbmNlLnByb2dyZXNzVGhyb3R0bGVNcyk7XG4gICAgY29uc3QgcmVhZEJhdGNoU2l6ZSA9IHBlcmZvcm1hbmNlLmZ1bGxQYXJhbGxlbFJlYWRcbiAgICAgID8gTWF0aC5tYXgoMSwgZmlsZXMubGVuZ3RoKVxuICAgICAgOiBNYXRoLm1heCg4LCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLnNjYW5CYXRjaFNpemUpKTtcblxuICAgIGNvbnN0IGRvY3VtZW50cyA9IGF3YWl0IHJlYWRQaXBlbGluZURvY3VtZW50cyhcbiAgICAgIHRoaXMuYXBwLFxuICAgICAgZmlsZXMsXG4gICAgICByZWFkQmF0Y2hTaXplLFxuICAgICAgKG1lc3NhZ2UsIHBlcmNlbnQpID0+IHtcbiAgICAgICAgcmVwb3J0UHJvZ3Jlc3MobWVzc2FnZSwgcGVyY2VudCk7XG4gICAgICB9LFxuICAgICk7XG5cbiAgICByZXBvcnRQcm9ncmVzcygnVG9rZW5pemluZyBhbmQgYWdncmVnYXRpbmcuLi4nLCA4NSk7XG5cbiAgICBjb25zdCBtb2RlbCA9IHJ1blBpcGVsaW5lKHtcbiAgICAgIGRvY3VtZW50cyxcbiAgICAgIHN0b3BXb3JkcyxcbiAgICAgIHJlbmRlclNldHRpbmdzLFxuICAgICAgc291cmNlUnVsZXMsXG4gICAgfSk7XG5cbiAgICByZXBvcnRQcm9ncmVzcygnUHJlcGFyaW5nIGxheW91dC4uLicsIDk1KTtcblxuICAgIHJldHVybiBtb2RlbC53b3JkQ2xvdWRXb3JkcztcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVUaHJvdHRsZWRQcm9ncmVzcyhcbiAgb25Qcm9ncmVzczogKChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4gdm9pZCkgfCB1bmRlZmluZWQsXG4gIG1pbkludGVydmFsTXM6IG51bWJlcixcbik6IChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4gdm9pZCB7XG4gIGlmICghb25Qcm9ncmVzcykge1xuICAgIHJldHVybiAoKSA9PiB1bmRlZmluZWQ7XG4gIH1cblxuICBsZXQgbGFzdFJlcG9ydGVkQXQgPSAwO1xuICBsZXQgbGFzdFBlcmNlbnQgPSAtMTtcblxuICByZXR1cm4gKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBpZiAocGVyY2VudCAhPT0gMTAwICYmIHBlcmNlbnQgPT09IGxhc3RQZXJjZW50ICYmIG5vdyAtIGxhc3RSZXBvcnRlZEF0IDwgbWluSW50ZXJ2YWxNcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGVyY2VudCAhPT0gMTAwICYmIG5vdyAtIGxhc3RSZXBvcnRlZEF0IDwgbWluSW50ZXJ2YWxNcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxhc3RSZXBvcnRlZEF0ID0gbm93O1xuICAgIGxhc3RQZXJjZW50ID0gcGVyY2VudDtcbiAgICBvblByb2dyZXNzKG1lc3NhZ2UsIHBlcmNlbnQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRQZXJmb3JtYW5jZVByb2ZpbGUoZGV0YWlsOiBSZW5kZXJTZXR0aW5nc1sncHJvZ3Jlc3NEZXRhaWwnXSk6IHtcbiAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiBudW1iZXI7XG4gIGZ1bGxQYXJhbGxlbFJlYWQ6IGJvb2xlYW47XG59IHtcbiAgaWYgKGRldGFpbCA9PT0gJ3VuaGluZ2VkJykge1xuICAgIHJldHVybiB7XG4gICAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDFfMDAwXzAwMCxcbiAgICAgIGZ1bGxQYXJhbGxlbFJlYWQ6IHRydWUsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChkZXRhaWwgPT09ICdkZXRhaWxlZCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAyNSxcbiAgICAgIGZ1bGxQYXJhbGxlbFJlYWQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBpZiAoZGV0YWlsID09PSAnbWluaW1hbCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAyMjAsXG4gICAgICBmdWxsUGFyYWxsZWxSZWFkOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDgwLFxuICAgIGZ1bGxQYXJhbGxlbFJlYWQ6IGZhbHNlLFxuICB9O1xufVxuIiwgImltcG9ydCB7IFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBERUZBVUxUX1NUT1BfV09SRFMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUge1xuICBDb3VudExhYmVsRm9ybWF0LFxuICBQcm9ncmVzc0RldGFpbCxcbiAgUmVuZGVyU2V0dGluZ3MsXG4gIFJvdGF0aW9uUHJlc2V0LFxuICBTY2FsaW5nTW9kZSxcbiAgU3BpcmFsVHlwZSxcbiAgV2VpZ2h0ZWRXb3JkLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSBWYXVsdFdvcmRDbG91ZFBsdWdpbiBmcm9tICcuLi9tYWluJztcbmltcG9ydCB7IG1hcENvdW50c1RvV2VpZ2h0ZWRXb3JkcyB9IGZyb20gJy4uL3Byb2Nlc3Npbmcvc2NhbGluZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgV29yZENsb3VkU2V0dGluZ3Mge1xuICBibGFja2xpc3RXb3Jkczogc3RyaW5nW107XG4gIHJlbmRlcjogUmVuZGVyU2V0dGluZ3M7XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBXb3JkQ2xvdWRTZXR0aW5ncyA9IHtcbiAgYmxhY2tsaXN0V29yZHM6IFsuLi5ERUZBVUxUX1NUT1BfV09SRFNdLFxuICByZW5kZXI6IHtcbiAgICByb3RhdGlvblByZXNldDogJ21vc3RseS1ob3Jpem9udGFsJyxcbiAgICBzcGlyYWw6ICdhcmNoaW1lZGVhbicsXG4gICAgd29yZFBhZGRpbmc6IDIsXG4gICAgbWluRm9udFNpemU6IDE0LFxuICAgIG1heEZvbnRTaXplOiA3MixcbiAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgc2NhbGluZ01vZGU6ICdwb3dlcicsXG4gICAgZW1waGFzaXM6IDEsXG4gICAgc2hvd0NvdW50SW5Xb3JkVGV4dDogZmFsc2UsXG4gICAgY291bnRMYWJlbEZvcm1hdDogJ3BhcmVuJyxcbiAgICBjb3VudExhYmVsTWluQ291bnQ6IDEsXG4gICAgcHJvZ3Jlc3NEZXRhaWw6ICdiYWxhbmNlZCcsXG4gICAgc2NhbkJhdGNoU2l6ZTogMjQsXG4gICAgbGF5b3V0VGltZUludGVydmFsTXM6IDE2LFxuICAgIGRldGVybWluaXN0aWNMYXlvdXQ6IGZhbHNlLFxuICAgIHJhbmRvbVNlZWQ6IDQyLFxuICB9LFxufTtcblxuZXhwb3J0IGNsYXNzIFZhdWx0V29yZENsb3VkU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwcml2YXRlIHJlYWRvbmx5IHBsdWdpbjogVmF1bHRXb3JkQ2xvdWRQbHVnaW47XG5cbiAgY29uc3RydWN0b3IocGx1Z2luOiBWYXVsdFdvcmRDbG91ZFBsdWdpbikge1xuICAgIHN1cGVyKHBsdWdpbi5hcHAsIHBsdWdpbik7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gIH1cblxuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ1dvcmQgY2xvdWRzIHNldHRpbmdzJyB9KTtcblxuICAgIGxldCBkcmFmdFdvcmQgPSAnJztcblxuICAgIGNvbnN0IGFkZEV4Y2x1ZGVkV29yZCA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0FkZCBleGNsdWRlZCB3b3JkJylcbiAgICAgIC5zZXREZXNjKCdBZGQgb25lIHdvcmQgYXQgYSB0aW1lIHRvIHRoZSBibGFja2xpc3QuJylcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB7XG4gICAgICAgIHRleHQuc2V0UGxhY2Vob2xkZXIoJ1dvcmQgdG8gZXhjbHVkZScpO1xuICAgICAgICB0ZXh0Lm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgIGRyYWZ0V29yZCA9IHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uXG4gICAgICAgICAgLnNldEJ1dHRvblRleHQoJ0FkZCcpXG4gICAgICAgICAgLnNldEN0YSgpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWRkZWQgPSBhd2FpdCB0aGlzLnBsdWdpbi5hZGRCbGFja2xpc3RXb3JkKGRyYWZ0V29yZCk7XG4gICAgICAgICAgICBpZiAoYWRkZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGFkZEV4Y2x1ZGVkV29yZCwgJ0V4Y2x1ZGVkIHdvcmRzIGFyZSBhbHdheXMgaWdub3JlZCBmcm9tIGNvdW50aW5nIGFuZCBzaXppbmcgaW4gYWxsIGNsb3VkIHR5cGVzLicpO1xuXG4gICAgY29uc3QgbGlzdFdyYXBwZXJFbCA9IGNvbnRhaW5lckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtbGlzdCcgfSk7XG4gICAgbGlzdFdyYXBwZXJFbC5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6ICdFeGNsdWRlZCB3b3JkcycgfSk7XG4gICAgY29uc3QgbGlzdEVsID0gbGlzdFdyYXBwZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXNldHRpbmdzLWJhZGdlcycgfSk7XG4gICAgY29uc3Qgc29ydGVkV29yZHMgPSBbLi4udGhpcy5wbHVnaW4uc2V0dGluZ3MuYmxhY2tsaXN0V29yZHNdLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG5cbiAgICBpZiAoc29ydGVkV29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBsaXN0RWwuY3JlYXRlU3Bhbih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtYmFkZ2VzLWVtcHR5JywgdGV4dDogJ05vIGV4Y2x1ZGVkIHdvcmRzIGNvbmZpZ3VyZWQuJyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCB3b3JkIG9mIHNvcnRlZFdvcmRzKSB7XG4gICAgICAgIGNvbnN0IGJhZGdlRWwgPSBsaXN0RWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zZXR0aW5ncy1iYWRnZScgfSk7XG4gICAgICAgIGJhZGdlRWwuY3JlYXRlU3Bhbih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtYmFkZ2UtdGV4dCcsIHRleHQ6IHdvcmQgfSk7XG5cbiAgICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gYmFkZ2VFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtYmFkZ2UtcmVtb3ZlJyxcbiAgICAgICAgICB0ZXh0OiAneCcsXG4gICAgICAgIH0pO1xuICAgICAgICByZW1vdmVCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsIGBSZW1vdmUgJHt3b3JkfWApO1xuICAgICAgICByZW1vdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4ucmVtb3ZlQmxhY2tsaXN0V29yZCh3b3JkKTtcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVzZXRFeGNsdWRlZFdvcmRzID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUmVzZXQgZXhjbHVkZWQgd29yZHMnKVxuICAgICAgLnNldERlc2MoJ1Jlc3RvcmUgdGhlIG9yaWdpbmFsIGRlZmF1bHQgYmxhY2tsaXN0LicpXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uXG4gICAgICAgICAgLnNldEJ1dHRvblRleHQoJ1Jlc2V0IHRvIGRlZmF1bHRzJylcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5yZXNldEJsYWNrbGlzdFdvcmRzKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24ocmVzZXRFeGNsdWRlZFdvcmRzLCAnUmVzZXRzIG9ubHkgZXhjbHVkZWQgd29yZHMuIFJlbmRlcmluZyBhbmQgcGVyZm9ybWFuY2Ugc2V0dGluZ3MgYXJlIHVuY2hhbmdlZC4nKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMycsIHsgdGV4dDogJ1JlbmRlcmluZycgfSk7XG5cbiAgICBjb25zdCBwcmV2aWV3V3JhcHBlckVsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zZXR0aW5ncy1wcmV2aWV3JyB9KTtcbiAgICBwcmV2aWV3V3JhcHBlckVsLmNyZWF0ZUVsKCdoNCcsIHsgdGV4dDogJ1ByZXZpZXcnIH0pO1xuICAgIHByZXZpZXdXcmFwcGVyRWwuY3JlYXRlRWwoJ3AnLCB7XG4gICAgICB0ZXh0OiAnRXhhbXBsZSBjbG91ZCBmb3IgcmVuZGVyIHNldHRpbmdzIChkb2VzIG5vdCB1c2UgeW91ciB2YXVsdCBkYXRhKS4nLFxuICAgIH0pO1xuICAgIGNvbnN0IHByZXZpZXdDYW52YXNFbCA9IHByZXZpZXdXcmFwcGVyRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zZXR0aW5ncy1wcmV2aWV3LWNhbnZhcycgfSk7XG5cbiAgICBsZXQgcHJldmlld05vbmNlID0gMDtcbiAgICBjb25zdCByZXJlbmRlclByZXZpZXcgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCBub25jZSA9ICsrcHJldmlld05vbmNlO1xuICAgICAgcHJldmlld0NhbnZhc0VsLmVtcHR5KCk7XG4gICAgICBjb25zdCBsb2FkaW5nRWwgPSBwcmV2aWV3Q2FudmFzRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsIHRleHQ6ICdSZW5kZXJpbmcgcHJldmlldy4uLicgfSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHNhbXBsZVdvcmRzID0gdGhpcy5idWlsZFByZXZpZXdXb3Jkcyh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIpO1xuICAgICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLmRyYXdXb3JkQ2xvdWQoe1xuICAgICAgICAgIGNvbnRhaW5lckVsOiBwcmV2aWV3Q2FudmFzRWwsXG4gICAgICAgICAgd29yZHM6IHNhbXBsZVdvcmRzLFxuICAgICAgICAgIGFyaWFMYWJlbDogJ1dvcmQgY2xvdWQgcmVuZGVyIHByZXZpZXcnLFxuICAgICAgICAgIG9uUmVmcmVzaDogcmVyZW5kZXJQcmV2aWV3LFxuICAgICAgICAgIG9uV29yZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAvLyBuby1vcCBpbiBzZXR0aW5ncyBwcmV2aWV3XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlbmFibGVFeHBvcnQ6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICBpZiAobm9uY2UgIT09IHByZXZpZXdOb25jZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICAgICAgcHJldmlld0NhbnZhc0VsLmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsXG4gICAgICAgICAgdGV4dDogJ0NvdWxkIG5vdCByZW5kZXIgcHJldmlldy4nLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlUmVuZGVyQW5kUHJldmlldyA9IGFzeW5jIChwYXRjaDogUGFydGlhbDxSZW5kZXJTZXR0aW5ncz4pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnVwZGF0ZVJlbmRlclNldHRpbmdzKHBhdGNoKTtcbiAgICAgIGF3YWl0IHJlcmVuZGVyUHJldmlldygpO1xuICAgIH07XG5cbiAgICBjb25zdCByb3RhdGlvblN0eWxlID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUm90YXRpb24gc3R5bGUnKVxuICAgICAgLnNldERlc2MoJ0hvdyB3b3JkcyBhcmUgYW5nbGVkIGluIHRoZSBjbG91ZC4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ2hvcml6b250YWwnLCAnSG9yaXpvbnRhbCBvbmx5JylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdtb3N0bHktaG9yaXpvbnRhbCcsICdNb3N0bHkgaG9yaXpvbnRhbCcpXG4gICAgICAgICAgLmFkZE9wdGlvbignbWl4ZWQnLCAnTWl4ZWQgYW5nbGVzJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCd2ZXJ0aWNhbCcsICdWZXJ0aWNhbCBoZWF2eScpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5yb3RhdGlvblByZXNldClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHtcbiAgICAgICAgICAgICAgcm90YXRpb25QcmVzZXQ6IHZhbHVlIGFzIFJvdGF0aW9uUHJlc2V0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHJvdGF0aW9uU3R5bGUsICdIb3Jpem9udGFsIGlzIGVhc2llc3QgdG8gcmVhZC4gTWl4ZWQvdmVydGljYWwgY2FuIHBhY2sgbW9yZSB3b3JkcyBidXQgbWF5IHJlZHVjZSByZWFkYWJpbGl0eS4nKTtcblxuICAgIGNvbnN0IHNwaXJhbExheW91dCA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1NwaXJhbCBsYXlvdXQnKVxuICAgICAgLnNldERlc2MoJ1BsYWNlbWVudCBzdHJhdGVneSBmb3IgcG9zaXRpb25pbmcgd29yZHMuJylcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9uKCdhcmNoaW1lZGVhbicsICdBcmNoaW1lZGVhbicpXG4gICAgICAgICAgLmFkZE9wdGlvbigncmVjdGFuZ3VsYXInLCAnUmVjdGFuZ3VsYXInKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuc3BpcmFsKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoe1xuICAgICAgICAgICAgICBzcGlyYWw6IHZhbHVlIGFzIFNwaXJhbFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oc3BpcmFsTGF5b3V0LCAnQXJjaGltZWRlYW4gaXMgbW9yZSBvcmdhbmljLiBSZWN0YW5ndWxhciBjYW4gYXBwZWFyIHRpZ2h0ZXIgaW4gc29tZSBkYXRhc2V0cy4nKTtcblxuICAgIGNvbnN0IHdvcmRQYWRkaW5nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnV29yZCBwYWRkaW5nJylcbiAgICAgIC5zZXREZXNjKCdTcGFjZSBiZXR3ZWVuIHdvcmRzIGluIHBpeGVscy4nKVxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG4gICAgICAgIHNsaWRlclxuICAgICAgICAgIC5zZXRMaW1pdHMoMCwgMTIsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci53b3JkUGFkZGluZylcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyB3b3JkUGFkZGluZzogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHdvcmRQYWRkaW5nLCAnSW5jcmVhc2UgdG8gcmVkdWNlIGNvbGxpc2lvbnMgYW5kIGltcHJvdmUgcmVhZGFiaWxpdHkuIExvd2VyIHZhbHVlcyBwYWNrIG1vcmUgd29yZHMuJyk7XG5cbiAgICBjb25zdCBtaW5Gb250U2l6ZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ01pbmltdW0gZm9udCBzaXplJylcbiAgICAgIC5zZXREZXNjKCdTbWFsbGVzdCByZW5kZXJlZCB3b3JkIHNpemUuJylcbiAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT4ge1xuICAgICAgICBzbGlkZXJcbiAgICAgICAgICAuc2V0TGltaXRzKDgsIDY0LCAxKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIubWluRm9udFNpemUpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgbWluRm9udFNpemU6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihtaW5Gb250U2l6ZSwgJ1NldHMgdGhlIGZsb29yIG9mIHZpc3VhbCBzaXplIG1hcHBpbmcuIEhpZ2hlciBtaW5pbXVtIG1ha2VzIGxvdy1mcmVxdWVuY3kgd29yZHMgbW9yZSBsZWdpYmxlLicpO1xuXG4gICAgY29uc3QgbWF4Rm9udFNpemUgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdNYXhpbXVtIGZvbnQgc2l6ZScpXG4gICAgICAuc2V0RGVzYygnTGFyZ2VzdCByZW5kZXJlZCB3b3JkIHNpemUuJylcbiAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT4ge1xuICAgICAgICBzbGlkZXJcbiAgICAgICAgICAuc2V0TGltaXRzKDE2LCAxNDAsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5tYXhGb250U2l6ZSlcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyBtYXhGb250U2l6ZTogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKG1heEZvbnRTaXplLCAnU2V0cyB0aGUgY2VpbGluZyBvZiB2aXN1YWwgc2l6ZSBtYXBwaW5nLiBIaWdoZXIgdmFsdWVzIGVtcGhhc2l6ZSB0b3Agd29yZHMgbW9yZSBzdHJvbmdseS4nKTtcblxuICAgIGNvbnN0IGZvbnRGYW1pbHkgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdGb250IGZhbWlseScpXG4gICAgICAuc2V0RGVzYygnQ1NTIGZvbnQgZmFtaWx5IHVzZWQgZm9yIHdvcmRzLicpXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdzYW5zLXNlcmlmJylcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmZvbnRGYW1pbHkpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IGZvbnRGYW1pbHk6IHZhbHVlLnRyaW0oKSB8fCAnc2Fucy1zZXJpZicgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGZvbnRGYW1pbHksICdXaWRlciBmb250cyB0YWtlIG1vcmUgc3BhY2UgYW5kIGNhbiBpbmNyZWFzZSBvdmVybGFwIHByZXNzdXJlLicpO1xuXG4gICAgY29uc3Qgc2hvd0NvdW50SW5Xb3JkVGV4dCA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1Nob3cgY291bnQgaW4gd29yZCB0ZXh0JylcbiAgICAgIC5zZXREZXNjKCdBcHBlbmQgdGhlIG9jY3VycmVuY2UgY291bnQgZGlyZWN0bHkgdG8gcmVuZGVyZWQgd29yZHMuJylcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGVcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnNob3dDb3VudEluV29yZFRleHQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IHNob3dDb3VudEluV29yZFRleHQ6IHZhbHVlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHNob3dDb3VudEluV29yZFRleHQsICdTaG93cyBleGFjdCBjb3VudHMgaW5saW5lIChlLmcuLCB3b3JkICgxMikpLiBJbXByb3ZlcyBwcmVjaXNpb24sIGluY3JlYXNlcyB0ZXh0IGxlbmd0aC4nKTtcblxuICAgIGNvbnN0IGNvdW50TGFiZWxGb3JtYXQgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdDb3VudCBsYWJlbCBmb3JtYXQnKVxuICAgICAgLnNldERlc2MoJ0hvdyBjb3VudHMgYXJlIHNob3duIHdoZW4gY291bnQgbGFiZWxzIGFyZSBlbmFibGVkLicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbigncGFyZW4nLCAnd29yZCAoMTIpJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdkb3QnLCAnd29yZCBcdTAwQjcgMTInKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ2NvbG9uJywgJ3dvcmQ6IDEyJylcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmNvdW50TGFiZWxGb3JtYXQpXG4gICAgICAgICAgLnNldERpc2FibGVkKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuc2hvd0NvdW50SW5Xb3JkVGV4dClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgY291bnRMYWJlbEZvcm1hdDogdmFsdWUgYXMgQ291bnRMYWJlbEZvcm1hdCB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oY291bnRMYWJlbEZvcm1hdCwgJ0Zvcm1hdHRpbmcgc3R5bGUgZm9yIGlubGluZSBjb3VudHMuJyk7XG5cbiAgICBjb25zdCBjb3VudExhYmVsTWluaW11bSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0NvdW50IGxhYmVsIG1pbmltdW0nKVxuICAgICAgLnNldERlc2MoJ1Nob3cgaW5saW5lIGNvdW50IG9ubHkgZm9yIHdvcmRzIGF0IG9yIGFib3ZlIHRoaXMgY291bnQuJylcbiAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT4ge1xuICAgICAgICBzbGlkZXJcbiAgICAgICAgICAuc2V0TGltaXRzKDEsIDEwMCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmNvdW50TGFiZWxNaW5Db3VudClcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5zZXREaXNhYmxlZCghdGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnNob3dDb3VudEluV29yZFRleHQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IGNvdW50TGFiZWxNaW5Db3VudDogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGNvdW50TGFiZWxNaW5pbXVtLCAnQXZvaWRzIHZpc3VhbCBub2lzZSBieSBoaWRpbmcgY291bnRzIGZvciB2ZXJ5IHNtYWxsIHZhbHVlcy4nKTtcblxuICAgIGNvbnN0IHNpemVTY2FsaW5nTW9kZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1NpemUgc2NhbGluZyBtb2RlJylcbiAgICAgIC5zZXREZXNjKCdIb3cgbnVtZXJpYyBjb3VudCBkaWZmZXJlbmNlcyBtYXAgdG8gZm9udC1zaXplIGRpZmZlcmVuY2VzLicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbignbGluZWFyJywgJ0xpbmVhcicpXG4gICAgICAgICAgLmFkZE9wdGlvbigncG93ZXInLCAnUG93ZXInKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ2xvZycsICdMb2cnKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ3JhbmsnLCAnUmFuaycpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5zY2FsaW5nTW9kZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgc2NhbGluZ01vZGU6IHZhbHVlIGFzIFNjYWxpbmdNb2RlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHNpemVTY2FsaW5nTW9kZSwgJ0xpbmVhciBpcyBwcm9wb3J0aW9uYWwuIFBvd2VyIGV4YWdnZXJhdGVzIGdhcHMuIExvZyBjb21wcmVzc2VzIGV4dHJlbWVzLiBSYW5rIGlnbm9yZXMgYWJzb2x1dGUgZ2Fwcy4nKTtcblxuICAgIGNvbnN0IGVtcGhhc2lzID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnRW1waGFzaXMnKVxuICAgICAgLnNldERlc2MoJ0hpZ2hlciB2YWx1ZXMgZXhhZ2dlcmF0ZSBzaXplIGRpZmZlcmVuY2VzIChwb3dlciBzY2FsaW5nIG1vZGUpLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cygwLjUsIDMsIDAuMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmVtcGhhc2lzKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLnNldERpc2FibGVkKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5zY2FsaW5nTW9kZSAhPT0gJ3Bvd2VyJylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgZW1waGFzaXM6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihlbXBoYXNpcywgJ09ubHkgdXNlZCBpbiBQb3dlciBzY2FsaW5nIG1vZGUuIDEuMCBpcyBiYXNlbGluZTsgaGlnaGVyIGV4YWdnZXJhdGVzIGRpZmZlcmVuY2VzIG1vcmUuJyk7XG5cbiAgICBjb25zdCBkZXRlcm1pbmlzdGljTGF5b3V0ID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnRGV0ZXJtaW5pc3RpYyBsYXlvdXQnKVxuICAgICAgLnNldERlc2MoJ0tlZXAgY2xvdWQgbGF5b3V0IHN0YWJsZSBhY3Jvc3MgcmVmcmVzaGVzIHVzaW5nIGEgc2VlZC4nKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuZGV0ZXJtaW5pc3RpY0xheW91dClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgZGV0ZXJtaW5pc3RpY0xheW91dDogdmFsdWUgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oZGV0ZXJtaW5pc3RpY0xheW91dCwgJ1VzZWZ1bCBmb3IgY29tcGFyaW5nIGJlZm9yZS9hZnRlciBjaGFuZ2VzIHdpdGggc3RhYmxlIHBvc2l0aW9ucy4nKTtcblxuICAgIGNvbnN0IHJhbmRvbVNlZWQgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdSYW5kb20gc2VlZCcpXG4gICAgICAuc2V0RGVzYygnU2VlZCB1c2VkIHdoZW4gZGV0ZXJtaW5pc3RpYyBsYXlvdXQgaXMgZW5hYmxlZC4nKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRWYWx1ZShTdHJpbmcodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnJhbmRvbVNlZWQpKVxuICAgICAgICAgIC5zZXREaXNhYmxlZCghdGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmRldGVybWluaXN0aWNMYXlvdXQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XG4gICAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyByYW5kb21TZWVkOiBwYXJzZWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHJhbmRvbVNlZWQsICdDaGFuZ2luZyBzZWVkIGdpdmVzIGEgZGlmZmVyZW50IHN0YWJsZSBhcnJhbmdlbWVudC4nKTtcblxuICAgIGNvbnN0IHJlc2V0UmVuZGVyaW5nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUmVzZXQgcmVuZGVyaW5nIHNldHRpbmdzJylcbiAgICAgIC5zZXREZXNjKCdSZXN0b3JlIGRlZmF1bHQgcmVuZGVyZXIgY29udHJvbHMuJylcbiAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b25cbiAgICAgICAgICAuc2V0QnV0dG9uVGV4dCgnUmVzZXQgcmVuZGVyaW5nJylcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5yZXNldFJlbmRlclNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24ocmVzZXRSZW5kZXJpbmcsICdSZXNldHMgcmVuZGVyaW5nIG9wdGlvbnMgb25seS4nKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMycsIHsgdGV4dDogJ1BlcmZvcm1hbmNlJyB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgncCcsIHtcbiAgICAgIHRleHQ6ICdUdW5lIHNwZWVkIHZzIFVJIHNtb290aG5lc3MgYW5kIHByb2dyZXNzIHVwZGF0ZSBkZXRhaWwgZm9yIGxhcmdlIGNsb3Vkcy4nLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvZ3Jlc3NEZXRhaWwgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdQcm9ncmVzcyBkZXRhaWwnKVxuICAgICAgLnNldERlc2MoJ0hvdyBmcmVxdWVudGx5IHByb2dyZXNzIGlzIHVwZGF0ZWQgd2hpbGUgc2Nhbm5pbmcgYW5kIGxheW91dC4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ3VuaGluZ2VkJywgJ1VuaGluZ2VkIChtYXggc3BlZWQpJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdtaW5pbWFsJywgJ01pbmltYWwgKGZhc3Rlc3QpJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdiYWxhbmNlZCcsICdCYWxhbmNlZCcpXG4gICAgICAgICAgLmFkZE9wdGlvbignZGV0YWlsZWQnLCAnRGV0YWlsZWQnKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIucHJvZ3Jlc3NEZXRhaWwpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udXBkYXRlUmVuZGVyU2V0dGluZ3MoeyBwcm9ncmVzc0RldGFpbDogdmFsdWUgYXMgUHJvZ3Jlc3NEZXRhaWwgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHByb2dyZXNzRGV0YWlsLCAnVW5oaW5nZWQgbWF4aW1pemVzIHNwZWVkIGFuZCBtYXkgbG9jayBVSSB0ZW1wb3JhcmlseS4gRGV0YWlsZWQgaXMgbW9zdCBpbmZvcm1hdGl2ZSBidXQgc2xvd2VyLicpO1xuXG4gICAgY29uc3Qgc2NhbkJhdGNoU2l6ZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1NjYW4gYmF0Y2ggc2l6ZScpXG4gICAgICAuc2V0RGVzYygnSG93IG1hbnkgZmlsZXMgYXJlIHJlYWQgaW4gcGFyYWxsZWwgZHVyaW5nIHZhdWx0IHNjYW5uaW5nLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cyg4LCA2NCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnNjYW5CYXRjaFNpemUpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi51cGRhdGVSZW5kZXJTZXR0aW5ncyh7IHNjYW5CYXRjaFNpemU6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihzY2FuQmF0Y2hTaXplLCAnSGlnaGVyIGNhbiBiZSBmYXN0ZXIgb24gc3Ryb25nIGRldmljZXMgYnV0IHVzZXMgbW9yZSBtZW1vcnkvSU8uJyk7XG5cbiAgICBjb25zdCBsYXlvdXRUaW1lU2xpY2UgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdMYXlvdXQgdGltZSBzbGljZSAobXMpJylcbiAgICAgIC5zZXREZXNjKCdUaW1lIHBlciBsYXlvdXQgY2h1bmsuIExvd2VyIGlzIHNtb290aGVyOyBoaWdoZXIgaXMgZmFzdGVyLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cyg4LCA0MCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmxheW91dFRpbWVJbnRlcnZhbE1zKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udXBkYXRlUmVuZGVyU2V0dGluZ3MoeyBsYXlvdXRUaW1lSW50ZXJ2YWxNczogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGxheW91dFRpbWVTbGljZSwgJ0NvbnRyb2xzIHJlc3BvbnNpdmVuZXNzIHdoaWxlIGxheWluZyBvdXQgd29yZHMuJyk7XG5cbiAgICBjb25zdCByZXNldFBlcmZvcm1hbmNlID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUmVzZXQgcGVyZm9ybWFuY2Ugc2V0dGluZ3MnKVxuICAgICAgLnNldERlc2MoJ1Jlc3RvcmUgZGVmYXVsdCBwZXJmb3JtYW5jZSB0dW5pbmcgdmFsdWVzLicpXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uXG4gICAgICAgICAgLnNldEJ1dHRvblRleHQoJ1Jlc2V0IHBlcmZvcm1hbmNlJylcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi51cGRhdGVSZW5kZXJTZXR0aW5ncyh7XG4gICAgICAgICAgICAgIHByb2dyZXNzRGV0YWlsOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5wcm9ncmVzc0RldGFpbCxcbiAgICAgICAgICAgICAgc2NhbkJhdGNoU2l6ZTogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuc2NhbkJhdGNoU2l6ZSxcbiAgICAgICAgICAgICAgbGF5b3V0VGltZUludGVydmFsTXM6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLmxheW91dFRpbWVJbnRlcnZhbE1zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24ocmVzZXRQZXJmb3JtYW5jZSwgJ1Jlc2V0cyBwZXJmb3JtYW5jZSB0dW5pbmcgb25seS4nKTtcblxuICAgIHZvaWQgcmVyZW5kZXJQcmV2aWV3KCk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaEluZm9JY29uKHNldHRpbmc6IFNldHRpbmcsIGluZm9UZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBpY29uID0gc2V0dGluZy5uYW1lRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIGNsczogJ3dvcmQtY2xvdWQtc2V0dGluZy1pbmZvJyxcbiAgICAgIHRleHQ6ICdpJyxcbiAgICB9KTtcbiAgICBpY29uLnR5cGUgPSAnYnV0dG9uJztcbiAgICBpY29uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnU2hvdyBzZXR0aW5nIGRldGFpbHMnKTtcbiAgICBpY29uLnNldEF0dHIoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicsICd0b3AnKTtcbiAgICBpY29uLnNldEF0dHIoJ2RhdGEtdG9vbHRpcCcsIGluZm9UZXh0KTtcblxuICAgIGNvbnN0IHBvcG92ZXIgPSBzZXR0aW5nLnNldHRpbmdFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLXNldHRpbmctaW5mby1wb3BvdmVyJyB9KTtcbiAgICBwb3BvdmVyLnNldFRleHQoaW5mb1RleHQpO1xuICAgIHBvcG92ZXIuc2V0QXR0cignaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIGljb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgaWYgKHBvcG92ZXIuaGFzQXR0cmlidXRlKCdoaWRkZW4nKSkge1xuICAgICAgICBwb3BvdmVyLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb3BvdmVyLnNldEF0dHIoJ2hpZGRlbicsICd0cnVlJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpY29uLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIHBvcG92ZXIuc2V0QXR0cignaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRQcmV2aWV3V29yZHMocmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzKTogV2VpZ2h0ZWRXb3JkW10ge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gW1xuICAgICAgeyB0ZXh0OiAnb2JzaWRpYW4nLCBjb3VudDogNDggfSxcbiAgICAgIHsgdGV4dDogJ25vdGVzJywgY291bnQ6IDQzIH0sXG4gICAgICB7IHRleHQ6ICdwbHVnaW5zJywgY291bnQ6IDM2IH0sXG4gICAgICB7IHRleHQ6ICd2YXVsdCcsIGNvdW50OiAzMyB9LFxuICAgICAgeyB0ZXh0OiAncmVzZWFyY2gnLCBjb3VudDogMjggfSxcbiAgICAgIHsgdGV4dDogJ2lkZWFzJywgY291bnQ6IDI1IH0sXG4gICAgICB7IHRleHQ6ICd3cml0aW5nJywgY291bnQ6IDIyIH0sXG4gICAgICB7IHRleHQ6ICdkYWlseScsIGNvdW50OiAyMCB9LFxuICAgICAgeyB0ZXh0OiAncHJvamVjdCcsIGNvdW50OiAxOCB9LFxuICAgICAgeyB0ZXh0OiAncmV2aWV3JywgY291bnQ6IDE2IH0sXG4gICAgICB7IHRleHQ6ICdkZXNpZ24nLCBjb3VudDogMTQgfSxcbiAgICAgIHsgdGV4dDogJ21lZXRpbmcnLCBjb3VudDogMTIgfSxcbiAgICAgIHsgdGV4dDogJ3Rhc2tzJywgY291bnQ6IDExIH0sXG4gICAgICB7IHRleHQ6ICdqb3VybmFsJywgY291bnQ6IDEwIH0sXG4gICAgICB7IHRleHQ6ICdkcmFmdCcsIGNvdW50OiA5IH0sXG4gICAgICB7IHRleHQ6ICdyZWFkaW5nJywgY291bnQ6IDggfSxcbiAgICAgIHsgdGV4dDogJ3BsYW4nLCBjb3VudDogNyB9LFxuICAgICAgeyB0ZXh0OiAnZm9jdXMnLCBjb3VudDogNiB9LFxuICAgICAgeyB0ZXh0OiAnaGFiaXQnLCBjb3VudDogNSB9LFxuICAgICAgeyB0ZXh0OiAnZ29hbHMnLCBjb3VudDogNCB9LFxuICAgIF07XG5cbiAgICByZXR1cm4gbWFwQ291bnRzVG9XZWlnaHRlZFdvcmRzKHRlbXBsYXRlLm1hcCgoZW50cnkpID0+IFtlbnRyeS50ZXh0LCBlbnRyeS5jb3VudF0gYXMgW3N0cmluZywgbnVtYmVyXSksIHJlbmRlclNldHRpbmdzKTtcbiAgfVxufVxuIiwgImltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFdlaWdodGVkV29yZCB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcENvdW50c1RvV2VpZ2h0ZWRXb3JkcyhcbiAgZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sXG4gIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyxcbik6IFdlaWdodGVkV29yZFtdIHtcbiAgaWYgKGVudHJpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgbWluRm9udFNpemUgPSBNYXRoLm1heCg4LCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLm1pbkZvbnRTaXplKSk7XG4gIGNvbnN0IG1heEZvbnRTaXplID0gTWF0aC5tYXgobWluRm9udFNpemUgKyAxLCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLm1heEZvbnRTaXplKSk7XG4gIGNvbnN0IGVtcGhhc2lzID0gTWF0aC5tYXgoMC41LCBNYXRoLm1pbigzLCByZW5kZXJTZXR0aW5ncy5lbXBoYXNpcykpO1xuXG4gIGNvbnN0IG5vcm1hbGl6ZWRFbnRyaWVzID0gZW50cmllc1xuICAgIC5tYXAoKFt0ZXh0LCBjb3VudF0sIGluZGV4KSA9PiAoe1xuICAgICAgdGV4dCxcbiAgICAgIGNvdW50LFxuICAgICAgaW5kZXgsXG4gICAgICBzY29yZTogY29tcHV0ZVNjYWxlU2NvcmUoY291bnQsIGluZGV4LCBlbnRyaWVzLCByZW5kZXJTZXR0aW5ncywgZW1waGFzaXMpLFxuICAgIH0pKVxuICAgIC5zb3J0KChhLCBiKSA9PiBiLmNvdW50IC0gYS5jb3VudCB8fCBhLmluZGV4IC0gYi5pbmRleCk7XG5cbiAgcmV0dXJuIG5vcm1hbGl6ZWRFbnRyaWVzLm1hcCgoZW50cnkpID0+IHtcbiAgICBjb25zdCBzaXplID0gTWF0aC5yb3VuZChtaW5Gb250U2l6ZSArIGVudHJ5LnNjb3JlICogKG1heEZvbnRTaXplIC0gbWluRm9udFNpemUpKTtcbiAgICByZXR1cm4ge1xuICAgICAgdGV4dDogZW50cnkudGV4dCxcbiAgICAgIGNvdW50OiBlbnRyeS5jb3VudCxcbiAgICAgIHNpemUsXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVTY2FsZVNjb3JlKFxuICBjb3VudDogbnVtYmVyLFxuICBpbmRleDogbnVtYmVyLFxuICBlbnRyaWVzOiBBcnJheTxbc3RyaW5nLCBudW1iZXJdPixcbiAgcmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzLFxuICBlbXBoYXNpczogbnVtYmVyLFxuKTogbnVtYmVyIHtcbiAgY29uc3QgY291bnRzID0gZW50cmllcy5tYXAoKFssIGVudHJ5Q291bnRdKSA9PiBlbnRyeUNvdW50KTtcbiAgY29uc3QgbWluQ291bnQgPSBjb3VudHNbY291bnRzLmxlbmd0aCAtIDFdO1xuICBjb25zdCBtYXhDb3VudCA9IGNvdW50c1swXTtcblxuICBpZiAobWF4Q291bnQgPD0gbWluQ291bnQpIHtcbiAgICByZXR1cm4gMC41O1xuICB9XG5cbiAgaWYgKHJlbmRlclNldHRpbmdzLnNjYWxpbmdNb2RlID09PSAncmFuaycpIHtcbiAgICBpZiAoZW50cmllcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiAwLjU7XG4gICAgfVxuICAgIHJldHVybiAxIC0gaW5kZXggLyAoZW50cmllcy5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5zY2FsaW5nTW9kZSA9PT0gJ2xvZycpIHtcbiAgICBjb25zdCBzYWZlTWluID0gTWF0aC5tYXgoMSwgbWluQ291bnQpO1xuICAgIGNvbnN0IHNhZmVNYXggPSBNYXRoLm1heChzYWZlTWluICsgMSwgbWF4Q291bnQpO1xuICAgIGNvbnN0IG51bWVyYXRvciA9IE1hdGgubG9nKE1hdGgubWF4KDEsIGNvdW50KSkgLSBNYXRoLmxvZyhzYWZlTWluKTtcbiAgICBjb25zdCBkZW5vbWluYXRvciA9IE1hdGgubG9nKHNhZmVNYXgpIC0gTWF0aC5sb2coc2FmZU1pbik7XG4gICAgcmV0dXJuIGNsYW1wMDEoZGVub21pbmF0b3IgPT09IDAgPyAwLjUgOiBudW1lcmF0b3IgLyBkZW5vbWluYXRvcik7XG4gIH1cblxuICBjb25zdCBsaW5lYXIgPSAoY291bnQgLSBtaW5Db3VudCkgLyAobWF4Q291bnQgLSBtaW5Db3VudCk7XG4gIGlmIChyZW5kZXJTZXR0aW5ncy5zY2FsaW5nTW9kZSA9PT0gJ3Bvd2VyJykge1xuICAgIHJldHVybiBjbGFtcDAxKE1hdGgucG93KGxpbmVhciwgZW1waGFzaXMpKTtcbiAgfVxuXG4gIHJldHVybiBjbGFtcDAxKGxpbmVhcik7XG59XG5cbmZ1bmN0aW9uIGNsYW1wMDEodmFsdWU6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCB2YWx1ZSkpO1xufVxuIiwgImV4cG9ydCBjbGFzcyBJbnRlcm5NYXAgZXh0ZW5kcyBNYXAge1xuICBjb25zdHJ1Y3RvcihlbnRyaWVzLCBrZXkgPSBrZXlvZikge1xuICAgIHN1cGVyKCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge19pbnRlcm46IHt2YWx1ZTogbmV3IE1hcCgpfSwgX2tleToge3ZhbHVlOiBrZXl9fSk7XG4gICAgaWYgKGVudHJpZXMgIT0gbnVsbCkgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZW50cmllcykgdGhpcy5zZXQoa2V5LCB2YWx1ZSk7XG4gIH1cbiAgZ2V0KGtleSkge1xuICAgIHJldHVybiBzdXBlci5nZXQoaW50ZXJuX2dldCh0aGlzLCBrZXkpKTtcbiAgfVxuICBoYXMoa2V5KSB7XG4gICAgcmV0dXJuIHN1cGVyLmhhcyhpbnRlcm5fZ2V0KHRoaXMsIGtleSkpO1xuICB9XG4gIHNldChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLnNldChpbnRlcm5fc2V0KHRoaXMsIGtleSksIHZhbHVlKTtcbiAgfVxuICBkZWxldGUoa2V5KSB7XG4gICAgcmV0dXJuIHN1cGVyLmRlbGV0ZShpbnRlcm5fZGVsZXRlKHRoaXMsIGtleSkpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5TZXQgZXh0ZW5kcyBTZXQge1xuICBjb25zdHJ1Y3Rvcih2YWx1ZXMsIGtleSA9IGtleW9mKSB7XG4gICAgc3VwZXIoKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7X2ludGVybjoge3ZhbHVlOiBuZXcgTWFwKCl9LCBfa2V5OiB7dmFsdWU6IGtleX19KTtcbiAgICBpZiAodmFsdWVzICE9IG51bGwpIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB0aGlzLmFkZCh2YWx1ZSk7XG4gIH1cbiAgaGFzKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmhhcyhpbnRlcm5fZ2V0KHRoaXMsIHZhbHVlKSk7XG4gIH1cbiAgYWRkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmFkZChpbnRlcm5fc2V0KHRoaXMsIHZhbHVlKSk7XG4gIH1cbiAgZGVsZXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmRlbGV0ZShpbnRlcm5fZGVsZXRlKHRoaXMsIHZhbHVlKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW50ZXJuX2dldCh7X2ludGVybiwgX2tleX0sIHZhbHVlKSB7XG4gIGNvbnN0IGtleSA9IF9rZXkodmFsdWUpO1xuICByZXR1cm4gX2ludGVybi5oYXMoa2V5KSA/IF9pbnRlcm4uZ2V0KGtleSkgOiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gaW50ZXJuX3NldCh7X2ludGVybiwgX2tleX0sIHZhbHVlKSB7XG4gIGNvbnN0IGtleSA9IF9rZXkodmFsdWUpO1xuICBpZiAoX2ludGVybi5oYXMoa2V5KSkgcmV0dXJuIF9pbnRlcm4uZ2V0KGtleSk7XG4gIF9pbnRlcm4uc2V0KGtleSwgdmFsdWUpO1xuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGludGVybl9kZWxldGUoe19pbnRlcm4sIF9rZXl9LCB2YWx1ZSkge1xuICBjb25zdCBrZXkgPSBfa2V5KHZhbHVlKTtcbiAgaWYgKF9pbnRlcm4uaGFzKGtleSkpIHtcbiAgICB2YWx1ZSA9IF9pbnRlcm4uZ2V0KGtleSk7XG4gICAgX2ludGVybi5kZWxldGUoa2V5KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGtleW9mKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gaW5pdFJhbmdlKGRvbWFpbiwgcmFuZ2UpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiBicmVhaztcbiAgICBjYXNlIDE6IHRoaXMucmFuZ2UoZG9tYWluKTsgYnJlYWs7XG4gICAgZGVmYXVsdDogdGhpcy5yYW5nZShyYW5nZSkuZG9tYWluKGRvbWFpbik7IGJyZWFrO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdEludGVycG9sYXRvcihkb21haW4sIGludGVycG9sYXRvcikge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IGJyZWFrO1xuICAgIGNhc2UgMToge1xuICAgICAgaWYgKHR5cGVvZiBkb21haW4gPT09IFwiZnVuY3Rpb25cIikgdGhpcy5pbnRlcnBvbGF0b3IoZG9tYWluKTtcbiAgICAgIGVsc2UgdGhpcy5yYW5nZShkb21haW4pO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHRoaXMuZG9tYWluKGRvbWFpbik7XG4gICAgICBpZiAodHlwZW9mIGludGVycG9sYXRvciA9PT0gXCJmdW5jdGlvblwiKSB0aGlzLmludGVycG9sYXRvcihpbnRlcnBvbGF0b3IpO1xuICAgICAgZWxzZSB0aGlzLnJhbmdlKGludGVycG9sYXRvcik7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiaW1wb3J0IHtJbnRlcm5NYXB9IGZyb20gXCJkMy1hcnJheVwiO1xuaW1wb3J0IHtpbml0UmFuZ2V9IGZyb20gXCIuL2luaXQuanNcIjtcblxuZXhwb3J0IGNvbnN0IGltcGxpY2l0ID0gU3ltYm9sKFwiaW1wbGljaXRcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9yZGluYWwoKSB7XG4gIHZhciBpbmRleCA9IG5ldyBJbnRlcm5NYXAoKSxcbiAgICAgIGRvbWFpbiA9IFtdLFxuICAgICAgcmFuZ2UgPSBbXSxcbiAgICAgIHVua25vd24gPSBpbXBsaWNpdDtcblxuICBmdW5jdGlvbiBzY2FsZShkKSB7XG4gICAgbGV0IGkgPSBpbmRleC5nZXQoZCk7XG4gICAgaWYgKGkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHVua25vd24gIT09IGltcGxpY2l0KSByZXR1cm4gdW5rbm93bjtcbiAgICAgIGluZGV4LnNldChkLCBpID0gZG9tYWluLnB1c2goZCkgLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhbmdlW2kgJSByYW5nZS5sZW5ndGhdO1xuICB9XG5cbiAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oXykge1xuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRvbWFpbi5zbGljZSgpO1xuICAgIGRvbWFpbiA9IFtdLCBpbmRleCA9IG5ldyBJbnRlcm5NYXAoKTtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIF8pIHtcbiAgICAgIGlmIChpbmRleC5oYXModmFsdWUpKSBjb250aW51ZTtcbiAgICAgIGluZGV4LnNldCh2YWx1ZSwgZG9tYWluLnB1c2godmFsdWUpIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiBzY2FsZTtcbiAgfTtcblxuICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChyYW5nZSA9IEFycmF5LmZyb20oXyksIHNjYWxlKSA6IHJhbmdlLnNsaWNlKCk7XG4gIH07XG5cbiAgc2NhbGUudW5rbm93biA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh1bmtub3duID0gXywgc2NhbGUpIDogdW5rbm93bjtcbiAgfTtcblxuICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG9yZGluYWwoZG9tYWluLCByYW5nZSkudW5rbm93bih1bmtub3duKTtcbiAgfTtcblxuICBpbml0UmFuZ2UuYXBwbHkoc2NhbGUsIGFyZ3VtZW50cyk7XG5cbiAgcmV0dXJuIHNjYWxlO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICB2YXIgbiA9IHNwZWNpZmllci5sZW5ndGggLyA2IHwgMCwgY29sb3JzID0gbmV3IEFycmF5KG4pLCBpID0gMDtcbiAgd2hpbGUgKGkgPCBuKSBjb2xvcnNbaV0gPSBcIiNcIiArIHNwZWNpZmllci5zbGljZShpICogNiwgKytpICogNik7XG4gIHJldHVybiBjb2xvcnM7XG59XG4iLCAiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbG9ycyhcIjRlNzlhN2YyOGUyY2UxNTc1OTc2YjdiMjU5YTE0ZmVkYzk0OWFmN2FhMWZmOWRhNzljNzU1ZmJhYjBhYlwiKTtcbiIsICJleHBvcnQgdmFyIHhodG1sID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc3ZnOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gIHhodG1sOiB4aHRtbCxcbiAgeGxpbms6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLFxuICB4bWw6IFwiaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlXCIsXG4gIHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvXCJcbn07XG4iLCAiaW1wb3J0IG5hbWVzcGFjZXMgZnJvbSBcIi4vbmFtZXNwYWNlcy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBwcmVmaXggPSBuYW1lICs9IFwiXCIsIGkgPSBwcmVmaXguaW5kZXhPZihcIjpcIik7XG4gIGlmIChpID49IDAgJiYgKHByZWZpeCA9IG5hbWUuc2xpY2UoMCwgaSkpICE9PSBcInhtbG5zXCIpIG5hbWUgPSBuYW1lLnNsaWNlKGkgKyAxKTtcbiAgcmV0dXJuIG5hbWVzcGFjZXMuaGFzT3duUHJvcGVydHkocHJlZml4KSA/IHtzcGFjZTogbmFtZXNwYWNlc1twcmVmaXhdLCBsb2NhbDogbmFtZX0gOiBuYW1lOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xufVxuIiwgImltcG9ydCBuYW1lc3BhY2UgZnJvbSBcIi4vbmFtZXNwYWNlLmpzXCI7XG5pbXBvcnQge3hodG1sfSBmcm9tIFwiLi9uYW1lc3BhY2VzLmpzXCI7XG5cbmZ1bmN0aW9uIGNyZWF0b3JJbmhlcml0KG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBkb2N1bWVudCA9IHRoaXMub3duZXJEb2N1bWVudCxcbiAgICAgICAgdXJpID0gdGhpcy5uYW1lc3BhY2VVUkk7XG4gICAgcmV0dXJuIHVyaSA9PT0geGh0bWwgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm5hbWVzcGFjZVVSSSA9PT0geGh0bWxcbiAgICAgICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpXG4gICAgICAgIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHVyaSwgbmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0b3JGaXhlZChmdWxsbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICB2YXIgZnVsbG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG4gIHJldHVybiAoZnVsbG5hbWUubG9jYWxcbiAgICAgID8gY3JlYXRvckZpeGVkXG4gICAgICA6IGNyZWF0b3JJbmhlcml0KShmdWxsbmFtZSk7XG59XG4iLCAiZnVuY3Rpb24gbm9uZSgpIHt9XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBzZWxlY3RvciA9PSBudWxsID8gbm9uZSA6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICB9O1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IHNlbGVjdG9yIGZyb20gXCIuLi9zZWxlY3Rvci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3QpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3QgIT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gc2VsZWN0b3Ioc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHN1Ymdyb3VwID0gc3ViZ3JvdXBzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBzdWJub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIChzdWJub2RlID0gc2VsZWN0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKSkge1xuICAgICAgICBpZiAoXCJfX2RhdGFfX1wiIGluIG5vZGUpIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgICBzdWJncm91cFtpXSA9IHN1Ym5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsICIvLyBHaXZlbiBzb21ldGhpbmcgYXJyYXkgbGlrZSAob3IgbnVsbCksIHJldHVybnMgc29tZXRoaW5nIHRoYXQgaXMgc3RyaWN0bHkgYW5cbi8vIGFycmF5LiBUaGlzIGlzIHVzZWQgdG8gZW5zdXJlIHRoYXQgYXJyYXktbGlrZSBvYmplY3RzIHBhc3NlZCB0byBkMy5zZWxlY3RBbGxcbi8vIG9yIHNlbGVjdGlvbi5zZWxlY3RBbGwgYXJlIGNvbnZlcnRlZCBpbnRvIHByb3BlciBhcnJheXMgd2hlbiBjcmVhdGluZyBhXG4vLyBzZWxlY3Rpb247IHdlIGRvblx1MjAxOXQgZXZlciB3YW50IHRvIGNyZWF0ZSBhIHNlbGVjdGlvbiBiYWNrZWQgYnkgYSBsaXZlXG4vLyBIVE1MQ29sbGVjdGlvbiBvciBOb2RlTGlzdC4gSG93ZXZlciwgbm90ZSB0aGF0IHNlbGVjdGlvbi5zZWxlY3RBbGwgd2lsbCB1c2UgYVxuLy8gc3RhdGljIE5vZGVMaXN0IGFzIGEgZ3JvdXAsIHNpbmNlIGl0IHNhZmVseSBkZXJpdmVkIGZyb20gcXVlcnlTZWxlY3RvckFsbC5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFycmF5KHgpIHtcbiAgcmV0dXJuIHggPT0gbnVsbCA/IFtdIDogQXJyYXkuaXNBcnJheSh4KSA/IHggOiBBcnJheS5mcm9tKHgpO1xufVxuIiwgImZ1bmN0aW9uIGVtcHR5KCkge1xuICByZXR1cm4gW107XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBzZWxlY3RvciA9PSBudWxsID8gZW1wdHkgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBhcnJheSBmcm9tIFwiLi4vYXJyYXkuanNcIjtcbmltcG9ydCBzZWxlY3RvckFsbCBmcm9tIFwiLi4vc2VsZWN0b3JBbGwuanNcIjtcblxuZnVuY3Rpb24gYXJyYXlBbGwoc2VsZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYXJyYXkoc2VsZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3QpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3QgPT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gYXJyYXlBbGwoc2VsZWN0KTtcbiAgZWxzZSBzZWxlY3QgPSBzZWxlY3RvckFsbChzZWxlY3QpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IFtdLCBwYXJlbnRzID0gW10sIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHN1Ymdyb3Vwcy5wdXNoKHNlbGVjdC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSk7XG4gICAgICAgIHBhcmVudHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzdWJncm91cHMsIHBhcmVudHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaGVzKHNlbGVjdG9yKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoaWxkTWF0Y2hlcihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24obm9kZSkge1xuICAgIHJldHVybiBub2RlLm1hdGNoZXMoc2VsZWN0b3IpO1xuICB9O1xufVxuXG4iLCAiaW1wb3J0IHtjaGlsZE1hdGNoZXJ9IGZyb20gXCIuLi9tYXRjaGVyLmpzXCI7XG5cbnZhciBmaW5kID0gQXJyYXkucHJvdG90eXBlLmZpbmQ7XG5cbmZ1bmN0aW9uIGNoaWxkRmluZChtYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZpbmQuY2FsbCh0aGlzLmNoaWxkcmVuLCBtYXRjaCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNoaWxkRmlyc3QoKSB7XG4gIHJldHVybiB0aGlzLmZpcnN0RWxlbWVudENoaWxkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYXRjaCkge1xuICByZXR1cm4gdGhpcy5zZWxlY3QobWF0Y2ggPT0gbnVsbCA/IGNoaWxkRmlyc3RcbiAgICAgIDogY2hpbGRGaW5kKHR5cGVvZiBtYXRjaCA9PT0gXCJmdW5jdGlvblwiID8gbWF0Y2ggOiBjaGlsZE1hdGNoZXIobWF0Y2gpKSk7XG59XG4iLCAiaW1wb3J0IHtjaGlsZE1hdGNoZXJ9IGZyb20gXCIuLi9tYXRjaGVyLmpzXCI7XG5cbnZhciBmaWx0ZXIgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyO1xuXG5mdW5jdGlvbiBjaGlsZHJlbigpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5jaGlsZHJlbik7XG59XG5cbmZ1bmN0aW9uIGNoaWxkcmVuRmlsdGVyKG1hdGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmlsdGVyLmNhbGwodGhpcy5jaGlsZHJlbiwgbWF0Y2gpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYXRjaCkge1xuICByZXR1cm4gdGhpcy5zZWxlY3RBbGwobWF0Y2ggPT0gbnVsbCA/IGNoaWxkcmVuXG4gICAgICA6IGNoaWxkcmVuRmlsdGVyKHR5cGVvZiBtYXRjaCA9PT0gXCJmdW5jdGlvblwiID8gbWF0Y2ggOiBjaGlsZE1hdGNoZXIobWF0Y2gpKSk7XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQgbWF0Y2hlciBmcm9tIFwiLi4vbWF0Y2hlci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYXRjaCkge1xuICBpZiAodHlwZW9mIG1hdGNoICE9PSBcImZ1bmN0aW9uXCIpIG1hdGNoID0gbWF0Y2hlcihtYXRjaCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzdWJncm91cCA9IHN1Ymdyb3Vwc1tqXSA9IFtdLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIG1hdGNoLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih1cGRhdGUpIHtcbiAgcmV0dXJuIG5ldyBBcnJheSh1cGRhdGUubGVuZ3RoKTtcbn1cbiIsICJpbXBvcnQgc3BhcnNlIGZyb20gXCIuL3NwYXJzZS5qc1wiO1xuaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbih0aGlzLl9lbnRlciB8fCB0aGlzLl9ncm91cHMubWFwKHNwYXJzZSksIHRoaXMuX3BhcmVudHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRW50ZXJOb2RlKHBhcmVudCwgZGF0dW0pIHtcbiAgdGhpcy5vd25lckRvY3VtZW50ID0gcGFyZW50Lm93bmVyRG9jdW1lbnQ7XG4gIHRoaXMubmFtZXNwYWNlVVJJID0gcGFyZW50Lm5hbWVzcGFjZVVSSTtcbiAgdGhpcy5fbmV4dCA9IG51bGw7XG4gIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5fX2RhdGFfXyA9IGRhdHVtO1xufVxuXG5FbnRlck5vZGUucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogRW50ZXJOb2RlLFxuICBhcHBlbmRDaGlsZDogZnVuY3Rpb24oY2hpbGQpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIHRoaXMuX25leHQpOyB9LFxuICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKGNoaWxkLCBuZXh0KSB7IHJldHVybiB0aGlzLl9wYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBuZXh0KTsgfSxcbiAgcXVlcnlTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTsgfSxcbiAgcXVlcnlTZWxlY3RvckFsbDogZnVuY3Rpb24oc2VsZWN0b3IpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTsgfVxufTtcbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geDtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCB7RW50ZXJOb2RlfSBmcm9tIFwiLi9lbnRlci5qc1wiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuLi9jb25zdGFudC5qc1wiO1xuXG5mdW5jdGlvbiBiaW5kSW5kZXgocGFyZW50LCBncm91cCwgZW50ZXIsIHVwZGF0ZSwgZXhpdCwgZGF0YSkge1xuICB2YXIgaSA9IDAsXG4gICAgICBub2RlLFxuICAgICAgZ3JvdXBMZW5ndGggPSBncm91cC5sZW5ndGgsXG4gICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XG5cbiAgLy8gUHV0IGFueSBub24tbnVsbCBub2RlcyB0aGF0IGZpdCBpbnRvIHVwZGF0ZS5cbiAgLy8gUHV0IGFueSBudWxsIG5vZGVzIGludG8gZW50ZXIuXG4gIC8vIFB1dCBhbnkgcmVtYWluaW5nIGRhdGEgaW50byBlbnRlci5cbiAgZm9yICg7IGkgPCBkYXRhTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBub2RlLl9fZGF0YV9fID0gZGF0YVtpXTtcbiAgICAgIHVwZGF0ZVtpXSA9IG5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudGVyW2ldID0gbmV3IEVudGVyTm9kZShwYXJlbnQsIGRhdGFbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFB1dCBhbnkgbm9uLW51bGwgbm9kZXMgdGhhdCBkb25cdTIwMTl0IGZpdCBpbnRvIGV4aXQuXG4gIGZvciAoOyBpIDwgZ3JvdXBMZW5ndGg7ICsraSkge1xuICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBiaW5kS2V5KHBhcmVudCwgZ3JvdXAsIGVudGVyLCB1cGRhdGUsIGV4aXQsIGRhdGEsIGtleSkge1xuICB2YXIgaSxcbiAgICAgIG5vZGUsXG4gICAgICBub2RlQnlLZXlWYWx1ZSA9IG5ldyBNYXAsXG4gICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgIGtleVZhbHVlcyA9IG5ldyBBcnJheShncm91cExlbmd0aCksXG4gICAgICBrZXlWYWx1ZTtcblxuICAvLyBDb21wdXRlIHRoZSBrZXkgZm9yIGVhY2ggbm9kZS5cbiAgLy8gSWYgbXVsdGlwbGUgbm9kZXMgaGF2ZSB0aGUgc2FtZSBrZXksIHRoZSBkdXBsaWNhdGVzIGFyZSBhZGRlZCB0byBleGl0LlxuICBmb3IgKGkgPSAwOyBpIDwgZ3JvdXBMZW5ndGg7ICsraSkge1xuICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgIGtleVZhbHVlc1tpXSA9IGtleVZhbHVlID0ga2V5LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApICsgXCJcIjtcbiAgICAgIGlmIChub2RlQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWUpKSB7XG4gICAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCBub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb21wdXRlIHRoZSBrZXkgZm9yIGVhY2ggZGF0dW0uXG4gIC8vIElmIHRoZXJlIGEgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBrZXksIGpvaW4gYW5kIGFkZCBpdCB0byB1cGRhdGUuXG4gIC8vIElmIHRoZXJlIGlzIG5vdCAob3IgdGhlIGtleSBpcyBhIGR1cGxpY2F0ZSksIGFkZCBpdCB0byBlbnRlci5cbiAgZm9yIChpID0gMDsgaSA8IGRhdGFMZW5ndGg7ICsraSkge1xuICAgIGtleVZhbHVlID0ga2V5LmNhbGwocGFyZW50LCBkYXRhW2ldLCBpLCBkYXRhKSArIFwiXCI7XG4gICAgaWYgKG5vZGUgPSBub2RlQnlLZXlWYWx1ZS5nZXQoa2V5VmFsdWUpKSB7XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICBub2RlQnlLZXlWYWx1ZS5kZWxldGUoa2V5VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgYW55IHJlbWFpbmluZyBub2RlcyB0aGF0IHdlcmUgbm90IGJvdW5kIHRvIGRhdGEgdG8gZXhpdC5cbiAgZm9yIChpID0gMDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKG5vZGVCeUtleVZhbHVlLmdldChrZXlWYWx1ZXNbaV0pID09PSBub2RlKSkge1xuICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRhdHVtKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuX19kYXRhX187XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLCBkYXR1bSk7XG5cbiAgdmFyIGJpbmQgPSBrZXkgPyBiaW5kS2V5IDogYmluZEluZGV4LFxuICAgICAgcGFyZW50cyA9IHRoaXMuX3BhcmVudHMsXG4gICAgICBncm91cHMgPSB0aGlzLl9ncm91cHM7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB2YWx1ZSA9IGNvbnN0YW50KHZhbHVlKTtcblxuICBmb3IgKHZhciBtID0gZ3JvdXBzLmxlbmd0aCwgdXBkYXRlID0gbmV3IEFycmF5KG0pLCBlbnRlciA9IG5ldyBBcnJheShtKSwgZXhpdCA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICB2YXIgcGFyZW50ID0gcGFyZW50c1tqXSxcbiAgICAgICAgZ3JvdXAgPSBncm91cHNbal0sXG4gICAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgICBkYXRhID0gYXJyYXlsaWtlKHZhbHVlLmNhbGwocGFyZW50LCBwYXJlbnQgJiYgcGFyZW50Ll9fZGF0YV9fLCBqLCBwYXJlbnRzKSksXG4gICAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgICAgZW50ZXJHcm91cCA9IGVudGVyW2pdID0gbmV3IEFycmF5KGRhdGFMZW5ndGgpLFxuICAgICAgICB1cGRhdGVHcm91cCA9IHVwZGF0ZVtqXSA9IG5ldyBBcnJheShkYXRhTGVuZ3RoKSxcbiAgICAgICAgZXhpdEdyb3VwID0gZXhpdFtqXSA9IG5ldyBBcnJheShncm91cExlbmd0aCk7XG5cbiAgICBiaW5kKHBhcmVudCwgZ3JvdXAsIGVudGVyR3JvdXAsIHVwZGF0ZUdyb3VwLCBleGl0R3JvdXAsIGRhdGEsIGtleSk7XG5cbiAgICAvLyBOb3cgY29ubmVjdCB0aGUgZW50ZXIgbm9kZXMgdG8gdGhlaXIgZm9sbG93aW5nIHVwZGF0ZSBub2RlLCBzdWNoIHRoYXRcbiAgICAvLyBhcHBlbmRDaGlsZCBjYW4gaW5zZXJ0IHRoZSBtYXRlcmlhbGl6ZWQgZW50ZXIgbm9kZSBiZWZvcmUgdGhpcyBub2RlLFxuICAgIC8vIHJhdGhlciB0aGFuIGF0IHRoZSBlbmQgb2YgdGhlIHBhcmVudCBub2RlLlxuICAgIGZvciAodmFyIGkwID0gMCwgaTEgPSAwLCBwcmV2aW91cywgbmV4dDsgaTAgPCBkYXRhTGVuZ3RoOyArK2kwKSB7XG4gICAgICBpZiAocHJldmlvdXMgPSBlbnRlckdyb3VwW2kwXSkge1xuICAgICAgICBpZiAoaTAgPj0gaTEpIGkxID0gaTAgKyAxO1xuICAgICAgICB3aGlsZSAoIShuZXh0ID0gdXBkYXRlR3JvdXBbaTFdKSAmJiArK2kxIDwgZGF0YUxlbmd0aCk7XG4gICAgICAgIHByZXZpb3VzLl9uZXh0ID0gbmV4dCB8fCBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSA9IG5ldyBTZWxlY3Rpb24odXBkYXRlLCBwYXJlbnRzKTtcbiAgdXBkYXRlLl9lbnRlciA9IGVudGVyO1xuICB1cGRhdGUuX2V4aXQgPSBleGl0O1xuICByZXR1cm4gdXBkYXRlO1xufVxuXG4vLyBHaXZlbiBzb21lIGRhdGEsIHRoaXMgcmV0dXJucyBhbiBhcnJheS1saWtlIHZpZXcgb2YgaXQ6IGFuIG9iamVjdCB0aGF0XG4vLyBleHBvc2VzIGEgbGVuZ3RoIHByb3BlcnR5IGFuZCBhbGxvd3MgbnVtZXJpYyBpbmRleGluZy4gTm90ZSB0aGF0IHVubGlrZVxuLy8gc2VsZWN0QWxsLCB0aGlzIGlzblx1MjAxOXQgd29ycmllZCBhYm91dCBcdTIwMUNsaXZlXHUyMDFEIGNvbGxlY3Rpb25zIGJlY2F1c2UgdGhlIHJlc3VsdGluZ1xuLy8gYXJyYXkgd2lsbCBvbmx5IGJlIHVzZWQgYnJpZWZseSB3aGlsZSBkYXRhIGlzIGJlaW5nIGJvdW5kLiAoSXQgaXMgcG9zc2libGUgdG9cbi8vIGNhdXNlIHRoZSBkYXRhIHRvIGNoYW5nZSB3aGlsZSBpdGVyYXRpbmcgYnkgdXNpbmcgYSBrZXkgZnVuY3Rpb24sIGJ1dCBwbGVhc2Vcbi8vIGRvblx1MjAxOXQ7IHdlXHUyMDE5ZCByYXRoZXIgYXZvaWQgYSBncmF0dWl0b3VzIGNvcHkuKVxuZnVuY3Rpb24gYXJyYXlsaWtlKGRhdGEpIHtcbiAgcmV0dXJuIHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiICYmIFwibGVuZ3RoXCIgaW4gZGF0YVxuICAgID8gZGF0YSAvLyBBcnJheSwgVHlwZWRBcnJheSwgTm9kZUxpc3QsIGFycmF5LWxpa2VcbiAgICA6IEFycmF5LmZyb20oZGF0YSk7IC8vIE1hcCwgU2V0LCBpdGVyYWJsZSwgc3RyaW5nLCBvciBhbnl0aGluZyBlbHNlXG59XG4iLCAiaW1wb3J0IHNwYXJzZSBmcm9tIFwiLi9zcGFyc2UuanNcIjtcbmltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odGhpcy5fZXhpdCB8fCB0aGlzLl9ncm91cHMubWFwKHNwYXJzZSksIHRoaXMuX3BhcmVudHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9uZW50ZXIsIG9udXBkYXRlLCBvbmV4aXQpIHtcbiAgdmFyIGVudGVyID0gdGhpcy5lbnRlcigpLCB1cGRhdGUgPSB0aGlzLCBleGl0ID0gdGhpcy5leGl0KCk7XG4gIGlmICh0eXBlb2Ygb25lbnRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZW50ZXIgPSBvbmVudGVyKGVudGVyKTtcbiAgICBpZiAoZW50ZXIpIGVudGVyID0gZW50ZXIuc2VsZWN0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgZW50ZXIgPSBlbnRlci5hcHBlbmQob25lbnRlciArIFwiXCIpO1xuICB9XG4gIGlmIChvbnVwZGF0ZSAhPSBudWxsKSB7XG4gICAgdXBkYXRlID0gb251cGRhdGUodXBkYXRlKTtcbiAgICBpZiAodXBkYXRlKSB1cGRhdGUgPSB1cGRhdGUuc2VsZWN0aW9uKCk7XG4gIH1cbiAgaWYgKG9uZXhpdCA9PSBudWxsKSBleGl0LnJlbW92ZSgpOyBlbHNlIG9uZXhpdChleGl0KTtcbiAgcmV0dXJuIGVudGVyICYmIHVwZGF0ZSA/IGVudGVyLm1lcmdlKHVwZGF0ZSkub3JkZXIoKSA6IHVwZGF0ZTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29udGV4dCkge1xuICB2YXIgc2VsZWN0aW9uID0gY29udGV4dC5zZWxlY3Rpb24gPyBjb250ZXh0LnNlbGVjdGlvbigpIDogY29udGV4dDtcblxuICBmb3IgKHZhciBncm91cHMwID0gdGhpcy5fZ3JvdXBzLCBncm91cHMxID0gc2VsZWN0aW9uLl9ncm91cHMsIG0wID0gZ3JvdXBzMC5sZW5ndGgsIG0xID0gZ3JvdXBzMS5sZW5ndGgsIG0gPSBNYXRoLm1pbihtMCwgbTEpLCBtZXJnZXMgPSBuZXcgQXJyYXkobTApLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwMCA9IGdyb3VwczBbal0sIGdyb3VwMSA9IGdyb3VwczFbal0sIG4gPSBncm91cDAubGVuZ3RoLCBtZXJnZSA9IG1lcmdlc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXAwW2ldIHx8IGdyb3VwMVtpXSkge1xuICAgICAgICBtZXJnZVtpXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IGogPCBtMDsgKytqKSB7XG4gICAgbWVyZ2VzW2pdID0gZ3JvdXBzMFtqXTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKG1lcmdlcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gLTEsIG0gPSBncm91cHMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gZ3JvdXAubGVuZ3RoIC0gMSwgbmV4dCA9IGdyb3VwW2ldLCBub2RlOyAtLWkgPj0gMDspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgaWYgKG5leHQgJiYgbm9kZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihuZXh0KSBeIDQpIG5leHQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgbmV4dCk7XG4gICAgICAgIG5leHQgPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb21wYXJlKSB7XG4gIGlmICghY29tcGFyZSkgY29tcGFyZSA9IGFzY2VuZGluZztcblxuICBmdW5jdGlvbiBjb21wYXJlTm9kZShhLCBiKSB7XG4gICAgcmV0dXJuIGEgJiYgYiA/IGNvbXBhcmUoYS5fX2RhdGFfXywgYi5fX2RhdGFfXykgOiAhYSAtICFiO1xuICB9XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc29ydGdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc29ydGdyb3VwID0gc29ydGdyb3Vwc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc29ydGdyb3VwW2ldID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gICAgc29ydGdyb3VwLnNvcnQoY29tcGFyZU5vZGUpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc29ydGdyb3VwcywgdGhpcy5fcGFyZW50cykub3JkZXIoKTtcbn1cblxuZnVuY3Rpb24gYXNjZW5kaW5nKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbMF07XG4gIGFyZ3VtZW50c1swXSA9IHRoaXM7XG4gIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgdmFyIG5vZGUgPSBncm91cFtpXTtcbiAgICAgIGlmIChub2RlKSByZXR1cm4gbm9kZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgbGV0IHNpemUgPSAwO1xuICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcykgKytzaXplOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHJldHVybiBzaXplO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMubm9kZSgpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGgsIG5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIGNhbGxiYWNrLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCBuYW1lc3BhY2UgZnJvbSBcIi4uL25hbWVzcGFjZS5qc1wiO1xuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlTlMoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckNvbnN0YW50KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJDb25zdGFudE5TKGZ1bGxuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIHZhbHVlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uTlMoZnVsbG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIHYpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgZnVsbG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICByZXR1cm4gZnVsbG5hbWUubG9jYWxcbiAgICAgICAgPyBub2RlLmdldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbClcbiAgICAgICAgOiBub2RlLmdldEF0dHJpYnV0ZShmdWxsbmFtZSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJSZW1vdmVOUyA6IGF0dHJSZW1vdmUpIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJGdW5jdGlvbk5TIDogYXR0ckZ1bmN0aW9uKVxuICAgICAgOiAoZnVsbG5hbWUubG9jYWwgPyBhdHRyQ29uc3RhbnROUyA6IGF0dHJDb25zdGFudCkpKShmdWxsbmFtZSwgdmFsdWUpKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihub2RlKSB7XG4gIHJldHVybiAobm9kZS5vd25lckRvY3VtZW50ICYmIG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldykgLy8gbm9kZSBpcyBhIE5vZGVcbiAgICAgIHx8IChub2RlLmRvY3VtZW50ICYmIG5vZGUpIC8vIG5vZGUgaXMgYSBXaW5kb3dcbiAgICAgIHx8IG5vZGUuZGVmYXVsdFZpZXc7IC8vIG5vZGUgaXMgYSBEb2N1bWVudFxufVxuIiwgImltcG9ydCBkZWZhdWx0VmlldyBmcm9tIFwiLi4vd2luZG93LmpzXCI7XG5cbmZ1bmN0aW9uIHN0eWxlUmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlQ29uc3RhbnQobmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbHVlLCBwcmlvcml0eSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlRnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdiwgcHJpb3JpdHkpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAxXG4gICAgICA/IHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgPyBzdHlsZVJlbW92ZSA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICA/IHN0eWxlRnVuY3Rpb25cbiAgICAgICAgICAgIDogc3R5bGVDb25zdGFudCkobmFtZSwgdmFsdWUsIHByaW9yaXR5ID09IG51bGwgPyBcIlwiIDogcHJpb3JpdHkpKVxuICAgICAgOiBzdHlsZVZhbHVlKHRoaXMubm9kZSgpLCBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0eWxlVmFsdWUobm9kZSwgbmFtZSkge1xuICByZXR1cm4gbm9kZS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpXG4gICAgICB8fCBkZWZhdWx0Vmlldyhub2RlKS5nZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpLmdldFByb3BlcnR5VmFsdWUobmFtZSk7XG59XG4iLCAiZnVuY3Rpb24gcHJvcGVydHlSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5Q29uc3RhbnQobmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXNbbmFtZV0gPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlGdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgIGVsc2UgdGhpc1tuYW1lXSA9IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMVxuICAgICAgPyB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IHByb3BlcnR5UmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IHByb3BlcnR5RnVuY3Rpb25cbiAgICAgICAgICA6IHByb3BlcnR5Q29uc3RhbnQpKG5hbWUsIHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKClbbmFtZV07XG59XG4iLCAiZnVuY3Rpb24gY2xhc3NBcnJheShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy50cmltKCkuc3BsaXQoL158XFxzKy8pO1xufVxuXG5mdW5jdGlvbiBjbGFzc0xpc3Qobm9kZSkge1xuICByZXR1cm4gbm9kZS5jbGFzc0xpc3QgfHwgbmV3IENsYXNzTGlzdChub2RlKTtcbn1cblxuZnVuY3Rpb24gQ2xhc3NMaXN0KG5vZGUpIHtcbiAgdGhpcy5fbm9kZSA9IG5vZGU7XG4gIHRoaXMuX25hbWVzID0gY2xhc3NBcnJheShub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpO1xufVxuXG5DbGFzc0xpc3QucHJvdG90eXBlID0ge1xuICBhZGQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaSA9IHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICB0aGlzLl9uYW1lcy5wdXNoKG5hbWUpO1xuICAgICAgdGhpcy5fbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLl9uYW1lcy5qb2luKFwiIFwiKSk7XG4gICAgfVxuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaSA9IHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgdGhpcy5fbmFtZXMuc3BsaWNlKGksIDEpO1xuICAgICAgdGhpcy5fbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLl9uYW1lcy5qb2luKFwiIFwiKSk7XG4gICAgfVxuICB9LFxuICBjb250YWluczogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpID49IDA7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNsYXNzZWRBZGQobm9kZSwgbmFtZXMpIHtcbiAgdmFyIGxpc3QgPSBjbGFzc0xpc3Qobm9kZSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIGxpc3QuYWRkKG5hbWVzW2ldKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZFJlbW92ZShub2RlLCBuYW1lcykge1xuICB2YXIgbGlzdCA9IGNsYXNzTGlzdChub2RlKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgbGlzdC5yZW1vdmUobmFtZXNbaV0pO1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkVHJ1ZShuYW1lcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY2xhc3NlZEFkZCh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRGYWxzZShuYW1lcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY2xhc3NlZFJlbW92ZSh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRGdW5jdGlvbihuYW1lcywgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICh2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpID8gY2xhc3NlZEFkZCA6IGNsYXNzZWRSZW1vdmUpKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIG5hbWVzID0gY2xhc3NBcnJheShuYW1lICsgXCJcIik7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIGxpc3QgPSBjbGFzc0xpc3QodGhpcy5ub2RlKCkpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICghbGlzdC5jb250YWlucyhuYW1lc1tpXSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGNsYXNzZWRGdW5jdGlvbiA6IHZhbHVlXG4gICAgICA/IGNsYXNzZWRUcnVlXG4gICAgICA6IGNsYXNzZWRGYWxzZSkobmFtZXMsIHZhbHVlKSk7XG59XG4iLCAiZnVuY3Rpb24gdGV4dFJlbW92ZSgpIHtcbiAgdGhpcy50ZXh0Q29udGVudCA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIHRleHRDb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRleHRDb250ZW50ID0gdiA9PSBudWxsID8gXCJcIiA6IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyB0ZXh0UmVtb3ZlIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyB0ZXh0RnVuY3Rpb25cbiAgICAgICAgICA6IHRleHRDb25zdGFudCkodmFsdWUpKVxuICAgICAgOiB0aGlzLm5vZGUoKS50ZXh0Q29udGVudDtcbn1cbiIsICJmdW5jdGlvbiBodG1sUmVtb3ZlKCkge1xuICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIGh0bWxDb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaHRtbEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IGh0bWxSZW1vdmUgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IGh0bWxGdW5jdGlvblxuICAgICAgICAgIDogaHRtbENvbnN0YW50KSh2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpLmlubmVySFRNTDtcbn1cbiIsICJmdW5jdGlvbiByYWlzZSgpIHtcbiAgaWYgKHRoaXMubmV4dFNpYmxpbmcpIHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gocmFpc2UpO1xufVxuIiwgImZ1bmN0aW9uIGxvd2VyKCkge1xuICBpZiAodGhpcy5wcmV2aW91c1NpYmxpbmcpIHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcywgdGhpcy5wYXJlbnROb2RlLmZpcnN0Q2hpbGQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChsb3dlcik7XG59XG4iLCAiaW1wb3J0IGNyZWF0b3IgZnJvbSBcIi4uL2NyZWF0b3IuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICB2YXIgY3JlYXRlID0gdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiA/IG5hbWUgOiBjcmVhdG9yKG5hbWUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kQ2hpbGQoY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9KTtcbn1cbiIsICJpbXBvcnQgY3JlYXRvciBmcm9tIFwiLi4vY3JlYXRvci5qc1wiO1xuaW1wb3J0IHNlbGVjdG9yIGZyb20gXCIuLi9zZWxlY3Rvci5qc1wiO1xuXG5mdW5jdGlvbiBjb25zdGFudE51bGwoKSB7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgdmFyIGNyZWF0ZSA9IHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lIDogY3JlYXRvcihuYW1lKSxcbiAgICAgIHNlbGVjdCA9IGJlZm9yZSA9PSBudWxsID8gY29uc3RhbnROdWxsIDogdHlwZW9mIGJlZm9yZSA9PT0gXCJmdW5jdGlvblwiID8gYmVmb3JlIDogc2VsZWN0b3IoYmVmb3JlKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmluc2VydEJlZm9yZShjcmVhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgc2VsZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgbnVsbCk7XG4gIH0pO1xufVxuIiwgImZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgaWYgKHBhcmVudCkgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChyZW1vdmUpO1xufVxuIiwgImZ1bmN0aW9uIHNlbGVjdGlvbl9jbG9uZVNoYWxsb3coKSB7XG4gIHZhciBjbG9uZSA9IHRoaXMuY2xvbmVOb2RlKGZhbHNlKSwgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICByZXR1cm4gcGFyZW50ID8gcGFyZW50Lmluc2VydEJlZm9yZShjbG9uZSwgdGhpcy5uZXh0U2libGluZykgOiBjbG9uZTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX2Nsb25lRGVlcCgpIHtcbiAgdmFyIGNsb25lID0gdGhpcy5jbG9uZU5vZGUodHJ1ZSksIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5pbnNlcnRCZWZvcmUoY2xvbmUsIHRoaXMubmV4dFNpYmxpbmcpIDogY2xvbmU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGRlZXApIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGRlZXAgPyBzZWxlY3Rpb25fY2xvbmVEZWVwIDogc2VsZWN0aW9uX2Nsb25lU2hhbGxvdyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5wcm9wZXJ0eShcIl9fZGF0YV9fXCIsIHZhbHVlKVxuICAgICAgOiB0aGlzLm5vZGUoKS5fX2RhdGFfXztcbn1cbiIsICJmdW5jdGlvbiBjb250ZXh0TGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgbGlzdGVuZXIuY2FsbCh0aGlzLCBldmVudCwgdGhpcy5fX2RhdGFfXyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lcykge1xuICByZXR1cm4gdHlwZW5hbWVzLnRyaW0oKS5zcGxpdCgvXnxcXHMrLykubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgbmFtZSA9IFwiXCIsIGkgPSB0LmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChpID49IDApIG5hbWUgPSB0LnNsaWNlKGkgKyAxKSwgdCA9IHQuc2xpY2UoMCwgaSk7XG4gICAgcmV0dXJuIHt0eXBlOiB0LCBuYW1lOiBuYW1lfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG9uUmVtb3ZlKHR5cGVuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb24gPSB0aGlzLl9fb247XG4gICAgaWYgKCFvbikgcmV0dXJuO1xuICAgIGZvciAodmFyIGogPSAwLCBpID0gLTEsIG0gPSBvbi5sZW5ndGgsIG87IGogPCBtOyArK2opIHtcbiAgICAgIGlmIChvID0gb25bal0sICghdHlwZW5hbWUudHlwZSB8fCBvLnR5cGUgPT09IHR5cGVuYW1lLnR5cGUpICYmIG8ubmFtZSA9PT0gdHlwZW5hbWUubmFtZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyLCBvLm9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb25bKytpXSA9IG87XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgrK2kpIG9uLmxlbmd0aCA9IGk7XG4gICAgZWxzZSBkZWxldGUgdGhpcy5fX29uO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvbkFkZCh0eXBlbmFtZSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBvbiA9IHRoaXMuX19vbiwgbywgbGlzdGVuZXIgPSBjb250ZXh0TGlzdGVuZXIodmFsdWUpO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICAgIGlmICgobyA9IG9uW2pdKS50eXBlID09PSB0eXBlbmFtZS50eXBlICYmIG8ubmFtZSA9PT0gdHlwZW5hbWUubmFtZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyLCBvLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyID0gbGlzdGVuZXIsIG8ub3B0aW9ucyA9IG9wdGlvbnMpO1xuICAgICAgICBvLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHR5cGVuYW1lLnR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcbiAgICBvID0ge3R5cGU6IHR5cGVuYW1lLnR5cGUsIG5hbWU6IHR5cGVuYW1lLm5hbWUsIHZhbHVlOiB2YWx1ZSwgbGlzdGVuZXI6IGxpc3RlbmVyLCBvcHRpb25zOiBvcHRpb25zfTtcbiAgICBpZiAoIW9uKSB0aGlzLl9fb24gPSBbb107XG4gICAgZWxzZSBvbi5wdXNoKG8pO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih0eXBlbmFtZSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHR5cGVuYW1lcyA9IHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lICsgXCJcIiksIGksIG4gPSB0eXBlbmFtZXMubGVuZ3RoLCB0O1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBvbiA9IHRoaXMubm9kZSgpLl9fb247XG4gICAgaWYgKG9uKSBmb3IgKHZhciBqID0gMCwgbSA9IG9uLmxlbmd0aCwgbzsgaiA8IG07ICsraikge1xuICAgICAgZm9yIChpID0gMCwgbyA9IG9uW2pdOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGlmICgodCA9IHR5cGVuYW1lc1tpXSkudHlwZSA9PT0gby50eXBlICYmIHQubmFtZSA9PT0gby5uYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIG8udmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgb24gPSB2YWx1ZSA/IG9uQWRkIDogb25SZW1vdmU7XG4gIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHRoaXMuZWFjaChvbih0eXBlbmFtZXNbaV0sIHZhbHVlLCBvcHRpb25zKSk7XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCBkZWZhdWx0VmlldyBmcm9tIFwiLi4vd2luZG93LmpzXCI7XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQobm9kZSwgdHlwZSwgcGFyYW1zKSB7XG4gIHZhciB3aW5kb3cgPSBkZWZhdWx0Vmlldyhub2RlKSxcbiAgICAgIGV2ZW50ID0gd2luZG93LkN1c3RvbUV2ZW50O1xuXG4gIGlmICh0eXBlb2YgZXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGV2ZW50ID0gbmV3IGV2ZW50KHR5cGUsIHBhcmFtcyk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnQgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJFdmVudFwiKTtcbiAgICBpZiAocGFyYW1zKSBldmVudC5pbml0RXZlbnQodHlwZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlKSwgZXZlbnQuZGV0YWlsID0gcGFyYW1zLmRldGFpbDtcbiAgICBlbHNlIGV2ZW50LmluaXRFdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UpO1xuICB9XG5cbiAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hDb25zdGFudCh0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkaXNwYXRjaEV2ZW50KHRoaXMsIHR5cGUsIHBhcmFtcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRnVuY3Rpb24odHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2hFdmVudCh0aGlzLCB0eXBlLCBwYXJhbXMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gdGhpcy5lYWNoKCh0eXBlb2YgcGFyYW1zID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gZGlzcGF0Y2hGdW5jdGlvblxuICAgICAgOiBkaXNwYXRjaENvbnN0YW50KSh0eXBlLCBwYXJhbXMpKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiooKSB7XG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB5aWVsZCBub2RlO1xuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCBzZWxlY3Rpb25fc2VsZWN0IGZyb20gXCIuL3NlbGVjdC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3RBbGwgZnJvbSBcIi4vc2VsZWN0QWxsLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NlbGVjdENoaWxkIGZyb20gXCIuL3NlbGVjdENoaWxkLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NlbGVjdENoaWxkcmVuIGZyb20gXCIuL3NlbGVjdENoaWxkcmVuLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2ZpbHRlciBmcm9tIFwiLi9maWx0ZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGF0YSBmcm9tIFwiLi9kYXRhLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VudGVyIGZyb20gXCIuL2VudGVyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2V4aXQgZnJvbSBcIi4vZXhpdC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9qb2luIGZyb20gXCIuL2pvaW4uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbWVyZ2UgZnJvbSBcIi4vbWVyZ2UuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fb3JkZXIgZnJvbSBcIi4vb3JkZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc29ydCBmcm9tIFwiLi9zb3J0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2NhbGwgZnJvbSBcIi4vY2FsbC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9ub2RlcyBmcm9tIFwiLi9ub2Rlcy5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9ub2RlIGZyb20gXCIuL25vZGUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2l6ZSBmcm9tIFwiLi9zaXplLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VtcHR5IGZyb20gXCIuL2VtcHR5LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VhY2ggZnJvbSBcIi4vZWFjaC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9hdHRyIGZyb20gXCIuL2F0dHIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc3R5bGUgZnJvbSBcIi4vc3R5bGUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fcHJvcGVydHkgZnJvbSBcIi4vcHJvcGVydHkuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fY2xhc3NlZCBmcm9tIFwiLi9jbGFzc2VkLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3RleHQgZnJvbSBcIi4vdGV4dC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9odG1sIGZyb20gXCIuL2h0bWwuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fcmFpc2UgZnJvbSBcIi4vcmFpc2UuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbG93ZXIgZnJvbSBcIi4vbG93ZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fYXBwZW5kIGZyb20gXCIuL2FwcGVuZC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9pbnNlcnQgZnJvbSBcIi4vaW5zZXJ0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3JlbW92ZSBmcm9tIFwiLi9yZW1vdmUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fY2xvbmUgZnJvbSBcIi4vY2xvbmUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGF0dW0gZnJvbSBcIi4vZGF0dW0uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fb24gZnJvbSBcIi4vb24uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGlzcGF0Y2ggZnJvbSBcIi4vZGlzcGF0Y2guanNcIjtcbmltcG9ydCBzZWxlY3Rpb25faXRlcmF0b3IgZnJvbSBcIi4vaXRlcmF0b3IuanNcIjtcblxuZXhwb3J0IHZhciByb290ID0gW251bGxdO1xuXG5leHBvcnQgZnVuY3Rpb24gU2VsZWN0aW9uKGdyb3VwcywgcGFyZW50cykge1xuICB0aGlzLl9ncm91cHMgPSBncm91cHM7XG4gIHRoaXMuX3BhcmVudHMgPSBwYXJlbnRzO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKFtbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XV0sIHJvb3QpO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25fc2VsZWN0aW9uKCkge1xuICByZXR1cm4gdGhpcztcbn1cblxuU2VsZWN0aW9uLnByb3RvdHlwZSA9IHNlbGVjdGlvbi5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBTZWxlY3Rpb24sXG4gIHNlbGVjdDogc2VsZWN0aW9uX3NlbGVjdCxcbiAgc2VsZWN0QWxsOiBzZWxlY3Rpb25fc2VsZWN0QWxsLFxuICBzZWxlY3RDaGlsZDogc2VsZWN0aW9uX3NlbGVjdENoaWxkLFxuICBzZWxlY3RDaGlsZHJlbjogc2VsZWN0aW9uX3NlbGVjdENoaWxkcmVuLFxuICBmaWx0ZXI6IHNlbGVjdGlvbl9maWx0ZXIsXG4gIGRhdGE6IHNlbGVjdGlvbl9kYXRhLFxuICBlbnRlcjogc2VsZWN0aW9uX2VudGVyLFxuICBleGl0OiBzZWxlY3Rpb25fZXhpdCxcbiAgam9pbjogc2VsZWN0aW9uX2pvaW4sXG4gIG1lcmdlOiBzZWxlY3Rpb25fbWVyZ2UsXG4gIHNlbGVjdGlvbjogc2VsZWN0aW9uX3NlbGVjdGlvbixcbiAgb3JkZXI6IHNlbGVjdGlvbl9vcmRlcixcbiAgc29ydDogc2VsZWN0aW9uX3NvcnQsXG4gIGNhbGw6IHNlbGVjdGlvbl9jYWxsLFxuICBub2Rlczogc2VsZWN0aW9uX25vZGVzLFxuICBub2RlOiBzZWxlY3Rpb25fbm9kZSxcbiAgc2l6ZTogc2VsZWN0aW9uX3NpemUsXG4gIGVtcHR5OiBzZWxlY3Rpb25fZW1wdHksXG4gIGVhY2g6IHNlbGVjdGlvbl9lYWNoLFxuICBhdHRyOiBzZWxlY3Rpb25fYXR0cixcbiAgc3R5bGU6IHNlbGVjdGlvbl9zdHlsZSxcbiAgcHJvcGVydHk6IHNlbGVjdGlvbl9wcm9wZXJ0eSxcbiAgY2xhc3NlZDogc2VsZWN0aW9uX2NsYXNzZWQsXG4gIHRleHQ6IHNlbGVjdGlvbl90ZXh0LFxuICBodG1sOiBzZWxlY3Rpb25faHRtbCxcbiAgcmFpc2U6IHNlbGVjdGlvbl9yYWlzZSxcbiAgbG93ZXI6IHNlbGVjdGlvbl9sb3dlcixcbiAgYXBwZW5kOiBzZWxlY3Rpb25fYXBwZW5kLFxuICBpbnNlcnQ6IHNlbGVjdGlvbl9pbnNlcnQsXG4gIHJlbW92ZTogc2VsZWN0aW9uX3JlbW92ZSxcbiAgY2xvbmU6IHNlbGVjdGlvbl9jbG9uZSxcbiAgZGF0dW06IHNlbGVjdGlvbl9kYXR1bSxcbiAgb246IHNlbGVjdGlvbl9vbixcbiAgZGlzcGF0Y2g6IHNlbGVjdGlvbl9kaXNwYXRjaCxcbiAgW1N5bWJvbC5pdGVyYXRvcl06IHNlbGVjdGlvbl9pdGVyYXRvclxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VsZWN0aW9uO1xuIiwgImltcG9ydCB7U2VsZWN0aW9uLCByb290fSBmcm9tIFwiLi9zZWxlY3Rpb24vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIlxuICAgICAgPyBuZXcgU2VsZWN0aW9uKFtbZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcildXSwgW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudF0pXG4gICAgICA6IG5ldyBTZWxlY3Rpb24oW1tzZWxlY3Rvcl1dLCByb290KTtcbn1cbiIsICJpbXBvcnQgeyBzY2FsZU9yZGluYWwgfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgeyBzY2hlbWVUYWJsZWF1MTAgfSBmcm9tICdkMy1zY2FsZS1jaHJvbWF0aWMnO1xuaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7IHNldEljb24gfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IFJlbmRlclNldHRpbmdzLCBSb3RhdGlvblByZXNldCwgV29yZENsb3VkUmVuZGVyT3B0aW9ucywgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5mdW5jdGlvbiBidWlsZERldGVybWluaXN0aWNSYW5kb20oc2VlZDogbnVtYmVyKTogKCkgPT4gbnVtYmVyIHtcbiAgbGV0IHN0YXRlID0gc2VlZCA+Pj4gMDtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBzdGF0ZSA9IChzdGF0ZSArIDB4NkQyQjc5RjUpIHwgMDtcbiAgICBsZXQgdCA9IE1hdGguaW11bChzdGF0ZSBeIChzdGF0ZSA+Pj4gMTUpLCAxIHwgc3RhdGUpO1xuICAgIHQgPSAodCArIE1hdGguaW11bCh0IF4gKHQgPj4+IDcpLCA2MSB8IHQpKSBeIHQ7XG4gICAgcmV0dXJuICgodCBeICh0ID4+PiAxNCkpID4+PiAwKSAvIDQyOTQ5NjcyOTY7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHBpY2tSb3RhdGlvbihyYW5kb206ICgpID0+IG51bWJlciwgcHJlc2V0OiBSb3RhdGlvblByZXNldCk6IG51bWJlciB7XG4gIGlmIChwcmVzZXQgPT09ICdob3Jpem9udGFsJykge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKHByZXNldCA9PT0gJ21vc3RseS1ob3Jpem9udGFsJykge1xuICAgIHJldHVybiByYW5kb20oKSA+IDAuODUgPyA5MCA6IDA7XG4gIH1cblxuICBpZiAocHJlc2V0ID09PSAndmVydGljYWwnKSB7XG4gICAgcmV0dXJuIHJhbmRvbSgpID4gMC4yID8gOTAgOiAwO1xuICB9XG5cbiAgY29uc3QgYW5nbGVzID0gWy05MCwgLTQ1LCAwLCA0NSwgOTBdO1xuICByZXR1cm4gYW5nbGVzW01hdGguZmxvb3IocmFuZG9tKCkgKiBhbmdsZXMubGVuZ3RoKV07XG59XG5cbmZ1bmN0aW9uIGdldFdvcmRMYWJlbCh3b3JkOiBXZWlnaHRlZFdvcmQsIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyk6IHN0cmluZyB7XG4gIGlmICghcmVuZGVyU2V0dGluZ3Muc2hvd0NvdW50SW5Xb3JkVGV4dCB8fCB3b3JkLmNvdW50IDwgcmVuZGVyU2V0dGluZ3MuY291bnRMYWJlbE1pbkNvdW50KSB7XG4gICAgcmV0dXJuIHdvcmQudGV4dDtcbiAgfVxuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5jb3VudExhYmVsRm9ybWF0ID09PSAnZG90Jykge1xuICAgIHJldHVybiBgJHt3b3JkLnRleHR9IFx1MDBCNyAke3dvcmQuY291bnR9YDtcbiAgfVxuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5jb3VudExhYmVsRm9ybWF0ID09PSAnY29sb24nKSB7XG4gICAgcmV0dXJuIGAke3dvcmQudGV4dH06ICR7d29yZC5jb3VudH1gO1xuICB9XG5cbiAgcmV0dXJuIGAke3dvcmQudGV4dH0gKCR7d29yZC5jb3VudH0pYDtcbn1cblxudHlwZSBMYXlvdXRXb3JkID0gV2VpZ2h0ZWRXb3JkICYge1xuICBiYXNlVGV4dDogc3RyaW5nO1xuICBsYXlvdXRUZXh0OiBzdHJpbmc7XG59O1xuXG50eXBlIFZpZXdwb3J0Q29udHJvbHMgPSB7XG4gIHpvb21JbjogKCkgPT4gdm9pZDtcbiAgem9vbU91dDogKCkgPT4gdm9pZDtcbiAgcmVzZXRWaWV3OiAoKSA9PiB2b2lkO1xuICBzaG91bGRTdXBwcmVzc1dvcmRDbGljazogKCkgPT4gYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkcmF3V29yZENsb3VkKG9wdGlvbnM6IFdvcmRDbG91ZFJlbmRlck9wdGlvbnMsIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7IGNvbnRhaW5lckVsLCB3b3JkcywgYXJpYUxhYmVsLCBvbldvcmRDbGljaywgb25Qcm9ncmVzcywgb25SZWZyZXNoIH0gPSBvcHRpb25zO1xuICBjb25zdCBleHBvcnRCYXNlTmFtZSA9IHNhbml0aXplRmlsZU5hbWUob3B0aW9ucy5leHBvcnRCYXNlTmFtZSA/PyAnd29yZC1jbG91ZCcpO1xuICBjb25zdCBlbmFibGVFeHBvcnQgPSBvcHRpb25zLmVuYWJsZUV4cG9ydCA/PyB0cnVlO1xuICBjb25zdCBlbmFibGVPdmVybGF5Q29udHJvbHMgPSBvcHRpb25zLmVuYWJsZU92ZXJsYXlDb250cm9scyA/PyB0cnVlO1xuICBjb25zdCBlbmFibGVWaWV3cG9ydEludGVyYWN0aW9uID0gb3B0aW9ucy5lbmFibGVWaWV3cG9ydEludGVyYWN0aW9uID8/IHRydWU7XG4gIGNvbnN0IHNob3dSZWZyZXNoQ29udHJvbCA9IG9wdGlvbnMuc2hvd1JlZnJlc2hDb250cm9sID8/IHRydWU7XG4gIGNvbnN0IHNob3dab29tQ29udHJvbHMgPSBvcHRpb25zLnNob3dab29tQ29udHJvbHMgPz8gdHJ1ZTtcbiAgY29uc3Qgd2lkdGggPSBNYXRoLm1heCgzMjAsIGNvbnRhaW5lckVsLmNsaWVudFdpZHRoIHx8IDcwMCk7XG4gIGNvbnN0IGhlaWdodCA9IE1hdGgubWF4KDMyMCwgY29udGFpbmVyRWwuY2xpZW50SGVpZ2h0IHx8IDUwMCk7XG4gIGNvbnN0IHJhbmRvbSA9IHJlbmRlclNldHRpbmdzLmRldGVybWluaXN0aWNMYXlvdXQgPyBidWlsZERldGVybWluaXN0aWNSYW5kb20ocmVuZGVyU2V0dGluZ3MucmFuZG9tU2VlZCkgOiBNYXRoLnJhbmRvbTtcbiAgY29uc3QgbGF5b3V0V29yZHM6IExheW91dFdvcmRbXSA9IHdvcmRzLm1hcCgod29yZCkgPT4gKHtcbiAgICAuLi53b3JkLFxuICAgIGJhc2VUZXh0OiB3b3JkLnRleHQsXG4gICAgbGF5b3V0VGV4dDogZ2V0V29yZExhYmVsKHdvcmQsIHJlbmRlclNldHRpbmdzKSxcbiAgfSkpO1xuXG4gIGNvbnRhaW5lckVsLmNsYXNzTGlzdC5hZGQoJ3dvcmQtY2xvdWQtcmVuZGVyLWNvbnRhaW5lcicpO1xuXG4gIGNvbnN0IHN2ZyA9IHNlbGVjdChjb250YWluZXJFbClcbiAgICAuYXBwZW5kKCdzdmcnKVxuICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXG4gICAgLmF0dHIoJ3JvbGUnLCAnaW1nJylcbiAgICAuYXR0cignYXJpYS1sYWJlbCcsIGFyaWFMYWJlbCk7XG5cbiAgY29uc3Qgdmlld3BvcnRHcm91cCA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3b3JkLWNsb3VkLXZpZXdwb3J0Jyk7XG4gIGNvbnN0IGcgPSB2aWV3cG9ydEdyb3VwLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt3aWR0aCAvIDJ9LCR7aGVpZ2h0IC8gMn0pYCk7XG4gIGNvbnN0IHZpZXdwb3J0Q29udHJvbHMgPSBlbmFibGVWaWV3cG9ydEludGVyYWN0aW9uXG4gICAgPyBzZXR1cFZpZXdwb3J0Q29udHJvbHMoc3ZnLm5vZGUoKSwgdmlld3BvcnRHcm91cC5ub2RlKCksIHdpZHRoLCBoZWlnaHQpXG4gICAgOiBjcmVhdGVTdGF0aWNWaWV3cG9ydENvbnRyb2xzKCk7XG5cbiAgY29uc3QgY29sb3IgPSBzY2FsZU9yZGluYWw8c3RyaW5nLCBzdHJpbmc+KHNjaGVtZVRhYmxlYXUxMCk7XG4gIGNvbnN0IHsgZGVmYXVsdDogY2xvdWQgfSA9IGF3YWl0IGltcG9ydCgnZDMtY2xvdWQnKTtcbiAgY29uc3QgcGVyZm9ybWFuY2UgPSBnZXRMYXlvdXRQZXJmb3JtYW5jZVByb2ZpbGUocmVuZGVyU2V0dGluZ3MucHJvZ3Jlc3NEZXRhaWwpO1xuICBjb25zdCByZXBvcnRQcm9ncmVzcyA9IGNyZWF0ZVRocm90dGxlZFByb2dyZXNzKG9uUHJvZ3Jlc3MsIHBlcmZvcm1hbmNlLnByb2dyZXNzVGhyb3R0bGVNcyk7XG4gIGNvbnN0IGxheW91dFRpbWVJbnRlcnZhbCA9IHJlbmRlclNldHRpbmdzLnByb2dyZXNzRGV0YWlsID09PSAndW5oaW5nZWQnXG4gICAgPyBJbmZpbml0eVxuICAgIDogTWF0aC5tYXgoOCwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy5sYXlvdXRUaW1lSW50ZXJ2YWxNcykpO1xuXG4gIGF3YWl0IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IGxhaWRPdXRXb3JkcyA9IDA7XG4gICAgY29uc3QgdG90YWxXb3JkcyA9IE1hdGgubWF4KDEsIGxheW91dFdvcmRzLmxlbmd0aCk7XG5cbiAgICBjbG91ZDxMYXlvdXRXb3JkPigpXG4gICAgICAuc2l6ZShbd2lkdGgsIGhlaWdodF0pXG4gICAgICAud29yZHMobGF5b3V0V29yZHMpXG4gICAgICAudGV4dCgoZCkgPT4gZC5sYXlvdXRUZXh0KVxuICAgICAgLnRpbWVJbnRlcnZhbChsYXlvdXRUaW1lSW50ZXJ2YWwpXG4gICAgICAucGFkZGluZyhNYXRoLm1heCgwLCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLndvcmRQYWRkaW5nKSkpXG4gICAgICAuc3BpcmFsKHJlbmRlclNldHRpbmdzLnNwaXJhbClcbiAgICAgIC5yb3RhdGUoKCkgPT4gcGlja1JvdGF0aW9uKHJhbmRvbSwgcmVuZGVyU2V0dGluZ3Mucm90YXRpb25QcmVzZXQpKVxuICAgICAgLmZvbnQocmVuZGVyU2V0dGluZ3MuZm9udEZhbWlseSB8fCAnc2Fucy1zZXJpZicpXG4gICAgICAuZm9udFNpemUoKGQpID0+IGQuc2l6ZSlcbiAgICAgIC5yYW5kb20ocmFuZG9tKVxuICAgICAgLm9uKCd3b3JkJywgKCkgPT4ge1xuICAgICAgICBsYWlkT3V0V29yZHMgKz0gMTtcbiAgICAgICAgaWYgKGxhaWRPdXRXb3JkcyAlIHBlcmZvcm1hbmNlLndvcmRQcm9ncmVzc1N0cmlkZSA9PT0gMCkge1xuICAgICAgICAgIGNvbnN0IGxheW91dFBlcmNlbnQgPSBNYXRoLm1pbig5OSwgTWF0aC5yb3VuZCgobGFpZE91dFdvcmRzIC8gdG90YWxXb3JkcykgKiAxMDApKTtcbiAgICAgICAgICByZXBvcnRQcm9ncmVzcyhgTGF5aW5nIG91dCB3b3Jkcy4uLiAke2xhaWRPdXRXb3Jkc30vJHtsYXlvdXRXb3Jkcy5sZW5ndGh9YCwgbGF5b3V0UGVyY2VudCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAub24oJ2VuZCcsIChsYXlvdXRXb3JkcykgPT4ge1xuICAgICAgICBnLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAgICAgLmRhdGEobGF5b3V0V29yZHMpXG4gICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIChkKSA9PiBgJHtkLnNpemV9cHhgKVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1mYW1pbHknLCByZW5kZXJTZXR0aW5ncy5mb250RmFtaWx5IHx8ICdzYW5zLXNlcmlmJylcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoXywgaSkgPT4gY29sb3IoU3RyaW5nKGkpKSlcbiAgICAgICAgICAuc3R5bGUoJ2N1cnNvcicsICdwb2ludGVyJylcbiAgICAgICAgICAuYXR0cigndGFiaW5kZXgnLCAwKVxuICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCkgPT4gYHRyYW5zbGF0ZSgke2QueH0sJHtkLnl9KSByb3RhdGUoJHtkLnJvdGF0ZX0pYClcbiAgICAgICAgICAudGV4dCgoZCkgPT4gZC5sYXlvdXRUZXh0KVxuICAgICAgICAgIC5vbignY2xpY2snLCAoXywgZCkgPT4ge1xuICAgICAgICAgICAgaWYgKHZpZXdwb3J0Q29udHJvbHMuc2hvdWxkU3VwcHJlc3NXb3JkQ2xpY2soKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbldvcmRDbGljayhkLmJhc2VUZXh0KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vbigna2V5ZG93bicsIChldmVudDogS2V5Ym9hcmRFdmVudCwgZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJyB8fCBldmVudC5rZXkgPT09ICcgJykge1xuICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICBvbldvcmRDbGljayhkLmJhc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5hcHBlbmQoJ3RpdGxlJylcbiAgICAgICAgICAudGV4dCgoZCkgPT4gYCR7ZC5iYXNlVGV4dH0gKCR7ZC5jb3VudH0pYCk7XG5cbiAgICAgICAgcmVwb3J0UHJvZ3Jlc3MoJ1JlbmRlcmluZyBjb21wbGV0ZS4nLCAxMDApO1xuICAgICAgICBpZiAoZW5hYmxlT3ZlcmxheUNvbnRyb2xzKSB7XG4gICAgICAgICAgcmVuZGVyT3ZlcmxheUNvbnRyb2xzKFxuICAgICAgICAgICAgY29udGFpbmVyRWwsXG4gICAgICAgICAgICBzdmcubm9kZSgpLFxuICAgICAgICAgICAgZXhwb3J0QmFzZU5hbWUsXG4gICAgICAgICAgICBlbmFibGVFeHBvcnQsXG4gICAgICAgICAgICBvblJlZnJlc2gsXG4gICAgICAgICAgICB2aWV3cG9ydENvbnRyb2xzLFxuICAgICAgICAgICAgc2hvd1JlZnJlc2hDb250cm9sLFxuICAgICAgICAgICAgc2hvd1pvb21Db250cm9scyxcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSlcbiAgICAgIC5zdGFydCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3RhdGljVmlld3BvcnRDb250cm9scygpOiBWaWV3cG9ydENvbnRyb2xzIHtcbiAgcmV0dXJuIHtcbiAgICB6b29tSW46ICgpID0+IHVuZGVmaW5lZCxcbiAgICB6b29tT3V0OiAoKSA9PiB1bmRlZmluZWQsXG4gICAgcmVzZXRWaWV3OiAoKSA9PiB1bmRlZmluZWQsXG4gICAgc2hvdWxkU3VwcHJlc3NXb3JkQ2xpY2s6ICgpID0+IGZhbHNlLFxuICB9O1xufVxuXG5mdW5jdGlvbiBzZXR1cFZpZXdwb3J0Q29udHJvbHMoXG4gIHN2Z0VsOiBTVkdTVkdFbGVtZW50IHwgbnVsbCxcbiAgdmlld3BvcnRFbDogU1ZHR0VsZW1lbnQgfCBudWxsLFxuICB3aWR0aDogbnVtYmVyLFxuICBoZWlnaHQ6IG51bWJlcixcbik6IFZpZXdwb3J0Q29udHJvbHMge1xuICBpZiAoIXN2Z0VsIHx8ICF2aWV3cG9ydEVsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHpvb21JbjogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgem9vbU91dDogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgcmVzZXRWaWV3OiAoKSA9PiB1bmRlZmluZWQsXG4gICAgICBzaG91bGRTdXBwcmVzc1dvcmRDbGljazogKCkgPT4gZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIGxldCBwYW5YID0gMDtcbiAgbGV0IHBhblkgPSAwO1xuICBsZXQgem9vbSA9IDE7XG4gIGxldCBzdXBwcmVzc1dvcmRDbGlja1VudGlsID0gMDtcbiAgbGV0IHBvaW50ZXJJZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIGxldCBkcmFnU3RhcnRYID0gMDtcbiAgbGV0IGRyYWdTdGFydFkgPSAwO1xuICBsZXQgbGFzdFBvaW50ZXJYID0gMDtcbiAgbGV0IGxhc3RQb2ludGVyWSA9IDA7XG4gIGxldCBwb2ludGVyTW92ZWQgPSBmYWxzZTtcbiAgbGV0IGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgY29uc3QgbWluWm9vbSA9IDAuMzU7XG4gIGNvbnN0IG1heFpvb20gPSA0LjU7XG4gIGNvbnN0IGRyYWdTdGFydFRocmVzaG9sZFB4ID0gNztcblxuICBjb25zdCBjbGFtcFpvb20gPSAodmFsdWU6IG51bWJlcik6IG51bWJlciA9PiB7XG4gICAgaWYgKE51bWJlci5pc05hTih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB6b29tO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5taW4obWF4Wm9vbSwgTWF0aC5tYXgobWluWm9vbSwgdmFsdWUpKTtcbiAgfTtcblxuICBjb25zdCBhcHBseVRyYW5zZm9ybSA9ICgpOiB2b2lkID0+IHtcbiAgICB2aWV3cG9ydEVsLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3Bhblh9LCR7cGFuWX0pIHNjYWxlKCR7em9vbX0pYCk7XG4gIH07XG5cbiAgY29uc3Qgem9vbUF0ID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCBmYWN0b3I6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGZhY3RvcikgfHwgZmFjdG9yIDw9IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0Wm9vbSA9IGNsYW1wWm9vbSh6b29tICogZmFjdG9yKTtcbiAgICBpZiAobmV4dFpvb20gPT09IHpvb20pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3b3JsZFggPSAoeCAtIHBhblgpIC8gem9vbTtcbiAgICBjb25zdCB3b3JsZFkgPSAoeSAtIHBhblkpIC8gem9vbTtcbiAgICBwYW5YID0geCAtICh3b3JsZFggKiBuZXh0Wm9vbSk7XG4gICAgcGFuWSA9IHkgLSAod29ybGRZICogbmV4dFpvb20pO1xuICAgIHpvb20gPSBuZXh0Wm9vbTtcbiAgICBhcHBseVRyYW5zZm9ybSgpO1xuICB9O1xuXG4gIGNvbnN0IG51ZGdlUGFuID0gKGRlbHRhWDogbnVtYmVyLCBkZWx0YVk6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIHBhblggKz0gZGVsdGFYO1xuICAgIHBhblkgKz0gZGVsdGFZO1xuICAgIGFwcGx5VHJhbnNmb3JtKCk7XG4gIH07XG5cbiAgY29uc3Qgem9vbUluID0gKCk6IHZvaWQgPT4gem9vbUF0KHdpZHRoIC8gMiwgaGVpZ2h0IC8gMiwgMS4xOCk7XG4gIGNvbnN0IHpvb21PdXQgPSAoKTogdm9pZCA9PiB6b29tQXQod2lkdGggLyAyLCBoZWlnaHQgLyAyLCAxIC8gMS4xOCk7XG4gIGNvbnN0IHJlc2V0VmlldyA9ICgpOiB2b2lkID0+IHtcbiAgICBwYW5YID0gMDtcbiAgICBwYW5ZID0gMDtcbiAgICB6b29tID0gMTtcbiAgICBhcHBseVRyYW5zZm9ybSgpO1xuICB9O1xuXG4gIGFwcGx5VHJhbnNmb3JtKCk7XG4gIHN2Z0VsLmNsYXNzTGlzdC5hZGQoJ3dvcmQtY2xvdWQtcGFuem9vbS1zdXJmYWNlJyk7XG4gIHN2Z0VsLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICBzdmdFbC5zZXRBdHRyaWJ1dGUoXG4gICAgJ2FyaWEta2V5c2hvcnRjdXRzJyxcbiAgICAnKywgLSwgMCwgQXJyb3dMZWZ0LCBBcnJvd1JpZ2h0LCBBcnJvd1VwLCBBcnJvd0Rvd24nLFxuICApO1xuXG4gIHN2Z0VsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgKGV2ZW50OiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQucG9pbnRlclR5cGUgIT09ICd0b3VjaCcgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3ZnRWwuZm9jdXMoeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pO1xuICAgIHBvaW50ZXJJZCA9IGV2ZW50LnBvaW50ZXJJZDtcbiAgICBkcmFnU3RhcnRYID0gZXZlbnQuY2xpZW50WDtcbiAgICBkcmFnU3RhcnRZID0gZXZlbnQuY2xpZW50WTtcbiAgICBsYXN0UG9pbnRlclggPSBldmVudC5jbGllbnRYO1xuICAgIGxhc3RQb2ludGVyWSA9IGV2ZW50LmNsaWVudFk7XG4gICAgcG9pbnRlck1vdmVkID0gZmFsc2U7XG4gICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICB9KTtcblxuICBzdmdFbC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIChldmVudDogUG9pbnRlckV2ZW50KSA9PiB7XG4gICAgaWYgKHBvaW50ZXJJZCAhPT0gZXZlbnQucG9pbnRlcklkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFpc0RyYWdnaW5nKSB7XG4gICAgICBjb25zdCBkcmFnRGlzdGFuY2UgPSBNYXRoLmh5cG90KGV2ZW50LmNsaWVudFggLSBkcmFnU3RhcnRYLCBldmVudC5jbGllbnRZIC0gZHJhZ1N0YXJ0WSk7XG4gICAgICBpZiAoZHJhZ0Rpc3RhbmNlIDwgZHJhZ1N0YXJ0VGhyZXNob2xkUHgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgIHBvaW50ZXJNb3ZlZCA9IHRydWU7XG4gICAgICBsYXN0UG9pbnRlclggPSBldmVudC5jbGllbnRYO1xuICAgICAgbGFzdFBvaW50ZXJZID0gZXZlbnQuY2xpZW50WTtcbiAgICAgIHN2Z0VsLnNldFBvaW50ZXJDYXB0dXJlKGV2ZW50LnBvaW50ZXJJZCk7XG4gICAgICBzdmdFbC5jbGFzc0xpc3QuYWRkKCdpcy1wYW5uaW5nJyk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRlbHRhWCA9IGV2ZW50LmNsaWVudFggLSBsYXN0UG9pbnRlclg7XG4gICAgY29uc3QgZGVsdGFZID0gZXZlbnQuY2xpZW50WSAtIGxhc3RQb2ludGVyWTtcbiAgICBsYXN0UG9pbnRlclggPSBldmVudC5jbGllbnRYO1xuICAgIGxhc3RQb2ludGVyWSA9IGV2ZW50LmNsaWVudFk7XG5cbiAgICBudWRnZVBhbihkZWx0YVgsIGRlbHRhWSk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG5cbiAgc3ZnRWwuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgKGV2ZW50OiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICBpZiAocG9pbnRlcklkICE9PSBldmVudC5wb2ludGVySWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocG9pbnRlck1vdmVkKSB7XG4gICAgICBzdXBwcmVzc1dvcmRDbGlja1VudGlsID0gRGF0ZS5ub3coKSArIDI0MDtcbiAgICB9XG4gICAgcG9pbnRlcklkID0gbnVsbDtcbiAgICBwb2ludGVyTW92ZWQgPSBmYWxzZTtcbiAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgc3ZnRWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtcGFubmluZycpO1xuICAgIGlmIChzdmdFbC5oYXNQb2ludGVyQ2FwdHVyZShldmVudC5wb2ludGVySWQpKSB7XG4gICAgICBzdmdFbC5yZWxlYXNlUG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKTtcbiAgICB9XG4gIH0pO1xuXG4gIHN2Z0VsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCAoZXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgIGlmIChwb2ludGVySWQgIT09IGV2ZW50LnBvaW50ZXJJZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBvaW50ZXJJZCA9IG51bGw7XG4gICAgcG9pbnRlck1vdmVkID0gZmFsc2U7XG4gICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIHN2Z0VsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXBhbm5pbmcnKTtcbiAgICBpZiAoc3ZnRWwuaGFzUG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKSkge1xuICAgICAgc3ZnRWwucmVsZWFzZVBvaW50ZXJDYXB0dXJlKGV2ZW50LnBvaW50ZXJJZCk7XG4gICAgfVxuICB9KTtcblxuICBzdmdFbC5hZGRFdmVudExpc3RlbmVyKFxuICAgICd3aGVlbCcsXG4gICAgKGV2ZW50OiBXaGVlbEV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qgc3BlZWQgPSBldmVudC5kZWx0YU1vZGUgPT09IFdoZWVsRXZlbnQuRE9NX0RFTFRBX0xJTkUgPyAwLjA0IDogMC4wMDIzO1xuICAgICAgY29uc3Qgem9vbUZhY3RvciA9IE1hdGguZXhwKC1ldmVudC5kZWx0YVkgKiBzcGVlZCk7XG4gICAgICB6b29tQXQoZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WSwgem9vbUZhY3Rvcik7XG4gICAgfSxcbiAgICB7IHBhc3NpdmU6IGZhbHNlIH0sXG4gICk7XG5cbiAgc3ZnRWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09ICcrJyB8fCBldmVudC5rZXkgPT09ICc9JyB8fCBldmVudC5rZXkgPT09ICdOdW1wYWRBZGQnKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgem9vbUluKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJy0nIHx8IGV2ZW50LmtleSA9PT0gJ18nIHx8IGV2ZW50LmtleSA9PT0gJ051bXBhZFN1YnRyYWN0Jykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHpvb21PdXQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnMCcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXNldFZpZXcoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYW5TdGVwID0gMzY7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93TGVmdCcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBudWRnZVBhbihwYW5TdGVwLCAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93UmlnaHQnKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgbnVkZ2VQYW4oLXBhblN0ZXAsIDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dVcCcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBudWRnZVBhbigwLCBwYW5TdGVwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBudWRnZVBhbigwLCAtcGFuU3RlcCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHpvb21JbixcbiAgICB6b29tT3V0LFxuICAgIHJlc2V0VmlldyxcbiAgICBzaG91bGRTdXBwcmVzc1dvcmRDbGljazogKCkgPT4gRGF0ZS5ub3coKSA8IHN1cHByZXNzV29yZENsaWNrVW50aWwsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbmRlck92ZXJsYXlDb250cm9scyhcbiAgY29udGFpbmVyRWw6IEhUTUxEaXZFbGVtZW50LFxuICBzdmdFbDogU1ZHU1ZHRWxlbWVudCB8IG51bGwsXG4gIGV4cG9ydEJhc2VOYW1lOiBzdHJpbmcsXG4gIGVuYWJsZUV4cG9ydDogYm9vbGVhbixcbiAgb25SZWZyZXNoOiAoKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPixcbiAgdmlld3BvcnRDb250cm9sczogVmlld3BvcnRDb250cm9scyxcbiAgc2hvd1JlZnJlc2hDb250cm9sOiBib29sZWFuLFxuICBzaG93Wm9vbUNvbnRyb2xzOiBib29sZWFuLFxuKTogdm9pZCB7XG4gIGlmICghc3ZnRWwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBtYWtlUmVmcmVzaEJ1dHRvbiA9IChwYXJlbnRFbDogSFRNTERpdkVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoIXNob3dSZWZyZXNoQ29udHJvbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlZnJlc2hCdXR0b24gPSBwYXJlbnRFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgY2xzOiAnd29yZC1jbG91ZC1yZWZyZXNoLWJ1dHRvbicsXG4gICAgfSk7XG4gICAgcmVmcmVzaEJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgc2V0SWNvbihyZWZyZXNoQnV0dG9uLCAncm90YXRlLWN3Jyk7XG4gICAgcmVmcmVzaEJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1JlZnJlc2ggd29yZCBjbG91ZCcpO1xuXG4gICAgbGV0IGlzUmVmcmVzaGluZyA9IGZhbHNlO1xuICAgIHJlZnJlc2hCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoaXNSZWZyZXNoaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaXNSZWZyZXNoaW5nID0gdHJ1ZTtcbiAgICAgIHJlZnJlc2hCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgb25SZWZyZXNoKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAocmVmcmVzaEJ1dHRvbi5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgIHJlZnJlc2hCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpc1JlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBpZiAoc2hvd1pvb21Db250cm9scykge1xuICAgIGNvbnN0IHZpZXdDb250cm9sc0VsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC12aWV3LWNvbnRyb2xzJyB9KTtcbiAgICBjb25zdCB6b29tT3V0QnV0dG9uID0gdmlld0NvbnRyb2xzRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIGNsczogJ3dvcmQtY2xvdWQtdmlldy1idXR0b24nLFxuICAgIH0pO1xuICAgIHpvb21PdXRCdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIHNldEljb24oem9vbU91dEJ1dHRvbiwgJ21pbnVzJyk7XG4gICAgem9vbU91dEJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1pvb20gb3V0Jyk7XG4gICAgem9vbU91dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHZpZXdwb3J0Q29udHJvbHMuem9vbU91dCgpKTtcblxuICAgIGNvbnN0IHJlc2V0Vmlld0J1dHRvbiA9IHZpZXdDb250cm9sc0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICBjbHM6ICd3b3JkLWNsb3VkLXZpZXctYnV0dG9uJyxcbiAgICB9KTtcbiAgICByZXNldFZpZXdCdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIHNldEljb24ocmVzZXRWaWV3QnV0dG9uLCAnbG9jYXRlLWZpeGVkJyk7XG4gICAgcmVzZXRWaWV3QnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnUmVzZXQgcGFuIGFuZCB6b29tJyk7XG4gICAgcmVzZXRWaWV3QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdmlld3BvcnRDb250cm9scy5yZXNldFZpZXcoKSk7XG5cbiAgICBjb25zdCB6b29tSW5CdXR0b24gPSB2aWV3Q29udHJvbHNFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgY2xzOiAnd29yZC1jbG91ZC12aWV3LWJ1dHRvbicsXG4gICAgfSk7XG4gICAgem9vbUluQnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICBzZXRJY29uKHpvb21JbkJ1dHRvbiwgJ3BsdXMnKTtcbiAgICB6b29tSW5CdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsICdab29tIGluJyk7XG4gICAgem9vbUluQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdmlld3BvcnRDb250cm9scy56b29tSW4oKSk7XG4gIH1cblxuICBpZiAoIWVuYWJsZUV4cG9ydCkge1xuICAgIGlmICghc2hvd1pvb21Db250cm9scykge1xuICAgICAgY29uc3QgZmFsbGJhY2tDb250cm9sc0VsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1leHBvcnQtY29udHJvbHMnIH0pO1xuICAgICAgbWFrZVJlZnJlc2hCdXR0b24oZmFsbGJhY2tDb250cm9sc0VsKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgZXhwb3J0Q29udHJvbHNFbCA9IGNvbnRhaW5lckVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZXhwb3J0LWNvbnRyb2xzJyB9KTtcbiAgY29uc3QgbWVudUJ1dHRvbiA9IGV4cG9ydENvbnRyb2xzRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICBjbHM6ICd3b3JkLWNsb3VkLW1lbnUtYnV0dG9uJyxcbiAgICB0ZXh0OiAnXHUyMkVGJyxcbiAgfSk7XG4gIG1lbnVCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsICdXb3JkIGNsb3VkIG9wdGlvbnMnKTtcblxuICBtYWtlUmVmcmVzaEJ1dHRvbihleHBvcnRDb250cm9sc0VsKTtcblxuICBjb25zdCBtZW51RWwgPSBleHBvcnRDb250cm9sc0VsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtbWVudScgfSk7XG4gIG1lbnVFbC5zZXRBdHRyKCdoaWRkZW4nLCAndHJ1ZScpO1xuICBsZXQgcmVtb3ZlT3V0c2lkZUxpc3RlbmVyOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcblxuICBjb25zdCB0b2dnbGVNZW51ID0gKG9wZW46IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICBpZiAob3Blbikge1xuICAgICAgbWVudUVsLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICBjb25zdCBvbk91dHNpZGVDbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIE5vZGUpKSB7XG4gICAgICAgICAgdG9nZ2xlTWVudShmYWxzZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZXhwb3J0Q29udHJvbHNFbC5jb250YWlucyh0YXJnZXQpKSB7XG4gICAgICAgICAgdG9nZ2xlTWVudShmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk91dHNpZGVDbGljaywgdHJ1ZSk7XG4gICAgICByZW1vdmVPdXRzaWRlTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uT3V0c2lkZUNsaWNrLCB0cnVlKTtcbiAgICAgICAgcmVtb3ZlT3V0c2lkZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lbnVFbC5zZXRBdHRyKCdoaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgaWYgKHJlbW92ZU91dHNpZGVMaXN0ZW5lcikge1xuICAgICAgICByZW1vdmVPdXRzaWRlTGlzdGVuZXIoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgbWFrZU1lbnVJdGVtID0gKGxhYmVsOiBzdHJpbmcsIGZvcm1hdDogJ3N2ZycgfCAncG5nJyB8ICdqcGVnJykgPT4ge1xuICAgIGNvbnN0IGJ1dHRvbiA9IG1lbnVFbC5jcmVhdGVFbCgnYnV0dG9uJywgeyBjbHM6ICd3b3JkLWNsb3VkLW1lbnUtaXRlbScsIHRleHQ6IGBFeHBvcnQgJHtsYWJlbH1gIH0pO1xuICAgIGJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgYEV4cG9ydCBhcyAke2xhYmVsfWApO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgZXhwb3J0U3ZnKHN2Z0VsLCBmb3JtYXQsIGV4cG9ydEJhc2VOYW1lKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1dvcmQgY2xvdWRzOiBleHBvcnQgZmFpbGVkJywgZXJyb3IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdG9nZ2xlTWVudShmYWxzZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgbWFrZU1lbnVJdGVtKCdTVkcnLCAnc3ZnJyk7XG4gIG1ha2VNZW51SXRlbSgnUE5HJywgJ3BuZycpO1xuICBtYWtlTWVudUl0ZW0oJ0pQRUcnLCAnanBlZycpO1xuXG4gIG1lbnVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRvZ2dsZU1lbnUobWVudUVsLmhhc0F0dHJpYnV0ZSgnaGlkZGVuJykpO1xuICB9KTtcblxuICBtZW51QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgdG9nZ2xlTWVudShmYWxzZSk7XG4gICAgfVxuICB9KTtcblxuICBtZW51RWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdG9nZ2xlTWVudShmYWxzZSk7XG4gICAgICBtZW51QnV0dG9uLmZvY3VzKCk7XG4gICAgfVxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZXhwb3J0U3ZnKHN2Z0VsOiBTVkdTVkdFbGVtZW50LCBmb3JtYXQ6ICdzdmcnIHwgJ3BuZycgfCAnanBlZycsIGJhc2VOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qgc3ZnVGV4dCA9IG5ldyBYTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcoc3ZnRWwpO1xuICBjb25zdCBzdmdCbG9iID0gbmV3IEJsb2IoW3N2Z1RleHRdLCB7IHR5cGU6ICdpbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLTgnIH0pO1xuXG4gIGlmIChmb3JtYXQgPT09ICdzdmcnKSB7XG4gICAgdHJpZ2dlckJsb2JEb3dubG9hZChzdmdCbG9iLCBgJHtiYXNlTmFtZX0uc3ZnYCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgd2lkdGggPSBOdW1iZXIoc3ZnRWwuZ2V0QXR0cmlidXRlKCd3aWR0aCcpID8/IHN2Z0VsLnZpZXdCb3guYmFzZVZhbC53aWR0aCA/PyA4MDApO1xuICBjb25zdCBoZWlnaHQgPSBOdW1iZXIoc3ZnRWwuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSA/PyBzdmdFbC52aWV3Qm94LmJhc2VWYWwuaGVpZ2h0ID8/IDYwMCk7XG4gIGNvbnN0IGJpdG1hcEJsb2IgPSBhd2FpdCByYXN0ZXJpemVTdmcoc3ZnQmxvYiwgd2lkdGgsIGhlaWdodCwgZm9ybWF0KTtcbiAgdHJpZ2dlckJsb2JEb3dubG9hZChiaXRtYXBCbG9iLCBgJHtiYXNlTmFtZX0uJHtmb3JtYXQgPT09ICdwbmcnID8gJ3BuZycgOiAnanBnJ31gKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmFzdGVyaXplU3ZnKFxuICBzdmdCbG9iOiBCbG9iLFxuICB3aWR0aDogbnVtYmVyLFxuICBoZWlnaHQ6IG51bWJlcixcbiAgZm9ybWF0OiAncG5nJyB8ICdqcGVnJyxcbik6IFByb21pc2U8QmxvYj4ge1xuICBjb25zdCBzdmdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHN2Z0Jsb2IpO1xuICBjb25zdCBpbWFnZSA9IGF3YWl0IGxvYWRJbWFnZShzdmdVcmwpO1xuICBVUkwucmV2b2tlT2JqZWN0VVJMKHN2Z1VybCk7XG5cbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIGNhbnZhcy53aWR0aCA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQod2lkdGgpKTtcbiAgY2FudmFzLmhlaWdodCA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQoaGVpZ2h0KSk7XG4gIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMgMkQgY29udGV4dCB1bmF2YWlsYWJsZScpO1xuICB9XG5cbiAgaWYgKGZvcm1hdCA9PT0gJ2pwZWcnKSB7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZmZmZic7XG4gICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICB9XG5cbiAgY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cbiAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlPEJsb2I+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjYW52YXMudG9CbG9iKChibG9iKSA9PiB7XG4gICAgICBpZiAoIWJsb2IpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBiaXRtYXAgYmxvYicpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShibG9iKTtcbiAgICB9LCBmb3JtYXQgPT09ICdwbmcnID8gJ2ltYWdlL3BuZycgOiAnaW1hZ2UvanBlZycsIDAuOTIpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbG9hZEltYWdlKHVybDogc3RyaW5nKTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiByZXNvbHZlKGltYWdlKTtcbiAgICBpbWFnZS5vbmVycm9yID0gKCkgPT4gcmVqZWN0KG5ldyBFcnJvcignRmFpbGVkIHRvIGxvYWQgU1ZHIGltYWdlJykpO1xuICAgIGltYWdlLnNyYyA9IHVybDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXJCbG9iRG93bmxvYWQoYmxvYjogQmxvYiwgZmlsZW5hbWU6IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICBjb25zdCBhbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIGFuY2hvci5ocmVmID0gdXJsO1xuICBhbmNob3IuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgYW5jaG9yLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYW5jaG9yKTtcbiAgYW5jaG9yLmNsaWNrKCk7XG4gIGFuY2hvci5yZW1vdmUoKTtcbiAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xufVxuXG5mdW5jdGlvbiBzYW5pdGl6ZUZpbGVOYW1lKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWUudHJpbSgpLnJlcGxhY2UoL1teYS16MC05LV9dKy9naSwgJy0nKS5yZXBsYWNlKC8tKy9nLCAnLScpLnJlcGxhY2UoL14tfC0kL2csICcnKSB8fCAnd29yZC1jbG91ZCc7XG59XG5cbmZ1bmN0aW9uIGdldExheW91dFBlcmZvcm1hbmNlUHJvZmlsZShkZXRhaWw6IFJlbmRlclNldHRpbmdzWydwcm9ncmVzc0RldGFpbCddKToge1xuICBwcm9ncmVzc1Rocm90dGxlTXM6IG51bWJlcjtcbiAgd29yZFByb2dyZXNzU3RyaWRlOiBudW1iZXI7XG59IHtcbiAgaWYgKGRldGFpbCA9PT0gJ3VuaGluZ2VkJykge1xuICAgIHJldHVybiB7XG4gICAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDFfMDAwXzAwMCxcbiAgICAgIHdvcmRQcm9ncmVzc1N0cmlkZTogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChkZXRhaWwgPT09ICdkZXRhaWxlZCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAzMCxcbiAgICAgIHdvcmRQcm9ncmVzc1N0cmlkZTogMSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGRldGFpbCA9PT0gJ21pbmltYWwnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2dyZXNzVGhyb3R0bGVNczogMjIwLFxuICAgICAgd29yZFByb2dyZXNzU3RyaWRlOiAxMixcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDgwLFxuICAgIHdvcmRQcm9ncmVzc1N0cmlkZTogNCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGhyb3R0bGVkUHJvZ3Jlc3MoXG4gIG9uUHJvZ3Jlc3M6ICgobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQpIHwgdW5kZWZpbmVkLFxuICBtaW5JbnRlcnZhbE1zOiBudW1iZXIsXG4pOiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQge1xuICBpZiAoIW9uUHJvZ3Jlc3MpIHtcbiAgICByZXR1cm4gKCkgPT4gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGV0IGxhc3RSZXBvcnRlZEF0ID0gMDtcbiAgbGV0IGxhc3RQZXJjZW50ID0gLTE7XG5cbiAgcmV0dXJuIChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgaWYgKHBlcmNlbnQgIT09IDEwMCAmJiBwZXJjZW50ID09PSBsYXN0UGVyY2VudCAmJiBub3cgLSBsYXN0UmVwb3J0ZWRBdCA8IG1pbkludGVydmFsTXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHBlcmNlbnQgIT09IDEwMCAmJiBub3cgLSBsYXN0UmVwb3J0ZWRBdCA8IG1pbkludGVydmFsTXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsYXN0UmVwb3J0ZWRBdCA9IG5vdztcbiAgICBsYXN0UGVyY2VudCA9IHBlcmNlbnQ7XG4gICAgb25Qcm9ncmVzcyhtZXNzYWdlLCBwZXJjZW50KTtcbiAgfTtcbn1cbiIsICJpbXBvcnQgeyBJdGVtVmlldywgV29ya3NwYWNlTGVhZiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUgeyBXb3JkQ2xvdWRTZXJ2aWNlcyB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIE5vdGVXb3JkQ2xvdWRWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHJlYWRvbmx5IHNlcnZpY2VzOiBXb3JkQ2xvdWRTZXJ2aWNlcztcbiAgcHJpdmF0ZSByZW5kZXJOb25jZSA9IDA7XG4gIHByaXZhdGUgc2VsZWN0ZWRGaWxlUGF0aCA9ICcnO1xuXG4gIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHNlcnZpY2VzOiBXb3JkQ2xvdWRTZXJ2aWNlcykge1xuICAgIHN1cGVyKGxlYWYpO1xuICAgIHRoaXMuc2VydmljZXMgPSBzZXJ2aWNlcztcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQ7XG4gIH1cblxuICBnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnTm90ZSB3b3JkIGNsb3Vkcyc7XG4gIH1cblxuICBnZXRJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdmaWxlLXRleHQnO1xuICB9XG5cbiAgYXN5bmMgb25PcGVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIGNvbnRlbnRFbC5lbXB0eSgpO1xuICAgIGNvbnRlbnRFbC5hZGRDbGFzcygndmF1bHQtd29yZC1jbG91ZC12aWV3Jyk7XG5cbiAgICBjb25zdCB0b3BFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRvcCcgfSk7XG4gICAgY29uc3QgaGVhZGVyRWwgPSB0b3BFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWhlYWRlcicgfSk7XG4gICAgaGVhZGVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnTm90ZSB3b3JkIGNsb3VkcycsIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtdGl0bGUnIH0pO1xuXG4gICAgY29uc3QgY29udHJvbHNFbCA9IHRvcEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY29udHJvbHMnIH0pO1xuXG4gICAgY29uc3QgZmlsZUZpbHRlckVsID0gY29udHJvbHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRhZy1maWx0ZXInIH0pO1xuICAgIGNvbnN0IGZpbGVMYWJlbEVsID0gZmlsZUZpbHRlckVsLmNyZWF0ZUVsKCdsYWJlbCcsIHsgdGV4dDogJ09wZW4gbm90ZScsIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtdGFnLWxhYmVsJyB9KTtcbiAgICBjb25zdCBmaWxlU2VsZWN0RWwgPSBmaWxlRmlsdGVyRWwuY3JlYXRlRWwoJ3NlbGVjdCcsIHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1tb2RlLXNlbGVjdCcgfSk7XG4gICAgZmlsZVNlbGVjdEVsLmlkID0gJ3ZhdWx0LXdvcmQtY2xvdWQtbm90ZS1zZWxlY3QnO1xuICAgIGZpbGVMYWJlbEVsLnNldEF0dHIoJ2ZvcicsIGZpbGVTZWxlY3RFbC5pZCk7XG4gICAgZmlsZVNlbGVjdEVsLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnQ2hvb3NlIGFuIG9wZW4gbm90ZScpO1xuXG4gICAgY29uc3QgYWN0aXZlQnV0dG9uID0gY29udHJvbHNFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgdGV4dDogJ1VzZSBhY3RpdmUgbm90ZScsXG4gICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXJlZnJlc2gnLFxuICAgIH0pO1xuICAgIGFjdGl2ZUJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1VzZSBhY3RpdmUgbm90ZScpO1xuXG4gICAgY29uc3QgcmVmcmVzaEJ1dHRvbiA9IGNvbnRyb2xzRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIHRleHQ6ICdSZWZyZXNoJyxcbiAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtcmVmcmVzaCcsXG4gICAgfSk7XG4gICAgcmVmcmVzaEJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1JlZnJlc2ggd29yZCBjbG91ZCcpO1xuXG4gICAgY29uc3QgY2FudmFzRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1jYW52YXMnIH0pO1xuXG4gICAgdGhpcy51cGRhdGVPcGVuRmlsZU9wdGlvbnMoZmlsZVNlbGVjdEVsKTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChmaWxlU2VsZWN0RWwsICdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZVBhdGggPSBmaWxlU2VsZWN0RWwudmFsdWU7XG4gICAgICB2b2lkIHRoaXMucmVuZGVyQ2xvdWQoY2FudmFzRWwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KGFjdGl2ZUJ1dHRvbiwgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aXZlRmlsZSA9IHRoaXMuc2VydmljZXMuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKGFjdGl2ZUZpbGUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gYWN0aXZlRmlsZS5wYXRoO1xuICAgICAgICB0aGlzLnVwZGF0ZU9wZW5GaWxlT3B0aW9ucyhmaWxlU2VsZWN0RWwpO1xuICAgICAgICBmaWxlU2VsZWN0RWwudmFsdWUgPSB0aGlzLnNlbGVjdGVkRmlsZVBhdGg7XG4gICAgICB9XG4gICAgICB2b2lkIHRoaXMucmVuZGVyQ2xvdWQoY2FudmFzRWwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KHJlZnJlc2hCdXR0b24sICdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlT3BlbkZpbGVPcHRpb25zKGZpbGVTZWxlY3RFbCk7XG4gICAgICBpZiAoIWZpbGVTZWxlY3RFbC52YWx1ZSAmJiB0aGlzLnNlbGVjdGVkRmlsZVBhdGgpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gJyc7XG4gICAgICB9XG4gICAgICB2b2lkIHRoaXMucmVuZGVyQ2xvdWQoY2FudmFzRWwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbignYWN0aXZlLWxlYWYtY2hhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aXZlRmlsZSA9IHRoaXMuc2VydmljZXMuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKCFhY3RpdmVGaWxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCAhPT0gYWN0aXZlRmlsZS5wYXRoKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCA9IGFjdGl2ZUZpbGUucGF0aDtcbiAgICAgICAgdGhpcy51cGRhdGVPcGVuRmlsZU9wdGlvbnMoZmlsZVNlbGVjdEVsKTtcbiAgICAgICAgZmlsZVNlbGVjdEVsLnZhbHVlID0gdGhpcy5zZWxlY3RlZEZpbGVQYXRoO1xuICAgICAgICB2b2lkIHRoaXMucmVuZGVyQ2xvdWQoY2FudmFzRWwpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIGF3YWl0IHRoaXMucmVuZGVyQ2xvdWQoY2FudmFzRWwpO1xuICB9XG5cbiAgYXN5bmMgb25SZXNpemUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY2FudmFzRWwgPSB0aGlzLmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKCcudmF1bHQtd29yZC1jbG91ZC1jYW52YXMnKTtcbiAgICBpZiAoY2FudmFzRWwgaW5zdGFuY2VvZiBIVE1MRGl2RWxlbWVudCkge1xuICAgICAgYXdhaXQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVPcGVuRmlsZU9wdGlvbnMoc2VsZWN0RWw6IEhUTUxTZWxlY3RFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3Qgb3BlbkZpbGVzID0gdGhpcy5zZXJ2aWNlcy5nZXRPcGVuTWFya2Rvd25GaWxlcygpO1xuICAgIGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLnNlcnZpY2VzLmdldEFjdGl2ZUZpbGUoKTtcblxuICAgIGlmICghdGhpcy5zZWxlY3RlZEZpbGVQYXRoICYmIGFjdGl2ZUZpbGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCA9IGFjdGl2ZUZpbGUucGF0aDtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWRGaWxlUGF0aDtcbiAgICBzZWxlY3RFbC5lbXB0eSgpO1xuXG4gICAgaWYgKG9wZW5GaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHNlbGVjdEVsLmNyZWF0ZUVsKCdvcHRpb24nLCB7IHRleHQ6ICdObyBvcGVuIG1hcmtkb3duIG5vdGVzJywgdmFsdWU6ICcnIH0pO1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gJyc7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIG9wZW5GaWxlcykge1xuICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdGV4dDogZmlsZS5wYXRoLCB2YWx1ZTogZmlsZS5wYXRoIH0pO1xuICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmlsZS5wYXRoID09PSBzZWxlY3RlZDtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGVkRmlsZVBhdGggPSBzZWxlY3RFbC52YWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcmVuZGVyQ2xvdWQoY29udGFpbmVyRWw6IEhUTUxEaXZFbGVtZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgYWN0aXZlTm9uY2UgPSArK3RoaXMucmVuZGVyTm9uY2U7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICBjb25zdCBsb2FkaW5nRWwgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJywgdGV4dDogJ0J1aWxkaW5nIGNsb3VkLi4uJyB9KTtcbiAgICBjb25zdCB1cGRhdGVQcm9ncmVzcyA9IChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgICAgaWYgKGFjdGl2ZU5vbmNlICE9PSB0aGlzLnJlbmRlck5vbmNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxvYWRpbmdFbC5zZXRUZXh0KGAke21lc3NhZ2V9ICgke3BlcmNlbnR9JSlgKTtcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRhcmdldEZpbGUgPSB0aGlzLnNlcnZpY2VzLmdldE9wZW5NYXJrZG93bkZpbGVzKCkuZmluZCgoZmlsZSkgPT4gZmlsZS5wYXRoID09PSB0aGlzLnNlbGVjdGVkRmlsZVBhdGgpO1xuICAgICAgaWYgKCF0YXJnZXRGaWxlKSB7XG4gICAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJyxcbiAgICAgICAgICB0ZXh0OiAnT3BlbiBhIG1hcmtkb3duIG5vdGUgYW5kIHNlbGVjdCBpdCB0byB2aWV3IGEgbm90ZS1zcGVjaWZpYyB3b3JkIGNsb3VkLicsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHdvcmRzID0gYXdhaXQgdGhpcy5zZXJ2aWNlcy5jb2xsZWN0RmlsZVdvcmRzKHRhcmdldEZpbGUsIHVwZGF0ZVByb2dyZXNzKTtcblxuICAgICAgaWYgKHdvcmRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsXG4gICAgICAgICAgdGV4dDogYE5vIHdvcmRzIGZvdW5kIGluICR7dGFyZ2V0RmlsZS5iYXNlbmFtZX0uYCxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5zZXJ2aWNlcy5kcmF3V29yZENsb3VkKHtcbiAgICAgICAgY29udGFpbmVyRWwsXG4gICAgICAgIHdvcmRzLFxuICAgICAgICBhcmlhTGFiZWw6IGBXb3JkIGNsb3VkIGZvciAke3RhcmdldEZpbGUuYmFzZW5hbWV9YCxcbiAgICAgICAgb25Qcm9ncmVzczogdXBkYXRlUHJvZ3Jlc3MsXG4gICAgICAgIG9uUmVmcmVzaDogKCkgPT4gdGhpcy5yZW5kZXJDbG91ZChjb250YWluZXJFbCksXG4gICAgICAgIG9uV29yZENsaWNrOiAod29yZCkgPT4ge1xuICAgICAgICAgIHZvaWQgdGhpcy5zZXJ2aWNlcy5vcGVuU2VhcmNoRm9yV29yZCh3b3JkLCB7IGZpbGVQYXRoOiB0YXJnZXRGaWxlLnBhdGggfSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgaWYgKGFjdGl2ZU5vbmNlICE9PSB0aGlzLnJlbmRlck5vbmNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgICBjb25zb2xlLmVycm9yKCdOb3RlIHdvcmQgY2xvdWQ6IGZhaWxlZCB0byByZW5kZXIgY2xvdWQnLCBlcnJvcik7XG4gICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJyxcbiAgICAgICAgdGV4dDogJ0NvdWxkIG5vdCByZW5kZXIgdGhlIHdvcmQgY2xvdWQuIE9wZW4gZGV2ZWxvcGVyIGNvbnNvbGUgZm9yIGRldGFpbHMuJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IEl0ZW1WaWV3LCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgVklFV19UWVBFX1ZBVUxUX1dPUkRfQ0xPVUQgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUgeyBUYWdNYXRjaE1vZGUsIFdvcmRDbG91ZFNlcnZpY2VzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgVmF1bHRXb3JkQ2xvdWRWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHJlYWRvbmx5IHNlcnZpY2VzOiBXb3JkQ2xvdWRTZXJ2aWNlcztcbiAgcHJpdmF0ZSByZW5kZXJOb25jZSA9IDA7XG4gIHByaXZhdGUgc2VsZWN0ZWRUYWdzOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIHRhZ01hdGNoTW9kZTogVGFnTWF0Y2hNb2RlID0gJ2FueSc7XG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgc2VydmljZXM6IFdvcmRDbG91ZFNlcnZpY2VzKSB7XG4gICAgc3VwZXIobGVhZik7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IHNlcnZpY2VzO1xuICB9XG5cbiAgZ2V0Vmlld1R5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gVklFV19UWVBFX1ZBVUxUX1dPUkRfQ0xPVUQ7XG4gIH1cblxuICBnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnVmF1bHQgV29yZCBDbG91ZCc7XG4gIH1cblxuICBnZXRJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdjbG91ZCc7XG4gIH1cblxuICBhc3luYyBvbk9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG4gICAgY29udGVudEVsLmVtcHR5KCk7XG4gICAgY29udGVudEVsLmFkZENsYXNzKCd2YXVsdC13b3JkLWNsb3VkLXZpZXcnKTtcblxuICAgIGNvbnN0IHRvcEVsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtdG9wJyB9KTtcblxuICAgIGNvbnN0IGhlYWRlckVsID0gdG9wRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1oZWFkZXInIH0pO1xuICAgIGhlYWRlckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ1dvcmQgY2xvdWRzJywgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10aXRsZScgfSk7XG5cbiAgICBjb25zdCBjb250cm9sc0VsID0gdG9wRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1jb250cm9scycgfSk7XG5cbiAgICBjb25zdCB0YWdQaWNrZXJFbCA9IGNvbnRyb2xzRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10YWctZmlsdGVyJyB9KTtcbiAgICBjb25zdCB0YWdTZWxlY3RFbCA9IHRhZ1BpY2tlckVsLmNyZWF0ZUVsKCdzZWxlY3QnLCB7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtbW9kZS1zZWxlY3QnIH0pO1xuICAgIHRhZ1NlbGVjdEVsLmlkID0gJ3ZhdWx0LXdvcmQtY2xvdWQtdGFnLXNlbGVjdCc7XG4gICAgdGFnU2VsZWN0RWwuc2V0QXR0cignYXJpYS1sYWJlbCcsICdBZGQgdGFnIGZpbHRlcicpO1xuXG4gICAgY29uc3QgbW9kZUVsID0gY29udHJvbHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLW1hdGNoLW1vZGUnIH0pO1xuICAgIG1vZGVFbC5jcmVhdGVFbCgnc3BhbicsIHsgdGV4dDogJ01hdGNoJywgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10YWctbGFiZWwnIH0pO1xuICAgIGNvbnN0IG1vZGVTZWxlY3RFbCA9IG1vZGVFbC5jcmVhdGVFbCgnc2VsZWN0JywgeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLW1vZGUtc2VsZWN0JyB9KTtcbiAgICBtb2RlU2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdGV4dDogJ0FueScsIHZhbHVlOiAnYW55JyB9KTtcbiAgICBtb2RlU2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdGV4dDogJ0FsbCcsIHZhbHVlOiAnYWxsJyB9KTtcbiAgICBtb2RlU2VsZWN0RWwudmFsdWUgPSB0aGlzLnRhZ01hdGNoTW9kZTtcbiAgICBtb2RlU2VsZWN0RWwuc2V0QXR0cignYXJpYS1sYWJlbCcsICdUYWcgbWF0Y2ggbW9kZScpO1xuXG4gICAgY29uc3QgYXBwbGllZFRhZ3NFbCA9IHRvcEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtYXBwbGllZC10YWdzJyB9KTtcbiAgICBjb25zdCBjYW52YXNFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNhbnZhcycgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZVRhZ1BpY2tlck9wdGlvbnModGFnU2VsZWN0RWwpO1xuICAgIHRoaXMucmVuZGVyQXBwbGllZFRhZ0NoaXBzKGFwcGxpZWRUYWdzRWwsIHRhZ1NlbGVjdEVsLCBjYW52YXNFbCk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQodGFnU2VsZWN0RWwsICdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzZWxlY3RlZFRhZyA9IHRhZ1NlbGVjdEVsLnZhbHVlO1xuICAgICAgaWYgKHNlbGVjdGVkVGFnICYmICF0aGlzLnNlbGVjdGVkVGFncy5pbmNsdWRlcyhzZWxlY3RlZFRhZykpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhZ3MucHVzaChzZWxlY3RlZFRhZyk7XG4gICAgICB9XG5cbiAgICAgIHRhZ1NlbGVjdEVsLnZhbHVlID0gJyc7XG4gICAgICB0aGlzLnVwZGF0ZVRhZ1BpY2tlck9wdGlvbnModGFnU2VsZWN0RWwpO1xuICAgICAgdGhpcy5yZW5kZXJBcHBsaWVkVGFnQ2hpcHMoYXBwbGllZFRhZ3NFbCwgdGFnU2VsZWN0RWwsIGNhbnZhc0VsKTtcbiAgICAgIHZvaWQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQobW9kZVNlbGVjdEVsLCAnY2hhbmdlJywgKCkgPT4ge1xuICAgICAgdGhpcy50YWdNYXRjaE1vZGUgPSBtb2RlU2VsZWN0RWwudmFsdWUgPT09ICdhbGwnID8gJ2FsbCcgOiAnYW55JztcbiAgICAgIHZvaWQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gICAgfSk7XG5cbiAgICBhd2FpdCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgfVxuXG4gIGFzeW5jIG9uUmVzaXplKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGNhbnZhc0VsID0gdGhpcy5jb250ZW50RWwucXVlcnlTZWxlY3RvcignLnZhdWx0LXdvcmQtY2xvdWQtY2FudmFzJyk7XG4gICAgaWYgKGNhbnZhc0VsIGluc3RhbmNlb2YgSFRNTERpdkVsZW1lbnQpIHtcbiAgICAgIGF3YWl0IHRoaXMucmVuZGVyQ2xvdWQoY2FudmFzRWwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlVGFnUGlja2VyT3B0aW9ucyhzZWxlY3RFbDogSFRNTFNlbGVjdEVsZW1lbnQpOiB2b2lkIHtcbiAgICBjb25zdCB0YWdzID0gdGhpcy5zZXJ2aWNlcy5nZXRBdmFpbGFibGVUYWdzKCk7XG4gICAgY29uc3Qgc2VsZWN0ZWRTZXQgPSBuZXcgU2V0KHRoaXMuc2VsZWN0ZWRUYWdzKTtcblxuICAgIHNlbGVjdEVsLmVtcHR5KCk7XG4gICAgc2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdGV4dDogJ0FkZCB0YWcgZmlsdGVyLi4uJywgdmFsdWU6ICcnIH0pO1xuXG4gICAgZm9yIChjb25zdCB0YWcgb2YgdGFncykge1xuICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdGV4dDogdGFnLCB2YWx1ZTogdGFnIH0pO1xuICAgICAgb3B0aW9uLmRpc2FibGVkID0gc2VsZWN0ZWRTZXQuaGFzKHRhZyk7XG4gICAgfVxuXG4gICAgc2VsZWN0RWwudmFsdWUgPSAnJztcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQXBwbGllZFRhZ0NoaXBzKFxuICAgIGNoaXBzRWw6IEhUTUxEaXZFbGVtZW50LFxuICAgIHRhZ1NlbGVjdEVsOiBIVE1MU2VsZWN0RWxlbWVudCxcbiAgICBjYW52YXNFbDogSFRNTERpdkVsZW1lbnQsXG4gICk6IHZvaWQge1xuICAgIGNoaXBzRWwuZW1wdHkoKTtcblxuICAgIGlmICh0aGlzLnNlbGVjdGVkVGFncy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNoaXBzRWwuY3JlYXRlU3Bhbih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY2hpcC1lbXB0eScsIHRleHQ6ICdObyB0YWcgZmlsdGVycyBhcHBsaWVkLicgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCB0YWcgb2YgdGhpcy5zZWxlY3RlZFRhZ3MpIHtcbiAgICAgIGNvbnN0IGNoaXBFbCA9IGNoaXBzRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1jaGlwJyB9KTtcbiAgICAgIGNoaXBFbC5jcmVhdGVTcGFuKHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1jaGlwLXRleHQnLCB0ZXh0OiB0YWcgfSk7XG5cbiAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IGNoaXBFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNoaXAtcmVtb3ZlJyxcbiAgICAgICAgdGV4dDogJ3gnLFxuICAgICAgfSk7XG4gICAgICByZW1vdmVCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsIGBSZW1vdmUgJHt0YWd9IGZpbHRlcmApO1xuXG4gICAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQocmVtb3ZlQnV0dG9uLCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRUYWdzID0gdGhpcy5zZWxlY3RlZFRhZ3MuZmlsdGVyKCh2YWx1ZSkgPT4gdmFsdWUgIT09IHRhZyk7XG4gICAgICAgIHRoaXMudXBkYXRlVGFnUGlja2VyT3B0aW9ucyh0YWdTZWxlY3RFbCk7XG4gICAgICAgIHRoaXMucmVuZGVyQXBwbGllZFRhZ0NoaXBzKGNoaXBzRWwsIHRhZ1NlbGVjdEVsLCBjYW52YXNFbCk7XG4gICAgICAgIHZvaWQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJlbmRlckNsb3VkKGNvbnRhaW5lckVsOiBIVE1MRGl2RWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGFjdGl2ZU5vbmNlID0gKyt0aGlzLnJlbmRlck5vbmNlO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgY29uc3QgbG9hZGluZ0VsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsIHRleHQ6ICdCdWlsZGluZyBjbG91ZC4uLicgfSk7XG4gICAgY29uc3QgdXBkYXRlUHJvZ3Jlc3MgPSAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGlmIChhY3RpdmVOb25jZSAhPT0gdGhpcy5yZW5kZXJOb25jZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsb2FkaW5nRWwuc2V0VGV4dChgJHttZXNzYWdlfSAoJHtwZXJjZW50fSUpYCk7XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB3b3JkcyA9IGF3YWl0IHRoaXMuc2VydmljZXMuY29sbGVjdFZhdWx0V29yZHModGhpcy5zZWxlY3RlZFRhZ3MsIHRoaXMudGFnTWF0Y2hNb2RlLCB1cGRhdGVQcm9ncmVzcyk7XG5cbiAgICAgIGlmICh3b3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLFxuICAgICAgICAgIHRleHQ6IHRoaXMuc2VsZWN0ZWRUYWdzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgID8gJ05vIHdvcmRzIGZvdW5kIGZvciB0aGUgc2VsZWN0ZWQgdGFnIGZpbHRlcnMuJ1xuICAgICAgICAgICAgOiAnTm8gd29yZHMgZm91bmQuJyxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5zZXJ2aWNlcy5kcmF3V29yZENsb3VkKHtcbiAgICAgICAgY29udGFpbmVyRWwsXG4gICAgICAgIHdvcmRzLFxuICAgICAgICBhcmlhTGFiZWw6ICdXb3JkIGNsb3VkIGJhc2VkIG9uIG1hcmtkb3duIGZpbGVzIGluIHRoZSB2YXVsdCcsXG4gICAgICAgIG9uUHJvZ3Jlc3M6IHVwZGF0ZVByb2dyZXNzLFxuICAgICAgICBvblJlZnJlc2g6ICgpID0+IHRoaXMucmVuZGVyQ2xvdWQoY29udGFpbmVyRWwpLFxuICAgICAgICBvbldvcmRDbGljazogKHdvcmQpID0+IHtcbiAgICAgICAgICB2b2lkIHRoaXMuc2VydmljZXMub3BlblNlYXJjaEZvcldvcmQod29yZCwge1xuICAgICAgICAgICAgdGFnczogdGhpcy5zZWxlY3RlZFRhZ3MsXG4gICAgICAgICAgICB0YWdNYXRjaE1vZGU6IHRoaXMudGFnTWF0Y2hNb2RlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChhY3RpdmVOb25jZSAhPT0gdGhpcy5yZW5kZXJOb25jZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuICAgICAgY29uc29sZS5lcnJvcignVmF1bHQgd29yZCBjbG91ZDogZmFpbGVkIHRvIHJlbmRlciBjbG91ZCcsIGVycm9yKTtcbiAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdih7XG4gICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLFxuICAgICAgICB0ZXh0OiAnQ291bGQgbm90IHJlbmRlciB0aGUgd29yZCBjbG91ZC4gT3BlbiBkZXZlbG9wZXIgY29uc29sZSBmb3IgZGV0YWlscy4nLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBLGdGQUFBQSxTQUFBO0FBQ0EsS0FBQyxTQUFVLFFBQVEsU0FBUztBQUM1QixhQUFP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VTtBQUVyRyxXQUFPO0FBQUEsTUFDTDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQSxhQUFhO0FBQUEsTUFDYixhQUFhO0FBQUEsTUFDYjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRVEsWUFBWSxPQUFnQixLQUFhLEtBQWEsVUFBMEI7QUFDdEYsUUFBSSxPQUFPLFVBQVUsWUFBWSxPQUFPLE1BQU0sS0FBSyxHQUFHO0FBQ3BELGFBQU87QUFBQSxJQUNUO0FBQ0EsV0FBTyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFBQSxFQUN2RDtBQUFBLEVBRVEsV0FBVyxPQUFnQixLQUFhLEtBQWEsVUFBMEI7QUFDckYsUUFBSSxPQUFPLFVBQVUsWUFBWSxPQUFPLE1BQU0sS0FBSyxHQUFHO0FBQ3BELGFBQU87QUFBQSxJQUNUO0FBQ0EsV0FBTyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLENBQUM7QUFBQSxFQUMzQztBQUNGOyIsCiAgIm5hbWVzIjogWyJtb2R1bGUiLCAiZXhwb3J0cyIsICJwYXJzZVR5cGVuYW1lcyIsICJtb2R1bGUiLCAiaSIsICJjYW52YXMiLCAidyIsICJoIiwgImltcG9ydF9vYnNpZGlhbiIsICJkb2N1bWVudCIsICJkb2N1bWVudCIsICJkb2N1bWVudCIsICJpbXBvcnRfb2JzaWRpYW4iLCAiY29tcHV0ZVNjYWxlU2NvcmUiLCAiY2xhbXAwMSIsICJrZXkiLCAiZG9jdW1lbnQiLCAiZGF0dW0iLCAic2VsZWN0aW9uIiwgIndpbmRvdyIsICJzZWxlY3RfZGVmYXVsdCIsICJpbXBvcnRfb2JzaWRpYW4iLCAic2VsZWN0X2RlZmF1bHQiLCAiY3JlYXRlVGhyb3R0bGVkUHJvZ3Jlc3MiLCAibGF5b3V0V29yZHMiLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiJdCn0K
