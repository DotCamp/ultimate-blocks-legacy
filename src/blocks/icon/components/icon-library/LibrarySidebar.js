/**
 * WordPress Dependencies
 */
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { ultimateIcons } from "../../icons";
import {
	SearchControl,
	MenuGroup,
	MenuItem,
	PanelBody,
} from "@wordpress/components";

function Sidebar(props) {
	const {
		search,
		setSearch,
		subCategoryFilter,
		mainCategoryFilter,
		setSubCategoryFilter,
		setMainCategoryFilter,
	} = props;

	const preparedIconPacks = ultimateIcons.map((iconPack) => {
		const categories = iconPack?.categories;
		const allCategories = categories?.map((category) => {
			const categoryName = category?.name;
			const categoryIcons = iconPack?.icons.filter((icon) => {
				return icon?.categories?.includes(categoryName);
			});
			return { ...category, count: categoryIcons.length };
		});
		allCategories.unshift({
			name: "all-" + iconPack?.type,
			title: "All",
			count: iconPack?.icons.length,
		});
		return { ...iconPack, categories: allCategories };
	});

	useEffect(() => {
		setSubCategoryFilter(preparedIconPacks[0]?.categories?.[0]?.name);
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

			{!isEmpty(preparedIconPacks) && (
				<MenuGroup className="ub_icons_library_sidebar_item_group">
					{preparedIconPacks.map((iconPack, index) => {
						return (
							<PanelBody title={iconPack?.title} initialOpen={index === 0}>
								{iconPack?.categories.map((category) => {
									return (
										<MenuItem
											key={category?.name}
											className="ub_icons_library_sidebar_item"
											isPressed={subCategoryFilter === category?.name}
											onClick={() => {
												setSubCategoryFilter(category?.name);
												setMainCategoryFilter(iconPack?.type);
											}}
										>
											<span>{category?.title}</span>
											<span>{category?.count}</span>
										</MenuItem>
									);
								})}
							</PanelBody>
						);
					})}
				</MenuGroup>
			)}
		</div>
	);
}

export default Sidebar;
