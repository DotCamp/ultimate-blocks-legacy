document.addEventListener("DOMContentLoaded", () => {
	let timer = [];
	let initialValue = [];

	const timeUnits = ["week", "day", "hour", "minute", "second"];
	Array.prototype.slice
		.call(document.getElementsByClassName("ub-countdown"))
		.forEach((instance, i) => {
			timer[i] = setInterval(function () {
				const timeLeft =
					parseInt(instance.getAttribute("data-enddate")) -
					Math.floor(Date.now() / 1000);
				const largestUnit = instance.getAttribute("data-largestunit");
				const smallestUnit = instance.getAttribute("data-smallestunit");

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

				let animationDirection = "decrease";

				const generateValue = (arr) =>
					arr.reduce(
						(sum, currDigit, j) => sum + 10 ** (arr.length - j - 1) * currDigit,
						0
					);

				if (!initialValue[i]) {
					//use queryselector only once, then use saved value in future iterations of the loop
					initialValue[i] = Array.prototype.slice
						.call(instance.querySelectorAll(".ub-countdown-odometer"))
						.map((unit) =>
							Array.prototype.slice
								.call(unit.children)
								.map((c) => parseInt(c.innerHTML))
						);

					const conversionFactor = [7, 24, 60, 60, 1];

					if (largestUnit && smallestUnit) {
						const amounts = Array(timeUnits.indexOf(largestUnit))
							.fill(0)
							.concat(
								initialValue[i].map((arr) => generateValue(arr)),
								Array(4 - timeUnits.indexOf(smallestUnit)).fill(0)
							);

						if (
							timeLeft >
							amounts.reduce(
								(total, current, j) =>
									total +
									current *
										conversionFactor
											.slice(j, 4)
											.reduce((curFactor, current) => curFactor * current, 1),
								0
							)
						) {
							animationDirection = "increase";
						}
					}
				}

				if (timeLeft >= 0) {
					if (instance.querySelector(".ub-countdown-odometer-container")) {
						const breakIntoDigits = (num, minDigits) => {
							//adapted from from https://stackoverflow.com/a/7784664
							let digits = [];
							while (num > 0) {
								digits.push(num % 10);
								num = parseInt(num / 10);
							}

							const missingDigits = minDigits - digits.length;
							return (
								missingDigits > 0 ? Array(missingDigits).fill(0) : []
							).concat(digits.reverse());
						};

						const integerArray = (limit1, limit2) => {
							if (limit1 === limit2) {
								return [limit1];
							} else if (limit1 < limit2) {
								return Array.apply(null, Array(limit2 - limit1 + 1))
									.map((_, i) => i)
									.map((a) => a + limit1);
							} else {
								return Array.apply(null, Array(limit1 - limit2 + 1))
									.map((_, i) => i)
									.map((a) => limit1 - a);
							}
						};

						//make array of max values
						const timeUnits = ["week", "day", "hour", "minute", "second"];
						let maxValues = [0, 6, 23, 59, 59].slice(
							timeUnits.indexOf(largestUnit),
							timeUnits.indexOf(smallestUnit) + 1
						);

						if (timeUnits.indexOf(largestUnit) < 3) {
							maxValues[0] = 0;
						}

						let replacements = [weeks, days, hours, minutes, seconds]
							.slice(
								timeUnits.indexOf(largestUnit),
								timeUnits.indexOf(smallestUnit) + 1
							)
							.map((r, j) =>
								breakIntoDigits(
									r,
									Math.floor(
										Math.log10(
											maxValues[j] ||
												Math.max(generateValue(initialValue[i][j]), r) ||
												1
										) + 1
									)
								)
							);

						let incomingDigits = []; //should also contain digits for other values

						initialValue[i].forEach((display, j) => {
							if (display.every((digit, k) => digit === replacements[j][k])) {
								incomingDigits.push(display);
							} else {
								const currentValue = generateValue(display);

								const newValue = generateValue(replacements[j]);

								const digitCount = maxValues[j]
									? Math.floor(Math.log10(maxValues[j])) + 1
									: currentValue === 0 && newValue === 0
									? 1
									: Math.floor(Math.log10(Math.max(currentValue, newValue))) +
									  1;

								const addExtraZeroes = (arr, targetLength) =>
									[].concat(Array(targetLength - arr.length).fill(0), arr);

								if (display.length < digitCount) {
									addExtraZeroes(display, digitCount);
								}

								if (replacements[j].count < digitCount) {
									addExtraZeroes(replacements[j], digitCount);
								}

								if (animationDirection === "increase") {
									let maxDigits = breakIntoDigits(maxValues[j] || newValue);
									if (maxDigits.length === 0) {
										maxDigits = [0];
									}

									let extraDigits = [];
									let prevDigits = [];

									incomingDigits.push(
										replacements[j].map((d, k) => {
											let currentMax =
												display[k - 1] === maxDigits[k - 1] ? maxDigits[i] : 9;

											if (prevDigits.length > 1) {
												let prevDigits2 = prevDigits.slice(
													1,
													prevDigits.length - 1
												);
												let cycle = prevDigits2.map((p) =>
													integerArray(
														0,
														maxDigits[k - 1] === p ? maxDigits[k] : 9
													)
												);
												extraDigits = cycle.reduce(
													(prev, curr) => prev.concat(curr),
													[]
												);
											}

											if (d === display[k]) {
												if (newValue > currentValue) {
													prevDigits =
														prevDigits.length > 0
															? integerArray(d, currentMax).concat(
																	extraDigits,
																	integerArray(0, d)
															  )
															: [d];
												} else {
													prevDigits = extraDigits.concat(integerArray(0, d));
												}
											} else if (display[k] < d) {
												if (prevDigits.length > 1) {
													prevDigits = integerArray(
														display[k],
														currentMax
													).concat(extraDigits, integerArray(0, d));
												} else {
													prevDigits = integerArray(display[k], d);
												}
											} else {
												prevDigits = integerArray(
													display[k],
													currentMax
												).concat(extraDigits, integerArray(0, d));
											}
											return prevDigits.length > 1 ? prevDigits : d;
										})
									);
								} else if (animationDirection === "decrease") {
									let maxDigits = breakIntoDigits(maxValues[j] || currentValue);

									if (maxDigits.length === 0) {
										maxDigits = [0];
									}

									let extraDigits = [];
									let prevDigits = [];

									incomingDigits.push(
										replacements[j].map((d, k) => {
											let currentMax =
												replacements[j][k - 1] === maxDigits[k - 1]
													? maxDigits[k]
													: 9;

											if (prevDigits.length > 1) {
												let prevDigits2 = prevDigits.slice(
													1,
													prevDigits.length - 1
												);
												let cycle = prevDigits2.map((p) =>
													integerArray(
														0,
														maxDigits[k - 1] === p ? maxDigits[k] : 9
													)
												);
												extraDigits = cycle.reduce(
													(prev, curr) => prev.concat(curr),
													[]
												);
											}

											if (d === display[k]) {
												if (newValue < currentValue) {
													prevDigits =
														prevDigits.length > 0
															? integerArray(d, currentMax).concat(
																	extraDigits,
																	integerArray(0, d)
															  )
															: [d];
												} else {
													prevDigits = integerArray(d, currentMax).concat(
														extraDigits,
														integerArray(0, d)
													);
												}
											} else if (display[k] > d) {
												if (prevDigits.length > 1) {
													prevDigits = integerArray(d, currentMax).concat(
														extraDigits,
														integerArray(0, display[k])
													);
												} else {
													prevDigits = integerArray(d, display[k]);
												}
											} else {
												prevDigits = integerArray(d, currentMax).concat(
													extraDigits,
													integerArray(0, display[k])
												);
											}
											return prevDigits.length > 1 ? prevDigits : d;
										})
									);
								}
							}
						});

						let odometerSlot = Array.prototype.slice
							.call(instance.querySelectorAll(".ub-countdown-odometer"))
							.map((a) => Array.prototype.slice.call(a.children));

						let finishedTransitions = 0;

						const transitionCount = incomingDigits
							.reduce(
								(collection, currentArray) => collection.concat(currentArray),
								[]
							)
							.filter((a) => Array.isArray(a)).length;

						const removeExtraZeroes = () => {
							maxValues.forEach((m, j) => {
								if (m === 0) {
									//at least one extra leading zero is spotted
									if (initialValue[i][j][0] === 0) {
										const curVal = generateValue(initialValue[i][j]);

										const targetLength =
											(curVal ? Math.floor(Math.log10(curVal)) : 0) + 1;

										//eliminate element containing extra zero

										odometerSlot[j]
											.slice(0, initialValue[i][j].length - targetLength)
											.forEach((o) => {
												o.parentNode.removeChild(o);
											});

										initialValue[i][j] = initialValue[i][j].slice(
											initialValue[i][j].length - targetLength
										);
									}
								}
							});
						};

						incomingDigits.forEach((arr, j) => {
							arr.forEach((d, k) => {
								if (Array.isArray(d)) {
									odometerSlot[j][k].classList.add(
										"ub-countdown-odometer-digits"
									);
									odometerSlot[j][k].classList.remove(
										"ub-countdown-odometer-digit"
									);

									odometerSlot[j][k].innerHTML = d
										.map(
											(dd) => `<div class="odometer-moving-digit">${dd}</div>`
										)
										.join("");

									//do pre-animation prep
									if (animationDirection === "decrease") {
										odometerSlot[j][k].style.transform = `translateY(${
											100 * (1 / d.length - 1)
										}%)`;
									}

									//animate
									setTimeout(() => {
										odometerSlot[j][k].style.transition = "all 0.3s";
										if (animationDirection === "increase") {
											odometerSlot[j][k].style.transform = `translateY(${
												100 * (1 / d.length - 1)
											}%)`;
										} else {
											odometerSlot[j][k].style.transform = "translateY(0px)";
										}
										//event listener for end of animation
										odometerSlot[j][k].addEventListener(
											"transitionend",
											() => {
												//switch to pre-animation style
												odometerSlot[j][k].classList.add(
													"ub-countdown-odometer-digit"
												);
												odometerSlot[j][k].classList.remove(
													"ub-countdown-odometer-digits"
												);
												odometerSlot[j][k].removeAttribute("style");

												//check if there are leading zeroes to be removed
												odometerSlot[j][k].innerHTML = replacements[j][k];
												initialValue[i][j][k] = replacements[j][k];

												finishedTransitions++;

												if (finishedTransitions === transitionCount) {
													removeExtraZeroes();
												}
											},
											{ once: true }
										);
									}, 40);
								}
							});
						});

						animationDirection = "decrease";
					} else {
						if (instance.querySelector(".ub_countdown_week"))
							instance.querySelector(".ub_countdown_week").innerHTML = weeks;
						if (instance.querySelector(".ub_countdown_day"))
							instance.querySelector(".ub_countdown_day").innerHTML = days;
						if (instance.querySelector(".ub_countdown_hour"))
							instance.querySelector(".ub_countdown_hour").innerHTML = hours;
						if (instance.querySelector(".ub_countdown_minute"))
							instance.querySelector(".ub_countdown_minute").innerHTML =
								minutes;
						if (instance.querySelector(".ub_countdown_second"))
							instance.querySelector(".ub_countdown_second").innerHTML =
								seconds;

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
								).style.strokeDasharray = `${
									(days * 219.911) / 7
								}px, 219.911px`;
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
					}
				} else {
					clearInterval(timer[i]);
					if (!isNaN(timeLeft)) {
						instance.innerHTML = instance.getAttribute("data-expirymessage");
					}
				}
			}, 1000);
		});
});
