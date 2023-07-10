/**
 * WordPress Dependencies
 */
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { SearchControl, MenuGroup, MenuItem } from "@wordpress/components";
import { ultimateIcons } from "../../icons";

function Sidebar(props) {
	const {
		search,
		setSearch,
		subCategoryFilter,
		setSubCategoryFilter,
		mainCategoryFilter,
	} = props;

	const iconObj = ultimateIcons.find((obj) => obj.type === mainCategoryFilter);
	const preparedIconsCategories = iconObj?.categories?.map((category) => {
		const categoryName = category?.name;
		const categoryIcons = iconObj?.icons.filter((icon) => {
			return icon?.categories?.includes(categoryName);
		});
		return { ...category, count: categoryIcons.length };
	});
	preparedIconsCategories.unshift({
		name: "all",
		title: "All",
		count: iconObj?.icons.length,
	});

	useEffect(() => {
		setSubCategoryFilter(preparedIconsCategories[0]?.name);
	}, []);

	return (
		<div className="ub_icons_library_sidebar">
			<SearchControl
				value={search}
				onChange={(newValue) => {
					setSearch(newValue);
				}}
				placeholder={__("Search Icon", "ultimate-blocks")}
			/>

			{!isEmpty(preparedIconsCategories) && (
				<MenuGroup className="ub_icons_library_sidebar_item_group">
					{preparedIconsCategories.map((category, index) => {
						return (
							<MenuItem
								key={index}
								className="ub_icons_library_sidebar_item"
								isPressed={subCategoryFilter === category?.name}
								onClick={() => {
									setSubCategoryFilter(category?.name);
								}}
							>
								<span>{category?.title}</span>
								<span>{category?.count}</span>
							</MenuItem>
						);
					})}
				</MenuGroup>
			)}
		</div>
	);
}

export default Sidebar;
