// Setup the block
const { __ } = wp.i18n;

const {
    RichText,
    BlockControls,
    InspectorControls,
} = wp.editor;

const {
    PanelBody,
    SelectControl,
    ToggleControl,
    QueryControls,
    TextControl,
    RangeControl,
      } = wp.components;
const { Component } = wp.element;
const { addQueryArgs } = wp.url;
const { apiFetch } = wp;

const MAX_POSTS_COLUMNS = 4;

export default class Inspector extends Component{
    constructor() {
        super();
        this.state = {categoriesList: []}
    }

    componentDidMount() {
        this.stillMounted = true;
        this.fetchRequest = apiFetch({
            path: addQueryArgs( '/wp/v2/categories', { per_page: -1 })
        }).then(
            ( categoriesList ) => {
                if ( this.stillMounted ) {
                    this.setState({ categoriesList });
                }
            }
        ).catch(
            () => {
                if ( this.stillMounted ) {
                    this.setState({ categoriesList: [] });
                }
            }
        );
    }

    componentWillUnmount() {
        this.stillMounted = false;
    }


    render() {
        const { categoriesList } = this.state;

        const{
            attributes: {
                displayPostImage,
                displayPostAuthor,
                displayPostDate,
                displayPostExcerpt,
                excerptLength,
                displayPostLink,
                readMoreText,
                postsShow,
                postLayout,
                columns,
                categories,
                postType,
                orderBy,
                order
            },
            setAttributes,
            posts
        } = this.props;

        // Check for posts
        const hasPosts = Array.isArray( posts ) && posts.length;
        // Check the post type
        const isPost = 'post' === postType;

        // Post type options
        const postTypeOptions = [
            {value: 'grid', label: __('Grig', 'post-grid-blocks')},
            {value: 'list', label: __('List', 'post-grid-blocks')}
        ];

        return (
            <InspectorControls>
                <PanelBody
                    title={__('Post Grid Settings', 'post-grid-blocks')}
                >
                    <SelectControl
                        label={__('Grid Type', 'post-grid-blocks')}
                        options={postTypeOptions}
                        value={postLayout}
                        onChange={ postLayout => setAttributes({postLayout})}
                    />
                    { 'grid' === postLayout &&
                    <RangeControl
                        label={ __( 'Columns', 'atomic-blocks' ) }
                        value={ columns }
                        onChange={ ( columns ) => setAttributes({ columns }) }
                        min={ 1 }
                        max={ ! hasPosts ? MAX_POSTS_COLUMNS : Math.min( MAX_POSTS_COLUMNS, posts.length ) }
                    />
                    }
                    <QueryControls
                        { ...{ order, orderBy } }
                        numberOfItems={ postsShow }
                        categoriesList={ categoriesList }
                        selectedCategoryId={ categories }
                        onOrderChange={ ( value ) => setAttributes({ order: value }) }
                        onOrderByChange={ ( value ) => setAttributes({ orderBy: value }) }
                        onCategoryChange={ ( value ) => setAttributes({ categories: '' !== value ? value : undefined }) }
                        onNumberOfItemsChange={ ( value ) => setAttributes({ postsShow: value }) }
                    />
                </PanelBody>
                <PanelBody
                    title={__('Post Grid Content', 'post-grid-blocks')}
                >
                    <ToggleControl
                        label={__('Display Featured Image', 'post-grid-blocks')}
                        checked={displayPostImage}
                        onChange={ displayPostImage => setAttributes({displayPostImage})}
                    />
                    <ToggleControl
                        label={__('Display Author', 'post-grid-blocks')}
                        checked={displayPostAuthor}
                        onChange={ displayPostAuthor => setAttributes({displayPostAuthor})}
                    />
                    <ToggleControl
                        label={__('Display Date', 'post-grid-blocks')}
                        checked={displayPostDate}
                        onChange={ displayPostDate => setAttributes({displayPostDate})}
                    />
                    <ToggleControl
                        label={__('Display Excerpt', 'post-grid-blocks')}
                        checked={displayPostExcerpt}
                        onChange={ displayPostExcerpt => setAttributes({displayPostExcerpt})}
                    />
                    { displayPostExcerpt &&
                        <RangeControl
                            label={ __( 'Excerpt Length', 'post-grid-blocks' ) }
                            value={ excerptLength }
                            onChange={ ( value ) => setAttributes({ excerptLength: value }) }
                            min={ 0 }
                            max={ 200 }
                        />
                    }
                    <ToggleControl
                        label={ __( 'Display Continue Reading Link', 'post-grid-blocks' ) }
                        checked={ displayPostLink }
                        onChange={ displayPostLink => setAttributes({ displayPostLink }) }
                    />
                    { displayPostLink &&
                    <TextControl
                        label={ __( 'Customize Continue Reading Text', 'post-grid-blocks' ) }
                        type="text"
                        value={ readMoreText }
                        onChange={ ( value ) => setAttributes({ readMoreText: value }) }
                    />
                    }
                </PanelBody>
            </InspectorControls>
        );
    }
};