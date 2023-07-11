/**
 * External dependencies
 */
import classnames from "classnames";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	Button,
	Modal,
	Notice,
	RangeControl,
	TextareaControl,
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import { isValidSVG } from "../utils";

/**
 * Internal dependencies
 */

export default function CustomInserterModal(props) {
	const {
		isCustomInserterOpen,
		setCustomInserterOpen,
		attributes,
		setAttributes,
	} = props;
	const [iconSize, setIconSize] = useState(100);
	const [customIcon, setCustomIcon] = useState(attributes.svgIcon ?? "");

	const isSVG = isValidSVG(customIcon);
	function insertCustomIcon() {
		if (isSVG) {
			setAttributes({
				icon: {},
				svgIcon: customIcon,
			});
			setCustomInserterOpen(false);
		}
	}

	return (
		<Modal
			className="ub_custom_svg_inserter__modal"
			title={__("Custom Icon", "ultimate-blocks")}
			onRequestClose={() => setCustomInserterOpen(false)}
			isFullScreen
		>
			<div className="ub_custom_svg_inserter">
				<div className="ub_custom_svg_inserter__content">
					<TextareaControl
						label={__("Custom icon", "ultimate-blocks")}
						hideLabelFromVision={true}
						value={customIcon}
						onChange={(newValue) => {
							setCustomIcon(newValue);
						}}
						placeholder={__(
							"Paste the SVG code for your custom icon.",
							"ultimate-blocks"
						)}
					/>
				</div>
				<div className="ub_custom_svg_inserter__sidebar">
					<div className="icon-preview">
						<div className={classnames("icon-preview__window")}>
							{isSVG && (
								<div
									style={{ width: iconSize + "px", height: iconSize + "px" }}
									dangerouslySetInnerHTML={{ __html: customIcon }}
								></div>
							)}
						</div>
						<div className="ub_icon_controls">
							<div className="ub_icon_controls__size">
								<span>{__("Preview size", "ultimate-blocks")}</span>
								<RangeControl
									min={24}
									max={400}
									initialPosition={100}
									withInputField={false}
									onChange={(value) => setIconSize(value)}
								/>
							</div>
						</div>
						{customIcon && !isSVG && (
							<Notice status="error" isDismissible={false}>
								{__(
									"The icon you inserted is not a valid SVG format or contains non-SVG elements.",
									"ultimate-blocks"
								)}
							</Notice>
						)}
					</div>
					<div className="icon-insert-buttons">
						<Button
							label={__("Clear custom icon", "ultimate-blocks")}
							isSecondary
							disabled={!customIcon}
							onClick={() => setCustomIcon("")}
						>
							{__("Clear", "ultimate-blocks")}
						</Button>
						<Button
							label={__("Insert custom icon", "ultimate-blocks")}
							isPrimary
							disabled={!customIcon || !isSVG}
							onClick={insertCustomIcon}
						>
							{__("Insert custom icon", "ultimate-blocks")}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
