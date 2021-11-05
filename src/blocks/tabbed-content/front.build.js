"use strict";

/* eslint-disable */
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

function ub_getNodeindex(elem) {
  return Array.prototype.slice.call(elem.parentNode.children).indexOf(elem);
}

function ub_handleTabEvent(tab) {
  var parent = tab.closest(".wp-block-ub-tabbed-content-holder");
  var isVertical = parent.classList.contains("vertical-holder");
  var activeStyle = parent.querySelector(".wp-block-ub-tabbed-content-tab-title-".concat(isVertical ? "vertical-" : "", "wrap.active")).getAttribute("style");
  var defaultStyle = parent.querySelector(".wp-block-ub-tabbed-content-tab-title-".concat(isVertical ? "vertical-" : "", "wrap:not(.active)")).getAttribute("style");
  ub_getSiblings(tab, function (elem) {
    return elem.classList.contains("wp-block-ub-tabbed-content-tab-title-".concat(isVertical ? "vertical-" : "", "wrap"));
  }).forEach(function (sibling) {
    if (sibling.tabIndex === 0) {
      sibling.setAttribute("tabindex", -1);
    }

    sibling.classList.remove("active");
    sibling.setAttribute("aria-selected", false);

    if (defaultStyle) {
      sibling.setAttribute("style", defaultStyle);
    }
  });
  tab.setAttribute("aria-selected", true);
  tab.classList.add("active");
  parent.dataset.activeTabs = JSON.stringify([parseInt(tab.id.match(/-\d+$/g)[0].slice(1))]);
  tab.setAttribute("tabindex", 0);

  var _tab$parentElement$ge = tab.parentElement.getBoundingClientRect(),
      tabContainerWidth = _tab$parentElement$ge.width;

  var tabContainerLocation = tab.parentElement.getBoundingClientRect().x || tab.parentElement.getBoundingClientRect().left;

  var _tab$getBoundingClien = tab.getBoundingClientRect(),
      tabWidth = _tab$getBoundingClien.width;

  var tabLocation = tab.getBoundingClientRect().x || tab.getBoundingClientRect().left;

  if (tabContainerLocation > tabLocation) {
    tab.parentElement.scrollLeft -= tabContainerLocation - tabLocation;
  }

  if (tabLocation + tabWidth > tabContainerLocation + tabContainerWidth) {
    var scrollLeftChange = tabLocation - tabContainerLocation;

    if (tabWidth <= tabContainerWidth) {
      scrollLeftChange += tabWidth - tabContainerWidth;
    }

    tab.parentElement.scrollLeft += scrollLeftChange;
  }

  if (activeStyle) tab.setAttribute("style", activeStyle);
  var tabContentContainer = Array.prototype.slice.call(parent.children).filter(function (elem) {
    return elem.classList.contains("wp-block-ub-tabbed-content-tabs-content");
  })[0];
  Array.prototype.slice.call(tabContentContainer.children).filter(function (child) {
    return child.classList.contains("wp-block-ub-tabbed-content-tab-content-wrap");
  }).forEach(function (tabContent, i) {
    if (ub_getNodeindex(tab) === i) {
      tabContent.classList.add("active");
      tabContent.classList.remove("ub-hide");
      Array.prototype.slice.call(document.getElementsByClassName("ub_image_slider")).forEach(function (slider) {
        var swiper = new Swiper("#".concat(slider.id), JSON.parse(slider.dataset.swiperData));
      });
      Array.prototype.slice.call(tabContent.querySelectorAll(".wp-block-embed iframe")).forEach(function (embeddedContent) {
        embeddedContent.style.removeProperty("width");
        embeddedContent.style.removeProperty("height");
      });
    } else {
      tabContent.classList.remove("active");
      tabContent.classList.add("ub-hide");
    }
  });
  Array.prototype.slice.call(tabContentContainer.children).filter(function (child) {
    return child.classList.contains("wp-block-ub-tabbed-content-accordion-toggle");
  }).forEach(function (accordionToggle) {
    if (ub_getNodeindex(accordionToggle) / 2 === ub_getNodeindex(tab)) {
      accordionToggle.classList.add("active");
    } else {
      accordionToggle.classList.remove("active");
    }
  });
}

function ub_checkPrevTab(event) {
  event.preventDefault();

  if (event.target.previousElementSibling) {
    event.target.setAttribute("tabindex", -1);
    event.target.previousElementSibling.focus();
  } else {
    ub_focusOnLastTab(event);
  }
}

function ub_checkNextTab(event) {
  event.preventDefault();

  if (event.target.nextElementSibling) {
    event.target.setAttribute("tabindex", -1);
    event.target.nextElementSibling.focus();
  } else {
    ub_focusOnFirstTab(event);
  }
}

function ub_focusOnFirstTab(event) {
  event.preventDefault();
  event.target.setAttribute("tabindex", -1);
  event.target.parentElement.children[0].focus();
}

function ub_focusOnLastTab(event) {
  event.preventDefault();
  event.target.setAttribute("tabindex", -1);
  var tabs = event.target.parentElement.children;
  tabs[tabs.length - 1].focus();
}

function ub_commonKeyPress(event) {
  if (event.key === "Home") {
    ub_focusOnFirstTab(event);
  } else if (event.key === "End") {
    ub_focusOnLastTab(event);
  }
}

function ub_upDownPress(event) {
  if (event.key === "ArrowUp") {
    ub_checkPrevTab(event);
  } else if (event.key === "ArrowDown") {
    ub_checkNextTab(event);
  } else {
    ub_commonKeyPress(event);
  }
}

function ub_leftRightPress(event) {
  if (event.key === "ArrowLeft") {
    ub_checkPrevTab(event);
  } else if (event.key === "ArrowRight") {
    ub_checkNextTab(event);
  } else {
    ub_commonKeyPress(event);
  }
}

Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content-tab-title-wrap")).forEach(function (instance) {
  instance.addEventListener("focus", function () {
    ub_handleTabEvent(instance);
  });
  var tabBar = instance.parentElement;
  var tabBarIsBeingDragged = false;
  var oldScrollPosition = -1;
  var oldMousePosition = -1;
  var tabBarLocation = tabBar.getBoundingClientRect().x || tabBar.getBoundingClientRect().left;
  tabBar.addEventListener("mousedown", function (e) {
    tabBarIsBeingDragged = true;
    oldScrollPosition = tabBar.scrollLeft;
    oldMousePosition = e.clientX - tabBarLocation;
  });
  document.addEventListener("mouseup", function () {
    if (tabBarIsBeingDragged) {
      tabBarIsBeingDragged = false;
      oldScrollPosition = -1;
      oldMousePosition = -1;
    }
  });
  document.addEventListener("mousemove", function (e) {
    if (tabBarIsBeingDragged) {
      e.preventDefault();
      var newMousePosition = e.clientX - tabBarLocation;
      tabBar.scrollLeft = oldScrollPosition - newMousePosition + oldMousePosition;
    }
  });
});
Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content-tab-title-vertical-wrap")).forEach(function (instance) {
  instance.addEventListener("focus", function () {
    ub_handleTabEvent(instance);
  });
});

function ub_switchFocusToTab(index, tabBar) {
  var _tabBar$getBoundingCl = tabBar.getBoundingClientRect(),
      tabContainerWidth = _tabBar$getBoundingCl.width;

  var tabContainerLocation = tabBar.getBoundingClientRect().x || tabBar.getBoundingClientRect().left;

  var _tabBar$children$inde = tabBar.children[index].getBoundingClientRect(),
      tabWidth = _tabBar$children$inde.width;

  var tabLocation = tabBar.children[index].getBoundingClientRect().x || tabBar.children[index].getBoundingClientRect().left;

  if (tabContainerLocation > tabLocation) {
    tabBar.scrollLeft -= tabContainerLocation - tabLocation;
  }

  if (tabLocation + tabWidth > tabContainerLocation + tabContainerWidth) {
    var scrollLeftChange = tabLocation - tabContainerLocation;

    if (tabWidth <= tabContainerWidth) {
      scrollLeftChange += tabWidth - tabContainerWidth;
    }

    tabBar.scrollLeft += scrollLeftChange;
  }
}

function ub_getTabbedContentDisplayModes(block) {
  var dm = [];
  var classNamePrefix = "wp-block-ub-tabbed-content";

  if (block.classList.contains("".concat(classNamePrefix, "-vertical-holder-mobile"))) {
    dm.push("verticaltab");
  } else if (block.classList.contains("".concat(classNamePrefix, "-horizontal-holder-mobile"))) {
    dm.push("horizontaltab");
  } else {
    dm.push("accordion");
  }

  if (block.classList.contains("".concat(classNamePrefix, "-vertical-holder-tablet"))) {
    dm.push("verticaltab");
  } else if (block.classList.contains("".concat(classNamePrefix, "-horizontal-holder-tablet"))) {
    dm.push("horizontaltab");
  } else {
    dm.push("accordion");
  }

  dm.push(block.classList.contains("vertical-holder") ? "verticaltab" : "horizontaltab");
  return dm;
}

(function () {
  var displayModes = Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content")).map(function (block) {
    return ub_getTabbedContentDisplayModes(block);
  });
  var transitionTo = 0;
  var transitionFrom = 0;

  function processTransition() {
    if (transitionTo && transitionFrom) {
      Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content")).forEach(function (instance, i) {
        if (displayModes[i][transitionFrom - 1] !== displayModes[i][transitionTo - 1]) {
          var tabBar = instance.children[0].children[0];

          switch (displayModes[i][transitionFrom - 1]) {
            case "accordion":
              var activeTabs = JSON.parse(instance.dataset.activeTabs);

              if (activeTabs) {
                Array.prototype.slice.call(tabBar.children).forEach(function (child, j) {
                  if (j === activeTabs[activeTabs.length - 1]) {
                    child.classList.add("active");
                  } else {
                    child.classList.remove("active");
                  }
                });
                Array.prototype.slice.call(instance.children[1].children).forEach(function (child, j) {
                  if (Math.floor(j / 2) === activeTabs[activeTabs.length - 1]) {
                    child.classList.add("active");
                    child.classList.remove("ub-hide");
                  } else {
                    child.classList.remove("active");

                    if (j % 2 === 1) {
                      child.classList.add("ub-hide");
                    }
                  }
                });
              }

              delete instance.dataset.activeTabs;
              Array.prototype.slice.call(instance.children[1]).forEach(function (child, j) {
                if (j % 2 === 1) {
                  child.setAttribute("role", "tabpanel");
                  child.setAttribute("aria-labelledby", child.id.replace("panel", "tab"));
                }
              });
              break;

            case "verticaltab":
              Array.prototype.slice.call(tabBar.children).forEach(function (tab) {
                tab.removeEventListener("keydown", ub_upDownPress);
              });
              break;

            case "horizontaltab":
            default:
              Array.prototype.slice.call(tabBar.children).forEach(function (tab) {
                tab.removeEventListener("keydown", ub_leftRightPress);
              });
              break;
          }

          switch (displayModes[i][transitionTo - 1]) {
            case "accordion":
              Array.prototype.slice.call(tabBar.children).forEach(function (child, j) {
                if (child.classList.contains("active")) {
                  instance.dataset.activeTabs = JSON.stringify([j]);
                }
              });
              Array.prototype.slice.call(instance.children[1]).forEach(function (child, j) {
                if (j % 2 === 1) {
                  child.setAttribute("role", "region");
                  child.removeAttribute("aria-labelledby");
                } else {
                  child.setAttribute("aria-expanded", !child.nextElementSibling.classList.contains("ub-hide"));

                  if (!child.hasAttribute("aria-controls")) {
                    child.setAttribute("aria-controls", child.nextElementSibling.id);
                  }
                }
              });
              tabBar.removeAttribute("aria-orientation");
              break;

            case "verticaltab":
              Array.prototype.slice.call(tabBar.children).forEach(function (tab) {
                tab.addEventListener("keydown", ub_upDownPress);
              });
              tabBar.setAttribute("aria-orientation", "vertical");
              break;

            case "horizontaltab":
            default:
              var newActiveTab = Array.prototype.slice.call(tabBar.children).findIndex(function (tab) {
                return tab.classList.contains("active");
              });
              ub_switchFocusToTab(newActiveTab, tabBar);
              Array.prototype.slice.call(tabBar.children).forEach(function (tab) {
                tab.addEventListener("keydown", ub_leftRightPress);
              });
              tabBar.setAttribute("aria-orientation", "horizontal");
              break;
          }
        }
      });
      transitionTo = 0;
      transitionFrom = 0;
    }
  } //Keep addListener for these three. addEventListener won't work with safari versions older than 14.


  window.matchMedia("(max-width: 699px)").addEventListener("change", function (mql) {
    if (mql.matches) {
      transitionTo = 1;
    } else {
      transitionFrom = 1;
    }

    processTransition();
  });
  window.matchMedia("(min-width: 700px) and (max-width: 899px)").addEventListener("change", function (mql) {
    if (mql.matches) {
      transitionTo = 2;
    } else {
      transitionFrom = 2;
    }

    processTransition();
  });
  window.matchMedia("(min-width: 900px)").addEventListener("change", function (mql) {
    if (mql.matches) {
      transitionTo = 3;
    } else {
      transitionFrom = 3;
    }

    processTransition();
  });
})();

function ub_hashTabSwitch() {
  var targetElement = document.querySelector("[data-tab-anchor='".concat(window.location.hash.slice(1), "']"));
  var classNamePrefix = "wp-block-ub-tabbed-content";

  if (targetElement) {
    if (targetElement.classList.contains("".concat(classNamePrefix, "-tab-content-wrap"))) {
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
      var tabIndex = Array.prototype.slice.call(targetElement.parentElement.children).filter(function (e) {
        return e.classList.contains("".concat(classNamePrefix, "-tab-content-wrap"));
      }).findIndex(function (e) {
        return e.dataset.tabAnchor === window.location.hash.slice(1);
      });
      var tabContentRoot = targetElement.parentElement.parentElement;
      var ancestorTabBlocks = [];
      var ancestorTabIndexes = [];

      var findTabContentRoot = function findTabContentRoot(currentBlock) {
        var parentTabbedContent = currentBlock.closest(".wp-block-ub-tabbed-content-tabs-content");

        if (parentTabbedContent) {
          ancestorTabIndexes.push(Array.prototype.slice.call(parentTabbedContent.children).filter(function (t) {
            return t.classList.contains("wp-block-ub-tabbed-content-tab-content-wrap");
          }).indexOf(currentBlock.closest(".wp-block-ub-tabbed-content-tab-content-wrap")));
          ancestorTabBlocks.push(parentTabbedContent.parentElement);
          return findTabContentRoot(parentTabbedContent.parentElement);
        } else {
          return currentBlock;
        }
      };

      findTabContentRoot(targetElement);
      ancestorTabBlocks.unshift(targetElement.parentElement.parentElement);
      ancestorTabIndexes.unshift(tabIndex);
      var displayModes = ancestorTabBlocks.map(function (a) {
        return ub_getTabbedContentDisplayModes(a);
      });
      var displayMode = -1;

      if (window.innerWidth < 700) {
        displayMode = 0;
      } else if (window.innerWidth < 900) {
        displayMode = 1;
      } else {
        displayMode = 2;
      }

      ancestorTabBlocks.forEach(function (a, i) {
        var targetElement = a.children[1].children[ancestorTabIndexes[i]];
        var tabContents = Array.prototype.slice.call(targetElement.parentElement.children).filter(function (e) {
          return e.classList.contains("".concat(classNamePrefix, "-tab-content-wrap"));
        });

        if (displayModes[i][displayMode] === "accordion") {
          tabContents.forEach(function (tabContent, j) {
            if (j === ancestorTabIndexes[i]) {
              tabContent.classList.add("active");
              tabContent.classList.remove("ub-hide");
              tabContent.previousElementSibling.classList.add("active");
            } else {
              tabContent.classList.remove("active");
              tabContent.classList.add("ub-hide");
              tabContent.previousElementSibling.classList.remove("active");
            }
          });
          targetElement.parentElement.parentElement.dataset.activeTabs = JSON.stringify([ancestorTabIndexes[i]]);
        } else {
          var tabBar = targetElement.parentElement.previousElementSibling.children[0];
          Array.prototype.slice.call(tabBar.children).forEach(function (tab, j) {
            var probableAccordionToggle = tabContents[ancestorTabIndexes[i]].previousElementSibling;
            tab.setAttribute("aria-selected", j === ancestorTabIndexes[i]);

            if (j === ancestorTabIndexes[i]) {
              tab.classList.add("active");
              tabContents[j].classList.add("active");
              tabContents[j].classList.remove("ub-hide");

              if (probableAccordionToggle && probableAccordionToggle.classList.contains("".concat(classNamePrefix, "-accordion-toggle"))) {
                probableAccordionToggle.classList.add("active");
              }

              Array.prototype.slice.call(tabContents[j].querySelectorAll("iframe")).forEach(function (embed) {
                embed.style.removeProperty("width");
                embed.style.removeProperty("height");
              });
            } else {
              tab.classList.remove("active");
              tabContents[j].classList.remove("active");
              tabContents[j].classList.add("ub-hide");

              if (probableAccordionToggle && probableAccordionToggle.classList.contains("".concat(classNamePrefix, "-accordion-toggle"))) {
                probableAccordionToggle.classList.remove("active");
              }
            }
          });

          if (targetElement.parentElement.previousElementSibling.offsetWidth === targetElement.parentElement.offsetWidth) {
            ub_switchFocusToTab(ancestorTabIndexes[i], tabBar);
          }
        }
      });
      var targetAccordion = targetElement.previousElementSibling;
      var scrollBoundingRect = (displayModes[0][displayMode] === "accordion" ? targetAccordion : tabContentRoot).getBoundingClientRect();
      setTimeout(function () {
        window.scrollBy(0, (scrollBoundingRect.y || scrollBoundingRect.top) - Math.max.apply(Math, stickyHeaderHeights));
      }, 50);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content")).forEach(function (instance) {
    return ub_initializeTabBlock(instance);
  });
  Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content-underline")).forEach(function (instance) {
    return ub_initializeTabBlock(instance);
  });
  Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content-pills")).forEach(function (instance) {
    return ub_initializeTabBlock(instance);
  });
  ub_hashTabSwitch();
});

function ub_initializeTabBlock(instance) {
  var tabBar = instance.children[0].children[0];

  if (window.getComputedStyle(tabBar).display !== "none") {
    var scrollWidth = tabBar.scrollWidth,
        clientWidth = tabBar.clientWidth;
    Array.prototype.slice.call(tabBar.children).forEach(function (tab) {
      if (tab.classList.contains("active")) {
        tab.setAttribute("tabindex", 0);

        if (scrollWidth > clientWidth) {
          var tabLocation = (tab.getBoundingClientRect().x || tab.getBoundingClientRect().left) + tab.getBoundingClientRect().width - (instance.getBoundingClientRect().x || instance.getBoundingClientRect().left);

          if (tabLocation > clientWidth) {
            tabBar.scrollLeft = tabLocation - clientWidth;
          }
        }
      }
    });
  }

  var displayModes = ub_getTabbedContentDisplayModes(instance);
  var currentDisplay = -1;

  if (window.innerWidth < 700) {
    currentDisplay = 0;
  } else if (window.innerWidth < 900) {
    currentDisplay = 1;
  } else {
    currentDisplay = 2;
  }

  if (displayModes[currentDisplay] === "accordion") {
    var tabContents = instance.children[1];
    Array.prototype.slice.call(tabContents.children).forEach(function (child, i) {
      if (i % 2 === 1) {
        child.setAttribute("role", "region");
        child.removeAttribute("aria-labelledby");
      } else {
        child.setAttribute("aria-expanded", !child.nextElementSibling.classList.contains("ub-hide"));
        child.setAttribute("aria-controls", child.nextElementSibling.id);

        if (child.nextElementSibling.classList.contains("active")) {
          child.classList.add("active");
        }
      }
    });
  } else {
    var _tabBar = instance.children[0].children[0];
    Array.prototype.slice.call(_tabBar.children).forEach(function (tab) {
      tab.addEventListener("keydown", displayModes[currentDisplay] === "verticaltab" ? ub_upDownPress : ub_leftRightPress);
    });

    _tabBar.setAttribute("aria-orientation", displayModes[currentDisplay].slice(0, -3));
  }
}

window.onhashchange = ub_hashTabSwitch;
Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content-tabs-content")).forEach(function (container) {
  Array.prototype.slice.call(container.children).filter(function (child) {
    return child.classList.contains("wp-block-ub-tabbed-content-accordion-toggle");
  }).forEach(function (accordionToggle, i) {
    accordionToggle.addEventListener("click", function () {
      var root = container.parentElement;

      if (accordionToggle.classList.contains("active")) {
        var activeTabs = JSON.parse(root.dataset.activeTabs);

        if (activeTabs.length > 1) {
          root.dataset.activeTabs = JSON.stringify(activeTabs.filter(function (c) {
            return c !== i;
          }));
        } else {
          root.dataset.noActiveTabs = true;
        }
      } else {
        Array.prototype.slice.call(document.getElementsByClassName("ub_image_slider")).forEach(function (slider) {
          var swiper = new Swiper("#".concat(slider.id), JSON.parse(slider.dataset.swiperData));
        });

        if (root.dataset.noActiveTabs) {
          delete root.dataset.noActiveTabs;
          root.dataset.activeTabs = JSON.stringify([i]);
        } else {
          root.dataset.activeTabs = JSON.stringify(JSON.parse(root.dataset.activeTabs).concat(i));
        }
      }

      accordionToggle.classList.toggle("active");
      accordionToggle.nextElementSibling.classList.toggle("active");
      accordionToggle.nextElementSibling.classList.toggle("ub-hide");
    });
  });
});
Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content-tab-holder")).forEach(function (tabBar) {
  var tabBarIsBeingDragged = false;
  var oldScrollPosition = -1;
  var oldMousePosition = -1;
  var tabBarLocation = tabBar.getBoundingClientRect().x || tabBar.getBoundingClientRect().left;
  tabBar.addEventListener("mousedown", function (e) {
    tabBarIsBeingDragged = true;
    oldScrollPosition = tabBar.scrollLeft;
    oldMousePosition = e.clientX - tabBarLocation;
  });
  document.addEventListener("mouseup", function () {
    if (tabBarIsBeingDragged) {
      tabBarIsBeingDragged = false;
      oldScrollPosition = -1;
      oldMousePosition = -1;
    }
  });
  document.addEventListener("mousemove", function (e) {
    if (tabBarIsBeingDragged) {
      e.preventDefault();
      var newMousePosition = e.clientX - tabBarLocation;
      tabBar.scrollLeft = oldScrollPosition - newMousePosition + oldMousePosition;
    }
  });
});