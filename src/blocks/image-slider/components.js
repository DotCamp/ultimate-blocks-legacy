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
		};

		return (
			<Swiper
				//shouldSwiperUpdate={true}
				rebuildOnUpdate={true} //probably not working for rerendering after settings change
				observer={true}
				//cssMode={true}
				initialSlide={this.props.initialSlide}
				navigation
				{...customProps}
				onSlideChange={(_) => {
					if (this.swiper) {
						console.log(`slide ${this.swiper.realIndex} is active`);
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
