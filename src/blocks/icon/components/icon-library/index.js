/**
 * WordPress Dependencies
 */
import { useState } from "@wordpress/element";

/**
 * Custom Dependencies
 */
import Content from "./LibraryContent";
import Sidebar from "./LibrarySidebar";

function IconsLibrary(props) {
	const [search, setSearch] = useState("");
	const [subCategoryFilter, setSubCategoryFilter] = useState("");
	const [mainCategoryFilter, setMainCategoryFilter] = useState("wordpress");

	return (
		<div className="ub_icons_library">
			<Sidebar
				subCategoryFilter={subCategoryFilter}
				search={search}
				setSubCategoryFilter={setSubCategoryFilter}
				setSearch={setSearch}
				mainCategoryFilter={mainCategoryFilter}
				setMainCategoryFilter={setMainCategoryFilter}
			/>
			<Content
				search={search}
				subCategoryFilter={subCategoryFilter}
				value={props.value}
				onSelect={props.onSelect}
				mainCategoryFilter={mainCategoryFilter}
			/>
		</div>
	);
}

export default IconsLibrary;
