import { isEmpty } from "lodash";
import { ultimateIcons } from "./icons";

function Save(props) {
	const {
		attributes: { icon },
	} = props;
	const finalIcon =
		ultimateIcons
			.find((obj) => obj.type === icon?.type)
			?.icons?.find((ic) => ic.name === icon.iconName) ?? "";

	return (
		<div className={props.className}>
			{!isEmpty(icon) && <div className="ub_icon">{finalIcon?.icon}</div>}
		</div>
	);
}
export default Save;
