import React from 'react';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { IconControl } from '../../../../library/ub-common/Components/index';

/**
 * Ub icon inspector component.
 *
 * @param {Object}   props               component properties
 * @param {Function} props.setAttributes block attribute update function
 */
function UbIconInspector({ setAttributes }) {
	return (
		<InspectorControls>
			<PanelBody title={__('Icon Options', 'ultimate-blocks')}>
				<IconControl label={__('Icon', 'ultimate-blocks')} />
			</PanelBody>
		</InspectorControls>
	);
}

/**
 * @module UbIconEditor
 */
export default UbIconInspector;
