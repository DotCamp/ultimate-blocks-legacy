"use strict";

Array.prototype.slice.call(document.getElementsByClassName("wp-block-ub-content-toggle")).forEach(function (toggleContainer) {
  if (!toggleContainer.hasAttribute("data-preventcollapse")) {
    var parentIsHidden = false;
    var parentClassIsHidden = false;
    var targetElement = toggleContainer;

    while (!(parentIsHidden || parentClassIsHidden) && targetElement.parentElement.tagName !== "BODY") {
      targetElement = targetElement.parentElement;

      if (targetElement.style.display === "none") {
        parentIsHidden = true;
      }

      if (getComputedStyle(targetElement).display === "none") {
        parentClassIsHidden = true;
      }
    }

    if (parentClassIsHidden || parentIsHidden) {
      toggleContainer.parentElement.style.setProperty("display", "block", //make the parent block display to give way for height measurements
      "important" //just in case blocks from other plugins use !important
      );
    }

    Array.prototype.slice.call(toggleContainer.children).map(function (p) {
      return p.children[0];
    }).forEach(function (instance) {
      var indicator = instance.querySelector(".wp-block-ub-content-toggle-accordion-state-indicator");
      var panelContent = instance.nextElementSibling;
      instance.addEventListener("click", function (e) {
        e.stopImmediatePropagation();
        var topPadding = 0;
        var bottomPadding = 0;

        if (panelContent.classList.contains("ub-hide")) {
          var panelStyle = getComputedStyle(panelContent);
          topPadding = parseInt(panelStyle.paddingTop.slice(0, -2));
          bottomPadding = parseInt(panelStyle.paddingBottom.slice(0, -2));
          panelContent.classList.remove("ub-hide");
          panelContent.classList.add("ub-hiding");

          if ("showonlyone" in toggleContainer.dataset && toggleContainer.dataset.showonlyone) {
            var siblingToggles = Array.prototype.slice.call(toggleContainer.children).map(function (p) {
              return p.children[0];
            }).filter(function (p) {
              return p !== instance;
            });
            siblingToggles.forEach(function (siblingToggle) {
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
          //delay is needed for the animation to run properly
          if (panelContent.classList.contains("ub-hiding")) {
            Object.assign(panelContent.style, {
              height: "".concat(panelContent.scrollHeight + topPadding + bottomPadding, "px"),
              paddingTop: "".concat(topPadding, "px"),
              paddingBottom: "".concat(bottomPadding, "px")
            });
          } else {
            panelContent.classList.add("ub-hiding");
            panelContent.style.height = "";
          }
        }, 20);
        Array.prototype.slice.call(panelContent.querySelectorAll(".wp-block-embed iframe")).forEach(function (embeddedContent) {
          embeddedContent.style.removeProperty("width");
          embeddedContent.style.removeProperty("height");
        });
      });
      panelContent.addEventListener("transitionend", function () {
        panelContent.classList.remove("ub-toggle-transition");
        panelContent.previousElementSibling.setAttribute("aria-expanded", panelContent.offsetHeight === 0);

        if (panelContent.offsetHeight === 0) {
          panelContent.classList.add("ub-hide");
        } else {
          Object.assign(panelContent.style, {
            height: "",
            paddingTop: "",
            paddingBottom: ""
          });
        }

        panelContent.classList.remove("ub-hiding");
      });
      panelContent.removeAttribute("style");
    }); //hide the parent element again;

    if (parentIsHidden) {
      toggleContainer.parentElement.style.display = "none";
    }

    if (parentClassIsHidden) {
      toggleContainer.parentElement.style.display = "";
    }
  }
});