function MediaReplaceControl() {
	return (
		<Dropdown
			popoverProps={popoverProps}
			contentClassName="block-editor-media-replace-flow__options"
			renderToggle={({ isOpen, onToggle }) => (
				<ToolbarButton
					ref={editMediaButtonRef}
					aria-expanded={isOpen}
					aria-haspopup="true"
					onClick={onToggle}
					onKeyDown={openOnArrowDown}
				>
					{name}
				</ToolbarButton>
			)}
			renderContent={({ onClose }) => (
				<>
					<NavigableMenu className="block-editor-media-replace-flow__media-upload-menu">
						<MediaUploadCheck>
							<MediaUpload
								gallery={gallery}
								addToGallery={addToGallery}
								multiple={multiple}
								value={multiple ? mediaIds : mediaId}
								onSelect={(media) => selectMedia(media, onClose)}
								allowedTypes={allowedTypes}
								render={({ open }) => (
									<MenuItem icon={mediaIcon} onClick={open}>
										{__("Open Media Library")}
									</MenuItem>
								)}
							/>
							<FormFileUpload
								onChange={(event) => {
									uploadFiles(event, onClose);
								}}
								accept={accept}
								multiple={multiple}
								render={({ openFileDialog }) => {
									return (
										<MenuItem
											icon={upload}
											onClick={() => {
												openFileDialog();
											}}
										>
											{__("Upload")}
										</MenuItem>
									);
								}}
							/>
						</MediaUploadCheck>
						{onToggleFeaturedImage && (
							<MenuItem
								icon={postFeaturedImage}
								onClick={onToggleFeaturedImage}
								isPressed={useFeaturedImage}
							>
								{__("Use featured image")}
							</MenuItem>
						)}
						{children}
					</NavigableMenu>
				</>
			)}
		/>
	);
}
