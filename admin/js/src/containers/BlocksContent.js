import React, { useRef } from 'react';
import { __ } from '@wordpress/i18n';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import {
	getBlocks,
	setBlockActiveStatus,
} from '$Stores/settings-menu/slices/blocks';
import {
	BoxContentAlign,
	BoxContentLayout,
	BoxContentSize,
} from '$Components/BoxContent/BoxContent';
import ButtonLink, { ButtonLinkType } from '$Components/ButtonLink';
import UpgradeBoxContent from '$Components/UpgradeBoxContent';
import BlockControlsContainer from '$Components/BlockControlsContainer';
import withStore from '$HOC/withStore';
import { toggleBlockStatus } from '$Stores/settings-menu/actions';

/**
 * Blocks content.
 *
 * @param {Object}   props                component properties
 * @param {Array}    props.pluginBlocks   plugin blocks, will be supplied via HOC
 * @param {Function} props.setBlockStatus set block status, will be supplied via HOC
 * @param {Function} props.dispatch       store action dispatch function, will be supplied via HOC
 * @class
 */
function BlocksContent({ pluginBlocks, setBlockStatus, dispatch }) {
	const pluginBlockNames = useRef(pluginBlocks.map(({ name }) => name));

	/**
	 * Toggle status of all available blocks.
	 *
	 * @param {boolean} status status to set
	 */
	const toggleAllBlockStatus = (status) => {
		dispatch(toggleBlockStatus)(pluginBlockNames.current, status);
		pluginBlockNames.current.map((bName) =>
			setBlockStatus({ id: bName, status })
		);
	};

	return (
		<div className="ub-blocks-content">
			<BoxContentProvider
				layout={BoxContentLayout.HORIZONTAL}
				contentId={'globalControl'}
				size={BoxContentSize.JUMBO}
			>
				<ButtonLink
					onClickHandler={() => {
						toggleAllBlockStatus(true);
					}}
					type={ButtonLinkType.DEFAULT}
					title={__('Activate All')}
				/>
				<ButtonLink
					onClickHandler={() => {
						toggleAllBlockStatus(false);
					}}
					type={ButtonLinkType.DEFAULT}
					title={__('Deactivate All')}
				/>
			</BoxContentProvider>
			<BlockControlsContainer />
			<UpgradeBoxContent alignment={BoxContentAlign.CENTER} />
		</div>
	);
}

// store select mapping
const selectMapping = (select) => ({
	pluginBlocks: select(getBlocks),
});

// store action mapping
const actionMapping = () => ({
	setBlockStatus: setBlockActiveStatus,
});

/**
 * @module BlocksContent
 */
export default withStore(BlocksContent, selectMapping, actionMapping);
