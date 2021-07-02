import icon from "./icon";
import { EditorComponent } from "./components";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const { withSelect } = wp.data;

const attributes = {
	blockID: {
		type: "string",
		default: "",
	},
	title: {
		type: "string",
		default: "",
	},
	introduction: {
		type: "string",
		default: "",
	},
	advancedMode: {
		type: "boolean",
		default: false,
	},
	toolsIntro: {
		type: "string",
		default: __("Required tools"),
	},
	tools: {
		type: "array",
		default: [], //format: {name, imageid, imagealt, imageurl}
	},
	toolsListStyle: {
		type: "string",
		default: "none",
	},
	addToolImages: {
		type: "boolean",
		default: false,
	},
	suppliesIntro: {
		type: "string",
		default: __("Required supplies"),
	},
	supplies: {
		type: "array",
		default: [], //format: {name, imageid, imagealt, imageurl}
	},
	suppliesListStyle: {
		type: "string",
		default: "none",
	},
	addSupplyImages: {
		type: "boolean",
		default: false,
	},
	section: {
		type: "array",
		default: [{ sectionName: "", steps: [] }], //contains steps, if useSections is set to false, then only use contents of the first section. minimum of two steps.
	},
	sectionListStyle: {
		type: "string",
		default: "none",
	},
	timeIntro: {
		type: "string",
		default: __("Duration"),
	},
	totalTime: {
		type: "array",
		default: Array(7).fill(0),
	},
	totalTimeText: {
		type: "string",
		default: __("Total time: "),
	},
	cost: {
		type: "number",
		default: 0,
	},
	costCurrency: {
		type: "string",
		default: "USD",
	},
	costDisplayText: {
		type: "string",
		default: __("Total cost: "),
	},
	showUnitFirst: {
		type: "boolean",
		default: true,
	},
	howToYield: {
		//avoid using yield as variable name
		type: "string",
		default: "",
	},
	videoURL: {
		type: "string", //videoobject
		default: "", //needed: video url, thumbnail url, video description, upload date
	},
	videoThumbnailURL: {
		type: "string",
		default: "",
	},
	videoName: {
		type: "string",
		default: "",
	},
	videoDescription: {
		type: "string",
		default: "",
	},
	videoUploadDate: {
		type: "number", //UNIX Date
		default: 0,
	},
	videoEmbedCode: {
		type: "string",
		default: "<p>When insertion is successful, video should appear here</p>",
	},
	videoDuration: {
		type: "number",
		default: 0,
	},
	useSections: {
		type: "boolean",
		default: false,
	},
	includeSuppliesList: {
		type: "boolean",
		default: false,
	},
	includeToolsList: {
		type: "boolean",
		default: false,
	},
	resultIntro: {
		type: "string",
		default: __("Result"),
	},
	finalImageID: {
		type: "number",
		default: -1,
	},
	finalImageAlt: {
		type: "string",
		default: "",
	},
	finalImageURL: {
		type: "string",
		default: "",
	},
	finalImageCaption: {
		type: "string",
		default: "",
	},
	finalImageWidth: {
		type: "number",
		default: 0,
	},
	finalImageFloat: {
		type: "string",
		default: "none",
	},
	firstLevelTag: {
		type: "string",
		default: "h2",
	},
	secondLevelTag: {
		type: "string",
		default: "h3",
	},
	thirdLevelTag: {
		type: "string",
		default: "h4",
	},
};

registerBlockType("ub/how-to", {
	title: __("How To"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Tutorial"), __("How To"), __("Ultimate Blocks")],
	attributes,
	supports: {
		multiple: false,
	},
	edit: withSelect((select, ownProps) => {
		const { getBlock, getClientIdsWithDescendants } =
			select("core/block-editor") || select("core/editor");

		return {
			block: getBlock(ownProps.clientId),
			getBlock,
			getClientIdsWithDescendants,
		};
	})(EditorComponent),
	save: () => null,
});
