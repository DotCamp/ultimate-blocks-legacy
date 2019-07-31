"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ub_getSiblings(element, criteria) {
  var children = _toConsumableArray(element.parentNode.children).filter(function (child) {
    return child !== element;
  });

  return criteria ? children.filter(criteria) : children;
}

Array.from(document.getElementsByClassName('ub-content-filter-tag')).forEach(function (instance) {
  instance.addEventListener('click', function () {
    var blockProper = this.closest('.wp-block-ub-content-filter');
    this.setAttribute('data-tagisselected', JSON.stringify(!JSON.parse(this.getAttribute('data-tagisselected'))));
    this.classList.toggle('ub-selected');
    var categoryIndex = JSON.parse(this.getAttribute('data-categorynumber'));
    var filterIndex = JSON.parse(this.getAttribute('data-filternumber'));

    if (JSON.parse(this.getAttribute('data-tagisselected'))) {
      if (!JSON.parse(this.parentElement.getAttribute('data-canusemultiple'))) {
        ub_getSiblings(this, function (elem) {
          return elem.classList.contains('ub-content-filter-tag');
        }).forEach(function (sibling) {
          sibling.setAttribute('data-tagisselected', 'false');
          sibling.classList.remove('ub-selected');
        });
      }
    } else {
      this.classList.remove('ub-selected');
    }

    var newSelection = JSON.parse(blockProper.getAttribute('data-currentselection'));

    if (Array.isArray(newSelection[categoryIndex])) {
      newSelection[categoryIndex][filterIndex] = JSON.parse(this.getAttribute('data-tagisselected'));
    } else {
      newSelection[categoryIndex] = JSON.parse(this.getAttribute('data-tagisselected')) ? filterIndex : -1;
    }

    blockProper.setAttribute('data-currentselection', JSON.stringify(newSelection));
    Array.from(blockProper.getElementsByClassName('ub-content-filter-panel')).forEach(function (instance) {
      var panelData = JSON.parse(instance.getAttribute('data-selectedfilters'));
      var mainData = JSON.parse(blockProper.getAttribute('data-currentselection'));
      var isVisible = true;
      panelData.forEach(function (category, i) {
        if (Array.isArray(category)) {
          if (mainData[i].filter(function (f) {
            return f;
          }).length > 0 && category.filter(function (f, j) {
            return f && f === mainData[i][j];
          }).length === 0) {
            isVisible = false;
          }
        } else {
          if (mainData[i] !== category && mainData[i] !== -1) {
            isVisible = false;
          }
        }
      });

      if (isVisible) {
        instance.classList.remove('ub-hide');
      } else {
        instance.classList.add('ub-hide');
      }
    });
  });
});
/*Array.from(document.getElementsByClassName('ub-content-filter-reset')).forEach(
	instance => {
		instance.addEventListener('click', function() {
			const blockProper = this.closest('.wp-block-ub-content-filter');

			let blockSelection = JSON.parse(
				blockProper.getAttribute('data-currentselection')
			);

			blockSelection = blockSelection.map(c =>
				Array.isArray(c) ? Array(c.length).fill(false) : -1
			);

			blockProper.setAttribute(
				'data-currentselection',
				JSON.stringify(blockSelection)
			);

			Array.from(
				blockProper.getElementsByClassName('ub-content-filter-panel')
			).forEach(instance => {
				instance.style.display = 'block';
			});

			Array.from(
				blockProper.getElementsByClassName('ub-content-filter-tag')
			).forEach(instance => {
				instance.setAttribute('data-tagisselected', 'false');
				instance.style.backgroundColor = instance.getAttribute(
					'data-normalcolor'
				);
				instance.style.color = instance.getAttribute(
					'data-normaltextcolor'
				);
			});
		});
	}
);*/