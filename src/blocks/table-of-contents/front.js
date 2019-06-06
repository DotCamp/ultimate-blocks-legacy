Array.from(
	document.getElementsByClassName('ub_table-of-contents-toggle-link')
).forEach(instance => {
	let heightIsChecked = false;
	let tocHeight = 0;

	const block = instance.closest('.ub_table-of-contents');
	const tocContainer = block.querySelector('.ub_table-of-contents-container');

	if (!heightIsChecked) {
		const initialDisplayMode = tocContainer.style.display;
		if (initialDisplayMode === 'none') {
			tocContainer.style.display = 'block';
			tocContainer.style.height = '';
		}
		tocHeight = tocContainer.offsetHeight;
		tocContainer.style.height = `${
			initialDisplayMode === 'none' ? 0 : tocHeight
		}px`;
		heightIsChecked = true;
	}
	instance.addEventListener('click', function(event) {
		tocContainer.style.height = `${
			tocContainer.style.height === '0px' ? tocHeight : '0'
		}px`;
		event.preventDefault();
	});
});
