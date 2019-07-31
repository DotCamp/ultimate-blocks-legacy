document.addEventListener('DOMContentLoaded', function() {
	let instances = [];
	if (document.getElementById('ub_table-of-contents-toggle-link')) {
		instances.push(
			document.getElementById('ub_table-of-contents-toggle-link')
		);
	} else {
		instances = Array.from(
			document.getElementsByClassName('ub_table-of-contents-toggle-link')
		);
	}
	instances.forEach(instance => {
		let tocHeight = 0;

		const block = instance.closest('.ub_table-of-contents');
		const tocContainer = block.querySelector(
			'.ub_table-of-contents-container'
		);

		const showButton = block.getAttribute('data-showtext')
			? block.getAttribute('data-showtext')
			: 'show';
		const hideButton = block.getAttribute('data-hidetext')
			? block.getAttribute('data-hidetext')
			: 'hide';

		const initialHide =
			tocContainer.style.height === '0px' ||
			tocContainer.classList.contains('ub-hide') ||
			getComputedStyle(tocContainer).display === 'none';
		if (initialHide) {
			tocContainer.classList.remove('ub-hide');
			tocContainer.style.display = '';
			tocContainer.style.height = '';
		}
		tocHeight = tocContainer.offsetHeight;

		if (initialHide) {
			tocContainer.classList.add('ub-hide');
		}

		instance.addEventListener('click', function(event) {
			event.preventDefault();

			if (tocContainer.classList.contains('ub-hide')) {
				tocContainer.classList.remove('ub-hide');
				tocContainer.classList.add('ub-hiding');
			} else {
				if (tocHeight !== tocContainer.offsetHeight) {
					tocHeight = tocContainer.offsetHeight;
				}
				tocContainer.style.height = `${tocHeight}px`;
			}
			setTimeout(() => {
				//delay is needed for the animation to run properly
				if (tocContainer.classList.contains('ub-hiding')) {
					tocContainer.classList.remove('ub-hiding');
					tocContainer.style.height = `${tocHeight}px`;
				} else {
					tocContainer.classList.add('ub-hiding');
					tocContainer.style.height = '';
				}
			}, 20);
			instance.innerHTML = tocContainer.classList.contains('ub-hiding')
				? showButton
				: hideButton;
		});

		tocContainer.addEventListener('transitionend', function() {
			if (getComputedStyle(tocContainer).height === '0px') {
				tocContainer.classList.remove('ub-hiding');
				tocContainer.classList.add('ub-hide');
				if (tocContainer.style.display === 'block') {
					tocContainer.style.display = '';
				}
			} else {
				tocContainer.style.height = '';
			}
		});
	});
});

(function(document, history, location) {
	//this function is largely based on https://stackoverflow.com/questions/10732690/offsetting-an-html-anchor-to-adjust-for-fixed-header/13067009#13067009
	let HISTORY_SUPPORT = !!(history && history.pushState);

	const anchorScrolls = {
		ANCHOR_REGEX: /^#[^ ]+$/,

		/**
		 * Establish events, and fix initial scroll position if a hash is provided.
		 */
		init: function() {
			this.scrollToCurrent();
			window.addEventListener(
				'hashchange',
				this.scrollToCurrent.bind(this)
			);
			document.body.addEventListener(
				'click',
				this.delegateAnchors.bind(this)
			);
		},

		/**
		 * Return the offset amount to deduct from the normal scroll position.
		 * Modify as appropriate to allow for dynamic calculations
		 */
		getFixedOffset: function() {
			const getFixedElems = selector =>
				Array.from(document.querySelectorAll(selector)).filter(elem => {
					const elemHeight = getComputedStyle(elem).height;
					return (
						getComputedStyle(elem).position === 'fixed' &&
						getComputedStyle(elem).top <
							elemHeight.slice(0, elemHeight.length - 2)
					);
				});

			let stickyElements = [];

			if (getFixedElems('header').length > 0) {
				stickyElements = getFixedElems('header');
			} else if (getFixedElems('div').length > 0) {
				stickyElements = getFixedElems('div');
			} else {
				stickyElements = getFixedElems('body *');
			}

			if (stickyElements.length > 0) {
				const headerHeight = getComputedStyle(stickyElements[0]).height;
				return headerHeight.slice(0, headerHeight.length - 2);
			} else return 0;
		},

		/**
		 * If the provided href is an anchor which resolves to an element on the
		 * page, scroll to it.
		 * @param  {String} href
		 * @return {Boolean} - Was the href an anchor.
		 */
		scrollIfAnchor: function(href, pushToHistory) {
			let match, rect, anchorOffset;

			if (!this.ANCHOR_REGEX.test(href)) {
				return false;
			}

			match = document.getElementById(href.slice(1));

			if (match) {
				rect = match.getBoundingClientRect();
				anchorOffset =
					window.pageYOffset + rect.top - this.getFixedOffset();
				window.scrollTo(window.pageXOffset, anchorOffset);

				// Add the state to history as-per normal anchor links
				if (HISTORY_SUPPORT && pushToHistory) {
					history.pushState(
						{},
						document.title,
						location.pathname + href
					);
				}
			}

			return !!match;
		},

		/**
		 * Attempt to scroll to the current location's hash.
		 */
		scrollToCurrent: function() {
			this.scrollIfAnchor(window.location.hash);
		},

		/**
		 * If the click event's target was an anchor, fix the scroll position.
		 */
		delegateAnchors: function(e) {
			const elem = e.target;

			if (
				elem.nodeName === 'A' &&
				this.scrollIfAnchor(elem.getAttribute('href'), true) &&
				elem.closest('.ub_table-of-contents-container')
			) {
				e.preventDefault();
			}
		}
	};

	window.addEventListener(
		'DOMContentLoaded',
		anchorScrolls.init.bind(anchorScrolls)
	);
})(window.document, window.history, window.location);
