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
var import_obsidian10 = require("obsidian");

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

// src/services/editor-insertion.ts
var import_obsidian2 = require("obsidian");
function insertEmbedAtCursor(app, embedBlock) {
  const view = app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
  if (!view) {
    new import_obsidian2.Notice("Open a markdown note to insert a word cloud embed.");
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

// src/views/activate.ts
async function activateVaultWordCloudView(app) {
  const { workspace } = app;
  const existingLeaf = workspace.getLeavesOfType(VIEW_TYPE_VAULT_WORD_CLOUD)[0];
  const leaf = existingLeaf ?? workspace.getLeaf(true);
  await leaf.setViewState({
    type: VIEW_TYPE_VAULT_WORD_CLOUD,
    active: true
  });
  workspace.revealLeaf(leaf);
}
async function activateNoteWordCloudView(app) {
  const { workspace } = app;
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

// src/commands/register.ts
function registerCommands(plugin, deps) {
  plugin.addCommand({
    id: "open-vault-word-cloud-view",
    name: "Open vault word cloud",
    callback: () => {
      void activateVaultWordCloudView(plugin.app);
    }
  });
  plugin.addCommand({
    id: "open-note-word-cloud-sidebar",
    name: "Open current note word cloud",
    callback: () => {
      void activateNoteWordCloudView(plugin.app);
    }
  });
  plugin.addCommand({
    id: "embed-word-cloud-in-document",
    name: "Embed word cloud in document",
    callback: () => {
      new EmbedWordCloudModal(
        plugin.app,
        deps.services.wordCloud,
        (embedBlock) => insertEmbedAtCursor(plugin.app, embedBlock)
      ).open();
    }
  });
}

// src/events/coordinator.ts
var EventCoordinator = class {
  dispose() {
  }
};

// src/integration/obsidian-adapter.ts
var import_obsidian3 = require("obsidian");
var ObsidianAdapter = class {
  constructor(app) {
    this.app = app;
  }
  getAvailableFolders() {
    return this.app.vault.getAllLoadedFiles().filter((file) => file instanceof import_obsidian3.TFolder).map((folder) => folder.path).sort((a, b) => a.localeCompare(b));
  }
  getOpenMarkdownFiles() {
    const files = /* @__PURE__ */ new Map();
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (view instanceof import_obsidian3.MarkdownView && view.file) {
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
  getMarkdownFiles() {
    return this.app.vault.getMarkdownFiles();
  }
};

// src/settings/migrations.ts
function migrateSettingsData(raw) {
  return raw;
}

// src/settings/types.ts
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

// src/settings/service.ts
var SettingsService = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.settings = cloneSettings(DEFAULT_SETTINGS);
    this.listeners = /* @__PURE__ */ new Set();
  }
  async load() {
    const loaded = await this.plugin.loadData();
    const migrated = migrateSettingsData(loaded);
    this.settings = {
      blacklistWords: this.normalizeBlacklistWords(migrated?.blacklistWords),
      render: this.normalizeRenderSettings(migrated?.render),
      filters: this.normalizeFilterSettings(migrated?.filters)
    };
  }
  getSnapshot() {
    return cloneSettings(this.settings);
  }
  onChange(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
  dispose() {
    this.listeners.clear();
  }
  getBlacklistSet() {
    return new Set(this.settings.blacklistWords.map((word) => this.normalizeBlacklistWord(word)).filter(Boolean));
  }
  async updateFilters(patch) {
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
    this.settings = {
      ...this.settings,
      filters: this.normalizeFilterSettings(merged)
    };
    await this.persist();
  }
  async updateRenderSettings(patch) {
    const merged = {
      ...this.settings.render,
      ...patch
    };
    this.settings = {
      ...this.settings,
      render: this.normalizeRenderSettings(merged)
    };
    await this.persist();
  }
  async resetRenderSettings() {
    this.settings = {
      ...this.settings,
      render: { ...DEFAULT_SETTINGS.render }
    };
    await this.persist();
  }
  async addBlacklistWord(rawWord) {
    const normalizedWord = this.normalizeBlacklistWord(rawWord);
    if (!normalizedWord || this.settings.blacklistWords.includes(normalizedWord)) {
      return false;
    }
    this.settings = {
      ...this.settings,
      blacklistWords: [...this.settings.blacklistWords, normalizedWord]
    };
    await this.persist();
    return true;
  }
  async removeBlacklistWord(rawWord) {
    const normalizedWord = this.normalizeBlacklistWord(rawWord);
    this.settings = {
      ...this.settings,
      blacklistWords: this.settings.blacklistWords.filter((word) => word !== normalizedWord)
    };
    await this.persist();
  }
  async resetBlacklistWords() {
    this.settings = {
      ...this.settings,
      blacklistWords: [...DEFAULT_SETTINGS.blacklistWords]
    };
    await this.persist();
  }
  async persist() {
    await this.plugin.saveData(this.settings);
    this.emitChange();
  }
  emitChange() {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
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
    const layoutTimeIntervalMs = this.clampNumber(raw.layoutTimeIntervalMs, 8, 40, DEFAULT_SETTINGS.render.layoutTimeIntervalMs);
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
function cloneSettings(settings) {
  return {
    blacklistWords: [...settings.blacklistWords],
    render: { ...settings.render },
    filters: {
      scope: {
        ...settings.filters.scope,
        folderPaths: [...settings.filters.scope.folderPaths]
      },
      includeTags: [...settings.filters.includeTags],
      excludeTags: [...settings.filters.excludeTags],
      tagMatchMode: settings.filters.tagMatchMode,
      frontmatterRules: settings.filters.frontmatterRules.map((rule) => ({ ...rule })),
      frequency: {
        ...settings.filters.frequency
      }
    }
  };
}

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
  const reportProgress = createThrottledProgress(onProgress, performance.progressThrottleMs);
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

// src/utils/apply-search.ts
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

// src/services/wordcloud-services.ts
var WordCloudAppService = class {
  constructor(app, adapter, processor, settingsService) {
    this.app = app;
    this.adapter = adapter;
    this.processor = processor;
    this.settingsService = settingsService;
  }
  getSettingsSnapshot() {
    return this.settingsService.getSnapshot();
  }
  getAvailableTags() {
    return this.processor.getAvailableTags();
  }
  getAvailableFolders() {
    return this.adapter.getAvailableFolders();
  }
  getOpenMarkdownFiles() {
    return this.adapter.getOpenMarkdownFiles();
  }
  getActiveFile() {
    return this.adapter.getActiveFile();
  }
  getFilterSettings() {
    return this.settingsService.getSnapshot().filters;
  }
  async updateFilterSettings(patch) {
    await this.settingsService.updateFilters(patch);
  }
  async collectVaultWords(options = {}, onProgress) {
    const settings = this.settingsService.getSnapshot();
    const sourceRules = options.sourceRules ?? {
      scope: settings.filters.scope,
      includeTags: settings.filters.includeTags,
      excludeTags: settings.filters.excludeTags,
      tagMatchMode: settings.filters.tagMatchMode,
      frontmatterRules: settings.filters.frontmatterRules
    };
    const frequency = options.frequency ?? settings.filters.frequency;
    return this.processor.collectFromFiles(
      this.adapter.getMarkdownFiles(),
      this.settingsService.getBlacklistSet(),
      settings.render,
      onProgress,
      {
        sourceRules,
        frequency,
        excludeWords: options.excludeWords
      }
    );
  }
  async collectFileWords(file, onProgress, options) {
    const settings = this.settingsService.getSnapshot();
    return this.processor.collectFromFiles([file], this.settingsService.getBlacklistSet(), settings.render, onProgress, {
      excludeWords: options?.excludeWords
    });
  }
  async drawWordCloud(options) {
    const settings = this.settingsService.getSnapshot();
    return drawWordCloud(options, settings.render);
  }
  async openSearchForWord(word, options = {}) {
    return openSearchForWord(this.app, word, options);
  }
  async addBlacklistWord(rawWord) {
    return this.settingsService.addBlacklistWord(rawWord);
  }
  async removeBlacklistWord(rawWord) {
    await this.settingsService.removeBlacklistWord(rawWord);
  }
  async resetBlacklistWords() {
    await this.settingsService.resetBlacklistWords();
  }
  async updateRenderSettings(patch) {
    await this.settingsService.updateRenderSettings(patch);
  }
  async resetRenderSettings() {
    await this.settingsService.resetRenderSettings();
  }
};

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
    const reportProgress = createThrottledProgress2(onProgress, performance.progressThrottleMs);
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

// src/create-deps.ts
async function createDeps(plugin) {
  const settingsService = new SettingsService(plugin);
  await settingsService.load();
  const adapter = new ObsidianAdapter(plugin.app);
  const processor = new WordCloudService(plugin.app);
  const wordCloud = new WordCloudAppService(plugin.app, adapter, processor, settingsService);
  const coordinator = new EventCoordinator();
  return {
    settingsService,
    adapter,
    services: {
      wordCloud
    },
    coordinator,
    dispose: () => {
      coordinator.dispose();
      settingsService.dispose();
    }
  };
}

// src/events/register.ts
function registerEvents(_plugin, _deps) {
}

// src/lifecycle/disposer.ts
var Disposer = class {
  constructor() {
    this.callbacks = [];
  }
  add(disposable) {
    if (typeof disposable === "function") {
      this.callbacks.push(disposable);
      return;
    }
    this.callbacks.push(() => {
      disposable.dispose();
    });
  }
  disposeAll() {
    while (this.callbacks.length > 0) {
      const callback = this.callbacks.pop();
      callback?.();
    }
  }
};

// src/settings/tab.ts
var import_obsidian5 = require("obsidian");
var VaultWordCloudSettingTab = class extends import_obsidian5.PluginSettingTab {
  constructor(plugin, services) {
    super(plugin.app, plugin);
    this.services = services;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Word clouds settings" });
    const settings = this.services.getSettingsSnapshot();
    let draftWord = "";
    const addExcludedWord = new import_obsidian5.Setting(containerEl).setName("Add excluded word").setDesc("Add one word at a time to the blacklist.").addText((text) => {
      text.setPlaceholder("Word to exclude");
      text.onChange((value) => {
        draftWord = value;
      });
    }).addButton((button) => {
      button.setButtonText("Add").setCta().onClick(async () => {
        const added = await this.services.addBlacklistWord(draftWord);
        if (added) {
          this.display();
        }
      });
    });
    this.attachInfoIcon(addExcludedWord, "Excluded words are always ignored from counting and sizing in all cloud types.");
    const listWrapperEl = containerEl.createDiv({ cls: "vault-word-cloud-settings-list" });
    listWrapperEl.createEl("h3", { text: "Excluded words" });
    const listEl = listWrapperEl.createDiv({ cls: "vault-word-cloud-settings-badges" });
    const sortedWords = [...settings.blacklistWords].sort((a, b) => a.localeCompare(b));
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
          await this.services.removeBlacklistWord(word);
          this.display();
        });
      }
    }
    const resetExcludedWords = new import_obsidian5.Setting(containerEl).setName("Reset excluded words").setDesc("Restore the original default blacklist.").addButton((button) => {
      button.setButtonText("Reset to defaults").onClick(async () => {
        await this.services.resetBlacklistWords();
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
        const sampleWords = this.buildPreviewWords(this.services.getSettingsSnapshot().render);
        loadingEl.remove();
        await this.services.drawWordCloud({
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
      await this.services.updateRenderSettings(patch);
      await rerenderPreview();
    };
    const rotationStyle = new import_obsidian5.Setting(containerEl).setName("Rotation style").setDesc("How words are angled in the cloud.").addDropdown((dropdown) => {
      dropdown.addOption("horizontal", "Horizontal only").addOption("mostly-horizontal", "Mostly horizontal").addOption("mixed", "Mixed angles").addOption("vertical", "Vertical heavy").setValue(settings.render.rotationPreset).onChange(async (value) => {
        await updateRenderAndPreview({
          rotationPreset: value
        });
      });
    });
    this.attachInfoIcon(rotationStyle, "Horizontal is easiest to read. Mixed/vertical can pack more words but may reduce readability.");
    const spiralLayout = new import_obsidian5.Setting(containerEl).setName("Spiral layout").setDesc("Placement strategy for positioning words.").addDropdown((dropdown) => {
      dropdown.addOption("archimedean", "Archimedean").addOption("rectangular", "Rectangular").setValue(settings.render.spiral).onChange(async (value) => {
        await updateRenderAndPreview({
          spiral: value
        });
      });
    });
    this.attachInfoIcon(spiralLayout, "Archimedean is more organic. Rectangular can appear tighter in some datasets.");
    const wordPadding = new import_obsidian5.Setting(containerEl).setName("Word padding").setDesc("Space between words in pixels.").addSlider((slider) => {
      slider.setLimits(0, 12, 1).setValue(settings.render.wordPadding).setDynamicTooltip().onChange(async (value) => {
        await updateRenderAndPreview({ wordPadding: value });
      });
    });
    this.attachInfoIcon(wordPadding, "Increase to reduce collisions and improve readability. Lower values pack more words.");
    const minFontSize = new import_obsidian5.Setting(containerEl).setName("Minimum font size").setDesc("Smallest rendered word size.").addSlider((slider) => {
      slider.setLimits(8, 64, 1).setValue(settings.render.minFontSize).setDynamicTooltip().onChange(async (value) => {
        await updateRenderAndPreview({ minFontSize: value });
      });
    });
    this.attachInfoIcon(minFontSize, "Sets the floor of visual size mapping. Higher minimum makes low-frequency words more legible.");
    const maxFontSize = new import_obsidian5.Setting(containerEl).setName("Maximum font size").setDesc("Largest rendered word size.").addSlider((slider) => {
      slider.setLimits(16, 140, 1).setValue(settings.render.maxFontSize).setDynamicTooltip().onChange(async (value) => {
        await updateRenderAndPreview({ maxFontSize: value });
      });
    });
    this.attachInfoIcon(maxFontSize, "Sets the ceiling of visual size mapping. Higher values emphasize top words more strongly.");
    const fontFamily = new import_obsidian5.Setting(containerEl).setName("Font family").setDesc("CSS font family used for words.").addText((text) => {
      text.setPlaceholder("sans-serif").setValue(settings.render.fontFamily).onChange(async (value) => {
        await updateRenderAndPreview({ fontFamily: value.trim() || "sans-serif" });
      });
    });
    this.attachInfoIcon(fontFamily, "Wider fonts take more space and can increase overlap pressure.");
    const showCountInWordText = new import_obsidian5.Setting(containerEl).setName("Show value in word text").setDesc("Append count or frequency directly to rendered words.").addToggle((toggle) => {
      toggle.setValue(settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ showCountInWordText: value });
        this.display();
      });
    });
    this.attachInfoIcon(showCountInWordText, "Shows the selected metric inline (for example, word (12) or word (4.3%)). Improves precision, increases text length.");
    const wordTextMetric = new import_obsidian5.Setting(containerEl).setName("Word value mode").setDesc("Choose whether inline values show count or frequency.").addDropdown((dropdown) => {
      dropdown.addOption("count", "Count").addOption("frequency", "Frequency (%)").setValue(settings.render.wordTextMetric).setDisabled(!settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ wordTextMetric: value });
      });
    });
    this.attachInfoIcon(wordTextMetric, "Count shows raw occurrences. Frequency shows each word as a percent of visible word occurrences.");
    const showWordTextMetricToggle = new import_obsidian5.Setting(containerEl).setName("Show count/frequency toggle button").setDesc("Add a rendered-view button to switch inline labels between count and frequency.").addToggle((toggle) => {
      toggle.setValue(settings.render.showWordTextMetricToggle).setDisabled(!settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ showWordTextMetricToggle: value });
      });
    });
    this.attachInfoIcon(showWordTextMetricToggle, "When enabled, each cloud shows a quick toggle in the corner controls.");
    const countLabelFormat = new import_obsidian5.Setting(containerEl).setName("Count label format").setDesc("How inline values are shown when word text values are enabled.").addDropdown((dropdown) => {
      dropdown.addOption("paren", "word (12)").addOption("dot", "word \xB7 12").addOption("colon", "word: 12").setValue(settings.render.countLabelFormat).setDisabled(!settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ countLabelFormat: value });
      });
    });
    this.attachInfoIcon(countLabelFormat, "Formatting style for inline counts.");
    const countLabelMinimum = new import_obsidian5.Setting(containerEl).setName("Count label minimum").setDesc("Show inline count only for words at or above this count.").addSlider((slider) => {
      slider.setLimits(1, 100, 1).setValue(settings.render.countLabelMinCount).setDynamicTooltip().setDisabled(!settings.render.showCountInWordText).onChange(async (value) => {
        await updateRenderAndPreview({ countLabelMinCount: value });
      });
    });
    this.attachInfoIcon(countLabelMinimum, "Avoids visual noise by hiding counts for very small values.");
    const sizeScalingMode = new import_obsidian5.Setting(containerEl).setName("Size scaling mode").setDesc("How numeric count differences map to font-size differences.").addDropdown((dropdown) => {
      dropdown.addOption("linear", "Linear").addOption("power", "Power").addOption("log", "Log").addOption("rank", "Rank").setValue(settings.render.scalingMode).onChange(async (value) => {
        await updateRenderAndPreview({ scalingMode: value });
        this.display();
      });
    });
    this.attachInfoIcon(sizeScalingMode, "Linear is proportional. Power exaggerates gaps. Log compresses extremes. Rank ignores absolute gaps.");
    const emphasis = new import_obsidian5.Setting(containerEl).setName("Emphasis").setDesc("Higher values exaggerate size differences (power scaling mode).").addSlider((slider) => {
      slider.setLimits(0.5, 3, 0.1).setValue(settings.render.emphasis).setDynamicTooltip().setDisabled(settings.render.scalingMode !== "power").onChange(async (value) => {
        await updateRenderAndPreview({ emphasis: value });
      });
    });
    this.attachInfoIcon(emphasis, "Only used in Power scaling mode. 1.0 is baseline; higher exaggerates differences more.");
    const deterministicLayout = new import_obsidian5.Setting(containerEl).setName("Deterministic layout").setDesc("Keep cloud layout stable across refreshes using a seed.").addToggle((toggle) => {
      toggle.setValue(settings.render.deterministicLayout).onChange(async (value) => {
        await updateRenderAndPreview({ deterministicLayout: value });
        this.display();
      });
    });
    this.attachInfoIcon(deterministicLayout, "Useful for comparing before/after changes with stable positions.");
    const randomSeed = new import_obsidian5.Setting(containerEl).setName("Random seed").setDesc("Seed used when deterministic layout is enabled.").addText((text) => {
      text.setValue(String(settings.render.randomSeed)).setDisabled(!settings.render.deterministicLayout).onChange(async (value) => {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isNaN(parsed)) {
          await updateRenderAndPreview({ randomSeed: parsed });
        }
      });
    });
    this.attachInfoIcon(randomSeed, "Changing seed gives a different stable arrangement.");
    const resetRendering = new import_obsidian5.Setting(containerEl).setName("Reset rendering settings").setDesc("Restore default renderer controls.").addButton((button) => {
      button.setButtonText("Reset rendering").onClick(async () => {
        await this.services.resetRenderSettings();
        this.display();
      });
    });
    this.attachInfoIcon(resetRendering, "Resets rendering options only.");
    containerEl.createEl("h3", { text: "Performance" });
    containerEl.createEl("p", {
      text: "Tune speed vs UI smoothness and progress update detail for large clouds."
    });
    const progressDetail = new import_obsidian5.Setting(containerEl).setName("Progress detail").setDesc("How frequently progress is updated while scanning and layout.").addDropdown((dropdown) => {
      dropdown.addOption("unhinged", "Unhinged (max speed)").addOption("minimal", "Minimal (fastest)").addOption("balanced", "Balanced").addOption("detailed", "Detailed").setValue(settings.render.progressDetail).onChange(async (value) => {
        await this.services.updateRenderSettings({ progressDetail: value });
      });
    });
    this.attachInfoIcon(progressDetail, "Unhinged maximizes speed and may lock UI temporarily. Detailed is most informative but slower.");
    const scanBatchSize = new import_obsidian5.Setting(containerEl).setName("Scan batch size").setDesc("How many files are read in parallel during vault scanning.").addSlider((slider) => {
      slider.setLimits(8, 64, 1).setValue(settings.render.scanBatchSize).setDynamicTooltip().onChange(async (value) => {
        await this.services.updateRenderSettings({ scanBatchSize: value });
      });
    });
    this.attachInfoIcon(scanBatchSize, "Higher can be faster on strong devices but uses more memory/IO.");
    const layoutTimeSlice = new import_obsidian5.Setting(containerEl).setName("Layout time slice (ms)").setDesc("Time per layout chunk. Lower is smoother; higher is faster.").addSlider((slider) => {
      slider.setLimits(8, 40, 1).setValue(settings.render.layoutTimeIntervalMs).setDynamicTooltip().onChange(async (value) => {
        await this.services.updateRenderSettings({ layoutTimeIntervalMs: value });
      });
    });
    this.attachInfoIcon(layoutTimeSlice, "Controls responsiveness while laying out words.");
    const resetPerformance = new import_obsidian5.Setting(containerEl).setName("Reset performance settings").setDesc("Restore default performance tuning values.").addButton((button) => {
      button.setButtonText("Reset performance").onClick(async () => {
        await this.services.updateRenderSettings({
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

// src/settings/register.ts
function registerSettings(plugin, deps) {
  plugin.addSettingTab(new VaultWordCloudSettingTab(plugin, deps.services.wordCloud));
}

// src/ui/register.ts
function registerUI(plugin) {
  plugin.addRibbonIcon("cloud", "Open word clouds", () => {
    void activateVaultWordCloudView(plugin.app);
  });
}

// src/views/blocks/wordcloud-block.ts
var import_obsidian6 = require("obsidian");
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
            new import_obsidian6.Notice(`Excluded "${word}" in this cloud.`);
          } else {
            new import_obsidian6.Notice(`"${word}" is already excluded in this cloud.`);
          }
        },
        onExcludeInVault: async (word) => {
          const added = await services.addBlacklistWord(word);
          new import_obsidian6.Notice(added ? `Excluded "${word}" from word clouds.` : `"${word}" is already excluded.`);
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
    if (!(view instanceof import_obsidian6.MarkdownView) || !view.file) {
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
  return fromContext instanceof import_obsidian6.TFile ? fromContext : null;
}
function resolveSpecificFile(plugin, filePath) {
  const normalizedPath = filePath.trim();
  if (!normalizedPath) {
    return null;
  }
  const resolved = plugin.app.vault.getAbstractFileByPath(normalizedPath);
  return resolved instanceof import_obsidian6.TFile ? resolved : null;
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
    new import_obsidian6.Notice("Could not locate the source note for this embedded word cloud.");
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
    new import_obsidian6.Notice("Could not locate the embedded word cloud block to update.");
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

// src/views/document-word-cloud-view.ts
var import_obsidian8 = require("obsidian");

// src/views/components/filter-panel.ts
var import_obsidian7 = require("obsidian");
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
    (0, import_obsidian7.setIcon)(resetButton, "rotate-ccw");
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

// src/views/document-word-cloud-view.ts
var VaultWordCloudView = class extends import_obsidian8.ItemView {
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
          new import_obsidian8.Notice(added ? `Excluded "${word}" from word clouds.` : `"${word}" is already excluded.`);
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

// src/views/sidebar-word-cloud-view.ts
var import_obsidian9 = require("obsidian");

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

// src/views/sidebar-word-cloud-view.ts
var NoteWordCloudView = class extends import_obsidian9.ItemView {
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
          new import_obsidian9.Notice(added ? `Excluded "${word}" from word clouds.` : `"${word}" is already excluded.`);
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

// src/views/register.ts
function registerViews(plugin, deps) {
  plugin.registerView(VIEW_TYPE_VAULT_WORD_CLOUD, (leaf) => new VaultWordCloudView(leaf, deps.services.wordCloud));
  plugin.registerView(VIEW_TYPE_NOTE_WORD_CLOUD, (leaf) => new NoteWordCloudView(leaf, deps.services.wordCloud));
  registerEmbeddedWordCloudProcessor(plugin, deps.services.wordCloud);
}

// src/main.ts
var VaultWordCloudPlugin = class extends import_obsidian10.Plugin {
  constructor() {
    super(...arguments);
    this.deps = null;
    this.disposer = new Disposer();
  }
  async onload() {
    try {
      const deps = await this.initializeDependencies();
      this.registerIntegrationPoints(deps);
      this.registerTeardown(deps);
    } catch (error) {
      this.disposer.disposeAll();
      this.deps = null;
      throw error;
    }
  }
  onunload() {
    this.disposer.disposeAll();
    this.deps = null;
  }
  async initializeDependencies() {
    const deps = await createDeps(this);
    this.deps = deps;
    return deps;
  }
  registerIntegrationPoints(deps) {
    registerViews(this, deps);
    registerCommands(this, deps);
    registerEvents(this, deps);
    registerUI(this);
    registerSettings(this, deps);
  }
  registerTeardown(deps) {
    this.disposer.add(deps.dispose);
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL2QzLWNsb3VkL25vZGVfbW9kdWxlcy9kMy1kaXNwYXRjaC9kaXN0L2QzLWRpc3BhdGNoLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1jbG91ZC9pbmRleC5qcyIsICIuLi9zcmMvbWFpbi50cyIsICIuLi9zcmMvbW9kYWxzL2VkaXQtd29yZC1jbG91ZC1tb2RhbC50cyIsICIuLi9zcmMvdXRpbHMudHMiLCAiLi4vc3JjL3NlcnZpY2VzL2VkaXRvci1pbnNlcnRpb24udHMiLCAiLi4vc3JjL2NvbnN0YW50cy50cyIsICIuLi9zcmMvdmlld3MvYWN0aXZhdGUudHMiLCAiLi4vc3JjL2NvbW1hbmRzL3JlZ2lzdGVyLnRzIiwgIi4uL3NyYy9ldmVudHMvY29vcmRpbmF0b3IudHMiLCAiLi4vc3JjL2ludGVncmF0aW9uL29ic2lkaWFuLWFkYXB0ZXIudHMiLCAiLi4vc3JjL3NldHRpbmdzL21pZ3JhdGlvbnMudHMiLCAiLi4vc3JjL3NldHRpbmdzL3R5cGVzLnRzIiwgIi4uL3NyYy9zZXR0aW5ncy9zZXJ2aWNlLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvYXNjZW5kaW5nLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvZGVzY2VuZGluZy5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtYXJyYXkvc3JjL2Jpc2VjdG9yLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvbnVtYmVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvYmlzZWN0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9pbnRlcm5tYXAvc3JjL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1hcnJheS9zcmMvdGlja3MuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWFycmF5L3NyYy9yYW5nZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL2luaXQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9vcmRpbmFsLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvYmFuZC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtY29sb3Ivc3JjL2RlZmluZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtY29sb3Ivc3JjL2NvbG9yLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvYmFzaXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9iYXNpc0Nsb3NlZC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2NvbnN0YW50LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvY29sb3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9yZ2IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9udW1iZXJBcnJheS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2FycmF5LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvZGF0ZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL251bWJlci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL29iamVjdC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3N0cmluZy5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3ZhbHVlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvcm91bmQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlL3NyYy9jb25zdGFudC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL251bWJlci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL2NvbnRpbnVvdXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvZm9ybWF0RGVjaW1hbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9leHBvbmVudC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9mb3JtYXRHcm91cC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9mb3JtYXROdW1lcmFscy5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9mb3JtYXRTcGVjaWZpZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvZm9ybWF0VHJpbS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtZm9ybWF0L3NyYy9mb3JtYXRQcmVmaXhBdXRvLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL2Zvcm1hdFJvdW5kZWQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvZm9ybWF0VHlwZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvaWRlbnRpdHkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvbG9jYWxlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL2RlZmF1bHRMb2NhbGUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvcHJlY2lzaW9uRml4ZWQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLWZvcm1hdC9zcmMvcHJlY2lzaW9uUHJlZml4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1mb3JtYXQvc3JjL3ByZWNpc2lvblJvdW5kLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvdGlja0Zvcm1hdC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL2xpbmVhci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2NhbGUtY2hyb21hdGljL3NyYy9jb2xvcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvY2F0ZWdvcmljYWwvVGFibGVhdTEwLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL25hbWVzcGFjZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvbmFtZXNwYWNlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL2NyZWF0b3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0b3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9hcnJheS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3RvckFsbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0QWxsLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL21hdGNoZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdENoaWxkLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3RDaGlsZHJlbi5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZmlsdGVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zcGFyc2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2VudGVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL2NvbnN0YW50LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9kYXRhLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9leGl0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9qb2luLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9tZXJnZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vb3JkZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NvcnQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2NhbGwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL25vZGVzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9ub2RlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zaXplLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lbXB0eS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZWFjaC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vYXR0ci5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy93aW5kb3cuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3N0eWxlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9wcm9wZXJ0eS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2xhc3NlZC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vdGV4dC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaHRtbC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcmFpc2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2xvd2VyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9hcHBlbmQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2luc2VydC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcmVtb3ZlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9jbG9uZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGF0dW0uanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL29uLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9kaXNwYXRjaC5qcyIsICIuLi9ub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vaXRlcmF0b3IuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdC5qcyIsICIuLi9zcmMvcmVuZGVyZXJzL3dvcmQtY2xvdWQtcmVuZGVyZXIudHMiLCAiLi4vc3JjL3V0aWxzL2FwcGx5LXNlYXJjaC50cyIsICIuLi9zcmMvc2VydmljZXMvd29yZGNsb3VkLXNlcnZpY2VzLnRzIiwgIi4uL3NyYy93b3JkY2xvdWQvaW5nZXN0aW9uL29ic2lkaWFuLXNvdXJjZS50cyIsICIuLi9zcmMvd29yZGNsb3VkL2luZ2VzdGlvbi9maWx0ZXJzL3BhdGgtZmlsdGVyLnRzIiwgIi4uL3NyYy93b3JkY2xvdWQvaW5nZXN0aW9uL2ZpbHRlcnMvdGFnLWZpbHRlci50cyIsICIuLi9zcmMvd29yZGNsb3VkL2luZ2VzdGlvbi9maWx0ZXJzL2RhdGUtZmlsdGVyLnRzIiwgIi4uL3NyYy93b3JkY2xvdWQvaW5nZXN0aW9uL2ZpbHRlcnMvZnJvbnRtYXR0ZXItZmlsdGVyLnRzIiwgIi4uL3NyYy93b3JkY2xvdWQvaW5nZXN0aW9uL2ZpbHRlcnMvbGluay1maWx0ZXIudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9pbmdlc3Rpb24vbWV0YWRhdGEtZmlsZS1maWx0ZXIudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9pbmdlc3Rpb24vdGFnLWNhdGFsb2cudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9waXBlbGluZS93b3JkLXNjYWxpbmcudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9waXBlbGluZS9zdHJhdGVnaWVzL2RlZmF1bHRzLnRzIiwgIi4uL3NyYy93b3JkY2xvdWQvcGlwZWxpbmUvc3RhZ2VzLzA2LWFnZ3JlZ2F0ZS10b2tlbi1jb3VudHMudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9waXBlbGluZS9zdGFnZXMvMDctYXBwbHktZnJlcXVlbmN5LXRocmVzaG9sZHMudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9waXBlbGluZS9zdGFnZXMvMDUtZmlsdGVyLXRva2Vucy50cyIsICIuLi9zcmMvd29yZGNsb3VkL3BpcGVsaW5lL3N0YWdlcy8wMy1ub3JtYWxpemUtZG9jdW1lbnRzLnRzIiwgIi4uL3NyYy93b3JkY2xvdWQvcGlwZWxpbmUvc3RhZ2VzLzA5LWNyZWF0ZS1yZW5kZXItbW9kZWwudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9waXBlbGluZS9zdGFnZXMvMDgtc2NhbGUtd29yZC13ZWlnaHRzLnRzIiwgIi4uL3NyYy93b3JkY2xvdWQvcGlwZWxpbmUvc3RhZ2VzLzAyLWZpbHRlci1ieS1zb3VyY2UtY29udGVudC50cyIsICIuLi9zcmMvd29yZGNsb3VkL3BpcGVsaW5lL3N0YWdlcy8wNC10b2tlbml6ZS1kb2N1bWVudHMudHMiLCAiLi4vc3JjL3dvcmRjbG91ZC9waXBlbGluZS9ydW4tdHJhbnNmb3JtLXBpcGVsaW5lLnRzIiwgIi4uL3NyYy93b3JkY2xvdWQvYXBwbGljYXRpb24vd29yZGNsb3VkLXNlcnZpY2UudHMiLCAiLi4vc3JjL2NyZWF0ZS1kZXBzLnRzIiwgIi4uL3NyYy9ldmVudHMvcmVnaXN0ZXIudHMiLCAiLi4vc3JjL2xpZmVjeWNsZS9kaXNwb3Nlci50cyIsICIuLi9zcmMvc2V0dGluZ3MvdGFiLnRzIiwgIi4uL3NyYy9zZXR0aW5ncy9yZWdpc3Rlci50cyIsICIuLi9zcmMvdWkvcmVnaXN0ZXIudHMiLCAiLi4vc3JjL3ZpZXdzL2Jsb2Nrcy93b3JkY2xvdWQtYmxvY2sudHMiLCAiLi4vc3JjL3ZpZXdzL2RvY3VtZW50LXdvcmQtY2xvdWQtdmlldy50cyIsICIuLi9zcmMvdmlld3MvY29tcG9uZW50cy9maWx0ZXItcGFuZWwudHMiLCAiLi4vc3JjL3ZpZXdzL3NpZGViYXItd29yZC1jbG91ZC12aWV3LnRzIiwgIi4uL3NyYy9yZW5kZXJlcnMvZnJlcXVlbmN5LWNoYXJ0LXJlbmRlcmVyLnRzIiwgIi4uL3NyYy92aWV3cy9yZWdpc3Rlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gaHR0cHM6Ly9kM2pzLm9yZy9kMy1kaXNwYXRjaC8gdjEuMC42IENvcHlyaWdodCAyMDE5IE1pa2UgQm9zdG9ja1xuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbnR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxudHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4oZ2xvYmFsID0gZ2xvYmFsIHx8IHNlbGYsIGZhY3RvcnkoZ2xvYmFsLmQzID0gZ2xvYmFsLmQzIHx8IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxudmFyIG5vb3AgPSB7dmFsdWU6IGZ1bmN0aW9uKCkge319O1xuXG5mdW5jdGlvbiBkaXNwYXRjaCgpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSBhcmd1bWVudHMubGVuZ3RoLCBfID0ge30sIHQ7IGkgPCBuOyArK2kpIHtcbiAgICBpZiAoISh0ID0gYXJndW1lbnRzW2ldICsgXCJcIikgfHwgKHQgaW4gXykgfHwgL1tcXHMuXS8udGVzdCh0KSkgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCB0eXBlOiBcIiArIHQpO1xuICAgIF9bdF0gPSBbXTtcbiAgfVxuICByZXR1cm4gbmV3IERpc3BhdGNoKF8pO1xufVxuXG5mdW5jdGlvbiBEaXNwYXRjaChfKSB7XG4gIHRoaXMuXyA9IF87XG59XG5cbmZ1bmN0aW9uIHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lcywgdHlwZXMpIHtcbiAgcmV0dXJuIHR5cGVuYW1lcy50cmltKCkuc3BsaXQoL158XFxzKy8pLm1hcChmdW5jdGlvbih0KSB7XG4gICAgdmFyIG5hbWUgPSBcIlwiLCBpID0gdC5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAoaSA+PSAwKSBuYW1lID0gdC5zbGljZShpICsgMSksIHQgPSB0LnNsaWNlKDAsIGkpO1xuICAgIGlmICh0ICYmICF0eXBlcy5oYXNPd25Qcm9wZXJ0eSh0KSkgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0eXBlOiBcIiArIHQpO1xuICAgIHJldHVybiB7dHlwZTogdCwgbmFtZTogbmFtZX07XG4gIH0pO1xufVxuXG5EaXNwYXRjaC5wcm90b3R5cGUgPSBkaXNwYXRjaC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBEaXNwYXRjaCxcbiAgb246IGZ1bmN0aW9uKHR5cGVuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBfID0gdGhpcy5fLFxuICAgICAgICBUID0gcGFyc2VUeXBlbmFtZXModHlwZW5hbWUgKyBcIlwiLCBfKSxcbiAgICAgICAgdCxcbiAgICAgICAgaSA9IC0xLFxuICAgICAgICBuID0gVC5sZW5ndGg7XG5cbiAgICAvLyBJZiBubyBjYWxsYmFjayB3YXMgc3BlY2lmaWVkLCByZXR1cm4gdGhlIGNhbGxiYWNrIG9mIHRoZSBnaXZlbiB0eXBlIGFuZCBuYW1lLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgodCA9ICh0eXBlbmFtZSA9IFRbaV0pLnR5cGUpICYmICh0ID0gZ2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUpKSkgcmV0dXJuIHQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgYSB0eXBlIHdhcyBzcGVjaWZpZWQsIHNldCB0aGUgY2FsbGJhY2sgZm9yIHRoZSBnaXZlbiB0eXBlIGFuZCBuYW1lLlxuICAgIC8vIE90aGVyd2lzZSwgaWYgYSBudWxsIGNhbGxiYWNrIHdhcyBzcGVjaWZpZWQsIHJlbW92ZSBjYWxsYmFja3Mgb2YgdGhlIGdpdmVuIG5hbWUuXG4gICAgaWYgKGNhbGxiYWNrICE9IG51bGwgJiYgdHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgY2FsbGJhY2s6IFwiICsgY2FsbGJhY2spO1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAodCA9ICh0eXBlbmFtZSA9IFRbaV0pLnR5cGUpIF9bdF0gPSBzZXQoX1t0XSwgdHlwZW5hbWUubmFtZSwgY2FsbGJhY2spO1xuICAgICAgZWxzZSBpZiAoY2FsbGJhY2sgPT0gbnVsbCkgZm9yICh0IGluIF8pIF9bdF0gPSBzZXQoX1t0XSwgdHlwZW5hbWUubmFtZSwgbnVsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGNvcHk6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb3B5ID0ge30sIF8gPSB0aGlzLl87XG4gICAgZm9yICh2YXIgdCBpbiBfKSBjb3B5W3RdID0gX1t0XS5zbGljZSgpO1xuICAgIHJldHVybiBuZXcgRGlzcGF0Y2goY29weSk7XG4gIH0sXG4gIGNhbGw6IGZ1bmN0aW9uKHR5cGUsIHRoYXQpIHtcbiAgICBpZiAoKG4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMikgPiAwKSBmb3IgKHZhciBhcmdzID0gbmV3IEFycmF5KG4pLCBpID0gMCwgbiwgdDsgaSA8IG47ICsraSkgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgaWYgKCF0aGlzLl8uaGFzT3duUHJvcGVydHkodHlwZSkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0eXBlKTtcbiAgICBmb3IgKHQgPSB0aGlzLl9bdHlwZV0sIGkgPSAwLCBuID0gdC5sZW5ndGg7IGkgPCBuOyArK2kpIHRbaV0udmFsdWUuYXBwbHkodGhhdCwgYXJncyk7XG4gIH0sXG4gIGFwcGx5OiBmdW5jdGlvbih0eXBlLCB0aGF0LCBhcmdzKSB7XG4gICAgaWYgKCF0aGlzLl8uaGFzT3duUHJvcGVydHkodHlwZSkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0eXBlKTtcbiAgICBmb3IgKHZhciB0ID0gdGhpcy5fW3R5cGVdLCBpID0gMCwgbiA9IHQubGVuZ3RoOyBpIDwgbjsgKytpKSB0W2ldLnZhbHVlLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBnZXQodHlwZSwgbmFtZSkge1xuICBmb3IgKHZhciBpID0gMCwgbiA9IHR5cGUubGVuZ3RoLCBjOyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKChjID0gdHlwZVtpXSkubmFtZSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIGMudmFsdWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldCh0eXBlLCBuYW1lLCBjYWxsYmFjaykge1xuICBmb3IgKHZhciBpID0gMCwgbiA9IHR5cGUubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKHR5cGVbaV0ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgdHlwZVtpXSA9IG5vb3AsIHR5cGUgPSB0eXBlLnNsaWNlKDAsIGkpLmNvbmNhdCh0eXBlLnNsaWNlKGkgKyAxKSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHR5cGUucHVzaCh7bmFtZTogbmFtZSwgdmFsdWU6IGNhbGxiYWNrfSk7XG4gIHJldHVybiB0eXBlO1xufVxuXG5leHBvcnRzLmRpc3BhdGNoID0gZGlzcGF0Y2g7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbn0pKTtcbiIsICIvLyBXb3JkIGNsb3VkIGxheW91dCBieSBKYXNvbiBEYXZpZXMsIGh0dHBzOi8vd3d3Lmphc29uZGF2aWVzLmNvbS93b3JkY2xvdWQvXG4vLyBBbGdvcml0aG0gZHVlIHRvIEpvbmF0aGFuIEZlaW5iZXJnLCBodHRwczovL3MzLmFtYXpvbmF3cy5jb20vc3RhdGljLm1yZmVpbmJlcmcuY29tL2J2X2NoMDMucGRmXG5cbmNvbnN0IGRpc3BhdGNoID0gcmVxdWlyZShcImQzLWRpc3BhdGNoXCIpLmRpc3BhdGNoO1xuXG5jb25zdCBSQURJQU5TID0gTWF0aC5QSSAvIDE4MDtcblxuY29uc3QgU1BJUkFMUyA9IHtcbiAgYXJjaGltZWRlYW46IGFyY2hpbWVkZWFuU3BpcmFsLFxuICByZWN0YW5ndWxhcjogcmVjdGFuZ3VsYXJTcGlyYWxcbn07XG5cbmNvbnN0IGN3ID0gMSA8PCAxMSA+PiA1O1xuY29uc3QgY2ggPSAxIDw8IDExO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2l6ZSA9IFsyNTYsIDI1Nl0sXG4gICAgICB0ZXh0ID0gY2xvdWRUZXh0LFxuICAgICAgZm9udCA9IGNsb3VkRm9udCxcbiAgICAgIGZvbnRTaXplID0gY2xvdWRGb250U2l6ZSxcbiAgICAgIGZvbnRTdHlsZSA9IGNsb3VkRm9udE5vcm1hbCxcbiAgICAgIGZvbnRXZWlnaHQgPSBjbG91ZEZvbnROb3JtYWwsXG4gICAgICBwYWRkaW5nID0gY2xvdWRQYWRkaW5nLFxuICAgICAgc3BpcmFsID0gYXJjaGltZWRlYW5TcGlyYWwsXG4gICAgICB3b3JkcyA9IFtdLFxuICAgICAgdGltZUludGVydmFsID0gSW5maW5pdHksXG4gICAgICBldmVudCA9IGRpc3BhdGNoKFwid29yZFwiLCBcImVuZFwiKSxcbiAgICAgIHRpbWVyID0gbnVsbCxcbiAgICAgIHJhbmRvbSA9IE1hdGgucmFuZG9tLFxuICAgICAgcm90YXRlID0gKCkgPT4gKH5+KHJhbmRvbSgpICogNikgLSAzKSAqIDMwLFxuICAgICAgY2xvdWQgPSB7fSxcbiAgICAgIGNhbnZhcyA9IGNsb3VkQ2FudmFzO1xuXG4gIGNsb3VkLmNhbnZhcyA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjYW52YXMgPSBmdW5jdG9yKF8pLCBjbG91ZCkgOiBjYW52YXM7XG4gIH07XG5cbiAgY2xvdWQuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGV4dEFuZFJhdGlvID0gZ2V0Q29udGV4dChjYW52YXMoKSksXG4gICAgICAgIGJvYXJkID0gemVyb0FycmF5KChzaXplWzBdID4+IDUpICogc2l6ZVsxXSksXG4gICAgICAgIGJvdW5kcyA9IG51bGwsXG4gICAgICAgIG4gPSB3b3Jkcy5sZW5ndGgsXG4gICAgICAgIGkgPSAtMSxcbiAgICAgICAgdGFncyA9IFtdLFxuICAgICAgICBkYXRhID0gd29yZHMubWFwKGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICBkLnRleHQgPSB0ZXh0LmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgZC5mb250ID0gZm9udC5jYWxsKHRoaXMsIGQsIGkpO1xuICAgICAgICAgIGQuc3R5bGUgPSBmb250U3R5bGUuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgICBkLndlaWdodCA9IGZvbnRXZWlnaHQuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgICBkLnJvdGF0ZSA9IHJvdGF0ZS5jYWxsKHRoaXMsIGQsIGkpO1xuICAgICAgICAgIGQuc2l6ZSA9IH5+Zm9udFNpemUuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgICBkLnBhZGRpbmcgPSBwYWRkaW5nLmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgICAgcmV0dXJuIGQ7XG4gICAgICAgIH0pLnNvcnQoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYi5zaXplIC0gYS5zaXplOyB9KTtcblxuICAgIGlmICh0aW1lcikgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbChzdGVwLCAwKTtcbiAgICBzdGVwKCk7XG5cbiAgICByZXR1cm4gY2xvdWQ7XG5cbiAgICBmdW5jdGlvbiBzdGVwKCkge1xuICAgICAgdmFyIHN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICAgIHdoaWxlIChEYXRlLm5vdygpIC0gc3RhcnQgPCB0aW1lSW50ZXJ2YWwgJiYgKytpIDwgbiAmJiB0aW1lcikge1xuICAgICAgICB2YXIgZCA9IGRhdGFbaV07XG4gICAgICAgIGQueCA9IChzaXplWzBdICogKHJhbmRvbSgpICsgLjUpKSA+PiAxO1xuICAgICAgICBkLnkgPSAoc2l6ZVsxXSAqIChyYW5kb20oKSArIC41KSkgPj4gMTtcbiAgICAgICAgY2xvdWRTcHJpdGUoY29udGV4dEFuZFJhdGlvLCBkLCBkYXRhLCBpKTtcbiAgICAgICAgaWYgKGQuaGFzVGV4dCAmJiBwbGFjZShib2FyZCwgZCwgYm91bmRzKSkge1xuICAgICAgICAgIHRhZ3MucHVzaChkKTtcbiAgICAgICAgICBldmVudC5jYWxsKFwid29yZFwiLCBjbG91ZCwgZCk7XG4gICAgICAgICAgaWYgKGJvdW5kcykgY2xvdWRCb3VuZHMoYm91bmRzLCBkKTtcbiAgICAgICAgICBlbHNlIGJvdW5kcyA9IFt7eDogZC54ICsgZC54MCwgeTogZC55ICsgZC55MH0sIHt4OiBkLnggKyBkLngxLCB5OiBkLnkgKyBkLnkxfV07XG4gICAgICAgICAgLy8gVGVtcG9yYXJ5IGhhY2tcbiAgICAgICAgICBkLnggLT0gc2l6ZVswXSA+PiAxO1xuICAgICAgICAgIGQueSAtPSBzaXplWzFdID4+IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpID49IG4pIHtcbiAgICAgICAgY2xvdWQuc3RvcCgpO1xuICAgICAgICBldmVudC5jYWxsKFwiZW5kXCIsIGNsb3VkLCB0YWdzLCBib3VuZHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNsb3VkLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGltZXIpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgdGltZXIgPSBudWxsO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGQgb2Ygd29yZHMpIHtcbiAgICAgIGRlbGV0ZSBkLnNwcml0ZTtcbiAgICB9XG4gICAgcmV0dXJuIGNsb3VkO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdldENvbnRleHQoY2FudmFzKSB7XG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIiwge3dpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZX0pO1xuXG4gICAgY2FudmFzLndpZHRoID0gY2FudmFzLmhlaWdodCA9IDE7XG4gICAgY29uc3QgcmF0aW8gPSBNYXRoLnNxcnQoY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgMSwgMSkuZGF0YS5sZW5ndGggPj4gMik7XG4gICAgY2FudmFzLndpZHRoID0gKGN3IDw8IDUpIC8gcmF0aW87XG4gICAgY2FudmFzLmhlaWdodCA9IGNoIC8gcmF0aW87XG5cbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcInJlZFwiO1xuXG4gICAgcmV0dXJuIHtjb250ZXh0LCByYXRpb307XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZShib2FyZCwgdGFnLCBib3VuZHMpIHtcbiAgICB2YXIgcGVyaW1ldGVyID0gW3t4OiAwLCB5OiAwfSwge3g6IHNpemVbMF0sIHk6IHNpemVbMV19XSxcbiAgICAgICAgc3RhcnRYID0gdGFnLngsXG4gICAgICAgIHN0YXJ0WSA9IHRhZy55LFxuICAgICAgICBtYXhEZWx0YSA9IE1hdGguc3FydChzaXplWzBdICogc2l6ZVswXSArIHNpemVbMV0gKiBzaXplWzFdKSxcbiAgICAgICAgcyA9IHNwaXJhbChzaXplKSxcbiAgICAgICAgZHQgPSByYW5kb20oKSA8IC41ID8gMSA6IC0xLFxuICAgICAgICB0ID0gLWR0LFxuICAgICAgICBkeGR5LFxuICAgICAgICBkeCxcbiAgICAgICAgZHk7XG5cbiAgICB3aGlsZSAoZHhkeSA9IHModCArPSBkdCkpIHtcbiAgICAgIGR4ID0gfn5keGR5WzBdO1xuICAgICAgZHkgPSB+fmR4ZHlbMV07XG5cbiAgICAgIGlmIChNYXRoLm1pbihNYXRoLmFicyhkeCksIE1hdGguYWJzKGR5KSkgPj0gbWF4RGVsdGEpIGJyZWFrO1xuXG4gICAgICB0YWcueCA9IHN0YXJ0WCArIGR4O1xuICAgICAgdGFnLnkgPSBzdGFydFkgKyBkeTtcblxuICAgICAgaWYgKHRhZy54ICsgdGFnLngwIDwgMCB8fCB0YWcueSArIHRhZy55MCA8IDAgfHxcbiAgICAgICAgICB0YWcueCArIHRhZy54MSA+IHNpemVbMF0gfHwgdGFnLnkgKyB0YWcueTEgPiBzaXplWzFdKSBjb250aW51ZTtcbiAgICAgIC8vIFRPRE8gb25seSBjaGVjayBmb3IgY29sbGlzaW9ucyB3aXRoaW4gY3VycmVudCBib3VuZHMuXG4gICAgICBpZiAoIWJvdW5kcyB8fCBjb2xsaWRlUmVjdHModGFnLCBib3VuZHMpKSB7XG4gICAgICAgIGlmICghY2xvdWRDb2xsaWRlKHRhZywgYm9hcmQsIHNpemVbMF0pKSB7XG4gICAgICAgICAgdmFyIHNwcml0ZSA9IHRhZy5zcHJpdGUsXG4gICAgICAgICAgICAgIHcgPSB0YWcud2lkdGggPj4gNSxcbiAgICAgICAgICAgICAgc3cgPSBzaXplWzBdID4+IDUsXG4gICAgICAgICAgICAgIGx4ID0gdGFnLnggLSAodyA8PCA0KSxcbiAgICAgICAgICAgICAgc3ggPSBseCAmIDB4N2YsXG4gICAgICAgICAgICAgIG1zeCA9IDMyIC0gc3gsXG4gICAgICAgICAgICAgIGggPSB0YWcueTEgLSB0YWcueTAsXG4gICAgICAgICAgICAgIHggPSAodGFnLnkgKyB0YWcueTApICogc3cgKyAobHggPj4gNSksXG4gICAgICAgICAgICAgIGxhc3Q7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoOyBqKyspIHtcbiAgICAgICAgICAgIGxhc3QgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gdzsgaSsrKSB7XG4gICAgICAgICAgICAgIGJvYXJkW3ggKyBpXSB8PSAobGFzdCA8PCBtc3gpIHwgKGkgPCB3ID8gKGxhc3QgPSBzcHJpdGVbaiAqIHcgKyBpXSkgPj4+IHN4IDogMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB4ICs9IHN3O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjbG91ZC50aW1lSW50ZXJ2YWwgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGltZUludGVydmFsID0gXyA9PSBudWxsID8gSW5maW5pdHkgOiBfLCBjbG91ZCkgOiB0aW1lSW50ZXJ2YWw7XG4gIH07XG5cbiAgY2xvdWQud29yZHMgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAod29yZHMgPSBfLCBjbG91ZCkgOiB3b3JkcztcbiAgfTtcblxuICBjbG91ZC5zaXplID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHNpemUgPSBbK19bMF0sICtfWzFdXSwgY2xvdWQpIDogc2l6ZTtcbiAgfTtcblxuICBjbG91ZC5mb250ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGZvbnQgPSBmdW5jdG9yKF8pLCBjbG91ZCkgOiBmb250O1xuICB9O1xuXG4gIGNsb3VkLmZvbnRTdHlsZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmb250U3R5bGUgPSBmdW5jdG9yKF8pLCBjbG91ZCkgOiBmb250U3R5bGU7XG4gIH07XG5cbiAgY2xvdWQuZm9udFdlaWdodCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmb250V2VpZ2h0ID0gZnVuY3RvcihfKSwgY2xvdWQpIDogZm9udFdlaWdodDtcbiAgfTtcblxuICBjbG91ZC5yb3RhdGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocm90YXRlID0gZnVuY3RvcihfKSwgY2xvdWQpIDogcm90YXRlO1xuICB9O1xuXG4gIGNsb3VkLnRleHQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGV4dCA9IGZ1bmN0b3IoXyksIGNsb3VkKSA6IHRleHQ7XG4gIH07XG5cbiAgY2xvdWQuc3BpcmFsID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHNwaXJhbCA9IFNQSVJBTFNbX10gfHwgXywgY2xvdWQpIDogc3BpcmFsO1xuICB9O1xuXG4gIGNsb3VkLmZvbnRTaXplID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGZvbnRTaXplID0gZnVuY3RvcihfKSwgY2xvdWQpIDogZm9udFNpemU7XG4gIH07XG5cbiAgY2xvdWQucGFkZGluZyA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChwYWRkaW5nID0gZnVuY3RvcihfKSwgY2xvdWQpIDogcGFkZGluZztcbiAgfTtcblxuICBjbG91ZC5yYW5kb20gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocmFuZG9tID0gXywgY2xvdWQpIDogcmFuZG9tO1xuICB9O1xuXG4gIGNsb3VkLm9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlID0gZXZlbnQub24uYXBwbHkoZXZlbnQsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHZhbHVlID09PSBldmVudCA/IGNsb3VkIDogdmFsdWU7XG4gIH07XG5cbiAgcmV0dXJuIGNsb3VkO1xufTtcblxuZnVuY3Rpb24gY2xvdWRUZXh0KGQpIHtcbiAgcmV0dXJuIGQudGV4dDtcbn1cblxuZnVuY3Rpb24gY2xvdWRGb250KCkge1xuICByZXR1cm4gXCJzZXJpZlwiO1xufVxuXG5mdW5jdGlvbiBjbG91ZEZvbnROb3JtYWwoKSB7XG4gIHJldHVybiBcIm5vcm1hbFwiO1xufVxuXG5mdW5jdGlvbiBjbG91ZEZvbnRTaXplKGQpIHtcbiAgcmV0dXJuIE1hdGguc3FydChkLnZhbHVlKTtcbn1cblxuZnVuY3Rpb24gY2xvdWRQYWRkaW5nKCkge1xuICByZXR1cm4gMTtcbn1cblxuLy8gRmV0Y2hlcyBhIG1vbm9jaHJvbWUgc3ByaXRlIGJpdG1hcCBmb3IgdGhlIHNwZWNpZmllZCB0ZXh0LlxuLy8gTG9hZCBpbiBiYXRjaGVzIGZvciBzcGVlZC5cbmZ1bmN0aW9uIGNsb3VkU3ByaXRlKGNvbnRleHRBbmRSYXRpbywgZCwgZGF0YSwgZGkpIHtcbiAgaWYgKGQuc3ByaXRlKSByZXR1cm47XG4gIHZhciBjID0gY29udGV4dEFuZFJhdGlvLmNvbnRleHQsXG4gICAgICByYXRpbyA9IGNvbnRleHRBbmRSYXRpby5yYXRpbztcblxuICBjLmNsZWFyUmVjdCgwLCAwLCAoY3cgPDwgNSkgLyByYXRpbywgY2ggLyByYXRpbyk7XG4gIHZhciB4ID0gMCxcbiAgICAgIHkgPSAwLFxuICAgICAgbWF4aCA9IDAsXG4gICAgICBuID0gZGF0YS5sZW5ndGg7XG4gIC0tZGk7XG4gIHdoaWxlICgrK2RpIDwgbikge1xuICAgIGQgPSBkYXRhW2RpXTtcbiAgICBjLnNhdmUoKTtcbiAgICBjLmZvbnQgPSBkLnN0eWxlICsgXCIgXCIgKyBkLndlaWdodCArIFwiIFwiICsgfn4oKGQuc2l6ZSArIDEpIC8gcmF0aW8pICsgXCJweCBcIiArIGQuZm9udDtcbiAgICBjb25zdCBtZXRyaWNzID0gYy5tZWFzdXJlVGV4dChkLnRleHQpO1xuICAgIGNvbnN0IGFuY2hvciA9IC1NYXRoLmZsb29yKG1ldHJpY3Mud2lkdGggLyAyKTtcbiAgICBsZXQgdyA9IChtZXRyaWNzLndpZHRoICsgMSkgKiByYXRpbztcbiAgICBsZXQgaCA9IGQuc2l6ZSA8PCAxO1xuICAgIGlmIChkLnJvdGF0ZSkge1xuICAgICAgdmFyIHNyID0gTWF0aC5zaW4oZC5yb3RhdGUgKiBSQURJQU5TKSxcbiAgICAgICAgICBjciA9IE1hdGguY29zKGQucm90YXRlICogUkFESUFOUyksXG4gICAgICAgICAgd2NyID0gdyAqIGNyLFxuICAgICAgICAgIHdzciA9IHcgKiBzcixcbiAgICAgICAgICBoY3IgPSBoICogY3IsXG4gICAgICAgICAgaHNyID0gaCAqIHNyO1xuICAgICAgdyA9IChNYXRoLm1heChNYXRoLmFicyh3Y3IgKyBoc3IpLCBNYXRoLmFicyh3Y3IgLSBoc3IpKSArIDB4MWYpID4+IDUgPDwgNTtcbiAgICAgIGggPSB+fk1hdGgubWF4KE1hdGguYWJzKHdzciArIGhjciksIE1hdGguYWJzKHdzciAtIGhjcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3ID0gKHcgKyAweDFmKSA+PiA1IDw8IDU7XG4gICAgfVxuICAgIGlmIChoID4gbWF4aCkgbWF4aCA9IGg7XG4gICAgaWYgKHggKyB3ID49IChjdyA8PCA1KSkge1xuICAgICAgeCA9IDA7XG4gICAgICB5ICs9IG1heGg7XG4gICAgICBtYXhoID0gMDtcbiAgICB9XG4gICAgaWYgKHkgKyBoID49IGNoKSBicmVhaztcbiAgICBjLnRyYW5zbGF0ZSgoeCArICh3ID4+IDEpKSAvIHJhdGlvLCAoeSArIChoID4+IDEpKSAvIHJhdGlvKTtcbiAgICBpZiAoZC5yb3RhdGUpIGMucm90YXRlKGQucm90YXRlICogUkFESUFOUyk7XG4gICAgYy5maWxsVGV4dChkLnRleHQsIGFuY2hvciwgMCk7XG4gICAgaWYgKGQucGFkZGluZykgYy5saW5lV2lkdGggPSAyICogZC5wYWRkaW5nLCBjLnN0cm9rZVRleHQoZC50ZXh0LCBhbmNob3IsIDApO1xuICAgIGMucmVzdG9yZSgpO1xuICAgIGQud2lkdGggPSB3O1xuICAgIGQuaGVpZ2h0ID0gaDtcbiAgICBkLnhvZmYgPSB4O1xuICAgIGQueW9mZiA9IHk7XG4gICAgZC54MSA9IHcgPj4gMTtcbiAgICBkLnkxID0gaCA+PiAxO1xuICAgIGQueDAgPSAtZC54MTtcbiAgICBkLnkwID0gLWQueTE7XG4gICAgZC5oYXNUZXh0ID0gdHJ1ZTtcbiAgICB4ICs9IHc7XG4gIH1cbiAgdmFyIHBpeGVscyA9IGMuZ2V0SW1hZ2VEYXRhKDAsIDAsIChjdyA8PCA1KSAvIHJhdGlvLCBjaCAvIHJhdGlvKS5kYXRhLFxuICAgICAgc3ByaXRlID0gW107XG4gIHdoaWxlICgtLWRpID49IDApIHtcbiAgICBkID0gZGF0YVtkaV07XG4gICAgaWYgKCFkLmhhc1RleHQpIGNvbnRpbnVlO1xuICAgIHZhciB3ID0gZC53aWR0aCxcbiAgICAgICAgdzMyID0gdyA+PiA1LFxuICAgICAgICBoID0gZC55MSAtIGQueTA7XG4gICAgLy8gWmVybyB0aGUgYnVmZmVyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoICogdzMyOyBpKyspIHNwcml0ZVtpXSA9IDA7XG4gICAgeCA9IGQueG9mZjtcbiAgICBpZiAoeCA9PSBudWxsKSByZXR1cm47XG4gICAgeSA9IGQueW9mZjtcbiAgICB2YXIgc2VlbiA9IDAsXG4gICAgICAgIHNlZW5Sb3cgPSAtMTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGg7IGorKykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3OyBpKyspIHtcbiAgICAgICAgdmFyIGsgPSB3MzIgKiBqICsgKGkgPj4gNSksXG4gICAgICAgICAgICBtID0gcGl4ZWxzWygoeSArIGopICogKGN3IDw8IDUpICsgKHggKyBpKSkgPDwgMl0gPyAxIDw8ICgzMSAtIChpICUgMzIpKSA6IDA7XG4gICAgICAgIHNwcml0ZVtrXSB8PSBtO1xuICAgICAgICBzZWVuIHw9IG07XG4gICAgICB9XG4gICAgICBpZiAoc2Vlbikgc2VlblJvdyA9IGo7XG4gICAgICBlbHNlIHtcbiAgICAgICAgZC55MCsrO1xuICAgICAgICBoLS07XG4gICAgICAgIGotLTtcbiAgICAgICAgeSsrO1xuICAgICAgfVxuICAgIH1cbiAgICBkLnkxID0gZC55MCArIHNlZW5Sb3c7XG4gICAgZC5zcHJpdGUgPSBzcHJpdGUuc2xpY2UoMCwgKGQueTEgLSBkLnkwKSAqIHczMik7XG4gIH1cbn1cblxuLy8gVXNlIG1hc2stYmFzZWQgY29sbGlzaW9uIGRldGVjdGlvbi5cbmZ1bmN0aW9uIGNsb3VkQ29sbGlkZSh0YWcsIGJvYXJkLCBzdykge1xuICBzdyA+Pj0gNTtcbiAgdmFyIHNwcml0ZSA9IHRhZy5zcHJpdGUsXG4gICAgICB3ID0gdGFnLndpZHRoID4+IDUsXG4gICAgICBseCA9IHRhZy54IC0gKHcgPDwgNCksXG4gICAgICBzeCA9IGx4ICYgMHg3ZixcbiAgICAgIG1zeCA9IDMyIC0gc3gsXG4gICAgICBoID0gdGFnLnkxIC0gdGFnLnkwLFxuICAgICAgeCA9ICh0YWcueSArIHRhZy55MCkgKiBzdyArIChseCA+PiA1KSxcbiAgICAgIGxhc3Q7XG4gIGZvciAodmFyIGogPSAwOyBqIDwgaDsgaisrKSB7XG4gICAgbGFzdCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gdzsgaSsrKSB7XG4gICAgICBpZiAoKChsYXN0IDw8IG1zeCkgfCAoaSA8IHcgPyAobGFzdCA9IHNwcml0ZVtqICogdyArIGldKSA+Pj4gc3ggOiAwKSlcbiAgICAgICAgICAmIGJvYXJkW3ggKyBpXSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHggKz0gc3c7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjbG91ZEJvdW5kcyhib3VuZHMsIGQpIHtcbiAgdmFyIGIwID0gYm91bmRzWzBdLFxuICAgICAgYjEgPSBib3VuZHNbMV07XG4gIGlmIChkLnggKyBkLngwIDwgYjAueCkgYjAueCA9IGQueCArIGQueDA7XG4gIGlmIChkLnkgKyBkLnkwIDwgYjAueSkgYjAueSA9IGQueSArIGQueTA7XG4gIGlmIChkLnggKyBkLngxID4gYjEueCkgYjEueCA9IGQueCArIGQueDE7XG4gIGlmIChkLnkgKyBkLnkxID4gYjEueSkgYjEueSA9IGQueSArIGQueTE7XG59XG5cbmZ1bmN0aW9uIGNvbGxpZGVSZWN0cyhhLCBiKSB7XG4gIHJldHVybiBhLnggKyBhLngxID4gYlswXS54ICYmIGEueCArIGEueDAgPCBiWzFdLnggJiYgYS55ICsgYS55MSA+IGJbMF0ueSAmJiBhLnkgKyBhLnkwIDwgYlsxXS55O1xufVxuXG5mdW5jdGlvbiBhcmNoaW1lZGVhblNwaXJhbChzaXplKSB7XG4gIHZhciBlID0gc2l6ZVswXSAvIHNpemVbMV07XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIFtlICogKHQgKj0gLjEpICogTWF0aC5jb3ModCksIHQgKiBNYXRoLnNpbih0KV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlY3Rhbmd1bGFyU3BpcmFsKHNpemUpIHtcbiAgdmFyIGR5ID0gNCxcbiAgICAgIGR4ID0gZHkgKiBzaXplWzBdIC8gc2l6ZVsxXSxcbiAgICAgIHggPSAwLFxuICAgICAgeSA9IDA7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgdmFyIHNpZ24gPSB0IDwgMCA/IC0xIDogMTtcbiAgICAvLyBTZWUgdHJpYW5ndWxhciBudW1iZXJzOiBUX24gPSBuICogKG4gKyAxKSAvIDIuXG4gICAgc3dpdGNoICgoTWF0aC5zcXJ0KDEgKyA0ICogc2lnbiAqIHQpIC0gc2lnbikgJiAzKSB7XG4gICAgICBjYXNlIDA6ICB4ICs9IGR4OyBicmVhaztcbiAgICAgIGNhc2UgMTogIHkgKz0gZHk7IGJyZWFrO1xuICAgICAgY2FzZSAyOiAgeCAtPSBkeDsgYnJlYWs7XG4gICAgICBkZWZhdWx0OiB5IC09IGR5OyBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfTtcbn1cblxuLy8gVE9ETyByZXVzZSBhcnJheXM/XG5mdW5jdGlvbiB6ZXJvQXJyYXkobikge1xuICB2YXIgYSA9IFtdLFxuICAgICAgaSA9IC0xO1xuICB3aGlsZSAoKytpIDwgbikgYVtpXSA9IDA7XG4gIHJldHVybiBhO1xufVxuXG5mdW5jdGlvbiBjbG91ZENhbnZhcygpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG59XG5cbmZ1bmN0aW9uIGZ1bmN0b3IoZCkge1xuICByZXR1cm4gdHlwZW9mIGQgPT09IFwiZnVuY3Rpb25cIiA/IGQgOiBmdW5jdGlvbigpIHsgcmV0dXJuIGQ7IH07XG59XG4iLCAiaW1wb3J0IHsgUGx1Z2luIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgcmVnaXN0ZXJDb21tYW5kcyB9IGZyb20gJy4vY29tbWFuZHMvcmVnaXN0ZXInO1xuaW1wb3J0IHsgY3JlYXRlRGVwcyB9IGZyb20gJy4vY3JlYXRlLWRlcHMnO1xuaW1wb3J0IHR5cGUgeyBEZXBzIH0gZnJvbSAnLi9kZXBzJztcbmltcG9ydCB7IHJlZ2lzdGVyRXZlbnRzIH0gZnJvbSAnLi9ldmVudHMvcmVnaXN0ZXInO1xuaW1wb3J0IHsgRGlzcG9zZXIgfSBmcm9tICcuL2xpZmVjeWNsZS9kaXNwb3Nlcic7XG5pbXBvcnQgeyByZWdpc3RlclNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncy9yZWdpc3Rlcic7XG5pbXBvcnQgeyByZWdpc3RlclVJIH0gZnJvbSAnLi91aS9yZWdpc3Rlcic7XG5pbXBvcnQgeyByZWdpc3RlclZpZXdzIH0gZnJvbSAnLi92aWV3cy9yZWdpc3Rlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZhdWx0V29yZENsb3VkUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgcHJpdmF0ZSBkZXBzOiBEZXBzIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcmVhZG9ubHkgZGlzcG9zZXIgPSBuZXcgRGlzcG9zZXIoKTtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRlcHMgPSBhd2FpdCB0aGlzLmluaXRpYWxpemVEZXBlbmRlbmNpZXMoKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJJbnRlZ3JhdGlvblBvaW50cyhkZXBzKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJUZWFyZG93bihkZXBzKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5kaXNwb3Nlci5kaXNwb3NlQWxsKCk7XG4gICAgICB0aGlzLmRlcHMgPSBudWxsO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgb251bmxvYWQoKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwb3Nlci5kaXNwb3NlQWxsKCk7XG4gICAgdGhpcy5kZXBzID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaW5pdGlhbGl6ZURlcGVuZGVuY2llcygpOiBQcm9taXNlPERlcHM+IHtcbiAgICBjb25zdCBkZXBzID0gYXdhaXQgY3JlYXRlRGVwcyh0aGlzKTtcbiAgICB0aGlzLmRlcHMgPSBkZXBzO1xuICAgIHJldHVybiBkZXBzO1xuICB9XG5cbiAgcHJpdmF0ZSByZWdpc3RlckludGVncmF0aW9uUG9pbnRzKGRlcHM6IERlcHMpOiB2b2lkIHtcbiAgICByZWdpc3RlclZpZXdzKHRoaXMsIGRlcHMpO1xuICAgIHJlZ2lzdGVyQ29tbWFuZHModGhpcywgZGVwcyk7XG4gICAgcmVnaXN0ZXJFdmVudHModGhpcywgZGVwcyk7XG4gICAgcmVnaXN0ZXJVSSh0aGlzKTtcbiAgICByZWdpc3RlclNldHRpbmdzKHRoaXMsIGRlcHMpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWdpc3RlclRlYXJkb3duKGRlcHM6IERlcHMpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3Bvc2VyLmFkZChkZXBzLmRpc3Bvc2UpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBCdXR0b25Db21wb25lbnQsIE1vZGFsLCBOb3RpY2UsIFNldHRpbmcgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IFdvcmRDbG91ZFNlcnZpY2VzIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHR5cGUgeyBGcm9udG1hdHRlclJ1bGUsIEZyb250bWF0dGVyT3BlcmF0b3IgfSBmcm9tICcuLi93b3JkY2xvdWQvcGlwZWxpbmUvdHlwZXMnO1xuaW1wb3J0IHsgbm9ybWFsaXplVGFnIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgdHlwZSBFbWJlZFNjb3BlID0gJ2ZpbGUnIHwgJ3ZhdWx0JyB8ICdmb2xkZXInO1xuZXhwb3J0IHR5cGUgRW1iZWRTaXplID0gJ3NtYWxsJyB8ICdtZWRpdW0nIHwgJ2xhcmdlJztcbmV4cG9ydCB0eXBlIEVtYmVkVGFnTWF0Y2hNb2RlID0gJ2FueScgfCAnYWxsJztcbnR5cGUgRW1iZWRTZXR0aW5nc1RhYiA9ICdmaWx0ZXJzJyB8ICdhcHBlYXJhbmNlJyB8ICdhZHZhbmNlZCc7XG5cbmV4cG9ydCB0eXBlIEVtYmVkV2l6YXJkU3RhdGUgPSB7XG4gIGNsb3VkSWQ6IHN0cmluZztcbiAgc2NvcGU6IEVtYmVkU2NvcGU7XG4gIHNpemU6IEVtYmVkU2l6ZTtcbiAgc3BlY2lmaWNGaWxlUGF0aDogc3RyaW5nO1xuICBpbmNsdWRlVGFnc1Jhdzogc3RyaW5nO1xuICBleGNsdWRlVGFnc1Jhdzogc3RyaW5nO1xuICB0YWdNYXRjaE1vZGU6IEVtYmVkVGFnTWF0Y2hNb2RlO1xuICBmb2xkZXJQYXRoc1Jhdzogc3RyaW5nO1xuICBmcm9udG1hdHRlclJ1bGVzUmF3OiBzdHJpbmc7XG4gIG1pbkNvdW50UmF3OiBzdHJpbmc7XG4gIG1heENvdW50UmF3OiBzdHJpbmc7XG59O1xuXG50eXBlIEVtYmVkV29yZENsb3VkTW9kYWxPcHRpb25zID0ge1xuICB0aXRsZT86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHN1Ym1pdEJ1dHRvblRleHQ/OiBzdHJpbmc7XG4gIGluaXRpYWxTdGF0ZT86IFBhcnRpYWw8RW1iZWRXaXphcmRTdGF0ZT47XG59O1xuXG5jb25zdCBERUZBVUxUX1NUQVRFOiBFbWJlZFdpemFyZFN0YXRlID0ge1xuICBjbG91ZElkOiAnJyxcbiAgc2NvcGU6ICdmaWxlJyxcbiAgc2l6ZTogJ21lZGl1bScsXG4gIHNwZWNpZmljRmlsZVBhdGg6ICcnLFxuICBpbmNsdWRlVGFnc1JhdzogJycsXG4gIGV4Y2x1ZGVUYWdzUmF3OiAnJyxcbiAgdGFnTWF0Y2hNb2RlOiAnYW55JyxcbiAgZm9sZGVyUGF0aHNSYXc6ICcnLFxuICBmcm9udG1hdHRlclJ1bGVzUmF3OiAnJyxcbiAgbWluQ291bnRSYXc6ICcnLFxuICBtYXhDb3VudFJhdzogJycsXG59O1xuXG5jb25zdCBGUk9OVE1BVFRFUl9PUEVSQVRPUlM6IEZyb250bWF0dGVyT3BlcmF0b3JbXSA9IFtcbiAgJ2VxdWFscycsXG4gICdub3QtZXF1YWxzJyxcbiAgJ2NvbnRhaW5zJyxcbiAgJ2d0JyxcbiAgJ2d0ZScsXG4gICdsdCcsXG4gICdsdGUnLFxuICAnZXhpc3RzJyxcbiAgJ25vdC1leGlzdHMnLFxuXTtcblxuZXhwb3J0IGNsYXNzIEVtYmVkV29yZENsb3VkTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZXM6IFdvcmRDbG91ZFNlcnZpY2VzO1xuICBwcml2YXRlIHJlYWRvbmx5IG9uSW5zZXJ0OiAoZW1iZWRCbG9jazogc3RyaW5nKSA9PiBib29sZWFuIHwgUHJvbWlzZTxib29sZWFuPjtcbiAgcHJpdmF0ZSByZWFkb25seSBzdGF0ZTogRW1iZWRXaXphcmRTdGF0ZTtcbiAgcHJpdmF0ZSByZWFkb25seSB0aXRsZTogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgc3VibWl0QnV0dG9uVGV4dDogc3RyaW5nO1xuXG4gIHByaXZhdGUgdGFic0VsITogSFRNTERpdkVsZW1lbnQ7XG4gIHByaXZhdGUgZmlsdGVyc1RhYkJ1dHRvbkVsITogSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gIHByaXZhdGUgYXBwZWFyYW5jZVRhYkJ1dHRvbkVsITogSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gIHByaXZhdGUgYWR2YW5jZWRUYWJCdXR0b25FbCE6IEhUTUxCdXR0b25FbGVtZW50O1xuICBwcml2YXRlIGZpbHRlcnNQYW5lbEVsITogSFRNTERpdkVsZW1lbnQ7XG4gIHByaXZhdGUgYXBwZWFyYW5jZVBhbmVsRWwhOiBIVE1MRGl2RWxlbWVudDtcbiAgcHJpdmF0ZSBhZHZhbmNlZFBhbmVsRWwhOiBIVE1MRGl2RWxlbWVudDtcbiAgcHJpdmF0ZSBzY29wZVdyYXBwZXJFbCE6IEhUTUxEaXZFbGVtZW50O1xuICBwcml2YXRlIHNwZWNpZmljRmlsZVdyYXBwZXJFbCE6IEhUTUxEaXZFbGVtZW50O1xuICBwcml2YXRlIHNpemVXcmFwcGVyRWwhOiBIVE1MRGl2RWxlbWVudDtcbiAgcHJpdmF0ZSBpbmNsdWRlVGFnc1dyYXBwZXJFbCE6IEhUTUxEaXZFbGVtZW50O1xuICBwcml2YXRlIG1hdGNoTW9kZVdyYXBwZXJFbCE6IEhUTUxEaXZFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGFwcDogQXBwLFxuICAgIHNlcnZpY2VzOiBXb3JkQ2xvdWRTZXJ2aWNlcyxcbiAgICBvbkluc2VydDogKGVtYmVkQmxvY2s6IHN0cmluZykgPT4gYm9vbGVhbiB8IFByb21pc2U8Ym9vbGVhbj4sXG4gICAgb3B0aW9uczogRW1iZWRXb3JkQ2xvdWRNb2RhbE9wdGlvbnMgPSB7fSxcbiAgKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICB0aGlzLnNlcnZpY2VzID0gc2VydmljZXM7XG4gICAgdGhpcy5vbkluc2VydCA9IG9uSW5zZXJ0O1xuICAgIHRoaXMudGl0bGUgPSBvcHRpb25zLnRpdGxlID8/ICdFbWJlZCB3b3JkIGNsb3VkIGluIGRvY3VtZW50JztcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gb3B0aW9ucy5kZXNjcmlwdGlvbiA/PyAnQ29uZmlndXJlIG9wdGlvbnMsIHRoZW4gaW5zZXJ0IGEgd29yZCBjbG91ZCBlbWJlZCBhdCB5b3VyIGN1cnNvci4nO1xuICAgIHRoaXMuc3VibWl0QnV0dG9uVGV4dCA9IG9wdGlvbnMuc3VibWl0QnV0dG9uVGV4dCA/PyAnQXBwbHknO1xuXG4gICAgY29uc3QgaW5pdGlhbFN0YXRlID0gb3B0aW9ucy5pbml0aWFsU3RhdGUgPz8ge307XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIC4uLkRFRkFVTFRfU1RBVEUsXG4gICAgICAuLi5pbml0aWFsU3RhdGUsXG4gICAgfTtcbiAgICBpZiAoIXRoaXMuc3RhdGUuY2xvdWRJZCkge1xuICAgICAgdGhpcy5zdGF0ZS5jbG91ZElkID0gY3JlYXRlRW1iZWRDbG91ZElkKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXRlLnNjb3BlID09PSAnZm9sZGVyJykge1xuICAgICAgdGhpcy5zdGF0ZS5zY29wZSA9ICd2YXVsdCc7XG4gICAgfVxuICB9XG5cbiAgb25PcGVuKCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIGNvbnRlbnRFbC5lbXB0eSgpO1xuICAgIGNvbnRlbnRFbC5hZGRDbGFzcygnd29yZC1jbG91ZC1lbWJlZC13aXphcmQnKTtcblxuICAgIGNvbnRlbnRFbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6IHRoaXMudGl0bGUgfSk7XG4gICAgY29udGVudEVsLmNyZWF0ZUVsKCdwJywge1xuICAgICAgY2xzOiAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtZGVzY3JpcHRpb24nLFxuICAgICAgdGV4dDogdGhpcy5kZXNjcmlwdGlvbixcbiAgICB9KTtcblxuICAgIHRoaXMuc2NvcGVXcmFwcGVyRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtc2VjdGlvbicgfSk7XG4gICAgdGhpcy5zcGVjaWZpY0ZpbGVXcmFwcGVyRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtc2VjdGlvbicgfSk7XG5cbiAgICBuZXcgU2V0dGluZyh0aGlzLnNjb3BlV3JhcHBlckVsKVxuICAgICAgLnNldE5hbWUoJ1Njb3BlJylcbiAgICAgIC5zZXREZXNjKCdDaG9vc2Ugd2hldGhlciB0aGlzIGNsb3VkIHVzZXMgdGhlIG5vdGUgZmlsZSBvciB0aGUgZW50aXJlIHZhdWx0LicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbignZmlsZScsICdGaWxlJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCd2YXVsdCcsICdWYXVsdCcpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMuc3RhdGUuc2NvcGUgPT09ICdmaWxlJyA/ICdmaWxlJyA6ICd2YXVsdCcpXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zY29wZSA9IHZhbHVlID09PSAnZmlsZScgPyAnZmlsZScgOiAndmF1bHQnO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQ29uZGl0aW9uYWxTZWN0aW9ucygpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBjb25zdCBzZXR0aW5nc1NoZWxsRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtc2V0dGluZ3MnIH0pO1xuXG4gICAgdGhpcy50YWJzRWwgPSBzZXR0aW5nc1NoZWxsRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtdGFicycgfSk7XG4gICAgdGhpcy50YWJzRWwuc2V0QXR0cigncm9sZScsICd0YWJsaXN0Jyk7XG4gICAgdGhpcy50YWJzRWwuc2V0QXR0cignYXJpYS1sYWJlbCcsICdFbWJlZGRlZCB3b3JkIGNsb3VkIHNldHRpbmdzIHRhYnMnKTtcblxuICAgIHRoaXMuZmlsdGVyc1RhYkJ1dHRvbkVsID0gdGhpcy5idWlsZFRhYkJ1dHRvbignZmlsdGVycycsICdGaWx0ZXJzJywgdHJ1ZSk7XG4gICAgdGhpcy5hcHBlYXJhbmNlVGFiQnV0dG9uRWwgPSB0aGlzLmJ1aWxkVGFiQnV0dG9uKCdhcHBlYXJhbmNlJywgJ0FwcGVhcmFuY2UnLCBmYWxzZSk7XG4gICAgdGhpcy5hZHZhbmNlZFRhYkJ1dHRvbkVsID0gdGhpcy5idWlsZFRhYkJ1dHRvbignYWR2YW5jZWQnLCAnQWR2YW5jZWQnLCBmYWxzZSk7XG5cbiAgICBjb25zdCBwYW5lbHNFbCA9IHNldHRpbmdzU2hlbGxFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1wYW5lbHMnIH0pO1xuXG4gICAgdGhpcy5maWx0ZXJzUGFuZWxFbCA9IHBhbmVsc0VsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLXBhbmVsIGlzLWFjdGl2ZScgfSk7XG4gICAgdGhpcy5maWx0ZXJzUGFuZWxFbC5pZCA9ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1wYW5lbC1maWx0ZXJzJztcbiAgICB0aGlzLmZpbHRlcnNQYW5lbEVsLnNldEF0dHIoJ3JvbGUnLCAndGFicGFuZWwnKTtcbiAgICB0aGlzLmZpbHRlcnNQYW5lbEVsLnNldEF0dHIoJ2FyaWEtbGFiZWxsZWRieScsIHRoaXMuZmlsdGVyc1RhYkJ1dHRvbkVsLmlkKTtcblxuICAgIHRoaXMuYXBwZWFyYW5jZVBhbmVsRWwgPSBwYW5lbHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1wYW5lbCcgfSk7XG4gICAgdGhpcy5hcHBlYXJhbmNlUGFuZWxFbC5pZCA9ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1wYW5lbC1hcHBlYXJhbmNlJztcbiAgICB0aGlzLmFwcGVhcmFuY2VQYW5lbEVsLnNldEF0dHIoJ3JvbGUnLCAndGFicGFuZWwnKTtcbiAgICB0aGlzLmFwcGVhcmFuY2VQYW5lbEVsLnNldEF0dHIoJ2FyaWEtbGFiZWxsZWRieScsIHRoaXMuYXBwZWFyYW5jZVRhYkJ1dHRvbkVsLmlkKTtcblxuICAgIHRoaXMuYWR2YW5jZWRQYW5lbEVsID0gcGFuZWxzRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtcGFuZWwnIH0pO1xuICAgIHRoaXMuYWR2YW5jZWRQYW5lbEVsLmlkID0gJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLXBhbmVsLWFkdmFuY2VkJztcbiAgICB0aGlzLmFkdmFuY2VkUGFuZWxFbC5zZXRBdHRyKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG4gICAgdGhpcy5hZHZhbmNlZFBhbmVsRWwuc2V0QXR0cignYXJpYS1sYWJlbGxlZGJ5JywgdGhpcy5hZHZhbmNlZFRhYkJ1dHRvbkVsLmlkKTtcbiAgICB0aGlzLmFkdmFuY2VkUGFuZWxFbC5jcmVhdGVFbCgncCcsIHtcbiAgICAgIGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLWRlc2NyaXB0aW9uJyxcbiAgICAgIHRleHQ6ICdObyBhZGRpdGlvbmFsIGFkdmFuY2VkIHNldHRpbmdzIGFyZSBhdmFpbGFibGUuJyxcbiAgICB9KTtcblxuICAgIHRoaXMuaW5jbHVkZVRhZ3NXcmFwcGVyRWwgPSB0aGlzLmZpbHRlcnNQYW5lbEVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLXNlY3Rpb24nIH0pO1xuICAgIHRoaXMubWF0Y2hNb2RlV3JhcHBlckVsID0gdGhpcy5maWx0ZXJzUGFuZWxFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1zZWN0aW9uJyB9KTtcblxuICAgIHRoaXMuc2l6ZVdyYXBwZXJFbCA9IHRoaXMuYXBwZWFyYW5jZVBhbmVsRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1lbWJlZC13aXphcmQtc2VjdGlvbicgfSk7XG5cbiAgICBuZXcgU2V0dGluZyh0aGlzLnNpemVXcmFwcGVyRWwpXG4gICAgICAuc2V0TmFtZSgnU2l6ZScpXG4gICAgICAuc2V0RGVzYygnU2VsZWN0IHRoZSBlbWJlZGRlZCBjbG91ZCBzaXplIHByZXNldC4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ3NtYWxsJywgJ1NtYWxsJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdtZWRpdW0nLCAnTWVkaXVtJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdsYXJnZScsICdMYXJnZScpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMuc3RhdGUuc2l6ZSlcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNpemUgPSB2YWx1ZSA9PT0gJ3NtYWxsJyB8fCB2YWx1ZSA9PT0gJ2xhcmdlJyA/IHZhbHVlIDogJ21lZGl1bSc7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyU3BlY2lmaWNGaWxlU2V0dGluZygpO1xuICAgIHRoaXMucmVuZGVySW5jbHVkZVRhZ1NldHRpbmcoKTtcbiAgICB0aGlzLnJlbmRlclRhZ01hdGNoTW9kZVNldHRpbmcoKTtcblxuICAgIGNvbnN0IGJ1dHRvblJvd0VsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLWFjdGlvbnMnIH0pO1xuXG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gbmV3IEJ1dHRvbkNvbXBvbmVudChidXR0b25Sb3dFbClcbiAgICAgIC5zZXRCdXR0b25UZXh0KCdDYW5jZWwnKVxuICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgICBjYW5jZWxCdXR0b24uYnV0dG9uRWwudHlwZSA9ICdidXR0b24nO1xuXG4gICAgY29uc3QgYXBwbHlCdXR0b24gPSBuZXcgQnV0dG9uQ29tcG9uZW50KGJ1dHRvblJvd0VsKVxuICAgICAgLnNldEJ1dHRvblRleHQodGhpcy5zdWJtaXRCdXR0b25UZXh0KVxuICAgICAgLnNldEN0YSgpXG4gICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgIGFwcGx5QnV0dG9uLnNldERpc2FibGVkKHRydWUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHdhc0luc2VydGVkID0gYXdhaXQgdGhpcy5vbkluc2VydCh0aGlzLmJ1aWxkRW1iZWRCbG9jaygpKTtcbiAgICAgICAgICBpZiAod2FzSW5zZXJ0ZWQgJiYgdGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignV29yZCBjbG91ZHM6IGZhaWxlZCB0byBhcHBseSBlbWJlZCBjaGFuZ2VzJywgZXJyb3IpO1xuICAgICAgICAgIG5ldyBOb3RpY2UoJ0NvdWxkIG5vdCBhcHBseSB3b3JkIGNsb3VkIGNoYW5nZXMuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFwcGx5QnV0dG9uLmJ1dHRvbkVsLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgICAgYXBwbHlCdXR0b24uc2V0RGlzYWJsZWQoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICBhcHBseUJ1dHRvbi5idXR0b25FbC50eXBlID0gJ2J1dHRvbic7XG5cbiAgICB0aGlzLnJlZnJlc2hDb25kaXRpb25hbFNlY3Rpb25zKCk7XG4gICAgdGhpcy5zd2l0Y2hUYWIoJ2ZpbHRlcnMnKTtcbiAgfVxuXG4gIG9uQ2xvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZW50RWwuZW1wdHkoKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU3BlY2lmaWNGaWxlU2V0dGluZygpOiB2b2lkIHtcbiAgICB0aGlzLnNwZWNpZmljRmlsZVdyYXBwZXJFbC5lbXB0eSgpO1xuXG4gICAgY29uc3QgZmlsZVBhdGhzID0gdGhpcy5hcHAudmF1bHRcbiAgICAgIC5nZXRNYXJrZG93bkZpbGVzKClcbiAgICAgIC5tYXAoKGZpbGUpID0+IGZpbGUucGF0aClcbiAgICAgIC5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICAgIGNvbnN0IGhhc0N1cnJlbnQgPSBmaWxlUGF0aHMuaW5jbHVkZXModGhpcy5zdGF0ZS5zcGVjaWZpY0ZpbGVQYXRoKTtcblxuICAgIG5ldyBTZXR0aW5nKHRoaXMuc3BlY2lmaWNGaWxlV3JhcHBlckVsKVxuICAgICAgLnNldE5hbWUoJ0ZpbGUnKVxuICAgICAgLnNldERlc2MoJ1NlbGVjdCB0aGUgZmlsZSB1c2VkIHdoZW4gc2NvcGUgaXMgc2V0IHRvIGZpbGUuIENob29zZSBDdXJyZW50IG5vdGUgdG8gdXNlIHRoZSBub3RlIGNvbnRhaW5pbmcgdGhpcyBlbWJlZC4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJycsICdDdXJyZW50IG5vdGUnKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlUGF0aCBvZiBmaWxlUGF0aHMpIHtcbiAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oZmlsZVBhdGgsIGZpbGVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5zcGVjaWZpY0ZpbGVQYXRoICYmICFoYXNDdXJyZW50KSB7XG4gICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKHRoaXMuc3RhdGUuc3BlY2lmaWNGaWxlUGF0aCwgdGhpcy5zdGF0ZS5zcGVjaWZpY0ZpbGVQYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMuc3RhdGUuc3BlY2lmaWNGaWxlUGF0aClcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNwZWNpZmljRmlsZVBhdGggPSB2YWx1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJJbmNsdWRlVGFnU2V0dGluZygpOiB2b2lkIHtcbiAgICB0aGlzLmluY2x1ZGVUYWdzV3JhcHBlckVsLmVtcHR5KCk7XG5cbiAgICBjb25zdCBhdmFpbGFibGVUYWdzID0gdGhpcy5zZXJ2aWNlcy5nZXRBdmFpbGFibGVUYWdzKCk7XG4gICAgY29uc3QgdGFnSGludCA9IGF2YWlsYWJsZVRhZ3MubGVuZ3RoID4gMFxuICAgICAgPyBgQXZhaWxhYmxlOiAke2F2YWlsYWJsZVRhZ3Muc2xpY2UoMCwgMTIpLmpvaW4oJywgJyl9JHthdmFpbGFibGVUYWdzLmxlbmd0aCA+IDEyID8gJ1x1MjAyNicgOiAnJ31gXG4gICAgICA6ICdObyB0YWdzIGRldGVjdGVkIHlldC4nO1xuXG4gICAgbmV3IFNldHRpbmcodGhpcy5pbmNsdWRlVGFnc1dyYXBwZXJFbClcbiAgICAgIC5zZXROYW1lKCdJbmNsdWRlIHRhZ3MnKVxuICAgICAgLnNldERlc2MoYE9wdGlvbmFsIGNvbW1hLXNlcGFyYXRlZCB0YWdzIHRvIGluY2x1ZGUuICR7dGFnSGludH1gKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignI3Byb2plY3QsICNtZWV0aW5nJylcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zdGF0ZS5pbmNsdWRlVGFnc1JhdylcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLmluY2x1ZGVUYWdzUmF3ID0gdmFsdWU7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyVGFnTWF0Y2hNb2RlU2V0dGluZygpOiB2b2lkIHtcbiAgICB0aGlzLm1hdGNoTW9kZVdyYXBwZXJFbC5lbXB0eSgpO1xuXG4gICAgbmV3IFNldHRpbmcodGhpcy5tYXRjaE1vZGVXcmFwcGVyRWwpXG4gICAgICAuc2V0TmFtZSgnSW5jbHVkZSBtYXRjaCBtb2RlJylcbiAgICAgIC5zZXREZXNjKCdIb3cgaW5jbHVkZSB0YWdzIHNob3VsZCBtYXRjaCB3aGVuIG11bHRpcGxlIHRhZ3MgYXJlIHNldC4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ2FueScsICdBbnkgaW5jbHVkZSB0YWcnKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ2FsbCcsICdBbGwgaW5jbHVkZSB0YWdzJylcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zdGF0ZS50YWdNYXRjaE1vZGUpXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS50YWdNYXRjaE1vZGUgPSB2YWx1ZSA9PT0gJ2FsbCcgPyAnYWxsJyA6ICdhbnknO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hDb25kaXRpb25hbFNlY3Rpb25zKCk6IHZvaWQge1xuICAgIHRoaXMuc3BlY2lmaWNGaWxlV3JhcHBlckVsLnRvZ2dsZUNsYXNzKCdpcy1oaWRkZW4nLCB0aGlzLnN0YXRlLnNjb3BlICE9PSAnZmlsZScpO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZFRhYkJ1dHRvbih0YWI6IEVtYmVkU2V0dGluZ3NUYWIsIGxhYmVsOiBzdHJpbmcsIGlzQWN0aXZlOiBib29sZWFuKTogSFRNTEJ1dHRvbkVsZW1lbnQge1xuICAgIGNvbnN0IGJ1dHRvbkVsID0gdGhpcy50YWJzRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIGNsczogYHdvcmQtY2xvdWQtZW1iZWQtd2l6YXJkLXRhYiR7aXNBY3RpdmUgPyAnIGlzLWFjdGl2ZScgOiAnJ31gLFxuICAgICAgdGV4dDogbGFiZWwsXG4gICAgfSk7XG4gICAgYnV0dG9uRWwuaWQgPSBgd29yZC1jbG91ZC1lbWJlZC13aXphcmQtdGFiLSR7dGFifWA7XG4gICAgYnV0dG9uRWwudHlwZSA9ICdidXR0b24nO1xuICAgIGJ1dHRvbkVsLnNldEF0dHIoJ3JvbGUnLCAndGFiJyk7XG4gICAgYnV0dG9uRWwuc2V0QXR0cignYXJpYS1jb250cm9scycsIGB3b3JkLWNsb3VkLWVtYmVkLXdpemFyZC1wYW5lbC0ke3RhYn1gKTtcbiAgICBidXR0b25FbC5zZXRBdHRyKCdhcmlhLXNlbGVjdGVkJywgaXNBY3RpdmUgPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgICBidXR0b25FbC5zZXRBdHRyKCd0YWJpbmRleCcsIGlzQWN0aXZlID8gJzAnIDogJy0xJyk7XG4gICAgYnV0dG9uRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLnN3aXRjaFRhYih0YWIpO1xuICAgIH0pO1xuICAgIGJ1dHRvbkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlVGFiS2V5ZG93bihldmVudCwgdGFiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYnV0dG9uRWw7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZVRhYktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQsIGN1cnJlbnRUYWI6IEVtYmVkU2V0dGluZ3NUYWIpOiB2b2lkIHtcbiAgICBjb25zdCB0YWJzOiBFbWJlZFNldHRpbmdzVGFiW10gPSBbJ2ZpbHRlcnMnLCAnYXBwZWFyYW5jZScsICdhZHZhbmNlZCddO1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRhYnMuaW5kZXhPZihjdXJyZW50VGFiKTtcbiAgICBpZiAoY3VycmVudEluZGV4ID09PSAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd1JpZ2h0Jykge1xuICAgICAgY29uc3QgbmV4dFRhYiA9IHRhYnNbKGN1cnJlbnRJbmRleCArIDEpICUgdGFicy5sZW5ndGhdO1xuICAgICAgdGhpcy5zd2l0Y2hUYWIobmV4dFRhYik7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd0xlZnQnKSB7XG4gICAgICBjb25zdCBuZXh0VGFiID0gdGFic1soY3VycmVudEluZGV4IC0gMSArIHRhYnMubGVuZ3RoKSAlIHRhYnMubGVuZ3RoXTtcbiAgICAgIHRoaXMuc3dpdGNoVGFiKG5leHRUYWIpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnSG9tZScpIHtcbiAgICAgIHRoaXMuc3dpdGNoVGFiKHRhYnNbMF0pO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnRW5kJykge1xuICAgICAgdGhpcy5zd2l0Y2hUYWIodGFic1t0YWJzLmxlbmd0aCAtIDFdKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzd2l0Y2hUYWIodGFiOiBFbWJlZFNldHRpbmdzVGFiKTogdm9pZCB7XG4gICAgY29uc3Qgc2hvd0ZpbHRlcnMgPSB0YWIgPT09ICdmaWx0ZXJzJztcbiAgICBjb25zdCBzaG93QXBwZWFyYW5jZSA9IHRhYiA9PT0gJ2FwcGVhcmFuY2UnO1xuICAgIGNvbnN0IHNob3dBZHZhbmNlZCA9IHRhYiA9PT0gJ2FkdmFuY2VkJztcblxuICAgIHRoaXMuZmlsdGVyc1RhYkJ1dHRvbkVsLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnLCBzaG93RmlsdGVycyk7XG4gICAgdGhpcy5maWx0ZXJzVGFiQnV0dG9uRWwuc2V0QXR0cignYXJpYS1zZWxlY3RlZCcsIHNob3dGaWx0ZXJzID8gJ3RydWUnIDogJ2ZhbHNlJyk7XG4gICAgdGhpcy5maWx0ZXJzVGFiQnV0dG9uRWwuc2V0QXR0cigndGFiaW5kZXgnLCBzaG93RmlsdGVycyA/ICcwJyA6ICctMScpO1xuXG4gICAgdGhpcy5hcHBlYXJhbmNlVGFiQnV0dG9uRWwudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScsIHNob3dBcHBlYXJhbmNlKTtcbiAgICB0aGlzLmFwcGVhcmFuY2VUYWJCdXR0b25FbC5zZXRBdHRyKCdhcmlhLXNlbGVjdGVkJywgc2hvd0FwcGVhcmFuY2UgPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgICB0aGlzLmFwcGVhcmFuY2VUYWJCdXR0b25FbC5zZXRBdHRyKCd0YWJpbmRleCcsIHNob3dBcHBlYXJhbmNlID8gJzAnIDogJy0xJyk7XG5cbiAgICB0aGlzLmFkdmFuY2VkVGFiQnV0dG9uRWwudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScsIHNob3dBZHZhbmNlZCk7XG4gICAgdGhpcy5hZHZhbmNlZFRhYkJ1dHRvbkVsLnNldEF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCBzaG93QWR2YW5jZWQgPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgICB0aGlzLmFkdmFuY2VkVGFiQnV0dG9uRWwuc2V0QXR0cigndGFiaW5kZXgnLCBzaG93QWR2YW5jZWQgPyAnMCcgOiAnLTEnKTtcblxuICAgIHRoaXMuZmlsdGVyc1BhbmVsRWwudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScsIHNob3dGaWx0ZXJzKTtcbiAgICB0aGlzLmFwcGVhcmFuY2VQYW5lbEVsLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnLCBzaG93QXBwZWFyYW5jZSk7XG4gICAgdGhpcy5hZHZhbmNlZFBhbmVsRWwudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScsIHNob3dBZHZhbmNlZCk7XG5cbiAgICBjb25zdCB0YXJnZXRCdXR0b24gPSBzaG93RmlsdGVyc1xuICAgICAgPyB0aGlzLmZpbHRlcnNUYWJCdXR0b25FbFxuICAgICAgOiBzaG93QXBwZWFyYW5jZVxuICAgICAgICA/IHRoaXMuYXBwZWFyYW5jZVRhYkJ1dHRvbkVsXG4gICAgICAgIDogdGhpcy5hZHZhbmNlZFRhYkJ1dHRvbkVsO1xuXG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgdGhpcy50YWJzRWwuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgIHRhcmdldEJ1dHRvbi5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRFbWJlZEJsb2NrKCk6IHN0cmluZyB7XG4gICAgY29uc3QgbGluZXMgPSBbJ2BgYHdvcmRjbG91ZCcsIGBpZDogJHt0aGlzLnN0YXRlLmNsb3VkSWR9YCwgYHNjb3BlOiAke3RoaXMuc3RhdGUuc2NvcGV9YCwgYHNpemU6ICR7dGhpcy5zdGF0ZS5zaXplfWBdO1xuICAgIGNvbnN0IGluY2x1ZGVUYWdzID0gcGFyc2VUYWdMaXN0KHRoaXMuc3RhdGUuaW5jbHVkZVRhZ3NSYXcpO1xuICAgIGNvbnN0IGV4Y2x1ZGVUYWdzID0gcGFyc2VUYWdMaXN0KHRoaXMuc3RhdGUuZXhjbHVkZVRhZ3NSYXcpLmZpbHRlcigodGFnKSA9PiAhaW5jbHVkZVRhZ3MuaW5jbHVkZXModGFnKSk7XG4gICAgY29uc3QgZm9sZGVyUGF0aHMgPSBwYXJzZUxpc3QodGhpcy5zdGF0ZS5mb2xkZXJQYXRoc1Jhdyk7XG4gICAgY29uc3QgZnJvbnRtYXR0ZXJSdWxlcyA9IHBhcnNlRnJvbnRtYXR0ZXJSdWxlcyh0aGlzLnN0YXRlLmZyb250bWF0dGVyUnVsZXNSYXcpO1xuICAgIGNvbnN0IG1pbkNvdW50ID0gcGFyc2VDb3VudCh0aGlzLnN0YXRlLm1pbkNvdW50UmF3KTtcbiAgICBjb25zdCBtYXhDb3VudCA9IHBhcnNlQ291bnQodGhpcy5zdGF0ZS5tYXhDb3VudFJhdyk7XG4gICAgY29uc3Qgc3BlY2lmaWNGaWxlUGF0aCA9IHRoaXMuc3RhdGUuc3BlY2lmaWNGaWxlUGF0aC50cmltKCk7XG5cbiAgICBpZiAoc3BlY2lmaWNGaWxlUGF0aCAmJiB0aGlzLnN0YXRlLnNjb3BlID09PSAnZmlsZScpIHtcbiAgICAgIGxpbmVzLnB1c2goYGZpbGU6ICR7c3BlY2lmaWNGaWxlUGF0aH1gKTtcbiAgICB9XG4gICAgaWYgKGluY2x1ZGVUYWdzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxpbmVzLnB1c2goYGluY2x1ZGUtdGFnczogJHtpbmNsdWRlVGFncy5qb2luKCcsICcpfWApO1xuICAgIH1cbiAgICBpZiAoZXhjbHVkZVRhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgbGluZXMucHVzaChgZXhjbHVkZS10YWdzOiAke2V4Y2x1ZGVUYWdzLmpvaW4oJywgJyl9YCk7XG4gICAgfVxuICAgIGlmIChpbmNsdWRlVGFncy5sZW5ndGggPiAxIHx8IHRoaXMuc3RhdGUudGFnTWF0Y2hNb2RlID09PSAnYWxsJykge1xuICAgICAgbGluZXMucHVzaChgdGFnLW1hdGNoOiAke3RoaXMuc3RhdGUudGFnTWF0Y2hNb2RlfWApO1xuICAgIH1cbiAgICBpZiAoZm9sZGVyUGF0aHMubGVuZ3RoID4gMCAmJiB0aGlzLnN0YXRlLnNjb3BlID09PSAnZm9sZGVyJykge1xuICAgICAgbGluZXMucHVzaChgZm9sZGVyLXBhdGhzOiAke2ZvbGRlclBhdGhzLmpvaW4oJywgJyl9YCk7XG4gICAgfVxuICAgIGlmIChmcm9udG1hdHRlclJ1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxpbmVzLnB1c2goYGZyb250bWF0dGVyLXJ1bGVzOiAke2Zyb250bWF0dGVyUnVsZXMubWFwKHNlcmlhbGl6ZUZyb250bWF0dGVyUnVsZSkuam9pbignOyAnKX1gKTtcbiAgICB9XG4gICAgaWYgKG1pbkNvdW50ICE9PSBudWxsKSB7XG4gICAgICBsaW5lcy5wdXNoKGBtaW4tY291bnQ6ICR7bWluQ291bnR9YCk7XG4gICAgfVxuICAgIGlmIChtYXhDb3VudCAhPT0gbnVsbCkge1xuICAgICAgbGluZXMucHVzaChgbWF4LWNvdW50OiAke21heENvdW50fWApO1xuICAgIH1cblxuICAgIGxpbmVzLnB1c2goJ2BgYCcpO1xuXG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlTGlzdChyYXdWYWx1ZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICByZXR1cm4gWy4uLm5ldyBTZXQocmF3VmFsdWVcbiAgICAuc3BsaXQoJywnKVxuICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS50cmltKCkpXG4gICAgLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApKV07XG59XG5cbmZ1bmN0aW9uIHBhcnNlVGFnTGlzdChyYXdWYWx1ZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICBjb25zdCB0YWdzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGZvciAoY29uc3QgZW50cnkgb2YgcGFyc2VMaXN0KHJhd1ZhbHVlKSkge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVUYWcoZW50cnkpO1xuICAgIGlmIChub3JtYWxpemVkKSB7XG4gICAgICB0YWdzLmFkZChub3JtYWxpemVkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFsuLi50YWdzXTtcbn1cblxuZnVuY3Rpb24gcGFyc2VDb3VudChyYXdWYWx1ZTogc3RyaW5nKTogbnVtYmVyIHwgbnVsbCB7XG4gIGNvbnN0IHBhcnNlZCA9IE51bWJlci5wYXJzZUludChyYXdWYWx1ZS50cmltKCksIDEwKTtcbiAgaWYgKE51bWJlci5pc05hTihwYXJzZWQpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIE1hdGgubWluKDk5OTksIE1hdGgubWF4KDEsIHBhcnNlZCkpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUZyb250bWF0dGVyUnVsZXMocmF3VmFsdWU6IHN0cmluZyk6IEZyb250bWF0dGVyUnVsZVtdIHtcbiAgY29uc3QgcnVsZXM6IEZyb250bWF0dGVyUnVsZVtdID0gW107XG4gIGNvbnN0IGVudHJpZXMgPSByYXdWYWx1ZVxuICAgIC5zcGxpdCgnOycpXG4gICAgLm1hcCgoZW50cnkpID0+IGVudHJ5LnRyaW0oKSlcbiAgICAuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkubGVuZ3RoID4gMCk7XG5cbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgcGFydHMgPSBlbnRyeS5zcGxpdCgnfCcpLm1hcCgocGFydCkgPT4gcGFydC50cmltKCkpO1xuICAgIGNvbnN0IGtleSA9IHBhcnRzWzBdID8/ICcnO1xuICAgIGlmICgha2V5KSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCByYXdPcGVyYXRvciA9IHBhcnRzWzFdID8/ICcnO1xuICAgIGNvbnN0IG9wZXJhdG9yID0gRlJPTlRNQVRURVJfT1BFUkFUT1JTLmluY2x1ZGVzKHJhd09wZXJhdG9yIGFzIEZyb250bWF0dGVyT3BlcmF0b3IpXG4gICAgICA/IHJhd09wZXJhdG9yIGFzIEZyb250bWF0dGVyT3BlcmF0b3JcbiAgICAgIDogJ2VxdWFscyc7XG4gICAgY29uc3QgdmFsdWUgPSBwYXJ0cy5zbGljZSgyKS5qb2luKCd8JykudHJpbSgpO1xuXG4gICAgaWYgKG9wZXJhdG9yID09PSAnZXhpc3RzJyB8fCBvcGVyYXRvciA9PT0gJ25vdC1leGlzdHMnKSB7XG4gICAgICBydWxlcy5wdXNoKHsga2V5LCBvcGVyYXRvciB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJ1bGVzLnB1c2goeyBrZXksIG9wZXJhdG9yLCB2YWx1ZSB9KTtcbiAgfVxuXG4gIHJldHVybiBydWxlcztcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplRnJvbnRtYXR0ZXJSdWxlKHJ1bGU6IEZyb250bWF0dGVyUnVsZSk6IHN0cmluZyB7XG4gIGlmIChydWxlLm9wZXJhdG9yID09PSAnZXhpc3RzJyB8fCBydWxlLm9wZXJhdG9yID09PSAnbm90LWV4aXN0cycpIHtcbiAgICByZXR1cm4gYCR7cnVsZS5rZXl9fCR7cnVsZS5vcGVyYXRvcn18YDtcbiAgfVxuICByZXR1cm4gYCR7cnVsZS5rZXl9fCR7cnVsZS5vcGVyYXRvcn18JHtydWxlLnZhbHVlID8/ICcnfWA7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVtYmVkQ2xvdWRJZCgpOiBzdHJpbmcge1xuICBpZiAodHlwZW9mIGNyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNyeXB0by5yYW5kb21VVUlEID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGNyeXB0by5yYW5kb21VVUlEKCk7XG4gIH1cblxuICBjb25zdCByYW5kb21QYXJ0ID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgMTApO1xuICBjb25zdCB0aW1lUGFydCA9IERhdGUubm93KCkudG9TdHJpbmcoMzYpO1xuICByZXR1cm4gYHdjLSR7dGltZVBhcnR9LSR7cmFuZG9tUGFydH1gO1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVUYWcodGFnOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB0cmltbWVkID0gdGFnLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIXRyaW1tZWQpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXR1cm4gdHJpbW1lZC5zdGFydHNXaXRoKCcjJykgPyB0cmltbWVkIDogYCMke3RyaW1tZWR9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUZvclNlYXJjaCh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKTtcbn1cbiIsICJpbXBvcnQgeyBNYXJrZG93blZpZXcsIE5vdGljZSwgdHlwZSBBcHAgfSBmcm9tICdvYnNpZGlhbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRFbWJlZEF0Q3Vyc29yKGFwcDogQXBwLCBlbWJlZEJsb2NrOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHtcbiAgICBuZXcgTm90aWNlKCdPcGVuIGEgbWFya2Rvd24gbm90ZSB0byBpbnNlcnQgYSB3b3JkIGNsb3VkIGVtYmVkLicpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHsgZWRpdG9yIH0gPSB2aWV3O1xuICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKCk7XG4gIGNvbnN0IGN1cnJlbnRMaW5lID0gZWRpdG9yLmdldExpbmUoY3Vyc29yLmxpbmUpO1xuXG4gIGNvbnN0IGhhc1RleHRCZWZvcmVDdXJzb3IgPSBjdXJyZW50TGluZS5zbGljZSgwLCBjdXJzb3IuY2gpLnRyaW0oKS5sZW5ndGggPiAwO1xuICBjb25zdCBoYXNUZXh0QWZ0ZXJDdXJzb3IgPSBjdXJyZW50TGluZS5zbGljZShjdXJzb3IuY2gpLnRyaW0oKS5sZW5ndGggPiAwO1xuXG4gIGNvbnN0IHByZWZpeCA9IGhhc1RleHRCZWZvcmVDdXJzb3IgPyAnXFxuJyA6ICcnO1xuICBjb25zdCBzdWZmaXggPSBoYXNUZXh0QWZ0ZXJDdXJzb3IgPyAnXFxuJyA6ICcnO1xuICBjb25zdCB0ZXh0VG9JbnNlcnQgPSBgJHtwcmVmaXh9JHtlbWJlZEJsb2NrfSR7c3VmZml4fWA7XG5cbiAgZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24odGV4dFRvSW5zZXJ0KTtcbiAgcmV0dXJuIHRydWU7XG59XG4iLCAiZXhwb3J0IGNvbnN0IFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VEID0gJ3ZhdWx0LXdvcmQtY2xvdWQtdmlldyc7XG5leHBvcnQgY29uc3QgVklFV19UWVBFX05PVEVfV09SRF9DTE9VRCA9ICdub3RlLXdvcmQtY2xvdWQtdmlldyc7XG5leHBvcnQgY29uc3QgTUFYX1dPUkRTID0gMTQwO1xuZXhwb3J0IGNvbnN0IE1JTl9XT1JEX0xFTkdUSCA9IDM7XG5leHBvcnQgY29uc3QgRlJPTlRNQVRURVJfUEFUVEVSTiA9IC9eLS0tXFxzKlxcbltcXHNcXFNdKj9cXG4tLS1cXHMqKD86XFxufCQpLztcbmV4cG9ydCBjb25zdCBXT1JEX0NMT1VEX0JMT0NLX1BBVFRFUk4gPSAvYGBgKD86d29yZGNsb3VkfHdvcmQtY2xvdWQpXFxzKlxcbltcXHNcXFNdKj9cXG5gYGAvZ2k7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NUT1BfV09SRFM6IHN0cmluZ1tdID0gW1xuICAndGhlJywgJ2FuZCcsICdmb3InLCAndGhhdCcsICd0aGlzJywgJ3dpdGgnLCAnZnJvbScsICdhcmUnLCAnd2FzJywgJ3dlcmUnLCAnaGF2ZScsICdoYXMnLCAnaGFkJyxcbiAgJ3lvdScsICd5b3VyJywgJ3RoZXknLCAndGhlbScsICd0aGVpcicsICdpdHMnLCAnb3VyJywgJ291cnMnLCAnaGlzJywgJ2hlcicsICdzaGUnLCAnaGltJywgJ25vdCcsXG4gICdidXQnLCAnY2FuJywgJ3dpbGwnLCAnYWxsJywgJ2FueScsICdvbmUnLCAndHdvJywgJ3RvbycsICd1c2UnLCAndXNpbmcnLCAnaW50bycsICdvdXQnLCAnYWJvdXQnLFxuICAndGhlcmUnLCAndGhlbicsICd0aGFuJywgJ3doZW4nLCAnd2hhdCcsICd3aGVyZScsICd3aGljaCcsICd3aG8nLCAnd2hvbScsICdob3cnLCAnd2h5JywgJ2Fsc28nLFxuICAnanVzdCcsICdsaWtlJywgJ3NvbWUnLCAnbW9yZScsICdtb3N0JywgJ211Y2gnLCAnbWFueScsICd2ZXJ5JywgJ2VhY2gnLCAnb3RoZXInLCAnc3VjaCcsICdvbmx5JyxcbiAgJ25vdGUnLCAnbm90ZXMnLCAndG9kbycsICdkb25lJywgJ251bGwnLCAndHJ1ZScsICdmYWxzZScsICdodHRwJywgJ2h0dHBzJywgJ3d3dycsICdjb20nXG5dO1xuIiwgImltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgVklFV19UWVBFX05PVEVfV09SRF9DTE9VRCwgVklFV19UWVBFX1ZBVUxUX1dPUkRfQ0xPVUQgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWN0aXZhdGVWYXVsdFdvcmRDbG91ZFZpZXcoYXBwOiBBcHApOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IGFwcDtcbiAgY29uc3QgZXhpc3RpbmdMZWFmID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEVfVkFVTFRfV09SRF9DTE9VRClbMF07XG4gIGNvbnN0IGxlYWYgPSBleGlzdGluZ0xlYWYgPz8gd29ya3NwYWNlLmdldExlYWYodHJ1ZSk7XG5cbiAgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoe1xuICAgIHR5cGU6IFZJRVdfVFlQRV9WQVVMVF9XT1JEX0NMT1VELFxuICAgIGFjdGl2ZTogdHJ1ZSxcbiAgfSk7XG5cbiAgd29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhY3RpdmF0ZU5vdGVXb3JkQ2xvdWRWaWV3KGFwcDogQXBwKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHsgd29ya3NwYWNlIH0gPSBhcHA7XG4gIGNvbnN0IGV4aXN0aW5nTGVhZiA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoVklFV19UWVBFX05PVEVfV09SRF9DTE9VRClbMF07XG4gIGNvbnN0IGxlYWYgPSBleGlzdGluZ0xlYWYgPz8gd29ya3NwYWNlLmdldFJpZ2h0TGVhZihmYWxzZSk7XG4gIGlmICghbGVhZikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHtcbiAgICB0eXBlOiBWSUVXX1RZUEVfTk9URV9XT1JEX0NMT1VELFxuICAgIGFjdGl2ZTogdHJ1ZSxcbiAgfSk7XG5cbiAgd29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IERlcHMgfSBmcm9tICcuLi9kZXBzJztcbmltcG9ydCB7IEVtYmVkV29yZENsb3VkTW9kYWwgfSBmcm9tICcuLi9tb2RhbHMvZWRpdC13b3JkLWNsb3VkLW1vZGFsJztcbmltcG9ydCB7IGluc2VydEVtYmVkQXRDdXJzb3IgfSBmcm9tICcuLi9zZXJ2aWNlcy9lZGl0b3ItaW5zZXJ0aW9uJztcbmltcG9ydCB7IGFjdGl2YXRlTm90ZVdvcmRDbG91ZFZpZXcsIGFjdGl2YXRlVmF1bHRXb3JkQ2xvdWRWaWV3IH0gZnJvbSAnLi4vdmlld3MvYWN0aXZhdGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21tYW5kcyhwbHVnaW46IFBsdWdpbiwgZGVwczogRGVwcyk6IHZvaWQge1xuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6ICdvcGVuLXZhdWx0LXdvcmQtY2xvdWQtdmlldycsXG4gICAgbmFtZTogJ09wZW4gdmF1bHQgd29yZCBjbG91ZCcsXG4gICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgIHZvaWQgYWN0aXZhdGVWYXVsdFdvcmRDbG91ZFZpZXcocGx1Z2luLmFwcCk7XG4gICAgfSxcbiAgfSk7XG5cbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiAnb3Blbi1ub3RlLXdvcmQtY2xvdWQtc2lkZWJhcicsXG4gICAgbmFtZTogJ09wZW4gY3VycmVudCBub3RlIHdvcmQgY2xvdWQnLFxuICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICB2b2lkIGFjdGl2YXRlTm90ZVdvcmRDbG91ZFZpZXcocGx1Z2luLmFwcCk7XG4gICAgfSxcbiAgfSk7XG5cbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiAnZW1iZWQtd29yZC1jbG91ZC1pbi1kb2N1bWVudCcsXG4gICAgbmFtZTogJ0VtYmVkIHdvcmQgY2xvdWQgaW4gZG9jdW1lbnQnLFxuICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICBuZXcgRW1iZWRXb3JkQ2xvdWRNb2RhbChcbiAgICAgICAgcGx1Z2luLmFwcCxcbiAgICAgICAgZGVwcy5zZXJ2aWNlcy53b3JkQ2xvdWQsXG4gICAgICAgIChlbWJlZEJsb2NrKSA9PiBpbnNlcnRFbWJlZEF0Q3Vyc29yKHBsdWdpbi5hcHAsIGVtYmVkQmxvY2spLFxuICAgICAgKS5vcGVuKCk7XG4gICAgfSxcbiAgfSk7XG59XG4iLCAiZXhwb3J0IGNsYXNzIEV2ZW50Q29vcmRpbmF0b3Ige1xuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIC8vIFJlc2VydmVkIGZvciBkZWJvdW5jZWQvYmF0Y2hlZCBvcmNoZXN0cmF0aW9uIHBvbGljaWVzLlxuICB9XG59XG4iLCAiaW1wb3J0IHsgTWFya2Rvd25WaWV3LCB0eXBlIEFwcCwgVEZpbGUsIFRGb2xkZXIgfSBmcm9tICdvYnNpZGlhbic7XG5cbmV4cG9ydCBjbGFzcyBPYnNpZGlhbkFkYXB0ZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFwcDogQXBwKSB7fVxuXG4gIGdldEF2YWlsYWJsZUZvbGRlcnMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmFwcC52YXVsdFxuICAgICAgLmdldEFsbExvYWRlZEZpbGVzKClcbiAgICAgIC5maWx0ZXIoKGZpbGUpOiBmaWxlIGlzIFRGb2xkZXIgPT4gZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpXG4gICAgICAubWFwKChmb2xkZXIpID0+IGZvbGRlci5wYXRoKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG4gIH1cblxuICBnZXRPcGVuTWFya2Rvd25GaWxlcygpOiBURmlsZVtdIHtcbiAgICBjb25zdCBmaWxlcyA9IG5ldyBNYXA8c3RyaW5nLCBURmlsZT4oKTtcblxuICAgIGZvciAoY29uc3QgbGVhZiBvZiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKCdtYXJrZG93bicpKSB7XG4gICAgICBjb25zdCB2aWV3ID0gbGVhZi52aWV3O1xuICAgICAgaWYgKHZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXcgJiYgdmlldy5maWxlKSB7XG4gICAgICAgIGZpbGVzLnNldCh2aWV3LmZpbGUucGF0aCwgdmlldy5maWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBhY3RpdmVGaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoYWN0aXZlRmlsZSkge1xuICAgICAgZmlsZXMuc2V0KGFjdGl2ZUZpbGUucGF0aCwgYWN0aXZlRmlsZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFsuLi5maWxlcy52YWx1ZXMoKV0uc29ydCgoYSwgYikgPT4gYS5wYXRoLmxvY2FsZUNvbXBhcmUoYi5wYXRoKSk7XG4gIH1cblxuICBnZXRBY3RpdmVGaWxlKCk6IFRGaWxlIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gIH1cblxuICBnZXRNYXJrZG93bkZpbGVzKCk6IFRGaWxlW10ge1xuICAgIHJldHVybiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XG4gIH1cbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gbWlncmF0ZVNldHRpbmdzRGF0YShyYXc6IHVua25vd24pOiB1bmtub3duIHtcbiAgLy8gUGxhY2Vob2xkZXIgZm9yIHNjaGVtYSBtaWdyYXRpb25zIHdoZW4gc2V0dGluZ3Mgc3RydWN0dXJlIGNoYW5nZXMuXG4gIHJldHVybiByYXc7XG59XG4iLCAiaW1wb3J0IHsgREVGQVVMVF9TVE9QX1dPUkRTIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFdvcmRDbG91ZEZpbHRlclNldHRpbmdzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmRDbG91ZFNldHRpbmdzIHtcbiAgYmxhY2tsaXN0V29yZHM6IHN0cmluZ1tdO1xuICByZW5kZXI6IFJlbmRlclNldHRpbmdzO1xuICBmaWx0ZXJzOiBXb3JkQ2xvdWRGaWx0ZXJTZXR0aW5ncztcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFdvcmRDbG91ZFNldHRpbmdzID0ge1xuICBibGFja2xpc3RXb3JkczogWy4uLkRFRkFVTFRfU1RPUF9XT1JEU10sXG4gIHJlbmRlcjoge1xuICAgIHJvdGF0aW9uUHJlc2V0OiAnbW9zdGx5LWhvcml6b250YWwnLFxuICAgIHNwaXJhbDogJ2FyY2hpbWVkZWFuJyxcbiAgICB3b3JkUGFkZGluZzogMixcbiAgICBtaW5Gb250U2l6ZTogMTQsXG4gICAgbWF4Rm9udFNpemU6IDcyLFxuICAgIGZvbnRGYW1pbHk6ICdzYW5zLXNlcmlmJyxcbiAgICBzY2FsaW5nTW9kZTogJ3Bvd2VyJyxcbiAgICBlbXBoYXNpczogMSxcbiAgICBzaG93Q291bnRJbldvcmRUZXh0OiBmYWxzZSxcbiAgICB3b3JkVGV4dE1ldHJpYzogJ2NvdW50JyxcbiAgICBzaG93V29yZFRleHRNZXRyaWNUb2dnbGU6IGZhbHNlLFxuICAgIGNvdW50TGFiZWxGb3JtYXQ6ICdwYXJlbicsXG4gICAgY291bnRMYWJlbE1pbkNvdW50OiAxLFxuICAgIHByb2dyZXNzRGV0YWlsOiAnYmFsYW5jZWQnLFxuICAgIHNjYW5CYXRjaFNpemU6IDI0LFxuICAgIGxheW91dFRpbWVJbnRlcnZhbE1zOiAxNixcbiAgICBkZXRlcm1pbmlzdGljTGF5b3V0OiBmYWxzZSxcbiAgICByYW5kb21TZWVkOiA0MixcbiAgfSxcbiAgZmlsdGVyczoge1xuICAgIHNjb3BlOiB7XG4gICAgICBtb2RlOiAndmF1bHQnLFxuICAgICAgYWN0aXZlRmlsZVBhdGg6ICcnLFxuICAgICAgZm9sZGVyUGF0aHM6IFtdLFxuICAgIH0sXG4gICAgaW5jbHVkZVRhZ3M6IFtdLFxuICAgIGV4Y2x1ZGVUYWdzOiBbXSxcbiAgICB0YWdNYXRjaE1vZGU6ICdhbnknLFxuICAgIGZyb250bWF0dGVyUnVsZXM6IFtdLFxuICAgIGZyZXF1ZW5jeToge1xuICAgICAgbWluQ291bnQ6IDEsXG4gICAgICBtYXhDb3VudDogOTk5OSxcbiAgICB9LFxuICB9LFxufTtcbiIsICJpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHtcbiAgUmVuZGVyU2V0dGluZ3MsXG4gIFRhZ01hdGNoTW9kZSxcbiAgV29yZENsb3VkRmlsdGVyU2V0dGluZ3MsXG59IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgRnJvbnRtYXR0ZXJSdWxlLCBTb3VyY2VTY29wZSB9IGZyb20gJy4uL3dvcmRjbG91ZC9waXBlbGluZS90eXBlcyc7XG5pbXBvcnQgeyBub3JtYWxpemVUYWcgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBtaWdyYXRlU2V0dGluZ3NEYXRhIH0gZnJvbSAnLi9taWdyYXRpb25zJztcbmltcG9ydCB7IERFRkFVTFRfU0VUVElOR1MsIHR5cGUgV29yZENsb3VkU2V0dGluZ3MgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IHR5cGUgU2V0dGluZ3NDaGFuZ2VMaXN0ZW5lciA9IChzZXR0aW5nczogUmVhZG9ubHk8V29yZENsb3VkU2V0dGluZ3M+KSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBzZXR0aW5nczogV29yZENsb3VkU2V0dGluZ3MgPSBjbG9uZVNldHRpbmdzKERFRkFVTFRfU0VUVElOR1MpO1xuICBwcml2YXRlIHJlYWRvbmx5IGxpc3RlbmVycyA9IG5ldyBTZXQ8U2V0dGluZ3NDaGFuZ2VMaXN0ZW5lcj4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHBsdWdpbjogUGx1Z2luKSB7fVxuXG4gIGFzeW5jIGxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbG9hZGVkID0gYXdhaXQgdGhpcy5wbHVnaW4ubG9hZERhdGEoKTtcbiAgICBjb25zdCBtaWdyYXRlZCA9IG1pZ3JhdGVTZXR0aW5nc0RhdGEobG9hZGVkKTtcbiAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgYmxhY2tsaXN0V29yZHM6IHRoaXMubm9ybWFsaXplQmxhY2tsaXN0V29yZHMoKG1pZ3JhdGVkIGFzIHsgYmxhY2tsaXN0V29yZHM/OiB1bmtub3duIH0gfCBudWxsKT8uYmxhY2tsaXN0V29yZHMpLFxuICAgICAgcmVuZGVyOiB0aGlzLm5vcm1hbGl6ZVJlbmRlclNldHRpbmdzKChtaWdyYXRlZCBhcyB7IHJlbmRlcj86IHVua25vd24gfSB8IG51bGwpPy5yZW5kZXIpLFxuICAgICAgZmlsdGVyczogdGhpcy5ub3JtYWxpemVGaWx0ZXJTZXR0aW5ncygobWlncmF0ZWQgYXMgeyBmaWx0ZXJzPzogdW5rbm93biB9IHwgbnVsbCk/LmZpbHRlcnMpLFxuICAgIH07XG4gIH1cblxuICBnZXRTbmFwc2hvdCgpOiBSZWFkb25seTxXb3JkQ2xvdWRTZXR0aW5ncz4ge1xuICAgIHJldHVybiBjbG9uZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICB9XG5cbiAgb25DaGFuZ2UoY2FsbGJhY2s6IFNldHRpbmdzQ2hhbmdlTGlzdGVuZXIpOiAoKSA9PiB2b2lkIHtcbiAgICB0aGlzLmxpc3RlbmVycy5hZGQoY2FsbGJhY2spO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLmxpc3RlbmVycy5kZWxldGUoY2FsbGJhY2spO1xuICAgIH07XG4gIH1cblxuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIHRoaXMubGlzdGVuZXJzLmNsZWFyKCk7XG4gIH1cblxuICBnZXRCbGFja2xpc3RTZXQoKTogU2V0PHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgU2V0KHRoaXMuc2V0dGluZ3MuYmxhY2tsaXN0V29yZHMubWFwKCh3b3JkKSA9PiB0aGlzLm5vcm1hbGl6ZUJsYWNrbGlzdFdvcmQod29yZCkpLmZpbHRlcihCb29sZWFuKSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVGaWx0ZXJzKHBhdGNoOiBQYXJ0aWFsPFdvcmRDbG91ZEZpbHRlclNldHRpbmdzPik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG1lcmdlZDogV29yZENsb3VkRmlsdGVyU2V0dGluZ3MgPSB7XG4gICAgICAuLi50aGlzLnNldHRpbmdzLmZpbHRlcnMsXG4gICAgICAuLi5wYXRjaCxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIC4uLnRoaXMuc2V0dGluZ3MuZmlsdGVycy5zY29wZSxcbiAgICAgICAgLi4ucGF0Y2guc2NvcGUsXG4gICAgICB9LFxuICAgICAgZnJlcXVlbmN5OiB7XG4gICAgICAgIC4uLnRoaXMuc2V0dGluZ3MuZmlsdGVycy5mcmVxdWVuY3ksXG4gICAgICAgIC4uLnBhdGNoLmZyZXF1ZW5jeSxcbiAgICAgIH0sXG4gICAgICBpbmNsdWRlVGFnczogcGF0Y2guaW5jbHVkZVRhZ3MgPz8gdGhpcy5zZXR0aW5ncy5maWx0ZXJzLmluY2x1ZGVUYWdzLFxuICAgICAgZXhjbHVkZVRhZ3M6IHBhdGNoLmV4Y2x1ZGVUYWdzID8/IHRoaXMuc2V0dGluZ3MuZmlsdGVycy5leGNsdWRlVGFncyxcbiAgICAgIGZyb250bWF0dGVyUnVsZXM6IHBhdGNoLmZyb250bWF0dGVyUnVsZXMgPz8gdGhpcy5zZXR0aW5ncy5maWx0ZXJzLmZyb250bWF0dGVyUnVsZXMsXG4gICAgfTtcblxuICAgIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICAuLi50aGlzLnNldHRpbmdzLFxuICAgICAgZmlsdGVyczogdGhpcy5ub3JtYWxpemVGaWx0ZXJTZXR0aW5ncyhtZXJnZWQpLFxuICAgIH07XG4gICAgYXdhaXQgdGhpcy5wZXJzaXN0KCk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVSZW5kZXJTZXR0aW5ncyhwYXRjaDogUGFydGlhbDxSZW5kZXJTZXR0aW5ncz4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBtZXJnZWQgPSB7XG4gICAgICAuLi50aGlzLnNldHRpbmdzLnJlbmRlcixcbiAgICAgIC4uLnBhdGNoLFxuICAgIH07XG5cbiAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgLi4udGhpcy5zZXR0aW5ncyxcbiAgICAgIHJlbmRlcjogdGhpcy5ub3JtYWxpemVSZW5kZXJTZXR0aW5ncyhtZXJnZWQpLFxuICAgIH07XG4gICAgYXdhaXQgdGhpcy5wZXJzaXN0KCk7XG4gIH1cblxuICBhc3luYyByZXNldFJlbmRlclNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICAuLi50aGlzLnNldHRpbmdzLFxuICAgICAgcmVuZGVyOiB7IC4uLkRFRkFVTFRfU0VUVElOR1MucmVuZGVyIH0sXG4gICAgfTtcbiAgICBhd2FpdCB0aGlzLnBlcnNpc3QoKTtcbiAgfVxuXG4gIGFzeW5jIGFkZEJsYWNrbGlzdFdvcmQocmF3V29yZDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3Qgbm9ybWFsaXplZFdvcmQgPSB0aGlzLm5vcm1hbGl6ZUJsYWNrbGlzdFdvcmQocmF3V29yZCk7XG4gICAgaWYgKCFub3JtYWxpemVkV29yZCB8fCB0aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzLmluY2x1ZGVzKG5vcm1hbGl6ZWRXb3JkKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICAuLi50aGlzLnNldHRpbmdzLFxuICAgICAgYmxhY2tsaXN0V29yZHM6IFsuLi50aGlzLnNldHRpbmdzLmJsYWNrbGlzdFdvcmRzLCBub3JtYWxpemVkV29yZF0sXG4gICAgfTtcbiAgICBhd2FpdCB0aGlzLnBlcnNpc3QoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIHJlbW92ZUJsYWNrbGlzdFdvcmQocmF3V29yZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgbm9ybWFsaXplZFdvcmQgPSB0aGlzLm5vcm1hbGl6ZUJsYWNrbGlzdFdvcmQocmF3V29yZCk7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHtcbiAgICAgIC4uLnRoaXMuc2V0dGluZ3MsXG4gICAgICBibGFja2xpc3RXb3JkczogdGhpcy5zZXR0aW5ncy5ibGFja2xpc3RXb3Jkcy5maWx0ZXIoKHdvcmQpID0+IHdvcmQgIT09IG5vcm1hbGl6ZWRXb3JkKSxcbiAgICB9O1xuICAgIGF3YWl0IHRoaXMucGVyc2lzdCgpO1xuICB9XG5cbiAgYXN5bmMgcmVzZXRCbGFja2xpc3RXb3JkcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgLi4udGhpcy5zZXR0aW5ncyxcbiAgICAgIGJsYWNrbGlzdFdvcmRzOiBbLi4uREVGQVVMVF9TRVRUSU5HUy5ibGFja2xpc3RXb3Jkc10sXG4gICAgfTtcbiAgICBhd2FpdCB0aGlzLnBlcnNpc3QoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcGVyc2lzdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdENoYW5nZSgpOiB2b2lkIHtcbiAgICBjb25zdCBzbmFwc2hvdCA9IHRoaXMuZ2V0U25hcHNob3QoKTtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICBsaXN0ZW5lcihzbmFwc2hvdCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBub3JtYWxpemVCbGFja2xpc3RXb3JkcyhyYXdWYWx1ZTogdW5rbm93bik6IHN0cmluZ1tdIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocmF3VmFsdWUpKSB7XG4gICAgICByZXR1cm4gWy4uLkRFRkFVTFRfU0VUVElOR1MuYmxhY2tsaXN0V29yZHNdO1xuICAgIH1cblxuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJhd1ZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnc3RyaW5nJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB0aGlzLm5vcm1hbGl6ZUJsYWNrbGlzdFdvcmQoZW50cnkpO1xuICAgICAgaWYgKG5vcm1hbGl6ZWQpIHtcbiAgICAgICAgc2Vlbi5hZGQobm9ybWFsaXplZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZW4uc2l6ZSA+IDAgPyBbLi4uc2Vlbl0gOiBbLi4uREVGQVVMVF9TRVRUSU5HUy5ibGFja2xpc3RXb3Jkc107XG4gIH1cblxuICBwcml2YXRlIG5vcm1hbGl6ZUJsYWNrbGlzdFdvcmQod29yZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gd29yZC50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgbm9ybWFsaXplRmlsdGVyU2V0dGluZ3MocmF3VmFsdWU6IHVua25vd24pOiBXb3JkQ2xvdWRGaWx0ZXJTZXR0aW5ncyB7XG4gICAgY29uc3QgcmF3ID0gKHJhd1ZhbHVlICYmIHR5cGVvZiByYXdWYWx1ZSA9PT0gJ29iamVjdCcpID8gcmF3VmFsdWUgYXMgUGFydGlhbDxXb3JkQ2xvdWRGaWx0ZXJTZXR0aW5ncz4gOiB7fTtcblxuICAgIGNvbnN0IHNjb3BlID0gdGhpcy5ub3JtYWxpemVTY29wZShyYXcuc2NvcGUpO1xuICAgIGNvbnN0IGluY2x1ZGVUYWdzID0gbm9ybWFsaXplVGFnTGlzdChyYXcuaW5jbHVkZVRhZ3MpO1xuICAgIGNvbnN0IGV4Y2x1ZGVUYWdzID0gbm9ybWFsaXplVGFnTGlzdChyYXcuZXhjbHVkZVRhZ3MpLmZpbHRlcigodGFnKSA9PiAhaW5jbHVkZVRhZ3MuaW5jbHVkZXModGFnKSk7XG4gICAgY29uc3QgdGFnTWF0Y2hNb2RlOiBUYWdNYXRjaE1vZGUgPSByYXcudGFnTWF0Y2hNb2RlID09PSAnYWxsJyA/ICdhbGwnIDogJ2FueSc7XG4gICAgY29uc3QgZnJvbnRtYXR0ZXJSdWxlcyA9IG5vcm1hbGl6ZUZyb250bWF0dGVyUnVsZXMocmF3LmZyb250bWF0dGVyUnVsZXMpO1xuICAgIGNvbnN0IG1pbkNvdW50ID0gdGhpcy5jbGFtcE51bWJlcihyYXcuZnJlcXVlbmN5Py5taW5Db3VudCwgMSwgOTk5OSwgREVGQVVMVF9TRVRUSU5HUy5maWx0ZXJzLmZyZXF1ZW5jeS5taW5Db3VudCk7XG4gICAgY29uc3QgbWF4Q291bnQgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy5mcmVxdWVuY3k/Lm1heENvdW50LCAxLCA5OTk5LCBERUZBVUxUX1NFVFRJTkdTLmZpbHRlcnMuZnJlcXVlbmN5Lm1heENvdW50KTtcblxuICAgIHJldHVybiB7XG4gICAgICBzY29wZSxcbiAgICAgIGluY2x1ZGVUYWdzLFxuICAgICAgZXhjbHVkZVRhZ3MsXG4gICAgICB0YWdNYXRjaE1vZGUsXG4gICAgICBmcm9udG1hdHRlclJ1bGVzLFxuICAgICAgZnJlcXVlbmN5OiB7XG4gICAgICAgIG1pbkNvdW50OiBNYXRoLm1pbihtaW5Db3VudCwgbWF4Q291bnQpLFxuICAgICAgICBtYXhDb3VudDogTWF0aC5tYXgobWluQ291bnQsIG1heENvdW50KSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgbm9ybWFsaXplU2NvcGUocmF3VmFsdWU6IHVua25vd24pOiBTb3VyY2VTY29wZSB7XG4gICAgY29uc3QgcmF3ID0gKHJhd1ZhbHVlICYmIHR5cGVvZiByYXdWYWx1ZSA9PT0gJ29iamVjdCcpID8gcmF3VmFsdWUgYXMgUGFydGlhbDxTb3VyY2VTY29wZT4gOiB7fTtcbiAgICBjb25zdCBtb2RlID0gcmF3Lm1vZGUgPT09ICdhY3RpdmUtZmlsZScgfHwgcmF3Lm1vZGUgPT09ICdmb2xkZXInIHx8IHJhdy5tb2RlID09PSAndmF1bHQnXG4gICAgICA/IHJhdy5tb2RlXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MuZmlsdGVycy5zY29wZS5tb2RlO1xuXG4gICAgY29uc3QgYWN0aXZlRmlsZVBhdGggPSB0eXBlb2YgcmF3LmFjdGl2ZUZpbGVQYXRoID09PSAnc3RyaW5nJyA/IHJhdy5hY3RpdmVGaWxlUGF0aC50cmltKCkgOiAnJztcbiAgICBjb25zdCBmb2xkZXJQYXRocyA9IEFycmF5LmlzQXJyYXkocmF3LmZvbGRlclBhdGhzKVxuICAgICAgPyBbLi4ubmV3IFNldChyYXcuZm9sZGVyUGF0aHNcbiAgICAgICAgLmZpbHRlcigocGF0aCk6IHBhdGggaXMgc3RyaW5nID0+IHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJylcbiAgICAgICAgLm1hcCgocGF0aCkgPT4gcGF0aC50cmltKCkpXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbikpXVxuICAgICAgOiBbXTtcblxuICAgIHJldHVybiB7XG4gICAgICBtb2RlLFxuICAgICAgYWN0aXZlRmlsZVBhdGgsXG4gICAgICBmb2xkZXJQYXRocyxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBub3JtYWxpemVSZW5kZXJTZXR0aW5ncyhyYXdWYWx1ZTogdW5rbm93bik6IFJlbmRlclNldHRpbmdzIHtcbiAgICBjb25zdCByYXcgPSAocmF3VmFsdWUgJiYgdHlwZW9mIHJhd1ZhbHVlID09PSAnb2JqZWN0JykgPyByYXdWYWx1ZSBhcyBQYXJ0aWFsPFJlbmRlclNldHRpbmdzPiA6IHt9O1xuXG4gICAgY29uc3Qgcm90YXRpb25QcmVzZXQgPSByYXcucm90YXRpb25QcmVzZXQgPT09ICdob3Jpem9udGFsJ1xuICAgICAgfHwgcmF3LnJvdGF0aW9uUHJlc2V0ID09PSAnbW9zdGx5LWhvcml6b250YWwnXG4gICAgICB8fCByYXcucm90YXRpb25QcmVzZXQgPT09ICdtaXhlZCdcbiAgICAgIHx8IHJhdy5yb3RhdGlvblByZXNldCA9PT0gJ3ZlcnRpY2FsJ1xuICAgICAgPyByYXcucm90YXRpb25QcmVzZXRcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIucm90YXRpb25QcmVzZXQ7XG5cbiAgICBjb25zdCBzcGlyYWwgPSByYXcuc3BpcmFsID09PSAnYXJjaGltZWRlYW4nIHx8IHJhdy5zcGlyYWwgPT09ICdyZWN0YW5ndWxhcidcbiAgICAgID8gcmF3LnNwaXJhbFxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5zcGlyYWw7XG5cbiAgICBjb25zdCB3b3JkUGFkZGluZyA9IHRoaXMuY2xhbXBOdW1iZXIocmF3LndvcmRQYWRkaW5nLCAwLCAxMiwgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIud29yZFBhZGRpbmcpO1xuICAgIGNvbnN0IG1pbkZvbnRTaXplID0gdGhpcy5jbGFtcE51bWJlcihyYXcubWluRm9udFNpemUsIDgsIDY0LCBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5taW5Gb250U2l6ZSk7XG4gICAgY29uc3QgbWF4Rm9udFNpemUgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy5tYXhGb250U2l6ZSwgMTYsIDE0MCwgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIubWF4Rm9udFNpemUpO1xuICAgIGNvbnN0IHNhZmVNaW5Gb250U2l6ZSA9IE1hdGgubWluKG1pbkZvbnRTaXplLCBtYXhGb250U2l6ZSAtIDEpO1xuICAgIGNvbnN0IHNhZmVNYXhGb250U2l6ZSA9IE1hdGgubWF4KG1heEZvbnRTaXplLCBzYWZlTWluRm9udFNpemUgKyAxKTtcblxuICAgIGNvbnN0IGZvbnRGYW1pbHkgPSB0eXBlb2YgcmF3LmZvbnRGYW1pbHkgPT09ICdzdHJpbmcnICYmIHJhdy5mb250RmFtaWx5LnRyaW0oKS5sZW5ndGggPiAwXG4gICAgICA/IHJhdy5mb250RmFtaWx5LnRyaW0oKVxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5mb250RmFtaWx5O1xuXG4gICAgY29uc3Qgc2NhbGluZ01vZGUgPSByYXcuc2NhbGluZ01vZGUgPT09ICdsaW5lYXInXG4gICAgICB8fCByYXcuc2NhbGluZ01vZGUgPT09ICdwb3dlcidcbiAgICAgIHx8IHJhdy5zY2FsaW5nTW9kZSA9PT0gJ2xvZydcbiAgICAgIHx8IHJhdy5zY2FsaW5nTW9kZSA9PT0gJ3JhbmsnXG4gICAgICA/IHJhdy5zY2FsaW5nTW9kZVxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5zY2FsaW5nTW9kZTtcblxuICAgIGNvbnN0IGVtcGhhc2lzID0gdGhpcy5jbGFtcEZsb2F0KHJhdy5lbXBoYXNpcywgMC41LCAzLCBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5lbXBoYXNpcyk7XG5cbiAgICBjb25zdCBzaG93Q291bnRJbldvcmRUZXh0ID0gdHlwZW9mIHJhdy5zaG93Q291bnRJbldvcmRUZXh0ID09PSAnYm9vbGVhbidcbiAgICAgID8gcmF3LnNob3dDb3VudEluV29yZFRleHRcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuc2hvd0NvdW50SW5Xb3JkVGV4dDtcblxuICAgIGNvbnN0IHdvcmRUZXh0TWV0cmljID0gcmF3LndvcmRUZXh0TWV0cmljID09PSAnY291bnQnIHx8IHJhdy53b3JkVGV4dE1ldHJpYyA9PT0gJ2ZyZXF1ZW5jeSdcbiAgICAgID8gcmF3LndvcmRUZXh0TWV0cmljXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLndvcmRUZXh0TWV0cmljO1xuXG4gICAgY29uc3Qgc2hvd1dvcmRUZXh0TWV0cmljVG9nZ2xlID0gdHlwZW9mIHJhdy5zaG93V29yZFRleHRNZXRyaWNUb2dnbGUgPT09ICdib29sZWFuJ1xuICAgICAgPyByYXcuc2hvd1dvcmRUZXh0TWV0cmljVG9nZ2xlXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnNob3dXb3JkVGV4dE1ldHJpY1RvZ2dsZTtcblxuICAgIGNvbnN0IGNvdW50TGFiZWxGb3JtYXQgPSByYXcuY291bnRMYWJlbEZvcm1hdCA9PT0gJ3BhcmVuJ1xuICAgICAgfHwgcmF3LmNvdW50TGFiZWxGb3JtYXQgPT09ICdkb3QnXG4gICAgICB8fCByYXcuY291bnRMYWJlbEZvcm1hdCA9PT0gJ2NvbG9uJ1xuICAgICAgPyByYXcuY291bnRMYWJlbEZvcm1hdFxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5jb3VudExhYmVsRm9ybWF0O1xuXG4gICAgY29uc3QgY291bnRMYWJlbE1pbkNvdW50ID0gdGhpcy5jbGFtcE51bWJlcihyYXcuY291bnRMYWJlbE1pbkNvdW50LCAxLCAxMDAsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLmNvdW50TGFiZWxNaW5Db3VudCk7XG5cbiAgICBjb25zdCBwcm9ncmVzc0RldGFpbCA9IHJhdy5wcm9ncmVzc0RldGFpbCA9PT0gJ21pbmltYWwnXG4gICAgICB8fCByYXcucHJvZ3Jlc3NEZXRhaWwgPT09ICdiYWxhbmNlZCdcbiAgICAgIHx8IHJhdy5wcm9ncmVzc0RldGFpbCA9PT0gJ2RldGFpbGVkJ1xuICAgICAgfHwgcmF3LnByb2dyZXNzRGV0YWlsID09PSAndW5oaW5nZWQnXG4gICAgICA/IHJhdy5wcm9ncmVzc0RldGFpbFxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5wcm9ncmVzc0RldGFpbDtcblxuICAgIGNvbnN0IHNjYW5CYXRjaFNpemUgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy5zY2FuQmF0Y2hTaXplLCA4LCA2NCwgREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIuc2NhbkJhdGNoU2l6ZSk7XG4gICAgY29uc3QgbGF5b3V0VGltZUludGVydmFsTXMgPSB0aGlzLmNsYW1wTnVtYmVyKHJhdy5sYXlvdXRUaW1lSW50ZXJ2YWxNcywgOCwgNDAsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLmxheW91dFRpbWVJbnRlcnZhbE1zKTtcblxuICAgIGNvbnN0IGRldGVybWluaXN0aWNMYXlvdXQgPSB0eXBlb2YgcmF3LmRldGVybWluaXN0aWNMYXlvdXQgPT09ICdib29sZWFuJ1xuICAgICAgPyByYXcuZGV0ZXJtaW5pc3RpY0xheW91dFxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5kZXRlcm1pbmlzdGljTGF5b3V0O1xuXG4gICAgY29uc3QgcmFuZG9tU2VlZCA9IHRoaXMuY2xhbXBOdW1iZXIocmF3LnJhbmRvbVNlZWQsIDEsIDIxNDc0ODM2NDcsIERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnJhbmRvbVNlZWQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJvdGF0aW9uUHJlc2V0LFxuICAgICAgc3BpcmFsLFxuICAgICAgd29yZFBhZGRpbmcsXG4gICAgICBtaW5Gb250U2l6ZTogc2FmZU1pbkZvbnRTaXplLFxuICAgICAgbWF4Rm9udFNpemU6IHNhZmVNYXhGb250U2l6ZSxcbiAgICAgIGZvbnRGYW1pbHksXG4gICAgICBzY2FsaW5nTW9kZSxcbiAgICAgIGVtcGhhc2lzLFxuICAgICAgc2hvd0NvdW50SW5Xb3JkVGV4dCxcbiAgICAgIHdvcmRUZXh0TWV0cmljLFxuICAgICAgc2hvd1dvcmRUZXh0TWV0cmljVG9nZ2xlLFxuICAgICAgY291bnRMYWJlbEZvcm1hdCxcbiAgICAgIGNvdW50TGFiZWxNaW5Db3VudCxcbiAgICAgIHByb2dyZXNzRGV0YWlsLFxuICAgICAgc2NhbkJhdGNoU2l6ZSxcbiAgICAgIGxheW91dFRpbWVJbnRlcnZhbE1zLFxuICAgICAgZGV0ZXJtaW5pc3RpY0xheW91dCxcbiAgICAgIHJhbmRvbVNlZWQsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgY2xhbXBOdW1iZXIodmFsdWU6IHVua25vd24sIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlciwgZmFsbGJhY2s6IG51bWJlcik6IG51bWJlciB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicgfHwgTnVtYmVyLmlzTmFOKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZhbGxiYWNrO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgTWF0aC5yb3VuZCh2YWx1ZSkpKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xhbXBGbG9hdCh2YWx1ZTogdW5rbm93biwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyLCBmYWxsYmFjazogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fCBOdW1iZXIuaXNOYU4odmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsbGJhY2s7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCB2YWx1ZSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVRhZ0xpc3QocmF3VGFnczogdW5rbm93bik6IHN0cmluZ1tdIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHJhd1RhZ3MpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgdGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IHZhbHVlIG9mIHJhd1RhZ3MpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVRhZyh2YWx1ZSk7XG4gICAgaWYgKG5vcm1hbGl6ZWQpIHtcbiAgICAgIHRhZ3MuYWRkKG5vcm1hbGl6ZWQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbLi4udGFnc107XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUZyb250bWF0dGVyUnVsZXMocmF3UnVsZXM6IHVua25vd24pOiBGcm9udG1hdHRlclJ1bGVbXSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShyYXdSdWxlcykpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBhbGxvd2VkID0gbmV3IFNldChbJ2VxdWFscycsICdub3QtZXF1YWxzJywgJ2NvbnRhaW5zJywgJ2d0JywgJ2d0ZScsICdsdCcsICdsdGUnLCAnZXhpc3RzJywgJ25vdC1leGlzdHMnXSk7XG4gIGNvbnN0IHJ1bGVzOiBGcm9udG1hdHRlclJ1bGVbXSA9IFtdO1xuXG4gIGZvciAoY29uc3QgcnVsZSBvZiByYXdSdWxlcykge1xuICAgIGlmICghcnVsZSB8fCB0eXBlb2YgcnVsZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbmRpZGF0ZSA9IHJ1bGUgYXMgUGFydGlhbDxGcm9udG1hdHRlclJ1bGU+O1xuICAgIGNvbnN0IGtleSA9IHR5cGVvZiBjYW5kaWRhdGUua2V5ID09PSAnc3RyaW5nJyA/IGNhbmRpZGF0ZS5rZXkudHJpbSgpIDogJyc7XG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IG9wZXJhdG9yID0gdHlwZW9mIGNhbmRpZGF0ZS5vcGVyYXRvciA9PT0gJ3N0cmluZycgJiYgYWxsb3dlZC5oYXMoY2FuZGlkYXRlLm9wZXJhdG9yKVxuICAgICAgPyBjYW5kaWRhdGUub3BlcmF0b3IgYXMgRnJvbnRtYXR0ZXJSdWxlWydvcGVyYXRvciddXG4gICAgICA6ICdlcXVhbHMnO1xuICAgIGNvbnN0IHZhbHVlID0gdHlwZW9mIGNhbmRpZGF0ZS52YWx1ZSA9PT0gJ3N0cmluZycgPyBjYW5kaWRhdGUudmFsdWUgOiAnJztcblxuICAgIHJ1bGVzLnB1c2goeyBrZXksIG9wZXJhdG9yLCB2YWx1ZSB9KTtcbiAgfVxuXG4gIHJldHVybiBydWxlcztcbn1cblxuZnVuY3Rpb24gY2xvbmVTZXR0aW5ncyhzZXR0aW5nczogV29yZENsb3VkU2V0dGluZ3MpOiBXb3JkQ2xvdWRTZXR0aW5ncyB7XG4gIHJldHVybiB7XG4gICAgYmxhY2tsaXN0V29yZHM6IFsuLi5zZXR0aW5ncy5ibGFja2xpc3RXb3Jkc10sXG4gICAgcmVuZGVyOiB7IC4uLnNldHRpbmdzLnJlbmRlciB9LFxuICAgIGZpbHRlcnM6IHtcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIC4uLnNldHRpbmdzLmZpbHRlcnMuc2NvcGUsXG4gICAgICAgIGZvbGRlclBhdGhzOiBbLi4uc2V0dGluZ3MuZmlsdGVycy5zY29wZS5mb2xkZXJQYXRoc10sXG4gICAgICB9LFxuICAgICAgaW5jbHVkZVRhZ3M6IFsuLi5zZXR0aW5ncy5maWx0ZXJzLmluY2x1ZGVUYWdzXSxcbiAgICAgIGV4Y2x1ZGVUYWdzOiBbLi4uc2V0dGluZ3MuZmlsdGVycy5leGNsdWRlVGFnc10sXG4gICAgICB0YWdNYXRjaE1vZGU6IHNldHRpbmdzLmZpbHRlcnMudGFnTWF0Y2hNb2RlLFxuICAgICAgZnJvbnRtYXR0ZXJSdWxlczogc2V0dGluZ3MuZmlsdGVycy5mcm9udG1hdHRlclJ1bGVzLm1hcCgocnVsZSkgPT4gKHsgLi4ucnVsZSB9KSksXG4gICAgICBmcmVxdWVuY3k6IHtcbiAgICAgICAgLi4uc2V0dGluZ3MuZmlsdGVycy5mcmVxdWVuY3ksXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXNjZW5kaW5nKGEsIGIpIHtcbiAgcmV0dXJuIGEgPT0gbnVsbCB8fCBiID09IG51bGwgPyBOYU4gOiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZXNjZW5kaW5nKGEsIGIpIHtcbiAgcmV0dXJuIGEgPT0gbnVsbCB8fCBiID09IG51bGwgPyBOYU5cbiAgICA6IGIgPCBhID8gLTFcbiAgICA6IGIgPiBhID8gMVxuICAgIDogYiA+PSBhID8gMFxuICAgIDogTmFOO1xufVxuIiwgImltcG9ydCBhc2NlbmRpbmcgZnJvbSBcIi4vYXNjZW5kaW5nLmpzXCI7XG5pbXBvcnQgZGVzY2VuZGluZyBmcm9tIFwiLi9kZXNjZW5kaW5nLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJpc2VjdG9yKGYpIHtcbiAgbGV0IGNvbXBhcmUxLCBjb21wYXJlMiwgZGVsdGE7XG5cbiAgLy8gSWYgYW4gYWNjZXNzb3IgaXMgc3BlY2lmaWVkLCBwcm9tb3RlIGl0IHRvIGEgY29tcGFyYXRvci4gSW4gdGhpcyBjYXNlIHdlXG4gIC8vIGNhbiB0ZXN0IHdoZXRoZXIgdGhlIHNlYXJjaCB2YWx1ZSBpcyAoc2VsZi0pIGNvbXBhcmFibGUuIFdlIGNhblx1MjAxOXQgZG8gdGhpc1xuICAvLyBmb3IgYSBjb21wYXJhdG9yIChleGNlcHQgZm9yIHNwZWNpZmljLCBrbm93biBjb21wYXJhdG9ycykgYmVjYXVzZSB3ZSBjYW5cdTIwMTl0XG4gIC8vIHRlbGwgaWYgdGhlIGNvbXBhcmF0b3IgaXMgc3ltbWV0cmljLCBhbmQgYW4gYXN5bW1ldHJpYyBjb21wYXJhdG9yIGNhblx1MjAxOXQgYmVcbiAgLy8gdXNlZCB0byB0ZXN0IHdoZXRoZXIgYSBzaW5nbGUgdmFsdWUgaXMgY29tcGFyYWJsZS5cbiAgaWYgKGYubGVuZ3RoICE9PSAyKSB7XG4gICAgY29tcGFyZTEgPSBhc2NlbmRpbmc7XG4gICAgY29tcGFyZTIgPSAoZCwgeCkgPT4gYXNjZW5kaW5nKGYoZCksIHgpO1xuICAgIGRlbHRhID0gKGQsIHgpID0+IGYoZCkgLSB4O1xuICB9IGVsc2Uge1xuICAgIGNvbXBhcmUxID0gZiA9PT0gYXNjZW5kaW5nIHx8IGYgPT09IGRlc2NlbmRpbmcgPyBmIDogemVybztcbiAgICBjb21wYXJlMiA9IGY7XG4gICAgZGVsdGEgPSBmO1xuICB9XG5cbiAgZnVuY3Rpb24gbGVmdChhLCB4LCBsbyA9IDAsIGhpID0gYS5sZW5ndGgpIHtcbiAgICBpZiAobG8gPCBoaSkge1xuICAgICAgaWYgKGNvbXBhcmUxKHgsIHgpICE9PSAwKSByZXR1cm4gaGk7XG4gICAgICBkbyB7XG4gICAgICAgIGNvbnN0IG1pZCA9IChsbyArIGhpKSA+Pj4gMTtcbiAgICAgICAgaWYgKGNvbXBhcmUyKGFbbWlkXSwgeCkgPCAwKSBsbyA9IG1pZCArIDE7XG4gICAgICAgIGVsc2UgaGkgPSBtaWQ7XG4gICAgICB9IHdoaWxlIChsbyA8IGhpKTtcbiAgICB9XG4gICAgcmV0dXJuIGxvO1xuICB9XG5cbiAgZnVuY3Rpb24gcmlnaHQoYSwgeCwgbG8gPSAwLCBoaSA9IGEubGVuZ3RoKSB7XG4gICAgaWYgKGxvIDwgaGkpIHtcbiAgICAgIGlmIChjb21wYXJlMSh4LCB4KSAhPT0gMCkgcmV0dXJuIGhpO1xuICAgICAgZG8ge1xuICAgICAgICBjb25zdCBtaWQgPSAobG8gKyBoaSkgPj4+IDE7XG4gICAgICAgIGlmIChjb21wYXJlMihhW21pZF0sIHgpIDw9IDApIGxvID0gbWlkICsgMTtcbiAgICAgICAgZWxzZSBoaSA9IG1pZDtcbiAgICAgIH0gd2hpbGUgKGxvIDwgaGkpO1xuICAgIH1cbiAgICByZXR1cm4gbG87XG4gIH1cblxuICBmdW5jdGlvbiBjZW50ZXIoYSwgeCwgbG8gPSAwLCBoaSA9IGEubGVuZ3RoKSB7XG4gICAgY29uc3QgaSA9IGxlZnQoYSwgeCwgbG8sIGhpIC0gMSk7XG4gICAgcmV0dXJuIGkgPiBsbyAmJiBkZWx0YShhW2kgLSAxXSwgeCkgPiAtZGVsdGEoYVtpXSwgeCkgPyBpIC0gMSA6IGk7XG4gIH1cblxuICByZXR1cm4ge2xlZnQsIGNlbnRlciwgcmlnaHR9O1xufVxuXG5mdW5jdGlvbiB6ZXJvKCkge1xuICByZXR1cm4gMDtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBudW1iZXIoeCkge1xuICByZXR1cm4geCA9PT0gbnVsbCA/IE5hTiA6ICt4O1xufVxuXG5leHBvcnQgZnVuY3Rpb24qIG51bWJlcnModmFsdWVzLCB2YWx1ZW9mKSB7XG4gIGlmICh2YWx1ZW9mID09PSB1bmRlZmluZWQpIHtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmICh2YWx1ZSA9ICt2YWx1ZSkgPj0gdmFsdWUpIHtcbiAgICAgICAgeWllbGQgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgaWYgKCh2YWx1ZSA9IHZhbHVlb2YodmFsdWUsICsraW5kZXgsIHZhbHVlcykpICE9IG51bGwgJiYgKHZhbHVlID0gK3ZhbHVlKSA+PSB2YWx1ZSkge1xuICAgICAgICB5aWVsZCB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgYXNjZW5kaW5nIGZyb20gXCIuL2FzY2VuZGluZy5qc1wiO1xuaW1wb3J0IGJpc2VjdG9yIGZyb20gXCIuL2Jpc2VjdG9yLmpzXCI7XG5pbXBvcnQgbnVtYmVyIGZyb20gXCIuL251bWJlci5qc1wiO1xuXG5jb25zdCBhc2NlbmRpbmdCaXNlY3QgPSBiaXNlY3Rvcihhc2NlbmRpbmcpO1xuZXhwb3J0IGNvbnN0IGJpc2VjdFJpZ2h0ID0gYXNjZW5kaW5nQmlzZWN0LnJpZ2h0O1xuZXhwb3J0IGNvbnN0IGJpc2VjdExlZnQgPSBhc2NlbmRpbmdCaXNlY3QubGVmdDtcbmV4cG9ydCBjb25zdCBiaXNlY3RDZW50ZXIgPSBiaXNlY3RvcihudW1iZXIpLmNlbnRlcjtcbmV4cG9ydCBkZWZhdWx0IGJpc2VjdFJpZ2h0O1xuIiwgImV4cG9ydCBjbGFzcyBJbnRlcm5NYXAgZXh0ZW5kcyBNYXAge1xuICBjb25zdHJ1Y3RvcihlbnRyaWVzLCBrZXkgPSBrZXlvZikge1xuICAgIHN1cGVyKCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge19pbnRlcm46IHt2YWx1ZTogbmV3IE1hcCgpfSwgX2tleToge3ZhbHVlOiBrZXl9fSk7XG4gICAgaWYgKGVudHJpZXMgIT0gbnVsbCkgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZW50cmllcykgdGhpcy5zZXQoa2V5LCB2YWx1ZSk7XG4gIH1cbiAgZ2V0KGtleSkge1xuICAgIHJldHVybiBzdXBlci5nZXQoaW50ZXJuX2dldCh0aGlzLCBrZXkpKTtcbiAgfVxuICBoYXMoa2V5KSB7XG4gICAgcmV0dXJuIHN1cGVyLmhhcyhpbnRlcm5fZ2V0KHRoaXMsIGtleSkpO1xuICB9XG4gIHNldChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLnNldChpbnRlcm5fc2V0KHRoaXMsIGtleSksIHZhbHVlKTtcbiAgfVxuICBkZWxldGUoa2V5KSB7XG4gICAgcmV0dXJuIHN1cGVyLmRlbGV0ZShpbnRlcm5fZGVsZXRlKHRoaXMsIGtleSkpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5TZXQgZXh0ZW5kcyBTZXQge1xuICBjb25zdHJ1Y3Rvcih2YWx1ZXMsIGtleSA9IGtleW9mKSB7XG4gICAgc3VwZXIoKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7X2ludGVybjoge3ZhbHVlOiBuZXcgTWFwKCl9LCBfa2V5OiB7dmFsdWU6IGtleX19KTtcbiAgICBpZiAodmFsdWVzICE9IG51bGwpIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB0aGlzLmFkZCh2YWx1ZSk7XG4gIH1cbiAgaGFzKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmhhcyhpbnRlcm5fZ2V0KHRoaXMsIHZhbHVlKSk7XG4gIH1cbiAgYWRkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmFkZChpbnRlcm5fc2V0KHRoaXMsIHZhbHVlKSk7XG4gIH1cbiAgZGVsZXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmRlbGV0ZShpbnRlcm5fZGVsZXRlKHRoaXMsIHZhbHVlKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW50ZXJuX2dldCh7X2ludGVybiwgX2tleX0sIHZhbHVlKSB7XG4gIGNvbnN0IGtleSA9IF9rZXkodmFsdWUpO1xuICByZXR1cm4gX2ludGVybi5oYXMoa2V5KSA/IF9pbnRlcm4uZ2V0KGtleSkgOiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gaW50ZXJuX3NldCh7X2ludGVybiwgX2tleX0sIHZhbHVlKSB7XG4gIGNvbnN0IGtleSA9IF9rZXkodmFsdWUpO1xuICBpZiAoX2ludGVybi5oYXMoa2V5KSkgcmV0dXJuIF9pbnRlcm4uZ2V0KGtleSk7XG4gIF9pbnRlcm4uc2V0KGtleSwgdmFsdWUpO1xuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGludGVybl9kZWxldGUoe19pbnRlcm4sIF9rZXl9LCB2YWx1ZSkge1xuICBjb25zdCBrZXkgPSBfa2V5KHZhbHVlKTtcbiAgaWYgKF9pbnRlcm4uaGFzKGtleSkpIHtcbiAgICB2YWx1ZSA9IF9pbnRlcm4uZ2V0KGtleSk7XG4gICAgX2ludGVybi5kZWxldGUoa2V5KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGtleW9mKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbn1cbiIsICJjb25zdCBlMTAgPSBNYXRoLnNxcnQoNTApLFxuICAgIGU1ID0gTWF0aC5zcXJ0KDEwKSxcbiAgICBlMiA9IE1hdGguc3FydCgyKTtcblxuZnVuY3Rpb24gdGlja1NwZWMoc3RhcnQsIHN0b3AsIGNvdW50KSB7XG4gIGNvbnN0IHN0ZXAgPSAoc3RvcCAtIHN0YXJ0KSAvIE1hdGgubWF4KDAsIGNvdW50KSxcbiAgICAgIHBvd2VyID0gTWF0aC5mbG9vcihNYXRoLmxvZzEwKHN0ZXApKSxcbiAgICAgIGVycm9yID0gc3RlcCAvIE1hdGgucG93KDEwLCBwb3dlciksXG4gICAgICBmYWN0b3IgPSBlcnJvciA+PSBlMTAgPyAxMCA6IGVycm9yID49IGU1ID8gNSA6IGVycm9yID49IGUyID8gMiA6IDE7XG4gIGxldCBpMSwgaTIsIGluYztcbiAgaWYgKHBvd2VyIDwgMCkge1xuICAgIGluYyA9IE1hdGgucG93KDEwLCAtcG93ZXIpIC8gZmFjdG9yO1xuICAgIGkxID0gTWF0aC5yb3VuZChzdGFydCAqIGluYyk7XG4gICAgaTIgPSBNYXRoLnJvdW5kKHN0b3AgKiBpbmMpO1xuICAgIGlmIChpMSAvIGluYyA8IHN0YXJ0KSArK2kxO1xuICAgIGlmIChpMiAvIGluYyA+IHN0b3ApIC0taTI7XG4gICAgaW5jID0gLWluYztcbiAgfSBlbHNlIHtcbiAgICBpbmMgPSBNYXRoLnBvdygxMCwgcG93ZXIpICogZmFjdG9yO1xuICAgIGkxID0gTWF0aC5yb3VuZChzdGFydCAvIGluYyk7XG4gICAgaTIgPSBNYXRoLnJvdW5kKHN0b3AgLyBpbmMpO1xuICAgIGlmIChpMSAqIGluYyA8IHN0YXJ0KSArK2kxO1xuICAgIGlmIChpMiAqIGluYyA+IHN0b3ApIC0taTI7XG4gIH1cbiAgaWYgKGkyIDwgaTEgJiYgMC41IDw9IGNvdW50ICYmIGNvdW50IDwgMikgcmV0dXJuIHRpY2tTcGVjKHN0YXJ0LCBzdG9wLCBjb3VudCAqIDIpO1xuICByZXR1cm4gW2kxLCBpMiwgaW5jXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGlja3Moc3RhcnQsIHN0b3AsIGNvdW50KSB7XG4gIHN0b3AgPSArc3RvcCwgc3RhcnQgPSArc3RhcnQsIGNvdW50ID0gK2NvdW50O1xuICBpZiAoIShjb3VudCA+IDApKSByZXR1cm4gW107XG4gIGlmIChzdGFydCA9PT0gc3RvcCkgcmV0dXJuIFtzdGFydF07XG4gIGNvbnN0IHJldmVyc2UgPSBzdG9wIDwgc3RhcnQsIFtpMSwgaTIsIGluY10gPSByZXZlcnNlID8gdGlja1NwZWMoc3RvcCwgc3RhcnQsIGNvdW50KSA6IHRpY2tTcGVjKHN0YXJ0LCBzdG9wLCBjb3VudCk7XG4gIGlmICghKGkyID49IGkxKSkgcmV0dXJuIFtdO1xuICBjb25zdCBuID0gaTIgLSBpMSArIDEsIHRpY2tzID0gbmV3IEFycmF5KG4pO1xuICBpZiAocmV2ZXJzZSkge1xuICAgIGlmIChpbmMgPCAwKSBmb3IgKGxldCBpID0gMDsgaSA8IG47ICsraSkgdGlja3NbaV0gPSAoaTIgLSBpKSAvIC1pbmM7XG4gICAgZWxzZSBmb3IgKGxldCBpID0gMDsgaSA8IG47ICsraSkgdGlja3NbaV0gPSAoaTIgLSBpKSAqIGluYztcbiAgfSBlbHNlIHtcbiAgICBpZiAoaW5jIDwgMCkgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyArK2kpIHRpY2tzW2ldID0gKGkxICsgaSkgLyAtaW5jO1xuICAgIGVsc2UgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyArK2kpIHRpY2tzW2ldID0gKGkxICsgaSkgKiBpbmM7XG4gIH1cbiAgcmV0dXJuIHRpY2tzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGlja0luY3JlbWVudChzdGFydCwgc3RvcCwgY291bnQpIHtcbiAgc3RvcCA9ICtzdG9wLCBzdGFydCA9ICtzdGFydCwgY291bnQgPSArY291bnQ7XG4gIHJldHVybiB0aWNrU3BlYyhzdGFydCwgc3RvcCwgY291bnQpWzJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGlja1N0ZXAoc3RhcnQsIHN0b3AsIGNvdW50KSB7XG4gIHN0b3AgPSArc3RvcCwgc3RhcnQgPSArc3RhcnQsIGNvdW50ID0gK2NvdW50O1xuICBjb25zdCByZXZlcnNlID0gc3RvcCA8IHN0YXJ0LCBpbmMgPSByZXZlcnNlID8gdGlja0luY3JlbWVudChzdG9wLCBzdGFydCwgY291bnQpIDogdGlja0luY3JlbWVudChzdGFydCwgc3RvcCwgY291bnQpO1xuICByZXR1cm4gKHJldmVyc2UgPyAtMSA6IDEpICogKGluYyA8IDAgPyAxIC8gLWluYyA6IGluYyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgc3RhcnQgPSArc3RhcnQsIHN0b3AgPSArc3RvcCwgc3RlcCA9IChuID0gYXJndW1lbnRzLmxlbmd0aCkgPCAyID8gKHN0b3AgPSBzdGFydCwgc3RhcnQgPSAwLCAxKSA6IG4gPCAzID8gMSA6ICtzdGVwO1xuXG4gIHZhciBpID0gLTEsXG4gICAgICBuID0gTWF0aC5tYXgoMCwgTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCkpIHwgMCxcbiAgICAgIHJhbmdlID0gbmV3IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgcmFuZ2VbaV0gPSBzdGFydCArIGkgKiBzdGVwO1xuICB9XG5cbiAgcmV0dXJuIHJhbmdlO1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBpbml0UmFuZ2UoZG9tYWluLCByYW5nZSkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IGJyZWFrO1xuICAgIGNhc2UgMTogdGhpcy5yYW5nZShkb21haW4pOyBicmVhaztcbiAgICBkZWZhdWx0OiB0aGlzLnJhbmdlKHJhbmdlKS5kb21haW4oZG9tYWluKTsgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0SW50ZXJwb2xhdG9yKGRvbWFpbiwgaW50ZXJwb2xhdG9yKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogYnJlYWs7XG4gICAgY2FzZSAxOiB7XG4gICAgICBpZiAodHlwZW9mIGRvbWFpbiA9PT0gXCJmdW5jdGlvblwiKSB0aGlzLmludGVycG9sYXRvcihkb21haW4pO1xuICAgICAgZWxzZSB0aGlzLnJhbmdlKGRvbWFpbik7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgZGVmYXVsdDoge1xuICAgICAgdGhpcy5kb21haW4oZG9tYWluKTtcbiAgICAgIGlmICh0eXBlb2YgaW50ZXJwb2xhdG9yID09PSBcImZ1bmN0aW9uXCIpIHRoaXMuaW50ZXJwb2xhdG9yKGludGVycG9sYXRvcik7XG4gICAgICBlbHNlIHRoaXMucmFuZ2UoaW50ZXJwb2xhdG9yKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn1cbiIsICJpbXBvcnQge0ludGVybk1hcH0gZnJvbSBcImQzLWFycmF5XCI7XG5pbXBvcnQge2luaXRSYW5nZX0gZnJvbSBcIi4vaW5pdC5qc1wiO1xuXG5leHBvcnQgY29uc3QgaW1wbGljaXQgPSBTeW1ib2woXCJpbXBsaWNpdFwiKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3JkaW5hbCgpIHtcbiAgdmFyIGluZGV4ID0gbmV3IEludGVybk1hcCgpLFxuICAgICAgZG9tYWluID0gW10sXG4gICAgICByYW5nZSA9IFtdLFxuICAgICAgdW5rbm93biA9IGltcGxpY2l0O1xuXG4gIGZ1bmN0aW9uIHNjYWxlKGQpIHtcbiAgICBsZXQgaSA9IGluZGV4LmdldChkKTtcbiAgICBpZiAoaSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodW5rbm93biAhPT0gaW1wbGljaXQpIHJldHVybiB1bmtub3duO1xuICAgICAgaW5kZXguc2V0KGQsIGkgPSBkb21haW4ucHVzaChkKSAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gcmFuZ2VbaSAlIHJhbmdlLmxlbmd0aF07XG4gIH1cblxuICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbihfKSB7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluLnNsaWNlKCk7XG4gICAgZG9tYWluID0gW10sIGluZGV4ID0gbmV3IEludGVybk1hcCgpO1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2YgXykge1xuICAgICAgaWYgKGluZGV4Lmhhcyh2YWx1ZSkpIGNvbnRpbnVlO1xuICAgICAgaW5kZXguc2V0KHZhbHVlLCBkb21haW4ucHVzaCh2YWx1ZSkgLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHNjYWxlO1xuICB9O1xuXG4gIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJhbmdlID0gQXJyYXkuZnJvbShfKSwgc2NhbGUpIDogcmFuZ2Uuc2xpY2UoKTtcbiAgfTtcblxuICBzY2FsZS51bmtub3duID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHVua25vd24gPSBfLCBzY2FsZSkgOiB1bmtub3duO1xuICB9O1xuXG4gIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gb3JkaW5hbChkb21haW4sIHJhbmdlKS51bmtub3duKHVua25vd24pO1xuICB9O1xuXG4gIGluaXRSYW5nZS5hcHBseShzY2FsZSwgYXJndW1lbnRzKTtcblxuICByZXR1cm4gc2NhbGU7XG59XG4iLCAiaW1wb3J0IHtyYW5nZSBhcyBzZXF1ZW5jZX0gZnJvbSBcImQzLWFycmF5XCI7XG5pbXBvcnQge2luaXRSYW5nZX0gZnJvbSBcIi4vaW5pdC5qc1wiO1xuaW1wb3J0IG9yZGluYWwgZnJvbSBcIi4vb3JkaW5hbC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiYW5kKCkge1xuICB2YXIgc2NhbGUgPSBvcmRpbmFsKCkudW5rbm93bih1bmRlZmluZWQpLFxuICAgICAgZG9tYWluID0gc2NhbGUuZG9tYWluLFxuICAgICAgb3JkaW5hbFJhbmdlID0gc2NhbGUucmFuZ2UsXG4gICAgICByMCA9IDAsXG4gICAgICByMSA9IDEsXG4gICAgICBzdGVwLFxuICAgICAgYmFuZHdpZHRoLFxuICAgICAgcm91bmQgPSBmYWxzZSxcbiAgICAgIHBhZGRpbmdJbm5lciA9IDAsXG4gICAgICBwYWRkaW5nT3V0ZXIgPSAwLFxuICAgICAgYWxpZ24gPSAwLjU7XG5cbiAgZGVsZXRlIHNjYWxlLnVua25vd247XG5cbiAgZnVuY3Rpb24gcmVzY2FsZSgpIHtcbiAgICB2YXIgbiA9IGRvbWFpbigpLmxlbmd0aCxcbiAgICAgICAgcmV2ZXJzZSA9IHIxIDwgcjAsXG4gICAgICAgIHN0YXJ0ID0gcmV2ZXJzZSA/IHIxIDogcjAsXG4gICAgICAgIHN0b3AgPSByZXZlcnNlID8gcjAgOiByMTtcbiAgICBzdGVwID0gKHN0b3AgLSBzdGFydCkgLyBNYXRoLm1heCgxLCBuIC0gcGFkZGluZ0lubmVyICsgcGFkZGluZ091dGVyICogMik7XG4gICAgaWYgKHJvdW5kKSBzdGVwID0gTWF0aC5mbG9vcihzdGVwKTtcbiAgICBzdGFydCArPSAoc3RvcCAtIHN0YXJ0IC0gc3RlcCAqIChuIC0gcGFkZGluZ0lubmVyKSkgKiBhbGlnbjtcbiAgICBiYW5kd2lkdGggPSBzdGVwICogKDEgLSBwYWRkaW5nSW5uZXIpO1xuICAgIGlmIChyb3VuZCkgc3RhcnQgPSBNYXRoLnJvdW5kKHN0YXJ0KSwgYmFuZHdpZHRoID0gTWF0aC5yb3VuZChiYW5kd2lkdGgpO1xuICAgIHZhciB2YWx1ZXMgPSBzZXF1ZW5jZShuKS5tYXAoZnVuY3Rpb24oaSkgeyByZXR1cm4gc3RhcnQgKyBzdGVwICogaTsgfSk7XG4gICAgcmV0dXJuIG9yZGluYWxSYW5nZShyZXZlcnNlID8gdmFsdWVzLnJldmVyc2UoKSA6IHZhbHVlcyk7XG4gIH1cblxuICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZG9tYWluKF8pLCByZXNjYWxlKCkpIDogZG9tYWluKCk7XG4gIH07XG5cbiAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoW3IwLCByMV0gPSBfLCByMCA9ICtyMCwgcjEgPSArcjEsIHJlc2NhbGUoKSkgOiBbcjAsIHIxXTtcbiAgfTtcblxuICBzY2FsZS5yYW5nZVJvdW5kID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBbcjAsIHIxXSA9IF8sIHIwID0gK3IwLCByMSA9ICtyMSwgcm91bmQgPSB0cnVlLCByZXNjYWxlKCk7XG4gIH07XG5cbiAgc2NhbGUuYmFuZHdpZHRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGJhbmR3aWR0aDtcbiAgfTtcblxuICBzY2FsZS5zdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN0ZXA7XG4gIH07XG5cbiAgc2NhbGUucm91bmQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocm91bmQgPSAhIV8sIHJlc2NhbGUoKSkgOiByb3VuZDtcbiAgfTtcblxuICBzY2FsZS5wYWRkaW5nID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHBhZGRpbmdJbm5lciA9IE1hdGgubWluKDEsIHBhZGRpbmdPdXRlciA9ICtfKSwgcmVzY2FsZSgpKSA6IHBhZGRpbmdJbm5lcjtcbiAgfTtcblxuICBzY2FsZS5wYWRkaW5nSW5uZXIgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocGFkZGluZ0lubmVyID0gTWF0aC5taW4oMSwgXyksIHJlc2NhbGUoKSkgOiBwYWRkaW5nSW5uZXI7XG4gIH07XG5cbiAgc2NhbGUucGFkZGluZ091dGVyID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHBhZGRpbmdPdXRlciA9ICtfLCByZXNjYWxlKCkpIDogcGFkZGluZ091dGVyO1xuICB9O1xuXG4gIHNjYWxlLmFsaWduID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGFsaWduID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgXykpLCByZXNjYWxlKCkpIDogYWxpZ247XG4gIH07XG5cbiAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBiYW5kKGRvbWFpbigpLCBbcjAsIHIxXSlcbiAgICAgICAgLnJvdW5kKHJvdW5kKVxuICAgICAgICAucGFkZGluZ0lubmVyKHBhZGRpbmdJbm5lcilcbiAgICAgICAgLnBhZGRpbmdPdXRlcihwYWRkaW5nT3V0ZXIpXG4gICAgICAgIC5hbGlnbihhbGlnbik7XG4gIH07XG5cbiAgcmV0dXJuIGluaXRSYW5nZS5hcHBseShyZXNjYWxlKCksIGFyZ3VtZW50cyk7XG59XG5cbmZ1bmN0aW9uIHBvaW50aXNoKHNjYWxlKSB7XG4gIHZhciBjb3B5ID0gc2NhbGUuY29weTtcblxuICBzY2FsZS5wYWRkaW5nID0gc2NhbGUucGFkZGluZ091dGVyO1xuICBkZWxldGUgc2NhbGUucGFkZGluZ0lubmVyO1xuICBkZWxldGUgc2NhbGUucGFkZGluZ091dGVyO1xuXG4gIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcG9pbnRpc2goY29weSgpKTtcbiAgfTtcblxuICByZXR1cm4gc2NhbGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb2ludCgpIHtcbiAgcmV0dXJuIHBvaW50aXNoKGJhbmQuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5wYWRkaW5nSW5uZXIoMSkpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbnN0cnVjdG9yLCBmYWN0b3J5LCBwcm90b3R5cGUpIHtcbiAgY29uc3RydWN0b3IucHJvdG90eXBlID0gZmFjdG9yeS5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gIHByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKHBhcmVudCwgZGVmaW5pdGlvbikge1xuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcbiAgZm9yICh2YXIga2V5IGluIGRlZmluaXRpb24pIHByb3RvdHlwZVtrZXldID0gZGVmaW5pdGlvbltrZXldO1xuICByZXR1cm4gcHJvdG90eXBlO1xufVxuIiwgImltcG9ydCBkZWZpbmUsIHtleHRlbmR9IGZyb20gXCIuL2RlZmluZS5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gQ29sb3IoKSB7fVxuXG5leHBvcnQgdmFyIGRhcmtlciA9IDAuNztcbmV4cG9ydCB2YXIgYnJpZ2h0ZXIgPSAxIC8gZGFya2VyO1xuXG52YXIgcmVJID0gXCJcXFxccyooWystXT9cXFxcZCspXFxcXHMqXCIsXG4gICAgcmVOID0gXCJcXFxccyooWystXT8oPzpcXFxcZCpcXFxcLik/XFxcXGQrKD86W2VFXVsrLV0/XFxcXGQrKT8pXFxcXHMqXCIsXG4gICAgcmVQID0gXCJcXFxccyooWystXT8oPzpcXFxcZCpcXFxcLik/XFxcXGQrKD86W2VFXVsrLV0/XFxcXGQrKT8pJVxcXFxzKlwiLFxuICAgIHJlSGV4ID0gL14jKFswLTlhLWZdezMsOH0pJC8sXG4gICAgcmVSZ2JJbnRlZ2VyID0gbmV3IFJlZ0V4cChgXnJnYlxcXFwoJHtyZUl9LCR7cmVJfSwke3JlSX1cXFxcKSRgKSxcbiAgICByZVJnYlBlcmNlbnQgPSBuZXcgUmVnRXhwKGBecmdiXFxcXCgke3JlUH0sJHtyZVB9LCR7cmVQfVxcXFwpJGApLFxuICAgIHJlUmdiYUludGVnZXIgPSBuZXcgUmVnRXhwKGBecmdiYVxcXFwoJHtyZUl9LCR7cmVJfSwke3JlSX0sJHtyZU59XFxcXCkkYCksXG4gICAgcmVSZ2JhUGVyY2VudCA9IG5ldyBSZWdFeHAoYF5yZ2JhXFxcXCgke3JlUH0sJHtyZVB9LCR7cmVQfSwke3JlTn1cXFxcKSRgKSxcbiAgICByZUhzbFBlcmNlbnQgPSBuZXcgUmVnRXhwKGBeaHNsXFxcXCgke3JlTn0sJHtyZVB9LCR7cmVQfVxcXFwpJGApLFxuICAgIHJlSHNsYVBlcmNlbnQgPSBuZXcgUmVnRXhwKGBeaHNsYVxcXFwoJHtyZU59LCR7cmVQfSwke3JlUH0sJHtyZU59XFxcXCkkYCk7XG5cbnZhciBuYW1lZCA9IHtcbiAgYWxpY2VibHVlOiAweGYwZjhmZixcbiAgYW50aXF1ZXdoaXRlOiAweGZhZWJkNyxcbiAgYXF1YTogMHgwMGZmZmYsXG4gIGFxdWFtYXJpbmU6IDB4N2ZmZmQ0LFxuICBhenVyZTogMHhmMGZmZmYsXG4gIGJlaWdlOiAweGY1ZjVkYyxcbiAgYmlzcXVlOiAweGZmZTRjNCxcbiAgYmxhY2s6IDB4MDAwMDAwLFxuICBibGFuY2hlZGFsbW9uZDogMHhmZmViY2QsXG4gIGJsdWU6IDB4MDAwMGZmLFxuICBibHVldmlvbGV0OiAweDhhMmJlMixcbiAgYnJvd246IDB4YTUyYTJhLFxuICBidXJseXdvb2Q6IDB4ZGViODg3LFxuICBjYWRldGJsdWU6IDB4NWY5ZWEwLFxuICBjaGFydHJldXNlOiAweDdmZmYwMCxcbiAgY2hvY29sYXRlOiAweGQyNjkxZSxcbiAgY29yYWw6IDB4ZmY3ZjUwLFxuICBjb3JuZmxvd2VyYmx1ZTogMHg2NDk1ZWQsXG4gIGNvcm5zaWxrOiAweGZmZjhkYyxcbiAgY3JpbXNvbjogMHhkYzE0M2MsXG4gIGN5YW46IDB4MDBmZmZmLFxuICBkYXJrYmx1ZTogMHgwMDAwOGIsXG4gIGRhcmtjeWFuOiAweDAwOGI4YixcbiAgZGFya2dvbGRlbnJvZDogMHhiODg2MGIsXG4gIGRhcmtncmF5OiAweGE5YTlhOSxcbiAgZGFya2dyZWVuOiAweDAwNjQwMCxcbiAgZGFya2dyZXk6IDB4YTlhOWE5LFxuICBkYXJra2hha2k6IDB4YmRiNzZiLFxuICBkYXJrbWFnZW50YTogMHg4YjAwOGIsXG4gIGRhcmtvbGl2ZWdyZWVuOiAweDU1NmIyZixcbiAgZGFya29yYW5nZTogMHhmZjhjMDAsXG4gIGRhcmtvcmNoaWQ6IDB4OTkzMmNjLFxuICBkYXJrcmVkOiAweDhiMDAwMCxcbiAgZGFya3NhbG1vbjogMHhlOTk2N2EsXG4gIGRhcmtzZWFncmVlbjogMHg4ZmJjOGYsXG4gIGRhcmtzbGF0ZWJsdWU6IDB4NDgzZDhiLFxuICBkYXJrc2xhdGVncmF5OiAweDJmNGY0ZixcbiAgZGFya3NsYXRlZ3JleTogMHgyZjRmNGYsXG4gIGRhcmt0dXJxdW9pc2U6IDB4MDBjZWQxLFxuICBkYXJrdmlvbGV0OiAweDk0MDBkMyxcbiAgZGVlcHBpbms6IDB4ZmYxNDkzLFxuICBkZWVwc2t5Ymx1ZTogMHgwMGJmZmYsXG4gIGRpbWdyYXk6IDB4Njk2OTY5LFxuICBkaW1ncmV5OiAweDY5Njk2OSxcbiAgZG9kZ2VyYmx1ZTogMHgxZTkwZmYsXG4gIGZpcmVicmljazogMHhiMjIyMjIsXG4gIGZsb3JhbHdoaXRlOiAweGZmZmFmMCxcbiAgZm9yZXN0Z3JlZW46IDB4MjI4YjIyLFxuICBmdWNoc2lhOiAweGZmMDBmZixcbiAgZ2FpbnNib3JvOiAweGRjZGNkYyxcbiAgZ2hvc3R3aGl0ZTogMHhmOGY4ZmYsXG4gIGdvbGQ6IDB4ZmZkNzAwLFxuICBnb2xkZW5yb2Q6IDB4ZGFhNTIwLFxuICBncmF5OiAweDgwODA4MCxcbiAgZ3JlZW46IDB4MDA4MDAwLFxuICBncmVlbnllbGxvdzogMHhhZGZmMmYsXG4gIGdyZXk6IDB4ODA4MDgwLFxuICBob25leWRldzogMHhmMGZmZjAsXG4gIGhvdHBpbms6IDB4ZmY2OWI0LFxuICBpbmRpYW5yZWQ6IDB4Y2Q1YzVjLFxuICBpbmRpZ286IDB4NGIwMDgyLFxuICBpdm9yeTogMHhmZmZmZjAsXG4gIGtoYWtpOiAweGYwZTY4YyxcbiAgbGF2ZW5kZXI6IDB4ZTZlNmZhLFxuICBsYXZlbmRlcmJsdXNoOiAweGZmZjBmNSxcbiAgbGF3bmdyZWVuOiAweDdjZmMwMCxcbiAgbGVtb25jaGlmZm9uOiAweGZmZmFjZCxcbiAgbGlnaHRibHVlOiAweGFkZDhlNixcbiAgbGlnaHRjb3JhbDogMHhmMDgwODAsXG4gIGxpZ2h0Y3lhbjogMHhlMGZmZmYsXG4gIGxpZ2h0Z29sZGVucm9keWVsbG93OiAweGZhZmFkMixcbiAgbGlnaHRncmF5OiAweGQzZDNkMyxcbiAgbGlnaHRncmVlbjogMHg5MGVlOTAsXG4gIGxpZ2h0Z3JleTogMHhkM2QzZDMsXG4gIGxpZ2h0cGluazogMHhmZmI2YzEsXG4gIGxpZ2h0c2FsbW9uOiAweGZmYTA3YSxcbiAgbGlnaHRzZWFncmVlbjogMHgyMGIyYWEsXG4gIGxpZ2h0c2t5Ymx1ZTogMHg4N2NlZmEsXG4gIGxpZ2h0c2xhdGVncmF5OiAweDc3ODg5OSxcbiAgbGlnaHRzbGF0ZWdyZXk6IDB4Nzc4ODk5LFxuICBsaWdodHN0ZWVsYmx1ZTogMHhiMGM0ZGUsXG4gIGxpZ2h0eWVsbG93OiAweGZmZmZlMCxcbiAgbGltZTogMHgwMGZmMDAsXG4gIGxpbWVncmVlbjogMHgzMmNkMzIsXG4gIGxpbmVuOiAweGZhZjBlNixcbiAgbWFnZW50YTogMHhmZjAwZmYsXG4gIG1hcm9vbjogMHg4MDAwMDAsXG4gIG1lZGl1bWFxdWFtYXJpbmU6IDB4NjZjZGFhLFxuICBtZWRpdW1ibHVlOiAweDAwMDBjZCxcbiAgbWVkaXVtb3JjaGlkOiAweGJhNTVkMyxcbiAgbWVkaXVtcHVycGxlOiAweDkzNzBkYixcbiAgbWVkaXVtc2VhZ3JlZW46IDB4M2NiMzcxLFxuICBtZWRpdW1zbGF0ZWJsdWU6IDB4N2I2OGVlLFxuICBtZWRpdW1zcHJpbmdncmVlbjogMHgwMGZhOWEsXG4gIG1lZGl1bXR1cnF1b2lzZTogMHg0OGQxY2MsXG4gIG1lZGl1bXZpb2xldHJlZDogMHhjNzE1ODUsXG4gIG1pZG5pZ2h0Ymx1ZTogMHgxOTE5NzAsXG4gIG1pbnRjcmVhbTogMHhmNWZmZmEsXG4gIG1pc3R5cm9zZTogMHhmZmU0ZTEsXG4gIG1vY2Nhc2luOiAweGZmZTRiNSxcbiAgbmF2YWpvd2hpdGU6IDB4ZmZkZWFkLFxuICBuYXZ5OiAweDAwMDA4MCxcbiAgb2xkbGFjZTogMHhmZGY1ZTYsXG4gIG9saXZlOiAweDgwODAwMCxcbiAgb2xpdmVkcmFiOiAweDZiOGUyMyxcbiAgb3JhbmdlOiAweGZmYTUwMCxcbiAgb3JhbmdlcmVkOiAweGZmNDUwMCxcbiAgb3JjaGlkOiAweGRhNzBkNixcbiAgcGFsZWdvbGRlbnJvZDogMHhlZWU4YWEsXG4gIHBhbGVncmVlbjogMHg5OGZiOTgsXG4gIHBhbGV0dXJxdW9pc2U6IDB4YWZlZWVlLFxuICBwYWxldmlvbGV0cmVkOiAweGRiNzA5MyxcbiAgcGFwYXlhd2hpcDogMHhmZmVmZDUsXG4gIHBlYWNocHVmZjogMHhmZmRhYjksXG4gIHBlcnU6IDB4Y2Q4NTNmLFxuICBwaW5rOiAweGZmYzBjYixcbiAgcGx1bTogMHhkZGEwZGQsXG4gIHBvd2RlcmJsdWU6IDB4YjBlMGU2LFxuICBwdXJwbGU6IDB4ODAwMDgwLFxuICByZWJlY2NhcHVycGxlOiAweDY2MzM5OSxcbiAgcmVkOiAweGZmMDAwMCxcbiAgcm9zeWJyb3duOiAweGJjOGY4ZixcbiAgcm95YWxibHVlOiAweDQxNjllMSxcbiAgc2FkZGxlYnJvd246IDB4OGI0NTEzLFxuICBzYWxtb246IDB4ZmE4MDcyLFxuICBzYW5keWJyb3duOiAweGY0YTQ2MCxcbiAgc2VhZ3JlZW46IDB4MmU4YjU3LFxuICBzZWFzaGVsbDogMHhmZmY1ZWUsXG4gIHNpZW5uYTogMHhhMDUyMmQsXG4gIHNpbHZlcjogMHhjMGMwYzAsXG4gIHNreWJsdWU6IDB4ODdjZWViLFxuICBzbGF0ZWJsdWU6IDB4NmE1YWNkLFxuICBzbGF0ZWdyYXk6IDB4NzA4MDkwLFxuICBzbGF0ZWdyZXk6IDB4NzA4MDkwLFxuICBzbm93OiAweGZmZmFmYSxcbiAgc3ByaW5nZ3JlZW46IDB4MDBmZjdmLFxuICBzdGVlbGJsdWU6IDB4NDY4MmI0LFxuICB0YW46IDB4ZDJiNDhjLFxuICB0ZWFsOiAweDAwODA4MCxcbiAgdGhpc3RsZTogMHhkOGJmZDgsXG4gIHRvbWF0bzogMHhmZjYzNDcsXG4gIHR1cnF1b2lzZTogMHg0MGUwZDAsXG4gIHZpb2xldDogMHhlZTgyZWUsXG4gIHdoZWF0OiAweGY1ZGViMyxcbiAgd2hpdGU6IDB4ZmZmZmZmLFxuICB3aGl0ZXNtb2tlOiAweGY1ZjVmNSxcbiAgeWVsbG93OiAweGZmZmYwMCxcbiAgeWVsbG93Z3JlZW46IDB4OWFjZDMyXG59O1xuXG5kZWZpbmUoQ29sb3IsIGNvbG9yLCB7XG4gIGNvcHkoY2hhbm5lbHMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgdGhpcy5jb25zdHJ1Y3RvciwgdGhpcywgY2hhbm5lbHMpO1xuICB9LFxuICBkaXNwbGF5YWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZ2IoKS5kaXNwbGF5YWJsZSgpO1xuICB9LFxuICBoZXg6IGNvbG9yX2Zvcm1hdEhleCwgLy8gRGVwcmVjYXRlZCEgVXNlIGNvbG9yLmZvcm1hdEhleC5cbiAgZm9ybWF0SGV4OiBjb2xvcl9mb3JtYXRIZXgsXG4gIGZvcm1hdEhleDg6IGNvbG9yX2Zvcm1hdEhleDgsXG4gIGZvcm1hdEhzbDogY29sb3JfZm9ybWF0SHNsLFxuICBmb3JtYXRSZ2I6IGNvbG9yX2Zvcm1hdFJnYixcbiAgdG9TdHJpbmc6IGNvbG9yX2Zvcm1hdFJnYlxufSk7XG5cbmZ1bmN0aW9uIGNvbG9yX2Zvcm1hdEhleCgpIHtcbiAgcmV0dXJuIHRoaXMucmdiKCkuZm9ybWF0SGV4KCk7XG59XG5cbmZ1bmN0aW9uIGNvbG9yX2Zvcm1hdEhleDgoKSB7XG4gIHJldHVybiB0aGlzLnJnYigpLmZvcm1hdEhleDgoKTtcbn1cblxuZnVuY3Rpb24gY29sb3JfZm9ybWF0SHNsKCkge1xuICByZXR1cm4gaHNsQ29udmVydCh0aGlzKS5mb3JtYXRIc2woKTtcbn1cblxuZnVuY3Rpb24gY29sb3JfZm9ybWF0UmdiKCkge1xuICByZXR1cm4gdGhpcy5yZ2IoKS5mb3JtYXRSZ2IoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29sb3IoZm9ybWF0KSB7XG4gIHZhciBtLCBsO1xuICBmb3JtYXQgPSAoZm9ybWF0ICsgXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiAobSA9IHJlSGV4LmV4ZWMoZm9ybWF0KSkgPyAobCA9IG1bMV0ubGVuZ3RoLCBtID0gcGFyc2VJbnQobVsxXSwgMTYpLCBsID09PSA2ID8gcmdibihtKSAvLyAjZmYwMDAwXG4gICAgICA6IGwgPT09IDMgPyBuZXcgUmdiKChtID4+IDggJiAweGYpIHwgKG0gPj4gNCAmIDB4ZjApLCAobSA+PiA0ICYgMHhmKSB8IChtICYgMHhmMCksICgobSAmIDB4ZikgPDwgNCkgfCAobSAmIDB4ZiksIDEpIC8vICNmMDBcbiAgICAgIDogbCA9PT0gOCA/IHJnYmEobSA+PiAyNCAmIDB4ZmYsIG0gPj4gMTYgJiAweGZmLCBtID4+IDggJiAweGZmLCAobSAmIDB4ZmYpIC8gMHhmZikgLy8gI2ZmMDAwMDAwXG4gICAgICA6IGwgPT09IDQgPyByZ2JhKChtID4+IDEyICYgMHhmKSB8IChtID4+IDggJiAweGYwKSwgKG0gPj4gOCAmIDB4ZikgfCAobSA+PiA0ICYgMHhmMCksIChtID4+IDQgJiAweGYpIHwgKG0gJiAweGYwKSwgKCgobSAmIDB4ZikgPDwgNCkgfCAobSAmIDB4ZikpIC8gMHhmZikgLy8gI2YwMDBcbiAgICAgIDogbnVsbCkgLy8gaW52YWxpZCBoZXhcbiAgICAgIDogKG0gPSByZVJnYkludGVnZXIuZXhlYyhmb3JtYXQpKSA/IG5ldyBSZ2IobVsxXSwgbVsyXSwgbVszXSwgMSkgLy8gcmdiKDI1NSwgMCwgMClcbiAgICAgIDogKG0gPSByZVJnYlBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IG5ldyBSZ2IobVsxXSAqIDI1NSAvIDEwMCwgbVsyXSAqIDI1NSAvIDEwMCwgbVszXSAqIDI1NSAvIDEwMCwgMSkgLy8gcmdiKDEwMCUsIDAlLCAwJSlcbiAgICAgIDogKG0gPSByZVJnYmFJbnRlZ2VyLmV4ZWMoZm9ybWF0KSkgPyByZ2JhKG1bMV0sIG1bMl0sIG1bM10sIG1bNF0pIC8vIHJnYmEoMjU1LCAwLCAwLCAxKVxuICAgICAgOiAobSA9IHJlUmdiYVBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IHJnYmEobVsxXSAqIDI1NSAvIDEwMCwgbVsyXSAqIDI1NSAvIDEwMCwgbVszXSAqIDI1NSAvIDEwMCwgbVs0XSkgLy8gcmdiKDEwMCUsIDAlLCAwJSwgMSlcbiAgICAgIDogKG0gPSByZUhzbFBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IGhzbGEobVsxXSwgbVsyXSAvIDEwMCwgbVszXSAvIDEwMCwgMSkgLy8gaHNsKDEyMCwgNTAlLCA1MCUpXG4gICAgICA6IChtID0gcmVIc2xhUGVyY2VudC5leGVjKGZvcm1hdCkpID8gaHNsYShtWzFdLCBtWzJdIC8gMTAwLCBtWzNdIC8gMTAwLCBtWzRdKSAvLyBoc2xhKDEyMCwgNTAlLCA1MCUsIDEpXG4gICAgICA6IG5hbWVkLmhhc093blByb3BlcnR5KGZvcm1hdCkgPyByZ2JuKG5hbWVkW2Zvcm1hdF0pIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gICAgICA6IGZvcm1hdCA9PT0gXCJ0cmFuc3BhcmVudFwiID8gbmV3IFJnYihOYU4sIE5hTiwgTmFOLCAwKVxuICAgICAgOiBudWxsO1xufVxuXG5mdW5jdGlvbiByZ2JuKG4pIHtcbiAgcmV0dXJuIG5ldyBSZ2IobiA+PiAxNiAmIDB4ZmYsIG4gPj4gOCAmIDB4ZmYsIG4gJiAweGZmLCAxKTtcbn1cblxuZnVuY3Rpb24gcmdiYShyLCBnLCBiLCBhKSB7XG4gIGlmIChhIDw9IDApIHIgPSBnID0gYiA9IE5hTjtcbiAgcmV0dXJuIG5ldyBSZ2IociwgZywgYiwgYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZ2JDb252ZXJ0KG8pIHtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIENvbG9yKSkgbyA9IGNvbG9yKG8pO1xuICBpZiAoIW8pIHJldHVybiBuZXcgUmdiO1xuICBvID0gby5yZ2IoKTtcbiAgcmV0dXJuIG5ldyBSZ2Ioby5yLCBvLmcsIG8uYiwgby5vcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJnYihyLCBnLCBiLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gcmdiQ29udmVydChyKSA6IG5ldyBSZ2IociwgZywgYiwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmdiKHIsIGcsIGIsIG9wYWNpdHkpIHtcbiAgdGhpcy5yID0gK3I7XG4gIHRoaXMuZyA9ICtnO1xuICB0aGlzLmIgPSArYjtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShSZ2IsIHJnYiwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBSZ2IodGhpcy5yICogaywgdGhpcy5nICogaywgdGhpcy5iICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IFJnYih0aGlzLnIgKiBrLCB0aGlzLmcgKiBrLCB0aGlzLmIgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICByZ2IoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGNsYW1wKCkge1xuICAgIHJldHVybiBuZXcgUmdiKGNsYW1waSh0aGlzLnIpLCBjbGFtcGkodGhpcy5nKSwgY2xhbXBpKHRoaXMuYiksIGNsYW1wYSh0aGlzLm9wYWNpdHkpKTtcbiAgfSxcbiAgZGlzcGxheWFibGUoKSB7XG4gICAgcmV0dXJuICgtMC41IDw9IHRoaXMuciAmJiB0aGlzLnIgPCAyNTUuNSlcbiAgICAgICAgJiYgKC0wLjUgPD0gdGhpcy5nICYmIHRoaXMuZyA8IDI1NS41KVxuICAgICAgICAmJiAoLTAuNSA8PSB0aGlzLmIgJiYgdGhpcy5iIDwgMjU1LjUpXG4gICAgICAgICYmICgwIDw9IHRoaXMub3BhY2l0eSAmJiB0aGlzLm9wYWNpdHkgPD0gMSk7XG4gIH0sXG4gIGhleDogcmdiX2Zvcm1hdEhleCwgLy8gRGVwcmVjYXRlZCEgVXNlIGNvbG9yLmZvcm1hdEhleC5cbiAgZm9ybWF0SGV4OiByZ2JfZm9ybWF0SGV4LFxuICBmb3JtYXRIZXg4OiByZ2JfZm9ybWF0SGV4OCxcbiAgZm9ybWF0UmdiOiByZ2JfZm9ybWF0UmdiLFxuICB0b1N0cmluZzogcmdiX2Zvcm1hdFJnYlxufSkpO1xuXG5mdW5jdGlvbiByZ2JfZm9ybWF0SGV4KCkge1xuICByZXR1cm4gYCMke2hleCh0aGlzLnIpfSR7aGV4KHRoaXMuZyl9JHtoZXgodGhpcy5iKX1gO1xufVxuXG5mdW5jdGlvbiByZ2JfZm9ybWF0SGV4OCgpIHtcbiAgcmV0dXJuIGAjJHtoZXgodGhpcy5yKX0ke2hleCh0aGlzLmcpfSR7aGV4KHRoaXMuYil9JHtoZXgoKGlzTmFOKHRoaXMub3BhY2l0eSkgPyAxIDogdGhpcy5vcGFjaXR5KSAqIDI1NSl9YDtcbn1cblxuZnVuY3Rpb24gcmdiX2Zvcm1hdFJnYigpIHtcbiAgY29uc3QgYSA9IGNsYW1wYSh0aGlzLm9wYWNpdHkpO1xuICByZXR1cm4gYCR7YSA9PT0gMSA/IFwicmdiKFwiIDogXCJyZ2JhKFwifSR7Y2xhbXBpKHRoaXMucil9LCAke2NsYW1waSh0aGlzLmcpfSwgJHtjbGFtcGkodGhpcy5iKX0ke2EgPT09IDEgPyBcIilcIiA6IGAsICR7YX0pYH1gO1xufVxuXG5mdW5jdGlvbiBjbGFtcGEob3BhY2l0eSkge1xuICByZXR1cm4gaXNOYU4ob3BhY2l0eSkgPyAxIDogTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgb3BhY2l0eSkpO1xufVxuXG5mdW5jdGlvbiBjbGFtcGkodmFsdWUpIHtcbiAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZCh2YWx1ZSkgfHwgMCkpO1xufVxuXG5mdW5jdGlvbiBoZXgodmFsdWUpIHtcbiAgdmFsdWUgPSBjbGFtcGkodmFsdWUpO1xuICByZXR1cm4gKHZhbHVlIDwgMTYgPyBcIjBcIiA6IFwiXCIpICsgdmFsdWUudG9TdHJpbmcoMTYpO1xufVxuXG5mdW5jdGlvbiBoc2xhKGgsIHMsIGwsIGEpIHtcbiAgaWYgKGEgPD0gMCkgaCA9IHMgPSBsID0gTmFOO1xuICBlbHNlIGlmIChsIDw9IDAgfHwgbCA+PSAxKSBoID0gcyA9IE5hTjtcbiAgZWxzZSBpZiAocyA8PSAwKSBoID0gTmFOO1xuICByZXR1cm4gbmV3IEhzbChoLCBzLCBsLCBhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhzbENvbnZlcnQobykge1xuICBpZiAobyBpbnN0YW5jZW9mIEhzbCkgcmV0dXJuIG5ldyBIc2woby5oLCBvLnMsIG8ubCwgby5vcGFjaXR5KTtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIENvbG9yKSkgbyA9IGNvbG9yKG8pO1xuICBpZiAoIW8pIHJldHVybiBuZXcgSHNsO1xuICBpZiAobyBpbnN0YW5jZW9mIEhzbCkgcmV0dXJuIG87XG4gIG8gPSBvLnJnYigpO1xuICB2YXIgciA9IG8uciAvIDI1NSxcbiAgICAgIGcgPSBvLmcgLyAyNTUsXG4gICAgICBiID0gby5iIC8gMjU1LFxuICAgICAgbWluID0gTWF0aC5taW4ociwgZywgYiksXG4gICAgICBtYXggPSBNYXRoLm1heChyLCBnLCBiKSxcbiAgICAgIGggPSBOYU4sXG4gICAgICBzID0gbWF4IC0gbWluLFxuICAgICAgbCA9IChtYXggKyBtaW4pIC8gMjtcbiAgaWYgKHMpIHtcbiAgICBpZiAociA9PT0gbWF4KSBoID0gKGcgLSBiKSAvIHMgKyAoZyA8IGIpICogNjtcbiAgICBlbHNlIGlmIChnID09PSBtYXgpIGggPSAoYiAtIHIpIC8gcyArIDI7XG4gICAgZWxzZSBoID0gKHIgLSBnKSAvIHMgKyA0O1xuICAgIHMgLz0gbCA8IDAuNSA/IG1heCArIG1pbiA6IDIgLSBtYXggLSBtaW47XG4gICAgaCAqPSA2MDtcbiAgfSBlbHNlIHtcbiAgICBzID0gbCA+IDAgJiYgbCA8IDEgPyAwIDogaDtcbiAgfVxuICByZXR1cm4gbmV3IEhzbChoLCBzLCBsLCBvLm9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaHNsKGgsIHMsIGwsIG9wYWNpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBoc2xDb252ZXJ0KGgpIDogbmV3IEhzbChoLCBzLCBsLCBvcGFjaXR5ID09IG51bGwgPyAxIDogb3BhY2l0eSk7XG59XG5cbmZ1bmN0aW9uIEhzbChoLCBzLCBsLCBvcGFjaXR5KSB7XG4gIHRoaXMuaCA9ICtoO1xuICB0aGlzLnMgPSArcztcbiAgdGhpcy5sID0gK2w7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoSHNsLCBoc2wsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgSHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICBkYXJrZXIoaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgSHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICByZ2IoKSB7XG4gICAgdmFyIGggPSB0aGlzLmggJSAzNjAgKyAodGhpcy5oIDwgMCkgKiAzNjAsXG4gICAgICAgIHMgPSBpc05hTihoKSB8fCBpc05hTih0aGlzLnMpID8gMCA6IHRoaXMucyxcbiAgICAgICAgbCA9IHRoaXMubCxcbiAgICAgICAgbTIgPSBsICsgKGwgPCAwLjUgPyBsIDogMSAtIGwpICogcyxcbiAgICAgICAgbTEgPSAyICogbCAtIG0yO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgaHNsMnJnYihoID49IDI0MCA/IGggLSAyNDAgOiBoICsgMTIwLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoIDwgMTIwID8gaCArIDI0MCA6IGggLSAxMjAsIG0xLCBtMiksXG4gICAgICB0aGlzLm9wYWNpdHlcbiAgICApO1xuICB9LFxuICBjbGFtcCgpIHtcbiAgICByZXR1cm4gbmV3IEhzbChjbGFtcGgodGhpcy5oKSwgY2xhbXB0KHRoaXMucyksIGNsYW1wdCh0aGlzLmwpLCBjbGFtcGEodGhpcy5vcGFjaXR5KSk7XG4gIH0sXG4gIGRpc3BsYXlhYmxlKCkge1xuICAgIHJldHVybiAoMCA8PSB0aGlzLnMgJiYgdGhpcy5zIDw9IDEgfHwgaXNOYU4odGhpcy5zKSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5sICYmIHRoaXMubCA8PSAxKVxuICAgICAgICAmJiAoMCA8PSB0aGlzLm9wYWNpdHkgJiYgdGhpcy5vcGFjaXR5IDw9IDEpO1xuICB9LFxuICBmb3JtYXRIc2woKSB7XG4gICAgY29uc3QgYSA9IGNsYW1wYSh0aGlzLm9wYWNpdHkpO1xuICAgIHJldHVybiBgJHthID09PSAxID8gXCJoc2woXCIgOiBcImhzbGEoXCJ9JHtjbGFtcGgodGhpcy5oKX0sICR7Y2xhbXB0KHRoaXMucykgKiAxMDB9JSwgJHtjbGFtcHQodGhpcy5sKSAqIDEwMH0lJHthID09PSAxID8gXCIpXCIgOiBgLCAke2F9KWB9YDtcbiAgfVxufSkpO1xuXG5mdW5jdGlvbiBjbGFtcGgodmFsdWUpIHtcbiAgdmFsdWUgPSAodmFsdWUgfHwgMCkgJSAzNjA7XG4gIHJldHVybiB2YWx1ZSA8IDAgPyB2YWx1ZSArIDM2MCA6IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBjbGFtcHQodmFsdWUpIHtcbiAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHZhbHVlIHx8IDApKTtcbn1cblxuLyogRnJvbSBGdkQgMTMuMzcsIENTUyBDb2xvciBNb2R1bGUgTGV2ZWwgMyAqL1xuZnVuY3Rpb24gaHNsMnJnYihoLCBtMSwgbTIpIHtcbiAgcmV0dXJuIChoIDwgNjAgPyBtMSArIChtMiAtIG0xKSAqIGggLyA2MFxuICAgICAgOiBoIDwgMTgwID8gbTJcbiAgICAgIDogaCA8IDI0MCA/IG0xICsgKG0yIC0gbTEpICogKDI0MCAtIGgpIC8gNjBcbiAgICAgIDogbTEpICogMjU1O1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBiYXNpcyh0MSwgdjAsIHYxLCB2MiwgdjMpIHtcbiAgdmFyIHQyID0gdDEgKiB0MSwgdDMgPSB0MiAqIHQxO1xuICByZXR1cm4gKCgxIC0gMyAqIHQxICsgMyAqIHQyIC0gdDMpICogdjBcbiAgICAgICsgKDQgLSA2ICogdDIgKyAzICogdDMpICogdjFcbiAgICAgICsgKDEgKyAzICogdDEgKyAzICogdDIgLSAzICogdDMpICogdjJcbiAgICAgICsgdDMgKiB2MykgLyA2O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgdmFyIG4gPSB2YWx1ZXMubGVuZ3RoIC0gMTtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgaSA9IHQgPD0gMCA/ICh0ID0gMCkgOiB0ID49IDEgPyAodCA9IDEsIG4gLSAxKSA6IE1hdGguZmxvb3IodCAqIG4pLFxuICAgICAgICB2MSA9IHZhbHVlc1tpXSxcbiAgICAgICAgdjIgPSB2YWx1ZXNbaSArIDFdLFxuICAgICAgICB2MCA9IGkgPiAwID8gdmFsdWVzW2kgLSAxXSA6IDIgKiB2MSAtIHYyLFxuICAgICAgICB2MyA9IGkgPCBuIC0gMSA/IHZhbHVlc1tpICsgMl0gOiAyICogdjIgLSB2MTtcbiAgICByZXR1cm4gYmFzaXMoKHQgLSBpIC8gbikgKiBuLCB2MCwgdjEsIHYyLCB2Myk7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtiYXNpc30gZnJvbSBcIi4vYmFzaXMuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWVzKSB7XG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aDtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgaSA9IE1hdGguZmxvb3IoKCh0ICU9IDEpIDwgMCA/ICsrdCA6IHQpICogbiksXG4gICAgICAgIHYwID0gdmFsdWVzWyhpICsgbiAtIDEpICUgbl0sXG4gICAgICAgIHYxID0gdmFsdWVzW2kgJSBuXSxcbiAgICAgICAgdjIgPSB2YWx1ZXNbKGkgKyAxKSAlIG5dLFxuICAgICAgICB2MyA9IHZhbHVlc1soaSArIDIpICUgbl07XG4gICAgcmV0dXJuIGJhc2lzKCh0IC0gaSAvIG4pICogbiwgdjAsIHYxLCB2MiwgdjMpO1xuICB9O1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IHggPT4gKCkgPT4geDtcbiIsICJpbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnQuanNcIjtcblxuZnVuY3Rpb24gbGluZWFyKGEsIGQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gYSArIHQgKiBkO1xuICB9O1xufVxuXG5mdW5jdGlvbiBleHBvbmVudGlhbChhLCBiLCB5KSB7XG4gIHJldHVybiBhID0gTWF0aC5wb3coYSwgeSksIGIgPSBNYXRoLnBvdyhiLCB5KSAtIGEsIHkgPSAxIC8geSwgZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBNYXRoLnBvdyhhICsgdCAqIGIsIHkpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaHVlKGEsIGIpIHtcbiAgdmFyIGQgPSBiIC0gYTtcbiAgcmV0dXJuIGQgPyBsaW5lYXIoYSwgZCA+IDE4MCB8fCBkIDwgLTE4MCA/IGQgLSAzNjAgKiBNYXRoLnJvdW5kKGQgLyAzNjApIDogZCkgOiBjb25zdGFudChpc05hTihhKSA/IGIgOiBhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdhbW1hKHkpIHtcbiAgcmV0dXJuICh5ID0gK3kpID09PSAxID8gbm9nYW1tYSA6IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYiAtIGEgPyBleHBvbmVudGlhbChhLCBiLCB5KSA6IGNvbnN0YW50KGlzTmFOKGEpID8gYiA6IGEpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBub2dhbW1hKGEsIGIpIHtcbiAgdmFyIGQgPSBiIC0gYTtcbiAgcmV0dXJuIGQgPyBsaW5lYXIoYSwgZCkgOiBjb25zdGFudChpc05hTihhKSA/IGIgOiBhKTtcbn1cbiIsICJpbXBvcnQge3JnYiBhcyBjb2xvclJnYn0gZnJvbSBcImQzLWNvbG9yXCI7XG5pbXBvcnQgYmFzaXMgZnJvbSBcIi4vYmFzaXMuanNcIjtcbmltcG9ydCBiYXNpc0Nsb3NlZCBmcm9tIFwiLi9iYXNpc0Nsb3NlZC5qc1wiO1xuaW1wb3J0IG5vZ2FtbWEsIHtnYW1tYX0gZnJvbSBcIi4vY29sb3IuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIHJnYkdhbW1hKHkpIHtcbiAgdmFyIGNvbG9yID0gZ2FtbWEoeSk7XG5cbiAgZnVuY3Rpb24gcmdiKHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgciA9IGNvbG9yKChzdGFydCA9IGNvbG9yUmdiKHN0YXJ0KSkuciwgKGVuZCA9IGNvbG9yUmdiKGVuZCkpLnIpLFxuICAgICAgICBnID0gY29sb3Ioc3RhcnQuZywgZW5kLmcpLFxuICAgICAgICBiID0gY29sb3Ioc3RhcnQuYiwgZW5kLmIpLFxuICAgICAgICBvcGFjaXR5ID0gbm9nYW1tYShzdGFydC5vcGFjaXR5LCBlbmQub3BhY2l0eSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHN0YXJ0LnIgPSByKHQpO1xuICAgICAgc3RhcnQuZyA9IGcodCk7XG4gICAgICBzdGFydC5iID0gYih0KTtcbiAgICAgIHN0YXJ0Lm9wYWNpdHkgPSBvcGFjaXR5KHQpO1xuICAgICAgcmV0dXJuIHN0YXJ0ICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgcmdiLmdhbW1hID0gcmdiR2FtbWE7XG5cbiAgcmV0dXJuIHJnYjtcbn0pKDEpO1xuXG5mdW5jdGlvbiByZ2JTcGxpbmUoc3BsaW5lKSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xvcnMpIHtcbiAgICB2YXIgbiA9IGNvbG9ycy5sZW5ndGgsXG4gICAgICAgIHIgPSBuZXcgQXJyYXkobiksXG4gICAgICAgIGcgPSBuZXcgQXJyYXkobiksXG4gICAgICAgIGIgPSBuZXcgQXJyYXkobiksXG4gICAgICAgIGksIGNvbG9yO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGNvbG9yID0gY29sb3JSZ2IoY29sb3JzW2ldKTtcbiAgICAgIHJbaV0gPSBjb2xvci5yIHx8IDA7XG4gICAgICBnW2ldID0gY29sb3IuZyB8fCAwO1xuICAgICAgYltpXSA9IGNvbG9yLmIgfHwgMDtcbiAgICB9XG4gICAgciA9IHNwbGluZShyKTtcbiAgICBnID0gc3BsaW5lKGcpO1xuICAgIGIgPSBzcGxpbmUoYik7XG4gICAgY29sb3Iub3BhY2l0eSA9IDE7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGNvbG9yLnIgPSByKHQpO1xuICAgICAgY29sb3IuZyA9IGcodCk7XG4gICAgICBjb2xvci5iID0gYih0KTtcbiAgICAgIHJldHVybiBjb2xvciArIFwiXCI7XG4gICAgfTtcbiAgfTtcbn1cblxuZXhwb3J0IHZhciByZ2JCYXNpcyA9IHJnYlNwbGluZShiYXNpcyk7XG5leHBvcnQgdmFyIHJnYkJhc2lzQ2xvc2VkID0gcmdiU3BsaW5lKGJhc2lzQ2xvc2VkKTtcbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIGlmICghYikgYiA9IFtdO1xuICB2YXIgbiA9IGEgPyBNYXRoLm1pbihiLmxlbmd0aCwgYS5sZW5ndGgpIDogMCxcbiAgICAgIGMgPSBiLnNsaWNlKCksXG4gICAgICBpO1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIGNbaV0gPSBhW2ldICogKDEgLSB0KSArIGJbaV0gKiB0O1xuICAgIHJldHVybiBjO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXJBcnJheSh4KSB7XG4gIHJldHVybiBBcnJheUJ1ZmZlci5pc1ZpZXcoeCkgJiYgISh4IGluc3RhbmNlb2YgRGF0YVZpZXcpO1xufVxuIiwgImltcG9ydCB2YWx1ZSBmcm9tIFwiLi92YWx1ZS5qc1wiO1xuaW1wb3J0IG51bWJlckFycmF5LCB7aXNOdW1iZXJBcnJheX0gZnJvbSBcIi4vbnVtYmVyQXJyYXkuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gKGlzTnVtYmVyQXJyYXkoYikgPyBudW1iZXJBcnJheSA6IGdlbmVyaWNBcnJheSkoYSwgYik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmljQXJyYXkoYSwgYikge1xuICB2YXIgbmIgPSBiID8gYi5sZW5ndGggOiAwLFxuICAgICAgbmEgPSBhID8gTWF0aC5taW4obmIsIGEubGVuZ3RoKSA6IDAsXG4gICAgICB4ID0gbmV3IEFycmF5KG5hKSxcbiAgICAgIGMgPSBuZXcgQXJyYXkobmIpLFxuICAgICAgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgbmE7ICsraSkgeFtpXSA9IHZhbHVlKGFbaV0sIGJbaV0pO1xuICBmb3IgKDsgaSA8IG5iOyArK2kpIGNbaV0gPSBiW2ldO1xuXG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgZm9yIChpID0gMDsgaSA8IG5hOyArK2kpIGNbaV0gPSB4W2ldKHQpO1xuICAgIHJldHVybiBjO1xuICB9O1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZTtcbiAgcmV0dXJuIGEgPSArYSwgYiA9ICtiLCBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIGQuc2V0VGltZShhICogKDEgLSB0KSArIGIgKiB0KSwgZDtcbiAgfTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhID0gK2EsIGIgPSArYiwgZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBhICogKDEgLSB0KSArIGIgKiB0O1xuICB9O1xufVxuIiwgImltcG9ydCB2YWx1ZSBmcm9tIFwiLi92YWx1ZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciBpID0ge30sXG4gICAgICBjID0ge30sXG4gICAgICBrO1xuXG4gIGlmIChhID09PSBudWxsIHx8IHR5cGVvZiBhICE9PSBcIm9iamVjdFwiKSBhID0ge307XG4gIGlmIChiID09PSBudWxsIHx8IHR5cGVvZiBiICE9PSBcIm9iamVjdFwiKSBiID0ge307XG5cbiAgZm9yIChrIGluIGIpIHtcbiAgICBpZiAoayBpbiBhKSB7XG4gICAgICBpW2tdID0gdmFsdWUoYVtrXSwgYltrXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNba10gPSBiW2tdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgZm9yIChrIGluIGkpIGNba10gPSBpW2tdKHQpO1xuICAgIHJldHVybiBjO1xuICB9O1xufVxuIiwgImltcG9ydCBudW1iZXIgZnJvbSBcIi4vbnVtYmVyLmpzXCI7XG5cbnZhciByZUEgPSAvWy0rXT8oPzpcXGQrXFwuP1xcZCp8XFwuP1xcZCspKD86W2VFXVstK10/XFxkKyk/L2csXG4gICAgcmVCID0gbmV3IFJlZ0V4cChyZUEuc291cmNlLCBcImdcIik7XG5cbmZ1bmN0aW9uIHplcm8oYikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGI7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG9uZShiKSB7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIGIodCkgKyBcIlwiO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciBiaSA9IHJlQS5sYXN0SW5kZXggPSByZUIubGFzdEluZGV4ID0gMCwgLy8gc2NhbiBpbmRleCBmb3IgbmV4dCBudW1iZXIgaW4gYlxuICAgICAgYW0sIC8vIGN1cnJlbnQgbWF0Y2ggaW4gYVxuICAgICAgYm0sIC8vIGN1cnJlbnQgbWF0Y2ggaW4gYlxuICAgICAgYnMsIC8vIHN0cmluZyBwcmVjZWRpbmcgY3VycmVudCBudW1iZXIgaW4gYiwgaWYgYW55XG4gICAgICBpID0gLTEsIC8vIGluZGV4IGluIHNcbiAgICAgIHMgPSBbXSwgLy8gc3RyaW5nIGNvbnN0YW50cyBhbmQgcGxhY2Vob2xkZXJzXG4gICAgICBxID0gW107IC8vIG51bWJlciBpbnRlcnBvbGF0b3JzXG5cbiAgLy8gQ29lcmNlIGlucHV0cyB0byBzdHJpbmdzLlxuICBhID0gYSArIFwiXCIsIGIgPSBiICsgXCJcIjtcblxuICAvLyBJbnRlcnBvbGF0ZSBwYWlycyBvZiBudW1iZXJzIGluIGEgJiBiLlxuICB3aGlsZSAoKGFtID0gcmVBLmV4ZWMoYSkpXG4gICAgICAmJiAoYm0gPSByZUIuZXhlYyhiKSkpIHtcbiAgICBpZiAoKGJzID0gYm0uaW5kZXgpID4gYmkpIHsgLy8gYSBzdHJpbmcgcHJlY2VkZXMgdGhlIG5leHQgbnVtYmVyIGluIGJcbiAgICAgIGJzID0gYi5zbGljZShiaSwgYnMpO1xuICAgICAgaWYgKHNbaV0pIHNbaV0gKz0gYnM7IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgICBlbHNlIHNbKytpXSA9IGJzO1xuICAgIH1cbiAgICBpZiAoKGFtID0gYW1bMF0pID09PSAoYm0gPSBibVswXSkpIHsgLy8gbnVtYmVycyBpbiBhICYgYiBtYXRjaFxuICAgICAgaWYgKHNbaV0pIHNbaV0gKz0gYm07IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgICBlbHNlIHNbKytpXSA9IGJtO1xuICAgIH0gZWxzZSB7IC8vIGludGVycG9sYXRlIG5vbi1tYXRjaGluZyBudW1iZXJzXG4gICAgICBzWysraV0gPSBudWxsO1xuICAgICAgcS5wdXNoKHtpOiBpLCB4OiBudW1iZXIoYW0sIGJtKX0pO1xuICAgIH1cbiAgICBiaSA9IHJlQi5sYXN0SW5kZXg7XG4gIH1cblxuICAvLyBBZGQgcmVtYWlucyBvZiBiLlxuICBpZiAoYmkgPCBiLmxlbmd0aCkge1xuICAgIGJzID0gYi5zbGljZShiaSk7XG4gICAgaWYgKHNbaV0pIHNbaV0gKz0gYnM7IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgZWxzZSBzWysraV0gPSBicztcbiAgfVxuXG4gIC8vIFNwZWNpYWwgb3B0aW1pemF0aW9uIGZvciBvbmx5IGEgc2luZ2xlIG1hdGNoLlxuICAvLyBPdGhlcndpc2UsIGludGVycG9sYXRlIGVhY2ggb2YgdGhlIG51bWJlcnMgYW5kIHJlam9pbiB0aGUgc3RyaW5nLlxuICByZXR1cm4gcy5sZW5ndGggPCAyID8gKHFbMF1cbiAgICAgID8gb25lKHFbMF0ueClcbiAgICAgIDogemVybyhiKSlcbiAgICAgIDogKGIgPSBxLmxlbmd0aCwgZnVuY3Rpb24odCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBvOyBpIDwgYjsgKytpKSBzWyhvID0gcVtpXSkuaV0gPSBvLngodCk7XG4gICAgICAgICAgcmV0dXJuIHMuam9pbihcIlwiKTtcbiAgICAgICAgfSk7XG59XG4iLCAiaW1wb3J0IHtjb2xvcn0gZnJvbSBcImQzLWNvbG9yXCI7XG5pbXBvcnQgcmdiIGZyb20gXCIuL3JnYi5qc1wiO1xuaW1wb3J0IHtnZW5lcmljQXJyYXl9IGZyb20gXCIuL2FycmF5LmpzXCI7XG5pbXBvcnQgZGF0ZSBmcm9tIFwiLi9kYXRlLmpzXCI7XG5pbXBvcnQgbnVtYmVyIGZyb20gXCIuL251bWJlci5qc1wiO1xuaW1wb3J0IG9iamVjdCBmcm9tIFwiLi9vYmplY3QuanNcIjtcbmltcG9ydCBzdHJpbmcgZnJvbSBcIi4vc3RyaW5nLmpzXCI7XG5pbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnQuanNcIjtcbmltcG9ydCBudW1iZXJBcnJheSwge2lzTnVtYmVyQXJyYXl9IGZyb20gXCIuL251bWJlckFycmF5LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgdmFyIHQgPSB0eXBlb2YgYiwgYztcbiAgcmV0dXJuIGIgPT0gbnVsbCB8fCB0ID09PSBcImJvb2xlYW5cIiA/IGNvbnN0YW50KGIpXG4gICAgICA6ICh0ID09PSBcIm51bWJlclwiID8gbnVtYmVyXG4gICAgICA6IHQgPT09IFwic3RyaW5nXCIgPyAoKGMgPSBjb2xvcihiKSkgPyAoYiA9IGMsIHJnYikgOiBzdHJpbmcpXG4gICAgICA6IGIgaW5zdGFuY2VvZiBjb2xvciA/IHJnYlxuICAgICAgOiBiIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVcbiAgICAgIDogaXNOdW1iZXJBcnJheShiKSA/IG51bWJlckFycmF5XG4gICAgICA6IEFycmF5LmlzQXJyYXkoYikgPyBnZW5lcmljQXJyYXlcbiAgICAgIDogdHlwZW9mIGIudmFsdWVPZiAhPT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBiLnRvU3RyaW5nICE9PSBcImZ1bmN0aW9uXCIgfHwgaXNOYU4oYikgPyBvYmplY3RcbiAgICAgIDogbnVtYmVyKShhLCBiKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhID0gK2EsIGIgPSArYiwgZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKGEgKiAoMSAtIHQpICsgYiAqIHQpO1xuICB9O1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbnN0YW50cyh4KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geDtcbiAgfTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBudW1iZXIoeCkge1xuICByZXR1cm4gK3g7XG59XG4iLCAiaW1wb3J0IHtiaXNlY3R9IGZyb20gXCJkMy1hcnJheVwiO1xuaW1wb3J0IHtpbnRlcnBvbGF0ZSBhcyBpbnRlcnBvbGF0ZVZhbHVlLCBpbnRlcnBvbGF0ZU51bWJlciwgaW50ZXJwb2xhdGVSb3VuZH0gZnJvbSBcImQzLWludGVycG9sYXRlXCI7XG5pbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnQuanNcIjtcbmltcG9ydCBudW1iZXIgZnJvbSBcIi4vbnVtYmVyLmpzXCI7XG5cbnZhciB1bml0ID0gWzAsIDFdO1xuXG5leHBvcnQgZnVuY3Rpb24gaWRlbnRpdHkoeCkge1xuICByZXR1cm4geDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplKGEsIGIpIHtcbiAgcmV0dXJuIChiIC09IChhID0gK2EpKVxuICAgICAgPyBmdW5jdGlvbih4KSB7IHJldHVybiAoeCAtIGEpIC8gYjsgfVxuICAgICAgOiBjb25zdGFudChpc05hTihiKSA/IE5hTiA6IDAuNSk7XG59XG5cbmZ1bmN0aW9uIGNsYW1wZXIoYSwgYikge1xuICB2YXIgdDtcbiAgaWYgKGEgPiBiKSB0ID0gYSwgYSA9IGIsIGIgPSB0O1xuICByZXR1cm4gZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5tYXgoYSwgTWF0aC5taW4oYiwgeCkpOyB9O1xufVxuXG4vLyBub3JtYWxpemUoYSwgYikoeCkgdGFrZXMgYSBkb21haW4gdmFsdWUgeCBpbiBbYSxiXSBhbmQgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBwYXJhbWV0ZXIgdCBpbiBbMCwxXS5cbi8vIGludGVycG9sYXRlKGEsIGIpKHQpIHRha2VzIGEgcGFyYW1ldGVyIHQgaW4gWzAsMV0gYW5kIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgcmFuZ2UgdmFsdWUgeCBpbiBbYSxiXS5cbmZ1bmN0aW9uIGJpbWFwKGRvbWFpbiwgcmFuZ2UsIGludGVycG9sYXRlKSB7XG4gIHZhciBkMCA9IGRvbWFpblswXSwgZDEgPSBkb21haW5bMV0sIHIwID0gcmFuZ2VbMF0sIHIxID0gcmFuZ2VbMV07XG4gIGlmIChkMSA8IGQwKSBkMCA9IG5vcm1hbGl6ZShkMSwgZDApLCByMCA9IGludGVycG9sYXRlKHIxLCByMCk7XG4gIGVsc2UgZDAgPSBub3JtYWxpemUoZDAsIGQxKSwgcjAgPSBpbnRlcnBvbGF0ZShyMCwgcjEpO1xuICByZXR1cm4gZnVuY3Rpb24oeCkgeyByZXR1cm4gcjAoZDAoeCkpOyB9O1xufVxuXG5mdW5jdGlvbiBwb2x5bWFwKGRvbWFpbiwgcmFuZ2UsIGludGVycG9sYXRlKSB7XG4gIHZhciBqID0gTWF0aC5taW4oZG9tYWluLmxlbmd0aCwgcmFuZ2UubGVuZ3RoKSAtIDEsXG4gICAgICBkID0gbmV3IEFycmF5KGopLFxuICAgICAgciA9IG5ldyBBcnJheShqKSxcbiAgICAgIGkgPSAtMTtcblxuICAvLyBSZXZlcnNlIGRlc2NlbmRpbmcgZG9tYWlucy5cbiAgaWYgKGRvbWFpbltqXSA8IGRvbWFpblswXSkge1xuICAgIGRvbWFpbiA9IGRvbWFpbi5zbGljZSgpLnJldmVyc2UoKTtcbiAgICByYW5nZSA9IHJhbmdlLnNsaWNlKCkucmV2ZXJzZSgpO1xuICB9XG5cbiAgd2hpbGUgKCsraSA8IGopIHtcbiAgICBkW2ldID0gbm9ybWFsaXplKGRvbWFpbltpXSwgZG9tYWluW2kgKyAxXSk7XG4gICAgcltpXSA9IGludGVycG9sYXRlKHJhbmdlW2ldLCByYW5nZVtpICsgMV0pO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICB2YXIgaSA9IGJpc2VjdChkb21haW4sIHgsIDEsIGopIC0gMTtcbiAgICByZXR1cm4gcltpXShkW2ldKHgpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHkoc291cmNlLCB0YXJnZXQpIHtcbiAgcmV0dXJuIHRhcmdldFxuICAgICAgLmRvbWFpbihzb3VyY2UuZG9tYWluKCkpXG4gICAgICAucmFuZ2Uoc291cmNlLnJhbmdlKCkpXG4gICAgICAuaW50ZXJwb2xhdGUoc291cmNlLmludGVycG9sYXRlKCkpXG4gICAgICAuY2xhbXAoc291cmNlLmNsYW1wKCkpXG4gICAgICAudW5rbm93bihzb3VyY2UudW5rbm93bigpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybWVyKCkge1xuICB2YXIgZG9tYWluID0gdW5pdCxcbiAgICAgIHJhbmdlID0gdW5pdCxcbiAgICAgIGludGVycG9sYXRlID0gaW50ZXJwb2xhdGVWYWx1ZSxcbiAgICAgIHRyYW5zZm9ybSxcbiAgICAgIHVudHJhbnNmb3JtLFxuICAgICAgdW5rbm93bixcbiAgICAgIGNsYW1wID0gaWRlbnRpdHksXG4gICAgICBwaWVjZXdpc2UsXG4gICAgICBvdXRwdXQsXG4gICAgICBpbnB1dDtcblxuICBmdW5jdGlvbiByZXNjYWxlKCkge1xuICAgIHZhciBuID0gTWF0aC5taW4oZG9tYWluLmxlbmd0aCwgcmFuZ2UubGVuZ3RoKTtcbiAgICBpZiAoY2xhbXAgIT09IGlkZW50aXR5KSBjbGFtcCA9IGNsYW1wZXIoZG9tYWluWzBdLCBkb21haW5bbiAtIDFdKTtcbiAgICBwaWVjZXdpc2UgPSBuID4gMiA/IHBvbHltYXAgOiBiaW1hcDtcbiAgICBvdXRwdXQgPSBpbnB1dCA9IG51bGw7XG4gICAgcmV0dXJuIHNjYWxlO1xuICB9XG5cbiAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgIHJldHVybiB4ID09IG51bGwgfHwgaXNOYU4oeCA9ICt4KSA/IHVua25vd24gOiAob3V0cHV0IHx8IChvdXRwdXQgPSBwaWVjZXdpc2UoZG9tYWluLm1hcCh0cmFuc2Zvcm0pLCByYW5nZSwgaW50ZXJwb2xhdGUpKSkodHJhbnNmb3JtKGNsYW1wKHgpKSk7XG4gIH1cblxuICBzY2FsZS5pbnZlcnQgPSBmdW5jdGlvbih5KSB7XG4gICAgcmV0dXJuIGNsYW1wKHVudHJhbnNmb3JtKChpbnB1dCB8fCAoaW5wdXQgPSBwaWVjZXdpc2UocmFuZ2UsIGRvbWFpbi5tYXAodHJhbnNmb3JtKSwgaW50ZXJwb2xhdGVOdW1iZXIpKSkoeSkpKTtcbiAgfTtcblxuICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZG9tYWluID0gQXJyYXkuZnJvbShfLCBudW1iZXIpLCByZXNjYWxlKCkpIDogZG9tYWluLnNsaWNlKCk7XG4gIH07XG5cbiAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocmFuZ2UgPSBBcnJheS5mcm9tKF8pLCByZXNjYWxlKCkpIDogcmFuZ2Uuc2xpY2UoKTtcbiAgfTtcblxuICBzY2FsZS5yYW5nZVJvdW5kID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiByYW5nZSA9IEFycmF5LmZyb20oXyksIGludGVycG9sYXRlID0gaW50ZXJwb2xhdGVSb3VuZCwgcmVzY2FsZSgpO1xuICB9O1xuXG4gIHNjYWxlLmNsYW1wID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNsYW1wID0gXyA/IHRydWUgOiBpZGVudGl0eSwgcmVzY2FsZSgpKSA6IGNsYW1wICE9PSBpZGVudGl0eTtcbiAgfTtcblxuICBzY2FsZS5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChpbnRlcnBvbGF0ZSA9IF8sIHJlc2NhbGUoKSkgOiBpbnRlcnBvbGF0ZTtcbiAgfTtcblxuICBzY2FsZS51bmtub3duID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHVua25vd24gPSBfLCBzY2FsZSkgOiB1bmtub3duO1xuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbih0LCB1KSB7XG4gICAgdHJhbnNmb3JtID0gdCwgdW50cmFuc2Zvcm0gPSB1O1xuICAgIHJldHVybiByZXNjYWxlKCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbnRpbnVvdXMoKSB7XG4gIHJldHVybiB0cmFuc2Zvcm1lcigpKGlkZW50aXR5LCBpZGVudGl0eSk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gTWF0aC5hYnMoeCA9IE1hdGgucm91bmQoeCkpID49IDFlMjFcbiAgICAgID8geC50b0xvY2FsZVN0cmluZyhcImVuXCIpLnJlcGxhY2UoLywvZywgXCJcIilcbiAgICAgIDogeC50b1N0cmluZygxMCk7XG59XG5cbi8vIENvbXB1dGVzIHRoZSBkZWNpbWFsIGNvZWZmaWNpZW50IGFuZCBleHBvbmVudCBvZiB0aGUgc3BlY2lmaWVkIG51bWJlciB4IHdpdGhcbi8vIHNpZ25pZmljYW50IGRpZ2l0cyBwLCB3aGVyZSB4IGlzIHBvc2l0aXZlIGFuZCBwIGlzIGluIFsxLCAyMV0gb3IgdW5kZWZpbmVkLlxuLy8gRm9yIGV4YW1wbGUsIGZvcm1hdERlY2ltYWxQYXJ0cygxLjIzKSByZXR1cm5zIFtcIjEyM1wiLCAwXS5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXREZWNpbWFsUGFydHMoeCwgcCkge1xuICBpZiAoIWlzRmluaXRlKHgpIHx8IHggPT09IDApIHJldHVybiBudWxsOyAvLyBOYU4sIFx1MDBCMUluZmluaXR5LCBcdTAwQjEwXG4gIHZhciBpID0gKHggPSBwID8geC50b0V4cG9uZW50aWFsKHAgLSAxKSA6IHgudG9FeHBvbmVudGlhbCgpKS5pbmRleE9mKFwiZVwiKSwgY29lZmZpY2llbnQgPSB4LnNsaWNlKDAsIGkpO1xuXG4gIC8vIFRoZSBzdHJpbmcgcmV0dXJuZWQgYnkgdG9FeHBvbmVudGlhbCBlaXRoZXIgaGFzIHRoZSBmb3JtIFxcZFxcLlxcZCtlWy0rXVxcZCtcbiAgLy8gKGUuZy4sIDEuMmUrMykgb3IgdGhlIGZvcm0gXFxkZVstK11cXGQrIChlLmcuLCAxZSszKS5cbiAgcmV0dXJuIFtcbiAgICBjb2VmZmljaWVudC5sZW5ndGggPiAxID8gY29lZmZpY2llbnRbMF0gKyBjb2VmZmljaWVudC5zbGljZSgyKSA6IGNvZWZmaWNpZW50LFxuICAgICt4LnNsaWNlKGkgKyAxKVxuICBdO1xufVxuIiwgImltcG9ydCB7Zm9ybWF0RGVjaW1hbFBhcnRzfSBmcm9tIFwiLi9mb3JtYXREZWNpbWFsLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHggPSBmb3JtYXREZWNpbWFsUGFydHMoTWF0aC5hYnMoeCkpLCB4ID8geFsxXSA6IE5hTjtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihncm91cGluZywgdGhvdXNhbmRzKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSwgd2lkdGgpIHtcbiAgICB2YXIgaSA9IHZhbHVlLmxlbmd0aCxcbiAgICAgICAgdCA9IFtdLFxuICAgICAgICBqID0gMCxcbiAgICAgICAgZyA9IGdyb3VwaW5nWzBdLFxuICAgICAgICBsZW5ndGggPSAwO1xuXG4gICAgd2hpbGUgKGkgPiAwICYmIGcgPiAwKSB7XG4gICAgICBpZiAobGVuZ3RoICsgZyArIDEgPiB3aWR0aCkgZyA9IE1hdGgubWF4KDEsIHdpZHRoIC0gbGVuZ3RoKTtcbiAgICAgIHQucHVzaCh2YWx1ZS5zdWJzdHJpbmcoaSAtPSBnLCBpICsgZykpO1xuICAgICAgaWYgKChsZW5ndGggKz0gZyArIDEpID4gd2lkdGgpIGJyZWFrO1xuICAgICAgZyA9IGdyb3VwaW5nW2ogPSAoaiArIDEpICUgZ3JvdXBpbmcubGVuZ3RoXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdC5yZXZlcnNlKCkuam9pbih0aG91c2FuZHMpO1xuICB9O1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG51bWVyYWxzKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9bMC05XS9nLCBmdW5jdGlvbihpKSB7XG4gICAgICByZXR1cm4gbnVtZXJhbHNbK2ldO1xuICAgIH0pO1xuICB9O1xufVxuIiwgIi8vIFtbZmlsbF1hbGlnbl1bc2lnbl1bc3ltYm9sXVswXVt3aWR0aF1bLF1bLnByZWNpc2lvbl1bfl1bdHlwZV1cbnZhciByZSA9IC9eKD86KC4pPyhbPD49Xl0pKT8oWytcXC0oIF0pPyhbJCNdKT8oMCk/KFxcZCspPygsKT8oXFwuXFxkKyk/KH4pPyhbYS16JV0pPyQvaTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcikge1xuICBpZiAoIShtYXRjaCA9IHJlLmV4ZWMoc3BlY2lmaWVyKSkpIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgZm9ybWF0OiBcIiArIHNwZWNpZmllcik7XG4gIHZhciBtYXRjaDtcbiAgcmV0dXJuIG5ldyBGb3JtYXRTcGVjaWZpZXIoe1xuICAgIGZpbGw6IG1hdGNoWzFdLFxuICAgIGFsaWduOiBtYXRjaFsyXSxcbiAgICBzaWduOiBtYXRjaFszXSxcbiAgICBzeW1ib2w6IG1hdGNoWzRdLFxuICAgIHplcm86IG1hdGNoWzVdLFxuICAgIHdpZHRoOiBtYXRjaFs2XSxcbiAgICBjb21tYTogbWF0Y2hbN10sXG4gICAgcHJlY2lzaW9uOiBtYXRjaFs4XSAmJiBtYXRjaFs4XS5zbGljZSgxKSxcbiAgICB0cmltOiBtYXRjaFs5XSxcbiAgICB0eXBlOiBtYXRjaFsxMF1cbiAgfSk7XG59XG5cbmZvcm1hdFNwZWNpZmllci5wcm90b3R5cGUgPSBGb3JtYXRTcGVjaWZpZXIucHJvdG90eXBlOyAvLyBpbnN0YW5jZW9mXG5cbmV4cG9ydCBmdW5jdGlvbiBGb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKSB7XG4gIHRoaXMuZmlsbCA9IHNwZWNpZmllci5maWxsID09PSB1bmRlZmluZWQgPyBcIiBcIiA6IHNwZWNpZmllci5maWxsICsgXCJcIjtcbiAgdGhpcy5hbGlnbiA9IHNwZWNpZmllci5hbGlnbiA9PT0gdW5kZWZpbmVkID8gXCI+XCIgOiBzcGVjaWZpZXIuYWxpZ24gKyBcIlwiO1xuICB0aGlzLnNpZ24gPSBzcGVjaWZpZXIuc2lnbiA9PT0gdW5kZWZpbmVkID8gXCItXCIgOiBzcGVjaWZpZXIuc2lnbiArIFwiXCI7XG4gIHRoaXMuc3ltYm9sID0gc3BlY2lmaWVyLnN5bWJvbCA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHNwZWNpZmllci5zeW1ib2wgKyBcIlwiO1xuICB0aGlzLnplcm8gPSAhIXNwZWNpZmllci56ZXJvO1xuICB0aGlzLndpZHRoID0gc3BlY2lmaWVyLndpZHRoID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiArc3BlY2lmaWVyLndpZHRoO1xuICB0aGlzLmNvbW1hID0gISFzcGVjaWZpZXIuY29tbWE7XG4gIHRoaXMucHJlY2lzaW9uID0gc3BlY2lmaWVyLnByZWNpc2lvbiA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogK3NwZWNpZmllci5wcmVjaXNpb247XG4gIHRoaXMudHJpbSA9ICEhc3BlY2lmaWVyLnRyaW07XG4gIHRoaXMudHlwZSA9IHNwZWNpZmllci50eXBlID09PSB1bmRlZmluZWQgPyBcIlwiIDogc3BlY2lmaWVyLnR5cGUgKyBcIlwiO1xufVxuXG5Gb3JtYXRTcGVjaWZpZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZpbGxcbiAgICAgICsgdGhpcy5hbGlnblxuICAgICAgKyB0aGlzLnNpZ25cbiAgICAgICsgdGhpcy5zeW1ib2xcbiAgICAgICsgKHRoaXMuemVybyA/IFwiMFwiIDogXCJcIilcbiAgICAgICsgKHRoaXMud2lkdGggPT09IHVuZGVmaW5lZCA/IFwiXCIgOiBNYXRoLm1heCgxLCB0aGlzLndpZHRoIHwgMCkpXG4gICAgICArICh0aGlzLmNvbW1hID8gXCIsXCIgOiBcIlwiKVxuICAgICAgKyAodGhpcy5wcmVjaXNpb24gPT09IHVuZGVmaW5lZCA/IFwiXCIgOiBcIi5cIiArIE1hdGgubWF4KDAsIHRoaXMucHJlY2lzaW9uIHwgMCkpXG4gICAgICArICh0aGlzLnRyaW0gPyBcIn5cIiA6IFwiXCIpXG4gICAgICArIHRoaXMudHlwZTtcbn07XG4iLCAiLy8gVHJpbXMgaW5zaWduaWZpY2FudCB6ZXJvcywgZS5nLiwgcmVwbGFjZXMgMS4yMDAwayB3aXRoIDEuMmsuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzKSB7XG4gIG91dDogZm9yICh2YXIgbiA9IHMubGVuZ3RoLCBpID0gMSwgaTAgPSAtMSwgaTE7IGkgPCBuOyArK2kpIHtcbiAgICBzd2l0Y2ggKHNbaV0pIHtcbiAgICAgIGNhc2UgXCIuXCI6IGkwID0gaTEgPSBpOyBicmVhaztcbiAgICAgIGNhc2UgXCIwXCI6IGlmIChpMCA9PT0gMCkgaTAgPSBpOyBpMSA9IGk7IGJyZWFrO1xuICAgICAgZGVmYXVsdDogaWYgKCErc1tpXSkgYnJlYWsgb3V0OyBpZiAoaTAgPiAwKSBpMCA9IDA7IGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaTAgPiAwID8gcy5zbGljZSgwLCBpMCkgKyBzLnNsaWNlKGkxICsgMSkgOiBzO1xufVxuIiwgImltcG9ydCB7Zm9ybWF0RGVjaW1hbFBhcnRzfSBmcm9tIFwiLi9mb3JtYXREZWNpbWFsLmpzXCI7XG5cbmV4cG9ydCB2YXIgcHJlZml4RXhwb25lbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgsIHApIHtcbiAgdmFyIGQgPSBmb3JtYXREZWNpbWFsUGFydHMoeCwgcCk7XG4gIGlmICghZCkgcmV0dXJuIHByZWZpeEV4cG9uZW50ID0gdW5kZWZpbmVkLCB4LnRvUHJlY2lzaW9uKHApO1xuICB2YXIgY29lZmZpY2llbnQgPSBkWzBdLFxuICAgICAgZXhwb25lbnQgPSBkWzFdLFxuICAgICAgaSA9IGV4cG9uZW50IC0gKHByZWZpeEV4cG9uZW50ID0gTWF0aC5tYXgoLTgsIE1hdGgubWluKDgsIE1hdGguZmxvb3IoZXhwb25lbnQgLyAzKSkpICogMykgKyAxLFxuICAgICAgbiA9IGNvZWZmaWNpZW50Lmxlbmd0aDtcbiAgcmV0dXJuIGkgPT09IG4gPyBjb2VmZmljaWVudFxuICAgICAgOiBpID4gbiA/IGNvZWZmaWNpZW50ICsgbmV3IEFycmF5KGkgLSBuICsgMSkuam9pbihcIjBcIilcbiAgICAgIDogaSA+IDAgPyBjb2VmZmljaWVudC5zbGljZSgwLCBpKSArIFwiLlwiICsgY29lZmZpY2llbnQuc2xpY2UoaSlcbiAgICAgIDogXCIwLlwiICsgbmV3IEFycmF5KDEgLSBpKS5qb2luKFwiMFwiKSArIGZvcm1hdERlY2ltYWxQYXJ0cyh4LCBNYXRoLm1heCgwLCBwICsgaSAtIDEpKVswXTsgLy8gbGVzcyB0aGFuIDF5IVxufVxuIiwgImltcG9ydCB7Zm9ybWF0RGVjaW1hbFBhcnRzfSBmcm9tIFwiLi9mb3JtYXREZWNpbWFsLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgsIHApIHtcbiAgdmFyIGQgPSBmb3JtYXREZWNpbWFsUGFydHMoeCwgcCk7XG4gIGlmICghZCkgcmV0dXJuIHggKyBcIlwiO1xuICB2YXIgY29lZmZpY2llbnQgPSBkWzBdLFxuICAgICAgZXhwb25lbnQgPSBkWzFdO1xuICByZXR1cm4gZXhwb25lbnQgPCAwID8gXCIwLlwiICsgbmV3IEFycmF5KC1leHBvbmVudCkuam9pbihcIjBcIikgKyBjb2VmZmljaWVudFxuICAgICAgOiBjb2VmZmljaWVudC5sZW5ndGggPiBleHBvbmVudCArIDEgPyBjb2VmZmljaWVudC5zbGljZSgwLCBleHBvbmVudCArIDEpICsgXCIuXCIgKyBjb2VmZmljaWVudC5zbGljZShleHBvbmVudCArIDEpXG4gICAgICA6IGNvZWZmaWNpZW50ICsgbmV3IEFycmF5KGV4cG9uZW50IC0gY29lZmZpY2llbnQubGVuZ3RoICsgMikuam9pbihcIjBcIik7XG59XG4iLCAiaW1wb3J0IGZvcm1hdERlY2ltYWwgZnJvbSBcIi4vZm9ybWF0RGVjaW1hbC5qc1wiO1xuaW1wb3J0IGZvcm1hdFByZWZpeEF1dG8gZnJvbSBcIi4vZm9ybWF0UHJlZml4QXV0by5qc1wiO1xuaW1wb3J0IGZvcm1hdFJvdW5kZWQgZnJvbSBcIi4vZm9ybWF0Um91bmRlZC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIFwiJVwiOiAoeCwgcCkgPT4gKHggKiAxMDApLnRvRml4ZWQocCksXG4gIFwiYlwiOiAoeCkgPT4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygyKSxcbiAgXCJjXCI6ICh4KSA9PiB4ICsgXCJcIixcbiAgXCJkXCI6IGZvcm1hdERlY2ltYWwsXG4gIFwiZVwiOiAoeCwgcCkgPT4geC50b0V4cG9uZW50aWFsKHApLFxuICBcImZcIjogKHgsIHApID0+IHgudG9GaXhlZChwKSxcbiAgXCJnXCI6ICh4LCBwKSA9PiB4LnRvUHJlY2lzaW9uKHApLFxuICBcIm9cIjogKHgpID0+IE1hdGgucm91bmQoeCkudG9TdHJpbmcoOCksXG4gIFwicFwiOiAoeCwgcCkgPT4gZm9ybWF0Um91bmRlZCh4ICogMTAwLCBwKSxcbiAgXCJyXCI6IGZvcm1hdFJvdW5kZWQsXG4gIFwic1wiOiBmb3JtYXRQcmVmaXhBdXRvLFxuICBcIlhcIjogKHgpID0+IE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCksXG4gIFwieFwiOiAoeCkgPT4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygxNilcbn07XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4geDtcbn1cbiIsICJpbXBvcnQgZXhwb25lbnQgZnJvbSBcIi4vZXhwb25lbnQuanNcIjtcbmltcG9ydCBmb3JtYXRHcm91cCBmcm9tIFwiLi9mb3JtYXRHcm91cC5qc1wiO1xuaW1wb3J0IGZvcm1hdE51bWVyYWxzIGZyb20gXCIuL2Zvcm1hdE51bWVyYWxzLmpzXCI7XG5pbXBvcnQgZm9ybWF0U3BlY2lmaWVyIGZyb20gXCIuL2Zvcm1hdFNwZWNpZmllci5qc1wiO1xuaW1wb3J0IGZvcm1hdFRyaW0gZnJvbSBcIi4vZm9ybWF0VHJpbS5qc1wiO1xuaW1wb3J0IGZvcm1hdFR5cGVzIGZyb20gXCIuL2Zvcm1hdFR5cGVzLmpzXCI7XG5pbXBvcnQge3ByZWZpeEV4cG9uZW50fSBmcm9tIFwiLi9mb3JtYXRQcmVmaXhBdXRvLmpzXCI7XG5pbXBvcnQgaWRlbnRpdHkgZnJvbSBcIi4vaWRlbnRpdHkuanNcIjtcblxudmFyIG1hcCA9IEFycmF5LnByb3RvdHlwZS5tYXAsXG4gICAgcHJlZml4ZXMgPSBbXCJ5XCIsXCJ6XCIsXCJhXCIsXCJmXCIsXCJwXCIsXCJuXCIsXCJcdTAwQjVcIixcIm1cIixcIlwiLFwia1wiLFwiTVwiLFwiR1wiLFwiVFwiLFwiUFwiLFwiRVwiLFwiWlwiLFwiWVwiXTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obG9jYWxlKSB7XG4gIHZhciBncm91cCA9IGxvY2FsZS5ncm91cGluZyA9PT0gdW5kZWZpbmVkIHx8IGxvY2FsZS50aG91c2FuZHMgPT09IHVuZGVmaW5lZCA/IGlkZW50aXR5IDogZm9ybWF0R3JvdXAobWFwLmNhbGwobG9jYWxlLmdyb3VwaW5nLCBOdW1iZXIpLCBsb2NhbGUudGhvdXNhbmRzICsgXCJcIiksXG4gICAgICBjdXJyZW5jeVByZWZpeCA9IGxvY2FsZS5jdXJyZW5jeSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IGxvY2FsZS5jdXJyZW5jeVswXSArIFwiXCIsXG4gICAgICBjdXJyZW5jeVN1ZmZpeCA9IGxvY2FsZS5jdXJyZW5jeSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IGxvY2FsZS5jdXJyZW5jeVsxXSArIFwiXCIsXG4gICAgICBkZWNpbWFsID0gbG9jYWxlLmRlY2ltYWwgPT09IHVuZGVmaW5lZCA/IFwiLlwiIDogbG9jYWxlLmRlY2ltYWwgKyBcIlwiLFxuICAgICAgbnVtZXJhbHMgPSBsb2NhbGUubnVtZXJhbHMgPT09IHVuZGVmaW5lZCA/IGlkZW50aXR5IDogZm9ybWF0TnVtZXJhbHMobWFwLmNhbGwobG9jYWxlLm51bWVyYWxzLCBTdHJpbmcpKSxcbiAgICAgIHBlcmNlbnQgPSBsb2NhbGUucGVyY2VudCA9PT0gdW5kZWZpbmVkID8gXCIlXCIgOiBsb2NhbGUucGVyY2VudCArIFwiXCIsXG4gICAgICBtaW51cyA9IGxvY2FsZS5taW51cyA9PT0gdW5kZWZpbmVkID8gXCJcdTIyMTJcIiA6IGxvY2FsZS5taW51cyArIFwiXCIsXG4gICAgICBuYW4gPSBsb2NhbGUubmFuID09PSB1bmRlZmluZWQgPyBcIk5hTlwiIDogbG9jYWxlLm5hbiArIFwiXCI7XG5cbiAgZnVuY3Rpb24gbmV3Rm9ybWF0KHNwZWNpZmllciwgb3B0aW9ucykge1xuICAgIHNwZWNpZmllciA9IGZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpO1xuXG4gICAgdmFyIGZpbGwgPSBzcGVjaWZpZXIuZmlsbCxcbiAgICAgICAgYWxpZ24gPSBzcGVjaWZpZXIuYWxpZ24sXG4gICAgICAgIHNpZ24gPSBzcGVjaWZpZXIuc2lnbixcbiAgICAgICAgc3ltYm9sID0gc3BlY2lmaWVyLnN5bWJvbCxcbiAgICAgICAgemVybyA9IHNwZWNpZmllci56ZXJvLFxuICAgICAgICB3aWR0aCA9IHNwZWNpZmllci53aWR0aCxcbiAgICAgICAgY29tbWEgPSBzcGVjaWZpZXIuY29tbWEsXG4gICAgICAgIHByZWNpc2lvbiA9IHNwZWNpZmllci5wcmVjaXNpb24sXG4gICAgICAgIHRyaW0gPSBzcGVjaWZpZXIudHJpbSxcbiAgICAgICAgdHlwZSA9IHNwZWNpZmllci50eXBlO1xuXG4gICAgLy8gVGhlIFwiblwiIHR5cGUgaXMgYW4gYWxpYXMgZm9yIFwiLGdcIi5cbiAgICBpZiAodHlwZSA9PT0gXCJuXCIpIGNvbW1hID0gdHJ1ZSwgdHlwZSA9IFwiZ1wiO1xuXG4gICAgLy8gVGhlIFwiXCIgdHlwZSwgYW5kIGFueSBpbnZhbGlkIHR5cGUsIGlzIGFuIGFsaWFzIGZvciBcIi4xMn5nXCIuXG4gICAgZWxzZSBpZiAoIWZvcm1hdFR5cGVzW3R5cGVdKSBwcmVjaXNpb24gPT09IHVuZGVmaW5lZCAmJiAocHJlY2lzaW9uID0gMTIpLCB0cmltID0gdHJ1ZSwgdHlwZSA9IFwiZ1wiO1xuXG4gICAgLy8gSWYgemVybyBmaWxsIGlzIHNwZWNpZmllZCwgcGFkZGluZyBnb2VzIGFmdGVyIHNpZ24gYW5kIGJlZm9yZSBkaWdpdHMuXG4gICAgaWYgKHplcm8gfHwgKGZpbGwgPT09IFwiMFwiICYmIGFsaWduID09PSBcIj1cIikpIHplcm8gPSB0cnVlLCBmaWxsID0gXCIwXCIsIGFsaWduID0gXCI9XCI7XG5cbiAgICAvLyBDb21wdXRlIHRoZSBwcmVmaXggYW5kIHN1ZmZpeC5cbiAgICAvLyBGb3IgU0ktcHJlZml4LCB0aGUgc3VmZml4IGlzIGxhemlseSBjb21wdXRlZC5cbiAgICB2YXIgcHJlZml4ID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5wcmVmaXggIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMucHJlZml4IDogXCJcIikgKyAoc3ltYm9sID09PSBcIiRcIiA/IGN1cnJlbmN5UHJlZml4IDogc3ltYm9sID09PSBcIiNcIiAmJiAvW2JveFhdLy50ZXN0KHR5cGUpID8gXCIwXCIgKyB0eXBlLnRvTG93ZXJDYXNlKCkgOiBcIlwiKSxcbiAgICAgICAgc3VmZml4ID0gKHN5bWJvbCA9PT0gXCIkXCIgPyBjdXJyZW5jeVN1ZmZpeCA6IC9bJXBdLy50ZXN0KHR5cGUpID8gcGVyY2VudCA6IFwiXCIpICsgKG9wdGlvbnMgJiYgb3B0aW9ucy5zdWZmaXggIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuc3VmZml4IDogXCJcIik7XG5cbiAgICAvLyBXaGF0IGZvcm1hdCBmdW5jdGlvbiBzaG91bGQgd2UgdXNlP1xuICAgIC8vIElzIHRoaXMgYW4gaW50ZWdlciB0eXBlP1xuICAgIC8vIENhbiB0aGlzIHR5cGUgZ2VuZXJhdGUgZXhwb25lbnRpYWwgbm90YXRpb24/XG4gICAgdmFyIGZvcm1hdFR5cGUgPSBmb3JtYXRUeXBlc1t0eXBlXSxcbiAgICAgICAgbWF5YmVTdWZmaXggPSAvW2RlZmdwcnMlXS8udGVzdCh0eXBlKTtcblxuICAgIC8vIFNldCB0aGUgZGVmYXVsdCBwcmVjaXNpb24gaWYgbm90IHNwZWNpZmllZCxcbiAgICAvLyBvciBjbGFtcCB0aGUgc3BlY2lmaWVkIHByZWNpc2lvbiB0byB0aGUgc3VwcG9ydGVkIHJhbmdlLlxuICAgIC8vIEZvciBzaWduaWZpY2FudCBwcmVjaXNpb24sIGl0IG11c3QgYmUgaW4gWzEsIDIxXS5cbiAgICAvLyBGb3IgZml4ZWQgcHJlY2lzaW9uLCBpdCBtdXN0IGJlIGluIFswLCAyMF0uXG4gICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uID09PSB1bmRlZmluZWQgPyA2XG4gICAgICAgIDogL1tncHJzXS8udGVzdCh0eXBlKSA/IE1hdGgubWF4KDEsIE1hdGgubWluKDIxLCBwcmVjaXNpb24pKVxuICAgICAgICA6IE1hdGgubWF4KDAsIE1hdGgubWluKDIwLCBwcmVjaXNpb24pKTtcblxuICAgIGZ1bmN0aW9uIGZvcm1hdCh2YWx1ZSkge1xuICAgICAgdmFyIHZhbHVlUHJlZml4ID0gcHJlZml4LFxuICAgICAgICAgIHZhbHVlU3VmZml4ID0gc3VmZml4LFxuICAgICAgICAgIGksIG4sIGM7XG5cbiAgICAgIGlmICh0eXBlID09PSBcImNcIikge1xuICAgICAgICB2YWx1ZVN1ZmZpeCA9IGZvcm1hdFR5cGUodmFsdWUpICsgdmFsdWVTdWZmaXg7XG4gICAgICAgIHZhbHVlID0gXCJcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gK3ZhbHVlO1xuXG4gICAgICAgIC8vIERldGVybWluZSB0aGUgc2lnbi4gLTAgaXMgbm90IGxlc3MgdGhhbiAwLCBidXQgMSAvIC0wIGlzIVxuICAgICAgICB2YXIgdmFsdWVOZWdhdGl2ZSA9IHZhbHVlIDwgMCB8fCAxIC8gdmFsdWUgPCAwO1xuXG4gICAgICAgIC8vIFBlcmZvcm0gdGhlIGluaXRpYWwgZm9ybWF0dGluZy5cbiAgICAgICAgdmFsdWUgPSBpc05hTih2YWx1ZSkgPyBuYW4gOiBmb3JtYXRUeXBlKE1hdGguYWJzKHZhbHVlKSwgcHJlY2lzaW9uKTtcblxuICAgICAgICAvLyBUcmltIGluc2lnbmlmaWNhbnQgemVyb3MuXG4gICAgICAgIGlmICh0cmltKSB2YWx1ZSA9IGZvcm1hdFRyaW0odmFsdWUpO1xuXG4gICAgICAgIC8vIElmIGEgbmVnYXRpdmUgdmFsdWUgcm91bmRzIHRvIHplcm8gYWZ0ZXIgZm9ybWF0dGluZywgYW5kIG5vIGV4cGxpY2l0IHBvc2l0aXZlIHNpZ24gaXMgcmVxdWVzdGVkLCBoaWRlIHRoZSBzaWduLlxuICAgICAgICBpZiAodmFsdWVOZWdhdGl2ZSAmJiArdmFsdWUgPT09IDAgJiYgc2lnbiAhPT0gXCIrXCIpIHZhbHVlTmVnYXRpdmUgPSBmYWxzZTtcblxuICAgICAgICAvLyBDb21wdXRlIHRoZSBwcmVmaXggYW5kIHN1ZmZpeC5cbiAgICAgICAgdmFsdWVQcmVmaXggPSAodmFsdWVOZWdhdGl2ZSA/IChzaWduID09PSBcIihcIiA/IHNpZ24gOiBtaW51cykgOiBzaWduID09PSBcIi1cIiB8fCBzaWduID09PSBcIihcIiA/IFwiXCIgOiBzaWduKSArIHZhbHVlUHJlZml4O1xuICAgICAgICB2YWx1ZVN1ZmZpeCA9ICh0eXBlID09PSBcInNcIiAmJiAhaXNOYU4odmFsdWUpICYmIHByZWZpeEV4cG9uZW50ICE9PSB1bmRlZmluZWQgPyBwcmVmaXhlc1s4ICsgcHJlZml4RXhwb25lbnQgLyAzXSA6IFwiXCIpICsgdmFsdWVTdWZmaXggKyAodmFsdWVOZWdhdGl2ZSAmJiBzaWduID09PSBcIihcIiA/IFwiKVwiIDogXCJcIik7XG5cbiAgICAgICAgLy8gQnJlYWsgdGhlIGZvcm1hdHRlZCB2YWx1ZSBpbnRvIHRoZSBpbnRlZ2VyIFx1MjAxQ3ZhbHVlXHUyMDFEIHBhcnQgdGhhdCBjYW4gYmVcbiAgICAgICAgLy8gZ3JvdXBlZCwgYW5kIGZyYWN0aW9uYWwgb3IgZXhwb25lbnRpYWwgXHUyMDFDc3VmZml4XHUyMDFEIHBhcnQgdGhhdCBpcyBub3QuXG4gICAgICAgIGlmIChtYXliZVN1ZmZpeCkge1xuICAgICAgICAgIGkgPSAtMSwgbiA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKGMgPSB2YWx1ZS5jaGFyQ29kZUF0KGkpLCA0OCA+IGMgfHwgYyA+IDU3KSB7XG4gICAgICAgICAgICAgIHZhbHVlU3VmZml4ID0gKGMgPT09IDQ2ID8gZGVjaW1hbCArIHZhbHVlLnNsaWNlKGkgKyAxKSA6IHZhbHVlLnNsaWNlKGkpKSArIHZhbHVlU3VmZml4O1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIGZpbGwgY2hhcmFjdGVyIGlzIG5vdCBcIjBcIiwgZ3JvdXBpbmcgaXMgYXBwbGllZCBiZWZvcmUgcGFkZGluZy5cbiAgICAgIGlmIChjb21tYSAmJiAhemVybykgdmFsdWUgPSBncm91cCh2YWx1ZSwgSW5maW5pdHkpO1xuXG4gICAgICAvLyBDb21wdXRlIHRoZSBwYWRkaW5nLlxuICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlUHJlZml4Lmxlbmd0aCArIHZhbHVlLmxlbmd0aCArIHZhbHVlU3VmZml4Lmxlbmd0aCxcbiAgICAgICAgICBwYWRkaW5nID0gbGVuZ3RoIDwgd2lkdGggPyBuZXcgQXJyYXkod2lkdGggLSBsZW5ndGggKyAxKS5qb2luKGZpbGwpIDogXCJcIjtcblxuICAgICAgLy8gSWYgdGhlIGZpbGwgY2hhcmFjdGVyIGlzIFwiMFwiLCBncm91cGluZyBpcyBhcHBsaWVkIGFmdGVyIHBhZGRpbmcuXG4gICAgICBpZiAoY29tbWEgJiYgemVybykgdmFsdWUgPSBncm91cChwYWRkaW5nICsgdmFsdWUsIHBhZGRpbmcubGVuZ3RoID8gd2lkdGggLSB2YWx1ZVN1ZmZpeC5sZW5ndGggOiBJbmZpbml0eSksIHBhZGRpbmcgPSBcIlwiO1xuXG4gICAgICAvLyBSZWNvbnN0cnVjdCB0aGUgZmluYWwgb3V0cHV0IGJhc2VkIG9uIHRoZSBkZXNpcmVkIGFsaWdubWVudC5cbiAgICAgIHN3aXRjaCAoYWxpZ24pIHtcbiAgICAgICAgY2FzZSBcIjxcIjogdmFsdWUgPSB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXggKyBwYWRkaW5nOyBicmVhaztcbiAgICAgICAgY2FzZSBcIj1cIjogdmFsdWUgPSB2YWx1ZVByZWZpeCArIHBhZGRpbmcgKyB2YWx1ZSArIHZhbHVlU3VmZml4OyBicmVhaztcbiAgICAgICAgY2FzZSBcIl5cIjogdmFsdWUgPSBwYWRkaW5nLnNsaWNlKDAsIGxlbmd0aCA9IHBhZGRpbmcubGVuZ3RoID4+IDEpICsgdmFsdWVQcmVmaXggKyB2YWx1ZSArIHZhbHVlU3VmZml4ICsgcGFkZGluZy5zbGljZShsZW5ndGgpOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDogdmFsdWUgPSBwYWRkaW5nICsgdmFsdWVQcmVmaXggKyB2YWx1ZSArIHZhbHVlU3VmZml4OyBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bWVyYWxzKHZhbHVlKTtcbiAgICB9XG5cbiAgICBmb3JtYXQudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzcGVjaWZpZXIgKyBcIlwiO1xuICAgIH07XG5cbiAgICByZXR1cm4gZm9ybWF0O1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0UHJlZml4KHNwZWNpZmllciwgdmFsdWUpIHtcbiAgICB2YXIgZSA9IE1hdGgubWF4KC04LCBNYXRoLm1pbig4LCBNYXRoLmZsb29yKGV4cG9uZW50KHZhbHVlKSAvIDMpKSkgKiAzLFxuICAgICAgICBrID0gTWF0aC5wb3coMTAsIC1lKSxcbiAgICAgICAgZiA9IG5ld0Zvcm1hdCgoc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllciksIHNwZWNpZmllci50eXBlID0gXCJmXCIsIHNwZWNpZmllciksIHtzdWZmaXg6IHByZWZpeGVzWzggKyBlIC8gM119KTtcbiAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiBmKGsgKiB2YWx1ZSk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZm9ybWF0OiBuZXdGb3JtYXQsXG4gICAgZm9ybWF0UHJlZml4OiBmb3JtYXRQcmVmaXhcbiAgfTtcbn1cbiIsICJpbXBvcnQgZm9ybWF0TG9jYWxlIGZyb20gXCIuL2xvY2FsZS5qc1wiO1xuXG52YXIgbG9jYWxlO1xuZXhwb3J0IHZhciBmb3JtYXQ7XG5leHBvcnQgdmFyIGZvcm1hdFByZWZpeDtcblxuZGVmYXVsdExvY2FsZSh7XG4gIHRob3VzYW5kczogXCIsXCIsXG4gIGdyb3VwaW5nOiBbM10sXG4gIGN1cnJlbmN5OiBbXCIkXCIsIFwiXCJdXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVmYXVsdExvY2FsZShkZWZpbml0aW9uKSB7XG4gIGxvY2FsZSA9IGZvcm1hdExvY2FsZShkZWZpbml0aW9uKTtcbiAgZm9ybWF0ID0gbG9jYWxlLmZvcm1hdDtcbiAgZm9ybWF0UHJlZml4ID0gbG9jYWxlLmZvcm1hdFByZWZpeDtcbiAgcmV0dXJuIGxvY2FsZTtcbn1cbiIsICJpbXBvcnQgZXhwb25lbnQgZnJvbSBcIi4vZXhwb25lbnQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc3RlcCkge1xuICByZXR1cm4gTWF0aC5tYXgoMCwgLWV4cG9uZW50KE1hdGguYWJzKHN0ZXApKSk7XG59XG4iLCAiaW1wb3J0IGV4cG9uZW50IGZyb20gXCIuL2V4cG9uZW50LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0ZXAsIHZhbHVlKSB7XG4gIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCh2YWx1ZSkgLyAzKSkpICogMyAtIGV4cG9uZW50KE1hdGguYWJzKHN0ZXApKSk7XG59XG4iLCAiaW1wb3J0IGV4cG9uZW50IGZyb20gXCIuL2V4cG9uZW50LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0ZXAsIG1heCkge1xuICBzdGVwID0gTWF0aC5hYnMoc3RlcCksIG1heCA9IE1hdGguYWJzKG1heCkgLSBzdGVwO1xuICByZXR1cm4gTWF0aC5tYXgoMCwgZXhwb25lbnQobWF4KSAtIGV4cG9uZW50KHN0ZXApKSArIDE7XG59XG4iLCAiaW1wb3J0IHt0aWNrU3RlcH0gZnJvbSBcImQzLWFycmF5XCI7XG5pbXBvcnQge2Zvcm1hdCwgZm9ybWF0UHJlZml4LCBmb3JtYXRTcGVjaWZpZXIsIHByZWNpc2lvbkZpeGVkLCBwcmVjaXNpb25QcmVmaXgsIHByZWNpc2lvblJvdW5kfSBmcm9tIFwiZDMtZm9ybWF0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRpY2tGb3JtYXQoc3RhcnQsIHN0b3AsIGNvdW50LCBzcGVjaWZpZXIpIHtcbiAgdmFyIHN0ZXAgPSB0aWNrU3RlcChzdGFydCwgc3RvcCwgY291bnQpLFxuICAgICAgcHJlY2lzaW9uO1xuICBzcGVjaWZpZXIgPSBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyID09IG51bGwgPyBcIixmXCIgOiBzcGVjaWZpZXIpO1xuICBzd2l0Y2ggKHNwZWNpZmllci50eXBlKSB7XG4gICAgY2FzZSBcInNcIjoge1xuICAgICAgdmFyIHZhbHVlID0gTWF0aC5tYXgoTWF0aC5hYnMoc3RhcnQpLCBNYXRoLmFicyhzdG9wKSk7XG4gICAgICBpZiAoc3BlY2lmaWVyLnByZWNpc2lvbiA9PSBudWxsICYmICFpc05hTihwcmVjaXNpb24gPSBwcmVjaXNpb25QcmVmaXgoc3RlcCwgdmFsdWUpKSkgc3BlY2lmaWVyLnByZWNpc2lvbiA9IHByZWNpc2lvbjtcbiAgICAgIHJldHVybiBmb3JtYXRQcmVmaXgoc3BlY2lmaWVyLCB2YWx1ZSk7XG4gICAgfVxuICAgIGNhc2UgXCJcIjpcbiAgICBjYXNlIFwiZVwiOlxuICAgIGNhc2UgXCJnXCI6XG4gICAgY2FzZSBcInBcIjpcbiAgICBjYXNlIFwiclwiOiB7XG4gICAgICBpZiAoc3BlY2lmaWVyLnByZWNpc2lvbiA9PSBudWxsICYmICFpc05hTihwcmVjaXNpb24gPSBwcmVjaXNpb25Sb3VuZChzdGVwLCBNYXRoLm1heChNYXRoLmFicyhzdGFydCksIE1hdGguYWJzKHN0b3ApKSkpKSBzcGVjaWZpZXIucHJlY2lzaW9uID0gcHJlY2lzaW9uIC0gKHNwZWNpZmllci50eXBlID09PSBcImVcIik7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBcImZcIjpcbiAgICBjYXNlIFwiJVwiOiB7XG4gICAgICBpZiAoc3BlY2lmaWVyLnByZWNpc2lvbiA9PSBudWxsICYmICFpc05hTihwcmVjaXNpb24gPSBwcmVjaXNpb25GaXhlZChzdGVwKSkpIHNwZWNpZmllci5wcmVjaXNpb24gPSBwcmVjaXNpb24gLSAoc3BlY2lmaWVyLnR5cGUgPT09IFwiJVwiKSAqIDI7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZvcm1hdChzcGVjaWZpZXIpO1xufVxuIiwgImltcG9ydCB7dGlja3MsIHRpY2tJbmNyZW1lbnR9IGZyb20gXCJkMy1hcnJheVwiO1xuaW1wb3J0IGNvbnRpbnVvdXMsIHtjb3B5fSBmcm9tIFwiLi9jb250aW51b3VzLmpzXCI7XG5pbXBvcnQge2luaXRSYW5nZX0gZnJvbSBcIi4vaW5pdC5qc1wiO1xuaW1wb3J0IHRpY2tGb3JtYXQgZnJvbSBcIi4vdGlja0Zvcm1hdC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gbGluZWFyaXNoKHNjYWxlKSB7XG4gIHZhciBkb21haW4gPSBzY2FsZS5kb21haW47XG5cbiAgc2NhbGUudGlja3MgPSBmdW5jdGlvbihjb3VudCkge1xuICAgIHZhciBkID0gZG9tYWluKCk7XG4gICAgcmV0dXJuIHRpY2tzKGRbMF0sIGRbZC5sZW5ndGggLSAxXSwgY291bnQgPT0gbnVsbCA/IDEwIDogY291bnQpO1xuICB9O1xuXG4gIHNjYWxlLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihjb3VudCwgc3BlY2lmaWVyKSB7XG4gICAgdmFyIGQgPSBkb21haW4oKTtcbiAgICByZXR1cm4gdGlja0Zvcm1hdChkWzBdLCBkW2QubGVuZ3RoIC0gMV0sIGNvdW50ID09IG51bGwgPyAxMCA6IGNvdW50LCBzcGVjaWZpZXIpO1xuICB9O1xuXG4gIHNjYWxlLm5pY2UgPSBmdW5jdGlvbihjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsKSBjb3VudCA9IDEwO1xuXG4gICAgdmFyIGQgPSBkb21haW4oKTtcbiAgICB2YXIgaTAgPSAwO1xuICAgIHZhciBpMSA9IGQubGVuZ3RoIC0gMTtcbiAgICB2YXIgc3RhcnQgPSBkW2kwXTtcbiAgICB2YXIgc3RvcCA9IGRbaTFdO1xuICAgIHZhciBwcmVzdGVwO1xuICAgIHZhciBzdGVwO1xuICAgIHZhciBtYXhJdGVyID0gMTA7XG5cbiAgICBpZiAoc3RvcCA8IHN0YXJ0KSB7XG4gICAgICBzdGVwID0gc3RhcnQsIHN0YXJ0ID0gc3RvcCwgc3RvcCA9IHN0ZXA7XG4gICAgICBzdGVwID0gaTAsIGkwID0gaTEsIGkxID0gc3RlcDtcbiAgICB9XG4gICAgXG4gICAgd2hpbGUgKG1heEl0ZXItLSA+IDApIHtcbiAgICAgIHN0ZXAgPSB0aWNrSW5jcmVtZW50KHN0YXJ0LCBzdG9wLCBjb3VudCk7XG4gICAgICBpZiAoc3RlcCA9PT0gcHJlc3RlcCkge1xuICAgICAgICBkW2kwXSA9IHN0YXJ0XG4gICAgICAgIGRbaTFdID0gc3RvcFxuICAgICAgICByZXR1cm4gZG9tYWluKGQpO1xuICAgICAgfSBlbHNlIGlmIChzdGVwID4gMCkge1xuICAgICAgICBzdGFydCA9IE1hdGguZmxvb3Ioc3RhcnQgLyBzdGVwKSAqIHN0ZXA7XG4gICAgICAgIHN0b3AgPSBNYXRoLmNlaWwoc3RvcCAvIHN0ZXApICogc3RlcDtcbiAgICAgIH0gZWxzZSBpZiAoc3RlcCA8IDApIHtcbiAgICAgICAgc3RhcnQgPSBNYXRoLmNlaWwoc3RhcnQgKiBzdGVwKSAvIHN0ZXA7XG4gICAgICAgIHN0b3AgPSBNYXRoLmZsb29yKHN0b3AgKiBzdGVwKSAvIHN0ZXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHByZXN0ZXAgPSBzdGVwO1xuICAgIH1cblxuICAgIHJldHVybiBzY2FsZTtcbiAgfTtcblxuICByZXR1cm4gc2NhbGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxpbmVhcigpIHtcbiAgdmFyIHNjYWxlID0gY29udGludW91cygpO1xuXG4gIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY29weShzY2FsZSwgbGluZWFyKCkpO1xuICB9O1xuXG4gIGluaXRSYW5nZS5hcHBseShzY2FsZSwgYXJndW1lbnRzKTtcblxuICByZXR1cm4gbGluZWFyaXNoKHNjYWxlKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgdmFyIG4gPSBzcGVjaWZpZXIubGVuZ3RoIC8gNiB8IDAsIGNvbG9ycyA9IG5ldyBBcnJheShuKSwgaSA9IDA7XG4gIHdoaWxlIChpIDwgbikgY29sb3JzW2ldID0gXCIjXCIgKyBzcGVjaWZpZXIuc2xpY2UoaSAqIDYsICsraSAqIDYpO1xuICByZXR1cm4gY29sb3JzO1xufVxuIiwgImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9ycy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnMoXCI0ZTc5YTdmMjhlMmNlMTU3NTk3NmI3YjI1OWExNGZlZGM5NDlhZjdhYTFmZjlkYTc5Yzc1NWZiYWIwYWJcIik7XG4iLCAiZXhwb3J0IHZhciB4aHRtbCA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHN2ZzogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICB4aHRtbDogeGh0bWwsXG4gIHhsaW5rOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixcbiAgeG1sOiBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiLFxuICB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiXG59O1xuIiwgImltcG9ydCBuYW1lc3BhY2VzIGZyb20gXCIuL25hbWVzcGFjZXMuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICB2YXIgcHJlZml4ID0gbmFtZSArPSBcIlwiLCBpID0gcHJlZml4LmluZGV4T2YoXCI6XCIpO1xuICBpZiAoaSA+PSAwICYmIChwcmVmaXggPSBuYW1lLnNsaWNlKDAsIGkpKSAhPT0gXCJ4bWxuc1wiKSBuYW1lID0gbmFtZS5zbGljZShpICsgMSk7XG4gIHJldHVybiBuYW1lc3BhY2VzLmhhc093blByb3BlcnR5KHByZWZpeCkgPyB7c3BhY2U6IG5hbWVzcGFjZXNbcHJlZml4XSwgbG9jYWw6IG5hbWV9IDogbmFtZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbn1cbiIsICJpbXBvcnQgbmFtZXNwYWNlIGZyb20gXCIuL25hbWVzcGFjZS5qc1wiO1xuaW1wb3J0IHt4aHRtbH0gZnJvbSBcIi4vbmFtZXNwYWNlcy5qc1wiO1xuXG5mdW5jdGlvbiBjcmVhdG9ySW5oZXJpdChuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQsXG4gICAgICAgIHVyaSA9IHRoaXMubmFtZXNwYWNlVVJJO1xuICAgIHJldHVybiB1cmkgPT09IHhodG1sICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5uYW1lc3BhY2VVUkkgPT09IHhodG1sXG4gICAgICAgID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKVxuICAgICAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh1cmksIG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdG9yRml4ZWQoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGZ1bGxuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuICByZXR1cm4gKGZ1bGxuYW1lLmxvY2FsXG4gICAgICA/IGNyZWF0b3JGaXhlZFxuICAgICAgOiBjcmVhdG9ySW5oZXJpdCkoZnVsbG5hbWUpO1xufVxuIiwgImZ1bmN0aW9uIG5vbmUoKSB7fVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gc2VsZWN0b3IgPT0gbnVsbCA/IG5vbmUgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBzZWxlY3RvciBmcm9tIFwiLi4vc2VsZWN0b3IuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0KSB7XG4gIGlmICh0eXBlb2Ygc2VsZWN0ICE9PSBcImZ1bmN0aW9uXCIpIHNlbGVjdCA9IHNlbGVjdG9yKHNlbGVjdCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzdWJncm91cCA9IHN1Ymdyb3Vwc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgc3Vibm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiAoc3Vibm9kZSA9IHNlbGVjdC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkpIHtcbiAgICAgICAgaWYgKFwiX19kYXRhX19cIiBpbiBub2RlKSBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgICAgc3ViZ3JvdXBbaV0gPSBzdWJub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCAiLy8gR2l2ZW4gc29tZXRoaW5nIGFycmF5IGxpa2UgKG9yIG51bGwpLCByZXR1cm5zIHNvbWV0aGluZyB0aGF0IGlzIHN0cmljdGx5IGFuXG4vLyBhcnJheS4gVGhpcyBpcyB1c2VkIHRvIGVuc3VyZSB0aGF0IGFycmF5LWxpa2Ugb2JqZWN0cyBwYXNzZWQgdG8gZDMuc2VsZWN0QWxsXG4vLyBvciBzZWxlY3Rpb24uc2VsZWN0QWxsIGFyZSBjb252ZXJ0ZWQgaW50byBwcm9wZXIgYXJyYXlzIHdoZW4gY3JlYXRpbmcgYVxuLy8gc2VsZWN0aW9uOyB3ZSBkb25cdTIwMTl0IGV2ZXIgd2FudCB0byBjcmVhdGUgYSBzZWxlY3Rpb24gYmFja2VkIGJ5IGEgbGl2ZVxuLy8gSFRNTENvbGxlY3Rpb24gb3IgTm9kZUxpc3QuIEhvd2V2ZXIsIG5vdGUgdGhhdCBzZWxlY3Rpb24uc2VsZWN0QWxsIHdpbGwgdXNlIGFcbi8vIHN0YXRpYyBOb2RlTGlzdCBhcyBhIGdyb3VwLCBzaW5jZSBpdCBzYWZlbHkgZGVyaXZlZCBmcm9tIHF1ZXJ5U2VsZWN0b3JBbGwuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhcnJheSh4KSB7XG4gIHJldHVybiB4ID09IG51bGwgPyBbXSA6IEFycmF5LmlzQXJyYXkoeCkgPyB4IDogQXJyYXkuZnJvbSh4KTtcbn1cbiIsICJmdW5jdGlvbiBlbXB0eSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gc2VsZWN0b3IgPT0gbnVsbCA/IGVtcHR5IDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQgYXJyYXkgZnJvbSBcIi4uL2FycmF5LmpzXCI7XG5pbXBvcnQgc2VsZWN0b3JBbGwgZnJvbSBcIi4uL3NlbGVjdG9yQWxsLmpzXCI7XG5cbmZ1bmN0aW9uIGFycmF5QWxsKHNlbGVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGFycmF5KHNlbGVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0KSB7XG4gIGlmICh0eXBlb2Ygc2VsZWN0ID09PSBcImZ1bmN0aW9uXCIpIHNlbGVjdCA9IGFycmF5QWxsKHNlbGVjdCk7XG4gIGVsc2Ugc2VsZWN0ID0gc2VsZWN0b3JBbGwoc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBbXSwgcGFyZW50cyA9IFtdLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cHMucHVzaChzZWxlY3QuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpO1xuICAgICAgICBwYXJlbnRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCBwYXJlbnRzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcyhzZWxlY3Rvcik7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGlsZE1hdGNoZXIoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5tYXRjaGVzKHNlbGVjdG9yKTtcbiAgfTtcbn1cblxuIiwgImltcG9ydCB7Y2hpbGRNYXRjaGVyfSBmcm9tIFwiLi4vbWF0Y2hlci5qc1wiO1xuXG52YXIgZmluZCA9IEFycmF5LnByb3RvdHlwZS5maW5kO1xuXG5mdW5jdGlvbiBjaGlsZEZpbmQobWF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmaW5kLmNhbGwodGhpcy5jaGlsZHJlbiwgbWF0Y2gpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjaGlsZEZpcnN0KCkge1xuICByZXR1cm4gdGhpcy5maXJzdEVsZW1lbnRDaGlsZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KG1hdGNoID09IG51bGwgPyBjaGlsZEZpcnN0XG4gICAgICA6IGNoaWxkRmluZCh0eXBlb2YgbWF0Y2ggPT09IFwiZnVuY3Rpb25cIiA/IG1hdGNoIDogY2hpbGRNYXRjaGVyKG1hdGNoKSkpO1xufVxuIiwgImltcG9ydCB7Y2hpbGRNYXRjaGVyfSBmcm9tIFwiLi4vbWF0Y2hlci5qc1wiO1xuXG52YXIgZmlsdGVyID0gQXJyYXkucHJvdG90eXBlLmZpbHRlcjtcblxuZnVuY3Rpb24gY2hpbGRyZW4oKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKHRoaXMuY2hpbGRyZW4pO1xufVxuXG5mdW5jdGlvbiBjaGlsZHJlbkZpbHRlcihtYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZpbHRlci5jYWxsKHRoaXMuY2hpbGRyZW4sIG1hdGNoKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0QWxsKG1hdGNoID09IG51bGwgPyBjaGlsZHJlblxuICAgICAgOiBjaGlsZHJlbkZpbHRlcih0eXBlb2YgbWF0Y2ggPT09IFwiZnVuY3Rpb25cIiA/IG1hdGNoIDogY2hpbGRNYXRjaGVyKG1hdGNoKSkpO1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IG1hdGNoZXIgZnJvbSBcIi4uL21hdGNoZXIuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgaWYgKHR5cGVvZiBtYXRjaCAhPT0gXCJmdW5jdGlvblwiKSBtYXRjaCA9IG1hdGNoZXIobWF0Y2gpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc3ViZ3JvdXAgPSBzdWJncm91cHNbal0gPSBbXSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiBtYXRjaC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odXBkYXRlKSB7XG4gIHJldHVybiBuZXcgQXJyYXkodXBkYXRlLmxlbmd0aCk7XG59XG4iLCAiaW1wb3J0IHNwYXJzZSBmcm9tIFwiLi9zcGFyc2UuanNcIjtcbmltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odGhpcy5fZW50ZXIgfHwgdGhpcy5fZ3JvdXBzLm1hcChzcGFyc2UpLCB0aGlzLl9wYXJlbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVudGVyTm9kZShwYXJlbnQsIGRhdHVtKSB7XG4gIHRoaXMub3duZXJEb2N1bWVudCA9IHBhcmVudC5vd25lckRvY3VtZW50O1xuICB0aGlzLm5hbWVzcGFjZVVSSSA9IHBhcmVudC5uYW1lc3BhY2VVUkk7XG4gIHRoaXMuX25leHQgPSBudWxsO1xuICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMuX19kYXRhX18gPSBkYXR1bTtcbn1cblxuRW50ZXJOb2RlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEVudGVyTm9kZSxcbiAgYXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uKGNoaWxkKSB7IHJldHVybiB0aGlzLl9wYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCB0aGlzLl9uZXh0KTsgfSxcbiAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihjaGlsZCwgbmV4dCkgeyByZXR1cm4gdGhpcy5fcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgbmV4dCk7IH0sXG4gIHF1ZXJ5U2VsZWN0b3I6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7IHJldHVybiB0aGlzLl9wYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7IH0sXG4gIHF1ZXJ5U2VsZWN0b3JBbGw6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7IHJldHVybiB0aGlzLl9wYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7IH1cbn07XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHg7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQge0VudGVyTm9kZX0gZnJvbSBcIi4vZW50ZXIuanNcIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi4vY29uc3RhbnQuanNcIjtcblxuZnVuY3Rpb24gYmluZEluZGV4KHBhcmVudCwgZ3JvdXAsIGVudGVyLCB1cGRhdGUsIGV4aXQsIGRhdGEpIHtcbiAgdmFyIGkgPSAwLFxuICAgICAgbm9kZSxcbiAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuXG4gIC8vIFB1dCBhbnkgbm9uLW51bGwgbm9kZXMgdGhhdCBmaXQgaW50byB1cGRhdGUuXG4gIC8vIFB1dCBhbnkgbnVsbCBub2RlcyBpbnRvIGVudGVyLlxuICAvLyBQdXQgYW55IHJlbWFpbmluZyBkYXRhIGludG8gZW50ZXIuXG4gIGZvciAoOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBQdXQgYW55IG5vbi1udWxsIG5vZGVzIHRoYXQgZG9uXHUyMDE5dCBmaXQgaW50byBleGl0LlxuICBmb3IgKDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBleGl0W2ldID0gbm9kZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYmluZEtleShwYXJlbnQsIGdyb3VwLCBlbnRlciwgdXBkYXRlLCBleGl0LCBkYXRhLCBrZXkpIHtcbiAgdmFyIGksXG4gICAgICBub2RlLFxuICAgICAgbm9kZUJ5S2V5VmFsdWUgPSBuZXcgTWFwLFxuICAgICAgZ3JvdXBMZW5ndGggPSBncm91cC5sZW5ndGgsXG4gICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICBrZXlWYWx1ZXMgPSBuZXcgQXJyYXkoZ3JvdXBMZW5ndGgpLFxuICAgICAga2V5VmFsdWU7XG5cbiAgLy8gQ29tcHV0ZSB0aGUga2V5IGZvciBlYWNoIG5vZGUuXG4gIC8vIElmIG11bHRpcGxlIG5vZGVzIGhhdmUgdGhlIHNhbWUga2V5LCB0aGUgZHVwbGljYXRlcyBhcmUgYWRkZWQgdG8gZXhpdC5cbiAgZm9yIChpID0gMDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBrZXlWYWx1ZXNbaV0gPSBrZXlWYWx1ZSA9IGtleS5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSArIFwiXCI7XG4gICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlKSkge1xuICAgICAgICBleGl0W2ldID0gbm9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGVCeUtleVZhbHVlLnNldChrZXlWYWx1ZSwgbm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29tcHV0ZSB0aGUga2V5IGZvciBlYWNoIGRhdHVtLlxuICAvLyBJZiB0aGVyZSBhIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMga2V5LCBqb2luIGFuZCBhZGQgaXQgdG8gdXBkYXRlLlxuICAvLyBJZiB0aGVyZSBpcyBub3QgKG9yIHRoZSBrZXkgaXMgYSBkdXBsaWNhdGUpLCBhZGQgaXQgdG8gZW50ZXIuXG4gIGZvciAoaSA9IDA7IGkgPCBkYXRhTGVuZ3RoOyArK2kpIHtcbiAgICBrZXlWYWx1ZSA9IGtleS5jYWxsKHBhcmVudCwgZGF0YVtpXSwgaSwgZGF0YSkgKyBcIlwiO1xuICAgIGlmIChub2RlID0gbm9kZUJ5S2V5VmFsdWUuZ2V0KGtleVZhbHVlKSkge1xuICAgICAgdXBkYXRlW2ldID0gbm9kZTtcbiAgICAgIG5vZGUuX19kYXRhX18gPSBkYXRhW2ldO1xuICAgICAgbm9kZUJ5S2V5VmFsdWUuZGVsZXRlKGtleVZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50ZXJbaV0gPSBuZXcgRW50ZXJOb2RlKHBhcmVudCwgZGF0YVtpXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWRkIGFueSByZW1haW5pbmcgbm9kZXMgdGhhdCB3ZXJlIG5vdCBib3VuZCB0byBkYXRhIHRvIGV4aXQuXG4gIGZvciAoaSA9IDA7IGkgPCBncm91cExlbmd0aDsgKytpKSB7XG4gICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIChub2RlQnlLZXlWYWx1ZS5nZXQoa2V5VmFsdWVzW2ldKSA9PT0gbm9kZSkpIHtcbiAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkYXR1bShub2RlKSB7XG4gIHJldHVybiBub2RlLl9fZGF0YV9fO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIEFycmF5LmZyb20odGhpcywgZGF0dW0pO1xuXG4gIHZhciBiaW5kID0ga2V5ID8gYmluZEtleSA6IGJpbmRJbmRleCxcbiAgICAgIHBhcmVudHMgPSB0aGlzLl9wYXJlbnRzLFxuICAgICAgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdmFsdWUgPSBjb25zdGFudCh2YWx1ZSk7XG5cbiAgZm9yICh2YXIgbSA9IGdyb3Vwcy5sZW5ndGgsIHVwZGF0ZSA9IG5ldyBBcnJheShtKSwgZW50ZXIgPSBuZXcgQXJyYXkobSksIGV4aXQgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgdmFyIHBhcmVudCA9IHBhcmVudHNbal0sXG4gICAgICAgIGdyb3VwID0gZ3JvdXBzW2pdLFxuICAgICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgZGF0YSA9IGFycmF5bGlrZSh2YWx1ZS5jYWxsKHBhcmVudCwgcGFyZW50ICYmIHBhcmVudC5fX2RhdGFfXywgaiwgcGFyZW50cykpLFxuICAgICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICAgIGVudGVyR3JvdXAgPSBlbnRlcltqXSA9IG5ldyBBcnJheShkYXRhTGVuZ3RoKSxcbiAgICAgICAgdXBkYXRlR3JvdXAgPSB1cGRhdGVbal0gPSBuZXcgQXJyYXkoZGF0YUxlbmd0aCksXG4gICAgICAgIGV4aXRHcm91cCA9IGV4aXRbal0gPSBuZXcgQXJyYXkoZ3JvdXBMZW5ndGgpO1xuXG4gICAgYmluZChwYXJlbnQsIGdyb3VwLCBlbnRlckdyb3VwLCB1cGRhdGVHcm91cCwgZXhpdEdyb3VwLCBkYXRhLCBrZXkpO1xuXG4gICAgLy8gTm93IGNvbm5lY3QgdGhlIGVudGVyIG5vZGVzIHRvIHRoZWlyIGZvbGxvd2luZyB1cGRhdGUgbm9kZSwgc3VjaCB0aGF0XG4gICAgLy8gYXBwZW5kQ2hpbGQgY2FuIGluc2VydCB0aGUgbWF0ZXJpYWxpemVkIGVudGVyIG5vZGUgYmVmb3JlIHRoaXMgbm9kZSxcbiAgICAvLyByYXRoZXIgdGhhbiBhdCB0aGUgZW5kIG9mIHRoZSBwYXJlbnQgbm9kZS5cbiAgICBmb3IgKHZhciBpMCA9IDAsIGkxID0gMCwgcHJldmlvdXMsIG5leHQ7IGkwIDwgZGF0YUxlbmd0aDsgKytpMCkge1xuICAgICAgaWYgKHByZXZpb3VzID0gZW50ZXJHcm91cFtpMF0pIHtcbiAgICAgICAgaWYgKGkwID49IGkxKSBpMSA9IGkwICsgMTtcbiAgICAgICAgd2hpbGUgKCEobmV4dCA9IHVwZGF0ZUdyb3VwW2kxXSkgJiYgKytpMSA8IGRhdGFMZW5ndGgpO1xuICAgICAgICBwcmV2aW91cy5fbmV4dCA9IG5leHQgfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGUgPSBuZXcgU2VsZWN0aW9uKHVwZGF0ZSwgcGFyZW50cyk7XG4gIHVwZGF0ZS5fZW50ZXIgPSBlbnRlcjtcbiAgdXBkYXRlLl9leGl0ID0gZXhpdDtcbiAgcmV0dXJuIHVwZGF0ZTtcbn1cblxuLy8gR2l2ZW4gc29tZSBkYXRhLCB0aGlzIHJldHVybnMgYW4gYXJyYXktbGlrZSB2aWV3IG9mIGl0OiBhbiBvYmplY3QgdGhhdFxuLy8gZXhwb3NlcyBhIGxlbmd0aCBwcm9wZXJ0eSBhbmQgYWxsb3dzIG51bWVyaWMgaW5kZXhpbmcuIE5vdGUgdGhhdCB1bmxpa2Vcbi8vIHNlbGVjdEFsbCwgdGhpcyBpc25cdTIwMTl0IHdvcnJpZWQgYWJvdXQgXHUyMDFDbGl2ZVx1MjAxRCBjb2xsZWN0aW9ucyBiZWNhdXNlIHRoZSByZXN1bHRpbmdcbi8vIGFycmF5IHdpbGwgb25seSBiZSB1c2VkIGJyaWVmbHkgd2hpbGUgZGF0YSBpcyBiZWluZyBib3VuZC4gKEl0IGlzIHBvc3NpYmxlIHRvXG4vLyBjYXVzZSB0aGUgZGF0YSB0byBjaGFuZ2Ugd2hpbGUgaXRlcmF0aW5nIGJ5IHVzaW5nIGEga2V5IGZ1bmN0aW9uLCBidXQgcGxlYXNlXG4vLyBkb25cdTIwMTl0OyB3ZVx1MjAxOWQgcmF0aGVyIGF2b2lkIGEgZ3JhdHVpdG91cyBjb3B5LilcbmZ1bmN0aW9uIGFycmF5bGlrZShkYXRhKSB7XG4gIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiAmJiBcImxlbmd0aFwiIGluIGRhdGFcbiAgICA/IGRhdGEgLy8gQXJyYXksIFR5cGVkQXJyYXksIE5vZGVMaXN0LCBhcnJheS1saWtlXG4gICAgOiBBcnJheS5mcm9tKGRhdGEpOyAvLyBNYXAsIFNldCwgaXRlcmFibGUsIHN0cmluZywgb3IgYW55dGhpbmcgZWxzZVxufVxuIiwgImltcG9ydCBzcGFyc2UgZnJvbSBcIi4vc3BhcnNlLmpzXCI7XG5pbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHRoaXMuX2V4aXQgfHwgdGhpcy5fZ3JvdXBzLm1hcChzcGFyc2UpLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvbmVudGVyLCBvbnVwZGF0ZSwgb25leGl0KSB7XG4gIHZhciBlbnRlciA9IHRoaXMuZW50ZXIoKSwgdXBkYXRlID0gdGhpcywgZXhpdCA9IHRoaXMuZXhpdCgpO1xuICBpZiAodHlwZW9mIG9uZW50ZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGVudGVyID0gb25lbnRlcihlbnRlcik7XG4gICAgaWYgKGVudGVyKSBlbnRlciA9IGVudGVyLnNlbGVjdGlvbigpO1xuICB9IGVsc2Uge1xuICAgIGVudGVyID0gZW50ZXIuYXBwZW5kKG9uZW50ZXIgKyBcIlwiKTtcbiAgfVxuICBpZiAob251cGRhdGUgIT0gbnVsbCkge1xuICAgIHVwZGF0ZSA9IG9udXBkYXRlKHVwZGF0ZSk7XG4gICAgaWYgKHVwZGF0ZSkgdXBkYXRlID0gdXBkYXRlLnNlbGVjdGlvbigpO1xuICB9XG4gIGlmIChvbmV4aXQgPT0gbnVsbCkgZXhpdC5yZW1vdmUoKTsgZWxzZSBvbmV4aXQoZXhpdCk7XG4gIHJldHVybiBlbnRlciAmJiB1cGRhdGUgPyBlbnRlci5tZXJnZSh1cGRhdGUpLm9yZGVyKCkgOiB1cGRhdGU7XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgdmFyIHNlbGVjdGlvbiA9IGNvbnRleHQuc2VsZWN0aW9uID8gY29udGV4dC5zZWxlY3Rpb24oKSA6IGNvbnRleHQ7XG5cbiAgZm9yICh2YXIgZ3JvdXBzMCA9IHRoaXMuX2dyb3VwcywgZ3JvdXBzMSA9IHNlbGVjdGlvbi5fZ3JvdXBzLCBtMCA9IGdyb3VwczAubGVuZ3RoLCBtMSA9IGdyb3VwczEubGVuZ3RoLCBtID0gTWF0aC5taW4obTAsIG0xKSwgbWVyZ2VzID0gbmV3IEFycmF5KG0wKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cDAgPSBncm91cHMwW2pdLCBncm91cDEgPSBncm91cHMxW2pdLCBuID0gZ3JvdXAwLmxlbmd0aCwgbWVyZ2UgPSBtZXJnZXNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwMFtpXSB8fCBncm91cDFbaV0pIHtcbiAgICAgICAgbWVyZ2VbaV0gPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBqIDwgbTA7ICsraikge1xuICAgIG1lcmdlc1tqXSA9IGdyb3VwczBbal07XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihtZXJnZXMsIHRoaXMuX3BhcmVudHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IC0xLCBtID0gZ3JvdXBzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IGdyb3VwLmxlbmd0aCAtIDEsIG5leHQgPSBncm91cFtpXSwgbm9kZTsgLS1pID49IDA7KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIGlmIChuZXh0ICYmIG5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24obmV4dCkgXiA0KSBuZXh0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG5leHQpO1xuICAgICAgICBuZXh0ID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29tcGFyZSkge1xuICBpZiAoIWNvbXBhcmUpIGNvbXBhcmUgPSBhc2NlbmRpbmc7XG5cbiAgZnVuY3Rpb24gY29tcGFyZU5vZGUoYSwgYikge1xuICAgIHJldHVybiBhICYmIGIgPyBjb21wYXJlKGEuX19kYXRhX18sIGIuX19kYXRhX18pIDogIWEgLSAhYjtcbiAgfVxuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHNvcnRncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHNvcnRncm91cCA9IHNvcnRncm91cHNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHNvcnRncm91cFtpXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICAgIHNvcnRncm91cC5zb3J0KGNvbXBhcmVOb2RlKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHNvcnRncm91cHMsIHRoaXMuX3BhcmVudHMpLm9yZGVyKCk7XG59XG5cbmZ1bmN0aW9uIGFzY2VuZGluZyhhLCBiKSB7XG4gIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzWzBdO1xuICBhcmd1bWVudHNbMF0gPSB0aGlzO1xuICBjYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICByZXR1cm4gdGhpcztcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20odGhpcyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgIHZhciBub2RlID0gZ3JvdXBbaV07XG4gICAgICBpZiAobm9kZSkgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGxldCBzaXplID0gMDtcbiAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMpICsrc2l6ZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICByZXR1cm4gc2l6ZTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLm5vZGUoKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjYWxsYmFjaykge1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBjYWxsYmFjay5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbiIsICJpbXBvcnQgbmFtZXNwYWNlIGZyb20gXCIuLi9uYW1lc3BhY2UuanNcIjtcblxuZnVuY3Rpb24gYXR0clJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0clJlbW92ZU5TKGZ1bGxuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJDb25zdGFudChuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyQ29uc3RhbnROUyhmdWxsbmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsLCB2YWx1ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJGdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJGdW5jdGlvbk5TKGZ1bGxuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsLCB2KTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIGZ1bGxuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgcmV0dXJuIGZ1bGxuYW1lLmxvY2FsXG4gICAgICAgID8gbm9kZS5nZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpXG4gICAgICAgIDogbm9kZS5nZXRBdHRyaWJ1dGUoZnVsbG5hbWUpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbFxuICAgICAgPyAoZnVsbG5hbWUubG9jYWwgPyBhdHRyUmVtb3ZlTlMgOiBhdHRyUmVtb3ZlKSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyAoZnVsbG5hbWUubG9jYWwgPyBhdHRyRnVuY3Rpb25OUyA6IGF0dHJGdW5jdGlvbilcbiAgICAgIDogKGZ1bGxuYW1lLmxvY2FsID8gYXR0ckNvbnN0YW50TlMgOiBhdHRyQ29uc3RhbnQpKSkoZnVsbG5hbWUsIHZhbHVlKSk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obm9kZSkge1xuICByZXR1cm4gKG5vZGUub3duZXJEb2N1bWVudCAmJiBub2RlLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcpIC8vIG5vZGUgaXMgYSBOb2RlXG4gICAgICB8fCAobm9kZS5kb2N1bWVudCAmJiBub2RlKSAvLyBub2RlIGlzIGEgV2luZG93XG4gICAgICB8fCBub2RlLmRlZmF1bHRWaWV3OyAvLyBub2RlIGlzIGEgRG9jdW1lbnRcbn1cbiIsICJpbXBvcnQgZGVmYXVsdFZpZXcgZnJvbSBcIi4uL3dpbmRvdy5qc1wiO1xuXG5mdW5jdGlvbiBzdHlsZVJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUNvbnN0YW50KG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gICAgZWxzZSB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHYsIHByaW9yaXR5KTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMVxuICAgICAgPyB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgICAgICAgID8gc3R5bGVSZW1vdmUgOiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgPyBzdHlsZUZ1bmN0aW9uXG4gICAgICAgICAgICA6IHN0eWxlQ29uc3RhbnQpKG5hbWUsIHZhbHVlLCBwcmlvcml0eSA9PSBudWxsID8gXCJcIiA6IHByaW9yaXR5KSlcbiAgICAgIDogc3R5bGVWYWx1ZSh0aGlzLm5vZGUoKSwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHlsZVZhbHVlKG5vZGUsIG5hbWUpIHtcbiAgcmV0dXJuIG5vZGUuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKVxuICAgICAgfHwgZGVmYXVsdFZpZXcobm9kZSkuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xufVxuIiwgImZ1bmN0aW9uIHByb3BlcnR5UmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUNvbnN0YW50KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5RnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSBkZWxldGUgdGhpc1tuYW1lXTtcbiAgICBlbHNlIHRoaXNbbmFtZV0gPSB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDFcbiAgICAgID8gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyBwcm9wZXJ0eVJlbW92ZSA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyBwcm9wZXJ0eUZ1bmN0aW9uXG4gICAgICAgICAgOiBwcm9wZXJ0eUNvbnN0YW50KShuYW1lLCB2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpW25hbWVdO1xufVxuIiwgImZ1bmN0aW9uIGNsYXNzQXJyYXkoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcudHJpbSgpLnNwbGl0KC9efFxccysvKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NMaXN0KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuY2xhc3NMaXN0IHx8IG5ldyBDbGFzc0xpc3Qobm9kZSk7XG59XG5cbmZ1bmN0aW9uIENsYXNzTGlzdChub2RlKSB7XG4gIHRoaXMuX25vZGUgPSBub2RlO1xuICB0aGlzLl9uYW1lcyA9IGNsYXNzQXJyYXkobm9kZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKTtcbn1cblxuQ2xhc3NMaXN0LnByb3RvdHlwZSA9IHtcbiAgYWRkOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuICAgIGlmIChpIDwgMCkge1xuICAgICAgdGhpcy5fbmFtZXMucHVzaChuYW1lKTtcbiAgICAgIHRoaXMuX25vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy5fbmFtZXMuam9pbihcIiBcIikpO1xuICAgIH1cbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuICAgIGlmIChpID49IDApIHtcbiAgICAgIHRoaXMuX25hbWVzLnNwbGljZShpLCAxKTtcbiAgICAgIHRoaXMuX25vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy5fbmFtZXMuam9pbihcIiBcIikpO1xuICAgIH1cbiAgfSxcbiAgY29udGFpbnM6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKSA+PSAwO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjbGFzc2VkQWRkKG5vZGUsIG5hbWVzKSB7XG4gIHZhciBsaXN0ID0gY2xhc3NMaXN0KG5vZGUpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gIHdoaWxlICgrK2kgPCBuKSBsaXN0LmFkZChuYW1lc1tpXSk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRSZW1vdmUobm9kZSwgbmFtZXMpIHtcbiAgdmFyIGxpc3QgPSBjbGFzc0xpc3Qobm9kZSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIGxpc3QucmVtb3ZlKG5hbWVzW2ldKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZFRydWUobmFtZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNsYXNzZWRBZGQodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkRmFsc2UobmFtZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNsYXNzZWRSZW1vdmUodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkRnVuY3Rpb24obmFtZXMsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAodmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKSA/IGNsYXNzZWRBZGQgOiBjbGFzc2VkUmVtb3ZlKSh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBuYW1lcyA9IGNsYXNzQXJyYXkobmFtZSArIFwiXCIpO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBsaXN0ID0gY2xhc3NMaXN0KHRoaXMubm9kZSgpKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWxpc3QuY29udGFpbnMobmFtZXNbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBjbGFzc2VkRnVuY3Rpb24gOiB2YWx1ZVxuICAgICAgPyBjbGFzc2VkVHJ1ZVxuICAgICAgOiBjbGFzc2VkRmFsc2UpKG5hbWVzLCB2YWx1ZSkpO1xufVxuIiwgImZ1bmN0aW9uIHRleHRSZW1vdmUoKSB7XG4gIHRoaXMudGV4dENvbnRlbnQgPSBcIlwiO1xufVxuXG5mdW5jdGlvbiB0ZXh0Q29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdGV4dEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy50ZXh0Q29udGVudCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godmFsdWUgPT0gbnVsbFxuICAgICAgICAgID8gdGV4dFJlbW92ZSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gdGV4dEZ1bmN0aW9uXG4gICAgICAgICAgOiB0ZXh0Q29uc3RhbnQpKHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKCkudGV4dENvbnRlbnQ7XG59XG4iLCAiZnVuY3Rpb24gaHRtbFJlbW92ZSgpIHtcbiAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xufVxuXG5mdW5jdGlvbiBodG1sQ29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWxGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdiA9PSBudWxsID8gXCJcIiA6IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyBodG1sUmVtb3ZlIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyBodG1sRnVuY3Rpb25cbiAgICAgICAgICA6IGh0bWxDb25zdGFudCkodmFsdWUpKVxuICAgICAgOiB0aGlzLm5vZGUoKS5pbm5lckhUTUw7XG59XG4iLCAiZnVuY3Rpb24gcmFpc2UoKSB7XG4gIGlmICh0aGlzLm5leHRTaWJsaW5nKSB0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGhpcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKHJhaXNlKTtcbn1cbiIsICJmdW5jdGlvbiBsb3dlcigpIHtcbiAgaWYgKHRoaXMucHJldmlvdXNTaWJsaW5nKSB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMsIHRoaXMucGFyZW50Tm9kZS5maXJzdENoaWxkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gobG93ZXIpO1xufVxuIiwgImltcG9ydCBjcmVhdG9yIGZyb20gXCIuLi9jcmVhdG9yLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGNyZWF0ZSA9IHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lIDogY3JlYXRvcihuYW1lKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmFwcGVuZENoaWxkKGNyZWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfSk7XG59XG4iLCAiaW1wb3J0IGNyZWF0b3IgZnJvbSBcIi4uL2NyZWF0b3IuanNcIjtcbmltcG9ydCBzZWxlY3RvciBmcm9tIFwiLi4vc2VsZWN0b3IuanNcIjtcblxuZnVuY3Rpb24gY29uc3RhbnROdWxsKCkge1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgYmVmb3JlKSB7XG4gIHZhciBjcmVhdGUgPSB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZSA6IGNyZWF0b3IobmFtZSksXG4gICAgICBzZWxlY3QgPSBiZWZvcmUgPT0gbnVsbCA/IGNvbnN0YW50TnVsbCA6IHR5cGVvZiBiZWZvcmUgPT09IFwiZnVuY3Rpb25cIiA/IGJlZm9yZSA6IHNlbGVjdG9yKGJlZm9yZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUoY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHNlbGVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IG51bGwpO1xuICB9KTtcbn1cbiIsICJmdW5jdGlvbiByZW1vdmUoKSB7XG4gIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gIGlmIChwYXJlbnQpIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gocmVtb3ZlKTtcbn1cbiIsICJmdW5jdGlvbiBzZWxlY3Rpb25fY2xvbmVTaGFsbG93KCkge1xuICB2YXIgY2xvbmUgPSB0aGlzLmNsb25lTm9kZShmYWxzZSksIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5pbnNlcnRCZWZvcmUoY2xvbmUsIHRoaXMubmV4dFNpYmxpbmcpIDogY2xvbmU7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9jbG9uZURlZXAoKSB7XG4gIHZhciBjbG9uZSA9IHRoaXMuY2xvbmVOb2RlKHRydWUpLCBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNsb25lLCB0aGlzLm5leHRTaWJsaW5nKSA6IGNsb25lO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihkZWVwKSB7XG4gIHJldHVybiB0aGlzLnNlbGVjdChkZWVwID8gc2VsZWN0aW9uX2Nsb25lRGVlcCA6IHNlbGVjdGlvbl9jbG9uZVNoYWxsb3cpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiLCB2YWx1ZSlcbiAgICAgIDogdGhpcy5ub2RlKCkuX19kYXRhX187XG59XG4iLCAiZnVuY3Rpb24gY29udGV4dExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZXZlbnQsIHRoaXMuX19kYXRhX18pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZXMpIHtcbiAgcmV0dXJuIHR5cGVuYW1lcy50cmltKCkuc3BsaXQoL158XFxzKy8pLm1hcChmdW5jdGlvbih0KSB7XG4gICAgdmFyIG5hbWUgPSBcIlwiLCBpID0gdC5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAoaSA+PSAwKSBuYW1lID0gdC5zbGljZShpICsgMSksIHQgPSB0LnNsaWNlKDAsIGkpO1xuICAgIHJldHVybiB7dHlwZTogdCwgbmFtZTogbmFtZX07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBvblJlbW92ZSh0eXBlbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9uID0gdGhpcy5fX29uO1xuICAgIGlmICghb24pIHJldHVybjtcbiAgICBmb3IgKHZhciBqID0gMCwgaSA9IC0xLCBtID0gb24ubGVuZ3RoLCBvOyBqIDwgbTsgKytqKSB7XG4gICAgICBpZiAobyA9IG9uW2pdLCAoIXR5cGVuYW1lLnR5cGUgfHwgby50eXBlID09PSB0eXBlbmFtZS50eXBlKSAmJiBvLm5hbWUgPT09IHR5cGVuYW1lLm5hbWUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciwgby5vcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uWysraV0gPSBvO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKytpKSBvbi5sZW5ndGggPSBpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX19vbjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25BZGQodHlwZW5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb24gPSB0aGlzLl9fb24sIG8sIGxpc3RlbmVyID0gY29udGV4dExpc3RlbmVyKHZhbHVlKTtcbiAgICBpZiAob24pIGZvciAodmFyIGogPSAwLCBtID0gb24ubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgICBpZiAoKG8gPSBvbltqXSkudHlwZSA9PT0gdHlwZW5hbWUudHlwZSAmJiBvLm5hbWUgPT09IHR5cGVuYW1lLm5hbWUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciwgby5vcHRpb25zKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciA9IGxpc3RlbmVyLCBvLm9wdGlvbnMgPSBvcHRpb25zKTtcbiAgICAgICAgby52YWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0eXBlbmFtZS50eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG4gICAgbyA9IHt0eXBlOiB0eXBlbmFtZS50eXBlLCBuYW1lOiB0eXBlbmFtZS5uYW1lLCB2YWx1ZTogdmFsdWUsIGxpc3RlbmVyOiBsaXN0ZW5lciwgb3B0aW9uczogb3B0aW9uc307XG4gICAgaWYgKCFvbikgdGhpcy5fX29uID0gW29dO1xuICAgIGVsc2Ugb24ucHVzaChvKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odHlwZW5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHZhciB0eXBlbmFtZXMgPSBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZSArIFwiXCIpLCBpLCBuID0gdHlwZW5hbWVzLmxlbmd0aCwgdDtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgb24gPSB0aGlzLm5vZGUoKS5fX29uO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGgsIG87IGogPCBtOyArK2opIHtcbiAgICAgIGZvciAoaSA9IDAsIG8gPSBvbltqXTsgaSA8IG47ICsraSkge1xuICAgICAgICBpZiAoKHQgPSB0eXBlbmFtZXNbaV0pLnR5cGUgPT09IG8udHlwZSAmJiB0Lm5hbWUgPT09IG8ubmFtZSkge1xuICAgICAgICAgIHJldHVybiBvLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIG9uID0gdmFsdWUgPyBvbkFkZCA6IG9uUmVtb3ZlO1xuICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB0aGlzLmVhY2gob24odHlwZW5hbWVzW2ldLCB2YWx1ZSwgb3B0aW9ucykpO1xuICByZXR1cm4gdGhpcztcbn1cbiIsICJpbXBvcnQgZGVmYXVsdFZpZXcgZnJvbSBcIi4uL3dpbmRvdy5qc1wiO1xuXG5mdW5jdGlvbiBkaXNwYXRjaEV2ZW50KG5vZGUsIHR5cGUsIHBhcmFtcykge1xuICB2YXIgd2luZG93ID0gZGVmYXVsdFZpZXcobm9kZSksXG4gICAgICBldmVudCA9IHdpbmRvdy5DdXN0b21FdmVudDtcblxuICBpZiAodHlwZW9mIGV2ZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBldmVudCA9IG5ldyBldmVudCh0eXBlLCBwYXJhbXMpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50ID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiRXZlbnRcIik7XG4gICAgaWYgKHBhcmFtcykgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSksIGV2ZW50LmRldGFpbCA9IHBhcmFtcy5kZXRhaWw7XG4gICAgZWxzZSBldmVudC5pbml0RXZlbnQodHlwZSwgZmFsc2UsIGZhbHNlKTtcbiAgfVxuXG4gIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoQ29uc3RhbnQodHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2hFdmVudCh0aGlzLCB0eXBlLCBwYXJhbXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaEZ1bmN0aW9uKHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoRXZlbnQodGhpcywgdHlwZSwgcGFyYW1zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaCgodHlwZW9mIHBhcmFtcyA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGRpc3BhdGNoRnVuY3Rpb25cbiAgICAgIDogZGlzcGF0Y2hDb25zdGFudCkodHlwZSwgcGFyYW1zKSk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24qKCkge1xuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZTsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgeWllbGQgbm9kZTtcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgc2VsZWN0aW9uX3NlbGVjdCBmcm9tIFwiLi9zZWxlY3QuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2VsZWN0QWxsIGZyb20gXCIuL3NlbGVjdEFsbC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3RDaGlsZCBmcm9tIFwiLi9zZWxlY3RDaGlsZC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3RDaGlsZHJlbiBmcm9tIFwiLi9zZWxlY3RDaGlsZHJlbi5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9maWx0ZXIgZnJvbSBcIi4vZmlsdGVyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2RhdGEgZnJvbSBcIi4vZGF0YS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9lbnRlciBmcm9tIFwiLi9lbnRlci5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9leGl0IGZyb20gXCIuL2V4aXQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fam9pbiBmcm9tIFwiLi9qb2luLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX21lcmdlIGZyb20gXCIuL21lcmdlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX29yZGVyIGZyb20gXCIuL29yZGVyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NvcnQgZnJvbSBcIi4vc29ydC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9jYWxsIGZyb20gXCIuL2NhbGwuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbm9kZXMgZnJvbSBcIi4vbm9kZXMuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbm9kZSBmcm9tIFwiLi9ub2RlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NpemUgZnJvbSBcIi4vc2l6ZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9lbXB0eSBmcm9tIFwiLi9lbXB0eS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9lYWNoIGZyb20gXCIuL2VhY2guanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fYXR0ciBmcm9tIFwiLi9hdHRyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3N0eWxlIGZyb20gXCIuL3N0eWxlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3Byb3BlcnR5IGZyb20gXCIuL3Byb3BlcnR5LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2NsYXNzZWQgZnJvbSBcIi4vY2xhc3NlZC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl90ZXh0IGZyb20gXCIuL3RleHQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25faHRtbCBmcm9tIFwiLi9odG1sLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3JhaXNlIGZyb20gXCIuL3JhaXNlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2xvd2VyIGZyb20gXCIuL2xvd2VyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2FwcGVuZCBmcm9tIFwiLi9hcHBlbmQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25faW5zZXJ0IGZyb20gXCIuL2luc2VydC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9yZW1vdmUgZnJvbSBcIi4vcmVtb3ZlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2Nsb25lIGZyb20gXCIuL2Nsb25lLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2RhdHVtIGZyb20gXCIuL2RhdHVtLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX29uIGZyb20gXCIuL29uLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2Rpc3BhdGNoIGZyb20gXCIuL2Rpc3BhdGNoLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2l0ZXJhdG9yIGZyb20gXCIuL2l0ZXJhdG9yLmpzXCI7XG5cbmV4cG9ydCB2YXIgcm9vdCA9IFtudWxsXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFNlbGVjdGlvbihncm91cHMsIHBhcmVudHMpIHtcbiAgdGhpcy5fZ3JvdXBzID0gZ3JvdXBzO1xuICB0aGlzLl9wYXJlbnRzID0gcGFyZW50cztcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbihbW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudF1dLCByb290KTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX3NlbGVjdGlvbigpIHtcbiAgcmV0dXJuIHRoaXM7XG59XG5cblNlbGVjdGlvbi5wcm90b3R5cGUgPSBzZWxlY3Rpb24ucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogU2VsZWN0aW9uLFxuICBzZWxlY3Q6IHNlbGVjdGlvbl9zZWxlY3QsXG4gIHNlbGVjdEFsbDogc2VsZWN0aW9uX3NlbGVjdEFsbCxcbiAgc2VsZWN0Q2hpbGQ6IHNlbGVjdGlvbl9zZWxlY3RDaGlsZCxcbiAgc2VsZWN0Q2hpbGRyZW46IHNlbGVjdGlvbl9zZWxlY3RDaGlsZHJlbixcbiAgZmlsdGVyOiBzZWxlY3Rpb25fZmlsdGVyLFxuICBkYXRhOiBzZWxlY3Rpb25fZGF0YSxcbiAgZW50ZXI6IHNlbGVjdGlvbl9lbnRlcixcbiAgZXhpdDogc2VsZWN0aW9uX2V4aXQsXG4gIGpvaW46IHNlbGVjdGlvbl9qb2luLFxuICBtZXJnZTogc2VsZWN0aW9uX21lcmdlLFxuICBzZWxlY3Rpb246IHNlbGVjdGlvbl9zZWxlY3Rpb24sXG4gIG9yZGVyOiBzZWxlY3Rpb25fb3JkZXIsXG4gIHNvcnQ6IHNlbGVjdGlvbl9zb3J0LFxuICBjYWxsOiBzZWxlY3Rpb25fY2FsbCxcbiAgbm9kZXM6IHNlbGVjdGlvbl9ub2RlcyxcbiAgbm9kZTogc2VsZWN0aW9uX25vZGUsXG4gIHNpemU6IHNlbGVjdGlvbl9zaXplLFxuICBlbXB0eTogc2VsZWN0aW9uX2VtcHR5LFxuICBlYWNoOiBzZWxlY3Rpb25fZWFjaCxcbiAgYXR0cjogc2VsZWN0aW9uX2F0dHIsXG4gIHN0eWxlOiBzZWxlY3Rpb25fc3R5bGUsXG4gIHByb3BlcnR5OiBzZWxlY3Rpb25fcHJvcGVydHksXG4gIGNsYXNzZWQ6IHNlbGVjdGlvbl9jbGFzc2VkLFxuICB0ZXh0OiBzZWxlY3Rpb25fdGV4dCxcbiAgaHRtbDogc2VsZWN0aW9uX2h0bWwsXG4gIHJhaXNlOiBzZWxlY3Rpb25fcmFpc2UsXG4gIGxvd2VyOiBzZWxlY3Rpb25fbG93ZXIsXG4gIGFwcGVuZDogc2VsZWN0aW9uX2FwcGVuZCxcbiAgaW5zZXJ0OiBzZWxlY3Rpb25faW5zZXJ0LFxuICByZW1vdmU6IHNlbGVjdGlvbl9yZW1vdmUsXG4gIGNsb25lOiBzZWxlY3Rpb25fY2xvbmUsXG4gIGRhdHVtOiBzZWxlY3Rpb25fZGF0dW0sXG4gIG9uOiBzZWxlY3Rpb25fb24sXG4gIGRpc3BhdGNoOiBzZWxlY3Rpb25fZGlzcGF0Y2gsXG4gIFtTeW1ib2wuaXRlcmF0b3JdOiBzZWxlY3Rpb25faXRlcmF0b3Jcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlbGVjdGlvbjtcbiIsICJpbXBvcnQge1NlbGVjdGlvbiwgcm9vdH0gZnJvbSBcIi4vc2VsZWN0aW9uL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCJcbiAgICAgID8gbmV3IFNlbGVjdGlvbihbW2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXV0sIFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRdKVxuICAgICAgOiBuZXcgU2VsZWN0aW9uKFtbc2VsZWN0b3JdXSwgcm9vdCk7XG59XG4iLCAiaW1wb3J0IHsgc2NhbGVPcmRpbmFsIH0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHsgc2NoZW1lVGFibGVhdTEwIH0gZnJvbSAnZDMtc2NhbGUtY2hyb21hdGljJztcbmltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgeyBNZW51LCBzZXRJY29uIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHR5cGUgeyBSZW5kZXJTZXR0aW5ncywgUm90YXRpb25QcmVzZXQsIFdvcmRDbG91ZFJlbmRlck9wdGlvbnMsIFdvcmRUZXh0TWV0cmljLCBXZWlnaHRlZFdvcmQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmZ1bmN0aW9uIGJ1aWxkRGV0ZXJtaW5pc3RpY1JhbmRvbShzZWVkOiBudW1iZXIpOiAoKSA9PiBudW1iZXIge1xuICBsZXQgc3RhdGUgPSBzZWVkID4+PiAwO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHN0YXRlID0gKHN0YXRlICsgMHg2RDJCNzlGNSkgfCAwO1xuICAgIGxldCB0ID0gTWF0aC5pbXVsKHN0YXRlIF4gKHN0YXRlID4+PiAxNSksIDEgfCBzdGF0ZSk7XG4gICAgdCA9ICh0ICsgTWF0aC5pbXVsKHQgXiAodCA+Pj4gNyksIDYxIHwgdCkpIF4gdDtcbiAgICByZXR1cm4gKCh0IF4gKHQgPj4+IDE0KSkgPj4+IDApIC8gNDI5NDk2NzI5NjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcGlja1JvdGF0aW9uKHJhbmRvbTogKCkgPT4gbnVtYmVyLCBwcmVzZXQ6IFJvdGF0aW9uUHJlc2V0KTogbnVtYmVyIHtcbiAgaWYgKHByZXNldCA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAocHJlc2V0ID09PSAnbW9zdGx5LWhvcml6b250YWwnKSB7XG4gICAgcmV0dXJuIHJhbmRvbSgpID4gMC44NSA/IDkwIDogMDtcbiAgfVxuXG4gIGlmIChwcmVzZXQgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICByZXR1cm4gcmFuZG9tKCkgPiAwLjIgPyA5MCA6IDA7XG4gIH1cblxuICBjb25zdCBhbmdsZXMgPSBbLTkwLCAtNDUsIDAsIDQ1LCA5MF07XG4gIHJldHVybiBhbmdsZXNbTWF0aC5mbG9vcihyYW5kb20oKSAqIGFuZ2xlcy5sZW5ndGgpXTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0V29yZE1ldHJpY1ZhbHVlKFxuICB3b3JkOiBXZWlnaHRlZFdvcmQsXG4gIHRvdGFsQ291bnQ6IG51bWJlcixcbiAgbWV0cmljOiBXb3JkVGV4dE1ldHJpYyxcbik6IHN0cmluZyB7XG4gIGlmIChtZXRyaWMgPT09ICdmcmVxdWVuY3knKSB7XG4gICAgY29uc3QgcGVyY2VudCA9ICh3b3JkLmNvdW50IC8gTWF0aC5tYXgoMSwgdG90YWxDb3VudCkpICogMTAwO1xuICAgIHJldHVybiBgJHtwZXJjZW50LnRvRml4ZWQocGVyY2VudCA+PSAxMCA/IDEgOiAyKS5yZXBsYWNlKC9cXC4/MCskLywgJycpfSVgO1xuICB9XG5cbiAgcmV0dXJuIFN0cmluZyh3b3JkLmNvdW50KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0V29yZFRpdGxlKHdvcmQ6IFdlaWdodGVkV29yZCwgdG90YWxDb3VudDogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke3dvcmQudGV4dH0gKCR7d29yZC5jb3VudH0sICR7Zm9ybWF0V29yZE1ldHJpY1ZhbHVlKHdvcmQsIHRvdGFsQ291bnQsICdmcmVxdWVuY3knKX0pYDtcbn1cblxuZnVuY3Rpb24gZ2V0V29yZExhYmVsKHdvcmQ6IFdlaWdodGVkV29yZCwgcmVuZGVyU2V0dGluZ3M6IFJlbmRlclNldHRpbmdzLCB0b3RhbENvdW50OiBudW1iZXIsIG1ldHJpYzogV29yZFRleHRNZXRyaWMpOiBzdHJpbmcge1xuICBpZiAoIXJlbmRlclNldHRpbmdzLnNob3dDb3VudEluV29yZFRleHQgfHwgd29yZC5jb3VudCA8IHJlbmRlclNldHRpbmdzLmNvdW50TGFiZWxNaW5Db3VudCkge1xuICAgIHJldHVybiB3b3JkLnRleHQ7XG4gIH1cblxuICBjb25zdCBmb3JtYXR0ZWRWYWx1ZSA9IGZvcm1hdFdvcmRNZXRyaWNWYWx1ZSh3b3JkLCB0b3RhbENvdW50LCBtZXRyaWMpO1xuXG4gIGlmIChyZW5kZXJTZXR0aW5ncy5jb3VudExhYmVsRm9ybWF0ID09PSAnZG90Jykge1xuICAgIHJldHVybiBgJHt3b3JkLnRleHR9IFx1MDBCNyAke2Zvcm1hdHRlZFZhbHVlfWA7XG4gIH1cblxuICBpZiAocmVuZGVyU2V0dGluZ3MuY291bnRMYWJlbEZvcm1hdCA9PT0gJ2NvbG9uJykge1xuICAgIHJldHVybiBgJHt3b3JkLnRleHR9OiAke2Zvcm1hdHRlZFZhbHVlfWA7XG4gIH1cblxuICByZXR1cm4gYCR7d29yZC50ZXh0fSAoJHtmb3JtYXR0ZWRWYWx1ZX0pYDtcbn1cblxudHlwZSBMYXlvdXRXb3JkID0gV2VpZ2h0ZWRXb3JkICYge1xuICBiYXNlVGV4dDogc3RyaW5nO1xuICBsYXlvdXRUZXh0OiBzdHJpbmc7XG59O1xuXG50eXBlIFZpZXdwb3J0Q29udHJvbHMgPSB7XG4gIHpvb21JbjogKCkgPT4gdm9pZDtcbiAgem9vbU91dDogKCkgPT4gdm9pZDtcbiAgcmVzZXRWaWV3OiAoKSA9PiB2b2lkO1xuICBzaG91bGRTdXBwcmVzc1dvcmRDbGljazogKCkgPT4gYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkcmF3V29yZENsb3VkKG9wdGlvbnM6IFdvcmRDbG91ZFJlbmRlck9wdGlvbnMsIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7XG4gICAgY29udGFpbmVyRWwsXG4gICAgd29yZHMsXG4gICAgYXJpYUxhYmVsLFxuICAgIG9uV29yZENsaWNrLFxuICAgIG9uRXhjbHVkZUluQ2xvdWQsXG4gICAgb25FeGNsdWRlSW5WYXVsdCxcbiAgICBvblByb2dyZXNzLFxuICAgIG9uUmVmcmVzaCxcbiAgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGV4cG9ydEJhc2VOYW1lID0gc2FuaXRpemVGaWxlTmFtZShvcHRpb25zLmV4cG9ydEJhc2VOYW1lID8/ICd3b3JkLWNsb3VkJyk7XG4gIGNvbnN0IGVuYWJsZUV4cG9ydCA9IG9wdGlvbnMuZW5hYmxlRXhwb3J0ID8/IHRydWU7XG4gIGNvbnN0IGVuYWJsZU92ZXJsYXlDb250cm9scyA9IG9wdGlvbnMuZW5hYmxlT3ZlcmxheUNvbnRyb2xzID8/IHRydWU7XG4gIGNvbnN0IGVuYWJsZVZpZXdwb3J0SW50ZXJhY3Rpb24gPSBvcHRpb25zLmVuYWJsZVZpZXdwb3J0SW50ZXJhY3Rpb24gPz8gdHJ1ZTtcbiAgY29uc3Qgc2hvd1JlZnJlc2hDb250cm9sID0gb3B0aW9ucy5zaG93UmVmcmVzaENvbnRyb2wgPz8gdHJ1ZTtcbiAgY29uc3Qgc2hvd1pvb21Db250cm9scyA9IG9wdGlvbnMuc2hvd1pvb21Db250cm9scyA/PyB0cnVlO1xuICBjb25zdCBzaG93RWRpdENvbnRyb2wgPSBvcHRpb25zLnNob3dFZGl0Q29udHJvbCA/PyBmYWxzZTtcbiAgY29uc3Qgd2lkdGggPSBNYXRoLm1heCgzMjAsIGNvbnRhaW5lckVsLmNsaWVudFdpZHRoIHx8IDcwMCk7XG4gIGNvbnN0IGhlaWdodCA9IE1hdGgubWF4KDMyMCwgY29udGFpbmVyRWwuY2xpZW50SGVpZ2h0IHx8IDUwMCk7XG4gIGNvbnN0IHJhbmRvbSA9IHJlbmRlclNldHRpbmdzLmRldGVybWluaXN0aWNMYXlvdXQgPyBidWlsZERldGVybWluaXN0aWNSYW5kb20ocmVuZGVyU2V0dGluZ3MucmFuZG9tU2VlZCkgOiBNYXRoLnJhbmRvbTtcbiAgY29uc3QgdG90YWxXb3JkQ291bnQgPSB3b3Jkcy5yZWR1Y2UoKHRvdGFsLCB3b3JkKSA9PiB0b3RhbCArIHdvcmQuY291bnQsIDApO1xuICBsZXQgYWN0aXZlV29yZFRleHRNZXRyaWM6IFdvcmRUZXh0TWV0cmljID0gcmVuZGVyU2V0dGluZ3Mud29yZFRleHRNZXRyaWM7XG4gIGNvbnN0IGxheW91dFdvcmRzOiBMYXlvdXRXb3JkW10gPSB3b3Jkcy5tYXAoKHdvcmQpID0+ICh7XG4gICAgLi4ud29yZCxcbiAgICBiYXNlVGV4dDogd29yZC50ZXh0LFxuICAgIGxheW91dFRleHQ6IGdldFdvcmRMYWJlbCh3b3JkLCByZW5kZXJTZXR0aW5ncywgdG90YWxXb3JkQ291bnQsIGFjdGl2ZVdvcmRUZXh0TWV0cmljKSxcbiAgfSkpO1xuXG4gIGNvbnRhaW5lckVsLmNsYXNzTGlzdC5hZGQoJ3dvcmQtY2xvdWQtcmVuZGVyLWNvbnRhaW5lcicpO1xuXG4gIGNvbnN0IHN2ZyA9IHNlbGVjdChjb250YWluZXJFbClcbiAgICAuYXBwZW5kKCdzdmcnKVxuICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXG4gICAgLmF0dHIoJ3JvbGUnLCAnaW1nJylcbiAgICAuYXR0cignYXJpYS1sYWJlbCcsIGFyaWFMYWJlbCk7XG5cbiAgY29uc3Qgdmlld3BvcnRHcm91cCA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd3b3JkLWNsb3VkLXZpZXdwb3J0Jyk7XG4gIGNvbnN0IGcgPSB2aWV3cG9ydEdyb3VwLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt3aWR0aCAvIDJ9LCR7aGVpZ2h0IC8gMn0pYCk7XG4gIGNvbnN0IHZpZXdwb3J0Q29udHJvbHMgPSBlbmFibGVWaWV3cG9ydEludGVyYWN0aW9uXG4gICAgPyBzZXR1cFZpZXdwb3J0Q29udHJvbHMoc3ZnLm5vZGUoKSwgdmlld3BvcnRHcm91cC5ub2RlKCksIHdpZHRoLCBoZWlnaHQpXG4gICAgOiBjcmVhdGVTdGF0aWNWaWV3cG9ydENvbnRyb2xzKCk7XG5cbiAgY29uc3QgY29sb3IgPSBzY2FsZU9yZGluYWw8c3RyaW5nLCBzdHJpbmc+KHNjaGVtZVRhYmxlYXUxMCk7XG4gIGNvbnN0IHsgZGVmYXVsdDogY2xvdWQgfSA9IGF3YWl0IGltcG9ydCgnZDMtY2xvdWQnKTtcbiAgY29uc3QgcGVyZm9ybWFuY2UgPSBnZXRMYXlvdXRQZXJmb3JtYW5jZVByb2ZpbGUocmVuZGVyU2V0dGluZ3MucHJvZ3Jlc3NEZXRhaWwpO1xuICBjb25zdCByZXBvcnRQcm9ncmVzcyA9IGNyZWF0ZVRocm90dGxlZFByb2dyZXNzKG9uUHJvZ3Jlc3MsIHBlcmZvcm1hbmNlLnByb2dyZXNzVGhyb3R0bGVNcyk7XG4gIGNvbnN0IGxheW91dFRpbWVJbnRlcnZhbCA9IHJlbmRlclNldHRpbmdzLnByb2dyZXNzRGV0YWlsID09PSAndW5oaW5nZWQnXG4gICAgPyBJbmZpbml0eVxuICAgIDogTWF0aC5tYXgoOCwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy5sYXlvdXRUaW1lSW50ZXJ2YWxNcykpO1xuXG4gIGF3YWl0IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IGxhaWRPdXRXb3JkcyA9IDA7XG4gICAgY29uc3QgdG90YWxXb3JkcyA9IE1hdGgubWF4KDEsIGxheW91dFdvcmRzLmxlbmd0aCk7XG5cbiAgICBjbG91ZDxMYXlvdXRXb3JkPigpXG4gICAgICAuc2l6ZShbd2lkdGgsIGhlaWdodF0pXG4gICAgICAud29yZHMobGF5b3V0V29yZHMpXG4gICAgICAudGV4dCgoZCkgPT4gZC5sYXlvdXRUZXh0KVxuICAgICAgLnRpbWVJbnRlcnZhbChsYXlvdXRUaW1lSW50ZXJ2YWwpXG4gICAgICAucGFkZGluZyhNYXRoLm1heCgwLCBNYXRoLnJvdW5kKHJlbmRlclNldHRpbmdzLndvcmRQYWRkaW5nKSkpXG4gICAgICAuc3BpcmFsKHJlbmRlclNldHRpbmdzLnNwaXJhbClcbiAgICAgIC5yb3RhdGUoKCkgPT4gcGlja1JvdGF0aW9uKHJhbmRvbSwgcmVuZGVyU2V0dGluZ3Mucm90YXRpb25QcmVzZXQpKVxuICAgICAgLmZvbnQocmVuZGVyU2V0dGluZ3MuZm9udEZhbWlseSB8fCAnc2Fucy1zZXJpZicpXG4gICAgICAuZm9udFNpemUoKGQpID0+IGQuc2l6ZSlcbiAgICAgIC5yYW5kb20ocmFuZG9tKVxuICAgICAgLm9uKCd3b3JkJywgKCkgPT4ge1xuICAgICAgICBsYWlkT3V0V29yZHMgKz0gMTtcbiAgICAgICAgaWYgKGxhaWRPdXRXb3JkcyAlIHBlcmZvcm1hbmNlLndvcmRQcm9ncmVzc1N0cmlkZSA9PT0gMCkge1xuICAgICAgICAgIGNvbnN0IGxheW91dFBlcmNlbnQgPSBNYXRoLm1pbig5OSwgTWF0aC5yb3VuZCgobGFpZE91dFdvcmRzIC8gdG90YWxXb3JkcykgKiAxMDApKTtcbiAgICAgICAgICByZXBvcnRQcm9ncmVzcyhgTGF5aW5nIG91dCB3b3Jkcy4uLiAke2xhaWRPdXRXb3Jkc30vJHtsYXlvdXRXb3Jkcy5sZW5ndGh9YCwgbGF5b3V0UGVyY2VudCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAub24oJ2VuZCcsIChsYXlvdXRXb3JkcykgPT4ge1xuICAgICAgICBjb25zdCB0ZXh0U2VsZWN0aW9uID0gZy5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgICAgIC5kYXRhKGxheW91dFdvcmRzKVxuICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLCAoZCkgPT4gYCR7ZC5zaXplfXB4YClcbiAgICAgICAgICAuc3R5bGUoJ2ZvbnQtZmFtaWx5JywgcmVuZGVyU2V0dGluZ3MuZm9udEZhbWlseSB8fCAnc2Fucy1zZXJpZicpXG4gICAgICAgICAgLnN0eWxlKCdmaWxsJywgKF8sIGkpID0+IGNvbG9yKFN0cmluZyhpKSkpXG4gICAgICAgICAgLnN0eWxlKCdjdXJzb3InLCAncG9pbnRlcicpXG4gICAgICAgICAgLmF0dHIoJ3RhYmluZGV4JywgMClcbiAgICAgICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpID0+IGB0cmFuc2xhdGUoJHtkLnh9LCR7ZC55fSkgcm90YXRlKCR7ZC5yb3RhdGV9KWApXG4gICAgICAgICAgLnRleHQoKGQpID0+IGQubGF5b3V0VGV4dClcbiAgICAgICAgICAub24oJ2NsaWNrJywgKF8sIGQpID0+IHtcbiAgICAgICAgICAgIGlmICh2aWV3cG9ydENvbnRyb2xzLnNob3VsZFN1cHByZXNzV29yZENsaWNrKCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25Xb3JkQ2xpY2soZC5iYXNlVGV4dCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAub24oJ2tleWRvd24nLCAoZXZlbnQ6IEtleWJvYXJkRXZlbnQsIGQpID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicgfHwgZXZlbnQua2V5ID09PSAnICcpIHtcbiAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgb25Xb3JkQ2xpY2soZC5iYXNlVGV4dCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKChvbkV4Y2x1ZGVJbkNsb3VkIHx8IG9uRXhjbHVkZUluVmF1bHQpICYmIChldmVudC5rZXkgPT09ICdDb250ZXh0TWVudScgfHwgKGV2ZW50LnNoaWZ0S2V5ICYmIGV2ZW50LmtleSA9PT0gJ0YxMCcpKSkge1xuICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICBvcGVuRXhjbHVkZVdvcmRNZW51QXRGb2N1c2VkV29yZChldmVudC5jdXJyZW50VGFyZ2V0LCBkLmJhc2VUZXh0LCBvbkV4Y2x1ZGVJbkNsb3VkLCBvbkV4Y2x1ZGVJblZhdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vbignY29udGV4dG1lbnUnLCAoZXZlbnQ6IE1vdXNlRXZlbnQsIGQpID0+IHtcbiAgICAgICAgICAgIGlmICghb25FeGNsdWRlSW5DbG91ZCAmJiAhb25FeGNsdWRlSW5WYXVsdCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIG9wZW5FeGNsdWRlV29yZE1lbnVBdFBvaW50ZXIoZXZlbnQsIGQuYmFzZVRleHQsIG9uRXhjbHVkZUluQ2xvdWQsIG9uRXhjbHVkZUluVmF1bHQpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRleHRTZWxlY3Rpb25cbiAgICAgICAgICAuYXBwZW5kKCd0aXRsZScpXG4gICAgICAgICAgLnRleHQoKGQpID0+IGZvcm1hdFdvcmRUaXRsZShkLCB0b3RhbFdvcmRDb3VudCkpO1xuXG4gICAgICAgIGNvbnN0IGFwcGx5V29yZFRleHRNZXRyaWMgPSAobWV0cmljOiBXb3JkVGV4dE1ldHJpYyk6IHZvaWQgPT4ge1xuICAgICAgICAgIGFjdGl2ZVdvcmRUZXh0TWV0cmljID0gbWV0cmljO1xuICAgICAgICAgIHRleHRTZWxlY3Rpb24udGV4dCgoZCkgPT4gZ2V0V29yZExhYmVsKGQsIHJlbmRlclNldHRpbmdzLCB0b3RhbFdvcmRDb3VudCwgbWV0cmljKSk7XG4gICAgICAgICAgdGV4dFNlbGVjdGlvbi5zZWxlY3QoJ3RpdGxlJykudGV4dCgoZCkgPT4gZm9ybWF0V29yZFRpdGxlKGQsIHRvdGFsV29yZENvdW50KSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVwb3J0UHJvZ3Jlc3MoJ1JlbmRlcmluZyBjb21wbGV0ZS4nLCAxMDApO1xuICAgICAgICBpZiAoZW5hYmxlT3ZlcmxheUNvbnRyb2xzKSB7XG4gICAgICAgICAgcmVuZGVyT3ZlcmxheUNvbnRyb2xzKFxuICAgICAgICAgICAgY29udGFpbmVyRWwsXG4gICAgICAgICAgICBzdmcubm9kZSgpLFxuICAgICAgICAgICAgZXhwb3J0QmFzZU5hbWUsXG4gICAgICAgICAgICBlbmFibGVFeHBvcnQsXG4gICAgICAgICAgICBvblJlZnJlc2gsXG4gICAgICAgICAgICBvcHRpb25zLm9uRWRpdCxcbiAgICAgICAgICAgIHZpZXdwb3J0Q29udHJvbHMsXG4gICAgICAgICAgICBzaG93UmVmcmVzaENvbnRyb2wsXG4gICAgICAgICAgICBzaG93Wm9vbUNvbnRyb2xzLFxuICAgICAgICAgICAgc2hvd0VkaXRDb250cm9sLFxuICAgICAgICAgICAgcmVuZGVyU2V0dGluZ3Muc2hvd0NvdW50SW5Xb3JkVGV4dCAmJiByZW5kZXJTZXR0aW5ncy5zaG93V29yZFRleHRNZXRyaWNUb2dnbGUsXG4gICAgICAgICAgICAoKSA9PiBhY3RpdmVXb3JkVGV4dE1ldHJpYyxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgYXBwbHlXb3JkVGV4dE1ldHJpYyhhY3RpdmVXb3JkVGV4dE1ldHJpYyA9PT0gJ2NvdW50JyA/ICdmcmVxdWVuY3knIDogJ2NvdW50Jyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KVxuICAgICAgLnN0YXJ0KCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBvcGVuRXhjbHVkZVdvcmRNZW51QXRQb2ludGVyKFxuICBldmVudDogTW91c2VFdmVudCxcbiAgd29yZDogc3RyaW5nLFxuICBvbkV4Y2x1ZGVJbkNsb3VkOiAoKHdvcmQ6IHN0cmluZykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pIHwgdW5kZWZpbmVkLFxuICBvbkV4Y2x1ZGVJblZhdWx0OiAoKHdvcmQ6IHN0cmluZykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD4pIHwgdW5kZWZpbmVkLFxuKTogdm9pZCB7XG4gIGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xuICBhZGRFeGNsdWRlTWVudUl0ZW1zKG1lbnUsIHdvcmQsIG9uRXhjbHVkZUluQ2xvdWQsIG9uRXhjbHVkZUluVmF1bHQpO1xuICBtZW51LnNob3dBdE1vdXNlRXZlbnQoZXZlbnQpO1xufVxuXG5mdW5jdGlvbiBvcGVuRXhjbHVkZVdvcmRNZW51QXRGb2N1c2VkV29yZChcbiAgdGFyZ2V0OiBFdmVudFRhcmdldCB8IG51bGwsXG4gIHdvcmQ6IHN0cmluZyxcbiAgb25FeGNsdWRlSW5DbG91ZDogKCh3b3JkOiBzdHJpbmcpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+KSB8IHVuZGVmaW5lZCxcbiAgb25FeGNsdWRlSW5WYXVsdDogKCh3b3JkOiBzdHJpbmcpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+KSB8IHVuZGVmaW5lZCxcbik6IHZvaWQge1xuICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBTVkdHcmFwaGljc0VsZW1lbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgbWVudSA9IG5ldyBNZW51KCk7XG4gIGFkZEV4Y2x1ZGVNZW51SXRlbXMobWVudSwgd29yZCwgb25FeGNsdWRlSW5DbG91ZCwgb25FeGNsdWRlSW5WYXVsdCk7XG4gIG1lbnUuc2hvd0F0UG9zaXRpb24oe1xuICAgIHg6IE1hdGgucm91bmQocmVjdC5sZWZ0ICsgKHJlY3Qud2lkdGggLyAyKSksXG4gICAgeTogTWF0aC5yb3VuZChyZWN0LmJvdHRvbSksXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRFeGNsdWRlTWVudUl0ZW1zKFxuICBtZW51OiBNZW51LFxuICB3b3JkOiBzdHJpbmcsXG4gIG9uRXhjbHVkZUluQ2xvdWQ6ICgod29yZDogc3RyaW5nKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPikgfCB1bmRlZmluZWQsXG4gIG9uRXhjbHVkZUluVmF1bHQ6ICgod29yZDogc3RyaW5nKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPikgfCB1bmRlZmluZWQsXG4pOiB2b2lkIHtcbiAgaWYgKG9uRXhjbHVkZUluQ2xvdWQpIHtcbiAgICBtZW51LmFkZEl0ZW0oKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW1cbiAgICAgICAgLnNldFRpdGxlKCdFeGNsdWRlIGluIGNsb3VkJylcbiAgICAgICAgLnNldEljb24oJ2xpc3QteCcpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICB2b2lkIG9uRXhjbHVkZUluQ2xvdWQod29yZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKG9uRXhjbHVkZUluVmF1bHQpIHtcbiAgICBtZW51LmFkZEl0ZW0oKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW1cbiAgICAgICAgLnNldFRpdGxlKCdFeGNsdWRlIGluIHZhdWx0JylcbiAgICAgICAgLnNldEljb24oJ2Nsb3VkLW9mZicpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICB2b2lkIG9uRXhjbHVkZUluVmF1bHQod29yZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKCFvbkV4Y2x1ZGVJbkNsb3VkICYmICFvbkV4Y2x1ZGVJblZhdWx0KSB7XG4gICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PiB7XG4gICAgICBpdGVtXG4gICAgICAgIC5zZXRUaXRsZSgnRXhjbHVkZSB1bmF2YWlsYWJsZScpXG4gICAgICAgIC5zZXRJY29uKCdzbGFzaCcpXG4gICAgICAgIC5zZXREaXNhYmxlZCh0cnVlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdGF0aWNWaWV3cG9ydENvbnRyb2xzKCk6IFZpZXdwb3J0Q29udHJvbHMge1xuICByZXR1cm4ge1xuICAgIHpvb21JbjogKCkgPT4gdW5kZWZpbmVkLFxuICAgIHpvb21PdXQ6ICgpID0+IHVuZGVmaW5lZCxcbiAgICByZXNldFZpZXc6ICgpID0+IHVuZGVmaW5lZCxcbiAgICBzaG91bGRTdXBwcmVzc1dvcmRDbGljazogKCkgPT4gZmFsc2UsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldHVwVmlld3BvcnRDb250cm9scyhcbiAgc3ZnRWw6IFNWR1NWR0VsZW1lbnQgfCBudWxsLFxuICB2aWV3cG9ydEVsOiBTVkdHRWxlbWVudCB8IG51bGwsXG4gIHdpZHRoOiBudW1iZXIsXG4gIGhlaWdodDogbnVtYmVyLFxuKTogVmlld3BvcnRDb250cm9scyB7XG4gIGlmICghc3ZnRWwgfHwgIXZpZXdwb3J0RWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgem9vbUluOiAoKSA9PiB1bmRlZmluZWQsXG4gICAgICB6b29tT3V0OiAoKSA9PiB1bmRlZmluZWQsXG4gICAgICByZXNldFZpZXc6ICgpID0+IHVuZGVmaW5lZCxcbiAgICAgIHNob3VsZFN1cHByZXNzV29yZENsaWNrOiAoKSA9PiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgbGV0IHBhblggPSAwO1xuICBsZXQgcGFuWSA9IDA7XG4gIGxldCB6b29tID0gMTtcbiAgbGV0IHN1cHByZXNzV29yZENsaWNrVW50aWwgPSAwO1xuICBsZXQgcG9pbnRlcklkOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgbGV0IGRyYWdTdGFydFggPSAwO1xuICBsZXQgZHJhZ1N0YXJ0WSA9IDA7XG4gIGxldCBsYXN0UG9pbnRlclggPSAwO1xuICBsZXQgbGFzdFBvaW50ZXJZID0gMDtcbiAgbGV0IHBvaW50ZXJNb3ZlZCA9IGZhbHNlO1xuICBsZXQgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICBjb25zdCBtaW5ab29tID0gMC4zNTtcbiAgY29uc3QgbWF4Wm9vbSA9IDQuNTtcbiAgY29uc3QgZHJhZ1N0YXJ0VGhyZXNob2xkUHggPSA3O1xuXG4gIGNvbnN0IGNsYW1wWm9vbSA9ICh2YWx1ZTogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICBpZiAoTnVtYmVyLmlzTmFOKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHpvb207XG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1pbihtYXhab29tLCBNYXRoLm1heChtaW5ab29tLCB2YWx1ZSkpO1xuICB9O1xuXG4gIGNvbnN0IGFwcGx5VHJhbnNmb3JtID0gKCk6IHZvaWQgPT4ge1xuICAgIHZpZXdwb3J0RWwuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7cGFuWH0sJHtwYW5ZfSkgc2NhbGUoJHt6b29tfSlgKTtcbiAgfTtcblxuICBjb25zdCB6b29tQXQgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIsIGZhY3RvcjogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoZmFjdG9yKSB8fCBmYWN0b3IgPD0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHRab29tID0gY2xhbXBab29tKHpvb20gKiBmYWN0b3IpO1xuICAgIGlmIChuZXh0Wm9vbSA9PT0gem9vbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdvcmxkWCA9ICh4IC0gcGFuWCkgLyB6b29tO1xuICAgIGNvbnN0IHdvcmxkWSA9ICh5IC0gcGFuWSkgLyB6b29tO1xuICAgIHBhblggPSB4IC0gKHdvcmxkWCAqIG5leHRab29tKTtcbiAgICBwYW5ZID0geSAtICh3b3JsZFkgKiBuZXh0Wm9vbSk7XG4gICAgem9vbSA9IG5leHRab29tO1xuICAgIGFwcGx5VHJhbnNmb3JtKCk7XG4gIH07XG5cbiAgY29uc3QgbnVkZ2VQYW4gPSAoZGVsdGFYOiBudW1iZXIsIGRlbHRhWTogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgcGFuWCArPSBkZWx0YVg7XG4gICAgcGFuWSArPSBkZWx0YVk7XG4gICAgYXBwbHlUcmFuc2Zvcm0oKTtcbiAgfTtcblxuICBjb25zdCB6b29tSW4gPSAoKTogdm9pZCA9PiB6b29tQXQod2lkdGggLyAyLCBoZWlnaHQgLyAyLCAxLjE4KTtcbiAgY29uc3Qgem9vbU91dCA9ICgpOiB2b2lkID0+IHpvb21BdCh3aWR0aCAvIDIsIGhlaWdodCAvIDIsIDEgLyAxLjE4KTtcbiAgY29uc3QgcmVzZXRWaWV3ID0gKCk6IHZvaWQgPT4ge1xuICAgIHBhblggPSAwO1xuICAgIHBhblkgPSAwO1xuICAgIHpvb20gPSAxO1xuICAgIGFwcGx5VHJhbnNmb3JtKCk7XG4gIH07XG5cbiAgYXBwbHlUcmFuc2Zvcm0oKTtcbiAgc3ZnRWwuY2xhc3NMaXN0LmFkZCgnd29yZC1jbG91ZC1wYW56b29tLXN1cmZhY2UnKTtcbiAgc3ZnRWwuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gIHN2Z0VsLnNldEF0dHJpYnV0ZShcbiAgICAnYXJpYS1rZXlzaG9ydGN1dHMnLFxuICAgICcrLCAtLCAwLCBBcnJvd0xlZnQsIEFycm93UmlnaHQsIEFycm93VXAsIEFycm93RG93bicsXG4gICk7XG5cbiAgc3ZnRWwuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCAoZXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgIGlmIChldmVudC5wb2ludGVyVHlwZSAhPT0gJ3RvdWNoJyAmJiBldmVudC5idXR0b24gIT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzdmdFbC5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XG4gICAgcG9pbnRlcklkID0gZXZlbnQucG9pbnRlcklkO1xuICAgIGRyYWdTdGFydFggPSBldmVudC5jbGllbnRYO1xuICAgIGRyYWdTdGFydFkgPSBldmVudC5jbGllbnRZO1xuICAgIGxhc3RQb2ludGVyWCA9IGV2ZW50LmNsaWVudFg7XG4gICAgbGFzdFBvaW50ZXJZID0gZXZlbnQuY2xpZW50WTtcbiAgICBwb2ludGVyTW92ZWQgPSBmYWxzZTtcbiAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gIH0pO1xuXG4gIHN2Z0VsLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgKGV2ZW50OiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICBpZiAocG9pbnRlcklkICE9PSBldmVudC5wb2ludGVySWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWlzRHJhZ2dpbmcpIHtcbiAgICAgIGNvbnN0IGRyYWdEaXN0YW5jZSA9IE1hdGguaHlwb3QoZXZlbnQuY2xpZW50WCAtIGRyYWdTdGFydFgsIGV2ZW50LmNsaWVudFkgLSBkcmFnU3RhcnRZKTtcbiAgICAgIGlmIChkcmFnRGlzdGFuY2UgPCBkcmFnU3RhcnRUaHJlc2hvbGRQeCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgcG9pbnRlck1vdmVkID0gdHJ1ZTtcbiAgICAgIGxhc3RQb2ludGVyWCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICBsYXN0UG9pbnRlclkgPSBldmVudC5jbGllbnRZO1xuICAgICAgc3ZnRWwuc2V0UG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKTtcbiAgICAgIHN2Z0VsLmNsYXNzTGlzdC5hZGQoJ2lzLXBhbm5pbmcnKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGVsdGFYID0gZXZlbnQuY2xpZW50WCAtIGxhc3RQb2ludGVyWDtcbiAgICBjb25zdCBkZWx0YVkgPSBldmVudC5jbGllbnRZIC0gbGFzdFBvaW50ZXJZO1xuICAgIGxhc3RQb2ludGVyWCA9IGV2ZW50LmNsaWVudFg7XG4gICAgbGFzdFBvaW50ZXJZID0gZXZlbnQuY2xpZW50WTtcblxuICAgIG51ZGdlUGFuKGRlbHRhWCwgZGVsdGFZKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcblxuICBzdmdFbC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCAoZXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgIGlmIChwb2ludGVySWQgIT09IGV2ZW50LnBvaW50ZXJJZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwb2ludGVyTW92ZWQpIHtcbiAgICAgIHN1cHByZXNzV29yZENsaWNrVW50aWwgPSBEYXRlLm5vdygpICsgMjQwO1xuICAgIH1cbiAgICBwb2ludGVySWQgPSBudWxsO1xuICAgIHBvaW50ZXJNb3ZlZCA9IGZhbHNlO1xuICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICBzdmdFbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1wYW5uaW5nJyk7XG4gICAgaWYgKHN2Z0VsLmhhc1BvaW50ZXJDYXB0dXJlKGV2ZW50LnBvaW50ZXJJZCkpIHtcbiAgICAgIHN2Z0VsLnJlbGVhc2VQb2ludGVyQ2FwdHVyZShldmVudC5wb2ludGVySWQpO1xuICAgIH1cbiAgfSk7XG5cbiAgc3ZnRWwuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmNhbmNlbCcsIChldmVudDogUG9pbnRlckV2ZW50KSA9PiB7XG4gICAgaWYgKHBvaW50ZXJJZCAhPT0gZXZlbnQucG9pbnRlcklkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcG9pbnRlcklkID0gbnVsbDtcbiAgICBwb2ludGVyTW92ZWQgPSBmYWxzZTtcbiAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgc3ZnRWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtcGFubmluZycpO1xuICAgIGlmIChzdmdFbC5oYXNQb2ludGVyQ2FwdHVyZShldmVudC5wb2ludGVySWQpKSB7XG4gICAgICBzdmdFbC5yZWxlYXNlUG9pbnRlckNhcHR1cmUoZXZlbnQucG9pbnRlcklkKTtcbiAgICB9XG4gIH0pO1xuXG4gIHN2Z0VsLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgJ3doZWVsJyxcbiAgICAoZXZlbnQ6IFdoZWVsRXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBzcGVlZCA9IGV2ZW50LmRlbHRhTW9kZSA9PT0gV2hlZWxFdmVudC5ET01fREVMVEFfTElORSA/IDAuMDQgOiAwLjAwMjM7XG4gICAgICBjb25zdCB6b29tRmFjdG9yID0gTWF0aC5leHAoLWV2ZW50LmRlbHRhWSAqIHNwZWVkKTtcbiAgICAgIHpvb21BdChldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZLCB6b29tRmFjdG9yKTtcbiAgICB9LFxuICAgIHsgcGFzc2l2ZTogZmFsc2UgfSxcbiAgKTtcblxuICBzdmdFbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJysnIHx8IGV2ZW50LmtleSA9PT0gJz0nIHx8IGV2ZW50LmtleSA9PT0gJ051bXBhZEFkZCcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB6b29tSW4oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnLScgfHwgZXZlbnQua2V5ID09PSAnXycgfHwgZXZlbnQua2V5ID09PSAnTnVtcGFkU3VidHJhY3QnKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgem9vbU91dCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXkgPT09ICcwJykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJlc2V0VmlldygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBhblN0ZXAgPSAzNjtcbiAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dMZWZ0Jykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG51ZGdlUGFuKHBhblN0ZXAsIDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dSaWdodCcpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBudWRnZVBhbigtcGFuU3RlcCwgMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd1VwJykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG51ZGdlUGFuKDAsIHBhblN0ZXApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dEb3duJykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG51ZGdlUGFuKDAsIC1wYW5TdGVwKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgem9vbUluLFxuICAgIHpvb21PdXQsXG4gICAgcmVzZXRWaWV3LFxuICAgIHNob3VsZFN1cHByZXNzV29yZENsaWNrOiAoKSA9PiBEYXRlLm5vdygpIDwgc3VwcHJlc3NXb3JkQ2xpY2tVbnRpbCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyT3ZlcmxheUNvbnRyb2xzKFxuICBjb250YWluZXJFbDogSFRNTERpdkVsZW1lbnQsXG4gIHN2Z0VsOiBTVkdTVkdFbGVtZW50IHwgbnVsbCxcbiAgZXhwb3J0QmFzZU5hbWU6IHN0cmluZyxcbiAgZW5hYmxlRXhwb3J0OiBib29sZWFuLFxuICBvblJlZnJlc2g6ICgpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+LFxuICBvbkVkaXQ6ICgoKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPikgfCB1bmRlZmluZWQsXG4gIHZpZXdwb3J0Q29udHJvbHM6IFZpZXdwb3J0Q29udHJvbHMsXG4gIHNob3dSZWZyZXNoQ29udHJvbDogYm9vbGVhbixcbiAgc2hvd1pvb21Db250cm9sczogYm9vbGVhbixcbiAgc2hvd0VkaXRDb250cm9sOiBib29sZWFuLFxuICBzaG93V29yZE1ldHJpY1RvZ2dsZUNvbnRyb2w6IGJvb2xlYW4sXG4gIGdldEN1cnJlbnRXb3JkTWV0cmljOiAoKSA9PiBXb3JkVGV4dE1ldHJpYyxcbiAgb25Ub2dnbGVXb3JkTWV0cmljOiAoKSA9PiB2b2lkLFxuKTogdm9pZCB7XG4gIGlmICghc3ZnRWwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBtYWtlUmVmcmVzaEJ1dHRvbiA9IChwYXJlbnRFbDogSFRNTERpdkVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoIXNob3dSZWZyZXNoQ29udHJvbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlZnJlc2hCdXR0b24gPSBwYXJlbnRFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgY2xzOiAnd29yZC1jbG91ZC1yZWZyZXNoLWJ1dHRvbicsXG4gICAgfSk7XG4gICAgcmVmcmVzaEJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgc2V0SWNvbihyZWZyZXNoQnV0dG9uLCAncm90YXRlLWN3Jyk7XG4gICAgcmVmcmVzaEJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1JlZnJlc2ggd29yZCBjbG91ZCcpO1xuXG4gICAgbGV0IGlzUmVmcmVzaGluZyA9IGZhbHNlO1xuICAgIHJlZnJlc2hCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoaXNSZWZyZXNoaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaXNSZWZyZXNoaW5nID0gdHJ1ZTtcbiAgICAgIHJlZnJlc2hCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgb25SZWZyZXNoKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAocmVmcmVzaEJ1dHRvbi5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgIHJlZnJlc2hCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpc1JlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBtYWtlRWRpdEJ1dHRvbiA9IChwYXJlbnRFbDogSFRNTERpdkVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoIXNob3dFZGl0Q29udHJvbCB8fCAhb25FZGl0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZWRpdEJ1dHRvbiA9IHBhcmVudEVsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICBjbHM6ICd3b3JkLWNsb3VkLWVkaXQtYnV0dG9uJyxcbiAgICB9KTtcbiAgICBlZGl0QnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICBzZXRJY29uKGVkaXRCdXR0b24sICdwZW5jaWwnKTtcbiAgICBlZGl0QnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnRWRpdCBlbWJlZGRlZCB3b3JkIGNsb3VkJyk7XG5cbiAgICBsZXQgaXNFZGl0aW5nID0gZmFsc2U7XG4gICAgZWRpdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChpc0VkaXRpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpc0VkaXRpbmcgPSB0cnVlO1xuICAgICAgZWRpdEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBvbkVkaXQoKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlZGl0QnV0dG9uLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgICAgZWRpdEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlzRWRpdGluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IG1ha2VXb3JkTWV0cmljVG9nZ2xlQnV0dG9uID0gKHBhcmVudEVsOiBIVE1MRGl2RWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGlmICghc2hvd1dvcmRNZXRyaWNUb2dnbGVDb250cm9sKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWV0cmljQnV0dG9uID0gcGFyZW50RWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIGNsczogJ3dvcmQtY2xvdWQtbWV0cmljLWJ1dHRvbicsXG4gICAgfSk7XG4gICAgbWV0cmljQnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcblxuICAgIGNvbnN0IHVwZGF0ZU1ldHJpY0J1dHRvblRleHQgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50TWV0cmljID0gZ2V0Q3VycmVudFdvcmRNZXRyaWMoKTtcbiAgICAgIGNvbnN0IG5leHRNZXRyaWMgPSBjdXJyZW50TWV0cmljID09PSAnY291bnQnID8gJ2ZyZXF1ZW5jeScgOiAnY291bnQnO1xuICAgICAgbWV0cmljQnV0dG9uLnNldFRleHQoY3VycmVudE1ldHJpYyA9PT0gJ2NvdW50JyA/ICcxMjMnIDogJyUnKTtcbiAgICAgIG1ldHJpY0J1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgYFN3aXRjaCBpbmxpbmUgbGFiZWxzIHRvICR7bmV4dE1ldHJpY31gKTtcbiAgICAgIG1ldHJpY0J1dHRvbi5zZXRBdHRyKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nLCAndG9wJyk7XG4gICAgICBtZXRyaWNCdXR0b24uc2V0QXR0cignZGF0YS10b29sdGlwJywgYFNob3dpbmcgJHtjdXJyZW50TWV0cmljfTsgY2xpY2sgZm9yICR7bmV4dE1ldHJpY31gKTtcbiAgICB9O1xuXG4gICAgdXBkYXRlTWV0cmljQnV0dG9uVGV4dCgpO1xuICAgIG1ldHJpY0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG9uVG9nZ2xlV29yZE1ldHJpYygpO1xuICAgICAgdXBkYXRlTWV0cmljQnV0dG9uVGV4dCgpO1xuICAgIH0pO1xuICB9O1xuXG4gIGlmIChzaG93Wm9vbUNvbnRyb2xzKSB7XG4gICAgY29uc3Qgdmlld0NvbnRyb2xzRWwgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLXZpZXctY29udHJvbHMnIH0pO1xuICAgIGNvbnN0IHpvb21PdXRCdXR0b24gPSB2aWV3Q29udHJvbHNFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgY2xzOiAnd29yZC1jbG91ZC12aWV3LWJ1dHRvbicsXG4gICAgfSk7XG4gICAgem9vbU91dEJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgc2V0SWNvbih6b29tT3V0QnV0dG9uLCAnbWludXMnKTtcbiAgICB6b29tT3V0QnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnWm9vbSBvdXQnKTtcbiAgICB6b29tT3V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdmlld3BvcnRDb250cm9scy56b29tT3V0KCkpO1xuXG4gICAgY29uc3QgcmVzZXRWaWV3QnV0dG9uID0gdmlld0NvbnRyb2xzRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgIGNsczogJ3dvcmQtY2xvdWQtdmlldy1idXR0b24nLFxuICAgIH0pO1xuICAgIHJlc2V0Vmlld0J1dHRvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgc2V0SWNvbihyZXNldFZpZXdCdXR0b24sICdsb2NhdGUtZml4ZWQnKTtcbiAgICByZXNldFZpZXdCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsICdSZXNldCBwYW4gYW5kIHpvb20nKTtcbiAgICByZXNldFZpZXdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB2aWV3cG9ydENvbnRyb2xzLnJlc2V0VmlldygpKTtcblxuICAgIGNvbnN0IHpvb21JbkJ1dHRvbiA9IHZpZXdDb250cm9sc0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICBjbHM6ICd3b3JkLWNsb3VkLXZpZXctYnV0dG9uJyxcbiAgICB9KTtcbiAgICB6b29tSW5CdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIHNldEljb24oem9vbUluQnV0dG9uLCAncGx1cycpO1xuICAgIHpvb21JbkJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1pvb20gaW4nKTtcbiAgICB6b29tSW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB2aWV3cG9ydENvbnRyb2xzLnpvb21JbigpKTtcbiAgfVxuXG4gIGlmICghZW5hYmxlRXhwb3J0KSB7XG4gICAgaWYgKCFzaG93Wm9vbUNvbnRyb2xzKSB7XG4gICAgICBjb25zdCBmYWxsYmFja0NvbnRyb2xzRWwgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWV4cG9ydC1jb250cm9scycgfSk7XG4gICAgICBtYWtlV29yZE1ldHJpY1RvZ2dsZUJ1dHRvbihmYWxsYmFja0NvbnRyb2xzRWwpO1xuICAgICAgbWFrZVJlZnJlc2hCdXR0b24oZmFsbGJhY2tDb250cm9sc0VsKTtcbiAgICAgIG1ha2VFZGl0QnV0dG9uKGZhbGxiYWNrQ29udHJvbHNFbCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGV4cG9ydENvbnRyb2xzRWwgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWV4cG9ydC1jb250cm9scycgfSk7XG4gIGNvbnN0IG1lbnVCdXR0b24gPSBleHBvcnRDb250cm9sc0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgY2xzOiAnd29yZC1jbG91ZC1tZW51LWJ1dHRvbicsXG4gICAgdGV4dDogJ1x1MjJFRicsXG4gIH0pO1xuICBtZW51QnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnV29yZCBjbG91ZCBvcHRpb25zJyk7XG5cbiAgbWFrZVdvcmRNZXRyaWNUb2dnbGVCdXR0b24oZXhwb3J0Q29udHJvbHNFbCk7XG4gIG1ha2VSZWZyZXNoQnV0dG9uKGV4cG9ydENvbnRyb2xzRWwpO1xuICBtYWtlRWRpdEJ1dHRvbihleHBvcnRDb250cm9sc0VsKTtcblxuICBjb25zdCBtZW51RWwgPSBleHBvcnRDb250cm9sc0VsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtbWVudScgfSk7XG4gIG1lbnVFbC5zZXRBdHRyKCdoaWRkZW4nLCAndHJ1ZScpO1xuICBsZXQgcmVtb3ZlT3V0c2lkZUxpc3RlbmVyOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcblxuICBjb25zdCB0b2dnbGVNZW51ID0gKG9wZW46IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICBpZiAob3Blbikge1xuICAgICAgbWVudUVsLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICBjb25zdCBvbk91dHNpZGVDbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIE5vZGUpKSB7XG4gICAgICAgICAgdG9nZ2xlTWVudShmYWxzZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZXhwb3J0Q29udHJvbHNFbC5jb250YWlucyh0YXJnZXQpKSB7XG4gICAgICAgICAgdG9nZ2xlTWVudShmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk91dHNpZGVDbGljaywgdHJ1ZSk7XG4gICAgICByZW1vdmVPdXRzaWRlTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uT3V0c2lkZUNsaWNrLCB0cnVlKTtcbiAgICAgICAgcmVtb3ZlT3V0c2lkZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lbnVFbC5zZXRBdHRyKCdoaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgaWYgKHJlbW92ZU91dHNpZGVMaXN0ZW5lcikge1xuICAgICAgICByZW1vdmVPdXRzaWRlTGlzdGVuZXIoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgbWFrZU1lbnVJdGVtID0gKGxhYmVsOiBzdHJpbmcsIGZvcm1hdDogJ3N2ZycgfCAncG5nJyB8ICdqcGVnJykgPT4ge1xuICAgIGNvbnN0IGJ1dHRvbiA9IG1lbnVFbC5jcmVhdGVFbCgnYnV0dG9uJywgeyBjbHM6ICd3b3JkLWNsb3VkLW1lbnUtaXRlbScsIHRleHQ6IGBFeHBvcnQgJHtsYWJlbH1gIH0pO1xuICAgIGJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgYEV4cG9ydCBhcyAke2xhYmVsfWApO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgZXhwb3J0U3ZnKHN2Z0VsLCBmb3JtYXQsIGV4cG9ydEJhc2VOYW1lKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1dvcmQgY2xvdWRzOiBleHBvcnQgZmFpbGVkJywgZXJyb3IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdG9nZ2xlTWVudShmYWxzZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgbWFrZU1lbnVJdGVtKCdTVkcnLCAnc3ZnJyk7XG4gIG1ha2VNZW51SXRlbSgnUE5HJywgJ3BuZycpO1xuICBtYWtlTWVudUl0ZW0oJ0pQRUcnLCAnanBlZycpO1xuXG4gIG1lbnVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRvZ2dsZU1lbnUobWVudUVsLmhhc0F0dHJpYnV0ZSgnaGlkZGVuJykpO1xuICB9KTtcblxuICBtZW51QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgdG9nZ2xlTWVudShmYWxzZSk7XG4gICAgfVxuICB9KTtcblxuICBtZW51RWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdG9nZ2xlTWVudShmYWxzZSk7XG4gICAgICBtZW51QnV0dG9uLmZvY3VzKCk7XG4gICAgfVxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZXhwb3J0U3ZnKHN2Z0VsOiBTVkdTVkdFbGVtZW50LCBmb3JtYXQ6ICdzdmcnIHwgJ3BuZycgfCAnanBlZycsIGJhc2VOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3Qgc3ZnVGV4dCA9IG5ldyBYTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcoc3ZnRWwpO1xuICBjb25zdCBzdmdCbG9iID0gbmV3IEJsb2IoW3N2Z1RleHRdLCB7IHR5cGU6ICdpbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLTgnIH0pO1xuXG4gIGlmIChmb3JtYXQgPT09ICdzdmcnKSB7XG4gICAgdHJpZ2dlckJsb2JEb3dubG9hZChzdmdCbG9iLCBgJHtiYXNlTmFtZX0uc3ZnYCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgd2lkdGggPSBOdW1iZXIoc3ZnRWwuZ2V0QXR0cmlidXRlKCd3aWR0aCcpID8/IHN2Z0VsLnZpZXdCb3guYmFzZVZhbC53aWR0aCA/PyA4MDApO1xuICBjb25zdCBoZWlnaHQgPSBOdW1iZXIoc3ZnRWwuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSA/PyBzdmdFbC52aWV3Qm94LmJhc2VWYWwuaGVpZ2h0ID8/IDYwMCk7XG4gIGNvbnN0IGJpdG1hcEJsb2IgPSBhd2FpdCByYXN0ZXJpemVTdmcoc3ZnQmxvYiwgd2lkdGgsIGhlaWdodCwgZm9ybWF0KTtcbiAgdHJpZ2dlckJsb2JEb3dubG9hZChiaXRtYXBCbG9iLCBgJHtiYXNlTmFtZX0uJHtmb3JtYXQgPT09ICdwbmcnID8gJ3BuZycgOiAnanBnJ31gKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmFzdGVyaXplU3ZnKFxuICBzdmdCbG9iOiBCbG9iLFxuICB3aWR0aDogbnVtYmVyLFxuICBoZWlnaHQ6IG51bWJlcixcbiAgZm9ybWF0OiAncG5nJyB8ICdqcGVnJyxcbik6IFByb21pc2U8QmxvYj4ge1xuICBjb25zdCBzdmdVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHN2Z0Jsb2IpO1xuICBjb25zdCBpbWFnZSA9IGF3YWl0IGxvYWRJbWFnZShzdmdVcmwpO1xuICBVUkwucmV2b2tlT2JqZWN0VVJMKHN2Z1VybCk7XG5cbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIGNhbnZhcy53aWR0aCA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQod2lkdGgpKTtcbiAgY2FudmFzLmhlaWdodCA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQoaGVpZ2h0KSk7XG4gIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMgMkQgY29udGV4dCB1bmF2YWlsYWJsZScpO1xuICB9XG5cbiAgaWYgKGZvcm1hdCA9PT0gJ2pwZWcnKSB7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZmZmZic7XG4gICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICB9XG5cbiAgY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cbiAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlPEJsb2I+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjYW52YXMudG9CbG9iKChibG9iKSA9PiB7XG4gICAgICBpZiAoIWJsb2IpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBiaXRtYXAgYmxvYicpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShibG9iKTtcbiAgICB9LCBmb3JtYXQgPT09ICdwbmcnID8gJ2ltYWdlL3BuZycgOiAnaW1hZ2UvanBlZycsIDAuOTIpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbG9hZEltYWdlKHVybDogc3RyaW5nKTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiByZXNvbHZlKGltYWdlKTtcbiAgICBpbWFnZS5vbmVycm9yID0gKCkgPT4gcmVqZWN0KG5ldyBFcnJvcignRmFpbGVkIHRvIGxvYWQgU1ZHIGltYWdlJykpO1xuICAgIGltYWdlLnNyYyA9IHVybDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXJCbG9iRG93bmxvYWQoYmxvYjogQmxvYiwgZmlsZW5hbWU6IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICBjb25zdCBhbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gIGFuY2hvci5ocmVmID0gdXJsO1xuICBhbmNob3IuZG93bmxvYWQgPSBmaWxlbmFtZTtcbiAgYW5jaG9yLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYW5jaG9yKTtcbiAgYW5jaG9yLmNsaWNrKCk7XG4gIGFuY2hvci5yZW1vdmUoKTtcbiAgc2V0VGltZW91dCgoKSA9PiBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCksIDEwMDApO1xufVxuXG5mdW5jdGlvbiBzYW5pdGl6ZUZpbGVOYW1lKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWUudHJpbSgpLnJlcGxhY2UoL1teYS16MC05LV9dKy9naSwgJy0nKS5yZXBsYWNlKC8tKy9nLCAnLScpLnJlcGxhY2UoL14tfC0kL2csICcnKSB8fCAnd29yZC1jbG91ZCc7XG59XG5cbmZ1bmN0aW9uIGdldExheW91dFBlcmZvcm1hbmNlUHJvZmlsZShkZXRhaWw6IFJlbmRlclNldHRpbmdzWydwcm9ncmVzc0RldGFpbCddKToge1xuICBwcm9ncmVzc1Rocm90dGxlTXM6IG51bWJlcjtcbiAgd29yZFByb2dyZXNzU3RyaWRlOiBudW1iZXI7XG59IHtcbiAgaWYgKGRldGFpbCA9PT0gJ3VuaGluZ2VkJykge1xuICAgIHJldHVybiB7XG4gICAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDFfMDAwXzAwMCxcbiAgICAgIHdvcmRQcm9ncmVzc1N0cmlkZTogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChkZXRhaWwgPT09ICdkZXRhaWxlZCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAzMCxcbiAgICAgIHdvcmRQcm9ncmVzc1N0cmlkZTogMSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGRldGFpbCA9PT0gJ21pbmltYWwnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2dyZXNzVGhyb3R0bGVNczogMjIwLFxuICAgICAgd29yZFByb2dyZXNzU3RyaWRlOiAxMixcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwcm9ncmVzc1Rocm90dGxlTXM6IDgwLFxuICAgIHdvcmRQcm9ncmVzc1N0cmlkZTogNCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGhyb3R0bGVkUHJvZ3Jlc3MoXG4gIG9uUHJvZ3Jlc3M6ICgobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQpIHwgdW5kZWZpbmVkLFxuICBtaW5JbnRlcnZhbE1zOiBudW1iZXIsXG4pOiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQge1xuICBpZiAoIW9uUHJvZ3Jlc3MpIHtcbiAgICByZXR1cm4gKCkgPT4gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGV0IGxhc3RSZXBvcnRlZEF0ID0gMDtcbiAgbGV0IGxhc3RQZXJjZW50ID0gLTE7XG5cbiAgcmV0dXJuIChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgaWYgKHBlcmNlbnQgIT09IDEwMCAmJiBwZXJjZW50ID09PSBsYXN0UGVyY2VudCAmJiBub3cgLSBsYXN0UmVwb3J0ZWRBdCA8IG1pbkludGVydmFsTXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHBlcmNlbnQgIT09IDEwMCAmJiBub3cgLSBsYXN0UmVwb3J0ZWRBdCA8IG1pbkludGVydmFsTXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsYXN0UmVwb3J0ZWRBdCA9IG5vdztcbiAgICBsYXN0UGVyY2VudCA9IHBlcmNlbnQ7XG4gICAgb25Qcm9ncmVzcyhtZXNzYWdlLCBwZXJjZW50KTtcbiAgfTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFwcCB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgU2VhcmNoT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGVzY2FwZUZvclNlYXJjaCwgbm9ybWFsaXplVGFnIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb3BlblNlYXJjaEZvcldvcmQoYXBwOiBBcHAsIHdvcmQ6IHN0cmluZywgb3B0aW9uczogU2VhcmNoT3B0aW9ucyA9IHt9KTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IFtgXCIke2VzY2FwZUZvclNlYXJjaCh3b3JkKX1cImBdO1xuXG4gIGlmIChvcHRpb25zLmZpbGVQYXRoKSB7XG4gICAgcGFydHMucHVzaChgcGF0aDpcIiR7ZXNjYXBlRm9yU2VhcmNoKG9wdGlvbnMuZmlsZVBhdGgpfVwiYCk7XG4gIH1cblxuICBjb25zdCBpbmNsdWRlVGFncyA9IChvcHRpb25zLmluY2x1ZGVUYWdzID8/IFtdKVxuICAgIC5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpXG4gICAgLmZpbHRlcigodGFnKSA9PiB0YWcubGVuZ3RoID4gMCk7XG4gIGNvbnN0IGV4Y2x1ZGVUYWdzID0gKG9wdGlvbnMuZXhjbHVkZVRhZ3MgPz8gW10pXG4gICAgLm1hcCgodGFnKSA9PiBub3JtYWxpemVUYWcodGFnKSlcbiAgICAuZmlsdGVyKCh0YWcpID0+IHRhZy5sZW5ndGggPiAwKTtcblxuICBpZiAoaW5jbHVkZVRhZ3MubGVuZ3RoID4gMCkge1xuICAgIGlmIChvcHRpb25zLnRhZ01hdGNoTW9kZSA9PT0gJ2FsbCcpIHtcbiAgICAgIGZvciAoY29uc3QgdGFnIG9mIGluY2x1ZGVUYWdzKSB7XG4gICAgICAgIHBhcnRzLnB1c2godGFnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcGFydHMucHVzaChgKCR7aW5jbHVkZVRhZ3Muam9pbignIE9SICcpfSlgKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHRhZyBvZiBleGNsdWRlVGFncykge1xuICAgIHBhcnRzLnB1c2goYC0ke3RhZ31gKTtcbiAgfVxuXG4gIGNvbnN0IHF1ZXJ5ID0gcGFydHMuam9pbignICcpO1xuICBjb25zdCBleGlzdGluZ1NlYXJjaExlYWYgPSBhcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZSgnc2VhcmNoJylbMF07XG4gIGNvbnN0IHNlYXJjaExlYWYgPSBleGlzdGluZ1NlYXJjaExlYWYgPz8gYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpID8/IGFwcC53b3Jrc3BhY2UuZ2V0TGVhZih0cnVlKTtcblxuICBpZiAoIXNlYXJjaExlYWYpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBhd2FpdCBzZWFyY2hMZWFmLnNldFZpZXdTdGF0ZSh7XG4gICAgdHlwZTogJ3NlYXJjaCcsXG4gICAgYWN0aXZlOiB0cnVlLFxuICAgIHN0YXRlOiB7XG4gICAgICBxdWVyeSxcbiAgICB9LFxuICB9KTtcblxuICBhcHAud29ya3NwYWNlLnJldmVhbExlYWYoc2VhcmNoTGVhZik7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBcHAsIFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgZHJhd1dvcmRDbG91ZCB9IGZyb20gJy4uL3JlbmRlcmVycy93b3JkLWNsb3VkLXJlbmRlcmVyJztcbmltcG9ydCB7IG9wZW5TZWFyY2hGb3JXb3JkIH0gZnJvbSAnLi4vdXRpbHMvYXBwbHktc2VhcmNoJztcbmltcG9ydCB0eXBlIHtcbiAgUmVuZGVyU2V0dGluZ3MsXG4gIFNlYXJjaE9wdGlvbnMsXG4gIFZhdWx0Q29sbGVjdGlvbk9wdGlvbnMsXG4gIFdvcmRDbG91ZEZpbHRlclNldHRpbmdzLFxuICBXb3JkQ2xvdWRSZW5kZXJPcHRpb25zLFxuICBXb3JkQ2xvdWRTZXJ2aWNlcyxcbiAgV2VpZ2h0ZWRXb3JkLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IE9ic2lkaWFuQWRhcHRlciB9IGZyb20gJy4uL2ludGVncmF0aW9uL29ic2lkaWFuLWFkYXB0ZXInO1xuaW1wb3J0IHR5cGUgeyBTZXR0aW5nc1NlcnZpY2UgfSBmcm9tICcuLi9zZXR0aW5ncy9zZXJ2aWNlJztcbmltcG9ydCB0eXBlIHsgV29yZENsb3VkU2V0dGluZ3MgfSBmcm9tICcuLi9zZXR0aW5ncy90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFdvcmRDbG91ZFNlcnZpY2UgfSBmcm9tICcuLi93b3JkY2xvdWQvYXBwbGljYXRpb24vd29yZGNsb3VkLXNlcnZpY2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmRDbG91ZFNldHRpbmdzQ29udHJvbHMge1xuICBnZXRTZXR0aW5nc1NuYXBzaG90KCk6IFJlYWRvbmx5PFdvcmRDbG91ZFNldHRpbmdzPjtcbiAgdXBkYXRlUmVuZGVyU2V0dGluZ3MocGF0Y2g6IFBhcnRpYWw8UmVuZGVyU2V0dGluZ3M+KTogUHJvbWlzZTx2b2lkPjtcbiAgcmVzZXRSZW5kZXJTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+O1xuICByZW1vdmVCbGFja2xpc3RXb3JkKHJhd1dvcmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG4gIHJlc2V0QmxhY2tsaXN0V29yZHMoKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIFdvcmRDbG91ZEFwcFNlcnZpY2UgaW1wbGVtZW50cyBXb3JkQ2xvdWRTZXJ2aWNlcywgV29yZENsb3VkU2V0dGluZ3NDb250cm9scyB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSByZWFkb25seSBhZGFwdGVyOiBPYnNpZGlhbkFkYXB0ZXIsXG4gICAgcHJpdmF0ZSByZWFkb25seSBwcm9jZXNzb3I6IFdvcmRDbG91ZFNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZSxcbiAgKSB7fVxuXG4gIGdldFNldHRpbmdzU25hcHNob3QoKTogUmVhZG9ubHk8V29yZENsb3VkU2V0dGluZ3M+IHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1NlcnZpY2UuZ2V0U25hcHNob3QoKTtcbiAgfVxuXG4gIGdldEF2YWlsYWJsZVRhZ3MoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLnByb2Nlc3Nvci5nZXRBdmFpbGFibGVUYWdzKCk7XG4gIH1cblxuICBnZXRBdmFpbGFibGVGb2xkZXJzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldEF2YWlsYWJsZUZvbGRlcnMoKTtcbiAgfVxuXG4gIGdldE9wZW5NYXJrZG93bkZpbGVzKCk6IFRGaWxlW10ge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0T3Blbk1hcmtkb3duRmlsZXMoKTtcbiAgfVxuXG4gIGdldEFjdGl2ZUZpbGUoKTogVEZpbGUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldEFjdGl2ZUZpbGUoKTtcbiAgfVxuXG4gIGdldEZpbHRlclNldHRpbmdzKCk6IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzIHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1NlcnZpY2UuZ2V0U25hcHNob3QoKS5maWx0ZXJzO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlRmlsdGVyU2V0dGluZ3MocGF0Y2g6IFBhcnRpYWw8V29yZENsb3VkRmlsdGVyU2V0dGluZ3M+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zZXR0aW5nc1NlcnZpY2UudXBkYXRlRmlsdGVycyhwYXRjaCk7XG4gIH1cblxuICBhc3luYyBjb2xsZWN0VmF1bHRXb3JkcyhcbiAgICBvcHRpb25zOiBWYXVsdENvbGxlY3Rpb25PcHRpb25zID0ge30sXG4gICAgb25Qcm9ncmVzcz86IChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4gdm9pZCxcbiAgKTogUHJvbWlzZTxXZWlnaHRlZFdvcmRbXT4ge1xuICAgIGNvbnN0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1NlcnZpY2UuZ2V0U25hcHNob3QoKTtcbiAgICBjb25zdCBzb3VyY2VSdWxlcyA9IG9wdGlvbnMuc291cmNlUnVsZXMgPz8ge1xuICAgICAgc2NvcGU6IHNldHRpbmdzLmZpbHRlcnMuc2NvcGUsXG4gICAgICBpbmNsdWRlVGFnczogc2V0dGluZ3MuZmlsdGVycy5pbmNsdWRlVGFncyxcbiAgICAgIGV4Y2x1ZGVUYWdzOiBzZXR0aW5ncy5maWx0ZXJzLmV4Y2x1ZGVUYWdzLFxuICAgICAgdGFnTWF0Y2hNb2RlOiBzZXR0aW5ncy5maWx0ZXJzLnRhZ01hdGNoTW9kZSxcbiAgICAgIGZyb250bWF0dGVyUnVsZXM6IHNldHRpbmdzLmZpbHRlcnMuZnJvbnRtYXR0ZXJSdWxlcyxcbiAgICB9O1xuICAgIGNvbnN0IGZyZXF1ZW5jeSA9IG9wdGlvbnMuZnJlcXVlbmN5ID8/IHNldHRpbmdzLmZpbHRlcnMuZnJlcXVlbmN5O1xuXG4gICAgcmV0dXJuIHRoaXMucHJvY2Vzc29yLmNvbGxlY3RGcm9tRmlsZXMoXG4gICAgICB0aGlzLmFkYXB0ZXIuZ2V0TWFya2Rvd25GaWxlcygpLFxuICAgICAgdGhpcy5zZXR0aW5nc1NlcnZpY2UuZ2V0QmxhY2tsaXN0U2V0KCksXG4gICAgICBzZXR0aW5ncy5yZW5kZXIsXG4gICAgICBvblByb2dyZXNzLFxuICAgICAge1xuICAgICAgICBzb3VyY2VSdWxlcyxcbiAgICAgICAgZnJlcXVlbmN5LFxuICAgICAgICBleGNsdWRlV29yZHM6IG9wdGlvbnMuZXhjbHVkZVdvcmRzLFxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgY29sbGVjdEZpbGVXb3JkcyhcbiAgICBmaWxlOiBURmlsZSxcbiAgICBvblByb2dyZXNzPzogKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB2b2lkLFxuICAgIG9wdGlvbnM/OiB7IGV4Y2x1ZGVXb3Jkcz86IHN0cmluZ1tdIH0sXG4gICk6IFByb21pc2U8V2VpZ2h0ZWRXb3JkW10+IHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NTZXJ2aWNlLmdldFNuYXBzaG90KCk7XG5cbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzb3IuY29sbGVjdEZyb21GaWxlcyhbZmlsZV0sIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLmdldEJsYWNrbGlzdFNldCgpLCBzZXR0aW5ncy5yZW5kZXIsIG9uUHJvZ3Jlc3MsIHtcbiAgICAgIGV4Y2x1ZGVXb3Jkczogb3B0aW9ucz8uZXhjbHVkZVdvcmRzLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZHJhd1dvcmRDbG91ZChvcHRpb25zOiBXb3JkQ2xvdWRSZW5kZXJPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzU2VydmljZS5nZXRTbmFwc2hvdCgpO1xuICAgIHJldHVybiBkcmF3V29yZENsb3VkKG9wdGlvbnMsIHNldHRpbmdzLnJlbmRlcik7XG4gIH1cblxuICBhc3luYyBvcGVuU2VhcmNoRm9yV29yZCh3b3JkOiBzdHJpbmcsIG9wdGlvbnM6IFNlYXJjaE9wdGlvbnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBvcGVuU2VhcmNoRm9yV29yZCh0aGlzLmFwcCwgd29yZCwgb3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBhZGRCbGFja2xpc3RXb3JkKHJhd1dvcmQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzU2VydmljZS5hZGRCbGFja2xpc3RXb3JkKHJhd1dvcmQpO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlQmxhY2tsaXN0V29yZChyYXdXb3JkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnNldHRpbmdzU2VydmljZS5yZW1vdmVCbGFja2xpc3RXb3JkKHJhd1dvcmQpO1xuICB9XG5cbiAgYXN5bmMgcmVzZXRCbGFja2xpc3RXb3JkcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnNldHRpbmdzU2VydmljZS5yZXNldEJsYWNrbGlzdFdvcmRzKCk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVSZW5kZXJTZXR0aW5ncyhwYXRjaDogUGFydGlhbDxSZW5kZXJTZXR0aW5ncz4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnNldHRpbmdzU2VydmljZS51cGRhdGVSZW5kZXJTZXR0aW5ncyhwYXRjaCk7XG4gIH1cblxuICBhc3luYyByZXNldFJlbmRlclNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc2V0dGluZ3NTZXJ2aWNlLnJlc2V0UmVuZGVyU2V0dGluZ3MoKTtcbiAgfVxufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IG5vcm1hbGl6ZVRhZyB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgUGlwZWxpbmVEb2N1bWVudCB9IGZyb20gJy4uL3BpcGVsaW5lL3R5cGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRQaXBlbGluZURvY3VtZW50cyhcbiAgYXBwOiBBcHAsXG4gIGZpbGVzOiBURmlsZVtdLFxuICByZWFkQmF0Y2hTaXplOiBudW1iZXIsXG4gIG9uUHJvZ3Jlc3M/OiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQsXG4pOiBQcm9taXNlPFBpcGVsaW5lRG9jdW1lbnRbXT4ge1xuICBjb25zdCBkb2N1bWVudHM6IFBpcGVsaW5lRG9jdW1lbnRbXSA9IFtdO1xuICBjb25zdCB0b3RhbEZpbGVzID0gTWF0aC5tYXgoMSwgZmlsZXMubGVuZ3RoKTtcblxuICBmb3IgKGxldCBiYXRjaFN0YXJ0ID0gMDsgYmF0Y2hTdGFydCA8IGZpbGVzLmxlbmd0aDsgYmF0Y2hTdGFydCArPSByZWFkQmF0Y2hTaXplKSB7XG4gICAgY29uc3QgYmF0Y2ggPSBmaWxlcy5zbGljZShiYXRjaFN0YXJ0LCBiYXRjaFN0YXJ0ICsgcmVhZEJhdGNoU2l6ZSk7XG4gICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBQcm9taXNlLmFsbChiYXRjaC5tYXAoKGZpbGUpID0+IGFwcC52YXVsdC5jYWNoZWRSZWFkKGZpbGUpKSk7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYmF0Y2gubGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgICBjb25zdCBmaWxlID0gYmF0Y2hbaW5kZXhdO1xuICAgICAgY29uc3QgcmF3VGV4dCA9IGNvbnRlbnRzW2luZGV4XTtcbiAgICAgIGNvbnN0IGNhY2hlID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xuICAgICAgY29uc3QgdGFncyA9IGdldEZpbGVUYWdzKGFwcCwgZmlsZSk7XG4gICAgICBjb25zdCBmaWxlSW5kZXggPSBiYXRjaFN0YXJ0ICsgaW5kZXg7XG5cbiAgICAgIG9uUHJvZ3Jlc3M/LihgU2Nhbm5pbmcgJHtmaWxlSW5kZXggKyAxfS8ke2ZpbGVzLmxlbmd0aH0gZmlsZXMuLi5gLCBNYXRoLnJvdW5kKChmaWxlSW5kZXggLyB0b3RhbEZpbGVzKSAqIDc1KSk7XG5cbiAgICAgIGRvY3VtZW50cy5wdXNoKHtcbiAgICAgICAgaWQ6IGZpbGUucGF0aCxcbiAgICAgICAgcGF0aDogZmlsZS5wYXRoLFxuICAgICAgICBiYXNlbmFtZTogZmlsZS5iYXNlbmFtZSxcbiAgICAgICAgcmF3VGV4dCxcbiAgICAgICAgdGFncyxcbiAgICAgICAgZnJvbnRtYXR0ZXI6IGNhY2hlPy5mcm9udG1hdHRlciAmJiB0eXBlb2YgY2FjaGUuZnJvbnRtYXR0ZXIgPT09ICdvYmplY3QnXG4gICAgICAgICAgPyB7IC4uLmNhY2hlLmZyb250bWF0dGVyIH1cbiAgICAgICAgICA6IHt9LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRvY3VtZW50cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbGVUYWdzKGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IHN0cmluZ1tdIHtcbiAgY29uc3QgY2FjaGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gIGlmICghY2FjaGUpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCB0YWdTZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICBpZiAoY2FjaGUudGFncykge1xuICAgIGZvciAoY29uc3QgdGFnRW50cnkgb2YgY2FjaGUudGFncykge1xuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVRhZyh0YWdFbnRyeS50YWcpO1xuICAgICAgaWYgKG5vcm1hbGl6ZWQpIHtcbiAgICAgICAgdGFnU2V0LmFkZChub3JtYWxpemVkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHRhZyBvZiBleHRyYWN0RnJvbnRtYXR0ZXJUYWdzKGNhY2hlLmZyb250bWF0dGVyKSkge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVUYWcodGFnKTtcbiAgICBpZiAobm9ybWFsaXplZCkge1xuICAgICAgdGFnU2V0LmFkZChub3JtYWxpemVkKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gWy4uLnRhZ1NldF07XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RGcm9udG1hdHRlclRhZ3MoZnJvbnRtYXR0ZXI6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZ1tdIHtcbiAgaWYgKCFmcm9udG1hdHRlciB8fCB0eXBlb2YgZnJvbnRtYXR0ZXIgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgcmF3VGFncyA9IGZyb250bWF0dGVyLnRhZ3MgPz8gZnJvbnRtYXR0ZXIudGFnO1xuICBpZiAodHlwZW9mIHJhd1RhZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHJhd1RhZ3Muc3BsaXQoL1tcXHMsXSsvKS5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS5sZW5ndGggPiAwKTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHJhd1RhZ3MpKSB7XG4gICAgcmV0dXJuIHJhd1RhZ3NcbiAgICAgIC5maWx0ZXIoKGVudHJ5KTogZW50cnkgaXMgc3RyaW5nID0+IHR5cGVvZiBlbnRyeSA9PT0gJ3N0cmluZycpXG4gICAgICAubWFwKChlbnRyeSkgPT4gZW50cnkudHJpbSgpKVxuICAgICAgLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApO1xuICB9XG5cbiAgcmV0dXJuIFtdO1xufVxuIiwgImltcG9ydCB0eXBlIHsgU291cmNlU2VsZWN0aW9uUnVsZXMgfSBmcm9tICcuLi8uLi9waXBlbGluZS90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG50eXBlIEZpbGVQcmVkaWNhdGUgPSAoZmlsZTogVEZpbGUpID0+IGJvb2xlYW47XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlUGF0aFByZWRpY2F0ZShydWxlczogU291cmNlU2VsZWN0aW9uUnVsZXMpOiBGaWxlUHJlZGljYXRlIHwgbnVsbCB7XG4gIGNvbnN0IHBhdGhSdWxlcyA9IHJ1bGVzLnBhdGhSdWxlcztcbiAgaWYgKCFwYXRoUnVsZXMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGZvbGRlclByZWZpeGVzID0gKHBhdGhSdWxlcy5mb2xkZXJQcmVmaXhlcyA/PyBbXSkubWFwKChwcmVmaXgpID0+IHByZWZpeC50cmltKCkpLmZpbHRlcihCb29sZWFuKTtcbiAgY29uc3QgZXhhY3RGb2xkZXJzID0gbmV3IFNldCgocGF0aFJ1bGVzLmV4YWN0Rm9sZGVycyA/PyBbXSkubWFwKChmb2xkZXIpID0+IGZvbGRlci50cmltKCkpLmZpbHRlcihCb29sZWFuKSk7XG4gIGNvbnN0IHN1YmZvbGRlclJvb3RzID0gKHBhdGhSdWxlcy5zdWJmb2xkZXJSb290cyA/PyBbXSkubWFwKChyb290KSA9PiByb290LnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBmaWxlbmFtZUVxdWFscyA9IG5ldyBTZXQoKHBhdGhSdWxlcy5maWxlbmFtZUVxdWFscyA/PyBbXSkubWFwKChuYW1lKSA9PiBuYW1lLnRyaW0oKS50b0xvd2VyQ2FzZSgpKS5maWx0ZXIoQm9vbGVhbikpO1xuICBjb25zdCBleHRlbnNpb25TZXQgPSBuZXcgU2V0KChwYXRoUnVsZXMuZXh0ZW5zaW9ucyA/PyBbXSlcbiAgICAubWFwKChleHRlbnNpb24pID0+IGV4dGVuc2lvbi50cmltKCkucmVwbGFjZSgvXlxcLi8sICcnKS50b0xvd2VyQ2FzZSgpKVxuICAgIC5maWx0ZXIoQm9vbGVhbikpO1xuXG4gIGxldCBmaWxlbmFtZVJlZ2V4OiBSZWdFeHAgfCBudWxsID0gbnVsbDtcbiAgY29uc3QgcmVnZXhTb3VyY2UgPSBwYXRoUnVsZXMuZmlsZW5hbWVSZWdleD8udHJpbSgpO1xuICBpZiAocmVnZXhTb3VyY2UpIHtcbiAgICB0cnkge1xuICAgICAgZmlsZW5hbWVSZWdleCA9IG5ldyBSZWdFeHAocmVnZXhTb3VyY2UsICdpJyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBmaWxlbmFtZVJlZ2V4ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBjb25zdCBoYXNDb25zdHJhaW50cyA9IGZvbGRlclByZWZpeGVzLmxlbmd0aCA+IDBcbiAgICB8fCBleGFjdEZvbGRlcnMuc2l6ZSA+IDBcbiAgICB8fCBzdWJmb2xkZXJSb290cy5sZW5ndGggPiAwXG4gICAgfHwgZmlsZW5hbWVFcXVhbHMuc2l6ZSA+IDBcbiAgICB8fCBleHRlbnNpb25TZXQuc2l6ZSA+IDBcbiAgICB8fCBmaWxlbmFtZVJlZ2V4ICE9PSBudWxsO1xuICBpZiAoIWhhc0NvbnN0cmFpbnRzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgY29uc3QgcGFyZW50Rm9sZGVyID0gZ2V0UGFyZW50Rm9sZGVyKGZpbGUucGF0aCk7XG5cbiAgICBpZiAoZm9sZGVyUHJlZml4ZXMubGVuZ3RoID4gMCAmJiAhZm9sZGVyUHJlZml4ZXMuc29tZSgocHJlZml4KSA9PiBmaWxlLnBhdGguc3RhcnRzV2l0aChwcmVmaXgpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChleGFjdEZvbGRlcnMuc2l6ZSA+IDAgJiYgIWV4YWN0Rm9sZGVycy5oYXMocGFyZW50Rm9sZGVyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChzdWJmb2xkZXJSb290cy5sZW5ndGggPiAwICYmICFzdWJmb2xkZXJSb290cy5zb21lKChyb290KSA9PiBpc0luU3ViZm9sZGVyKGZpbGUucGF0aCwgcm9vdCkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGZpbGVuYW1lRXF1YWxzLnNpemUgPiAwKSB7XG4gICAgICBjb25zdCBub3JtYWxpemVkQmFzZW5hbWUgPSBmaWxlLmJhc2VuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCBub3JtYWxpemVkTmFtZSA9IGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKCFmaWxlbmFtZUVxdWFscy5oYXMobm9ybWFsaXplZEJhc2VuYW1lKSAmJiAhZmlsZW5hbWVFcXVhbHMuaGFzKG5vcm1hbGl6ZWROYW1lKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZpbGVuYW1lUmVnZXggJiYgIWZpbGVuYW1lUmVnZXgudGVzdChmaWxlLmJhc2VuYW1lKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChleHRlbnNpb25TZXQuc2l6ZSA+IDApIHtcbiAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IGZpbGUuZXh0ZW5zaW9uLnJlcGxhY2UoL15cXC4vLCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmICghZXh0ZW5zaW9uU2V0LmhhcyhleHRlbnNpb24pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0UGFyZW50Rm9sZGVyKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHNlcGFyYXRvckluZGV4ID0gcGF0aC5sYXN0SW5kZXhPZignLycpO1xuICBpZiAoc2VwYXJhdG9ySW5kZXggPCAwKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIHBhdGguc2xpY2UoMCwgc2VwYXJhdG9ySW5kZXgpO1xufVxuXG5mdW5jdGlvbiBpc0luU3ViZm9sZGVyKHBhdGg6IHN0cmluZywgcm9vdDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmICghcm9vdCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghcGF0aC5zdGFydHNXaXRoKGAke3Jvb3R9L2ApKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcmVsYXRpdmVQYXRoID0gcGF0aC5zbGljZShyb290Lmxlbmd0aCArIDEpO1xuICByZXR1cm4gcmVsYXRpdmVQYXRoLmluY2x1ZGVzKCcvJyk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBcHAsIFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHR5cGUgeyBUYWdNYXRjaE1vZGUgfSBmcm9tICcuLi8uLi8uLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFNvdXJjZVNlbGVjdGlvblJ1bGVzIH0gZnJvbSAnLi4vLi4vcGlwZWxpbmUvdHlwZXMnO1xuaW1wb3J0IHsgbm9ybWFsaXplVGFnIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xuXG50eXBlIEZpbGVQcmVkaWNhdGUgPSAoZmlsZTogVEZpbGUpID0+IGJvb2xlYW47XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlVGFnUHJlZGljYXRlKGFwcDogQXBwLCBydWxlczogU291cmNlU2VsZWN0aW9uUnVsZXMpOiBGaWxlUHJlZGljYXRlIHwgbnVsbCB7XG4gIGNvbnN0IGluY2x1ZGVUYWdzID0gKHJ1bGVzLmluY2x1ZGVUYWdzID8/IFtdKS5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpLmZpbHRlcihCb29sZWFuKTtcbiAgY29uc3QgZXhjbHVkZVRhZ3MgPSAocnVsZXMuZXhjbHVkZVRhZ3MgPz8gW10pLm1hcCgodGFnKSA9PiBub3JtYWxpemVUYWcodGFnKSkuZmlsdGVyKEJvb2xlYW4pO1xuICBjb25zdCBpbmNsdWRlVGFnUHJlZml4ZXMgPSAocnVsZXMuaW5jbHVkZVRhZ1ByZWZpeGVzID8/IFtdKS5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpLmZpbHRlcihCb29sZWFuKTtcbiAgY29uc3QgZXhjbHVkZVRhZ1ByZWZpeGVzID0gKHJ1bGVzLmV4Y2x1ZGVUYWdQcmVmaXhlcyA/PyBbXSkubWFwKCh0YWcpID0+IG5vcm1hbGl6ZVRhZyh0YWcpKS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgaWYgKFxuICAgIGluY2x1ZGVUYWdzLmxlbmd0aCA9PT0gMFxuICAgICYmIGV4Y2x1ZGVUYWdzLmxlbmd0aCA9PT0gMFxuICAgICYmIGluY2x1ZGVUYWdQcmVmaXhlcy5sZW5ndGggPT09IDBcbiAgICAmJiBleGNsdWRlVGFnUHJlZml4ZXMubGVuZ3RoID09PSAwXG4gICkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgaW5jbHVkZVNldCA9IG5ldyBTZXQoaW5jbHVkZVRhZ3MpO1xuICBjb25zdCBleGNsdWRlU2V0ID0gbmV3IFNldChleGNsdWRlVGFncyk7XG4gIGNvbnN0IHRhZ01hdGNoTW9kZSA9IHJ1bGVzLnRhZ01hdGNoTW9kZSA/PyAnYW55JztcbiAgY29uc3QgdGFnUHJlZml4TWF0Y2hNb2RlID0gcnVsZXMudGFnUHJlZml4TWF0Y2hNb2RlID8/ICdhbnknO1xuXG4gIHJldHVybiAoZmlsZTogVEZpbGUpID0+IHtcbiAgICBjb25zdCBmaWxlVGFncyA9IGdldE5vcm1hbGl6ZWRGaWxlVGFncyhhcHAsIGZpbGUpO1xuICAgIGlmIChpbmNsdWRlU2V0LnNpemUgPiAwICYmICFtYXRjaGVzVGFnU2V0KGZpbGVUYWdzLCBpbmNsdWRlVGFncywgdGFnTWF0Y2hNb2RlLCBmYWxzZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZXhjbHVkZVNldC5zaXplID4gMCAmJiBtYXRjaGVzVGFnU2V0KGZpbGVUYWdzLCBleGNsdWRlVGFncywgJ2FueScsIGZhbHNlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpbmNsdWRlVGFnUHJlZml4ZXMubGVuZ3RoID4gMCAmJiAhbWF0Y2hlc1RhZ1NldChmaWxlVGFncywgaW5jbHVkZVRhZ1ByZWZpeGVzLCB0YWdQcmVmaXhNYXRjaE1vZGUsIHRydWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGV4Y2x1ZGVUYWdQcmVmaXhlcy5sZW5ndGggPiAwICYmIG1hdGNoZXNUYWdTZXQoZmlsZVRhZ3MsIGV4Y2x1ZGVUYWdQcmVmaXhlcywgJ2FueScsIHRydWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNUYWdTZXQoZmlsZVRhZ3M6IFNldDxzdHJpbmc+LCBjb25zdHJhaW50czogc3RyaW5nW10sIG1vZGU6IFRhZ01hdGNoTW9kZSwgdXNlUHJlZml4TWF0Y2g6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgaWYgKGNvbnN0cmFpbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY29uc3QgbWF0Y2hlc1RhZyA9IChjb25zdHJhaW50OiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBpZiAoIXVzZVByZWZpeE1hdGNoKSB7XG4gICAgICByZXR1cm4gZmlsZVRhZ3MuaGFzKGNvbnN0cmFpbnQpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgdGFnIG9mIGZpbGVUYWdzKSB7XG4gICAgICBpZiAodGFnLnN0YXJ0c1dpdGgoY29uc3RyYWludCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGlmIChtb2RlID09PSAnYWxsJykge1xuICAgIHJldHVybiBjb25zdHJhaW50cy5ldmVyeShtYXRjaGVzVGFnKTtcbiAgfVxuXG4gIHJldHVybiBjb25zdHJhaW50cy5zb21lKG1hdGNoZXNUYWcpO1xufVxuXG5mdW5jdGlvbiBnZXROb3JtYWxpemVkRmlsZVRhZ3MoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogU2V0PHN0cmluZz4ge1xuICBjb25zdCBjYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcbiAgaWYgKCFjYWNoZT8udGFncykge1xuICAgIHJldHVybiBuZXcgU2V0KCk7XG4gIH1cblxuICBjb25zdCBub3JtYWxpemVkID0gY2FjaGUudGFnc1xuICAgIC5tYXAoKGVudHJ5KSA9PiBub3JtYWxpemVUYWcoZW50cnkudGFnKSlcbiAgICAuZmlsdGVyKEJvb2xlYW4pO1xuICByZXR1cm4gbmV3IFNldChub3JtYWxpemVkKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IERhdGVSYW5nZVJ1bGUsIFNvdXJjZVNlbGVjdGlvblJ1bGVzIH0gZnJvbSAnLi4vLi4vcGlwZWxpbmUvdHlwZXMnO1xuaW1wb3J0IHR5cGUgeyBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcblxudHlwZSBGaWxlUHJlZGljYXRlID0gKGZpbGU6IFRGaWxlKSA9PiBib29sZWFuO1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZURhdGVQcmVkaWNhdGUocnVsZXM6IFNvdXJjZVNlbGVjdGlvblJ1bGVzKTogRmlsZVByZWRpY2F0ZSB8IG51bGwge1xuICBjb25zdCBoYXNNb2RpZmllZFJ1bGUgPSBoYXNEYXRlUnVsZShydWxlcy5tb2RpZmllZFRpbWUpO1xuICBjb25zdCBoYXNDcmVhdGVkUnVsZSA9IGhhc0RhdGVSdWxlKHJ1bGVzLmNyZWF0ZWRUaW1lKTtcbiAgaWYgKCFoYXNNb2RpZmllZFJ1bGUgJiYgIWhhc0NyZWF0ZWRSdWxlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgaWYgKGhhc01vZGlmaWVkUnVsZSAmJiAhbWF0Y2hlc0RhdGVSdWxlKGZpbGUuc3RhdC5tdGltZSwgcnVsZXMubW9kaWZpZWRUaW1lKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChoYXNDcmVhdGVkUnVsZSAmJiAhbWF0Y2hlc0RhdGVSdWxlKGZpbGUuc3RhdC5jdGltZSwgcnVsZXMuY3JlYXRlZFRpbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGhhc0RhdGVSdWxlKHJ1bGU6IERhdGVSYW5nZVJ1bGUgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcbiAgaWYgKCFydWxlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShydWxlLmJlZm9yZSlcbiAgICB8fCBOdW1iZXIuaXNGaW5pdGUocnVsZS5hZnRlcilcbiAgICB8fCAocnVsZS5iZXR3ZWVuICE9PSB1bmRlZmluZWRcbiAgICAgICYmIE51bWJlci5pc0Zpbml0ZShydWxlLmJldHdlZW4uc3RhcnQpXG4gICAgICAmJiBOdW1iZXIuaXNGaW5pdGUocnVsZS5iZXR3ZWVuLmVuZCkpO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzRGF0ZVJ1bGUodmFsdWU6IG51bWJlciwgcnVsZTogRGF0ZVJhbmdlUnVsZSB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xuICBpZiAoIXJ1bGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChOdW1iZXIuaXNGaW5pdGUocnVsZS5iZWZvcmUpICYmICEodmFsdWUgPCBOdW1iZXIocnVsZS5iZWZvcmUpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChOdW1iZXIuaXNGaW5pdGUocnVsZS5hZnRlcikgJiYgISh2YWx1ZSA+IE51bWJlcihydWxlLmFmdGVyKSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocnVsZS5iZXR3ZWVuICYmIE51bWJlci5pc0Zpbml0ZShydWxlLmJldHdlZW4uc3RhcnQpICYmIE51bWJlci5pc0Zpbml0ZShydWxlLmJldHdlZW4uZW5kKSkge1xuICAgIGNvbnN0IHN0YXJ0ID0gTWF0aC5taW4ocnVsZS5iZXR3ZWVuLnN0YXJ0LCBydWxlLmJldHdlZW4uZW5kKTtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1heChydWxlLmJldHdlZW4uc3RhcnQsIHJ1bGUuYmV0d2Vlbi5lbmQpO1xuICAgIGlmICh2YWx1ZSA8IHN0YXJ0IHx8IHZhbHVlID4gZW5kKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBcHAsIFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHR5cGUgeyBTb3VyY2VTZWxlY3Rpb25SdWxlcyB9IGZyb20gJy4uLy4uL3BpcGVsaW5lL3R5cGVzJztcblxudHlwZSBGaWxlUHJlZGljYXRlID0gKGZpbGU6IFRGaWxlKSA9PiBib29sZWFuO1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUZyb250bWF0dGVyUHJlZGljYXRlKGFwcDogQXBwLCBydWxlczogU291cmNlU2VsZWN0aW9uUnVsZXMpOiBGaWxlUHJlZGljYXRlIHwgbnVsbCB7XG4gIGNvbnN0IGZyb250bWF0dGVyUnVsZXMgPSAocnVsZXMuZnJvbnRtYXR0ZXJSdWxlcyA/PyBbXSkuZmlsdGVyKChydWxlKSA9PiBydWxlLmtleS50cmltKCkubGVuZ3RoID4gMCk7XG4gIGlmIChmcm9udG1hdHRlclJ1bGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIChmaWxlOiBURmlsZSkgPT4ge1xuICAgIGNvbnN0IGNhY2hlID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xuICAgIGNvbnN0IGZyb250bWF0dGVyID0gY2FjaGU/LmZyb250bWF0dGVyICYmIHR5cGVvZiBjYWNoZS5mcm9udG1hdHRlciA9PT0gJ29iamVjdCdcbiAgICAgID8gKGNhY2hlLmZyb250bWF0dGVyIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVxuICAgICAgOiB7fTtcbiAgICByZXR1cm4gbWF0Y2hlc0Zyb250bWF0dGVyUnVsZXMoZnJvbnRtYXR0ZXIsIGZyb250bWF0dGVyUnVsZXMpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hlc0Zyb250bWF0dGVyUnVsZXMoXG4gIGZyb250bWF0dGVyOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgcnVsZXM6IFNvdXJjZVNlbGVjdGlvblJ1bGVzWydmcm9udG1hdHRlclJ1bGVzJ10sXG4pOiBib29sZWFuIHtcbiAgaWYgKCFydWxlcykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHJ1bGVzLmV2ZXJ5KChydWxlKSA9PiB7XG4gICAgY29uc3Qga2V5ID0gcnVsZS5rZXkudHJpbSgpO1xuICAgIGlmICgha2V5KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBhY3R1YWwgPSBmcm9udG1hdHRlcltrZXldO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gKHJ1bGUudmFsdWUgPz8gJycpLnRyaW0oKTtcblxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnZXhpc3RzJykge1xuICAgICAgcmV0dXJuIGFjdHVhbCAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ25vdC1leGlzdHMnKSB7XG4gICAgICByZXR1cm4gYWN0dWFsID09PSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKGFjdHVhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHJ1bGUub3BlcmF0b3IgPT09ICdjb250YWlucycpIHtcbiAgICAgIHJldHVybiBjb250YWluc1ZhbHVlKGFjdHVhbCwgZXhwZWN0ZWQpO1xuICAgIH1cblxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnZXF1YWxzJykge1xuICAgICAgcmV0dXJuIGNvbXBhcmVTY2FsYXIoYWN0dWFsLCBleHBlY3RlZCkgPT09IDA7XG4gICAgfVxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnbm90LWVxdWFscycpIHtcbiAgICAgIHJldHVybiBjb21wYXJlU2NhbGFyKGFjdHVhbCwgZXhwZWN0ZWQpICE9PSAwO1xuICAgIH1cbiAgICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ2d0Jykge1xuICAgICAgcmV0dXJuIGNvbXBhcmVTY2FsYXIoYWN0dWFsLCBleHBlY3RlZCkgPiAwO1xuICAgIH1cbiAgICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ2d0ZScpIHtcbiAgICAgIHJldHVybiBjb21wYXJlU2NhbGFyKGFjdHVhbCwgZXhwZWN0ZWQpID49IDA7XG4gICAgfVxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnbHQnKSB7XG4gICAgICByZXR1cm4gY29tcGFyZVNjYWxhcihhY3R1YWwsIGV4cGVjdGVkKSA8IDA7XG4gICAgfVxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnbHRlJykge1xuICAgICAgcmV0dXJuIGNvbXBhcmVTY2FsYXIoYWN0dWFsLCBleHBlY3RlZCkgPD0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbnRhaW5zVmFsdWUoYWN0dWFsOiB1bmtub3duLCBleHBlY3RlZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRFeHBlY3RlZCA9IGV4cGVjdGVkLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChBcnJheS5pc0FycmF5KGFjdHVhbCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLnNvbWUoKGVudHJ5KSA9PiBTdHJpbmcoZW50cnkpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMobm9ybWFsaXplZEV4cGVjdGVkKSk7XG4gIH1cblxuICByZXR1cm4gU3RyaW5nKGFjdHVhbCkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhub3JtYWxpemVkRXhwZWN0ZWQpO1xufVxuXG5mdW5jdGlvbiBjb21wYXJlU2NhbGFyKGFjdHVhbDogdW5rbm93biwgZXhwZWN0ZWQ6IHN0cmluZyk6IG51bWJlciB7XG4gIGlmIChpc051bGxMaWtlKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBpc051bGxMaWtlKGFjdHVhbCkgPyAwIDogMTtcbiAgfVxuXG4gIGNvbnN0IG51bWVyaWNBY3R1YWwgPSB0cnlQYXJzZU51bWJlcihhY3R1YWwpO1xuICBjb25zdCBudW1lcmljRXhwZWN0ZWQgPSB0cnlQYXJzZU51bWJlcihleHBlY3RlZCk7XG4gIGlmIChudW1lcmljQWN0dWFsICE9PSBudWxsICYmIG51bWVyaWNFeHBlY3RlZCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBudW1lcmljQWN0dWFsIC0gbnVtZXJpY0V4cGVjdGVkO1xuICB9XG5cbiAgY29uc3QgZGF0ZUFjdHVhbCA9IHRyeVBhcnNlRGF0ZShhY3R1YWwpO1xuICBjb25zdCBkYXRlRXhwZWN0ZWQgPSB0cnlQYXJzZURhdGUoZXhwZWN0ZWQpO1xuICBpZiAoZGF0ZUFjdHVhbCAhPT0gbnVsbCAmJiBkYXRlRXhwZWN0ZWQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZGF0ZUFjdHVhbCAtIGRhdGVFeHBlY3RlZDtcbiAgfVxuXG4gIGNvbnN0IGJvb2xlYW5BY3R1YWwgPSB0cnlQYXJzZUJvb2xlYW4oYWN0dWFsKTtcbiAgY29uc3QgYm9vbGVhbkV4cGVjdGVkID0gdHJ5UGFyc2VCb29sZWFuKGV4cGVjdGVkKTtcbiAgaWYgKGJvb2xlYW5BY3R1YWwgIT09IG51bGwgJiYgYm9vbGVhbkV4cGVjdGVkICE9PSBudWxsKSB7XG4gICAgaWYgKGJvb2xlYW5BY3R1YWwgPT09IGJvb2xlYW5FeHBlY3RlZCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiBib29sZWFuQWN0dWFsID8gMSA6IC0xO1xuICB9XG5cbiAgcmV0dXJuIFN0cmluZyhhY3R1YWwpLmxvY2FsZUNvbXBhcmUoZXhwZWN0ZWQsIHVuZGVmaW5lZCwgeyBzZW5zaXRpdml0eTogJ2Jhc2UnLCBudW1lcmljOiB0cnVlIH0pO1xufVxuXG5mdW5jdGlvbiBpc051bGxMaWtlKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSB2YWx1ZS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIG5vcm1hbGl6ZWQgPT09ICdudWxsJyB8fCBub3JtYWxpemVkID09PSAnficgfHwgbm9ybWFsaXplZCA9PT0gJ25pbCc7XG59XG5cbmZ1bmN0aW9uIHRyeVBhcnNlTnVtYmVyKHZhbHVlOiB1bmtub3duKTogbnVtYmVyIHwgbnVsbCB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHBhcnNlZCA9IE51bWJlcih2YWx1ZSk7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShwYXJzZWQpKSB7XG4gICAgICByZXR1cm4gcGFyc2VkO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiB0cnlQYXJzZURhdGUodmFsdWU6IHVua25vd24pOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzRmluaXRlKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSB2YWx1ZS5nZXRUaW1lKCk7XG4gICAgcmV0dXJuIE51bWJlci5pc05hTih0aW1lc3RhbXApID8gbnVsbCA6IHRpbWVzdGFtcDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcGFyc2VkID0gRGF0ZS5wYXJzZSh2YWx1ZSk7XG4gICAgcmV0dXJuIE51bWJlci5pc05hTihwYXJzZWQpID8gbnVsbCA6IHBhcnNlZDtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiB0cnlQYXJzZUJvb2xlYW4odmFsdWU6IHVua25vd24pOiBib29sZWFuIHwgbnVsbCB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IHZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChub3JtYWxpemVkID09PSAndHJ1ZScpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAobm9ybWFsaXplZCA9PT0gJ2ZhbHNlJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgVGFnTWF0Y2hNb2RlIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHR5cGUgeyBMaW5rUnVsZXMsIFNvdXJjZVNlbGVjdGlvblJ1bGVzIH0gZnJvbSAnLi4vLi4vcGlwZWxpbmUvdHlwZXMnO1xuaW1wb3J0IHsgZ2V0RmlsZVRhZ3MgfSBmcm9tICcuLi9vYnNpZGlhbi1zb3VyY2UnO1xuaW1wb3J0IHsgbm9ybWFsaXplVGFnIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xuXG50eXBlIEZpbGVQcmVkaWNhdGUgPSAoZmlsZTogVEZpbGUpID0+IGJvb2xlYW47XG5cbnR5cGUgTGlua0luZGV4ID0ge1xuICB0YXJnZXRzQnlTb3VyY2U6IE1hcDxzdHJpbmcsIHN0cmluZ1tdPjtcbiAgdG90YWxCeVNvdXJjZTogTWFwPHN0cmluZywgbnVtYmVyPjtcbiAgc291cmNlc0J5VGFyZ2V0OiBNYXA8c3RyaW5nLCBzdHJpbmdbXT47XG4gIHRvdGFsQnlUYXJnZXQ6IE1hcDxzdHJpbmcsIG51bWJlcj47XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZU91dGdvaW5nTGlua1ByZWRpY2F0ZShhcHA6IEFwcCwgcnVsZXM6IFNvdXJjZVNlbGVjdGlvblJ1bGVzKTogRmlsZVByZWRpY2F0ZSB8IG51bGwge1xuICBjb25zdCBjb25zdHJhaW50cyA9IG5vcm1hbGl6ZUxpbmtSdWxlcyhydWxlcy5vdXRnb2luZ0xpbmtzKTtcbiAgaWYgKCFjb25zdHJhaW50cykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgbGlua0luZGV4ID0gYnVpbGRMaW5rSW5kZXgoYXBwKTtcbiAgY29uc3QgdGFnQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgU2V0PHN0cmluZz4+KCk7XG5cbiAgcmV0dXJuIChmaWxlOiBURmlsZSkgPT4ge1xuICAgIGNvbnN0IGxpbmtlZFRhcmdldHMgPSBsaW5rSW5kZXgudGFyZ2V0c0J5U291cmNlLmdldChmaWxlLnBhdGgpID8/IFtdO1xuICAgIGNvbnN0IHRvdGFsTGlua0NvdW50ID0gbGlua0luZGV4LnRvdGFsQnlTb3VyY2UuZ2V0KGZpbGUucGF0aCkgPz8gMDtcblxuICAgIGlmICghbWF0Y2hlc0xpbmtDb25zdHJhaW50cyhhcHAsIGxpbmtlZFRhcmdldHMsIHRvdGFsTGlua0NvdW50LCBjb25zdHJhaW50cywgdGFnQ2FjaGUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlSW5jb21pbmdMaW5rUHJlZGljYXRlKGFwcDogQXBwLCBydWxlczogU291cmNlU2VsZWN0aW9uUnVsZXMpOiBGaWxlUHJlZGljYXRlIHwgbnVsbCB7XG4gIGNvbnN0IGNvbnN0cmFpbnRzID0gbm9ybWFsaXplTGlua1J1bGVzKHJ1bGVzLmluY29taW5nTGlua3MpO1xuICBpZiAoIWNvbnN0cmFpbnRzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBsaW5rSW5kZXggPSBidWlsZExpbmtJbmRleChhcHApO1xuICBjb25zdCB0YWdDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBTZXQ8c3RyaW5nPj4oKTtcblxuICByZXR1cm4gKGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgY29uc3Qgc291cmNlUGF0aHMgPSBsaW5rSW5kZXguc291cmNlc0J5VGFyZ2V0LmdldChmaWxlLnBhdGgpID8/IFtdO1xuICAgIGNvbnN0IHRvdGFsTGlua0NvdW50ID0gbGlua0luZGV4LnRvdGFsQnlUYXJnZXQuZ2V0KGZpbGUucGF0aCkgPz8gMDtcblxuICAgIGlmICghbWF0Y2hlc0xpbmtDb25zdHJhaW50cyhhcHAsIHNvdXJjZVBhdGhzLCB0b3RhbExpbmtDb3VudCwgY29uc3RyYWludHMsIHRhZ0NhY2hlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xufVxuXG50eXBlIE5vcm1hbGl6ZWRMaW5rUnVsZXMgPSB7XG4gIGZpbGVQYXRoczogU2V0PHN0cmluZz47XG4gIGZvbGRlclByZWZpeGVzOiBzdHJpbmdbXTtcbiAgbWluQ291bnQ/OiBudW1iZXI7XG4gIG1heENvdW50PzogbnVtYmVyO1xuICB3aXRoVGFnczogc3RyaW5nW107XG4gIHRhZ01hdGNoTW9kZTogVGFnTWF0Y2hNb2RlO1xufTtcblxuZnVuY3Rpb24gbm9ybWFsaXplTGlua1J1bGVzKHJ1bGVzOiBMaW5rUnVsZXMgfCB1bmRlZmluZWQpOiBOb3JtYWxpemVkTGlua1J1bGVzIHwgbnVsbCB7XG4gIGlmICghcnVsZXMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGZpbGVQYXRocyA9IG5ldyBTZXQoKHJ1bGVzLmZpbGVQYXRocyA/PyBbXSkubWFwKChwYXRoKSA9PiBwYXRoLnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pKTtcbiAgY29uc3QgZm9sZGVyUHJlZml4ZXMgPSAocnVsZXMuZm9sZGVyUHJlZml4ZXMgPz8gW10pLm1hcCgocHJlZml4KSA9PiBwcmVmaXgudHJpbSgpKS5maWx0ZXIoQm9vbGVhbik7XG4gIGNvbnN0IHdpdGhUYWdzID0gKHJ1bGVzLndpdGhUYWdzID8/IFtdKS5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpLmZpbHRlcihCb29sZWFuKTtcblxuICBjb25zdCBtaW5Db3VudCA9IE51bWJlci5pc0Zpbml0ZShydWxlcy5taW5Db3VudCkgPyBNYXRoLm1heCgwLCBOdW1iZXIocnVsZXMubWluQ291bnQpKSA6IHVuZGVmaW5lZDtcbiAgY29uc3QgbWF4Q291bnQgPSBOdW1iZXIuaXNGaW5pdGUocnVsZXMubWF4Q291bnQpID8gTWF0aC5tYXgoMCwgTnVtYmVyKHJ1bGVzLm1heENvdW50KSkgOiB1bmRlZmluZWQ7XG5cbiAgY29uc3QgaGFzQ29uc3RyYWludHMgPSBmaWxlUGF0aHMuc2l6ZSA+IDBcbiAgICB8fCBmb2xkZXJQcmVmaXhlcy5sZW5ndGggPiAwXG4gICAgfHwgbWluQ291bnQgIT09IHVuZGVmaW5lZFxuICAgIHx8IG1heENvdW50ICE9PSB1bmRlZmluZWRcbiAgICB8fCB3aXRoVGFncy5sZW5ndGggPiAwO1xuICBpZiAoIWhhc0NvbnN0cmFpbnRzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZpbGVQYXRocyxcbiAgICBmb2xkZXJQcmVmaXhlcyxcbiAgICBtaW5Db3VudCxcbiAgICBtYXhDb3VudCxcbiAgICB3aXRoVGFncyxcbiAgICB0YWdNYXRjaE1vZGU6IHJ1bGVzLnRhZ01hdGNoTW9kZSA9PT0gJ2FsbCcgPyAnYWxsJyA6ICdhbnknLFxuICB9O1xufVxuXG5mdW5jdGlvbiBidWlsZExpbmtJbmRleChhcHA6IEFwcCk6IExpbmtJbmRleCB7XG4gIGNvbnN0IHRhcmdldHNCeVNvdXJjZSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgY29uc3QgdG90YWxCeVNvdXJjZSA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gIGNvbnN0IHNvdXJjZXNCeVRhcmdldCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgY29uc3QgdG90YWxCeVRhcmdldCA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG5cbiAgY29uc3QgcmVzb2x2ZWRMaW5rcyA9IGFwcC5tZXRhZGF0YUNhY2hlLnJlc29sdmVkTGlua3MgPz8ge307XG4gIGZvciAoY29uc3QgW3NvdXJjZVBhdGgsIGRlc3RpbmF0aW9uc10gb2YgT2JqZWN0LmVudHJpZXMocmVzb2x2ZWRMaW5rcykpIHtcbiAgICBjb25zdCB0YXJnZXRQYXRocyA9IE9iamVjdC5rZXlzKGRlc3RpbmF0aW9ucyk7XG4gICAgdGFyZ2V0c0J5U291cmNlLnNldChzb3VyY2VQYXRoLCB0YXJnZXRQYXRocyk7XG5cbiAgICBsZXQgdG90YWxPdXRnb2luZyA9IDA7XG4gICAgZm9yIChjb25zdCBbdGFyZ2V0UGF0aCwgY291bnRdIG9mIE9iamVjdC5lbnRyaWVzKGRlc3RpbmF0aW9ucykpIHtcbiAgICAgIGNvbnN0IHNhZmVDb3VudCA9IE51bWJlci5pc0Zpbml0ZShjb3VudCkgPyBNYXRoLm1heCgwLCBjb3VudCkgOiAwO1xuICAgICAgdG90YWxPdXRnb2luZyArPSBzYWZlQ291bnQ7XG5cbiAgICAgIGNvbnN0IGN1cnJlbnRTb3VyY2VzID0gc291cmNlc0J5VGFyZ2V0LmdldCh0YXJnZXRQYXRoKSA/PyBbXTtcbiAgICAgIGlmICghY3VycmVudFNvdXJjZXMuaW5jbHVkZXMoc291cmNlUGF0aCkpIHtcbiAgICAgICAgY3VycmVudFNvdXJjZXMucHVzaChzb3VyY2VQYXRoKTtcbiAgICAgICAgc291cmNlc0J5VGFyZ2V0LnNldCh0YXJnZXRQYXRoLCBjdXJyZW50U291cmNlcyk7XG4gICAgICB9XG4gICAgICB0b3RhbEJ5VGFyZ2V0LnNldCh0YXJnZXRQYXRoLCAodG90YWxCeVRhcmdldC5nZXQodGFyZ2V0UGF0aCkgPz8gMCkgKyBzYWZlQ291bnQpO1xuICAgIH1cblxuICAgIHRvdGFsQnlTb3VyY2Uuc2V0KHNvdXJjZVBhdGgsIHRvdGFsT3V0Z29pbmcpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0YXJnZXRzQnlTb3VyY2UsXG4gICAgdG90YWxCeVNvdXJjZSxcbiAgICBzb3VyY2VzQnlUYXJnZXQsXG4gICAgdG90YWxCeVRhcmdldCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc0xpbmtDb25zdHJhaW50cyhcbiAgYXBwOiBBcHAsXG4gIGxpbmtlZFBhdGhzOiBzdHJpbmdbXSxcbiAgdG90YWxMaW5rQ291bnQ6IG51bWJlcixcbiAgcnVsZXM6IE5vcm1hbGl6ZWRMaW5rUnVsZXMsXG4gIHRhZ0NhY2hlOiBNYXA8c3RyaW5nLCBTZXQ8c3RyaW5nPj4sXG4pOiBib29sZWFuIHtcbiAgaWYgKHJ1bGVzLm1pbkNvdW50ICE9PSB1bmRlZmluZWQgJiYgdG90YWxMaW5rQ291bnQgPCBydWxlcy5taW5Db3VudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChydWxlcy5tYXhDb3VudCAhPT0gdW5kZWZpbmVkICYmIHRvdGFsTGlua0NvdW50ID4gcnVsZXMubWF4Q291bnQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocnVsZXMuZmlsZVBhdGhzLnNpemUgPiAwICYmICFsaW5rZWRQYXRocy5zb21lKChwYXRoKSA9PiBydWxlcy5maWxlUGF0aHMuaGFzKHBhdGgpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChydWxlcy5mb2xkZXJQcmVmaXhlcy5sZW5ndGggPiAwICYmICFsaW5rZWRQYXRocy5zb21lKChwYXRoKSA9PiBpc1BhdGhJbkZvbGRlcihwYXRoLCBydWxlcy5mb2xkZXJQcmVmaXhlcykpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHJ1bGVzLndpdGhUYWdzLmxlbmd0aCA+IDAgJiYgIWxpbmtlZFBhdGhzLnNvbWUoKHBhdGgpID0+IGxpbmtlZEZpbGVNYXRjaGVzVGFncyhhcHAsIHBhdGgsIHJ1bGVzLCB0YWdDYWNoZSkpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGxpbmtlZEZpbGVNYXRjaGVzVGFncyhcbiAgYXBwOiBBcHAsXG4gIHBhdGg6IHN0cmluZyxcbiAgcnVsZXM6IE5vcm1hbGl6ZWRMaW5rUnVsZXMsXG4gIHRhZ0NhY2hlOiBNYXA8c3RyaW5nLCBTZXQ8c3RyaW5nPj4sXG4pOiBib29sZWFuIHtcbiAgY29uc3QgZmlsZSA9IGFzVEZpbGUoYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKSk7XG4gIGlmICghZmlsZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGxldCB0YWdzID0gdGFnQ2FjaGUuZ2V0KHBhdGgpO1xuICBpZiAoIXRhZ3MpIHtcbiAgICB0YWdzID0gbmV3IFNldChnZXRGaWxlVGFncyhhcHAsIGZpbGUpKTtcbiAgICB0YWdDYWNoZS5zZXQocGF0aCwgdGFncyk7XG4gIH1cblxuICBpZiAocnVsZXMudGFnTWF0Y2hNb2RlID09PSAnYWxsJykge1xuICAgIHJldHVybiBydWxlcy53aXRoVGFncy5ldmVyeSgodGFnKSA9PiB0YWdzLmhhcyh0YWcpKTtcbiAgfVxuXG4gIHJldHVybiBydWxlcy53aXRoVGFncy5zb21lKCh0YWcpID0+IHRhZ3MuaGFzKHRhZykpO1xufVxuXG5mdW5jdGlvbiBpc1BhdGhJbkZvbGRlcihwYXRoOiBzdHJpbmcsIGZvbGRlcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gIHJldHVybiBmb2xkZXJzLnNvbWUoKGZvbGRlcikgPT4gcGF0aCA9PT0gZm9sZGVyIHx8IHBhdGguc3RhcnRzV2l0aChgJHtmb2xkZXJ9L2ApKTtcbn1cblxuZnVuY3Rpb24gYXNURmlsZSh2YWx1ZTogdW5rbm93bik6IFRGaWxlIHwgbnVsbCB7XG4gIGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCEoJ3BhdGgnIGluIHZhbHVlKSB8fCAhKCdiYXNlbmFtZScgaW4gdmFsdWUpIHx8ICEoJ2V4dGVuc2lvbicgaW4gdmFsdWUpIHx8ICEoJ3N0YXQnIGluIHZhbHVlKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlIGFzIFRGaWxlO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgU291cmNlU2VsZWN0aW9uUnVsZXMgfSBmcm9tICcuLi9waXBlbGluZS90eXBlcyc7XG5pbXBvcnQgeyBjb21waWxlUGF0aFByZWRpY2F0ZSB9IGZyb20gJy4vZmlsdGVycy9wYXRoLWZpbHRlcic7XG5pbXBvcnQgeyBjb21waWxlVGFnUHJlZGljYXRlIH0gZnJvbSAnLi9maWx0ZXJzL3RhZy1maWx0ZXInO1xuaW1wb3J0IHsgY29tcGlsZURhdGVQcmVkaWNhdGUgfSBmcm9tICcuL2ZpbHRlcnMvZGF0ZS1maWx0ZXInO1xuaW1wb3J0IHsgY29tcGlsZUZyb250bWF0dGVyUHJlZGljYXRlIH0gZnJvbSAnLi9maWx0ZXJzL2Zyb250bWF0dGVyLWZpbHRlcic7XG5pbXBvcnQgeyBjb21waWxlSW5jb21pbmdMaW5rUHJlZGljYXRlLCBjb21waWxlT3V0Z29pbmdMaW5rUHJlZGljYXRlIH0gZnJvbSAnLi9maWx0ZXJzL2xpbmstZmlsdGVyJztcblxudHlwZSBGaWxlUHJlZGljYXRlID0gKGZpbGU6IFRGaWxlKSA9PiBib29sZWFuO1xuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyU291cmNlRmlsZXNCeU1ldGFkYXRhKGFwcDogQXBwLCBmaWxlczogVEZpbGVbXSwgcnVsZXM/OiBTb3VyY2VTZWxlY3Rpb25SdWxlcyk6IFRGaWxlW10ge1xuICBpZiAoIXJ1bGVzKSB7XG4gICAgcmV0dXJuIGZpbGVzO1xuICB9XG5cbiAgY29uc3QgcHJlZGljYXRlcyA9IGNvbXBpbGVQcmVkaWNhdGVzKGFwcCwgcnVsZXMpO1xuICBpZiAocHJlZGljYXRlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZmlsZXM7XG4gIH1cblxuICByZXR1cm4gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBwcmVkaWNhdGVzLmV2ZXJ5KChwcmVkaWNhdGUpID0+IHByZWRpY2F0ZShmaWxlKSkpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlUHJlZGljYXRlcyhhcHA6IEFwcCwgcnVsZXM6IFNvdXJjZVNlbGVjdGlvblJ1bGVzKTogRmlsZVByZWRpY2F0ZVtdIHtcbiAgY29uc3QgcHJlZGljYXRlczogRmlsZVByZWRpY2F0ZVtdID0gW107XG5cbiAgY29uc3QgcGF0aFByZWRpY2F0ZSA9IGNvbXBpbGVQYXRoUHJlZGljYXRlKHJ1bGVzKTtcbiAgaWYgKHBhdGhQcmVkaWNhdGUpIHtcbiAgICBwcmVkaWNhdGVzLnB1c2gocGF0aFByZWRpY2F0ZSk7XG4gIH1cblxuICBjb25zdCB0YWdQcmVkaWNhdGUgPSBjb21waWxlVGFnUHJlZGljYXRlKGFwcCwgcnVsZXMpO1xuICBpZiAodGFnUHJlZGljYXRlKSB7XG4gICAgcHJlZGljYXRlcy5wdXNoKHRhZ1ByZWRpY2F0ZSk7XG4gIH1cblxuICBjb25zdCBmcm9udG1hdHRlclByZWRpY2F0ZSA9IGNvbXBpbGVGcm9udG1hdHRlclByZWRpY2F0ZShhcHAsIHJ1bGVzKTtcbiAgaWYgKGZyb250bWF0dGVyUHJlZGljYXRlKSB7XG4gICAgcHJlZGljYXRlcy5wdXNoKGZyb250bWF0dGVyUHJlZGljYXRlKTtcbiAgfVxuXG4gIGNvbnN0IGRhdGVQcmVkaWNhdGUgPSBjb21waWxlRGF0ZVByZWRpY2F0ZShydWxlcyk7XG4gIGlmIChkYXRlUHJlZGljYXRlKSB7XG4gICAgcHJlZGljYXRlcy5wdXNoKGRhdGVQcmVkaWNhdGUpO1xuICB9XG5cbiAgY29uc3Qgb3V0Z29pbmdMaW5rUHJlZGljYXRlID0gY29tcGlsZU91dGdvaW5nTGlua1ByZWRpY2F0ZShhcHAsIHJ1bGVzKTtcbiAgaWYgKG91dGdvaW5nTGlua1ByZWRpY2F0ZSkge1xuICAgIHByZWRpY2F0ZXMucHVzaChvdXRnb2luZ0xpbmtQcmVkaWNhdGUpO1xuICB9XG5cbiAgY29uc3QgaW5jb21pbmdMaW5rUHJlZGljYXRlID0gY29tcGlsZUluY29taW5nTGlua1ByZWRpY2F0ZShhcHAsIHJ1bGVzKTtcbiAgaWYgKGluY29taW5nTGlua1ByZWRpY2F0ZSkge1xuICAgIHByZWRpY2F0ZXMucHVzaChpbmNvbWluZ0xpbmtQcmVkaWNhdGUpO1xuICB9XG5cbiAgcmV0dXJuIHByZWRpY2F0ZXM7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBcHAgfSBmcm9tICdvYnNpZGlhbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdmFpbGFibGVUYWdzKGFwcDogQXBwKTogc3RyaW5nW10ge1xuICBjb25zdCB0YWdzID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0VGFncygpO1xuICByZXR1cm4gT2JqZWN0LmtleXModGFncykuc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFJlbmRlclNldHRpbmdzLCBXZWlnaHRlZFdvcmQgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBDb3VudHNUb1dlaWdodGVkV29yZHMoXG4gIGVudHJpZXM6IEFycmF5PFtzdHJpbmcsIG51bWJlcl0+LFxuICByZW5kZXJTZXR0aW5nczogUmVuZGVyU2V0dGluZ3MsXG4pOiBXZWlnaHRlZFdvcmRbXSB7XG4gIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IG1pbkZvbnRTaXplID0gTWF0aC5tYXgoOCwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy5taW5Gb250U2l6ZSkpO1xuICBjb25zdCBtYXhGb250U2l6ZSA9IE1hdGgubWF4KG1pbkZvbnRTaXplICsgMSwgTWF0aC5yb3VuZChyZW5kZXJTZXR0aW5ncy5tYXhGb250U2l6ZSkpO1xuICBjb25zdCBlbXBoYXNpcyA9IE1hdGgubWF4KDAuNSwgTWF0aC5taW4oMywgcmVuZGVyU2V0dGluZ3MuZW1waGFzaXMpKTtcblxuICBjb25zdCBub3JtYWxpemVkRW50cmllcyA9IGVudHJpZXNcbiAgICAubWFwKChbdGV4dCwgY291bnRdLCBpbmRleCkgPT4gKHtcbiAgICAgIHRleHQsXG4gICAgICBjb3VudCxcbiAgICAgIGluZGV4LFxuICAgICAgc2NvcmU6IGNvbXB1dGVTY2FsZVNjb3JlKGNvdW50LCBpbmRleCwgZW50cmllcywgcmVuZGVyU2V0dGluZ3MsIGVtcGhhc2lzKSxcbiAgICB9KSlcbiAgICAuc29ydCgoYSwgYikgPT4gYi5jb3VudCAtIGEuY291bnQgfHwgYS5pbmRleCAtIGIuaW5kZXgpO1xuXG4gIHJldHVybiBub3JtYWxpemVkRW50cmllcy5tYXAoKGVudHJ5KSA9PiAoe1xuICAgIHRleHQ6IGVudHJ5LnRleHQsXG4gICAgY291bnQ6IGVudHJ5LmNvdW50LFxuICAgIHNpemU6IE1hdGgucm91bmQobWluRm9udFNpemUgKyBlbnRyeS5zY29yZSAqIChtYXhGb250U2l6ZSAtIG1pbkZvbnRTaXplKSksXG4gIH0pKTtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZVNjYWxlU2NvcmUoXG4gIGNvdW50OiBudW1iZXIsXG4gIGluZGV4OiBudW1iZXIsXG4gIGVudHJpZXM6IEFycmF5PFtzdHJpbmcsIG51bWJlcl0+LFxuICByZW5kZXJTZXR0aW5nczogUmVuZGVyU2V0dGluZ3MsXG4gIGVtcGhhc2lzOiBudW1iZXIsXG4pOiBudW1iZXIge1xuICBjb25zdCBjb3VudHMgPSBlbnRyaWVzLm1hcCgoWywgZW50cnlDb3VudF0pID0+IGVudHJ5Q291bnQpO1xuICBjb25zdCBtaW5Db3VudCA9IGNvdW50c1tjb3VudHMubGVuZ3RoIC0gMV07XG4gIGNvbnN0IG1heENvdW50ID0gY291bnRzWzBdO1xuXG4gIGlmIChtYXhDb3VudCA8PSBtaW5Db3VudCkge1xuICAgIHJldHVybiAwLjU7XG4gIH1cblxuICBpZiAocmVuZGVyU2V0dGluZ3Muc2NhbGluZ01vZGUgPT09ICdyYW5rJykge1xuICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIDAuNTtcbiAgICB9XG4gICAgcmV0dXJuIDEgLSBpbmRleCAvIChlbnRyaWVzLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgaWYgKHJlbmRlclNldHRpbmdzLnNjYWxpbmdNb2RlID09PSAnbG9nJykge1xuICAgIGNvbnN0IHNhZmVNaW4gPSBNYXRoLm1heCgxLCBtaW5Db3VudCk7XG4gICAgY29uc3Qgc2FmZU1heCA9IE1hdGgubWF4KHNhZmVNaW4gKyAxLCBtYXhDb3VudCk7XG4gICAgY29uc3QgbnVtZXJhdG9yID0gTWF0aC5sb2coTWF0aC5tYXgoMSwgY291bnQpKSAtIE1hdGgubG9nKHNhZmVNaW4pO1xuICAgIGNvbnN0IGRlbm9taW5hdG9yID0gTWF0aC5sb2coc2FmZU1heCkgLSBNYXRoLmxvZyhzYWZlTWluKTtcbiAgICByZXR1cm4gY2xhbXAwMShkZW5vbWluYXRvciA9PT0gMCA/IDAuNSA6IG51bWVyYXRvciAvIGRlbm9taW5hdG9yKTtcbiAgfVxuXG4gIGNvbnN0IGxpbmVhciA9IChjb3VudCAtIG1pbkNvdW50KSAvIChtYXhDb3VudCAtIG1pbkNvdW50KTtcbiAgaWYgKHJlbmRlclNldHRpbmdzLnNjYWxpbmdNb2RlID09PSAncG93ZXInKSB7XG4gICAgcmV0dXJuIGNsYW1wMDEoTWF0aC5wb3cobGluZWFyLCBlbXBoYXNpcykpO1xuICB9XG5cbiAgcmV0dXJuIGNsYW1wMDEobGluZWFyKTtcbn1cblxuZnVuY3Rpb24gY2xhbXAwMSh2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGgubWluKDEsIE1hdGgubWF4KDAsIHZhbHVlKSk7XG59XG4iLCAiaW1wb3J0IHsgTUFYX1dPUkRTLCBNSU5fV09SRF9MRU5HVEggfSBmcm9tICcuLi8uLi8uLi9jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUgeyBSZW5kZXJTZXR0aW5ncywgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgbWFwQ291bnRzVG9XZWlnaHRlZFdvcmRzIH0gZnJvbSAnLi4vd29yZC1zY2FsaW5nJztcbmltcG9ydCB0eXBlIHtcbiAgQWdncmVnYXRlUmVzdWx0LFxuICBBZ2dyZWdhdG9yU3RyYXRlZ3ksXG4gIERpc3RyaWJ1dGlvbkJ1Y2tldCxcbiAgRmlsdGVyU3RyYXRlZ3ksXG4gIFBpcGVsaW5lU3RyYXRlZ2llcyxcbiAgUmVuZGVyTW9kZWwsXG4gIFJlbmRlck1vZGVsU3RyYXRlZ3ksXG4gIFNjYWxpbmdTdHJhdGVneSxcbiAgVG9rZW4sXG4gIFRva2VuaXplclN0cmF0ZWd5LFxufSBmcm9tICcuLi90eXBlcyc7XG5cbmNvbnN0IGRlZmF1bHRUb2tlbml6ZXI6IFRva2VuaXplclN0cmF0ZWd5ID0ge1xuICB0b2tlbml6ZSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRleHQubWF0Y2goL1thLXowLTldW2EtejAtOSctXSovZykgPz8gW107XG4gIH0sXG59O1xuXG5jb25zdCBkZWZhdWx0RmlsdGVyOiBGaWx0ZXJTdHJhdGVneSA9IHtcbiAgaW5jbHVkZVRva2VuKHRva2VuOiBzdHJpbmcsIHN0b3BXb3JkczogU2V0PHN0cmluZz4pOiBib29sZWFuIHtcbiAgICBjb25zdCBub3JtYWxpemVkID0gdG9rZW4udHJpbSgpO1xuICAgIHJldHVybiBub3JtYWxpemVkLmxlbmd0aCA+PSBNSU5fV09SRF9MRU5HVEggJiYgIXN0b3BXb3Jkcy5oYXMobm9ybWFsaXplZCk7XG4gIH0sXG59O1xuXG5jb25zdCBkZWZhdWx0QWdncmVnYXRvcjogQWdncmVnYXRvclN0cmF0ZWd5ID0ge1xuICBhZ2dyZWdhdGUodG9rZW5zOiBUb2tlbltdKTogQWdncmVnYXRlUmVzdWx0IHtcbiAgICBjb25zdCBjb3VudHMgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuXG4gICAgZm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbnMpIHtcbiAgICAgIGNvdW50cy5zZXQodG9rZW4udmFsdWUsIChjb3VudHMuZ2V0KHRva2VuLnZhbHVlKSA/PyAwKSArIDEpO1xuICAgIH1cblxuICAgIGNvbnN0IGVudHJpZXMgPSBbLi4uY291bnRzLmVudHJpZXMoKV1cbiAgICAgIC5zb3J0KChhLCBiKSA9PiBiWzFdIC0gYVsxXSlcbiAgICAgIC5zbGljZSgwLCBNQVhfV09SRFMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGVudHJpZXMsXG4gICAgICB0b3RhbFRva2VuczogdG9rZW5zLmxlbmd0aCxcbiAgICAgIGRpc3RpbmN0VG9rZW5zOiBjb3VudHMuc2l6ZSxcbiAgICB9O1xuICB9LFxufTtcblxuY29uc3QgZGVmYXVsdFNjYWxpbmc6IFNjYWxpbmdTdHJhdGVneSA9IHtcbiAgc2NhbGUoZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyk6IFdlaWdodGVkV29yZFtdIHtcbiAgICByZXR1cm4gbWFwQ291bnRzVG9XZWlnaHRlZFdvcmRzKGVudHJpZXMsIHJlbmRlclNldHRpbmdzKTtcbiAgfSxcbn07XG5cbmNvbnN0IGRlZmF1bHRSZW5kZXJNb2RlbDogUmVuZGVyTW9kZWxTdHJhdGVneSA9IHtcbiAgYnVpbGRNb2RlbCh3b3JkczogV2VpZ2h0ZWRXb3JkW10sIGFnZ3JlZ2F0ZTogQWdncmVnYXRlUmVzdWx0KTogUmVuZGVyTW9kZWwge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkQ2xvdWRXb3Jkczogd29yZHMsXG4gICAgICBkaXN0cmlidXRpb25TZXJpZXM6IGJ1aWxkRGlzdHJpYnV0aW9uU2VyaWVzKHdvcmRzKSxcbiAgICAgIHRvdGFsVG9rZW5zOiBhZ2dyZWdhdGUudG90YWxUb2tlbnMsXG4gICAgICBkaXN0aW5jdFRva2VuczogYWdncmVnYXRlLmRpc3RpbmN0VG9rZW5zLFxuICAgIH07XG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9QSVBFTElORV9TVFJBVEVHSUVTOiBQaXBlbGluZVN0cmF0ZWdpZXMgPSB7XG4gIHRva2VuaXplcjogZGVmYXVsdFRva2VuaXplcixcbiAgZmlsdGVyOiBkZWZhdWx0RmlsdGVyLFxuICBhZ2dyZWdhdG9yOiBkZWZhdWx0QWdncmVnYXRvcixcbiAgc2NhbGluZzogZGVmYXVsdFNjYWxpbmcsXG4gIHJlbmRlck1vZGVsOiBkZWZhdWx0UmVuZGVyTW9kZWwsXG59O1xuXG5mdW5jdGlvbiBidWlsZERpc3RyaWJ1dGlvblNlcmllcyh3b3JkczogV2VpZ2h0ZWRXb3JkW10pOiBEaXN0cmlidXRpb25CdWNrZXRbXSB7XG4gIGlmICh3b3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBtYXhDb3VudCA9IHdvcmRzWzBdPy5jb3VudCA/PyAwO1xuICBpZiAobWF4Q291bnQgPD0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IGJ1Y2tldENvdW50ID0gTWF0aC5taW4oOCwgTWF0aC5tYXgoNCwgTWF0aC5yb3VuZChNYXRoLnNxcnQod29yZHMubGVuZ3RoKSkpKTtcbiAgY29uc3Qgd2lkdGggPSBNYXRoLm1heCgxLCBNYXRoLmNlaWwobWF4Q291bnQgLyBidWNrZXRDb3VudCkpO1xuICBjb25zdCBidWNrZXRzID0gbmV3IE1hcDxudW1iZXIsIG51bWJlcj4oKTtcblxuICBmb3IgKGNvbnN0IHdvcmQgb2Ygd29yZHMpIHtcbiAgICBjb25zdCBpbmRleCA9IE1hdGgubWluKGJ1Y2tldENvdW50IC0gMSwgTWF0aC5mbG9vcigod29yZC5jb3VudCAtIDEpIC8gd2lkdGgpKTtcbiAgICBidWNrZXRzLnNldChpbmRleCwgKGJ1Y2tldHMuZ2V0KGluZGV4KSA/PyAwKSArIDEpO1xuICB9XG5cbiAgY29uc3QgZGlzdHJpYnV0aW9uOiBEaXN0cmlidXRpb25CdWNrZXRbXSA9IFtdO1xuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYnVja2V0Q291bnQ7IGluZGV4ICs9IDEpIHtcbiAgICBjb25zdCBtaW4gPSBpbmRleCAqIHdpZHRoICsgMTtcbiAgICBjb25zdCBtYXggPSBpbmRleCA9PT0gYnVja2V0Q291bnQgLSAxID8gbWF4Q291bnQgOiAoaW5kZXggKyAxKSAqIHdpZHRoO1xuICAgIGRpc3RyaWJ1dGlvbi5wdXNoKHtcbiAgICAgIGxhYmVsOiBgJHttaW59LSR7bWF4fWAsXG4gICAgICBtaW4sXG4gICAgICBtYXgsXG4gICAgICB2YWx1ZTogYnVja2V0cy5nZXQoaW5kZXgpID8/IDAsXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZGlzdHJpYnV0aW9uO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQWdncmVnYXRlUmVzdWx0LCBBZ2dyZWdhdG9yU3RyYXRlZ3ksIFRva2VuIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWdncmVnYXRlVG9rZW5zKHRva2VuczogVG9rZW5bXSwgc3RyYXRlZ3k6IEFnZ3JlZ2F0b3JTdHJhdGVneSk6IEFnZ3JlZ2F0ZVJlc3VsdCB7XG4gIHJldHVybiBzdHJhdGVneS5hZ2dyZWdhdGUodG9rZW5zKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEZyZXF1ZW5jeVRocmVzaG9sZHMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUZyZXF1ZW5jeVRocmVzaG9sZHMoXG4gIGVudHJpZXM6IEFycmF5PFtzdHJpbmcsIG51bWJlcl0+LFxuICB0aHJlc2hvbGRzPzogRnJlcXVlbmN5VGhyZXNob2xkcyxcbik6IEFycmF5PFtzdHJpbmcsIG51bWJlcl0+IHtcbiAgaWYgKCF0aHJlc2hvbGRzKSB7XG4gICAgcmV0dXJuIGVudHJpZXM7XG4gIH1cblxuICBjb25zdCBtaW5Db3VudCA9IGNsYW1wVGhyZXNob2xkKHRocmVzaG9sZHMubWluQ291bnQsIDEpO1xuICBjb25zdCBtYXhDb3VudCA9IGNsYW1wVGhyZXNob2xkKHRocmVzaG9sZHMubWF4Q291bnQsIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKTtcbiAgY29uc3Qgc2FmZU1pbkNvdW50ID0gTWF0aC5taW4obWluQ291bnQsIG1heENvdW50KTtcblxuICByZXR1cm4gZW50cmllcy5maWx0ZXIoKFssIGNvdW50XSkgPT4gY291bnQgPj0gc2FmZU1pbkNvdW50ICYmIGNvdW50IDw9IG1heENvdW50KTtcbn1cblxuZnVuY3Rpb24gY2xhbXBUaHJlc2hvbGQodmFsdWU6IG51bWJlciB8IHVuZGVmaW5lZCwgZmFsbGJhY2s6IG51bWJlcik6IG51bWJlciB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInIHx8IE51bWJlci5pc05hTih2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsbGJhY2s7XG4gIH1cblxuICByZXR1cm4gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh2YWx1ZSkpO1xufVxuXG4iLCAiaW1wb3J0IHR5cGUgeyBGaWx0ZXJTdHJhdGVneSwgVG9rZW4gfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJUb2tlbnModG9rZW5zOiBUb2tlbltdLCBzdG9wV29yZHM6IFNldDxzdHJpbmc+LCBzdHJhdGVneTogRmlsdGVyU3RyYXRlZ3kpOiBUb2tlbltdIHtcbiAgcmV0dXJuIHRva2Vucy5maWx0ZXIoKHRva2VuKSA9PiBzdHJhdGVneS5pbmNsdWRlVG9rZW4odG9rZW4udmFsdWUsIHN0b3BXb3JkcykpO1xufVxuIiwgImltcG9ydCB7IEZST05UTUFUVEVSX1BBVFRFUk4sIFdPUkRfQ0xPVURfQkxPQ0tfUEFUVEVSTiB9IGZyb20gJy4uLy4uLy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgdHlwZSB7IE5vcm1hbGl6ZWREb2N1bWVudCwgUGlwZWxpbmVEb2N1bWVudCB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZURvY3VtZW50cyhkb2N1bWVudHM6IFBpcGVsaW5lRG9jdW1lbnRbXSk6IE5vcm1hbGl6ZWREb2N1bWVudFtdIHtcbiAgcmV0dXJuIGRvY3VtZW50cy5tYXAoKGRvY3VtZW50KSA9PiAoe1xuICAgIGlkOiBkb2N1bWVudC5pZCxcbiAgICBwYXRoOiBkb2N1bWVudC5wYXRoLFxuICAgIGJhc2VuYW1lOiBkb2N1bWVudC5iYXNlbmFtZSxcbiAgICB0YWdzOiBbLi4uZG9jdW1lbnQudGFnc10sXG4gICAgdGV4dDogZG9jdW1lbnQucmF3VGV4dFxuICAgICAgLnJlcGxhY2UoRlJPTlRNQVRURVJfUEFUVEVSTiwgJycpXG4gICAgICAucmVwbGFjZShXT1JEX0NMT1VEX0JMT0NLX1BBVFRFUk4sICcnKVxuICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgIC5ub3JtYWxpemUoJ05GS0MnKSxcbiAgfSkpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQWdncmVnYXRlUmVzdWx0LCBSZW5kZXJNb2RlbCwgUmVuZGVyTW9kZWxTdHJhdGVneSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgV2VpZ2h0ZWRXb3JkIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVuZGVyTW9kZWwoXG4gIHdvcmRzOiBXZWlnaHRlZFdvcmRbXSxcbiAgYWdncmVnYXRlUmVzdWx0OiBBZ2dyZWdhdGVSZXN1bHQsXG4gIHN0cmF0ZWd5OiBSZW5kZXJNb2RlbFN0cmF0ZWd5LFxuKTogUmVuZGVyTW9kZWwge1xuICByZXR1cm4gc3RyYXRlZ3kuYnVpbGRNb2RlbCh3b3JkcywgYWdncmVnYXRlUmVzdWx0KTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFJlbmRlclNldHRpbmdzLCBXZWlnaHRlZFdvcmQgfSBmcm9tICcuLi8uLi8uLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFNjYWxpbmdTdHJhdGVneSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlRW50cmllcyhcbiAgZW50cmllczogQXJyYXk8W3N0cmluZywgbnVtYmVyXT4sXG4gIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyxcbiAgc3RyYXRlZ3k6IFNjYWxpbmdTdHJhdGVneSxcbik6IFdlaWdodGVkV29yZFtdIHtcbiAgcmV0dXJuIHN0cmF0ZWd5LnNjYWxlKGVudHJpZXMsIHJlbmRlclNldHRpbmdzKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFBpcGVsaW5lRG9jdW1lbnQsIFNvdXJjZVNlbGVjdGlvblJ1bGVzIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbm9ybWFsaXplVGFnIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0RG9jdW1lbnRzKGRvY3VtZW50czogUGlwZWxpbmVEb2N1bWVudFtdLCBydWxlcz86IFNvdXJjZVNlbGVjdGlvblJ1bGVzKTogUGlwZWxpbmVEb2N1bWVudFtdIHtcbiAgaWYgKCFydWxlcykge1xuICAgIHJldHVybiBkb2N1bWVudHM7XG4gIH1cblxuICBjb25zdCBpbmNsdWRlVGFncyA9IChydWxlcy5pbmNsdWRlVGFncyA/PyBbXSlcbiAgICAubWFwKCh0YWcpID0+IG5vcm1hbGl6ZVRhZyh0YWcpKVxuICAgIC5maWx0ZXIoKHRhZykgPT4gdGFnLmxlbmd0aCA+IDApO1xuICBjb25zdCBleGNsdWRlVGFncyA9IChydWxlcy5leGNsdWRlVGFncyA/PyBbXSlcbiAgICAubWFwKCh0YWcpID0+IG5vcm1hbGl6ZVRhZyh0YWcpKVxuICAgIC5maWx0ZXIoKHRhZykgPT4gdGFnLmxlbmd0aCA+IDApO1xuXG4gIGNvbnN0IHNjb3BlID0gcnVsZXMuc2NvcGU7XG4gIGNvbnN0IGFjdGl2ZUZpbGVQYXRoID0gc2NvcGU/LmFjdGl2ZUZpbGVQYXRoPy50cmltKCkgPz8gJyc7XG4gIGNvbnN0IGZvbGRlclBhdGhzID0gKHNjb3BlPy5mb2xkZXJQYXRocyA/PyBbXSkubWFwKChwcmVmaXgpID0+IHByZWZpeC50cmltKCkpLmZpbHRlcihCb29sZWFuKTtcbiAgY29uc3QgZnJvbnRtYXR0ZXJSdWxlcyA9IChydWxlcy5mcm9udG1hdHRlclJ1bGVzID8/IFtdKVxuICAgIC5maWx0ZXIoKHJ1bGUpID0+IHJ1bGUua2V5LnRyaW0oKS5sZW5ndGggPiAwKTtcbiAgY29uc3QgcXVlcnlUZXh0ID0gcnVsZXMucXVlcnlUZXh0Py50cmltKCkudG9Mb3dlckNhc2UoKSA/PyAnJztcbiAgY29uc3QgdGFnTWF0Y2hNb2RlID0gcnVsZXMudGFnTWF0Y2hNb2RlID8/ICdhbnknO1xuXG4gIHJldHVybiBkb2N1bWVudHMuZmlsdGVyKChkb2N1bWVudCkgPT4ge1xuICAgIGlmICghbWF0Y2hlc1Njb3BlKGRvY3VtZW50LnBhdGgsIHNjb3BlPy5tb2RlID8/ICd2YXVsdCcsIGFjdGl2ZUZpbGVQYXRoLCBmb2xkZXJQYXRocykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaW5jbHVkZVRhZ3MubGVuZ3RoID4gMCAmJiAhbWF0Y2hlc1RhZ1J1bGVzKGRvY3VtZW50LnRhZ3MsIGluY2x1ZGVUYWdzLCB0YWdNYXRjaE1vZGUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGV4Y2x1ZGVUYWdzLmxlbmd0aCA+IDAgJiYgbWF0Y2hlc0FueVRhZyhkb2N1bWVudC50YWdzLCBleGNsdWRlVGFncykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbnRtYXR0ZXJSdWxlcy5sZW5ndGggPiAwICYmICFtYXRjaGVzRnJvbnRtYXR0ZXJSdWxlcyhkb2N1bWVudC5mcm9udG1hdHRlciwgZnJvbnRtYXR0ZXJSdWxlcykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocXVlcnlUZXh0Lmxlbmd0aCA+IDAgJiYgIW1hdGNoZXNRdWVyeVRleHQoZG9jdW1lbnQsIHF1ZXJ5VGV4dCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNUYWdSdWxlcyhkb2N1bWVudFRhZ3M6IHN0cmluZ1tdLCBmaWx0ZXJzOiBzdHJpbmdbXSwgbW9kZTogJ2FueScgfCAnYWxsJyk6IGJvb2xlYW4ge1xuICBjb25zdCBub3JtYWxpemVkVGFncyA9IG5ldyBTZXQoZG9jdW1lbnRUYWdzLm1hcCgodGFnKSA9PiBub3JtYWxpemVUYWcodGFnKSkuZmlsdGVyKEJvb2xlYW4pKTtcbiAgaWYgKG1vZGUgPT09ICdhbGwnKSB7XG4gICAgcmV0dXJuIGZpbHRlcnMuZXZlcnkoKGZpbHRlclRhZykgPT4gbm9ybWFsaXplZFRhZ3MuaGFzKGZpbHRlclRhZykpO1xuICB9XG5cbiAgcmV0dXJuIGZpbHRlcnMuc29tZSgoZmlsdGVyVGFnKSA9PiBub3JtYWxpemVkVGFncy5oYXMoZmlsdGVyVGFnKSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNBbnlUYWcoZG9jdW1lbnRUYWdzOiBzdHJpbmdbXSwgZmlsdGVyczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgY29uc3Qgbm9ybWFsaXplZFRhZ3MgPSBuZXcgU2V0KGRvY3VtZW50VGFncy5tYXAoKHRhZykgPT4gbm9ybWFsaXplVGFnKHRhZykpLmZpbHRlcihCb29sZWFuKSk7XG4gIHJldHVybiBmaWx0ZXJzLnNvbWUoKGZpbHRlclRhZykgPT4gbm9ybWFsaXplZFRhZ3MuaGFzKGZpbHRlclRhZykpO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzU2NvcGUocGF0aDogc3RyaW5nLCBtb2RlOiAndmF1bHQnIHwgJ2FjdGl2ZS1maWxlJyB8ICdmb2xkZXInLCBhY3RpdmVGaWxlUGF0aDogc3RyaW5nLCBmb2xkZXJQYXRoczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgaWYgKG1vZGUgPT09ICdhY3RpdmUtZmlsZScpIHtcbiAgICByZXR1cm4gYWN0aXZlRmlsZVBhdGgubGVuZ3RoID4gMCAmJiBwYXRoID09PSBhY3RpdmVGaWxlUGF0aDtcbiAgfVxuXG4gIGlmIChtb2RlID09PSAnZm9sZGVyJykge1xuICAgIGlmIChmb2xkZXJQYXRocy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9sZGVyUGF0aHMuc29tZSgoZm9sZGVyUGF0aCkgPT4gcGF0aCA9PT0gZm9sZGVyUGF0aCB8fCBwYXRoLnN0YXJ0c1dpdGgoYCR7Zm9sZGVyUGF0aH0vYCkpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNGcm9udG1hdHRlclJ1bGVzKFxuICBmcm9udG1hdHRlcjogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIHJ1bGVzOiBTb3VyY2VTZWxlY3Rpb25SdWxlc1snZnJvbnRtYXR0ZXJSdWxlcyddLFxuKTogYm9vbGVhbiB7XG4gIGlmICghcnVsZXMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBydWxlcy5ldmVyeSgocnVsZSkgPT4ge1xuICAgIGNvbnN0IGtleSA9IHJ1bGUua2V5LnRyaW0oKTtcbiAgICBpZiAoIWtleSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgYWN0dWFsID0gZnJvbnRtYXR0ZXJba2V5XTtcbiAgICBjb25zdCBleHBlY3RlZCA9IChydWxlLnZhbHVlID8/ICcnKS50cmltKCk7XG5cbiAgICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ2V4aXN0cycpIHtcbiAgICAgIHJldHVybiBhY3R1YWwgIT09IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHJ1bGUub3BlcmF0b3IgPT09ICdub3QtZXhpc3RzJykge1xuICAgICAgcmV0dXJuIGFjdHVhbCA9PT0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmIChhY3R1YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChydWxlLm9wZXJhdG9yID09PSAnY29udGFpbnMnKSB7XG4gICAgICByZXR1cm4gY29udGFpbnNWYWx1ZShhY3R1YWwsIGV4cGVjdGVkKTtcbiAgICB9XG5cbiAgICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ2VxdWFscycpIHtcbiAgICAgIHJldHVybiBjb21wYXJlU2NhbGFyKGFjdHVhbCwgZXhwZWN0ZWQpID09PSAwO1xuICAgIH1cbiAgICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ25vdC1lcXVhbHMnKSB7XG4gICAgICByZXR1cm4gY29tcGFyZVNjYWxhcihhY3R1YWwsIGV4cGVjdGVkKSAhPT0gMDtcbiAgICB9XG4gICAgaWYgKHJ1bGUub3BlcmF0b3IgPT09ICdndCcpIHtcbiAgICAgIHJldHVybiBjb21wYXJlU2NhbGFyKGFjdHVhbCwgZXhwZWN0ZWQpID4gMDtcbiAgICB9XG4gICAgaWYgKHJ1bGUub3BlcmF0b3IgPT09ICdndGUnKSB7XG4gICAgICByZXR1cm4gY29tcGFyZVNjYWxhcihhY3R1YWwsIGV4cGVjdGVkKSA+PSAwO1xuICAgIH1cbiAgICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ2x0Jykge1xuICAgICAgcmV0dXJuIGNvbXBhcmVTY2FsYXIoYWN0dWFsLCBleHBlY3RlZCkgPCAwO1xuICAgIH1cbiAgICBpZiAocnVsZS5vcGVyYXRvciA9PT0gJ2x0ZScpIHtcbiAgICAgIHJldHVybiBjb21wYXJlU2NhbGFyKGFjdHVhbCwgZXhwZWN0ZWQpIDw9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjb250YWluc1ZhbHVlKGFjdHVhbDogdW5rbm93biwgZXhwZWN0ZWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBub3JtYWxpemVkRXhwZWN0ZWQgPSBleHBlY3RlZC50b0xvd2VyQ2FzZSgpO1xuICBpZiAoQXJyYXkuaXNBcnJheShhY3R1YWwpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5zb21lKChlbnRyeSkgPT4gU3RyaW5nKGVudHJ5KS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKG5vcm1hbGl6ZWRFeHBlY3RlZCkpO1xuICB9XG5cbiAgcmV0dXJuIFN0cmluZyhhY3R1YWwpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMobm9ybWFsaXplZEV4cGVjdGVkKTtcbn1cblxuZnVuY3Rpb24gY29tcGFyZVNjYWxhcihhY3R1YWw6IHVua25vd24sIGV4cGVjdGVkOiBzdHJpbmcpOiBudW1iZXIge1xuICBjb25zdCBudW1lcmljQWN0dWFsID0gdHJ5UGFyc2VOdW1iZXIoYWN0dWFsKTtcbiAgY29uc3QgbnVtZXJpY0V4cGVjdGVkID0gdHJ5UGFyc2VOdW1iZXIoZXhwZWN0ZWQpO1xuICBpZiAobnVtZXJpY0FjdHVhbCAhPT0gbnVsbCAmJiBudW1lcmljRXhwZWN0ZWQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVtZXJpY0FjdHVhbCAtIG51bWVyaWNFeHBlY3RlZDtcbiAgfVxuXG4gIGNvbnN0IGRhdGVBY3R1YWwgPSB0cnlQYXJzZURhdGUoYWN0dWFsKTtcbiAgY29uc3QgZGF0ZUV4cGVjdGVkID0gdHJ5UGFyc2VEYXRlKGV4cGVjdGVkKTtcbiAgaWYgKGRhdGVBY3R1YWwgIT09IG51bGwgJiYgZGF0ZUV4cGVjdGVkICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGRhdGVBY3R1YWwgLSBkYXRlRXhwZWN0ZWQ7XG4gIH1cblxuICBjb25zdCBib29sZWFuQWN0dWFsID0gdHJ5UGFyc2VCb29sZWFuKGFjdHVhbCk7XG4gIGNvbnN0IGJvb2xlYW5FeHBlY3RlZCA9IHRyeVBhcnNlQm9vbGVhbihleHBlY3RlZCk7XG4gIGlmIChib29sZWFuQWN0dWFsICE9PSBudWxsICYmIGJvb2xlYW5FeHBlY3RlZCAhPT0gbnVsbCkge1xuICAgIGlmIChib29sZWFuQWN0dWFsID09PSBib29sZWFuRXhwZWN0ZWQpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gYm9vbGVhbkFjdHVhbCA/IDEgOiAtMTtcbiAgfVxuXG4gIHJldHVybiBTdHJpbmcoYWN0dWFsKS5sb2NhbGVDb21wYXJlKGV4cGVjdGVkLCB1bmRlZmluZWQsIHsgc2Vuc2l0aXZpdHk6ICdiYXNlJywgbnVtZXJpYzogdHJ1ZSB9KTtcbn1cblxuZnVuY3Rpb24gdHJ5UGFyc2VOdW1iZXIodmFsdWU6IHVua25vd24pOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzRmluaXRlKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcGFyc2VkID0gTnVtYmVyKHZhbHVlKTtcbiAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHBhcnNlZCkpIHtcbiAgICAgIHJldHVybiBwYXJzZWQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHRyeVBhcnNlRGF0ZSh2YWx1ZTogdW5rbm93bik6IG51bWJlciB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHBhcnNlZCA9IERhdGUucGFyc2UodmFsdWUpO1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4ocGFyc2VkKSA/IG51bGwgOiBwYXJzZWQ7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gdHJ5UGFyc2VCb29sZWFuKHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB2YWx1ZS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAobm9ybWFsaXplZCA9PT0gJ3RydWUnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKG5vcm1hbGl6ZWQgPT09ICdmYWxzZScpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1F1ZXJ5VGV4dChkb2N1bWVudDogUGlwZWxpbmVEb2N1bWVudCwgcXVlcnlUZXh0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGRvY3VtZW50LnBhdGgudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeVRleHQpXG4gICAgfHwgZG9jdW1lbnQuYmFzZW5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhxdWVyeVRleHQpXG4gICAgfHwgZG9jdW1lbnQucmF3VGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5VGV4dCk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBOb3JtYWxpemVkRG9jdW1lbnQsIFRva2VuLCBUb2tlbml6ZXJTdHJhdGVneSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHRva2VuaXplRG9jdW1lbnRzKGRvY3VtZW50czogTm9ybWFsaXplZERvY3VtZW50W10sIHN0cmF0ZWd5OiBUb2tlbml6ZXJTdHJhdGVneSk6IFRva2VuW10ge1xuICBjb25zdCB0b2tlbnM6IFRva2VuW10gPSBbXTtcblxuICBmb3IgKGNvbnN0IGRvY3VtZW50IG9mIGRvY3VtZW50cykge1xuICAgIGNvbnN0IHZhbHVlcyA9IHN0cmF0ZWd5LnRva2VuaXplKGRvY3VtZW50LnRleHQpO1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgIHZhbHVlLFxuICAgICAgICBkb2N1bWVudElkOiBkb2N1bWVudC5pZCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0b2tlbnM7XG59XG4iLCAiaW1wb3J0IHsgREVGQVVMVF9QSVBFTElORV9TVFJBVEVHSUVTIH0gZnJvbSAnLi9zdHJhdGVnaWVzJztcbmltcG9ydCB7IGFnZ3JlZ2F0ZVRva2VucyB9IGZyb20gJy4vc3RhZ2VzLzA2LWFnZ3JlZ2F0ZS10b2tlbi1jb3VudHMnO1xuaW1wb3J0IHsgYXBwbHlGcmVxdWVuY3lUaHJlc2hvbGRzIH0gZnJvbSAnLi9zdGFnZXMvMDctYXBwbHktZnJlcXVlbmN5LXRocmVzaG9sZHMnO1xuaW1wb3J0IHsgZmlsdGVyVG9rZW5zIH0gZnJvbSAnLi9zdGFnZXMvMDUtZmlsdGVyLXRva2Vucyc7XG5pbXBvcnQgeyBub3JtYWxpemVEb2N1bWVudHMgfSBmcm9tICcuL3N0YWdlcy8wMy1ub3JtYWxpemUtZG9jdW1lbnRzJztcbmltcG9ydCB7IGNyZWF0ZVJlbmRlck1vZGVsIH0gZnJvbSAnLi9zdGFnZXMvMDktY3JlYXRlLXJlbmRlci1tb2RlbCc7XG5pbXBvcnQgeyBzY2FsZUVudHJpZXMgfSBmcm9tICcuL3N0YWdlcy8wOC1zY2FsZS13b3JkLXdlaWdodHMnO1xuaW1wb3J0IHsgc2VsZWN0RG9jdW1lbnRzIH0gZnJvbSAnLi9zdGFnZXMvMDItZmlsdGVyLWJ5LXNvdXJjZS1jb250ZW50JztcbmltcG9ydCB7IHRva2VuaXplRG9jdW1lbnRzIH0gZnJvbSAnLi9zdGFnZXMvMDQtdG9rZW5pemUtZG9jdW1lbnRzJztcbmltcG9ydCB0eXBlIHsgUGlwZWxpbmVJbnB1dCwgUGlwZWxpbmVTdHJhdGVnaWVzLCBSZW5kZXJNb2RlbCB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcnVuVHJhbnNmb3JtUGlwZWxpbmUoXG4gIGlucHV0OiBQaXBlbGluZUlucHV0LFxuICBvdmVycmlkZXM6IFBhcnRpYWw8UGlwZWxpbmVTdHJhdGVnaWVzPiA9IHt9LFxuKTogUmVuZGVyTW9kZWwge1xuICBjb25zdCBzdHJhdGVnaWVzOiBQaXBlbGluZVN0cmF0ZWdpZXMgPSB7XG4gICAgLi4uREVGQVVMVF9QSVBFTElORV9TVFJBVEVHSUVTLFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfTtcblxuICBjb25zdCBzZWxlY3RlZERvY3VtZW50cyA9IHNlbGVjdERvY3VtZW50cyhpbnB1dC5kb2N1bWVudHMsIGlucHV0LnNvdXJjZVJ1bGVzKTtcbiAgY29uc3Qgbm9ybWFsaXplZERvY3VtZW50cyA9IG5vcm1hbGl6ZURvY3VtZW50cyhzZWxlY3RlZERvY3VtZW50cyk7XG4gIGNvbnN0IHRva2VucyA9IHRva2VuaXplRG9jdW1lbnRzKG5vcm1hbGl6ZWREb2N1bWVudHMsIHN0cmF0ZWdpZXMudG9rZW5pemVyKTtcbiAgY29uc3QgZmlsdGVyZWRUb2tlbnMgPSBmaWx0ZXJUb2tlbnModG9rZW5zLCBpbnB1dC5zdG9wV29yZHMsIHN0cmF0ZWdpZXMuZmlsdGVyKTtcbiAgY29uc3QgYWdncmVnYXRlUmVzdWx0ID0gYWdncmVnYXRlVG9rZW5zKGZpbHRlcmVkVG9rZW5zLCBzdHJhdGVnaWVzLmFnZ3JlZ2F0b3IpO1xuICBjb25zdCBmaWx0ZXJlZEVudHJpZXMgPSBhcHBseUZyZXF1ZW5jeVRocmVzaG9sZHMoYWdncmVnYXRlUmVzdWx0LmVudHJpZXMsIGlucHV0LmZyZXF1ZW5jeSk7XG4gIGNvbnN0IHdvcmRzID0gc2NhbGVFbnRyaWVzKGZpbHRlcmVkRW50cmllcywgaW5wdXQucmVuZGVyU2V0dGluZ3MsIHN0cmF0ZWdpZXMuc2NhbGluZyk7XG5cbiAgcmV0dXJuIGNyZWF0ZVJlbmRlck1vZGVsKHdvcmRzLCBhZ2dyZWdhdGVSZXN1bHQsIHN0cmF0ZWdpZXMucmVuZGVyTW9kZWwpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgQXBwLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgUmVuZGVyU2V0dGluZ3MsIFdlaWdodGVkV29yZCB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCB7IHJlYWRQaXBlbGluZURvY3VtZW50cyB9IGZyb20gJy4uL2luZ2VzdGlvbi9vYnNpZGlhbi1zb3VyY2UnO1xuaW1wb3J0IHsgZmlsdGVyU291cmNlRmlsZXNCeU1ldGFkYXRhIH0gZnJvbSAnLi4vaW5nZXN0aW9uL21ldGFkYXRhLWZpbGUtZmlsdGVyJztcbmltcG9ydCB7IGdldEF2YWlsYWJsZVRhZ3MgfSBmcm9tICcuLi9pbmdlc3Rpb24vdGFnLWNhdGFsb2cnO1xuaW1wb3J0IHsgcnVuVHJhbnNmb3JtUGlwZWxpbmUgfSBmcm9tICcuLi9waXBlbGluZS9ydW4tdHJhbnNmb3JtLXBpcGVsaW5lJztcbmltcG9ydCB0eXBlIHsgRnJlcXVlbmN5VGhyZXNob2xkcywgU291cmNlU2VsZWN0aW9uUnVsZXMgfSBmcm9tICcuLi9waXBlbGluZS90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBXb3JkQ2xvdWRTZXJ2aWNlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBhcHA6IEFwcDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCkge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICB9XG5cbiAgZ2V0QXZhaWxhYmxlVGFncygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIGdldEF2YWlsYWJsZVRhZ3ModGhpcy5hcHApO1xuICB9XG5cbiAgYXN5bmMgY29sbGVjdEZyb21GaWxlcyhcbiAgICBmaWxlczogVEZpbGVbXSxcbiAgICBzdG9wV29yZHM6IFNldDxzdHJpbmc+LFxuICAgIHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyxcbiAgICBvblByb2dyZXNzPzogKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKSA9PiB2b2lkLFxuICAgIG9wdGlvbnM/OiB7XG4gICAgICBzb3VyY2VSdWxlcz86IFNvdXJjZVNlbGVjdGlvblJ1bGVzO1xuICAgICAgZnJlcXVlbmN5PzogRnJlcXVlbmN5VGhyZXNob2xkcztcbiAgICAgIGV4Y2x1ZGVXb3Jkcz86IHN0cmluZ1tdO1xuICAgIH0sXG4gICk6IFByb21pc2U8V2VpZ2h0ZWRXb3JkW10+IHtcbiAgICBjb25zdCBmaWxlc0ZvclNjYW4gPSBmaWx0ZXJTb3VyY2VGaWxlc0J5TWV0YWRhdGEodGhpcy5hcHAsIGZpbGVzLCBvcHRpb25zPy5zb3VyY2VSdWxlcyk7XG5cbiAgICBjb25zdCBwZXJmb3JtYW5jZSA9IGdldFBlcmZvcm1hbmNlUHJvZmlsZShyZW5kZXJTZXR0aW5ncy5wcm9ncmVzc0RldGFpbCk7XG4gICAgY29uc3QgcmVwb3J0UHJvZ3Jlc3MgPSBjcmVhdGVUaHJvdHRsZWRQcm9ncmVzcyhvblByb2dyZXNzLCBwZXJmb3JtYW5jZS5wcm9ncmVzc1Rocm90dGxlTXMpO1xuICAgIGNvbnN0IHJlYWRCYXRjaFNpemUgPSBwZXJmb3JtYW5jZS5mdWxsUGFyYWxsZWxSZWFkXG4gICAgICA/IE1hdGgubWF4KDEsIGZpbGVzRm9yU2Nhbi5sZW5ndGgpXG4gICAgICA6IE1hdGgubWF4KDgsIE1hdGgucm91bmQocmVuZGVyU2V0dGluZ3Muc2NhbkJhdGNoU2l6ZSkpO1xuXG4gICAgY29uc3QgZG9jdW1lbnRzID0gYXdhaXQgcmVhZFBpcGVsaW5lRG9jdW1lbnRzKFxuICAgICAgdGhpcy5hcHAsXG4gICAgICBmaWxlc0ZvclNjYW4sXG4gICAgICByZWFkQmF0Y2hTaXplLFxuICAgICAgKG1lc3NhZ2UsIHBlcmNlbnQpID0+IHtcbiAgICAgICAgcmVwb3J0UHJvZ3Jlc3MobWVzc2FnZSwgcGVyY2VudCk7XG4gICAgICB9LFxuICAgICk7XG5cbiAgICByZXBvcnRQcm9ncmVzcygnVG9rZW5pemluZyBhbmQgYWdncmVnYXRpbmcuLi4nLCA4NSk7XG5cbiAgICBjb25zdCBjb21iaW5lZFN0b3BXb3JkcyA9IG5ldyBTZXQoc3RvcFdvcmRzKTtcbiAgICBmb3IgKGNvbnN0IHdvcmQgb2Ygb3B0aW9ucz8uZXhjbHVkZVdvcmRzID8/IFtdKSB7XG4gICAgICBjb25zdCBub3JtYWxpemVkID0gd29yZC50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChub3JtYWxpemVkKSB7XG4gICAgICAgIGNvbWJpbmVkU3RvcFdvcmRzLmFkZChub3JtYWxpemVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtb2RlbCA9IHJ1blRyYW5zZm9ybVBpcGVsaW5lKHtcbiAgICAgIGRvY3VtZW50cyxcbiAgICAgIHN0b3BXb3JkczogY29tYmluZWRTdG9wV29yZHMsXG4gICAgICByZW5kZXJTZXR0aW5ncyxcbiAgICAgIHNvdXJjZVJ1bGVzOiBvcHRpb25zPy5zb3VyY2VSdWxlcyxcbiAgICAgIGZyZXF1ZW5jeTogb3B0aW9ucz8uZnJlcXVlbmN5LFxuICAgIH0pO1xuXG4gICAgcmVwb3J0UHJvZ3Jlc3MoJ1ByZXBhcmluZyBsYXlvdXQuLi4nLCA5NSk7XG5cbiAgICByZXR1cm4gbW9kZWwud29yZENsb3VkV29yZHM7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlVGhyb3R0bGVkUHJvZ3Jlc3MoXG4gIG9uUHJvZ3Jlc3M6ICgobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQpIHwgdW5kZWZpbmVkLFxuICBtaW5JbnRlcnZhbE1zOiBudW1iZXIsXG4pOiAobWVzc2FnZTogc3RyaW5nLCBwZXJjZW50OiBudW1iZXIpID0+IHZvaWQge1xuICBpZiAoIW9uUHJvZ3Jlc3MpIHtcbiAgICByZXR1cm4gKCkgPT4gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGV0IGxhc3RSZXBvcnRlZEF0ID0gMDtcbiAgbGV0IGxhc3RQZXJjZW50ID0gLTE7XG5cbiAgcmV0dXJuIChtZXNzYWdlOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgaWYgKHBlcmNlbnQgIT09IDEwMCAmJiBwZXJjZW50ID09PSBsYXN0UGVyY2VudCAmJiBub3cgLSBsYXN0UmVwb3J0ZWRBdCA8IG1pbkludGVydmFsTXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHBlcmNlbnQgIT09IDEwMCAmJiBub3cgLSBsYXN0UmVwb3J0ZWRBdCA8IG1pbkludGVydmFsTXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsYXN0UmVwb3J0ZWRBdCA9IG5vdztcbiAgICBsYXN0UGVyY2VudCA9IHBlcmNlbnQ7XG4gICAgb25Qcm9ncmVzcyhtZXNzYWdlLCBwZXJjZW50KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0UGVyZm9ybWFuY2VQcm9maWxlKGRldGFpbDogUmVuZGVyU2V0dGluZ3NbJ3Byb2dyZXNzRGV0YWlsJ10pOiB7XG4gIHByb2dyZXNzVGhyb3R0bGVNczogbnVtYmVyO1xuICBmdWxsUGFyYWxsZWxSZWFkOiBib29sZWFuO1xufSB7XG4gIGlmIChkZXRhaWwgPT09ICd1bmhpbmdlZCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiAxXzAwMF8wMDAsXG4gICAgICBmdWxsUGFyYWxsZWxSZWFkOiB0cnVlLFxuICAgIH07XG4gIH1cblxuICBpZiAoZGV0YWlsID09PSAnZGV0YWlsZWQnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2dyZXNzVGhyb3R0bGVNczogMjUsXG4gICAgICBmdWxsUGFyYWxsZWxSZWFkOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGRldGFpbCA9PT0gJ21pbmltYWwnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2dyZXNzVGhyb3R0bGVNczogMjIwLFxuICAgICAgZnVsbFBhcmFsbGVsUmVhZDogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcHJvZ3Jlc3NUaHJvdHRsZU1zOiA4MCxcbiAgICBmdWxsUGFyYWxsZWxSZWFkOiBmYWxzZSxcbiAgfTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgRGVwcyB9IGZyb20gJy4vZGVwcyc7XG5pbXBvcnQgeyBFdmVudENvb3JkaW5hdG9yIH0gZnJvbSAnLi9ldmVudHMvY29vcmRpbmF0b3InO1xuaW1wb3J0IHsgT2JzaWRpYW5BZGFwdGVyIH0gZnJvbSAnLi9pbnRlZ3JhdGlvbi9vYnNpZGlhbi1hZGFwdGVyJztcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gJy4vc2V0dGluZ3Mvc2VydmljZSc7XG5pbXBvcnQgeyBXb3JkQ2xvdWRBcHBTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy93b3JkY2xvdWQtc2VydmljZXMnO1xuaW1wb3J0IHsgV29yZENsb3VkU2VydmljZSB9IGZyb20gJy4vd29yZGNsb3VkL2FwcGxpY2F0aW9uL3dvcmRjbG91ZC1zZXJ2aWNlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZURlcHMocGx1Z2luOiBQbHVnaW4pOiBQcm9taXNlPERlcHM+IHtcbiAgY29uc3Qgc2V0dGluZ3NTZXJ2aWNlID0gbmV3IFNldHRpbmdzU2VydmljZShwbHVnaW4pO1xuICBhd2FpdCBzZXR0aW5nc1NlcnZpY2UubG9hZCgpO1xuXG4gIGNvbnN0IGFkYXB0ZXIgPSBuZXcgT2JzaWRpYW5BZGFwdGVyKHBsdWdpbi5hcHApO1xuICBjb25zdCBwcm9jZXNzb3IgPSBuZXcgV29yZENsb3VkU2VydmljZShwbHVnaW4uYXBwKTtcbiAgY29uc3Qgd29yZENsb3VkID0gbmV3IFdvcmRDbG91ZEFwcFNlcnZpY2UocGx1Z2luLmFwcCwgYWRhcHRlciwgcHJvY2Vzc29yLCBzZXR0aW5nc1NlcnZpY2UpO1xuICBjb25zdCBjb29yZGluYXRvciA9IG5ldyBFdmVudENvb3JkaW5hdG9yKCk7XG5cbiAgcmV0dXJuIHtcbiAgICBzZXR0aW5nc1NlcnZpY2UsXG4gICAgYWRhcHRlcixcbiAgICBzZXJ2aWNlczoge1xuICAgICAgd29yZENsb3VkLFxuICAgIH0sXG4gICAgY29vcmRpbmF0b3IsXG4gICAgZGlzcG9zZTogKCkgPT4ge1xuICAgICAgY29vcmRpbmF0b3IuZGlzcG9zZSgpO1xuICAgICAgc2V0dGluZ3NTZXJ2aWNlLmRpc3Bvc2UoKTtcbiAgICB9LFxuICB9O1xufVxuIiwgImltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHR5cGUgeyBEZXBzIH0gZnJvbSAnLi4vZGVwcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckV2ZW50cyhfcGx1Z2luOiBQbHVnaW4sIF9kZXBzOiBEZXBzKTogdm9pZCB7XG4gIC8vIFdvcmtzcGFjZS92YXVsdCBldmVudCByZWdpc3RyYXRpb25zIGJlbG9uZyBoZXJlLlxufVxuIiwgImV4cG9ydCB0eXBlIERpc3Bvc2FibGUgPSB7IGRpc3Bvc2U6ICgpID0+IHZvaWQgfTtcblxudHlwZSBEaXNwb3NlQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgRGlzcG9zZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IGNhbGxiYWNrczogRGlzcG9zZUNhbGxiYWNrW10gPSBbXTtcblxuICBhZGQoZGlzcG9zYWJsZTogRGlzcG9zYWJsZSB8IERpc3Bvc2VDYWxsYmFjayk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgZGlzcG9zYWJsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5jYWxsYmFja3MucHVzaChkaXNwb3NhYmxlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKCgpID0+IHtcbiAgICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgZGlzcG9zZUFsbCgpOiB2b2lkIHtcbiAgICB3aGlsZSAodGhpcy5jYWxsYmFja3MubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrcy5wb3AoKTtcbiAgICAgIGNhbGxiYWNrPy4oKTtcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7XG4gIENvdW50TGFiZWxGb3JtYXQsXG4gIFByb2dyZXNzRGV0YWlsLFxuICBSZW5kZXJTZXR0aW5ncyxcbiAgUm90YXRpb25QcmVzZXQsXG4gIFNjYWxpbmdNb2RlLFxuICBTcGlyYWxUeXBlLFxuICBXb3JkVGV4dE1ldHJpYyxcbiAgV2VpZ2h0ZWRXb3JkLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFdvcmRDbG91ZFNlcnZpY2VzIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHR5cGUgeyBXb3JkQ2xvdWRTZXR0aW5nc0NvbnRyb2xzIH0gZnJvbSAnLi4vc2VydmljZXMvd29yZGNsb3VkLXNlcnZpY2VzJztcbmltcG9ydCB7IG1hcENvdW50c1RvV2VpZ2h0ZWRXb3JkcyB9IGZyb20gJy4uL3dvcmRjbG91ZC9waXBlbGluZS93b3JkLXNjYWxpbmcnO1xuXG50eXBlIFNldHRpbmdzVGFiU2VydmljZXMgPSBXb3JkQ2xvdWRTZXJ2aWNlcyAmIFdvcmRDbG91ZFNldHRpbmdzQ29udHJvbHM7XG5cbmV4cG9ydCBjbGFzcyBWYXVsdFdvcmRDbG91ZFNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgcHJpdmF0ZSByZWFkb25seSBzZXJ2aWNlczogU2V0dGluZ3NUYWJTZXJ2aWNlcztcblxuICBjb25zdHJ1Y3RvcihwbHVnaW46IFBsdWdpbiwgc2VydmljZXM6IFNldHRpbmdzVGFiU2VydmljZXMpIHtcbiAgICBzdXBlcihwbHVnaW4uYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMuc2VydmljZXMgPSBzZXJ2aWNlcztcbiAgfVxuXG4gIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnV29yZCBjbG91ZHMgc2V0dGluZ3MnIH0pO1xuICAgIGNvbnN0IHNldHRpbmdzID0gdGhpcy5zZXJ2aWNlcy5nZXRTZXR0aW5nc1NuYXBzaG90KCk7XG5cbiAgICBsZXQgZHJhZnRXb3JkID0gJyc7XG5cbiAgICBjb25zdCBhZGRFeGNsdWRlZFdvcmQgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdBZGQgZXhjbHVkZWQgd29yZCcpXG4gICAgICAuc2V0RGVzYygnQWRkIG9uZSB3b3JkIGF0IGEgdGltZSB0byB0aGUgYmxhY2tsaXN0LicpXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICB0ZXh0LnNldFBsYWNlaG9sZGVyKCdXb3JkIHRvIGV4Y2x1ZGUnKTtcbiAgICAgICAgdGV4dC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICBkcmFmdFdvcmQgPSB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgIGJ1dHRvblxuICAgICAgICAgIC5zZXRCdXR0b25UZXh0KCdBZGQnKVxuICAgICAgICAgIC5zZXRDdGEoKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFkZGVkID0gYXdhaXQgdGhpcy5zZXJ2aWNlcy5hZGRCbGFja2xpc3RXb3JkKGRyYWZ0V29yZCk7XG4gICAgICAgICAgICBpZiAoYWRkZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGFkZEV4Y2x1ZGVkV29yZCwgJ0V4Y2x1ZGVkIHdvcmRzIGFyZSBhbHdheXMgaWdub3JlZCBmcm9tIGNvdW50aW5nIGFuZCBzaXppbmcgaW4gYWxsIGNsb3VkIHR5cGVzLicpO1xuXG4gICAgY29uc3QgbGlzdFdyYXBwZXJFbCA9IGNvbnRhaW5lckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtbGlzdCcgfSk7XG4gICAgbGlzdFdyYXBwZXJFbC5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6ICdFeGNsdWRlZCB3b3JkcycgfSk7XG4gICAgY29uc3QgbGlzdEVsID0gbGlzdFdyYXBwZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXNldHRpbmdzLWJhZGdlcycgfSk7XG4gICAgY29uc3Qgc29ydGVkV29yZHMgPSBbLi4uc2V0dGluZ3MuYmxhY2tsaXN0V29yZHNdLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSk7XG5cbiAgICBpZiAoc29ydGVkV29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBsaXN0RWwuY3JlYXRlU3Bhbih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtYmFkZ2VzLWVtcHR5JywgdGV4dDogJ05vIGV4Y2x1ZGVkIHdvcmRzIGNvbmZpZ3VyZWQuJyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCB3b3JkIG9mIHNvcnRlZFdvcmRzKSB7XG4gICAgICAgIGNvbnN0IGJhZGdlRWwgPSBsaXN0RWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zZXR0aW5ncy1iYWRnZScgfSk7XG4gICAgICAgIGJhZGdlRWwuY3JlYXRlU3Bhbih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtYmFkZ2UtdGV4dCcsIHRleHQ6IHdvcmQgfSk7XG5cbiAgICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gYmFkZ2VFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtYmFkZ2UtcmVtb3ZlJyxcbiAgICAgICAgICB0ZXh0OiAneCcsXG4gICAgICAgIH0pO1xuICAgICAgICByZW1vdmVCdXR0b24uc2V0QXR0cignYXJpYS1sYWJlbCcsIGBSZW1vdmUgJHt3b3JkfWApO1xuICAgICAgICByZW1vdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXJ2aWNlcy5yZW1vdmVCbGFja2xpc3RXb3JkKHdvcmQpO1xuICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXNldEV4Y2x1ZGVkV29yZHMgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdSZXNldCBleGNsdWRlZCB3b3JkcycpXG4gICAgICAuc2V0RGVzYygnUmVzdG9yZSB0aGUgb3JpZ2luYWwgZGVmYXVsdCBibGFja2xpc3QuJylcbiAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b25cbiAgICAgICAgICAuc2V0QnV0dG9uVGV4dCgnUmVzZXQgdG8gZGVmYXVsdHMnKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VydmljZXMucmVzZXRCbGFja2xpc3RXb3JkcygpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHJlc2V0RXhjbHVkZWRXb3JkcywgJ1Jlc2V0cyBvbmx5IGV4Y2x1ZGVkIHdvcmRzLiBSZW5kZXJpbmcgYW5kIHBlcmZvcm1hbmNlIHNldHRpbmdzIGFyZSB1bmNoYW5nZWQuJyk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6ICdSZW5kZXJpbmcnIH0pO1xuXG4gICAgY29uc3QgcHJldmlld1dyYXBwZXJFbCA9IGNvbnRhaW5lckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtcHJldmlldycgfSk7XG4gICAgcHJldmlld1dyYXBwZXJFbC5jcmVhdGVFbCgnaDQnLCB7IHRleHQ6ICdQcmV2aWV3JyB9KTtcbiAgICBwcmV2aWV3V3JhcHBlckVsLmNyZWF0ZUVsKCdwJywge1xuICAgICAgdGV4dDogJ0V4YW1wbGUgY2xvdWQgZm9yIHJlbmRlciBzZXR0aW5ncyAoZG9lcyBub3QgdXNlIHlvdXIgdmF1bHQgZGF0YSkuJyxcbiAgICB9KTtcbiAgICBjb25zdCBwcmV2aWV3Q2FudmFzRWwgPSBwcmV2aWV3V3JhcHBlckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc2V0dGluZ3MtcHJldmlldy1jYW52YXMnIH0pO1xuXG4gICAgbGV0IHByZXZpZXdOb25jZSA9IDA7XG4gICAgY29uc3QgcmVyZW5kZXJQcmV2aWV3ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgY29uc3Qgbm9uY2UgPSArK3ByZXZpZXdOb25jZTtcbiAgICAgIHByZXZpZXdDYW52YXNFbC5lbXB0eSgpO1xuICAgICAgY29uc3QgbG9hZGluZ0VsID0gcHJldmlld0NhbnZhc0VsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLCB0ZXh0OiAnUmVuZGVyaW5nIHByZXZpZXcuLi4nIH0pO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBzYW1wbGVXb3JkcyA9IHRoaXMuYnVpbGRQcmV2aWV3V29yZHModGhpcy5zZXJ2aWNlcy5nZXRTZXR0aW5nc1NuYXBzaG90KCkucmVuZGVyKTtcbiAgICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuICAgICAgICBhd2FpdCB0aGlzLnNlcnZpY2VzLmRyYXdXb3JkQ2xvdWQoe1xuICAgICAgICAgIGNvbnRhaW5lckVsOiBwcmV2aWV3Q2FudmFzRWwsXG4gICAgICAgICAgd29yZHM6IHNhbXBsZVdvcmRzLFxuICAgICAgICAgIGFyaWFMYWJlbDogJ1dvcmQgY2xvdWQgcmVuZGVyIHByZXZpZXcnLFxuICAgICAgICAgIG9uUmVmcmVzaDogcmVyZW5kZXJQcmV2aWV3LFxuICAgICAgICAgIG9uV29yZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAvLyBuby1vcCBpbiBzZXR0aW5ncyBwcmV2aWV3XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlbmFibGVFeHBvcnQ6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICBpZiAobm9uY2UgIT09IHByZXZpZXdOb25jZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICAgICAgcHJldmlld0NhbnZhc0VsLmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsXG4gICAgICAgICAgdGV4dDogJ0NvdWxkIG5vdCByZW5kZXIgcHJldmlldy4nLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlUmVuZGVyQW5kUHJldmlldyA9IGFzeW5jIChwYXRjaDogUGFydGlhbDxSZW5kZXJTZXR0aW5ncz4pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc2VydmljZXMudXBkYXRlUmVuZGVyU2V0dGluZ3MocGF0Y2gpO1xuICAgICAgYXdhaXQgcmVyZW5kZXJQcmV2aWV3KCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHJvdGF0aW9uU3R5bGUgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdSb3RhdGlvbiBzdHlsZScpXG4gICAgICAuc2V0RGVzYygnSG93IHdvcmRzIGFyZSBhbmdsZWQgaW4gdGhlIGNsb3VkLicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbignaG9yaXpvbnRhbCcsICdIb3Jpem9udGFsIG9ubHknKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ21vc3RseS1ob3Jpem9udGFsJywgJ01vc3RseSBob3Jpem9udGFsJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdtaXhlZCcsICdNaXhlZCBhbmdsZXMnKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ3ZlcnRpY2FsJywgJ1ZlcnRpY2FsIGhlYXZ5JylcbiAgICAgICAgICAuc2V0VmFsdWUoc2V0dGluZ3MucmVuZGVyLnJvdGF0aW9uUHJlc2V0KVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoe1xuICAgICAgICAgICAgICByb3RhdGlvblByZXNldDogdmFsdWUgYXMgUm90YXRpb25QcmVzZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24ocm90YXRpb25TdHlsZSwgJ0hvcml6b250YWwgaXMgZWFzaWVzdCB0byByZWFkLiBNaXhlZC92ZXJ0aWNhbCBjYW4gcGFjayBtb3JlIHdvcmRzIGJ1dCBtYXkgcmVkdWNlIHJlYWRhYmlsaXR5LicpO1xuXG4gICAgY29uc3Qgc3BpcmFsTGF5b3V0ID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnU3BpcmFsIGxheW91dCcpXG4gICAgICAuc2V0RGVzYygnUGxhY2VtZW50IHN0cmF0ZWd5IGZvciBwb3NpdGlvbmluZyB3b3Jkcy4nKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb24oJ2FyY2hpbWVkZWFuJywgJ0FyY2hpbWVkZWFuJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdyZWN0YW5ndWxhcicsICdSZWN0YW5ndWxhcicpXG4gICAgICAgICAgLnNldFZhbHVlKHNldHRpbmdzLnJlbmRlci5zcGlyYWwpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7XG4gICAgICAgICAgICAgIHNwaXJhbDogdmFsdWUgYXMgU3BpcmFsVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihzcGlyYWxMYXlvdXQsICdBcmNoaW1lZGVhbiBpcyBtb3JlIG9yZ2FuaWMuIFJlY3Rhbmd1bGFyIGNhbiBhcHBlYXIgdGlnaHRlciBpbiBzb21lIGRhdGFzZXRzLicpO1xuXG4gICAgY29uc3Qgd29yZFBhZGRpbmcgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdXb3JkIHBhZGRpbmcnKVxuICAgICAgLnNldERlc2MoJ1NwYWNlIGJldHdlZW4gd29yZHMgaW4gcGl4ZWxzLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cygwLCAxMiwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUoc2V0dGluZ3MucmVuZGVyLndvcmRQYWRkaW5nKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IHdvcmRQYWRkaW5nOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24od29yZFBhZGRpbmcsICdJbmNyZWFzZSB0byByZWR1Y2UgY29sbGlzaW9ucyBhbmQgaW1wcm92ZSByZWFkYWJpbGl0eS4gTG93ZXIgdmFsdWVzIHBhY2sgbW9yZSB3b3Jkcy4nKTtcblxuICAgIGNvbnN0IG1pbkZvbnRTaXplID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnTWluaW11bSBmb250IHNpemUnKVxuICAgICAgLnNldERlc2MoJ1NtYWxsZXN0IHJlbmRlcmVkIHdvcmQgc2l6ZS4nKVxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG4gICAgICAgIHNsaWRlclxuICAgICAgICAgIC5zZXRMaW1pdHMoOCwgNjQsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHNldHRpbmdzLnJlbmRlci5taW5Gb250U2l6ZSlcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyBtaW5Gb250U2l6ZTogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKG1pbkZvbnRTaXplLCAnU2V0cyB0aGUgZmxvb3Igb2YgdmlzdWFsIHNpemUgbWFwcGluZy4gSGlnaGVyIG1pbmltdW0gbWFrZXMgbG93LWZyZXF1ZW5jeSB3b3JkcyBtb3JlIGxlZ2libGUuJyk7XG5cbiAgICBjb25zdCBtYXhGb250U2l6ZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ01heGltdW0gZm9udCBzaXplJylcbiAgICAgIC5zZXREZXNjKCdMYXJnZXN0IHJlbmRlcmVkIHdvcmQgc2l6ZS4nKVxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG4gICAgICAgIHNsaWRlclxuICAgICAgICAgIC5zZXRMaW1pdHMoMTYsIDE0MCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUoc2V0dGluZ3MucmVuZGVyLm1heEZvbnRTaXplKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IG1heEZvbnRTaXplOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24obWF4Rm9udFNpemUsICdTZXRzIHRoZSBjZWlsaW5nIG9mIHZpc3VhbCBzaXplIG1hcHBpbmcuIEhpZ2hlciB2YWx1ZXMgZW1waGFzaXplIHRvcCB3b3JkcyBtb3JlIHN0cm9uZ2x5LicpO1xuXG4gICAgY29uc3QgZm9udEZhbWlseSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0ZvbnQgZmFtaWx5JylcbiAgICAgIC5zZXREZXNjKCdDU1MgZm9udCBmYW1pbHkgdXNlZCBmb3Igd29yZHMuJylcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB7XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ3NhbnMtc2VyaWYnKVxuICAgICAgICAgIC5zZXRWYWx1ZShzZXR0aW5ncy5yZW5kZXIuZm9udEZhbWlseSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgZm9udEZhbWlseTogdmFsdWUudHJpbSgpIHx8ICdzYW5zLXNlcmlmJyB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oZm9udEZhbWlseSwgJ1dpZGVyIGZvbnRzIHRha2UgbW9yZSBzcGFjZSBhbmQgY2FuIGluY3JlYXNlIG92ZXJsYXAgcHJlc3N1cmUuJyk7XG5cbiAgICBjb25zdCBzaG93Q291bnRJbldvcmRUZXh0ID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnU2hvdyB2YWx1ZSBpbiB3b3JkIHRleHQnKVxuICAgICAgLnNldERlc2MoJ0FwcGVuZCBjb3VudCBvciBmcmVxdWVuY3kgZGlyZWN0bHkgdG8gcmVuZGVyZWQgd29yZHMuJylcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGVcbiAgICAgICAgICAuc2V0VmFsdWUoc2V0dGluZ3MucmVuZGVyLnNob3dDb3VudEluV29yZFRleHQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IHNob3dDb3VudEluV29yZFRleHQ6IHZhbHVlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHNob3dDb3VudEluV29yZFRleHQsICdTaG93cyB0aGUgc2VsZWN0ZWQgbWV0cmljIGlubGluZSAoZm9yIGV4YW1wbGUsIHdvcmQgKDEyKSBvciB3b3JkICg0LjMlKSkuIEltcHJvdmVzIHByZWNpc2lvbiwgaW5jcmVhc2VzIHRleHQgbGVuZ3RoLicpO1xuXG4gICAgY29uc3Qgd29yZFRleHRNZXRyaWMgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdXb3JkIHZhbHVlIG1vZGUnKVxuICAgICAgLnNldERlc2MoJ0Nob29zZSB3aGV0aGVyIGlubGluZSB2YWx1ZXMgc2hvdyBjb3VudCBvciBmcmVxdWVuY3kuJylcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9uKCdjb3VudCcsICdDb3VudCcpXG4gICAgICAgICAgLmFkZE9wdGlvbignZnJlcXVlbmN5JywgJ0ZyZXF1ZW5jeSAoJSknKVxuICAgICAgICAgIC5zZXRWYWx1ZShzZXR0aW5ncy5yZW5kZXIud29yZFRleHRNZXRyaWMpXG4gICAgICAgICAgLnNldERpc2FibGVkKCFzZXR0aW5ncy5yZW5kZXIuc2hvd0NvdW50SW5Xb3JkVGV4dClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgd29yZFRleHRNZXRyaWM6IHZhbHVlIGFzIFdvcmRUZXh0TWV0cmljIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbih3b3JkVGV4dE1ldHJpYywgJ0NvdW50IHNob3dzIHJhdyBvY2N1cnJlbmNlcy4gRnJlcXVlbmN5IHNob3dzIGVhY2ggd29yZCBhcyBhIHBlcmNlbnQgb2YgdmlzaWJsZSB3b3JkIG9jY3VycmVuY2VzLicpO1xuXG4gICAgY29uc3Qgc2hvd1dvcmRUZXh0TWV0cmljVG9nZ2xlID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnU2hvdyBjb3VudC9mcmVxdWVuY3kgdG9nZ2xlIGJ1dHRvbicpXG4gICAgICAuc2V0RGVzYygnQWRkIGEgcmVuZGVyZWQtdmlldyBidXR0b24gdG8gc3dpdGNoIGlubGluZSBsYWJlbHMgYmV0d2VlbiBjb3VudCBhbmQgZnJlcXVlbmN5LicpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgLnNldFZhbHVlKHNldHRpbmdzLnJlbmRlci5zaG93V29yZFRleHRNZXRyaWNUb2dnbGUpXG4gICAgICAgICAgLnNldERpc2FibGVkKCFzZXR0aW5ncy5yZW5kZXIuc2hvd0NvdW50SW5Xb3JkVGV4dClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgc2hvd1dvcmRUZXh0TWV0cmljVG9nZ2xlOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oc2hvd1dvcmRUZXh0TWV0cmljVG9nZ2xlLCAnV2hlbiBlbmFibGVkLCBlYWNoIGNsb3VkIHNob3dzIGEgcXVpY2sgdG9nZ2xlIGluIHRoZSBjb3JuZXIgY29udHJvbHMuJyk7XG5cbiAgICBjb25zdCBjb3VudExhYmVsRm9ybWF0ID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnQ291bnQgbGFiZWwgZm9ybWF0JylcbiAgICAgIC5zZXREZXNjKCdIb3cgaW5saW5lIHZhbHVlcyBhcmUgc2hvd24gd2hlbiB3b3JkIHRleHQgdmFsdWVzIGFyZSBlbmFibGVkLicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbigncGFyZW4nLCAnd29yZCAoMTIpJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdkb3QnLCAnd29yZCBcdTAwQjcgMTInKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ2NvbG9uJywgJ3dvcmQ6IDEyJylcbiAgICAgICAgICAuc2V0VmFsdWUoc2V0dGluZ3MucmVuZGVyLmNvdW50TGFiZWxGb3JtYXQpXG4gICAgICAgICAgLnNldERpc2FibGVkKCFzZXR0aW5ncy5yZW5kZXIuc2hvd0NvdW50SW5Xb3JkVGV4dClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgY291bnRMYWJlbEZvcm1hdDogdmFsdWUgYXMgQ291bnRMYWJlbEZvcm1hdCB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oY291bnRMYWJlbEZvcm1hdCwgJ0Zvcm1hdHRpbmcgc3R5bGUgZm9yIGlubGluZSBjb3VudHMuJyk7XG5cbiAgICBjb25zdCBjb3VudExhYmVsTWluaW11bSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0NvdW50IGxhYmVsIG1pbmltdW0nKVxuICAgICAgLnNldERlc2MoJ1Nob3cgaW5saW5lIGNvdW50IG9ubHkgZm9yIHdvcmRzIGF0IG9yIGFib3ZlIHRoaXMgY291bnQuJylcbiAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT4ge1xuICAgICAgICBzbGlkZXJcbiAgICAgICAgICAuc2V0TGltaXRzKDEsIDEwMCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUoc2V0dGluZ3MucmVuZGVyLmNvdW50TGFiZWxNaW5Db3VudClcbiAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgIC5zZXREaXNhYmxlZCghc2V0dGluZ3MucmVuZGVyLnNob3dDb3VudEluV29yZFRleHQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlUmVuZGVyQW5kUHJldmlldyh7IGNvdW50TGFiZWxNaW5Db3VudDogdmFsdWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKGNvdW50TGFiZWxNaW5pbXVtLCAnQXZvaWRzIHZpc3VhbCBub2lzZSBieSBoaWRpbmcgY291bnRzIGZvciB2ZXJ5IHNtYWxsIHZhbHVlcy4nKTtcblxuICAgIGNvbnN0IHNpemVTY2FsaW5nTW9kZSA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1NpemUgc2NhbGluZyBtb2RlJylcbiAgICAgIC5zZXREZXNjKCdIb3cgbnVtZXJpYyBjb3VudCBkaWZmZXJlbmNlcyBtYXAgdG8gZm9udC1zaXplIGRpZmZlcmVuY2VzLicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbignbGluZWFyJywgJ0xpbmVhcicpXG4gICAgICAgICAgLmFkZE9wdGlvbigncG93ZXInLCAnUG93ZXInKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ2xvZycsICdMb2cnKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ3JhbmsnLCAnUmFuaycpXG4gICAgICAgICAgLnNldFZhbHVlKHNldHRpbmdzLnJlbmRlci5zY2FsaW5nTW9kZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgc2NhbGluZ01vZGU6IHZhbHVlIGFzIFNjYWxpbmdNb2RlIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHNpemVTY2FsaW5nTW9kZSwgJ0xpbmVhciBpcyBwcm9wb3J0aW9uYWwuIFBvd2VyIGV4YWdnZXJhdGVzIGdhcHMuIExvZyBjb21wcmVzc2VzIGV4dHJlbWVzLiBSYW5rIGlnbm9yZXMgYWJzb2x1dGUgZ2Fwcy4nKTtcblxuICAgIGNvbnN0IGVtcGhhc2lzID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnRW1waGFzaXMnKVxuICAgICAgLnNldERlc2MoJ0hpZ2hlciB2YWx1ZXMgZXhhZ2dlcmF0ZSBzaXplIGRpZmZlcmVuY2VzIChwb3dlciBzY2FsaW5nIG1vZGUpLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cygwLjUsIDMsIDAuMSlcbiAgICAgICAgICAuc2V0VmFsdWUoc2V0dGluZ3MucmVuZGVyLmVtcGhhc2lzKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLnNldERpc2FibGVkKHNldHRpbmdzLnJlbmRlci5zY2FsaW5nTW9kZSAhPT0gJ3Bvd2VyJylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgZW1waGFzaXM6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihlbXBoYXNpcywgJ09ubHkgdXNlZCBpbiBQb3dlciBzY2FsaW5nIG1vZGUuIDEuMCBpcyBiYXNlbGluZTsgaGlnaGVyIGV4YWdnZXJhdGVzIGRpZmZlcmVuY2VzIG1vcmUuJyk7XG5cbiAgICBjb25zdCBkZXRlcm1pbmlzdGljTGF5b3V0ID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnRGV0ZXJtaW5pc3RpYyBsYXlvdXQnKVxuICAgICAgLnNldERlc2MoJ0tlZXAgY2xvdWQgbGF5b3V0IHN0YWJsZSBhY3Jvc3MgcmVmcmVzaGVzIHVzaW5nIGEgc2VlZC4nKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZVxuICAgICAgICAgIC5zZXRWYWx1ZShzZXR0aW5ncy5yZW5kZXIuZGV0ZXJtaW5pc3RpY0xheW91dClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVSZW5kZXJBbmRQcmV2aWV3KHsgZGV0ZXJtaW5pc3RpY0xheW91dDogdmFsdWUgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24oZGV0ZXJtaW5pc3RpY0xheW91dCwgJ1VzZWZ1bCBmb3IgY29tcGFyaW5nIGJlZm9yZS9hZnRlciBjaGFuZ2VzIHdpdGggc3RhYmxlIHBvc2l0aW9ucy4nKTtcblxuICAgIGNvbnN0IHJhbmRvbVNlZWQgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdSYW5kb20gc2VlZCcpXG4gICAgICAuc2V0RGVzYygnU2VlZCB1c2VkIHdoZW4gZGV0ZXJtaW5pc3RpYyBsYXlvdXQgaXMgZW5hYmxlZC4nKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRWYWx1ZShTdHJpbmcoc2V0dGluZ3MucmVuZGVyLnJhbmRvbVNlZWQpKVxuICAgICAgICAgIC5zZXREaXNhYmxlZCghc2V0dGluZ3MucmVuZGVyLmRldGVybWluaXN0aWNMYXlvdXQpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XG4gICAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVJlbmRlckFuZFByZXZpZXcoeyByYW5kb21TZWVkOiBwYXJzZWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHJhbmRvbVNlZWQsICdDaGFuZ2luZyBzZWVkIGdpdmVzIGEgZGlmZmVyZW50IHN0YWJsZSBhcnJhbmdlbWVudC4nKTtcblxuICAgIGNvbnN0IHJlc2V0UmVuZGVyaW5nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnUmVzZXQgcmVuZGVyaW5nIHNldHRpbmdzJylcbiAgICAgIC5zZXREZXNjKCdSZXN0b3JlIGRlZmF1bHQgcmVuZGVyZXIgY29udHJvbHMuJylcbiAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b25cbiAgICAgICAgICAuc2V0QnV0dG9uVGV4dCgnUmVzZXQgcmVuZGVyaW5nJylcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNlcnZpY2VzLnJlc2V0UmVuZGVyU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihyZXNldFJlbmRlcmluZywgJ1Jlc2V0cyByZW5kZXJpbmcgb3B0aW9ucyBvbmx5LicpO1xuXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gzJywgeyB0ZXh0OiAnUGVyZm9ybWFuY2UnIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdwJywge1xuICAgICAgdGV4dDogJ1R1bmUgc3BlZWQgdnMgVUkgc21vb3RobmVzcyBhbmQgcHJvZ3Jlc3MgdXBkYXRlIGRldGFpbCBmb3IgbGFyZ2UgY2xvdWRzLicsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9ncmVzc0RldGFpbCA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1Byb2dyZXNzIGRldGFpbCcpXG4gICAgICAuc2V0RGVzYygnSG93IGZyZXF1ZW50bHkgcHJvZ3Jlc3MgaXMgdXBkYXRlZCB3aGlsZSBzY2FubmluZyBhbmQgbGF5b3V0LicpXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbigndW5oaW5nZWQnLCAnVW5oaW5nZWQgKG1heCBzcGVlZCknKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ21pbmltYWwnLCAnTWluaW1hbCAoZmFzdGVzdCknKVxuICAgICAgICAgIC5hZGRPcHRpb24oJ2JhbGFuY2VkJywgJ0JhbGFuY2VkJylcbiAgICAgICAgICAuYWRkT3B0aW9uKCdkZXRhaWxlZCcsICdEZXRhaWxlZCcpXG4gICAgICAgICAgLnNldFZhbHVlKHNldHRpbmdzLnJlbmRlci5wcm9ncmVzc0RldGFpbClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNlcnZpY2VzLnVwZGF0ZVJlbmRlclNldHRpbmdzKHsgcHJvZ3Jlc3NEZXRhaWw6IHZhbHVlIGFzIFByb2dyZXNzRGV0YWlsIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihwcm9ncmVzc0RldGFpbCwgJ1VuaGluZ2VkIG1heGltaXplcyBzcGVlZCBhbmQgbWF5IGxvY2sgVUkgdGVtcG9yYXJpbHkuIERldGFpbGVkIGlzIG1vc3QgaW5mb3JtYXRpdmUgYnV0IHNsb3dlci4nKTtcblxuICAgIGNvbnN0IHNjYW5CYXRjaFNpemUgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdTY2FuIGJhdGNoIHNpemUnKVxuICAgICAgLnNldERlc2MoJ0hvdyBtYW55IGZpbGVzIGFyZSByZWFkIGluIHBhcmFsbGVsIGR1cmluZyB2YXVsdCBzY2FubmluZy4nKVxuICAgICAgLmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG4gICAgICAgIHNsaWRlclxuICAgICAgICAgIC5zZXRMaW1pdHMoOCwgNjQsIDEpXG4gICAgICAgICAgLnNldFZhbHVlKHNldHRpbmdzLnJlbmRlci5zY2FuQmF0Y2hTaXplKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXJ2aWNlcy51cGRhdGVSZW5kZXJTZXR0aW5ncyh7IHNjYW5CYXRjaFNpemU6IHZhbHVlIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgdGhpcy5hdHRhY2hJbmZvSWNvbihzY2FuQmF0Y2hTaXplLCAnSGlnaGVyIGNhbiBiZSBmYXN0ZXIgb24gc3Ryb25nIGRldmljZXMgYnV0IHVzZXMgbW9yZSBtZW1vcnkvSU8uJyk7XG5cbiAgICBjb25zdCBsYXlvdXRUaW1lU2xpY2UgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdMYXlvdXQgdGltZSBzbGljZSAobXMpJylcbiAgICAgIC5zZXREZXNjKCdUaW1lIHBlciBsYXlvdXQgY2h1bmsuIExvd2VyIGlzIHNtb290aGVyOyBoaWdoZXIgaXMgZmFzdGVyLicpXG4gICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+IHtcbiAgICAgICAgc2xpZGVyXG4gICAgICAgICAgLnNldExpbWl0cyg4LCA0MCwgMSlcbiAgICAgICAgICAuc2V0VmFsdWUoc2V0dGluZ3MucmVuZGVyLmxheW91dFRpbWVJbnRlcnZhbE1zKVxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXJ2aWNlcy51cGRhdGVSZW5kZXJTZXR0aW5ncyh7IGxheW91dFRpbWVJbnRlcnZhbE1zOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIHRoaXMuYXR0YWNoSW5mb0ljb24obGF5b3V0VGltZVNsaWNlLCAnQ29udHJvbHMgcmVzcG9uc2l2ZW5lc3Mgd2hpbGUgbGF5aW5nIG91dCB3b3Jkcy4nKTtcblxuICAgIGNvbnN0IHJlc2V0UGVyZm9ybWFuY2UgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdSZXNldCBwZXJmb3JtYW5jZSBzZXR0aW5ncycpXG4gICAgICAuc2V0RGVzYygnUmVzdG9yZSBkZWZhdWx0IHBlcmZvcm1hbmNlIHR1bmluZyB2YWx1ZXMuJylcbiAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b25cbiAgICAgICAgICAuc2V0QnV0dG9uVGV4dCgnUmVzZXQgcGVyZm9ybWFuY2UnKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VydmljZXMudXBkYXRlUmVuZGVyU2V0dGluZ3Moe1xuICAgICAgICAgICAgICBwcm9ncmVzc0RldGFpbDogREVGQVVMVF9TRVRUSU5HUy5yZW5kZXIucHJvZ3Jlc3NEZXRhaWwsXG4gICAgICAgICAgICAgIHNjYW5CYXRjaFNpemU6IERFRkFVTFRfU0VUVElOR1MucmVuZGVyLnNjYW5CYXRjaFNpemUsXG4gICAgICAgICAgICAgIGxheW91dFRpbWVJbnRlcnZhbE1zOiBERUZBVUxUX1NFVFRJTkdTLnJlbmRlci5sYXlvdXRUaW1lSW50ZXJ2YWxNcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB0aGlzLmF0dGFjaEluZm9JY29uKHJlc2V0UGVyZm9ybWFuY2UsICdSZXNldHMgcGVyZm9ybWFuY2UgdHVuaW5nIG9ubHkuJyk7XG5cbiAgICB2b2lkIHJlcmVuZGVyUHJldmlldygpO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hJbmZvSWNvbihzZXR0aW5nOiBTZXR0aW5nLCBpbmZvVGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgaWNvbiA9IHNldHRpbmcubmFtZUVsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICBjbHM6ICd3b3JkLWNsb3VkLXNldHRpbmctaW5mbycsXG4gICAgICB0ZXh0OiAnaScsXG4gICAgfSk7XG4gICAgaWNvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgaWNvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1Nob3cgc2V0dGluZyBkZXRhaWxzJyk7XG4gICAgaWNvbi5zZXRBdHRyKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nLCAndG9wJyk7XG4gICAgaWNvbi5zZXRBdHRyKCdkYXRhLXRvb2x0aXAnLCBpbmZvVGV4dCk7XG5cbiAgICBjb25zdCBwb3BvdmVyID0gc2V0dGluZy5zZXR0aW5nRWwuY3JlYXRlRGl2KHsgY2xzOiAnd29yZC1jbG91ZC1zZXR0aW5nLWluZm8tcG9wb3ZlcicgfSk7XG4gICAgcG9wb3Zlci5zZXRUZXh0KGluZm9UZXh0KTtcbiAgICBwb3BvdmVyLnNldEF0dHIoJ2hpZGRlbicsICd0cnVlJyk7XG5cbiAgICBpY29uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGlmIChwb3BvdmVyLmhhc0F0dHJpYnV0ZSgnaGlkZGVuJykpIHtcbiAgICAgICAgcG9wb3Zlci5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9wb3Zlci5zZXRBdHRyKCdoaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWNvbi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICBwb3BvdmVyLnNldEF0dHIoJ2hpZGRlbicsICd0cnVlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkUHJldmlld1dvcmRzKHJlbmRlclNldHRpbmdzOiBSZW5kZXJTZXR0aW5ncyk6IFdlaWdodGVkV29yZFtdIHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFtcbiAgICAgIHsgdGV4dDogJ29ic2lkaWFuJywgY291bnQ6IDQ4IH0sXG4gICAgICB7IHRleHQ6ICdub3RlcycsIGNvdW50OiA0MyB9LFxuICAgICAgeyB0ZXh0OiAncGx1Z2lucycsIGNvdW50OiAzNiB9LFxuICAgICAgeyB0ZXh0OiAndmF1bHQnLCBjb3VudDogMzMgfSxcbiAgICAgIHsgdGV4dDogJ3Jlc2VhcmNoJywgY291bnQ6IDI4IH0sXG4gICAgICB7IHRleHQ6ICdpZGVhcycsIGNvdW50OiAyNSB9LFxuICAgICAgeyB0ZXh0OiAnd3JpdGluZycsIGNvdW50OiAyMiB9LFxuICAgICAgeyB0ZXh0OiAnZGFpbHknLCBjb3VudDogMjAgfSxcbiAgICAgIHsgdGV4dDogJ3Byb2plY3QnLCBjb3VudDogMTggfSxcbiAgICAgIHsgdGV4dDogJ3JldmlldycsIGNvdW50OiAxNiB9LFxuICAgICAgeyB0ZXh0OiAnZGVzaWduJywgY291bnQ6IDE0IH0sXG4gICAgICB7IHRleHQ6ICdtZWV0aW5nJywgY291bnQ6IDEyIH0sXG4gICAgICB7IHRleHQ6ICd0YXNrcycsIGNvdW50OiAxMSB9LFxuICAgICAgeyB0ZXh0OiAnam91cm5hbCcsIGNvdW50OiAxMCB9LFxuICAgICAgeyB0ZXh0OiAnZHJhZnQnLCBjb3VudDogOSB9LFxuICAgICAgeyB0ZXh0OiAncmVhZGluZycsIGNvdW50OiA4IH0sXG4gICAgICB7IHRleHQ6ICdwbGFuJywgY291bnQ6IDcgfSxcbiAgICAgIHsgdGV4dDogJ2ZvY3VzJywgY291bnQ6IDYgfSxcbiAgICAgIHsgdGV4dDogJ2hhYml0JywgY291bnQ6IDUgfSxcbiAgICAgIHsgdGV4dDogJ2dvYWxzJywgY291bnQ6IDQgfSxcbiAgICBdO1xuXG4gICAgcmV0dXJuIG1hcENvdW50c1RvV2VpZ2h0ZWRXb3Jkcyh0ZW1wbGF0ZS5tYXAoKGVudHJ5KSA9PiBbZW50cnkudGV4dCwgZW50cnkuY291bnRdIGFzIFtzdHJpbmcsIG51bWJlcl0pLCByZW5kZXJTZXR0aW5ncyk7XG4gIH1cbn1cbiIsICJpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgRGVwcyB9IGZyb20gJy4uL2RlcHMnO1xuaW1wb3J0IHsgVmF1bHRXb3JkQ2xvdWRTZXR0aW5nVGFiIH0gZnJvbSAnLi90YWInO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJTZXR0aW5ncyhwbHVnaW46IFBsdWdpbiwgZGVwczogRGVwcyk6IHZvaWQge1xuICBwbHVnaW4uYWRkU2V0dGluZ1RhYihuZXcgVmF1bHRXb3JkQ2xvdWRTZXR0aW5nVGFiKHBsdWdpbiwgZGVwcy5zZXJ2aWNlcy53b3JkQ2xvdWQpKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IGFjdGl2YXRlVmF1bHRXb3JkQ2xvdWRWaWV3IH0gZnJvbSAnLi4vdmlld3MvYWN0aXZhdGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJVSShwbHVnaW46IFBsdWdpbik6IHZvaWQge1xuICBwbHVnaW4uYWRkUmliYm9uSWNvbignY2xvdWQnLCAnT3BlbiB3b3JkIGNsb3VkcycsICgpID0+IHtcbiAgICB2b2lkIGFjdGl2YXRlVmF1bHRXb3JkQ2xvdWRWaWV3KHBsdWdpbi5hcHApO1xuICB9KTtcbn1cbiIsICJpbXBvcnQgeyBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LCBNYXJrZG93blZpZXcsIE5vdGljZSwgUGx1Z2luLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB0eXBlIHsgVGFnTWF0Y2hNb2RlLCBXb3JkQ2xvdWRTZXJ2aWNlcyB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCB7IEVtYmVkV29yZENsb3VkTW9kYWwgfSBmcm9tICcuLi8uLi9tb2RhbHMvZWRpdC13b3JkLWNsb3VkLW1vZGFsJztcbmltcG9ydCB0eXBlIHsgRnJvbnRtYXR0ZXJPcGVyYXRvciwgRnJvbnRtYXR0ZXJSdWxlLCBTb3VyY2VTY29wZSB9IGZyb20gJy4uLy4uL3dvcmRjbG91ZC9waXBlbGluZS90eXBlcyc7XG5pbXBvcnQgeyBub3JtYWxpemVUYWcgfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbnR5cGUgRW1iZWRkZWRXb3JkQ2xvdWRTY29wZSA9ICdmaWxlJyB8ICd2YXVsdCcgfCAnZm9sZGVyJztcbnR5cGUgRW1iZWRkZWRXb3JkQ2xvdWRTaXplID0gJ3NtYWxsJyB8ICdtZWRpdW0nIHwgJ2xhcmdlJztcblxudHlwZSBFbWJlZGRlZFdvcmRDbG91ZE9wdGlvbnMgPSB7XG4gIGNsb3VkSWQ6IHN0cmluZztcbiAgc2NvcGU6IEVtYmVkZGVkV29yZENsb3VkU2NvcGU7XG4gIHNpemU6IEVtYmVkZGVkV29yZENsb3VkU2l6ZTtcbiAgaW5jbHVkZVRhZ3M6IHN0cmluZ1tdO1xuICBleGNsdWRlVGFnczogc3RyaW5nW107XG4gIHRhZ01hdGNoTW9kZTogVGFnTWF0Y2hNb2RlO1xuICBmb2xkZXJQYXRoczogc3RyaW5nW107XG4gIGZyb250bWF0dGVyUnVsZXM6IEZyb250bWF0dGVyUnVsZVtdO1xuICBtaW5Db3VudDogbnVtYmVyO1xuICBtYXhDb3VudDogbnVtYmVyO1xuICBleGNsdWRlV29yZHM6IHN0cmluZ1tdO1xuICBpbnRlcmFjdGlvbnM6IGJvb2xlYW47XG4gIHNwZWNpZmljRmlsZVBhdGg/OiBzdHJpbmc7XG59O1xuXG50eXBlIEVtYmVkZGVkUmVuZGVyU3RhdGUgPSB7XG4gIG9ic2VydmVyOiBSZXNpemVPYnNlcnZlcjtcbiAgcmVyZW5kZXJUaW1lcjogbnVtYmVyIHwgbnVsbDtcbiAgbGFzdFdpZHRoOiBudW1iZXI7XG4gIGxhc3RIZWlnaHQ6IG51bWJlcjtcbn07XG5cbnR5cGUgRW1iZWRkZWRDbG91ZEluc3RhbmNlID0ge1xuICBzb3VyY2VQYXRoOiBzdHJpbmc7XG4gIHJlcmVuZGVyOiAoKSA9PiB2b2lkO1xufTtcblxuY29uc3QgREVGQVVMVF9PUFRJT05TOiBFbWJlZGRlZFdvcmRDbG91ZE9wdGlvbnMgPSB7XG4gIGNsb3VkSWQ6ICcnLFxuICBzY29wZTogJ2ZpbGUnLFxuICBzaXplOiAnbWVkaXVtJyxcbiAgaW5jbHVkZVRhZ3M6IFtdLFxuICBleGNsdWRlVGFnczogW10sXG4gIHRhZ01hdGNoTW9kZTogJ2FueScsXG4gIGZvbGRlclBhdGhzOiBbXSxcbiAgZnJvbnRtYXR0ZXJSdWxlczogW10sXG4gIG1pbkNvdW50OiAxLFxuICBtYXhDb3VudDogOTk5OSxcbiAgZXhjbHVkZVdvcmRzOiBbXSxcbiAgaW50ZXJhY3Rpb25zOiB0cnVlLFxufTtcblxuY29uc3QgRlJPTlRNQVRURVJfT1BFUkFUT1JTID0gbmV3IFNldDxGcm9udG1hdHRlck9wZXJhdG9yPihbXG4gICdlcXVhbHMnLFxuICAnbm90LWVxdWFscycsXG4gICdjb250YWlucycsXG4gICdndCcsXG4gICdndGUnLFxuICAnbHQnLFxuICAnbHRlJyxcbiAgJ2V4aXN0cycsXG4gICdub3QtZXhpc3RzJyxcbl0pO1xuXG5jb25zdCBFTUJFRF9SRVNJWkVfREVCT1VOQ0VfTVMgPSAxNDA7XG5jb25zdCBFTUJFRF9DT05URU5UX0NIQU5HRV9ERUJPVU5DRV9NUyA9IDUwMDA7XG5jb25zdCBFTUJFRF9TSVpFX0hFSUdIVDogUmVjb3JkPEVtYmVkZGVkV29yZENsb3VkU2l6ZSwgbnVtYmVyPiA9IHtcbiAgc21hbGw6IDI0MCxcbiAgbWVkaXVtOiAzMjAsXG4gIGxhcmdlOiA0NDAsXG59O1xuY29uc3QgZW1iZWRkZWRSZW5kZXJTdGF0ZXMgPSBuZXcgV2Vha01hcDxIVE1MRWxlbWVudCwgRW1iZWRkZWRSZW5kZXJTdGF0ZT4oKTtcbmNvbnN0IGVtYmVkZGVkQ2xvdWRJbnN0YW5jZXMgPSBuZXcgV2Vha01hcDxIVE1MRWxlbWVudCwgRW1iZWRkZWRDbG91ZEluc3RhbmNlPigpO1xuY29uc3QgZW1iZWRkZWRDbG91ZHNCeVNvdXJjZVBhdGggPSBuZXcgTWFwPHN0cmluZywgU2V0PEhUTUxFbGVtZW50Pj4oKTtcbmNvbnN0IHNvdXJjZVBhdGhSZWZyZXNoVGltZXJzID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRW1iZWRkZWRXb3JkQ2xvdWRQcm9jZXNzb3IoXG4gIHBsdWdpbjogUGx1Z2luLFxuICBzZXJ2aWNlczogV29yZENsb3VkU2VydmljZXMsXG4pOiB2b2lkIHtcbiAgY29uc3QgcmVuZGVyID0gYXN5bmMgKHNvdXJjZTogc3RyaW5nLCBlbDogSFRNTEVsZW1lbnQsIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNsZWFudXBFbWJlZGRlZFJlbmRlclN0YXRlKGVsKTtcbiAgICByZWdpc3RlckVtYmVkZGVkQ2xvdWRJbnN0YW5jZShlbCwgY3R4LnNvdXJjZVBhdGgsICgpID0+IHtcbiAgICAgIHZvaWQgcmVuZGVyKHNvdXJjZSwgZWwsIGN0eCk7XG4gICAgfSk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHBhcnNlT3B0aW9ucyhzb3VyY2UpO1xuXG4gICAgZWwuZW1wdHkoKTtcbiAgICBjb25zdCB3cmFwcGVyRWwgPSBlbC5jcmVhdGVEaXYoeyBjbHM6ICd3b3JkLWNsb3VkLWVtYmVkJyB9KTtcbiAgICBjb25zdCBzdGF0ZUVsID0gd3JhcHBlckVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtc3RhdGUnLCB0ZXh0OiAnQnVpbGRpbmcgY2xvdWQuLi4nIH0pO1xuICAgIGNvbnN0IGNhbnZhc0VsID0gd3JhcHBlckVsLmNyZWF0ZURpdih7IGNsczogJ3dvcmQtY2xvdWQtZW1iZWQtY2FudmFzJyB9KTtcbiAgICBjYW52YXNFbC5zdHlsZS5oZWlnaHQgPSBgJHtFTUJFRF9TSVpFX0hFSUdIVFtvcHRpb25zLnNpemVdfXB4YDtcblxuICAgIGNvbnN0IHVwZGF0ZVByb2dyZXNzID0gKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgICBzdGF0ZUVsLnNldFRleHQoYCR7bWVzc2FnZX0gKCR7cGVyY2VudH0lKWApO1xuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgc291cmNlU2NvcGUgPSByZXNvbHZlU291cmNlU2NvcGUocGx1Z2luLCBjdHgsIG9wdGlvbnMpO1xuICAgICAgaWYgKG9wdGlvbnMuc2NvcGUgPT09ICdmaWxlJyAmJiAhc291cmNlU2NvcGUuYWN0aXZlRmlsZVBhdGgpIHtcbiAgICAgICAgc3RhdGVFbC5zZXRUZXh0KCdDb3VsZCBub3QgcmVzb2x2ZSB0aGUgZmlsZSBmb3IgdGhpcyBlbWJlZGRlZCBjbG91ZC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuc2NvcGUgPT09ICdmb2xkZXInICYmIHNvdXJjZVNjb3BlLmZvbGRlclBhdGhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBzdGF0ZUVsLnNldFRleHQoJ0FkZCBhdCBsZWFzdCBvbmUgZm9sZGVyIHBhdGggZm9yIGZvbGRlciBzY29wZS4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB3b3JkcyA9IGF3YWl0IHNlcnZpY2VzLmNvbGxlY3RWYXVsdFdvcmRzKHtcbiAgICAgICAgc291cmNlUnVsZXM6IHtcbiAgICAgICAgICBzY29wZTogc291cmNlU2NvcGUsXG4gICAgICAgICAgaW5jbHVkZVRhZ3M6IG9wdGlvbnMuaW5jbHVkZVRhZ3MsXG4gICAgICAgICAgZXhjbHVkZVRhZ3M6IG9wdGlvbnMuZXhjbHVkZVRhZ3MsXG4gICAgICAgICAgdGFnTWF0Y2hNb2RlOiBvcHRpb25zLnRhZ01hdGNoTW9kZSxcbiAgICAgICAgICBmcm9udG1hdHRlclJ1bGVzOiBvcHRpb25zLmZyb250bWF0dGVyUnVsZXMsXG4gICAgICAgIH0sXG4gICAgICAgIGZyZXF1ZW5jeToge1xuICAgICAgICAgIG1pbkNvdW50OiBvcHRpb25zLm1pbkNvdW50LFxuICAgICAgICAgIG1heENvdW50OiBvcHRpb25zLm1heENvdW50LFxuICAgICAgICB9LFxuICAgICAgICBleGNsdWRlV29yZHM6IG9wdGlvbnMuZXhjbHVkZVdvcmRzLFxuICAgICAgfSwgdXBkYXRlUHJvZ3Jlc3MpO1xuXG4gICAgICBsZXQgc2VhcmNoU2NvcGU6IHsgZmlsZVBhdGg/OiBzdHJpbmc7IGluY2x1ZGVUYWdzPzogc3RyaW5nW107IGV4Y2x1ZGVUYWdzPzogc3RyaW5nW107IHRhZ01hdGNoTW9kZT86IFRhZ01hdGNoTW9kZSB9ID0ge307XG4gICAgICBpZiAob3B0aW9ucy5zY29wZSA9PT0gJ2ZpbGUnICYmIHNvdXJjZVNjb3BlLmFjdGl2ZUZpbGVQYXRoKSB7XG4gICAgICAgIHNlYXJjaFNjb3BlID0geyBmaWxlUGF0aDogc291cmNlU2NvcGUuYWN0aXZlRmlsZVBhdGggfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlYXJjaFNjb3BlID0ge1xuICAgICAgICAgIGluY2x1ZGVUYWdzOiBvcHRpb25zLmluY2x1ZGVUYWdzLFxuICAgICAgICAgIGV4Y2x1ZGVUYWdzOiBvcHRpb25zLmV4Y2x1ZGVUYWdzLFxuICAgICAgICAgIHRhZ01hdGNoTW9kZTogb3B0aW9ucy50YWdNYXRjaE1vZGUsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmICh3b3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc3RhdGVFbC5zZXRUZXh0KCdObyB3b3JkcyBmb3VuZCBmb3IgdGhpcyBlbWJlZGRlZCBjbG91ZC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBzZXJ2aWNlcy5kcmF3V29yZENsb3VkKHtcbiAgICAgICAgY29udGFpbmVyRWw6IGNhbnZhc0VsLFxuICAgICAgICB3b3JkcyxcbiAgICAgICAgYXJpYUxhYmVsOiAnRW1iZWRkZWQgd29yZCBjbG91ZCcsXG4gICAgICAgIG9uUHJvZ3Jlc3M6IHVwZGF0ZVByb2dyZXNzLFxuICAgICAgICBvblJlZnJlc2g6ICgpID0+IHJlbmRlcihzb3VyY2UsIGVsLCBjdHgpLFxuICAgICAgICBvbkV4Y2x1ZGVJbkNsb3VkOiBhc3luYyAod29yZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNoYW5nZWQgPSBhd2FpdCB1cGRhdGVFbWJlZGRlZENsb3VkRXhjbHVkZWRXb3JkcyhwbHVnaW4sIGN0eCwgZWwsIHNvdXJjZSwgd29yZCk7XG4gICAgICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoYEV4Y2x1ZGVkIFwiJHt3b3JkfVwiIGluIHRoaXMgY2xvdWQuYCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoYFwiJHt3b3JkfVwiIGlzIGFscmVhZHkgZXhjbHVkZWQgaW4gdGhpcyBjbG91ZC5gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uRXhjbHVkZUluVmF1bHQ6IGFzeW5jICh3b3JkKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWRkZWQgPSBhd2FpdCBzZXJ2aWNlcy5hZGRCbGFja2xpc3RXb3JkKHdvcmQpO1xuICAgICAgICAgIG5ldyBOb3RpY2UoYWRkZWQgPyBgRXhjbHVkZWQgXCIke3dvcmR9XCIgZnJvbSB3b3JkIGNsb3Vkcy5gIDogYFwiJHt3b3JkfVwiIGlzIGFscmVhZHkgZXhjbHVkZWQuYCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRWRpdDogKCkgPT4ge1xuICAgICAgICAgIG9wZW5FbWJlZGRlZFdvcmRDbG91ZEVkaXRXaXphcmQocGx1Z2luLCBzZXJ2aWNlcywgY3R4LCBlbCwgb3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIGVuYWJsZU92ZXJsYXlDb250cm9sczogdHJ1ZSxcbiAgICAgICAgZW5hYmxlVmlld3BvcnRJbnRlcmFjdGlvbjogb3B0aW9ucy5pbnRlcmFjdGlvbnMsXG4gICAgICAgIHNob3dSZWZyZXNoQ29udHJvbDogdHJ1ZSxcbiAgICAgICAgc2hvd1pvb21Db250cm9sczogb3B0aW9ucy5pbnRlcmFjdGlvbnMsXG4gICAgICAgIHNob3dFZGl0Q29udHJvbDogdHJ1ZSxcbiAgICAgICAgb25Xb3JkQ2xpY2s6ICh3b3JkKSA9PiB7XG4gICAgICAgICAgdm9pZCBzZXJ2aWNlcy5vcGVuU2VhcmNoRm9yV29yZCh3b3JkLCBzZWFyY2hTY29wZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgc3RhdGVFbC5yZW1vdmUoKTtcbiAgICAgIHJlZ2lzdGVyRW1iZWRkZWRSZXNpemVPYnNlcnZlcihlbCwgY2FudmFzRWwsICgpID0+IHJlbmRlcihzb3VyY2UsIGVsLCBjdHgpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignV29yZCBjbG91ZHM6IGZhaWxlZCB0byByZW5kZXIgZW1iZWRkZWQgY2xvdWQnLCBlcnJvcik7XG4gICAgICBzdGF0ZUVsLnNldFRleHQoJ0NvdWxkIG5vdCByZW5kZXIgZW1iZWRkZWQgd29yZCBjbG91ZC4nKTtcbiAgICB9XG4gIH07XG5cbiAgcGx1Z2luLnJlZ2lzdGVyTWFya2Rvd25Db2RlQmxvY2tQcm9jZXNzb3IoJ3dvcmRjbG91ZCcsIHJlbmRlcik7XG4gIHBsdWdpbi5yZWdpc3Rlck1hcmtkb3duQ29kZUJsb2NrUHJvY2Vzc29yKCd3b3JkLWNsb3VkJywgcmVuZGVyKTtcbiAgcGx1Z2luLnJlZ2lzdGVyRXZlbnQocGx1Z2luLmFwcC53b3Jrc3BhY2Uub24oJ2VkaXRvci1jaGFuZ2UnLCAoX2VkaXRvciwgdmlldykgPT4ge1xuICAgIGlmICghKHZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXcpIHx8ICF2aWV3LmZpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzY2hlZHVsZVNvdXJjZVBhdGhSZWZyZXNoKHZpZXcuZmlsZS5wYXRoKTtcbiAgfSkpO1xuICBwbHVnaW4ucmVnaXN0ZXIoKCkgPT4ge1xuICAgIGZvciAoY29uc3QgdGltZXJJZCBvZiBzb3VyY2VQYXRoUmVmcmVzaFRpbWVycy52YWx1ZXMoKSkge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgc291cmNlUGF0aFJlZnJlc2hUaW1lcnMuY2xlYXIoKTtcbiAgICBlbWJlZGRlZENsb3Vkc0J5U291cmNlUGF0aC5jbGVhcigpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUN1cnJlbnRGaWxlKHBsdWdpbjogUGx1Z2luLCBjdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQpOiBURmlsZSB8IG51bGwge1xuICBjb25zdCBmcm9tQ29udGV4dCA9IHBsdWdpbi5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGN0eC5zb3VyY2VQYXRoKTtcbiAgcmV0dXJuIGZyb21Db250ZXh0IGluc3RhbmNlb2YgVEZpbGUgPyBmcm9tQ29udGV4dCA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVTcGVjaWZpY0ZpbGUocGx1Z2luOiBQbHVnaW4sIGZpbGVQYXRoOiBzdHJpbmcpOiBURmlsZSB8IG51bGwge1xuICBjb25zdCBub3JtYWxpemVkUGF0aCA9IGZpbGVQYXRoLnRyaW0oKTtcbiAgaWYgKCFub3JtYWxpemVkUGF0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgcmVzb2x2ZWQgPSBwbHVnaW4uYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChub3JtYWxpemVkUGF0aCk7XG4gIHJldHVybiByZXNvbHZlZCBpbnN0YW5jZW9mIFRGaWxlID8gcmVzb2x2ZWQgOiBudWxsO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlU291cmNlU2NvcGUoXG4gIHBsdWdpbjogUGx1Z2luLFxuICBjdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsXG4gIG9wdGlvbnM6IEVtYmVkZGVkV29yZENsb3VkT3B0aW9ucyxcbik6IFNvdXJjZVNjb3BlIHtcbiAgaWYgKG9wdGlvbnMuc2NvcGUgPT09ICdmaWxlJykge1xuICAgIGNvbnN0IGZpbGUgPSBvcHRpb25zLnNwZWNpZmljRmlsZVBhdGhcbiAgICAgID8gcmVzb2x2ZVNwZWNpZmljRmlsZShwbHVnaW4sIG9wdGlvbnMuc3BlY2lmaWNGaWxlUGF0aClcbiAgICAgIDogcmVzb2x2ZUN1cnJlbnRGaWxlKHBsdWdpbiwgY3R4KTtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogJ2FjdGl2ZS1maWxlJyxcbiAgICAgIGFjdGl2ZUZpbGVQYXRoOiBmaWxlPy5wYXRoID8/ICcnLFxuICAgICAgZm9sZGVyUGF0aHM6IFtdLFxuICAgIH07XG4gIH1cblxuICBpZiAob3B0aW9ucy5zY29wZSA9PT0gJ2ZvbGRlcicpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogJ2ZvbGRlcicsXG4gICAgICBhY3RpdmVGaWxlUGF0aDogJycsXG4gICAgICBmb2xkZXJQYXRoczogWy4uLm9wdGlvbnMuZm9sZGVyUGF0aHNdLFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG1vZGU6ICd2YXVsdCcsXG4gICAgYWN0aXZlRmlsZVBhdGg6ICcnLFxuICAgIGZvbGRlclBhdGhzOiBbXSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2VPcHRpb25zKHNvdXJjZTogc3RyaW5nKTogRW1iZWRkZWRXb3JkQ2xvdWRPcHRpb25zIHtcbiAgY29uc3Qgb3B0aW9uczogRW1iZWRkZWRXb3JkQ2xvdWRPcHRpb25zID0geyAuLi5ERUZBVUxUX09QVElPTlMgfTtcbiAgbGV0IHNjb3BlV2FzRXhwbGljaXRseVNldCA9IGZhbHNlO1xuICBjb25zdCBsaW5lcyA9IHNvdXJjZS5zcGxpdCgnXFxuJyk7XG5cbiAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgY29uc3QgdHJpbW1lZCA9IGxpbmUudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCB8fCB0cmltbWVkLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSB0cmltbWVkLmluZGV4T2YoJzonKTtcbiAgICBpZiAoc2VwYXJhdG9ySW5kZXggPT09IC0xKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCByYXdLZXkgPSB0cmltbWVkLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCByYXdWYWx1ZSA9IHRyaW1tZWQuc2xpY2Uoc2VwYXJhdG9ySW5kZXggKyAxKS50cmltKCk7XG5cbiAgICBpZiAocmF3S2V5ID09PSAnc2NvcGUnKSB7XG4gICAgICBjb25zdCBwYXJzZWRTY29wZSA9IHBhcnNlU2NvcGVPcHRpb24ocmF3VmFsdWUpO1xuICAgICAgaWYgKHBhcnNlZFNjb3BlKSB7XG4gICAgICAgIG9wdGlvbnMuc2NvcGUgPSBwYXJzZWRTY29wZTtcbiAgICAgICAgc2NvcGVXYXNFeHBsaWNpdGx5U2V0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdpZCcgfHwgcmF3S2V5ID09PSAnY2xvdWQtaWQnIHx8IHJhd0tleSA9PT0gJ2Nsb3VkX2lkJyB8fCByYXdLZXkgPT09ICdndWlkJykge1xuICAgICAgb3B0aW9ucy5jbG91ZElkID0gcmF3VmFsdWUudHJpbSgpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ3NpemUnKSB7XG4gICAgICBjb25zdCBwYXJzZWRTaXplID0gcGFyc2VTaXplT3B0aW9uKHJhd1ZhbHVlKTtcbiAgICAgIGlmIChwYXJzZWRTaXplKSB7XG4gICAgICAgIG9wdGlvbnMuc2l6ZSA9IHBhcnNlZFNpemU7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAnbW9kZScpIHtcbiAgICAgIGNvbnN0IHBhcnNlZFNjb3BlID0gcGFyc2VMZWdhY3lNb2RlT3B0aW9uKHJhd1ZhbHVlKTtcbiAgICAgIGlmIChwYXJzZWRTY29wZSkge1xuICAgICAgICBvcHRpb25zLnNjb3BlID0gcGFyc2VkU2NvcGU7XG4gICAgICAgIHNjb3BlV2FzRXhwbGljaXRseVNldCA9IHRydWU7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAndGFncycgfHwgcmF3S2V5ID09PSAnaW5jbHVkZS10YWdzJyB8fCByYXdLZXkgPT09ICdpbmNsdWRlX3RhZ3MnKSB7XG4gICAgICBvcHRpb25zLmluY2x1ZGVUYWdzID0gcGFyc2VUYWdMaXN0KHJhd1ZhbHVlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdleGNsdWRlLXRhZ3MnIHx8IHJhd0tleSA9PT0gJ2V4Y2x1ZGVfdGFncycpIHtcbiAgICAgIG9wdGlvbnMuZXhjbHVkZVRhZ3MgPSBwYXJzZVRhZ0xpc3QocmF3VmFsdWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ21hdGNoJyB8fCByYXdLZXkgPT09ICd0YWctbWF0Y2gnIHx8IHJhd0tleSA9PT0gJ3RhZ19tYXRjaCcpIHtcbiAgICAgIG9wdGlvbnMudGFnTWF0Y2hNb2RlID0gcmF3VmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCkgPT09ICdhbGwnID8gJ2FsbCcgOiAnYW55JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdmb2xkZXItcGF0aHMnIHx8IHJhd0tleSA9PT0gJ2ZvbGRlcl9wYXRocycgfHwgcmF3S2V5ID09PSAnZm9sZGVycycpIHtcbiAgICAgIG9wdGlvbnMuZm9sZGVyUGF0aHMgPSBwYXJzZUxpc3QocmF3VmFsdWUpO1xuICAgICAgaWYgKCFzY29wZVdhc0V4cGxpY2l0bHlTZXQpIHtcbiAgICAgICAgb3B0aW9ucy5zY29wZSA9ICdmb2xkZXInO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHJhd0tleSA9PT0gJ2Zyb250bWF0dGVyLXJ1bGVzJyB8fCByYXdLZXkgPT09ICdmcm9udG1hdHRlcl9ydWxlcycpIHtcbiAgICAgIG9wdGlvbnMuZnJvbnRtYXR0ZXJSdWxlcyA9IHBhcnNlRnJvbnRtYXR0ZXJSdWxlcyhyYXdWYWx1ZSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAnbWluLWNvdW50JyB8fCByYXdLZXkgPT09ICdtaW5fY291bnQnKSB7XG4gICAgICBvcHRpb25zLm1pbkNvdW50ID0gcGFyc2VGcmVxdWVuY3lDb3VudChyYXdWYWx1ZSwgb3B0aW9ucy5taW5Db3VudCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAnbWF4LWNvdW50JyB8fCByYXdLZXkgPT09ICdtYXhfY291bnQnKSB7XG4gICAgICBvcHRpb25zLm1heENvdW50ID0gcGFyc2VGcmVxdWVuY3lDb3VudChyYXdWYWx1ZSwgb3B0aW9ucy5tYXhDb3VudCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICByYXdLZXkgPT09ICdleGNsdWRlJ1xuICAgICAgfHwgcmF3S2V5ID09PSAnZXhjbHVkZS13b3JkcydcbiAgICAgIHx8IHJhd0tleSA9PT0gJ2V4Y2x1ZGVfd29yZHMnXG4gICAgICB8fCByYXdLZXkgPT09ICdleGNsdWRlZC13b3JkcydcbiAgICApIHtcbiAgICAgIG9wdGlvbnMuZXhjbHVkZVdvcmRzID0gcmF3VmFsdWVcbiAgICAgICAgLnNwbGl0KCcsJylcbiAgICAgICAgLm1hcCgodmFsdWUpID0+IG5vcm1hbGl6ZVdvcmQodmFsdWUpKVxuICAgICAgICAuZmlsdGVyKCh2YWx1ZSwgaW5kZXgsIGFycikgPT4gdmFsdWUubGVuZ3RoID4gMCAmJiBhcnIuaW5kZXhPZih2YWx1ZSkgPT09IGluZGV4KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdoZWlnaHQnKSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBOdW1iZXIucGFyc2VJbnQocmF3VmFsdWUsIDEwKTtcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcbiAgICAgICAgb3B0aW9ucy5zaXplID0gc2l6ZUZyb21IZWlnaHQocGFyc2VkKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChyYXdLZXkgPT09ICdpbnRlcmFjdGlvbnMnIHx8IHJhd0tleSA9PT0gJ2ludGVyYWN0YWJsZScgfHwgcmF3S2V5ID09PSAnY29udHJvbHMnKSB7XG4gICAgICBvcHRpb25zLmludGVyYWN0aW9ucyA9IHBhcnNlQm9vbGVhbk9wdGlvbihyYXdWYWx1ZSwgdHJ1ZSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocmF3S2V5ID09PSAnZmlsZScgfHwgcmF3S2V5ID09PSAnbm90ZScgfHwgcmF3S2V5ID09PSAncGF0aCcgfHwgcmF3S2V5ID09PSAnZmlsZW5hbWUnKSB7XG4gICAgICBvcHRpb25zLnNwZWNpZmljRmlsZVBhdGggPSByYXdWYWx1ZTtcbiAgICAgIGlmICghc2NvcGVXYXNFeHBsaWNpdGx5U2V0KSB7XG4gICAgICAgIG9wdGlvbnMuc2NvcGUgPSAnZmlsZSc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3B0aW9ucy5leGNsdWRlVGFncyA9IG9wdGlvbnMuZXhjbHVkZVRhZ3MuZmlsdGVyKCh0YWcpID0+ICFvcHRpb25zLmluY2x1ZGVUYWdzLmluY2x1ZGVzKHRhZykpO1xuICBvcHRpb25zLm1pbkNvdW50ID0gTWF0aC5taW4ob3B0aW9ucy5taW5Db3VudCwgb3B0aW9ucy5tYXhDb3VudCk7XG4gIG9wdGlvbnMubWF4Q291bnQgPSBNYXRoLm1heChvcHRpb25zLm1pbkNvdW50LCBvcHRpb25zLm1heENvdW50KTtcblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gcGFyc2VTY29wZU9wdGlvbih2YWx1ZTogc3RyaW5nKTogRW1iZWRkZWRXb3JkQ2xvdWRTY29wZSB8IG51bGwge1xuICBjb25zdCBub3JtYWxpemVkID0gdmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvW1xcc19dKy9nLCAnLScpO1xuICBpZiAobm9ybWFsaXplZCA9PT0gJ3ZhdWx0Jykge1xuICAgIHJldHVybiAndmF1bHQnO1xuICB9XG5cbiAgaWYgKG5vcm1hbGl6ZWQgPT09ICdmb2xkZXInIHx8IG5vcm1hbGl6ZWQgPT09ICdmb2xkZXJzJykge1xuICAgIHJldHVybiAnZm9sZGVyJztcbiAgfVxuXG4gIGlmIChub3JtYWxpemVkID09PSAnZmlsZScgfHwgbm9ybWFsaXplZCA9PT0gJ25vdGUnIHx8IG5vcm1hbGl6ZWQgPT09ICdjdXJyZW50LW5vdGUnIHx8IG5vcm1hbGl6ZWQgPT09ICdjdXJyZW50LWZpbGUnKSB7XG4gICAgcmV0dXJuICdmaWxlJztcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBwYXJzZVNpemVPcHRpb24odmFsdWU6IHN0cmluZyk6IEVtYmVkZGVkV29yZENsb3VkU2l6ZSB8IG51bGwge1xuICBjb25zdCBub3JtYWxpemVkID0gdmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChub3JtYWxpemVkID09PSAnc21hbGwnIHx8IG5vcm1hbGl6ZWQgPT09ICdtZWRpdW0nIHx8IG5vcm1hbGl6ZWQgPT09ICdsYXJnZScpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplZDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VMZWdhY3lNb2RlT3B0aW9uKHZhbHVlOiBzdHJpbmcpOiBFbWJlZGRlZFdvcmRDbG91ZFNjb3BlIHwgbnVsbCB7XG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSB2YWx1ZS50cmltKCkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bXFxzX10rL2csICctJyk7XG5cbiAgaWYgKFxuICAgIG5vcm1hbGl6ZWQgPT09ICdjdXJyZW50LWZpbGUnXG4gICAgfHwgbm9ybWFsaXplZCA9PT0gJ2N1cnJlbnQnXG4gICAgfHwgbm9ybWFsaXplZCA9PT0gJ2N1cnJlbnQtbm90ZSdcbiAgICB8fCBub3JtYWxpemVkID09PSAnbm90ZSdcbiAgICB8fCBub3JtYWxpemVkID09PSAnc3BlY2lmaWMtZmlsZSdcbiAgICB8fCBub3JtYWxpemVkID09PSAnc3BlY2lmaWMnXG4gICAgfHwgbm9ybWFsaXplZCA9PT0gJ2ZpbGUnXG4gICAgfHwgbm9ybWFsaXplZCA9PT0gJ25vdGUtZmlsZSdcbiAgKSB7XG4gICAgcmV0dXJuICdmaWxlJztcbiAgfVxuXG4gIGlmIChcbiAgICBub3JtYWxpemVkID09PSAndGFnLWJhc2VkJ1xuICAgIHx8IG5vcm1hbGl6ZWQgPT09ICd0YWdzJ1xuICAgIHx8IG5vcm1hbGl6ZWQgPT09ICd0YWcnXG4gICAgfHwgbm9ybWFsaXplZCA9PT0gJ3ZhdWx0J1xuICApIHtcbiAgICByZXR1cm4gJ3ZhdWx0JztcbiAgfVxuXG4gIGlmIChub3JtYWxpemVkID09PSAnZm9sZGVyJyB8fCBub3JtYWxpemVkID09PSAnZm9sZGVycycpIHtcbiAgICByZXR1cm4gJ2ZvbGRlcic7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcGFyc2VUYWdMaXN0KHJhd1ZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHRhZ3MgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCB2YWx1ZSBvZiBwYXJzZUxpc3QocmF3VmFsdWUpKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVRhZyh2YWx1ZSk7XG4gICAgaWYgKG5vcm1hbGl6ZWQpIHtcbiAgICAgIHRhZ3MuYWRkKG5vcm1hbGl6ZWQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gWy4uLnRhZ3NdO1xufVxuXG5mdW5jdGlvbiBwYXJzZUxpc3QocmF3VmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgdmFsdWVzID0gcmF3VmFsdWVcbiAgICAuc3BsaXQoJywnKVxuICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS50cmltKCkpXG4gICAgLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApO1xuICByZXR1cm4gWy4uLm5ldyBTZXQodmFsdWVzKV07XG59XG5cbmZ1bmN0aW9uIHBhcnNlRnJlcXVlbmN5Q291bnQocmF3VmFsdWU6IHN0cmluZywgZmFsbGJhY2s6IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IHBhcnNlZCA9IE51bWJlci5wYXJzZUludChyYXdWYWx1ZS50cmltKCksIDEwKTtcbiAgaWYgKE51bWJlci5pc05hTihwYXJzZWQpKSB7XG4gICAgcmV0dXJuIGZhbGxiYWNrO1xuICB9XG4gIHJldHVybiBNYXRoLm1pbig5OTk5LCBNYXRoLm1heCgxLCBwYXJzZWQpKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VGcm9udG1hdHRlclJ1bGVzKHJhd1ZhbHVlOiBzdHJpbmcpOiBGcm9udG1hdHRlclJ1bGVbXSB7XG4gIGNvbnN0IHJ1bGVzOiBGcm9udG1hdHRlclJ1bGVbXSA9IFtdO1xuICBjb25zdCBlbnRyaWVzID0gcmF3VmFsdWVcbiAgICAuc3BsaXQoJzsnKVxuICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS50cmltKCkpXG4gICAgLmZpbHRlcigoZW50cnkpID0+IGVudHJ5Lmxlbmd0aCA+IDApO1xuXG4gIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgIGNvbnN0IHBhcnRzID0gZW50cnkuc3BsaXQoJ3wnKS5tYXAoKHBhcnQpID0+IHBhcnQudHJpbSgpKTtcbiAgICBjb25zdCBrZXkgPSBwYXJ0c1swXSA/PyAnJztcbiAgICBpZiAoIWtleSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlcmF0b3IgPSBGUk9OVE1BVFRFUl9PUEVSQVRPUlMuaGFzKHBhcnRzWzFdIGFzIEZyb250bWF0dGVyT3BlcmF0b3IpXG4gICAgICA/IHBhcnRzWzFdIGFzIEZyb250bWF0dGVyT3BlcmF0b3JcbiAgICAgIDogJ2VxdWFscyc7XG4gICAgY29uc3QgdmFsdWUgPSBwYXJ0cy5zbGljZSgyKS5qb2luKCd8JykudHJpbSgpO1xuXG4gICAgaWYgKG9wZXJhdG9yID09PSAnZXhpc3RzJyB8fCBvcGVyYXRvciA9PT0gJ25vdC1leGlzdHMnKSB7XG4gICAgICBydWxlcy5wdXNoKHsga2V5LCBvcGVyYXRvciB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcnVsZXMucHVzaCh7IGtleSwgb3BlcmF0b3IsIHZhbHVlIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBydWxlcztcbn1cblxuZnVuY3Rpb24gc2l6ZUZyb21IZWlnaHQoaGVpZ2h0OiBudW1iZXIpOiBFbWJlZGRlZFdvcmRDbG91ZFNpemUge1xuICBjb25zdCBub3JtYWxpemVkID0gTWF0aC5taW4oOTAwLCBNYXRoLm1heCgxODAsIGhlaWdodCkpO1xuICBpZiAobm9ybWFsaXplZCA8PSAyODApIHtcbiAgICByZXR1cm4gJ3NtYWxsJztcbiAgfVxuICBpZiAobm9ybWFsaXplZCA8PSAzODApIHtcbiAgICByZXR1cm4gJ21lZGl1bSc7XG4gIH1cbiAgcmV0dXJuICdsYXJnZSc7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQm9vbGVhbk9wdGlvbih2YWx1ZTogc3RyaW5nLCBmYWxsYmFjazogYm9vbGVhbik6IGJvb2xlYW4ge1xuICBjb25zdCBub3JtYWxpemVkID0gdmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChub3JtYWxpemVkID09PSAndHJ1ZScgfHwgbm9ybWFsaXplZCA9PT0gJ3llcycgfHwgbm9ybWFsaXplZCA9PT0gJ29uJyB8fCBub3JtYWxpemVkID09PSAnMScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobm9ybWFsaXplZCA9PT0gJ2ZhbHNlJyB8fCBub3JtYWxpemVkID09PSAnbm8nIHx8IG5vcm1hbGl6ZWQgPT09ICdvZmYnIHx8IG5vcm1hbGl6ZWQgPT09ICcwJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gZmFsbGJhY2s7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRW1iZWRkZWRSZXNpemVPYnNlcnZlcihcbiAgaG9zdEVsOiBIVE1MRWxlbWVudCxcbiAgY2FudmFzRWw6IEhUTUxEaXZFbGVtZW50LFxuICByZXJlbmRlcjogKCkgPT4gdm9pZCxcbik6IHZvaWQge1xuICBpZiAodHlwZW9mIFJlc2l6ZU9ic2VydmVyID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlOiBFbWJlZGRlZFJlbmRlclN0YXRlID0ge1xuICAgIG9ic2VydmVyOiBuZXcgUmVzaXplT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gZW50cmllc1swXTtcbiAgICAgIGlmICghZW50cnkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXh0V2lkdGggPSBNYXRoLnJvdW5kKGVudHJ5LmNvbnRlbnRSZWN0LndpZHRoKTtcbiAgICAgIGNvbnN0IG5leHRIZWlnaHQgPSBNYXRoLnJvdW5kKGVudHJ5LmNvbnRlbnRSZWN0LmhlaWdodCk7XG4gICAgICBpZiAobmV4dFdpZHRoIDw9IDAgfHwgbmV4dEhlaWdodCA8PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0V2lkdGggPT09IHN0YXRlLmxhc3RXaWR0aCAmJiBuZXh0SGVpZ2h0ID09PSBzdGF0ZS5sYXN0SGVpZ2h0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3RhdGUubGFzdFdpZHRoID0gbmV4dFdpZHRoO1xuICAgICAgc3RhdGUubGFzdEhlaWdodCA9IG5leHRIZWlnaHQ7XG5cbiAgICAgIGlmIChzdGF0ZS5yZXJlbmRlclRpbWVyICE9PSBudWxsKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoc3RhdGUucmVyZW5kZXJUaW1lcik7XG4gICAgICB9XG4gICAgICBzdGF0ZS5yZXJlbmRlclRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzdGF0ZS5yZXJlbmRlclRpbWVyID0gbnVsbDtcbiAgICAgICAgcmVyZW5kZXIoKTtcbiAgICAgIH0sIEVNQkVEX1JFU0laRV9ERUJPVU5DRV9NUyk7XG4gICAgfSksXG4gICAgcmVyZW5kZXJUaW1lcjogbnVsbCxcbiAgICBsYXN0V2lkdGg6IE1hdGgucm91bmQoY2FudmFzRWwuY2xpZW50V2lkdGgpLFxuICAgIGxhc3RIZWlnaHQ6IE1hdGgucm91bmQoY2FudmFzRWwuY2xpZW50SGVpZ2h0KSxcbiAgfTtcblxuICBzdGF0ZS5vYnNlcnZlci5vYnNlcnZlKGNhbnZhc0VsKTtcbiAgZW1iZWRkZWRSZW5kZXJTdGF0ZXMuc2V0KGhvc3RFbCwgc3RhdGUpO1xufVxuXG5mdW5jdGlvbiBjbGVhbnVwRW1iZWRkZWRSZW5kZXJTdGF0ZShob3N0RWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gIGNvbnN0IHN0YXRlID0gZW1iZWRkZWRSZW5kZXJTdGF0ZXMuZ2V0KGhvc3RFbCk7XG4gIGlmICghc3RhdGUpIHtcbiAgICBjbGVhbnVwRW1iZWRkZWRDbG91ZEluc3RhbmNlKGhvc3RFbCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGUub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICBpZiAoc3RhdGUucmVyZW5kZXJUaW1lciAhPT0gbnVsbCkge1xuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoc3RhdGUucmVyZW5kZXJUaW1lcik7XG4gIH1cbiAgZW1iZWRkZWRSZW5kZXJTdGF0ZXMuZGVsZXRlKGhvc3RFbCk7XG4gIGNsZWFudXBFbWJlZGRlZENsb3VkSW5zdGFuY2UoaG9zdEVsKTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJFbWJlZGRlZENsb3VkSW5zdGFuY2UoaG9zdEVsOiBIVE1MRWxlbWVudCwgc291cmNlUGF0aDogc3RyaW5nLCByZXJlbmRlcjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICBjbGVhbnVwRW1iZWRkZWRDbG91ZEluc3RhbmNlKGhvc3RFbCk7XG5cbiAgZW1iZWRkZWRDbG91ZEluc3RhbmNlcy5zZXQoaG9zdEVsLCB7IHNvdXJjZVBhdGgsIHJlcmVuZGVyIH0pO1xuICBsZXQgaG9zdHMgPSBlbWJlZGRlZENsb3Vkc0J5U291cmNlUGF0aC5nZXQoc291cmNlUGF0aCk7XG4gIGlmICghaG9zdHMpIHtcbiAgICBob3N0cyA9IG5ldyBTZXQ8SFRNTEVsZW1lbnQ+KCk7XG4gICAgZW1iZWRkZWRDbG91ZHNCeVNvdXJjZVBhdGguc2V0KHNvdXJjZVBhdGgsIGhvc3RzKTtcbiAgfVxuICBob3N0cy5hZGQoaG9zdEVsKTtcbn1cblxuZnVuY3Rpb24gY2xlYW51cEVtYmVkZGVkQ2xvdWRJbnN0YW5jZShob3N0RWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gIGNvbnN0IGluc3RhbmNlID0gZW1iZWRkZWRDbG91ZEluc3RhbmNlcy5nZXQoaG9zdEVsKTtcbiAgaWYgKCFpbnN0YW5jZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGhvc3RzID0gZW1iZWRkZWRDbG91ZHNCeVNvdXJjZVBhdGguZ2V0KGluc3RhbmNlLnNvdXJjZVBhdGgpO1xuICBpZiAoaG9zdHMpIHtcbiAgICBob3N0cy5kZWxldGUoaG9zdEVsKTtcbiAgICBpZiAoaG9zdHMuc2l6ZSA9PT0gMCkge1xuICAgICAgZW1iZWRkZWRDbG91ZHNCeVNvdXJjZVBhdGguZGVsZXRlKGluc3RhbmNlLnNvdXJjZVBhdGgpO1xuICAgIH1cbiAgfVxuICBlbWJlZGRlZENsb3VkSW5zdGFuY2VzLmRlbGV0ZShob3N0RWwpO1xufVxuXG5mdW5jdGlvbiBzY2hlZHVsZVNvdXJjZVBhdGhSZWZyZXNoKHNvdXJjZVBhdGg6IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCBleGlzdGluZ1RpbWVyID0gc291cmNlUGF0aFJlZnJlc2hUaW1lcnMuZ2V0KHNvdXJjZVBhdGgpO1xuICBpZiAoZXhpc3RpbmdUaW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgd2luZG93LmNsZWFyVGltZW91dChleGlzdGluZ1RpbWVyKTtcbiAgfVxuXG4gIGNvbnN0IHRpbWVySWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgc291cmNlUGF0aFJlZnJlc2hUaW1lcnMuZGVsZXRlKHNvdXJjZVBhdGgpO1xuICAgIHJlcmVuZGVyRW1iZWRkZWRDbG91ZHNGb3JTb3VyY2VQYXRoKHNvdXJjZVBhdGgpO1xuICB9LCBFTUJFRF9DT05URU5UX0NIQU5HRV9ERUJPVU5DRV9NUyk7XG4gIHNvdXJjZVBhdGhSZWZyZXNoVGltZXJzLnNldChzb3VyY2VQYXRoLCB0aW1lcklkKTtcbn1cblxuZnVuY3Rpb24gcmVyZW5kZXJFbWJlZGRlZENsb3Vkc0ZvclNvdXJjZVBhdGgoc291cmNlUGF0aDogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IGhvc3RzID0gZW1iZWRkZWRDbG91ZHNCeVNvdXJjZVBhdGguZ2V0KHNvdXJjZVBhdGgpO1xuICBpZiAoIWhvc3RzIHx8IGhvc3RzLnNpemUgPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IGhvc3RFbCBvZiBbLi4uaG9zdHNdKSB7XG4gICAgaWYgKCFob3N0RWwuaXNDb25uZWN0ZWQpIHtcbiAgICAgIGNsZWFudXBFbWJlZGRlZENsb3VkSW5zdGFuY2UoaG9zdEVsKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGluc3RhbmNlID0gZW1iZWRkZWRDbG91ZEluc3RhbmNlcy5nZXQoaG9zdEVsKTtcbiAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICBob3N0cy5kZWxldGUoaG9zdEVsKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGluc3RhbmNlLnJlcmVuZGVyKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gb3BlbkVtYmVkZGVkV29yZENsb3VkRWRpdFdpemFyZChcbiAgcGx1Z2luOiBQbHVnaW4sXG4gIHNlcnZpY2VzOiBXb3JkQ2xvdWRTZXJ2aWNlcyxcbiAgY3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LFxuICBob3N0RWw6IEhUTUxFbGVtZW50LFxuICBvcHRpb25zOiBFbWJlZGRlZFdvcmRDbG91ZE9wdGlvbnMsXG4pOiB2b2lkIHtcbiAgbmV3IEVtYmVkV29yZENsb3VkTW9kYWwoXG4gICAgcGx1Z2luLmFwcCxcbiAgICBzZXJ2aWNlcyxcbiAgICBhc3luYyAoZW1iZWRCbG9jaykgPT4gdXBkYXRlRW1iZWRkZWRDb2RlQmxvY2socGx1Z2luLCBjdHgsIGhvc3RFbCwgZW1iZWRCbG9jaywgb3B0aW9ucy5jbG91ZElkKSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0VkaXQgZW1iZWRkZWQgd29yZCBjbG91ZCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VwZGF0ZSBvcHRpb25zIGZvciB0aGlzIGVtYmVkZGVkIGNsb3VkIHdpdGhvdXQgZWRpdGluZyBtYXJrZG93biBtYW51YWxseS4nLFxuICAgICAgc3VibWl0QnV0dG9uVGV4dDogJ0FwcGx5JyxcbiAgICAgIGluaXRpYWxTdGF0ZToge1xuICAgICAgICBjbG91ZElkOiBvcHRpb25zLmNsb3VkSWQsXG4gICAgICAgIHNjb3BlOiBvcHRpb25zLnNjb3BlLFxuICAgICAgICBzaXplOiBvcHRpb25zLnNpemUsXG4gICAgICAgIHNwZWNpZmljRmlsZVBhdGg6IG9wdGlvbnMuc3BlY2lmaWNGaWxlUGF0aCA/PyAnJyxcbiAgICAgICAgaW5jbHVkZVRhZ3NSYXc6IG9wdGlvbnMuaW5jbHVkZVRhZ3Muam9pbignLCAnKSxcbiAgICAgICAgZXhjbHVkZVRhZ3NSYXc6IG9wdGlvbnMuZXhjbHVkZVRhZ3Muam9pbignLCAnKSxcbiAgICAgICAgdGFnTWF0Y2hNb2RlOiBvcHRpb25zLnRhZ01hdGNoTW9kZSxcbiAgICAgICAgZm9sZGVyUGF0aHNSYXc6IG9wdGlvbnMuZm9sZGVyUGF0aHMuam9pbignLCAnKSxcbiAgICAgICAgZnJvbnRtYXR0ZXJSdWxlc1Jhdzogb3B0aW9ucy5mcm9udG1hdHRlclJ1bGVzXG4gICAgICAgICAgLm1hcCgocnVsZSkgPT4gYCR7cnVsZS5rZXl9fCR7cnVsZS5vcGVyYXRvcn18JHtydWxlLnZhbHVlID8/ICcnfWApXG4gICAgICAgICAgLmpvaW4oJzsgJyksXG4gICAgICAgIG1pbkNvdW50UmF3OiBgJHtvcHRpb25zLm1pbkNvdW50fWAsXG4gICAgICAgIG1heENvdW50UmF3OiBgJHtvcHRpb25zLm1heENvdW50fWAsXG4gICAgICB9LFxuICAgIH0sXG4gICkub3BlbigpO1xufVxuXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVFbWJlZGRlZENvZGVCbG9jayhcbiAgcGx1Z2luOiBQbHVnaW4sXG4gIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCxcbiAgaG9zdEVsOiBIVE1MRWxlbWVudCxcbiAgZW1iZWRCbG9jazogc3RyaW5nLFxuICBjbG91ZElkPzogc3RyaW5nLFxuKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIGNvbnN0IHNvdXJjZUZpbGUgPSByZXNvbHZlQ3VycmVudEZpbGUocGx1Z2luLCBjdHgpO1xuICBpZiAoIXNvdXJjZUZpbGUpIHtcbiAgICBuZXcgTm90aWNlKCdDb3VsZCBub3QgbG9jYXRlIHRoZSBzb3VyY2Ugbm90ZSBmb3IgdGhpcyBlbWJlZGRlZCB3b3JkIGNsb3VkLicpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGxldCB1cGRhdGVkID0gZmFsc2U7XG4gIGF3YWl0IHBsdWdpbi5hcHAudmF1bHQucHJvY2Vzcyhzb3VyY2VGaWxlLCAoY29udGVudCkgPT4ge1xuICAgIGNvbnN0IGJ5SWQgPSBjbG91ZElkXG4gICAgICA/IHJlcGxhY2VXb3JkQ2xvdWRCbG9ja0J5SWQoY29udGVudCwgY2xvdWRJZCwgZW1iZWRCbG9jaylcbiAgICAgIDogbnVsbDtcbiAgICBpZiAoYnlJZCAhPT0gbnVsbCkge1xuICAgICAgdXBkYXRlZCA9IHRydWU7XG4gICAgICByZXR1cm4gYnlJZDtcbiAgICB9XG5cbiAgICBjb25zdCBzZWN0aW9uID0gY3R4LmdldFNlY3Rpb25JbmZvKGhvc3RFbCk7XG4gICAgaWYgKCFzZWN0aW9uKSB7XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICB1cGRhdGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gcmVwbGFjZVNlY3Rpb25XaXRoQmxvY2soY29udGVudCwgc2VjdGlvbi5saW5lU3RhcnQsIHNlY3Rpb24ubGluZUVuZCwgZW1iZWRCbG9jayk7XG4gIH0pO1xuICBpZiAoIXVwZGF0ZWQpIHtcbiAgICBuZXcgTm90aWNlKCdDb3VsZCBub3QgbG9jYXRlIHRoZSBlbWJlZGRlZCB3b3JkIGNsb3VkIGJsb2NrIHRvIHVwZGF0ZS4nKTtcbiAgfVxuICByZXR1cm4gdXBkYXRlZDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlRW1iZWRkZWRDbG91ZEV4Y2x1ZGVkV29yZHMoXG4gIHBsdWdpbjogUGx1Z2luLFxuICBjdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsXG4gIGhvc3RFbDogSFRNTEVsZW1lbnQsXG4gIHNvdXJjZTogc3RyaW5nLFxuICB3b3JkOiBzdHJpbmcsXG4pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3Qgbm9ybWFsaXplZFdvcmQgPSBub3JtYWxpemVXb3JkKHdvcmQpO1xuICBpZiAoIW5vcm1hbGl6ZWRXb3JkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgdXBkYXRlZFNvdXJjZSA9IGFkZEV4Y2x1ZGVkV29yZFRvRW1iZWRkZWRTb3VyY2Uoc291cmNlLCBub3JtYWxpemVkV29yZCk7XG4gIGlmICh1cGRhdGVkU291cmNlID09PSBzb3VyY2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBlbWJlZEJsb2NrID0gYnVpbGRXb3JkQ2xvdWRDb2RlQmxvY2sodXBkYXRlZFNvdXJjZSk7XG4gIHJldHVybiB1cGRhdGVFbWJlZGRlZENvZGVCbG9jayhwbHVnaW4sIGN0eCwgaG9zdEVsLCBlbWJlZEJsb2NrLCBleHRyYWN0Q2xvdWRJZEZyb21Tb3VyY2UodXBkYXRlZFNvdXJjZSkpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlU2VjdGlvbldpdGhCbG9jayhjb250ZW50OiBzdHJpbmcsIGxpbmVTdGFydDogbnVtYmVyLCBsaW5lRW5kOiBudW1iZXIsIGVtYmVkQmxvY2s6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XG4gIGlmIChsaW5lU3RhcnQgPCAwIHx8IGxpbmVFbmQgPCBsaW5lU3RhcnQgfHwgbGluZVN0YXJ0ID49IGxpbmVzLmxlbmd0aCkge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgY29uc3QgcmVwbGFjZW1lbnRMaW5lcyA9IGVtYmVkQmxvY2sucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG4gIGNvbnN0IGJlZm9yZSA9IGxpbmVzLnNsaWNlKDAsIGxpbmVTdGFydCk7XG4gIGNvbnN0IGFmdGVyID0gbGluZXMuc2xpY2UobGluZUVuZCArIDEpO1xuICByZXR1cm4gWy4uLmJlZm9yZSwgLi4ucmVwbGFjZW1lbnRMaW5lcywgLi4uYWZ0ZXJdLmpvaW4oJ1xcbicpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlV29yZENsb3VkQmxvY2tCeUlkKGNvbnRlbnQ6IHN0cmluZywgY2xvdWRJZDogc3RyaW5nLCBlbWJlZEJsb2NrOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgdGFyZ2V0SWQgPSBjbG91ZElkLnRyaW0oKTtcbiAgaWYgKCF0YXJnZXRJZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnN0IGZlbmNlID0gbGluZXNbaV0/LnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChmZW5jZSAhPT0gJ2BgYHdvcmRjbG91ZCcgJiYgZmVuY2UgIT09ICdgYGB3b3JkLWNsb3VkJykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgbGV0IGVuZCA9IGkgKyAxO1xuICAgIHdoaWxlIChlbmQgPCBsaW5lcy5sZW5ndGggJiYgbGluZXNbZW5kXT8udHJpbSgpICE9PSAnYGBgJykge1xuICAgICAgZW5kICs9IDE7XG4gICAgfVxuICAgIGlmIChlbmQgPj0gbGluZXMubGVuZ3RoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2UgPSBsaW5lcy5zbGljZShpICsgMSwgZW5kKS5qb2luKCdcXG4nKTtcbiAgICBjb25zdCBibG9ja0lkID0gZXh0cmFjdENsb3VkSWRGcm9tU291cmNlKHNvdXJjZSk7XG4gICAgaWYgKGJsb2NrSWQgIT09IHRhcmdldElkKSB7XG4gICAgICBpID0gZW5kO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgcmVwbGFjZW1lbnRMaW5lcyA9IGVtYmVkQmxvY2sucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG4gICAgY29uc3QgYmVmb3JlID0gbGluZXMuc2xpY2UoMCwgaSk7XG4gICAgY29uc3QgYWZ0ZXIgPSBsaW5lcy5zbGljZShlbmQgKyAxKTtcbiAgICByZXR1cm4gWy4uLmJlZm9yZSwgLi4ucmVwbGFjZW1lbnRMaW5lcywgLi4uYWZ0ZXJdLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RDbG91ZElkRnJvbVNvdXJjZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGxpbmVzID0gc291cmNlLnNwbGl0KCdcXG4nKTtcbiAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBpZiAoc2VwYXJhdG9ySW5kZXggPT09IC0xKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBrZXkgPSBsaW5lLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoa2V5ICE9PSAnaWQnICYmIGtleSAhPT0gJ2Nsb3VkLWlkJyAmJiBrZXkgIT09ICdjbG91ZF9pZCcgJiYga2V5ICE9PSAnZ3VpZCcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJldHVybiBsaW5lLnNsaWNlKHNlcGFyYXRvckluZGV4ICsgMSkudHJpbSgpO1xuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBhZGRFeGNsdWRlZFdvcmRUb0VtYmVkZGVkU291cmNlKHNvdXJjZTogc3RyaW5nLCB3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBsaW5lcyA9IHNvdXJjZS5yZXBsYWNlKC9cXG4kLywgJycpLnNwbGl0KCdcXG4nKTtcbiAgY29uc3QgZXhjbHVkZWQgPSBleHRyYWN0RXhjbHVkZWRXb3JkcyhsaW5lcyk7XG5cbiAgaWYgKGV4Y2x1ZGVkLmluY2x1ZGVzKHdvcmQpKSB7XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIGNvbnN0IG5leHRFeGNsdWRlZCA9IFsuLi5leGNsdWRlZCwgd29yZF07XG4gIGNvbnN0IHJlcGxhY2VtZW50TGluZSA9IGBleGNsdWRlLXdvcmRzOiAke25leHRFeGNsdWRlZC5qb2luKCcsICcpfWA7XG4gIGNvbnN0IGV4aXN0aW5nTGluZUluZGV4ID0gbGluZXMuZmluZEluZGV4KChsaW5lKSA9PiB7XG4gICAgY29uc3Qga2V5ID0gZ2V0T3B0aW9uS2V5KGxpbmUpO1xuICAgIHJldHVybiBrZXkgPT09ICdleGNsdWRlJyB8fCBrZXkgPT09ICdleGNsdWRlLXdvcmRzJyB8fCBrZXkgPT09ICdleGNsdWRlX3dvcmRzJyB8fCBrZXkgPT09ICdleGNsdWRlZC13b3Jkcyc7XG4gIH0pO1xuXG4gIGlmIChleGlzdGluZ0xpbmVJbmRleCA+PSAwKSB7XG4gICAgbGluZXNbZXhpc3RpbmdMaW5lSW5kZXhdID0gcmVwbGFjZW1lbnRMaW5lO1xuICB9IGVsc2Uge1xuICAgIGxpbmVzLnB1c2gocmVwbGFjZW1lbnRMaW5lKTtcbiAgfVxuXG4gIHJldHVybiBgJHtsaW5lcy5qb2luKCdcXG4nKX1cXG5gO1xufVxuXG5mdW5jdGlvbiBidWlsZFdvcmRDbG91ZENvZGVCbG9jayhzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHRyaW1tZWQgPSBzb3VyY2UucmVwbGFjZSgvXFxuJC8sICcnKTtcbiAgcmV0dXJuIGBcXGBcXGBcXGB3b3JkY2xvdWRcXG4ke3RyaW1tZWR9XFxuXFxgXFxgXFxgYDtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdEV4Y2x1ZGVkV29yZHMobGluZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICBjb25zdCBlbnRyaWVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xuICAgIGNvbnN0IHNlcGFyYXRvckluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgaWYgKHNlcGFyYXRvckluZGV4ID09PSAtMSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3Qga2V5ID0gbGluZS5zbGljZSgwLCBzZXBhcmF0b3JJbmRleCkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKGtleSAhPT0gJ2V4Y2x1ZGUnICYmIGtleSAhPT0gJ2V4Y2x1ZGUtd29yZHMnICYmIGtleSAhPT0gJ2V4Y2x1ZGVfd29yZHMnICYmIGtleSAhPT0gJ2V4Y2x1ZGVkLXdvcmRzJykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgcmF3VmFsdWUgPSBsaW5lLnNsaWNlKHNlcGFyYXRvckluZGV4ICsgMSkudHJpbSgpO1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2YgcmF3VmFsdWUuc3BsaXQoJywnKSkge1xuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVdvcmQodmFsdWUpO1xuICAgICAgaWYgKG5vcm1hbGl6ZWQgJiYgIWVudHJpZXMuaW5jbHVkZXMobm9ybWFsaXplZCkpIHtcbiAgICAgICAgZW50cmllcy5wdXNoKG5vcm1hbGl6ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbnRyaWVzO1xufVxuXG5mdW5jdGlvbiBnZXRPcHRpb25LZXkobGluZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgaWYgKHNlcGFyYXRvckluZGV4ID09PSAtMSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJldHVybiBsaW5lLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KS50cmltKCkudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplV29yZCh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xufVxuIiwgImltcG9ydCB7IEl0ZW1WaWV3LCBOb3RpY2UsIFdvcmtzcGFjZUxlYWYgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBWSUVXX1RZUEVfVkFVTFRfV09SRF9DTE9VRCB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgdHlwZSB7IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzLCBXb3JkQ2xvdWRTZXJ2aWNlcyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFdvcmRDbG91ZEZpbHRlclBhbmVsIH0gZnJvbSAnLi4vdmlld3MvY29tcG9uZW50cy9maWx0ZXItcGFuZWwnO1xuXG5leHBvcnQgY2xhc3MgVmF1bHRXb3JkQ2xvdWRWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICBwcml2YXRlIHJlYWRvbmx5IHNlcnZpY2VzOiBXb3JkQ2xvdWRTZXJ2aWNlcztcbiAgcHJpdmF0ZSByZW5kZXJOb25jZSA9IDA7XG4gIHByaXZhdGUgZmlsdGVyczogV29yZENsb3VkRmlsdGVyU2V0dGluZ3M7XG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgc2VydmljZXM6IFdvcmRDbG91ZFNlcnZpY2VzKSB7XG4gICAgc3VwZXIobGVhZik7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IHNlcnZpY2VzO1xuICAgIHRoaXMuZmlsdGVycyA9IHNlcnZpY2VzLmdldEZpbHRlclNldHRpbmdzKCk7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBWSUVXX1RZUEVfVkFVTFRfV09SRF9DTE9VRDtcbiAgfVxuXG4gIGdldERpc3BsYXlUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdWYXVsdCBXb3JkIENsb3VkJztcbiAgfVxuXG4gIGdldEljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2Nsb3VkJztcbiAgfVxuXG4gIGFzeW5jIG9uT3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICBjb250ZW50RWwuZW1wdHkoKTtcbiAgICBjb250ZW50RWwuYWRkQ2xhc3MoJ3ZhdWx0LXdvcmQtY2xvdWQtdmlldycpO1xuXG4gICAgdGhpcy5maWx0ZXJzID0gdGhpcy5zZXJ2aWNlcy5nZXRGaWx0ZXJTZXR0aW5ncygpO1xuXG4gICAgY29uc3QgdG9wRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10b3AnIH0pO1xuICAgIGNvbnN0IGhlYWRlckVsID0gdG9wRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1oZWFkZXInIH0pO1xuICAgIGhlYWRlckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ1dvcmQgY2xvdWRzJywgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10aXRsZScgfSk7XG5cbiAgICBjb25zdCBjb250cm9sc0VsID0gdG9wRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1jb250cm9scycgfSk7XG4gICAgY29uc3QgY2FudmFzRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1jYW52YXMnIH0pO1xuXG4gICAgY29uc3QgZmlsdGVyUGFuZWwgPSBuZXcgV29yZENsb3VkRmlsdGVyUGFuZWwoe1xuICAgICAgc2VydmljZXM6IHRoaXMuc2VydmljZXMsXG4gICAgICBjb250YWluZXJFbDogY29udHJvbHNFbCxcbiAgICAgIHJlZ2lzdGVyRG9tRXZlbnQ6IChlbGVtZW50LCB0eXBlLCBjYWxsYmFjaykgPT4gdGhpcy5yZWdpc3RlckRvbUV2ZW50KGVsZW1lbnQsIHR5cGUsIGNhbGxiYWNrKSxcbiAgICAgIGZpbHRlcnM6IHRoaXMuZmlsdGVycyxcbiAgICAgIG9uQ2hhbmdlOiBhc3luYyAobmV4dEZpbHRlcnMpID0+IHtcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gbmV4dEZpbHRlcnM7XG4gICAgICAgIGF3YWl0IHRoaXMuc2VydmljZXMudXBkYXRlRmlsdGVyU2V0dGluZ3ModGhpcy5maWx0ZXJzKTtcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gdGhpcy5zZXJ2aWNlcy5nZXRGaWx0ZXJTZXR0aW5ncygpO1xuICAgICAgICBmaWx0ZXJQYW5lbC5zZXRGaWx0ZXJzKHRoaXMuZmlsdGVycyk7XG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyQ2xvdWQoY2FudmFzRWwpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGF3YWl0IHRoaXMucmVuZGVyQ2xvdWQoY2FudmFzRWwpO1xuICB9XG5cbiAgYXN5bmMgb25SZXNpemUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY2FudmFzRWwgPSB0aGlzLmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKCcudmF1bHQtd29yZC1jbG91ZC1jYW52YXMnKTtcbiAgICBpZiAoY2FudmFzRWwgaW5zdGFuY2VvZiBIVE1MRGl2RWxlbWVudCkge1xuICAgICAgYXdhaXQgdGhpcy5yZW5kZXJDbG91ZChjYW52YXNFbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyByZW5kZXJDbG91ZChjb250YWluZXJFbDogSFRNTERpdkVsZW1lbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBhY3RpdmVOb25jZSA9ICsrdGhpcy5yZW5kZXJOb25jZTtcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuICAgIGNvbnN0IGxvYWRpbmdFbCA9IGNvbnRhaW5lckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLCB0ZXh0OiAnQnVpbGRpbmcgY2xvdWQuLi4nIH0pO1xuICAgIGNvbnN0IHVwZGF0ZVByb2dyZXNzID0gKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgICBpZiAoYWN0aXZlTm9uY2UgIT09IHRoaXMucmVuZGVyTm9uY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbG9hZGluZ0VsLnNldFRleHQoYCR7bWVzc2FnZX0gKCR7cGVyY2VudH0lKWApO1xuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgYWN0aXZlRmlsZVBhdGggPSB0aGlzLnNlcnZpY2VzLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyAnJztcbiAgICAgIGNvbnN0IHdvcmRzID0gYXdhaXQgdGhpcy5zZXJ2aWNlcy5jb2xsZWN0VmF1bHRXb3Jkcyh7XG4gICAgICAgIHNvdXJjZVJ1bGVzOiB7XG4gICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIC4uLnRoaXMuZmlsdGVycy5zY29wZSxcbiAgICAgICAgICAgIGFjdGl2ZUZpbGVQYXRoLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgaW5jbHVkZVRhZ3M6IHRoaXMuZmlsdGVycy5pbmNsdWRlVGFncyxcbiAgICAgICAgICBleGNsdWRlVGFnczogdGhpcy5maWx0ZXJzLmV4Y2x1ZGVUYWdzLFxuICAgICAgICAgIHRhZ01hdGNoTW9kZTogdGhpcy5maWx0ZXJzLnRhZ01hdGNoTW9kZSxcbiAgICAgICAgICBmcm9udG1hdHRlclJ1bGVzOiB0aGlzLmZpbHRlcnMuZnJvbnRtYXR0ZXJSdWxlcyxcbiAgICAgICAgfSxcbiAgICAgICAgZnJlcXVlbmN5OiB0aGlzLmZpbHRlcnMuZnJlcXVlbmN5LFxuICAgICAgfSwgdXBkYXRlUHJvZ3Jlc3MpO1xuXG4gICAgICBpZiAod29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJyxcbiAgICAgICAgICB0ZXh0OiAnTm8gd29yZHMgZm91bmQgZm9yIHRoZSBzZWxlY3RlZCBmaWx0ZXJzLicsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMuc2VydmljZXMuZHJhd1dvcmRDbG91ZCh7XG4gICAgICAgIGNvbnRhaW5lckVsLFxuICAgICAgICB3b3JkcyxcbiAgICAgICAgYXJpYUxhYmVsOiAnV29yZCBjbG91ZCBiYXNlZCBvbiBtYXJrZG93biBmaWxlcyBpbiB0aGUgdmF1bHQnLFxuICAgICAgICBvblByb2dyZXNzOiB1cGRhdGVQcm9ncmVzcyxcbiAgICAgICAgb25SZWZyZXNoOiAoKSA9PiB0aGlzLnJlbmRlckNsb3VkKGNvbnRhaW5lckVsKSxcbiAgICAgICAgb25FeGNsdWRlSW5WYXVsdDogYXN5bmMgKHdvcmQpID0+IHtcbiAgICAgICAgICBjb25zdCBhZGRlZCA9IGF3YWl0IHRoaXMuc2VydmljZXMuYWRkQmxhY2tsaXN0V29yZCh3b3JkKTtcbiAgICAgICAgICBuZXcgTm90aWNlKGFkZGVkID8gYEV4Y2x1ZGVkIFwiJHt3b3JkfVwiIGZyb20gd29yZCBjbG91ZHMuYCA6IGBcIiR7d29yZH1cIiBpcyBhbHJlYWR5IGV4Y2x1ZGVkLmApO1xuICAgICAgICAgIGF3YWl0IHRoaXMucmVuZGVyQ2xvdWQoY29udGFpbmVyRWwpO1xuICAgICAgICB9LFxuICAgICAgICBvbldvcmRDbGljazogKHdvcmQpID0+IHtcbiAgICAgICAgICB2b2lkIHRoaXMuc2VydmljZXMub3BlblNlYXJjaEZvcldvcmQod29yZCwge1xuICAgICAgICAgICAgaW5jbHVkZVRhZ3M6IHRoaXMuZmlsdGVycy5pbmNsdWRlVGFncyxcbiAgICAgICAgICAgIGV4Y2x1ZGVUYWdzOiB0aGlzLmZpbHRlcnMuZXhjbHVkZVRhZ3MsXG4gICAgICAgICAgICB0YWdNYXRjaE1vZGU6IHRoaXMuZmlsdGVycy50YWdNYXRjaE1vZGUsXG4gICAgICAgICAgICBmaWxlUGF0aDogdGhpcy5maWx0ZXJzLnNjb3BlLm1vZGUgPT09ICdhY3RpdmUtZmlsZSdcbiAgICAgICAgICAgICAgPyBhY3RpdmVGaWxlUGF0aFxuICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoYWN0aXZlTm9uY2UgIT09IHRoaXMucmVuZGVyTm9uY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1ZhdWx0IHdvcmQgY2xvdWQ6IGZhaWxlZCB0byByZW5kZXIgY2xvdWQnLCBlcnJvcik7XG4gICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJyxcbiAgICAgICAgdGV4dDogJ0NvdWxkIG5vdCByZW5kZXIgdGhlIHdvcmQgY2xvdWQuIE9wZW4gZGV2ZWxvcGVyIGNvbnNvbGUgZm9yIGRldGFpbHMuJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IHNldEljb24gfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSB7IFNvdXJjZVNjb3BlTW9kZSB9IGZyb20gJy4uL3dvcmRjbG91ZC9waXBlbGluZS90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzLCBXb3JkQ2xvdWRTZXJ2aWNlcyB9IGZyb20gJy4uL3R5cGVzJztcblxuY29uc3QgQUxMX0ZSRVFVRU5DSUVTX01JTiA9IDE7XG5jb25zdCBBTExfRlJFUVVFTkNJRVNfTUFYID0gOTk5OTtcblxudHlwZSBSZWdpc3RlckRvbUV2ZW50ID0gKFxuICBlbGVtZW50OiBIVE1MRWxlbWVudCB8IERvY3VtZW50IHwgV2luZG93LFxuICB0eXBlOiBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoZXZlbnQ6IEV2ZW50KSA9PiB2b2lkLFxuKSA9PiB2b2lkO1xuXG50eXBlIFdvcmRDbG91ZEZpbHRlclBhbmVsT3B0aW9ucyA9IHtcbiAgc2VydmljZXM6IFdvcmRDbG91ZFNlcnZpY2VzO1xuICBjb250YWluZXJFbDogSFRNTERpdkVsZW1lbnQ7XG4gIHJlZ2lzdGVyRG9tRXZlbnQ6IFJlZ2lzdGVyRG9tRXZlbnQ7XG4gIGZpbHRlcnM6IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzO1xuICBvbkNoYW5nZTogKGZpbHRlcnM6IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzKSA9PiBQcm9taXNlPHZvaWQ+IHwgdm9pZDtcbn07XG5cbnR5cGUgRmlsdGVyQ29udHJvbFJlZnMgPSB7XG4gIHN1bW1hcnlFbDogSFRNTERpdkVsZW1lbnQ7XG4gIHNjb3BlU2VsZWN0RWw6IEhUTUxTZWxlY3RFbGVtZW50O1xuICBpbmNsdWRlVGFnU2VsZWN0RWw6IEhUTUxTZWxlY3RFbGVtZW50O1xuICBtb2RlU2VsZWN0RWw6IEhUTUxTZWxlY3RFbGVtZW50O1xuICBpbmNsdWRlVGFnc0VsOiBIVE1MRGl2RWxlbWVudDtcbn07XG5cbmV4cG9ydCBjbGFzcyBXb3JkQ2xvdWRGaWx0ZXJQYW5lbCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZXM6IFdvcmRDbG91ZFNlcnZpY2VzO1xuICBwcml2YXRlIHJlYWRvbmx5IGNvbnRhaW5lckVsOiBIVE1MRGl2RWxlbWVudDtcbiAgcHJpdmF0ZSByZWFkb25seSByZWdpc3RlckRvbUV2ZW50OiBSZWdpc3RlckRvbUV2ZW50O1xuICBwcml2YXRlIHJlYWRvbmx5IG9uQ2hhbmdlOiAoZmlsdGVyczogV29yZENsb3VkRmlsdGVyU2V0dGluZ3MpID0+IFByb21pc2U8dm9pZD4gfCB2b2lkO1xuICBwcml2YXRlIGZpbHRlcnM6IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzO1xuICBwcml2YXRlIGNvbnRyb2xzOiBGaWx0ZXJDb250cm9sUmVmcyB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFdvcmRDbG91ZEZpbHRlclBhbmVsT3B0aW9ucykge1xuICAgIHRoaXMuc2VydmljZXMgPSBvcHRpb25zLnNlcnZpY2VzO1xuICAgIHRoaXMuY29udGFpbmVyRWwgPSBvcHRpb25zLmNvbnRhaW5lckVsO1xuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudCA9IG9wdGlvbnMucmVnaXN0ZXJEb21FdmVudDtcbiAgICB0aGlzLm9uQ2hhbmdlID0gb3B0aW9ucy5vbkNoYW5nZTtcbiAgICB0aGlzLmZpbHRlcnMgPSBzYW5pdGl6ZUZpbHRlcnMob3B0aW9ucy5maWx0ZXJzKTtcblxuICAgIHRoaXMuY29udGFpbmVyRWwuYWRkQ2xhc3MoJ3ZhdWx0LXdvcmQtY2xvdWQtY29udHJvbHMtY29uZGVuc2VkJyk7XG4gICAgdGhpcy5idWlsZCgpO1xuICAgIHRoaXMucmVmcmVzaENvbnRyb2xzKCk7XG4gIH1cblxuICBzZXRGaWx0ZXJzKGZpbHRlcnM6IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzKTogdm9pZCB7XG4gICAgdGhpcy5maWx0ZXJzID0gc2FuaXRpemVGaWx0ZXJzKGZpbHRlcnMpO1xuICAgIHRoaXMucmVmcmVzaENvbnRyb2xzKCk7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkKCk6IHZvaWQge1xuICAgIGNvbnN0IGZpbHRlckJhckVsID0gdGhpcy5jb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWZpbHRlci1iYXInIH0pO1xuICAgIGNvbnN0IHN1bW1hcnlFbCA9IGZpbHRlckJhckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtZmlsdGVyLXN1bW1hcnknIH0pO1xuXG4gICAgY29uc3QgcmVzZXRCdXR0b24gPSBmaWx0ZXJCYXJFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1maWx0ZXItcmVzZXQnLFxuICAgIH0pO1xuICAgIHJlc2V0QnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICByZXNldEJ1dHRvbi5zZXRBdHRyKCdhcmlhLWxhYmVsJywgJ1Jlc2V0IGZpbHRlcnMnKTtcbiAgICByZXNldEJ1dHRvbi5zZXRBdHRyKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nLCAnbGVmdCcpO1xuICAgIHJlc2V0QnV0dG9uLnNldEF0dHIoJ3RpdGxlJywgJ1Jlc2V0IGZpbHRlcnMnKTtcbiAgICBzZXRJY29uKHJlc2V0QnV0dG9uLCAncm90YXRlLWNjdycpO1xuXG4gICAgY29uc3Qgc2VjdGlvbkVsID0gdGhpcy5jb250YWluZXJFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWZpbHRlci1zZWN0aW9uJyB9KTtcbiAgICBjb25zdCBoZWFkZXJFbCA9IHNlY3Rpb25FbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNvbnRyb2xzLWhlYWRlcicgfSk7XG4gICAgaGVhZGVyRWwuY3JlYXRlRWwoJ3NwYW4nLCB7IHRleHQ6ICdGaWx0ZXJzJywgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1jb250cm9scy10aXRsZScgfSk7XG5cbiAgICBjb25zdCBncmlkRWwgPSBzZWN0aW9uRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1maWx0ZXItZ3JpZCcgfSk7XG5cbiAgICBjb25zdCBzY29wZUVsID0gZ3JpZEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtdGFnLWZpbHRlcicgfSk7XG4gICAgc2NvcGVFbC5jcmVhdGVFbCgnc3BhbicsIHsgdGV4dDogJ1Njb3BlJywgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10YWctbGFiZWwnIH0pO1xuICAgIGNvbnN0IHNjb3BlU2VsZWN0RWwgPSBzY29wZUVsLmNyZWF0ZUVsKCdzZWxlY3QnLCB7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtbW9kZS1zZWxlY3QnIH0pO1xuICAgIHNjb3BlU2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdmFsdWU6ICd2YXVsdCcsIHRleHQ6ICdFbnRpcmUgdmF1bHQnIH0pO1xuICAgIHNjb3BlU2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdmFsdWU6ICdhY3RpdmUtZmlsZScsIHRleHQ6ICdBY3RpdmUgbm90ZSBvbmx5JyB9KTtcblxuICAgIGNvbnN0IGluY2x1ZGVUYWdQaWNrZXJFbCA9IGdyaWRFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRhZy1maWx0ZXInIH0pO1xuICAgIGluY2x1ZGVUYWdQaWNrZXJFbC5jcmVhdGVFbCgnc3BhbicsIHsgdGV4dDogJ0luY2x1ZGUgdGFnJywgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10YWctbGFiZWwnIH0pO1xuICAgIGNvbnN0IGluY2x1ZGVUYWdTZWxlY3RFbCA9IGluY2x1ZGVUYWdQaWNrZXJFbC5jcmVhdGVFbCgnc2VsZWN0JywgeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLW1vZGUtc2VsZWN0JyB9KTtcbiAgICBpbmNsdWRlVGFnU2VsZWN0RWwuY3JlYXRlRWwoJ29wdGlvbicsIHsgdGV4dDogJ0FkZCBpbmNsdWRlIHRhZy4uLicsIHZhbHVlOiAnJyB9KTtcblxuICAgIGNvbnN0IG1vZGVFbCA9IGdyaWRFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLW1hdGNoLW1vZGUnIH0pO1xuICAgIG1vZGVFbC5jcmVhdGVFbCgnc3BhbicsIHsgdGV4dDogJ0luY2x1ZGUgbWF0Y2ggbW9kZScsIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtdGFnLWxhYmVsJyB9KTtcbiAgICBjb25zdCBtb2RlU2VsZWN0RWwgPSBtb2RlRWwuY3JlYXRlRWwoJ3NlbGVjdCcsIHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1tb2RlLXNlbGVjdCcgfSk7XG4gICAgbW9kZVNlbGVjdEVsLmNyZWF0ZUVsKCdvcHRpb24nLCB7IHRleHQ6ICdBbnkgaW5jbHVkZSB0YWcnLCB2YWx1ZTogJ2FueScgfSk7XG4gICAgbW9kZVNlbGVjdEVsLmNyZWF0ZUVsKCdvcHRpb24nLCB7IHRleHQ6ICdBbGwgaW5jbHVkZSB0YWdzJywgdmFsdWU6ICdhbGwnIH0pO1xuXG4gICAgY29uc3QgaW5jbHVkZVRhZ3NFbCA9IHNlY3Rpb25FbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWFwcGxpZWQtdGFncycgfSk7XG5cbiAgICB0aGlzLmNvbnRyb2xzID0ge1xuICAgICAgc3VtbWFyeUVsLFxuICAgICAgc2NvcGVTZWxlY3RFbCxcbiAgICAgIGluY2x1ZGVUYWdTZWxlY3RFbCxcbiAgICAgIG1vZGVTZWxlY3RFbCxcbiAgICAgIGluY2x1ZGVUYWdzRWwsXG4gICAgfTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChzY29wZVNlbGVjdEVsLCAnY2hhbmdlJywgKCkgPT4ge1xuICAgICAgdGhpcy5maWx0ZXJzLnNjb3BlLm1vZGUgPSAoc2NvcGVTZWxlY3RFbC52YWx1ZSBhcyBTb3VyY2VTY29wZU1vZGUpID8/ICd2YXVsdCc7XG4gICAgICBpZiAodGhpcy5maWx0ZXJzLnNjb3BlLm1vZGUgPT09ICdhY3RpdmUtZmlsZScpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJzLnNjb3BlLmFjdGl2ZUZpbGVQYXRoID0gdGhpcy5zZXJ2aWNlcy5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gJyc7XG4gICAgICB9XG4gICAgICB2b2lkIHRoaXMucGVyc2lzdCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KGluY2x1ZGVUYWdTZWxlY3RFbCwgJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkVGFnID0gaW5jbHVkZVRhZ1NlbGVjdEVsLnZhbHVlO1xuICAgICAgaWYgKCFzZWxlY3RlZFRhZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5maWx0ZXJzLmluY2x1ZGVUYWdzLmluY2x1ZGVzKHNlbGVjdGVkVGFnKSkge1xuICAgICAgICB0aGlzLmZpbHRlcnMuaW5jbHVkZVRhZ3MucHVzaChzZWxlY3RlZFRhZyk7XG4gICAgICB9XG4gICAgICBpbmNsdWRlVGFnU2VsZWN0RWwudmFsdWUgPSAnJztcbiAgICAgIHZvaWQgdGhpcy5wZXJzaXN0KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQobW9kZVNlbGVjdEVsLCAnY2hhbmdlJywgKCkgPT4ge1xuICAgICAgdGhpcy5maWx0ZXJzLnRhZ01hdGNoTW9kZSA9IG1vZGVTZWxlY3RFbC52YWx1ZSA9PT0gJ2FsbCcgPyAnYWxsJyA6ICdhbnknO1xuICAgICAgdm9pZCB0aGlzLnBlcnNpc3QoKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChyZXNldEJ1dHRvbiwgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5maWx0ZXJzID0gc2FuaXRpemVGaWx0ZXJzKHtcbiAgICAgICAgLi4udGhpcy5maWx0ZXJzLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgIG1vZGU6ICd2YXVsdCcsXG4gICAgICAgICAgYWN0aXZlRmlsZVBhdGg6ICcnLFxuICAgICAgICAgIGZvbGRlclBhdGhzOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAgaW5jbHVkZVRhZ3M6IFtdLFxuICAgICAgICB0YWdNYXRjaE1vZGU6ICdhbnknLFxuICAgICAgfSk7XG4gICAgICB2b2lkIHRoaXMucGVyc2lzdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoQ29udHJvbHMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNvbnRyb2xzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgc3VtbWFyeUVsLFxuICAgICAgc2NvcGVTZWxlY3RFbCxcbiAgICAgIGluY2x1ZGVUYWdTZWxlY3RFbCxcbiAgICAgIG1vZGVTZWxlY3RFbCxcbiAgICAgIGluY2x1ZGVUYWdzRWwsXG4gICAgfSA9IHRoaXMuY29udHJvbHM7XG5cbiAgICBzY29wZVNlbGVjdEVsLnZhbHVlID0gdGhpcy5maWx0ZXJzLnNjb3BlLm1vZGU7XG4gICAgbW9kZVNlbGVjdEVsLnZhbHVlID0gdGhpcy5maWx0ZXJzLnRhZ01hdGNoTW9kZTtcblxuICAgIHRoaXMudXBkYXRlVGFnUGlja2VyT3B0aW9ucyhpbmNsdWRlVGFnU2VsZWN0RWwpO1xuICAgIHRoaXMucmVuZGVyQXBwbGllZFRhZ0NoaXBzKGluY2x1ZGVUYWdzRWwpO1xuXG4gICAgbW9kZVNlbGVjdEVsLmRpc2FibGVkID0gdGhpcy5maWx0ZXJzLmluY2x1ZGVUYWdzLmxlbmd0aCA8PSAxO1xuICAgIHN1bW1hcnlFbC5zZXRUZXh0KHRoaXMuYnVpbGRGaWx0ZXJTdW1tYXJ5KCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVUYWdQaWNrZXJPcHRpb25zKHNlbGVjdEVsOiBIVE1MU2VsZWN0RWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IHRhZ3MgPSB0aGlzLnNlcnZpY2VzLmdldEF2YWlsYWJsZVRhZ3MoKTtcbiAgICBjb25zdCBpbmNsdWRlU2V0ID0gbmV3IFNldCh0aGlzLmZpbHRlcnMuaW5jbHVkZVRhZ3MpO1xuXG4gICAgY29uc3QgcHJldmlvdXMgPSBzZWxlY3RFbC52YWx1ZTtcbiAgICBzZWxlY3RFbC5lbXB0eSgpO1xuICAgIHNlbGVjdEVsLmNyZWF0ZUVsKCdvcHRpb24nLCB7IHRleHQ6ICdBZGQgaW5jbHVkZSB0YWcuLi4nLCB2YWx1ZTogJycgfSk7XG5cbiAgICBmb3IgKGNvbnN0IHRhZyBvZiB0YWdzKSB7XG4gICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiB0YWcsIHZhbHVlOiB0YWcgfSk7XG4gICAgICBvcHRpb24uZGlzYWJsZWQgPSBpbmNsdWRlU2V0Lmhhcyh0YWcpO1xuICAgIH1cblxuICAgIHNlbGVjdEVsLnZhbHVlID0gcHJldmlvdXMgJiYgc2VsZWN0RWwucXVlcnlTZWxlY3Rvcihgb3B0aW9uW3ZhbHVlPVwiJHtDU1MuZXNjYXBlKHByZXZpb3VzKX1cIl1gKSA/IHByZXZpb3VzIDogJyc7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckFwcGxpZWRUYWdDaGlwcyhjaGlwc0VsOiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xuICAgIGNoaXBzRWwuZW1wdHkoKTtcblxuICAgIGlmICh0aGlzLmZpbHRlcnMuaW5jbHVkZVRhZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBjaGlwc0VsLmNyZWF0ZVNwYW4oe1xuICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNoaXAtZW1wdHknLFxuICAgICAgICB0ZXh0OiAnTm8gaW5jbHVkZSB0YWdzIGFwcGxpZWQuJyxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgdGFnIG9mIHRoaXMuZmlsdGVycy5pbmNsdWRlVGFncykge1xuICAgICAgY29uc3QgY2hpcEVsID0gY2hpcHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNoaXAnIH0pO1xuICAgICAgY2hpcEVsLmNyZWF0ZVNwYW4oeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNoaXAtdGV4dCcsIHRleHQ6IGArICR7dGFnfWAgfSk7XG5cbiAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IGNoaXBFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNoaXAtcmVtb3ZlJyxcbiAgICAgICAgdGV4dDogJ3gnLFxuICAgICAgfSk7XG4gICAgICByZW1vdmVCdXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgICAgcmVtb3ZlQnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCBgUmVtb3ZlICR7dGFnfSBpbmNsdWRlIGZpbHRlcmApO1xuXG4gICAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQocmVtb3ZlQnV0dG9uLCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZmlsdGVycy5pbmNsdWRlVGFncyA9IHRoaXMuZmlsdGVycy5pbmNsdWRlVGFncy5maWx0ZXIoKHZhbHVlKSA9PiB2YWx1ZSAhPT0gdGFnKTtcbiAgICAgICAgdm9pZCB0aGlzLnBlcnNpc3QoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRGaWx0ZXJTdW1tYXJ5KCk6IHN0cmluZyB7XG4gICAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gICAgcGFydHMucHVzaCh0aGlzLmZpbHRlcnMuc2NvcGUubW9kZSA9PT0gJ3ZhdWx0JyA/ICdTY29wZTogdmF1bHQnIDogJ1Njb3BlOiBhY3RpdmUgbm90ZScpO1xuXG4gICAgaWYgKHRoaXMuZmlsdGVycy5pbmNsdWRlVGFncy5sZW5ndGggPiAwKSB7XG4gICAgICBwYXJ0cy5wdXNoKGBJbmNsdWRlOiAke3RoaXMuZmlsdGVycy5pbmNsdWRlVGFncy5sZW5ndGh9IHRhZyhzKWApO1xuICAgIH1cblxuICAgIHBhcnRzLnB1c2goJ0ZyZXF1ZW5jeTogYWxsJyk7XG4gICAgcmV0dXJuIHBhcnRzLmpvaW4oJyB8ICcpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBwZXJzaXN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuZmlsdGVycyA9IHNhbml0aXplRmlsdGVycyh0aGlzLmZpbHRlcnMpO1xuICAgIGF3YWl0IHRoaXMub25DaGFuZ2UoY2xvbmVGaWx0ZXJzKHRoaXMuZmlsdGVycykpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNhbml0aXplRmlsdGVycyhmaWx0ZXJzOiBXb3JkQ2xvdWRGaWx0ZXJTZXR0aW5ncyk6IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzIHtcbiAgY29uc3QgbW9kZTogU291cmNlU2NvcGVNb2RlID0gZmlsdGVycy5zY29wZS5tb2RlID09PSAnYWN0aXZlLWZpbGUnID8gJ2FjdGl2ZS1maWxlJyA6ICd2YXVsdCc7XG5cbiAgcmV0dXJuIHtcbiAgICBzY29wZToge1xuICAgICAgbW9kZSxcbiAgICAgIGFjdGl2ZUZpbGVQYXRoOiBmaWx0ZXJzLnNjb3BlLmFjdGl2ZUZpbGVQYXRoLFxuICAgICAgZm9sZGVyUGF0aHM6IFtdLFxuICAgIH0sXG4gICAgaW5jbHVkZVRhZ3M6IFsuLi5maWx0ZXJzLmluY2x1ZGVUYWdzXSxcbiAgICBleGNsdWRlVGFnczogW10sXG4gICAgdGFnTWF0Y2hNb2RlOiBmaWx0ZXJzLnRhZ01hdGNoTW9kZSxcbiAgICBmcm9udG1hdHRlclJ1bGVzOiBbXSxcbiAgICBmcmVxdWVuY3k6IHtcbiAgICAgIG1pbkNvdW50OiBBTExfRlJFUVVFTkNJRVNfTUlOLFxuICAgICAgbWF4Q291bnQ6IEFMTF9GUkVRVUVOQ0lFU19NQVgsXG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xvbmVGaWx0ZXJzKGZpbHRlcnM6IFdvcmRDbG91ZEZpbHRlclNldHRpbmdzKTogV29yZENsb3VkRmlsdGVyU2V0dGluZ3Mge1xuICByZXR1cm4ge1xuICAgIHNjb3BlOiB7XG4gICAgICBtb2RlOiBmaWx0ZXJzLnNjb3BlLm1vZGUsXG4gICAgICBhY3RpdmVGaWxlUGF0aDogZmlsdGVycy5zY29wZS5hY3RpdmVGaWxlUGF0aCxcbiAgICAgIGZvbGRlclBhdGhzOiBbLi4uZmlsdGVycy5zY29wZS5mb2xkZXJQYXRoc10sXG4gICAgfSxcbiAgICBpbmNsdWRlVGFnczogWy4uLmZpbHRlcnMuaW5jbHVkZVRhZ3NdLFxuICAgIGV4Y2x1ZGVUYWdzOiBbLi4uZmlsdGVycy5leGNsdWRlVGFnc10sXG4gICAgdGFnTWF0Y2hNb2RlOiBmaWx0ZXJzLnRhZ01hdGNoTW9kZSxcbiAgICBmcm9udG1hdHRlclJ1bGVzOiBmaWx0ZXJzLmZyb250bWF0dGVyUnVsZXMubWFwKChydWxlKSA9PiAoeyAuLi5ydWxlIH0pKSxcbiAgICBmcmVxdWVuY3k6IHtcbiAgICAgIG1pbkNvdW50OiBmaWx0ZXJzLmZyZXF1ZW5jeS5taW5Db3VudCxcbiAgICAgIG1heENvdW50OiBmaWx0ZXJzLmZyZXF1ZW5jeS5tYXhDb3VudCxcbiAgICB9LFxuICB9O1xufVxuIiwgImltcG9ydCB7IEl0ZW1WaWV3LCBOb3RpY2UsIHR5cGUgVEZpbGUsIFdvcmtzcGFjZUxlYWYgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBkcmF3RnJlcXVlbmN5Q2hhcnQgfSBmcm9tICcuLi9yZW5kZXJlcnMvZnJlcXVlbmN5LWNoYXJ0LXJlbmRlcmVyJztcbmltcG9ydCB7IFZJRVdfVFlQRV9OT1RFX1dPUkRfQ0xPVUQgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUgeyBXZWlnaHRlZFdvcmQsIFdvcmRDbG91ZEZpbHRlclNldHRpbmdzLCBXb3JkQ2xvdWRTZXJ2aWNlcyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFdvcmRDbG91ZEZpbHRlclBhbmVsIH0gZnJvbSAnLi4vdmlld3MvY29tcG9uZW50cy9maWx0ZXItcGFuZWwnO1xuXG50eXBlIE5vdGVWaWV3VGFiID0gJ2Nsb3VkJyB8ICdmcmVxdWVuY3knO1xuXG5leHBvcnQgY2xhc3MgTm90ZVdvcmRDbG91ZFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZXM6IFdvcmRDbG91ZFNlcnZpY2VzO1xuICBwcml2YXRlIHJlbmRlck5vbmNlID0gMDtcbiAgcHJpdmF0ZSBzZWxlY3RlZEZpbGVQYXRoID0gJyc7XG4gIHByaXZhdGUgYWN0aXZlVGFiOiBOb3RlVmlld1RhYiA9ICdjbG91ZCc7XG4gIHByaXZhdGUgbGF0ZXN0V29yZHM6IFdlaWdodGVkV29yZFtdID0gW107XG4gIHByaXZhdGUgbGF0ZXN0Q29udGV4dExhYmVsID0gJ2N1cnJlbnQgZmlsdGVycyc7XG4gIHByaXZhdGUgZnJlcXVlbmN5UmVuZGVyZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBjbG91ZENhbnZhc0VsOiBIVE1MRGl2RWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGZyZXF1ZW5jeUNhbnZhc0VsOiBIVE1MRGl2RWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGNsb3VkVGFiQnV0dG9uRWw6IEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZnJlcXVlbmN5VGFiQnV0dG9uRWw6IEhUTUxCdXR0b25FbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZmlsdGVyczogV29yZENsb3VkRmlsdGVyU2V0dGluZ3M7XG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgc2VydmljZXM6IFdvcmRDbG91ZFNlcnZpY2VzKSB7XG4gICAgc3VwZXIobGVhZik7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IHNlcnZpY2VzO1xuICAgIHRoaXMuZmlsdGVycyA9IHNlcnZpY2VzLmdldEZpbHRlclNldHRpbmdzKCk7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBWSUVXX1RZUEVfTk9URV9XT1JEX0NMT1VEO1xuICB9XG5cbiAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ05vdGUgd29yZCBjbG91ZHMnO1xuICB9XG5cbiAgZ2V0SWNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiAnZmlsZS10ZXh0JztcbiAgfVxuXG4gIGFzeW5jIG9uT3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICBjb250ZW50RWwuZW1wdHkoKTtcbiAgICBjb250ZW50RWwuYWRkQ2xhc3MoJ3ZhdWx0LXdvcmQtY2xvdWQtdmlldycpO1xuXG4gICAgdGhpcy5maWx0ZXJzID0gdGhpcy5zZXJ2aWNlcy5nZXRGaWx0ZXJTZXR0aW5ncygpO1xuXG4gICAgY29uc3QgdG9wRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10b3AnIH0pO1xuICAgIGNvbnN0IGhlYWRlckVsID0gdG9wRWwuY3JlYXRlRGl2KHsgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1oZWFkZXInIH0pO1xuICAgIGhlYWRlckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ05vdGUgd29yZCBjbG91ZHMnLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXRpdGxlJyB9KTtcblxuICAgIGNvbnN0IGNvbnRyb2xzRWwgPSB0b3BFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNvbnRyb2xzJyB9KTtcblxuICAgIGNvbnN0IG5vdGVDb250cm9sc0VsID0gY29udHJvbHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWZpbHRlci1zZWN0aW9uJyB9KTtcbiAgICBjb25zdCBub3RlSGVhZGVyRWwgPSBub3RlQ29udHJvbHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNvbnRyb2xzLWhlYWRlcicgfSk7XG4gICAgbm90ZUhlYWRlckVsLmNyZWF0ZUVsKCdzcGFuJywgeyB0ZXh0OiAnTm90ZSBwaWNrZXInLCBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWNvbnRyb2xzLXRpdGxlJyB9KTtcbiAgICBub3RlSGVhZGVyRWwuY3JlYXRlRWwoJ3NwYW4nLCB7XG4gICAgICB0ZXh0OiAnVXNlZCB3aGVuIHNjb3BlIGlzIEFjdGl2ZSBub3RlIG9ubHknLFxuICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1jb250cm9scy1zdW1tYXJ5JyxcbiAgICB9KTtcblxuICAgIGNvbnN0IG5vdGVHcmlkRWwgPSBub3RlQ29udHJvbHNFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLWZpbHRlci1ncmlkJyB9KTtcbiAgICBjb25zdCBmaWxlRmlsdGVyRWwgPSBub3RlR3JpZEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtdGFnLWZpbHRlcicgfSk7XG4gICAgY29uc3QgZmlsZUxhYmVsRWwgPSBmaWxlRmlsdGVyRWwuY3JlYXRlRWwoJ2xhYmVsJywgeyB0ZXh0OiAnT3BlbiBub3RlJywgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10YWctbGFiZWwnIH0pO1xuICAgIGNvbnN0IGZpbGVTZWxlY3RFbCA9IGZpbGVGaWx0ZXJFbC5jcmVhdGVFbCgnc2VsZWN0JywgeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLW1vZGUtc2VsZWN0JyB9KTtcbiAgICBmaWxlU2VsZWN0RWwuaWQgPSAndmF1bHQtd29yZC1jbG91ZC1ub3RlLXNlbGVjdCc7XG4gICAgZmlsZUxhYmVsRWwuc2V0QXR0cignZm9yJywgZmlsZVNlbGVjdEVsLmlkKTtcbiAgICBmaWxlU2VsZWN0RWwuc2V0QXR0cignYXJpYS1sYWJlbCcsICdDaG9vc2UgYW4gb3BlbiBub3RlJyk7XG5cbiAgICBjb25zdCBub3RlQWN0aW9uc0VsID0gbm90ZUdyaWRFbC5jcmVhdGVEaXYoeyBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLW1hdGNoLW1vZGUnIH0pO1xuICAgIG5vdGVBY3Rpb25zRWwuY3JlYXRlRWwoJ3NwYW4nLCB7IHRleHQ6ICdBY3Rpb25zJywgY2xzOiAndmF1bHQtd29yZC1jbG91ZC10YWctbGFiZWwnIH0pO1xuXG4gICAgY29uc3QgYWN0aXZlQnV0dG9uID0gbm90ZUFjdGlvbnNFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgdGV4dDogJ1VzZSBhY3RpdmUgbm90ZScsXG4gICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXJlZnJlc2gnLFxuICAgIH0pO1xuICAgIGFjdGl2ZUJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgYWN0aXZlQnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnVXNlIGFjdGl2ZSBub3RlJyk7XG5cbiAgICBjb25zdCByZWZyZXNoQnV0dG9uID0gbm90ZUFjdGlvbnNFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgdGV4dDogJ1JlZnJlc2gnLFxuICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1yZWZyZXNoJyxcbiAgICB9KTtcbiAgICByZWZyZXNoQnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICByZWZyZXNoQnV0dG9uLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnUmVmcmVzaCBub3RlIGluc2lnaHRzJyk7XG5cbiAgICBsZXQgZmlsdGVyUGFuZWw6IFdvcmRDbG91ZEZpbHRlclBhbmVsO1xuICAgIGNvbnN0IHBlcnNpc3RGaWx0ZXJzQW5kUmVuZGVyID0gYXN5bmMgKG5leHRGaWx0ZXJzOiBXb3JkQ2xvdWRGaWx0ZXJTZXR0aW5ncyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgdGhpcy5maWx0ZXJzID0gbmV4dEZpbHRlcnM7XG4gICAgICBhd2FpdCB0aGlzLnNlcnZpY2VzLnVwZGF0ZUZpbHRlclNldHRpbmdzKHRoaXMuZmlsdGVycyk7XG4gICAgICB0aGlzLmZpbHRlcnMgPSB0aGlzLnNlcnZpY2VzLmdldEZpbHRlclNldHRpbmdzKCk7XG4gICAgICBmaWx0ZXJQYW5lbC5zZXRGaWx0ZXJzKHRoaXMuZmlsdGVycyk7XG4gICAgICBhd2FpdCB0aGlzLnJlbmRlckNsb3VkKGNsb3VkQ2FudmFzRWwpO1xuICAgIH07XG5cbiAgICBmaWx0ZXJQYW5lbCA9IG5ldyBXb3JkQ2xvdWRGaWx0ZXJQYW5lbCh7XG4gICAgICBzZXJ2aWNlczogdGhpcy5zZXJ2aWNlcyxcbiAgICAgIGNvbnRhaW5lckVsOiBjb250cm9sc0VsLFxuICAgICAgcmVnaXN0ZXJEb21FdmVudDogKGVsZW1lbnQsIHR5cGUsIGNhbGxiYWNrKSA9PiB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoZWxlbWVudCwgdHlwZSwgY2FsbGJhY2spLFxuICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJzLFxuICAgICAgb25DaGFuZ2U6IHBlcnNpc3RGaWx0ZXJzQW5kUmVuZGVyLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGFic0VsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ25vdGUtd29yZC1jbG91ZC10YWJzJyB9KTtcbiAgICB0YWJzRWwuc2V0QXR0cigncm9sZScsICd0YWJsaXN0Jyk7XG4gICAgdGFic0VsLnNldEF0dHIoJ2FyaWEtbGFiZWwnLCAnTm90ZSB3b3JkIGNsb3VkIHZpc3VhbGl6YXRpb25zJyk7XG5cbiAgICBjb25zdCBjbG91ZFRhYkJ1dHRvbiA9IHRhYnNFbC5jcmVhdGVFbCgnYnV0dG9uJywge1xuICAgICAgY2xzOiAnbm90ZS13b3JkLWNsb3VkLXRhYiBpcy1hY3RpdmUnLFxuICAgICAgdGV4dDogJ1dvcmQgY2xvdWQnLFxuICAgIH0pO1xuICAgIGNsb3VkVGFiQnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICBjbG91ZFRhYkJ1dHRvbi5pZCA9ICdub3RlLXdvcmQtY2xvdWQtdGFiLWNsb3VkJztcbiAgICBjbG91ZFRhYkJ1dHRvbi5zZXRBdHRyKCdyb2xlJywgJ3RhYicpO1xuICAgIGNsb3VkVGFiQnV0dG9uLnNldEF0dHIoJ2FyaWEtY29udHJvbHMnLCAnbm90ZS13b3JkLWNsb3VkLXBhbmVsLWNsb3VkJyk7XG4gICAgY2xvdWRUYWJCdXR0b24uc2V0QXR0cignYXJpYS1zZWxlY3RlZCcsICd0cnVlJyk7XG4gICAgY2xvdWRUYWJCdXR0b24uc2V0QXR0cigndGFiaW5kZXgnLCAnMCcpO1xuXG4gICAgY29uc3QgZnJlcXVlbmN5VGFiQnV0dG9uID0gdGFic0VsLmNyZWF0ZUVsKCdidXR0b24nLCB7XG4gICAgICBjbHM6ICdub3RlLXdvcmQtY2xvdWQtdGFiJyxcbiAgICAgIHRleHQ6ICdGcmVxdWVuY3knLFxuICAgIH0pO1xuICAgIGZyZXF1ZW5jeVRhYkJ1dHRvbi50eXBlID0gJ2J1dHRvbic7XG4gICAgZnJlcXVlbmN5VGFiQnV0dG9uLmlkID0gJ25vdGUtd29yZC1jbG91ZC10YWItZnJlcXVlbmN5JztcbiAgICBmcmVxdWVuY3lUYWJCdXR0b24uc2V0QXR0cigncm9sZScsICd0YWInKTtcbiAgICBmcmVxdWVuY3lUYWJCdXR0b24uc2V0QXR0cignYXJpYS1jb250cm9scycsICdub3RlLXdvcmQtY2xvdWQtcGFuZWwtZnJlcXVlbmN5Jyk7XG4gICAgZnJlcXVlbmN5VGFiQnV0dG9uLnNldEF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcbiAgICBmcmVxdWVuY3lUYWJCdXR0b24uc2V0QXR0cigndGFiaW5kZXgnLCAnLTEnKTtcblxuICAgIGNvbnN0IHBhbmVsc0VsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ25vdGUtd29yZC1jbG91ZC1wYW5lbHMnIH0pO1xuXG4gICAgY29uc3QgY2xvdWRQYW5lbEVsID0gcGFuZWxzRWwuY3JlYXRlRGl2KHsgY2xzOiAnbm90ZS13b3JkLWNsb3VkLXBhbmVsIGlzLWFjdGl2ZScgfSk7XG4gICAgY2xvdWRQYW5lbEVsLmlkID0gJ25vdGUtd29yZC1jbG91ZC1wYW5lbC1jbG91ZCc7XG4gICAgY2xvdWRQYW5lbEVsLnNldEF0dHIoJ3JvbGUnLCAndGFicGFuZWwnKTtcbiAgICBjbG91ZFBhbmVsRWwuc2V0QXR0cignYXJpYS1sYWJlbGxlZGJ5JywgY2xvdWRUYWJCdXR0b24uaWQpO1xuXG4gICAgY29uc3QgZnJlcXVlbmN5UGFuZWxFbCA9IHBhbmVsc0VsLmNyZWF0ZURpdih7IGNsczogJ25vdGUtd29yZC1jbG91ZC1wYW5lbCcgfSk7XG4gICAgZnJlcXVlbmN5UGFuZWxFbC5pZCA9ICdub3RlLXdvcmQtY2xvdWQtcGFuZWwtZnJlcXVlbmN5JztcbiAgICBmcmVxdWVuY3lQYW5lbEVsLnNldEF0dHIoJ3JvbGUnLCAndGFicGFuZWwnKTtcbiAgICBmcmVxdWVuY3lQYW5lbEVsLnNldEF0dHIoJ2FyaWEtbGFiZWxsZWRieScsIGZyZXF1ZW5jeVRhYkJ1dHRvbi5pZCk7XG4gICAgZnJlcXVlbmN5UGFuZWxFbC5zZXRBdHRyKCdoaWRkZW4nLCAnJyk7XG5cbiAgICBjb25zdCBjbG91ZENhbnZhc0VsID0gY2xvdWRQYW5lbEVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtY2FudmFzJyB9KTtcbiAgICBjb25zdCBmcmVxdWVuY3lDYW52YXNFbCA9IGZyZXF1ZW5jeVBhbmVsRWwuY3JlYXRlRGl2KHsgY2xzOiAnbm90ZS13b3JkLWNsb3VkLWZyZXF1ZW5jeS1jYW52YXMnIH0pO1xuXG4gICAgdGhpcy5jbG91ZENhbnZhc0VsID0gY2xvdWRDYW52YXNFbDtcbiAgICB0aGlzLmZyZXF1ZW5jeUNhbnZhc0VsID0gZnJlcXVlbmN5Q2FudmFzRWw7XG4gICAgdGhpcy5jbG91ZFRhYkJ1dHRvbkVsID0gY2xvdWRUYWJCdXR0b247XG4gICAgdGhpcy5mcmVxdWVuY3lUYWJCdXR0b25FbCA9IGZyZXF1ZW5jeVRhYkJ1dHRvbjtcblxuICAgIHRoaXMudXBkYXRlT3BlbkZpbGVPcHRpb25zKGZpbGVTZWxlY3RFbCk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoZmlsZVNlbGVjdEVsLCAnY2hhbmdlJywgKCkgPT4ge1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gZmlsZVNlbGVjdEVsLnZhbHVlO1xuICAgICAgaWYgKHRoaXMuZmlsdGVycy5zY29wZS5tb2RlICE9PSAnYWN0aXZlLWZpbGUnKSB7XG4gICAgICAgIHZvaWQgdGhpcy5yZW5kZXJDbG91ZChjbG91ZENhbnZhc0VsKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2b2lkIHBlcnNpc3RGaWx0ZXJzQW5kUmVuZGVyKHtcbiAgICAgICAgLi4udGhpcy5maWx0ZXJzLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgIC4uLnRoaXMuZmlsdGVycy5zY29wZSxcbiAgICAgICAgICBtb2RlOiAnYWN0aXZlLWZpbGUnLFxuICAgICAgICAgIGFjdGl2ZUZpbGVQYXRoOiB0aGlzLnNlbGVjdGVkRmlsZVBhdGgsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChhY3RpdmVCdXR0b24sICdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGl2ZUZpbGUgPSB0aGlzLnNlcnZpY2VzLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmIChhY3RpdmVGaWxlKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCA9IGFjdGl2ZUZpbGUucGF0aDtcbiAgICAgICAgdGhpcy51cGRhdGVPcGVuRmlsZU9wdGlvbnMoZmlsZVNlbGVjdEVsKTtcbiAgICAgICAgZmlsZVNlbGVjdEVsLnZhbHVlID0gdGhpcy5zZWxlY3RlZEZpbGVQYXRoO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5maWx0ZXJzLnNjb3BlLm1vZGUgIT09ICdhY3RpdmUtZmlsZScpIHtcbiAgICAgICAgdm9pZCB0aGlzLnJlbmRlckNsb3VkKGNsb3VkQ2FudmFzRWwpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZvaWQgcGVyc2lzdEZpbHRlcnNBbmRSZW5kZXIoe1xuICAgICAgICAuLi50aGlzLmZpbHRlcnMsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgLi4udGhpcy5maWx0ZXJzLnNjb3BlLFxuICAgICAgICAgIG1vZGU6ICdhY3RpdmUtZmlsZScsXG4gICAgICAgICAgYWN0aXZlRmlsZVBhdGg6IHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KHJlZnJlc2hCdXR0b24sICdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlT3BlbkZpbGVPcHRpb25zKGZpbGVTZWxlY3RFbCk7XG4gICAgICBpZiAoIWZpbGVTZWxlY3RFbC52YWx1ZSAmJiB0aGlzLnNlbGVjdGVkRmlsZVBhdGgpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gJyc7XG4gICAgICB9XG4gICAgICB2b2lkIHRoaXMucmVuZGVyQ2xvdWQoY2xvdWRDYW52YXNFbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoY2xvdWRUYWJCdXR0b24sICdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuc3dpdGNoVGFiKCdjbG91ZCcsIGNsb3VkUGFuZWxFbCwgZnJlcXVlbmN5UGFuZWxFbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoZnJlcXVlbmN5VGFiQnV0dG9uLCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLnN3aXRjaFRhYignZnJlcXVlbmN5JywgY2xvdWRQYW5lbEVsLCBmcmVxdWVuY3lQYW5lbEVsKTtcbiAgICAgIHRoaXMucmVuZGVyRnJlcXVlbmN5Q2hhcnQodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoY2xvdWRUYWJCdXR0b24sICdrZXlkb3duJywgKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dSaWdodCcpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZnJlcXVlbmN5VGFiQnV0dG9uLmZvY3VzKCk7XG4gICAgICAgIHRoaXMuc3dpdGNoVGFiKCdmcmVxdWVuY3knLCBjbG91ZFBhbmVsRWwsIGZyZXF1ZW5jeVBhbmVsRWwpO1xuICAgICAgICB0aGlzLnJlbmRlckZyZXF1ZW5jeUNoYXJ0KHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KGZyZXF1ZW5jeVRhYkJ1dHRvbiwgJ2tleWRvd24nLCAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdBcnJvd0xlZnQnKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNsb3VkVGFiQnV0dG9uLmZvY3VzKCk7XG4gICAgICAgIHRoaXMuc3dpdGNoVGFiKCdjbG91ZCcsIGNsb3VkUGFuZWxFbCwgZnJlcXVlbmN5UGFuZWxFbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKCdhY3RpdmUtbGVhZi1jaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3RpdmVGaWxlID0gdGhpcy5zZXJ2aWNlcy5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWFjdGl2ZUZpbGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGVQYXRoICE9PSBhY3RpdmVGaWxlLnBhdGgpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gYWN0aXZlRmlsZS5wYXRoO1xuICAgICAgICB0aGlzLnVwZGF0ZU9wZW5GaWxlT3B0aW9ucyhmaWxlU2VsZWN0RWwpO1xuICAgICAgICBmaWxlU2VsZWN0RWwudmFsdWUgPSB0aGlzLnNlbGVjdGVkRmlsZVBhdGg7XG5cbiAgICAgICAgaWYgKHRoaXMuZmlsdGVycy5zY29wZS5tb2RlID09PSAnYWN0aXZlLWZpbGUnKSB7XG4gICAgICAgICAgdm9pZCBwZXJzaXN0RmlsdGVyc0FuZFJlbmRlcih7XG4gICAgICAgICAgICAuLi50aGlzLmZpbHRlcnMsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAuLi50aGlzLmZpbHRlcnMuc2NvcGUsXG4gICAgICAgICAgICAgIG1vZGU6ICdhY3RpdmUtZmlsZScsXG4gICAgICAgICAgICAgIGFjdGl2ZUZpbGVQYXRoOiB0aGlzLnNlbGVjdGVkRmlsZVBhdGgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZvaWQgdGhpcy5yZW5kZXJDbG91ZChjbG91ZENhbnZhc0VsKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICBhd2FpdCB0aGlzLnJlbmRlckNsb3VkKGNsb3VkQ2FudmFzRWwpO1xuICB9XG5cbiAgb25DbG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLmNsb3VkQ2FudmFzRWwgPSBudWxsO1xuICAgIHRoaXMuZnJlcXVlbmN5Q2FudmFzRWwgPSBudWxsO1xuICAgIHRoaXMuY2xvdWRUYWJCdXR0b25FbCA9IG51bGw7XG4gICAgdGhpcy5mcmVxdWVuY3lUYWJCdXR0b25FbCA9IG51bGw7XG4gIH1cblxuICBhc3luYyBvblJlc2l6ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5hY3RpdmVUYWIgPT09ICdjbG91ZCcgJiYgdGhpcy5jbG91ZENhbnZhc0VsKSB7XG4gICAgICBhd2FpdCB0aGlzLnJlbmRlckNsb3VkKHRoaXMuY2xvdWRDYW52YXNFbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYWN0aXZlVGFiID09PSAnZnJlcXVlbmN5Jykge1xuICAgICAgdGhpcy5yZW5kZXJGcmVxdWVuY3lDaGFydCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN3aXRjaFRhYih0YWI6IE5vdGVWaWV3VGFiLCBjbG91ZFBhbmVsRWw6IEhUTUxEaXZFbGVtZW50LCBmcmVxdWVuY3lQYW5lbEVsOiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xuICAgIHRoaXMuYWN0aXZlVGFiID0gdGFiO1xuICAgIGNvbnN0IHNob3dDbG91ZCA9IHRhYiA9PT0gJ2Nsb3VkJztcblxuICAgIHRoaXMuY2xvdWRUYWJCdXR0b25FbD8udG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScsIHNob3dDbG91ZCk7XG4gICAgdGhpcy5jbG91ZFRhYkJ1dHRvbkVsPy5zZXRBdHRyKCdhcmlhLXNlbGVjdGVkJywgc2hvd0Nsb3VkID8gJ3RydWUnIDogJ2ZhbHNlJyk7XG4gICAgdGhpcy5jbG91ZFRhYkJ1dHRvbkVsPy5zZXRBdHRyKCd0YWJpbmRleCcsIHNob3dDbG91ZCA/ICcwJyA6ICctMScpO1xuXG4gICAgdGhpcy5mcmVxdWVuY3lUYWJCdXR0b25FbD8udG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScsICFzaG93Q2xvdWQpO1xuICAgIHRoaXMuZnJlcXVlbmN5VGFiQnV0dG9uRWw/LnNldEF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCBzaG93Q2xvdWQgPyAnZmFsc2UnIDogJ3RydWUnKTtcbiAgICB0aGlzLmZyZXF1ZW5jeVRhYkJ1dHRvbkVsPy5zZXRBdHRyKCd0YWJpbmRleCcsIHNob3dDbG91ZCA/ICctMScgOiAnMCcpO1xuXG4gICAgY2xvdWRQYW5lbEVsLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnLCBzaG93Q2xvdWQpO1xuICAgIGZyZXF1ZW5jeVBhbmVsRWwudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScsICFzaG93Q2xvdWQpO1xuXG4gICAgaWYgKHNob3dDbG91ZCkge1xuICAgICAgY2xvdWRQYW5lbEVsLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgICBmcmVxdWVuY3lQYW5lbEVsLnNldEF0dHIoJ2hpZGRlbicsICcnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjbG91ZFBhbmVsRWwuc2V0QXR0cignaGlkZGVuJywgJycpO1xuICAgIGZyZXF1ZW5jeVBhbmVsRWwucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlT3BlbkZpbGVPcHRpb25zKHNlbGVjdEVsOiBIVE1MU2VsZWN0RWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IG9wZW5GaWxlcyA9IHRoaXMuc2VydmljZXMuZ2V0T3Blbk1hcmtkb3duRmlsZXMoKTtcbiAgICBjb25zdCBhY3RpdmVGaWxlID0gdGhpcy5zZXJ2aWNlcy5nZXRBY3RpdmVGaWxlKCk7XG5cbiAgICBpZiAoIXRoaXMuc2VsZWN0ZWRGaWxlUGF0aCAmJiBhY3RpdmVGaWxlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZVBhdGggPSBhY3RpdmVGaWxlLnBhdGg7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkRmlsZVBhdGg7XG4gICAgc2VsZWN0RWwuZW1wdHkoKTtcblxuICAgIGlmIChvcGVuRmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBzZWxlY3RFbC5jcmVhdGVFbCgnb3B0aW9uJywgeyB0ZXh0OiAnTm8gb3BlbiBtYXJrZG93biBub3RlcycsIHZhbHVlOiAnJyB9KTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCA9ICcnO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZmlsZSBvZiBvcGVuRmlsZXMpIHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IHNlbGVjdEVsLmNyZWF0ZUVsKCdvcHRpb24nLCB7IHRleHQ6IGZpbGUucGF0aCwgdmFsdWU6IGZpbGUucGF0aCB9KTtcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGZpbGUucGF0aCA9PT0gc2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RlZEZpbGVQYXRoID0gc2VsZWN0RWwudmFsdWU7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVTY29wZUZpbGVQYXRoKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxlUGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRGaWxlUGF0aDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5maWx0ZXJzLnNjb3BlLmFjdGl2ZUZpbGVQYXRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maWx0ZXJzLnNjb3BlLmFjdGl2ZUZpbGVQYXRoO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VzLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyAnJztcbiAgfVxuXG4gIHByaXZhdGUgZmluZFNlbGVjdGVkT3BlbkZpbGUoKTogVEZpbGUgfCBudWxsIHtcbiAgICBjb25zdCBzY29wZUZpbGVQYXRoID0gdGhpcy5yZXNvbHZlU2NvcGVGaWxlUGF0aCgpO1xuICAgIHJldHVybiB0aGlzLnNlcnZpY2VzLmdldE9wZW5NYXJrZG93bkZpbGVzKCkuZmluZCgoZmlsZSkgPT4gZmlsZS5wYXRoID09PSBzY29wZUZpbGVQYXRoKSA/PyBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyByZW5kZXJDbG91ZChjb250YWluZXJFbDogSFRNTERpdkVsZW1lbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBhY3RpdmVOb25jZSA9ICsrdGhpcy5yZW5kZXJOb25jZTtcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuICAgIGNvbnN0IGxvYWRpbmdFbCA9IGNvbnRhaW5lckVsLmNyZWF0ZURpdih7IGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLCB0ZXh0OiAnQnVpbGRpbmcgY2xvdWQuLi4nIH0pO1xuICAgIGNvbnN0IHVwZGF0ZVByb2dyZXNzID0gKG1lc3NhZ2U6IHN0cmluZywgcGVyY2VudDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgICBpZiAoYWN0aXZlTm9uY2UgIT09IHRoaXMucmVuZGVyTm9uY2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbG9hZGluZ0VsLnNldFRleHQoYCR7bWVzc2FnZX0gKCR7cGVyY2VudH0lKWApO1xuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgc2NvcGVGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZVNjb3BlRmlsZVBhdGgoKTtcbiAgICAgIGNvbnN0IHNlbGVjdGVkRmlsZSA9IHRoaXMuZmluZFNlbGVjdGVkT3BlbkZpbGUoKTtcblxuICAgICAgY29uc3Qgd29yZHMgPSBhd2FpdCB0aGlzLnNlcnZpY2VzLmNvbGxlY3RWYXVsdFdvcmRzKHtcbiAgICAgICAgc291cmNlUnVsZXM6IHtcbiAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgLi4udGhpcy5maWx0ZXJzLnNjb3BlLFxuICAgICAgICAgICAgYWN0aXZlRmlsZVBhdGg6IHNjb3BlRmlsZVBhdGgsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBpbmNsdWRlVGFnczogdGhpcy5maWx0ZXJzLmluY2x1ZGVUYWdzLFxuICAgICAgICAgIGV4Y2x1ZGVUYWdzOiB0aGlzLmZpbHRlcnMuZXhjbHVkZVRhZ3MsXG4gICAgICAgICAgdGFnTWF0Y2hNb2RlOiB0aGlzLmZpbHRlcnMudGFnTWF0Y2hNb2RlLFxuICAgICAgICAgIGZyb250bWF0dGVyUnVsZXM6IHRoaXMuZmlsdGVycy5mcm9udG1hdHRlclJ1bGVzLFxuICAgICAgICB9LFxuICAgICAgICBmcmVxdWVuY3k6IHRoaXMuZmlsdGVycy5mcmVxdWVuY3ksXG4gICAgICB9LCB1cGRhdGVQcm9ncmVzcyk7XG5cbiAgICAgIGlmICh3b3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5sYXRlc3RXb3JkcyA9IFtdO1xuICAgICAgICB0aGlzLmxhdGVzdENvbnRleHRMYWJlbCA9IHRoaXMuZmlsdGVycy5zY29wZS5tb2RlID09PSAnYWN0aXZlLWZpbGUnICYmIHNlbGVjdGVkRmlsZVxuICAgICAgICAgID8gc2VsZWN0ZWRGaWxlLmJhc2VuYW1lXG4gICAgICAgICAgOiAnc2VsZWN0ZWQgZmlsdGVycyc7XG4gICAgICAgIHRoaXMuZnJlcXVlbmN5UmVuZGVyZWQgPSBmYWxzZTtcbiAgICAgICAgbG9hZGluZ0VsLnJlbW92ZSgpO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiAndmF1bHQtd29yZC1jbG91ZC1zdGF0ZScsXG4gICAgICAgICAgdGV4dDogdGhpcy5maWx0ZXJzLnNjb3BlLm1vZGUgPT09ICdhY3RpdmUtZmlsZScgJiYgIXNjb3BlRmlsZVBhdGhcbiAgICAgICAgICAgID8gJ09wZW4gYSBtYXJrZG93biBub3RlIGFuZCBzZWxlY3QgaXQgdG8gdmlldyBhIG5vdGUtc3BlY2lmaWMgd29yZCBjbG91ZC4nXG4gICAgICAgICAgICA6ICdObyB3b3JkcyBmb3VuZCBmb3IgdGhlIHNlbGVjdGVkIGZpbHRlcnMuJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlVGFiID09PSAnZnJlcXVlbmN5Jykge1xuICAgICAgICAgIHRoaXMucmVuZGVyRnJlcXVlbmN5Q2hhcnQodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGF0ZXN0V29yZHMgPSB3b3JkcztcbiAgICAgIHRoaXMubGF0ZXN0Q29udGV4dExhYmVsID0gdGhpcy5maWx0ZXJzLnNjb3BlLm1vZGUgPT09ICdhY3RpdmUtZmlsZScgJiYgc2VsZWN0ZWRGaWxlXG4gICAgICAgID8gc2VsZWN0ZWRGaWxlLmJhc2VuYW1lXG4gICAgICAgIDogJ3NlbGVjdGVkIGZpbHRlcnMnO1xuICAgICAgdGhpcy5mcmVxdWVuY3lSZW5kZXJlZCA9IGZhbHNlO1xuXG4gICAgICBhd2FpdCB0aGlzLnNlcnZpY2VzLmRyYXdXb3JkQ2xvdWQoe1xuICAgICAgICBjb250YWluZXJFbCxcbiAgICAgICAgd29yZHMsXG4gICAgICAgIGFyaWFMYWJlbDogdGhpcy5maWx0ZXJzLnNjb3BlLm1vZGUgPT09ICdhY3RpdmUtZmlsZScgJiYgc2VsZWN0ZWRGaWxlXG4gICAgICAgICAgPyBgV29yZCBjbG91ZCBmb3IgJHtzZWxlY3RlZEZpbGUuYmFzZW5hbWV9YFxuICAgICAgICAgIDogJ1dvcmQgY2xvdWQgZm9yIHNlbGVjdGVkIGZpbHRlcnMnLFxuICAgICAgICBvblByb2dyZXNzOiB1cGRhdGVQcm9ncmVzcyxcbiAgICAgICAgb25SZWZyZXNoOiAoKSA9PiB0aGlzLnJlbmRlckNsb3VkKGNvbnRhaW5lckVsKSxcbiAgICAgICAgb25FeGNsdWRlSW5WYXVsdDogYXN5bmMgKHdvcmQpID0+IHtcbiAgICAgICAgICBjb25zdCBhZGRlZCA9IGF3YWl0IHRoaXMuc2VydmljZXMuYWRkQmxhY2tsaXN0V29yZCh3b3JkKTtcbiAgICAgICAgICBuZXcgTm90aWNlKGFkZGVkID8gYEV4Y2x1ZGVkIFwiJHt3b3JkfVwiIGZyb20gd29yZCBjbG91ZHMuYCA6IGBcIiR7d29yZH1cIiBpcyBhbHJlYWR5IGV4Y2x1ZGVkLmApO1xuICAgICAgICAgIGF3YWl0IHRoaXMucmVuZGVyQ2xvdWQoY29udGFpbmVyRWwpO1xuICAgICAgICB9LFxuICAgICAgICBvbldvcmRDbGljazogKHdvcmQpID0+IHtcbiAgICAgICAgICB2b2lkIHRoaXMuc2VydmljZXMub3BlblNlYXJjaEZvcldvcmQod29yZCwge1xuICAgICAgICAgICAgaW5jbHVkZVRhZ3M6IHRoaXMuZmlsdGVycy5pbmNsdWRlVGFncyxcbiAgICAgICAgICAgIGV4Y2x1ZGVUYWdzOiB0aGlzLmZpbHRlcnMuZXhjbHVkZVRhZ3MsXG4gICAgICAgICAgICB0YWdNYXRjaE1vZGU6IHRoaXMuZmlsdGVycy50YWdNYXRjaE1vZGUsXG4gICAgICAgICAgICBmaWxlUGF0aDogdGhpcy5maWx0ZXJzLnNjb3BlLm1vZGUgPT09ICdhY3RpdmUtZmlsZSdcbiAgICAgICAgICAgICAgPyBzY29wZUZpbGVQYXRoXG4gICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChhY3RpdmVOb25jZSAhPT0gdGhpcy5yZW5kZXJOb25jZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxvYWRpbmdFbC5yZW1vdmUoKTtcblxuICAgICAgaWYgKHRoaXMuYWN0aXZlVGFiID09PSAnZnJlcXVlbmN5Jykge1xuICAgICAgICB0aGlzLnJlbmRlckZyZXF1ZW5jeUNoYXJ0KHRydWUpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2FkaW5nRWwucmVtb3ZlKCk7XG4gICAgICBjb25zb2xlLmVycm9yKCdOb3RlIHdvcmQgY2xvdWQ6IGZhaWxlZCB0byByZW5kZXIgY2xvdWQnLCBlcnJvcik7XG4gICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6ICd2YXVsdC13b3JkLWNsb3VkLXN0YXRlJyxcbiAgICAgICAgdGV4dDogJ0NvdWxkIG5vdCByZW5kZXIgdGhlIHdvcmQgY2xvdWQuIE9wZW4gZGV2ZWxvcGVyIGNvbnNvbGUgZm9yIGRldGFpbHMuJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRnJlcXVlbmN5Q2hhcnQoZm9yY2UgPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5mcmVxdWVuY3lDYW52YXNFbCB8fCAoIWZvcmNlICYmIHRoaXMuZnJlcXVlbmN5UmVuZGVyZWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5mcmVxdWVuY3lDYW52YXNFbC5lbXB0eSgpO1xuXG4gICAgaWYgKHRoaXMubGF0ZXN0V29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmZyZXF1ZW5jeUNhbnZhc0VsLmNyZWF0ZURpdih7XG4gICAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLFxuICAgICAgICB0ZXh0OiAnTm8gd29yZHMgZm91bmQgZm9yIHRoZSBzZWxlY3RlZCBmaWx0ZXJzLicsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZnJlcXVlbmN5UmVuZGVyZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRyYXdGcmVxdWVuY3lDaGFydCh7XG4gICAgICBjb250YWluZXJFbDogdGhpcy5mcmVxdWVuY3lDYW52YXNFbCxcbiAgICAgIHdvcmRzOiB0aGlzLmxhdGVzdFdvcmRzLFxuICAgICAgYXJpYUxhYmVsOiBgV29yZCBmcmVxdWVuY3kgY2hhcnQgZm9yICR7dGhpcy5sYXRlc3RDb250ZXh0TGFiZWx9YCxcbiAgICB9KTtcblxuICAgIHRoaXMuZnJlcXVlbmN5UmVuZGVyZWQgPSB0cnVlO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgc2NhbGVCYW5kLCBzY2FsZUxpbmVhciB9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgdHlwZSB7IFdlaWdodGVkV29yZCB9IGZyb20gJy4uL3R5cGVzJztcblxudHlwZSBGcmVxdWVuY3lDaGFydFJlbmRlck9wdGlvbnMgPSB7XG4gIGNvbnRhaW5lckVsOiBIVE1MRGl2RWxlbWVudDtcbiAgd29yZHM6IFdlaWdodGVkV29yZFtdO1xuICBhcmlhTGFiZWw6IHN0cmluZztcbn07XG5cbnR5cGUgU29ydGVkV29yZCA9IHtcbiAgdGV4dDogc3RyaW5nO1xuICBjb3VudDogbnVtYmVyO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdGcmVxdWVuY3lDaGFydChvcHRpb25zOiBGcmVxdWVuY3lDaGFydFJlbmRlck9wdGlvbnMpOiB2b2lkIHtcbiAgY29uc3QgeyBjb250YWluZXJFbCwgd29yZHMsIGFyaWFMYWJlbCB9ID0gb3B0aW9ucztcblxuICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gIGNvbnN0IHNvcnRlZFdvcmRzID0gd29yZHNcbiAgICAubWFwKChlbnRyeSkgPT4gKHsgdGV4dDogZW50cnkudGV4dCwgY291bnQ6IGVudHJ5LmNvdW50IH0pKVxuICAgIC5zb3J0KChhLCBiKSA9PiBiLmNvdW50IC0gYS5jb3VudCB8fCBhLnRleHQubG9jYWxlQ29tcGFyZShiLnRleHQpKTtcblxuICBpZiAoc29ydGVkV29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRGl2KHtcbiAgICAgIGNsczogJ3ZhdWx0LXdvcmQtY2xvdWQtc3RhdGUnLFxuICAgICAgdGV4dDogJ05vIGZyZXF1ZW5jeSBkYXRhIGF2YWlsYWJsZS4nLFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHdpZHRoID0gTWF0aC5tYXgoY29udGFpbmVyRWwuY2xpZW50V2lkdGgsIDMyMCk7XG4gIGNvbnN0IGxvbmdlc3RMYWJlbExlbmd0aCA9IHNvcnRlZFdvcmRzLnJlZHVjZSgobWF4Q2hhcnMsIGVudHJ5KSA9PiB7XG4gICAgcmV0dXJuIE1hdGgubWF4KG1heENoYXJzLCBlbnRyeS50ZXh0Lmxlbmd0aCk7XG4gIH0sIDApO1xuXG4gIGNvbnN0IG1hcmdpbiA9IHtcbiAgICB0b3A6IDgsXG4gICAgcmlnaHQ6IDU2LFxuICAgIGJvdHRvbTogOCxcbiAgICBsZWZ0OiBNYXRoLm1pbigyODAsIE1hdGgubWF4KDEyMCwgTWF0aC5yb3VuZChsb25nZXN0TGFiZWxMZW5ndGggKiA3LjIpKSksXG4gIH07XG5cbiAgY29uc3Qgcm93SGVpZ2h0ID0gMjI7XG4gIGNvbnN0IGNoYXJ0SGVpZ2h0ID0gTWF0aC5tYXgoMTIwLCBzb3J0ZWRXb3Jkcy5sZW5ndGggKiByb3dIZWlnaHQpO1xuICBjb25zdCB0b3RhbEhlaWdodCA9IG1hcmdpbi50b3AgKyBjaGFydEhlaWdodCArIG1hcmdpbi5ib3R0b207XG5cbiAgY29uc3QgeCA9IHNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKFswLCBzb3J0ZWRXb3Jkc1swXT8uY291bnQgPz8gMV0pXG4gICAgLnJhbmdlKFttYXJnaW4ubGVmdCwgd2lkdGggLSBtYXJnaW4ucmlnaHRdKTtcblxuICBjb25zdCB5ID0gc2NhbGVCYW5kPHN0cmluZz4oKVxuICAgIC5kb21haW4oc29ydGVkV29yZHMubWFwKChlbnRyeSkgPT4gZW50cnkudGV4dCkpXG4gICAgLnJhbmdlKFttYXJnaW4udG9wLCBtYXJnaW4udG9wICsgY2hhcnRIZWlnaHRdKVxuICAgIC5wYWRkaW5nSW5uZXIoMC4yKTtcblxuICBjb25zdCBzdmcgPSBzZWxlY3QoY29udGFpbmVyRWwpXG4gICAgLmFwcGVuZCgnc3ZnJylcbiAgICAuYXR0cignY2xhc3MnLCAnbm90ZS13b3JkLWNsb3VkLWZyZXF1ZW5jeS1zdmcnKVxuICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgIC5hdHRyKCdoZWlnaHQnLCB0b3RhbEhlaWdodClcbiAgICAuYXR0cigncm9sZScsICdpbWcnKVxuICAgIC5hdHRyKCdhcmlhLWxhYmVsJywgYXJpYUxhYmVsKVxuICAgIC5zdHlsZSgnZGlzcGxheScsICdibG9jaycpO1xuXG4gIGNvbnN0IHJvd3MgPSBzdmdcbiAgICAuYXBwZW5kKCdnJylcbiAgICAuYXR0cignY2xhc3MnLCAnbm90ZS13b3JkLWNsb3VkLWZyZXF1ZW5jeS1yb3dzJylcbiAgICAuc2VsZWN0QWxsKCdnJylcbiAgICAuZGF0YShzb3J0ZWRXb3JkcylcbiAgICAuam9pbignZycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsIChlbnRyeSkgPT4gYHRyYW5zbGF0ZSgwLCAke3koZW50cnkudGV4dCkgPz8gMH0pYCk7XG5cbiAgcm93c1xuICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgIC5hdHRyKCdjbGFzcycsICdub3RlLXdvcmQtY2xvdWQtZnJlcXVlbmN5LWxhYmVsJylcbiAgICAuYXR0cigneCcsIG1hcmdpbi5sZWZ0IC0gOClcbiAgICAuYXR0cigneScsIE1hdGgubWF4KDAsIHkuYmFuZHdpZHRoKCkgLyAyKSlcbiAgICAuYXR0cigndGV4dC1hbmNob3InLCAnZW5kJylcbiAgICAuYXR0cignZG9taW5hbnQtYmFzZWxpbmUnLCAnbWlkZGxlJylcbiAgICAudGV4dCgoZW50cnkpID0+IGVudHJ5LnRleHQpO1xuXG4gIHJvd3NcbiAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAuYXR0cignY2xhc3MnLCAnbm90ZS13b3JkLWNsb3VkLWZyZXF1ZW5jeS1iYXInKVxuICAgIC5hdHRyKCd4JywgbWFyZ2luLmxlZnQpXG4gICAgLmF0dHIoJ3knLCAwKVxuICAgIC5hdHRyKCdoZWlnaHQnLCBNYXRoLm1heCgxLCB5LmJhbmR3aWR0aCgpKSlcbiAgICAuYXR0cignd2lkdGgnLCAoZW50cnkpID0+IE1hdGgubWF4KDEsIHgoZW50cnkuY291bnQpIC0gbWFyZ2luLmxlZnQpKTtcblxuICByb3dzXG4gICAgLmFwcGVuZCgndGV4dCcpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ25vdGUtd29yZC1jbG91ZC1mcmVxdWVuY3ktdmFsdWUnKVxuICAgIC5hdHRyKCd4JywgKGVudHJ5KSA9PiB4KGVudHJ5LmNvdW50KSArIDYpXG4gICAgLmF0dHIoJ3knLCBNYXRoLm1heCgwLCB5LmJhbmR3aWR0aCgpIC8gMikpXG4gICAgLmF0dHIoJ2RvbWluYW50LWJhc2VsaW5lJywgJ21pZGRsZScpXG4gICAgLnRleHQoKGVudHJ5KSA9PiBTdHJpbmcoZW50cnkuY291bnQpKTtcblxuICBjb250YWluZXJFbC5jcmVhdGVEaXYoe1xuICAgIGNsczogJ25vdGUtd29yZC1jbG91ZC1mcmVxdWVuY3ktc3VtbWFyeScsXG4gICAgdGV4dDogYCR7c29ydGVkV29yZHMubGVuZ3RofSB3b3Jkcywgc29ydGVkIGJ5IGZyZXF1ZW5jeWAsXG4gIH0pO1xufVxuIiwgImltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgcmVnaXN0ZXJFbWJlZGRlZFdvcmRDbG91ZFByb2Nlc3NvciB9IGZyb20gJy4vYmxvY2tzL3dvcmRjbG91ZC1ibG9jayc7XG5pbXBvcnQgeyBWSUVXX1RZUEVfTk9URV9XT1JEX0NMT1VELCBWSUVXX1RZUEVfVkFVTFRfV09SRF9DTE9VRCB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgdHlwZSB7IERlcHMgfSBmcm9tICcuLi9kZXBzJztcbmltcG9ydCB7IFZhdWx0V29yZENsb3VkVmlldyB9IGZyb20gJy4vZG9jdW1lbnQtd29yZC1jbG91ZC12aWV3JztcbmltcG9ydCB7IE5vdGVXb3JkQ2xvdWRWaWV3IH0gZnJvbSAnLi9zaWRlYmFyLXdvcmQtY2xvdWQtdmlldyc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlclZpZXdzKHBsdWdpbjogUGx1Z2luLCBkZXBzOiBEZXBzKTogdm9pZCB7XG4gIHBsdWdpbi5yZWdpc3RlclZpZXcoVklFV19UWVBFX1ZBVUxUX1dPUkRfQ0xPVUQsIChsZWFmKSA9PiBuZXcgVmF1bHRXb3JkQ2xvdWRWaWV3KGxlYWYsIGRlcHMuc2VydmljZXMud29yZENsb3VkKSk7XG4gIHBsdWdpbi5yZWdpc3RlclZpZXcoVklFV19UWVBFX05PVEVfV09SRF9DTE9VRCwgKGxlYWYpID0+IG5ldyBOb3RlV29yZENsb3VkVmlldyhsZWFmLCBkZXBzLnNlcnZpY2VzLndvcmRDbG91ZCkpO1xuICByZWdpc3RlckVtYmVkZGVkV29yZENsb3VkUHJvY2Vzc29yKHBsdWdpbiwgZGVwcy5zZXJ2aWNlcy53b3JkQ2xvdWQpO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQSxnRkFBQUEsU0FBQTtBQUNBLEtBQUMsU0FBVSxRQUFRLFNBQVM7QUFDNUIsYUFBTyxZQUFZLFlBQVksT0FBT0EsWUFBVyxjQUFjLFFBQVEsT0FBTyxJQUM5RSxPQUFPLFdBQVcsY0FBYyxPQUFPLE1BQU0sT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLEtBQ3ZFLFNBQVMsVUFBVSxNQUFNLFFBQVEsT0FBTyxLQUFLLE9BQU8sTUFBTSxDQUFDLENBQUM7QUFBQSxJQUM3RCxHQUFFLFNBQU0sU0FBVUMsVUFBUztBQUFFO0FBRTdCLFVBQUksT0FBTyxFQUFDLE9BQU8sV0FBVztBQUFBLE1BQUMsRUFBQztBQUVoQyxlQUFTLFdBQVc7QUFDbEIsaUJBQVMsSUFBSSxHQUFHLElBQUksVUFBVSxRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUMzRCxjQUFJLEVBQUUsSUFBSSxVQUFVLENBQUMsSUFBSSxPQUFRLEtBQUssS0FBTSxRQUFRLEtBQUssQ0FBQztBQUFHLGtCQUFNLElBQUksTUFBTSxtQkFBbUIsQ0FBQztBQUNqRyxZQUFFLENBQUMsSUFBSSxDQUFDO0FBQUEsUUFDVjtBQUNBLGVBQU8sSUFBSSxTQUFTLENBQUM7QUFBQSxNQUN2QjtBQUVBLGVBQVMsU0FBUyxHQUFHO0FBQ25CLGFBQUssSUFBSTtBQUFBLE1BQ1g7QUFFQSxlQUFTQyxnQkFBZSxXQUFXLE9BQU87QUFDeEMsZUFBTyxVQUFVLEtBQUssRUFBRSxNQUFNLE9BQU8sRUFBRSxJQUFJLFNBQVMsR0FBRztBQUNyRCxjQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUUsUUFBUSxHQUFHO0FBQ2hDLGNBQUks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QU0sS0FBSyxTQUFTLFNBQVMsQ0FBQztBQUM3RyxxQ0FBbUMsUUFBUSxLQUFLLFNBQVMsU0FBUztBQUNwRTs7O0E1SURBLElBQXFCLHVCQUFyQixjQUFrRCx5QkFBTztBQUFBLEVBQXpEO0FBQUE7QUFDRSxTQUFRLE9BQW9CO0FBQzVCLFNBQWlCLFdBQVcsSUFBSSxTQUFTO0FBQUE7QUFBQSxFQUV6QyxNQUFNLFNBQXdCO0FBQzVCLFFBQUk7QUFDRixZQUFNLE9BQU8sTUFBTSxLQUFLLHVCQUF1QjtBQUMvQyxXQUFLLDBCQUEwQixJQUFJO0FBQ25DLFdBQUssaUJBQWlCLElBQUk7QUFBQSxJQUM1QixTQUFTLE9BQU87QUFDZCxXQUFLLFNBQVMsV0FBVztBQUN6QixXQUFLLE9BQU87QUFDWixZQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLFdBQWlCO0FBQ2YsU0FBSyxTQUFTLFdBQVc7QUFDekIsU0FBSyxPQUFPO0FBQUEsRUFDZDtBQUFBLEVBRUEsTUFBYyx5QkFBd0M7QUFDcEQsVUFBTSxPQUFPLE1BQU0sV0FBVyxJQUFJO0FBQ2xDLFNBQUssT0FBTztBQUNaLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFUSwwQkFBMEIsTUFBa0I7QUFDbEQsa0JBQWMsTUFBTSxJQUFJO0FBQ3hCLHFCQUFpQixNQUFNLElBQUk7QUFDM0IsbUJBQWUsTUFBTSxJQUFJO0FBQ3pCLGVBQVcsSUFBSTtBQUNmLHFCQUFpQixNQUFNLElBQUk7QUFBQSxFQUM3QjtBQUFBLEVBRVEsaUJBQWlCLE1BQWtCO0FBQ3pDLFNBQUssU0FBUyxJQUFJLEtBQUssT0FBTztBQUFBLEVBQ2hDO0FBQ0Y7IiwKICAibmFtZXMiOiBbIm1vZHVsZSIsICJleHBvcnRzIiwgInBhcnNlVHlwZW5hbWVzIiwgImNvcHkiLCAibW9kdWxlIiwgImkiLCAiY2FudmFzIiwgInciLCAiaCIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJrZXkiLCAidGlja3MiLCAicmFuZ2UiLCAicmFuZ2UiLCAicmFuZ2UiLCAiZm9ybWF0IiwgImNvbG9yIiwgInJnYiIsICJ6ZXJvIiwgImkiLCAibnVtYmVyIiwgInJhbmdlIiwgImkiLCAibnVtYmVyIiwgImxvY2FsZSIsICJ6ZXJvIiwgImZvcm1hdCIsICJmb3JtYXRQcmVmaXgiLCAidmFsdWUiLCAibGluZWFyIiwgImRvY3VtZW50IiwgImRhdHVtIiwgImNvbnN0YW50X2RlZmF1bHQiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJzZWxlY3Rpb24iLCAiYXNjZW5kaW5nIiwgIndpbmRvdyIsICJzZWxlY3RfZGVmYXVsdCIsICJpbXBvcnRfb2JzaWRpYW4iLCAic2VsZWN0X2RlZmF1bHQiLCAiY29sb3IiLCAibGF5b3V0V29yZHMiLCAiZm9ybWF0IiwgInJvb3QiLCAibGluZWFyIiwgImRvY3VtZW50IiwgImRvY3VtZW50IiwgIm1hdGNoZXNGcm9udG1hdHRlclJ1bGVzIiwgImNvbnRhaW5zVmFsdWUiLCAiY29tcGFyZVNjYWxhciIsICJ0cnlQYXJzZU51bWJlciIsICJ0cnlQYXJzZURhdGUiLCAidHJ5UGFyc2VCb29sZWFuIiwgImRvY3VtZW50IiwgImNyZWF0ZVRocm90dGxlZFByb2dyZXNzIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiRlJPTlRNQVRURVJfT1BFUkFUT1JTIiwgInBhcnNlVGFnTGlzdCIsICJwYXJzZUxpc3QiLCAicGFyc2VGcm9udG1hdHRlclJ1bGVzIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImxpbmVhciIsICJzZWxlY3RfZGVmYXVsdCJdCn0K
