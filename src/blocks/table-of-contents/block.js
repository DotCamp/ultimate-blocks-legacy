import icon, { oneColumnIcon, twoColumnsIcon, threeColumnsIcon } from './icon';
import TableOfContents from './components';
import {
	version_1_1_2,
	version_1_1_3,
	version_1_1_5,
	version_1_1_6
} from './oldVersions';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const {
	ToggleControl,
	PanelRow,
	PanelBody,
	Toolbar,
	IconButton
} = wp.components;
const { RichText, InspectorControls, BlockControls } = wp.editor;

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
		default: Array(6).fill(true)
	},
	links: {
		type: 'string',
		default: ''
	},
	allowToCHiding: {
		type: 'boolean',
		default: false
	},
	showList: {
		type: 'boolean',
		default: true
	},
	numColumns: {
		type: 'number',
		default: 1
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
		const {
			links,
			title,
			allowedHeaders,
			showList,
			allowToCHiding,
			numColumns
		} = props.attributes;
		const onSetActiveEditable = newEditable => () => {
			setState({ editable: newEditable });
		};
		return [
			isSelected && (
				<InspectorControls>
					<PanelBody title={__('Allowed Headers')} initialOpen={true}>
						{allowedHeaders.map((a, i) => (
							<PanelRow>
								<label htmlFor={`ub_toggle_h${i + 1}`}>{`H${i +
									1}`}</label>
								<ToggleControl
									id={`ub_toggle_h${i + 1}`}
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
							</PanelRow>
						))}
					</PanelBody>
					<PanelBody
						title={__('Additional Settings')}
						initialOpen={true}
					>
						<PanelRow>
							<label htmlFor="ub_toc_toggle_display">
								{__(
									'Allow users to toggle the visibility of the table of contents'
								)}
							</label>
							<ToggleControl
								id="ub_toc_toggle_display"
								checked={allowToCHiding}
								onChange={allowToCHiding => {
									setAttributes({
										allowToCHiding,
										showList: allowToCHiding
											? showList
											: true
									});
								}}
							/>
						</PanelRow>
						{allowToCHiding && (
							<PanelRow>
								<label htmlFor="ub_show_toc">
									{__('Inititally Show Table of Contents')}
								</label>
								<ToggleControl
									id="ub_show_toc"
									checked={showList}
									onChange={() => {
										setAttributes({
											showList: !showList
										});
									}}
								/>
							</PanelRow>
						)}
					</PanelBody>
				</InspectorControls>
			),
			isSelected && (
				<BlockControls>
					<Toolbar>
						<IconButton
							className={'ub_toc_column_selector'}
							icon={oneColumnIcon}
							label={__('One column')}
							isPrimary={numColumns === 1}
							onClick={() => setAttributes({ numColumns: 1 })}
						/>
						<IconButton
							className={'ub_toc_column_selector'}
							icon={twoColumnsIcon}
							label={__('Two columns')}
							isPrimary={numColumns === 2}
							onClick={() => setAttributes({ numColumns: 2 })}
						/>
						<IconButton
							className={'ub_toc_column_selector'}
							icon={threeColumnsIcon}
							label={__('Three columns')}
							isPrimary={numColumns === 3}
							onClick={() => setAttributes({ numColumns: 3 })}
						/>
					</Toolbar>
				</BlockControls>
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
					{allowToCHiding && (
						<div id="ub_table-of-contents-header-toggle">
							<div id="ub_table-of-contents-toggle">
								[
								<a
									id="ub_table-of-contents-toggle-link"
									href="#"
									onClick={() => {
										setAttributes({ showList: !showList });
									}}
								>
									{showList ? __('hide') : __('show')}
								</a>
								]
							</div>
						</div>
					)}
				</div>
				{showList && (
					<TableOfContents
						numColumns={numColumns}
						allowedHeaders={allowedHeaders}
						headers={links && JSON.parse(links)}
						blockProp={props}
					/>
				)}
			</div>
		];
	}),

	save(props) {
		const {
			links,
			title,
			allowedHeaders,
			showList,
			numColumns,
			allowToCHiding
		} = props.attributes;
		return (
			<div className="ub_table-of-contents">
				{(title.length > 1 ||
					(title.length === 1 && title[0] !== '')) && (
					<div className="ub_table-of-contents-header">
						<div
							className="ub_table-of-contents-title"
							id="ub_table-of-contents-title"
						>
							{title}
						</div>
						{allowToCHiding && (
							<div id="ub_table-of-contents-header-toggle">
								<div id="ub_table-of-contents-toggle">
									[
									<a
										id="ub_table-of-contents-toggle-link"
										href="#ub_table-of-contents-title"
									>
										{showList ? __('hide') : __('show')}
									</a>
									]
								</div>
							</div>
						)}
					</div>
				)}

				<TableOfContents
					numColumns={numColumns}
					style={{
						display:
							showList ||
							title.length === 0 ||
							(title.length === 1 && title[0] === '')
								? 'block'
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
		{ attributes, save: version_1_1_5 },
		{ attributes, save: version_1_1_6 }
	]
});
