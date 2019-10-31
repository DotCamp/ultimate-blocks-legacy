import '../style.scss';
import '../editor.scss';
import icon from '../icons/icon';

import { panel_version_1_1_9 } from '../oldVersions';
import { Component } from 'react';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const { RichText, InnerBlocks } = wp.blockEditor || wp.editor;

const { withState, compose } = wp.compose;

const { withDispatch, withSelect } = wp.data;

const attributes = {
	index: {
		type: 'number',
		default: 0
    },
    parentID:{
        type:'string',
        default: ''
    },
	theme: {
		type: 'text',
		default: '#f63d3d'
	},
	collapsed: {
		type: 'boolean',
		default: false
	},
	titleColor: {
		type: 'string',
		default: '#ffffff'
	},
	panelTitle: {
		type: 'string',
		default: ''
	},
	newBlockPosition: {
		type: 'string',
		default: 'none' //changes into above/below depending on which button is clicked
	}
};

class ContentTogglePanel extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			attributes,
			setState,
			setAttributes,
			removeBlock,
			showPanel,
			block,
            blockParentId,
            parentID,
			selectBlock
		} = this.props;
        const { theme, titleColor, panelTitle } = attributes;
        
        if(parentID !== blockParentId){
            setAttributes({parentID: blockParentId})
        }

		return (
			<div
				className="wp-block-ub-content-toggle-accordion"
				style={{ borderColor: theme }}
			>
				<div
					className="wp-block-ub-content-toggle-accordion-title-wrap"
					style={{ backgroundColor: theme }}
				>
					<RichText
						tagName="span"
						style={{ color: titleColor }}
						className="wp-block-ub-content-toggle-accordion-title"
						value={panelTitle}
						formattingControls={['bold', 'italic']}
						onChange={value => setAttributes({ panelTitle: value })}
						placeholder={__('Panel Title')}
						keepPlaceholderOnFocus={true}
						unstableOnFocus={() => selectBlock(blockParentId)}
					/>
					<span
						onClick={() => {
							setState({ showPanel: !showPanel });
						}}
						className={
							'wp-block-ub-content-toggle-accordion-state-indicator dashicons dashicons-arrow-right-alt2 ' +
							(showPanel ? 'open' : '')
						}
					/>
				</div>
				{showPanel && (
					<div className="wp-block-ub-content-toggle-accordion-content-wrap">
						<InnerBlocks templateLock={false} />
					</div>
				)}
				<div className="wp-block-ub-content-toggle-accordion-controls-top">
					<span
						title={__('Insert New Toggle Above')}
						onClick={() =>
							setAttributes({ newBlockPosition: 'above' })
						}
						className="dashicons dashicons-plus-alt"
					/>
					<span
						title={__('Delete This Toggle')}
						onClick={() => removeBlock(block.clientId)}
						class="dashicons dashicons-dismiss"
					/>
				</div>
				<div className="wp-block-ub-content-toggle-accordion-controls-bottom">
					<span
						title={__('Insert New Toggle Below')}
						onClick={() =>
							setAttributes({ newBlockPosition: 'below' })
						}
						className="dashicons dashicons-plus-alt"
					/>
				</div>
			</div>
		);
	}
}

registerBlockType('ub/content-toggle-panel', {
	title: __('Content Toggle Panel'),
	parent: ['ub/content-toggle'],
	icon: icon,
	category: 'ultimateblocks',
	attributes,
	supports: {
		inserter: false,
		reusable: false
	},

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getBlockRootClientId } =
				select('core/block-editor') || select('core/editor');
			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				blockParentId: getBlockRootClientId(clientId)
			};
		}),
		withDispatch(dispatch => {
			const { updateBlockAttributes, removeBlock, selectBlock } =
				dispatch('core/block-editor') || dispatch('core/editor');

			return { updateBlockAttributes, removeBlock, selectBlock };
		}),
		withState({ showPanel: true })
	])(ContentTogglePanel),
	save(props) {
		const { theme, collapsed, titleColor, panelTitle } = props.attributes;
		const classNamePrefix = 'wp-block-ub-content-toggle';
		return (
			<div
				style={{ borderColor: theme }}
				className={`${classNamePrefix}-accordion`}
			>
				<div
					className={`${classNamePrefix}-accordion-title-wrap`}
					style={{ backgroundColor: theme }}
				>
					<RichText.Content
						tagName="span"
						className={`${classNamePrefix}-accordion-title`}
						style={{ color: titleColor }}
						value={panelTitle}
					/>
					<span
						className={
							`${classNamePrefix}-accordion-state-indicator dashicons dashicons-arrow-right-alt2 ` +
							(collapsed ? '' : 'open')
						}
					/>
				</div>
				<div
					style={{
						height: collapsed ? '0' : '',
						paddingTop: collapsed ? '0' : '',
						paddingBottom: collapsed ? '0' : ''
					}}
					className={`${classNamePrefix}-accordion-content-wrap`}
				>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},

	deprecated: [
		{
			attributes,
			save: panel_version_1_1_9
		}
	]
});

registerBlockType('ub/content-toggle-panel-block', {
	title: __('Content Toggle Panel'),
	parent: ['ub/content-toggle-block'],
	icon: icon,
	category: 'ultimateblocks',
	attributes,
	supports: {
		inserter: false,
		reusable: false
	},

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getBlockRootClientId } =
				select('core/block-editor') || select('core/editor');
			const { clientId } = ownProps;

			return {
				block: getBlock(clientId),
				blockParentId: getBlockRootClientId(clientId)
			};
		}),
		withDispatch(dispatch => {
			const { updateBlockAttributes, removeBlock, selectBlock } =
				dispatch('core/block-editor') || dispatch('core/editor');

			return { updateBlockAttributes, removeBlock, selectBlock };
		}),
		withState({ showPanel: true })
	])(ContentTogglePanel),
	save: () => <InnerBlocks.Content />
});
