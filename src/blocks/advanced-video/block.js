const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { MediaUpload, MediaUploadCheck, URLInput, InspectorControls } =
	wp.blockEditor || wp.editor;
const { withState } = wp.compose;
const {
	Button,
	IconButton,
	RangeControl,
	ToggleControl,
	PanelBody,
} = wp.components;

import icon from "./icon";
import { convertFromSeconds } from "../../common";

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
			newEmbedCode = embedCode.replace(embedArgs[0], `${embedArgs[0]}?${arg}`);
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

registerBlockType("ub/advanced-video", {
	title: __("Advanced Video"),
	icon,
	category: "ultimateblocks",
	keywords: [__("advanced video"), __("ultimate blocks")],
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		videoId: {
			//for local use only
			type: "integer",
			default: -1,
		},
		url: {
			type: "string",
			default: "",
		},
		videoSource: {
			//store name of source site when regex finds a valid match
			type: "string",
			default: "",
		},
		playerStyle: {
			//custom border styles placed outside embedded player
			type: "string",
			default: "",
		},
		vimeoShowDetails: {
			//vimeo only
			type: "boolean",
			default: true,
		},
		vimeoUploaderNotBasic: {
			type: "boolean",
			default: false,
		},
		vimeoShowLogo: {
			//vimeo only
			type: "boolean",
			default: true,
		},
		enableYoutubeCookies: {
			type: "boolean",
			default: false,
		},
		autoplay: {
			//applies to: vimeo, dailymotion, youtube
			type: "boolean",
			default: false,
		},
		loop: {
			//applies to youtube, vimeo, videopress
			type: "boolean",
			default: false,
		},
		mute: {
			//applies to youtube, dailymotion, vimeo
			type: "boolean",
			default: false,
		},
		showPlayerControls: {
			//applies to dailymotion, youtube
			type: "boolean",
			default: true,
		},
		playInline: {
			type: "boolean",
			default: true,
		},
		thumbnail: {
			//replaces embed code, click through thumbnail before seeing embedded player in youtube
			type: "string",
			default: "",
		},
		videoEmbedCode: {
			type: "string",
			default: "",
		},
		startTime: {
			//applies to youtube, dailymotion, vimeo, local, custom
			type: "number",
			default: 0,
		},
		videoLength: {
			//starttime will never be larger than this
			type: "number",
			default: 0,
		},
		width: {
			type: "number",
			default: 600,
		},
		origWidth: {
			type: "number",
			default: 0,
		},
		preserveAspectRatio: {
			type: "boolean",
			default: true,
		},
		height: {
			type: "number",
			default: 450,
		},
		origHeight: {
			type: "number",
			default: 0,
		},
	},
	edit: withState({
		enterExternalURL: false,
		videoURLInput: "",
		allowCustomStartTime: false,
		startTime_d: 0,
		startTime_h: 0,
		startTime_m: 0,
		startTime_s: 0,
		//include in each cache entry: url, embedCode, time. if entry is at least 1 hour old, replace. else, reuse old result
		youtubeCache: {},
		vimeoCache: {},
		dailyMotionCache: {},
		videoPressCache: {},
	})(function (props) {
		//select video source
		//then enter url or upload from local

		const {
			attributes,
			setAttributes,
			setState,
			enterExternalURL,
			videoURLInput,
			allowCustomStartTime,
			startTime_d,
			startTime_h,
			startTime_m,
			startTime_s,
		} = props;
		const {
			videoId,
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
		} = attributes;

		if (
			startTime !== 0 &&
			[startTime_d, startTime_h, startTime_m, startTime_s].every((t) => t === 0)
		) {
			let st = convertFromSeconds(startTime);
			setState({
				allowCustomStartTime: true,
				startTime_d: st.d,
				startTime_h: st.h,
				startTime_m: st.m,
				startTime_s: st.s,
			});
		}

		return (
			<>
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
										setAttributes({ height });
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
										setAttributes({ videoEmbedCode: newVideoEmbedCode });
									}}
									min={200}
									max={1600}
								/>
							)}
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
							{/* SUPPORTED IN DAILYMOTION, YOUTUBE, LOCAL, DIRECT */}
							{([
								"local",
								"unknown",
								"youtube",
								"dailymotion",
								"videopress",
							].includes(videoSource) ||
								(videoSource === "vimeo" && vimeoUploaderNotBasic)) && (
								<>
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
													if (showPlayerControls) {
														//opposite of incoming value is still stored
														const videoControlsMatch = /<video(?: .+)* controls(?: .+?)*?>/g.exec(
															videoEmbedCode
														);

														setAttributes({
															videoEmbedCode: videoEmbedCode.replace(
																videoControlsMatch[0],
																videoControlsMatch[0].replace(" controls", "")
															),
														});
														//remove controls from it, then replace video tag in video embed code with the one with controls attribute removed
													} else {
														const videoTag = /<video(?: .+?)*>/.exec(
															videoEmbedCode
														);

														setAttributes({
															videoEmbedCode: videoEmbedCode.replace(
																videoTag[0],
																videoTag[0].replace("<video", "<video controls")
															),
														});
													}
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
								</>
							)}
							{/*SUPPORTED IN DIRECT, LOCAL, YOUTUBE, DAILYMOTION, VIMEO */}
							{!["facebook", "unknown"].includes(videoSource) && (
								<>
									<p>{__("Autoplay")}</p>
									<ToggleControl
										checked={autoplay}
										onChange={() => {
											setAttributes({ autoplay: !autoplay });
											switch (videoSource) {
												case "videopress":
												case "local":
												case "unknown":
													if (autoplay) {
														const videoControlsMatch = /<video(?: .+)* autoplay(?: .+?)*?>/g.exec(
															videoEmbedCode
														);

														setAttributes({
															videoEmbedCode: videoEmbedCode.replace(
																videoControlsMatch[0],
																videoControlsMatch[0].replace(" autoplay", "")
															),
														});
													} else {
														const videoTag = /<video(?: .+?)*>/.exec(
															videoEmbedCode
														);

														setAttributes({
															videoEmbedCode: videoEmbedCode.replace(
																videoTag[0],
																videoTag[0].replace("<video", "<video autoplay")
															),
														});
													}
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

													if (
														startPoint < videoLength &&
														d % 1 === 0 &&
														d > -1
													) {
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
						</PanelBody>
					)}
				</InspectorControls>
				{url === "" && (
					<>
						<div>{__("Select video source")}</div>

						<div className="ub-advanced-video-input-choices">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										const newWidth = Math.min(600, media.width);
										const newHeight = Math.round(
											(media.height * newWidth) / media.width
										);

										const timeUnits = media.fileLength
											.split(":")
											.map((t) => parseInt(t))
											.reverse();

										const conversionFactor = [1, 60, 3600, 86400];

										setAttributes({
											videoId: media.id,
											url: media.url,
											width: newWidth,
											height: newHeight,
											videoLength: timeUnits.reduce(
												(total, curr, i) => total + curr * conversionFactor[i],
												0
											),
											videoEmbedCode: `<video ${
												showPlayerControls ? "controls" : ""
											} width="${newWidth}" height="${newHeight}"><source src="${
												media.url
											}"></video>`,
											videoSource: "local",
										});
									}}
									allowedTypes={["video"]}
									value={videoId}
									render={({ open }) => (
										<Button isPrimary icon="video-alt2" onClick={open}>
											{__("Upload local video")}
										</Button>
									)}
								/>
							</MediaUploadCheck>

							<Button
								isPrimary
								icon="embed-video"
								onClick={() =>
									setState({ enterExternalURL: !enterExternalURL })
								}
							>
								{__("Insert video URL")}
							</Button>
						</div>
						{enterExternalURL && (
							<div>
								<URLInput
									disableSuggestions
									autoFocus={false}
									value={videoURLInput}
									onChange={(videoURLInput) => setState({ videoURLInput })}
								/>
								<IconButton
									icon={"editor-break"}
									label={__("Apply", "ultimate-blocks")}
									onClick={() => {
										if (/^http(s)?:\/\//g.test(videoURLInput)) {
											const youtubeMatch = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/g.exec(
												videoURLInput
											);
											const vimeoMatch = /^(?:https?\:\/\/)?(?:www\.|player\.)?(?:vimeo\.com\/)([0-9]+)/g.exec(
												videoURLInput
											);
											const dailyMotionMatch = /^(?:https?\:\/\/)?(?:www\.)?(?:dailymotion\.com\/video|dai\.ly)\/([0-9a-z]+)(?:[\-_0-9a-zA-Z]+#video=([a-z0-9]+))?/g.exec(
												videoURLInput
											);
											const videoPressMatch = /^https?:\/\/(?:www\.)?videopress\.com\/(?:embed|v)\/([a-zA-Z0-9]{8,})/g.exec(
												videoURLInput
											);

											const facebookVideoRegex = new RegExp(
												[
													"^https?:\\/\\/(?:",
													"(?:(?:www|web|mobile|(ar|bg|de|fi|hr|hu|id|pl|ro|ru|th)-\\1|bs-ba|cs-cz|da-dk|el-gk|en-gb|es(?:-(?:es|la))?|et-ee|fa-ir|fb-lt|fr-(?:ca|fr)|fr|he-il|(it|nl|tr)(-\\2)?|ja-jp|ko-kr|ms-my|nb-no|pt-(?:br|pt)|sr-rs|sv-se|tl-ph|vi-vn|zh-(?:cn|hk|tw))", //main fb video url, first part, includes known subdomains
													"?\\.?facebook\\.com\\/(?:(?:watch\\/\\?v=)|(?:[A-Za-z0-9.]+\\/videos\\/))[0-9]+)", //main fb video url, second part (both watch/?v=[postid] and [userid/pageid]/videos/[postid] variants)
													"|fb\\.watch\\/[A-Za-z0-9_]+)\\/?", //fb.watch variant
												].join(""),
												"g"
											);

											const facebookVideoMatch = facebookVideoRegex.exec(
												videoURLInput
											);

											if (youtubeMatch) {
												fetch(
													`https://www.googleapis.com/youtube/v3/videos?id=${youtubeMatch[1]}&part=snippet,contentDetails,player&key=AIzaSyDgItjYofyXkIZ4OxF6gN92PIQkuvU319c`
												)
													.then((response) => {
														response.json().then((data) => {
															if (data.items.length) {
																const {
																	height: thumbHeight,
																	width: thumbWidth,
																} = data.items[0].snippet.thumbnails.high;

																let timePeriods = data.items[0].contentDetails.duration.match(
																	/(\d{1,2}(?:W|D|H|M|S))/g
																);
																setAttributes({
																	url: `https://www.youtube.com/watch?v=${youtubeMatch[1]}`,
																	videoSource: "youtube",
																	videoEmbedCode:
																		data.items[0].player.embedHtml,
																	origWidth: thumbWidth,
																	origHeight: thumbHeight,
																	width: Math.min(600, thumbWidth),
																	height:
																		(thumbHeight * Math.min(600, thumbWidth)) /
																		thumbWidth,
																	videoLength: timePeriods.reduce(
																		(sum, part) => {
																			let multiplier = {
																				W: 604800,
																				D: 86400,
																				H: 3600,
																				M: 60,
																				S: 1,
																			};
																			return (
																				sum +
																				Number(part.slice(0, -1)) *
																					multiplier[part.slice(-1)]
																			);
																		},
																		0
																	),
																});
															} else {
																setAttributes({
																	videoEmbedCode: `<p>${__(
																		"No video found at URL"
																	)}</p>`,
																});
															}
														});
													})
													.catch((err) => {
														console.log("youtube fetch error");
														console.log(err);
													});
											} else if (vimeoMatch) {
												fetch(
													`https://vimeo.com/api/v2/video/${vimeoMatch[1]}.json`
												)
													.then((response) => {
														if (response.ok) {
															response
																.json()
																.then((data) => {
																	const newWidth = Math.min(600, data[0].width);
																	const newHeight = Math.round(
																		(data[0].height * newWidth) / data[0].width
																	);

																	setAttributes({
																		url: data[0].url,
																		origHeight: data[0].height,
																		origWidth: data[0].width,
																		width: newWidth,
																		height: newHeight,
																		videoLength: data[0].duration,
																	});
																	fetch(
																		`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
																			data[0].url
																		)}&width=${newWidth}&height=${newHeight}`
																	)
																		.then((response) => {
																			response.json().then((data) => {
																				setAttributes({
																					videoEmbedCode: data.html,
																					videoSource: "vimeo",
																					vimeoUploaderNotBasic:
																						data.account_type !== "basic",
																				});
																			});
																		})
																		.catch((err) => {
																			console.log("vimeo oembed error");
																			console.log(err);
																		});
																})
																.catch((err) => {
																	console.log(err);
																});
														} else {
															console.log("No video found at URL");
														}
													})
													.catch((err) => {
														console.log("vimeo fetch error");
														console.log(err);
													});
											} else if (dailyMotionMatch) {
												fetch(
													`https://api.dailymotion.com/video/${dailyMotionMatch[1]}?fields=created_time%2Cthumbnail_1080_url%2Ctitle%2Cdescription%2Curl%2Cembed_html%2Cheight%2Cwidth%2Cduration`
												)
													.then((response) => {
														if (response.ok) {
															response.json().then((data) => {
																const newWidth = Math.min(600, data.width);
																const newHeight = Math.round(
																	(data.height * newWidth) / data.width
																);
																setAttributes({
																	url: data.url,
																	videoEmbedCode: decodeURIComponent(
																		data.embed_html
																	),
																	videoSource: "dailymotion",
																	height: newHeight,
																	width: newWidth,
																	videoLength: data.duration,
																});
															});
														} else {
															console.log("No video found at URL");
														}
													})
													.catch((err) => {
														console.log("dailymotion input error");
														console.log(err);
													});
											} else if (videoPressMatch) {
												fetch(
													`https://public-api.wordpress.com/rest/v1.1/videos/${videoPressMatch[1]}`
												)
													.then((response) => {
														if (response.ok) {
															response.json().then((data) => {
																const newWidth = Math.min(600, data.width);
																const newHeight = Math.round(
																	(data.height * newWidth) / data.width
																);
																setAttributes({
																	url: `https://videopress.com/v/${data.guid}`,
																	videoEmbedCode: `<video controls width="${newWidth}" height="${newHeight}"><source src="${data.original}"></video>`,
																	videoSource: "videopress",
																	height: newHeight,
																	width: newWidth,
																	videoLength: Math.floor(data.duration / 1000),
																});
															});
														} else {
															setAttributes({
																videoEmbedCode: `<p>${__(
																	"No video found at URL"
																)}</p>`,
															});
														}
													})
													.catch((err) => {
														console.log("videopress input error");
														console.log(err);
													});
											} else if (facebookVideoMatch) {
												setAttributes({
													url: videoURLInput,
													videoEmbedCode: `<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
														videoURLInput
													)}&width=600&show_text=false&height=600&appId" width="600" height="600" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
													width: 600,
													height: 600,
													videoSource: "facebook",
													preserveAspectRatio: false,
												});
											} else {
												console.log(
													"site not supported. presume it's a direct link to a video"
												);

												setAttributes({
													url: videoURLInput,
													videoEmbedCode: `<video controls width="500" height="500"><source src="${videoURLInput}"></video>`,
													videoSource: "unknown",
													width: 500,
													height: 500,
													preserveAspectRatio: false,
												});
												setState({ videoURLInput: "" });
											}
										} else {
											setState({ videoURLInput: "" });
											console.log("invalid input");
										}
									}}
								/>
							</div>
						)}
					</>
				)}
				<div
					dangerouslySetInnerHTML={{
						__html:
							videoEmbedCode ||
							"<p>If a valid video source is entered, the video should appear here</p>",
					}}
				/>
				{url !== "" && (
					<div>
						<p>{`${__("Video URL: ")}${url}`}</p>
						<button
							onClick={() => {
								setAttributes({
									url: "",
									videoEmbedCode: "",
									videoId: -1,
									videoSource: "",
									preserveAspectRatio: true,
									autoplay: false,
									showPlayerControls: true,
									startTime: 0,
								});
								setState({
									videoURLInput: "",
									allowCustomStartTime: false,
									startTime_d: 0,
									startTime_h: 0,
									startTime_m: 0,
									startTime_s: 0,
								});
							}}
						>
							{__("Replace")}
						</button>
					</div>
				)}
			</>
		);
	}),
	save: () => null,
});
