import React from 'react';
import { __ } from '@wordpress/i18n';
import { CSSTransition } from 'react-transition-group';
import SavedStyleListItem from '$Inc/components/SavedStyles/SavedStyleListItem';
import { Overlay } from '$Library/ub-common/Components';
import withBusyStatus from '$BlockStores/savedStyles/hoc/withBusyStatus';

/**
 * Card container component for saved style items.
 *
 * @param {Object}             props                    component properties
 * @param {Object}             props.styles             style object
 * @param {string}             [props.filterClause='']  filter clause
 * @param {boolean}            [props.busyStatus=false] disabled status, will be supplied via HOC
 * @param {Function}           props.onItemSelect       callback for item selection
 * @param {null | string}      props.selectedItemId     currently selected item id
 * @param {null | string}      props.activeItemId       active item id
 * @param {undefined | string} props.defaultStyleId     default style id for current block
 * @return {JSX.Element} saved style item card container component
 * @class
 */
function SavedStyleItemCardContainer({
	styles,
	filterClause = '',
	busyStatus: disabled = false,
	onItemSelect,
	selectedItemId,
	activeItemId,
	defaultStyleId,
}) {
	/**
	 * Amount of available styles.
	 *
	 * @return {number} available style count
	 */
	function stylesLength() {
		return Object.keys(styles).map((style) => {
			return Object.prototype.hasOwnProperty.call(styles, style);
		}).length;
	}

	/**
	 * Render style list items.
	 *
	 * @return {Array} style list items
	 */
	function renderListItems() {
		// eslint-disable-next-line array-callback-return
		return Object.keys(styles).map((id) => {
			if (Object.prototype.hasOwnProperty.call(styles, id)) {
				return (
					<CSSTransition
						key={id}
						classNames="ub-pro-basic-transition"
						timeout={200}
					>
						<SavedStyleListItem
							id={id}
							title={styles[id].title}
							filterClause={filterClause}
							disabled={disabled}
							itemClicked={onItemSelect}
							isSelected={selectedItemId === id}
							isActive={activeItemId === id}
							isDefault={defaultStyleId === id}
						/>
					</CSSTransition>
				);
			}
		});
	}

	/**
	 * Render empty if no items found.
	 *
	 * @return {JSX.Element} empty component
	 */
	function renderEmpty() {
		return (
			<CSSTransition
				key={'ub_list_item_null'}
				classNames="ub-pro-basic-transition"
				timeout={200}
			>
				<Overlay>
					<div className={'ub-pro-inactive-text'}>
						{__('no saved style found', 'ultimate-blocks')}
					</div>
				</Overlay>
			</CSSTransition>
		);
	}

	return (
		<div className={'ub-pro-saved-styles-inspector-listing-wrapper'}>
			<div
				className={'listing'}
				data-disabled={disabled}
				data-show-previews={false}
			>
				{stylesLength() > 0 ? renderListItems() : renderEmpty()}
			</div>
		</div>
	);
}

/**
 * @module SavedStyleItemCardContainer
 */
export default withBusyStatus(SavedStyleItemCardContainer);
