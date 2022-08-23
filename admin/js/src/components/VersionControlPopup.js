// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { __ } from "@wordpress/i18n";
import MenuButton, { BUTTON_TYPES } from "$Components/MenuButton";

/**
 * Version control popup component.
 * @param {Object} props component properties
 * @param {String} props.from current version
 * @param {String} props.to version to rollback
 * @param {Function} props.onCloseHandler close popup callback
 * @param {Function} props.onOperationStart operation start callback
 * @param {Number} props.reloadDelay automatic page reload delay in milliseconds
 * @constructor
 */
function VersionControlPopup( { from, to, onCloseHandler, onOperationStart, reloadDelay = 5000 } ) {
	const OPERATION_STATUS_TYPES = {
		NOT_STARTED: 'notStarted',
		STARTED: 'started',
		FINISHED: 'finished',
	};

	const RESPONSE_TYPES = {
		OK: 'ok',
		ERROR: 'error',
	};

	/**
	 * Generate response object.
	 * @param {String} message message
	 * @param {String} [type='ok'] response type.
	 * @return {Object} response object
	 */
	const generateResponseObject = ( message, type = RESPONSE_TYPES.OK ) => {
		return {
			type,
			message,
		};
	};

	const [ operationStatus, setOperationStatus ] = useState( OPERATION_STATUS_TYPES.NOT_STARTED );
	const [ reloadCountdown, setReloadCountdown ] = useState( reloadDelay / 1000 );

	const [ responseObject, setResponseObject ] = useState( generateResponseObject( '' ) );

	const isDowngrade = from > to;

	const countdownToReload = useRef( reloadDelay );

	/**
	 * Start rollback operation.
	 */
	const startOperation = () => {
		setOperationStatus( OPERATION_STATUS_TYPES.STARTED );
		onOperationStart().then( ( { message } ) => {
			setResponseObject( generateResponseObject( message, RESPONSE_TYPES.OK ) );
		} ).catch( ( { message } )=> {
			setResponseObject( generateResponseObject( message, RESPONSE_TYPES.ERROR ) );
		} ).finally( () => {
			setOperationStatus( OPERATION_STATUS_TYPES.FINISHED );
			reloadPage();
		} );
	};

	/**
	 * Reload page after a designated amount of time.
	 */
	const reloadPage = () => {
		const reloadIntervalId = setInterval( () => {
			if ( countdownToReload.current <= 0 ) {
				window.location.reload();
				clearInterval( reloadIntervalId );
			} else {
				countdownToReload.current = countdownToReload.current - 1000;
				setReloadCountdown( countdownToReload.current / 1000 );
			}
		}, 1000 );
	};

	return <div className={ 'version-control-popup' }>
		<div className={ 'modal-container' }>
			<div className={ 'rollback-versions' }>
				<div className={ `version-id ${ isDowngrade ? 'ub-positive-color' : 'ub-negative-color' }` }>{ from }</div>
				<div className={ 'version-icon' } data-in-progress={ JSON.stringify( operationStatus === OPERATION_STATUS_TYPES.STARTED ) }>
					<div className={ 'version-icon-inner-wrapper' }>
						<FontAwesomeIcon icon="fa-solid fa-right-long" />
					</div>
				</div>
				<div className={ `version-id ${ isDowngrade ? 'ub-negative-color' : 'ub-positive-color' }` }>{ to }</div>
			</div>
			{
				operationStatus !== OPERATION_STATUS_TYPES.STARTED && (
					<div className={ 'version-content' }>
						{
							operationStatus === OPERATION_STATUS_TYPES.NOT_STARTED && (
								<div className={ 'version-warning' }>
									<div>
										{
											__( 'Older versions might be unstable. Do it on your own risk and create a backup.', 'ultimate-blocks' )
										}
									</div>
									<div className={ 'version-rollback-button-container' }>
										<MenuButton type={ BUTTON_TYPES.POSITIVE } onClickHandler={ startOperation } status={ true }
											title={ 'Start' } />
										<MenuButton onClickHandler={ onCloseHandler } status={ true } title={ 'Close' } />
									</div>
								</div>
							)
						}
						{
							operationStatus === OPERATION_STATUS_TYPES.FINISHED && (
								<div className={ 'operation-finished-wrapper' }>
									<div className={ 'version-control-response' } data-resp-type={ responseObject.type }>{
										responseObject.message
									}</div>
									<div>{
										reloadCountdown <= 0 ? (
											`${ __( 'Reloading page now...', 'ultimate-blocks' ) }`
										) : (
											`${ __( 'Reloading page in ', 'ultimate-blocks' ) } ${ reloadCountdown }...`
										)

									}
									</div>
								</div>
							)
						}
					</div>
				)
			}
		</div>
	</div>;
}

/**
 * @module VersionControlPopup
 */
export default VersionControlPopup;
