<?php
/**
 * Server-side rendering for the post grid block
 */
require_once dirname(dirname(dirname(__DIR__))) . '/includes/ultimate-blocks-styles-css-generator.php';

function ub_query_post( $attributes ){

    /**
     * Global post object.
     * Used for excluding the current post from the grid.
     *
     * @var WP_Post
     */
    global $post;

    $includedCategories = isset($attributes['categories']) && $attributes['categories'] != '' ? $attributes['categories'] :
                    (isset($attributes['categoryArray']) ?
                        join(',',array_map(function($c){return $c['id'];}, $attributes['categoryArray'])) : '');

    $excludedCategories = isset($attributes['excludedCategories']) ?
                join(',',array_map(function($c){return $c['id'];}, $attributes['excludedCategories'])) : '';

    /* Setup the query */
    $post_query = new WP_Query(
        array(
            'posts_per_page' => $attributes['amountPosts'],
            'post_status' => 'publish',
            'order' => $attributes['order'],
            'orderby' => $attributes['orderBy'],
            'cat' => $includedCategories,
            'category__not_in' => $excludedCategories,
            'offset' => $attributes['offset'],
            'post_type' => 'post',
            'ignore_sticky_posts' => 1,
            'post__not_in' => array(absint($post->ID)), // Exclude the current post from the grid.
            'tag__in' => $attributes['tagArray'],
            'author__in' => $attributes['authorArray']
        )
    );

    return $post_query;

}

function ub_render_post_grid_block( $attributes, $content, $block ){

    /* get posts */

    $post_query = ub_query_post( $attributes );

    /* Start the loop */

    $post_grid = '';

    if ( $post_query->have_posts() ) {

        while ( $post_query->have_posts() ) {
            $post_query->the_post();

            /* Setup the post ID */
            $post_id = get_the_ID();

            /* Setup the featured image ID */
            $post_thumb_id = get_post_thumbnail_id( $post_id );

            /* Setup the post classes */
            $post_classes = 'ub-post-grid-item';

            /* Join classes together */
            $post_classes = join( ' ', get_post_class( $post_classes, $post_id ) );

			$post_padding 		= Ultimate_Blocks\includes\get_spacing_css(!empty($attributes['postPadding']) ? $attributes['postPadding'] : array() );
			$postBorderRadius = array(
				"padding-top" 								=> isset($post_padding['top']) ? $post_padding['top'] : '',
				"padding-left" 								=> isset($post_padding['left']) ? $post_padding['left'] : '',
				"padding-right" 							=> isset($post_padding['right']) ? $post_padding['right'] : '',
				"padding-bottom" 							=> isset($post_padding['bottom']) ? $post_padding['bottom'] : '',
				"border-top-left-radius" 					=> !empty($attributes['postBorderRadius']['topLeft']) ? $attributes['postBorderRadius']['topLeft'] : "",
				"border-top-right-radius" 					=> !empty($attributes['postBorderRadius']['topRight']) ? $attributes['postBorderRadius']['topRight'] : "",
				"border-bottom-left-radius"					=> !empty($attributes['postBorderRadius']['bottomLeft']) ? $attributes['postBorderRadius']['bottomLeft'] : "",
				"border-bottom-right-radius"				=> !empty($attributes['postBorderRadius']['bottomRight']) ? $attributes['postBorderRadius']['bottomRight'] : "",
				"--ub-post-grid-post-background" 			=> Ultimate_Blocks\includes\get_background_color_var($attributes,'postBackgroundColor', 'postBackgroundGradient'),
				"--ub-post-grid-post-hover-background" 		=> Ultimate_Blocks\includes\get_background_color_var($attributes,'postBackgroundColorHover', 'postBackgroundGradientHover'),
			);

            /* Start the markup for the post */
            $post_grid .= sprintf(
                '<article id="post-%1$s" class="%2$s" style="%3$s">',
                esc_attr( $post_id ),
				esc_attr( $post_classes ),
				esc_attr( Ultimate_Blocks\includes\generate_css_string($postBorderRadius) ),
            );

            /* Get the featured image */
            if ( isset( $attributes['checkPostImage'] ) && $attributes['checkPostImage'] && $post_thumb_id ) {

				$styles = array(
					"--ub-post-grid-image-top-left-radius" 		=> !empty($attributes['imageBorderRadius']['topLeft']) ? $attributes['imageBorderRadius']['topLeft'] : "",
					"--ub-post-grid-image-top-right-radius"		=> !empty($attributes['imageBorderRadius']['topRight']) ? $attributes['imageBorderRadius']['topRight'] : "",
					"--ub-post-grid-image-bottom-left-radius" 	=> !empty($attributes['imageBorderRadius']['bottomLeft']) ? $attributes['imageBorderRadius']['bottomLeft'] : "",
					"--ub-post-grid-image-bottom-right-radius" 	=> !empty($attributes['imageBorderRadius']['bottomRight']) ? $attributes['imageBorderRadius']['bottomRight'] : "",
				);

                /* Output the featured image */
                $post_grid .= sprintf(
                    '<div class="ub-block-post-grid-image" style="%3$s"><a href="%1$s" rel="bookmark" aria-hidden="true" tabindex="-1">%2$s</a></div>',
                    esc_url( get_permalink( $post_id ) ),
					wp_get_attachment_image( $post_thumb_id, array($attributes['postImageWidth'], $attributes['preservePostImageAspectRatio'] ? 0 : $attributes['postImageHeight']) ), //use array
					esc_attr( Ultimate_Blocks\includes\generate_css_string($styles) ),
                );
            }

			$content_padding 	= Ultimate_Blocks\includes\get_spacing_css(!empty($attributes['contentPadding']) ? $attributes['contentPadding'] : array());
			$styles = [
				"padding-top"		=> isset($content_padding['top']) ? $content_padding['top'] : '',
				"padding-right"		=> isset($content_padding['right']) ? $content_padding['right'] : '',
				"padding-bottom"	=> isset($content_padding['bottom']) ? $content_padding['bottom'] : '',
				"padding-left"		=> isset($content_padding['left']) ? $content_padding['left'] : '',
			];

            /* Wrap the text content */
            $post_grid .= sprintf(
				'<div class="ub-block-post-grid-text" style="%1$s">',
				esc_attr( Ultimate_Blocks\includes\generate_css_string($styles) ),
            );

            $post_grid .= sprintf(
                '<header class="ub-block-post-grid-header">'
            );

            /* Get the post title */
            $title = get_the_title( $post_id );

            if ( ! $title ) {
                $title = __( 'Untitled', 'ultimate-blocks' );
            }

            if ( isset( $attributes['checkPostTitle'] ) && $attributes['checkPostTitle'] ) {

                if ( isset( $attributes['postTitleTag'] ) ) {
                    $post_title_tag = $attributes['postTitleTag'];
                } else {
                    $post_title_tag = 'h2';
                }

                if (!in_array($post_title_tag, ['h2', 'h3', 'h4'])) {
                    $post_title_tag = 'h2';
                }

				$styles = [
					"--ub-post-grid-title-color"		=> isset($attributes['postTitleColor']) ? $attributes['postTitleColor'] : '',
					"--ub-post-grid-title-hover-color"	=> isset($attributes['postTitleColorHover']) ? $attributes['postTitleColorHover']: "",
				];

                $post_grid .= sprintf(
                    '<%3$s class="ub-block-post-grid-title"><a style="%4$s" href="%1$s" rel="bookmark">%2$s</a></%3$s>',
                    esc_url( get_permalink( $post_id ) ),
                    esc_html( $title ),
					esc_attr( $post_title_tag ),
					esc_attr( Ultimate_Blocks\includes\generate_css_string($styles) ),
                );
            }

            /* Get the post author */
            if ( isset( $attributes['checkPostAuthor'] ) && $attributes['checkPostAuthor'] ) {
				$styles = [
					"--ub-post-grid-author-color" 			=> isset($attributes['authorColor']) ? $attributes['authorColor'] : "",
					"--ub-post-grid-author-hover-color" 		=> isset($attributes['authorColorHover']) ? $attributes['authorColorHover'] : "",
				];

                $post_grid .= sprintf(
                    '<div class="ub-block-post-grid-author" itemprop="author"><a class="ub-text-link" style="%3$s" href="%2$s" itemprop="url" rel="author"><span itemprop="name">%1$s</span></a></div>',
                    esc_html( get_the_author_meta( 'display_name', get_the_author_meta( 'ID' ) ) ),
					esc_html( get_author_posts_url( get_the_author_meta( 'ID' ) ) ),
					esc_attr( Ultimate_Blocks\includes\generate_css_string($styles) ),
                );
            }

            /* Get the post date */
            if ( isset( $attributes['checkPostDate'] ) && $attributes['checkPostDate'] ) {
				$styles = [
					"--ub-post-grid-date-color" 		=> isset($attributes['dateColor']) ? $attributes['dateColor'] : '',
					"--ub-post-grid-date-hover-color" 	=> isset($attributes['dateColorHover']) ? $attributes['dateColorHover'] : '',
				];

                $post_grid .= sprintf(
                    '<time datetime="%1$s" class="ub-block-post-grid-date" style="%3$s" itemprop="datePublished">%2$s</time>',
                    esc_attr( get_the_date( 'c', $post_id ) ),
					esc_html( get_the_date( '', $post_id ) ),
					esc_attr( Ultimate_Blocks\includes\generate_css_string($styles) ),
                );
            }

            /* Close the header content */
            $post_grid .= sprintf(
                '</header>'
            );

            /* Wrap the excerpt content */
            $post_grid .= sprintf(
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

            if ( isset( $attributes['checkPostExcerpt'] ) && $attributes['checkPostExcerpt'] && !empty( $excerpt )) {
				$styles = [
					"--ub-post-grid-excerpt-color" 			=> isset($attributes['excerptColor']) ? $attributes['excerptColor'] : "",
					"--ub-post-grid-excerpt-hover-color" 		=> isset($attributes['excerptColorHover']) ? $attributes['excerptColorHover'] : "",
				];

				$post_grid .= sprintf(
					'<div class="ub-block-post-grid-excerpt-text" style="%2$s">%1$s</div>',
					wp_kses_post( $excerpt ),
					esc_attr( Ultimate_Blocks\includes\generate_css_string($styles) ),
				);
            }

			$link_padding 		= Ultimate_Blocks\includes\get_spacing_css(!empty($attributes['linkPadding']) ? $attributes['linkPadding'] : array());
			$styles = array(
				"border-top-left-radius"					=> !empty($attributes['linkBorderRadius']['topLeft']) ? $attributes['linkBorderRadius']['topLeft'] : "",
				"border-top-right-radius"					=> !empty($attributes['linkBorderRadius']['topRight']) ? $attributes['linkBorderRadius']['topRight'] : "",
				"border-bottom-left-radius"					=> !empty($attributes['linkBorderRadius']['bottomLeft']) ? $attributes['linkBorderRadius']['bottomLeft'] : "",
				"border-bottom-right-radius"				=> !empty($attributes['linkBorderRadius']['bottomRight']) ? $attributes['linkBorderRadius']['bottomRight'] : "",
				"--ub-post-grid-link-background" 			=> Ultimate_Blocks\includes\get_background_color_var($attributes, 'linkBackgroundColor', 'linkBackgroundGradient'),
				"--ub-post-grid-link-color" 				=> isset($attributes['linkColor']) ? $attributes['linkColor'] : "",
				"--ub-post-grid-link-hover-background" 		=> Ultimate_Blocks\includes\get_background_color_var($attributes, 'linkBackgroundColorHover', 'linkBackgroundGradientHover'),
				"--ub-post-grid-link-hover-color" 			=> isset($attributes['linkColorHover']) ? $attributes['linkColorHover'] : "",
				"padding-top" 								=> isset($link_padding['top']) ? $link_padding['top'] : '',
				"padding-right" 							=> isset($link_padding['right']) ? $link_padding['right'] : '',
				"padding-bottom" 							=> isset($link_padding['bottom']) ? $link_padding['bottom'] : '',
				"padding-left" 								=> isset($link_padding['left']) ? $link_padding['left'] : '',
			);

            /* Get the read more link */
            if ( isset( $attributes['checkPostLink'] ) && $attributes['checkPostLink'] ) {
                $post_grid .= sprintf(
                    '<p><a class="ub-block-post-grid-more-link style="%4$s" ub-text-link" href="%1$s" rel="bookmark">%2$s <span class="screen-reader-text">%3$s</span></a></p>',
                    esc_url( get_permalink( $post_id ) ),
                    esc_html( $attributes['readMoreText'] ),
					esc_html( $title ),
					esc_attr( Ultimate_Blocks\includes\generate_css_string( $styles ) ),
                );
            }

            /* Close the excerpt content */
            $post_grid .= sprintf(
                '</div>'
            );

            /* Close the text content */
            $post_grid .= sprintf(
                '</div>'
            );

            /* Close the post */
            $post_grid .= "</article>\n";
        }

        /* Restore original post data */
        wp_reset_postdata();

        /* Build the block classes */
        $class = "wp-block-ub-post-grid ub-block-post-grid align". esc_attr($attributes['wrapAlignment']) ;

        if ( isset( $attributes['className'] ) ) {
            $class .= ' ' . esc_attr($attributes['className']) ;
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
            $grid_class .= ' columns-' . esc_attr($attributes['columns']) ;
        }

        /* Post grid section tag */

        $section_tag = 'section';
        $is_equal_height = isset($attributes['isEqualHeight']) && $attributes['isEqualHeight']  ? " is-equal-height " : "";
        $is_preserve_post_image_aspect_ratio = isset($attributes['preservePostImageAspectRatio']) && $attributes['preservePostImageAspectRatio']  ? " preserve-post-image-aspect-ratio " : "";

        /* Output the post markup */

		$grid_styles = [
			"row-gap" 		=> !empty($attributes['rowGap']) ? $attributes['rowGap'] : "32px",
			"column-gap"	=> !empty($attributes['columnGap']) ? $attributes['columnGap'] : "32px",
		];

		$padding			= Ultimate_Blocks\includes\get_spacing_css(!empty($attributes['padding']) ? $attributes['padding'] : array() );
		$margin 			= Ultimate_Blocks\includes\get_spacing_css(!empty($attributes['margin']) ? $attributes['margin'] : array() );
		$wrapper_spacing_styles = array(
			'padding-top'   	=> isset($padding['top']) ? $padding['top'] : "",
			'padding-left'  	=> isset($padding['left']) ? $padding['left'] : "",
			'padding-right' 	=> isset($padding['right']) ? $padding['right'] : "",
			'padding-bottom'	=> isset($padding['bottom']) ? $padding['bottom'] : "",
			'margin-top'    	=> !empty($margin['top']) ? $margin['top'] . " !important" : "",
			'margin-left'   	=> !empty($margin['left']) ? $margin['left'] . " !important" : "",
			'margin-right'  	=> !empty($margin['right']) ? $margin['right'] . " !important" : "",
			'margin-bottom' 	=> !empty($margin['bottom']) ? $margin['bottom'] . " !important" : "",
		);

        $block_content = sprintf(
            '<%1$s class="%2$s%5$s%6$s" style="%8$s"><div class="%3$s" style="%7$s">%4$s</div></%1$s>',
            $section_tag,
            esc_attr( $class ),
            esc_attr( $grid_class ),
            $post_grid,
            esc_attr($is_equal_height),
			$is_preserve_post_image_aspect_ratio,
			esc_attr(Ultimate_Blocks\includes\generate_css_string($grid_styles)),
			esc_attr(Ultimate_Blocks\includes\generate_css_string($wrapper_spacing_styles)),
        );

		return $block_content;
    }
}

function ub_register_post_grid_block() {
    if( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname( dirname(__DIR__) ) . '/defaults.php';
        register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/post-grid', array(
            'attributes' => $defaultValues['ub/post-grid']['attributes'],
            'render_callback' => 'ub_render_post_grid_block'));
    }
}

add_action( 'init', 'ub_register_post_grid_block' );

/**
 * Add image sizes
 */

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

function ub_blocks_get_image_src_landscape( $object, $field_name, $request ) {
    $feat_img_array = wp_get_attachment_image_src(
        $object['featured_media'],
        'full',
        false
    );
    return $feat_img_array ? $feat_img_array[0] : null;
}

function ub_blocks_get_author_info( $object,  $field_name, $request ) {
    /* Get the author name */
    $author_data['display_name'] = get_the_author_meta( 'display_name', $object['author'] );
    /* Get the author link */
    $author_data['author_link'] = get_author_posts_url( $object['author'] );
    /* Return the author data */
    return $author_data;
}
