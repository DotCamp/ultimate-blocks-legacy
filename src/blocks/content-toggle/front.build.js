"use strict";

var convertToPixels = function convertToPixels(amount, unit) {
  return unit === "%" ? amount / 100 * window.innerWidth : amount;
};
var togglePanel = function togglePanel(target) {
  var topPadding = 0,
    topPaddingUnit = "",
    bottomPadding = 0,
    bottomPaddingUnit = "";
  var indicator = target.querySelector(".wp-block-ub-content-toggle-accordion-state-indicator");
  var panelContent = target.nextElementSibling;
  var toggleContainer = target.parentElement.parentElement;
  if (panelContent.classList.contains("ub-hide")) {
    var _getComputedStyle = getComputedStyle(panelContent),
      paddingTop = _getComputedStyle.paddingTop,
      paddingBottom = _getComputedStyle.paddingBottom;
    var topPaddingMatch = /[^\d.]/g.exec(paddingTop);
    var bottomPaddingMatch = /[^\d.]/g.exec(paddingBottom);
    topPadding = parseFloat(paddingTop.slice(0, topPaddingMatch.index));
    topPaddingUnit = paddingTop.slice(topPaddingMatch.index);
    bottomPadding = parseFloat(paddingBottom.slice(0, bottomPaddingMatch.index));
    bottomPaddingUnit = paddingBottom.slice(bottomPaddingMatch.index);
    panelContent.classList.remove("ub-hide");
    panelContent.classList.add("ub-hiding");
    if ("showonlyone" in toggleContainer.dataset && toggleContainer.dataset.showonlyone) {
      Array.from(toggleContainer.children).map(function (p) {
        return p.children[0];
      }).filter(function (p) {
        return p !== target;
      }).forEach(function (siblingToggle) {
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
      });
    }
  } else {
    panelContent.style.height = getComputedStyle(panelContent).height;
  }
  panelContent.classList.add("ub-toggle-transition");
  if (indicator) indicator.classList.toggle("open");
  setTimeout(function () {
    if (panelContent.classList.contains("ub-hiding")) {
      var convertedTop = convertToPixels(topPadding, topPaddingUnit);
      var convertedBottom = convertToPixels(bottomPadding, bottomPaddingUnit);
      panelContent.style.height = "".concat(panelContent.scrollHeight + convertedTop + convertedBottom - (topPaddingUnit === "%" || bottomPaddingUnit === "%" ? panelContent.parentElement.scrollHeight : 0), "px");
      Object.assign(panelContent.style, {
        paddingTop: "".concat(convertedTop, "px"),
        paddingBottom: "".concat(convertedBottom, "px")
      });
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
var attachTogglePanelEvents = function attachTogglePanelEvents() {
  document.querySelectorAll(".wp-block-ub-content-toggle").forEach(function (toggleContainer) {
    var toggleHeads = Array.from(toggleContainer.children).map(function (toggle) {
      return toggle.children[0];
    }).filter(function (toggle) {
      return toggle && toggle.classList.contains("wp-block-ub-content-toggle-accordion-title-wrap");
    });
    toggleHeads.forEach(function (toggleHead, i) {
      toggleHead.addEventListener("keydown", function (e) {
        if (e.key === "ArrowUp" && i > 0) e.preventDefault(), toggleHeads[i - 1].focus();
        if (e.key === "ArrowDown" && i < toggleHeads.length - 1) e.preventDefault(), toggleHeads[i + 1].focus();
        if ([" ", "Enter"].includes(e.key)) e.preventDefault(), togglePanel(toggleHead);
        if (e.key === "Home" && i > 0) e.preventDefault(), toggleHeads[0].focus();
        if (e.key === "End" && i < toggleHeads.length - 1) e.preventDefault(), toggleHeads[toggleHeads.length - 1].focus();
      });
    });
    if (!toggleContainer.hasAttribute("data-preventcollapse")) {
      var parentIsHidden = false,
        parentClassIsHidden = false;
      var targetElement = toggleContainer;
      while (!(parentIsHidden || parentClassIsHidden) && targetElement.parentElement.tagName !== "BODY") {
        targetElement = targetElement.parentElement;
        if (targetElement.style.display === "none") parentIsHidden = true;
        if (getComputedStyle(targetElement).display === "none") parentClassIsHidden = true;
      }
      if (parentClassIsHidden || parentIsHidden) {
        toggleContainer.parentElement.style.setProperty("display", "block", "important");
      }
      Array.from(toggleContainer.children).map(function (p) {
        return p.children[0];
      }).filter(function (toggle) {
        return toggle && toggle.classList.contains("wp-block-ub-content-toggle-accordion-title-wrap");
      }).forEach(function (instance) {
        var panelContent = instance.nextElementSibling;
        var panelId = instance.parentElement.getAttribute("id");
        var hash = location.hash.substring(1);
        if (panelId && panelId === hash) togglePanel(instance);
        instance.addEventListener("click", function (e) {
          e.stopImmediatePropagation();
          togglePanel(instance);
        });
      });
      if (parentIsHidden) {
        toggleContainer.parentElement.style.display = "none";
      }
      if (parentClassIsHidden) {
        toggleContainer.parentElement.style.display = "";
      }
    }
  });
};
document.addEventListener("DOMContentLoaded", function () {
  attachTogglePanelEvents();
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        attachTogglePanelEvents();
      }
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  document.querySelectorAll(".wp-block-ub-content-toggle").forEach(function (toggleContainer) {
    if (window.innerWidth < 700 && JSON.parse(toggleContainer.dataset.mobilecollapse)) {
      Array.from(toggleContainer.children).forEach(function (child) {
        var panel = child.children[0].nextElementSibling;
        if (!panel.classList.contains("ub-hide")) {
          togglePanel(child.children[0]);
        }
      });
    }
  });
});