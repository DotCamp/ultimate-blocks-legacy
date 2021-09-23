import { convertFromSeconds } from "../../common";
import { Component } from "react";
const { __ } = wp.i18n;
const { MediaUpload, MediaUploadCheck, InspectorControls, ColorPalette } =
	wp.blockEditor || wp.editor;
const {
	Button,
	RangeControl,
	ToggleControl,
	PanelBody,
	PanelRow,
	SelectControl,
	AnglePickerControl,
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
				const vimeoTimeCode =
					/https:\/\/player\.vimeo\.com\/video\/[0-9]+(\?[A-Za-z_]+=[^&"\s]+(?:(?:&[A-Za-z_]+=[^&"\s]+)*))?/.exec(
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
		const embedArgs =
			/<source (?:[^"=\s]+=".+?" )*(src="[^#"]+(#t=[0-9]+)?")/.exec(
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

export class AdvancedVideoBlock extends Component {
	constructor(props) {
		super(props);
		this.state = {
			enterVideoURL: false,
			videoURLInput: "",
			allowCustomStartTime: false,
			useCustomThumbnail: false,
			enterImageURL: false,
			imageURLInput: "",
			startTime_d: 0,
			startTime_h: 0,
			startTime_m: 0,
			startTime_s: 0,
			//include in each cache entry: url, embedCode, time. if entry is at least 1 hour old, replace. else, reuse old result
			youtubeCache: {},
			vimeoCache: {},
			dailyMotionCache: {},
			videoPressCache: {},
			currentBorder: "all",
			currentCorner: "all",
			useShadow: false,
		};
	}
	componentDidMount() {
		const { attributes, setAttributes, block } = this.props;
		const { startTime, blockID, shadow } = attributes;
		const { useShadow, startTime_d, startTime_h, startTime_m, startTime_s } =
			this.state;

		if (
			startTime !== 0 &&
			[startTime_d, startTime_h, startTime_m, startTime_s].every((t) => t === 0)
		) {
			let st = convertFromSeconds(startTime);
			this.setState({
				allowCustomStartTime: true,
				startTime_d: st.d,
				startTime_h: st.h,
				startTime_m: st.m,
				startTime_s: st.s,
			});
		}

		if (blockID === "") {
			setAttributes({ blockID: block.clientId });
		}

		if (!useShadow && shadow[0].radius > 0) {
			this.setState({ useShadow: true });
		}
	}
	render() {
		const { attributes, setAttributes } = this.props;
		const {
			videoId,
			url,
			videoEmbedCode,
			width,
			showPlayerControls,
			topBorderSize,
			leftBorderSize,
			rightBorderSize,
			bottomBorderSize,
			topBorderStyle,
			leftBorderStyle,
			rightBorderStyle,
			bottomBorderStyle,
			topBorderColor,
			leftBorderColor,
			rightBorderColor,
			bottomBorderColor,
			topLeftRadius,
			topRightRadius,
			bottomLeftRadius,
			bottomRightRadius,
			shadow,
			videoSource,
			videoLength,
			startTime,
			autoplay,
			preserveAspectRatio,
			height,
			origWidth,
			origHeight,
			vimeoUploaderNotBasic,
			mute,
			loop,
			thumbnail,
			thumbnailID,
			showInDesktop,
			showInTablet,
			showInMobile,
		} = attributes;
		const {
			enterVideoURL,
			videoURLInput,
			allowCustomStartTime,
			startTime_d,
			startTime_h,
			startTime_m,
			startTime_s,
			useCustomThumbnail,
			enterImageURL,
			imageURLInput,
			currentBorder,
			currentCorner,
			useShadow,
		} = this.state;

		const currentColor =
			currentBorder === "top"
				? topBorderColor
				: currentBorder === "left"
				? leftBorderColor
				: currentBorder === "right"
				? rightBorderColor
				: bottomBorderColor;

		const hasBorder =
			[topBorderSize, rightBorderSize, bottomBorderSize, leftBorderSize].filter(
				(s) => s > 0
			).length > 0;

		const checkVideoURLInput = () => {
			let videoURL = videoURLInput.trim();
			if (/^http(s)?:\/\//g.test(videoURL)) {
				const youtubeMatch =
					/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/g.exec(
						videoURL
					);
				const vimeoMatch =
					/^(?:https?\:\/\/)?(?:www\.|player\.)?(?:vimeo\.com\/)([0-9]+)/g.exec(
						videoURL
					);
				const dailyMotionMatch =
					/^(?:https?\:\/\/)?(?:www\.)?(?:dailymotion\.com\/video|dai\.ly)\/([0-9a-z]+)(?:[\-_0-9a-zA-Z]+#video=([a-z0-9]+))?/g.exec(
						videoURL
					);
				const videoPressMatch =
					/^https?:\/\/(?:www\.)?videopress\.com\/(?:embed|v)\/([a-zA-Z0-9]{8,})/g.exec(
						videoURL
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

				const facebookVideoMatch = facebookVideoRegex.exec(videoURL);

				if (youtubeMatch) {
					fetch(
						`https://www.googleapis.com/youtube/v3/videos?id=${youtubeMatch[1]}&part=snippet,contentDetails,player&key=AIzaSyDgItjYofyXkIZ4OxF6gN92PIQkuvU319c`
					)
						.then((response) => {
							response.json().then((data) => {
								if (data.items.length) {
									const { height: thumbHeight, width: thumbWidth } =
										data.items[0].snippet.thumbnails.high;

									let timePeriods = data.items[0].contentDetails.duration.match(
										/(\d{1,2}(?:W|D|H|M|S))/g
									);
									setAttributes({
										url: `https://www.youtube.com/watch?v=${youtubeMatch[1]}`,
										videoSource: "youtube",
										videoEmbedCode: data.items[0].player.embedHtml,
										origWidth: thumbWidth,
										origHeight: thumbHeight,
										width: Math.min(600, thumbWidth),
										height:
											(thumbHeight * Math.min(600, thumbWidth)) / thumbWidth,
										videoLength: timePeriods.reduce((sum, part) => {
											let multiplier = {
												W: 604800,
												D: 86400,
												H: 3600,
												M: 60,
												S: 1,
											};
											return (
												sum +
												Number(part.slice(0, -1)) * multiplier[part.slice(-1)]
											);
										}, 0),
									});
								} else {
									setAttributes({
										videoEmbedCode: `<p>${__("No video found at URL")}</p>`,
									});
								}
							});
						})
						.catch((err) => {
							console.log("youtube fetch error");
							console.log(err);
						});
				} else if (vimeoMatch) {
					fetch(`https://vimeo.com/api/v2/video/${vimeoMatch[1]}.json`)
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
										videoEmbedCode: decodeURIComponent(data.embed_html),
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
									videoEmbedCode: `<p>${__("No video found at URL")}</p>`,
								});
							}
						})
						.catch((err) => {
							console.log("videopress input error");
							console.log(err);
						});
				} else if (facebookVideoMatch) {
					setAttributes({
						url: videoURL,
						videoEmbedCode: `<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
							videoURL
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
						url: videoURL,
						videoEmbedCode: `<video controls width="500" height="500"><source src="${videoURLInput}"></video>`,
						videoSource: "unknown",
						width: 500,
						height: 500,
						preserveAspectRatio: false,
					});
					this.setState({ videoURLInput: "" });
				}
			} else {
				this.setState({ videoURLInput: "" });
				console.log("invalid input");
			}
		};

		return (
			<>
				<InspectorControls>
					{url !== "" && (
						<>
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
											setAttributes({
												height,
												videoEmbedCode: newVideoEmbedCode,
											});
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
																	setAttributes({
																		thumbnail: "",
																		thumbnailID: -1,
																	});
																	this.setState({ useCustomThumbnail: false });
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
														this.setState({
															allowCustomStartTime: !allowCustomStartTime,
														});
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
															this.setState({
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

														if (
															startPoint < videoLength &&
															d % 1 === 0 &&
															d > -1
														) {
															this.setState({ startTime_d: d });
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
															this.setState({ startTime_h: h });
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
															this.setState({ startTime_m: m });

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
														this.setState({ startTime_s: s });
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
								{[
									"youtube",
									"local",
									"unknown",
									"videopress",
									"vimeo",
								].includes(videoSource) && (
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
														let videoId =
															/https:\/\/www\.youtube\.com\/watch\?v=((?:\w|-){11})/.exec(
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
								{[
									"local",
									"unknown",
									"vimeo",
									"dailymotion",
									"videopress",
								].includes(videoSource) && (
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
												this.setState({
													useCustomThumbnail: !useCustomThumbnail,
												});
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
													this.setState({ enterImageURL: false });
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
											onClick={() =>
												this.setState({ enterImageURL: !enterImageURL })
											}
										>
											{__("Insert thumbnail URL")}
										</Button>
										{enterImageURL && (
											<>
												<input
													type="text"
													value={imageURLInput}
													onChange={(e) =>
														this.setState({ imageURLInput: e.target.value })
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
														this.setState({ imageURLInput: "" });
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
												this.setState({
													useCustomThumbnail: true,
													enterImageURL: false,
												});
											}}
										>
											{__("Replace")}
										</button>
									</>
								)}

								<p>{__("Toggle visibility")}</p>
								<Button
									isPrimary={showInDesktop}
									isSecondary={!showInDesktop}
									icon="desktop"
									showTooltip={true}
									label={"Desktop"}
									onClick={() =>
										setAttributes({ showInDesktop: !showInDesktop })
									}
								/>
								<Button
									isPrimary={showInTablet}
									isSecondary={!showInTablet}
									icon="tablet"
									showTooltip={true}
									label={"Tablet"}
									onClick={() => setAttributes({ showInTablet: !showInTablet })}
								/>
								<Button
									isPrimary={showInMobile}
									isSecondary={!showInMobile}
									icon="smartphone"
									showTooltip={true}
									label={"Mobile"}
									onClick={() => setAttributes({ showInMobile: !showInMobile })}
								/>
							</PanelBody>
							<PanelBody title={__("Border settings")}>
								<div className="ub-labelled-toggle">
									<p>{__("Use a border")}</p>
									<ToggleControl
										checked={hasBorder}
										onChange={() => {
											if (!hasBorder) {
												setAttributes({
													borderSize: 1,
													borderStyle: "solid",
													borderColor: "#000000",

													topBorderSize: 1,
													rightBorderSize: 1,
													bottomBorderSize: 1,
													leftBorderSize: 1,

													topBorderStyle: "solid",
													rightBorderStyle: "solid",
													bottomBorderStyle: "solid",
													leftBorderStyle: "solid",

													topBorderColor: "#000000",
													rightBorderColor: "#000000",
													bottomBorderColor: "#000000",
													leftBorderColor: "#000000",

													topLeftRadius: 0,
													topRightRadius: 0,
													bottomLeftRadius: 0,
													bottomRightRadius: 0,
												});
												this.setState({
													currentBorder: "all",
													currentCorner: "all",
												});
											} else {
												setAttributes({
													borderSize: 0,
													borderStyle: "",
													borderColor: "",

													topBorderSize: 0,
													rightBorderSize: 0,
													bottomBorderSize: 0,
													leftBorderSize: 0,

													topBorderStyle: "",
													rightBorderStyle: "",
													bottomBorderStyle: "",
													leftBorderStyle: "",

													topBorderColor: "",
													rightBorderColor: "",
													bottomBorderColor: "",
													leftBorderColor: "",
												});
											}
										}}
									/>
								</div>
								{hasBorder && (
									<>
										<div className="ub-indicator-grid">
											{/* FIRST ROW */}
											<div className="ub-indicator-grid-cell" />
											<div
												className="ub-indicator-grid-cell ub-indicator-grid-left-border ub-indicator-grid-right-border"
												style={{
													borderTop: `2px solid ${
														currentBorder === "top" ? "blue" : "black"
													}`,
												}}
												onClick={() => this.setState({ currentBorder: "top" })}
											></div>
											<div className="ub-indicator-grid-cell" />
											{/* SECOND ROW */}
											<div
												className="ub-indicator-grid-cell ub-indicator-grid-top-border ub-indicator-grid-bottom-border"
												style={{
													borderLeft: `2px solid ${
														currentBorder === "left" ? "blue" : "black"
													}`,
												}}
												onClick={() => this.setState({ currentBorder: "left" })}
											/>
											<div
												className="ub-indicator-grid-cell"
												style={{
													border: `2px solid ${
														currentBorder === "all" ? "blue" : "black"
													}`,
												}}
												onClick={() => this.setState({ currentBorder: "all" })}
											/>
											<div
												className="ub-indicator-grid-cell ub-indicator-grid-top-border ub-indicator-grid-bottom-border"
												style={{
													borderRight: `2px solid ${
														currentBorder === "right" ? "blue" : "black"
													}`,
												}}
												onClick={() =>
													this.setState({ currentBorder: "right" })
												}
											/>
											{/* THIRD ROW */}
											<div className="ub-indicator-grid-cell" />
											<div
												className="ub-indicator-grid-cell ub-indicator-grid-left-border ub-indicator-grid-right-border"
												style={{
													borderBottom: `2px solid ${
														currentBorder === "bottom" ? "blue" : "black"
													}`,
												}}
												onClick={() =>
													this.setState({ currentBorder: "bottom" })
												}
											/>
											<div className="ub-indicator-grid-cell" />
										</div>
										<RangeControl
											label={__(
												currentBorder === "all"
													? "Border size (pixels)"
													: "Border size of current side (pixels)"
											)}
											value={
												currentBorder === "top"
													? topBorderSize
													: currentBorder === "left"
													? leftBorderSize
													: currentBorder === "right"
													? rightBorderSize
													: bottomBorderSize
											}
											onChange={(borderSize) => {
												if (currentBorder === "all") {
													setAttributes({
														topBorderSize: borderSize,
														leftBorderSize: borderSize,
														rightBorderSize: borderSize,
														bottomBorderSize: borderSize,
													});
												} else if (currentBorder === "top") {
													setAttributes({ topBorderSize: borderSize });
												} else if (currentBorder === "left") {
													setAttributes({ leftBorderSize: borderSize });
												} else if (currentBorder === "right") {
													setAttributes({ rightBorderSize: borderSize });
												} else if (currentBorder === "bottom") {
													setAttributes({ bottomBorderSize: borderSize });
												}
											}}
											min={
												currentBorder === "all" ||
												[
													topBorderSize,
													rightBorderSize,
													bottomBorderSize,
													leftBorderSize,
												].filter((s) => s > 0).length > 1
													? 0
													: 1
											}
											max={30}
										/>
										<div className="ub-indicator-grid">
											{/* FIRST ROW */}
											<div
												className="ub-indicator-grid-cell ub-indicator-grid-bottom-border ub-indicator-grid-right-border"
												style={{
													borderTop: `2px solid ${
														currentCorner === "topleft" ? "blue" : "black"
													}`,
													borderLeft: `2px solid ${
														currentCorner === "topleft" ? "blue" : "black"
													}`,
												}}
												onClick={() =>
													this.setState({ currentCorner: "topleft" })
												}
											/>
											<div className="ub-indicator-grid-cell" />
											<div
												className="ub-indicator-grid-cell ub-indicator-grid-bottom-border ub-indicator-grid-left-border"
												style={{
													borderTop: `2px solid ${
														currentCorner === "topright" ? "blue" : "black"
													}`,
													borderRight: `2px solid ${
														currentCorner === "topright" ? "blue" : "black"
													}`,
												}}
												onClick={() =>
													this.setState({ currentCorner: "topright" })
												}
											></div>
											{/* SECOND ROW */}
											<div className="ub-indicator-grid-cell" />
											<div
												className="ub-indicator-grid-cell"
												style={{
													border: `2px solid ${
														currentCorner === "all" ? "blue" : "black"
													}`,
												}}
												onClick={() => this.setState({ currentCorner: "all" })}
											></div>
											<div className="ub-indicator-grid-cell" />
											{/* THIRD ROW */}
											<div
												className="ub-indicator-grid-cell ub-indicator-grid-top-border ub-indicator-grid-right-border"
												style={{
													borderBottom: `2px solid ${
														currentCorner === "bottomleft" ? "blue" : "black"
													}`,
													borderLeft: `2px solid ${
														currentCorner === "bottomleft" ? "blue" : "black"
													}`,
												}}
												onClick={() =>
													this.setState({ currentCorner: "bottomleft" })
												}
											/>
											<div className="ub-indicator-grid-cell" />
											<div
												className="ub-indicator-grid-cell ub-indicator-grid-top-border ub-indicator-grid-left-border"
												style={{
													borderBottom: `2px solid ${
														currentCorner === "bottomright" ? "blue" : "black"
													}`,
													borderRight: `2px solid ${
														currentCorner === "bottomright" ? "blue" : "black"
													}`,
												}}
												onClick={() =>
													this.setState({ currentCorner: "bottomright" })
												}
											></div>
										</div>
										<RangeControl
											label={__(
												currentCorner === "all"
													? "Border radius"
													: "Border radius of current corner"
											)}
											value={
												currentCorner === "topleft"
													? topLeftRadius
													: currentCorner === "topright"
													? topRightRadius
													: currentCorner === "bottomleft"
													? bottomLeftRadius
													: bottomRightRadius
											}
											onChange={(radius) => {
												if (currentCorner === "all") {
													setAttributes({
														topLeftRadius: radius,
														topRightRadius: radius,
														bottomLeftRadius: radius,
														bottomRightRadius: radius,
													});
												} else if (currentCorner === "topleft") {
													setAttributes({ topLeftRadius: radius });
												} else if (currentCorner === "topright") {
													setAttributes({ topRightRadius: radius });
												} else if (currentCorner === "bottomleft") {
													setAttributes({ bottomLeftRadius: radius });
												} else if (currentCorner === "bottomright") {
													setAttributes({ bottomRightRadius: radius });
												}
											}}
											min={0}
											max={30}
										/>
										<SelectControl
											label={__("Border Style")}
											options={["solid", "dotted", "dashed"].map((o) => ({
												value: o,
												label: __(o),
											}))}
											value={
												currentBorder === "top"
													? topBorderStyle
													: currentBorder === "left"
													? leftBorderStyle
													: currentBorder === "right"
													? rightBorderStyle
													: bottomBorderStyle
											}
											onChange={(borderStyle) => {
												if (currentBorder === "all") {
													setAttributes({
														topBorderStyle: borderStyle,
														leftBorderStyle: borderStyle,
														rightBorderStyle: borderStyle,
														bottomBorderStyle: borderStyle,
													});
												} else if (currentBorder === "top") {
													setAttributes({ topBorderStyle: borderStyle });
												} else if (currentBorder === "left") {
													setAttributes({ leftBorderStyle: borderStyle });
												} else if (currentBorder === "right") {
													setAttributes({ rightBorderStyle: borderStyle });
												} else if (currentBorder === "bottom") {
													setAttributes({ bottomBorderStyle: borderStyle });
												}
											}}
										/>
										<p>
											{__("Border Color")}
											{currentColor && (
												<span
													class="component-color-indicator"
													aria-label={`(Color: ${currentColor})`}
													style={{ background: currentColor }}
												/>
											)}
										</p>

										<ColorPalette
											value={currentColor}
											onChange={(borderColor) => {
												if (currentBorder === "all") {
													setAttributes({
														topBorderColor: borderColor,
														leftBorderColor: borderColor,
														rightBorderColor: borderColor,
														bottomBorderColor: borderColor,
													});
												} else if (currentBorder === "top") {
													setAttributes({ topBorderColor: borderColor });
												} else if (currentBorder === "left") {
													setAttributes({ leftBorderColor: borderColor });
												} else if (currentBorder === "right") {
													setAttributes({ rightBorderColor: borderColor });
												} else if (currentBorder === "bottom") {
													setAttributes({ bottomBorderColor: borderColor });
												}
											}}
										/>
									</>
								)}
							</PanelBody>
							<PanelBody title={__("Shadow settings")}>
								<PanelRow>
									<p>{__("Include a shadow")}</p>
									<ToggleControl
										checked={useShadow}
										onChange={() => {
											this.setState({ useShadow: !useShadow });
											if (useShadow) {
												setAttributes({
													shadow: [
														{
															angle: 0,
															radius: 0,
															color: "#000000",
															transparency: 0,
															blur: 0,
															spread: 0,
														},
													],
												});
											}
										}}
									/>
								</PanelRow>
								{useShadow && (
									<>
										<AnglePickerControl
											label={__("Shadow angle")}
											value={shadow[0].angle}
											onChange={(angle) =>
												setAttributes({
													shadow: [Object.assign({}, shadow[0], { angle })],
												})
											}
										/>
										<RangeControl
											label={__("Shadow radius (px)")}
											value={shadow[0].radius}
											onChange={(radius) =>
												setAttributes({
													shadow: [Object.assign({}, shadow[0], { radius })],
												})
											}
											min={0}
											max={100}
										/>
										<ColorPalette
											value={shadow[0].color}
											onChange={(color) =>
												setAttributes({
													shadow: [Object.assign({}, shadow[0], { color })],
												})
											}
										/>

										<RangeControl
											label={__("Shadow transparency")}
											value={shadow[0].transparency}
											onChange={(transparency) =>
												setAttributes({
													shadow: [
														Object.assign({}, shadow[0], { transparency }),
													],
												})
											}
											min={0}
											max={100}
										/>
										<RangeControl
											label={__("Shadow blur radius (px)")}
											value={shadow[0].blur}
											onChange={(blur) =>
												setAttributes({
													shadow: [Object.assign({}, shadow[0], { blur })],
												})
											}
											min={0}
											max={100}
										/>
										<RangeControl
											label={__("Shadow spread radius (px)")}
											value={shadow[0].spread}
											onChange={(spread) =>
												setAttributes({
													shadow: [Object.assign({}, shadow[0], { spread })],
												})
											}
											min={-50}
											max={50}
										/>
									</>
								)}
							</PanelBody>
						</>
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
								onClick={() => this.setState({ enterVideoURL: !enterVideoURL })}
							>
								{__("Insert video URL")}
							</Button>
						</div>
						{enterVideoURL && (
							<div className="ub-advanced-video-url-input">
								<input
									type="url"
									placeholder={__("Insert video URL")}
									value={videoURLInput}
									onChange={(e) =>
										this.setState({ videoURLInput: e.target.value })
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											checkVideoURLInput();
										}
									}}
								/>
								<Button
									icon={"editor-break"}
									label={__("Apply", "ultimate-blocks")}
									onClick={checkVideoURLInput}
								/>
							</div>
						)}
					</>
				)}
				<div
					className="ub-advanced-video-container"
					dangerouslySetInnerHTML={{
						__html:
							videoEmbedCode ||
							"<p>If a valid video source is entered, the video should appear here</p>",
					}}
					style={Object.assign(
						{ width: `${width}px` },
						[
							topBorderSize,
							leftBorderSize,
							rightBorderSize,
							bottomBorderSize,
						].filter((s) => s > 0).length > 0
							? {
									borderTop: `${topBorderSize}px ${topBorderStyle} ${topBorderColor}`,
									borderLeft: `${leftBorderSize}px ${leftBorderStyle} ${leftBorderColor}`,
									borderRight: `${rightBorderSize}px ${rightBorderStyle} ${rightBorderColor}`,
									borderBottom: `${bottomBorderSize}px ${bottomBorderStyle} ${bottomBorderColor}`,
									borderTopLeftRadius: `${topLeftRadius}px`,
									borderTopRightRadius: `${topRightRadius}px`,
									borderBottomLeftRadius: `${bottomLeftRadius}px`,
									borderBottomRightRadius: `${bottomRightRadius}px`,
							  }
							: {},
						shadow[0].radius > 0
							? {
									boxShadow: `${
										shadow[0].radius *
										Math.cos(((450 - shadow[0].angle) % 360) * (Math.PI / 180))
									}px ${
										-shadow[0].radius *
										Math.sin(((450 - shadow[0].angle) % 360) * (Math.PI / 180))
									}px ${shadow[0].blur}px ${shadow[0].spread}px rgba(${parseInt(
										"0x" + shadow[0].color.substring(1, 3)
									)}, ${parseInt(
										"0x" + shadow[0].color.substring(3, 5)
									)}, ${parseInt("0x" + shadow[0].color.substring(5, 7))}, ${
										(100 - shadow[0].transparency) / 100
									})`,
							  }
							: {}
					)}
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
									mute: false,
									loop: false,
									thumbnail: "",
									thumbnailId: -1,

									topBorderSize: 0,
									leftBorderSize: 0,
									rightBorderSize: 0,
									bottomBorderSize: 0,

									topBorderStyle: "",
									leftBorderStyle: "",
									rightBorderStyle: "",
									bottomBorderStyle: "",

									topBorderColor: "",
									leftBorderColor: "",
									rightBorderColor: "",
									bottomBorderColor: "",

									topLeftRadius: 0,
									topRightRadius: 0,
									bottomLeftRadius: 0,
									bottomRightRadius: 0,

									shadow: [Object.assign({}, shadow[0], { radius: 0 })],
								});
								this.setState({
									videoURLInput: "",
									allowCustomStartTime: false,
									startTime_d: 0,
									startTime_h: 0,
									startTime_m: 0,
									startTime_s: 0,
									useShadow: false,
								});
							}}
						>
							{__("Replace")}
						</button>
					</div>
				)}
			</>
		);
	}
}
