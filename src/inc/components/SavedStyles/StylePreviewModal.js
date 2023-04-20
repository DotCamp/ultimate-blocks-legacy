import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from '@wordpress/components';
import { PortalBase } from '$Library/ub-common/Components';
import { connectWithStore } from '$Library/ub-common/Inc';
import SavedStylesManager from '$Manager/SavedStylesManager';
import { decidePreviewBackground } from '$BlockStores/savedStyles/actions';

/**
 * Style preview modal component.
 *
 * @param {Object}   props                     component properties
 * @param {string}   props.htmlContent         preview html content
 * @param {string}   props.targetQuery         query for portal parent
 * @param {string}   props.styleTitle          style title
 * @param {Function} props.pageBackgroundColor editor page background color function, will be supplied via HOC
 * @class
 */
function StylePreviewModal({
	styleTitle,
	htmlContent,
	targetQuery,
	pageBackgroundColor,
}) {
	const [modalPosition, setModalPosition] = useState({});

	const blockPreviewContent = useRef(null);
	const pageSimulation = useRef(null);

	const defaultTopMargin = 16;

	/**
	 * useEffect hook
	 */
	useEffect(() => {
		setModalPosition(calculatePosition());
	}, []);

	/**
	 * useEffect hook
	 */
	useEffect(() => {
		const { current: pageSimulationElement } = pageSimulation;
		const { current: blockPreviewContentElement } = blockPreviewContent;

		if (pageSimulationElement && blockPreviewContentElement) {
			const overflowObject = isOverflowed(
				pageSimulationElement,
				blockPreviewContentElement
			);

			if (overflowObject.X || overflowObject.Y) {
				const { container, preview } = overflowObject.sizes;

				/**
				 * Normalize negative numbers to zero.
				 *
				 * @param {number} val value
				 * @return {number} value
				 */
				function negativeToZero(val) {
					return val < 0 ? 0 : val;
				}

				const sideWidth = negativeToZero(
					(preview.width - container.width) / 2
				);

				const sideHeight = negativeToZero(
					(preview.height - container.height) / 2
				);

				pageSimulationElement.style.height = 'fit-content';
				pageSimulationElement.style.width = 'fit-content';

				moveElement(pageSimulationElement, {
					X: sideWidth,
					Y: sideHeight,
				});

				// move element to start position
				pageSimulationElement.style.transition = `transform 1s ease-out`;
				pageSimulationElement.style.transformOrigin = `left top`;

				const animAxis = [];

				// prepare animation directions
				if (overflowObject.X) {
					animAxis.push(
						{ X: -sideWidth, Y: sideHeight },
						{ X: sideWidth, Y: sideHeight }
					);
				}

				if (overflowObject.Y) {
					animAxis.push(
						{ X: sideWidth, Y: -sideHeight },
						{ X: sideWidth, Y: sideHeight }
					);
				}

				let step = 0;
				pageSimulationElement.addEventListener(
					'transitionend',
					({ propertyName }) => {
						if (propertyName === 'transform') {
							setTimeout(() => {
								moveElement(
									pageSimulationElement,
									animAxis[step]
								);

								step = (step + 1) % animAxis.length;
							}, 500);
						}
					}
				);
			}
		}
	}, [htmlContent]);

	/**
	 * Check whether preview element overflowed within its container
	 *
	 * @param {Node} containerElement container element
	 * @param {Node} previewElement   preview element
	 * @return {Object} overflowed axes array
	 */
	function isOverflowed(containerElement, previewElement) {
		const { width: containerWidth, height: containerHeight } =
			containerElement.getBoundingClientRect();

		const { width: previewWidth, height: previewHeight } =
			previewElement.getBoundingClientRect();

		return {
			X: previewWidth > containerWidth,
			Y: previewHeight > containerHeight,
			sizes: {
				container: {
					width: containerWidth,
					height: containerHeight,
				},

				preview: {
					width: previewWidth,
					height: previewHeight,
				},
			},
		};
	}

	/**
	 * Move preview element by given amounts.
	 *
	 * @param {Node}   targetElement target element
	 * @param {Object} amountObject  amount object
	 */
	function moveElement(targetElement, amountObject) {
		targetElement.style.transform = `translate(${amountObject.X || 0}px, ${
			amountObject.Y || 0
		}px)`;
	}

	/**
	 * Calculate preview modal position.
	 *
	 * @return {Object} position data
	 */
	function calculatePosition() {
		const position = {};
		const targetContainer = document.querySelector(targetQuery);

		if (targetContainer) {
			const scrolledTop = targetContainer.scrollTop;
			position.top = `${scrolledTop + defaultTopMargin}px`;
		}

		return position;
	}

	return (
		<PortalBase targetQuery={targetQuery}>
			<div style={modalPosition} className={'ub-pro-style-preview-modal'}>
				<div className={'preview-container'}>
					<div
						ref={pageSimulation}
						className={'page-simulation'}
						style={{ backgroundColor: pageBackgroundColor() }}
					>
						{htmlContent ? (
							<div
								ref={blockPreviewContent}
								className={'block-preview-content'}
								dangerouslySetInnerHTML={{
									__html: htmlContent,
								}}
							></div>
						) : (
							<Spinner />
						)}
					</div>
				</div>
				<div className={'title-container'}>{styleTitle}</div>
			</div>
		</PortalBase>
	);
}

// store action mapping
const actionMapping = (dispatch, select) => {
	return {
		pageBackgroundColor: decidePreviewBackground(dispatch, select),
	};
};

/**
 * @module StylePreviewModal
 */
export default connectWithStore(
	SavedStylesManager.storeNamespace,
	null,
	actionMapping
)(StylePreviewModal);
