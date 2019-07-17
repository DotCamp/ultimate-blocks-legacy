"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* eslint-disable */
function ub_getSiblings(element, criteria) {
  var children = _toConsumableArray(element.parentNode.children).filter(function (child) {
    return child !== element;
  });

  return criteria ? children.filter(criteria) : children;
}

function ub_getNodeindex(elm) {
  return _toConsumableArray(elm.parentNode.children).indexOf(elm);
}

Array.from(document.getElementsByClassName('wp-block-ub-tabbed-content-tab-title-wrap')).forEach(function (instance) {
  instance.addEventListener('click', function () {
    var parent = instance.closest('.wp-block-ub-tabbed-content-holder');
    var activeStyle = parent.querySelector('.wp-block-ub-tabbed-content-tab-title-wrap.active').getAttribute('style');
    var defaultStyle = parent.querySelector('.wp-block-ub-tabbed-content-tab-title-wrap:not(.active)').getAttribute('style');
    ub_getSiblings(instance, function (elem) {
      return elem.classList.contains('wp-block-ub-tabbed-content-tab-title-wrap');
    }).forEach(function (sibling) {
      sibling.classList.remove('active');
      sibling.setAttribute('style', defaultStyle);
    });
    instance.classList.add('active');
    instance.setAttribute('style', activeStyle);
    var activeTab = parent.querySelector(".wp-block-ub-tabbed-content-tab-content-wrap:nth-of-type(".concat(ub_getNodeindex(this) + 1, ")"));
    ub_getSiblings(activeTab, function (elem) {
      return elem.classList.contains('wp-block-ub-tabbed-content-tab-content-wrap');
    }).forEach(function (inactiveTab) {
      inactiveTab.classList.remove('active');
      inactiveTab.classList.add('ub-hide');
    });
    activeTab.classList.add('active');
    activeTab.classList.remove('ub-hide');
  });
});