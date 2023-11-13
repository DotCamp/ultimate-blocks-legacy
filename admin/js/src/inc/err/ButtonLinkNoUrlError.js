/**
 * ButtonLinkNoUrlError.
 */
function ButtonLinkNoUrlError() {
	this.name = 'ButtonLinkNoUrlError';
	this.message = 'No URL is provided for ButtonLink component.';
}

ButtonLinkNoUrlError.prototype = Object.create(Error.prototype);

/**
 * @module ContentNotFound
 */
export default ButtonLinkNoUrlError;
