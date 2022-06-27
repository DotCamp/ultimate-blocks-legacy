import { useState } from "react";

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export function Slider(props) {
	const [currentSwiper, initializeSwiper] = useState(null);

	const currentSlides = props.slides;

	const customProps = {
		initialSlide: props.initialSlide,
		loop: props.wrapAround,
		simulateTouch: props.draggable,
		...(props.paginationType !== "none" && {
			pagination: { clickable: true, type: props.paginationType },
		}),
		...(props.autoplay > 0 && {
			autoplay: {
				delay: props.autoplay * 1000,
				disableOnInteraction: false,
			},
		}),
		effect: props.transition,
	};

	return (
		<Swiper
			navigation
			{...customProps}
			onSlideChange={() => {
				if (currentSwiper) {
					//might break
					props.setActiveSlide(currentSwiper.realIndex);
				}
			}}
			onSwiper={(swiper) => initializeSwiper(swiper)} //might break
		>
			{currentSlides.map(
				(slide) => slide && <SwiperSlide>{slide}</SwiperSlide>
			)}
		</Swiper>
	);
}
