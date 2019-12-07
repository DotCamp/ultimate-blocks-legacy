"use strict";

/* eslint-disable */
Array.prototype.slice.call(document.getElementsByClassName("ub-button-block-main")).forEach(function (instance) {
  if (instance.hasAttribute("data-defaultcolor")) {
    instance.addEventListener("mouseenter", function () {
      var buttonIsTransparent = JSON.parse(instance.getAttribute("data-buttonistransparent"));
      instance.style.color = buttonIsTransparent ? instance.getAttribute("data-hovercolor") : instance.getAttribute("data-hovertextcolor");
      instance.style.backgroundColor = buttonIsTransparent ? "transparent" : instance.getAttribute("data-hovercolor");
      instance.style.border = buttonIsTransparent ? "3px solid ".concat(instance.getAttribute("data-hovercolor")) : "none";
    });
    instance.addEventListener("mouseleave", function () {
      var buttonIsTransparent = JSON.parse(instance.getAttribute("data-buttonistransparent"));
      instance.style.color = buttonIsTransparent ? instance.getAttribute("data-defaultcolor") : instance.getAttribute("data-defaulttextcolor");
      instance.style.backgroundColor = buttonIsTransparent ? "transparent" : instance.getAttribute("data-defaultcolor");
      instance.style.border = buttonIsTransparent ? "3px solid ".concat(instance.getAttribute("data-defaultcolor")) : "none";
    });
  }
});