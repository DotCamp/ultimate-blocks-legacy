import { __ } from "@wordpress/i18n";
import { Placeholder } from "@wordpress/components";
import { MediaPlaceholder } from "@wordpress/block-editor";
import icon from "./icon";

const placeholder = (content) => {
	return (
		<Placeholder
			className="block-editor-media-placeholder"
			withIllustration={true}
			icon={icon}
			label={__("Select Video Source", "ultimate-blocks")}
			instructions={__(
				"Upload a video file, pick one from your media library, or add one with a URL.",
			)}
		>
			{content}
		</Placeholder>
	);
};
function AdvancedVideoPlaceholder(props) {
	return (
		<MediaPlaceholder
			icon={icon}
			allowedTypes={["video"]}
			onSelect={props.onSelectVideo}
			onSelectURL={props.onSelectURL}
			accept="video/*"
			value={props.value}
			onError={props.onUploadError}
			placeholder={placeholder}
		/>
	);
}
export default AdvancedVideoPlaceholder;
