import icon from './icon';
import TableOfContents from './components';
import { version_1_1_2, version_1_1_3 } from './oldVersions';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const { RichText } = wp.editor;

const { withState } = wp.compose;

import './editor.scss';
import './style.scss';

const attributes = {
	title: {
		type: 'array',
		source: 'children',
		selector: '.ub_table-of-contents-title'
	},
	links: {
		type: 'string',
		default: ''
	}
};

registerBlockType('ub/table-of-contents', {
	title: __('Table of Contents'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Table of Contents'), __('Ultimate Blocks')],

	attributes,

	supports: {
		multiple: false
	},

	edit: withState({ editable: 'content' })(function(props) {
		const { editable, setAttributes, isSelected } = props;
		const { links, title } = props.attributes;
		const onSetActiveEditable = newEditable => () => {
			setState({ editable: newEditable });
		};
		return (
			<div className="ub_table-of-contents">
				<div className="ub_table-of-contents-header">
					<div className="ub_table-of-contents-title">
						<RichText
							placeholder={__('Optional title')}
							className="ub_table-of-contents-title"
							onChange={text => setAttributes({ title: text })}
							value={title}
							isSelected={
								isSelected &&
								editable === 'table_of_contents_title'
							}
							onFocus={onSetActiveEditable(
								'table_of_contents_title'
							)}
							keepPlaceholderOnFocus={true}
						/>
					</div>
				</div>
				<TableOfContents
					headers={links && JSON.parse(links)}
					blockProp={props}
				/>
			</div>
		);
	}),

	save(props) {
		const { links, title } = props.attributes;
		return (
			<div className="ub_table-of-contents">
				{(title.length > 1 ||
					(title.length === 1 && title[0] !== '')) && (
					<div className="ub_table-of-contents-header">
						<div className="ub_table-of-contents-title">
							{title}
						</div>
					</div>
				)}
				<TableOfContents headers={links && JSON.parse(links)} />
			</div>
		);
	},
	deprecated: [
		{ attributes, save: version_1_1_2 },
		{ attributes, save: version_1_1_3 }
	]
});
