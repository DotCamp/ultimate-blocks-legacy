import React from 'react';
import UpsellControlWrapper from '$Inc/components/Upsell/Controls/UpsellControlWrapper';

/**
 * HOC for adding wrapper and default props to target component.
 *
 * @param {JSX.Element | Function} Component target component to be wrapped
 * @return {(function(*))|*} wrapped component
 */
const withUpsellControlWrapper =
	(Component) =>
	({
		label,
		featureId,
		help = '',
		options = [],
		colorSettings = [],
		title = '',
		selectedIcon = '',
		buttonLabels = [],
	}) => {
		const defaultProps = {
			onChange: () => {},
		};

		const finalProps = {
			...defaultProps,
			label,
			title,
			help,
			options,
			colorSettings,
			selectedIcon,
			buttonLabels,
		};

		return (
			<UpsellControlWrapper featureId={featureId}>
				<Component {...finalProps} />
			</UpsellControlWrapper>
		);
	};

/**
 * @module withUpsellControlWrapper
 */
export default withUpsellControlWrapper;
