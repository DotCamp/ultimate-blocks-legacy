import React from 'react';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, FontSizePicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { IconControl } from '$Library/ub-common/Components';

/**
 * Ub icon inspector component.
 *
 * @param {Object}   props               component properties
 * @param {string}   props.iconName      icon name
 * @param {Function} props.setAttributes block attribute update function
 * @param {number}   props.size          icon size
 */
function UbIconInspector({ iconName, size, setAttributes }) {
	const iconSizes = [
		{
			name: __('Small', 'ultimate-blocks-pro'),
			slug: 'small',
			size: 30,
		},
		{
			name: __('Medium', 'ultimate-blocks-pro'),
			slug: 'medium',
			size: 50,
		},
		{
			name: __('Large', 'ultimate-blocks-pro'),
			slug: 'large',
			size: 70,
		},
	];
	return (
		<InspectorControls>
			<PanelBody title={__('Icon Options', 'ultimate-blocks')}>
				<IconControl
					selectedIcon={iconName}
					label={__('Icon', 'ultimate-blocks')}
					onIconSelect={(val) => {
						setAttributes({
							iconName: val,
						});
					}}
				/>
				<FontSizePicker
					fontSizes={iconSizes}
					value={size}
					fallbackFontSize={30}
					onChange={(val) => setAttributes({ size: val })}
				/>
			</PanelBody>
		</InspectorControls>
	);
}

/**
 * @module UbIconEditor
 */
export default UbIconInspector;
