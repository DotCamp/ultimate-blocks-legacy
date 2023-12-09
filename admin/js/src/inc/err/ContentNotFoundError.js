/**
 * ContentNotFoundError error.
 *
 * @param {string} contentKey target not found content key
 */
function ContentNotFoundError(contentKey) {
	this.name = 'ContentNotFoundError';
	this.message = `Content not found for key: [${contentKey}]`;
}

ContentNotFoundError.prototype = Object.create(Error.prototype);

/**
 * @module ContentNotFound
 */
export default ContentNotFoundError;
