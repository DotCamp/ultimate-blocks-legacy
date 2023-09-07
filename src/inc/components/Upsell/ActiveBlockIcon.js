import { createElement, useMemo } from 'react';

/**
 * Component for displaying active block's icon component.
 *
 * @param {Object}          props            component properties
 * @param {Object | string} props.iconObject icon object or a string representation of it
 * @function Object() { [native code] }
 */
function ActiveBlockIcon( { iconObject } ) {
	const iconElement = useMemo( () => {
		if ( iconObject ) {
			switch ( typeof iconObject ) {
				case 'object':
					const { type, props } = iconObject;
					return createElement( type, props );
				case 'string':
					return (
						<span
							className={ 'ub-active-block-icon-from-string' }
							dangerouslySetInnerHTML={ { __html: iconObject } }
						></span>
					);
				default:
					return '?';
			}
		}

		return '?';
	}, [ iconObject ] );

	return <div className={ 'ub-active-block-icon' }>{ iconElement }</div>;
}

/**
 * @module ActiveBlockIcon
 */
export default ActiveBlockIcon;
