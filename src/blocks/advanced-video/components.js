import { convertFromSeconds } from "../../common";
const { __ } = wp.i18n;
const { MediaUpload, MediaUploadCheck, InspectorControls, ColorPalette } =
	wp.blockEditor || wp.editor;
const {
	Button,
	RangeControl,
	ToggleControl,
	PanelBody,
	SelectControl,
} = wp.components;

function editEmbedArgs(source, embedCode, mode, arg, isTimeCode = false) {
	let newEmbedCode = embedCode;
	let regexPart = "";

	if (mode === "add") {
		if (source === "youtube") {
			regexPart = "www\\.youtube\\.com\\/embed\\/[A-Za-z0-9-_]+";
		} else if (source === "dailymotion") {
			regexPart =
				"https:\\/\\/www\\.dailymotion\\.com\\/embed\\/video\\/[A-Za-z0-9]+";
		} else if (source === "vimeo") {
			regexPart = "https:\\/\\/player\\.vimeo\\.com\\/video\\/[0-9]+";
		}

		if (regexPart) {
			const embedRegex = new RegExp(
				[
					regexPart,
					'(\\?[A-Za-z_]+=[^&"#\\s]+(?:(?:&[A-Za-z_]+=[^&#"\\s]+)*))?(?:#[^&#"\\s]+)?',
				].join("")
			);

			const embedArgs = embedRegex.exec(embedCode);

			if (isTimeCode) {
				//currently only for vimeo
				const timecodeCanBeRemoved = /([^#]+)#.+/.exec(embedArgs[0]);

				if (timecodeCanBeRemoved) {
					newEmbedCode = embedCode.replace(
						embedArgs[0],
						`${timecodeCanBeRemoved[1]}#${arg}`
					);
				} else {
					newEmbedCode = embedCode.replace(
						embedArgs[0],
						`${embedArgs[0]}#${arg}`
					);
				}
			} else if (embedArgs && embedArgs[1]) {
				if (!embedArgs[1].includes(arg)) {
					newEmbedCode = embedCode.replace(
						embedArgs[1],
						`${embedArgs[1]}&${arg}`
					);
				}
			} else {
				newEmbedCode = embedCode.replace(
					embedArgs[0],
					`${embedArgs[0]}?${arg}`
				);
			}
		} else {
			const videoTag = /<video(?: .+?)*>/.exec(embedCode);

			newEmbedCode = embedCode.replace(
				videoTag[0],
				videoTag[0].replace("<video", `<video ${arg}`)
			);
		}
	} else if (mode === "remove") {
		if (source === "youtube") {
			regexPart = "www\\.youtube\\.com\\/embed\\/[A-Za-z0-9-_]+\\?(";
		} else if (source === "dailymotion") {
			regexPart =
				"https:\\/\\/www\\.dailymotion\\.com\\/embed\\/video\\/[A-Za-z0-9-_]+\\?(";
		} else if (source === "vimeo") {
			regexPart = "https:\\/\\/player\\.vimeo\\.com\\/video\\/[0-9]+\\?(";
		} else {
			//check if this part is reachable
			console.log("source is either local or unknown");
		}

		if (regexPart) {
			const embedRegex = new RegExp(
				[
					regexPart,
					arg,
					'(?:&[A-Za-z_]+=[^&"\\s]+)?|[A-Za-z_]+=[^&"\\s]+?(?:(?:&[A-Za-z_]+=[^&"\\s]+?)*&',
					arg,
					"))",
				].join(""),
				"g"
			);

			const embedArgs = embedRegex.exec(newEmbedCode);
			if (isTimeCode) {
				//embedargs cannot be used. use another regex code. vimeo scenario
				const vimeoTimeCode = /https:\/\/player\.vimeo\.com\/video\/[0-9]+(\?[A-Za-z_]+=[^&"\s]+(?:(?:&[A-Za-z_]+=[^&"\s]+)*))?/.exec(
					newEmbedCode
				);

				newEmbedCode = newEmbedCode.replace(
					vimeoTimeCode[1],
					vimeoTimeCode[1].replace(/#t=.+/, "")
				);
			} else {
				if (embedArgs[1].includes(arg)) {
					if (arg.length < embedArgs[1].length) {
						let fullArg = arg;

						if (embedArgs[1].indexOf(arg)) {
							fullArg = "&" + arg;
						} else {
							fullArg = arg + "&";
						}

						newEmbedCode = embedCode.replace(
							embedArgs[1],
							embedArgs[1].replace(fullArg, "")
						);
					} else {
						newEmbedCode = embedCode.replace(
							embedArgs[0],
							embedArgs[0].replace(`?${arg}`, "")
						);
					}
				}
			}
		} else {
			const videoControlsRegex = new RegExp(
				`<video(?: .+)* ${arg}(?: .+?)*?>`,
				"g"
			);

			const videoControlsMatch = videoControlsRegex.exec(embedCode);

			newEmbedCode = embedCode.replace(
				videoControlsMatch[0],
				videoControlsMatch[0].replace(` ${arg}`, "")
			);
		}
	}

	return newEmbedCode;
}

function makeTimeCode(seconds) {
	let timeCode = "";
	const time = convertFromSeconds(seconds);
	if (time.d) {
		timeCode += `${time.d}d`;
	}
	if (time.h) {
		timeCode += `${time.h}h`;
	}
	if (time.m) {
		timeCode += `${time.m}m`;
	}
	if (time.s) {
		timeCode += `${time.s}s`;
	}
	return `t=${timeCode}`;
}

function adjustVideoStart(source, embedCode, startTime, prevStartTime = 0) {
	let newEmbedCode = embedCode;

	let startCode = "";

	switch (source) {
		case "youtube":
		case "dailymotion":
			startCode = `start=${startTime}`;
			break;
		case "vimeo":
			//specify hours minutes and seconds, can skip units with zero value
			//use #t=xhxmxs
			startCode = makeTimeCode(startTime);
			break;
		case "local":
		//already handled differently
		default:
			break;
	}

	if (source === "vimeo") {
		newEmbedCode = editEmbedArgs(
			source,
			embedCode,
			startTime > 0 ? "add" : "remove",
			startTime > 0 ? startCode : makeTimeCode(prevStartTime),
			true
		);
	} else if (["youtube", "dailymotion"].includes(source)) {
		if (prevStartTime > 0) {
			newEmbedCode = editEmbedArgs(
				source,
				embedCode,
				"remove",
				`start=${prevStartTime}`
			);
		}

		if (startTime > 0) {
			newEmbedCode = editEmbedArgs(source, newEmbedCode, "add", startCode);
		}
	} else {
		//case handler for local/direct
		const embedArgs = /<source (?:[^"=\s]+=".+?" )*(src="[^#"]+(#t=[0-9]+)?")/.exec(
			newEmbedCode
		);

		if (embedArgs[2]) {
			newEmbedCode = newEmbedCode.replace(
				embedArgs[1],
				embedArgs[1].replace(
					embedArgs[2],
					startTime > 0 ? `#t=${startTime}` : ""
				)
			);
		} else {
			newEmbedCode = newEmbedCode.replace(
				embedArgs[1],
				embedArgs[1].replace(/"$/g, `#t=${startTime}"`)
			);
		}
	}

	return newEmbedCode;
}

function editThumbnail(source, embedCode, mode, thumbnailURL) {
	return ["videopress", "local", "unknown"].includes(source)
		? editEmbedArgs(source, embedCode, mode, `poster=${thumbnailURL}`)
		: embedCode;
}

export const inspectorControls = (props) => {
	const {
		attributes,
		setAttributes,
		setState,
		allowCustomStartTime,
		startTime_d,
		startTime_h,
		startTime_m,
		startTime_s,
		useCustomThumbnail,
		enterImageURL,
		imageURLInput,
	} = props;
	const {
		url,
		videoSource,
		videoEmbedCode,
		videoLength,
		startTime,
		showPlayerControls,
		autoplay,
		width,
		preserveAspectRatio,
		height,
		origWidth,
		origHeight,
		vimeoUploaderNotBasic,
		mute,
		loop,
		thumbnail,
		thumbnailID,
		borderSize,
		borderStyle,
		borderColor,
	} = attributes;

	return (
		<InspectorControls>
			{url !== "" && (
				<PanelBody title={__("Embedded video player settings")}>
					<RangeControl
						label={__("Video width (pixels)")}
						value={width}
						onChange={(newWidth) => {
							setAttributes({ width: newWidth });

							let newVideoEmbedCode = videoEmbedCode;

							newVideoEmbedCode = newVideoEmbedCode.replace(
								/width="[0-9]+"/,
								`width="${newWidth}"`
							);
							if (videoSource === "facebook") {
								newVideoEmbedCode = newVideoEmbedCode.replace(
									/&width=[0-9]+/,
									`width="${newWidth}"`
								);
							}

							if (preserveAspectRatio) {
								//get ratio between current width and current height, then recalculate height according to ratio
								const newHeight = Math.round((height * newWidth) / width);
								setAttributes({
									height: newHeight,
								});
								newVideoEmbedCode = newVideoEmbedCode.replace(
									/height="[0-9]+"/,
									`height="${newHeight}"`
								);
								if (videoSource === "facebook") {
									newVideoEmbedCode = newVideoEmbedCode.replace(
										/&height=[0-9]+/,
										`height="${newHeight}"`
									);
								}
							}
							setAttributes({ videoEmbedCode: newVideoEmbedCode });
						}}
						min={200}
						max={1600}
					/>
					{!preserveAspectRatio && (
						<RangeControl
							label={__("Video height (pixels)")}
							value={height}
							onChange={(height) => {
								let newVideoEmbedCode = videoEmbedCode;

								newVideoEmbedCode = newVideoEmbedCode.replace(
									/height="[0-9]+"/,
									`height="${height}"`
								);
								if (videoSource === "facebook") {
									newVideoEmbedCode = newVideoEmbedCode.replace(
										/&height=[0-9]+/,
										`height="${height}"`
									);
								}
								setAttributes({ height, videoEmbedCode: newVideoEmbedCode });
							}}
							min={200}
							max={1600}
						/>
					)}
					<div className="ub-labelled-toggle">
						<p>{__("Preserve aspect ratio")}</p>
						<ToggleControl
							checked={preserveAspectRatio}
							onChange={() => {
								setAttributes({
									preserveAspectRatio: !preserveAspectRatio,
								});
								if (
									!preserveAspectRatio &&
									!["facebook", "unknown"].includes(videoSource)
								) {
									const newHeight = Math.round(
										(origHeight * width) / origWidth
									);

									let newVideoEmbedCode = videoEmbedCode.replace(
										/height="[0-9]+"/,
										`height="${newHeight}"`
									);
									if (videoSource === "facebook") {
										newVideoEmbedCode = newVideoEmbedCode.replace(
											/&height=[0-9]+/,
											`height="${newHeight}"`
										);
									}
									setAttributes({
										height: newHeight,
										videoEmbedCode: newVideoEmbedCode,
									});
								}
							}}
						/>
					</div>
					{/* SUPPORTED IN DAILYMOTION, YOUTUBE, LOCAL, DIRECT */}
					{([
						"local",
						"unknown",
						"youtube",
						"dailymotion",
						"videopress",
					].includes(videoSource) ||
						(videoSource === "vimeo" && vimeoUploaderNotBasic)) && (
						<div className="ub-labelled-toggle">
							<p>{__("Show player controls")}</p>
							<ToggleControl
								checked={showPlayerControls}
								onChange={() => {
									setAttributes({
										showPlayerControls: !showPlayerControls,
									});
									switch (videoSource) {
										case "videopress":
										case "local":
										case "unknown":
											setAttributes({
												videoEmbedCode: editEmbedArgs(
													videoSource,
													videoEmbedCode,
													showPlayerControls ? "remove" : "add",
													"controls"
												),
											});
											break;
										case "youtube":
										case "vimeo":
											setAttributes({
												videoEmbedCode: editEmbedArgs(
													videoSource,
													videoEmbedCode,
													showPlayerControls ? "add" : "remove",
													"controls=0"
												),
											});
											break;
										case "dailymotion":
											setAttributes({
												videoEmbedCode: editEmbedArgs(
													"dailymotion",
													videoEmbedCode,
													showPlayerControls ? "add" : "remove",
													"controls=false"
												),
											});
											break;
										case "facebook":
										default:
											console.log("there's nothing to change here");
											break;
									}
								}}
							/>
						</div>
					)}
					{/*SUPPORTED IN DIRECT, LOCAL, YOUTUBE, DAILYMOTION, VIMEO */}
					{!["facebook", "unknown"].includes(videoSource) &&
						!(videoSource === "vimeo" && useCustomThumbnail) && (
							<>
								<div className="ub-labelled-toggle">
									<p>{__("Autoplay")}</p>
									<ToggleControl
										checked={autoplay}
										onChange={() => {
											setAttributes({ autoplay: !autoplay });
											switch (videoSource) {
												case "videopress":
												case "local":
												case "unknown":
													setAttributes({
														videoEmbedCode: editEmbedArgs(
															videoSource,
															videoEmbedCode,
															autoplay ? "remove" : "add",
															"autoplay"
														),
													});
													break;

												case "youtube":
												case "vimeo":
													setAttributes({
														videoEmbedCode: editEmbedArgs(
															videoSource,
															videoEmbedCode,
															autoplay ? "remove" : "add",
															"autoplay=1"
														),
													});
													if (!autoplay) {
														setAttributes({ thumbnail: "", thumbnailID: -1 });
														setState({ useCustomThumbnail: false });
													}
													break;

												case "dailymotion":
													setAttributes({
														videoEmbedCode: editEmbedArgs(
															"dailymotion",
															videoEmbedCode,
															autoplay ? "remove" : "add",
															"autoplay=true"
														),
													});
													break;
												default:
													console.log("there's nothing to change here");
													break;
											}
										}}
									/>
								</div>
								<div className="ub-labelled-toggle">
									<p>{__("Allow custom start time")}</p>
									<ToggleControl
										checked={allowCustomStartTime}
										onChange={() => {
											setState({ allowCustomStartTime: !allowCustomStartTime });
											if (allowCustomStartTime) {
												setAttributes({
													startTime: 0,
													videoEmbedCode: adjustVideoStart(
														videoSource,
														videoEmbedCode,
														0,
														startTime
													),
												});
												setState({
													startTime_d: 0,
													startTime_h: 0,
													startTime_m: 0,
													startTime_s: 0,
												});

												//also remove custom start time from embed code
											}
										}}
									/>
								</div>
							</>
						)}
					{allowCustomStartTime && (
						<>
							<p>{__("Start time")}</p>
							<div>
								{videoLength >= 86400 && (
									<input
										type="number"
										value={startTime_d}
										min={0}
										step={1}
										onChange={(e) => {
											const d = Number(e.target.value);
											const startPoint =
												d * 86400 +
												startTime_h * 3600 +
												startTime_m * 60 +
												startTime_s;

											if (startPoint < videoLength && d % 1 === 0 && d > -1) {
												setState({ startTime_d: d });
												setAttributes({
													startTime: startPoint,
													videoEmbedCode: adjustVideoStart(
														videoSource,
														videoEmbedCode,
														startPoint,
														startTime
													),
												});
											}
										}}
									/>
								)}
								{videoLength >= 3600 && (
									<input
										type="number"
										value={startTime_h}
										min={0}
										max={23}
										step={1}
										onChange={(e) => {
											const h = Number(e.target.value);
											const startPoint =
												startTime_d * 86400 +
												h * 3600 +
												startTime_m * 60 +
												startTime_s;

											if (
												startPoint < videoLength &&
												h % 1 === 0 &&
												h > -1 &&
												h < 24
											) {
												setState({ startTime_h: h });
												setAttributes({
													startTime: startPoint,
													videoEmbedCode: adjustVideoStart(
														videoSource,
														videoEmbedCode,
														startPoint,
														startTime
													),
												});
											}
										}}
									/>
								)}
								{videoLength >= 60 && (
									<input
										type="number"
										value={startTime_m}
										min={0}
										max={59}
										step={1}
										onChange={(e) => {
											const m = Number(e.target.value);
											const startPoint =
												startTime_d * 86400 +
												startTime_h * 3600 +
												m * 60 +
												startTime_s;

											if (
												startPoint < videoLength &&
												m % 1 === 0 &&
												m > -1 &&
												m < 60
											) {
												setState({ startTime_m: m });

												let newCode = adjustVideoStart(
													videoSource,
													videoEmbedCode,
													startPoint,
													startTime
												);
												setAttributes({
													startTime: startPoint,
													videoEmbedCode: newCode,
												});
											}
										}}
									/>
								)}
								<input
									type="number"
									value={startTime_s}
									min={0}
									max={59}
									step={1}
									onChange={(e) => {
										const s = Number(e.target.value);
										const startPoint =
											startTime_d * 86400 +
											startTime_h * 3600 +
											startTime_m * 60 +
											s;

										if (
											startPoint < videoLength &&
											s % 1 === 0 &&
											s > -1 &&
											s < 60
										) {
											setState({ startTime_s: s });
											setAttributes({
												startTime: startPoint,
												videoEmbedCode: adjustVideoStart(
													videoSource,
													videoEmbedCode,
													startPoint,
													startTime
												),
											});
										}
									}}
								/>
							</div>
						</>
					)}
					{["youtube", "local", "unknown", "videopress", "vimeo"].includes(
						videoSource
					) && (
						<div className="ub-labelled-toggle">
							<p>{__("Loop")}</p>
							<ToggleControl
								checked={loop}
								onChange={() => {
									setAttributes({ loop: !loop });
									switch (videoSource) {
										case "videopress":
										case "local":
										case "unknown":
											setAttributes({
												videoEmbedCode: editEmbedArgs(
													videoSource,
													videoEmbedCode,
													loop ? "remove" : "add",
													"loop"
												),
											});
											break;
										case "youtube":
											let videoId = /https:\/\/www\.youtube\.com\/watch\?v=((?:\w|-){11})/.exec(
												url
											)[1];

											let newEmbedCode = editEmbedArgs(
												videoSource,
												videoEmbedCode,
												loop ? "remove" : "add",
												"loop=1"
											);

											setAttributes({
												videoEmbedCode: editEmbedArgs(
													videoSource,
													newEmbedCode,
													loop ? "remove" : "add",
													`playlist=${videoId}`
												),
											});
											break;
										case "vimeo":
											setAttributes({
												videoEmbedCode: editEmbedArgs(
													videoSource,
													videoEmbedCode,
													loop ? "remove" : "add",
													"loop=true"
												),
											});
											break;
										default:
											break;
									}
								}}
							/>
						</div>
					)}
					{["local", "unknown", "vimeo", "dailymotion", "videopress"].includes(
						videoSource
					) && (
						<div className="ub-labelled-toggle">
							<p>{__("Mute on page load")}</p>
							<ToggleControl
								checked={mute}
								onChange={() => {
									setAttributes({ mute: !mute });
									switch (videoSource) {
										case "videopress":
										case "local":
										case "unknown":
											setAttributes({
												videoEmbedCode: editEmbedArgs(
													videoSource,
													videoEmbedCode,
													mute ? "remove" : "add",
													"muted"
												),
											});
											break;
										case "vimeo":
											setAttributes({
												videoEmbedCode: editEmbedArgs(
													"vimeo",
													videoEmbedCode,
													mute ? "remove" : "add",
													"muted=1"
												),
											});
											break;
										case "dailymotion":
											setAttributes({
												videoEmbedCode: editEmbedArgs(
													"dailymotion",
													videoEmbedCode,
													mute ? "remove" : "add",
													"mute=true"
												),
											});
											break;
										default:
											break;
									}
								}}
							/>
						</div>
					)}
					{!(videoSource === "vimeo" && autoplay) && (
						<div className="ub-labelled-toggle">
							<p>{__("Use a custom thumbnail")}</p>
							<ToggleControl
								checked={useCustomThumbnail}
								onChange={() => {
									setState({ useCustomThumbnail: !useCustomThumbnail });
									if (useCustomThumbnail && thumbnail !== "") {
										setAttributes({
											thumbnail: "",
											thumbnailID: -1,
											videoEmbedCode: editThumbnail(
												videoSource,
												videoEmbedCode,
												"remove",
												thumbnail
											),
										});
										setState({ enterImageURL: false });
									} else {
										if (videoSource === "vimeo") {
											setAttributes({ autoplay: false });
										}
									}
								}}
							/>
						</div>
					)}
					{useCustomThumbnail && !thumbnail && (
						<>
							<Button
								isPrimary
								icon="admin-links"
								onClick={() => setState({ enterImageURL: !enterImageURL })}
							>
								{__("Insert thumbnail URL")}
							</Button>
							{enterImageURL && (
								<>
									<input
										type="text"
										value={imageURLInput}
										onChange={(e) =>
											setState({ imageURLInput: e.target.value })
										}
									/>
									<button
										onClick={() => {
											setAttributes({
												thumbnail: imageURLInput,
												videoEmbedCode: editThumbnail(
													videoSource,
													videoEmbedCode,
													"add",
													imageURLInput
												),
											});
											setState({ imageURLInput: "" });
										}}
									>
										{"\u21B5"}
									</button>
								</>
							)}
							{!enterImageURL && (
								<MediaUploadCheck>
									<MediaUpload
										onSelect={(img) => {
											setAttributes({
												thumbnail: img.url,
												thumbnailID: img.id,
												videoEmbedCode: editThumbnail(
													videoSource,
													videoEmbedCode,
													"add",
													img.url
												),
											});
										}}
										allowedTypes={["image"]}
										value={thumbnailID}
										render={({ open }) => (
											<Button isPrimary icon="upload" onClick={open}>
												{__("Upload")}
											</Button>
										)}
									/>
								</MediaUploadCheck>
							)}
						</>
					)}
					{thumbnail && (
						<>
							<img src={thumbnail} height={200} />
							<button
								onClick={() => {
									setAttributes({
										thumbnail: "",
										thumbnailID: -1,
										videoEmbedCode: editThumbnail(
											videoSource,
											videoEmbedCode,
											"remove",
											thumbnail
										),
									});
									setState({ useCustomThumbnail: true, enterImageURL: false });
								}}
							>
								{__("Replace")}
							</button>
						</>
					)}
					<div className="ub-labelled-toggle">
						<p>{__("Use a border")}</p>
						<ToggleControl
							checked={borderSize > 0}
							onChange={() => {
								if (borderSize === 0) {
									setAttributes({
										borderSize: 1,
										borderStyle: "solid",
										borderColor: "#000000",
									});
								} else {
									setAttributes({
										borderSize: 0,
										borderStyle: "",
										borderColor: "",
									});
								}
							}}
						/>
					</div>
					{borderSize > 0 && (
						<>
							<RangeControl
								label={__("Border size (pixels)")}
								value={borderSize}
								onChange={(borderSize) => {
									setAttributes({ borderSize });
								}}
								min={1}
								max={30}
							/>
							<SelectControl
								label={__("Border Style")}
								options={["solid", "dotted", "dashed"].map((o) => ({
									value: o,
									label: __(o),
								}))}
								value={borderStyle}
								onChange={(borderStyle) => setAttributes({ borderStyle })}
							/>
							<p>
								{__("Border Color")}
								{borderColor && (
									<span
										class="component-color-indicator"
										aria-label={`(Color: ${borderColor})`}
										style={{ background: borderColor }}
									/>
								)}
							</p>

							<ColorPalette
								value={borderColor}
								onChange={(borderColor) => setAttributes({ borderColor })}
							/>
						</>
					)}
				</PanelBody>
			)}
		</InspectorControls>
	);
};
