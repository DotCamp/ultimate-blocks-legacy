<?php

function ub_render_call_to_action_block($attributes){
    extract($attributes);
    return '<div class="ub_call_to_action' . (isset($className) ? ' ' . esc_attr($className) : '') .
                '"' . ($blockID !== '' ? ' id="ub_call_to_action_' . $blockID . '"' :
                'style="background-color: ' . $ctaBackgroundColor . '; border-width: ' . $ctaBorderSize . 'px; border-color: ' . $ctaBorderColor . '"' ) . '>
                <div class="ub_call_to_action_headline">
                    <' . ($useHeadingTag ? $selectedHeadingTag : 'p') . ' class="ub_call_to_action_headline_text"' . ($blockID === '' ?
                    ' style="font-size: ' . $headFontSize . 'px; color: ' . $headColor . '; text-align: ' . $headAlign . ';"' : '') . '>' .
                        $ub_call_to_action_headline_text . '</' . ($useHeadingTag ? $selectedHeadingTag : 'p') . '></div>
                <div class="ub_call_to_action_content">
                    <p class="ub_cta_content_text"' .
                        ($blockID === '' ? ' style="font-size: ' . $contentFontSize . 'px; color: ' . $contentColor . '; text-align: ' . $contentAlign . ';"' : '') . '>' .
                         $ub_cta_content_text . '</p></div>
                <div class="ub_call_to_action_button">
                    <a href="' . esc_url($url) . '" target="_' . ($openInNewTab ? 'blank' : 'self' )
                        .'" rel="' . ($addNofollow ? 'nofollow ' : '') . ($linkIsSponsored ? 'sponsored ' : '') . 'noopener noreferrer"
                        class="ub_cta_button"' . ($blockID === '' ? ' style="background-color: ' . $buttonColor . '; width: ' . $buttonWidth . 'px;"' : '') . '>
                        <p class="ub_cta_button_text"' . ($blockID === '' ? ' style="color: ' .
                        $buttonTextColor . '; font-size: ' . $buttonFontSize . 'px;"' : '') . '>' .
                            $ub_cta_button_text . '</p></a></div></div>';
}

function ub_register_call_to_action_block() {
	if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/call-to-action-block', array(
            'attributes' => $defaultValues['ub/call-to-action-block']['attributes'],
			'render_callback' => 'ub_render_call_to_action_block'));
	}
}

add_action('init', 'ub_register_call_to_action_block');