"use strict";

Array.prototype.slice.call(document.getElementsByClassName("ub_image_slider")).forEach(function (instance) {
  var swiper = new Swiper("#".concat(instance.id), JSON.parse(instance.dataset.swiperData));
  instance.getElementsByClassName("swiper-button-next")[0].addEventListener("keydown", function (e) {
    if (e.key === " ") {
      e.preventDefault();
    }
  });
  instance.getElementsByClassName("swiper-button-prev")[0].addEventListener("keydown", function (e) {
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