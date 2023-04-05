import React from 'react';
import { Panel, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import SavedStylesSaveRow from '$Inc/components/SavedStyles/SavedStylesSaveRow';
import { connectWithStore } from '$Library/ub-common/Inc';
import SavedStylesManager from '$Manager/SavedStylesManager';
import SelectedSavedStyleControls from '$Inc/components/SavedStyles/SelectedSavedStyleControls';

/**
 * Saved style advanced controls wrapper component.
 *
 * @param {Object}   props                 component properties
 * @param {Function} props.saveFunction    save function for creating new styles
 * @param {Object}   props.panelVisibility panel visibility, will be supplied via HOC
 * @param {Function} props.setVisibility   set panel visibility, will be supplied via HOC
 * @param {Function} props.updateFunction  update selected style item with current component styles
 * @param {Function} props.applyStyle      apply selected style to current block
 * @class
 */
function SavedStylesAdvancedControls({
	saveFunction,
	panelVisibility,
	setVisibility,
	updateFunction,
	applyStyle,
}) {
	return (
		<Panel className={'advanced-controls'}>
			<PanelBody
				title={__('Advanced', 'ultimate-blocks')}
				initialOpen={panelVisibility}
				onToggle={setVisibility}
				className={'advanced-controls-panel-body'}
			>
				<div className={'inner-wrapper'}>
					<SelectedSavedStyleControls
						updateStyleFunction={updateFunction}
						applyStyle={applyStyle}
					/>
					<SavedStylesSaveRow saveFunction={saveFunction} />
				</div>
			</PanelBody>
		</Panel>
	);
}

/**
 * Store selector mapping
 *
 * @param {Object} storeSelect store selector object
 * @return {Object} selector mapping
 */
const selectMapping = (storeSelect) => {
	const { isAdvancedControlsVisible } = storeSelect;
	return {
		panelVisibility: isAdvancedControlsVisible(),
	};
};

/**
 * Store selector mapping
 *
 * @param {Object} storeDispatch store action object
 * @return {Object} action mapping
 */
const actionMapping = (storeDispatch) => {
	const { setAdvancedControlsVisibility } = storeDispatch;
	return {
		setVisibility: setAdvancedControlsVisibility,
	};
};

/**
 * @module SavedStyleAdvancedControls
 */
export default connectWithStore(
	SavedStylesManager.storeNamespace,
	selectMapping,
	actionMapping
)(SavedStylesAdvancedControls);
