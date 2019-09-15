<?php

/**
 * Enqueue frontend script for content toggle block
 *
 * @return void
 */
function ub_content_toggle_add_frontend_assets() {
    if ( has_block( 'ub/content-toggle' ) or has_block('ub/content-toggle-panel') or
        has_block( 'ub/content-toggle-block' ) or has_block('ub/content-toggle-panel-block') ) {
        wp_enqueue_script(
            'ultimate_blocks-content-toggle-front-script',
            plugins_url( 'content-toggle/front.build.js', dirname( __FILE__ ) ),
            array(  ),
            Ultimate_Blocks_Constants::plugin_version(),
            true
        );
    }
}

if ( !class_exists( 'simple_html_dom_node' ) ) {
    require dirname( dirname( __DIR__ ) ) . '/simple_html_dom.php';
}

function ub_render_content_toggle_block($attributes, $content){
    $classNamePrefix = 'wp-block-ub-content-toggle';
    extract($attributes);
    $rawContent = str_get_html('<div class="tempcontainer">'.$content.'</div>');

    $panelSelector = '.tempcontainer>.' . $classNamePrefix . '-accordion';
    $titleBarSelector = $panelSelector . '>.' . $classNamePrefix . '-accordion-title-wrap';
    $titleElemSelector = $titleBarSelector . '>.' . $classNamePrefix . '-accordion-title';
    $panel = $rawContent->find($panelSelector);

    if($blockID!=''){
        foreach($panel as $elem){
            $elem->style=null;
        }
        foreach($rawContent->find($titleBarSelector) as $titleBar){
            $titleBar->style=null;
        }
        foreach($rawContent->find($titleElemSelector) as $titleElem){
            $titleElem->style=null;
        }
    }

    return '<div class="wp-block-ub-content-toggle'.(isset($className) ? ' ' . esc_attr($className) : '')
                .'" '. ($blockID == '' ? '' : 'id="ub-content-toggle-'.$blockID.'"').'>'
                .$rawContent->find("div", 0)->innertext.'</div>';
}

function ub_render_content_toggle_panel_block($attributes, $content){
    $classNamePrefix = 'wp-block-ub-content-toggle';
    extract($attributes);

    return '<div class="'.$classNamePrefix.'-accordion'.(isset($className) ? ' ' . esc_attr($className) : '').'" style="border-color: '.$theme.';">
                <div class="'.$classNamePrefix.'-accordion-title-wrap" style="background-color: '.$theme.';">
                    <span class="'.$classNamePrefix.'-accordion-title" style="color:'.$titleColor.';">'.$panelTitle.'</span>
                    <span class="'.$classNamePrefix.
                        '-accordion-state-indicator dashicons dashicons-arrow-right-alt2 '.
                        ($collapsed ? '' : 'open').'"></span>
                </div><div class="'.$classNamePrefix.'-accordion-content-wrap'.
                        ($collapsed?' ub-hide':'').'">'. $content
                .'</div></div>' ;
}

function ub_register_content_toggle_panel_block() {
	if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
		register_block_type( 'ub/content-toggle-panel-block', array(
            'attributes' => $defaultValues['ub/content-toggle-panel-block']['attributes'],
			'render_callback' => 'ub_render_content_toggle_panel_block'));
	}
}

function ub_register_content_toggle_block() {
	if ( function_exists( 'register_block_type' ) ) {
        require dirname(dirname(__DIR__)) . '/defaults.php';
        register_block_type( 'ub/content-toggle-block',
            array('attributes' => $defaultValues['ub/content-toggle-block']['attributes'],
             'render_callback' => 'ub_render_content_toggle_block'));
	}
}

add_action('init', 'ub_register_content_toggle_block');

add_action('init', 'ub_register_content_toggle_panel_block');

add_action( 'wp_enqueue_scripts', 'ub_content_toggle_add_frontend_assets' );

add_filter( 'render_block', 'ub_content_toggle_filter', 10, 3);



function ub_content_toggle_filter( $block_content, $block ) {
     
    if( "ub/content-toggle-block" != $block['blockName'] ) {
        return $block_content;
    }
    
    $output = $block_content;

    if(isset($block['attrs']['hasFAQSchema'])){
        $parsedBlockContent = str_get_html(preg_replace('/^<div class="wp-block-ub-content-toggle(?: [^>]*)?" id="ub-content-toggle-.*?">/',
        '<div class="toggleroot">', $block_content));    

        $panel = $parsedBlockContent->find('.toggleroot>.wp-block-ub-content-toggle-accordion>.wp-block-ub-content-toggle-accordion-content-wrap');

        foreach($panel as $elem){
            //look for possible nested content toggles and remove existing ones
            foreach($elem->find('.wp-block-ub-content-toggle') as $nestedToggle){
                $nestedToggle->outertext='';
            }
            foreach($elem->find('script[type="application/ld+json"]') as $nestedToggle){
                $nestedToggle->outertext='';
            }
        }

        $panel = array_map(function($elem){
            return $elem->innertext;
        }, $panel);

        $questions = "";

        foreach($block['innerBlocks'] as $key => $togglePanel){
            if(array_key_exists($key, $panel)){
                $answer = preg_replace_callback('/<([a-z1-6]+)[^>]*?>[^<]*?<\/(\1)>/i', function($matches){
                    return (in_array($matches[1], ['script', 'svg', 'iframe', 'applet', 'map',
                        'audio', 'button', 'table', 'datalist', 'form', 'frameset',
                        'select', 'optgroup', 'picture', 'style', 'video']) ? '' : $matches[0]);
                }, $panel[$key]);

                $answer = preg_replace_callback('/<\/?([a-z1-6]+).*?\/?>/i', function($matches){
                    if(in_array($matches[1], ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'br', 'ol',
                                        'ul', 'li', 'p', 'div', 'b', 'strong', 'i', 'em', 'u', 'del'])){
                        return $matches[0];
                    }
                    else{
                        $replacement = '';
                        if ($matches[1] == 'ins'){
                            $replacement = 'u';
                        }
                        elseif ($matches[1] == 'big') {
                            $replacement = 'strong';
                        }
                        elseif ($matches[1] == 'q'){
                            $replacement = 'p';
                        }
                        elseif ($matches[1] == 'dir'){
                            $replacement = 'ul';
                        }
                        elseif ($matches[1] == 'address' || $matches[1] == 'cite'){
                            $replacement = 'em';
                        }
                        elseif (in_array($matches[1], ['article', 'aside', 'blockquote', 'details', 'dialog', 'figure',
                                                'figcaption', 'footer', 'header', 'nav', 'pre', 'section', 'textarea'])){
                            $replacement = 'div';
                        }
    
                        return ($replacement == '' ? '' : str_replace($matches[1], $replacement, $matches[0]));
                    }
                }, $answer);
    
                while(preg_match_all('/<([a-z1-6]+)[^>]*?><\/(\1)>/i', $answer) > 0){ //remove empty tags and tags that only contain empty tags
                    $answer = preg_replace('/<([a-z1-6]+)[^>]*?><\/(\1)>/i', '', $answer);
                }
    
                //check all attributes
    
                $answer = preg_replace_callback('/<[a-z1-6]+( (?:(?:aria|data)-[^\t\n\f \/>"\'=]+|[a-z]+)=[\'"][\s\S]+?[\'"])>/i',
                    function($matches){
                        $attributeList = preg_replace_callback('/ ([\S]+)=([\'"])([\s\S]*?)(\2)/', function($matches){
                            return $matches[1] == 'href' ? (" href='" . $matches[3] . "'"): '';
                        }, $matches[1]);
                        return str_replace($matches[1], $attributeList, $matches[0]);
                }, $answer);
    
                if($answer != "" && $togglePanel['attrs']['panelTitle'] != ''){ //blank answers and questions are invalid
                    if($questions != ""){
                        $questions .= ',' . PHP_EOL;
                    }
                    $questions .= '{
                        "@type": "Question",
                        "name": "'.$togglePanel['attrs']['panelTitle'].'",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "'.trim($answer).'"
                        }
                    }';
                }


            }

        }
        $output .= '<script type="application/ld+json">{
            "@context":"http://schema.org/",
            "@type":"FAQPage",
            "mainEntity": [' .  $questions . ']}</script>';
    }

  return $output;
}
