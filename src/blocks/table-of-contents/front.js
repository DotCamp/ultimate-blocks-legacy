if (!Element.prototype.matches) {
	Element.prototype.matches =
		Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		let el = this;

		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}

document.addEventListener('DOMContentLoaded', function() {
	let instances = [];
	if (document.getElementById('ub_table-of-contents-toggle-link')) {
		instances.push(
			document.getElementById('ub_table-of-contents-toggle-link')
		);
	} else {
		instances = Array.prototype.slice.call(
			document.getElementsByClassName('ub_table-of-contents-toggle-link')
		);
	}
	instances.forEach(instance => {
		let tocHeight = 0;

		const block = instance.closest('.ub_table-of-contents');
		const tocContainer = block.querySelector(
			'.ub_table-of-contents-container'
		);

		const showButton = block.getAttribute('data-showtext') || 'show';
		const hideButton = block.getAttribute('data-hidetext') || 'hide';

		const initialHide =
			tocContainer.classList.contains('ub-hide') ||
			tocContainer.style.height === '0px' ||
			getComputedStyle(tocContainer).display === 'none';
		if (initialHide) {
			tocContainer.classList.remove('ub-hide');
			tocContainer.style.display = '';
			tocContainer.style.height = '';
			tocContainer.parentNode.classList.remove(
				'ub_table-of-contents-collapsed'
			);
		}

		tocHeight = tocContainer.offsetHeight;

		const tocMainMinWidth =
			tocContainer.parentNode.querySelector(
				'.ub_table-of-contents-header'
			).offsetWidth + 2;

		if (initialHide) {
			tocContainer.classList.add('ub-hide');
			tocContainer.parentNode.classList.add(
				'ub_table-of-contents-collapsed'
			);
		}

		tocContainer.removeAttribute('style');

		instance.addEventListener('click', function(event) {
			event.preventDefault();

			if (tocContainer.classList.contains('ub-hide')) {
				tocContainer.classList.remove('ub-hide');
				tocContainer.classList.add('ub-hiding');

				tocContainer.parentNode.classList.remove(
					'ub_table-of-contents-collapsed'
				);
				tocContainer.parentNode.style.width = `${tocMainMinWidth}px`;
			} else {
				if (tocHeight !== tocContainer.offsetHeight) {
					tocHeight = tocContainer.offsetHeight;
				}

				tocContainer.style.height = `${tocHeight}px`;
				tocContainer.parentNode.style.width = '100%';
			}
			setTimeout(() => {
				//delay is needed for the animation to run properly
				if (tocContainer.classList.contains('ub-hiding')) {
					tocContainer.classList.remove('ub-hiding');
					tocContainer.parentNode.style.width = '100%';
					tocContainer.style.height = `${tocHeight}px`;
				} else {
					tocContainer.classList.add('ub-hiding');
					tocContainer.parentNode.style.margin = 0;
					tocContainer.parentNode.style.padding = 0;
					tocContainer.parentNode.style.width = `${tocMainMinWidth}px`;
					tocContainer.style.height = '';
				}
			}, 20);
			instance.innerHTML = tocContainer.classList.contains('ub-hiding')
				? hideButton
				: showButton;
		});

		tocContainer.addEventListener('transitionend', function() {
			if (getComputedStyle(tocContainer).height === '0px') {
				tocContainer.classList.remove('ub-hiding');
				tocContainer.classList.add('ub-hide');

				if (tocContainer.style.display === 'block') {
					tocContainer.style.display = '';
				}
				tocContainer.parentNode.classList.add(
					'ub_table-of-contents-collapsed'
				);

				tocContainer.parentNode.style.margin = '';
				tocContainer.parentNode.style.padding = '';
			} else {
				tocContainer.style.height = '';
			}
			tocContainer.parentNode.style.width = '';
		});
	});
});
