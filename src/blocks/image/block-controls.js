import { get } from "lodash";
import { __ } from "@wordpress/i18n";
import { useEffect } from "react";
import { caption as captionIcon, crop } from "@wordpress/icons";
import {
	BlockControls as WPBlockControls,
	MediaReplaceFlow,
	__experimentalImageURLInputUI as ImageURLInputUI,
	BlockAlignmentControl,
} from "@wordpress/block-editor";
import { usePrevious } from "@wordpress/compose";
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";

function BlockControls(props) {
	const {
		attributes,
		setAttributes,
		setShowCaption,
		showCaption,
		setIsEditingImage,
		onSelectImage,
		onSelectURL,
		onUploadError,
	} = props;
	const {
		media,
		caption,
		linkClass,
		linkDestination,
		linkTarget,
		href,
		rel,
		align,
	} = attributes;
	const prevCaption = usePrevious(caption);

	useEffect(() => {
		if (caption && !prevCaption) {
			setShowCaption(true);
		}
	}, [caption, prevCaption]);
	const imageUrl = get(media, "url", "");
	const mediaId = get(media, "id", -1);
	const imageLink = get(media, "link", "");
	function onSetHref(props) {
		setAttributes(props);
	}

	return (
		<>
			<WPBlockControls group={"block"}>
				<BlockAlignmentControl
					value={align}
					onChange={(newVal) => {
						setAttributes({ align: newVal });
					}}
				/>
				<ToolbarButton
					onClick={() => {
						setShowCaption(!showCaption);
						if (showCaption && caption) {
							setAttributes({ caption: undefined });
						}
					}}
					icon={captionIcon}
					isPressed={showCaption}
					label={showCaption ? __("Remove caption") : __("Add caption")}
				/>
				<ImageURLInputUI
					url={href || ""}
					onChangeUrl={onSetHref}
					linkDestination={linkDestination}
					mediaUrl={imageUrl}
					mediaLink={imageLink}
					linkTarget={linkTarget}
					linkClass={linkClass}
					rel={rel}
				/>
				{mediaId !== -1 && (
					<ToolbarButton
						onClick={() => setIsEditingImage(true)}
						icon={crop}
						label={__("Crop", "ultimate-blocks")}
					/>
				)}
			</WPBlockControls>
			<WPBlockControls>
				<ToolbarGroup>
					<MediaReplaceFlow
						mediaURL={imageUrl}
						mediaId={mediaId}
						onError={onUploadError}
						onSelect={onSelectImage}
						onSelectURL={onSelectURL}
						name={__("Replace", "ultimate-blocks")}
					/>
				</ToolbarGroup>
			</WPBlockControls>
		</>
	);
}
export default BlockControls;
