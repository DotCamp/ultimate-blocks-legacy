<?php


/**
 * Handle Responsive control frontend.
 */
class Ultimate_Blocks_Custom_CSS  {
    public function __construct(){
        add_filter( "render_block", array( $this, 'ub_render_custom_css' ), 10, 2 );
        
        // Rendering styles for header.
		add_action(
			'wp_head',
			function () {
				return $this->render_styles();
			}
		);

		// Rendering styles for footer.
		add_action(
			'wp_footer',
			function () {
				return $this->render_styles(true);
			}
		);
    }
    
     /**
      * Will minify the given css
      *
      * @param string $input css.
      * @return string Minified css
      */
     public function minify_css($input) {
          if (trim($input) === "") return $input;
              // Remove comments
               $css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $input);

               // Remove whitespaces
               $css = preg_replace('/\s+/', ' ', $css);
               $css = preg_replace('/\s*([:;{}])\s*/', '$1', $css);
               $css = preg_replace('/;}/', '}', $css);

               return $input;
     }
    /**
	 * Will recursively generate styles from a list of blocks.
	 *
	 * @param array $blocks - List of blocks.
	 *
	 * @return string - CSS Styling.
	 */
	public function generate_styles_from_blocks($blocks) {

		if (!is_array($blocks)) {
			return '';
		}

		$collected_styles = '';

		if (is_array($blocks)) {
			// Looping each block recursively.
			foreach ($blocks as $block) {
                    $attributes    = isset($block['attrs']) ? $block['attrs'] : array();
               
                    $custom_css    = isset($attributes['ubCustomCSS']) ? $attributes['ubCustomCSS'] : "";
				// Looping innerblocks recursively, if found.
				if (isset($block['innerBlocks'])) {
					$collected_styles .= $this->generate_styles_from_blocks($block['innerBlocks']);
				}

				if (!isset($block['blockName']) || is_null($block['blockName']) || empty($custom_css)) {
					continue;
				}
                    
				$block_unique_id       = $this->generate_ub_block_id(render_block( $block ), $block);
				$selector              = $this->replace_selector($custom_css, $block_unique_id);
				$collected_styles      .= $selector;
			}
		}

		return $this->minify_css($collected_styles);
	}
     /**
	 * This method is responsible to output ub styles, scoped to a post.
	 *
	 * @param bool $in_footer - True if enqueueing in the footer, otherwise false.
	 *
	 * @return void
	 */
	public function render_styles($in_footer = false) {

		$current_post_id = get_the_ID();
		$current_post    = get_post($current_post_id);
		if (is_null($current_post)) {
			return;
		}

		$generated_ub_styles = '';

		// Generating styles specifically for post content.
		$current_post_content = $current_post->post_content;

		// Skipping blocks styles for footer scope.
		if (false === $in_footer) {
			$parsed_blocks                = parse_blocks($current_post_content);
			$generated_ub_styles .= $this->generate_styles_from_blocks($parsed_blocks);
		}


		/**
		 * The generated CSS should not contain any html markup.
		 * Using regex to match and strip these html tags.
		 *
		 * WordPress is also using some regex to validate the CSS output.
		 *
		 * @see https://github.com/WordPress/WordPress/blob/56c162fbc9867f923862f64f1b4570d885f1ff03/wp-includes/customize/class-wp-customize-custom-css-setting.php#L157-L168
		 */
		if (preg_match('#</?\w+#', $generated_ub_styles)) {

			// Replacing all the matched tags.
			$generated_ub_styles = preg_replace('#</?\w+#', '', $generated_ub_styles);
		}

		if ('' !== $generated_ub_styles) {

			// Creating an style id based on the position.
			$styles_id_suffix = $in_footer ? '-footer' : '-header';

?>
			<style id="ub-generated-styles<?php echo $styles_id_suffix; ?>">
				<?php echo $generated_ub_styles; ?>
			</style>
<?php
		}
	}
     // Helper function to create a new ID for 'ub/' blocks
     public function convert_ub_block_id($block_name, $block_id) {
        // Replace '/' with '-'
        $cleaned_block_name = str_replace('/', '-', $block_name);

        // Combine cleaned block name and original block ID
        $new_id =  $cleaned_block_name . '-' . $block_id;

        return $new_id;
    }
    public function generate_ub_block_id($content, $block){
          $block_name    = isset($block['blockName']) ? $block['blockName'] : "";
          $attributes    = isset($block['attrs']) ? $block['attrs'] : array();
          $block_id      = isset($attributes['blockID']) ? $attributes['blockID'] : '';
          $final_id = '';
          // Match the first tag and extract the id attribute
          preg_match('/<(\w+)[^>]*(?:\s+id=["\']([^"\']*)["\'])?[^>]*>.*<\/\1>/i', $content, $matches);

          if (isset($matches[2])) {
               $final_id      = $matches[2];
          } else {
               $new_block_id  = $this->convert_ub_block_id($block_name, $block_id);
               $final_id      = $new_block_id;
          }


          return $final_id;
    }
    public function replace_selector($css, $block_id) {
          if (!is_string($css) && empty($css)) {
               return $css;
          }

          return preg_replace('/(\bselector\b)/', '#' . $block_id, $css);
     }

    	public function ub_render_custom_css($content, $block) {
		// Check if the block name starts with 'ub/'
		$block_name = isset($block['blockName']) ? $block['blockName'] : "";
		if (strpos($block_name, 'ub/') !== 0) {
			return $content;
		}

		$block_id = $this->generate_ub_block_id($content, $block);
		$updated_content = $content;

		// Pattern to match the first element and capture existing attributes
		preg_match('/(<[^>]+)/', $content, $matches_first_element);
		if(isset($matches_first_element[0]) && !empty($matches_first_element[0])){
			$pattern = '/id=("|\')(.*?)("|\')/i';
			preg_match($pattern, $matches_first_element[0], $matches);
			if (!isset($matches[2])) {
				$updated_content = preg_replace('/(<[^>]+)/', '$1 id="' . $block_id . '"', $content, 1);
			}
		}
		return $updated_content;
	}
}
new Ultimate_Blocks_Custom_CSS();
