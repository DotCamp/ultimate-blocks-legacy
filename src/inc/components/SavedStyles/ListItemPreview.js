import React, { useRef, useEffect, forwardRef } from 'react';
import { Spinner } from '@wordpress/components';
import DefaultItemIndicator from '@Components/SavedStyles/DefaultItemIndicator';

/**
 * List item with preview capabilities.
 *
 * @param {Object}   props              component properties
 * @param {string}   props.previewHtml  html preview of list item
 * @param {boolean}  props.isActive     active status of saved style linked to item preview component
 * @param {boolean}  props.isSelected   selection status of component
 * @param {boolean}  props.isDefault    default status of component
 * @param {Function} props.previewClick callback function for preview click event
 * @param {Object}   props.forwardedRef forwarded reference object
 * @class
 */
function ListItemPreview({
	previewHtml,
	isActive,
	isSelected,
	isDefault,
	previewClick,
	forwardedRef,
}) {
	const previewContent = useRef(null);

	/**
	 * `useEffect` React hook.
	 */
	useEffect(() => {
		const { current: previewContentWrapper } = previewContent;
		if (previewContentWrapper) {
			previewContentWrapper.style.transform = '';
			const scaleMargin = 10;
			const parentContainer = previewContentWrapper.parentNode;

			const { width: parentWidth, height: parentHeight } =
				parentContainer.getBoundingClientRect();

			const { width: targetWidth, height: targetHeight } =
				previewContentWrapper.getBoundingClientRect();

			if (targetWidth > 0 && parentWidth > 0) {
				const finalParentWidth = parentWidth - scaleMargin;
				const finalParentHeight = parentHeight - scaleMargin;

				/**
				 * Decide whether to scale or not
				 *
				 * @param {number} target target component size value
				 * @param {number} parent parent component size value
				 * @return {boolean} logic result
				 */
				function scaleDecideLogic(target, parent) {
					return target > parent;
				}

				/**
				 * Calculate scale amount.
				 *
				 * @param {number} target target component size value
				 * @param {number} parent parent component size value
				 *
				 * @return {number} scale amount
				 */
				function calculateScaleAmount(target, parent) {
					return scaleDecideLogic(target, parent)
						? parent / target
						: 1;
				}

				const scaleAmountBasedWidth = calculateScaleAmount(
					targetWidth,
					finalParentWidth
				);
				const scaleAmountBasedHeight = calculateScaleAmount(
					targetHeight,
					finalParentHeight
				);

				const scaleAmount =
					scaleAmountBasedWidth < scaleAmountBasedHeight
						? scaleAmountBasedWidth
						: scaleAmountBasedHeight;

				previewContentWrapper.style.transform = `scale(${scaleAmount.toFixed(
					2
				)})`;
			}
		}
	}, [previewHtml]);

	/**
	 * Preview click handler.
	 *
	 * @param {Event} event event object
	 */
	function previewClickHandler(event) {
		event.stopPropagation();
		previewClick(event);
	}

	return (
		<div
			ref={forwardedRef}
			className={'list-item-preview-container'}
			data-active={isActive}
			data-selected={isSelected}
			data-default={isDefault}
			onClick={previewClickHandler}
			role={'button'}
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key.toLowerCase() === 'enter') {
					previewClickHandler(e);
				}
			}}
		>
			<div className={'click-overlay'}>
				<DefaultItemIndicator />
			</div>
			{previewHtml ? (
				<div
					className={'preview-content'}
					dangerouslySetInnerHTML={{ __html: previewHtml }}
					ref={previewContent}
				/>
			) : (
				<div className={'preview-content'}>
					<Spinner />
				</div>
			)}
		</div>
	);
}

/**
 * @module ListItemPreview
 */
export default forwardRef((props, ref) => (
	<ListItemPreview {...props} forwardedRef={ref} />
));
