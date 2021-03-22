"use strict";

Array.prototype.slice.call(document.getElementsByClassName("ub-advanced-video-thumbnail")).forEach(function (instance) {
  instance.addEventListener("click", function () {
    instance.setAttribute("hidden", true);
    instance.nextElementSibling.removeAttribute("hidden");
  });
});