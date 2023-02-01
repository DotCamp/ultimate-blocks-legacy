<?php

namespace Ultimate_Blocks\includes;

use Ultimate_Blocks\includes\common\traits\Manager_Base_Trait;
use function add_filter;

/**
 * Manager responsible for extra data to be used in client editor.
 */
class Editor_Data_Manager {
	use Manager_Base_Trait;

	/**
	 * Registered attributes of our plugin.
	 * @var array
	 */
	public $registered_plugin_block_attributes = [];

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		add_filter( 'register_block_type_args', [ $this, 'block_registered_args' ], 100, 2 );
		add_filter( 'ub/filter/priority-editor-data', [ $this, 'add_editor_data' ] );
	}

	/**
	 * Add data to editor
	 *
	 * @param array $editor_data editor data
	 *
	 * @return array editor data
	 */
	public function add_editor_data( $editor_data ) {
		$editor_data['blockAttributes'] = $this->registered_plugin_block_attributes;

		return $editor_data;
	}

	/**
	 * Callback for registered arguments of block types.
	 *
	 * @param array $args block arguments
	 * @param string $block_type block type id
	 *
	 * @return array filtered block arguments
	 */
	public function block_registered_args( $args, $block_type ) {
		if ( strpos( $block_type, 'ub/' ) === 0 ) {
			$plugin_block_attributes                                 = $args['attributes'];
			$this->registered_plugin_block_attributes[ $block_type ] = $plugin_block_attributes;
		}

		return $args;
	}
}


