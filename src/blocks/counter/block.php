<?php

require_once dirname(dirname(dirname(__DIR__))) . '/includes/ultimate-blocks-styles-css-generator.php';

class Ultimate_Counter {
     /**
      * Constructor
      * 
      * @return void
      */
     public function __construct(){
          add_action( 'init', array( $this, 'register_block' ) );
     }

     public function ub_get_counter_block_styles( $attributes ) {
          $padding = Ultimate_Blocks\includes\get_spacing_css( isset($attributes['padding']) ? $attributes['padding'] : array() );
          $margin = Ultimate_Blocks\includes\get_spacing_css( isset($attributes['margin']) ? $attributes['margin'] : array() );
          $counter_font_size = $attributes['counterFontSize'];
          $label_font_size = $attributes['labelFontSize'];
          $label_color = $attributes['labelColor'];

          $styles = array(
               '--ub-counter-padding-top'            => isset($padding['top']) ? $padding['top'] : "",
               '--ub-counter-padding-left'           => isset($padding['left']) ? $padding['left'] : "",
               '--ub-counter-padding-right'          => isset($padding['right']) ? $padding['right'] : "",
               '--ub-counter-padding-bottom'         => isset($padding['bottom']) ? $padding['bottom'] : "",
               '--ub-counter-margin-top'             => isset($margin['top']) ? $margin['top']  : "",
               '--ub-counter-margin-right'           => isset($margin['left']) ? $margin['left']  : "",
               '--ub-counter-margin-bottom'          => isset($margin['right']) ? $margin['right']  : "",
               '--ub-counter-margin-left'            => isset($margin['bottom']) ? $margin['bottom']  : "",
               '--ub-counter-font-size'              => $counter_font_size,
               '--ub-counter-label-font-size'        => $label_font_size,
               '--ub-counter-label-color'            => $label_color
          );

	     return Ultimate_Blocks\includes\generate_css_string( $styles );
     }
     /**
	 * Build the CSS style.
	 *
	 * @param array  $attributes The borders.
	 * @return string The CSS style string.
	 */
     public function ub_get_generated_styles($attributes){
         
          $styles = '';
          if(!empty($counter_font_size)){
               $styles .= '--ub-counter-font-size:' . $counter_font_size . ';';
          }
          if(!empty($label_font_size)){
               $styles .= '--ub-counter-label-font-size:' . $label_font_size . ';';
          }
          return $styles;
     }
     
     /**
      * Render callback for the Ultimate Counter block.
      *
      * @param array $attributes The block's attributes, which control its behavior and appearance.
      * @param string $content The inner content of the block.
      *
      * @return string The HTML markup that represents the rendered block.
      */
     public function ub_render_counter_block($attributes, $content, $block){
          $start_number = $attributes['startNumber'];
          $end_number = $attributes['endNumber'];
          $prefix = $attributes['prefix'];
          $suffix = $attributes['suffix'];
          $animation_duration = $attributes['animationDuration'];
          $alignment = $attributes['alignment'];
          $label = $attributes['label'];
          $label_position = $attributes['labelPosition'];
          $styles = $this->ub_get_counter_block_styles($block->parsed_block['attrs']);
          
          $wrapper_attributes = get_block_wrapper_attributes(
               array(
                    'class' => 'ub_counter-container',
                    'style' => $styles
               )
          );
          $label_markup = '<div class="ub_counter-label-wrapper"><span class="ub_counter-label">' . $label . '</span></div>';
          $block_content = sprintf(
               '<div %1$s>
                    <div
                         class="ub_counter ub_text-%2$s"
                         data-start_num="%3$s"
                         data-end_num="%4$s"
                         data-animation_duration="%5$s"
                    >
                         %8$s
                         <div class="ub_counter-number-wrapper">
                              <span class="ub_counter-prefix">%6$s</span>
                              <span class="ub_counter-number">0</span>
                              <span class="ub_counter-suffix">%7$s</span>
                         </div>
                         %9$s
                    </div>
               </div>',
               $wrapper_attributes, // 1
               esc_attr( $alignment ), // 2
               esc_attr( $start_number ), // 3
               esc_attr( $end_number ), // 4
               esc_attr( $animation_duration ), // 5
               esc_html( $prefix ), // 6
               esc_html( $suffix ), // 7
               $label_position === 'top' ? $label_markup : "", //8 
               $label_position === 'bottom' ? $label_markup : "" //9 
          );

          return $block_content;
     }
     public function register_block() {
          require dirname(dirname(__DIR__)) . '/defaults.php';

          wp_register_script(
			'ub-counter-frontend-script',
			plugins_url( 'counter/front.build.js', dirname( __FILE__ ) ),
			array(),
			Ultimate_Blocks_Constants::plugin_version(),
			true
          );
          register_block_type_from_metadata( dirname(dirname(dirname(__DIR__))) . '/dist/blocks/counter', array(
               'attributes' => $defaultValues['ub/counter']['attributes'],
               'render_callback' => array($this, 'ub_render_counter_block')
          ));
     }
     
}
new Ultimate_Counter();
