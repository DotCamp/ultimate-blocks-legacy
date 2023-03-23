import React from 'react';
import UpsellInspectorPanelBody from '$Inc/components/Upsell/UpsellInspectorPanelBody';
import UpsellToggleControl from '$Inc/components/Upsell/Controls/UpsellToggleControl';
import UpsellSelectControl from '$Inc/components/Upsell/Controls/UpsellSelectControl';
import UpsellColorControl from '$Inc/components/Upsell/Controls/UpsellColorControl';

/**
 *	Dummy control types.
 *
 * @type {{PANEL: string, TOGGLE: string, SELECT: string}}
 */
const DUMMY_CONTROL_TYPES = {
	PANEL: 'panel',
	TOGGLE: 'toggle',
	SELECT: 'select',
	COLOR: 'color',
};

/**
 * Component for selecting dummy controls.
 *
 * @param {Object} props             component properties
 * @param {Object} props.controlData control data
 * @function Object() { [native code] }
 */
function UpsellControlSelector({ controlData }) {
	const renderDummyControl = () => {
		const { type, ...propsRest } = controlData;

		let TargetDummyControl;

		switch (type) {
			case DUMMY_CONTROL_TYPES.PANEL:
				TargetDummyControl = UpsellInspectorPanelBody;
				break;
			case DUMMY_CONTROL_TYPES.TOGGLE:
				TargetDummyControl = UpsellToggleControl;
				break;
			case DUMMY_CONTROL_TYPES.SELECT:
				TargetDummyControl = UpsellSelectControl;
				break;
			case DUMMY_CONTROL_TYPES.COLOR:
				TargetDummyControl = UpsellColorControl;
				break;
			default:
				TargetDummyControl = null;
				break;
		}

		return TargetDummyControl ? (
			<TargetDummyControl {...propsRest} />
		) : null;
	};

	return renderDummyControl();
}

/**
 * @module UpsellControlSelector
 */
export default UpsellControlSelector;
