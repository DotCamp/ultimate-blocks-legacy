import {
	DEFAULT_ASPECT_RATIO_OPTIONS,
	convertFromSeconds,
	getParentBlock,
} from "../../common";
import { get, isEmpty } from "lodash";
import { useState, useEffect } from "react";
import {
	BorderControl,
	BorderRadiusControl,
	SpacingControl,
	UBSelectControl,
} from "../components";
import { useDispatch, useSelect, select } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { getStyles } from "./get-styles";
import AdvancedVideoPlaceholder from "./placeholder";
import AdvancedVideoBlockControls from "./block-controls";
import { store as noticesStore } from "@wordpress/notices";

import { __ } from "@wordpress/i18n";
import {
	getBorderCSS,
	getSingleSideBorderValue,
} from "../utils/styling-helpers";
const {
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	ColorPalette,
	useBlockProps,
} = wp.blockEditor || wp.editor;
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

	const validSources = ["youtube", "dailymotion", "vimeo"];

	const sizeRegex = /width="\d+" height="\d+"/;

	if (mode === "add") {
		if (validSources.includes(source) && embedCode.search(sizeRegex)) {
			switch (source) {
				case "youtube":
					newEmbedCode = embedCode.replace("<iframe", `<iframe ${arg}`);
					break;
				case "vimeo":
					//handled by styles
					break;
				default:
					console.log("can't add size");
			}
		} else {
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
					].join(""),
				);

				const embedArgs = embedRegex.exec(embedCode);

				if (isTimeCode) {
					//currently only for vimeo
					const timecodeCanBeRemoved = /([^#]+)#.+/.exec(embedArgs[0]);

					if (timecodeCanBeRemoved) {
						newEmbedCode = embedCode.replace(
							embedArgs[0],
							`${timecodeCanBeRemoved[1]}#${arg}`,
						);
					} else {
						newEmbedCode = embedCode.replace(
							embedArgs[0],
							`${embedArgs[0]}#${arg}`,
						);
					}
				} else if (embedArgs && embedArgs[1]) {
					if (!embedArgs[1].includes(arg)) {
						newEmbedCode = embedCode.replace(
							embedArgs[1],
							`${embedArgs[1]}&${arg}`,
						);
					}
				} else {
					newEmbedCode = embedCode.replace(
						embedArgs[0],
						`${embedArgs[0]}?${arg}`,
					);
				}
			} else {
				const videoTag = /<video(?: .+?)*>/.exec(embedCode);

				newEmbedCode = embedCode.replace(
					videoTag[0],
					videoTag[0].replace("<video", `<video ${arg}`),
				);
			}
		}
	} else if (mode === "remove") {
		if (validSources.includes(source) && embedCode.search(sizeRegex)) {
			switch (source) {
				case "youtube":
					newEmbedCode = embedCode.replace(`<iframe ${arg}`, "<iframe");
					break;
				case "vimeo":
					//handled by styles
					break;
				default:
					console.log("can't remove size");
			}
		} else {
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
					"g",
				);

				const embedArgs = embedRegex.exec(newEmbedCode);
				if (isTimeCode) {
					//embedargs cannot be used. use another regex code. vimeo scenario
					const vimeoTimeCode =
						/https:\/\/player\.vimeo\.com\/video\/[0-9]+(\?[A-Za-z_]+=[^&"\s]+(?:(?:&[A-Za-z_]+=[^&"\s]+)*))?/.exec(
							newEmbedCode,
						);

					newEmbedCode = newEmbedCode.replace(
						vimeoTimeCode[1],
						vimeoTimeCode[1].replace(/#t=.+/, ""),
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
								embedArgs[1].replace(fullArg, ""),
							);
						} else {
							newEmbedCode = embedCode.replace(
								embedArgs[0],
								embedArgs[0].replace(`?${arg}`, ""),
							);
						}
					}
				}
			} else {
				const videoControlsRegex = new RegExp(
					`<video(?: .+)* ${arg}(?: .+?)*?>`,
					"g",
				);

				const videoControlsMatch = videoControlsRegex.exec(embedCode);

				newEmbedCode = embedCode.replace(
					videoControlsMatch[0],
					videoControlsMatch[0].replace(` ${arg}`, ""),
				);
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
			true,
		);
	} else if (["youtube", "dailymotion"].includes(source)) {
		if (prevStartTime > 0) {
			newEmbedCode = editEmbedArgs(
				source,
				embedCode,
				"remove",
				`start=${prevStartTime}`,
			);
		}

		if (startTime > 0) {
			newEmbedCode = editEmbedArgs(source, newEmbedCode, "add", startCode);
		}
	} else {
		//case handler for local/direct
		const embedArgs =
			/<source (?:[^"=\s]+=".+?" )*(src="[^#"]+(#t=[0-9]+)?")/.exec(
				newEmbedCode,
			);

		if (!isEmpty(embedArgs[2])) {
			newEmbedCode = newEmbedCode.replace(
				embedArgs[1],
				embedArgs[1].replace(
					embedArgs[2],
					startTime > 0 ? `#t=${startTime}` : "",
				),
			);
		} else {
			newEmbedCode = newEmbedCode.replace(
				embedArgs[1],
				embedArgs[1].replace(/"$/g, `#t=${startTime}"`),
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

export function AdvancedVideoBlock(props) {
	const [enterVideoURL, setVideoURLStatus] = useState(false);
	const [videoURLInput, setVideoURLInput] = useState(
		props.attributes.url ?? "",
	);
	const [allowCustomStartTime, setStartTimeStatus] = useState(false);
	const [useCustomThumbnail, setCustomThumbnailStatus] = useState(false);
	const [enterImageURL, setImageURLInputStatus] = useState(false);
	const [imageURLInput, setImageURLInput] = useState("");
	const [startTime_d, setStartTime_d] = useState(0);
	const [startTime_h, setStartTime_h] = useState(0);
	const [startTime_m, setStartTime_m] = useState(0);
	const [startTime_s, setStartTime_s] = useState(0);

	const [useShadow, setShadowStatus] = useState(false);
	const { attributes, setAttributes, clientId } = props;
	const blockProps = useBlockProps({
		style: getStyles(attributes),
	});
	const { block, rootBlockClientId } = useSelect((select) => {
		const { getBlock, getBlockRootClientId } =
			select("core/block-editor") || select("core/editor");
		const block = getBlock(clientId);
		const rootBlockClientId = getBlockRootClientId(block.clientId);

		return {
			block,
			rootBlockClientId,
		};
	});
	const {
		blockID,
		videoId,
		url,
		videoEmbedCode,
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
		autofit,
		width,
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
		isTransformed,
		aspectRatio,
		isBorderComponentChanged,
		border,
		borderRadius,
		isResponsiveSettingsRemoved,
	} = attributes;
	useEffect(() => {
		if (!isBorderComponentChanged) {
			setAttributes({
				isBorderComponentChanged: true,
				borderRadius: {
					topLeft: topLeftRadius + "px",
					topRight: topRightRadius + "px",
					bottomLeft: bottomLeftRadius + "px",
					bottomRight: bottomRightRadius + "px",
				},
				border: {
					top: {
						width: topBorderSize + "px",
						color: topBorderColor,
						style: topBorderStyle,
					},
					right: {
						width: rightBorderSize + "px",
						color: rightBorderColor,
						style: rightBorderStyle,
					},
					bottom: {
						width: bottomBorderSize + "px",
						color: bottomBorderColor,
						style: bottomBorderStyle,
					},
					left: {
						width: leftBorderSize + "px",
						color: leftBorderColor,
						style: leftBorderStyle,
					},
				},
			});
		}
		if (typeof ub_extensions !== "undefined") {
			const responsiveControl = ub_extensions.find(
				(extensions) => extensions.name === "responsive-control",
			);
			if (!isResponsiveSettingsRemoved && responsiveControl.active) {
				setAttributes({
					isResponsiveSettingsRemoved: true,
					isHideOnDesktop: !showInDesktop,
					isHideOnTablet: !showInTablet,
					isHideOnMobile: !showInMobile,
				});
			}
		}
	}, []);
	useEffect(() => {
		if (
			startTime !== 0 &&
			[startTime_d, startTime_h, startTime_m, startTime_s].every((t) => t === 0)
		) {
			let st = convertFromSeconds(startTime);
			setStartTimeStatus(true);
			setStartTime_d(st.d);
			setStartTime_h(st.h);
			setStartTime_m(st.m);
			setStartTime_s(st.s);
		}

		if (blockID === "") {
			setAttributes({ blockID: block.clientId });
		} else if (blockID !== block.clientId) {
			//patch for bug that set default width and height to 0 in frontend when width and height are unchanged in editor
			if (width === 0) {
				setAttributes({ width: 600 });
			}
			if (height === 0) {
				setAttributes({ height: 450 });
			}
		}

		if (!useShadow && shadow[0].radius > 0) {
			setShadowStatus(true);
		}
	}, []);
	useEffect(() => {
		const rootBlock = getParentBlock(rootBlockClientId, "core/block");
		if (!rootBlock) {
			setAttributes({ blockID: block.clientId });
		}
	}, [block?.clientId]);
	const checkVideoURLInput = () => {
		let videoURL = videoURLInput.trim();

		if (/^http(s)?:\/\//g.test(videoURL)) {
			const youtubeMatch =
				/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/g.exec(
					videoURL,
				);
			const vimeoMatch =
				/^(?:https?\:\/\/)?(?:www\.|player\.)?(?:vimeo\.com\/)([0-9]+)/g.exec(
					videoURL,
				);
			const dailyMotionMatch =
				/^(?:https?\:\/\/)?(?:www\.)?(?:dailymotion\.com\/video|dai\.ly)\/([0-9a-z]+)(?:[\-_0-9a-zA-Z]+#video=([a-z0-9]+))?/g.exec(
					videoURL,
				);
			const videoPressMatch =
				/^https?:\/\/(?:www\.)?videopress\.com\/(?:embed|v)\/([a-zA-Z0-9]{8,})/g.exec(
					videoURL,
				);

			const facebookVideoRegex = new RegExp(
				[
					"^https?:\\/\\/(?:",
					"(?:(?:www|web|mobile|(ar|bg|de|fi|hr|hu|id|pl|ro|ru|th)-\\1|bs-ba|cs-cz|da-dk|el-gk|en-gb|es(?:-(?:es|la))?|et-ee|fa-ir|fb-lt|fr-(?:ca|fr)|fr|he-il|(it|nl|tr)(-\\2)?|ja-jp|ko-kr|ms-my|nb-no|pt-(?:br|pt)|sr-rs|sv-se|tl-ph|vi-vn|zh-(?:cn|hk|tw))", //main fb video url, first part, includes known subdomains
					"?\\.?facebook\\.com\\/(?:(?:watch\\/\\?v=)|(?:[A-Za-z0-9.]+\\/videos\\/))[0-9]+)", //main fb video url, second part (both watch/?v=[postid] and [userid/pageid]/videos/[postid] variants)
					"|fb\\.watch\\/[A-Za-z0-9_]+)\\/?", //fb.watch variant
				].join(""),
				"g",
			);

			const facebookVideoMatch = facebookVideoRegex.exec(videoURL);
			const tiktokMatch =
				/^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/(?:\w+\/)?@[\w.-]+\/video\/\d+/g.exec(
					videoURL,
				);

			if (youtubeMatch) {
				fetch(
					`https://www.googleapis.com/youtube/v3/videos?id=${youtubeMatch[1]}&part=snippet,contentDetails,player&key=AIzaSyDgItjYofyXkIZ4OxF6gN92PIQkuvU319c`,
				)
					.then((response) => {
						response.json().then((data) => {
							if (data.items.length) {
								let timePeriods = data.items[0].contentDetails.duration.match(
									/(\d{1,2}(?:W|D|H|M|S))/g,
								);
								const videoHeight = get(
									data.items[0],
									"snippet.thumbnails.maxres.height",
									get(data.items[0], "snippet.thumbnails.high.height", height),
								);

								const videoWidth = get(
									data.items[0],
									"snippet.thumbnails.maxres.width",
									get(data.items[0], "snippet.thumbnails.high.width", width),
								);
								let embedCode = data.items[0].player.embedHtml;
								embedCode = embedCode.replace(
									/height="[0-9]+%?"/,
									`height="${videoHeight}"`,
								);
								embedCode = embedCode.replace(
									/width="[0-9]+%?"/,
									`width="${videoWidth}"`,
								);
								const parsedCode = /<iframe width="(\d+)" height="(\d+)/.exec(
									embedCode,
								);

								setAttributes({
									channelId: data.items[0].snippet.channelId,
									url: `https://www.youtube.com/watch?v=${youtubeMatch[1]}`,
									videoSource: "youtube",
									videoEmbedCode: embedCode,
									origWidth: parseInt(parsedCode[1]),
									origHeight: parseInt(parsedCode[2]),
									width: Math.min(100, parsedCode[1]),
									height: parsedCode[2],
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
										(data[0].height * newWidth) / data[0].width,
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
											data[0].url,
										)}&width=${newWidth}&height=${newHeight}`,
									)
										.then((response) => {
											response.json().then((data) => {
												setAttributes({
													videoEmbedCode: data.html,
													videoSource: "vimeo",
													vimeoUploaderNotBasic: data.account_type !== "basic",
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
					`https://api.dailymotion.com/video/${dailyMotionMatch[1]}?fields=created_time%2Cthumbnail_1080_url%2Ctitle%2Cdescription%2Curl%2Cembed_html%2Cheight%2Cwidth%2Cduration`,
				)
					.then((response) => {
						if (response.ok) {
							response.json().then((data) => {
								const newWidth = Math.min(600, data.width);
								const newHeight = Math.round(
									(data.height * newWidth) / data.width,
								);

								setAttributes({
									url: data.url,
									videoEmbedCode: decodeURIComponent(data.embed_html),
									videoSource: "dailymotion",
									origHeight: data.height,
									origWidth: data.width,
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
					`https://public-api.wordpress.com/rest/v1.1/videos/${videoPressMatch[1]}`,
				)
					.then((response) => {
						if (response.ok) {
							response.json().then((data) => {
								const newWidth = Math.min(600, data.width);
								const newHeight = Math.round(
									(data.height * newWidth) / data.width,
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
						videoURL,
					)}&width=600&show_text=false&height=600&appId" width="600" height="600" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
					width: 600,
					height: 600,
					videoSource: "facebook",
					preserveAspectRatio: false,
				});
			} else if (tiktokMatch) {
				fetch(`https://www.tiktok.com/oembed?url=${tiktokMatch[0]}`)
					.then((response) => {
						if (response.ok) {
							response.json().then((data) => {
								const newWidth = Math.min(600, data.width);
								const newHeight = Math.round(
									(data.height * newWidth) / data.width,
								);
								setAttributes({
									url: tiktokMatch[0],
									videoEmbedCode: data.html,
									videoSource: "tiktok",
									height: newHeight,
									width: newWidth,
								});
							});
						}
					})
					.catch((err) => {
						console.log("tiktok input error");
						console.log(err);
					});
			} else {
				console.log(
					"site not supported. presume it's a direct link to a video",
				);

				setAttributes({
					url: videoURL,
					videoEmbedCode: `<video controls width="500" height="500"><source src="${videoURLInput}"></video>`,
					videoSource: "unknown",
					preserveAspectRatio: false,
				});
				setVideoURLInput("");
			}
		} else {
			setVideoURLInput("");
			console.log("invalid input");
		}
	};
	useEffect(() => {
		if (isTransformed) {
			checkVideoURLInput();
		}
	}, []);

	let autofitContainerStyle = {};
	let extraEmbeds = null;
	switch (videoSource) {
		case "youtube":
			const currentAspectRatio =
				!isEmpty(aspectRatio) && aspectRatio !== "auto"
					? aspectRatio
					: `${origWidth}/${origHeight}`;
			autofitContainerStyle = Object.assign(
				{},
				{ aspectRatio: currentAspectRatio },
			);
			extraEmbeds = (
				<style>
					{`#ub-advanced-video-${blockID}.ub-advanced-video-autofit-youtube iframe{
						aspect-ratio: ${currentAspectRatio};
						height: auto !important;
					}`}
				</style>
			);
			break;
		case "vimeo":
			autofitContainerStyle = Object.assign(
				{},
				{ padding: `${(origHeight / origWidth) * 100}% 0 0 0` },
			);
			extraEmbeds = <script src="https://player.vimeo.com/api/player.js" />;
			break;
		case "dailymotion":
			autofitContainerStyle = Object.assign(
				{},
				{ paddingBottom: `${(origHeight / origWidth) * 100}%` },
			);
			extraEmbeds = null;
			break;
		case "unknown":
			const localAspectRatio =
				!isEmpty(aspectRatio) && aspectRatio !== "auto"
					? aspectRatio
					: `${origWidth}/${origHeight}`;
			extraEmbeds = (
				<style>
					{`#ub-advanced-video-${blockID}.ub-advanced-video-autofit video{
						aspect-ratio: ${localAspectRatio};
						height: auto !important;
						object-fit:cover;
					}`}
				</style>
			);
			break;
		default:
			autofitContainerStyle = {};
			extraEmbeds = null;
	}
	const onSelectVideo = (media) => {
		const newWidth = media.width;
		const newHeight = media.height;
		let timeUnits = [0];
		const conversionFactor = [1, 60, 3600, 86400];

		if (!isEmpty(media?.fileLength)) {
			timeUnits = media.fileLength
				.split(":")
				.map((t) => parseInt(t))
				.reverse();
			setAttributes({
				videoLength: timeUnits.reduce(
					(total, curr, i) => total + curr * conversionFactor[i],
					0,
				),
			});
		} else {
			const videoElement = document.createElement("video");
			videoElement.src = media.url;

			videoElement.addEventListener("loadedmetadata", () => {
				const duration = videoElement.duration;
				timeUnits = duration
					.toString()
					.split(":")
					.map((t) => parseInt(t))
					.reverse();
				videoElement.remove();
				setAttributes({
					videoLength: timeUnits.reduce(
						(total, curr, i) => total + curr * conversionFactor[i],
						0,
					),
				});
			});
		}
		setAttributes({
			videoId: media.id,
			url: media.url,
			width: newWidth,
			height: newHeight,
			videoEmbedCode: `<video ${
				showPlayerControls ? "controls" : ""
			} width="${newWidth}" height="${newHeight}"><source src="${
				media.url
			}"></video>`,
			videoSource: "local",
		});
	};
	const onSelectURL = (url) => {
		setVideoURLInput(url);
	};
	useEffect(() => {
		if (!isEmpty(videoURLInput) && videoURLInput !== props.attributes.url) {
			checkVideoURLInput();

			if (!isEmpty(videoSource) && videoSource !== "tiktok") {
				setAttributes({
					videoEmbedCode: adjustVideoStart(
						videoSource,
						videoEmbedCode,
						startTime,
						startTime,
					),
				});
			}
		}
	}, [videoURLInput]);

	const { createErrorNotice } = useDispatch(noticesStore);
	const onUploadError = (message) => {
		createErrorNotice(message, { type: "snackbar" });
	};
	const advancedVideoPlaceholderProps = {
		onSelectVideo,
		onSelectURL,
		onUploadError,
		value: videoId,
	};
	const advancedVideoBlockControlPropsProps = {
		...advancedVideoPlaceholderProps,
		url,
	};
	return (
		<>
			<InspectorControls group="settings">
				{url !== "" && (
					<>
						<PanelBody title={__("General")} initialOpen={true}>
							<div className="ub-labelled-toggle">
								<p>{__("Autofit video embed")}</p>
								<ToggleControl
									checked={autofit}
									onChange={() => {
										setAttributes({ autofit: !autofit });
										switch (videoSource) {
											case "youtube":
												setAttributes({
													videoEmbedCode: editEmbedArgs(
														videoSource,
														videoEmbedCode,
														autofit ? "add" : "remove",
														`width="100%" height="${
															preserveAspectRatio
																? Math.round((width * origHeight) / origWidth)
																: height
														}%"`,
													),
												});

												break;
											case "vimeo":
											case "dailymotion":
												//handled via styles
												break;
											default:
												console.log("no valid source");
										}
									}}
								/>
							</div>
							{!autofit && (
								<>
									<RangeControl
										label={__("Video width (percentage)")}
										value={width}
										onChange={(newWidth) => {
											setAttributes({ width: newWidth });

											let newVideoEmbedCode = videoEmbedCode;

											newVideoEmbedCode = newVideoEmbedCode.replace(
												/width="[0-9]+"/,
												`width="${newWidth}%"`,
											);
											if (videoSource === "facebook") {
												newVideoEmbedCode = newVideoEmbedCode.replace(
													/&width=[0-9]+/,
													`width="${newWidth}%"`,
												);
											}

											if (preserveAspectRatio) {
												//get ratio between current width and current height, then recalculate height according to ratio
												const newHeight = Math.round(
													(height * newWidth) / width,
												);
												setAttributes({
													height: newHeight,
												});
												newVideoEmbedCode = newVideoEmbedCode.replace(
													/height="[\d.]+"/,
													`height="${newHeight}%"`,
												);
												if (videoSource === "facebook") {
													newVideoEmbedCode = newVideoEmbedCode.replace(
														/&height=[\d.]+/,
														`height="${newHeight}%"`,
													);
												}
											}
											setAttributes({ videoEmbedCode: newVideoEmbedCode });
										}}
										min={0}
										max={100}
									/>
									{!preserveAspectRatio && (
										<RangeControl
											label={__("Video height (pixels)")}
											value={height}
											onChange={(height) => {
												let newVideoEmbedCode = videoEmbedCode;

												newVideoEmbedCode = newVideoEmbedCode.replace(
													/height="[\d.]+%?"/,
													`height="${height}"`,
												);

												if (videoSource === "facebook") {
													newVideoEmbedCode = newVideoEmbedCode.replace(
														/&height=[\d.]+%?/,
														`height="${height}"`,
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
														(origHeight * width) / origWidth,
													);

													let newVideoEmbedCode = videoEmbedCode.replace(
														/height="[0-9]+"/,
														`height="${newHeight}"`,
													);
													if (videoSource === "facebook") {
														newVideoEmbedCode = newVideoEmbedCode.replace(
															/&height=[0-9]+/,
															`height="${newHeight}"`,
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
								</>
							)}
							{autofit && (
								<UBSelectControl
									onChange={(newValue) => {
										setAttributes({ aspectRatio: newValue });
									}}
									value={aspectRatio}
									options={DEFAULT_ASPECT_RATIO_OPTIONS}
									label={__("Aspect Ratio", "ultimate-blocks")}
								/>
							)}

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
															"controls",
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
															"controls=0",
														),
													});
													break;
												case "dailymotion":
													setAttributes({
														videoEmbedCode: editEmbedArgs(
															"dailymotion",
															videoEmbedCode,
															showPlayerControls ? "add" : "remove",
															"controls=false",
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
																	"autoplay",
																),
															});
															break;

														case "youtube":
															let srcRegex =
																/<iframe[^>]*src=["']([^"']*)["'][^>]*>/;

															let match = videoEmbedCode.match(srcRegex);
															if (!autoplay) {
																if (match) {
																	let modifiedSrc = match[1] + "?autoplay=1";
																	let updatedVideoEmbedCode =
																		videoEmbedCode.replace(
																			match[1],
																			modifiedSrc,
																		);
																	setAttributes({
																		videoEmbedCode: editEmbedArgs(
																			videoSource,
																			updatedVideoEmbedCode,
																			autoplay ? "remove" : "add",
																			"autoplay=1",
																		),
																	});
																}
															} else {
																if (match) {
																	let updatedVideoEmbedCode =
																		videoEmbedCode.replace("?autoplay=1", "");
																	setAttributes({
																		videoEmbedCode: editEmbedArgs(
																			videoSource,
																			updatedVideoEmbedCode,
																			autoplay ? "remove" : "add",
																			"autoplay=1",
																		),
																	});
																}
															}
															break;
														case "vimeo":
															setAttributes({
																videoEmbedCode: editEmbedArgs(
																	videoSource,
																	videoEmbedCode,
																	autoplay ? "remove" : "add",
																	"autoplay=1",
																),
															});
															if (!autoplay) {
																setAttributes({
																	thumbnail: "",
																	thumbnailID: -1,
																});
																setCustomThumbnailStatus(false);
															}
															break;

														case "dailymotion":
															setAttributes({
																videoEmbedCode: editEmbedArgs(
																	"dailymotion",
																	videoEmbedCode,
																	autoplay ? "remove" : "add",
																	"autoplay=true",
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
													setStartTimeStatus(!allowCustomStartTime);

													if (allowCustomStartTime) {
														setAttributes({
															startTime: 0,
															videoEmbedCode: adjustVideoStart(
																videoSource,
																videoEmbedCode,
																0,
																startTime,
															),
														});
														setStartTime_d(0);
														setStartTime_h(0);
														setStartTime_m(0);
														setStartTime_s(0);

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
														setStartTime_d(d);
														setAttributes({
															startTime: startPoint,
															videoEmbedCode: adjustVideoStart(
																videoSource,
																videoEmbedCode,
																startPoint,
																startTime,
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
														setStartTime_h(h);
														setAttributes({
															startTime: startPoint,
															videoEmbedCode: adjustVideoStart(
																videoSource,
																videoEmbedCode,
																startPoint,
																startTime,
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
														setStartTime_m(m);

														let newCode = adjustVideoStart(
															videoSource,
															videoEmbedCode,
															startPoint,
															startTime,
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
													setStartTime_s(s);
													setAttributes({
														startTime: startPoint,
														videoEmbedCode: adjustVideoStart(
															videoSource,
															videoEmbedCode,
															startPoint,
															startTime,
														),
													});
												}
											}}
										/>
									</div>
								</>
							)}
							{["youtube", "local", "unknown", "videopress", "vimeo"].includes(
								videoSource,
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
															"loop",
														),
													});
													break;
												case "youtube":
													let videoId =
														/https:\/\/www\.youtube\.com\/watch\?v=((?:\w|-){11})/.exec(
															url,
														)[1];

													let newEmbedCode = editEmbedArgs(
														videoSource,
														videoEmbedCode,
														loop ? "remove" : "add",
														"loop=1",
													);

													setAttributes({
														videoEmbedCode: editEmbedArgs(
															videoSource,
															newEmbedCode,
															loop ? "remove" : "add",
															`playlist=${videoId}`,
														),
													});
													break;
												case "vimeo":
													setAttributes({
														videoEmbedCode: editEmbedArgs(
															videoSource,
															videoEmbedCode,
															loop ? "remove" : "add",
															"loop=true",
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
															"muted",
														),
													});
													break;
												case "vimeo":
													setAttributes({
														videoEmbedCode: editEmbedArgs(
															"vimeo",
															videoEmbedCode,
															mute ? "remove" : "add",
															"muted=1",
														),
													});
													break;
												case "dailymotion":
													setAttributes({
														videoEmbedCode: editEmbedArgs(
															"dailymotion",
															videoEmbedCode,
															mute ? "remove" : "add",
															"mute=true",
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
											setCustomThumbnailStatus(!useCustomThumbnail);
											if (useCustomThumbnail && thumbnail !== "") {
												setAttributes({
													thumbnail: "",
													thumbnailID: -1,
													videoEmbedCode: editThumbnail(
														videoSource,
														videoEmbedCode,
														"remove",
														thumbnail,
													),
												});
												setImageURLInputStatus(false);
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
										onClick={() => setImageURLInputStatus(!enterImageURL)}
									>
										{__("Insert thumbnail URL")}
									</Button>
									{enterImageURL && (
										<>
											<input
												type="text"
												value={imageURLInput}
												onChange={(e) => setImageURLInput(e.target.value)}
											/>
											<button
												onClick={() => {
													setAttributes({
														thumbnail: imageURLInput,
														videoEmbedCode: editThumbnail(
															videoSource,
															videoEmbedCode,
															"add",
															imageURLInput,
														),
													});
													setImageURLInput("");
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
															img.url,
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
													thumbnail,
												),
											});
											setCustomThumbnailStatus(true);
											setImageURLInputStatus(false);
											setImageURLInput("");
										}}
									>
										{__("Replace")}
									</button>
								</>
							)}
						</PanelBody>
					</>
				)}
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelBody title={__("Shadow")} initialOpen={false}>
					<PanelRow>
						<p>{__("Include a shadow")}</p>
						<ToggleControl
							checked={useShadow}
							onChange={() => {
								setShadowStatus(!useShadow);
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
										shadow: [Object.assign({}, shadow[0], { transparency })],
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
				<PanelBody
					title={__("Dimension Settings", "ultimate-blocks")}
					initialOpen={false}
				>
					<SpacingControl
						showByDefault
						attrKey="padding"
						label={__("Padding", "ultimate-blocks")}
					/>
					<SpacingControl
						minimumCustomValue={-Infinity}
						showByDefault
						attrKey="margin"
						label={__("Margin", "ultimate-blocks")}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="border">
				<BorderControl
					showDefaultBorder
					showDefaultBorderRadius
					attrBorderRadiusKey="borderRadius"
					attrBorderKey="border"
					borderLabel={__("Border", "ultimate-blocks")}
					borderRadiusLabel={__("Border Radius", "ultimate-blocks")}
				/>
			</InspectorControls>
			{url !== "" && (
				<AdvancedVideoBlockControls {...advancedVideoBlockControlPropsProps} />
			)}
			<div {...blockProps}>
				{url === "" && (
					<AdvancedVideoPlaceholder {...advancedVideoPlaceholderProps} />
				)}
				<div
					id={`ub-advanced-video-${blockID}`}
					className={`ub-advanced-video-container${
						autofit
							? ` ub-advanced-video-autofit${
									["youtube", "dailymotion", "vimeo"].includes(videoSource)
										? `-${videoSource}`
										: ""
								}`
							: ""
					}`}
					dangerouslySetInnerHTML={{
						__html: videoEmbedCode,
					}}
					style={Object.assign(
						autofit ? autofitContainerStyle : { width: `${width}%` },
						{
							borderTop: getSingleSideBorderValue(getBorderCSS(border), "top"),
							borderLeft: getSingleSideBorderValue(
								getBorderCSS(border),
								"left",
							),
							borderRight: getSingleSideBorderValue(
								getBorderCSS(border),
								"right",
							),
							borderBottom: getSingleSideBorderValue(
								getBorderCSS(border),
								"top",
							),
							borderTopLeftRadius: borderRadius?.topLeft,
							borderTopRightRadius: borderRadius?.topRight,
							borderBottomLeftRadius: borderRadius?.bottomLeft,
							borderBottomRightRadius: borderRadius?.bottomRight,
						},
						shadow[0].radius > 0
							? {
									boxShadow: `${
										shadow[0].radius *
										Math.cos(((450 - shadow[0].angle) % 360) * (Math.PI / 180))
									}px ${
										-shadow[0].radius *
										Math.sin(((450 - shadow[0].angle) % 360) * (Math.PI / 180))
									}px ${shadow[0].blur}px ${shadow[0].spread}px rgba(${parseInt(
										"0x" + shadow[0].color.substring(1, 3),
									)}, ${parseInt(
										"0x" + shadow[0].color.substring(3, 5),
									)}, ${parseInt("0x" + shadow[0].color.substring(5, 7))}, ${
										(100 - shadow[0].transparency) / 100
									})`,
								}
							: {},
					)}
				/>
				{autofit && extraEmbeds}
				{!props.isSelected && (
					<div className="ub-advanced-video__interactive-overlay" />
				)}
			</div>
		</>
	);
}
