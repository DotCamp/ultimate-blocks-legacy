document.addEventListener("DOMContentLoaded", function() {
	setTimeout(() => {
		Array.prototype.slice
			.call(document.getElementsByClassName("ub_progress-bar"))
			.forEach(instance => {
				instance.classList.add("ub_progress-bar-filled");
			});
	}, 500);
});
