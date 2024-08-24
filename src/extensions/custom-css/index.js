import { __ } from "@wordpress/i18n";
import { assign, isEmpty } from "lodash";
import { useEffect } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import Inspector from "./inspector";
import { replaceSelector } from "../utils";

const isUbBlock = (blockName) => blockName.startsWith("ub/");
const addAttributes = (settings) => {
	if (isEmpty(settings.attributes) || !isUbBlock(settings.name)) {
		return settings;
	}
	if (isUbBlock(settings.name)) {
		settings.attributes = assign(
			settings.attributes,
			{
				ubCustomCSS: {
					type: "string",
					default: "selector { \n\n}",
				},
			},
			{},
		);
		if (isEmpty(settings?.attributes?.blockID)) {
			settings.attributes = assign(
				settings.attributes,
				{
					blockID: {
						type: "string",
						default: "",
					},
				},
				{},
			);
		}
	}

	return settings;
};

const withAdvanceControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (!isUbBlock(props.name)) {
			return <BlockEdit {...props} />;
		}
		// useEffect(() => {
		// 	props.setAttributes({ blockID: props.clientId });
		// }, [props.clientId]);
		return (
			<>
				<BlockEdit {...props} />
				{!isEmpty(props.attributes.ubCustomCSS) &&
					props.attributes.ubCustomCSS !== "selector { \n\n}" && (
						<style
							className="ub-generated-styles"
							dangerouslySetInnerHTML={{
								__html: replaceSelector(
									props.attributes.ubCustomCSS,
									props.clientId,
								),
							}}
						></style>
					)}
				<Inspector {...props} />
			</>
		);
	};
}, "withAdvanceControls");

if (typeof ub_extensions !== "undefined") {
	const responsiveControl = ub_extensions.find(
		(extensions) => extensions.name === "custom-css",
	);
	if (responsiveControl.active) {
		addFilter(
			"editor.BlockEdit",
			"ultimate-blocks/with-advance-controls",
			withAdvanceControls,
		);

		addFilter(
			"blocks.registerBlockType",
			"ultimate-blocks/add-attributes",
			addAttributes,
		);
	}
}
