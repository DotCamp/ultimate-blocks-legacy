const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { MediaUpload, MediaUploadCheck, URLInput } = wp.blockEditor || wp.editor;
const { withState } = wp.compose;
const { Button, IconButton } = wp.components;

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
	},
	edit: withState({ enterExternalURL: false, videoURLInput: "" })(function (
		props
	) {
		//select video source
		//then enter url or upload from local

		const {
			attributes,
			setAttributes,
			setState,
			enterExternalURL,
			videoURLInput,
		} = props;
		const { videoId, url, videoEmbedCode } = attributes;

		console.log(`current url: ${url}`);

		return (
			<>
				{url === "" && (
					<>
						<div>{__("Select video source")}</div>

						<div className="ub-advanced-video-input-choices">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										console.log(JSON.stringify(media));
										setAttributes({
											videoId: media.id,
											url: media.url,
											videoEmbedCode: `<video controls><source src="${media.url}"></video>`,
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
										console.log(`new video url input value: ${videoURLInput}`);
										setState({ videoURLInput });
									}}
								/>
								<IconButton
									icon={"editor-break"}
									label={__("Apply", "ultimate-blocks")}
									onClick={() => {
										console.log("check site in url");
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

											console.log("checking if url belongs to a valid site");

											if (youtubeMatch) {
												fetch(
													`https://www.googleapis.com/youtube/v3/videos?id=${youtubeMatch[1]}&part=snippet,contentDetails,player&key=AIzaSyDgItjYofyXkIZ4OxF6gN92PIQkuvU319c`
												)
													.then((response) => {
														response.json().then((data) => {
															if (data.items.length) {
																setAttributes({
																	url: `https://www.youtube.com/watch?v=${youtubeMatch[1]}`,
																	videoEmbedCode:
																		data.items[0].player.embedHtml,
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
																	setAttributes({ url: data[0].url });
																	fetch(
																		`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
																			data[0].url
																		)}`
																	)
																		.then((response) => {
																			response.json().then((data) => {
																				setAttributes({
																					videoEmbedCode: data.html,
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
													`https://api.dailymotion.com/video/${dailyMotionMatch[1]}?fields=created_time%2Cthumbnail_1080_url%2Ctitle%2Cdescription%2Curl%2Cembed_html%2Cduration`
												)
													.then((response) => {
														if (response.ok) {
															response.json().then((data) => {
																setAttributes({
																	url: data.url,
																	videoEmbedCode: decodeURIComponent(
																		data.embed_html
																	),
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
																setAttributes({
																	url: `https://videopress.com/v/${data.guid}`,

																	videoEmbedCode: `<iframe width="560" height="315" src="https://videopress.com/embed/${data.guid}" frameborder="0" allowfullscreen></iframe>
														<script src="https://videopress.com/videopress-iframe.js"></script>`,
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
											} else {
												console.log(
													"site not supported. presume it's a direct link to a video"
												);

												setAttributes({
													url: videoURLInput,
													videoEmbedCode: `<video controls><source src="${videoURLInput}"></video>`,
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
								setAttributes({ url: "", videoEmbedCode: "", videoId: -1 });
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
