import { MediaReplaceFlow, BlockControls } from "@wordpress/block-editor";

function AdvancedVideoBlockControls(props) {
	const { value, url, onSelectVideo, onSelectURL, onUploadError } = props;
	return (
		<BlockControls group="other">
			<MediaReplaceFlow
				mediaId={value}
				mediaURL={url}
				allowedTypes={["video"]}
				accept="image/*"
				onSelect={onSelectVideo}
				onSelectURL={onSelectURL}
				onError={onUploadError}
			/>
		</BlockControls>
	);
}
export default AdvancedVideoBlockControls;
