import React from 'react';
import { __ } from '@wordpress/i18n';
import UpsellProPanel from '$Inc/components/Upsell/UpsellProPanel';
import UpsellInspectorPanelBody from '$Inc/components/Upsell/UpsellInspectorPanelBody';
import UpsellSelectControl from '$Inc/components/Upsell/Controls/UpsellSelectControl';

/**
 * Upsell dummy inspector controls for button block.
 *
 * @deprecated
 *
 * @function Object() { [native code] }
 */
function UpsellInspectorDummy() {
	return (
		<UpsellProPanel>
			<UpsellInspectorPanelBody title={__('Colors')}>
				<UpsellSelectControl
					label={__('Transition animation', 'ultimate-blocks')}
					options={[
						{ label: __('Fade', 'ultimate-blocks') },
						{ label: __('Wipe', 'ultimate-blocks') },
					]}
				/>
			</UpsellInspectorPanelBody>
		</UpsellProPanel>
	);
}

/**
 * @module UpsellInspectorDummy
 */
export default UpsellInspectorDummy;
