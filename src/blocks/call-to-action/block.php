<?php

function ub_render_call_to_action_block($attributes){
    extract($attributes);
    $classes = array( 'ub_call_to_action' );

    $block_wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class' => implode(' ', $classes),
		)
    );

	if (!in_array($selectedHeadingTag, ['h2', 'h3', 'h4', 'h5', 'h6'])) {
		$selectedHeadingTag = 'h2';
	}

    return '<div ' . $block_wrapper_attributes . ' ' . ($blockID !== '' ? ' id="ub_call_to_action_' . esc_attr($blockID) . '"' :
                'style="background-color: ' . esc_attr($ctaBackgroundColor) . '; border-width: ' . esc_attr($ctaBorderSize) . 'px; border-color: ' . esc_attr($ctaBorderColor) . '"' ) . '>
                <div class="ub_call_to_action_headline">
                    <' . ($useHeadingTag ? esc_attr($selectedHeadingTag) : 'p') . ' class="ub_call_to_action_headline_text"' . ($blockID === '' ?
                    ' style="font-size: ' . esc_attr($headFontSize) . 'px; color: ' . esc_attr($headColor) . '; text-align: ' . esc_attr($headAlign) . ';"' : '') . '>' .
                        wp_kses_post($ub_call_to_action_headline_text) . '</' . ($useHeadingTag ? esc_attr($selectedHeadingTag) : 'p') . '></div>
                <div class="ub_call_to_action_content">
                    <p class="ub_cta_content_text"' .
                        ($blockID === '' ? ' style="font-size: ' . esc_attr($contentFontSize) . 'px; color: ' . esc_attr($contentColor) . '; text-align: ' . esc_attr($contentAlign) . ';"' : '') . '>' .
                         wp_kses_post($ub_cta_content_text) . '</p></div>
                <div class="ub_call_to_action_button">
                    <a href="' . esc_url($url) . '" target="_' . ($openInNewTab ? 'blank' : 'self' )
                        .'" rel="' . ($addNofollow ? 'nofollow ' : '') . ($linkIsSponsored ? 'sponsored ' : '') . 'noopener noreferrer"
                        class="ub_cta_button"' . ($blockID === '' ? ' style="background-color: ' . esc_attr($buttonColor) . '; width: ' . esc_attr($buttonWidth) . 'px;"' : '') . '>
                        <p class="ub_cta_button_text"' . ($blockID === '' ? ' style="color: ' .
                        $buttonTextColor . '; font-size: ' . esc_attr($buttonFontSize) . 'px;"' : '') . '>' .
                            wp_kses_post($ub_cta_button_text) . '</p></a></div></div>';
}

function ub_register_call_to_action_block() {
	if ( function_exists( 'register_block_type_from_metadata' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/call-to-action', array(
            'attributes' => $defaultValues['ub/call-to-action-block']['attributes'],
			'render_callback' => 'ub_render_call_to_action_block'));
	}
}

add_action('init', 'ub_register_call_to_action_block');
