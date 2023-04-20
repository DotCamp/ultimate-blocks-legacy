import React from 'react';

/**
 * Text input for inspector panel.
 *
 * @param {Object}   props                  component properties
 * @param {boolean}  [props.disabled=false] disabled status of component
 * @param {string}   [props.placeholder=''] placeholder text
 * @param {string}   props.value            input value
 * @param {Function} props.onInput          input callback
 * @return {JSX.Element} inspector panel text input component
 * @class
 */
function UbProInspectorTextInput({
	disabled = false,
	placeholder = '',
	value,
	onInput,
}) {
	/* eslint-disable no-shadow */
	return (
		<input
			disabled={disabled}
			placeholder={placeholder}
			className={'ub-pro-inspector-text-input'}
			type={'text'}
			value={value}
			onInput={({ target: { value } }) => onInput(value)}
		/>
	);
	/* eslint-enable no-shadow */
}

/**
 * @module UbProInspectorTextInput
 */
export default UbProInspectorTextInput;
