"use strict";

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
function ub_getSiblings(element, criteria) {
  var children = Array.prototype.slice.call(element.parentNode.children).filter(function (child) {
    return child !== element;
  });
  return criteria ? children.filter(criteria) : children;
}
Array.prototype.slice.call(document.getElementsByClassName("ub-expand-toggle-button")).forEach(function (instance) {
  if (instance.getAttribute("aria-controls") === "") {
    var blockID = instance.parentElement.parentElement.id.slice(10);
    instance.setAttribute("aria-controls", "ub-expand-full-".concat(blockID));
    if (instance.parentElement.classList.contains("ub-expand-full")) {
      instance.parentElement.setAttribute("id", "ub-expand-full-".concat(blockID));
    }
  }
  var togglePanel = function togglePanel(e) {
    var blockRoot = instance.closest(".ub-expand");
    blockRoot.querySelector(".ub-expand-partial .ub-expand-toggle-button").classList.toggle("ub-hide");
    var expandingPart = Array.prototype.slice.call(blockRoot.children).filter(function (child) {
      return child.classList.contains("ub-expand-full");
    })[0];
    expandingPart.classList.toggle("ub-hide");
    if (expandingPart.classList.contains("ub-hide")) {
      var expandRoot = e.target.parentElement.parentElement;
      var rootPosition = expandRoot.getBoundingClientRect().top;
      var expandScrollData = expandRoot.dataset;
      if (rootPosition < 0) {
        if ("scrollType" in expandScrollData) {
          var scrollType = expandScrollData.scrollType;
          var offset = scrollType === "fixedamount" ? expandScrollData.scrollAmount : 0;
          var target = scrollType === "namedelement" ? expandScrollData.scrollTarget : "";
          switch (scrollType) {
            case "auto":
              var probableHeaders;
              try {
                probableHeaders = document.elementsFromPoint(window.innerWidth / 2, 0);
              } catch (e) {
                probableHeaders = document.msElementsFromPoint(window.innerWidth / 2, 0);
              }
              var stickyHeaders = Array.prototype.slice.call(probableHeaders).filter(function (e) {
                return ["fixed", "sticky"].includes(window.getComputedStyle(e).position);
              });
              var stickyHeaderHeights = stickyHeaders.map(function (h) {
                return h.offsetHeight;
              });
              window.scrollBy(0, rootPosition - (stickyHeaders.length ? Math.max.apply(Math, stickyHeaderHeights) : 0));
              break;
            case "fixedamount":
              window.scrollBy(0, rootPosition - offset);
              break;
            case "namedelement":
              window.scrollBy(0, rootPosition - (document.querySelector(target) ? document.querySelector(target).offsetHeight : 0));
              break;
            default:
              window.scrollBy(0, rootPosition);
          }
        } else {
          window.scrollBy(0, expandRoot.getBoundingClientRect().rootPosition);
        }
      }
    } else {
      Array.prototype.slice.call(document.getElementsByClassName("ub_image_slider")).forEach(function (slider) {
        var swiper = new Swiper("#".concat(slider.id), JSON.parse(slider.dataset.swiperData));
      });
      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    }
    Array.prototype.slice.call(expandingPart.querySelectorAll(".wp-block-embed iframe")).forEach(function (embeddedContent) {
      embeddedContent.style.removeProperty("width");
      embeddedContent.style.removeProperty("height");
    });
  };
  instance.addEventListener("click", togglePanel);
  instance.addEventListener("keydown", function (e) {
    if ([" ", "Enter"].indexOf(e.key) > -1) {
      e.preventDefault();
      togglePanel();
      Array.prototype.slice.call(instance.parentElement.parentElement.children).filter(function (a) {
        return a !== instance.parentElement;
      })[0].querySelector("[aria-controls=\"".concat(instance.getAttribute("aria-controls"), "\"]")).focus();
    }
  });
});