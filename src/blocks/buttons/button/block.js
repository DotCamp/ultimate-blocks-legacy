/**
 * BLOCK: Button Block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from "./icons/icons";

import {
	generateIcon,
	dashesToCamelcase,
	mergeRichTextArray,
	upgradeButtonLabel,
} from "../../../common";
import {
	defaultButtonProps,
	editorDisplay,
	presetIconSize,
	allIcons,
	EditorComponent,
} from "./components";
import { useState } from "react";
import metadata from "./block.json";

import { withDispatch, withSelect } from "@wordpress/data";

import { compose } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
import { registerBlockType, createBlock } from "@wordpress/blocks";
import "./block-styles";

registerBlockType(metadata.name, {
	...metadata,
	edit: EditorComponent,
	attributes: metadata.attributes,
	save: () => null,
	icon: icon,
	example: {
		attributes: {
			buttonColor: "#f01313",
			size: "medium",
		},
	},
});
