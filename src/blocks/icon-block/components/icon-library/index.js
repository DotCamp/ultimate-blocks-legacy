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
	const [filter, setFilter] = useState({});

	return (
		<div className="ub_icons_library">
			<Sidebar
				search={search}
				filter={filter}
				setFilter={setFilter}
				setSearch={setSearch}
			/>
			<Content
				search={search}
				filter={filter}
				value={props.value}
				onSelect={props.onSelect}
			/>
		</div>
	);
}

export default IconsLibrary;
