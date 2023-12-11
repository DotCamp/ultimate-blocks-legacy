// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import BlockControlCard from '$Components/BlockControlCard';
import withStore from '$HOC/withStore';
import {
	getBlocks,
	setBlockActiveStatus,
} from '$Stores/settings-menu/slices/blocks';
import {
	getBlockInfoShowStatus,
	getProStatus,
	showProBlockUpsellModal,
} from '$Stores/settings-menu/slices/app';
import { toggleBlockStatus } from '$Stores/settings-menu/actions';
import { getAsset } from '$Stores/settings-menu/slices/assets';

/**
 * Block controls container.
 *
 * @class
 *
 * @param {Object}   props                component properties
 * @param {Object}   props.blocks         menu data, will be supplied via HOC
 * @param {Function} props.dispatch       store action dispatch function, will be supplied via HOC
 * @param {Function} props.setBlockStatus set a block's active status, will be supplied via HOC
 * @param {boolean}  props.showInfoStatus status of showing extra information in block controls, will be supplied via HOC
 * @param {boolean}  props.proStatus      plugin pro status, will be supplied via HOC
 * @param {Function} props.showUpsell     set target block type for modal interface
 * @param {Object}   props.blockDemos     block demo urls, will be supplied via HOC
 */
function BlockControlsContainer({
	blocks,
	setBlockStatus,
	dispatch,
	showInfoStatus,
	proStatus,
	showUpsell,
	blockDemos,
}) {
	const [innerBlocks, setInnerBlocks] = useState(blocks);

	const getBlockDemo = (blockId) =>
		blockDemos[blockId] ? blockDemos[blockId] : null;

	/**
	 * Handle block status change.
	 *
	 * @param {boolean} proBlock is calling block belongs to pro version of the plugin
	 */
	const handleBlockStatusChange = (proBlock) => (blockId, status) => {
		if (proBlock && !proStatus) {
			setBlockStatus({ id: blockId, status: false });
			return;
		}

		setBlockStatus({ id: blockId, status });
		dispatch(toggleBlockStatus)(blockId, status);
	};

	// useEffect hook
	useEffect(() => {
		const sortedBlocks = [...blocks].sort((a, b) => {
			const aName = a.title.toLowerCase();
			const bName = b.title.toLowerCase();

			if (aName < bName) {
				return -1;
			}
			if (aName > bName) {
				return 1;
			}

			return 0;
		});

		setInnerBlocks(sortedBlocks);
	}, [blocks]);

	return (
		<div
			className={'controls-container'}
			data-show-info={JSON.stringify(showInfoStatus)}
		>
			{innerBlocks.map(({ title, name, icon, active, info, pro }) => {
				return (
					<BlockControlCard
						key={name}
						title={title}
						blockId={name}
						status={active}
						iconObject={icon}
						onStatusChange={handleBlockStatusChange(pro)}
						info={info}
						proBlock={pro}
						showUpsell={showUpsell}
						proStatus={proStatus}
						demoUrl={getBlockDemo(name)}
					/>
				);
			})}
		</div>
	);
}

const selectMapping = (selector) => ({
	blocks: selector(getBlocks),
	showInfoStatus: selector(getBlockInfoShowStatus),
	proStatus: selector(getProStatus),
	blockDemos: selector((state) => getAsset(state, 'blockDemos')),
});

const actionMapping = () => ({
	setBlockStatus: setBlockActiveStatus,
	showUpsell: showProBlockUpsellModal,
});

/**
 * @module BlockControlsContainer
 */
export default withStore(BlockControlsContainer, selectMapping, actionMapping);
