import { Component } from "react";

import Flickity from "react-flickity-component";

export class Slider extends Component {
	componentDidMount() {
		this.flkty.on("select", () => {
			this.props.setActiveSlide(this.flkty.selectedIndex);
		});
	}
	shouldComponentUpdate(newProps, newState) {
		const oldCaptions = this.props.slides
			.filter(s => Array.isArray(s))[0]
			.map(slide => slide.props.children[1].props.value);

		const newCaptions = newProps.slides
			.filter(s => Array.isArray(s))[0]
			.map(slide => slide.props.children[1].props.value);

		const oldImages = this.props.slides
			.filter(s => Array.isArray(s))[0]
			.map(slide => slide.props.children[0].props.src);

		const newImages = newProps.slides
			.filter(s => Array.isArray(s))[0]
			.map(slide => slide.props.children[0].props.src);

		const imagesChanged = !oldImages.every((img, i) => img === newImages[i]);

		const indexUnchanged =
			this.props.options.initialIndex === newProps.options.initialIndex;

		const captionUnchanged = oldCaptions.every(
			(caption, i) => caption === newCaptions[i]
		);

		return (indexUnchanged && captionUnchanged) || imagesChanged;
	}
	render() {
		return (
			<Flickity
				elementType={"div"}
				flickityRef={c => (this.flkty = c)}
				options={this.props.options}
				reloadOnUpdate={true}
				imagesLoaded={true}
			>
				{this.props.slides}
			</Flickity>
		);
	}
}
