/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
/**
 * Custom Imports
 */
import Placeholder from "./components/Placeholder";
import { Modal } from "@wordpress/components";
import { invoke, get, isEmpty } from "lodash";

import IconsLibrary from "./components/icon-library";
function Edit(props) {
	const [isLibraryOpen, setLibraryOpen] = useState(false);
	const { attributes, setAttributes, className } = props;

	return (
		<div className={className}>
			<Placeholder setLibraryOpen={setLibraryOpen} />
			{isLibraryOpen && (
				<Modal
					isFullScreen
					className="ub_icons_library_modal"
					title={__("Icons", "ultimate-blocks")}
					onRequestClose={() => setLibraryOpen(false)}
				>
					<IconsLibrary
						value={attributes?.iconName}
						onSelect={(newIcon) => {
							setAttributes({ iconName: newIcon });
							setLibraryOpen(false);
						}}
					/>
				</Modal>
			)}
		</div>
	);
}
export default Edit;
