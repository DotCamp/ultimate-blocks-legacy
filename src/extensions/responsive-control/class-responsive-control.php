<?php

use function Ultimate_Blocks\includes\is_undefined;

/**
 * Handle Responsive control frontend.
 */
class Ultimate_Blocks_Responsive_Control  {
    public function __construct(){
        // add_filter('register_block_type_args', array( $this, 'ub_add_settings' ), 10, 2);
        add_filter( "render_block", array( $this, 'ub_render_responsive_control' ), 10, 3 );
    }

    public function ub_add_settings($args, $name){
        if (strpos($name, 'ub/') === 0) {
            $extra_attributes = array(
                "isHideOnDesktop" => array(
                    "type" => "boolean",
                    "default" => false
                ),
                "isHideOnTablet" => array(
                    "type" => "boolean",
                    "default" => false
                ),
                "isHideOnMobile" => array(
                    "type" => "boolean",
                    "default" => false
                )
            );

            $args['attributes'] = array_merge($args['attributes'], $extra_attributes);
        }

        return $args;
    }

    public function ub_render_responsive_control($content, $block, $block_instance){
        // Check if the block name starts with 'ub/'
        $block_name = isset($block['blockName']) ? $block['blockName'] : "";
        if (strpos($block_name, 'ub/') !== 0) {
            return $content;
        }

        $attributes = isset($block['attrs']) ? $block['attrs'] : array();
        // Prepare classes based on attributes
        $classes = array();

        if (isset($attributes['isHideOnMobile']) && $attributes['isHideOnMobile']) {
            $classes[] = 'ub-hide-on-mobile';
        }
        if (isset($attributes['isHideOnTablet']) && $attributes['isHideOnTablet']) {
            $classes[] = 'ub-hide-on-tablet';
        }
        if (isset($attributes['isHideOnDesktop']) && $attributes['isHideOnDesktop']) {
            $classes[] = 'ub-hide-on-desktop';
        }

        // Remove empty classes
        $classes = array_filter($classes);
        
        // Find the first occurrence of the class attribute in the HTML content
        preg_match('/class=["\']([^"\']*)["\']/', $content, $matches);
        // If there are matches, update the first occurrence of the class attribute
        if (!empty($matches) && isset($matches[1])) {
            $existing_classes = explode(' ', $matches[1]);
            $new_classes = array_merge($existing_classes, $classes);
            $new_classes = array_unique($new_classes);
            $new_class_string = 'class="' . implode(' ', $new_classes) . '"';
            $content = preg_replace('/class=["\']([^"\']*)["\']/', $new_class_string, $content, 1);
        }
        // Return the modified content with wrapper attributes
        return $content;
    }
}
new Ultimate_Blocks_Responsive_Control();
