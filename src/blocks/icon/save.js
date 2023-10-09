import { isEmpty } from "lodash";
import { ultimateIcons } from "./icons";
import { getStyles } from "./get-styles";
import { useBlockProps } from "@wordpress/block-editor";

function Save(props) {
	const {
		attributes: { icon, linkTarget, linkUrl, linkRel, svgIcon },
	} = props;
	const hasIcon = !isEmpty(icon);
	const hasSVGIcon = !isEmpty(svgIcon);
	const blockProps = useBlockProps.save({
		style: getStyles(props.attributes),
	});
	const finalIcon = hasIcon
		? ultimateIcons
				.find((obj) => obj.type === icon?.type)
				?.icons?.find((ic) => ic.name === icon.iconName)?.icon ?? ""
		: svgIcon;

	const blockStyles = getStyles(props.attributes);

	const Tag = isEmpty(linkUrl) ? "div" : "a";
	const anchorAttributes = isEmpty(linkUrl)
		? {}
		: {
				rel: linkRel,
				href: linkUrl,
				target: linkTarget,
		  };
	return (
		<div {...blockProps}>
			{hasIcon && (
				<div className="ub_icon">
					<Tag className="ub_icon_wrapper" {...anchorAttributes}>
						{finalIcon}
					</Tag>
				</div>
			)}

			{hasSVGIcon && !hasIcon && (
				<div className="ub_icon">
					<Tag
						{...anchorAttributes}
						className="ub_icon_wrapper"
						dangerouslySetInnerHTML={{ __html: finalIcon }}
					></Tag>
				</div>
			)}
		</div>
	);
}
export default Save;
