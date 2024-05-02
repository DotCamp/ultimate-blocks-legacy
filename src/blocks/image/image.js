import { get } from "lodash";
import { getImageStyles } from "./get-styles";

function Image(props) {
	const { attributes, imageRef } = props;

	const sizeSlug = get(attributes, "sizeSlug", "large");
	const imageSrc = get(
		attributes,
		`media.sizes.${sizeSlug}.url`,
		attributes.media?.url ?? "",
	);
	const mediaAlt = get(attributes, "alt", "");

	const styles = getImageStyles(attributes);
	return <img ref={imageRef} style={styles} src={imageSrc} alt={mediaAlt} />;
}

export default Image;
