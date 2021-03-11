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
			//applies to: videopress, vimeo, dailymotion, youtube
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
			//applies to youtube, dailymotion, videopress, vimeo
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
		} = props;
		const {
			videoId,
			url,
			videoSource,
			videoEmbedCode,
			width,
			preserveAspectRatio,
			height,
			origWidth,
			origHeight,
		} = attributes;

		return (
			<>
				<InspectorControls>
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
								if (!preserveAspectRatio) {
									const newHeight = Math.round((height * newWidth) / width);

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
					</PanelBody>
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

										setAttributes({
											videoId: media.id,
											url: media.url,
											width: newWidth,
											height: newHeight,
											videoEmbedCode: `<video controls width="${newWidth}" height="${newHeight}"><source src="${media.url}"></video>`,
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
									onChange={(videoURLInput) => {
										setState({ videoURLInput });
									}}
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
																const thumbHeight =
																	data.items[0].snippet.thumbnails.high.height;
																const thumbWidth =
																	data.items[0].snippet.thumbnails.high.width;
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
																	videoEmbedCode: `<iframe width="${newWidth}" height="${newHeight}" src="https://videopress.com/embed/${data.guid}" frameborder="0" allowfullscreen></iframe>
														<script src="https://videopress.com/videopress-iframe.js"></script>`,
																	videoSource: "videopress",
																	height: newHeight,
																	width: newWidth,
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
												console.log("facebook url detected");
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
								});
								setState({ videoURLInput: "" });
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
