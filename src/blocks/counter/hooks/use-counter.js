import { useState, useEffect, useRef } from "@wordpress/element";

export function useCounter(attributes) {
	const { startNumber, endNumber, animationDuration: duration } = attributes;
	const [counter, setCounter] = useState(0);
	const interval = useRef(null);
	useEffect(() => {
		setCounter(parseInt(startNumber ?? "0", 10));
		if (interval.current !== null) {
			clearInterval(interval.current);
		}
		const startCount = parseInt(startNumber ?? "0", 10);
		const stopCounter = parseInt(endNumber, 10);
		const animationDuration = parseInt(duration, 10);
		const frameDuration = 1000 / 60;
		const totalFrames = Math.round((animationDuration * 1000) / frameDuration);
		const easeOutQuad = (t) => t * (2 - t);
		let frame = 0;
		const countTo = stopCounter - startCount;
		interval.current = setInterval(() => {
			frame++;

			const progress = easeOutQuad(frame / totalFrames);
			const currentCount = Math.round(countTo * progress) + startCount;

			if (
				parseInt(counter, 10) !== currentCount ||
				parseInt(counter, 10) >= currentCount
			) {
				setCounter(currentCount);
			}

			if (frame === totalFrames) {
				clearInterval(interval.current);
			}
		}, frameDuration);
	}, [startNumber, endNumber, duration]);

	return counter;
}
