"use strict";

/* eslint-disable */
function ub_getSiblings(element, criteria) {
  var children = Array.from(element.parentNode.children).filter(function (child) {
    return child !== element;
  });
  return criteria ? children.filter(criteria) : children;
}

function ub_getNodeindex(elm) {
  return Array.from(elm.parentNode.children).indexOf(elm);
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

      if (defaultStyle) {
        sibling.setAttribute('style', defaultStyle);
      }
    });
    instance.classList.add('active');
    if (activeStyle) instance.setAttribute('style', activeStyle);
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
Array.from(document.getElementsByClassName('wp-block-ub-tabbed-content-scroll-button-container')).forEach(function (scrollButtonContainer) {
  var tabBar = scrollButtonContainer.previousElementSibling;
  var leftScroll = scrollButtonContainer.querySelector('.wp-block-ub-tabbed-content-scroll-button-left');
  var rightScroll = scrollButtonContainer.querySelector('.wp-block-ub-tabbed-content-scroll-button-right');
  var scrollInterval;
  var scrollCountdown;

  var moveLeft = function moveLeft(_) {
    return tabBar.scrollLeft -= 10;
  };

  var moveRight = function moveRight(_) {
    return tabBar.scrollLeft += 10;
  };

  var checkWidth = function checkWidth(_) {
    if (tabBar.scrollWidth > tabBar.clientWidth) {
      scrollButtonContainer.classList.remove('ub-hide');
    } else {
      scrollButtonContainer.classList.add('ub-hide');
    }
  };

  var resetTimers = function resetTimers(_) {
    clearTimeout(scrollCountdown);
    clearTimeout(scrollInterval);
  };

  window.addEventListener('resize', checkWidth);
  leftScroll.addEventListener('mousedown', function (_) {
    moveLeft();
    scrollCountdown = setTimeout(function (_) {
      scrollInterval = setInterval(moveLeft, 50);
    }, 500);
  });
  leftScroll.addEventListener('mouseup', resetTimers);
  rightScroll.addEventListener('mousedown', function (_) {
    moveRight();
    scrollCountdown = setTimeout(function (_) {
      scrollInterval = setInterval(moveRight, 50);
    }, 500);
  });
  rightScroll.addEventListener('mouseup', resetTimers);
  checkWidth();
});