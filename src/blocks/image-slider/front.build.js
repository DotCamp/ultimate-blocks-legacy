"use strict";

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    if (Flickity) {
      Array.prototype.slice.call(document.getElementsByClassName("ub_image_slider")).forEach(function (instance) {
        if (instance.querySelector("[data-flickity]")) {
          Flickity.data(instance.querySelector("[data-flickity]")).resize();
        }
      });
    } else {
      window.dispatchEvent(new Event("resize"));
    }
  }, 5000);
});