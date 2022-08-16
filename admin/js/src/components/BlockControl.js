// eslint-disable-next-line no-unused-vars
import React from 'react';
import ToggleControl from "$Components/ToggleControl";

/**
 * Menu block control component.
 *
 * This control will be used for both enabling/disabling blocks and showing info about them.
 * @constructor
 *
 * @param {Object} props component properties
 * @param {String} props.title block title
 * @param {String} props.blockId registry id of block
 * @param {Boolean} props.status block status
 */
function BlockControl( { title, blockId, status } ) {
	return (
		<div className={ 'block-control' }>
			<div className={ 'block-title' }>
				<div>
					{ title }
				</div>
				<div>
					<ToggleControl status={ status } />
				</div>
			</div>
			<div className={ 'block-info' }></div>
			<div className={ 'block-howto' }>
				how to
			</div>
		</div>
	);
}

/**
 * @module BlockControl
 */
export default BlockControl;
