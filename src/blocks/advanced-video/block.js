const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const { withState, compose } = wp.compose;
const { withSelect } = wp.data;

import icon from "./icon";
import { AdvancedVideoBlock } from "./components";

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
		borderSize: {
			type: "number",
			default: 0,
		},
		borderStyle: {
			//custom border styles placed outside embedded player
			type: "string",
			default: "", //choices: custom
		},
		borderColor: {
			type: "string",
			default: "",
		},

		//begin border attributes for each side
		topBorderSize: {
			type: "number",
			default: 0,
		},
		rightBorderSize: {
			type: "number",
			default: 0,
		},
		bottomBorderSize: {
			type: "number",
			default: 0,
		},
		leftBorderSize: {
			type: "number",
			default: 0,
		},

		topBorderStyle: {
			type: "string",
			default: "",
		},
		rightBorderStyle: {
			type: "string",
			default: "",
		},
		bottomBorderStyle: {
			type: "string",
			default: "",
		},
		leftBorderStyle: {
			type: "string",
			default: "",
		},

		topBorderColor: {
			type: "string",
			default: "",
		},
		rightBorderColor: {
			type: "string",
			default: "",
		},
		bottomBorderColor: {
			type: "string",
			default: "",
		},
		leftBorderColor: {
			type: "string",
			default: "",
		},
		//end border attributes for each side

		//begin corner attributes
		topLeftRadius: {
			type: "number",
			default: 0,
		},
		topRightRadius: {
			type: "number",
			default: 0,
		},
		bottomLeftRadius: {
			type: "number",
			default: 0,
		},
		bottomRightRadius: {
			type: "number",
			default: 0,
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
		thumbnailID: {
			type: "number",
			default: -1,
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
		playerColor: {
			type: "string",
			default: "", //vimeo only
		},
		showInDesktop: {
			type: "boolean",
			default: true,
		},
		showInTablet: {
			type: "boolean",
			default: true,
		},
		showInMobile: {
			type: "boolean",
			default: true,
		},
		shadow: {
			type: "array",
			default: [
				{
					angle: 0,
					radius: 0,
					color: "#000000",
					transparency: 0,
					blur: 0,
					spread: 0,
				},
			],
		},
	},
	edit: withSelect((select, ownProps) => {
		const { getBlock, getBlockRootClientId, getClientIdsWithDescendants } =
			select("core/block-editor") || select("core/editor");

		return {
			getBlock,
			block: getBlock(ownProps.clientId),
			parentID: getBlockRootClientId(ownProps.clientId),
			getClientIdsWithDescendants,
		};
	})(AdvancedVideoBlock),
	save: () => null,
});
