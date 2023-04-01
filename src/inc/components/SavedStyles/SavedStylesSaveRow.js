import React, { useState } from 'react';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import UbProInspectorTextInput from '@Components/Common/UbProInspectorTextInput';
import withBusyStatus from '@Stores/savedStyles/hoc/withBusyStatus';

/**
 * Button row container for saved style listing operations.
 *
 * @param {Object}   props                    component properties
 * @param {boolean}  [props.busyStatus=false] disabled status
 * @param {Function} props.saveFunction       save function
 * @return {JSX.Element} saved styles button row component
 * @class
 */
function SavedStylesSaveRow( { busyStatus: disabled = false, saveFunction } ) {
	const [ newStyleName, setNewStyleName ] = useState( '' );

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
	const saveCurrentStyle = ( isStatic = false ) => {
		setNewStyleName( '' );
		saveFunction( newStyleName, isStatic );
	};

	return (
		<div className={ 'ub-pro-saved-styles-save-current-button-row' }>
			<div className={ 'save-row' }>
				<UbProInspectorTextInput
					disabled={ disabled }
					placeholder={ __(
						'save current style',
						'ultimate-blocks-pro'
					) }
					value={ newStyleName }
					onInput={ ( val ) => setNewStyleName( val ) }
				/>
				<Button
					disabled={ buttonDisabledStatus() }
					isSmall={ true }
					isPrimary={ true }
					onClick={ () => saveCurrentStyle( false ) }
				>
					{ __( 'Save', 'ultimate-blocks-pro' ) }
				</Button>
				{ UB_PRO_ENV !== 'production' && (
					<Button
						disabled={ buttonDisabledStatus() }
						isSmall={ true }
						isPrimary={ true }
						onClick={ () => saveCurrentStyle( true ) }
						className={ 'save-to-file' }
					>
						{ __( 'Save to File', 'ultimate-blocks-pro' ) }
					</Button>
				) }
			</div>
		</div>
	);
}

/**
 * @module SavedStylesSaveRow
 */
export default withBusyStatus( SavedStylesSaveRow );
