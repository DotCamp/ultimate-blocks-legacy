/**
 * Manager base abstract class.
 *
 * Implement `initLogic` function to comply.
 */
class ManagerBase {
	/**
	 * Initialization status of manager.
	 *
	 * @private
	 * @type {boolean}
	 */
	#initialized = false;

	/**
	 * Get initialization status of manager.
	 *
	 * @return {boolean} initialization status
	 */
	isInitialized() {
		return this.#initialized;
	}

	/**
	 * Initialization logic.
	 *
	 * @abstract
	 */
	_initLogic() {
		throw new Error(
			'initLogic function is not implemented at extended class'
		);
	}

	/**
	 * Initialize manager instance.
	 */
	init() {
		if (!this.isInitialized()) {
			this._initLogic.call(this, ...arguments);
			this.#initialized = true;
		}
	}
}

/**
 * @module ManagerBase
 */
export default ManagerBase;
