/**
 * BLOCK: feature-box
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon, {
	oneColumnIcon,
	twoColumnsIcon,
	threeColumnsIcon
} from './icons/icon';
import remove_icon from './icons/remove_icon';

//  Import CSS.
import './style.scss';
import './editor.scss';
import { version_1_1_2 } from './oldVersions';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const { InspectorControls, BlockControls, RichText, MediaUpload } = wp.editor;

const { Button, Toolbar, IconButton } = wp.components;

const { withState } = wp.compose;

const attributes = {
	column: {
		type: 'select',
		default: '2'
	},
	columnOneTitle: {
		type: 'array',
		source: 'children',
		selector: '.ub_feature_one_title',
		default: 'Title One'
	},
	columnTwoTitle: {
		type: 'array',
		source: 'children',
		selector: '.ub_feature_two_title',
		default: 'Title Two'
	},
	columnThreeTitle: {
		type: 'array',
		source: 'children',
		selector: '.ub_feature_three_title',
		default: 'Title Three'
	},
	columnOneBody: {
		type: 'array',
		source: 'children',
		selector: '.ub_feature_one_body',
		default:
			'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
	},
	columnTwoBody: {
		type: 'array',
		source: 'children',
		selector: '.ub_feature_two_body',
		default:
			'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
	},
	columnThreeBody: {
		type: 'array',
		source: 'children',
		selector: '.ub_feature_three_body',
		default:
			'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
	},
	imgOneURL: {
		type: 'string',
		source: 'attribute',
		attribute: 'src',
		selector: '.ub_feature_one_img'
	},
	imgOneID: {
		type: 'number'
	},
	imgOneAlt: {
		type: 'string',
		source: 'attribute',
		attribute: 'alt',
		selector: '.ub_feature_one_img'
	},
	imgTwoURL: {
		type: 'string',
		source: 'attribute',
		attribute: 'src',
		selector: '.ub_feature_two_img'
	},
	imgTwoID: {
		type: 'number'
	},
	imgTwoAlt: {
		type: 'string',
		source: 'attribute',
		attribute: 'alt',
		selector: '.ub_feature_two_img'
	},
	imgThreeURL: {
		type: 'string',
		source: 'attribute',
		attribute: 'src',
		selector: '.ub_feature_three_img'
	},
	imgThreeID: {
		type: 'number'
	},
	imgThreeAlt: {
		type: 'string',
		source: 'attribute',
		attribute: 'alt',
		selector: '.ub_feature_three_img'
	}
};

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('ub/feature-box', {
	title: __('Feature Box'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Feature Box'), __('Column'), __('Ultimate Blocks')],
	attributes,

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: withState({ editable: 'content' })(function(props) {
		const { isSelected, editable, setState, setAttributes } = props;

		const {
			column,
			columnOneTitle,
			columnTwoTitle,
			columnThreeTitle,
			columnOneBody,
			columnTwoBody,
			columnThreeBody,
			imgOneURL,
			imgOneID,
			imgOneAlt,
			imgTwoURL,
			imgTwoID,
			imgTwoAlt,
			imgThreeURL,
			imgThreeID,
			imgThreeAlt
		} = props.attributes;

		const columns = [
			{ value: '1', label: __('One Column') },
			{ value: '2', label: __('Two Column') },
			{ value: '3', label: __('Three Column') }
		];

		const onSetActiveEditable = newEditable => () => {
			setState({ editable: newEditable });
		};

		const onSelectImageOne = img => {
			setAttributes({
				imgOneID: img.id,
				imgOneURL: img.url,
				imgOneAlt: img.alt
			});
		};

		const onSelectImageTwo = img => {
			setAttributes({
				imgTwoID: img.id,
				imgTwoURL: img.url,
				imgTwoAlt: img.alt
			});
		};

		const onSelectImageThree = img => {
			setAttributes({
				imgThreeID: img.id,
				imgThreeURL: img.url,
				imgThreeAlt: img.alt
			});
		};

		const onRemoveImageOne = () => {
			setAttributes({
				imgOneID: null,
				imgOneURL: null,
				imgOneAlt: null
			});
		};

		const onRemoveImageTwo = () => {
			setAttributes({
				imgTwoID: null,
				imgTwoURL: null,
				imgTwoAlt: null
			});
		};

		const onRemoveImageThree = () => {
			setAttributes({
				imgThreeID: null,
				imgThreeURL: null,
				imgThreeAlt: null
			});
		};

		return [
			isSelected && (
				<BlockControls>
					{' '}
					<Toolbar>
						<IconButton
							icon={oneColumnIcon}
							label={__('One column')}
							isActive={column === '1'}
							onClick={() => setAttributes({ column: '1' })}
						/>
						<IconButton
							icon={twoColumnsIcon}
							label={__('Two columns')}
							isActive={column === '2'}
							onClick={() => setAttributes({ column: '2' })}
						/>
						<IconButton
							icon={threeColumnsIcon}
							label={__('Three columns')}
							isActive={column === '3'}
							onClick={() => setAttributes({ column: '3' })}
						/>
					</Toolbar>
				</BlockControls>
			),

			isSelected && <InspectorControls />,

			<div className={props.className}>
				<div className={`ub_feature_box column_${column}`}>
					<div class="ub_feature_1">
						{!imgOneID ? (
							<div className="ub_feature_upload_button">
								<MediaUpload
									onSelect={onSelectImageOne}
									type="image"
									value={imgOneID}
									render={({ open }) => (
										<Button
											className="components-button button button-medium"
											onClick={open}
										>
											Upload Image
										</Button>
									)}
								/>
							</div>
						) : (
							<React.Fragment>
								{isSelected ? (
									<Button
										className="remove-image"
										onClick={onRemoveImageOne}
									>
										{remove_icon}
									</Button>
								) : null}
								<img
									className="ub_feature_one_img"
									src={imgOneURL}
									alt={imgOneAlt}
								/>
							</React.Fragment>
						)}
						<RichText
							tagName="p"
							className="ub_feature_one_title"
							value={columnOneTitle}
							onChange={value =>
								setAttributes({ columnOneTitle: value })
							}
							keepPlaceholderOnFocus={true}
						/>
						<RichText
							tagName="p"
							className="ub_feature_one_body"
							value={columnOneBody}
							onChange={value =>
								setAttributes({ columnOneBody: value })
							}
							keepPlaceholderOnFocus={true}
						/>
					</div>
					<div class="ub_feature_2">
						{!imgTwoID ? (
							<div className="ub_feature_upload_button">
								<MediaUpload
									onSelect={onSelectImageTwo}
									type="image"
									value={imgTwoID}
									render={({ open }) => (
										<Button
											className="components-button button button-medium"
											onClick={open}
										>
											Upload Image
										</Button>
									)}
								/>
							</div>
						) : (
							<React.Fragment>
								{isSelected ? (
									<Button
										className="remove-image"
										onClick={onRemoveImageTwo}
									>
										{remove_icon}
									</Button>
								) : null}
								<img
									className="ub_feature_two_img"
									src={imgTwoURL}
									alt={imgTwoAlt}
								/>
							</React.Fragment>
						)}
						<RichText
							tagName="p"
							className="ub_feature_two_title"
							value={columnTwoTitle}
							onChange={value =>
								setAttributes({ columnTwoTitle: value })
							}
							keepPlaceholderOnFocus={true}
						/>
						<RichText
							tagName="p"
							className="ub_feature_two_body"
							value={columnTwoBody}
							onChange={value =>
								setAttributes({ columnTwoBody: value })
							}
							keepPlaceholderOnFocus={true}
						/>
					</div>
					<div class="ub_feature_3">
						{!imgThreeID ? (
							<div className="ub_feature_upload_button">
								<MediaUpload
									onSelect={onSelectImageThree}
									type="image"
									value={imgThreeID}
									render={({ open }) => (
										<Button
											className="components-button button button-medium"
											onClick={open}
										>
											Upload Image
										</Button>
									)}
								/>
							</div>
						) : (
							<React.Fragment>
								{isSelected ? (
									<Button
										className="remove-image"
										onClick={onRemoveImageThree}
									>
										{remove_icon}
									</Button>
								) : null}
								<img
									className="ub_feature_three_img"
									src={imgThreeURL}
									alt={imgThreeAlt}
								/>
							</React.Fragment>
						)}
						<RichText
							tagName="p"
							className="ub_feature_three_title"
							value={columnThreeTitle}
							onChange={value =>
								setAttributes({ columnThreeTitle: value })
							}
							keepPlaceholderOnFocus={true}
						/>
						<RichText
							tagName="p"
							className="ub_feature_three_body"
							value={columnThreeBody}
							onChange={value =>
								setAttributes({ columnThreeBody: value })
							}
							keepPlaceholderOnFocus={true}
						/>
					</div>
				</div>
			</div>
		];
	}),

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function(props) {
		const {
			column,
			columnOneTitle,
			columnTwoTitle,
			columnThreeTitle,
			columnOneBody,
			columnTwoBody,
			columnThreeBody,
			imgOneURL,
			imgOneAlt,
			imgTwoURL,
			imgTwoAlt,
			imgThreeURL,
			imgThreeAlt
		} = props.attributes;

		return (
			<div className={props.className}>
				<div className={`ub_feature_box column_${column}`}>
					<div class="ub_feature_1">
						<img
							className="ub_feature_one_img"
							src={imgOneURL}
							alt={imgOneAlt}
						/>
						<p className="ub_feature_one_title">{columnOneTitle}</p>
						<p className="ub_feature_one_body">{columnOneBody}</p>
					</div>
					<div class="ub_feature_2">
						<img
							className="ub_feature_two_img"
							src={imgTwoURL}
							alt={imgTwoAlt}
						/>
						<p className="ub_feature_two_title">{columnTwoTitle}</p>
						<p className="ub_feature_two_body">{columnTwoBody}</p>
					</div>
					<div class="ub_feature_3">
						<img
							className="ub_feature_three_img"
							src={imgThreeURL}
							alt={imgThreeAlt}
						/>
						<p className="ub_feature_three_title">
							{columnThreeTitle}
						</p>
						<p className="ub_feature_three_body">
							{columnThreeBody}
						</p>
					</div>
				</div>
			</div>
		);
	},
	deprecated: [
		{
			attributes,
			save: version_1_1_2
		}
	]
});
