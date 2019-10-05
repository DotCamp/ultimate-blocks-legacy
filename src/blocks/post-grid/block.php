<?php
/**
 * Server-side rendering for the post grid block
 */

function ub_render_post_grid_block( $attributes ) {

    /**
     * Global post object.
     * Used for excluding the current post from the grid.
     *
     * @var WP_Post
     */
    global $post;

    $categories = isset( $attributes['categories'] ) ? $attributes['categories'] : '';

    /* Setup the query */
    $grid_query = new WP_Query(
        array(
            'posts_per_page'      => $attributes['postsShow'],
            'post_status'         => 'publish',
            'order'               => $attributes['order'],
            'orderby'             => $attributes['orderBy'],
            'cat'                 => $categories,
            'offset'              => $attributes['offset'],
            'post_type'           => $attributes['postType'],
            'ignore_sticky_posts' => 1,
            'post__not_in'        => array( $post->ID ), // Exclude the current post from the grid.
        )
    );

    $post_grid_markup = '';

    /* Start the loop */
    if ( $grid_query->have_posts() ) {

        while ( $grid_query->have_posts() ) {
            $grid_query->the_post();

            /* Setup the post ID */
            $post_id = get_the_ID();

            /* Setup the featured image ID */
            $post_thumb_id = get_post_thumbnail_id( $post_id );

            /* Setup the post classes */
            $post_classes = 'ub-post-grid-item';

            /* Add sticky class */
            if ( is_sticky( $post_id ) ) {
                $post_classes .= ' sticky';
            } else {
                $post_classes .= null;
            }

            /* Join classes together */
            $post_classes = join( ' ', get_post_class( $post_classes, $post_id ) );

            /* Start the markup for the post */
            $post_grid_markup .= sprintf(
                '<article id="post-%1$s" class="%2$s">',
                esc_attr( $post_id ),
                esc_attr( $post_classes )
            );

            /* Get the featured image */
            if ( isset( $attributes['displayPostImage'] ) && $attributes['displayPostImage'] && $post_thumb_id ) {

                $post_thumb_size = 'full';

                /* Output the featured image */
                $post_grid_markup .= sprintf(
                    '<div class="ub-block-post-grid-image"><a href="%1$s" rel="bookmark" aria-hidden="true" tabindex="-1">%2$s</a></div>',
                    esc_url( get_permalink( $post_id ) ),
                    wp_get_attachment_image( $post_thumb_id, $post_thumb_size )
                );
            }

            /* Wrap the text content */
            $post_grid_markup .= sprintf(
                '<div class="ub-block-post-grid-text">'
            );

            $post_grid_markup .= sprintf(
                '<header class="ub-block-post-grid-header">'
            );

            /* Get the post title */
            $title = get_the_title( $post_id );

            if ( ! $title ) {
                $title = __( 'Untitled', 'ultimate-blocks' );
            }

            if ( isset( $attributes['displayPostTitle'] ) && $attributes['displayPostTitle'] ) {

                if ( isset( $attributes['postTitleTag'] ) ) {
                    $post_title_tag = $attributes['postTitleTag'];
                } else {
                    $post_title_tag = 'h2';
                }

                $post_grid_markup .= sprintf(
                    '<%3$s class="ub-block-post-grid-title"><a href="%1$s" rel="bookmark">%2$s</a></%3$s>',
                    esc_url( get_permalink( $post_id ) ),
                    esc_html( $title ),
                    esc_attr( $post_title_tag )
                );
            }

            if ( isset( $attributes['postType'] ) && $attributes['postType'] === 'post' ) {

                /* Get the post author */
                if ( isset( $attributes['displayPostAuthor'] ) && $attributes['displayPostAuthor'] ) {
                    $post_grid_markup .= sprintf(
                        '<div class="ub-block-post-grid-author" itemprop="author" itemtype="https://schema.org/Person"><a class="ub-text-link" href="%2$s" itemprop="url" rel="author"><span itemprop="name">%1$s</span></a></div>',
                        esc_html( get_the_author_meta( 'display_name', get_the_author_meta( 'ID' ) ) ),
                        esc_html( get_author_posts_url( get_the_author_meta( 'ID' ) ) )
                    );
                }

                /* Get the post date */
                if ( isset( $attributes['displayPostDate'] ) && $attributes['displayPostDate'] ) {
                    $post_grid_markup .= sprintf(
                        '<time datetime="%1$s" class="ub-block-post-grid-date" itemprop="datePublished">%2$s</time>',
                        esc_attr( get_the_date( 'c', $post_id ) ),
                        esc_html( get_the_date( '', $post_id ) )
                    );
                }
            }

            /* Close the header content */
            $post_grid_markup .= sprintf(
                '</header>'
            );

            /* Wrap the excerpt content */
            $post_grid_markup .= sprintf(
                '<div class="ub-block-post-grid-excerpt">'
            );

            /* Get the excerpt */

            $excerpt = apply_filters( 'the_excerpt',
                get_post_field(
                    'post_excerpt',
                    $post_id,
                    'display'
                )
            );

            if ( empty( $excerpt ) && isset( $attributes['excerptLength'] ) ) {
                $excerpt = apply_filters( 'the_excerpt',
                    wp_trim_words(
                        preg_replace(
                            array(
                                '/\<figcaption>.*\<\/figcaption>/',
                                '/\[caption.*\[\/caption\]/',
                            ),
                            '',
                            get_the_content()
                        ),
                        $attributes['excerptLength']
                    )
                );
            }

            if ( ! $excerpt ) {
                $excerpt = null;
            }

            if ( isset( $attributes['displayPostExcerpt'] ) && $attributes['displayPostExcerpt'] ) {
                $post_grid_markup .= wp_kses_post( $excerpt );
            }

            /* Get the read more link */
            if ( isset( $attributes['displayPostLink'] ) && $attributes['displayPostLink'] ) {
                $post_grid_markup .= sprintf(
                    '<p><a class="ub-block-post-grid-more-link ub-text-link" href="%1$s" rel="bookmark">%2$s <span class="screen-reader-text">%3$s</span></a></p>',
                    esc_url( get_permalink( $post_id ) ),
                    esc_html( $attributes['readMoreText'] ),
                    esc_html( $title )
                );
            }

            /* Close the excerpt content */
            $post_grid_markup .= sprintf(
                '</div>'
            );

            /* Close the text content */
            $post_grid_markup .= sprintf(
                '</div>'
            );

            /* Close the post */
            $post_grid_markup .= "</article>\n";
        }

        /* Restore original post data */
        wp_reset_postdata();

        /* Build the block classes */
        $class = "ub-block-post-grid";

        if ( isset( $attributes['className'] ) ) {
            $class .= ' ' . $attributes['className'];
        }

        /* Layout orientation class */
        $grid_class = 'ub-post-grid-items';

        if ( isset( $attributes['postLayout'] ) && 'list' === $attributes['postLayout'] ) {
            $grid_class .= ' is-list';
        } else {
            $grid_class .= ' is-grid';
        }

        /* Grid columns class */
        if ( isset( $attributes['columns'] ) && 'grid' === $attributes['postLayout'] ) {
            $grid_class .= ' columns-' . $attributes['columns'];
        }

        /* Post grid section tag */

        $section_tag = 'section';

        /* Output the post markup */
        $block_content = sprintf(
            '<%1$s class="%2$s"><div class="%3$s">%4$s</div></%1$s>',
            $section_tag,
            esc_attr( $class ),
            esc_attr( $grid_class ),
            $post_grid_markup
        );
        return $block_content;
    }
}
function ub_register_post_grid_block() {
    if( function_exists( 'register_block_type' ) ) {
        require dirname( dirname(__DIR__) ) . '/defaults.php';
        register_block_type( 'ub/post-grid', array(
            'attributes' => $defaultValues['ub/post-grid']['attributes'],
            'render_callback' => 'ub_render_post_grid_block'));
    }
}

add_action( 'init', 'ub_register_post_grid_block' );

function ub_blocks_register_rest_fields() {
    /* Add landscape featured image source */
    register_rest_field(
        array( 'post', 'page' ),
        'featured_image_src',
        array(
            'get_callback'    => 'ub_blocks_get_image_src_landscape',
            'update_callback' => null,
            'schema'          => null,
        )
    );
    /* Add square featured image source */
    register_rest_field(
        array( 'post', 'page' ),
        'featured_image_src_square',
        array(
            'get_callback'    => 'ub_blocks_get_image_src_square',
            'update_callback' => null,
            'schema'          => null,
        )
    );
    /* Add author info */
    register_rest_field(
        'post',
        'author_info',
        array(
            'get_callback'    => 'ub_blocks_get_author_info',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}
add_action( 'rest_api_init', 'ub_blocks_register_rest_fields' );
/**
 * Get landscape featured image source for the rest field
 *
 * @param String $object  The object type.
 * @param String $field_name  Name of the field to retrieve.
 * @param String $request  The current request object.
 */
function ub_blocks_get_image_src_landscape( $object, $field_name, $request ) {
    $feat_img_array = wp_get_attachment_image_src(
        $object['featured_media'],
        'ub-block-post-grid-landscape',
        false
    );
    return $feat_img_array[0];
}
/**
 * Get square featured image source for the rest field
 *
 * @param String $object  The object type.
 * @param String $field_name  Name of the field to retrieve.
 * @param String $request  The current request object.
 */
function ub_blocks_get_image_src_square( $object, $field_name, $request ) {
    $feat_img_array = wp_get_attachment_image_src(
        $object['featured_media'],
        'ub-block-post-grid-square',
        false
    );
    return $feat_img_array[0];
}
/**
 * Get author info for the rest field
 *
 * @param String $object  The object type.
 * @param String $field_name  Name of the field to retrieve.
 * @param String $request  The current request object.
 */
function ub_blocks_get_author_info( $object, $field_name, $request ) {
    /* Get the author name */
    $author_data['display_name'] = get_the_author_meta( 'display_name', $object['author'] );
    /* Get the author link */
    $author_data['author_link'] = get_author_posts_url( $object['author'] );
    /* Return the author data */
    return $author_data;
}