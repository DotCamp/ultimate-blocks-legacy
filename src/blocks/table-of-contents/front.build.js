"use strict";

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

document.addEventListener('DOMContentLoaded', function () {
  var getPxValue = function getPxValue(pxString) {
    return parseInt(pxString.slice(0, -2));
  };

  var instances = [];

  if (document.getElementById('ub_table-of-contents-toggle-link')) {
    instances.push(document.getElementById('ub_table-of-contents-toggle-link'));
  } else {
    instances = Array.prototype.slice.call(document.getElementsByClassName('ub_table-of-contents-toggle-link'));
  }

  instances.forEach(function (instance) {
    var tocHeight = 0;
    var block = instance.closest('.ub_table-of-contents');
    var tocContainer = block.querySelector('.ub_table-of-contents-container');
    var tocMain = tocContainer.parentNode;
    var showButton = block.getAttribute('data-showtext') || 'show';
    var hideButton = block.getAttribute('data-hidetext') || 'hide';
    var initialHide = tocContainer.classList.contains('ub-hide') || tocContainer.style.height === '0px' || getComputedStyle(tocContainer).display === 'none';

    if (initialHide) {
      tocContainer.classList.remove('ub-hide');
      tocContainer.style.display = '';
      tocContainer.style.height = '';
      tocMain.classList.remove('ub_table-of-contents-collapsed');
    }

    tocHeight = tocContainer.offsetHeight;
    var tocHeaderMinWidth = tocMain.querySelector('.ub_table-of-contents-header').offsetWidth;
    var oldTotalHorizontalMargin = getPxValue(getComputedStyle(tocMain).paddingLeft) + getPxValue(getComputedStyle(tocMain).paddingRight);
    var tocMainMinWidth = tocHeaderMinWidth + oldTotalHorizontalMargin + 9;

    if (initialHide) {
      tocContainer.classList.add('ub-hide');
      tocMain.classList.add('ub_table-of-contents-collapsed');
    }

    tocContainer.removeAttribute('style');
    instance.addEventListener('click', function (event) {
      event.preventDefault();

      if (tocContainer.classList.contains('ub-hide')) {
        tocContainer.classList.remove('ub-hide');
        tocContainer.classList.add('ub-hiding');
        tocMain.classList.remove('ub_table-of-contents-collapsed');
        tocMain.style.width = "".concat(tocMainMinWidth, "px");
      } else {
        if (tocHeight !== tocContainer.offsetHeight) {
          tocHeight = tocContainer.offsetHeight;
        }

        tocContainer.style.height = "".concat(tocHeight, "px");
        tocContainer.parentNode.style.width = '100%';
      }

      setTimeout(function () {
        //delay is needed for the animation to run properly
        if (tocContainer.classList.contains('ub-hiding')) {
          tocContainer.classList.remove('ub-hiding');
          tocMain.style.width = '100%';
          tocContainer.style.height = "".concat(tocHeight, "px");
        } else {
          tocContainer.classList.add('ub-hiding');
          tocMain.style.margin = 0;
          tocMain.style.width = "".concat(tocMainMinWidth + (getPxValue(getComputedStyle(tocMain).paddingLeft) + getPxValue(getComputedStyle(tocMain).paddingRight) - oldTotalHorizontalMargin + 1), "px");
          tocContainer.style.height = '';
        }
      }, 20);
      instance.innerHTML = tocContainer.classList.contains('ub-hiding') ? hideButton : showButton;
    });
    tocContainer.addEventListener('transitionend', function () {
      if (getComputedStyle(tocContainer).height === '0px') {
        tocContainer.classList.remove('ub-hiding');
        tocContainer.classList.add('ub-hide');

        if (tocContainer.style.display === 'block') {
          tocContainer.style.display = '';
        }

        tocMain.classList.add('ub_table-of-contents-collapsed');
        tocMain.style.margin = '';
        tocMain.style.padding = '';
      } else {
        tocContainer.style.height = '';
      }

      tocMain.style.width = '';
    });
  });
});