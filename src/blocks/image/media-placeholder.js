import { get } from "lodash";
import { __ } from "@wordpress/i18n";
import { Placeholder } from "@wordpress/components";
import { image as imageIcon } from "@wordpress/icons";
import { MediaPlaceholder } from "@wordpress/block-editor";
import { isBlobURL } from "@wordpress/blob";

export const isExternalImage = (id, url) => url && !id && !isBlobURL(url);

function CustomMediaPlaceholder(props) {
	const {
		attributes: { media, sizeSlug },
		onSelectImage,
		onSelectURL,
		onUploadError,
	} = props;

	const placeholder = (content) => {
		return (
			<Placeholder
				className={"block-editor-media-placeholder"}
				withIllustration={true}
				icon={imageIcon}
				label={__("Image", "ultimate-blocks")}
				instructions={__(
					"Upload an image file, pick one from your media library, or add one with a URL.",
					"ultimate-blocks",
				)}
			>
				{content}
			</Placeholder>
		);
	};

	const url = get(
		props.attributes,
		`media.sizes.${sizeSlug}.url`,
		props.attributes.media?.url ?? "",
	);
	const id = get(media, "id", -1);
	const isExternal = isExternalImage(id, url);

	const src = isExternal ? url : undefined;
	const mediaPreview = !!url && (
		<img
			alt={__("Edit image")}
			title={__("Edit image")}
			className={"edit-image-preview"}
			src={url}
		/>
	);

	return (
		<MediaPlaceholder
			icon={imageIcon}
			accept="image/*"
			placeholder={placeholder}
			onError={onUploadError}
			onSelect={onSelectImage}
			onSelectURL={onSelectURL}
			allowedTypes={["image"]}
			value={{ id, src }}
			mediaPreview={mediaPreview}
		/>
	);
}
export default CustomMediaPlaceholder;
