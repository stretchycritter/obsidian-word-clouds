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
          var copy2 = {}, _ = this._;
          for (var t in _)
            copy2[t] = _[t].slice();
          return new Dispatch(copy2);
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
var import_obsidian8 = require("obsidian");

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
var import_obsidian2 = require("obsidian");

// src/modals/embed-word-cloud-modal.ts
var import_obsidian = require("obsidian");
var DEFAULT_STATE = {
  scope: "file",
  size: "medium",
  tagsRaw: ""
};
var EmbedWordCloudModal = class extends import_obsidian.Modal {
  constructor(app, services, onInsert, options = {}) {
    super(app);
    this.services = services;
    this.onInsert = onInsert;
    this.title = options.title ?? "Embed word cloud in document";
    this.description = options.description ?? "Configure options, then insert a word cloud embed at your cursor.";
    this.submitButtonText = options.submitButtonText ?? "Insert";
    const initialState = options.initialState ?? {};
    this.state = {
      ...DEFAULT_STATE,
      ...initialState
    };
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("word-cloud-embed-wizard");
    contentEl.createEl("h2", { text: this.title });
    contentEl.createEl("p", {
      cls: "word-cloud-embed-wizard-description",
      text: this.description
    });
    this.scopeWrapperEl = contentEl.createDiv({ cls: "word-cloud-embed-wizard-section" });
    this.sizeWrapperEl = contentEl.createDiv({ cls: "word-cloud-embed-wizard-section" });
    this.tagsWrapperEl = contentEl.createDiv({ cls: "word-cloud-embed-wizard-section" });
    new import_obsidian.Setting(this.scopeWrapperEl).setName("Scope").setDesc("Choose whether this cloud uses the current file or the entire vault.").addDropdown((dropdown) => {
      dropdown.addOption("file", "File").addOption("vault", "Vault").setValue(this.state.scope).onChange((value) => {
        this.state.scope = value === "vault" ? "vault" : "file";
        this.refreshConditionalSections();
      });
    });
    new import_obsidian.Setting(this.sizeWrapperEl).setName("Size").setDesc("Select the embedded cloud size preset.").addDropdown((dropdown) => {
      dropdown.addOption("small", "Small").addOption("medium", "Medium").addOption("large", "Large").setValue(this.state.size).onChange((value) => {
        this.state.size = value === "small" || value === "large" ? value : "medium";
      });
    });
    this.renderTagSetting();
    const buttonRowEl = contentEl.createDiv({ cls: "word-cloud-embed-wizard-actions" });
    const cancelButton = new import_obsidian.ButtonComponent(buttonRowEl).setButtonText("Cancel").onClick(() => {
      this.close();
    });
    cancelButton.buttonEl.type = "button";
    const insertButton = new import_obsidian.ButtonComponent(buttonRowEl).setButtonText(this.submitButtonText).setCta().onClick(async () => {
      insertButton.setDisabled(true);
      try {
        const wasInserted = await this.onInsert(this.buildEmbedBlock());
        if (wasInserted && this.isOpen) {
          this.close();
        }
      } catch (error) {
        console.error("Word clouds: failed to apply embed changes", error);
        new import_obsidian.Notice("Could not apply word cloud changes.");
      }
      if (insertButton.buttonEl.isConnected) {
        insertButton.setDisabled(false);
      }
    });
    insertButton.buttonEl.type = "button";
    this.refreshConditionalSections();
  }
  onClose() {
    this.contentEl.empty();
  }
  renderTagSetting() {
    this.tagsWrapperEl.empty();
    const availableTags = this.services.getAvailableTags();
    const tagHint = availableTags.length > 0 ? `Available: ${availableTags.slice(0, 12).join(", ")}${availableTags.length > 12 ? "\u2026" : ""}` : "No tags detected yet.";
    new import_obsidian.Setting(this.tagsWrapperEl).setName("Tag filter include list").setDesc(`Optional comma-separated tags to include. ${tagHint}`).addText((text) => {
      text.setPlaceholder("#project, #meeting").setValue(this.state.tagsRaw).onChange((value) => {
        this.state.tagsRaw = value;
      });
    });
  }
  refreshConditionalSections() {
    this.tagsWrapperEl.toggleClass("is-hidden", this.state.scope !== "vault");
  }
  buildEmbedBlock() {
    const lines = ["```wordcloud", `scope: ${this.state.scope}`, `size: ${this.state.size}`];
    if (this.state.scope === "vault") {
      const normalizedTags = this.state.tagsRaw.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0);
      if (normalizedTags.length > 0) {
        lines.push(`tags: ${normalizedTags.join(", ")}`);
      }
    }
    lines.push("```");
    return lines.join("\n");
  }
};

// src/block-renderers/wordcloud-block-renderer.ts
var DEFAULT_OPTIONS = {
  scope: "file",
  size: "medium",
  includeTags: [],
  excludeWords: [],
  interactions: true
};
var EMBED_RESIZE_DEBOUNCE_MS = 140;
var EMBED_CONTENT_CHANGE_DEBOUNCE_MS = 5e3;
var EMBED_SIZE_HEIGHT = {
  small: 240,
  medium: 320,
  large: 440
};
var embeddedRenderStates = /* @__PURE__ */ new WeakMap();
var embeddedCloudInstances = /* @__PURE__ */ new WeakMap();
var embeddedCloudsBySourcePath = /* @__PURE__ */ new Map();
var sourcePathRefreshTimers = /* @__PURE__ */ new Map();
function registerEmbeddedWordCloudProcessor(plugin, services) {
  const render = async (source, el, ctx) => {
    cleanupEmbeddedRenderState(el);
    registerEmbeddedCloudInstance(el, ctx.sourcePath, () => {
      void render(source, el, ctx);
    });
    const options = parseOptions(source);
    el.empty();
    const wrapperEl = el.createDiv({ cls: "word-cloud-embed" });
    const stateEl = wrapperEl.createDiv({ cls: "word-cloud-embed-state", text: "Building cloud..." });
    const canvasEl = wrapperEl.createDiv({ cls: "word-cloud-embed-canvas" });
    canvasEl.style.height = `${EMBED_SIZE_HEIGHT[options.size]}px`;
    const updateProgress = (message, percent) => {
      stateEl.setText(`${message} (${percent}%)`);
    };
    try {
      let words;
      let searchScope = {};
      if (options.scope === "file") {
        const file = options.specificFilePath ? resolveSpecificFile(plugin, options.specificFilePath) : resolveCurrentFile(plugin, ctx);
        if (!file) {
          stateEl.setText("Could not resolve the file for this embedded cloud.");
          return;
        }
        words = await services.collectFileWords(file, updateProgress, {
          excludeWords: options.excludeWords
        });
        searchScope = { filePath: file.path };
      } else {
        words = await services.collectVaultWords({
          sourceRules: {
            scope: { mode: "vault" },
            includeTags: options.includeTags,
            tagMatchMode: "any"
          },
          excludeWords: options.excludeWords
        }, updateProgress);
        searchScope = { includeTags: options.includeTags, tagMatchMode: "any" };
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
        onExcludeInCloud: async (word) => {
          const changed = await updateEmbeddedCloudExcludedWords(plugin, ctx, el, source, word);
          if (changed) {
            new import_obsidian2.Notice(`Excluded "${word}" in this cloud.`);
          } else {
            new import_obsidian2.Notice(`"${word}" is already excluded in this cloud.`);
          }
        },
        onExcludeInVault: async (word) => {
          const added = await services.addBlacklistWord(word);
          new import_obsidian2.Notice(added ? `Excluded "${word}" from word clouds.` : `"${word}" is already excluded.`);
        },
        onEdit: () => {
          openEmbeddedWordCloudEditWizard(plugin, services, ctx, el, options);
        },
        enableOverlayControls: true,
        enableViewportInteraction: options.interactions,
        showRefreshControl: true,
        showZoomControls: options.interactions,
        showEditControl: true,
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
  plugin.registerEvent(plugin.app.workspace.on("editor-change", (_editor, view) => {
    if (!(view instanceof import_obsidian2.MarkdownView) || !view.file) {
      return;
    }
    scheduleSourcePathRefresh(view.file.path);
  }));
  plugin.register(() => {
    for (const timerId of sourcePathRefreshTimers.values()) {
      window.clearTimeout(timerId);
    }
    sourcePathRefreshTimers.clear();
    embeddedCloudsBySourcePath.clear();
  });
}
function resolveCurrentFile(plugin, ctx) {
  const fromContext = plugin.app.vault.getAbstractFileByPath(ctx.sourcePath);
  return fromContext instanceof import_obsidian2.TFile ? fromContext : null;
}
function resolveSpecificFile(plugin, filePath) {
  const normalizedPath = filePath.trim();
  if (!normalizedPath) {
    return null;
  }
  const resolved = plugin.app.vault.getAbstractFileByPath(normalizedPath);
  return resolved instanceof import_obsidian2.TFile ? resolved : null;
}
function parseOptions(source) {
  const options = { ...DEFAULT_OPTIONS };
  let scopeWasExplicitlySet = false;
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
      const parsedScope = parseScopeOption(rawValue);
      if (parsedScope) {
        options.scope = parsedScope;
        scopeWasExplicitlySet = true;
      }
      continue;
    }
    if (rawKey === "size") {
      const parsedSize = parseSizeOption(rawValue);
      if (parsedSize) {
        options.size = parsedSize;
      }
      continue;
    }
    if (rawKey === "mode") {
      const parsedScope = parseLegacyModeOption(rawValue);
      if (parsedScope) {
        options.scope = parsedScope;
        scopeWasExplicitlySet = true;
      }
      continue;
    }
    if (rawKey === "tags") {
      options.includeTags = rawValue.split(",").map((value) => value.trim()).filter((value) => value.length > 0);
      continue;
    }
    if (rawKey === "exclude" || rawKey === "exclude-words" || rawKey === "exclude_words" || rawKey === "excluded-words") {
      options.excludeWords = rawValue.split(",").map((value) => normalizeWord(value)).filter((value, index, arr) => value.length > 0 && arr.indexOf(value) === index);
      continue;
    }
    if (rawKey === "height") {
      const parsed = Number.parseInt(rawValue, 10);
      if (!Number.isNaN(parsed)) {
        options.size = sizeFromHeight(parsed);
      }
      continue;
    }
    if (rawKey === "interactions" || rawKey === "interactable" || rawKey === "controls") {
      options.interactions = parseBooleanOption(rawValue, true);
      continue;
    }
    if (rawKey === "file" || rawKey === "note" || rawKey === "path" || rawKey === "filename") {
      options.specificFilePath = rawValue;
      if (!scopeWasExplicitlySet) {
        options.scope = "file";
      }
    }
  }
  return options;
}
function parseScopeOption(value) {
  const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
  if (normalized === "vault") {
    return "vault";
  }
  if (normalized === "file" || normalized === "note" || normalized === "current-note" || normalized === "current-file") {
    return "file";
  }
  return null;
}
function parseSizeOption(value) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "small" || normalized === "medium" || normalized === "large") {
    return normalized;
  }
  return null;
}
function parseLegacyModeOption(value) {
  const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
  if (normalized === "current-file" || normalized === "current" || normalized === "current-note" || normalized === "note" || normalized === "specific-file" || normalized === "specific" || normalized === "file" || normalized === "note-file") {
    return "file";
  }
  if (normalized === "tag-based" || normalized === "tags" || normalized === "tag" || normalized === "vault") {
    return "vault";
  }
  return null;
}
function sizeFromHeight(height) {
  const normalized = Math.min(900, Math.max(180, height));
  if (normalized <= 280) {
    return "small";
  }
  if (normalized <= 380) {
    return "medium";
  }
  return "large";
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
    cleanupEmbeddedCloudInstance(hostEl);
    return;
  }
  state.observer.disconnect();
  if (state.rerenderTimer !== null) {
    window.clearTimeout(state.rerenderTimer);
  }
  embeddedRenderStates.delete(hostEl);
  cleanupEmbeddedCloudInstance(hostEl);
}
function registerEmbeddedCloudInstance(hostEl, sourcePath, rerender) {
  cleanupEmbeddedCloudInstance(hostEl);
  embeddedCloudInstances.set(hostEl, { sourcePath, rerender });
  let hosts = embeddedCloudsBySourcePath.get(sourcePath);
  if (!hosts) {
    hosts = /* @__PURE__ */ new Set();
    embeddedCloudsBySourcePath.set(sourcePath, hosts);
  }
  hosts.add(hostEl);
}
function cleanupEmbeddedCloudInstance(hostEl) {
  const instance = embeddedCloudInstances.get(hostEl);
  if (!instance) {
    return;
  }
  const hosts = embeddedCloudsBySourcePath.get(instance.sourcePath);
  if (hosts) {
    hosts.delete(hostEl);
    if (hosts.size === 0) {
      embeddedCloudsBySourcePath.delete(instance.sourcePath);
    }
  }
  embeddedCloudInstances.delete(hostEl);
}
function scheduleSourcePathRefresh(sourcePath) {
  const existingTimer = sourcePathRefreshTimers.get(sourcePath);
  if (existingTimer !== void 0) {
    window.clearTimeout(existingTimer);
  }
  const timerId = window.setTimeout(() => {
    sourcePathRefreshTimers.delete(sourcePath);
    rerenderEmbeddedCloudsForSourcePath(sourcePath);
  }, EMBED_CONTENT_CHANGE_DEBOUNCE_MS);
  sourcePathRefreshTimers.set(sourcePath, timerId);
}
function rerenderEmbeddedCloudsForSourcePath(sourcePath) {
  const hosts = embeddedCloudsBySourcePath.get(sourcePath);
  if (!hosts || hosts.size === 0) {
    return;
  }
  for (const hostEl of [...hosts]) {
    if (!hostEl.isConnected) {
      cleanupEmbeddedCloudInstance(hostEl);
      continue;
    }
    const instance = embeddedCloudInstances.get(hostEl);
    if (!instance) {
      hosts.delete(hostEl);
      continue;
    }
    instance.rerender();
  }
}
function openEmbeddedWordCloudEditWizard(plugin, services, ctx, hostEl, options) {
  new EmbedWordCloudModal(
    plugin.app,
    services,
    async (embedBlock) => updateEmbeddedCodeBlock(plugin, ctx, hostEl, embedBlock),
    {
      title: "Edit embedded word cloud",
      description: "Update options for this embedded cloud without editing markdown manually.",
      submitButtonText: "Save",
      initialState: {
        scope: options.scope,
        size: options.size,
        tagsRaw: options.includeTags.join(", ")
      }
    }
  ).open();
}
async function updateEmbeddedCodeBlock(plugin, ctx, hostEl, embedBlock) {
  const sourceFile = resolveCurrentFile(plugin, ctx);
  if (!sourceFile) {
    new import_obsidian2.Notice("Could not locate the source note for this embedded word cloud.");
    return false;
  }
  const section = ctx.getSectionInfo(hostEl);
  if (!section) {
    new import_obsidian2.Notice("Could not locate the embedded word cloud block to update.");
    return false;
  }
  await plugin.app.vault.process(sourceFile, (content) => replaceSectionWithBlock(content, section.lineStart, section.lineEnd, embedBlock));
  return true;
}
async function updateEmbeddedCloudExcludedWords(plugin, ctx, hostEl, source, word) {
  const normalizedWord = normalizeWord(word);
  if (!normalizedWord) {
    return false;
  }
  const updatedSource = addExcludedWordToEmbeddedSource(source, normalizedWord);
  if (updatedSource === source) {
    return false;
  }
  const embedBlock = buildWordCloudCodeBlock(updatedSource);
  return updateEmbeddedCodeBlock(plugin, ctx, hostEl, embedBlock);
}
function replaceSectionWithBlock(content, lineStart, lineEnd, embedBlock) {
  const lines = content.split("\n");
  if (lineStart < 0 || lineEnd < lineStart || lineStart >= lines.length) {
    return content;
  }
  const replacementLines = embedBlock.replace(/\n$/, "").split("\n");
  const before = lines.slice(0, lineStart);
  const after = lines.slice(lineEnd + 1);
  return [...before, ...replacementLines, ...after].join("\n");
}
function addExcludedWordToEmbeddedSource(source, word) {
  const lines = source.replace(/\n$/, "").split("\n");
  const excluded = extractExcludedWords(lines);
  if (excluded.includes(word)) {
    return source;
  }
  const nextExcluded = [...excluded, word];
  const replacementLine = `exclude-words: ${nextExcluded.join(", ")}`;
  const existingLineIndex = lines.findIndex((line) => {
    const key = getOptionKey(line);
    return key === "exclude" || key === "exclude-words" || key === "exclude_words" || key === "excluded-words";
  });
  if (existingLineIndex >= 0) {
    lines[existingLineIndex] = replacementLine;
  } else {
    lines.push(replacementLine);
  }
  return `${lines.join("\n")}
`;
}
function buildWordCloudCodeBlock(source) {
  const trimmed = source.replace(/\n$/, "");
  return `\`\`\`wordcloud
${trimmed}
\`\`\``;
}
function extractExcludedWords(lines) {
  const entries = [];
  for (const line of lines) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    if (key !== "exclude" && key !== "exclude-words" && key !== "exclude_words" && key !== "excluded-words") {
      continue;
    }
    const rawValue = line.slice(separatorIndex + 1).trim();
    for (const value of rawValue.split(",")) {
      const normalized = normalizeWord(value);
      if (normalized && !entries.includes(normalized)) {
        entries.push(normalized);
      }
    }
  }
  return entries;
}
function getOptionKey(line) {
  const separatorIndex = line.indexOf(":");
  if (separatorIndex === -1) {
    return "";
  }
  return line.slice(0, separatorIndex).trim().toLowerCase();
}
function normalizeWord(value) {
  return value.trim().toLowerCase();
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
  const includeTags = (options.includeTags ?? []).map((tag) => normalizeTag(tag)).filter((tag) => tag.length > 0);
  const excludeTags = (options.excludeTags ?? []).map((tag) => normalizeTag(tag)).filter((tag) => tag.length > 0);
  if (includeTags.length > 0) {
    if (options.tagMatchMode === "all") {
      for (const tag of includeTags) {
        parts.push(tag);
      }
    } else {
      parts.push(`(${includeTags.join(" OR ")})`);
    }
  }
  for (const tag of excludeTags) {
    parts.push(`-${tag}`);
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
      const cache = app.metadataCache.getFileCache(file);
      const tags = getFileTags(app, file);
      const fileIndex = batchStart + index;
      onProgress?.(`Scanning ${fileIndex + 1}/${files.length} files...`, Math.round(fileIndex / totalFiles * 75));
      documents.push({
        id: file.path,
        path: file.path,
        basename: file.basename,
        rawText,
        tags,
        frontmatter: cache?.frontmatter && typeof cache.frontmatter === "object" ? { ...cache.frontmatter } : {}
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
  const linear3 = (count - minCount) / (maxCount - minCount);
  if (renderSettings.scalingMode === "power") {
    return clamp01(Math.pow(linear3, emphasis));
  }
  return clamp01(linear3);
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

// src/pipeline/stages/frequency-threshold.ts
function applyFrequencyThresholds(entries, thresholds) {
  if (!thresholds) {
    return entries;
  }
  const minCount = clampThreshold(thresholds.minCount, 1);
  const maxCount = clampThreshold(thresholds.maxCount, Number.MAX_SAFE_INTEGER);
  const safeMinCount = Math.min(minCount, maxCount);
  return entries.filter(([, count]) => count >= safeMinCount && count <= maxCount);
}
function clampThreshold(value, fallback) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return Math.max(1, Math.round(value));
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
  const includeTags = (rules.includeTags ?? []).map((tag) => normalizeTag(tag)).filter((tag) => tag.length > 0);
  const excludeTags = (rules.excludeTags ?? []).map((tag) => normalizeTag(tag)).filter((tag) => tag.length > 0);
  const scope = rules.scope;
  const activeFilePath = scope?.activeFilePath?.trim() ?? "";
  const folderPaths = (scope?.folderPaths ?? []).map((prefix) => prefix.trim()).filter(Boolean);
  const frontmatterRules = (rules.frontmatterRules ?? []).filter((rule) => rule.key.trim().length > 0);
  const queryText = rules.queryText?.trim().toLowerCase() ?? "";
  const tagMatchMode = rules.tagMatchMode ?? "any";
  return documents.filter((document2) => {
    if (!matchesScope(document2.path, scope?.mode ?? "vault", activeFilePath, folderPaths)) {
      return false;
    }
    if (includeTags.length > 0 && !matchesTagRules(document2.tags, includeTags, tagMatchMode)) {
      return false;
    }
    if (excludeTags.length > 0 && matchesAnyTag(document2.tags, excludeTags)) {
      return false;
    }
    if (frontmatterRules.length > 0 && !matchesFrontmatterRules(document2.frontmatter, frontmatterRules)) {
      return false;
    }
    if (queryText.length > 0 && !matchesQueryText(document2, queryText)) {
      return false;
    }
    return true;
  });
}
function matchesTagRules(documentTags, filters, mode) {
  const normalizedTags = new Set(documentTags.map((tag) => normalizeTag(tag)).filter(Boolean));
  if (mode === "all") {
    return filters.every((filterTag) => normalizedTags.has(filterTag));
  }
  return filters.some((filterTag) => normalizedTags.has(filterTag));
}
function matchesAnyTag(documentTags, filters) {
  const normalizedTags = new Set(documentTags.map((tag) => normalizeTag(tag)).filter(Boolean));
  return filters.some((filterTag) => normalizedTags.has(filterTag));
}
function matchesScope(path, mode, activeFilePath, folderPaths) {
  if (mode === "active-file") {
    return activeFilePath.length > 0 && path === activeFilePath;
  }
  if (mode === "folder") {
    if (folderPaths.length === 0) {
      return false;
    }
    return folderPaths.some((folderPath) => path === folderPath || path.startsWith(`${folderPath}/`));
  }
  return true;
}
function matchesFrontmatterRules(frontmatter, rules) {
  if (!rules) {
    return true;
  }
  return rules.every((rule) => {
    const key = rule.key.trim();
    if (!key) {
      return true;
    }
    const actual = frontmatter[key];
    const expected = (rule.value ?? "").trim();
    if (rule.operator === "exists") {
      return actual !== void 0;
    }
    if (rule.operator === "not-exists") {
      return actual === void 0;
    }
    if (actual === void 0) {
      return false;
    }
    if (rule.operator === "contains") {
      return containsValue(actual, expected);
    }
    if (rule.operator === "equals") {
      return compareScalar(actual, expected) === 0;
    }
    if (rule.operator === "not-equals") {
      return compareScalar(actual, expected) !== 0;
    }
    if (rule.operator === "gt") {
      return compareScalar(actual, expected) > 0;
    }
    if (rule.operator === "gte") {
      return compareScalar(actual, expected) >= 0;
    }
    if (rule.operator === "lt") {
      return compareScalar(actual, expected) < 0;
    }
    if (rule.operator === "lte") {
      return compareScalar(actual, expected) <= 0;
    }
    return true;
  });
}
function containsValue(actual, expected) {
  const normalizedExpected = expected.toLowerCase();
  if (Array.isArray(actual)) {
    return actual.some((entry) => String(entry).toLowerCase().includes(normalizedExpected));
  }
  return String(actual).toLowerCase().includes(normalizedExpected);
}
function compareScalar(actual, expected) {
  const numericActual = tryParseNumber(actual);
  const numericExpected = tryParseNumber(expected);
  if (numericActual !== null && numericExpected !== null) {
    return numericActual - numericExpected;
  }
  const booleanActual = tryParseBoolean(actual);
  const booleanExpected = tryParseBoolean(expected);
  if (booleanActual !== null && booleanExpected !== null) {
    if (booleanActual === booleanExpected) {
      return 0;
    }
    return booleanActual ? 1 : -1;
  }
  return String(actual).localeCompare(expected, void 0, { sensitivity: "base", numeric: true });
}
function tryParseNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}
function tryParseBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }
  return null;
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
  const filteredEntries = applyFrequencyThresholds(aggregateResult.entries, input.frequency);
  const words = scaleEntries(filteredEntries, input.renderSettings, strategies.scaling);
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
  async collectFromFiles(files, stopWords, renderSettings, onProgress, options) {
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
    const combinedStopWords = new Set(stopWords);
    for (const word of options?.excludeWords ?? []) {
      const normalized = word.trim().toLowerCase();
      if (normalized) {
        combinedStopWords.add(normalized);
      }
    }
    const model = runPipeline({
      documents,
      stopWords: combinedStopWords,
      renderSettings,
      sourceRules: options?.sourceRules,
      frequency: options?.frequency
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
var import_obsidian3 = require("obsidian");

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
  const linear3 = (count - minCount) / (maxCount - minCount);
  if (renderSettings.scalingMode === "power") {
    return clamp012(Math.pow(linear3, emphasis));
  }
  return clamp012(linear3);
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
  },
  filters: {
    scope: {
      mode: "vault",
      activeFilePath: "",
      folderPaths: []
    },
    includeTags: [],
    excludeTags: [],
    tagMatchMode: "any",
    frontmatterRules: [],
    frequency: {
      minCount: 1,
      maxCount: 9999
    }
  }
};
var VaultWordCloudSettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Word clouds settings" });
    let draftWord = "";
    const addExcludedWord = new import_obsidian3.Setting(containerEl).setName("Add excluded word").setDesc("Add one word at a time to the blacklist.").addText((text) => {
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
    const resetExcludedWords = new import_obsidian3.Setting(containerEl).setName("Reset excluded words").setDesc("Restore the original default blacklist.").addButton((button) => {
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
    const rotationStyle = new import_obsidian3.Setting(containerEl).setName("Rotation style").setDesc("How words are angled in the cloud.").addDropdown((dropdown) => {
      dropdown.addOption("horizontal", "Horizontal only").addOption("mostly-horizontal", "Mostly horizontal").addOption("mixed", "Mixed angles").addOption("vertical", "Vertical heavy").setValue(this.plugin.settings.render.rotationPreset).onChange(async (value) => {
        await updateRenderAndPreview({
          rotationPreset: value
        });
      });
    });
    this.attachInfoIcon(rotationStyle, "Horizontal is easiest to read. Mixed/vertical can pack more words but may reduce readability.");
    const spiralLayout = new import_obsidian3.Setting(containerEl).setName("Spiral layout").setDesc("Placement strategy for positioning words.").addDropdown((dropdown) => {
      dropdown.addOption("archimedean", "Archimedean").addOption("rectangular", "Rectangular").setValue(this.plugin.settings.render.spiral).onChange(async (value) => {
        await updateRenderAndPreview({
          spiral: value
        });
      });
    });
    this.attachInfoIcon(spiralLayout, "Archimedean is more organic. Rectangular can appear tighter in some datasets.");
    const wordPadding = new import_obsidian3.Setting(containerEl).setName("Word padding").setDesc("Space between words in pixels.").addSlider((slider) => {
      slider.setLimits(0, 12, 1).setValue(this.plugin.settings.render.wordPadding).setDynamicTooltip().onChange(async (value) => {
        await updateRenderAndPreview({ wordPadding: value });
      });
    });
    this.attachInfoIcon(wordPadding, "Increase to reduce collisions and improve readability. Lower values pack more words.");
    const minFontSize = new import_obsidian3.Setting(containerEl).setName("Minimum font size").setDesc("Smallest rendered word size.").addSlider((slider) => {
      slider.setLimits(8, 64, 1).setValue(this.plugin.settings.render.minFontSize).setDynamicTooltip().onChange(async (value) => {
        await updateRenderAndPreview({ minFontSize: value });
      });
    });
    this.attachInfoIcon(minFontSize, "Sets the floor of visual size mapping. Higher minimum makes low-frequency words more legible.");
    const maxFontSize = new import_obsidian3.Setting(containerEl).setName("Maximum font size").setDesc("Largest rendered word size.").addSlider((slider) => {
      slider.setLimits(16, 140, 1).setValue(this.plugin.settings.render.maxFontSize).setDynamicTooltip().onChange(async (value) => {
        await updateRenderAndPreview({ maxFontSize: value });
      });
    });
    this.attachInfoIcon(maxFontSize, "Sets the ceiling of visual size mapping. Higher values emphasize top words more strongly.");
    const fontFamily = new import_obsidian3.Setting(containerEl).setName("Font family").setDesc("CSS font family used for words.").addText((text) => {
      text.setPlaceholder("sans-serif").setValue(this.plugin.settings.render.fontFamily).onChange(async (value) => {
        await updateRenderAndPreview({ fontFamily: value.trim() || "sans-serif" });
      });
    });
    this.attachInfoIcon(fontFamily, "Wider fonts take more space and can increase overlap pressure.");
    const showCountInWordText = new import_obsidian3.Setting(containerEl).setName("Show count in word text").setDesc("Append the occurrence count directly to rendered words.").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ showCountInWordText: value });
        this.display();
      });
    });
    this.attachInfoIcon(showCountInWordText, "Shows exact counts inline (e.g., word (12)). Improves precision, increases text length.");
    const countLabelFormat = new import_obsidian3.Setting(containerEl).setName("Count label format").setDesc("How counts are shown when count labels are enabled.").addDropdown((dropdown) => {
      dropdown.addOption("paren", "word (12)").addOption("dot", "word \xB7 12").addOption("colon", "word: 12").setValue(this.plugin.settings.render.countLabelFormat).setDisabled(!this.plugin.settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ countLabelFormat: value });
      });
    });
    this.attachInfoIcon(countLabelFormat, "Formatting style for inline counts.");
    const countLabelMinimum = new import_obsidian3.Setting(containerEl).setName("Count label minimum").setDesc("Show inline count only for words at or above this count.").addSlider((slider) => {
      slider.setLimits(1, 100, 1).setValue(this.plugin.settings.render.countLabelMinCount).setDynamicTooltip().setDisabled(!this.plugin.settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ countLabelMinCount: value });
      });
    });
    this.attachInfoIcon(countLabelMinimum, "Avoids visual noise by hiding counts for very small values.");
    const sizeScalingMode = new import_obsidian3.Setting(containerEl).setName("Size scaling mode").setDesc("How numeric count differences map to font-size differences.").addDropdown((dropdown) => {
      dropdown.addOption("linear", "Linear").addOption("power", "Power").addOption("log", "Log").addOption("rank", "Rank").setValue(this.plugin.settings.render.scalingMode).onChange(async (value) => {
        await updateRenderAndPreview({ scalingMode: value });
        this.display();
      });
    });
    this.attachInfoIcon(sizeScalingMode, "Linear is proportional. Power exaggerates gaps. Log compresses extremes. Rank ignores absolute gaps.");
    const emphasis = new import_obsidian3.Setting(containerEl).setName("Emphasis").setDesc("Higher values exaggerate size differences (power scaling mode).").addSlider((slider) => {
      slider.setLimits(0.5, 3, 0.1).setValue(this.plugin.settings.render.emphasis).setDynamicTooltip().setDisabled(this.plugin.settings.render.scalingMode !== "power").onChange(async (value) => {
        await updateRenderAndPreview({ emphasis: value });
      });
    });
    this.attachInfoIcon(emphasis, "Only used in Power scaling mode. 1.0 is baseline; higher exaggerates differences more.");
    const deterministicLayout = new import_obsidian3.Setting(containerEl).setName("Deterministic layout").setDesc("Keep cloud layout stable across refreshes using a seed.").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.render.deterministicLayout).onChange(async (value) => {
        await updateRenderAndPreview({ deterministicLayout: value });
        this.display();
      });
    });
    this.attachInfoIcon(deterministicLayout, "Useful for comparing before/after changes with stable positions.");
    const randomSeed = new import_obsidian3.Setting(containerEl).setName("Random seed").setDesc("Seed used when deterministic layout is enabled.").addText((text) => {
      text.setValue(String(this.plugin.settings.render.randomSeed)).setDisabled(!this.plugin.settings.render.deterministicLayout).onChange(async (value) => {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isNaN(parsed)) {
          await updateRenderAndPreview({ randomSeed: parsed });
        }
      });
    });
    this.attachInfoIcon(randomSeed, "Changing seed gives a different stable arrangement.");
    const resetRendering = new import_obsidian3.Setting(containerEl).setName("Reset rendering settings").setDesc("Restore default renderer controls.").addButton((button) => {
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
    const progressDetail = new import_obsidian3.Setting(containerEl).setName("Progress detail").setDesc("How frequently progress is updated while scanning and layout.").addDropdown((dropdown) => {
      dropdown.addOption("unhinged", "Unhinged (max speed)").addOption("minimal", "Minimal (fastest)").addOption("balanced", "Balanced").addOption("detailed", "Detailed").setValue(this.plugin.settings.render.progressDetail).onChange(async (value) => {
        await this.plugin.updateRenderSettings({ progressDetail: value });
      });
    });
    this.attachInfoIcon(progressDetail, "Unhinged maximizes speed and may lock UI temporarily. Detailed is most informative but slower.");
    const scanBatchSize = new import_obsidian3.Setting(containerEl).setName("Scan batch size").setDesc("How many files are read in parallel during vault scanning.").addSlider((slider) => {
      slider.setLimits(8, 64, 1).setValue(this.plugin.settings.render.scanBatchSize).setDynamicTooltip().onChange(async (value) => {
        await this.plugin.updateRenderSettings({ scanBatchSize: value });
      });
    });
    this.attachInfoIcon(scanBatchSize, "Higher can be faster on strong devices but uses more memory/IO.");
    const layoutTimeSlice = new import_obsidian3.Setting(containerEl).setName("Layout time slice (ms)").setDesc("Time per layout chunk. Lower is smoother; higher is faster.").addSlider((slider) => {
      slider.setLimits(8, 40, 1).setValue(this.plugin.settings.render.layoutTimeIntervalMs).setDynamicTooltip().onChange(async (value) => {
        await this.plugin.updateRenderSettings({ layoutTimeIntervalMs: value });
      });
    });
    this.attachInfoIcon(layoutTimeSlice, "Controls responsiveness while laying out words.");
    const resetPerformance = new import_obsidian3.Setting(containerEl).setName("Reset performance settings").setDesc("Restore default performance tuning values.").addButton((button) => {
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

// node_modules/d3-array/src/ascending.js
function ascending(a, b) {
  return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// node_modules/d3-array/src/descending.js
function descending(a, b) {
  return a == null || b == null ? NaN : b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

// node_modules/d3-array/src/bisector.js
function bisector(f) {
  let compare1, compare2, delta;
  if (f.length !== 2) {
    compare1 = ascending;
    compare2 = (d, x) => ascending(f(d), x);
    delta = (d, x) => f(d) - x;
  } else {
    compare1 = f === ascending || f === descending ? f : zero;
    compare2 = f;
    delta = f;
  }
  function left(a, x, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x, x) !== 0)
        return hi;
      do {
        const mid = lo + hi >>> 1;
        if (compare2(a[mid], x) < 0)
          lo = mid + 1;
        else
          hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function right(a, x, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x, x) !== 0)
        return hi;
      do {
        const mid = lo + hi >>> 1;
        if (compare2(a[mid], x) <= 0)
          lo = mid + 1;
        else
          hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function center(a, x, lo = 0, hi = a.length) {
    const i = left(a, x, lo, hi - 1);
    return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
  }
  return { left, center, right };
}
function zero() {
  return 0;
}

// node_modules/d3-array/src/number.js
function number(x) {
  return x === null ? NaN : +x;
}

// node_modules/d3-array/src/bisect.js
var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;
var bisectLeft = ascendingBisect.left;
var bisectCenter = bisector(number).center;
var bisect_default = bisectRight;

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

// node_modules/d3-array/src/ticks.js
var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);
function tickSpec(start, stop, count) {
  const step = (stop - start) / Math.max(0, count), power = Math.floor(Math.log10(step)), error = step / Math.pow(10, power), factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
  let i1, i2, inc;
  if (power < 0) {
    inc = Math.pow(10, -power) / factor;
    i1 = Math.round(start * inc);
    i2 = Math.round(stop * inc);
    if (i1 / inc < start)
      ++i1;
    if (i2 / inc > stop)
      --i2;
    inc = -inc;
  } else {
    inc = Math.pow(10, power) * factor;
    i1 = Math.round(start / inc);
    i2 = Math.round(stop / inc);
    if (i1 * inc < start)
      ++i1;
    if (i2 * inc > stop)
      --i2;
  }
  if (i2 < i1 && 0.5 <= count && count < 2)
    return tickSpec(start, stop, count * 2);
  return [i1, i2, inc];
}
function ticks(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  if (!(count > 0))
    return [];
  if (start === stop)
    return [start];
  const reverse = stop < start, [i1, i2, inc] = reverse ? tickSpec(stop, start, count) : tickSpec(start, stop, count);
  if (!(i2 >= i1))
    return [];
  const n = i2 - i1 + 1, ticks2 = new Array(n);
  if (reverse) {
    if (inc < 0)
      for (let i = 0; i < n; ++i)
        ticks2[i] = (i2 - i) / -inc;
    else
      for (let i = 0; i < n; ++i)
        ticks2[i] = (i2 - i) * inc;
  } else {
    if (inc < 0)
      for (let i = 0; i < n; ++i)
        ticks2[i] = (i1 + i) / -inc;
    else
      for (let i = 0; i < n; ++i)
        ticks2[i] = (i1 + i) * inc;
  }
  return ticks2;
}
function tickIncrement(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  return tickSpec(start, stop, count)[2];
}
function tickStep(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  const reverse = stop < start, inc = reverse ? tickIncrement(stop, start, count) : tickIncrement(start, stop, count);
  return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
}

// node_modules/d3-array/src/range.js
function range(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
  var i = -1, n = Math.max(0, Math.ceil((stop - start) / step)) | 0, range2 = new Array(n);
  while (++i < n) {
    range2[i] = start + i * step;
  }
  return range2;
}

// node_modules/d3-scale/src/init.js
function initRange(domain, range2) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(domain);
      break;
    default:
      this.range(range2).domain(domain);
      break;
  }
  return this;
}

// node_modules/d3-scale/src/ordinal.js
var implicit = Symbol("implicit");
function ordinal() {
  var index = new InternMap(), domain = [], range2 = [], unknown = implicit;
  function scale(d) {
    let i = index.get(d);
    if (i === void 0) {
      if (unknown !== implicit)
        return unknown;
      index.set(d, i = domain.push(d) - 1);
    }
    return range2[i % range2.length];
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
    return arguments.length ? (range2 = Array.from(_), scale) : range2.slice();
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  scale.copy = function() {
    return ordinal(domain, range2).unknown(unknown);
  };
  initRange.apply(scale, arguments);
  return scale;
}

// node_modules/d3-scale/src/band.js
function band() {
  var scale = ordinal().unknown(void 0), domain = scale.domain, ordinalRange = scale.range, r0 = 0, r1 = 1, step, bandwidth, round = false, paddingInner = 0, paddingOuter = 0, align = 0.5;
  delete scale.unknown;
  function rescale() {
    var n = domain().length, reverse = r1 < r0, start = reverse ? r1 : r0, stop = reverse ? r0 : r1;
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round)
      step = Math.floor(step);
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round)
      start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = range(n).map(function(i) {
      return start + step * i;
    });
    return ordinalRange(reverse ? values.reverse() : values);
  }
  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };
  scale.range = function(_) {
    return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
  };
  scale.rangeRound = function(_) {
    return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
  };
  scale.bandwidth = function() {
    return bandwidth;
  };
  scale.step = function() {
    return step;
  };
  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };
  scale.padding = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
  };
  scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
  };
  scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
  };
  scale.align = function(_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };
  scale.copy = function() {
    return band(domain(), [r0, r1]).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
  };
  return initRange.apply(rescale(), arguments);
}

// node_modules/d3-color/src/define.js
function define_default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition)
    prototype[key] = definition[key];
  return prototype;
}

// node_modules/d3-color/src/color.js
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`);
var reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`);
var reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`);
var reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`);
var reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`);
var reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define_default(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHex8() {
  return this.rgb().formatHex8();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format2) {
  var m, l;
  format2 = (format2 + "").trim().toLowerCase();
  return (m = reHex.exec(format2)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format2)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format2)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format2)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format2)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format2)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format2)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format2) ? rgbn(named[format2]) : format2 === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
  if (a <= 0)
    r = g = b = NaN;
  return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define_default(Rgb, rgb, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a) {
  if (a <= 0)
    h = s = l = NaN;
  else if (l <= 0 || l >= 1)
    h = s = NaN;
  else if (s <= 0)
    h = NaN;
  return new Hsl(h, s, l, a);
}
function hslConvert(o) {
  if (o instanceof Hsl)
    return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Hsl();
  if (o instanceof Hsl)
    return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s = max - min, l = (max + min) / 2;
  if (s) {
    if (r === max)
      h = (g - b) / s + (g < b) * 6;
    else if (g === max)
      h = (b - r) / s + 2;
    else
      h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
define_default(Hsl, hsl, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));
function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}
function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

// node_modules/d3-interpolate/src/basis.js
function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function basis_default(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/basisClosed.js
function basisClosed_default(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/constant.js
var constant_default = (x) => () => x;

// node_modules/d3-interpolate/src/color.js
function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}
function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}
function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant_default(isNaN(a) ? b : a);
  };
}
function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant_default(isNaN(a) ? b : a);
}

// node_modules/d3-interpolate/src/rgb.js
var rgb_default = function rgbGamma(y) {
  var color2 = gamma(y);
  function rgb2(start, end) {
    var r = color2((start = rgb(start)).r, (end = rgb(end)).r), g = color2(start.g, end.g), b = color2(start.b, end.b), opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
  rgb2.gamma = rgbGamma;
  return rgb2;
}(1);
function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
    for (i = 0; i < n; ++i) {
      color2 = rgb(colors[i]);
      r[i] = color2.r || 0;
      g[i] = color2.g || 0;
      b[i] = color2.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color2.opacity = 1;
    return function(t) {
      color2.r = r(t);
      color2.g = g(t);
      color2.b = b(t);
      return color2 + "";
    };
  };
}
var rgbBasis = rgbSpline(basis_default);
var rgbBasisClosed = rgbSpline(basisClosed_default);

// node_modules/d3-interpolate/src/numberArray.js
function numberArray_default(a, b) {
  if (!b)
    b = [];
  var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
  return function(t) {
    for (i = 0; i < n; ++i)
      c[i] = a[i] * (1 - t) + b[i] * t;
    return c;
  };
}
function isNumberArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}

// node_modules/d3-interpolate/src/array.js
function genericArray(a, b) {
  var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = new Array(na), c = new Array(nb), i;
  for (i = 0; i < na; ++i)
    x[i] = value_default(a[i], b[i]);
  for (; i < nb; ++i)
    c[i] = b[i];
  return function(t) {
    for (i = 0; i < na; ++i)
      c[i] = x[i](t);
    return c;
  };
}

// node_modules/d3-interpolate/src/date.js
function date_default(a, b) {
  var d = /* @__PURE__ */ new Date();
  return a = +a, b = +b, function(t) {
    return d.setTime(a * (1 - t) + b * t), d;
  };
}

// node_modules/d3-interpolate/src/number.js
function number_default(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

// node_modules/d3-interpolate/src/object.js
function object_default(a, b) {
  var i = {}, c = {}, k;
  if (a === null || typeof a !== "object")
    a = {};
  if (b === null || typeof b !== "object")
    b = {};
  for (k in b) {
    if (k in a) {
      i[k] = value_default(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }
  return function(t) {
    for (k in i)
      c[k] = i[k](t);
    return c;
  };
}

// node_modules/d3-interpolate/src/string.js
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function zero2(b) {
  return function() {
    return b;
  };
}
function one(b) {
  return function(t) {
    return b(t) + "";
  };
}
function string_default(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
  a = a + "", b = b + "";
  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      bs = b.slice(bi, bs);
      if (s[i])
        s[i] += bs;
      else
        s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s[i])
        s[i] += bm;
      else
        s[++i] = bm;
    } else {
      s[++i] = null;
      q.push({ i, x: number_default(am, bm) });
    }
    bi = reB.lastIndex;
  }
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i])
      s[i] += bs;
    else
      s[++i] = bs;
  }
  return s.length < 2 ? q[0] ? one(q[0].x) : zero2(b) : (b = q.length, function(t) {
    for (var i2 = 0, o; i2 < b; ++i2)
      s[(o = q[i2]).i] = o.x(t);
    return s.join("");
  });
}

// node_modules/d3-interpolate/src/value.js
function value_default(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? constant_default(b) : (t === "number" ? number_default : t === "string" ? (c = color(b)) ? (b = c, rgb_default) : string_default : b instanceof color ? rgb_default : b instanceof Date ? date_default : isNumberArray(b) ? numberArray_default : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object_default : number_default)(a, b);
}

// node_modules/d3-interpolate/src/round.js
function round_default(a, b) {
  return a = +a, b = +b, function(t) {
    return Math.round(a * (1 - t) + b * t);
  };
}

// node_modules/d3-scale/src/constant.js
function constants(x) {
  return function() {
    return x;
  };
}

// node_modules/d3-scale/src/number.js
function number2(x) {
  return +x;
}

// node_modules/d3-scale/src/continuous.js
var unit = [0, 1];
function identity(x) {
  return x;
}
function normalize(a, b) {
  return (b -= a = +a) ? function(x) {
    return (x - a) / b;
  } : constants(isNaN(b) ? NaN : 0.5);
}
function clamper(a, b) {
  var t;
  if (a > b)
    t = a, a = b, b = t;
  return function(x) {
    return Math.max(a, Math.min(b, x));
  };
}
function bimap(domain, range2, interpolate) {
  var d0 = domain[0], d1 = domain[1], r0 = range2[0], r1 = range2[1];
  if (d1 < d0)
    d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
  else
    d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
  return function(x) {
    return r0(d0(x));
  };
}
function polymap(domain, range2, interpolate) {
  var j = Math.min(domain.length, range2.length) - 1, d = new Array(j), r = new Array(j), i = -1;
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range2 = range2.slice().reverse();
  }
  while (++i < j) {
    d[i] = normalize(domain[i], domain[i + 1]);
    r[i] = interpolate(range2[i], range2[i + 1]);
  }
  return function(x) {
    var i2 = bisect_default(domain, x, 1, j) - 1;
    return r[i2](d[i2](x));
  };
}
function copy(source, target) {
  return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
}
function transformer() {
  var domain = unit, range2 = unit, interpolate = value_default, transform, untransform, unknown, clamp = identity, piecewise, output, input;
  function rescale() {
    var n = Math.min(domain.length, range2.length);
    if (clamp !== identity)
      clamp = clamper(domain[0], domain[n - 1]);
    piecewise = n > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }
  function scale(x) {
    return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range2, interpolate)))(transform(clamp(x)));
  }
  scale.invert = function(y) {
    return clamp(untransform((input || (input = piecewise(range2, domain.map(transform), number_default)))(y)));
  };
  scale.domain = function(_) {
    return arguments.length ? (domain = Array.from(_, number2), rescale()) : domain.slice();
  };
  scale.range = function(_) {
    return arguments.length ? (range2 = Array.from(_), rescale()) : range2.slice();
  };
  scale.rangeRound = function(_) {
    return range2 = Array.from(_), interpolate = round_default, rescale();
  };
  scale.clamp = function(_) {
    return arguments.length ? (clamp = _ ? true : identity, rescale()) : clamp !== identity;
  };
  scale.interpolate = function(_) {
    return arguments.length ? (interpolate = _, rescale()) : interpolate;
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  return function(t, u) {
    transform = t, untransform = u;
    return rescale();
  };
}
function continuous() {
  return transformer()(identity, identity);
}

// node_modules/d3-format/src/formatDecimal.js
function formatDecimal_default(x) {
  return Math.abs(x = Math.round(x)) >= 1e21 ? x.toLocaleString("en").replace(/,/g, "") : x.toString(10);
}
function formatDecimalParts(x, p) {
  if (!isFinite(x) || x === 0)
    return null;
  var i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e"), coefficient = x.slice(0, i);
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
}

// node_modules/d3-format/src/exponent.js
function exponent_default(x) {
  return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
}

// node_modules/d3-format/src/formatGroup.js
function formatGroup_default(grouping, thousands) {
  return function(value, width) {
    var i = value.length, t = [], j = 0, g = grouping[0], length = 0;
    while (i > 0 && g > 0) {
      if (length + g + 1 > width)
        g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width)
        break;
      g = grouping[j = (j + 1) % grouping.length];
    }
    return t.reverse().join(thousands);
  };
}

// node_modules/d3-format/src/formatNumerals.js
function formatNumerals_default(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}

// node_modules/d3-format/src/formatSpecifier.js
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier)))
    throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}
formatSpecifier.prototype = FormatSpecifier.prototype;
function FormatSpecifier(specifier) {
  this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
  this.align = specifier.align === void 0 ? ">" : specifier.align + "";
  this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === void 0 ? void 0 : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === void 0 ? "" : specifier.type + "";
}
FormatSpecifier.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};

// node_modules/d3-format/src/formatTrim.js
function formatTrim_default(s) {
  out:
    for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (s[i]) {
        case ".":
          i0 = i1 = i;
          break;
        case "0":
          if (i0 === 0)
            i0 = i;
          i1 = i;
          break;
        default:
          if (!+s[i])
            break out;
          if (i0 > 0)
            i0 = 0;
          break;
      }
    }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

// node_modules/d3-format/src/formatPrefixAuto.js
var prefixExponent;
function formatPrefixAuto_default(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d)
    return prefixExponent = void 0, x.toPrecision(p);
  var coefficient = d[0], exponent = d[1], i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1, n = coefficient.length;
  return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0];
}

// node_modules/d3-format/src/formatRounded.js
function formatRounded_default(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d)
    return x + "";
  var coefficient = d[0], exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

// node_modules/d3-format/src/formatTypes.js
var formatTypes_default = {
  "%": (x, p) => (x * 100).toFixed(p),
  "b": (x) => Math.round(x).toString(2),
  "c": (x) => x + "",
  "d": formatDecimal_default,
  "e": (x, p) => x.toExponential(p),
  "f": (x, p) => x.toFixed(p),
  "g": (x, p) => x.toPrecision(p),
  "o": (x) => Math.round(x).toString(8),
  "p": (x, p) => formatRounded_default(x * 100, p),
  "r": formatRounded_default,
  "s": formatPrefixAuto_default,
  "X": (x) => Math.round(x).toString(16).toUpperCase(),
  "x": (x) => Math.round(x).toString(16)
};

// node_modules/d3-format/src/identity.js
function identity_default(x) {
  return x;
}

// node_modules/d3-format/src/locale.js
var map = Array.prototype.map;
var prefixes = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function locale_default(locale2) {
  var group = locale2.grouping === void 0 || locale2.thousands === void 0 ? identity_default : formatGroup_default(map.call(locale2.grouping, Number), locale2.thousands + ""), currencyPrefix = locale2.currency === void 0 ? "" : locale2.currency[0] + "", currencySuffix = locale2.currency === void 0 ? "" : locale2.currency[1] + "", decimal = locale2.decimal === void 0 ? "." : locale2.decimal + "", numerals = locale2.numerals === void 0 ? identity_default : formatNumerals_default(map.call(locale2.numerals, String)), percent = locale2.percent === void 0 ? "%" : locale2.percent + "", minus = locale2.minus === void 0 ? "\u2212" : locale2.minus + "", nan = locale2.nan === void 0 ? "NaN" : locale2.nan + "";
  function newFormat(specifier, options) {
    specifier = formatSpecifier(specifier);
    var fill = specifier.fill, align = specifier.align, sign = specifier.sign, symbol = specifier.symbol, zero3 = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
    if (type === "n")
      comma = true, type = "g";
    else if (!formatTypes_default[type])
      precision === void 0 && (precision = 12), trim = true, type = "g";
    if (zero3 || fill === "0" && align === "=")
      zero3 = true, fill = "0", align = "=";
    var prefix = (options && options.prefix !== void 0 ? options.prefix : "") + (symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : ""), suffix = (symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "") + (options && options.suffix !== void 0 ? options.suffix : "");
    var formatType = formatTypes_default[type], maybeSuffix = /[defgprs%]/.test(type);
    precision = precision === void 0 ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
    function format2(value) {
      var valuePrefix = prefix, valueSuffix = suffix, i, n, c;
      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;
        var valueNegative = value < 0 || 1 / value < 0;
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
        if (trim)
          value = formatTrim_default(value);
        if (valueNegative && +value === 0 && sign !== "+")
          valueNegative = false;
        valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" && !isNaN(value) && prefixExponent !== void 0 ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }
      if (comma && !zero3)
        value = group(value, Infinity);
      var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
      if (comma && zero3)
        value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;
          break;
        case "=":
          value = valuePrefix + padding + value + valueSuffix;
          break;
        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          break;
        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }
      return numerals(value);
    }
    format2.toString = function() {
      return specifier + "";
    };
    return format2;
  }
  function formatPrefix2(specifier, value) {
    var e = Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3, k = Math.pow(10, -e), f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier), { suffix: prefixes[8 + e / 3] });
    return function(value2) {
      return f(k * value2);
    };
  }
  return {
    format: newFormat,
    formatPrefix: formatPrefix2
  };
}

// node_modules/d3-format/src/defaultLocale.js
var locale;
var format;
var formatPrefix;
defaultLocale({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function defaultLocale(definition) {
  locale = locale_default(definition);
  format = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}

// node_modules/d3-format/src/precisionFixed.js
function precisionFixed_default(step) {
  return Math.max(0, -exponent_default(Math.abs(step)));
}

// node_modules/d3-format/src/precisionPrefix.js
function precisionPrefix_default(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3 - exponent_default(Math.abs(step)));
}

// node_modules/d3-format/src/precisionRound.js
function precisionRound_default(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent_default(max) - exponent_default(step)) + 1;
}

// node_modules/d3-scale/src/tickFormat.js
function tickFormat(start, stop, count, specifier) {
  var step = tickStep(start, stop, count), precision;
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix_default(step, value)))
        specifier.precision = precision;
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound_default(step, Math.max(Math.abs(start), Math.abs(stop)))))
        specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = precisionFixed_default(step)))
        specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return format(specifier);
}

// node_modules/d3-scale/src/linear.js
function linearish(scale) {
  var domain = scale.domain;
  scale.ticks = function(count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };
  scale.tickFormat = function(count, specifier) {
    var d = domain();
    return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
  };
  scale.nice = function(count) {
    if (count == null)
      count = 10;
    var d = domain();
    var i0 = 0;
    var i1 = d.length - 1;
    var start = d[i0];
    var stop = d[i1];
    var prestep;
    var step;
    var maxIter = 10;
    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }
    while (maxIter-- > 0) {
      step = tickIncrement(start, stop, count);
      if (step === prestep) {
        d[i0] = start;
        d[i1] = stop;
        return domain(d);
      } else if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
      } else {
        break;
      }
      prestep = step;
    }
    return scale;
  };
  return scale;
}
function linear2() {
  var scale = continuous();
  scale.copy = function() {
    return copy(scale, linear2());
  };
  initRange.apply(scale, arguments);
  return linearish(scale);
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
function constant_default2(x) {
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
    value = constant_default2(value);
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
    compare = ascending2;
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
function ascending2(a, b) {
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
var import_obsidian4 = require("obsidian");
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
  const {
    containerEl,
    words,
    ariaLabel,
    onWordClick,
    onExcludeInCloud,
    onExcludeInVault,
    onProgress,
    onRefresh
  } = options;
  const exportBaseName = sanitizeFileName(options.exportBaseName ?? "word-cloud");
  const enableExport = options.enableExport ?? true;
  const enableOverlayControls = options.enableOverlayControls ?? true;
  const enableViewportInteraction = options.enableViewportInteraction ?? true;
  const showRefreshControl = options.showRefreshControl ?? true;
  const showZoomControls = options.showZoomControls ?? true;
  const showEditControl = options.showEditControl ?? false;
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
  const color2 = ordinal(Tableau10_default);
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
      g.selectAll("text").data(layoutWords2).enter().append("text").style("font-size", (d) => `${d.size}px`).style("font-family", renderSettings.fontFamily || "sans-serif").style("fill", (_, i) => color2(String(i))).style("cursor", "pointer").attr("tabindex", 0).attr("text-anchor", "middle").attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`).text((d) => d.layoutText).on("click", (_, d) => {
        if (viewportControls.shouldSuppressWordClick()) {
          return;
        }
        onWordClick(d.baseText);
      }).on("keydown", (event, d) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onWordClick(d.baseText);
          return;
        }
        if ((onExcludeInCloud || onExcludeInVault) && (event.key === "ContextMenu" || event.shiftKey && event.key === "F10")) {
          event.preventDefault();
          openExcludeWordMenuAtFocusedWord(event.currentTarget, d.baseText, onExcludeInCloud, onExcludeInVault);
        }
      }).on("contextmenu", (event, d) => {
        if (!onExcludeInCloud && !onExcludeInVault) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        openExcludeWordMenuAtPointer(event, d.baseText, onExcludeInCloud, onExcludeInVault);
      }).append("title").text((d) => `${d.baseText} (${d.count})`);
      reportProgress("Rendering complete.", 100);
      if (enableOverlayControls) {
        renderOverlayControls(
          containerEl,
          svg.node(),
          exportBaseName,
          enableExport,
          onRefresh,
          options.onEdit,
          viewportControls,
          showRefreshControl,
          showZoomControls,
          showEditControl
        );
      }
      resolve();
    }).start();
  });
}
function openExcludeWordMenuAtPointer(event, word, onExcludeInCloud, onExcludeInVault) {
  const menu = new import_obsidian4.Menu();
  addExcludeMenuItems(menu, word, onExcludeInCloud, onExcludeInVault);
  menu.showAtMouseEvent(event);
}
function openExcludeWordMenuAtFocusedWord(target, word, onExcludeInCloud, onExcludeInVault) {
  if (!(target instanceof SVGGraphicsElement)) {
    return;
  }
  const rect = target.getBoundingClientRect();
  const menu = new import_obsidian4.Menu();
  addExcludeMenuItems(menu, word, onExcludeInCloud, onExcludeInVault);
  menu.showAtPosition({
    x: Math.round(rect.left + rect.width / 2),
    y: Math.round(rect.bottom)
  });
}
function addExcludeMenuItems(menu, word, onExcludeInCloud, onExcludeInVault) {
  if (onExcludeInCloud) {
    menu.addItem((item) => {
      item.setTitle("Exclude in cloud").setIcon("list-x").onClick(() => {
        void onExcludeInCloud(word);
      });
    });
  }
  if (onExcludeInVault) {
    menu.addItem((item) => {
      item.setTitle("Exclude in vault").setIcon("cloud-off").onClick(() => {
        void onExcludeInVault(word);
      });
    });
  }
  if (!onExcludeInCloud && !onExcludeInVault) {
    menu.addItem((item) => {
      item.setTitle("Exclude unavailable").setIcon("slash").setDisabled(true);
    });
  }
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
function renderOverlayControls(containerEl, svgEl, exportBaseName, enableExport, onRefresh, onEdit, viewportControls, showRefreshControl, showZoomControls, showEditControl) {
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
    (0, import_obsidian4.setIcon)(refreshButton, "rotate-cw");
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
  const makeEditButton = (parentEl) => {
    if (!showEditControl || !onEdit) {
      return;
    }
    const editButton = parentEl.createEl("button", {
      cls: "word-cloud-edit-button"
    });
    editButton.type = "button";
    (0, import_obsidian4.setIcon)(editButton, "pencil");
    editButton.setAttr("aria-label", "Edit embedded word cloud");
    let isEditing = false;
    editButton.addEventListener("click", async (event) => {
      event.preventDefault();
      if (isEditing) {
        return;
      }
      isEditing = true;
      editButton.disabled = true;
      try {
        await onEdit();
      } finally {
        if (editButton.isConnected) {
          editButton.disabled = false;
        }
        isEditing = false;
      }
    });
  };
  if (showZoomControls) {
    const viewControlsEl = containerEl.createDiv({ cls: "word-cloud-view-controls" });
    const zoomOutButton = viewControlsEl.createEl("button", {
      cls: "word-cloud-view-button"
    });
    zoomOutButton.type = "button";
    (0, import_obsidian4.setIcon)(zoomOutButton, "minus");
    zoomOutButton.setAttr("aria-label", "Zoom out");
    zoomOutButton.addEventListener("click", () => viewportControls.zoomOut());
    const resetViewButton = viewControlsEl.createEl("button", {
      cls: "word-cloud-view-button"
    });
    resetViewButton.type = "button";
    (0, import_obsidian4.setIcon)(resetViewButton, "locate-fixed");
    resetViewButton.setAttr("aria-label", "Reset pan and zoom");
    resetViewButton.addEventListener("click", () => viewportControls.resetView());
    const zoomInButton = viewControlsEl.createEl("button", {
      cls: "word-cloud-view-button"
    });
    zoomInButton.type = "button";
    (0, import_obsidian4.setIcon)(zoomInButton, "plus");
    zoomInButton.setAttr("aria-label", "Zoom in");
    zoomInButton.addEventListener("click", () => viewportControls.zoomIn());
  }
  if (!enableExport) {
    if (!showZoomControls) {
      const fallbackControlsEl = containerEl.createDiv({ cls: "word-cloud-export-controls" });
      makeRefreshButton(fallbackControlsEl);
      makeEditButton(fallbackControlsEl);
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
  makeEditButton(exportControlsEl);
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
  const makeMenuItem = (label, format2) => {
    const button = menuEl.createEl("button", { cls: "word-cloud-menu-item", text: `Export ${label}` });
    button.setAttr("aria-label", `Export as ${label}`);
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        await exportSvg(svgEl, format2, exportBaseName);
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
async function exportSvg(svgEl, format2, baseName) {
  const svgText = new XMLSerializer().serializeToString(svgEl);
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  if (format2 === "svg") {
    triggerBlobDownload(svgBlob, `${baseName}.svg`);
    return;
  }
  const width = Number(svgEl.getAttribute("width") ?? svgEl.viewBox.baseVal.width ?? 800);
  const height = Number(svgEl.getAttribute("height") ?? svgEl.viewBox.baseVal.height ?? 600);
  const bitmapBlob = await rasterizeSvg(svgBlob, width, height, format2);
  triggerBlobDownload(bitmapBlob, `${baseName}.${format2 === "png" ? "png" : "jpg"}`);
}
async function rasterizeSvg(svgBlob, width, height, format2) {
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
  if (format2 === "jpeg") {
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
    }, format2 === "png" ? "image/png" : "image/jpeg", 0.92);
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
var import_obsidian6 = require("obsidian");

// src/rendering/frequency-chart-renderer.ts
function drawFrequencyChart(options) {
  const { containerEl, words, ariaLabel } = options;
  containerEl.empty();
  const sortedWords = words.map((entry) => ({ text: entry.text, count: entry.count })).sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));
  if (sortedWords.length === 0) {
    containerEl.createDiv({
      cls: "vault-word-cloud-state",
      text: "No frequency data available."
    });
    return;
  }
  const width = Math.max(containerEl.clientWidth, 320);
  const longestLabelLength = sortedWords.reduce((maxChars, entry) => {
    return Math.max(maxChars, entry.text.length);
  }, 0);
  const margin = {
    top: 8,
    right: 56,
    bottom: 8,
    left: Math.min(280, Math.max(120, Math.round(longestLabelLength * 7.2)))
  };
  const rowHeight = 22;
  const chartHeight = Math.max(120, sortedWords.length * rowHeight);
  const totalHeight = margin.top + chartHeight + margin.bottom;
  const x = linear2().domain([0, sortedWords[0]?.count ?? 1]).range([margin.left, width - margin.right]);
  const y = band().domain(sortedWords.map((entry) => entry.text)).range([margin.top, margin.top + chartHeight]).paddingInner(0.2);
  const svg = select_default2(containerEl).append("svg").attr("class", "note-word-cloud-frequency-svg").attr("width", width).attr("height", totalHeight).attr("role", "img").attr("aria-label", ariaLabel).style("display", "block");
  const rows = svg.append("g").attr("class", "note-word-cloud-frequency-rows").selectAll("g").data(sortedWords).join("g").attr("transform", (entry) => `translate(0, ${y(entry.text) ?? 0})`);
  rows.append("text").attr("class", "note-word-cloud-frequency-label").attr("x", margin.left - 8).attr("y", Math.max(0, y.bandwidth() / 2)).attr("text-anchor", "end").attr("dominant-baseline", "middle").text((entry) => entry.text);
  rows.append("rect").attr("class", "note-word-cloud-frequency-bar").attr("x", margin.left).attr("y", 0).attr("height", Math.max(1, y.bandwidth())).attr("width", (entry) => Math.max(1, x(entry.count) - margin.left));
  rows.append("text").attr("class", "note-word-cloud-frequency-value").attr("x", (entry) => x(entry.count) + 6).attr("y", Math.max(0, y.bandwidth() / 2)).attr("dominant-baseline", "middle").text((entry) => String(entry.count));
  containerEl.createDiv({
    cls: "note-word-cloud-frequency-summary",
    text: `${sortedWords.length} words, sorted by frequency`
  });
}

// src/views/word-cloud-filter-panel.ts
var import_obsidian5 = require("obsidian");
var ALL_FREQUENCIES_MIN = 1;
var ALL_FREQUENCIES_MAX = 9999;
var WordCloudFilterPanel = class {
  constructor(options) {
    this.controls = null;
    this.services = options.services;
    this.containerEl = options.containerEl;
    this.registerDomEvent = options.registerDomEvent;
    this.onChange = options.onChange;
    this.filters = sanitizeFilters(options.filters);
    this.containerEl.addClass("vault-word-cloud-controls-condensed");
    this.build();
    this.refreshControls();
  }
  setFilters(filters) {
    this.filters = sanitizeFilters(filters);
    this.refreshControls();
  }
  build() {
    const filterBarEl = this.containerEl.createDiv({ cls: "vault-word-cloud-filter-bar" });
    const summaryEl = filterBarEl.createDiv({ cls: "vault-word-cloud-filter-summary" });
    const resetButton = filterBarEl.createEl("button", {
      cls: "vault-word-cloud-filter-reset"
    });
    resetButton.type = "button";
    resetButton.setAttr("aria-label", "Reset filters");
    resetButton.setAttr("data-tooltip-position", "left");
    resetButton.setAttr("title", "Reset filters");
    (0, import_obsidian5.setIcon)(resetButton, "rotate-ccw");
    const sectionEl = this.containerEl.createDiv({ cls: "vault-word-cloud-filter-section" });
    const headerEl = sectionEl.createDiv({ cls: "vault-word-cloud-controls-header" });
    headerEl.createEl("span", { text: "Filters", cls: "vault-word-cloud-controls-title" });
    const gridEl = sectionEl.createDiv({ cls: "vault-word-cloud-filter-grid" });
    const scopeEl = gridEl.createDiv({ cls: "vault-word-cloud-tag-filter" });
    scopeEl.createEl("span", { text: "Scope", cls: "vault-word-cloud-tag-label" });
    const scopeSelectEl = scopeEl.createEl("select", { cls: "vault-word-cloud-mode-select" });
    scopeSelectEl.createEl("option", { value: "vault", text: "Entire vault" });
    scopeSelectEl.createEl("option", { value: "active-file", text: "Active note only" });
    const includeTagPickerEl = gridEl.createDiv({ cls: "vault-word-cloud-tag-filter" });
    includeTagPickerEl.createEl("span", { text: "Include tag", cls: "vault-word-cloud-tag-label" });
    const includeTagSelectEl = includeTagPickerEl.createEl("select", { cls: "vault-word-cloud-mode-select" });
    includeTagSelectEl.createEl("option", { text: "Add include tag...", value: "" });
    const modeEl = gridEl.createDiv({ cls: "vault-word-cloud-match-mode" });
    modeEl.createEl("span", { text: "Include match mode", cls: "vault-word-cloud-tag-label" });
    const modeSelectEl = modeEl.createEl("select", { cls: "vault-word-cloud-mode-select" });
    modeSelectEl.createEl("option", { text: "Any include tag", value: "any" });
    modeSelectEl.createEl("option", { text: "All include tags", value: "all" });
    const includeTagsEl = sectionEl.createDiv({ cls: "vault-word-cloud-applied-tags" });
    this.controls = {
      summaryEl,
      scopeSelectEl,
      includeTagSelectEl,
      modeSelectEl,
      includeTagsEl
    };
    this.registerDomEvent(scopeSelectEl, "change", () => {
      this.filters.scope.mode = scopeSelectEl.value ?? "vault";
      if (this.filters.scope.mode === "active-file") {
        this.filters.scope.activeFilePath = this.services.getActiveFile()?.path ?? "";
      }
      void this.persist();
    });
    this.registerDomEvent(includeTagSelectEl, "change", () => {
      const selectedTag = includeTagSelectEl.value;
      if (!selectedTag) {
        return;
      }
      if (!this.filters.includeTags.includes(selectedTag)) {
        this.filters.includeTags.push(selectedTag);
      }
      includeTagSelectEl.value = "";
      void this.persist();
    });
    this.registerDomEvent(modeSelectEl, "change", () => {
      this.filters.tagMatchMode = modeSelectEl.value === "all" ? "all" : "any";
      void this.persist();
    });
    this.registerDomEvent(resetButton, "click", () => {
      this.filters = sanitizeFilters({
        ...this.filters,
        scope: {
          mode: "vault",
          activeFilePath: "",
          folderPaths: []
        },
        includeTags: [],
        tagMatchMode: "any"
      });
      void this.persist();
    });
  }
  refreshControls() {
    if (!this.controls) {
      return;
    }
    const {
      summaryEl,
      scopeSelectEl,
      includeTagSelectEl,
      modeSelectEl,
      includeTagsEl
    } = this.controls;
    scopeSelectEl.value = this.filters.scope.mode;
    modeSelectEl.value = this.filters.tagMatchMode;
    this.updateTagPickerOptions(includeTagSelectEl);
    this.renderAppliedTagChips(includeTagsEl);
    modeSelectEl.disabled = this.filters.includeTags.length <= 1;
    summaryEl.setText(this.buildFilterSummary());
  }
  updateTagPickerOptions(selectEl) {
    const tags = this.services.getAvailableTags();
    const includeSet = new Set(this.filters.includeTags);
    const previous = selectEl.value;
    selectEl.empty();
    selectEl.createEl("option", { text: "Add include tag...", value: "" });
    for (const tag of tags) {
      const option = selectEl.createEl("option", { text: tag, value: tag });
      option.disabled = includeSet.has(tag);
    }
    selectEl.value = previous && selectEl.querySelector(`option[value="${CSS.escape(previous)}"]`) ? previous : "";
  }
  renderAppliedTagChips(chipsEl) {
    chipsEl.empty();
    if (this.filters.includeTags.length === 0) {
      chipsEl.createSpan({
        cls: "vault-word-cloud-chip-empty",
        text: "No include tags applied."
      });
      return;
    }
    for (const tag of this.filters.includeTags) {
      const chipEl = chipsEl.createDiv({ cls: "vault-word-cloud-chip" });
      chipEl.createSpan({ cls: "vault-word-cloud-chip-text", text: `+ ${tag}` });
      const removeButton = chipEl.createEl("button", {
        cls: "vault-word-cloud-chip-remove",
        text: "x"
      });
      removeButton.type = "button";
      removeButton.setAttr("aria-label", `Remove ${tag} include filter`);
      this.registerDomEvent(removeButton, "click", () => {
        this.filters.includeTags = this.filters.includeTags.filter((value) => value !== tag);
        void this.persist();
      });
    }
  }
  buildFilterSummary() {
    const parts = [];
    parts.push(this.filters.scope.mode === "vault" ? "Scope: vault" : "Scope: active note");
    if (this.filters.includeTags.length > 0) {
      parts.push(`Include: ${this.filters.includeTags.length} tag(s)`);
    }
    parts.push("Frequency: all");
    return parts.join(" | ");
  }
  async persist() {
    this.filters = sanitizeFilters(this.filters);
    await this.onChange(cloneFilters(this.filters));
  }
};
function sanitizeFilters(filters) {
  const mode = filters.scope.mode === "active-file" ? "active-file" : "vault";
  return {
    scope: {
      mode,
      activeFilePath: filters.scope.activeFilePath,
      folderPaths: []
    },
    includeTags: [...filters.includeTags],
    excludeTags: [],
    tagMatchMode: filters.tagMatchMode,
    frontmatterRules: [],
    frequency: {
      minCount: ALL_FREQUENCIES_MIN,
      maxCount: ALL_FREQUENCIES_MAX
    }
  };
}
function cloneFilters(filters) {
  return {
    scope: {
      mode: filters.scope.mode,
      activeFilePath: filters.scope.activeFilePath,
      folderPaths: [...filters.scope.folderPaths]
    },
    includeTags: [...filters.includeTags],
    excludeTags: [...filters.excludeTags],
    tagMatchMode: filters.tagMatchMode,
    frontmatterRules: filters.frontmatterRules.map((rule) => ({ ...rule })),
    frequency: {
      minCount: filters.frequency.minCount,
      maxCount: filters.frequency.maxCount
    }
  };
}

// src/views/note-word-cloud-view.ts
var NoteWordCloudView = class extends import_obsidian6.ItemView {
  constructor(leaf, services) {
    super(leaf);
    this.renderNonce = 0;
    this.selectedFilePath = "";
    this.activeTab = "cloud";
    this.latestWords = [];
    this.latestContextLabel = "current filters";
    this.frequencyRendered = false;
    this.cloudCanvasEl = null;
    this.frequencyCanvasEl = null;
    this.cloudTabButtonEl = null;
    this.frequencyTabButtonEl = null;
    this.services = services;
    this.filters = services.getFilterSettings();
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
    this.filters = this.services.getFilterSettings();
    const topEl = contentEl.createDiv({ cls: "vault-word-cloud-top" });
    const headerEl = topEl.createDiv({ cls: "vault-word-cloud-header" });
    headerEl.createEl("h2", { text: "Note word clouds", cls: "vault-word-cloud-title" });
    const controlsEl = topEl.createDiv({ cls: "vault-word-cloud-controls" });
    const noteControlsEl = controlsEl.createDiv({ cls: "vault-word-cloud-filter-section" });
    const noteHeaderEl = noteControlsEl.createDiv({ cls: "vault-word-cloud-controls-header" });
    noteHeaderEl.createEl("span", { text: "Note picker", cls: "vault-word-cloud-controls-title" });
    noteHeaderEl.createEl("span", {
      text: "Used when scope is Active note only",
      cls: "vault-word-cloud-controls-summary"
    });
    const noteGridEl = noteControlsEl.createDiv({ cls: "vault-word-cloud-filter-grid" });
    const fileFilterEl = noteGridEl.createDiv({ cls: "vault-word-cloud-tag-filter" });
    const fileLabelEl = fileFilterEl.createEl("label", { text: "Open note", cls: "vault-word-cloud-tag-label" });
    const fileSelectEl = fileFilterEl.createEl("select", { cls: "vault-word-cloud-mode-select" });
    fileSelectEl.id = "vault-word-cloud-note-select";
    fileLabelEl.setAttr("for", fileSelectEl.id);
    fileSelectEl.setAttr("aria-label", "Choose an open note");
    const noteActionsEl = noteGridEl.createDiv({ cls: "vault-word-cloud-match-mode" });
    noteActionsEl.createEl("span", { text: "Actions", cls: "vault-word-cloud-tag-label" });
    const activeButton = noteActionsEl.createEl("button", {
      text: "Use active note",
      cls: "vault-word-cloud-refresh"
    });
    activeButton.type = "button";
    activeButton.setAttr("aria-label", "Use active note");
    const refreshButton = noteActionsEl.createEl("button", {
      text: "Refresh",
      cls: "vault-word-cloud-refresh"
    });
    refreshButton.type = "button";
    refreshButton.setAttr("aria-label", "Refresh note insights");
    let filterPanel;
    const persistFiltersAndRender = async (nextFilters) => {
      this.filters = nextFilters;
      await this.services.updateFilterSettings(this.filters);
      this.filters = this.services.getFilterSettings();
      filterPanel.setFilters(this.filters);
      await this.renderCloud(cloudCanvasEl);
    };
    filterPanel = new WordCloudFilterPanel({
      services: this.services,
      containerEl: controlsEl,
      registerDomEvent: (element, type, callback) => this.registerDomEvent(element, type, callback),
      filters: this.filters,
      onChange: persistFiltersAndRender
    });
    const tabsEl = contentEl.createDiv({ cls: "note-word-cloud-tabs" });
    tabsEl.setAttr("role", "tablist");
    tabsEl.setAttr("aria-label", "Note word cloud visualizations");
    const cloudTabButton = tabsEl.createEl("button", {
      cls: "note-word-cloud-tab is-active",
      text: "Word cloud"
    });
    cloudTabButton.type = "button";
    cloudTabButton.id = "note-word-cloud-tab-cloud";
    cloudTabButton.setAttr("role", "tab");
    cloudTabButton.setAttr("aria-controls", "note-word-cloud-panel-cloud");
    cloudTabButton.setAttr("aria-selected", "true");
    cloudTabButton.setAttr("tabindex", "0");
    const frequencyTabButton = tabsEl.createEl("button", {
      cls: "note-word-cloud-tab",
      text: "Frequency"
    });
    frequencyTabButton.type = "button";
    frequencyTabButton.id = "note-word-cloud-tab-frequency";
    frequencyTabButton.setAttr("role", "tab");
    frequencyTabButton.setAttr("aria-controls", "note-word-cloud-panel-frequency");
    frequencyTabButton.setAttr("aria-selected", "false");
    frequencyTabButton.setAttr("tabindex", "-1");
    const panelsEl = contentEl.createDiv({ cls: "note-word-cloud-panels" });
    const cloudPanelEl = panelsEl.createDiv({ cls: "note-word-cloud-panel is-active" });
    cloudPanelEl.id = "note-word-cloud-panel-cloud";
    cloudPanelEl.setAttr("role", "tabpanel");
    cloudPanelEl.setAttr("aria-labelledby", cloudTabButton.id);
    const frequencyPanelEl = panelsEl.createDiv({ cls: "note-word-cloud-panel" });
    frequencyPanelEl.id = "note-word-cloud-panel-frequency";
    frequencyPanelEl.setAttr("role", "tabpanel");
    frequencyPanelEl.setAttr("aria-labelledby", frequencyTabButton.id);
    frequencyPanelEl.setAttr("hidden", "");
    const cloudCanvasEl = cloudPanelEl.createDiv({ cls: "vault-word-cloud-canvas" });
    const frequencyCanvasEl = frequencyPanelEl.createDiv({ cls: "note-word-cloud-frequency-canvas" });
    this.cloudCanvasEl = cloudCanvasEl;
    this.frequencyCanvasEl = frequencyCanvasEl;
    this.cloudTabButtonEl = cloudTabButton;
    this.frequencyTabButtonEl = frequencyTabButton;
    this.updateOpenFileOptions(fileSelectEl);
    this.registerDomEvent(fileSelectEl, "change", () => {
      this.selectedFilePath = fileSelectEl.value;
      if (this.filters.scope.mode !== "active-file") {
        void this.renderCloud(cloudCanvasEl);
        return;
      }
      void persistFiltersAndRender({
        ...this.filters,
        scope: {
          ...this.filters.scope,
          mode: "active-file",
          activeFilePath: this.selectedFilePath
        }
      });
    });
    this.registerDomEvent(activeButton, "click", () => {
      const activeFile = this.services.getActiveFile();
      if (activeFile) {
        this.selectedFilePath = activeFile.path;
        this.updateOpenFileOptions(fileSelectEl);
        fileSelectEl.value = this.selectedFilePath;
      }
      if (this.filters.scope.mode !== "active-file") {
        void this.renderCloud(cloudCanvasEl);
        return;
      }
      void persistFiltersAndRender({
        ...this.filters,
        scope: {
          ...this.filters.scope,
          mode: "active-file",
          activeFilePath: this.selectedFilePath
        }
      });
    });
    this.registerDomEvent(refreshButton, "click", () => {
      this.updateOpenFileOptions(fileSelectEl);
      if (!fileSelectEl.value && this.selectedFilePath) {
        this.selectedFilePath = "";
      }
      void this.renderCloud(cloudCanvasEl);
    });
    this.registerDomEvent(cloudTabButton, "click", () => {
      this.switchTab("cloud", cloudPanelEl, frequencyPanelEl);
    });
    this.registerDomEvent(frequencyTabButton, "click", () => {
      this.switchTab("frequency", cloudPanelEl, frequencyPanelEl);
      this.renderFrequencyChart(true);
    });
    this.registerDomEvent(cloudTabButton, "keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        frequencyTabButton.focus();
        this.switchTab("frequency", cloudPanelEl, frequencyPanelEl);
        this.renderFrequencyChart(true);
      }
    });
    this.registerDomEvent(frequencyTabButton, "keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        cloudTabButton.focus();
        this.switchTab("cloud", cloudPanelEl, frequencyPanelEl);
      }
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
        if (this.filters.scope.mode === "active-file") {
          void persistFiltersAndRender({
            ...this.filters,
            scope: {
              ...this.filters.scope,
              mode: "active-file",
              activeFilePath: this.selectedFilePath
            }
          });
          return;
        }
        void this.renderCloud(cloudCanvasEl);
      }
    }));
    await this.renderCloud(cloudCanvasEl);
  }
  onClose() {
    this.cloudCanvasEl = null;
    this.frequencyCanvasEl = null;
    this.cloudTabButtonEl = null;
    this.frequencyTabButtonEl = null;
  }
  async onResize() {
    if (this.activeTab === "cloud" && this.cloudCanvasEl) {
      await this.renderCloud(this.cloudCanvasEl);
      return;
    }
    if (this.activeTab === "frequency") {
      this.renderFrequencyChart(true);
    }
  }
  switchTab(tab, cloudPanelEl, frequencyPanelEl) {
    this.activeTab = tab;
    const showCloud = tab === "cloud";
    this.cloudTabButtonEl?.toggleClass("is-active", showCloud);
    this.cloudTabButtonEl?.setAttr("aria-selected", showCloud ? "true" : "false");
    this.cloudTabButtonEl?.setAttr("tabindex", showCloud ? "0" : "-1");
    this.frequencyTabButtonEl?.toggleClass("is-active", !showCloud);
    this.frequencyTabButtonEl?.setAttr("aria-selected", showCloud ? "false" : "true");
    this.frequencyTabButtonEl?.setAttr("tabindex", showCloud ? "-1" : "0");
    cloudPanelEl.toggleClass("is-active", showCloud);
    frequencyPanelEl.toggleClass("is-active", !showCloud);
    if (showCloud) {
      cloudPanelEl.removeAttribute("hidden");
      frequencyPanelEl.setAttr("hidden", "");
      return;
    }
    cloudPanelEl.setAttr("hidden", "");
    frequencyPanelEl.removeAttribute("hidden");
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
  resolveScopeFilePath() {
    if (this.selectedFilePath) {
      return this.selectedFilePath;
    }
    if (this.filters.scope.activeFilePath) {
      return this.filters.scope.activeFilePath;
    }
    return this.services.getActiveFile()?.path ?? "";
  }
  findSelectedOpenFile() {
    const scopeFilePath = this.resolveScopeFilePath();
    return this.services.getOpenMarkdownFiles().find((file) => file.path === scopeFilePath) ?? null;
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
      const scopeFilePath = this.resolveScopeFilePath();
      const selectedFile = this.findSelectedOpenFile();
      const words = await this.services.collectVaultWords({
        sourceRules: {
          scope: {
            ...this.filters.scope,
            activeFilePath: scopeFilePath
          },
          includeTags: this.filters.includeTags,
          excludeTags: this.filters.excludeTags,
          tagMatchMode: this.filters.tagMatchMode,
          frontmatterRules: this.filters.frontmatterRules
        },
        frequency: this.filters.frequency
      }, updateProgress);
      if (words.length === 0) {
        this.latestWords = [];
        this.latestContextLabel = this.filters.scope.mode === "active-file" && selectedFile ? selectedFile.basename : "selected filters";
        this.frequencyRendered = false;
        loadingEl.remove();
        containerEl.createDiv({
          cls: "vault-word-cloud-state",
          text: this.filters.scope.mode === "active-file" && !scopeFilePath ? "Open a markdown note and select it to view a note-specific word cloud." : "No words found for the selected filters."
        });
        if (this.activeTab === "frequency") {
          this.renderFrequencyChart(true);
        }
        return;
      }
      this.latestWords = words;
      this.latestContextLabel = this.filters.scope.mode === "active-file" && selectedFile ? selectedFile.basename : "selected filters";
      this.frequencyRendered = false;
      await this.services.drawWordCloud({
        containerEl,
        words,
        ariaLabel: this.filters.scope.mode === "active-file" && selectedFile ? `Word cloud for ${selectedFile.basename}` : "Word cloud for selected filters",
        onProgress: updateProgress,
        onRefresh: () => this.renderCloud(containerEl),
        onExcludeInVault: async (word) => {
          const added = await this.services.addBlacklistWord(word);
          new import_obsidian6.Notice(added ? `Excluded "${word}" from word clouds.` : `"${word}" is already excluded.`);
          await this.renderCloud(containerEl);
        },
        onWordClick: (word) => {
          void this.services.openSearchForWord(word, {
            includeTags: this.filters.includeTags,
            excludeTags: this.filters.excludeTags,
            tagMatchMode: this.filters.tagMatchMode,
            filePath: this.filters.scope.mode === "active-file" ? scopeFilePath : void 0
          });
        }
      });
      if (activeNonce !== this.renderNonce) {
        return;
      }
      loadingEl.remove();
      if (this.activeTab === "frequency") {
        this.renderFrequencyChart(true);
      }
    } catch (error) {
      loadingEl.remove();
      console.error("Note word cloud: failed to render cloud", error);
      containerEl.createDiv({
        cls: "vault-word-cloud-state",
        text: "Could not render the word cloud. Open developer console for details."
      });
    }
  }
  renderFrequencyChart(force = false) {
    if (!this.frequencyCanvasEl || !force && this.frequencyRendered) {
      return;
    }
    this.frequencyCanvasEl.empty();
    if (this.latestWords.length === 0) {
      this.frequencyCanvasEl.createDiv({
        cls: "vault-word-cloud-state",
        text: "No words found for the selected filters."
      });
      this.frequencyRendered = true;
      return;
    }
    drawFrequencyChart({
      containerEl: this.frequencyCanvasEl,
      words: this.latestWords,
      ariaLabel: `Word frequency chart for ${this.latestContextLabel}`
    });
    this.frequencyRendered = true;
  }
};

// src/views/vault-word-cloud-view.ts
var import_obsidian7 = require("obsidian");
var VaultWordCloudView = class extends import_obsidian7.ItemView {
  constructor(leaf, services) {
    super(leaf);
    this.renderNonce = 0;
    this.services = services;
    this.filters = services.getFilterSettings();
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
    this.filters = this.services.getFilterSettings();
    const topEl = contentEl.createDiv({ cls: "vault-word-cloud-top" });
    const headerEl = topEl.createDiv({ cls: "vault-word-cloud-header" });
    headerEl.createEl("h2", { text: "Word clouds", cls: "vault-word-cloud-title" });
    const controlsEl = topEl.createDiv({ cls: "vault-word-cloud-controls" });
    const canvasEl = contentEl.createDiv({ cls: "vault-word-cloud-canvas" });
    const filterPanel = new WordCloudFilterPanel({
      services: this.services,
      containerEl: controlsEl,
      registerDomEvent: (element, type, callback) => this.registerDomEvent(element, type, callback),
      filters: this.filters,
      onChange: async (nextFilters) => {
        this.filters = nextFilters;
        await this.services.updateFilterSettings(this.filters);
        this.filters = this.services.getFilterSettings();
        filterPanel.setFilters(this.filters);
        await this.renderCloud(canvasEl);
      }
    });
    await this.renderCloud(canvasEl);
  }
  async onResize() {
    const canvasEl = this.contentEl.querySelector(".vault-word-cloud-canvas");
    if (canvasEl instanceof HTMLDivElement) {
      await this.renderCloud(canvasEl);
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
      const activeFilePath = this.services.getActiveFile()?.path ?? "";
      const words = await this.services.collectVaultWords({
        sourceRules: {
          scope: {
            ...this.filters.scope,
            activeFilePath
          },
          includeTags: this.filters.includeTags,
          excludeTags: this.filters.excludeTags,
          tagMatchMode: this.filters.tagMatchMode,
          frontmatterRules: this.filters.frontmatterRules
        },
        frequency: this.filters.frequency
      }, updateProgress);
      if (words.length === 0) {
        loadingEl.remove();
        containerEl.createDiv({
          cls: "vault-word-cloud-state",
          text: "No words found for the selected filters."
        });
        return;
      }
      await this.services.drawWordCloud({
        containerEl,
        words,
        ariaLabel: "Word cloud based on markdown files in the vault",
        onProgress: updateProgress,
        onRefresh: () => this.renderCloud(containerEl),
        onExcludeInVault: async (word) => {
          const added = await this.services.addBlacklistWord(word);
          new import_obsidian7.Notice(added ? `Excluded "${word}" from word clouds.` : `"${word}" is already excluded.`);
          await this.renderCloud(containerEl);
        },
        onWordClick: (word) => {
          void this.services.openSearchForWord(word, {
            includeTags: this.filters.includeTags,
            excludeTags: this.filters.excludeTags,
            tagMatchMode: this.filters.tagMatchMode,
            filePath: this.filters.scope.mode === "active-file" ? activeFilePath : void 0
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
var VaultWordCloudPlugin = class extends import_obsidian8.Plugin {
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
    this.addCommand({
      id: "embed-word-cloud-in-document",
      name: "Embed word cloud in document",
      callback: () => {
        this.openEmbedWordCloudWizard();
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
  getAvailableFolders() {
    return this.app.vault.getAllLoadedFiles().filter((file) => file instanceof import_obsidian8.TFolder).map((folder) => folder.path).sort((a, b) => a.localeCompare(b));
  }
  getOpenMarkdownFiles() {
    const files = /* @__PURE__ */ new Map();
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (view instanceof import_obsidian8.MarkdownView && view.file) {
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
  getFilterSettings() {
    return {
      scope: {
        mode: this.settings.filters.scope.mode,
        activeFilePath: this.settings.filters.scope.activeFilePath,
        folderPaths: [...this.settings.filters.scope.folderPaths]
      },
      includeTags: [...this.settings.filters.includeTags],
      excludeTags: [...this.settings.filters.excludeTags],
      tagMatchMode: this.settings.filters.tagMatchMode,
      frontmatterRules: this.settings.filters.frontmatterRules.map((rule) => ({ ...rule })),
      frequency: {
        minCount: this.settings.filters.frequency.minCount,
        maxCount: this.settings.filters.frequency.maxCount
      }
    };
  }
  async updateFilterSettings(patch) {
    const merged = {
      ...this.settings.filters,
      ...patch,
      scope: {
        ...this.settings.filters.scope,
        ...patch.scope
      },
      frequency: {
        ...this.settings.filters.frequency,
        ...patch.frequency
      },
      includeTags: patch.includeTags ?? this.settings.filters.includeTags,
      excludeTags: patch.excludeTags ?? this.settings.filters.excludeTags,
      frontmatterRules: patch.frontmatterRules ?? this.settings.filters.frontmatterRules
    };
    this.settings.filters = this.normalizeFilterSettings(merged);
    await this.saveSettings();
  }
  async collectVaultWords(options = {}, onProgress) {
    const allMarkdownFiles = this.app.vault.getMarkdownFiles();
    const sourceRules = options.sourceRules ?? {
      scope: this.settings.filters.scope,
      includeTags: this.settings.filters.includeTags,
      excludeTags: this.settings.filters.excludeTags,
      tagMatchMode: this.settings.filters.tagMatchMode,
      frontmatterRules: this.settings.filters.frontmatterRules
    };
    const frequency = options.frequency ?? this.settings.filters.frequency;
    return this.processor.collectFromFiles(
      allMarkdownFiles,
      this.getBlacklistSet(),
      this.settings.render,
      onProgress,
      {
        sourceRules,
        frequency,
        excludeWords: options.excludeWords
      }
    );
  }
  async collectFileWords(file, onProgress, options) {
    return this.processor.collectFromFiles([file], this.getBlacklistSet(), this.settings.render, onProgress, {
      excludeWords: options?.excludeWords
    });
  }
  async drawWordCloud(options) {
    return drawWordCloud(options, this.settings.render);
  }
  async openSearchForWord(word, options = {}) {
    return openSearchForWord(this.app, word, options);
  }
  openEmbedWordCloudWizard() {
    new EmbedWordCloudModal(this.app, this, (embedBlock) => {
      return this.insertEmbedAtCursor(embedBlock);
    }).open();
  }
  async loadSettings() {
    const loaded = await this.loadData();
    const loadedBlacklist = loaded?.blacklistWords;
    const loadedRender = loaded?.render;
    this.settings = {
      blacklistWords: this.normalizeBlacklistWords(loadedBlacklist),
      render: this.normalizeRenderSettings(loadedRender),
      filters: this.normalizeFilterSettings(loaded?.filters)
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
  normalizeFilterSettings(rawValue) {
    const raw = rawValue && typeof rawValue === "object" ? rawValue : {};
    const scope = this.normalizeScope(raw.scope);
    const includeTags = normalizeTagList(raw.includeTags);
    const excludeTags = normalizeTagList(raw.excludeTags).filter((tag) => !includeTags.includes(tag));
    const tagMatchMode = raw.tagMatchMode === "all" ? "all" : "any";
    const frontmatterRules = normalizeFrontmatterRules(raw.frontmatterRules);
    const minCount = this.clampNumber(raw.frequency?.minCount, 1, 9999, DEFAULT_SETTINGS.filters.frequency.minCount);
    const maxCount = this.clampNumber(raw.frequency?.maxCount, 1, 9999, DEFAULT_SETTINGS.filters.frequency.maxCount);
    return {
      scope,
      includeTags,
      excludeTags,
      tagMatchMode,
      frontmatterRules,
      frequency: {
        minCount: Math.min(minCount, maxCount),
        maxCount: Math.max(minCount, maxCount)
      }
    };
  }
  normalizeScope(rawValue) {
    const raw = rawValue && typeof rawValue === "object" ? rawValue : {};
    const mode = raw.mode === "active-file" || raw.mode === "folder" || raw.mode === "vault" ? raw.mode : DEFAULT_SETTINGS.filters.scope.mode;
    const activeFilePath = typeof raw.activeFilePath === "string" ? raw.activeFilePath.trim() : "";
    const folderPaths = Array.isArray(raw.folderPaths) ? [...new Set(raw.folderPaths.filter((path) => typeof path === "string").map((path) => path.trim()).filter(Boolean))] : [];
    return {
      mode,
      activeFilePath,
      folderPaths
    };
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
  insertEmbedAtCursor(embedBlock) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian8.MarkdownView);
    if (!view) {
      new import_obsidian8.Notice("Open a markdown note to insert a word cloud embed.");
      return false;
    }
    const { editor } = view;
    const cursor = editor.getCursor();
    const currentLine = editor.getLine(cursor.line);
    const hasTextBeforeCursor = currentLine.slice(0, cursor.ch).trim().length > 0;
    const hasTextAfterCursor = currentLine.slice(cursor.ch).trim().length > 0;
    const prefix = hasTextBeforeCursor ? "\n" : "";
    const suffix = hasTextAfterCursor ? "\n" : "";
    const textToInsert = `${prefix}${embedBlock}${suffix}`;
    editor.replaceSelection(textToInsert);
    return true;
  }
};
function normalizeTagList(rawTags) {
  if (!Array.isArray(rawTags)) {
    return [];
  }
  const tags = /* @__PURE__ */ new Set();
  for (const value of rawTags) {
    if (typeof value !== "string") {
      continue;
    }
    const normalized = normalizeTag(value);
    if (normalized) {
      tags.add(normalized);
    }
  }
  return [...tags];
}
function normalizeFrontmatterRules(rawRules) {
  if (!Array.isArray(rawRules)) {
    return [];
  }
  const allowed = /* @__PURE__ */ new Set(["equals", "not-equals", "contains", "gt", "gte", "lt", "lte", "exists", "not-exists"]);
  const rules = [];
  for (const rule of rawRules) {
    if (!rule || typeof rule !== "object") {
      continue;
    }
    const candidate = rule;
    const key = typeof candidate.key === "string" ? candidate.key.trim() : "";
    if (!key) {
      continue;
    }
    const operator = typeof candidate.operator === "string" && allowed.has(candidate.operator) ? candidate.operator : "equals";
    const value = typeof candidate.value === "string" ? candidate.value : "";
    rules.push({ key, operator, value });
  }
  return rules;
}
