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
    sibling.classList.remove("active");

    if (defaultStyle) {
      sibling.setAttribute("style", defaultStyle);
    }
  });
  tab.classList.add("active");

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
      var flickityInstances = Array.prototype.slice.call(tabContent.querySelectorAll(".ub_image_slider"));
      flickityInstances.forEach(function (instance) {
        var slider = Flickity.data(instance.querySelector("[data-flickity]"));
        slider.resize();
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

Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content-tab-title-wrap")).forEach(function (instance) {
  instance.addEventListener("click", function () {
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
  instance.addEventListener("click", function () {
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

(function () {
  var displayModes = Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content")).map(function (block) {
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
  });
  var transitionTo = 0;
  var transitionFrom = 0;

  function processTransition() {
    if (transitionTo && transitionFrom) {
      Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content")).forEach(function (instance, i) {
        if (displayModes[i][transitionFrom - 1] !== displayModes[i][transitionTo - 1]) {
          if (displayModes[i][transitionFrom - 1] === "accordion") {
            var activeTabs = JSON.parse(instance.dataset.activeTabs);
            Array.prototype.slice.call(instance.children[0].children[0].children).forEach(function (child, j) {
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
            delete instance.dataset.activeTabs;
          } else if (displayModes[i][transitionTo - 1] === "accordion") {
            Array.prototype.slice.call(instance.children[0].children[0].children).forEach(function (child, j) {
              if (child.classList.contains("active")) {
                instance.dataset.activeTabs = JSON.stringify([j]);
              }
            });
          }

          if (displayModes[i][transitionTo - 1] === "horizontaltab") {
            var tabBar = instance.children[0].children[0];
            var newActiveTab = Array.prototype.slice.call(instance.children[0].children[0].children).findIndex(function (tab) {
              return tab.classList.contains("active");
            });
            ub_switchFocusToTab(newActiveTab, tabBar);
          }
        }
      });
      transitionTo = 0;
      transitionFrom = 0;
    }
  }

  window.matchMedia("(max-width: 699px)").addListener(function (mql) {
    if (mql.matches) {
      transitionTo = 1;
    } else {
      transitionFrom = 1;
    }

    processTransition();
  });
  window.matchMedia("(min-width: 700px) and (max-width: 899px)").addListener(function (mql) {
    if (mql.matches) {
      transitionTo = 2;
    } else {
      transitionFrom = 2;
    }

    processTransition();
  });
  window.matchMedia("(min-width: 900px)").addListener(function (mql) {
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
      var tabContents = Array.prototype.slice.call(targetElement.parentElement.children).filter(function (e) {
        return e.classList.contains("".concat(classNamePrefix, "-tab-content-wrap"));
      });
      var tabIndex = tabContents.findIndex(function (e) {
        return e.dataset.tabAnchor === window.location.hash.slice(1);
      });
      var tabContentRoot = targetElement.parentElement.parentElement;

      if (targetElement.previousElementSibling.classList.contains("".concat(classNamePrefix, "-accordion-toggle")) && targetElement.previousElementSibling.offsetWidth > 0) {
        tabContents.forEach(function (tabContent) {
          tabContent.classList.remove("active");
          tabContent.classList.add("ub-hide");
          tabContent.previousElementSibling.classList.remove("active");
        });
        var targetAccordion = targetElement.previousElementSibling;
        var deficit = targetAccordion.getBoundingClientRect().y || targetAccordion.getBoundingClientRect().top;
        setTimeout(function () {
          targetElement.classList.add("active");
          targetElement.classList.remove("ub-hide");
          targetAccordion.classList.add("active");
          window.scrollBy(0, deficit - Math.max.apply(Math, stickyHeaderHeights));
          tabContentRoot.dataset.activeTabs = JSON.stringify([tabIndex]);
          Array.prototype.slice.call(targetElement.querySelectorAll("iframe")).forEach(function (embed) {
            embed.style.removeProperty("width");
            embed.style.removeProperty("height");
          });
        }, 50); //timeout needed for ensure accurate calculations
      } else {
        var _deficit = tabContentRoot.getBoundingClientRect().y || tabContentRoot.getBoundingClientRect().top;

        window.scrollBy(0, _deficit - Math.max.apply(Math, stickyHeaderHeights));
        var tabBar = targetElement.parentElement.previousElementSibling.children[0];
        Array.prototype.slice.call(tabBar.children).forEach(function (tab, i) {
          var probableAccordionToggle = tabContents[i].previousElementSibling;

          if (i === tabIndex) {
            tab.classList.add("active");
            tabContents[i].classList.add("active");
            tabContents[i].classList.remove("ub-hide");

            if (probableAccordionToggle && probableAccordionToggle.classList.contains("".concat(classNamePrefix, "-accordion-toggle"))) {
              probableAccordionToggle.classList.add("active");
            }

            Array.prototype.slice.call(tabContents[i].querySelectorAll("iframe")).forEach(function (embed) {
              embed.style.removeProperty("width");
              embed.style.removeProperty("height");
            });
          } else {
            tab.classList.remove("active");
            tabContents[i].classList.remove("active");
            tabContents[i].classList.add("ub-hide");

            if (probableAccordionToggle && probableAccordionToggle.classList.contains("".concat(classNamePrefix, "-accordion-toggle"))) {
              probableAccordionToggle.classList.remove("active");
            }
          }
        });

        if (targetElement.parentElement.previousElementSibling.offsetWidth === targetElement.parentElement.offsetWidth) {
          ub_switchFocusToTab(tabIndex, tabBar);
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-tabbed-content")).forEach(function (instance) {
    var tabBar = instance.children[0].children[0];

    if (window.getComputedStyle(tabBar).display !== "none") {
      var scrollWidth = tabBar.scrollWidth,
          clientWidth = tabBar.clientWidth;

      if (scrollWidth > clientWidth) {
        Array.prototype.slice.call(tabBar.children).forEach(function (tab) {
          if (tab.classList.contains("active")) {
            var tabLocation = (tab.getBoundingClientRect().x || tab.getBoundingClientRect().left) + tab.getBoundingClientRect().width - (instance.getBoundingClientRect().x || instance.getBoundingClientRect().left);

            if (tabLocation > clientWidth) {
              tabBar.scrollLeft = tabLocation - clientWidth;
            }
          }
        });
      }
    }
  });
  ub_hashTabSwitch();
});
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