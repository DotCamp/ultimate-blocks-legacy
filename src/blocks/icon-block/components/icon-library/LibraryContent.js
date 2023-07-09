/**
 * WordPress Dependencies
 */
import classnames from "classnames";
import { __ } from "@wordpress/i18n";
import { map, isEmpty } from "lodash";
import { Button } from "@wordpress/components";

function Content(props) {
	const icons = [{ title: "WordPress", iconId: "wordpress" }];
	const isNoResults = isEmpty(icons);
	return (
		<div className="ub_icon_library_content_wrapper">
			<div
				className={classnames("ub_icon_library_content", {
					"no-results": isNoResults,
				})}
			>
				{map(icons, (icon, index) => {
					return (
						<Button
							key={icon?.iconId}
							className="ub_icon_library_item"
							onClick={() => props.onSelect(icon?.iconId)}
							isPressed={icon?.iconId === props?.value}
						>
							{icon?.title}
						</Button>
					);
				})}
				{isNoResults && <p>{__("No icons found.", "ultimate-blocks")}</p>}
			</div>
		</div>
	);
}

export default Content;
