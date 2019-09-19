import { ExpandRoot } from './components';

import icon from './icon';

const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;

const { RichText, InnerBlocks } = wp.editor;

const { withSelect, withDispatch } = wp.data;

const { compose } = wp.compose;

registerBlockType('ub/expand', {
	title: __('Expand'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Preview'), __('Hidden Content')],
	attributes: {
		blockID: {
			type: 'string',
			default: ''
		},
		initialShow: {
			type: 'boolean',
			default: false
		}
	},
	edit: compose([
		withSelect((select, ownProps) => {
			const {
				getBlock,
				getSelectedBlock,
				getSelectedBlockClientId
			} = select('core/editor');

			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				getSelectedBlock,
				getSelectedBlockClientId
			};
		}),
		withDispatch(dispatch => {
			const { updateBlockAttributes, insertBlock } = dispatch(
				'core/editor'
			);

			return {
				updateBlockAttributes,
				insertBlock
			};
		})
	])(ExpandRoot),

	save: _ => <InnerBlocks.Content />
});

registerBlockType('ub/expand-portion', {
	title: __('Expand Portion'),
	parent: 'ub/expand',
	icon: icon,
	category: 'ultimateblocks',
	supports: {
		inserter: false
	},
	attributes: {
		clickText: {
			type: 'string',
			default: ''
		},
		displayType: {
			type: 'string',
			default: ''
		},
		isVisible: {
			type: 'boolean',
			default: true
		}
	},
	edit(props) {
		const { attributes, setAttributes } = props;
		const { clickText, displayType, isVisible } = attributes;

		return (
			<div
				className={`ub-expand-portion ub-expand-${displayType}${
					displayType === 'full' && !isVisible ? ' ub-hide' : ''
				}`}
			>
				<InnerBlocks templateLock={false} />
				<RichText
					value={clickText}
					onChange={value => setAttributes({ clickText: value })}
					placeholder={__(
						`Text for show ${
							displayType === 'full' ? 'less' : 'more'
						} button`
					)}
				/>
			</div>
		);
	},
	save: _ => <InnerBlocks.Content />
});
