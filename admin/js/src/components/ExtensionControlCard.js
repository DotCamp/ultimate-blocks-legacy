import React, { useRef } from 'react';
import { __ } from '@wordpress/i18n';
import ToggleControl from '$Components/ToggleControl';
import ProExtensionCardTitle from '$Components/ProExtensionCardTitle';
import ExtensionCardProInfoControl from '$Components/ExtensionCardProInfoControl';

/**
 * Menu extension control component.
 *
 * This control will be used for both enabling/disabling extensions and showing info about them.
 *
 * @class
 *
 * @param {Object}        props                component properties
 * @param {string}        props.title          extension title
 * @param {string}        props.extensionId    registry id of extension
 * @param {boolean}       props.status         extension status
 * @param {HTMLElement}   props.iconElement    icon element, will be supplied via HOC
 * @param {Function}      props.onStatusChange callback for status change event
 * @param {boolean}       props.proExtension   extension belongs to pro version
 * @param {boolean}       props.proStatus      plugin pro status
 * @param {Function}      props.showUpsell     set target extension type for modal interface
 * @param {string | null} [props.demoUrl=null] demo url for extension
 */
function ExtensionControlCard({
	title,
	extensionId,
	status,
	iconElement,
	onStatusChange,
	proExtension,
	proStatus,
	showUpsell,
	demoUrl = null,
}) {
	const initialAnimation = useRef(true);

	return (
		<div
			className={'extension-control'}
			data-enabled={JSON.stringify(
				proExtension && !proStatus ? false : status
			)}
			data-initial-animation={JSON.stringify(initialAnimation.current)}
		>
			<div className={'extension-title'}>
				<div
					className={'extension-title-left-container'}
					data-demo={demoUrl !== null}
				>
					<div
						className={'title-icon'}
						dangerouslySetInnerHTML={{ __html: iconElement }}
					></div>
					<div className={'title-text'}>
						{title}
						<ProExtensionCardTitle isPro={proExtension} />
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
				<div className={'extension-title-right-container'}>
					{proExtension && !proStatus ? (
						<ExtensionCardProInfoControl
							handleClick={(e) => {
								e.preventDefault();
								showUpsell(extensionId);
							}}
						/>
					) : (
						<ToggleControl
							onStatusChange={(newStatus) =>
								onStatusChange(extensionId, newStatus)
							}
							status={status}
							disabled={proExtension && !proStatus}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

/**
 * @module ExtensionControl
 */
export default ExtensionControlCard;
