import { omitBy, isUndefined, trim, isEmpty } from "lodash";
import { getSpacingCss } from "../utils/styling-helpers";

export function getStyles(attributes) {
	const paddingObj = getSpacingCss(attributes.padding);
	const marginObj = getSpacingCss(attributes.margin);
	const contentPadding = getSpacingCss(attributes.contentPadding);
	const linkPadding = getSpacingCss(attributes.linkPadding);
	const postPadding = getSpacingCss(attributes.postPadding);

	const imageBorderRadius = {
		"--ub-post-grid-image-top-left-radius":
			attributes.imageBorderRadius?.topLeft,
		"--ub-post-grid-image-top-right-radius":
			attributes.imageBorderRadius?.topRight,
		"--ub-post-grid-image-bottom-left-radius":
			attributes.imageBorderRadius?.bottomLeft,
		"--ub-post-grid-image-bottom-right-radius":
			attributes.imageBorderRadius?.bottomRight,
	};
	const postBorderRadius = {
		"--ub-post-grid-post-top-left-radius": attributes.postBorderRadius?.topLeft,
		"--ub-post-grid-post-top-right-radius":
			attributes.postBorderRadius?.topRight,
		"--ub-post-grid-post-bottom-left-radius":
			attributes.postBorderRadius?.bottomLeft,
		"--ub-post-grid-post-bottom-right-radius":
			attributes.postBorderRadius?.bottomRight,
	};
	const linkBorderRadius = {
		"--ub-post-grid-link-top-left-radius": attributes.linkBorderRadius?.topLeft,
		"--ub-post-grid-link-top-right-radius":
			attributes.linkBorderRadius?.topRight,
		"--ub-post-grid-link-bottom-left-radius":
			attributes.linkBorderRadius?.bottomLeft,
		"--ub-post-grid-link-bottom-right-radius":
			attributes.linkBorderRadius?.bottomRight,
	};
	let styles = {
		// Colors
		"--ub-post-grid-post-background": !isEmpty(attributes?.postBackgroundColor)
			? attributes.postBackgroundColor
			: attributes?.postBackgroundGradient,
		"--ub-post-grid-link-background": !isEmpty(attributes?.linkBackgroundColor)
			? attributes.linkBackgroundColor
			: attributes?.linkBackgroundGradient,
		"--ub-post-grid-title-color": attributes?.postTitleColor,
		"--ub-post-grid-author-color": attributes?.authorColor,
		"--ub-post-grid-date-color": attributes?.dateColor,
		"--ub-post-grid-excerpt-color": attributes?.excerptColor,
		"--ub-post-grid-link-color": attributes?.linkColor,
		// Hover
		"--ub-post-grid-post-hover-background": !isEmpty(
			attributes?.postBackgroundColorHover,
		)
			? attributes.postBackgroundColorHover
			: attributes?.postBackgroundGradientHover,
		"--ub-post-grid-link-hover-background": !isEmpty(
			attributes?.linkBackgroundColorHover,
		)
			? attributes.linkBackgroundColorHover
			: attributes?.linkBackgroundGradientHover,
		"--ub-post-grid-title-hover-color": attributes?.postTitleColorHover,
		"--ub-post-grid-author-hover-color": attributes?.authorColorHover,
		"--ub-post-grid-date-hover-color": attributes?.dateColorHover,
		"--ub-post-grid-excerpt-hover-color": attributes?.excerptColorHover,
		"--ub-post-grid-link-hover-color": attributes?.linkColorHover,
		// Spacing
		"--ub-post-grid-content-padding-top": contentPadding?.top,
		"--ub-post-grid-content-padding-right": contentPadding?.right,
		"--ub-post-grid-content-padding-bottom": contentPadding?.bottom,
		"--ub-post-grid-content-padding-left": contentPadding?.left,
		"--ub-post-grid-link-padding-top": linkPadding?.top,
		"--ub-post-grid-link-padding-right": linkPadding?.right,
		"--ub-post-grid-link-padding-bottom": linkPadding?.bottom,
		"--ub-post-grid-link-padding-left": linkPadding?.left,
		"--ub-post-grid-post-padding-top": postPadding?.top,
		"--ub-post-grid-post-padding-right": postPadding?.right,
		"--ub-post-grid-post-padding-bottom": postPadding?.bottom,
		"--ub-post-grid-post-padding-left": postPadding?.left,
		"--ub-post-grid-row-gap": attributes.rowGap,
		"--ub-post-grid-column-gap": attributes.columnGap,
		paddingTop: paddingObj?.top,
		paddingRight: paddingObj?.right,
		paddingBottom: paddingObj?.bottom,
		paddingLeft: paddingObj?.left,
		marginTop: marginObj?.top,
		marginRight: marginObj?.right,
		marginBottom: marginObj?.bottom,
		marginLeft: marginObj?.left,
		// Borders
		...imageBorderRadius,
		...postBorderRadius,
		...linkBorderRadius,
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
