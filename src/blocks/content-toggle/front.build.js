"use strict";

Array.from(document.getElementsByClassName('wp-block-ub-content-toggle')).forEach(function (toggleContainer) {
  var parentIsHidden = false;
  var parentClassIsHidden = false;
  var targetElement = toggleContainer;

  while (!(parentIsHidden || parentClassIsHidden) && targetElement.parentElement.tagName !== 'BODY') {
    targetElement = targetElement.parentElement;

    if (targetElement.style.display === 'none') {
      parentIsHidden = true;
    }

    if (getComputedStyle(targetElement).display === 'none') {
      parentClassIsHidden = true;
    }
  }

  if (parentClassIsHidden || parentIsHidden) {
    toggleContainer.parentElement.style.setProperty('display', 'block', //make the parent block display to give way for height measurements
    'important' //just in case blocks from other plugins use !important
    );
  }

  Array.from(toggleContainer.getElementsByClassName('wp-block-ub-content-toggle-accordion-title-wrap')).forEach(function (instance) {
    var indicator = instance.querySelector('.wp-block-ub-content-toggle-accordion-state-indicator');
    var panelContent = instance.nextSibling;
    var panelHeight = 0;
    var initialHide = panelContent.style.height === '0px' || panelContent.style.display === 'none';

    if (initialHide) {
      //temporarily show panel contents to enable taking panel height measurements
      panelContent.style.height = '';
      panelContent.style.paddingTop = '';
      panelContent.style.paddingBottom = '';
      panelContent.style.display = '';
    }

    panelHeight = panelContent.offsetHeight;

    if (initialHide) {
      panelContent.style.height = '0px';
      panelContent.style.paddingTop = '0';
      panelContent.style.paddingBottom = '0';
      panelContent.style.marginTop = '0';
      panelContent.style.marginBottom = '0';
    }

    instance.addEventListener('click', function (e) {
      e.stopImmediatePropagation();

      if (indicator.classList.contains('open') && panelHeight !== panelContent.offsetHeight) {
        panelHeight = panelContent.offsetHeight;
      }

      if (panelContent.style.height === '') {
        panelContent.style.height = "".concat(panelHeight, "px");
      }

      panelContent.style.transition = 'all 0.5s ease-in-out';
      indicator.classList.toggle('open');
      setTimeout(function () {
        //delay is needed for the animation to run properly
        var newVal = indicator.classList.contains('open') ? '' : '0';
        panelContent.style.paddingTop = newVal;
        panelContent.style.paddingBottom = newVal;
        panelContent.style.marginTop = newVal;
        panelContent.style.marginBottom = newVal;
        panelContent.style.height = "".concat(indicator.classList.contains('open') ? panelHeight : 0, "px");
      }, 1);
    });
    panelContent.addEventListener('transitionend', function () {
      panelContent.style.transition = '';

      if (panelContent.style.height !== '0px') {
        panelContent.style.height = '';
      }
    });
  }); //hide the parent element again;

  if (parentIsHidden) {
    toggleContainer.parentElement.style.display = 'none';
  }

  if (parentClassIsHidden) {
    toggleContainer.parentElement.style.display = '';
  }
});