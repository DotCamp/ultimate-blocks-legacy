import icon from './icon';
import TableOfContents from './components';
import { version_1_1_2, version_1_1_3, version_1_1_5 } from './oldVersions';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const { ToggleControl, PanelRow, PanelBody } = wp.components;
const { RichText, InspectorControls } = wp.editor;

const { withState } = wp.compose;

import './editor.scss';
import './style.scss';

const attributes = {
	title: {
		type: 'array',
		source: 'children',
		selector: '.ub_table-of-contents-title'
	},
	allowedHeaders: {
		type: 'array',
		default: [true, true, true, true, true, true]
	},
	links: {
		type: 'string',
		default: ''
	},
	showList: {
		type: 'boolean',
		default: true
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
		const { links, title, allowedHeaders, showList } = props.attributes;
		const onSetActiveEditable = newEditable => () => {
			setState({ editable: newEditable });
		};
		return [
			isSelected && (
				<InspectorControls>
					<PanelBody title={__('Allowed Headers')}>
						{allowedHeaders.map((a, i) => (
							<ToggleControl
								label={`H${i + 1}`}
								checked={a}
								onChange={() =>
									setAttributes({
										allowedHeaders: [
											...allowedHeaders.slice(0, i),
											!allowedHeaders[i],
											...allowedHeaders.slice(i + 1)
										]
									})
								}
							/>
						))}
					</PanelBody>
				</InspectorControls>
			),
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
					<div id="ub_table-of-contents-header-toggle">
						<div id="ub_table-of-contents-toggle">
							[
							<a
								id="ub_table-of-contents-toggle-link"
								href="#"
								onClick={() => {
									setAttributes({
										showList: !showList
									});
								}}
							>
								{showList ? __('hide') : __('show')}
							</a>
							]
						</div>
					</div>
				</div>
				{showList && (
					<TableOfContents
						allowedHeaders={allowedHeaders}
						headers={links && JSON.parse(links)}
						blockProp={props}
					/>
				)}
			</div>
		];
	}),

	save(props) {
		const { links, title, allowedHeaders, showList } = props.attributes;
		return (
			<div className="ub_table-of-contents">
				{(title.length > 1 ||
					(title.length === 1 && title[0] !== '')) && (
					<div className="ub_table-of-contents-header">
						<div className="ub_table-of-contents-title">
							{title}
						</div>
						<div id="ub_table-of-contents-header-toggle">
							<div id="ub_table-of-contents-toggle">
								[
								<a
									id="ub_table-of-contents-toggle-link"
									href="#"
									onClick={() => {
										setAttributes({
											showList: !showList
										});
									}}
								>
									{showList ? __('hide') : __('show')}
								</a>
								]
							</div>
						</div>
					</div>
				)}

				<TableOfContents
					style={{
						display:
							showList ||
							title.length === 0 ||
							(title.length === 1 && title[0] === '')
								? 'initial'
								: 'none'
					}}
					allowedHeaders={allowedHeaders}
					headers={links && JSON.parse(links)}
				/>
			</div>
		);
	},
	deprecated: [
		{ attributes, save: version_1_1_2 },
		{
			attributes,
			migrate: function(attributes) {
				function flattenArray(arr) {
					return arr.reduce(
						(acc, val) =>
							acc.concat(
								Array.isArray(val) ? flattenArray(val) : val
							),
						[]
					);
				}
				return { links: flattenArray(attributes.links) };
			},
			save: version_1_1_3
		},
		{ attributes, save: version_1_1_5 }
	]
});
