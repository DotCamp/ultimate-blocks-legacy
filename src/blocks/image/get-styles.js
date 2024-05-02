import { omitBy, isUndefined, trim, isEmpty, get } from "lodash";
import {
	getBorderCSS,
	getSingleSideBorderValue,
} from "../utils/styling-helpers";

export function getImageSize(width, height) {
	const size = {
		width,
		height,
	};
	return omitBy(
		size,
		(value) =>
			value === false ||
			isEmpty(value) ||
			isUndefined(value) ||
			trim(value) === "" ||
			trim(value) === "undefined undefined undefined",
	);
}
export function getImageStyles(attributes) {
	const aspectRatio = get(attributes, "aspectRatio", "");
	const scale = get(attributes, "scale", "none");
	const width = get(attributes, "width", "");
	const height = get(attributes, "height", "");
	const borderAttr = get(attributes, "border", {
		top: "",
		right: "",
		bottom: "",
		left: "",
	});
	const borderRadius = get(attributes, "borderRadius", {
		topLeft: "",
		topRight: "",
		bottomLeft: "",
		bottomRight: "",
	});
	const border = getBorderCSS(borderAttr);
	const imageSize = getImageSize(width, height);
	let styles = {
		...imageSize,
		aspectRatio,
		objectFit: scale,
		borderTopLeftRadius: borderRadius.topLeft,
		borderTopRightRadius: borderRadius.topRight,
		borderBottomLeftRadius: borderRadius.bottomLeft,
		borderBottomRightRadius: borderRadius.bottomRight,
		borderTop: getSingleSideBorderValue(border, "top"),
		borderRight: getSingleSideBorderValue(border, "right"),
		borderBottom: getSingleSideBorderValue(border, "bottom"),
		borderLeft: getSingleSideBorderValue(border, "left"),
	};

	return omitBy(
		styles,
		(value) =>
			value === false ||
			isEmpty(value) ||
			isUndefined(value) ||
			trim(value) === "" ||
			trim(value) === "undefined undefined undefined",
	);
}
