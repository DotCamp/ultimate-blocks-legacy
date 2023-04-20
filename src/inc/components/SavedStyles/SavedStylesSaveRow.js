import React, { useState } from 'react';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import UbProInspectorTextInput from '$Inc/components/SavedStyles/UbProInspectorTextInput';
import withBusyStatus from '$BlockStores/savedStyles/hoc/withBusyStatus';
import connectWithMainStore from '$BlockStores/mainStore/hoc/connectWithMainStore';
import SavedStylesAdvancedButton from '$Inc/components/SavedStyles/SavedStylesAdvancedButton';

/**
 * Button row container for saved style listing operations.
 *
 * @param {Object}   props                    component properties
 * @param {boolean}  [props.busyStatus=false] disabled status
 * @param {Function} props.saveFunction       save function
 * @param {boolean}  props.prodStatus         plugin production status, will be supplied via HOC
 * @return {JSX.Element} saved styles button row component
 * @class
 */
function SavedStylesSaveRow({
	busyStatus: disabled = false,
	saveFunction,
	prodStatus,
}) {
	const [newStyleName, setNewStyleName] = useState('');

	/**
	 * Calculate disabled status of save button.
	 *
	 * @return {boolean} disabled status
	 */
	const buttonDisabledStatus = () => {
		return disabled || newStyleName === '';
	};

	/**
	 * Save style of currently selected component.
	 *
	 * @param {boolean} isStatic is style static
	 */
	const saveCurrentStyle = (isStatic = false) => {
		setNewStyleName('');
		saveFunction(newStyleName, isStatic);
	};

	return (
		<div className={'ub-pro-saved-styles-save-current-button-row'}>
			<div className={'save-row'}>
				<UbProInspectorTextInput
					disabled={prodStatus}
					placeholder={__('save current style', 'ultimate-blocks')}
					value={newStyleName}
					onInput={(val) => setNewStyleName(val)}
				/>
				<SavedStylesAdvancedButton
					disabled={true}
					isSmall={true}
					isPrimary={true}
				>
					{__('Save', 'ultimate-blocks')}
				</SavedStylesAdvancedButton>
				{!prodStatus && (
					<Button
						disabled={buttonDisabledStatus()}
						isSmall={true}
						isPrimary={true}
						onClick={() => saveCurrentStyle(true)}
						className={'save-to-file'}
					>
						{__('Save to File', 'ultimate-blocks')}
					</Button>
				)}
			</div>
		</div>
	);
}

// selector mapping for main store
const mainStoreSelectorMapping = (namespacedSelect) => {
	const { inProduction } = namespacedSelect;

	return {
		prodStatus: inProduction(),
	};
};

/**
 * @module SavedStylesSaveRow
 */
export default connectWithMainStore(
	mainStoreSelectorMapping,
	null
)(withBusyStatus(SavedStylesSaveRow));
