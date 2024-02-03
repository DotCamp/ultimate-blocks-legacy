import { createRoot } from 'react-dom';
import { ManagerBase } from '$Library/ub-common/Inc';
import UpsellMain from '$Inc/components/Upsell/UpsellMain';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from 'react';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import UpsellInspectorDummy from '$Inc/components/Upsell/UpsellInspectorDummy';

/**
 * Editor upsell manager.
 */
class UpsellManager extends ManagerBase {
	_initLogic() {
		document.addEventListener('DOMContentLoaded', () => {
			const range = document.createRange();
			range.setStart(document.body, 0);

			const containerStringified = '<div id="ubUpsellContainer"></div>';
			const containerFragment =
				range.createContextualFragment(containerStringified);

			document.body.appendChild(containerFragment);

			const container = createRoot(
				document.querySelector('#ubUpsellContainer')
			);
			container.render(<UpsellMain />);
		});
	}

	/**
	 * Add dummy inspector controls to sidebar.
	 */
	addDummyInspectorControls() {
		const withInspectorControls = createHigherOrderComponent(
			(BlockEdit) => (props) => {
				return (
					<Fragment>
						<BlockEdit {...props} />
						<InspectorControls>
							<UpsellInspectorDummy />
						</InspectorControls>
					</Fragment>
				);
			},
			'withTestControls'
		);

		const context = global || self;
		const proStatus = context.ubMainStore.select().getProStatus();

		if (!proStatus) {
			addFilter('editor.BlockEdit', 'ub/test', withInspectorControls);
		}
	}
}

/**
 * @module UpsellManager
 */
export default new UpsellManager();
