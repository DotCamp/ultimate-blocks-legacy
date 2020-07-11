import { Component } from "react";

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export class Slider extends Component {
	constructor(props) {
		super(props);
		this.state = { updateDetected: false };
	}
	render() {
		const currentSlides = this.props.slides;

		const customProps = {
			initialSlide: this.props.initialSlide,
			loop: this.props.wrapAround,
			simulateTouch: this.props.draggable,
			...(this.props.paginationType !== "none" && {
				pagination: { clickable: true, type: this.props.paginationType },
			}),
			...(this.props.autoplay > 0 && {
				autoplay: {
					delay: this.props.autoplay * 1000,
					disableOnInteraction: false,
				},
			}),
			effect: this.props.transition,
		};

		return (
			<Swiper
				navigation
				{...customProps}
				onSlideChange={() => {
					if (this.swiper) {
						this.props.setActiveSlide(this.swiper.realIndex);
					}
				}}
				onSwiper={(swiper) => (this.swiper = swiper)}
			>
				{currentSlides.map(
					(slide) => slide && <SwiperSlide>{slide}</SwiperSlide>
				)}
			</Swiper>
		);
	}
}
