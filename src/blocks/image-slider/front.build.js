"use strict";

Array.prototype.slice.call(document.getElementsByClassName("ub_image_slider")).forEach(function (instance) {
  var swiper = new Swiper("#".concat(instance.id), JSON.parse(instance.dataset.swiperData));
});