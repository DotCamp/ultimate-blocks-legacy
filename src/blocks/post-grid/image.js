/**
 * Post grid featured image.
 */

const { addQueryArgs } = wp.url;
const { apiFetch } = wp;
const { Component } = wp.element;

export default class FeaturedImage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageUrl: "",
			image_data: [],
			loaded: false,
		};
	}

	componentDidMount() {
		this.stillMounted = true;
		this.fetchRequest = apiFetch({
			path: addQueryArgs("/wp/v2/media/" + this.props.imgID),
		})
			.then((image_data) => {
				if (this.stillMounted) {
					this.setState({ image_data });
					this.setImageUrl();
				}
			})
			.catch(() => {
				if (this.stillMounted) {
					this.setState({ image_data: [] });
				}
			});
	}

	componentWillUnmount() {
		this.stillMounted = false;
	}

	setImageUrl = () => {
		let imageUrl = this.getImageUrl();

		if (!imageUrl) {
			this.setState({ loaded: true });
		} else {
			this.setState({ imageUrl });
		}
	};

	getImageUrl = () =>
		this.state.image_data?.media_details?.sizes["full"]?.source_url;

	render() {
		const { imageUrl } = this.state;
		const {
			postImageWidth,
			preservePostImageAspectRatio,
			postImageHeight,
		} = this.props.attributes;

		return (
			<img
				style={{
					width: postImageWidth,
					...(!preservePostImageAspectRatio && { height: postImageHeight }),
				}}
				src={imageUrl || this.props.imgSizeLandscape}
				alt="img"
			/>
		);
	}
}
