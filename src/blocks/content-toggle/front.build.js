"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var convertToPixels = function convertToPixels(amount, unit) {
  return unit === "%" ? amount / 100 * window.innerWidth : amount;
};
var togglePanel = function togglePanel(target) {
  var topPadding = 0,
    bottomPadding = 0;
  var indicator = target.querySelector(".wp-block-ub-content-toggle-accordion-state-indicator");
  var panelContent = target.nextElementSibling;
  var toggleContainer = target.closest(".wp-block-ub-content-toggle");
  if (panelContent.classList.contains("ub-hide")) {
    var computedStyles = getComputedStyle(panelContent);
    var topPaddingUnit = computedStyles.paddingTop.match(/[^\d.]+/)[0];
    var bottomPaddingUnit = computedStyles.paddingBottom.match(/[^\d.]+/)[0];
    topPadding = convertToPixels(parseFloat(computedStyles.paddingTop), topPaddingUnit);
    bottomPadding = convertToPixels(parseFloat(computedStyles.paddingBottom), bottomPaddingUnit);
    panelContent.classList.remove("ub-hide");
    panelContent.classList.add("ub-hiding");
    if (toggleContainer.dataset.showonlyone === "true") {
      _toConsumableArray(toggleContainer.children).forEach(function (child) {
        var siblingToggle = child.querySelector(".wp-block-ub-content-toggle-accordion-title-wrap");
        if (siblingToggle !== target) {
          var siblingContent = siblingToggle.nextElementSibling;
          var siblingIndicator = siblingToggle.querySelector(".wp-block-ub-content-toggle-accordion-state-indicator");
          if (!siblingContent.classList.contains("ub-hide")) {
            if (siblingIndicator) siblingIndicator.classList.remove("open");
            siblingContent.classList.add("ub-toggle-transition");
            siblingContent.style.height = "".concat(siblingContent.scrollHeight, "px");
            setTimeout(function () {
              siblingContent.classList.add("ub-hiding");
              siblingContent.style.height = "";
            }, 20);
          }
        }
      });
    }
  } else {
    panelContent.style.height = getComputedStyle(panelContent).height;
  }
  panelContent.classList.add("ub-toggle-transition");
  if (indicator) indicator.classList.toggle("open");
  setTimeout(function () {
    if (panelContent.classList.contains("ub-hiding")) {
      panelContent.style.height = "".concat(panelContent.scrollHeight + topPadding + bottomPadding, "px");
      panelContent.style.paddingTop = "".concat(topPadding, "px");
      panelContent.style.paddingBottom = "".concat(bottomPadding, "px");
      document.querySelectorAll(".ub_image_slider").forEach(function (slider) {
        new Swiper("#".concat(slider.id), JSON.parse(slider.dataset.swiperData));
      });
      setTimeout(function () {
        return window.dispatchEvent(new Event("resize"));
      }, 100);
    } else {
      panelContent.classList.add("ub-hiding");
      panelContent.style.height = "";
    }
  }, 20);
  panelContent.addEventListener("transitionend", function () {
    panelContent.classList.remove("ub-toggle-transition");
    panelContent.setAttribute("aria-expanded", panelContent.offsetHeight !== 0);
    if (panelContent.offsetHeight === 0) {
      panelContent.classList.add("ub-hide");
    } else {
      panelContent.removeAttribute("style");
    }
    panelContent.classList.remove("ub-hiding");
  });
  panelContent.querySelectorAll(".wp-block-embed iframe").forEach(function (embeddedContent) {
    embeddedContent.style.removeProperty("width");
    embeddedContent.style.removeProperty("height");
  });
};
var handleKeyDown = function handleKeyDown(e, i, toggleHeads) {
  var key = e.key;
  if (key === "ArrowUp" && i > 0) {
    e.preventDefault();
    toggleHeads[i - 1].focus();
  } else if (key === "ArrowDown" && i < toggleHeads.length - 1) {
    e.preventDefault();
    toggleHeads[i + 1].focus();
  } else if ([" ", "Enter"].includes(key)) {
    e.preventDefault();
    togglePanel(e.currentTarget);
  } else if (key === "Home" && i > 0) {
    e.preventDefault();
    toggleHeads[0].focus();
  } else if (key === "End" && i < toggleHeads.length - 1) {
    e.preventDefault();
    toggleHeads[toggleHeads.length - 1].focus();
  }
};
var attachTogglePanelEvents = function attachTogglePanelEvents(toggleContainer) {
  var toggleHeads = Array.from(toggleContainer.children).map(function (toggle) {
    return toggle.children[0];
  }).filter(function (toggle) {
    return toggle && toggle.classList.contains("wp-block-ub-content-toggle-accordion-title-wrap");
  });
  toggleHeads.forEach(function (toggleHead, i) {
    toggleHead.removeEventListener("keydown", handleKeyDown);
    toggleHead.addEventListener("keydown", function (e) {
      return handleKeyDown(e, i, toggleHeads);
    });
    toggleHead.removeEventListener("click", togglePanel);
    toggleHead.addEventListener("click", function (e) {
      e.stopImmediatePropagation();
      togglePanel(toggleHead);
    });
  });
};
var initTogglePanels = function initTogglePanels() {
  document.querySelectorAll(".wp-block-ub-content-toggle").forEach(function (toggleContainer) {
    if (window.innerWidth < 700 && JSON.parse(toggleContainer.dataset.mobilecollapse)) {
      _toConsumableArray(toggleContainer.children).forEach(function (child) {
        var panel = child.children[0].nextElementSibling;
        if (!panel.classList.contains("ub-hide")) {
          togglePanel(child.children[0]);
        }
      });
    }
    attachTogglePanelEvents(toggleContainer);
  });
};
document.addEventListener("DOMContentLoaded", function () {
  initTogglePanels();
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        var addedNodes = _toConsumableArray(mutation.addedNodes);
        addedNodes.forEach(function (node) {
          var _node$classList;
          if ((_node$classList = node.classList) !== null && _node$classList !== void 0 && _node$classList.contains("wp-block-ub-content-toggle")) {
            attachTogglePanelEvents(node);
          }
        });
      }
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});