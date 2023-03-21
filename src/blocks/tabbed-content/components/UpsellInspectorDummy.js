import React, { Fragment } from 'react';
import { __ } from '@wordpress/i18n';
import UpsellToggleControl from '$Inc/components/Upsell/Controls/UpsellToggleControl';
import UpsellInspectorPanelBody from '$Inc/components/Upsell/UpsellInspectorPanelBody';
import UpsellProPanel from '$Inc/components/Upsell/UpsellProPanel';

/**
 * Upsell dummy inspector controls for tabbed content block.
 *
 * @function Object() { [native code] }
 */
function UpsellInspectorDummy() {
	return (
		<Fragment>
			<UpsellProPanel>
				<UpsellInspectorPanelBody
					title={__('General', 'ultimate-blocks')}
				>
					<UpsellToggleControl
						label={__(
							'Tab title secondary text',
							'ultimate-blocks'
						)}
						featureId={'titleSecondaryText'}
					/>
					<UpsellToggleControl
						label={__('Tab title icons', 'ultimate-blocks')}
						featureId={'titleIcon'}
					/>
				</UpsellInspectorPanelBody>
				<UpsellInspectorPanelBody
					title={__('Call to Action', 'ultimate-blocks')}
				>
					<UpsellToggleControl
						label={__(
							'Convert current tab into call to action',
							'ultimate-blocks'
						)}
						help={__(
							'Call to action tab will direct your users to assigned url instead of showing a tab content.',
							'ultimate-blocks'
						)}
						featureId={'callToAction'}
					/>
				</UpsellInspectorPanelBody>
			</UpsellProPanel>
		</Fragment>
	);
}

/**
 * @module UpsellInspectorDummy
 */
export default UpsellInspectorDummy;
