"use strict";

Array.prototype.slice.call(document.getElementsByClassName("ub_image_slider")).forEach(function (instance) {
  var _instance$getElements, _instance$getElements2;
  var swiper = new Swiper("#".concat(instance.id), JSON.parse(instance.dataset.swiperData));
  instance === null || instance === void 0 || (_instance$getElements = instance.getElementsByClassName("swiper-button-next")[0]) === null || _instance$getElements === void 0 || _instance$getElements.addEventListener("keydown", function (e) {
    if (e.key === " ") {
      e.preventDefault();
    }
  });
  instance === null || instance === void 0 || (_instance$getElements2 = instance.getElementsByClassName("swiper-button-prev")[0]) === null || _instance$getElements2 === void 0 || _instance$getElements2.addEventListener("keydown", function (e) {
    if (e.key === " ") {
      e.preventDefault();
    }
  });
  Array.prototype.slice.call(instance.getElementsByClassName("swiper-pagination-bullet")).forEach(function (bullet) {
    bullet.addEventListener("keydown", function (e) {
      if (e.key === " ") {
        e.preventDefault();
      }
    });
  });
});