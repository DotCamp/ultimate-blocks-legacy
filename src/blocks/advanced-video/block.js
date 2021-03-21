const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { MediaUpload, MediaUploadCheck, URLInput } = wp.blockEditor || wp.editor;
const { withState } = wp.compose;
const { Button, IconButton } = wp.components;

import icon from "./icon";
import { convertFromSeconds } from "../../common";
import { inspectorControls } from "./components";

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
			//applies to local/direct, videopress, dailymotion, vimeo
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
		const {
			attributes,
			setAttributes,
			setState,
			enterExternalURL,
			videoURLInput,
			startTime_d,
			startTime_h,
			startTime_m,
			startTime_s,
		} = props;
		const {
			videoId,
			url,
			videoEmbedCode,
			startTime,
			showPlayerControls,
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
				{inspectorControls(props)}
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
									mute: false,
									loop: false,
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
