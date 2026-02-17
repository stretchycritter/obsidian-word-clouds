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
var WORD_CLOUD_BLOCK_PATTERN = /```(?:wordcloud|word-cloud)\s*\n[\s\S]*?\n```/gi;
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

// src/blocks/wordcloud-block.ts
var import_obsidian2 = require("obsidian");

// src/modals/edit-word-cloud-modal.ts
var import_obsidian = require("obsidian");

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

// src/modals/edit-word-cloud-modal.ts
var DEFAULT_STATE = {
  cloudId: "",
  scope: "file",
  size: "medium",
  specificFilePath: "",
  includeTagsRaw: "",
  excludeTagsRaw: "",
  tagMatchMode: "any",
  folderPathsRaw: "",
  frontmatterRulesRaw: "",
  minCountRaw: "",
  maxCountRaw: ""
};
var FRONTMATTER_OPERATORS = [
  "equals",
  "not-equals",
  "contains",
  "gt",
  "gte",
  "lt",
  "lte",
  "exists",
  "not-exists"
];
var EmbedWordCloudModal = class extends import_obsidian.Modal {
  constructor(app, services, onInsert, options = {}) {
    super(app);
    this.services = services;
    this.onInsert = onInsert;
    this.title = options.title ?? "Embed word cloud in document";
    this.description = options.description ?? "Configure options, then insert a word cloud embed at your cursor.";
    this.submitButtonText = options.submitButtonText ?? "Apply";
    const initialState = options.initialState ?? {};
    this.state = {
      ...DEFAULT_STATE,
      ...initialState
    };
    if (!this.state.cloudId) {
      this.state.cloudId = createEmbedCloudId();
    }
    if (this.state.scope === "folder") {
      this.state.scope = "vault";
    }
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
    this.specificFileWrapperEl = contentEl.createDiv({ cls: "word-cloud-embed-wizard-section" });
    new import_obsidian.Setting(this.scopeWrapperEl).setName("Scope").setDesc("Choose whether this cloud uses the note file or the entire vault.").addDropdown((dropdown) => {
      dropdown.addOption("file", "File").addOption("vault", "Vault").setValue(this.state.scope === "file" ? "file" : "vault").onChange((value) => {
        this.state.scope = value === "file" ? "file" : "vault";
        this.refreshConditionalSections();
      });
    });
    const settingsShellEl = contentEl.createDiv({ cls: "word-cloud-embed-wizard-settings" });
    this.tabsEl = settingsShellEl.createDiv({ cls: "word-cloud-embed-wizard-tabs" });
    this.tabsEl.setAttr("role", "tablist");
    this.tabsEl.setAttr("aria-label", "Embedded word cloud settings tabs");
    this.filtersTabButtonEl = this.buildTabButton("filters", "Filters", true);
    this.appearanceTabButtonEl = this.buildTabButton("appearance", "Appearance", false);
    this.advancedTabButtonEl = this.buildTabButton("advanced", "Advanced", false);
    const panelsEl = settingsShellEl.createDiv({ cls: "word-cloud-embed-wizard-panels" });
    this.filtersPanelEl = panelsEl.createDiv({ cls: "word-cloud-embed-wizard-panel is-active" });
    this.filtersPanelEl.id = "word-cloud-embed-wizard-panel-filters";
    this.filtersPanelEl.setAttr("role", "tabpanel");
    this.filtersPanelEl.setAttr("aria-labelledby", this.filtersTabButtonEl.id);
    this.appearancePanelEl = panelsEl.createDiv({ cls: "word-cloud-embed-wizard-panel" });
    this.appearancePanelEl.id = "word-cloud-embed-wizard-panel-appearance";
    this.appearancePanelEl.setAttr("role", "tabpanel");
    this.appearancePanelEl.setAttr("aria-labelledby", this.appearanceTabButtonEl.id);
    this.advancedPanelEl = panelsEl.createDiv({ cls: "word-cloud-embed-wizard-panel" });
    this.advancedPanelEl.id = "word-cloud-embed-wizard-panel-advanced";
    this.advancedPanelEl.setAttr("role", "tabpanel");
    this.advancedPanelEl.setAttr("aria-labelledby", this.advancedTabButtonEl.id);
    this.advancedPanelEl.createEl("p", {
      cls: "word-cloud-embed-wizard-description",
      text: "No additional advanced settings are available."
    });
    this.includeTagsWrapperEl = this.filtersPanelEl.createDiv({ cls: "word-cloud-embed-wizard-section" });
    this.matchModeWrapperEl = this.filtersPanelEl.createDiv({ cls: "word-cloud-embed-wizard-section" });
    this.sizeWrapperEl = this.appearancePanelEl.createDiv({ cls: "word-cloud-embed-wizard-section" });
    new import_obsidian.Setting(this.sizeWrapperEl).setName("Size").setDesc("Select the embedded cloud size preset.").addDropdown((dropdown) => {
      dropdown.addOption("small", "Small").addOption("medium", "Medium").addOption("large", "Large").setValue(this.state.size).onChange((value) => {
        this.state.size = value === "small" || value === "large" ? value : "medium";
      });
    });
    this.renderSpecificFileSetting();
    this.renderIncludeTagSetting();
    this.renderTagMatchModeSetting();
    const buttonRowEl = contentEl.createDiv({ cls: "word-cloud-embed-wizard-actions" });
    const cancelButton = new import_obsidian.ButtonComponent(buttonRowEl).setButtonText("Cancel").onClick(() => {
      this.close();
    });
    cancelButton.buttonEl.type = "button";
    const applyButton = new import_obsidian.ButtonComponent(buttonRowEl).setButtonText(this.submitButtonText).setCta().onClick(async () => {
      applyButton.setDisabled(true);
      try {
        const wasInserted = await this.onInsert(this.buildEmbedBlock());
        if (wasInserted && this.isOpen) {
          this.close();
        }
      } catch (error) {
        console.error("Word clouds: failed to apply embed changes", error);
        new import_obsidian.Notice("Could not apply word cloud changes.");
      }
      if (applyButton.buttonEl.isConnected) {
        applyButton.setDisabled(false);
      }
    });
    applyButton.buttonEl.type = "button";
    this.refreshConditionalSections();
    this.switchTab("filters");
  }
  onClose() {
    this.contentEl.empty();
  }
  renderSpecificFileSetting() {
    this.specificFileWrapperEl.empty();
    const filePaths = this.app.vault.getMarkdownFiles().map((file) => file.path).sort((a, b) => a.localeCompare(b));
    const hasCurrent = filePaths.includes(this.state.specificFilePath);
    new import_obsidian.Setting(this.specificFileWrapperEl).setName("File").setDesc("Select the file used when scope is set to file. Choose Current note to use the note containing this embed.").addDropdown((dropdown) => {
      dropdown.addOption("", "Current note");
      for (const filePath of filePaths) {
        dropdown.addOption(filePath, filePath);
      }
      if (this.state.specificFilePath && !hasCurrent) {
        dropdown.addOption(this.state.specificFilePath, this.state.specificFilePath);
      }
      dropdown.setValue(this.state.specificFilePath).onChange((value) => {
        this.state.specificFilePath = value;
      });
    });
  }
  renderIncludeTagSetting() {
    this.includeTagsWrapperEl.empty();
    const availableTags = this.services.getAvailableTags();
    const tagHint = availableTags.length > 0 ? `Available: ${availableTags.slice(0, 12).join(", ")}${availableTags.length > 12 ? "\u2026" : ""}` : "No tags detected yet.";
    new import_obsidian.Setting(this.includeTagsWrapperEl).setName("Include tags").setDesc(`Optional comma-separated tags to include. ${tagHint}`).addText((text) => {
      text.setPlaceholder("#project, #meeting").setValue(this.state.includeTagsRaw).onChange((value) => {
        this.state.includeTagsRaw = value;
      });
    });
  }
  renderTagMatchModeSetting() {
    this.matchModeWrapperEl.empty();
    new import_obsidian.Setting(this.matchModeWrapperEl).setName("Include match mode").setDesc("How include tags should match when multiple tags are set.").addDropdown((dropdown) => {
      dropdown.addOption("any", "Any include tag").addOption("all", "All include tags").setValue(this.state.tagMatchMode).onChange((value) => {
        this.state.tagMatchMode = value === "all" ? "all" : "any";
      });
    });
  }
  refreshConditionalSections() {
    this.specificFileWrapperEl.toggleClass("is-hidden", this.state.scope !== "file");
  }
  buildTabButton(tab, label, isActive) {
    const buttonEl = this.tabsEl.createEl("button", {
      cls: `word-cloud-embed-wizard-tab${isActive ? " is-active" : ""}`,
      text: label
    });
    buttonEl.id = `word-cloud-embed-wizard-tab-${tab}`;
    buttonEl.type = "button";
    buttonEl.setAttr("role", "tab");
    buttonEl.setAttr("aria-controls", `word-cloud-embed-wizard-panel-${tab}`);
    buttonEl.setAttr("aria-selected", isActive ? "true" : "false");
    buttonEl.setAttr("tabindex", isActive ? "0" : "-1");
    buttonEl.addEventListener("click", () => {
      this.switchTab(tab);
    });
    buttonEl.addEventListener("keydown", (event) => {
      this.handleTabKeydown(event, tab);
    });
    return buttonEl;
  }
  handleTabKeydown(event, currentTab) {
    const tabs = ["filters", "appearance", "advanced"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex === -1) {
      return;
    }
    if (event.key === "ArrowRight") {
      const nextTab = tabs[(currentIndex + 1) % tabs.length];
      this.switchTab(nextTab);
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowLeft") {
      const nextTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
      this.switchTab(nextTab);
      event.preventDefault();
      return;
    }
    if (event.key === "Home") {
      this.switchTab(tabs[0]);
      event.preventDefault();
      return;
    }
    if (event.key === "End") {
      this.switchTab(tabs[tabs.length - 1]);
      event.preventDefault();
    }
  }
  switchTab(tab) {
    const showFilters = tab === "filters";
    const showAppearance = tab === "appearance";
    const showAdvanced = tab === "advanced";
    this.filtersTabButtonEl.toggleClass("is-active", showFilters);
    this.filtersTabButtonEl.setAttr("aria-selected", showFilters ? "true" : "false");
    this.filtersTabButtonEl.setAttr("tabindex", showFilters ? "0" : "-1");
    this.appearanceTabButtonEl.toggleClass("is-active", showAppearance);
    this.appearanceTabButtonEl.setAttr("aria-selected", showAppearance ? "true" : "false");
    this.appearanceTabButtonEl.setAttr("tabindex", showAppearance ? "0" : "-1");
    this.advancedTabButtonEl.toggleClass("is-active", showAdvanced);
    this.advancedTabButtonEl.setAttr("aria-selected", showAdvanced ? "true" : "false");
    this.advancedTabButtonEl.setAttr("tabindex", showAdvanced ? "0" : "-1");
    this.filtersPanelEl.toggleClass("is-active", showFilters);
    this.appearancePanelEl.toggleClass("is-active", showAppearance);
    this.advancedPanelEl.toggleClass("is-active", showAdvanced);
    const targetButton = showFilters ? this.filtersTabButtonEl : showAppearance ? this.appearanceTabButtonEl : this.advancedTabButtonEl;
    if (document.activeElement && this.tabsEl.contains(document.activeElement)) {
      targetButton.focus();
    }
  }
  buildEmbedBlock() {
    const lines = ["```wordcloud", `id: ${this.state.cloudId}`, `scope: ${this.state.scope}`, `size: ${this.state.size}`];
    const includeTags = parseTagList(this.state.includeTagsRaw);
    const excludeTags = parseTagList(this.state.excludeTagsRaw).filter((tag) => !includeTags.includes(tag));
    const folderPaths = parseList(this.state.folderPathsRaw);
    const frontmatterRules = parseFrontmatterRules(this.state.frontmatterRulesRaw);
    const minCount = parseCount(this.state.minCountRaw);
    const maxCount = parseCount(this.state.maxCountRaw);
    const specificFilePath = this.state.specificFilePath.trim();
    if (specificFilePath && this.state.scope === "file") {
      lines.push(`file: ${specificFilePath}`);
    }
    if (includeTags.length > 0) {
      lines.push(`include-tags: ${includeTags.join(", ")}`);
    }
    if (excludeTags.length > 0) {
      lines.push(`exclude-tags: ${excludeTags.join(", ")}`);
    }
    if (includeTags.length > 1 || this.state.tagMatchMode === "all") {
      lines.push(`tag-match: ${this.state.tagMatchMode}`);
    }
    if (folderPaths.length > 0 && this.state.scope === "folder") {
      lines.push(`folder-paths: ${folderPaths.join(", ")}`);
    }
    if (frontmatterRules.length > 0) {
      lines.push(`frontmatter-rules: ${frontmatterRules.map(serializeFrontmatterRule).join("; ")}`);
    }
    if (minCount !== null) {
      lines.push(`min-count: ${minCount}`);
    }
    if (maxCount !== null) {
      lines.push(`max-count: ${maxCount}`);
    }
    lines.push("```");
    return lines.join("\n");
  }
};
function parseList(rawValue) {
  return [...new Set(rawValue.split(",").map((entry) => entry.trim()).filter((entry) => entry.length > 0))];
}
function parseTagList(rawValue) {
  const tags = /* @__PURE__ */ new Set();
  for (const entry of parseList(rawValue)) {
    const normalized = normalizeTag(entry);
    if (normalized) {
      tags.add(normalized);
    }
  }
  return [...tags];
}
function parseCount(rawValue) {
  const parsed = Number.parseInt(rawValue.trim(), 10);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return Math.min(9999, Math.max(1, parsed));
}
function parseFrontmatterRules(rawValue) {
  const rules = [];
  const entries = rawValue.split(";").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
  for (const entry of entries) {
    const parts = entry.split("|").map((part) => part.trim());
    const key = parts[0] ?? "";
    if (!key) {
      continue;
    }
    const rawOperator = parts[1] ?? "";
    const operator = FRONTMATTER_OPERATORS.includes(rawOperator) ? rawOperator : "equals";
    const value = parts.slice(2).join("|").trim();
    if (operator === "exists" || operator === "not-exists") {
      rules.push({ key, operator });
      continue;
    }
    rules.push({ key, operator, value });
  }
  return rules;
}
function serializeFrontmatterRule(rule) {
  if (rule.operator === "exists" || rule.operator === "not-exists") {
    return `${rule.key}|${rule.operator}|`;
  }
  return `${rule.key}|${rule.operator}|${rule.value ?? ""}`;
}
function createEmbedCloudId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const randomPart = Math.random().toString(36).slice(2, 10);
  const timePart = Date.now().toString(36);
  return `wc-${timePart}-${randomPart}`;
}

// src/blocks/wordcloud-block.ts
var DEFAULT_OPTIONS = {
  cloudId: "",
  scope: "file",
  size: "medium",
  includeTags: [],
  excludeTags: [],
  tagMatchMode: "any",
  folderPaths: [],
  frontmatterRules: [],
  minCount: 1,
  maxCount: 9999,
  excludeWords: [],
  interactions: true
};
var FRONTMATTER_OPERATORS2 = /* @__PURE__ */ new Set([
  "equals",
  "not-equals",
  "contains",
  "gt",
  "gte",
  "lt",
  "lte",
  "exists",
  "not-exists"
]);
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
      const sourceScope = resolveSourceScope(plugin, ctx, options);
      if (options.scope === "file" && !sourceScope.activeFilePath) {
        stateEl.setText("Could not resolve the file for this embedded cloud.");
        return;
      }
      if (options.scope === "folder" && sourceScope.folderPaths.length === 0) {
        stateEl.setText("Add at least one folder path for folder scope.");
        return;
      }
      const words = await services.collectVaultWords({
        sourceRules: {
          scope: sourceScope,
          includeTags: options.includeTags,
          excludeTags: options.excludeTags,
          tagMatchMode: options.tagMatchMode,
          frontmatterRules: options.frontmatterRules
        },
        frequency: {
          minCount: options.minCount,
          maxCount: options.maxCount
        },
        excludeWords: options.excludeWords
      }, updateProgress);
      let searchScope = {};
      if (options.scope === "file" && sourceScope.activeFilePath) {
        searchScope = { filePath: sourceScope.activeFilePath };
      } else {
        searchScope = {
          includeTags: options.includeTags,
          excludeTags: options.excludeTags,
          tagMatchMode: options.tagMatchMode
        };
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
function resolveSourceScope(plugin, ctx, options) {
  if (options.scope === "file") {
    const file = options.specificFilePath ? resolveSpecificFile(plugin, options.specificFilePath) : resolveCurrentFile(plugin, ctx);
    return {
      mode: "active-file",
      activeFilePath: file?.path ?? "",
      folderPaths: []
    };
  }
  if (options.scope === "folder") {
    return {
      mode: "folder",
      activeFilePath: "",
      folderPaths: [...options.folderPaths]
    };
  }
  return {
    mode: "vault",
    activeFilePath: "",
    folderPaths: []
  };
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
    if (rawKey === "id" || rawKey === "cloud-id" || rawKey === "cloud_id" || rawKey === "guid") {
      options.cloudId = rawValue.trim();
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
    if (rawKey === "tags" || rawKey === "include-tags" || rawKey === "include_tags") {
      options.includeTags = parseTagList2(rawValue);
      continue;
    }
    if (rawKey === "exclude-tags" || rawKey === "exclude_tags") {
      options.excludeTags = parseTagList2(rawValue);
      continue;
    }
    if (rawKey === "match" || rawKey === "tag-match" || rawKey === "tag_match") {
      options.tagMatchMode = rawValue.trim().toLowerCase() === "all" ? "all" : "any";
      continue;
    }
    if (rawKey === "folder-paths" || rawKey === "folder_paths" || rawKey === "folders") {
      options.folderPaths = parseList2(rawValue);
      if (!scopeWasExplicitlySet) {
        options.scope = "folder";
      }
      continue;
    }
    if (rawKey === "frontmatter-rules" || rawKey === "frontmatter_rules") {
      options.frontmatterRules = parseFrontmatterRules2(rawValue);
      continue;
    }
    if (rawKey === "min-count" || rawKey === "min_count") {
      options.minCount = parseFrequencyCount(rawValue, options.minCount);
      continue;
    }
    if (rawKey === "max-count" || rawKey === "max_count") {
      options.maxCount = parseFrequencyCount(rawValue, options.maxCount);
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
  options.excludeTags = options.excludeTags.filter((tag) => !options.includeTags.includes(tag));
  options.minCount = Math.min(options.minCount, options.maxCount);
  options.maxCount = Math.max(options.minCount, options.maxCount);
  return options;
}
function parseScopeOption(value) {
  const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
  if (normalized === "vault") {
    return "vault";
  }
  if (normalized === "folder" || normalized === "folders") {
    return "folder";
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
  if (normalized === "folder" || normalized === "folders") {
    return "folder";
  }
  return null;
}
function parseTagList2(rawValue) {
  const tags = /* @__PURE__ */ new Set();
  for (const value of parseList2(rawValue)) {
    const normalized = normalizeTag(value);
    if (normalized) {
      tags.add(normalized);
    }
  }
  return [...tags];
}
function parseList2(rawValue) {
  const values = rawValue.split(",").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
  return [...new Set(values)];
}
function parseFrequencyCount(rawValue, fallback) {
  const parsed = Number.parseInt(rawValue.trim(), 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(9999, Math.max(1, parsed));
}
function parseFrontmatterRules2(rawValue) {
  const rules = [];
  const entries = rawValue.split(";").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
  for (const entry of entries) {
    const parts = entry.split("|").map((part) => part.trim());
    const key = parts[0] ?? "";
    if (!key) {
      continue;
    }
    const operator = FRONTMATTER_OPERATORS2.has(parts[1]) ? parts[1] : "equals";
    const value = parts.slice(2).join("|").trim();
    if (operator === "exists" || operator === "not-exists") {
      rules.push({ key, operator });
    } else {
      rules.push({ key, operator, value });
    }
  }
  return rules;
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
    async (embedBlock) => updateEmbeddedCodeBlock(plugin, ctx, hostEl, embedBlock, options.cloudId),
    {
      title: "Edit embedded word cloud",
      description: "Update options for this embedded cloud without editing markdown manually.",
      submitButtonText: "Apply",
      initialState: {
        cloudId: options.cloudId,
        scope: options.scope,
        size: options.size,
        specificFilePath: options.specificFilePath ?? "",
        includeTagsRaw: options.includeTags.join(", "),
        excludeTagsRaw: options.excludeTags.join(", "),
        tagMatchMode: options.tagMatchMode,
        folderPathsRaw: options.folderPaths.join(", "),
        frontmatterRulesRaw: options.frontmatterRules.map((rule) => `${rule.key}|${rule.operator}|${rule.value ?? ""}`).join("; "),
        minCountRaw: `${options.minCount}`,
        maxCountRaw: `${options.maxCount}`
      }
    }
  ).open();
}
async function updateEmbeddedCodeBlock(plugin, ctx, hostEl, embedBlock, cloudId) {
  const sourceFile = resolveCurrentFile(plugin, ctx);
  if (!sourceFile) {
    new import_obsidian2.Notice("Could not locate the source note for this embedded word cloud.");
    return false;
  }
  let updated = false;
  await plugin.app.vault.process(sourceFile, (content) => {
    const byId = cloudId ? replaceWordCloudBlockById(content, cloudId, embedBlock) : null;
    if (byId !== null) {
      updated = true;
      return byId;
    }
    const section = ctx.getSectionInfo(hostEl);
    if (!section) {
      return content;
    }
    updated = true;
    return replaceSectionWithBlock(content, section.lineStart, section.lineEnd, embedBlock);
  });
  if (!updated) {
    new import_obsidian2.Notice("Could not locate the embedded word cloud block to update.");
  }
  return updated;
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
  return updateEmbeddedCodeBlock(plugin, ctx, hostEl, embedBlock, extractCloudIdFromSource(updatedSource));
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
function replaceWordCloudBlockById(content, cloudId, embedBlock) {
  const targetId = cloudId.trim();
  if (!targetId) {
    return null;
  }
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const fence = lines[i]?.trim().toLowerCase();
    if (fence !== "```wordcloud" && fence !== "```word-cloud") {
      continue;
    }
    let end = i + 1;
    while (end < lines.length && lines[end]?.trim() !== "```") {
      end += 1;
    }
    if (end >= lines.length) {
      continue;
    }
    const source = lines.slice(i + 1, end).join("\n");
    const blockId = extractCloudIdFromSource(source);
    if (blockId !== targetId) {
      i = end;
      continue;
    }
    const replacementLines = embedBlock.replace(/\n$/, "").split("\n");
    const before = lines.slice(0, i);
    const after = lines.slice(end + 1);
    return [...before, ...replacementLines, ...after].join("\n");
  }
  return null;
}
function extractCloudIdFromSource(source) {
  const lines = source.split("\n");
  for (const line of lines) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    if (key !== "id" && key !== "cloud-id" && key !== "cloud_id" && key !== "guid") {
      continue;
    }
    return line.slice(separatorIndex + 1).trim();
  }
  return "";
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

// src/wordcloud/ingestion/obsidian-source.ts
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

// src/wordcloud/ingestion/filters/path-filter.ts
function compilePathPredicate(rules) {
  const pathRules = rules.pathRules;
  if (!pathRules) {
    return null;
  }
  const folderPrefixes = (pathRules.folderPrefixes ?? []).map((prefix) => prefix.trim()).filter(Boolean);
  const exactFolders = new Set((pathRules.exactFolders ?? []).map((folder) => folder.trim()).filter(Boolean));
  const subfolderRoots = (pathRules.subfolderRoots ?? []).map((root2) => root2.trim()).filter(Boolean);
  const filenameEquals = new Set((pathRules.filenameEquals ?? []).map((name) => name.trim().toLowerCase()).filter(Boolean));
  const extensionSet = new Set((pathRules.extensions ?? []).map((extension) => extension.trim().replace(/^\./, "").toLowerCase()).filter(Boolean));
  let filenameRegex = null;
  const regexSource = pathRules.filenameRegex?.trim();
  if (regexSource) {
    try {
      filenameRegex = new RegExp(regexSource, "i");
    } catch {
      filenameRegex = null;
    }
  }
  const hasConstraints = folderPrefixes.length > 0 || exactFolders.size > 0 || subfolderRoots.length > 0 || filenameEquals.size > 0 || extensionSet.size > 0 || filenameRegex !== null;
  if (!hasConstraints) {
    return null;
  }
  return (file) => {
    const parentFolder = getParentFolder(file.path);
    if (folderPrefixes.length > 0 && !folderPrefixes.some((prefix) => file.path.startsWith(prefix))) {
      return false;
    }
    if (exactFolders.size > 0 && !exactFolders.has(parentFolder)) {
      return false;
    }
    if (subfolderRoots.length > 0 && !subfolderRoots.some((root2) => isInSubfolder(file.path, root2))) {
      return false;
    }
    if (filenameEquals.size > 0) {
      const normalizedBasename = file.basename.toLowerCase();
      const normalizedName = file.name.toLowerCase();
      if (!filenameEquals.has(normalizedBasename) && !filenameEquals.has(normalizedName)) {
        return false;
      }
    }
    if (filenameRegex && !filenameRegex.test(file.basename)) {
      return false;
    }
    if (extensionSet.size > 0) {
      const extension = file.extension.replace(/^\./, "").toLowerCase();
      if (!extensionSet.has(extension)) {
        return false;
      }
    }
    return true;
  };
}
function getParentFolder(path) {
  const separatorIndex = path.lastIndexOf("/");
  if (separatorIndex < 0) {
    return "";
  }
  return path.slice(0, separatorIndex);
}
function isInSubfolder(path, root2) {
  if (!root2) {
    return false;
  }
  if (!path.startsWith(`${root2}/`)) {
    return false;
  }
  const relativePath = path.slice(root2.length + 1);
  return relativePath.includes("/");
}

// src/wordcloud/ingestion/filters/tag-filter.ts
function compileTagPredicate(app, rules) {
  const includeTags = (rules.includeTags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean);
  const excludeTags = (rules.excludeTags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean);
  const includeTagPrefixes = (rules.includeTagPrefixes ?? []).map((tag) => normalizeTag(tag)).filter(Boolean);
  const excludeTagPrefixes = (rules.excludeTagPrefixes ?? []).map((tag) => normalizeTag(tag)).filter(Boolean);
  if (includeTags.length === 0 && excludeTags.length === 0 && includeTagPrefixes.length === 0 && excludeTagPrefixes.length === 0) {
    return null;
  }
  const includeSet = new Set(includeTags);
  const excludeSet = new Set(excludeTags);
  const tagMatchMode = rules.tagMatchMode ?? "any";
  const tagPrefixMatchMode = rules.tagPrefixMatchMode ?? "any";
  return (file) => {
    const fileTags = getNormalizedFileTags(app, file);
    if (includeSet.size > 0 && !matchesTagSet(fileTags, includeTags, tagMatchMode, false)) {
      return false;
    }
    if (excludeSet.size > 0 && matchesTagSet(fileTags, excludeTags, "any", false)) {
      return false;
    }
    if (includeTagPrefixes.length > 0 && !matchesTagSet(fileTags, includeTagPrefixes, tagPrefixMatchMode, true)) {
      return false;
    }
    if (excludeTagPrefixes.length > 0 && matchesTagSet(fileTags, excludeTagPrefixes, "any", true)) {
      return false;
    }
    return true;
  };
}
function matchesTagSet(fileTags, constraints, mode, usePrefixMatch) {
  if (constraints.length === 0) {
    return true;
  }
  const matchesTag = (constraint) => {
    if (!usePrefixMatch) {
      return fileTags.has(constraint);
    }
    for (const tag of fileTags) {
      if (tag.startsWith(constraint)) {
        return true;
      }
    }
    return false;
  };
  if (mode === "all") {
    return constraints.every(matchesTag);
  }
  return constraints.some(matchesTag);
}
function getNormalizedFileTags(app, file) {
  const cache = app.metadataCache.getFileCache(file);
  if (!cache?.tags) {
    return /* @__PURE__ */ new Set();
  }
  const normalized = cache.tags.map((entry) => normalizeTag(entry.tag)).filter(Boolean);
  return new Set(normalized);
}

// src/wordcloud/ingestion/filters/date-filter.ts
function compileDatePredicate(rules) {
  const hasModifiedRule = hasDateRule(rules.modifiedTime);
  const hasCreatedRule = hasDateRule(rules.createdTime);
  if (!hasModifiedRule && !hasCreatedRule) {
    return null;
  }
  return (file) => {
    if (hasModifiedRule && !matchesDateRule(file.stat.mtime, rules.modifiedTime)) {
      return false;
    }
    if (hasCreatedRule && !matchesDateRule(file.stat.ctime, rules.createdTime)) {
      return false;
    }
    return true;
  };
}
function hasDateRule(rule) {
  if (!rule) {
    return false;
  }
  return Number.isFinite(rule.before) || Number.isFinite(rule.after) || rule.between !== void 0 && Number.isFinite(rule.between.start) && Number.isFinite(rule.between.end);
}
function matchesDateRule(value, rule) {
  if (!rule) {
    return true;
  }
  if (Number.isFinite(rule.before) && !(value < Number(rule.before))) {
    return false;
  }
  if (Number.isFinite(rule.after) && !(value > Number(rule.after))) {
    return false;
  }
  if (rule.between && Number.isFinite(rule.between.start) && Number.isFinite(rule.between.end)) {
    const start = Math.min(rule.between.start, rule.between.end);
    const end = Math.max(rule.between.start, rule.between.end);
    if (value < start || value > end) {
      return false;
    }
  }
  return true;
}

// src/wordcloud/ingestion/filters/frontmatter-filter.ts
function compileFrontmatterPredicate(app, rules) {
  const frontmatterRules = (rules.frontmatterRules ?? []).filter((rule) => rule.key.trim().length > 0);
  if (frontmatterRules.length === 0) {
    return null;
  }
  return (file) => {
    const cache = app.metadataCache.getFileCache(file);
    const frontmatter = cache?.frontmatter && typeof cache.frontmatter === "object" ? cache.frontmatter : {};
    return matchesFrontmatterRules(frontmatter, frontmatterRules);
  };
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
  if (isNullLike(expected)) {
    return isNullLike(actual) ? 0 : 1;
  }
  const numericActual = tryParseNumber(actual);
  const numericExpected = tryParseNumber(expected);
  if (numericActual !== null && numericExpected !== null) {
    return numericActual - numericExpected;
  }
  const dateActual = tryParseDate(actual);
  const dateExpected = tryParseDate(expected);
  if (dateActual !== null && dateExpected !== null) {
    return dateActual - dateExpected;
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
function isNullLike(value) {
  if (value === null || value === void 0) {
    return true;
  }
  if (typeof value !== "string") {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === "null" || normalized === "~" || normalized === "nil";
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
function tryParseDate(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (value instanceof Date) {
    const timestamp = value.getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
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

// src/wordcloud/ingestion/filters/link-filter.ts
function compileOutgoingLinkPredicate(app, rules) {
  const constraints = normalizeLinkRules(rules.outgoingLinks);
  if (!constraints) {
    return null;
  }
  const linkIndex = buildLinkIndex(app);
  const tagCache = /* @__PURE__ */ new Map();
  return (file) => {
    const linkedTargets = linkIndex.targetsBySource.get(file.path) ?? [];
    const totalLinkCount = linkIndex.totalBySource.get(file.path) ?? 0;
    if (!matchesLinkConstraints(app, linkedTargets, totalLinkCount, constraints, tagCache)) {
      return false;
    }
    return true;
  };
}
function compileIncomingLinkPredicate(app, rules) {
  const constraints = normalizeLinkRules(rules.incomingLinks);
  if (!constraints) {
    return null;
  }
  const linkIndex = buildLinkIndex(app);
  const tagCache = /* @__PURE__ */ new Map();
  return (file) => {
    const sourcePaths = linkIndex.sourcesByTarget.get(file.path) ?? [];
    const totalLinkCount = linkIndex.totalByTarget.get(file.path) ?? 0;
    if (!matchesLinkConstraints(app, sourcePaths, totalLinkCount, constraints, tagCache)) {
      return false;
    }
    return true;
  };
}
function normalizeLinkRules(rules) {
  if (!rules) {
    return null;
  }
  const filePaths = new Set((rules.filePaths ?? []).map((path) => path.trim()).filter(Boolean));
  const folderPrefixes = (rules.folderPrefixes ?? []).map((prefix) => prefix.trim()).filter(Boolean);
  const withTags = (rules.withTags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean);
  const minCount = Number.isFinite(rules.minCount) ? Math.max(0, Number(rules.minCount)) : void 0;
  const maxCount = Number.isFinite(rules.maxCount) ? Math.max(0, Number(rules.maxCount)) : void 0;
  const hasConstraints = filePaths.size > 0 || folderPrefixes.length > 0 || minCount !== void 0 || maxCount !== void 0 || withTags.length > 0;
  if (!hasConstraints) {
    return null;
  }
  return {
    filePaths,
    folderPrefixes,
    minCount,
    maxCount,
    withTags,
    tagMatchMode: rules.tagMatchMode === "all" ? "all" : "any"
  };
}
function buildLinkIndex(app) {
  const targetsBySource = /* @__PURE__ */ new Map();
  const totalBySource = /* @__PURE__ */ new Map();
  const sourcesByTarget = /* @__PURE__ */ new Map();
  const totalByTarget = /* @__PURE__ */ new Map();
  const resolvedLinks = app.metadataCache.resolvedLinks ?? {};
  for (const [sourcePath, destinations] of Object.entries(resolvedLinks)) {
    const targetPaths = Object.keys(destinations);
    targetsBySource.set(sourcePath, targetPaths);
    let totalOutgoing = 0;
    for (const [targetPath, count] of Object.entries(destinations)) {
      const safeCount = Number.isFinite(count) ? Math.max(0, count) : 0;
      totalOutgoing += safeCount;
      const currentSources = sourcesByTarget.get(targetPath) ?? [];
      if (!currentSources.includes(sourcePath)) {
        currentSources.push(sourcePath);
        sourcesByTarget.set(targetPath, currentSources);
      }
      totalByTarget.set(targetPath, (totalByTarget.get(targetPath) ?? 0) + safeCount);
    }
    totalBySource.set(sourcePath, totalOutgoing);
  }
  return {
    targetsBySource,
    totalBySource,
    sourcesByTarget,
    totalByTarget
  };
}
function matchesLinkConstraints(app, linkedPaths, totalLinkCount, rules, tagCache) {
  if (rules.minCount !== void 0 && totalLinkCount < rules.minCount) {
    return false;
  }
  if (rules.maxCount !== void 0 && totalLinkCount > rules.maxCount) {
    return false;
  }
  if (rules.filePaths.size > 0 && !linkedPaths.some((path) => rules.filePaths.has(path))) {
    return false;
  }
  if (rules.folderPrefixes.length > 0 && !linkedPaths.some((path) => isPathInFolder(path, rules.folderPrefixes))) {
    return false;
  }
  if (rules.withTags.length > 0 && !linkedPaths.some((path) => linkedFileMatchesTags(app, path, rules, tagCache))) {
    return false;
  }
  return true;
}
function linkedFileMatchesTags(app, path, rules, tagCache) {
  const file = asTFile(app.vault.getAbstractFileByPath(path));
  if (!file) {
    return false;
  }
  let tags = tagCache.get(path);
  if (!tags) {
    tags = new Set(getFileTags(app, file));
    tagCache.set(path, tags);
  }
  if (rules.tagMatchMode === "all") {
    return rules.withTags.every((tag) => tags.has(tag));
  }
  return rules.withTags.some((tag) => tags.has(tag));
}
function isPathInFolder(path, folders) {
  return folders.some((folder) => path === folder || path.startsWith(`${folder}/`));
}
function asTFile(value) {
  if (!value || typeof value !== "object") {
    return null;
  }
  if (!("path" in value) || !("basename" in value) || !("extension" in value) || !("stat" in value)) {
    return null;
  }
  return value;
}

// src/wordcloud/ingestion/metadata-file-filter.ts
function filterSourceFilesByMetadata(app, files, rules) {
  if (!rules) {
    return files;
  }
  const predicates = compilePredicates(app, rules);
  if (predicates.length === 0) {
    return files;
  }
  return files.filter((file) => predicates.every((predicate) => predicate(file)));
}
function compilePredicates(app, rules) {
  const predicates = [];
  const pathPredicate = compilePathPredicate(rules);
  if (pathPredicate) {
    predicates.push(pathPredicate);
  }
  const tagPredicate = compileTagPredicate(app, rules);
  if (tagPredicate) {
    predicates.push(tagPredicate);
  }
  const frontmatterPredicate = compileFrontmatterPredicate(app, rules);
  if (frontmatterPredicate) {
    predicates.push(frontmatterPredicate);
  }
  const datePredicate = compileDatePredicate(rules);
  if (datePredicate) {
    predicates.push(datePredicate);
  }
  const outgoingLinkPredicate = compileOutgoingLinkPredicate(app, rules);
  if (outgoingLinkPredicate) {
    predicates.push(outgoingLinkPredicate);
  }
  const incomingLinkPredicate = compileIncomingLinkPredicate(app, rules);
  if (incomingLinkPredicate) {
    predicates.push(incomingLinkPredicate);
  }
  return predicates;
}

// src/wordcloud/ingestion/tag-catalog.ts
function getAvailableTags(app) {
  const tags = app.metadataCache.getTags();
  return Object.keys(tags).sort((a, b) => a.localeCompare(b));
}

// src/wordcloud/pipeline/word-scaling.ts
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
    score: computeScaleScore(count, index, entries, renderSettings, emphasis)
  })).sort((a, b) => b.count - a.count || a.index - b.index);
  return normalizedEntries.map((entry) => ({
    text: entry.text,
    count: entry.count,
    size: Math.round(minFontSize + entry.score * (maxFontSize - minFontSize))
  }));
}
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

// src/wordcloud/pipeline/strategies/defaults.ts
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
    return mapCountsToWeightedWords(entries, renderSettings);
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

// src/wordcloud/pipeline/stages/06-aggregate-token-counts.ts
function aggregateTokens(tokens, strategy) {
  return strategy.aggregate(tokens);
}

// src/wordcloud/pipeline/stages/07-apply-frequency-thresholds.ts
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

// src/wordcloud/pipeline/stages/05-filter-tokens.ts
function filterTokens(tokens, stopWords, strategy) {
  return tokens.filter((token) => strategy.includeToken(token.value, stopWords));
}

// src/wordcloud/pipeline/stages/03-normalize-documents.ts
function normalizeDocuments(documents) {
  return documents.map((document2) => ({
    id: document2.id,
    path: document2.path,
    basename: document2.basename,
    tags: [...document2.tags],
    text: document2.rawText.replace(FRONTMATTER_PATTERN, "").replace(WORD_CLOUD_BLOCK_PATTERN, "").toLowerCase().normalize("NFKC")
  }));
}

// src/wordcloud/pipeline/stages/09-create-render-model.ts
function createRenderModel(words, aggregateResult, strategy) {
  return strategy.buildModel(words, aggregateResult);
}

// src/wordcloud/pipeline/stages/08-scale-word-weights.ts
function scaleEntries(entries, renderSettings, strategy) {
  return strategy.scale(entries, renderSettings);
}

// src/wordcloud/pipeline/stages/02-filter-by-source-content.ts
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
    if (frontmatterRules.length > 0 && !matchesFrontmatterRules2(document2.frontmatter, frontmatterRules)) {
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
function matchesFrontmatterRules2(frontmatter, rules) {
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
      return containsValue2(actual, expected);
    }
    if (rule.operator === "equals") {
      return compareScalar2(actual, expected) === 0;
    }
    if (rule.operator === "not-equals") {
      return compareScalar2(actual, expected) !== 0;
    }
    if (rule.operator === "gt") {
      return compareScalar2(actual, expected) > 0;
    }
    if (rule.operator === "gte") {
      return compareScalar2(actual, expected) >= 0;
    }
    if (rule.operator === "lt") {
      return compareScalar2(actual, expected) < 0;
    }
    if (rule.operator === "lte") {
      return compareScalar2(actual, expected) <= 0;
    }
    return true;
  });
}
function containsValue2(actual, expected) {
  const normalizedExpected = expected.toLowerCase();
  if (Array.isArray(actual)) {
    return actual.some((entry) => String(entry).toLowerCase().includes(normalizedExpected));
  }
  return String(actual).toLowerCase().includes(normalizedExpected);
}
function compareScalar2(actual, expected) {
  const numericActual = tryParseNumber2(actual);
  const numericExpected = tryParseNumber2(expected);
  if (numericActual !== null && numericExpected !== null) {
    return numericActual - numericExpected;
  }
  const dateActual = tryParseDate2(actual);
  const dateExpected = tryParseDate2(expected);
  if (dateActual !== null && dateExpected !== null) {
    return dateActual - dateExpected;
  }
  const booleanActual = tryParseBoolean2(actual);
  const booleanExpected = tryParseBoolean2(expected);
  if (booleanActual !== null && booleanExpected !== null) {
    if (booleanActual === booleanExpected) {
      return 0;
    }
    return booleanActual ? 1 : -1;
  }
  return String(actual).localeCompare(expected, void 0, { sensitivity: "base", numeric: true });
}
function tryParseNumber2(value) {
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
function tryParseDate2(value) {
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}
function tryParseBoolean2(value) {
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

// src/wordcloud/pipeline/stages/04-tokenize-documents.ts
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

// src/wordcloud/pipeline/run-transform-pipeline.ts
function runTransformPipeline(input, overrides = {}) {
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

// src/wordcloud/application/wordcloud-service.ts
var WordCloudService = class {
  constructor(app) {
    this.app = app;
  }
  getAvailableTags() {
    return getAvailableTags(this.app);
  }
  async collectFromFiles(files, stopWords, renderSettings, onProgress, options) {
    const filesForScan = filterSourceFilesByMetadata(this.app, files, options?.sourceRules);
    const performance = getPerformanceProfile(renderSettings.progressDetail);
    const reportProgress = createThrottledProgress(onProgress, performance.progressThrottleMs);
    const readBatchSize = performance.fullParallelRead ? Math.max(1, filesForScan.length) : Math.max(8, Math.round(renderSettings.scanBatchSize));
    const documents = await readPipelineDocuments(
      this.app,
      filesForScan,
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
    const model = runTransformPipeline({
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
    wordTextMetric: "count",
    showWordTextMetricToggle: false,
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
    const showCountInWordText = new import_obsidian3.Setting(containerEl).setName("Show value in word text").setDesc("Append count or frequency directly to rendered words.").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ showCountInWordText: value });
        this.display();
      });
    });
    this.attachInfoIcon(showCountInWordText, "Shows the selected metric inline (for example, word (12) or word (4.3%)). Improves precision, increases text length.");
    const wordTextMetric = new import_obsidian3.Setting(containerEl).setName("Word value mode").setDesc("Choose whether inline values show count or frequency.").addDropdown((dropdown) => {
      dropdown.addOption("count", "Count").addOption("frequency", "Frequency (%)").setValue(this.plugin.settings.render.wordTextMetric).setDisabled(!this.plugin.settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ wordTextMetric: value });
      });
    });
    this.attachInfoIcon(wordTextMetric, "Count shows raw occurrences. Frequency shows each word as a percent of visible word occurrences.");
    const showWordTextMetricToggle = new import_obsidian3.Setting(containerEl).setName("Show count/frequency toggle button").setDesc("Add a rendered-view button to switch inline labels between count and frequency.").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.render.showWordTextMetricToggle).setDisabled(!this.plugin.settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ showWordTextMetricToggle: value });
      });
    });
    this.attachInfoIcon(showWordTextMetricToggle, "When enabled, each cloud shows a quick toggle in the corner controls.");
    const countLabelFormat = new import_obsidian3.Setting(containerEl).setName("Count label format").setDesc("How inline values are shown when word text values are enabled.").addDropdown((dropdown) => {
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

// src/renderers/word-cloud-renderer.ts
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
function formatWordMetricValue(word, totalCount, metric) {
  if (metric === "frequency") {
    const percent = word.count / Math.max(1, totalCount) * 100;
    return `${percent.toFixed(percent >= 10 ? 1 : 2).replace(/\.?0+$/, "")}%`;
  }
  return String(word.count);
}
function formatWordTitle(word, totalCount) {
  return `${word.text} (${word.count}, ${formatWordMetricValue(word, totalCount, "frequency")})`;
}
function getWordLabel(word, renderSettings, totalCount, metric) {
  if (!renderSettings.showCountInWordText || word.count < renderSettings.countLabelMinCount) {
    return word.text;
  }
  const formattedValue = formatWordMetricValue(word, totalCount, metric);
  if (renderSettings.countLabelFormat === "dot") {
    return `${word.text} \xB7 ${formattedValue}`;
  }
  if (renderSettings.countLabelFormat === "colon") {
    return `${word.text}: ${formattedValue}`;
  }
  return `${word.text} (${formattedValue})`;
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
  const totalWordCount = words.reduce((total, word) => total + word.count, 0);
  let activeWordTextMetric = renderSettings.wordTextMetric;
  const layoutWords = words.map((word) => ({
    ...word,
    baseText: word.text,
    layoutText: getWordLabel(word, renderSettings, totalWordCount, activeWordTextMetric)
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
      const textSelection = g.selectAll("text").data(layoutWords2).enter().append("text").style("font-size", (d) => `${d.size}px`).style("font-family", renderSettings.fontFamily || "sans-serif").style("fill", (_, i) => color2(String(i))).style("cursor", "pointer").attr("tabindex", 0).attr("text-anchor", "middle").attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`).text((d) => d.layoutText).on("click", (_, d) => {
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
      });
      textSelection.append("title").text((d) => formatWordTitle(d, totalWordCount));
      const applyWordTextMetric = (metric) => {
        activeWordTextMetric = metric;
        textSelection.text((d) => getWordLabel(d, renderSettings, totalWordCount, metric));
        textSelection.select("title").text((d) => formatWordTitle(d, totalWordCount));
      };
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
          showEditControl,
          renderSettings.showCountInWordText && renderSettings.showWordTextMetricToggle,
          () => activeWordTextMetric,
          () => {
            applyWordTextMetric(activeWordTextMetric === "count" ? "frequency" : "count");
          }
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
function renderOverlayControls(containerEl, svgEl, exportBaseName, enableExport, onRefresh, onEdit, viewportControls, showRefreshControl, showZoomControls, showEditControl, showWordMetricToggleControl, getCurrentWordMetric, onToggleWordMetric) {
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
  const makeWordMetricToggleButton = (parentEl) => {
    if (!showWordMetricToggleControl) {
      return;
    }
    const metricButton = parentEl.createEl("button", {
      cls: "word-cloud-metric-button"
    });
    metricButton.type = "button";
    const updateMetricButtonText = () => {
      const currentMetric = getCurrentWordMetric();
      const nextMetric = currentMetric === "count" ? "frequency" : "count";
      metricButton.setText(currentMetric === "count" ? "123" : "%");
      metricButton.setAttr("aria-label", `Switch inline labels to ${nextMetric}`);
      metricButton.setAttr("data-tooltip-position", "top");
      metricButton.setAttr("data-tooltip", `Showing ${currentMetric}; click for ${nextMetric}`);
    };
    updateMetricButtonText();
    metricButton.addEventListener("click", () => {
      onToggleWordMetric();
      updateMetricButtonText();
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
      makeWordMetricToggleButton(fallbackControlsEl);
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
  makeWordMetricToggleButton(exportControlsEl);
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

// src/views/sidebar-word-cloud-view.ts
var import_obsidian6 = require("obsidian");

// src/renderers/frequency-chart-renderer.ts
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

// src/components/filter-panel.ts
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

// src/views/sidebar-word-cloud-view.ts
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

// src/views/document-word-cloud-view.ts
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
    this.processor = new WordCloudService(this.app);
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
    const wordTextMetric = raw.wordTextMetric === "count" || raw.wordTextMetric === "frequency" ? raw.wordTextMetric : DEFAULT_SETTINGS.render.wordTextMetric;
    const showWordTextMetricToggle = typeof raw.showWordTextMetricToggle === "boolean" ? raw.showWordTextMetricToggle : DEFAULT_SETTINGS.render.showWordTextMetricToggle;
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
      wordTextMetric,
      showWordTextMetricToggle,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL2QzLWNsb3VkL25vZGVfbW9kdWxlcy9kMy1kaXNwYXRjaC9kaXN0L2QzLWRpc3BhdGNoLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1jbG91ZC9pbmRleC5qcyIsICIuLi9zcmMvbWFpbi50cyIsICIuLi9zcmMvY29uc3RhbnRzLnRzIiwgIi4uL3NyYy9ibG9ja3Mvd29yZGNsb3VkLWJsb2NrLnRzIiwgIi4uL3NyYy9tb2RhbHMvZWRpdC13b3JkLWNsb3VkLW1vZGFsLnRzIiwgIi4uL3NyYy91dGlscy50cyIsICIuLi9zcmMvYWN0aW9ucy9hcHBseS1zZWFyY2gudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9pbmdlc3Rpb24vb2JzaWRpYW4tc291cmNlLnRzIiwgIi4uL3NyYy93b3JkY2xvdWQvaW5nZXN0aW9uL2ZpbHRlcnMvcGF0aC1maWx0ZXIudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9pbmdlc3Rpb24vZmlsdGVycy90YWctZmlsdGVyLnRzIiwgIi4uL3NyYy93b3JkY2xvdWQvaW5nZXN0aW9uL2ZpbHRlcnMvZGF0ZS1maWx0ZXIudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9pbmdlc3Rpb24vZmlsdGVycy9mcm9udG1hdHRlci1maWx0ZXIudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9pbmdlc3Rpb24vZmlsdGVycy9saW5rLWZpbHRlci50cyIsICIuLi9zcmMvd29yZGNsb3VkL2luZ2VzdGlvbi9tZXRhZGF0YS1maWxlLWZpbHRlci50cyIsICIuLi9zcmMvd29yZGNsb3VkL2luZ2VzdGlvbi90YWctY2F0YWxvZy50cyIsICIuLi9zcmMvd29yZGNsb3VkL3BpcGVsaW5lL3dvcmQtc2NhbGluZy50cyIsICIuLi9zcmMvd29yZGNsb3VkL3BpcGVsaW5lL3N0cmF0ZWdpZXMvZGVmYXVsdHMudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9waXBlbGluZS9zdGFnZXMvMDYtYWdncmVnYXRlLXRva2VuLWNvdW50cy50cyIsICIuLi9zcmMvd29yZGNsb3VkL3BpcGVsaW5lL3N0YWdlcy8wNy1hcHBseS1mcmVxdWVuY3ktdGhyZXNob2xkcy50cyIsICIuLi9zcmMvd29yZGNsb3VkL3BpcGVsaW5lL3N0YWdlcy8wNS1maWx0ZXItdG9rZW5zLnRzIiwgIi4uL3NyYy93b3JkY2xvdWQvcGlwZWxpbmUvc3RhZ2VzLzAzLW5vcm1hbGl6ZS1kb2N1bWVudHMudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9waXBlbGluZS9zdGFnZXMvMDktY3JlYXRlLXJlbmRlci1tb2RlbC50cyIsICIuLi9zcmMvd29yZGNsb3VkL3BpcGVsaW5lL3N0YWdlcy8wOC1zY2FsZS13b3JkLXdlaWdodHMudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9waXBlbGluZS9zdGFnZXMvMDItZmlsdGVyLWJ5LXNvdXJjZS1jb250ZW50LnRzIiwgIi4uL3NyYy93b3JkY2xvdWQvcGlwZWxpbmUvc3RhZ2VzLzA0LXRva2VuaXplLWRvY3VtZW50cy50cyIsICIuLi9zcmMvd29yZGNsb3VkL3BpcGVsaW5lL3J1bi10cmFuc2Zvcm0tcGlwZWxpbmUudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9hcHBsaWNhdGlvbi93b3JkY2xvdWQtc2VydmljZS50cyIsICIuLi9zcmMvc2V0dGluZ3MvaW5kZXgudHMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9hc2NlbmRpbmcuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9kZXNjZW5kaW5nLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvYmlzZWN0b3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9udW1iZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9iaXNlY3QuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2ludGVybm1hcC9zcmMvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy90aWNrcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtYXJyYXkvc3JjL3JhbmdlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvaW5pdC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL29yZGluYWwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9iYW5kLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1jb2xvci9zcmMvZGVmaW5lLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1jb2xvci9zcmMvY29sb3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9iYXNpcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2Jhc2lzQ2xvc2VkLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvY29uc3RhbnQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9jb2xvci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3JnYi5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL251bWJlckFycmF5LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvYXJyYXkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9kYXRlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvbnVtYmVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvb2JqZWN0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvc3RyaW5nLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvdmFsdWUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9yb3VuZC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL2NvbnN0YW50LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvbnVtYmVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvY29udGludW91cy5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9mb3JtYXREZWNpbWFsLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL2V4cG9uZW50LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL2Zvcm1hdEdyb3VwLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL2Zvcm1hdE51bWVyYWxzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL2Zvcm1hdFNwZWNpZmllci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9mb3JtYXRUcmltLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL2Zvcm1hdFByZWZpeEF1dG8uanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvZm9ybWF0Um91bmRlZC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9mb3JtYXRUeXBlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9pZGVudGl0eS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9sb2NhbGUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvZGVmYXVsdExvY2FsZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9wcmVjaXNpb25GaXhlZC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9wcmVjaXNpb25QcmVmaXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvcHJlY2lzaW9uUm91bmQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy90aWNrRm9ybWF0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvbGluZWFyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL2NvbG9ycy5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9jYXRlZ29yaWNhbC9UYWJsZWF1MTAuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvbmFtZXNwYWNlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9uYW1lc3BhY2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvY3JlYXRvci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rvci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL2FycmF5LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdG9yQWxsLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3RBbGwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvbWF0Y2hlci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0Q2hpbGQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdENoaWxkcmVuLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9maWx0ZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NwYXJzZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZW50ZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvY29uc3RhbnQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2RhdGEuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2V4aXQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2pvaW4uanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL21lcmdlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9vcmRlci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc29ydC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2FsbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbm9kZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL25vZGUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NpemUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2VtcHR5LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lYWNoLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9hdHRyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3dpbmRvdy5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc3R5bGUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3Byb3BlcnR5LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9jbGFzc2VkLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi90ZXh0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9odG1sLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9yYWlzZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbG93ZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2FwcGVuZC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaW5zZXJ0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9yZW1vdmUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2Nsb25lLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9kYXR1bS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vb24uanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2Rpc3BhdGNoLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9pdGVyYXRvci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0LmpzIiwgIi4uL3NyYy9yZW5kZXJlcnMvd29yZC1jbG91ZC1yZW5kZXJlci50cyIsICIuLi9zcmMvdmlld3Mvc2lkZWJhci13b3JkLWNsb3VkLXZpZXcudHMiLCAiLi4vc3JjL3JlbmRlcmVycy9mcmVxdWVuY3ktY2hhcnQtcmVuZGVyZXIudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvZmlsdGVyLXBhbmVsLnRzIiwgIi4uL3NyYy92aWV3cy9kb2N1bWVudC13b3JkLWNsb3VkLXZpZXcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIGh0dHBzOi8vZDNqcy5vcmcvZDMtZGlzcGF0Y2gvIHYxLjAuNiBDb3B5cmlnaHQgMjAxOSBNaWtlIEJvc3RvY2tcbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG50eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbnR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuKGdsb2JhbCA9IGdsb2JhbCB8fCBzZWxmLCBmYWN0b3J5KGdsb2JhbC5kMyA9IGdsb2JhbC5kMyB8fCB7fSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbnZhciBub29wID0ge3ZhbHVlOiBmdW5jdGlvbigpIHt9fTtcblxuZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gYXJndW1lbnRzLmxlbmd0aCwgXyA9IHt9LCB0OyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKCEodCA9IGFyZ3VtZW50c1tpXSArIFwiXCIpIHx8ICh0IGluIF8pIHx8IC9bXFxzLl0vLnRlc3QodCkpIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgdHlwZTogXCIgKyB0KTtcbiAgICBfW3RdID0gW107XG4gIH1cbiAgcmV0dXJuIG5ldyBEaXNwYXRjaChfKTtcbn1cblxuZnVuY3Rpb24gRGlzcGF0Y2goXykge1xuICB0aGlzLl8gPSBfO1xufVxuXG5mdW5jdGlvbiBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZXMsIHR5cGVzKSB7XG4gIHJldHVybiB0eXBlbmFtZXMudHJpbSgpLnNwbGl0KC9efFxccysvKS5tYXAoZnVuY3Rpb24odCkge1xuICAgIHZhciBuYW1lID0gXCJcIiwgaSA9IHQuaW5kZXhPZihcIi5cIik7XG4gICAgaWYgKGkgPj0gMCkgbmFtZSA9IHQuc2xpY2UoaSArIDEpLCB0ID0gdC5zbGljZSgwLCBpKTtcbiAgICBpZiAodCAmJiAhdHlwZXMuaGFzT3duUHJvcGVydHkodCkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0KTtcbiAgICByZXR1cm4ge3R5cGU6IHQsIG5hbWU6IG5hbWV9O1xuICB9KTtcbn1cblxuRGlzcGF0Y2gucHJvdG90eXBlID0gZGlzcGF0Y2gucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogRGlzcGF0Y2gsXG4gIG9uOiBmdW5jdGlvbih0eXBlbmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgXyA9IHRoaXMuXyxcbiAgICAgICAgVCA9IHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lICsgXCJcIiwgXyksXG4gICAgICAgIHQsXG4gICAgICAgIGkgPSAtMSxcbiAgICAgICAgbiA9IFQubGVuZ3RoO1xuXG4gICAgLy8gSWYgbm8gY2FsbGJhY2sgd2FzIHNwZWNpZmllZCwgcmV0dXJuIHRoZSBjYWxsYmFjayBvZiB0aGUgZ2l2ZW4gdHlwZSBhbmQgbmFtZS5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKHQgPSAodHlwZW5hbWUgPSBUW2ldKS50eXBlKSAmJiAodCA9IGdldChfW3RdLCB0eXBlbmFtZS5uYW1lKSkpIHJldHVybiB0O1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIGEgdHlwZSB3YXMgc3BlY2lmaWVkLCBzZXQgdGhlIGNhbGxiYWNrIGZvciB0aGUgZ2l2ZW4gdHlwZSBhbmQgbmFtZS5cbiAgICAvLyBPdGhlcndpc2UsIGlmIGEgbnVsbCBjYWxsYmFjayB3YXMgc3BlY2lmaWVkLCByZW1vdmUgY2FsbGJhY2tzIG9mIHRoZSBnaXZlbiBuYW1lLlxuICAgIGlmIChjYWxsYmFjayAhPSBudWxsICYmIHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIGNhbGxiYWNrOiBcIiArIGNhbGxiYWNrKTtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgaWYgKHQgPSAodHlwZW5hbWUgPSBUW2ldKS50eXBlKSBfW3RdID0gc2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUsIGNhbGxiYWNrKTtcbiAgICAgIGVsc2UgaWYgKGNhbGxiYWNrID09IG51bGwpIGZvciAodCBpbiBfKSBfW3RdID0gc2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUsIG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBjb3B5OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29weSA9IHt9LCBfID0gdGhpcy5fO1xuICAgIGZvciAodmFyIHQgaW4gXykgY29weVt0XSA9IF9bdF0uc2xpY2UoKTtcbiAgICByZXR1cm4gbmV3IERpc3BhdGNoKGNvcHkpO1xuICB9LFxuICBjYWxsOiBmdW5jdGlvbih0eXBlLCB0aGF0KSB7XG4gICAgaWYgKChuID0gYXJndW1lbnRzLmxlbmd0aCAtIDIpID4gMCkgZm9yICh2YXIgYXJncyA9IG5ldyBBcnJheShuKSwgaSA9IDAsIG4sIHQ7IGkgPCBuOyArK2kpIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIGlmICghdGhpcy5fLmhhc093blByb3BlcnR5KHR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdHlwZSk7XG4gICAgZm9yICh0ID0gdGhpcy5fW3R5cGVdLCBpID0gMCwgbiA9IHQubGVuZ3RoOyBpIDwgbjsgKytpKSB0W2ldLnZhbHVlLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICB9LFxuICBhcHBseTogZnVuY3Rpb24odHlwZSwgdGhhdCwgYXJncykge1xuICAgIGlmICghdGhpcy5fLmhhc093blByb3BlcnR5KHR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdHlwZSk7XG4gICAgZm9yICh2YXIgdCA9IHRoaXMuX1t0eXBlXSwgaSA9IDAsIG4gPSB0Lmxlbmd0aDsgaSA8IG47ICsraSkgdFtpXS52YWx1ZS5hcHBseSh0aGF0LCBhcmdzKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0KHR5cGUsIG5hbWUpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0eXBlLmxlbmd0aCwgYzsgaSA8IG47ICsraSkge1xuICAgIGlmICgoYyA9IHR5cGVbaV0pLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIHJldHVybiBjLnZhbHVlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXQodHlwZSwgbmFtZSwgY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0eXBlLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIGlmICh0eXBlW2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIHR5cGVbaV0gPSBub29wLCB0eXBlID0gdHlwZS5zbGljZSgwLCBpKS5jb25jYXQodHlwZS5zbGljZShpICsgMSkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmIChjYWxsYmFjayAhPSBudWxsKSB0eXBlLnB1c2goe25hbWU6IG5hbWUsIHZhbHVlOiBjYWxsYmFja30pO1xuICByZXR1cm4gdHlwZTtcbn1cblxuZXhwb3J0cy5kaXNwYXRjaCA9IGRpc3BhdGNoO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSk7XG4iLCAiLy8gV29yZCBjbG91ZCBsYXlvdXQgYnkgSmFzb24gRGF2aWVzLCBodHRwczovL3d3dy5qYXNvbmRhdmllcy5jb20vd29yZGNsb3VkL1xuLy8gQWxnb3JpdGhtIGR1ZSB0byBKb25hdGhhbiBGZWluYmVyZywgaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL3N0YXRpYy5tcmZlaW5iZXJnLmNvbS9idl9jaDAzLnBkZlxuXG5jb25zdCBkaXNwYXRjaCA9IHJlcXVpcmUoXCJkMy1kaXNwYXRjaFwiKS5kaXNwYXRjaDtcblxuY29uc3QgUkFESUFOUyA9IE1hdGguUEkgLyAxODA7XG5cbmNvbnN0IFNQSVJBTFMgPSB7XG4gIGFyY2hpbWVkZWFuOiBhcmNoaW1lZGVhblNwaXJhbCxcbiAgcmVjdGFuZ3VsYXI6IHJlY3Rhbmd1bGFyU3BpcmFsXG59O1xuXG5jb25zdCBjdyA9IDEgPDwgMTEgPj4gNTtcbmNvbnN0IGNoID0gMSA8PCAxMTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNpemUgPSBbMjU2LCAyNTZdLFxuICAgICAgdGV4dCA9IGNsb3VkVGV4dCxcbiAgICAgIGZvbnQgPSBjbG91ZEZvbnQsXG4gICAgICBmb250U2l6ZSA9IGNsb3VkRm9udFNpemUsXG4gICAgICBmb250U3R5bGUgPSBjbG91ZEZvbnROb3JtYWwsXG4gICAgICBmb250V2VpZ2h0ID0gY2xvdWRGb250Tm9ybWFsLFxuICAgICAgcGFkZGluZyA9IGNsb3VkUGFkZGluZyxcbiAgICAgIHNwaXJhbCA9IGFyY2hpbWVkZWFuU3BpcmFsLFxuICAgICAgd29yZHMgPSBbXSxcbiAgICAgIHRpbWVJbnRlcnZhbCA9IEluZmluaXR5LFxuICAgICAgZXZlbnQgPSBkaXNwYXRjaChcIndvcmRcIiwgXCJlbmRcIiksXG4gICAgICB0aW1lciA9IG51bGwsXG4gICAgICByYW5kb20gPSBNYXRoLnJhbmRvbSxcbiAgICAgIHJvdGF0ZSA9ICgpID0+ICh+fihyYW5kb20oKSAqIDYpIC0gMykgKiAzMCxcbiAgICAgIGNsb3VkID0ge30sXG4gICAgICBjYW52YXMgPSBjbG91ZENhbnZhcztcblxuICBjbG91ZC5jYW52YXMgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2FudmFzID0gZnVuY3RvcihfKSwgY2xvdWQpIDogY2FudmFzO1xuICB9O1xuXG4gIGNsb3VkLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRleHRBbmRSYXRpbyA9IGdldENvbnRleHQoY2FudmFzKCkpLFxuICAgICAgICBib2FyZCA9IHplcm9BcnJheSgoc2l6ZVswXSA+PiA1KSAqIHNpemVbMV0pLFxuICAgICAgICBib3VuZHMgPSBudWxsLFxuICAgICAgICBuID0gd29yZHMubGVuZ3RoLFxuICAgICAgICBpID0gLTEsXG4gICAgICAgIHRhZ3MgPSBbXSxcbiAgICAgICAgZGF0YSA9IHdvcmRzLm1hcChmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgZC50ZXh0ID0gdGV4dC5jYWxsKHRoaXMsIGQsIGkpO1xuICAgICAgICAgIGQuZm9udCA9IGZvbnQuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgICBkLnN0eWxlID0gZm9udFN0eWxlLmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgZC53ZWlnaHQgPSBmb250V2VpZ2h0LmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgZC5yb3RhdGUgPSByb3RhdGUuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgICBkLnNpemUgPSB+fmZvbnRTaXplLmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgZC5wYWRkaW5nID0gcGFkZGluZy5jYWxsKHRoaXMsIGQsIGkpO1xuICAgICAgICAgIHJldHVybiBkO1xuICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGIuc2l6ZSAtIGEuc2l6ZTsgfSk7XG5cbiAgICBpZiAodGltZXIpIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwoc3RlcCwgMCk7XG4gICAgc3RlcCgpO1xuXG4gICAgcmV0dXJuIGNsb3VkO1xuXG4gICAgZnVuY3Rpb24gc3RlcCgpIHtcbiAgICAgIHZhciBzdGFydCA9IERhdGUubm93KCk7XG4gICAgICB3aGlsZSAoRGF0ZS5ub3coKSAtIHN0YXJ0IDwgdGltZUludGVydmFsICYmICsraSA8IG4gJiYgdGltZXIpIHtcbiAgICAgICAgdmFyIGQgPSBkYXRhW2ldO1xuICAgICAgICBkLnggPSAoc2l6ZVswXSAqIChyYW5kb20oKSArIC41KSkgPj4gMTtcbiAgICAgICAgZC55ID0gKHNpemVbMV0gKiAocmFuZG9tKCkgKyAuNSkpID4+IDE7XG4gICAgICAgIGNsb3VkU3ByaXRlKGNvbnRleHRBbmRSYXRpbywgZCwgZGF0YSwgaSk7XG4gICAgICAgIGlmIChkLmhhc1RleHQgJiYgcGxhY2UoYm9hcmQsIGQsIGJvdW5kcykpIHtcbiAgICAgICAgICB0YWdzLnB1c2goZCk7XG4gICAgICAgICAgZXZlbnQuY2FsbChcIndvcmRcIiwgY2xvdWQsIGQpO1xuICAgICAgICAgIGlmIChib3VuZHMpIGNsb3VkQm91bmRzKGJvdW5kcywgZCk7XG4gICAgICAgICAgZWxzZSBib3VuZHMgPSBbe3g6IGQueCArIGQueDAsIHk6IGQueSArIGQueTB9LCB7eDogZC54ICsgZC54MSwgeTogZC55ICsgZC55MX1dO1xuICAgICAgICAgIC8vIFRlbXBvcmFyeSBoYWNrXG4gICAgICAgICAgZC54IC09IHNpemVbMF0gPj4gMTtcbiAgICAgICAgICBkLnkgLT0gc2l6ZVsxXSA+PiAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaSA+PSBuKSB7XG4gICAgICAgIGNsb3VkLnN0b3AoKTtcbiAgICAgICAgZXZlbnQuY2FsbChcImVuZFwiLCBjbG91ZCwgdGFncywgYm91bmRzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG91ZC5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgIHRpbWVyID0gbnVsbDtcbiAgICB9XG4gICAgZm9yIChjb25zdCBkIG9mIHdvcmRzKSB7XG4gICAgICBkZWxldGUgZC5zcHJpdGU7XG4gICAgfVxuICAgIHJldHVybiBjbG91ZDtcbiAgfTtcblxuICBmdW5jdGlvbiBnZXRDb250ZXh0KGNhbnZhcykge1xuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIsIHt3aWxsUmVhZEZyZXF1ZW50bHk6IHRydWV9KTtcblxuICAgIGNhbnZhcy53aWR0aCA9IGNhbnZhcy5oZWlnaHQgPSAxO1xuICAgIGNvbnN0IHJhdGlvID0gTWF0aC5zcXJ0KGNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIDEsIDEpLmRhdGEubGVuZ3RoID4+IDIpO1xuICAgIGNhbnZhcy53aWR0aCA9IChjdyA8PCA1KSAvIHJhdGlvO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBjaCAvIHJhdGlvO1xuXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBjb250ZXh0LnN0cm9rZVN0eWxlID0gXCJyZWRcIjtcblxuICAgIHJldHVybiB7Y29udGV4dCwgcmF0aW99O1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2UoYm9hcmQsIHRhZywgYm91bmRzKSB7XG4gICAgdmFyIHBlcmltZXRlciA9IFt7eDogMCwgeTogMH0sIHt4OiBzaXplWzBdLCB5OiBzaXplWzFdfV0sXG4gICAgICAgIHN0YXJ0WCA9IHRhZy54LFxuICAgICAgICBzdGFydFkgPSB0YWcueSxcbiAgICAgICAgbWF4RGVsdGEgPSBNYXRoLnNxcnQoc2l6ZVswXSAqIHNpemVbMF0gKyBzaXplWzFdICogc2l6ZVsxXSksXG4gICAgICAgIHMgPSBzcGlyYWwoc2l6ZSksXG4gICAgICAgIGR0ID0gcmFuZG9tKCkgPCAuNSA/IDEgOiAtMSxcbiAgICAgICAgdCA9IC1kdCxcbiAgICAgICAgZHhkeSxcbiAgICAgICAgZHgsXG4gICAgICAgIGR5O1xuXG4gICAgd2hpbGUgKGR4ZHkgPSBzKHQgKz0gZHQpKSB7XG4gICAgICBkeCA9IH5+ZHhkeVswXTtcbiAgICAgIGR5ID0gfn5keGR5WzFdO1xuXG4gICAgICBpZiAoTWF0aC5taW4oTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpID49IG1heERlbHRhKSBicmVhaztcblxuICAgICAgdGFnLnggPSBzdGFydFggKyBkeDtcbiAgICAgIHRhZy55ID0gc3RhcnRZICsgZHk7XG5cbiAgICAgIGlmICh0YWcueCArIHRhZy54MCA8IDAgfHwgdGFnLnkgKyB0YWcueTAgPCAwIHx8XG4gICAgICAgICAgdGFnLnggKyB0YWcueDEgPiBzaXplWzBdIHx8IHRhZy55ICsgdGFnLnkxID4gc2l6ZVsxXSkgY29udGludWU7XG4gICAgICAvLyBUT0RPIG9ubHkgY2hlY2sgZm9yIGNvbGxpc2lvbnMgd2l0aGluIGN1cnJlbnQgYm91bmRzLlxuICAgICAgaWYgKCFib3VuZHMgfHwgY29sbGlkZVJlY3RzKHRhZywgYm91bmRzKSkge1xuICAgICAgICBpZiAoIWNsb3VkQ29sbGlkZSh0YWcsIGJvYXJkLCBzaXplWzBdKSkge1xuICAgICAgICAgIHZhciBzcHJpdGUgPSB0YWcuc3ByaXRlLFxuICAgICAgICAgICAgICB3ID0gdGFnLndpZHRoID4+IDUsXG4gICAgICAgICAgICAgIHN3ID0gc2l6ZVswXSA+PiA1LFxuICAgICAgICAgICAgICBseCA9IHRhZy54IC0gKHcgPDwgNCksXG4gICAgICAgICAgICAgIHN4ID0gbHggJiAweDdmLFxuICAgICAgICAgICAgICBtc3ggPSAzMiAtIHN4LFxuICAgICAgICAgICAgICBoID0gdGFnLnkxIC0gdGFnLnkwLFxuICAgICAgICAgICAgICB4ID0gKHRhZy55ICsgdGFnLnkwKSAqIHN3ICsgKGx4ID4+IDUpLFxuICAgICAgICAgICAgICBsYXN0O1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaDsgaisrKSB7XG4gICAgICAgICAgICBsYXN0ID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHc7IGkrKykge1xuICAgICAgICAgICAgICBib2FyZFt4ICsgaV0gfD0gKGxhc3QgPDwgbXN4KSB8IChpIDwgdyA/IChsYXN0ID0gc3ByaXRlW2ogKiB3ICsgaV0pID4+PiBzeCA6IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeCArPSBzdztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY2xvdWQudGltZUludGVydmFsID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRpbWVJbnRlcnZhbCA9IF8gPT0gbnVsbCA/IEluZmluaXR5IDogXywgY2xvdWQpIDogdGltZUludGVydmFsO1xuICB9O1xuXG4gIGNsb3VkLndvcmRzID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHdvcmRzID0gXywgY2xvdWQpIDogd29yZHM7XG4gIH07XG5cbiAgY2xvdWQuc2l6ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzaXplID0gWytfWzBdLCArX1sxXV0sIGNsb3VkKSA6IHNpemU7XG4gIH07XG5cbiAgY2xvdWQuZm9udCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmb250ID0gZnVuY3RvcihfKSwgY2xvdWQpIDogZm9udDtcbiAgfTtcblxuICBjbG91ZC5mb250U3R5bGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZm9udFN0eWxlID0gZnVuY3RvcihfKSwgY2xvdWQpIDogZm9udFN0eWxlO1xuICB9O1xuXG4gIGNsb3VkLmZvbnRXZWlnaHQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZm9udFdlaWdodCA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IGZvbnRXZWlnaHQ7XG4gIH07XG5cbiAgY2xvdWQucm90YXRlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJvdGF0ZSA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IHJvdGF0ZTtcbiAgfTtcblxuICBjbG91ZC50ZXh0ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRleHQgPSBmdW5jdG9yKF8pLCBjbG91ZCkgOiB0ZXh0O1xuICB9O1xuXG4gIGNsb3VkLnNwaXJhbCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzcGlyYWwgPSBTUElSQUxTW19dIHx8IF8sIGNsb3VkKSA6IHNwaXJhbDtcbiAgfTtcblxuICBjbG91ZC5mb250U2l6ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmb250U2l6ZSA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IGZvbnRTaXplO1xuICB9O1xuXG4gIGNsb3VkLnBhZGRpbmcgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocGFkZGluZyA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IHBhZGRpbmc7XG4gIH07XG5cbiAgY2xvdWQucmFuZG9tID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJhbmRvbSA9IF8sIGNsb3VkKSA6IHJhbmRvbTtcbiAgfTtcblxuICBjbG91ZC5vbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZSA9IGV2ZW50Lm9uLmFwcGx5KGV2ZW50LCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gZXZlbnQgPyBjbG91ZCA6IHZhbHVlO1xuICB9O1xuXG4gIHJldHVybiBjbG91ZDtcbn07XG5cbmZ1bmN0aW9uIGNsb3VkVGV4dChkKSB7XG4gIHJldHVybiBkLnRleHQ7XG59XG5cbmZ1bmN0aW9uIGNsb3VkRm9udCgpIHtcbiAgcmV0dXJuIFwic2VyaWZcIjtcbn1cblxuZnVuY3Rpb24gY2xvdWRGb250Tm9ybWFsKCkge1xuICByZXR1cm4gXCJub3JtYWxcIjtcbn1cblxuZnVuY3Rpb24gY2xvdWRGb250U2l6ZShkKSB7XG4gIHJldHVybiBNYXRoLnNxcnQoZC52YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGNsb3VkUGFkZGluZygpIHtcbiAgcmV0dXJuIDE7XG59XG5cbi8vIEZldGNoZXMgYSBtb25vY2hyb21lIHNwcml0ZSBiaXRtYXAgZm9yIHRoZSBzcGVjaWZpZWQgdGV4dC5cbi8vIExvYWQgaW4gYmF0Y2hlcyBmb3Igc3BlZWQuXG5mdW5jdGlvbiBjbG91ZFNwcml0ZShjb250ZXh0QW5kUmF0aW8sIGQsIGRhdGEsIGRpKSB7XG4gIGlmIChkLnNwcml0ZSkgcmV0dXJuO1xuICB2YXIgYyA9IGNvbnRleHRBbmRSYXRpby5jb250ZXh0LFxuICAgICAgcmF0aW8gPSBjb250ZXh0QW5kUmF0aW8ucmF0aW87XG5cbiAgYy5jbGVhclJlY3QoMCwgMCwgKGN3IDw8IDUpIC8gcmF0aW8sIGNoIC8gcmF0aW8pO1xuICB2YXIgeCA9IDAsXG4gICAgICB5ID0gMCxcbiAgICAgIG1heGggPSAwLFxuICAgICAgbiA9IGRhdGEubGVuZ3RoO1xuICAtLWRpO1xuICB3aGlsZSAoKytkaSA8IG4pIHtcbiAgICBkID0gZGF0YVtkaV07XG4gICAgYy5zYXZlKCk7XG4gICAgYy5mb250ID0gZC5zdHlsZSArIFwiIFwiICsgZC53ZWlnaHQgKyBcIiBcIiArIH5+KChkLnNpemUgKyAxKSAvIHJhdGlvKSArIFwicHggXCIgKyBkLmZvbnQ7XG4gICAgY29uc3QgbWV0cmljcyA9IGMubWVhc3VyZVRleHQoZC50ZXh0KTtcbiAgICBjb25zdCBhbmNob3IgPSAtTWF0aC5mbG9vcihtZXRyaWNzLndpZHRoIC8gMik7XG4gICAgbGV0IHcgPSAobWV0cmljcy53aWR0aCArIDEpICogcmF0aW87XG4gICAgbGV0IGggPSBkLnNpemUgPDwgMTtcbiAgICBpZiAoZC5yb3RhdGUpIHtcbiAgICAgIHZhciBzciA9IE1hdGguc2luKGQucm90YXRlICogUkFESUFOUyksXG4gICAgICAgICAgY3IgPSBNYXRoLmNvcyhkLnJvdGF0ZSAqIFJBRElBTlMpLFxuICAgICAgICAgIHdjciA9IHcgKiBjcixcbiAgICAgICAgICB3c3IgPSB3ICogc3IsXG4gICAgICAgICAgaGNyID0gaCAqIGNyLFxuICAgICAgICAgIGhzciA9IGggKiBzcjtcbiAgICAgIHcgPSAoTWF0aC5tYXgoTWF0aC5hYnMod2NyICsgaHNyKSwgTWF0aC5hYnMod2NyIC0gaHNyKSkgKyAweDFmKSA+PiA1IDw8IDU7XG4gICAgICBoID0gfn5NYXRoLm1heChNYXRoLmFicyh3c3IgKyBoY3IpLCBNYXRoLmFicyh3c3IgLSBoY3IpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdyA9ICh3ICsgMHgxZikgPj4gNSA8PCA1O1xuICAgIH1cbiAgICBpZiAoaCA+IG1heGgpIG1heGggPSBoO1xuICAgIGlmICh4ICsgdyA+PSAoY3cgPDwgNSkpIHtcbiAgICAgIHggPSAwO1xuICAgICAgeSArPSBtYXhoO1xuICAgICAgbWF4aCA9IDA7XG4gICAgfVxuICAgIGlmICh5ICsgaCA+PSBjaCkgYnJlYWs7XG4gICAgYy50cmFuc2xhdGUoKHggKyAodyA+PiAxKSkgLyByYXRpbywgKHkgKyAoaCA+PiAxKSkgLyByYXRpbyk7XG4gICAgaWYgKGQucm90YXRlKSBjLnJvdGF0ZShkLnJvdGF0ZSAqIFJBRElBTlMpO1xuICAgIGMuZmlsbFRleHQoZC50ZXh0LCBhbmNob3IsIDApO1xuICAgIGlmIChkLnBhZGRpbmcpIGMubGluZVdpZHRoID0gMiAqIGQucGFkZGluZywgYy5zdHJva2VUZXh0KGQudGV4dCwgYW5jaG9yLCAwKTtcbiAgICBjLnJlc3RvcmUoKTtcbiAgICBkLndpZHRoID0gdztcbiAgICBkLmhlaWdodCA9IGg7XG4gICAgZC54b2ZmID0geDtcbiAgICBkLnlvZmYgPSB5O1xuICAgIGQueDEgPSB3ID4+IDE7XG4gICAgZC55MSA9IGggPj4gMTtcbiAgICBkLngwID0gLWQueDE7XG4gICAgZC55MCA9IC1kLnkxO1xuICAgIGQuaGFzVGV4dCA9IHRydWU7XG4gICAgeCArPSB3O1xuICB9XG4gIHZhciBwaXhlbHMgPSBjLmdldEltYWdlRGF0YSgwLCAwLCAoY3cgPDwgNSkgLyByYXRpbywgY2ggLyByYXRpbykuZGF0YSxcbiAgICAgIHNwcml0ZSA9IFtdO1xuICB3aGlsZSAoLS1kaSA+PSAwKSB7XG4gICAgZCA9IGRhdGFbZGldO1xuICAgIGlmICghZC5oYXNUZXh0KSBjb250aW51ZTtcbiAgICB2YXIgdyA9IGQud2lkdGgsXG4gICAgICAgIHczMiA9IHcgPj4gNSxcbiAgICAgICAgaCA9IGQueTEgLSBkLnkwO1xuICAgIC8vIFplcm8gdGhlIGJ1ZmZlclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaCAqIHczMjsgaSsrKSBzcHJpdGVbaV0gPSAwO1xuICAgIHggPSBkLnhvZmY7XG4gICAgaWYgKHggPT0gbnVsbCkgcmV0dXJuO1xuICAgIHkgPSBkLnlvZmY7XG4gICAgdmFyIHNlZW4gPSAwLFxuICAgICAgICBzZWVuUm93ID0gLTE7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBoOyBqKyspIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdzsgaSsrKSB7XG4gICAgICAgIHZhciBrID0gdzMyICogaiArIChpID4+IDUpLFxuICAgICAgICAgICAgbSA9IHBpeGVsc1soKHkgKyBqKSAqIChjdyA8PCA1KSArICh4ICsgaSkpIDw8IDJdID8gMSA8PCAoMzEgLSAoaSAlIDMyKSkgOiAwO1xuICAgICAgICBzcHJpdGVba10gfD0gbTtcbiAgICAgICAgc2VlbiB8PSBtO1xuICAgICAgfVxuICAgICAgaWYgKHNlZW4pIHNlZW5Sb3cgPSBqO1xuICAgICAgZWxzZSB7XG4gICAgICAgIGQueTArKztcbiAgICAgICAgaC0tO1xuICAgICAgICBqLS07XG4gICAgICAgIHkrKztcbiAgICAgIH1cbiAgICB9XG4gICAgZC55MSA9IGQueTAgKyBzZWVuUm93O1xuICAgIGQuc3ByaXRlID0gc3ByaXRlLnNsaWNlKDAsIChkLnkxIC0gZC55MCkgKiB3MzIpO1xuICB9XG59XG5cbi8vIFVzZSBtYXNrLWJhc2VkIGNvbGxpc2lvbiBkZXRlY3Rpb24uXG5mdW5jdGlvbiBjbG91ZENvbGxpZGUodGFnLCBib2FyZCwgc3cpIHtcbiAgc3cgPj49IDU7XG4gIHZhciBzcHJpdGUgPSB0YWcuc3ByaXRlLFxuICAgICAgdyA9IHRhZy53aWR0aCA+PiA1LFxuICAgICAgbHggPSB0YWcueCAtICh3IDw8IDQpLFxuICAgICAgc3ggPSBseCAmIDB4N2YsXG4gICAgICBtc3ggPSAzMiAtIHN4LFxuICAgICAgaCA9IHRhZy55MSAtIHRhZy55MCxcbiAgICAgIHggPSAodGFnLnkgKyB0YWcueTApICogc3cgKyAobHggPj4gNSksXG4gICAgICBsYXN0O1xuICBmb3IgKHZhciBqID0gMDsgaiA8IGg7IGorKykge1xuICAgIGxhc3QgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHc7IGkrKykge1xuICAgICAgaWYgKCgobGFzdCA8PCBtc3gpIHwgKGkgPCB3ID8gKGxhc3QgPSBzcHJpdGVbaiAqIHcgKyBpXSkgPj4+IHN4IDogMCkpXG4gICAgICAgICAgJiBib2FyZFt4ICsgaV0pIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB4ICs9IHN3O1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY2xvdWRCb3VuZHMoYm91bmRzLCBkKSB7XG4gIHZhciBiMCA9IGJvdW5kc1swXSxcbiAgICAgIGIxID0gYm91bmRzWzFdO1xuICBpZiAoZC54ICsgZC54MCA8IGIwLngpIGIwLnggPSBkLnggKyBkLngwO1xuICBpZiAoZC55ICsgZC55MCA8IGIwLnkpIGIwLnkgPSBkLnkgKyBkLnkwO1xuICBpZiAoZC54ICsgZC54MSA+IGIxLngpIGIxLnggPSBkLnggKyBkLngxO1xuICBpZiAoZC55ICsgZC55MSA+IGIxLnkpIGIxLnkgPSBkLnkgKyBkLnkxO1xufVxuXG5mdW5jdGlvbiBjb2xsaWRlUmVjdHMoYSwgYikge1xuICByZXR1cm4gYS54ICsgYS54MSA+IGJbMF0ueCAmJiBhLnggKyBhLngwIDwgYlsxXS54ICYmIGEueSArIGEueTEgPiBiWzBdLnkgJiYgYS55ICsgYS55MCA8IGJbMV0ueTtcbn1cblxuZnVuY3Rpb24gYXJjaGltZWRlYW5TcGlyYWwoc2l6ZSkge1xuICB2YXIgZSA9IHNpemVbMF0gLyBzaXplWzFdO1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBbZSAqICh0ICo9IC4xKSAqIE1hdGguY29zKHQpLCB0ICogTWF0aC5zaW4odCldO1xuICB9O1xufVxuXG5mdW5jdGlvbiByZWN0YW5ndWxhclNwaXJhbChzaXplKSB7XG4gIHZhciBkeSA9IDQsXG4gICAgICBkeCA9IGR5ICogc2l6ZVswXSAvIHNpemVbMV0sXG4gICAgICB4ID0gMCxcbiAgICAgIHkgPSAwO1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHZhciBzaWduID0gdCA8IDAgPyAtMSA6IDE7XG4gICAgLy8gU2VlIHRyaWFuZ3VsYXIgbnVtYmVyczogVF9uID0gbiAqIChuICsgMSkgLyAyLlxuICAgIHN3aXRjaCAoKE1hdGguc3FydCgxICsgNCAqIHNpZ24gKiB0KSAtIHNpZ24pICYgMykge1xuICAgICAgY2FzZSAwOiAgeCArPSBkeDsgYnJlYWs7XG4gICAgICBjYXNlIDE6ICB5ICs9IGR5OyBicmVhaztcbiAgICAgIGNhc2UgMjogIHggLT0gZHg7IGJyZWFrO1xuICAgICAgZGVmYXVsdDogeSAtPSBkeTsgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBbeCwgeV07XG4gIH07XG59XG5cbi8vIFRPRE8gcmV1c2UgYXJyYXlzP1xuZnVuY3Rpb24gemVyb0FycmF5KG4pIHtcbiAgdmFyIGEgPSBbXSxcbiAgICAgIGkgPSAtMTtcbiAgd2hpbGUgKCsraSA8IG4pIGFbaV0gPSAwO1xuICByZXR1cm4gYTtcbn1cblxuZnVuY3Rpb24gY2xvdWRDYW52YXMoKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xufVxuXG5mdW5jdGlvbiBmdW5jdG9yKGQpIHtcbiAgcmV0dXJuIHR5cGVvZiBkID09PSBcImZ1bmN0aW9uXCIgPyBkIDogZnVuY3Rpb24oKSB7IHJldHVybiBkOyB9O1xufVxuIiwgImltcG9ydCB7IE1hcmtkb3duVmlldywgTm90aWNlLCBQbHVnaW4sIFRGaWxlLCBURm9sZGVyIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgVklFV19UWVBFX05PVEVfV09SRF9DTE9VRCwgVklFV19UWVBFX1ZBVUxUX1dPUkRfQ0xPVUQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyByZWdpc3RlckVtYmVkZGVkV29yZENsb3VkUHJvY2Vzc29yIH0gZnJvbSAnLi9ibG9ja3Mvd29yZGNsb3VkLWJsb2NrJztcbmltcG9ydCB7IG9wZW5TZWFyY2hGb3JXb3JkIH0gZnJvbSAnLi9hY3Rpb25zL2FwcGx5LXNlYXJjaCc7XG5pbXBvcnQgeyBXb3JkQ2xvdWRTZXJ2aWNlIH0gZnJvbSAnLi93b3JkY2xvdWQvYXBwbGljYXRpb24vd29yZGNsb3VkLXNlcnZpY2UnO1xuaW1wb3J0IHsgREVGQVVMVF9TRVRUSU5HUywgVmF1bHRXb3JkQ2xvdWRTZXR0aW5nVGFiLCB0eXBlIFdvcmRDbG91ZFNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncyc7XG5pbXBvcnQgdHlwZSB7XG4gIFJlbmRlclNldHRpbmdzLFxuICBTZWFyY2hPcHRpb25zLFxuICBUYWdNYXRjaE1vZGUsXG4gIFZhdWx0Q29sbGVjdGlvbk9wdGlvbnMsXG4gIFdvcmRDbG91ZEZpbHRlclNldHRpbmdzLFxuICBXb3JkQ2xvdWRSZW5kZXJPcHRpb25zLFxuICBXb3JkQ2xvdWRTZXJ2aWNlcyxcbiAgV2VpZ2h0ZWRXb3JkLFxufSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IGRyYXdXb3JkQ2xvdWQgfSBmcm9tICcuL3JlbmRlcmVycy93b3JkLWNsb3VkLXJlbmRlcmVyJztcbmltcG9ydCB7IE5vdGVXb3JkQ2xvdWRWaWV3IH0gZnJvbSAnLi92aWV3cy9zaWRlYmFyLXdvcmQtY2xvdWQtdmlldyc7XG5pbXBvcnQgeyBWYXVsdFdvcmRDbG91ZFZpZXcgfSBmcm9tICcuL3ZpZXdzL2RvY3VtZW50LXdvcmQtY2xvdWQtdmlldyc7XG5pbXBvcnQgeyBFbWJlZFdvcmRDbG91ZE1vZGFsIH0gZnJvbSAnLi9tb2RhbHMvZWRpdC13b3JkLWNsb3VkLW1vZGFsJztcbmltcG9ydCB0eXBlIHsgRnJvbnRtYXR0ZXJSdWxlLCBTb3VyY2VTY29wZSB9IGZyb20gJy4vd29yZGNsb3VkL3BpcGVsaW5lL3R5cGVzJztcbmltcG9ydCB7IG5vcm1hbGl6ZVRhZyB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWYXVsdFdvcmRDbG91ZFBsdWdpbiBleHRlbmRzIFBsdWdpbiBpbXBsZW1lbnRzIFdvcmRDbG91ZFNlcnZpY2VzIHtcbiAgc2V0dGluZ3M6IFdvcmRDbG91ZFNldHRpbmdzID0geyAuLi5ERUZBVUxUX1NFVFRJTkdTIH07XG4gIHByaXZhdGUgcHJvY2Vzc29yITogV29yZENsb3VkU2VydmljZTtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLnByb2Nlc3NvciA9IG5ldyBXb3JkQ2xvdWRTZXJ2aWNlKHRoaXMuYXBwKTtcblxuICAgIHRoaXMucmVnaXN0ZXJWaWV3KFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VELCAobGVhZikgPT4gbmV3IFZhdWx0V29yZENsb3VkVmlldyhsZWFmLCB0aGlzKSk7XG4gICAgdGhpcy5yZWdpc3RlclZpZXcoVklFV19UWVBFX05PVEVfV09SRF9DTE9VRCwgKGxlYWYpID0+IG5ldyBOb3RlV29yZENsb3VkVmlldyhsZWFmLCB0aGlzKSk7XG4gICAgcmVnaXN0ZXJFbWJlZGRlZFdvcmRDbG91ZFByb2Nlc3Nvcih0aGlzLCB0aGlzKTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFZhdWx0V29yZENsb3VkU2V0dGluZ1RhYih0aGlzKSk7XG5cbiAgICB0aGlzLmFkZFJpYmJvbkljb24oJ2Nsb3VkJywgJ09wZW4gd29yZCBjbG91ZHMnLCAoKSA9PiB7XG4gICAgICB2b2lkIHRoaXMuYWN0aXZhdGVWYXVsdFdvcmRDbG91ZFZpZXcoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogJ29wZW4tdmF1bHQtd29yZC1jbG91ZC12aWV3JyxcbiAgICAgIG5hbWU6ICdPcGVuIHZhdWx0IHdvcmQgY2xvdWQnLFxuICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgdm9pZCB0aGlzLmFjdGl2YXRlVmF1bHRXb3JkQ2xvdWRWaWV3KCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiAnb3Blbi1ub3RlLXdvcmQtY2xvdWQtc2lkZWJhcicsXG4gICAgICBuYW1lOiAnT3BlbiBjdXJyZW50IG5vdGUgd29yZCBjbG91ZCcsXG4gICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICB2b2lkIHRoaXMuYWN0aXZhdGVOb3RlV29yZENsb3VkVmlldygpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogJ2VtYmVkLXdvcmQtY2xvdWQtaW4tZG9jdW1lbnQnLFxuICAgICAgbmFtZTogJ0VtYmVkIHdvcmQgY2xvdWQgaW4gZG9jdW1lbnQnLFxuICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgdGhpcy5vcGVuRW1iZWRXb3JkQ2xvdWRXaXphcmQoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBvbnVubG9hZCgpOiB2b2lkIHtcbiAgICAvLyBPYnNpZGlhbiBhdXRvbWF0aWNhbGx5IGRldGFjaGVzIHZpZXdzIHJlZ2lzdGVyZWQgYnkgdGhpcyBwbHVnaW4uXG4gIH1cblxuICBhc3luYyBhY3RpdmF0ZVZhdWx0V29yZENsb3VkVmlldygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XG4gICAgY29uc3QgZXhpc3RpbmdMZWFmID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEVfVkFVTFRfV09SRF9DTE9VRClbMF07XG5cbiAgICBjb25zdCBsZWFmID0gZXhpc3RpbmdMZWFmID8/IHdvcmtzcGFjZS5nZXRMZWFmKHRydWUpO1xuICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHtcbiAgICAgIHR5cGU6IFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VELFxuICAgICAgYWN0aXZlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgd29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gIH1cblxuICBhc3luYyBhY3RpdmF0ZU5vdGVXb3JkQ2xvdWRWaWV3KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICBjb25zdCBleGlzdGluZ0xlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQpWzBdO1xuXG4gICAgY29uc3QgbGVhZiA9IGV4aXN0aW5nTGVhZiA/PyB3b3Jrc3BhY2UuZ2V0UmlnaHRMZWFmKGZhbHNlKTtcbiAgICBpZiAoIWxlYWYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdCBsZWFmLnNldFZpZXdTdGF0ZSh7XG4gICAgICB0eXBlOiBWSUVXX1RZUEVfTk9URV9XT1JEX0NMT1VELFxuICAgICAgYWN0aXZlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgd29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gIH1cblxuICBnZXRBdmFpbGFibGVUYWdzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzb3IuZ2V0QXZhaWxhYmxlVGFncygpO1xuICB9XG5cbiAgZ2V0QXZhaWxhYmxlRm9sZGVycygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLnZhdWx0XG4gICAgICAuZ2V0QWxsTG9hZGVkRmlsZXMoKVxuICAgICAgLmZpbHRlcigoZmlsZSk6IGZpbGUgaXMgVEZvbGRlciA9PiBmaWxlIGluc3RhbmNlb2YgVEZvbGRlcilcbiAgICAgIC5tYXAoKGZvbGRlcikgPT4gZm9sZGVyLnBhdGgpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgfVxuXG4gIGdldE9wZW5NYXJrZG93bkZpbGVzKCk6IFRGaWxlW10ge1xuICAgIGNvbnN0IGZpbGVzID0gbmV3IE1hcDxzdHJpbmcsIFRGaWxlPigpO1xuXG4gICAgZm9yIChjb25zdCBsZWFmIG9mIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ21hcmtkb3duJykpIHtcbiAgICAgIGNvbnN0IHZpZXcgPSBsZWFmLnZpZXc7XG4gICAgICBpZiAodmlldyBpbnN0YW5jZW9mIE1hcmtkb3duVmlldyAmJiB2aWV3LmZpbGUpIHtcbiAgICAgICAgZmlsZXMuc2V0KHZpZXcuZmlsZS5wYXRoLCB2aWV3LmZpbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmIChhY3RpdmVGaWxlKSB7XG4gICAgICBmaWxlcy5zZXQoYWN0aXZlRmlsZS5wYXRoLCBhY3RpdmVGaWxlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gWy4uLmZpbGVzLnZhbHVlcygpXS5zb3J0KChhLCBiKSA9PiBhLnBhdGgubG9jYWxlQ29tcGFyZShiLnBhdGgpKTtcbiAgfVxuXG4gIGdldEFjdGl2ZUZpbGUoKTogVEZpbGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgfVxuXG4gIGdldEZpbHRlclNldHRpbmdzKCk6IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2NvcGU6IHtcbiAgICAgICAgbW9kZTogdGhpcy5zZXR0aW5ncy5maWx0ZXJzLnNjb3BlLm1vZGUsXG4gICAgICAgIGFjdGl2ZUZpbGVQYXRoOiB0aGlzLnNldHRpbmdzLmZpbHRlcnMuc2NvcGUuYWN0aXZlRmlsZVBhdGgsXG4gICAgICAgIGZvbGRlclBhdGhzOiBbLi4udGhpcy5zZXR0aW5ncy5maWx0ZXJzLnNjb3BlLmZvbGRlclBhdGhzXSxcbiAgICAgIH0sXG4gICAgICBpbmNsdWRlVGFnczogWy4uLnRoaXMuc2V0dGluZ3MuZmlsdGVycy5pbmNsdWRlVGFnc10sXG4gICAgICBleGNsdWRlVGFnczogWy4uLnRoaXMuc2V0dGluZ3MuZmlsdGVycy5leGNsdWRlVGFnc10sXG4gICAgICB0YWdNYXRjaE1vZGU6IHRoaXMuc2V0dGluZ3MuZmlsdGVycy50YWdNYXRjaE1vZGUsXG4gICAgICBmcm9udG1hdHRlclJ1bGVzOiB0aGlzLnNldHRpbmdzLmZpbHRlcnMuZnJvbnRtYXR0ZXJSdWxlcy5tYXAoKHJ1bGUpID0+ICh7IC4uLnJ1bGUgfSkpLFxuICAgICAgZnJlcXVlbmN5OiB7XG4gICAgICAgIG1pbkNvdW50OiB0aGlzLnNldHRpbmdzLmZpbHRlcnMuZnJlcXVlbmN5Lm1pbkNvdW50LFxuICAgICAgICBtYXhDb3VudDogdGhpcy5zZXR0aW5ncy5maWx0ZXJzLmZyZXF1ZW5jeS5tYXhDb3VudCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZUZpbHRlclNldHRpbmdzKHBhdGNoOiBQYXJ0aWFsPFdvcmRDbG91ZEZpbHRlclNldHRpbmdzPik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG1lcmdlZDogV29yZENsb3VkRmlsdGVyU2V0dGluZ3MgPSB7XG4gICAgICAuLi50aGlzLnNldHRpbmdzLmZpbHRlcnMsXG4gICAgICAuLi5wYXRjaCxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIC4uLnRoaXMuc2V0dGluZ3MuZmlsdGVycy5zY29wZSxcbiAgICAgICAgLi4ucGF0Y2guc2NvcGUsXG4gICAgICB9LFxuICAgICAgZnJlcXVlbmN5OiB7XG4gICAgICAgIC4uLnRoaXMuc2V0dGluZ3MuZmlsdGVycy5mcmVxdWVuY3ksXG4gICAgICAgIC4uLnBhdGNoLmZyZXF1ZW5jeSxcbiAgICAgIH0sXG4gICAgICBpbmNsdWRlVGFnczogcGF0Y2guaW5jbHVkZVRhZ3MgPz8gdGhpcy5zZXR0aW5ncy5maWx0ZXJzLmluY2x1ZGVUYWdzLFxuICAgICAgZXhjbHVkZVRhZ3M6IHBhdGNoLmV4Y2x1ZGVUYWdzID8/IHRoaXMuc2V0dGluZ3MuZmlsdGVycy5leGNsdWRlVGFncyxcbiAgICAgIGZyb250bWF0dGVyUnVsZXM6IHBhdGNoLmZyb250bWF0dGVyUnVsZXMgPz8gdGhpcy5zZXR0aW5ncy5maWx0ZXJzLmZyb250bWF0dGVyUnVsZXMsXG4gICAgfTtcblxuICAgIHRoaXMuc2V0dGluZ3MuZmlsdGVycyA9IHRoaXMubm9ybWFsaXplRmlsdGVyU2V0dGluZ3MobWVyZ2VkKTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgYXN5bmMgY29sbGVjdFZhdWx0V29yZHMoXG4gICAgb3B0aW9uczogVmF1bHRDb2xsZWN0aW9uT3B0aW9ucyA9IHt9LFxuICAgIG9uUHJvZ3Jlc3M/OiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQsXG4gICk6IFByb21pc2U8V2VpZ2h0ZWRXb3JkW10+IHtcbiAgICBjb25zdCBhbGxNYXJrZG93bkZpbGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xuICAgIGNvbnN0IHNvdXJjZVJ1bGVzID0gb3B0aW9ucy5zb3VyY2VSdWxlcyA/PyB7XG4gICAgICBzY29wZTogdGhpcy5zZXR0aW5ncy5maWx0ZXJzLnNjb3BlLFxuICAgICAgaW5jbHVkZVRhZ3M6IHRoaXMuc2V0dGluZ3MuZmlsdGVycy5pbmNsdWRlVGFncyxcbiAgICAgIGV4Y2x1ZGVUYWdzOiB0aGlzLnNldHRpbmdzLmZpbHRlcnMuZXhjbHVkZVRhZ3MsXG4gICAgICB0YWdNYXRjaE1vZGU6IHRoaXMuc2V0dGluZ3MuZmlsdGVycy50YWdNYXRjaE1vZGUsXG4gICAgICBmcm9udG1hdHRlclJ1bGVzOiB0aGlzLnNldHRpbmdzLmZpbHRlcnMuZnJvbnRtYXR0ZXJSdWxlcyxcbiAgICB9O1xuICAgIGNvbnN0IGZyZXF1ZW5jeSA9IG9wdGlvbnMuZnJlcXVlbmN5ID8/IHRoaXMuc2V0dGluZ3MuZmlsdGVycy5mcmVxdWVuY3k7XG5cbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzb3IuY29sbGVjdEZyb21GaWxlcyhcbiAgICAgIGFsbE1hcmtkb3duRmlsZXMsXG4gICAgICB0aGlzLmdldEJsYWNrbGlzdFNldCgpLFxuICAgICAgdGhpcy5zZXR0aW5ncy5yZW5kZXIsXG4gICAgICBvblByb2dyZXNzLFxuICAgICAge1xuICAgICAgICBzb3VyY2VSdWxlcyxcbiAgICAgICAgZnJlcXVlbmN5LFxuICAgICAgICBleGNsdWRlV29yZHM6IG9wdGlvbnMuZXhjbHVkZVdvcmRzLFxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgY29sbGVjdEZpbGVXb3JkcyhcbiAgICBmaWxlOiBURmlsZSxcbiAgICBvblByb2dyZXNzPzogKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB2b2lkLFxuICAgIG9wdGlvbnM/OiB7IGV4Y2x1ZGVXb3Jkcz86IHN0cmluZ1tdIH0sXG4gICk6IFByb21pc2U8V2VpZ2h0ZWRXb3JkW10+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzb3IuY29sbGVjdEZyb21GaWxlcyhbZmlsZV0sIHRoaXMuZ2V0QmxhY2tsaXN0U2V0KCksIHRoaXMuc2V0dGluZ3MucmVuZGVyLCBvblByb2dyZXNzLCB7XG4gICAgICBleGNsdWRlV29yZHM6IG9wdGlvbnM/LmV4Y2x1ZGVXb3JkcyxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGRyYXdXb3JkQ2xvdWQob3B0aW9uczogV29yZENsb3VkUmVuZGVyT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBkcmF3V29yZENsb3VkKG9wdGlvbnMsIHRoaXMuc2V0dGluZ3MucmVuZGVyKTtcbiAgfVxuXG4gIGFzeW5jIG9wZW5TZWFyY2hGb3JXb3JkKHdvcmQ6IHN0cmluZywgb3B0aW9uczogU2VhcmNoT3B0aW9ucyA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIG9wZW5TZWFyY2hGb3JXb3JkKHRoaXMuYXBwLCB3b3JkLCBvcHRpb25zKTtcbiAgfVxuXG4gIG9wZW5FbWJlZFdvcmRDbG91ZFdpemFyZCgpOiB2b2lkIHtcbiAgICBuZXcgRW1iZWRXb3JkQ2xvdWRNb2RhbCh0aGlzLmFwcCwgdGhpcywgKGVtYmVkQmxvY2spID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmluc2VydEVtYmVkQXRDdXJzb3IoZW1iZWRCbG9jayk7XG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGxvYWRlZCA9IGF3YWl0IHRoaXMubG9hZERhdGEoKTtcbiAgICBjb25zdCBsb2FkZWRCbGFja2xpc3QgPSBsb2FkZWQ/LmJsYWNrbGlzdFdvcmRzO1xuICAgIGNvbnN0IGxvYWRlZFJlbmRlciA9IGxvYWRlZD8ucmVuZGVyO1xuICAgIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICBibGFja2xpc3RXb3JkczogdGhpcy5ub3JtYWxpemVCbGFja2xpc3RXb3Jkcyhsb2FkZWRCbGFja2xpc3QpLFxuICAgICAgcmVuZGVyOiB0aGlzLm5vcm1hbGl6ZVJlbmRlclNldHRpbmdzKGxvYWRlZFJlbmRlciksXG4gICAgICBmaWx0ZXJzOiB0aGlzLm5vcm1hbGl6ZUZpbHRlclNldHRpbmdzKGxvYWRlZD8uZmlsdGVycyksXG4gICAgfTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICB9XG5cbiAgYXN5bmMgYWRkQmxhY2tsaXN0V29yZChyYXdXb3JkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBub3JtYWxpemVkV29yZCA9IHRoaXMubm9ybWFsaXplQmxhY2tsaXN0V29yZChyYXdXb3JkKTtcbiAgICBpZiAoIW5vcm1hbGl6ZWRXb3JkIHx8IHRoaXMuc2V0dGluZ3MuYmxhY2tsaXN0V29yZHMuaW5jbHVkZXMobm9ybWFsaXplZFdvcmQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5zZXR0aW5ncy5ibGFja2xpc3RXb3JkcyA9IFsuLi50aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzLCBub3JtYWxpemVkV29yZF07XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIHJlbW92ZUJsYWNrbGlzdFdvcmQocmF3V29yZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgbm9ybWFsaXplZFdvcmQgPSB0aGlzLm5vcm1hbGl6ZUJsYWNrbGlzdFdvcmQocmF3V29yZCk7XG4gICAgdGhpcy5zZXR0aW5ncy5ibGFja2xpc3RXb3JkcyA9IHRoaXMuc2V0dGluZ3MuYmxhY2tsaXN0V29yZHMuZmlsdGVyKCh3b3JkKSA9PiB3b3JkICE9PSBub3JtYWxpemVkV29yZCk7XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIGFzeW5jIHJlc2V0QmxhY2tsaXN0V29yZHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5zZXR0aW5ncy5ibGFja2xpc3RXb3JkcyA9IFsuLi5ERUZBVUxUX1NFVFRJTkdTLmJsYWNrbGlzdFdvcmRzXTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlUmVuZGVyU2V0dGluZ3MocGF0Y2g6IFBhcnRpYWw8UmVuZGVyU2V0dGluZ3M+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbWVyZ2VkID0ge1xuICAgICAgLi4udGhpcy5zZXR0aW5ncy5yZW5kZXIsXG4gICAgICAuLi5wYXRjaCxcbiAgICB9O1xuICAgIHRoaXMuc2V0dGluZ3MucmVuZGVyID0gdGhpcy5ub3JtYWxpemVSZW5kZXJTZXR0aW5ncyhtZXJnZWQpO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICBhc3luYyByZXNldFJlbmRlclNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuc2V0dGluZ3MucmVuZGVyID0geyAuLi5ERUZBVUxUX1NFVFRJTkdTLnJlbmRlciB9O1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICBwcml2YXRlIGdldEJsYWNrbGlzdFNldCgpOiBTZXQ8c3RyaW5nPiB7XG4gICAgcmV0dXJuIG5ldyBTZXQodGhpcy5zZXR0aW5ncy5ibGFja2xpc3RXb3Jkcy5tYXAoKHdvcmQpID0+IHRoaXMubm9ybWFsaXplQmxhY2tsaXN0V29yZCh3b3JkKSkuZmlsdGVyKEJvb2xlYW4pKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9ybWFsaXplQmxhY2tsaXN0V29yZHMocmF3VmFsdWU6IHVua25vd24pOiBzdHJpbmdbXSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHJhd1ZhbHVlKSkge1xuICAgICAgcmV0dXJuIFsuLi5ERUZBVUxUX1NFVFRJTkdTLmJsYWNrbGlzdFdvcmRzXTtcbiAgICB9XG5cbiAgICBjb25zdCBzZWVuID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiByYXdWYWx1ZSkge1xuICAgICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBub3JtYWxpemVkID0gdGhpcy5ub3JtYWxpemVCbGFja2xpc3RXb3JkKGVudHJ5KTtcbiAgICAgIGlmIChub3JtYWxpemVkKSB7XG4gICAgICAgIHNlZW4uYWRkKG5vcm1hbGl6ZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzZWVuLnNpemUgPiAwID8gWy4uLnNlZW5dIDogWy4uLkRFRkFVTFRfU0VUVElOR1MuYmxhY2tsaXN0V29yZHNdO1xuICB9XG5cbiAgcHJpdmF0ZSBub3JtYWxpemVCbGFja2xpc3RXb3JkKHdvcmQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHdvcmQudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICBwcml2YXRlIG5vcm1hbGl6ZUZpbHRlclNldHRpbmdzKHJhd1ZhbHVlOiB1bmtub3duKTogV29yZENsb3VkRmlsdGVyU2V0dGluZ3Mge1xuICAgIGNvbnN0IHJhdyA9IChyYXdWYWx1ZSAmJiB0eXBlb2YgcmF3VmFsdWUgPT09ICdvYmplY3QnKVxuICAgICAgPyByYXdWYWx1ZSBhcyBQYXJ0aWFsPFdvcmRDbG91ZEZpbHRlclNldHRpbmdzPlxuICAgICAgOiB7fTtcblxuICAgIGNvbnN0IHNjb3BlID0gdGhpcy5ub3JtYWxpemVTY29wZShyYXcuc2NvcGUpO1xuICAgIGNvbnN0IGluY2x1ZGVUYWdzID0gbm9ybWFsaXplVGFnTGlzdChyYXcuaW5jbHVkZVRhZ3MpO1xuICAgIGNvbnN0IGV4Y2x1ZGVUYWdzID0gbm9ybWFsaXplVGFnTGlzdChyYXcuZXhjbHVkZVRhZ3MpLmZpbHRlcigodGFnKSA9PiAhaW5jbHVkZVRhZ3MuaW5jbHVkZXModGFnKSk7XG4gICAgY29uc3QgdGFnTWF0Y2hNb2RlOiBUYWdNYXRjaE1vZGUgPSByYXcudGFnTWF0Y2hNb2RlID09PSAnYWxsJyA/ICdhbGwnIDogJ2FueSc7XG4gICAgY29uc3QgZnJvbnRtYXR0ZXJSdWxlcyA9IG5vcm1hbGl6ZUZyb250bWF0dGVyUnVsZXMocmF3LmZyb250bWF0dGVyUnVsZXMpO1xuICAgIGNvbnN0IG1pbkNvdW50ID0gdGhpcy5jbGFtcE51bWJlcihyYXcuZnJlcXVlbmN5Py5taW5Db3VudCwgMSwgOTk5OSwgREVGQVVMVF9TRVRUSU5HUy5maWx0ZXJzLmZyZXF1ZW5jeS5taW5Db3VudCk7XG4gICAgY29uc3QgbWF4Q291bnQgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy5mcmVxdWVuY3k/Lm1heENvdW50LCAxLCA5OTk5LCBERUZBVUxUX1NFVFRJTkdTLmZpbHRlcnMuZnJlcXVlbmN5Lm1heENvdW50KTtcblxuICAgIHJldHVybiB7XG4gICAgICBzY29wZSxcbiAgICAgIGluY2x1ZGVUYWdzLFxuICAgICAgZXhjbHVkZVRhZ3MsXG4gICAgICB0YWdNYXRjaE1vZGUsXG4gICAgICBmcm9udG1hdHRlclJ1bGVzLFxuICAgICAgZnJlcXVlbmN5OiB7XG4gICAgICAgIG1pbkNvdW50OiBNYXRoLm1pbihtaW5Db3VudCwgbWF4Q291bnQpLFxuICAgICAgICBtYXhDb3VudDogTWF0aC5tYXgobWluQ291bnQsIG1heENvdW50KSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgbm9ybWFsaXplU2NvcGUocmF3VmFsdWU6IHVua25vd24pOiBTb3VyY2VTY29wZSB7XG4gICAgY29uc3QgcmF3ID0gKHJhd1ZhbHVlICYmIHR5cGVvZiByYXdWYWx1ZSA9PT0gJ29iamVjdCcpID8gcmF3VmFsdWUgYXMgUGFydGlhbDxTb3VyY2VTY29wZT4gOiB7fTtcbiAgICBjb25zdCBtb2RlID0gcmF3Lm1vZGUgPT09ICdhY3RpdmUtZmlsZScgfHwgcmF3Lm1vZGUgPT09ICdmb2xkZXInIHx8IHJhdy5tb2RlID09PSAndmF1bHQnXG4gICAgICA/IHJhdy5tb2RlXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MuZmlsdGVycy5zY29wZS5tb2RlO1xuXG4gICAgY29uc3QgYWN0aXZlRmlsZVBhdGggPSB0eXBlb2YgcmF3LmFjdGl2ZUZpbGVQYXRoID09PSAnc3RyaW5nJ1xuICAgICAgPyByYXcuYWN0aXZlRmlsZVBhdGgudHJpbSgpXG4gICAgICA6ICcnO1xuICAgIGNvbnN0IGZvbGRlclBhdGhzID0gQXJyYXkuaXNBcnJheShyYXcuZm9sZGVyUGF0aHMpXG4gICAgICA/IFsuLi5uZXcgU2V0KHJhdy5mb2xkZXJQYXRocy5maWx0ZXIoKHBhdGgpOiBwYXRoIGlzIHN0cmluZyA9PiB0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpLm1hcCgocGF0aCkgPT4gcGF0aC50cmltKCkpLmZpbHRlcihCb29sZWFuKSldXG4gICAgICA6IFtdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGUsXG4gICAgICBhY3RpdmVGaWxlUGF0aCxcbiAgICAgIGZvbGRlclBhdGhzLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIG5vcm1hbGl6ZVJlbmRlclNldHRpbmdzKHJhd1ZhbHVlOiB1bmtub3duKTogUmVuZGVyU2V0dGluZ3Mge1xuICAgIGNvbnN0IHJhdyA9IChyYXdWYWx1ZSAmJiB0eXBlb2YgcmF3VmFsdWUgPT09ICdvYmplY3QnKSA/IHJhd1ZhbHVlIGFzIFBhcnRpYWw8UmVuZGVyU2V0dGluZ3M+IDoge307XG5cbiAgICBjb25zdCByb3RhdGlvblByZXNldCA9IHJhdy5yb3RhdGlvblByZXNldCA9PT0gJ2hvcml6b250YWwnXG4gICAgICB8fCByYXcucm90YXRpb25QcmVzZXQgPT09ICdtb3N0bHktaG9yaXpvbnRhbCdcbiAgICAgIHx8IHJhdy5yb3RhdGlvblByZXNldCA9PT0gJ21peGVkJ1xuICAgICAgfHwgcmF3LnJvdGF0aW9uUHJlc2V0ID09PSAndmVydGljYWwnXG4gICAgICA/IHJhdy5yb3RhdGlvblByZXNldFxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5yb3RhdGlvblByZXNldDtcblxuICAgIGNvbnN0IHNwaXJhbCA9IHJhdy5zcGlyYWwgPT09ICdhcmNoaW1lZGVhbicgfHwgcmF3LnNwaXJhbCA9PT0gJ3JlY3Rhbmd1bGFyJ1xuICAgICAgPyByYXcuc3BpcmFsXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnNwaXJhbDtcblxuICAgIGNvbnN0IHdvcmRQYWRkaW5nID0gdGhpcy5jbGFtcE51bWJlcihyYXcud29yZFBhZGRpbmcsIDAsIDEyLCBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci53b3JkUGFkZGluZyk7XG4gICAgY29uc3QgbWluRm9udFNpemUgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy5taW5Gb250U2l6ZSwgOCwgNjQsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLm1pbkZvbnRTaXplKTtcbiAgICBjb25zdCBtYXhGb250U2l6ZSA9IHRoaXMuY2xhbXBOdW1iZXIocmF3Lm1heEZvbnRTaXplLCAxNiwgMTQwLCBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5tYXhGb250U2l6ZSk7XG4gICAgY29uc3Qgc2FmZU1pbkZvbnRTaXplID0gTWF0aC5taW4obWluRm9udFNpemUsIG1heEZvbnRTaXplIC0gMSk7XG4gICAgY29uc3Qgc2FmZU1heEZvbnRTaXplID0gTWF0aC5tYXgobWF4Rm9udFNpemUsIHNhZmVNaW5Gb250U2l6ZSArIDEpO1xuXG4gICAgY29uc3QgZm9udEZhbWlseSA9IHR5cGVvZiByYXcuZm9udEZhbWlseSA9PT0gJ3N0cmluZycgJiYgcmF3LmZvbnRGYW1pbHkudHJpbSgpLmxlbmd0aCA+IDBcbiAgICAgID8gcmF3LmZvbnRGYW1pbHkudHJpbSgpXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLmZvbnRGYW1pbHk7XG5cbiAgICBjb25zdCBzY2FsaW5nTW9kZSA9IHJhdy5zY2FsaW5nTW9kZSA9PT0gJ2xpbmVhcidcbiAgICAgIHx8IHJhdy5zY2FsaW5nTW9kZSA9PT0gJ3Bvd2VyJ1xuICAgICAgfHwgcmF3LnNjYWxpbmdNb2RlID09PSAnbG9nJ1xuICAgICAgfHwgcmF3LnNjYWxpbmdNb2RlID09PSAncmFuaydcbiAgICAgID8gcmF3LnNjYWxpbmdNb2RlXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnNjYWxpbmdNb2RlO1xuXG4gICAgY29uc3QgZW1waGFzaXMgPSB0aGlzLmNsYW1wRmxvYXQocmF3LmVtcGhhc2lzLCAwLjUsIDMsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLmVtcGhhc2lzKTtcblxuICAgIGNvbnN0IHNob3dDb3VudEluV29yZFRleHQgPSB0eXBlb2YgcmF3LnNob3dDb3VudEluV29yZFRleHQgPT09ICdib29sZWFuJ1xuICAgICAgPyByYXcuc2hvd0NvdW50SW5Xb3JkVGV4dFxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5zaG93Q291bnRJbldvcmRUZXh0O1xuXG4gICAgY29uc3Qgd29yZFRleHRNZXRyaWMgPSByYXcud29yZFRleHRNZXRyaWMgPT09ICdjb3VudCcgfHwgcmF3LndvcmRUZXh0TWV0cmljID09PSAnZnJlcXVlbmN5J1xuICAgICAgPyByYXcud29yZFRleHRNZXRyaWNcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIud29yZFRleHRNZXRyaWM7XG5cbiAgICBjb25zdCBzaG93V29yZFRleHRNZXRyaWNUb2dnbGUgPSB0eXBlb2YgcmF3LnNob3dXb3JkVGV4dE1ldHJpY1RvZ2dsZSA9PT0gJ2Jvb2xlYW4nXG4gICAgICA/IHJhdy5zaG93V29yZFRleHRNZXRyaWNUb2dnbGVcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuc2hvd1dvcmRUZXh0TWV0cmljVG9nZ2xlO1xuXG4gICAgY29uc3QgY291bnRMYWJlbEZvcm1hdCA9IHJhdy5jb3VudExhYmVsRm9ybWF0ID09PSAncGFyZW4nXG4gICAgICB8fCByYXcuY291bnRMYWJlbEZvcm1hdCA9PT0gJ2RvdCdcbiAgICAgIHx8IHJhdy5jb3VudExhYmVsRm9ybWF0ID09PSAnY29sb24nXG4gICAgICA/IHJhdy5jb3VudExhYmVsRm9ybWF0XG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLmNvdW50TGFiZWxGb3JtYXQ7XG5cbiAgICBjb25zdCBjb3VudExhYmVsTWluQ291bnQgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy5jb3VudExhYmVsTWluQ291bnQsIDEsIDEwMCwgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuY291bnRMYWJlbE1pbkNvdW50KTtcblxuICAgIGNvbnN0IHByb2dyZXNzRGV0YWlsID0gcmF3LnByb2dyZXNzRGV0YWlsID09PSAnbWluaW1hbCdcbiAgICAgIHx8IHJhdy5wcm9ncmVzc0RldGFpbCA9PT0gJ2JhbGFuY2VkJ1xuICAgICAgfHwgcmF3LnByb2dyZXNzRGV0YWlsID09PSAnZGV0YWlsZWQnXG4gICAgICB8fCByYXcucHJvZ3Jlc3NEZXRhaWwgPT09ICd1bmhpbmdlZCdcbiAgICAgID8gcmF3LnByb2dyZXNzRGV0YWlsXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnByb2dyZXNzRGV0YWlsO1xuXG4gICAgY29uc3Qgc2NhbkJhdGNoU2l6ZSA9IHRoaXMuY2xhbXBOdW1iZXIocmF3LnNjYW5CYXRjaFNpemUsIDgsIDY0LCBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5zY2FuQmF0Y2hTaXplKTtcbiAgICBjb25zdCBsYXlvdXRUaW1lSW50ZXJ2YWxNcyA9IHRoaXMuY2xhbXBOdW1iZXIoXG4gICAgICByYXcubGF5b3V0VGltZUludGVydmFsTXMsXG4gICAgICA4LFxuICAgICAgNDAsXG4gICAgICBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5sYXlvdXRUaW1lSW50ZXJ2YWxNcyxcbiAgICApO1xuXG4gICAgY29uc3QgZGV0ZXJtaW5pc3RpY0xheW91dCA9IHR5cGVvZiByYXcuZGV0ZXJtaW5pc3RpY0xheW91dCA9PT0gJ2Jvb2xlYW4nXG4gICAgICA/IHJhdy5kZXRlcm1pbmlzdGljTGF5b3V0XG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLmRldGVybWluaXN0aWNMYXlvdXQ7XG5cbiAgICBjb25zdCByYW5kb21TZWVkID0gdGhpcy5jbGFtcE51bWJlcihyYXcucmFuZG9tU2VlZCwgMSwgMjE0NzQ4MzY0NywgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIucmFuZG9tU2VlZCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcm90YXRpb25QcmVzZXQsXG4gICAgICBzcGlyYWwsXG4gICAgICB3b3JkUGFkZGluZyxcbiAgICAgIG1pbkZvbnRTaXplOiBzYWZlTWluRm9udFNpemUsXG4gICAgICBtYXhGb250U2l6ZTogc2FmZU1heEZvbnRTaXplLFxuICAgICAgZm9udEZhbWlseSxcbiAgICAgIHNjYWxpbmdNb2RlLFxuICAgICAgZW1waGFzaXMsXG4gICAgICBzaG93Q291bnRJbldvcmRUZXh0LFxuICAgICAgd29yZFRleHRNZXRyaWMsXG4gICAgICBzaG93V29yZFRleHRNZXRyaWNUb2dnbGUsXG4gICAgICBjb3VudExhYmVsRm9ybWF0LFxuICAgICAgY291bnRMYWJlbE1pbkNvdW50LFxuICAgICAgcHJvZ3Jlc3NEZXRhaWwsXG4gICAgICBzY2FuQmF0Y2hTaXplLFxuICAgICAgbGF5b3V0VGltZUludGVydmFsTXMsXG4gICAgICBkZXRlcm1pbmlzdGljTGF5b3V0LFxuICAgICAgcmFuZG9tU2VlZCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBjbGFtcE51bWJlcih2YWx1ZTogdW5rbm93biwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyLCBmYWxsYmFjazogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fCBOdW1iZXIuaXNOYU4odmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgTWF0aC5yb3VuZCh2YWx1ZSkpKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xhbXBGbG9hdCh2YWx1ZTogdW5rbm93biwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyLCBmYWxsYmFjazogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fCBOdW1iZXIuaXNOYU4odmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgdmFsdWUpKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5zZXJ0RW1iZWRBdEN1cnNvcihlbWJlZEJsb2NrOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBpZiAoIXZpZXcpIHtcbiAgICAgIG5ldyBOb3RpY2UoJ09wZW4gYSBtYXJrZG93biBub3RlIHRvIGluc2VydCBhIHdvcmQgY2xvdWQgZW1iZWQuJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgeyBlZGl0b3IgfSA9IHZpZXc7XG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpO1xuICAgIGNvbnN0IGN1cnJlbnRMaW5lID0gZWRpdG9yLmdldExpbmUoY3Vyc29yLmxpbmUpO1xuXG4gICAgY29uc3QgaGFzVGV4dEJlZm9yZUN1cnNvciA9IGN1cnJlbnRMaW5lLnNsaWNlKDAsIGN1cnNvci5jaCkudHJpbSgpLmxlbmd0aCA+IDA7XG4gICAgY29uc3QgaGFzVGV4dEFmdGVyQ3Vyc29yID0gY3VycmVudExpbmUuc2xpY2UoY3Vyc29yLmNoKS50cmltKCkubGVuZ3RoID4gMDtcblxuICAgIGNvbnN0IHByZWZpeCA9IGhhc1RleHRCZWZvcmVDdXJzb3IgPyAnXFxuJyA6ICcnO1xuICAgIGNvbnN0IHN1ZmZpeCA9IGhhc1RleHRBZnRlckN1cnNvciA/ICdcXG4nIDogJyc7XG4gICAgY29uc3QgdGV4dFRvSW5zZXJ0ID0gYCR7cHJlZml4fSR7ZW1iZWRCbG9ja30ke3N1ZmZpeH1gO1xuXG4gICAgZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24odGV4dFRvSW5zZXJ0KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVUYWdMaXN0KHJhd1RhZ3M6IHVua25vd24pOiBzdHJpbmdbXSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShyYXdUYWdzKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHRhZ3MgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCB2YWx1ZSBvZiByYXdUYWdzKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplVGFnKHZhbHVlKTtcbiAgICBpZiAobm9ybWFsaXplZCkge1xuICAgICAgdGFncy5hZGQobm9ybWFsaXplZCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFsuLi50YWdzXTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRnJvbnRtYXR0ZXJSdWxlcyhyYXdSdWxlczogdW5rbm93bik6IEZyb250bWF0dGVyUnVsZVtdIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHJhd1J1bGVzKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IGFsbG93ZWQgPSBuZXcgU2V0KFsnZXF1YWxzJywgJ25vdC1lcXVhbHMnLCAnY29udGFpbnMnLCAnZ3QnLCAnZ3RlJywgJ2x0JywgJ2x0ZScsICdleGlzdHMnLCAnbm90LWV4aXN0cyddKTtcbiAgY29uc3QgcnVsZXM6IEZyb250bWF0dGVyUnVsZVtdID0gW107XG5cbiAgZm9yIChjb25zdCBydWxlIG9mIHJhd1J1bGVzKSB7XG4gICAgaWYgKCFydWxlIHx8IHR5cGVvZiBydWxlICE9PSAnb2JqZWN0Jykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2FuZGlkYXRlID0gcnVsZSBhcyBQYXJ0aWFsPEZyb250bWF0dGVyUnVsZT47XG4gICAgY29uc3Qga2V5ID0gdHlwZW9mIGNhbmRpZGF0ZS5rZXkgPT09ICdzdHJpbmcnID8gY2FuZGlkYXRlLmtleS50cmltKCkgOiAnJztcbiAgICBpZiAoIWtleSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlcmF0b3IgPSB0eXBlb2YgY2FuZGlkYXRlLm9wZXJhdG9yID09PSAnc3RyaW5nJyAmJiBhbGxvd2VkLmhhcyhjYW5kaWRhdGUub3BlcmF0b3IpXG4gICAgICA/IGNhbmRpZGF0ZS5vcGVyYXRvciBhcyBGcm9udG1hdHRlclJ1bGVbJ29wZXJhdG9yJ11cbiAgICAgIDogJ2VxdWFscyc7XG4gICAgY29uc3QgdmFsdWUgPSB0eXBlb2YgY2FuZGlkYXRlLnZhbHVlID09PSAnc3RyaW5nJyA/IGNhbmRpZGF0ZS52YWx1ZSA6ICcnO1xuXG4gICAgcnVsZXMucHVzaCh7IGtleSwgb3BlcmF0b3IsIHZhbHVlIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJ1bGVzO1xufVxuIiwgImV4cG9ydCBjb25zdCBWSUVXX1RZUEVfVkFVTFRfV09SRF9DTE9VRCA9ICd2YXVsdC13b3JkLWNsb3VkLXZpZXcnO1xuZXhwb3J0IGNvbnN0IFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQgPSAnbm90ZS13b3JkLWNsb3VkLXZpZXcnO1xuZXhwb3J0IGNvbnN0IE1BWF9XT1JEUyA9IDE0MDtcbmV4cG9ydCBjb25zdCBNSU5fV09SRF9MRU5HVEggPSAzO1xuZXhwb3J0IGNvbnN0IEZST05UTUFUVEVSX1BBVFRFUk4gPSAvXi0tLVxccypcXG5bXFxzXFxTXSo/XFxuLS0tXFxzKig/OlxcbnwkKS87XG5leHBvcnQgY29uc3QgV09SRF9DTE9VRF9CTE9DS19QQVRURVJOID0gL2BgYCg/OndvcmRjbG91ZHx3b3JkLWNsb3VkKVxccypcXG5bXFxzXFxTXSo/XFxuYGBgL2dpO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TVE9QX1dPUkRTOiBzdHJpbmdbXSA9IFtcbiAgJ3RoZScsICdhbmQnLCAnZm9yJywgJ3RoYXQnLCAndGhpcycsICd3aXRoJywgJ2Zyb20nLCAnYXJlJywgJ3dhcycsICd3ZXJlJywgJ2hhdmUnLCAnaGFzJywgJ2hhZCcsXG4gICd5b3UnLCAneW91cicsICd0aGV5JywgJ3RoZW0nLCAndGhlaXInLCAnaXRzJywgJ291cicsICdvdXJzJywgJ2hpcycsICdoZXInLCAnc2hlJywgJ2hpbScsICdub3QnLFxuICAnYnV0JywgJ2NhbicsICd3aWxsJywgJ2FsbCcsICdhbnknLCAnb25lJywgJ3R3bycsICd0b28nLCAndXNlJywgJ3VzaW5nJywgJ2ludG8nLCAnb3V0JywgJ2Fib3V0JyxcbiAgJ3RoZXJlJywgJ3RoZW4nLCAndGhhbicsICd3aGVuJywgJ3doYXQnLCAnd2hlcmUnLCAnd2hpY2gnLCAnd2hvJywgJ3dob20nLCAnaG93JywgJ3doeScsICdhbHNvJyxcbiAgJ2p1c3QnLCAnbGlrZScsICdzb21lJywgJ21vcmUnLCAnbW9zdCcsICdtdWNoJywgJ21hbnknLCAndmVyeScsICdlYWNoJywgJ290aGVyJywgJ3N1Y2gnLCAnb25seScsXG4gICdub3RlJywgJ25vdGVzJywgJ3RvZG8nLCAnZG9uZScsICdudWxsJywgJ3RydWUnLCAnZmFsc2UnLCAnaHR0cCcsICdodHRwcycsICd3d3cnLCAnY29tJ1xuXTtcbiIsICJpbXBvcnQgeyBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LCBNYXJrZG93blZpZXcsIE5vdGljZSwgUGx1Z2luLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgVGFnTWF0Y2hNb2RlLCBXb3JkQ2xvdWRTZXJ2aWNlcyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IEVtYmVkV29yZENsb3VkTW9kYWwgfSBmcm9tICcuLi9tb2RhbHMvZWRpdC13b3JkLWNsb3VkLW1vZGFsJztcbmltcG9ydCB0eXBlIHsgRnJvbnRtYXR0ZXJPcGVyYXRvciwgRnJvbnRtYXR0ZXJSdWxlLCBTb3VyY2VTY29wZSB9IGZyb20gJy4uL3dvcmRjbG91ZC9waXBlbGluZS90eXBlcyc7XG5pbXBvcnQgeyBub3JtYWxpemVUYWcgfSBmcm9tICcuLi91dGlscyc7XG5cbnR5cGUgRW1iZWRkZWRXb3JkQ2xvdWRTY29wZSA9ICdmaWxlJyB8ICd2YXVsdCcgfCAnZm9sZGVyJztcbnR5cGUgRW1iZWRkZWRXb3JkQ2xvdWRTaXplID0gJ3NtYWxsJyB8ICdtZWRpdW0nIHwgJ2xhcmdlJztcblxudHlwZSBFbWJlZGRlZFdvcmRDbG91ZE9wdGlvbnMgPSB7XG4gIGNsb3VkSWQ6IHN0cmluZztcbiAgc2NvcGU6IEVtYmVkZGVkV29yZENsb3VkU2NvcGU7XG4gIHNpemU6IEVtYmVkZGVkV29yZENsb3VkU2l6ZTtcbiAgaW5jbHVkZVRhZ3M6IHN0cmluZ1tdO1xuICBleGNsdWRlVGFnczogc3RyaW5nW107XG4gIHRhZ01hdGNoTW9kZTogVGFnTWF0Y2hNb2RlO1xuICBmb2xkZXJQYXRoczogc3RyaW5nW107XG4gIGZyb250bWF0dGVyUnVsZXM6IEZyb250bWF0dGVyUnVsZVtdO1xuICBtaW5Db3VudDogbnVtYmVyO1xuICBtYXhDb3VudDogbnVtYmVyO1xuICBleGNsdWRlV29yZHM6IHN0cmluZ1tdO1xuICBpbnRlcmFjdGlvbnM6IGJvb2xlYW47XG4gIHNwZWNpZmljRmlsZVBhdGg/OiBzdHJpbmc7XG59O1xuXG50eXBlIEVtYmVkZGVkUmVuZGVyU3RhdGUgPSB7XG4gIG9ic2VydmVyOiBSZXNpemVPYnNlcnZlcjtcbiAgcmVyZW5kZXJUaW1lcjogbnVtYmVyIHwgbnVsbDtcbiAgbGFzdFdpZHRoOiBudW1iZXI7XG4gIGxhc3RIZWlnaHQ6IG51bWJlcjtcbn07XG5cbnR5cGUgRW1iZWRkZWRDbG91ZEluc3RhbmNlID0ge1xuICBzb3VyY2VQYXRoOiBzdHJpbmc7XG4gIHJlcmVuZGVyOiAoKSA9PiB2b2lkO1xufTtcblxuY29uc3QgREVGQVVMVF9PUFRJT05TOiBFbWJlZGRlZFdvcmRDbG91ZE9wdGlvbnMgPSB7XG4gIGNsb3VkSWQ6ICcnLFxuICBzY29wZTogJ2ZpbGUnLFxuICBzaXplOiAnbWVkaXVtJyxcbiAgaW5jbHVkZVRhZ3M6IFtdLFxuICBleGNsdWRlVGFnczogW10sXG4gIHRhZ01hdGNoTW9kZTogJ2FueScsXG4gIGZvbGRlclBhdGhzOiBbXSxcbiAgZnJvbnRtYXR0ZXJSdWxlczogW10sXG4gIG1pbkNvdW50OiAxLFxuICBtYXhDb3VudDogOTk5OSxcbiAgZXhjbHVkZVdvcmRzOiBbXSxcbiAgaW50ZXJhY3Rpb25zOiB0cnVlLFxufTtcblxuY29uc3QgRlJPTlRNQVRURVJfT1BFUkFUT1JTID0gbmV3IFNldDxGcm9udG1hdHRlck9wZXJhdG9yPihbXG4gICdlcXVhbHMnLFxuICAnbm90LWVxdWFscycsXG4gICdjb250YWlucycsXG4gICdndCcsXG4gICdndGUnLFxuICAnbHQnLFxuICAnbHRlJyxcbiAgJ2V4aXN0cycsXG4gICdub3QtZXhpc3RzJyxcbl0pO1xuXG5jb25zdCBFTUJFRF9SRVNJWkVfREVCT1VOQ0VfTVMgPSAxNDA7XG5jb25zdCBFTUJFRF9DT05URU5UX0NIQU5HRV9ERUJPVU5DRV9NUyA9IDUwMDA7XG5jb25zdCBFTUJFRF9TSVpFX0hFSUdIVDogUmVjb3JkPEVtYmVkZGVkV29yZENsb3VkU2l6ZSwgbnVtYmVyPiA9IHtcbiAgc21hbGw6IDI0MCxcbiAgbWVkaXVtOiAzMjAsXG4gIGxhcmdlOiA0NDAsXG59O1xuY29uc3QgZW1iZWRkZWRSZW5kZXJTdGF0ZXMgPSBuZXcgV2Vha01hcDxIVE1MRWxlbWVudCwgRW1iZWRkZWRSZW5kZXJTdGF0ZT4oKTtcbmNvbnN0IGVtYmVkZGVkQ2xvdWRJbnN0YW5jZXMgPSBuZXcgV2Vha01hcDxIVE1MRWxlbWVudCwgRW1iZWRkZWRDbG91ZEluc3RhbmNlPigpO1xuY29uc3QgZW1iZWRkZWRDbG91ZHNCeVNvdXJjZVBhdGggPSBuZXcgTWFwPHN0cmluZywgU2V0PEhUTUxFbGVtZW50Pj4oKTtcbmNvbnN0IHNvdXJjZVBhdGhSZWZyZXNoVGltZXJzID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRW1iZWRkZWRXb3JkQ2xvdWRQcm9jZXNzb3IoXG4gIHBsdWdpbjogUGx1Z2luLFxuICBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXMsXG4pOiB2b2lkIHtcbiAgY29uc3QgcmVuZGVyID0gYXN5bmMgKHNvdXJjZTogc3RyaW5nLCBlbDogSFRNTEVsZW1lbnQsIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNsZWFudXBFbWJlZGRlZFJlbmRlclN0YXRlKGVsKTtcbiAgICByZWdpc3RlckVtYmVkZGVkQ2xvdWRJbnN0YW5jZShlbCwgY3R4LnNvdXJjZVBhdGgsICgpID0+IHtcbiAgICAgIHZvaWQgcmVuZGVyKHNvdXJjZSwgZWwsIGN0eCk7XG4gICAgfSk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHBhcnNlT3B0aW9ucyhzb3VyY2UpO1xuXG4gICAgZWwuZW1wdHkoKTtcbiAgICBjb25zdCB3cmFwcGVyRWwgPSBlbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkJyB9KTtcbiAgICBjb25zdCBzdGF0ZUVsID0gd3JhcHBlckVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtc3RhdGUnLCB0ZXh0OiAnQnVpbGRpbmcgY2xvdWQuLi4nIH0pO1xuICAgIGNvbnN0IGNhbnZhc0VsID0gd3JhcHBlckVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtY2FudmFzJyB9KTtcbiAgICBjYW52YXNFbC5zdHlsZS5oZWlnaHQgPSBgJHtFTUJFRF9TSVpFX0hFSUdIVFtvcHRpb25zLnNpemVdfXB4YDtcblxuICAgIGNvbnN0IHVwZGF0ZVByb2dyZXNzID0gKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgICBzdGF0ZUVsLnNldFRleHQoYCR7bWVzc2FnZX0gKCR7cGVyY2VudH0lKWApO1xuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgc291cmNlU2NvcGUgPSByZXNvbHZlU291cmNlU2NvcGUocGx1Z2luLCBjdHgsIG9wdGlvbnMpO1xuICAgICAgaWYgKG9wdGlvbnMuc2NvcGUgPT09ICdmaWxlJyAmJiAhc291cmNlU2NvcGUuYWN0aXZlRmlsZVBhdGgpIHtcbiAgICAgICAgc3RhdGVFbC5zZXRUZXh0KCdDb3VsZCBub3QgcmVzb2x2ZSB0aGUgZmlsZSBmb3IgdGhpcyBlbWJlZGRlZCBjbG91ZC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuc2NvcGUgPT09ICdmb2xkZXInICYmIHNvdXJjZVNjb3BlLmZvbGRlclBhdGhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBzdGF0ZUVsLnNldFRleHQoJ0FkZCBhdCBsZWFzdCBvbmUgZm9sZGVyIHBhdGggZm9yIGZvbGRlciBzY29wZS4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB3b3JkcyA9IGF3YWl0IHNlcnZpY2VzLmNvbGxlY3RWYXVsdFdvcmRzKHtcbiAgICAgICAgc291cmNlUnVsZXM6IHtcbiAgICAgICAgICBzY29wZTogc291cmNlU2NvcGUsXG4gICAgICAgICAgaW5jbHVkZVRhZ3M6IG9wdGlvbnMuaW5jbHVkZVRhZ3MsXG4gICAgICAgICAgZXhjbHVkZVRhZ3M6IG9wdGlvbnMuZXhjbHVkZVRhZ3MsXG4gICAgICAgICAgdGFnTWF0Y2hNb2RlOiBvcHRpb25zLnRhZ01hdGNoTW9kZSxcbiAgICAgICAgICBmcm9udG1hdHRlclJ1bGVzOiBvcHRpb25zLmZyb250bWF0dGVyUnVsZXMsXG4gICAgICAgIH0sXG4gICAgICAgIGZyZXF1ZW5jeToge1xuICAgICAgICAgIG1pbkNvdW50OiBvcHRpb25zLm1pbkNvdW50LFxuICAgICAgICAgIG1heENvdW50OiBvcHRpb25zLm1heENvdW50LFxuICAgICAgICB9LFxuICAgICAgICBleGNsdWRlV29yZHM6IG9wdGlvbnMuZXhjbHVkZVdvcmRzLFxuICAgICAgfSwgdXBkYXRlUHJvZ3Jlc3MpO1xuXG4gICAgICBsZXQgc2VhcmNoU2NvcGU6IHsgZmlsZVBhdGg/OiBzdHJpbmc7IGluY2x1ZGVUYWdzPzogc3RyaW5nW107IGV4Y2x1ZGVUYWdzPzogc3RyaW5nW107IHRhZ01hdGNoTW9kZT86IFRhZ01hdGNoTW9kZSB9ID0ge307XG4gICAgICBpZiAob3B0aW9ucy5zY29wZSA9PT0gJ2ZpbGUnICYmIHNvdXJjZVNjb3BlLmFjdGl2ZUZpbGVQYXRoKSB7XG4gICAgICAgIHNlYXJjaFNjb3BlID0geyBmaWxlUGF0aDogc291cmNlU2NvcGUuYWN0aXZlRmlsZVBhdGggfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlYXJjaFNjb3BlID0ge1xuICAgICAgICAgIGluY2x1ZGVUYWdzOiBvcHRpb25zLmluY2x1ZGVUYWdzLFxuICAgICAgICAgIGV4Y2x1ZGVUYWdzOiBvcHRpb25zLmV4Y2x1ZGVUYWdzLFxuICAgICAgICAgIHRhZ01hdGNoTW9kZTogb3B0aW9ucy50YWdNYXRjaE1vZGUsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmICh3b3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc3RhdGVFbC5zZXRUZXh0KCdObyB3b3JkcyBmb3VuZCBmb3IgdGhpcyBlbWJlZGRlZCBjbG91ZC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBzZXJ2aWNlcy5kcmF3V29yZENsb3VkKHtcbiAgICAgICAgY29udGFpbmVyRWw6IGNhbnZhc0VsLFxuICAgICAgICB3b3JkcyxcbiAgICAgICAgYXJpYUxhYmVsOiAnRW1iZWRkZWQgd29yZCBjbG91ZCcsXG4gICAgICAgIG9uUHJvZ3Jlc3M6IHVwZGF0ZVByb2dyZXNzLFxuICAgICAgICBvblJlZnJlc2g6ICgpID0+IHJlbmRlcihzb3VyY2UsIGVsLCBjdHgpLFxuICAgICAgICBvbkV4Y2x1ZGVJbkNsb3VkOiBhc3luYyAod29yZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNoYW5nZWQgPSBhd2FpdCB1cGRhdGVFbWJlZGRlZENsb3VkRXhjbHVkZWRXb3JkcyhwbHVnaW4sIGN0eCwgZWwsIHNvdXJjZSwgd29yZCk7XG4gICAgICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoYEV4Y2x1ZGVkIFwiJHt3b3JkfVwiIGluIHRoaXMgY2xvdWQuYCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoYFwiJHt3b3JkfVwiIGlzIGFscmVhZHkgZXhjbHVkZWQgaW4gdGhpcyBjbG91ZC5gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uRXhjbHVkZUluVmF1bHQ6IGFzeW5jICh3b3JkKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWRkZWQgPSBhd2FpdCBzZXJ2aWNlcy5hZGRCbGFja2xpc3RXb3JkKHdvcmQpO1xuICAgICAgICAgIG5ldyBOb3RpY2UoYWRkZWQgPyBgRXhjbHVkZWQgXCIke3dvcmR9XCIgZnJvbSB3b3JkIGNsb3Vkcy5gIDogYFwiJHt3b3JkfVwiIGlzIGFscmVhZHkgZXhjbHVkZWQuYCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRWRpdDogKCkgPT4ge1xuICAgICAgICAgIG9wZW5FbWJlZGRlZFdvcmRDbG91ZEVkaXRXaXphcmQocGx1Z2luLCBzZXJ2aWNlcywgY3R4LCBlbCwgb3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIGVuYWJsZU92ZXJsYXlDb250cm9sczogdHJ1ZSxcbiAgICAgICAgZW5hYmxlVmlld3BvcnRJbnRlcmFjdGlvbjogb3B0aW9ucy5pbnRlcmFjdGlvbnMsXG4gICAgICAgIHNob3dSZWZyZXNoQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgc2hvd1pvb21Db250cm9sczogb3B0aW9ucy5pbnRlcmFjdGlvbnMsXG4gICAgICAgIHNob3dFZGl0Q29udHJvbDogdHJ1ZSxcbiAgICAgICAgb25Xb3JkQ2xpY2s6ICh3b3JkKSA9PiB7XG4gICAgICAgICAgdm9pZCBzZXJ2aWNlcy5vcGVuU2VhcmNoRm9yV29yZCh3b3JkLCBzZWFyY2hTY29wZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgc3RhdGVFbC5yZW1vdmUoKTtcbiAgICAgIHJlZ2lzdGVyRW1iZWRkZWRSZXNpemVPYnNlcnZlcihlbCwgY2FudmFzRWwsICgpID0+IHJlbmRlcihzb3VyY2UsIGVsLCBjdHgpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignV29yZCBjbG91ZHM6IGZhaWxlZCB0byByZW5kZXIgZW1iZWRkZWQgY2xvdWQnLCBlcnJvcik7XG4gICAgICBzdGF0ZUVsLnNldFRleHQoJ0NvdWxkIG5vdCByZW5kZXIgZW1iZWRkZWQgd29yZCBjbG91ZC4nKTtcbiAgICB9XG4gIH07XG5cbiAgcGx1Z2luLnJlZ2lzdGVyTWFya2Rvd25Db2RlQmxvY2tQcm9jZXNzb3IoJ3dvcmRjbG91ZCcsIHJlbmRlcik7XG4gIHBsdWdpbi5yZWdpc3Rlck1hcmtkb3duQ29kZUJsb2NrUHJvY2Vzc29yKCd3b3JkLWNsb3VkJywgcmVuZGVyKTtcbiAgcGx1Z2luLnJlZ2lzdGVyRXZlbnQocGx1Z2luLmFwcC53b3Jrc3BhY2Uub24oJ2VkaXRvci1jaGFuZ2UnLCAoX2VkaXRvciwgdmlldykgPT4ge1xuICAgIGlmICghKHZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXcpIHx8ICF2aWV3LmZpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzY2hlZHVsZVNvdXJjZVBhdGhSZWZyZXNoKHZpZXcuZmlsZS5wYXRoKTtcbiAgfSkpO1xuICBwbHVnaW4ucmVnaXN0ZXIoKCkgPT4ge1xuICAgIGZvciAoY29uc3QgdGltZXJJZCBvZiBzb3VyY2VQYXRoUmVmcmVzaFRpbWVycy52YWx1ZXMoKSkge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgc291cmNlUGF0aFJlZnJlc2hUaW1lcnMuY2xlYXIoKTtcbiAgICBlbWJlZGRlZENsb3Vkc0J5U291cmNlUGF0aC5jbGVhcigpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUN1cnJlbnRGaWxlKHBsdWdpbjogUGx1Z2luLCBjdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQpOiBURmlsZSB8IG51bGwge1xuICBjb25zdCBmcm9tQ29udGV4dCA9IHBsdWdpbi5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGN0eC5zb3VyY2VQYXRoKTtcbiAgcmV0dXJuIGZyb21Db250ZXh0IGluc3RhbmNlb2YgVEZpbGUgPyBmcm9tQ29udGV4dCA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVTcGVjaWZpY0ZpbGUocGx1Z2luOiBQbHVnaW4sIGZpbGVQYXRoOiBzdHJpbmcpOiBURmlsZSB8IG51bGwge1xuICBjb25zdCBub3JtYWxpemVkUGF0aCA9IGZpbGVQYXRoLnRyaW0oKTtcbiAgaWYgKCFub3JtYWxpemVkUGF0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgcmVzb2x2ZWQgPSBwbHVnaW4uYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChub3JtYWxpemVkUGF0aCk7XG4gIHJldHVybiByZXNvbHZlZCBpbnN0YW5jZW9mIFRGaWxlID8gcmVzb2x2ZWQgOiBudWxsO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlU291cmNlU2NvcGUoXG4gIHBsdWdpbjogUGx1Z2luLFxuICBjdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsXG4gIG9wdGlvbnM6IEVtYmVkZGVkV29yZENsb3VkT3B0aW9ucyxcbik6IFNvdXJjZVNjb3BlIHtcbiAgaWYgKG9wdGlvbnMuc2NvcGUgPT09ICdmaWxlJykge1xuICAgIGNvbnN0IGZpbGUgPSBvcHRpb25zLnNwZWNpZmljRmlsZVBhdGhcbiAgICAgID8gcmVzb2x2ZVNwZWNpZmljRmlsZShwbHVnaW4sIG9wdGlvbnMuc3BlY2lmaWNGaWxlUGF0aClcbiAgICAgIDogcmVzb2x2ZUN1cnJlbnRGaWxlKHBsdWdpbiwgY3R4KTtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogJ2FjdGl2ZS1maWxlJyxcbiAgICAgIGFjdGl2ZUZpbGVQYXRoOiBmaWxlPy5wYXRoID8/ICcnLFxuICAgICAgZm9sZGVyUGF0aHM6IFtdLFxuICAgIH07XG4gIH1cblxuICBpZiAob3B0aW9ucy5zY29wZSA9PT0gJ2ZvbGRlcicpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogJ2ZvbGRlcicsXG4gICAgICBhY3RpdmVGaWxlUGF0aDogJycsXG4gICAgICBmb2xkZXJQYXRoczogWy4uLm9wdGlvbnMuZm9sZGVyUGF0aHNdLFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG1vZGU6ICd2YXVsdCcsXG4gICAgYWN0aXZlRmlsZVBhdGg6ICcnLFxuICAgIGZvbGRlclBhdGhzOiBbXSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2VPcHRpb25zKHNvdXJjZTogc3RyaW5nKTogRW1iZWRkZWRXb3JkQ2xvdWRPcHRpb25zIHtcbiAgY29uc3Qgb3B0aW9uczogRW1iZWRkZWRXb3JkQ2xvdWRPcHRpb25zID0geyAuLi5ERUZBVUxUX09QVElPTlMgfTtcbiAgbGV0IHNjb3BlV2FzRXhwbGljaXRseVNldCA9IGZhbHNlO1xuICBjb25zdCBsaW5lcyA9IHNvdXJjZS5zcGxpdCgnXFxuJyk7XG5cbiAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgY29uc3QgdHJpbW1lZCA9IGxpbmUudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCB8fCB0cmltbWVkLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSB0cmltbWVkLmluZGV4T2YoJzonKTtcbiAgICBpZiAoc2VwYXJhdG9ySW5kZXggPT09IC0xKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCByYXdLZXkgPSB0cmltbWVkLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCByYXdWYWx1ZSA9IHRyaW1tZWQuc2xpY2Uoc2VwYXJhdG9ySW5kZXggKyAxKS50cmltKCk7XG5cbiAgICBpZiAocmF3S2V5ID09PSAnc2NvcGUnKSB7XG4gICAgICBjb25zdCBwYXJzZWRTY29wZSA9IHBhcnNlU2NvcGVPcHRpb24ocmF3VmFsdWUpO1xuICAgICAgaWYgKHBhcnNlZFNjb3BlKSB7XG4gICAgICAgIG9wdGlvbnMuc2NvcGUgPSBwYXJzZWRTY29wZTtcbiAgICAgICAgc2NvcGVXYXNFeHBsaWNpdGx5U2V0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdpZCcgfHwgcmF3S2V5ID09PSAnY2xvdWQtaWQnIHx8IHJhd0tleSA9PT0gJ2Nsb3VkX2lkJyB8fCByYXdLZXkgPT09ICdndWlkJykge1xuICAgICAgb3B0aW9ucy5jbG91ZElkID0gcmF3VmFsdWUudHJpbSgpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ3NpemUnKSB7XG4gICAgICBjb25zdCBwYXJzZWRTaXplID0gcGFyc2VTaXplT3B0aW9uKHJhd1ZhbHVlKTtcbiAgICAgIGlmIChwYXJzZWRTaXplKSB7XG4gICAgICAgIG9wdGlvbnMuc2l6ZSA9IHBhcnNlZFNpemU7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAnbW9kZScpIHtcbiAgICAgIGNvbnN0IHBhcnNlZFNjb3BlID0gcGFyc2VMZWdhY3lNb2RlT3B0aW9uKHJhd1ZhbHVlKTtcbiAgICAgIGlmIChwYXJzZWRTY29wZSkge1xuICAgICAgICBvcHRpb25zLnNjb3BlID0gcGFyc2VkU2NvcGU7XG4gICAgICAgIHNjb3BlV2FzRXhwbGljaXRseVNldCA9IHRydWU7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAndGFncycgfHwgcmF3S2V5ID09PSAnaW5jbHVkZS10YWdzJyB8fCByYXdLZXkgPT09ICdpbmNsdWRlX3RhZ3MnKSB7XG4gICAgICBvcHRpb25zLmluY2x1ZGVUYWdzID0gcGFyc2VUYWdMaXN0KHJhd1ZhbHVlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdleGNsdWRlLXRhZ3MnIHx8IHJhd0tleSA9PT0gJ2V4Y2x1ZGVfdGFncycpIHtcbiAgICAgIG9wdGlvbnMuZXhjbHVkZVRhZ3MgPSBwYXJzZVRhZ0xpc3QocmF3VmFsdWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ21hdGNoJyB8fCByYXdLZXkgPT09ICd0YWctbWF0Y2gnIHx8IHJhd0tleSA9PT0gJ3RhZ19tYXRjaCcpIHtcbiAgICAgIG9wdGlvbnMudGFnTWF0Y2hNb2RlID0gcmF3VmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCkgPT09ICdhbGwnID8gJ2FsbCcgOiAnYW55JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdmb2xkZXItcGF0aHMnIHx8IHJhd0tleSA9PT0gJ2ZvbGRlcl9wYXRocycgfHwgcmF3S2V5ID09PSAnZm9sZGVycycpIHtcbiAgICAgIG9wdGlvbnMuZm9sZGVyUGF0aHMgPSBwYXJzZUxpc3QocmF3VmFsdWUpO1xuICAgICAgaWYgKCFzY29wZVdhc0V4cGxpY2l0bHlTZXQpIHtcbiAgICAgICAgb3B0aW9ucy5zY29wZSA9ICdmb2xkZXInO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ2Zyb250bWF0dGVyLXJ1bGVzJyB8fCByYXdLZXkgPT09ICdmcm9udG1hdHRlcl9ydWxlcycpIHtcbiAgICAgIG9wdGlvbnMuZnJvbnRtYXR0ZXJSdWxlcyA9IHBhcnNlRnJvbnRtYXR0ZXJSdWxlcyhyYXdWYWx1ZSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAnbWluLWNvdW50JyB8fCByYXdLZXkgPT09ICdtaW5fY291bnQnKSB7XG4gICAgICBvcHRpb25zLm1pbkNvdW50ID0gcGFyc2VGcmVxdWVuY3lDb3VudChyYXdWYWx1ZSwgb3B0aW9ucy5taW5Db3VudCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAnbWF4LWNvdW50JyB8fCByYXdLZXkgPT09ICdtYXhfY291bnQnKSB7XG4gICAgICBvcHRpb25zLm1heENvdW50ID0gcGFyc2VGcmVxdWVuY3lDb3VudChyYXdWYWx1ZSwgb3B0aW9ucy5tYXhDb3VudCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICByYXdLZXkgPT09ICdleGNsdWRlJ1xuICAgICAgfHwgcmF3S2V5ID09PSAnZXhjbHVkZS13b3JkcydcbiAgICAgIHx8IHJhd0tleSA9PT0gJ2V4Y2x1ZGVfd29yZHMnXG4gICAgICB8fCByYXdLZXkgPT09ICdleGNsdWRlZC13b3JkcydcbiAgICApIHtcbiAgICAgIG9wdGlvbnMuZXhjbHVkZVdvcmRzID0gcmF3VmFsdWVcbiAgICAgICAgLnNwbGl0KCcsJylcbiAgICAgICAgLm1hcCgodmFsdWUpID0+IG5vcm1hbGl6ZVdvcmQodmFsdWUpKVxuICAgICAgICAuZmlsdGVyKCh2YWx1ZSwgaW5kZXgsIGFycikgPT4gdmFsdWUubGVuZ3RoID4gMCAmJiBhcnIuaW5kZXhPZih2YWx1ZSkgPT09IGluZGV4KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdoZWlnaHQnKSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBOdW1iZXIucGFyc2VJbnQocmF3VmFsdWUsIDEwKTtcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcbiAgICAgICAgb3B0aW9ucy5zaXplID0gc2l6ZUZyb21IZWlnaHQocGFyc2VkKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdpbnRlcmFjdGlvbnMnIHx8IHJhd0tleSA9PT0gJ2ludGVyYWN0YWJsZScgfHwgcmF3S2V5ID09PSAnY29udHJvbHMnKSB7XG4gICAgICBvcHRpb25zLmludGVyYWN0aW9ucyA9IHBhcnNlQm9vbGVhbk9wdGlvbihyYXdWYWx1ZSwgdHJ1ZSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAnZmlsZScgfHwgcmF3S2V5ID09PSAnbm90ZScgfHwgcmF3S2V5ID09PSAncGF0aCcgfHwgcmF3S2V5ID09PSAnZmlsZW5hbWUnKSB7XG4gICAgICBvcHRpb25zLnNwZWNpZmljRmlsZVBhdGggPSByYXdWYWx1ZTtcbiAgICAgIGlmICghc2NvcGVXYXNFeHBsaWNpdGx5U2V0KSB7XG4gICAgICAgIG9wdGlvbnMuc2NvcGUgPSAnZmlsZSc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3B0aW9ucy5leGNsdWRlVGFncyA9IG9wdGlvbnMuZXhjbHVkZVRhZ3MuZmlsdGVyKCh0YWcpID0+ICFvcHRpb25zLmluY2x1ZGVUYWdzLmluY2x1ZGVzKHRhZykpO1xuICBvcHRpb25zLm1pbkNvdW50ID0gTWF0aC5taW4ob3B0aW9ucy5taW5Db3VudCwgb3B0aW9ucy5tYXhDb3VudCk7XG4gIG9wdGlvbnMubWF4Q291bnQgPSBNYXRoLm1heChvcHRpb25zLm1pbkNvdW50LCBvcHRpb25zLm1heENvdW50KTtcblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gcGFyc2VTY29wZU9wdGlvbih2YWx1ZTogc3RyaW5nKTogRW1iZWRkZWRXb3JkQ2xvdWRTY29wZSB8IG51bGwge1xuICBjb25zdCBub3JtYWxpemVkID0gdmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvW1xcc19dKy9nLCAnLScpO1xuICBpZiAobm9ybWFsaXplZCA9PT0gJ3ZhdWx0Jykge1xuICAgIHJldHVybiAndmF1bHQnO1xuICB9XG5cbiAgaWYgKG5vcm1hbGl6ZWQgPT09ICdmb2xkZXInIHx8IG5vcm1hbGl6ZWQgPT09ICdmb2xkZXJzJykge1xuICAgIHJldHVybiAnZm9sZGVyJztcbiAgfVxuXG4gIGlmIChub3JtYWxpemVkID09PSAnZmlsZScgfHwgbm9ybWFsaXplZCA9PT0gJ25vdGUnIHx8IG5vcm1hbGl6ZWQgPT09ICdjdXJyZW50LW5vdGUnIHx8IG5vcm1hbGl6ZWQgPT09ICdjdXJyZW50LWZpbGUnKSB7XG4gICAgcmV0dXJuICdmaWxlJztcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBwYXJzZVNpemVPcHRpb24odmFsdWU6IHN0cmluZyk6IEVtYmVkZGVkV29yZENsb3VkU2l6ZSB8IG51bGwge1xuICBjb25zdCBub3JtYWxpemVkID0gdmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChub3JtYWxpemVkID09PSAnc21hbGwnIHx8IG5vcm1hbGl6ZWQgPT09ICdtZWRpdW0nIHx8IG5vcm1hbGl6ZWQgPT09ICdsYXJnZScpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplZDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VMZWdhY3lNb2RlT3B0aW9uKHZhbHVlOiBzdHJpbmcpOiBFbWJlZGRlZFdvcmRDbG91ZFNjb3BlIHwgbnVsbCB7XG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSB2YWx1ZS50cmltKCkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bXFxzX10rL2csICctJyk7XG5cbiAgaWYgKFxuICAgIG5vcm1hbGl6ZWQgPT09ICdjdXJyZW50LWZpbGUnXG4gICAgfHwgbm9ybWFsaXplZCA9PT0gJ2N1cnJlbnQnXG4gICAgfHwgbm9ybWFsaXplZCA9PT0gJ2N1cnJlbnQtbm90ZSdcbiAgICB8fCBub3JtYWxpemVkID09PSAnbm90ZSdcbiAgICB8fCBub3JtYWxpemVkID09PSAnc3BlY2lmaWMtZmlsZSdcbiAgICB8fCBub3JtYWxpemVkID09PSAnc3BlY2lmaWMnXG4gICAgfHwgbm9ybWFsaXplZCA9PT0gJ2ZpbGUnXG4gICAgfHwgbm9ybWFsaXplZCA9PT0gJ25vdGUtZmlsZSdcbiAgKSB7XG4gICAgcmV0dXJuICdmaWxlJztcbiAgfVxuXG4gIGlmIChcbiAgICBub3JtYWxpemVkID09PSAndGFnLWJhc2VkJ1xuICAgIHx8IG5vcm1hbGl6ZWQgPT09ICd0YWdzJ1xuICAgIHx8IG5vcm1hbGl6ZWQgPT09ICd0YWcnXG4gICAgfHwgbm9ybWFsaXplZCA9PT0gJ3ZhdWx0J1xuICApIHtcbiAgICByZXR1cm4gJ3ZhdWx0JztcbiAgfVxuXG4gIGlmIChub3JtYWxpemVkID09PSAnZm9sZGVyJyB8fCBub3JtYWxpemVkID09PSAnZm9sZGVycycpIHtcbiAgICByZXR1cm4gJ2ZvbGRlcic7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VUYWdMaXN0KHJhd1ZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHRhZ3MgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCB2YWx1ZSBvZiBwYXJzZUxpc3QocmF3VmFsdWUpKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVRhZyh2YWx1ZSk7XG4gICAgaWYgKG5vcm1hbGl6ZWQpIHtcbiAgICAgIHRhZ3MuYWRkKG5vcm1hbGl6ZWQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gWy4uLnRhZ3NdO1xufVxuXG5mdW5jdGlvbiBwYXJzZUxpc3QocmF3VmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgdmFsdWVzID0gcmF3VmFsdWVcbiAgICAuc3BsaXQoJywnKVxuICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS50cmltKCkpXG4gICAgLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApO1xuICByZXR1cm4gWy4uLm5ldyBTZXQodmFsdWVzKV07XG59XG5cbmZ1bmN0aW9uIHBhcnNlRnJlcXVlbmN5Q291bnQocmF3VmFsdWU6IHN0cmluZywgZmFsbGJhY2s6IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IHBhcnNlZCA9IE51bWJlci5wYXJzZUludChyYXdWYWx1ZS50cmltKCksIDEwKTtcbiAgaWYgKE51bWJlci5pc05hTihwYXJzZWQpKSB7XG4gICAgcmV0dXJuIGZhbGxiYWNrO1xuICB9XG4gIHJldHVybiBNYXRoLm1pbig5OTk5LCBNYXRoLm1heCgxLCBwYXJzZWQpKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VGcm9udG1hdHRlclJ1bGVzKHJhd1ZhbHVlOiBzdHJpbmcpOiBGcm9udG1hdHRlclJ1bGVbXSB7XG4gIGNvbnN0IHJ1bGVzOiBGcm9udG1hdHRlclJ1bGVbXSA9IFtdO1xuICBjb25zdCBlbnRyaWVzID0gcmF3VmFsdWVcbiAgICAuc3BsaXQoJzsnKVxuICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS50cmltKCkpXG4gICAgLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApO1xuXG4gIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgIGNvbnN0IHBhcnRzID0gZW50cnkuc3BsaXQoJ3wnKS5tYXAoKHBhcnQpID0+IHBhcnQudHJpbSgpKTtcbiAgICBjb25zdCBrZXkgPSBwYXJ0c1swXSA/PyAnJztcbiAgICBpZiAoIWtleSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlcmF0b3IgPSBGUk9OVE1BVFRFUl9PUEVSQVRPUlMuaGFzKHBhcnRzWzFdIGFzIEZyb250bWF0dGVyT3BlcmF0b3IpXG4gICAgICA/IHBhcnRzWzFdIGFzIEZyb250bWF0dGVyT3BlcmF0b3JcbiAgICAgIDogJ2VxdWFscyc7XG4gICAgY29uc3QgdmFsdWUgPSBwYXJ0cy5zbGljZSgyKS5qb2luKCd8JykudHJpbSgpO1xuXG4gICAgaWYgKG9wZXJhdG9yID09PSAnZXhpc3RzJyB8fCBvcGVyYXRvciA9PT0gJ25vdC1leGlzdHMnKSB7XG4gICAgICBydWxlcy5wdXNoKHsga2V5LCBvcGVyYXRvciB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcnVsZXMucHVzaCh7IGtleSwgb3BlcmF0b3IsIHZhbHVlIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBydWxlcztcbn1cblxuZnVuY3Rpb24gc2l6ZUZyb21IZWlnaHQoaGVpZ2h0OiBudW1iZXIpOiBFbWJlZGRlZFdvcmRDbG91ZFNpemUge1xuICBjb25zdCBub3JtYWxpemVkID0gTWF0aC5taW4oOTAwLCBNYXRoLm1heCgxODAsIGhlaWdodCkpO1xuICBpZiAobm9ybWFsaXplZCA8PSAyODApIHtcbiAgICByZXR1cm4gJ3NtYWxsJztcbiAgfVxuICBpZiAobm9ybWFsaXplZCA8PSAzODApIHtcbiAgICByZXR1cm4gJ21lZGl1bSc7XG4gIH1cbiAgcmV0dXJuICdsYXJnZSc7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQm9vbGVhbk9wdGlvbih2YWx1ZTogc3RyaW5nLCBmYWxsYmFjazogYm9vbGVhbik6IGJvb2xlYW4ge1xuICBjb25zdCBub3JtYWxpemVkID0gdmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChub3JtYWxpemVkID09PSAndHJ1ZScgfHwgbm9ybWFsaXplZCA9PT0gJ3llcycgfHwgbm9ybWFsaXplZCA9PT0gJ29uJyB8fCBub3JtYWxpemVkID09PSAnMScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobm9ybWFsaXplZCA9PT0gJ2ZhbHNlJyB8fCBub3JtYWxpemVkID09PSAnbm8nIHx8IG5vcm1hbGl6ZWQgPT09ICdvZmYnIHx8IG5vcm1hbGl6ZWQgPT09ICcwJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gZmFsbGJhY2s7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRW1iZWRkZWRSZXNpemVPYnNlcnZlcihcbiAgaG9zdEVsOiBIVE1MRWxlbWVudCxcbiAgY2FudmFzRWw6IEhUTUxEaXZFbGVtZW50LFxuICByZXJlbmRlcjogKCkgPT4gdm9pZCxcbik6IHZvaWQge1xuICBpZiAodHlwZW9mIFJlc2l6ZU9ic2VydmVyID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlOiBFbWJlZGRlZFJlbmRlclN0YXRlID0ge1xuICAgIG9ic2VydmVyOiBuZXcgUmVzaXplT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gZW50cmllc1swXTtcbiAgICAgIGlmICghZW50cnkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXh0V2lkdGggPSBNYXRoLnJvdW5kKGVudHJ5LmNvbnRlbnRSZWN0LndpZHRoKTtcbiAgICAgIGNvbnN0IG5leHRIZWlnaHQgPSBNYXRoLnJvdW5kKGVudHJ5LmNvbnRlbnRSZWN0LmhlaWdodCk7XG4gICAgICBpZiAobmV4dFdpZHRoIDw9IDAgfHwgbmV4dEhlaWdodCA8PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0V2lkdGggPT09IHN0YXRlLmxhc3RXaWR0aCAmJiBuZXh0SGVpZ2h0ID09PSBzdGF0ZS5sYXN0SGVpZ2h0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3RhdGUubGFzdFdpZHRoID0gbmV4dFdpZHRoO1xuICAgICAgc3RhdGUubGFzdEhlaWdodCA9IG5leHRIZWlnaHQ7XG5cbiAgICAgIGlmIChzdGF0ZS5yZXJlbmRlclRpbWVyICE9PSBudWxsKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoc3RhdGUucmVyZW5kZXJUaW1lcik7XG4gICAgICB9XG4gICAgICBzdGF0ZS5yZXJlbmRlclRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzdGF0ZS5yZXJlbmRlclRpbWVyID0gbnVsbDtcbiAgICAgICAgcmVyZW5kZXIoKTtcbiAgICAgIH0sIEVNQkVEX1JFU0laRV9ERUJPVU5DRV9NUyk7XG4gICAgfSksXG4gICAgcmVyZW5kZXJUaW1lcjogbnVsbCxcbiAgICBsYXN0V2lkdGg6IE1hdGgucm91bmQoY2FudmFzRWwuY2xpZW50V2lkdGgpLFxuICAgIGxhc3RIZWlnaHQ6IE1hdGgucm91bmQoY2FudmFzRWwuY2xpZW50SGVpZ2h0KSxcbiAgfTtcblxuICBzdGF0ZS5vYnNlcnZlci5vYnNlcnZlKGNhbnZhc0VsKTtcbiAgZW1iZWRkZWRSZW5kZXJTdGF0ZXMuc2V0KGhvc3RFbCwgc3RhdGUpO1xufVxuXG5mdW5jdGlvbiBjbGVhbnVwRW1iZWRkZWRSZW5kZXJTdGF0ZShob3N0RWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gIGNvbnN0IHN0YXRlID0gZW1iZWRkZWRSZW5kZXJTdGF0ZXMuZ2V0KGhvc3RFbCk7XG4gIGlmICghc3RhdGUpIHtcbiAgICBjbGVhbnVwRW1iZWRkZWRDbG91ZEluc3RhbmNlKGhvc3RFbCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGUub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICBpZiAoc3RhdGUucmVyZW5kZXJUaW1lciAhPT0gbnVsbCkge1xuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoc3RhdGUucmVyZW5kZXJUaW1lcik7XG4gIH1cbiAgZW1iZWRkZWRSZW5kZXJTdGF0ZXMuZGVsZXRlKGhvc3RFbCk7XG4gIGNsZWFudXBFbWJlZGRlZENsb3VkSW5zdGFuY2UoaG9zdEVsKTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJFbWJlZGRlZENsb3VkSW5zdGFuY2UoaG9zdEVsOiBIVE1MRWxlbWVudCwgc291cmNlUGF0aDogc3RyaW5nLCByZXJlbmRlcjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICBjbGVhbnVwRW1iZWRkZWRDbG91ZEluc3RhbmNlKGhvc3RFbCk7XG5cbiAgZW1iZWRkZWRDbG91ZEluc3RhbmNlcy5zZXQoaG9zdEVsLCB7IHNvdXJjZVBhdGgsIHJlcmVuZGVyIH0pO1xuICBsZXQgaG9zdHMgPSBlbWJlZGRlZENsb3Vkc0J5U291cmNlUGF0aC5nZXQoc291cmNlUGF0aCk7XG4gIGlmICghaG9zdHMpIHtcbiAgICBob3N0cyA9IG5ldyBTZXQ8SFRNTEVsZW1lbnQ+KCk7XG4gICAgZW1iZWRkZWRDbG91ZHNCeVNvdXJjZVBhdGguc2V0KHNvdXJjZVBhdGgsIGhvc3RzKTtcbiAgfVxuICBob3N0cy5hZGQoaG9zdEVsKTtcbn1cblxuZnVuY3Rpb24gY2xlYW51cEVtYmVkZGVkQ2xvdWRJbnN0YW5jZShob3N0RWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gIGNvbnN0IGluc3RhbmNlID0gZW1iZWRkZWRDbG91ZEluc3RhbmNlcy5nZXQoaG9zdEVsKTtcbiAgaWYgKCFpbnN0YW5jZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGhvc3RzID0gZW1iZWRkZWRDbG91ZHNCeVNvdXJjZVBhdGguZ2V0KGluc3RhbmNlLnNvdXJjZVBhdGgpO1xuICBpZiAoaG9zdHMpIHtcbiAgICBob3N0cy5kZWxldGUoaG9zdEVsKTtcbiAgICBpZiAoaG9zdHMuc2l6ZSA9PT0gMCkge1xuICAgICAgZW1iZWRkZWRDbG91ZHNCeVNvdXJjZVBhdGguZGVsZXRlKGluc3RhbmNlLnNvdXJjZVBhdGgpO1xuICAgIH1cbiAgfVxuICBlbWJlZGRlZENsb3VkSW5zdGFuY2VzLmRlbGV0ZShob3N0RWwpO1xufVxuXG5mdW5jdGlvbiBzY2hlZHVsZVNvdXJjZVBhdGhSZWZyZXNoKHNvdXJjZVBhdGg6IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCBleGlzdGluZ1RpbWVyID0gc291cmNlUGF0aFJlZnJlc2hUaW1lcnMuZ2V0KHNvdXJjZVBhdGgpO1xuICBpZiAoZXhpc3RpbmdUaW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgd2luZG93LmNsZWFyVGltZW91dChleGlzdGluZ1RpbWVyKTtcbiAgfVxuXG4gIGNvbnN0IHRpbWVySWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgc291cmNlUGF0aFJlZnJlc2hUaW1lcnMuZGVsZXRlKHNvdXJjZVBhdGgpO1xuICAgIHJlcmVuZGVyRW1iZWRkZWRDbG91ZHNGb3JTb3VyY2VQYXRoKHNvdXJjZVBhdGgpO1xuICB9LCBFTUJFRF9DT05URU5UX0NIQU5HRV9ERUJPVU5DRV9NUyk7XG4gIHNvdXJjZVBhdGhSZWZyZXNoVGltZXJzLnNldChzb3VyY2VQYXRoLCB0aW1lcklkKTtcbn1cblxuZnVuY3Rpb24gcmVyZW5kZXJFbWJlZGRlZENsb3Vkc0ZvclNvdXJjZVBhdGgoc291cmNlUGF0aDogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IGhvc3RzID0gZW1iZWRkZWRDbG91ZHNCeVNvdXJjZVBhdGguZ2V0KHNvdXJjZVBhdGgpO1xuICBpZiAoIWhvc3RzIHx8IGhvc3RzLnNpemUgPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IGhvc3RFbCBvZiBbLi4uaG9zdHNdKSB7XG4gICAgaWYgKCFob3N0RWwuaXNDb25uZWN0ZWQpIHtcbiAgICAgIGNsZWFudXBFbWJlZGRlZENsb3VkSW5zdGFuY2UoaG9zdEVsKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGluc3RhbmNlID0gZW1iZWRkZWRDbG91ZEluc3RhbmNlcy5nZXQoaG9zdEVsKTtcbiAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICBob3N0cy5kZWxldGUoaG9zdEVsKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGluc3RhbmNlLnJlcmVuZGVyKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gb3BlbkVtYmVkZGVkV29yZENsb3VkRWRpdFdpemFyZChcbiAgcGx1Z2luOiBQbHVnaW4sXG4gIHNlcnZpY2VzOiBXb3JkQ2xvdWRTZXJ2aWNlcyxcbiAgY3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LFxuICBob3N0RWw6IEhUTUxFbGVtZW50LFxuICBvcHRpb25zOiBFbWJlZGRlZFdvcmRDbG91ZE9wdGlvbnMsXG4pOiB2b2lkIHtcbiAgbmV3IEVtYmVkV29yZENsb3VkTW9kYWwoXG4gICAgcGx1Z2luLmFwcCxcbiAgICBzZXJ2aWNlcyxcbiAgICBhc3luYyAoZW1iZWRCbG9jaykgPT4gdXBkYXRlRW1iZWRkZWRDb2RlQmxvY2socGx1Z2luLCBjdHgsIGhvc3RFbCwgZW1iZWRCbG9jaywgb3B0aW9ucy5jbG91ZElkKSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0VkaXQgZW1iZWRkZWQgd29yZCBjbG91ZCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VwZGF0ZSBvcHRpb25zIGZvciB0aGlzIGVtYmVkZGVkIGNsb3VkIHdpdGhvdXQgZWRpdGluZyBtYXJrZG93biBtYW51YWxseS4nLFxuICAgICAgc3VibWl0QnV0dG9uVGV4dDogJ0FwcGx5JyxcbiAgICAgIGluaXRpYWxTdGF0ZToge1xuICAgICAgICBjbG91ZElkOiBvcHRpb25zLmNsb3VkSWQsXG4gICAgICAgIHNjb3BlOiBvcHRpb25zLnNjb3BlLFxuICAgICAgICBzaXplOiBvcHRpb25zLnNpemUsXG4gICAgICAgIHNwZWNpZmljRmlsZVBhdGg6IG9wdGlvbnMuc3BlY2lmaWNGaWxlUGF0aCA/PyAnJyxcbiAgICAgICAgaW5jbHVkZVRhZ3NSYXc6IG9wdGlvbnMuaW5jbHVkZVRhZ3Muam9pbignLCAnKSxcbiAgICAgICAgZXhjbHVkZVRhZ3NSYXc6IG9wdGlvbnMuZXhjbHVkZVRhZ3Muam9pbignLCAnKSxcbiAgICAgICAgdGFnTWF0Y2hNb2RlOiBvcHRpb25zLnRhZ01hdGNoTW9kZSxcbiAgICAgICAgZm9sZGVyUGF0aHNSYXc6IG9wdGlvbnMuZm9sZGVyUGF0aHMuam9pbignLCAnKSxcbiAgICAgICAgZnJvbnRtYXR0ZXJSdWxlc1Jhdzogb3B0aW9ucy5mcm9udG1hdHRlclJ1bGVzXG4gICAgICAgICAgLm1hcCgocnVsZSkgPT4gYCR7cnVsZS5rZXl9fCR7cnVsZS5vcGVyYXRvcn18JHtydWxlLnZhbHVlID8/ICcnfWApXG4gICAgICAgICAgLmpvaW4oJzsgJyksXG4gICAgICAgIG1pbkNvdW50UmF3OiBgJHtvcHRpb25zLm1pbkNvdW50fWAsXG4gICAgICAgIG1heENvdW50UmF3OiBgJHtvcHRpb25zLm1heENvdW50fWAsXG4gICAgICB9LFxuICAgIH0sXG4gICkub3BlbigpO1xufVxuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVFbWJlZGRlZENvZGVCbG9jayhcbiAgcGx1Z2luOiBQbHVnaW4sXG4gIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCxcbiAgaG9zdEVsOiBIVE1MRWxlbWVudCxcbiAgZW1iZWRCbG9jazogc3RyaW5nLFxuICBjbG91ZElkPzogc3RyaW5nLFxuKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIGNvbnN0IHNvdXJjZUZpbGUgPSByZXNvbHZlQ3VycmVudEZpbGUocGx1Z2luLCBjdHgpO1xuICBpZiAoIXNvdXJjZUZpbGUpIHtcbiAgICBuZXcgTm90aWNlKCdDb3VsZCBub3QgbG9jYXRlIHRoZSBzb3VyY2Ugbm90ZSBmb3IgdGhpcyBlbWJlZGRlZCB3b3JkIGNsb3VkLicpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGxldCB1cGRhdGVkID0gZmFsc2U7XG4gIGF3YWl0IHBsdWdpbi5hcHAudmF1bHQucHJvY2Vzcyhzb3VyY2VGaWxlLCAoY29udGVudCkgPT4ge1xuICAgIGNvbnN0IGJ5SWQgPSBjbG91ZElkXG4gICAgICA/IHJlcGxhY2VXb3JkQ2xvdWRCbG9ja0J5SWQoY29udGVudCwgY2xvdWRJZCwgZW1iZWRCbG9jaylcbiAgICAgIDogbnVsbDtcbiAgICBpZiAoYnlJZCAhPT0gbnVsbCkge1xuICAgICAgdXBkYXRlZCA9IHRydWU7XG4gICAgICByZXR1cm4gYnlJZDtcbiAgICB9XG5cbiAgICBjb25zdCBzZWN0aW9uID0gY3R4LmdldFNlY3Rpb25JbmZvKGhvc3RFbCk7XG4gICAgaWYgKCFzZWN0aW9uKSB7XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICB1cGRhdGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gcmVwbGFjZVNlY3Rpb25XaXRoQmxvY2soY29udGVudCwgc2VjdGlvbi5saW5lU3RhcnQsIHNlY3Rpb24ubGluZUVuZCwgZW1iZWRCbG9jayk7XG4gIH0pO1xuICBpZiAoIXVwZGF0ZWQpIHtcbiAgICBuZXcgTm90aWNlKCdDb3VsZCBub3QgbG9jYXRlIHRoZSBlbWJlZGRlZCB3b3JkIGNsb3VkIGJsb2NrIHRvIHVwZGF0ZS4nKTtcbiAgfVxuICByZXR1cm4gdXBkYXRlZDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlRW1iZWRkZWRDbG91ZEV4Y2x1ZGVkV29yZHMoXG4gIHBsdWdpbjogUGx1Z2luLFxuICBjdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsXG4gIGhvc3RFbDogSFRNTEVsZW1lbnQsXG4gIHNvdXJjZTogc3RyaW5nLFxuICB3b3JkOiBzdHJpbmcsXG4pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3Qgbm9ybWFsaXplZFdvcmQgPSBub3JtYWxpemVXb3JkKHdvcmQpO1xuICBpZiAoIW5vcm1hbGl6ZWRXb3JkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdXBkYXRlZFNvdXJjZSA9IGFkZEV4Y2x1ZGVkV29yZFRvRW1iZWRkZWRTb3VyY2Uoc291cmNlLCBub3JtYWxpemVkV29yZCk7XG4gIGlmICh1cGRhdGVkU291cmNlID09PSBzb3VyY2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBlbWJlZEJsb2NrID0gYnVpbGRXb3JkQ2xvdWRDb2RlQmxvY2sodXBkYXRlZFNvdXJjZSk7XG4gIHJldHVybiB1cGRhdGVFbWJlZGRlZENvZGVCbG9jayhwbHVnaW4sIGN0eCwgaG9zdEVsLCBlbWJlZEJsb2NrLCBleHRyYWN0Q2xvdWRJZEZyb21Tb3VyY2UodXBkYXRlZFNvdXJjZSkpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlU2VjdGlvbldpdGhCbG9jayhjb250ZW50OiBzdHJpbmcsIGxpbmVTdGFydDogbnVtYmVyLCBsaW5lRW5kOiBudW1iZXIsIGVtYmVkQmxvY2s6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XG4gIGlmIChsaW5lU3RhcnQgPCAwIHx8IGxpbmVFbmQgPCBsaW5lU3RhcnQgfHwgbGluZVN0YXJ0ID49IGxpbmVzLmxlbmd0aCkge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgY29uc3QgcmVwbGFjZW1lbnRMaW5lcyA9IGVtYmVkQmxvY2sucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG4gIGNvbnN0IGJlZm9yZSA9IGxpbmVzLnNsaWNlKDAsIGxpbmVTdGFydCk7XG4gIGNvbnN0IGFmdGVyID0gbGluZXMuc2xpY2UobGluZUVuZCArIDEpO1xuICByZXR1cm4gWy4uLmJlZm9yZSwgLi4ucmVwbGFjZW1lbnRMaW5lcywgLi4uYWZ0ZXJdLmpvaW4oJ1xcbicpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlV29yZENsb3VkQmxvY2tCeUlkKGNvbnRlbnQ6IHN0cmluZywgY2xvdWRJZDogc3RyaW5nLCBlbWJlZEJsb2NrOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgdGFyZ2V0SWQgPSBjbG91ZElkLnRyaW0oKTtcbiAgaWYgKCF0YXJnZXRJZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IGZlbmNlID0gbGluZXNbaV0/LnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChmZW5jZSAhPT0gJ2BgYHdvcmRjbG91ZCcgJiYgZmVuY2UgIT09ICdgYGB3b3JkLWNsb3VkJykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgbGV0IGVuZCA9IGkgKyAxO1xuICAgIHdoaWxlIChlbmQgPCBsaW5lcy5sZW5ndGggJiYgbGluZXNbZW5kXT8udHJpbSgpICE9PSAnYGBgJykge1xuICAgICAgZW5kICs9IDE7XG4gICAgfVxuICAgIGlmIChlbmQgPj0gbGluZXMubGVuZ3RoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2UgPSBsaW5lcy5zbGljZShpICsgMSwgZW5kKS5qb2luKCdcXG4nKTtcbiAgICBjb25zdCBibG9ja0lkID0gZXh0cmFjdENsb3VkSWRGcm9tU291cmNlKHNvdXJjZSk7XG4gICAgaWYgKGJsb2NrSWQgIT09IHRhcmdldElkKSB7XG4gICAgICBpID0gZW5kO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgcmVwbGFjZW1lbnRMaW5lcyA9IGVtYmVkQmxvY2sucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG4gICAgY29uc3QgYmVmb3JlID0gbGluZXMuc2xpY2UoMCwgaSk7XG4gICAgY29uc3QgYWZ0ZXIgPSBsaW5lcy5zbGljZShlbmQgKyAxKTtcbiAgICByZXR1cm4gWy4uLmJlZm9yZSwgLi4ucmVwbGFjZW1lbnRMaW5lcywgLi4uYWZ0ZXJdLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RDbG91ZElkRnJvbVNvdXJjZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGxpbmVzID0gc291cmNlLnNwbGl0KCdcXG4nKTtcbiAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBpZiAoc2VwYXJhdG9ySW5kZXggPT09IC0xKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBrZXkgPSBsaW5lLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoa2V5ICE9PSAnaWQnICYmIGtleSAhPT0gJ2Nsb3VkLWlkJyAmJiBrZXkgIT09ICdjbG91ZF9pZCcgJiYga2V5ICE9PSAnZ3VpZCcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJldHVybiBsaW5lLnNsaWNlKHNlcGFyYXRvckluZGV4ICsgMSkudHJpbSgpO1xuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBhZGRFeGNsdWRlZFdvcmRUb0VtYmVkZGVkU291cmNlKHNvdXJjZTogc3RyaW5nLCB3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBsaW5lcyA9IHNvdXJjZS5yZXBsYWNlKC9cXG4kLywgJycpLnNwbGl0KCdcXG4nKTtcbiAgY29uc3QgZXhjbHVkZWQgPSBleHRyYWN0RXhjbHVkZWRXb3JkcyhsaW5lcyk7XG5cbiAgaWYgKGV4Y2x1ZGVkLmluY2x1ZGVzKHdvcmQpKSB7XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIGNvbnN0IG5leHRFeGNsdWRlZCA9IFsuLi5leGNsdWRlZCwgd29yZF07XG4gIGNvbnN0IHJlcGxhY2VtZW50TGluZSA9IGBleGNsdWRlLXdvcmRzOiAke25leHRFeGNsdWRlZC5qb2luKCcsICcpfWA7XG4gIGNvbnN0IGV4aXN0aW5nTGluZUluZGV4ID0gbGluZXMuZmluZEluZGV4KChsaW5lKSA9PiB7XG4gICAgY29uc3Qga2V5ID0gZ2V0T3B0aW9uS2V5KGxpbmUpO1xuICAgIHJldHVybiBrZXkgPT09ICdleGNsdWRlJyB8fCBrZXkgPT09ICdleGNsdWRlLXdvcmRzJyB8fCBrZXkgPT09ICdleGNsdWRlX3dvcmRzJyB8fCBrZXkgPT09ICdleGNsdWRlZC13b3Jkcyc7XG4gIH0pO1xuXG4gIGlmIChleGlzdGluZ0xpbmVJbmRleCA+PSAwKSB7XG4gICAgbGluZXNbZXhpc3RpbmdMaW5lSW5kZXhdID0gcmVwbGFjZW1lbnRMaW5lO1xuICB9IGVsc2Uge1xuICAgIGxpbmVzLnB1c2gocmVwbGFjZW1lbnRMaW5lKTtcbiAgfVxuXG4gIHJldHVybiBgJHtsaW5lcy5qb2luKCdcXG4nKX1cXG5gO1xufVxuXG5mdW5jdGlvbiBidWlsZFdvcmRDbG91ZENvZGVCbG9jayhzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSBzb3VyY2UucmVwbGFjZSgvXFxuJC8sICcnKTtcbiAgcmV0dXJuIGBcXGBcXGBcXGB3b3JkY2xvdWRcXG4ke3RyaW1tZWR9XFxuXFxgXFxgXFxgYDtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdEV4Y2x1ZGVkV29yZHMobGluZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICBjb25zdCBlbnRyaWVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xuICAgIGNvbnN0IHNlcGFyYXRvckluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgaWYgKHNlcGFyYXRvckluZGV4ID09PSAtMSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qga2V5ID0gbGluZS5zbGljZSgwLCBzZXBhcmF0b3JJbmRleCkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKGtleSAhPT0gJ2V4Y2x1ZGUnICYmIGtleSAhPT0gJ2V4Y2x1ZGUtd29yZHMnICYmIGtleSAhPT0gJ2V4Y2x1ZGVfd29yZHMnICYmIGtleSAhPT0gJ2V4Y2x1ZGVkLXdvcmRzJykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgcmF3VmFsdWUgPSBsaW5lLnNsaWNlKHNlcGFyYXRvckluZGV4ICsgMSkudHJpbSgpO1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2YgcmF3VmFsdWUuc3BsaXQoJywnKSkge1xuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVdvcmQodmFsdWUpO1xuICAgICAgaWYgKG5vcm1hbGl6ZWQgJiYgIWVudHJpZXMuaW5jbHVkZXMobm9ybWFsaXplZCkpIHtcbiAgICAgICAgZW50cmllcy5wdXNoKG5vcm1hbGl6ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbnRyaWVzO1xufVxuXG5mdW5jdGlvbiBnZXRPcHRpb25LZXkobGluZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgaWYgKHNlcGFyYXRvckluZGV4ID09PSAtMSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJldHVybiBsaW5lLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplV29yZCh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xufVxuIiwgImltcG9ydCB7IEFwcCwgQnV0dG9uQ29tcG9uZW50LCBNb2RhbCwgTm90aWNlLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHR5cGUgeyBXb3JkQ2xvdWRTZXJ2aWNlcyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgRnJvbnRtYXR0ZXJSdWxlLCBGcm9udG1hdHRlck9wZXJhdG9yIH0gZnJvbSAnLi4vd29yZGNsb3VkL3BpcGVsaW5lL3R5cGVzJztcbmltcG9ydCB7IG5vcm1hbGl6ZVRhZyB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IHR5cGUgRW1iZWRTY29wZSA9ICdmaWxlJyB8ICd2YXVsdCcgfCAnZm9sZGVyJztcbmV4cG9ydCB0eXBlIEVtYmVkU2l6ZSA9ICdzbWFsbCcgfCAnbWVkaXVtJyB8ICdsYXJnZSc7XG5leHBvcnQgdHlwZSBFbWJlZFRhZ01hdGNoTW9kZSA9ICdhbnknIHwgJ2FsbCc7XG50eXBlIEVtYmVkU2V0dGluZ3NUYWIgPSAnZmlsdGVycycgfCAnYXBwZWFyYW5jZScgfCAnYWR2YW5jZWQnO1xuXG5leHBvcnQgdHlwZSBFbWJlZFdpemFyZFN0YXRlID0ge1xuICBjbG91ZElkOiBzdHJpbmc7XG4gIHNjb3BlOiBFbWJlZFNjb3BlO1xuICBzaXplOiBFbWJlZFNpemU7XG4gIHNwZWNpZmljRmlsZVBhdGg6IHN0cmluZztcbiAgaW5jbHVkZVRhZ3NSYXc6IHN0cmluZztcbiAgZXhjbHVkZVRhZ3NSYXc6IHN0cmluZztcbiAgdGFnTWF0Y2hNb2RlOiBFbWJlZFRhZ01hdGNoTW9kZTtcbiAgZm9sZGVyUGF0aHNSYXc6IHN0cmluZztcbiAgZnJvbnRtYXR0ZXJSdWxlc1Jhdzogc3RyaW5nO1xuICBtaW5Db3VudFJhdzogc3RyaW5nO1xuICBtYXhDb3VudFJhdzogc3RyaW5nO1xufTtcblxudHlwZSBFbWJlZFdvcmRDbG91ZE1vZGFsT3B0aW9ucyA9IHtcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBzdWJtaXRCdXR0b25UZXh0Pzogc3RyaW5nO1xuICBpbml0aWFsU3RhdGU/OiBQYXJ0aWFsPEVtYmVkV2l6YXJkU3RhdGU+O1xufTtcblxuY29uc3QgREVGQVVMVF9TVEFURTogRW1iZWRXaXphcmRTdGF0ZSA9IHtcbiAgY2xvdWRJZDogJycsXG4gIHNjb3BlOiAnZmlsZScsXG4gIHNpemU6ICdtZWRpdW0nLFxuICBzcGVjaWZpY0ZpbGVQYXRoOiAnJyxcbiAgaW5jbHVkZVRhZ3NSYXc6ICcnLFxuICBleGNsdWRlVGFnc1JhdzogJycsXG4gIHRhZ01hdGNoTW9kZTogJ2FueScsXG4gIGZvbGRlclBhdGhzUmF3OiAnJyxcbiAgZnJvbnRtYXR0ZXJSdWxlc1JhdzogJycsXG4gIG1pbkNvdW50UmF3OiAnJyxcbiAgbWF4Q291bnRSYXc6ICcnLFxufTtcblxuY29uc3QgRlJPTlRNQVRURVJfT1BFUkFUT1JTOiBGcm9udG1hdHRlck9wZXJhdG9yW10gPSBbXG4gICdlcXVhbHMnLFxuICAnbm90LWVxdWFscycsXG4gICdjb250YWlucycsXG4gICdndCcsXG4gICdndGUnLFxuICAnbHQnLFxuICAnbHRlJyxcbiAgJ2V4aXN0cycsXG4gICdub3QtZXhpc3RzJyxcbl07XG5cbmV4cG9ydCBjbGFzcyBFbWJlZFdvcmRDbG91ZE1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIHJlYWRvbmx5IHNlcnZpY2VzOiBXb3JkQ2xvdWRTZXJ2aWNlcztcbiAgcHJpdmF0ZSByZWFkb25seSBvbkluc2VydDogKGVtYmVkQmxvY2s6IHN0cmluZykgPT4gYm9vbGVhbiB8IFByb21pc2U8Ym9vbGVhbj47XG4gIHByaXZhdGUgcmVhZG9ubHkgc3RhdGU6IEVtYmVkV2l6YXJkU3RhdGU7XG4gIHByaXZhdGUgcmVhZG9ubHkgdGl0bGU6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IHN1Ym1pdEJ1dHRvblRleHQ6IHN0cmluZztcblxuICBwcml2YXRlIHRhYnNFbCE6IEhUTUxEaXZFbGVtZW50O1xuICBwcml2YXRlIGZpbHRlcnNUYWJCdXR0b25FbCE6IEhUTUxCdXR0b25FbGVtZW50O1xuICBwcml2YXRlIGFwcGVhcmFuY2VUYWJCdXR0b25FbCE6IEhUTUxCdXR0b25FbGVtZW50O1xuICBwcml2YXRlIGFkdmFuY2VkVGFiQnV0dG9uRWwhOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgcHJpdmF0ZSBmaWx0ZXJzUGFuZWxFbCE6IEhUTUxEaXZFbGVtZW50O1xuICBwcml2YXRlIGFwcGVhcmFuY2VQYW5lbEVsITogSFRNTERpdkVsZW1lbnQ7XG4gIHByaXZhdGUgYWR2YW5jZWRQYW5lbEVsITogSFRNTERpdkVsZW1lbnQ7XG4gIHByaXZhdGUgc2NvcGVXcmFwcGVyRWwhOiBIVE1MRGl2RWxlbWVudDtcbiAgcHJpdmF0ZSBzcGVjaWZpY0ZpbGVXcmFwcGVyRWwhOiBIVE1MRGl2RWxlbWVudDtcbiAgcHJpdmF0ZSBzaXplV3JhcHBlckVsITogSFRNTERpdkVsZW1lbnQ7XG4gIHByaXZhdGUgaW5jbHVkZVRhZ3NXcmFwcGVyRWwhOiBIVE1MRGl2RWxlbWVudDtcbiAgcHJpdmF0ZSBtYXRjaE1vZGVXcmFwcGVyRWwhOiBIVE1MRGl2RWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBhcHA6IEFwcCxcbiAgICBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXMsXG4gICAgb25JbnNlcnQ6IChlbWJlZEJsb2NrOiBzdHJpbmcpID0+IGJvb2xlYW4gfCBQcm9taXNlPGJvb2xlYW4+LFxuICAgIG9wdGlvbnM6IEVtYmVkV29yZENsb3VkTW9kYWxPcHRpb25zID0ge30sXG4gICkge1xuICAgIHN1cGVyKGFwcCk7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IHNlcnZpY2VzO1xuICAgIHRoaXMub25JbnNlcnQgPSBvbkluc2VydDtcbiAgICB0aGlzLnRpdGxlID0gb3B0aW9ucy50aXRsZSA/PyAnRW1iZWQgd29yZCBjbG91ZCBpbiBkb2N1bWVudCc7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb24gPz8gJ0NvbmZpZ3VyZSBvcHRpb25zLCB0aGVuIGluc2VydCBhIHdvcmQgY2xvdWQgZW1iZWQgYXQgeW91ciBjdXJzb3IuJztcbiAgICB0aGlzLnN1Ym1pdEJ1dHRvblRleHQgPSBvcHRpb25zLnN1Ym1pdEJ1dHRvblRleHQgPz8gJ0FwcGx5JztcblxuICAgIGNvbnN0IGluaXRpYWxTdGF0ZSA9IG9wdGlvbnMuaW5pdGlhbFN0YXRlID8/IHt9O1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAuLi5ERUZBVUxUX1NUQVRFLFxuICAgICAgLi4uaW5pdGlhbFN0YXRlLFxuICAgIH07XG4gICAgaWYgKCF0aGlzLnN0YXRlLmNsb3VkSWQpIHtcbiAgICAgIHRoaXMuc3RhdGUuY2xvdWRJZCA9IGNyZWF0ZUVtYmVkQ2xvdWRJZCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zdGF0ZS5zY29wZSA9PT0gJ2ZvbGRlcicpIHtcbiAgICAgIHRoaXMuc3RhdGUuc2NvcGUgPSAndmF1bHQnO1xuICAgIH1cbiAgfVxuXG4gIG9uT3BlbigpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICBjb250ZW50RWwuZW1wdHkoKTtcbiAgICBjb250ZW50RWwuYWRkQ2xhc3MoJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkJyk7XG5cbiAgICBjb250ZW50RWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiB0aGlzLnRpdGxlIH0pO1xuICAgIGNvbnRlbnRFbC5jcmVhdGVFbCgncCcsIHtcbiAgICAgIGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLWRlc2NyaXB0aW9uJyxcbiAgICAgIHRleHQ6IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgfSk7XG5cbiAgICB0aGlzLnNjb3BlV3JhcHBlckVsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLXNlY3Rpb24nIH0pO1xuICAgIHRoaXMuc3BlY2lmaWNGaWxlV3JhcHBlckVsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLXNlY3Rpb24nIH0pO1xuXG4gICAgbmV3IFNldHRpbmcodGhpcy5zY29wZVdyYXBwZXJFbClcbiAgICAgIC5zZXROYW1lKCdTY29wZScpXG4gICAgICAuc2V0RGVzYygnQ2hvb3NlIHdoZXRoZXIgdGhpcyBjbG91ZCB1c2VzIHRoZSBub3RlIGZpbGUgb3IgdGhlIGVudGlyZSB2YXVsdC4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ2ZpbGUnLCAnRmlsZScpXG4gICAgICAgICAgLmFkZE9wdGlvbigndmF1bHQnLCAnVmF1bHQnKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnN0YXRlLnNjb3BlID09PSAnZmlsZScgPyAnZmlsZScgOiAndmF1bHQnKVxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2NvcGUgPSB2YWx1ZSA9PT0gJ2ZpbGUnID8gJ2ZpbGUnIDogJ3ZhdWx0JztcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbmRpdGlvbmFsU2VjdGlvbnMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgY29uc3Qgc2V0dGluZ3NTaGVsbEVsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLXNldHRpbmdzJyB9KTtcblxuICAgIHRoaXMudGFic0VsID0gc2V0dGluZ3NTaGVsbEVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLXRhYnMnIH0pO1xuICAgIHRoaXMudGFic0VsLnNldEF0dHIoJ3JvbGUnLCAndGFibGlzdCcpO1xuICAgIHRoaXMudGFic0VsLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnRW1iZWRkZWQgd29yZCBjbG91ZCBzZXR0aW5ncyB0YWJzJyk7XG5cbiAgICB0aGlzLmZpbHRlcnNUYWJCdXR0b25FbCA9IHRoaXMuYnVpbGRUYWJCdXR0b24oJ2ZpbHRlcnMnLCAnRmlsdGVycycsIHRydWUpO1xuICAgIHRoaXMuYXBwZWFyYW5jZVRhYkJ1dHRvbkVsID0gdGhpcy5idWlsZFRhYkJ1dHRvbignYXBwZWFyYW5jZScsICdBcHBlYXJhbmNlJywgZmFsc2UpO1xuICAgIHRoaXMuYWR2YW5jZWRUYWJCdXR0b25FbCA9IHRoaXMuYnVpbGRUYWJCdXR0b24oJ2FkdmFuY2VkJywgJ0FkdmFuY2VkJywgZmFsc2UpO1xuXG4gICAgY29uc3QgcGFuZWxzRWwgPSBzZXR0aW5nc1NoZWxsRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtcGFuZWxzJyB9KTtcblxuICAgIHRoaXMuZmlsdGVyc1BhbmVsRWwgPSBwYW5lbHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1wYW5lbCBpcy1hY3RpdmUnIH0pO1xuICAgIHRoaXMuZmlsdGVyc1BhbmVsRWwuaWQgPSAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtcGFuZWwtZmlsdGVycyc7XG4gICAgdGhpcy5maWx0ZXJzUGFuZWxFbC5zZXRBdHRyKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG4gICAgdGhpcy5maWx0ZXJzUGFuZWxFbC5zZXRBdHRyKCdhcmlhLWxhYmVsbGVkYnknLCB0aGlzLmZpbHRlcnNUYWJCdXR0b25FbC5pZCk7XG5cbiAgICB0aGlzLmFwcGVhcmFuY2VQYW5lbEVsID0gcGFuZWxzRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtcGFuZWwnIH0pO1xuICAgIHRoaXMuYXBwZWFyYW5jZVBhbmVsRWwuaWQgPSAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtcGFuZWwtYXBwZWFyYW5jZSc7XG4gICAgdGhpcy5hcHBlYXJhbmNlUGFuZWxFbC5zZXRBdHRyKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG4gICAgdGhpcy5hcHBlYXJhbmNlUGFuZWxFbC5zZXRBdHRyKCdhcmlhLWxhYmVsbGVkYnknLCB0aGlzLmFwcGVhcmFuY2VUYWJCdXR0b25FbC5pZCk7XG5cbiAgICB0aGlzLmFkdmFuY2VkUGFuZWxFbCA9IHBhbmVsc0VsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLXBhbmVsJyB9KTtcbiAgICB0aGlzLmFkdmFuY2VkUGFuZWxFbC5pZCA9ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1wYW5lbC1hZHZhbmNlZCc7XG4gICAgdGhpcy5hZHZhbmNlZFBhbmVsRWwuc2V0QXR0cigncm9sZScsICd0YWJwYW5lbCcpO1xuICAgIHRoaXMuYWR2YW5jZWRQYW5lbEVsLnNldEF0dHIoJ2FyaWEtbGFiZWxsZWRieScsIHRoaXMuYWR2YW5jZWRUYWJCdXR0b25FbC5pZCk7XG4gICAgdGhpcy5hZHZhbmNlZFBhbmVsRWwuY3JlYXRlRWwoJ3AnLCB7XG4gICAgICBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1kZXNjcmlwdGlvbicsXG4gICAgICB0ZXh0OiAnTm8gYWRkaXRpb25hbCBhZHZhbmNlZCBzZXR0aW5ncyBhcmUgYXZhaWxhYmxlLicsXG4gICAgfSk7XG5cbiAgICB0aGlzLmluY2x1ZGVUYWdzV3JhcHBlckVsID0gdGhpcy5maWx0ZXJzUGFuZWxFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1zZWN0aW9uJyB9KTtcbiAgICB0aGlzLm1hdGNoTW9kZVdyYXBwZXJFbCA9IHRoaXMuZmlsdGVyc1BhbmVsRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtc2VjdGlvbicgfSk7XG5cbiAgICB0aGlzLnNpemVXcmFwcGVyRWwgPSB0aGlzLmFwcGVhcmFuY2VQYW5lbEVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLXNlY3Rpb24nIH0pO1xuXG4gICAgbmV3IFNldHRpbmcodGhpcy5zaXplV3JhcHBlckVsKVxuICAgICAgLnNldE5hbWUoJ1NpemUnKVxuICAgICAgLnNldERlc2MoJ1NlbGVjdCB0aGUgZW1iZWRkZWQgY2xvdWQgc2l6ZSBwcmVzZXQuJylcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9uKCdzbWFsbCcsICdTbWFsbCcpXG4gICAgICAgICAgLmFkZE9wdGlvbignbWVkaXVtJywgJ01lZGl1bScpXG4gICAgICAgICAgLmFkZE9wdGlvbignbGFyZ2UnLCAnTGFyZ2UnKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnN0YXRlLnNpemUpXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zaXplID0gdmFsdWUgPT09ICdzbWFsbCcgfHwgdmFsdWUgPT09ICdsYXJnZScgPyB2YWx1ZSA6ICdtZWRpdW0nO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLnJlbmRlclNwZWNpZmljRmlsZVNldHRpbmcoKTtcbiAgICB0aGlzLnJlbmRlckluY2x1ZGVUYWdTZXR0aW5nKCk7XG4gICAgdGhpcy5yZW5kZXJUYWdNYXRjaE1vZGVTZXR0aW5nKCk7XG5cbiAgICBjb25zdCBidXR0b25Sb3dFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1hY3Rpb25zJyB9KTtcblxuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IG5ldyBCdXR0b25Db21wb25lbnQoYnV0dG9uUm93RWwpXG4gICAgICAuc2V0QnV0dG9uVGV4dCgnQ2FuY2VsJylcbiAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfSk7XG4gICAgY2FuY2VsQnV0dG9uLmJ1dHRvbkVsLnR5cGUgPSAnYnV0dG9uJztcblxuICAgIGNvbnN0IGFwcGx5QnV0dG9uID0gbmV3IEJ1dHRvbkNvbXBvbmVudChidXR0b25Sb3dFbClcbiAgICAgIC5zZXRCdXR0b25UZXh0KHRoaXMuc3VibWl0QnV0dG9uVGV4dClcbiAgICAgIC5zZXRDdGEoKVxuICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICBhcHBseUJ1dHRvbi5zZXREaXNhYmxlZCh0cnVlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCB3YXNJbnNlcnRlZCA9IGF3YWl0IHRoaXMub25JbnNlcnQodGhpcy5idWlsZEVtYmVkQmxvY2soKSk7XG4gICAgICAgICAgaWYgKHdhc0luc2VydGVkICYmIHRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1dvcmQgY2xvdWRzOiBmYWlsZWQgdG8gYXBwbHkgZW1iZWQgY2hhbmdlcycsIGVycm9yKTtcbiAgICAgICAgICBuZXcgTm90aWNlKCdDb3VsZCBub3QgYXBwbHkgd29yZCBjbG91ZCBjaGFuZ2VzLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcHBseUJ1dHRvbi5idXR0b25FbC5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgIGFwcGx5QnV0dG9uLnNldERpc2FibGVkKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgYXBwbHlCdXR0b24uYnV0dG9uRWwudHlwZSA9ICdidXR0b24nO1xuXG4gICAgdGhpcy5yZWZyZXNoQ29uZGl0aW9uYWxTZWN0aW9ucygpO1xuICAgIHRoaXMuc3dpdGNoVGFiKCdmaWx0ZXJzJyk7XG4gIH1cblxuICBvbkNsb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclNwZWNpZmljRmlsZVNldHRpbmcoKTogdm9pZCB7XG4gICAgdGhpcy5zcGVjaWZpY0ZpbGVXcmFwcGVyRWwuZW1wdHkoKTtcblxuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMuYXBwLnZhdWx0XG4gICAgICAuZ2V0TWFya2Rvd25GaWxlcygpXG4gICAgICAubWFwKChmaWxlKSA9PiBmaWxlLnBhdGgpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgICBjb25zdCBoYXNDdXJyZW50ID0gZmlsZVBhdGhzLmluY2x1ZGVzKHRoaXMuc3RhdGUuc3BlY2lmaWNGaWxlUGF0aCk7XG5cbiAgICBuZXcgU2V0dGluZyh0aGlzLnNwZWNpZmljRmlsZVdyYXBwZXJFbClcbiAgICAgIC5zZXROYW1lKCdGaWxlJylcbiAgICAgIC5zZXREZXNjKCdTZWxlY3QgdGhlIGZpbGUgdXNlZCB3aGVuIHNjb3BlIGlzIHNldCB0byBmaWxlLiBDaG9vc2UgQ3VycmVudCBub3RlIHRvIHVzZSB0aGUgbm90ZSBjb250YWluaW5nIHRoaXMgZW1iZWQuJylcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCcnLCAnQ3VycmVudCBub3RlJyk7XG4gICAgICAgIGZvciAoY29uc3QgZmlsZVBhdGggb2YgZmlsZVBhdGhzKSB7XG4gICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKGZpbGVQYXRoLCBmaWxlUGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuc3BlY2lmaWNGaWxlUGF0aCAmJiAhaGFzQ3VycmVudCkge1xuICAgICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbih0aGlzLnN0YXRlLnNwZWNpZmljRmlsZVBhdGgsIHRoaXMuc3RhdGUuc3BlY2lmaWNGaWxlUGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnN0YXRlLnNwZWNpZmljRmlsZVBhdGgpXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zcGVjaWZpY0ZpbGVQYXRoID0gdmFsdWU7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVySW5jbHVkZVRhZ1NldHRpbmcoKTogdm9pZCB7XG4gICAgdGhpcy5pbmNsdWRlVGFnc1dyYXBwZXJFbC5lbXB0eSgpO1xuXG4gICAgY29uc3QgYXZhaWxhYmxlVGFncyA9IHRoaXMuc2VydmljZXMuZ2V0QXZhaWxhYmxlVGFncygpO1xuICAgIGNvbnN0IHRhZ0hpbnQgPSBhdmFpbGFibGVUYWdzLmxlbmd0aCA+IDBcbiAgICAgID8gYEF2YWlsYWJsZTogJHthdmFpbGFibGVUYWdzLnNsaWNlKDAsIDEyKS5qb2luKCcsICcpfSR7YXZhaWxhYmxlVGFncy5sZW5ndGggPiAxMiA/ICdcdTIwMjYnIDogJyd9YFxuICAgICAgOiAnTm8gdGFncyBkZXRlY3RlZCB5ZXQuJztcblxuICAgIG5ldyBTZXR0aW5nKHRoaXMuaW5jbHVkZVRhZ3NXcmFwcGVyRWwpXG4gICAgICAuc2V0TmFtZSgnSW5jbHVkZSB0YWdzJylcbiAgICAgIC5zZXREZXNjKGBPcHRpb25hbCBjb21tYS1zZXBhcmF0ZWQgdGFncyB0byBpbmNsdWRlLiAke3RhZ0hpbnR9YClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB7XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJyNwcm9qZWN0LCAjbWVldGluZycpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMuc3RhdGUuaW5jbHVkZVRhZ3NSYXcpXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbmNsdWRlVGFnc1JhdyA9IHZhbHVlO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclRhZ01hdGNoTW9kZVNldHRpbmcoKTogdm9pZCB7XG4gICAgdGhpcy5tYXRjaE1vZGVXcmFwcGVyRWwuZW1wdHkoKTtcblxuICAgIG5ldyBTZXR0aW5nKHRoaXMubWF0Y2hNb2RlV3JhcHBlckVsKVxuICAgICAgLnNldE5hbWUoJ0luY2x1ZGUgbWF0Y2ggbW9kZScpXG4gICAgICAuc2V0RGVzYygnSG93IGluY2x1ZGUgdGFncyBzaG91bGQgbWF0Y2ggd2hlbiBtdWx0aXBsZSB0YWdzIGFyZSBzZXQuJylcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9uKCdhbnknLCAnQW55IGluY2x1ZGUgdGFnJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdhbGwnLCAnQWxsIGluY2x1ZGUgdGFncycpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMuc3RhdGUudGFnTWF0Y2hNb2RlKVxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudGFnTWF0Y2hNb2RlID0gdmFsdWUgPT09ICdhbGwnID8gJ2FsbCcgOiAnYW55JztcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoQ29uZGl0aW9uYWxTZWN0aW9ucygpOiB2b2lkIHtcbiAgICB0aGlzLnNwZWNpZmljRmlsZVdyYXBwZXJFbC50b2dnbGVDbGFzcygnaXMtaGlkZGVuJywgdGhpcy5zdGF0ZS5zY29wZSAhPT0gJ2ZpbGUnKTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRUYWJCdXR0b24odGFiOiBFbWJlZFNldHRpbmdzVGFiLCBsYWJlbDogc3RyaW5nLCBpc0FjdGl2ZTogYm9vbGVhbik6IEhUTUxCdXR0b25FbGVtZW50IHtcbiAgICBjb25zdCBidXR0b25FbCA9IHRoaXMudGFic0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICBjbHM6IGB3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC10YWIke2lzQWN0aXZlID8gJyBpcy1hY3RpdmUnIDogJyd9YCxcbiAgICAgIHRleHQ6IGxhYmVsLFxuICAgIH0pO1xuICAgIGJ1dHRvbkVsLmlkID0gYHdvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLXRhYi0ke3RhYn1gO1xuICAgIGJ1dHRvbkVsLnR5cGUgPSAnYnV0dG9uJztcbiAgICBidXR0b25FbC5zZXRBdHRyKCdyb2xlJywgJ3RhYicpO1xuICAgIGJ1dHRvbkVsLnNldEF0dHIoJ2FyaWEtY29udHJvbHMnLCBgd29yZC1jbG91ZC1lbWJlZC13aXphcmQtcGFuZWwtJHt0YWJ9YCk7XG4gICAgYnV0dG9uRWwuc2V0QXR0cignYXJpYS1zZWxlY3RlZCcsIGlzQWN0aXZlID8gJ3RydWUnIDogJ2ZhbHNlJyk7XG4gICAgYnV0dG9uRWwuc2V0QXR0cigndGFiaW5kZXgnLCBpc0FjdGl2ZSA/ICcwJyA6ICctMScpO1xuICAgIGJ1dHRvbkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5zd2l0Y2hUYWIodGFiKTtcbiAgICB9KTtcbiAgICBidXR0b25FbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVRhYktleWRvd24oZXZlbnQsIHRhYik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGJ1dHRvbkVsO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVUYWJLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50LCBjdXJyZW50VGFiOiBFbWJlZFNldHRpbmdzVGFiKTogdm9pZCB7XG4gICAgY29uc3QgdGFiczogRW1iZWRTZXR0aW5nc1RhYltdID0gWydmaWx0ZXJzJywgJ2FwcGVhcmFuY2UnLCAnYWR2YW5jZWQnXTtcbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSB0YWJzLmluZGV4T2YoY3VycmVudFRhYik7XG4gICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dSaWdodCcpIHtcbiAgICAgIGNvbnN0IG5leHRUYWIgPSB0YWJzWyhjdXJyZW50SW5kZXggKyAxKSAlIHRhYnMubGVuZ3RoXTtcbiAgICAgIHRoaXMuc3dpdGNoVGFiKG5leHRUYWIpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dMZWZ0Jykge1xuICAgICAgY29uc3QgbmV4dFRhYiA9IHRhYnNbKGN1cnJlbnRJbmRleCAtIDEgKyB0YWJzLmxlbmd0aCkgJSB0YWJzLmxlbmd0aF07XG4gICAgICB0aGlzLnN3aXRjaFRhYihuZXh0VGFiKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0hvbWUnKSB7XG4gICAgICB0aGlzLnN3aXRjaFRhYih0YWJzWzBdKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VuZCcpIHtcbiAgICAgIHRoaXMuc3dpdGNoVGFiKHRhYnNbdGFicy5sZW5ndGggLSAxXSk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3dpdGNoVGFiKHRhYjogRW1iZWRTZXR0aW5nc1RhYik6IHZvaWQge1xuICAgIGNvbnN0IHNob3dGaWx0ZXJzID0gdGFiID09PSAnZmlsdGVycyc7XG4gICAgY29uc3Qgc2hvd0FwcGVhcmFuY2UgPSB0YWIgPT09ICdhcHBlYXJhbmNlJztcbiAgICBjb25zdCBzaG93QWR2YW5jZWQgPSB0YWIgPT09ICdhZHZhbmNlZCc7XG5cbiAgICB0aGlzLmZpbHRlcnNUYWJCdXR0b25FbC50b2dnbGVDbGFzcygnaXMtYWN0aXZlJywgc2hvd0ZpbHRlcnMpO1xuICAgIHRoaXMuZmlsdGVyc1RhYkJ1dHRvbkVsLnNldEF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCBzaG93RmlsdGVycyA/ICd0cnVlJyA6ICdmYWxzZScpO1xuICAgIHRoaXMuZmlsdGVyc1RhYkJ1dHRvbkVsLnNldEF0dHIoJ3RhYmluZGV4Jywgc2hvd0ZpbHRlcnMgPyAnMCcgOiAnLTEnKTtcblxuICAgIHRoaXMuYXBwZWFyYW5jZVRhYkJ1dHRvbkVsLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnLCBzaG93QXBwZWFyYW5jZSk7XG4gICAgdGhpcy5hcHBlYXJhbmNlVGFiQnV0dG9uRWwuc2V0QXR0cignYXJpYS1zZWxlY3RlZCcsIHNob3dBcHBlYXJhbmNlID8gJ3RydWUnIDogJ2ZhbHNlJyk7XG4gICAgdGhpcy5hcHBlYXJhbmNlVGFiQnV0dG9uRWwuc2V0QXR0cigndGFiaW5kZXgnLCBzaG93QXBwZWFyYW5jZSA/ICcwJyA6ICctMScpO1xuXG4gICAgdGhpcy5hZHZhbmNlZFRhYkJ1dHRvbkVsLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnLCBzaG93QWR2YW5jZWQpO1xuICAgIHRoaXMuYWR2YW5jZWRUYWJCdXR0b25FbC5zZXRBdHRyKCdhcmlhLXNlbGVjdGVkJywgc2hvd0FkdmFuY2VkID8gJ3RydWUnIDogJ2ZhbHNlJyk7XG4gICAgdGhpcy5hZHZhbmNlZFRhYkJ1dHRvbkVsLnNldEF0dHIoJ3RhYmluZGV4Jywgc2hvd0FkdmFuY2VkID8gJzAnIDogJy0xJyk7XG5cbiAgICB0aGlzLmZpbHRlcnNQYW5lbEVsLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnLCBzaG93RmlsdGVycyk7XG4gICAgdGhpcy5hcHBlYXJhbmNlUGFuZWxFbC50b2dnbGVDbGFzcygnaXMtYWN0aXZlJywgc2hvd0FwcGVhcmFuY2UpO1xuICAgIHRoaXMuYWR2YW5jZWRQYW5lbEVsLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnLCBzaG93QWR2YW5jZWQpO1xuXG4gICAgY29uc3QgdGFyZ2V0QnV0dG9uID0gc2hvd0ZpbHRlcnNcbiAgICAgID8gdGhpcy5maWx0ZXJzVGFiQnV0dG9uRWxcbiAgICAgIDogc2hvd0FwcGVhcmFuY2VcbiAgICAgICAgPyB0aGlzLmFwcGVhcmFuY2VUYWJCdXR0b25FbFxuICAgICAgICA6IHRoaXMuYWR2YW5jZWRUYWJCdXR0b25FbDtcblxuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIHRoaXMudGFic0VsLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICB0YXJnZXRCdXR0b24uZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkRW1iZWRCbG9jaygpOiBzdHJpbmcge1xuICAgIGNvbnN0IGxpbmVzID0gWydgYGB3b3JkY2xvdWQnLCBgaWQ6ICR7dGhpcy5zdGF0ZS5jbG91ZElkfWAsIGBzY29wZTogJHt0aGlzLnN0YXRlLnNjb3BlfWAsIGBzaXplOiAke3RoaXMuc3RhdGUuc2l6ZX1gXTtcbiAgICBjb25zdCBpbmNsdWRlVGFncyA9IHBhcnNlVGFnTGlzdCh0aGlzLnN0YXRlLmluY2x1ZGVUYWdzUmF3KTtcbiAgICBjb25zdCBleGNsdWRlVGFncyA9IHBhcnNlVGFnTGlzdCh0aGlzLnN0YXRlLmV4Y2x1ZGVUYWdzUmF3KS5maWx0ZXIoKHRhZykgPT4gIWluY2x1ZGVUYWdzLmluY2x1ZGVzKHRhZykpO1xuICAgIGNvbnN0IGZvbGRlclBhdGhzID0gcGFyc2VMaXN0KHRoaXMuc3RhdGUuZm9sZGVyUGF0aHNSYXcpO1xuICAgIGNvbnN0IGZyb250bWF0dGVyUnVsZXMgPSBwYXJzZUZyb250bWF0dGVyUnVsZXModGhpcy5zdGF0ZS5mcm9udG1hdHRlclJ1bGVzUmF3KTtcbiAgICBjb25zdCBtaW5Db3VudCA9IHBhcnNlQ291bnQodGhpcy5zdGF0ZS5taW5Db3VudFJhdyk7XG4gICAgY29uc3QgbWF4Q291bnQgPSBwYXJzZUNvdW50KHRoaXMuc3RhdGUubWF4Q291bnRSYXcpO1xuICAgIGNvbnN0IHNwZWNpZmljRmlsZVBhdGggPSB0aGlzLnN0YXRlLnNwZWNpZmljRmlsZVBhdGgudHJpbSgpO1xuXG4gICAgaWYgKHNwZWNpZmljRmlsZVBhdGggJiYgdGhpcy5zdGF0ZS5zY29wZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICBsaW5lcy5wdXNoKGBmaWxlOiAke3NwZWNpZmljRmlsZVBhdGh9YCk7XG4gICAgfVxuICAgIGlmIChpbmNsdWRlVGFncy5sZW5ndGggPiAwKSB7XG4gICAgICBsaW5lcy5wdXNoKGBpbmNsdWRlLXRhZ3M6ICR7aW5jbHVkZVRhZ3Muam9pbignLCAnKX1gKTtcbiAgICB9XG4gICAgaWYgKGV4Y2x1ZGVUYWdzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxpbmVzLnB1c2goYGV4Y2x1ZGUtdGFnczogJHtleGNsdWRlVGFncy5qb2luKCcsICcpfWApO1xuICAgIH1cbiAgICBpZiAoaW5jbHVkZVRhZ3MubGVuZ3RoID4gMSB8fCB0aGlzLnN0YXRlLnRhZ01hdGNoTW9kZSA9PT0gJ2FsbCcpIHtcbiAgICAgIGxpbmVzLnB1c2goYHRhZy1tYXRjaDogJHt0aGlzLnN0YXRlLnRhZ01hdGNoTW9kZX1gKTtcbiAgICB9XG4gICAgaWYgKGZvbGRlclBhdGhzLmxlbmd0aCA+IDAgJiYgdGhpcy5zdGF0ZS5zY29wZSA9PT0gJ2ZvbGRlcicpIHtcbiAgICAgIGxpbmVzLnB1c2goYGZvbGRlci1wYXRoczogJHtmb2xkZXJQYXRocy5qb2luKCcsICcpfWApO1xuICAgIH1cbiAgICBpZiAoZnJvbnRtYXR0ZXJSdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBsaW5lcy5wdXNoKGBmcm9udG1hdHRlci1ydWxlczogJHtmcm9udG1hdHRlclJ1bGVzLm1hcChzZXJpYWxpemVGcm9udG1hdHRlclJ1bGUpLmpvaW4oJzsgJyl9YCk7XG4gICAgfVxuICAgIGlmIChtaW5Db3VudCAhPT0gbnVsbCkge1xuICAgICAgbGluZXMucHVzaChgbWluLWNvdW50OiAke21pbkNvdW50fWApO1xuICAgIH1cbiAgICBpZiAobWF4Q291bnQgIT09IG51bGwpIHtcbiAgICAgIGxpbmVzLnB1c2goYG1heC1jb3VudDogJHttYXhDb3VudH1gKTtcbiAgICB9XG5cbiAgICBsaW5lcy5wdXNoKCdgYGAnKTtcblxuICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZUxpc3QocmF3VmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFsuLi5uZXcgU2V0KHJhd1ZhbHVlXG4gICAgLnNwbGl0KCcsJylcbiAgICAubWFwKChlbnRyeSkgPT4gZW50cnkudHJpbSgpKVxuICAgIC5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS5sZW5ndGggPiAwKSldO1xufVxuXG5mdW5jdGlvbiBwYXJzZVRhZ0xpc3QocmF3VmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgdGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IGVudHJ5IG9mIHBhcnNlTGlzdChyYXdWYWx1ZSkpIHtcbiAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplVGFnKGVudHJ5KTtcbiAgICBpZiAobm9ybWFsaXplZCkge1xuICAgICAgdGFncy5hZGQobm9ybWFsaXplZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBbLi4udGFnc107XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ291bnQocmF3VmFsdWU6IHN0cmluZyk6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBwYXJzZWQgPSBOdW1iZXIucGFyc2VJbnQocmF3VmFsdWUudHJpbSgpLCAxMCk7XG4gIGlmIChOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBNYXRoLm1pbig5OTk5LCBNYXRoLm1heCgxLCBwYXJzZWQpKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VGcm9udG1hdHRlclJ1bGVzKHJhd1ZhbHVlOiBzdHJpbmcpOiBGcm9udG1hdHRlclJ1bGVbXSB7XG4gIGNvbnN0IHJ1bGVzOiBGcm9udG1hdHRlclJ1bGVbXSA9IFtdO1xuICBjb25zdCBlbnRyaWVzID0gcmF3VmFsdWVcbiAgICAuc3BsaXQoJzsnKVxuICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS50cmltKCkpXG4gICAgLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApO1xuXG4gIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgIGNvbnN0IHBhcnRzID0gZW50cnkuc3BsaXQoJ3wnKS5tYXAoKHBhcnQpID0+IHBhcnQudHJpbSgpKTtcbiAgICBjb25zdCBrZXkgPSBwYXJ0c1swXSA/PyAnJztcbiAgICBpZiAoIWtleSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgcmF3T3BlcmF0b3IgPSBwYXJ0c1sxXSA/PyAnJztcbiAgICBjb25zdCBvcGVyYXRvciA9IEZST05UTUFUVEVSX09QRVJBVE9SUy5pbmNsdWRlcyhyYXdPcGVyYXRvciBhcyBGcm9udG1hdHRlck9wZXJhdG9yKVxuICAgICAgPyByYXdPcGVyYXRvciBhcyBGcm9udG1hdHRlck9wZXJhdG9yXG4gICAgICA6ICdlcXVhbHMnO1xuICAgIGNvbnN0IHZhbHVlID0gcGFydHMuc2xpY2UoMikuam9pbignfCcpLnRyaW0oKTtcblxuICAgIGlmIChvcGVyYXRvciA9PT0gJ2V4aXN0cycgfHwgb3BlcmF0b3IgPT09ICdub3QtZXhpc3RzJykge1xuICAgICAgcnVsZXMucHVzaCh7IGtleSwgb3BlcmF0b3IgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBydWxlcy5wdXNoKHsga2V5LCBvcGVyYXRvciwgdmFsdWUgfSk7XG4gIH1cblxuICByZXR1cm4gcnVsZXM7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZUZyb250bWF0dGVyUnVsZShydWxlOiBGcm9udG1hdHRlclJ1bGUpOiBzdHJpbmcge1xuICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ2V4aXN0cycgfHwgcnVsZS5vcGVyYXRvciA9PT0gJ25vdC1leGlzdHMnKSB7XG4gICAgcmV0dXJuIGAke3J1bGUua2V5fXwke3J1bGUub3BlcmF0b3J9fGA7XG4gIH1cbiAgcmV0dXJuIGAke3J1bGUua2V5fXwke3J1bGUub3BlcmF0b3J9fCR7cnVsZS52YWx1ZSA/PyAnJ31gO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFbWJlZENsb3VkSWQoKTogc3RyaW5nIHtcbiAgaWYgKHR5cGVvZiBjcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjcnlwdG8ucmFuZG9tVVVJRCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBjcnlwdG8ucmFuZG9tVVVJRCgpO1xuICB9XG5cbiAgY29uc3QgcmFuZG9tUGFydCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsIDEwKTtcbiAgY29uc3QgdGltZVBhcnQgPSBEYXRlLm5vdygpLnRvU3RyaW5nKDM2KTtcbiAgcmV0dXJuIGB3Yy0ke3RpbWVQYXJ0fS0ke3JhbmRvbVBhcnR9YDtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplVGFnKHRhZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgdHJpbW1lZCA9IHRhZy50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCF0cmltbWVkKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIHRyaW1tZWQuc3RhcnRzV2l0aCgnIycpID8gdHJpbW1lZCA6IGAjJHt0cmltbWVkfWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVGb3JTZWFyY2godmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxlY3RlZE11bHRpVmFsdWVzKHNlbGVjdEVsOiBIVE1MU2VsZWN0RWxlbWVudCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIEFycmF5LmZyb20oc2VsZWN0RWwuc2VsZWN0ZWRPcHRpb25zKS5tYXAoKG9wdGlvbikgPT4gb3B0aW9uLnZhbHVlKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFwcCB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgU2VhcmNoT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGVzY2FwZUZvclNlYXJjaCwgbm9ybWFsaXplVGFnIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb3BlblNlYXJjaEZvcldvcmQoYXBwOiBBcHAsIHdvcmQ6IHN0cmluZywgb3B0aW9uczogU2VhcmNoT3B0aW9ucyA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IFtgXCIke2VzY2FwZUZvclNlYXJjaCh3b3JkKX1cImBdO1xuXG4gIGlmIChvcHRpb25zLmZpbGVQYXRoKSB7XG4gICAgcGFydHMucHVzaChgcGF0aDpcIiR7ZXNjYXBlRm9yU2VhcmNoKG9wdGlvbnMuZmlsZVBhdGgpfVwiYCk7XG4gIH1cblxuICBjb25zdCBpbmNsdWRlVGFncyA9IChvcHRpb25zLmluY2x1ZGVUYWdzID8/IFtdKVxuICAgIC5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpXG4gICAgLmZpbHRlcigodGFnKSA9PiB0YWcubGVuZ3RoID4gMCk7XG4gIGNvbnN0IGV4Y2x1ZGVUYWdzID0gKG9wdGlvbnMuZXhjbHVkZVRhZ3MgPz8gW10pXG4gICAgLm1hcCgodGFnKSA9PiBub3JtYWxpemVUYWcodGFnKSlcbiAgICAuZmlsdGVyKCh0YWcpID0+IHRhZy5sZW5ndGggPiAwKTtcblxuICBpZiAoaW5jbHVkZVRhZ3MubGVuZ3RoID4gMCkge1xuICAgIGlmIChvcHRpb25zLnRhZ01hdGNoTW9kZSA9PT0gJ2FsbCcpIHtcbiAgICAgIGZvciAoY29uc3QgdGFnIG9mIGluY2x1ZGVUYWdzKSB7XG4gICAgICAgIHBhcnRzLnB1c2godGFnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcGFydHMucHVzaChgKCR7aW5jbHVkZVRhZ3Muam9pbignIE9SICcpfSlgKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHRhZyBvZiBleGNsdWRlVGFncykge1xuICAgIHBhcnRzLnB1c2goYC0ke3RhZ31gKTtcbiAgfVxuXG4gIGNvbnN0IHF1ZXJ5ID0gcGFydHMuam9pbignICcpO1xuICBjb25zdCBleGlzdGluZ1NlYXJjaExlYWYgPSBhcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZSgnc2VhcmNoJylbMF07XG4gIGNvbnN0IHNlYXJjaExlYWYgPSBleGlzdGluZ1NlYXJjaExlYWYgPz8gYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpID8/IGFwcC53b3Jrc3BhY2UuZ2V0TGVhZih0cnVlKTtcblxuICBpZiAoIXNlYXJjaExlYWYpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBhd2FpdCBzZWFyY2hMZWFmLnNldFZpZXdTdGF0ZSh7XG4gICAgdHlwZTogJ3NlYXJjaCcsXG4gICAgYWN0aXZlOiB0cnVlLFxuICAgIHN0YXRlOiB7XG4gICAgICBxdWVyeSxcbiAgICB9LFxuICB9KTtcblxuICBhcHAud29ya3NwYWNlLnJldmVhbExlYWYoc2VhcmNoTGVhZik7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBcHAsIFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgbm9ybWFsaXplVGFnIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBQaXBlbGluZURvY3VtZW50IH0gZnJvbSAnLi4vcGlwZWxpbmUvdHlwZXMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVhZFBpcGVsaW5lRG9jdW1lbnRzKFxuICBhcHA6IEFwcCxcbiAgZmlsZXM6IFRGaWxlW10sXG4gIHJlYWRCYXRjaFNpemU6IG51bWJlcixcbiAgb25Qcm9ncmVzcz86IChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4gdm9pZCxcbik6IFByb21pc2U8UGlwZWxpbmVEb2N1bWVudFtdPiB7XG4gIGNvbnN0IGRvY3VtZW50czogUGlwZWxpbmVEb2N1bWVudFtdID0gW107XG4gIGNvbnN0IHRvdGFsRmlsZXMgPSBNYXRoLm1heCgxLCBmaWxlcy5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGJhdGNoU3RhcnQgPSAwOyBiYXRjaFN0YXJ0IDwgZmlsZXMubGVuZ3RoOyBiYXRjaFN0YXJ0ICs9IHJlYWRCYXRjaFNpemUpIHtcbiAgICBjb25zdCBiYXRjaCA9IGZpbGVzLnNsaWNlKGJhdGNoU3RhcnQsIGJhdGNoU3RhcnQgKyByZWFkQmF0Y2hTaXplKTtcbiAgICBjb25zdCBjb250ZW50cyA9IGF3YWl0IFByb21pc2UuYWxsKGJhdGNoLm1hcCgoZmlsZSkgPT4gYXBwLnZhdWx0LmNhY2hlZFJlYWQoZmlsZSkpKTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBiYXRjaC5sZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICAgIGNvbnN0IGZpbGUgPSBiYXRjaFtpbmRleF07XG4gICAgICBjb25zdCByYXdUZXh0ID0gY29udGVudHNbaW5kZXhdO1xuICAgICAgY29uc3QgY2FjaGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gICAgICBjb25zdCB0YWdzID0gZ2V0RmlsZVRhZ3MoYXBwLCBmaWxlKTtcbiAgICAgIGNvbnN0IGZpbGVJbmRleCA9IGJhdGNoU3RhcnQgKyBpbmRleDtcblxuICAgICAgb25Qcm9ncmVzcz8uKGBTY2FubmluZyAke2ZpbGVJbmRleCArIDF9LyR7ZmlsZXMubGVuZ3RofSBmaWxlcy4uLmAsIE1hdGgucm91bmQoKGZpbGVJbmRleCAvIHRvdGFsRmlsZXMpICogNzUpKTtcblxuICAgICAgZG9jdW1lbnRzLnB1c2goe1xuICAgICAgICBpZDogZmlsZS5wYXRoLFxuICAgICAgICBwYXRoOiBmaWxlLnBhdGgsXG4gICAgICAgIGJhc2VuYW1lOiBmaWxlLmJhc2VuYW1lLFxuICAgICAgICByYXdUZXh0LFxuICAgICAgICB0YWdzLFxuICAgICAgICBmcm9udG1hdHRlcjogY2FjaGU/LmZyb250bWF0dGVyICYmIHR5cGVvZiBjYWNoZS5mcm9udG1hdHRlciA9PT0gJ29iamVjdCdcbiAgICAgICAgICA/IHsgLi4uY2FjaGUuZnJvbnRtYXR0ZXIgfVxuICAgICAgICAgIDoge30sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZG9jdW1lbnRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsZVRhZ3MoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogc3RyaW5nW10ge1xuICBjb25zdCBjYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcbiAgaWYgKCFjYWNoZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHRhZ1NldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIGlmIChjYWNoZS50YWdzKSB7XG4gICAgZm9yIChjb25zdCB0YWdFbnRyeSBvZiBjYWNoZS50YWdzKSB7XG4gICAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplVGFnKHRhZ0VudHJ5LnRhZyk7XG4gICAgICBpZiAobm9ybWFsaXplZCkge1xuICAgICAgICB0YWdTZXQuYWRkKG5vcm1hbGl6ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgdGFnIG9mIGV4dHJhY3RGcm9udG1hdHRlclRhZ3MoY2FjaGUuZnJvbnRtYXR0ZXIpKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVRhZyh0YWcpO1xuICAgIGlmIChub3JtYWxpemVkKSB7XG4gICAgICB0YWdTZXQuYWRkKG5vcm1hbGl6ZWQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbLi4udGFnU2V0XTtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdEZyb250bWF0dGVyVGFncyhmcm9udG1hdHRlcjogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nW10ge1xuICBpZiAoIWZyb250bWF0dGVyIHx8IHR5cGVvZiBmcm9udG1hdHRlciAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCByYXdUYWdzID0gZnJvbnRtYXR0ZXIudGFncyA/PyBmcm9udG1hdHRlci50YWc7XG4gIGlmICh0eXBlb2YgcmF3VGFncyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcmF3VGFncy5zcGxpdCgvW1xccyxdKy8pLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkocmF3VGFncykpIHtcbiAgICByZXR1cm4gcmF3VGFnc1xuICAgICAgLmZpbHRlcigoZW50cnkpOiBlbnRyeSBpcyBzdHJpbmcgPT4gdHlwZW9mIGVudHJ5ID09PSAnc3RyaW5nJylcbiAgICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS50cmltKCkpXG4gICAgICAuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkubGVuZ3RoID4gMCk7XG4gIH1cblxuICByZXR1cm4gW107XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBTb3VyY2VTZWxlY3Rpb25SdWxlcyB9IGZyb20gJy4uLy4uL3BpcGVsaW5lL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XG5cbnR5cGUgRmlsZVByZWRpY2F0ZSA9IChmaWxlOiBURmlsZSkgPT4gYm9vbGVhbjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVQYXRoUHJlZGljYXRlKHJ1bGVzOiBTb3VyY2VTZWxlY3Rpb25SdWxlcyk6IEZpbGVQcmVkaWNhdGUgfCBudWxsIHtcbiAgY29uc3QgcGF0aFJ1bGVzID0gcnVsZXMucGF0aFJ1bGVzO1xuICBpZiAoIXBhdGhSdWxlcykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZm9sZGVyUHJlZml4ZXMgPSAocGF0aFJ1bGVzLmZvbGRlclByZWZpeGVzID8/IFtdKS5tYXAoKHByZWZpeCkgPT4gcHJlZml4LnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBleGFjdEZvbGRlcnMgPSBuZXcgU2V0KChwYXRoUnVsZXMuZXhhY3RGb2xkZXJzID8/IFtdKS5tYXAoKGZvbGRlcikgPT4gZm9sZGVyLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pKTtcbiAgY29uc3Qgc3ViZm9sZGVyUm9vdHMgPSAocGF0aFJ1bGVzLnN1YmZvbGRlclJvb3RzID8/IFtdKS5tYXAoKHJvb3QpID0+IHJvb3QudHJpbSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gIGNvbnN0IGZpbGVuYW1lRXF1YWxzID0gbmV3IFNldCgocGF0aFJ1bGVzLmZpbGVuYW1lRXF1YWxzID8/IFtdKS5tYXAoKG5hbWUpID0+IG5hbWUudHJpbSgpLnRvTG93ZXJDYXNlKCkpLmZpbHRlcihCb29sZWFuKSk7XG4gIGNvbnN0IGV4dGVuc2lvblNldCA9IG5ldyBTZXQoKHBhdGhSdWxlcy5leHRlbnNpb25zID8/IFtdKVxuICAgIC5tYXAoKGV4dGVuc2lvbikgPT4gZXh0ZW5zaW9uLnRyaW0oKS5yZXBsYWNlKC9eXFwuLywgJycpLnRvTG93ZXJDYXNlKCkpXG4gICAgLmZpbHRlcihCb29sZWFuKSk7XG5cbiAgbGV0IGZpbGVuYW1lUmVnZXg6IFJlZ0V4cCB8IG51bGwgPSBudWxsO1xuICBjb25zdCByZWdleFNvdXJjZSA9IHBhdGhSdWxlcy5maWxlbmFtZVJlZ2V4Py50cmltKCk7XG4gIGlmIChyZWdleFNvdXJjZSkge1xuICAgIHRyeSB7XG4gICAgICBmaWxlbmFtZVJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFNvdXJjZSwgJ2knKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIGZpbGVuYW1lUmVnZXggPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhhc0NvbnN0cmFpbnRzID0gZm9sZGVyUHJlZml4ZXMubGVuZ3RoID4gMFxuICAgIHx8IGV4YWN0Rm9sZGVycy5zaXplID4gMFxuICAgIHx8IHN1YmZvbGRlclJvb3RzLmxlbmd0aCA+IDBcbiAgICB8fCBmaWxlbmFtZUVxdWFscy5zaXplID4gMFxuICAgIHx8IGV4dGVuc2lvblNldC5zaXplID4gMFxuICAgIHx8IGZpbGVuYW1lUmVnZXggIT09IG51bGw7XG4gIGlmICghaGFzQ29uc3RyYWludHMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoZmlsZTogVEZpbGUpID0+IHtcbiAgICBjb25zdCBwYXJlbnRGb2xkZXIgPSBnZXRQYXJlbnRGb2xkZXIoZmlsZS5wYXRoKTtcblxuICAgIGlmIChmb2xkZXJQcmVmaXhlcy5sZW5ndGggPiAwICYmICFmb2xkZXJQcmVmaXhlcy5zb21lKChwcmVmaXgpID0+IGZpbGUucGF0aC5zdGFydHNXaXRoKHByZWZpeCkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGV4YWN0Rm9sZGVycy5zaXplID4gMCAmJiAhZXhhY3RGb2xkZXJzLmhhcyhwYXJlbnRGb2xkZXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHN1YmZvbGRlclJvb3RzLmxlbmd0aCA+IDAgJiYgIXN1YmZvbGRlclJvb3RzLnNvbWUoKHJvb3QpID0+IGlzSW5TdWJmb2xkZXIoZmlsZS5wYXRoLCByb290KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZmlsZW5hbWVFcXVhbHMuc2l6ZSA+IDApIHtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRCYXNlbmFtZSA9IGZpbGUuYmFzZW5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWROYW1lID0gZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoIWZpbGVuYW1lRXF1YWxzLmhhcyhub3JtYWxpemVkQmFzZW5hbWUpICYmICFmaWxlbmFtZUVxdWFscy5oYXMobm9ybWFsaXplZE5hbWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZmlsZW5hbWVSZWdleCAmJiAhZmlsZW5hbWVSZWdleC50ZXN0KGZpbGUuYmFzZW5hbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGV4dGVuc2lvblNldC5zaXplID4gMCkge1xuICAgICAgY29uc3QgZXh0ZW5zaW9uID0gZmlsZS5leHRlbnNpb24ucmVwbGFjZSgvXlxcLi8sICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKCFleHRlbnNpb25TZXQuaGFzKGV4dGVuc2lvbikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRQYXJlbnRGb2xkZXIocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSBwYXRoLmxhc3RJbmRleE9mKCcvJyk7XG4gIGlmIChzZXBhcmF0b3JJbmRleCA8IDApIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXR1cm4gcGF0aC5zbGljZSgwLCBzZXBhcmF0b3JJbmRleCk7XG59XG5cbmZ1bmN0aW9uIGlzSW5TdWJmb2xkZXIocGF0aDogc3RyaW5nLCByb290OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFyb290KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFwYXRoLnN0YXJ0c1dpdGgoYCR7cm9vdH0vYCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCByZWxhdGl2ZVBhdGggPSBwYXRoLnNsaWNlKHJvb3QubGVuZ3RoICsgMSk7XG4gIHJldHVybiByZWxhdGl2ZVBhdGguaW5jbHVkZXMoJy8nKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFwcCwgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IFRhZ01hdGNoTW9kZSB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgU291cmNlU2VsZWN0aW9uUnVsZXMgfSBmcm9tICcuLi8uLi9waXBlbGluZS90eXBlcyc7XG5pbXBvcnQgeyBub3JtYWxpemVUYWcgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XG5cbnR5cGUgRmlsZVByZWRpY2F0ZSA9IChmaWxlOiBURmlsZSkgPT4gYm9vbGVhbjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVUYWdQcmVkaWNhdGUoYXBwOiBBcHAsIHJ1bGVzOiBTb3VyY2VTZWxlY3Rpb25SdWxlcyk6IEZpbGVQcmVkaWNhdGUgfCBudWxsIHtcbiAgY29uc3QgaW5jbHVkZVRhZ3MgPSAocnVsZXMuaW5jbHVkZVRhZ3MgPz8gW10pLm1hcCgodGFnKSA9PiBub3JtYWxpemVUYWcodGFnKSkuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBleGNsdWRlVGFncyA9IChydWxlcy5leGNsdWRlVGFncyA/PyBbXSkubWFwKCh0YWcpID0+IG5vcm1hbGl6ZVRhZyh0YWcpKS5maWx0ZXIoQm9vbGVhbik7XG4gIGNvbnN0IGluY2x1ZGVUYWdQcmVmaXhlcyA9IChydWxlcy5pbmNsdWRlVGFnUHJlZml4ZXMgPz8gW10pLm1hcCgodGFnKSA9PiBub3JtYWxpemVUYWcodGFnKSkuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBleGNsdWRlVGFnUHJlZml4ZXMgPSAocnVsZXMuZXhjbHVkZVRhZ1ByZWZpeGVzID8/IFtdKS5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpLmZpbHRlcihCb29sZWFuKTtcblxuICBpZiAoXG4gICAgaW5jbHVkZVRhZ3MubGVuZ3RoID09PSAwXG4gICAgJiYgZXhjbHVkZVRhZ3MubGVuZ3RoID09PSAwXG4gICAgJiYgaW5jbHVkZVRhZ1ByZWZpeGVzLmxlbmd0aCA9PT0gMFxuICAgICYmIGV4Y2x1ZGVUYWdQcmVmaXhlcy5sZW5ndGggPT09IDBcbiAgKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBpbmNsdWRlU2V0ID0gbmV3IFNldChpbmNsdWRlVGFncyk7XG4gIGNvbnN0IGV4Y2x1ZGVTZXQgPSBuZXcgU2V0KGV4Y2x1ZGVUYWdzKTtcbiAgY29uc3QgdGFnTWF0Y2hNb2RlID0gcnVsZXMudGFnTWF0Y2hNb2RlID8/ICdhbnknO1xuICBjb25zdCB0YWdQcmVmaXhNYXRjaE1vZGUgPSBydWxlcy50YWdQcmVmaXhNYXRjaE1vZGUgPz8gJ2FueSc7XG5cbiAgcmV0dXJuIChmaWxlOiBURmlsZSkgPT4ge1xuICAgIGNvbnN0IGZpbGVUYWdzID0gZ2V0Tm9ybWFsaXplZEZpbGVUYWdzKGFwcCwgZmlsZSk7XG4gICAgaWYgKGluY2x1ZGVTZXQuc2l6ZSA+IDAgJiYgIW1hdGNoZXNUYWdTZXQoZmlsZVRhZ3MsIGluY2x1ZGVUYWdzLCB0YWdNYXRjaE1vZGUsIGZhbHNlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChleGNsdWRlU2V0LnNpemUgPiAwICYmIG1hdGNoZXNUYWdTZXQoZmlsZVRhZ3MsIGV4Y2x1ZGVUYWdzLCAnYW55JywgZmFsc2UpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGluY2x1ZGVUYWdQcmVmaXhlcy5sZW5ndGggPiAwICYmICFtYXRjaGVzVGFnU2V0KGZpbGVUYWdzLCBpbmNsdWRlVGFnUHJlZml4ZXMsIHRhZ1ByZWZpeE1hdGNoTW9kZSwgdHJ1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZXhjbHVkZVRhZ1ByZWZpeGVzLmxlbmd0aCA+IDAgJiYgbWF0Y2hlc1RhZ1NldChmaWxlVGFncywgZXhjbHVkZVRhZ1ByZWZpeGVzLCAnYW55JywgdHJ1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1RhZ1NldChmaWxlVGFnczogU2V0PHN0cmluZz4sIGNvbnN0cmFpbnRzOiBzdHJpbmdbXSwgbW9kZTogVGFnTWF0Y2hNb2RlLCB1c2VQcmVmaXhNYXRjaDogYm9vbGVhbik6IGJvb2xlYW4ge1xuICBpZiAoY29uc3RyYWludHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjb25zdCBtYXRjaGVzVGFnID0gKGNvbnN0cmFpbnQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICghdXNlUHJlZml4TWF0Y2gpIHtcbiAgICAgIHJldHVybiBmaWxlVGFncy5oYXMoY29uc3RyYWludCk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCB0YWcgb2YgZmlsZVRhZ3MpIHtcbiAgICAgIGlmICh0YWcuc3RhcnRzV2l0aChjb25zdHJhaW50KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgaWYgKG1vZGUgPT09ICdhbGwnKSB7XG4gICAgcmV0dXJuIGNvbnN0cmFpbnRzLmV2ZXJ5KG1hdGNoZXNUYWcpO1xuICB9XG5cbiAgcmV0dXJuIGNvbnN0cmFpbnRzLnNvbWUobWF0Y2hlc1RhZyk7XG59XG5cbmZ1bmN0aW9uIGdldE5vcm1hbGl6ZWRGaWxlVGFncyhhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBTZXQ8c3RyaW5nPiB7XG4gIGNvbnN0IGNhY2hlID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xuICBpZiAoIWNhY2hlPy50YWdzKSB7XG4gICAgcmV0dXJuIG5ldyBTZXQoKTtcbiAgfVxuXG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSBjYWNoZS50YWdzXG4gICAgLm1hcCgoZW50cnkpID0+IG5vcm1hbGl6ZVRhZyhlbnRyeS50YWcpKVxuICAgIC5maWx0ZXIoQm9vbGVhbik7XG4gIHJldHVybiBuZXcgU2V0KG5vcm1hbGl6ZWQpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgRGF0ZVJhbmdlUnVsZSwgU291cmNlU2VsZWN0aW9uUnVsZXMgfSBmcm9tICcuLi8uLi9waXBlbGluZS90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG50eXBlIEZpbGVQcmVkaWNhdGUgPSAoZmlsZTogVEZpbGUpID0+IGJvb2xlYW47XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlRGF0ZVByZWRpY2F0ZShydWxlczogU291cmNlU2VsZWN0aW9uUnVsZXMpOiBGaWxlUHJlZGljYXRlIHwgbnVsbCB7XG4gIGNvbnN0IGhhc01vZGlmaWVkUnVsZSA9IGhhc0RhdGVSdWxlKHJ1bGVzLm1vZGlmaWVkVGltZSk7XG4gIGNvbnN0IGhhc0NyZWF0ZWRSdWxlID0gaGFzRGF0ZVJ1bGUocnVsZXMuY3JlYXRlZFRpbWUpO1xuICBpZiAoIWhhc01vZGlmaWVkUnVsZSAmJiAhaGFzQ3JlYXRlZFJ1bGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoZmlsZTogVEZpbGUpID0+IHtcbiAgICBpZiAoaGFzTW9kaWZpZWRSdWxlICYmICFtYXRjaGVzRGF0ZVJ1bGUoZmlsZS5zdGF0Lm10aW1lLCBydWxlcy5tb2RpZmllZFRpbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGhhc0NyZWF0ZWRSdWxlICYmICFtYXRjaGVzRGF0ZVJ1bGUoZmlsZS5zdGF0LmN0aW1lLCBydWxlcy5jcmVhdGVkVGltZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaGFzRGF0ZVJ1bGUocnVsZTogRGF0ZVJhbmdlUnVsZSB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xuICBpZiAoIXJ1bGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKHJ1bGUuYmVmb3JlKVxuICAgIHx8IE51bWJlci5pc0Zpbml0ZShydWxlLmFmdGVyKVxuICAgIHx8IChydWxlLmJldHdlZW4gIT09IHVuZGVmaW5lZFxuICAgICAgJiYgTnVtYmVyLmlzRmluaXRlKHJ1bGUuYmV0d2Vlbi5zdGFydClcbiAgICAgICYmIE51bWJlci5pc0Zpbml0ZShydWxlLmJldHdlZW4uZW5kKSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNEYXRlUnVsZSh2YWx1ZTogbnVtYmVyLCBydWxlOiBEYXRlUmFuZ2VSdWxlIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gIGlmICghcnVsZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKE51bWJlci5pc0Zpbml0ZShydWxlLmJlZm9yZSkgJiYgISh2YWx1ZSA8IE51bWJlcihydWxlLmJlZm9yZSkpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE51bWJlci5pc0Zpbml0ZShydWxlLmFmdGVyKSAmJiAhKHZhbHVlID4gTnVtYmVyKHJ1bGUuYWZ0ZXIpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChydWxlLmJldHdlZW4gJiYgTnVtYmVyLmlzRmluaXRlKHJ1bGUuYmV0d2Vlbi5zdGFydCkgJiYgTnVtYmVyLmlzRmluaXRlKHJ1bGUuYmV0d2Vlbi5lbmQpKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBNYXRoLm1pbihydWxlLmJldHdlZW4uc3RhcnQsIHJ1bGUuYmV0d2Vlbi5lbmQpO1xuICAgIGNvbnN0IGVuZCA9IE1hdGgubWF4KHJ1bGUuYmV0d2Vlbi5zdGFydCwgcnVsZS5iZXR3ZWVuLmVuZCk7XG4gICAgaWYgKHZhbHVlIDwgc3RhcnQgfHwgdmFsdWUgPiBlbmQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFwcCwgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IFNvdXJjZVNlbGVjdGlvblJ1bGVzIH0gZnJvbSAnLi4vLi4vcGlwZWxpbmUvdHlwZXMnO1xuXG50eXBlIEZpbGVQcmVkaWNhdGUgPSAoZmlsZTogVEZpbGUpID0+IGJvb2xlYW47XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlRnJvbnRtYXR0ZXJQcmVkaWNhdGUoYXBwOiBBcHAsIHJ1bGVzOiBTb3VyY2VTZWxlY3Rpb25SdWxlcyk6IEZpbGVQcmVkaWNhdGUgfCBudWxsIHtcbiAgY29uc3QgZnJvbnRtYXR0ZXJSdWxlcyA9IChydWxlcy5mcm9udG1hdHRlclJ1bGVzID8/IFtdKS5maWx0ZXIoKHJ1bGUpID0+IHJ1bGUua2V5LnRyaW0oKS5sZW5ndGggPiAwKTtcbiAgaWYgKGZyb250bWF0dGVyUnVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgY29uc3QgY2FjaGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gICAgY29uc3QgZnJvbnRtYXR0ZXIgPSBjYWNoZT8uZnJvbnRtYXR0ZXIgJiYgdHlwZW9mIGNhY2hlLmZyb250bWF0dGVyID09PSAnb2JqZWN0J1xuICAgICAgPyAoY2FjaGUuZnJvbnRtYXR0ZXIgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pXG4gICAgICA6IHt9O1xuICAgIHJldHVybiBtYXRjaGVzRnJvbnRtYXR0ZXJSdWxlcyhmcm9udG1hdHRlciwgZnJvbnRtYXR0ZXJSdWxlcyk7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXRjaGVzRnJvbnRtYXR0ZXJSdWxlcyhcbiAgZnJvbnRtYXR0ZXI6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICBydWxlczogU291cmNlU2VsZWN0aW9uUnVsZXNbJ2Zyb250bWF0dGVyUnVsZXMnXSxcbik6IGJvb2xlYW4ge1xuICBpZiAoIXJ1bGVzKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gcnVsZXMuZXZlcnkoKHJ1bGUpID0+IHtcbiAgICBjb25zdCBrZXkgPSBydWxlLmtleS50cmltKCk7XG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdHVhbCA9IGZyb250bWF0dGVyW2tleV07XG4gICAgY29uc3QgZXhwZWN0ZWQgPSAocnVsZS52YWx1ZSA/PyAnJykudHJpbSgpO1xuXG4gICAgaWYgKHJ1bGUub3BlcmF0b3IgPT09ICdleGlzdHMnKSB7XG4gICAgICByZXR1cm4gYWN0dWFsICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnbm90LWV4aXN0cycpIHtcbiAgICAgIHJldHVybiBhY3R1YWwgPT09IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoYWN0dWFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ2NvbnRhaW5zJykge1xuICAgICAgcmV0dXJuIGNvbnRhaW5zVmFsdWUoYWN0dWFsLCBleHBlY3RlZCk7XG4gICAgfVxuXG4gICAgaWYgKHJ1bGUub3BlcmF0b3IgPT09ICdlcXVhbHMnKSB7XG4gICAgICByZXR1cm4gY29tcGFyZVNjYWxhcihhY3R1YWwsIGV4cGVjdGVkKSA9PT0gMDtcbiAgICB9XG4gICAgaWYgKHJ1bGUub3BlcmF0b3IgPT09ICdub3QtZXF1YWxzJykge1xuICAgICAgcmV0dXJuIGNvbXBhcmVTY2FsYXIoYWN0dWFsLCBleHBlY3RlZCkgIT09IDA7XG4gICAgfVxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnZ3QnKSB7XG4gICAgICByZXR1cm4gY29tcGFyZVNjYWxhcihhY3R1YWwsIGV4cGVjdGVkKSA+IDA7XG4gICAgfVxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnZ3RlJykge1xuICAgICAgcmV0dXJuIGNvbXBhcmVTY2FsYXIoYWN0dWFsLCBleHBlY3RlZCkgPj0gMDtcbiAgICB9XG4gICAgaWYgKHJ1bGUub3BlcmF0b3IgPT09ICdsdCcpIHtcbiAgICAgIHJldHVybiBjb21wYXJlU2NhbGFyKGFjdHVhbCwgZXhwZWN0ZWQpIDwgMDtcbiAgICB9XG4gICAgaWYgKHJ1bGUub3BlcmF0b3IgPT09ICdsdGUnKSB7XG4gICAgICByZXR1cm4gY29tcGFyZVNjYWxhcihhY3R1YWwsIGV4cGVjdGVkKSA8PSAwO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY29udGFpbnNWYWx1ZShhY3R1YWw6IHVua25vd24sIGV4cGVjdGVkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3Qgbm9ybWFsaXplZEV4cGVjdGVkID0gZXhwZWN0ZWQudG9Mb3dlckNhc2UoKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYWN0dWFsKSkge1xuICAgIHJldHVybiBhY3R1YWwuc29tZSgoZW50cnkpID0+IFN0cmluZyhlbnRyeSkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhub3JtYWxpemVkRXhwZWN0ZWQpKTtcbiAgfVxuXG4gIHJldHVybiBTdHJpbmcoYWN0dWFsKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKG5vcm1hbGl6ZWRFeHBlY3RlZCk7XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVTY2FsYXIoYWN0dWFsOiB1bmtub3duLCBleHBlY3RlZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgaWYgKGlzTnVsbExpa2UoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGlzTnVsbExpa2UoYWN0dWFsKSA/IDAgOiAxO1xuICB9XG5cbiAgY29uc3QgbnVtZXJpY0FjdHVhbCA9IHRyeVBhcnNlTnVtYmVyKGFjdHVhbCk7XG4gIGNvbnN0IG51bWVyaWNFeHBlY3RlZCA9IHRyeVBhcnNlTnVtYmVyKGV4cGVjdGVkKTtcbiAgaWYgKG51bWVyaWNBY3R1YWwgIT09IG51bGwgJiYgbnVtZXJpY0V4cGVjdGVkICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bWVyaWNBY3R1YWwgLSBudW1lcmljRXhwZWN0ZWQ7XG4gIH1cblxuICBjb25zdCBkYXRlQWN0dWFsID0gdHJ5UGFyc2VEYXRlKGFjdHVhbCk7XG4gIGNvbnN0IGRhdGVFeHBlY3RlZCA9IHRyeVBhcnNlRGF0ZShleHBlY3RlZCk7XG4gIGlmIChkYXRlQWN0dWFsICE9PSBudWxsICYmIGRhdGVFeHBlY3RlZCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBkYXRlQWN0dWFsIC0gZGF0ZUV4cGVjdGVkO1xuICB9XG5cbiAgY29uc3QgYm9vbGVhbkFjdHVhbCA9IHRyeVBhcnNlQm9vbGVhbihhY3R1YWwpO1xuICBjb25zdCBib29sZWFuRXhwZWN0ZWQgPSB0cnlQYXJzZUJvb2xlYW4oZXhwZWN0ZWQpO1xuICBpZiAoYm9vbGVhbkFjdHVhbCAhPT0gbnVsbCAmJiBib29sZWFuRXhwZWN0ZWQgIT09IG51bGwpIHtcbiAgICBpZiAoYm9vbGVhbkFjdHVhbCA9PT0gYm9vbGVhbkV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIGJvb2xlYW5BY3R1YWwgPyAxIDogLTE7XG4gIH1cblxuICByZXR1cm4gU3RyaW5nKGFjdHVhbCkubG9jYWxlQ29tcGFyZShleHBlY3RlZCwgdW5kZWZpbmVkLCB7IHNlbnNpdGl2aXR5OiAnYmFzZScsIG51bWVyaWM6IHRydWUgfSk7XG59XG5cbmZ1bmN0aW9uIGlzTnVsbExpa2UodmFsdWU6IHVua25vd24pOiBib29sZWFuIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qgbm9ybWFsaXplZCA9IHZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gbm9ybWFsaXplZCA9PT0gJ251bGwnIHx8IG5vcm1hbGl6ZWQgPT09ICd+JyB8fCBub3JtYWxpemVkID09PSAnbmlsJztcbn1cblxuZnVuY3Rpb24gdHJ5UGFyc2VOdW1iZXIodmFsdWU6IHVua25vd24pOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzRmluaXRlKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcGFyc2VkID0gTnVtYmVyKHZhbHVlKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHBhcnNlZCkpIHtcbiAgICAgIHJldHVybiBwYXJzZWQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHRyeVBhcnNlRGF0ZSh2YWx1ZTogdW5rbm93bik6IG51bWJlciB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IHZhbHVlLmdldFRpbWUoKTtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKHRpbWVzdGFtcCkgPyBudWxsIDogdGltZXN0YW1wO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBwYXJzZWQgPSBEYXRlLnBhcnNlKHZhbHVlKTtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKHBhcnNlZCkgPyBudWxsIDogcGFyc2VkO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHRyeVBhcnNlQm9vbGVhbih2YWx1ZTogdW5rbm93bik6IGJvb2xlYW4gfCBudWxsIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBub3JtYWxpemVkID0gdmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKG5vcm1hbGl6ZWQgPT09ICd0cnVlJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChub3JtYWxpemVkID09PSAnZmFsc2UnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBcHAsIFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHR5cGUgeyBUYWdNYXRjaE1vZGUgfSBmcm9tICcuLi8uLi8uLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IExpbmtSdWxlcywgU291cmNlU2VsZWN0aW9uUnVsZXMgfSBmcm9tICcuLi8uLi9waXBlbGluZS90eXBlcyc7XG5pbXBvcnQgeyBnZXRGaWxlVGFncyB9IGZyb20gJy4uL29ic2lkaWFuLXNvdXJjZSc7XG5pbXBvcnQgeyBub3JtYWxpemVUYWcgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XG5cbnR5cGUgRmlsZVByZWRpY2F0ZSA9IChmaWxlOiBURmlsZSkgPT4gYm9vbGVhbjtcblxudHlwZSBMaW5rSW5kZXggPSB7XG4gIHRhcmdldHNCeVNvdXJjZTogTWFwPHN0cmluZywgc3RyaW5nW10+O1xuICB0b3RhbEJ5U291cmNlOiBNYXA8c3RyaW5nLCBudW1iZXI+O1xuICBzb3VyY2VzQnlUYXJnZXQ6IE1hcDxzdHJpbmcsIHN0cmluZ1tdPjtcbiAgdG90YWxCeVRhcmdldDogTWFwPHN0cmluZywgbnVtYmVyPjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlT3V0Z29pbmdMaW5rUHJlZGljYXRlKGFwcDogQXBwLCBydWxlczogU291cmNlU2VsZWN0aW9uUnVsZXMpOiBGaWxlUHJlZGljYXRlIHwgbnVsbCB7XG4gIGNvbnN0IGNvbnN0cmFpbnRzID0gbm9ybWFsaXplTGlua1J1bGVzKHJ1bGVzLm91dGdvaW5nTGlua3MpO1xuICBpZiAoIWNvbnN0cmFpbnRzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBsaW5rSW5kZXggPSBidWlsZExpbmtJbmRleChhcHApO1xuICBjb25zdCB0YWdDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBTZXQ8c3RyaW5nPj4oKTtcblxuICByZXR1cm4gKGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgY29uc3QgbGlua2VkVGFyZ2V0cyA9IGxpbmtJbmRleC50YXJnZXRzQnlTb3VyY2UuZ2V0KGZpbGUucGF0aCkgPz8gW107XG4gICAgY29uc3QgdG90YWxMaW5rQ291bnQgPSBsaW5rSW5kZXgudG90YWxCeVNvdXJjZS5nZXQoZmlsZS5wYXRoKSA/PyAwO1xuXG4gICAgaWYgKCFtYXRjaGVzTGlua0NvbnN0cmFpbnRzKGFwcCwgbGlua2VkVGFyZ2V0cywgdG90YWxMaW5rQ291bnQsIGNvbnN0cmFpbnRzLCB0YWdDYWNoZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVJbmNvbWluZ0xpbmtQcmVkaWNhdGUoYXBwOiBBcHAsIHJ1bGVzOiBTb3VyY2VTZWxlY3Rpb25SdWxlcyk6IEZpbGVQcmVkaWNhdGUgfCBudWxsIHtcbiAgY29uc3QgY29uc3RyYWludHMgPSBub3JtYWxpemVMaW5rUnVsZXMocnVsZXMuaW5jb21pbmdMaW5rcyk7XG4gIGlmICghY29uc3RyYWludHMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGxpbmtJbmRleCA9IGJ1aWxkTGlua0luZGV4KGFwcCk7XG4gIGNvbnN0IHRhZ0NhY2hlID0gbmV3IE1hcDxzdHJpbmcsIFNldDxzdHJpbmc+PigpO1xuXG4gIHJldHVybiAoZmlsZTogVEZpbGUpID0+IHtcbiAgICBjb25zdCBzb3VyY2VQYXRocyA9IGxpbmtJbmRleC5zb3VyY2VzQnlUYXJnZXQuZ2V0KGZpbGUucGF0aCkgPz8gW107XG4gICAgY29uc3QgdG90YWxMaW5rQ291bnQgPSBsaW5rSW5kZXgudG90YWxCeVRhcmdldC5nZXQoZmlsZS5wYXRoKSA/PyAwO1xuXG4gICAgaWYgKCFtYXRjaGVzTGlua0NvbnN0cmFpbnRzKGFwcCwgc291cmNlUGF0aHMsIHRvdGFsTGlua0NvdW50LCBjb25zdHJhaW50cywgdGFnQ2FjaGUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG59XG5cbnR5cGUgTm9ybWFsaXplZExpbmtSdWxlcyA9IHtcbiAgZmlsZVBhdGhzOiBTZXQ8c3RyaW5nPjtcbiAgZm9sZGVyUHJlZml4ZXM6IHN0cmluZ1tdO1xuICBtaW5Db3VudD86IG51bWJlcjtcbiAgbWF4Q291bnQ/OiBudW1iZXI7XG4gIHdpdGhUYWdzOiBzdHJpbmdbXTtcbiAgdGFnTWF0Y2hNb2RlOiBUYWdNYXRjaE1vZGU7XG59O1xuXG5mdW5jdGlvbiBub3JtYWxpemVMaW5rUnVsZXMocnVsZXM6IExpbmtSdWxlcyB8IHVuZGVmaW5lZCk6IE5vcm1hbGl6ZWRMaW5rUnVsZXMgfCBudWxsIHtcbiAgaWYgKCFydWxlcykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgZmlsZVBhdGhzID0gbmV3IFNldCgocnVsZXMuZmlsZVBhdGhzID8/IFtdKS5tYXAoKHBhdGgpID0+IHBhdGgudHJpbSgpKS5maWx0ZXIoQm9vbGVhbikpO1xuICBjb25zdCBmb2xkZXJQcmVmaXhlcyA9IChydWxlcy5mb2xkZXJQcmVmaXhlcyA/PyBbXSkubWFwKChwcmVmaXgpID0+IHByZWZpeC50cmltKCkpLmZpbHRlcihCb29sZWFuKTtcbiAgY29uc3Qgd2l0aFRhZ3MgPSAocnVsZXMud2l0aFRhZ3MgPz8gW10pLm1hcCgodGFnKSA9PiBub3JtYWxpemVUYWcodGFnKSkuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIGNvbnN0IG1pbkNvdW50ID0gTnVtYmVyLmlzRmluaXRlKHJ1bGVzLm1pbkNvdW50KSA/IE1hdGgubWF4KDAsIE51bWJlcihydWxlcy5taW5Db3VudCkpIDogdW5kZWZpbmVkO1xuICBjb25zdCBtYXhDb3VudCA9IE51bWJlci5pc0Zpbml0ZShydWxlcy5tYXhDb3VudCkgPyBNYXRoLm1heCgwLCBOdW1iZXIocnVsZXMubWF4Q291bnQpKSA6IHVuZGVmaW5lZDtcblxuICBjb25zdCBoYXNDb25zdHJhaW50cyA9IGZpbGVQYXRocy5zaXplID4gMFxuICAgIHx8IGZvbGRlclByZWZpeGVzLmxlbmd0aCA+IDBcbiAgICB8fCBtaW5Db3VudCAhPT0gdW5kZWZpbmVkXG4gICAgfHwgbWF4Q291bnQgIT09IHVuZGVmaW5lZFxuICAgIHx8IHdpdGhUYWdzLmxlbmd0aCA+IDA7XG4gIGlmICghaGFzQ29uc3RyYWludHMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZmlsZVBhdGhzLFxuICAgIGZvbGRlclByZWZpeGVzLFxuICAgIG1pbkNvdW50LFxuICAgIG1heENvdW50LFxuICAgIHdpdGhUYWdzLFxuICAgIHRhZ01hdGNoTW9kZTogcnVsZXMudGFnTWF0Y2hNb2RlID09PSAnYWxsJyA/ICdhbGwnIDogJ2FueScsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkTGlua0luZGV4KGFwcDogQXBwKTogTGlua0luZGV4IHtcbiAgY29uc3QgdGFyZ2V0c0J5U291cmNlID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICBjb25zdCB0b3RhbEJ5U291cmNlID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgY29uc3Qgc291cmNlc0J5VGFyZ2V0ID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICBjb25zdCB0b3RhbEJ5VGFyZ2V0ID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcblxuICBjb25zdCByZXNvbHZlZExpbmtzID0gYXBwLm1ldGFkYXRhQ2FjaGUucmVzb2x2ZWRMaW5rcyA/PyB7fTtcbiAgZm9yIChjb25zdCBbc291cmNlUGF0aCwgZGVzdGluYXRpb25zXSBvZiBPYmplY3QuZW50cmllcyhyZXNvbHZlZExpbmtzKSkge1xuICAgIGNvbnN0IHRhcmdldFBhdGhzID0gT2JqZWN0LmtleXMoZGVzdGluYXRpb25zKTtcbiAgICB0YXJnZXRzQnlTb3VyY2Uuc2V0KHNvdXJjZVBhdGgsIHRhcmdldFBhdGhzKTtcblxuICAgIGxldCB0b3RhbE91dGdvaW5nID0gMDtcbiAgICBmb3IgKGNvbnN0IFt0YXJnZXRQYXRoLCBjb3VudF0gb2YgT2JqZWN0LmVudHJpZXMoZGVzdGluYXRpb25zKSkge1xuICAgICAgY29uc3Qgc2FmZUNvdW50ID0gTnVtYmVyLmlzRmluaXRlKGNvdW50KSA/IE1hdGgubWF4KDAsIGNvdW50KSA6IDA7XG4gICAgICB0b3RhbE91dGdvaW5nICs9IHNhZmVDb3VudDtcblxuICAgICAgY29uc3QgY3VycmVudFNvdXJjZXMgPSBzb3VyY2VzQnlUYXJnZXQuZ2V0KHRhcmdldFBhdGgpID8/IFtdO1xuICAgICAgaWYgKCFjdXJyZW50U291cmNlcy5pbmNsdWRlcyhzb3VyY2VQYXRoKSkge1xuICAgICAgICBjdXJyZW50U291cmNlcy5wdXNoKHNvdXJjZVBhdGgpO1xuICAgICAgICBzb3VyY2VzQnlUYXJnZXQuc2V0KHRhcmdldFBhdGgsIGN1cnJlbnRTb3VyY2VzKTtcbiAgICAgIH1cbiAgICAgIHRvdGFsQnlUYXJnZXQuc2V0KHRhcmdldFBhdGgsICh0b3RhbEJ5VGFyZ2V0LmdldCh0YXJnZXRQYXRoKSA/PyAwKSArIHNhZmVDb3VudCk7XG4gICAgfVxuXG4gICAgdG90YWxCeVNvdXJjZS5zZXQoc291cmNlUGF0aCwgdG90YWxPdXRnb2luZyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRhcmdldHNCeVNvdXJjZSxcbiAgICB0b3RhbEJ5U291cmNlLFxuICAgIHNvdXJjZXNCeVRhcmdldCxcbiAgICB0b3RhbEJ5VGFyZ2V0LFxuICB9O1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzTGlua0NvbnN0cmFpbnRzKFxuICBhcHA6IEFwcCxcbiAgbGlua2VkUGF0aHM6IHN0cmluZ1tdLFxuICB0b3RhbExpbmtDb3VudDogbnVtYmVyLFxuICBydWxlczogTm9ybWFsaXplZExpbmtSdWxlcyxcbiAgdGFnQ2FjaGU6IE1hcDxzdHJpbmcsIFNldDxzdHJpbmc+Pixcbik6IGJvb2xlYW4ge1xuICBpZiAocnVsZXMubWluQ291bnQgIT09IHVuZGVmaW5lZCAmJiB0b3RhbExpbmtDb3VudCA8IHJ1bGVzLm1pbkNvdW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHJ1bGVzLm1heENvdW50ICE9PSB1bmRlZmluZWQgJiYgdG90YWxMaW5rQ291bnQgPiBydWxlcy5tYXhDb3VudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChydWxlcy5maWxlUGF0aHMuc2l6ZSA+IDAgJiYgIWxpbmtlZFBhdGhzLnNvbWUoKHBhdGgpID0+IHJ1bGVzLmZpbGVQYXRocy5oYXMocGF0aCkpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHJ1bGVzLmZvbGRlclByZWZpeGVzLmxlbmd0aCA+IDAgJiYgIWxpbmtlZFBhdGhzLnNvbWUoKHBhdGgpID0+IGlzUGF0aEluRm9sZGVyKHBhdGgsIHJ1bGVzLmZvbGRlclByZWZpeGVzKSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocnVsZXMud2l0aFRhZ3MubGVuZ3RoID4gMCAmJiAhbGlua2VkUGF0aHMuc29tZSgocGF0aCkgPT4gbGlua2VkRmlsZU1hdGNoZXNUYWdzKGFwcCwgcGF0aCwgcnVsZXMsIHRhZ0NhY2hlKSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gbGlua2VkRmlsZU1hdGNoZXNUYWdzKFxuICBhcHA6IEFwcCxcbiAgcGF0aDogc3RyaW5nLFxuICBydWxlczogTm9ybWFsaXplZExpbmtSdWxlcyxcbiAgdGFnQ2FjaGU6IE1hcDxzdHJpbmcsIFNldDxzdHJpbmc+Pixcbik6IGJvb2xlYW4ge1xuICBjb25zdCBmaWxlID0gYXNURmlsZShhcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpKTtcbiAgaWYgKCFmaWxlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbGV0IHRhZ3MgPSB0YWdDYWNoZS5nZXQocGF0aCk7XG4gIGlmICghdGFncykge1xuICAgIHRhZ3MgPSBuZXcgU2V0KGdldEZpbGVUYWdzKGFwcCwgZmlsZSkpO1xuICAgIHRhZ0NhY2hlLnNldChwYXRoLCB0YWdzKTtcbiAgfVxuXG4gIGlmIChydWxlcy50YWdNYXRjaE1vZGUgPT09ICdhbGwnKSB7XG4gICAgcmV0dXJuIHJ1bGVzLndpdGhUYWdzLmV2ZXJ5KCh0YWcpID0+IHRhZ3MuaGFzKHRhZykpO1xuICB9XG5cbiAgcmV0dXJuIHJ1bGVzLndpdGhUYWdzLnNvbWUoKHRhZykgPT4gdGFncy5oYXModGFnKSk7XG59XG5cbmZ1bmN0aW9uIGlzUGF0aEluRm9sZGVyKHBhdGg6IHN0cmluZywgZm9sZGVyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgcmV0dXJuIGZvbGRlcnMuc29tZSgoZm9sZGVyKSA9PiBwYXRoID09PSBmb2xkZXIgfHwgcGF0aC5zdGFydHNXaXRoKGAke2ZvbGRlcn0vYCkpO1xufVxuXG5mdW5jdGlvbiBhc1RGaWxlKHZhbHVlOiB1bmtub3duKTogVEZpbGUgfCBudWxsIHtcbiAgaWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoISgncGF0aCcgaW4gdmFsdWUpIHx8ICEoJ2Jhc2VuYW1lJyBpbiB2YWx1ZSkgfHwgISgnZXh0ZW5zaW9uJyBpbiB2YWx1ZSkgfHwgISgnc3RhdCcgaW4gdmFsdWUpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gdmFsdWUgYXMgVEZpbGU7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBcHAsIFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHR5cGUgeyBTb3VyY2VTZWxlY3Rpb25SdWxlcyB9IGZyb20gJy4uL3BpcGVsaW5lL3R5cGVzJztcbmltcG9ydCB7IGNvbXBpbGVQYXRoUHJlZGljYXRlIH0gZnJvbSAnLi9maWx0ZXJzL3BhdGgtZmlsdGVyJztcbmltcG9ydCB7IGNvbXBpbGVUYWdQcmVkaWNhdGUgfSBmcm9tICcuL2ZpbHRlcnMvdGFnLWZpbHRlcic7XG5pbXBvcnQgeyBjb21waWxlRGF0ZVByZWRpY2F0ZSB9IGZyb20gJy4vZmlsdGVycy9kYXRlLWZpbHRlcic7XG5pbXBvcnQgeyBjb21waWxlRnJvbnRtYXR0ZXJQcmVkaWNhdGUgfSBmcm9tICcuL2ZpbHRlcnMvZnJvbnRtYXR0ZXItZmlsdGVyJztcbmltcG9ydCB7IGNvbXBpbGVJbmNvbWluZ0xpbmtQcmVkaWNhdGUsIGNvbXBpbGVPdXRnb2luZ0xpbmtQcmVkaWNhdGUgfSBmcm9tICcuL2ZpbHRlcnMvbGluay1maWx0ZXInO1xuXG50eXBlIEZpbGVQcmVkaWNhdGUgPSAoZmlsZTogVEZpbGUpID0+IGJvb2xlYW47XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJTb3VyY2VGaWxlc0J5TWV0YWRhdGEoYXBwOiBBcHAsIGZpbGVzOiBURmlsZVtdLCBydWxlcz86IFNvdXJjZVNlbGVjdGlvblJ1bGVzKTogVEZpbGVbXSB7XG4gIGlmICghcnVsZXMpIHtcbiAgICByZXR1cm4gZmlsZXM7XG4gIH1cblxuICBjb25zdCBwcmVkaWNhdGVzID0gY29tcGlsZVByZWRpY2F0ZXMoYXBwLCBydWxlcyk7XG4gIGlmIChwcmVkaWNhdGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmaWxlcztcbiAgfVxuXG4gIHJldHVybiBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IHByZWRpY2F0ZXMuZXZlcnkoKHByZWRpY2F0ZSkgPT4gcHJlZGljYXRlKGZpbGUpKSk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVQcmVkaWNhdGVzKGFwcDogQXBwLCBydWxlczogU291cmNlU2VsZWN0aW9uUnVsZXMpOiBGaWxlUHJlZGljYXRlW10ge1xuICBjb25zdCBwcmVkaWNhdGVzOiBGaWxlUHJlZGljYXRlW10gPSBbXTtcblxuICBjb25zdCBwYXRoUHJlZGljYXRlID0gY29tcGlsZVBhdGhQcmVkaWNhdGUocnVsZXMpO1xuICBpZiAocGF0aFByZWRpY2F0ZSkge1xuICAgIHByZWRpY2F0ZXMucHVzaChwYXRoUHJlZGljYXRlKTtcbiAgfVxuXG4gIGNvbnN0IHRhZ1ByZWRpY2F0ZSA9IGNvbXBpbGVUYWdQcmVkaWNhdGUoYXBwLCBydWxlcyk7XG4gIGlmICh0YWdQcmVkaWNhdGUpIHtcbiAgICBwcmVkaWNhdGVzLnB1c2godGFnUHJlZGljYXRlKTtcbiAgfVxuXG4gIGNvbnN0IGZyb250bWF0dGVyUHJlZGljYXRlID0gY29tcGlsZUZyb250bWF0dGVyUHJlZGljYXRlKGFwcCwgcnVsZXMpO1xuICBpZiAoZnJvbnRtYXR0ZXJQcmVkaWNhdGUpIHtcbiAgICBwcmVkaWNhdGVzLnB1c2goZnJvbnRtYXR0ZXJQcmVkaWNhdGUpO1xuICB9XG5cbiAgY29uc3QgZGF0ZVByZWRpY2F0ZSA9IGNvbXBpbGVEYXRlUHJlZGljYXRlKHJ1bGVzKTtcbiAgaWYgKGRhdGVQcmVkaWNhdGUpIHtcbiAgICBwcmVkaWNhdGVzLnB1c2goZGF0ZVByZWRpY2F0ZSk7XG4gIH1cblxuICBjb25zdCBvdXRnb2luZ0xpbmtQcmVkaWNhdGUgPSBjb21waWxlT3V0Z29pbmdMaW5rUHJlZGljYXRlKGFwcCwgcnVsZXMpO1xuICBpZiAob3V0Z29pbmdMaW5rUHJlZGljYXRlKSB7XG4gICAgcHJlZGljYXRlcy5wdXNoKG91dGdvaW5nTGlua1ByZWRpY2F0ZSk7XG4gIH1cblxuICBjb25zdCBpbmNvbWluZ0xpbmtQcmVkaWNhdGUgPSBjb21waWxlSW5jb21pbmdMaW5rUHJlZGljYXRlKGFwcCwgcnVsZXMpO1xuICBpZiAoaW5jb21pbmdMaW5rUHJlZGljYXRlKSB7XG4gICAgcHJlZGljYXRlcy5wdXNoKGluY29taW5nTGlua1ByZWRpY2F0ZSk7XG4gIH1cblxuICByZXR1cm4gcHJlZGljYXRlcztcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFwcCB9IGZyb20gJ29ic2lkaWFuJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEF2YWlsYWJsZVRhZ3MoYXBwOiBBcHApOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHRhZ3MgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRUYWdzKCk7XG4gIHJldHVybiBPYmplY3Qua2V5cyh0YWdzKS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFdlaWdodGVkV29yZCB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcENvdW50c1RvV2VpZ2h0ZWRXb3JkcyhcbiAgZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sXG4gIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyxcbik6IFdlaWdodGVkV29yZFtdIHtcbiAgaWYgKGVudHJpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgbWluRm9udFNpemUgPSBNYXRoLm1heCg4LCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLm1pbkZvbnRTaXplKSk7XG4gIGNvbnN0IG1heEZvbnRTaXplID0gTWF0aC5tYXgobWluRm9udFNpemUgKyAxLCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLm1heEZvbnRTaXplKSk7XG4gIGNvbnN0IGVtcGhhc2lzID0gTWF0aC5tYXgoMC41LCBNYXRoLm1pbigzLCByZW5kZXJTZXR0aW5ncy5lbXBoYXNpcykpO1xuXG4gIGNvbnN0IG5vcm1hbGl6ZWRFbnRyaWVzID0gZW50cmllc1xuICAgIC5tYXAoKFt0ZXh0LCBjb3VudF0sIGluZGV4KSA9PiAoe1xuICAgICAgdGV4dCxcbiAgICAgIGNvdW50LFxuICAgICAgaW5kZXgsXG4gICAgICBzY29yZTogY29tcHV0ZVNjYWxlU2NvcmUoY291bnQsIGluZGV4LCBlbnRyaWVzLCByZW5kZXJTZXR0aW5ncywgZW1waGFzaXMpLFxuICAgIH0pKVxuICAgIC5zb3J0KChhLCBiKSA9PiBiLmNvdW50IC0gYS5jb3VudCB8fCBhLmluZGV4IC0gYi5pbmRleCk7XG5cbiAgcmV0dXJuIG5vcm1hbGl6ZWRFbnRyaWVzLm1hcCgoZW50cnkpID0+ICh7XG4gICAgdGV4dDogZW50cnkudGV4dCxcbiAgICBjb3VudDogZW50cnkuY291bnQsXG4gICAgc2l6ZTogTWF0aC5yb3VuZChtaW5Gb250U2l6ZSArIGVudHJ5LnNjb3JlICogKG1heEZvbnRTaXplIC0gbWluRm9udFNpemUpKSxcbiAgfSkpO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlU2NhbGVTY29yZShcbiAgY291bnQ6IG51bWJlcixcbiAgaW5kZXg6IG51bWJlcixcbiAgZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sXG4gIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyxcbiAgZW1waGFzaXM6IG51bWJlcixcbik6IG51bWJlciB7XG4gIGNvbnN0IGNvdW50cyA9IGVudHJpZXMubWFwKChbLCBlbnRyeUNvdW50XSkgPT4gZW50cnlDb3VudCk7XG4gIGNvbnN0IG1pbkNvdW50ID0gY291bnRzW2NvdW50cy5sZW5ndGggLSAxXTtcbiAgY29uc3QgbWF4Q291bnQgPSBjb3VudHNbMF07XG5cbiAgaWYgKG1heENvdW50IDw9IG1pbkNvdW50KSB7XG4gICAgcmV0dXJuIDAuNTtcbiAgfVxuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5zY2FsaW5nTW9kZSA9PT0gJ3JhbmsnKSB7XG4gICAgaWYgKGVudHJpZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gMC41O1xuICAgIH1cbiAgICByZXR1cm4gMSAtIGluZGV4IC8gKGVudHJpZXMubGVuZ3RoIC0gMSk7XG4gIH1cblxuICBpZiAocmVuZGVyU2V0dGluZ3Muc2NhbGluZ01vZGUgPT09ICdsb2cnKSB7XG4gICAgY29uc3Qgc2FmZU1pbiA9IE1hdGgubWF4KDEsIG1pbkNvdW50KTtcbiAgICBjb25zdCBzYWZlTWF4ID0gTWF0aC5tYXgoc2FmZU1pbiArIDEsIG1heENvdW50KTtcbiAgICBjb25zdCBudW1lcmF0b3IgPSBNYXRoLmxvZyhNYXRoLm1heCgxLCBjb3VudCkpIC0gTWF0aC5sb2coc2FmZU1pbik7XG4gICAgY29uc3QgZGVub21pbmF0b3IgPSBNYXRoLmxvZyhzYWZlTWF4KSAtIE1hdGgubG9nKHNhZmVNaW4pO1xuICAgIHJldHVybiBjbGFtcDAxKGRlbm9taW5hdG9yID09PSAwID8gMC41IDogbnVtZXJhdG9yIC8gZGVub21pbmF0b3IpO1xuICB9XG5cbiAgY29uc3QgbGluZWFyID0gKGNvdW50IC0gbWluQ291bnQpIC8gKG1heENvdW50IC0gbWluQ291bnQpO1xuICBpZiAocmVuZGVyU2V0dGluZ3Muc2NhbGluZ01vZGUgPT09ICdwb3dlcicpIHtcbiAgICByZXR1cm4gY2xhbXAwMShNYXRoLnBvdyhsaW5lYXIsIGVtcGhhc2lzKSk7XG4gIH1cblxuICByZXR1cm4gY2xhbXAwMShsaW5lYXIpO1xufVxuXG5mdW5jdGlvbiBjbGFtcDAxKHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgdmFsdWUpKTtcbn1cbiIsICJpbXBvcnQgeyBNQVhfV09SRFMsIE1JTl9XT1JEX0xFTkdUSCB9IGZyb20gJy4uLy4uLy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgdHlwZSB7IFJlbmRlclNldHRpbmdzLCBXZWlnaHRlZFdvcmQgfSBmcm9tICcuLi8uLi8uLi90eXBlcyc7XG5pbXBvcnQgeyBtYXBDb3VudHNUb1dlaWdodGVkV29yZHMgfSBmcm9tICcuLi93b3JkLXNjYWxpbmcnO1xuaW1wb3J0IHR5cGUge1xuICBBZ2dyZWdhdGVSZXN1bHQsXG4gIEFnZ3JlZ2F0b3JTdHJhdGVneSxcbiAgRGlzdHJpYnV0aW9uQnVja2V0LFxuICBGaWx0ZXJTdHJhdGVneSxcbiAgUGlwZWxpbmVTdHJhdGVnaWVzLFxuICBSZW5kZXJNb2RlbCxcbiAgUmVuZGVyTW9kZWxTdHJhdGVneSxcbiAgU2NhbGluZ1N0cmF0ZWd5LFxuICBUb2tlbixcbiAgVG9rZW5pemVyU3RyYXRlZ3ksXG59IGZyb20gJy4uL3R5cGVzJztcblxuY29uc3QgZGVmYXVsdFRva2VuaXplcjogVG9rZW5pemVyU3RyYXRlZ3kgPSB7XG4gIHRva2VuaXplKHRleHQ6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGV4dC5tYXRjaCgvW2EtejAtOV1bYS16MC05Jy1dKi9nKSA/PyBbXTtcbiAgfSxcbn07XG5cbmNvbnN0IGRlZmF1bHRGaWx0ZXI6IEZpbHRlclN0cmF0ZWd5ID0ge1xuICBpbmNsdWRlVG9rZW4odG9rZW46IHN0cmluZywgc3RvcFdvcmRzOiBTZXQ8c3RyaW5nPik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB0b2tlbi50cmltKCk7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQubGVuZ3RoID49IE1JTl9XT1JEX0xFTkdUSCAmJiAhc3RvcFdvcmRzLmhhcyhub3JtYWxpemVkKTtcbiAgfSxcbn07XG5cbmNvbnN0IGRlZmF1bHRBZ2dyZWdhdG9yOiBBZ2dyZWdhdG9yU3RyYXRlZ3kgPSB7XG4gIGFnZ3JlZ2F0ZSh0b2tlbnM6IFRva2VuW10pOiBBZ2dyZWdhdGVSZXN1bHQge1xuICAgIGNvbnN0IGNvdW50cyA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG5cbiAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRva2Vucykge1xuICAgICAgY291bnRzLnNldCh0b2tlbi52YWx1ZSwgKGNvdW50cy5nZXQodG9rZW4udmFsdWUpID8/IDApICsgMSk7XG4gICAgfVxuXG4gICAgY29uc3QgZW50cmllcyA9IFsuLi5jb3VudHMuZW50cmllcygpXVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGJbMV0gLSBhWzFdKVxuICAgICAgLnNsaWNlKDAsIE1BWF9XT1JEUyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZW50cmllcyxcbiAgICAgIHRvdGFsVG9rZW5zOiB0b2tlbnMubGVuZ3RoLFxuICAgICAgZGlzdGluY3RUb2tlbnM6IGNvdW50cy5zaXplLFxuICAgIH07XG4gIH0sXG59O1xuXG5jb25zdCBkZWZhdWx0U2NhbGluZzogU2NhbGluZ1N0cmF0ZWd5ID0ge1xuICBzY2FsZShlbnRyaWVzOiBBcnJheTxbc3RyaW5nLCBudW1iZXJdPiwgcmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzKTogV2VpZ2h0ZWRXb3JkW10ge1xuICAgIHJldHVybiBtYXBDb3VudHNUb1dlaWdodGVkV29yZHMoZW50cmllcywgcmVuZGVyU2V0dGluZ3MpO1xuICB9LFxufTtcblxuY29uc3QgZGVmYXVsdFJlbmRlck1vZGVsOiBSZW5kZXJNb2RlbFN0cmF0ZWd5ID0ge1xuICBidWlsZE1vZGVsKHdvcmRzOiBXZWlnaHRlZFdvcmRbXSwgYWdncmVnYXRlOiBBZ2dyZWdhdGVSZXN1bHQpOiBSZW5kZXJNb2RlbCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdvcmRDbG91ZFdvcmRzOiB3b3JkcyxcbiAgICAgIGRpc3RyaWJ1dGlvblNlcmllczogYnVpbGREaXN0cmlidXRpb25TZXJpZXMod29yZHMpLFxuICAgICAgdG90YWxUb2tlbnM6IGFnZ3JlZ2F0ZS50b3RhbFRva2VucyxcbiAgICAgIGRpc3RpbmN0VG9rZW5zOiBhZ2dyZWdhdGUuZGlzdGluY3RUb2tlbnMsXG4gICAgfTtcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1BJUEVMSU5FX1NUUkFURUdJRVM6IFBpcGVsaW5lU3RyYXRlZ2llcyA9IHtcbiAgdG9rZW5pemVyOiBkZWZhdWx0VG9rZW5pemVyLFxuICBmaWx0ZXI6IGRlZmF1bHRGaWx0ZXIsXG4gIGFnZ3JlZ2F0b3I6IGRlZmF1bHRBZ2dyZWdhdG9yLFxuICBzY2FsaW5nOiBkZWZhdWx0U2NhbGluZyxcbiAgcmVuZGVyTW9kZWw6IGRlZmF1bHRSZW5kZXJNb2RlbCxcbn07XG5cbmZ1bmN0aW9uIGJ1aWxkRGlzdHJpYnV0aW9uU2VyaWVzKHdvcmRzOiBXZWlnaHRlZFdvcmRbXSk6IERpc3RyaWJ1dGlvbkJ1Y2tldFtdIHtcbiAgaWYgKHdvcmRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IG1heENvdW50ID0gd29yZHNbMF0/LmNvdW50ID8/IDA7XG4gIGlmIChtYXhDb3VudCA8PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgYnVja2V0Q291bnQgPSBNYXRoLm1pbig4LCBNYXRoLm1heCg0LCBNYXRoLnJvdW5kKE1hdGguc3FydCh3b3Jkcy5sZW5ndGgpKSkpO1xuICBjb25zdCB3aWR0aCA9IE1hdGgubWF4KDEsIE1hdGguY2VpbChtYXhDb3VudCAvIGJ1Y2tldENvdW50KSk7XG4gIGNvbnN0IGJ1Y2tldHMgPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpO1xuXG4gIGZvciAoY29uc3Qgd29yZCBvZiB3b3Jkcykge1xuICAgIGNvbnN0IGluZGV4ID0gTWF0aC5taW4oYnVja2V0Q291bnQgLSAxLCBNYXRoLmZsb29yKCh3b3JkLmNvdW50IC0gMSkgLyB3aWR0aCkpO1xuICAgIGJ1Y2tldHMuc2V0KGluZGV4LCAoYnVja2V0cy5nZXQoaW5kZXgpID8/IDApICsgMSk7XG4gIH1cblxuICBjb25zdCBkaXN0cmlidXRpb246IERpc3RyaWJ1dGlvbkJ1Y2tldFtdID0gW107XG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBidWNrZXRDb3VudDsgaW5kZXggKz0gMSkge1xuICAgIGNvbnN0IG1pbiA9IGluZGV4ICogd2lkdGggKyAxO1xuICAgIGNvbnN0IG1heCA9IGluZGV4ID09PSBidWNrZXRDb3VudCAtIDEgPyBtYXhDb3VudCA6IChpbmRleCArIDEpICogd2lkdGg7XG4gICAgZGlzdHJpYnV0aW9uLnB1c2goe1xuICAgICAgbGFiZWw6IGAke21pbn0tJHttYXh9YCxcbiAgICAgIG1pbixcbiAgICAgIG1heCxcbiAgICAgIHZhbHVlOiBidWNrZXRzLmdldChpbmRleCkgPz8gMCxcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBkaXN0cmlidXRpb247XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBZ2dyZWdhdGVSZXN1bHQsIEFnZ3JlZ2F0b3JTdHJhdGVneSwgVG9rZW4gfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZ2dyZWdhdGVUb2tlbnModG9rZW5zOiBUb2tlbltdLCBzdHJhdGVneTogQWdncmVnYXRvclN0cmF0ZWd5KTogQWdncmVnYXRlUmVzdWx0IHtcbiAgcmV0dXJuIHN0cmF0ZWd5LmFnZ3JlZ2F0ZSh0b2tlbnMpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgRnJlcXVlbmN5VGhyZXNob2xkcyB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5RnJlcXVlbmN5VGhyZXNob2xkcyhcbiAgZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sXG4gIHRocmVzaG9sZHM/OiBGcmVxdWVuY3lUaHJlc2hvbGRzLFxuKTogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4ge1xuICBpZiAoIXRocmVzaG9sZHMpIHtcbiAgICByZXR1cm4gZW50cmllcztcbiAgfVxuXG4gIGNvbnN0IG1pbkNvdW50ID0gY2xhbXBUaHJlc2hvbGQodGhyZXNob2xkcy5taW5Db3VudCwgMSk7XG4gIGNvbnN0IG1heENvdW50ID0gY2xhbXBUaHJlc2hvbGQodGhyZXNob2xkcy5tYXhDb3VudCwgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpO1xuICBjb25zdCBzYWZlTWluQ291bnQgPSBNYXRoLm1pbihtaW5Db3VudCwgbWF4Q291bnQpO1xuXG4gIHJldHVybiBlbnRyaWVzLmZpbHRlcigoWywgY291bnRdKSA9PiBjb3VudCA+PSBzYWZlTWluQ291bnQgJiYgY291bnQgPD0gbWF4Q291bnQpO1xufVxuXG5mdW5jdGlvbiBjbGFtcFRocmVzaG9sZCh2YWx1ZTogbnVtYmVyIHwgdW5kZWZpbmVkLCBmYWxsYmFjazogbnVtYmVyKTogbnVtYmVyIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicgfHwgTnVtYmVyLmlzTmFOKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxsYmFjaztcbiAgfVxuXG4gIHJldHVybiBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHZhbHVlKSk7XG59XG5cbiIsICJpbXBvcnQgdHlwZSB7IEZpbHRlclN0cmF0ZWd5LCBUb2tlbiB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlclRva2Vucyh0b2tlbnM6IFRva2VuW10sIHN0b3BXb3JkczogU2V0PHN0cmluZz4sIHN0cmF0ZWd5OiBGaWx0ZXJTdHJhdGVneSk6IFRva2VuW10ge1xuICByZXR1cm4gdG9rZW5zLmZpbHRlcigodG9rZW4pID0+IHN0cmF0ZWd5LmluY2x1ZGVUb2tlbih0b2tlbi52YWx1ZSwgc3RvcFdvcmRzKSk7XG59XG4iLCAiaW1wb3J0IHsgRlJPTlRNQVRURVJfUEFUVEVSTiwgV09SRF9DTE9VRF9CTE9DS19QQVRURVJOIH0gZnJvbSAnLi4vLi4vLi4vY29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHsgTm9ybWFsaXplZERvY3VtZW50LCBQaXBlbGluZURvY3VtZW50IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRG9jdW1lbnRzKGRvY3VtZW50czogUGlwZWxpbmVEb2N1bWVudFtdKTogTm9ybWFsaXplZERvY3VtZW50W10ge1xuICByZXR1cm4gZG9jdW1lbnRzLm1hcCgoZG9jdW1lbnQpID0+ICh7XG4gICAgaWQ6IGRvY3VtZW50LmlkLFxuICAgIHBhdGg6IGRvY3VtZW50LnBhdGgsXG4gICAgYmFzZW5hbWU6IGRvY3VtZW50LmJhc2VuYW1lLFxuICAgIHRhZ3M6IFsuLi5kb2N1bWVudC50YWdzXSxcbiAgICB0ZXh0OiBkb2N1bWVudC5yYXdUZXh0XG4gICAgICAucmVwbGFjZShGUk9OVE1BVFRFUl9QQVRURVJOLCAnJylcbiAgICAgIC5yZXBsYWNlKFdPUkRfQ0xPVURfQkxPQ0tfUEFUVEVSTiwgJycpXG4gICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgLm5vcm1hbGl6ZSgnTkZLQycpLFxuICB9KSk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBZ2dyZWdhdGVSZXN1bHQsIFJlbmRlck1vZGVsLCBSZW5kZXJNb2RlbFN0cmF0ZWd5IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHR5cGUgeyBXZWlnaHRlZFdvcmQgfSBmcm9tICcuLi8uLi8uLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZW5kZXJNb2RlbChcbiAgd29yZHM6IFdlaWdodGVkV29yZFtdLFxuICBhZ2dyZWdhdGVSZXN1bHQ6IEFnZ3JlZ2F0ZVJlc3VsdCxcbiAgc3RyYXRlZ3k6IFJlbmRlck1vZGVsU3RyYXRlZ3ksXG4pOiBSZW5kZXJNb2RlbCB7XG4gIHJldHVybiBzdHJhdGVneS5idWlsZE1vZGVsKHdvcmRzLCBhZ2dyZWdhdGVSZXN1bHQpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFdlaWdodGVkV29yZCB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgU2NhbGluZ1N0cmF0ZWd5IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2NhbGVFbnRyaWVzKFxuICBlbnRyaWVzOiBBcnJheTxbc3RyaW5nLCBudW1iZXJdPixcbiAgcmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzLFxuICBzdHJhdGVneTogU2NhbGluZ1N0cmF0ZWd5LFxuKTogV2VpZ2h0ZWRXb3JkW10ge1xuICByZXR1cm4gc3RyYXRlZ3kuc2NhbGUoZW50cmllcywgcmVuZGVyU2V0dGluZ3MpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgUGlwZWxpbmVEb2N1bWVudCwgU291cmNlU2VsZWN0aW9uUnVsZXMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBub3JtYWxpemVUYWcgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3REb2N1bWVudHMoZG9jdW1lbnRzOiBQaXBlbGluZURvY3VtZW50W10sIHJ1bGVzPzogU291cmNlU2VsZWN0aW9uUnVsZXMpOiBQaXBlbGluZURvY3VtZW50W10ge1xuICBpZiAoIXJ1bGVzKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50cztcbiAgfVxuXG4gIGNvbnN0IGluY2x1ZGVUYWdzID0gKHJ1bGVzLmluY2x1ZGVUYWdzID8/IFtdKVxuICAgIC5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpXG4gICAgLmZpbHRlcigodGFnKSA9PiB0YWcubGVuZ3RoID4gMCk7XG4gIGNvbnN0IGV4Y2x1ZGVUYWdzID0gKHJ1bGVzLmV4Y2x1ZGVUYWdzID8/IFtdKVxuICAgIC5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpXG4gICAgLmZpbHRlcigodGFnKSA9PiB0YWcubGVuZ3RoID4gMCk7XG5cbiAgY29uc3Qgc2NvcGUgPSBydWxlcy5zY29wZTtcbiAgY29uc3QgYWN0aXZlRmlsZVBhdGggPSBzY29wZT8uYWN0aXZlRmlsZVBhdGg/LnRyaW0oKSA/PyAnJztcbiAgY29uc3QgZm9sZGVyUGF0aHMgPSAoc2NvcGU/LmZvbGRlclBhdGhzID8/IFtdKS5tYXAoKHByZWZpeCkgPT4gcHJlZml4LnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBmcm9udG1hdHRlclJ1bGVzID0gKHJ1bGVzLmZyb250bWF0dGVyUnVsZXMgPz8gW10pXG4gICAgLmZpbHRlcigocnVsZSkgPT4gcnVsZS5rZXkudHJpbSgpLmxlbmd0aCA+IDApO1xuICBjb25zdCBxdWVyeVRleHQgPSBydWxlcy5xdWVyeVRleHQ/LnRyaW0oKS50b0xvd2VyQ2FzZSgpID8/ICcnO1xuICBjb25zdCB0YWdNYXRjaE1vZGUgPSBydWxlcy50YWdNYXRjaE1vZGUgPz8gJ2FueSc7XG5cbiAgcmV0dXJuIGRvY3VtZW50cy5maWx0ZXIoKGRvY3VtZW50KSA9PiB7XG4gICAgaWYgKCFtYXRjaGVzU2NvcGUoZG9jdW1lbnQucGF0aCwgc2NvcGU/Lm1vZGUgPz8gJ3ZhdWx0JywgYWN0aXZlRmlsZVBhdGgsIGZvbGRlclBhdGhzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpbmNsdWRlVGFncy5sZW5ndGggPiAwICYmICFtYXRjaGVzVGFnUnVsZXMoZG9jdW1lbnQudGFncywgaW5jbHVkZVRhZ3MsIHRhZ01hdGNoTW9kZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZXhjbHVkZVRhZ3MubGVuZ3RoID4gMCAmJiBtYXRjaGVzQW55VGFnKGRvY3VtZW50LnRhZ3MsIGV4Y2x1ZGVUYWdzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChmcm9udG1hdHRlclJ1bGVzLmxlbmd0aCA+IDAgJiYgIW1hdGNoZXNGcm9udG1hdHRlclJ1bGVzKGRvY3VtZW50LmZyb250bWF0dGVyLCBmcm9udG1hdHRlclJ1bGVzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChxdWVyeVRleHQubGVuZ3RoID4gMCAmJiAhbWF0Y2hlc1F1ZXJ5VGV4dChkb2N1bWVudCwgcXVlcnlUZXh0KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1RhZ1J1bGVzKGRvY3VtZW50VGFnczogc3RyaW5nW10sIGZpbHRlcnM6IHN0cmluZ1tdLCBtb2RlOiAnYW55JyB8ICdhbGwnKTogYm9vbGVhbiB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRUYWdzID0gbmV3IFNldChkb2N1bWVudFRhZ3MubWFwKCh0YWcpID0+IG5vcm1hbGl6ZVRhZyh0YWcpKS5maWx0ZXIoQm9vbGVhbikpO1xuICBpZiAobW9kZSA9PT0gJ2FsbCcpIHtcbiAgICByZXR1cm4gZmlsdGVycy5ldmVyeSgoZmlsdGVyVGFnKSA9PiBub3JtYWxpemVkVGFncy5oYXMoZmlsdGVyVGFnKSk7XG4gIH1cblxuICByZXR1cm4gZmlsdGVycy5zb21lKChmaWx0ZXJUYWcpID0+IG5vcm1hbGl6ZWRUYWdzLmhhcyhmaWx0ZXJUYWcpKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc0FueVRhZyhkb2N1bWVudFRhZ3M6IHN0cmluZ1tdLCBmaWx0ZXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICBjb25zdCBub3JtYWxpemVkVGFncyA9IG5ldyBTZXQoZG9jdW1lbnRUYWdzLm1hcCgodGFnKSA9PiBub3JtYWxpemVUYWcodGFnKSkuZmlsdGVyKEJvb2xlYW4pKTtcbiAgcmV0dXJuIGZpbHRlcnMuc29tZSgoZmlsdGVyVGFnKSA9PiBub3JtYWxpemVkVGFncy5oYXMoZmlsdGVyVGFnKSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNTY29wZShwYXRoOiBzdHJpbmcsIG1vZGU6ICd2YXVsdCcgfCAnYWN0aXZlLWZpbGUnIHwgJ2ZvbGRlcicsIGFjdGl2ZUZpbGVQYXRoOiBzdHJpbmcsIGZvbGRlclBhdGhzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICBpZiAobW9kZSA9PT0gJ2FjdGl2ZS1maWxlJykge1xuICAgIHJldHVybiBhY3RpdmVGaWxlUGF0aC5sZW5ndGggPiAwICYmIHBhdGggPT09IGFjdGl2ZUZpbGVQYXRoO1xuICB9XG5cbiAgaWYgKG1vZGUgPT09ICdmb2xkZXInKSB7XG4gICAgaWYgKGZvbGRlclBhdGhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBmb2xkZXJQYXRocy5zb21lKChmb2xkZXJQYXRoKSA9PiBwYXRoID09PSBmb2xkZXJQYXRoIHx8IHBhdGguc3RhcnRzV2l0aChgJHtmb2xkZXJQYXRofS9gKSk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc0Zyb250bWF0dGVyUnVsZXMoXG4gIGZyb250bWF0dGVyOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgcnVsZXM6IFNvdXJjZVNlbGVjdGlvblJ1bGVzWydmcm9udG1hdHRlclJ1bGVzJ10sXG4pOiBib29sZWFuIHtcbiAgaWYgKCFydWxlcykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHJ1bGVzLmV2ZXJ5KChydWxlKSA9PiB7XG4gICAgY29uc3Qga2V5ID0gcnVsZS5rZXkudHJpbSgpO1xuICAgIGlmICgha2V5KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBhY3R1YWwgPSBmcm9udG1hdHRlcltrZXldO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gKHJ1bGUudmFsdWUgPz8gJycpLnRyaW0oKTtcblxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnZXhpc3RzJykge1xuICAgICAgcmV0dXJuIGFjdHVhbCAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ25vdC1leGlzdHMnKSB7XG4gICAgICByZXR1cm4gYWN0dWFsID09PSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKGFjdHVhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHJ1bGUub3BlcmF0b3IgPT09ICdjb250YWlucycpIHtcbiAgICAgIHJldHVybiBjb250YWluc1ZhbHVlKGFjdHVhbCwgZXhwZWN0ZWQpO1xuICAgIH1cblxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnZXF1YWxzJykge1xuICAgICAgcmV0dXJuIGNvbXBhcmVTY2FsYXIoYWN0dWFsLCBleHBlY3RlZCkgPT09IDA7XG4gICAgfVxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnbm90LWVxdWFscycpIHtcbiAgICAgIHJldHVybiBjb21wYXJlU2NhbGFyKGFjdHVhbCwgZXhwZWN0ZWQpICE9PSAwO1xuICAgIH1cbiAgICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ2d0Jykge1xuICAgICAgcmV0dXJuIGNvbXBhcmVTY2FsYXIoYWN0dWFsLCBleHBlY3RlZCkgPiAwO1xuICAgIH1cbiAgICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ2d0ZScpIHtcbiAgICAgIHJldHVybiBjb21wYXJlU2NhbGFyKGFjdHVhbCwgZXhwZWN0ZWQpID49IDA7XG4gICAgfVxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnbHQnKSB7XG4gICAgICByZXR1cm4gY29tcGFyZVNjYWxhcihhY3R1YWwsIGV4cGVjdGVkKSA8IDA7XG4gICAgfVxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnbHRlJykge1xuICAgICAgcmV0dXJuIGNvbXBhcmVTY2FsYXIoYWN0dWFsLCBleHBlY3RlZCkgPD0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbnRhaW5zVmFsdWUoYWN0dWFsOiB1bmtub3duLCBleHBlY3RlZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRFeHBlY3RlZCA9IGV4cGVjdGVkLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChBcnJheS5pc0FycmF5KGFjdHVhbCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLnNvbWUoKGVudHJ5KSA9PiBTdHJpbmcoZW50cnkpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMobm9ybWFsaXplZEV4cGVjdGVkKSk7XG4gIH1cblxuICByZXR1cm4gU3RyaW5nKGFjdHVhbCkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhub3JtYWxpemVkRXhwZWN0ZWQpO1xufVxuXG5mdW5jdGlvbiBjb21wYXJlU2NhbGFyKGFjdHVhbDogdW5rbm93biwgZXhwZWN0ZWQ6IHN0cmluZyk6IG51bWJlciB7XG4gIGNvbnN0IG51bWVyaWNBY3R1YWwgPSB0cnlQYXJzZU51bWJlcihhY3R1YWwpO1xuICBjb25zdCBudW1lcmljRXhwZWN0ZWQgPSB0cnlQYXJzZU51bWJlcihleHBlY3RlZCk7XG4gIGlmIChudW1lcmljQWN0dWFsICE9PSBudWxsICYmIG51bWVyaWNFeHBlY3RlZCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBudW1lcmljQWN0dWFsIC0gbnVtZXJpY0V4cGVjdGVkO1xuICB9XG5cbiAgY29uc3QgZGF0ZUFjdHVhbCA9IHRyeVBhcnNlRGF0ZShhY3R1YWwpO1xuICBjb25zdCBkYXRlRXhwZWN0ZWQgPSB0cnlQYXJzZURhdGUoZXhwZWN0ZWQpO1xuICBpZiAoZGF0ZUFjdHVhbCAhPT0gbnVsbCAmJiBkYXRlRXhwZWN0ZWQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZGF0ZUFjdHVhbCAtIGRhdGVFeHBlY3RlZDtcbiAgfVxuXG4gIGNvbnN0IGJvb2xlYW5BY3R1YWwgPSB0cnlQYXJzZUJvb2xlYW4oYWN0dWFsKTtcbiAgY29uc3QgYm9vbGVhbkV4cGVjdGVkID0gdHJ5UGFyc2VCb29sZWFuKGV4cGVjdGVkKTtcbiAgaWYgKGJvb2xlYW5BY3R1YWwgIT09IG51bGwgJiYgYm9vbGVhbkV4cGVjdGVkICE9PSBudWxsKSB7XG4gICAgaWYgKGJvb2xlYW5BY3R1YWwgPT09IGJvb2xlYW5FeHBlY3RlZCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiBib29sZWFuQWN0dWFsID8gMSA6IC0xO1xuICB9XG5cbiAgcmV0dXJuIFN0cmluZyhhY3R1YWwpLmxvY2FsZUNvbXBhcmUoZXhwZWN0ZWQsIHVuZGVmaW5lZCwgeyBzZW5zaXRpdml0eTogJ2Jhc2UnLCBudW1lcmljOiB0cnVlIH0pO1xufVxuXG5mdW5jdGlvbiB0cnlQYXJzZU51bWJlcih2YWx1ZTogdW5rbm93bik6IG51bWJlciB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBwYXJzZWQgPSBOdW1iZXIodmFsdWUpO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocGFyc2VkKSkge1xuICAgICAgcmV0dXJuIHBhcnNlZDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gdHJ5UGFyc2VEYXRlKHZhbHVlOiB1bmtub3duKTogbnVtYmVyIHwgbnVsbCB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcGFyc2VkID0gRGF0ZS5wYXJzZSh2YWx1ZSk7XG4gICAgcmV0dXJuIE51bWJlci5pc05hTihwYXJzZWQpID8gbnVsbCA6IHBhcnNlZDtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiB0cnlQYXJzZUJvb2xlYW4odmFsdWU6IHVua25vd24pOiBib29sZWFuIHwgbnVsbCB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IHZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChub3JtYWxpemVkID09PSAndHJ1ZScpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAobm9ybWFsaXplZCA9PT0gJ2ZhbHNlJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzUXVlcnlUZXh0KGRvY3VtZW50OiBQaXBlbGluZURvY3VtZW50LCBxdWVyeVRleHQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gZG9jdW1lbnQucGF0aC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5VGV4dClcbiAgICB8fCBkb2N1bWVudC5iYXNlbmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5VGV4dClcbiAgICB8fCBkb2N1bWVudC5yYXdUZXh0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnlUZXh0KTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IE5vcm1hbGl6ZWREb2N1bWVudCwgVG9rZW4sIFRva2VuaXplclN0cmF0ZWd5IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9rZW5pemVEb2N1bWVudHMoZG9jdW1lbnRzOiBOb3JtYWxpemVkRG9jdW1lbnRbXSwgc3RyYXRlZ3k6IFRva2VuaXplclN0cmF0ZWd5KTogVG9rZW5bXSB7XG4gIGNvbnN0IHRva2VuczogVG9rZW5bXSA9IFtdO1xuXG4gIGZvciAoY29uc3QgZG9jdW1lbnQgb2YgZG9jdW1lbnRzKSB7XG4gICAgY29uc3QgdmFsdWVzID0gc3RyYXRlZ3kudG9rZW5pemUoZG9jdW1lbnQudGV4dCk7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGRvY3VtZW50SWQ6IGRvY3VtZW50LmlkLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRva2Vucztcbn1cbiIsICJpbXBvcnQgeyBERUZBVUxUX1BJUEVMSU5FX1NUUkFURUdJRVMgfSBmcm9tICcuL3N0cmF0ZWdpZXMnO1xuaW1wb3J0IHsgYWdncmVnYXRlVG9rZW5zIH0gZnJvbSAnLi9zdGFnZXMvMDYtYWdncmVnYXRlLXRva2VuLWNvdW50cyc7XG5pbXBvcnQgeyBhcHBseUZyZXF1ZW5jeVRocmVzaG9sZHMgfSBmcm9tICcuL3N0YWdlcy8wNy1hcHBseS1mcmVxdWVuY3ktdGhyZXNob2xkcyc7XG5pbXBvcnQgeyBmaWx0ZXJUb2tlbnMgfSBmcm9tICcuL3N0YWdlcy8wNS1maWx0ZXItdG9rZW5zJztcbmltcG9ydCB7IG5vcm1hbGl6ZURvY3VtZW50cyB9IGZyb20gJy4vc3RhZ2VzLzAzLW5vcm1hbGl6ZS1kb2N1bWVudHMnO1xuaW1wb3J0IHsgY3JlYXRlUmVuZGVyTW9kZWwgfSBmcm9tICcuL3N0YWdlcy8wOS1jcmVhdGUtcmVuZGVyLW1vZGVsJztcbmltcG9ydCB7IHNjYWxlRW50cmllcyB9IGZyb20gJy4vc3RhZ2VzLzA4LXNjYWxlLXdvcmQtd2VpZ2h0cyc7XG5pbXBvcnQgeyBzZWxlY3REb2N1bWVudHMgfSBmcm9tICcuL3N0YWdlcy8wMi1maWx0ZXItYnktc291cmNlLWNvbnRlbnQnO1xuaW1wb3J0IHsgdG9rZW5pemVEb2N1bWVudHMgfSBmcm9tICcuL3N0YWdlcy8wNC10b2tlbml6ZS1kb2N1bWVudHMnO1xuaW1wb3J0IHR5cGUgeyBQaXBlbGluZUlucHV0LCBQaXBlbGluZVN0cmF0ZWdpZXMsIFJlbmRlck1vZGVsIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5UcmFuc2Zvcm1QaXBlbGluZShcbiAgaW5wdXQ6IFBpcGVsaW5lSW5wdXQsXG4gIG92ZXJyaWRlczogUGFydGlhbDxQaXBlbGluZVN0cmF0ZWdpZXM+ID0ge30sXG4pOiBSZW5kZXJNb2RlbCB7XG4gIGNvbnN0IHN0cmF0ZWdpZXM6IFBpcGVsaW5lU3RyYXRlZ2llcyA9IHtcbiAgICAuLi5ERUZBVUxUX1BJUEVMSU5FX1NUUkFURUdJRVMsXG4gICAgLi4ub3ZlcnJpZGVzLFxuICB9O1xuXG4gIGNvbnN0IHNlbGVjdGVkRG9jdW1lbnRzID0gc2VsZWN0RG9jdW1lbnRzKGlucHV0LmRvY3VtZW50cywgaW5wdXQuc291cmNlUnVsZXMpO1xuICBjb25zdCBub3JtYWxpemVkRG9jdW1lbnRzID0gbm9ybWFsaXplRG9jdW1lbnRzKHNlbGVjdGVkRG9jdW1lbnRzKTtcbiAgY29uc3QgdG9rZW5zID0gdG9rZW5pemVEb2N1bWVudHMobm9ybWFsaXplZERvY3VtZW50cywgc3RyYXRlZ2llcy50b2tlbml6ZXIpO1xuICBjb25zdCBmaWx0ZXJlZFRva2VucyA9IGZpbHRlclRva2Vucyh0b2tlbnMsIGlucHV0LnN0b3BXb3Jkcywgc3RyYXRlZ2llcy5maWx0ZXIpO1xuICBjb25zdCBhZ2dyZWdhdGVSZXN1bHQgPSBhZ2dyZWdhdGVUb2tlbnMoZmlsdGVyZWRUb2tlbnMsIHN0cmF0ZWdpZXMuYWdncmVnYXRvcik7XG4gIGNvbnN0IGZpbHRlcmVkRW50cmllcyA9IGFwcGx5RnJlcXVlbmN5VGhyZXNob2xkcyhhZ2dyZWdhdGVSZXN1bHQuZW50cmllcywgaW5wdXQuZnJlcXVlbmN5KTtcbiAgY29uc3Qgd29yZHMgPSBzY2FsZUVudHJpZXMoZmlsdGVyZWRFbnRyaWVzLCBpbnB1dC5yZW5kZXJTZXR0aW5ncywgc3RyYXRlZ2llcy5zY2FsaW5nKTtcblxuICByZXR1cm4gY3JlYXRlUmVuZGVyTW9kZWwod29yZHMsIGFnZ3JlZ2F0ZVJlc3VsdCwgc3RyYXRlZ2llcy5yZW5kZXJNb2RlbCk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBcHAsIFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHR5cGUgeyBSZW5kZXJTZXR0aW5ncywgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgcmVhZFBpcGVsaW5lRG9jdW1lbnRzIH0gZnJvbSAnLi4vaW5nZXN0aW9uL29ic2lkaWFuLXNvdXJjZSc7XG5pbXBvcnQgeyBmaWx0ZXJTb3VyY2VGaWxlc0J5TWV0YWRhdGEgfSBmcm9tICcuLi9pbmdlc3Rpb24vbWV0YWRhdGEtZmlsZS1maWx0ZXInO1xuaW1wb3J0IHsgZ2V0QXZhaWxhYmxlVGFncyB9IGZyb20gJy4uL2luZ2VzdGlvbi90YWctY2F0YWxvZyc7XG5pbXBvcnQgeyBydW5UcmFuc2Zvcm1QaXBlbGluZSB9IGZyb20gJy4uL3BpcGVsaW5lL3J1bi10cmFuc2Zvcm0tcGlwZWxpbmUnO1xuaW1wb3J0IHR5cGUgeyBGcmVxdWVuY3lUaHJlc2hvbGRzLCBTb3VyY2VTZWxlY3Rpb25SdWxlcyB9IGZyb20gJy4uL3BpcGVsaW5lL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFdvcmRDbG91ZFNlcnZpY2Uge1xuICBwcml2YXRlIHJlYWRvbmx5IGFwcDogQXBwO1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwKSB7XG4gICAgdGhpcy5hcHAgPSBhcHA7XG4gIH1cblxuICBnZXRBdmFpbGFibGVUYWdzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gZ2V0QXZhaWxhYmxlVGFncyh0aGlzLmFwcCk7XG4gIH1cblxuICBhc3luYyBjb2xsZWN0RnJvbUZpbGVzKFxuICAgIGZpbGVzOiBURmlsZVtdLFxuICAgIHN0b3BXb3JkczogU2V0PHN0cmluZz4sXG4gICAgcmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzLFxuICAgIG9uUHJvZ3Jlc3M/OiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQsXG4gICAgb3B0aW9ucz86IHtcbiAgICAgIHNvdXJjZVJ1bGVzPzogU291cmNlU2VsZWN0aW9uUnVsZXM7XG4gICAgICBmcmVxdWVuY3k/OiBGcmVxdWVuY3lUaHJlc2hvbGRzO1xuICAgICAgZXhjbHVkZVdvcmRzPzogc3RyaW5nW107XG4gICAgfSxcbiAgKTogUHJvbWlzZTxXZWlnaHRlZFdvcmRbXT4ge1xuICAgIGNvbnN0IGZpbGVzRm9yU2NhbiA9IGZpbHRlclNvdXJjZUZpbGVzQnlNZXRhZGF0YSh0aGlzLmFwcCwgZmlsZXMsIG9wdGlvbnM/LnNvdXJjZVJ1bGVzKTtcblxuICAgIGNvbnN0IHBlcmZvcm1hbmNlID0gZ2V0UGVyZm9ybWFuY2VQcm9maWxlKHJlbmRlclNldHRpbmdzLnByb2dyZXNzRGV0YWlsKTtcbiAgICBjb25zdCByZXBvcnRQcm9ncmVzcyA9IGNyZWF0ZVRocm90dGxlZFByb2dyZXNzKG9uUHJvZ3Jlc3MsIHBlcmZvcm1hbmNlLnByb2dyZXNzVGhyb3R0bGVNcyk7XG4gICAgY29uc3QgcmVhZEJhdGNoU2l6ZSA9IHBlcmZvcm1hbmNlLmZ1bGxQYXJhbGxlbFJlYWRcbiAgICAgID8gTWF0aC5tYXgoMSwgZmlsZXNGb3JTY2FuLmxlbmd0aClcbiAgICAgIDogTWF0aC5tYXgoOCwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy5zY2FuQmF0Y2hTaXplKSk7XG5cbiAgICBjb25zdCBkb2N1bWVudHMgPSBhd2FpdCByZWFkUGlwZWxpbmVEb2N1bWVudHMoXG4gICAgICB0aGlzLmFwcCxcbiAgICAgIGZpbGVzRm9yU2NhbixcbiAgICAgIHJlYWRCYXRjaFNpemUsXG4gICAgICAobWVzc2FnZSwgcGVyY2VudCkgPT4ge1xuICAgICAgICByZXBvcnRQcm9ncmVzcyhtZXNzYWdlLCBwZXJjZW50KTtcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIHJlcG9ydFByb2dyZXNzKCdUb2tlbml6aW5nIGFuZCBhZ2dyZWdhdGluZy4uLicsIDg1KTtcblxuICAgIGNvbnN0IGNvbWJpbmVkU3RvcFdvcmRzID0gbmV3IFNldChzdG9wV29yZHMpO1xuICAgIGZvciAoY29uc3Qgd29yZCBvZiBvcHRpb25zPy5leGNsdWRlV29yZHMgPz8gW10pIHtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB3b3JkLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKG5vcm1hbGl6ZWQpIHtcbiAgICAgICAgY29tYmluZWRTdG9wV29yZHMuYWRkKG5vcm1hbGl6ZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsID0gcnVuVHJhbnNmb3JtUGlwZWxpbmUoe1xuICAgICAgZG9jdW1lbnRzLFxuICAgICAgc3RvcFdvcmRzOiBjb21iaW5lZFN0b3BXb3JkcyxcbiAgICAgIHJlbmRlclNldHRpbmdzLFxuICAgICAgc291cmNlUnVsZXM6IG9wdGlvbnM/LnNvdXJjZVJ1bGVzLFxuICAgICAgZnJlcXVlbmN5OiBvcHRpb25zPy5mcmVxdWVuY3ksXG4gICAgfSk7XG5cbiAgICByZXBvcnRQcm9ncmVzcygnUHJlcGFyaW5nIGxheW91dC4uLicsIDk1KTtcblxuICAgIHJldHVybiBtb2RlbC53b3JkQ2xvdWRXb3JkcztcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVUaHJvdHRsZWRQcm9ncmVzcyhcbiAgb25Qcm9ncmVzczogKChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4gdm9pZCkgfCB1bmRlZmluZWQsXG4gIG1pbkludGVydmFsTXM6IG51bWJlcixcbik6IChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4gdm9pZCB7XG4gIGlmICghb25Qcm9ncmVzcykge1xuICAgIHJldHVybiAoKSA9PiB1bmRlZmluZWQ7XG4gIH1cblxuICBsZXQgbGFzdFJlcG9ydGVkQXQgPSAwO1xuICBsZXQgbGFzdFBlcmNlbnQgPSAtMTtcblxuICByZXR1cm4gKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBpZiAocGVyY2VudCAhPT0gMTAwICYmIHBlcmNlbnQgPT09IGxhc3RQZXJjZW50ICYmIG5vdyAtIGxhc3RSZXBvcnRlZEF0IDwgbWluSW50ZXJ2YWxNcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGVyY2VudCAhPT0gMTAwICYmIG5vdyAtIGxhc3RSZXBvcnRlZEF0IDwgbWluSW50ZXJ2YWxNcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxhc3RSZXBvcnRlZEF0ID0gbm93O1xuICAgIGxhc3RQZXJjZW50ID0gcGVyY2VudDtcbiAgICBvblByb2dyZXNzKG1lc3NhZ2UsIHBlcmNlbnQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRQZXJmb3JtYW5jZVByb2ZpbGUoZGV0YWlsOiBSZW5kZXJTZXR0aW5nc1sncHJvZ3Jlc3NEZXRhaWwnXSk6IHtcbiAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiBudW1iZXI7XG4gIGZ1bGxQYXJhbGxlbFJlYWQ6IGJvb2xlYW47XG59IHtcbiAgaWYgKGRldGFpbCA9PT0gJ3VuaGluZ2VkJykge1xuICAgIHJldHVybiB7XG4gICAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDFfMDAwXzAwMCxcbiAgICAgIGZ1bGxQYXJhbGxlbFJlYWQ6IHRydWUsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChkZXRhaWwgPT09ICdkZXRhaWxlZCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAyNSxcbiAgICAgIGZ1bGxQYXJhbGxlbFJlYWQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBpZiAoZGV0YWlsID09PSAnbWluaW1hbCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAyMjAsXG4gICAgICBmdWxsUGFyYWxsZWxSZWFkOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDgwLFxuICAgIGZ1bGxQYXJhbGxlbFJlYWQ6IGZhbHNlLFxuICB9O1xufVxuIiwgImltcG9ydCB7IFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBERUZBVUxUX1NUT1BfV09SRFMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUge1xuICBDb3VudExhYmVsRm9ybWF0LFxuICBQcm9ncmVzc0RldGFpbCxcbiAgUmVuZGVyU2V0dGluZ3MsXG4gIFJvdGF0aW9uUHJlc2V0LFxuICBTY2FsaW5nTW9kZSxcbiAgU3BpcmFsVHlwZSxcbiAgV29yZFRleHRNZXRyaWMsXG4gIFdvcmRDbG91ZEZpbHRlclNldHRpbmdzLFxuICBXZWlnaHRlZFdvcmQsXG59IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIFZhdWx0V29yZENsb3VkUGx1Z2luIGZyb20gJy4uL21haW4nO1xuaW1wb3J0IHsgbWFwQ291bnRzVG9XZWlnaHRlZFdvcmRzIH0gZnJvbSAnLi4vd29yZGNsb3VkL3BpcGVsaW5lL3dvcmQtc2NhbGluZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgV29yZENsb3VkU2V0dGluZ3Mge1xuICBibGFja2xpc3RXb3Jkczogc3RyaW5nW107XG4gIHJlbmRlcjogUmVuZGVyU2V0dGluZ3M7XG4gIGZpbHRlcnM6IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzO1xufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogV29yZENsb3VkU2V0dGluZ3MgPSB7XG4gIGJsYWNrbGlzdFdvcmRzOiBbLi4uREVGQVVMVF9TVE9QX1dPUkRTXSxcbiAgcmVuZGVyOiB7XG4gICAgcm90YXRpb25QcmVzZXQ6ICdtb3N0bHktaG9yaXpvbnRhbCcsXG4gICAgc3BpcmFsOiAnYXJjaGltZWRlYW4nLFxuICAgIHdvcmRQYWRkaW5nOiAyLFxuICAgIG1pbkZvbnRTaXplOiAxNCxcbiAgICBtYXhGb250U2l6ZTogNzIsXG4gICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgIHNjYWxpbmdNb2RlOiAncG93ZXInLFxuICAgIGVtcGhhc2lzOiAxLFxuICAgIHNob3dDb3VudEluV29yZFRleHQ6IGZhbHNlLFxuICAgIHdvcmRUZXh0TWV0cmljOiAnY291bnQnLFxuICAgIHNob3dXb3JkVGV4dE1ldHJpY1RvZ2dsZTogZmFsc2UsXG4gICAgY291bnRMYWJlbEZvcm1hdDogJ3BhcmVuJyxcbiAgICBjb3VudExhYmVsTWluQ291bnQ6IDEsXG4gICAgcHJvZ3Jlc3NEZXRhaWw6ICdiYWxhbmNlZCcsXG4gICAgc2NhbkJhdGNoU2l6ZTogMjQsXG4gICAgbGF5b3V0VGltZUludGVydmFsTXM6IDE2LFxuICAgIGRldGVybWluaXN0aWNMYXlvdXQ6IGZhbHNlLFxuICAgIHJhbmRvbVNlZWQ6IDQyLFxuICB9LFxuICBmaWx0ZXJzOiB7XG4gICAgc2NvcGU6IHtcbiAgICAgIG1vZGU6ICd2YXVsdCcsXG4gICAgICBhY3RpdmVGaWxlUGF0aDogJycsXG4gICAgICBmb2xkZXJQYXRoczogW10sXG4gICAgfSxcbiAgICBpbmNsdWRlVGFnczogW10sXG4gICAgZXhjbHVkZVRhZ3M6IFtdLFxuICAgIHRhZ01hdGNoTW9kZTogJ2FueScsXG4gICAgZnJvbnRtYXR0ZXJSdWxlczogW10sXG4gICAgZnJlcXVlbmN5OiB7XG4gICAgICBtaW5Db3VudDogMSxcbiAgICAgIG1heENvdW50OiA5OTk5LFxuICAgIH0sXG4gIH0sXG59O1xuXG5leHBvcnQgY2xhc3MgVmF1bHRXb3JkQ2xvdWRTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcGx1Z2luOiBWYXVsdFdvcmRDbG91ZFBsdWdpbjtcblxuICBjb25zdHJ1Y3RvcihwbHVnaW46IFZhdWx0V29yZENsb3VkUGx1Z2luKSB7XG4gICAgc3VwZXIocGx1Z2luLmFwcCwgcGx1Z2luKTtcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgfVxuXG4gIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnV29yZCBjbG91ZHMgc2V0dGluZ3MnIH0pO1xuXG4gICAgbGV0IGRyYWZ0V29yZCA9ICcnO1xuXG4gICAgY29uc3QgYWRkRXhjbHVkZWRXb3JkID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnQWRkIGV4Y2x1ZGVkIHdvcmQnKVxuICAgICAgLnNldERlc2MoJ0FkZCBvbmUgd29yZCBhdCBhIHRpbWUgdG8gdGhlIGJsYWNrbGlzdC4nKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgdGV4dC5zZXRQbGFjZWhvbGRlcignV29yZCB0byBleGNsdWRlJyk7XG4gICAgICAgIHRleHQub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgZHJhZnRXb3JkID0gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b25cbiAgICAgICAgICAuc2V0QnV0dG9uVGV4dCgnQWRkJylcbiAgICAgICAgICAuc2V0Q3RhKClcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhZGRlZCA9IGF3YWl0IHRoaXMucGx1Z2luLmFkZEJsYWNrbGlzdFdvcmQoZHJhZnRXb3JkKTtcbiAgICAgICAgICAgIGlmIChhZGRlZCkge1xuICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oYWRkRXhjbHVkZWRXb3JkLCAnRXhjbHVkZWQgd29yZHMgYXJlIGFsd2F5cyBpZ25vcmVkIGZyb20gY291bnRpbmcgYW5kIHNpemluZyBpbiBhbGwgY2xvdWQgdHlwZXMuJyk7XG5cbiAgICBjb25zdCBsaXN0V3JhcHBlckVsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zZXR0aW5ncy1saXN0JyB9KTtcbiAgICBsaXN0V3JhcHBlckVsLmNyZWF0ZUVsKCdoMycsIHsgdGV4dDogJ0V4Y2x1ZGVkIHdvcmRzJyB9KTtcbiAgICBjb25zdCBsaXN0RWwgPSBsaXN0V3JhcHBlckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtYmFkZ2VzJyB9KTtcbiAgICBjb25zdCBzb3J0ZWRXb3JkcyA9IFsuLi50aGlzLnBsdWdpbi5zZXR0aW5ncy5ibGFja2xpc3RXb3Jkc10uc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcblxuICAgIGlmIChzb3J0ZWRXb3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGxpc3RFbC5jcmVhdGVTcGFuKHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zZXR0aW5ncy1iYWRnZXMtZW1wdHknLCB0ZXh0OiAnTm8gZXhjbHVkZWQgd29yZHMgY29uZmlndXJlZC4nIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IHdvcmQgb2Ygc29ydGVkV29yZHMpIHtcbiAgICAgICAgY29uc3QgYmFkZ2VFbCA9IGxpc3RFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXNldHRpbmdzLWJhZGdlJyB9KTtcbiAgICAgICAgYmFkZ2VFbC5jcmVhdGVTcGFuKHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zZXR0aW5ncy1iYWRnZS10ZXh0JywgdGV4dDogd29yZCB9KTtcblxuICAgICAgICBjb25zdCByZW1vdmVCdXR0b24gPSBiYWRnZUVsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zZXR0aW5ncy1iYWRnZS1yZW1vdmUnLFxuICAgICAgICAgIHRleHQ6ICd4JyxcbiAgICAgICAgfSk7XG4gICAgICAgIHJlbW92ZUJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgYFJlbW92ZSAke3dvcmR9YCk7XG4gICAgICAgIHJlbW92ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5yZW1vdmVCbGFja2xpc3RXb3JkKHdvcmQpO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXNldEV4Y2x1ZGVkV29yZHMgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdSZXNldCBleGNsdWRlZCB3b3JkcycpXG4gICAgICAuc2V0RGVzYygnUmVzdG9yZSB0aGUgb3JpZ2luYWwgZGVmYXVsdCBibGFja2xpc3QuJylcbiAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b25cbiAgICAgICAgICAuc2V0QnV0dG9uVGV4dCgnUmVzZXQgdG8gZGVmYXVsdHMnKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnJlc2V0QmxhY2tsaXN0V29yZHMoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihyZXNldEV4Y2x1ZGVkV29yZHMsICdSZXNldHMgb25seSBleGNsdWRlZCB3b3Jkcy4gUmVuZGVyaW5nIGFuZCBwZXJmb3JtYW5jZSBzZXR0aW5ncyBhcmUgdW5jaGFuZ2VkLicpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gzJywgeyB0ZXh0OiAnUmVuZGVyaW5nJyB9KTtcblxuICAgIGNvbnN0IHByZXZpZXdXcmFwcGVyRWwgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXNldHRpbmdzLXByZXZpZXcnIH0pO1xuICAgIHByZXZpZXdXcmFwcGVyRWwuY3JlYXRlRWwoJ2g0JywgeyB0ZXh0OiAnUHJldmlldycgfSk7XG4gICAgcHJldmlld1dyYXBwZXJFbC5jcmVhdGVFbCgncCcsIHtcbiAgICAgIHRleHQ6ICdFeGFtcGxlIGNsb3VkIGZvciByZW5kZXIgc2V0dGluZ3MgKGRvZXMgbm90IHVzZSB5b3VyIHZhdWx0IGRhdGEpLicsXG4gICAgfSk7XG4gICAgY29uc3QgcHJldmlld0NhbnZhc0VsID0gcHJldmlld1dyYXBwZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXNldHRpbmdzLXByZXZpZXctY2FudmFzJyB9KTtcblxuICAgIGxldCBwcmV2aWV3Tm9uY2UgPSAwO1xuICAgIGNvbnN0IHJlcmVuZGVyUHJldmlldyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIGNvbnN0IG5vbmNlID0gKytwcmV2aWV3Tm9uY2U7XG4gICAgICBwcmV2aWV3Q2FudmFzRWwuZW1wdHkoKTtcbiAgICAgIGNvbnN0IGxvYWRpbmdFbCA9IHByZXZpZXdDYW52YXNFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJywgdGV4dDogJ1JlbmRlcmluZyBwcmV2aWV3Li4uJyB9KTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc2FtcGxlV29yZHMgPSB0aGlzLmJ1aWxkUHJldmlld1dvcmRzKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlcik7XG4gICAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uZHJhd1dvcmRDbG91ZCh7XG4gICAgICAgICAgY29udGFpbmVyRWw6IHByZXZpZXdDYW52YXNFbCxcbiAgICAgICAgICB3b3Jkczogc2FtcGxlV29yZHMsXG4gICAgICAgICAgYXJpYUxhYmVsOiAnV29yZCBjbG91ZCByZW5kZXIgcHJldmlldycsXG4gICAgICAgICAgb25SZWZyZXNoOiByZXJlbmRlclByZXZpZXcsXG4gICAgICAgICAgb25Xb3JkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgIC8vIG5vLW9wIGluIHNldHRpbmdzIHByZXZpZXdcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVuYWJsZUV4cG9ydDogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIGlmIChub25jZSAhPT0gcHJldmlld05vbmNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuICAgICAgICBwcmV2aWV3Q2FudmFzRWwuY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJyxcbiAgICAgICAgICB0ZXh0OiAnQ291bGQgbm90IHJlbmRlciBwcmV2aWV3LicsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3ID0gYXN5bmMgKHBhdGNoOiBQYXJ0aWFsPFJlbmRlclNldHRpbmdzPik6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udXBkYXRlUmVuZGVyU2V0dGluZ3MocGF0Y2gpO1xuICAgICAgYXdhaXQgcmVyZW5kZXJQcmV2aWV3KCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHJvdGF0aW9uU3R5bGUgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdSb3RhdGlvbiBzdHlsZScpXG4gICAgICAuc2V0RGVzYygnSG93IHdvcmRzIGFyZSBhbmdsZWQgaW4gdGhlIGNsb3VkLicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbignaG9yaXpvbnRhbCcsICdIb3Jpem9udGFsIG9ubHknKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ21vc3RseS1ob3Jpem9udGFsJywgJ01vc3RseSBob3Jpem9udGFsJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdtaXhlZCcsICdNaXhlZCBhbmdsZXMnKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ3ZlcnRpY2FsJywgJ1ZlcnRpY2FsIGhlYXZ5JylcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnJvdGF0aW9uUHJlc2V0KVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoe1xuICAgICAgICAgICAgICByb3RhdGlvblByZXNldDogdmFsdWUgYXMgUm90YXRpb25QcmVzZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24ocm90YXRpb25TdHlsZSwgJ0hvcml6b250YWwgaXMgZWFzaWVzdCB0byByZWFkLiBNaXhlZC92ZXJ0aWNhbCBjYW4gcGFjayBtb3JlIHdvcmRzIGJ1dCBtYXkgcmVkdWNlIHJlYWRhYmlsaXR5LicpO1xuXG4gICAgY29uc3Qgc3BpcmFsTGF5b3V0ID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnU3BpcmFsIGxheW91dCcpXG4gICAgICAuc2V0RGVzYygnUGxhY2VtZW50IHN0cmF0ZWd5IGZvciBwb3NpdGlvbmluZyB3b3Jkcy4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ2FyY2hpbWVkZWFuJywgJ0FyY2hpbWVkZWFuJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdyZWN0YW5ndWxhcicsICdSZWN0YW5ndWxhcicpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5zcGlyYWwpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7XG4gICAgICAgICAgICAgIHNwaXJhbDogdmFsdWUgYXMgU3BpcmFsVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihzcGlyYWxMYXlvdXQsICdBcmNoaW1lZGVhbiBpcyBtb3JlIG9yZ2FuaWMuIFJlY3Rhbmd1bGFyIGNhbiBhcHBlYXIgdGlnaHRlciBpbiBzb21lIGRhdGFzZXRzLicpO1xuXG4gICAgY29uc3Qgd29yZFBhZGRpbmcgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdXb3JkIHBhZGRpbmcnKVxuICAgICAgLnNldERlc2MoJ1NwYWNlIGJldHdlZW4gd29yZHMgaW4gcGl4ZWxzLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cygwLCAxMiwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLndvcmRQYWRkaW5nKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IHdvcmRQYWRkaW5nOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24od29yZFBhZGRpbmcsICdJbmNyZWFzZSB0byByZWR1Y2UgY29sbGlzaW9ucyBhbmQgaW1wcm92ZSByZWFkYWJpbGl0eS4gTG93ZXIgdmFsdWVzIHBhY2sgbW9yZSB3b3Jkcy4nKTtcblxuICAgIGNvbnN0IG1pbkZvbnRTaXplID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnTWluaW11bSBmb250IHNpemUnKVxuICAgICAgLnNldERlc2MoJ1NtYWxsZXN0IHJlbmRlcmVkIHdvcmQgc2l6ZS4nKVxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG4gICAgICAgIHNsaWRlclxuICAgICAgICAgIC5zZXRMaW1pdHMoOCwgNjQsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5taW5Gb250U2l6ZSlcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyBtaW5Gb250U2l6ZTogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKG1pbkZvbnRTaXplLCAnU2V0cyB0aGUgZmxvb3Igb2YgdmlzdWFsIHNpemUgbWFwcGluZy4gSGlnaGVyIG1pbmltdW0gbWFrZXMgbG93LWZyZXF1ZW5jeSB3b3JkcyBtb3JlIGxlZ2libGUuJyk7XG5cbiAgICBjb25zdCBtYXhGb250U2l6ZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ01heGltdW0gZm9udCBzaXplJylcbiAgICAgIC5zZXREZXNjKCdMYXJnZXN0IHJlbmRlcmVkIHdvcmQgc2l6ZS4nKVxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG4gICAgICAgIHNsaWRlclxuICAgICAgICAgIC5zZXRMaW1pdHMoMTYsIDE0MCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLm1heEZvbnRTaXplKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IG1heEZvbnRTaXplOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24obWF4Rm9udFNpemUsICdTZXRzIHRoZSBjZWlsaW5nIG9mIHZpc3VhbCBzaXplIG1hcHBpbmcuIEhpZ2hlciB2YWx1ZXMgZW1waGFzaXplIHRvcCB3b3JkcyBtb3JlIHN0cm9uZ2x5LicpO1xuXG4gICAgY29uc3QgZm9udEZhbWlseSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0ZvbnQgZmFtaWx5JylcbiAgICAgIC5zZXREZXNjKCdDU1MgZm9udCBmYW1pbHkgdXNlZCBmb3Igd29yZHMuJylcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB7XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ3NhbnMtc2VyaWYnKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuZm9udEZhbWlseSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgZm9udEZhbWlseTogdmFsdWUudHJpbSgpIHx8ICdzYW5zLXNlcmlmJyB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oZm9udEZhbWlseSwgJ1dpZGVyIGZvbnRzIHRha2UgbW9yZSBzcGFjZSBhbmQgY2FuIGluY3JlYXNlIG92ZXJsYXAgcHJlc3N1cmUuJyk7XG5cbiAgICBjb25zdCBzaG93Q291bnRJbldvcmRUZXh0ID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnU2hvdyB2YWx1ZSBpbiB3b3JkIHRleHQnKVxuICAgICAgLnNldERlc2MoJ0FwcGVuZCBjb3VudCBvciBmcmVxdWVuY3kgZGlyZWN0bHkgdG8gcmVuZGVyZWQgd29yZHMuJylcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGVcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnNob3dDb3VudEluV29yZFRleHQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IHNob3dDb3VudEluV29yZFRleHQ6IHZhbHVlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHNob3dDb3VudEluV29yZFRleHQsICdTaG93cyB0aGUgc2VsZWN0ZWQgbWV0cmljIGlubGluZSAoZm9yIGV4YW1wbGUsIHdvcmQgKDEyKSBvciB3b3JkICg0LjMlKSkuIEltcHJvdmVzIHByZWNpc2lvbiwgaW5jcmVhc2VzIHRleHQgbGVuZ3RoLicpO1xuXG4gICAgY29uc3Qgd29yZFRleHRNZXRyaWMgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdXb3JkIHZhbHVlIG1vZGUnKVxuICAgICAgLnNldERlc2MoJ0Nob29zZSB3aGV0aGVyIGlubGluZSB2YWx1ZXMgc2hvdyBjb3VudCBvciBmcmVxdWVuY3kuJylcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9uKCdjb3VudCcsICdDb3VudCcpXG4gICAgICAgICAgLmFkZE9wdGlvbignZnJlcXVlbmN5JywgJ0ZyZXF1ZW5jeSAoJSknKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIud29yZFRleHRNZXRyaWMpXG4gICAgICAgICAgLnNldERpc2FibGVkKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuc2hvd0NvdW50SW5Xb3JkVGV4dClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgd29yZFRleHRNZXRyaWM6IHZhbHVlIGFzIFdvcmRUZXh0TWV0cmljIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbih3b3JkVGV4dE1ldHJpYywgJ0NvdW50IHNob3dzIHJhdyBvY2N1cnJlbmNlcy4gRnJlcXVlbmN5IHNob3dzIGVhY2ggd29yZCBhcyBhIHBlcmNlbnQgb2YgdmlzaWJsZSB3b3JkIG9jY3VycmVuY2VzLicpO1xuXG4gICAgY29uc3Qgc2hvd1dvcmRUZXh0TWV0cmljVG9nZ2xlID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnU2hvdyBjb3VudC9mcmVxdWVuY3kgdG9nZ2xlIGJ1dHRvbicpXG4gICAgICAuc2V0RGVzYygnQWRkIGEgcmVuZGVyZWQtdmlldyBidXR0b24gdG8gc3dpdGNoIGlubGluZSBsYWJlbHMgYmV0d2VlbiBjb3VudCBhbmQgZnJlcXVlbmN5LicpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5zaG93V29yZFRleHRNZXRyaWNUb2dnbGUpXG4gICAgICAgICAgLnNldERpc2FibGVkKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuc2hvd0NvdW50SW5Xb3JkVGV4dClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgc2hvd1dvcmRUZXh0TWV0cmljVG9nZ2xlOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oc2hvd1dvcmRUZXh0TWV0cmljVG9nZ2xlLCAnV2hlbiBlbmFibGVkLCBlYWNoIGNsb3VkIHNob3dzIGEgcXVpY2sgdG9nZ2xlIGluIHRoZSBjb3JuZXIgY29udHJvbHMuJyk7XG5cbiAgICBjb25zdCBjb3VudExhYmVsRm9ybWF0ID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnQ291bnQgbGFiZWwgZm9ybWF0JylcbiAgICAgIC5zZXREZXNjKCdIb3cgaW5saW5lIHZhbHVlcyBhcmUgc2hvd24gd2hlbiB3b3JkIHRleHQgdmFsdWVzIGFyZSBlbmFibGVkLicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbigncGFyZW4nLCAnd29yZCAoMTIpJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdkb3QnLCAnd29yZCBcdTAwQjcgMTInKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ2NvbG9uJywgJ3dvcmQ6IDEyJylcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmNvdW50TGFiZWxGb3JtYXQpXG4gICAgICAgICAgLnNldERpc2FibGVkKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuc2hvd0NvdW50SW5Xb3JkVGV4dClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgY291bnRMYWJlbEZvcm1hdDogdmFsdWUgYXMgQ291bnRMYWJlbEZvcm1hdCB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oY291bnRMYWJlbEZvcm1hdCwgJ0Zvcm1hdHRpbmcgc3R5bGUgZm9yIGlubGluZSBjb3VudHMuJyk7XG5cbiAgICBjb25zdCBjb3VudExhYmVsTWluaW11bSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0NvdW50IGxhYmVsIG1pbmltdW0nKVxuICAgICAgLnNldERlc2MoJ1Nob3cgaW5saW5lIGNvdW50IG9ubHkgZm9yIHdvcmRzIGF0IG9yIGFib3ZlIHRoaXMgY291bnQuJylcbiAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT4ge1xuICAgICAgICBzbGlkZXJcbiAgICAgICAgICAuc2V0TGltaXRzKDEsIDEwMCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmNvdW50TGFiZWxNaW5Db3VudClcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5zZXREaXNhYmxlZCghdGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnNob3dDb3VudEluV29yZFRleHQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IGNvdW50TGFiZWxNaW5Db3VudDogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGNvdW50TGFiZWxNaW5pbXVtLCAnQXZvaWRzIHZpc3VhbCBub2lzZSBieSBoaWRpbmcgY291bnRzIGZvciB2ZXJ5IHNtYWxsIHZhbHVlcy4nKTtcblxuICAgIGNvbnN0IHNpemVTY2FsaW5nTW9kZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1NpemUgc2NhbGluZyBtb2RlJylcbiAgICAgIC5zZXREZXNjKCdIb3cgbnVtZXJpYyBjb3VudCBkaWZmZXJlbmNlcyBtYXAgdG8gZm9udC1zaXplIGRpZmZlcmVuY2VzLicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbignbGluZWFyJywgJ0xpbmVhcicpXG4gICAgICAgICAgLmFkZE9wdGlvbigncG93ZXInLCAnUG93ZXInKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ2xvZycsICdMb2cnKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ3JhbmsnLCAnUmFuaycpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5zY2FsaW5nTW9kZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgc2NhbGluZ01vZGU6IHZhbHVlIGFzIFNjYWxpbmdNb2RlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHNpemVTY2FsaW5nTW9kZSwgJ0xpbmVhciBpcyBwcm9wb3J0aW9uYWwuIFBvd2VyIGV4YWdnZXJhdGVzIGdhcHMuIExvZyBjb21wcmVzc2VzIGV4dHJlbWVzLiBSYW5rIGlnbm9yZXMgYWJzb2x1dGUgZ2Fwcy4nKTtcblxuICAgIGNvbnN0IGVtcGhhc2lzID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnRW1waGFzaXMnKVxuICAgICAgLnNldERlc2MoJ0hpZ2hlciB2YWx1ZXMgZXhhZ2dlcmF0ZSBzaXplIGRpZmZlcmVuY2VzIChwb3dlciBzY2FsaW5nIG1vZGUpLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cygwLjUsIDMsIDAuMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmVtcGhhc2lzKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLnNldERpc2FibGVkKHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbmRlci5zY2FsaW5nTW9kZSAhPT0gJ3Bvd2VyJylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgZW1waGFzaXM6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihlbXBoYXNpcywgJ09ubHkgdXNlZCBpbiBQb3dlciBzY2FsaW5nIG1vZGUuIDEuMCBpcyBiYXNlbGluZTsgaGlnaGVyIGV4YWdnZXJhdGVzIGRpZmZlcmVuY2VzIG1vcmUuJyk7XG5cbiAgICBjb25zdCBkZXRlcm1pbmlzdGljTGF5b3V0ID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnRGV0ZXJtaW5pc3RpYyBsYXlvdXQnKVxuICAgICAgLnNldERlc2MoJ0tlZXAgY2xvdWQgbGF5b3V0IHN0YWJsZSBhY3Jvc3MgcmVmcmVzaGVzIHVzaW5nIGEgc2VlZC4nKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIuZGV0ZXJtaW5pc3RpY0xheW91dClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgZGV0ZXJtaW5pc3RpY0xheW91dDogdmFsdWUgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oZGV0ZXJtaW5pc3RpY0xheW91dCwgJ1VzZWZ1bCBmb3IgY29tcGFyaW5nIGJlZm9yZS9hZnRlciBjaGFuZ2VzIHdpdGggc3RhYmxlIHBvc2l0aW9ucy4nKTtcblxuICAgIGNvbnN0IHJhbmRvbVNlZWQgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdSYW5kb20gc2VlZCcpXG4gICAgICAuc2V0RGVzYygnU2VlZCB1c2VkIHdoZW4gZGV0ZXJtaW5pc3RpYyBsYXlvdXQgaXMgZW5hYmxlZC4nKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRWYWx1ZShTdHJpbmcodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnJhbmRvbVNlZWQpKVxuICAgICAgICAgIC5zZXREaXNhYmxlZCghdGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmRldGVybWluaXN0aWNMYXlvdXQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XG4gICAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyByYW5kb21TZWVkOiBwYXJzZWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHJhbmRvbVNlZWQsICdDaGFuZ2luZyBzZWVkIGdpdmVzIGEgZGlmZmVyZW50IHN0YWJsZSBhcnJhbmdlbWVudC4nKTtcblxuICAgIGNvbnN0IHJlc2V0UmVuZGVyaW5nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUmVzZXQgcmVuZGVyaW5nIHNldHRpbmdzJylcbiAgICAgIC5zZXREZXNjKCdSZXN0b3JlIGRlZmF1bHQgcmVuZGVyZXIgY29udHJvbHMuJylcbiAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b25cbiAgICAgICAgICAuc2V0QnV0dG9uVGV4dCgnUmVzZXQgcmVuZGVyaW5nJylcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5yZXNldFJlbmRlclNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24ocmVzZXRSZW5kZXJpbmcsICdSZXNldHMgcmVuZGVyaW5nIG9wdGlvbnMgb25seS4nKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMycsIHsgdGV4dDogJ1BlcmZvcm1hbmNlJyB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgncCcsIHtcbiAgICAgIHRleHQ6ICdUdW5lIHNwZWVkIHZzIFVJIHNtb290aG5lc3MgYW5kIHByb2dyZXNzIHVwZGF0ZSBkZXRhaWwgZm9yIGxhcmdlIGNsb3Vkcy4nLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvZ3Jlc3NEZXRhaWwgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdQcm9ncmVzcyBkZXRhaWwnKVxuICAgICAgLnNldERlc2MoJ0hvdyBmcmVxdWVudGx5IHByb2dyZXNzIGlzIHVwZGF0ZWQgd2hpbGUgc2Nhbm5pbmcgYW5kIGxheW91dC4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ3VuaGluZ2VkJywgJ1VuaGluZ2VkIChtYXggc3BlZWQpJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdtaW5pbWFsJywgJ01pbmltYWwgKGZhc3Rlc3QpJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdiYWxhbmNlZCcsICdCYWxhbmNlZCcpXG4gICAgICAgICAgLmFkZE9wdGlvbignZGV0YWlsZWQnLCAnRGV0YWlsZWQnKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW5kZXIucHJvZ3Jlc3NEZXRhaWwpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udXBkYXRlUmVuZGVyU2V0dGluZ3MoeyBwcm9ncmVzc0RldGFpbDogdmFsdWUgYXMgUHJvZ3Jlc3NEZXRhaWwgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHByb2dyZXNzRGV0YWlsLCAnVW5oaW5nZWQgbWF4aW1pemVzIHNwZWVkIGFuZCBtYXkgbG9jayBVSSB0ZW1wb3JhcmlseS4gRGV0YWlsZWQgaXMgbW9zdCBpbmZvcm1hdGl2ZSBidXQgc2xvd2VyLicpO1xuXG4gICAgY29uc3Qgc2NhbkJhdGNoU2l6ZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1NjYW4gYmF0Y2ggc2l6ZScpXG4gICAgICAuc2V0RGVzYygnSG93IG1hbnkgZmlsZXMgYXJlIHJlYWQgaW4gcGFyYWxsZWwgZHVyaW5nIHZhdWx0IHNjYW5uaW5nLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cyg4LCA2NCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLnNjYW5CYXRjaFNpemUpXG4gICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi51cGRhdGVSZW5kZXJTZXR0aW5ncyh7IHNjYW5CYXRjaFNpemU6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihzY2FuQmF0Y2hTaXplLCAnSGlnaGVyIGNhbiBiZSBmYXN0ZXIgb24gc3Ryb25nIGRldmljZXMgYnV0IHVzZXMgbW9yZSBtZW1vcnkvSU8uJyk7XG5cbiAgICBjb25zdCBsYXlvdXRUaW1lU2xpY2UgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdMYXlvdXQgdGltZSBzbGljZSAobXMpJylcbiAgICAgIC5zZXREZXNjKCdUaW1lIHBlciBsYXlvdXQgY2h1bmsuIExvd2VyIGlzIHNtb290aGVyOyBoaWdoZXIgaXMgZmFzdGVyLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cyg4LCA0MCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVuZGVyLmxheW91dFRpbWVJbnRlcnZhbE1zKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udXBkYXRlUmVuZGVyU2V0dGluZ3MoeyBsYXlvdXRUaW1lSW50ZXJ2YWxNczogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGxheW91dFRpbWVTbGljZSwgJ0NvbnRyb2xzIHJlc3BvbnNpdmVuZXNzIHdoaWxlIGxheWluZyBvdXQgd29yZHMuJyk7XG5cbiAgICBjb25zdCByZXNldFBlcmZvcm1hbmNlID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUmVzZXQgcGVyZm9ybWFuY2Ugc2V0dGluZ3MnKVxuICAgICAgLnNldERlc2MoJ1Jlc3RvcmUgZGVmYXVsdCBwZXJmb3JtYW5jZSB0dW5pbmcgdmFsdWVzLicpXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uXG4gICAgICAgICAgLnNldEJ1dHRvblRleHQoJ1Jlc2V0IHBlcmZvcm1hbmNlJylcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi51cGRhdGVSZW5kZXJTZXR0aW5ncyh7XG4gICAgICAgICAgICAgIHByb2dyZXNzRGV0YWlsOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5wcm9ncmVzc0RldGFpbCxcbiAgICAgICAgICAgICAgc2NhbkJhdGNoU2l6ZTogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuc2NhbkJhdGNoU2l6ZSxcbiAgICAgICAgICAgICAgbGF5b3V0VGltZUludGVydmFsTXM6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLmxheW91dFRpbWVJbnRlcnZhbE1zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24ocmVzZXRQZXJmb3JtYW5jZSwgJ1Jlc2V0cyBwZXJmb3JtYW5jZSB0dW5pbmcgb25seS4nKTtcblxuICAgIHZvaWQgcmVyZW5kZXJQcmV2aWV3KCk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaEluZm9JY29uKHNldHRpbmc6IFNldHRpbmcsIGluZm9UZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBpY29uID0gc2V0dGluZy5uYW1lRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIGNsczogJ3dvcmQtY2xvdWQtc2V0dGluZy1pbmZvJyxcbiAgICAgIHRleHQ6ICdpJyxcbiAgICB9KTtcbiAgICBpY29uLnR5cGUgPSAnYnV0dG9uJztcbiAgICBpY29uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnU2hvdyBzZXR0aW5nIGRldGFpbHMnKTtcbiAgICBpY29uLnNldEF0dHIoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicsICd0b3AnKTtcbiAgICBpY29uLnNldEF0dHIoJ2RhdGEtdG9vbHRpcCcsIGluZm9UZXh0KTtcblxuICAgIGNvbnN0IHBvcG92ZXIgPSBzZXR0aW5nLnNldHRpbmdFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLXNldHRpbmctaW5mby1wb3BvdmVyJyB9KTtcbiAgICBwb3BvdmVyLnNldFRleHQoaW5mb1RleHQpO1xuICAgIHBvcG92ZXIuc2V0QXR0cignaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIGljb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgaWYgKHBvcG92ZXIuaGFzQXR0cmlidXRlKCdoaWRkZW4nKSkge1xuICAgICAgICBwb3BvdmVyLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb3BvdmVyLnNldEF0dHIoJ2hpZGRlbicsICd0cnVlJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpY29uLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIHBvcG92ZXIuc2V0QXR0cignaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRQcmV2aWV3V29yZHMocmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzKTogV2VpZ2h0ZWRXb3JkW10ge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gW1xuICAgICAgeyB0ZXh0OiAnb2JzaWRpYW4nLCBjb3VudDogNDggfSxcbiAgICAgIHsgdGV4dDogJ25vdGVzJywgY291bnQ6IDQzIH0sXG4gICAgICB7IHRleHQ6ICdwbHVnaW5zJywgY291bnQ6IDM2IH0sXG4gICAgICB7IHRleHQ6ICd2YXVsdCcsIGNvdW50OiAzMyB9LFxuICAgICAgeyB0ZXh0OiAncmVzZWFyY2gnLCBjb3VudDogMjggfSxcbiAgICAgIHsgdGV4dDogJ2lkZWFzJywgY291bnQ6IDI1IH0sXG4gICAgICB7IHRleHQ6ICd3cml0aW5nJywgY291bnQ6IDIyIH0sXG4gICAgICB7IHRleHQ6ICdkYWlseScsIGNvdW50OiAyMCB9LFxuICAgICAgeyB0ZXh0OiAncHJvamVjdCcsIGNvdW50OiAxOCB9LFxuICAgICAgeyB0ZXh0OiAncmV2aWV3JywgY291bnQ6IDE2IH0sXG4gICAgICB7IHRleHQ6ICdkZXNpZ24nLCBjb3VudDogMTQgfSxcbiAgICAgIHsgdGV4dDogJ21lZXRpbmcnLCBjb3VudDogMTIgfSxcbiAgICAgIHsgdGV4dDogJ3Rhc2tzJywgY291bnQ6IDExIH0sXG4gICAgICB7IHRleHQ6ICdqb3VybmFsJywgY291bnQ6IDEwIH0sXG4gICAgICB7IHRleHQ6ICdkcmFmdCcsIGNvdW50OiA5IH0sXG4gICAgICB7IHRleHQ6ICdyZWFkaW5nJywgY291bnQ6IDggfSxcbiAgICAgIHsgdGV4dDogJ3BsYW4nLCBjb3VudDogNyB9LFxuICAgICAgeyB0ZXh0OiAnZm9jdXMnLCBjb3VudDogNiB9LFxuICAgICAgeyB0ZXh0OiAnaGFiaXQnLCBjb3VudDogNSB9LFxuICAgICAgeyB0ZXh0OiAnZ29hbHMnLCBjb3VudDogNCB9LFxuICAgIF07XG5cbiAgICByZXR1cm4gbWFwQ291bnRzVG9XZWlnaHRlZFdvcmRzKHRlbXBsYXRlLm1hcCgoZW50cnkpID0+IFtlbnRyeS50ZXh0LCBlbnRyeS5jb3VudF0gYXMgW3N0cmluZywgbnVtYmVyXSksIHJlbmRlclNldHRpbmdzKTtcbiAgfVxufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFzY2VuZGluZyhhLCBiKSB7XG4gIHJldHVybiBhID09IG51bGwgfHwgYiA9PSBudWxsID8gTmFOIDogYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IGEgPj0gYiA/IDAgOiBOYU47XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVzY2VuZGluZyhhLCBiKSB7XG4gIHJldHVybiBhID09IG51bGwgfHwgYiA9PSBudWxsID8gTmFOXG4gICAgOiBiIDwgYSA/IC0xXG4gICAgOiBiID4gYSA/IDFcbiAgICA6IGIgPj0gYSA/IDBcbiAgICA6IE5hTjtcbn1cbiIsICJpbXBvcnQgYXNjZW5kaW5nIGZyb20gXCIuL2FzY2VuZGluZy5qc1wiO1xuaW1wb3J0IGRlc2NlbmRpbmcgZnJvbSBcIi4vZGVzY2VuZGluZy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiaXNlY3RvcihmKSB7XG4gIGxldCBjb21wYXJlMSwgY29tcGFyZTIsIGRlbHRhO1xuXG4gIC8vIElmIGFuIGFjY2Vzc29yIGlzIHNwZWNpZmllZCwgcHJvbW90ZSBpdCB0byBhIGNvbXBhcmF0b3IuIEluIHRoaXMgY2FzZSB3ZVxuICAvLyBjYW4gdGVzdCB3aGV0aGVyIHRoZSBzZWFyY2ggdmFsdWUgaXMgKHNlbGYtKSBjb21wYXJhYmxlLiBXZSBjYW5cdTIwMTl0IGRvIHRoaXNcbiAgLy8gZm9yIGEgY29tcGFyYXRvciAoZXhjZXB0IGZvciBzcGVjaWZpYywga25vd24gY29tcGFyYXRvcnMpIGJlY2F1c2Ugd2UgY2FuXHUyMDE5dFxuICAvLyB0ZWxsIGlmIHRoZSBjb21wYXJhdG9yIGlzIHN5bW1ldHJpYywgYW5kIGFuIGFzeW1tZXRyaWMgY29tcGFyYXRvciBjYW5cdTIwMTl0IGJlXG4gIC8vIHVzZWQgdG8gdGVzdCB3aGV0aGVyIGEgc2luZ2xlIHZhbHVlIGlzIGNvbXBhcmFibGUuXG4gIGlmIChmLmxlbmd0aCAhPT0gMikge1xuICAgIGNvbXBhcmUxID0gYXNjZW5kaW5nO1xuICAgIGNvbXBhcmUyID0gKGQsIHgpID0+IGFzY2VuZGluZyhmKGQpLCB4KTtcbiAgICBkZWx0YSA9IChkLCB4KSA9PiBmKGQpIC0geDtcbiAgfSBlbHNlIHtcbiAgICBjb21wYXJlMSA9IGYgPT09IGFzY2VuZGluZyB8fCBmID09PSBkZXNjZW5kaW5nID8gZiA6IHplcm87XG4gICAgY29tcGFyZTIgPSBmO1xuICAgIGRlbHRhID0gZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlZnQoYSwgeCwgbG8gPSAwLCBoaSA9IGEubGVuZ3RoKSB7XG4gICAgaWYgKGxvIDwgaGkpIHtcbiAgICAgIGlmIChjb21wYXJlMSh4LCB4KSAhPT0gMCkgcmV0dXJuIGhpO1xuICAgICAgZG8ge1xuICAgICAgICBjb25zdCBtaWQgPSAobG8gKyBoaSkgPj4+IDE7XG4gICAgICAgIGlmIChjb21wYXJlMihhW21pZF0sIHgpIDwgMCkgbG8gPSBtaWQgKyAxO1xuICAgICAgICBlbHNlIGhpID0gbWlkO1xuICAgICAgfSB3aGlsZSAobG8gPCBoaSk7XG4gICAgfVxuICAgIHJldHVybiBsbztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJpZ2h0KGEsIHgsIGxvID0gMCwgaGkgPSBhLmxlbmd0aCkge1xuICAgIGlmIChsbyA8IGhpKSB7XG4gICAgICBpZiAoY29tcGFyZTEoeCwgeCkgIT09IDApIHJldHVybiBoaTtcbiAgICAgIGRvIHtcbiAgICAgICAgY29uc3QgbWlkID0gKGxvICsgaGkpID4+PiAxO1xuICAgICAgICBpZiAoY29tcGFyZTIoYVttaWRdLCB4KSA8PSAwKSBsbyA9IG1pZCArIDE7XG4gICAgICAgIGVsc2UgaGkgPSBtaWQ7XG4gICAgICB9IHdoaWxlIChsbyA8IGhpKTtcbiAgICB9XG4gICAgcmV0dXJuIGxvO1xuICB9XG5cbiAgZnVuY3Rpb24gY2VudGVyKGEsIHgsIGxvID0gMCwgaGkgPSBhLmxlbmd0aCkge1xuICAgIGNvbnN0IGkgPSBsZWZ0KGEsIHgsIGxvLCBoaSAtIDEpO1xuICAgIHJldHVybiBpID4gbG8gJiYgZGVsdGEoYVtpIC0gMV0sIHgpID4gLWRlbHRhKGFbaV0sIHgpID8gaSAtIDEgOiBpO1xuICB9XG5cbiAgcmV0dXJuIHtsZWZ0LCBjZW50ZXIsIHJpZ2h0fTtcbn1cblxuZnVuY3Rpb24gemVybygpIHtcbiAgcmV0dXJuIDA7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbnVtYmVyKHgpIHtcbiAgcmV0dXJuIHggPT09IG51bGwgPyBOYU4gOiAreDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiBudW1iZXJzKHZhbHVlcywgdmFsdWVvZikge1xuICBpZiAodmFsdWVvZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiAodmFsdWUgPSArdmFsdWUpID49IHZhbHVlKSB7XG4gICAgICAgIHlpZWxkIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIGlmICgodmFsdWUgPSB2YWx1ZW9mKHZhbHVlLCArK2luZGV4LCB2YWx1ZXMpKSAhPSBudWxsICYmICh2YWx1ZSA9ICt2YWx1ZSkgPj0gdmFsdWUpIHtcbiAgICAgICAgeWllbGQgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IGFzY2VuZGluZyBmcm9tIFwiLi9hc2NlbmRpbmcuanNcIjtcbmltcG9ydCBiaXNlY3RvciBmcm9tIFwiLi9iaXNlY3Rvci5qc1wiO1xuaW1wb3J0IG51bWJlciBmcm9tIFwiLi9udW1iZXIuanNcIjtcblxuY29uc3QgYXNjZW5kaW5nQmlzZWN0ID0gYmlzZWN0b3IoYXNjZW5kaW5nKTtcbmV4cG9ydCBjb25zdCBiaXNlY3RSaWdodCA9IGFzY2VuZGluZ0Jpc2VjdC5yaWdodDtcbmV4cG9ydCBjb25zdCBiaXNlY3RMZWZ0ID0gYXNjZW5kaW5nQmlzZWN0LmxlZnQ7XG5leHBvcnQgY29uc3QgYmlzZWN0Q2VudGVyID0gYmlzZWN0b3IobnVtYmVyKS5jZW50ZXI7XG5leHBvcnQgZGVmYXVsdCBiaXNlY3RSaWdodDtcbiIsICJleHBvcnQgY2xhc3MgSW50ZXJuTWFwIGV4dGVuZHMgTWFwIHtcbiAgY29uc3RydWN0b3IoZW50cmllcywga2V5ID0ga2V5b2YpIHtcbiAgICBzdXBlcigpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtfaW50ZXJuOiB7dmFsdWU6IG5ldyBNYXAoKX0sIF9rZXk6IHt2YWx1ZToga2V5fX0pO1xuICAgIGlmIChlbnRyaWVzICE9IG51bGwpIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGVudHJpZXMpIHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuICB9XG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gc3VwZXIuZ2V0KGludGVybl9nZXQodGhpcywga2V5KSk7XG4gIH1cbiAgaGFzKGtleSkge1xuICAgIHJldHVybiBzdXBlci5oYXMoaW50ZXJuX2dldCh0aGlzLCBrZXkpKTtcbiAgfVxuICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5zZXQoaW50ZXJuX3NldCh0aGlzLCBrZXkpLCB2YWx1ZSk7XG4gIH1cbiAgZGVsZXRlKGtleSkge1xuICAgIHJldHVybiBzdXBlci5kZWxldGUoaW50ZXJuX2RlbGV0ZSh0aGlzLCBrZXkpKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW50ZXJuU2V0IGV4dGVuZHMgU2V0IHtcbiAgY29uc3RydWN0b3IodmFsdWVzLCBrZXkgPSBrZXlvZikge1xuICAgIHN1cGVyKCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge19pbnRlcm46IHt2YWx1ZTogbmV3IE1hcCgpfSwgX2tleToge3ZhbHVlOiBrZXl9fSk7XG4gICAgaWYgKHZhbHVlcyAhPSBudWxsKSBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykgdGhpcy5hZGQodmFsdWUpO1xuICB9XG4gIGhhcyh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5oYXMoaW50ZXJuX2dldCh0aGlzLCB2YWx1ZSkpO1xuICB9XG4gIGFkZCh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5hZGQoaW50ZXJuX3NldCh0aGlzLCB2YWx1ZSkpO1xuICB9XG4gIGRlbGV0ZSh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5kZWxldGUoaW50ZXJuX2RlbGV0ZSh0aGlzLCB2YWx1ZSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludGVybl9nZXQoe19pbnRlcm4sIF9rZXl9LCB2YWx1ZSkge1xuICBjb25zdCBrZXkgPSBfa2V5KHZhbHVlKTtcbiAgcmV0dXJuIF9pbnRlcm4uaGFzKGtleSkgPyBfaW50ZXJuLmdldChrZXkpIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGludGVybl9zZXQoe19pbnRlcm4sIF9rZXl9LCB2YWx1ZSkge1xuICBjb25zdCBrZXkgPSBfa2V5KHZhbHVlKTtcbiAgaWYgKF9pbnRlcm4uaGFzKGtleSkpIHJldHVybiBfaW50ZXJuLmdldChrZXkpO1xuICBfaW50ZXJuLnNldChrZXksIHZhbHVlKTtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBpbnRlcm5fZGVsZXRlKHtfaW50ZXJuLCBfa2V5fSwgdmFsdWUpIHtcbiAgY29uc3Qga2V5ID0gX2tleSh2YWx1ZSk7XG4gIGlmIChfaW50ZXJuLmhhcyhrZXkpKSB7XG4gICAgdmFsdWUgPSBfaW50ZXJuLmdldChrZXkpO1xuICAgIF9pbnRlcm4uZGVsZXRlKGtleSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBrZXlvZih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG59XG4iLCAiY29uc3QgZTEwID0gTWF0aC5zcXJ0KDUwKSxcbiAgICBlNSA9IE1hdGguc3FydCgxMCksXG4gICAgZTIgPSBNYXRoLnNxcnQoMik7XG5cbmZ1bmN0aW9uIHRpY2tTcGVjKHN0YXJ0LCBzdG9wLCBjb3VudCkge1xuICBjb25zdCBzdGVwID0gKHN0b3AgLSBzdGFydCkgLyBNYXRoLm1heCgwLCBjb3VudCksXG4gICAgICBwb3dlciA9IE1hdGguZmxvb3IoTWF0aC5sb2cxMChzdGVwKSksXG4gICAgICBlcnJvciA9IHN0ZXAgLyBNYXRoLnBvdygxMCwgcG93ZXIpLFxuICAgICAgZmFjdG9yID0gZXJyb3IgPj0gZTEwID8gMTAgOiBlcnJvciA+PSBlNSA/IDUgOiBlcnJvciA+PSBlMiA/IDIgOiAxO1xuICBsZXQgaTEsIGkyLCBpbmM7XG4gIGlmIChwb3dlciA8IDApIHtcbiAgICBpbmMgPSBNYXRoLnBvdygxMCwgLXBvd2VyKSAvIGZhY3RvcjtcbiAgICBpMSA9IE1hdGgucm91bmQoc3RhcnQgKiBpbmMpO1xuICAgIGkyID0gTWF0aC5yb3VuZChzdG9wICogaW5jKTtcbiAgICBpZiAoaTEgLyBpbmMgPCBzdGFydCkgKytpMTtcbiAgICBpZiAoaTIgLyBpbmMgPiBzdG9wKSAtLWkyO1xuICAgIGluYyA9IC1pbmM7XG4gIH0gZWxzZSB7XG4gICAgaW5jID0gTWF0aC5wb3coMTAsIHBvd2VyKSAqIGZhY3RvcjtcbiAgICBpMSA9IE1hdGgucm91bmQoc3RhcnQgLyBpbmMpO1xuICAgIGkyID0gTWF0aC5yb3VuZChzdG9wIC8gaW5jKTtcbiAgICBpZiAoaTEgKiBpbmMgPCBzdGFydCkgKytpMTtcbiAgICBpZiAoaTIgKiBpbmMgPiBzdG9wKSAtLWkyO1xuICB9XG4gIGlmIChpMiA8IGkxICYmIDAuNSA8PSBjb3VudCAmJiBjb3VudCA8IDIpIHJldHVybiB0aWNrU3BlYyhzdGFydCwgc3RvcCwgY291bnQgKiAyKTtcbiAgcmV0dXJuIFtpMSwgaTIsIGluY107XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRpY2tzKHN0YXJ0LCBzdG9wLCBjb3VudCkge1xuICBzdG9wID0gK3N0b3AsIHN0YXJ0ID0gK3N0YXJ0LCBjb3VudCA9ICtjb3VudDtcbiAgaWYgKCEoY291bnQgPiAwKSkgcmV0dXJuIFtdO1xuICBpZiAoc3RhcnQgPT09IHN0b3ApIHJldHVybiBbc3RhcnRdO1xuICBjb25zdCByZXZlcnNlID0gc3RvcCA8IHN0YXJ0LCBbaTEsIGkyLCBpbmNdID0gcmV2ZXJzZSA/IHRpY2tTcGVjKHN0b3AsIHN0YXJ0LCBjb3VudCkgOiB0aWNrU3BlYyhzdGFydCwgc3RvcCwgY291bnQpO1xuICBpZiAoIShpMiA+PSBpMSkpIHJldHVybiBbXTtcbiAgY29uc3QgbiA9IGkyIC0gaTEgKyAxLCB0aWNrcyA9IG5ldyBBcnJheShuKTtcbiAgaWYgKHJldmVyc2UpIHtcbiAgICBpZiAoaW5jIDwgMCkgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyArK2kpIHRpY2tzW2ldID0gKGkyIC0gaSkgLyAtaW5jO1xuICAgIGVsc2UgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyArK2kpIHRpY2tzW2ldID0gKGkyIC0gaSkgKiBpbmM7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGluYyA8IDApIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgKytpKSB0aWNrc1tpXSA9IChpMSArIGkpIC8gLWluYztcbiAgICBlbHNlIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgKytpKSB0aWNrc1tpXSA9IChpMSArIGkpICogaW5jO1xuICB9XG4gIHJldHVybiB0aWNrcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2tJbmNyZW1lbnQoc3RhcnQsIHN0b3AsIGNvdW50KSB7XG4gIHN0b3AgPSArc3RvcCwgc3RhcnQgPSArc3RhcnQsIGNvdW50ID0gK2NvdW50O1xuICByZXR1cm4gdGlja1NwZWMoc3RhcnQsIHN0b3AsIGNvdW50KVsyXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2tTdGVwKHN0YXJ0LCBzdG9wLCBjb3VudCkge1xuICBzdG9wID0gK3N0b3AsIHN0YXJ0ID0gK3N0YXJ0LCBjb3VudCA9ICtjb3VudDtcbiAgY29uc3QgcmV2ZXJzZSA9IHN0b3AgPCBzdGFydCwgaW5jID0gcmV2ZXJzZSA/IHRpY2tJbmNyZW1lbnQoc3RvcCwgc3RhcnQsIGNvdW50KSA6IHRpY2tJbmNyZW1lbnQoc3RhcnQsIHN0b3AsIGNvdW50KTtcbiAgcmV0dXJuIChyZXZlcnNlID8gLTEgOiAxKSAqIChpbmMgPCAwID8gMSAvIC1pbmMgOiBpbmMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gIHN0YXJ0ID0gK3N0YXJ0LCBzdG9wID0gK3N0b3AsIHN0ZXAgPSAobiA9IGFyZ3VtZW50cy5sZW5ndGgpIDwgMiA/IChzdG9wID0gc3RhcnQsIHN0YXJ0ID0gMCwgMSkgOiBuIDwgMyA/IDEgOiArc3RlcDtcblxuICB2YXIgaSA9IC0xLFxuICAgICAgbiA9IE1hdGgubWF4KDAsIE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApKSB8IDAsXG4gICAgICByYW5nZSA9IG5ldyBBcnJheShuKTtcblxuICB3aGlsZSAoKytpIDwgbikge1xuICAgIHJhbmdlW2ldID0gc3RhcnQgKyBpICogc3RlcDtcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gaW5pdFJhbmdlKGRvbWFpbiwgcmFuZ2UpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiBicmVhaztcbiAgICBjYXNlIDE6IHRoaXMucmFuZ2UoZG9tYWluKTsgYnJlYWs7XG4gICAgZGVmYXVsdDogdGhpcy5yYW5nZShyYW5nZSkuZG9tYWluKGRvbWFpbik7IGJyZWFrO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdEludGVycG9sYXRvcihkb21haW4sIGludGVycG9sYXRvcikge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IGJyZWFrO1xuICAgIGNhc2UgMToge1xuICAgICAgaWYgKHR5cGVvZiBkb21haW4gPT09IFwiZnVuY3Rpb25cIikgdGhpcy5pbnRlcnBvbGF0b3IoZG9tYWluKTtcbiAgICAgIGVsc2UgdGhpcy5yYW5nZShkb21haW4pO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHRoaXMuZG9tYWluKGRvbWFpbik7XG4gICAgICBpZiAodHlwZW9mIGludGVycG9sYXRvciA9PT0gXCJmdW5jdGlvblwiKSB0aGlzLmludGVycG9sYXRvcihpbnRlcnBvbGF0b3IpO1xuICAgICAgZWxzZSB0aGlzLnJhbmdlKGludGVycG9sYXRvcik7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiaW1wb3J0IHtJbnRlcm5NYXB9IGZyb20gXCJkMy1hcnJheVwiO1xuaW1wb3J0IHtpbml0UmFuZ2V9IGZyb20gXCIuL2luaXQuanNcIjtcblxuZXhwb3J0IGNvbnN0IGltcGxpY2l0ID0gU3ltYm9sKFwiaW1wbGljaXRcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9yZGluYWwoKSB7XG4gIHZhciBpbmRleCA9IG5ldyBJbnRlcm5NYXAoKSxcbiAgICAgIGRvbWFpbiA9IFtdLFxuICAgICAgcmFuZ2UgPSBbXSxcbiAgICAgIHVua25vd24gPSBpbXBsaWNpdDtcblxuICBmdW5jdGlvbiBzY2FsZShkKSB7XG4gICAgbGV0IGkgPSBpbmRleC5nZXQoZCk7XG4gICAgaWYgKGkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHVua25vd24gIT09IGltcGxpY2l0KSByZXR1cm4gdW5rbm93bjtcbiAgICAgIGluZGV4LnNldChkLCBpID0gZG9tYWluLnB1c2goZCkgLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHJhbmdlW2kgJSByYW5nZS5sZW5ndGhdO1xuICB9XG5cbiAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oXykge1xuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRvbWFpbi5zbGljZSgpO1xuICAgIGRvbWFpbiA9IFtdLCBpbmRleCA9IG5ldyBJbnRlcm5NYXAoKTtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIF8pIHtcbiAgICAgIGlmIChpbmRleC5oYXModmFsdWUpKSBjb250aW51ZTtcbiAgICAgIGluZGV4LnNldCh2YWx1ZSwgZG9tYWluLnB1c2godmFsdWUpIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiBzY2FsZTtcbiAgfTtcblxuICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChyYW5nZSA9IEFycmF5LmZyb20oXyksIHNjYWxlKSA6IHJhbmdlLnNsaWNlKCk7XG4gIH07XG5cbiAgc2NhbGUudW5rbm93biA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh1bmtub3duID0gXywgc2NhbGUpIDogdW5rbm93bjtcbiAgfTtcblxuICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG9yZGluYWwoZG9tYWluLCByYW5nZSkudW5rbm93bih1bmtub3duKTtcbiAgfTtcblxuICBpbml0UmFuZ2UuYXBwbHkoc2NhbGUsIGFyZ3VtZW50cyk7XG5cbiAgcmV0dXJuIHNjYWxlO1xufVxuIiwgImltcG9ydCB7cmFuZ2UgYXMgc2VxdWVuY2V9IGZyb20gXCJkMy1hcnJheVwiO1xuaW1wb3J0IHtpbml0UmFuZ2V9IGZyb20gXCIuL2luaXQuanNcIjtcbmltcG9ydCBvcmRpbmFsIGZyb20gXCIuL29yZGluYWwuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmFuZCgpIHtcbiAgdmFyIHNjYWxlID0gb3JkaW5hbCgpLnVua25vd24odW5kZWZpbmVkKSxcbiAgICAgIGRvbWFpbiA9IHNjYWxlLmRvbWFpbixcbiAgICAgIG9yZGluYWxSYW5nZSA9IHNjYWxlLnJhbmdlLFxuICAgICAgcjAgPSAwLFxuICAgICAgcjEgPSAxLFxuICAgICAgc3RlcCxcbiAgICAgIGJhbmR3aWR0aCxcbiAgICAgIHJvdW5kID0gZmFsc2UsXG4gICAgICBwYWRkaW5nSW5uZXIgPSAwLFxuICAgICAgcGFkZGluZ091dGVyID0gMCxcbiAgICAgIGFsaWduID0gMC41O1xuXG4gIGRlbGV0ZSBzY2FsZS51bmtub3duO1xuXG4gIGZ1bmN0aW9uIHJlc2NhbGUoKSB7XG4gICAgdmFyIG4gPSBkb21haW4oKS5sZW5ndGgsXG4gICAgICAgIHJldmVyc2UgPSByMSA8IHIwLFxuICAgICAgICBzdGFydCA9IHJldmVyc2UgPyByMSA6IHIwLFxuICAgICAgICBzdG9wID0gcmV2ZXJzZSA/IHIwIDogcjE7XG4gICAgc3RlcCA9IChzdG9wIC0gc3RhcnQpIC8gTWF0aC5tYXgoMSwgbiAtIHBhZGRpbmdJbm5lciArIHBhZGRpbmdPdXRlciAqIDIpO1xuICAgIGlmIChyb3VuZCkgc3RlcCA9IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgc3RhcnQgKz0gKHN0b3AgLSBzdGFydCAtIHN0ZXAgKiAobiAtIHBhZGRpbmdJbm5lcikpICogYWxpZ247XG4gICAgYmFuZHdpZHRoID0gc3RlcCAqICgxIC0gcGFkZGluZ0lubmVyKTtcbiAgICBpZiAocm91bmQpIHN0YXJ0ID0gTWF0aC5yb3VuZChzdGFydCksIGJhbmR3aWR0aCA9IE1hdGgucm91bmQoYmFuZHdpZHRoKTtcbiAgICB2YXIgdmFsdWVzID0gc2VxdWVuY2UobikubWFwKGZ1bmN0aW9uKGkpIHsgcmV0dXJuIHN0YXJ0ICsgc3RlcCAqIGk7IH0pO1xuICAgIHJldHVybiBvcmRpbmFsUmFuZ2UocmV2ZXJzZSA/IHZhbHVlcy5yZXZlcnNlKCkgOiB2YWx1ZXMpO1xuICB9XG5cbiAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGRvbWFpbihfKSwgcmVzY2FsZSgpKSA6IGRvbWFpbigpO1xuICB9O1xuXG4gIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKFtyMCwgcjFdID0gXywgcjAgPSArcjAsIHIxID0gK3IxLCByZXNjYWxlKCkpIDogW3IwLCByMV07XG4gIH07XG5cbiAgc2NhbGUucmFuZ2VSb3VuZCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gW3IwLCByMV0gPSBfLCByMCA9ICtyMCwgcjEgPSArcjEsIHJvdW5kID0gdHJ1ZSwgcmVzY2FsZSgpO1xuICB9O1xuXG4gIHNjYWxlLmJhbmR3aWR0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBiYW5kd2lkdGg7XG4gIH07XG5cbiAgc2NhbGUuc3RlcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzdGVwO1xuICB9O1xuXG4gIHNjYWxlLnJvdW5kID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJvdW5kID0gISFfLCByZXNjYWxlKCkpIDogcm91bmQ7XG4gIH07XG5cbiAgc2NhbGUucGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChwYWRkaW5nSW5uZXIgPSBNYXRoLm1pbigxLCBwYWRkaW5nT3V0ZXIgPSArXyksIHJlc2NhbGUoKSkgOiBwYWRkaW5nSW5uZXI7XG4gIH07XG5cbiAgc2NhbGUucGFkZGluZ0lubmVyID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHBhZGRpbmdJbm5lciA9IE1hdGgubWluKDEsIF8pLCByZXNjYWxlKCkpIDogcGFkZGluZ0lubmVyO1xuICB9O1xuXG4gIHNjYWxlLnBhZGRpbmdPdXRlciA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChwYWRkaW5nT3V0ZXIgPSArXywgcmVzY2FsZSgpKSA6IHBhZGRpbmdPdXRlcjtcbiAgfTtcblxuICBzY2FsZS5hbGlnbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChhbGlnbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIF8pKSwgcmVzY2FsZSgpKSA6IGFsaWduO1xuICB9O1xuXG4gIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYmFuZChkb21haW4oKSwgW3IwLCByMV0pXG4gICAgICAgIC5yb3VuZChyb3VuZClcbiAgICAgICAgLnBhZGRpbmdJbm5lcihwYWRkaW5nSW5uZXIpXG4gICAgICAgIC5wYWRkaW5nT3V0ZXIocGFkZGluZ091dGVyKVxuICAgICAgICAuYWxpZ24oYWxpZ24pO1xuICB9O1xuXG4gIHJldHVybiBpbml0UmFuZ2UuYXBwbHkocmVzY2FsZSgpLCBhcmd1bWVudHMpO1xufVxuXG5mdW5jdGlvbiBwb2ludGlzaChzY2FsZSkge1xuICB2YXIgY29weSA9IHNjYWxlLmNvcHk7XG5cbiAgc2NhbGUucGFkZGluZyA9IHNjYWxlLnBhZGRpbmdPdXRlcjtcbiAgZGVsZXRlIHNjYWxlLnBhZGRpbmdJbm5lcjtcbiAgZGVsZXRlIHNjYWxlLnBhZGRpbmdPdXRlcjtcblxuICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHBvaW50aXNoKGNvcHkoKSk7XG4gIH07XG5cbiAgcmV0dXJuIHNjYWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9pbnQoKSB7XG4gIHJldHVybiBwb2ludGlzaChiYW5kLmFwcGx5KG51bGwsIGFyZ3VtZW50cykucGFkZGluZ0lubmVyKDEpKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb25zdHJ1Y3RvciwgZmFjdG9yeSwgcHJvdG90eXBlKSB7XG4gIGNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGZhY3RvcnkucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICBwcm90b3R5cGUuY29uc3RydWN0b3IgPSBjb25zdHJ1Y3Rvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChwYXJlbnQsIGRlZmluaXRpb24pIHtcbiAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyZW50LnByb3RvdHlwZSk7XG4gIGZvciAodmFyIGtleSBpbiBkZWZpbml0aW9uKSBwcm90b3R5cGVba2V5XSA9IGRlZmluaXRpb25ba2V5XTtcbiAgcmV0dXJuIHByb3RvdHlwZTtcbn1cbiIsICJpbXBvcnQgZGVmaW5lLCB7ZXh0ZW5kfSBmcm9tIFwiLi9kZWZpbmUuanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIENvbG9yKCkge31cblxuZXhwb3J0IHZhciBkYXJrZXIgPSAwLjc7XG5leHBvcnQgdmFyIGJyaWdodGVyID0gMSAvIGRhcmtlcjtcblxudmFyIHJlSSA9IFwiXFxcXHMqKFsrLV0/XFxcXGQrKVxcXFxzKlwiLFxuICAgIHJlTiA9IFwiXFxcXHMqKFsrLV0/KD86XFxcXGQqXFxcXC4pP1xcXFxkKyg/OltlRV1bKy1dP1xcXFxkKyk/KVxcXFxzKlwiLFxuICAgIHJlUCA9IFwiXFxcXHMqKFsrLV0/KD86XFxcXGQqXFxcXC4pP1xcXFxkKyg/OltlRV1bKy1dP1xcXFxkKyk/KSVcXFxccypcIixcbiAgICByZUhleCA9IC9eIyhbMC05YS1mXXszLDh9KSQvLFxuICAgIHJlUmdiSW50ZWdlciA9IG5ldyBSZWdFeHAoYF5yZ2JcXFxcKCR7cmVJfSwke3JlSX0sJHtyZUl9XFxcXCkkYCksXG4gICAgcmVSZ2JQZXJjZW50ID0gbmV3IFJlZ0V4cChgXnJnYlxcXFwoJHtyZVB9LCR7cmVQfSwke3JlUH1cXFxcKSRgKSxcbiAgICByZVJnYmFJbnRlZ2VyID0gbmV3IFJlZ0V4cChgXnJnYmFcXFxcKCR7cmVJfSwke3JlSX0sJHtyZUl9LCR7cmVOfVxcXFwpJGApLFxuICAgIHJlUmdiYVBlcmNlbnQgPSBuZXcgUmVnRXhwKGBecmdiYVxcXFwoJHtyZVB9LCR7cmVQfSwke3JlUH0sJHtyZU59XFxcXCkkYCksXG4gICAgcmVIc2xQZXJjZW50ID0gbmV3IFJlZ0V4cChgXmhzbFxcXFwoJHtyZU59LCR7cmVQfSwke3JlUH1cXFxcKSRgKSxcbiAgICByZUhzbGFQZXJjZW50ID0gbmV3IFJlZ0V4cChgXmhzbGFcXFxcKCR7cmVOfSwke3JlUH0sJHtyZVB9LCR7cmVOfVxcXFwpJGApO1xuXG52YXIgbmFtZWQgPSB7XG4gIGFsaWNlYmx1ZTogMHhmMGY4ZmYsXG4gIGFudGlxdWV3aGl0ZTogMHhmYWViZDcsXG4gIGFxdWE6IDB4MDBmZmZmLFxuICBhcXVhbWFyaW5lOiAweDdmZmZkNCxcbiAgYXp1cmU6IDB4ZjBmZmZmLFxuICBiZWlnZTogMHhmNWY1ZGMsXG4gIGJpc3F1ZTogMHhmZmU0YzQsXG4gIGJsYWNrOiAweDAwMDAwMCxcbiAgYmxhbmNoZWRhbG1vbmQ6IDB4ZmZlYmNkLFxuICBibHVlOiAweDAwMDBmZixcbiAgYmx1ZXZpb2xldDogMHg4YTJiZTIsXG4gIGJyb3duOiAweGE1MmEyYSxcbiAgYnVybHl3b29kOiAweGRlYjg4NyxcbiAgY2FkZXRibHVlOiAweDVmOWVhMCxcbiAgY2hhcnRyZXVzZTogMHg3ZmZmMDAsXG4gIGNob2NvbGF0ZTogMHhkMjY5MWUsXG4gIGNvcmFsOiAweGZmN2Y1MCxcbiAgY29ybmZsb3dlcmJsdWU6IDB4NjQ5NWVkLFxuICBjb3Juc2lsazogMHhmZmY4ZGMsXG4gIGNyaW1zb246IDB4ZGMxNDNjLFxuICBjeWFuOiAweDAwZmZmZixcbiAgZGFya2JsdWU6IDB4MDAwMDhiLFxuICBkYXJrY3lhbjogMHgwMDhiOGIsXG4gIGRhcmtnb2xkZW5yb2Q6IDB4Yjg4NjBiLFxuICBkYXJrZ3JheTogMHhhOWE5YTksXG4gIGRhcmtncmVlbjogMHgwMDY0MDAsXG4gIGRhcmtncmV5OiAweGE5YTlhOSxcbiAgZGFya2toYWtpOiAweGJkYjc2YixcbiAgZGFya21hZ2VudGE6IDB4OGIwMDhiLFxuICBkYXJrb2xpdmVncmVlbjogMHg1NTZiMmYsXG4gIGRhcmtvcmFuZ2U6IDB4ZmY4YzAwLFxuICBkYXJrb3JjaGlkOiAweDk5MzJjYyxcbiAgZGFya3JlZDogMHg4YjAwMDAsXG4gIGRhcmtzYWxtb246IDB4ZTk5NjdhLFxuICBkYXJrc2VhZ3JlZW46IDB4OGZiYzhmLFxuICBkYXJrc2xhdGVibHVlOiAweDQ4M2Q4YixcbiAgZGFya3NsYXRlZ3JheTogMHgyZjRmNGYsXG4gIGRhcmtzbGF0ZWdyZXk6IDB4MmY0ZjRmLFxuICBkYXJrdHVycXVvaXNlOiAweDAwY2VkMSxcbiAgZGFya3Zpb2xldDogMHg5NDAwZDMsXG4gIGRlZXBwaW5rOiAweGZmMTQ5MyxcbiAgZGVlcHNreWJsdWU6IDB4MDBiZmZmLFxuICBkaW1ncmF5OiAweDY5Njk2OSxcbiAgZGltZ3JleTogMHg2OTY5NjksXG4gIGRvZGdlcmJsdWU6IDB4MWU5MGZmLFxuICBmaXJlYnJpY2s6IDB4YjIyMjIyLFxuICBmbG9yYWx3aGl0ZTogMHhmZmZhZjAsXG4gIGZvcmVzdGdyZWVuOiAweDIyOGIyMixcbiAgZnVjaHNpYTogMHhmZjAwZmYsXG4gIGdhaW5zYm9ybzogMHhkY2RjZGMsXG4gIGdob3N0d2hpdGU6IDB4ZjhmOGZmLFxuICBnb2xkOiAweGZmZDcwMCxcbiAgZ29sZGVucm9kOiAweGRhYTUyMCxcbiAgZ3JheTogMHg4MDgwODAsXG4gIGdyZWVuOiAweDAwODAwMCxcbiAgZ3JlZW55ZWxsb3c6IDB4YWRmZjJmLFxuICBncmV5OiAweDgwODA4MCxcbiAgaG9uZXlkZXc6IDB4ZjBmZmYwLFxuICBob3RwaW5rOiAweGZmNjliNCxcbiAgaW5kaWFucmVkOiAweGNkNWM1YyxcbiAgaW5kaWdvOiAweDRiMDA4MixcbiAgaXZvcnk6IDB4ZmZmZmYwLFxuICBraGFraTogMHhmMGU2OGMsXG4gIGxhdmVuZGVyOiAweGU2ZTZmYSxcbiAgbGF2ZW5kZXJibHVzaDogMHhmZmYwZjUsXG4gIGxhd25ncmVlbjogMHg3Y2ZjMDAsXG4gIGxlbW9uY2hpZmZvbjogMHhmZmZhY2QsXG4gIGxpZ2h0Ymx1ZTogMHhhZGQ4ZTYsXG4gIGxpZ2h0Y29yYWw6IDB4ZjA4MDgwLFxuICBsaWdodGN5YW46IDB4ZTBmZmZmLFxuICBsaWdodGdvbGRlbnJvZHllbGxvdzogMHhmYWZhZDIsXG4gIGxpZ2h0Z3JheTogMHhkM2QzZDMsXG4gIGxpZ2h0Z3JlZW46IDB4OTBlZTkwLFxuICBsaWdodGdyZXk6IDB4ZDNkM2QzLFxuICBsaWdodHBpbms6IDB4ZmZiNmMxLFxuICBsaWdodHNhbG1vbjogMHhmZmEwN2EsXG4gIGxpZ2h0c2VhZ3JlZW46IDB4MjBiMmFhLFxuICBsaWdodHNreWJsdWU6IDB4ODdjZWZhLFxuICBsaWdodHNsYXRlZ3JheTogMHg3Nzg4OTksXG4gIGxpZ2h0c2xhdGVncmV5OiAweDc3ODg5OSxcbiAgbGlnaHRzdGVlbGJsdWU6IDB4YjBjNGRlLFxuICBsaWdodHllbGxvdzogMHhmZmZmZTAsXG4gIGxpbWU6IDB4MDBmZjAwLFxuICBsaW1lZ3JlZW46IDB4MzJjZDMyLFxuICBsaW5lbjogMHhmYWYwZTYsXG4gIG1hZ2VudGE6IDB4ZmYwMGZmLFxuICBtYXJvb246IDB4ODAwMDAwLFxuICBtZWRpdW1hcXVhbWFyaW5lOiAweDY2Y2RhYSxcbiAgbWVkaXVtYmx1ZTogMHgwMDAwY2QsXG4gIG1lZGl1bW9yY2hpZDogMHhiYTU1ZDMsXG4gIG1lZGl1bXB1cnBsZTogMHg5MzcwZGIsXG4gIG1lZGl1bXNlYWdyZWVuOiAweDNjYjM3MSxcbiAgbWVkaXVtc2xhdGVibHVlOiAweDdiNjhlZSxcbiAgbWVkaXVtc3ByaW5nZ3JlZW46IDB4MDBmYTlhLFxuICBtZWRpdW10dXJxdW9pc2U6IDB4NDhkMWNjLFxuICBtZWRpdW12aW9sZXRyZWQ6IDB4YzcxNTg1LFxuICBtaWRuaWdodGJsdWU6IDB4MTkxOTcwLFxuICBtaW50Y3JlYW06IDB4ZjVmZmZhLFxuICBtaXN0eXJvc2U6IDB4ZmZlNGUxLFxuICBtb2NjYXNpbjogMHhmZmU0YjUsXG4gIG5hdmFqb3doaXRlOiAweGZmZGVhZCxcbiAgbmF2eTogMHgwMDAwODAsXG4gIG9sZGxhY2U6IDB4ZmRmNWU2LFxuICBvbGl2ZTogMHg4MDgwMDAsXG4gIG9saXZlZHJhYjogMHg2YjhlMjMsXG4gIG9yYW5nZTogMHhmZmE1MDAsXG4gIG9yYW5nZXJlZDogMHhmZjQ1MDAsXG4gIG9yY2hpZDogMHhkYTcwZDYsXG4gIHBhbGVnb2xkZW5yb2Q6IDB4ZWVlOGFhLFxuICBwYWxlZ3JlZW46IDB4OThmYjk4LFxuICBwYWxldHVycXVvaXNlOiAweGFmZWVlZSxcbiAgcGFsZXZpb2xldHJlZDogMHhkYjcwOTMsXG4gIHBhcGF5YXdoaXA6IDB4ZmZlZmQ1LFxuICBwZWFjaHB1ZmY6IDB4ZmZkYWI5LFxuICBwZXJ1OiAweGNkODUzZixcbiAgcGluazogMHhmZmMwY2IsXG4gIHBsdW06IDB4ZGRhMGRkLFxuICBwb3dkZXJibHVlOiAweGIwZTBlNixcbiAgcHVycGxlOiAweDgwMDA4MCxcbiAgcmViZWNjYXB1cnBsZTogMHg2NjMzOTksXG4gIHJlZDogMHhmZjAwMDAsXG4gIHJvc3licm93bjogMHhiYzhmOGYsXG4gIHJveWFsYmx1ZTogMHg0MTY5ZTEsXG4gIHNhZGRsZWJyb3duOiAweDhiNDUxMyxcbiAgc2FsbW9uOiAweGZhODA3MixcbiAgc2FuZHlicm93bjogMHhmNGE0NjAsXG4gIHNlYWdyZWVuOiAweDJlOGI1NyxcbiAgc2Vhc2hlbGw6IDB4ZmZmNWVlLFxuICBzaWVubmE6IDB4YTA1MjJkLFxuICBzaWx2ZXI6IDB4YzBjMGMwLFxuICBza3libHVlOiAweDg3Y2VlYixcbiAgc2xhdGVibHVlOiAweDZhNWFjZCxcbiAgc2xhdGVncmF5OiAweDcwODA5MCxcbiAgc2xhdGVncmV5OiAweDcwODA5MCxcbiAgc25vdzogMHhmZmZhZmEsXG4gIHNwcmluZ2dyZWVuOiAweDAwZmY3ZixcbiAgc3RlZWxibHVlOiAweDQ2ODJiNCxcbiAgdGFuOiAweGQyYjQ4YyxcbiAgdGVhbDogMHgwMDgwODAsXG4gIHRoaXN0bGU6IDB4ZDhiZmQ4LFxuICB0b21hdG86IDB4ZmY2MzQ3LFxuICB0dXJxdW9pc2U6IDB4NDBlMGQwLFxuICB2aW9sZXQ6IDB4ZWU4MmVlLFxuICB3aGVhdDogMHhmNWRlYjMsXG4gIHdoaXRlOiAweGZmZmZmZixcbiAgd2hpdGVzbW9rZTogMHhmNWY1ZjUsXG4gIHllbGxvdzogMHhmZmZmMDAsXG4gIHllbGxvd2dyZWVuOiAweDlhY2QzMlxufTtcblxuZGVmaW5lKENvbG9yLCBjb2xvciwge1xuICBjb3B5KGNoYW5uZWxzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IHRoaXMuY29uc3RydWN0b3IsIHRoaXMsIGNoYW5uZWxzKTtcbiAgfSxcbiAgZGlzcGxheWFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucmdiKCkuZGlzcGxheWFibGUoKTtcbiAgfSxcbiAgaGV4OiBjb2xvcl9mb3JtYXRIZXgsIC8vIERlcHJlY2F0ZWQhIFVzZSBjb2xvci5mb3JtYXRIZXguXG4gIGZvcm1hdEhleDogY29sb3JfZm9ybWF0SGV4LFxuICBmb3JtYXRIZXg4OiBjb2xvcl9mb3JtYXRIZXg4LFxuICBmb3JtYXRIc2w6IGNvbG9yX2Zvcm1hdEhzbCxcbiAgZm9ybWF0UmdiOiBjb2xvcl9mb3JtYXRSZ2IsXG4gIHRvU3RyaW5nOiBjb2xvcl9mb3JtYXRSZ2Jcbn0pO1xuXG5mdW5jdGlvbiBjb2xvcl9mb3JtYXRIZXgoKSB7XG4gIHJldHVybiB0aGlzLnJnYigpLmZvcm1hdEhleCgpO1xufVxuXG5mdW5jdGlvbiBjb2xvcl9mb3JtYXRIZXg4KCkge1xuICByZXR1cm4gdGhpcy5yZ2IoKS5mb3JtYXRIZXg4KCk7XG59XG5cbmZ1bmN0aW9uIGNvbG9yX2Zvcm1hdEhzbCgpIHtcbiAgcmV0dXJuIGhzbENvbnZlcnQodGhpcykuZm9ybWF0SHNsKCk7XG59XG5cbmZ1bmN0aW9uIGNvbG9yX2Zvcm1hdFJnYigpIHtcbiAgcmV0dXJuIHRoaXMucmdiKCkuZm9ybWF0UmdiKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbG9yKGZvcm1hdCkge1xuICB2YXIgbSwgbDtcbiAgZm9ybWF0ID0gKGZvcm1hdCArIFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gKG0gPSByZUhleC5leGVjKGZvcm1hdCkpID8gKGwgPSBtWzFdLmxlbmd0aCwgbSA9IHBhcnNlSW50KG1bMV0sIDE2KSwgbCA9PT0gNiA/IHJnYm4obSkgLy8gI2ZmMDAwMFxuICAgICAgOiBsID09PSAzID8gbmV3IFJnYigobSA+PiA4ICYgMHhmKSB8IChtID4+IDQgJiAweGYwKSwgKG0gPj4gNCAmIDB4ZikgfCAobSAmIDB4ZjApLCAoKG0gJiAweGYpIDw8IDQpIHwgKG0gJiAweGYpLCAxKSAvLyAjZjAwXG4gICAgICA6IGwgPT09IDggPyByZ2JhKG0gPj4gMjQgJiAweGZmLCBtID4+IDE2ICYgMHhmZiwgbSA+PiA4ICYgMHhmZiwgKG0gJiAweGZmKSAvIDB4ZmYpIC8vICNmZjAwMDAwMFxuICAgICAgOiBsID09PSA0ID8gcmdiYSgobSA+PiAxMiAmIDB4ZikgfCAobSA+PiA4ICYgMHhmMCksIChtID4+IDggJiAweGYpIHwgKG0gPj4gNCAmIDB4ZjApLCAobSA+PiA0ICYgMHhmKSB8IChtICYgMHhmMCksICgoKG0gJiAweGYpIDw8IDQpIHwgKG0gJiAweGYpKSAvIDB4ZmYpIC8vICNmMDAwXG4gICAgICA6IG51bGwpIC8vIGludmFsaWQgaGV4XG4gICAgICA6IChtID0gcmVSZ2JJbnRlZ2VyLmV4ZWMoZm9ybWF0KSkgPyBuZXcgUmdiKG1bMV0sIG1bMl0sIG1bM10sIDEpIC8vIHJnYigyNTUsIDAsIDApXG4gICAgICA6IChtID0gcmVSZ2JQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyBuZXcgUmdiKG1bMV0gKiAyNTUgLyAxMDAsIG1bMl0gKiAyNTUgLyAxMDAsIG1bM10gKiAyNTUgLyAxMDAsIDEpIC8vIHJnYigxMDAlLCAwJSwgMCUpXG4gICAgICA6IChtID0gcmVSZ2JhSW50ZWdlci5leGVjKGZvcm1hdCkpID8gcmdiYShtWzFdLCBtWzJdLCBtWzNdLCBtWzRdKSAvLyByZ2JhKDI1NSwgMCwgMCwgMSlcbiAgICAgIDogKG0gPSByZVJnYmFQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyByZ2JhKG1bMV0gKiAyNTUgLyAxMDAsIG1bMl0gKiAyNTUgLyAxMDAsIG1bM10gKiAyNTUgLyAxMDAsIG1bNF0pIC8vIHJnYigxMDAlLCAwJSwgMCUsIDEpXG4gICAgICA6IChtID0gcmVIc2xQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyBoc2xhKG1bMV0sIG1bMl0gLyAxMDAsIG1bM10gLyAxMDAsIDEpIC8vIGhzbCgxMjAsIDUwJSwgNTAlKVxuICAgICAgOiAobSA9IHJlSHNsYVBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IGhzbGEobVsxXSwgbVsyXSAvIDEwMCwgbVszXSAvIDEwMCwgbVs0XSkgLy8gaHNsYSgxMjAsIDUwJSwgNTAlLCAxKVxuICAgICAgOiBuYW1lZC5oYXNPd25Qcm9wZXJ0eShmb3JtYXQpID8gcmdibihuYW1lZFtmb3JtYXRdKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICAgICAgOiBmb3JtYXQgPT09IFwidHJhbnNwYXJlbnRcIiA/IG5ldyBSZ2IoTmFOLCBOYU4sIE5hTiwgMClcbiAgICAgIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gcmdibihuKSB7XG4gIHJldHVybiBuZXcgUmdiKG4gPj4gMTYgJiAweGZmLCBuID4+IDggJiAweGZmLCBuICYgMHhmZiwgMSk7XG59XG5cbmZ1bmN0aW9uIHJnYmEociwgZywgYiwgYSkge1xuICBpZiAoYSA8PSAwKSByID0gZyA9IGIgPSBOYU47XG4gIHJldHVybiBuZXcgUmdiKHIsIGcsIGIsIGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmdiQ29udmVydChvKSB7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBDb2xvcikpIG8gPSBjb2xvcihvKTtcbiAgaWYgKCFvKSByZXR1cm4gbmV3IFJnYjtcbiAgbyA9IG8ucmdiKCk7XG4gIHJldHVybiBuZXcgUmdiKG8uciwgby5nLCBvLmIsIG8ub3BhY2l0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZ2IociwgZywgYiwgb3BhY2l0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IHJnYkNvbnZlcnQocikgOiBuZXcgUmdiKHIsIGcsIGIsIG9wYWNpdHkgPT0gbnVsbCA/IDEgOiBvcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJnYihyLCBnLCBiLCBvcGFjaXR5KSB7XG4gIHRoaXMuciA9ICtyO1xuICB0aGlzLmcgPSArZztcbiAgdGhpcy5iID0gK2I7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoUmdiLCByZ2IsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIGRhcmtlcihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBSZ2IodGhpcy5yICogaywgdGhpcy5nICogaywgdGhpcy5iICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgcmdiKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBjbGFtcCgpIHtcbiAgICByZXR1cm4gbmV3IFJnYihjbGFtcGkodGhpcy5yKSwgY2xhbXBpKHRoaXMuZyksIGNsYW1waSh0aGlzLmIpLCBjbGFtcGEodGhpcy5vcGFjaXR5KSk7XG4gIH0sXG4gIGRpc3BsYXlhYmxlKCkge1xuICAgIHJldHVybiAoLTAuNSA8PSB0aGlzLnIgJiYgdGhpcy5yIDwgMjU1LjUpXG4gICAgICAgICYmICgtMC41IDw9IHRoaXMuZyAmJiB0aGlzLmcgPCAyNTUuNSlcbiAgICAgICAgJiYgKC0wLjUgPD0gdGhpcy5iICYmIHRoaXMuYiA8IDI1NS41KVxuICAgICAgICAmJiAoMCA8PSB0aGlzLm9wYWNpdHkgJiYgdGhpcy5vcGFjaXR5IDw9IDEpO1xuICB9LFxuICBoZXg6IHJnYl9mb3JtYXRIZXgsIC8vIERlcHJlY2F0ZWQhIFVzZSBjb2xvci5mb3JtYXRIZXguXG4gIGZvcm1hdEhleDogcmdiX2Zvcm1hdEhleCxcbiAgZm9ybWF0SGV4ODogcmdiX2Zvcm1hdEhleDgsXG4gIGZvcm1hdFJnYjogcmdiX2Zvcm1hdFJnYixcbiAgdG9TdHJpbmc6IHJnYl9mb3JtYXRSZ2Jcbn0pKTtcblxuZnVuY3Rpb24gcmdiX2Zvcm1hdEhleCgpIHtcbiAgcmV0dXJuIGAjJHtoZXgodGhpcy5yKX0ke2hleCh0aGlzLmcpfSR7aGV4KHRoaXMuYil9YDtcbn1cblxuZnVuY3Rpb24gcmdiX2Zvcm1hdEhleDgoKSB7XG4gIHJldHVybiBgIyR7aGV4KHRoaXMucil9JHtoZXgodGhpcy5nKX0ke2hleCh0aGlzLmIpfSR7aGV4KChpc05hTih0aGlzLm9wYWNpdHkpID8gMSA6IHRoaXMub3BhY2l0eSkgKiAyNTUpfWA7XG59XG5cbmZ1bmN0aW9uIHJnYl9mb3JtYXRSZ2IoKSB7XG4gIGNvbnN0IGEgPSBjbGFtcGEodGhpcy5vcGFjaXR5KTtcbiAgcmV0dXJuIGAke2EgPT09IDEgPyBcInJnYihcIiA6IFwicmdiYShcIn0ke2NsYW1waSh0aGlzLnIpfSwgJHtjbGFtcGkodGhpcy5nKX0sICR7Y2xhbXBpKHRoaXMuYil9JHthID09PSAxID8gXCIpXCIgOiBgLCAke2F9KWB9YDtcbn1cblxuZnVuY3Rpb24gY2xhbXBhKG9wYWNpdHkpIHtcbiAgcmV0dXJuIGlzTmFOKG9wYWNpdHkpID8gMSA6IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIG9wYWNpdHkpKTtcbn1cblxuZnVuY3Rpb24gY2xhbXBpKHZhbHVlKSB7XG4gIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQodmFsdWUpIHx8IDApKTtcbn1cblxuZnVuY3Rpb24gaGV4KHZhbHVlKSB7XG4gIHZhbHVlID0gY2xhbXBpKHZhbHVlKTtcbiAgcmV0dXJuICh2YWx1ZSA8IDE2ID8gXCIwXCIgOiBcIlwiKSArIHZhbHVlLnRvU3RyaW5nKDE2KTtcbn1cblxuZnVuY3Rpb24gaHNsYShoLCBzLCBsLCBhKSB7XG4gIGlmIChhIDw9IDApIGggPSBzID0gbCA9IE5hTjtcbiAgZWxzZSBpZiAobCA8PSAwIHx8IGwgPj0gMSkgaCA9IHMgPSBOYU47XG4gIGVsc2UgaWYgKHMgPD0gMCkgaCA9IE5hTjtcbiAgcmV0dXJuIG5ldyBIc2woaCwgcywgbCwgYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoc2xDb252ZXJ0KG8pIHtcbiAgaWYgKG8gaW5zdGFuY2VvZiBIc2wpIHJldHVybiBuZXcgSHNsKG8uaCwgby5zLCBvLmwsIG8ub3BhY2l0eSk7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBDb2xvcikpIG8gPSBjb2xvcihvKTtcbiAgaWYgKCFvKSByZXR1cm4gbmV3IEhzbDtcbiAgaWYgKG8gaW5zdGFuY2VvZiBIc2wpIHJldHVybiBvO1xuICBvID0gby5yZ2IoKTtcbiAgdmFyIHIgPSBvLnIgLyAyNTUsXG4gICAgICBnID0gby5nIC8gMjU1LFxuICAgICAgYiA9IG8uYiAvIDI1NSxcbiAgICAgIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpLFxuICAgICAgbWF4ID0gTWF0aC5tYXgociwgZywgYiksXG4gICAgICBoID0gTmFOLFxuICAgICAgcyA9IG1heCAtIG1pbixcbiAgICAgIGwgPSAobWF4ICsgbWluKSAvIDI7XG4gIGlmIChzKSB7XG4gICAgaWYgKHIgPT09IG1heCkgaCA9IChnIC0gYikgLyBzICsgKGcgPCBiKSAqIDY7XG4gICAgZWxzZSBpZiAoZyA9PT0gbWF4KSBoID0gKGIgLSByKSAvIHMgKyAyO1xuICAgIGVsc2UgaCA9IChyIC0gZykgLyBzICsgNDtcbiAgICBzIC89IGwgPCAwLjUgPyBtYXggKyBtaW4gOiAyIC0gbWF4IC0gbWluO1xuICAgIGggKj0gNjA7XG4gIH0gZWxzZSB7XG4gICAgcyA9IGwgPiAwICYmIGwgPCAxID8gMCA6IGg7XG4gIH1cbiAgcmV0dXJuIG5ldyBIc2woaCwgcywgbCwgby5vcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhzbChoLCBzLCBsLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gaHNsQ29udmVydChoKSA6IG5ldyBIc2woaCwgcywgbCwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5mdW5jdGlvbiBIc2woaCwgcywgbCwgb3BhY2l0eSkge1xuICB0aGlzLmggPSAraDtcbiAgdGhpcy5zID0gK3M7XG4gIHRoaXMubCA9ICtsO1xuICB0aGlzLm9wYWNpdHkgPSArb3BhY2l0eTtcbn1cblxuZGVmaW5lKEhzbCwgaHNsLCBleHRlbmQoQ29sb3IsIHtcbiAgYnJpZ2h0ZXIoaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgcmdiKCkge1xuICAgIHZhciBoID0gdGhpcy5oICUgMzYwICsgKHRoaXMuaCA8IDApICogMzYwLFxuICAgICAgICBzID0gaXNOYU4oaCkgfHwgaXNOYU4odGhpcy5zKSA/IDAgOiB0aGlzLnMsXG4gICAgICAgIGwgPSB0aGlzLmwsXG4gICAgICAgIG0yID0gbCArIChsIDwgMC41ID8gbCA6IDEgLSBsKSAqIHMsXG4gICAgICAgIG0xID0gMiAqIGwgLSBtMjtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIGhzbDJyZ2IoaCA+PSAyNDAgPyBoIC0gMjQwIDogaCArIDEyMCwgbTEsIG0yKSxcbiAgICAgIGhzbDJyZ2IoaCwgbTEsIG0yKSxcbiAgICAgIGhzbDJyZ2IoaCA8IDEyMCA/IGggKyAyNDAgOiBoIC0gMTIwLCBtMSwgbTIpLFxuICAgICAgdGhpcy5vcGFjaXR5XG4gICAgKTtcbiAgfSxcbiAgY2xhbXAoKSB7XG4gICAgcmV0dXJuIG5ldyBIc2woY2xhbXBoKHRoaXMuaCksIGNsYW1wdCh0aGlzLnMpLCBjbGFtcHQodGhpcy5sKSwgY2xhbXBhKHRoaXMub3BhY2l0eSkpO1xuICB9LFxuICBkaXNwbGF5YWJsZSgpIHtcbiAgICByZXR1cm4gKDAgPD0gdGhpcy5zICYmIHRoaXMucyA8PSAxIHx8IGlzTmFOKHRoaXMucykpXG4gICAgICAgICYmICgwIDw9IHRoaXMubCAmJiB0aGlzLmwgPD0gMSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5vcGFjaXR5ICYmIHRoaXMub3BhY2l0eSA8PSAxKTtcbiAgfSxcbiAgZm9ybWF0SHNsKCkge1xuICAgIGNvbnN0IGEgPSBjbGFtcGEodGhpcy5vcGFjaXR5KTtcbiAgICByZXR1cm4gYCR7YSA9PT0gMSA/IFwiaHNsKFwiIDogXCJoc2xhKFwifSR7Y2xhbXBoKHRoaXMuaCl9LCAke2NsYW1wdCh0aGlzLnMpICogMTAwfSUsICR7Y2xhbXB0KHRoaXMubCkgKiAxMDB9JSR7YSA9PT0gMSA/IFwiKVwiIDogYCwgJHthfSlgfWA7XG4gIH1cbn0pKTtcblxuZnVuY3Rpb24gY2xhbXBoKHZhbHVlKSB7XG4gIHZhbHVlID0gKHZhbHVlIHx8IDApICUgMzYwO1xuICByZXR1cm4gdmFsdWUgPCAwID8gdmFsdWUgKyAzNjAgOiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gY2xhbXB0KHZhbHVlKSB7XG4gIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCB2YWx1ZSB8fCAwKSk7XG59XG5cbi8qIEZyb20gRnZEIDEzLjM3LCBDU1MgQ29sb3IgTW9kdWxlIExldmVsIDMgKi9cbmZ1bmN0aW9uIGhzbDJyZ2IoaCwgbTEsIG0yKSB7XG4gIHJldHVybiAoaCA8IDYwID8gbTEgKyAobTIgLSBtMSkgKiBoIC8gNjBcbiAgICAgIDogaCA8IDE4MCA/IG0yXG4gICAgICA6IGggPCAyNDAgPyBtMSArIChtMiAtIG0xKSAqICgyNDAgLSBoKSAvIDYwXG4gICAgICA6IG0xKSAqIDI1NTtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gYmFzaXModDEsIHYwLCB2MSwgdjIsIHYzKSB7XG4gIHZhciB0MiA9IHQxICogdDEsIHQzID0gdDIgKiB0MTtcbiAgcmV0dXJuICgoMSAtIDMgKiB0MSArIDMgKiB0MiAtIHQzKSAqIHYwXG4gICAgICArICg0IC0gNiAqIHQyICsgMyAqIHQzKSAqIHYxXG4gICAgICArICgxICsgMyAqIHQxICsgMyAqIHQyIC0gMyAqIHQzKSAqIHYyXG4gICAgICArIHQzICogdjMpIC8gNjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWVzKSB7XG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aCAtIDE7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgdmFyIGkgPSB0IDw9IDAgPyAodCA9IDApIDogdCA+PSAxID8gKHQgPSAxLCBuIC0gMSkgOiBNYXRoLmZsb29yKHQgKiBuKSxcbiAgICAgICAgdjEgPSB2YWx1ZXNbaV0sXG4gICAgICAgIHYyID0gdmFsdWVzW2kgKyAxXSxcbiAgICAgICAgdjAgPSBpID4gMCA/IHZhbHVlc1tpIC0gMV0gOiAyICogdjEgLSB2MixcbiAgICAgICAgdjMgPSBpIDwgbiAtIDEgPyB2YWx1ZXNbaSArIDJdIDogMiAqIHYyIC0gdjE7XG4gICAgcmV0dXJuIGJhc2lzKCh0IC0gaSAvIG4pICogbiwgdjAsIHYxLCB2MiwgdjMpO1xuICB9O1xufVxuIiwgImltcG9ydCB7YmFzaXN9IGZyb20gXCIuL2Jhc2lzLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlcykge1xuICB2YXIgbiA9IHZhbHVlcy5sZW5ndGg7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgdmFyIGkgPSBNYXRoLmZsb29yKCgodCAlPSAxKSA8IDAgPyArK3QgOiB0KSAqIG4pLFxuICAgICAgICB2MCA9IHZhbHVlc1soaSArIG4gLSAxKSAlIG5dLFxuICAgICAgICB2MSA9IHZhbHVlc1tpICUgbl0sXG4gICAgICAgIHYyID0gdmFsdWVzWyhpICsgMSkgJSBuXSxcbiAgICAgICAgdjMgPSB2YWx1ZXNbKGkgKyAyKSAlIG5dO1xuICAgIHJldHVybiBiYXNpcygodCAtIGkgLyBuKSAqIG4sIHYwLCB2MSwgdjIsIHYzKTtcbiAgfTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCB4ID0+ICgpID0+IHg7XG4iLCAiaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5cbmZ1bmN0aW9uIGxpbmVhcihhLCBkKSB7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIGEgKyB0ICogZDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZXhwb25lbnRpYWwoYSwgYiwgeSkge1xuICByZXR1cm4gYSA9IE1hdGgucG93KGEsIHkpLCBiID0gTWF0aC5wb3coYiwgeSkgLSBhLCB5ID0gMSAvIHksIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gTWF0aC5wb3coYSArIHQgKiBiLCB5KTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGh1ZShhLCBiKSB7XG4gIHZhciBkID0gYiAtIGE7XG4gIHJldHVybiBkID8gbGluZWFyKGEsIGQgPiAxODAgfHwgZCA8IC0xODAgPyBkIC0gMzYwICogTWF0aC5yb3VuZChkIC8gMzYwKSA6IGQpIDogY29uc3RhbnQoaXNOYU4oYSkgPyBiIDogYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnYW1tYSh5KSB7XG4gIHJldHVybiAoeSA9ICt5KSA9PT0gMSA/IG5vZ2FtbWEgOiBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGIgLSBhID8gZXhwb25lbnRpYWwoYSwgYiwgeSkgOiBjb25zdGFudChpc05hTihhKSA/IGIgOiBhKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbm9nYW1tYShhLCBiKSB7XG4gIHZhciBkID0gYiAtIGE7XG4gIHJldHVybiBkID8gbGluZWFyKGEsIGQpIDogY29uc3RhbnQoaXNOYU4oYSkgPyBiIDogYSk7XG59XG4iLCAiaW1wb3J0IHtyZ2IgYXMgY29sb3JSZ2J9IGZyb20gXCJkMy1jb2xvclwiO1xuaW1wb3J0IGJhc2lzIGZyb20gXCIuL2Jhc2lzLmpzXCI7XG5pbXBvcnQgYmFzaXNDbG9zZWQgZnJvbSBcIi4vYmFzaXNDbG9zZWQuanNcIjtcbmltcG9ydCBub2dhbW1hLCB7Z2FtbWF9IGZyb20gXCIuL2NvbG9yLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiByZ2JHYW1tYSh5KSB7XG4gIHZhciBjb2xvciA9IGdhbW1hKHkpO1xuXG4gIGZ1bmN0aW9uIHJnYihzdGFydCwgZW5kKSB7XG4gICAgdmFyIHIgPSBjb2xvcigoc3RhcnQgPSBjb2xvclJnYihzdGFydCkpLnIsIChlbmQgPSBjb2xvclJnYihlbmQpKS5yKSxcbiAgICAgICAgZyA9IGNvbG9yKHN0YXJ0LmcsIGVuZC5nKSxcbiAgICAgICAgYiA9IGNvbG9yKHN0YXJ0LmIsIGVuZC5iKSxcbiAgICAgICAgb3BhY2l0eSA9IG5vZ2FtbWEoc3RhcnQub3BhY2l0eSwgZW5kLm9wYWNpdHkpO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBzdGFydC5yID0gcih0KTtcbiAgICAgIHN0YXJ0LmcgPSBnKHQpO1xuICAgICAgc3RhcnQuYiA9IGIodCk7XG4gICAgICBzdGFydC5vcGFjaXR5ID0gb3BhY2l0eSh0KTtcbiAgICAgIHJldHVybiBzdGFydCArIFwiXCI7XG4gICAgfTtcbiAgfVxuXG4gIHJnYi5nYW1tYSA9IHJnYkdhbW1hO1xuXG4gIHJldHVybiByZ2I7XG59KSgxKTtcblxuZnVuY3Rpb24gcmdiU3BsaW5lKHNwbGluZSkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sb3JzKSB7XG4gICAgdmFyIG4gPSBjb2xvcnMubGVuZ3RoLFxuICAgICAgICByID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBnID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBiID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBpLCBjb2xvcjtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBjb2xvciA9IGNvbG9yUmdiKGNvbG9yc1tpXSk7XG4gICAgICByW2ldID0gY29sb3IuciB8fCAwO1xuICAgICAgZ1tpXSA9IGNvbG9yLmcgfHwgMDtcbiAgICAgIGJbaV0gPSBjb2xvci5iIHx8IDA7XG4gICAgfVxuICAgIHIgPSBzcGxpbmUocik7XG4gICAgZyA9IHNwbGluZShnKTtcbiAgICBiID0gc3BsaW5lKGIpO1xuICAgIGNvbG9yLm9wYWNpdHkgPSAxO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBjb2xvci5yID0gcih0KTtcbiAgICAgIGNvbG9yLmcgPSBnKHQpO1xuICAgICAgY29sb3IuYiA9IGIodCk7XG4gICAgICByZXR1cm4gY29sb3IgKyBcIlwiO1xuICAgIH07XG4gIH07XG59XG5cbmV4cG9ydCB2YXIgcmdiQmFzaXMgPSByZ2JTcGxpbmUoYmFzaXMpO1xuZXhwb3J0IHZhciByZ2JCYXNpc0Nsb3NlZCA9IHJnYlNwbGluZShiYXNpc0Nsb3NlZCk7XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICBpZiAoIWIpIGIgPSBbXTtcbiAgdmFyIG4gPSBhID8gTWF0aC5taW4oYi5sZW5ndGgsIGEubGVuZ3RoKSA6IDAsXG4gICAgICBjID0gYi5zbGljZSgpLFxuICAgICAgaTtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSBjW2ldID0gYVtpXSAqICgxIC0gdCkgKyBiW2ldICogdDtcbiAgICByZXR1cm4gYztcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyQXJyYXkoeCkge1xuICByZXR1cm4gQXJyYXlCdWZmZXIuaXNWaWV3KHgpICYmICEoeCBpbnN0YW5jZW9mIERhdGFWaWV3KTtcbn1cbiIsICJpbXBvcnQgdmFsdWUgZnJvbSBcIi4vdmFsdWUuanNcIjtcbmltcG9ydCBudW1iZXJBcnJheSwge2lzTnVtYmVyQXJyYXl9IGZyb20gXCIuL251bWJlckFycmF5LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIChpc051bWJlckFycmF5KGIpID8gbnVtYmVyQXJyYXkgOiBnZW5lcmljQXJyYXkpKGEsIGIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJpY0FycmF5KGEsIGIpIHtcbiAgdmFyIG5iID0gYiA/IGIubGVuZ3RoIDogMCxcbiAgICAgIG5hID0gYSA/IE1hdGgubWluKG5iLCBhLmxlbmd0aCkgOiAwLFxuICAgICAgeCA9IG5ldyBBcnJheShuYSksXG4gICAgICBjID0gbmV3IEFycmF5KG5iKSxcbiAgICAgIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IG5hOyArK2kpIHhbaV0gPSB2YWx1ZShhW2ldLCBiW2ldKTtcbiAgZm9yICg7IGkgPCBuYjsgKytpKSBjW2ldID0gYltpXTtcblxuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBuYTsgKytpKSBjW2ldID0geFtpXSh0KTtcbiAgICByZXR1cm4gYztcbiAgfTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciBkID0gbmV3IERhdGU7XG4gIHJldHVybiBhID0gK2EsIGIgPSArYiwgZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBkLnNldFRpbWUoYSAqICgxIC0gdCkgKyBiICogdCksIGQ7XG4gIH07XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYSA9ICthLCBiID0gK2IsIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gYSAqICgxIC0gdCkgKyBiICogdDtcbiAgfTtcbn1cbiIsICJpbXBvcnQgdmFsdWUgZnJvbSBcIi4vdmFsdWUuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICB2YXIgaSA9IHt9LFxuICAgICAgYyA9IHt9LFxuICAgICAgaztcblxuICBpZiAoYSA9PT0gbnVsbCB8fCB0eXBlb2YgYSAhPT0gXCJvYmplY3RcIikgYSA9IHt9O1xuICBpZiAoYiA9PT0gbnVsbCB8fCB0eXBlb2YgYiAhPT0gXCJvYmplY3RcIikgYiA9IHt9O1xuXG4gIGZvciAoayBpbiBiKSB7XG4gICAgaWYgKGsgaW4gYSkge1xuICAgICAgaVtrXSA9IHZhbHVlKGFba10sIGJba10pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjW2tdID0gYltrXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIGZvciAoayBpbiBpKSBjW2tdID0gaVtrXSh0KTtcbiAgICByZXR1cm4gYztcbiAgfTtcbn1cbiIsICJpbXBvcnQgbnVtYmVyIGZyb20gXCIuL251bWJlci5qc1wiO1xuXG52YXIgcmVBID0gL1stK10/KD86XFxkK1xcLj9cXGQqfFxcLj9cXGQrKSg/OltlRV1bLStdP1xcZCspPy9nLFxuICAgIHJlQiA9IG5ldyBSZWdFeHAocmVBLnNvdXJjZSwgXCJnXCIpO1xuXG5mdW5jdGlvbiB6ZXJvKGIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBiO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvbmUoYikge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBiKHQpICsgXCJcIjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICB2YXIgYmkgPSByZUEubGFzdEluZGV4ID0gcmVCLmxhc3RJbmRleCA9IDAsIC8vIHNjYW4gaW5kZXggZm9yIG5leHQgbnVtYmVyIGluIGJcbiAgICAgIGFtLCAvLyBjdXJyZW50IG1hdGNoIGluIGFcbiAgICAgIGJtLCAvLyBjdXJyZW50IG1hdGNoIGluIGJcbiAgICAgIGJzLCAvLyBzdHJpbmcgcHJlY2VkaW5nIGN1cnJlbnQgbnVtYmVyIGluIGIsIGlmIGFueVxuICAgICAgaSA9IC0xLCAvLyBpbmRleCBpbiBzXG4gICAgICBzID0gW10sIC8vIHN0cmluZyBjb25zdGFudHMgYW5kIHBsYWNlaG9sZGVyc1xuICAgICAgcSA9IFtdOyAvLyBudW1iZXIgaW50ZXJwb2xhdG9yc1xuXG4gIC8vIENvZXJjZSBpbnB1dHMgdG8gc3RyaW5ncy5cbiAgYSA9IGEgKyBcIlwiLCBiID0gYiArIFwiXCI7XG5cbiAgLy8gSW50ZXJwb2xhdGUgcGFpcnMgb2YgbnVtYmVycyBpbiBhICYgYi5cbiAgd2hpbGUgKChhbSA9IHJlQS5leGVjKGEpKVxuICAgICAgJiYgKGJtID0gcmVCLmV4ZWMoYikpKSB7XG4gICAgaWYgKChicyA9IGJtLmluZGV4KSA+IGJpKSB7IC8vIGEgc3RyaW5nIHByZWNlZGVzIHRoZSBuZXh0IG51bWJlciBpbiBiXG4gICAgICBicyA9IGIuc2xpY2UoYmksIGJzKTtcbiAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJzOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgICAgZWxzZSBzWysraV0gPSBicztcbiAgICB9XG4gICAgaWYgKChhbSA9IGFtWzBdKSA9PT0gKGJtID0gYm1bMF0pKSB7IC8vIG51bWJlcnMgaW4gYSAmIGIgbWF0Y2hcbiAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJtOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgICAgZWxzZSBzWysraV0gPSBibTtcbiAgICB9IGVsc2UgeyAvLyBpbnRlcnBvbGF0ZSBub24tbWF0Y2hpbmcgbnVtYmVyc1xuICAgICAgc1srK2ldID0gbnVsbDtcbiAgICAgIHEucHVzaCh7aTogaSwgeDogbnVtYmVyKGFtLCBibSl9KTtcbiAgICB9XG4gICAgYmkgPSByZUIubGFzdEluZGV4O1xuICB9XG5cbiAgLy8gQWRkIHJlbWFpbnMgb2YgYi5cbiAgaWYgKGJpIDwgYi5sZW5ndGgpIHtcbiAgICBicyA9IGIuc2xpY2UoYmkpO1xuICAgIGlmIChzW2ldKSBzW2ldICs9IGJzOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgIGVsc2Ugc1srK2ldID0gYnM7XG4gIH1cblxuICAvLyBTcGVjaWFsIG9wdGltaXphdGlvbiBmb3Igb25seSBhIHNpbmdsZSBtYXRjaC5cbiAgLy8gT3RoZXJ3aXNlLCBpbnRlcnBvbGF0ZSBlYWNoIG9mIHRoZSBudW1iZXJzIGFuZCByZWpvaW4gdGhlIHN0cmluZy5cbiAgcmV0dXJuIHMubGVuZ3RoIDwgMiA/IChxWzBdXG4gICAgICA/IG9uZShxWzBdLngpXG4gICAgICA6IHplcm8oYikpXG4gICAgICA6IChiID0gcS5sZW5ndGgsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbzsgaSA8IGI7ICsraSkgc1sobyA9IHFbaV0pLmldID0gby54KHQpO1xuICAgICAgICAgIHJldHVybiBzLmpvaW4oXCJcIik7XG4gICAgICAgIH0pO1xufVxuIiwgImltcG9ydCB7Y29sb3J9IGZyb20gXCJkMy1jb2xvclwiO1xuaW1wb3J0IHJnYiBmcm9tIFwiLi9yZ2IuanNcIjtcbmltcG9ydCB7Z2VuZXJpY0FycmF5fSBmcm9tIFwiLi9hcnJheS5qc1wiO1xuaW1wb3J0IGRhdGUgZnJvbSBcIi4vZGF0ZS5qc1wiO1xuaW1wb3J0IG51bWJlciBmcm9tIFwiLi9udW1iZXIuanNcIjtcbmltcG9ydCBvYmplY3QgZnJvbSBcIi4vb2JqZWN0LmpzXCI7XG5pbXBvcnQgc3RyaW5nIGZyb20gXCIuL3N0cmluZy5qc1wiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5pbXBvcnQgbnVtYmVyQXJyYXksIHtpc051bWJlckFycmF5fSBmcm9tIFwiLi9udW1iZXJBcnJheS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciB0ID0gdHlwZW9mIGIsIGM7XG4gIHJldHVybiBiID09IG51bGwgfHwgdCA9PT0gXCJib29sZWFuXCIgPyBjb25zdGFudChiKVxuICAgICAgOiAodCA9PT0gXCJudW1iZXJcIiA/IG51bWJlclxuICAgICAgOiB0ID09PSBcInN0cmluZ1wiID8gKChjID0gY29sb3IoYikpID8gKGIgPSBjLCByZ2IpIDogc3RyaW5nKVxuICAgICAgOiBiIGluc3RhbmNlb2YgY29sb3IgPyByZ2JcbiAgICAgIDogYiBpbnN0YW5jZW9mIERhdGUgPyBkYXRlXG4gICAgICA6IGlzTnVtYmVyQXJyYXkoYikgPyBudW1iZXJBcnJheVxuICAgICAgOiBBcnJheS5pc0FycmF5KGIpID8gZ2VuZXJpY0FycmF5XG4gICAgICA6IHR5cGVvZiBiLnZhbHVlT2YgIT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgYi50b1N0cmluZyAhPT0gXCJmdW5jdGlvblwiIHx8IGlzTmFOKGIpID8gb2JqZWN0XG4gICAgICA6IG51bWJlcikoYSwgYik7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYSA9ICthLCBiID0gK2IsIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChhICogKDEgLSB0KSArIGIgKiB0KTtcbiAgfTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb25zdGFudHMoeCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHg7XG4gIH07XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbnVtYmVyKHgpIHtcbiAgcmV0dXJuICt4O1xufVxuIiwgImltcG9ydCB7YmlzZWN0fSBmcm9tIFwiZDMtYXJyYXlcIjtcbmltcG9ydCB7aW50ZXJwb2xhdGUgYXMgaW50ZXJwb2xhdGVWYWx1ZSwgaW50ZXJwb2xhdGVOdW1iZXIsIGludGVycG9sYXRlUm91bmR9IGZyb20gXCJkMy1pbnRlcnBvbGF0ZVwiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5pbXBvcnQgbnVtYmVyIGZyb20gXCIuL251bWJlci5qc1wiO1xuXG52YXIgdW5pdCA9IFswLCAxXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlkZW50aXR5KHgpIHtcbiAgcmV0dXJuIHg7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZShhLCBiKSB7XG4gIHJldHVybiAoYiAtPSAoYSA9ICthKSlcbiAgICAgID8gZnVuY3Rpb24oeCkgeyByZXR1cm4gKHggLSBhKSAvIGI7IH1cbiAgICAgIDogY29uc3RhbnQoaXNOYU4oYikgPyBOYU4gOiAwLjUpO1xufVxuXG5mdW5jdGlvbiBjbGFtcGVyKGEsIGIpIHtcbiAgdmFyIHQ7XG4gIGlmIChhID4gYikgdCA9IGEsIGEgPSBiLCBiID0gdDtcbiAgcmV0dXJuIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgubWF4KGEsIE1hdGgubWluKGIsIHgpKTsgfTtcbn1cblxuLy8gbm9ybWFsaXplKGEsIGIpKHgpIHRha2VzIGEgZG9tYWluIHZhbHVlIHggaW4gW2EsYl0gYW5kIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgcGFyYW1ldGVyIHQgaW4gWzAsMV0uXG4vLyBpbnRlcnBvbGF0ZShhLCBiKSh0KSB0YWtlcyBhIHBhcmFtZXRlciB0IGluIFswLDFdIGFuZCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIHJhbmdlIHZhbHVlIHggaW4gW2EsYl0uXG5mdW5jdGlvbiBiaW1hcChkb21haW4sIHJhbmdlLCBpbnRlcnBvbGF0ZSkge1xuICB2YXIgZDAgPSBkb21haW5bMF0sIGQxID0gZG9tYWluWzFdLCByMCA9IHJhbmdlWzBdLCByMSA9IHJhbmdlWzFdO1xuICBpZiAoZDEgPCBkMCkgZDAgPSBub3JtYWxpemUoZDEsIGQwKSwgcjAgPSBpbnRlcnBvbGF0ZShyMSwgcjApO1xuICBlbHNlIGQwID0gbm9ybWFsaXplKGQwLCBkMSksIHIwID0gaW50ZXJwb2xhdGUocjAsIHIxKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHIwKGQwKHgpKTsgfTtcbn1cblxuZnVuY3Rpb24gcG9seW1hcChkb21haW4sIHJhbmdlLCBpbnRlcnBvbGF0ZSkge1xuICB2YXIgaiA9IE1hdGgubWluKGRvbWFpbi5sZW5ndGgsIHJhbmdlLmxlbmd0aCkgLSAxLFxuICAgICAgZCA9IG5ldyBBcnJheShqKSxcbiAgICAgIHIgPSBuZXcgQXJyYXkoaiksXG4gICAgICBpID0gLTE7XG5cbiAgLy8gUmV2ZXJzZSBkZXNjZW5kaW5nIGRvbWFpbnMuXG4gIGlmIChkb21haW5bal0gPCBkb21haW5bMF0pIHtcbiAgICBkb21haW4gPSBkb21haW4uc2xpY2UoKS5yZXZlcnNlKCk7XG4gICAgcmFuZ2UgPSByYW5nZS5zbGljZSgpLnJldmVyc2UoKTtcbiAgfVxuXG4gIHdoaWxlICgrK2kgPCBqKSB7XG4gICAgZFtpXSA9IG5vcm1hbGl6ZShkb21haW5baV0sIGRvbWFpbltpICsgMV0pO1xuICAgIHJbaV0gPSBpbnRlcnBvbGF0ZShyYW5nZVtpXSwgcmFuZ2VbaSArIDFdKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgdmFyIGkgPSBiaXNlY3QoZG9tYWluLCB4LCAxLCBqKSAtIDE7XG4gICAgcmV0dXJuIHJbaV0oZFtpXSh4KSk7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5KHNvdXJjZSwgdGFyZ2V0KSB7XG4gIHJldHVybiB0YXJnZXRcbiAgICAgIC5kb21haW4oc291cmNlLmRvbWFpbigpKVxuICAgICAgLnJhbmdlKHNvdXJjZS5yYW5nZSgpKVxuICAgICAgLmludGVycG9sYXRlKHNvdXJjZS5pbnRlcnBvbGF0ZSgpKVxuICAgICAgLmNsYW1wKHNvdXJjZS5jbGFtcCgpKVxuICAgICAgLnVua25vd24oc291cmNlLnVua25vd24oKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm1lcigpIHtcbiAgdmFyIGRvbWFpbiA9IHVuaXQsXG4gICAgICByYW5nZSA9IHVuaXQsXG4gICAgICBpbnRlcnBvbGF0ZSA9IGludGVycG9sYXRlVmFsdWUsXG4gICAgICB0cmFuc2Zvcm0sXG4gICAgICB1bnRyYW5zZm9ybSxcbiAgICAgIHVua25vd24sXG4gICAgICBjbGFtcCA9IGlkZW50aXR5LFxuICAgICAgcGllY2V3aXNlLFxuICAgICAgb3V0cHV0LFxuICAgICAgaW5wdXQ7XG5cbiAgZnVuY3Rpb24gcmVzY2FsZSgpIHtcbiAgICB2YXIgbiA9IE1hdGgubWluKGRvbWFpbi5sZW5ndGgsIHJhbmdlLmxlbmd0aCk7XG4gICAgaWYgKGNsYW1wICE9PSBpZGVudGl0eSkgY2xhbXAgPSBjbGFtcGVyKGRvbWFpblswXSwgZG9tYWluW24gLSAxXSk7XG4gICAgcGllY2V3aXNlID0gbiA+IDIgPyBwb2x5bWFwIDogYmltYXA7XG4gICAgb3V0cHV0ID0gaW5wdXQgPSBudWxsO1xuICAgIHJldHVybiBzY2FsZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICByZXR1cm4geCA9PSBudWxsIHx8IGlzTmFOKHggPSAreCkgPyB1bmtub3duIDogKG91dHB1dCB8fCAob3V0cHV0ID0gcGllY2V3aXNlKGRvbWFpbi5tYXAodHJhbnNmb3JtKSwgcmFuZ2UsIGludGVycG9sYXRlKSkpKHRyYW5zZm9ybShjbGFtcCh4KSkpO1xuICB9XG5cbiAgc2NhbGUuaW52ZXJ0ID0gZnVuY3Rpb24oeSkge1xuICAgIHJldHVybiBjbGFtcCh1bnRyYW5zZm9ybSgoaW5wdXQgfHwgKGlucHV0ID0gcGllY2V3aXNlKHJhbmdlLCBkb21haW4ubWFwKHRyYW5zZm9ybSksIGludGVycG9sYXRlTnVtYmVyKSkpKHkpKSk7XG4gIH07XG5cbiAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGRvbWFpbiA9IEFycmF5LmZyb20oXywgbnVtYmVyKSwgcmVzY2FsZSgpKSA6IGRvbWFpbi5zbGljZSgpO1xuICB9O1xuXG4gIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJhbmdlID0gQXJyYXkuZnJvbShfKSwgcmVzY2FsZSgpKSA6IHJhbmdlLnNsaWNlKCk7XG4gIH07XG5cbiAgc2NhbGUucmFuZ2VSb3VuZCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gcmFuZ2UgPSBBcnJheS5mcm9tKF8pLCBpbnRlcnBvbGF0ZSA9IGludGVycG9sYXRlUm91bmQsIHJlc2NhbGUoKTtcbiAgfTtcblxuICBzY2FsZS5jbGFtcCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjbGFtcCA9IF8gPyB0cnVlIDogaWRlbnRpdHksIHJlc2NhbGUoKSkgOiBjbGFtcCAhPT0gaWRlbnRpdHk7XG4gIH07XG5cbiAgc2NhbGUuaW50ZXJwb2xhdGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoaW50ZXJwb2xhdGUgPSBfLCByZXNjYWxlKCkpIDogaW50ZXJwb2xhdGU7XG4gIH07XG5cbiAgc2NhbGUudW5rbm93biA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh1bmtub3duID0gXywgc2NhbGUpIDogdW5rbm93bjtcbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24odCwgdSkge1xuICAgIHRyYW5zZm9ybSA9IHQsIHVudHJhbnNmb3JtID0gdTtcbiAgICByZXR1cm4gcmVzY2FsZSgpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb250aW51b3VzKCkge1xuICByZXR1cm4gdHJhbnNmb3JtZXIoKShpZGVudGl0eSwgaWRlbnRpdHkpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIE1hdGguYWJzKHggPSBNYXRoLnJvdW5kKHgpKSA+PSAxZTIxXG4gICAgICA/IHgudG9Mb2NhbGVTdHJpbmcoXCJlblwiKS5yZXBsYWNlKC8sL2csIFwiXCIpXG4gICAgICA6IHgudG9TdHJpbmcoMTApO1xufVxuXG4vLyBDb21wdXRlcyB0aGUgZGVjaW1hbCBjb2VmZmljaWVudCBhbmQgZXhwb25lbnQgb2YgdGhlIHNwZWNpZmllZCBudW1iZXIgeCB3aXRoXG4vLyBzaWduaWZpY2FudCBkaWdpdHMgcCwgd2hlcmUgeCBpcyBwb3NpdGl2ZSBhbmQgcCBpcyBpbiBbMSwgMjFdIG9yIHVuZGVmaW5lZC5cbi8vIEZvciBleGFtcGxlLCBmb3JtYXREZWNpbWFsUGFydHMoMS4yMykgcmV0dXJucyBbXCIxMjNcIiwgMF0uXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RGVjaW1hbFBhcnRzKHgsIHApIHtcbiAgaWYgKCFpc0Zpbml0ZSh4KSB8fCB4ID09PSAwKSByZXR1cm4gbnVsbDsgLy8gTmFOLCBcdTAwQjFJbmZpbml0eSwgXHUwMEIxMFxuICB2YXIgaSA9ICh4ID0gcCA/IHgudG9FeHBvbmVudGlhbChwIC0gMSkgOiB4LnRvRXhwb25lbnRpYWwoKSkuaW5kZXhPZihcImVcIiksIGNvZWZmaWNpZW50ID0geC5zbGljZSgwLCBpKTtcblxuICAvLyBUaGUgc3RyaW5nIHJldHVybmVkIGJ5IHRvRXhwb25lbnRpYWwgZWl0aGVyIGhhcyB0aGUgZm9ybSBcXGRcXC5cXGQrZVstK11cXGQrXG4gIC8vIChlLmcuLCAxLjJlKzMpIG9yIHRoZSBmb3JtIFxcZGVbLStdXFxkKyAoZS5nLiwgMWUrMykuXG4gIHJldHVybiBbXG4gICAgY29lZmZpY2llbnQubGVuZ3RoID4gMSA/IGNvZWZmaWNpZW50WzBdICsgY29lZmZpY2llbnQuc2xpY2UoMikgOiBjb2VmZmljaWVudCxcbiAgICAreC5zbGljZShpICsgMSlcbiAgXTtcbn1cbiIsICJpbXBvcnQge2Zvcm1hdERlY2ltYWxQYXJ0c30gZnJvbSBcIi4vZm9ybWF0RGVjaW1hbC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB4ID0gZm9ybWF0RGVjaW1hbFBhcnRzKE1hdGguYWJzKHgpKSwgeCA/IHhbMV0gOiBOYU47XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZ3JvdXBpbmcsIHRob3VzYW5kcykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUsIHdpZHRoKSB7XG4gICAgdmFyIGkgPSB2YWx1ZS5sZW5ndGgsXG4gICAgICAgIHQgPSBbXSxcbiAgICAgICAgaiA9IDAsXG4gICAgICAgIGcgPSBncm91cGluZ1swXSxcbiAgICAgICAgbGVuZ3RoID0gMDtcblxuICAgIHdoaWxlIChpID4gMCAmJiBnID4gMCkge1xuICAgICAgaWYgKGxlbmd0aCArIGcgKyAxID4gd2lkdGgpIGcgPSBNYXRoLm1heCgxLCB3aWR0aCAtIGxlbmd0aCk7XG4gICAgICB0LnB1c2godmFsdWUuc3Vic3RyaW5nKGkgLT0gZywgaSArIGcpKTtcbiAgICAgIGlmICgobGVuZ3RoICs9IGcgKyAxKSA+IHdpZHRoKSBicmVhaztcbiAgICAgIGcgPSBncm91cGluZ1tqID0gKGogKyAxKSAlIGdyb3VwaW5nLmxlbmd0aF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHQucmV2ZXJzZSgpLmpvaW4odGhvdXNhbmRzKTtcbiAgfTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihudW1lcmFscykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvWzAtOV0vZywgZnVuY3Rpb24oaSkge1xuICAgICAgcmV0dXJuIG51bWVyYWxzWytpXTtcbiAgICB9KTtcbiAgfTtcbn1cbiIsICIvLyBbW2ZpbGxdYWxpZ25dW3NpZ25dW3N5bWJvbF1bMF1bd2lkdGhdWyxdWy5wcmVjaXNpb25dW35dW3R5cGVdXG52YXIgcmUgPSAvXig/OiguKT8oWzw+PV5dKSk/KFsrXFwtKCBdKT8oWyQjXSk/KDApPyhcXGQrKT8oLCk/KFxcLlxcZCspPyh+KT8oW2EteiVdKT8kL2k7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpIHtcbiAgaWYgKCEobWF0Y2ggPSByZS5leGVjKHNwZWNpZmllcikpKSB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIGZvcm1hdDogXCIgKyBzcGVjaWZpZXIpO1xuICB2YXIgbWF0Y2g7XG4gIHJldHVybiBuZXcgRm9ybWF0U3BlY2lmaWVyKHtcbiAgICBmaWxsOiBtYXRjaFsxXSxcbiAgICBhbGlnbjogbWF0Y2hbMl0sXG4gICAgc2lnbjogbWF0Y2hbM10sXG4gICAgc3ltYm9sOiBtYXRjaFs0XSxcbiAgICB6ZXJvOiBtYXRjaFs1XSxcbiAgICB3aWR0aDogbWF0Y2hbNl0sXG4gICAgY29tbWE6IG1hdGNoWzddLFxuICAgIHByZWNpc2lvbjogbWF0Y2hbOF0gJiYgbWF0Y2hbOF0uc2xpY2UoMSksXG4gICAgdHJpbTogbWF0Y2hbOV0sXG4gICAgdHlwZTogbWF0Y2hbMTBdXG4gIH0pO1xufVxuXG5mb3JtYXRTcGVjaWZpZXIucHJvdG90eXBlID0gRm9ybWF0U3BlY2lmaWVyLnByb3RvdHlwZTsgLy8gaW5zdGFuY2VvZlxuXG5leHBvcnQgZnVuY3Rpb24gRm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcikge1xuICB0aGlzLmZpbGwgPSBzcGVjaWZpZXIuZmlsbCA9PT0gdW5kZWZpbmVkID8gXCIgXCIgOiBzcGVjaWZpZXIuZmlsbCArIFwiXCI7XG4gIHRoaXMuYWxpZ24gPSBzcGVjaWZpZXIuYWxpZ24gPT09IHVuZGVmaW5lZCA/IFwiPlwiIDogc3BlY2lmaWVyLmFsaWduICsgXCJcIjtcbiAgdGhpcy5zaWduID0gc3BlY2lmaWVyLnNpZ24gPT09IHVuZGVmaW5lZCA/IFwiLVwiIDogc3BlY2lmaWVyLnNpZ24gKyBcIlwiO1xuICB0aGlzLnN5bWJvbCA9IHNwZWNpZmllci5zeW1ib2wgPT09IHVuZGVmaW5lZCA/IFwiXCIgOiBzcGVjaWZpZXIuc3ltYm9sICsgXCJcIjtcbiAgdGhpcy56ZXJvID0gISFzcGVjaWZpZXIuemVybztcbiAgdGhpcy53aWR0aCA9IHNwZWNpZmllci53aWR0aCA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogK3NwZWNpZmllci53aWR0aDtcbiAgdGhpcy5jb21tYSA9ICEhc3BlY2lmaWVyLmNvbW1hO1xuICB0aGlzLnByZWNpc2lvbiA9IHNwZWNpZmllci5wcmVjaXNpb24gPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6ICtzcGVjaWZpZXIucHJlY2lzaW9uO1xuICB0aGlzLnRyaW0gPSAhIXNwZWNpZmllci50cmltO1xuICB0aGlzLnR5cGUgPSBzcGVjaWZpZXIudHlwZSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHNwZWNpZmllci50eXBlICsgXCJcIjtcbn1cblxuRm9ybWF0U3BlY2lmaWVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5maWxsXG4gICAgICArIHRoaXMuYWxpZ25cbiAgICAgICsgdGhpcy5zaWduXG4gICAgICArIHRoaXMuc3ltYm9sXG4gICAgICArICh0aGlzLnplcm8gPyBcIjBcIiA6IFwiXCIpXG4gICAgICArICh0aGlzLndpZHRoID09PSB1bmRlZmluZWQgPyBcIlwiIDogTWF0aC5tYXgoMSwgdGhpcy53aWR0aCB8IDApKVxuICAgICAgKyAodGhpcy5jb21tYSA/IFwiLFwiIDogXCJcIilcbiAgICAgICsgKHRoaXMucHJlY2lzaW9uID09PSB1bmRlZmluZWQgPyBcIlwiIDogXCIuXCIgKyBNYXRoLm1heCgwLCB0aGlzLnByZWNpc2lvbiB8IDApKVxuICAgICAgKyAodGhpcy50cmltID8gXCJ+XCIgOiBcIlwiKVxuICAgICAgKyB0aGlzLnR5cGU7XG59O1xuIiwgIi8vIFRyaW1zIGluc2lnbmlmaWNhbnQgemVyb3MsIGUuZy4sIHJlcGxhY2VzIDEuMjAwMGsgd2l0aCAxLjJrLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocykge1xuICBvdXQ6IGZvciAodmFyIG4gPSBzLmxlbmd0aCwgaSA9IDEsIGkwID0gLTEsIGkxOyBpIDwgbjsgKytpKSB7XG4gICAgc3dpdGNoIChzW2ldKSB7XG4gICAgICBjYXNlIFwiLlwiOiBpMCA9IGkxID0gaTsgYnJlYWs7XG4gICAgICBjYXNlIFwiMFwiOiBpZiAoaTAgPT09IDApIGkwID0gaTsgaTEgPSBpOyBicmVhaztcbiAgICAgIGRlZmF1bHQ6IGlmICghK3NbaV0pIGJyZWFrIG91dDsgaWYgKGkwID4gMCkgaTAgPSAwOyBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGkwID4gMCA/IHMuc2xpY2UoMCwgaTApICsgcy5zbGljZShpMSArIDEpIDogcztcbn1cbiIsICJpbXBvcnQge2Zvcm1hdERlY2ltYWxQYXJ0c30gZnJvbSBcIi4vZm9ybWF0RGVjaW1hbC5qc1wiO1xuXG5leHBvcnQgdmFyIHByZWZpeEV4cG9uZW50O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4LCBwKSB7XG4gIHZhciBkID0gZm9ybWF0RGVjaW1hbFBhcnRzKHgsIHApO1xuICBpZiAoIWQpIHJldHVybiBwcmVmaXhFeHBvbmVudCA9IHVuZGVmaW5lZCwgeC50b1ByZWNpc2lvbihwKTtcbiAgdmFyIGNvZWZmaWNpZW50ID0gZFswXSxcbiAgICAgIGV4cG9uZW50ID0gZFsxXSxcbiAgICAgIGkgPSBleHBvbmVudCAtIChwcmVmaXhFeHBvbmVudCA9IE1hdGgubWF4KC04LCBNYXRoLm1pbig4LCBNYXRoLmZsb29yKGV4cG9uZW50IC8gMykpKSAqIDMpICsgMSxcbiAgICAgIG4gPSBjb2VmZmljaWVudC5sZW5ndGg7XG4gIHJldHVybiBpID09PSBuID8gY29lZmZpY2llbnRcbiAgICAgIDogaSA+IG4gPyBjb2VmZmljaWVudCArIG5ldyBBcnJheShpIC0gbiArIDEpLmpvaW4oXCIwXCIpXG4gICAgICA6IGkgPiAwID8gY29lZmZpY2llbnQuc2xpY2UoMCwgaSkgKyBcIi5cIiArIGNvZWZmaWNpZW50LnNsaWNlKGkpXG4gICAgICA6IFwiMC5cIiArIG5ldyBBcnJheSgxIC0gaSkuam9pbihcIjBcIikgKyBmb3JtYXREZWNpbWFsUGFydHMoeCwgTWF0aC5tYXgoMCwgcCArIGkgLSAxKSlbMF07IC8vIGxlc3MgdGhhbiAxeSFcbn1cbiIsICJpbXBvcnQge2Zvcm1hdERlY2ltYWxQYXJ0c30gZnJvbSBcIi4vZm9ybWF0RGVjaW1hbC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4LCBwKSB7XG4gIHZhciBkID0gZm9ybWF0RGVjaW1hbFBhcnRzKHgsIHApO1xuICBpZiAoIWQpIHJldHVybiB4ICsgXCJcIjtcbiAgdmFyIGNvZWZmaWNpZW50ID0gZFswXSxcbiAgICAgIGV4cG9uZW50ID0gZFsxXTtcbiAgcmV0dXJuIGV4cG9uZW50IDwgMCA/IFwiMC5cIiArIG5ldyBBcnJheSgtZXhwb25lbnQpLmpvaW4oXCIwXCIpICsgY29lZmZpY2llbnRcbiAgICAgIDogY29lZmZpY2llbnQubGVuZ3RoID4gZXhwb25lbnQgKyAxID8gY29lZmZpY2llbnQuc2xpY2UoMCwgZXhwb25lbnQgKyAxKSArIFwiLlwiICsgY29lZmZpY2llbnQuc2xpY2UoZXhwb25lbnQgKyAxKVxuICAgICAgOiBjb2VmZmljaWVudCArIG5ldyBBcnJheShleHBvbmVudCAtIGNvZWZmaWNpZW50Lmxlbmd0aCArIDIpLmpvaW4oXCIwXCIpO1xufVxuIiwgImltcG9ydCBmb3JtYXREZWNpbWFsIGZyb20gXCIuL2Zvcm1hdERlY2ltYWwuanNcIjtcbmltcG9ydCBmb3JtYXRQcmVmaXhBdXRvIGZyb20gXCIuL2Zvcm1hdFByZWZpeEF1dG8uanNcIjtcbmltcG9ydCBmb3JtYXRSb3VuZGVkIGZyb20gXCIuL2Zvcm1hdFJvdW5kZWQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBcIiVcIjogKHgsIHApID0+ICh4ICogMTAwKS50b0ZpeGVkKHApLFxuICBcImJcIjogKHgpID0+IE1hdGgucm91bmQoeCkudG9TdHJpbmcoMiksXG4gIFwiY1wiOiAoeCkgPT4geCArIFwiXCIsXG4gIFwiZFwiOiBmb3JtYXREZWNpbWFsLFxuICBcImVcIjogKHgsIHApID0+IHgudG9FeHBvbmVudGlhbChwKSxcbiAgXCJmXCI6ICh4LCBwKSA9PiB4LnRvRml4ZWQocCksXG4gIFwiZ1wiOiAoeCwgcCkgPT4geC50b1ByZWNpc2lvbihwKSxcbiAgXCJvXCI6ICh4KSA9PiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDgpLFxuICBcInBcIjogKHgsIHApID0+IGZvcm1hdFJvdW5kZWQoeCAqIDEwMCwgcCksXG4gIFwiclwiOiBmb3JtYXRSb3VuZGVkLFxuICBcInNcIjogZm9ybWF0UHJlZml4QXV0byxcbiAgXCJYXCI6ICh4KSA9PiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLFxuICBcInhcIjogKHgpID0+IE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTYpXG59O1xuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHg7XG59XG4iLCAiaW1wb3J0IGV4cG9uZW50IGZyb20gXCIuL2V4cG9uZW50LmpzXCI7XG5pbXBvcnQgZm9ybWF0R3JvdXAgZnJvbSBcIi4vZm9ybWF0R3JvdXAuanNcIjtcbmltcG9ydCBmb3JtYXROdW1lcmFscyBmcm9tIFwiLi9mb3JtYXROdW1lcmFscy5qc1wiO1xuaW1wb3J0IGZvcm1hdFNwZWNpZmllciBmcm9tIFwiLi9mb3JtYXRTcGVjaWZpZXIuanNcIjtcbmltcG9ydCBmb3JtYXRUcmltIGZyb20gXCIuL2Zvcm1hdFRyaW0uanNcIjtcbmltcG9ydCBmb3JtYXRUeXBlcyBmcm9tIFwiLi9mb3JtYXRUeXBlcy5qc1wiO1xuaW1wb3J0IHtwcmVmaXhFeHBvbmVudH0gZnJvbSBcIi4vZm9ybWF0UHJlZml4QXV0by5qc1wiO1xuaW1wb3J0IGlkZW50aXR5IGZyb20gXCIuL2lkZW50aXR5LmpzXCI7XG5cbnZhciBtYXAgPSBBcnJheS5wcm90b3R5cGUubWFwLFxuICAgIHByZWZpeGVzID0gW1wieVwiLFwielwiLFwiYVwiLFwiZlwiLFwicFwiLFwiblwiLFwiXHUwMEI1XCIsXCJtXCIsXCJcIixcImtcIixcIk1cIixcIkdcIixcIlRcIixcIlBcIixcIkVcIixcIlpcIixcIllcIl07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGxvY2FsZSkge1xuICB2YXIgZ3JvdXAgPSBsb2NhbGUuZ3JvdXBpbmcgPT09IHVuZGVmaW5lZCB8fCBsb2NhbGUudGhvdXNhbmRzID09PSB1bmRlZmluZWQgPyBpZGVudGl0eSA6IGZvcm1hdEdyb3VwKG1hcC5jYWxsKGxvY2FsZS5ncm91cGluZywgTnVtYmVyKSwgbG9jYWxlLnRob3VzYW5kcyArIFwiXCIpLFxuICAgICAgY3VycmVuY3lQcmVmaXggPSBsb2NhbGUuY3VycmVuY3kgPT09IHVuZGVmaW5lZCA/IFwiXCIgOiBsb2NhbGUuY3VycmVuY3lbMF0gKyBcIlwiLFxuICAgICAgY3VycmVuY3lTdWZmaXggPSBsb2NhbGUuY3VycmVuY3kgPT09IHVuZGVmaW5lZCA/IFwiXCIgOiBsb2NhbGUuY3VycmVuY3lbMV0gKyBcIlwiLFxuICAgICAgZGVjaW1hbCA9IGxvY2FsZS5kZWNpbWFsID09PSB1bmRlZmluZWQgPyBcIi5cIiA6IGxvY2FsZS5kZWNpbWFsICsgXCJcIixcbiAgICAgIG51bWVyYWxzID0gbG9jYWxlLm51bWVyYWxzID09PSB1bmRlZmluZWQgPyBpZGVudGl0eSA6IGZvcm1hdE51bWVyYWxzKG1hcC5jYWxsKGxvY2FsZS5udW1lcmFscywgU3RyaW5nKSksXG4gICAgICBwZXJjZW50ID0gbG9jYWxlLnBlcmNlbnQgPT09IHVuZGVmaW5lZCA/IFwiJVwiIDogbG9jYWxlLnBlcmNlbnQgKyBcIlwiLFxuICAgICAgbWludXMgPSBsb2NhbGUubWludXMgPT09IHVuZGVmaW5lZCA/IFwiXHUyMjEyXCIgOiBsb2NhbGUubWludXMgKyBcIlwiLFxuICAgICAgbmFuID0gbG9jYWxlLm5hbiA9PT0gdW5kZWZpbmVkID8gXCJOYU5cIiA6IGxvY2FsZS5uYW4gKyBcIlwiO1xuXG4gIGZ1bmN0aW9uIG5ld0Zvcm1hdChzcGVjaWZpZXIsIG9wdGlvbnMpIHtcbiAgICBzcGVjaWZpZXIgPSBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKTtcblxuICAgIHZhciBmaWxsID0gc3BlY2lmaWVyLmZpbGwsXG4gICAgICAgIGFsaWduID0gc3BlY2lmaWVyLmFsaWduLFxuICAgICAgICBzaWduID0gc3BlY2lmaWVyLnNpZ24sXG4gICAgICAgIHN5bWJvbCA9IHNwZWNpZmllci5zeW1ib2wsXG4gICAgICAgIHplcm8gPSBzcGVjaWZpZXIuemVybyxcbiAgICAgICAgd2lkdGggPSBzcGVjaWZpZXIud2lkdGgsXG4gICAgICAgIGNvbW1hID0gc3BlY2lmaWVyLmNvbW1hLFxuICAgICAgICBwcmVjaXNpb24gPSBzcGVjaWZpZXIucHJlY2lzaW9uLFxuICAgICAgICB0cmltID0gc3BlY2lmaWVyLnRyaW0sXG4gICAgICAgIHR5cGUgPSBzcGVjaWZpZXIudHlwZTtcblxuICAgIC8vIFRoZSBcIm5cIiB0eXBlIGlzIGFuIGFsaWFzIGZvciBcIixnXCIuXG4gICAgaWYgKHR5cGUgPT09IFwiblwiKSBjb21tYSA9IHRydWUsIHR5cGUgPSBcImdcIjtcblxuICAgIC8vIFRoZSBcIlwiIHR5cGUsIGFuZCBhbnkgaW52YWxpZCB0eXBlLCBpcyBhbiBhbGlhcyBmb3IgXCIuMTJ+Z1wiLlxuICAgIGVsc2UgaWYgKCFmb3JtYXRUeXBlc1t0eXBlXSkgcHJlY2lzaW9uID09PSB1bmRlZmluZWQgJiYgKHByZWNpc2lvbiA9IDEyKSwgdHJpbSA9IHRydWUsIHR5cGUgPSBcImdcIjtcblxuICAgIC8vIElmIHplcm8gZmlsbCBpcyBzcGVjaWZpZWQsIHBhZGRpbmcgZ29lcyBhZnRlciBzaWduIGFuZCBiZWZvcmUgZGlnaXRzLlxuICAgIGlmICh6ZXJvIHx8IChmaWxsID09PSBcIjBcIiAmJiBhbGlnbiA9PT0gXCI9XCIpKSB6ZXJvID0gdHJ1ZSwgZmlsbCA9IFwiMFwiLCBhbGlnbiA9IFwiPVwiO1xuXG4gICAgLy8gQ29tcHV0ZSB0aGUgcHJlZml4IGFuZCBzdWZmaXguXG4gICAgLy8gRm9yIFNJLXByZWZpeCwgdGhlIHN1ZmZpeCBpcyBsYXppbHkgY29tcHV0ZWQuXG4gICAgdmFyIHByZWZpeCA9IChvcHRpb25zICYmIG9wdGlvbnMucHJlZml4ICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnByZWZpeCA6IFwiXCIpICsgKHN5bWJvbCA9PT0gXCIkXCIgPyBjdXJyZW5jeVByZWZpeCA6IHN5bWJvbCA9PT0gXCIjXCIgJiYgL1tib3hYXS8udGVzdCh0eXBlKSA/IFwiMFwiICsgdHlwZS50b0xvd2VyQ2FzZSgpIDogXCJcIiksXG4gICAgICAgIHN1ZmZpeCA9IChzeW1ib2wgPT09IFwiJFwiID8gY3VycmVuY3lTdWZmaXggOiAvWyVwXS8udGVzdCh0eXBlKSA/IHBlcmNlbnQgOiBcIlwiKSArIChvcHRpb25zICYmIG9wdGlvbnMuc3VmZml4ICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLnN1ZmZpeCA6IFwiXCIpO1xuXG4gICAgLy8gV2hhdCBmb3JtYXQgZnVuY3Rpb24gc2hvdWxkIHdlIHVzZT9cbiAgICAvLyBJcyB0aGlzIGFuIGludGVnZXIgdHlwZT9cbiAgICAvLyBDYW4gdGhpcyB0eXBlIGdlbmVyYXRlIGV4cG9uZW50aWFsIG5vdGF0aW9uP1xuICAgIHZhciBmb3JtYXRUeXBlID0gZm9ybWF0VHlwZXNbdHlwZV0sXG4gICAgICAgIG1heWJlU3VmZml4ID0gL1tkZWZncHJzJV0vLnRlc3QodHlwZSk7XG5cbiAgICAvLyBTZXQgdGhlIGRlZmF1bHQgcHJlY2lzaW9uIGlmIG5vdCBzcGVjaWZpZWQsXG4gICAgLy8gb3IgY2xhbXAgdGhlIHNwZWNpZmllZCBwcmVjaXNpb24gdG8gdGhlIHN1cHBvcnRlZCByYW5nZS5cbiAgICAvLyBGb3Igc2lnbmlmaWNhbnQgcHJlY2lzaW9uLCBpdCBtdXN0IGJlIGluIFsxLCAyMV0uXG4gICAgLy8gRm9yIGZpeGVkIHByZWNpc2lvbiwgaXQgbXVzdCBiZSBpbiBbMCwgMjBdLlxuICAgIHByZWNpc2lvbiA9IHByZWNpc2lvbiA9PT0gdW5kZWZpbmVkID8gNlxuICAgICAgICA6IC9bZ3Byc10vLnRlc3QodHlwZSkgPyBNYXRoLm1heCgxLCBNYXRoLm1pbigyMSwgcHJlY2lzaW9uKSlcbiAgICAgICAgOiBNYXRoLm1heCgwLCBNYXRoLm1pbigyMCwgcHJlY2lzaW9uKSk7XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQodmFsdWUpIHtcbiAgICAgIHZhciB2YWx1ZVByZWZpeCA9IHByZWZpeCxcbiAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IHN1ZmZpeCxcbiAgICAgICAgICBpLCBuLCBjO1xuXG4gICAgICBpZiAodHlwZSA9PT0gXCJjXCIpIHtcbiAgICAgICAgdmFsdWVTdWZmaXggPSBmb3JtYXRUeXBlKHZhbHVlKSArIHZhbHVlU3VmZml4O1xuICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9ICt2YWx1ZTtcblxuICAgICAgICAvLyBEZXRlcm1pbmUgdGhlIHNpZ24uIC0wIGlzIG5vdCBsZXNzIHRoYW4gMCwgYnV0IDEgLyAtMCBpcyFcbiAgICAgICAgdmFyIHZhbHVlTmVnYXRpdmUgPSB2YWx1ZSA8IDAgfHwgMSAvIHZhbHVlIDwgMDtcblxuICAgICAgICAvLyBQZXJmb3JtIHRoZSBpbml0aWFsIGZvcm1hdHRpbmcuXG4gICAgICAgIHZhbHVlID0gaXNOYU4odmFsdWUpID8gbmFuIDogZm9ybWF0VHlwZShNYXRoLmFicyh2YWx1ZSksIHByZWNpc2lvbik7XG5cbiAgICAgICAgLy8gVHJpbSBpbnNpZ25pZmljYW50IHplcm9zLlxuICAgICAgICBpZiAodHJpbSkgdmFsdWUgPSBmb3JtYXRUcmltKHZhbHVlKTtcblxuICAgICAgICAvLyBJZiBhIG5lZ2F0aXZlIHZhbHVlIHJvdW5kcyB0byB6ZXJvIGFmdGVyIGZvcm1hdHRpbmcsIGFuZCBubyBleHBsaWNpdCBwb3NpdGl2ZSBzaWduIGlzIHJlcXVlc3RlZCwgaGlkZSB0aGUgc2lnbi5cbiAgICAgICAgaWYgKHZhbHVlTmVnYXRpdmUgJiYgK3ZhbHVlID09PSAwICYmIHNpZ24gIT09IFwiK1wiKSB2YWx1ZU5lZ2F0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgcHJlZml4IGFuZCBzdWZmaXguXG4gICAgICAgIHZhbHVlUHJlZml4ID0gKHZhbHVlTmVnYXRpdmUgPyAoc2lnbiA9PT0gXCIoXCIgPyBzaWduIDogbWludXMpIDogc2lnbiA9PT0gXCItXCIgfHwgc2lnbiA9PT0gXCIoXCIgPyBcIlwiIDogc2lnbikgKyB2YWx1ZVByZWZpeDtcbiAgICAgICAgdmFsdWVTdWZmaXggPSAodHlwZSA9PT0gXCJzXCIgJiYgIWlzTmFOKHZhbHVlKSAmJiBwcmVmaXhFeHBvbmVudCAhPT0gdW5kZWZpbmVkID8gcHJlZml4ZXNbOCArIHByZWZpeEV4cG9uZW50IC8gM10gOiBcIlwiKSArIHZhbHVlU3VmZml4ICsgKHZhbHVlTmVnYXRpdmUgJiYgc2lnbiA9PT0gXCIoXCIgPyBcIilcIiA6IFwiXCIpO1xuXG4gICAgICAgIC8vIEJyZWFrIHRoZSBmb3JtYXR0ZWQgdmFsdWUgaW50byB0aGUgaW50ZWdlciBcdTIwMUN2YWx1ZVx1MjAxRCBwYXJ0IHRoYXQgY2FuIGJlXG4gICAgICAgIC8vIGdyb3VwZWQsIGFuZCBmcmFjdGlvbmFsIG9yIGV4cG9uZW50aWFsIFx1MjAxQ3N1ZmZpeFx1MjAxRCBwYXJ0IHRoYXQgaXMgbm90LlxuICAgICAgICBpZiAobWF5YmVTdWZmaXgpIHtcbiAgICAgICAgICBpID0gLTEsIG4gPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChjID0gdmFsdWUuY2hhckNvZGVBdChpKSwgNDggPiBjIHx8IGMgPiA1Nykge1xuICAgICAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IChjID09PSA0NiA/IGRlY2ltYWwgKyB2YWx1ZS5zbGljZShpICsgMSkgOiB2YWx1ZS5zbGljZShpKSkgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgwLCBpKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZSBmaWxsIGNoYXJhY3RlciBpcyBub3QgXCIwXCIsIGdyb3VwaW5nIGlzIGFwcGxpZWQgYmVmb3JlIHBhZGRpbmcuXG4gICAgICBpZiAoY29tbWEgJiYgIXplcm8pIHZhbHVlID0gZ3JvdXAodmFsdWUsIEluZmluaXR5KTtcblxuICAgICAgLy8gQ29tcHV0ZSB0aGUgcGFkZGluZy5cbiAgICAgIHZhciBsZW5ndGggPSB2YWx1ZVByZWZpeC5sZW5ndGggKyB2YWx1ZS5sZW5ndGggKyB2YWx1ZVN1ZmZpeC5sZW5ndGgsXG4gICAgICAgICAgcGFkZGluZyA9IGxlbmd0aCA8IHdpZHRoID8gbmV3IEFycmF5KHdpZHRoIC0gbGVuZ3RoICsgMSkuam9pbihmaWxsKSA6IFwiXCI7XG5cbiAgICAgIC8vIElmIHRoZSBmaWxsIGNoYXJhY3RlciBpcyBcIjBcIiwgZ3JvdXBpbmcgaXMgYXBwbGllZCBhZnRlciBwYWRkaW5nLlxuICAgICAgaWYgKGNvbW1hICYmIHplcm8pIHZhbHVlID0gZ3JvdXAocGFkZGluZyArIHZhbHVlLCBwYWRkaW5nLmxlbmd0aCA/IHdpZHRoIC0gdmFsdWVTdWZmaXgubGVuZ3RoIDogSW5maW5pdHkpLCBwYWRkaW5nID0gXCJcIjtcblxuICAgICAgLy8gUmVjb25zdHJ1Y3QgdGhlIGZpbmFsIG91dHB1dCBiYXNlZCBvbiB0aGUgZGVzaXJlZCBhbGlnbm1lbnQuXG4gICAgICBzd2l0Y2ggKGFsaWduKSB7XG4gICAgICAgIGNhc2UgXCI8XCI6IHZhbHVlID0gdmFsdWVQcmVmaXggKyB2YWx1ZSArIHZhbHVlU3VmZml4ICsgcGFkZGluZzsgYnJlYWs7XG4gICAgICAgIGNhc2UgXCI9XCI6IHZhbHVlID0gdmFsdWVQcmVmaXggKyBwYWRkaW5nICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeDsgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJeXCI6IHZhbHVlID0gcGFkZGluZy5zbGljZSgwLCBsZW5ndGggPSBwYWRkaW5nLmxlbmd0aCA+PiAxKSArIHZhbHVlUHJlZml4ICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeCArIHBhZGRpbmcuc2xpY2UobGVuZ3RoKTsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6IHZhbHVlID0gcGFkZGluZyArIHZhbHVlUHJlZml4ICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeDsgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudW1lcmFscyh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZm9ybWF0LnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc3BlY2lmaWVyICsgXCJcIjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGZvcm1hdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFByZWZpeChzcGVjaWZpZXIsIHZhbHVlKSB7XG4gICAgdmFyIGUgPSBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCh2YWx1ZSkgLyAzKSkpICogMyxcbiAgICAgICAgayA9IE1hdGgucG93KDEwLCAtZSksXG4gICAgICAgIGYgPSBuZXdGb3JtYXQoKHNwZWNpZmllciA9IGZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpLCBzcGVjaWZpZXIudHlwZSA9IFwiZlwiLCBzcGVjaWZpZXIpLCB7c3VmZml4OiBwcmVmaXhlc1s4ICsgZSAvIDNdfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZihrICogdmFsdWUpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZvcm1hdDogbmV3Rm9ybWF0LFxuICAgIGZvcm1hdFByZWZpeDogZm9ybWF0UHJlZml4XG4gIH07XG59XG4iLCAiaW1wb3J0IGZvcm1hdExvY2FsZSBmcm9tIFwiLi9sb2NhbGUuanNcIjtcblxudmFyIGxvY2FsZTtcbmV4cG9ydCB2YXIgZm9ybWF0O1xuZXhwb3J0IHZhciBmb3JtYXRQcmVmaXg7XG5cbmRlZmF1bHRMb2NhbGUoe1xuICB0aG91c2FuZHM6IFwiLFwiLFxuICBncm91cGluZzogWzNdLFxuICBjdXJyZW5jeTogW1wiJFwiLCBcIlwiXVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlZmF1bHRMb2NhbGUoZGVmaW5pdGlvbikge1xuICBsb2NhbGUgPSBmb3JtYXRMb2NhbGUoZGVmaW5pdGlvbik7XG4gIGZvcm1hdCA9IGxvY2FsZS5mb3JtYXQ7XG4gIGZvcm1hdFByZWZpeCA9IGxvY2FsZS5mb3JtYXRQcmVmaXg7XG4gIHJldHVybiBsb2NhbGU7XG59XG4iLCAiaW1wb3J0IGV4cG9uZW50IGZyb20gXCIuL2V4cG9uZW50LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0ZXApIHtcbiAgcmV0dXJuIE1hdGgubWF4KDAsIC1leHBvbmVudChNYXRoLmFicyhzdGVwKSkpO1xufVxuIiwgImltcG9ydCBleHBvbmVudCBmcm9tIFwiLi9leHBvbmVudC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzdGVwLCB2YWx1ZSkge1xuICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5tYXgoLTgsIE1hdGgubWluKDgsIE1hdGguZmxvb3IoZXhwb25lbnQodmFsdWUpIC8gMykpKSAqIDMgLSBleHBvbmVudChNYXRoLmFicyhzdGVwKSkpO1xufVxuIiwgImltcG9ydCBleHBvbmVudCBmcm9tIFwiLi9leHBvbmVudC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzdGVwLCBtYXgpIHtcbiAgc3RlcCA9IE1hdGguYWJzKHN0ZXApLCBtYXggPSBNYXRoLmFicyhtYXgpIC0gc3RlcDtcbiAgcmV0dXJuIE1hdGgubWF4KDAsIGV4cG9uZW50KG1heCkgLSBleHBvbmVudChzdGVwKSkgKyAxO1xufVxuIiwgImltcG9ydCB7dGlja1N0ZXB9IGZyb20gXCJkMy1hcnJheVwiO1xuaW1wb3J0IHtmb3JtYXQsIGZvcm1hdFByZWZpeCwgZm9ybWF0U3BlY2lmaWVyLCBwcmVjaXNpb25GaXhlZCwgcHJlY2lzaW9uUHJlZml4LCBwcmVjaXNpb25Sb3VuZH0gZnJvbSBcImQzLWZvcm1hdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0aWNrRm9ybWF0KHN0YXJ0LCBzdG9wLCBjb3VudCwgc3BlY2lmaWVyKSB7XG4gIHZhciBzdGVwID0gdGlja1N0ZXAoc3RhcnQsIHN0b3AsIGNvdW50KSxcbiAgICAgIHByZWNpc2lvbjtcbiAgc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllciA9PSBudWxsID8gXCIsZlwiIDogc3BlY2lmaWVyKTtcbiAgc3dpdGNoIChzcGVjaWZpZXIudHlwZSkge1xuICAgIGNhc2UgXCJzXCI6IHtcbiAgICAgIHZhciB2YWx1ZSA9IE1hdGgubWF4KE1hdGguYWJzKHN0YXJ0KSwgTWF0aC5hYnMoc3RvcCkpO1xuICAgICAgaWYgKHNwZWNpZmllci5wcmVjaXNpb24gPT0gbnVsbCAmJiAhaXNOYU4ocHJlY2lzaW9uID0gcHJlY2lzaW9uUHJlZml4KHN0ZXAsIHZhbHVlKSkpIHNwZWNpZmllci5wcmVjaXNpb24gPSBwcmVjaXNpb247XG4gICAgICByZXR1cm4gZm9ybWF0UHJlZml4KHNwZWNpZmllciwgdmFsdWUpO1xuICAgIH1cbiAgICBjYXNlIFwiXCI6XG4gICAgY2FzZSBcImVcIjpcbiAgICBjYXNlIFwiZ1wiOlxuICAgIGNhc2UgXCJwXCI6XG4gICAgY2FzZSBcInJcIjoge1xuICAgICAgaWYgKHNwZWNpZmllci5wcmVjaXNpb24gPT0gbnVsbCAmJiAhaXNOYU4ocHJlY2lzaW9uID0gcHJlY2lzaW9uUm91bmQoc3RlcCwgTWF0aC5tYXgoTWF0aC5hYnMoc3RhcnQpLCBNYXRoLmFicyhzdG9wKSkpKSkgc3BlY2lmaWVyLnByZWNpc2lvbiA9IHByZWNpc2lvbiAtIChzcGVjaWZpZXIudHlwZSA9PT0gXCJlXCIpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgXCJmXCI6XG4gICAgY2FzZSBcIiVcIjoge1xuICAgICAgaWYgKHNwZWNpZmllci5wcmVjaXNpb24gPT0gbnVsbCAmJiAhaXNOYU4ocHJlY2lzaW9uID0gcHJlY2lzaW9uRml4ZWQoc3RlcCkpKSBzcGVjaWZpZXIucHJlY2lzaW9uID0gcHJlY2lzaW9uIC0gKHNwZWNpZmllci50eXBlID09PSBcIiVcIikgKiAyO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBmb3JtYXQoc3BlY2lmaWVyKTtcbn1cbiIsICJpbXBvcnQge3RpY2tzLCB0aWNrSW5jcmVtZW50fSBmcm9tIFwiZDMtYXJyYXlcIjtcbmltcG9ydCBjb250aW51b3VzLCB7Y29weX0gZnJvbSBcIi4vY29udGludW91cy5qc1wiO1xuaW1wb3J0IHtpbml0UmFuZ2V9IGZyb20gXCIuL2luaXQuanNcIjtcbmltcG9ydCB0aWNrRm9ybWF0IGZyb20gXCIuL3RpY2tGb3JtYXQuanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGxpbmVhcmlzaChzY2FsZSkge1xuICB2YXIgZG9tYWluID0gc2NhbGUuZG9tYWluO1xuXG4gIHNjYWxlLnRpY2tzID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICB2YXIgZCA9IGRvbWFpbigpO1xuICAgIHJldHVybiB0aWNrcyhkWzBdLCBkW2QubGVuZ3RoIC0gMV0sIGNvdW50ID09IG51bGwgPyAxMCA6IGNvdW50KTtcbiAgfTtcblxuICBzY2FsZS50aWNrRm9ybWF0ID0gZnVuY3Rpb24oY291bnQsIHNwZWNpZmllcikge1xuICAgIHZhciBkID0gZG9tYWluKCk7XG4gICAgcmV0dXJuIHRpY2tGb3JtYXQoZFswXSwgZFtkLmxlbmd0aCAtIDFdLCBjb3VudCA9PSBudWxsID8gMTAgOiBjb3VudCwgc3BlY2lmaWVyKTtcbiAgfTtcblxuICBzY2FsZS5uaWNlID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICBpZiAoY291bnQgPT0gbnVsbCkgY291bnQgPSAxMDtcblxuICAgIHZhciBkID0gZG9tYWluKCk7XG4gICAgdmFyIGkwID0gMDtcbiAgICB2YXIgaTEgPSBkLmxlbmd0aCAtIDE7XG4gICAgdmFyIHN0YXJ0ID0gZFtpMF07XG4gICAgdmFyIHN0b3AgPSBkW2kxXTtcbiAgICB2YXIgcHJlc3RlcDtcbiAgICB2YXIgc3RlcDtcbiAgICB2YXIgbWF4SXRlciA9IDEwO1xuXG4gICAgaWYgKHN0b3AgPCBzdGFydCkge1xuICAgICAgc3RlcCA9IHN0YXJ0LCBzdGFydCA9IHN0b3AsIHN0b3AgPSBzdGVwO1xuICAgICAgc3RlcCA9IGkwLCBpMCA9IGkxLCBpMSA9IHN0ZXA7XG4gICAgfVxuICAgIFxuICAgIHdoaWxlIChtYXhJdGVyLS0gPiAwKSB7XG4gICAgICBzdGVwID0gdGlja0luY3JlbWVudChzdGFydCwgc3RvcCwgY291bnQpO1xuICAgICAgaWYgKHN0ZXAgPT09IHByZXN0ZXApIHtcbiAgICAgICAgZFtpMF0gPSBzdGFydFxuICAgICAgICBkW2kxXSA9IHN0b3BcbiAgICAgICAgcmV0dXJuIGRvbWFpbihkKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RlcCA+IDApIHtcbiAgICAgICAgc3RhcnQgPSBNYXRoLmZsb29yKHN0YXJ0IC8gc3RlcCkgKiBzdGVwO1xuICAgICAgICBzdG9wID0gTWF0aC5jZWlsKHN0b3AgLyBzdGVwKSAqIHN0ZXA7XG4gICAgICB9IGVsc2UgaWYgKHN0ZXAgPCAwKSB7XG4gICAgICAgIHN0YXJ0ID0gTWF0aC5jZWlsKHN0YXJ0ICogc3RlcCkgLyBzdGVwO1xuICAgICAgICBzdG9wID0gTWF0aC5mbG9vcihzdG9wICogc3RlcCkgLyBzdGVwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBwcmVzdGVwID0gc3RlcDtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NhbGU7XG4gIH07XG5cbiAgcmV0dXJuIHNjYWxlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsaW5lYXIoKSB7XG4gIHZhciBzY2FsZSA9IGNvbnRpbnVvdXMoKTtcblxuICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNvcHkoc2NhbGUsIGxpbmVhcigpKTtcbiAgfTtcblxuICBpbml0UmFuZ2UuYXBwbHkoc2NhbGUsIGFyZ3VtZW50cyk7XG5cbiAgcmV0dXJuIGxpbmVhcmlzaChzY2FsZSk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc3BlY2lmaWVyKSB7XG4gIHZhciBuID0gc3BlY2lmaWVyLmxlbmd0aCAvIDYgfCAwLCBjb2xvcnMgPSBuZXcgQXJyYXkobiksIGkgPSAwO1xuICB3aGlsZSAoaSA8IG4pIGNvbG9yc1tpXSA9IFwiI1wiICsgc3BlY2lmaWVyLnNsaWNlKGkgKiA2LCArK2kgKiA2KTtcbiAgcmV0dXJuIGNvbG9ycztcbn1cbiIsICJpbXBvcnQgY29sb3JzIGZyb20gXCIuLi9jb2xvcnMuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY29sb3JzKFwiNGU3OWE3ZjI4ZTJjZTE1NzU5NzZiN2IyNTlhMTRmZWRjOTQ5YWY3YWExZmY5ZGE3OWM3NTVmYmFiMGFiXCIpO1xuIiwgImV4cG9ydCB2YXIgeGh0bWwgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBzdmc6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgeGh0bWw6IHhodG1sLFxuICB4bGluazogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsXG4gIHhtbDogXCJodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2VcIixcbiAgeG1sbnM6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy9cIlxufTtcbiIsICJpbXBvcnQgbmFtZXNwYWNlcyBmcm9tIFwiLi9uYW1lc3BhY2VzLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIHByZWZpeCA9IG5hbWUgKz0gXCJcIiwgaSA9IHByZWZpeC5pbmRleE9mKFwiOlwiKTtcbiAgaWYgKGkgPj0gMCAmJiAocHJlZml4ID0gbmFtZS5zbGljZSgwLCBpKSkgIT09IFwieG1sbnNcIikgbmFtZSA9IG5hbWUuc2xpY2UoaSArIDEpO1xuICByZXR1cm4gbmFtZXNwYWNlcy5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpID8ge3NwYWNlOiBuYW1lc3BhY2VzW3ByZWZpeF0sIGxvY2FsOiBuYW1lfSA6IG5hbWU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG59XG4iLCAiaW1wb3J0IG5hbWVzcGFjZSBmcm9tIFwiLi9uYW1lc3BhY2UuanNcIjtcbmltcG9ydCB7eGh0bWx9IGZyb20gXCIuL25hbWVzcGFjZXMuanNcIjtcblxuZnVuY3Rpb24gY3JlYXRvckluaGVyaXQobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50LFxuICAgICAgICB1cmkgPSB0aGlzLm5hbWVzcGFjZVVSSTtcbiAgICByZXR1cm4gdXJpID09PSB4aHRtbCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubmFtZXNwYWNlVVJJID09PSB4aHRtbFxuICAgICAgICA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSlcbiAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModXJpLCBuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRvckZpeGVkKGZ1bGxuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBmdWxsbmFtZSA9IG5hbWVzcGFjZShuYW1lKTtcbiAgcmV0dXJuIChmdWxsbmFtZS5sb2NhbFxuICAgICAgPyBjcmVhdG9yRml4ZWRcbiAgICAgIDogY3JlYXRvckluaGVyaXQpKGZ1bGxuYW1lKTtcbn1cbiIsICJmdW5jdGlvbiBub25lKCkge31cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHNlbGVjdG9yID09IG51bGwgPyBub25lIDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQgc2VsZWN0b3IgZnJvbSBcIi4uL3NlbGVjdG9yLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdCkge1xuICBpZiAodHlwZW9mIHNlbGVjdCAhPT0gXCJmdW5jdGlvblwiKSBzZWxlY3QgPSBzZWxlY3RvcihzZWxlY3QpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc3ViZ3JvdXAgPSBzdWJncm91cHNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIHN1Ym5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKHN1Ym5vZGUgPSBzZWxlY3QuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpKSB7XG4gICAgICAgIGlmIChcIl9fZGF0YV9fXCIgaW4gbm9kZSkgc3Vibm9kZS5fX2RhdGFfXyA9IG5vZGUuX19kYXRhX187XG4gICAgICAgIHN1Ymdyb3VwW2ldID0gc3Vibm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzdWJncm91cHMsIHRoaXMuX3BhcmVudHMpO1xufVxuIiwgIi8vIEdpdmVuIHNvbWV0aGluZyBhcnJheSBsaWtlIChvciBudWxsKSwgcmV0dXJucyBzb21ldGhpbmcgdGhhdCBpcyBzdHJpY3RseSBhblxuLy8gYXJyYXkuIFRoaXMgaXMgdXNlZCB0byBlbnN1cmUgdGhhdCBhcnJheS1saWtlIG9iamVjdHMgcGFzc2VkIHRvIGQzLnNlbGVjdEFsbFxuLy8gb3Igc2VsZWN0aW9uLnNlbGVjdEFsbCBhcmUgY29udmVydGVkIGludG8gcHJvcGVyIGFycmF5cyB3aGVuIGNyZWF0aW5nIGFcbi8vIHNlbGVjdGlvbjsgd2UgZG9uXHUyMDE5dCBldmVyIHdhbnQgdG8gY3JlYXRlIGEgc2VsZWN0aW9uIGJhY2tlZCBieSBhIGxpdmVcbi8vIEhUTUxDb2xsZWN0aW9uIG9yIE5vZGVMaXN0LiBIb3dldmVyLCBub3RlIHRoYXQgc2VsZWN0aW9uLnNlbGVjdEFsbCB3aWxsIHVzZSBhXG4vLyBzdGF0aWMgTm9kZUxpc3QgYXMgYSBncm91cCwgc2luY2UgaXQgc2FmZWx5IGRlcml2ZWQgZnJvbSBxdWVyeVNlbGVjdG9yQWxsLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXJyYXkoeCkge1xuICByZXR1cm4geCA9PSBudWxsID8gW10gOiBBcnJheS5pc0FycmF5KHgpID8geCA6IEFycmF5LmZyb20oeCk7XG59XG4iLCAiZnVuY3Rpb24gZW1wdHkoKSB7XG4gIHJldHVybiBbXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHNlbGVjdG9yID09IG51bGwgPyBlbXB0eSA6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICB9O1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IGFycmF5IGZyb20gXCIuLi9hcnJheS5qc1wiO1xuaW1wb3J0IHNlbGVjdG9yQWxsIGZyb20gXCIuLi9zZWxlY3RvckFsbC5qc1wiO1xuXG5mdW5jdGlvbiBhcnJheUFsbChzZWxlY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBhcnJheShzZWxlY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdCkge1xuICBpZiAodHlwZW9mIHNlbGVjdCA9PT0gXCJmdW5jdGlvblwiKSBzZWxlY3QgPSBhcnJheUFsbChzZWxlY3QpO1xuICBlbHNlIHNlbGVjdCA9IHNlbGVjdG9yQWxsKHNlbGVjdCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gW10sIHBhcmVudHMgPSBbXSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc3ViZ3JvdXBzLnB1c2goc2VsZWN0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKTtcbiAgICAgICAgcGFyZW50cy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgcGFyZW50cyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoZXMoc2VsZWN0b3IpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hpbGRNYXRjaGVyKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUubWF0Y2hlcyhzZWxlY3Rvcik7XG4gIH07XG59XG5cbiIsICJpbXBvcnQge2NoaWxkTWF0Y2hlcn0gZnJvbSBcIi4uL21hdGNoZXIuanNcIjtcblxudmFyIGZpbmQgPSBBcnJheS5wcm90b3R5cGUuZmluZDtcblxuZnVuY3Rpb24gY2hpbGRGaW5kKG1hdGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmluZC5jYWxsKHRoaXMuY2hpbGRyZW4sIG1hdGNoKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2hpbGRGaXJzdCgpIHtcbiAgcmV0dXJuIHRoaXMuZmlyc3RFbGVtZW50Q2hpbGQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1hdGNoKSB7XG4gIHJldHVybiB0aGlzLnNlbGVjdChtYXRjaCA9PSBudWxsID8gY2hpbGRGaXJzdFxuICAgICAgOiBjaGlsZEZpbmQodHlwZW9mIG1hdGNoID09PSBcImZ1bmN0aW9uXCIgPyBtYXRjaCA6IGNoaWxkTWF0Y2hlcihtYXRjaCkpKTtcbn1cbiIsICJpbXBvcnQge2NoaWxkTWF0Y2hlcn0gZnJvbSBcIi4uL21hdGNoZXIuanNcIjtcblxudmFyIGZpbHRlciA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXI7XG5cbmZ1bmN0aW9uIGNoaWxkcmVuKCkge1xuICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmNoaWxkcmVuKTtcbn1cblxuZnVuY3Rpb24gY2hpbGRyZW5GaWx0ZXIobWF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmaWx0ZXIuY2FsbCh0aGlzLmNoaWxkcmVuLCBtYXRjaCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1hdGNoKSB7XG4gIHJldHVybiB0aGlzLnNlbGVjdEFsbChtYXRjaCA9PSBudWxsID8gY2hpbGRyZW5cbiAgICAgIDogY2hpbGRyZW5GaWx0ZXIodHlwZW9mIG1hdGNoID09PSBcImZ1bmN0aW9uXCIgPyBtYXRjaCA6IGNoaWxkTWF0Y2hlcihtYXRjaCkpKTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBtYXRjaGVyIGZyb20gXCIuLi9tYXRjaGVyLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1hdGNoKSB7XG4gIGlmICh0eXBlb2YgbWF0Y2ggIT09IFwiZnVuY3Rpb25cIikgbWF0Y2ggPSBtYXRjaGVyKG1hdGNoKTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHN1Ymdyb3VwID0gc3ViZ3JvdXBzW2pdID0gW10sIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgbWF0Y2guY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzdWJncm91cHMsIHRoaXMuX3BhcmVudHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHVwZGF0ZSkge1xuICByZXR1cm4gbmV3IEFycmF5KHVwZGF0ZS5sZW5ndGgpO1xufVxuIiwgImltcG9ydCBzcGFyc2UgZnJvbSBcIi4vc3BhcnNlLmpzXCI7XG5pbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHRoaXMuX2VudGVyIHx8IHRoaXMuX2dyb3Vwcy5tYXAoc3BhcnNlKSwgdGhpcy5fcGFyZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFbnRlck5vZGUocGFyZW50LCBkYXR1bSkge1xuICB0aGlzLm93bmVyRG9jdW1lbnQgPSBwYXJlbnQub3duZXJEb2N1bWVudDtcbiAgdGhpcy5uYW1lc3BhY2VVUkkgPSBwYXJlbnQubmFtZXNwYWNlVVJJO1xuICB0aGlzLl9uZXh0ID0gbnVsbDtcbiAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICB0aGlzLl9fZGF0YV9fID0gZGF0dW07XG59XG5cbkVudGVyTm9kZS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBFbnRlck5vZGUsXG4gIGFwcGVuZENoaWxkOiBmdW5jdGlvbihjaGlsZCkgeyByZXR1cm4gdGhpcy5fcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgdGhpcy5fbmV4dCk7IH0sXG4gIGluc2VydEJlZm9yZTogZnVuY3Rpb24oY2hpbGQsIG5leHQpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIG5leHQpOyB9LFxuICBxdWVyeVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvcikgeyByZXR1cm4gdGhpcy5fcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpOyB9LFxuICBxdWVyeVNlbGVjdG9yQWxsOiBmdW5jdGlvbihzZWxlY3RvcikgeyByZXR1cm4gdGhpcy5fcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpOyB9XG59O1xuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB4O1xuICB9O1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IHtFbnRlck5vZGV9IGZyb20gXCIuL2VudGVyLmpzXCI7XG5pbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4uL2NvbnN0YW50LmpzXCI7XG5cbmZ1bmN0aW9uIGJpbmRJbmRleChwYXJlbnQsIGdyb3VwLCBlbnRlciwgdXBkYXRlLCBleGl0LCBkYXRhKSB7XG4gIHZhciBpID0gMCxcbiAgICAgIG5vZGUsXG4gICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aDtcblxuICAvLyBQdXQgYW55IG5vbi1udWxsIG5vZGVzIHRoYXQgZml0IGludG8gdXBkYXRlLlxuICAvLyBQdXQgYW55IG51bGwgbm9kZXMgaW50byBlbnRlci5cbiAgLy8gUHV0IGFueSByZW1haW5pbmcgZGF0YSBpbnRvIGVudGVyLlxuICBmb3IgKDsgaSA8IGRhdGFMZW5ndGg7ICsraSkge1xuICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgIG5vZGUuX19kYXRhX18gPSBkYXRhW2ldO1xuICAgICAgdXBkYXRlW2ldID0gbm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50ZXJbaV0gPSBuZXcgRW50ZXJOb2RlKHBhcmVudCwgZGF0YVtpXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gUHV0IGFueSBub24tbnVsbCBub2RlcyB0aGF0IGRvblx1MjAxOXQgZml0IGludG8gZXhpdC5cbiAgZm9yICg7IGkgPCBncm91cExlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGJpbmRLZXkocGFyZW50LCBncm91cCwgZW50ZXIsIHVwZGF0ZSwgZXhpdCwgZGF0YSwga2V5KSB7XG4gIHZhciBpLFxuICAgICAgbm9kZSxcbiAgICAgIG5vZGVCeUtleVZhbHVlID0gbmV3IE1hcCxcbiAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAga2V5VmFsdWVzID0gbmV3IEFycmF5KGdyb3VwTGVuZ3RoKSxcbiAgICAgIGtleVZhbHVlO1xuXG4gIC8vIENvbXB1dGUgdGhlIGtleSBmb3IgZWFjaCBub2RlLlxuICAvLyBJZiBtdWx0aXBsZSBub2RlcyBoYXZlIHRoZSBzYW1lIGtleSwgdGhlIGR1cGxpY2F0ZXMgYXJlIGFkZGVkIHRvIGV4aXQuXG4gIGZvciAoaSA9IDA7IGkgPCBncm91cExlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAga2V5VmFsdWVzW2ldID0ga2V5VmFsdWUgPSBrZXkuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkgKyBcIlwiO1xuICAgICAgaWYgKG5vZGVCeUtleVZhbHVlLmhhcyhrZXlWYWx1ZSkpIHtcbiAgICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlQnlLZXlWYWx1ZS5zZXQoa2V5VmFsdWUsIG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbXB1dGUgdGhlIGtleSBmb3IgZWFjaCBkYXR1bS5cbiAgLy8gSWYgdGhlcmUgYSBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGtleSwgam9pbiBhbmQgYWRkIGl0IHRvIHVwZGF0ZS5cbiAgLy8gSWYgdGhlcmUgaXMgbm90IChvciB0aGUga2V5IGlzIGEgZHVwbGljYXRlKSwgYWRkIGl0IHRvIGVudGVyLlxuICBmb3IgKGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAga2V5VmFsdWUgPSBrZXkuY2FsbChwYXJlbnQsIGRhdGFbaV0sIGksIGRhdGEpICsgXCJcIjtcbiAgICBpZiAobm9kZSA9IG5vZGVCeUtleVZhbHVlLmdldChrZXlWYWx1ZSkpIHtcbiAgICAgIHVwZGF0ZVtpXSA9IG5vZGU7XG4gICAgICBub2RlLl9fZGF0YV9fID0gZGF0YVtpXTtcbiAgICAgIG5vZGVCeUtleVZhbHVlLmRlbGV0ZShrZXlWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudGVyW2ldID0gbmV3IEVudGVyTm9kZShwYXJlbnQsIGRhdGFbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIEFkZCBhbnkgcmVtYWluaW5nIG5vZGVzIHRoYXQgd2VyZSBub3QgYm91bmQgdG8gZGF0YSB0byBleGl0LlxuICBmb3IgKGkgPSAwOyBpIDwgZ3JvdXBMZW5ndGg7ICsraSkge1xuICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiAobm9kZUJ5S2V5VmFsdWUuZ2V0KGtleVZhbHVlc1tpXSkgPT09IG5vZGUpKSB7XG4gICAgICBleGl0W2ldID0gbm9kZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZGF0dW0obm9kZSkge1xuICByZXR1cm4gbm9kZS5fX2RhdGFfXztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBBcnJheS5mcm9tKHRoaXMsIGRhdHVtKTtcblxuICB2YXIgYmluZCA9IGtleSA/IGJpbmRLZXkgOiBiaW5kSW5kZXgsXG4gICAgICBwYXJlbnRzID0gdGhpcy5fcGFyZW50cyxcbiAgICAgIGdyb3VwcyA9IHRoaXMuX2dyb3VwcztcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHZhbHVlID0gY29uc3RhbnQodmFsdWUpO1xuXG4gIGZvciAodmFyIG0gPSBncm91cHMubGVuZ3RoLCB1cGRhdGUgPSBuZXcgQXJyYXkobSksIGVudGVyID0gbmV3IEFycmF5KG0pLCBleGl0ID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIHZhciBwYXJlbnQgPSBwYXJlbnRzW2pdLFxuICAgICAgICBncm91cCA9IGdyb3Vwc1tqXSxcbiAgICAgICAgZ3JvdXBMZW5ndGggPSBncm91cC5sZW5ndGgsXG4gICAgICAgIGRhdGEgPSBhcnJheWxpa2UodmFsdWUuY2FsbChwYXJlbnQsIHBhcmVudCAmJiBwYXJlbnQuX19kYXRhX18sIGosIHBhcmVudHMpKSxcbiAgICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAgICBlbnRlckdyb3VwID0gZW50ZXJbal0gPSBuZXcgQXJyYXkoZGF0YUxlbmd0aCksXG4gICAgICAgIHVwZGF0ZUdyb3VwID0gdXBkYXRlW2pdID0gbmV3IEFycmF5KGRhdGFMZW5ndGgpLFxuICAgICAgICBleGl0R3JvdXAgPSBleGl0W2pdID0gbmV3IEFycmF5KGdyb3VwTGVuZ3RoKTtcblxuICAgIGJpbmQocGFyZW50LCBncm91cCwgZW50ZXJHcm91cCwgdXBkYXRlR3JvdXAsIGV4aXRHcm91cCwgZGF0YSwga2V5KTtcblxuICAgIC8vIE5vdyBjb25uZWN0IHRoZSBlbnRlciBub2RlcyB0byB0aGVpciBmb2xsb3dpbmcgdXBkYXRlIG5vZGUsIHN1Y2ggdGhhdFxuICAgIC8vIGFwcGVuZENoaWxkIGNhbiBpbnNlcnQgdGhlIG1hdGVyaWFsaXplZCBlbnRlciBub2RlIGJlZm9yZSB0aGlzIG5vZGUsXG4gICAgLy8gcmF0aGVyIHRoYW4gYXQgdGhlIGVuZCBvZiB0aGUgcGFyZW50IG5vZGUuXG4gICAgZm9yICh2YXIgaTAgPSAwLCBpMSA9IDAsIHByZXZpb3VzLCBuZXh0OyBpMCA8IGRhdGFMZW5ndGg7ICsraTApIHtcbiAgICAgIGlmIChwcmV2aW91cyA9IGVudGVyR3JvdXBbaTBdKSB7XG4gICAgICAgIGlmIChpMCA+PSBpMSkgaTEgPSBpMCArIDE7XG4gICAgICAgIHdoaWxlICghKG5leHQgPSB1cGRhdGVHcm91cFtpMV0pICYmICsraTEgPCBkYXRhTGVuZ3RoKTtcbiAgICAgICAgcHJldmlvdXMuX25leHQgPSBuZXh0IHx8IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlID0gbmV3IFNlbGVjdGlvbih1cGRhdGUsIHBhcmVudHMpO1xuICB1cGRhdGUuX2VudGVyID0gZW50ZXI7XG4gIHVwZGF0ZS5fZXhpdCA9IGV4aXQ7XG4gIHJldHVybiB1cGRhdGU7XG59XG5cbi8vIEdpdmVuIHNvbWUgZGF0YSwgdGhpcyByZXR1cm5zIGFuIGFycmF5LWxpa2UgdmlldyBvZiBpdDogYW4gb2JqZWN0IHRoYXRcbi8vIGV4cG9zZXMgYSBsZW5ndGggcHJvcGVydHkgYW5kIGFsbG93cyBudW1lcmljIGluZGV4aW5nLiBOb3RlIHRoYXQgdW5saWtlXG4vLyBzZWxlY3RBbGwsIHRoaXMgaXNuXHUyMDE5dCB3b3JyaWVkIGFib3V0IFx1MjAxQ2xpdmVcdTIwMUQgY29sbGVjdGlvbnMgYmVjYXVzZSB0aGUgcmVzdWx0aW5nXG4vLyBhcnJheSB3aWxsIG9ubHkgYmUgdXNlZCBicmllZmx5IHdoaWxlIGRhdGEgaXMgYmVpbmcgYm91bmQuIChJdCBpcyBwb3NzaWJsZSB0b1xuLy8gY2F1c2UgdGhlIGRhdGEgdG8gY2hhbmdlIHdoaWxlIGl0ZXJhdGluZyBieSB1c2luZyBhIGtleSBmdW5jdGlvbiwgYnV0IHBsZWFzZVxuLy8gZG9uXHUyMDE5dDsgd2VcdTIwMTlkIHJhdGhlciBhdm9pZCBhIGdyYXR1aXRvdXMgY29weS4pXG5mdW5jdGlvbiBhcnJheWxpa2UoZGF0YSkge1xuICByZXR1cm4gdHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgJiYgXCJsZW5ndGhcIiBpbiBkYXRhXG4gICAgPyBkYXRhIC8vIEFycmF5LCBUeXBlZEFycmF5LCBOb2RlTGlzdCwgYXJyYXktbGlrZVxuICAgIDogQXJyYXkuZnJvbShkYXRhKTsgLy8gTWFwLCBTZXQsIGl0ZXJhYmxlLCBzdHJpbmcsIG9yIGFueXRoaW5nIGVsc2Vcbn1cbiIsICJpbXBvcnQgc3BhcnNlIGZyb20gXCIuL3NwYXJzZS5qc1wiO1xuaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbih0aGlzLl9leGl0IHx8IHRoaXMuX2dyb3Vwcy5tYXAoc3BhcnNlKSwgdGhpcy5fcGFyZW50cyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob25lbnRlciwgb251cGRhdGUsIG9uZXhpdCkge1xuICB2YXIgZW50ZXIgPSB0aGlzLmVudGVyKCksIHVwZGF0ZSA9IHRoaXMsIGV4aXQgPSB0aGlzLmV4aXQoKTtcbiAgaWYgKHR5cGVvZiBvbmVudGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBlbnRlciA9IG9uZW50ZXIoZW50ZXIpO1xuICAgIGlmIChlbnRlcikgZW50ZXIgPSBlbnRlci5zZWxlY3Rpb24oKTtcbiAgfSBlbHNlIHtcbiAgICBlbnRlciA9IGVudGVyLmFwcGVuZChvbmVudGVyICsgXCJcIik7XG4gIH1cbiAgaWYgKG9udXBkYXRlICE9IG51bGwpIHtcbiAgICB1cGRhdGUgPSBvbnVwZGF0ZSh1cGRhdGUpO1xuICAgIGlmICh1cGRhdGUpIHVwZGF0ZSA9IHVwZGF0ZS5zZWxlY3Rpb24oKTtcbiAgfVxuICBpZiAob25leGl0ID09IG51bGwpIGV4aXQucmVtb3ZlKCk7IGVsc2Ugb25leGl0KGV4aXQpO1xuICByZXR1cm4gZW50ZXIgJiYgdXBkYXRlID8gZW50ZXIubWVyZ2UodXBkYXRlKS5vcmRlcigpIDogdXBkYXRlO1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb250ZXh0KSB7XG4gIHZhciBzZWxlY3Rpb24gPSBjb250ZXh0LnNlbGVjdGlvbiA/IGNvbnRleHQuc2VsZWN0aW9uKCkgOiBjb250ZXh0O1xuXG4gIGZvciAodmFyIGdyb3VwczAgPSB0aGlzLl9ncm91cHMsIGdyb3VwczEgPSBzZWxlY3Rpb24uX2dyb3VwcywgbTAgPSBncm91cHMwLmxlbmd0aCwgbTEgPSBncm91cHMxLmxlbmd0aCwgbSA9IE1hdGgubWluKG0wLCBtMSksIG1lcmdlcyA9IG5ldyBBcnJheShtMCksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAwID0gZ3JvdXBzMFtqXSwgZ3JvdXAxID0gZ3JvdXBzMVtqXSwgbiA9IGdyb3VwMC5sZW5ndGgsIG1lcmdlID0gbWVyZ2VzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cDBbaV0gfHwgZ3JvdXAxW2ldKSB7XG4gICAgICAgIG1lcmdlW2ldID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKDsgaiA8IG0wOyArK2opIHtcbiAgICBtZXJnZXNbal0gPSBncm91cHMwW2pdO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24obWVyZ2VzLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAtMSwgbSA9IGdyb3Vwcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSBncm91cC5sZW5ndGggLSAxLCBuZXh0ID0gZ3JvdXBbaV0sIG5vZGU7IC0taSA+PSAwOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBpZiAobmV4dCAmJiBub2RlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG5leHQpIF4gNCkgbmV4dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBuZXh0KTtcbiAgICAgICAgbmV4dCA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbXBhcmUpIHtcbiAgaWYgKCFjb21wYXJlKSBjb21wYXJlID0gYXNjZW5kaW5nO1xuXG4gIGZ1bmN0aW9uIGNvbXBhcmVOb2RlKGEsIGIpIHtcbiAgICByZXR1cm4gYSAmJiBiID8gY29tcGFyZShhLl9fZGF0YV9fLCBiLl9fZGF0YV9fKSA6ICFhIC0gIWI7XG4gIH1cblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzb3J0Z3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzb3J0Z3JvdXAgPSBzb3J0Z3JvdXBzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzb3J0Z3JvdXBbaV0gPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgICBzb3J0Z3JvdXAuc29ydChjb21wYXJlTm9kZSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzb3J0Z3JvdXBzLCB0aGlzLl9wYXJlbnRzKS5vcmRlcigpO1xufVxuXG5mdW5jdGlvbiBhc2NlbmRpbmcoYSwgYikge1xuICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IGEgPj0gYiA/IDAgOiBOYU47XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1swXTtcbiAgYXJndW1lbnRzWzBdID0gdGhpcztcbiAgY2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKHRoaXMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICB2YXIgbm9kZSA9IGdyb3VwW2ldO1xuICAgICAgaWYgKG5vZGUpIHJldHVybiBub2RlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBsZXQgc2l6ZSA9IDA7XG4gIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzKSArK3NpemU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgcmV0dXJuIHNpemU7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhdGhpcy5ub2RlKCk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2FsbGJhY2spIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZTsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgY2FsbGJhY2suY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiaW1wb3J0IG5hbWVzcGFjZSBmcm9tIFwiLi4vbmFtZXNwYWNlLmpzXCI7XG5cbmZ1bmN0aW9uIGF0dHJSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJSZW1vdmVOUyhmdWxsbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyQ29uc3RhbnQobmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckNvbnN0YW50TlMoZnVsbG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCwgdmFsdWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyRnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHYpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyRnVuY3Rpb25OUyhmdWxsbmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCwgdik7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBmdWxsbmFtZSA9IG5hbWVzcGFjZShuYW1lKTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgIHJldHVybiBmdWxsbmFtZS5sb2NhbFxuICAgICAgICA/IG5vZGUuZ2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKVxuICAgICAgICA6IG5vZGUuZ2V0QXR0cmlidXRlKGZ1bGxuYW1lKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgID8gKGZ1bGxuYW1lLmxvY2FsID8gYXR0clJlbW92ZU5TIDogYXR0clJlbW92ZSkgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gKGZ1bGxuYW1lLmxvY2FsID8gYXR0ckZ1bmN0aW9uTlMgOiBhdHRyRnVuY3Rpb24pXG4gICAgICA6IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJDb25zdGFudE5TIDogYXR0ckNvbnN0YW50KSkpKGZ1bGxuYW1lLCB2YWx1ZSkpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5vZGUpIHtcbiAgcmV0dXJuIChub2RlLm93bmVyRG9jdW1lbnQgJiYgbm9kZS5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3KSAvLyBub2RlIGlzIGEgTm9kZVxuICAgICAgfHwgKG5vZGUuZG9jdW1lbnQgJiYgbm9kZSkgLy8gbm9kZSBpcyBhIFdpbmRvd1xuICAgICAgfHwgbm9kZS5kZWZhdWx0VmlldzsgLy8gbm9kZSBpcyBhIERvY3VtZW50XG59XG4iLCAiaW1wb3J0IGRlZmF1bHRWaWV3IGZyb20gXCIuLi93aW5kb3cuanNcIjtcblxuZnVuY3Rpb24gc3R5bGVSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3R5bGVDb25zdGFudChuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdmFsdWUsIHByaW9yaXR5KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3R5bGVGdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2LCBwcmlvcml0eSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDFcbiAgICAgID8gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/IHN0eWxlUmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgID8gc3R5bGVGdW5jdGlvblxuICAgICAgICAgICAgOiBzdHlsZUNvbnN0YW50KShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkgPT0gbnVsbCA/IFwiXCIgOiBwcmlvcml0eSkpXG4gICAgICA6IHN0eWxlVmFsdWUodGhpcy5ub2RlKCksIG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3R5bGVWYWx1ZShub2RlLCBuYW1lKSB7XG4gIHJldHVybiBub2RlLnN0eWxlLmdldFByb3BlcnR5VmFsdWUobmFtZSlcbiAgICAgIHx8IGRlZmF1bHRWaWV3KG5vZGUpLmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKTtcbn1cbiIsICJmdW5jdGlvbiBwcm9wZXJ0eVJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBkZWxldGUgdGhpc1tuYW1lXTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlDb25zdGFudChuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpc1tuYW1lXSA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgZWxzZSB0aGlzW25hbWVdID0gdjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAxXG4gICAgICA/IHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbFxuICAgICAgICAgID8gcHJvcGVydHlSZW1vdmUgOiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gcHJvcGVydHlGdW5jdGlvblxuICAgICAgICAgIDogcHJvcGVydHlDb25zdGFudCkobmFtZSwgdmFsdWUpKVxuICAgICAgOiB0aGlzLm5vZGUoKVtuYW1lXTtcbn1cbiIsICJmdW5jdGlvbiBjbGFzc0FycmF5KHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnRyaW0oKS5zcGxpdCgvXnxcXHMrLyk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzTGlzdChub2RlKSB7XG4gIHJldHVybiBub2RlLmNsYXNzTGlzdCB8fCBuZXcgQ2xhc3NMaXN0KG5vZGUpO1xufVxuXG5mdW5jdGlvbiBDbGFzc0xpc3Qobm9kZSkge1xuICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgdGhpcy5fbmFtZXMgPSBjbGFzc0FycmF5KG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIik7XG59XG5cbkNsYXNzTGlzdC5wcm90b3R5cGUgPSB7XG4gIGFkZDogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpID0gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKTtcbiAgICBpZiAoaSA8IDApIHtcbiAgICAgIHRoaXMuX25hbWVzLnB1c2gobmFtZSk7XG4gICAgICB0aGlzLl9ub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMuX25hbWVzLmpvaW4oXCIgXCIpKTtcbiAgICB9XG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpID0gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKTtcbiAgICBpZiAoaSA+PSAwKSB7XG4gICAgICB0aGlzLl9uYW1lcy5zcGxpY2UoaSwgMSk7XG4gICAgICB0aGlzLl9ub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMuX25hbWVzLmpvaW4oXCIgXCIpKTtcbiAgICB9XG4gIH0sXG4gIGNvbnRhaW5zOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSkgPj0gMDtcbiAgfVxufTtcblxuZnVuY3Rpb24gY2xhc3NlZEFkZChub2RlLCBuYW1lcykge1xuICB2YXIgbGlzdCA9IGNsYXNzTGlzdChub2RlKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgbGlzdC5hZGQobmFtZXNbaV0pO1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkUmVtb3ZlKG5vZGUsIG5hbWVzKSB7XG4gIHZhciBsaXN0ID0gY2xhc3NMaXN0KG5vZGUpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gIHdoaWxlICgrK2kgPCBuKSBsaXN0LnJlbW92ZShuYW1lc1tpXSk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRUcnVlKG5hbWVzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjbGFzc2VkQWRkKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZEZhbHNlKG5hbWVzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjbGFzc2VkUmVtb3ZlKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZEZ1bmN0aW9uKG5hbWVzLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgKHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgPyBjbGFzc2VkQWRkIDogY2xhc3NlZFJlbW92ZSkodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgbmFtZXMgPSBjbGFzc0FycmF5KG5hbWUgKyBcIlwiKTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgbGlzdCA9IGNsYXNzTGlzdCh0aGlzLm5vZGUoKSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFsaXN0LmNvbnRhaW5zKG5hbWVzW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuZWFjaCgodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gY2xhc3NlZEZ1bmN0aW9uIDogdmFsdWVcbiAgICAgID8gY2xhc3NlZFRydWVcbiAgICAgIDogY2xhc3NlZEZhbHNlKShuYW1lcywgdmFsdWUpKTtcbn1cbiIsICJmdW5jdGlvbiB0ZXh0UmVtb3ZlKCkge1xuICB0aGlzLnRleHRDb250ZW50ID0gXCJcIjtcbn1cblxuZnVuY3Rpb24gdGV4dENvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRleHRGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IHRleHRSZW1vdmUgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IHRleHRGdW5jdGlvblxuICAgICAgICAgIDogdGV4dENvbnN0YW50KSh2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpLnRleHRDb250ZW50O1xufVxuIiwgImZ1bmN0aW9uIGh0bWxSZW1vdmUoKSB7XG4gIHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcbn1cblxuZnVuY3Rpb24gaHRtbENvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlubmVySFRNTCA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBodG1sRnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmlubmVySFRNTCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godmFsdWUgPT0gbnVsbFxuICAgICAgICAgID8gaHRtbFJlbW92ZSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gaHRtbEZ1bmN0aW9uXG4gICAgICAgICAgOiBodG1sQ29uc3RhbnQpKHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKCkuaW5uZXJIVE1MO1xufVxuIiwgImZ1bmN0aW9uIHJhaXNlKCkge1xuICBpZiAodGhpcy5uZXh0U2libGluZykgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHRoaXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChyYWlzZSk7XG59XG4iLCAiZnVuY3Rpb24gbG93ZXIoKSB7XG4gIGlmICh0aGlzLnByZXZpb3VzU2libGluZykgdGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLCB0aGlzLnBhcmVudE5vZGUuZmlyc3RDaGlsZCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKGxvd2VyKTtcbn1cbiIsICJpbXBvcnQgY3JlYXRvciBmcm9tIFwiLi4vY3JlYXRvci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBjcmVhdGUgPSB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZSA6IGNyZWF0b3IobmFtZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBlbmRDaGlsZChjcmVhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH0pO1xufVxuIiwgImltcG9ydCBjcmVhdG9yIGZyb20gXCIuLi9jcmVhdG9yLmpzXCI7XG5pbXBvcnQgc2VsZWN0b3IgZnJvbSBcIi4uL3NlbGVjdG9yLmpzXCI7XG5cbmZ1bmN0aW9uIGNvbnN0YW50TnVsbCgpIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIGJlZm9yZSkge1xuICB2YXIgY3JlYXRlID0gdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiA/IG5hbWUgOiBjcmVhdG9yKG5hbWUpLFxuICAgICAgc2VsZWN0ID0gYmVmb3JlID09IG51bGwgPyBjb25zdGFudE51bGwgOiB0eXBlb2YgYmVmb3JlID09PSBcImZ1bmN0aW9uXCIgPyBiZWZvcmUgOiBzZWxlY3RvcihiZWZvcmUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKGNyZWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBzZWxlY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCBudWxsKTtcbiAgfSk7XG59XG4iLCAiZnVuY3Rpb24gcmVtb3ZlKCkge1xuICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICBpZiAocGFyZW50KSBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKHJlbW92ZSk7XG59XG4iLCAiZnVuY3Rpb24gc2VsZWN0aW9uX2Nsb25lU2hhbGxvdygpIHtcbiAgdmFyIGNsb25lID0gdGhpcy5jbG9uZU5vZGUoZmFsc2UpLCBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNsb25lLCB0aGlzLm5leHRTaWJsaW5nKSA6IGNsb25lO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25fY2xvbmVEZWVwKCkge1xuICB2YXIgY2xvbmUgPSB0aGlzLmNsb25lTm9kZSh0cnVlKSwgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICByZXR1cm4gcGFyZW50ID8gcGFyZW50Lmluc2VydEJlZm9yZShjbG9uZSwgdGhpcy5uZXh0U2libGluZykgOiBjbG9uZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZGVlcCkge1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZGVlcCA/IHNlbGVjdGlvbl9jbG9uZURlZXAgOiBzZWxlY3Rpb25fY2xvbmVTaGFsbG93KTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIiwgdmFsdWUpXG4gICAgICA6IHRoaXMubm9kZSgpLl9fZGF0YV9fO1xufVxuIiwgImZ1bmN0aW9uIGNvbnRleHRMaXN0ZW5lcihsaXN0ZW5lcikge1xuICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIGV2ZW50LCB0aGlzLl9fZGF0YV9fKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2VUeXBlbmFtZXModHlwZW5hbWVzKSB7XG4gIHJldHVybiB0eXBlbmFtZXMudHJpbSgpLnNwbGl0KC9efFxccysvKS5tYXAoZnVuY3Rpb24odCkge1xuICAgIHZhciBuYW1lID0gXCJcIiwgaSA9IHQuaW5kZXhPZihcIi5cIik7XG4gICAgaWYgKGkgPj0gMCkgbmFtZSA9IHQuc2xpY2UoaSArIDEpLCB0ID0gdC5zbGljZSgwLCBpKTtcbiAgICByZXR1cm4ge3R5cGU6IHQsIG5hbWU6IG5hbWV9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gb25SZW1vdmUodHlwZW5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBvbiA9IHRoaXMuX19vbjtcbiAgICBpZiAoIW9uKSByZXR1cm47XG4gICAgZm9yICh2YXIgaiA9IDAsIGkgPSAtMSwgbSA9IG9uLmxlbmd0aCwgbzsgaiA8IG07ICsraikge1xuICAgICAgaWYgKG8gPSBvbltqXSwgKCF0eXBlbmFtZS50eXBlIHx8IG8udHlwZSA9PT0gdHlwZW5hbWUudHlwZSkgJiYgby5uYW1lID09PSB0eXBlbmFtZS5uYW1lKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihvLnR5cGUsIG8ubGlzdGVuZXIsIG8ub3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvblsrK2ldID0gbztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCsraSkgb24ubGVuZ3RoID0gaTtcbiAgICBlbHNlIGRlbGV0ZSB0aGlzLl9fb247XG4gIH07XG59XG5cbmZ1bmN0aW9uIG9uQWRkKHR5cGVuYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9uID0gdGhpcy5fX29uLCBvLCBsaXN0ZW5lciA9IGNvbnRleHRMaXN0ZW5lcih2YWx1ZSk7XG4gICAgaWYgKG9uKSBmb3IgKHZhciBqID0gMCwgbSA9IG9uLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgICAgaWYgKChvID0gb25bal0pLnR5cGUgPT09IHR5cGVuYW1lLnR5cGUgJiYgby5uYW1lID09PSB0eXBlbmFtZS5uYW1lKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihvLnR5cGUsIG8ubGlzdGVuZXIsIG8ub3B0aW9ucyk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihvLnR5cGUsIG8ubGlzdGVuZXIgPSBsaXN0ZW5lciwgby5vcHRpb25zID0gb3B0aW9ucyk7XG4gICAgICAgIG8udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodHlwZW5hbWUudHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuICAgIG8gPSB7dHlwZTogdHlwZW5hbWUudHlwZSwgbmFtZTogdHlwZW5hbWUubmFtZSwgdmFsdWU6IHZhbHVlLCBsaXN0ZW5lcjogbGlzdGVuZXIsIG9wdGlvbnM6IG9wdGlvbnN9O1xuICAgIGlmICghb24pIHRoaXMuX19vbiA9IFtvXTtcbiAgICBlbHNlIG9uLnB1c2gobyk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHR5cGVuYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgdHlwZW5hbWVzID0gcGFyc2VUeXBlbmFtZXModHlwZW5hbWUgKyBcIlwiKSwgaSwgbiA9IHR5cGVuYW1lcy5sZW5ndGgsIHQ7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIG9uID0gdGhpcy5ub2RlKCkuX19vbjtcbiAgICBpZiAob24pIGZvciAodmFyIGogPSAwLCBtID0gb24ubGVuZ3RoLCBvOyBqIDwgbTsgKytqKSB7XG4gICAgICBmb3IgKGkgPSAwLCBvID0gb25bal07IGkgPCBuOyArK2kpIHtcbiAgICAgICAgaWYgKCh0ID0gdHlwZW5hbWVzW2ldKS50eXBlID09PSBvLnR5cGUgJiYgdC5uYW1lID09PSBvLm5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gby52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBvbiA9IHZhbHVlID8gb25BZGQgOiBvblJlbW92ZTtcbiAgZm9yIChpID0gMDsgaSA8IG47ICsraSkgdGhpcy5lYWNoKG9uKHR5cGVuYW1lc1tpXSwgdmFsdWUsIG9wdGlvbnMpKTtcbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiaW1wb3J0IGRlZmF1bHRWaWV3IGZyb20gXCIuLi93aW5kb3cuanNcIjtcblxuZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChub2RlLCB0eXBlLCBwYXJhbXMpIHtcbiAgdmFyIHdpbmRvdyA9IGRlZmF1bHRWaWV3KG5vZGUpLFxuICAgICAgZXZlbnQgPSB3aW5kb3cuQ3VzdG9tRXZlbnQ7XG5cbiAgaWYgKHR5cGVvZiBldmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZXZlbnQgPSBuZXcgZXZlbnQodHlwZSwgcGFyYW1zKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudCA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFdmVudChcIkV2ZW50XCIpO1xuICAgIGlmIChwYXJhbXMpIGV2ZW50LmluaXRFdmVudCh0eXBlLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUpLCBldmVudC5kZXRhaWwgPSBwYXJhbXMuZGV0YWlsO1xuICAgIGVsc2UgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSk7XG4gIH1cblxuICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaENvbnN0YW50KHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoRXZlbnQodGhpcywgdHlwZSwgcGFyYW1zKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hGdW5jdGlvbih0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkaXNwYXRjaEV2ZW50KHRoaXMsIHR5cGUsIHBhcmFtcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiB0aGlzLmVhY2goKHR5cGVvZiBwYXJhbXMgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBkaXNwYXRjaEZ1bmN0aW9uXG4gICAgICA6IGRpc3BhdGNoQ29uc3RhbnQpKHR5cGUsIHBhcmFtcykpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKigpIHtcbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGgsIG5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHlpZWxkIG5vZGU7XG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3QgZnJvbSBcIi4vc2VsZWN0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NlbGVjdEFsbCBmcm9tIFwiLi9zZWxlY3RBbGwuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2VsZWN0Q2hpbGQgZnJvbSBcIi4vc2VsZWN0Q2hpbGQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2VsZWN0Q2hpbGRyZW4gZnJvbSBcIi4vc2VsZWN0Q2hpbGRyZW4uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZmlsdGVyIGZyb20gXCIuL2ZpbHRlci5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9kYXRhIGZyb20gXCIuL2RhdGEuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZW50ZXIgZnJvbSBcIi4vZW50ZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZXhpdCBmcm9tIFwiLi9leGl0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2pvaW4gZnJvbSBcIi4vam9pbi5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9tZXJnZSBmcm9tIFwiLi9tZXJnZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9vcmRlciBmcm9tIFwiLi9vcmRlci5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zb3J0IGZyb20gXCIuL3NvcnQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fY2FsbCBmcm9tIFwiLi9jYWxsLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX25vZGVzIGZyb20gXCIuL25vZGVzLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX25vZGUgZnJvbSBcIi4vbm9kZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zaXplIGZyb20gXCIuL3NpemUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZW1wdHkgZnJvbSBcIi4vZW1wdHkuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZWFjaCBmcm9tIFwiLi9lYWNoLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2F0dHIgZnJvbSBcIi4vYXR0ci5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zdHlsZSBmcm9tIFwiLi9zdHlsZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9wcm9wZXJ0eSBmcm9tIFwiLi9wcm9wZXJ0eS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9jbGFzc2VkIGZyb20gXCIuL2NsYXNzZWQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fdGV4dCBmcm9tIFwiLi90ZXh0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2h0bWwgZnJvbSBcIi4vaHRtbC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9yYWlzZSBmcm9tIFwiLi9yYWlzZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9sb3dlciBmcm9tIFwiLi9sb3dlci5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9hcHBlbmQgZnJvbSBcIi4vYXBwZW5kLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2luc2VydCBmcm9tIFwiLi9pbnNlcnQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fcmVtb3ZlIGZyb20gXCIuL3JlbW92ZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9jbG9uZSBmcm9tIFwiLi9jbG9uZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9kYXR1bSBmcm9tIFwiLi9kYXR1bS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9vbiBmcm9tIFwiLi9vbi5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9kaXNwYXRjaCBmcm9tIFwiLi9kaXNwYXRjaC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9pdGVyYXRvciBmcm9tIFwiLi9pdGVyYXRvci5qc1wiO1xuXG5leHBvcnQgdmFyIHJvb3QgPSBbbnVsbF07XG5cbmV4cG9ydCBmdW5jdGlvbiBTZWxlY3Rpb24oZ3JvdXBzLCBwYXJlbnRzKSB7XG4gIHRoaXMuX2dyb3VwcyA9IGdyb3VwcztcbiAgdGhpcy5fcGFyZW50cyA9IHBhcmVudHM7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oW1tkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRdXSwgcm9vdCk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9zZWxlY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzO1xufVxuXG5TZWxlY3Rpb24ucHJvdG90eXBlID0gc2VsZWN0aW9uLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFNlbGVjdGlvbixcbiAgc2VsZWN0OiBzZWxlY3Rpb25fc2VsZWN0LFxuICBzZWxlY3RBbGw6IHNlbGVjdGlvbl9zZWxlY3RBbGwsXG4gIHNlbGVjdENoaWxkOiBzZWxlY3Rpb25fc2VsZWN0Q2hpbGQsXG4gIHNlbGVjdENoaWxkcmVuOiBzZWxlY3Rpb25fc2VsZWN0Q2hpbGRyZW4sXG4gIGZpbHRlcjogc2VsZWN0aW9uX2ZpbHRlcixcbiAgZGF0YTogc2VsZWN0aW9uX2RhdGEsXG4gIGVudGVyOiBzZWxlY3Rpb25fZW50ZXIsXG4gIGV4aXQ6IHNlbGVjdGlvbl9leGl0LFxuICBqb2luOiBzZWxlY3Rpb25fam9pbixcbiAgbWVyZ2U6IHNlbGVjdGlvbl9tZXJnZSxcbiAgc2VsZWN0aW9uOiBzZWxlY3Rpb25fc2VsZWN0aW9uLFxuICBvcmRlcjogc2VsZWN0aW9uX29yZGVyLFxuICBzb3J0OiBzZWxlY3Rpb25fc29ydCxcbiAgY2FsbDogc2VsZWN0aW9uX2NhbGwsXG4gIG5vZGVzOiBzZWxlY3Rpb25fbm9kZXMsXG4gIG5vZGU6IHNlbGVjdGlvbl9ub2RlLFxuICBzaXplOiBzZWxlY3Rpb25fc2l6ZSxcbiAgZW1wdHk6IHNlbGVjdGlvbl9lbXB0eSxcbiAgZWFjaDogc2VsZWN0aW9uX2VhY2gsXG4gIGF0dHI6IHNlbGVjdGlvbl9hdHRyLFxuICBzdHlsZTogc2VsZWN0aW9uX3N0eWxlLFxuICBwcm9wZXJ0eTogc2VsZWN0aW9uX3Byb3BlcnR5LFxuICBjbGFzc2VkOiBzZWxlY3Rpb25fY2xhc3NlZCxcbiAgdGV4dDogc2VsZWN0aW9uX3RleHQsXG4gIGh0bWw6IHNlbGVjdGlvbl9odG1sLFxuICByYWlzZTogc2VsZWN0aW9uX3JhaXNlLFxuICBsb3dlcjogc2VsZWN0aW9uX2xvd2VyLFxuICBhcHBlbmQ6IHNlbGVjdGlvbl9hcHBlbmQsXG4gIGluc2VydDogc2VsZWN0aW9uX2luc2VydCxcbiAgcmVtb3ZlOiBzZWxlY3Rpb25fcmVtb3ZlLFxuICBjbG9uZTogc2VsZWN0aW9uX2Nsb25lLFxuICBkYXR1bTogc2VsZWN0aW9uX2RhdHVtLFxuICBvbjogc2VsZWN0aW9uX29uLFxuICBkaXNwYXRjaDogc2VsZWN0aW9uX2Rpc3BhdGNoLFxuICBbU3ltYm9sLml0ZXJhdG9yXTogc2VsZWN0aW9uX2l0ZXJhdG9yXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZWxlY3Rpb247XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb24sIHJvb3R9IGZyb20gXCIuL3NlbGVjdGlvbi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiXG4gICAgICA/IG5ldyBTZWxlY3Rpb24oW1tkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKV1dLCBbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XSlcbiAgICAgIDogbmV3IFNlbGVjdGlvbihbW3NlbGVjdG9yXV0sIHJvb3QpO1xufVxuIiwgImltcG9ydCB7IHNjYWxlT3JkaW5hbCB9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7IHNjaGVtZVRhYmxlYXUxMCB9IGZyb20gJ2QzLXNjYWxlLWNocm9tYXRpYyc7XG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHsgTWVudSwgc2V0SWNvbiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFJvdGF0aW9uUHJlc2V0LCBXb3JkQ2xvdWRSZW5kZXJPcHRpb25zLCBXb3JkVGV4dE1ldHJpYywgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5mdW5jdGlvbiBidWlsZERldGVybWluaXN0aWNSYW5kb20oc2VlZDogbnVtYmVyKTogKCkgPT4gbnVtYmVyIHtcbiAgbGV0IHN0YXRlID0gc2VlZCA+Pj4gMDtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBzdGF0ZSA9IChzdGF0ZSArIDB4NkQyQjc5RjUpIHwgMDtcbiAgICBsZXQgdCA9IE1hdGguaW11bChzdGF0ZSBeIChzdGF0ZSA+Pj4gMTUpLCAxIHwgc3RhdGUpO1xuICAgIHQgPSAodCArIE1hdGguaW11bCh0IF4gKHQgPj4+IDcpLCA2MSB8IHQpKSBeIHQ7XG4gICAgcmV0dXJuICgodCBeICh0ID4+PiAxNCkpID4+PiAwKSAvIDQyOTQ5NjcyOTY7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHBpY2tSb3RhdGlvbihyYW5kb206ICgpID0+IG51bWJlciwgcHJlc2V0OiBSb3RhdGlvblByZXNldCk6IG51bWJlciB7XG4gIGlmIChwcmVzZXQgPT09ICdob3Jpem9udGFsJykge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKHByZXNldCA9PT0gJ21vc3RseS1ob3Jpem9udGFsJykge1xuICAgIHJldHVybiByYW5kb20oKSA+IDAuODUgPyA5MCA6IDA7XG4gIH1cblxuICBpZiAocHJlc2V0ID09PSAndmVydGljYWwnKSB7XG4gICAgcmV0dXJuIHJhbmRvbSgpID4gMC4yID8gOTAgOiAwO1xuICB9XG5cbiAgY29uc3QgYW5nbGVzID0gWy05MCwgLTQ1LCAwLCA0NSwgOTBdO1xuICByZXR1cm4gYW5nbGVzW01hdGguZmxvb3IocmFuZG9tKCkgKiBhbmdsZXMubGVuZ3RoKV07XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFdvcmRNZXRyaWNWYWx1ZShcbiAgd29yZDogV2VpZ2h0ZWRXb3JkLFxuICB0b3RhbENvdW50OiBudW1iZXIsXG4gIG1ldHJpYzogV29yZFRleHRNZXRyaWMsXG4pOiBzdHJpbmcge1xuICBpZiAobWV0cmljID09PSAnZnJlcXVlbmN5Jykge1xuICAgIGNvbnN0IHBlcmNlbnQgPSAod29yZC5jb3VudCAvIE1hdGgubWF4KDEsIHRvdGFsQ291bnQpKSAqIDEwMDtcbiAgICByZXR1cm4gYCR7cGVyY2VudC50b0ZpeGVkKHBlcmNlbnQgPj0gMTAgPyAxIDogMikucmVwbGFjZSgvXFwuPzArJC8sICcnKX0lYDtcbiAgfVxuXG4gIHJldHVybiBTdHJpbmcod29yZC5jb3VudCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFdvcmRUaXRsZSh3b3JkOiBXZWlnaHRlZFdvcmQsIHRvdGFsQ291bnQ6IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBgJHt3b3JkLnRleHR9ICgke3dvcmQuY291bnR9LCAke2Zvcm1hdFdvcmRNZXRyaWNWYWx1ZSh3b3JkLCB0b3RhbENvdW50LCAnZnJlcXVlbmN5Jyl9KWA7XG59XG5cbmZ1bmN0aW9uIGdldFdvcmRMYWJlbCh3b3JkOiBXZWlnaHRlZFdvcmQsIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncywgdG90YWxDb3VudDogbnVtYmVyLCBtZXRyaWM6IFdvcmRUZXh0TWV0cmljKTogc3RyaW5nIHtcbiAgaWYgKCFyZW5kZXJTZXR0aW5ncy5zaG93Q291bnRJbldvcmRUZXh0IHx8IHdvcmQuY291bnQgPCByZW5kZXJTZXR0aW5ncy5jb3VudExhYmVsTWluQ291bnQpIHtcbiAgICByZXR1cm4gd29yZC50ZXh0O1xuICB9XG5cbiAgY29uc3QgZm9ybWF0dGVkVmFsdWUgPSBmb3JtYXRXb3JkTWV0cmljVmFsdWUod29yZCwgdG90YWxDb3VudCwgbWV0cmljKTtcblxuICBpZiAocmVuZGVyU2V0dGluZ3MuY291bnRMYWJlbEZvcm1hdCA9PT0gJ2RvdCcpIHtcbiAgICByZXR1cm4gYCR7d29yZC50ZXh0fSBcdTAwQjcgJHtmb3JtYXR0ZWRWYWx1ZX1gO1xuICB9XG5cbiAgaWYgKHJlbmRlclNldHRpbmdzLmNvdW50TGFiZWxGb3JtYXQgPT09ICdjb2xvbicpIHtcbiAgICByZXR1cm4gYCR7d29yZC50ZXh0fTogJHtmb3JtYXR0ZWRWYWx1ZX1gO1xuICB9XG5cbiAgcmV0dXJuIGAke3dvcmQudGV4dH0gKCR7Zm9ybWF0dGVkVmFsdWV9KWA7XG59XG5cbnR5cGUgTGF5b3V0V29yZCA9IFdlaWdodGVkV29yZCAmIHtcbiAgYmFzZVRleHQ6IHN0cmluZztcbiAgbGF5b3V0VGV4dDogc3RyaW5nO1xufTtcblxudHlwZSBWaWV3cG9ydENvbnRyb2xzID0ge1xuICB6b29tSW46ICgpID0+IHZvaWQ7XG4gIHpvb21PdXQ6ICgpID0+IHZvaWQ7XG4gIHJlc2V0VmlldzogKCkgPT4gdm9pZDtcbiAgc2hvdWxkU3VwcHJlc3NXb3JkQ2xpY2s6ICgpID0+IGJvb2xlYW47XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZHJhd1dvcmRDbG91ZChvcHRpb25zOiBXb3JkQ2xvdWRSZW5kZXJPcHRpb25zLCByZW5kZXJTZXR0aW5nczogUmVuZGVyU2V0dGluZ3MpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qge1xuICAgIGNvbnRhaW5lckVsLFxuICAgIHdvcmRzLFxuICAgIGFyaWFMYWJlbCxcbiAgICBvbldvcmRDbGljayxcbiAgICBvbkV4Y2x1ZGVJbkNsb3VkLFxuICAgIG9uRXhjbHVkZUluVmF1bHQsXG4gICAgb25Qcm9ncmVzcyxcbiAgICBvblJlZnJlc2gsXG4gIH0gPSBvcHRpb25zO1xuICBjb25zdCBleHBvcnRCYXNlTmFtZSA9IHNhbml0aXplRmlsZU5hbWUob3B0aW9ucy5leHBvcnRCYXNlTmFtZSA/PyAnd29yZC1jbG91ZCcpO1xuICBjb25zdCBlbmFibGVFeHBvcnQgPSBvcHRpb25zLmVuYWJsZUV4cG9ydCA/PyB0cnVlO1xuICBjb25zdCBlbmFibGVPdmVybGF5Q29udHJvbHMgPSBvcHRpb25zLmVuYWJsZU92ZXJsYXlDb250cm9scyA/PyB0cnVlO1xuICBjb25zdCBlbmFibGVWaWV3cG9ydEludGVyYWN0aW9uID0gb3B0aW9ucy5lbmFibGVWaWV3cG9ydEludGVyYWN0aW9uID8/IHRydWU7XG4gIGNvbnN0IHNob3dSZWZyZXNoQ29udHJvbCA9IG9wdGlvbnMuc2hvd1JlZnJlc2hDb250cm9sID8/IHRydWU7XG4gIGNvbnN0IHNob3dab29tQ29udHJvbHMgPSBvcHRpb25zLnNob3dab29tQ29udHJvbHMgPz8gdHJ1ZTtcbiAgY29uc3Qgc2hvd0VkaXRDb250cm9sID0gb3B0aW9ucy5zaG93RWRpdENvbnRyb2wgPz8gZmFsc2U7XG4gIGNvbnN0IHdpZHRoID0gTWF0aC5tYXgoMzIwLCBjb250YWluZXJFbC5jbGllbnRXaWR0aCB8fCA3MDApO1xuICBjb25zdCBoZWlnaHQgPSBNYXRoLm1heCgzMjAsIGNvbnRhaW5lckVsLmNsaWVudEhlaWdodCB8fCA1MDApO1xuICBjb25zdCByYW5kb20gPSByZW5kZXJTZXR0aW5ncy5kZXRlcm1pbmlzdGljTGF5b3V0ID8gYnVpbGREZXRlcm1pbmlzdGljUmFuZG9tKHJlbmRlclNldHRpbmdzLnJhbmRvbVNlZWQpIDogTWF0aC5yYW5kb207XG4gIGNvbnN0IHRvdGFsV29yZENvdW50ID0gd29yZHMucmVkdWNlKCh0b3RhbCwgd29yZCkgPT4gdG90YWwgKyB3b3JkLmNvdW50LCAwKTtcbiAgbGV0IGFjdGl2ZVdvcmRUZXh0TWV0cmljOiBXb3JkVGV4dE1ldHJpYyA9IHJlbmRlclNldHRpbmdzLndvcmRUZXh0TWV0cmljO1xuICBjb25zdCBsYXlvdXRXb3JkczogTGF5b3V0V29yZFtdID0gd29yZHMubWFwKCh3b3JkKSA9PiAoe1xuICAgIC4uLndvcmQsXG4gICAgYmFzZVRleHQ6IHdvcmQudGV4dCxcbiAgICBsYXlvdXRUZXh0OiBnZXRXb3JkTGFiZWwod29yZCwgcmVuZGVyU2V0dGluZ3MsIHRvdGFsV29yZENvdW50LCBhY3RpdmVXb3JkVGV4dE1ldHJpYyksXG4gIH0pKTtcblxuICBjb250YWluZXJFbC5jbGFzc0xpc3QuYWRkKCd3b3JkLWNsb3VkLXJlbmRlci1jb250YWluZXInKTtcblxuICBjb25zdCBzdmcgPSBzZWxlY3QoY29udGFpbmVyRWwpXG4gICAgLmFwcGVuZCgnc3ZnJylcbiAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgIC5hdHRyKCdyb2xlJywgJ2ltZycpXG4gICAgLmF0dHIoJ2FyaWEtbGFiZWwnLCBhcmlhTGFiZWwpO1xuXG4gIGNvbnN0IHZpZXdwb3J0R3JvdXAgPSBzdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnd29yZC1jbG91ZC12aWV3cG9ydCcpO1xuICBjb25zdCBnID0gdmlld3BvcnRHcm91cC5hcHBlbmQoJ2cnKS5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7d2lkdGggLyAyfSwke2hlaWdodCAvIDJ9KWApO1xuICBjb25zdCB2aWV3cG9ydENvbnRyb2xzID0gZW5hYmxlVmlld3BvcnRJbnRlcmFjdGlvblxuICAgID8gc2V0dXBWaWV3cG9ydENvbnRyb2xzKHN2Zy5ub2RlKCksIHZpZXdwb3J0R3JvdXAubm9kZSgpLCB3aWR0aCwgaGVpZ2h0KVxuICAgIDogY3JlYXRlU3RhdGljVmlld3BvcnRDb250cm9scygpO1xuXG4gIGNvbnN0IGNvbG9yID0gc2NhbGVPcmRpbmFsPHN0cmluZywgc3RyaW5nPihzY2hlbWVUYWJsZWF1MTApO1xuICBjb25zdCB7IGRlZmF1bHQ6IGNsb3VkIH0gPSBhd2FpdCBpbXBvcnQoJ2QzLWNsb3VkJyk7XG4gIGNvbnN0IHBlcmZvcm1hbmNlID0gZ2V0TGF5b3V0UGVyZm9ybWFuY2VQcm9maWxlKHJlbmRlclNldHRpbmdzLnByb2dyZXNzRGV0YWlsKTtcbiAgY29uc3QgcmVwb3J0UHJvZ3Jlc3MgPSBjcmVhdGVUaHJvdHRsZWRQcm9ncmVzcyhvblByb2dyZXNzLCBwZXJmb3JtYW5jZS5wcm9ncmVzc1Rocm90dGxlTXMpO1xuICBjb25zdCBsYXlvdXRUaW1lSW50ZXJ2YWwgPSByZW5kZXJTZXR0aW5ncy5wcm9ncmVzc0RldGFpbCA9PT0gJ3VuaGluZ2VkJ1xuICAgID8gSW5maW5pdHlcbiAgICA6IE1hdGgubWF4KDgsIE1hdGgucm91bmQocmVuZGVyU2V0dGluZ3MubGF5b3V0VGltZUludGVydmFsTXMpKTtcblxuICBhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBsYWlkT3V0V29yZHMgPSAwO1xuICAgIGNvbnN0IHRvdGFsV29yZHMgPSBNYXRoLm1heCgxLCBsYXlvdXRXb3Jkcy5sZW5ndGgpO1xuXG4gICAgY2xvdWQ8TGF5b3V0V29yZD4oKVxuICAgICAgLnNpemUoW3dpZHRoLCBoZWlnaHRdKVxuICAgICAgLndvcmRzKGxheW91dFdvcmRzKVxuICAgICAgLnRleHQoKGQpID0+IGQubGF5b3V0VGV4dClcbiAgICAgIC50aW1lSW50ZXJ2YWwobGF5b3V0VGltZUludGVydmFsKVxuICAgICAgLnBhZGRpbmcoTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy53b3JkUGFkZGluZykpKVxuICAgICAgLnNwaXJhbChyZW5kZXJTZXR0aW5ncy5zcGlyYWwpXG4gICAgICAucm90YXRlKCgpID0+IHBpY2tSb3RhdGlvbihyYW5kb20sIHJlbmRlclNldHRpbmdzLnJvdGF0aW9uUHJlc2V0KSlcbiAgICAgIC5mb250KHJlbmRlclNldHRpbmdzLmZvbnRGYW1pbHkgfHwgJ3NhbnMtc2VyaWYnKVxuICAgICAgLmZvbnRTaXplKChkKSA9PiBkLnNpemUpXG4gICAgICAucmFuZG9tKHJhbmRvbSlcbiAgICAgIC5vbignd29yZCcsICgpID0+IHtcbiAgICAgICAgbGFpZE91dFdvcmRzICs9IDE7XG4gICAgICAgIGlmIChsYWlkT3V0V29yZHMgJSBwZXJmb3JtYW5jZS53b3JkUHJvZ3Jlc3NTdHJpZGUgPT09IDApIHtcbiAgICAgICAgICBjb25zdCBsYXlvdXRQZXJjZW50ID0gTWF0aC5taW4oOTksIE1hdGgucm91bmQoKGxhaWRPdXRXb3JkcyAvIHRvdGFsV29yZHMpICogMTAwKSk7XG4gICAgICAgICAgcmVwb3J0UHJvZ3Jlc3MoYExheWluZyBvdXQgd29yZHMuLi4gJHtsYWlkT3V0V29yZHN9LyR7bGF5b3V0V29yZHMubGVuZ3RofWAsIGxheW91dFBlcmNlbnQpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLm9uKCdlbmQnLCAobGF5b3V0V29yZHMpID0+IHtcbiAgICAgICAgY29uc3QgdGV4dFNlbGVjdGlvbiA9IGcuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgICAuZGF0YShsYXlvdXRXb3JkcylcbiAgICAgICAgICAuZW50ZXIoKVxuICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgKGQpID0+IGAke2Quc2l6ZX1weGApXG4gICAgICAgICAgLnN0eWxlKCdmb250LWZhbWlseScsIHJlbmRlclNldHRpbmdzLmZvbnRGYW1pbHkgfHwgJ3NhbnMtc2VyaWYnKVxuICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIChfLCBpKSA9PiBjb2xvcihTdHJpbmcoaSkpKVxuICAgICAgICAgIC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuICAgICAgICAgIC5hdHRyKCd0YWJpbmRleCcsIDApXG4gICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSA9PiBgdHJhbnNsYXRlKCR7ZC54fSwke2QueX0pIHJvdGF0ZSgke2Qucm90YXRlfSlgKVxuICAgICAgICAgIC50ZXh0KChkKSA9PiBkLmxheW91dFRleHQpXG4gICAgICAgICAgLm9uKCdjbGljaycsIChfLCBkKSA9PiB7XG4gICAgICAgICAgICBpZiAodmlld3BvcnRDb250cm9scy5zaG91bGRTdXBwcmVzc1dvcmRDbGljaygpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9uV29yZENsaWNrKGQuYmFzZVRleHQpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKCdrZXlkb3duJywgKGV2ZW50OiBLZXlib2FyZEV2ZW50LCBkKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnRW50ZXInIHx8IGV2ZW50LmtleSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIG9uV29yZENsaWNrKGQuYmFzZVRleHQpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgob25FeGNsdWRlSW5DbG91ZCB8fCBvbkV4Y2x1ZGVJblZhdWx0KSAmJiAoZXZlbnQua2V5ID09PSAnQ29udGV4dE1lbnUnIHx8IChldmVudC5zaGlmdEtleSAmJiBldmVudC5rZXkgPT09ICdGMTAnKSkpIHtcbiAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgb3BlbkV4Y2x1ZGVXb3JkTWVudUF0Rm9jdXNlZFdvcmQoZXZlbnQuY3VycmVudFRhcmdldCwgZC5iYXNlVGV4dCwgb25FeGNsdWRlSW5DbG91ZCwgb25FeGNsdWRlSW5WYXVsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAub24oJ2NvbnRleHRtZW51JywgKGV2ZW50OiBNb3VzZUV2ZW50LCBkKSA9PiB7XG4gICAgICAgICAgICBpZiAoIW9uRXhjbHVkZUluQ2xvdWQgJiYgIW9uRXhjbHVkZUluVmF1bHQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBvcGVuRXhjbHVkZVdvcmRNZW51QXRQb2ludGVyKGV2ZW50LCBkLmJhc2VUZXh0LCBvbkV4Y2x1ZGVJbkNsb3VkLCBvbkV4Y2x1ZGVJblZhdWx0KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICB0ZXh0U2VsZWN0aW9uXG4gICAgICAgICAgLmFwcGVuZCgndGl0bGUnKVxuICAgICAgICAgIC50ZXh0KChkKSA9PiBmb3JtYXRXb3JkVGl0bGUoZCwgdG90YWxXb3JkQ291bnQpKTtcblxuICAgICAgICBjb25zdCBhcHBseVdvcmRUZXh0TWV0cmljID0gKG1ldHJpYzogV29yZFRleHRNZXRyaWMpOiB2b2lkID0+IHtcbiAgICAgICAgICBhY3RpdmVXb3JkVGV4dE1ldHJpYyA9IG1ldHJpYztcbiAgICAgICAgICB0ZXh0U2VsZWN0aW9uLnRleHQoKGQpID0+IGdldFdvcmRMYWJlbChkLCByZW5kZXJTZXR0aW5ncywgdG90YWxXb3JkQ291bnQsIG1ldHJpYykpO1xuICAgICAgICAgIHRleHRTZWxlY3Rpb24uc2VsZWN0KCd0aXRsZScpLnRleHQoKGQpID0+IGZvcm1hdFdvcmRUaXRsZShkLCB0b3RhbFdvcmRDb3VudCkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlcG9ydFByb2dyZXNzKCdSZW5kZXJpbmcgY29tcGxldGUuJywgMTAwKTtcbiAgICAgICAgaWYgKGVuYWJsZU92ZXJsYXlDb250cm9scykge1xuICAgICAgICAgIHJlbmRlck92ZXJsYXlDb250cm9scyhcbiAgICAgICAgICAgIGNvbnRhaW5lckVsLFxuICAgICAgICAgICAgc3ZnLm5vZGUoKSxcbiAgICAgICAgICAgIGV4cG9ydEJhc2VOYW1lLFxuICAgICAgICAgICAgZW5hYmxlRXhwb3J0LFxuICAgICAgICAgICAgb25SZWZyZXNoLFxuICAgICAgICAgICAgb3B0aW9ucy5vbkVkaXQsXG4gICAgICAgICAgICB2aWV3cG9ydENvbnRyb2xzLFxuICAgICAgICAgICAgc2hvd1JlZnJlc2hDb250cm9sLFxuICAgICAgICAgICAgc2hvd1pvb21Db250cm9scyxcbiAgICAgICAgICAgIHNob3dFZGl0Q29udHJvbCxcbiAgICAgICAgICAgIHJlbmRlclNldHRpbmdzLnNob3dDb3VudEluV29yZFRleHQgJiYgcmVuZGVyU2V0dGluZ3Muc2hvd1dvcmRUZXh0TWV0cmljVG9nZ2xlLFxuICAgICAgICAgICAgKCkgPT4gYWN0aXZlV29yZFRleHRNZXRyaWMsXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgIGFwcGx5V29yZFRleHRNZXRyaWMoYWN0aXZlV29yZFRleHRNZXRyaWMgPT09ICdjb3VudCcgPyAnZnJlcXVlbmN5JyA6ICdjb3VudCcpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSlcbiAgICAgIC5zdGFydCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gb3BlbkV4Y2x1ZGVXb3JkTWVudUF0UG9pbnRlcihcbiAgZXZlbnQ6IE1vdXNlRXZlbnQsXG4gIHdvcmQ6IHN0cmluZyxcbiAgb25FeGNsdWRlSW5DbG91ZDogKCh3b3JkOiBzdHJpbmcpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+KSB8IHVuZGVmaW5lZCxcbiAgb25FeGNsdWRlSW5WYXVsdDogKCh3b3JkOiBzdHJpbmcpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+KSB8IHVuZGVmaW5lZCxcbik6IHZvaWQge1xuICBjb25zdCBtZW51ID0gbmV3IE1lbnUoKTtcbiAgYWRkRXhjbHVkZU1lbnVJdGVtcyhtZW51LCB3b3JkLCBvbkV4Y2x1ZGVJbkNsb3VkLCBvbkV4Y2x1ZGVJblZhdWx0KTtcbiAgbWVudS5zaG93QXRNb3VzZUV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gb3BlbkV4Y2x1ZGVXb3JkTWVudUF0Rm9jdXNlZFdvcmQoXG4gIHRhcmdldDogRXZlbnRUYXJnZXQgfCBudWxsLFxuICB3b3JkOiBzdHJpbmcsXG4gIG9uRXhjbHVkZUluQ2xvdWQ6ICgod29yZDogc3RyaW5nKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPikgfCB1bmRlZmluZWQsXG4gIG9uRXhjbHVkZUluVmF1bHQ6ICgod29yZDogc3RyaW5nKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPikgfCB1bmRlZmluZWQsXG4pOiB2b2lkIHtcbiAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgU1ZHR3JhcGhpY3NFbGVtZW50KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xuICBhZGRFeGNsdWRlTWVudUl0ZW1zKG1lbnUsIHdvcmQsIG9uRXhjbHVkZUluQ2xvdWQsIG9uRXhjbHVkZUluVmF1bHQpO1xuICBtZW51LnNob3dBdFBvc2l0aW9uKHtcbiAgICB4OiBNYXRoLnJvdW5kKHJlY3QubGVmdCArIChyZWN0LndpZHRoIC8gMikpLFxuICAgIHk6IE1hdGgucm91bmQocmVjdC5ib3R0b20pLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkRXhjbHVkZU1lbnVJdGVtcyhcbiAgbWVudTogTWVudSxcbiAgd29yZDogc3RyaW5nLFxuICBvbkV4Y2x1ZGVJbkNsb3VkOiAoKHdvcmQ6IHN0cmluZykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pIHwgdW5kZWZpbmVkLFxuICBvbkV4Y2x1ZGVJblZhdWx0OiAoKHdvcmQ6IHN0cmluZykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pIHwgdW5kZWZpbmVkLFxuKTogdm9pZCB7XG4gIGlmIChvbkV4Y2x1ZGVJbkNsb3VkKSB7XG4gICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PiB7XG4gICAgICBpdGVtXG4gICAgICAgIC5zZXRUaXRsZSgnRXhjbHVkZSBpbiBjbG91ZCcpXG4gICAgICAgIC5zZXRJY29uKCdsaXN0LXgnKVxuICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgdm9pZCBvbkV4Y2x1ZGVJbkNsb3VkKHdvcmQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChvbkV4Y2x1ZGVJblZhdWx0KSB7XG4gICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PiB7XG4gICAgICBpdGVtXG4gICAgICAgIC5zZXRUaXRsZSgnRXhjbHVkZSBpbiB2YXVsdCcpXG4gICAgICAgIC5zZXRJY29uKCdjbG91ZC1vZmYnKVxuICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgdm9pZCBvbkV4Y2x1ZGVJblZhdWx0KHdvcmQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmICghb25FeGNsdWRlSW5DbG91ZCAmJiAhb25FeGNsdWRlSW5WYXVsdCkge1xuICAgIG1lbnUuYWRkSXRlbSgoaXRlbSkgPT4ge1xuICAgICAgaXRlbVxuICAgICAgICAuc2V0VGl0bGUoJ0V4Y2x1ZGUgdW5hdmFpbGFibGUnKVxuICAgICAgICAuc2V0SWNvbignc2xhc2gnKVxuICAgICAgICAuc2V0RGlzYWJsZWQodHJ1ZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3RhdGljVmlld3BvcnRDb250cm9scygpOiBWaWV3cG9ydENvbnRyb2xzIHtcbiAgcmV0dXJuIHtcbiAgICB6b29tSW46ICgpID0+IHVuZGVmaW5lZCxcbiAgICB6b29tT3V0OiAoKSA9PiB1bmRlZmluZWQsXG4gICAgcmVzZXRWaWV3OiAoKSA9PiB1bmRlZmluZWQsXG4gICAgc2hvdWxkU3VwcHJlc3NXb3JkQ2xpY2s6ICgpID0+IGZhbHNlLFxuICB9O1xufVxuXG5mdW5jdGlvbiBzZXR1cFZpZXdwb3J0Q29udHJvbHMoXG4gIHN2Z0VsOiBTVkdTVkdFbGVtZW50IHwgbnVsbCxcbiAgdmlld3BvcnRFbDogU1ZHR0VsZW1lbnQgfCBudWxsLFxuICB3aWR0aDogbnVtYmVyLFxuICBoZWlnaHQ6IG51bWJlcixcbik6IFZpZXdwb3J0Q29udHJvbHMge1xuICBpZiAoIXN2Z0VsIHx8ICF2aWV3cG9ydEVsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHpvb21JbjogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgem9vbU91dDogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgcmVzZXRWaWV3OiAoKSA9PiB1bmRlZmluZWQsXG4gICAgICBzaG91bGRTdXBwcmVzc1dvcmRDbGljazogKCkgPT4gZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIGxldCBwYW5YID0gMDtcbiAgbGV0IHBhblkgPSAwO1xuICBsZXQgem9vbSA9IDE7XG4gIGxldCBzdXBwcmVzc1dvcmRDbGlja1VudGlsID0gMDtcbiAgbGV0IHBvaW50ZXJJZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIGxldCBkcmFnU3RhcnRYID0gMDtcbiAgbGV0IGRyYWdTdGFydFkgPSAwO1xuICBsZXQgbGFzdFBvaW50ZXJYID0gMDtcbiAgbGV0IGxhc3RQb2ludGVyWSA9IDA7XG4gIGxldCBwb2ludGVyTW92ZWQgPSBmYWxzZTtcbiAgbGV0IGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgY29uc3QgbWluWm9vbSA9IDAuMzU7XG4gIGNvbnN0IG1heFpvb20gPSA0LjU7XG4gIGNvbnN0IGRyYWdTdGFydFRocmVzaG9sZFB4ID0gNztcblxuICBjb25zdCBjbGFtcFpvb20gPSAodmFsdWU6IG51bWJlcik6IG51bWJlciA9PiB7XG4gICAgaWYgKE51bWJlci5pc05hTih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB6b29tO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5taW4obWF4Wm9vbSwgTWF0aC5tYXgobWluWm9vbSwgdmFsdWUpKTtcbiAgfTtcblxuICBjb25zdCBhcHBseVRyYW5zZm9ybSA9ICgpOiB2b2lkID0+IHtcbiAgICB2aWV3cG9ydEVsLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3Bhblh9LCR7cGFuWX0pIHNjYWxlKCR7em9vbX0pYCk7XG4gIH07XG5cbiAgY29uc3Qgem9vbUF0ID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCBmYWN0b3I6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGZhY3RvcikgfHwgZmFjdG9yIDw9IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0Wm9vbSA9IGNsYW1wWm9vbSh6b29tICogZmFjdG9yKTtcbiAgICBpZiAobmV4dFpvb20gPT09IHpvb20pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3b3JsZFggPSAoeCAtIHBhblgpIC8gem9vbTtcbiAgICBjb25zdCB3b3JsZFkgPSAoeSAtIHBhblkpIC8gem9vbTtcbiAgICBwYW5YID0geCAtICh3b3JsZFggKiBuZXh0Wm9vbSk7XG4gICAgcGFuWSA9IHkgLSAod29ybGRZICogbmV4dFpvb20pO1xuICAgIHpvb20gPSBuZXh0Wm9vbTtcbiAgICBhcHBseVRyYW5zZm9ybSgpO1xuICB9O1xuXG4gIGNvbnN0IG51ZGdlUGFuID0gKGRlbHRhWDogbnVtYmVyLCBkZWx0YVk6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIHBhblggKz0gZGVsdGFYO1xuICAgIHBhblkgKz0gZGVsdGFZO1xuICAgIGFwcGx5VHJhbnNmb3JtKCk7XG4gIH07XG5cbiAgY29uc3Qgem9vbUluID0gKCk6IHZvaWQgPT4gem9vbUF0KHdpZHRoIC8gMiwgaGVpZ2h0IC8gMiwgMS4xOCk7XG4gIGNvbnN0IHpvb21PdXQgPSAoKTogdm9pZCA9PiB6b29tQXQod2lkdGggLyAyLCBoZWlnaHQgLyAyLCAxIC8gMS4xOCk7XG4gIGNvbnN0IHJlc2V0VmlldyA9ICgpOiB2b2lkID0+IHtcbiAgICBwYW5YID0gMDtcbiAgICBwYW5ZID0gMDtcbiAgICB6b29tID0gMTtcbiAgICBhcHBseVRyYW5zZm9ybSgpO1xuICB9O1xuXG4gIGFwcGx5VHJhbnNmb3JtKCk7XG4gIHN2Z0VsLmNsYXNzTGlzdC5hZGQoJ3dvcmQtY2xvdWQtcGFuem9vbS1zdXJmYWNlJyk7XG4gIHN2Z0VsLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICBzdmdFbC5zZXRBdHRyaWJ1dGUoXG4gICAgJ2FyaWEta2V5c2hvcnRjdXRzJyxcbiAgICAnKywgLSwgMCwgQXJyb3dMZWZ0LCBBcnJvd1JpZ2h0LCBBcnJvd1VwLCBBcnJvd0Rvd24nLFxuICApO1xuXG4gIHN2Z0VsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgKGV2ZW50OiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQucG9pbnRlclR5cGUgIT09ICd0b3VjaCcgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3ZnRWwuZm9jdXMoeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pO1xuICAgIHBvaW50ZXJJZCA9IGV2ZW50LnBvaW50ZXJJZDtcbiAgICBkcmFnU3RhcnRYID0gZXZlbnQuY2xpZW50WDtcbiAgICBkcmFnU3RhcnRZID0gZXZlbnQuY2xpZW50WTtcbiAgICBsYXN0UG9pbnRlclggPSBldmVudC5jbGllbnRYO1xuICAgIGxhc3RQb2ludGVyWSA9IGV2ZW50LmNsaWVudFk7XG4gICAgcG9pbnRlck1vdmVkID0gZmFsc2U7XG4gICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICB9KTtcblxuICBzdmdFbC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIChldmVudDogUG9pbnRlckV2ZW50KSA9PiB7XG4gICAgaWYgKHBvaW50ZXJJZCAhPT0gZXZlbnQucG9pbnRlcklkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFpc0RyYWdnaW5nKSB7XG4gICAgICBjb25zdCBkcmFnRGlzdGFuY2UgPSBNYXRoLmh5cG90KGV2ZW50LmNsaWVudFggLSBkcmFnU3RhcnRYLCBldmVudC5jbGllbnRZIC0gZHJhZ1N0YXJ0WSk7XG4gICAgICBpZiAoZHJhZ0Rpc3RhbmNlIDwgZHJhZ1N0YXJ0VGhyZXNob2xkUHgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgIHBvaW50ZXJNb3ZlZCA9IHRydWU7XG4gICAgICBsYXN0UG9pbnRlclggPSBldmVudC5jbGllbnRYO1xuICAgICAgbGFzdFBvaW50ZXJZID0gZXZlbnQuY2xpZW50WTtcbiAgICAgIHN2Z0VsLnNldFBvaW50ZXJDYXB0dXJlKGV2ZW50LnBvaW50ZXJJZCk7XG4gICAgICBzdmdFbC5jbGFzc0xpc3QuYWRkKCdpcy1wYW5uaW5nJyk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRlbHRhWCA9IGV2ZW50LmNsaWVudFggLSBsYXN0UG9pbnRlclg7XG4gICAgY29uc3QgZGVsdGFZID0gZXZlbnQuY2xpZW50WSAtIGxhc3RQb2ludGVyWTtcbiAgICBsYXN0UG9pbnRlclggPSBldmVudC5jbGllbnRYO1xuICAgIGxhc3RQb2ludGVyWSA9IGV2ZW50LmNsaWVudFk7XG5cbiAgICBudWRnZVBhbihkZWx0YVgsIGRlbHRhWSk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG5cbiAgc3ZnRWwuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgKGV2ZW50OiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICBpZiAocG9pbnRlcklkICE9PSBldmVudC5wb2ludGVySWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocG9pbnRlck1vdmVkKSB7XG4gICAgICBzdXBwcmVzc1dvcmRDbGlja1VudGlsID0gRGF0ZS5ub3coKSArIDI0MDtcbiAgICB9XG4gICAgcG9pbnRlcklkID0gbnVsbDtcbiAgICBwb2ludGVyTW92ZWQgPSBmYWxzZTtcbiAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgc3ZnRWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtcGFubmluZycpO1xuICAgIGlmIChzdmdFbC5oYXNQb2ludGVyQ2FwdHVyZShldmVudC5wb2ludGVySWQpKSB7XG4gICAgICBzdmdFbC5yZWxlYXNlUG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKTtcbiAgICB9XG4gIH0pO1xuXG4gIHN2Z0VsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCAoZXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgIGlmIChwb2ludGVySWQgIT09IGV2ZW50LnBvaW50ZXJJZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBvaW50ZXJJZCA9IG51bGw7XG4gICAgcG9pbnRlck1vdmVkID0gZmFsc2U7XG4gICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIHN2Z0VsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXBhbm5pbmcnKTtcbiAgICBpZiAoc3ZnRWwuaGFzUG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKSkge1xuICAgICAgc3ZnRWwucmVsZWFzZVBvaW50ZXJDYXB0dXJlKGV2ZW50LnBvaW50ZXJJZCk7XG4gICAgfVxuICB9KTtcblxuICBzdmdFbC5hZGRFdmVudExpc3RlbmVyKFxuICAgICd3aGVlbCcsXG4gICAgKGV2ZW50OiBXaGVlbEV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qgc3BlZWQgPSBldmVudC5kZWx0YU1vZGUgPT09IFdoZWVsRXZlbnQuRE9NX0RFTFRBX0xJTkUgPyAwLjA0IDogMC4wMDIzO1xuICAgICAgY29uc3Qgem9vbUZhY3RvciA9IE1hdGguZXhwKC1ldmVudC5kZWx0YVkgKiBzcGVlZCk7XG4gICAgICB6b29tQXQoZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WSwgem9vbUZhY3Rvcik7XG4gICAgfSxcbiAgICB7IHBhc3NpdmU6IGZhbHNlIH0sXG4gICk7XG5cbiAgc3ZnRWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09ICcrJyB8fCBldmVudC5rZXkgPT09ICc9JyB8fCBldmVudC5rZXkgPT09ICdOdW1wYWRBZGQnKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgem9vbUluKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJy0nIHx8IGV2ZW50LmtleSA9PT0gJ18nIHx8IGV2ZW50LmtleSA9PT0gJ051bXBhZFN1YnRyYWN0Jykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHpvb21PdXQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnMCcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXNldFZpZXcoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYW5TdGVwID0gMzY7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93TGVmdCcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBudWRnZVBhbihwYW5TdGVwLCAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93UmlnaHQnKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgbnVkZ2VQYW4oLXBhblN0ZXAsIDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dVcCcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBudWRnZVBhbigwLCBwYW5TdGVwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBudWRnZVBhbigwLCAtcGFuU3RlcCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHpvb21JbixcbiAgICB6b29tT3V0LFxuICAgIHJlc2V0VmlldyxcbiAgICBzaG91bGRTdXBwcmVzc1dvcmRDbGljazogKCkgPT4gRGF0ZS5ub3coKSA8IHN1cHByZXNzV29yZENsaWNrVW50aWwsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbmRlck92ZXJsYXlDb250cm9scyhcbiAgY29udGFpbmVyRWw6IEhUTUxEaXZFbGVtZW50LFxuICBzdmdFbDogU1ZHU1ZHRWxlbWVudCB8IG51bGwsXG4gIGV4cG9ydEJhc2VOYW1lOiBzdHJpbmcsXG4gIGVuYWJsZUV4cG9ydDogYm9vbGVhbixcbiAgb25SZWZyZXNoOiAoKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPixcbiAgb25FZGl0OiAoKCkgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pIHwgdW5kZWZpbmVkLFxuICB2aWV3cG9ydENvbnRyb2xzOiBWaWV3cG9ydENvbnRyb2xzLFxuICBzaG93UmVmcmVzaENvbnRyb2w6IGJvb2xlYW4sXG4gIHNob3dab29tQ29udHJvbHM6IGJvb2xlYW4sXG4gIHNob3dFZGl0Q29udHJvbDogYm9vbGVhbixcbiAgc2hvd1dvcmRNZXRyaWNUb2dnbGVDb250cm9sOiBib29sZWFuLFxuICBnZXRDdXJyZW50V29yZE1ldHJpYzogKCkgPT4gV29yZFRleHRNZXRyaWMsXG4gIG9uVG9nZ2xlV29yZE1ldHJpYzogKCkgPT4gdm9pZCxcbik6IHZvaWQge1xuICBpZiAoIXN2Z0VsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgbWFrZVJlZnJlc2hCdXR0b24gPSAocGFyZW50RWw6IEhUTUxEaXZFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFzaG93UmVmcmVzaENvbnRyb2wpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZWZyZXNoQnV0dG9uID0gcGFyZW50RWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIGNsczogJ3dvcmQtY2xvdWQtcmVmcmVzaC1idXR0b24nLFxuICAgIH0pO1xuICAgIHJlZnJlc2hCdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIHNldEljb24ocmVmcmVzaEJ1dHRvbiwgJ3JvdGF0ZS1jdycpO1xuICAgIHJlZnJlc2hCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsICdSZWZyZXNoIHdvcmQgY2xvdWQnKTtcblxuICAgIGxldCBpc1JlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICByZWZyZXNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGlzUmVmcmVzaGluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlzUmVmcmVzaGluZyA9IHRydWU7XG4gICAgICByZWZyZXNoQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IG9uUmVmcmVzaCgpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKHJlZnJlc2hCdXR0b24uaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgICByZWZyZXNoQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaXNSZWZyZXNoaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgbWFrZUVkaXRCdXR0b24gPSAocGFyZW50RWw6IEhUTUxEaXZFbGVtZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKCFzaG93RWRpdENvbnRyb2wgfHwgIW9uRWRpdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVkaXRCdXR0b24gPSBwYXJlbnRFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgY2xzOiAnd29yZC1jbG91ZC1lZGl0LWJ1dHRvbicsXG4gICAgfSk7XG4gICAgZWRpdEJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgc2V0SWNvbihlZGl0QnV0dG9uLCAncGVuY2lsJyk7XG4gICAgZWRpdEJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ0VkaXQgZW1iZWRkZWQgd29yZCBjbG91ZCcpO1xuXG4gICAgbGV0IGlzRWRpdGluZyA9IGZhbHNlO1xuICAgIGVkaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoaXNFZGl0aW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaXNFZGl0aW5nID0gdHJ1ZTtcbiAgICAgIGVkaXRCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgb25FZGl0KCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZWRpdEJ1dHRvbi5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgIGVkaXRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpc0VkaXRpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBtYWtlV29yZE1ldHJpY1RvZ2dsZUJ1dHRvbiA9IChwYXJlbnRFbDogSFRNTERpdkVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoIXNob3dXb3JkTWV0cmljVG9nZ2xlQ29udHJvbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1ldHJpY0J1dHRvbiA9IHBhcmVudEVsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICBjbHM6ICd3b3JkLWNsb3VkLW1ldHJpYy1idXR0b24nLFxuICAgIH0pO1xuICAgIG1ldHJpY0J1dHRvbi50eXBlID0gJ2J1dHRvbic7XG5cbiAgICBjb25zdCB1cGRhdGVNZXRyaWNCdXR0b25UZXh0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgY3VycmVudE1ldHJpYyA9IGdldEN1cnJlbnRXb3JkTWV0cmljKCk7XG4gICAgICBjb25zdCBuZXh0TWV0cmljID0gY3VycmVudE1ldHJpYyA9PT0gJ2NvdW50JyA/ICdmcmVxdWVuY3knIDogJ2NvdW50JztcbiAgICAgIG1ldHJpY0J1dHRvbi5zZXRUZXh0KGN1cnJlbnRNZXRyaWMgPT09ICdjb3VudCcgPyAnMTIzJyA6ICclJyk7XG4gICAgICBtZXRyaWNCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsIGBTd2l0Y2ggaW5saW5lIGxhYmVscyB0byAke25leHRNZXRyaWN9YCk7XG4gICAgICBtZXRyaWNCdXR0b24uc2V0QXR0cignZGF0YS10b29sdGlwLXBvc2l0aW9uJywgJ3RvcCcpO1xuICAgICAgbWV0cmljQnV0dG9uLnNldEF0dHIoJ2RhdGEtdG9vbHRpcCcsIGBTaG93aW5nICR7Y3VycmVudE1ldHJpY307IGNsaWNrIGZvciAke25leHRNZXRyaWN9YCk7XG4gICAgfTtcblxuICAgIHVwZGF0ZU1ldHJpY0J1dHRvblRleHQoKTtcbiAgICBtZXRyaWNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBvblRvZ2dsZVdvcmRNZXRyaWMoKTtcbiAgICAgIHVwZGF0ZU1ldHJpY0J1dHRvblRleHQoKTtcbiAgICB9KTtcbiAgfTtcblxuICBpZiAoc2hvd1pvb21Db250cm9scykge1xuICAgIGNvbnN0IHZpZXdDb250cm9sc0VsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC12aWV3LWNvbnRyb2xzJyB9KTtcbiAgICBjb25zdCB6b29tT3V0QnV0dG9uID0gdmlld0NvbnRyb2xzRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIGNsczogJ3dvcmQtY2xvdWQtdmlldy1idXR0b24nLFxuICAgIH0pO1xuICAgIHpvb21PdXRCdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIHNldEljb24oem9vbU91dEJ1dHRvbiwgJ21pbnVzJyk7XG4gICAgem9vbU91dEJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1pvb20gb3V0Jyk7XG4gICAgem9vbU91dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHZpZXdwb3J0Q29udHJvbHMuem9vbU91dCgpKTtcblxuICAgIGNvbnN0IHJlc2V0Vmlld0J1dHRvbiA9IHZpZXdDb250cm9sc0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICBjbHM6ICd3b3JkLWNsb3VkLXZpZXctYnV0dG9uJyxcbiAgICB9KTtcbiAgICByZXNldFZpZXdCdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIHNldEljb24ocmVzZXRWaWV3QnV0dG9uLCAnbG9jYXRlLWZpeGVkJyk7XG4gICAgcmVzZXRWaWV3QnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnUmVzZXQgcGFuIGFuZCB6b29tJyk7XG4gICAgcmVzZXRWaWV3QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdmlld3BvcnRDb250cm9scy5yZXNldFZpZXcoKSk7XG5cbiAgICBjb25zdCB6b29tSW5CdXR0b24gPSB2aWV3Q29udHJvbHNFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgY2xzOiAnd29yZC1jbG91ZC12aWV3LWJ1dHRvbicsXG4gICAgfSk7XG4gICAgem9vbUluQnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICBzZXRJY29uKHpvb21JbkJ1dHRvbiwgJ3BsdXMnKTtcbiAgICB6b29tSW5CdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsICdab29tIGluJyk7XG4gICAgem9vbUluQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdmlld3BvcnRDb250cm9scy56b29tSW4oKSk7XG4gIH1cblxuICBpZiAoIWVuYWJsZUV4cG9ydCkge1xuICAgIGlmICghc2hvd1pvb21Db250cm9scykge1xuICAgICAgY29uc3QgZmFsbGJhY2tDb250cm9sc0VsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1leHBvcnQtY29udHJvbHMnIH0pO1xuICAgICAgbWFrZVdvcmRNZXRyaWNUb2dnbGVCdXR0b24oZmFsbGJhY2tDb250cm9sc0VsKTtcbiAgICAgIG1ha2VSZWZyZXNoQnV0dG9uKGZhbGxiYWNrQ29udHJvbHNFbCk7XG4gICAgICBtYWtlRWRpdEJ1dHRvbihmYWxsYmFja0NvbnRyb2xzRWwpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBleHBvcnRDb250cm9sc0VsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1leHBvcnQtY29udHJvbHMnIH0pO1xuICBjb25zdCBtZW51QnV0dG9uID0gZXhwb3J0Q29udHJvbHNFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgIGNsczogJ3dvcmQtY2xvdWQtbWVudS1idXR0b24nLFxuICAgIHRleHQ6ICdcdTIyRUYnLFxuICB9KTtcbiAgbWVudUJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1dvcmQgY2xvdWQgb3B0aW9ucycpO1xuXG4gIG1ha2VXb3JkTWV0cmljVG9nZ2xlQnV0dG9uKGV4cG9ydENvbnRyb2xzRWwpO1xuICBtYWtlUmVmcmVzaEJ1dHRvbihleHBvcnRDb250cm9sc0VsKTtcbiAgbWFrZUVkaXRCdXR0b24oZXhwb3J0Q29udHJvbHNFbCk7XG5cbiAgY29uc3QgbWVudUVsID0gZXhwb3J0Q29udHJvbHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLW1lbnUnIH0pO1xuICBtZW51RWwuc2V0QXR0cignaGlkZGVuJywgJ3RydWUnKTtcbiAgbGV0IHJlbW92ZU91dHNpZGVMaXN0ZW5lcjogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3QgdG9nZ2xlTWVudSA9IChvcGVuOiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgaWYgKG9wZW4pIHtcbiAgICAgIG1lbnVFbC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgY29uc3Qgb25PdXRzaWRlQ2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBOb2RlKSkge1xuICAgICAgICAgIHRvZ2dsZU1lbnUoZmFsc2UpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWV4cG9ydENvbnRyb2xzRWwuY29udGFpbnModGFyZ2V0KSkge1xuICAgICAgICAgIHRvZ2dsZU1lbnUoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25PdXRzaWRlQ2xpY2ssIHRydWUpO1xuICAgICAgcmVtb3ZlT3V0c2lkZUxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk91dHNpZGVDbGljaywgdHJ1ZSk7XG4gICAgICAgIHJlbW92ZU91dHNpZGVMaXN0ZW5lciA9IG51bGw7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBtZW51RWwuc2V0QXR0cignaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIGlmIChyZW1vdmVPdXRzaWRlTGlzdGVuZXIpIHtcbiAgICAgICAgcmVtb3ZlT3V0c2lkZUxpc3RlbmVyKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG1ha2VNZW51SXRlbSA9IChsYWJlbDogc3RyaW5nLCBmb3JtYXQ6ICdzdmcnIHwgJ3BuZycgfCAnanBlZycpID0+IHtcbiAgICBjb25zdCBidXR0b24gPSBtZW51RWwuY3JlYXRlRWwoJ2J1dHRvbicsIHsgY2xzOiAnd29yZC1jbG91ZC1tZW51LWl0ZW0nLCB0ZXh0OiBgRXhwb3J0ICR7bGFiZWx9YCB9KTtcbiAgICBidXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsIGBFeHBvcnQgYXMgJHtsYWJlbH1gKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGV4cG9ydFN2ZyhzdmdFbCwgZm9ybWF0LCBleHBvcnRCYXNlTmFtZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdXb3JkIGNsb3VkczogZXhwb3J0IGZhaWxlZCcsIGVycm9yKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRvZ2dsZU1lbnUoZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIG1ha2VNZW51SXRlbSgnU1ZHJywgJ3N2ZycpO1xuICBtYWtlTWVudUl0ZW0oJ1BORycsICdwbmcnKTtcbiAgbWFrZU1lbnVJdGVtKCdKUEVHJywgJ2pwZWcnKTtcblxuICBtZW51QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0b2dnbGVNZW51KG1lbnVFbC5oYXNBdHRyaWJ1dGUoJ2hpZGRlbicpKTtcbiAgfSk7XG5cbiAgbWVudUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIHRvZ2dsZU1lbnUoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgbWVudUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRvZ2dsZU1lbnUoZmFsc2UpO1xuICAgICAgbWVudUJ1dHRvbi5mb2N1cygpO1xuICAgIH1cbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGV4cG9ydFN2ZyhzdmdFbDogU1ZHU1ZHRWxlbWVudCwgZm9ybWF0OiAnc3ZnJyB8ICdwbmcnIHwgJ2pwZWcnLCBiYXNlTmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHN2Z1RleHQgPSBuZXcgWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKHN2Z0VsKTtcbiAgY29uc3Qgc3ZnQmxvYiA9IG5ldyBCbG9iKFtzdmdUZXh0XSwgeyB0eXBlOiAnaW1hZ2Uvc3ZnK3htbDtjaGFyc2V0PXV0Zi04JyB9KTtcblxuICBpZiAoZm9ybWF0ID09PSAnc3ZnJykge1xuICAgIHRyaWdnZXJCbG9iRG93bmxvYWQoc3ZnQmxvYiwgYCR7YmFzZU5hbWV9LnN2Z2ApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHdpZHRoID0gTnVtYmVyKHN2Z0VsLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSA/PyBzdmdFbC52aWV3Qm94LmJhc2VWYWwud2lkdGggPz8gODAwKTtcbiAgY29uc3QgaGVpZ2h0ID0gTnVtYmVyKHN2Z0VsLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JykgPz8gc3ZnRWwudmlld0JveC5iYXNlVmFsLmhlaWdodCA/PyA2MDApO1xuICBjb25zdCBiaXRtYXBCbG9iID0gYXdhaXQgcmFzdGVyaXplU3ZnKHN2Z0Jsb2IsIHdpZHRoLCBoZWlnaHQsIGZvcm1hdCk7XG4gIHRyaWdnZXJCbG9iRG93bmxvYWQoYml0bWFwQmxvYiwgYCR7YmFzZU5hbWV9LiR7Zm9ybWF0ID09PSAncG5nJyA/ICdwbmcnIDogJ2pwZyd9YCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJhc3Rlcml6ZVN2ZyhcbiAgc3ZnQmxvYjogQmxvYixcbiAgd2lkdGg6IG51bWJlcixcbiAgaGVpZ2h0OiBudW1iZXIsXG4gIGZvcm1hdDogJ3BuZycgfCAnanBlZycsXG4pOiBQcm9taXNlPEJsb2I+IHtcbiAgY29uc3Qgc3ZnVXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChzdmdCbG9iKTtcbiAgY29uc3QgaW1hZ2UgPSBhd2FpdCBsb2FkSW1hZ2Uoc3ZnVXJsKTtcbiAgVVJMLnJldm9rZU9iamVjdFVSTChzdmdVcmwpO1xuXG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBjYW52YXMud2lkdGggPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHdpZHRoKSk7XG4gIGNhbnZhcy5oZWlnaHQgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGhlaWdodCkpO1xuICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIGlmICghY29udGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2FudmFzIDJEIGNvbnRleHQgdW5hdmFpbGFibGUnKTtcbiAgfVxuXG4gIGlmIChmb3JtYXQgPT09ICdqcGVnJykge1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyNmZmZmZmYnO1xuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgfVxuXG4gIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG4gIHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZTxCbG9iPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY2FudmFzLnRvQmxvYigoYmxvYikgPT4ge1xuICAgICAgaWYgKCFibG9iKSB7XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgYml0bWFwIGJsb2InKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoYmxvYik7XG4gICAgfSwgZm9ybWF0ID09PSAncG5nJyA/ICdpbWFnZS9wbmcnIDogJ2ltYWdlL2pwZWcnLCAwLjkyKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGxvYWRJbWFnZSh1cmw6IHN0cmluZyk6IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgaW1hZ2Uub25sb2FkID0gKCkgPT4gcmVzb2x2ZShpbWFnZSk7XG4gICAgaW1hZ2Uub25lcnJvciA9ICgpID0+IHJlamVjdChuZXcgRXJyb3IoJ0ZhaWxlZCB0byBsb2FkIFNWRyBpbWFnZScpKTtcbiAgICBpbWFnZS5zcmMgPSB1cmw7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyQmxvYkRvd25sb2FkKGJsb2I6IEJsb2IsIGZpbGVuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgY29uc3QgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICBhbmNob3IuaHJlZiA9IHVybDtcbiAgYW5jaG9yLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gIGFuY2hvci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGFuY2hvcik7XG4gIGFuY2hvci5jbGljaygpO1xuICBhbmNob3IucmVtb3ZlKCk7XG4gIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpLCAxMDAwKTtcbn1cblxuZnVuY3Rpb24gc2FuaXRpemVGaWxlTmFtZSh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLnRyaW0oKS5yZXBsYWNlKC9bXmEtejAtOS1fXSsvZ2ksICctJykucmVwbGFjZSgvLSsvZywgJy0nKS5yZXBsYWNlKC9eLXwtJC9nLCAnJykgfHwgJ3dvcmQtY2xvdWQnO1xufVxuXG5mdW5jdGlvbiBnZXRMYXlvdXRQZXJmb3JtYW5jZVByb2ZpbGUoZGV0YWlsOiBSZW5kZXJTZXR0aW5nc1sncHJvZ3Jlc3NEZXRhaWwnXSk6IHtcbiAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiBudW1iZXI7XG4gIHdvcmRQcm9ncmVzc1N0cmlkZTogbnVtYmVyO1xufSB7XG4gIGlmIChkZXRhaWwgPT09ICd1bmhpbmdlZCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAxXzAwMF8wMDAsXG4gICAgICB3b3JkUHJvZ3Jlc3NTdHJpZGU6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIH07XG4gIH1cblxuICBpZiAoZGV0YWlsID09PSAnZGV0YWlsZWQnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2dyZXNzVGhyb3R0bGVNczogMzAsXG4gICAgICB3b3JkUHJvZ3Jlc3NTdHJpZGU6IDEsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChkZXRhaWwgPT09ICdtaW5pbWFsJykge1xuICAgIHJldHVybiB7XG4gICAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDIyMCxcbiAgICAgIHdvcmRQcm9ncmVzc1N0cmlkZTogMTIsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiA4MCxcbiAgICB3b3JkUHJvZ3Jlc3NTdHJpZGU6IDQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRocm90dGxlZFByb2dyZXNzKFxuICBvblByb2dyZXNzOiAoKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB2b2lkKSB8IHVuZGVmaW5lZCxcbiAgbWluSW50ZXJ2YWxNczogbnVtYmVyLFxuKTogKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB2b2lkIHtcbiAgaWYgKCFvblByb2dyZXNzKSB7XG4gICAgcmV0dXJuICgpID0+IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxldCBsYXN0UmVwb3J0ZWRBdCA9IDA7XG4gIGxldCBsYXN0UGVyY2VudCA9IC0xO1xuXG4gIHJldHVybiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGlmIChwZXJjZW50ICE9PSAxMDAgJiYgcGVyY2VudCA9PT0gbGFzdFBlcmNlbnQgJiYgbm93IC0gbGFzdFJlcG9ydGVkQXQgPCBtaW5JbnRlcnZhbE1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwZXJjZW50ICE9PSAxMDAgJiYgbm93IC0gbGFzdFJlcG9ydGVkQXQgPCBtaW5JbnRlcnZhbE1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGFzdFJlcG9ydGVkQXQgPSBub3c7XG4gICAgbGFzdFBlcmNlbnQgPSBwZXJjZW50O1xuICAgIG9uUHJvZ3Jlc3MobWVzc2FnZSwgcGVyY2VudCk7XG4gIH07XG59XG4iLCAiaW1wb3J0IHsgSXRlbVZpZXcsIE5vdGljZSwgdHlwZSBURmlsZSwgV29ya3NwYWNlTGVhZiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IGRyYXdGcmVxdWVuY3lDaGFydCB9IGZyb20gJy4uL3JlbmRlcmVycy9mcmVxdWVuY3ktY2hhcnQtcmVuZGVyZXInO1xuaW1wb3J0IHsgVklFV19UWVBFX05PVEVfV09SRF9DTE9VRCB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgdHlwZSB7IFdlaWdodGVkV29yZCwgV29yZENsb3VkRmlsdGVyU2V0dGluZ3MsIFdvcmRDbG91ZFNlcnZpY2VzIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgV29yZENsb3VkRmlsdGVyUGFuZWwgfSBmcm9tICcuLi9jb21wb25lbnRzL2ZpbHRlci1wYW5lbCc7XG5cbnR5cGUgTm90ZVZpZXdUYWIgPSAnY2xvdWQnIHwgJ2ZyZXF1ZW5jeSc7XG5cbmV4cG9ydCBjbGFzcyBOb3RlV29yZENsb3VkVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgcHJpdmF0ZSByZWFkb25seSBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXM7XG4gIHByaXZhdGUgcmVuZGVyTm9uY2UgPSAwO1xuICBwcml2YXRlIHNlbGVjdGVkRmlsZVBhdGggPSAnJztcbiAgcHJpdmF0ZSBhY3RpdmVUYWI6IE5vdGVWaWV3VGFiID0gJ2Nsb3VkJztcbiAgcHJpdmF0ZSBsYXRlc3RXb3JkczogV2VpZ2h0ZWRXb3JkW10gPSBbXTtcbiAgcHJpdmF0ZSBsYXRlc3RDb250ZXh0TGFiZWwgPSAnY3VycmVudCBmaWx0ZXJzJztcbiAgcHJpdmF0ZSBmcmVxdWVuY3lSZW5kZXJlZCA9IGZhbHNlO1xuICBwcml2YXRlIGNsb3VkQ2FudmFzRWw6IEhUTUxEaXZFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZnJlcXVlbmN5Q2FudmFzRWw6IEhUTUxEaXZFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgY2xvdWRUYWJCdXR0b25FbDogSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBmcmVxdWVuY3lUYWJCdXR0b25FbDogSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBmaWx0ZXJzOiBXb3JkQ2xvdWRGaWx0ZXJTZXR0aW5ncztcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXMpIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgICB0aGlzLnNlcnZpY2VzID0gc2VydmljZXM7XG4gICAgdGhpcy5maWx0ZXJzID0gc2VydmljZXMuZ2V0RmlsdGVyU2V0dGluZ3MoKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQ7XG4gIH1cblxuICBnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnTm90ZSB3b3JkIGNsb3Vkcyc7XG4gIH1cblxuICBnZXRJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdmaWxlLXRleHQnO1xuICB9XG5cbiAgYXN5bmMgb25PcGVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIGNvbnRlbnRFbC5lbXB0eSgpO1xuICAgIGNvbnRlbnRFbC5hZGRDbGFzcygndmF1bHQtd29yZC1jbG91ZC12aWV3Jyk7XG5cbiAgICB0aGlzLmZpbHRlcnMgPSB0aGlzLnNlcnZpY2VzLmdldEZpbHRlclNldHRpbmdzKCk7XG5cbiAgICBjb25zdCB0b3BFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRvcCcgfSk7XG4gICAgY29uc3QgaGVhZGVyRWwgPSB0b3BFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWhlYWRlcicgfSk7XG4gICAgaGVhZGVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnTm90ZSB3b3JkIGNsb3VkcycsIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtdGl0bGUnIH0pO1xuXG4gICAgY29uc3QgY29udHJvbHNFbCA9IHRvcEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY29udHJvbHMnIH0pO1xuXG4gICAgY29uc3Qgbm90ZUNvbnRyb2xzRWwgPSBjb250cm9sc0VsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtZmlsdGVyLXNlY3Rpb24nIH0pO1xuICAgIGNvbnN0IG5vdGVIZWFkZXJFbCA9IG5vdGVDb250cm9sc0VsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY29udHJvbHMtaGVhZGVyJyB9KTtcbiAgICBub3RlSGVhZGVyRWwuY3JlYXRlRWwoJ3NwYW4nLCB7IHRleHQ6ICdOb3RlIHBpY2tlcicsIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY29udHJvbHMtdGl0bGUnIH0pO1xuICAgIG5vdGVIZWFkZXJFbC5jcmVhdGVFbCgnc3BhbicsIHtcbiAgICAgIHRleHQ6ICdVc2VkIHdoZW4gc2NvcGUgaXMgQWN0aXZlIG5vdGUgb25seScsXG4gICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNvbnRyb2xzLXN1bW1hcnknLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgbm90ZUdyaWRFbCA9IG5vdGVDb250cm9sc0VsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtZmlsdGVyLWdyaWQnIH0pO1xuICAgIGNvbnN0IGZpbGVGaWx0ZXJFbCA9IG5vdGVHcmlkRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10YWctZmlsdGVyJyB9KTtcbiAgICBjb25zdCBmaWxlTGFiZWxFbCA9IGZpbGVGaWx0ZXJFbC5jcmVhdGVFbCgnbGFiZWwnLCB7IHRleHQ6ICdPcGVuIG5vdGUnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRhZy1sYWJlbCcgfSk7XG4gICAgY29uc3QgZmlsZVNlbGVjdEVsID0gZmlsZUZpbHRlckVsLmNyZWF0ZUVsKCdzZWxlY3QnLCB7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtbW9kZS1zZWxlY3QnIH0pO1xuICAgIGZpbGVTZWxlY3RFbC5pZCA9ICd2YXVsdC13b3JkLWNsb3VkLW5vdGUtc2VsZWN0JztcbiAgICBmaWxlTGFiZWxFbC5zZXRBdHRyKCdmb3InLCBmaWxlU2VsZWN0RWwuaWQpO1xuICAgIGZpbGVTZWxlY3RFbC5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ0Nob29zZSBhbiBvcGVuIG5vdGUnKTtcblxuICAgIGNvbnN0IG5vdGVBY3Rpb25zRWwgPSBub3RlR3JpZEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtbWF0Y2gtbW9kZScgfSk7XG4gICAgbm90ZUFjdGlvbnNFbC5jcmVhdGVFbCgnc3BhbicsIHsgdGV4dDogJ0FjdGlvbnMnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRhZy1sYWJlbCcgfSk7XG5cbiAgICBjb25zdCBhY3RpdmVCdXR0b24gPSBub3RlQWN0aW9uc0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICB0ZXh0OiAnVXNlIGFjdGl2ZSBub3RlJyxcbiAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtcmVmcmVzaCcsXG4gICAgfSk7XG4gICAgYWN0aXZlQnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICBhY3RpdmVCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsICdVc2UgYWN0aXZlIG5vdGUnKTtcblxuICAgIGNvbnN0IHJlZnJlc2hCdXR0b24gPSBub3RlQWN0aW9uc0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICB0ZXh0OiAnUmVmcmVzaCcsXG4gICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXJlZnJlc2gnLFxuICAgIH0pO1xuICAgIHJlZnJlc2hCdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIHJlZnJlc2hCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsICdSZWZyZXNoIG5vdGUgaW5zaWdodHMnKTtcblxuICAgIGxldCBmaWx0ZXJQYW5lbDogV29yZENsb3VkRmlsdGVyUGFuZWw7XG4gICAgY29uc3QgcGVyc2lzdEZpbHRlcnNBbmRSZW5kZXIgPSBhc3luYyAobmV4dEZpbHRlcnM6IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICB0aGlzLmZpbHRlcnMgPSBuZXh0RmlsdGVycztcbiAgICAgIGF3YWl0IHRoaXMuc2VydmljZXMudXBkYXRlRmlsdGVyU2V0dGluZ3ModGhpcy5maWx0ZXJzKTtcbiAgICAgIHRoaXMuZmlsdGVycyA9IHRoaXMuc2VydmljZXMuZ2V0RmlsdGVyU2V0dGluZ3MoKTtcbiAgICAgIGZpbHRlclBhbmVsLnNldEZpbHRlcnModGhpcy5maWx0ZXJzKTtcbiAgICAgIGF3YWl0IHRoaXMucmVuZGVyQ2xvdWQoY2xvdWRDYW52YXNFbCk7XG4gICAgfTtcblxuICAgIGZpbHRlclBhbmVsID0gbmV3IFdvcmRDbG91ZEZpbHRlclBhbmVsKHtcbiAgICAgIHNlcnZpY2VzOiB0aGlzLnNlcnZpY2VzLFxuICAgICAgY29udGFpbmVyRWw6IGNvbnRyb2xzRWwsXG4gICAgICByZWdpc3RlckRvbUV2ZW50OiAoZWxlbWVudCwgdHlwZSwgY2FsbGJhY2spID0+IHRoaXMucmVnaXN0ZXJEb21FdmVudChlbGVtZW50LCB0eXBlLCBjYWxsYmFjayksXG4gICAgICBmaWx0ZXJzOiB0aGlzLmZpbHRlcnMsXG4gICAgICBvbkNoYW5nZTogcGVyc2lzdEZpbHRlcnNBbmRSZW5kZXIsXG4gICAgfSk7XG5cbiAgICBjb25zdCB0YWJzRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAnbm90ZS13b3JkLWNsb3VkLXRhYnMnIH0pO1xuICAgIHRhYnNFbC5zZXRBdHRyKCdyb2xlJywgJ3RhYmxpc3QnKTtcbiAgICB0YWJzRWwuc2V0QXR0cignYXJpYS1sYWJlbCcsICdOb3RlIHdvcmQgY2xvdWQgdmlzdWFsaXphdGlvbnMnKTtcblxuICAgIGNvbnN0IGNsb3VkVGFiQnV0dG9uID0gdGFic0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICBjbHM6ICdub3RlLXdvcmQtY2xvdWQtdGFiIGlzLWFjdGl2ZScsXG4gICAgICB0ZXh0OiAnV29yZCBjbG91ZCcsXG4gICAgfSk7XG4gICAgY2xvdWRUYWJCdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIGNsb3VkVGFiQnV0dG9uLmlkID0gJ25vdGUtd29yZC1jbG91ZC10YWItY2xvdWQnO1xuICAgIGNsb3VkVGFiQnV0dG9uLnNldEF0dHIoJ3JvbGUnLCAndGFiJyk7XG4gICAgY2xvdWRUYWJCdXR0b24uc2V0QXR0cignYXJpYS1jb250cm9scycsICdub3RlLXdvcmQtY2xvdWQtcGFuZWwtY2xvdWQnKTtcbiAgICBjbG91ZFRhYkJ1dHRvbi5zZXRBdHRyKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcbiAgICBjbG91ZFRhYkJ1dHRvbi5zZXRBdHRyKCd0YWJpbmRleCcsICcwJyk7XG5cbiAgICBjb25zdCBmcmVxdWVuY3lUYWJCdXR0b24gPSB0YWJzRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIGNsczogJ25vdGUtd29yZC1jbG91ZC10YWInLFxuICAgICAgdGV4dDogJ0ZyZXF1ZW5jeScsXG4gICAgfSk7XG4gICAgZnJlcXVlbmN5VGFiQnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICBmcmVxdWVuY3lUYWJCdXR0b24uaWQgPSAnbm90ZS13b3JkLWNsb3VkLXRhYi1mcmVxdWVuY3knO1xuICAgIGZyZXF1ZW5jeVRhYkJ1dHRvbi5zZXRBdHRyKCdyb2xlJywgJ3RhYicpO1xuICAgIGZyZXF1ZW5jeVRhYkJ1dHRvbi5zZXRBdHRyKCdhcmlhLWNvbnRyb2xzJywgJ25vdGUtd29yZC1jbG91ZC1wYW5lbC1mcmVxdWVuY3knKTtcbiAgICBmcmVxdWVuY3lUYWJCdXR0b24uc2V0QXR0cignYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpO1xuICAgIGZyZXF1ZW5jeVRhYkJ1dHRvbi5zZXRBdHRyKCd0YWJpbmRleCcsICctMScpO1xuXG4gICAgY29uc3QgcGFuZWxzRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAnbm90ZS13b3JkLWNsb3VkLXBhbmVscycgfSk7XG5cbiAgICBjb25zdCBjbG91ZFBhbmVsRWwgPSBwYW5lbHNFbC5jcmVhdGVEaXYoeyBjbHM6ICdub3RlLXdvcmQtY2xvdWQtcGFuZWwgaXMtYWN0aXZlJyB9KTtcbiAgICBjbG91ZFBhbmVsRWwuaWQgPSAnbm90ZS13b3JkLWNsb3VkLXBhbmVsLWNsb3VkJztcbiAgICBjbG91ZFBhbmVsRWwuc2V0QXR0cigncm9sZScsICd0YWJwYW5lbCcpO1xuICAgIGNsb3VkUGFuZWxFbC5zZXRBdHRyKCdhcmlhLWxhYmVsbGVkYnknLCBjbG91ZFRhYkJ1dHRvbi5pZCk7XG5cbiAgICBjb25zdCBmcmVxdWVuY3lQYW5lbEVsID0gcGFuZWxzRWwuY3JlYXRlRGl2KHsgY2xzOiAnbm90ZS13b3JkLWNsb3VkLXBhbmVsJyB9KTtcbiAgICBmcmVxdWVuY3lQYW5lbEVsLmlkID0gJ25vdGUtd29yZC1jbG91ZC1wYW5lbC1mcmVxdWVuY3knO1xuICAgIGZyZXF1ZW5jeVBhbmVsRWwuc2V0QXR0cigncm9sZScsICd0YWJwYW5lbCcpO1xuICAgIGZyZXF1ZW5jeVBhbmVsRWwuc2V0QXR0cignYXJpYS1sYWJlbGxlZGJ5JywgZnJlcXVlbmN5VGFiQnV0dG9uLmlkKTtcbiAgICBmcmVxdWVuY3lQYW5lbEVsLnNldEF0dHIoJ2hpZGRlbicsICcnKTtcblxuICAgIGNvbnN0IGNsb3VkQ2FudmFzRWwgPSBjbG91ZFBhbmVsRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1jYW52YXMnIH0pO1xuICAgIGNvbnN0IGZyZXF1ZW5jeUNhbnZhc0VsID0gZnJlcXVlbmN5UGFuZWxFbC5jcmVhdGVEaXYoeyBjbHM6ICdub3RlLXdvcmQtY2xvdWQtZnJlcXVlbmN5LWNhbnZhcycgfSk7XG5cbiAgICB0aGlzLmNsb3VkQ2FudmFzRWwgPSBjbG91ZENhbnZhc0VsO1xuICAgIHRoaXMuZnJlcXVlbmN5Q2FudmFzRWwgPSBmcmVxdWVuY3lDYW52YXNFbDtcbiAgICB0aGlzLmNsb3VkVGFiQnV0dG9uRWwgPSBjbG91ZFRhYkJ1dHRvbjtcbiAgICB0aGlzLmZyZXF1ZW5jeVRhYkJ1dHRvbkVsID0gZnJlcXVlbmN5VGFiQnV0dG9uO1xuXG4gICAgdGhpcy51cGRhdGVPcGVuRmlsZU9wdGlvbnMoZmlsZVNlbGVjdEVsKTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChmaWxlU2VsZWN0RWwsICdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZVBhdGggPSBmaWxlU2VsZWN0RWwudmFsdWU7XG4gICAgICBpZiAodGhpcy5maWx0ZXJzLnNjb3BlLm1vZGUgIT09ICdhY3RpdmUtZmlsZScpIHtcbiAgICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNsb3VkQ2FudmFzRWwpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZvaWQgcGVyc2lzdEZpbHRlcnNBbmRSZW5kZXIoe1xuICAgICAgICAuLi50aGlzLmZpbHRlcnMsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgLi4udGhpcy5maWx0ZXJzLnNjb3BlLFxuICAgICAgICAgIG1vZGU6ICdhY3RpdmUtZmlsZScsXG4gICAgICAgICAgYWN0aXZlRmlsZVBhdGg6IHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KGFjdGl2ZUJ1dHRvbiwgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aXZlRmlsZSA9IHRoaXMuc2VydmljZXMuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKGFjdGl2ZUZpbGUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gYWN0aXZlRmlsZS5wYXRoO1xuICAgICAgICB0aGlzLnVwZGF0ZU9wZW5GaWxlT3B0aW9ucyhmaWxlU2VsZWN0RWwpO1xuICAgICAgICBmaWxlU2VsZWN0RWwudmFsdWUgPSB0aGlzLnNlbGVjdGVkRmlsZVBhdGg7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmZpbHRlcnMuc2NvcGUubW9kZSAhPT0gJ2FjdGl2ZS1maWxlJykge1xuICAgICAgICB2b2lkIHRoaXMucmVuZGVyQ2xvdWQoY2xvdWRDYW52YXNFbCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdm9pZCBwZXJzaXN0RmlsdGVyc0FuZFJlbmRlcih7XG4gICAgICAgIC4uLnRoaXMuZmlsdGVycyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAuLi50aGlzLmZpbHRlcnMuc2NvcGUsXG4gICAgICAgICAgbW9kZTogJ2FjdGl2ZS1maWxlJyxcbiAgICAgICAgICBhY3RpdmVGaWxlUGF0aDogdGhpcy5zZWxlY3RlZEZpbGVQYXRoLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQocmVmcmVzaEJ1dHRvbiwgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVPcGVuRmlsZU9wdGlvbnMoZmlsZVNlbGVjdEVsKTtcbiAgICAgIGlmICghZmlsZVNlbGVjdEVsLnZhbHVlICYmIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZVBhdGggPSAnJztcbiAgICAgIH1cbiAgICAgIHZvaWQgdGhpcy5yZW5kZXJDbG91ZChjbG91ZENhbnZhc0VsKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChjbG91ZFRhYkJ1dHRvbiwgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5zd2l0Y2hUYWIoJ2Nsb3VkJywgY2xvdWRQYW5lbEVsLCBmcmVxdWVuY3lQYW5lbEVsKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChmcmVxdWVuY3lUYWJCdXR0b24sICdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuc3dpdGNoVGFiKCdmcmVxdWVuY3knLCBjbG91ZFBhbmVsRWwsIGZyZXF1ZW5jeVBhbmVsRWwpO1xuICAgICAgdGhpcy5yZW5kZXJGcmVxdWVuY3lDaGFydCh0cnVlKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChjbG91ZFRhYkJ1dHRvbiwgJ2tleWRvd24nLCAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd1JpZ2h0Jykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBmcmVxdWVuY3lUYWJCdXR0b24uZm9jdXMoKTtcbiAgICAgICAgdGhpcy5zd2l0Y2hUYWIoJ2ZyZXF1ZW5jeScsIGNsb3VkUGFuZWxFbCwgZnJlcXVlbmN5UGFuZWxFbCk7XG4gICAgICAgIHRoaXMucmVuZGVyRnJlcXVlbmN5Q2hhcnQodHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoZnJlcXVlbmN5VGFiQnV0dG9uLCAna2V5ZG93bicsIChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93TGVmdCcpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2xvdWRUYWJCdXR0b24uZm9jdXMoKTtcbiAgICAgICAgdGhpcy5zd2l0Y2hUYWIoJ2Nsb3VkJywgY2xvdWRQYW5lbEVsLCBmcmVxdWVuY3lQYW5lbEVsKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ2FjdGl2ZS1sZWFmLWNoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLnNlcnZpY2VzLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghYWN0aXZlRmlsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkRmlsZVBhdGggIT09IGFjdGl2ZUZpbGUucGF0aCkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZVBhdGggPSBhY3RpdmVGaWxlLnBhdGg7XG4gICAgICAgIHRoaXMudXBkYXRlT3BlbkZpbGVPcHRpb25zKGZpbGVTZWxlY3RFbCk7XG4gICAgICAgIGZpbGVTZWxlY3RFbC52YWx1ZSA9IHRoaXMuc2VsZWN0ZWRGaWxlUGF0aDtcblxuICAgICAgICBpZiAodGhpcy5maWx0ZXJzLnNjb3BlLm1vZGUgPT09ICdhY3RpdmUtZmlsZScpIHtcbiAgICAgICAgICB2b2lkIHBlcnNpc3RGaWx0ZXJzQW5kUmVuZGVyKHtcbiAgICAgICAgICAgIC4uLnRoaXMuZmlsdGVycyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgIC4uLnRoaXMuZmlsdGVycy5zY29wZSxcbiAgICAgICAgICAgICAgbW9kZTogJ2FjdGl2ZS1maWxlJyxcbiAgICAgICAgICAgICAgYWN0aXZlRmlsZVBhdGg6IHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNsb3VkQ2FudmFzRWwpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIGF3YWl0IHRoaXMucmVuZGVyQ2xvdWQoY2xvdWRDYW52YXNFbCk7XG4gIH1cblxuICBvbkNsb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuY2xvdWRDYW52YXNFbCA9IG51bGw7XG4gICAgdGhpcy5mcmVxdWVuY3lDYW52YXNFbCA9IG51bGw7XG4gICAgdGhpcy5jbG91ZFRhYkJ1dHRvbkVsID0gbnVsbDtcbiAgICB0aGlzLmZyZXF1ZW5jeVRhYkJ1dHRvbkVsID0gbnVsbDtcbiAgfVxuXG4gIGFzeW5jIG9uUmVzaXplKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmFjdGl2ZVRhYiA9PT0gJ2Nsb3VkJyAmJiB0aGlzLmNsb3VkQ2FudmFzRWwpIHtcbiAgICAgIGF3YWl0IHRoaXMucmVuZGVyQ2xvdWQodGhpcy5jbG91ZENhbnZhc0VsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hY3RpdmVUYWIgPT09ICdmcmVxdWVuY3knKSB7XG4gICAgICB0aGlzLnJlbmRlckZyZXF1ZW5jeUNoYXJ0KHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3dpdGNoVGFiKHRhYjogTm90ZVZpZXdUYWIsIGNsb3VkUGFuZWxFbDogSFRNTERpdkVsZW1lbnQsIGZyZXF1ZW5jeVBhbmVsRWw6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XG4gICAgdGhpcy5hY3RpdmVUYWIgPSB0YWI7XG4gICAgY29uc3Qgc2hvd0Nsb3VkID0gdGFiID09PSAnY2xvdWQnO1xuXG4gICAgdGhpcy5jbG91ZFRhYkJ1dHRvbkVsPy50b2dnbGVDbGFzcygnaXMtYWN0aXZlJywgc2hvd0Nsb3VkKTtcbiAgICB0aGlzLmNsb3VkVGFiQnV0dG9uRWw/LnNldEF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCBzaG93Q2xvdWQgPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgICB0aGlzLmNsb3VkVGFiQnV0dG9uRWw/LnNldEF0dHIoJ3RhYmluZGV4Jywgc2hvd0Nsb3VkID8gJzAnIDogJy0xJyk7XG5cbiAgICB0aGlzLmZyZXF1ZW5jeVRhYkJ1dHRvbkVsPy50b2dnbGVDbGFzcygnaXMtYWN0aXZlJywgIXNob3dDbG91ZCk7XG4gICAgdGhpcy5mcmVxdWVuY3lUYWJCdXR0b25FbD8uc2V0QXR0cignYXJpYS1zZWxlY3RlZCcsIHNob3dDbG91ZCA/ICdmYWxzZScgOiAndHJ1ZScpO1xuICAgIHRoaXMuZnJlcXVlbmN5VGFiQnV0dG9uRWw/LnNldEF0dHIoJ3RhYmluZGV4Jywgc2hvd0Nsb3VkID8gJy0xJyA6ICcwJyk7XG5cbiAgICBjbG91ZFBhbmVsRWwudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScsIHNob3dDbG91ZCk7XG4gICAgZnJlcXVlbmN5UGFuZWxFbC50b2dnbGVDbGFzcygnaXMtYWN0aXZlJywgIXNob3dDbG91ZCk7XG5cbiAgICBpZiAoc2hvd0Nsb3VkKSB7XG4gICAgICBjbG91ZFBhbmVsRWwucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICAgIGZyZXF1ZW5jeVBhbmVsRWwuc2V0QXR0cignaGlkZGVuJywgJycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNsb3VkUGFuZWxFbC5zZXRBdHRyKCdoaWRkZW4nLCAnJyk7XG4gICAgZnJlcXVlbmN5UGFuZWxFbC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVPcGVuRmlsZU9wdGlvbnMoc2VsZWN0RWw6IEhUTUxTZWxlY3RFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3Qgb3BlbkZpbGVzID0gdGhpcy5zZXJ2aWNlcy5nZXRPcGVuTWFya2Rvd25GaWxlcygpO1xuICAgIGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLnNlcnZpY2VzLmdldEFjdGl2ZUZpbGUoKTtcblxuICAgIGlmICghdGhpcy5zZWxlY3RlZEZpbGVQYXRoICYmIGFjdGl2ZUZpbGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCA9IGFjdGl2ZUZpbGUucGF0aDtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWRGaWxlUGF0aDtcbiAgICBzZWxlY3RFbC5lbXB0eSgpO1xuXG4gICAgaWYgKG9wZW5GaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHNlbGVjdEVsLmNyZWF0ZUVsKCdvcHRpb24nLCB7IHRleHQ6ICdObyBvcGVuIG1hcmtkb3duIG5vdGVzJywgdmFsdWU6ICcnIH0pO1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gJyc7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIG9wZW5GaWxlcykge1xuICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdGV4dDogZmlsZS5wYXRoLCB2YWx1ZTogZmlsZS5wYXRoIH0pO1xuICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmlsZS5wYXRoID09PSBzZWxlY3RlZDtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGVkRmlsZVBhdGggPSBzZWxlY3RFbC52YWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzb2x2ZVNjb3BlRmlsZVBhdGgoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGVQYXRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEZpbGVQYXRoO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZpbHRlcnMuc2NvcGUuYWN0aXZlRmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbHRlcnMuc2NvcGUuYWN0aXZlRmlsZVBhdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VydmljZXMuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoID8/ICcnO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kU2VsZWN0ZWRPcGVuRmlsZSgpOiBURmlsZSB8IG51bGwge1xuICAgIGNvbnN0IHNjb3BlRmlsZVBhdGggPSB0aGlzLnJlc29sdmVTY29wZUZpbGVQYXRoKCk7XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZXMuZ2V0T3Blbk1hcmtkb3duRmlsZXMoKS5maW5kKChmaWxlKSA9PiBmaWxlLnBhdGggPT09IHNjb3BlRmlsZVBhdGgpID8/IG51bGw7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJlbmRlckNsb3VkKGNvbnRhaW5lckVsOiBIVE1MRGl2RWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGFjdGl2ZU5vbmNlID0gKyt0aGlzLnJlbmRlck5vbmNlO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgY29uc3QgbG9hZGluZ0VsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsIHRleHQ6ICdCdWlsZGluZyBjbG91ZC4uLicgfSk7XG4gICAgY29uc3QgdXBkYXRlUHJvZ3Jlc3MgPSAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGlmIChhY3RpdmVOb25jZSAhPT0gdGhpcy5yZW5kZXJOb25jZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsb2FkaW5nRWwuc2V0VGV4dChgJHttZXNzYWdlfSAoJHtwZXJjZW50fSUpYCk7XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBzY29wZUZpbGVQYXRoID0gdGhpcy5yZXNvbHZlU2NvcGVGaWxlUGF0aCgpO1xuICAgICAgY29uc3Qgc2VsZWN0ZWRGaWxlID0gdGhpcy5maW5kU2VsZWN0ZWRPcGVuRmlsZSgpO1xuXG4gICAgICBjb25zdCB3b3JkcyA9IGF3YWl0IHRoaXMuc2VydmljZXMuY29sbGVjdFZhdWx0V29yZHMoe1xuICAgICAgICBzb3VyY2VSdWxlczoge1xuICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAuLi50aGlzLmZpbHRlcnMuc2NvcGUsXG4gICAgICAgICAgICBhY3RpdmVGaWxlUGF0aDogc2NvcGVGaWxlUGF0aCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGluY2x1ZGVUYWdzOiB0aGlzLmZpbHRlcnMuaW5jbHVkZVRhZ3MsXG4gICAgICAgICAgZXhjbHVkZVRhZ3M6IHRoaXMuZmlsdGVycy5leGNsdWRlVGFncyxcbiAgICAgICAgICB0YWdNYXRjaE1vZGU6IHRoaXMuZmlsdGVycy50YWdNYXRjaE1vZGUsXG4gICAgICAgICAgZnJvbnRtYXR0ZXJSdWxlczogdGhpcy5maWx0ZXJzLmZyb250bWF0dGVyUnVsZXMsXG4gICAgICAgIH0sXG4gICAgICAgIGZyZXF1ZW5jeTogdGhpcy5maWx0ZXJzLmZyZXF1ZW5jeSxcbiAgICAgIH0sIHVwZGF0ZVByb2dyZXNzKTtcblxuICAgICAgaWYgKHdvcmRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLmxhdGVzdFdvcmRzID0gW107XG4gICAgICAgIHRoaXMubGF0ZXN0Q29udGV4dExhYmVsID0gdGhpcy5maWx0ZXJzLnNjb3BlLm1vZGUgPT09ICdhY3RpdmUtZmlsZScgJiYgc2VsZWN0ZWRGaWxlXG4gICAgICAgICAgPyBzZWxlY3RlZEZpbGUuYmFzZW5hbWVcbiAgICAgICAgICA6ICdzZWxlY3RlZCBmaWx0ZXJzJztcbiAgICAgICAgdGhpcy5mcmVxdWVuY3lSZW5kZXJlZCA9IGZhbHNlO1xuICAgICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG5cbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJyxcbiAgICAgICAgICB0ZXh0OiB0aGlzLmZpbHRlcnMuc2NvcGUubW9kZSA9PT0gJ2FjdGl2ZS1maWxlJyAmJiAhc2NvcGVGaWxlUGF0aFxuICAgICAgICAgICAgPyAnT3BlbiBhIG1hcmtkb3duIG5vdGUgYW5kIHNlbGVjdCBpdCB0byB2aWV3IGEgbm90ZS1zcGVjaWZpYyB3b3JkIGNsb3VkLidcbiAgICAgICAgICAgIDogJ05vIHdvcmRzIGZvdW5kIGZvciB0aGUgc2VsZWN0ZWQgZmlsdGVycy4nLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5hY3RpdmVUYWIgPT09ICdmcmVxdWVuY3knKSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJGcmVxdWVuY3lDaGFydCh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5sYXRlc3RXb3JkcyA9IHdvcmRzO1xuICAgICAgdGhpcy5sYXRlc3RDb250ZXh0TGFiZWwgPSB0aGlzLmZpbHRlcnMuc2NvcGUubW9kZSA9PT0gJ2FjdGl2ZS1maWxlJyAmJiBzZWxlY3RlZEZpbGVcbiAgICAgICAgPyBzZWxlY3RlZEZpbGUuYmFzZW5hbWVcbiAgICAgICAgOiAnc2VsZWN0ZWQgZmlsdGVycyc7XG4gICAgICB0aGlzLmZyZXF1ZW5jeVJlbmRlcmVkID0gZmFsc2U7XG5cbiAgICAgIGF3YWl0IHRoaXMuc2VydmljZXMuZHJhd1dvcmRDbG91ZCh7XG4gICAgICAgIGNvbnRhaW5lckVsLFxuICAgICAgICB3b3JkcyxcbiAgICAgICAgYXJpYUxhYmVsOiB0aGlzLmZpbHRlcnMuc2NvcGUubW9kZSA9PT0gJ2FjdGl2ZS1maWxlJyAmJiBzZWxlY3RlZEZpbGVcbiAgICAgICAgICA/IGBXb3JkIGNsb3VkIGZvciAke3NlbGVjdGVkRmlsZS5iYXNlbmFtZX1gXG4gICAgICAgICAgOiAnV29yZCBjbG91ZCBmb3Igc2VsZWN0ZWQgZmlsdGVycycsXG4gICAgICAgIG9uUHJvZ3Jlc3M6IHVwZGF0ZVByb2dyZXNzLFxuICAgICAgICBvblJlZnJlc2g6ICgpID0+IHRoaXMucmVuZGVyQ2xvdWQoY29udGFpbmVyRWwpLFxuICAgICAgICBvbkV4Y2x1ZGVJblZhdWx0OiBhc3luYyAod29yZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFkZGVkID0gYXdhaXQgdGhpcy5zZXJ2aWNlcy5hZGRCbGFja2xpc3RXb3JkKHdvcmQpO1xuICAgICAgICAgIG5ldyBOb3RpY2UoYWRkZWQgPyBgRXhjbHVkZWQgXCIke3dvcmR9XCIgZnJvbSB3b3JkIGNsb3Vkcy5gIDogYFwiJHt3b3JkfVwiIGlzIGFscmVhZHkgZXhjbHVkZWQuYCk7XG4gICAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJDbG91ZChjb250YWluZXJFbCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV29yZENsaWNrOiAod29yZCkgPT4ge1xuICAgICAgICAgIHZvaWQgdGhpcy5zZXJ2aWNlcy5vcGVuU2VhcmNoRm9yV29yZCh3b3JkLCB7XG4gICAgICAgICAgICBpbmNsdWRlVGFnczogdGhpcy5maWx0ZXJzLmluY2x1ZGVUYWdzLFxuICAgICAgICAgICAgZXhjbHVkZVRhZ3M6IHRoaXMuZmlsdGVycy5leGNsdWRlVGFncyxcbiAgICAgICAgICAgIHRhZ01hdGNoTW9kZTogdGhpcy5maWx0ZXJzLnRhZ01hdGNoTW9kZSxcbiAgICAgICAgICAgIGZpbGVQYXRoOiB0aGlzLmZpbHRlcnMuc2NvcGUubW9kZSA9PT0gJ2FjdGl2ZS1maWxlJ1xuICAgICAgICAgICAgICA/IHNjb3BlRmlsZVBhdGhcbiAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgaWYgKGFjdGl2ZU5vbmNlICE9PSB0aGlzLnJlbmRlck5vbmNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuXG4gICAgICBpZiAodGhpcy5hY3RpdmVUYWIgPT09ICdmcmVxdWVuY3knKSB7XG4gICAgICAgIHRoaXMucmVuZGVyRnJlcXVlbmN5Q2hhcnQodHJ1ZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdGUgd29yZCBjbG91ZDogZmFpbGVkIHRvIHJlbmRlciBjbG91ZCcsIGVycm9yKTtcbiAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdih7XG4gICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLFxuICAgICAgICB0ZXh0OiAnQ291bGQgbm90IHJlbmRlciB0aGUgd29yZCBjbG91ZC4gT3BlbiBkZXZlbG9wZXIgY29uc29sZSBmb3IgZGV0YWlscy4nLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJGcmVxdWVuY3lDaGFydChmb3JjZSA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmZyZXF1ZW5jeUNhbnZhc0VsIHx8ICghZm9yY2UgJiYgdGhpcy5mcmVxdWVuY3lSZW5kZXJlZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmZyZXF1ZW5jeUNhbnZhc0VsLmVtcHR5KCk7XG5cbiAgICBpZiAodGhpcy5sYXRlc3RXb3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuZnJlcXVlbmN5Q2FudmFzRWwuY3JlYXRlRGl2KHtcbiAgICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsXG4gICAgICAgIHRleHQ6ICdObyB3b3JkcyBmb3VuZCBmb3IgdGhlIHNlbGVjdGVkIGZpbHRlcnMuJyxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5mcmVxdWVuY3lSZW5kZXJlZCA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZHJhd0ZyZXF1ZW5jeUNoYXJ0KHtcbiAgICAgIGNvbnRhaW5lckVsOiB0aGlzLmZyZXF1ZW5jeUNhbnZhc0VsLFxuICAgICAgd29yZHM6IHRoaXMubGF0ZXN0V29yZHMsXG4gICAgICBhcmlhTGFiZWw6IGBXb3JkIGZyZXF1ZW5jeSBjaGFydCBmb3IgJHt0aGlzLmxhdGVzdENvbnRleHRMYWJlbH1gLFxuICAgIH0pO1xuXG4gICAgdGhpcy5mcmVxdWVuY3lSZW5kZXJlZCA9IHRydWU7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBzY2FsZUJhbmQsIHNjYWxlTGluZWFyIH0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB0eXBlIHsgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG50eXBlIEZyZXF1ZW5jeUNoYXJ0UmVuZGVyT3B0aW9ucyA9IHtcbiAgY29udGFpbmVyRWw6IEhUTUxEaXZFbGVtZW50O1xuICB3b3JkczogV2VpZ2h0ZWRXb3JkW107XG4gIGFyaWFMYWJlbDogc3RyaW5nO1xufTtcblxudHlwZSBTb3J0ZWRXb3JkID0ge1xuICB0ZXh0OiBzdHJpbmc7XG4gIGNvdW50OiBudW1iZXI7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZHJhd0ZyZXF1ZW5jeUNoYXJ0KG9wdGlvbnM6IEZyZXF1ZW5jeUNoYXJ0UmVuZGVyT3B0aW9ucyk6IHZvaWQge1xuICBjb25zdCB7IGNvbnRhaW5lckVsLCB3b3JkcywgYXJpYUxhYmVsIH0gPSBvcHRpb25zO1xuXG4gIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgY29uc3Qgc29ydGVkV29yZHMgPSB3b3Jkc1xuICAgIC5tYXAoKGVudHJ5KSA9PiAoeyB0ZXh0OiBlbnRyeS50ZXh0LCBjb3VudDogZW50cnkuY291bnQgfSkpXG4gICAgLnNvcnQoKGEsIGIpID0+IGIuY291bnQgLSBhLmNvdW50IHx8IGEudGV4dC5sb2NhbGVDb21wYXJlKGIudGV4dCkpO1xuXG4gIGlmIChzb3J0ZWRXb3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoe1xuICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsXG4gICAgICB0ZXh0OiAnTm8gZnJlcXVlbmN5IGRhdGEgYXZhaWxhYmxlLicsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgd2lkdGggPSBNYXRoLm1heChjb250YWluZXJFbC5jbGllbnRXaWR0aCwgMzIwKTtcbiAgY29uc3QgbG9uZ2VzdExhYmVsTGVuZ3RoID0gc29ydGVkV29yZHMucmVkdWNlKChtYXhDaGFycywgZW50cnkpID0+IHtcbiAgICByZXR1cm4gTWF0aC5tYXgobWF4Q2hhcnMsIGVudHJ5LnRleHQubGVuZ3RoKTtcbiAgfSwgMCk7XG5cbiAgY29uc3QgbWFyZ2luID0ge1xuICAgIHRvcDogOCxcbiAgICByaWdodDogNTYsXG4gICAgYm90dG9tOiA4LFxuICAgIGxlZnQ6IE1hdGgubWluKDI4MCwgTWF0aC5tYXgoMTIwLCBNYXRoLnJvdW5kKGxvbmdlc3RMYWJlbExlbmd0aCAqIDcuMikpKSxcbiAgfTtcblxuICBjb25zdCByb3dIZWlnaHQgPSAyMjtcbiAgY29uc3QgY2hhcnRIZWlnaHQgPSBNYXRoLm1heCgxMjAsIHNvcnRlZFdvcmRzLmxlbmd0aCAqIHJvd0hlaWdodCk7XG4gIGNvbnN0IHRvdGFsSGVpZ2h0ID0gbWFyZ2luLnRvcCArIGNoYXJ0SGVpZ2h0ICsgbWFyZ2luLmJvdHRvbTtcblxuICBjb25zdCB4ID0gc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oWzAsIHNvcnRlZFdvcmRzWzBdPy5jb3VudCA/PyAxXSlcbiAgICAucmFuZ2UoW21hcmdpbi5sZWZ0LCB3aWR0aCAtIG1hcmdpbi5yaWdodF0pO1xuXG4gIGNvbnN0IHkgPSBzY2FsZUJhbmQ8c3RyaW5nPigpXG4gICAgLmRvbWFpbihzb3J0ZWRXb3Jkcy5tYXAoKGVudHJ5KSA9PiBlbnRyeS50ZXh0KSlcbiAgICAucmFuZ2UoW21hcmdpbi50b3AsIG1hcmdpbi50b3AgKyBjaGFydEhlaWdodF0pXG4gICAgLnBhZGRpbmdJbm5lcigwLjIpO1xuXG4gIGNvbnN0IHN2ZyA9IHNlbGVjdChjb250YWluZXJFbClcbiAgICAuYXBwZW5kKCdzdmcnKVxuICAgIC5hdHRyKCdjbGFzcycsICdub3RlLXdvcmQtY2xvdWQtZnJlcXVlbmN5LXN2ZycpXG4gICAgLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgLmF0dHIoJ2hlaWdodCcsIHRvdGFsSGVpZ2h0KVxuICAgIC5hdHRyKCdyb2xlJywgJ2ltZycpXG4gICAgLmF0dHIoJ2FyaWEtbGFiZWwnLCBhcmlhTGFiZWwpXG4gICAgLnN0eWxlKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgY29uc3Qgcm93cyA9IHN2Z1xuICAgIC5hcHBlbmQoJ2cnKVxuICAgIC5hdHRyKCdjbGFzcycsICdub3RlLXdvcmQtY2xvdWQtZnJlcXVlbmN5LXJvd3MnKVxuICAgIC5zZWxlY3RBbGwoJ2cnKVxuICAgIC5kYXRhKHNvcnRlZFdvcmRzKVxuICAgIC5qb2luKCdnJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgKGVudHJ5KSA9PiBgdHJhbnNsYXRlKDAsICR7eShlbnRyeS50ZXh0KSA/PyAwfSlgKTtcblxuICByb3dzXG4gICAgLmFwcGVuZCgndGV4dCcpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ25vdGUtd29yZC1jbG91ZC1mcmVxdWVuY3ktbGFiZWwnKVxuICAgIC5hdHRyKCd4JywgbWFyZ2luLmxlZnQgLSA4KVxuICAgIC5hdHRyKCd5JywgTWF0aC5tYXgoMCwgeS5iYW5kd2lkdGgoKSAvIDIpKVxuICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdlbmQnKVxuICAgIC5hdHRyKCdkb21pbmFudC1iYXNlbGluZScsICdtaWRkbGUnKVxuICAgIC50ZXh0KChlbnRyeSkgPT4gZW50cnkudGV4dCk7XG5cbiAgcm93c1xuICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgIC5hdHRyKCdjbGFzcycsICdub3RlLXdvcmQtY2xvdWQtZnJlcXVlbmN5LWJhcicpXG4gICAgLmF0dHIoJ3gnLCBtYXJnaW4ubGVmdClcbiAgICAuYXR0cigneScsIDApXG4gICAgLmF0dHIoJ2hlaWdodCcsIE1hdGgubWF4KDEsIHkuYmFuZHdpZHRoKCkpKVxuICAgIC5hdHRyKCd3aWR0aCcsIChlbnRyeSkgPT4gTWF0aC5tYXgoMSwgeChlbnRyeS5jb3VudCkgLSBtYXJnaW4ubGVmdCkpO1xuXG4gIHJvd3NcbiAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAuYXR0cignY2xhc3MnLCAnbm90ZS13b3JkLWNsb3VkLWZyZXF1ZW5jeS12YWx1ZScpXG4gICAgLmF0dHIoJ3gnLCAoZW50cnkpID0+IHgoZW50cnkuY291bnQpICsgNilcbiAgICAuYXR0cigneScsIE1hdGgubWF4KDAsIHkuYmFuZHdpZHRoKCkgLyAyKSlcbiAgICAuYXR0cignZG9taW5hbnQtYmFzZWxpbmUnLCAnbWlkZGxlJylcbiAgICAudGV4dCgoZW50cnkpID0+IFN0cmluZyhlbnRyeS5jb3VudCkpO1xuXG4gIGNvbnRhaW5lckVsLmNyZWF0ZURpdih7XG4gICAgY2xzOiAnbm90ZS13b3JkLWNsb3VkLWZyZXF1ZW5jeS1zdW1tYXJ5JyxcbiAgICB0ZXh0OiBgJHtzb3J0ZWRXb3Jkcy5sZW5ndGh9IHdvcmRzLCBzb3J0ZWQgYnkgZnJlcXVlbmN5YCxcbiAgfSk7XG59XG4iLCAiaW1wb3J0IHsgc2V0SWNvbiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgU291cmNlU2NvcGVNb2RlIH0gZnJvbSAnLi4vd29yZGNsb3VkL3BpcGVsaW5lL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgV29yZENsb3VkRmlsdGVyU2V0dGluZ3MsIFdvcmRDbG91ZFNlcnZpY2VzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5jb25zdCBBTExfRlJFUVVFTkNJRVNfTUlOID0gMTtcbmNvbnN0IEFMTF9GUkVRVUVOQ0lFU19NQVggPSA5OTk5O1xuXG50eXBlIFJlZ2lzdGVyRG9tRXZlbnQgPSAoXG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgRG9jdW1lbnQgfCBXaW5kb3csXG4gIHR5cGU6IHN0cmluZyxcbiAgY2FsbGJhY2s6IChldmVudDogRXZlbnQpID0+IHZvaWQsXG4pID0+IHZvaWQ7XG5cbnR5cGUgV29yZENsb3VkRmlsdGVyUGFuZWxPcHRpb25zID0ge1xuICBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXM7XG4gIGNvbnRhaW5lckVsOiBIVE1MRGl2RWxlbWVudDtcbiAgcmVnaXN0ZXJEb21FdmVudDogUmVnaXN0ZXJEb21FdmVudDtcbiAgZmlsdGVyczogV29yZENsb3VkRmlsdGVyU2V0dGluZ3M7XG4gIG9uQ2hhbmdlOiAoZmlsdGVyczogV29yZENsb3VkRmlsdGVyU2V0dGluZ3MpID0+IFByb21pc2U8dm9pZD4gfCB2b2lkO1xufTtcblxudHlwZSBGaWx0ZXJDb250cm9sUmVmcyA9IHtcbiAgc3VtbWFyeUVsOiBIVE1MRGl2RWxlbWVudDtcbiAgc2NvcGVTZWxlY3RFbDogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gIGluY2x1ZGVUYWdTZWxlY3RFbDogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gIG1vZGVTZWxlY3RFbDogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gIGluY2x1ZGVUYWdzRWw6IEhUTUxEaXZFbGVtZW50O1xufTtcblxuZXhwb3J0IGNsYXNzIFdvcmRDbG91ZEZpbHRlclBhbmVsIHtcbiAgcHJpdmF0ZSByZWFkb25seSBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXM7XG4gIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyRWw6IEhUTUxEaXZFbGVtZW50O1xuICBwcml2YXRlIHJlYWRvbmx5IHJlZ2lzdGVyRG9tRXZlbnQ6IFJlZ2lzdGVyRG9tRXZlbnQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgb25DaGFuZ2U6IChmaWx0ZXJzOiBXb3JkQ2xvdWRGaWx0ZXJTZXR0aW5ncykgPT4gUHJvbWlzZTx2b2lkPiB8IHZvaWQ7XG4gIHByaXZhdGUgZmlsdGVyczogV29yZENsb3VkRmlsdGVyU2V0dGluZ3M7XG4gIHByaXZhdGUgY29udHJvbHM6IEZpbHRlckNvbnRyb2xSZWZzIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogV29yZENsb3VkRmlsdGVyUGFuZWxPcHRpb25zKSB7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IG9wdGlvbnMuc2VydmljZXM7XG4gICAgdGhpcy5jb250YWluZXJFbCA9IG9wdGlvbnMuY29udGFpbmVyRWw7XG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50ID0gb3B0aW9ucy5yZWdpc3RlckRvbUV2ZW50O1xuICAgIHRoaXMub25DaGFuZ2UgPSBvcHRpb25zLm9uQ2hhbmdlO1xuICAgIHRoaXMuZmlsdGVycyA9IHNhbml0aXplRmlsdGVycyhvcHRpb25zLmZpbHRlcnMpO1xuXG4gICAgdGhpcy5jb250YWluZXJFbC5hZGRDbGFzcygndmF1bHQtd29yZC1jbG91ZC1jb250cm9scy1jb25kZW5zZWQnKTtcbiAgICB0aGlzLmJ1aWxkKCk7XG4gICAgdGhpcy5yZWZyZXNoQ29udHJvbHMoKTtcbiAgfVxuXG4gIHNldEZpbHRlcnMoZmlsdGVyczogV29yZENsb3VkRmlsdGVyU2V0dGluZ3MpOiB2b2lkIHtcbiAgICB0aGlzLmZpbHRlcnMgPSBzYW5pdGl6ZUZpbHRlcnMoZmlsdGVycyk7XG4gICAgdGhpcy5yZWZyZXNoQ29udHJvbHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGQoKTogdm9pZCB7XG4gICAgY29uc3QgZmlsdGVyQmFyRWwgPSB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtZmlsdGVyLWJhcicgfSk7XG4gICAgY29uc3Qgc3VtbWFyeUVsID0gZmlsdGVyQmFyRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1maWx0ZXItc3VtbWFyeScgfSk7XG5cbiAgICBjb25zdCByZXNldEJ1dHRvbiA9IGZpbHRlckJhckVsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWZpbHRlci1yZXNldCcsXG4gICAgfSk7XG4gICAgcmVzZXRCdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIHJlc2V0QnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnUmVzZXQgZmlsdGVycycpO1xuICAgIHJlc2V0QnV0dG9uLnNldEF0dHIoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicsICdsZWZ0Jyk7XG4gICAgcmVzZXRCdXR0b24uc2V0QXR0cigndGl0bGUnLCAnUmVzZXQgZmlsdGVycycpO1xuICAgIHNldEljb24ocmVzZXRCdXR0b24sICdyb3RhdGUtY2N3Jyk7XG5cbiAgICBjb25zdCBzZWN0aW9uRWwgPSB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtZmlsdGVyLXNlY3Rpb24nIH0pO1xuICAgIGNvbnN0IGhlYWRlckVsID0gc2VjdGlvbkVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY29udHJvbHMtaGVhZGVyJyB9KTtcbiAgICBoZWFkZXJFbC5jcmVhdGVFbCgnc3BhbicsIHsgdGV4dDogJ0ZpbHRlcnMnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNvbnRyb2xzLXRpdGxlJyB9KTtcblxuICAgIGNvbnN0IGdyaWRFbCA9IHNlY3Rpb25FbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWZpbHRlci1ncmlkJyB9KTtcblxuICAgIGNvbnN0IHNjb3BlRWwgPSBncmlkRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10YWctZmlsdGVyJyB9KTtcbiAgICBzY29wZUVsLmNyZWF0ZUVsKCdzcGFuJywgeyB0ZXh0OiAnU2NvcGUnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRhZy1sYWJlbCcgfSk7XG4gICAgY29uc3Qgc2NvcGVTZWxlY3RFbCA9IHNjb3BlRWwuY3JlYXRlRWwoJ3NlbGVjdCcsIHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1tb2RlLXNlbGVjdCcgfSk7XG4gICAgc2NvcGVTZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB2YWx1ZTogJ3ZhdWx0JywgdGV4dDogJ0VudGlyZSB2YXVsdCcgfSk7XG4gICAgc2NvcGVTZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB2YWx1ZTogJ2FjdGl2ZS1maWxlJywgdGV4dDogJ0FjdGl2ZSBub3RlIG9ubHknIH0pO1xuXG4gICAgY29uc3QgaW5jbHVkZVRhZ1BpY2tlckVsID0gZ3JpZEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtdGFnLWZpbHRlcicgfSk7XG4gICAgaW5jbHVkZVRhZ1BpY2tlckVsLmNyZWF0ZUVsKCdzcGFuJywgeyB0ZXh0OiAnSW5jbHVkZSB0YWcnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRhZy1sYWJlbCcgfSk7XG4gICAgY29uc3QgaW5jbHVkZVRhZ1NlbGVjdEVsID0gaW5jbHVkZVRhZ1BpY2tlckVsLmNyZWF0ZUVsKCdzZWxlY3QnLCB7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtbW9kZS1zZWxlY3QnIH0pO1xuICAgIGluY2x1ZGVUYWdTZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiAnQWRkIGluY2x1ZGUgdGFnLi4uJywgdmFsdWU6ICcnIH0pO1xuXG4gICAgY29uc3QgbW9kZUVsID0gZ3JpZEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtbWF0Y2gtbW9kZScgfSk7XG4gICAgbW9kZUVsLmNyZWF0ZUVsKCdzcGFuJywgeyB0ZXh0OiAnSW5jbHVkZSBtYXRjaCBtb2RlJywgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10YWctbGFiZWwnIH0pO1xuICAgIGNvbnN0IG1vZGVTZWxlY3RFbCA9IG1vZGVFbC5jcmVhdGVFbCgnc2VsZWN0JywgeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLW1vZGUtc2VsZWN0JyB9KTtcbiAgICBtb2RlU2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdGV4dDogJ0FueSBpbmNsdWRlIHRhZycsIHZhbHVlOiAnYW55JyB9KTtcbiAgICBtb2RlU2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdGV4dDogJ0FsbCBpbmNsdWRlIHRhZ3MnLCB2YWx1ZTogJ2FsbCcgfSk7XG5cbiAgICBjb25zdCBpbmNsdWRlVGFnc0VsID0gc2VjdGlvbkVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtYXBwbGllZC10YWdzJyB9KTtcblxuICAgIHRoaXMuY29udHJvbHMgPSB7XG4gICAgICBzdW1tYXJ5RWwsXG4gICAgICBzY29wZVNlbGVjdEVsLFxuICAgICAgaW5jbHVkZVRhZ1NlbGVjdEVsLFxuICAgICAgbW9kZVNlbGVjdEVsLFxuICAgICAgaW5jbHVkZVRhZ3NFbCxcbiAgICB9O1xuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KHNjb3BlU2VsZWN0RWwsICdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICB0aGlzLmZpbHRlcnMuc2NvcGUubW9kZSA9IChzY29wZVNlbGVjdEVsLnZhbHVlIGFzIFNvdXJjZVNjb3BlTW9kZSkgPz8gJ3ZhdWx0JztcbiAgICAgIGlmICh0aGlzLmZpbHRlcnMuc2NvcGUubW9kZSA9PT0gJ2FjdGl2ZS1maWxlJykge1xuICAgICAgICB0aGlzLmZpbHRlcnMuc2NvcGUuYWN0aXZlRmlsZVBhdGggPSB0aGlzLnNlcnZpY2VzLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyAnJztcbiAgICAgIH1cbiAgICAgIHZvaWQgdGhpcy5wZXJzaXN0KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoaW5jbHVkZVRhZ1NlbGVjdEVsLCAnY2hhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRUYWcgPSBpbmNsdWRlVGFnU2VsZWN0RWwudmFsdWU7XG4gICAgICBpZiAoIXNlbGVjdGVkVGFnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmZpbHRlcnMuaW5jbHVkZVRhZ3MuaW5jbHVkZXMoc2VsZWN0ZWRUYWcpKSB7XG4gICAgICAgIHRoaXMuZmlsdGVycy5pbmNsdWRlVGFncy5wdXNoKHNlbGVjdGVkVGFnKTtcbiAgICAgIH1cbiAgICAgIGluY2x1ZGVUYWdTZWxlY3RFbC52YWx1ZSA9ICcnO1xuICAgICAgdm9pZCB0aGlzLnBlcnNpc3QoKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChtb2RlU2VsZWN0RWwsICdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICB0aGlzLmZpbHRlcnMudGFnTWF0Y2hNb2RlID0gbW9kZVNlbGVjdEVsLnZhbHVlID09PSAnYWxsJyA/ICdhbGwnIDogJ2FueSc7XG4gICAgICB2b2lkIHRoaXMucGVyc2lzdCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KHJlc2V0QnV0dG9uLCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLmZpbHRlcnMgPSBzYW5pdGl6ZUZpbHRlcnMoe1xuICAgICAgICAuLi50aGlzLmZpbHRlcnMsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgbW9kZTogJ3ZhdWx0JyxcbiAgICAgICAgICBhY3RpdmVGaWxlUGF0aDogJycsXG4gICAgICAgICAgZm9sZGVyUGF0aHM6IFtdLFxuICAgICAgICB9LFxuICAgICAgICBpbmNsdWRlVGFnczogW10sXG4gICAgICAgIHRhZ01hdGNoTW9kZTogJ2FueScsXG4gICAgICB9KTtcbiAgICAgIHZvaWQgdGhpcy5wZXJzaXN0KCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hDb250cm9scygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY29udHJvbHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBzdW1tYXJ5RWwsXG4gICAgICBzY29wZVNlbGVjdEVsLFxuICAgICAgaW5jbHVkZVRhZ1NlbGVjdEVsLFxuICAgICAgbW9kZVNlbGVjdEVsLFxuICAgICAgaW5jbHVkZVRhZ3NFbCxcbiAgICB9ID0gdGhpcy5jb250cm9scztcblxuICAgIHNjb3BlU2VsZWN0RWwudmFsdWUgPSB0aGlzLmZpbHRlcnMuc2NvcGUubW9kZTtcbiAgICBtb2RlU2VsZWN0RWwudmFsdWUgPSB0aGlzLmZpbHRlcnMudGFnTWF0Y2hNb2RlO1xuXG4gICAgdGhpcy51cGRhdGVUYWdQaWNrZXJPcHRpb25zKGluY2x1ZGVUYWdTZWxlY3RFbCk7XG4gICAgdGhpcy5yZW5kZXJBcHBsaWVkVGFnQ2hpcHMoaW5jbHVkZVRhZ3NFbCk7XG5cbiAgICBtb2RlU2VsZWN0RWwuZGlzYWJsZWQgPSB0aGlzLmZpbHRlcnMuaW5jbHVkZVRhZ3MubGVuZ3RoIDw9IDE7XG4gICAgc3VtbWFyeUVsLnNldFRleHQodGhpcy5idWlsZEZpbHRlclN1bW1hcnkoKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVRhZ1BpY2tlck9wdGlvbnMoc2VsZWN0RWw6IEhUTUxTZWxlY3RFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3QgdGFncyA9IHRoaXMuc2VydmljZXMuZ2V0QXZhaWxhYmxlVGFncygpO1xuICAgIGNvbnN0IGluY2x1ZGVTZXQgPSBuZXcgU2V0KHRoaXMuZmlsdGVycy5pbmNsdWRlVGFncyk7XG5cbiAgICBjb25zdCBwcmV2aW91cyA9IHNlbGVjdEVsLnZhbHVlO1xuICAgIHNlbGVjdEVsLmVtcHR5KCk7XG4gICAgc2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdGV4dDogJ0FkZCBpbmNsdWRlIHRhZy4uLicsIHZhbHVlOiAnJyB9KTtcblxuICAgIGZvciAoY29uc3QgdGFnIG9mIHRhZ3MpIHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IHNlbGVjdEVsLmNyZWF0ZUVsKCdvcHRpb24nLCB7IHRleHQ6IHRhZywgdmFsdWU6IHRhZyB9KTtcbiAgICAgIG9wdGlvbi5kaXNhYmxlZCA9IGluY2x1ZGVTZXQuaGFzKHRhZyk7XG4gICAgfVxuXG4gICAgc2VsZWN0RWwudmFsdWUgPSBwcmV2aW91cyAmJiBzZWxlY3RFbC5xdWVyeVNlbGVjdG9yKGBvcHRpb25bdmFsdWU9XCIke0NTUy5lc2NhcGUocHJldmlvdXMpfVwiXWApID8gcHJldmlvdXMgOiAnJztcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQXBwbGllZFRhZ0NoaXBzKGNoaXBzRWw6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XG4gICAgY2hpcHNFbC5lbXB0eSgpO1xuXG4gICAgaWYgKHRoaXMuZmlsdGVycy5pbmNsdWRlVGFncy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNoaXBzRWwuY3JlYXRlU3Bhbih7XG4gICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY2hpcC1lbXB0eScsXG4gICAgICAgIHRleHQ6ICdObyBpbmNsdWRlIHRhZ3MgYXBwbGllZC4nLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCB0YWcgb2YgdGhpcy5maWx0ZXJzLmluY2x1ZGVUYWdzKSB7XG4gICAgICBjb25zdCBjaGlwRWwgPSBjaGlwc0VsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY2hpcCcgfSk7XG4gICAgICBjaGlwRWwuY3JlYXRlU3Bhbih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY2hpcC10ZXh0JywgdGV4dDogYCsgJHt0YWd9YCB9KTtcblxuICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gY2hpcEVsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY2hpcC1yZW1vdmUnLFxuICAgICAgICB0ZXh0OiAneCcsXG4gICAgICB9KTtcbiAgICAgIHJlbW92ZUJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgICByZW1vdmVCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsIGBSZW1vdmUgJHt0YWd9IGluY2x1ZGUgZmlsdGVyYCk7XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChyZW1vdmVCdXR0b24sICdjbGljaycsICgpID0+IHtcbiAgICAgICAgdGhpcy5maWx0ZXJzLmluY2x1ZGVUYWdzID0gdGhpcy5maWx0ZXJzLmluY2x1ZGVUYWdzLmZpbHRlcigodmFsdWUpID0+IHZhbHVlICE9PSB0YWcpO1xuICAgICAgICB2b2lkIHRoaXMucGVyc2lzdCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBidWlsZEZpbHRlclN1bW1hcnkoKTogc3RyaW5nIHtcbiAgICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBbXTtcbiAgICBwYXJ0cy5wdXNoKHRoaXMuZmlsdGVycy5zY29wZS5tb2RlID09PSAndmF1bHQnID8gJ1Njb3BlOiB2YXVsdCcgOiAnU2NvcGU6IGFjdGl2ZSBub3RlJyk7XG5cbiAgICBpZiAodGhpcy5maWx0ZXJzLmluY2x1ZGVUYWdzLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhcnRzLnB1c2goYEluY2x1ZGU6ICR7dGhpcy5maWx0ZXJzLmluY2x1ZGVUYWdzLmxlbmd0aH0gdGFnKHMpYCk7XG4gICAgfVxuXG4gICAgcGFydHMucHVzaCgnRnJlcXVlbmN5OiBhbGwnKTtcbiAgICByZXR1cm4gcGFydHMuam9pbignIHwgJyk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHBlcnNpc3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5maWx0ZXJzID0gc2FuaXRpemVGaWx0ZXJzKHRoaXMuZmlsdGVycyk7XG4gICAgYXdhaXQgdGhpcy5vbkNoYW5nZShjbG9uZUZpbHRlcnModGhpcy5maWx0ZXJzKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2FuaXRpemVGaWx0ZXJzKGZpbHRlcnM6IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzKTogV29yZENsb3VkRmlsdGVyU2V0dGluZ3Mge1xuICBjb25zdCBtb2RlOiBTb3VyY2VTY29wZU1vZGUgPSBmaWx0ZXJzLnNjb3BlLm1vZGUgPT09ICdhY3RpdmUtZmlsZScgPyAnYWN0aXZlLWZpbGUnIDogJ3ZhdWx0JztcblxuICByZXR1cm4ge1xuICAgIHNjb3BlOiB7XG4gICAgICBtb2RlLFxuICAgICAgYWN0aXZlRmlsZVBhdGg6IGZpbHRlcnMuc2NvcGUuYWN0aXZlRmlsZVBhdGgsXG4gICAgICBmb2xkZXJQYXRoczogW10sXG4gICAgfSxcbiAgICBpbmNsdWRlVGFnczogWy4uLmZpbHRlcnMuaW5jbHVkZVRhZ3NdLFxuICAgIGV4Y2x1ZGVUYWdzOiBbXSxcbiAgICB0YWdNYXRjaE1vZGU6IGZpbHRlcnMudGFnTWF0Y2hNb2RlLFxuICAgIGZyb250bWF0dGVyUnVsZXM6IFtdLFxuICAgIGZyZXF1ZW5jeToge1xuICAgICAgbWluQ291bnQ6IEFMTF9GUkVRVUVOQ0lFU19NSU4sXG4gICAgICBtYXhDb3VudDogQUxMX0ZSRVFVRU5DSUVTX01BWCxcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiBjbG9uZUZpbHRlcnMoZmlsdGVyczogV29yZENsb3VkRmlsdGVyU2V0dGluZ3MpOiBXb3JkQ2xvdWRGaWx0ZXJTZXR0aW5ncyB7XG4gIHJldHVybiB7XG4gICAgc2NvcGU6IHtcbiAgICAgIG1vZGU6IGZpbHRlcnMuc2NvcGUubW9kZSxcbiAgICAgIGFjdGl2ZUZpbGVQYXRoOiBmaWx0ZXJzLnNjb3BlLmFjdGl2ZUZpbGVQYXRoLFxuICAgICAgZm9sZGVyUGF0aHM6IFsuLi5maWx0ZXJzLnNjb3BlLmZvbGRlclBhdGhzXSxcbiAgICB9LFxuICAgIGluY2x1ZGVUYWdzOiBbLi4uZmlsdGVycy5pbmNsdWRlVGFnc10sXG4gICAgZXhjbHVkZVRhZ3M6IFsuLi5maWx0ZXJzLmV4Y2x1ZGVUYWdzXSxcbiAgICB0YWdNYXRjaE1vZGU6IGZpbHRlcnMudGFnTWF0Y2hNb2RlLFxuICAgIGZyb250bWF0dGVyUnVsZXM6IGZpbHRlcnMuZnJvbnRtYXR0ZXJSdWxlcy5tYXAoKHJ1bGUpID0+ICh7IC4uLnJ1bGUgfSkpLFxuICAgIGZyZXF1ZW5jeToge1xuICAgICAgbWluQ291bnQ6IGZpbHRlcnMuZnJlcXVlbmN5Lm1pbkNvdW50LFxuICAgICAgbWF4Q291bnQ6IGZpbHRlcnMuZnJlcXVlbmN5Lm1heENvdW50LFxuICAgIH0sXG4gIH07XG59XG4iLCAiaW1wb3J0IHsgSXRlbVZpZXcsIE5vdGljZSwgV29ya3NwYWNlTGVhZiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VEIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHsgV29yZENsb3VkRmlsdGVyU2V0dGluZ3MsIFdvcmRDbG91ZFNlcnZpY2VzIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgV29yZENsb3VkRmlsdGVyUGFuZWwgfSBmcm9tICcuLi9jb21wb25lbnRzL2ZpbHRlci1wYW5lbCc7XG5cbmV4cG9ydCBjbGFzcyBWYXVsdFdvcmRDbG91ZFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZXM6IFdvcmRDbG91ZFNlcnZpY2VzO1xuICBwcml2YXRlIHJlbmRlck5vbmNlID0gMDtcbiAgcHJpdmF0ZSBmaWx0ZXJzOiBXb3JkQ2xvdWRGaWx0ZXJTZXR0aW5ncztcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXMpIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgICB0aGlzLnNlcnZpY2VzID0gc2VydmljZXM7XG4gICAgdGhpcy5maWx0ZXJzID0gc2VydmljZXMuZ2V0RmlsdGVyU2V0dGluZ3MoKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VEO1xuICB9XG5cbiAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ1ZhdWx0IFdvcmQgQ2xvdWQnO1xuICB9XG5cbiAgZ2V0SWNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiAnY2xvdWQnO1xuICB9XG5cbiAgYXN5bmMgb25PcGVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIGNvbnRlbnRFbC5lbXB0eSgpO1xuICAgIGNvbnRlbnRFbC5hZGRDbGFzcygndmF1bHQtd29yZC1jbG91ZC12aWV3Jyk7XG5cbiAgICB0aGlzLmZpbHRlcnMgPSB0aGlzLnNlcnZpY2VzLmdldEZpbHRlclNldHRpbmdzKCk7XG5cbiAgICBjb25zdCB0b3BFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRvcCcgfSk7XG4gICAgY29uc3QgaGVhZGVyRWwgPSB0b3BFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWhlYWRlcicgfSk7XG4gICAgaGVhZGVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnV29yZCBjbG91ZHMnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRpdGxlJyB9KTtcblxuICAgIGNvbnN0IGNvbnRyb2xzRWwgPSB0b3BFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNvbnRyb2xzJyB9KTtcbiAgICBjb25zdCBjYW52YXNFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNhbnZhcycgfSk7XG5cbiAgICBjb25zdCBmaWx0ZXJQYW5lbCA9IG5ldyBXb3JkQ2xvdWRGaWx0ZXJQYW5lbCh7XG4gICAgICBzZXJ2aWNlczogdGhpcy5zZXJ2aWNlcyxcbiAgICAgIGNvbnRhaW5lckVsOiBjb250cm9sc0VsLFxuICAgICAgcmVnaXN0ZXJEb21FdmVudDogKGVsZW1lbnQsIHR5cGUsIGNhbGxiYWNrKSA9PiB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoZWxlbWVudCwgdHlwZSwgY2FsbGJhY2spLFxuICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJzLFxuICAgICAgb25DaGFuZ2U6IGFzeW5jIChuZXh0RmlsdGVycykgPT4ge1xuICAgICAgICB0aGlzLmZpbHRlcnMgPSBuZXh0RmlsdGVycztcbiAgICAgICAgYXdhaXQgdGhpcy5zZXJ2aWNlcy51cGRhdGVGaWx0ZXJTZXR0aW5ncyh0aGlzLmZpbHRlcnMpO1xuICAgICAgICB0aGlzLmZpbHRlcnMgPSB0aGlzLnNlcnZpY2VzLmdldEZpbHRlclNldHRpbmdzKCk7XG4gICAgICAgIGZpbHRlclBhbmVsLnNldEZpbHRlcnModGhpcy5maWx0ZXJzKTtcbiAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgYXdhaXQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gIH1cblxuICBhc3luYyBvblJlc2l6ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjYW52YXNFbCA9IHRoaXMuY29udGVudEVsLnF1ZXJ5U2VsZWN0b3IoJy52YXVsdC13b3JkLWNsb3VkLWNhbnZhcycpO1xuICAgIGlmIChjYW52YXNFbCBpbnN0YW5jZW9mIEhUTUxEaXZFbGVtZW50KSB7XG4gICAgICBhd2FpdCB0aGlzLnJlbmRlckNsb3VkKGNhbnZhc0VsKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJlbmRlckNsb3VkKGNvbnRhaW5lckVsOiBIVE1MRGl2RWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGFjdGl2ZU5vbmNlID0gKyt0aGlzLnJlbmRlck5vbmNlO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgY29uc3QgbG9hZGluZ0VsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsIHRleHQ6ICdCdWlsZGluZyBjbG91ZC4uLicgfSk7XG4gICAgY29uc3QgdXBkYXRlUHJvZ3Jlc3MgPSAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAgIGlmIChhY3RpdmVOb25jZSAhPT0gdGhpcy5yZW5kZXJOb25jZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsb2FkaW5nRWwuc2V0VGV4dChgJHttZXNzYWdlfSAoJHtwZXJjZW50fSUpYCk7XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBhY3RpdmVGaWxlUGF0aCA9IHRoaXMuc2VydmljZXMuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoID8/ICcnO1xuICAgICAgY29uc3Qgd29yZHMgPSBhd2FpdCB0aGlzLnNlcnZpY2VzLmNvbGxlY3RWYXVsdFdvcmRzKHtcbiAgICAgICAgc291cmNlUnVsZXM6IHtcbiAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgLi4udGhpcy5maWx0ZXJzLnNjb3BlLFxuICAgICAgICAgICAgYWN0aXZlRmlsZVBhdGgsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBpbmNsdWRlVGFnczogdGhpcy5maWx0ZXJzLmluY2x1ZGVUYWdzLFxuICAgICAgICAgIGV4Y2x1ZGVUYWdzOiB0aGlzLmZpbHRlcnMuZXhjbHVkZVRhZ3MsXG4gICAgICAgICAgdGFnTWF0Y2hNb2RlOiB0aGlzLmZpbHRlcnMudGFnTWF0Y2hNb2RlLFxuICAgICAgICAgIGZyb250bWF0dGVyUnVsZXM6IHRoaXMuZmlsdGVycy5mcm9udG1hdHRlclJ1bGVzLFxuICAgICAgICB9LFxuICAgICAgICBmcmVxdWVuY3k6IHRoaXMuZmlsdGVycy5mcmVxdWVuY3ksXG4gICAgICB9LCB1cGRhdGVQcm9ncmVzcyk7XG5cbiAgICAgIGlmICh3b3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLFxuICAgICAgICAgIHRleHQ6ICdObyB3b3JkcyBmb3VuZCBmb3IgdGhlIHNlbGVjdGVkIGZpbHRlcnMuJyxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5zZXJ2aWNlcy5kcmF3V29yZENsb3VkKHtcbiAgICAgICAgY29udGFpbmVyRWwsXG4gICAgICAgIHdvcmRzLFxuICAgICAgICBhcmlhTGFiZWw6ICdXb3JkIGNsb3VkIGJhc2VkIG9uIG1hcmtkb3duIGZpbGVzIGluIHRoZSB2YXVsdCcsXG4gICAgICAgIG9uUHJvZ3Jlc3M6IHVwZGF0ZVByb2dyZXNzLFxuICAgICAgICBvblJlZnJlc2g6ICgpID0+IHRoaXMucmVuZGVyQ2xvdWQoY29udGFpbmVyRWwpLFxuICAgICAgICBvbkV4Y2x1ZGVJblZhdWx0OiBhc3luYyAod29yZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFkZGVkID0gYXdhaXQgdGhpcy5zZXJ2aWNlcy5hZGRCbGFja2xpc3RXb3JkKHdvcmQpO1xuICAgICAgICAgIG5ldyBOb3RpY2UoYWRkZWQgPyBgRXhjbHVkZWQgXCIke3dvcmR9XCIgZnJvbSB3b3JkIGNsb3Vkcy5gIDogYFwiJHt3b3JkfVwiIGlzIGFscmVhZHkgZXhjbHVkZWQuYCk7XG4gICAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJDbG91ZChjb250YWluZXJFbCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uV29yZENsaWNrOiAod29yZCkgPT4ge1xuICAgICAgICAgIHZvaWQgdGhpcy5zZXJ2aWNlcy5vcGVuU2VhcmNoRm9yV29yZCh3b3JkLCB7XG4gICAgICAgICAgICBpbmNsdWRlVGFnczogdGhpcy5maWx0ZXJzLmluY2x1ZGVUYWdzLFxuICAgICAgICAgICAgZXhjbHVkZVRhZ3M6IHRoaXMuZmlsdGVycy5leGNsdWRlVGFncyxcbiAgICAgICAgICAgIHRhZ01hdGNoTW9kZTogdGhpcy5maWx0ZXJzLnRhZ01hdGNoTW9kZSxcbiAgICAgICAgICAgIGZpbGVQYXRoOiB0aGlzLmZpbHRlcnMuc2NvcGUubW9kZSA9PT0gJ2FjdGl2ZS1maWxlJ1xuICAgICAgICAgICAgICA/IGFjdGl2ZUZpbGVQYXRoXG4gICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChhY3RpdmVOb25jZSAhPT0gdGhpcy5yZW5kZXJOb25jZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuICAgICAgY29uc29sZS5lcnJvcignVmF1bHQgd29yZCBjbG91ZDogZmFpbGVkIHRvIHJlbmRlciBjbG91ZCcsIGVycm9yKTtcbiAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdih7XG4gICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLFxuICAgICAgICB0ZXh0OiAnQ291bGQgbm90IHJlbmRlciB0aGUgd29yZCBjbG91ZC4gT3BlbiBkZXZlbG9wZXIgY29uc29sZSBmb3IgZGV0YWlscy4nLFxuICAgICAgfSk7XG4g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QU07QUFBQSxFQUNOLFlBQVk7QUFBQSxFQUNaLE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFdBQVc7QUFBQSxFQUNYLFlBQVk7QUFBQSxFQUNaLFdBQVc7QUFBQSxFQUNYLE9BQU87QUFBQSxFQUNQLGdCQUFnQjtBQUFBLEVBQ2hCLFVBQVU7QUFBQSxFQUNWLFNBQVM7QUFBQSxFQUNULE1BQU07QUFBQSxFQUNOLFVBQVU7QUFBQSxFQUNWLFVBQVU7QUFBQSxFQUNWLGVBQWU7QUFBQSxFQUNmLFVBQVU7QUFBQSxFQUNWLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxFQUNWLFdBQVc7QUFBQSxFQUNYLGFBQWE7QUFBQSxFQUNiLGdCQUFnQjtBQUFBLEVBQ2hCLFlBQVk7QUFBQSxFQUNaLFlBQVk7QUFBQSxFQUNaLFNBQVM7QUFBQSxFQUNULFlBQVk7QUFBQSxFQUNaLGNBQWM7QUFBQSxFQUNkLGVBQWU7QUFBQSxFQUNmLGVBQWU7QUFBQSxFQUNmLGVBQWU7QUFBQSxFQUNmLGVBQWU7QUFBQSxFQUNmLFlBQVk7QUFBQSxFQUNaLFVBQVU7QUFBQSxFQUNWLGFBQWE7QUFBQSxFQUNiLFNBQVM7QUFBQSxFQUNULFNBQVM7QUFBQSxFQUNULFlBQVk7QUFBQSxFQUNaLFdBQVc7QUFBQSxFQUNYLGFBQWE7QUFBQSxFQUNiLGFBQWE7QUFBQSxFQUNiLFNBQVM7QUFBQSxFQUNULFdBQVc7QUFBQSxFQUNYLFlBQVk7QUFBQSxFQUNaLE1BQU07QUFBQSxFQUNOLFdBQVc7QUFBQSxFQUNYLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxFQUNQLGFBQWE7QUFBQSxFQUNiLE1BQU07QUFBQSxFQUNOLFVBQVU7QUFBQSxFQUNWLFNBQVM7QUFBQSxFQUNULFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxFQUNSLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLFVBQVU7QUFBQSxFQUNWLGVBQWU7QUFBQSxFQUNmLFdBQVc7QUFBQSxFQUNYLGNBQWM7QUFBQSxFQUNkLFdBQVc7QUFBQSxFQUNYLFlBQVk7QUFBQSxFQUNaLFdBQVc7QUFBQSxFQUNYLHNCQUFzQjtBQUFBLEVBQ3RCLFdBQVc7QUFBQSxFQUNYLFlBQVk7QUFBQSxFQUNaLFdBQVc7QUFBQSxFQUNYLFdBQVc7QUFBQSxFQUNYLGFBQWE7QUFBQSxFQUNiLGVBQWU7QUFBQSxFQUNmLGNBQWM7QUFBQSxFQUNkLGdCQUFnQjtBQUFBLEVBQ2hCLGdCQUFnQjtBQUFBLEVBQ2hCLGdCQUFnQjtBQUFBLEVBQ2hCLGFBQWE7QUFBQSxFQUNiLE1BQU07QUFBQSxFQUNOLFdBQVc7QUFBQSxFQUNYLE9BQU87QUFBQSxFQUNQLFNBQVM7QUFBQSxFQUNULFFBQVE7QUFBQSxFQUNSLGtCQUFrQjtBQUFBLEVBQ2xCLFlBQVk7QUFBQSxFQUNaLGNBQWM7QUFBQSxFQUNkLGNBQWM7QUFBQSxFQUNkLGdCQUFnQjtBQUFBLEVBQ2hCLGlCQUFpQjtBQUFBLEVBQ2pCLG1CQUFtQjtBQUFBLEVBQ25CLGlCQUFpQjtBQUFBLEVBQ2pCLGlCQUFpQjtBQUFBLEVBQ2pCLGNBQWM7QUFBQSxFQUNkLFdBQVc7QUFBQSxFQUNYLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFBQSxFQUNWLGFBQWE7QUFBQSxFQUNiLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxFQUNULE9BQU87QUFBQSxFQUNQLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxFQUNSLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxFQUNSLGVBQWU7QUFBQSxFQUNmLFdBQVc7QUFBQSxFQUNYLGVBQWU7QUFBQSxFQUNmLGVBQWU7QUFBQSxFQUNmLFlBQVk7QUFBQSxFQUNaLFdBQVc7QUFBQSxFQUNYLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLFlBQVk7QUFBQSxFQUNaLFFBQVE7QUFBQSxFQUNSLGVBQWU7QUFBQSxFQUNmLEtBQUs7QUFBQSxFQUNMLFdBQVc7QUFBQSxFQUNYLFdBQVc7QUFBQSxFQUNYLGFBQWE7QUFBQSxFQUNiLFFBQVE7QUFBQSxFQUNSLFlBQVk7QUFBQSxFQUNaLFVBQVU7QUFBQSxFQUNWLFVBQVU7QUFBQSxFQUNWLFFBQVE7QUFBQSxFQUNSLFFBQVE7QUFBQSxFQUNSLFNBQVM7QUFBQSxFQUNULFdBQVc7QUFBQSxFQUNYLFdBQVc7QUFBQSxFQUNYLFdBQVc7QUFBQSxFQUNYLE1BQU07QUFBQSxFQUNOLGFBQWE7QUFBQSxFQUNiLFdBQVc7QUFBQSxFQUNYLEtBQUs7QUFBQSxFQUNMLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxFQUNULFFBQVE7QUFBQSxFQUNSLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxFQUNSLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLFlBQVk7QUFBQSxFQUNaLFFBQVE7QUFBQSxFQUNSLGFBQWE7QUFDZjtBQUVBLGVBQU8sT0FBTyxPQUFPO0FBQUEsRUFDbkIsS0FBSyxVQUFVO0FBQ2IsV0FBTyxPQUFPLE9BQU8sSUFBSSxLQUFLLGVBQWEsTUFBTSxRQUFRO0FBQUEsRUFDM0Q7QUFBQSxFQUNBLGNBQWM7QUFDWixXQUFPLEtBQUssSUFBSSxFQUFFLFlBQVk7QUFBQSxFQUNoQztBQUFBLEVBQ0EsS0FBSztBQUFBO0FBQUEsRUFDTCxXQUFXO0FBQUEsRUFDWCxZQUFZO0FBQUEsRUFDWixXQUFXO0FBQUEsRUFDWCxXQUFXO0FBQUEsRUFDWCxVQUFVO0FBQ1osQ0FBQztBQUVELFNBQVMsa0JBQWtCO0FBQ3pCLFNBQU8sS0FBSyxJQUFJLEVBQUUsVUFBVTtBQUM5QjtBQUVBLFNBQVMsbUJBQW1CO0FBQzFCLFNBQU8sS0FBSyxJQUFJLEVBQUUsV0FBVztBQUMvQjtBQUVBLFNBQVMsa0JBQWtCO0FBQ3pCLFNBQU8sV0FBVyxJQUFJLEVBQUUsVUFBVTtBQUNwQztBQUVBLFNBQVMsa0JBQWtCO0FBQ3pCLFNBQU8sS0FBSyxJQUFJLEVBQUUsVUFBVTtBQUM5QjtBQUVlLFNBQVIsTUFBdUJDLFNBQVE7QUFDcEMsTUFBSSxHQUFHO0FBQ1AsRUFBQUEsV0FBVUEsVUFBUyxJQUFJLEtBQUssRUFBRSxZQUFZO0FBQzFDLFVBQVEsSUFBSSxNQUFNLEtBQUtBLE9BQU0sTUFBTSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsSUFBSSxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLElBQUksS0FBSyxDQUFDLElBQ3RGLE1BQU0sSUFBSSxJQUFJLElBQUssS0FBSyxJQUFJLEtBQVEsS0FBSyxJQUFJLEtBQVEsS0FBSyxJQUFJLEtBQVEsSUFBSSxNQUFTLElBQUksT0FBUSxJQUFNLElBQUksSUFBTSxDQUFDLElBQ2hILE1BQU0sSUFBSSxLQUFLLEtBQUssS0FBSyxLQUFNLEtBQUssS0FBSyxLQUFNLEtBQUssSUFBSSxNQUFPLElBQUksT0FBUSxHQUFJLElBQy9FLE1BQU0sSUFBSSxLQUFNLEtBQUssS0FBSyxLQUFRLEtBQUssSUFBSSxLQUFRLEtBQUssSUFBSSxLQUFRLEtBQUssSUFBSSxLQUFRLEtBQUssSUFBSSxLQUFRLElBQUksT0FBVSxJQUFJLE9BQVEsSUFBTSxJQUFJLE1BQVEsR0FBSSxJQUN0SixTQUNDLElBQUksYUFBYSxLQUFLQSxPQUFNLEtBQUssSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FDNUQsSUFBSSxhQUFhLEtBQUtBLE9BQU0sS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDLElBQUksTUFBTSxLQUFLLEVBQUUsQ0FBQyxJQUFJLE1BQU0sS0FBSyxFQUFFLENBQUMsSUFBSSxNQUFNLEtBQUssQ0FBQyxLQUNoRyxJQUFJLGNBQWMsS0FBS0EsT0FBTSxLQUFLLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FDN0QsSUFBSSxjQUFjLEtBQUtBLE9BQU0sS0FBSyxLQUFLLEVBQUUsQ0FBQyxJQUFJLE1BQU0sS0FBSyxFQUFFLENBQUMsSUFBSSxNQUFNLEtBQUssRUFBRSxDQUFDLElBQUksTUFBTSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQ2pHLElBQUksYUFBYSxLQUFLQSxPQUFNLEtBQUssS0FBSyxFQUFFLENB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QU0sUUFBMkIsQ0FBQztBQUVsQyxhQUFXLFFBQVEsVUFBVTtBQUMzQixRQUFJLENBQUMsUUFBUSxPQUFPLFNBQVMsVUFBVTtBQUNyQztBQUFBLElBQ0Y7QUFFQSxVQUFNLFlBQVk7QUFDbEIsVUFBTSxNQUFNLE9BQU8sVUFBVSxRQUFRLFdBQVcsVUFBVSxJQUFJLEtBQUssSUFBSTtBQUN2RSxRQUFJLENBQUMsS0FBSztBQUNSO0FBQUEsSUFDRjtBQUVBLFVBQU0sV0FBVyxPQUFPLFVBQVUsYUFBYSxZQUFZLFFBQVEsSUFBSSxVQUFVLFFBQVEsSUFDckYsVUFBVSxXQUNWO0FBQ0osVUFBTSxRQUFRLE9BQU8sVUFBVSxVQUFVLFdBQVcsVUFBVSxRQUFRO0FBRXRFLFVBQU0sS0FBSyxFQUFFLEtBQUssVUFBVSxNQUFNLENBQUM7QUFBQSxFQUNyQztBQUVBLFNBQU87QUFDVDsiLAogICJuYW1lcyI6IFsibW9kdWxlIiwgImV4cG9ydHMiLCAicGFyc2VUeXBlbmFtZXMiLCAiY29weSIsICJtb2R1bGUiLCAiaSIsICJjYW52YXMiLCAidyIsICJoIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiRlJPTlRNQVRURVJfT1BFUkFUT1JTIiwgInBhcnNlVGFnTGlzdCIsICJwYXJzZUxpc3QiLCAicGFyc2VGcm9udG1hdHRlclJ1bGVzIiwgInJvb3QiLCAibGluZWFyIiwgImRvY3VtZW50IiwgImRvY3VtZW50IiwgIm1hdGNoZXNGcm9udG1hdHRlclJ1bGVzIiwgImNvbnRhaW5zVmFsdWUiLCAiY29tcGFyZVNjYWxhciIsICJ0cnlQYXJzZU51bWJlciIsICJ0cnlQYXJzZURhdGUiLCAidHJ5UGFyc2VCb29sZWFuIiwgImRvY3VtZW50IiwgImltcG9ydF9vYnNpZGlhbiIsICJrZXkiLCAidGlja3MiLCAicmFuZ2UiLCAicmFuZ2UiLCAicmFuZ2UiLCAiZm9ybWF0IiwgImNvbG9yIiwgInJnYiIsICJ6ZXJvIiwgImkiLCAibnVtYmVyIiwgInJhbmdlIiwgImkiLCAibnVtYmVyIiwgImxvY2FsZSIsICJ6ZXJvIiwgImZvcm1hdCIsICJmb3JtYXRQcmVmaXgiLCAidmFsdWUiLCAibGluZWFyIiwgImRvY3VtZW50IiwgImRhdHVtIiwgImNvbnN0YW50X2RlZmF1bHQiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJzZWxlY3Rpb24iLCAiYXNjZW5kaW5nIiwgIndpbmRvdyIsICJzZWxlY3RfZGVmYXVsdCIsICJpbXBvcnRfb2JzaWRpYW4iLCAic2VsZWN0X2RlZmF1bHQiLCAiY29sb3IiLCAiY3JlYXRlVGhyb3R0bGVkUHJvZ3Jlc3MiLCAibGF5b3V0V29yZHMiLCAiZm9ybWF0IiwgImltcG9ydF9vYnNpZGlhbiIsICJsaW5lYXIiLCAic2VsZWN0X2RlZmF1bHQiLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiJdCn0K
