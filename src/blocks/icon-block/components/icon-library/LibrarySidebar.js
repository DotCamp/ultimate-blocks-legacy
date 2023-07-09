/**
 * WordPress Dependencies
 */
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { SearchControl, MenuGroup, MenuItem } from "@wordpress/components";

function Sidebar(props) {
	const categories = [
		{ title: "All", id: "all" },
		{ title: "Arrow", id: "arrow" },
		{ title: "Block", id: "block" },
		{ title: "Device", id: "device" },
		{ title: "Media", id: "media" },
	];

	useEffect(() => {
		props?.setFilter(categories[0]?.id);
	}, []);

	return (
		<div className="ub_icons_library_sidebar">
			<SearchControl
				value={props?.search}
				onChange={(newValue) => {
					props?.setSearch(newValue);
				}}
				placeholder={__("Search Icon", "ultimate-blocks")}
			/>

			{!isEmpty(categories) && (
				<MenuGroup className="ub_icons_library_sidebar_item_group">
					{categories.map((category, index) => {
						return (
							<MenuItem
								key={index}
								className="ub_icons_library_sidebar_item"
								isPressed={props?.filter === category?.id}
								onClick={() => {
									props?.setFilter(category?.id);
								}}
							>
								<span>{category?.title}</span>
							</MenuItem>
						);
					})}
				</MenuGroup>
			)}
		</div>
	);
}

export default Sidebar;
