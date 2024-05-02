import { isEmpty, get } from "lodash";
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { useState, useRef, useMemo, useEffect } from "react";
import CustomMediaPlaceholder from "./media-placeholder";
import { ResizableBox } from "@wordpress/components";
import {
	RichText,
	useBlockProps,
	__experimentalGetElementClassName,
	__experimentalImageEditor as ImageEditor,
	sore as blockEditorStore,
} from "@wordpress/block-editor";
import Image from "./image";
import Inspector from "./inspector";
import BlockControls from "./block-controls";
import classNames from "classnames";
import { getImageSize } from "./get-styles";
import { store as noticesStore } from "@wordpress/notices";

function Edit(props) {
	const { attributes, setAttributes, isSelected } = props;
	const { media, height, width, caption, align } = attributes;
	const [showCaption, setShowCaption] = useState(!!caption);
	const [isImageEditing, setIsEditingImage] = useState(false);
	const imageRef = useRef();
	const { getSettings } = useSelect("core/block-editor");
	const { createErrorNotice } = useDispatch(noticesStore);
	const blockProps = useBlockProps({
		className: classNames({
			[`align${align}`]: align !== "",
		}),
	});
	const hasImage = !isEmpty(media);
	const { toggleSelection } = useDispatch("core/block-editor");
	const { naturalWidth, naturalHeight, imageUrl } = useMemo(() => {
		return {
			imageUrl: imageRef.current?.src || "",
			naturalWidth: imageRef.current?.naturalWidth || undefined,
			naturalHeight: imageRef.current?.naturalHeight || undefined,
		};
	}, [imageRef.current?.complete]);

	const onResizeStart = () => {
		toggleSelection(false);
	};

	const onResizeStop = () => {
		toggleSelection(true);
	};

	// clientWidth needs to be a number for the image Cropper to work, but sometimes it's 0
	// So we try using the imageRef width first and fallback to clientWidth.
	const fallbackClientWidth = imageRef.current?.width;
	const id = get(media, "id", "");
	const sizeSlug = get(attributes, "sizeSlug", "large");
	// The only supported unit is px, so we can parseInt to strip the px here.
	const numericWidth = width ? parseInt(width, 10) : undefined;
	const numericHeight = height ? parseInt(height, 10) : undefined;

	useEffect(() => {
		if (!numericWidth || !naturalWidth || !naturalHeight) {
			return;
		}
		let ratio = 1;

		if (!attributes.aspectRatio) {
			ratio = (naturalWidth || 1) / (naturalHeight || 1);
		} else {
			const sratio = attributes.aspectRatio.split("/", 2);
			if (sratio.length > 1) {
				ratio = parseInt(sratio[0]) / parseInt(sratio[1]);
			}
		}
		let h = numericWidth / ratio;
		setAttributes({
			height: `${h}px`,
		});
	}, [attributes.aspectRatio]);
	const imageSize = getImageSize(width, height);
	function onSelectImage(media) {
		if (!media || !media.url) {
			setAttributes({
				media: {},
			});
		} else {
			let alt = media.alt;
			setAttributes({ media, alt });
		}
	}
	function onSelectURL(newURL) {
		if (newURL !== media.url) {
			setAttributes({
				media: { url: newURL },
				id: undefined,
				sizeSlug: getSettings().imageDefaultSize,
			});
		}
	}
	function onUploadError(message) {
		createErrorNotice(message, { type: "snackbar" });
		setAttributes({
			id: undefined,
			media: undefined,
		});
	}
	return (
		<figure {...blockProps}>
			{hasImage && (
				<>
					<BlockControls
						setIsEditingImage={setIsEditingImage}
						showCaption={showCaption}
						setShowCaption={setShowCaption}
						attributes={attributes}
						setAttributes={setAttributes}
						onSelectImage={onSelectImage}
						onSelectURL={onSelectURL}
						onUploadError={onUploadError}
					/>
					{!isImageEditing && (
						<ResizableBox
							size={imageSize}
							showHandle={isSelected}
							minWidth={"50"}
							minHeight={"50"}
							enable={{
								top: false,
								right: true,
								bottom: true,
								left: false,
							}}
							onResize={(_, direction, elt) => {
								let ratio = 1;

								if (!attributes.aspectRatio) {
									ratio = (naturalWidth || 1) / (naturalHeight || 1);
								} else {
									const sratio = attributes.aspectRatio.split("/", 2);
									if (sratio.length > 1) {
										ratio = parseInt(sratio[0]) / parseInt(sratio[1]);
									}
								}
								let w = elt.offsetWidth;
								let h = elt.offsetHeight;

								if (direction === "bottom") {
									w = h * ratio;
								} else {
									h = w / ratio;
								}

								setAttributes({
									width: `${w}px`,
									height: `${h}px`,
								});
							}}
							onResizeStart={onResizeStart}
							onResizeStop={() => {
								onResizeStop();
							}}
						>
							<Image
								imageRef={imageRef}
								attributes={attributes}
								setAttributes={setAttributes}
							/>
							{showCaption && (!RichText.isEmpty(caption) || isSelected) && (
								<RichText
									identifier="caption"
									className={__experimentalGetElementClassName("caption")}
									tagName="figcaption"
									aria-label={__("Image caption text", "ultimate-blocks")}
									placeholder={__("Add caption", "ultimate-blocks")}
									value={caption}
									onChange={(value) => setAttributes({ caption: value })}
									inlineToolbar
								/>
							)}
						</ResizableBox>
					)}
					{isImageEditing && (
						<ImageEditor
							id={id}
							url={imageUrl}
							width={numericWidth}
							height={numericHeight}
							clientWidth={fallbackClientWidth}
							naturalHeight={naturalHeight}
							naturalWidth={naturalWidth}
							onSaveImage={(imageAttributes) => {
								setAttributes({
									media: {
										...media,
										...imageAttributes,
										sizes: {
											...media.sizes,
											[sizeSlug]: {
												...media.sizes[sizeSlug],
												...imageAttributes,
											},
										},
									},
								});
							}}
							onFinishEditing={() => {
								setIsEditingImage(false);
							}}
						/>
					)}
					<Inspector attributes={attributes} setAttributes={setAttributes} />
				</>
			)}
			{!hasImage && (
				<CustomMediaPlaceholder
					onSelectImage={onSelectImage}
					onSelectURL={onSelectURL}
					onUploadError={onUploadError}
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			)}
		</figure>
	);
}

export default Edit;
