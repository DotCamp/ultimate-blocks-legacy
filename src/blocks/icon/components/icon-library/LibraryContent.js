/**
 * WordPress Dependencies
 */
import classnames from "classnames";
import { __ } from "@wordpress/i18n";
import { map, isEmpty } from "lodash";
import { Button } from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";
/**
 * Custom Imports
 */
import { ultimateIcons } from "../../icons";

function Content(props) {
	const [icons, setIcons] = useState([]);

	const { mainCategoryFilter, onSelect, subCategoryFilter, search, value } =
		props;
	console.log(value);
	useEffect(() => {
		const iconObj = ultimateIcons.find(
			(obj) => obj.type === mainCategoryFilter
		);
		if (search.trim() === "") {
			const preparedIcons = iconObj?.icons.filter((icon) => {
				return icon?.categories?.includes(subCategoryFilter);
			});
			if (subCategoryFilter === "all") {
				setIcons(iconObj.icons);
			} else {
				setIcons(preparedIcons);
			}
		} else {
			const preparedIcons = iconObj?.icons.filter((icon) => {
				return icon?.title
					.toLocaleLowerCase()
					.trim()
					?.includes(search.toLocaleLowerCase().trim());
			});
			setIcons(preparedIcons);
		}
	}, [subCategoryFilter, mainCategoryFilter, search]);

	const isNoResults = isEmpty(icons);
	return (
		<div className="ub_icon_library_content_wrapper">
			<div
				className={classnames("ub_icon_library_content", {
					"no-results": isNoResults,
				})}
			>
				{map(icons, (icon) => {
					return (
						<Button
							key={icon?.name}
							className="ub_icon_library_item"
							onClick={() =>
								onSelect({ iconName: icon.name, type: mainCategoryFilter })
							}
							isPressed={icon?.name === value}
						>
							<span className="ub_icon_list_item">{icon.icon}</span>
							<span className="ub_list_item_title">
								{icon?.title ?? icon?.name}
							</span>
						</Button>
					);
				})}
				{isNoResults && <p>{__("No icons found.", "ultimate-blocks")}</p>}
			</div>
		</div>
	);
}

export default Content;
