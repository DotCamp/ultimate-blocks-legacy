/**
 * Post grid featured image.
 */

const { addQueryArgs } = wp.url;
const { apiFetch } = wp;
import { useEffect, useState } from "react";

export default function FeaturedImage(props) {
	const [stillMounted, setStillMounted] = useState(false);
	const [imageUrl, setImageUrl] = useState("");

	useEffect(() => {
		setStillMounted(true);

		return () => setStillMounted(false);
	}, []);

	useEffect(() => {
		if (stillMounted) {
			apiFetch({
				path: addQueryArgs("/wp/v2/media/" + props.imgID),
			}).then((image_data) => {
				let imageUrl = image_data?.media_details?.sizes["full"]?.source_url;

				if (imageUrl) {
					setImageUrl(imageUrl);
				}
			});
		}
	}, [stillMounted]);

	const { postImageWidth, preservePostImageAspectRatio, postImageHeight } =
		props.attributes;

	return (
		<img
			style={{
				width: postImageWidth,
				...(!preservePostImageAspectRatio && { height: postImageHeight }),
			}}
			src={imageUrl || props.imgSizeLandscape}
			alt="img"
		/>
	);
}
