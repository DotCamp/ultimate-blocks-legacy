import isUndefined from 'lodash/isUndefined';
import pickBy from 'lodash/pickBy';
import classnames from 'classnames';
import moment from 'moment';
import Inspector from './inspector';
// Setup the block
const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
    Placeholder,
    Spinner,
    Toolbar
} = wp.components;

const {
    BlockControls
} = wp.editor;

const { compose } = wp.compose;
const { decodeEntities } = wp.htmlEntities;
const {
    withSelect
} = wp.data;

class LatestPostBlock extends Component{

    render(){
        const{
            attributes: {
                displayPostImage,
                displayPostAuthor,
                displayPostDate,
                displayPostExcerpt,
                excerptLength,
                displayPostLink,
                readMoreText,
                postLayout,
                columns,
                postType,
            },
            setAttributes,
            className,
            posts
        } = this.props;
        //const { posts } = this.props;

        const hasPosts = Array.isArray( posts ) && posts.length;

        if ( ! hasPosts ) {
            return (
                <Fragment>
                    <Placeholder
                        icon="admin-post"
                        label={ __( 'Ultimate Blocks Post Grid', 'post-grid-blocks' ) }
                    >
                        { ! Array.isArray( posts ) ?
                            <Spinner /> :
                            __( 'No posts found.', 'post-grid-blocks' )
                        }
                    </Placeholder>
                </Fragment>
            );
        }

        const SectionTag = 'section';
        const PostTag = 'h3';

        // Add toolbar controls to change layout
        const layoutControls = [
            {
                icon: 'grid-view',
                title: __( 'Grid View', 'post-grid-blocks' ),
                onClick: () => setAttributes({ postLayout: 'grid' }),
                isActive: 'grid' === postLayout
            },
            {
                icon: 'list-view',
                title: __( 'List View', 'post-grid-blocks' ),
                onClick: () => setAttributes({ postLayout: 'list' }),
                isActive: 'list' === postLayout
            }
        ];

        return [
            <Fragment>
                <Inspector
                    { ...{ setAttributes, ...this.props } }
                />
                <BlockControls>
                    <Toolbar controls={ layoutControls } />
                </BlockControls>
                <SectionTag
                    className={ classnames(
                        this.props.className,
                        'ub-block-post-grid',
                    ) }
                >
                <div
                    className={ classnames({
                        'is-grid': 'grid' === postLayout,
                        'is-list': 'list' === postLayout,
                        [ `columns-${ columns }` ]: 'grid' === postLayout,
                        'ub-post-grid-items': 'ub-post-grid-items'
                    }) }
                >
                    {posts.map((post, i) =>
                        <article
                            key={ i }
                            id={ 'post-' + post.id }
                            className={ classnames(
                                'post-' + post.id)
                            }
                        >
                             <Fragment>
                                 <div className='ub-block-post-grid-image'>
                                 {
                                     displayPostImage && post.featured_media ? (
                                         <img src={post.featured_image_src}/>
                                     ) : (
                                         null
                                     )
                                 }
                                 </div>
                                 <div className='ub_block-post-grid-text'>
                                     <header className="ub_block-post-grid-header">
                                         <PostTag className="ub-block-post-grid-title"><a href={ post.link } target="_blank" rel="bookmark">
                                             { decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)', 'post-grid-blocks' ) }
                                             </a></PostTag>
                                         { displayPostAuthor &&
                                             <div className="ub-block-post-grid-author">
                                                 <a className="ub-text-link" target="_blank" href={ post.author_info.author_link }>
                                                     {post.author_info.display_name}</a></div>}
                                         {displayPostDate &&
                                             <time dateTime={moment(post.date_gmt).utc().format()} className={'ub-block-post-grid-date'}>
                                                 {moment(post.date_gmt).local().format('MMMM DD, Y', 'post-grid-blocks')}
                                             </time>
                                         }
                                     </header>
                                     <div className="ub-block-post-grid-excerpt">
                                         { displayPostExcerpt &&
                                             <div dangerouslySetInnerHTML={{__html: truncate(post.excerpt.rendered, excerptLength)}}/>}
                                         { displayPostLink &&
                                             <p><a className="ub-block-post-grid-more-link ub-text-link" href={ post.link } target="_blank" rel="bookmark">{ readMoreText }</a></p>
                                         }
                                     </div>
                                 </div>
                             </Fragment>
                        </article>
                    )}
                </div>
                </SectionTag>
            </Fragment>
        ];
    }
}
export default compose([
   withSelect(( select, props )=>{
       //console.log(props);
       const {
           order,
           categories
       } = props.attributes;

       const { getEntityRecords } = select( 'core' );
       const PostsQuery = pickBy({
           categories,
           order,
           orderby: props.attributes.orderBy,
           per_page: props.attributes.postsShow,
           offset: props.attributes.offset,
           exclude: [ wp.data.select( 'core/editor' ).getCurrentPostId() ]
       }, ( value ) => ! isUndefined( value ) );
       return{
           posts: getEntityRecords( 'postType', props.attributes.postType, PostsQuery )
       };
    })
])(LatestPostBlock)

// Truncate excerpt
function truncate( str, no_words ) {
    return str.split( ' ' ).splice( 0, no_words ).join( ' ' );
}