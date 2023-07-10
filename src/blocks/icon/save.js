import { isEmpty } from "lodash";
import { ultimateIcons } from "./icons";
import { getStyles } from "./get-styles";

function Save(props) {
	const {
		attributes: { icon },
	} = props;
	const finalIcon =
		ultimateIcons
			.find((obj) => obj.type === icon?.type)
			?.icons?.find((ic) => ic.name === icon.iconName) ?? "";

	const blockStyles = getStyles(props.attributes);

	return (
		<div className={props.className} style={blockStyles}>
			{!isEmpty(icon) && <div className="ub_icon">{finalIcon?.icon}</div>}
		</div>
	);
}
export default Save;
