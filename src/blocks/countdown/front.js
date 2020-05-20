document.addEventListener("DOMContentLoaded", () => {
	let timer = [];
	const timeUnits = ["week", "day", "hour", "minute", "second"];
	Array.prototype.slice
		.call(document.getElementsByClassName("ub-countdown"))
		.forEach((instance, i) => {
			timer[i] = setInterval(function () {
				const timeLeft =
					parseInt(instance.getAttribute("data-enddate")) -
					Math.floor(Date.now() / 1000);
				const largestUnit = instance.getAttribute("data-largestunit");
				const smallestunit = instance.getAttribute("data-smallestunit");

				const seconds = timeLeft % 60;
				const minutes = ((timeLeft - seconds) % 3600) / 60;

				let hours = (timeLeft - minutes * 60 - seconds) / 3600;
				if (timeUnits.indexOf(largestUnit) < 2) {
					hours %= 24;
				}

				let days = (timeLeft - hours * 3600 - minutes * 60 - seconds) / 86400;
				if (largestUnit === "week") {
					days %= 7;
				}

				const weeks =
					(timeLeft - days * 86400 - hours * 3600 - minutes * 60 - seconds) /
					604800;

				if (timeLeft >= 0) {
					if (instance.querySelector(".ub_countdown_week"))
						instance.querySelector(".ub_countdown_week").innerHTML = weeks;
					if (instance.querySelector(".ub_countdown_day"))
						instance.querySelector(".ub_countdown_day").innerHTML = days;
					if (instance.querySelector(".ub_countdown_hour"))
						instance.querySelector(".ub_countdown_hour").innerHTML = hours;
					if (instance.querySelector(".ub_countdown_minute"))
						instance.querySelector(".ub_countdown_minute").innerHTML = minutes;
					if (instance.querySelector(".ub_countdown_second"))
						instance.querySelector(".ub_countdown_second").innerHTML = seconds;

					if (instance.querySelector(".ub_countdown_circular_container")) {
						if (instance.querySelector(".ub_countdown_circle_week")) {
							instance.querySelector(
								".ub_countdown_circle_week .ub_countdown_circle_path"
							).style.strokeDasharray = `${
								(weeks * 219.911) / 52
							}px, 219.911px`;
							instance.querySelector(
								".ub_countdown_circle_week .ub_countdown_circle_trail"
							).style.strokeLinecap = weeks > 0 ? "round" : "butt";
						}
						if (instance.querySelector(".ub_countdown_circle_day")) {
							instance.querySelector(
								".ub_countdown_circle_day .ub_countdown_circle_path"
							).style.strokeDasharray = `${(days * 219.911) / 7}px, 219.911px`;
							instance.querySelector(
								".ub_countdown_circle_day .ub_countdown_circle_trail"
							).style.strokeLinecap = days > 0 ? "round" : "butt";
						}
						if (instance.querySelector(".ub_countdown_circle_hour")) {
							instance.querySelector(
								".ub_countdown_circle_hour .ub_countdown_circle_path"
							).style.strokeDasharray = `${
								(hours * 219.911) / 24
							}px, 219.911px`;
							instance.querySelector(
								".ub_countdown_circle_hour .ub_countdown_circle_trail"
							).style.strokeLinecap = hours > 0 ? "round" : "butt";
						}
						if (instance.querySelector(".ub_countdown_circle_minute")) {
							instance.querySelector(
								".ub_countdown_circle_minute .ub_countdown_circle_path"
							).style.strokeDasharray = `${
								(minutes * 219.911) / 60
							}px, 219.911px`;
							instance.querySelector(
								".ub_countdown_circle_minute .ub_countdown_circle_trail"
							).style.strokeLinecap = minutes > 0 ? "round" : "butt";
						}
						if (instance.querySelector(".ub_countdown_circle_second")) {
							instance.querySelector(
								".ub_countdown_circle_second .ub_countdown_circle_path"
							).style.strokeDasharray = `${
								(seconds * 219.911) / 60
							}px, 219.911px`;
							instance.querySelector(
								".ub_countdown_circle_second .ub_countdown_circle_trail"
							).style.strokeLinecap = seconds > 0 ? "round" : "butt";
						}
					}
				} else {
					clearInterval(timer[i]);
					instance.innerHTML = instance.getAttribute("data-expirymessage");
				}
			}, 1000);
		});
});
