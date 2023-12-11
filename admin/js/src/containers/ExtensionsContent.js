import { __ } from '@wordpress/i18n';
import BoxContentProvider from '$Components/BoxContent/BoxContentProvider';
import {
	getExtensions,
	setExtensionActiveStatus,
} from '$Stores/settings-menu/slices/extension';
import {
	BoxContentAlign,
	BoxContentLayout,
	BoxContentSize,
} from '$Components/BoxContent/BoxContent';
import ButtonLink, { ButtonLinkType } from '$Components/ButtonLink';
import UpgradeBoxContent from '$Components/UpgradeBoxContent';
import ExtensionsControlContainer from '$Components/ExtensionsControlContainer';
import withStore from '$HOC/withStore';
import { toggleExtensionStatus } from '$Stores/settings-menu/actions';
import React, { useRef } from 'react';

/**
 * Extensions content component.
 *
 * @param {Object}   props                          Components Props.
 * @param {Array}    props.pluginExtensions         All extension.
 * @param {Function} props.setExtensionActiveStatus Set the extension status active or inactive.
 * @param {Function} props.dispatch                 Function to update store state.
 */
function ExtensionsContent(props) {
	const { pluginExtensions = [], setExtensionStatus, dispatch } = props;
	const pluginExtensionsNames = useRef(
		pluginExtensions.map(({ name }) => name)
	);

	/**
	 * Toggle status of all available extensions.
	 *
	 * @param {boolean} status status to set
	 */
	const toggleAllExtensionStatus = (status) => {
		dispatch(toggleExtensionStatus)(pluginExtensionsNames.current, status);
		pluginExtensionsNames.current.map((bName) =>
			setExtensionStatus({ id: bName, status })
		);
	};
	return (
		<div className="ub-extensions-content">
			<BoxContentProvider
				layout={BoxContentLayout.HORIZONTAL}
				contentId={'extensionGlobalControl'}
				size={BoxContentSize.JUMBO}
			>
				<ButtonLink
					onClickHandler={() => {
						toggleAllExtensionStatus(true);
					}}
					type={ButtonLinkType.DEFAULT}
					title={__('Activate All')}
				/>
				<ButtonLink
					onClickHandler={() => {
						toggleAllExtensionStatus(false);
					}}
					type={ButtonLinkType.DEFAULT}
					title={__('Deactivate All')}
				/>
			</BoxContentProvider>
			<ExtensionsControlContainer />
			<UpgradeBoxContent alignment={BoxContentAlign.CENTER} />
		</div>
	);
}

// store select mapping
const selectMapping = (select) => ({
	pluginExtensions: select(getExtensions),
});

// store action mapping
const actionMapping = () => ({
	setExtensionStatus: setExtensionActiveStatus,
});

/**
 * @module ExtensionsContent
 */
export default withStore(ExtensionsContent, selectMapping, actionMapping);
