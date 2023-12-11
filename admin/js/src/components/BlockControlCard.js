import React, { useRef } from 'react';
import { __ } from '@wordpress/i18n';
import ToggleControl from '$Components/ToggleControl';
import withIcon from '$HOC/withIcon';
import ProBlockCardTitle from '$Components/ProBlockCardTitle';
import BlockCardProInfoControl from '$Components/BlockCardProInfoControl';

/**
 * Menu block control component.
 *
 * This control will be used for both enabling/disabling blocks and showing info about them.
 *
 * @class
 *
 * @param {Object}        props                component properties
 * @param {string}        props.title          block title
 * @param {string}        props.blockId        registry id of block
 * @param {boolean}       props.status         block status
 * @param {HTMLElement}   props.iconElement    icon element, will be supplied via HOC
 * @param {Function}      props.onStatusChange callback for status change event
 * @param {boolean}       props.proBlock       block belongs to pro version
 * @param {boolean}       props.proStatus      plugin pro status
 * @param {Function}      props.showUpsell     set target block type for modal interface
 * @param {string | null} [props.demoUrl=null] demo url for block
 */
function BlockControlCard({
	title,
	blockId,
	status,
	iconElement,
	onStatusChange,
	proBlock,
	proStatus,
	showUpsell,
	demoUrl = null,
}) {
	const initialAnimation = useRef(true);

	return (
		<div
			className={'block-control'}
			data-enabled={JSON.stringify(
				proBlock && !proStatus ? false : status
			)}
			data-initial-animation={JSON.stringify(initialAnimation.current)}
		>
			<div className={'block-title'}>
				<div
					className={'block-title-left-container'}
					data-demo={demoUrl !== null}
				>
					<div className={'title-icon'}>{iconElement}</div>
					<div className={'title-text'}>
						{title}
						<ProBlockCardTitle isPro={proBlock} />
					</div>
					{demoUrl && (
						<div className={'title-demo'}>
							<a
								href={demoUrl}
								target={'_blank'}
								rel="noreferrer"
								className={'strip-anchor-styles'}
							>
								{__('See Demo', 'ultimate-blocks')}
							</a>
						</div>
					)}
				</div>
				<div className={'block-title-right-container'}>
					{proBlock && !proStatus ? (
						<BlockCardProInfoControl
							handleClick={(e) => {
								e.preventDefault();
								showUpsell(blockId);
							}}
						/>
					) : (
						<ToggleControl
							onStatusChange={(newStatus) =>
								onStatusChange(blockId, newStatus)
							}
							status={status}
							disabled={proBlock && !proStatus}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

/**
 * @module BlockControl
 */
export default withIcon(BlockControlCard);
