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

function ub_hashHeaderScroll() {
  var scrollType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "auto";
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (window.location.hash) {
    var targetHeading = document.getElementById(window.location.hash.slice(1));
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
    var deficit = targetHeading.getBoundingClientRect().y || targetHeading.getBoundingClientRect().top;

    switch (scrollType) {
      default:
        window.scrollBy(0, deficit);
        break;

      case "off":
        window.scrollBy(0, deficit);
        break;

      case "auto":
        window.scrollBy(0, deficit - (stickyHeaders.length ? Math.max.apply(Math, stickyHeaderHeights) : 0));
        break;

      case "fixedamount":
        window.scrollBy(0, deficit - offset);
        break;

      case "namedelement":
        window.scrollBy(0, deficit - document.querySelector(target) ? document.querySelector(target).offsetHeight : 0);
        break;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var instances = [];

  if (document.getElementById("ub_table-of-contents-toggle-link")) {
    instances.push(document.getElementById("ub_table-of-contents-toggle-link"));
  } else {
    instances = Array.prototype.slice.call(document.getElementsByClassName("ub_table-of-contents-toggle-link"));
  }

  instances.forEach(function (instance) {
    var block = instance.closest(".ub_table-of-contents");
    var tocContainer = block.querySelector(".ub_table-of-contents-container");
    var containerStyle = tocContainer.style;
    var tocMain = tocContainer.parentNode;
    var mainStyle = tocMain.style;
    var showButton = block.getAttribute("data-showtext") || "show";
    var hideButton = block.getAttribute("data-hidetext") || "hide";
    tocContainer.removeAttribute("style");
    instance.addEventListener("click", function (event) {
      event.preventDefault();
      var curWidth = tocMain.offsetWidth;

      if (tocMain.classList.contains("ub_table-of-contents-collapsed")) {
        //begin showing
        tocContainer.classList.remove("ub-hide");
        var targetHeight = tocContainer.scrollHeight;
        tocContainer.classList.add("ub-hiding");
        mainStyle.width = "".concat(curWidth, "px");
        setTimeout(function () {
          tocMain.classList.remove("ub_table-of-contents-collapsed");
          Object.assign(containerStyle, {
            height: "".concat(targetHeight, "px"),
            width: "100px"
          });
          tocContainer.classList.remove("ub-hiding");
          mainStyle.width = "100%";
        }, 50);
      } else {
        //begin hiding
        mainStyle.width = "".concat(tocMain.offsetWidth, "px");
        Object.assign(containerStyle, {
          height: "".concat(tocContainer.offsetWidth, "px"),
          width: "".concat(tocContainer.offsetHeight, "px")
        });
        setTimeout(function () {
          tocContainer.classList.add("ub-hiding");
          Object.assign(containerStyle, {
            height: "0",
            width: "0"
          });
          tocMain.classList.add("ub_table-of-contents-collapsed"); //measure width of toc title + toggle button, then use it as width of tocMain

          var mainComputedStyle = getComputedStyle(tocMain);
          mainStyle.width = "".concat(parseInt(mainComputedStyle.paddingLeft.slice(0, -2)) + parseInt(mainComputedStyle.paddingRight.slice(0, -2)) + instance.closest(".ub_table-of-contents-header").scrollWidth, "px");
        }, 50);
      }

      instance.innerHTML = tocContainer.classList.contains("ub-hiding") ? hideButton : showButton;
    });
    tocContainer.addEventListener("transitionend", function () {
      if (tocContainer.offsetHeight === 0) {
        //hiding is done
        tocContainer.classList.remove("ub-hiding");
        tocContainer.classList.add("ub-hide");

        if (containerStyle.display === "block") {
          containerStyle.display = "";
        }

        mainStyle.minWidth = "";
      }

      Object.assign(containerStyle, {
        height: "",
        width: ""
      });
      mainStyle.width = "";
    });
  });

  if (window.location.hash) {
    var sourceToC = document.querySelector(".ub_table-of-contents");
    var type = sourceToC.dataset.scrolltype;
    var offset = type === "fixedamount" ? sourceToC.dataset.scrollamount : 0;
    var target = type === "namedelement" ? sourceToC.dataset.scrolltarget : "";
    setTimeout(function () {
      return ub_hashHeaderScroll(type, target, offset);
    }, 50);
  }
});

window.onhashchange = function () {
  var sourceToC = document.querySelector(".ub_table-of-contents");
  var type = sourceToC.dataset.scrolltype;
  var offset = type === "fixedamount" ? sourceToC.dataset.scrollamount : 0;
  var target = type === "namedelement" ? sourceToC.dataset.scrolltarget : "";
  ub_hashHeaderScroll(type, target, offset);
};

Array.prototype.slice.call(document.querySelectorAll(".ub_table-of-contents-container li > a")).forEach(function (link) {
  link.addEventListener("click", function (e) {
    var hashlessLink = link.href.replace(link.hash, "");
    var targetPageNumber = /[?&]page=\d+/g.exec(hashlessLink);
    var currentPageNumber = /[?&]page=\d+/g.exec(window.location.search);

    if (window.location.href.includes(hashlessLink) && (currentPageNumber === null || targetPageNumber && currentPageNumber[0] === targetPageNumber[0])) {
      var tocData = link.closest(".ub_table-of-contents").dataset;
      var type = tocData.scrolltype;
      var offset = type === "fixedamount" ? tocData.scrollamount : 0;
      var target = type === "namedelement" ? tocData.scrolltarget : "";
      e.preventDefault();
      history.pushState(null, "", link.hash);
      ub_hashHeaderScroll(type, target, offset);
    }
  });
});