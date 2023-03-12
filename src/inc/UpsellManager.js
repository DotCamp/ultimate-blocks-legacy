import { render } from 'react-dom';
import ManagerBase from '$Base/ManagerBase';
import UpsellMain from '$Inc/components/Upsell/UpsellMain';

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

			const container = document.querySelector('#ubUpsellContainer');
			render(<UpsellMain />, container);
		});
	}
}

/**
 * @module UpsellManager
 */
export default new UpsellManager();
