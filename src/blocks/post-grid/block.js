// Import icon.
import icons from './icons';

// Import CSS.
import './style.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

import attributes from './attributes';
import LatestPostBlock from './editorDisplay';

const { Fragment } = wp.element;

export default registerBlockType('ub/post-grid', {
    title: __('Post Grid'),
    description: __( 'Add a grid or list of customizable posts.', 'post-grid' ),
    icon: icons,
    category: 'ultimateblocks',
    keywords: [__('post grid'), __('quotes'), __('Ultimate Blocks')],
    attributes,
    /**
     * The edit function describes the structure of your block in the context of the editor.
     * This represents what the editor will render when the block is used.
     *
     * The "edit" property must be a valid function.
     *
     * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
     */
    edit: props => {

        const {
            attributes,
            className,
            isSelected,
            setAttributes
        } = props;

        return[
            <LatestPostBlock {...{ setAttributes, ...props }}/>
        ];
    },
    save: () => null
});