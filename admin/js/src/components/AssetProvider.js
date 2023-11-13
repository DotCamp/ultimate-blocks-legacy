import { getAsset } from '$Stores/settings-menu/slices/assets';
import withStore from '$HOC/withStore';

/**
 * Store asset provider.
 *
 * Component child should be a function that will be called with the asset object.
 *
 * @param {Object}   props               component properties
 * @param {Function} props.children      children function, this function will be called with the asset object
 * @param {Function} props.getStoreAsset store asset selector, will be supplied via HC
 * @param {Array}    props.assetIds      array of asset ids to be fetched from data store
 * @class
 */
function AssetProvider({ children, getStoreAsset, assetIds = [] }) {
	const assetObj = assetIds.reduce((acc, assetId) => {
		acc[assetId] = getStoreAsset(assetId);
		return acc;
	}, {});

	return children(assetObj);
}

// store select mapping.
const selectMapping = (select) => ({
	getStoreAsset: (assetId) => select((state) => getAsset(state, assetId)),
});

/**
 * @module AssetProvider
 */
export default withStore(AssetProvider, selectMapping);
