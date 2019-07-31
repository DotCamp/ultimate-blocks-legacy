"use strict";

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    Array.from(document.getElementsByClassName('ub_progress-bar')).forEach(function (instance) {
      instance.classList.add('ub_progress-bar-filled');
    });
  }, 500);
});