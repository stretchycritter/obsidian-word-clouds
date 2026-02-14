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
var import_obsidian7 = require("obsidian");

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
  mode: "current-file",
  filePath: "",
  tagsRaw: "",
  match: "any",
  height: 320,
  interactions: true
};
var EmbedWordCloudModal = class extends import_obsidian.Modal {
  constructor(app, services, onInsert, options = {}) {
    super(app);
    this.services = services;
    this.onInsert = onInsert;
    this.title = options.title ?? "Embed word cloud in document";
    this.description = options.description ?? "Configure options, then insert a word cloud embed at your cursor.";
    this.submitButtonText = options.submitButtonText ?? "Insert";
    const activeFile = this.services.getActiveFile();
    const initialState = options.initialState ?? {};
    this.state = {
      ...DEFAULT_STATE,
      filePath: activeFile?.path ?? "",
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
    this.modeWrapperEl = contentEl.createDiv({ cls: "word-cloud-embed-wizard-section" });
    this.fileWrapperEl = contentEl.createDiv({ cls: "word-cloud-embed-wizard-section" });
    this.tagsWrapperEl = contentEl.createDiv({ cls: "word-cloud-embed-wizard-section" });
    this.matchWrapperEl = contentEl.createDiv({ cls: "word-cloud-embed-wizard-section" });
    new import_obsidian.Setting(this.modeWrapperEl).setName("Source").setDesc("Choose where this embedded cloud pulls words from.").addDropdown((dropdown) => {
      dropdown.addOption("current-file", "Current note").addOption("specific-file", "Specific note").addOption("tag-based", "Vault filtered by tags").setValue(this.state.mode).onChange((value) => {
        this.state.mode = value === "specific-file" || value === "tag-based" ? value : "current-file";
        this.refreshConditionalSections();
      });
    });
    this.renderFileSetting();
    this.renderTagSetting();
    this.renderMatchSetting();
    new import_obsidian.Setting(contentEl).setName("Height").setDesc("Height of the embedded cloud in pixels.").addSlider((slider) => {
      slider.setLimits(180, 900, 10).setValue(this.state.height).setDynamicTooltip().onChange((value) => {
        this.state.height = value;
      });
    });
    new import_obsidian.Setting(contentEl).setName("Enable interactions").setDesc("Allow zoom, pan, and click-to-search interactions.").addToggle((toggle) => {
      toggle.setValue(this.state.interactions).onChange((value) => {
        this.state.interactions = value;
      });
    });
    const buttonRowEl = contentEl.createDiv({ cls: "word-cloud-embed-wizard-actions" });
    const cancelButton = new import_obsidian.ButtonComponent(buttonRowEl).setButtonText("Cancel").onClick(() => {
      this.close();
    });
    cancelButton.buttonEl.type = "button";
    const insertButton = new import_obsidian.ButtonComponent(buttonRowEl).setButtonText(this.submitButtonText).setCta().onClick(async () => {
      if (this.state.mode === "specific-file" && !this.state.filePath) {
        new import_obsidian.Notice("Select an open markdown note before inserting.");
        return;
      }
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
  renderFileSetting() {
    this.fileWrapperEl.empty();
    new import_obsidian.Setting(this.fileWrapperEl).setName("Specific note").setDesc("Use one open note as the source for this embedded cloud.").addDropdown((dropdown) => {
      const openFiles = this.services.getOpenMarkdownFiles();
      const selectedPath = this.resolveSelectedPath(openFiles, this.state.filePath);
      for (const file of openFiles) {
        dropdown.addOption(file.path, file.path);
      }
      if (openFiles.length === 0) {
        dropdown.addOption("", "No open markdown notes");
        dropdown.setDisabled(true);
        this.state.filePath = "";
        return;
      }
      this.state.filePath = selectedPath;
      dropdown.setValue(selectedPath).onChange((value) => {
        this.state.filePath = value;
      });
    });
  }
  renderTagSetting() {
    this.tagsWrapperEl.empty();
    const availableTags = this.services.getAvailableTags();
    const tagHint = availableTags.length > 0 ? `Available: ${availableTags.slice(0, 12).join(", ")}${availableTags.length > 12 ? "\u2026" : ""}` : "No tags detected yet.";
    new import_obsidian.Setting(this.tagsWrapperEl).setName("Tags").setDesc(`Optional comma-separated tags. ${tagHint}`).addText((text) => {
      text.setPlaceholder("#project, #meeting").setValue(this.state.tagsRaw).onChange((value) => {
        this.state.tagsRaw = value;
      });
    });
  }
  renderMatchSetting() {
    this.matchWrapperEl.empty();
    new import_obsidian.Setting(this.matchWrapperEl).setName("Tag match mode").setDesc("When multiple tags are set, match any or all of them.").addDropdown((dropdown) => {
      dropdown.addOption("any", "Any tag").addOption("all", "All tags").setValue(this.state.match).onChange((value) => {
        this.state.match = value === "all" ? "all" : "any";
      });
    });
  }
  resolveSelectedPath(files, preferredPath) {
    if (preferredPath && files.some((file) => file.path === preferredPath)) {
      return preferredPath;
    }
    const activeFile = this.services.getActiveFile();
    if (activeFile && files.some((file) => file.path === activeFile.path)) {
      return activeFile.path;
    }
    return files[0]?.path ?? "";
  }
  refreshConditionalSections() {
    const isSpecific = this.state.mode === "specific-file";
    const isTagBased = this.state.mode === "tag-based";
    this.fileWrapperEl.toggleClass("is-hidden", !isSpecific);
    this.tagsWrapperEl.toggleClass("is-hidden", !isTagBased);
    this.matchWrapperEl.toggleClass("is-hidden", !isTagBased);
  }
  buildEmbedBlock() {
    const lines = ["```wordcloud", `mode: ${this.state.mode}`];
    if (this.state.mode === "specific-file" && this.state.filePath) {
      lines.push(`file: ${this.state.filePath}`);
    }
    if (this.state.mode === "tag-based") {
      const normalizedTags = this.state.tagsRaw.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0);
      if (normalizedTags.length > 0) {
        lines.push(`tags: ${normalizedTags.join(", ")}`);
      }
      lines.push(`match: ${this.state.match}`);
    }
    lines.push(`height: ${this.state.height}`);
    lines.push(`interactions: ${this.state.interactions ? "true" : "false"}`);
    lines.push("```");
    return lines.join("\n");
  }
};

// src/block-renderers/wordcloud-block-renderer.ts
var DEFAULT_OPTIONS = {
  mode: "current-file",
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
      if (options.mode === "current-file") {
        const file = resolveCurrentFile(plugin, ctx);
        if (!file) {
          stateEl.setText("Could not resolve the current file for this embedded cloud.");
          return;
        }
        words = await services.collectFileWords(file, updateProgress);
        searchScope = { filePath: file.path };
      } else if (options.mode === "specific-file") {
        if (!options.filePath) {
          stateEl.setText("Set `file:` when using `mode: specific-file`.");
          return;
        }
        const file = resolveSpecificFile(plugin, options.filePath);
        if (!file) {
          stateEl.setText("Could not find the file for this embedded cloud.");
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
  let modeWasExplicitlySet = false;
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
    if (rawKey === "mode") {
      const parsedMode = parseModeOption(rawValue);
      if (parsedMode) {
        options.mode = parsedMode;
        modeWasExplicitlySet = true;
      }
      continue;
    }
    if (rawKey === "scope" && !modeWasExplicitlySet) {
      const parsedMode = parseLegacyScopeOption(rawValue);
      if (parsedMode) {
        options.mode = parsedMode;
      }
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
    if (rawKey === "file" || rawKey === "note" || rawKey === "path" || rawKey === "filename") {
      options.filePath = rawValue;
      if (!modeWasExplicitlySet) {
        options.mode = "specific-file";
      }
    }
  }
  return options;
}
function parseModeOption(value) {
  const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
  if (normalized === "current-file" || normalized === "current" || normalized === "current-note" || normalized === "note") {
    return "current-file";
  }
  if (normalized === "specific-file" || normalized === "specific" || normalized === "file" || normalized === "note-file") {
    return "specific-file";
  }
  if (normalized === "tag-based" || normalized === "tags" || normalized === "tag" || normalized === "vault") {
    return "tag-based";
  }
  return null;
}
function parseLegacyScopeOption(value) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "vault") {
    return "tag-based";
  }
  if (normalized === "note") {
    return "current-file";
  }
  return null;
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
        mode: options.mode,
        filePath: options.filePath ?? "",
        tagsRaw: options.tags.join(", "),
        match: options.match,
        height: options.height,
        interactions: options.interactions
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
  const { containerEl, words, ariaLabel, onWordClick, onProgress, onRefresh } = options;
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
var import_obsidian5 = require("obsidian");
var NoteWordCloudView = class extends import_obsidian5.ItemView {
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
var import_obsidian6 = require("obsidian");
var VaultWordCloudView = class extends import_obsidian6.ItemView {
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
var VaultWordCloudPlugin = class extends import_obsidian7.Plugin {
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
  getOpenMarkdownFiles() {
    const files = /* @__PURE__ */ new Map();
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (view instanceof import_obsidian7.MarkdownView && view.file) {
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
  insertEmbedAtCursor(embedBlock) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian7.MarkdownView);
    if (!view) {
      new import_obsidian7.Notice("Open a markdown note to insert a word cloud embed.");
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL2QzLWNsb3VkL25vZGVfbW9kdWxlcy9kMy1kaXNwYXRjaC9kaXN0L2QzLWRpc3BhdGNoLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1jbG91ZC9pbmRleC5qcyIsICIuLi9zcmMvbWFpbi50cyIsICIuLi9zcmMvY29uc3RhbnRzLnRzIiwgIi4uL3NyYy9ibG9jay1yZW5kZXJlcnMvd29yZGNsb3VkLWJsb2NrLXJlbmRlcmVyLnRzIiwgIi4uL3NyYy9tb2RhbHMvZW1iZWQtd29yZC1jbG91ZC1tb2RhbC50cyIsICIuLi9zcmMvdXRpbHMudHMiLCAiLi4vc3JjL2FjdGlvbnMvYXBwbHktc2VhcmNoLnRzIiwgIi4uL3NyYy9waXBlbGluZS9hZGFwdGVycy9vYnNpZGlhbi1zb3VyY2UudHMiLCAiLi4vc3JjL3BpcGVsaW5lL3N0cmF0ZWdpZXMvZGVmYXVsdHMudHMiLCAiLi4vc3JjL3BpcGVsaW5lL3N0YWdlcy9hZ2dyZWdhdGUudHMiLCAiLi4vc3JjL3BpcGVsaW5lL3N0YWdlcy9maWx0ZXIudHMiLCAiLi4vc3JjL3BpcGVsaW5lL3N0YWdlcy9ub3JtYWxpemUudHMiLCAiLi4vc3JjL3BpcGVsaW5lL3N0YWdlcy9yZW5kZXItbW9kZWwudHMiLCAiLi4vc3JjL3BpcGVsaW5lL3N0YWdlcy9zY2FsZS50cyIsICIuLi9zcmMvcGlwZWxpbmUvc3RhZ2VzL3NvdXJjZS1zZWxlY3Rpb24udHMiLCAiLi4vc3JjL3BpcGVsaW5lL3N0YWdlcy90b2tlbml6ZS50cyIsICIuLi9zcmMvcGlwZWxpbmUvcnVuLXBpcGVsaW5lLnRzIiwgIi4uL3NyYy9wcm9jZXNzaW5nL3RhZy1maWx0ZXIudHMiLCAiLi4vc3JjL3Byb2Nlc3NpbmcvcHJvY2Vzc29yLnRzIiwgIi4uL3NyYy9zZXR0aW5ncy9pbmRleC50cyIsICIuLi9zcmMvcHJvY2Vzc2luZy9zY2FsaW5nLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9pbnRlcm5tYXAvc3JjL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvaW5pdC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL29yZGluYWwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvY29sb3JzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL2NhdGVnb3JpY2FsL1RhYmxlYXUxMC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9uYW1lc3BhY2VzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL25hbWVzcGFjZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9jcmVhdG9yLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdG9yLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3QuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvYXJyYXkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0b3JBbGwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdEFsbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9tYXRjaGVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3RDaGlsZC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0Q2hpbGRyZW4uanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2ZpbHRlci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc3BhcnNlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lbnRlci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9jb25zdGFudC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGF0YS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZXhpdC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vam9pbi5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbWVyZ2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL29yZGVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zb3J0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9jYWxsLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9ub2Rlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbm9kZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2l6ZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZW1wdHkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2VhY2guanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2F0dHIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvd2luZG93LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zdHlsZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcHJvcGVydHkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2NsYXNzZWQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3RleHQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2h0bWwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3JhaXNlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9sb3dlci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vYXBwZW5kLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9pbnNlcnQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3JlbW92ZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2xvbmUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2RhdHVtLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9vbi5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGlzcGF0Y2guanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2l0ZXJhdG9yLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3QuanMiLCAiLi4vc3JjL3JlbmRlcmluZy93b3JkLWNsb3VkLXJlbmRlcmVyLnRzIiwgIi4uL3NyYy92aWV3cy9ub3RlLXdvcmQtY2xvdWQtdmlldy50cyIsICIuLi9zcmMvdmlld3MvdmF1bHQtd29yZC1jbG91ZC12aWV3LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBodHRwczovL2QzanMub3JnL2QzLWRpc3BhdGNoLyB2MS4wLjYgQ29weXJpZ2h0IDIwMTkgTWlrZSBCb3N0b2NrXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xudHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG50eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbihnbG9iYWwgPSBnbG9iYWwgfHwgc2VsZiwgZmFjdG9yeShnbG9iYWwuZDMgPSBnbG9iYWwuZDMgfHwge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgbm9vcCA9IHt2YWx1ZTogZnVuY3Rpb24oKSB7fX07XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKCkge1xuICBmb3IgKHZhciBpID0gMCwgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIF8gPSB7fSwgdDsgaSA8IG47ICsraSkge1xuICAgIGlmICghKHQgPSBhcmd1bWVudHNbaV0gKyBcIlwiKSB8fCAodCBpbiBfKSB8fCAvW1xccy5dLy50ZXN0KHQpKSB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIHR5cGU6IFwiICsgdCk7XG4gICAgX1t0XSA9IFtdO1xuICB9XG4gIHJldHVybiBuZXcgRGlzcGF0Y2goXyk7XG59XG5cbmZ1bmN0aW9uIERpc3BhdGNoKF8pIHtcbiAgdGhpcy5fID0gXztcbn1cblxuZnVuY3Rpb24gcGFyc2VUeXBlbmFtZXModHlwZW5hbWVzLCB0eXBlcykge1xuICByZXR1cm4gdHlwZW5hbWVzLnRyaW0oKS5zcGxpdCgvXnxcXHMrLykubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgbmFtZSA9IFwiXCIsIGkgPSB0LmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChpID49IDApIG5hbWUgPSB0LnNsaWNlKGkgKyAxKSwgdCA9IHQuc2xpY2UoMCwgaSk7XG4gICAgaWYgKHQgJiYgIXR5cGVzLmhhc093blByb3BlcnR5KHQpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdCk7XG4gICAgcmV0dXJuIHt0eXBlOiB0LCBuYW1lOiBuYW1lfTtcbiAgfSk7XG59XG5cbkRpc3BhdGNoLnByb3RvdHlwZSA9IGRpc3BhdGNoLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IERpc3BhdGNoLFxuICBvbjogZnVuY3Rpb24odHlwZW5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIF8gPSB0aGlzLl8sXG4gICAgICAgIFQgPSBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZSArIFwiXCIsIF8pLFxuICAgICAgICB0LFxuICAgICAgICBpID0gLTEsXG4gICAgICAgIG4gPSBULmxlbmd0aDtcblxuICAgIC8vIElmIG5vIGNhbGxiYWNrIHdhcyBzcGVjaWZpZWQsIHJldHVybiB0aGUgY2FsbGJhY2sgb2YgdGhlIGdpdmVuIHR5cGUgYW5kIG5hbWUuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCh0ID0gKHR5cGVuYW1lID0gVFtpXSkudHlwZSkgJiYgKHQgPSBnZXQoX1t0XSwgdHlwZW5hbWUubmFtZSkpKSByZXR1cm4gdDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBhIHR5cGUgd2FzIHNwZWNpZmllZCwgc2V0IHRoZSBjYWxsYmFjayBmb3IgdGhlIGdpdmVuIHR5cGUgYW5kIG5hbWUuXG4gICAgLy8gT3RoZXJ3aXNlLCBpZiBhIG51bGwgY2FsbGJhY2sgd2FzIHNwZWNpZmllZCwgcmVtb3ZlIGNhbGxiYWNrcyBvZiB0aGUgZ2l2ZW4gbmFtZS5cbiAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCAmJiB0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBjYWxsYmFjazogXCIgKyBjYWxsYmFjayk7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGlmICh0ID0gKHR5cGVuYW1lID0gVFtpXSkudHlwZSkgX1t0XSA9IHNldChfW3RdLCB0eXBlbmFtZS5uYW1lLCBjYWxsYmFjayk7XG4gICAgICBlbHNlIGlmIChjYWxsYmFjayA9PSBudWxsKSBmb3IgKHQgaW4gXykgX1t0XSA9IHNldChfW3RdLCB0eXBlbmFtZS5uYW1lLCBudWxsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgY29weTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvcHkgPSB7fSwgXyA9IHRoaXMuXztcbiAgICBmb3IgKHZhciB0IGluIF8pIGNvcHlbdF0gPSBfW3RdLnNsaWNlKCk7XG4gICAgcmV0dXJuIG5ldyBEaXNwYXRjaChjb3B5KTtcbiAgfSxcbiAgY2FsbDogZnVuY3Rpb24odHlwZSwgdGhhdCkge1xuICAgIGlmICgobiA9IGFyZ3VtZW50cy5sZW5ndGggLSAyKSA+IDApIGZvciAodmFyIGFyZ3MgPSBuZXcgQXJyYXkobiksIGkgPSAwLCBuLCB0OyBpIDwgbjsgKytpKSBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICBpZiAoIXRoaXMuXy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0eXBlOiBcIiArIHR5cGUpO1xuICAgIGZvciAodCA9IHRoaXMuX1t0eXBlXSwgaSA9IDAsIG4gPSB0Lmxlbmd0aDsgaSA8IG47ICsraSkgdFtpXS52YWx1ZS5hcHBseSh0aGF0LCBhcmdzKTtcbiAgfSxcbiAgYXBwbHk6IGZ1bmN0aW9uKHR5cGUsIHRoYXQsIGFyZ3MpIHtcbiAgICBpZiAoIXRoaXMuXy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0eXBlOiBcIiArIHR5cGUpO1xuICAgIGZvciAodmFyIHQgPSB0aGlzLl9bdHlwZV0sIGkgPSAwLCBuID0gdC5sZW5ndGg7IGkgPCBuOyArK2kpIHRbaV0udmFsdWUuYXBwbHkodGhhdCwgYXJncyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdldCh0eXBlLCBuYW1lKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gdHlwZS5sZW5ndGgsIGM7IGkgPCBuOyArK2kpIHtcbiAgICBpZiAoKGMgPSB0eXBlW2ldKS5uYW1lID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gYy52YWx1ZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0KHR5cGUsIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gdHlwZS5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICBpZiAodHlwZVtpXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICB0eXBlW2ldID0gbm9vcCwgdHlwZSA9IHR5cGUuc2xpY2UoMCwgaSkuY29uY2F0KHR5cGUuc2xpY2UoaSArIDEpKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkgdHlwZS5wdXNoKHtuYW1lOiBuYW1lLCB2YWx1ZTogY2FsbGJhY2t9KTtcbiAgcmV0dXJuIHR5cGU7XG59XG5cbmV4cG9ydHMuZGlzcGF0Y2ggPSBkaXNwYXRjaDtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpO1xuIiwgIi8vIFdvcmQgY2xvdWQgbGF5b3V0IGJ5IEphc29uIERhdmllcywgaHR0cHM6Ly93d3cuamFzb25kYXZpZXMuY29tL3dvcmRjbG91ZC9cbi8vIEFsZ29yaXRobSBkdWUgdG8gSm9uYXRoYW4gRmVpbmJlcmcsIGh0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9zdGF0aWMubXJmZWluYmVyZy5jb20vYnZfY2gwMy5wZGZcblxuY29uc3QgZGlzcGF0Y2ggPSByZXF1aXJlKFwiZDMtZGlzcGF0Y2hcIikuZGlzcGF0Y2g7XG5cbmNvbnN0IFJBRElBTlMgPSBNYXRoLlBJIC8gMTgwO1xuXG5jb25zdCBTUElSQUxTID0ge1xuICBhcmNoaW1lZGVhbjogYXJjaGltZWRlYW5TcGlyYWwsXG4gIHJlY3Rhbmd1bGFyOiByZWN0YW5ndWxhclNwaXJhbFxufTtcblxuY29uc3QgY3cgPSAxIDw8IDExID4+IDU7XG5jb25zdCBjaCA9IDEgPDwgMTE7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzaXplID0gWzI1NiwgMjU2XSxcbiAgICAgIHRleHQgPSBjbG91ZFRleHQsXG4gICAgICBmb250ID0gY2xvdWRGb250LFxuICAgICAgZm9udFNpemUgPSBjbG91ZEZvbnRTaXplLFxuICAgICAgZm9udFN0eWxlID0gY2xvdWRGb250Tm9ybWFsLFxuICAgICAgZm9udFdlaWdodCA9IGNsb3VkRm9udE5vcm1hbCxcbiAgICAgIHBhZGRpbmcgPSBjbG91ZFBhZGRpbmcsXG4gICAgICBzcGlyYWwgPSBhcmNoaW1lZGVhblNwaXJhbCxcbiAgICAgIHdvcmRzID0gW10sXG4gICAgICB0aW1lSW50ZXJ2YWwgPSBJbmZpbml0eSxcbiAgICAgIGV2ZW50ID0gZGlzcGF0Y2goXCJ3b3JkXCIsIFwiZW5kXCIpLFxuICAgICAgdGltZXIgPSBudWxsLFxuICAgICAgcmFuZG9tID0gTWF0aC5yYW5kb20sXG4gICAgICByb3RhdGUgPSAoKSA9PiAofn4ocmFuZG9tKCkgKiA2KSAtIDMpICogMzAsXG4gICAgICBjbG91ZCA9IHt9LFxuICAgICAgY2FudmFzID0gY2xvdWRDYW52YXM7XG5cbiAgY2xvdWQuY2FudmFzID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNhbnZhcyA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IGNhbnZhcztcbiAgfTtcblxuICBjbG91ZC5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250ZXh0QW5kUmF0aW8gPSBnZXRDb250ZXh0KGNhbnZhcygpKSxcbiAgICAgICAgYm9hcmQgPSB6ZXJvQXJyYXkoKHNpemVbMF0gPj4gNSkgKiBzaXplWzFdKSxcbiAgICAgICAgYm91bmRzID0gbnVsbCxcbiAgICAgICAgbiA9IHdvcmRzLmxlbmd0aCxcbiAgICAgICAgaSA9IC0xLFxuICAgICAgICB0YWdzID0gW10sXG4gICAgICAgIGRhdGEgPSB3b3Jkcy5tYXAoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgIGQudGV4dCA9IHRleHQuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgICBkLmZvbnQgPSBmb250LmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgZC5zdHlsZSA9IGZvbnRTdHlsZS5jYWxsKHRoaXMsIGQsIGkpO1xuICAgICAgICAgIGQud2VpZ2h0ID0gZm9udFdlaWdodC5jYWxsKHRoaXMsIGQsIGkpO1xuICAgICAgICAgIGQucm90YXRlID0gcm90YXRlLmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgZC5zaXplID0gfn5mb250U2l6ZS5jYWxsKHRoaXMsIGQsIGkpO1xuICAgICAgICAgIGQucGFkZGluZyA9IHBhZGRpbmcuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgICByZXR1cm4gZDtcbiAgICAgICAgfSkuc29ydChmdW5jdGlvbihhLCBiKSB7IHJldHVybiBiLnNpemUgLSBhLnNpemU7IH0pO1xuXG4gICAgaWYgKHRpbWVyKSBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICB0aW1lciA9IHNldEludGVydmFsKHN0ZXAsIDApO1xuICAgIHN0ZXAoKTtcblxuICAgIHJldHVybiBjbG91ZDtcblxuICAgIGZ1bmN0aW9uIHN0ZXAoKSB7XG4gICAgICB2YXIgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgICAgd2hpbGUgKERhdGUubm93KCkgLSBzdGFydCA8IHRpbWVJbnRlcnZhbCAmJiArK2kgPCBuICYmIHRpbWVyKSB7XG4gICAgICAgIHZhciBkID0gZGF0YVtpXTtcbiAgICAgICAgZC54ID0gKHNpemVbMF0gKiAocmFuZG9tKCkgKyAuNSkpID4+IDE7XG4gICAgICAgIGQueSA9IChzaXplWzFdICogKHJhbmRvbSgpICsgLjUpKSA+PiAxO1xuICAgICAgICBjbG91ZFNwcml0ZShjb250ZXh0QW5kUmF0aW8sIGQsIGRhdGEsIGkpO1xuICAgICAgICBpZiAoZC5oYXNUZXh0ICYmIHBsYWNlKGJvYXJkLCBkLCBib3VuZHMpKSB7XG4gICAgICAgICAgdGFncy5wdXNoKGQpO1xuICAgICAgICAgIGV2ZW50LmNhbGwoXCJ3b3JkXCIsIGNsb3VkLCBkKTtcbiAgICAgICAgICBpZiAoYm91bmRzKSBjbG91ZEJvdW5kcyhib3VuZHMsIGQpO1xuICAgICAgICAgIGVsc2UgYm91bmRzID0gW3t4OiBkLnggKyBkLngwLCB5OiBkLnkgKyBkLnkwfSwge3g6IGQueCArIGQueDEsIHk6IGQueSArIGQueTF9XTtcbiAgICAgICAgICAvLyBUZW1wb3JhcnkgaGFja1xuICAgICAgICAgIGQueCAtPSBzaXplWzBdID4+IDE7XG4gICAgICAgICAgZC55IC09IHNpemVbMV0gPj4gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGkgPj0gbikge1xuICAgICAgICBjbG91ZC5zdG9wKCk7XG4gICAgICAgIGV2ZW50LmNhbGwoXCJlbmRcIiwgY2xvdWQsIHRhZ3MsIGJvdW5kcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvdWQuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lcikge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICB0aW1lciA9IG51bGw7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZCBvZiB3b3Jkcykge1xuICAgICAgZGVsZXRlIGQuc3ByaXRlO1xuICAgIH1cbiAgICByZXR1cm4gY2xvdWQ7XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2V0Q29udGV4dChjYW52YXMpIHtcbiAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiLCB7d2lsbFJlYWRGcmVxdWVudGx5OiB0cnVlfSk7XG5cbiAgICBjYW52YXMud2lkdGggPSBjYW52YXMuaGVpZ2h0ID0gMTtcbiAgICBjb25zdCByYXRpbyA9IE1hdGguc3FydChjb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCAxLCAxKS5kYXRhLmxlbmd0aCA+PiAyKTtcbiAgICBjYW52YXMud2lkdGggPSAoY3cgPDwgNSkgLyByYXRpbztcbiAgICBjYW52YXMuaGVpZ2h0ID0gY2ggLyByYXRpbztcblxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29udGV4dC5zdHJva2VTdHlsZSA9IFwicmVkXCI7XG5cbiAgICByZXR1cm4ge2NvbnRleHQsIHJhdGlvfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlKGJvYXJkLCB0YWcsIGJvdW5kcykge1xuICAgIHZhciBwZXJpbWV0ZXIgPSBbe3g6IDAsIHk6IDB9LCB7eDogc2l6ZVswXSwgeTogc2l6ZVsxXX1dLFxuICAgICAgICBzdGFydFggPSB0YWcueCxcbiAgICAgICAgc3RhcnRZID0gdGFnLnksXG4gICAgICAgIG1heERlbHRhID0gTWF0aC5zcXJ0KHNpemVbMF0gKiBzaXplWzBdICsgc2l6ZVsxXSAqIHNpemVbMV0pLFxuICAgICAgICBzID0gc3BpcmFsKHNpemUpLFxuICAgICAgICBkdCA9IHJhbmRvbSgpIDwgLjUgPyAxIDogLTEsXG4gICAgICAgIHQgPSAtZHQsXG4gICAgICAgIGR4ZHksXG4gICAgICAgIGR4LFxuICAgICAgICBkeTtcblxuICAgIHdoaWxlIChkeGR5ID0gcyh0ICs9IGR0KSkge1xuICAgICAgZHggPSB+fmR4ZHlbMF07XG4gICAgICBkeSA9IH5+ZHhkeVsxXTtcblxuICAgICAgaWYgKE1hdGgubWluKE1hdGguYWJzKGR4KSwgTWF0aC5hYnMoZHkpKSA+PSBtYXhEZWx0YSkgYnJlYWs7XG5cbiAgICAgIHRhZy54ID0gc3RhcnRYICsgZHg7XG4gICAgICB0YWcueSA9IHN0YXJ0WSArIGR5O1xuXG4gICAgICBpZiAodGFnLnggKyB0YWcueDAgPCAwIHx8IHRhZy55ICsgdGFnLnkwIDwgMCB8fFxuICAgICAgICAgIHRhZy54ICsgdGFnLngxID4gc2l6ZVswXSB8fCB0YWcueSArIHRhZy55MSA+IHNpemVbMV0pIGNvbnRpbnVlO1xuICAgICAgLy8gVE9ETyBvbmx5IGNoZWNrIGZvciBjb2xsaXNpb25zIHdpdGhpbiBjdXJyZW50IGJvdW5kcy5cbiAgICAgIGlmICghYm91bmRzIHx8IGNvbGxpZGVSZWN0cyh0YWcsIGJvdW5kcykpIHtcbiAgICAgICAgaWYgKCFjbG91ZENvbGxpZGUodGFnLCBib2FyZCwgc2l6ZVswXSkpIHtcbiAgICAgICAgICB2YXIgc3ByaXRlID0gdGFnLnNwcml0ZSxcbiAgICAgICAgICAgICAgdyA9IHRhZy53aWR0aCA+PiA1LFxuICAgICAgICAgICAgICBzdyA9IHNpemVbMF0gPj4gNSxcbiAgICAgICAgICAgICAgbHggPSB0YWcueCAtICh3IDw8IDQpLFxuICAgICAgICAgICAgICBzeCA9IGx4ICYgMHg3ZixcbiAgICAgICAgICAgICAgbXN4ID0gMzIgLSBzeCxcbiAgICAgICAgICAgICAgaCA9IHRhZy55MSAtIHRhZy55MCxcbiAgICAgICAgICAgICAgeCA9ICh0YWcueSArIHRhZy55MCkgKiBzdyArIChseCA+PiA1KSxcbiAgICAgICAgICAgICAgbGFzdDtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGg7IGorKykge1xuICAgICAgICAgICAgbGFzdCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSB3OyBpKyspIHtcbiAgICAgICAgICAgICAgYm9hcmRbeCArIGldIHw9IChsYXN0IDw8IG1zeCkgfCAoaSA8IHcgPyAobGFzdCA9IHNwcml0ZVtqICogdyArIGldKSA+Pj4gc3ggOiAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHggKz0gc3c7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNsb3VkLnRpbWVJbnRlcnZhbCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0aW1lSW50ZXJ2YWwgPSBfID09IG51bGwgPyBJbmZpbml0eSA6IF8sIGNsb3VkKSA6IHRpbWVJbnRlcnZhbDtcbiAgfTtcblxuICBjbG91ZC53b3JkcyA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh3b3JkcyA9IF8sIGNsb3VkKSA6IHdvcmRzO1xuICB9O1xuXG4gIGNsb3VkLnNpemUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc2l6ZSA9IFsrX1swXSwgK19bMV1dLCBjbG91ZCkgOiBzaXplO1xuICB9O1xuXG4gIGNsb3VkLmZvbnQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZm9udCA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IGZvbnQ7XG4gIH07XG5cbiAgY2xvdWQuZm9udFN0eWxlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGZvbnRTdHlsZSA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IGZvbnRTdHlsZTtcbiAgfTtcblxuICBjbG91ZC5mb250V2VpZ2h0ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGZvbnRXZWlnaHQgPSBmdW5jdG9yKF8pLCBjbG91ZCkgOiBmb250V2VpZ2h0O1xuICB9O1xuXG4gIGNsb3VkLnJvdGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChyb3RhdGUgPSBmdW5jdG9yKF8pLCBjbG91ZCkgOiByb3RhdGU7XG4gIH07XG5cbiAgY2xvdWQudGV4dCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0ZXh0ID0gZnVuY3RvcihfKSwgY2xvdWQpIDogdGV4dDtcbiAgfTtcblxuICBjbG91ZC5zcGlyYWwgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc3BpcmFsID0gU1BJUkFMU1tfXSB8fCBfLCBjbG91ZCkgOiBzcGlyYWw7XG4gIH07XG5cbiAgY2xvdWQuZm9udFNpemUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZm9udFNpemUgPSBmdW5jdG9yKF8pLCBjbG91ZCkgOiBmb250U2l6ZTtcbiAgfTtcblxuICBjbG91ZC5wYWRkaW5nID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHBhZGRpbmcgPSBmdW5jdG9yKF8pLCBjbG91ZCkgOiBwYWRkaW5nO1xuICB9O1xuXG4gIGNsb3VkLnJhbmRvbSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChyYW5kb20gPSBfLCBjbG91ZCkgOiByYW5kb207XG4gIH07XG5cbiAgY2xvdWQub24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFsdWUgPSBldmVudC5vbi5hcHBseShldmVudCwgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdmFsdWUgPT09IGV2ZW50ID8gY2xvdWQgOiB2YWx1ZTtcbiAgfTtcblxuICByZXR1cm4gY2xvdWQ7XG59O1xuXG5mdW5jdGlvbiBjbG91ZFRleHQoZCkge1xuICByZXR1cm4gZC50ZXh0O1xufVxuXG5mdW5jdGlvbiBjbG91ZEZvbnQoKSB7XG4gIHJldHVybiBcInNlcmlmXCI7XG59XG5cbmZ1bmN0aW9uIGNsb3VkRm9udE5vcm1hbCgpIHtcbiAgcmV0dXJuIFwibm9ybWFsXCI7XG59XG5cbmZ1bmN0aW9uIGNsb3VkRm9udFNpemUoZCkge1xuICByZXR1cm4gTWF0aC5zcXJ0KGQudmFsdWUpO1xufVxuXG5mdW5jdGlvbiBjbG91ZFBhZGRpbmcoKSB7XG4gIHJldHVybiAxO1xufVxuXG4vLyBGZXRjaGVzIGEgbW9ub2Nocm9tZSBzcHJpdGUgYml0bWFwIGZvciB0aGUgc3BlY2lmaWVkIHRleHQuXG4vLyBMb2FkIGluIGJhdGNoZXMgZm9yIHNwZWVkLlxuZnVuY3Rpb24gY2xvdWRTcHJpdGUoY29udGV4dEFuZFJhdGlvLCBkLCBkYXRhLCBkaSkge1xuICBpZiAoZC5zcHJpdGUpIHJldHVybjtcbiAgdmFyIGMgPSBjb250ZXh0QW5kUmF0aW8uY29udGV4dCxcbiAgICAgIHJhdGlvID0gY29udGV4dEFuZFJhdGlvLnJhdGlvO1xuXG4gIGMuY2xlYXJSZWN0KDAsIDAsIChjdyA8PCA1KSAvIHJhdGlvLCBjaCAvIHJhdGlvKTtcbiAgdmFyIHggPSAwLFxuICAgICAgeSA9IDAsXG4gICAgICBtYXhoID0gMCxcbiAgICAgIG4gPSBkYXRhLmxlbmd0aDtcbiAgLS1kaTtcbiAgd2hpbGUgKCsrZGkgPCBuKSB7XG4gICAgZCA9IGRhdGFbZGldO1xuICAgIGMuc2F2ZSgpO1xuICAgIGMuZm9udCA9IGQuc3R5bGUgKyBcIiBcIiArIGQud2VpZ2h0ICsgXCIgXCIgKyB+figoZC5zaXplICsgMSkgLyByYXRpbykgKyBcInB4IFwiICsgZC5mb250O1xuICAgIGNvbnN0IG1ldHJpY3MgPSBjLm1lYXN1cmVUZXh0KGQudGV4dCk7XG4gICAgY29uc3QgYW5jaG9yID0gLU1hdGguZmxvb3IobWV0cmljcy53aWR0aCAvIDIpO1xuICAgIGxldCB3ID0gKG1ldHJpY3Mud2lkdGggKyAxKSAqIHJhdGlvO1xuICAgIGxldCBoID0gZC5zaXplIDw8IDE7XG4gICAgaWYgKGQucm90YXRlKSB7XG4gICAgICB2YXIgc3IgPSBNYXRoLnNpbihkLnJvdGF0ZSAqIFJBRElBTlMpLFxuICAgICAgICAgIGNyID0gTWF0aC5jb3MoZC5yb3RhdGUgKiBSQURJQU5TKSxcbiAgICAgICAgICB3Y3IgPSB3ICogY3IsXG4gICAgICAgICAgd3NyID0gdyAqIHNyLFxuICAgICAgICAgIGhjciA9IGggKiBjcixcbiAgICAgICAgICBoc3IgPSBoICogc3I7XG4gICAgICB3ID0gKE1hdGgubWF4KE1hdGguYWJzKHdjciArIGhzciksIE1hdGguYWJzKHdjciAtIGhzcikpICsgMHgxZikgPj4gNSA8PCA1O1xuICAgICAgaCA9IH5+TWF0aC5tYXgoTWF0aC5hYnMod3NyICsgaGNyKSwgTWF0aC5hYnMod3NyIC0gaGNyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHcgPSAodyArIDB4MWYpID4+IDUgPDwgNTtcbiAgICB9XG4gICAgaWYgKGggPiBtYXhoKSBtYXhoID0gaDtcbiAgICBpZiAoeCArIHcgPj0gKGN3IDw8IDUpKSB7XG4gICAgICB4ID0gMDtcbiAgICAgIHkgKz0gbWF4aDtcbiAgICAgIG1heGggPSAwO1xuICAgIH1cbiAgICBpZiAoeSArIGggPj0gY2gpIGJyZWFrO1xuICAgIGMudHJhbnNsYXRlKCh4ICsgKHcgPj4gMSkpIC8gcmF0aW8sICh5ICsgKGggPj4gMSkpIC8gcmF0aW8pO1xuICAgIGlmIChkLnJvdGF0ZSkgYy5yb3RhdGUoZC5yb3RhdGUgKiBSQURJQU5TKTtcbiAgICBjLmZpbGxUZXh0KGQudGV4dCwgYW5jaG9yLCAwKTtcbiAgICBpZiAoZC5wYWRkaW5nKSBjLmxpbmVXaWR0aCA9IDIgKiBkLnBhZGRpbmcsIGMuc3Ryb2tlVGV4dChkLnRleHQsIGFuY2hvciwgMCk7XG4gICAgYy5yZXN0b3JlKCk7XG4gICAgZC53aWR0aCA9IHc7XG4gICAgZC5oZWlnaHQgPSBoO1xuICAgIGQueG9mZiA9IHg7XG4gICAgZC55b2ZmID0geTtcbiAgICBkLngxID0gdyA+PiAxO1xuICAgIGQueTEgPSBoID4+IDE7XG4gICAgZC54MCA9IC1kLngxO1xuICAgIGQueTAgPSAtZC55MTtcbiAgICBkLmhhc1RleHQgPSB0cnVlO1xuICAgIHggKz0gdztcbiAgfVxuICB2YXIgcGl4ZWxzID0gYy5nZXRJbWFnZURhdGEoMCwgMCwgKGN3IDw8IDUpIC8gcmF0aW8sIGNoIC8gcmF0aW8pLmRhdGEsXG4gICAgICBzcHJpdGUgPSBbXTtcbiAgd2hpbGUgKC0tZGkgPj0gMCkge1xuICAgIGQgPSBkYXRhW2RpXTtcbiAgICBpZiAoIWQuaGFzVGV4dCkgY29udGludWU7XG4gICAgdmFyIHcgPSBkLndpZHRoLFxuICAgICAgICB3MzIgPSB3ID4+IDUsXG4gICAgICAgIGggPSBkLnkxIC0gZC55MDtcbiAgICAvLyBaZXJvIHRoZSBidWZmZXJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGggKiB3MzI7IGkrKykgc3ByaXRlW2ldID0gMDtcbiAgICB4ID0gZC54b2ZmO1xuICAgIGlmICh4ID09IG51bGwpIHJldHVybjtcbiAgICB5ID0gZC55b2ZmO1xuICAgIHZhciBzZWVuID0gMCxcbiAgICAgICAgc2VlblJvdyA9IC0xO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgaDsgaisrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHc7IGkrKykge1xuICAgICAgICB2YXIgayA9IHczMiAqIGogKyAoaSA+PiA1KSxcbiAgICAgICAgICAgIG0gPSBwaXhlbHNbKCh5ICsgaikgKiAoY3cgPDwgNSkgKyAoeCArIGkpKSA8PCAyXSA/IDEgPDwgKDMxIC0gKGkgJSAzMikpIDogMDtcbiAgICAgICAgc3ByaXRlW2tdIHw9IG07XG4gICAgICAgIHNlZW4gfD0gbTtcbiAgICAgIH1cbiAgICAgIGlmIChzZWVuKSBzZWVuUm93ID0gajtcbiAgICAgIGVsc2Uge1xuICAgICAgICBkLnkwKys7XG4gICAgICAgIGgtLTtcbiAgICAgICAgai0tO1xuICAgICAgICB5Kys7XG4gICAgICB9XG4gICAgfVxuICAgIGQueTEgPSBkLnkwICsgc2VlblJvdztcbiAgICBkLnNwcml0ZSA9IHNwcml0ZS5zbGljZSgwLCAoZC55MSAtIGQueTApICogdzMyKTtcbiAgfVxufVxuXG4vLyBVc2UgbWFzay1iYXNlZCBjb2xsaXNpb24gZGV0ZWN0aW9uLlxuZnVuY3Rpb24gY2xvdWRDb2xsaWRlKHRhZywgYm9hcmQsIHN3KSB7XG4gIHN3ID4+PSA1O1xuICB2YXIgc3ByaXRlID0gdGFnLnNwcml0ZSxcbiAgICAgIHcgPSB0YWcud2lkdGggPj4gNSxcbiAgICAgIGx4ID0gdGFnLnggLSAodyA8PCA0KSxcbiAgICAgIHN4ID0gbHggJiAweDdmLFxuICAgICAgbXN4ID0gMzIgLSBzeCxcbiAgICAgIGggPSB0YWcueTEgLSB0YWcueTAsXG4gICAgICB4ID0gKHRhZy55ICsgdGFnLnkwKSAqIHN3ICsgKGx4ID4+IDUpLFxuICAgICAgbGFzdDtcbiAgZm9yICh2YXIgaiA9IDA7IGogPCBoOyBqKyspIHtcbiAgICBsYXN0ID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8PSB3OyBpKyspIHtcbiAgICAgIGlmICgoKGxhc3QgPDwgbXN4KSB8IChpIDwgdyA/IChsYXN0ID0gc3ByaXRlW2ogKiB3ICsgaV0pID4+PiBzeCA6IDApKVxuICAgICAgICAgICYgYm9hcmRbeCArIGldKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgeCArPSBzdztcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNsb3VkQm91bmRzKGJvdW5kcywgZCkge1xuICB2YXIgYjAgPSBib3VuZHNbMF0sXG4gICAgICBiMSA9IGJvdW5kc1sxXTtcbiAgaWYgKGQueCArIGQueDAgPCBiMC54KSBiMC54ID0gZC54ICsgZC54MDtcbiAgaWYgKGQueSArIGQueTAgPCBiMC55KSBiMC55ID0gZC55ICsgZC55MDtcbiAgaWYgKGQueCArIGQueDEgPiBiMS54KSBiMS54ID0gZC54ICsgZC54MTtcbiAgaWYgKGQueSArIGQueTEgPiBiMS55KSBiMS55ID0gZC55ICsgZC55MTtcbn1cblxuZnVuY3Rpb24gY29sbGlkZVJlY3RzKGEsIGIpIHtcbiAgcmV0dXJuIGEueCArIGEueDEgPiBiWzBdLnggJiYgYS54ICsgYS54MCA8IGJbMV0ueCAmJiBhLnkgKyBhLnkxID4gYlswXS55ICYmIGEueSArIGEueTAgPCBiWzFdLnk7XG59XG5cbmZ1bmN0aW9uIGFyY2hpbWVkZWFuU3BpcmFsKHNpemUpIHtcbiAgdmFyIGUgPSBzaXplWzBdIC8gc2l6ZVsxXTtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gW2UgKiAodCAqPSAuMSkgKiBNYXRoLmNvcyh0KSwgdCAqIE1hdGguc2luKHQpXTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVjdGFuZ3VsYXJTcGlyYWwoc2l6ZSkge1xuICB2YXIgZHkgPSA0LFxuICAgICAgZHggPSBkeSAqIHNpemVbMF0gLyBzaXplWzFdLFxuICAgICAgeCA9IDAsXG4gICAgICB5ID0gMDtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgc2lnbiA9IHQgPCAwID8gLTEgOiAxO1xuICAgIC8vIFNlZSB0cmlhbmd1bGFyIG51bWJlcnM6IFRfbiA9IG4gKiAobiArIDEpIC8gMi5cbiAgICBzd2l0Y2ggKChNYXRoLnNxcnQoMSArIDQgKiBzaWduICogdCkgLSBzaWduKSAmIDMpIHtcbiAgICAgIGNhc2UgMDogIHggKz0gZHg7IGJyZWFrO1xuICAgICAgY2FzZSAxOiAgeSArPSBkeTsgYnJlYWs7XG4gICAgICBjYXNlIDI6ICB4IC09IGR4OyBicmVhaztcbiAgICAgIGRlZmF1bHQ6IHkgLT0gZHk7IGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gW3gsIHldO1xuICB9O1xufVxuXG4vLyBUT0RPIHJldXNlIGFycmF5cz9cbmZ1bmN0aW9uIHplcm9BcnJheShuKSB7XG4gIHZhciBhID0gW10sXG4gICAgICBpID0gLTE7XG4gIHdoaWxlICgrK2kgPCBuKSBhW2ldID0gMDtcbiAgcmV0dXJuIGE7XG59XG5cbmZ1bmN0aW9uIGNsb3VkQ2FudmFzKCkge1xuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbn1cblxuZnVuY3Rpb24gZnVuY3RvcihkKSB7XG4gIHJldHVybiB0eXBlb2YgZCA9PT0gXCJmdW5jdGlvblwiID8gZCA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZDsgfTtcbn1cbiIsICJpbXBvcnQgeyBNYXJrZG93blZpZXcsIE5vdGljZSwgUGx1Z2luLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQsIFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VEIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgcmVnaXN0ZXJFbWJlZGRlZFdvcmRDbG91ZFByb2Nlc3NvciB9IGZyb20gJy4vYmxvY2stcmVuZGVyZXJzL3dvcmRjbG91ZC1ibG9jay1yZW5kZXJlcic7XG5pbXBvcnQgeyBvcGVuU2VhcmNoRm9yV29yZCB9IGZyb20gJy4vYWN0aW9ucy9hcHBseS1zZWFyY2gnO1xuaW1wb3J0IHsgV29yZENsb3VkUHJvY2Vzc29yIH0gZnJvbSAnLi9wcm9jZXNzaW5nL3Byb2Nlc3Nvcic7XG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTLCBWYXVsdFdvcmRDbG91ZFNldHRpbmdUYWIsIHR5cGUgV29yZENsb3VkU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJztcbmltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFNlYXJjaE9wdGlvbnMsIFRhZ01hdGNoTW9kZSwgV29yZENsb3VkUmVuZGVyT3B0aW9ucywgV29yZENsb3VkU2VydmljZXMsIFdlaWdodGVkV29yZCB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgZHJhd1dvcmRDbG91ZCB9IGZyb20gJy4vcmVuZGVyaW5nL3dvcmQtY2xvdWQtcmVuZGVyZXInO1xuaW1wb3J0IHsgTm90ZVdvcmRDbG91ZFZpZXcgfSBmcm9tICcuL3ZpZXdzL25vdGUtd29yZC1jbG91ZC12aWV3JztcbmltcG9ydCB7IFZhdWx0V29yZENsb3VkVmlldyB9IGZyb20gJy4vdmlld3MvdmF1bHQtd29yZC1jbG91ZC12aWV3JztcbmltcG9ydCB7IEVtYmVkV29yZENsb3VkTW9kYWwgfSBmcm9tICcuL21vZGFscy9lbWJlZC13b3JkLWNsb3VkLW1vZGFsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmF1bHRXb3JkQ2xvdWRQbHVnaW4gZXh0ZW5kcyBQbHVnaW4gaW1wbGVtZW50cyBXb3JkQ2xvdWRTZXJ2aWNlcyB7XG4gIHNldHRpbmdzOiBXb3JkQ2xvdWRTZXR0aW5ncyA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUyB9O1xuICBwcml2YXRlIHByb2Nlc3NvciE6IFdvcmRDbG91ZFByb2Nlc3NvcjtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLnByb2Nlc3NvciA9IG5ldyBXb3JkQ2xvdWRQcm9jZXNzb3IodGhpcy5hcHApO1xuXG4gICAgdGhpcy5yZWdpc3RlclZpZXcoVklFV19UWVBFX1ZBVUxUX1dPUkRfQ0xPVUQsIChsZWFmKSA9PiBuZXcgVmF1bHRXb3JkQ2xvdWRWaWV3KGxlYWYsIHRoaXMpKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhWSUVXX1RZUEVfTk9URV9XT1JEX0NMT1VELCAobGVhZikgPT4gbmV3IE5vdGVXb3JkQ2xvdWRWaWV3KGxlYWYsIHRoaXMpKTtcbiAgICByZWdpc3RlckVtYmVkZGVkV29yZENsb3VkUHJvY2Vzc29yKHRoaXMsIHRoaXMpO1xuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgVmF1bHRXb3JkQ2xvdWRTZXR0aW5nVGFiKHRoaXMpKTtcblxuICAgIHRoaXMuYWRkUmliYm9uSWNvbignY2xvdWQnLCAnT3BlbiB3b3JkIGNsb3VkcycsICgpID0+IHtcbiAgICAgIHZvaWQgdGhpcy5hY3RpdmF0ZVZhdWx0V29yZENsb3VkVmlldygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiAnb3Blbi12YXVsdC13b3JkLWNsb3VkLXZpZXcnLFxuICAgICAgbmFtZTogJ09wZW4gdmF1bHQgd29yZCBjbG91ZCcsXG4gICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICB2b2lkIHRoaXMuYWN0aXZhdGVWYXVsdFdvcmRDbG91ZFZpZXcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6ICdvcGVuLW5vdGUtd29yZC1jbG91ZC1zaWRlYmFyJyxcbiAgICAgIG5hbWU6ICdPcGVuIGN1cnJlbnQgbm90ZSB3b3JkIGNsb3VkJyxcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgIHZvaWQgdGhpcy5hY3RpdmF0ZU5vdGVXb3JkQ2xvdWRWaWV3KCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiAnZW1iZWQtd29yZC1jbG91ZC1pbi1kb2N1bWVudCcsXG4gICAgICBuYW1lOiAnRW1iZWQgd29yZCBjbG91ZCBpbiBkb2N1bWVudCcsXG4gICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICB0aGlzLm9wZW5FbWJlZFdvcmRDbG91ZFdpemFyZCgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIG9udW5sb2FkKCk6IHZvaWQge1xuICAgIC8vIE9ic2lkaWFuIGF1dG9tYXRpY2FsbHkgZGV0YWNoZXMgdmlld3MgcmVnaXN0ZXJlZCBieSB0aGlzIHBsdWdpbi5cbiAgfVxuXG4gIGFzeW5jIGFjdGl2YXRlVmF1bHRXb3JkQ2xvdWRWaWV3KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBjb25zdCBleGlzdGluZ0xlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VEKVswXTtcblxuICAgIGNvbnN0IGxlYWYgPSBleGlzdGluZ0xlYWYgPz8gd29ya3NwYWNlLmdldExlYWYodHJ1ZSk7XG4gICAgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoe1xuICAgICAgdHlwZTogVklFV19UWVBFX1ZBVUxUX1dPUkRfQ0xPVUQsXG4gICAgICBhY3RpdmU6IHRydWUsXG4gICAgfSk7XG5cbiAgICB3b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIGFzeW5jIGFjdGl2YXRlTm90ZVdvcmRDbG91ZFZpZXcoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xuICAgIGNvbnN0IGV4aXN0aW5nTGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFX05PVEVfV09SRF9DTE9VRClbMF07XG5cbiAgICBjb25zdCBsZWFmID0gZXhpc3RpbmdMZWFmID8/IHdvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpO1xuICAgIGlmICghbGVhZikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHtcbiAgICAgIHR5cGU6IFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQsXG4gICAgICBhY3RpdmU6IHRydWUsXG4gICAgfSk7XG5cbiAgICB3b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIGdldEF2YWlsYWJsZVRhZ3MoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLnByb2Nlc3Nvci5nZXRBdmFpbGFibGVUYWdzKCk7XG4gIH1cblxuICBnZXRPcGVuTWFya2Rvd25GaWxlcygpOiBURmlsZVtdIHtcbiAgICBjb25zdCBmaWxlcyA9IG5ldyBNYXA8c3RyaW5nLCBURmlsZT4oKTtcblxuICAgIGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKCdtYXJrZG93bicpKSB7XG4gICAgICBjb25zdCB2aWV3ID0gbGVhZi52aWV3O1xuICAgICAgaWYgKHZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXcgJiYgdmlldy5maWxlKSB7XG4gICAgICAgIGZpbGVzLnNldCh2aWV3LmZpbGUucGF0aCwgdmlldy5maWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBhY3RpdmVGaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoYWN0aXZlRmlsZSkge1xuICAgICAgZmlsZXMuc2V0KGFjdGl2ZUZpbGUucGF0aCwgYWN0aXZlRmlsZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFsuLi5maWxlcy52YWx1ZXMoKV0uc29ydCgoYSwgYikgPT4gYS5wYXRoLmxvY2FsZUNvbXBhcmUoYi5wYXRoKSk7XG4gIH1cblxuICBnZXRBY3RpdmVGaWxlKCk6IFRGaWxlIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gIH1cblxuICBhc3luYyBjb2xsZWN0VmF1bHRXb3JkcyhcbiAgICB0YWdGaWx0ZXJzOiBzdHJpbmdbXSxcbiAgICB0YWdNYXRjaE1vZGU6IFRhZ01hdGNoTW9kZSxcbiAgICBvblByb2dyZXNzPzogKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB2b2lkLFxuICApOiBQcm9taXNlPFdlaWdodGVkV29yZFtdPiB7XG4gICAgY29uc3QgYWxsTWFya2Rvd25GaWxlcyA9IHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKTtcbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzb3IuY29sbGVjdEZyb21GaWxlcyhcbiAgICAgIGFsbE1hcmtkb3duRmlsZXMsXG4gICAgICB0aGlzLmdldEJsYWNrbGlzdFNldCgpLFxuICAgICAgdGhpcy5zZXR0aW5ncy5yZW5kZXIsXG4gICAgICBvblByb2dyZXNzLFxuICAgICAge1xuICAgICAgICB0YWdGaWx0ZXJzLFxuICAgICAgICB0YWdNYXRjaE1vZGUsXG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBhc3luYyBjb2xsZWN0RmlsZVdvcmRzKGZpbGU6IFRGaWxlLCBvblByb2dyZXNzPzogKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB2b2lkKTogUHJvbWlzZTxXZWlnaHRlZFdvcmRbXT4ge1xuICAgIHJldHVybiB0aGlzLnByb2Nlc3Nvci5jb2xsZWN0RnJvbUZpbGVzKFtmaWxlXSwgdGhpcy5nZXRCbGFja2xpc3RTZXQoKSwgdGhpcy5zZXR0aW5ncy5yZW5kZXIsIG9uUHJvZ3Jlc3MpO1xuICB9XG5cbiAgYXN5bmMgZHJhd1dvcmRDbG91ZChvcHRpb25zOiBXb3JkQ2xvdWRSZW5kZXJPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIGRyYXdXb3JkQ2xvdWQob3B0aW9ucywgdGhpcy5zZXR0aW5ncy5yZW5kZXIpO1xuICB9XG5cbiAgYXN5bmMgb3BlblNlYXJjaEZvcldvcmQod29yZDogc3RyaW5nLCBvcHRpb25zOiBTZWFyY2hPcHRpb25zID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gb3BlblNlYXJjaEZvcldvcmQodGhpcy5hcHAsIHdvcmQsIG9wdGlvbnMpO1xuICB9XG5cbiAgb3BlbkVtYmVkV29yZENsb3VkV2l6YXJkKCk6IHZvaWQge1xuICAgIG5ldyBFbWJlZFdvcmRDbG91ZE1vZGFsKHRoaXMuYXBwLCB0aGlzLCAoZW1iZWRCbG9jaykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0RW1iZWRBdEN1cnNvcihlbWJlZEJsb2NrKTtcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbG9hZGVkID0gYXdhaXQgdGhpcy5sb2FkRGF0YSgpO1xuICAgIGNvbnN0IGxvYWRlZEJsYWNrbGlzdCA9IGxvYWRlZD8uYmxhY2tsaXN0V29yZHM7XG4gICAgY29uc3QgbG9hZGVkUmVuZGVyID0gbG9hZGVkPy5yZW5kZXI7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHtcbiAgICAgIGJsYWNrbGlzdFdvcmRzOiB0aGlzLm5vcm1hbGl6ZUJsYWNrbGlzdFdvcmRzKGxvYWRlZEJsYWNrbGlzdCksXG4gICAgICByZW5kZXI6IHRoaXMubm9ybWFsaXplUmVuZGVyU2V0dGluZ3MobG9hZGVkUmVuZGVyKSxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gIH1cblxuICBhc3luYyBhZGRCbGFja2xpc3RXb3JkKHJhd1dvcmQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRXb3JkID0gdGhpcy5ub3JtYWxpemVCbGFja2xpc3RXb3JkKHJhd1dvcmQpO1xuICAgIGlmICghbm9ybWFsaXplZFdvcmQgfHwgdGhpcy5zZXR0aW5ncy5ibGFja2xpc3RXb3Jkcy5pbmNsdWRlcyhub3JtYWxpemVkV29yZCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzID0gWy4uLnRoaXMuc2V0dGluZ3MuYmxhY2tsaXN0V29yZHMsIG5vcm1hbGl6ZWRXb3JkXTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlQmxhY2tsaXN0V29yZChyYXdXb3JkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBub3JtYWxpemVkV29yZCA9IHRoaXMubm9ybWFsaXplQmxhY2tsaXN0V29yZChyYXdXb3JkKTtcbiAgICB0aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzID0gdGhpcy5zZXR0aW5ncy5ibGFja2xpc3RXb3Jkcy5maWx0ZXIoKHdvcmQpID0+IHdvcmQgIT09IG5vcm1hbGl6ZWRXb3JkKTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgYXN5bmMgcmVzZXRCbGFja2xpc3RXb3JkcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzID0gWy4uLkRFRkFVTFRfU0VUVElOR1MuYmxhY2tsaXN0V29yZHNdO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVSZW5kZXJTZXR0aW5ncyhwYXRjaDogUGFydGlhbDxSZW5kZXJTZXR0aW5ncz4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBtZXJnZWQgPSB7XG4gICAgICAuLi50aGlzLnNldHRpbmdzLnJlbmRlcixcbiAgICAgIC4uLnBhdGNoLFxuICAgIH07XG4gICAgdGhpcy5zZXR0aW5ncy5yZW5kZXIgPSB0aGlzLm5vcm1hbGl6ZVJlbmRlclNldHRpbmdzKG1lcmdlZCk7XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIGFzeW5jIHJlc2V0UmVuZGVyU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5zZXR0aW5ncy5yZW5kZXIgPSB7IC4uLkRFRkFVTFRfU0VUVElOR1MucmVuZGVyIH07XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QmxhY2tsaXN0U2V0KCk6IFNldDxzdHJpbmc+IHtcbiAgICByZXR1cm4gbmV3IFNldCh0aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzLm1hcCgod29yZCkgPT4gdGhpcy5ub3JtYWxpemVCbGFja2xpc3RXb3JkKHdvcmQpKS5maWx0ZXIoQm9vbGVhbikpO1xuICB9XG5cbiAgcHJpdmF0ZSBub3JtYWxpemVCbGFja2xpc3RXb3JkcyhyYXdWYWx1ZTogdW5rbm93bik6IHN0cmluZ1tdIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocmF3VmFsdWUpKSB7XG4gICAgICByZXR1cm4gWy4uLkRFRkFVTFRfU0VUVElOR1MuYmxhY2tsaXN0V29yZHNdO1xuICAgIH1cblxuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJhd1ZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnc3RyaW5nJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB0aGlzLm5vcm1hbGl6ZUJsYWNrbGlzdFdvcmQoZW50cnkpO1xuICAgICAgaWYgKG5vcm1hbGl6ZWQpIHtcbiAgICAgICAgc2Vlbi5hZGQobm9ybWFsaXplZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZW4uc2l6ZSA+IDAgPyBbLi4uc2Vlbl0gOiBbLi4uREVGQVVMVF9TRVRUSU5HUy5ibGFja2xpc3RXb3Jkc107XG4gIH1cblxuICBwcml2YXRlIG5vcm1hbGl6ZUJsYWNrbGlzdFdvcmQod29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gd29yZC50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9ybWFsaXplUmVuZGVyU2V0dGluZ3MocmF3VmFsdWU6IHVua25vd24pOiBSZW5kZXJTZXR0aW5ncyB7XG4gICAgY29uc3QgcmF3ID0gKHJhd1ZhbHVlICYmIHR5cGVvZiByYXdWYWx1ZSA9PT0gJ29iamVjdCcpID8gcmF3VmFsdWUgYXMgUGFydGlhbDxSZW5kZXJTZXR0aW5ncz4gOiB7fTtcblxuICAgIGNvbnN0IHJvdGF0aW9uUHJlc2V0ID0gcmF3LnJvdGF0aW9uUHJlc2V0ID09PSAnaG9yaXpvbnRhbCdcbiAgICAgIHx8IHJhdy5yb3RhdGlvblByZXNldCA9PT0gJ21vc3RseS1ob3Jpem9udGFsJ1xuICAgICAgfHwgcmF3LnJvdGF0aW9uUHJlc2V0ID09PSAnbWl4ZWQnXG4gICAgICB8fCByYXcucm90YXRpb25QcmVzZXQgPT09ICd2ZXJ0aWNhbCdcbiAgICAgID8gcmF3LnJvdGF0aW9uUHJlc2V0XG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnJvdGF0aW9uUHJlc2V0O1xuXG4gICAgY29uc3Qgc3BpcmFsID0gcmF3LnNwaXJhbCA9PT0gJ2FyY2hpbWVkZWFuJyB8fCByYXcuc3BpcmFsID09PSAncmVjdGFuZ3VsYXInXG4gICAgICA/IHJhdy5zcGlyYWxcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuc3BpcmFsO1xuXG4gICAgY29uc3Qgd29yZFBhZGRpbmcgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy53b3JkUGFkZGluZywgMCwgMTIsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLndvcmRQYWRkaW5nKTtcbiAgICBjb25zdCBtaW5Gb250U2l6ZSA9IHRoaXMuY2xhbXBOdW1iZXIocmF3Lm1pbkZvbnRTaXplLCA4LCA2NCwgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIubWluRm9udFNpemUpO1xuICAgIGNvbnN0IG1heEZvbnRTaXplID0gdGhpcy5jbGFtcE51bWJlcihyYXcubWF4Rm9udFNpemUsIDE2LCAxNDAsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLm1heEZvbnRTaXplKTtcbiAgICBjb25zdCBzYWZlTWluRm9udFNpemUgPSBNYXRoLm1pbihtaW5Gb250U2l6ZSwgbWF4Rm9udFNpemUgLSAxKTtcbiAgICBjb25zdCBzYWZlTWF4Rm9udFNpemUgPSBNYXRoLm1heChtYXhGb250U2l6ZSwgc2FmZU1pbkZvbnRTaXplICsgMSk7XG5cbiAgICBjb25zdCBmb250RmFtaWx5ID0gdHlwZW9mIHJhdy5mb250RmFtaWx5ID09PSAnc3RyaW5nJyAmJiByYXcuZm9udEZhbWlseS50cmltKCkubGVuZ3RoID4gMFxuICAgICAgPyByYXcuZm9udEZhbWlseS50cmltKClcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuZm9udEZhbWlseTtcblxuICAgIGNvbnN0IHNjYWxpbmdNb2RlID0gcmF3LnNjYWxpbmdNb2RlID09PSAnbGluZWFyJ1xuICAgICAgfHwgcmF3LnNjYWxpbmdNb2RlID09PSAncG93ZXInXG4gICAgICB8fCByYXcuc2NhbGluZ01vZGUgPT09ICdsb2cnXG4gICAgICB8fCByYXcuc2NhbGluZ01vZGUgPT09ICdyYW5rJ1xuICAgICAgPyByYXcuc2NhbGluZ01vZGVcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuc2NhbGluZ01vZGU7XG5cbiAgICBjb25zdCBlbXBoYXNpcyA9IHRoaXMuY2xhbXBGbG9hdChyYXcuZW1waGFzaXMsIDAuNSwgMywgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuZW1waGFzaXMpO1xuXG4gICAgY29uc3Qgc2hvd0NvdW50SW5Xb3JkVGV4dCA9IHR5cGVvZiByYXcuc2hvd0NvdW50SW5Xb3JkVGV4dCA9PT0gJ2Jvb2xlYW4nXG4gICAgICA/IHJhdy5zaG93Q291bnRJbldvcmRUZXh0XG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnNob3dDb3VudEluV29yZFRleHQ7XG5cbiAgICBjb25zdCBjb3VudExhYmVsRm9ybWF0ID0gcmF3LmNvdW50TGFiZWxGb3JtYXQgPT09ICdwYXJlbidcbiAgICAgIHx8IHJhdy5jb3VudExhYmVsRm9ybWF0ID09PSAnZG90J1xuICAgICAgfHwgcmF3LmNvdW50TGFiZWxGb3JtYXQgPT09ICdjb2xvbidcbiAgICAgID8gcmF3LmNvdW50TGFiZWxGb3JtYXRcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuY291bnRMYWJlbEZvcm1hdDtcblxuICAgIGNvbnN0IGNvdW50TGFiZWxNaW5Db3VudCA9IHRoaXMuY2xhbXBOdW1iZXIocmF3LmNvdW50TGFiZWxNaW5Db3VudCwgMSwgMTAwLCBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5jb3VudExhYmVsTWluQ291bnQpO1xuXG4gICAgY29uc3QgcHJvZ3Jlc3NEZXRhaWwgPSByYXcucHJvZ3Jlc3NEZXRhaWwgPT09ICdtaW5pbWFsJ1xuICAgICAgfHwgcmF3LnByb2dyZXNzRGV0YWlsID09PSAnYmFsYW5jZWQnXG4gICAgICB8fCByYXcucHJvZ3Jlc3NEZXRhaWwgPT09ICdkZXRhaWxlZCdcbiAgICAgIHx8IHJhdy5wcm9ncmVzc0RldGFpbCA9PT0gJ3VuaGluZ2VkJ1xuICAgICAgPyByYXcucHJvZ3Jlc3NEZXRhaWxcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIucHJvZ3Jlc3NEZXRhaWw7XG5cbiAgICBjb25zdCBzY2FuQmF0Y2hTaXplID0gdGhpcy5jbGFtcE51bWJlcihyYXcuc2NhbkJhdGNoU2l6ZSwgOCwgNjQsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnNjYW5CYXRjaFNpemUpO1xuICAgIGNvbnN0IGxheW91dFRpbWVJbnRlcnZhbE1zID0gdGhpcy5jbGFtcE51bWJlcihcbiAgICAgIHJhdy5sYXlvdXRUaW1lSW50ZXJ2YWxNcyxcbiAgICAgIDgsXG4gICAgICA0MCxcbiAgICAgIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLmxheW91dFRpbWVJbnRlcnZhbE1zLFxuICAgICk7XG5cbiAgICBjb25zdCBkZXRlcm1pbmlzdGljTGF5b3V0ID0gdHlwZW9mIHJhdy5kZXRlcm1pbmlzdGljTGF5b3V0ID09PSAnYm9vbGVhbidcbiAgICAgID8gcmF3LmRldGVybWluaXN0aWNMYXlvdXRcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuZGV0ZXJtaW5pc3RpY0xheW91dDtcblxuICAgIGNvbnN0IHJhbmRvbVNlZWQgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy5yYW5kb21TZWVkLCAxLCAyMTQ3NDgzNjQ3LCBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5yYW5kb21TZWVkKTtcblxuICAgIHJldHVybiB7XG4gICAgICByb3RhdGlvblByZXNldCxcbiAgICAgIHNwaXJhbCxcbiAgICAgIHdvcmRQYWRkaW5nLFxuICAgICAgbWluRm9udFNpemU6IHNhZmVNaW5Gb250U2l6ZSxcbiAgICAgIG1heEZvbnRTaXplOiBzYWZlTWF4Rm9udFNpemUsXG4gICAgICBmb250RmFtaWx5LFxuICAgICAgc2NhbGluZ01vZGUsXG4gICAgICBlbXBoYXNpcyxcbiAgICAgIHNob3dDb3VudEluV29yZFRleHQsXG4gICAgICBjb3VudExhYmVsRm9ybWF0LFxuICAgICAgY291bnRMYWJlbE1pbkNvdW50LFxuICAgICAgcHJvZ3Jlc3NEZXRhaWwsXG4gICAgICBzY2FuQmF0Y2hTaXplLFxuICAgICAgbGF5b3V0VGltZUludGVydmFsTXMsXG4gICAgICBkZXRlcm1pbmlzdGljTGF5b3V0LFxuICAgICAgcmFuZG9tU2VlZCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBjbGFtcE51bWJlcih2YWx1ZTogdW5rbm93biwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyLCBmYWxsYmFjazogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fCBOdW1iZXIuaXNOYU4odmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgTWF0aC5yb3VuZCh2YWx1ZSkpKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xhbXBGbG9hdCh2YWx1ZTogdW5rbm93biwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyLCBmYWxsYmFjazogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fCBOdW1iZXIuaXNOYU4odmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgdmFsdWUpKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5zZXJ0RW1iZWRBdEN1cnNvcihlbWJlZEJsb2NrOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBpZiAoIXZpZXcpIHtcbiAgICAgIG5ldyBOb3RpY2UoJ09wZW4gYSBtYXJrZG93biBub3RlIHRvIGluc2VydCBhIHdvcmQgY2xvdWQgZW1iZWQuJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgeyBlZGl0b3IgfSA9IHZpZXc7XG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpO1xuICAgIGNvbnN0IGN1cnJlbnRMaW5lID0gZWRpdG9yLmdldExpbmUoY3Vyc29yLmxpbmUpO1xuXG4gICAgY29uc3QgaGFzVGV4dEJlZm9yZUN1cnNvciA9IGN1cnJlbnRMaW5lLnNsaWNlKDAsIGN1cnNvci5jaCkudHJpbSgpLmxlbmd0aCA+IDA7XG4gICAgY29uc3QgaGFzVGV4dEFmdGVyQ3Vyc29yID0gY3VycmVudExpbmUuc2xpY2UoY3Vyc29yLmNoKS50cmltKCkubGVuZ3RoID4gMDtcblxuICAgIGNvbnN0IHByZWZpeCA9IGhhc1RleHRCZWZvcmVDdXJzb3IgPyAnXFxuJyA6ICcnO1xuICAgIGNvbnN0IHN1ZmZpeCA9IGhhc1RleHRBZnRlckN1cnNvciA/ICdcXG4nIDogJyc7XG4gICAgY29uc3QgdGV4dFRvSW5zZXJ0ID0gYCR7cHJlZml4fSR7ZW1iZWRCbG9ja30ke3N1ZmZpeH1gO1xuXG4gICAgZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24odGV4dFRvSW5zZXJ0KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBWSUVXX1RZUEVfVkFVTFRfV09SRF9DTE9VRCA9ICd2YXVsdC13b3JkLWNsb3VkLXZpZXcnO1xuZXhwb3J0IGNvbnN0IFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQgPSAnbm90ZS13b3JkLWNsb3VkLXZpZXcnO1xuZXhwb3J0IGNvbnN0IE1BWF9XT1JEUyA9IDE0MDtcbmV4cG9ydCBjb25zdCBNSU5fV09SRF9MRU5HVEggPSAzO1xuZXhwb3J0IGNvbnN0IEZST05UTUFUVEVSX1BBVFRFUk4gPSAvXi0tLVxccypcXG5bXFxzXFxTXSo/XFxuLS0tXFxzKig/OlxcbnwkKS87XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NUT1BfV09SRFM6IHN0cmluZ1tdID0gW1xuICAndGhlJywgJ2FuZCcsICdmb3InLCAndGhhdCcsICd0aGlzJywgJ3dpdGgnLCAnZnJvbScsICdhcmUnLCAnd2FzJywgJ3dlcmUnLCAnaGF2ZScsICdoYXMnLCAnaGFkJyxcbiAgJ3lvdScsICd5b3VyJywgJ3RoZXknLCAndGhlbScsICd0aGVpcicsICdpdHMnLCAnb3VyJywgJ291cnMnLCAnaGlzJywgJ2hlcicsICdzaGUnLCAnaGltJywgJ25vdCcsXG4gICdidXQnLCAnY2FuJywgJ3dpbGwnLCAnYWxsJywgJ2FueScsICdvbmUnLCAndHdvJywgJ3RvbycsICd1c2UnLCAndXNpbmcnLCAnaW50bycsICdvdXQnLCAnYWJvdXQnLFxuICAndGhlcmUnLCAndGhlbicsICd0aGFuJywgJ3doZW4nLCAnd2hhdCcsICd3aGVyZScsICd3aGljaCcsICd3aG8nLCAnd2hvbScsICdob3cnLCAnd2h5JywgJ2Fsc28nLFxuICAnanVzdCcsICdsaWtlJywgJ3NvbWUnLCAnbW9yZScsICdtb3N0JywgJ211Y2gnLCAnbWFueScsICd2ZXJ5JywgJ2VhY2gnLCAnb3RoZXInLCAnc3VjaCcsICdvbmx5JyxcbiAgJ25vdGUnLCAnbm90ZXMnLCAndG9kbycsICdkb25lJywgJ251bGwnLCAndHJ1ZScsICdmYWxzZScsICdodHRwJywgJ2h0dHBzJywgJ3d3dycsICdjb20nXG5dO1xuIiwgImltcG9ydCB7IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsIE5vdGljZSwgUGx1Z2luLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgVGFnTWF0Y2hNb2RlLCBXb3JkQ2xvdWRTZXJ2aWNlcyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IEVtYmVkV29yZENsb3VkTW9kYWwgfSBmcm9tICcuLi9tb2RhbHMvZW1iZWQtd29yZC1jbG91ZC1tb2RhbCc7XG5cbnR5cGUgRW1iZWRkZWRXb3JkQ2xvdWRNb2RlID0gJ2N1cnJlbnQtZmlsZScgfCAnc3BlY2lmaWMtZmlsZScgfCAndGFnLWJhc2VkJztcblxudHlwZSBFbWJlZGRlZFdvcmRDbG91ZE9wdGlvbnMgPSB7XG4gIG1vZGU6IEVtYmVkZGVkV29yZENsb3VkTW9kZTtcbiAgdGFnczogc3RyaW5nW107XG4gIG1hdGNoOiBUYWdNYXRjaE1vZGU7XG4gIGhlaWdodDogbnVtYmVyO1xuICBpbnRlcmFjdGlvbnM6IGJvb2xlYW47XG4gIGZpbGVQYXRoPzogc3RyaW5nO1xufTtcblxudHlwZSBFbWJlZGRlZFJlbmRlclN0YXRlID0ge1xuICBvYnNlcnZlcjogUmVzaXplT2JzZXJ2ZXI7XG4gIHJlcmVuZGVyVGltZXI6IG51bWJlciB8IG51bGw7XG4gIGxhc3RXaWR0aDogbnVtYmVyO1xuICBsYXN0SGVpZ2h0OiBudW1iZXI7XG59O1xuXG5jb25zdCBERUZBVUxUX09QVElPTlM6IEVtYmVkZGVkV29yZENsb3VkT3B0aW9ucyA9IHtcbiAgbW9kZTogJ2N1cnJlbnQtZmlsZScsXG4gIHRhZ3M6IFtdLFxuICBtYXRjaDogJ2FueScsXG4gIGhlaWdodDogMzIwLFxuICBpbnRlcmFjdGlvbnM6IHRydWUsXG59O1xuXG5jb25zdCBFTUJFRF9SRVNJWkVfREVCT1VOQ0VfTVMgPSAxNDA7XG5jb25zdCBlbWJlZGRlZFJlbmRlclN0YXRlcyA9IG5ldyBXZWFrTWFwPEhUTUxFbGVtZW50LCBFbWJlZGRlZFJlbmRlclN0YXRlPigpO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJFbWJlZGRlZFdvcmRDbG91ZFByb2Nlc3NvcihcbiAgcGx1Z2luOiBQbHVnaW4sXG4gIHNlcnZpY2VzOiBXb3JkQ2xvdWRTZXJ2aWNlcyxcbik6IHZvaWQge1xuICBjb25zdCByZW5kZXIgPSBhc3luYyAoc291cmNlOiBzdHJpbmcsIGVsOiBIVE1MRWxlbWVudCwgY3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY2xlYW51cEVtYmVkZGVkUmVuZGVyU3RhdGUoZWwpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBwYXJzZU9wdGlvbnMoc291cmNlKTtcblxuICAgIGVsLmVtcHR5KCk7XG4gICAgY29uc3Qgd3JhcHBlckVsID0gZWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1lbWJlZCcgfSk7XG4gICAgY29uc3Qgc3RhdGVFbCA9IHdyYXBwZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLXN0YXRlJywgdGV4dDogJ0J1aWxkaW5nIGNsb3VkLi4uJyB9KTtcbiAgICBjb25zdCBjYW52YXNFbCA9IHdyYXBwZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLWNhbnZhcycgfSk7XG4gICAgY2FudmFzRWwuc3R5bGUuaGVpZ2h0ID0gYCR7b3B0aW9ucy5oZWlnaHR9cHhgO1xuXG4gICAgY29uc3QgdXBkYXRlUHJvZ3Jlc3MgPSAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIHN0YXRlRWwuc2V0VGV4dChgJHttZXNzYWdlfSAoJHtwZXJjZW50fSUpYCk7XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgd29yZHM7XG4gICAgICBsZXQgc2VhcmNoU2NvcGU6IHsgZmlsZVBhdGg/OiBzdHJpbmc7IHRhZ3M/OiBzdHJpbmdbXTsgdGFnTWF0Y2hNb2RlPzogVGFnTWF0Y2hNb2RlIH0gPSB7fTtcblxuICAgICAgaWYgKG9wdGlvbnMubW9kZSA9PT0gJ2N1cnJlbnQtZmlsZScpIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHJlc29sdmVDdXJyZW50RmlsZShwbHVnaW4sIGN0eCk7XG4gICAgICAgIGlmICghZmlsZSkge1xuICAgICAgICAgIHN0YXRlRWwuc2V0VGV4dCgnQ291bGQgbm90IHJlc29sdmUgdGhlIGN1cnJlbnQgZmlsZSBmb3IgdGhpcyBlbWJlZGRlZCBjbG91ZC4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB3b3JkcyA9IGF3YWl0IHNlcnZpY2VzLmNvbGxlY3RGaWxlV29yZHMoZmlsZSwgdXBkYXRlUHJvZ3Jlc3MpO1xuICAgICAgICBzZWFyY2hTY29wZSA9IHsgZmlsZVBhdGg6IGZpbGUucGF0aCB9O1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLm1vZGUgPT09ICdzcGVjaWZpYy1maWxlJykge1xuICAgICAgICBpZiAoIW9wdGlvbnMuZmlsZVBhdGgpIHtcbiAgICAgICAgICBzdGF0ZUVsLnNldFRleHQoJ1NldCBgZmlsZTpgIHdoZW4gdXNpbmcgYG1vZGU6IHNwZWNpZmljLWZpbGVgLicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGUgPSByZXNvbHZlU3BlY2lmaWNGaWxlKHBsdWdpbiwgb3B0aW9ucy5maWxlUGF0aCk7XG4gICAgICAgIGlmICghZmlsZSkge1xuICAgICAgICAgIHN0YXRlRWwuc2V0VGV4dCgnQ291bGQgbm90IGZpbmQgdGhlIGZpbGUgZm9yIHRoaXMgZW1iZWRkZWQgY2xvdWQuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgd29yZHMgPSBhd2FpdCBzZXJ2aWNlcy5jb2xsZWN0RmlsZVdvcmRzKGZpbGUsIHVwZGF0ZVByb2dyZXNzKTtcbiAgICAgICAgc2VhcmNoU2NvcGUgPSB7IGZpbGVQYXRoOiBmaWxlLnBhdGggfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdvcmRzID0gYXdhaXQgc2VydmljZXMuY29sbGVjdFZhdWx0V29yZHMob3B0aW9ucy50YWdzLCBvcHRpb25zLm1hdGNoLCB1cGRhdGVQcm9ncmVzcyk7XG4gICAgICAgIHNlYXJjaFNjb3BlID0geyB0YWdzOiBvcHRpb25zLnRhZ3MsIHRhZ01hdGNoTW9kZTogb3B0aW9ucy5tYXRjaCB9O1xuICAgICAgfVxuXG4gICAgICBpZiAod29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHN0YXRlRWwuc2V0VGV4dCgnTm8gd29yZHMgZm91bmQgZm9yIHRoaXMgZW1iZWRkZWQgY2xvdWQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgc2VydmljZXMuZHJhd1dvcmRDbG91ZCh7XG4gICAgICAgIGNvbnRhaW5lckVsOiBjYW52YXNFbCxcbiAgICAgICAgd29yZHMsXG4gICAgICAgIGFyaWFMYWJlbDogJ0VtYmVkZGVkIHdvcmQgY2xvdWQnLFxuICAgICAgICBvblByb2dyZXNzOiB1cGRhdGVQcm9ncmVzcyxcbiAgICAgICAgb25SZWZyZXNoOiAoKSA9PiByZW5kZXIoc291cmNlLCBlbCwgY3R4KSxcbiAgICAgICAgb25FZGl0OiAoKSA9PiB7XG4gICAgICAgICAgb3BlbkVtYmVkZGVkV29yZENsb3VkRWRpdFdpemFyZChwbHVnaW4sIHNlcnZpY2VzLCBjdHgsIGVsLCBvcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW5hYmxlT3ZlcmxheUNvbnRyb2xzOiB0cnVlLFxuICAgICAgICBlbmFibGVWaWV3cG9ydEludGVyYWN0aW9uOiBvcHRpb25zLmludGVyYWN0aW9ucyxcbiAgICAgICAgc2hvd1JlZnJlc2hDb250cm9sOiB0cnVlLFxuICAgICAgICBzaG93Wm9vbUNvbnRyb2xzOiBvcHRpb25zLmludGVyYWN0aW9ucyxcbiAgICAgICAgc2hvd0VkaXRDb250cm9sOiB0cnVlLFxuICAgICAgICBvbldvcmRDbGljazogKHdvcmQpID0+IHtcbiAgICAgICAgICB2b2lkIHNlcnZpY2VzLm9wZW5TZWFyY2hGb3JXb3JkKHdvcmQsIHNlYXJjaFNjb3BlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBzdGF0ZUVsLnJlbW92ZSgpO1xuICAgICAgcmVnaXN0ZXJFbWJlZGRlZFJlc2l6ZU9ic2VydmVyKGVsLCBjYW52YXNFbCwgKCkgPT4gcmVuZGVyKHNvdXJjZSwgZWwsIGN0eCkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdXb3JkIGNsb3VkczogZmFpbGVkIHRvIHJlbmRlciBlbWJlZGRlZCBjbG91ZCcsIGVycm9yKTtcbiAgICAgIHN0YXRlRWwuc2V0VGV4dCgnQ291bGQgbm90IHJlbmRlciBlbWJlZGRlZCB3b3JkIGNsb3VkLicpO1xuICAgIH1cbiAgfTtcblxuICBwbHVnaW4ucmVnaXN0ZXJNYXJrZG93bkNvZGVCbG9ja1Byb2Nlc3Nvcignd29yZGNsb3VkJywgcmVuZGVyKTtcbiAgcGx1Z2luLnJlZ2lzdGVyTWFya2Rvd25Db2RlQmxvY2tQcm9jZXNzb3IoJ3dvcmQtY2xvdWQnLCByZW5kZXIpO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlQ3VycmVudEZpbGUocGx1Z2luOiBQbHVnaW4sIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCk6IFRGaWxlIHwgbnVsbCB7XG4gIGNvbnN0IGZyb21Db250ZXh0ID0gcGx1Z2luLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoY3R4LnNvdXJjZVBhdGgpO1xuICByZXR1cm4gZnJvbUNvbnRleHQgaW5zdGFuY2VvZiBURmlsZSA/IGZyb21Db250ZXh0IDogbnVsbDtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVNwZWNpZmljRmlsZShwbHVnaW46IFBsdWdpbiwgZmlsZVBhdGg6IHN0cmluZyk6IFRGaWxlIHwgbnVsbCB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRQYXRoID0gZmlsZVBhdGgudHJpbSgpO1xuICBpZiAoIW5vcm1hbGl6ZWRQYXRoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCByZXNvbHZlZCA9IHBsdWdpbi5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKG5vcm1hbGl6ZWRQYXRoKTtcbiAgcmV0dXJuIHJlc29sdmVkIGluc3RhbmNlb2YgVEZpbGUgPyByZXNvbHZlZCA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIHBhcnNlT3B0aW9ucyhzb3VyY2U6IHN0cmluZyk6IEVtYmVkZGVkV29yZENsb3VkT3B0aW9ucyB7XG4gIGNvbnN0IG9wdGlvbnM6IEVtYmVkZGVkV29yZENsb3VkT3B0aW9ucyA9IHsgLi4uREVGQVVMVF9PUFRJT05TIH07XG4gIGxldCBtb2RlV2FzRXhwbGljaXRseVNldCA9IGZhbHNlO1xuICBjb25zdCBsaW5lcyA9IHNvdXJjZS5zcGxpdCgnXFxuJyk7XG5cbiAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgY29uc3QgdHJpbW1lZCA9IGxpbmUudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCB8fCB0cmltbWVkLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSB0cmltbWVkLmluZGV4T2YoJzonKTtcbiAgICBpZiAoc2VwYXJhdG9ySW5kZXggPT09IC0xKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCByYXdLZXkgPSB0cmltbWVkLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCByYXdWYWx1ZSA9IHRyaW1tZWQuc2xpY2Uoc2VwYXJhdG9ySW5kZXggKyAxKS50cmltKCk7XG5cbiAgICBpZiAocmF3S2V5ID09PSAnbW9kZScpIHtcbiAgICAgIGNvbnN0IHBhcnNlZE1vZGUgPSBwYXJzZU1vZGVPcHRpb24ocmF3VmFsdWUpO1xuICAgICAgaWYgKHBhcnNlZE1vZGUpIHtcbiAgICAgICAgb3B0aW9ucy5tb2RlID0gcGFyc2VkTW9kZTtcbiAgICAgICAgbW9kZVdhc0V4cGxpY2l0bHlTZXQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ3Njb3BlJyAmJiAhbW9kZVdhc0V4cGxpY2l0bHlTZXQpIHtcbiAgICAgIGNvbnN0IHBhcnNlZE1vZGUgPSBwYXJzZUxlZ2FjeVNjb3BlT3B0aW9uKHJhd1ZhbHVlKTtcbiAgICAgIGlmIChwYXJzZWRNb2RlKSB7XG4gICAgICAgIG9wdGlvbnMubW9kZSA9IHBhcnNlZE1vZGU7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAnbWF0Y2gnKSB7XG4gICAgICBvcHRpb25zLm1hdGNoID0gcmF3VmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ2FsbCcgPyAnYWxsJyA6ICdhbnknO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ3RhZ3MnKSB7XG4gICAgICBvcHRpb25zLnRhZ3MgPSByYXdWYWx1ZVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAubWFwKCh2YWx1ZSkgPT4gdmFsdWUudHJpbSgpKVxuICAgICAgICAuZmlsdGVyKCh2YWx1ZSkgPT4gdmFsdWUubGVuZ3RoID4gMCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAnaGVpZ2h0Jykge1xuICAgICAgY29uc3QgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHJhd1ZhbHVlLCAxMCk7XG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XG4gICAgICAgIG9wdGlvbnMuaGVpZ2h0ID0gTWF0aC5taW4oOTAwLCBNYXRoLm1heCgxODAsIHBhcnNlZCkpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ2ludGVyYWN0aW9ucycgfHwgcmF3S2V5ID09PSAnaW50ZXJhY3RhYmxlJyB8fCByYXdLZXkgPT09ICdjb250cm9scycpIHtcbiAgICAgIG9wdGlvbnMuaW50ZXJhY3Rpb25zID0gcGFyc2VCb29sZWFuT3B0aW9uKHJhd1ZhbHVlLCB0cnVlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdmaWxlJyB8fCByYXdLZXkgPT09ICdub3RlJyB8fCByYXdLZXkgPT09ICdwYXRoJyB8fCByYXdLZXkgPT09ICdmaWxlbmFtZScpIHtcbiAgICAgIG9wdGlvbnMuZmlsZVBhdGggPSByYXdWYWx1ZTtcbiAgICAgIGlmICghbW9kZVdhc0V4cGxpY2l0bHlTZXQpIHtcbiAgICAgICAgb3B0aW9ucy5tb2RlID0gJ3NwZWNpZmljLWZpbGUnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5mdW5jdGlvbiBwYXJzZU1vZGVPcHRpb24odmFsdWU6IHN0cmluZyk6IEVtYmVkZGVkV29yZENsb3VkTW9kZSB8IG51bGwge1xuICBjb25zdCBub3JtYWxpemVkID0gdmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvW1xcc19dKy9nLCAnLScpO1xuICBpZiAoXG4gICAgbm9ybWFsaXplZCA9PT0gJ2N1cnJlbnQtZmlsZSdcbiAgICB8fCBub3JtYWxpemVkID09PSAnY3VycmVudCdcbiAgICB8fCBub3JtYWxpemVkID09PSAnY3VycmVudC1ub3RlJ1xuICAgIHx8IG5vcm1hbGl6ZWQgPT09ICdub3RlJ1xuICApIHtcbiAgICByZXR1cm4gJ2N1cnJlbnQtZmlsZSc7XG4gIH1cblxuICBpZiAoXG4gICAgbm9ybWFsaXplZCA9PT0gJ3NwZWNpZmljLWZpbGUnXG4gICAgfHwgbm9ybWFsaXplZCA9PT0gJ3NwZWNpZmljJ1xuICAgIHx8IG5vcm1hbGl6ZWQgPT09ICdmaWxlJ1xuICAgIHx8IG5vcm1hbGl6ZWQgPT09ICdub3RlLWZpbGUnXG4gICkge1xuICAgIHJldHVybiAnc3BlY2lmaWMtZmlsZSc7XG4gIH1cblxuICBpZiAoXG4gICAgbm9ybWFsaXplZCA9PT0gJ3RhZy1iYXNlZCdcbiAgICB8fCBub3JtYWxpemVkID09PSAndGFncydcbiAgICB8fCBub3JtYWxpemVkID09PSAndGFnJ1xuICAgIHx8IG5vcm1hbGl6ZWQgPT09ICd2YXVsdCdcbiAgKSB7XG4gICAgcmV0dXJuICd0YWctYmFzZWQnO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTGVnYWN5U2NvcGVPcHRpb24odmFsdWU6IHN0cmluZyk6IEVtYmVkZGVkV29yZENsb3VkTW9kZSB8IG51bGwge1xuICBjb25zdCBub3JtYWxpemVkID0gdmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChub3JtYWxpemVkID09PSAndmF1bHQnKSB7XG4gICAgcmV0dXJuICd0YWctYmFzZWQnO1xuICB9XG4gIGlmIChub3JtYWxpemVkID09PSAnbm90ZScpIHtcbiAgICByZXR1cm4gJ2N1cnJlbnQtZmlsZSc7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQm9vbGVhbk9wdGlvbih2YWx1ZTogc3RyaW5nLCBmYWxsYmFjazogYm9vbGVhbik6IGJvb2xlYW4ge1xuICBjb25zdCBub3JtYWxpemVkID0gdmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChub3JtYWxpemVkID09PSAndHJ1ZScgfHwgbm9ybWFsaXplZCA9PT0gJ3llcycgfHwgbm9ybWFsaXplZCA9PT0gJ29uJyB8fCBub3JtYWxpemVkID09PSAnMScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobm9ybWFsaXplZCA9PT0gJ2ZhbHNlJyB8fCBub3JtYWxpemVkID09PSAnbm8nIHx8IG5vcm1hbGl6ZWQgPT09ICdvZmYnIHx8IG5vcm1hbGl6ZWQgPT09ICcwJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gZmFsbGJhY2s7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRW1iZWRkZWRSZXNpemVPYnNlcnZlcihcbiAgaG9zdEVsOiBIVE1MRWxlbWVudCxcbiAgY2FudmFzRWw6IEhUTUxEaXZFbGVtZW50LFxuICByZXJlbmRlcjogKCkgPT4gdm9pZCxcbik6IHZvaWQge1xuICBpZiAodHlwZW9mIFJlc2l6ZU9ic2VydmVyID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlOiBFbWJlZGRlZFJlbmRlclN0YXRlID0ge1xuICAgIG9ic2VydmVyOiBuZXcgUmVzaXplT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gZW50cmllc1swXTtcbiAgICAgIGlmICghZW50cnkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXh0V2lkdGggPSBNYXRoLnJvdW5kKGVudHJ5LmNvbnRlbnRSZWN0LndpZHRoKTtcbiAgICAgIGNvbnN0IG5leHRIZWlnaHQgPSBNYXRoLnJvdW5kKGVudHJ5LmNvbnRlbnRSZWN0LmhlaWdodCk7XG4gICAgICBpZiAobmV4dFdpZHRoIDw9IDAgfHwgbmV4dEhlaWdodCA8PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0V2lkdGggPT09IHN0YXRlLmxhc3RXaWR0aCAmJiBuZXh0SGVpZ2h0ID09PSBzdGF0ZS5sYXN0SGVpZ2h0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3RhdGUubGFzdFdpZHRoID0gbmV4dFdpZHRoO1xuICAgICAgc3RhdGUubGFzdEhlaWdodCA9IG5leHRIZWlnaHQ7XG5cbiAgICAgIGlmIChzdGF0ZS5yZXJlbmRlclRpbWVyICE9PSBudWxsKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoc3RhdGUucmVyZW5kZXJUaW1lcik7XG4gICAgICB9XG4gICAgICBzdGF0ZS5yZXJlbmRlclRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzdGF0ZS5yZXJlbmRlclRpbWVyID0gbnVsbDtcbiAgICAgICAgcmVyZW5kZXIoKTtcbiAgICAgIH0sIEVNQkVEX1JFU0laRV9ERUJPVU5DRV9NUyk7XG4gICAgfSksXG4gICAgcmVyZW5kZXJUaW1lcjogbnVsbCxcbiAgICBsYXN0V2lkdGg6IE1hdGgucm91bmQoY2FudmFzRWwuY2xpZW50V2lkdGgpLFxuICAgIGxhc3RIZWlnaHQ6IE1hdGgucm91bmQoY2FudmFzRWwuY2xpZW50SGVpZ2h0KSxcbiAgfTtcblxuICBzdGF0ZS5vYnNlcnZlci5vYnNlcnZlKGNhbnZhc0VsKTtcbiAgZW1iZWRkZWRSZW5kZXJTdGF0ZXMuc2V0KGhvc3RFbCwgc3RhdGUpO1xufVxuXG5mdW5jdGlvbiBjbGVhbnVwRW1iZWRkZWRSZW5kZXJTdGF0ZShob3N0RWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gIGNvbnN0IHN0YXRlID0gZW1iZWRkZWRSZW5kZXJTdGF0ZXMuZ2V0KGhvc3RFbCk7XG4gIGlmICghc3RhdGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0ZS5vYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gIGlmIChzdGF0ZS5yZXJlbmRlclRpbWVyICE9PSBudWxsKSB7XG4gICAgd2luZG93LmNsZWFyVGltZW91dChzdGF0ZS5yZXJlbmRlclRpbWVyKTtcbiAgfVxuICBlbWJlZGRlZFJlbmRlclN0YXRlcy5kZWxldGUoaG9zdEVsKTtcbn1cblxuZnVuY3Rpb24gb3BlbkVtYmVkZGVkV29yZENsb3VkRWRpdFdpemFyZChcbiAgcGx1Z2luOiBQbHVnaW4sXG4gIHNlcnZpY2VzOiBXb3JkQ2xvdWRTZXJ2aWNlcyxcbiAgY3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LFxuICBob3N0RWw6IEhUTUxFbGVtZW50LFxuICBvcHRpb25zOiBFbWJlZGRlZFdvcmRDbG91ZE9wdGlvbnMsXG4pOiB2b2lkIHtcbiAgbmV3IEVtYmVkV29yZENsb3VkTW9kYWwoXG4gICAgcGx1Z2luLmFwcCxcbiAgICBzZXJ2aWNlcyxcbiAgICBhc3luYyAoZW1iZWRCbG9jaykgPT4gdXBkYXRlRW1iZWRkZWRDb2RlQmxvY2socGx1Z2luLCBjdHgsIGhvc3RFbCwgZW1iZWRCbG9jayksXG4gICAge1xuICAgICAgdGl0bGU6ICdFZGl0IGVtYmVkZGVkIHdvcmQgY2xvdWQnLFxuICAgICAgZGVzY3JpcHRpb246ICdVcGRhdGUgb3B0aW9ucyBmb3IgdGhpcyBlbWJlZGRlZCBjbG91ZCB3aXRob3V0IGVkaXRpbmcgbWFya2Rvd24gbWFudWFsbHkuJyxcbiAgICAgIHN1Ym1pdEJ1dHRvblRleHQ6ICdTYXZlJyxcbiAgICAgIGluaXRpYWxTdGF0ZToge1xuICAgICAgICBtb2RlOiBvcHRpb25zLm1vZGUsXG4gICAgICAgIGZpbGVQYXRoOiBvcHRpb25zLmZpbGVQYXRoID8/ICcnLFxuICAgICAgICB0YWdzUmF3OiBvcHRpb25zLnRhZ3Muam9pbignLCAnKSxcbiAgICAgICAgbWF0Y2g6IG9wdGlvbnMubWF0Y2gsXG4gICAgICAgIGhlaWdodDogb3B0aW9ucy5oZWlnaHQsXG4gICAgICAgIGludGVyYWN0aW9uczogb3B0aW9ucy5pbnRlcmFjdGlvbnMsXG4gICAgICB9LFxuICAgIH0sXG4gICkub3BlbigpO1xufVxuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVFbWJlZGRlZENvZGVCbG9jayhcbiAgcGx1Z2luOiBQbHVnaW4sXG4gIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCxcbiAgaG9zdEVsOiBIVE1MRWxlbWVudCxcbiAgZW1iZWRCbG9jazogc3RyaW5nLFxuKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIGNvbnN0IHNvdXJjZUZpbGUgPSByZXNvbHZlQ3VycmVudEZpbGUocGx1Z2luLCBjdHgpO1xuICBpZiAoIXNvdXJjZUZpbGUpIHtcbiAgICBuZXcgTm90aWNlKCdDb3VsZCBub3QgbG9jYXRlIHRoZSBzb3VyY2Ugbm90ZSBmb3IgdGhpcyBlbWJlZGRlZCB3b3JkIGNsb3VkLicpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHNlY3Rpb24gPSBjdHguZ2V0U2VjdGlvbkluZm8oaG9zdEVsKTtcbiAgaWYgKCFzZWN0aW9uKSB7XG4gICAgbmV3IE5vdGljZSgnQ291bGQgbm90IGxvY2F0ZSB0aGUgZW1iZWRkZWQgd29yZCBjbG91ZCBibG9jayB0byB1cGRhdGUuJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXdhaXQgcGx1Z2luLmFwcC52YXVsdC5wcm9jZXNzKHNvdXJjZUZpbGUsIChjb250ZW50KSA9PiByZXBsYWNlU2VjdGlvbldpdGhCbG9jayhjb250ZW50LCBzZWN0aW9uLmxpbmVTdGFydCwgc2VjdGlvbi5saW5lRW5kLCBlbWJlZEJsb2NrKSk7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlU2VjdGlvbldpdGhCbG9jayhjb250ZW50OiBzdHJpbmcsIGxpbmVTdGFydDogbnVtYmVyLCBsaW5lRW5kOiBudW1iZXIsIGVtYmVkQmxvY2s6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XG4gIGlmIChsaW5lU3RhcnQgPCAwIHx8IGxpbmVFbmQgPCBsaW5lU3RhcnQgfHwgbGluZVN0YXJ0ID49IGxpbmVzLmxlbmd0aCkge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgY29uc3QgcmVwbGFjZW1lbnRMaW5lcyA9IGVtYmVkQmxvY2sucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG4gIGNvbnN0IGJlZm9yZSA9IGxpbmVzLnNsaWNlKDAsIGxpbmVTdGFydCk7XG4gIGNvbnN0IGFmdGVyID0gbGluZXMuc2xpY2UobGluZUVuZCArIDEpO1xuICByZXR1cm4gWy4uLmJlZm9yZSwgLi4ucmVwbGFjZW1lbnRMaW5lcywgLi4uYWZ0ZXJdLmpvaW4oJ1xcbicpO1xufVxuIiwgImltcG9ydCB7IEFwcCwgQnV0dG9uQ29tcG9uZW50LCBNb2RhbCwgTm90aWNlLCBTZXR0aW5nLCB0eXBlIFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHR5cGUgeyBUYWdNYXRjaE1vZGUsIFdvcmRDbG91ZFNlcnZpY2VzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgdHlwZSBFbWJlZE1vZGUgPSAnY3VycmVudC1maWxlJyB8ICdzcGVjaWZpYy1maWxlJyB8ICd0YWctYmFzZWQnO1xuXG5leHBvcnQgdHlwZSBFbWJlZFdpemFyZFN0YXRlID0ge1xuICBtb2RlOiBFbWJlZE1vZGU7XG4gIGZpbGVQYXRoOiBzdHJpbmc7XG4gIHRhZ3NSYXc6IHN0cmluZztcbiAgbWF0Y2g6IFRhZ01hdGNoTW9kZTtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGludGVyYWN0aW9uczogYm9vbGVhbjtcbn07XG5cbnR5cGUgRW1iZWRXb3JkQ2xvdWRNb2RhbE9wdGlvbnMgPSB7XG4gIHRpdGxlPzogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgc3VibWl0QnV0dG9uVGV4dD86IHN0cmluZztcbiAgaW5pdGlhbFN0YXRlPzogUGFydGlhbDxFbWJlZFdpemFyZFN0YXRlPjtcbn07XG5cbmNvbnN0IERFRkFVTFRfU1RBVEU6IEVtYmVkV2l6YXJkU3RhdGUgPSB7XG4gIG1vZGU6ICdjdXJyZW50LWZpbGUnLFxuICBmaWxlUGF0aDogJycsXG4gIHRhZ3NSYXc6ICcnLFxuICBtYXRjaDogJ2FueScsXG4gIGhlaWdodDogMzIwLFxuICBpbnRlcmFjdGlvbnM6IHRydWUsXG59O1xuXG5leHBvcnQgY2xhc3MgRW1iZWRXb3JkQ2xvdWRNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSByZWFkb25seSBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXM7XG4gIHByaXZhdGUgcmVhZG9ubHkgb25JbnNlcnQ6IChlbWJlZEJsb2NrOiBzdHJpbmcpID0+IGJvb2xlYW4gfCBQcm9taXNlPGJvb2xlYW4+O1xuICBwcml2YXRlIHJlYWRvbmx5IHN0YXRlOiBFbWJlZFdpemFyZFN0YXRlO1xuICBwcml2YXRlIHJlYWRvbmx5IHRpdGxlOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgZGVzY3JpcHRpb246IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBzdWJtaXRCdXR0b25UZXh0OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBtb2RlV3JhcHBlckVsITogSFRNTERpdkVsZW1lbnQ7XG4gIHByaXZhdGUgZmlsZVdyYXBwZXJFbCE6IEhUTUxEaXZFbGVtZW50O1xuICBwcml2YXRlIHRhZ3NXcmFwcGVyRWwhOiBIVE1MRGl2RWxlbWVudDtcbiAgcHJpdmF0ZSBtYXRjaFdyYXBwZXJFbCE6IEhUTUxEaXZFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGFwcDogQXBwLFxuICAgIHNlcnZpY2VzOiBXb3JkQ2xvdWRTZXJ2aWNlcyxcbiAgICBvbkluc2VydDogKGVtYmVkQmxvY2s6IHN0cmluZykgPT4gYm9vbGVhbiB8IFByb21pc2U8Ym9vbGVhbj4sXG4gICAgb3B0aW9uczogRW1iZWRXb3JkQ2xvdWRNb2RhbE9wdGlvbnMgPSB7fSxcbiAgKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICB0aGlzLnNlcnZpY2VzID0gc2VydmljZXM7XG4gICAgdGhpcy5vbkluc2VydCA9IG9uSW5zZXJ0O1xuICAgIHRoaXMudGl0bGUgPSBvcHRpb25zLnRpdGxlID8/ICdFbWJlZCB3b3JkIGNsb3VkIGluIGRvY3VtZW50JztcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvbiA/PyAnQ29uZmlndXJlIG9wdGlvbnMsIHRoZW4gaW5zZXJ0IGEgd29yZCBjbG91ZCBlbWJlZCBhdCB5b3VyIGN1cnNvci4nO1xuICAgIHRoaXMuc3VibWl0QnV0dG9uVGV4dCA9IG9wdGlvbnMuc3VibWl0QnV0dG9uVGV4dCA/PyAnSW5zZXJ0JztcblxuICAgIGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLnNlcnZpY2VzLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBpbml0aWFsU3RhdGUgPSBvcHRpb25zLmluaXRpYWxTdGF0ZSA/PyB7fTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgLi4uREVGQVVMVF9TVEFURSxcbiAgICAgIGZpbGVQYXRoOiBhY3RpdmVGaWxlPy5wYXRoID8/ICcnLFxuICAgICAgLi4uaW5pdGlhbFN0YXRlLFxuICAgIH07XG4gIH1cblxuICBvbk9wZW4oKTogdm9pZCB7XG4gICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG4gICAgY29udGVudEVsLmVtcHR5KCk7XG4gICAgY29udGVudEVsLmFkZENsYXNzKCd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZCcpO1xuXG4gICAgY29udGVudEVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogdGhpcy50aXRsZSB9KTtcbiAgICBjb250ZW50RWwuY3JlYXRlRWwoJ3AnLCB7XG4gICAgICBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1kZXNjcmlwdGlvbicsXG4gICAgICB0ZXh0OiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgIH0pO1xuXG4gICAgdGhpcy5tb2RlV3JhcHBlckVsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLXNlY3Rpb24nIH0pO1xuICAgIHRoaXMuZmlsZVdyYXBwZXJFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1zZWN0aW9uJyB9KTtcbiAgICB0aGlzLnRhZ3NXcmFwcGVyRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtc2VjdGlvbicgfSk7XG4gICAgdGhpcy5tYXRjaFdyYXBwZXJFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1zZWN0aW9uJyB9KTtcblxuICAgIG5ldyBTZXR0aW5nKHRoaXMubW9kZVdyYXBwZXJFbClcbiAgICAgIC5zZXROYW1lKCdTb3VyY2UnKVxuICAgICAgLnNldERlc2MoJ0Nob29zZSB3aGVyZSB0aGlzIGVtYmVkZGVkIGNsb3VkIHB1bGxzIHdvcmRzIGZyb20uJylcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9uKCdjdXJyZW50LWZpbGUnLCAnQ3VycmVudCBub3RlJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdzcGVjaWZpYy1maWxlJywgJ1NwZWNpZmljIG5vdGUnKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ3RhZy1iYXNlZCcsICdWYXVsdCBmaWx0ZXJlZCBieSB0YWdzJylcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zdGF0ZS5tb2RlKVxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubW9kZSA9IHZhbHVlID09PSAnc3BlY2lmaWMtZmlsZScgfHwgdmFsdWUgPT09ICd0YWctYmFzZWQnID8gdmFsdWUgOiAnY3VycmVudC1maWxlJztcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbmRpdGlvbmFsU2VjdGlvbnMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJGaWxlU2V0dGluZygpO1xuICAgIHRoaXMucmVuZGVyVGFnU2V0dGluZygpO1xuICAgIHRoaXMucmVuZGVyTWF0Y2hTZXR0aW5nKCk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250ZW50RWwpXG4gICAgICAuc2V0TmFtZSgnSGVpZ2h0JylcbiAgICAgIC5zZXREZXNjKCdIZWlnaHQgb2YgdGhlIGVtYmVkZGVkIGNsb3VkIGluIHBpeGVscy4nKVxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG4gICAgICAgIHNsaWRlclxuICAgICAgICAgIC5zZXRMaW1pdHMoMTgwLCA5MDAsIDEwKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnN0YXRlLmhlaWdodClcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuaGVpZ2h0ID0gdmFsdWU7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRlbnRFbClcbiAgICAgIC5zZXROYW1lKCdFbmFibGUgaW50ZXJhY3Rpb25zJylcbiAgICAgIC5zZXREZXNjKCdBbGxvdyB6b29tLCBwYW4sIGFuZCBjbGljay10by1zZWFyY2ggaW50ZXJhY3Rpb25zLicpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMuc3RhdGUuaW50ZXJhY3Rpb25zKVxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuaW50ZXJhY3Rpb25zID0gdmFsdWU7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIGNvbnN0IGJ1dHRvblJvd0VsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLWFjdGlvbnMnIH0pO1xuXG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gbmV3IEJ1dHRvbkNvbXBvbmVudChidXR0b25Sb3dFbClcbiAgICAgIC5zZXRCdXR0b25UZXh0KCdDYW5jZWwnKVxuICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgICBjYW5jZWxCdXR0b24uYnV0dG9uRWwudHlwZSA9ICdidXR0b24nO1xuXG4gICAgY29uc3QgaW5zZXJ0QnV0dG9uID0gbmV3IEJ1dHRvbkNvbXBvbmVudChidXR0b25Sb3dFbClcbiAgICAgIC5zZXRCdXR0b25UZXh0KHRoaXMuc3VibWl0QnV0dG9uVGV4dClcbiAgICAgIC5zZXRDdGEoKVxuICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnc3BlY2lmaWMtZmlsZScgJiYgIXRoaXMuc3RhdGUuZmlsZVBhdGgpIHtcbiAgICAgICAgICBuZXcgTm90aWNlKCdTZWxlY3QgYW4gb3BlbiBtYXJrZG93biBub3RlIGJlZm9yZSBpbnNlcnRpbmcuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5zZXJ0QnV0dG9uLnNldERpc2FibGVkKHRydWUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHdhc0luc2VydGVkID0gYXdhaXQgdGhpcy5vbkluc2VydCh0aGlzLmJ1aWxkRW1iZWRCbG9jaygpKTtcbiAgICAgICAgICBpZiAod2FzSW5zZXJ0ZWQgJiYgdGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignV29yZCBjbG91ZHM6IGZhaWxlZCB0byBhcHBseSBlbWJlZCBjaGFuZ2VzJywgZXJyb3IpO1xuICAgICAgICAgIG5ldyBOb3RpY2UoJ0NvdWxkIG5vdCBhcHBseSB3b3JkIGNsb3VkIGNoYW5nZXMuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc2VydEJ1dHRvbi5idXR0b25FbC5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgIGluc2VydEJ1dHRvbi5zZXREaXNhYmxlZChmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIGluc2VydEJ1dHRvbi5idXR0b25FbC50eXBlID0gJ2J1dHRvbic7XG5cbiAgICB0aGlzLnJlZnJlc2hDb25kaXRpb25hbFNlY3Rpb25zKCk7XG4gIH1cblxuICBvbkNsb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckZpbGVTZXR0aW5nKCk6IHZvaWQge1xuICAgIHRoaXMuZmlsZVdyYXBwZXJFbC5lbXB0eSgpO1xuXG4gICAgbmV3IFNldHRpbmcodGhpcy5maWxlV3JhcHBlckVsKVxuICAgICAgLnNldE5hbWUoJ1NwZWNpZmljIG5vdGUnKVxuICAgICAgLnNldERlc2MoJ1VzZSBvbmUgb3BlbiBub3RlIGFzIHRoZSBzb3VyY2UgZm9yIHRoaXMgZW1iZWRkZWQgY2xvdWQuJylcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgY29uc3Qgb3BlbkZpbGVzID0gdGhpcy5zZXJ2aWNlcy5nZXRPcGVuTWFya2Rvd25GaWxlcygpO1xuICAgICAgICBjb25zdCBzZWxlY3RlZFBhdGggPSB0aGlzLnJlc29sdmVTZWxlY3RlZFBhdGgob3BlbkZpbGVzLCB0aGlzLnN0YXRlLmZpbGVQYXRoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2Ygb3BlbkZpbGVzKSB7XG4gICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKGZpbGUucGF0aCwgZmlsZS5wYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcGVuRmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCcnLCAnTm8gb3BlbiBtYXJrZG93biBub3RlcycpO1xuICAgICAgICAgIGRyb3Bkb3duLnNldERpc2FibGVkKHRydWUpO1xuICAgICAgICAgIHRoaXMuc3RhdGUuZmlsZVBhdGggPSAnJztcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YXRlLmZpbGVQYXRoID0gc2VsZWN0ZWRQYXRoO1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5zZXRWYWx1ZShzZWxlY3RlZFBhdGgpXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5maWxlUGF0aCA9IHZhbHVlO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclRhZ1NldHRpbmcoKTogdm9pZCB7XG4gICAgdGhpcy50YWdzV3JhcHBlckVsLmVtcHR5KCk7XG5cbiAgICBjb25zdCBhdmFpbGFibGVUYWdzID0gdGhpcy5zZXJ2aWNlcy5nZXRBdmFpbGFibGVUYWdzKCk7XG4gICAgY29uc3QgdGFnSGludCA9IGF2YWlsYWJsZVRhZ3MubGVuZ3RoID4gMFxuICAgICAgPyBgQXZhaWxhYmxlOiAke2F2YWlsYWJsZVRhZ3Muc2xpY2UoMCwgMTIpLmpvaW4oJywgJyl9JHthdmFpbGFibGVUYWdzLmxlbmd0aCA+IDEyID8gJ1x1MjAyNicgOiAnJ31gXG4gICAgICA6ICdObyB0YWdzIGRldGVjdGVkIHlldC4nO1xuXG4gICAgbmV3IFNldHRpbmcodGhpcy50YWdzV3JhcHBlckVsKVxuICAgICAgLnNldE5hbWUoJ1RhZ3MnKVxuICAgICAgLnNldERlc2MoYE9wdGlvbmFsIGNvbW1hLXNlcGFyYXRlZCB0YWdzLiAke3RhZ0hpbnR9YClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB7XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJyNwcm9qZWN0LCAjbWVldGluZycpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMuc3RhdGUudGFnc1JhdylcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnRhZ3NSYXcgPSB2YWx1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJNYXRjaFNldHRpbmcoKTogdm9pZCB7XG4gICAgdGhpcy5tYXRjaFdyYXBwZXJFbC5lbXB0eSgpO1xuXG4gICAgbmV3IFNldHRpbmcodGhpcy5tYXRjaFdyYXBwZXJFbClcbiAgICAgIC5zZXROYW1lKCdUYWcgbWF0Y2ggbW9kZScpXG4gICAgICAuc2V0RGVzYygnV2hlbiBtdWx0aXBsZSB0YWdzIGFyZSBzZXQsIG1hdGNoIGFueSBvciBhbGwgb2YgdGhlbS4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ2FueScsICdBbnkgdGFnJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdhbGwnLCAnQWxsIHRhZ3MnKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnN0YXRlLm1hdGNoKVxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubWF0Y2ggPSB2YWx1ZSA9PT0gJ2FsbCcgPyAnYWxsJyA6ICdhbnknO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVTZWxlY3RlZFBhdGgoZmlsZXM6IFRGaWxlW10sIHByZWZlcnJlZFBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHByZWZlcnJlZFBhdGggJiYgZmlsZXMuc29tZSgoZmlsZSkgPT4gZmlsZS5wYXRoID09PSBwcmVmZXJyZWRQYXRoKSkge1xuICAgICAgcmV0dXJuIHByZWZlcnJlZFBhdGg7XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlRmlsZSA9IHRoaXMuc2VydmljZXMuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmIChhY3RpdmVGaWxlICYmIGZpbGVzLnNvbWUoKGZpbGUpID0+IGZpbGUucGF0aCA9PT0gYWN0aXZlRmlsZS5wYXRoKSkge1xuICAgICAgcmV0dXJuIGFjdGl2ZUZpbGUucGF0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsZXNbMF0/LnBhdGggPz8gJyc7XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hDb25kaXRpb25hbFNlY3Rpb25zKCk6IHZvaWQge1xuICAgIGNvbnN0IGlzU3BlY2lmaWMgPSB0aGlzLnN0YXRlLm1vZGUgPT09ICdzcGVjaWZpYy1maWxlJztcbiAgICBjb25zdCBpc1RhZ0Jhc2VkID0gdGhpcy5zdGF0ZS5tb2RlID09PSAndGFnLWJhc2VkJztcblxuICAgIHRoaXMuZmlsZVdyYXBwZXJFbC50b2dnbGVDbGFzcygnaXMtaGlkZGVuJywgIWlzU3BlY2lmaWMpO1xuICAgIHRoaXMudGFnc1dyYXBwZXJFbC50b2dnbGVDbGFzcygnaXMtaGlkZGVuJywgIWlzVGFnQmFzZWQpO1xuICAgIHRoaXMubWF0Y2hXcmFwcGVyRWwudG9nZ2xlQ2xhc3MoJ2lzLWhpZGRlbicsICFpc1RhZ0Jhc2VkKTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRFbWJlZEJsb2NrKCk6IHN0cmluZyB7XG4gICAgY29uc3QgbGluZXMgPSBbJ2BgYHdvcmRjbG91ZCcsIGBtb2RlOiAke3RoaXMuc3RhdGUubW9kZX1gXTtcblxuICAgIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdzcGVjaWZpYy1maWxlJyAmJiB0aGlzLnN0YXRlLmZpbGVQYXRoKSB7XG4gICAgICBsaW5lcy5wdXNoKGBmaWxlOiAke3RoaXMuc3RhdGUuZmlsZVBhdGh9YCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ3RhZy1iYXNlZCcpIHtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRUYWdzID0gdGhpcy5zdGF0ZS50YWdzUmF3XG4gICAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAgIC5tYXAoKHRhZykgPT4gdGFnLnRyaW0oKSlcbiAgICAgICAgLmZpbHRlcigodGFnKSA9PiB0YWcubGVuZ3RoID4gMCk7XG4gICAgICBpZiAobm9ybWFsaXplZFRhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICBsaW5lcy5wdXNoKGB0YWdzOiAke25vcm1hbGl6ZWRUYWdzLmpvaW4oJywgJyl9YCk7XG4gICAgICB9XG4gICAgICBsaW5lcy5wdXNoKGBtYXRjaDogJHt0aGlzLnN0YXRlLm1hdGNofWApO1xuICAgIH1cblxuICAgIGxpbmVzLnB1c2goYGhlaWdodDogJHt0aGlzLnN0YXRlLmhlaWdodH1gKTtcbiAgICBsaW5lcy5wdXNoKGBpbnRlcmFjdGlvbnM6ICR7dGhpcy5zdGF0ZS5pbnRlcmFjdGlvbnMgPyAndHJ1ZScgOiAnZmFsc2UnfWApO1xuICAgIGxpbmVzLnB1c2goJ2BgYCcpO1xuXG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICB9XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVRhZyh0YWc6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSB0YWcudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmICghdHJpbW1lZCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJldHVybiB0cmltbWVkLnN0YXJ0c1dpdGgoJyMnKSA/IHRyaW1tZWQgOiBgIyR7dHJpbW1lZH1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlRm9yU2VhcmNoKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWUucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRNdWx0aVZhbHVlcyhzZWxlY3RFbDogSFRNTFNlbGVjdEVsZW1lbnQpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBBcnJheS5mcm9tKHNlbGVjdEVsLnNlbGVjdGVkT3B0aW9ucykubWFwKChvcHRpb24pID0+IG9wdGlvbi52YWx1ZSk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IFNlYXJjaE9wdGlvbnMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBlc2NhcGVGb3JTZWFyY2gsIG5vcm1hbGl6ZVRhZyB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5TZWFyY2hGb3JXb3JkKGFwcDogQXBwLCB3b3JkOiBzdHJpbmcsIG9wdGlvbnM6IFNlYXJjaE9wdGlvbnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBbYFwiJHtlc2NhcGVGb3JTZWFyY2god29yZCl9XCJgXTtcblxuICBpZiAob3B0aW9ucy5maWxlUGF0aCkge1xuICAgIHBhcnRzLnB1c2goYHBhdGg6XCIke2VzY2FwZUZvclNlYXJjaChvcHRpb25zLmZpbGVQYXRoKX1cImApO1xuICB9XG5cbiAgY29uc3QgdGFncyA9IChvcHRpb25zLnRhZ3MgPz8gW10pXG4gICAgLm1hcCgodGFnKSA9PiBub3JtYWxpemVUYWcodGFnKSlcbiAgICAuZmlsdGVyKCh0YWcpID0+IHRhZy5sZW5ndGggPiAwKTtcblxuICBpZiAodGFncy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKG9wdGlvbnMudGFnTWF0Y2hNb2RlID09PSAnYWxsJykge1xuICAgICAgZm9yIChjb25zdCB0YWcgb2YgdGFncykge1xuICAgICAgICBwYXJ0cy5wdXNoKHRhZyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnRzLnB1c2goYCgke3RhZ3Muam9pbignIE9SICcpfSlgKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBxdWVyeSA9IHBhcnRzLmpvaW4oJyAnKTtcbiAgY29uc3QgZXhpc3RpbmdTZWFyY2hMZWFmID0gYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ3NlYXJjaCcpWzBdO1xuICBjb25zdCBzZWFyY2hMZWFmID0gZXhpc3RpbmdTZWFyY2hMZWFmID8/IGFwcC53b3Jrc3BhY2UuZ2V0UmlnaHRMZWFmKGZhbHNlKSA/PyBhcHAud29ya3NwYWNlLmdldExlYWYodHJ1ZSk7XG5cbiAgaWYgKCFzZWFyY2hMZWFmKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYXdhaXQgc2VhcmNoTGVhZi5zZXRWaWV3U3RhdGUoe1xuICAgIHR5cGU6ICdzZWFyY2gnLFxuICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICBzdGF0ZToge1xuICAgICAgcXVlcnksXG4gICAgfSxcbiAgfSk7XG5cbiAgYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKHNlYXJjaExlYWYpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IG5vcm1hbGl6ZVRhZyB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgUGlwZWxpbmVEb2N1bWVudCB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRQaXBlbGluZURvY3VtZW50cyhcbiAgYXBwOiBBcHAsXG4gIGZpbGVzOiBURmlsZVtdLFxuICByZWFkQmF0Y2hTaXplOiBudW1iZXIsXG4gIG9uUHJvZ3Jlc3M/OiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQsXG4pOiBQcm9taXNlPFBpcGVsaW5lRG9jdW1lbnRbXT4ge1xuICBjb25zdCBkb2N1bWVudHM6IFBpcGVsaW5lRG9jdW1lbnRbXSA9IFtdO1xuICBjb25zdCB0b3RhbEZpbGVzID0gTWF0aC5tYXgoMSwgZmlsZXMubGVuZ3RoKTtcblxuICBmb3IgKGxldCBiYXRjaFN0YXJ0ID0gMDsgYmF0Y2hTdGFydCA8IGZpbGVzLmxlbmd0aDsgYmF0Y2hTdGFydCArPSByZWFkQmF0Y2hTaXplKSB7XG4gICAgY29uc3QgYmF0Y2ggPSBmaWxlcy5zbGljZShiYXRjaFN0YXJ0LCBiYXRjaFN0YXJ0ICsgcmVhZEJhdGNoU2l6ZSk7XG4gICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBQcm9taXNlLmFsbChiYXRjaC5tYXAoKGZpbGUpID0+IGFwcC52YXVsdC5jYWNoZWRSZWFkKGZpbGUpKSk7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYmF0Y2gubGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgICBjb25zdCBmaWxlID0gYmF0Y2hbaW5kZXhdO1xuICAgICAgY29uc3QgcmF3VGV4dCA9IGNvbnRlbnRzW2luZGV4XTtcbiAgICAgIGNvbnN0IHRhZ3MgPSBnZXRGaWxlVGFncyhhcHAsIGZpbGUpO1xuICAgICAgY29uc3QgZmlsZUluZGV4ID0gYmF0Y2hTdGFydCArIGluZGV4O1xuXG4gICAgICBvblByb2dyZXNzPy4oYFNjYW5uaW5nICR7ZmlsZUluZGV4ICsgMX0vJHtmaWxlcy5sZW5ndGh9IGZpbGVzLi4uYCwgTWF0aC5yb3VuZCgoZmlsZUluZGV4IC8gdG90YWxGaWxlcykgKiA3NSkpO1xuXG4gICAgICBkb2N1bWVudHMucHVzaCh7XG4gICAgICAgIGlkOiBmaWxlLnBhdGgsXG4gICAgICAgIHBhdGg6IGZpbGUucGF0aCxcbiAgICAgICAgYmFzZW5hbWU6IGZpbGUuYmFzZW5hbWUsXG4gICAgICAgIHJhd1RleHQsXG4gICAgICAgIHRhZ3MsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZG9jdW1lbnRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsZVRhZ3MoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogc3RyaW5nW10ge1xuICBjb25zdCBjYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcbiAgaWYgKCFjYWNoZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHRhZ1NldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIGlmIChjYWNoZS50YWdzKSB7XG4gICAgZm9yIChjb25zdCB0YWdFbnRyeSBvZiBjYWNoZS50YWdzKSB7XG4gICAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplVGFnKHRhZ0VudHJ5LnRhZyk7XG4gICAgICBpZiAobm9ybWFsaXplZCkge1xuICAgICAgICB0YWdTZXQuYWRkKG5vcm1hbGl6ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgdGFnIG9mIGV4dHJhY3RGcm9udG1hdHRlclRhZ3MoY2FjaGUuZnJvbnRtYXR0ZXIpKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVRhZyh0YWcpO1xuICAgIGlmIChub3JtYWxpemVkKSB7XG4gICAgICB0YWdTZXQuYWRkKG5vcm1hbGl6ZWQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbLi4udGFnU2V0XTtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdEZyb250bWF0dGVyVGFncyhmcm9udG1hdHRlcjogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nW10ge1xuICBpZiAoIWZyb250bWF0dGVyIHx8IHR5cGVvZiBmcm9udG1hdHRlciAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCByYXdUYWdzID0gZnJvbnRtYXR0ZXIudGFncyA/PyBmcm9udG1hdHRlci50YWc7XG4gIGlmICh0eXBlb2YgcmF3VGFncyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcmF3VGFncy5zcGxpdCgvW1xccyxdKy8pLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkocmF3VGFncykpIHtcbiAgICByZXR1cm4gcmF3VGFnc1xuICAgICAgLmZpbHRlcigoZW50cnkpOiBlbnRyeSBpcyBzdHJpbmcgPT4gdHlwZW9mIGVudHJ5ID09PSAnc3RyaW5nJylcbiAgICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS50cmltKCkpXG4gICAgICAuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkubGVuZ3RoID4gMCk7XG4gIH1cblxuICByZXR1cm4gW107XG59XG4iLCAiaW1wb3J0IHsgTUFYX1dPUkRTLCBNSU5fV09SRF9MRU5HVEggfSBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUgeyBSZW5kZXJTZXR0aW5ncywgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHR5cGUge1xuICBBZ2dyZWdhdGVSZXN1bHQsXG4gIEFnZ3JlZ2F0b3JTdHJhdGVneSxcbiAgRGlzdHJpYnV0aW9uQnVja2V0LFxuICBGaWx0ZXJTdHJhdGVneSxcbiAgUGlwZWxpbmVTdHJhdGVnaWVzLFxuICBSZW5kZXJNb2RlbCxcbiAgUmVuZGVyTW9kZWxTdHJhdGVneSxcbiAgU2NhbGluZ1N0cmF0ZWd5LFxuICBUb2tlbixcbiAgVG9rZW5pemVyU3RyYXRlZ3ksXG59IGZyb20gJy4uL3R5cGVzJztcblxuY29uc3QgZGVmYXVsdFRva2VuaXplcjogVG9rZW5pemVyU3RyYXRlZ3kgPSB7XG4gIHRva2VuaXplKHRleHQ6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGV4dC5tYXRjaCgvW2EtejAtOV1bYS16MC05Jy1dKi9nKSA/PyBbXTtcbiAgfSxcbn07XG5cbmNvbnN0IGRlZmF1bHRGaWx0ZXI6IEZpbHRlclN0cmF0ZWd5ID0ge1xuICBpbmNsdWRlVG9rZW4odG9rZW46IHN0cmluZywgc3RvcFdvcmRzOiBTZXQ8c3RyaW5nPik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB0b2tlbi50cmltKCk7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQubGVuZ3RoID49IE1JTl9XT1JEX0xFTkdUSCAmJiAhc3RvcFdvcmRzLmhhcyhub3JtYWxpemVkKTtcbiAgfSxcbn07XG5cbmNvbnN0IGRlZmF1bHRBZ2dyZWdhdG9yOiBBZ2dyZWdhdG9yU3RyYXRlZ3kgPSB7XG4gIGFnZ3JlZ2F0ZSh0b2tlbnM6IFRva2VuW10pOiBBZ2dyZWdhdGVSZXN1bHQge1xuICAgIGNvbnN0IGNvdW50cyA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG5cbiAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRva2Vucykge1xuICAgICAgY291bnRzLnNldCh0b2tlbi52YWx1ZSwgKGNvdW50cy5nZXQodG9rZW4udmFsdWUpID8/IDApICsgMSk7XG4gICAgfVxuXG4gICAgY29uc3QgZW50cmllcyA9IFsuLi5jb3VudHMuZW50cmllcygpXVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGJbMV0gLSBhWzFdKVxuICAgICAgLnNsaWNlKDAsIE1BWF9XT1JEUyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZW50cmllcyxcbiAgICAgIHRvdGFsVG9rZW5zOiB0b2tlbnMubGVuZ3RoLFxuICAgICAgZGlzdGluY3RUb2tlbnM6IGNvdW50cy5zaXplLFxuICAgIH07XG4gIH0sXG59O1xuXG5jb25zdCBkZWZhdWx0U2NhbGluZzogU2NhbGluZ1N0cmF0ZWd5ID0ge1xuICBzY2FsZShlbnRyaWVzOiBBcnJheTxbc3RyaW5nLCBudW1iZXJdPiwgcmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzKTogV2VpZ2h0ZWRXb3JkW10ge1xuICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IG1pbkZvbnRTaXplID0gTWF0aC5tYXgoOCwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy5taW5Gb250U2l6ZSkpO1xuICAgIGNvbnN0IG1heEZvbnRTaXplID0gTWF0aC5tYXgobWluRm9udFNpemUgKyAxLCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLm1heEZvbnRTaXplKSk7XG4gICAgY29uc3QgZW1waGFzaXMgPSBNYXRoLm1heCgwLjUsIE1hdGgubWluKDMsIHJlbmRlclNldHRpbmdzLmVtcGhhc2lzKSk7XG5cbiAgICBjb25zdCBub3JtYWxpemVkRW50cmllcyA9IGVudHJpZXNcbiAgICAgIC5tYXAoKFt0ZXh0LCBjb3VudF0sIGluZGV4KSA9PiAoe1xuICAgICAgICB0ZXh0LFxuICAgICAgICBjb3VudCxcbiAgICAgICAgaW5kZXgsXG4gICAgICAgIHNjb3JlOiBjb21wdXRlU2NhbGVTY29yZShjb3VudCwgaW5kZXgsIGVudHJpZXMsIHJlbmRlclNldHRpbmdzLCBlbXBoYXNpcyksXG4gICAgICB9KSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBiLmNvdW50IC0gYS5jb3VudCB8fCBhLmluZGV4IC0gYi5pbmRleCk7XG5cbiAgICByZXR1cm4gbm9ybWFsaXplZEVudHJpZXMubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgIHRleHQ6IGVudHJ5LnRleHQsXG4gICAgICBjb3VudDogZW50cnkuY291bnQsXG4gICAgICBzaXplOiBNYXRoLnJvdW5kKG1pbkZvbnRTaXplICsgZW50cnkuc2NvcmUgKiAobWF4Rm9udFNpemUgLSBtaW5Gb250U2l6ZSkpLFxuICAgIH0pKTtcbiAgfSxcbn07XG5cbmNvbnN0IGRlZmF1bHRSZW5kZXJNb2RlbDogUmVuZGVyTW9kZWxTdHJhdGVneSA9IHtcbiAgYnVpbGRNb2RlbCh3b3JkczogV2VpZ2h0ZWRXb3JkW10sIGFnZ3JlZ2F0ZTogQWdncmVnYXRlUmVzdWx0KTogUmVuZGVyTW9kZWwge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkQ2xvdWRXb3Jkczogd29yZHMsXG4gICAgICBkaXN0cmlidXRpb25TZXJpZXM6IGJ1aWxkRGlzdHJpYnV0aW9uU2VyaWVzKHdvcmRzKSxcbiAgICAgIHRvdGFsVG9rZW5zOiBhZ2dyZWdhdGUudG90YWxUb2tlbnMsXG4gICAgICBkaXN0aW5jdFRva2VuczogYWdncmVnYXRlLmRpc3RpbmN0VG9rZW5zLFxuICAgIH07XG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9QSVBFTElORV9TVFJBVEVHSUVTOiBQaXBlbGluZVN0cmF0ZWdpZXMgPSB7XG4gIHRva2VuaXplcjogZGVmYXVsdFRva2VuaXplcixcbiAgZmlsdGVyOiBkZWZhdWx0RmlsdGVyLFxuICBhZ2dyZWdhdG9yOiBkZWZhdWx0QWdncmVnYXRvcixcbiAgc2NhbGluZzogZGVmYXVsdFNjYWxpbmcsXG4gIHJlbmRlck1vZGVsOiBkZWZhdWx0UmVuZGVyTW9kZWwsXG59O1xuXG5mdW5jdGlvbiBjb21wdXRlU2NhbGVTY29yZShcbiAgY291bnQ6IG51bWJlcixcbiAgaW5kZXg6IG51bWJlcixcbiAgZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sXG4gIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyxcbiAgZW1waGFzaXM6IG51bWJlcixcbik6IG51bWJlciB7XG4gIGNvbnN0IGNvdW50cyA9IGVudHJpZXMubWFwKChbLCBlbnRyeUNvdW50XSkgPT4gZW50cnlDb3VudCk7XG4gIGNvbnN0IG1pbkNvdW50ID0gY291bnRzW2NvdW50cy5sZW5ndGggLSAxXTtcbiAgY29uc3QgbWF4Q291bnQgPSBjb3VudHNbMF07XG5cbiAgaWYgKG1heENvdW50IDw9IG1pbkNvdW50KSB7XG4gICAgcmV0dXJuIDAuNTtcbiAgfVxuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5zY2FsaW5nTW9kZSA9PT0gJ3JhbmsnKSB7XG4gICAgaWYgKGVudHJpZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gMC41O1xuICAgIH1cbiAgICByZXR1cm4gMSAtIGluZGV4IC8gKGVudHJpZXMubGVuZ3RoIC0gMSk7XG4gIH1cblxuICBpZiAocmVuZGVyU2V0dGluZ3Muc2NhbGluZ01vZGUgPT09ICdsb2cnKSB7XG4gICAgY29uc3Qgc2FmZU1pbiA9IE1hdGgubWF4KDEsIG1pbkNvdW50KTtcbiAgICBjb25zdCBzYWZlTWF4ID0gTWF0aC5tYXgoc2FmZU1pbiArIDEsIG1heENvdW50KTtcbiAgICBjb25zdCBudW1lcmF0b3IgPSBNYXRoLmxvZyhNYXRoLm1heCgxLCBjb3VudCkpIC0gTWF0aC5sb2coc2FmZU1pbik7XG4gICAgY29uc3QgZGVub21pbmF0b3IgPSBNYXRoLmxvZyhzYWZlTWF4KSAtIE1hdGgubG9nKHNhZmVNaW4pO1xuICAgIHJldHVybiBjbGFtcDAxKGRlbm9taW5hdG9yID09PSAwID8gMC41IDogbnVtZXJhdG9yIC8gZGVub21pbmF0b3IpO1xuICB9XG5cbiAgY29uc3QgbGluZWFyID0gKGNvdW50IC0gbWluQ291bnQpIC8gKG1heENvdW50IC0gbWluQ291bnQpO1xuICBpZiAocmVuZGVyU2V0dGluZ3Muc2NhbGluZ01vZGUgPT09ICdwb3dlcicpIHtcbiAgICByZXR1cm4gY2xhbXAwMShNYXRoLnBvdyhsaW5lYXIsIGVtcGhhc2lzKSk7XG4gIH1cblxuICByZXR1cm4gY2xhbXAwMShsaW5lYXIpO1xufVxuXG5mdW5jdGlvbiBjbGFtcDAxKHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgdmFsdWUpKTtcbn1cblxuZnVuY3Rpb24gYnVpbGREaXN0cmlidXRpb25TZXJpZXMod29yZHM6IFdlaWdodGVkV29yZFtdKTogRGlzdHJpYnV0aW9uQnVja2V0W10ge1xuICBpZiAod29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgbWF4Q291bnQgPSB3b3Jkc1swXT8uY291bnQgPz8gMDtcbiAgaWYgKG1heENvdW50IDw9IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBidWNrZXRDb3VudCA9IE1hdGgubWluKDgsIE1hdGgubWF4KDQsIE1hdGgucm91bmQoTWF0aC5zcXJ0KHdvcmRzLmxlbmd0aCkpKSk7XG4gIGNvbnN0IHdpZHRoID0gTWF0aC5tYXgoMSwgTWF0aC5jZWlsKG1heENvdW50IC8gYnVja2V0Q291bnQpKTtcbiAgY29uc3QgYnVja2V0cyA9IG5ldyBNYXA8bnVtYmVyLCBudW1iZXI+KCk7XG5cbiAgZm9yIChjb25zdCB3b3JkIG9mIHdvcmRzKSB7XG4gICAgY29uc3QgaW5kZXggPSBNYXRoLm1pbihidWNrZXRDb3VudCAtIDEsIE1hdGguZmxvb3IoKHdvcmQuY291bnQgLSAxKSAvIHdpZHRoKSk7XG4gICAgYnVja2V0cy5zZXQoaW5kZXgsIChidWNrZXRzLmdldChpbmRleCkgPz8gMCkgKyAxKTtcbiAgfVxuXG4gIGNvbnN0IGRpc3RyaWJ1dGlvbjogRGlzdHJpYnV0aW9uQnVja2V0W10gPSBbXTtcbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGJ1Y2tldENvdW50OyBpbmRleCArPSAxKSB7XG4gICAgY29uc3QgbWluID0gaW5kZXggKiB3aWR0aCArIDE7XG4gICAgY29uc3QgbWF4ID0gaW5kZXggPT09IGJ1Y2tldENvdW50IC0gMSA/IG1heENvdW50IDogKGluZGV4ICsgMSkgKiB3aWR0aDtcbiAgICBkaXN0cmlidXRpb24ucHVzaCh7XG4gICAgICBsYWJlbDogYCR7bWlufS0ke21heH1gLFxuICAgICAgbWluLFxuICAgICAgbWF4LFxuICAgICAgdmFsdWU6IGJ1Y2tldHMuZ2V0KGluZGV4KSA/PyAwLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGRpc3RyaWJ1dGlvbjtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFnZ3JlZ2F0ZVJlc3VsdCwgQWdncmVnYXRvclN0cmF0ZWd5LCBUb2tlbiB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFnZ3JlZ2F0ZVRva2Vucyh0b2tlbnM6IFRva2VuW10sIHN0cmF0ZWd5OiBBZ2dyZWdhdG9yU3RyYXRlZ3kpOiBBZ2dyZWdhdGVSZXN1bHQge1xuICByZXR1cm4gc3RyYXRlZ3kuYWdncmVnYXRlKHRva2Vucyk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBGaWx0ZXJTdHJhdGVneSwgVG9rZW4gfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJUb2tlbnModG9rZW5zOiBUb2tlbltdLCBzdG9wV29yZHM6IFNldDxzdHJpbmc+LCBzdHJhdGVneTogRmlsdGVyU3RyYXRlZ3kpOiBUb2tlbltdIHtcbiAgcmV0dXJuIHRva2Vucy5maWx0ZXIoKHRva2VuKSA9PiBzdHJhdGVneS5pbmNsdWRlVG9rZW4odG9rZW4udmFsdWUsIHN0b3BXb3JkcykpO1xufVxuIiwgImltcG9ydCB7IEZST05UTUFUVEVSX1BBVFRFUk4gfSBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUgeyBOb3JtYWxpemVkRG9jdW1lbnQsIFBpcGVsaW5lRG9jdW1lbnQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVEb2N1bWVudHMoZG9jdW1lbnRzOiBQaXBlbGluZURvY3VtZW50W10pOiBOb3JtYWxpemVkRG9jdW1lbnRbXSB7XG4gIHJldHVybiBkb2N1bWVudHMubWFwKChkb2N1bWVudCkgPT4gKHtcbiAgICBpZDogZG9jdW1lbnQuaWQsXG4gICAgcGF0aDogZG9jdW1lbnQucGF0aCxcbiAgICBiYXNlbmFtZTogZG9jdW1lbnQuYmFzZW5hbWUsXG4gICAgdGFnczogWy4uLmRvY3VtZW50LnRhZ3NdLFxuICAgIHRleHQ6IGRvY3VtZW50LnJhd1RleHRcbiAgICAgIC5yZXBsYWNlKEZST05UTUFUVEVSX1BBVFRFUk4sICcnKVxuICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgIC5ub3JtYWxpemUoJ05GS0MnKSxcbiAgfSkpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQWdncmVnYXRlUmVzdWx0LCBSZW5kZXJNb2RlbCwgUmVuZGVyTW9kZWxTdHJhdGVneSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVuZGVyTW9kZWwoXG4gIHdvcmRzOiBXZWlnaHRlZFdvcmRbXSxcbiAgYWdncmVnYXRlUmVzdWx0OiBBZ2dyZWdhdGVSZXN1bHQsXG4gIHN0cmF0ZWd5OiBSZW5kZXJNb2RlbFN0cmF0ZWd5LFxuKTogUmVuZGVyTW9kZWwge1xuICByZXR1cm4gc3RyYXRlZ3kuYnVpbGRNb2RlbCh3b3JkcywgYWdncmVnYXRlUmVzdWx0KTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFJlbmRlclNldHRpbmdzLCBXZWlnaHRlZFdvcmQgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFNjYWxpbmdTdHJhdGVneSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlRW50cmllcyhcbiAgZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sXG4gIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyxcbiAgc3RyYXRlZ3k6IFNjYWxpbmdTdHJhdGVneSxcbik6IFdlaWdodGVkV29yZFtdIHtcbiAgcmV0dXJuIHN0cmF0ZWd5LnNjYWxlKGVudHJpZXMsIHJlbmRlclNldHRpbmdzKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFBpcGVsaW5lRG9jdW1lbnQsIFNvdXJjZVNlbGVjdGlvblJ1bGVzIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbm9ybWFsaXplVGFnIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0RG9jdW1lbnRzKGRvY3VtZW50czogUGlwZWxpbmVEb2N1bWVudFtdLCBydWxlcz86IFNvdXJjZVNlbGVjdGlvblJ1bGVzKTogUGlwZWxpbmVEb2N1bWVudFtdIHtcbiAgaWYgKCFydWxlcykge1xuICAgIHJldHVybiBkb2N1bWVudHM7XG4gIH1cblxuICBjb25zdCBub3JtYWxpemVkVGFnRmlsdGVycyA9IChydWxlcy50YWdGaWx0ZXJzID8/IFtdKVxuICAgIC5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpXG4gICAgLmZpbHRlcigodGFnKSA9PiB0YWcubGVuZ3RoID4gMCk7XG5cbiAgY29uc3QgaW5jbHVkZVByZWZpeGVzID0gKHJ1bGVzLmluY2x1ZGVQYXRoUHJlZml4ZXMgPz8gW10pLm1hcCgocHJlZml4KSA9PiBwcmVmaXgudHJpbSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gIGNvbnN0IGV4Y2x1ZGVQcmVmaXhlcyA9IChydWxlcy5leGNsdWRlUGF0aFByZWZpeGVzID8/IFtdKS5tYXAoKHByZWZpeCkgPT4gcHJlZml4LnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBxdWVyeVRleHQgPSBydWxlcy5xdWVyeVRleHQ/LnRyaW0oKS50b0xvd2VyQ2FzZSgpID8/ICcnO1xuICBjb25zdCB0YWdNYXRjaE1vZGUgPSBydWxlcy50YWdNYXRjaE1vZGUgPz8gJ2FueSc7XG5cbiAgcmV0dXJuIGRvY3VtZW50cy5maWx0ZXIoKGRvY3VtZW50KSA9PiB7XG4gICAgaWYgKCFtYXRjaGVzUGF0aFJ1bGVzKGRvY3VtZW50LnBhdGgsIGluY2x1ZGVQcmVmaXhlcywgZXhjbHVkZVByZWZpeGVzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChub3JtYWxpemVkVGFnRmlsdGVycy5sZW5ndGggPiAwICYmICFtYXRjaGVzVGFnUnVsZXMoZG9jdW1lbnQudGFncywgbm9ybWFsaXplZFRhZ0ZpbHRlcnMsIHRhZ01hdGNoTW9kZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocXVlcnlUZXh0Lmxlbmd0aCA+IDAgJiYgIW1hdGNoZXNRdWVyeVRleHQoZG9jdW1lbnQsIHF1ZXJ5VGV4dCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNQYXRoUnVsZXMocGF0aDogc3RyaW5nLCBpbmNsdWRlUHJlZml4ZXM6IHN0cmluZ1tdLCBleGNsdWRlUHJlZml4ZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gIGlmIChpbmNsdWRlUHJlZml4ZXMubGVuZ3RoID4gMCAmJiAhaW5jbHVkZVByZWZpeGVzLnNvbWUoKHByZWZpeCkgPT4gcGF0aC5zdGFydHNXaXRoKHByZWZpeCkpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGV4Y2x1ZGVQcmVmaXhlcy5zb21lKChwcmVmaXgpID0+IHBhdGguc3RhcnRzV2l0aChwcmVmaXgpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzVGFnUnVsZXMoZG9jdW1lbnRUYWdzOiBzdHJpbmdbXSwgZmlsdGVyczogc3RyaW5nW10sIG1vZGU6ICdhbnknIHwgJ2FsbCcpOiBib29sZWFuIHtcbiAgY29uc3Qgbm9ybWFsaXplZFRhZ3MgPSBuZXcgU2V0KGRvY3VtZW50VGFncy5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpLmZpbHRlcihCb29sZWFuKSk7XG4gIGlmIChtb2RlID09PSAnYWxsJykge1xuICAgIHJldHVybiBmaWx0ZXJzLmV2ZXJ5KChmaWx0ZXJUYWcpID0+IG5vcm1hbGl6ZWRUYWdzLmhhcyhmaWx0ZXJUYWcpKTtcbiAgfVxuXG4gIHJldHVybiBmaWx0ZXJzLnNvbWUoKGZpbHRlclRhZykgPT4gbm9ybWFsaXplZFRhZ3MuaGFzKGZpbHRlclRhZykpO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzUXVlcnlUZXh0KGRvY3VtZW50OiBQaXBlbGluZURvY3VtZW50LCBxdWVyeVRleHQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gZG9jdW1lbnQucGF0aC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5VGV4dClcbiAgICB8fCBkb2N1bWVudC5iYXNlbmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5VGV4dClcbiAgICB8fCBkb2N1bWVudC5yYXdUZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnlUZXh0KTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IE5vcm1hbGl6ZWREb2N1bWVudCwgVG9rZW4sIFRva2VuaXplclN0cmF0ZWd5IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9rZW5pemVEb2N1bWVudHMoZG9jdW1lbnRzOiBOb3JtYWxpemVkRG9jdW1lbnRbXSwgc3RyYXRlZ3k6IFRva2VuaXplclN0cmF0ZWd5KTogVG9rZW5bXSB7XG4gIGNvbnN0IHRva2VuczogVG9rZW5bXSA9IFtdO1xuXG4gIGZvciAoY29uc3QgZG9jdW1lbnQgb2YgZG9jdW1lbnRzKSB7XG4gICAgY29uc3QgdmFsdWVzID0gc3RyYXRlZ3kudG9rZW5pemUoZG9jdW1lbnQudGV4dCk7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGRvY3VtZW50SWQ6IGRvY3VtZW50LmlkLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRva2Vucztcbn1cbiIsICJpbXBvcnQgeyBERUZBVUxUX1BJUEVMSU5FX1NUUkFURUdJRVMgfSBmcm9tICcuL3N0cmF0ZWdpZXMnO1xuaW1wb3J0IHsgYWdncmVnYXRlVG9rZW5zIH0gZnJvbSAnLi9zdGFnZXMvYWdncmVnYXRlJztcbmltcG9ydCB7IGZpbHRlclRva2VucyB9IGZyb20gJy4vc3RhZ2VzL2ZpbHRlcic7XG5pbXBvcnQgeyBub3JtYWxpemVEb2N1bWVudHMgfSBmcm9tICcuL3N0YWdlcy9ub3JtYWxpemUnO1xuaW1wb3J0IHsgY3JlYXRlUmVuZGVyTW9kZWwgfSBmcm9tICcuL3N0YWdlcy9yZW5kZXItbW9kZWwnO1xuaW1wb3J0IHsgc2NhbGVFbnRyaWVzIH0gZnJvbSAnLi9zdGFnZXMvc2NhbGUnO1xuaW1wb3J0IHsgc2VsZWN0RG9jdW1lbnRzIH0gZnJvbSAnLi9zdGFnZXMvc291cmNlLXNlbGVjdGlvbic7XG5pbXBvcnQgeyB0b2tlbml6ZURvY3VtZW50cyB9IGZyb20gJy4vc3RhZ2VzL3Rva2VuaXplJztcbmltcG9ydCB0eXBlIHsgUGlwZWxpbmVJbnB1dCwgUGlwZWxpbmVTdHJhdGVnaWVzLCBSZW5kZXJNb2RlbCB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcnVuUGlwZWxpbmUoXG4gIGlucHV0OiBQaXBlbGluZUlucHV0LFxuICBvdmVycmlkZXM6IFBhcnRpYWw8UGlwZWxpbmVTdHJhdGVnaWVzPiA9IHt9LFxuKTogUmVuZGVyTW9kZWwge1xuICBjb25zdCBzdHJhdGVnaWVzOiBQaXBlbGluZVN0cmF0ZWdpZXMgPSB7XG4gICAgLi4uREVGQVVMVF9QSVBFTElORV9TVFJBVEVHSUVTLFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfTtcblxuICBjb25zdCBzZWxlY3RlZERvY3VtZW50cyA9IHNlbGVjdERvY3VtZW50cyhpbnB1dC5kb2N1bWVudHMsIGlucHV0LnNvdXJjZVJ1bGVzKTtcbiAgY29uc3Qgbm9ybWFsaXplZERvY3VtZW50cyA9IG5vcm1hbGl6ZURvY3VtZW50cyhzZWxlY3RlZERvY3VtZW50cyk7XG4gIGNvbnN0IHRva2VucyA9IHRva2VuaXplRG9jdW1lbnRzKG5vcm1hbGl6ZWREb2N1bWVudHMsIHN0cmF0ZWdpZXMudG9rZW5pemVyKTtcbiAgY29uc3QgZmlsdGVyZWRUb2tlbnMgPSBmaWx0ZXJUb2tlbnModG9rZW5zLCBpbnB1dC5zdG9wV29yZHMsIHN0cmF0ZWdpZXMuZmlsdGVyKTtcbiAgY29uc3QgYWdncmVnYXRlUmVzdWx0ID0gYWdncmVnYXRlVG9rZW5zKGZpbHRlcmVkVG9rZW5zLCBzdHJhdGVnaWVzLmFnZ3JlZ2F0b3IpO1xuICBjb25zdCB3b3JkcyA9IHNjYWxlRW50cmllcyhhZ2dyZWdhdGVSZXN1bHQuZW50cmllcywgaW5wdXQucmVuZGVyU2V0dGluZ3MsIHN0cmF0ZWdpZXMuc2NhbGluZyk7XG5cbiAgcmV0dXJuIGNyZWF0ZVJlbmRlck1vZGVsKHdvcmRzLCBhZ2dyZWdhdGVSZXN1bHQsIHN0cmF0ZWdpZXMucmVuZGVyTW9kZWwpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgVGFnTWF0Y2hNb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbm9ybWFsaXplVGFnIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXZhaWxhYmxlVGFncyhhcHA6IEFwcCk6IHN0cmluZ1tdIHtcbiAgY29uc3QgdGFncyA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldFRhZ3MoKTtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHRhZ3MpLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJGaWxlc0J5VGFncyhcbiAgYXBwOiBBcHAsXG4gIGZpbGVzOiBURmlsZVtdLFxuICB0YWdGaWx0ZXJzOiBzdHJpbmdbXSxcbiAgdGFnTWF0Y2hNb2RlOiBUYWdNYXRjaE1vZGUsXG4pOiBURmlsZVtdIHtcbiAgY29uc3Qgbm9ybWFsaXplZEZpbHRlcnMgPSB0YWdGaWx0ZXJzXG4gICAgLm1hcCgodGFnKSA9PiBub3JtYWxpemVUYWcodGFnKSlcbiAgICAuZmlsdGVyKCh0YWcpID0+IHRhZy5sZW5ndGggPiAwKTtcblxuICBpZiAobm9ybWFsaXplZEZpbHRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZpbGVzO1xuICB9XG5cbiAgcmV0dXJuIGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsZU1hdGNoZXNUYWdzKGFwcCwgZmlsZSwgbm9ybWFsaXplZEZpbHRlcnMsIHRhZ01hdGNoTW9kZSkpO1xufVxuXG5mdW5jdGlvbiBmaWxlTWF0Y2hlc1RhZ3MoYXBwOiBBcHAsIGZpbGU6IFRGaWxlLCBub3JtYWxpemVkRmlsdGVyczogc3RyaW5nW10sIHRhZ01hdGNoTW9kZTogVGFnTWF0Y2hNb2RlKTogYm9vbGVhbiB7XG4gIGNvbnN0IGNhY2hlID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xuICBpZiAoIWNhY2hlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdGFnU2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgaWYgKGNhY2hlLnRhZ3MpIHtcbiAgICBmb3IgKGNvbnN0IHRhZ0VudHJ5IG9mIGNhY2hlLnRhZ3MpIHtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVUYWcodGFnRW50cnkudGFnKTtcbiAgICAgIGlmIChub3JtYWxpemVkKSB7XG4gICAgICAgIHRhZ1NldC5hZGQobm9ybWFsaXplZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChjb25zdCB0YWcgb2YgZXh0cmFjdEZyb250bWF0dGVyVGFncyhjYWNoZS5mcm9udG1hdHRlcikpIHtcbiAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplVGFnKHRhZyk7XG4gICAgaWYgKG5vcm1hbGl6ZWQpIHtcbiAgICAgIHRhZ1NldC5hZGQobm9ybWFsaXplZCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRhZ01hdGNoTW9kZSA9PT0gJ2FsbCcpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplZEZpbHRlcnMuZXZlcnkoKHRhZykgPT4gdGFnU2V0Lmhhcyh0YWcpKTtcbiAgfVxuXG4gIHJldHVybiBub3JtYWxpemVkRmlsdGVycy5zb21lKCh0YWcpID0+IHRhZ1NldC5oYXModGFnKSk7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RGcm9udG1hdHRlclRhZ3MoZnJvbnRtYXR0ZXI6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZ1tdIHtcbiAgaWYgKCFmcm9udG1hdHRlciB8fCB0eXBlb2YgZnJvbnRtYXR0ZXIgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgcmF3VGFncyA9IGZyb250bWF0dGVyLnRhZ3MgPz8gZnJvbnRtYXR0ZXIudGFnO1xuICBpZiAodHlwZW9mIHJhd1RhZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHJhd1RhZ3Muc3BsaXQoL1tcXHMsXSsvKS5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS5sZW5ndGggPiAwKTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHJhd1RhZ3MpKSB7XG4gICAgcmV0dXJuIHJhd1RhZ3NcbiAgICAgIC5maWx0ZXIoKGVudHJ5KTogZW50cnkgaXMgc3RyaW5nID0+IHR5cGVvZiBlbnRyeSA9PT0gJ3N0cmluZycpXG4gICAgICAubWFwKChlbnRyeSkgPT4gZW50cnkudHJpbSgpKVxuICAgICAgLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApO1xuICB9XG5cbiAgcmV0dXJuIFtdO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFdlaWdodGVkV29yZCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHJlYWRQaXBlbGluZURvY3VtZW50cyB9IGZyb20gJy4uL3BpcGVsaW5lL2FkYXB0ZXJzL29ic2lkaWFuLXNvdXJjZSc7XG5pbXBvcnQgeyBydW5QaXBlbGluZSB9IGZyb20gJy4uL3BpcGVsaW5lL3J1bi1waXBlbGluZSc7XG5pbXBvcnQgdHlwZSB7IFNvdXJjZVNlbGVjdGlvblJ1bGVzIH0gZnJvbSAnLi4vcGlwZWxpbmUvdHlwZXMnO1xuaW1wb3J0IHsgZ2V0QXZhaWxhYmxlVGFncyB9IGZyb20gJy4vdGFnLWZpbHRlcic7XG5cbmV4cG9ydCBjbGFzcyBXb3JkQ2xvdWRQcm9jZXNzb3Ige1xuICBwcml2YXRlIHJlYWRvbmx5IGFwcDogQXBwO1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwKSB7XG4gICAgdGhpcy5hcHAgPSBhcHA7XG4gIH1cblxuICBnZXRBdmFpbGFibGVUYWdzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gZ2V0QXZhaWxhYmxlVGFncyh0aGlzLmFwcCk7XG4gIH1cblxuICBhc3luYyBjb2xsZWN0RnJvbUZpbGVzKFxuICAgIGZpbGVzOiBURmlsZVtdLFxuICAgIHN0b3BXb3JkczogU2V0PHN0cmluZz4sXG4gICAgcmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzLFxuICAgIG9uUHJvZ3Jlc3M/OiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQsXG4gICAgc291cmNlUnVsZXM/OiBTb3VyY2VTZWxlY3Rpb25SdWxlcyxcbiAgKTogUHJvbWlzZTxXZWlnaHRlZFdvcmRbXT4ge1xuICAgIGNvbnN0IHBlcmZvcm1hbmNlID0gZ2V0UGVyZm9ybWFuY2VQcm9maWxlKHJlbmRlclNldHRpbmdzLnByb2dyZXNzRGV0YWlsKTtcbiAgICBjb25zdCByZXBvcnRQcm9ncmVzcyA9IGNyZWF0ZVRocm90dGxlZFByb2dyZXNzKG9uUHJvZ3Jlc3MsIHBlcmZvcm1hbmNlLnByb2dyZXNzVGhyb3R0bGVNcyk7XG4gICAgY29uc3QgcmVhZEJhdGNoU2l6ZSA9IHBlcmZvcm1hbmNlLmZ1bGxQYXJhbGxlbFJlYWRcbiAgICAgID8gTWF0aC5tYXgoMSwgZmlsZXMubGVuZ3RoKVxuICAgICAgOiBNYXRoLm1heCg4LCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLnNjYW5CYXRjaFNpemUpKTtcblxuICAgIGNvbnN0IGRvY3VtZW50cyA9IGF3YWl0IHJlYWRQaXBlbGluZURvY3VtZW50cyhcbiAgICAgIHRoaXMuYXBwLFxuICAgICAgZmlsZXMsXG4gICAgICByZWFkQmF0Y2hTaXplLFxuICAgICAgKG1lc3NhZ2UsIHBlcmNlbnQpID0+IHtcbiAgICAgICAgcmVwb3J0UHJvZ3Jlc3MobWVzc2FnZSwgcGVyY2VudCk7XG4gICAgICB9LFxuICAgICk7XG5cbiAgICByZXBvcnRQcm9ncmVzcygnVG9rZW5pemluZyBhbmQgYWdncmVnYXRpbmcuLi4nLCA4NSk7XG5cbiAgICBjb25zdCBtb2RlbCA9IHJ1blBpcGVsaW5lKHtcbiAgICAgIGRvY3VtZW50cyxcbiAgICAgIHN0b3BXb3JkcyxcbiAgICAgIHJlbmRlclNldHRpbmdzLFxuICAgICAgc291cmNlUnVsZXMsXG4gICAgfSk7XG5cbiAgICByZXBvcnRQcm9ncmVzcygnUHJlcGFyaW5nIGxheW91dC4uLicsIDk1KTtcblxuICAgIHJldHVybiBtb2RlbC53b3JkQ2xvdWRXb3JkcztcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVUaHJvdHRsZWRQcm9ncmVzcyhcbiAgb25Qcm9ncmVzczogKChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4gdm9pZCkgfCB1bmRlZmluZWQsXG4gIG1pbkludGVydmFsTXM6IG51bWJlcixcbik6IChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4gdm9pZCB7XG4gIGlmICghb25Qcm9ncmVzcykge1xuICAgIHJldHVybiAoKSA9PiB1bmRlZmluZWQ7XG4gIH1cblxuICBsZXQgbGFzdFJlcG9ydGVkQXQgPSAwO1xuICBsZXQgbGFzdFBlcmNlbnQgPSAtMTtcblxuICByZXR1cm4gKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBpZiAocGVyY2VudCAhPT0gMTAwICYmIHBlcmNlbnQgPT09IGxhc3RQZXJjZW50ICYmIG5vdyAtIGxhc3RSZXBvcnRlZEF0IDwgbWluSW50ZXJ2YWxNcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGVyY2VudCAhPT0gMTAwICYmIG5vdyAtIGxhc3RSZXBvcnRlZEF0IDwgbWluSW50ZXJ2YWxNcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxhc3RSZXBvcnRlZEF0ID0gbm93O1xuICAgIGxhc3RQZXJjZW50ID0gcGVyY2VudDtcbiAgICBvblByb2dyZXNzKG1lc3NhZ2UsIHBlcmNlbnQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRQZXJmb3JtYW5jZVByb2ZpbGUoZGV0YWlsOiBSZW5kZXJTZXR0aW5nc1sncHJvZ3Jlc3NEZXRhaWwnXSk6IHtcbiAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiBudW1iZXI7XG4gIGZ1bGxQYXJhbGxlbFJlYWQ6IGJvb2xlYW47XG59IHtcbiAgaWYgKGRldGFpbCA9PT0gJ3VuaGluZ2VkJykge1xuICAgIHJldHVybiB7XG4gICAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDFfMDAwXzAwMCxcbiAgICAgIGZ1bGxQYXJhbGxlbFJlYWQ6IHRydWUsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChkZXRhaWwgPT09ICdkZXRhaWxlZCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAyNSxcbiAgICAgIGZ1bGxQYXJhbGxlbFJlYWQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBpZiAoZGV0YWlsID09PSAnbWluaW1hbCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAyMjAsXG4gICAgICBmdWxsUGFyYWxsZWxSZWFkOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDgwLFxuICAgIGZ1bGxQYXJhbGxlbFJlYWQ6IGZhbHNlLFxuICB9O1xufVxuIiwgImltcG9ydCB7IFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBERUZBVUxUX1NUT1BfV09SRFMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUge1xuICBDb3VudExhYmVsRm9ybWF0LFxuICBQcm9ncmVzc0RldGFpbCxcbiAgUmVuZGVyU2V0dGluZ3MsXG4gIFJvdGF0aW9uUHJlc2V0LFxuICBTY2FsaW5nTW9kZSxcbiAgU3BpcmFsVHlwZSxcbiAgV2VpZ2h0ZWRXb3JkLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSBWYXVsdFdvcmRDbG91ZFBsdWdpbiBmcm9tICcuLi9tYWluJztcbmltcG9ydCB7IG1hcENvdW50c1RvV2VpZ2h0ZWRXb3JkcyB9IGZyb20gJy4uL3Byb2Nlc3Npbmcvc2NhbGluZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgV29yZENsb3VkU2V0dGluZ3Mge1xuICBibGFja2xpc3RXb3Jkczogc3RyaW5nW107XG4gIHJlbmRlcjogUmVuZGVyU2V0dGluZ3M7XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBXb3JkQ2xvdWRTZXR0aW5ncyA9IHtcbiAgYmxhY2tsaXN0V29yZHM6IFsuLi5ERUZBVUxUX1NUT1BfV09SRFNdLFxuICByZW5kZXI6IHtcbiAgICByb3RhdGlvblByZXNldDogJ21vc3RseS1ob3Jpem9udGFsJyxcbiAgICBzcGlyYWw6ICdhcmNoaW1lZGVhbicsXG4gICAgd29yZFBhZGRpbmc6IDIsXG4gICAgbWluRm9udFNpemU6IDE0LFxuICAgIG1heEZvbnRTaXplOiA3MixcbiAgICBmb250RmFtaWx5OiAnc2Fucy1zZXJpZicsXG4gICAgc2NhbGluZ01vZGU6ICdwb3dlcicsXG4gICAgZW1waGFzaXM6IDEsXG4gICAgc2hvd0NvdW50SW5Xb3JkVGV4dDogZmFsc2UsXG4gICAgY291bnRMYWJlbEZvcm1hdDogJ3BhcmVuJyxcbiAgICBjb3VudExhYmVsTWluQ291bnQ6IDEsXG4gICAgcHJvZ3Jlc3NEZXRhaWw6ICdiYWxhbmNlZCcsXG4gICAgc2NhbkJhdGNoU2l6ZTogMjQsXG4gICAgbGF5b3V0VGltZUludGVydmFsTXM6IDE2LFxuICAgIGRldGVybWluaXN0aWNMYXlvdXQ6IGZhbHNlLFxuICAgIHJhbmRvbVNlZWQ6IDQyLFxuICB9LFxufTtcblxuZXhwb3J0IGNsYXNzIFZhdWx0V29yZENsb3VkU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwcml2YXRlIHJlYWRvbmx5IHBsdWdpbjogVmF1bHRXb3JkQ2xvdWRQbHVnaW47XG5cbiAgY29uc3RydWN0b3IocGx1Z2luOiBWYXVsdFdvcmRDbG91ZFBsdWdpbikge1xuICAgIHN1cGVyKHBsdWdpbi5hcHAsIHBsdWdpbik7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gIH1cblxuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ1dvcmQgY2xvdWRzIHNldHRpbmdzJyB9KTtcblxuICAgIGxldCBkcmFmdFdvcmQgPSAnJztcblxuICAgIGNvbnN0IGFkZEV4Y2x1ZGVkV29yZCA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0FkZCBleGNsdWRlZCB3b3JkJylcbiAgICAgIC5zZXREZXNjKCdBZGQgb25lIHdvcmQgYXQgYSB0aW1lIHRvIHRoZSBibGFja2xpc3QuJylcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB7XG4gICAgICAgIHRleHQuc2V0UGxhY2Vob2xkZXIoJ1dvcmQgdG8gZXhjbHVkZScpO1xuICAgICAgICB0ZXh0Lm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgIGRyYWZ0V29yZCA9IHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uXG4gICAgICAgICAgLnNldEJ1dHRvblRleHQoJ0FkZCcpXG4gICAgICAgICAgLnNldEN0YSgpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWRkZWQgPSBhd2FpdCB0aGlzLnBsdWdpbi5hZGRCbGFja2xpc3RXb3JkKGRyYWZ0V29yZCk7XG4gICAgICAgICAgICBpZiAoYWRkZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGFkZEV4Y2x1ZGVkV29yZCwgJ0V4Y2x1ZGVkIHdvcmRzIGFyZSBhbHdheXMgaWdub3JlZCBmcm9tIGNvdW50aW5nIGFuZCBzaXppbmcgaW4gYWxsIGNsb3VkIHR5cGVzLicpO1xuXG4gICAgY29uc3QgbGlzdFdyYXBwZXJFbCA9IGNvbnRhaW5lckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtbGlzdCcgfSk7XG4gICAgbGlzdFdyYXBwZXJFbC5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6ICdFeGNsdWRlZCB3b3JkcycgfSk7XG4gICAgY29uc3QgbGlzdEVsID0gbGlzdFdyYXBwZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXNldHRpbmdzLWJhZGdlcycgfSk7XG4gICAgY29uc3Qgc29ydGVkV29yZHMgPSBbLi4udGhpcy5wbHVnaW4uc2V0dGluZ3MuYmxhY2tsaXN0V29yZHNdLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG5cbiAgICBpZiAoc29ydGVkV29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBsaXN0RWwuY3JlYXRlU3Bhbih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtYmFkZ2VzLWVtcHR5JywgdGV4dDogJ05vIGV4Y2x1ZGVkIHdvcmRzIGNvbmZpZ3VyZWQuJyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCB3b3JkIG9mIHNvcnRlZFdvcmRzKSB7XG4gICAgICAgIGNvbnN0IGJhZGdlRWwgPSBsaXN0RWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zZXR0aW5ncy1iYWRnZScgfSk7XG4gICAgICAgIGJhZGdlRWwuY3JlYXRlU3Bhbih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtYmFkZ2UtdGV4dCcsIHRleHQ6IHdvcmQgfSk7XG5cbiAgICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gYmFkZ2VFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtYmFkZ2UtcmVtb3ZlJyxcbiAgICAgICAgICB0ZXh0OiAneCcsXG4gICAgICAgIH0pO1xuICAgICAgICByZW1vdmVCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsIGBSZW1vdmUgJHt3b3JkfWApO1xuICAgICAgICByZW1vdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4ucmVtb3ZlQmxhY2tsaXN0V29yZCh3b3JkKTtcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVzZXRFeGNsdWRlZFdvcmRzID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUmVzZXQgZXhjbHVkZWQgd29yZHMnKVxuICAgICAgLnNldERlc2MoJ1Jlc3RvcmUgdGhlIG9yaWdpbmFsIGRlZmF1bHQgYmxhY2tsaXN0LicpXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uXG4gICAgICAgICAgLnNldEJ1dHRvblRleHQoJ1Jlc2V0IHRvIGRlZmF1bHRzJylcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5yZXNldEJsYWNrbGlzdFdvcmRzKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24ocmVzZXRFeGNsdWRlZFdvcmRzLCAnUmVzZXRzIG9ubHkgZXhjbHVkZWQgd29yZHMuIFJlbmRlcmluZyBhbmQgcGVyZm9ybWFuY2Ugc2V0dGluZ3MgYXJlIHVuY2hhbmdlZC4nKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMycsIHsgdGV4dDogJ1JlbmRlcmluZycgfSk7XG5cbiAgICBjb25zdCBwcmV2aWV3V3JhcHBlckVsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zZXR0aW5ncy1wcmV2aWV3JyB9KTtcbiAgICBwcmV2aWV3V3JhcHBlckVsLmNyZWF0ZUVsKCdoNCcsIHsgdGV4dDogJ1ByZXZpZXcnIH0pO1xuICAgIHByZXZpZXdXcmFwcGVyRWwuY3JlYXRlRWwoJ3AnLCB7XG4gICAgICB0ZXh0OiAnRXhhbXBsZSBjbG91ZCBmb3IgcmVuZGVyIHNldHRpbmdzIChkb2VzIG5vdCB1c2UgeW91ciB2YXVsdCBkYXRhKS4nLFxuICAgIH0pO1xuICAgIGNvbnN0IHByZXZpZXdDYW52YXNFbCA9IHByZXZpZXdXcmFwcGVyRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zZXR0aW5ncy1wcmV2aWV3LWNhbnZhcycgfSk7XG5cbiAgICBsZXQgcHJldmlld05vbmNlID0gMDtcbiAgICBjb25zdCByZXJlbmRlclByZXZpZXcgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCBub25jZSA9ICsrcHJldmlld05vbmNlO1xuICAgICAgcHJldmlld0NhbnZhc0VsLmVtcHR5KCk7XG4gICAgICBjb25zdCBsb2FkaW5nRWwgPSBwcmV2aWV3Q2FudmFzRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsIHRleHQ6ICdSZW5kZXJpbmcgcHJldmlldy4uLicgfSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHNhbXBsZVdvcmRzID0gdGhpcy5idWlsZFByZXZpZXdXb3Jkcyh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIpO1xuICAgICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLmRyYXdXb3JkQ2xvdWQoe1xuICAgICAgICAgIGNvbnRhaW5lckVsOiBwcmV2aWV3Q2FudmFzRWwsXG4gICAgICAgICAgd29yZHM6IHNhbXBsZVdvcmRzLFxuICAgICAgICAgIGFyaWFMYWJlbDogJ1dvcmQgY2xvdWQgcmVuZGVyIHByZXZpZXcnLFxuICAgICAgICAgIG9uUmVmcmVzaDogcmVyZW5kZXJQcmV2aWV3LFxuICAgICAgICAgIG9uV29yZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAvLyBuby1vcCBpbiBzZXR0aW5ncyBwcmV2aWV3XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlbmFibGVFeHBvcnQ6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICBpZiAobm9uY2UgIT09IHByZXZpZXdOb25jZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICAgICAgcHJldmlld0NhbnZhc0VsLmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsXG4gICAgICAgICAgdGV4dDogJ0NvdWxkIG5vdCByZW5kZXIgcHJldmlldy4nLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlUmVuZGVyQW5kUHJldmlldyA9IGFzeW5jIChwYXRjaDogUGFydGlhbDxSZW5kZXJTZXR0aW5ncz4pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnVwZGF0ZVJlbmRlclNldHRpbmdzKHBhdGNoKTtcbiAgICAgIGF3YWl0IHJlcmVuZGVyUHJldmlldygpO1xuICAgIH07XG5cbiAgICBjb25zdCByb3RhdGlvblN0eWxlID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUm90YXRpb24gc3R5bGUnKVxuICAgICAgLnNldERlc2MoJ0hvdyB3b3JkcyBhcmUgYW5nbGVkIGluIHRoZSBjbG91ZC4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ2hvcml6b250YWwnLCAnSG9yaXpvbnRhbCBvbmx5JylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdtb3N0bHktaG9yaXpvbnRhbCcsICdNb3N0bHkgaG9yaXpvbnRhbCcpXG4gICAgICAgICAgLmFkZE9wdGlvbignbWl4ZWQnLCAnTWl4ZWQgYW5nbGVzJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCd2ZXJ0aWNhbCcsICdWZXJ0aWNhbCBoZWF2eScpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5yb3RhdGlvblByZXNldClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHtcbiAgICAgICAgICAgICAgcm90YXRpb25QcmVzZXQ6IHZhbHVlIGFzIFJvdGF0aW9uUHJlc2V0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHJvdGF0aW9uU3R5bGUsICdIb3Jpem9udGFsIGlzIGVhc2llc3QgdG8gcmVhZC4gTWl4ZWQvdmVydGljYWwgY2FuIHBhY2sgbW9yZSB3b3JkcyBidXQgbWF5IHJlZHVjZSByZWFkYWJpbGl0eS4nKTtcblxuICAgIGNvbnN0IHNwaXJhbExheW91dCA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1NwaXJhbCBsYXlvdXQnKVxuICAgICAgLnNldERlc2MoJ1BsYWNlbWVudCBzdHJhdGVneSBmb3IgcG9zaXRpb25pbmcgd29yZHMuJylcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9uKCdhcmNoaW1lZGVhbicsICdBcmNoaW1lZGVhbicpXG4gICAgICAgICAgLmFkZE9wdGlvbigncmVjdGFuZ3VsYXInLCAnUmVjdGFuZ3VsYXInKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuc3BpcmFsKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoe1xuICAgICAgICAgICAgICBzcGlyYWw6IHZhbHVlIGFzIFNwaXJhbFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oc3BpcmFsTGF5b3V0LCAnQXJjaGltZWRlYW4gaXMgbW9yZSBvcmdhbmljLiBSZWN0YW5ndWxhciBjYW4gYXBwZWFyIHRpZ2h0ZXIgaW4gc29tZSBkYXRhc2V0cy4nKTtcblxuICAgIGNvbnN0IHdvcmRQYWRkaW5nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnV29yZCBwYWRkaW5nJylcbiAgICAgIC5zZXREZXNjKCdTcGFjZSBiZXR3ZWVuIHdvcmRzIGluIHBpeGVscy4nKVxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG4gICAgICAgIHNsaWRlclxuICAgICAgICAgIC5zZXRMaW1pdHMoMCwgMTIsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci53b3JkUGFkZGluZylcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyB3b3JkUGFkZGluZzogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHdvcmRQYWRkaW5nLCAnSW5jcmVhc2UgdG8gcmVkdWNlIGNvbGxpc2lvbnMgYW5kIGltcHJvdmUgcmVhZGFiaWxpdHkuIExvd2VyIHZhbHVlcyBwYWNrIG1vcmUgd29yZHMuJyk7XG5cbiAgICBjb25zdCBtaW5Gb250U2l6ZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ01pbmltdW0gZm9udCBzaXplJylcbiAgICAgIC5zZXREZXNjKCdTbWFsbGVzdCByZW5kZXJlZCB3b3JkIHNpemUuJylcbiAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT4ge1xuICAgICAgICBzbGlkZXJcbiAgICAgICAgICAuc2V0TGltaXRzKDgsIDY0LCAxKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIubWluRm9udFNpemUpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgbWluRm9udFNpemU6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihtaW5Gb250U2l6ZSwgJ1NldHMgdGhlIGZsb29yIG9mIHZpc3VhbCBzaXplIG1hcHBpbmcuIEhpZ2hlciBtaW5pbXVtIG1ha2VzIGxvdy1mcmVxdWVuY3kgd29yZHMgbW9yZSBsZWdpYmxlLicpO1xuXG4gICAgY29uc3QgbWF4Rm9udFNpemUgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdNYXhpbXVtIGZvbnQgc2l6ZScpXG4gICAgICAuc2V0RGVzYygnTGFyZ2VzdCByZW5kZXJlZCB3b3JkIHNpemUuJylcbiAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT4ge1xuICAgICAgICBzbGlkZXJcbiAgICAgICAgICAuc2V0TGltaXRzKDE2LCAxNDAsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5tYXhGb250U2l6ZSlcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyBtYXhGb250U2l6ZTogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKG1heEZvbnRTaXplLCAnU2V0cyB0aGUgY2VpbGluZyBvZiB2aXN1YWwgc2l6ZSBtYXBwaW5nLiBIaWdoZXIgdmFsdWVzIGVtcGhhc2l6ZSB0b3Agd29yZHMgbW9yZSBzdHJvbmdseS4nKTtcblxuICAgIGNvbnN0IGZvbnRGYW1pbHkgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdGb250IGZhbWlseScpXG4gICAgICAuc2V0RGVzYygnQ1NTIGZvbnQgZmFtaWx5IHVzZWQgZm9yIHdvcmRzLicpXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdzYW5zLXNlcmlmJylcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmZvbnRGYW1pbHkpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IGZvbnRGYW1pbHk6IHZhbHVlLnRyaW0oKSB8fCAnc2Fucy1zZXJpZicgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGZvbnRGYW1pbHksICdXaWRlciBmb250cyB0YWtlIG1vcmUgc3BhY2UgYW5kIGNhbiBpbmNyZWFzZSBvdmVybGFwIHByZXNzdXJlLicpO1xuXG4gICAgY29uc3Qgc2hvd0NvdW50SW5Xb3JkVGV4dCA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1Nob3cgY291bnQgaW4gd29yZCB0ZXh0JylcbiAgICAgIC5zZXREZXNjKCdBcHBlbmQgdGhlIG9jY3VycmVuY2UgY291bnQgZGlyZWN0bHkgdG8gcmVuZGVyZWQgd29yZHMuJylcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGVcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnNob3dDb3VudEluV29yZFRleHQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IHNob3dDb3VudEluV29yZFRleHQ6IHZhbHVlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHNob3dDb3VudEluV29yZFRleHQsICdTaG93cyBleGFjdCBjb3VudHMgaW5saW5lIChlLmcuLCB3b3JkICgxMikpLiBJbXByb3ZlcyBwcmVjaXNpb24sIGluY3JlYXNlcyB0ZXh0IGxlbmd0aC4nKTtcblxuICAgIGNvbnN0IGNvdW50TGFiZWxGb3JtYXQgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdDb3VudCBsYWJlbCBmb3JtYXQnKVxuICAgICAgLnNldERlc2MoJ0hvdyBjb3VudHMgYXJlIHNob3duIHdoZW4gY291bnQgbGFiZWxzIGFyZSBlbmFibGVkLicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbigncGFyZW4nLCAnd29yZCAoMTIpJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdkb3QnLCAnd29yZCBcdTAwQjcgMTInKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ2NvbG9uJywgJ3dvcmQ6IDEyJylcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmNvdW50TGFiZWxGb3JtYXQpXG4gICAgICAgICAgLnNldERpc2FibGVkKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuc2hvd0NvdW50SW5Xb3JkVGV4dClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgY291bnRMYWJlbEZvcm1hdDogdmFsdWUgYXMgQ291bnRMYWJlbEZvcm1hdCB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oY291bnRMYWJlbEZvcm1hdCwgJ0Zvcm1hdHRpbmcgc3R5bGUgZm9yIGlubGluZSBjb3VudHMuJyk7XG5cbiAgICBjb25zdCBjb3VudExhYmVsTWluaW11bSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0NvdW50IGxhYmVsIG1pbmltdW0nKVxuICAgICAgLnNldERlc2MoJ1Nob3cgaW5saW5lIGNvdW50IG9ubHkgZm9yIHdvcmRzIGF0IG9yIGFib3ZlIHRoaXMgY291bnQuJylcbiAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT4ge1xuICAgICAgICBzbGlkZXJcbiAgICAgICAgICAuc2V0TGltaXRzKDEsIDEwMCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmNvdW50TGFiZWxNaW5Db3VudClcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5zZXREaXNhYmxlZCghdGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnNob3dDb3VudEluV29yZFRleHQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IGNvdW50TGFiZWxNaW5Db3VudDogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGNvdW50TGFiZWxNaW5pbXVtLCAnQXZvaWRzIHZpc3VhbCBub2lzZSBieSBoaWRpbmcgY291bnRzIGZvciB2ZXJ5IHNtYWxsIHZhbHVlcy4nKTtcblxuICAgIGNvbnN0IHNpemVTY2FsaW5nTW9kZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1NpemUgc2NhbGluZyBtb2RlJylcbiAgICAgIC5zZXREZXNjKCdIb3cgbnVtZXJpYyBjb3VudCBkaWZmZXJlbmNlcyBtYXAgdG8gZm9udC1zaXplIGRpZmZlcmVuY2VzLicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbignbGluZWFyJywgJ0xpbmVhcicpXG4gICAgICAgICAgLmFkZE9wdGlvbigncG93ZXInLCAnUG93ZXInKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ2xvZycsICdMb2cnKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ3JhbmsnLCAnUmFuaycpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5zY2FsaW5nTW9kZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgc2NhbGluZ01vZGU6IHZhbHVlIGFzIFNjYWxpbmdNb2RlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHNpemVTY2FsaW5nTW9kZSwgJ0xpbmVhciBpcyBwcm9wb3J0aW9uYWwuIFBvd2VyIGV4YWdnZXJhdGVzIGdhcHMuIExvZyBjb21wcmVzc2VzIGV4dHJlbWVzLiBSYW5rIGlnbm9yZXMgYWJzb2x1dGUgZ2Fwcy4nKTtcblxuICAgIGNvbnN0IGVtcGhhc2lzID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnRW1waGFzaXMnKVxuICAgICAgLnNldERlc2MoJ0hpZ2hlciB2YWx1ZXMgZXhhZ2dlcmF0ZSBzaXplIGRpZmZlcmVuY2VzIChwb3dlciBzY2FsaW5nIG1vZGUpLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cygwLjUsIDMsIDAuMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmVtcGhhc2lzKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLnNldERpc2FibGVkKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5zY2FsaW5nTW9kZSAhPT0gJ3Bvd2VyJylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgZW1waGFzaXM6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihlbXBoYXNpcywgJ09ubHkgdXNlZCBpbiBQb3dlciBzY2FsaW5nIG1vZGUuIDEuMCBpcyBiYXNlbGluZTsgaGlnaGVyIGV4YWdnZXJhdGVzIGRpZmZlcmVuY2VzIG1vcmUuJyk7XG5cbiAgICBjb25zdCBkZXRlcm1pbmlzdGljTGF5b3V0ID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnRGV0ZXJtaW5pc3RpYyBsYXlvdXQnKVxuICAgICAgLnNldERlc2MoJ0tlZXAgY2xvdWQgbGF5b3V0IHN0YWJsZSBhY3Jvc3MgcmVmcmVzaGVzIHVzaW5nIGEgc2VlZC4nKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuZGV0ZXJtaW5pc3RpY0xheW91dClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgZGV0ZXJtaW5pc3RpY0xheW91dDogdmFsdWUgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oZGV0ZXJtaW5pc3RpY0xheW91dCwgJ1VzZWZ1bCBmb3IgY29tcGFyaW5nIGJlZm9yZS9hZnRlciBjaGFuZ2VzIHdpdGggc3RhYmxlIHBvc2l0aW9ucy4nKTtcblxuICAgIGNvbnN0IHJhbmRvbVNlZWQgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdSYW5kb20gc2VlZCcpXG4gICAgICAuc2V0RGVzYygnU2VlZCB1c2VkIHdoZW4gZGV0ZXJtaW5pc3RpYyBsYXlvdXQgaXMgZW5hYmxlZC4nKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRWYWx1ZShTdHJpbmcodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnJhbmRvbVNlZWQpKVxuICAgICAgICAgIC5zZXREaXNhYmxlZCghdGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmRldGVybWluaXN0aWNMYXlvdXQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XG4gICAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyByYW5kb21TZWVkOiBwYXJzZWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHJhbmRvbVNlZWQsICdDaGFuZ2luZyBzZWVkIGdpdmVzIGEgZGlmZmVyZW50IHN0YWJsZSBhcnJhbmdlbWVudC4nKTtcblxuICAgIGNvbnN0IHJlc2V0UmVuZGVyaW5nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUmVzZXQgcmVuZGVyaW5nIHNldHRpbmdzJylcbiAgICAgIC5zZXREZXNjKCdSZXN0b3JlIGRlZmF1bHQgcmVuZGVyZXIgY29udHJvbHMuJylcbiAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b25cbiAgICAgICAgICAuc2V0QnV0dG9uVGV4dCgnUmVzZXQgcmVuZGVyaW5nJylcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5yZXNldFJlbmRlclNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24ocmVzZXRSZW5kZXJpbmcsICdSZXNldHMgcmVuZGVyaW5nIG9wdGlvbnMgb25seS4nKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMycsIHsgdGV4dDogJ1BlcmZvcm1hbmNlJyB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgncCcsIHtcbiAgICAgIHRleHQ6ICdUdW5lIHNwZWVkIHZzIFVJIHNtb290aG5lc3MgYW5kIHByb2dyZXNzIHVwZGF0ZSBkZXRhaWwgZm9yIGxhcmdlIGNsb3Vkcy4nLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvZ3Jlc3NEZXRhaWwgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdQcm9ncmVzcyBkZXRhaWwnKVxuICAgICAgLnNldERlc2MoJ0hvdyBmcmVxdWVudGx5IHByb2dyZXNzIGlzIHVwZGF0ZWQgd2hpbGUgc2Nhbm5pbmcgYW5kIGxheW91dC4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ3VuaGluZ2VkJywgJ1VuaGluZ2VkIChtYXggc3BlZWQpJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdtaW5pbWFsJywgJ01pbmltYWwgKGZhc3Rlc3QpJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdiYWxhbmNlZCcsICdCYWxhbmNlZCcpXG4gICAgICAgICAgLmFkZE9wdGlvbignZGV0YWlsZWQnLCAnRGV0YWlsZWQnKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIucHJvZ3Jlc3NEZXRhaWwpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udXBkYXRlUmVuZGVyU2V0dGluZ3MoeyBwcm9ncmVzc0RldGFpbDogdmFsdWUgYXMgUHJvZ3Jlc3NEZXRhaWwgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHByb2dyZXNzRGV0YWlsLCAnVW5oaW5nZWQgbWF4aW1pemVzIHNwZWVkIGFuZCBtYXkgbG9jayBVSSB0ZW1wb3JhcmlseS4gRGV0YWlsZWQgaXMgbW9zdCBpbmZvcm1hdGl2ZSBidXQgc2xvd2VyLicpO1xuXG4gICAgY29uc3Qgc2NhbkJhdGNoU2l6ZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1NjYW4gYmF0Y2ggc2l6ZScpXG4gICAgICAuc2V0RGVzYygnSG93IG1hbnkgZmlsZXMgYXJlIHJlYWQgaW4gcGFyYWxsZWwgZHVyaW5nIHZhdWx0IHNjYW5uaW5nLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cyg4LCA2NCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnNjYW5CYXRjaFNpemUpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi51cGRhdGVSZW5kZXJTZXR0aW5ncyh7IHNjYW5CYXRjaFNpemU6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihzY2FuQmF0Y2hTaXplLCAnSGlnaGVyIGNhbiBiZSBmYXN0ZXIgb24gc3Ryb25nIGRldmljZXMgYnV0IHVzZXMgbW9yZSBtZW1vcnkvSU8uJyk7XG5cbiAgICBjb25zdCBsYXlvdXRUaW1lU2xpY2UgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdMYXlvdXQgdGltZSBzbGljZSAobXMpJylcbiAgICAgIC5zZXREZXNjKCdUaW1lIHBlciBsYXlvdXQgY2h1bmsuIExvd2VyIGlzIHNtb290aGVyOyBoaWdoZXIgaXMgZmFzdGVyLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cyg4LCA0MCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmxheW91dFRpbWVJbnRlcnZhbE1zKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udXBkYXRlUmVuZGVyU2V0dGluZ3MoeyBsYXlvdXRUaW1lSW50ZXJ2YWxNczogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGxheW91dFRpbWVTbGljZSwgJ0NvbnRyb2xzIHJlc3BvbnNpdmVuZXNzIHdoaWxlIGxheWluZyBvdXQgd29yZHMuJyk7XG5cbiAgICBjb25zdCByZXNldFBlcmZvcm1hbmNlID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUmVzZXQgcGVyZm9ybWFuY2Ugc2V0dGluZ3MnKVxuICAgICAgLnNldERlc2MoJ1Jlc3RvcmUgZGVmYXVsdCBwZXJmb3JtYW5jZSB0dW5pbmcgdmFsdWVzLicpXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uXG4gICAgICAgICAgLnNldEJ1dHRvblRleHQoJ1Jlc2V0IHBlcmZvcm1hbmNlJylcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi51cGRhdGVSZW5kZXJTZXR0aW5ncyh7XG4gICAgICAgICAgICAgIHByb2dyZXNzRGV0YWlsOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5wcm9ncmVzc0RldGFpbCxcbiAgICAgICAgICAgICAgc2NhbkJhdGNoU2l6ZTogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuc2NhbkJhdGNoU2l6ZSxcbiAgICAgICAgICAgICAgbGF5b3V0VGltZUludGVydmFsTXM6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLmxheW91dFRpbWVJbnRlcnZhbE1zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24ocmVzZXRQZXJmb3JtYW5jZSwgJ1Jlc2V0cyBwZXJmb3JtYW5jZSB0dW5pbmcgb25seS4nKTtcblxuICAgIHZvaWQgcmVyZW5kZXJQcmV2aWV3KCk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaEluZm9JY29uKHNldHRpbmc6IFNldHRpbmcsIGluZm9UZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBpY29uID0gc2V0dGluZy5uYW1lRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIGNsczogJ3dvcmQtY2xvdWQtc2V0dGluZy1pbmZvJyxcbiAgICAgIHRleHQ6ICdpJyxcbiAgICB9KTtcbiAgICBpY29uLnR5cGUgPSAnYnV0dG9uJztcbiAgICBpY29uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnU2hvdyBzZXR0aW5nIGRldGFpbHMnKTtcbiAgICBpY29uLnNldEF0dHIoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicsICd0b3AnKTtcbiAgICBpY29uLnNldEF0dHIoJ2RhdGEtdG9vbHRpcCcsIGluZm9UZXh0KTtcblxuICAgIGNvbnN0IHBvcG92ZXIgPSBzZXR0aW5nLnNldHRpbmdFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLXNldHRpbmctaW5mby1wb3BvdmVyJyB9KTtcbiAgICBwb3BvdmVyLnNldFRleHQoaW5mb1RleHQpO1xuICAgIHBvcG92ZXIuc2V0QXR0cignaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIGljb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgaWYgKHBvcG92ZXIuaGFzQXR0cmlidXRlKCdoaWRkZW4nKSkge1xuICAgICAgICBwb3BvdmVyLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb3BvdmVyLnNldEF0dHIoJ2hpZGRlbicsICd0cnVlJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpY29uLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIHBvcG92ZXIuc2V0QXR0cignaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRQcmV2aWV3V29yZHMocmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzKTogV2VpZ2h0ZWRXb3JkW10ge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gW1xuICAgICAgeyB0ZXh0OiAnb2JzaWRpYW4nLCBjb3VudDogNDggfSxcbiAgICAgIHsgdGV4dDogJ25vdGVzJywgY291bnQ6IDQzIH0sXG4gICAgICB7IHRleHQ6ICdwbHVnaW5zJywgY291bnQ6IDM2IH0sXG4gICAgICB7IHRleHQ6ICd2YXVsdCcsIGNvdW50OiAzMyB9LFxuICAgICAgeyB0ZXh0OiAncmVzZWFyY2gnLCBjb3VudDogMjggfSxcbiAgICAgIHsgdGV4dDogJ2lkZWFzJywgY291bnQ6IDI1IH0sXG4gICAgICB7IHRleHQ6ICd3cml0aW5nJywgY291bnQ6IDIyIH0sXG4gICAgICB7IHRleHQ6ICdkYWlseScsIGNvdW50OiAyMCB9LFxuICAgICAgeyB0ZXh0OiAncHJvamVjdCcsIGNvdW50OiAxOCB9LFxuICAgICAgeyB0ZXh0OiAncmV2aWV3JywgY291bnQ6IDE2IH0sXG4gICAgICB7IHRleHQ6ICdkZXNpZ24nLCBjb3VudDogMTQgfSxcbiAgICAgIHsgdGV4dDogJ21lZXRpbmcnLCBjb3VudDogMTIgfSxcbiAgICAgIHsgdGV4dDogJ3Rhc2tzJywgY291bnQ6IDExIH0sXG4gICAgICB7IHRleHQ6ICdqb3VybmFsJywgY291bnQ6IDEwIH0sXG4gICAgICB7IHRleHQ6ICdkcmFmdCcsIGNvdW50OiA5IH0sXG4gICAgICB7IHRleHQ6ICdyZWFkaW5nJywgY291bnQ6IDggfSxcbiAgICAgIHsgdGV4dDogJ3BsYW4nLCBjb3VudDogNyB9LFxuICAgICAgeyB0ZXh0OiAnZm9jdXMnLCBjb3VudDogNiB9LFxuICAgICAgeyB0ZXh0OiAnaGFiaXQnLCBjb3VudDogNSB9LFxuICAgICAgeyB0ZXh0OiAnZ29hbHMnLCBjb3VudDogNCB9LFxuICAgIF07XG5cbiAgICByZXR1cm4gbWFwQ291bnRzVG9XZWlnaHRlZFdvcmRzKHRlbXBsYXRlLm1hcCgoZW50cnkpID0+IFtlbnRyeS50ZXh0LCBlbnRyeS5jb3VudF0gYXMgW3N0cmluZywgbnVtYmVyXSksIHJlbmRlclNldHRpbmdzKTtcbiAgfVxufVxuIiwgImltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFdlaWdodGVkV29yZCB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcENvdW50c1RvV2VpZ2h0ZWRXb3JkcyhcbiAgZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sXG4gIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyxcbik6IFdlaWdodGVkV29yZFtdIHtcbiAgaWYgKGVudHJpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgbWluRm9udFNpemUgPSBNYXRoLm1heCg4LCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLm1pbkZvbnRTaXplKSk7XG4gIGNvbnN0IG1heEZvbnRTaXplID0gTWF0aC5tYXgobWluRm9udFNpemUgKyAxLCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLm1heEZvbnRTaXplKSk7XG4gIGNvbnN0IGVtcGhhc2lzID0gTWF0aC5tYXgoMC41LCBNYXRoLm1pbigzLCByZW5kZXJTZXR0aW5ncy5lbXBoYXNpcykpO1xuXG4gIGNvbnN0IG5vcm1hbGl6ZWRFbnRyaWVzID0gZW50cmllc1xuICAgIC5tYXAoKFt0ZXh0LCBjb3VudF0sIGluZGV4KSA9PiAoe1xuICAgICAgdGV4dCxcbiAgICAgIGNvdW50LFxuICAgICAgaW5kZXgsXG4gICAgICBzY29yZTogY29tcHV0ZVNjYWxlU2NvcmUoY291bnQsIGluZGV4LCBlbnRyaWVzLCByZW5kZXJTZXR0aW5ncywgZW1waGFzaXMpLFxuICAgIH0pKVxuICAgIC5zb3J0KChhLCBiKSA9PiBiLmNvdW50IC0gYS5jb3VudCB8fCBhLmluZGV4IC0gYi5pbmRleCk7XG5cbiAgcmV0dXJuIG5vcm1hbGl6ZWRFbnRyaWVzLm1hcCgoZW50cnkpID0+IHtcbiAgICBjb25zdCBzaXplID0gTWF0aC5yb3VuZChtaW5Gb250U2l6ZSArIGVudHJ5LnNjb3JlICogKG1heEZvbnRTaXplIC0gbWluRm9udFNpemUpKTtcbiAgICByZXR1cm4ge1xuICAgICAgdGV4dDogZW50cnkudGV4dCxcbiAgICAgIGNvdW50OiBlbnRyeS5jb3VudCxcbiAgICAgIHNpemUsXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVTY2FsZVNjb3JlKFxuICBjb3VudDogbnVtYmVyLFxuICBpbmRleDogbnVtYmVyLFxuICBlbnRyaWVzOiBBcnJheTxbc3RyaW5nLCBudW1iZXJdPixcbiAgcmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzLFxuICBlbXBoYXNpczogbnVtYmVyLFxuKTogbnVtYmVyIHtcbiAgY29uc3QgY291bnRzID0gZW50cmllcy5tYXAoKFssIGVudHJ5Q291bnRdKSA9PiBlbnRyeUNvdW50KTtcbiAgY29uc3QgbWluQ291bnQgPSBjb3VudHNbY291bnRzLmxlbmd0aCAtIDFdO1xuICBjb25zdCBtYXhDb3VudCA9IGNvdW50c1swXTtcblxuICBpZiAobWF4Q291bnQgPD0gbWluQ291bnQpIHtcbiAgICByZXR1cm4gMC41O1xuICB9XG5cbiAgaWYgKHJlbmRlclNldHRpbmdzLnNjYWxpbmdNb2RlID09PSAncmFuaycpIHtcbiAgICBpZiAoZW50cmllcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiAwLjU7XG4gICAgfVxuICAgIHJldHVybiAxIC0gaW5kZXggLyAoZW50cmllcy5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5zY2FsaW5nTW9kZSA9PT0gJ2xvZycpIHtcbiAgICBjb25zdCBzYWZlTWluID0gTWF0aC5tYXgoMSwgbWluQ291bnQpO1xuICAgIGNvbnN0IHNhZmVNYXggPSBNYXRoLm1heChzYWZlTWluICsgMSwgbWF4Q291bnQpO1xuICAgIGNvbnN0IG51bWVyYXRvciA9IE1hdGgubG9nKE1hdGgubWF4KDEsIGNvdW50KSkgLSBNYXRoLmxvZyhzYWZlTWluKTtcbiAgICBjb25zdCBkZW5vbWluYXRvciA9IE1hdGgubG9nKHNhZmVNYXgpIC0gTWF0aC5sb2coc2FmZU1pbik7XG4gICAgcmV0dXJuIGNsYW1wMDEoZGVub21pbmF0b3IgPT09IDAgPyAwLjUgOiBudW1lcmF0b3IgLyBkZW5vbWluYXRvcik7XG4gIH1cblxuICBjb25zdCBsaW5lYXIgPSAoY291bnQgLSBtaW5Db3VudCkgLyAobWF4Q291bnQgLSBtaW5Db3VudCk7XG4gIGlmIChyZW5kZXJTZXR0aW5ncy5zY2FsaW5nTW9kZSA9PT0gJ3Bvd2VyJykge1xuICAgIHJldHVybiBjbGFtcDAxKE1hdGgucG93KGxpbmVhciwgZW1waGFzaXMpKTtcbiAgfVxuXG4gIHJldHVybiBjbGFtcDAxKGxpbmVhcik7XG59XG5cbmZ1bmN0aW9uIGNsYW1wMDEodmFsdWU6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCB2YWx1ZSkpO1xufVxuIiwgImV4cG9ydCBjbGFzcyBJbnRlcm5NYXAgZXh0ZW5kcyBNYXAge1xuICBjb25zdHJ1Y3RvcihlbnRyaWVzLCBrZXkgPSBrZXlvZikge1xuICAgIHN1cGVyKCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge19pbnRlcm46IHt2YWx1ZTogbmV3IE1hcCgpfSwgX2tleToge3ZhbHVlOiBrZXl9fSk7XG4gICAgaWYgKGVudHJpZXMgIT0gbnVsbCkgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZW50cmllcykgdGhpcy5zZXQoa2V5LCB2YWx1ZSk7XG4gIH1cbiAgZ2V0KGtleSkge1xuICAgIHJldHVybiBzdXBlci5nZXQoaW50ZXJuX2dldCh0aGlzLCBrZXkpKTtcbiAgfVxuICBoYXMoa2V5KSB7XG4gICAgcmV0dXJuIHN1cGVyLmhhcyhpbnRlcm5fZ2V0KHRoaXMsIGtleSkpO1xuICB9XG4gIHNldChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLnNldChpbnRlcm5fc2V0KHRoaXMsIGtleSksIHZhbHVlKTtcbiAgfVxuICBkZWxldGUoa2V5KSB7XG4gICAgcmV0dXJuIHN1cGVyLmRlbGV0ZShpbnRlcm5fZGVsZXRlKHRoaXMsIGtleSkpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5TZXQgZXh0ZW5kcyBTZXQge1xuICBjb25zdHJ1Y3Rvcih2YWx1ZXMsIGtleSA9IGtleW9mKSB7XG4gICAgc3VwZXIoKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7X2ludGVybjoge3ZhbHVlOiBuZXcgTWFwKCl9LCBfa2V5OiB7dmFsdWU6IGtleX19KTtcbiAgICBpZiAodmFsdWVzICE9IG51bGwpIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB0aGlzLmFkZCh2YWx1ZSk7XG4gIH1cbiAgaGFzKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmhhcyhpbnRlcm5fZ2V0KHRoaXMsIHZhbHVlKSk7XG4gIH1cbiAgYWRkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmFkZChpbnRlcm5fc2V0KHRoaXMsIHZhbHVlKSk7XG4gIH1cbiAgZGVsZXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmRlbGV0ZShpbnRlcm5fZGVsZXRlKHRoaXMsIHZhbHVlKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW50ZXJuX2dldCh7X2ludGVybiwgX2tleX0sIHZhbHVlKSB7XG4gIGNvbnN0IGtleSA9IF9rZXkodmFsdWUpO1xuICByZXR1cm4gX2ludGVybi5oYXMoa2V5KSA/IF9pbnRlcm4uZ2V0KGtleSkgOiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gaW50ZXJuX3NldCh7X2ludGVybiwgX2tleX0sIHZhbHVlKSB7XG4gIGNvbnN0IGtleSA9IF9rZXkodmFsdWUpO1xuICBpZiAoX2ludGVybi5oYXMoa2V5KSkgcmV0dXJuIF9pbnRlcm4uZ2V0KGtleSk7XG4gIF9pbnRlcm4uc2V0KGtleSwgdmFsdWUpO1xuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGludGVybl9kZWxldGUoe19pbnRlcm4sIF9rZXl9LCB2YWx1ZSkge1xuICBjb25zdCBrZXkgPSBfa2V5KHZhbHVlKTtcbiAgaWYgKF9pbnRlcm4uaGFzKGtleSkpIHtcbiAgICB2YWx1ZSA9IF9pbnRlcm4uZ2V0KGtleSk7XG4gICAgX2ludGVybi5kZWxldGUoa2V5KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGtleW9mKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gaW5pdFJhbmdlKGRvbWFpbiwgcmFuZ2UpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiBicmVhaztcbiAgICBjYXNlIDE6IHRoaXMucmFuZ2UoZG9tYWluKTsgYnJlYWs7XG4gICAgZGVmYXVsdDogdGhpcy5yYW5nZShyYW5nZSkuZG9tYWluKGRvbWFpbik7IGJyZWFrO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdEludGVycG9sYXRvcihkb21haW4sIGludGVycG9sYXRvcikge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IGJyZWFrO1xuICAgIGNhc2UgMToge1xuICAgICAgaWYgKHR5cGVvZiBkb21haW4gPT09IFwiZnVuY3Rpb25cIikgdGhpcy5pbnRlcnBvbGF0b3IoZG9tYWluKTtcbiAgICAgIGVsc2UgdGhpcy5yYW5nZShkb21haW4pO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHRoaXMuZG9tYWluKGRvbWFpbik7XG4gICAgICBpZiAodHlwZW9mIGludGVycG9sYXRvciA9PT0gXCJmdW5jdGlvblwiKSB0aGlzLmludGVycG9sYXRvcihpbnRlcnBvbGF0b3IpO1xuICAgICAgZWxzZSB0aGlzLnJhbmdlKGludGVycG9sYXRvcik7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiaW1wb3J0IHtJbnRlcm5NYXB9IGZyb20gXCJkMy1hcnJheVwiO1xuaW1wb3J0IHtpbml0UmFuZ2V9IGZyb20gXCIuL2luaXQuanNcIjtcblxuZXhwb3J0IGNvbnN0IGltcGxpY2l0ID0gU3ltYm9sKFwiaW1wbGljaXRcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9yZGluYWwoKSB7XG4gIHZhciBpbmRleCA9IG5ldyBJbnRlcm5NYXAoKSxcbiAgICAgIGRvbWFpbiA9IFtdLFxuICAgICAgcmFuZ2UgPSBbXSxcbiAgICAgIHVua25vd24gPSBpbXBsaWNpdDtcblxuICBmdW5jdGlvbiBzY2FsZShkKSB7XG4gICAgbGV0IGkgPSBpbmRleC5nZXQoZCk7XG4gICAgaWYgKGkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHVua25vd24gIT09IGltcGxpY2l0KSByZXR1cm4gdW5rbm93bjtcbiAgICAgIGluZGV4LnNldChkLCBpID0gZG9tYWluLnB1c2goZCkgLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhbmdlW2kgJSByYW5nZS5sZW5ndGhdO1xuICB9XG5cbiAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oXykge1xuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRvbWFpbi5zbGljZSgpO1xuICAgIGRvbWFpbiA9IFtdLCBpbmRleCA9IG5ldyBJbnRlcm5NYXAoKTtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIF8pIHtcbiAgICAgIGlmIChpbmRleC5oYXModmFsdWUpKSBjb250aW51ZTtcbiAgICAgIGluZGV4LnNldCh2YWx1ZSwgZG9tYWluLnB1c2godmFsdWUpIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiBzY2FsZTtcbiAgfTtcblxuICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChyYW5nZSA9IEFycmF5LmZyb20oXyksIHNjYWxlKSA6IHJhbmdlLnNsaWNlKCk7XG4gIH07XG5cbiAgc2NhbGUudW5rbm93biA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh1bmtub3duID0gXywgc2NhbGUpIDogdW5rbm93bjtcbiAgfTtcblxuICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG9yZGluYWwoZG9tYWluLCByYW5nZSkudW5rbm93bih1bmtub3duKTtcbiAgfTtcblxuICBpbml0UmFuZ2UuYXBwbHkoc2NhbGUsIGFyZ3VtZW50cyk7XG5cbiAgcmV0dXJuIHNjYWxlO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICB2YXIgbiA9IHNwZWNpZmllci5sZW5ndGggLyA2IHwgMCwgY29sb3JzID0gbmV3IEFycmF5KG4pLCBpID0gMDtcbiAgd2hpbGUgKGkgPCBuKSBjb2xvcnNbaV0gPSBcIiNcIiArIHNwZWNpZmllci5zbGljZShpICogNiwgKytpICogNik7XG4gIHJldHVybiBjb2xvcnM7XG59XG4iLCAiaW1wb3J0IGNvbG9ycyBmcm9tIFwiLi4vY29sb3JzLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbG9ycyhcIjRlNzlhN2YyOGUyY2UxNTc1OTc2YjdiMjU5YTE0ZmVkYzk0OWFmN2FhMWZmOWRhNzljNzU1ZmJhYjBhYlwiKTtcbiIsICJleHBvcnQgdmFyIHhodG1sID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc3ZnOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gIHhodG1sOiB4aHRtbCxcbiAgeGxpbms6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLFxuICB4bWw6IFwiaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlXCIsXG4gIHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvXCJcbn07XG4iLCAiaW1wb3J0IG5hbWVzcGFjZXMgZnJvbSBcIi4vbmFtZXNwYWNlcy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBwcmVmaXggPSBuYW1lICs9IFwiXCIsIGkgPSBwcmVmaXguaW5kZXhPZihcIjpcIik7XG4gIGlmIChpID49IDAgJiYgKHByZWZpeCA9IG5hbWUuc2xpY2UoMCwgaSkpICE9PSBcInhtbG5zXCIpIG5hbWUgPSBuYW1lLnNsaWNlKGkgKyAxKTtcbiAgcmV0dXJuIG5hbWVzcGFjZXMuaGFzT3duUHJvcGVydHkocHJlZml4KSA/IHtzcGFjZTogbmFtZXNwYWNlc1twcmVmaXhdLCBsb2NhbDogbmFtZX0gOiBuYW1lOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xufVxuIiwgImltcG9ydCBuYW1lc3BhY2UgZnJvbSBcIi4vbmFtZXNwYWNlLmpzXCI7XG5pbXBvcnQge3hodG1sfSBmcm9tIFwiLi9uYW1lc3BhY2VzLmpzXCI7XG5cbmZ1bmN0aW9uIGNyZWF0b3JJbmhlcml0KG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBkb2N1bWVudCA9IHRoaXMub3duZXJEb2N1bWVudCxcbiAgICAgICAgdXJpID0gdGhpcy5uYW1lc3BhY2VVUkk7XG4gICAgcmV0dXJuIHVyaSA9PT0geGh0bWwgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm5hbWVzcGFjZVVSSSA9PT0geGh0bWxcbiAgICAgICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpXG4gICAgICAgIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHVyaSwgbmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0b3JGaXhlZChmdWxsbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICB2YXIgZnVsbG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG4gIHJldHVybiAoZnVsbG5hbWUubG9jYWxcbiAgICAgID8gY3JlYXRvckZpeGVkXG4gICAgICA6IGNyZWF0b3JJbmhlcml0KShmdWxsbmFtZSk7XG59XG4iLCAiZnVuY3Rpb24gbm9uZSgpIHt9XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBzZWxlY3RvciA9PSBudWxsID8gbm9uZSA6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICB9O1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IHNlbGVjdG9yIGZyb20gXCIuLi9zZWxlY3Rvci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3QpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3QgIT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gc2VsZWN0b3Ioc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHN1Ymdyb3VwID0gc3ViZ3JvdXBzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBzdWJub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIChzdWJub2RlID0gc2VsZWN0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKSkge1xuICAgICAgICBpZiAoXCJfX2RhdGFfX1wiIGluIG5vZGUpIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgICBzdWJncm91cFtpXSA9IHN1Ym5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsICIvLyBHaXZlbiBzb21ldGhpbmcgYXJyYXkgbGlrZSAob3IgbnVsbCksIHJldHVybnMgc29tZXRoaW5nIHRoYXQgaXMgc3RyaWN0bHkgYW5cbi8vIGFycmF5LiBUaGlzIGlzIHVzZWQgdG8gZW5zdXJlIHRoYXQgYXJyYXktbGlrZSBvYmplY3RzIHBhc3NlZCB0byBkMy5zZWxlY3RBbGxcbi8vIG9yIHNlbGVjdGlvbi5zZWxlY3RBbGwgYXJlIGNvbnZlcnRlZCBpbnRvIHByb3BlciBhcnJheXMgd2hlbiBjcmVhdGluZyBhXG4vLyBzZWxlY3Rpb247IHdlIGRvblx1MjAxOXQgZXZlciB3YW50IHRvIGNyZWF0ZSBhIHNlbGVjdGlvbiBiYWNrZWQgYnkgYSBsaXZlXG4vLyBIVE1MQ29sbGVjdGlvbiBvciBOb2RlTGlzdC4gSG93ZXZlciwgbm90ZSB0aGF0IHNlbGVjdGlvbi5zZWxlY3RBbGwgd2lsbCB1c2UgYVxuLy8gc3RhdGljIE5vZGVMaXN0IGFzIGEgZ3JvdXAsIHNpbmNlIGl0IHNhZmVseSBkZXJpdmVkIGZyb20gcXVlcnlTZWxlY3RvckFsbC5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFycmF5KHgpIHtcbiAgcmV0dXJuIHggPT0gbnVsbCA/IFtdIDogQXJyYXkuaXNBcnJheSh4KSA/IHggOiBBcnJheS5mcm9tKHgpO1xufVxuIiwgImZ1bmN0aW9uIGVtcHR5KCkge1xuICByZXR1cm4gW107XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBzZWxlY3RvciA9PSBudWxsID8gZW1wdHkgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBhcnJheSBmcm9tIFwiLi4vYXJyYXkuanNcIjtcbmltcG9ydCBzZWxlY3RvckFsbCBmcm9tIFwiLi4vc2VsZWN0b3JBbGwuanNcIjtcblxuZnVuY3Rpb24gYXJyYXlBbGwoc2VsZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYXJyYXkoc2VsZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3QpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3QgPT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gYXJyYXlBbGwoc2VsZWN0KTtcbiAgZWxzZSBzZWxlY3QgPSBzZWxlY3RvckFsbChzZWxlY3QpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IFtdLCBwYXJlbnRzID0gW10sIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHN1Ymdyb3Vwcy5wdXNoKHNlbGVjdC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSk7XG4gICAgICAgIHBhcmVudHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzdWJncm91cHMsIHBhcmVudHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaGVzKHNlbGVjdG9yKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoaWxkTWF0Y2hlcihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24obm9kZSkge1xuICAgIHJldHVybiBub2RlLm1hdGNoZXMoc2VsZWN0b3IpO1xuICB9O1xufVxuXG4iLCAiaW1wb3J0IHtjaGlsZE1hdGNoZXJ9IGZyb20gXCIuLi9tYXRjaGVyLmpzXCI7XG5cbnZhciBmaW5kID0gQXJyYXkucHJvdG90eXBlLmZpbmQ7XG5cbmZ1bmN0aW9uIGNoaWxkRmluZChtYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZpbmQuY2FsbCh0aGlzLmNoaWxkcmVuLCBtYXRjaCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNoaWxkRmlyc3QoKSB7XG4gIHJldHVybiB0aGlzLmZpcnN0RWxlbWVudENoaWxkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYXRjaCkge1xuICByZXR1cm4gdGhpcy5zZWxlY3QobWF0Y2ggPT0gbnVsbCA/IGNoaWxkRmlyc3RcbiAgICAgIDogY2hpbGRGaW5kKHR5cGVvZiBtYXRjaCA9PT0gXCJmdW5jdGlvblwiID8gbWF0Y2ggOiBjaGlsZE1hdGNoZXIobWF0Y2gpKSk7XG59XG4iLCAiaW1wb3J0IHtjaGlsZE1hdGNoZXJ9IGZyb20gXCIuLi9tYXRjaGVyLmpzXCI7XG5cbnZhciBmaWx0ZXIgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyO1xuXG5mdW5jdGlvbiBjaGlsZHJlbigpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5jaGlsZHJlbik7XG59XG5cbmZ1bmN0aW9uIGNoaWxkcmVuRmlsdGVyKG1hdGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmlsdGVyLmNhbGwodGhpcy5jaGlsZHJlbiwgbWF0Y2gpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYXRjaCkge1xuICByZXR1cm4gdGhpcy5zZWxlY3RBbGwobWF0Y2ggPT0gbnVsbCA/IGNoaWxkcmVuXG4gICAgICA6IGNoaWxkcmVuRmlsdGVyKHR5cGVvZiBtYXRjaCA9PT0gXCJmdW5jdGlvblwiID8gbWF0Y2ggOiBjaGlsZE1hdGNoZXIobWF0Y2gpKSk7XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQgbWF0Y2hlciBmcm9tIFwiLi4vbWF0Y2hlci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYXRjaCkge1xuICBpZiAodHlwZW9mIG1hdGNoICE9PSBcImZ1bmN0aW9uXCIpIG1hdGNoID0gbWF0Y2hlcihtYXRjaCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzdWJncm91cCA9IHN1Ymdyb3Vwc1tqXSA9IFtdLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIG1hdGNoLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih1cGRhdGUpIHtcbiAgcmV0dXJuIG5ldyBBcnJheSh1cGRhdGUubGVuZ3RoKTtcbn1cbiIsICJpbXBvcnQgc3BhcnNlIGZyb20gXCIuL3NwYXJzZS5qc1wiO1xuaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbih0aGlzLl9lbnRlciB8fCB0aGlzLl9ncm91cHMubWFwKHNwYXJzZSksIHRoaXMuX3BhcmVudHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRW50ZXJOb2RlKHBhcmVudCwgZGF0dW0pIHtcbiAgdGhpcy5vd25lckRvY3VtZW50ID0gcGFyZW50Lm93bmVyRG9jdW1lbnQ7XG4gIHRoaXMubmFtZXNwYWNlVVJJID0gcGFyZW50Lm5hbWVzcGFjZVVSSTtcbiAgdGhpcy5fbmV4dCA9IG51bGw7XG4gIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5fX2RhdGFfXyA9IGRhdHVtO1xufVxuXG5FbnRlck5vZGUucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogRW50ZXJOb2RlLFxuICBhcHBlbmRDaGlsZDogZnVuY3Rpb24oY2hpbGQpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIHRoaXMuX25leHQpOyB9LFxuICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKGNoaWxkLCBuZXh0KSB7IHJldHVybiB0aGlzLl9wYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBuZXh0KTsgfSxcbiAgcXVlcnlTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTsgfSxcbiAgcXVlcnlTZWxlY3RvckFsbDogZnVuY3Rpb24oc2VsZWN0b3IpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTsgfVxufTtcbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geDtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCB7RW50ZXJOb2RlfSBmcm9tIFwiLi9lbnRlci5qc1wiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuLi9jb25zdGFudC5qc1wiO1xuXG5mdW5jdGlvbiBiaW5kSW5kZXgocGFyZW50LCBncm91cCwgZW50ZXIsIHVwZGF0ZSwgZXhpdCwgZGF0YSkge1xuICB2YXIgaSA9IDAsXG4gICAgICBub2RlLFxuICAgICAgZ3JvdXBMZW5ndGggPSBncm91cC5sZW5ndGgsXG4gICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XG5cbiAgLy8gUHV0IGFueSBub24tbnVsbCBub2RlcyB0aGF0IGZpdCBpbnRvIHVwZGF0ZS5cbiAgLy8gUHV0IGFueSBudWxsIG5vZGVzIGludG8gZW50ZXIuXG4gIC8vIFB1dCBhbnkgcmVtYWluaW5nIGRhdGEgaW50byBlbnRlci5cbiAgZm9yICg7IGkgPCBkYXRhTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBub2RlLl9fZGF0YV9fID0gZGF0YVtpXTtcbiAgICAgIHVwZGF0ZVtpXSA9IG5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudGVyW2ldID0gbmV3IEVudGVyTm9kZShwYXJlbnQsIGRhdGFbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFB1dCBhbnkgbm9uLW51bGwgbm9kZXMgdGhhdCBkb25cdTIwMTl0IGZpdCBpbnRvIGV4aXQuXG4gIGZvciAoOyBpIDwgZ3JvdXBMZW5ndGg7ICsraSkge1xuICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBiaW5kS2V5KHBhcmVudCwgZ3JvdXAsIGVudGVyLCB1cGRhdGUsIGV4aXQsIGRhdGEsIGtleSkge1xuICB2YXIgaSxcbiAgICAgIG5vZGUsXG4gICAgICBub2RlQnlLZXlWYWx1ZSA9IG5ldyBNYXAsXG4gICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgIGtleVZhbHVlcyA9IG5ldyBBcnJheShncm91cExlbmd0aCksXG4gICAgICBrZXlWYWx1ZTtcblxuICAvLyBDb21wdXRlIHRoZSBrZXkgZm9yIGVhY2ggbm9kZS5cbiAgLy8gSWYgbXVsdGlwbGUgbm9kZXMgaGF2ZSB0aGUgc2FtZSBrZXksIHRoZSBkdXBsaWNhdGVzIGFyZSBhZGRlZCB0byBleGl0LlxuICBmb3IgKGkgPSAwOyBpIDwgZ3JvdXBMZW5ndGg7ICsraSkge1xuICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgIGtleVZhbHVlc1tpXSA9IGtleVZhbHVlID0ga2V5LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApICsgXCJcIjtcbiAgICAgIGlmIChub2RlQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWUpKSB7XG4gICAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCBub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb21wdXRlIHRoZSBrZXkgZm9yIGVhY2ggZGF0dW0uXG4gIC8vIElmIHRoZXJlIGEgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBrZXksIGpvaW4gYW5kIGFkZCBpdCB0byB1cGRhdGUuXG4gIC8vIElmIHRoZXJlIGlzIG5vdCAob3IgdGhlIGtleSBpcyBhIGR1cGxpY2F0ZSksIGFkZCBpdCB0byBlbnRlci5cbiAgZm9yIChpID0gMDsgaSA8IGRhdGFMZW5ndGg7ICsraSkge1xuICAgIGtleVZhbHVlID0ga2V5LmNhbGwocGFyZW50LCBkYXRhW2ldLCBpLCBkYXRhKSArIFwiXCI7XG4gICAgaWYgKG5vZGUgPSBub2RlQnlLZXlWYWx1ZS5nZXQoa2V5VmFsdWUpKSB7XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICBub2RlQnlLZXlWYWx1ZS5kZWxldGUoa2V5VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgYW55IHJlbWFpbmluZyBub2RlcyB0aGF0IHdlcmUgbm90IGJvdW5kIHRvIGRhdGEgdG8gZXhpdC5cbiAgZm9yIChpID0gMDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKG5vZGVCeUtleVZhbHVlLmdldChrZXlWYWx1ZXNbaV0pID09PSBub2RlKSkge1xuICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRhdHVtKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuX19kYXRhX187XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLCBkYXR1bSk7XG5cbiAgdmFyIGJpbmQgPSBrZXkgPyBiaW5kS2V5IDogYmluZEluZGV4LFxuICAgICAgcGFyZW50cyA9IHRoaXMuX3BhcmVudHMsXG4gICAgICBncm91cHMgPSB0aGlzLl9ncm91cHM7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB2YWx1ZSA9IGNvbnN0YW50KHZhbHVlKTtcblxuICBmb3IgKHZhciBtID0gZ3JvdXBzLmxlbmd0aCwgdXBkYXRlID0gbmV3IEFycmF5KG0pLCBlbnRlciA9IG5ldyBBcnJheShtKSwgZXhpdCA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICB2YXIgcGFyZW50ID0gcGFyZW50c1tqXSxcbiAgICAgICAgZ3JvdXAgPSBncm91cHNbal0sXG4gICAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgICBkYXRhID0gYXJyYXlsaWtlKHZhbHVlLmNhbGwocGFyZW50LCBwYXJlbnQgJiYgcGFyZW50Ll9fZGF0YV9fLCBqLCBwYXJlbnRzKSksXG4gICAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgICAgZW50ZXJHcm91cCA9IGVudGVyW2pdID0gbmV3IEFycmF5KGRhdGFMZW5ndGgpLFxuICAgICAgICB1cGRhdGVHcm91cCA9IHVwZGF0ZVtqXSA9IG5ldyBBcnJheShkYXRhTGVuZ3RoKSxcbiAgICAgICAgZXhpdEdyb3VwID0gZXhpdFtqXSA9IG5ldyBBcnJheShncm91cExlbmd0aCk7XG5cbiAgICBiaW5kKHBhcmVudCwgZ3JvdXAsIGVudGVyR3JvdXAsIHVwZGF0ZUdyb3VwLCBleGl0R3JvdXAsIGRhdGEsIGtleSk7XG5cbiAgICAvLyBOb3cgY29ubmVjdCB0aGUgZW50ZXIgbm9kZXMgdG8gdGhlaXIgZm9sbG93aW5nIHVwZGF0ZSBub2RlLCBzdWNoIHRoYXRcbiAgICAvLyBhcHBlbmRDaGlsZCBjYW4gaW5zZXJ0IHRoZSBtYXRlcmlhbGl6ZWQgZW50ZXIgbm9kZSBiZWZvcmUgdGhpcyBub2RlLFxuICAgIC8vIHJhdGhlciB0aGFuIGF0IHRoZSBlbmQgb2YgdGhlIHBhcmVudCBub2RlLlxuICAgIGZvciAodmFyIGkwID0gMCwgaTEgPSAwLCBwcmV2aW91cywgbmV4dDsgaTAgPCBkYXRhTGVuZ3RoOyArK2kwKSB7XG4gICAgICBpZiAocHJldmlvdXMgPSBlbnRlckdyb3VwW2kwXSkge1xuICAgICAgICBpZiAoaTAgPj0gaTEpIGkxID0gaTAgKyAxO1xuICAgICAgICB3aGlsZSAoIShuZXh0ID0gdXBkYXRlR3JvdXBbaTFdKSAmJiArK2kxIDwgZGF0YUxlbmd0aCk7XG4gICAgICAgIHByZXZpb3VzLl9uZXh0ID0gbmV4dCB8fCBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSA9IG5ldyBTZWxlY3Rpb24odXBkYXRlLCBwYXJlbnRzKTtcbiAgdXBkYXRlLl9lbnRlciA9IGVudGVyO1xuICB1cGRhdGUuX2V4aXQgPSBleGl0O1xuICByZXR1cm4gdXBkYXRlO1xufVxuXG4vLyBHaXZlbiBzb21lIGRhdGEsIHRoaXMgcmV0dXJucyBhbiBhcnJheS1saWtlIHZpZXcgb2YgaXQ6IGFuIG9iamVjdCB0aGF0XG4vLyBleHBvc2VzIGEgbGVuZ3RoIHByb3BlcnR5IGFuZCBhbGxvd3MgbnVtZXJpYyBpbmRleGluZy4gTm90ZSB0aGF0IHVubGlrZVxuLy8gc2VsZWN0QWxsLCB0aGlzIGlzblx1MjAxOXQgd29ycmllZCBhYm91dCBcdTIwMUNsaXZlXHUyMDFEIGNvbGxlY3Rpb25zIGJlY2F1c2UgdGhlIHJlc3VsdGluZ1xuLy8gYXJyYXkgd2lsbCBvbmx5IGJlIHVzZWQgYnJpZWZseSB3aGlsZSBkYXRhIGlzIGJlaW5nIGJvdW5kLiAoSXQgaXMgcG9zc2libGUgdG9cbi8vIGNhdXNlIHRoZSBkYXRhIHRvIGNoYW5nZSB3aGlsZSBpdGVyYXRpbmcgYnkgdXNpbmcgYSBrZXkgZnVuY3Rpb24sIGJ1dCBwbGVhc2Vcbi8vIGRvblx1MjAxOXQ7IHdlXHUyMDE5ZCByYXRoZXIgYXZvaWQgYSBncmF0dWl0b3VzIGNvcHkuKVxuZnVuY3Rpb24gYXJyYXlsaWtlKGRhdGEpIHtcbiAgcmV0dXJuIHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiICYmIFwibGVuZ3RoXCIgaW4gZGF0YVxuICAgID8gZGF0YSAvLyBBcnJheSwgVHlwZWRBcnJheSwgTm9kZUxpc3QsIGFycmF5LWxpa2VcbiAgICA6IEFycmF5LmZyb20oZGF0YSk7IC8vIE1hcCwgU2V0LCBpdGVyYWJsZSwgc3RyaW5nLCBvciBhbnl0aGluZyBlbHNlXG59XG4iLCAiaW1wb3J0IHNwYXJzZSBmcm9tIFwiLi9zcGFyc2UuanNcIjtcbmltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odGhpcy5fZXhpdCB8fCB0aGlzLl9ncm91cHMubWFwKHNwYXJzZSksIHRoaXMuX3BhcmVudHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9uZW50ZXIsIG9udXBkYXRlLCBvbmV4aXQpIHtcbiAgdmFyIGVudGVyID0gdGhpcy5lbnRlcigpLCB1cGRhdGUgPSB0aGlzLCBleGl0ID0gdGhpcy5leGl0KCk7XG4gIGlmICh0eXBlb2Ygb25lbnRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZW50ZXIgPSBvbmVudGVyKGVudGVyKTtcbiAgICBpZiAoZW50ZXIpIGVudGVyID0gZW50ZXIuc2VsZWN0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgZW50ZXIgPSBlbnRlci5hcHBlbmQob25lbnRlciArIFwiXCIpO1xuICB9XG4gIGlmIChvbnVwZGF0ZSAhPSBudWxsKSB7XG4gICAgdXBkYXRlID0gb251cGRhdGUodXBkYXRlKTtcbiAgICBpZiAodXBkYXRlKSB1cGRhdGUgPSB1cGRhdGUuc2VsZWN0aW9uKCk7XG4gIH1cbiAgaWYgKG9uZXhpdCA9PSBudWxsKSBleGl0LnJlbW92ZSgpOyBlbHNlIG9uZXhpdChleGl0KTtcbiAgcmV0dXJuIGVudGVyICYmIHVwZGF0ZSA/IGVudGVyLm1lcmdlKHVwZGF0ZSkub3JkZXIoKSA6IHVwZGF0ZTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29udGV4dCkge1xuICB2YXIgc2VsZWN0aW9uID0gY29udGV4dC5zZWxlY3Rpb24gPyBjb250ZXh0LnNlbGVjdGlvbigpIDogY29udGV4dDtcblxuICBmb3IgKHZhciBncm91cHMwID0gdGhpcy5fZ3JvdXBzLCBncm91cHMxID0gc2VsZWN0aW9uLl9ncm91cHMsIG0wID0gZ3JvdXBzMC5sZW5ndGgsIG0xID0gZ3JvdXBzMS5sZW5ndGgsIG0gPSBNYXRoLm1pbihtMCwgbTEpLCBtZXJnZXMgPSBuZXcgQXJyYXkobTApLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwMCA9IGdyb3VwczBbal0sIGdyb3VwMSA9IGdyb3VwczFbal0sIG4gPSBncm91cDAubGVuZ3RoLCBtZXJnZSA9IG1lcmdlc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXAwW2ldIHx8IGdyb3VwMVtpXSkge1xuICAgICAgICBtZXJnZVtpXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IGogPCBtMDsgKytqKSB7XG4gICAgbWVyZ2VzW2pdID0gZ3JvdXBzMFtqXTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKG1lcmdlcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gLTEsIG0gPSBncm91cHMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gZ3JvdXAubGVuZ3RoIC0gMSwgbmV4dCA9IGdyb3VwW2ldLCBub2RlOyAtLWkgPj0gMDspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgaWYgKG5leHQgJiYgbm9kZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihuZXh0KSBeIDQpIG5leHQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgbmV4dCk7XG4gICAgICAgIG5leHQgPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb21wYXJlKSB7XG4gIGlmICghY29tcGFyZSkgY29tcGFyZSA9IGFzY2VuZGluZztcblxuICBmdW5jdGlvbiBjb21wYXJlTm9kZShhLCBiKSB7XG4gICAgcmV0dXJuIGEgJiYgYiA/IGNvbXBhcmUoYS5fX2RhdGFfXywgYi5fX2RhdGFfXykgOiAhYSAtICFiO1xuICB9XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc29ydGdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc29ydGdyb3VwID0gc29ydGdyb3Vwc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc29ydGdyb3VwW2ldID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gICAgc29ydGdyb3VwLnNvcnQoY29tcGFyZU5vZGUpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc29ydGdyb3VwcywgdGhpcy5fcGFyZW50cykub3JkZXIoKTtcbn1cblxuZnVuY3Rpb24gYXNjZW5kaW5nKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbMF07XG4gIGFyZ3VtZW50c1swXSA9IHRoaXM7XG4gIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgdmFyIG5vZGUgPSBncm91cFtpXTtcbiAgICAgIGlmIChub2RlKSByZXR1cm4gbm9kZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgbGV0IHNpemUgPSAwO1xuICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcykgKytzaXplOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHJldHVybiBzaXplO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMubm9kZSgpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGgsIG5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIGNhbGxiYWNrLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCBuYW1lc3BhY2UgZnJvbSBcIi4uL25hbWVzcGFjZS5qc1wiO1xuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlTlMoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckNvbnN0YW50KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJDb25zdGFudE5TKGZ1bGxuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIHZhbHVlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uTlMoZnVsbG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIHYpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgZnVsbG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICByZXR1cm4gZnVsbG5hbWUubG9jYWxcbiAgICAgICAgPyBub2RlLmdldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbClcbiAgICAgICAgOiBub2RlLmdldEF0dHJpYnV0ZShmdWxsbmFtZSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJSZW1vdmVOUyA6IGF0dHJSZW1vdmUpIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJGdW5jdGlvbk5TIDogYXR0ckZ1bmN0aW9uKVxuICAgICAgOiAoZnVsbG5hbWUubG9jYWwgPyBhdHRyQ29uc3RhbnROUyA6IGF0dHJDb25zdGFudCkpKShmdWxsbmFtZSwgdmFsdWUpKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihub2RlKSB7XG4gIHJldHVybiAobm9kZS5vd25lckRvY3VtZW50ICYmIG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldykgLy8gbm9kZSBpcyBhIE5vZGVcbiAgICAgIHx8IChub2RlLmRvY3VtZW50ICYmIG5vZGUpIC8vIG5vZGUgaXMgYSBXaW5kb3dcbiAgICAgIHx8IG5vZGUuZGVmYXVsdFZpZXc7IC8vIG5vZGUgaXMgYSBEb2N1bWVudFxufVxuIiwgImltcG9ydCBkZWZhdWx0VmlldyBmcm9tIFwiLi4vd2luZG93LmpzXCI7XG5cbmZ1bmN0aW9uIHN0eWxlUmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlQ29uc3RhbnQobmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbHVlLCBwcmlvcml0eSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlRnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdiwgcHJpb3JpdHkpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAxXG4gICAgICA/IHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgPyBzdHlsZVJlbW92ZSA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICA/IHN0eWxlRnVuY3Rpb25cbiAgICAgICAgICAgIDogc3R5bGVDb25zdGFudCkobmFtZSwgdmFsdWUsIHByaW9yaXR5ID09IG51bGwgPyBcIlwiIDogcHJpb3JpdHkpKVxuICAgICAgOiBzdHlsZVZhbHVlKHRoaXMubm9kZSgpLCBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0eWxlVmFsdWUobm9kZSwgbmFtZSkge1xuICByZXR1cm4gbm9kZS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpXG4gICAgICB8fCBkZWZhdWx0Vmlldyhub2RlKS5nZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpLmdldFByb3BlcnR5VmFsdWUobmFtZSk7XG59XG4iLCAiZnVuY3Rpb24gcHJvcGVydHlSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5Q29uc3RhbnQobmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXNbbmFtZV0gPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlGdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgIGVsc2UgdGhpc1tuYW1lXSA9IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMVxuICAgICAgPyB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IHByb3BlcnR5UmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IHByb3BlcnR5RnVuY3Rpb25cbiAgICAgICAgICA6IHByb3BlcnR5Q29uc3RhbnQpKG5hbWUsIHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKClbbmFtZV07XG59XG4iLCAiZnVuY3Rpb24gY2xhc3NBcnJheShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy50cmltKCkuc3BsaXQoL158XFxzKy8pO1xufVxuXG5mdW5jdGlvbiBjbGFzc0xpc3Qobm9kZSkge1xuICByZXR1cm4gbm9kZS5jbGFzc0xpc3QgfHwgbmV3IENsYXNzTGlzdChub2RlKTtcbn1cblxuZnVuY3Rpb24gQ2xhc3NMaXN0KG5vZGUpIHtcbiAgdGhpcy5fbm9kZSA9IG5vZGU7XG4gIHRoaXMuX25hbWVzID0gY2xhc3NBcnJheShub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpO1xufVxuXG5DbGFzc0xpc3QucHJvdG90eXBlID0ge1xuICBhZGQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaSA9IHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICB0aGlzLl9uYW1lcy5wdXNoKG5hbWUpO1xuICAgICAgdGhpcy5fbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLl9uYW1lcy5qb2luKFwiIFwiKSk7XG4gICAgfVxuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaSA9IHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgdGhpcy5fbmFtZXMuc3BsaWNlKGksIDEpO1xuICAgICAgdGhpcy5fbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLl9uYW1lcy5qb2luKFwiIFwiKSk7XG4gICAgfVxuICB9LFxuICBjb250YWluczogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpID49IDA7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNsYXNzZWRBZGQobm9kZSwgbmFtZXMpIHtcbiAgdmFyIGxpc3QgPSBjbGFzc0xpc3Qobm9kZSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIGxpc3QuYWRkKG5hbWVzW2ldKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZFJlbW92ZShub2RlLCBuYW1lcykge1xuICB2YXIgbGlzdCA9IGNsYXNzTGlzdChub2RlKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgbGlzdC5yZW1vdmUobmFtZXNbaV0pO1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkVHJ1ZShuYW1lcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY2xhc3NlZEFkZCh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRGYWxzZShuYW1lcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY2xhc3NlZFJlbW92ZSh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRGdW5jdGlvbihuYW1lcywgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICh2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpID8gY2xhc3NlZEFkZCA6IGNsYXNzZWRSZW1vdmUpKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIG5hbWVzID0gY2xhc3NBcnJheShuYW1lICsgXCJcIik7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIGxpc3QgPSBjbGFzc0xpc3QodGhpcy5ub2RlKCkpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICghbGlzdC5jb250YWlucyhuYW1lc1tpXSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGNsYXNzZWRGdW5jdGlvbiA6IHZhbHVlXG4gICAgICA/IGNsYXNzZWRUcnVlXG4gICAgICA6IGNsYXNzZWRGYWxzZSkobmFtZXMsIHZhbHVlKSk7XG59XG4iLCAiZnVuY3Rpb24gdGV4dFJlbW92ZSgpIHtcbiAgdGhpcy50ZXh0Q29udGVudCA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIHRleHRDb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRleHRDb250ZW50ID0gdiA9PSBudWxsID8gXCJcIiA6IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyB0ZXh0UmVtb3ZlIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyB0ZXh0RnVuY3Rpb25cbiAgICAgICAgICA6IHRleHRDb25zdGFudCkodmFsdWUpKVxuICAgICAgOiB0aGlzLm5vZGUoKS50ZXh0Q29udGVudDtcbn1cbiIsICJmdW5jdGlvbiBodG1sUmVtb3ZlKCkge1xuICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIGh0bWxDb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaHRtbEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IGh0bWxSZW1vdmUgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IGh0bWxGdW5jdGlvblxuICAgICAgICAgIDogaHRtbENvbnN0YW50KSh2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpLmlubmVySFRNTDtcbn1cbiIsICJmdW5jdGlvbiByYWlzZSgpIHtcbiAgaWYgKHRoaXMubmV4dFNpYmxpbmcpIHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gocmFpc2UpO1xufVxuIiwgImZ1bmN0aW9uIGxvd2VyKCkge1xuICBpZiAodGhpcy5wcmV2aW91c1NpYmxpbmcpIHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcywgdGhpcy5wYXJlbnROb2RlLmZpcnN0Q2hpbGQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChsb3dlcik7XG59XG4iLCAiaW1wb3J0IGNyZWF0b3IgZnJvbSBcIi4uL2NyZWF0b3IuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICB2YXIgY3JlYXRlID0gdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiA/IG5hbWUgOiBjcmVhdG9yKG5hbWUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kQ2hpbGQoY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9KTtcbn1cbiIsICJpbXBvcnQgY3JlYXRvciBmcm9tIFwiLi4vY3JlYXRvci5qc1wiO1xuaW1wb3J0IHNlbGVjdG9yIGZyb20gXCIuLi9zZWxlY3Rvci5qc1wiO1xuXG5mdW5jdGlvbiBjb25zdGFudE51bGwoKSB7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgdmFyIGNyZWF0ZSA9IHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lIDogY3JlYXRvcihuYW1lKSxcbiAgICAgIHNlbGVjdCA9IGJlZm9yZSA9PSBudWxsID8gY29uc3RhbnROdWxsIDogdHlwZW9mIGJlZm9yZSA9PT0gXCJmdW5jdGlvblwiID8gYmVmb3JlIDogc2VsZWN0b3IoYmVmb3JlKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmluc2VydEJlZm9yZShjcmVhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgc2VsZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgbnVsbCk7XG4gIH0pO1xufVxuIiwgImZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgaWYgKHBhcmVudCkgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChyZW1vdmUpO1xufVxuIiwgImZ1bmN0aW9uIHNlbGVjdGlvbl9jbG9uZVNoYWxsb3coKSB7XG4gIHZhciBjbG9uZSA9IHRoaXMuY2xvbmVOb2RlKGZhbHNlKSwgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICByZXR1cm4gcGFyZW50ID8gcGFyZW50Lmluc2VydEJlZm9yZShjbG9uZSwgdGhpcy5uZXh0U2libGluZykgOiBjbG9uZTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX2Nsb25lRGVlcCgpIHtcbiAgdmFyIGNsb25lID0gdGhpcy5jbG9uZU5vZGUodHJ1ZSksIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5pbnNlcnRCZWZvcmUoY2xvbmUsIHRoaXMubmV4dFNpYmxpbmcpIDogY2xvbmU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGRlZXApIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGRlZXAgPyBzZWxlY3Rpb25fY2xvbmVEZWVwIDogc2VsZWN0aW9uX2Nsb25lU2hhbGxvdyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5wcm9wZXJ0eShcIl9fZGF0YV9fXCIsIHZhbHVlKVxuICAgICAgOiB0aGlzLm5vZGUoKS5fX2RhdGFfXztcbn1cbiIsICJmdW5jdGlvbiBjb250ZXh0TGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgbGlzdGVuZXIuY2FsbCh0aGlzLCBldmVudCwgdGhpcy5fX2RhdGFfXyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lcykge1xuICByZXR1cm4gdHlwZW5hbWVzLnRyaW0oKS5zcGxpdCgvXnxcXHMrLykubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgbmFtZSA9IFwiXCIsIGkgPSB0LmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChpID49IDApIG5hbWUgPSB0LnNsaWNlKGkgKyAxKSwgdCA9IHQuc2xpY2UoMCwgaSk7XG4gICAgcmV0dXJuIHt0eXBlOiB0LCBuYW1lOiBuYW1lfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG9uUmVtb3ZlKHR5cGVuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb24gPSB0aGlzLl9fb247XG4gICAgaWYgKCFvbikgcmV0dXJuO1xuICAgIGZvciAodmFyIGogPSAwLCBpID0gLTEsIG0gPSBvbi5sZW5ndGgsIG87IGogPCBtOyArK2opIHtcbiAgICAgIGlmIChvID0gb25bal0sICghdHlwZW5hbWUudHlwZSB8fCBvLnR5cGUgPT09IHR5cGVuYW1lLnR5cGUpICYmIG8ubmFtZSA9PT0gdHlwZW5hbWUubmFtZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyLCBvLm9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb25bKytpXSA9IG87XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgrK2kpIG9uLmxlbmd0aCA9IGk7XG4gICAgZWxzZSBkZWxldGUgdGhpcy5fX29uO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvbkFkZCh0eXBlbmFtZSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBvbiA9IHRoaXMuX19vbiwgbywgbGlzdGVuZXIgPSBjb250ZXh0TGlzdGVuZXIodmFsdWUpO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICAgIGlmICgobyA9IG9uW2pdKS50eXBlID09PSB0eXBlbmFtZS50eXBlICYmIG8ubmFtZSA9PT0gdHlwZW5hbWUubmFtZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyLCBvLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyID0gbGlzdGVuZXIsIG8ub3B0aW9ucyA9IG9wdGlvbnMpO1xuICAgICAgICBvLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHR5cGVuYW1lLnR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcbiAgICBvID0ge3R5cGU6IHR5cGVuYW1lLnR5cGUsIG5hbWU6IHR5cGVuYW1lLm5hbWUsIHZhbHVlOiB2YWx1ZSwgbGlzdGVuZXI6IGxpc3RlbmVyLCBvcHRpb25zOiBvcHRpb25zfTtcbiAgICBpZiAoIW9uKSB0aGlzLl9fb24gPSBbb107XG4gICAgZWxzZSBvbi5wdXNoKG8pO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih0eXBlbmFtZSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHR5cGVuYW1lcyA9IHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lICsgXCJcIiksIGksIG4gPSB0eXBlbmFtZXMubGVuZ3RoLCB0O1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBvbiA9IHRoaXMubm9kZSgpLl9fb247XG4gICAgaWYgKG9uKSBmb3IgKHZhciBqID0gMCwgbSA9IG9uLmxlbmd0aCwgbzsgaiA8IG07ICsraikge1xuICAgICAgZm9yIChpID0gMCwgbyA9IG9uW2pdOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGlmICgodCA9IHR5cGVuYW1lc1tpXSkudHlwZSA9PT0gby50eXBlICYmIHQubmFtZSA9PT0gby5uYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIG8udmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgb24gPSB2YWx1ZSA/IG9uQWRkIDogb25SZW1vdmU7XG4gIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHRoaXMuZWFjaChvbih0eXBlbmFtZXNbaV0sIHZhbHVlLCBvcHRpb25zKSk7XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCBkZWZhdWx0VmlldyBmcm9tIFwiLi4vd2luZG93LmpzXCI7XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQobm9kZSwgdHlwZSwgcGFyYW1zKSB7XG4gIHZhciB3aW5kb3cgPSBkZWZhdWx0Vmlldyhub2RlKSxcbiAgICAgIGV2ZW50ID0gd2luZG93LkN1c3RvbUV2ZW50O1xuXG4gIGlmICh0eXBlb2YgZXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGV2ZW50ID0gbmV3IGV2ZW50KHR5cGUsIHBhcmFtcyk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnQgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJFdmVudFwiKTtcbiAgICBpZiAocGFyYW1zKSBldmVudC5pbml0RXZlbnQodHlwZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlKSwgZXZlbnQuZGV0YWlsID0gcGFyYW1zLmRldGFpbDtcbiAgICBlbHNlIGV2ZW50LmluaXRFdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UpO1xuICB9XG5cbiAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hDb25zdGFudCh0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkaXNwYXRjaEV2ZW50KHRoaXMsIHR5cGUsIHBhcmFtcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRnVuY3Rpb24odHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2hFdmVudCh0aGlzLCB0eXBlLCBwYXJhbXMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gdGhpcy5lYWNoKCh0eXBlb2YgcGFyYW1zID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gZGlzcGF0Y2hGdW5jdGlvblxuICAgICAgOiBkaXNwYXRjaENvbnN0YW50KSh0eXBlLCBwYXJhbXMpKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiooKSB7XG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB5aWVsZCBub2RlO1xuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCBzZWxlY3Rpb25fc2VsZWN0IGZyb20gXCIuL3NlbGVjdC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3RBbGwgZnJvbSBcIi4vc2VsZWN0QWxsLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NlbGVjdENoaWxkIGZyb20gXCIuL3NlbGVjdENoaWxkLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NlbGVjdENoaWxkcmVuIGZyb20gXCIuL3NlbGVjdENoaWxkcmVuLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2ZpbHRlciBmcm9tIFwiLi9maWx0ZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGF0YSBmcm9tIFwiLi9kYXRhLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VudGVyIGZyb20gXCIuL2VudGVyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2V4aXQgZnJvbSBcIi4vZXhpdC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9qb2luIGZyb20gXCIuL2pvaW4uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbWVyZ2UgZnJvbSBcIi4vbWVyZ2UuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fb3JkZXIgZnJvbSBcIi4vb3JkZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc29ydCBmcm9tIFwiLi9zb3J0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2NhbGwgZnJvbSBcIi4vY2FsbC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9ub2RlcyBmcm9tIFwiLi9ub2Rlcy5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9ub2RlIGZyb20gXCIuL25vZGUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2l6ZSBmcm9tIFwiLi9zaXplLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VtcHR5IGZyb20gXCIuL2VtcHR5LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VhY2ggZnJvbSBcIi4vZWFjaC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9hdHRyIGZyb20gXCIuL2F0dHIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc3R5bGUgZnJvbSBcIi4vc3R5bGUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fcHJvcGVydHkgZnJvbSBcIi4vcHJvcGVydHkuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fY2xhc3NlZCBmcm9tIFwiLi9jbGFzc2VkLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3RleHQgZnJvbSBcIi4vdGV4dC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9odG1sIGZyb20gXCIuL2h0bWwuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fcmFpc2UgZnJvbSBcIi4vcmFpc2UuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbG93ZXIgZnJvbSBcIi4vbG93ZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fYXBwZW5kIGZyb20gXCIuL2FwcGVuZC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9pbnNlcnQgZnJvbSBcIi4vaW5zZXJ0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3JlbW92ZSBmcm9tIFwiLi9yZW1vdmUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fY2xvbmUgZnJvbSBcIi4vY2xvbmUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGF0dW0gZnJvbSBcIi4vZGF0dW0uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fb24gZnJvbSBcIi4vb24uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGlzcGF0Y2ggZnJvbSBcIi4vZGlzcGF0Y2guanNcIjtcbmltcG9ydCBzZWxlY3Rpb25faXRlcmF0b3IgZnJvbSBcIi4vaXRlcmF0b3IuanNcIjtcblxuZXhwb3J0IHZhciByb290ID0gW251bGxdO1xuXG5leHBvcnQgZnVuY3Rpb24gU2VsZWN0aW9uKGdyb3VwcywgcGFyZW50cykge1xuICB0aGlzLl9ncm91cHMgPSBncm91cHM7XG4gIHRoaXMuX3BhcmVudHMgPSBwYXJlbnRzO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKFtbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XV0sIHJvb3QpO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25fc2VsZWN0aW9uKCkge1xuICByZXR1cm4gdGhpcztcbn1cblxuU2VsZWN0aW9uLnByb3RvdHlwZSA9IHNlbGVjdGlvbi5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBTZWxlY3Rpb24sXG4gIHNlbGVjdDogc2VsZWN0aW9uX3NlbGVjdCxcbiAgc2VsZWN0QWxsOiBzZWxlY3Rpb25fc2VsZWN0QWxsLFxuICBzZWxlY3RDaGlsZDogc2VsZWN0aW9uX3NlbGVjdENoaWxkLFxuICBzZWxlY3RDaGlsZHJlbjogc2VsZWN0aW9uX3NlbGVjdENoaWxkcmVuLFxuICBmaWx0ZXI6IHNlbGVjdGlvbl9maWx0ZXIsXG4gIGRhdGE6IHNlbGVjdGlvbl9kYXRhLFxuICBlbnRlcjogc2VsZWN0aW9uX2VudGVyLFxuICBleGl0OiBzZWxlY3Rpb25fZXhpdCxcbiAgam9pbjogc2VsZWN0aW9uX2pvaW4sXG4gIG1lcmdlOiBzZWxlY3Rpb25fbWVyZ2UsXG4gIHNlbGVjdGlvbjogc2VsZWN0aW9uX3NlbGVjdGlvbixcbiAgb3JkZXI6IHNlbGVjdGlvbl9vcmRlcixcbiAgc29ydDogc2VsZWN0aW9uX3NvcnQsXG4gIGNhbGw6IHNlbGVjdGlvbl9jYWxsLFxuICBub2Rlczogc2VsZWN0aW9uX25vZGVzLFxuICBub2RlOiBzZWxlY3Rpb25fbm9kZSxcbiAgc2l6ZTogc2VsZWN0aW9uX3NpemUsXG4gIGVtcHR5OiBzZWxlY3Rpb25fZW1wdHksXG4gIGVhY2g6IHNlbGVjdGlvbl9lYWNoLFxuICBhdHRyOiBzZWxlY3Rpb25fYXR0cixcbiAgc3R5bGU6IHNlbGVjdGlvbl9zdHlsZSxcbiAgcHJvcGVydHk6IHNlbGVjdGlvbl9wcm9wZXJ0eSxcbiAgY2xhc3NlZDogc2VsZWN0aW9uX2NsYXNzZWQsXG4gIHRleHQ6IHNlbGVjdGlvbl90ZXh0LFxuICBodG1sOiBzZWxlY3Rpb25faHRtbCxcbiAgcmFpc2U6IHNlbGVjdGlvbl9yYWlzZSxcbiAgbG93ZXI6IHNlbGVjdGlvbl9sb3dlcixcbiAgYXBwZW5kOiBzZWxlY3Rpb25fYXBwZW5kLFxuICBpbnNlcnQ6IHNlbGVjdGlvbl9pbnNlcnQsXG4gIHJlbW92ZTogc2VsZWN0aW9uX3JlbW92ZSxcbiAgY2xvbmU6IHNlbGVjdGlvbl9jbG9uZSxcbiAgZGF0dW06IHNlbGVjdGlvbl9kYXR1bSxcbiAgb246IHNlbGVjdGlvbl9vbixcbiAgZGlzcGF0Y2g6IHNlbGVjdGlvbl9kaXNwYXRjaCxcbiAgW1N5bWJvbC5pdGVyYXRvcl06IHNlbGVjdGlvbl9pdGVyYXRvclxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VsZWN0aW9uO1xuIiwgImltcG9ydCB7U2VsZWN0aW9uLCByb290fSBmcm9tIFwiLi9zZWxlY3Rpb24vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIlxuICAgICAgPyBuZXcgU2VsZWN0aW9uKFtbZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcildXSwgW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudF0pXG4gICAgICA6IG5ldyBTZWxlY3Rpb24oW1tzZWxlY3Rvcl1dLCByb290KTtcbn1cbiIsICJpbXBvcnQgeyBzY2FsZU9yZGluYWwgfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgeyBzY2hlbWVUYWJsZWF1MTAgfSBmcm9tICdkMy1zY2FsZS1jaHJvbWF0aWMnO1xuaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7IHNldEljb24gfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IFJlbmRlclNldHRpbmdzLCBSb3RhdGlvblByZXNldCwgV29yZENsb3VkUmVuZGVyT3B0aW9ucywgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5mdW5jdGlvbiBidWlsZERldGVybWluaXN0aWNSYW5kb20oc2VlZDogbnVtYmVyKTogKCkgPT4gbnVtYmVyIHtcbiAgbGV0IHN0YXRlID0gc2VlZCA+Pj4gMDtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBzdGF0ZSA9IChzdGF0ZSArIDB4NkQyQjc5RjUpIHwgMDtcbiAgICBsZXQgdCA9IE1hdGguaW11bChzdGF0ZSBeIChzdGF0ZSA+Pj4gMTUpLCAxIHwgc3RhdGUpO1xuICAgIHQgPSAodCArIE1hdGguaW11bCh0IF4gKHQgPj4+IDcpLCA2MSB8IHQpKSBeIHQ7XG4gICAgcmV0dXJuICgodCBeICh0ID4+PiAxNCkpID4+PiAwKSAvIDQyOTQ5NjcyOTY7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHBpY2tSb3RhdGlvbihyYW5kb206ICgpID0+IG51bWJlciwgcHJlc2V0OiBSb3RhdGlvblByZXNldCk6IG51bWJlciB7XG4gIGlmIChwcmVzZXQgPT09ICdob3Jpem9udGFsJykge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKHByZXNldCA9PT0gJ21vc3RseS1ob3Jpem9udGFsJykge1xuICAgIHJldHVybiByYW5kb20oKSA+IDAuODUgPyA5MCA6IDA7XG4gIH1cblxuICBpZiAocHJlc2V0ID09PSAndmVydGljYWwnKSB7XG4gICAgcmV0dXJuIHJhbmRvbSgpID4gMC4yID8gOTAgOiAwO1xuICB9XG5cbiAgY29uc3QgYW5nbGVzID0gWy05MCwgLTQ1LCAwLCA0NSwgOTBdO1xuICByZXR1cm4gYW5nbGVzW01hdGguZmxvb3IocmFuZG9tKCkgKiBhbmdsZXMubGVuZ3RoKV07XG59XG5cbmZ1bmN0aW9uIGdldFdvcmRMYWJlbCh3b3JkOiBXZWlnaHRlZFdvcmQsIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyk6IHN0cmluZyB7XG4gIGlmICghcmVuZGVyU2V0dGluZ3Muc2hvd0NvdW50SW5Xb3JkVGV4dCB8fCB3b3JkLmNvdW50IDwgcmVuZGVyU2V0dGluZ3MuY291bnRMYWJlbE1pbkNvdW50KSB7XG4gICAgcmV0dXJuIHdvcmQudGV4dDtcbiAgfVxuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5jb3VudExhYmVsRm9ybWF0ID09PSAnZG90Jykge1xuICAgIHJldHVybiBgJHt3b3JkLnRleHR9IFx1MDBCNyAke3dvcmQuY291bnR9YDtcbiAgfVxuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5jb3VudExhYmVsRm9ybWF0ID09PSAnY29sb24nKSB7XG4gICAgcmV0dXJuIGAke3dvcmQudGV4dH06ICR7d29yZC5jb3VudH1gO1xuICB9XG5cbiAgcmV0dXJuIGAke3dvcmQudGV4dH0gKCR7d29yZC5jb3VudH0pYDtcbn1cblxudHlwZSBMYXlvdXRXb3JkID0gV2VpZ2h0ZWRXb3JkICYge1xuICBiYXNlVGV4dDogc3RyaW5nO1xuICBsYXlvdXRUZXh0OiBzdHJpbmc7XG59O1xuXG50eXBlIFZpZXdwb3J0Q29udHJvbHMgPSB7XG4gIHpvb21JbjogKCkgPT4gdm9pZDtcbiAgem9vbU91dDogKCkgPT4gdm9pZDtcbiAgcmVzZXRWaWV3OiAoKSA9PiB2b2lkO1xuICBzaG91bGRTdXBwcmVzc1dvcmRDbGljazogKCkgPT4gYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkcmF3V29yZENsb3VkKG9wdGlvbnM6IFdvcmRDbG91ZFJlbmRlck9wdGlvbnMsIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7IGNvbnRhaW5lckVsLCB3b3JkcywgYXJpYUxhYmVsLCBvbldvcmRDbGljaywgb25Qcm9ncmVzcywgb25SZWZyZXNoIH0gPSBvcHRpb25zO1xuICBjb25zdCBleHBvcnRCYXNlTmFtZSA9IHNhbml0aXplRmlsZU5hbWUob3B0aW9ucy5leHBvcnRCYXNlTmFtZSA/PyAnd29yZC1jbG91ZCcpO1xuICBjb25zdCBlbmFibGVFeHBvcnQgPSBvcHRpb25zLmVuYWJsZUV4cG9ydCA/PyB0cnVlO1xuICBjb25zdCBlbmFibGVPdmVybGF5Q29udHJvbHMgPSBvcHRpb25zLmVuYWJsZU92ZXJsYXlDb250cm9scyA/PyB0cnVlO1xuICBjb25zdCBlbmFibGVWaWV3cG9ydEludGVyYWN0aW9uID0gb3B0aW9ucy5lbmFibGVWaWV3cG9ydEludGVyYWN0aW9uID8/IHRydWU7XG4gIGNvbnN0IHNob3dSZWZyZXNoQ29udHJvbCA9IG9wdGlvbnMuc2hvd1JlZnJlc2hDb250cm9sID8/IHRydWU7XG4gIGNvbnN0IHNob3dab29tQ29udHJvbHMgPSBvcHRpb25zLnNob3dab29tQ29udHJvbHMgPz8gdHJ1ZTtcbiAgY29uc3Qgc2hvd0VkaXRDb250cm9sID0gb3B0aW9ucy5zaG93RWRpdENvbnRyb2wgPz8gZmFsc2U7XG4gIGNvbnN0IHdpZHRoID0gTWF0aC5tYXgoMzIwLCBjb250YWluZXJFbC5jbGllbnRXaWR0aCB8fCA3MDApO1xuICBjb25zdCBoZWlnaHQgPSBNYXRoLm1heCgzMjAsIGNvbnRhaW5lckVsLmNsaWVudEhlaWdodCB8fCA1MDApO1xuICBjb25zdCByYW5kb20gPSByZW5kZXJTZXR0aW5ncy5kZXRlcm1pbmlzdGljTGF5b3V0ID8gYnVpbGREZXRlcm1pbmlzdGljUmFuZG9tKHJlbmRlclNldHRpbmdzLnJhbmRvbVNlZWQpIDogTWF0aC5yYW5kb207XG4gIGNvbnN0IGxheW91dFdvcmRzOiBMYXlvdXRXb3JkW10gPSB3b3Jkcy5tYXAoKHdvcmQpID0+ICh7XG4gICAgLi4ud29yZCxcbiAgICBiYXNlVGV4dDogd29yZC50ZXh0LFxuICAgIGxheW91dFRleHQ6IGdldFdvcmRMYWJlbCh3b3JkLCByZW5kZXJTZXR0aW5ncyksXG4gIH0pKTtcblxuICBjb250YWluZXJFbC5jbGFzc0xpc3QuYWRkKCd3b3JkLWNsb3VkLXJlbmRlci1jb250YWluZXInKTtcblxuICBjb25zdCBzdmcgPSBzZWxlY3QoY29udGFpbmVyRWwpXG4gICAgLmFwcGVuZCgnc3ZnJylcbiAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgIC5hdHRyKCdyb2xlJywgJ2ltZycpXG4gICAgLmF0dHIoJ2FyaWEtbGFiZWwnLCBhcmlhTGFiZWwpO1xuXG4gIGNvbnN0IHZpZXdwb3J0R3JvdXAgPSBzdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd29yZC1jbG91ZC12aWV3cG9ydCcpO1xuICBjb25zdCBnID0gdmlld3BvcnRHcm91cC5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7d2lkdGggLyAyfSwke2hlaWdodCAvIDJ9KWApO1xuICBjb25zdCB2aWV3cG9ydENvbnRyb2xzID0gZW5hYmxlVmlld3BvcnRJbnRlcmFjdGlvblxuICAgID8gc2V0dXBWaWV3cG9ydENvbnRyb2xzKHN2Zy5ub2RlKCksIHZpZXdwb3J0R3JvdXAubm9kZSgpLCB3aWR0aCwgaGVpZ2h0KVxuICAgIDogY3JlYXRlU3RhdGljVmlld3BvcnRDb250cm9scygpO1xuXG4gIGNvbnN0IGNvbG9yID0gc2NhbGVPcmRpbmFsPHN0cmluZywgc3RyaW5nPihzY2hlbWVUYWJsZWF1MTApO1xuICBjb25zdCB7IGRlZmF1bHQ6IGNsb3VkIH0gPSBhd2FpdCBpbXBvcnQoJ2QzLWNsb3VkJyk7XG4gIGNvbnN0IHBlcmZvcm1hbmNlID0gZ2V0TGF5b3V0UGVyZm9ybWFuY2VQcm9maWxlKHJlbmRlclNldHRpbmdzLnByb2dyZXNzRGV0YWlsKTtcbiAgY29uc3QgcmVwb3J0UHJvZ3Jlc3MgPSBjcmVhdGVUaHJvdHRsZWRQcm9ncmVzcyhvblByb2dyZXNzLCBwZXJmb3JtYW5jZS5wcm9ncmVzc1Rocm90dGxlTXMpO1xuICBjb25zdCBsYXlvdXRUaW1lSW50ZXJ2YWwgPSByZW5kZXJTZXR0aW5ncy5wcm9ncmVzc0RldGFpbCA9PT0gJ3VuaGluZ2VkJ1xuICAgID8gSW5maW5pdHlcbiAgICA6IE1hdGgubWF4KDgsIE1hdGgucm91bmQocmVuZGVyU2V0dGluZ3MubGF5b3V0VGltZUludGVydmFsTXMpKTtcblxuICBhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBsYWlkT3V0V29yZHMgPSAwO1xuICAgIGNvbnN0IHRvdGFsV29yZHMgPSBNYXRoLm1heCgxLCBsYXlvdXRXb3Jkcy5sZW5ndGgpO1xuXG4gICAgY2xvdWQ8TGF5b3V0V29yZD4oKVxuICAgICAgLnNpemUoW3dpZHRoLCBoZWlnaHRdKVxuICAgICAgLndvcmRzKGxheW91dFdvcmRzKVxuICAgICAgLnRleHQoKGQpID0+IGQubGF5b3V0VGV4dClcbiAgICAgIC50aW1lSW50ZXJ2YWwobGF5b3V0VGltZUludGVydmFsKVxuICAgICAgLnBhZGRpbmcoTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy53b3JkUGFkZGluZykpKVxuICAgICAgLnNwaXJhbChyZW5kZXJTZXR0aW5ncy5zcGlyYWwpXG4gICAgICAucm90YXRlKCgpID0+IHBpY2tSb3RhdGlvbihyYW5kb20sIHJlbmRlclNldHRpbmdzLnJvdGF0aW9uUHJlc2V0KSlcbiAgICAgIC5mb250KHJlbmRlclNldHRpbmdzLmZvbnRGYW1pbHkgfHwgJ3NhbnMtc2VyaWYnKVxuICAgICAgLmZvbnRTaXplKChkKSA9PiBkLnNpemUpXG4gICAgICAucmFuZG9tKHJhbmRvbSlcbiAgICAgIC5vbignd29yZCcsICgpID0+IHtcbiAgICAgICAgbGFpZE91dFdvcmRzICs9IDE7XG4gICAgICAgIGlmIChsYWlkT3V0V29yZHMgJSBwZXJmb3JtYW5jZS53b3JkUHJvZ3Jlc3NTdHJpZGUgPT09IDApIHtcbiAgICAgICAgICBjb25zdCBsYXlvdXRQZXJjZW50ID0gTWF0aC5taW4oOTksIE1hdGgucm91bmQoKGxhaWRPdXRXb3JkcyAvIHRvdGFsV29yZHMpICogMTAwKSk7XG4gICAgICAgICAgcmVwb3J0UHJvZ3Jlc3MoYExheWluZyBvdXQgd29yZHMuLi4gJHtsYWlkT3V0V29yZHN9LyR7bGF5b3V0V29yZHMubGVuZ3RofWAsIGxheW91dFBlcmNlbnQpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLm9uKCdlbmQnLCAobGF5b3V0V29yZHMpID0+IHtcbiAgICAgICAgZy5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgICAgIC5kYXRhKGxheW91dFdvcmRzKVxuICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLCAoZCkgPT4gYCR7ZC5zaXplfXB4YClcbiAgICAgICAgICAuc3R5bGUoJ2ZvbnQtZmFtaWx5JywgcmVuZGVyU2V0dGluZ3MuZm9udEZhbWlseSB8fCAnc2Fucy1zZXJpZicpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKF8sIGkpID0+IGNvbG9yKFN0cmluZyhpKSkpXG4gICAgICAgICAgLnN0eWxlKCdjdXJzb3InLCAncG9pbnRlcicpXG4gICAgICAgICAgLmF0dHIoJ3RhYmluZGV4JywgMClcbiAgICAgICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpID0+IGB0cmFuc2xhdGUoJHtkLnh9LCR7ZC55fSkgcm90YXRlKCR7ZC5yb3RhdGV9KWApXG4gICAgICAgICAgLnRleHQoKGQpID0+IGQubGF5b3V0VGV4dClcbiAgICAgICAgICAub24oJ2NsaWNrJywgKF8sIGQpID0+IHtcbiAgICAgICAgICAgIGlmICh2aWV3cG9ydENvbnRyb2xzLnNob3VsZFN1cHByZXNzV29yZENsaWNrKCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25Xb3JkQ2xpY2soZC5iYXNlVGV4dCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAub24oJ2tleWRvd24nLCAoZXZlbnQ6IEtleWJvYXJkRXZlbnQsIGQpID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicgfHwgZXZlbnQua2V5ID09PSAnICcpIHtcbiAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgb25Xb3JkQ2xpY2soZC5iYXNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuYXBwZW5kKCd0aXRsZScpXG4gICAgICAgICAgLnRleHQoKGQpID0+IGAke2QuYmFzZVRleHR9ICgke2QuY291bnR9KWApO1xuXG4gICAgICAgIHJlcG9ydFByb2dyZXNzKCdSZW5kZXJpbmcgY29tcGxldGUuJywgMTAwKTtcbiAgICAgICAgaWYgKGVuYWJsZU92ZXJsYXlDb250cm9scykge1xuICAgICAgICAgIHJlbmRlck92ZXJsYXlDb250cm9scyhcbiAgICAgICAgICAgIGNvbnRhaW5lckVsLFxuICAgICAgICAgICAgc3ZnLm5vZGUoKSxcbiAgICAgICAgICAgIGV4cG9ydEJhc2VOYW1lLFxuICAgICAgICAgICAgZW5hYmxlRXhwb3J0LFxuICAgICAgICAgICAgb25SZWZyZXNoLFxuICAgICAgICAgICAgb3B0aW9ucy5vbkVkaXQsXG4gICAgICAgICAgICB2aWV3cG9ydENvbnRyb2xzLFxuICAgICAgICAgICAgc2hvd1JlZnJlc2hDb250cm9sLFxuICAgICAgICAgICAgc2hvd1pvb21Db250cm9scyxcbiAgICAgICAgICAgIHNob3dFZGl0Q29udHJvbCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSlcbiAgICAgIC5zdGFydCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3RhdGljVmlld3BvcnRDb250cm9scygpOiBWaWV3cG9ydENvbnRyb2xzIHtcbiAgcmV0dXJuIHtcbiAgICB6b29tSW46ICgpID0+IHVuZGVmaW5lZCxcbiAgICB6b29tT3V0OiAoKSA9PiB1bmRlZmluZWQsXG4gICAgcmVzZXRWaWV3OiAoKSA9PiB1bmRlZmluZWQsXG4gICAgc2hvdWxkU3VwcHJlc3NXb3JkQ2xpY2s6ICgpID0+IGZhbHNlLFxuICB9O1xufVxuXG5mdW5jdGlvbiBzZXR1cFZpZXdwb3J0Q29udHJvbHMoXG4gIHN2Z0VsOiBTVkdTVkdFbGVtZW50IHwgbnVsbCxcbiAgdmlld3BvcnRFbDogU1ZHR0VsZW1lbnQgfCBudWxsLFxuICB3aWR0aDogbnVtYmVyLFxuICBoZWlnaHQ6IG51bWJlcixcbik6IFZpZXdwb3J0Q29udHJvbHMge1xuICBpZiAoIXN2Z0VsIHx8ICF2aWV3cG9ydEVsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHpvb21JbjogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgem9vbU91dDogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgcmVzZXRWaWV3OiAoKSA9PiB1bmRlZmluZWQsXG4gICAgICBzaG91bGRTdXBwcmVzc1dvcmRDbGljazogKCkgPT4gZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIGxldCBwYW5YID0gMDtcbiAgbGV0IHBhblkgPSAwO1xuICBsZXQgem9vbSA9IDE7XG4gIGxldCBzdXBwcmVzc1dvcmRDbGlja1VudGlsID0gMDtcbiAgbGV0IHBvaW50ZXJJZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIGxldCBkcmFnU3RhcnRYID0gMDtcbiAgbGV0IGRyYWdTdGFydFkgPSAwO1xuICBsZXQgbGFzdFBvaW50ZXJYID0gMDtcbiAgbGV0IGxhc3RQb2ludGVyWSA9IDA7XG4gIGxldCBwb2ludGVyTW92ZWQgPSBmYWxzZTtcbiAgbGV0IGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgY29uc3QgbWluWm9vbSA9IDAuMzU7XG4gIGNvbnN0IG1heFpvb20gPSA0LjU7XG4gIGNvbnN0IGRyYWdTdGFydFRocmVzaG9sZFB4ID0gNztcblxuICBjb25zdCBjbGFtcFpvb20gPSAodmFsdWU6IG51bWJlcik6IG51bWJlciA9PiB7XG4gICAgaWYgKE51bWJlci5pc05hTih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB6b29tO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5taW4obWF4Wm9vbSwgTWF0aC5tYXgobWluWm9vbSwgdmFsdWUpKTtcbiAgfTtcblxuICBjb25zdCBhcHBseVRyYW5zZm9ybSA9ICgpOiB2b2lkID0+IHtcbiAgICB2aWV3cG9ydEVsLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3Bhblh9LCR7cGFuWX0pIHNjYWxlKCR7em9vbX0pYCk7XG4gIH07XG5cbiAgY29uc3Qgem9vbUF0ID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCBmYWN0b3I6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGZhY3RvcikgfHwgZmFjdG9yIDw9IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0Wm9vbSA9IGNsYW1wWm9vbSh6b29tICogZmFjdG9yKTtcbiAgICBpZiAobmV4dFpvb20gPT09IHpvb20pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3b3JsZFggPSAoeCAtIHBhblgpIC8gem9vbTtcbiAgICBjb25zdCB3b3JsZFkgPSAoeSAtIHBhblkpIC8gem9vbTtcbiAgICBwYW5YID0geCAtICh3b3JsZFggKiBuZXh0Wm9vbSk7XG4gICAgcGFuWSA9IHkgLSAod29ybGRZICogbmV4dFpvb20pO1xuICAgIHpvb20gPSBuZXh0Wm9vbTtcbiAgICBhcHBseVRyYW5zZm9ybSgpO1xuICB9O1xuXG4gIGNvbnN0IG51ZGdlUGFuID0gKGRlbHRhWDogbnVtYmVyLCBkZWx0YVk6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIHBhblggKz0gZGVsdGFYO1xuICAgIHBhblkgKz0gZGVsdGFZO1xuICAgIGFwcGx5VHJhbnNmb3JtKCk7XG4gIH07XG5cbiAgY29uc3Qgem9vbUluID0gKCk6IHZvaWQgPT4gem9vbUF0KHdpZHRoIC8gMiwgaGVpZ2h0IC8gMiwgMS4xOCk7XG4gIGNvbnN0IHpvb21PdXQgPSAoKTogdm9pZCA9PiB6b29tQXQod2lkdGggLyAyLCBoZWlnaHQgLyAyLCAxIC8gMS4xOCk7XG4gIGNvbnN0IHJlc2V0VmlldyA9ICgpOiB2b2lkID0+IHtcbiAgICBwYW5YID0gMDtcbiAgICBwYW5ZID0gMDtcbiAgICB6b29tID0gMTtcbiAgICBhcHBseVRyYW5zZm9ybSgpO1xuICB9O1xuXG4gIGFwcGx5VHJhbnNmb3JtKCk7XG4gIHN2Z0VsLmNsYXNzTGlzdC5hZGQoJ3dvcmQtY2xvdWQtcGFuem9vbS1zdXJmYWNlJyk7XG4gIHN2Z0VsLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICBzdmdFbC5zZXRBdHRyaWJ1dGUoXG4gICAgJ2FyaWEta2V5c2hvcnRjdXRzJyxcbiAgICAnKywgLSwgMCwgQXJyb3dMZWZ0LCBBcnJvd1JpZ2h0LCBBcnJvd1VwLCBBcnJvd0Rvd24nLFxuICApO1xuXG4gIHN2Z0VsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgKGV2ZW50OiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQucG9pbnRlclR5cGUgIT09ICd0b3VjaCcgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3ZnRWwuZm9jdXMoeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pO1xuICAgIHBvaW50ZXJJZCA9IGV2ZW50LnBvaW50ZXJJZDtcbiAgICBkcmFnU3RhcnRYID0gZXZlbnQuY2xpZW50WDtcbiAgICBkcmFnU3RhcnRZID0gZXZlbnQuY2xpZW50WTtcbiAgICBsYXN0UG9pbnRlclggPSBldmVudC5jbGllbnRYO1xuICAgIGxhc3RQb2ludGVyWSA9IGV2ZW50LmNsaWVudFk7XG4gICAgcG9pbnRlck1vdmVkID0gZmFsc2U7XG4gICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICB9KTtcblxuICBzdmdFbC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIChldmVudDogUG9pbnRlckV2ZW50KSA9PiB7XG4gICAgaWYgKHBvaW50ZXJJZCAhPT0gZXZlbnQucG9pbnRlcklkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFpc0RyYWdnaW5nKSB7XG4gICAgICBjb25zdCBkcmFnRGlzdGFuY2UgPSBNYXRoLmh5cG90KGV2ZW50LmNsaWVudFggLSBkcmFnU3RhcnRYLCBldmVudC5jbGllbnRZIC0gZHJhZ1N0YXJ0WSk7XG4gICAgICBpZiAoZHJhZ0Rpc3RhbmNlIDwgZHJhZ1N0YXJ0VGhyZXNob2xkUHgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgIHBvaW50ZXJNb3ZlZCA9IHRydWU7XG4gICAgICBsYXN0UG9pbnRlclggPSBldmVudC5jbGllbnRYO1xuICAgICAgbGFzdFBvaW50ZXJZID0gZXZlbnQuY2xpZW50WTtcbiAgICAgIHN2Z0VsLnNldFBvaW50ZXJDYXB0dXJlKGV2ZW50LnBvaW50ZXJJZCk7XG4gICAgICBzdmdFbC5jbGFzc0xpc3QuYWRkKCdpcy1wYW5uaW5nJyk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRlbHRhWCA9IGV2ZW50LmNsaWVudFggLSBsYXN0UG9pbnRlclg7XG4gICAgY29uc3QgZGVsdGFZID0gZXZlbnQuY2xpZW50WSAtIGxhc3RQb2ludGVyWTtcbiAgICBsYXN0UG9pbnRlclggPSBldmVudC5jbGllbnRYO1xuICAgIGxhc3RQb2ludGVyWSA9IGV2ZW50LmNsaWVudFk7XG5cbiAgICBudWRnZVBhbihkZWx0YVgsIGRlbHRhWSk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG5cbiAgc3ZnRWwuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgKGV2ZW50OiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICBpZiAocG9pbnRlcklkICE9PSBldmVudC5wb2ludGVySWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocG9pbnRlck1vdmVkKSB7XG4gICAgICBzdXBwcmVzc1dvcmRDbGlja1VudGlsID0gRGF0ZS5ub3coKSArIDI0MDtcbiAgICB9XG4gICAgcG9pbnRlcklkID0gbnVsbDtcbiAgICBwb2ludGVyTW92ZWQgPSBmYWxzZTtcbiAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgc3ZnRWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtcGFubmluZycpO1xuICAgIGlmIChzdmdFbC5oYXNQb2ludGVyQ2FwdHVyZShldmVudC5wb2ludGVySWQpKSB7XG4gICAgICBzdmdFbC5yZWxlYXNlUG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKTtcbiAgICB9XG4gIH0pO1xuXG4gIHN2Z0VsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCAoZXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgIGlmIChwb2ludGVySWQgIT09IGV2ZW50LnBvaW50ZXJJZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBvaW50ZXJJZCA9IG51bGw7XG4gICAgcG9pbnRlck1vdmVkID0gZmFsc2U7XG4gICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIHN2Z0VsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXBhbm5pbmcnKTtcbiAgICBpZiAoc3ZnRWwuaGFzUG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKSkge1xuICAgICAgc3ZnRWwucmVsZWFzZVBvaW50ZXJDYXB0dXJlKGV2ZW50LnBvaW50ZXJJZCk7XG4gICAgfVxuICB9KTtcblxuICBzdmdFbC5hZGRFdmVudExpc3RlbmVyKFxuICAgICd3aGVlbCcsXG4gICAgKGV2ZW50OiBXaGVlbEV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qgc3BlZWQgPSBldmVudC5kZWx0YU1vZGUgPT09IFdoZWVsRXZlbnQuRE9NX0RFTFRBX0xJTkUgPyAwLjA0IDogMC4wMDIzO1xuICAgICAgY29uc3Qgem9vbUZhY3RvciA9IE1hdGguZXhwKC1ldmVudC5kZWx0YVkgKiBzcGVlZCk7XG4gICAgICB6b29tQXQoZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WSwgem9vbUZhY3Rvcik7XG4gICAgfSxcbiAgICB7IHBhc3NpdmU6IGZhbHNlIH0sXG4gICk7XG5cbiAgc3ZnRWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09ICcrJyB8fCBldmVudC5rZXkgPT09ICc9JyB8fCBldmVudC5rZXkgPT09ICdOdW1wYWRBZGQnKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgem9vbUluKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJy0nIHx8IGV2ZW50LmtleSA9PT0gJ18nIHx8IGV2ZW50LmtleSA9PT0gJ051bXBhZFN1YnRyYWN0Jykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHpvb21PdXQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnMCcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXNldFZpZXcoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYW5TdGVwID0gMzY7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93TGVmdCcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBudWRnZVBhbihwYW5TdGVwLCAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93UmlnaHQnKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgbnVkZ2VQYW4oLXBhblN0ZXAsIDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dVcCcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBudWRnZVBhbigwLCBwYW5TdGVwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBudWRnZVBhbigwLCAtcGFuU3RlcCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHpvb21JbixcbiAgICB6b29tT3V0LFxuICAgIHJlc2V0VmlldyxcbiAgICBzaG91bGRTdXBwcmVzc1dvcmRDbGljazogKCkgPT4gRGF0ZS5ub3coKSA8IHN1cHByZXNzV29yZENsaWNrVW50aWwsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbmRlck92ZXJsYXlDb250cm9scyhcbiAgY29udGFpbmVyRWw6IEhUTUxEaXZFbGVtZW50LFxuICBzdmdFbDogU1ZHU1ZHRWxlbWVudCB8IG51bGwsXG4gIGV4cG9ydEJhc2VOYW1lOiBzdHJpbmcsXG4gIGVuYWJsZUV4cG9ydDogYm9vbGVhbixcbiAgb25SZWZyZXNoOiAoKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPixcbiAgb25FZGl0OiAoKCkgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pIHwgdW5kZWZpbmVkLFxuICB2aWV3cG9ydENvbnRyb2xzOiBWaWV3cG9ydENvbnRyb2xzLFxuICBzaG93UmVmcmVzaENvbnRyb2w6IGJvb2xlYW4sXG4gIHNob3dab29tQ29udHJvbHM6IGJvb2xlYW4sXG4gIHNob3dFZGl0Q29udHJvbDogYm9vbGVhbixcbik6IHZvaWQge1xuICBpZiAoIXN2Z0VsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgbWFrZVJlZnJlc2hCdXR0b24gPSAocGFyZW50RWw6IEhUTUxEaXZFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFzaG93UmVmcmVzaENvbnRyb2wpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZWZyZXNoQnV0dG9uID0gcGFyZW50RWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIGNsczogJ3dvcmQtY2xvdWQtcmVmcmVzaC1idXR0b24nLFxuICAgIH0pO1xuICAgIHJlZnJlc2hCdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIHNldEljb24ocmVmcmVzaEJ1dHRvbiwgJ3JvdGF0ZS1jdycpO1xuICAgIHJlZnJlc2hCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsICdSZWZyZXNoIHdvcmQgY2xvdWQnKTtcblxuICAgIGxldCBpc1JlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICByZWZyZXNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGlzUmVmcmVzaGluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlzUmVmcmVzaGluZyA9IHRydWU7XG4gICAgICByZWZyZXNoQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IG9uUmVmcmVzaCgpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKHJlZnJlc2hCdXR0b24uaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgICByZWZyZXNoQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaXNSZWZyZXNoaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgbWFrZUVkaXRCdXR0b24gPSAocGFyZW50RWw6IEhUTUxEaXZFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFzaG93RWRpdENvbnRyb2wgfHwgIW9uRWRpdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVkaXRCdXR0b24gPSBwYXJlbnRFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgY2xzOiAnd29yZC1jbG91ZC1lZGl0LWJ1dHRvbicsXG4gICAgfSk7XG4gICAgZWRpdEJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgc2V0SWNvbihlZGl0QnV0dG9uLCAncGVuY2lsJyk7XG4gICAgZWRpdEJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ0VkaXQgZW1iZWRkZWQgd29yZCBjbG91ZCcpO1xuXG4gICAgbGV0IGlzRWRpdGluZyA9IGZhbHNlO1xuICAgIGVkaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoaXNFZGl0aW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaXNFZGl0aW5nID0gdHJ1ZTtcbiAgICAgIGVkaXRCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgb25FZGl0KCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZWRpdEJ1dHRvbi5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgIGVkaXRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpc0VkaXRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBpZiAoc2hvd1pvb21Db250cm9scykge1xuICAgIGNvbnN0IHZpZXdDb250cm9sc0VsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC12aWV3LWNvbnRyb2xzJyB9KTtcbiAgICBjb25zdCB6b29tT3V0QnV0dG9uID0gdmlld0NvbnRyb2xzRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIGNsczogJ3dvcmQtY2xvdWQtdmlldy1idXR0b24nLFxuICAgIH0pO1xuICAgIHpvb21PdXRCdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIHNldEljb24oem9vbU91dEJ1dHRvbiwgJ21pbnVzJyk7XG4gICAgem9vbU91dEJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1pvb20gb3V0Jyk7XG4gICAgem9vbU91dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHZpZXdwb3J0Q29udHJvbHMuem9vbU91dCgpKTtcblxuICAgIGNvbnN0IHJlc2V0Vmlld0J1dHRvbiA9IHZpZXdDb250cm9sc0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICBjbHM6ICd3b3JkLWNsb3VkLXZpZXctYnV0dG9uJyxcbiAgICB9KTtcbiAgICByZXNldFZpZXdCdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIHNldEljb24ocmVzZXRWaWV3QnV0dG9uLCAnbG9jYXRlLWZpeGVkJyk7XG4gICAgcmVzZXRWaWV3QnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnUmVzZXQgcGFuIGFuZCB6b29tJyk7XG4gICAgcmVzZXRWaWV3QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdmlld3BvcnRDb250cm9scy5yZXNldFZpZXcoKSk7XG5cbiAgICBjb25zdCB6b29tSW5CdXR0b24gPSB2aWV3Q29udHJvbHNFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgY2xzOiAnd29yZC1jbG91ZC12aWV3LWJ1dHRvbicsXG4gICAgfSk7XG4gICAgem9vbUluQnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICBzZXRJY29uKHpvb21JbkJ1dHRvbiwgJ3BsdXMnKTtcbiAgICB6b29tSW5CdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsICdab29tIGluJyk7XG4gICAgem9vbUluQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdmlld3BvcnRDb250cm9scy56b29tSW4oKSk7XG4gIH1cblxuICBpZiAoIWVuYWJsZUV4cG9ydCkge1xuICAgIGlmICghc2hvd1pvb21Db250cm9scykge1xuICAgICAgY29uc3QgZmFsbGJhY2tDb250cm9sc0VsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1leHBvcnQtY29udHJvbHMnIH0pO1xuICAgICAgbWFrZVJlZnJlc2hCdXR0b24oZmFsbGJhY2tDb250cm9sc0VsKTtcbiAgICAgIG1ha2VFZGl0QnV0dG9uKGZhbGxiYWNrQ29udHJvbHNFbCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGV4cG9ydENvbnRyb2xzRWwgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWV4cG9ydC1jb250cm9scycgfSk7XG4gIGNvbnN0IG1lbnVCdXR0b24gPSBleHBvcnRDb250cm9sc0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgY2xzOiAnd29yZC1jbG91ZC1tZW51LWJ1dHRvbicsXG4gICAgdGV4dDogJ1x1MjJFRicsXG4gIH0pO1xuICBtZW51QnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnV29yZCBjbG91ZCBvcHRpb25zJyk7XG5cbiAgbWFrZVJlZnJlc2hCdXR0b24oZXhwb3J0Q29udHJvbHNFbCk7XG4gIG1ha2VFZGl0QnV0dG9uKGV4cG9ydENvbnRyb2xzRWwpO1xuXG4gIGNvbnN0IG1lbnVFbCA9IGV4cG9ydENvbnRyb2xzRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1tZW51JyB9KTtcbiAgbWVudUVsLnNldEF0dHIoJ2hpZGRlbicsICd0cnVlJyk7XG4gIGxldCByZW1vdmVPdXRzaWRlTGlzdGVuZXI6ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0IHRvZ2dsZU1lbnUgPSAob3BlbjogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgIGlmIChvcGVuKSB7XG4gICAgICBtZW51RWwucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgIGNvbnN0IG9uT3V0c2lkZUNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgICAgICB0b2dnbGVNZW51KGZhbHNlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFleHBvcnRDb250cm9sc0VsLmNvbnRhaW5zKHRhcmdldCkpIHtcbiAgICAgICAgICB0b2dnbGVNZW51KGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uT3V0c2lkZUNsaWNrLCB0cnVlKTtcbiAgICAgIHJlbW92ZU91dHNpZGVMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25PdXRzaWRlQ2xpY2ssIHRydWUpO1xuICAgICAgICByZW1vdmVPdXRzaWRlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVudUVsLnNldEF0dHIoJ2hpZGRlbicsICd0cnVlJyk7XG4gICAgICBpZiAocmVtb3ZlT3V0c2lkZUxpc3RlbmVyKSB7XG4gICAgICAgIHJlbW92ZU91dHNpZGVMaXN0ZW5lcigpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBtYWtlTWVudUl0ZW0gPSAobGFiZWw6IHN0cmluZywgZm9ybWF0OiAnc3ZnJyB8ICdwbmcnIHwgJ2pwZWcnKSA9PiB7XG4gICAgY29uc3QgYnV0dG9uID0gbWVudUVsLmNyZWF0ZUVsKCdidXR0b24nLCB7IGNsczogJ3dvcmQtY2xvdWQtbWVudS1pdGVtJywgdGV4dDogYEV4cG9ydCAke2xhYmVsfWAgfSk7XG4gICAgYnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCBgRXhwb3J0IGFzICR7bGFiZWx9YCk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBleHBvcnRTdmcoc3ZnRWwsIGZvcm1hdCwgZXhwb3J0QmFzZU5hbWUpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignV29yZCBjbG91ZHM6IGV4cG9ydCBmYWlsZWQnLCBlcnJvcik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0b2dnbGVNZW51KGZhbHNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBtYWtlTWVudUl0ZW0oJ1NWRycsICdzdmcnKTtcbiAgbWFrZU1lbnVJdGVtKCdQTkcnLCAncG5nJyk7XG4gIG1ha2VNZW51SXRlbSgnSlBFRycsICdqcGVnJyk7XG5cbiAgbWVudUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdG9nZ2xlTWVudShtZW51RWwuaGFzQXR0cmlidXRlKCdoaWRkZW4nKSk7XG4gIH0pO1xuXG4gIG1lbnVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICB0b2dnbGVNZW51KGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gIG1lbnVFbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0b2dnbGVNZW51KGZhbHNlKTtcbiAgICAgIG1lbnVCdXR0b24uZm9jdXMoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBleHBvcnRTdmcoc3ZnRWw6IFNWR1NWR0VsZW1lbnQsIGZvcm1hdDogJ3N2ZycgfCAncG5nJyB8ICdqcGVnJywgYmFzZU5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBzdmdUZXh0ID0gbmV3IFhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyhzdmdFbCk7XG4gIGNvbnN0IHN2Z0Jsb2IgPSBuZXcgQmxvYihbc3ZnVGV4dF0sIHsgdHlwZTogJ2ltYWdlL3N2Zyt4bWw7Y2hhcnNldD11dGYtOCcgfSk7XG5cbiAgaWYgKGZvcm1hdCA9PT0gJ3N2ZycpIHtcbiAgICB0cmlnZ2VyQmxvYkRvd25sb2FkKHN2Z0Jsb2IsIGAke2Jhc2VOYW1lfS5zdmdgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB3aWR0aCA9IE51bWJlcihzdmdFbC5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykgPz8gc3ZnRWwudmlld0JveC5iYXNlVmFsLndpZHRoID8/IDgwMCk7XG4gIGNvbnN0IGhlaWdodCA9IE51bWJlcihzdmdFbC5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpID8/IHN2Z0VsLnZpZXdCb3guYmFzZVZhbC5oZWlnaHQgPz8gNjAwKTtcbiAgY29uc3QgYml0bWFwQmxvYiA9IGF3YWl0IHJhc3Rlcml6ZVN2ZyhzdmdCbG9iLCB3aWR0aCwgaGVpZ2h0LCBmb3JtYXQpO1xuICB0cmlnZ2VyQmxvYkRvd25sb2FkKGJpdG1hcEJsb2IsIGAke2Jhc2VOYW1lfS4ke2Zvcm1hdCA9PT0gJ3BuZycgPyAncG5nJyA6ICdqcGcnfWApO1xufVxuXG5hc3luYyBmdW5jdGlvbiByYXN0ZXJpemVTdmcoXG4gIHN2Z0Jsb2I6IEJsb2IsXG4gIHdpZHRoOiBudW1iZXIsXG4gIGhlaWdodDogbnVtYmVyLFxuICBmb3JtYXQ6ICdwbmcnIHwgJ2pwZWcnLFxuKTogUHJvbWlzZTxCbG9iPiB7XG4gIGNvbnN0IHN2Z1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoc3ZnQmxvYik7XG4gIGNvbnN0IGltYWdlID0gYXdhaXQgbG9hZEltYWdlKHN2Z1VybCk7XG4gIFVSTC5yZXZva2VPYmplY3RVUkwoc3ZnVXJsKTtcblxuICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY2FudmFzLndpZHRoID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh3aWR0aCkpO1xuICBjYW52YXMuaGVpZ2h0ID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChoZWlnaHQpKTtcbiAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbnZhcyAyRCBjb250ZXh0IHVuYXZhaWxhYmxlJyk7XG4gIH1cblxuICBpZiAoZm9ybWF0ID09PSAnanBlZycpIHtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZmZmZmZmJztcbiAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIH1cblxuICBjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblxuICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2U8QmxvYj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNhbnZhcy50b0Jsb2IoKGJsb2IpID0+IHtcbiAgICAgIGlmICghYmxvYikge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIGJpdG1hcCBibG9iJykpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXNvbHZlKGJsb2IpO1xuICAgIH0sIGZvcm1hdCA9PT0gJ3BuZycgPyAnaW1hZ2UvcG5nJyA6ICdpbWFnZS9qcGVnJywgMC45Mik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBsb2FkSW1hZ2UodXJsOiBzdHJpbmcpOiBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHJlc29sdmUoaW1hZ2UpO1xuICAgIGltYWdlLm9uZXJyb3IgPSAoKSA9PiByZWplY3QobmV3IEVycm9yKCdGYWlsZWQgdG8gbG9hZCBTVkcgaW1hZ2UnKSk7XG4gICAgaW1hZ2Uuc3JjID0gdXJsO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gdHJpZ2dlckJsb2JEb3dubG9hZChibG9iOiBCbG9iLCBmaWxlbmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gIGNvbnN0IGFuY2hvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgYW5jaG9yLmhyZWYgPSB1cmw7XG4gIGFuY2hvci5kb3dubG9hZCA9IGZpbGVuYW1lO1xuICBhbmNob3Iuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhbmNob3IpO1xuICBhbmNob3IuY2xpY2soKTtcbiAgYW5jaG9yLnJlbW92ZSgpO1xuICBzZXRUaW1lb3V0KCgpID0+IFVSTC5yZXZva2VPYmplY3RVUkwodXJsKSwgMTAwMCk7XG59XG5cbmZ1bmN0aW9uIHNhbml0aXplRmlsZU5hbWUodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB2YWx1ZS50cmltKCkucmVwbGFjZSgvW15hLXowLTktX10rL2dpLCAnLScpLnJlcGxhY2UoLy0rL2csICctJykucmVwbGFjZSgvXi18LSQvZywgJycpIHx8ICd3b3JkLWNsb3VkJztcbn1cblxuZnVuY3Rpb24gZ2V0TGF5b3V0UGVyZm9ybWFuY2VQcm9maWxlKGRldGFpbDogUmVuZGVyU2V0dGluZ3NbJ3Byb2dyZXNzRGV0YWlsJ10pOiB7XG4gIHByb2dyZXNzVGhyb3R0bGVNczogbnVtYmVyO1xuICB3b3JkUHJvZ3Jlc3NTdHJpZGU6IG51bWJlcjtcbn0ge1xuICBpZiAoZGV0YWlsID09PSAndW5oaW5nZWQnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2dyZXNzVGhyb3R0bGVNczogMV8wMDBfMDAwLFxuICAgICAgd29yZFByb2dyZXNzU3RyaWRlOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgICB9O1xuICB9XG5cbiAgaWYgKGRldGFpbCA9PT0gJ2RldGFpbGVkJykge1xuICAgIHJldHVybiB7XG4gICAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDMwLFxuICAgICAgd29yZFByb2dyZXNzU3RyaWRlOiAxLFxuICAgIH07XG4gIH1cblxuICBpZiAoZGV0YWlsID09PSAnbWluaW1hbCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAyMjAsXG4gICAgICB3b3JkUHJvZ3Jlc3NTdHJpZGU6IDEyLFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHByb2dyZXNzVGhyb3R0bGVNczogODAsXG4gICAgd29yZFByb2dyZXNzU3RyaWRlOiA0LFxuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUaHJvdHRsZWRQcm9ncmVzcyhcbiAgb25Qcm9ncmVzczogKChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4gdm9pZCkgfCB1bmRlZmluZWQsXG4gIG1pbkludGVydmFsTXM6IG51bWJlcixcbik6IChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4gdm9pZCB7XG4gIGlmICghb25Qcm9ncmVzcykge1xuICAgIHJldHVybiAoKSA9PiB1bmRlZmluZWQ7XG4gIH1cblxuICBsZXQgbGFzdFJlcG9ydGVkQXQgPSAwO1xuICBsZXQgbGFzdFBlcmNlbnQgPSAtMTtcblxuICByZXR1cm4gKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBpZiAocGVyY2VudCAhPT0gMTAwICYmIHBlcmNlbnQgPT09IGxhc3RQZXJjZW50ICYmIG5vdyAtIGxhc3RSZXBvcnRlZEF0IDwgbWluSW50ZXJ2YWxNcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGVyY2VudCAhPT0gMTAwICYmIG5vdyAtIGxhc3RSZXBvcnRlZEF0IDwgbWluSW50ZXJ2YWxNcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxhc3RSZXBvcnRlZEF0ID0gbm93O1xuICAgIGxhc3RQZXJjZW50ID0gcGVyY2VudDtcbiAgICBvblByb2dyZXNzKG1lc3NhZ2UsIHBlcmNlbnQpO1xuICB9O1xufVxuIiwgImltcG9ydCB7IEl0ZW1WaWV3LCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgVklFV19UWVBFX05PVEVfV09SRF9DTE9VRCB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgdHlwZSB7IFdvcmRDbG91ZFNlcnZpY2VzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgTm90ZVdvcmRDbG91ZFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZXM6IFdvcmRDbG91ZFNlcnZpY2VzO1xuICBwcml2YXRlIHJlbmRlck5vbmNlID0gMDtcbiAgcHJpdmF0ZSBzZWxlY3RlZEZpbGVQYXRoID0gJyc7XG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgc2VydmljZXM6IFdvcmRDbG91ZFNlcnZpY2VzKSB7XG4gICAgc3VwZXIobGVhZik7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IHNlcnZpY2VzO1xuICB9XG5cbiAgZ2V0Vmlld1R5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gVklFV19UWVBFX05PVEVfV09SRF9DTE9VRDtcbiAgfVxuXG4gIGdldERpc3BsYXlUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdOb3RlIHdvcmQgY2xvdWRzJztcbiAgfVxuXG4gIGdldEljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2ZpbGUtdGV4dCc7XG4gIH1cblxuICBhc3luYyBvbk9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG4gICAgY29udGVudEVsLmVtcHR5KCk7XG4gICAgY29udGVudEVsLmFkZENsYXNzKCd2YXVsdC13b3JkLWNsb3VkLXZpZXcnKTtcblxuICAgIGNvbnN0IHRvcEVsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtdG9wJyB9KTtcbiAgICBjb25zdCBoZWFkZXJFbCA9IHRvcEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtaGVhZGVyJyB9KTtcbiAgICBoZWFkZXJFbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdOb3RlIHdvcmQgY2xvdWRzJywgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10aXRsZScgfSk7XG5cbiAgICBjb25zdCBjb250cm9sc0VsID0gdG9wRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1jb250cm9scycgfSk7XG5cbiAgICBjb25zdCBmaWxlRmlsdGVyRWwgPSBjb250cm9sc0VsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtdGFnLWZpbHRlcicgfSk7XG4gICAgY29uc3QgZmlsZUxhYmVsRWwgPSBmaWxlRmlsdGVyRWwuY3JlYXRlRWwoJ2xhYmVsJywgeyB0ZXh0OiAnT3BlbiBub3RlJywgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10YWctbGFiZWwnIH0pO1xuICAgIGNvbnN0IGZpbGVTZWxlY3RFbCA9IGZpbGVGaWx0ZXJFbC5jcmVhdGVFbCgnc2VsZWN0JywgeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLW1vZGUtc2VsZWN0JyB9KTtcbiAgICBmaWxlU2VsZWN0RWwuaWQgPSAndmF1bHQtd29yZC1jbG91ZC1ub3RlLXNlbGVjdCc7XG4gICAgZmlsZUxhYmVsRWwuc2V0QXR0cignZm9yJywgZmlsZVNlbGVjdEVsLmlkKTtcbiAgICBmaWxlU2VsZWN0RWwuc2V0QXR0cignYXJpYS1sYWJlbCcsICdDaG9vc2UgYW4gb3BlbiBub3RlJyk7XG5cbiAgICBjb25zdCBhY3RpdmVCdXR0b24gPSBjb250cm9sc0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICB0ZXh0OiAnVXNlIGFjdGl2ZSBub3RlJyxcbiAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtcmVmcmVzaCcsXG4gICAgfSk7XG4gICAgYWN0aXZlQnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnVXNlIGFjdGl2ZSBub3RlJyk7XG5cbiAgICBjb25zdCByZWZyZXNoQnV0dG9uID0gY29udHJvbHNFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgdGV4dDogJ1JlZnJlc2gnLFxuICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1yZWZyZXNoJyxcbiAgICB9KTtcbiAgICByZWZyZXNoQnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnUmVmcmVzaCB3b3JkIGNsb3VkJyk7XG5cbiAgICBjb25zdCBjYW52YXNFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNhbnZhcycgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZU9wZW5GaWxlT3B0aW9ucyhmaWxlU2VsZWN0RWwpO1xuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KGZpbGVTZWxlY3RFbCwgJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCA9IGZpbGVTZWxlY3RFbC52YWx1ZTtcbiAgICAgIHZvaWQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoYWN0aXZlQnV0dG9uLCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3RpdmVGaWxlID0gdGhpcy5zZXJ2aWNlcy5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoYWN0aXZlRmlsZSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZVBhdGggPSBhY3RpdmVGaWxlLnBhdGg7XG4gICAgICAgIHRoaXMudXBkYXRlT3BlbkZpbGVPcHRpb25zKGZpbGVTZWxlY3RFbCk7XG4gICAgICAgIGZpbGVTZWxlY3RFbC52YWx1ZSA9IHRoaXMuc2VsZWN0ZWRGaWxlUGF0aDtcbiAgICAgIH1cbiAgICAgIHZvaWQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQocmVmcmVzaEJ1dHRvbiwgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVPcGVuRmlsZU9wdGlvbnMoZmlsZVNlbGVjdEVsKTtcbiAgICAgIGlmICghZmlsZVNlbGVjdEVsLnZhbHVlICYmIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZVBhdGggPSAnJztcbiAgICAgIH1cbiAgICAgIHZvaWQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKCdhY3RpdmUtbGVhZi1jaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3RpdmVGaWxlID0gdGhpcy5zZXJ2aWNlcy5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWFjdGl2ZUZpbGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGVQYXRoICE9PSBhY3RpdmVGaWxlLnBhdGgpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gYWN0aXZlRmlsZS5wYXRoO1xuICAgICAgICB0aGlzLnVwZGF0ZU9wZW5GaWxlT3B0aW9ucyhmaWxlU2VsZWN0RWwpO1xuICAgICAgICBmaWxlU2VsZWN0RWwudmFsdWUgPSB0aGlzLnNlbGVjdGVkRmlsZVBhdGg7XG4gICAgICAgIHZvaWQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgYXdhaXQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gIH1cblxuICBhc3luYyBvblJlc2l6ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjYW52YXNFbCA9IHRoaXMuY29udGVudEVsLnF1ZXJ5U2VsZWN0b3IoJy52YXVsdC13b3JkLWNsb3VkLWNhbnZhcycpO1xuICAgIGlmIChjYW52YXNFbCBpbnN0YW5jZW9mIEhUTUxEaXZFbGVtZW50KSB7XG4gICAgICBhd2FpdCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZU9wZW5GaWxlT3B0aW9ucyhzZWxlY3RFbDogSFRNTFNlbGVjdEVsZW1lbnQpOiB2b2lkIHtcbiAgICBjb25zdCBvcGVuRmlsZXMgPSB0aGlzLnNlcnZpY2VzLmdldE9wZW5NYXJrZG93bkZpbGVzKCk7XG4gICAgY29uc3QgYWN0aXZlRmlsZSA9IHRoaXMuc2VydmljZXMuZ2V0QWN0aXZlRmlsZSgpO1xuXG4gICAgaWYgKCF0aGlzLnNlbGVjdGVkRmlsZVBhdGggJiYgYWN0aXZlRmlsZSkge1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gYWN0aXZlRmlsZS5wYXRoO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZEZpbGVQYXRoO1xuICAgIHNlbGVjdEVsLmVtcHR5KCk7XG5cbiAgICBpZiAob3BlbkZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgc2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdGV4dDogJ05vIG9wZW4gbWFya2Rvd24gbm90ZXMnLCB2YWx1ZTogJycgfSk7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZVBhdGggPSAnJztcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGZpbGUgb2Ygb3BlbkZpbGVzKSB7XG4gICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiBmaWxlLnBhdGgsIHZhbHVlOiBmaWxlLnBhdGggfSk7XG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSBmaWxlLnBhdGggPT09IHNlbGVjdGVkO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCA9IHNlbGVjdEVsLnZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyByZW5kZXJDbG91ZChjb250YWluZXJFbDogSFRNTERpdkVsZW1lbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBhY3RpdmVOb25jZSA9ICsrdGhpcy5yZW5kZXJOb25jZTtcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuICAgIGNvbnN0IGxvYWRpbmdFbCA9IGNvbnRhaW5lckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLCB0ZXh0OiAnQnVpbGRpbmcgY2xvdWQuLi4nIH0pO1xuICAgIGNvbnN0IHVwZGF0ZVByb2dyZXNzID0gKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgICBpZiAoYWN0aXZlTm9uY2UgIT09IHRoaXMucmVuZGVyTm9uY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbG9hZGluZ0VsLnNldFRleHQoYCR7bWVzc2FnZX0gKCR7cGVyY2VudH0lKWApO1xuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgdGFyZ2V0RmlsZSA9IHRoaXMuc2VydmljZXMuZ2V0T3Blbk1hcmtkb3duRmlsZXMoKS5maW5kKChmaWxlKSA9PiBmaWxlLnBhdGggPT09IHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCk7XG4gICAgICBpZiAoIXRhcmdldEZpbGUpIHtcbiAgICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLFxuICAgICAgICAgIHRleHQ6ICdPcGVuIGEgbWFya2Rvd24gbm90ZSBhbmQgc2VsZWN0IGl0IHRvIHZpZXcgYSBub3RlLXNwZWNpZmljIHdvcmQgY2xvdWQuJyxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgd29yZHMgPSBhd2FpdCB0aGlzLnNlcnZpY2VzLmNvbGxlY3RGaWxlV29yZHModGFyZ2V0RmlsZSwgdXBkYXRlUHJvZ3Jlc3MpO1xuXG4gICAgICBpZiAod29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJyxcbiAgICAgICAgICB0ZXh0OiBgTm8gd29yZHMgZm91bmQgaW4gJHt0YXJnZXRGaWxlLmJhc2VuYW1lfS5gLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLnNlcnZpY2VzLmRyYXdXb3JkQ2xvdWQoe1xuICAgICAgICBjb250YWluZXJFbCxcbiAgICAgICAgd29yZHMsXG4gICAgICAgIGFyaWFMYWJlbDogYFdvcmQgY2xvdWQgZm9yICR7dGFyZ2V0RmlsZS5iYXNlbmFtZX1gLFxuICAgICAgICBvblByb2dyZXNzOiB1cGRhdGVQcm9ncmVzcyxcbiAgICAgICAgb25SZWZyZXNoOiAoKSA9PiB0aGlzLnJlbmRlckNsb3VkKGNvbnRhaW5lckVsKSxcbiAgICAgICAgb25Xb3JkQ2xpY2s6ICh3b3JkKSA9PiB7XG4gICAgICAgICAgdm9pZCB0aGlzLnNlcnZpY2VzLm9wZW5TZWFyY2hGb3JXb3JkKHdvcmQsIHsgZmlsZVBhdGg6IHRhcmdldEZpbGUucGF0aCB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoYWN0aXZlTm9uY2UgIT09IHRoaXMucmVuZGVyTm9uY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdGUgd29yZCBjbG91ZDogZmFpbGVkIHRvIHJlbmRlciBjbG91ZCcsIGVycm9yKTtcbiAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdih7XG4gICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLFxuICAgICAgICB0ZXh0OiAnQ291bGQgbm90IHJlbmRlciB0aGUgd29yZCBjbG91ZC4gT3BlbiBkZXZlbG9wZXIgY29uc29sZSBmb3IgZGV0YWlscy4nLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgSXRlbVZpZXcsIFdvcmtzcGFjZUxlYWYgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBWSUVXX1RZUEVfVkFVTFRfV09SRF9DTE9VRCB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgdHlwZSB7IFRhZ01hdGNoTW9kZSwgV29yZENsb3VkU2VydmljZXMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBWYXVsdFdvcmRDbG91ZFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZXM6IFdvcmRDbG91ZFNlcnZpY2VzO1xuICBwcml2YXRlIHJlbmRlck5vbmNlID0gMDtcbiAgcHJpdmF0ZSBzZWxlY3RlZFRhZ3M6IHN0cmluZ1tdID0gW107XG4gIHByaXZhdGUgdGFnTWF0Y2hNb2RlOiBUYWdNYXRjaE1vZGUgPSAnYW55JztcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXMpIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgICB0aGlzLnNlcnZpY2VzID0gc2VydmljZXM7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBWSUVXX1RZUEVfVkFVTFRfV09SRF9DTE9VRDtcbiAgfVxuXG4gIGdldERpc3BsYXlUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdWYXVsdCBXb3JkIENsb3VkJztcbiAgfVxuXG4gIGdldEljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2Nsb3VkJztcbiAgfVxuXG4gIGFzeW5jIG9uT3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICBjb250ZW50RWwuZW1wdHkoKTtcbiAgICBjb250ZW50RWwuYWRkQ2xhc3MoJ3ZhdWx0LXdvcmQtY2xvdWQtdmlldycpO1xuXG4gICAgY29uc3QgdG9wRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10b3AnIH0pO1xuXG4gICAgY29uc3QgaGVhZGVyRWwgPSB0b3BFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWhlYWRlcicgfSk7XG4gICAgaGVhZGVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnV29yZCBjbG91ZHMnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRpdGxlJyB9KTtcblxuICAgIGNvbnN0IGNvbnRyb2xzRWwgPSB0b3BFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNvbnRyb2xzJyB9KTtcblxuICAgIGNvbnN0IHRhZ1BpY2tlckVsID0gY29udHJvbHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRhZy1maWx0ZXInIH0pO1xuICAgIGNvbnN0IHRhZ1NlbGVjdEVsID0gdGFnUGlja2VyRWwuY3JlYXRlRWwoJ3NlbGVjdCcsIHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1tb2RlLXNlbGVjdCcgfSk7XG4gICAgdGFnU2VsZWN0RWwuaWQgPSAndmF1bHQtd29yZC1jbG91ZC10YWctc2VsZWN0JztcbiAgICB0YWdTZWxlY3RFbC5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ0FkZCB0YWcgZmlsdGVyJyk7XG5cbiAgICBjb25zdCBtb2RlRWwgPSBjb250cm9sc0VsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtbWF0Y2gtbW9kZScgfSk7XG4gICAgbW9kZUVsLmNyZWF0ZUVsKCdzcGFuJywgeyB0ZXh0OiAnTWF0Y2gnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRhZy1sYWJlbCcgfSk7XG4gICAgY29uc3QgbW9kZVNlbGVjdEVsID0gbW9kZUVsLmNyZWF0ZUVsKCdzZWxlY3QnLCB7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtbW9kZS1zZWxlY3QnIH0pO1xuICAgIG1vZGVTZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiAnQW55JywgdmFsdWU6ICdhbnknIH0pO1xuICAgIG1vZGVTZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiAnQWxsJywgdmFsdWU6ICdhbGwnIH0pO1xuICAgIG1vZGVTZWxlY3RFbC52YWx1ZSA9IHRoaXMudGFnTWF0Y2hNb2RlO1xuICAgIG1vZGVTZWxlY3RFbC5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1RhZyBtYXRjaCBtb2RlJyk7XG5cbiAgICBjb25zdCBhcHBsaWVkVGFnc0VsID0gdG9wRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1hcHBsaWVkLXRhZ3MnIH0pO1xuICAgIGNvbnN0IGNhbnZhc0VsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY2FudmFzJyB9KTtcblxuICAgIHRoaXMudXBkYXRlVGFnUGlja2VyT3B0aW9ucyh0YWdTZWxlY3RFbCk7XG4gICAgdGhpcy5yZW5kZXJBcHBsaWVkVGFnQ2hpcHMoYXBwbGllZFRhZ3NFbCwgdGFnU2VsZWN0RWwsIGNhbnZhc0VsKTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudCh0YWdTZWxlY3RFbCwgJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkVGFnID0gdGFnU2VsZWN0RWwudmFsdWU7XG4gICAgICBpZiAoc2VsZWN0ZWRUYWcgJiYgIXRoaXMuc2VsZWN0ZWRUYWdzLmluY2x1ZGVzKHNlbGVjdGVkVGFnKSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkVGFncy5wdXNoKHNlbGVjdGVkVGFnKTtcbiAgICAgIH1cblxuICAgICAgdGFnU2VsZWN0RWwudmFsdWUgPSAnJztcbiAgICAgIHRoaXMudXBkYXRlVGFnUGlja2VyT3B0aW9ucyh0YWdTZWxlY3RFbCk7XG4gICAgICB0aGlzLnJlbmRlckFwcGxpZWRUYWdDaGlwcyhhcHBsaWVkVGFnc0VsLCB0YWdTZWxlY3RFbCwgY2FudmFzRWwpO1xuICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChtb2RlU2VsZWN0RWwsICdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICB0aGlzLnRhZ01hdGNoTW9kZSA9IG1vZGVTZWxlY3RFbC52YWx1ZSA9PT0gJ2FsbCcgPyAnYWxsJyA6ICdhbnknO1xuICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICB9KTtcblxuICAgIGF3YWl0IHRoaXMucmVuZGVyQ2xvdWQoY2FudmFzRWwpO1xuICB9XG5cbiAgYXN5bmMgb25SZXNpemUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY2FudmFzRWwgPSB0aGlzLmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKCcudmF1bHQtd29yZC1jbG91ZC1jYW52YXMnKTtcbiAgICBpZiAoY2FudmFzRWwgaW5zdGFuY2VvZiBIVE1MRGl2RWxlbWVudCkge1xuICAgICAgYXdhaXQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVUYWdQaWNrZXJPcHRpb25zKHNlbGVjdEVsOiBIVE1MU2VsZWN0RWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IHRhZ3MgPSB0aGlzLnNlcnZpY2VzLmdldEF2YWlsYWJsZVRhZ3MoKTtcbiAgICBjb25zdCBzZWxlY3RlZFNldCA9IG5ldyBTZXQodGhpcy5zZWxlY3RlZFRhZ3MpO1xuXG4gICAgc2VsZWN0RWwuZW1wdHkoKTtcbiAgICBzZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiAnQWRkIHRhZyBmaWx0ZXIuLi4nLCB2YWx1ZTogJycgfSk7XG5cbiAgICBmb3IgKGNvbnN0IHRhZyBvZiB0YWdzKSB7XG4gICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiB0YWcsIHZhbHVlOiB0YWcgfSk7XG4gICAgICBvcHRpb24uZGlzYWJsZWQgPSBzZWxlY3RlZFNldC5oYXModGFnKTtcbiAgICB9XG5cbiAgICBzZWxlY3RFbC52YWx1ZSA9ICcnO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJBcHBsaWVkVGFnQ2hpcHMoXG4gICAgY2hpcHNFbDogSFRNTERpdkVsZW1lbnQsXG4gICAgdGFnU2VsZWN0RWw6IEhUTUxTZWxlY3RFbGVtZW50LFxuICAgIGNhbnZhc0VsOiBIVE1MRGl2RWxlbWVudCxcbiAgKTogdm9pZCB7XG4gICAgY2hpcHNFbC5lbXB0eSgpO1xuXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRUYWdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY2hpcHNFbC5jcmVhdGVTcGFuKHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1jaGlwLWVtcHR5JywgdGV4dDogJ05vIHRhZyBmaWx0ZXJzIGFwcGxpZWQuJyB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHRhZyBvZiB0aGlzLnNlbGVjdGVkVGFncykge1xuICAgICAgY29uc3QgY2hpcEVsID0gY2hpcHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNoaXAnIH0pO1xuICAgICAgY2hpcEVsLmNyZWF0ZVNwYW4oeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNoaXAtdGV4dCcsIHRleHQ6IHRhZyB9KTtcblxuICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gY2hpcEVsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY2hpcC1yZW1vdmUnLFxuICAgICAgICB0ZXh0OiAneCcsXG4gICAgICB9KTtcbiAgICAgIHJlbW92ZUJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgYFJlbW92ZSAke3RhZ30gZmlsdGVyYCk7XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChyZW1vdmVCdXR0b24sICdjbGljaycsICgpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhZ3MgPSB0aGlzLnNlbGVjdGVkVGFncy5maWx0ZXIoKHZhbHVlKSA9PiB2YWx1ZSAhPT0gdGFnKTtcbiAgICAgICAgdGhpcy51cGRhdGVUYWdQaWNrZXJPcHRpb25zKHRhZ1NlbGVjdEVsKTtcbiAgICAgICAgdGhpcy5yZW5kZXJBcHBsaWVkVGFnQ2hpcHMoY2hpcHNFbCwgdGFnU2VsZWN0RWwsIGNhbnZhc0VsKTtcbiAgICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcmVuZGVyQ2xvdWQoY29udGFpbmVyRWw6IEhUTUxEaXZFbGVtZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgYWN0aXZlTm9uY2UgPSArK3RoaXMucmVuZGVyTm9uY2U7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICBjb25zdCBsb2FkaW5nRWwgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJywgdGV4dDogJ0J1aWxkaW5nIGNsb3VkLi4uJyB9KTtcbiAgICBjb25zdCB1cGRhdGVQcm9ncmVzcyA9IChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgICAgaWYgKGFjdGl2ZU5vbmNlICE9PSB0aGlzLnJlbmRlck5vbmNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxvYWRpbmdFbC5zZXRUZXh0KGAke21lc3NhZ2V9ICgke3BlcmNlbnR9JSlgKTtcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHdvcmRzID0gYXdhaXQgdGhpcy5zZXJ2aWNlcy5jb2xsZWN0VmF1bHRXb3Jkcyh0aGlzLnNlbGVjdGVkVGFncywgdGhpcy50YWdNYXRjaE1vZGUsIHVwZGF0ZVByb2dyZXNzKTtcblxuICAgICAgaWYgKHdvcmRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsXG4gICAgICAgICAgdGV4dDogdGhpcy5zZWxlY3RlZFRhZ3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgPyAnTm8gd29yZHMgZm91bmQgZm9yIHRoZSBzZWxlY3RlZCB0YWcgZmlsdGVycy4nXG4gICAgICAgICAgICA6ICdObyB3b3JkcyBmb3VuZC4nLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLnNlcnZpY2VzLmRyYXdXb3JkQ2xvdWQoe1xuICAgICAgICBjb250YWluZXJFbCxcbiAgICAgICAgd29yZHMsXG4gICAgICAgIGFyaWFMYWJlbDogJ1dvcmQgY2xvdWQgYmFzZWQgb24gbWFya2Rvd24gZmlsZXMgaW4gdGhlIHZhdWx0JyxcbiAgICAgICAgb25Qcm9ncmVzczogdXBkYXRlUHJvZ3Jlc3MsXG4gICAgICAgIG9uUmVmcmVzaDogKCkgPT4gdGhpcy5yZW5kZXJDbG91ZChjb250YWluZXJFbCksXG4gICAgICAgIG9uV29yZENsaWNrOiAod29yZCkgPT4ge1xuICAgICAgICAgIHZvaWQgdGhpcy5zZXJ2aWNlcy5vcGVuU2VhcmNoRm9yV29yZCh3b3JkLCB7XG4gICAgICAgICAgICB0YWdzOiB0aGlzLnNlbGVjdGVkVGFncyxcbiAgICAgICAgICAgIHRhZ01hdGNoTW9kZTogdGhpcy50YWdNYXRjaE1vZGUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgaWYgKGFjdGl2ZU5vbmNlICE9PSB0aGlzLnJlbmRlck5vbmNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgICBjb25zb2xlLmVycm9yKCdWYXVsdCB3b3JkIGNsb3VkOiBmYWlsZWQgdG8gcmVuZGVyIGNsb3VkJywgZXJyb3IpO1xuICAgICAgY29udGFpbmVyRWwuY3JlYXRlRGl2KHtcbiAgICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsXG4gICAgICAgIHRleHQ6ICdDb3VsZCBub3QgcmVuZGVyIHRoZSB3b3JkIGNsb3VkLiBPcGVuIGRldmVsb3BlciBjb25zb2xlIGZvciBkZXRhaWxzLicsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUEsZ0ZBQUFBLFNBQUE7QUFDQSxLQUFDLFNBQVUsUUFBUSxTQUFTO0FBQzVCLGFBQU8sWUFBWSxZQUFZLE9BQU9BLFlBQVcsY0FBYyxRQUFRLE9BQU8sSUFDOUUsT0FBTyxXQUFXLGNBQWMsT0FBTyxNQUFNLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxLQUN2RSxTQUFTLFVBQVUsTUFBTSxRQUFRLE9BQU8sS0FBSyxPQUFPLE1BQU0sQ0FBQyxDQUFDO0FBQUEsSUFDN0QsR0FBRSxTQUFNLFNBQVVDLFVBQVM7QUFBRTtBQUU3QixVQUFJLE9BQU8sRUFBQyxPQUFPLFdBQVc7QUFBQSxNQUFDLEVBQUM7QUFFaEMsZUFBUyxXQUFXO0FBQ2xCLGlCQUFTLElBQUksR0FBRyxJQUFJLFVBQVUsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDM0QsY0FBSSxFQUFFLElBQUksVUFB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LFVBQU0scUJBQXFCLFlBQVksTUFBTSxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUztBQUV4RSxVQUFNLFNBQVMsc0JBQXNCLE9BQU87QUFDNUMsVUFBTSxTQUFTLHFCQUFxQixPQUFPO0FBQzNDLFVBQU0sZUFBZSxHQUFHLE1BQU0sR0FBRyxVQUFVLEdBQUcsTUFBTTtBQUVwRCxXQUFPLGlCQUFpQixZQUFZO0FBQ3BDLFdBQU87QUFBQSxFQUNUO0FBQ0Y7IiwKICAibmFtZXMiOiBbIm1vZHVsZSIsICJleHBvcnRzIiwgInBhcnNlVHlwZW5hbWVzIiwgIm1vZHVsZSIsICJpIiwgImNhbnZhcyIsICJ3IiwgImgiLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJkb2N1bWVudCIsICJkb2N1bWVudCIsICJkb2N1bWVudCIsICJpbXBvcnRfb2JzaWRpYW4iLCAiY29tcHV0ZVNjYWxlU2NvcmUiLCAiY2xhbXAwMSIsICJrZXkiLCAiZG9jdW1lbnQiLCAiZGF0dW0iLCAic2VsZWN0aW9uIiwgIndpbmRvdyIsICJzZWxlY3RfZGVmYXVsdCIsICJpbXBvcnRfb2JzaWRpYW4iLCAic2VsZWN0X2RlZmF1bHQiLCAiY3JlYXRlVGhyb3R0bGVkUHJvZ3Jlc3MiLCAibGF5b3V0V29yZHMiLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiJdCn0K
