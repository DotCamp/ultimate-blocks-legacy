import { useDispatch, useSelector } from "react-redux";

/**
 * HOC for adding store related properties to components
 * @param {React.ElementType | Object} BaseComponent target component
 * @param {Function | null} [selectMapping=null] selection mapping, this mapping will be used to inject store selectors values into component properties
 * @param {Function | null} [actionMapping=null] action mapping, this mapping will be used to inject store action functions into component properties
 * @returns {Function} HOC function
 */
const withStore = ( BaseComponent, selectMapping = null, actionMapping ) => ( props ) =>{
	// prepare selection mappings
	let selections = {};
	if ( selectMapping && typeof selectMapping === 'function' ) {
		const selectorObject = selectMapping( useSelector );
		if ( typeof selectorObject === 'object' ) {
			selections = selectorObject;
		}
	}

	const dispatch = useDispatch();

	// prepare action mappings
	let actions = {};
	if ( actionMapping && typeof actionMapping === 'function' ) {
		const preActionObject = actionMapping( dispatch, useSelector );

		if ( preActionObject && typeof preActionObject === 'object' ) {
			actions = Object.keys( preActionObject ).filter( key => {
				return Object.prototype.hasOwnProperty.call( preActionObject, key );
			} ).reduce( ( carry, current ) => {
				const actionCallback = preActionObject[ current ];
				if ( typeof actionCallback === 'function' ) {
					carry[ current ] = function( val ) {
						dispatch( actionCallback( val ) );
					};
				}

				return carry;
			}, {} );
		}
	}

	return <BaseComponent { ...props } { ...selections } { ...actions } selector={ useSelector } dispatch={ dispatch } />;
};

/**
 * @module withStore
 */
export default withStore;
