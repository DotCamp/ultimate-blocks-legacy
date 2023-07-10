import { isEmpty } from "lodash";
import { ultimateIcons } from "./icons";
import { getStyles } from "./get-styles";

function Save(props) {
	const {
		attributes: { icon, linkTarget, linkUrl, linkRel },
	} = props;
	const finalIcon =
		ultimateIcons
			.find((obj) => obj.type === icon?.type)
			?.icons?.find((ic) => ic.name === icon.iconName) ?? "";

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
		<div className={props.className} style={blockStyles}>
			{!isEmpty(icon) && (
				<div className="ub_icon">
					<Tag className="ub_icon_wrapper" {...anchorAttributes}>
						{finalIcon?.icon}
					</Tag>
				</div>
			)}
		</div>
	);
}
export default Save;
