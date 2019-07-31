document.addEventListener('DOMContentLoaded', function() {
	setTimeout(() => {
		Array.from(document.getElementsByClassName('ub_progress-bar')).forEach(
			instance => {
				instance.classList.add('ub_progress-bar-filled');
			}
		);
	}, 500);
});
