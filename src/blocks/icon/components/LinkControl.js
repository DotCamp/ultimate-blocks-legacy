/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { link } from "@wordpress/icons";
import { useState } from "@wordpress/element";
import { displayShortcut, isKeyboardEvent } from "@wordpress/keycodes";
import { Popover, ToolbarGroup, ToolbarButton } from "@wordpress/components";
import { __experimentalLinkControl as LinkControl } from "@wordpress/block-editor";

function CustomLinkControl({ attributes, setAttributes }) {
	const [isEditingURL, setIsEditingURL] = useState(false);
	const { linkRel, linkTarget, linkUrl } = attributes;

	const isURLSet = !!linkUrl;
	const opensInNewTab = linkTarget === "_blank";

	const NEW_TAB_REL = "noreferrer noopener";

	function startEditing(event) {
		event.preventDefault();
		setIsEditingURL(true);
	}

	function unlink() {
		setAttributes({
			linkUrl: undefined,
			linkTarget: undefined,
			linkRel: undefined,
		});
		setIsEditingURL(false);
	}

	function onToggleOpenInNewTab(value) {
		const newLinkTarget = value ? "_blank" : undefined;

		let updatedRel = linkRel;
		if (newLinkTarget && !linkRel) {
			updatedRel = NEW_TAB_REL;
		} else if (!newLinkTarget && linkRel === NEW_TAB_REL) {
			updatedRel = undefined;
		}

		setAttributes({
			linkTarget: newLinkTarget,
			linkRel: updatedRel,
		});
	}

	return (
		<>
			<ToolbarGroup>
				<ToolbarButton
					name="link"
					icon={link}
					title={__("Link", "ultimate-blocks")}
					shortcut={displayShortcut.primary("k")}
					onClick={startEditing}
					isActive={isURLSet}
				/>
			</ToolbarGroup>
			{isEditingURL && (
				<Popover
					position="bottom center"
					onClose={() => {
						setIsEditingURL(false);
					}}
					focusOnMount={isEditingURL ? "firstElement" : false}
				>
					<LinkControl
						className="wp-block-navigation-link__inline-link-input"
						value={{ url: linkUrl, opensInNewTab }}
						onChange={({
							url: newURL = "",
							opensInNewTab: newOpensInNewTab,
						}) => {
							setAttributes({ linkUrl: newURL });

							if (opensInNewTab !== newOpensInNewTab) {
								onToggleOpenInNewTab(newOpensInNewTab);
							}
						}}
						onRemove={() => {
							unlink();
						}}
					/>
				</Popover>
			)}
		</>
	);
}
export default CustomLinkControl;
