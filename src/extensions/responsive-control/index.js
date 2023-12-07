import { __ } from "@wordpress/i18n";
import { assign, isEmpty } from "lodash";
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import Inspector from "./inspector";

const isUbBlock = (blockName) => blockName.startsWith("ub/");
const addAttributes = (settings) => {
	if (isEmpty(settings.attributes) || !isUbBlock(settings.name)) {
		return settings;
	}
	if (isUbBlock(settings.name)) {
		settings.attributes = assign(
			settings.attributes,
			{
				isHideOnDesktop: {
					type: "boolean",
					default: false,
				},
				isHideOnMobile: {
					type: "boolean",
					default: false,
				},
				isHideOnTablet: {
					type: "boolean",
					default: false,
				},
			},
			{}
		);
	}

	return settings;
};

const withAdvanceControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (!isUbBlock(props.name)) {
			return <BlockEdit {...props} />;
		}

		return (
			<>
				<BlockEdit {...props} />
				<Inspector {...props} />
			</>
		);
	};
}, "withAdvanceControls");

if (typeof ub_extensions !== "undefined") {
	const responsiveControl = ub_extensions.find(
		(extensions) => extensions.name === "responsive-control"
	);
	if (responsiveControl.active) {
		addFilter(
			"editor.BlockEdit",
			"ultimate-blocks/with-advance-controls",
			withAdvanceControls
		);

		addFilter(
			"blocks.registerBlockType",
			"ultimate-blocks/add-attributes",
			addAttributes
		);
	}
}
