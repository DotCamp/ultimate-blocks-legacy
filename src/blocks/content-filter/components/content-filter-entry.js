import icon from "../icon";

import { useEffect, useState, useRef } from "react";
import { SpacingControl } from "../../components";
import { getStyles } from "./get-styles";
import metadata from "./block.json";
import { __ } from "@wordpress/i18n";
import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
} from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";
import { PanelBody } from "@wordpress/components";

function NewDropdown(props) {
	const wrapperRef = useRef(null);

	const [showDropdown, setDropdownStatus] = useState(false);

	const { attributes, setAttributes } = props;

	const { availableFilters, selectedFilters } = attributes;

	function useOutsideAlerter(ref) {
		useEffect(() => {
			/**
			 * Alert if clicked on outside of element
			 */
			function handleClickOutside(event) {
				if (ref.current && !ref.current.contains(event.target)) {
					setDropdownStatus(false);
				}
			}

			// Bind the event listener
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				// Unbind the event listener on clean up
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [ref]);
	}

	useOutsideAlerter(wrapperRef);

	let dropdownContent = [];
	availableFilters.forEach((category, i) => {
		if (category.filters.length > 0) {
			if (Array.isArray(selectedFilters[i])) {
				selectedFilters[i].forEach((f, j) => {
					if (f === false) {
						dropdownContent.push({
							name: availableFilters[i].filters[j],
							category: i,
							index: j,
						});
					}
				});
			} else {
				if (selectedFilters[i] === -1) {
					availableFilters[i].filters.forEach((f, j) => {
						dropdownContent.push({
							name: f,
							category: i,
							index: j,
						});
					});
				}
			}
		}
	});

	return (
		<div ref={wrapperRef} className="ub-content-filter-dropdown-container">
			{
				<>
					<button
						className="ub-content-assigned-filter-tag"
						onClick={() => {
							if (dropdownContent.length > 0) {
								setDropdownStatus(!showDropdown);
							}
						}}
					>
						+
					</button>
					{showDropdown && (
						<ul className="ub-content-filter-dropdown-content">
							{dropdownContent.map((item) => (
								<li
									onClick={() => {
										setAttributes({
											selectedFilters: [
												...selectedFilters.slice(0, item.category),
												availableFilters[item.category].canUseMultiple
													? [
															...selectedFilters[item.category].slice(
																0,
																item.index,
															),
															!selectedFilters[item.category][item.index],
															...selectedFilters[item.category].slice(
																item.index + 1,
															),
														]
													: item.index,
												...selectedFilters.slice(item.category + 1),
											],
										});
										setDropdownStatus(false);
									}}
								>
									{item.name}
								</li>
							))}
						</ul>
					)}
				</>
			}
		</div>
	);
}

function OldContentFilterEntry(props) {
	const { setAttributes, attributes } = props;

	const { availableFilters, selectedFilters, buttonColor, buttonTextColor } =
		attributes;

	const [tagList, setTagList] = useState([]);

	useEffect(() => {
		if (availableFilters.length > 0 && selectedFilters.length === 0) {
			let newSelectedFilters = [];
			availableFilters.forEach((category) => {
				newSelectedFilters.push(
					category.canUseMultiple
						? Array(category.filters.length).fill(false)
						: -1,
				);
			});

			setAttributes({ selectedFilters: newSelectedFilters });
		}

		let tempTagList = [];

		selectedFilters.forEach((selection, i) => {
			if (Array.isArray(selection)) {
				selection
					.map((a, i) => ({ val: a, index: i }))
					.filter((a) => a.val === true)
					.forEach((a) =>
						tempTagList.push({
							name: availableFilters[i].filters[a.index],
							categoryIndex: i,
							tagIndex: a.index,
						}),
					);
			} else
				tempTagList.push(
					selection > -1
						? {
								name: availableFilters[i].filters[selection],
								categoryIndex: i,
								tagIndex: selection,
							}
						: null,
				);
		});

		setTagList(tempTagList);
	}, [availableFilters, selectedFilters]);

	return (
		<div className="ub-content-filter-panel">
			<InnerBlocks templateLock={false} />
			<div className="ub-content-assigned-filter-tag-area">
				{tagList
					.filter((tag) => tag != null && tag.hasOwnProperty("name"))
					.map((tag) => (
						<div className="ub-content-assigned-filter-tag">
							<div className="ub-content-filter-tag-deselect">
								<span
									title={__("Deselect This Filter")}
									onClick={() => {
										const { categoryIndex: i, tagIndex: j } = tag;
										let newSelectedFilters = [
											...selectedFilters.slice(0, i),
											Array.isArray(selectedFilters[i])
												? [
														...selectedFilters[i].slice(0, j),
														false,
														...selectedFilters[i].slice(j + 1),
													]
												: -1,
											...selectedFilters.slice(i + 1),
										];

										setAttributes({
											selectedFilters: newSelectedFilters,
										});
									}}
									class="dashicons dashicons-dismiss"
								/>
							</div>
							{tag.name}
						</div>
					))}
				<NewDropdown attributes={attributes} setAttributes={setAttributes} />
			</div>
		</div>
	);
}

function ContentFilterEntry(props) {
	const { setAttributes, attributes } = props;

	const { availableFilters, selectedFilters, buttonColor, buttonTextColor } =
		attributes;

	const [tagList, setTagList] = useState([]);

	useEffect(() => {
		if (availableFilters.length > 0 && selectedFilters.length === 0) {
			let newSelectedFilters = [];
			availableFilters.forEach((category) => {
				newSelectedFilters.push(
					category.canUseMultiple
						? Array(category.filters.length).fill(false)
						: -1,
				);
			});

			setAttributes({ selectedFilters: newSelectedFilters });
		}

		let tempTagList = [];

		selectedFilters.forEach((selection, i) => {
			if (Array.isArray(selection)) {
				selection
					.map((a, i) => ({ val: a, index: i }))
					.filter((a) => a.val === true)
					.forEach((a) =>
						tempTagList.push({
							name: availableFilters[i].filters[a.index],
							categoryIndex: i,
							tagIndex: a.index,
						}),
					);
			} else
				tempTagList.push(
					selection > -1
						? {
								name: availableFilters[i].filters[selection],
								categoryIndex: i,
								tagIndex: selection,
							}
						: null,
				);
		});

		setTagList(tempTagList);
	}, [availableFilters, selectedFilters]);

	const styles = getStyles(attributes);
	return (
		<>
			<InspectorControls group="styles">
				<PanelBody
					title={__("Dimension Settings", "ultimate-blocks")}
					initialOpen={false}
				>
					<SpacingControl
						showByDefault
						attrKey="padding"
						label={__("Padding", "ultimate-blocks")}
					/>
					<SpacingControl
						minimumCustomValue={-Infinity}
						showByDefault
						attrKey="margin"
						label={__("Margin", "ultimate-blocks")}
					/>
				</PanelBody>
			</InspectorControls>
			<div
				{...useBlockProps({
					className: "ub-content-filter-panel",
					style: styles,
				})}
			>
				<InnerBlocks templateLock={false} />
				<div className="ub-content-assigned-filter-tag-area">
					{tagList
						.filter((tag) => tag != null && tag.hasOwnProperty("name"))
						.map((tag) => (
							<div className="ub-content-assigned-filter-tag">
								<div className="ub-content-filter-tag-deselect">
									<span
										title={__("Deselect This Filter")}
										onClick={() => {
											const { categoryIndex: i, tagIndex: j } = tag;
											let newSelectedFilters = [
												...selectedFilters.slice(0, i),
												Array.isArray(selectedFilters[i])
													? [
															...selectedFilters[i].slice(0, j),
															false,
															...selectedFilters[i].slice(j + 1),
														]
													: -1,
												...selectedFilters.slice(i + 1),
											];

											setAttributes({
												selectedFilters: newSelectedFilters,
											});
										}}
										class="dashicons dashicons-dismiss"
									/>
								</div>
								{tag.name}
							</div>
						))}
					<NewDropdown attributes={attributes} setAttributes={setAttributes} />
				</div>
			</div>
		</>
	);
}

registerBlockType("ub/content-filter-entry", {
	title: __("Content Filter Entry"),
	parent: __("ub/content-filter"),
	icon: icon,
	category: "ultimateblocks",
	attributes: {
		availableFilters: {
			type: "array",
			default: [], //get list of filters from parent block
		},
		selectedFilters: {
			type: "array",
			default: [],
		},
		buttonColor: {
			type: "string",
			default: "#aaaaaa",
		},
		buttonTextColor: {
			type: "string",
			default: "#000000",
		},
	},
	supports: {
		inserter: false,
		reusable: false,
	},
	edit: OldContentFilterEntry,

	save(props) {
		const { availableFilters, selectedFilters, buttonColor, buttonTextColor } =
			props.attributes;

		let tagList = [];

		selectedFilters.forEach((selection, i) => {
			if (Array.isArray(selection)) {
				selection
					.map((a, i) => ({ val: a, index: i }))
					.filter((a) => a.val === true)
					.forEach((a) =>
						tagList.push({
							name: availableFilters[i].filters[a.index],
							categoryIndex: i,
							tagIndex: a.index,
						}),
					);
			} else if (selection > -1) {
				tagList.push({
					name: availableFilters[i].filters[selection],
					categoryIndex: i,
					tagIndex: selection,
				});
			}
		});

		return (
			<div
				className="ub-content-filter-panel"
				data-selectedFilters={JSON.stringify(selectedFilters)}
				style={{ display: "block" }} //to be turned into none when frontend script doesn't see any of the main block's selected filters on the child block's tags
			>
				{/*<p>
					Categories:{' '}
					{tagList.map((filter, i) => (
						<span>{`${filter.name}${
							tagList.length - 1 > i ? ', ' : ''
						}`}</span>
					))}
				</p>*/}
				<InnerBlocks.Content />
			</div>
		);
	},
});

registerBlockType(metadata.name, {
	...metadata,
	attributes: metadata.attributes,
	icon: icon,
	edit: ContentFilterEntry,
	save: () => <InnerBlocks.Content />,
});
