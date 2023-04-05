import React, { useState } from 'react';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import UbProInspectorTextInput from '$Inc/components/SavedStyles/UbProInspectorTextInput';
import withBusyStatus from '$BlockStores/savedStyles/hoc/withBusyStatus';
import SavedStylesAdvancedButton from '$Inc/components/SavedStyles/SavedStylesAdvancedButton';

/**
 * Button row container for saved style listing operations.
 *
 * @param {Object}   props                    component properties
 * @param {boolean}  [props.busyStatus=false] disabled status
 * @param {Function} props.saveFunction       save function
 * @return {JSX.Element} saved styles button row component
 * @class
 */
function SavedStylesSaveRow({ busyStatus: disabled = false, saveFunction }) {
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

	/**
	 * Check if we are in production environment.
	 *
	 * @type {boolean}
	 */
	const envProdCheck = UB_ENV === 'production';

	return (
		<div className={'ub-pro-saved-styles-save-current-button-row'}>
			<div className={'save-row'}>
				<UbProInspectorTextInput
					disabled={envProdCheck}
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
				{!envProdCheck && (
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

/**
 * @module SavedStylesSaveRow
 */
export default withBusyStatus(SavedStylesSaveRow);
