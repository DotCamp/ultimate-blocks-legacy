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
      var panelHeight = 0;
      var initialHide = panelContent.style.height === "0px" || panelContent.classList.contains("ub-hide") || getComputedStyle(panelContent).display === "none";

      if (initialHide) {
        //temporarily show panel contents to enable taking panel height measurements
        panelContent.classList.remove("ub-hide");
        panelContent.style.height = "";
        panelContent.style.paddingTop = "";
        panelContent.style.paddingBottom = "";
        panelContent.style.display = "";
      }

      panelHeight = panelContent.offsetHeight;
      panelContent.removeAttribute("style");

      if (initialHide) {
        setTimeout(function () {
          return panelContent.classList.add("ub-hide");
        }, 10);
      }

      instance.addEventListener("click", function (e) {
        e.stopImmediatePropagation();

        if (panelContent.classList.contains("ub-hide")) {
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

              if (!siblingContent.contains("ub-hide")) {
                if (siblingIndicator) siblingIndicator.classList.remove("open");
                siblingContent.classList.add("ub-toggle-transition");
                var siblingHeight = siblingContent.offsetHeight;
                siblingContent.style.height = "".concat(siblingHeight, "px"); //calculate panelheight first

                setTimeout(function () {
                  siblingContent.classList.add("ub-hiding");
                  siblingContent.style.height = "";
                }, 20);
              }
            });
          }
        } else {
          if (panelHeight !== panelContent.offsetHeight) {
            panelHeight = panelContent.offsetHeight;
          }

          panelContent.style.height = "".concat(panelHeight, "px");
        }

        panelContent.classList.add("ub-toggle-transition");
        if (indicator) indicator.classList.toggle("open");
        setTimeout(function () {
          //delay is needed for the animation to run properly
          if (panelContent.classList.contains("ub-hiding")) {
            panelContent.classList.remove("ub-hiding");
            panelContent.style.height = "".concat(panelHeight, "px");
          } else {
            panelContent.classList.add("ub-hiding");
            panelContent.style.height = "";
          }
        }, 20);
        var flickityInstances = Array.prototype.slice.call(panelContent.querySelectorAll(".ub_image_slider"));
        flickityInstances.forEach(function (instance) {
          var slider = Flickity.data(instance.querySelector("[data-flickity]"));
          slider.resize();
        });
        Array.prototype.slice.call(panelContent.querySelectorAll(".wp-block-embed iframe")).forEach(function (embeddedContent) {
          embeddedContent.style.removeProperty("width");
          embeddedContent.style.removeProperty("height");
        });
      });
      panelContent.addEventListener("transitionend", function () {
        panelContent.classList.remove("ub-toggle-transition");

        if (panelContent.classList.contains("ub-hiding")) {
          panelContent.classList.remove("ub-hiding");
          panelContent.classList.add("ub-hide");
        } else {
          panelContent.style.height = "";
        }
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