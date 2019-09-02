document.addEventListener('DOMContentLoaded', () => {
	let timer = [];
	Array.prototype.slice
		.call(document.getElementsByClassName('ub-countdown'))
		.forEach((instance, i) => {
			timer[i] = setInterval(function() {
				const timeLeft =
					parseInt(instance.getAttribute('data-enddate')) -
					Math.floor(Date.now() / 1000);
				const seconds = timeLeft % 60;
				const minutes = ((timeLeft - seconds) % 3600) / 60;
				const hours =
					((timeLeft - minutes * 60 - seconds) % 86400) / 3600;
				const days =
					((timeLeft - hours * 3600 - minutes * 60 - seconds) %
						604800) /
					86400;
				const weeks =
					(timeLeft -
						days * 86400 -
						hours * 3600 -
						minutes * 60 -
						seconds) /
					604800;
				if (timeLeft >= 0) {
					if (
						instance.querySelector(
							'.ub-countdown-odometer-container'
						)
					) {
						instance.querySelector('.ub_countdown_week').innerHTML =
							weeks < 0
								? weeks
								: weeks +
								  10 **
										(weeks > 0
											? Math.floor(Math.log10(weeks) + 1)
											: 1);
						instance.querySelector('.ub_countdown_day').innerHTML =
							days < 0 ? days : days + 10;
						instance.querySelector('.ub_countdown_hour').innerHTML =
							hours < 0 ? hours : hours + 100;
						instance.querySelector(
							'.ub_countdown_minute'
						).innerHTML = minutes < 0 ? minutes : minutes + 100;
						instance.querySelector(
							'.ub_countdown_second'
						).innerHTML = seconds < 0 ? seconds : seconds + 100;
					} else {
						instance.querySelector(
							'.ub_countdown_week'
						).innerHTML = weeks;
						instance.querySelector(
							'.ub_countdown_day'
						).innerHTML = days;
						instance.querySelector(
							'.ub_countdown_hour'
						).innerHTML = hours;
						instance.querySelector(
							'.ub_countdown_minute'
						).innerHTML = minutes;
						instance.querySelector(
							'.ub_countdown_second'
						).innerHTML = seconds;
					}

					if (
						instance.querySelector(
							'.ub_countdown_circular_container'
						)
					) {
						instance.querySelector(
							'.ub_countdown_circle_week .ub_countdown_circle_path'
						).style.strokeDasharray = `${(weeks * 219.911) /
							52}px, 219.911px`;
						instance.querySelector(
							'.ub_countdown_circle_week .ub_countdown_circle_trail'
						).style.strokeLinecap = weeks > 0 ? 'round' : 'butt';
						instance.querySelector(
							'.ub_countdown_circle_day .ub_countdown_circle_path'
						).style.strokeDasharray = `${(days * 219.911) /
							7}px, 219.911px`;
						instance.querySelector(
							'.ub_countdown_circle_day .ub_countdown_circle_trail'
						).style.strokeLinecap = days > 0 ? 'round' : 'butt';
						instance.querySelector(
							'.ub_countdown_circle_hour .ub_countdown_circle_path'
						).style.strokeDasharray = `${(hours * 219.911) /
							24}px, 219.911px`;
						instance.querySelector(
							'.ub_countdown_circle_hour .ub_countdown_circle_trail'
						).style.strokeLinecap = hours > 0 ? 'round' : 'butt';
						instance.querySelector(
							'.ub_countdown_circle_minute .ub_countdown_circle_path'
						).style.strokeDasharray = `${(minutes * 219.911) /
							60}px, 219.911px`;
						instance.querySelector(
							'.ub_countdown_circle_minute .ub_countdown_circle_trail'
						).style.strokeLinecap = minutes > 0 ? 'round' : 'butt';
						instance.querySelector(
							'.ub_countdown_circle_second .ub_countdown_circle_path'
						).style.strokeDasharray = `${(seconds * 219.911) /
							60}px, 219.911px`;
						instance.querySelector(
							'.ub_countdown_circle_second .ub_countdown_circle_trail'
						).style.strokeLinecap = seconds > 0 ? 'round' : 'butt';
					}
				} else {
					clearInterval(timer[i]);
					instance.innerHTML = instance.getAttribute(
						'data-expirymessage'
					);
				}
			}, 1000);
		});
});
