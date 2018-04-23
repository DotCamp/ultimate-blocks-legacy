/* eslint-disable */

if (window.ultimate_blocks) {

	window.ultimate_blocks.forEach( block => {
		if(!block.active) {
			var in_use = $('.wp-block-' + block.name.replace('/', '-')).length > 0;
			if(!in_use) {
				wp.blocks.unregisterBlockType(block.name);
			}
		}
	});

}
