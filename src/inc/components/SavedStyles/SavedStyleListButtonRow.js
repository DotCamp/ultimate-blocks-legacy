import React from 'react';
import { Button, ButtonGroup } from '@wordpress/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { __ } from '@wordpress/i18n';
import { connectWithStore } from '@Stores/StoreHelpers';
import SavedStylesManager from '@Managers/SavedStylesManager';

/**
 * Button row wrapper for saved style listing.
 *
 * @param {Object}   props                       component properties
 * @param {Function} props.setShowPreviewStatus  show saved styles' previews or hide them, will be supplied via HOC
 * @param {boolean}  props.isShowPreviewsEnabled status of show previews, will be supplied via HOC
 * @return {JSX.Element} saved styles list button row component
 * @class
 */
function SavedStyleListButtonRow( {
	setShowPreviewStatus,
	isShowPreviewsEnabled,
} ) {
	return (
		<div className={ 'ub-pro-saved-styles-listing-button-row' }>
			<ButtonGroup className={ 'listing-preview-button-group' }>
				<Button
					className={ 'ub-pro-saved-styles-listing-preview-button' }
					isSmall={ true }
					isPrimary={ isShowPreviewsEnabled }
					aria-pressed={ isShowPreviewsEnabled }
					onClick={ () => setShowPreviewStatus( true ) }
					title={ __( 'show previews', 'ultimate-blocks' ) }
				>
					<FontAwesomeIcon icon={ 'eye' } />
				</Button>
				<Button
					className={ 'ub-pro-saved-styles-listing-preview-button' }
					isSmall={ true }
					isPrimary={ ! isShowPreviewsEnabled }
					aria-pressed={ ! isShowPreviewsEnabled }
					onClick={ () => setShowPreviewStatus( false ) }
					title={ __( 'show listing', 'ultimate-blocks' ) }
				>
					<FontAwesomeIcon icon={ 'list-ul' } />
				</Button>
			</ButtonGroup>
		</div>
	);
}

/**
 * Select mapping for store.
 *
 * @param {Object} select store select object
 * @return {Object} select mapping object
 */
const selectMapping = ( select ) => {
	const { isShowPreviewsEnabled } = select;
	return {
		isShowPreviewsEnabled: isShowPreviewsEnabled(),
	};
};

/**
 * Action mapping for store.
 *
 * @param {Object} dispatch store dispatch object
 * @return {Object} action mapping object
 */
const actionMapping = ( dispatch ) => {
	const { setShowPreviewStatus } = dispatch;
	return {
		setShowPreviewStatus,
	};
};

/**
 * @module SavedStyleListButtonRow
 */
export default connectWithStore(
	SavedStylesManager.storeNamespace,
	selectMapping,
	actionMapping
)( SavedStyleListButtonRow );
