import React from 'react';

/**
 * Component for pill style cards in saved style listing.
 *
 * @param {Object}   props                  component properties
 * @param {Function} props.pillClick        callback for click event
 * @param {boolean}  [props.disabled=false] disabled status
 * @param {boolean}  props.isSelected       whether current item is selected
 * @param {boolean}  props.isActive         is item active
 * @param {boolean}  props.isDefault        is item default
 * @param {Object}   props.title            title for pill, should be an object with `__html` key as the content of the title
 * @class
 */
function ListItemPill({
	pillClick,
	disabled = false,
	isSelected,
	isActive,
	isDefault,
	title,
}) {
	return (
		<div
			onClick={pillClick}
			data-disabled={disabled}
			data-selected={isSelected}
			data-active={isActive}
			data-default={isDefault}
			className={'pill-list-item'}
			role={'button'}
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key.toLowerCase() === 'enter') {
					pillClick(e);
				}
			}}
		>
			<div dangerouslySetInnerHTML={title} />
		</div>
	);
}

/**
 * @module ListItemPill
 */
export default ListItemPill;
